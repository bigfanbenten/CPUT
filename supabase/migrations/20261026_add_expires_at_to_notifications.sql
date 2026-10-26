-- ====================================================================
-- MIGRATION: ADD EXPIRES_AT COLUMN TO NOTIFICATIONS TABLE
-- PROJECT: CƠM PHẦN ÚT TRINH
-- PURPOSE: Auto-expiration for homepage announcements
-- ====================================================================

-- 1. Bổ sung cột expires_at (cho phép NULL để tương thích tuyệt đối với thông báo cũ)
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NULL;

-- 2. Chỉ mục hỗ trợ truy vấn thông báo đang bật và thời hạn nhanh chóng
CREATE INDEX IF NOT EXISTS idx_notifications_is_active_expires_at 
ON public.notifications (is_active, expires_at);

-- Ghi chú cho Admin:
-- Chạy đoạn mã trên trong Supabase Dashboard -> SQL Editor -> Run
