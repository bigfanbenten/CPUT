import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HardDrive, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Layers,
  Lock,
  LogOut
} from 'lucide-react';
import type { CloudinaryAccountUsage, CloudinaryUsageResponse } from '../types/cloudinary';

export const CloudinaryUsageMonitor: React.FC = () => {
  const [data, setData] = useState<CloudinaryUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Server-side authentication state (Cookie-based session)
  const [needsAuth, setNeedsAuth] = useState<boolean>(false);
  const [authPin, setAuthPin] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // Load initial cooldown from sessionStorage if page reloaded
  useEffect(() => {
    try {
      const storedLast = sessionStorage.getItem('cput_cloudinary_last_force_refresh');
      if (storedLast) {
        const elapsed = Math.floor((Date.now() - parseInt(storedLast, 10)) / 1000);
        if (elapsed < 60) {
          setCooldownSeconds(60 - elapsed);
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const fetchUsage = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const url = forceRefresh ? '/api/cloudinary-usage?refresh=true' : '/api/cloudinary-usage';
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        if (res.status === 401 && errJson?.requireAuth) {
          setNeedsAuth(true);
          setData(null);
          return;
        }
        throw new Error(errJson?.error || `HTTP ${res.status}: Không thể tải số liệu từ máy chủ.`);
      }

      const json: CloudinaryUsageResponse = await res.json();
      setData(json);
      setNeedsAuth(false);
      setLastRefreshedAt(new Date());

      if (forceRefresh) {
        setCooldownSeconds(60);
        try {
          sessionStorage.setItem('cput_cloudinary_last_force_refresh', Date.now().toString());
        } catch {
          // Ignore
        }
      }
    } catch (err: any) {
      console.error('[CloudinaryMonitor] Fetch error:', err);
      setError(err?.message || 'Có lỗi xảy ra khi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPin.trim() || isSubmittingAuth) return;
    setIsSubmittingAuth(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/cloudinary-auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ pin: authPin.trim() })
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Xác thực không thành công.');
      }

      setNeedsAuth(false);
      setAuthPin('');
      await fetchUsage(false);
    } catch (err: any) {
      setAuthError(err?.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/cloudinary-auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'logout' })
      });
    } catch {
      // Ignore
    }
    setData(null);
    setNeedsAuth(true);
  };

  // Fetch once when component mounts
  useEffect(() => {
    fetchUsage(false);
  }, [fetchUsage]);

  // Cooldown countdown timer
  const isCooldownActive = cooldownSeconds > 0;
  useEffect(() => {
    if (!isCooldownActive) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCooldownActive]);

  const handleManualRefresh = () => {
    if (isRefreshing || cooldownSeconds > 0) return;
    fetchUsage(true);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Chưa có thông tin';
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(d) + ' (Giờ VN)';
    } catch {
      return isoString;
    }
  };

  const getProgressColor = (percent?: number) => {
    if (percent === undefined || percent === null) return 'bg-cyan-500';
    if (percent >= 90) return 'bg-rose-500 shadow-rose-500/50';
    if (percent >= 70) return 'bg-amber-500 shadow-amber-500/50';
    return 'bg-emerald-500 shadow-emerald-500/50';
  };

  const renderAccountCard = (
    account: CloudinaryAccountUsage | undefined,
    fallbackCloudName: string,
    accountType: 'primary' | 'secondary',
    accountLabel: string
  ) => {
    const cloudName = account?.cloud_name || fallbackCloudName;
    const isPrimary = accountType === 'primary';
    const isConnected = account?.connected ?? false;
    const isConfigured = account?.is_configured ?? false;

    return (
      <div className={`relative rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
        isPrimary 
          ? 'bg-gradient-to-b from-[#131722] via-[#0F121B] to-[#0A0D14] border-sky-900/50 shadow-xl shadow-sky-950/20' 
          : 'bg-gradient-to-b from-[#181324] via-[#120F1D] to-[#0D0A16] border-purple-900/50 shadow-xl shadow-purple-950/20'
      }`}>
        {/* Subtle Top Glow */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isPrimary ? 'bg-gradient-to-r from-sky-500 via-cyan-400 to-transparent' : 'bg-gradient-to-r from-purple-500 via-pink-400 to-transparent'
        }`} />

        <div className="p-6 sm:p-7 space-y-6">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                  isPrimary 
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {accountLabel}
                </span>
                <span className="text-[10px] text-stone-400 font-bold bg-white/5 px-2 py-0.5 rounded-md">
                  Gói {account?.plan || 'Free'}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <Cloud size={16} className={isPrimary ? 'text-sky-400' : 'text-purple-400'} />
                <h4 className="text-lg font-black text-white tracking-tight font-mono">
                  {cloudName}
                </h4>
              </div>
            </div>

            {/* Connection Status Pill */}
            <div>
              {isConnected ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shadow-xs">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Đã kết nối API</span>
                </div>
              ) : !isConfigured ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold shadow-xs">
                  <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                  <span>Chưa cấu hình API Key</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold shadow-xs">
                  <XCircle size={13} className="text-rose-400 shrink-0" />
                  <span>Mất kết nối API</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Notice If Disconnected / Unconfigured */}
          {account?.error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[11px] text-rose-200 block">Thông báo trạng thái:</span>
                <p className="font-mono text-[10px] text-rose-300 break-words">{account.error}</p>
              </div>
            </div>
          )}

          {/* Section 1: Main Metric — Credits 30 Ngày Gần Nhất */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Layers size={13} className={isPrimary ? 'text-sky-400' : 'text-purple-400'} />
                <span>CREDITS ĐÃ SỬ DỤNG (30 NGÀY)</span>
              </span>
              {account?.credits?.supported && (
                <span className="text-[11px] font-mono font-bold text-stone-300">
                  {account.credits.remaining ?? 0} credits còn lại
                </span>
              )}
            </div>

            {account?.credits?.supported ? (
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                      {account.credits.usage}
                    </span>
                    <span className="text-sm font-bold text-stone-400">
                      / {account.credits.limit || 25} credits
                    </span>
                  </div>
                  <span className={`text-base font-black tabular-nums ${
                    (account.credits.used_percent ?? 0) >= 90 
                      ? 'text-rose-400' 
                      : (account.credits.used_percent ?? 0) >= 70 
                      ? 'text-amber-400' 
                      : 'text-emerald-400'
                  }`}>
                    {account.credits.used_percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 shadow-md ${getProgressColor(account.credits.used_percent)}`}
                    style={{ width: `${Math.min(100, Math.max(0, account.credits.used_percent ?? 0))}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-xs font-bold">
                  <span>ℹ️ Chưa hỗ trợ qua API</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5 leading-relaxed">
                  Tài khoản hiển thị độc lập theo từng chỉ số: Băng thông, Lưu trữ và Chuyển đổi bên dưới (chuẩn API Cloudinary).
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Metrics Grid (Bandwidth, Storage, Transformations) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Bandwidth */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Activity size={12} className="text-cyan-400" />
                  <span>Bandwidth</span>
                </span>
                {account?.bandwidth?.used_percent !== undefined && (
                  <span className="text-cyan-400 font-mono">{account.bandwidth.used_percent}%</span>
                )}
              </div>

              <div>
                <div className="text-base font-black text-white tabular-nums tracking-tight">
                  {account?.bandwidth?.formatted_usage || '0 B'}
                </div>
                <span className="text-[10px] text-stone-400 block font-medium">
                  Hạn mức: {account?.bandwidth?.formatted_limit || '25 GB'}
                </span>
              </div>

              {account?.bandwidth?.used_percent !== undefined && (
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${getProgressColor(account.bandwidth.used_percent)}`}
                    style={{ width: `${Math.min(100, Math.max(0, account.bandwidth.used_percent))}%` }}
                  />
                </div>
              )}
            </div>

            {/* 2. Storage */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <HardDrive size={12} className="text-amber-400" />
                  <span>Storage</span>
                </span>
                {account?.storage?.used_percent !== undefined && (
                  <span className="text-amber-400 font-mono">{account.storage.used_percent}%</span>
                )}
              </div>

              <div>
                <div className="text-base font-black text-white tabular-nums tracking-tight">
                  {account?.storage?.formatted_usage || '0 B'}
                </div>
                <span className="text-[10px] text-stone-400 block font-medium">
                  Hạn mức: {account?.storage?.formatted_limit || '25 GB'}
                </span>
              </div>

              {account?.storage?.used_percent !== undefined && (
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${getProgressColor(account.storage.used_percent)}`}
                    style={{ width: `${Math.min(100, Math.max(0, account.storage.used_percent))}%` }}
                  />
                </div>
              )}
            </div>

            {/* 3. Transformations */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Cpu size={12} className="text-pink-400" />
                  <span>Transformations</span>
                </span>
                {account?.transformations?.used_percent !== undefined && (
                  <span className="text-pink-400 font-mono">{account.transformations.used_percent}%</span>
                )}
              </div>

              <div>
                <div className="text-base font-black text-white tabular-nums tracking-tight">
                  {account?.transformations?.usage?.toLocaleString('vi-VN') || '0'}
                </div>
                <span className="text-[10px] text-stone-400 block font-medium">
                  Hạn mức: {account?.transformations?.limit ? account.transformations.limit.toLocaleString('vi-VN') : '25.000'}
                </span>
              </div>

              {account?.transformations?.used_percent !== undefined && (
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${getProgressColor(account.transformations.used_percent)}`}
                    style={{ width: `${Math.min(100, Math.max(0, account.transformations.used_percent))}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Timestamp and Dashboard link */}
        <div className="bg-black/30 border-t border-white/5 px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-stone-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-stone-500" />
            <span>Cloudinary cập nhật:</span>
            <span className="text-stone-300 font-mono">{formatDateTime(account?.last_update)}</span>
          </div>

          <a
            href={`https://console.cloudinary.com/console/c-${cloudName}/dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Mở Cloudinary Console</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-800 pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-950/40">
              <Cloud size={20} />
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
              THỐNG KÊ CLOUDINARY
            </h2>
          </div>
          <p className="text-xs text-stone-400 font-medium">
            Theo dõi dung lượng, băng thông và hạn mức credits của 2 tài khoản video CPUT (ti6s6oqc & onu6v2bb)
          </p>
        </div>

        {/* Action Button & Cooldown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {lastRefreshedAt && (
            <span className="text-[10px] text-stone-400 font-mono">
              Lần nạp gần nhất: {lastRefreshedAt.toLocaleTimeString('vi-VN')}
            </span>
          )}

          {data && (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-stone-800/80 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-800 text-stone-300 hover:text-rose-300 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Khóa phiên làm việc Cloudinary"
            >
              <LogOut size={13} />
              <span>Khóa phiên</span>
            </button>
          )}

          {data && (
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing || cooldownSeconds > 0}
              className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-950/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Gửi yêu cầu làm mới số liệu thực tế từ Cloudinary Admin API"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>
                {isRefreshing 
                  ? 'ĐANG TẢI DỮ LIỆU...' 
                  : cooldownSeconds > 0 
                  ? `LÀM MỚI (${cooldownSeconds}S)` 
                  : 'LÀM MỚI THỐNG KÊ'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Security & Architecture Badge */}
      <div className="p-4 rounded-2xl bg-[#11141D] border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
          <span className="text-stone-300">
            <strong>Bảo Mật Server-side:</strong> Xác thực phiên qua HttpOnly Secure Cookie (HMAC-SHA256). API Key & Secret được lưu trong Vercel Environment Variables, không xuất hiện trong client.
          </span>
        </div>
        <div className="text-[11px] text-stone-400 font-mono shrink-0">
          Chỉ mục quản trị ACP
        </div>
      </div>

      {/* Server-Side Session Verification Form */}
      {needsAuth && (
        <div className="max-w-md mx-auto my-6 p-7 sm:p-8 rounded-3xl bg-[#121622] border border-sky-900/50 shadow-2xl shadow-sky-950/40 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              XÁC THỰC QUẢN TRỊ CLOUDINARY
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Mục thống kê Cloudinary được bảo vệ bằng phiên làm việc server-side an toàn (HttpOnly Cookie). Vui lòng nhập mã PIN quản trị viên máy chủ để mở khóa.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={authPin}
                onChange={(e) => setAuthPin(e.target.value)}
                placeholder="Nhập mã PIN quản trị viên..."
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-stone-700 focus:border-sky-500 text-white placeholder-stone-500 text-sm font-mono tracking-widest text-center focus:outline-none transition-all shadow-inner"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth || !authPin.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-950/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmittingAuth ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>ĐANG XÁC THỰC...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>MỞ KHÓA THỐNG KÊ</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-stone-500">
            Phiên làm việc tự động khóa sau 30 phút • Ký số bảo mật HMAC-SHA256
          </p>
        </div>
      )}

      {/* Error Alert */}
      {!needsAuth && error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-medium flex items-center gap-3 shadow-lg">
          <AlertTriangle size={18} className="text-rose-400 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Không thể tải dữ liệu:</span> {error}
          </div>
          <button 
            onClick={() => fetchUsage(true)}
            className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!needsAuth && isLoading && !data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-stone-900/40 border border-stone-800 animate-pulse p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-32 h-6 bg-white/10 rounded-lg" />
                <div className="w-48 h-4 bg-white/5 rounded-lg" />
              </div>
              <div className="w-full h-32 bg-white/5 rounded-2xl" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 bg-white/5 rounded-xl" />
                <div className="h-16 bg-white/5 rounded-xl" />
                <div className="h-16 bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2 Independent Account Cards */}
      {!needsAuth && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ACC 1 — CHÍNH */}
          {renderAccountCard(
            data.accounts.acc1,
            'ti6s6oqc',
            'primary',
            'ACC 1 — CHÍNH'
          )}

          {/* ACC 2 — PHỤ */}
          {renderAccountCard(
            data.accounts.acc2,
            'onu6v2bb',
            'secondary',
            'ACC 2 — PHỤ'
          )}
        </div>
      )}

      {/* Setup Guide Accordion / Information for Administrator */}
      <div className="p-5 rounded-3xl bg-stone-900/60 border border-stone-800 text-stone-300 text-xs space-y-3">
        <h4 className="font-black text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <span>⚙️ HƯỚNG DẪN CẤU HÌNH BIẾN MÔI TRƯỜNG CLOUDINARY TRÊN VERCEL</span>
        </h4>
        <p className="text-stone-400 text-[11px] leading-relaxed">
          Để bảng thống kê đọc dữ liệu thực tế từ Cloudinary Admin API mà không để lộ khóa bí mật, hãy thêm các biến môi trường sau vào <strong>Vercel Dashboard &gt; Project Settings &gt; Environment Variables</strong>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-sky-400 font-bold block">Tài khoản chính (ti6s6oqc):</span>
            <div className="text-stone-300">CLOUDINARY_ACC1_CLOUD_NAME=ti6s6oqc</div>
            <div className="text-stone-300">CLOUDINARY_ACC1_API_KEY=&lt;api_key&gt;</div>
            <div className="text-stone-300">CLOUDINARY_ACC1_API_SECRET=&lt;api_secret&gt;</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-purple-400 font-bold block">Tài khoản phụ (onu6v2bb):</span>
            <div className="text-stone-300">CLOUDINARY_ACC2_CLOUD_NAME=onu6v2bb</div>
            <div className="text-stone-300">CLOUDINARY_ACC2_API_KEY=&lt;api_key&gt;</div>
            <div className="text-stone-300">CLOUDINARY_ACC2_API_SECRET=&lt;api_secret&gt;</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-sky-900/30 text-[11px] font-mono space-y-1">
          <span className="text-amber-400 font-bold block">Xác thực phiên bảo mật (Server-side):</span>
          <div className="text-stone-300">CLOUDINARY_MONITOR_PIN=&lt;ma_pin_quan_tri&gt; (hoặc ACP_PIN)</div>
          <div className="text-stone-300">SESSION_SECRET=&lt;chuoi_bi_mat_ky_so_tuy_chon&gt;</div>
        </div>
      </div>
    </div>
  );
};
