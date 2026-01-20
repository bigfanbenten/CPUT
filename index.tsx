
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CẤU HÌNH CỐ ĐỊNH (QUAN TRỌNG) ---
const HARDCODED_SUPABASE_URL = ''; 
const HARDCODED_SUPABASE_KEY = ''; 

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
  created_at?: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: Category;
}

interface HeroSlide {
  id: string;
  created_at?: string;
  image_url: string;
  quote: string;
}

const CONFIG_KEY = 'ut-trinh-config-v3';

const SQL_SETUP = `-- 1. Tạo bảng (Nếu chưa có)
create table if not exists dishes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  description text,
  price text,
  image_url text,
  category text
);

create table if not exists hero_slides (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image_url text,
  quote text
);

-- 2. CẬP NHẬT GIÁ TRỊ MẶC ĐỊNH
alter table dishes alter column id set default gen_random_uuid();
alter table dishes alter column created_at set default timezone('utc'::text, now());
alter table dishes alter column created_at set not null;

alter table hero_slides alter column id set default gen_random_uuid();
alter table hero_slides alter column created_at set default timezone('utc'::text, now());
alter table hero_slides alter column created_at set not null;

-- 3. TẮT BẢO MẬT RLS
alter table dishes disable row level security;
alter table hero_slides disable row level security;`;

// --- COMPONENTS ---

