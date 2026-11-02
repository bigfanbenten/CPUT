import crypto from 'crypto';

// In-memory rate limiting map per warm serverless container
// Note: Documented limitation: This operates per container/instance, not globally distributed across cold starts.
const failedAttemptsMap = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown-ip';
}

export function checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const record = failedAttemptsMap.get(ip);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // If lockout expired, reset
  if (now >= record.lockedUntil && record.count >= MAX_ATTEMPTS) {
    failedAttemptsMap.delete(ip);
  }
  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = failedAttemptsMap.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
  failedAttemptsMap.set(ip, record);
}

export function resetFailedAttempts(ip: string): void {
  failedAttemptsMap.delete(ip);
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('Chưa cấu hình biến môi trường SESSION_SECRET trên server.');
  }
  const byteLength = Buffer.byteLength(secret, 'utf8');
  if (byteLength < 32) {
    throw new Error('Biến môi trường SESSION_SECRET không đủ mạnh (yêu cầu tối thiểu 32 byte / 256-bit).');
  }
  return secret;
}

export function getExpectedPin(): string {
  const pin = process.env.CLOUDINARY_MONITOR_PIN;
  if (!pin) {
    throw new Error('Chưa cấu hình biến môi trường CLOUDINARY_MONITOR_PIN trên server.');
  }
  return pin.trim();
}

export function createSessionToken(): string {
  const secret = getSessionSecret();
  const now = Date.now();
  const expiresAt = now + 30 * 60 * 1000; // 30 minutes validity
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${now}.${expiresAt}.${nonce}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Thiếu mã phiên làm việc.' };
  }

  const parts = token.split('.');
  if (parts.length !== 4) {
    return { valid: false, error: 'Mã phiên làm việc sai định dạng.' };
  }

  const [createdAtStr, expiresAtStr, nonce, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false, error: 'Phiên làm việc đã hết hạn. Vui lòng xác thực lại.' };
  }

  try {
    const secret = getSessionSecret();
    const payload = `${createdAtStr}.${expiresAtStr}.${nonce}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: false, error: 'Chữ ký phiên làm việc không hợp lệ (bị giả mạo).' };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Lỗi kiểm tra phiên.' };
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    const value = decodeURIComponent(parts.join('=')?.trim() || '');
    if (name) list[name] = value;
  });

  return list;
}

export function buildSetCookieHeader(token: string, isSecure: boolean): string {
  const parts = [
    `cput_cld_session=${encodeURIComponent(token)}`,
    'Path=/api',
    'Max-Age=1800', // 30 minutes
    'HttpOnly',
    'SameSite=Strict'
  ];
  if (isSecure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function buildClearCookieHeader(isSecure: boolean): string {
  const parts = [
    'cput_cld_session=',
    'Path=/api',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Strict'
  ];
  if (isSecure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}
