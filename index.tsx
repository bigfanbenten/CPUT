
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- TYPES ---
enum Category {
  All = 'Thực Đơn Chính',
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
  <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-stone-100 px-6 md:px-20 h-24 flex items-center justify-between">
    <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.hash = ''}>
      <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xl rounded-sm">Ú</div>
      <div className="flex flex-col">
        <span className="text-lg font-black tracking-[0.3em] uppercase leading-none">ÚT TRINH</span>
        <span className="text-[9px] font-bold text-amber-700 tracking-[0.2em] uppercase mt-1">Hương vị gia đình</span>
      </div>
    </div>
    <div className="flex gap-10 items-center">
      {isAdmin ? (
        <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-md">Thoát Admin</button>
      ) : (
        <div className="flex gap-10 items-center">
          <a href="#menu" className="text-stone-900 text-[10px] font-black uppercase tracking-widest hover:text-amber-700 transition-colors">Menu</a>
          <div className="w-px h-6 bg-stone-200 hidden md:block"></div>
          <span className="text-stone-900 text-[11px] font-black tracking-widest hidden md:block">090.XXX.XXXX</span>
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-stone-300 font-black tracking-[0.4em] uppercase text-xs">Út Trinh Kitchen...</div></div>;

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-amber-100 selection:text-amber-900">
      <Nav />
      
      {/* Hero Section - High Impact & Modern */}
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroSlides[0]?.image_url || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920'} 
            className="w-full h-full object-cover animate-[slow-zoom_40s_infinite]" 
          />
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.8em] mb-8 block animate-in slide-in-from-bottom-4 duration-700">Premium Home Dining Experience</span>
          <h1 className="text-white text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-10 animate-in slide-in-from-bottom-8 duration-1000">
            ÚT TRINH<br/><span className="text-amber-500 italic font-medium">CUISINE</span>
          </h1>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-10 rounded-full"></div>
          <p className="text-white/90 text-xl md:text-3xl font-light italic max-w-3xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
            "{heroSlides[0]?.quote || 'Nơi những món ăn bình dị trở thành tinh hoa của gia đình.'}"
          </p>
        </div>
      </header>

      {/* Menu Section */}
      <main id="menu" className="max-w-7xl mx-auto py-32 px-6">
        <div className="text-center mb-24">
          <span className="text-amber-800 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Thưởng thức trọn vẹn</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 uppercase text-stone-900">Thực Đơn Đặc Sắc</h2>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-b border-stone-100 pb-8 w-full max-w-4xl mx-auto">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeFilter === cat ? 'text-amber-800 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-800' : 'text-stone-300 hover:text-stone-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Luxury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {filteredMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="group cursor-pointer card-shadow bg-white rounded-3xl overflow-hidden p-4 border border-stone-50">
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-8 bg-stone-50">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-500"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md py-3 text-center rounded-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Chi tiết món ăn</span>
                  </div>
                </div>
              </div>
              <div className="px-2 space-y-4 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight group-hover:text-amber-800 transition-colors">{dish.name}</h3>
                  <span className="text-amber-800 font-black text-xl tracking-tighter shrink-0">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic font-medium leading-relaxed line-clamp-2">
                   {dish.description || 'Hương vị truyền thống đậm đà bản sắc Việt.'}
                </p>
                <div className="pt-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white bg-stone-900 px-4 py-1.5 rounded-full shadow-sm">
                    {dish.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal - Clean & Professional */}
      {selectedDish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/95 backdrop-blur-md p-6" onClick={() => setSelectedDish(null)}>
          <div className="max-w-6xl w-full bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square md:aspect-auto h-[40vh] md:h-auto overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative bg-white">
              <button onClick={() => setSelectedDish(null)} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-all">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="space-y-10">
                <div>
                  <span className="text-amber-800 text-xs font-black uppercase tracking-[0.5em] mb-4 block">{selectedDish.category}</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none uppercase text-stone-900">{selectedDish.name}</h2>
                  <div className="text-3xl font-black text-amber-800 tracking-tighter">{selectedDish.price}</div>
                </div>
                <div className="w-16 h-1 bg-stone-100 rounded-full"></div>
                <p className="text-stone-500 text-xl leading-relaxed italic">
                  "{selectedDish.description || 'Món ăn được chuẩn bị tỉ mỉ từ nguyên liệu tươi sạch nhất trong ngày, mang đến sự ấm áp và ngon miệng như cơm nhà mẹ nấu.'}"
                </p>
                <div className="pt-6 grid grid-cols-2 gap-8">
                   <div className="border-l-2 border-amber-800 pl-4">
                      <span className="block text-[10px] font-black text-stone-900 uppercase mb-1">Chế biến</span>
                      <span className="text-stone-400 text-sm">Gia truyền</span>
                   </div>
                   <div className="border-l-2 border-stone-200 pl-4">
                      <span className="block text-[10px] font-black text-stone-900 uppercase mb-1">Thời gian</span>
                      <span className="text-stone-400 text-sm">Nấu mới mỗi ngày</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-32 px-12 bg-stone-900 text-white mt-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <span className="font-black tracking-[0.4em] uppercase text-2xl block mb-2">ÚT TRINH</span>
            <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em]">Hương Vị Cơm Nhà Thượng Hạng</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-stone-500">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Zalo</a>
          </div>
          <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">© 2024 Ut Trinh Kitchen</p>
        </div>
      </footer>

      <style>{`
        @keyframes slow-zoom { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);

  const addDish = () => {
    setMenu([...menu, { id: Date.now().toString(), name: 'Tên món mới', price: '00.000 VNĐ', description: '', image_url: '', category: Category.MainCourse }]);
  };

  const addHero = () => {
    setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: 'Câu nói truyền cảm hứng...' }]);
  };

  const pasteFromClipboard = async (id: string, type: 'dish' | 'hero') => {
    try {
      const text = await navigator.clipboard.readText();
      if (type === 'hero') {
        setHeroSlides(heroSlides.map((s: any) => s.id === id ? { ...s, image_url: text.trim() } : s));
      } else {
        setMenu(menu.map((m: any) => m.id === id ? { ...m, image_url: text.trim() } : m));
      }
    } catch (err) {
      alert("Hãy dùng phím tắt Ctrl+V trực tiếp vào ô nhập liệu.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl border border-stone-100 overflow-hidden rounded-[40px]">
          <div className="flex bg-stone-50 border-b border-stone-200 p-4 gap-4">
            {['menu', 'hero', 'config'].map((tab: any) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-lg text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              >
                {tab === 'menu' ? '🍱 Thực Đơn' : tab === 'hero' ? '🖼️ Ảnh Bìa' : '⚙️ Cấu Hình'}
              </button>
            ))}
          </div>

          <div className="p-10 md:p-16">
            {activeTab === 'config' && (
              <div className="max-w-md mx-auto py-12 space-y-8">
                <h2 className="text-3xl font-black tracking-tighter mb-8">KẾT NỐI DATABASE</h2>
                <div className="space-y-4">
                  <input placeholder="Supabase URL" value={localConfig.url || ''} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full border-2 border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                  <input placeholder="Anon Key" value={localConfig.key || ''} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full border-2 border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                  <button onClick={() => { setSupabaseConfig(localConfig); alert("Đã lưu cấu hình!"); setActiveTab('menu'); }} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-800 transition-all">Kết nối ngay</button>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Danh sách món ăn</h2>
                  <div className="flex gap-4">
                    <button onClick={onSave} className="bg-stone-900 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">Đồng Bộ Cloud</button>
                    <button onClick={addDish} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">+ Thêm món mới</button>
                  </div>
                </div>
                <div className="space-y-8">
                  {menu.map((dish: Dish) => (
                    <div key={dish.id} className="p-10 border-2 border-stone-50 bg-stone-50/50 rounded-[32px] flex flex-col md:grid md:grid-cols-4 gap-8 relative group hover:bg-white hover:border-amber-100 transition-all">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Tên món</label>
                        <input value={dish.name || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Giá hiển thị</label>
                        <input value={dish.price || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-black text-amber-800" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Phân loại</label>
                        <select value={dish.category} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-black text-[10px] uppercase">
                          {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1 flex justify-between">
                          <span>Link ảnh Unsplash</span>
                          <button onClick={() => pasteFromClipboard(dish.id, 'dish')} className="text-amber-800 underline">Dán</button>
                        </label>
                        <input value={dish.image_url || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-mono text-[9px]" />
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Mô tả ngắn</label>
                        <textarea value={dish.description || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 italic text-sm min-h-[80px]" />
                      </div>
                      <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-stone-100 rounded-full flex items-center justify-center text-red-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Ảnh bìa chào mừng</h2>
                  <button onClick={addHero} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">+ Thêm Slide Mới</button>
                </div>
                {heroSlides.map((slide: HeroSlide) => (
                  <div key={slide.id} className="p-10 border-2 border-stone-50 bg-stone-50/50 rounded-[40px] flex flex-col gap-10 relative hover:bg-white hover:border-amber-100 transition-all">
                    <div className="aspect-[21/9] w-full bg-stone-200 rounded-[28px] overflow-hidden border-4 border-white shadow-inner">
                       {slide.image_url && <img src={slide.image_url} className="w-full h-full object-cover" />}
                    </div>
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-stone-400 ml-1 flex justify-between items-center">
                           <span>Link ảnh nền (Ngang)</span>
                           <button onClick={() => pasteFromClipboard(slide.id, 'hero')} className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-[9px] font-black hover:bg-amber-200 transition-colors uppercase">Dán Từ Bộ Nhớ</button>
                         </label>
                         <input value={slide.image_url || ''} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full bg-white border border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                       </div>
                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Câu slogan xuất hiện trên ảnh</label>
                         <input value={slide.quote || ''} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full bg-white border border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 italic text-xl font-medium" />
                       </div>
                    </div>
                    <button onClick={() => setHeroSlides(heroSlides.filter((s: any) => s.id !== slide.id))} className="text-[10px] font-black uppercase text-red-300 hover:text-red-500 underline self-center">Xóa slide này</button>
                  </div>
                ))}
                <button onClick={onSave} className="w-full bg-stone-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-stone-800 transition-all mt-10">Lưu Tất Cả Thay Đổi</button>
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
      setMenu([{ id: '1', name: 'Sườn Non Rim Mắm Nhĩ', price: '125.000 VNĐ', description: 'Sườn non tươi ngon, rim chậm cùng mắm nhĩ thượng hạng đậm đà.', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000', category: Category.MainCourse }]);
      setHeroSlides([{ id: 'h1', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920', quote: 'Nơi hương vị gia đình trở thành nghệ thuật ẩm thực.' }]);
      setIsLoading(false);
      return;
    }
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: true });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
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
    if (!supabase) return alert("Vui lòng cấu hình Database trước!");
    setIsLoading(true);
    try {
      await supabase.from('dishes').delete().neq('name', '_temp_');
      await supabase.from('hero_slides').delete().neq('quote', '_temp_');
      if (menu.length) await supabase.from('dishes').insert(menu.map(({ id, ...rest }) => rest));
      if (heroSlides.length) await supabase.from('hero_slides').insert(heroSlides.map(({ id, ...rest }) => rest));
      alert("Đã đồng bộ thực đơn lên Cloud thành công!");
      fetchData();
    } catch (e) {
      alert("Lỗi kết nối database! Vui lòng kiểm tra lại URL và Key.");
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
