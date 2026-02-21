
/**
 * BẢN SAVE SỐ 1 - PHIÊN BẢN CHÍNH THỨC
 * -----------------------------------------
 * Các tính năng đã tích hợp:
 * 1. Hiển thị món ăn RANDOM (ngẫu nhiên) mỗi khi tải trang hoặc đổi danh mục.
 * 2. Tự động chuyển món trong Modal (10 giây/lần) với hiệu ứng mờ ảo và thanh tiến trình.
 * 3. Popup thông báo Lịch Nghỉ Tết:
 *    - Nội dung: Nghỉ từ 26 Tết, bán lại Mùng 6 Tết.
 *    - Lời chúc: Màu Vàng Cam đậm (Amber-600) nổi bật.
 * 4. Cập nhật Logo Shopee Food mới theo yêu cầu.
 * 5. Hệ thống quản trị chuyên nghiệp tại đường dẫn #ACP1122.
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH CỐ ĐỊNH ---
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
  const [showTetPopup, setShowTetPopup] = useState(false);
  const [activeNotif, setActiveNotif] = useState<any>(null);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchActiveNotif = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setActiveNotif(data);
        setShowTetPopup(true);
      }
    };
    fetchActiveNotif();
  }, [supabase]);

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

    const channel = supabase.channel('online-users', { config: { presence: { key: 'user' } } });
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      setOnlineCount(count > 0 ? count : 1);
    }).subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString(), user_id: Math.random().toString(36).substr(2, 9) });
      }
    });
    return () => { channel.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (!heroSlides.length) return;
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  // Logic hiển thị ngẫu nhiên (Random)
  const filteredMenu = useMemo(() => {
    let list = activeFilter === Category.All ? [...menu] : menu.filter(d => d.category === activeFilter);
    return list.sort(() => Math.random() - 0.5);
  }, [menu, activeFilter]);

  // Tự động chuyển món trong Modal mỗi 10 giây
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
      <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const selectedDish = selectedIdx !== null ? filteredMenu[selectedIdx] : null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      
      {/* Dynamic Notification Popup */}
      {showTetPopup && activeNotif && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 md:p-16 relative overflow-hidden text-center border-t-[12px] border-amber-600 animate-[popIn_0.5s_ease-out]">
            <button onClick={() => setShowTetPopup(false)} className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 text-4xl transition-all">×</button>
            <div className="space-y-8">
              <span className="text-amber-600 font-black text-xs md:text-sm tracking-[0.6em] uppercase block">Thông báo từ quán</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-stone-900 leading-tight">THÔNG BÁO</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
              <p className="text-stone-600 text-lg md:text-2xl font-bold leading-relaxed whitespace-pre-line">
                {activeNotif.message}
              </p>
              <div className="pt-6">
                <p className="text-amber-600 text-sm md:text-lg italic font-black uppercase tracking-wide">
                  XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI.
                </p>
              </div>
              <button onClick={() => setShowTetPopup(false)} className="bg-stone-900 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-600 transition-all shadow-xl">ĐÃ HIỂU</button>
            </div>
          </div>
          <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
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
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${activeFilter === cat ? 'border-amber-800 text-amber-800' : 'border-transparent text-stone-300 hover:text-stone-900'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {paginatedMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedIdx(filteredMenu.findIndex(d => d.id === dish.id))} className="bg-white rounded-[40px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-700 cursor-pointer group p-6">
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

      {/* Dish Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl" onClick={() => setSelectedIdx(null)}>
          <div key={selectedDish.id} className="w-full h-full md:w-[90vw] md:h-[85vh] bg-white md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative transition-all duration-1000 animate-[fadeIn_0.8s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedIdx(null)} className="absolute top-8 right-8 z-[190] text-stone-300 hover:text-stone-900 text-5xl transition-all">×</button>
            <div className="w-full h-[40vh] md:h-auto md:w-[55%] bg-black overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover animate-[scaleSlow_10s_linear_infinite]" />
            </div>
            <div className="flex-1 p-12 md:p-20 flex flex-col justify-center bg-white space-y-8">
              <span className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px]">Út Trinh Kitchen</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-stone-900">{selectedDish.name}</h2>
              <div className="text-4xl md:text-6xl font-black text-amber-800 tabular-nums">{selectedDish.price}</div>
              <p className="text-stone-500 text-lg md:text-xl italic font-light leading-relaxed max-w-lg">"{selectedDish.description || 'Món ăn truyền thống chuẩn vị mẹ nấu.'}"</p>
              <div className="pt-4"><span className="bg-stone-950 text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">{selectedDish.category}</span></div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-amber-800/30 w-full">
              <div key={`progress-${selectedDish.id}`} className="h-full bg-amber-800 animate-[progress_10s_linear_forwards]"></div>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            @keyframes scaleSlow { from { transform: scale(1); } to { transform: scale(1.1); } }
            @keyframes progress { from { width: 0%; } to { width: 100%; } }
          `}</style>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-950 text-white pt-32 pb-16 px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4"><img src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" className="w-16 h-16 md:w-20 md:h-20" /><span className="text-2xl font-black">ÚT TRINH</span></div>
            <p className="text-stone-500 text-sm italic leading-relaxed">"Hương vị quê nhà, đậm đà tình thân."</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Liên hệ</h4>
            <div className="space-y-4 text-stone-400 text-sm">
              <p className="font-bold text-white">158A/5 Trần Vĩnh Kiết, Cần Thơ</p>
              <p className="font-black text-2xl text-white">0939.70.90.20</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Thống kê</h4>
            <div className="space-y-4">
              <p className="text-2xl font-black">{totalViews.toLocaleString()} lượt xem</p>
              <p className="text-amber-500 font-black">{onlineCount} đang online</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Đối tác</h4>
            <div className="flex gap-4">
               <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-10 md:h-14 rounded-sm" />
               <img src={SHOPEE_LOGO} className="h-10 md:h-14" />
            </div>
          </div>
        </div>
        <div className="text-center text-stone-600 text-[8px] font-black uppercase tracking-[0.5em] pt-10 border-t border-white/5">© 2026 CƠM PHẦN ÚT TRINH - EST 2019</div>
      </footer>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'notifications'>('menu');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotif, setNewNotif] = useState('');

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (data) setNotifications(data);
    };
    fetchNotifs();
  }, [supabase]);

  const handleAddNotif = async () => {
    if (!newNotif.trim()) return;
    const { data, error } = await supabase.from('notifications').insert([{ message: newNotif, is_active: true }]).select().single();
    if (data) {
      setNotifications([data, ...notifications]);
      setNewNotif('');
    }
  };

  const toggleNotif = async (id: string, current: boolean) => {
    const { error } = await supabase.from('notifications').update({ is_active: !current }).eq('id', id);
    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_active: !current } : n));
    }
  };

  const deleteNotif = async (id: string) => {
    if (!confirm('Xóa thông báo này?')) return;
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const moveHero = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < newSlides.length) {
      [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
      setHeroSlides(newSlides);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 pt-32 pb-20 px-4 md:px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-200">
        <div className="flex bg-stone-50 border-b p-3 gap-2">
          <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'menu' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🍱 THỰC ĐƠN</button>
          <button onClick={() => setActiveTab('hero')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'hero' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🖼️ HERO SLIDES</button>
          <button onClick={() => setActiveTab('notifications')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'notifications' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🔔 THÔNG BÁO</button>
        </div>
        
        <div className="p-12">
          {activeTab === 'menu' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">QUẢN LÝ THỰC ĐƠN</h2>
                <div className="flex gap-3">
                  <button onClick={onSave} className="bg-green-600 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">ĐỒNG BỘ</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Món Mới', price: '35.000 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="bg-amber-800 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">+ THÊM MÓN</button>
                </div>
              </div>
              <div className="grid gap-6">
                {menu.map((dish: Dish, i: number) => (
                  <div key={dish.id} className="p-8 border border-stone-100 rounded-[35px] bg-stone-50/40 flex gap-10 items-start hover:border-amber-200 transition-all">
                    <div className="w-40 h-40 rounded-[25px] overflow-hidden bg-stone-200 border-4 border-white"><img src={dish.image_url || 'https://placehold.co/400x400'} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 grid grid-cols-3 gap-5">
                      <input value={dish.name} onChange={e => { const m = [...menu]; m[i].name = e.target.value; setMenu(m); }} className="p-4 border rounded-2xl text-sm font-bold" placeholder="Tên món" />
                      <input value={dish.price} onChange={e => { const m = [...menu]; m[i].price = e.target.value; setMenu(m); }} className="p-4 border rounded-2xl text-sm font-black text-amber-800" placeholder="Giá" />
                      <select value={dish.category} onChange={e => { const m = [...menu]; m[i].category = e.target.value as Category; setMenu(m); }} className="p-4 border rounded-2xl text-sm font-bold">{Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}</select>
                      <input value={dish.image_url} onChange={e => { const m = [...menu]; m[i].image_url = e.target.value; setMenu(m); }} className="col-span-3 p-4 border rounded-2xl text-[10px] font-mono" placeholder="Link ảnh (URL)" />
                    </div>
                    <button onClick={() => { if(confirm('Xóa món này?')) setMenu(menu.filter(d => d.id !== dish.id)) }} className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl text-2xl font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'hero' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">BANNER HERO</h2>
                <div className="flex gap-3">
                  <button onClick={onSave} className="bg-green-600 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">ĐỒNG BỘ</button>
                  <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: '' }])} className="bg-amber-800 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">+ THÊM SLIDE</button>
                </div>
              </div>
              <div className="grid gap-6">
                {heroSlides.map((slide: HeroSlide, i: number) => (
                  <div key={slide.id} className="p-8 border border-stone-100 rounded-[35px] bg-stone-50/40 flex gap-10 items-center">
                    <div className="w-72 aspect-video rounded-3xl overflow-hidden bg-stone-200 border-4 border-white"><img src={slide.image_url} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 space-y-5">
                      <input value={slide.image_url} onChange={e => { const s = [...heroSlides]; s[i].image_url = e.target.value; setHeroSlides(s); }} className="w-full p-4 border rounded-2xl text-[10px] font-mono" placeholder="Link ảnh Hero" />
                      <input value={slide.quote} onChange={e => { const s = [...heroSlides]; s[i].quote = e.target.value; setHeroSlides(s); }} className="w-full p-4 border rounded-2xl text-sm italic" placeholder="Slogan" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => moveHero(i, 'up')} disabled={i === 0} className="w-14 h-14 bg-white border rounded-2xl font-bold">↑</button>
                      <button onClick={() => moveHero(i, 'down')} disabled={i === heroSlides.length - 1} className="w-14 h-14 bg-white border rounded-2xl font-bold">↓</button>
                      <button onClick={() => { if(confirm('Xóa slide?')) setHeroSlides(heroSlides.filter(s => s.id !== slide.id)) }} className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl text-2xl font-bold">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">QUẢN LÝ THÔNG BÁO</h2>
              </div>
              
              <div className="bg-stone-50 p-8 rounded-[35px] border border-stone-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Tạo thông báo mới</h3>
                <div className="flex gap-4">
                  <input 
                    value={newNotif} 
                    onChange={e => setNewNotif(e.target.value)} 
                    className="flex-1 p-5 border rounded-2xl text-sm font-bold" 
                    placeholder="Ví dụ: Quán nghỉ bán ngày 26 Tết..." 
                  />
                  <button 
                    onClick={handleAddNotif}
                    className="bg-amber-800 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-stone-900 transition-all"
                  >
                    + TẠO MỚI
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-6">Danh sách thông báo</h3>
                {notifications.map((n) => (
                  <div key={n.id} className={`p-6 rounded-[30px] border flex items-center justify-between transition-all ${n.is_active ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100 opacity-60'}`}>
                    <div className="flex-1">
                      <p className={`text-lg font-bold ${n.is_active ? 'text-amber-900' : 'text-stone-400'}`}>{n.message}</p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-stone-300">{new Date(n.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${n.is_active ? 'text-green-600' : 'text-stone-300'}`}>
                          {n.is_active ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                        </span>
                        <button 
                          onClick={() => toggleNotif(n.id, n.is_active)}
                          className={`w-14 h-8 rounded-full relative transition-all ${n.is_active ? 'bg-green-500' : 'bg-stone-200'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${n.is_active ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <button onClick={() => deleteNotif(n.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl font-bold">×</button>
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
      await supabase.from('dishes').delete().neq('id', '0');
      await supabase.from('hero_slides').delete().neq('id', '0');
      const sanitize = (list: any[]) => list.map(({ id, created_at, ...rest }) => rest);
      if (menu.length) await supabase.from('dishes').insert(sanitize(menu));
      if (heroSlides.length) await supabase.from('hero_slides').insert(sanitize(heroSlides));
      alert("Đồng bộ dữ liệu thành công!"); 
      fetchData();
    } catch (e) { alert("Lỗi đồng bộ."); } finally { setIsLoading(false); }
  };

  const isAcp = window.location.hash.toUpperCase().includes('ACP1122');
  return isAcp ? <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} onSave={handleSave} /> : <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} supabase={supabase} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
