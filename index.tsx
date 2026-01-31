
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH CỐ ĐỊNH ---
const HARDCODED_SUPABASE_URL = 'https://qrzfpeeuohzfquzfiebc.supabase.co'; 
const HARDCODED_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemZwZWV1b2h6ZnF1emZpZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY4MDgsImV4cCI6MjA4NDMyMjgwOH0.tyzhzbucriL09bH-ndgXs3ob1-Www97vsfQ6Wsh8d7s'; 

// --- TYPES ---
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
  created_at?: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: Category;
}

interface HeroSlide {
  id: string;
  created_at?: string;
  image_url: string;
  quote: string;
}

const CONFIG_KEY = 'ut-trinh-config-v3';

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-stone-100 px-6 md:px-20 h-24 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-2xl rounded-sm group-hover:bg-amber-800 transition-colors shrink-0">Ú</div>
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-xl md:text-2xl font-black text-amber-700 uppercase tracking-tighter">CƠM PHẦN</span>
            <span className="text-xl md:text-2xl font-black text-stone-900 uppercase tracking-tighter">ÚT TRINH</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-md">Thoát Quản Trị</button>
          ) : (
            <div className="flex gap-4 md:gap-8 items-center">
              <a href="#menu" className="text-stone-900 text-[10px] font-black uppercase tracking-widest hover:text-amber-700 transition-colors hidden sm:block">Thực Đơn</a>
              <button 
                onClick={() => setShowConciseMenu(true)} 
                className="text-amber-800 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors bg-amber-50 px-4 py-2 rounded-full border border-amber-100 whitespace-nowrap"
              >
                Xem Ảnh Menu
              </button>
              <div className="w-px h-6 bg-stone-200 hidden lg:block"></div>
              <div className="hidden lg:flex items-center gap-5">
                <span className="text-red-600 text-[11px] font-black tracking-widest uppercase drop-shadow-sm">Hãy gọi đặt món ngay 0939.70.90.20</span>
                <div className="flex items-center gap-4 border-l border-stone-200 pl-5 select-none pointer-events-none">
                  <img 
                    src="https://inkythuatso.com/uploads/images/2021/12/logo-grab-food-inkythuatso-20-15-56-19.jpg" 
                    alt="GrabFood" 
                    className="h-7 w-auto object-contain rounded-sm"
                  />
                  <img 
                    src="https://img.icons8.com/color/96/shopee.png" 
                    alt="Shopee" 
                    className="h-7 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {showConciseMenu && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/90 backdrop-blur-2xl p-4" onClick={() => setShowConciseMenu(false)}>
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img src="https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg" className="max-h-[90vh] object-contain rounded-[30px] border-4 border-white/10 shadow-2xl" alt="Menu" />
            <button onClick={() => setShowConciseMenu(false)} className="absolute top-0 right-0 text-white bg-white/10 p-4 rounded-full">×</button>
          </div>
        </div>
      )}
    </>
  );
};

