import React, { useState } from 'react';
import { CountryCode, CountryInfo, COUNTRY_LIST } from '../countryConfig';
import { ChevronRight, Globe, MapPin } from 'lucide-react';

interface LanguageGatewayProps {
  onSelectLanguage: (code: CountryCode) => void;
}

interface GatewayLanguageItem extends CountryInfo {
  secondaryLabel: string;
  tagline: string;
  badge: string;
}

const GATEWAY_LANGUAGES: Record<CountryCode, GatewayLanguageItem> = {
  VN: {
    ...COUNTRY_LIST[0],
    nativeName: 'Tiếng Việt',
    secondaryLabel: 'VIETNAMESE',
    tagline: 'Cơm nhà truyền thống...',
    badge: 'VN'
  },
  US: {
    ...COUNTRY_LIST[3],
    nativeName: 'English',
    secondaryLabel: 'AMERICAN DINING',
    tagline: 'Authentic Vietnamese...',
    badge: 'US'
  },
  JP: {
    ...COUNTRY_LIST[2],
    nativeName: '日本語',
    secondaryLabel: 'MODERN WASHOKU',
    tagline: '本場ベトナム家庭料理の真髄...',
    badge: 'JP'
  },
  KR: {
    ...COUNTRY_LIST[1],
    nativeName: '한국어',
    secondaryLabel: 'K-FOOD CUTE',
    tagline: '정갈하고 따뜻한 베토남 가정식...',
    badge: 'KR'
  }
};

const ORDERED_CODES: CountryCode[] = ['VN', 'US', 'JP', 'KR'];

/* Crisp Vector Flags Matching Approved Reference Composition */
const FlagVN: React.FC = () => (
  <svg viewBox="0 0 48 32" className="w-7 sm:w-9 md:w-11 h-5 sm:h-6 md:h-7 rounded shadow-xs overflow-hidden shrink-0 border border-black/10">
    <rect width="48" height="32" fill="#DA251D" />
    <polygon 
      points="24,6.5 26.6,14.6 35.1,14.6 28.2,19.6 30.8,27.7 24,22.7 17.2,27.7 19.8,19.6 12.9,14.6 21.4,14.6" 
      fill="#FFFF00" 
    />
  </svg>
);

const FlagUS: React.FC = () => (
  <svg viewBox="0 0 48 32" className="w-7 sm:w-9 md:w-11 h-5 sm:h-6 md:h-7 rounded shadow-xs overflow-hidden shrink-0 border border-black/10">
    <rect width="48" height="32" fill="#B22234" />
    <rect y="2.46" width="48" height="2.46" fill="#FFFFFF" />
    <rect y="7.38" width="48" height="2.46" fill="#FFFFFF" />
    <rect y="12.3" width="48" height="2.46" fill="#FFFFFF" />
    <rect y="17.23" width="48" height="2.46" fill="#FFFFFF" />
    <rect y="22.15" width="48" height="2.46" fill="#FFFFFF" />
    <rect y="27.07" width="48" height="2.46" fill="#FFFFFF" />
    <rect width="21" height="17.23" fill="#3C3B6E" />
    <g fill="#FFFFFF">
      <circle cx="3.8" cy="3.2" r="0.9" />
      <circle cx="7.6" cy="3.2" r="0.9" />
      <circle cx="11.4" cy="3.2" r="0.9" />
      <circle cx="15.2" cy="3.2" r="0.9" />
      <circle cx="19" cy="3.2" r="0.9" />
      <circle cx="5.7" cy="6.2" r="0.9" />
      <circle cx="9.5" cy="6.2" r="0.9" />
      <circle cx="13.3" cy="6.2" r="0.9" />
      <circle cx="17.1" cy="6.2" r="0.9" />
      <circle cx="3.8" cy="9.2" r="0.9" />
      <circle cx="7.6" cy="9.2" r="0.9" />
      <circle cx="11.4" cy="9.2" r="0.9" />
      <circle cx="15.2" cy="9.2" r="0.9" />
      <circle cx="19" cy="9.2" r="0.9" />
      <circle cx="5.7" cy="12.2" r="0.9" />
      <circle cx="9.5" cy="12.2" r="0.9" />
      <circle cx="13.3" cy="12.2" r="0.9" />
      <circle cx="17.1" cy="12.2" r="0.9" />
      <circle cx="3.8" cy="15.2" r="0.9" />
      <circle cx="7.6" cy="15.2" r="0.9" />
      <circle cx="11.4" cy="15.2" r="0.9" />
      <circle cx="15.2" cy="15.2" r="0.9" />
      <circle cx="19" cy="15.2" r="0.9" />
    </g>
  </svg>
);

