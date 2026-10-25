import React, { useState, useMemo } from 'react';
import { CountryCode } from '../../countryConfig';
import { CountrySelectorBar } from '../CountrySelectorBar';
import { 
  JAPANESE_CATEGORIES, 
  localizeDishForJapanese, 
  JapaneseDishDisplay, 
  DELIVERY_LINKS 
} from '../../services/japaneseDishHelper';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShoppingCart, 
  ExternalLink, 
  X, 
  ChevronRight, 
  Search,
  Store,
  Bike,
  Package,
  Leaf,
  Soup,
  ThumbsUp
} from 'lucide-react';

interface HomePageJPProps {
  menu: any[];
  heroSlides?: any[];
  isLoading?: boolean;
  selectedCountry: CountryCode;
  onSelectCountry: (code: CountryCode) => void;
  currentTheme?: any;
  onThemeChange?: (theme: any) => void;
}

export const HomePageJP: React.FC<HomePageJPProps> = ({
  menu = [],
  selectedCountry,
  onSelectCountry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalDish, setActiveModalDish] = useState<JapaneseDishDisplay | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showTakeawayModal, setShowTakeawayModal] = useState<boolean>(false);
  const [showOrderGuideModal, setShowOrderGuideModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  // Chuẩn hóa và bản địa hóa danh sách món ăn từ hệ thống thực tế
  const localizedDishes = useMemo(() => {
    const list = Array.isArray(menu) ? menu : [];
    return list.map((dish, idx) => localizeDishForJapanese(dish, idx));
  }, [menu]);

  // Lọc món theo danh mục và tìm kiếm
  const filteredDishes = useMemo(() => {
    let result = localizedDishes;

    if (selectedCategory !== 'all') {
      const catObj = JAPANESE_CATEGORIES.find(c => c.id === selectedCategory);
      if (catObj) {
        result = result.filter(dish => {
          const dishCat = (dish.category || '').toLowerCase();
          const targetCat = catObj.categoryKey.toLowerCase();
          if (selectedCategory === 'main') return dishCat.includes('chính') || dishCat.includes('main');
          if (selectedCategory === 'soup') return dishCat.includes('canh') || dishCat.includes('soup');
          if (selectedCategory === 'stirfry') return dishCat.includes('xào') || dishCat.includes('stir');
          if (selectedCategory === 'vegetable') return dishCat.includes('rau') || dishCat.includes('veg');
          if (selectedCategory === 'drink') return dishCat.includes('nước') || dishCat.includes('uống') || dishCat.includes('drink');
          return dishCat.includes(targetCat);
        });
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.japaneseName.toLowerCase().includes(q) ||
        d.originalName.toLowerCase().includes(q) ||
        d.japaneseDesc.toLowerCase().includes(q)
      );
    }

    return result;
  }, [localizedDishes, selectedCategory, searchQuery]);

  const scrollToMenu = () => {
    const el = document.getElementById('jp-menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241a13] font-jp-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] shadow-2xs">
        {/* Desktop View (>= 640px): 100% Unchanged */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-3 sm:px-6 h-12 md:h-14 items-center justify-between gap-2">
          
          {/* Left: 4-Country Selector */}
          <div className="flex items-center">
            <CountrySelectorBar
              selectedCountry={selectedCountry}
              onSelectCountry={onSelectCountry}
            />
          </div>

          {/* Right: Info & Delivery Badges */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-stone-600">
            {/* Hours */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] bg-white/80 px-2.5 py-1 rounded-full border border-stone-200">
              <Clock size={13} className="text-[#C5301E]" />
              <span>営業時間 10:00 - 18:00</span>
            </div>

            {/* Location */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-1.5 text-[11px] bg-white/80 hover:bg-white px-2.5 py-1 rounded-full border border-stone-200 hover:border-[#C5301E] transition-colors cursor-pointer"
            >
              <MapPin size={13} className="text-[#C5301E]" />
              <span>店舗の場所 Cần Thơ, Vietnam</span>
            </button>

            {/* Delivery Partner Badges */}
            <div className="flex items-center gap-1.5 pl-1">
              <a
                href={DELIVERY_LINKS.grab}
                target="_blank"
                rel="noopener noreferrer"
                title="GrabFood Cần Thơ"
                className="w-7 h-7 md:w-8 md:h-8 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xs"
              >
                <img src="/assets/kr/badge-grabfood.png" alt="GrabFood" className="w-full h-full object-cover" />
              </a>
              <a
                href={DELIVERY_LINKS.shopee}
                target="_blank"
                rel="noopener noreferrer"
                title="ShopeeFood Cần Thơ"
                className="w-7 h-7 md:w-8 md:h-8 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xs"
              >
                <img src="/assets/kr/badge-shopeefood.png" alt="ShopeeFood" className="w-full h-full object-cover" />
              </a>
              <a
                href={DELIVERY_LINKS.xanhsm}
                target="_blank"
                rel="noopener noreferrer"
                title="Xanh SM"
                className="w-7 h-7 md:w-8 md:h-8 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-xs"
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

        {/* 2. MAIN NAV BAR (Washoku Edition) */}
        <div className="bg-[#FFFDF9] border-t border-[#EFE8DD] px-3 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Brand Logo & Japanese Title */}
            <div className="flex items-center gap-3">
              <img 
                src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" 
                alt="Út Trinh Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain" 
              />
              <div>
                <h1 className="text-lg md:text-2xl font-black font-jp-serif text-[#2a1c12] tracking-tight leading-none">
                  ウット チンのお弁当
                </h1>
                <p className="text-[10px] md:text-xs font-black tracking-widest text-[#934c1b] uppercase mt-0.5">
                  CƠM PHẦN ÚT TRINH
                </p>
              </div>
            </div>

            {/* Nav Menu Items */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-xs font-bold text-stone-700 font-jp-sans">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3.5 py-1.5 rounded-full bg-[#C5301E] text-white shadow-xs cursor-pointer"
              >
                ホーム
              </button>
              <button
                type="button"
                onClick={scrollToMenu}
                className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              >
                メニュー
              </button>
              <button
                type="button"
                onClick={scrollToMenu}
                className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              >
                おすすめ
              </button>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              >
                店舗情報
              </button>
              <button
                type="button"
                onClick={() => setShowOrderGuideModal(true)}
                className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              >
                ご注文方法
              </button>
            </nav>

            {/* Search & Cart Icons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSearchBar(!showSearchBar)}
                title="料理を検索"
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search size={16} />
              </button>
              <button
                type="button"
                onClick={() => setShowTakeawayModal(true)}
                title="カート / ご注文"
                className="w-9 h-9 rounded-full bg-[#C5301E] hover:bg-[#a82516] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <ShoppingCart size={16} />
              </button>
            </div>

          </div>

          {/* Search Dropdown (if toggled) */}
          {showSearchBar && (
            <div className="max-w-md mx-auto pt-2 pb-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="料理名を入力してください (例: チキン, 牛肉, スープ...)"
                  className="w-full bg-white border border-stone-300 rounded-full px-4 py-2 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5301E]/40"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 3. HERO SECTION (Modern Washoku Masterpiece) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE4] pt-6 md:pt-10 pb-8 md:pb-12 px-4 sm:px-6 border-b border-[#EBE3D5]">
        
        {/* Subtle Sakura petal background accents */}
        <div className="absolute top-2 left-2 text-rose-200/40 text-4xl select-none pointer-events-none">🌸</div>
        <div className="absolute bottom-6 right-6 text-rose-200/40 text-5xl select-none pointer-events-none">🌸</div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Calligraphy Title, Slogan, and Features */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              
              {/* Red Calligraphy Subtitle + Main Title */}
              <div className="space-y-1">
                <p className="text-sm md:text-base font-bold text-[#C5301E] font-jp-serif tracking-widest">
                  ベトナム・カントーの味を
                </p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-jp-serif text-[#21160f] tracking-tight leading-none">
                  お弁当に
                </h2>
                <div className="w-48 h-1 bg-gradient-to-r from-[#C5301E] via-[#C5301E]/80 to-transparent rounded-full mt-2 mx-auto lg:mx-0" />
              </div>

              {/* Catchphrase */}
              <div className="space-y-2">
                <p className="text-xl sm:text-2xl md:text-3xl font-black font-jp-serif text-[#2b1c12] tracking-wide leading-snug">
                  開けた瞬間、<br className="hidden sm:inline" />
                  おいしさが広がる。
                </p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                  ベトナム南部カントーの伝統家庭料理を、出来たての美味しさそのままにお弁当に詰め込みました。
                </p>
              </div>

              {/* 3 Round Feature Badges (Sepia Washoku Circles) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-[#E3DACB] shadow-2xs flex flex-col items-center text-center space-y-1">
                  <div className="w-9 h-9 rounded-full bg-[#EFE8DD] flex items-center justify-center text-[#593d25] border border-[#D9CEBD]">
                    <Leaf size={16} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-stone-900 font-jp-serif">新鮮な食材</span>
                  <span className="text-[9px] text-stone-500 font-medium">毎日仕入れ</span>
                </div>

                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-[#E3DACB] shadow-2xs flex flex-col items-center text-center space-y-1">
                  <div className="w-9 h-9 rounded-full bg-[#EFE8DD] flex items-center justify-center text-[#593d25] border border-[#D9CEBD]">
                    <Soup size={16} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-stone-900 font-jp-serif">家庭の味</span>
                  <span className="text-[9px] text-stone-500 font-medium">やさしく深い味</span>
                </div>

                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-[#E3DACB] shadow-2xs flex flex-col items-center text-center space-y-1">
                  <div className="w-9 h-9 rounded-full bg-[#EFE8DD] flex items-center justify-center text-[#593d25] border border-[#D9CEBD]">
                    <ThumbsUp size={16} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-stone-900 font-jp-serif">手頃な価格</span>
                  <span className="text-[9px] text-stone-500 font-medium">満足のボリューム</span>
                </div>
              </div>

            </div>

            {/* Right Column: Master Hero Bento Graphic with Mount Fuji & Hinomaru */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative group max-w-2xl w-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/50 via-rose-100/30 to-emerald-100/30 rounded-[32px] blur-xl transform group-hover:scale-102 transition-transform" />
                <img
                  src="/assets/jp/hero-bento-composition.png"
                  alt="ウット チンのお弁当 - 本場の味を 毎日の食卓に"
                  className="relative z-10 w-full h-auto object-contain rounded-2xl drop-shadow-xl"
                />
              </div>
            </div>

          </div>

          {/* 3 Hero CTA Action Buttons Row (Under Hero) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-8 max-w-4xl mx-auto">
            
            {/* 1. 店内でお食事 (Tại chỗ) */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="bg-gradient-to-r from-[#BC2C1A] to-[#C5301E] hover:from-[#A82516] hover:to-[#B52917] text-white rounded-full py-3.5 px-5 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Store size={18} />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-black block font-jp-serif">店内でお食事</span>
                <span className="text-[10px] text-white/80 block">Tại chỗ</span>
              </div>
            </button>

            {/* 2. お持ち帰り (Mang về) */}
            <button
              type="button"
              onClick={() => setShowTakeawayModal(true)}
              className="bg-gradient-to-r from-[#EFE6D7] to-[#E5D8C3] hover:from-[#E8DEC9] hover:to-[#DCCDB6] text-[#3c2817] border border-[#D5C6AF] rounded-full py-3.5 px-5 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#3c2817]/10 flex items-center justify-center shrink-0 text-[#3c2817]">
                <Package size={18} />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-black block font-jp-serif">お持ち帰り</span>
                <span className="text-[10px] text-[#3c2817]/70 block">Mang về</span>
              </div>
            </button>

            {/* 3. デリバリー注文 (Delivery) */}
            <a
              href={DELIVERY_LINKS.grab}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#1E6B3E] to-[#257F4A] hover:from-[#185933] hover:to-[#1E6B3E] text-white rounded-full py-3.5 px-5 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bike size={18} />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-black block font-jp-serif">デリバリー注文</span>
                <span className="text-[9px] text-white/80 block">GrabFood • ShopeeFood • Xanh SM</span>
              </div>
            </a>

          </div>

        </div>
      </section>

      {/* 4. MENU CATEGORIES SECTION (6 Washi Round Cards) */}
      <section id="jp-menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="bg-[#FFFDF9] rounded-[32px] p-4 sm:p-6 border border-[#EBE3D5] shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {JAPANESE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-50/80 to-rose-50/60 border-2 border-[#C5301E] shadow-md scale-102'
                      : 'hover:bg-stone-50 border border-transparent hover:border-stone-200'
                  }`}
                >
                  <div className="w-20 h-16 sm:w-24 sm:h-20 mb-2 flex items-center justify-center">
                    <img 
                      src={cat.iconSrc} 
                      alt={cat.nameJp} 
                      className="max-h-full max-w-full object-contain drop-shadow-xs transition-transform group-hover:scale-108" 
                    />
                  </div>
                  <span className={`text-xs sm:text-sm font-black font-jp-serif tracking-tight ${isActive ? 'text-[#C5301E]' : 'text-stone-900'}`}>
                    {cat.nameJp}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {cat.subVn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. RECOMMENDED MENU SECTION (おすすめメニュー) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        
        {/* Banner Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          
          <div className="flex items-center gap-3">
            <img 
              src="/assets/jp/title-recommend.png" 
              alt="おすすめメニュー" 
              className="h-10 md:h-12 object-contain" 
            />
            <span className="text-xs sm:text-sm font-medium text-stone-600 hidden sm:inline font-jp-serif">
              ウット チンの人気メニューをぜひお試しください
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-bold font-jp-sans transition-all hover:border-[#C5301E] cursor-pointer shadow-2xs"
          >
            <span>すべてのメニューを見る</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Dish Cards Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setActiveModalDish(dish)}
              className="bg-[#FFFDF9] rounded-[24px] overflow-hidden border border-[#EBE3D5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Dish Image */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.japaneseName}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/jp/dish-chicken.png';
                  }}
                />
              </div>

              {/* Dish Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-black font-jp-serif text-stone-900 text-base sm:text-lg tracking-tight group-hover:text-[#C5301E] transition-colors line-clamp-1">
                    {dish.japaneseName}
                  </h3>
                  <p className="text-[11px] font-bold text-[#934c1b] uppercase tracking-wide">
                    {dish.originalName}
                  </p>
                  <p className="text-xs text-stone-500 font-medium line-clamp-2 pt-1 leading-relaxed">
                    {dish.japaneseDesc}
                  </p>
                </div>

                {/* Price & Cart button */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-base sm:text-lg font-black text-[#C5301E] tabular-nums font-jp-serif">
                    {dish.priceDisplay}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalDish(dish);
                    }}
                    title="注文する / Xem chi tiết"
                    className="w-9 h-9 rounded-full bg-[#C5301E] hover:bg-[#a62516] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 6. SERVICES SECTION (3 Japanese Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Card 1: 店内でお食事 */}
          <div 
            onClick={() => setShowLocationModal(true)}
            className="bg-[#FFFDF9] rounded-[24px] overflow-hidden border border-[#EBE3D5] shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="grid grid-cols-12 items-center p-4 gap-4">
              <div className="col-span-5 rounded-2xl overflow-hidden aspect-[4/3]">
                <img 
                  src="/assets/jp/service-dinein-img.png" 
                  alt="店内でお食事" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="col-span-7 space-y-1 text-left">
                <h3 className="font-black font-jp-serif text-stone-900 text-base sm:text-lg">
                  店内でお食事
                </h3>
                <p className="text-xs text-stone-500 leading-snug">
                  落ち着いた空間で ゆっくりとお食事を お楽しみください
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-stone-100 bg-[#FAF6EE] flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Tại quán</span>
              <span className="inline-flex items-center gap-1 text-xs font-black text-[#C5301E] group-hover:translate-x-0.5 transition-transform">
                店舗の場所を見る ❯
              </span>
            </div>
          </div>

          {/* Card 2: デリバリー注文 */}
          <div className="bg-[#FFFDF9] rounded-[24px] overflow-hidden border border-[#EBE3D5] shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
            <div className="grid grid-cols-12 items-center p-4 gap-4">
              <div className="col-span-5 rounded-2xl overflow-hidden aspect-[4/3]">
                <img 
                  src="/assets/jp/service-delivery-img.png" 
                  alt="デリバリー注文" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="col-span-7 space-y-1 text-left">
                <h3 className="font-black font-jp-serif text-stone-900 text-base sm:text-lg">
                  デリバリー注文
                </h3>
                <p className="text-xs text-stone-500 leading-snug">
                  アプリで簡単注文 できたてのお弁当を お届けします
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-stone-100 bg-[#FAF6EE] flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Giao tận nơi</span>
              <div className="flex gap-1.5">
                <a
                  href={DELIVERY_LINKS.grab}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                >
                  Grab
                </a>
                <a
                  href={DELIVERY_LINKS.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold"
                >
                  Shopee
                </a>
                <a
                  href={DELIVERY_LINKS.xanhsm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold"
                >
                  Xanh
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: お持ち帰り */}
          <div 
            onClick={() => setShowTakeawayModal(true)}
            className="bg-[#FFFDF9] rounded-[24px] overflow-hidden border border-[#EBE3D5] shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="grid grid-cols-12 items-center p-4 gap-4">
              <div className="col-span-5 rounded-2xl overflow-hidden aspect-[4/3]">
                <img 
                  src="/assets/jp/service-takeaway-img.png" 
                  alt="お持ち帰り" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="col-span-7 space-y-1 text-left">
                <h3 className="font-black font-jp-serif text-stone-900 text-base sm:text-lg">
                  お持ち帰り
                </h3>
                <p className="text-xs text-stone-500 leading-snug">
                  ご自宅でも ウット チンの味を そのままに
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-stone-100 bg-[#FAF6EE] flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Mang về</span>
              <span className="inline-flex items-center gap-1 text-xs font-black text-[#C5301E] group-hover:translate-x-0.5 transition-transform">
                注文する ❯
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#FFFDF9] border-t border-[#EBE3D5] mt-10 pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-100 pb-8">
            
            {/* Logo & Slogan */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-3">
                <img src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" alt="Út Trinh" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-xl font-black font-jp-serif text-stone-900">ウット チンのお弁当</h3>
                  <p className="text-[10px] font-bold text-[#934c1b] uppercase tracking-widest">CƠM PHẦN ÚT TRINH</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                開けた瞬間、おいしさが広がる。 • Mở hộp là thấy ngon!
              </p>
            </div>

            {/* Contact Columns */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              
              {/* Phone */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <Phone size={14} className="text-[#C5301E]" />
                  <span>電話注文</span>
                </div>
                <a 
                  href={DELIVERY_LINKS.hotline} 
                  className="text-base font-black text-[#C5301E] hover:underline block"
                >
                  {DELIVERY_LINKS.hotlineDisplay}
                </a>
                <span className="text-[10px] text-stone-400">お持ち帰り・ご予約</span>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <MapPin size={14} className="text-[#C5301E]" />
                  <span>店舗の住所</span>
                </div>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {DELIVERY_LINKS.address}
                </p>
              </div>

              {/* Hours */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <Clock size={14} className="text-[#C5301E]" />
                  <span>営業時間</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {DELIVERY_LINKS.hours}
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Row & Switch to Vietnam */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>
              © 2026 CƠM PHẦN ÚT TRINH • Modern Washoku Edition •{' '}
              <a href={DELIVERY_LINKS.website} className="text-[#934c1b] font-bold hover:underline">
                www.comphanuttrinh.online
              </a>
            </p>

            <button
              type="button"
              onClick={() => onSelectCountry('VN')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>🇻🇳 ベトナム語版（オリジナル）</span>
            </button>
          </div>

        </div>
      </footer>

      {/* 8. DISH ORDER MODAL */}
      {activeModalDish && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4"
          onClick={() => setActiveModalDish(null)}
        >
          <div 
            className="bg-[#FFFDF9] rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-stone-100">
              <img
                src={activeModalDish.image}
                alt={activeModalDish.japaneseName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveModalDish(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-black font-jp-serif text-stone-900">
                  {activeModalDish.japaneseName}
                </h3>
                <p className="text-xs font-bold text-[#934c1b] uppercase tracking-wide">
                  {activeModalDish.originalName}
                </p>
                <p className="text-xs text-stone-500 font-medium mt-2 leading-relaxed">
                  {activeModalDish.japaneseDesc}
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-stone-100">
                <span className="text-xs font-bold text-stone-400">販売価格 (VNĐ)</span>
                <span className="text-2xl font-black text-[#C5301E] tabular-nums font-jp-serif">
                  {activeModalDish.priceDisplay}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={DELIVERY_LINKS.hotline}
                  className="w-full py-3.5 px-4 rounded-full bg-[#C5301E] hover:bg-[#a82516] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-jp-serif"
                >
                  <Phone size={16} />
                  <span>お電話で注文する ({DELIVERY_LINKS.hotlineDisplay})</span>
                </a>

                <div className="grid grid-cols-3 gap-1.5">
                  <a
                    href={DELIVERY_LINKS.grab}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Grab</span>
                    <ExternalLink size={10} />
                  </a>
                  <a
                    href={DELIVERY_LINKS.shopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Shopee</span>
                    <ExternalLink size={10} />
                  </a>
                  <a
                    href={DELIVERY_LINKS.xanhsm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-1.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
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

      {/* 9. LOCATION MODAL */}
      {showLocationModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4"
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            className="bg-[#FFFDF9] rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-[#C5301E]">
                  <MapPin size={16} />
                </div>
                <h3 className="text-lg font-black font-jp-serif text-stone-900">店舗の場所案内</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-stone-400 block">店舗住所 (Address)</span>
                <p className="font-bold text-stone-800 leading-snug">
                  158A đường Trần Vĩnh Kiết, Phường Tân An (An Bình), Quận Ninh Kiều, TP Cần Thơ, Vietnam
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 block">営業時間 (Hours)</span>
                <p className="font-bold text-stone-800">
                  毎日営業 10:00 - 18:00
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 block">お問合せ・ご予約</span>
                <p className="font-black text-[#C5301E] text-lg">
                  0939.709.020
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={DELIVERY_LINKS.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-jp-serif"
              >
                <MapPin size={16} />
                <span>Google Mapsでルートを検索</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. TAKEAWAY ORDER MODAL */}
      {showTakeawayModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4"
          onClick={() => setShowTakeawayModal(false)}
        >
          <div 
            className="bg-[#FFFDF9] rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#934c1b]">
                  <Package size={16} />
                </div>
                <h3 className="text-lg font-black font-jp-serif text-stone-900">お持ち帰り注文案内</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowTakeawayModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-stone-600 leading-relaxed font-medium">
              <p>
                <strong>ウット チンのお弁当</strong>は、温かく新鮮な状態でお包みいたします。
              </p>
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs space-y-1.5 text-stone-700">
                <p className="font-bold text-amber-900">💡 ご注文の手順:</p>
                <p>1. お電話 <strong>0939.709.020</strong> にてご注文の品と受取時間をお知らせください。</p>
                <p>2. 店舗（158A Trần Vĩnh Kiết）にてできたてのお弁当をお受け取りください。</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={DELIVERY_LINKS.hotline}
                className="w-full py-3.5 px-4 rounded-full bg-[#C5301E] hover:bg-[#a82516] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-jp-serif"
              >
                <Phone size={16} />
                <span>お電話で注文する</span>
              </a>

              <button
                type="button"
                onClick={() => setShowTakeawayModal(false)}
                className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. ORDERING GUIDE MODAL (ご注文方法) */}
      {showOrderGuideModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4"
          onClick={() => setShowOrderGuideModal(false)}
        >
          <div 
            className="bg-[#FFFDF9] rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black font-jp-serif text-stone-900">ご注文方法について</h3>
              <button 
                type="button" 
                onClick={() => setShowOrderGuideModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">1. 店内飲食 (店内でお食事)</span>
                <p>158A Trần Vĩnh Kiết（Cần Thơ）の店舗にお越しいただき、出来立てのお食事をお楽しみいただけます。</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">2. テイクアウト (お持ち帰り)</span>
                <p>お電話 <strong>0939.709.020</strong> にて事前にご注文いただくと、待ち時間なくお受け取りいただけます。</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block text-sm">3. デリバリー (Grab / Shopee / Xanh SM)</span>
                <p>各種フードデリバリーアプリより「Cơm Phần Út Trinh」を検索してご注文ください。</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowOrderGuideModal(false)}
              className="w-full py-2.5 px-4 rounded-full bg-[#C5301E] text-white text-xs font-bold cursor-pointer font-jp-serif"
            >
              わかりました
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePageJP;
