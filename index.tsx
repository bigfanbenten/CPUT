
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- TYPES & INTERFACES ---
enum Category {
  MainCourse = 'Món Chính',
  Soup = 'Món Canh',
  Vegetable = 'Món Rau',
  Drink = 'Đồ Uống'
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

// --- DATA MAC DINH ---
const DEFAULT_MENU: Dish[] = [
  { id: '1', name: 'Sườn Non Rim', description: 'Đậm đà vị quê.', price: '55.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', category: Category.MainCourse },
];

const DEFAULT_HERO: HeroSlide[] = [
  { id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=1920', quote: 'Hương vị cơm nhà' },
];

// --- GIAO DIEN CHINH ---

const Nav = ({ isAdmin = false }) => (
  <nav className="fixed top-0 w-full z-40 bg-white border-b px-6 h-20 flex items-center justify-between shadow-sm">
    <div className="cursor-pointer" onClick={() => window.location.hash = ''}>
      <span className="text-xl font-black text-orange-900 uppercase">ÚT TRINH KITCHEN</span>
    </div>
    {isAdmin && (
      <button onClick={() => window.location.hash = ''} className="text-stone-400 text-[10px] font-bold uppercase hover:text-orange-800">
        Thoát Admin
      </button>
    )}
  </nav>
);

const HomePage = ({ menu, heroSlides, isLoading }: any) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-20">
      <Nav />
      <header className="relative h-[60vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        {heroSlides[0] && <img src={heroSlides[0].image_url} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
        <h1 className="relative text-white text-5xl md:text-8xl font-black uppercase text-center px-4">Ẩm thực quê nhà</h1>
      </header>

      <main className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {menu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all">
              <img src={dish.image_url} className="w-full aspect-video object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-xl">{dish.name}</h3>
                  <span className="text-orange-800 font-bold">{dish.price}</span>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 italic">{dish.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedDish(null)}>
          <div className="bg-white max-w-4xl w-full rounded-lg overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <img src={selectedDish.image_url} className="md:w-1/2 aspect-square object-cover" />
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-black mb-4">{selectedDish.name}</h2>
              <p className="text-2xl text-orange-800 font-bold mb-6">{selectedDish.price}</p>
              <p className="text-stone-600 italic">"{selectedDish.description}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  // MAC DINH MO TAB CAI DAT NEU CHUA CO URL
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex bg-white p-2 rounded-lg shadow-sm mb-10 gap-2 border">
          <button onClick={() => setActiveTab('menu')} className={`flex-1 py-3 text-xs font-black uppercase rounded-md transition-all ${activeTab === 'menu' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:bg-stone-50'}`}>Món Ăn</button>
          <button onClick={() => setActiveTab('hero')} className={`flex-1 py-3 text-xs font-black uppercase rounded-md transition-all ${activeTab === 'hero' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:bg-stone-50'}`}>Ảnh Bìa</button>
          <button onClick={() => setActiveTab('config')} className={`flex-1 py-3 text-xs font-black uppercase rounded-md transition-all ${activeTab === 'config' ? 'bg-orange-800 text-white pulse-animation' : 'bg-orange-50 text-orange-800'}`}>⚙️ Cài Đặt Cloud</button>
        </div>

        {activeTab === 'config' && (
          <div className="bg-white p-10 rounded-xl border-2 border-orange-100 shadow-xl">
            <h2 className="text-2xl font-black mb-8">KẾT NỐI HỆ THỐNG CLOUD</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Supabase URL</label>
                <input value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full border p-4 bg-stone-50 rounded font-mono text-sm" placeholder="https://xyz.supabase.co" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Supabase Key (Anon)</label>
                <input value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full border p-4 bg-stone-50 rounded font-mono text-sm" placeholder="Paste your Key here" />
              </div>
              <button onClick={() => { setSupabaseConfig(localConfig); alert("Đã lưu cấu hình!"); }} className="w-full bg-orange-800 text-white py-5 font-black uppercase rounded-lg shadow-lg hover:bg-stone-900 transition-all">
                Lưu & Kích Hoạt Kết Nối
              </button>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Danh sách món ăn</h2>
              <div className="flex gap-4">
                <button onClick={onSave} className="bg-stone-900 text-white px-6 py-2 text-xs font-bold rounded">Đồng bộ Cloud</button>
                <button onClick={() => setMenu([...menu, { id: Date.now().toString(), name: 'Món mới', price: '0', description: '', image_url: '', category: Category.MainCourse }])} className="bg-orange-800 text-white px-6 py-2 text-xs font-bold rounded">Thêm món</button>
              </div>
            </div>
            {menu.map((dish: Dish) => (
              <div key={dish.id} className="bg-white p-4 border rounded-lg flex gap-4">
                <div className="w-24 h-24 bg-stone-100 rounded overflow-hidden shrink-0"><img src={dish.image_url} className="w-full h-full object-cover" /></div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <input placeholder="Tên" value={dish.name} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="border p-2 text-sm rounded" />
                  <input placeholder="Giá" value={dish.price} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="border p-2 text-sm rounded" />
                  <input placeholder="Link ảnh" value={dish.image_url} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="border p-2 text-sm rounded col-span-2" />
                </div>
                <button onClick={() => setMenu(menu.filter((d: Dish) => d.id !== dish.id))} className="text-red-300 hover:text-red-600">Xóa</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ảnh bìa trang chủ</h2>
              <button onClick={onSave} className="bg-stone-900 text-white px-6 py-2 text-xs font-bold rounded">Đồng bộ Cloud</button>
            </div>
            {heroSlides.map((slide: HeroSlide) => (
              <div key={slide.id} className="bg-white p-6 border rounded-lg space-y-4">
                <input value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full border p-2 text-sm" placeholder="Link ảnh bìa" />
                <input value={slide.quote} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full border p-2 text-sm" placeholder="Slogan" />
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`.pulse-animation { animation: pulse 2s infinite; } @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }`}</style>
    </div>
  );
};

const App = () => {
  const [supabaseConfig, setSupabaseConfig] = useState(() => {
    const saved = localStorage.getItem('ut-trinh-config');
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
      const { data: dishes } = await supabase.from('dishes').select('*');
      const { data: slides } = await supabase.from('hero_slides').select('*');
      if (dishes?.length) setMenu(dishes);
      if (slides?.length) setHeroSlides(slides);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    localStorage.setItem('ut-trinh-config', JSON.stringify(supabaseConfig));
    fetchData();
  }, [supabaseConfig, fetchData]);

  useEffect(() => {
    const h = () => setHash(window.location.hash);
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const handleSave = async () => {
    if (!supabase) return alert("Chưa có cấu hình Cloud!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('id', '0');
      await supabase.from('hero_slides').delete().neq('id', '0');
      if (menu.length) await supabase.from('dishes').insert(menu.map(({id, ...r}) => r));
      if (heroSlides.length) await supabase.from('hero_slides').insert(heroSlides.map(({id, ...r}) => r));
      alert("Xong!");
      fetchData();
    } catch (e) { alert("Lỗi!"); } finally { setIsLoading(false); }
  };

  if (hash.toLowerCase().includes('acpanel')) {
    return <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} onSave={handleSave} />;
  }
  return <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
