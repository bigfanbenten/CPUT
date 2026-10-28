-- ==============================================================================
-- CƠM PHẦN ÚT TRINH — MIGRATION AN TOÀN (SECURITY CORRECTED)
-- BẢN THIẾT KẾ ĐỀ XUẤT CHO GIAI ĐOẠN 3.1: FESTIVAL ACTIVATION SYSTEM
-- Website: https://www.comphanuttrinh.online
-- ==============================================================================
-- 
-- NGUYÊN TẮC AN TOÀN CỐT LÕI:
-- 1. TUYỆT ĐỐI KHÔNG HARDCODE MÃ PIN HAY SECRET VÀO SQL HOẶC FRONTEND.
-- 2. XÁC MINH DANH TÍNH ADMIN Ở CẤP DATABASE QUA SUPABASE AUTH (JWT auth.uid()).
-- 3. KHÁCH VÃNG LAI (anon): CHỈ CÓ QUYỀN ĐỌC (SELECT) CỘT active_festival.
-- 4. KHÁCH VÃNG LAI: BỊ CHẶN TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP GHI (NO UPDATE/INSERT/DELETE).
-- 5. THAO TÁC CỦA ADMIN CHỈ CẬP NHẬT RIÊNG active_festival, KHÔNG THAY ĐỔI
--    CÁC TRƯỜNG THỐNG KÊ (total_views, poll_yes_votes, poll_no_votes...).
-- 6. TÍNH NGUYÊN TỬ (IDEMPOTENT): CÓ THỂ CHẠY LẠI NHIỀU LẦN MÀ KHÔNG GÂY LỖI.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- BƯỚC 1: BỔ SUNG CỘT ACTIVE_FESTIVAL VÀ RÀNG BUỘC CHECK
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_stats 
ADD COLUMN IF NOT EXISTS active_festival TEXT DEFAULT 'default';

-- Ràng buộc chỉ chấp nhận các giá trị sự kiện hợp lệ
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'site_stats_active_festival_check'
    ) THEN
        ALTER TABLE public.site_stats 
        ADD CONSTRAINT site_stats_active_festival_check 
        CHECK (active_festival IN ('default', 'halloween', 'christmas', 'newyear'));
    END IF;
END $$;

-- Khởi tạo giá trị mặc định cho bản ghi id = 1 nếu đang là NULL
UPDATE public.site_stats 
SET active_festival = 'default' 
WHERE id = 1 AND (active_festival IS NULL OR active_festival = '');

-- ------------------------------------------------------------------------------
-- BƯỚC 2: CẤU HÌNH ROW LEVEL SECURITY (RLS) TRÊN BẢNG SITE_STATS
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- 2.1. Quyền ĐỌC: Khách vãng lai (anon) và Admin (authenticated) đều đọc được
DROP POLICY IF EXISTS "site_stats_safe_public_read" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_read_all" ON public.site_stats;

CREATE POLICY "site_stats_safe_public_read" ON public.site_stats 
    FOR SELECT TO public USING (true);

-- 2.2. Xóa bỏ các chính sách UPDATE công khai cũ (nếu có)
DROP POLICY IF EXISTS "site_stats_public_update" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_anon_update" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_admin_all" ON public.site_stats;

-- ------------------------------------------------------------------------------
-- BƯỚC 3: HÀM CẬP NHẬT SỰ KIỆN AN TOÀN XÁC THỰC QUA SUPABASE AUTH
-- ------------------------------------------------------------------------------
-- Hàm này CHỈ cho phép tài khoản đã đăng nhập Supabase Auth (authenticated) thực thi.
-- Không nhận mã PIN dạng text. Danh tính được lấy tự động từ JWT qua auth.uid().
-- Chỉ sửa đúng cột active_festival của row 1, bảo vệ toàn vẹn các cột thống kê.
CREATE OR REPLACE FUNCTION public.set_active_festival(
    p_festival TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_valid_festivals TEXT[] := ARRAY['default', 'halloween', 'christmas', 'newyear'];
    v_caller_uid UUID;
    v_caller_email TEXT;
BEGIN
    -- 1. Kiểm tra xác thực Supabase Auth
    v_caller_uid := auth.uid();
    IF v_caller_uid IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Từ chối: Yêu cầu đăng nhập tài khoản quản trị (Supabase Auth).'
        );
    END IF;

    -- Lấy email người gọi từ token JWT
    v_caller_email := auth.jwt() ->> 'email';

    -- 2. Kiểm tra tính hợp lệ của giá trị sự kiện
    IF NOT (p_festival = ANY(v_valid_festivals)) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Từ chối: Sự kiện không hợp lệ. Chỉ chấp nhận: default, halloween, christmas, newyear.'
        );
    END IF;

    -- 3. Cập nhật CHỈ cột active_festival (Cách ly hoàn toàn total_views và poll votes)
    UPDATE public.site_stats 
    SET active_festival = p_festival 
    WHERE id = 1;

    IF NOT FOUND THEN
        INSERT INTO public.site_stats (id, total_views, active_festival)
        VALUES (1, 1621, p_festival);
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'active_festival', p_festival,
        'updated_by', coalesce(v_caller_email, v_caller_uid::text),
        'updated_at', now()
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- BƯỚC 4: THU HỒI VÀ PHÂN QUYỀN THỰC THI (EXECUTE PRIVILEGES)
-- ------------------------------------------------------------------------------
-- Tước quyền hoàn toàn của PUBLIC và anon (người dùng chưa đăng nhập)
REVOKE ALL ON FUNCTION public.set_active_festival(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_active_festival(TEXT) FROM anon;

-- Chỉ cấp quyền gọi RPC cho tài khoản đã xác thực danh tính (authenticated)
GRANT EXECUTE ON FUNCTION public.set_active_festival(TEXT) TO authenticated;

COMMIT;

-- ==============================================================================
-- KẾT THÚC BẢN THIẾT KẾ MIGRATION PROMPT #3.1
-- ==============================================================================
