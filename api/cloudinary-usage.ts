import type { CloudinaryAccountUsage, CloudinaryUsageResponse } from '../types/cloudinary';
import { parseCookies, verifySessionToken } from './cloudinary-session';

// In-memory cache per serverless instance: Reduces redundant API calls within the same warm instance.
// NOTE: This does NOT act as a global rate limiter across different cold-start Vercel instances.
let cachedResponse: CloudinaryUsageResponse | null = null;
let lastFetchTimestamp = 0;

// Cache duration: 15 minutes within the same warm instance
const CACHE_DURATION_MS = 15 * 60 * 1000; 
// Minimum cooldown between forced refreshes within the same warm instance
const MIN_REFRESH_INTERVAL_MS = 15 * 60 * 1000; 

function formatBytes(bytes: number | undefined | null): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '0 B';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const num = bytes / Math.pow(k, i);
  return `${num.toFixed(2)} ${sizes[i]}`;
}

async function fetchSingleAccountUsage(
  accountType: 'primary' | 'secondary',
  accountLabel: string,
  cloudNameEnv: string | undefined,
  apiKeyEnv: string | undefined,
  apiSecretEnv: string | undefined,
  defaultCloudName: string
): Promise<CloudinaryAccountUsage> {
  const cloudName = (cloudNameEnv || defaultCloudName).trim();
  const apiKey = (apiKeyEnv || '').trim();
  const apiSecret = (apiSecretEnv || '').trim();

  // If credentials are not configured in environment
  if (!apiKey || !apiSecret) {
    return {
      cloud_name: cloudName,
      account_type: accountType,
      account_label: accountLabel,
      is_configured: false,
      connected: false,
      error: `Chưa cấu hình biến môi trường ${accountType === 'primary' ? 'CLOUDINARY_ACC1_API_KEY/SECRET' : 'CLOUDINARY_ACC2_API_KEY/SECRET'} trên Vercel/Server.`
    };
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/usage`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const errMsg = errJson?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      return {
        cloud_name: cloudName,
        account_type: accountType,
        account_label: accountLabel,
        is_configured: true,
        connected: false,
        error: `Cloudinary API trả về lỗi: ${errMsg}`
      };
    }

    const data: any = await res.json();

    // Parse Credits
    let creditsObj: CloudinaryAccountUsage['credits'] = undefined;
    if (data.credits && typeof data.credits === 'object') {
      const usage = typeof data.credits.usage === 'number' ? data.credits.usage : 0;
      const limit = typeof data.credits.limit === 'number' ? data.credits.limit : 25;
      const remaining = Math.max(0, limit - usage);
      const used_percent = typeof data.credits.used_percent === 'number' 
        ? data.credits.used_percent 
        : limit > 0 ? (usage / limit) * 100 : 0;

      creditsObj = {
        supported: true,
        usage: Number(usage.toFixed(2)),
        limit: Number(limit.toFixed(2)),
        remaining: Number(remaining.toFixed(2)),
        used_percent: Number(used_percent.toFixed(1))
      };
    } else {
      creditsObj = {
        supported: false
      };
    }

    // Parse Bandwidth
    let bandwidthObj: CloudinaryAccountUsage['bandwidth'] = undefined;
    if (data.bandwidth) {
      const usageBytes = typeof data.bandwidth.usage === 'number' ? data.bandwidth.usage : 0;
      const limitBytes = typeof data.bandwidth.limit === 'number' ? data.bandwidth.limit : undefined;
      const usedPercent = typeof data.bandwidth.used_percent === 'number'
        ? data.bandwidth.used_percent
        : (limitBytes && limitBytes > 0) ? (usageBytes / limitBytes) * 100 : undefined;

      bandwidthObj = {
        usage_bytes: usageBytes,
        formatted_usage: formatBytes(usageBytes),
        limit_bytes: limitBytes,
        formatted_limit: limitBytes ? formatBytes(limitBytes) : undefined,
        used_percent: usedPercent !== undefined ? Number(usedPercent.toFixed(1)) : undefined
      };
    }

    // Parse Storage
    let storageObj: CloudinaryAccountUsage['storage'] = undefined;
    if (data.storage) {
      const usageBytes = typeof data.storage.usage === 'number' ? data.storage.usage : 0;
      const limitBytes = typeof data.storage.limit === 'number' ? data.storage.limit : undefined;
      const usedPercent = typeof data.storage.used_percent === 'number'
        ? data.storage.used_percent
        : (limitBytes && limitBytes > 0) ? (usageBytes / limitBytes) * 100 : undefined;

      storageObj = {
        usage_bytes: usageBytes,
        formatted_usage: formatBytes(usageBytes),
        limit_bytes: limitBytes,
        formatted_limit: limitBytes ? formatBytes(limitBytes) : undefined,
        used_percent: usedPercent !== undefined ? Number(usedPercent.toFixed(1)) : undefined
      };
    }

    // Parse Transformations
    let transformationsObj: CloudinaryAccountUsage['transformations'] = undefined;
    if (data.transformations) {
      const usage = typeof data.transformations.usage === 'number' ? data.transformations.usage : 0;
      const limit = typeof data.transformations.limit === 'number' ? data.transformations.limit : undefined;
      const usedPercent = typeof data.transformations.used_percent === 'number'
        ? data.transformations.used_percent
        : (limit && limit > 0) ? (usage / limit) * 100 : undefined;

      transformationsObj = {
        usage,
        limit,
        used_percent: usedPercent !== undefined ? Number(usedPercent.toFixed(1)) : undefined
      };
    }

    return {
      cloud_name: cloudName,
      account_type: accountType,
      account_label: accountLabel,
      is_configured: true,
      connected: true,
      plan: data.plan || 'Free',
      last_update: data.last_update,
      credits: creditsObj,
      bandwidth: bandwidthObj,
      storage: storageObj,
      transformations: transformationsObj,
      cached_at: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      cloud_name: cloudName,
      account_type: accountType,
      account_label: accountLabel,
      is_configured: true,
      connected: false,
      error: `Lỗi kết nối tới Cloudinary API: ${err?.message || 'Timeout / Network Error'}`
    };
  }
}

export async function getCloudinaryUsage(forceRefresh = false): Promise<CloudinaryUsageResponse> {
  const now = Date.now();

  // Return cached if valid and not force-refreshing
  if (!forceRefresh && cachedResponse && (now - lastFetchTimestamp < CACHE_DURATION_MS)) {
    return {
      ...cachedResponse,
      cached: true
    };
  }

  // Prevent spamming refresh: enforce minimum 10s cooldown
  if (forceRefresh && cachedResponse && (now - lastFetchTimestamp < MIN_REFRESH_INTERVAL_MS)) {
    return {
      ...cachedResponse,
      cached: true
    };
  }

  const [acc1Result, acc2Result] = await Promise.allSettled([
    fetchSingleAccountUsage(
      'primary',
      'ACC 1 — CHÍNH',
      process.env.CLOUDINARY_ACC1_CLOUD_NAME,
      process.env.CLOUDINARY_ACC1_API_KEY,
      process.env.CLOUDINARY_ACC1_API_SECRET,
      'ti6s6oqc'
    ),
    fetchSingleAccountUsage(
      'secondary',
      'ACC 2 — PHỤ',
      process.env.CLOUDINARY_ACC2_CLOUD_NAME,
      process.env.CLOUDINARY_ACC2_API_KEY,
      process.env.CLOUDINARY_ACC2_API_SECRET,
      'onu6v2bb'
    )
  ]);

  const acc1: CloudinaryAccountUsage = acc1Result.status === 'fulfilled' 
    ? acc1Result.value 
    : {
        cloud_name: process.env.CLOUDINARY_ACC1_CLOUD_NAME || 'ti6s6oqc',
        account_type: 'primary',
        account_label: 'ACC 1 — CHÍNH',
        is_configured: false,
        connected: false,
        error: String(acc1Result.reason?.message || 'Lỗi không xác định')
      };

  const acc2: CloudinaryAccountUsage = acc2Result.status === 'fulfilled'
    ? acc2Result.value
    : {
        cloud_name: process.env.CLOUDINARY_ACC2_CLOUD_NAME || 'onu6v2bb',
        account_type: 'secondary',
        account_label: 'ACC 2 — PHỤ',
        is_configured: false,
        connected: false,
        error: String(acc2Result.reason?.message || 'Lỗi không xác định')
      };

  const response: CloudinaryUsageResponse = {
    success: true,
    timestamp: new Date().toISOString(),
    cached: false,
    accounts: {
      acc1,
      acc2
    }
  };

  cachedResponse = response;
  lastFetchTimestamp = now;

  return response;
}

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Enforce private, no-store for all admin usage responses and auth errors to prevent shared/public CDN caching
  res.setHeader('Cache-Control', 'private, no-store');

  // CORS & Methods
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Phương thức không được hỗ trợ (Method Not Allowed)' });
  }

  // Security check: Validate signed HttpOnly session cookie
  const cookies = parseCookies(req.headers?.cookie);
  const sessionToken = cookies['cput_cld_session'];

  const verification = verifySessionToken(sessionToken);
  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      requireAuth: true,
      error: verification.error || 'Yêu cầu xác thực phiên quản trị Cloudinary.'
    });
  }

  const forceRefresh = req.query?.refresh === 'true';
  const data = await getCloudinaryUsage(forceRefresh);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json(data);
}
