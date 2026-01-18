
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- DỮ LIỆU MÓN ĂN ---
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
    tags: ['Bán Chạy', 'Đặc Sản']
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
    name: 'Canh Chua Cá Hú',
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

// --- COMPONENT GIAO DIỆN ---
const MenuCard: React.FC<{ dish: Dish; onClick: (d: Dish) => void }> = ({ dish, onClick }) => (
  <div 
    onClick={() => onClick(dish)}
    className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 rounded-sm"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {dish.tags?.map(tag => (
          <span key={tag} className="bg-orange-800 text-white text-[9px] px-3 py-1 uppercase tracking-widest font-bold shadow-lg">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-serif font-bold text-stone-800 group-hover:text-orange-800 transition-colors">{dish.name}</h3>
        <span className="text-orange-900 font-bold text-sm bg-orange-50 px-2 py-1 rounded-sm">{dish.price}</span>
      </div>
      <p className="text-stone-500 text-sm italic opacity-80">"{dish.description}"</p>
    </div>
  </div>
);

const DishModal: React.FC<{ dish: Dish | null; onClose: () => void }> = ({ dish, onClose }) => {
  if (!dish) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/95 backdrop-blur-md">
      <div className="bg-white max-w-5xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden shadow-2xl rounded-sm">
        <div className="md:w-1/2 h-80 md:h-auto relative">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8 md:p-16 relative flex flex-col justify-center bg-[#fdfcfb]">
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-orange-800 p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="text-orange-800 text-[11px] tracking-[0.4em] uppercase font-bold mb-6 block border-l-2 border-orange-800 pl-4">{dish.category}</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-6 leading-tight">{dish.name}</h2>
          <p className="text-3xl text-orange-900 font-light mb-10">{dish.price}</p>
          <div className="border-t border-stone-200 pt-8">
            <p className="text-stone-600 text-lg italic mb-10">"{dish.description}"</p>
            <a href="tel:0900000000" className="inline-block w-full text-center bg-stone-900 text-white py-5 text-sm uppercase tracking-[0.3em] font-bold hover:bg-orange-900 transition-all">
              GỌI ĐẶT MÓN NGAY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      // API Key được lấy từ process.env được định nghĩa trong vite.config.ts
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key is missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const menuStr = MENU_DATA.map(d => `${d.name} (${d.category})`).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Người dùng: "${mood}". Dựa trên thực đơn: ${menuStr}, hãy gợi ý 1 món phù hợp, giọng niềm nở. Trả JSON: { "dishName": "tên", "reason": "lý do" }`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      const foundDish = MENU_DATA.find(d => d.name.toLowerCase().includes(data.dishName?.toLowerCase()));
      setAiResult({ ...data, dish: foundDish });
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 px-8 h-20 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-serif font-black text-orange-900 tracking-tighter uppercase leading-none">ÚT TRINH KITCHEN</span>
          <span className="text-[9px] tracking-[0.3em] text-stone-400 uppercase mt-1">Cơm phần & Đặc sản quê nhà</span>
        </div>
        <a href="tel:0900000000" className="bg-stone-900 text-white px-6 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-orange-900 transition-all rounded-sm">090.XXX.XXXX</a>
      </nav>

      <header className="relative h-[60vh] flex items-center justify-center bg-stone-900 mt-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920" className="absolute inset-0 w-full h-full object-cover opacity-40 animate-slow-zoom" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-6">Mỹ thực quê nhà</h1>
          <p className="text-stone-100 text-lg md:text-xl font-light italic">"Nơi tìm lại hương vị mâm cơm mẹ nấu"</p>
        </div>
      </header>

      <section className="py-20 bg-orange-50/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-stone-800 mb-8 italic">Bạn chưa biết chọn món nào? Hãy hỏi Út Trinh:</h2>
          <form onSubmit={askChef} className="flex gap-2">
            <input 
              value={mood} onChange={(e) => setMood(e.target.value)}
              placeholder="Hôm nay bạn thấy thế nào?"
              className="flex-1 border border-stone-200 p-4 rounded-sm focus:outline-none focus:border-orange-800 bg-white shadow-sm"
            />
            <button disabled={isAiLoading} className="bg-orange-900 text-white px-8 py-4 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50">
              {isAiLoading ? '...' : 'GỢI Ý'}
            </button>
          </form>
          {aiResult && (
            <div className="mt-8 bg-white p-6 shadow-xl border border-orange-100 flex items-center gap-6 text-left animate-in fade-in slide-in-from-top-4">
              {aiResult.dish && <img src={aiResult.dish.image_url} className="w-20 h-20 object-cover" />}
              <div>
                <h4 className="font-serif text-xl text-stone-900">{aiResult.dishName}</h4>
                <p className="text-stone-500 text-sm italic">{aiResult.reason}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="py-20 max-w-7xl mx-auto px-8 w-full">
        <div className="flex justify-center gap-6 mb-16 overflow-x-auto pb-4">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 text-[10px] tracking-widest uppercase font-bold transition-all border-b-2 ${
                selectedCategory === cat ? 'text-orange-900 border-orange-900' : 'text-stone-400 border-transparent hover:text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMenu.map(dish => <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />)}
        </div>
      </main>

      <footer className="bg-[#121110] text-white py-16 text-center">
        <h3 className="text-2xl font-serif text-orange-400 mb-2 uppercase">CƠM PHẦN ÚT TRINH</h3>
        <p className="text-stone-600 text-[10px] tracking-[0.5em] mb-8">COMPHANUTTRINH.ONLINE</p>
        <p className="text-stone-500 text-sm">© 2024 - Vì một bữa cơm ngon cho mọi gia đình</p>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
      <style>{`
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 20s linear infinite alternate; }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
