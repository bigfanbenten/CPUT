
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
  <nav className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-2xl border-b border-stone-100 px-6 md:px-12 h-20 flex items-center justify-between">
    <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.hash = ''}>
      <div className="w-8 h-8 bg-stone-900 flex items-center justify-center text-white font-black text-sm">Ú</div>
      <span className="text-lg font-black text-stone-900 uppercase tracking-[0.3em]">ÚT TRINH KITCHEN</span>
    </div>
    <div className="flex gap-6 items-center">
      {isAdmin ? (
        <button onClick={() => window.location.hash = ''} className="bg-orange-800 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-stone-900 transition-all">Thoát Admin</button>
      ) : (
        <a href="#menu" className="text-stone-400 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors">Khám Phá Thực Đơn</a>
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-stone-300 font-black tracking-widest uppercase">Đang bày mâm...</div></div>;

  return (
    <div className="min-h-screen bg-[#fff] text-stone-900">
      <Nav />
      
      {/* Hero Section - Phong cách Tạp chí cao cấp */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-100">
        {heroSlides[0] && <img src={heroSlides[0].image_url} className="absolute inset-0 w-full h-full object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-7xl md:text-[140px] font-black tracking-tighter leading-none mb-6 animate-in slide-in-from-bottom-12 duration-1000">HƯƠNG VỊ<br/><span className="text-orange-800">CƠM NHÀ</span></h1>
          <p className="text-stone-600 text-lg md:text-xl font-medium italic tracking-wide animate-in fade-in duration-1000 delay-500">
            "{heroSlides[0]?.quote || 'Mỗi món ăn là một câu chuyện yêu thương.'}"
          </p>
        </div>
      </header>

      {/* Menu Filter - Thiết kế tối giản */}
      <main id="menu" className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col items-center mb-24">
          <span className="text-orange-800 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Menu Nhà Út</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-12">THỰC ĐƠN HÔM NAY</h2>
          
          <div className="flex flex-wrap justify-center gap-4 border-b border-stone-100 pb-4 w-full max-w-3xl">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`pb-2 px-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === cat ? 'text-orange-800 border-b-2 border-orange-800' : 'text-stone-300 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dish Grid - Sang trọng và thoáng đãng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="group cursor-pointer">
              <div className="aspect-[4/5] overflow-hidden bg-stone-50 rounded-2xl mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-stone-50 pb-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-orange-800 transition-colors">{dish.name}</h3>
                  <span className="text-stone-400 font-bold text-sm tracking-widest">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-xs italic line-clamp-1">{dish.description}</p>
                <span className="inline-block text-[8px] font-black uppercase tracking-widest text-stone-300 bg-stone-50 px-2 py-1 rounded">{dish.category}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Detail */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-xl p-6" onClick={() => setSelectedDish(null)}>
          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-12 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square md:aspect-auto h-[40vh] md:h-[80vh] bg-stone-100 rounded-3xl overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center relative">
              <button onClick={() => setSelectedDish(null)} className="absolute -top-12 md:-top-20 -right-4 text-stone-300 hover:text-stone-900 transition-all">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <span className="text-orange-800 text-xs font-black uppercase tracking-[0.5em] mb-4">{selectedDish.category}</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase">{selectedDish.name}</h2>
              <p className="text-4xl text-stone-300 font-light mb-12">{selectedDish.price}</p>
              <p className="text-stone-500 text-xl font-light italic leading-loose max-w-md">"{selectedDish.description || 'Hương vị tuyệt hảo từ bếp nhà Út Trinh.'}"</p>
            </div>
          </div>
        </div>
      )}

      <footer className="py-24 text-center border-t border-stone-100 bg-stone-50">
        <span className="text-stone-900 font-black tracking-[0.3em] uppercase">ÚT TRINH KITCHEN</span>
        <p className="text-stone-400 text-[10px] mt-4 uppercase tracking-widest">© 2024 - Hương Vị Cơm Nhà</p>
      </footer>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  const addDish = () => {
    setMenu([...menu, { 
      id: Date.now().toString(), 
      name: 'Tên món mới', 
      price: '0 VNĐ', 
      description: '', 
      image_url: '', 
      category: Category.MainCourse 
    }]);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-[40px] shadow-2xl border border-stone-200 overflow-hidden">
          <div className="flex bg-stone-50 p-3 gap-3 border-b">
            <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-2xl ${activeTab === 'menu' ? 'bg-white shadow-md text-stone-900' : 'text-stone-400'}`}>Danh Sách Món</button>
            <button onClick={() => setActiveTab('hero')} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-2xl ${activeTab === 'hero' ? 'bg-white shadow-md text-stone-900' : 'text-stone-400'}`}>Ảnh Bìa</button>
            <button onClick={() => setActiveTab('config')} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-2xl ${activeTab === 'config' ? 'bg-orange-800 text-white shadow-lg' : 'bg-stone-200/50 text-stone-500'}`}>Cài Đặt Cloud</button>
          </div>

          <div className="p-10">
            {activeTab === 'config' && (
              <div className="max-w-xl mx-auto py-10 space-y-8">
                <h2 className="text-3xl font-black tracking-tighter">KẾT NỐI SUPABASE</h2>
                <input placeholder="URL..." value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value.trim()})} className="w-full border-2 p-5 rounded-2xl outline-none focus:border-orange-800" />
                <input placeholder="Anon Key..." value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value.trim()})} className="w-full border-2 p-5 rounded-2xl outline-none focus:border-orange-800" />
                <button onClick={() => { setSupabaseConfig(localConfig); alert("Đã lưu cấu hình!"); setActiveTab('menu'); }} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase">Kích Hoạt</button>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">QUẢN LÝ THỰC ĐƠN</h2>
                  <div className="flex gap-4">
                    <button onClick={onSave} className="bg-stone-900 text-white px-8 py-4 text-[10px] font-black uppercase rounded-xl">Đồng Bộ Lên Cloud</button>
                    <button onClick={addDish} className="bg-orange-800 text-white px-8 py-4 text-[10px] font-black uppercase rounded-xl">+ Thêm Món</button>
                  </div>
                </div>
                <div className="grid gap-6">
                  {menu.map((dish: Dish) => (
                    <div key={dish.id} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative group">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-stone-400">Tên món</label>
                        <input value={dish.name} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="w-full p-3 rounded-lg border focus:border-orange-800 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-stone-400">Giá</label>
                        <input value={dish.price} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="w-full p-3 rounded-lg border focus:border-orange-800 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-stone-400">Phân loại</label>
                        <select value={dish.category} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="w-full p-3 rounded-lg border focus:border-orange-800 outline-none appearance-none cursor-pointer">
                          {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-stone-400">Link ảnh Unsplash</label>
                        <input value={dish.image_url} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="w-full p-3 rounded-lg border focus:border-orange-800 outline-none font-mono text-[10px]" />
                      </div>
                      <div className="md:col-span-4 space-y-1">
                         <label className="text-[9px] font-black uppercase text-stone-400">Mô tả hương vị</label>
                         <input value={dish.description} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="w-full p-3 rounded-lg border focus:border-orange-800 outline-none" />
                      </div>
                      <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="absolute top-4 right-4 text-stone-200 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-10 py-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase">Ảnh Bìa Chào Mừng</h2>
                {heroSlides.map((slide: HeroSlide) => (
                  <div key={slide.id} className="space-y-6 bg-stone-50 p-8 rounded-3xl">
                    <input placeholder="Link ảnh Hero..." value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full p-4 rounded-xl border" />
                    <input placeholder="Slogan..." value={slide.quote} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full p-4 rounded-xl border text-xl italic" />
                  </div>
                ))}
                <button onClick={onSave} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Lưu Thay Đổi</button>
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
      setMenu([{ id: '1', name: 'Món Mẫu', price: '0 VNĐ', description: 'Chưa có dữ liệu', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000', category: Category.MainCourse }]);
      setHeroSlides([{ id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=1920', quote: 'Chào mừng bạn đến với Út Trinh Kitchen' }]);
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
    if (!supabase) return alert("Chưa cấu hình Supabase!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('name', '_temp_');
      await supabase.from('hero_slides').delete().neq('quote', '_temp_');
      if (menu.length) await supabase.from('dishes').insert(menu.map(({id, ...rest}) => rest));
      if (heroSlides.length) await supabase.from('hero_slides').insert(heroSlides.map(({id, ...rest}) => rest));
      alert("Đã đồng bộ lên Cloud!");
      fetchData();
    } catch (e) {
      alert("Lỗi! Kiểm tra lại SQL Editor.");
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
