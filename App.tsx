
import React, { useState, useMemo } from 'react';
import { Category, Dish } from './types.ts';
import { MENU_DATA } from './constants.tsx';
import { MenuCard } from './components/MenuCard.tsx';
import { DishModal } from './components/DishModal.tsx';
import { getChefRecommendation } from './services/geminiService.ts';

const App: React.FC = () => {
  const [dishes] = useState<Dish[]>(MENU_DATA);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tất cả'>('Tất cả');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [mood, setMood] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

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
      console.error("AI Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-serif font-bold text-orange-900 uppercase tracking-tighter">CƠM PHẦN ÚT TRINH</span>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          </div>
          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-bold text-stone-500">
            <a href="#menu" className="hover:text-orange-700 transition-colors">Thực Đơn</a>
            <a href="#" className="hover:text-orange-700 transition-colors">Về Chúng Tôi</a>
            <a href="#" className="hover:text-orange-700 transition-colors">Liên Hệ</a>
          </div>
          <button className="bg-orange-800 text-white text-[10px] px-5 py-3 uppercase tracking-widest font-bold hover:bg-orange-900 transition-all rounded-sm shadow-md">
            Đặt Giao Hàng
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-stone-900">
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920" 
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-6">
          <span className="text-orange-400 text-xs tracking-[0.4em] uppercase mb-4 block font-bold">Tinh hoa ẩm thực Việt</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-6">Hương Vị Cơm Nhà</h1>
          <p className="text-stone-200 text-lg md:text-xl font-light italic max-w-2xl mx-auto">
            "Mỗi món ăn là một câu chuyện tình thân, được nấu bằng cả trái tim."
          </p>
        </div>
      </header>

      {/* AI Recommendation Section */}
      <section className="py-20 bg-orange-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-stone-900 mb-2">Bạn đang thèm vị gì?</h2>
            <p className="text-stone-500">Hãy nói cho Út Trinh nghe cảm xúc của bạn</p>
          </div>
          
          <form onSubmit={handleAskChef} className="flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Ví dụ: Mình đang buồn, muốn ăn món gì đó cay nồng..."
              className="flex-1 bg-white border border-stone-200 px-6 py-4 rounded-sm shadow-sm focus:outline-none focus:border-orange-700 transition-all"
            />
            <button 
              disabled={isAiLoading}
              className="bg-orange-900 text-white px-8 py-4 rounded-sm uppercase tracking-widest text-xs font-bold hover:bg-black transition-all disabled:opacity-50"
            >
              {isAiLoading ? 'Đang suy nghĩ...' : 'Gợi ý cho tôi'}
            </button>
          </form>

          {aiRecommendation && aiRecommendation.dish && (
            <div className="mt-10 bg-white p-6 md:p-10 border border-orange-100 shadow-xl rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-40 aspect-square rounded-sm overflow-hidden">
                  <img src={aiRecommendation.dish.image_url} className="w-full h-full object-cover" alt="Suggest" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-orange-800 text-[10px] font-bold uppercase tracking-widest mb-2">Út Trinh gợi ý</h4>
                  <h3 className="text-2xl font-serif text-stone-900 mb-3">{aiRecommendation.dish.name}</h3>
                  <p className="text-stone-600 italic mb-4">"{aiRecommendation.reason}"</p>
                  <p className="text-sm text-stone-500">Dùng kèm tốt nhất với: <span className="text-orange-800 font-bold">{aiRecommendation.pairing}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Section */}
      <main id="menu" className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-stone-900 mb-4">Thực Đơn Út Trinh</h2>
          <div className="w-20 h-1 bg-orange-800 mx-auto"></div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-6 py-2 text-[10px] tracking-widest uppercase font-bold transition-all border ${
                selectedCategory === cat 
                  ? 'bg-orange-900 text-white border-orange-900' 
                  : 'bg-white text-stone-500 border-stone-200 hover:border-orange-900 hover:text-orange-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenu.map(dish => (
            <MenuCard key={dish.id} dish={dish} onClick={setSelectedDish} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif mb-4 text-orange-400">CƠM PHẦN ÚT TRINH</h2>
          <p className="text-stone-500 text-xs tracking-widest uppercase">Đậm đà phong vị Việt - Thơm ngon chuẩn cơm nhà</p>
          <div className="mt-10 border-t border-stone-800 pt-10 text-stone-600 text-[10px] uppercase tracking-widest">
            © 2024 Cơm Phần Út Trinh. All Rights Reserved.
          </div>
        </div>
      </footer>

      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
};

export default App;
