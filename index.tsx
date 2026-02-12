
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH CỐ ĐỊNH (Hardcoded vĩnh viễn) ---
const DEFAULT_URL = 'https://qrzfpeeuohzfquzfiebc.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemZwZWV1b2h6ZnF1emZpZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY4MDgsImV4cCI6MjA4NDMyMjgwOH0.tyzhzbucriL09bH-ndgXs3ob1-Www97vsfQ6Wsh8d7s';

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
const VIEW_COUNT_KEY = 'ut-trinh-total-views-v15';
const SESSION_VISIT_KEY = 'ut-trinh-session-visited-v15';
const SHOPEE_LOGO = 'https://i.postimg.cc/Wzj6yWrp/pngtree-shopefood-logo-png-image-6472274.png';

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[80] bg-white/95 backdrop-blur-xl border-b border-stone-100 px-4 md:px-20 h-24 md:h-32 flex items-center justify-between transition-all">
        {/* Left: Logo Section */}
        <div className="flex items-center gap-4 md:gap-6 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <img 
            src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" 
            alt="Logo Út Trinh" 
            className="w-16 h-16 md:w-24 md:h-24 object-contain shrink-0 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-4 whitespace-nowrap">
            <span className="text-base md:text-4xl font-black text-amber-700 uppercase tracking-tighter leading-none">CƠM PHẦN</span>
            <span className="text-base md:text-4xl font-black text-stone-900 uppercase tracking-tighter leading-none">ÚT TRINH</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex gap-4 md:gap-8 items-center">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all">Thoát Quản Trị</button>
          ) : (
            <>
              <div className="hidden xl:flex items-center gap-8">
                <a href="#menu" className="text-stone-900 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-amber-700">THỰC ĐƠN</a>
                <button 
                  onClick={() => setShowConciseMenu(true)} 
                  className="bg-amber-800 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-stone-900 transition-all"
                >
                  MENU ẢNH
                </button>
              </div>
              
              <span className="text-red-600 font-black text-[10px] md:text-[13px] tracking-widest uppercase hidden lg:block whitespace-nowrap">
                HÃY ĐẶT MÓN NGAY 0939.70.90.20
              </span>

              <div className="flex items-center gap-3 md:gap-4 border-l border-stone-100 pl-4">
                <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-8 md:h-12 object-contain rounded-sm" alt="Grab" />
                <img src={SHOPEE_LOGO} className="h-8 md:h-12 object-contain" alt="Shopee" />
              </div>

              <button onClick={() => setShowConciseMenu(true)} className="xl:hidden bg-amber-800 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase">MENU</button>
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

const HomePage = ({ menu, heroSlides, isLoading, supabase }: any) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>(Category.All);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTetPopup, setShowTetPopup] = useState(true); // Mặc định hiện popup khi truy cập
  const itemsPerPage = 9;

  const [totalViews, setTotalViews] = useState(300);
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    const savedViews = localStorage.getItem(VIEW_COUNT_KEY);
    let currentViews = savedViews ? parseInt(savedViews) : 300;
    
    const sessionVisited = sessionStorage.getItem(SESSION_VISIT_KEY);
    if (!sessionVisited) {
      currentViews += 1;
      localStorage.setItem(VIEW_COUNT_KEY, currentViews.toString());
      sessionStorage.setItem(SESSION_VISIT_KEY, 'true');
    }
    setTotalViews(currentViews);

    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'user' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineCount(count > 0 ? count : 1);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ 
            online_at: new Date().toISOString(), 
            user_id: Math.random().toString(36).substr(2, 9) 
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!heroSlides.length) return;
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  // Xử lý danh sách món ăn với chức năng RANDOM (ngẫu nhiên)
  const filteredMenu = useMemo(() => {
    let list = activeFilter === Category.All ? [...menu] : menu.filter(d => d.category === activeFilter);
    // Shuffle ngẫu nhiên mỗi khi đổi filter hoặc tải lại trang
    return list.sort(() => Math.random() - 0.5);
  }, [menu, activeFilter]);

  // Hiệu ứng tự động chuyển món trong Modal mỗi 10 giây
  useEffect(() => {
    if (selectedIdx === null || filteredMenu.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedIdx(prev => (prev !== null ? (prev + 1) % filteredMenu.length : null));
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedIdx, filteredMenu.length]);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const paginatedMenu = useMemo(() => filteredMenu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredMenu, currentPage]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amber-800 font-black tracking-widest uppercase text-[10px]">Đang chuẩn bị thực đơn...</p>
      </div>
    </div>
  );

  const selectedDish = selectedIdx !== null ? filteredMenu[selectedIdx] : null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      
      {/* Tet Holiday Popup */}
      {showTetPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 md:p-16 relative overflow-hidden text-center border-t-[12px] border-red-600 animate-[popIn_0.5s_ease-out]">
            <button 
              onClick={() => setShowTetPopup(false)} 
              className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 text-4xl transition-all"
            >
              ×
            </button>
            <div className="space-y-8">
              <span className="text-red-600 font-black text-xs md:text-sm tracking-[0.6em] uppercase block">Thông báo quan trọng</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-stone-900 leading-tight">LỊCH NGHỈ TẾT</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
              <p className="text-stone-600 text-lg md:text-2xl font-bold leading-relaxed">
                XIN CHÀO BẠN, QUÁN NGHỈ BÁN VÀO NGÀY <span className="text-red-600 font-black">26 TẾT</span> !<br/>
                VÀ BÁN LẠI VÀO NGÀY <span className="text-red-600 font-black">MÙNG 6 TẾT</span>
              </p>
              <div className="pt-6">
                <p className="text-amber-600 text-sm md:text-lg italic font-black uppercase tracking-wide">
                  XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI.
                </p>
              </div>
              <button 
                onClick={() => setShowTetPopup(false)}
                className="bg-stone-900 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl"
              >
                ĐÃ HIỂU
              </button>
            </div>
          </div>
          <style>{`
            @keyframes popIn { 
              from { opacity: 0; transform: scale(0.9) translateY(20px); } 
              to { opacity: 1; transform: scale(1) translateY(0); } 
            }
          `}</style>
        </div>
      )}

      {/* Hero */}
      <header className="relative h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide: HeroSlide, index: number) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <img src={slide.image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/20 to-stone-950/80"></div>
          </div>
        ))}
        <div className="relative z-20 text-center px-6 max-w-5xl pt-24">
          <span className="text-amber-400 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-6 block animate-pulse">Tinh hoa ẩm thực Việt</span>
          <h1 className="text-white text-5xl md:text-[130px] font-black tracking-tighter leading-none mb-8 drop-shadow-2xl">ÚT TRINH<br/><span className="text-amber-500 italic">KITCHEN</span></h1>
          <p className="text-white/90 text-lg md:text-3xl font-light italic leading-relaxed">"{heroSlides[currentSlide]?.quote || 'Nơi lưu giữ hương vị cơm nhà truyền thống'}"</p>
        </div>
      </header>

      {/* Menu List */}
      <main id="menu" className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase text-stone-900">Món Ăn Đặc Sắc</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {paginatedMenu.map((dish: Dish) => (
            <div 
              key={dish.id} 
              onClick={() => setSelectedIdx(filteredMenu.findIndex(d => d.id === dish.id))}
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
                <p className="text-stone-400 text-sm italic line-clamp-2">"{dish.description || 'Hương vị gia truyền đậm đà.'}"</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); document.getElementById('menu')?.scrollIntoView(); }} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 hover:text-white transition-all font-bold">←</button>
            <span className="text-stone-400 font-black tracking-widest text-[10px] uppercase">Trang {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); document.getElementById('menu')?.scrollIntoView(); }} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 hover:text-white transition-all font-bold">→</button>
          </div>
        )}
      </main>

      {/* Dish Modal with Auto-Slide and Fade-in Animation */}
      {selectedDish && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl" onClick={() => setSelectedIdx(null)}>
          <div 
            key={selectedDish.id}
            className="w-full h-full md:w-[90vw] md:h-[85vh] bg-white md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative transition-all duration-1000 animate-[fadeIn_0.8s_ease-out]" 
            onClick={e => e.stopPropagation()}
          >
            <style>
              {`@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`}
            </style>
            <button onClick={() => setSelectedIdx(null)} className="absolute top-8 right-8 z-[190] text-stone-300 hover:text-stone-900 text-5xl transition-all">×</button>
            <div className="w-full h-[40vh] md:h-auto md:w-[55%] bg-black overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover animate-[scaleSlow_10s_linear_infinite]" />
              <style>{`@keyframes scaleSlow { from { transform: scale(1); } to { transform: scale(1.1); } }`}</style>
            </div>
            <div className="flex-1 p-12 md:p-20 flex flex-col justify-center bg-white space-y-8">
              <span className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px] animate-[slideIn_0.6s_ease-out]">Út Trinh Kitchen</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-stone-900 animate-[slideIn_0.7s_ease-out]">{selectedDish.name}</h2>
              <div className="text-4xl md:text-6xl font-black text-amber-800 tabular-nums animate-[slideIn_0.8s_ease-out]">{selectedDish.price}</div>
              <p className="text-stone-500 text-lg md:text-xl italic font-light leading-relaxed max-w-lg animate-[slideIn_0.9s_ease-out]">"{selectedDish.description || 'Món ăn truyền thống chuẩn vị mẹ nấu.'}"</p>
              <div className="pt-4 animate-[slideIn_1s_ease-out]"><span className="bg-stone-950 text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">{selectedDish.category}</span></div>
              <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
            </div>
            
            {/* Auto-play progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-amber-800/30 w-full">
              <div key={`progress-${selectedDish.id}`} className="h-full bg-amber-800 animate-[progress_10s_linear_forwards]"></div>
              <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-950 text-white pt-32 pb-16 px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 items-start mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" alt="Logo Út Trinh" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              <span className="text-2xl font-black tracking-tighter">ÚT TRINH</span>
            </div>
            <p className="text-stone-500 text-sm italic font-light leading-relaxed">"Hương vị quê nhà, đậm đà tình thân."</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Liên hệ</h4>
            <div className="space-y-4 text-stone-400 text-sm">
              <p className="font-bold text-white">158A/5 Trần Vĩnh Kiết, P.Tân An, Quận Ninh Kiều, Cần Thơ</p>
              <p className="tabular-nums font-black text-2xl text-white">0939.70.90.20</p>
              <p className="text-stone-500">Mở cửa: 09:00 AM - 06:30 PM</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Thống kê</h4>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <span className="text-stone-500 text-[9px] font-black uppercase tracking-widest">Tổng lượt xem</span>
                <p className="text-2xl font-black tabular-nums">{totalViews.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Thực khách đang xem
                </span>
                <p className="text-2xl font-black tabular-nums">{onlineCount}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Đối tác</h4>
            <div className="flex gap-4">
               <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-10 md:h-14 object-contain rounded-sm" alt="Grab" />
               <img src={SHOPEE_LOGO} className="h-10 md:h-14 object-contain" alt="Shopee" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 text-center text-stone-600 text-[8px] font-black uppercase tracking-[0.5em]">
          <p>© 2026 CƠM PHẦN ÚT TRINH — NINH KIỀU, CẦN THƠ - EST 2019</p>
        </div>
      </footer>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero'>('menu');

  const moveHero = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    setHeroSlides(newSlides);
  };

  return (
    <div className="min-h-screen bg-stone-100 pt-32 pb-20 px-4 md:px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-200">
        {/* Navigation Tabs */}
        <div className="flex bg-stone-50 border-b p-2 md:p-3 gap-2">
          <button 
            onClick={() => setActiveTab('menu')} 
            className={`flex-1 py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'menu' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400 hover:text-stone-600'}`}
          >
            🍱 THỰC ĐƠN <span className="bg-stone-200 px-2 py-0.5 rounded-full text-[9px] text-stone-600">{menu.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('hero')} 
            className={`flex-1 py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'hero' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400 hover:text-stone-600'}`}
          >
            🖼️ HERO SLIDES <span className="bg-stone-200 px-2 py-0.5 rounded-full text-[9px] text-stone-600">{heroSlides.length}</span>
          </button>
        </div>
        
        <div className="p-6 md:p-12">
          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-stone-900">QUẢN LÝ THỰC ĐƠN</h2>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mt-1">Đang hiển thị {menu.length} món trên website</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={onSave} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3.5 text-[10px] font-black rounded-xl transition-all shadow-lg shadow-green-100 uppercase tracking-widest">ĐỒNG BỘ</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Món Mới', price: '35.000 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="flex-1 md:flex-none bg-amber-800 hover:bg-stone-900 text-white px-6 md:px-8 py-3.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-amber-100">+ THÊM MÓN</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {menu.map((dish: Dish, i: number) => (
                  <div key={dish.id} className="p-6 md:p-8 border border-stone-100 rounded-[35px] bg-stone-50/40 flex flex-col md:flex-row gap-6 md:gap-10 items-start hover:border-amber-200 transition-all group shadow-sm">
                    {/* Image Preview */}
                    <div className="w-full md:w-40 h-40 rounded-[25px] overflow-hidden shrink-0 shadow-inner bg-stone-200 border-4 border-white">
                      <img src={dish.image_url || 'https://placehold.co/400x400?text=No+Image'} className="w-full h-full object-cover" alt="Preview" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:flex-cols-2 lg:grid-cols-3 gap-5 w-full">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-1">Tên món ăn</label>
                        <input value={dish.name} onChange={e => { const m = [...menu]; m[i].name = e.target.value; setMenu(m); }} className="w-full p-4 border rounded-2xl text-sm font-bold bg-white focus:ring-2 ring-amber-500 outline-none transition-all" />
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-1">Giá hiển thị (VD: 35k)</label>
                        <input value={dish.price} onChange={e => { const m = [...menu]; m[i].price = e.target.value; setMenu(m); }} className="w-full p-4 border rounded-2xl text-sm font-black text-amber-800 bg-white focus:ring-2 ring-amber-500 outline-none transition-all" />
                      </div>

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-1">Loại món</label>
                        <select value={dish.category} onChange={e => { const m = [...menu]; m[i].category = e.target.value as Category; setMenu(m); }} className="w-full p-4 border rounded-2xl text-sm font-bold bg-white focus:ring-2 ring-amber-500 outline-none transition-all appearance-none">
                          {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Image Link */}
                      <div className="lg:col-span-3 space-y-1.5">
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-1">Đường dẫn hình ảnh (URL)</label>
                        <input value={dish.image_url} onChange={e => { const m = [...menu]; m[i].image_url = e.target.value; setMenu(m); }} className="w-full p-4 border rounded-2xl text-[10px] font-mono bg-white focus:ring-2 ring-amber-500 outline-none transition-all" />
                      </div>

                      {/* Description / Ghi chú */}
                      <div className="lg:col-span-3 space-y-1.5">
                        <label className="text-[9px] font-black text-amber-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <span className="w-1 h-1 bg-amber-700 rounded-full"></span> GHI CHÚ / MÔ TẢ MÓN ĂN
                        </label>
                        <textarea rows={2} value={dish.description} onChange={e => { const m = [...menu]; m[i].description = e.target.value; setMenu(m); }} placeholder="Ví dụ: Phục vụ kèm canh và rau muối..." className="w-full p-4 border rounded-2xl text-sm italic text-stone-600 bg-white focus:ring-2 ring-amber-500 outline-none resize-none transition-all" />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                      <button onClick={() => { if(confirm('Xác nhận xóa món ăn này?')) setMenu(menu.filter(d => d.id !== dish.id)) }} className="flex-1 md:w-14 h-14 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-2xl font-bold">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Slides Management Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-stone-900">BANNER QUẢNG CÁO (HERO)</h2>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mt-1">Sắp xếp thứ tự chạy của các tấm ảnh lớn</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={onSave} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3.5 text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest">ĐỒNG BỘ</button>
                  <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: '' }])} className="flex-1 md:flex-none bg-amber-800 hover:bg-stone-900 text-white px-6 md:px-8 py-3.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest shadow-lg">+ THÊM SLIDE</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {heroSlides.map((slide: HeroSlide, i: number) => (
                  <div key={slide.id} className="p-6 md:p-8 border border-stone-100 rounded-[35px] bg-stone-50/40 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center group shadow-sm">
                    {/* Preview Image */}
                    <div className="w-full lg:w-72 aspect-video rounded-3xl overflow-hidden bg-stone-200 shrink-0 shadow-lg relative border-4 border-white">
                      {slide.image_url ? (
                        <img src={slide.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] font-black uppercase">Chưa có ảnh</div>
                      )}
                      <div className="absolute top-4 left-4 bg-stone-900/90 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-xl">SLIDE {i + 1}</div>
                    </div>
                    
                    <div className="flex-1 space-y-5 w-full">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-1">Đường dẫn hình ảnh (Hero Banner)</label>
                        <input value={slide.image_url} onChange={e => { const s = [...heroSlides]; s[i].image_url = e.target.value; setHeroSlides(s); }} className="w-full p-4 border rounded-2xl text-[10px] font-mono bg-white outline-none focus:ring-2 ring-amber-500 transition-all" placeholder="Nhập link ảnh tại đây..." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest ml-1">Câu khẩu hiệu / Slogan hiển thị đè lên ảnh</label>
                        <input value={slide.quote} onChange={e => { const s = [...heroSlides]; s[i].quote = e.target.value; setHeroSlides(s); }} className="w-full p-4 border rounded-2xl text-sm italic font-medium bg-white outline-none focus:ring-2 ring-amber-500 transition-all" placeholder="Ví dụ: Tận hưởng hương vị mẹ nấu..." />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                      <button onClick={() => moveHero(i, 'up')} disabled={i === 0} className="flex-1 lg:w-14 h-14 bg-white border rounded-2xl flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all disabled:opacity-20 shadow-sm font-bold">↑</button>
                      <button onClick={() => moveHero(i, 'down')} disabled={i === heroSlides.length - 1} className="flex-1 lg:w-14 h-14 bg-white border rounded-2xl flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all disabled:opacity-20 shadow-sm font-bold">↓</button>
                      <button onClick={() => { if(confirm('Xóa slide này?')) setHeroSlides(heroSlides.filter(s => s.id !== slide.id)) }} className="flex-1 lg:w-14 h-14 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-2xl font-bold shadow-sm">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [supabaseConfig] = useState(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : { url: DEFAULT_URL, key: DEFAULT_ANON_KEY };
  });
  const [menu, setMenu] = useState<Dish[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(supabaseConfig.url, supabaseConfig.key), [supabaseConfig]);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: false });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Xóa cũ để chèn mới theo đúng thứ tự (Đặc biệt quan trọng cho Slide)
      await supabase.from('dishes').delete().neq('id', '0');
      await supabase.from('hero_slides').delete().neq('id', '0');
      
      const sanitize = (list: any[]) => list.map(({ id, created_at, ...rest }) => rest);
      
      if (menu.length) await supabase.from('dishes').insert(sanitize(menu));
      if (heroSlides.length) await supabase.from('hero_slides').insert(sanitize(heroSlides));
      
      alert("Đồng bộ dữ liệu thành công!"); 
      fetchData();
    } catch (e) { 
      alert("Lỗi đồng bộ. Vui lòng thử lại sau."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const isAcp = window.location.hash.toUpperCase().includes('ACP1122');

  return isAcp 
    ? <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} onSave={handleSave} />
    : <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} supabase={supabase} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
