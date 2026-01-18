
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- CẤU HÌNH & DỮ LIỆU ---

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

// --- COMPONENT CON ---

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

const DishModal: React.FC<{ dish: Dish | null; onClose: () => void }> = ({ dish, onClose }) => {
  if (!dish) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden shadow-2xl">
        <div className="md:w-1/2 h-64 md:h-auto">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-orange-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="text-orange-800 text-[10px] tracking-[0.3em] uppercase font-bold mb-4 block">{dish.category}</span>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 leading-tight">{dish.name}</h2>
          <p className="text-2xl text-orange-900 font-light mb-8">{dish.price}</p>
          <div className="border-t border-stone-100 pt-6">
            <p className="text-stone-600 leading-relaxed italic mb-8">"{dish.description}"</p>
            <button className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-orange-900 transition-colors shadow-lg">
              Liên Hệ Đặt Món
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP CHÍNH ---

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [mood, setMood] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'Tất cả') return MENU_DATA;
    return MENU_DATA.filter(dish => dish.category === selectedCategory);
  }, [selectedCategory]);

  const askChef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const menuStr = MENU_DATA.map(d => `${d.name} (${d.category})`).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Người dùng: "${mood}". Dựa trên thực đơn: ${menuStr}, hãy chọn 1 món phù hợp và giải thích lý do bằng tiếng Việt dân dã, ấm cúng. Trả về JSON: { "dishName": "tên món", "reason": "lý do" }`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      const foundDish = MENU_DATA.find(d => d.name.toLowerCase().includes(data.dishName?.toLowerCase()));
      setAiResult({ ...data, dish: foundDish });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-serif font-black text-orange-900 tracking-tighter uppercase">CƠM PHẦN ÚT TRINH</span>
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
          <a href="#menu" className="hover:text-orange-900 transition-colors">Thực Đơn</a>
          <a href="#" className="hover:text-orange-900 transition-colors">Về Chúng Tôi</a>
          <a href="#" className="hover:text-orange-900 transition-colors">Liên Hệ</a>
        </div>
        <div className="bg-orange-900 text-white px-5 py-2 text-[10px] uppercase font-bold tracking-widest rounded-sm">
          HOTLINE: 090.XXX.XXXX
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-[80vh] flex items-center justify-center bg-stone-900 mt-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 hover:scale-100 transition-transform duration-10000"
        />
        <div className="relative z-10 text-center px-6 reveal">
          <span className="text-orange-400 text-[10px] tracking-[0.6em] uppercase mb-6 block font-bold">Tinh hoa ẩm thực gia đình</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tight">Vị Ngon Cơm Nhà</h1>
          <div className="w-24 h-[1px] bg-orange-400 mx-auto mb-8"></div>
          <p className="text-stone-200 text-lg md:text-xl font-light italic max-w-2xl mx-auto leading-relaxed">
            "Bữa cơm không chỉ là ăn để no, mà là để cảm nhận hơi ấm của gia đình."
          </p>
        </div>
      </header>

      {/* AI Section */}
      <section className="py-24 bg-orange-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-2">Hôm nay bạn muốn ăn gì?</h2>
          <p className="text-stone-500 mb-10 italic">Hãy để Út Trinh lắng nghe và gợi ý cho bạn</p>
          
          <form onSubmit={askChef} className="flex flex-col md:flex-row gap-3 mb-10">
            <input 
              type="text" 
              placeholder="Ví dụ: Mình đang mệt, muốn món gì thanh đạm..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="flex-1 bg-white border border-stone-200 px-6 py-4 rounded-sm focus:outline-none focus:border-orange-900 shadow-sm"
            />
            <button 
              disabled={isAiLoading}
              className="bg-orange-900 text-white px-10 py-4 uppercase text-xs font-bold tracking-widest hover:bg-stone-900 transition-all disabled:opacity-50"
            >
              {isAiLoading ? 'ĐANG SUY NGHĨ...' : 'HỎI ÚT TRINH'}
            </button>
          </form>

          {aiResult && (
            <div className="bg-white p-8 border border-orange-100 shadow-xl rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-8 items-center text-left">
              {aiResult.dish && (
                <img src={aiResult.dish.image_url} className="w-32 h-32 object-cover rounded-sm" alt="Suggest" />
              )}
              <div>
                <h4 className="text-orange-900 font-bold uppercase text-[10px] tracking-widest mb-1">Gợi ý dành riêng cho bạn</h4>
                <h3 className="text-2xl font-serif text-stone-900 mb-3">{aiResult.dishName}</h3>
                <p className="text-stone-600 italic leading-relaxed">"{aiResult.reason}"</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Filter & Grid */}
      <main id="menu" className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-stone-900 mb-4">Thực Đơn Út Trinh</h2>
          <div className="w-16 h-1 bg-orange-900 mx-auto"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-2.5 text-[10px] tracking-widest uppercase font-bold transition-all border ${
                selectedCategory === cat 
                  ? 'bg-orange-900 text-white border-orange-900 shadow-lg' 
                  : 'bg-white text-stone-400 border-stone-200 hover:border-orange-900 hover:text-orange-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMenu.map(dish => (
            <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-24 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-orange-400 mb-4">CƠM PHẦN ÚT TRINH</h2>
          <p className="text-stone-500 text-xs tracking-[0.4em] uppercase mb-10">Chân thành - Đậm đà - Tinh tế</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-stone-400 italic">
            <div><p>Quận 1, TP. Hồ Chí Minh</p></div>
            <div><p>Mở cửa: 08:00 - 21:00</p></div>
            <div><p>Hotline: 090.XXX.XXXX</p></div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 text-[9px] text-stone-700 tracking-widest uppercase">
            © 2024 COM PHAN UT TRINH. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
};

// --- RENDER ---

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
