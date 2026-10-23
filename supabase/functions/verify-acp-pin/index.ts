import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

/**
 * CƠM PHẦN ÚT TRINH — SUPABASE EDGE FUNCTION: verify-acp-pin (PHASE 6 HARDENED)
 * -----------------------------------------------------------------------------
 * Các cải tiến bảo mật Phase 6:
 * 1. Kiểm soát khóa và ghi nhận nguyên tử trong 1 RPC duy nhất (chống race condition).
 * 2. Không cho phép PIN đúng reset bộ đếm hoặc cấp session khi IP đang bị khóa.
 * 3. Fail-Closed: Bất kỳ lỗi RPC/hệ thống nào đều lập tức từ chối cấp phiên.
 * 4. Bắt buộc có ACP_EXPECTED_ADMIN_UID, đối chiếu nghiêm ngặt trước khi trả token.
 * 5. Từ chối yêu cầu nếu không trích xuất được IP tin cậy (không fallback 127.0.0.1).
 * 6. Giới hạn CORS chặt chẽ đúng các origin thực tế (không wildcard vercel/run.app).
 */

const STRICT_ALLOWED_ORIGINS = [
  "https://www.comphanuttrinh.online",
  "https://comphanuttrinh.online",
  "http://localhost:3000",
  "http://localhost:5173"
];

function getStrictCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = STRICT_ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : STRICT_ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400"
  };
}

serve(async (req) => {
  const corsHeaders = getStrictCorsHeaders(req);

  // Xử lý preflight CORS OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // 1. Trích xuất IP tin cậy từ hạ tầng Cloudflare/Supabase Edge
    const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip");
    if (!clientIp || clientIp.trim() === "") {
      console.warn("Từ chối: Không thể xác định địa chỉ IP tin cậy từ hạ tầng mạng.");
      return new Response(JSON.stringify({ error: "Từ chối truy cập: Không thể xác định địa chỉ IP tin cậy." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Parse payload
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Dữ liệu yêu cầu không hợp lệ (JSON parse error)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { pin } = body;

    // 3. Xác thực định dạng PIN: đúng 6 chữ số
    if (!pin || typeof pin !== "string" || !/^\d{6}$/.test(pin)) {
      return new Response(JSON.stringify({ error: "Mã PIN phải gồm chính xác đúng 6 chữ số." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 4. Kiểm tra cấu hình Secrets bắt buộc (Fail-Closed)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const adminEmail = Deno.env.get("ACP_INTERNAL_ADMIN_EMAIL");
    const adminPassword = Deno.env.get("ACP_INTERNAL_ADMIN_PASSWORD");
    const pinHash = Deno.env.get("ACP_PIN_HASH");
    const expectedAdminUid = Deno.env.get("ACP_EXPECTED_ADMIN_UID");

    if (!supabaseUrl || !supabaseServiceKey || !adminEmail || !adminPassword || !pinHash || !expectedAdminUid) {
      console.error("LỖI CẤU HÌNH NGHIÊM TRỌNG: Thiếu các biến môi trường bắt buộc (bao gồm ACP_EXPECTED_ADMIN_UID).");
      return new Response(JSON.stringify({ error: "Lỗi cấu hình máy chủ bảo mật. Yêu cầu quản trị viên kiểm tra Edge Secrets." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 5. So sánh mã PIN với Bcrypt hash
    const isMatch = await bcrypt.compare(pin, pinHash);

    // 6. Xử lý khóa và ghi nhận NGUYÊN TỬ trong một RPC duy nhất (Atomic Process)
    // RPC này kiểm tra khóa trước: Nếu đang bị khóa, tuyệt đối KHÔNG cấp quyền hay reset bộ đếm!
    const { data: procResult, error: procErr } = await supabaseAdmin.rpc("process_acp_pin_attempt", {
      p_ip: clientIp.trim(),
      p_pin_matches: isMatch
    });

    // Fail-Closed: Nếu RPC gặp lỗi, từ chối cấp phiên ngay lập tức
    if (procErr || !procResult) {
      console.error("Lỗi RPC process_acp_pin_attempt (Fail-Closed kích hoạt):", procErr);
      return new Response(JSON.stringify({ error: "Lỗi hệ thống khi xác thực an ninh. Vui lòng thử lại sau." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Nếu IP đang bị khóa (hoặc vừa chạm ngưỡng khóa mới)
    if (procResult.is_locked) {
      const remainingSecs = procResult.remaining_seconds || 600;
      return new Response(JSON.stringify({
        error: `Hệ thống tạm khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau ${remainingSecs} giây.`,
        remaining_seconds: remainingSecs,
        is_locked: true
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Nếu mã PIN sai
    if (!procResult.allowed) {
      const remainingAttempts = procResult.remaining_attempts_in_tier ?? 4;
      return new Response(JSON.stringify({
        error: `Mã PIN không chính xác. Bạn còn ${remainingAttempts} lần thử trước khi bị khóa.`,
        remaining_attempts: remainingAttempts
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 7. Mã PIN chính xác và không bị khóa: Cấp phiên Auth chính thức từ GoTrue Admin API
    const { data: authData, error: authErr } = await supabaseAdmin.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (authErr || !authData.session || !authData.user) {
      console.error("Lỗi GoTrue khi đăng nhập tài khoản quản trị nội bộ:", authErr);
      return new Response(JSON.stringify({ error: "Xác thực PIN thành công nhưng không thể cấp phiên Auth. Vui lòng thử lại." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 8. Đối chiếu nghiêm ngặt UID quản trị thực tế với ACP_EXPECTED_ADMIN_UID (Fail-Closed)
    if (authData.user.id !== expectedAdminUid.trim()) {
      console.error("BÁO ĐỘNG AN NINH: UID người dùng vừa đăng nhập KHÔNG KHỚP với ACP_EXPECTED_ADMIN_UID.", {
        actualUid: authData.user.id,
        expectedUid: expectedAdminUid
      });
      return new Response(JSON.stringify({ error: "Từ chối phiên: Danh tính quản trị không khớp với cấu hình hệ thống." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 9. Trả về token cho client
    return new Response(JSON.stringify({
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
      user_id: authData.user.id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Lỗi không mong muốn trong verify-acp-pin (Fail-Closed):", err);
    return new Response(JSON.stringify({ error: "Lỗi nội bộ máy chủ khi xử lý mã PIN." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
