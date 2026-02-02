
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png" className="h-8 md:h-12 object-contain" alt="Shopee" />
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
  const [prevDish, setPrevDish] = useState<Dish | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Thống kê thực tế 100%
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

  const filteredMenu = useMemo(() => {
    let list = activeFilter === Category.All ? [...menu] : menu.filter(d => d.category === activeFilter);
    return list.sort(() => 0.5 - Math.random());
  }, [menu, activeFilter]);

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

      {/* Dish Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl" onClick={() => setSelectedIdx(null)}>
          <div className="w-full h-full md:w-[90vw] md:h-[85vh] bg-white md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedIdx(null)} className="absolute top-8 right-8 z-[190] text-stone-300 hover:text-stone-900 text-5xl transition-all">×</button>
            <div className="w-full h-[40vh] md:h-auto md:w-[55%] bg-black">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-12 md:p-20 flex flex-col justify-center bg-white space-y-8">
              <span className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px]">Út Trinh Kitchen</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-stone-900">{selectedDish.name}</h2>
              <div className="text-4xl md:text-6xl font-black text-amber-800 tabular-nums">{selectedDish.price}</div>
              <p className="text-stone-500 text-lg md:text-xl italic font-light leading-relaxed max-w-lg">"{selectedDish.description || 'Món ăn truyền thống chuẩn vị mẹ nấu.'}"</p>
              <div className="pt-4"><span className="bg-stone-950 text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">{selectedDish.category}</span></div>
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
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png" className="h-10 md:h-14 object-contain" alt="Shopee" />
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

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>('menu');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);
  return (
    <div className="min-h-screen bg-stone-100 pt-32 pb-20 px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="flex bg-stone-50 border-b p-3 gap-2">
          {['menu', 'hero', 'config'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow text-stone-900' : 'text-stone-400'}`}>
              {tab === 'menu' ? '🍱 Thực Đơn' : tab === 'hero' ? '🖼️ Slide' : '⚙️ DB'}
            </button>
          ))}
        </div>
        <div className="p-10 md:p-16">
          {activeTab === 'config' && (
            <div className="max-w-md mx-auto py-10 space-y-6">
              <input placeholder="URL" value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full border p-4 rounded-xl font-mono text-xs" />
              <input placeholder="Key" value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full border p-4 rounded-xl font-mono text-xs" />
              <button onClick={() => setSupabaseConfig(localConfig)} className="w-full bg-stone-900 text-white py-4 rounded-xl font-black">LƯU CẤU HÌNH</button>
            </div>
          )}
          {activeTab === 'menu' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase">Món Ăn</h2>
                <div className="flex gap-3">
                  <button onClick={onSave} className="bg-stone-900 text-white px-6 py-2 text-[9px] font-black rounded-lg">ĐỒNG BỘ</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Món Mới', price: '0 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="bg-amber-800 text-white px-6 py-2 text-[9px] font-black rounded-lg">+ THÊM</button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {menu.map((dish: Dish, i: number) => (
                  <div key={dish.id} className="p-6 border rounded-3xl bg-stone-50 flex gap-6 items-center">
                    <img src={dish.image_url || 'https://placehold.co/100x100'} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input value={dish.name} onChange={e => { const m = [...menu]; m[i].name = e.target.value; setMenu(m); }} className="p-3 border rounded-lg text-sm" />
                      <input value={dish.price} onChange={e => { const m = [...menu]; m[i].price = e.target.value; setMenu(m); }} className="p-3 border rounded-lg text-sm font-bold" />
                      <input value={dish.image_url} onChange={e => { const m = [...menu]; m[i].image_url = e.target.value; setMenu(m); }} className="p-3 border rounded-lg text-[10px] font-mono" />
                    </div>
                    <button onClick={() => setMenu(menu.filter(d => d.id !== dish.id))} className="text-red-500 font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'hero' && (
            <div className="space-y-8">
               <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: '' }])} className="bg-amber-800 text-white px-8 py-3 text-[9px] font-black rounded-lg">+ THÊM SLIDE</button>
               {heroSlides.map((slide: HeroSlide, i: number) => (
                  <div key={slide.id} className="p-6 border rounded-3xl bg-stone-50 space-y-4">
                    <input value={slide.image_url} onChange={e => { const s = [...heroSlides]; s[i].image_url = e.target.value; setHeroSlides(s); }} className="w-full border p-3 rounded-lg text-xs" />
                    <input value={slide.quote} onChange={e => { const s = [...heroSlides]; s[i].quote = e.target.value; setHeroSlides(s); }} className="w-full border p-3 rounded-lg text-xs" />
                    <button onClick={() => setHeroSlides(heroSlides.filter(s => s.id !== slide.id))} className="text-red-500 text-xs">Xóa</button>
                  </div>
               ))}
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
    return saved ? JSON.parse(saved) : { url: DEFAULT_URL, key: DEFAULT_ANON_KEY };
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
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => { localStorage.setItem(CONFIG_KEY, JSON.stringify(supabaseConfig)); fetchData(); }, [supabaseConfig, fetchData]);
  
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
      alert("Đã lưu!"); fetchData();
    } catch (e) { alert("Lỗi!"); } finally { setIsLoading(false); }
  };

  return window.location.hash.toUpperCase().includes('ACP1122') 
    ? <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} onSave={handleSave} />
    : <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} supabase={supabase} />;
};
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
