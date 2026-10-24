# CƠM PHẦN ÚT TRINH — BẢN SNAPSHOT ĐẦY ĐỦ & HƯỚNG DẪN KHÔI PHỤC (RESTORE GUIDE)
**Website:** https://www.comphanuttrinh.online  
**Phiên bản snapshot:** `v1.0.0-final-acp-hardened`  
**Ngày đóng gói:** 23/10/2026  
**Trạng thái kiểm định:** Build Passed (100%), ESLint Passed (0 errors).

---

## 1. TỔNG QUAN BẢN LƯU TRỮ (LATEST SNAPSHOT)

Bản lưu trữ này chứa toàn bộ mã nguồn Frontend, kịch bản Migration Database Supabase, và Supabase Edge Function đã được thẩm định an toàn cao nhất:

1. **Frontend (React 19 + TypeScript + Vite + Tailwind CSS):**
   - **Trang chủ (`HomePage`):** Thực đơn cơm phần, giỏ hàng, tính calories, danh mục món ăn, tìm kiếm, Cinematic Hero banner (tối ưu tải từ Cloudinary), Trình phát nhạc Random-First 360+ bài và Khảo sát bình chọn.
   - **Bảng quản trị bí mật (`AdminPanel`):** Truy cập qua Hash Routing bí mật (`/#ACP1122`), được bảo vệ 2 lớp bằng **Mã PIN 6 số** và **Supabase Auth Session**.
   - **Cơ chế xác thực an toàn (Fail-Closed):** Gọi Edge Function `verify-acp-pin` qua `supabase.functions.invoke` và đính kèm đầy đủ header `apikey` & `Authorization: Bearer <anonKey>` hợp lệ tới Kong Gateway. Callback `onAuthStateChange` đồng bộ hoàn toàn (loại bỏ deadlock GoTrue SDK). Màn hình ACP giữ khóa 100% trong suốt quá trình xác minh và chỉ mở khi `supabase.auth.getUser()` xác thực thành công trực tiếp với server và UID khớp chính xác tài khoản quản trị.

2. **Hạ tầng Cơ sở Dữ liệu (Supabase PostgreSQL):**
   - Bảng an ninh: `public.acp_pin_security` (quản lý số lần thử sai, khóa IP lũy tiến).
   - Bảng chống spam: `public.public_rpc_rate_limits` (giới hạn tần suất gọi RPC công khai).
   - Cơ chế khóa nguyên tử: Sử dụng **PostgreSQL Transaction-level Advisory Locks** (`pg_advisory_xact_lock`) để triệt tiêu race condition khi có request đồng thời kể cả khi bản ghi chưa tồn tại.
   - Bảo mật RPC: Hàm nội bộ `get_request_client_ip()` bị thu hồi toàn bộ quyền EXECUTE khỏi `PUBLIC`, `anon`, `authenticated`; chỉ chấp nhận `cf-connecting-ip` từ hạ tầng tin cậy.
   - 33 Policies RLS được chuẩn hóa: Đóng toàn bộ quyền ALL/UPDATE/DELETE công khai, chỉ cho phép admin có UID khớp thực hiện ghi/sửa/xóa.

3. **Kịch bản Khôi phục Khẩn cấp (Safe Rollback):**
   - `supabase/migrations/20261022_acp_security_rollback_safe.sql` cho phép đưa hệ thống về trạng thái safe public read ngay lập tức mà **tuyệt đối không DROP bảng hay hàm** phụ trợ, bảo vệ tính liên tục của hệ thống.

---

## 2. DANH MỤC TỆP TIN QUAN TRỌNG (FILE INVENTORY)

