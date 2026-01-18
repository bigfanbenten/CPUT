
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
    <div className="min-h-screen flex flex-col selection:bg-amber-100">
      {/* Thanh Điều Hướng */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold tracking-tighter text-stone-900 uppercase">Tinh Hoa Ẩm Thực</span>
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5"></div>
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-500">
            <a href="#menu" className="hover:text-amber-700 transition-colors">Thực Đơn</a>
            <a href="#about" className="hover:text-amber-700 transition-colors">Câu Chuyện</a>
            <a href="#contact" className="hover:text-amber-700 transition-colors">Liên Hệ</a>
          </div>
          <button className="bg-stone-900 text-white text-[10px] px-5 py-2.5 uppercase tracking-widest font-bold hover:bg-stone-800 transition-all rounded-sm hidden sm:block">
            Đặt Chỗ Ngay
          </button>
        </div>
      </nav>

      {/* Phần Giới Thiệu (Hero) */}
      <header className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920" 
          alt="Không gian nhà hàng"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-100 hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-8 block fade-in font-bold">Trải Nghiệm Đẳng Cấp 5 Sao</span>
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-10 leading-[1.1] fade-in">Nghệ Thuật Ẩm Thực Thuần Khiết</h1>
          <div className="w-32 h-[1px] bg-amber-400 mx-auto mb-10 fade-in"></div>
          <p className="text-stone-200 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto fade-in italic">
            "Nơi mỗi món ăn là một tuyệt tác, đánh thức mọi giác quan của bạn."
          </p>
        </div>
      </header>

      {/* Phần Gợi Ý AI */}
      <section className="py-32 bg-stone-50 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-stone-900 mb-6">Bạn đang muốn thưởng thức gì?</h2>
          <p className="text-stone-500 mb-12 text-lg">Hãy chia sẻ tâm trạng, Bếp trưởng AI sẽ gợi ý món quà vị giác dành riêng cho bạn.</p>
          
          <form onSubmit={handleAskChef} className="flex flex-col md:flex-row gap-4 mb-16">
            <input 
              type="text" 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Ví dụ: Tôi muốn một món ăn nhẹ nhàng, tốt cho sức khỏe..."
              className="flex-1 bg-white border border-stone-200 px-8 py-5 rounded-sm shadow-sm focus:outline-none focus:border-amber-700 transition-all text-stone-700"
            />
            <button 
              disabled={isAiLoading}
              className="bg-stone-900 text-white px-10 py-5 rounded-sm uppercase tracking-widest text-[11px] font-bold hover:bg-stone-800 shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isAiLoading ? 'Đang soạn thực đơn...' : 'Tham khảo Bếp Trưởng'}
            </button>
          </form>

          {aiRecommendation && (
            <div className="bg-white p-10 border border-amber-100 shadow-xl rounded-sm animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col md:flex-row gap-10 items-center text-left">
                <div className="w-full md:w-2/5 aspect-square overflow-hidden rounded-sm shadow-inner">
                  <img src={aiRecommendation.dish?.image_url} className="w-full h-full object-cover" alt="Gợi ý" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-[1px] bg-amber-600"></span>
                    <h4 className="text-amber-700 text-xs font-bold uppercase tracking-widest">Lựa chọn hoàn hảo</h4>
                  </div>
                  <h3 className="text-3xl font-serif text-stone-900 mb-6">{aiRecommendation.dish?.name}</h3>
                  <p className="text-stone-600 text-lg leading-relaxed italic mb-8">"{aiRecommendation.reason}"</p>
                  <div className="bg-stone-50 p-4 rounded-sm flex items-center gap-3 text-stone-700">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm">Gợi ý kết hợp: <span className="font-bold text-stone-900">{aiRecommendation.pairing}</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Danh Mục Thực Đơn */}
      <main id="menu" className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-amber-700 text-xs tracking-widest uppercase font-bold mb-4 block">Thưởng Lãm Thực Đơn</span>
          <h2 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6">Mỹ Vị Nhân Gian</h2>
          <p className="text-stone-500 max-w-2xl mx-auto font-light text-lg">
            Khám phá danh sách những món ăn tinh túy nhất được chọn lọc từ khắp nơi trên thế giới.
          </p>
        </div>

        {/* Bộ Lọc */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {['Tất cả', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-8 py-3 text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-500 rounded-full ${
                selectedCategory === cat 
                  ? 'bg-stone-900 text-white shadow-xl scale-105' 
                  : 'bg-white text-stone-400 hover:text-stone-900 border border-stone-200 hover:border-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lưới Món Ăn */}
        <div className="menu-grid">
          {filteredMenu.map(dish => (
            <MenuCard 
              key={dish.id} 
              dish={dish} 
              onClick={setSelectedDish} 
            />
          ))}
        </div>
        
        {filteredMenu.length === 0 && (
          <div className="text-center py-20 text-stone-400 italic">
            Hiện chưa có món ăn nào trong danh mục này.
          </div>
        )}
      </main>

      {/* Phần Giới Thiệu (About) */}
      <section id="about" className="py-32 bg-stone-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1550966841-3ee7adac169e?auto=format&fit=crop&q=80&w=800" 
                alt="Bếp trưởng làm việc"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-800/5 -z-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-stone-900/5 -z-10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative">
            <span className="text-amber-700 text-xs tracking-[0.3em] uppercase font-bold mb-6 block">Hành Trình Kiến Tạo</span>
            <h2 className="text-5xl font-serif text-stone-900 mb-10 leading-tight">Đam Mê Và Sự Hoàn Hảo Trong Từng Chi Tiết</h2>
            <div className="space-y-8 text-stone-600 text-lg leading-relaxed">
              <p>
                Nhà hàng của chúng tôi không chỉ là một nơi để ăn uống, mà là một không gian dành cho những ai trân trọng giá trị văn hóa ẩm thực và sự tinh tế trong đời sống.
              </p>
              <p>
                Với đội ngũ đầu bếp dày dặn kinh nghiệm, chúng tôi cam kết mang đến những hương vị nguyên bản nhưng vẫn đậm chất sáng tạo cá nhân.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-10 text-center border-t border-stone-200 mt-16 pt-12">
              <div>
                <p className="text-4xl font-serif text-stone-900 mb-2">2015</p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Thành Lập</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-stone-900 mb-2">12k+</p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Thành Viên</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-stone-900 mb-2">03</p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Chi Nhánh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chân Trang (Footer) */}
      <footer id="contact" className="bg-stone-900 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 pb-24 border-b border-stone-800">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-4xl font-serif mb-8 tracking-tighter">TINH HOA ẨM THỰC</h3>
              <p className="text-stone-400 max-w-sm mb-12 text-lg leading-relaxed">
                Đánh thức vị giác, kết nối tâm hồn qua những trải nghiệm ẩm thực không thể nào quên.
              </p>
              <div className="flex gap-6">
                {['FB', 'IG', 'YT'].map(social => (
                  <span key={social} className="text-xs tracking-widest text-stone-500 hover:text-amber-500 transition-colors cursor-pointer border-b border-stone-700 pb-1">{social}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-amber-500 mb-8">Địa Chỉ & Liên Hệ</h4>
              <ul className="space-y-5 text-stone-400 text-sm">
                <li className="flex gap-3">
                  <span className="text-stone-600">A:</span> 
                  88 Đường Nghệ Thuật, Quận 1, TP. HCM
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-600">T:</span> 
                  +84 28 8888 9999
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-600">E:</span> 
                  hello@tinhhoaamthuc.vn
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-amber-500 mb-8">Phục Vụ</h4>
              <ul className="space-y-5 text-stone-400 text-sm">
                <li>Thứ 2 - Thứ 6: 11:30 - 22:30</li>
                <li>Thứ 7 - Chủ Nhật: 10:00 - 23:00</li>
                <li className="text-amber-500 font-medium italic mt-6">Rất hân hạnh được đón tiếp.</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-stone-600 text-[10px] tracking-[0.2em] uppercase font-bold">
            <p>© {new Date().getFullYear()} TINH HOA ẨM THỰC RESTAURANT. THỰC ĐƠN SỐ CAO CẤP.</p>
            <p className="mt-4 md:mt-0">THIẾT KẾ BỞI CHUYÊN GIA PHÁT TRIỂN</p>
          </div>
        </div>
      </footer>

      {/* Các Cửa Sổ (Modal) */}
      <DishModal 
        dish={selectedDish} 
        onClose={() => setSelectedDish(null)} 
      />
    </div>
  );
};

export default App;
