
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH ---
const HARDCODED_SUPABASE_URL = ''; 
const HARDCODED_SUPABASE_KEY = ''; 

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

const CONFIG_KEY = 'ut-trinh-config-v5';

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
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">Thoát</button>
          ) : (
            <div className="flex gap-3 md:gap-8 items-center">
              <button 
                onClick={() => setShowConciseMenu(true)} 
                className="text-amber-800 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-amber-50 px-3 md:px-5 py-2 rounded-full border border-amber-100"
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
          <img src="https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg" className="max-h-[90vh] object-contain rounded-2xl shadow-2xl" alt="Menu" />
          <button className="absolute top-5 right-5 text-white text-4xl">×</button>
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
  
  // Lưu giữ ảnh cũ để làm hiệu ứng crossfade
  const [prevImageUrl, setPrevImageUrl] = useState<string | null>(null);

  // Xáo trộn món ăn ngẫu nhiên mỗi lần load hoặc đổi filter
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
      setPrevImageUrl(shuffledMenu[selectedIdx].image_url);
      setSelectedIdx((prev) => (prev !== null ? (prev + 1) % shuffledMenu.length : null));
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedIdx, shuffledMenu]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setPrevImageUrl(shuffledMenu[selectedIdx].image_url);
      setSelectedIdx((selectedIdx + 1) % shuffledMenu.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setPrevImageUrl(shuffledMenu[selectedIdx].image_url);
      setSelectedIdx((selectedIdx - 1 + shuffledMenu.length) % shuffledMenu.length);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-amber-800 font-black tracking-widest uppercase text-[10px]">Đang dọn món...</div>
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
            <img src={slide.image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-stone-900/40"></div>
          </div>
        ))}
        <div className="relative z-20 text-center px-6">
          <h1 className="text-white text-5xl md:text-[100px] font-black tracking-tighter leading-none mb-6">ÚT TRINH<br/><span className="text-amber-500 italic">KITCHEN</span></h1>
          <p className="text-white/90 text-lg md:text-2xl font-light italic">Hương vị cơm nhà - Đậm đà tình thân</p>
        </div>
      </header>

      {/* Main Menu Grid */}
      <main id="menu" className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">Thực Đơn Hôm Nay</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b pb-6">
            {Object.values(Category).map((cat) => (
              <button 
                key={cat} 
                onClick={() => { setActiveFilter(cat); setCurrentPage(1); }}
                className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeFilter === cat ? 'border-amber-800 text-amber-800' : 'border-transparent text-stone-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedDishes.map((dish: Dish) => (
            <div 
              key={dish.id} 
              onClick={() => {
                setPrevImageUrl(null); // Reset prev image when opening first time
                setSelectedIdx(shuffledMenu.findIndex(d => d.id === dish.id));
              }}
              className="bg-white rounded-[32px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all cursor-pointer group p-4"
            >
              <div className="aspect-square rounded-[24px] overflow-hidden mb-6">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl uppercase tracking-tighter leading-tight">{dish.name}</h3>
                  <span className="text-amber-800 font-black">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm line-clamp-2 italic">"{dish.description || 'Món ngon mỗi ngày tại Út Trinh Kitchen.'}"</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cinematic Modal */}
      {selectedDish && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/98 backdrop-blur-2xl transition-all"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Nút điều hướng (Luôn nổi lên trên cùng, kích thước lớn cho mobile) */}
          <div className="absolute inset-x-4 md:inset-x-10 flex justify-between items-center pointer-events-none z-[120]">
            <button 
              onClick={handlePrev}
              className="w-14 h-14 md:w-20 md:h-20 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center text-3xl hover:bg-amber-800 transition-all pointer-events-auto active:scale-90"
            >
              ←
            </button>
            <button 
              onClick={handleNext}
              className="w-14 h-14 md:w-20 md:h-20 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center text-3xl hover:bg-amber-800 transition-all pointer-events-auto active:scale-90"
            >
              →
            </button>
          </div>

          <div 
            className="w-full h-full md:w-[90vw] md:h-[80vh] bg-white md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button onClick={() => setSelectedIdx(null)} className="absolute top-6 right-6 md:top-10 md:right-10 z-[130] text-stone-300 hover:text-stone-900 text-4xl">×</button>

            {/* Vùng hình ảnh với hiệu ứng Crossfade & Zoom */}
            <div className="w-full h-[50vh] md:h-auto md:w-1/2 relative bg-black overflow-hidden">
              {/* Layer 1: Ảnh cũ (Mờ dần đi) */}
              {prevImageUrl && (
                <img 
                  key={`prev-${prevImageUrl}`}
                  src={prevImageUrl} 
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30" 
                />
              )}
              
              {/* Layer 2: Ảnh mới (Hiện lên mượt mà + Zoom out chậm) */}
              <style>{`
                @keyframes cinematic-zoom {
                  from { transform: scale(1.2); opacity: 0; filter: blur(10px); }
                  to { transform: scale(1); opacity: 1; filter: blur(0); }
                }
                .animate-cinematic {
                  animation: cinematic-zoom 2s ease-out forwards;
                }
                @keyframes text-slide-up {
                  from { transform: translateY(30px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
                .animate-text-cinematic {
                  animation: text-slide-up 1.5s ease-out forwards;
                }
              `}</style>
              
              <img 
                key={`main-${selectedDish.id}`} 
                src={selectedDish.image_url} 
                className="w-full h-full object-cover animate-cinematic relative z-10" 
              />
            </div>

            {/* Vùng nội dung */}
            <div className="flex-1 p-8 md:p-20 flex flex-col justify-center bg-white">
              <div className="max-w-xl">
                <div key={`info-${selectedDish.id}`} className="animate-text-cinematic space-y-6 md:space-y-10">
                  <span className="text-amber-800 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Thực đơn đặc biệt</span>
                  <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-stone-900">{selectedDish.name}</h2>
                  <div className="text-3xl md:text-5xl font-black text-amber-800 tabular-nums">{selectedDish.price}</div>
                  <p className="text-stone-500 text-lg md:text-xl italic font-light leading-relaxed">"{selectedDish.description || 'Món ăn truyền thống hòa quyện cùng phong cách chế biến hiện đại.'}"</p>
                  <div className="pt-6">
                    <span className="bg-stone-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedDish.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-stone-900 text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="text-2xl font-black tracking-widest">ÚT TRINH KITCHEN</div>
          <p className="text-stone-500 text-sm italic">Địa chỉ: 158A/5 Trần Vĩnh Kiết, Ninh Kiều, TP Cần Thơ</p>
          <div className="text-amber-500 font-bold">Hotline: 0939.70.90.20</div>
          <div className="pt-10 border-t border-white/5 text-[10px] uppercase tracking-widest text-stone-600">© 2026 Crafted with Love</div>
        </div>
      </footer>
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
      setMenu([
        { id: '1', name: 'Món Cá Kho Tộ', price: '125.000 VNĐ', description: 'Cá kho đậm đà, chuẩn vị miền Tây.', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', category: Category.MainCourse },
        { id: '2', name: 'Canh Chua Cá Hú', price: '95.000 VNĐ', description: 'Canh chua thanh mát giải nhiệt mùa hè.', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', category: Category.Soup }
      ]);
      setHeroSlides([{ id: 'h1', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920', quote: 'Tinh hoa ẩm thực Việt' }]);
      setIsLoading(false);
      return;
    }
    try {
      const { data: dishes } = await supabase.from('dishes').select('*');
      const { data: slides } = await supabase.from('hero_slides').select('*');
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const h = () => setHash(window.location.hash);
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const handleSave = async () => {
    if (!supabase) return alert("Cần database!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('id', '0');
      await supabase.from('hero_slides').delete().neq('id', '0');
      const sanitize = (list: any[]) => list.map(({ id, created_at, ...rest }) => rest);
      if (menu.length) await supabase.from('dishes').insert(sanitize(menu));
      if (heroSlides.length) await supabase.from('hero_slides').insert(sanitize(heroSlides));
      alert("Đồng bộ thành công!");
      fetchData();
    } catch (e) { alert("Lỗi đồng bộ!"); } finally { setIsLoading(false); }
  };

  const isACP = hash.toUpperCase().includes('ACP1122');

  return (
    <>
      {isACP ? (
        <div className="p-10 bg-white min-h-screen pt-32">
          <Nav isAdmin />
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black">QUẢN TRỊ VIÊN</h2>
              <button onClick={handleSave} className="bg-amber-800 text-white px-8 py-3 rounded-xl font-bold">LƯU CLOUD</button>
            </div>
            <div className="grid gap-6">
              {menu.map((d, i) => (
                <div key={d.id} className="p-6 border rounded-2xl flex flex-col gap-4 bg-stone-50">
                   <div className="grid grid-cols-2 gap-4">
                      <input className="border p-3 rounded-lg" value={d.name} onChange={e => {
                        const newMenu = [...menu];
                        newMenu[i].name = e.target.value;
                        setMenu(newMenu);
                      }} />
                      <input className="border p-3 rounded-lg" value={d.price} onChange={e => {
                        const newMenu = [...menu];
                        newMenu[i].price = e.target.value;
                        setMenu(newMenu);
                      }} />
                   </div>
                   <input className="border p-3 rounded-lg w-full" value={d.image_url} placeholder="Link ảnh" onChange={e => {
                        const newMenu = [...menu];
                        newMenu[i].image_url = e.target.value;
                        setMenu(newMenu);
                   }} />
                   <textarea className="border p-3 rounded-lg" value={d.description} onChange={e => {
                        const newMenu = [...menu];
                        newMenu[i].description = e.target.value;
                        setMenu(newMenu);
                   }} />
                   <button onClick={() => setMenu(menu.filter(m => m.id !== d.id))} className="text-red-500 font-bold self-end text-sm">Xóa món này</button>
                </div>
              ))}
              <button onClick={() => setMenu([...menu, {id: Date.now().toString(), name: 'Món mới', price: '0đ', description: '', image_url: '', category: Category.MainCourse}])} className="border-2 border-dashed p-6 rounded-2xl text-stone-400 font-bold">+ Thêm món mới</button>
            </div>
          </div>
        </div>
      ) : (
        <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} supabase={supabase} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
