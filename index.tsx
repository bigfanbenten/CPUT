
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

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

// --- INITIAL DATA ---
const DEFAULT_MENU: Dish[] = [
  { id: '1', name: 'Sườn Non Rim Mặn Ngọt', description: 'Sườn non tuyển chọn, rim nước mắm kẹo, óng ánh sắc nâu cánh gián, đậm đà vị quê.', price: '55.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', category: Category.MainCourse, tags: ['Bán Chạy'] },
  { id: '2', name: 'Cá Lóc Kho Tộ Miền Tây', description: 'Cá lóc đồng kho trong tộ đất, nước màu dừa tự thắng, tiêu xanh cay nồng.', price: '65.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=800', category: Category.MainCourse },
  { id: '3', name: 'Canh Chua Cá Hú', description: 'Vị chua thanh của me, ngọt của cá hú, thơm nồng bông điên điển và ngò gai.', price: '45.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800', category: Category.Soup },
  { id: '4', name: 'Bông Bí Xào Tỏi', description: 'Bông bí tươi rói xào nhanh tay with tỏi cô đơn, giữ độ giòn ngọt tự nhiên.', price: '35.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', category: Category.Vegetable },
  { id: '5', name: 'Nước Mủ Trôm Hạt Chia', description: 'Thức uống giải nhiệt thanh mát, ít đường, tốt cho sức khỏe.', price: '15.000 VNĐ', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800', category: Category.Drink }
];

const DEFAULT_HERO: HeroSlide[] = [
  { id: 'h1', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920', quote: 'Nơi tìm lại hương vị mâm cơm mẹ nấu' },
  { id: 'h2', image_url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=1920', quote: 'Đậm đà phong vị Miền Tây sông nước' },
  { id: 'h3', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920', quote: 'Nguyên liệu tươi sạch, nấu bằng cả trái tim' }
];

// --- COMPONENTS ---

const Nav = ({ isAdminPage = false }: { isAdminPage?: boolean }) => (
  <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 px-6 md:px-12 h-20 flex items-center justify-between shadow-sm">
    <div className="flex flex-col cursor-pointer" onClick={() => window.location.href = '/'}>
      <span className="text-xl md:text-2xl font-black text-orange-900 tracking-tighter uppercase leading-none">ÚT TRINH KITCHEN</span>
      <span className="text-[9px] tracking-[0.3em] text-stone-400 uppercase mt-1 font-bold">
        {isAdminPage ? 'Hệ thống Quản trị Nội bộ' : 'Cơm phần & Đặc sản quê nhà'}
      </span>
    </div>
    <div className="flex items-center gap-4">
      {isAdminPage ? (
        <button onClick={() => window.location.href = '/'} className="text-stone-500 text-[10px] font-bold uppercase tracking-widest hover:text-orange-800 transition-colors">
          Quay lại Trang chủ
        </button>
      ) : (
        <a href="tel:0900000000" className="bg-stone-900 text-white px-5 py-2 text-[10px] uppercase font-black tracking-widest hover:bg-orange-900 transition-all rounded-sm shadow-md">
          090.XXX.XXXX
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

const HomePage = ({ menu, heroSlides }: { menu: Dish[]; heroSlides: HeroSlide[] }) => {
  const [currentHero, setCurrentHero] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'Tất cả') return menu;
    return menu.filter(dish => dish.category === selectedCategory);
  }, [selectedCategory, menu]);

  const nextSlide = () => setCurrentHero(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentHero(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <Nav />
      
      {/* Hero Slider */}
      <header className="relative h-[80vh] flex items-center justify-center bg-stone-900 mt-20 overflow-hidden group">
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHero ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.image_url} className="w-full h-full object-cover scale-110 opacity-60 blur-[1px] transition-transform duration-[10s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40"></div>
          </div>
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-9xl font-black text-white mb-6 leading-tight tracking-tighter uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Ẩm thực quê nhà
          </h1>
          <div className="overflow-hidden h-12 md:h-16">
            <p key={currentHero} className="text-stone-100 text-xl md:text-3xl font-light italic tracking-wide animate-in fade-in slide-in-from-top-4 duration-700">
              "{heroSlides[currentHero]?.quote}"
            </p>
          </div>
        </div>

        {/* Custom Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
          <button onClick={prevSlide} className="text-white/40 hover:text-white transition-all p-2 hover:scale-125">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <div key={i} className={`h-1 transition-all duration-500 ${i === currentHero ? 'w-8 bg-orange-600' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
          <button onClick={nextSlide} className="text-white/40 hover:text-white transition-all p-2 hover:scale-125">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </header>

      <main className="py-32 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1">
        <div className="text-center mb-20">
          <span className="text-orange-900 text-[10px] tracking-[0.5em] font-black uppercase mb-4 block">Thực Đơn Út Trinh</span>
          <h2 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight">Món Ngon Mỗi Ngày</h2>
        </div>

        <div className="flex justify-center gap-4 md:gap-8 mb-20 overflow-x-auto pb-4 scrollbar-hide">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 text-[11px] tracking-widest uppercase font-black transition-all border-b-2 ${
                selectedCategory === cat ? 'text-orange-900 border-orange-900' : 'text-stone-300 border-transparent hover:text-stone-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredMenu.map(dish => <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />)}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121110] text-white py-24 px-8 text-center border-t border-stone-800 mt-20">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-black text-orange-400 mb-4 uppercase tracking-tighter">ÚT TRINH KITCHEN</h3>
          <p className="text-stone-500 text-[11px] tracking-[0.6em] mb-16 font-bold uppercase">comphanuttrinh.online</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-stone-400">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-600 font-black">Địa chỉ</span>
              <span className="text-base">158A/5 Trần Vĩnh Kiết, Tân An,<br/>Ninh Kiều, TP Cần Thơ</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-600 font-black">Liên hệ</span>
              <span className="text-xl font-bold text-white tracking-tighter">090.XXX.XXXX</span>
              <span className="text-sm">9:00 - 18:00 Hàng ngày</span>
            </div>
          </div>
          <p className="text-stone-600 text-[12px] border-t border-stone-800/50 pt-12 font-light italic">
            EST © 2019 - Vì một bữa cơm ngon tròn vị cho mọi gia đình Việt
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all">
          <div className="bg-white max-w-5xl w-full flex flex-col md:flex-row animate-in zoom-in duration-300 rounded-sm overflow-hidden shadow-2xl max-h-[90vh]">
            <div className="md:w-1/2 h-72 md:h-auto overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center relative overflow-y-auto bg-[#fdfcfb]">
              <button onClick={() => setSelectedDish(null)} className="absolute top-6 right-6 text-stone-300 hover:text-orange-800 transition-colors p-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <span className="text-orange-800 text-[11px] tracking-[0.5em] uppercase font-black mb-6 border-l-4 border-orange-800 pl-4">{selectedDish.category}</span>
              <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-3 tracking-tighter leading-none">{selectedDish.name}</h2>
              <p className="text-3xl text-orange-900 font-bold mb-10 tracking-tight">{selectedDish.price}</p>
              <div className="border-t border-stone-200 pt-8">
                <p className="text-stone-600 text-lg md:text-xl italic mb-12 leading-relaxed">"{selectedDish.description}"</p>
                <a href="tel:0900000000" className="inline-block w-full text-center bg-stone-900 text-white py-5 text-[12px] uppercase tracking-[0.5em] font-black hover:bg-orange-900 transition-all shadow-2xl shadow-stone-300 rounded-sm">
                  GỌI ĐẶT MÓN NGAY
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides }: { 
  menu: Dish[]; setMenu: any; heroSlides: HeroSlide[]; setHeroSlides: any;
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero'>('menu');

  const addDish = () => {
    const newDish: Dish = { id: Date.now().toString(), name: 'Món mới', description: '', price: '0 VNĐ', image_url: '', category: Category.MainCourse };
    setMenu([...menu, newDish]);
  };

  const addHero = () => {
    const newHero: HeroSlide = { id: Date.now().toString(), image_url: '', quote: 'Câu nói mới...' };
    setHeroSlides([...heroSlides, newHero]);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <Nav isAdminPage />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-sm shadow-sm border border-stone-200">
          <div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase">Admin Control Panel</h1>
            <p className="text-stone-400 text-sm font-medium tracking-wide">Quản lý nội dung website Út Trinh Kitchen</p>
          </div>
          <div className="flex bg-stone-100 p-1 rounded-sm">
            <button onClick={() => setActiveTab('menu')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${activeTab === 'menu' ? 'bg-white text-orange-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>Thực đơn</button>
            <button onClick={() => setActiveTab('hero')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${activeTab === 'hero' ? 'bg-white text-orange-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>Ảnh bìa & Slogan</button>
          </div>
        </header>

        {activeTab === 'menu' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800 uppercase tracking-tight">Danh sách món ăn ({menu.length})</h2>
              <button onClick={addDish} className="bg-orange-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-lg shadow-orange-100">Thêm món mới</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {menu.map(dish => (
                <div key={dish.id} className="bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start border border-stone-200 hover:border-orange-300 transition-all rounded-sm">
                  <div className="w-40 h-32 bg-stone-100 shrink-0 relative overflow-hidden group">
                    <img src={dish.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Tên món</label>
                      <input value={dish.name} onChange={e => setMenu(menu.map(d => d.id === dish.id ? {...d, name: e.target.value} : d))} className="border p-3 text-sm focus:ring-1 ring-orange-800 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Giá hiển thị</label>
                      <input value={dish.price} onChange={e => setMenu(menu.map(d => d.id === dish.id ? {...d, price: e.target.value} : d))} className="border p-3 text-sm focus:ring-1 ring-orange-800 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Phân loại</label>
                      <select value={dish.category} onChange={e => setMenu(menu.map(d => d.id === dish.id ? {...d, category: e.target.value as Category} : d))} className="border p-3 text-sm focus:ring-1 ring-orange-800 outline-none">
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-3 flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Mô tả món ăn</label>
                      <textarea value={dish.description} onChange={e => setMenu(menu.map(d => d.id === dish.id ? {...d, description: e.target.value} : d))} className="border p-3 text-sm h-20 outline-none focus:ring-1 ring-orange-800" />
                    </div>
                    <div className="md:col-span-3 flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Link hình ảnh (URL)</label>
                      <input value={dish.image_url} onChange={e => setMenu(menu.map(d => d.id === dish.id ? {...d, image_url: e.target.value} : d))} className="border p-3 text-sm focus:ring-1 ring-orange-800 outline-none" placeholder="Dán link từ Unsplash hoặc dịch vụ up ảnh" />
                    </div>
                  </div>
                  <button onClick={() => confirm('Xóa món này?') && setMenu(menu.filter(d => d.id !== dish.id))} className="text-stone-300 hover:text-red-600 p-2 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800 uppercase tracking-tight">Cấu hình Slider ảnh bìa</h2>
              <button onClick={addHero} className="bg-orange-800 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-lg shadow-orange-100">Thêm ảnh bìa</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {heroSlides.map(slide => (
                <div key={slide.id} className="bg-white p-8 border border-stone-200 rounded-sm shadow-sm flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-64 h-36 bg-stone-100 shrink-0 relative overflow-hidden group">
                    <img src={slide.image_url || 'https://via.placeholder.com/800x400?text=Hero+Image'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Câu nói / Slogan hiển thị</label>
                      {/* Fixed: Use 's' instead of undefined 'd' to properly reference the slide in map */}
                      <input value={slide.quote} onChange={e => setHeroSlides(heroSlides.map(s => s.id === slide.id ? {...s, quote: e.target.value} : s))} className="border p-4 text-lg italic text-stone-800 outline-none focus:ring-1 ring-orange-800" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-black text-stone-400">Link ảnh nền (Chất lượng cao - 1920px)</label>
                      {/* Fixed: Use 's' instead of undefined 'd' to properly reference the slide in map */}
                      <input value={slide.image_url} onChange={e => setHeroSlides(heroSlides.map(s => s.id === slide.id ? {...s, image_url: e.target.value} : s))} className="border p-3 text-sm outline-none focus:ring-1 ring-orange-800" />
                    </div>
                  </div>
                  <button onClick={() => confirm('Xóa ảnh bìa này?') && setHeroSlides(heroSlides.filter(s => s.id !== slide.id))} className="bg-red-50 text-red-600 p-4 rounded-full hover:bg-red-600 hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ROUTER & STORAGE SYNC ---

const App = () => {
  const [menu, setMenu] = useState<Dish[]>(() => {
    const saved = localStorage.getItem('ut-trinh-menu-v2');
    return saved ? JSON.parse(saved) : DEFAULT_MENU;
  });
  
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('ut-trinh-hero-v2');
    return saved ? JSON.parse(saved) : DEFAULT_HERO;
  });

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    localStorage.setItem('ut-trinh-menu-v2', JSON.stringify(menu));
    localStorage.setItem('ut-trinh-hero-v2', JSON.stringify(heroSlides));
  }, [menu, heroSlides]);

  // Handle path changes (basic routing)
  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple Router logic
  if (path.toLowerCase().includes('/acpanel')) {
    return <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} />;
  }

  return <HomePage menu={menu} heroSlides={heroSlides} />;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