const Nav = ({ isAdmin = false }) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-stone-100 px-6 md:px-20 h-24 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white font-black text-xl rounded-sm group-hover:bg-amber-800 transition-colors">Ú</div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-stone-900 uppercase tracking-[0.3em] leading-none">ÚT TRINH</span>
            <span className="text-lg font-black text-amber-700 uppercase tracking-[0.3em] leading-none mt-1">CƠM PHẦN</span>
          </div>
        </div>
        <div className="flex gap-4 md:gap-10 items-center">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-md">Thoát Quản Trị</button>
          ) : (
            <div className="flex gap-4 md:gap-10 items-center">
              <a href="#menu" className="text-stone-900 text-[10px] font-black uppercase tracking-widest hover:text-amber-700 transition-colors">Thực Đơn</a>
              <button 
                onClick={() => setShowConciseMenu(true)} 
                className="text-amber-800 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors bg-amber-50 px-4 py-2 rounded-full border border-amber-100"
              >
                Xem Ảnh Menu Rút Gọn
              </button>
              <div className="w-px h-6 bg-stone-200 hidden md:block"></div>
              <span className="text-stone-900 text-[11px] font-black tracking-widest hidden lg:block uppercase">Hãy gọi đặt món ngay 0939.70.90.20</span>
            </div>
          )}
        </div>
      </nav>

      {/* Concise Menu Image Modal */}
      {showConciseMenu && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/90 backdrop-blur-2xl p-4 md:p-12 animate-in fade-in duration-300" 
          onClick={() => setShowConciseMenu(false)}
        >
          <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowConciseMenu(false)} 
              className="absolute -top-14 right-0 md:top-0 md:-right-16 text-white bg-white/10 p-4 rounded-full hover:bg-white/20 transition-all group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full overflow-auto rounded-[30px] shadow-2xl bg-white/5 flex items-start justify-center">
              <img 
                src="https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg" 
                className="max-w-full h-auto rounded-[30px] border-4 border-white/10" 
                alt="Thực đơn rút gọn Út Trinh Kitchen"
              />
            </div>
            <div className="mt-6">
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em]">Slogan: Hương Vị Gia Đình Thượng Hạng</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const HomePage = ({ menu, heroSlides, isLoading }: any) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>(Category.All);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // States for Stats
  const [onlineUsers, setOnlineUsers] = useState(Math.floor(Math.random() * 15) + 5);
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    // Simulate total visitors based on a starting point + session persistence
    const baseVisitors = 15842;
    const sessionVisits = parseInt(localStorage.getItem('ut_visits') || '0');
    if (sessionVisits === 0) {
      localStorage.setItem('ut_visits', '1');
      setTotalVisitors(baseVisitors + 1);
    } else {
      setTotalVisitors(baseVisitors + sessionVisits);
    }

    // Simulate online users fluctuating
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + delta;
        return newVal < 1 ? 1 : newVal > 50 ? 49 : newVal;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const filteredMenu = useMemo(() => {
    if (activeFilter === Category.All) return menu;
    return menu.filter((item: Dish) => item.category === activeFilter);
  }, [menu, activeFilter]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-amber-800 font-black tracking-[0.4em] uppercase text-xs">Út Trinh Kitchen...</div></div>;

  const activeSlide = heroSlides[currentSlide] || { image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920', quote: 'Hương vị cơm nhà ấm áp.' };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-amber-100 selection:text-amber-900">
      <Nav />
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.length > 0 ? heroSlides.map((slide: HeroSlide, index: number) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img src={slide.image_url} className="w-full h-full object-cover scale-105 animate-[slow-zoom_40s_infinite]" />
              <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[1px]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent"></div>
            </div>
          )) : (
            <div className="absolute inset-0">
               <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-stone-900/40"></div>
            </div>
          )}
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl">
          <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.8em] mb-8 block animate-in fade-in slide-in-from-bottom-4 duration-700">Premium Home Dining</span>
          <h1 className="text-white text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-10 animate-in slide-in-from-bottom-8 duration-1000">
            ÚT TRINH<br/><span className="text-amber-500 italic font-medium">KITCHEN</span>
          </h1>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-10 rounded-full"></div>
          <div className="h-20 flex items-center justify-center">
             <p key={activeSlide.id} className="text-white/95 text-xl md:text-3xl font-light italic max-w-3xl mx-auto leading-relaxed animate-in fade-in duration-1000">
              "{activeSlide.quote}"
            </p>
          </div>
          {heroSlides.length > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              {heroSlides.map((_: any, idx: number) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-12 bg-amber-500' : 'w-4 bg-white/30'}`} />
              ))}
            </div>
          )}
        </div>
      </header>

      <main id="menu" className="max-w-7xl mx-auto py-32 px-6">
        <div className="text-center mb-24">
          <span className="text-amber-800 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Thưởng thức trọn vẹn</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 uppercase text-stone-900">Thực Đơn Đặc Sắc</h2>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-stone-100 pb-8 w-full max-w-4xl mx-auto">
            {Object.values(Category).map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeFilter === cat ? 'text-amber-800 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-800' : 'text-stone-300 hover:text-stone-900'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {filteredMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedDish(dish)} className="group cursor-pointer bg-white rounded-[40px] overflow-hidden p-5 border border-stone-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
              <div className="relative aspect-square overflow-hidden rounded-[32px] mb-8 bg-stone-50">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-500"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md py-3 text-center rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Chi tiết món ăn</span>
                  </div>
                </div>
              </div>
              <div className="px-2 space-y-4 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight group-hover:text-amber-800 transition-colors">{dish.name}</h3>
                  <span className="text-amber-800 font-black text-xl tracking-tighter shrink-0">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic font-medium leading-relaxed line-clamp-2">"{dish.description || 'Hương vị truyền thống đậm đà bản sắc Việt.'}"</p>
                <div className="pt-2"><span className="text-[9px] font-black uppercase tracking-widest text-white bg-stone-900 px-4 py-1.5 rounded-full shadow-sm">{dish.category}</span></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedDish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-xl p-6" onClick={() => setSelectedDish(null)}>
          <div className="max-w-6xl w-full bg-white rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 aspect-square md:aspect-auto h-[40vh] md:h-auto overflow-hidden"><img src={selectedDish.image_url} className="w-full h-full object-cover" /></div>
            <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative bg-white">
              <button onClick={() => setSelectedDish(null)} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-all">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="space-y-10">
                <div>
                  <span className="text-amber-800 text-xs font-black uppercase tracking-[0.5em] mb-4 block">{selectedDish.category}</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none uppercase text-stone-900">{selectedDish.name}</h2>
                  <div className="text-4xl font-black text-amber-800 tracking-tighter">{selectedDish.price}</div>
                </div>
                <div className="w-16 h-1 bg-stone-100 rounded-full"></div>
                <p className="text-stone-500 text-xl md:text-2xl leading-relaxed italic font-light">"{selectedDish.description || 'Món ăn được chuẩn bị tỉ mỉ từ nguyên liệu tươi sạch nhất trong ngày.'}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-24 px-12 bg-stone-900 text-white mt-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 pb-16">
          <div className="text-center md:text-left">
            <span className="font-black tracking-[0.4em] uppercase text-2xl block mb-2">ÚT TRINH</span>
            <span className="text-stone-400 text-[10px] font-medium block mb-2 uppercase tracking-widest">158A/5 Trần Vĩnh Kiết, Ninh Kiều, TP Cần Thơ</span>
            <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em]">Hương Vị Gia Đình Thượng Hạng</span>
          </div>
          <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">© 2026 UT TRINH KITCHEN — PREMIUM DINING - EST 2019</p>
        </div>
        
        {/* Visitor Stats Section */}
        <div className="max-w-7xl mx-auto mt-12 flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
          <div className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-stone-600 rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] font-black uppercase tracking-widest">Tổng lượt khách truy cập</span>
              <span className="text-white text-sm font-black tracking-widest tabular-nums group-hover:text-amber-500 transition-colors">{totalVisitors.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] font-black uppercase tracking-widest">Số khách đang online</span>
              <span className="text-green-500 text-sm font-black tracking-widest tabular-nums group-hover:scale-110 transition-transform origin-left">{onlineUsers}</span>
            </div>
          </div>
        </div>
      </footer>
      <style>{`@keyframes slow-zoom { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, supabaseConfig, setSupabaseConfig, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'config'>(supabaseConfig.url ? 'menu' : 'config');
  const [localConfig, setLocalConfig] = useState(supabaseConfig);
  const [showSql, setShowSql] = useState(false);

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
      alert("Hãy dùng Ctrl+V trực tiếp vào ô nhập liệu.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl border border-stone-100 overflow-hidden rounded-[50px]">
          <div className="flex bg-stone-50/50 border-b border-stone-200 p-4 gap-4">
            {['menu', 'hero', 'config'].map((tab: any) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>{tab === 'menu' ? '🍱 Thực Đơn' : tab === 'hero' ? '🖼️ Ảnh Bìa' : '⚙️ Hệ Thống'}</button>
            ))}
          </div>

          <div className="p-10 md:p-16">
            {activeTab === 'config' && (
              <div className="max-w-xl mx-auto py-12 space-y-8">
                <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">Cấu hình kết nối</h2>
                <div className="space-y-4">
                  <input placeholder="Supabase URL" value={localConfig.url || ''} onChange={e => setLocalConfig({...localConfig, url: e.target.value})} className="w-full border-2 border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                  <input placeholder="Anon Key" value={localConfig.key || ''} onChange={e => setLocalConfig({...localConfig, key: e.target.value})} className="w-full border-2 border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                  <button onClick={() => { setSupabaseConfig(localConfig); alert("Đã cập nhật!"); setActiveTab('menu'); }} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-800 transition-all">Kết nối ngay</button>
                </div>
                
                <div className="pt-10 border-t border-stone-100 mt-10">
                   <h3 className="text-xs font-black uppercase text-amber-800 mb-4">Hướng dẫn thiết lập Database:</h3>
                   <p className="text-sm text-stone-500 mb-6">Nếu bạn thấy thông báo "Lỗi đồng bộ", hãy vào mục **SQL Editor** trong Supabase, dán đoạn mã này vào và nhấn **Run**:</p>
                   <button onClick={() => setShowSql(!showSql)} className="text-[10px] font-black uppercase tracking-widest text-stone-900 border border-stone-900 px-6 py-3 rounded-xl hover:bg-stone-900 hover:text-white transition-all">
                     {showSql ? 'Đóng mã SQL' : 'Xem mã SQL Sửa Lỗi'}
                   </button>
                   {showSql && (
                     <div className="mt-6 relative">
                       <pre className="bg-stone-900 text-amber-200 p-6 rounded-2xl text-[10px] font-mono overflow-x-auto leading-relaxed shadow-inner">
                         {SQL_SETUP}
                       </pre>
                       <button onClick={() => { navigator.clipboard.writeText(SQL_SETUP); alert("Đã copy mã SQL!"); }} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white text-[9px] px-3 py-1.5 rounded-lg transition-all font-black uppercase">Copy</button>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Thực Đơn ({menu.length})</h2>
                  <div className="flex gap-4">
                    <button onClick={onSave} className="bg-stone-900 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all">Đồng Bộ Cloud</button>
                    <button onClick={addDish} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all">+ Thêm món mới</button>
                  </div>
                </div>
                <div className="space-y-8">
                  {menu.map((dish: Dish) => (
                    <div key={dish.id} className="p-8 border border-stone-100 bg-stone-50/50 rounded-[40px] grid grid-cols-1 md:grid-cols-4 gap-8 relative group hover:bg-white transition-all">
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-stone-400">Tên món</label><input value={dish.name || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, name: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-bold" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-stone-400">Giá</label><input value={dish.price || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, price: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-black text-amber-800" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-stone-400">Loại</label><select value={dish.category} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-black text-[10px] uppercase">{Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-stone-400 flex justify-between"><span>Link ảnh</span><button onClick={() => pasteFromClipboard(dish.id, 'dish')} className="text-amber-800 underline">Dán</button></label><input value={dish.image_url || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 font-mono text-[9px]" /></div>
                      <div className="md:col-span-4 space-y-2"><label className="text-[10px] font-black uppercase text-stone-400">Mô tả</label><textarea value={dish.description || ''} onChange={e => setMenu(menu.map((d: any) => d.id === dish.id ? {...d, description: e.target.value} : d))} className="w-full bg-white border border-stone-100 p-4 rounded-xl outline-none focus:border-stone-900 italic text-sm" /></div>
                      <button onClick={() => setMenu(menu.filter((d: any) => d.id !== dish.id))} className="absolute top-4 right-4 text-red-300 hover:text-red-500 text-2xl font-light">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Ảnh bìa Hero</h2>
                  <button onClick={addHero} className="bg-amber-800 text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all">+ Thêm Slide Mới</button>
                </div>
                {heroSlides.map((slide: HeroSlide) => (
                  <div key={slide.id} className="p-10 border-2 border-stone-50 bg-stone-50/50 rounded-[40px] flex flex-col gap-10 relative hover:bg-white transition-all">
                    <div className="aspect-[21/9] w-full bg-stone-200 rounded-[30px] overflow-hidden border-4 border-white shadow-inner">{slide.image_url && <img src={slide.image_url} className="w-full h-full object-cover" />}</div>
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-stone-400 flex justify-between items-center"><span>Link ảnh nền</span><button onClick={() => pasteFromClipboard(slide.id, 'hero')} className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Dán Từ Bộ Nhớ</button></label>
                         <input value={slide.image_url || ''} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="w-full bg-white border border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 font-mono text-xs" />
                       </div>
                       <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-stone-400">Câu slogan</label>
                         <input value={slide.quote || ''} onChange={e => setHeroSlides(heroSlides.map((s: any) => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="w-full bg-white border border-stone-100 p-5 rounded-2xl outline-none focus:border-stone-900 italic text-xl font-medium" />
                       </div>
                    </div>
                    <button onClick={() => setHeroSlides(heroSlides.filter((s: any) => s.id !== slide.id))} className="text-[10px] font-black uppercase text-red-300 hover:text-red-500 underline self-center">Xóa slide này</button>
                  </div>
                ))}
                <button onClick={onSave} className="w-full bg-stone-900 text-white py-8 rounded-[35px] font-black uppercase tracking-[0.3em] mt-10 shadow-2xl hover:bg-black transition-all">Lưu Tất Cả Thay Đổi</button>
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
    if (HARDCODED_SUPABASE_URL && HARDCODED_SUPABASE_KEY) {
        return { url: HARDCODED_SUPABASE_URL, key: HARDCODED_SUPABASE_KEY };
    }
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
      setMenu([{ id: '1', name: 'Món Mẫu: Sườn Rim', price: '125.000 VNĐ', description: 'Đây là dữ liệu mẫu khi chưa kết nối Database.', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000', category: Category.MainCourse }]);
      setHeroSlides([{ id: 'h1', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920', quote: 'Dữ liệu mẫu - Vui lòng cấu hình Database.' }]);
      setIsLoading(false);
      return;
    }
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: true });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
    } catch (e) {
      console.error("Fetch failed", e);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!HARDCODED_SUPABASE_URL) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(supabaseConfig));
    }
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
      const { error: delMenuErr = null } = await supabase.from('dishes').delete().neq('name', '___DELETED___');
      if (delMenuErr) throw delMenuErr;
      const { error: delHeroErr = null } = await supabase.from('hero_slides').delete().neq('image_url', '___DELETED___');
      if (delHeroErr) throw delHeroErr;
      
      const sanitize = (list: any[]) => list.map(({ id, created_at, ...rest }) => rest);

      if (menu.length) {
        const { error: insMenuErr = null } = await supabase.from('dishes').insert(sanitize(menu));
        if (insMenuErr) throw insMenuErr;
      }
      if (heroSlides.length) {
        const { error: insHeroErr = null } = await supabase.from('hero_slides').insert(sanitize(heroSlides));
        if (insHeroErr) throw insHeroErr;
      }
      
      alert("Đã đồng bộ thành công!");
      fetchData();
    } catch (e: any) {
      console.error(e);
      alert(`LỖI: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (hash.toLowerCase().includes('acp1122')) {
    return <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} supabaseConfig={supabaseConfig} setSupabaseConfig={setSupabaseConfig} onSave={handleSave} />;
  }
  return <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
