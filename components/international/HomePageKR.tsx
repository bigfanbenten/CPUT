import React, { useState, useMemo } from 'react';
import { CountryCode } from '../../countryConfig';
import { CountrySelectorBar } from '../CountrySelectorBar';
import { 
  KOREAN_CATEGORIES, 
  localizeDishForKorean, 
  KoreanDishDisplay, 
  DELIVERY_LINKS 
} from '../../services/koreanDishHelper';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShoppingCart, 
  ExternalLink, 
  X, 
  ChevronRight, 
  Heart,
  ThumbsUp,
  Leaf,
  Store,
  Bike,
  Package,
  Crown
} from 'lucide-react';

interface HomePageKRProps {
  menu: any[];
  heroSlides?: any[];
  isLoading?: boolean;
  selectedCountry: CountryCode;
  onSelectCountry: (code: CountryCode) => void;
  currentTheme?: any;
  onThemeChange?: (theme: any) => void;
}

export const HomePageKR: React.FC<HomePageKRProps> = ({
  menu = [],
  selectedCountry,
  onSelectCountry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalDish, setActiveModalDish] = useState<KoreanDishDisplay | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showTakeawayModal, setShowTakeawayModal] = useState<boolean>(false);

  // Chuẩn hóa và bản địa hóa toàn bộ danh sách món ăn từ database hiện có
  const localizedDishes = useMemo(() => {
    const list = Array.isArray(menu) ? menu : [];
    return list.map((dish, idx) => localizeDishForKorean(dish, idx));
  }, [menu]);

  // Lọc món ăn theo danh mục tiếng Hàn
  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'all') {
      return localizedDishes;
    }
    const catObj = KOREAN_CATEGORIES.find(c => c.id === selectedCategory);
    if (!catObj) return localizedDishes;

    return localizedDishes.filter(dish => {
      const dishCat = (dish.category || '').toLowerCase();
      const targetCat = catObj.categoryKey.toLowerCase();
      if (selectedCategory === 'main') return dishCat.includes('chính') || dishCat.includes('main');
      if (selectedCategory === 'soup') return dishCat.includes('canh') || dishCat.includes('soup');
      if (selectedCategory === 'stirfry') return dishCat.includes('xào') || dishCat.includes('stir');
      if (selectedCategory === 'vegetable') return dishCat.includes('rau') || dishCat.includes('veg');
      if (selectedCategory === 'drink') return dishCat.includes('nước') || dishCat.includes('uống') || dishCat.includes('drink');
      return dishCat.includes(targetCat);
    });
  }, [localizedDishes, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#2c1d11] font-kr antialiased selection:bg-pink-100 selection:text-pink-900">
      
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EFE8DD] shadow-2xs">
        {/* Desktop View (>= 640px): 100% Unchanged */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-3 sm:px-6 h-14 md:h-16 items-center justify-between gap-2">
          {/* Left: Country Selector */}
          <div className="flex items-center">
            <CountrySelectorBar
              selectedCountry={selectedCountry}
              onSelectCountry={onSelectCountry}
            />
          </div>

          {/* Right: Info & Delivery Badges */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-stone-600">
            {/* Hours */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] bg-white/80 px-2.5 py-1 rounded-full border border-stone-200">
              <Clock size={13} className="text-amber-700" />
              <span>영업시간 AM 10:00 - PM 6:00</span>
            </div>

            {/* Location */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-1.5 text-[11px] bg-white/80 hover:bg-white px-2.5 py-1 rounded-full border border-stone-200 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <MapPin size={13} className="text-rose-600" />
              <span>매장 위치 Cần Thơ, Vietnam</span>
            </button>

            {/* Delivery Partner Badges */}
            <div className="flex items-center gap-1.5 pl-1">
              <a
                href={DELIVERY_LINKS.grab}
                target="_blank"
                rel="noopener noreferrer"
                title="GrabFood Cần Thơ"
                className="w-8 h-8 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xs"
              >
                <img src="/assets/kr/badge-grabfood.png" alt="GrabFood" className="w-full h-full object-cover" />
              </a>
              <a
                href={DELIVERY_LINKS.shopee}
                target="_blank"
                rel="noopener noreferrer"
                title="ShopeeFood Cần Thơ"
                className="w-8 h-8 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xs"
              >
                <img src="/assets/kr/badge-shopeefood.png" alt="ShopeeFood" className="w-full h-full object-cover" />
              </a>
              <a
                href={DELIVERY_LINKS.xanhsm}
                target="_blank"
                rel="noopener noreferrer"
                title="Xanh SM"
                className="w-8 h-8 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xs"
              >
                <img src="/assets/kr/badge-xanhsm.png" alt="Xanh SM" className="w-full h-full object-cover" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile View (< 640px): 2 Clean Rows (Row 1: Country Selector, Row 2: Delivery Platforms) */}
        <div className="flex sm:hidden flex-col items-center justify-center py-2 px-2 gap-1.5 max-w-full">
          {/* Hàng 1 — COUNTRY SELECTOR */}
          <div className="w-full flex justify-center items-center">
            <CountrySelectorBar
              selectedCountry={selectedCountry}
              onSelectCountry={onSelectCountry}
            />
          </div>

          {/* Hàng 2 — DELIVERY PLATFORMS */}
          <div className="w-full flex items-center justify-center gap-3">
            <a
              href={DELIVERY_LINKS.grab}
              target="_blank"
              rel="noopener noreferrer"
              title="GrabFood Cần Thơ"
              className="w-7 h-7 rounded-lg overflow-hidden hover:scale-105 active:scale-95 transition-transform shadow-xs shrink-0 flex items-center justify-center"
            >
              <img src="/assets/kr/badge-grabfood.png" alt="GrabFood" className="w-full h-full object-cover" />
            </a>
            <a
              href={DELIVERY_LINKS.shopee}
              target="_blank"
              rel="noopener noreferrer"
              title="ShopeeFood Cần Thơ"
              className="w-7 h-7 rounded-lg overflow-hidden hover:scale-105 active:scale-95 transition-transform shadow-xs shrink-0 flex items-center justify-center"
            >
              <img src="/assets/kr/badge-shopeefood.png" alt="ShopeeFood" className="w-full h-full object-cover" />
            </a>
            <a
              href={DELIVERY_LINKS.xanhsm}
              target="_blank"
              rel="noopener noreferrer"
              title="Xanh SM"
              className="w-7 h-7 rounded-lg overflow-hidden hover:scale-105 active:scale-95 transition-transform shadow-xs shrink-0 flex items-center justify-center"
            >
              <img src="/assets/kr/badge-xanhsm.png" alt="Xanh SM" className="w-full h-full object-cover" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF8] to-[#FBF8F0] pt-6 md:pt-10 pb-8 md:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Brand & Slogan */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              
              {/* Brand Logo & Name */}
              <div className="inline-flex items-center gap-3">
                <img 
                  src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" 
                  alt="Út Trinh Logo" 
                  className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-2xl drop-shadow-sm" 
                />
                <div className="text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3c2212] tracking-tight leading-tight">
                    웃트찐 도시락
                  </h1>
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#935220]">
                    CƠM PHẦN ÚT TRINH
                  </p>
                </div>
              </div>

              {/* Slogan */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 justify-center lg:justify-start">
                  <Leaf className="text-emerald-600 fill-emerald-500 w-6 h-6 animate-bounce" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3c2212] tracking-tight">
                    뚜껑을 열면, 바로 맛있다! ♡
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  베트남 껀터(Cần Thơ) 전통 가정식 Cơm Phần을 매일 정성껏 도시락에 담아냅니다.
                </p>
              </div>

              {/* 3 Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#EBE3D5] shadow-xs flex flex-col items-center text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Leaf size={16} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-stone-800">신선한 재료</span>
                  <span className="text-[9px] text-stone-400 hidden sm:block">매일 신선한 식재료</span>
                </div>

                <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#EBE3D5] shadow-xs flex flex-col items-center text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <Heart size={16} className="fill-rose-500" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-stone-800">베트남 가정식</span>
                  <span className="text-[9px] text-stone-400 hidden sm:block">정성 가득한 손맛</span>
                </div>

                <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#EBE3D5] shadow-xs flex flex-col items-center text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <ThumbsUp size={16} className="fill-amber-500" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-stone-800">합리적인 가격</span>
                  <span className="text-[9px] text-stone-400 hidden sm:block">맛있고 든든한 한 끼</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Mascot Girl & Bento Box Image */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative group max-w-lg w-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-pink-200/30 to-emerald-200/30 rounded-[36px] blur-xl transform group-hover:scale-105 transition-transform" />
                <img
                  src="/assets/kr/hero-mascot-bento.png"
                  alt="웃트찐 도시락 - 뚜껑을 열면 바로 맛있다"
                  className="relative z-10 w-full h-auto object-contain rounded-[32px] drop-shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* 5 Service Action Buttons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 pt-8">
            
            {/* 1. Dine In */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full py-3 px-3 sm:px-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Store size={15} />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-black block">매장에서 식사하기</span>
                <span className="text-[9px] text-white/80 block">직접 오셔서 즐기세요</span>
              </div>
            </button>

            {/* 2. Takeaway */}
            <button
              type="button"
              onClick={() => setShowTakeawayModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full py-3 px-3 sm:px-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Package size={15} />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-black block">포장 주문</span>
                <span className="text-[9px] text-white/80 block">Take Away</span>
              </div>
            </button>

            {/* 3. GrabFood */}
            <a
              href={DELIVERY_LINKS.grab}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full py-3 px-3 sm:px-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bike size={15} />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wide">GrabFood</span>
            </a>

            {/* 4. ShopeeFood */}
            <a
              href={DELIVERY_LINKS.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full py-3 px-3 sm:px-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <ShoppingCart size={15} />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wide">ShopeeFood</span>
            </a>

            {/* 5. Xanh SM */}
            <a
              href={DELIVERY_LINKS.xanhsm}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 sm:col-span-1 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white rounded-full py-3 px-3 sm:px-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bike size={15} />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wide">Xanh SM</span>
            </a>

          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="bg-white rounded-[32px] p-3 sm:p-5 border border-[#EBE3D5] shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {KOREAN_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-50 to-orange-50/60 border-2 border-amber-400 shadow-md scale-102'
                      : 'hover:bg-stone-50 border border-transparent hover:border-stone-200'
                  }`}
                >
                  <div className="w-16 h-12 sm:w-20 sm:h-14 mb-2 flex items-center justify-center">
                    <img 
                      src={cat.iconSrc} 
                      alt={cat.nameKr} 
                      className="max-h-full max-w-full object-contain drop-shadow-xs transition-transform group-hover:scale-110" 
                    />
                  </div>
                  <span className={`text-xs sm:text-sm font-black tracking-tight ${isActive ? 'text-amber-900' : 'text-stone-800'}`}>
                    {cat.nameKr}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {cat.descKr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. POPULAR MENU SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Crown size={20} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                인기 메뉴
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                웃트찐의 대표 베트남 전통 요리를 만나보세요!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-black transition-all hover:border-amber-400 cursor-pointer shadow-2xs"
          >
            <span>모든 메뉴 보기</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setActiveModalDish(dish)}
              className="bg-white rounded-[26px] overflow-hidden border border-[#EDE5D8] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Dish Image + Badge */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.koreanName}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/kr/dish-chicken.png';
                  }}
                />
                
                {/* Badge Tag on top-left */}
                {dish.badge && (
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow-md ${
                      dish.badge.type === 'popular'
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : dish.badge.type === 'signature'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                        : 'bg-gradient-to-r from-amber-600 to-yellow-600'
                    }`}>
                      {dish.badge.type === 'popular' && '🔥'}
                      {dish.badge.type === 'signature' && '⭐'}
                      {dish.badge.type === 'recommended' && '👍'}
                      <span>{dish.badge.text}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Dish Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-black text-stone-900 text-base sm:text-lg tracking-tight group-hover:text-amber-800 transition-colors line-clamp-1">
                    {dish.koreanName}
                  </h3>
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    {dish.originalName}
                  </p>
                  <p className="text-xs text-stone-500 font-medium line-clamp-2 pt-1">
                    {dish.koreanDesc}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-base sm:text-lg font-black text-[#2e1c10] tabular-nums">
                    {dish.priceDisplay}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalDish(dish);
                    }}
                    title="주문하기 / Xem chi tiết"
                    className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. SERVICES SECTION (3 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Card 1: 매장에서 식사하기 */}
          <div 
            onClick={() => setShowLocationModal(true)}
            className="bg-white rounded-[28px] overflow-hidden border border-[#EDE5D8] shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="overflow-hidden aspect-[16/9]">
              <img 
                src="/assets/kr/service-dinein-card.png" 
                alt="매장에서 식사하기" 
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" 
              />
            </div>
            <div className="p-5 flex items-center justify-between border-t border-stone-100 bg-[#FFFDF9]">
              <div>
                <span className="text-xs text-stone-400 font-bold block">Dine In</span>
                <span className="text-sm font-black text-stone-900">매장 위치 및 안내</span>
              </div>
              <button 
                type="button"
                className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs"
              >
                매장 위치 보기
              </button>
            </div>
          </div>

          {/* Card 2: 빠른 배달 주문 */}
          <div className="bg-white rounded-[28px] overflow-hidden border border-[#EDE5D8] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="overflow-hidden aspect-[16/9]">
              <img 
                src="/assets/kr/service-delivery-card.png" 
                alt="빠른 배달 주문" 
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" 
              />
            </div>
            <div className="p-5 flex items-center justify-between border-t border-stone-100 bg-[#FFFDF9]">
              <div>
                <span className="text-xs text-stone-400 font-bold block">Delivery Apps</span>
                <span className="text-sm font-black text-stone-900">배달 앱으로 간편 주문</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <a
                  href={DELIVERY_LINKS.grab}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black"
                >
                  Grab
                </a>
                <a
                  href={DELIVERY_LINKS.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black"
                >
                  Shopee
                </a>
                <a
                  href={DELIVERY_LINKS.xanhsm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black"
                >
                  Xanh SM
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: 포장 주문 */}
          <div 
            onClick={() => setShowTakeawayModal(true)}
            className="bg-white rounded-[28px] overflow-hidden border border-[#EDE5D8] shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="overflow-hidden aspect-[16/9]">
              <img 
                src="/assets/kr/service-takeaway-card.png" 
                alt="포장 주문" 
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" 
              />
            </div>
            <div className="p-5 flex items-center justify-between border-t border-stone-100 bg-[#FFFDF9]">
              <div>
                <span className="text-xs text-stone-400 font-bold block">Take Away</span>
                <span className="text-sm font-black text-stone-900">도시락 포장 주문</span>
              </div>
              <button 
                type="button"
                className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs"
              >
                포장 주문하기
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-[#EDE5D8] mt-8 pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-100 pb-8">
            
            {/* Logo & Slogan */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-3">
                <img src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" alt="Út Trinh" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-xl font-black text-stone-900">웃트찐 도시락</h3>
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">CƠM PHẦN ÚT TRINH</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                🍃 뚜껑을 열면, 바로 맛있다! • Mở hộp là thấy ngon!
              </p>
            </div>

            {/* Contact Details */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              
              {/* Phone */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <Phone size={14} className="text-amber-800" />
                  <span>전화 주문</span>
                </div>
                <a 
                  href={DELIVERY_LINKS.hotline} 
                  className="text-base font-black text-amber-900 hover:text-amber-700 block transition-colors"
                >
                  {DELIVERY_LINKS.hotlineDisplay}
                </a>
                <span className="text-[10px] text-stone-400">포장 & 단체 주문 문의</span>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <MapPin size={14} className="text-rose-600" />
                  <span>매장 주소</span>
                </div>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {DELIVERY_LINKS.address}
                </p>
              </div>

              {/* Hours */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <Clock size={14} className="text-amber-800" />
                  <span>영업시간</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {DELIVERY_LINKS.hours}
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Bar & Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>
              © 2026 CƠM PHẦN ÚT TRINH • K-Food Cute Edition •{' '}
              <a href={DELIVERY_LINKS.website} className="text-amber-800 font-bold hover:underline">
                www.comphanuttrinh.online
              </a>
            </p>

            <button
              type="button"
              onClick={() => onSelectCountry('VN')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>🇻🇳 Giao diện tiếng Việt (Bản gốc)</span>
            </button>
          </div>

        </div>
      </footer>

      {/* 7. DISH ORDER MODAL */}
      {activeModalDish && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setActiveModalDish(null)}
        >
          <div 
            className="bg-white rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-[16/10] bg-stone-100">
              <img
                src={activeModalDish.image}
                alt={activeModalDish.koreanName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveModalDish(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              {activeModalDish.badge && (
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-md">
                  {activeModalDish.badge.text}
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-black text-stone-900">
                  {activeModalDish.koreanName}
                </h3>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  {activeModalDish.originalName}
                </p>
                <p className="text-xs text-stone-500 font-medium mt-2 leading-relaxed">
                  {activeModalDish.koreanDesc}
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-stone-100">
                <span className="text-xs font-bold text-stone-400">판매 가격 (VNĐ)</span>
                <span className="text-2xl font-black text-amber-900 tabular-nums">
                  {activeModalDish.priceDisplay}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={DELIVERY_LINKS.hotline}
                  className="w-full py-3.5 px-4 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Phone size={16} />
                  <span>전화 주문하기 ({DELIVERY_LINKS.hotlineDisplay})</span>
                </a>

                <div className="grid grid-cols-3 gap-1.5">
                  <a
                    href={DELIVERY_LINKS.grab}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Grab</span>
                    <ExternalLink size={10} />
                  </a>
                  <a
                    href={DELIVERY_LINKS.shopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Shopee</span>
                    <ExternalLink size={10} />
                  </a>
                  <a
                    href={DELIVERY_LINKS.xanhsm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Xanh SM</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. LOCATION MODAL */}
      {showLocationModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <MapPin size={16} />
                </div>
                <h3 className="text-lg font-black text-stone-900">매장 위치 안내</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-stone-400 block">식당 주소 (Address)</span>
                <p className="font-bold text-stone-800 leading-snug">
                  158A đường Trần Vĩnh Kiết, Phường Tân An (An Bình), Quận Ninh Kiều, TP Cần Thơ, Vietnam
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 block">영업시간 (Hours)</span>
                <p className="font-bold text-stone-800">
                  매일 운영 AM 10:00 - PM 6:00
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 block">문의 & 예약 전화</span>
                <p className="font-black text-amber-800 text-lg">
                  0939.709.020
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={DELIVERY_LINKS.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MapPin size={16} />
                <span>Google Maps에서 매장 길찾기</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. TAKEAWAY ORDER MODAL */}
      {showTakeawayModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setShowTakeawayModal(false)}
        >
          <div 
            className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <Package size={16} />
                </div>
                <h3 className="text-lg font-black text-stone-900">도시락 포장 주문 안내</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowTakeawayModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-stone-600 leading-relaxed font-medium">
              <p>
                <strong>웃트찐 도시락</strong>은 따뜻하고 신선한 상태로 정성껏 포장해 드립니다.
              </p>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-1">
                <p className="font-bold text-amber-900">💡 포장 주문 방법:</p>
                <p>1. 핫라인 <strong>0939.709.020</strong>으로 전화하여 원하시는 메뉴를 말씀해 주세요.</p>
                <p>2. 매장(158A Trần Vĩnh Kiết)에 방문하셔서 갓 조리된 도시락을 바로 수령하세요!</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={DELIVERY_LINKS.hotline}
                className="w-full py-3.5 px-4 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Phone size={16} />
                <span>핫라인으로 포장 주문하기</span>
              </a>

              <button
                type="button"
                onClick={() => setShowTakeawayModal(false)}
                className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePageKR;
