
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- TYPES & INTERFACES ---
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

interface SupabaseConfig {
  url: string;
  key: string;
}

// --- CONSTANTS ---
const CONFIG_KEY = 'ut-trinh-config-v3';

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => (
  <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-stone-100 px-8 h-20 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.hash = ''}>
      <div className="w-10 h-10 bg-orange-900 rounded-lg flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-transform">Ú</div>
      <span className="text-xl font-black text-stone-900 uppercase tracking-[0.2em]">ÚT TRINH</span>
    </div>
    
    <div className="flex gap-8 items-center">
      {isAdmin ? (
        <button onClick={() => window.location.hash = ''} className="bg-stone-100 text-stone-600 px-6 py-2.5 rounded-full text-[11px] font-black uppercase hover:bg-stone-900 hover:text-white transition-all shadow-sm">Thoát Admin</button>
      ) : (
        <div className="hidden md:flex gap-8 items-center">
          <span className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">Hương Vị Cơm Nhà</span>
          <div className="w-px h-4 bg-stone-200"></div>
          <a href="#menu" className="text-stone-900 text-xs font-black uppercase tracking-widest hover:text-orange-800 transition-colors">Thực Đơn</a>
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-900"></div></div>;

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900">
      <Nav />
      
      {/* Hero Section - Sang trọng, phóng khoáng */}
      <header className="relative h-screen bg-stone-950 flex items-center justify-center overflow-hidden">
        {heroSlides[0] && (
          <div className="absolute inset-0">
            <img src={heroSlides[0].image_url} className="w-full h-full object-cover opacity-50 scale-105 animate-[slow-zoom_20s_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/20 to-stone-950"></div>
          </div>
        )}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-orange-400 text-[11px] md:text-xs font-black uppercase tracking-[0.5em] mb-6 animate-in slide-in-from-bottom-4 duration-700">Thưởng thức trọn vẹn tinh hoa</p>
          <h1 className="text-white text-7xl md:text-[120px] font-black leading-none mb-8 tracking-tighter drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">ÚT TRINH<br/><span className="text-orange-800">KITCHEN</span></h1>
          <div className="w-24 h-1 bg-orange-800 mx-auto mb-8 rounded-full"></div>
          <p className="text-stone-300 text-lg md:text-2xl font-light italic tracking-wide max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
            "{heroSlides[0]?.quote || 'Hương vị cơm nhà gói trọn trong từng món ăn.'}"
          </p>
        </div>
        <a href="#menu" className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce opacity-50 hover:opacity-100 transition-opacity">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </a>
      </header>

      {/* Menu Section */}
      <main id="menu" className="max-w-7xl mx-auto py-32 px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-stone-100 pb-12">
          <div className="max-w-xl">
            <span className="text-orange-800 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Danh Mục Món Ăn</span>
            <h2 className="text-5xl font-black text-stone-900 tracking-tighter mb-4">KHÁM PHÁ THỰC ĐƠN</h2>
            <p className="text-stone-400 font-medium">Chúng tôi mang đến những món ăn tươi sạch nhất mỗi ngày, được chế biến từ tâm huyết của người đầu bếp gia đình.</p>
          </div>
          
          {/* Category Filter - Cực kỳ chuyên nghiệp */}
          <div className="flex flex-wrap gap-2 md:gap-3 bg-stone-50 p-1.5 rounded-2xl border border-stone-100">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === cat ? 'bg-orange-800 text-white shadow-lg shadow-orange-900/20 translate-y-[-2px]' : 'text-stone-400 hover:text-stone-900 hover:bg-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredMenu.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 italic">Hiện tại chưa có món ăn nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredMenu.map((dish: Dish) => (
              <div 
                key={dish.id} 
                onClick={() => setSelectedDish(dish)} 
                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-stone-900 text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-xl">
                      {dish.category}
                    </span>
                  </div>
                </div>
                <div className="pt-8 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-2xl font-black text-stone-900 leading-none group-hover:text-orange-900 transition-colors uppercase tracking-tighter">{dish.name}</h3>
                    <span className="text-orange-800 font-black text-lg shrink-0">{dish.price}</span>
                  </div>
                  <p className="text-stone-400 text-sm italic font-medium leading-relaxed line-clamp-2">"{dish.description}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal - Đỉnh cao UX */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-6" onClick={() => setSelectedDish(null)}>
          <div className="bg-white max-w-6xl w-full rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square md:aspect-auto h-[40vh] md:h-[80vh]">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="p-12 md:p-20 flex flex-col justify-center bg-white md:w-1/2 relative overflow-y-auto max-h-[60vh] md:max-h-none">
              <button onClick={() => setSelectedDish(null)} className="absolute top-10 right-10 text-stone-300 hover:text-stone-900 transition-all hover:rotate-90">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="space-y-10">
                <div>
                  <span className="text-orange-800 text-xs font-black uppercase tracking-[0.5em] mb-6 block">{selectedDish.category}</span>
                  <h2 className="text-5xl md:text-7xl font-black text-stone-900 mb-6 tracking-tighter leading-[0.9] uppercase">{selectedDish.name}</h2>
                  <div className="flex items-center gap-6">
                    <p className="text-3xl md:text-4xl text-orange-900 font-black">{selectedDish.price}</p>
                    <div className="w-20 h-px bg-stone-200"></div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-stone-500 text-xl md:text-2xl font-light italic leading-relaxed">
                    "{selectedDish.description || 'Hương vị tuyệt hảo, được chế biến từ những nguyên liệu tươi ngon nhất trong ngày để mang lại cảm giác cơm nhà ấm cúng.'}"
                  </p>
                  <div className="flex gap-4 pt-6">
                     <div className="p-4 bg-stone-50 rounded-2xl flex-1">
                        <span className="block text-[9px] font-black uppercase text-stone-400 mb-1">Thời gian chuẩn bị</span>
                        <span className="text-stone-900 font-bold">15 - 20 phút</span>
                     </div>
                     <div className="p-4 bg-stone-50 rounded-2xl flex-1">
                        <span className="block text-[9px] font-black uppercase text-stone-400 mb-1">Phục vụ</span>
                        <span className="text-stone-900 font-bold">Tận tâm 24/7</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-50 py-24 px-8 border-t border-stone-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-black text-stone-900 tracking-widest mb-4">ÚT TRINH KITCHEN</h4>
            <p className="text-stone-400 text-sm max-w-sm">Nơi lưu giữ những kỷ niệm gia đình qua từng bữa cơm ngon lành và ấm áp.</p>
          </div>
          <div className="flex gap-12 text-center md:text-left">
            <div>
               <span className="block text-[10px] font-black uppercase text-stone-900 tracking-widest mb-4">Địa Chỉ</span>
               <p className="text-stone-400 text-sm">TP. Hồ Chí Minh, Việt Nam</p>
            </div>
            <div>
               <span className="block text-[10px] font-black uppercase text-stone-900 tracking-widest mb-4">Liên Hệ</span>
               <p className="text-stone-400 text-sm">090.XXX.XXXX</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  const handleConfigSave = () => {
    if (!localConfig.url.startsWith('https://')) return alert("URL phải bắt đầu bằng https://");
    setSupabaseConfig(localConfig);
    alert("Đã kết nối thành công!");
    setActiveTab('menu');
  };

  const addDish = () => {
    setMenu([...menu, { 
      id: Date.now().toString(), 
      name: 'Món ăn mới', 
      price: '0 VNĐ', 
      description: '', 
      image_url: '', 
      category: Category.MainCourse // Luôn mặc định có category
    }]);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden mb-10 border border-stone-200">
           <div className="flex p-4 gap-4 bg-stone-100/50 border-b">
            <button onClick={() => setActiveTab('menu')} className={`flex-1 py-5 text-[11px] font-black uppercase rounded-3xl transition-all ${activeTab === 'menu' ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>📋 Quản Lý Món</button>
            <button onClick={() => setActiveTab('hero')} className={`flex-1 py-5 text-[11px] font-black uppercase rounded-3xl transition-all ${activeTab === 'hero' ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>🖼️ Ảnh Hero</button>
            <button onClick={() => setActiveTab('config')} className={`flex-1 py-5 text-[11px] font-black uppercase rounded-3xl transition-all ${activeTab === 'config' ? 'bg-orange-800 text-white shadow-xl shadow-orange-900/20' : 'bg-stone-200/50 text-stone-500'}`}>⚙️ Cài Đặt Cloud</button>
          </div>

          <div className="p-12">
            {activeTab === 'config' && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-black mb-4 text-stone-900 tracking-tighter">THIẾT LẬP KẾT NỐI</h2>
                <p className="text-stone-400 mb-12 text-sm italic">Hệ thống sử dụng Supabase để lưu trữ dữ liệu vĩnh viễn.</p>
                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest ml-1">Supabase Project URL</label>
                    <input value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value.trim()})} className="w-full border-2 border-stone-100 p-6 bg-stone-50 rounded-3xl font-mono text-sm focus:border-orange-800 outline-none transition-all" placeholder="https://..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest ml-1">Anon Public Key</label>
                    <input value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value.trim()})} className="w-full border-2 border-stone-100 p-6 bg-stone-50 rounded-3xl font-mono text-sm focus:border-orange-800 outline-none transition-all" placeholder="Mã bí mật từ Supabase..." />
                  </div>
                  <button onClick={handleConfigSave} className="w-full bg-orange-800 text-white py-8 font-black uppercase rounded-3xl shadow-2xl hover:bg-stone-900 transition-all transform hover:-translate-y-1">Kích Hoạt Hệ Thống</button>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-10">
                <div className="flex justify-between items-center border-b border-stone-100 pb-10">
                  <div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tighter">DANH SÁCH MÓN ĂN</h2>
                    <p className="text-orange-800 text-[10px] font-black uppercase tracking-widest mt-2">Tổng số: {menu.length} món trên mâm</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={onSave} className="bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl hover:bg-orange-900 transition-all shadow-xl">Đồng Bộ Cloud</button>
                    <button onClick={addDish} className="bg-orange-800 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl hover:bg-stone-900 transition-all shadow-xl">+ Thêm Món</button>
                  </div>
                </div>
                
                <div className="grid gap-12">
                  {menu.map((dish: Dish) => (
                    <div key={dish.id} className="bg-stone-50 p-10 rounded-[32px] border border-stone-100 flex flex-col xl:flex-row gap-10 items-start relative hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="w-full xl:w-48 aspect-square bg-stone-200 rounded-3xl overflow-hidden shrink-0 border-4 border-white shadow-lg">
                        <img src={dish.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 w-full">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Tên Món Ăn</label>
                          <input placeholder="VD: Sườn Rim" value={dish.name} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="w-full bg-white p-5 rounded-2xl text-sm font-bold border-2 border-stone-100 focus:border-orange-800 outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Giá Niêm Yết</label>
                          <input placeholder="VD: 55.000 VNĐ" value={dish.price} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="w-full bg-white p-5 rounded-2xl text-sm text-orange-900 font-black border-2 border-stone-100 focus:border-orange-800 outline-none transition-all" />
                        </div>
                        
                        {/* FIX: Ô chọn Danh mục (Category) rõ ràng */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Phân Loại (CAT)</label>
                          <select 
                            value={dish.category} 
                            onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} 
                            className="w-full bg-white p-5 rounded-2xl text-sm font-bold border-2 border-stone-100 focus:border-orange-800 outline-none transition-all appearance-none cursor-pointer"
                          >
                            {Object.values(Category).filter(c => c !== Category.All).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        
                        <div className="space-y-2 md:col-span-3">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Link Ảnh Minh Họa</label>
                          <input placeholder="Dán URL ảnh..." value={dish.image_url} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="w-full bg-white p-5 rounded-2xl text-xs font-mono border-2 border-stone-100 focus:border-orange-800 outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-2 md:col-span-3">
                          <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Mô Tả Hương Vị</label>
                          <textarea placeholder="Viết mô tả..." value={dish.description} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="w-full bg-white p-5 rounded-2xl text-sm h-24 border-2 border-stone-100 focus:border-orange-800 outline-none transition-all" />
                        </div>
                      </div>
                      
                      <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="absolute top-6 right-6 text-stone-300 hover:text-red-600 transition-colors p-3 bg-stone-100 hover:bg-red-50 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-12">
                 <div className="flex justify-between items-center border-b border-stone-100 pb-10">
                  <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase">ẢNH BÌA TRANG CHỦ</h2>
                  <button onClick={onSave} className="bg-stone-900 text-white px-10 py-5 text-[10px] font-black uppercase rounded-2xl shadow-xl">Lưu Thay Đổi</button>
                </div>
                {heroSlides.map((slide: HeroSlide) => (
                  <div key={slide.id} className="bg-stone-50 p-12 rounded-[40px] border border-stone-100 space-y-10">
                    <div className="aspect-[21/9] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-[12px] border-white shadow-2xl relative group">
                      <img src={slide.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
                      <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center p-12 text-center">
                        <p className="text-white text-3xl md:text-5xl font-light italic tracking-tight">"{slide.quote}"</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1 tracking-widest">Link Ảnh Hero (Kích Thước 1920x1080)</label>
                        <input value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full bg-white border-2 border-stone-100 p-6 rounded-3xl text-xs font-mono focus:border-orange-800 outline-none shadow-sm" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1 tracking-widest">Slogan Hiện Trên Ảnh</label>
                        <input value={slide.quote} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full bg-white border-2 border-stone-100 p-6 rounded-3xl text-xl italic focus:border-orange-800 outline-none shadow-sm" />
                      </div>
                    </div>
                  </div>
                ))}
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

  const [menu, setMenu] = useState<Dish[]>(DEFAULT_MENU);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO);
  const [isLoading, setIsLoading] = useState(true);
  const [hash, setHash] = useState(window.location.hash);

  const supabase = useMemo(() => {
    if (supabaseConfig.url && supabaseConfig.key) return createClient(supabaseConfig.url, supabaseConfig.key);
    return null;
  }, [supabaseConfig]);

  const fetchData = useCallback(async () => {
    if (!supabase) { setIsLoading(false); return; }
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: true });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes?.length) setMenu(dishes);
      if (slides?.length) setHeroSlides(slides);
    } catch (err) {
      console.error("Lỗi đồng bộ:", err);
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
    if (!supabase) return alert("Bạn chưa cài đặt Supabase!");
    setIsLoading(true);
    try {
      // Làm sạch mâm cơm cũ
      await supabase.from('dishes').delete().neq('name', '_system_');
      await supabase.from('hero_slides').delete().neq('quote', '_system_');
      
      // Bày mâm cơm mới
      if (menu.length) await supabase.from('dishes').insert(menu.map(({id, ...rest}) => rest));
      if (heroSlides.length) await supabase.from('hero_slides').insert(heroSlides.map(({id, ...rest}) => rest));
      
      alert("Đã đồng bộ toàn bộ mâm cơm lên Cloud!");
      fetchData();
    } catch (e) {
      alert("Lỗi lưu trữ! Bạn đã chạy lệnh SQL tạo bảng chưa?");
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

const DEFAULT_MENU: Dish[] = [
  { id: '1', name: 'Sườn Non Rim', description: 'Từng miếng sườn được rim kỹ, thấm đẫm sốt mặn ngọt, hương vị cơm mẹ nấu.', price: '55.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', category: Category.MainCourse },
];

const DEFAULT_HERO: HeroSlide[] = [
  { id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=1920', quote: 'Mỗi bữa cơm là một câu chuyện yêu thương được viết bằng gia vị.' },
];

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
