-- ==============================================================================
-- CƠM PHẦN ÚT TRINH — SCRIPT ROLLBACK AN TOÀN (SAFE ROLLBACK)
-- Website: https://www.comphanuttrinh.online
-- ------------------------------------------------------------------------------
-- MỤC ĐÍCH: 
-- Trong trường hợp cần hoàn tác phân quyền admin, script này đưa chính sách RLS
-- về trạng thái an toàn:
-- 1. Cho phép khách xem dữ liệu công khai trên Trang chủ (SELECT public).
-- 2. Cho phép gửi góp ý chờ duyệt (INSERT with is_approved is false/null).
-- 3. TUYỆT ĐỐI KHÔNG mở lại các policy ALL, UPDATE, DELETE công khai.
-- 4. TUYỆT ĐỐI KHÔNG DROP các bảng hoặc hàm phụ trợ (như rate limits/RPCs)
--    để không gây lỗi phụ thuộc (dependency breakage) cho các tiến trình đang chạy.
-- ==============================================================================

BEGIN;

-- === BẢNG 1: DISHES ===
DROP POLICY IF EXISTS "dishes_admin_all" ON public.dishes;
DROP POLICY IF EXISTS "dishes_public_read" ON public.dishes;
DROP POLICY IF EXISTS "dishes_safe_public_read" ON public.dishes;

CREATE POLICY "dishes_safe_public_read" ON public.dishes 
    FOR SELECT TO public USING (true);

-- === BẢNG 2: HERO_SLIDES ===
DROP POLICY IF EXISTS "hero_slides_admin_all" ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides_public_read" ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides_safe_public_read" ON public.hero_slides;

CREATE POLICY "hero_slides_safe_public_read" ON public.hero_slides 
    FOR SELECT TO public USING (true);

-- === BẢNG 3: QUICK_MENU ===
DROP POLICY IF EXISTS "quick_menu_admin_all" ON public.quick_menu;
DROP POLICY IF EXISTS "quick_menu_public_read" ON public.quick_menu;
DROP POLICY IF EXISTS "quick_menu_safe_public_read" ON public.quick_menu;

CREATE POLICY "quick_menu_safe_public_read" ON public.quick_menu 
    FOR SELECT TO public USING (true);

-- === BẢNG 4: GUESTBOOK ===
DROP POLICY IF EXISTS "guestbook_admin_all" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_public_read_approved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_public_insert_unapproved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_safe_public_read" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_safe_public_insert" ON public.guestbook;

-- Khách chỉ đọc bài đã duyệt (loại trừ bài chờ duyệt và NULL)
CREATE POLICY "guestbook_safe_public_read" ON public.guestbook 
    FOR SELECT TO public USING (is_approved IS TRUE);

-- Khách gửi góp ý với trạng thái mặc định chưa duyệt
CREATE POLICY "guestbook_safe_public_insert" ON public.guestbook 
    FOR INSERT TO public WITH CHECK (is_approved IS FALSE OR is_approved IS NULL);

-- === BẢNG 5: NOTIFICATIONS ===
DROP POLICY IF EXISTS "notifications_admin_all" ON public.notifications;
DROP POLICY IF EXISTS "notifications_public_read" ON public.notifications;
DROP POLICY IF EXISTS "notifications_safe_public_read" ON public.notifications;

-- Khách chỉ đọc thông báo active (loại trừ FALSE và NULL)
CREATE POLICY "notifications_safe_public_read" ON public.notifications 
    FOR SELECT TO public USING (is_active IS TRUE);

-- === BẢNG 6: SITE_STATS ===
DROP POLICY IF EXISTS "site_stats_admin_all" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_public_read" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_safe_public_read" ON public.site_stats;

CREATE POLICY "site_stats_safe_public_read" ON public.site_stats 
    FOR SELECT TO public USING (true);

-- === BẢNG 7: DAILY_VISITOR_STATS ===
DROP POLICY IF EXISTS "daily_visitor_stats_admin_all" ON public.daily_visitor_stats;
DROP POLICY IF EXISTS "daily_visitor_stats_public_read" ON public.daily_visitor_stats;
DROP POLICY IF EXISTS "daily_visitor_stats_safe_public_read" ON public.daily_visitor_stats;

CREATE POLICY "daily_visitor_stats_safe_public_read" ON public.daily_visitor_stats 
    FOR SELECT TO public USING (true);

COMMIT;
