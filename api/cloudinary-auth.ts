import crypto from 'crypto';
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
  getExpectedPin,
  createSessionToken,
  buildSetCookieHeader,
  buildClearCookieHeader
} from './cloudinary-session';

export default async function handler(req: any, res: any) {
  // Always prevent public or shared caching
  res.setHeader('Cache-Control', 'private, no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Phương thức không được hỗ trợ (chỉ chấp nhận POST).'
    });
  }

  const clientIp = getClientIp(req);
  const isSecure = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';

  // Handle logout action
  const body = req.body || {};
  if (body.action === 'logout') {
    res.setHeader('Set-Cookie', buildClearCookieHeader(isSecure));
    return res.status(200).json({
      success: true,
      message: 'Đã xóa phiên xác thực Cloudinary Monitor.'
    });
  }

  // Check rate limit on failed attempts
  const rateLimitCheck = checkRateLimit(clientIp);
  if (!rateLimitCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: `Đã thử sai mã PIN quá 5 lần. Vui lòng đợi ${rateLimitCheck.remainingSeconds} giây trước khi thử lại.`
    });
  }

  let expectedPin: string;
  try {
    expectedPin = getExpectedPin();
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Lỗi cấu hình server: Chưa thiết lập biến môi trường mã PIN.'
    });
  }

  const providedPin = typeof body.pin === 'string' ? body.pin.trim() : '';

  if (!providedPin) {
    return res.status(400).json({
      success: false,
      error: 'Vui lòng cung cấp mã PIN xác thực.'
    });
  }

  // Constant-time comparison to prevent timing attacks
  const expectedBuf = Buffer.from(expectedPin);
  const providedBuf = Buffer.from(providedPin);
  const isMatch = expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf);

  if (!isMatch) {
    recordFailedAttempt(clientIp);
    return res.status(401).json({
      success: false,
      error: 'Mã PIN xác thực không chính xác.'
    });
  }

  // Success: Reset rate limit record
  resetFailedAttempts(clientIp);

  // Generate signed HMAC session token
  try {
    const sessionToken = createSessionToken();
    const cookieHeader = buildSetCookieHeader(sessionToken, isSecure);

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({
      success: true,
      message: 'Xác thực thành công. Phiên làm việc có hiệu lực trong 30 phút.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Không thể tạo phiên xác thực.'
    });
  }
}
