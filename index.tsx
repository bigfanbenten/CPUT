
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

// --- INITIAL DATA ---
const DEFAULT_MENU: Dish[] = [
  { id: '1', name: 'Sườn Non Rim', description: 'Hương vị đậm đà.', price: '55.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', category: Category.MainCourse },
];

const DEFAULT_HERO: HeroSlide[] = [
  { id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?w=1920', quote: 'Cơm ngon như mẹ nấu' },
];

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => (
  <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b px-6 h-20 flex items-center justify-between shadow-sm">
    <div className="cursor-pointer" onClick={() => window.location.hash = ''}>
      <span className="text-xl font-black text-orange-900 uppercase tracking-tighter">ÚT TRINH KITCHEN</span>
    </div>
    <div className="flex gap-4 items-center">
      {isAdmin ? (
        <button onClick={() => window.location.hash = ''} className="text-stone-400 text-xs font-bold uppercase hover:text-orange-800">Quay lại trang chủ</button>
      ) : (
        <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Hương vị quê nhà</span>
      )}
    </div>
  </nav>
);

const HomePage = ({ menu, heroSlides, isLoading }: any) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-orange-900 font-bold">Đang tải dữ liệu...</div></div>;

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-20">
      <Nav />
      <header className="relative h-[60vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        {heroSlides[0] && <img src={heroSlides[0].image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" />}
        <div className="relative z-10 text-center">
          <h1 className="text-white text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 drop-shadow-2xl">ÚT TRINH</h1>
          <p className="text-white/90 text-xl italic font-light">{heroSlides[0]?.quote}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900">Thực Đơn Hôm Nay</h2>
          <div className="w-20 h-1 bg-orange-800 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {menu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="group bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-2xl text-stone-800 leading-tight">{dish.name}</h3>
                  <span className="text-orange-900 font-black text-lg">{dish.price}</span>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 italic leading-relaxed">"{dish.description}"</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedDish(null)}>
          <div className="bg-white max-w-5xl w-full rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="p-12 flex flex-col justify-center bg-stone-50 md:w-1/2">
              <h2 className="text-5xl font-black text-stone-900 mb-4 tracking-tighter">{selectedDish.name}</h2>
              <p className="text-3xl text-orange-900 font-bold mb-8">{selectedDish.price}</p>
              <p className="text-stone-600 text-lg italic leading-loose">"{selectedDish.description}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  const handleConfigSave = () => {
    if (!localConfig.url.startsWith('https://')) return alert("URL phải bắt đầu bằng https://");
    setSupabaseConfig(localConfig);
    alert("Đã lưu cấu hình Cloud!");
    setActiveTab('menu');
  };

  return (
    <div className="min-h-screen bg-stone-100 pt-20">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-stone-200">
           <div className="flex p-2 gap-2 bg-stone-50 border-b">
            <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'menu' ? 'bg-white shadow-md text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>📋 Danh Sách Món</button>
            <button onClick={() => setActiveTab('hero')} className={`flex-1 py-4 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'hero' ? 'bg-white shadow-md text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>🖼️ Ảnh Bìa</button>
            <button onClick={() => setActiveTab('config')} className={`flex-1 py-4 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'config' ? 'bg-orange-800 text-white shadow-lg animate-pulse' : 'bg-orange-100 text-orange-800'}`}>⚙️ Cài Đặt Cloud</button>
          </div>

          <div className="p-10">
            {activeTab === 'config' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black mb-2 text-stone-900">KẾT NỐI SUPABASE</h2>
                <p className="text-stone-400 mb-10 text-sm">Dữ liệu của bạn sẽ được lưu trữ an toàn trên đám mây.</p>
                
                <div className="space-y-8 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest ml-1">Project URL (Tìm trong Settings -> API)</label>
                    <input value={localConfig.url} onChange={e => setLocalConfig({...localConfig, url: e.target.value.trim()})} className="w-full border-2 border-stone-100 p-5 bg-stone-50 rounded-xl font-mono text-sm focus:border-orange-800 outline-none transition-all" placeholder="https://xxxxxxxxxxxx.supabase.co" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest ml-1">API Key (Anon Public Key)</label>
                    <input value={localConfig.key} onChange={e => setLocalConfig({...localConfig, key: e.target.value.trim()})} className="w-full border-2 border-stone-100 p-5 bg-stone-50 rounded-xl font-mono text-sm focus:border-orange-800 outline-none transition-all" placeholder="Dãy chữ dài loằng ngoằng..." />
                  </div>
                  <button onClick={handleConfigSave} className="w-full bg-orange-800 text-white py-6 font-black uppercase rounded-2xl shadow-xl hover:bg-stone-900 transition-all transform hover:-translate-y-1">
                    Kích Hoạt Hệ Thống
                  </button>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 font-medium">Lưu ý: Bạn cần chạy lệnh SQL trong SQL Editor của Supabase để khởi tạo bảng trước khi sử dụng.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <h2 className="text-2xl font-bold text-stone-800">Quản lý thực đơn</h2>
                  <div className="flex gap-4">
                    <button onClick={onSave} className="bg-stone-900 text-white px-8 py-3 text-xs font-black uppercase rounded-xl hover:bg-orange-900 transition-all shadow-lg">Lưu vào Cloud</button>
                    <button onClick={() => setMenu([...menu, { id: Date.now().toString(), name: 'Món mới', price: '0 VNĐ', description: '', image_url: '', category: Category.MainCourse }])} className="bg-orange-800 text-white px-8 py-3 text-xs font-black uppercase rounded-xl hover:bg-stone-900 transition-all">Thêm món</button>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {menu.map((dish: Dish) => (
                    <div key={dish.id} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-6 items-start group">
                      <div className="w-32 h-32 bg-white rounded-xl overflow-hidden shrink-0 border shadow-sm">
                        <img src={dish.image_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                        <input placeholder="Tên món" value={dish.name} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="border p-3 rounded-lg text-sm font-bold" />
                        <input placeholder="Giá tiền" value={dish.price} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="border p-3 rounded-lg text-sm text-orange-900 font-bold" />
                        <input placeholder="Link ảnh (Unsplash hoặc URL trực tiếp)" value={dish.image_url} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="border p-3 rounded-lg text-xs font-mono col-span-1 md:col-span-2" />
                        <textarea placeholder="Mô tả ngắn gọn" value={dish.description} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="border p-3 rounded-lg text-sm col-span-1 md:col-span-2 h-20" />
                      </div>
                      <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="text-red-200 hover:text-red-600 transition-colors self-center p-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-8">
                 <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <h2 className="text-2xl font-bold">Cài đặt Ảnh bìa</h2>
                  <button onClick={onSave} className="bg-stone-900 text-white px-8 py-3 text-xs font-black uppercase rounded-xl">Lưu vào Cloud</button>
                </div>
                {heroSlides.map((slide: HeroSlide) => (
                  <div key={slide.id} className="bg-stone-50 p-8 rounded-2xl border border-stone-200 space-y-6">
                    <div className="aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden border-4 border-white shadow-lg">
                      <img src={slide.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400">Link ảnh bìa</label>
                        <input value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full border p-4 rounded-xl text-xs font-mono" placeholder="URL ảnh..." />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400">Câu slogan (Sẽ hiện trên ảnh bìa)</label>
                        <input value={slide.quote} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full border p-4 rounded-xl text-lg italic" placeholder="Ví dụ: Hương vị cơm nhà..." />
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
    const saved = localStorage.getItem('ut-trinh-config-v2');
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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    localStorage.setItem('ut-trinh-config-v2', JSON.stringify(supabaseConfig));
    fetchData();
  }, [supabaseConfig, fetchData]);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSave = async () => {
    if (!supabase) return alert("Bạn chưa cấu hình URL và Key!");
    setIsLoading(true);
    try {
      // Làm sạch dữ liệu cũ
      await supabase.from('dishes').delete().neq('name', 'KHONG_XOA_CAI_NAY');
      await supabase.from('hero_slides').delete().neq('quote', 'KHONG_XOA_CAI_NAY');
      
      // Chèn dữ liệu mới (bỏ ID cũ để Supabase tự cấp ID mới)
      if (menu.length) await supabase.from('dishes').insert(menu.map(({id, ...rest}) => rest));
      if (heroSlides.length) await supabase.from('hero_slides').insert(heroSlides.map(({id, ...rest}) => rest));
      
      alert("Đồng bộ dữ liệu thành công!");
      fetchData();
    } catch (e) {
      alert("Lỗi khi lưu dữ liệu. Hãy kiểm tra lại SQL Editor đã chạy chưa.");
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
