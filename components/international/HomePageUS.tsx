import React, { useState, useMemo } from 'react';
import { CountryCode } from '../../countryConfig';
import { CountrySelectorBar } from '../CountrySelectorBar';
import { 
  AMERICAN_CATEGORIES, 
  localizeDishForAmerican, 
  AmericanDishDisplay, 
  DELIVERY_LINKS 
} from '../../services/americanDishHelper';
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
  Heart,
  ThumbsUp,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Flame
} from 'lucide-react';

interface CartItem {
  dish: AmericanDishDisplay;
  quantity: number;
}

interface HomePageUSProps {
  menu: any[];
  heroSlides?: any[];
  isLoading?: boolean;
  selectedCountry: CountryCode;
  onSelectCountry: (code: CountryCode) => void;
  currentTheme?: any;
  onThemeChange?: (theme: any) => void;
}

export const HomePageUS: React.FC<HomePageUSProps> = ({
  menu = [],
  selectedCountry,
  onSelectCountry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalDish, setActiveModalDish] = useState<AmericanDishDisplay | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showTakeawayModal, setShowTakeawayModal] = useState<boolean>(false);
  const [showHowToOrderModal, setShowHowToOrderModal] = useState<boolean>(false);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Localize and standardize dishes from the real restaurant database
  const localizedDishes = useMemo(() => {
    const list = Array.isArray(menu) ? menu : [];
    return list.map((dish, idx) => localizeDishForAmerican(dish, idx));
  }, [menu]);

  // Filter dishes by category and search query
  const filteredDishes = useMemo(() => {
    let result = localizedDishes;

    if (selectedCategory !== 'all') {
      const catObj = AMERICAN_CATEGORIES.find(c => c.id === selectedCategory);
      if (catObj) {
        result = result.filter(dish => {
          const dishCat = (dish.category || '').toLowerCase();
          if (selectedCategory === 'main') return dishCat.includes('chính') || dishCat.includes('main');
          if (selectedCategory === 'soup') return dishCat.includes('canh') || dishCat.includes('soup');
          if (selectedCategory === 'stirfry') return dishCat.includes('xào') || dishCat.includes('stir');
          if (selectedCategory === 'vegetable') return dishCat.includes('rau') || dishCat.includes('veg');
          if (selectedCategory === 'drink') return dishCat.includes('nước') || dishCat.includes('uống') || dishCat.includes('drink');
          return dishCat.includes(catObj.categoryKey.toLowerCase());
        });
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.englishName.toLowerCase().includes(q) ||
        d.originalName.toLowerCase().includes(q) ||
        d.englishDesc.toLowerCase().includes(q)
      );
    }

    return result;
  }, [localizedDishes, selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (dish: AmericanDishDisplay, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.dish.id === dish.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, { dish, quantity: 1 }];
    });

    setToastMessage(`Added "${dish.englishName}" to your order!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.dish.numericPrice * item.quantity, 0);
  }, [cart]);

  const scrollToMenu = () => {
    const el = document.getElementById('us-menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.getElementById('us-services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('us-contact-footer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#1E293B] font-sans antialiased selection:bg-red-100 selection:text-red-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-[#0F203C] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER BAR: Country Selector + Quick Info + Delivery Apps */}
      <header className="sticky top-0 z-50 bg-[#FDFCF7]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
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
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-slate-600">
            {/* Opening Hours */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-bold text-slate-700">
              <Clock size={13} className="text-[#EA580C]" />
              <span>OPEN DAILY 10:00 AM - 6:00 PM</span>
            </div>

            {/* Location */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-1.5 text-[11px] bg-white/90 hover:bg-white px-3 py-1 rounded-full border border-slate-200 hover:border-red-500 text-slate-700 hover:text-red-700 transition-colors cursor-pointer shadow-2xs font-bold"
              title="View restaurant location"
            >
              <MapPin size={13} className="text-[#C4141A]" />
              <span>Our Location Can Tho, Vietnam</span>
            </button>

            {/* Delivery Apps */}
            <div className="flex items-center gap-1.5">
              <a
                href={DELIVERY_LINKS.grab}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00B14F] hover:bg-[#009A44] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer"
                title="Order on GrabFood"
              >
                <span>GrabFood</span>
              </a>
              <a
                href={DELIVERY_LINKS.shopee}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer"
                title="Order on ShopeeFood"
              >
                <span>ShopeeFood</span>
              </a>
              <a
                href={DELIVERY_LINKS.xanhsm}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0088D6] hover:bg-[#0074B7] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer"
                title="Order on Xanh SM"
              >
                <span>Xanh SM</span>
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
          <div className="w-full flex items-center justify-center gap-2">
            <a
              href={DELIVERY_LINKS.grab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00B14F] hover:bg-[#009A44] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
              title="Order on GrabFood"
            >
              <span>GrabFood</span>
            </a>
            <a
              href={DELIVERY_LINKS.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
              title="Order on ShopeeFood"
            >
              <span>ShopeeFood</span>
            </a>
            <a
              href={DELIVERY_LINKS.xanhsm}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0088D6] hover:bg-[#0074B7] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
              title="Order on Xanh SM"
            >
              <span>Xanh SM</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN NAVIGATION HEADER: Logo + Nav Links + Search + Cart */}
      <nav className="bg-white/95 border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 md:w-13 md:h-13 rounded-2xl bg-[#0F203C] flex items-center justify-center text-white p-2 shadow-md group-hover:scale-105 transition-transform">
              <Flame size={24} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-2xl font-black tracking-tight text-[#0F203C] uppercase leading-none font-serif-custom">
                  CƠM PHẦN ÚT TRINH
                </span>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-[#C4141A] uppercase tracking-widest block leading-tight mt-0.5">
                VIETNAMESE HOMEMADE MEALS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 rounded-full bg-[#C4141A] text-white text-xs font-black uppercase tracking-wider shadow-sm hover:bg-[#A81015] transition-all cursor-pointer"
              >
                HOME
              </button>
              <button
                type="button"
                onClick={scrollToMenu}
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-[#C4141A] hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                MENU
              </button>
              <button
                type="button"
                onClick={scrollToAbout}
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-[#C4141A] hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                ABOUT
              </button>
              <button
                type="button"
                onClick={() => setShowHowToOrderModal(true)}
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-[#C4141A] hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                HOW TO ORDER
              </button>
              <button
                type="button"
                onClick={scrollToContact}
                className="px-3.5 py-2 rounded-full text-slate-700 hover:text-[#C4141A] hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                CONTACT
              </button>
            </div>

            {/* Search Toggle */}
            <button
              type="button"
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Search menu"
            >
              <Search size={18} />
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setShowCartModal(true)}
              className="relative w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#C4141A] hover:bg-[#A81015] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
              title="View Cart / Current Order"
            >
              <ShoppingCart size={20} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-[#0F203C] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearchBar && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish name, chicken, beef, soup, fish..."
                className="flex-1 bg-transparent border-none text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 3. HERO SECTION: Authentic VIETNAMESE MEALS by Út Trinh */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFCF7] via-white to-[#F8F6EF] pt-8 md:pt-14 pb-12 md:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline & Value Badges */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8">
              
              <div className="space-y-2">
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-serif-custom italic text-[#C4141A] font-bold tracking-wide">
                  Authentic
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0F203C] uppercase leading-[0.95]">
                  VIETNAMESE
                </h1>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#C4141A] uppercase leading-[0.95]">
                    MEALS
                  </span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-serif-custom italic text-slate-700 font-semibold">
                    by Út Trinh
                  </span>
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-sm sm:text-base font-bold text-slate-600 tracking-wide uppercase flex flex-wrap items-center gap-2">
                <span>Fresh Ingredients</span>
                <span className="text-slate-300 font-normal">|</span>
                <span>Homemade Taste</span>
                <span className="text-slate-300 font-normal">|</span>
                <span>Great Value</span>
              </p>

              {/* 3 Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* 1. Fresh Ingredients */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <Leaf size={20} />
                  </div>
                  <div className="leading-tight">
                    <span className="text-[11px] font-black uppercase text-slate-900 block tracking-tight">
                      FRESH INGREDIENTS
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Daily supply
                    </span>
                  </div>
                </div>

                {/* 2. Homemade Flavor */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0">
                    <Heart size={20} />
                  </div>
                  <div className="leading-tight">
                    <span className="text-[11px] font-black uppercase text-slate-900 block tracking-tight">
                      HOMEMADE FLAVOR
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Just like home
                    </span>
                  </div>
                </div>

                {/* 3. Great Value */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0">
                    <ThumbsUp size={20} />
                  </div>
                  <div className="leading-tight">
                    <span className="text-[11px] font-black uppercase text-slate-900 block tracking-tight">
                      GREAT VALUE
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Delicious & satisfying
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Bento Box Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="/assets/us/hero-bento.png"
                  alt="Authentic Vietnamese Bento Box by Cơm Phần Út Trinh"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* 5 Bottom Action Buttons: Dine In, Take Away, GrabFood, ShopeeFood, Xanh SM */}
          <div className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Dine In */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Store size={18} />
              <span>DINE IN</span>
            </button>

            {/* Take Away */}
            <button
              type="button"
              onClick={() => setShowTakeawayModal(true)}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Package size={18} />
              <span>TAKE AWAY</span>
            </button>

            {/* GrabFood */}
            <a
              href={DELIVERY_LINKS.grab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#00B14F] hover:bg-[#009A44] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Bike size={18} />
              <span>GrabFood</span>
            </a>

            {/* ShopeeFood */}
            <a
              href={DELIVERY_LINKS.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#EE4D2D] hover:bg-[#D73211] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>ShopeeFood</span>
            </a>

            {/* Xanh SM */}
            <a
              href={DELIVERY_LINKS.xanhsm}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#0088D6] hover:bg-[#0074B7] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Xanh SM</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY NAVIGATION: 6 Interactive Cards */}
      <section className="py-8 md:py-12 px-4 sm:px-6 bg-[#FDFCF7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {AMERICAN_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <div
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    scrollToMenu();
                  }}
                  className={`group relative rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-between border ${
                    isActive 
                      ? 'bg-white border-[#C4141A] shadow-lg scale-102 ring-2 ring-[#C4141A]/20' 
                      : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs hover:shadow-md'
                  }`}
                >
                  {/* Category 3D Illustration */}
                  <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src={category.iconSrc}
                      alt={category.nameEn}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="w-full space-y-1">
                    {isActive ? (
                      <div className="w-full py-1.5 px-2 rounded-full bg-[#C4141A] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                        {category.nameEn}
                      </div>
                    ) : (
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-[#C4141A] transition-colors">
                        {category.nameEn}
                      </h3>
                    )}
                    <p className="text-[10px] text-slate-500 font-medium">
                      {category.subEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED DISHES SECTION: 👑 FEATURED DISHES */}
      <section id="us-menu-section" className="py-10 md:py-16 px-4 sm:px-6 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">
                  <span className="text-[#C4141A]">FEATURED </span>
                  <span className="text-[#0F203C]">DISHES</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
                Our most popular meals – loved by our customers!
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-bold text-slate-600 hover:text-[#C4141A] underline cursor-pointer"
                >
                  Clear Category Filter
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  scrollToMenu();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C4141A] text-[#C4141A] hover:bg-[#C4141A] hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>VIEW ALL MENU</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Dish Cards Grid */}
          {filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => setActiveModalDish(dish)}
                  className="group bg-[#FDFCF7] rounded-3xl overflow-hidden border border-slate-200 hover:border-[#C4141A]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Dish Image + Badge */}
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.englishName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {dish.badge === 'RECOMMENDED' ? (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#F59E0B] text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-md">
                          ★ RECOMMENDED
                        </span>
                      ) : dish.badge === 'SIGNATURE' ? (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0F203C] text-amber-400 text-[10px] font-black uppercase tracking-wider shadow-md">
                          ★ SIGNATURE
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#C4141A] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                          ★ POPULAR
                        </span>
                      )}
                    </div>

                    {/* Dish Information */}
                    <div className="p-5 space-y-2">
                      <div>
                        <h3 className="font-black text-slate-900 text-base md:text-lg group-hover:text-[#C4141A] transition-colors leading-snug line-clamp-1">
                          {dish.englishName}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5 line-clamp-1">
                          {dish.originalName}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {dish.englishDesc}
                      </p>
                    </div>
                  </div>

                  {/* Price and Add to Cart Action */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-base font-black text-[#C4141A] tracking-tight">
                      {dish.priceDisplay}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => addToCart(dish, e)}
                      className="w-9 h-9 rounded-xl bg-[#C4141A] hover:bg-[#A81015] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                      title="Add to order"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-3">
              <p className="text-slate-500 font-bold">No dishes found matching your criteria.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-full bg-[#C4141A] text-white text-xs font-black uppercase tracking-wider"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. 3 SERVICE BANNERS: DINE IN, FAST DELIVERY, TAKE AWAY */}
      <section id="us-services-section" className="py-12 md:py-16 px-4 sm:px-6 bg-[#FDFCF7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#C4141A]">
              OUR COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F203C]">
              HOW YOU CAN ENJOY ÚT TRINH
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Whether dining in our cozy restaurant or having warm meals delivered to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* 1. DINE IN AT ÚT TRINH */}
            <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 bg-white flex flex-col justify-between group">
              <div
                onClick={() => setShowLocationModal(true)}
                className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer bg-stone-100"
                title="Click to view Dine In location"
              >
                <img
                  src="/assets/us/service-dinein.png"
                  alt="Dine In at Út Trinh - Cozy and friendly space"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 truncate">
                  <Store size={14} className="text-[#991B1B] shrink-0" />
                  <span className="truncate">158A Trần Vĩnh Kiết, Cần Thơ</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  <span>VIEW LOCATION</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* 2. FAST DELIVERY */}
            <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 bg-white flex flex-col justify-between group">
              <div
                className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100"
              >
                <img
                  src="/assets/us/service-delivery.png"
                  alt="Fast Delivery - Order easily via apps and get meals delivered"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <Bike size={14} className="text-[#00B14F]" />
                  <span>Order on Apps:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={DELIVERY_LINKS.grab}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#00B14F] hover:bg-[#009A44] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    GrabFood
                  </a>
                  <a
                    href={DELIVERY_LINKS.shopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    ShopeeFood
                  </a>
                  <a
                    href={DELIVERY_LINKS.xanhsm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#0088D6] hover:bg-[#0074B7] text-white text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    Xanh SM
                  </a>
                </div>
              </div>
            </div>

            {/* 3. TAKE AWAY */}
            <div className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 bg-white flex flex-col justify-between group">
              <div
                onClick={() => setShowTakeawayModal(true)}
                className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer bg-stone-100"
                title="Click to order Take Away"
              >
                <img
                  src="/assets/us/service-takeaway.png"
                  alt="Take Away - Same great taste anywhere you go"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 truncate">
                  <Phone size={14} className="text-[#D97706] shrink-0" />
                  <span className="truncate">Hotline: 0939.709.020</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTakeawayModal(true)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  <span>ORDER NOW</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BOTTOM CONTACT BAR & FOOTER */}
      <footer id="us-contact-footer" className="bg-[#FAF7EE] border-t border-slate-200 relative overflow-hidden">
        
        {/* Contact Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            
            {/* Brand & Slogan */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F203C] flex items-center justify-center text-white p-2">
                  <Flame size={20} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#0F203C] uppercase leading-none font-serif-custom">
                    CƠM PHẦN ÚT TRINH
                  </h4>
                  <span className="text-[10px] font-bold text-[#C4141A] uppercase tracking-wider block mt-0.5">
                    VIETNAMESE HOMEMADE MEALS
                  </span>
                </div>
              </div>
              <p className="text-sm font-serif-custom italic text-slate-700">
                Open the box and it's delicious! ♡
              </p>
            </div>

            {/* Order by phone */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C4141A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Phone size={18} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  ORDER BY PHONE
                </span>
                <a
                  href={DELIVERY_LINKS.phoneTel}
                  className="text-base sm:text-lg font-black text-slate-900 hover:text-[#C4141A] transition-colors"
                >
                  {DELIVERY_LINKS.phone}
                </a>
              </div>
            </div>

            {/* Our Location */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C4141A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <MapPin size={18} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  OUR LOCATION
                </span>
                <a
                  href={DELIVERY_LINKS.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#C4141A] transition-colors leading-relaxed block"
                >
                  158A Trần Vĩnh Kiết, An Bình, Cần Thơ, Vietnam
                </a>
              </div>
            </div>

            {/* Open Daily */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C4141A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Clock size={18} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  OPEN DAILY
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-800 block">
                  10:00 AM - 6:00 PM
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Skyline Watermark Artwork */}
        <div className="w-full opacity-40 select-none pointer-events-none">
          <img
            src="/assets/us/skyline-watermark.png"
            alt=""
            className="w-full h-8 sm:h-12 object-cover object-bottom"
          />
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-500 font-medium">
          <p>© 2026 Cơm Phần Út Trinh. Authentic Vietnamese Homemade Meals — Premium American Dining Edition.</p>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* 1. DISH DETAIL MODAL */}
      {activeModalDish && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setActiveModalDish(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-[16/10] bg-slate-900">
              <img
                src={activeModalDish.image}
                alt={activeModalDish.englishName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveModalDish(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              {activeModalDish.badge && (
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#C4141A] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  ★ {activeModalDish.badge}
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-black text-[#C4141A] uppercase tracking-widest block">
                  {activeModalDish.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">
                  {activeModalDish.englishName}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {activeModalDish.originalName}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {activeModalDish.englishDesc}
              </p>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price</span>
                <span className="text-xl font-black text-[#C4141A]">
                  {activeModalDish.priceDisplay}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(activeModalDish);
                    setActiveModalDish(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#C4141A] hover:bg-[#A81015] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  <span>ADD TO ORDER</span>
                </button>
                <a
                  href={DELIVERY_LINKS.grab}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-2xl bg-[#00B14F] hover:bg-[#009A44] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>GrabFood</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SHOPPING CART / CURRENT ORDER MODAL */}
      {showCartModal && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowCartModal(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#FDFCF7]">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#C4141A]" />
                <h3 className="font-black text-lg text-slate-900 uppercase">
                  YOUR ORDER ({totalCartCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCartModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {cart.length > 0 ? (
                cart.map(({ dish, quantity }) => (
                  <div
                    key={dish.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5"
                  >
                    <img
                      src={dish.image}
                      alt={dish.englishName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {dish.englishName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                        {dish.originalName}
                      </p>
                      <span className="text-xs font-black text-[#C4141A] block mt-0.5">
                        {(dish.numericPrice * quantity).toLocaleString('en-US')} VND
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(dish.id, -1)}
                        className="text-slate-500 hover:text-slate-900 p-0.5"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-xs font-black text-slate-800 w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(dish.id, 1)}
                        className="text-slate-500 hover:text-slate-900 p-0.5"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(dish.id)}
                      className="text-slate-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <ShoppingCart size={48} className="text-slate-200" />
                  <p className="text-slate-500 font-bold text-sm">Your order is empty.</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Browse our signature dishes and click the cart icon to add your favorite Vietnamese meals.
                  </p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-[#FAF7EE] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-[#C4141A]">
                    {totalCartAmount.toLocaleString('en-US')} VND
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Ordering Tip:</strong> You can call our hotline or use delivery apps (GrabFood / ShopeeFood) to receive your meal hot and fresh!
                </div>

                <div className="space-y-2">
                  <a
                    href={DELIVERY_LINKS.phoneTel}
                    className="w-full py-3.5 rounded-2xl bg-[#C4141A] hover:bg-[#A81015] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Phone size={16} />
                    <span>CALL TO ORDER: {DELIVERY_LINKS.phone}</span>
                  </a>

                  <div className="flex gap-2">
                    <a
                      href={DELIVERY_LINKS.grab}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-[#00B14F] text-white font-black text-[10px] uppercase tracking-wider text-center"
                    >
                      Grab
                    </a>
                    <a
                      href={DELIVERY_LINKS.shopee}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-[#EE4D2D] text-white font-black text-[10px] uppercase tracking-wider text-center"
                    >
                      Shopee
                    </a>
                    <a
                      href={DELIVERY_LINKS.xanhsm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-[#0088D6] text-white font-black text-[10px] uppercase tracking-wider text-center"
                    >
                      Xanh SM
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LOCATION & DINE-IN MODAL */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store size={22} className="text-[#C4141A]" />
                <h3 className="font-black text-xl text-slate-900 uppercase">
                  DINE IN AT ÚT TRINH
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black text-[#C4141A] uppercase tracking-wider block">
                  RESTAURANT ADDRESS
                </span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  158A Trần Vĩnh Kiết, An Bình, Cần Thơ, Vietnam
                </p>
                <p className="text-xs text-slate-500">
                  Located in the heart of Can Tho city, comfortable seating with air conditioning and traditional Vietnamese family hospitality.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    OPENING HOURS
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">
                    10:00 AM - 6:00 PM Daily
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    HOTLINE
                  </span>
                  <a
                    href={DELIVERY_LINKS.phoneTel}
                    className="text-xs font-black text-[#C4141A] block mt-1 hover:underline"
                  >
                    {DELIVERY_LINKS.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={DELIVERY_LINKS.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 rounded-2xl bg-[#C4141A] hover:bg-[#A81015] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MapPin size={16} />
                <span>OPEN IN GOOGLE MAPS</span>
              </a>
              <a
                href={DELIVERY_LINKS.phoneTel}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone size={16} />
                <span>CALL NOW</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAKE AWAY / HOW TO ORDER MODAL */}
      {(showTakeawayModal || showHowToOrderModal) && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => { setShowTakeawayModal(false); setShowHowToOrderModal(false); }}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={22} className="text-[#D97706]" />
                <h3 className="font-black text-xl text-slate-900 uppercase">
                  HOW TO ORDER & TAKE AWAY
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowTakeawayModal(false); setShowHowToOrderModal(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D97706] text-white text-xs font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Select Your Favorite Dishes
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Browse our full menu online, check prices and ingredients.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#C4141A] text-white text-xs font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Place Your Order
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Call our hotline <strong>0939.709.020</strong> for instant take away preparation, or order via GrabFood / ShopeeFood.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Enjoy Fresh & Hot!
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pick up your boxed meal at 158A Tran Vinh Kiet or get it delivered straight to your door.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={DELIVERY_LINKS.phoneTel}
                className="flex-1 py-3.5 rounded-2xl bg-[#C4141A] hover:bg-[#A81015] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone size={16} />
                <span>CALL 0939.709.020</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setShowTakeawayModal(false);
                  setShowHowToOrderModal(false);
                  scrollToMenu();
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                BROWSE MENU
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePageUS;
