import React, { useState, useEffect } from 'react';
import { FestivalEventId, FESTIVAL_EVENTS } from '../../types/festival';
import { CountryCode } from '../../countryConfig';
import { Eye, Sparkles, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

interface FestivalPreviewBarProps {
  currentEvent: FestivalEventId;
  previewCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  enableAnimations: boolean;
  onToggleAnimations: () => void;
  onExitPreview: () => void;
}

export const FestivalPreviewBar: React.FC<FestivalPreviewBarProps> = ({
  currentEvent,
  previewCountry,
  onSelectCountry,
  enableAnimations,
  onToggleAnimations,
  onExitPreview,
}) => {
  const config = FESTIVAL_EVENTS[currentEvent];

  const [isSystemReducedMotion, setIsSystemReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e: MediaQueryListEvent) => setIsSystemReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } catch {
      // Fallback
    }
  }, []);

  const countries: Array<{ code: CountryCode; name: string; flag: string }> = [
    { code: 'VN', name: 'Việt Nam', flag: '🇻🇳' },
    { code: 'KR', name: 'Hàn Quốc', flag: '🇰🇷' },
    { code: 'JP', name: 'Nhật Bản', flag: '🇯🇵' },
    { code: 'US', name: 'Mỹ', flag: '🇺🇸' },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] bg-stone-950/95 backdrop-blur-md border-b border-amber-500/40 text-white shadow-2xl px-3 py-2 sm:px-6 sm:py-2.5 transition-all"
      role="region"
      aria-label="Thanh điều khiển xem trước sự kiện"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Event Info & Badges */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <Eye size={13} className="animate-pulse text-amber-400" />
            <span>ĐANG XEM TRƯỚC:</span>
            <span className="text-white font-extrabold">{config.name}</span>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 border border-rose-500/40 text-rose-300">
            <AlertCircle size={11} />
            <span>CHƯA ÁP DỤNG</span>
          </span>

          {/* Reduced Motion System Warning */}
          {isSystemReducedMotion && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300" title="Thiết bị đang bật chế độ giảm chuyển động trong hệ điều hành">
              <ShieldAlert size={11} className="text-amber-400" />
              <span>HĐH BẬT REDUCED MOTION</span>
            </span>
          )}

          <span className="text-[11px] text-stone-400 hidden lg:inline">
            • {config.styleName}
          </span>
        </div>

        {/* Center: 4-Country Quick Switcher */}
        <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800">
          <span className="text-[9px] font-bold text-stone-400 px-2 uppercase hidden sm:inline">Trang:</span>
          {countries.map((c) => {
            const isActive = previewCountry === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => onSelectCountry(c.code)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md scale-102 ring-1 ring-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
                title={`Xem trước giao diện ${c.name}`}
              >
                <span>{c.flag}</span>
                <span className="hidden xs:inline">{c.code}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Animation Toggle & Exit Preview */}
        <div className="flex items-center gap-2">
          {currentEvent !== 'default' && (
            <button
              type="button"
              onClick={onToggleAnimations}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                enableAnimations
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-stone-900 border-stone-700 text-stone-400 hover:bg-stone-800'
              }`}
              title="Bật/Tắt hiệu ứng chuyển động lễ hội trong Preview"
            >
              <Sparkles size={11} className={enableAnimations ? 'text-emerald-400' : 'text-stone-500'} />
              <span className="hidden sm:inline">Hiệu ứng:</span>
              <span>{enableAnimations ? 'BẬT' : 'TẮT'}</span>
            </button>
          )}

          {/* Exit Preview Button */}
          <button
            type="button"
            onClick={onExitPreview}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            title="Thoát chế độ xem trước và quay lại trang quản trị ACP"
          >
            <ArrowLeft size={12} />
            <span>THOÁT PREVIEW</span>
          </button>
        </div>

      </div>
    </div>
  );
};
