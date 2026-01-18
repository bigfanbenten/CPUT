
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// ========================================================
// PHẦN 1: DỮ LIỆU MÓN ĂN (BẠN CÓ THỂ TỰ SỬA Ở ĐÂY)
// ========================================================
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
  },
  // Bạn có thể thêm món mới ở đây theo cấu trúc trên
];

// ========================================================
// PHẦN 2: CÁC COMPONENT GIAO DIỆN
// ========================================================

const MenuCard: React.FC<{ dish: Dish; onClick: (d: Dish) => void }> = ({ dish, onClick }) => (
  <div 
    onClick={() => onClick(dish)}
    className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 rounded-sm"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
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
      <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 italic opacity-80">"{dish.description}"</p>
    </div>
  </div>
);

const DishModal: React.FC<{ dish: Dish | null; onClose: () => void }> = ({ dish, onClose }) => {
  if (!dish) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md">
      <div className="bg-white max-w-5xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden shadow-2xl rounded-sm">
        <div className="md:w-1/2 h-80 md:h-auto relative">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="md:w-1/2 p-8 md:p-16 relative flex flex-col justify-center bg-[#fdfcfb]">
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-orange-800 transition-colors p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="text-orange-800 text-[11px] tracking-[0.4em] uppercase font-bold mb-6 block border-l-2 border-orange-800 pl-4">{dish.category}</span>
          <h2 className="text-5xl font-serif text-stone-900 mb-6 leading-tight">{dish.name}</h2>
          <p className="text-3xl text-orange-900 font-light mb-10">{dish.price}</p>
          <div className="border-t border-stone-200 pt-8">
            <p className="text-stone-600 text-lg leading-relaxed italic mb-10">"{dish.description}"</p>
            <a 
              href="tel:0900000000"
              className="inline-block w-full text-center bg-stone-900 text-white py-5 text-sm uppercase tracking-[0.3em] font-bold hover:bg-orange-900 transition-all shadow-xl hover:-translate-y-1"
            >
              Gọi Đặt Món Ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// PHẦN 3: LOGIC CHÍNH CỦA ỨNG DỤNG
// ========================================================

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
        contents: `Người dùng nói: "${mood}". Dựa trên thực đơn của quán Út Trinh: ${menuStr}, hãy đóng vai bà chủ quán niềm nở, chọn 1 món phù hợp và giải thích lý do ngắn gọn, tình cảm bằng tiếng Việt. Trả về JSON: { "dishName": "tên món", "reason": "lý do" }`,
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 px-8 h-24 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-2xl md:text-3xl font-serif font-black text-orange-900 tracking-tighter uppercase leading-none">CƠM PHẦN ÚT TRINH</span>
          <span className="text-[10px] tracking-[0.5em] text-stone-400 uppercase mt-1">Hương vị quê nhà giữa lòng phố</span>
        </div>
        <div className="hidden lg:flex gap-12 text-[11px] uppercase tracking-[0.25em] font-bold text-stone-500">
          <a href="#menu" className="hover:text-orange-900 transition-colors border-b border-transparent hover:border-orange-900 pb-1">Thực Đơn</a>
          <a href="#" className="hover:text-orange-900 transition-colors border-b border-transparent hover:border-orange-900 pb-1">Không Gian</a>
          <a href="#" className="hover:text-orange-900 transition-colors border-b border-transparent hover:border-orange-900 pb-1">Liên Hệ</a>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Hỗ trợ đặt bàn</p>
            <p className="text-orange-900 font-bold">090.XXX.XXXX</p>
          </div>
          <button className="bg-stone-900 text-white px-8 py-3 text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-orange-900 transition-all shadow-lg rounded-sm">
            Đặt Món
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[85vh] flex items-center justify-center bg-stone-900 mt-24 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1528605248644-14dd04cb21c7?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 animate-slow-zoom"
          alt="Restaurant Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-stone-900/60"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl reveal">
          <span className="text-orange-400 text-[12px] tracking-[0.8em] uppercase mb-8 block font-bold">Mỹ thực Việt Nam truyền thống</span>
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-10 tracking-tight leading-none">Út Trinh Kitchen</h1>
          <div className="w-32 h-[1px] bg-orange-400 mx-auto mb-10"></div>
          <p className="text-stone-100 text-xl md:text-2xl font-light italic leading-relaxed">
            "Nơi mỗi bữa cơm là một câu chuyện tình thân được viết bằng gia vị."
          </p>
          <a href="#menu" className="mt-12 inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 text-xs uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-stone-900 transition-all">
            Khám Phá Thực Đơn
          </a>
        </div>
      </header>

      {/* AI Recommender Section */}
      <section className="py-32 bg-[#f8f5f2] border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block p-3 bg-orange-100/50 rounded-full mb-6">
            <svg className="w-8 h-8 text-orange-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 italic">"Út Trinh ơi, nay ăn gì ngon?"</h2>
          <p className="text-stone-500 mb-12 text-lg">Hãy nói cho Út Trinh nghe tâm trạng của bạn hôm nay...</p>
          
          <form onSubmit={askChef} className="relative max-w-2xl mx-auto mb-12">
            <input 
              type="text" 
              placeholder="Ví dụ: Mình mới đi làm về hơi mệt, muốn ăn gì đó đậm đà..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-white border-b-2 border-stone-200 px-4 py-6 text-lg focus:outline-none focus:border-orange-900 transition-colors bg-transparent placeholder:text-stone-300"
            />
            <button 
              disabled={isAiLoading}
              className="absolute right-0 bottom-4 text-orange-900 font-bold uppercase text-xs tracking-widest hover:text-stone-900 transition-colors disabled:opacity-30"
            >
              {isAiLoading ? 'ĐANG ĐI CHỢ...' : 'HỎI NGAY'}
            </button>
          </form>

          {aiResult && (
            <div className="bg-white p-10 shadow-2xl rounded-sm animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col md:flex-row gap-10 items-center text-left border border-orange-100">
              {aiResult.dish ? (
                <div className="w-full md:w-1/3 aspect-square overflow-hidden rounded-sm">
                  <img src={aiResult.dish.image_url} className="w-full h-full object-cover" alt="Recommended" />
                </div>
              ) : null}
              <div className="flex-1">
                <span className="text-orange-800 font-bold uppercase text-[10px] tracking-[0.3em] mb-3 block">Gợi ý từ bếp trưởng</span>
                <h3 className="text-3xl font-serif text-stone-900 mb-4 underline decoration-orange-200 underline-offset-8">{aiResult.dishName}</h3>
                <p className="text-stone-600 text-lg leading-relaxed italic">"{aiResult.reason}"</p>
                <button 
                  onClick={() => aiResult.dish && setSelectedDish(aiResult.dish)}
                  className="mt-8 text-orange-900 font-bold text-xs uppercase tracking-widest border-b border-orange-900 pb-1 hover:text-stone-900 hover:border-stone-900 transition-all"
                >
                  Xem chi tiết món này
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Menu Section */}
      <main id="menu" className="py-32 max-w-7xl mx-auto px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-orange-800 text-[11px] tracking-[0.5em] uppercase font-bold mb-4 block">Seasonal Selection</span>
            <h2 className="text-5xl md:text-6xl font-serif text-stone-900 leading-tight">Thực Đơn <br/>Hôm Nay</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {['Tất cả', ...Object.values(Category)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-all border-b-2 ${
                  selectedCategory === cat 
                    ? 'text-orange-900 border-orange-900' 
                    : 'text-stone-400 border-transparent hover:text-stone-600 hover:border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredMenu.map(dish => (
            <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />
          ))}
        </div>
        
        <div className="mt-32 p-16 bg-stone-900 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-serif mb-6 italic">Quý khách cần đặt tiệc hoặc món riêng?</h3>
            <p className="text-stone-400 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
              Út Trinh luôn sẵn lòng chuẩn bị những mâm cơm đặc biệt theo yêu cầu riêng của gia đình bạn. Hãy liên hệ để chúng tôi phục vụ tốt nhất.
            </p>
            <a href="tel:0900000000" className="inline-block bg-orange-800 text-white px-12 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-stone-900 transition-all">
              Gửi yêu cầu đặt tiệc
            </a>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-900/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-[#121110] text-white py-32 mt-auto">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-serif text-orange-400 mb-8 tracking-widest uppercase">CƠM PHẦN ÚT TRINH</h2>
            <p className="text-stone-500 text-lg leading-relaxed italic max-w-md mb-8">
              "Chúng tôi không chỉ bán món ăn, chúng tôi gửi gắm cả nỗi nhớ quê nhà vào từng khay cơm mộc mạc."
            </p>
            <div className="flex gap-6">
              <div className="w-10 h-10 border border-stone-800 flex items-center justify-center hover:border-orange-400 transition-colors cursor-pointer">FB</div>
              <div className="w-10 h-10 border border-stone-800 flex items-center justify-center hover:border-orange-400 transition-colors cursor-pointer">IG</div>
              <div className="w-10 h-10 border border-stone-800 flex items-center justify-center hover:border-orange-400 transition-colors cursor-pointer">TT</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-orange-800 mb-8">Địa chỉ quán</h4>
            <div className="space-y-4 text-stone-400 text-sm leading-loose">
              <p>Chi nhánh 1: Quận 1, TP. HCM</p>
              <p>Chi nhánh 2: Sắp khai trương</p>
              <p className="pt-4 border-t border-stone-800">Email: info@comphanuttrinh.online</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-orange-800 mb-8">Vận hành</h4>
            <div className="space-y-4 text-stone-400 text-sm leading-loose">
              <p>Thứ 2 - Chủ Nhật</p>
              <p>Sáng: 08:00 - 14:00</p>
              <p>Chiều: 16:30 - 21:00</p>
              <p className="text-orange-200">Giao hàng tận nơi miễn phí bán kính 3km</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 mt-32 pt-12 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-stone-600 tracking-[0.3em] uppercase">
            © 2024 COM PHAN UT TRINH. CRAFTED FOR EXCELLENCE.
          </div>
          <div className="text-[9px] text-stone-800 tracking-widest uppercase flex gap-8">
            <a href="#" className="hover:text-stone-400">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-stone-400">Chính sách bảo mật</a>
          </div>
        </div>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />

      {/* Thêm style cho animation */}
      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
