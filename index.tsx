
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

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

const CONFIG_KEY = 'ut-trinh-config-v3';

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => (
  <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 md:px-16 h-20 flex items-center justify-between">
    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.location.hash = ''}>
      <div className="w-8 h-8 bg-stone-900 flex items-center justify-center text-white font-black text-sm group-hover:bg-orange-800 transition-colors">Ú</div>
      <span className="text-base font-black text-stone-900 uppercase tracking-[0.4em]">ÚT TRINH</span>
    </div>
    <div className="flex gap-8 items-center">
      {isAdmin ? (
        <button onClick={() => window.location.hash = ''} className="bg-stone-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-orange-800 transition-all shadow-lg">Thoát Admin</button>
      ) : (
        <div className="flex gap-8 items-center">
          <a href="#menu" className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-stone-900 transition-colors">Thực Đơn</a>
          <div className="w-px h-4 bg-stone-200 hidden md:block"></div>
          <span className="text-stone-900 text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">090.XXX.XXXX</span>
        </div>
      )}
    </div>
  </nav>
);

const HomePage = ({ menu, heroSlides, isLoading }: any) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>(Category.All);

  const filteredMenu = useMemo(() => {
    if (activeFilter === Category.All) return menu;
    return menu.filter((item: Dish) => item.category === activeFilter);
  }, [menu, activeFilter]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-stone-300 font-black tracking-[0.3em] uppercase text-xs">Đang bày mâm cơm...</div></div>;

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-orange-100 selection:text-orange-900">
      <Nav />
      
      {/* Hero Section - Magazine Style */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroSlides[0] && (
          <div className="absolute inset-0">
            <img src={heroSlides[0].image_url} className="w-full h-full object-cover animate-[slow-zoom_30s_infinite]" />
            <div className="absolute inset-0 bg-stone-950/20 backdrop-contrast-125"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        )}
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <span className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-8 block animate-in slide-in-from-bottom-4 duration-700">The Authentic Taste of Home</span>
          <h1 className="text-white text-7xl md:text-[160px] font-black tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">
            ÚT TRINH<br/><span className="text-orange-100/30 outline-text">KITCHEN</span>
          </h1>
          <div className="w-20 h-1 bg-white mx-auto mb-10 rounded-full animate-in fade-in duration-1000"></div>
          <p className="text-white/90 text-lg md:text-2xl font-light italic tracking-tight max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
            "{heroSlides[0]?.quote || 'Nơi những món ăn bình dị trở thành tinh hoa của gia đình.'}"
          </p>
        </div>
      </header>

      {/* Menu Section */}
      <main id="menu" className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col items-center mb-24 text-center">
          <span className="text-orange-800 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Our Selection</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 uppercase">Thực Đơn Hôm Nay</h2>
          
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-stone-100 pb-8 w-full">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeFilter === cat ? 'text-stone-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-800' : 'text-stone-300 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
          {filteredMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="group cursor-pointer animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 rounded-[40px] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-1000 transform group-hover:-translate-y-2">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-700"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="inline-block bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-900 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Xem Chi Tiết
                  </span>
                </div>
              </div>
              <div className="px-2 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight group-hover:text-orange-900 transition-colors">{dish.name}</h3>
                  <div className="h-px bg-stone-100 flex-1 mt-4"></div>
                  <span className="text-stone-900 font-black text-lg tracking-tighter shrink-0">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic font-medium leading-relaxed line-clamp-2">"{dish.description || 'Hương vị đặc trưng từ công thức gia truyền nhà Út Trinh.'}"</p>
                <div className="flex gap-2 pt-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-800 bg-orange-50 px-3 py-1 rounded-full">{dish.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Detail - Full Screen Luxury */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/98 backdrop-blur-2xl p-6" onClick={() => setSelectedDish(null)}>
          <div className="max-w-7xl w-full flex flex-col md:flex-row gap-16 animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square md:aspect-auto h-[45vh] md:h-[85vh] bg-stone-100 rounded-[60px] overflow-hidden shadow-2xl">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center relative pr-8">
              <button onClick={() => setSelectedDish(null)} className="absolute -top-12 md:top-0 md:-right-4 text-stone-300 hover:text-stone-900 transition-all hover:rotate-90">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="space-y-12">
                <div>
                  <span className="text-orange-800 text-xs font-black uppercase tracking-[0.6em] mb-6 block">{selectedDish.category}</span>
                  <h2 className="text-6xl md:text-[100px] font-black tracking-tighter mb-8 leading-[0.85] uppercase text-stone-900">{selectedDish.name}</h2>
                  <div className="flex items-center gap-8">
                    <p className="text-4xl md:text-5xl text-stone-300 font-light tracking-tighter">{selectedDish.price}</p>
                    <div className="w-24 h-px bg-stone-200"></div>
                  </div>
                </div>
                
                <div className="space-y-8 max-w-lg">
                  <p className="text-stone-500 text-xl md:text-2xl font-light italic leading-relaxed">
                    "{selectedDish.description || 'Được chế biến từ nguyên liệu tươi sạch nhất trong ngày, mang đến sự ấm áp và ngon miệng như bữa cơm mẹ nấu.'}"
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-8">
                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <span className="block text-[10px] font-black uppercase text-stone-400 mb-2">Trạng thái</span>
                      <span className="text-stone-900 font-bold">Luôn nóng hổi</span>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <span className="block text-[10px] font-black uppercase text-stone-400 mb-2">Nguyên liệu</span>
                      <span className="text-stone-900 font-bold">Tự nhiên 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-32 px-12 border-t border-stone-100 bg-stone-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <span className="text-stone-900 font-black tracking-[0.5em] uppercase text-xl block mb-4">ÚT TRINH KITCHEN</span>
            <p className="text-stone-400 text-xs uppercase tracking-[0.2em]">Hương vị gia đình Việt - Phục vụ bằng cả trái tim</p>
          </div>
          <div className="flex gap-16 text-center md:text-left">
            <div>
              <span className="block text-[10px] font-black uppercase text-stone-900 tracking-widest mb-4">Địa Điểm</span>
              <p className="text-stone-400 text-sm">Quận 1, TP. Hồ Chí Minh</p>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-stone-900 tracking-widest mb-4">Thời Gian</span>
              <p className="text-stone-400 text-sm">08:00 - 21:00 Hàng Ngày</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          color: transparent;
        }
      `}</style>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  const addDish = () => {
    setMenu([...menu, { 
      id: Date.now().toString(), 
      name: 'Món ăn mới', 
      price: '50.000 VNĐ', 
      description: '', 
      image_url: '', 
      category: Category.MainCourse 
    }]);
  };

  const addHero = () => {
    setHeroSlides([...heroSlides, {
      id: Date.now().toString(),
      image_url: '',
      quote: 'Slogan mới của bạn'
    }]);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-20">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-[48px] shadow-2xl border border-stone-100 overflow-hidden">
          {/* Admin Navigation */}
          <div className="flex bg-stone-50/50 p-4 gap-4 border-b">
            <button onClick={() => setActiveTab('menu')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest rounded-3xl transition-all ${activeTab === 'menu' ? 'bg-white shadow-xl text-stone-900 scale-[1.02]' : 'text-stone-400 hover:text-stone-600'}`}>🍱 Thực Đơn</button>
            <button onClick={() => setActiveTab('hero')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest rounded-3xl transition-all ${activeTab === 'hero' ? 'bg-white shadow-xl text-stone-900 scale-[1.02]' : 'text-stone-400 hover:text-stone-600'}`}>🖼️ Ảnh Bìa</button>
            <button onClick={() => setActiveTab('config')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest rounded-3xl transition-all ${activeTab === 'config' ? 'bg-orange-800 text-white shadow-xl' : 'bg-stone-200/50 text-stone-500'}`}>⚙️ Hệ Thống</button>
          </div>

          <div className="p-12 md:p-16">
            {activeTab === 'config' && (
              <div className="max-w-xl mx-auto py-10 space-y-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-4 text-stone-900">SUPABASE CLOUD</h2>
                  <p className="text-stone-400 text-sm leading-relaxed">Kết nối với cơ sở dữ liệu để lưu trữ món ăn của bạn vĩnh viễn và an toàn.</p>
                </div>
                <div className="space-y-6">
                  <input placeholder="Project URL (https://...)" value={localConfig.url || ''} onChange={e => setLocalConfig({...localConfig, url: e.target.value.trim()})} className="w-full border-2 border-stone-100 p-6 rounded-3xl outline-none focus:border-stone-900 transition-all font-mono text-sm" />
                  <input placeholder="Anon Public Key" value={localConfig.key || ''} onChange={e => setLocalConfig({...localConfig, key: e.target.value.trim()})} className="w-full border-2 border-stone-100 p-6 rounded-3xl outline-none focus:border-stone-900 transition-all font-mono text-sm" />
                  <button onClick={() => { setSupabaseConfig(localConfig); alert("Đã cập nhật cấu hình!"); setActiveTab('menu'); }} className="w-full bg-stone-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-orange-800 transition-all">Lưu & Kết Nối</button>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-stone-100 pb-12">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Danh Sách Món Ăn ({menu.length})</h2>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={onSave} className="flex-1 md:flex-none bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl hover:shadow-2xl transition-all">Đồng Bộ Cloud</button>
                    <button onClick={addDish} className="flex-1 md:flex-none bg-orange-800 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl hover:shadow-2xl transition-all">+ Thêm Món</button>
                  </div>
                </div>
                <div className="grid gap-10">
                  {menu.map((dish: Dish) => (
                    <div key={dish.id} className="bg-stone-50/50 p-10 rounded-[40px] border border-stone-100 grid grid-cols-1 xl:grid-cols-4 gap-10 items-end relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Tên món ăn</label>
                        <input value={dish.name || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="w-full bg-white p-4 rounded-2xl border-2 border-stone-100 focus:border-stone-900 outline-none font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Giá bán</label>
                        <input value={dish.price || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="w-full bg-white p-4 rounded-2xl border-2 border-stone-100 focus:border-stone-900 outline-none text-orange-800 font-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Phân loại</label>
                        <select value={dish.category} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="w-full bg-white p-4 rounded-2xl border-2 border-stone-100 focus:border-stone-900 outline-none appearance-none cursor-pointer font-bold">
                          {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Link ảnh Unsplash</label>
                        <input value={dish.image_url || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="w-full bg-white p-4 rounded-2xl border-2 border-stone-100 focus:border-stone-900 outline-none font-mono text-[10px]" />
                      </div>
                      <div className="xl:col-span-4 space-y-2">
                         <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Mô tả hương vị (Nên bắt đầu bằng "Món ăn...")</label>
                         <textarea value={dish.description || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="w-full bg-white p-4 rounded-2xl border-2 border-stone-100 focus:border-stone-900 outline-none h-24 italic" />
                      </div>
                      <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="absolute top-6 right-6 text-stone-200 hover:text-red-500 transition-all p-2 bg-stone-100 hover:bg-red-50 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-12 py-10">
                <div className="flex justify-between items-center border-b border-stone-100 pb-10">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Ảnh Bìa Chào Mừng</h2>
                  <div className="flex gap-4">
                     <button onClick={onSave} className="bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl">Lưu Thay Đổi</button>
                     <button onClick={addHero} className="bg-orange-800 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl">+ Thêm Hero</button>
                  </div>
                </div>
                
                {heroSlides.length === 0 && (
                   <div className="py-20 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
                      <p className="text-stone-400 italic mb-6">Bạn chưa có ảnh bìa nào.</p>
                      <button onClick={addHero} className="text-stone-900 font-black uppercase text-xs border-b-2 border-stone-900 pb-1">Bấm vào đây để tạo mới</button>
                   </div>
                )}

                <div className="grid gap-12">
                  {heroSlides.map((slide: HeroSlide) => (
                    <div key={slide.id} className="space-y-8 bg-stone-50/50 p-12 rounded-[50px] border border-stone-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-700">
                      <div className="aspect-[21/9] w-full bg-stone-200 rounded-[32px] overflow-hidden shadow-inner border-4 border-white">
                        {slide.image_url ? <img src={slide.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300 font-black italic tracking-widest">CHƯA CÓ ẢNH</div>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Link ảnh Hero (Từ Unsplash - Paste vào đây)</label>
                          <input 
                            placeholder="Dán link ảnh tại đây..." 
                            value={slide.image_url || ''} 
                            onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value.trim()} : s))} 
                            className="w-full bg-white border-2 border-stone-100 p-5 rounded-2xl focus:border-stone-900 outline-none font-mono text-xs shadow-sm" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Slogan hiện trên ảnh</label>
                          <input 
                            placeholder="VD: Hương vị cơm nhà..." 
                            value={slide.quote || ''} 
                            onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} 
                            className="w-full bg-white border-2 border-stone-100 p-5 rounded-2xl focus:border-stone-900 outline-none italic text-lg shadow-sm" 
                          />
                        </div>
                      </div>
                      <button onClick={() => setHeroSlides(heroSlides.filter((s: any) => s.id !== slide.id))} className="absolute top-8 right-8 text-stone-200 hover:text-red-500 transition-all p-3 bg-stone-100 rounded-2xl">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [supabaseConfig, setSupabaseConfig] = useState(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : { url: '', key: '' };
  });

  const [menu, setMenu] = useState<Dish[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hash, setHash] = useState(window.location.hash);

  const supabase = useMemo(() => {
    if (supabaseConfig.url && supabaseConfig.key) return createClient(supabaseConfig.url, supabaseConfig.key);
    return null;
  }, [supabaseConfig]);

  const fetchData = useCallback(async () => {
    if (!supabase) { 
      setMenu([{ id: '1', name: 'Món Mẫu Cao Cấp', price: '99.000 VNĐ', description: 'Một món ăn tuyệt vời chưa có dữ liệu.', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000', category: Category.MainCourse }]);
      setHeroSlides([{ id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=1920', quote: 'Món ăn gia đình được phục vụ theo phong cách thượng hạng.' }]);
      setIsLoading(false); 
      return; 
    }
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: true });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes?.length) setMenu(dishes);
      if (slides?.length) setHeroSlides(slides);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(supabaseConfig));
    fetchData();
  }, [supabaseConfig, fetchData]);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSave = async () => {
    if (!supabase) return alert("Chưa cấu hình Supabase Cloud!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('name', '_temp_');
      await supabase.from('hero_slides').delete().neq('quote', '_temp_');
      if (menu.length) await supabase.from('dishes').insert(menu.map(({id, ...rest}) => rest));
      if (heroSlides.length) await supabase.from('hero_slides').insert(heroSlides.map(({id, ...rest}) => rest));
      alert("🎉 Đã đồng bộ mâm cơm thành công!");
      fetchData();
    } catch (e) {
      alert("❌ Lỗi đồng bộ! Hãy đảm bảo bạn đã tạo bảng trong SQL Editor.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (hash.toLowerCase().includes('acpanel')) {
    return <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} onSave={handleSave} />;
  }
  return <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
