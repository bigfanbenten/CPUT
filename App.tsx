
import React, { useState, useMemo } from 'react';

// --- TYPES & CONSTANTS ---
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

const MENU_DATA: Dish[] = [
  {
    id: '1',
    name: 'Sườn Non Rim Mặn Ngọt',
    description: 'Sườn non tuyển chọn, rim nước mắm kẹo, óng ánh sắc nâu cánh gián, đậm đà vị quê.',
    price: '55.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    category: Category.MainCourse,
    tags: ['Bán Chạy', 'Đậm Đà']
  },
  {
    id: '2',
    name: 'Cá Lóc Kho Tộ Miền Tây',
    description: 'Cá lóc đồng kho trong tộ đất, nước màu dừa tự thắng, tiêu xanh cay nồng.',
    price: '65.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=800',
    category: Category.MainCourse,
    tags: ['Đặc Sản']
  },
  {
    id: '3',
    name: 'Canh Chua Cá Hú Bông Điên Điển',
    description: 'Vị chua thanh của me, ngọt của cá hú, thơm nồng bông điên điển và ngò gai.',
    price: '45.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    category: Category.Soup
  },
  {
    id: '4',
    name: 'Bông Bí Xào Tỏi',
    description: 'Bông bí tươi rói xào nhanh tay với tỏi cô đơn, giữ độ giòn ngọt tự nhiên.',
    price: '35.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: Category.Vegetable
  },
  {
    id: '5',
    name: 'Nước Mủ Trôm Hạt Chia',
    description: 'Thức uống giải nhiệt thanh mát, ít đường, tốt cho sức khỏe.',
    price: '15.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    category: Category.Drink
  }
];

// --- COMPONENTS ---

// Defining MenuCard as a React.FC to handle internal React props like 'key' correctly
const MenuCard: React.FC<{ dish: Dish; onClick: (d: Dish) => void }> = ({ dish, onClick }) => (
  <div 
    onClick={() => onClick(dish)}
    className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {dish.tags?.map(tag => (
          <span key={tag} className="bg-orange-800 text-white text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-serif font-bold text-stone-800 group-hover:text-orange-800 transition-colors">{dish.name}</h3>
        <span className="text-orange-900 font-bold text-sm ml-2">{dish.price}</span>
      </div>
      <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 italic">"{dish.description}"</p>
    </div>
  </div>
);

// Defining DishModal as a React.FC for consistent typing
const DishModal: React.FC<{ dish: Dish | null; onClose: () => void }> = ({ dish, onClose }) => {
  if (!dish) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden shadow-2xl">
        <div className="md:w-1/2 h-64 md:h-auto">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-orange-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="text-orange-800 text-[10px] tracking-[0.3em] uppercase font-bold mb-4 block">{dish.category}</span>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 leading-tight">{dish.name}</h2>
          <p className="text-2xl text-orange-900 font-light mb-8">{dish.price}</p>
          <div className="border-t border-stone-100 pt-6">
            <p className="text-stone-600 leading-relaxed italic mb-8">"{dish.description}"</p>
            <button className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-orange-900 transition-colors">
              Thêm Vào Mâm Cơm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'Tất cả') return MENU_DATA;
    return MENU_DATA.filter(dish => dish.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-serif font-black text-orange-900 tracking-tighter uppercase">CƠM PHẦN ÚT TRINH</span>
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
          <a href="#" className="hover:text-orange-800 transition-colors text-orange-900">Thực Đơn</a>
          <a href="#" className="hover:text-orange-800 transition-colors">Về Út Trinh</a>
          <a href="#" className="hover:text-orange-800 transition-colors">Đặt Bàn</a>
        </div>
        <button className="bg-orange-900 text-white px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest shadow-lg hover:bg-black transition-all">
          090.XXX.XXXX
        </button>
      </nav>

      {/* Hero */}
      <header className="relative h-[70vh] flex items-center justify-center bg-stone-900 mt-20">
        <img 
          src="https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 shadow-inner"
        />
        <div className="relative z-10 text-center px-6 fade-in">
          <span className="text-orange-400 text-[10px] tracking-[0.5em] uppercase mb-6 block font-bold">Thưởng thức hương vị truyền thống</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tight">Mâm Cơm Đoàn Viên</h1>
          <div className="w-24 h-[1px] bg-orange-400 mx-auto mb-8"></div>
          <p className="text-stone-300 text-lg md:text-xl font-light italic max-w-2xl mx-auto leading-relaxed">
            "Không đâu bằng cơm nhà mình nấu, không đâu ấm bằng bếp lửa Út Trinh."
          </p>
        </div>
      </header>

      {/* Menu Filter */}
      <section className="py-20 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-stone-900 mb-4">Thực Đơn Hôm Nay</h2>
          <div className="w-16 h-0.5 bg-orange-800 mx-auto"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-2.5 text-[10px] tracking-widest uppercase font-bold transition-all border ${
                selectedCategory === cat 
                  ? 'bg-orange-900 text-white border-orange-900 shadow-xl' 
                  : 'bg-white text-stone-400 border-stone-200 hover:border-orange-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMenu.map(dish => (
            <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-24 mt-auto border-t border-orange-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-orange-400">Út Trinh Kitchen</h3>
            <p className="text-stone-500 text-sm leading-relaxed italic">
              "Mang tinh hoa bếp Việt vào từng bữa cơm hằng ngày của gia đình bạn."
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-orange-800">Liên hệ</h4>
            <p className="text-stone-400 text-sm">123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p>
            <p className="text-stone-400 text-sm">Hotline: 090.XXX.XXXX</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-orange-800">Giờ mở cửa</h4>
            <p className="text-stone-400 text-sm">Sáng: 07:00 - 14:00</p>
            <p className="text-stone-400 text-sm">Chiều: 16:30 - 21:00</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center text-stone-700 text-[9px] uppercase tracking-[0.3em]">
          © 2024 CƠM PHẦN ÚT TRINH. TRÂN TRỌNG VÀ YÊU THƯƠNG.
        </div>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
};

export default App;
