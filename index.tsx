
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
  tags?: string[];
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

// --- INITIAL DATA (Fallbacks) ---
const DEFAULT_MENU: Dish[] = [
  { id: '1', name: 'Sườn Non Rim Mặn Ngọt', description: 'Sườn non tuyển chọn, rim nước mắm kẹo, óng ánh sắc nâu cánh gián, đậm đà vị quê.', price: '55.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', category: Category.MainCourse, tags: ['Bán Chạy'] },
];

const DEFAULT_HERO: HeroSlide[] = [
  { id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920', quote: 'Nơi tìm lại hương vị mâm cơm mẹ nấu' },
];

// --- COMPONENTS ---

const Nav = ({ isAdminPage = false }: { isAdminPage?: boolean }) => (
  <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 px-6 md:px-12 h-20 flex items-center justify-between shadow-sm">
    <div className="flex flex-col cursor-pointer" onClick={() => window.location.hash = ''}>
      <span className="text-xl md:text-2xl font-black text-orange-900 tracking-tighter uppercase leading-none">ÚT TRINH KITCHEN</span>
      <span className="text-[9px] tracking-[0.3em] text-stone-400 uppercase mt-1 font-bold">
        {isAdminPage ? 'He thong Quan tri' : 'Com phan va Dac san'}
      </span>
    </div>
    <div className="flex items-center gap-4">
      {isAdminPage ? (
        <button onClick={() => window.location.hash = ''} className="text-stone-500 text-[10px] font-bold uppercase tracking-widest hover:text-orange-800 transition-colors">
          Quay lai Trang chu
        </button>
      ) : (
        <a href="tel:0900000000" className="bg-stone-900 text-white px-5 py-2 text-[10px] uppercase font-black tracking-widest hover:bg-orange-900 transition-all rounded-sm shadow-md">
          HOTLINE: 090.XXX.XXXX
        </a>
      )}
    </div>
  </nav>
);

const MenuCard: React.FC<{ dish: Dish; onClick: (d: Dish) => void }> = ({ dish, onClick }) => (
  <div onClick={() => onClick(dish)} className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 rounded-sm">
    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      {dish.tags?.[0] && (
        <span className="absolute top-4 right-4 bg-orange-800 text-white text-[9px] px-3 py-1 uppercase tracking-widest font-black shadow-lg">
          {dish.tags[0]}
        </span>
      )}
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-extrabold text-stone-800 group-hover:text-orange-800 transition-colors leading-tight tracking-tight">{dish.name}</h3>
        <span className="text-orange-900 font-bold text-sm bg-orange-50 px-2 py-1 rounded-sm">{dish.price}</span>
      </div>
      <p className="text-stone-500 text-sm italic line-clamp-2 opacity-80 leading-relaxed">"{dish.description}"</p>
    </div>
  </div>
);

// --- MAIN PAGES ---

const HomePage = ({ menu, heroSlides, isLoading }: { menu: Dish[]; heroSlides: HeroSlide[]; isLoading: boolean }) => {
  const [currentHero, setCurrentHero] = useState(0);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const nextSlide = useCallback(() => {
    if (heroSlides.length > 0) {
      setCurrentHero(prev => (prev + 1) % heroSlides.length);
    }
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, heroSlides.length]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-orange-900 animate-pulse font-black tracking-widest uppercase">Dang tai du lieu...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <Nav />
      <header className="relative h-[80vh] flex items-center justify-center bg-stone-900 mt-20 overflow-hidden group">
        {heroSlides.length > 0 ? heroSlides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHero ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.image_url} className="w-full h-full object-cover scale-110 opacity-60 blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40"></div>
          </div>
        )) : <div className="text-white opacity-20 italic">Chua co anh bia</div>}

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-9xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">Am thuc que nha</h1>
          <div className="overflow-hidden h-12 md:h-16">
            <p key={currentHero} className="text-stone-100 text-xl md:text-3xl font-light italic tracking-wide animate-in fade-in slide-in-from-top-4 duration-700">
              "{heroSlides[currentHero]?.quote || 'Kinh moi quy khach'}"
            </p>
          </div>
        </div>
      </header>

      <main className="py-32 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1">
        <div className="text-center mb-20">
          <span className="text-orange-900 text-[10px] tracking-[0.5em] font-black uppercase mb-4 block">Thuc Don Ut Trinh</span>
          <h2 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight">Mon Ngon Moi Ngay</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {menu.map(dish => <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />)}
        </div>
      </main>

      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedDish(null)}>
          <div className="bg-white max-w-5xl w-full flex flex-col md:flex-row rounded-sm overflow-hidden shadow-2xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
             <div className="md:w-1/2 h-72 md:h-auto overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center relative overflow-y-auto bg-[#fdfcfb]">
              <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-3 tracking-tighter leading-none">{selectedDish.name}</h2>
              <p className="text-3xl text-orange-900 font-bold mb-10 tracking-tight">{selectedDish.price}</p>
              <p className="text-stone-600 text-lg md:text-xl italic mb-12 leading-relaxed">"{selectedDish.description}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  // Nếu chưa có config, tự động nhảy sang tab Cài đặt
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  const addDish = () => {
    const newDish: Dish = { id: Date.now().toString(), name: 'Mon moi', description: '', price: '0 VND', image_url: '', category: Category.MainCourse };
    setMenu([...menu, newDish]);
  };

  const addHero = () => {
    const newHero: HeroSlide = { id: Date.now().toString(), image_url: '', quote: 'Cau noi moi...' };
    setHeroSlides([...heroSlides, newHero]);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <Nav isAdminPage />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-sm shadow-sm border border-stone-200">
          <div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase">QUAN LY CUA HANG</h1>
            <p className="text-stone-400 text-sm font-medium tracking-wide">He thong dong bo Cloud</p>
          </div>
          <div className="flex bg-stone-100 p-2 rounded-lg gap-2">
            <button onClick={() => setActiveTab('menu')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${activeTab === 'menu' ? 'bg-white text-orange-900 shadow-sm border border-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
              DANH SACH MON
            </button>
            <button onClick={() => setActiveTab('hero')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${activeTab === 'hero' ? 'bg-white text-orange-900 shadow-sm border border-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
              ANH BIA
            </button>
            <button onClick={() => setActiveTab('config')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${activeTab === 'config' ? 'bg-orange-800 text-white shadow-lg' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}>
              CAI DAT CLOUD
            </button>
          </div>
        </header>

        {activeTab === 'config' && (
          <div className="bg-white p-10 shadow-2xl border border-orange-200 rounded-xl animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-stone-900 uppercase mb-8 border-b pb-4">KET NOI SUPABASE</h2>
            <div className="grid grid-cols-1 gap-8 max-w-3xl">
              <div>
                <label className="text-[10px] uppercase font-black text-stone-500 mb-2 block tracking-widest">Supabase URL</label>
                <input value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full border-2 border-stone-100 p-4 text-sm font-mono outline-none focus:border-orange-800 bg-stone-50 rounded-lg" placeholder="https://abc.supabase.co" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-stone-500 mb-2 block tracking-widest">Supabase Key</label>
                <input value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full border-2 border-stone-100 p-4 text-sm font-mono outline-none focus:border-orange-800 bg-stone-50 rounded-lg" placeholder="Paste Key here..." />
              </div>
              <button onClick={() => { setSupabaseConfig(localConfig); alert("Luu thanh cong!"); }} className="bg-orange-800 text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-stone-900 transition-all rounded-lg shadow-xl">
                KICH HOAT KET NOI
              </button>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-xs text-blue-800 leading-relaxed font-bold">
                  LUU Y: Vao Supabase chon Project den Settings den API de lay thong tin.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800 uppercase">Thuc don hien tai</h2>
              <div className="flex gap-4">
                <button onClick={onSave} className="bg-stone-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-900 transition-all shadow-lg rounded-md">Dong bo Cloud</button>
                <button onClick={addDish} className="bg-orange-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all rounded-md">Them mon</button>
              </div>
            </div>
            {menu.map((dish: Dish) => (
               <div key={dish.id} className="bg-white p-6 shadow-sm border border-stone-200 flex flex-col md:flex-row gap-6 items-start rounded-md">
                 <div className="w-32 h-24 bg-stone-100 shrink-0 overflow-hidden rounded-md border border-stone-100">
                    {dish.image_url ? <img src={dish.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-300 font-bold">NO IMAGE</div>}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                    <input placeholder="Ten mon" value={dish.name} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="border p-2 text-sm focus:ring-1 ring-orange-800 outline-none rounded" />
                    <input placeholder="Gia" value={dish.price} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="border p-2 text-sm focus:ring-1 ring-orange-800 outline-none rounded" />
                    <select value={dish.category} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="border p-2 text-sm focus:ring-1 ring-orange-800 outline-none rounded">
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea placeholder="Mo ta" value={dish.description} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="md:col-span-3 border p-2 text-sm h-16 focus:ring-1 ring-orange-800 outline-none rounded" />
                    <input placeholder="Link anh" value={dish.image_url} onChange={e => setMenu(menu.map((d: Dish) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="md:col-span-3 border p-2 text-xs font-mono focus:ring-1 ring-orange-800 outline-none rounded" />
                 </div>
                 <button onClick={() => setMenu(menu.filter((d: Dish) => d.id !== dish.id))} className="text-red-300 hover:text-red-600 p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
            ))}
          </div>
        )}

        {activeTab === 'hero' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800 uppercase">Cau hinh Anh bia</h2>
              <div className="flex gap-4">
                <button onClick={onSave} className="bg-stone-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-900 transition-all shadow-lg rounded-md">Dong bo Cloud</button>
                <button onClick={addHero} className="bg-orange-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all rounded-md">Them anh</button>
              </div>
            </div>
            {heroSlides.map((slide: HeroSlide) => (
               <div key={slide.id} className="bg-white p-8 border border-stone-200 rounded-md flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-48 h-28 bg-stone-100 shrink-0 rounded-md overflow-hidden"><img src={slide.image_url} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 w-full space-y-4">
                    <input value={slide.quote} onChange={e => setHeroSlides(heroSlides.map((s: HeroSlide) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full border-b p-3 text-lg italic outline-none focus:border-orange-800" placeholder="Cau slogan..." />
                    <input value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map((s: HeroSlide) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full border p-2 text-xs font-mono bg-stone-50 rounded" placeholder="Link anh" />
                  </div>
                  <button onClick={() => setHeroSlides(heroSlides.filter((s: HeroSlide) => s.id !== slide.id))} className="text-red-300 p-2 hover:text-red-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
            ))}
           </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem('ut-trinh-supabase-config');
    return saved ? JSON.parse(saved) : { url: '', key: '' };
  });

  const [menu, setMenu] = useState<Dish[]>(DEFAULT_MENU);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO);
  const [isLoading, setIsLoading] = useState(true);
  const [hash, setHash] = useState(window.location.hash);

  const supabase = useMemo(() => {
    if (supabaseConfig.url && supabaseConfig.key) {
      try { return createClient(supabaseConfig.url, supabaseConfig.key); } catch (e) { return null; }
    }
    return null;
  }, [supabaseConfig]);

  const fetchData = useCallback(async () => {
    if (!supabase) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: true });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes && dishes.length > 0) setMenu(dishes);
      if (slides && slides.length > 0) setHeroSlides(slides);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const handleSave = async () => {
    if (!supabase) return alert("Hay vao tab CAI DAT de ket noi Cloud!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (menu.length > 0) await supabase.from('dishes').insert(menu.map(({ id, ...rest }) => rest));
      if (heroSlides.length > 0) await supabase.from('hero_slides').insert(heroSlides.map(({ id, ...rest }) => rest));
      alert("Dong bo Cloud thanh cong!");
      fetchData();
    } catch (e) {
      alert("Loi dong bo! Kiem tra tab Cai dat.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("UT TRINH CLOUD V3 - READY");
    localStorage.setItem('ut-trinh-supabase-config', JSON.stringify(supabaseConfig));
    fetchData();
  }, [supabaseConfig, fetchData]);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (hash.toLowerCase().includes('acpanel')) {
    return <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} onSave={handleSave} />;
  }

  return <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} />;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
