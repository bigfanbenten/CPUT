
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
        <h3 className="text-xl font-serif font-bold text-stone-800 group-hover:text-orange-800 transition-colors leading-tight">{dish.name}</h3>
        <span className="text-orange-900 font-bold text-sm bg-orange-50 px-2 py-1 rounded-sm whitespace-nowrap ml-2">{dish.price}</span>
      </div>
      <p className="text-stone-500 text-sm italic leading-relaxed opacity-80">"{dish.description}"</p>
    </div>
  </div>
);

const DishModal: React.FC<{ dish: Dish | null; onClose: () => void }> = ({ dish, onClose }) => {
  if (!dish) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/95 backdrop-blur-md">
      <div className="bg-white max-w-5xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden shadow-2xl rounded-sm max-h-[90vh]">
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-[#fdfcfb] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-orange-800 p-2 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="text-orange-800 text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block border-l-2 border-orange-800 pl-4">{dish.category}</span>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4 leading-tight">{dish.name}</h2>
          <p className="text-2xl text-orange-900 font-medium mb-8">{dish.price}</p>
          <div className="border-t border-stone-100 pt-6">
            <p className="text-stone-600 text-base md:text-lg italic mb-8 leading-relaxed">"{dish.description}"</p>
            <a href="tel:0900000000" className="inline-block w-full text-center bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.3em] font-bold hover:bg-orange-900 transition-all rounded-sm shadow-lg shadow-stone-200">
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
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key is missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const menuStr = MENU_DATA.map(d => `${d.name} (${d.category})`).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Người dùng đang cảm thấy: "${mood}". Dựa trên thực đơn của nhà hàng Út Trinh: ${menuStr}, hãy gợi ý một món ăn duy nhất phù hợp với cảm xúc/nhu cầu của họ. Trả lời bằng tiếng Việt, giọng điệu niềm nở, ấm áp như người nhà. Trả kết quả dưới dạng JSON: { "dishName": "tên chính xác của món trong thực đơn", "reason": "lời nhắn gửi yêu thương và lý do gợi ý" }`,
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
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] selection:bg-orange-100">
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 px-6 md:px-12 h-20 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-serif font-black text-orange-900 tracking-tighter uppercase leading-none">ÚT TRINH KITCHEN</span>
          <span className="text-[9px] tracking-[0.3em] text-stone-400 uppercase mt-1 font-medium">Cơm phần & Đặc sản quê nhà</span>
        </div>
        <a href="tel:0900000000" className="bg-stone-900 text-white px-5 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-orange-900 transition-all rounded-sm shadow-md">090.XXX.XXXX</a>
      </nav>

      <header className="relative h-[65vh] flex items-center justify-center bg-stone-900 mt-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920" className="absolute inset-0 w-full h-full object-cover opacity-50 animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/40"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-tight">Mỹ thực quê nhà</h1>
          <p className="text-stone-100 text-lg md:text-2xl font-light italic tracking-wide opacity-90">"Nơi tìm lại hương vị mâm cơm mẹ nấu"</p>
        </div>
      </header>

      <section className="py-20 bg-orange-50/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-block w-12 h-0.5 bg-orange-900 mb-8 opacity-30"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-8 italic">Bạn chưa biết chọn món nào? Hãy hỏi Út Trinh:</h2>
          <form onSubmit={askChef} className="flex flex-col sm:flex-row gap-3">
            <input 
              value={mood} onChange={(e) => setMood(e.target.value)}
              placeholder="Bạn đang thấy thế nào? (Vd: Tôi đang mệt, Tôi muốn ăn gì đó cay...)"
              className="flex-1 border border-stone-200 p-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 bg-white shadow-sm transition-all"
            />
            <button disabled={isAiLoading} className="bg-orange-900 text-white px-10 py-4 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 hover:bg-stone-900 transition-colors shadow-lg">
              {isAiLoading ? 'ĐANG SUY NGHĨ...' : 'NHẬN GỢI Ý'}
            </button>
          </form>
          {aiResult && (
            <div className="mt-8 bg-white p-6 md:p-8 shadow-2xl border border-orange-100 flex flex-col md:flex-row items-center gap-6 text-left animate-in fade-in slide-in-from-top-4 rounded-sm">
              {aiResult.dish && <img src={aiResult.dish.image_url} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-sm shadow-md" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="w-4 h-4 text-orange-800"><svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></span>
                   <h4 className="font-serif text-2xl text-stone-900">{aiResult.dishName}</h4>
                </div>
                <p className="text-stone-600 text-base italic leading-relaxed">"{aiResult.reason}"</p>
                {aiResult.dish && (
                  <button onClick={() => setSelectedDish(aiResult.dish)} className="mt-4 text-[10px] font-bold text-orange-900 uppercase tracking-widest hover:underline">Xem chi tiết món này</button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1">
        <div className="text-center mb-16">
          <span className="text-orange-900 text-[10px] tracking-[0.5em] font-bold uppercase mb-4 block">Thực Đơn Út Trinh</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Món Ngon Mỗi Ngày</h2>
        </div>

        <div className="flex justify-center gap-4 md:gap-8 mb-20 overflow-x-auto pb-4 scrollbar-hide">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredMenu.map(dish => <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />)}
        </div>
      </main>

      <footer className="bg-[#121110] text-white py-20 px-8 text-center border-t border-stone-800">
        <div className="max-w-xl mx-auto">
          <h3 className="text-3xl font-serif text-orange-400 mb-3 uppercase tracking-tighter">ÚT TRINH KITCHEN</h3>
          <p className="text-stone-500 text-[10px] tracking-[0.5em] mb-12 font-medium">COMPHANUTTRINH.ONLINE</p>
          <div className="flex justify-center gap-8 mb-12 text-stone-400">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-stone-600">Địa chỉ</span>
              <span className="text-sm">Quận 7, TP. Hồ Chí Minh</span>
            </div>
            <div className="w-px h-8 bg-stone-800 self-center"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-stone-600">Thời gian</span>
              <span className="text-sm">10:00 - 21:00</span>
            </div>
          </div>
          <p className="text-stone-600 text-[11px] border-t border-stone-800/50 pt-10 font-light">© 2024 - Vì một bữa cơm ngon tròn vị cho mọi gia đình Việt</p>
        </div>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
      <style>{`
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.15); } }
        .animate-slow-zoom { animation: slow-zoom 30s ease-in-out infinite alternate; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