const FlagJP: React.FC = () => (
  <svg viewBox="0 0 48 32" className="w-7 sm:w-9 md:w-11 h-5 sm:h-6 md:h-7 rounded shadow-xs overflow-hidden shrink-0 border border-stone-300">
    <rect width="48" height="32" fill="#FFFFFF" />
    <circle cx="24" cy="16" r="9.2" fill="#BC002D" />
  </svg>
);

const FlagKR: React.FC = () => (
  <svg viewBox="0 0 48 32" className="w-7 sm:w-9 md:w-11 h-5 sm:h-6 md:h-7 rounded shadow-xs overflow-hidden shrink-0 border border-stone-300">
    <rect width="48" height="32" fill="#FFFFFF" />
    {/* Taegeuk Center */}
    <g transform="translate(24, 16) rotate(-33.7)">
      <path d="M 0,-7.8 A 7.8,7.8 0 0,1 0,7.8 A 3.9,3.9 0 0,1 0,0 A 3.9,3.9 0 0,0 0,-7.8" fill="#CD2E3A" />
      <path d="M 0,-7.8 A 7.8,7.8 0 0,0 0,7.8 A 3.9,3.9 0 0,1 0,0 A 3.9,3.9 0 0,0 0,-7.8" fill="#0047A0" />
    </g>
    {/* Trigrams */}
    <g fill="#000000" opacity="0.9">
      {/* Geon */}
      <rect x="5.5" y="5.2" width="1.6" height="5.2" transform="rotate(-33.7 6.3 7.8)" />
      <rect x="8.2" y="5.2" width="1.6" height="5.2" transform="rotate(-33.7 9 7.8)" />
      <rect x="10.9" y="5.2" width="1.6" height="5.2" transform="rotate(-33.7 11.7 7.8)" />
      {/* Gon */}
      <rect x="35.5" y="21.5" width="1.6" height="5.2" transform="rotate(-33.7 36.3 24.1)" />
      <rect x="38.2" y="21.5" width="1.6" height="5.2" transform="rotate(-33.7 39 24.1)" />
      <rect x="40.9" y="21.5" width="1.6" height="5.2" transform="rotate(-33.7 41.7 24.1)" />
      {/* Gam */}
      <rect x="37" y="5.5" width="1.6" height="5.2" transform="rotate(33.7 37.8 8.1)" />
      <rect x="39.7" y="5.5" width="1.6" height="5.2" transform="rotate(33.7 40.5 8.1)" />
      {/* Ri */}
      <rect x="7" y="21.5" width="1.6" height="5.2" transform="rotate(33.7 7.8 24.1)" />
      <rect x="9.7" y="21.5" width="1.6" height="5.2" transform="rotate(33.7 10.5 24.1)" />
    </g>
  </svg>
);

const FLAG_COMPONENTS: Record<CountryCode, React.FC> = {
  VN: FlagVN,
  US: FlagUS,
  JP: FlagJP,
  KR: FlagKR
};

