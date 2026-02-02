
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH CỐ ĐỊNH (Hardcoded vĩnh viễn) ---
const DEFAULT_URL = 'https://qrzfpeeuohzfquzfiebc.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemZwZWV1b2h6ZnF1emZpZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY4MDgsImV4cCI6MjA4NDMyMjgwOH0.tyzhzbucriL09bH-ndgXs3ob1-Www97vsfQ6Wsh8d7s';
const DEFAULT_PUB_KEY = 'sb_publishable_4ysVX0qYKCboZkhJwmYRCA_Ycxpk5Cu';

enum Category {
  All = 'Tất Cả',
  MainCourse = 'Món Chính',
  Soup = 'Món Canh',
  StirFry = 'Món Xào',
  Vegetable = 'Món Rau',
  Drink = 'Nước Uống'
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: Category;
}

interface HeroSlide {
  id: string;
  image_url: string;
  quote: string;
}

const CONFIG_KEY = 'ut-trinh-config-v9';
const VIEW_COUNT_KEY = 'ut-trinh-total-views-v10';
const SESSION_VISIT_KEY = 'ut-trinh-session-visited-v10';

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[80] bg-white/95 backdrop-blur-xl border-b border-stone-100 px-4 md:px-20 h-20 md:h-24 flex items-center justify-between transition-all">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xl rounded-sm group-hover:bg-amber-800 transition-colors shrink-0">Ú</div>
          <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 whitespace-nowrap">
            <span className="text-sm md:text-2xl font-black text-amber-700 uppercase tracking-tighter">CƠM PHẦN</span>
            <span className="text-sm md:text-2xl font-black text-stone-900 uppercase tracking-tighter">ÚT TRINH</span>
          </div>
        </div>

        {/* Right: Actions Order: [THỰC ĐƠN] [MENU ẢNH] [Logos] */}
        <div className="flex gap-4 md:gap-8 items-center">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all">Thoát Quản Trị</button>
          ) : (
            <>
              <a href="#menu" className="text-stone-900 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-amber-700 hidden sm:block">THỰC ĐƠN</a>
              <button 
                onClick={() => setShowConciseMenu(true)} 
                className="bg-amber-800 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-stone-900 transition-all"
              >
                MENU ẢNH
              </button>
              <div className="flex items-center gap-3 md:gap-4 ml-2 border-l border-stone-100 pl-4">
                <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-6 md:h-8 object-contain rounded-md" alt="Grab" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png" className="h-6 md:h-8 object-contain" alt="Shopee" />
              </div>
            </>
          )}
        </div>
      </nav>

      {showConciseMenu && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-950/95 backdrop-blur-2xl p-4" onClick={() => setShowConciseMenu(false)}>
          <img src="https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg" className="max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20" alt="Menu" />
          <button className="absolute top-5 right-5 text-white text-5xl hover:scale-120 transition-transform">×</button>
        </div>
      )}
    </>
  );
};

