
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH CỐ ĐỊNH (Hardcoded theo yêu cầu của bạn) ---
const DEFAULT_URL = 'https://qrzfpeeuohzfquzfiebc.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemZwZWV1b2h6ZnF1emZpZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY4MDgsImV4cCI6MjA4NDMyMjgwOH0.tyzhzbucriL09bH-ndgXs3ob1-Www97vsfQ6Wsh8d7s';

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

const CONFIG_KEY = 'ut-trinh-config-v7';

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-stone-100 px-4 md:px-20 h-20 md:h-24 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xl rounded-sm group-hover:bg-amber-800 transition-colors shrink-0">Ú</div>
          <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 whitespace-nowrap">
            <span className="text-sm md:text-2xl font-black text-amber-700 uppercase tracking-tighter">CƠM PHẦN</span>
            <span className="text-sm md:text-2xl font-black text-stone-900 uppercase tracking-tighter">ÚT TRINH</span>
          </div>
        </div>
        <div className="flex gap-2 md:gap-8 items-center">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all">Thoát ACP</button>
          ) : (
            <div className="flex gap-3 md:gap-8 items-center">
              <button 
                onClick={() => setShowConciseMenu(true)} 
                className="text-amber-800 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-amber-50 px-3 md:px-5 py-2 rounded-full border border-amber-100 whitespace-nowrap"
              >
                Menu Ảnh
              </button>
              <span className="text-red-600 text-[9px] md:text-[11px] font-black tracking-widest uppercase hidden sm:block">HOTLINE: 0939.70.90.20</span>
            </div>
          )}
        </div>
      </nav>

      {showConciseMenu && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/95 backdrop-blur-2xl p-4" onClick={() => setShowConciseMenu(false)}>
          <img src="https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg" className="max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20" alt="Menu" />
          <button className="absolute top-5 right-5 text-white text-5xl hover:scale-110 transition-transform">×</button>
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
  const itemsPerPage = 8;
  const [prevDish, setPrevDish] = useState<Dish | null>(null);

  // Xáo trộn món ăn ngẫu nhiên
  const shuffledMenu = useMemo(() => {
    let filtered = activeFilter === Category.All ? [...menu] : menu.filter((item: Dish) => item.category === activeFilter);
    return filtered.sort(() => Math.random() - 0.5);
  }, [menu, activeFilter]);

  const displayedDishes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return shuffledMenu.slice(start, start + itemsPerPage);
  }, [shuffledMenu, currentPage]);

  // Slideshow 15 giây
  useEffect(() => {
    if (selectedIdx === null) return;
    const interval = setInterval(() => {
      setPrevDish(shuffledMenu[selectedIdx]);
      setSelectedIdx((prev) => (prev !== null ? (prev + 1) % shuffledMenu.length : null));
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedIdx, shuffledMenu]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setPrevDish(shuffledMenu[selectedIdx]);
      setSelectedIdx((selectedIdx + 1) % shuffledMenu.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setPrevDish(shuffledMenu[selectedIdx]);
      setSelectedIdx((selectedIdx - 1 + shuffledMenu.length) % shuffledMenu.length);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-amber-800 font-black tracking-widest uppercase text-[10px]">Đang dọn món ngon...</p>
      </div>
    </div>
  );

  const selectedDish = selectedIdx !== null ? shuffledMenu[selectedIdx] : null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav />
      
      {/* Hero Header */}
      <header className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide: HeroSlide, index: number) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.image_url} className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-stone-900/40"></div>
          </div>
        ))}
        <div className="relative z-20 text-center px-6">
          <span className="text-amber-400 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-4 block">Gói trọn tình quê</span>
          <h1 className="text-white text-5xl md:text-[110px] font-black tracking-tighter leading-none mb-6">ÚT TRINH<br/><span className="text-amber-500 italic">KITCHEN</span></h1>
          <p className="text-white/90 text-lg md:text-2xl font-light italic max-w-2xl mx-auto">"{heroSlides[currentSlide]?.quote || 'Nấu ăn bằng cả trái tim'}"</p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_: any, i: number) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`}></div>
          ))}
        </div>
      </header>

      {/* Main Menu Grid */}
      <main id="menu" className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 uppercase text-stone-900">Món Ngon Đặc Sản</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-10 border-b pb-6">
            {Object.values(Category).map((cat) => (
              <button 
                key={cat} 
                onClick={() => { setActiveFilter(cat); setCurrentPage(1); }}
                className={`text-[10px] font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${activeFilter === cat ? 'border-amber-800 text-amber-800' : 'border-transparent text-stone-300 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayedDishes.map((dish: Dish) => (
            <div 
              key={dish.id} 
              onClick={() => {
                setPrevDish(null);
                setSelectedIdx(shuffledMenu.findIndex(d => d.id === dish.id));
              }}
              className="bg-white rounded-[40px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-700 cursor-pointer group p-5"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden mb-8">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
              </div>
              <div className="px-2 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-2xl uppercase tracking-tighter leading-tight group-hover:text-amber-800 transition-colors">{dish.name}</h3>
                  <span className="text-amber-800 font-black text-xl tracking-tighter shrink-0">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic line-clamp-2">"{dish.description || 'Hương vị truyền thống miền Tây sông nước.'}"</p>
                <div><span className="text-[9px] font-black uppercase bg-stone-900 text-white px-4 py-1.5 rounded-full">{dish.category}</span></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cinematic Modal with 2s Animation */}
      {selectedDish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/98 backdrop-blur-2xl" onClick={() => setSelectedIdx(null)}>
          
          <style>{`
            @keyframes crossfade-in {
              from { opacity: 0; transform: scale(1.1); filter: blur(20px); }
              to { opacity: 1; transform: scale(1); filter: blur(0); }
            }
            @keyframes crossfade-out {
              from { opacity: 1; transform: scale(1); }
              to { opacity: 0; transform: scale(0.95); }
            }
            @keyframes slide-up-text {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-cinematic-in { animation: crossfade-in 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-cinematic-out { animation: crossfade-out 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-text-cinematic { animation: slide-up-text 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}</style>

          {/* Navigation Buttons - LUÔN HIỆN TRÊN MOBILE */}
          <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between items-center z-[150] pointer-events-none">
            <button 
              onClick={handlePrev}
              className="w-16 h-16 md:w-24 md:h-24 bg-white/5 border border-white/20 text-white rounded-full flex items-center justify-center text-3xl hover:bg-amber-800 transition-all pointer-events-auto active:scale-90 shadow-2xl backdrop-blur-md"
            >
              ←
            </button>
            <button 
              onClick={handleNext}
              className="w-16 h-16 md:w-24 md:h-24 bg-white/5 border border-white/20 text-white rounded-full flex items-center justify-center text-3xl hover:bg-amber-800 transition-all pointer-events-auto active:scale-90 shadow-2xl backdrop-blur-md"
            >
              →
            </button>
          </div>

          <div className="w-full h-full md:w-[92vw] md:h-[85vh] bg-white md:rounded-[80px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={() => setSelectedIdx(null)} className="absolute top-8 right-8 md:top-12 md:right-12 z-[140] text-stone-300 hover:text-stone-900 text-5xl hover:rotate-90 transition-all duration-500">×</button>

            {/* Media Section */}
            <div className="w-full h-[45vh] md:h-auto md:w-[55%] relative bg-black overflow-hidden">
              {/* Layer 1: Ảnh cũ (Mờ dần) */}
              {prevDish && (
                <div className="absolute inset-0 z-10 animate-cinematic-out">
                  <img src={prevDish.image_url} className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Layer 2: Ảnh mới (Hiện lên mượt) */}
              <img 
                key={selectedDish.id} 
                src={selectedDish.image_url} 
                className="w-full h-full object-cover relative z-20 animate-cinematic-in shadow-inner" 
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-10 md:p-24 flex flex-col justify-center bg-white relative">
              <div key={`txt-${selectedDish.id}`} className="animate-text-cinematic space-y-8 md:space-y-12">
                <div>
                   <span className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px] md:text-xs block mb-4">Món ngon gia truyền</span>
                   <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-stone-900">{selectedDish.name}</h2>
                </div>
                
                <div className="text-4xl md:text-6xl font-black text-amber-800 tabular-nums tracking-tighter">
                  {selectedDish.price}
                </div>

                <p className="text-stone-500 text-lg md:text-2xl italic font-light leading-relaxed max-w-lg">
                  "{selectedDish.description || 'Tinh hoa ẩm thực được chế biến tỉ mỉ từ những nguyên liệu tươi ngon nhất trong ngày.'}"
                </p>

                <div className="pt-6 flex items-center gap-6">
                  <span className="bg-stone-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{selectedDish.category}</span>
                  <div className="h-px flex-1 bg-stone-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-stone-900 text-white py-24 px-12 mt-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="text-3xl font-black tracking-widest mb-4">ÚT TRINH KITCHEN</div>
            <p className="text-stone-500 text-sm max-w-sm italic">"Nơi lưu giữ hương vị cơm nhà truyền thống, mang đến sự ấm áp cho mọi gia đình."</p>
          </div>
          <div className="space-y-2">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-black">Địa chỉ</p>
            <p className="text-amber-500 font-bold">158A/5 Trần Vĩnh Kiết, Ninh Kiều, Cần Thơ</p>
          </div>
          <div className="space-y-2">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-black">Hotline đặt món</p>
            <p className="text-amber-500 text-3xl font-black tabular-nums">0939.70.90.20</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between text-stone-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          <p>© 2026 ÚT TRINH KITCHEN — ALL RIGHTS RESERVED</p>
          <p>Handcrafted with Pride</p>
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
      <div className="max-w-6xl mx-auto bg-white rounded-[50px] shadow-2xl overflow-hidden">
        <div className="flex bg-stone-50 border-b border-stone-200 p-3 gap-2">
          {['menu', 'hero', 'config'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400'}`}>
              {tab === 'menu' ? '🍱 Thực Đơn' : tab === 'hero' ? '🖼️ Ảnh Bìa' : '⚙️ Cấu Hình'}
            </button>
          ))}
        </div>

        <div className="p-10 md:p-20">
          {activeTab === 'config' && (
            <div className="max-w-xl mx-auto py-12 space-y-12">
              <h2 className="text-5xl font-black uppercase text-center tracking-tighter">KẾT NỐI DATABASE</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Supabase URL</p>
                  <input placeholder="https://..." value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full bg-stone-50 border-2 p-5 rounded-3xl outline-none focus:border-stone-900 font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Anon / Publishable Key (Dán vào đây)</p>
                  <input placeholder="eyJhbGciOi..." value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full bg-stone-50 border-2 p-5 rounded-3xl outline-none focus:border-stone-900 font-mono text-xs" />
                </div>
                <button 
                  onClick={() => { setSupabaseConfig(localConfig); alert("Đã cập nhật cấu hình!"); }} 
                  className="w-full bg-stone-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">Danh Sách Món</h2>
                <div className="flex gap-4">
                  <button onClick={onSave} className="bg-stone-900 text-white px-8 py-3 text-[10px] font-black uppercase rounded-2xl shadow-lg">Đồng Bộ Cloud</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Món Mới', price: '0 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="bg-amber-800 text-white px-8 py-3 text-[10px] font-black uppercase rounded-2xl shadow-lg">+ Thêm</button>
                </div>
              </div>
              <div className="space-y-6">
                {menu.map((dish: Dish, i: number) => (
                  <div key={dish.id} className="p-8 border border-stone-100 bg-stone-50 rounded-[40px] flex flex-col md:flex-row gap-8 relative group">
                    <img src={dish.image_url || 'https://placehold.co/100x100?text=No+Img'} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="Tên món" value={dish.name} onChange={e => {
                        const m = [...menu]; m[i].name = e.target.value; setMenu(m);
                      }} className="bg-white border p-4 rounded-xl outline-none font-bold" />
                      <input placeholder="Giá" value={dish.price} onChange={e => {
                        const m = [...menu]; m[i].price = e.target.value; setMenu(m);
                      }} className="bg-white border p-4 rounded-xl outline-none font-black text-amber-800" />
                      <select value={dish.category} onChange={e => {
                        const m = [...menu]; m[i].category = e.target.value as Category; setMenu(m);
                      }} className="bg-white border p-4 rounded-xl outline-none font-black text-[10px] uppercase">
                        {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input placeholder="Link ảnh" value={dish.image_url} onChange={e => {
                        const m = [...menu]; m[i].image_url = e.target.value; setMenu(m);
                      }} className="md:col-span-3 bg-white border p-4 rounded-xl outline-none font-mono text-xs" />
                    </div>
                    <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="text-red-300 hover:text-red-500 text-2xl">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-12">
               <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">Ảnh Bìa</h2>
                <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: '' }])} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase rounded-2xl shadow-lg">+ Thêm Slide</button>
              </div>
              {heroSlides.map((slide: HeroSlide, i: number) => (
                <div key={slide.id} className="p-10 border-2 border-stone-50 bg-stone-50 rounded-[40px] flex flex-col gap-8 relative">
                  <img src={slide.image_url} className="w-full h-48 object-cover rounded-3xl" />
                  <div className="grid md:grid-cols-2 gap-6">
                    <input placeholder="Link ảnh" value={slide.image_url} onChange={e => {
                       const s = [...heroSlides]; s[i].image_url = e.target.value; setHeroSlides(s);
                    }} className="w-full border p-4 rounded-2xl outline-none font-mono text-xs" />
                    <input placeholder="Slogan" value={slide.quote} onChange={e => {
                       const s = [...heroSlides]; s[i].quote = e.target.value; setHeroSlides(s);
                    }} className="w-full border p-4 rounded-2xl outline-none italic" />
                  </div>
                  <button onClick={() => setHeroSlides(heroSlides.filter((s: any) => s.id !== slide.id))} className="text-red-500 font-bold uppercase text-[9px] self-center">Xóa slide</button>
                </div>
              ))}
              <button onClick={onSave} className="w-full bg-stone-900 text-white py-8 rounded-[40px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all">Lưu Lên Cloud</button>
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
    return { url: DEFAULT_URL, key: DEFAULT_KEY };
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
    } catch (e) { 
      console.error("Lỗi fetch:", e); 
    } finally { 
      setIsLoading(false); 
    }
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
      alert("Đã đồng bộ hóa dữ liệu lên mây thành công!");
      fetchData();
    } catch (e) { 
      alert("Lỗi đồng bộ dữ liệu!"); 
    } finally { 
      setIsLoading(false); 
    }
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