const HomePage = ({ menu, heroSlides, isLoading, supabase }: any) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>(Category.All);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [totalVisitors, setTotalVisitors] = useState(300);

  useEffect(() => {
    if (!supabase) return;
    const BASE_START = 300; 
    const SESSION_TIME = 1 * 60 * 60 * 1000; 

    const handleVisits = async () => {
      const { count } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
      setTotalVisitors(BASE_START + (count || 0));

      const lastVisit = localStorage.getItem('ut_v5_visit_time');
      const now = Date.now();

      if (!lastVisit || (now - parseInt(lastVisit)) > SESSION_TIME) {
        const { error } = await supabase.from('site_visits').insert({});
        if (!error) {
          localStorage.setItem('ut_v5_visit_time', now.toString());
          setTotalVisitors(prev => prev + 1);
        }
      }
    };

    const channel = supabase.channel('online_tracking_v5', {
      config: { presence: { key: 'visitor-' + Math.random().toString(36).substring(7) } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsers(Object.keys(state).length || 1);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    handleVisits();
    return () => { channel.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  // Ngẫu nhiên hóa menu mỗi khi filter thay đổi
  const shuffledMenu = useMemo(() => {
    let filtered = activeFilter === Category.All 
      ? [...menu] 
      : menu.filter((item: Dish) => item.category === activeFilter);
    return filtered.sort(() => Math.random() - 0.5);
  }, [menu, activeFilter]);

  // Phân trang
  const totalPages = Math.ceil(shuffledMenu.length / itemsPerPage);
  const displayedDishes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return shuffledMenu.slice(start, start + itemsPerPage);
  }, [shuffledMenu, currentPage]);

  const changePage = (page: number) => {
    setCurrentPage(page);
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-amber-800 font-black tracking-[0.4em] uppercase text-xs">Út Trinh Kitchen...</div></div>;

  const activeSlide = heroSlides[currentSlide] || { image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920', quote: 'Hương vị cơm nhà ấm áp.' };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide: HeroSlide, index: number) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img 
                src={slide.image_url} 
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${index === currentSlide ? 'scale-100' : 'scale-120'}`} 
              />
              <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"></div>
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl">
          <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.8em] mb-8 block">Premium Home Dining</span>
          <h1 className="text-white text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-10 uppercase">ÚT TRINH<br/><span className="text-amber-500 italic font-medium">KITCHEN</span></h1>
          <p className="text-white/95 text-xl md:text-3xl font-light italic max-w-3xl mx-auto leading-relaxed">"{activeSlide.quote}"</p>
        </div>
      </header>

      <main id="menu" className="max-w-7xl mx-auto py-32 px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 uppercase text-stone-900">Thực Đơn Đặc Sắc</h2>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-stone-100 pb-8 max-w-4xl mx-auto">
            {Object.values(Category).map((cat) => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeFilter === cat ? 'text-amber-800 border-b-2 border-amber-800' : 'text-stone-300 hover:text-stone-900'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {displayedDishes.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="group cursor-pointer bg-white rounded-[40px] overflow-hidden p-5 border border-stone-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
              <div className="relative aspect-square overflow-hidden rounded-[32px] mb-8">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
              </div>
              <div className="px-2 space-y-4 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-amber-800 transition-colors leading-tight">{dish.name}</h3>
                  <span className="text-amber-800 font-black text-xl tracking-tighter shrink-0">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic line-clamp-2">"{dish.description || 'Hương vị truyền thống đậm đà bản sắc Việt.'}"</p>
                <div><span className="text-[9px] font-black uppercase bg-stone-900 text-white px-4 py-1.5 rounded-full">{dish.category}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang UI */}
        {totalPages > 1 && (
          <div className="mt-32 flex justify-center items-center gap-6">
            <button 
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className={`text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full border transition-all ${currentPage === 1 ? 'border-stone-100 text-stone-300' : 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white'}`}
            >
              Trang Trước
            </button>
            <div className="flex gap-3">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => changePage(i + 1)}
                  className={`w-10 h-10 rounded-full text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-amber-800 text-white shadow-xl' : 'text-stone-400 border border-stone-100 hover:text-stone-900'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className={`text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full border transition-all ${currentPage === totalPages ? 'border-stone-100 text-stone-300' : 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white'}`}
            >
              Trang Sau
            </button>
          </div>
        )}
      </main>

      {selectedDish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-xl p-6" onClick={() => setSelectedDish(null)}>
          <div className="max-w-6xl w-full bg-white rounded-[60px] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden"><img src={selectedDish.image_url} className="w-full h-full object-cover" /></div>
            <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative">
              <button onClick={() => setSelectedDish(null)} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 text-4xl">×</button>
              <div className="space-y-10">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-stone-900">{selectedDish.name}</h2>
                <div className="text-4xl font-black text-amber-800">{selectedDish.price}</div>
                <p className="text-stone-500 text-xl leading-relaxed italic font-light">"{selectedDish.description || 'Món ăn từ nguyên liệu tươi sạch nhất.'}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-16 px-12 bg-stone-900 text-white mt-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-b border-white/5 pb-16">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-block bg-white/5 backdrop-blur-md px-5 py-2 rounded-xl border border-white/10 shadow-xl">
              <span className="font-black tracking-[0.4em] uppercase text-xl block">ÚT TRINH</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="inline-block bg-amber-500/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit mx-auto md:mx-0">
                <span className="text-amber-500 font-black tracking-[0.25em] text-[10px] uppercase block">HƯƠNG VỊ QUÊ NHÀ</span>
              </div>
              <span className="text-amber-500/90 font-bold text-[9px] uppercase tracking-[0.15em] block md:pl-1">158A/5 Trần Vĩnh Kiết, Ninh Kiều, TP Cần Thơ</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-6">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <div className="w-1.5 h-1.5 bg-stone-600 rounded-full"></div>
              <div className="flex flex-col">
                <span className="text-stone-500 text-[7px] font-black uppercase tracking-widest">Lượt khách</span>
                <span className="text-white text-xs font-black tracking-widest tabular-nums">{supabase ? totalVisitors.toLocaleString() : '---'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-500/5 px-4 py-2 rounded-xl border border-green-500/10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex flex-col">
                <span className="text-stone-500 text-[7px] font-black uppercase tracking-widest">Online</span>
                <span className="text-green-500 text-xs font-black tracking-widest tabular-nums">{supabase ? onlineUsers : '---'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 text-center md:text-right">
          <p className="text-stone-500 text-[9px] font-bold uppercase tracking-[0.15em] opacity-60">© 2026 UT TRINH KITCHEN — EST 2019</p>
        </div>
      </footer>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto bg-white rounded-[50px] shadow-2xl overflow-hidden border border-stone-100">
        <div className="flex bg-stone-50 border-b border-stone-200 p-4 gap-4">
          {['menu', 'hero', 'config'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400'}`}>{tab === 'menu' ? '🍱 Thực Đơn' : tab === 'hero' ? '🖼️ Ảnh Bìa' : '⚙️ Cấu Hình'}</button>
          ))}
        </div>

        <div className="p-10 md:p-16">
          {activeTab === 'config' && (
            <div className="max-w-xl mx-auto py-12 space-y-8">
              <h2 className="text-3xl font-black uppercase">Kết nối Database</h2>
              <div className="space-y-4">
                <input placeholder="Supabase URL" value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full border-2 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                <input placeholder="Anon Key" value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full border-2 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                <button onClick={() => { setSupabaseConfig(localConfig); alert("Đã cập nhật!"); setActiveTab('menu'); }} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase hover:bg-stone-800 transition-all">Lưu Cấu Hình</button>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black uppercase">Quản Lý Menu</h2>
                  <p className="text-amber-800 font-black text-xs uppercase tracking-widest mt-2">Tổng số lượng: {menu.length} món ăn</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={onSave} className="bg-stone-900 text-white px-10 py-4 text-[10px] font-black uppercase rounded-2xl shadow-lg">Lưu Vào Cloud</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Tên món mới', price: '00.000 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase rounded-2xl shadow-lg">+ Thêm món</button>
                </div>
              </div>
              <div className="space-y-8">
                {menu.map((dish: Dish) => (
                  <div key={dish.id} className="p-8 border border-stone-100 bg-stone-50 rounded-[40px] grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    <input placeholder="Tên món" value={dish.name} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="w-full bg-white border p-4 rounded-xl outline-none font-bold" />
                    <input placeholder="Giá" value={dish.price} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="w-full bg-white border p-4 rounded-xl outline-none font-black text-amber-800" />
                    <select value={dish.category} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="w-full bg-white border p-4 rounded-xl outline-none font-black text-[10px] uppercase">{Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}</select>
                    <input placeholder="Link ảnh" value={dish.image_url} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="w-full bg-white border p-4 rounded-xl outline-none font-mono text-[9px]" />
                    <textarea placeholder="Mô tả" value={dish.description} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="md:col-span-4 w-full bg-white border p-4 rounded-xl outline-none italic text-sm" />
                    <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="absolute top-4 right-4 text-red-300 hover:text-red-500 text-2xl">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">Ảnh bìa Slide</h2>
                <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: 'Slogan...' }])} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase rounded-2xl shadow-lg">+ Thêm Slide</button>
              </div>
              {heroSlides.map((slide: HeroSlide) => (
                <div key={slide.id} className="p-10 border-2 border-stone-50 bg-stone-50 rounded-[40px] flex flex-col gap-10 relative">
                  <div className="aspect-[21/9] w-full bg-stone-200 rounded-[30px] overflow-hidden shadow-inner">{slide.image_url && <img src={slide.image_url} className="w-full h-full object-cover" />}</div>
                  <div className="grid md:grid-cols-2 gap-10">
                     <input placeholder="Link ảnh nền" value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full border p-5 rounded-2xl outline-none font-mono text-xs" />
                     <input placeholder="Câu slogan" value={slide.quote} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full border p-5 rounded-2xl outline-none italic font-medium" />
                  </div>
                  <button onClick={() => setHeroSlides(heroSlides.filter((s: any) => s.id !== slide.id))} className="text-[10px] font-black uppercase text-red-300 hover:text-red-500 underline self-center">Xóa slide này</button>
                </div>
              ))}
              <button onClick={onSave} className="w-full bg-stone-900 text-white py-8 rounded-[35px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl">Lưu Tất Cả Thay Đổi</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [supabaseConfig, setSupabaseConfig] = useState(() => {
    if (HARDCODED_SUPABASE_URL && HARDCODED_SUPABASE_KEY) return { url: HARDCODED_SUPABASE_URL, key: HARDCODED_SUPABASE_KEY };
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : { url: '', key: '' };
  });

  const [menu, setMenu] = useState<Dish[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hash, setHash] = useState(window.location.hash);

  const supabase = useMemo(() => (supabaseConfig.url && supabaseConfig.key) ? createClient(supabaseConfig.url, supabaseConfig.key) : null, [supabaseConfig]);

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setMenu([{ id: '1', name: 'Món Mẫu', price: '125k', description: 'Vui lòng kết nối database.', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000', category: Category.MainCourse }]);
      setHeroSlides([{ id: 'h1', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920', quote: 'Hương vị cơm nhà ấm áp.' }]);
      setIsLoading(false);
      return;
    }
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: false });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => {
    if (!HARDCODED_SUPABASE_URL) localStorage.setItem(CONFIG_KEY, JSON.stringify(supabaseConfig));
    fetchData();
  }, [supabaseConfig, fetchData]);

  useEffect(() => {
    const h = () => setHash(window.location.hash);
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const handleSave = async () => {
    if (!supabase) return alert("Cần database!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('name', '___DELETED___');
      await supabase.from('hero_slides').delete().neq('image_url', '___DELETED___');
      const sanitize = (list: any[]) => list.map(({ id, created_at, ...rest }) => rest);
      if (menu.length) await supabase.from('dishes').insert(sanitize(menu));
      if (heroSlides.length) await supabase.from('hero_slides').insert(sanitize(heroSlides));
      alert("Đồng bộ thành công!");
      fetchData();
    } catch (e) { alert("Lỗi!"); } finally { setIsLoading(false); }
  };

  const isACP = hash.toUpperCase().includes('ACP1122');

  return (
    <>
      {isACP ? (
        <AdminPanel 
          menu={menu} setMenu={setMenu} 
          heroSlides={heroSlides} setHeroSlides={setHeroSlides} 
          supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} 
          onSave={handleSave} 
        />
      ) : (
        <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} supabase={supabase} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
