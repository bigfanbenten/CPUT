
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Dish } from './types';
import { MENU_DATA as FALLBACK_DATA } from './constants';
import { MenuCard } from './components/MenuCard';
import { DishModal } from './components/DishModal';
import { getChefRecommendation } from './services/geminiService';
import { getDishes } from './services/supabaseService';

const App: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>(FALLBACK_DATA);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tất cả'>('Tất cả');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [mood, setMood] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDishes();
      if (data && data.length > 0) {
        setDishes(data);
      }
    };
    fetchData();
  }, []);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'Tất cả') return dishes;
    return dishes.filter(dish => dish.category === selectedCategory);
  }, [selectedCategory, dishes]);

  const handleAskChef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    
    setIsAiLoading(true);
    setAiRecommendation(null);
    try {
      const rec = await getChefRecommendation(mood, dishes);
      if (rec) {
        const fullDish = dishes.find(d => d.id === rec.dishId);
        setAiRecommendation({ ...rec, dish: fullDish });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-100">
      {/* Thanh Điều Hướng */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold tracking-tighter text-orange-800 uppercase">CƠM PHẦN ÚT TRINH</span>
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5"></div>
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-500">
            <a href="#menu" className="hover:text-orange-700 transition-colors">Thực Đơn</a>
            <a href="#about" className="hover:text-orange-700 transition-colors">Về Út Trinh</a>
            <a href="#contact" className="hover:text-orange-700 transition-colors">Liên Hệ</a>
          </div>
          <button className="bg-orange-800 text-white text-[10px] px-6 py-3 uppercase tracking-widest font-bold hover:bg-orange-900 transition-all rounded-sm hidden sm:block shadow-md">
            Đặt Bàn Ngay
          </button>
        </div>
      </nav>

      {/* Phần Giới Thiệu (Hero) */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920" 
          alt="Món ăn Việt Nam"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-100 hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-orange-400 text-xs tracking-[0.5em] uppercase mb-8 block fade-in font-bold">Hương Vị Cơm Nhà Nồng Nàn</span>
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-10 leading-[1.1] fade-in">Cơm Phần Út Trinh</h1>
          <div className="w-32 h-[1px] bg-orange-400 mx-auto mb-10 fade-in"></div>
          <p className="text-stone-200 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto fade-in italic">
            "Mỹ vị từ sự chân phương, đậm đà hồn quê Việt."
          </p>
        </div>
      </header>

      {/* Phần Gợi Ý AI */}
      <section className="py-24 bg-orange-50/30 border-y border-orange-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-4 text-orange-900">Hôm nay Út Trinh nấu món gì cho bạn?</h2>
          <p className="text-stone-500 mb-10">Chia sẻ tâm trạng, chúng tôi sẽ gợi ý bữa cơm phù hợp nhất.</p>
          
          <form onSubmit={handleAskChef} className="flex flex-col md:flex-row gap-3 mb-12">
            <input 
              type="text" 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Tôi muốn ăn món gì đó mặn mà đưa cơm..."
              className="flex-1 bg-white border border-orange-200 px-6 py-4 rounded-sm shadow-sm focus:outline-none focus:border-orange-700 transition-all text-stone-700"
            />
            <button 
              disabled={isAiLoading}
              className="bg-orange-800 text-white px-8 py-4 rounded-sm uppercase tracking-widest text-[11px] font-bold hover:bg-orange-900 shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isAiLoading ? 'Đang soạn món...' : 'Hỏi Ý Út Trinh'}
            </button>
          </form>

          {aiRecommendation && (
            <div className="bg-white p-8 border border-orange-100 shadow-xl rounded-sm animate-in slide-in-from-bottom-6 duration-700 text-left">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 aspect-square overflow-hidden rounded-sm">
                  <img src={aiRecommendation.dish?.image_url} className="w-full h-full object-cover" alt="Gợi ý" />
                </div>
                <div className="flex-1">
                  <h4 className="text-orange-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Lựa chọn của nhà bếp</h4>
                  <h3 className="text-2xl font-serif text-stone-900 mb-4">{aiRecommendation.dish?.name}</h3>
                  <p className="text-stone-600 leading-relaxed italic mb-6">"{aiRecommendation.reason}"</p>
                  <div className="text-sm text-stone-500">
                    <span className="font-bold text-orange-800">Kết hợp cùng:</span> {aiRecommendation.pairing}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Thực Đơn Chính */}
      <main id="menu" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-orange-700 text-xs tracking-widest uppercase font-bold mb-4 block">Thực Đơn Hằng Ngày</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">Món Ngon Út Trinh</h2>
          <div className="w-16 h-1 bg-orange-700 mx-auto"></div>
        </div>

        {/* Bộ Lọc */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300 rounded-sm border ${
                selectedCategory === cat 
                  ? 'bg-orange-800 text-white border-orange-800 shadow-md' 
                  : 'bg-white text-stone-400 border-stone-100 hover:border-orange-800 hover:text-orange-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredMenu.map(dish => (
            <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />
          ))}
        </div>
      </main>

      {/* Về Út Trinh */}
      <section id="about" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1528605248644-14dd04cb11c7?auto=format&fit=crop&q=80&w=800" alt="Không gian Út Trinh" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-orange-700 text-xs tracking-widest uppercase font-bold mb-4 block">Về Cơm Phần Út Trinh</span>
            <h2 className="text-4xl font-serif text-stone-900 mb-8">Gìn Giữ Bản Sắc Cơm Nhà</h2>
            <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
              <p>Út Trinh ra đời từ tâm huyết muốn mang đến những bữa cơm phần đúng nghĩa, nơi mỗi thực khách có thể cảm nhận được sự ấm áp như đang ngồi tại chính gian bếp của gia đình.</p>
              <p>Chúng tôi tập trung vào nguồn nguyên liệu tươi sạch hằng ngày và cách chế biến đậm đà, không cầu kỳ nhưng cực kỳ tinh tế.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chân Trang */}
      <footer id="contact" className="bg-stone-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pb-16 border-b border-stone-800">
            <div>
              <h3 className="text-3xl font-serif mb-6 text-orange-400 tracking-tighter uppercase">Cơm Phần Út Trinh</h3>
              <p className="text-stone-400 leading-relaxed">Đậm đà phong vị Việt, tinh tế trong từng khay cơm.</p>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-orange-500 mb-6">Liên Hệ</h4>
              <p className="text-stone-400 text-sm mb-2">Quận 1, TP. Hồ Chí Minh</p>
              <p className="text-stone-400 text-sm">+84 000 000 000</p>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-orange-500 mb-6">Thời Gian</h4>
              <p className="text-stone-400 text-sm">Thứ 2 - Chủ Nhật: 10:00 - 21:00</p>
            </div>
          </div>
          <div className="mt-10 text-center text-stone-600 text-[10px] tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} CƠM PHẦN ÚT TRINH. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
};

export default App;
