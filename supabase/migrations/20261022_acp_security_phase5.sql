-- ==============================================================================
-- CƠM PHẦN ÚT TRINH — GIAI ĐOẠN 5: ACP SECURITY MIGRATION (BẢN DỰ KIẾN)
-- Website: https://www.comphanuttrinh.online
-- ------------------------------------------------------------------------------
-- LƯU Ý QUAN TRỌNG:
-- 1. FILE NÀY CHỈ ĐỂ CHUẨN BỊ VÀ THẨM ĐỊNH. TUYỆT ĐỐI CHƯA CHẠY TRÊN PRODUCTION.
-- 2. Quản trị viên cần thay thế '<ACTUAL_ADMIN_UID>' bằng UID thật của tài khoản
--    quản trị nội bộ được tạo trong Supabase Auth (auth.users).
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. HẠ TẦNG AN NINH MÃ PIN (RATE LIMITING & ATOMIC LOCKING)
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.acp_pin_security (
    id SERIAL PRIMARY KEY,
    client_ip TEXT NOT NULL UNIQUE,
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Khóa bảng acp_pin_security không cho public đọc/ghi trực tiếp
ALTER TABLE public.acp_pin_security ENABLE ROW LEVEL SECURITY;
-- Chỉ service_role mới có quyền truy cập bảng này (Edge Function chạy bằng service_role)

-- Bảng lưu lịch sử giới hạn tần suất gọi RPC công khai (Anti-Spam Rate Limits)
CREATE TABLE IF NOT EXISTS public.public_rpc_rate_limits (
    rate_key TEXT NOT NULL,
    action_type TEXT NOT NULL,
    last_action_at TIMESTAMPTZ NOT NULL DEFAULT '1970-01-01 00:00:00Z',
    PRIMARY KEY (rate_key, action_type)
);
ALTER TABLE public.public_rpc_rate_limits ENABLE ROW LEVEL SECURITY;

-- Hàm trích xuất IP an toàn từ Request Headers của Supabase PostgREST (Nội bộ)
-- CHỈ tin tưởng cf-connecting-ip do Cloudflare gán tại Edge; không dùng header do client tự gửi
CREATE OR REPLACE FUNCTION public.get_request_client_ip()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    v_headers JSON;
    v_ip TEXT;
BEGIN
    BEGIN
        v_headers := current_setting('request.headers', true)::json;
        IF v_headers IS NOT NULL THEN
            -- Chỉ chấp nhận cf-connecting-ip từ hạ tầng mạng tin cậy (Cloudflare)
            v_ip := v_headers->>'cf-connecting-ip';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_ip := NULL;
    END;
    RETURN trim(v_ip);
END;
$$;

-- Thu hồi quyền EXECUTE của hàm nội bộ khỏi PUBLIC, anon và authenticated
REVOKE ALL ON FUNCTION public.get_request_client_ip() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_request_client_ip() FROM anon;
REVOKE ALL ON FUNCTION public.get_request_client_ip() FROM authenticated;

-- Hàm xử lý mã PIN và quản lý khóa NGUYÊN TỬ (Atomic PIN & Lock Processing)
-- Chống race condition và tuyệt đối KHÔNG cho PIN đúng reset bộ đếm hoặc mở phiên khi đang bị khóa
CREATE OR REPLACE FUNCTION public.process_acp_pin_attempt(p_ip TEXT, p_pin_matches BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_rec RECORD;
    v_fails INT := 0;
    v_lock_mins INT := 0;
    v_remaining_in_tier INT := 5;
    v_remaining_secs INT := 0;
    v_is_locked BOOLEAN := false;
BEGIN
    -- Khóa giao dịch phân tán cấp advisory lock theo IP để tuần tự hóa triệt để yêu cầu đồng thời
    PERFORM pg_advisory_xact_lock(hashtext('acp_pin_' || p_ip));

    -- Khởi tạo hàng nếu IP chưa từng xuất hiện (ON CONFLICT DO NOTHING)
    INSERT INTO public.acp_pin_security (client_ip, failed_attempts, last_attempt_at)
    VALUES (p_ip, 0, now())
    ON CONFLICT (client_ip) DO NOTHING;

    -- Khóa hàng (FOR UPDATE) để tuần tự hóa mọi yêu cầu đồng thời từ cùng IP
    SELECT * INTO v_rec 
    FROM public.acp_pin_security 
    WHERE client_ip = p_ip 
    FOR UPDATE;

    -- 1. KIỂM TRA TRẠNG THÁI KHÓA HIỆN TẠI
    -- Nếu IP đang bị khóa: TUYỆT ĐỐI KHÔNG cho phép PIN đúng reset bộ đếm hoặc mở phiên
    IF v_rec.locked_until IS NOT NULL AND v_rec.locked_until > now() THEN
        v_remaining_secs := EXTRACT(EPOCH FROM (v_rec.locked_until - now()))::INT;
        RETURN jsonb_build_object(
            'allowed', false,
            'is_locked', true,
            'remaining_seconds', v_remaining_secs,
            'failed_attempts', v_rec.failed_attempts
        );
    END IF;

    -- 2. IP KHÔNG BỊ KHÓA (HOẶC ĐÃ HẾT THỜI GIAN KHÓA)
    IF p_pin_matches THEN
        -- PIN ĐÚNG: Reset bộ đếm thất bại và xóa thời gian khóa
        UPDATE public.acp_pin_security 
        SET failed_attempts = 0, locked_until = NULL, last_attempt_at = now()
        WHERE client_ip = p_ip;

        RETURN jsonb_build_object(
            'allowed', true,
            'is_locked', false,
            'remaining_seconds', 0,
            'failed_attempts', 0
        );
    ELSE
        -- PIN SAI: Tăng số lần thử thất bại
        v_fails := v_rec.failed_attempts + 1;

        -- Quy tắc bậc khóa lũy tiến:
        -- 5 lần: 10 phút (600 giây)
        -- 10 lần: 60 phút (3600 giây)
        -- 15 lần: 120 phút (7200 giây)
        -- 20 lần: 240 phút (14400 giây)
        -- >= 25 lần (mỗi 5 lần tiếp theo): 600 phút (36000 giây)
        IF v_fails = 5 THEN v_lock_mins := 10;
        ELSIF v_fails = 10 THEN v_lock_mins := 60;
        ELSIF v_fails = 15 THEN v_lock_mins := 120;
        ELSIF v_fails = 20 THEN v_lock_mins := 240;
        ELSIF v_fails >= 25 AND (v_fails % 5 = 0) THEN v_lock_mins := 600;
        END IF;

        IF v_lock_mins > 0 THEN
            v_is_locked := true;
            v_remaining_secs := v_lock_mins * 60;
            UPDATE public.acp_pin_security 
            SET failed_attempts = v_fails,
                locked_until = now() + (v_lock_mins || ' minutes')::INTERVAL,
                last_attempt_at = now()
            WHERE client_ip = p_ip;

            RETURN jsonb_build_object(
                'allowed', false,
                'is_locked', true,
                'remaining_seconds', v_remaining_secs,
                'lock_duration_mins', v_lock_mins,
                'failed_attempts', v_fails,
                'remaining_attempts_in_tier', 0
            );
        ELSE
            UPDATE public.acp_pin_security 
            SET failed_attempts = v_fails,
                last_attempt_at = now()
            WHERE client_ip = p_ip;

            v_remaining_in_tier := 5 - (v_fails % 5);
            IF v_remaining_in_tier = 5 THEN v_remaining_in_tier := 0; END IF;

            RETURN jsonb_build_object(
                'allowed', false,
                'is_locked', false,
                'remaining_seconds', 0,
                'failed_attempts', v_fails,
                'remaining_attempts_in_tier', v_remaining_in_tier
            );
        END IF;
    END IF;
END;
$$;

-- Thu hồi quyền thực thi từ PUBLIC, anon và authenticated
REVOKE ALL ON FUNCTION public.process_acp_pin_attempt(TEXT, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.process_acp_pin_attempt(TEXT, BOOLEAN) FROM anon;
REVOKE ALL ON FUNCTION public.process_acp_pin_attempt(TEXT, BOOLEAN) FROM authenticated;

-- Chỉ cấp quyền thực thi cho service_role (Edge Function sử dụng service_role_key)
GRANT EXECUTE ON FUNCTION public.process_acp_pin_attempt(TEXT, BOOLEAN) TO service_role;


-- ------------------------------------------------------------------------------
-- 2. CÁC HÀM RPC AN TOÀN CHO TRANG CHỦ (VỚI CHỐNG SPAM PHÍA MÁY CHỦ)
-- ------------------------------------------------------------------------------

-- RPC: Tăng số khách truy cập ngày (Server tính ngày theo múi giờ VN + Rate-limit per IP per day nguyên tử)
CREATE OR REPLACE FUNCTION public.increment_daily_visitor()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_today_str TEXT := to_char((now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM-DD');
    v_ip TEXT;
    v_rate_key TEXT;
    v_last_time TIMESTAMPTZ;
BEGIN
    v_ip := public.get_request_client_ip();
    
    -- Chống spam lặp lại: Nếu trích xuất được IP tin cậy, mỗi IP chỉ được tính 1 lần trong 1 giờ
    -- Sử dụng transaction advisory lock kết hợp FOR UPDATE để tuần tự hóa tuyệt đối mọi request đồng thời
    -- kể cả khi bản ghi rate-limit chưa từng tồn tại
    IF v_ip IS NOT NULL AND length(v_ip) > 0 THEN
        v_rate_key := encode(digest(v_ip || '_daily_' || v_today_str, 'sha256'), 'hex');
        
        -- Khóa giao dịch cấp phân tán (advisory lock) theo hash của rate key
        PERFORM pg_advisory_xact_lock(hashtext(v_rate_key));

        INSERT INTO public.public_rpc_rate_limits (rate_key, action_type, last_action_at)
        VALUES (v_rate_key, 'daily_visitor', '1970-01-01 00:00:00Z')
        ON CONFLICT (rate_key, action_type) DO NOTHING;

        SELECT last_action_at INTO v_last_time 
        FROM public.public_rpc_rate_limits 
        WHERE rate_key = v_rate_key AND action_type = 'daily_visitor'
        FOR UPDATE;

        IF v_last_time IS NOT NULL AND (now() - v_last_time) < INTERVAL '60 minutes' THEN
            RETURN; -- Bị giới hạn tần suất, thoát ngay mà không tăng số đếm
        END IF;

        UPDATE public.public_rpc_rate_limits 
        SET last_action_at = now()
        WHERE rate_key = v_rate_key AND action_type = 'daily_visitor';
    END IF;

    INSERT INTO public.daily_visitor_stats (date, visitor_count)
    VALUES (v_today_str, 1)
    ON CONFLICT (date) DO UPDATE 
    SET visitor_count = public.daily_visitor_stats.visitor_count + 1;
END;
$$;

-- RPC: Khách bình chọn nhạc an toàn (chỉ nhận 'yes'/'no', chống spam tần suất bằng IP hash nguyên tử)
CREATE OR REPLACE FUNCTION public.cast_poll_vote(p_option TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_yes INT;
    v_no INT;
    v_ip TEXT;
    v_rate_key TEXT;
    v_last_time TIMESTAMPTZ;
BEGIN
    IF p_option NOT IN ('yes', 'no') THEN
        RAISE EXCEPTION 'Lựa chọn không hợp lệ. Chỉ chấp nhận yes hoặc no.';
    END IF;

    v_ip := public.get_request_client_ip();

    -- Chống spam tự động gọi RPC dồn dập (mỗi IP tối thiểu cách nhau 15 giây)
    -- Sử dụng transaction advisory lock kết hợp FOR UPDATE để tuần tự hóa tuyệt đối
    IF v_ip IS NOT NULL AND length(v_ip) > 0 THEN
        v_rate_key := encode(digest(v_ip || '_poll_vote', 'sha256'), 'hex');

        -- Khóa giao dịch cấp phân tán (advisory lock) theo hash của rate key
        PERFORM pg_advisory_xact_lock(hashtext(v_rate_key));

        INSERT INTO public.public_rpc_rate_limits (rate_key, action_type, last_action_at)
        VALUES (v_rate_key, 'poll_vote', '1970-01-01 00:00:00Z')
        ON CONFLICT (rate_key, action_type) DO NOTHING;

        SELECT last_action_at INTO v_last_time 
        FROM public.public_rpc_rate_limits 
        WHERE rate_key = v_rate_key AND action_type = 'poll_vote'
        FOR UPDATE;

        IF v_last_time IS NOT NULL AND (now() - v_last_time) < INTERVAL '15 seconds' THEN
            -- Bị giới hạn tần suất: trả về số vote hiện tại mà không tăng thêm
            SELECT poll_yes_votes, poll_no_votes INTO v_yes, v_no FROM public.site_stats WHERE id = 1;
            RETURN jsonb_build_object('yes', v_yes, 'no', v_no, 'throttled', true);
        END IF;

        UPDATE public.public_rpc_rate_limits 
        SET last_action_at = now()
        WHERE rate_key = v_rate_key AND action_type = 'poll_vote';
    END IF;

    IF p_option = 'yes' THEN
        UPDATE public.site_stats 
        SET poll_yes_votes = COALESCE(poll_yes_votes, 0) + 1 
        WHERE id = 1
        RETURNING poll_yes_votes, poll_no_votes INTO v_yes, v_no;
    ELSE
        UPDATE public.site_stats 
        SET poll_no_votes = COALESCE(poll_no_votes, 0) + 1 
        WHERE id = 1
        RETURNING poll_yes_votes, poll_no_votes INTO v_yes, v_no;
    END IF;

    RETURN jsonb_build_object('yes', v_yes, 'no', v_no);
END;
$$;

-- RPC: Tăng lượt xem website an toàn (Chống spam tự động tăng lượt xem từ 1 IP nguyên tử)
CREATE OR REPLACE FUNCTION public.increment_site_views()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_views INT;
    v_ip TEXT;
    v_rate_key TEXT;
    v_last_time TIMESTAMPTZ;
BEGIN
    v_ip := public.get_request_client_ip();

    -- Chống spam cào lượt xem (mỗi IP tối thiểu cách nhau 10 giây mới tính 1 lượt xem mới)
    -- Sử dụng transaction advisory lock kết hợp FOR UPDATE để tuần tự hóa tuyệt đối
    IF v_ip IS NOT NULL AND length(v_ip) > 0 THEN
        v_rate_key := encode(digest(v_ip || '_site_views', 'sha256'), 'hex');

        -- Khóa giao dịch cấp phân tán (advisory lock) theo hash của rate key
        PERFORM pg_advisory_xact_lock(hashtext(v_rate_key));

        INSERT INTO public.public_rpc_rate_limits (rate_key, action_type, last_action_at)
        VALUES (v_rate_key, 'site_views', '1970-01-01 00:00:00Z')
        ON CONFLICT (rate_key, action_type) DO NOTHING;

        SELECT last_action_at INTO v_last_time 
        FROM public.public_rpc_rate_limits 
        WHERE rate_key = v_rate_key AND action_type = 'site_views'
        FOR UPDATE;

        IF v_last_time IS NOT NULL AND (now() - v_last_time) < INTERVAL '10 seconds' THEN
            SELECT total_views INTO v_views FROM public.site_stats WHERE id = 1;
            RETURN v_views;
        END IF;

        UPDATE public.public_rpc_rate_limits 
        SET last_action_at = now()
        WHERE rate_key = v_rate_key AND action_type = 'site_views';
    END IF;

    UPDATE public.site_stats
    SET total_views = COALESCE(total_views, 0) + 1
    WHERE id = 1
    RETURNING total_views INTO v_views;
    RETURN v_views;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_daily_visitor() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cast_poll_vote(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_site_views() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.increment_daily_visitor() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cast_poll_vote(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_site_views() TO anon, authenticated;


-- ------------------------------------------------------------------------------
-- 3. XỬ LÝ 33 RLS POLICIES HIỆN TẠI (DỌN DẸP POLICIES RỘNG & THIẾT LẬP CHUẨN)
-- ------------------------------------------------------------------------------

-- === BẢNG 1: DISHES ===
DROP POLICY IF EXISTS "All access dishes" ON public.dishes;
DROP POLICY IF EXISTS "Cho phép sửa món ăn" ON public.dishes;
DROP POLICY IF EXISTS "Cho phép thêm món ăn" ON public.dishes;
DROP POLICY IF EXISTS "Cho phép xóa món ăn" ON public.dishes;
DROP POLICY IF EXISTS "Public Full Access Dishes" ON public.dishes;
DROP POLICY IF EXISTS "Public read dishes" ON public.dishes;
DROP POLICY IF EXISTS "dishes_public_read" ON public.dishes;
DROP POLICY IF EXISTS "dishes_admin_all" ON public.dishes;

CREATE POLICY "dishes_public_read" ON public.dishes 
    FOR SELECT TO public USING (true);

CREATE POLICY "dishes_admin_all" ON public.dishes 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

-- === BẢNG 2: HERO_SLIDES ===
DROP POLICY IF EXISTS "All access slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Cho phép sửa banner" ON public.hero_slides;
DROP POLICY IF EXISTS "Cho phép thêm banner" ON public.hero_slides;
DROP POLICY IF EXISTS "Cho phép xóa banner" ON public.hero_slides;
DROP POLICY IF EXISTS "Public Full Access Hero" ON public.hero_slides;
DROP POLICY IF EXISTS "Public read slides" ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides_public_read" ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides_admin_all" ON public.hero_slides;

CREATE POLICY "hero_slides_public_read" ON public.hero_slides 
    FOR SELECT TO public USING (true);

CREATE POLICY "hero_slides_admin_all" ON public.hero_slides 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

-- === BẢNG 3: QUICK_MENU ===
DROP POLICY IF EXISTS "Cho phép admin toàn quyền" ON public.quick_menu;
DROP POLICY IF EXISTS "Public Full Access QuickMenu" ON public.quick_menu;
DROP POLICY IF EXISTS "Cho phép mọi người xem" ON public.quick_menu;
DROP POLICY IF EXISTS "quick_menu_public_read" ON public.quick_menu;
DROP POLICY IF EXISTS "quick_menu_admin_all" ON public.quick_menu;

CREATE POLICY "quick_menu_public_read" ON public.quick_menu 
    FOR SELECT TO public USING (true);

CREATE POLICY "quick_menu_admin_all" ON public.quick_menu 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

-- === BẢNG 4: GUESTBOOK ===
DROP POLICY IF EXISTS "Allow public delete" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public update" ON public.guestbook;
DROP POLICY IF EXISTS "Public Full Access Guestbook" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public insert" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public read approved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_public_read_approved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_public_insert_unapproved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_admin_all" ON public.guestbook;

-- Khách chỉ được đọc những bài đã duyệt (loại trừ cả bài chưa duyệt lẫn NULL)
CREATE POLICY "guestbook_public_read_approved" ON public.guestbook 
    FOR SELECT TO public USING (is_approved IS TRUE);

-- Khách được gửi góp ý mới, nhưng bắt buộc is_approved phải là false hoặc null
CREATE POLICY "guestbook_public_insert_unapproved" ON public.guestbook 
    FOR INSERT TO public WITH CHECK (is_approved IS FALSE OR is_approved IS NULL);

-- Quản trị viên xem tất cả, duyệt bài và xóa bài
CREATE POLICY "guestbook_admin_all" ON public.guestbook 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

-- === BẢNG 5: NOTIFICATIONS ===
DROP POLICY IF EXISTS "Cho phép sửa công khai" ON public.notifications;
DROP POLICY IF EXISTS "Cho phép thêm công khai" ON public.notifications;
DROP POLICY IF EXISTS "Cho phép xóa công khai" ON public.notifications;
DROP POLICY IF EXISTS "Public Full Access Notifications" ON public.notifications;
DROP POLICY IF EXISTS "Cho phép đọc công khai" ON public.notifications;
DROP POLICY IF EXISTS "notifications_public_read" ON public.notifications;
DROP POLICY IF EXISTS "notifications_admin_all" ON public.notifications;

-- Khách chỉ đọc thông báo active (loại trừ false và NULL)
CREATE POLICY "notifications_public_read" ON public.notifications 
    FOR SELECT TO public USING (is_active IS TRUE);

-- Quản trị viên toàn quyền
CREATE POLICY "notifications_admin_all" ON public.notifications 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

-- === BẢNG 6: SITE_STATS ===
DROP POLICY IF EXISTS "Allow public insert site_stats" ON public.site_stats;
DROP POLICY IF EXISTS "Allow public read and update" ON public.site_stats;
DROP POLICY IF EXISTS "Allow public update site_stats" ON public.site_stats;
DROP POLICY IF EXISTS "Cho phép mọi người ghi site_stats" ON public.site_stats;
DROP POLICY IF EXISTS "Public Full Access SiteStats" ON public.site_stats;
DROP POLICY IF EXISTS "Allow public read site_stats" ON public.site_stats;
DROP POLICY IF EXISTS "Cho phép mọi người đọc site_stats" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_public_read" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_admin_all" ON public.site_stats;

-- Khách chỉ được SELECT (thao tác bình chọn và lượt xem đi qua RPC)
CREATE POLICY "site_stats_public_read" ON public.site_stats 
    FOR SELECT TO public USING (true);

-- Quản trị viên toàn quyền sửa cấu hình ACP
CREATE POLICY "site_stats_admin_all" ON public.site_stats 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

-- === BẢNG 7: DAILY_VISITOR_STATS ===
DROP POLICY IF EXISTS "daily_visitor_stats_public_read" ON public.daily_visitor_stats;
DROP POLICY IF EXISTS "daily_visitor_stats_admin_all" ON public.daily_visitor_stats;

-- Khách và admin đều được đọc dữ liệu ngày
CREATE POLICY "daily_visitor_stats_public_read" ON public.daily_visitor_stats 
    FOR SELECT TO public USING (true);

-- Quản trị viên toàn quyền
CREATE POLICY "daily_visitor_stats_admin_all" ON public.daily_visitor_stats 
    FOR ALL TO authenticated 
    USING (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid)
    WITH CHECK (auth.uid() = '<ACTUAL_ADMIN_UID>'::uuid);

COMMIT;