| Phân hệ | Đường dẫn | Chức năng |
| :--- | :--- | :--- |
| **Giao diện & Logic** | `/index.tsx` | Entrypoint ứng dụng, điều hướng hash ACP, modal PIN 6 số, xác thực admin session, trang chủ & admin panel. |
| **Cấu hình & Hằng số** | `/constants.tsx` | Danh mục món ăn ban đầu, cấu hình hệ thống, UID quản trị dự kiến. |
| **Danh mục nhạc** | `/musicCatalog.ts` | Danh mục 360+ bài nhạc nền bản quyền sạch. |
| **Kiểu dữ liệu** | `/types.ts` | Định nghĩa TypeScript types cho món ăn, banner, giỏ hàng, poll, stats. |
| **Giao diện món ăn** | `/components/MenuCard.tsx` | Component hiển thị thẻ món ăn trên thực đơn. |
| **Chi tiết món ăn** | `/components/DishModal.tsx` | Modal xem chi tiết món ăn, hình ảnh, dinh dưỡng. |
| **Dịch vụ Supabase** | `/services/supabaseService.ts` | Helper client kết nối Supabase API. |
| **Dịch vụ Gemini** | `/services/geminiService.ts` | Helper tích hợp tính toán thông minh. |
| **Migration Database** | `/supabase/migrations/20261022_acp_security_phase5.sql` | Kịch bản SQL kích hoạt RLS, tạo RPC atomic lock, bảng PIN security và rate limits. |
| **Safe Rollback SQL** | `/supabase/migrations/20261022_acp_security_rollback_safe.sql` | Kịch bản hoàn tác an toàn, khôi phục quyền đọc công khai mà không xóa bảng/hàm. |
| **Rollback SQL** | `/supabase/migrations/20261022_acp_security_rollback.sql` | Kịch bản rollback dự phòng ban đầu. |
| **Edge Function** | `/supabase/functions/verify-acp-pin/index.ts` | Mã nguồn xác thực mã PIN 6 số, kiểm tra khóa IP qua RPC, cấp access token Supabase Auth. |
| **Biến môi trường** | `/.env.example` | Mẫu cấu hình biến môi trường (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EXPECTED_ADMIN_UID`). |
| **Cấu hình dự án** | `/package.json`, `/vite.config.ts`, `/tsconfig.json` | Cấu hình Node.js dependencies, Vite bundler, TypeScript compiler. |

---

## 3. HƯỚNG DẪN KHÔI PHỤC (RESTORE PROCEDURES)

### Trường hợp 1: Khôi phục mã nguồn Frontend từ ZIP
1. Giải nén toàn bộ tệp tin ZIP vào thư mục làm việc mới.
2. Mở terminal tại thư mục gốc và cài đặt gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo tệp `.env` dựa theo `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_EXPECTED_ADMIN_UID=your-actual-admin-uid
   ```
4. Chạy kiểm tra mã nguồn:
   ```bash
   npm run lint
   npm run build
   ```
5. Khởi động môi trường phát triển cục bộ:
   ```bash
   npm run dev
   ```

---

### Trường hợp 2: Khôi phục hoặc Thiết lập lại Database Supabase
Nếu cần thiết lập lại bảo mật hoặc áp dụng trên môi trường mới:
1. Mở **Supabase Dashboard** -> chọn **SQL Editor**.
2. Mở file `supabase/migrations/20261022_acp_security_phase5.sql`.
3. Thay thế placeholder `'<ACTUAL_ADMIN_UID>'` bằng UID thực tế của tài khoản quản trị (tạo trong `auth.users`).
4. Nhấn **Run** để thực thi migration.

---

### Trường hợp 3: Hoàn tác khẩn cấp về chế độ an toàn (Emergency Safe Rollback)
Nếu cần đưa hệ thống về trạng thái xem công khai mà không gián đoạn bất kỳ tính năng nào:
1. Mở **Supabase Dashboard** -> **SQL Editor**.
2. Sao chép toàn bộ nội dung file `supabase/migrations/20261022_acp_security_rollback_safe.sql`.
3. Nhấn **Run**. Toàn bộ chính sách SELECT công khai được khôi phục, các bảng/hàm phụ trợ vẫn được giữ nguyên vẹn để các tính năng lượt xem/bình chọn hoạt động bình thường.

---

### Trường hợp 4: Khôi phục Supabase Edge Function (`verify-acp-pin`)
1. Cài đặt Supabase CLI trên máy:
   ```bash
   npm install -g supabase
   ```
2. Đăng nhập và liên kết dự án:
   ```bash
   supabase login
   supabase link --project-ref <your-project-id>
   ```
3. Cài đặt các secret bắt buộc trong Supabase Dashboard -> **Edge Functions** -> **Secrets**:
   - `ACP_PIN_HASH`: Chuỗi bcrypt hash của PIN 6 số (chuẩn $2a$, $2b$, $2y$, sinh bởi bcrypt với cost 10).
   - `ACP_ADMIN_EMAIL`: Email tài khoản quản trị nội bộ.
   - `ACP_ADMIN_PASSWORD`: Mật khẩu tài khoản quản trị nội bộ.
   - `ACP_EXPECTED_ADMIN_UID`: UID của tài khoản quản trị.
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key bí mật.
4. Triển khai hàm:
   ```bash
   supabase functions deploy verify-acp-pin --no-verify-jwt
   ```

---

## 4. XÁC NHẬN AN TOÀN
- Bản snapshot này lưu giữ trọn vẹn 100% cấu trúc, logic, và trạng thái bảo mật của hệ thống.
- Tuyệt đối chưa có bất kỳ thay đổi nào được tự ý áp dụng lên Supabase Production hay môi trường thực tế.
