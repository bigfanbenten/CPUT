-- ==============================================================================
-- CƠM PHẦN ÚT TRINH — SCRIPT ROLLBACK CHÍNH XÁC 1:1 VỀ 33 POLICIES GỐC
-- Website: https://www.comphanuttrinh.online
-- ------------------------------------------------------------------------------
-- MỤC ĐÍCH: Khôi phục chính xác 100% hiện trạng ban đầu (33 policies) nếu cần hủy bỏ
-- toàn bộ thay đổi của Phase 5 mà không làm gián đoạn bất kỳ chức năng nào.
-- ==============================================================================

BEGIN;

-- 1. XÓA BẢNG VÀ CÁC HÀM MỚI TẠO Ở PHASE 5/6 NẾU CÓ
DROP FUNCTION IF EXISTS public.process_acp_pin_attempt(TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS public.check_acp_pin_lock(TEXT);
DROP FUNCTION IF EXISTS public.record_acp_pin_attempt(TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS public.increment_daily_visitor();
DROP FUNCTION IF EXISTS public.cast_poll_vote(TEXT);
DROP FUNCTION IF EXISTS public.increment_site_views();
DROP TABLE IF EXISTS public.acp_pin_security;

-- 2. DỌN DẸP CÁC POLICY ADMIN CỦA PHASE 5 NẾU ĐÃ TẠO
DROP POLICY IF EXISTS "dishes_public_read" ON public.dishes;
DROP POLICY IF EXISTS "dishes_admin_all" ON public.dishes;
DROP POLICY IF EXISTS "hero_slides_public_read" ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides_admin_all" ON public.hero_slides;
DROP POLICY IF EXISTS "quick_menu_public_read" ON public.quick_menu;
DROP POLICY IF EXISTS "quick_menu_admin_all" ON public.quick_menu;
DROP POLICY IF EXISTS "guestbook_public_read_approved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_public_insert_unapproved" ON public.guestbook;
DROP POLICY IF EXISTS "guestbook_admin_all" ON public.guestbook;
DROP POLICY IF EXISTS "notifications_public_read" ON public.notifications;
DROP POLICY IF EXISTS "notifications_admin_all" ON public.notifications;
DROP POLICY IF EXISTS "site_stats_public_read" ON public.site_stats;
DROP POLICY IF EXISTS "site_stats_admin_all" ON public.site_stats;
DROP POLICY IF EXISTS "daily_visitor_stats_admin_all" ON public.daily_visitor_stats;

-- 3. KHÔI PHỤC ĐÚNG 1:1 THEO DANH SÁCH 33 POLICIES GỐC

-- daily_visitor_stats (1 policy)
DROP POLICY IF EXISTS "daily_visitor_stats_public_read" ON public.daily_visitor_stats;
CREATE POLICY "daily_visitor_stats_public_read" ON public.daily_visitor_stats 
    FOR SELECT TO anon, authenticated USING (true);

-- dishes (6 policies)
CREATE POLICY "All access dishes" ON public.dishes FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép sửa món ăn" ON public.dishes FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép thêm món ăn" ON public.dishes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Cho phép xóa món ăn" ON public.dishes FOR DELETE TO public USING (true);
CREATE POLICY "Public Full Access Dishes" ON public.dishes FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read dishes" ON public.dishes FOR SELECT TO public USING (true);

-- guestbook (5 policies)
CREATE POLICY "Allow public delete" ON public.guestbook FOR DELETE TO public USING (true);
CREATE POLICY "Allow public insert" ON public.guestbook FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read approved" ON public.guestbook FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update" ON public.guestbook FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Guestbook" ON public.guestbook FOR ALL TO public USING (true) WITH CHECK (true);

-- hero_slides (6 policies)
CREATE POLICY "All access slides" ON public.hero_slides FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép sửa banner" ON public.hero_slides FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép thêm banner" ON public.hero_slides FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Cho phép xóa banner" ON public.hero_slides FOR DELETE TO public USING (true);
CREATE POLICY "Public Full Access Hero" ON public.hero_slides FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read slides" ON public.hero_slides FOR SELECT TO public USING (true);

-- notifications (5 policies)
CREATE POLICY "Cho phép sửa công khai" ON public.notifications FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép thêm công khai" ON public.notifications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Cho phép xóa công khai" ON public.notifications FOR DELETE TO public USING (true);
CREATE POLICY "Cho phép đọc công khai" ON public.notifications FOR SELECT TO public USING (true);
CREATE POLICY "Public Full Access Notifications" ON public.notifications FOR ALL TO public USING (true) WITH CHECK (true);

-- quick_menu (3 policies)
CREATE POLICY "Cho phép admin toàn quyền" ON public.quick_menu FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép mọi người xem" ON public.quick_menu FOR SELECT TO public USING (true);
CREATE POLICY "Public Full Access QuickMenu" ON public.quick_menu FOR ALL TO public USING (true) WITH CHECK (true);

-- site_stats (7 policies)
CREATE POLICY "Allow public insert site_stats" ON public.site_stats FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read and update" ON public.site_stats FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read site_stats" ON public.site_stats FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update site_stats" ON public.site_stats FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép mọi người ghi site_stats" ON public.site_stats FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép mọi người đọc site_stats" ON public.site_stats FOR SELECT TO public USING (true);
CREATE POLICY "Public Full Access SiteStats" ON public.site_stats FOR ALL TO public USING (true) WITH CHECK (true);

COMMIT;
