export interface CloudinaryAccountMetric {
  usage: number;
  limit?: number;
  used_percent?: number;
  formatted_usage?: string;
  formatted_limit?: string;
}

export interface CloudinaryAccountUsage {
  cloud_name: string;
  account_type: 'primary' | 'secondary';
  account_label: string; // "ACC 1 — CHÍNH" | "ACC 2 — PHỤ"
  is_configured: boolean;
  connected: boolean;
  plan?: string;
  last_update?: string;
  credits?: {
    supported: boolean;
    usage?: number;
    limit?: number;
    remaining?: number;
    used_percent?: number;
  };
  bandwidth?: {
    usage_bytes: number;
    formatted_usage: string;
    limit_bytes?: number;
    formatted_limit?: string;
    used_percent?: number;
  };
  storage?: {
    usage_bytes: number;
    formatted_usage: string;
    limit_bytes?: number;
    formatted_limit?: string;
    used_percent?: number;
  };
  transformations?: {
    usage: number;
    limit?: number;
    used_percent?: number;
  };
  error?: string;
  cached_at?: string;
}

export interface CloudinaryUsageResponse {
  success: boolean;
  timestamp: string;
  cached: boolean;
  accounts: {
    acc1: CloudinaryAccountUsage;
    acc2: CloudinaryAccountUsage;
  };
  error?: string;
}