export const LanguageGateway: React.FC<LanguageGatewayProps> = ({ onSelectLanguage }) => {
  const [selectedCode, setSelectedCode] = useState<CountryCode | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleChoose = (code: CountryCode) => {
    if (isExiting) return;
    setSelectedCode(code);
    setIsExiting(true);

    setTimeout(() => {
      onSelectLanguage(code);
    }, 280);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] min-h-[100dvh] overflow-x-hidden overflow-y-auto flex flex-col justify-between items-center transition-all duration-300 pt-[max(0.35rem,env(safe-area-inset-top))] pb-[max(0.1rem,env(safe-area-inset-bottom))] ${
        isExiting ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#E7F2DF'
      }}
    >
      {/* VIBRANT PHOTOREALISTIC COUNTRYSIDE BACKGROUND (Zero Washed-Out Overlay) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Layer 1: Photographic High-Res Landscape */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('/assets/welcome/vietnamese_countryside_lotus_sunlit.jpg')`
          }}
        />

        {/* Layer 2: Ultra-Subtle Sunlight Enhancement (Preserves Vibrant Natural Countryside) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 82% 12%, rgba(255, 245, 180, 0.45) 0%, rgba(255, 235, 140, 0.15) 35%, transparent 65%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(0, 0, 0, 0.15) 100%)
            `
          }}
        />
      </div>

      {/* TOP: Official Crest & Typography Lockup (Compact on Mobile, Grand on Desktop) */}
      <header className="relative z-10 w-full pt-1 sm:pt-4 md:pt-8 pb-1 px-3 sm:px-4 flex flex-col items-center text-center space-y-1 sm:space-y-2 md:space-y-3 shrink-0">
        {/* Official Brand Logo (Native Transparent PNG) */}
        <div className="relative group cursor-pointer" onClick={() => window.location.reload()}>
          <img 
            src="/assets/welcome/logo_CPUT_transparent.png" 
            alt="Cơm Phần Út Trinh" 
            className="relative h-12 sm:h-16 md:h-24 lg:h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(20,40,20,0.18)]"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/aistudio/Logo_C_m_Ph_n__t_Trinh_N_n_Trong_Su_t_f96f5bc0.png';
            }}
          />
        </div>

        {/* Restaurant Name: Modern Bold Sans-Serif Be Vietnam Pro ExtraBold (800) in Solid Deep Forest Green */}
        <div className="space-y-0.5">
          <h1 
            className="text-xl sm:text-2xl md:text-4xl lg:text-[52px] uppercase tracking-wide leading-tight px-2"
            style={{
              fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 800,
              color: '#063B26',
              letterSpacing: '0.03em',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            CƠM PHẦN ÚT TRINH
          </h1>
          
          {/* Slogan: Warm Orange-Amber Italic Matching Approved Reference */}
          <p 
            className="italic text-xs sm:text-base md:text-2xl lg:text-3xl text-[#D95B16] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              textRendering: 'optimizeLegibility'
            }}
          >
            Mở hộp là thấy ngon!
          </p>
        </div>

        {/* EST. 2019 with Delicate Gold Flanking Lines */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-0">
          <div className="w-8 sm:w-20 md:w-36 h-[1px] sm:h-[1.5px] bg-[#CBB07E]" />
          <span className="text-[9px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#1B3A25] font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            EST. 2019
          </span>
          <div className="w-8 sm:w-20 md:w-36 h-[1px] sm:h-[1.5px] bg-[#CBB07E]" />
        </div>
      </header>

      {/* CENTER: Welcome Badge, Instruction & 4 Ivory-and-Gold Language Cards */}
      <main className="relative z-10 w-full max-w-6xl px-3 sm:px-6 my-auto py-1 sm:py-3 md:py-4 flex flex-col items-center">
        {/* Welcome Gold Pill Badge (Matching Approved Reference) */}
        <div className="mb-1.5 sm:mb-2.5 md:mb-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#F0C058] via-[#E2A63B] to-[#D59128] border border-[#B87A1E]/40 text-[#2D1B07] text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase shadow-[0_2px_8px_rgba(180,120,30,0.25)]">
            <Globe size={12} className="text-[#321C05] shrink-0 sm:w-[14px] sm:h-[14px]" />
            <span>WELCOME / CHÀO MỪNG</span>
          </div>
        </div>

        {/* Bilingual Instruction Heading & Subtitle */}
        <div className="text-center space-y-0.5 sm:space-y-1 mb-2.5 sm:mb-5 md:mb-7 max-w-3xl px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/65 backdrop-blur-[2px] border border-white/50 shadow-2xs mx-auto">
          <h2 
            className="text-[11px] sm:text-sm md:text-lg lg:text-[22px] tracking-wide text-[#063B26] uppercase leading-snug"
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 800,
              color: '#063B26'
            }}
          >
            VUI LÒNG CHỌN NGÔN NGỮ / PLEASE SELECT YOUR LANGUAGE
          </h2>
          
          <p 
            className="text-[10px] sm:text-xs md:text-sm text-[#063B26] leading-snug sm:leading-relaxed"
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
              color: '#063B26'
            }}
          >
            Chọn một trong 4 phiên bản trải nghiệm phù hợp nhất với bạn
          </p>
        </div>

        {/* 4 Cards Grid: 2×2 on Mobile & Tablet, 4 columns horizontal on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 md:gap-5 w-full">
          {ORDERED_CODES.map((code) => {
            const item = GATEWAY_LANGUAGES[code];
            const isSelected = selectedCode === code;
            const FlagComponent = FLAG_COMPONENTS[code];

            return (
              <button
                key={code}
                type="button"
                onClick={() => handleChoose(code)}
                className={`group relative flex flex-col justify-between text-left p-2.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[22px] border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm min-h-[86px] sm:min-h-[110px] md:min-h-[160px] ${
                  isSelected 
                    ? 'bg-[#FFFDF6] border-[#C49B45] ring-2 ring-[#C49B45]/70 scale-[1.02] shadow-[0_8px_20px_rgba(180,130,40,0.28)]'
                    : 'bg-[#FFFDF6]/95 hover:bg-[#FFFFFF] border-[#D9C8A4] hover:border-[#BE943E] shadow-[0_4px_16px_rgba(30,45,25,0.09)] hover:shadow-[0_12px_28px_rgba(180,130,40,0.22)] hover:-translate-y-0.5 sm:hover:-translate-y-1'
                }`}
              >
                {/* Subtle Warm Inner Ambient Sunlight on Hover */}
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-amber-200/30 via-yellow-100/10 to-transparent rounded-full blur-xl sm:blur-2xl group-hover:from-amber-200/50 transition-all pointer-events-none" />

                {/* Top Row: National Flag & Code Pill Badge */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3 relative z-10">
                  <div className="transition-transform group-hover:scale-105 duration-300">
                    <FlagComponent />
                  </div>

                  <span className="text-[9px] sm:text-[11px] font-black tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#F3ECE0] border border-[#D5C6AF] text-[#5C4524] group-hover:bg-[#EFE5D3] group-hover:border-[#C49B45]/60 transition-colors shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                {/* Center Row: Native Language Title & Secondary Subtitle */}
                <div className="space-y-0.5 my-auto relative z-10">
                  <div className="text-sm sm:text-lg md:text-2xl font-black tracking-tight text-[#122819] group-hover:text-[#0F3822] transition-colors leading-tight">
                    {item.nativeName}
                  </div>
                  
                  <div className="text-[9px] sm:text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-[#9B732B] group-hover:text-[#835E1C] transition-colors">
                    {item.secondaryLabel}
                  </div>
                </div>

                {/* Bottom Row: Tagline (desktop/tablet) & Gold Circular Arrow Button */}
                <div className="pt-1.5 sm:pt-2 md:pt-3 border-t border-[#EAE0D0] flex items-center justify-between gap-1.5 sm:gap-2 mt-1 sm:mt-2 md:mt-3 relative z-10">
                  {/* Tagline is shown on tablet/desktop, hidden on mobile for clean fit */}
                  <span className="hidden sm:inline-block text-[11px] md:text-xs text-[#526356] group-hover:text-[#324536] transition-colors truncate font-medium">
                    {item.tagline}
                  </span>

                  {/* On mobile, small hint or spacer */}
                  <span className="sm:hidden text-[9px] text-[#526356] font-semibold tracking-tight uppercase">
                    Chọn
                  </span>

                  <span className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[#E8B548] to-[#C99128] text-white flex items-center justify-center shadow-xs sm:shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <ChevronRight size={12} strokeWidth={2.5} className="sm:hidden" />
                    <ChevronRight size={15} strokeWidth={2.5} className="hidden sm:block" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* BOTTOM: Elegant Curved Dark-Green Footer with Glowing Gold Border */}
      <footer className="relative z-10 w-full mt-auto shrink-0 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        {/* Smooth Curved SVG Wave with Golden Top Border */}
        <div className="w-full overflow-hidden leading-none">
          <svg 
            viewBox="0 0 1440 60" 
            className="w-full h-4 sm:h-7 md:h-12 block" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldCurveBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8C6923" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#F5D061" />
                <stop offset="50%" stopColor="#FFEAA7" />
                <stop offset="75%" stopColor="#F5D061" />
                <stop offset="100%" stopColor="#8C6923" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path d="M0,60 L0,28 Q720,-4 1440,28 L1440,60 Z" fill="#0E3821" />
            <path d="M0,28 Q720,-4 1440,28" fill="none" stroke="url(#goldCurveBorder)" strokeWidth="3" />
          </svg>
        </div>

        {/* Dark Green Content Container */}
        <div className="bg-[#0E3821] pb-2 sm:pb-3 md:pb-4 pt-0.5 sm:pt-1 md:pt-2 px-3 sm:px-4 text-center space-y-0.5 sm:space-y-1.5 shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
          {/* Address with Yellow Location Pin */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-white text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide leading-tight">
            <MapPin size={11} className="text-[#F2C558] fill-[#F2C558] shrink-0 sm:w-[14px] sm:h-[14px]" />
            <span className="truncate max-w-[340px] sm:max-w-none">CƠM PHẦN ÚT TRINH • 158A Trần Vĩnh Kiết, P. An Bình, Q. Ninh Kiều, TP. Cần Thơ</span>
          </div>

          {/* Copyright with Flanking Subtle Gold Hairlines */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[#C2D6C6] text-[8px] sm:text-[10px] md:text-xs font-mono tracking-wider">
            <span className="w-5 sm:w-10 md:w-16 h-[1px] bg-[#CBB07E]/40" />
            <span>© 2026 CƠM PHẦN ÚT TRINH. ALL RIGHTS RESERVED.</span>
            <span className="w-5 sm:w-10 md:w-16 h-[1px] bg-[#CBB07E]/40" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LanguageGateway;