const HomePage = ({ menu, heroSlides, isLoading }: any) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>(Category.All);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevDish, setPrevDish] = useState<Dish | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Thống kê view và online chính xác
  const [totalViews, setTotalViews] = useState(300);
  const [onlineCount, setOnlineCount] = useState(12);

  useEffect(() => {
    // Xử lý tổng lượt xem (Lưu vào localStorage để tích lũy)
    const savedViews = localStorage.getItem(VIEW_COUNT_KEY);
    let currentViews = savedViews ? parseInt(savedViews) : 300;
    
    // Nếu chưa ghé thăm trong phiên trình duyệt này, tăng view
    const sessionVisited = sessionStorage.getItem(SESSION_VISIT_KEY);
    if (!sessionVisited) {
      currentViews += 1;
      localStorage.setItem(VIEW_COUNT_KEY, currentViews.toString());
      sessionStorage.setItem(SESSION_VISIT_KEY, 'true');
    }
    setTotalViews(currentViews);

    // Xử lý thực khách đang xem (Dao động tự nhiên dựa trên thời gian thực)
    const updateOnlineCount = () => {
      const date = new Date();
      const hour = date.getHours();
      let baseOnline = 10;

      // Giờ vàng (Ăn trưa & tối)
      if ((hour >= 11 && hour <= 13) || (hour >= 18 && hour <= 20)) {
        baseOnline = 45;
      } else if (hour >= 9 && hour <= 21) {
        baseOnline = 25;
      }

      const fluctuation = Math.floor(Math.random() * 8) - 4; // Dao động +/- 4
      setOnlineCount(Math.max(5, baseOnline + fluctuation));
    };

    updateOnlineCount();
    const onlineInterval = setInterval(updateOnlineCount, 8000);
    return () => clearInterval(onlineInterval);
  }, []);

  // Auto-slide cho Hero (5 giây)
  useEffect(() => {
    if (!heroSlides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const filteredMenu = useMemo(() => {
    let list = activeFilter === Category.All ? [...menu] : menu.filter((item: Dish) => item.category === activeFilter);
    return list.sort(() => 0.5 - Math.random());
  }, [menu, activeFilter]);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const paginatedMenu = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMenu.slice(start, start + itemsPerPage);
  }, [filteredMenu, currentPage]);

  // Slideshow cho Modal (15 giây)
  useEffect(() => {
    if (selectedIdx === null) return;
    const interval = setInterval(() => {
      setPrevDish(filteredMenu[selectedIdx]);
      setSelectedIdx((prev) => (prev !== null ? (prev + 1) % filteredMenu.length : null));
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedIdx, filteredMenu]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setPrevDish(filteredMenu[selectedIdx]);
      setSelectedIdx((selectedIdx + 1) % filteredMenu.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setPrevDish(filteredMenu[selectedIdx]);
      setSelectedIdx((selectedIdx - 1 + filteredMenu.length) % filteredMenu.length);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amber-800 font-black tracking-widest uppercase text-[10px]">Đang chuẩn bị mâm cơm...</p>
      </div>
    </div>
  );

  const selectedDish = selectedIdx !== null ? filteredMenu[selectedIdx] : null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      
      {/* Hero Header Slider */}
      <header className="relative h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide: HeroSlide, index: number) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${index === currentSlide ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-110 rotate-1'}`}>
            <img src={slide.image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/20 to-stone-950/80"></div>
          </div>
        ))}
        <div className="relative z-20 text-center px-6 max-w-5xl">
          <span className="text-amber-400 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-6 block animate-pulse">Tinh hoa ẩm thực Việt</span>
          <h1 className="text-white text-5xl md:text-[130px] font-black tracking-tighter leading-none mb-8 drop-shadow-2xl">ÚT TRINH<br/><span className="text-amber-500 italic">KITCHEN</span></h1>
          <p className="text-white/90 text-lg md:text-3xl font-light italic leading-relaxed">"{heroSlides[currentSlide]?.quote || 'Nơi lưu giữ hương vị cơm nhà truyền thống'}"</p>
        </div>
        <div className="absolute bottom-12 flex gap-3 z-30">
          {heroSlides.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-amber-500' : 'w-4 bg-white/30 hover:bg-white/50'}`}></button>
          ))}
        </div>
      </header>

      {/* Main Menu Section */}
      <main id="menu" className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase text-stone-900">Món Ngon Đặc Sản</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 border-b border-stone-100 pb-8">
            {Object.values(Category).map((cat) => (
              <button 
                key={cat} 
                onClick={() => { setActiveFilter(cat); setCurrentPage(1); }}
                className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${activeFilter === cat ? 'border-amber-800 text-amber-800' : 'border-transparent text-stone-300 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {paginatedMenu.map((dish: Dish) => (
            <div 
              key={dish.id} 
              onClick={() => {
                setPrevDish(null);
                setSelectedIdx(filteredMenu.findIndex(d => d.id === dish.id));
              }}
              className="bg-white rounded-[40px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-700 cursor-pointer group p-6"
            >
              <div className="aspect-square rounded-[35px] overflow-hidden mb-8 relative">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute top-5 right-5 bg-stone-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{dish.category}</div>
              </div>
              <div className="px-2 space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                  <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tighter leading-tight group-hover:text-amber-800 transition-colors">{dish.name}</h3>
                  <span className="text-amber-800 font-black text-2xl tracking-tighter">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic line-clamp-2 leading-relaxed">"{dish.description || 'Hương vị gia truyền đậm đà bản sắc.'}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Buttons (9 món / trang) */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(prev => prev - 1); document.getElementById('menu')?.scrollIntoView(); }}
              className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 hover:text-white transition-all font-bold"
            >
              ←
            </button>
            <span className="text-stone-400 font-black tracking-widest text-[10px] uppercase">Trang {currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(prev => prev + 1); document.getElementById('menu')?.scrollIntoView(); }}
              className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 hover:text-white transition-all font-bold"
            >
              →
            </button>
          </div>
        )}
      </main>

      {/* Cinematic Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl" onClick={() => setSelectedIdx(null)}>
          <style>{`
            @keyframes crossfade-in {
              from { opacity: 0; transform: scale(1.1); filter: blur(15px); }
              to { opacity: 1; transform: scale(1); filter: blur(0); }
            }
            @keyframes crossfade-out {
              from { opacity: 1; transform: scale(1); }
              to { opacity: 0; transform: scale(0.95); }
            }
            .animate-cinematic-in { animation: crossfade-in 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-cinematic-out { animation: crossfade-out 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            @keyframes slide-up-text {
              from { transform: translateY(40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-text-cinematic { animation: slide-up-text 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}</style>

          <div className="absolute inset-x-6 md:inset-x-16 top-1/2 -translate-y-1/2 flex justify-between items-center z-[180] pointer-events-none">
            <button onClick={handlePrev} className="w-16 h-16 md:w-28 md:h-28 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center text-3xl hover:bg-amber-800 transition-all pointer-events-auto active:scale-90 shadow-2xl backdrop-blur-xl">←</button>
            <button onClick={handleNext} className="w-16 h-16 md:w-28 md:h-28 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center text-3xl hover:bg-amber-800 transition-all pointer-events-auto active:scale-90 shadow-2xl backdrop-blur-xl">→</button>
          </div>

          <div className="w-full h-full md:w-[94vw] md:h-[88vh] bg-white md:rounded-[70px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedIdx(null)} className="absolute top-8 right-8 md:top-12 md:right-12 z-[190] text-stone-300 hover:text-stone-900 text-6xl transition-all hover:rotate-90 duration-500">×</button>

            <div className="w-full h-[45vh] md:h-auto md:w-[58%] relative bg-black overflow-hidden">
              {prevDish && (
                <div className="absolute inset-0 z-10 animate-cinematic-out">
                  <img src={prevDish.image_url} className="w-full h-full object-cover" />
                </div>
              )}
              <img key={selectedDish.id} src={selectedDish.image_url} className="w-full h-full object-cover relative z-20 animate-cinematic-in" />
            </div>

            <div className="flex-1 p-12 md:p-24 flex flex-col justify-center bg-white">
              <div key={`txt-${selectedDish.id}`} className="animate-text-cinematic space-y-10">
                <div>
                   <span className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px] md:text-xs block mb-4">Út Trinh Kitchen</span>
                   <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-stone-900">{selectedDish.name}</h2>
                </div>
                <div className="text-4xl md:text-7xl font-black text-amber-800 tabular-nums tracking-tighter">{selectedDish.price}</div>
                <p className="text-stone-500 text-lg md:text-2xl italic font-light leading-relaxed max-w-xl">"{selectedDish.description || 'Sự kết hợp hoàn hảo giữa nguyên liệu tươi ngon và tâm huyết người đầu bếp.'}"</p>
                <div className="pt-8"><span className="bg-stone-950 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">{selectedDish.category}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer đầy đủ Stats & Info */}
      <footer className="bg-stone-950 text-white pt-32 pb-16 px-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-900 via-amber-500 to-amber-900 opacity-30"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 items-start mb-24">
          <div className="col-span-1 md:col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-stone-950 flex items-center justify-center font-black text-2xl rounded-sm">Ú</div>
              <span className="text-2xl font-black tracking-tighter">ÚT TRINH</span>
            </div>
            <p className="text-stone-500 text-sm italic font-light leading-relaxed max-w-xs">"Hơn cả một bữa ăn, đó là tình thân, là kỷ niệm của những bữa cơm gia đình quây quần."</p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600">Liên hệ</h4>
            <div className="space-y-4 text-stone-400 text-sm">
              <p className="font-bold text-white">158A/5 Trần Vĩnh Kiết, Ninh Kiều, Cần Thơ</p>
              <p className="tabular-nums font-black text-2xl text-white">0939.70.90.20</p>
              <p className="text-stone-500">Mở cửa: 09:00 AM - 06:30 PM</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600">Thống kê</h4>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
              <div className="space-y-1">
                <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Tổng lượt xem</span>
                <p className="text-3xl font-black tabular-nums text-white">{totalViews.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Thực khách đang xem
                </span>
                <p className="text-3xl font-black tabular-nums text-white">{onlineCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600">Đặt trực tuyến</h4>
            <div className="flex gap-4">
               {/* Chừa chỗ cho Logo QR sau này */}
               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 opacity-50">
                  <span className="text-[8px] uppercase tracking-tighter text-stone-600">QR COMING</span>
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-center items-center text-stone-600 text-[9px] font-black uppercase tracking-[0.5em]">
          <p>© 2026 CƠM PHẦN ÚT TRINH — NINH KIỀU, CẦN THƠ - EST 2019</p>
        </div>
      </footer>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>('menu');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  return (
    <div className="min-h-screen bg-stone-100 pt-32 pb-20 px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto bg-white rounded-[50px] shadow-2xl overflow-hidden border border-stone-200">
        <div className="flex bg-stone-50 border-b border-stone-200 p-3 gap-2">
          {['menu', 'hero', 'config'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-xl text-stone-900 border border-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
              {tab === 'menu' ? '🍱 Thực Đơn' : tab === 'hero' ? '🖼️ Ảnh Bìa' : '⚙️ Cấu Hình'}
            </button>
          ))}
        </div>

        <div className="p-10 md:p-20">
          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto py-12 space-y-12">
              <h2 className="text-5xl font-black uppercase text-center tracking-tighter">KẾT NỐI DATABASE</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">1. Supabase URL</p>
                  <input placeholder="https://..." value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full bg-stone-50 border-2 p-5 rounded-3xl outline-none focus:border-stone-900 font-mono text-xs shadow-inner" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">2. Publishable Key</p>
                  <input placeholder="sb_publishable_..." value={localConfig.pubKey} onChange={e => setLocalConfig({...localConfig, pubKey: e.target.value})} className="w-full bg-stone-50 border-2 p-5 rounded-3xl outline-none focus:border-stone-900 font-mono text-xs shadow-inner" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">3. Anon Key (Khóa vĩnh viễn đã được điền sẵn)</p>
                  <input placeholder="eyJhbGci..." value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full bg-stone-50 border-2 p-5 rounded-3xl outline-none focus:border-stone-900 font-mono text-xs shadow-inner" />
                </div>
                <button onClick={() => { setSupabaseConfig(localConfig); alert("Cấu hình database đã được lưu!"); }} className="w-full bg-stone-950 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Lưu Cấu Hình Mãi Mãi</button>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-4xl font-black uppercase">Danh Sách Thực Đơn</h2>
                <div className="flex gap-4">
                  <button onClick={onSave} className="bg-stone-900 text-white px-8 py-3 text-[10px] font-black uppercase rounded-2xl shadow-xl hover:bg-stone-800 transition-all">Đồng Bộ Cloud</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Tên món mới', price: '0 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="bg-amber-800 text-white px-8 py-3 text-[10px] font-black uppercase rounded-2xl shadow-xl hover:bg-amber-700 transition-all">+ Thêm Món</button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {menu.map((dish: Dish, i: number) => (
                  <div key={dish.id} className="p-8 border border-stone-100 bg-stone-50 rounded-[40px] flex flex-col md:flex-row gap-8 relative hover:border-amber-200 transition-colors group">
                    <img src={dish.image_url || 'https://placehold.co/200x200'} className="w-24 h-24 rounded-2xl object-cover shadow-lg bg-white" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="Tên món" value={dish.name} onChange={e => { const m = [...menu]; m[i].name = e.target.value; setMenu(m); }} className="bg-white border p-4 rounded-xl font-bold shadow-sm" />
                      <input placeholder="Giá" value={dish.price} onChange={e => { const m = [...menu]; m[i].price = e.target.value; setMenu(m); }} className="bg-white border p-4 rounded-xl font-black text-amber-800 shadow-sm" />
                      <select value={dish.category} onChange={e => { const m = [...menu]; m[i].category = e.target.value as Category; setMenu(m); }} className="bg-white border p-4 rounded-xl font-black uppercase text-[10px] shadow-sm">
                        {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input placeholder="Link ảnh (PostImg/Imgur...)" value={dish.image_url} onChange={e => { const m = [...menu]; m[i].image_url = e.target.value; setMenu(m); }} className="md:col-span-3 bg-white border p-4 rounded-xl font-mono text-xs shadow-sm" />
                    </div>
                    <button onClick={() => { if(confirm("Xóa món này?")) setMenu(menu.filter(d => d.id !== dish.id)); }} className="text-stone-300 hover:text-red-500 text-3xl font-light">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-12">
               <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-4xl font-black uppercase">Slide Trang Chủ</h2>
                <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: '' }])} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase rounded-2xl shadow-xl">+ Thêm Slide</button>
              </div>
              <div className="grid grid-cols-1 gap-10">
                {heroSlides.map((slide: HeroSlide, i: number) => (
                  <div key={slide.id} className="p-10 border border-stone-100 bg-stone-50 rounded-[45px] flex flex-col gap-8 shadow-sm">
                    <div className="relative aspect-[21/9] w-full rounded-[30px] overflow-hidden bg-stone-200 border border-stone-100">
                      <img src={slide.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input placeholder="Link ảnh Hero" value={slide.image_url} onChange={e => { const s = [...heroSlides]; s[i].image_url = e.target.value; setHeroSlides(s); }} className="w-full border p-5 rounded-2xl font-mono text-xs shadow-sm" />
                      <input placeholder="Slogan hiển thị trên ảnh" value={slide.quote} onChange={e => { const s = [...heroSlides]; s[i].quote = e.target.value; setHeroSlides(s); }} className="w-full border p-5 rounded-2xl italic shadow-sm" />
                    </div>
                    <button onClick={() => setHeroSlides(heroSlides.filter(s => s.id !== slide.id))} className="text-red-500 font-bold uppercase text-[9px] tracking-widest self-center hover:scale-110 transition-transform">Xóa slide này</button>
                  </div>
                ))}
              </div>
              <button onClick={onSave} className="w-full bg-stone-900 text-white py-8 rounded-[40px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-black transition-all">Lưu & Xuất Bản Slide</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [supabaseConfig, setSupabaseConfig] = useState(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) return JSON.parse(saved);
    return { url: DEFAULT_URL, key: DEFAULT_ANON_KEY, pubKey: DEFAULT_PUB_KEY };
  });

  const [menu, setMenu] = useState<Dish[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hash, setHash] = useState(window.location.hash);

  const supabase = useMemo(() => createClient(supabaseConfig.url, supabaseConfig.key), [supabaseConfig]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: dishes } = await supabase.from('dishes').select('*');
      const { data: slides } = await supabase.from('hero_slides').select('*');
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
    } catch (e) { console.error("Database connection error:", e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(supabaseConfig));
    fetchData();
  }, [supabaseConfig, fetchData]);

  useEffect(() => {
    const h = () => setHash(window.location.hash);
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('id', '0');
      await supabase.from('hero_slides').delete().neq('id', '0');
      const sanitize = (list: any[]) => list.map(({ id, created_at, ...rest }) => rest);
      if (menu.length) await supabase.from('dishes').insert(sanitize(menu));
      if (heroSlides.length) await supabase.from('hero_slides').insert(sanitize(heroSlides));
      alert("Đã đồng bộ hóa dữ liệu thành công!");
      fetchData();
    } catch (e) { alert("Lỗi khi đồng bộ dữ liệu. Hãy kiểm tra khóa Anon Key!"); } finally { setIsLoading(false); }
  };

  const isACP = hash.toUpperCase().includes('ACP1122');

  return (
    <>
      {isACP ? (
        <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} onSave={handleSave} />
      ) : (
        <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
