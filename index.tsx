
/**
 * BẢN SAVE SỐ 3 - PHIÊN BẢN HOÀN THIỆN GUESTBOOK & THỐNG KÊ ĐỒNG BỘ
 * -------------------------------------------------------
 * Các tính năng đã tích hợp:
 * 1. Hiển thị món ăn RANDOM (ngẫu nhiên) mỗi khi tải trang hoặc đổi danh mục.
 * 2. Tự động chuyển món trong Modal (10 giây/lần) với hiệu ứng mờ ảo và thanh tiến trình.
 * 3. Hệ thống thông báo ĐỘNG (Dynamic Notifications):
 *    - Quản lý tại #ACP1122: Tạo mới, Bật/Tắt bằng cần gạt, Xóa thông báo.
 *    - Cho phép tùy chỉnh Lời chúc/Ghi chú màu vàng ở chân thông báo.
 *    - Hiển thị tự động thông báo mới nhất đang "Bật" trên trang chủ.
 * 4. Quản lý thực đơn nâng cao:
 *    - Chọn tất cả & Xóa hàng loạt món ăn.
 *    - Cơ chế Đồng bộ an toàn (Safe Sync) chống trùng lặp dữ liệu.
 * 5. Tính năng CHỌN MÓN NHANH (Quick Select):
 *    - Sơ đồ nhánh chuyên nghiệp (Thịt, Cá, Canh...).
 *    - Tự động lấy dữ liệu từ Supabase `quick_menu`.
 *    - UX Refinement: "BẠN CÓ MUỐN CHỌN ?" & Nút QUAY LẠI màu vàng nổi bật.
 * 6. Giỏ hàng thông minh (Shopping Cart):
 *    - Lưu trữ Cookie trong 1 giờ.
 *    - Tự động cộng tiền, quản lý số lượng món.
 *    - Modal thông báo hướng dẫn đặt hàng chi tiết & Ghi chú giả lập (Pre-Order).
 * 7. Quản lý CHỌN NHANH tại #ACP1122 (NÂNG CẤP):
 *    - Giao diện Thư mục thu gọn (Collapsible Tree) như Windows Explorer.
 *    - Cho phép sửa Tên món và Giá tiền trực tiếp.
 *    - Nút "LƯU TẤT CẢ" giúp lưu hàng loạt thay đổi nhanh chóng, không bị giật trang.
 * 8. Tối ưu hóa Đa nền tảng (Responsive Design):
 *    - Hotline hiển thị ngay dưới Logo trên điện thoại.
 *    - Menu trực tiếp (Thực đơn, Chọn món nhanh) thay thế Hamburger menu trên Mobile.
 *    - Modal "Chọn món nhanh" được thu nhỏ và tinh chỉnh font chữ cho điện thoại.
 * 9. Tính năng GÓP Ý & LỜI CHÚC (Guestbook) NÂNG CAO:
 *    - Khách gửi: Tên, SĐT, Nội dung.
 *    - Hiển thị 5 lời chúc mới nhất với màu sắc rực rỡ (Xanh, Đỏ, Cam, Tím...).
 *    - Bảo mật: Số điện thoại được che (0939xxx123) để đảm bảo tính minh bạch mà vẫn an toàn.
 *    - Tính năng "Xem tất cả" / "Thu gọn" danh sách góp ý.
 *    - Quản trị viên duyệt tại #ACP1122 mới được hiển thị.
 * 10. Hệ thống THỐNG KÊ ĐỒNG NHẤT:
 *    - Lượt xem (Visitor) được đồng bộ qua Supabase `site_stats`, thống nhất trên mọi thiết bị.
 *    - Đếm số người đang Online thời gian thực.
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ChevronRight, ChevronDown, UtensilsCrossed, ShoppingBag, Trash2, Plus, Minus, MessageSquare, CheckCircle2, Facebook, Mail, Twitter, Instagram, Youtube } from 'lucide-react';

// --- CẤU HÌNH CỐ ĐỊNH ---
const DEFAULT_URL = 'https://qrzfpeeuohzfquzfiebc.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemZwZWV1b2h6ZnF1emZpZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY4MDgsImV4cCI6MjA4NDMyMjgwOH0.tyzhzbucriL09bH-ndgXs3ob1-Www97vsfQ6Wsh8d7s';

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
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: Category;
}

interface HeroSlide {
  id: string;
  image_url: string;
  quote: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  phone: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

const CONFIG_KEY = 'ut-trinh-config-v9';
const VIEW_COUNT_KEY = 'ut-trinh-total-views-v15';
const SESSION_VISIT_KEY = 'ut-trinh-session-visited-v15';
const CART_KEY = 'ut-trinh-cart-v1';
const SHOPEE_LOGO = 'https://i.postimg.cc/Wzj6yWrp/pngtree-shopefood-logo-png-image-6472274.png';
const GUESTBOOK_COLORS = [
  { avatar: 'bg-emerald-100 text-emerald-800', content: 'text-emerald-600', border: 'border-emerald-100', bg: 'bg-emerald-50/30' },
  { avatar: 'bg-rose-100 text-rose-800', content: 'text-rose-600', border: 'border-rose-100', bg: 'bg-rose-50/30' },
  { avatar: 'bg-orange-100 text-orange-800', content: 'text-orange-600', border: 'border-orange-100', bg: 'bg-orange-50/30' },
  { avatar: 'bg-sky-100 text-sky-800', content: 'text-sky-600', border: 'border-sky-100', bg: 'bg-sky-50/30' },
  { avatar: 'bg-violet-100 text-violet-800', content: 'text-violet-600', border: 'border-violet-100', bg: 'bg-violet-50/30' },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addedAt: number;
}

interface QuickMenuItem {
  name: string;
  price?: number;
  children?: QuickMenuItem[];
}

// --- COMPONENTS ---

const Nav = ({ isAdmin = false, onShowQuickSelect, cartCount, onShowCart }: any) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[80] bg-white/95 backdrop-blur-xl border-b border-stone-100 px-2 md:px-20 h-24 md:h-32 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2 md:gap-6 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <img 
            src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" 
            alt="Logo Út Trinh" 
            className="w-10 h-10 md:w-24 md:h-24 object-contain shrink-0 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="flex flex-col justify-center">
            <div className="flex flex-col whitespace-nowrap">
              <div className="flex items-center gap-1">
                <span className="text-[11px] md:text-3xl lg:text-4xl font-black text-amber-700 uppercase tracking-tighter leading-none">CƠM PHẦN</span>
                <span className="text-[11px] md:text-3xl lg:text-4xl font-black text-stone-900 uppercase tracking-tighter leading-none">ÚT TRINH</span>
              </div>
              <span className="text-[7px] md:text-xs lg:text-sm font-black text-red-600 uppercase tracking-widest animate-pulse mt-0.5 md:mt-1">
                Đặt món ngay : 0939.70.90.20
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 md:gap-8 items-center flex-1 justify-end md:justify-start">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className="bg-amber-800 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all">Thoát Quản Trị</button>
          ) : (
            <>
              <div className="flex items-center gap-2 md:gap-8 flex-1 justify-center">
                <a href="#menu" className="text-stone-900 text-[8px] md:text-xs font-black uppercase tracking-widest hover:text-amber-700 whitespace-nowrap">THỰC ĐƠN</a>
                <button 
                  onClick={onShowQuickSelect} 
                  className="text-stone-900 text-[8px] md:text-xs font-black uppercase tracking-widest hover:text-amber-700 whitespace-nowrap"
                >
                  CHỌN MÓN NHANH
                </button>
                <button 
                  onClick={() => setShowConciseMenu(true)} 
                  className="hidden xl:block bg-amber-800 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-stone-900 transition-all"
                >
                  MENU ẢNH
                </button>
              </div>
              
              <button 
                onClick={onShowCart}
                className="relative p-2 md:p-3 bg-stone-100 rounded-full hover:bg-amber-100 transition-colors group"
              >
                <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-stone-900 group-hover:text-amber-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2 md:gap-4 border-l border-stone-100 pl-4">
                <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-6 md:h-12 object-contain rounded-sm" alt="Grab" />
                <img src={SHOPEE_LOGO} className="h-6 md:h-12 object-contain" alt="Shopee" />
              </div>
            </>
          )}
        </div>
      </nav>

      {showConciseMenu && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-950/95 backdrop-blur-2xl p-4" onClick={() => setShowConciseMenu(false)}>
          <img src="https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg" className="max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20" alt="Menu" />
          <button className="absolute top-5 right-5 text-white text-5xl hover:scale-120 transition-transform">×</button>
        </div>
      )}
    </>
  );
};

const HomePage = ({ menu, heroSlides, isLoading, supabase }: any) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>(Category.All);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTetPopup, setShowTetPopup] = useState(false);
  const [activeNotif, setActiveNotif] = useState<any>(null);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);
  const [quickSelectPath, setQuickSelectPath] = useState<QuickMenuItem[]>([]);
  const [quickMenuData, setQuickMenuData] = useState<QuickMenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestContent, setGuestContent] = useState('');
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false);
  const itemsPerPage = 9;

  // Fetch Quick Menu from Supabase
  useEffect(() => {
    const fetchQuick = async () => {
      const { data } = await supabase.from('quick_menu').select('*').order('sort_order', { ascending: true });
      if (data) {
        // Build tree structure
        const buildTree = (items: any[], parentId: string | null = null): QuickMenuItem[] => {
          return items
            .filter(item => item.parent_id === parentId)
            .map(item => ({
              ...item,
              children: buildTree(items, item.id)
            }));
        };
        setQuickMenuData(buildTree(data));
      }
    };
    fetchQuick();
  }, [supabase, showQuickSelect]);

  // Cart Persistence Logic (1 hour expiry)
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      const parsedCart: CartItem[] = JSON.parse(savedCart);
      const now = Date.now();
      const validItems = parsedCart.filter(item => now - item.addedAt < 60 * 60 * 1000);
      setCart(validItems);
      if (validItems.length !== parsedCart.length) {
        localStorage.setItem(CART_KEY, JSON.stringify(validItems));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Fetch Approved Guestbook Entries
  useEffect(() => {
    const fetchGuestbook = async () => {
      const { data } = await supabase
        .from('guestbook')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (data) setGuestbookEntries(data);
    };
    fetchGuestbook();
  }, [supabase]);

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestContent) {
      alert('Vui lòng nhập Tên và Nội dung góp ý nhé!');
      return;
    }
    setIsSubmittingGuestbook(true);
    try {
      const { error } = await supabase.from('guestbook').insert([
        { name: guestName, phone: guestPhone, content: guestContent, is_approved: false }
      ]);
      if (error) throw error;
      alert('Cảm ơn bạn đã góp ý! Lời chúc của bạn đang được chờ duyệt để hiển thị lên website nhé.');
      setGuestName('');
      setGuestPhone('');
      setGuestContent('');
    } catch (err: any) {
      console.error('Guestbook error:', err);
      alert('Có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại sau!');
    } finally {
      setIsSubmittingGuestbook(false);
    }
  };

  const addToCart = (name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === name);
      if (existing) {
        return prev.map(item => item.name === name ? { ...item, quantity: item.quantity + 1, addedAt: Date.now() } : item);
      }
      return [...prev, { id: Math.random().toString(36).substr(2, 9), name, price, quantity: 1, addedAt: Date.now() }];
    });
    alert(`Đã thêm "${name}" vào giỏ hàng!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchActiveNotif = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setActiveNotif(data);
        setShowTetPopup(true);
      }
    };
    fetchActiveNotif();
  }, [supabase]);

  const [totalViews, setTotalViews] = useState(300);
  const [onlineCount, setOnlineCount] = useState(1);
  const [showAllGuestbook, setShowAllGuestbook] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total views from Supabase
      const { data, error } = await supabase.from('site_stats').select('total_views').eq('id', 1).single();
      
      if (error) {
        console.warn("Table 'site_stats' not found. Using local storage fallback.");
        const savedViews = localStorage.getItem(VIEW_COUNT_KEY);
        let currentViews = savedViews ? parseInt(savedViews) : 300;
        const sessionVisited = sessionStorage.getItem(SESSION_VISIT_KEY);
        if (!sessionVisited) {
          currentViews += 1;
          localStorage.setItem(VIEW_COUNT_KEY, currentViews.toString());
          sessionStorage.setItem(SESSION_VISIT_KEY, 'true');
        }
        setTotalViews(currentViews);
      } else if (data) {
        let currentViews = data.total_views;
        const sessionVisited = sessionStorage.getItem(SESSION_VISIT_KEY);
        if (!sessionVisited) {
          currentViews += 1;
          // Increment in Supabase
          await supabase.from('site_stats').update({ total_views: currentViews }).eq('id', 1);
          sessionStorage.setItem(SESSION_VISIT_KEY, 'true');
        }
        setTotalViews(currentViews);
      }
    };

    fetchStats();

    const channel = supabase.channel('online-users', { config: { presence: { key: 'user' } } });
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      setOnlineCount(count > 0 ? count : 1);
    }).subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString(), user_id: Math.random().toString(36).substr(2, 9) });
      }
    });
    return () => { channel.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (!heroSlides.length) return;
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  // Logic hiển thị ngẫu nhiên (Random)
  const filteredMenu = useMemo(() => {
    const list = activeFilter === Category.All ? [...menu] : menu.filter(d => d.category === activeFilter);
    return list.sort(() => Math.random() - 0.5);
  }, [menu, activeFilter]);

  // Tự động chuyển món trong Modal mỗi 10 giây
  useEffect(() => {
    if (selectedIdx === null || filteredMenu.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedIdx(prev => (prev !== null ? (prev + 1) % filteredMenu.length : null));
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedIdx, filteredMenu.length]);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const paginatedMenu = useMemo(() => filteredMenu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredMenu, currentPage]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const selectedDish = selectedIdx !== null ? filteredMenu[selectedIdx] : null;

  const currentQuickOptions = quickSelectPath.length === 0 
    ? quickMenuData 
    : quickSelectPath[quickSelectPath.length - 1].children || [];

  const calculateTotalPrice = () => {
    let total = 0;
    quickSelectPath.forEach(item => {
      if (item.price) total = item.price; // Lấy giá của cấp cao nhất có giá
    });
    // Nếu món cuối cùng có giá riêng thì lấy giá đó
    const lastItem = quickSelectPath[quickSelectPath.length - 1];
    if (lastItem?.price) total = lastItem.price;
    return total;
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Nav 
        onShowQuickSelect={() => setShowQuickSelect(true)} 
        cartCount={cartCount}
        onShowCart={() => setShowCart(true)}
      />
      
      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[160] flex items-center justify-end bg-stone-950/60 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-amber-800" />
                <h2 className="text-xl font-black uppercase tracking-tighter">GIỎ HÀNG CỦA BẠN</h2>
              </div>
              <button onClick={() => setShowCart(false)} className="text-3xl text-stone-300 hover:text-stone-900">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-stone-400 font-bold">Giỏ hàng đang trống.<br/>Hãy chọn món ngay!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-black text-stone-900 uppercase text-sm tracking-tight">{item.name}</h4>
                      <p className="text-amber-800 font-black text-xs">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"><Minus size={14}/></button>
                      <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-100 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">TỔNG CỘNG</span>
                <span className="text-3xl font-black text-amber-800 tabular-nums">{cartTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <button 
                onClick={() => { setShowOrderConfirmModal(true); setShowCart(false); }}
                className="w-full bg-stone-900 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-amber-800 transition-all shadow-xl"
              >
                XÁC NHẬN ĐƠN HÀNG
              </button>
              <p className="text-[9px] text-stone-400 font-bold italic leading-relaxed text-center pt-2">
                Lưu ý: đây là chức năng giả lập chứ không phải đặt hàng Online hoặc đặt qua Apps các bạn nhé, nhưng các bạn cứ thoải mái chọn món cho vào giỏ hàng theo túi ví của mình rồi Alo theo số Hotline để các bạn tự lại quán lấy nhé ( Pre-Order ) !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Select Modal */}
      {showQuickSelect && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl p-2 md:p-4" onClick={() => { setShowQuickSelect(false); setQuickSelectPath([]); }}>
          <div className="bg-white w-full max-w-4xl rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 md:p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div className="space-y-1">
                <h2 className="text-base md:text-2xl font-black uppercase tracking-tighter text-stone-900">CHỌN MÓN NHANH</h2>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <button onClick={() => setQuickSelectPath([])} className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-amber-800 hover:underline">BẮT ĐẦU</button>
                  {quickSelectPath.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-stone-300">/</span>
                      <button 
                        onClick={() => setQuickSelectPath(quickSelectPath.slice(0, idx + 1))}
                        className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-stone-900 whitespace-nowrap"
                      >
                        {item.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <button onClick={() => { setShowQuickSelect(false); setQuickSelectPath([]); }} className="text-2xl md:text-4xl text-stone-300 hover:text-stone-900 transition-colors">×</button>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
              {currentQuickOptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {currentQuickOptions.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setQuickSelectPath([...quickSelectPath, option])}
                      className="group p-4 md:p-6 border border-stone-100 rounded-2xl md:rounded-3xl hover:border-amber-800 hover:bg-amber-50/30 transition-all text-left flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <span className="text-sm md:text-lg font-black uppercase tracking-tighter text-stone-900 group-hover:text-amber-800">{option.name}</span>
                        {option.price && option.price > 0 ? (
                          <p className="text-amber-800 font-black text-xs md:text-sm">{option.price.toLocaleString('vi-VN')} VNĐ</p>
                        ) : null}
                      </div>
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-stone-300 group-hover:text-amber-800 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-12 space-y-4 md:space-y-8">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-800">
                    <UtensilsCrossed size={30} />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-stone-900">BẠN CÓ MUỐN CHỌN ?</h3>
                    <p className="text-stone-500 italic text-sm md:text-lg">
                      {quickSelectPath.map(i => i.name).join(' - ')}
                    </p>
                  </div>
                  <div className="text-3xl md:text-5xl font-black text-amber-800 tabular-nums">
                    {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="pt-4 md:pt-8 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <button 
                      onClick={() => { 
                        const name = quickSelectPath.map(i => i.name).join(' - ');
                        const price = calculateTotalPrice();
                        addToCart(name, price);
                        setShowQuickSelect(false);
                        setQuickSelectPath([]);
                      }}
                      className="bg-amber-800 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] hover:bg-stone-900 transition-all shadow-xl"
                    >
                      THÊM VÀO GIỎ
                    </button>
                    <button 
                      onClick={() => { setShowQuickSelect(false); setQuickSelectPath([]); }}
                      className="bg-stone-100 text-stone-900 px-8 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] hover:bg-stone-200 transition-all"
                    >
                      CHỌN LẠI
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {quickSelectPath.length > 0 && (
              <div className="p-4 md:p-6 bg-stone-50 border-t border-stone-100 flex justify-center">
                <button 
                  onClick={() => setQuickSelectPath(quickSelectPath.slice(0, -1))} 
                  className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-amber-500 hover:text-amber-700 transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="rotate-180" size={14} />
                  QUAY LẠI
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Order Confirmation Custom Modal */}
      {showOrderConfirmModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4" onClick={() => setShowOrderConfirmModal(false)}>
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 md:p-16 relative overflow-hidden text-center border-t-[12px] border-amber-600 animate-[popIn_0.5s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowOrderConfirmModal(false)} className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 text-4xl transition-all">×</button>
            <div className="space-y-8">
              <span className="text-amber-600 font-black text-xs md:text-sm tracking-[0.6em] uppercase block">Xác nhận đơn hàng</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-stone-900 leading-tight">CẢM ƠN BẠN!</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
              <p className="text-stone-600 text-lg md:text-xl font-bold leading-relaxed">
                Cảm ơn bạn đã chọn món! Đây là chức năng tính món theo ví nên Quán không thể giao hàng cho bạn được.
              </p>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-amber-900 text-base md:text-lg font-black leading-relaxed">
                  Bạn có thể đặt hàng bằng cách gọi <span className="text-2xl block mt-2">0939.70.90.20</span>
                  <span className="text-sm block mt-2 opacity-70">Để LIỆT KÊ những món bạn đặt và vui lòng lại quán nhận đơn hàng nhé!</span>
                </p>
              </div>
              <button onClick={() => setShowOrderConfirmModal(false)} className="bg-stone-900 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-600 transition-all shadow-xl">ĐÃ HIỂU</button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Notification Popup */}
      {showTetPopup && activeNotif && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 md:p-16 relative overflow-hidden text-center border-t-[12px] border-amber-600 animate-[popIn_0.5s_ease-out]">
            <button onClick={() => setShowTetPopup(false)} className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 text-4xl transition-all">×</button>
            <div className="space-y-8">
              <span className="text-amber-600 font-black text-xs md:text-sm tracking-[0.6em] uppercase block">Thông báo từ quán</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-stone-900 leading-tight">THÔNG BÁO</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
              <p className="text-stone-600 text-lg md:text-2xl font-bold leading-relaxed whitespace-pre-line">
                {activeNotif.message}
              </p>
              <div className="pt-6">
                <p className="text-amber-600 text-sm md:text-lg italic font-black uppercase tracking-wide">
                  {activeNotif.footer || "XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI."}
                </p>
              </div>
              <button onClick={() => setShowTetPopup(false)} className="bg-stone-900 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-600 transition-all shadow-xl">ĐÃ HIỂU</button>
            </div>
          </div>
          <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        </div>
      )}

      {/* Hero */}
      <header className="relative h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide: HeroSlide, index: number) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <img src={slide.image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/20 to-stone-950/80"></div>
          </div>
        ))}
        <div className="relative z-20 text-center px-6 max-w-5xl pt-24">
          <span className="text-amber-400 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-6 block animate-pulse">Tinh hoa ẩm thực Việt</span>
          <h1 className="text-white text-5xl md:text-[130px] font-black tracking-tighter leading-none mb-8 drop-shadow-2xl">ÚT TRINH<br/><span className="text-amber-500 italic">KITCHEN</span></h1>
          <p className="text-white/90 text-lg md:text-3xl font-light italic leading-relaxed">"{heroSlides[currentSlide]?.quote || 'Nơi lưu giữ hương vị cơm nhà truyền thống'}"</p>
        </div>
      </header>

      {/* Menu List */}
      <main id="menu" className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase text-stone-900">Món Ăn Đặc Sắc</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 border-b border-stone-100 pb-8">
            {Object.values(Category).map((cat) => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${activeFilter === cat ? 'border-amber-800 text-amber-800' : 'border-transparent text-stone-300 hover:text-stone-900'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {paginatedMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedIdx(filteredMenu.findIndex(d => d.id === dish.id))} className="bg-white rounded-[40px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-700 cursor-pointer group p-6">
              <div className="aspect-square rounded-[35px] overflow-hidden mb-8 relative">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute top-5 right-5 bg-stone-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{dish.category}</div>
              </div>
              <div className="px-2 space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                  <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tighter leading-tight group-hover:text-amber-800 transition-colors">{dish.name}</h3>
                  <span className="text-amber-800 font-black text-2xl tracking-tighter">{dish.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic line-clamp-2">"{dish.description || 'Hương vị gia truyền đậm đà.'}"</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); document.getElementById('menu')?.scrollIntoView(); }} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 hover:text-white transition-all font-bold">←</button>
            <span className="text-stone-400 font-black tracking-widest text-[10px] uppercase">Trang {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); document.getElementById('menu')?.scrollIntoView(); }} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center disabled:opacity-30 hover:bg-stone-900 hover:text-white transition-all font-bold">→</button>
          </div>
        )}
      </main>

      {/* Dish Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl" onClick={() => setSelectedIdx(null)}>
          <div key={selectedDish.id} className="w-full h-full md:w-[90vw] md:h-[85vh] bg-white md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative transition-all duration-1000 animate-[fadeIn_0.8s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedIdx(null)} className="absolute top-8 right-8 z-[190] text-stone-300 hover:text-stone-900 text-5xl transition-all">×</button>
            <div className="w-full h-[40vh] md:h-auto md:w-[55%] bg-black overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover animate-[scaleSlow_10s_linear_infinite]" />
            </div>
            <div className="flex-1 p-12 md:p-20 flex flex-col justify-center bg-white space-y-8">
              <span className="text-amber-800 font-black uppercase tracking-[0.5em] text-[10px]">Út Trinh Kitchen</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-stone-900">{selectedDish.name}</h2>
              <div className="text-4xl md:text-6xl font-black text-amber-800 tabular-nums">{selectedDish.price}</div>
              <p className="text-stone-500 text-lg md:text-xl italic font-light leading-relaxed max-w-lg">"{selectedDish.description || 'Món ăn truyền thống chuẩn vị mẹ nấu.'}"</p>
              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={() => {
                    const priceNum = parseInt(selectedDish.price.replace(/\D/g, ''));
                    addToCart(selectedDish.name, priceNum);
                    setSelectedIdx(null);
                  }}
                  className="bg-amber-800 text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-stone-900 transition-all shadow-xl shadow-amber-900/10 active:scale-95"
                >
                  THÊM VÀO GIỎ
                </button>
                <span className="bg-stone-100 text-stone-900 px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] self-start">{selectedDish.category}</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-amber-800/30 w-full">
              <div key={`progress-${selectedDish.id}`} className="h-full bg-amber-800 animate-[progress_10s_linear_forwards]"></div>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            @keyframes scaleSlow { from { transform: scale(1); } to { transform: scale(1.1); } }
            @keyframes progress { from { width: 0%; } to { width: 100%; } }
            @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
            .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
          `}</style>
        </div>
      )}

      {/* Guestbook Section */}
      <section className="bg-stone-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-amber-800 font-black uppercase tracking-[0.4em] text-[10px]">Kết nối với quán</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-stone-900">GÓP Ý & LỜI CHÚC</h2>
              <p className="text-stone-500 italic">"Mọi ý kiến đóng góp của quý khách là động lực để Út Trinh hoàn thiện hơn mỗi ngày."</p>
            </div>

            <form onSubmit={handleGuestbookSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-stone-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Họ và Tên</label>
                  <input 
                    type="text" 
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Nội dung góp ý / Lời chúc</label>
                <textarea 
                  rows={4}
                  value={guestContent}
                  onChange={e => setGuestContent(e.target.value)}
                  placeholder="Nhập nội dung tại đây..."
                  className="w-full bg-stone-50 border-none rounded-3xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmittingGuestbook}
                className="w-full bg-stone-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmittingGuestbook ? 'ĐANG GỬI...' : (
                  <>
                    <MessageSquare size={16} />
                    GỬI GÓP Ý NGAY
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Entries List */}
          <div className="space-y-10 flex flex-col">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900">Lời chúc mới nhất</h3>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto max-h-[600px] pr-4 no-scrollbar">
              {guestbookEntries.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 bg-white rounded-[40px] border border-dashed border-stone-200">
                  <MessageSquare size={40} className="text-stone-200" />
                  <p className="text-stone-300 font-bold italic">Chưa có lời chúc nào được hiển thị.<br/>Hãy là người đầu tiên nhé!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {guestbookEntries.slice(0, showAllGuestbook ? undefined : 5).map((entry, index) => {
                      const colorSet = GUESTBOOK_COLORS[index % GUESTBOOK_COLORS.length];
                      const maskedPhone = (() => {
                        if (!entry.phone || entry.phone.trim() === '') {
                          // Generate a stable random number based on entry ID if possible, 
                          // but for simplicity a random one is fine as it's just for display
                          const seed = entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                          const randomSuffix = 100 + (seed % 900);
                          return `093xxxx${randomSuffix}`;
                        }
                        const cleanPhone = entry.phone.replace(/\D/g, '');
                        const prefix = cleanPhone.length >= 4 ? cleanPhone.substring(0, 4) : '0939';
                        const suffix = cleanPhone.length >= 3 ? cleanPhone.substring(cleanPhone.length - 3) : '***';
                        return `${prefix}xxx${suffix}`;
                      })();

                      return (
                        <div 
                          key={entry.id} 
                          className={`p-8 rounded-[35px] shadow-sm border space-y-4 hover:shadow-md transition-all group ${colorSet.border} ${colorSet.bg}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase ${colorSet.avatar}`}>
                                {entry.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-black text-stone-900 uppercase text-sm tracking-tight">{entry.name}</h4>
                                  <span className="text-[8px] font-black text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md tracking-widest">{maskedPhone}</span>
                                </div>
                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{new Date(entry.created_at).toLocaleDateString('vi-VN')}</p>
                              </div>
                            </div>
                            <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className={`text-sm font-bold italic leading-relaxed ${colorSet.content}`}>"{entry.content}"</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  {guestbookEntries.length > 5 && !showAllGuestbook && (
                    <button 
                      onClick={() => setShowAllGuestbook(true)}
                      className="w-full py-4 text-[10px] font-black text-amber-800 uppercase tracking-widest hover:bg-amber-50 rounded-2xl transition-all border border-dashed border-amber-200 mt-4"
                    >
                      Xem tất cả {guestbookEntries.length} góp ý
                    </button>
                  )}
                  
                  {showAllGuestbook && (
                    <button 
                      onClick={() => setShowAllGuestbook(false)}
                      className="w-full py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:bg-stone-50 rounded-2xl transition-all border border-dashed border-stone-200 mt-4"
                    >
                      Thu gọn
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-white pt-32 pb-16 px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4"><img src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" className="w-16 h-16 md:w-20 md:h-20" /><span className="text-2xl font-black">ÚT TRINH</span></div>
            <p className="text-stone-500 text-sm italic leading-relaxed">"Hương vị quê nhà, đậm đà tình thân."</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Liên hệ</h4>
            <div className="space-y-4 text-stone-400 text-sm">
              <p className="font-bold text-white">158A/5 Trần Vĩnh Kiết, Cần Thơ</p>
              <p className="font-black text-2xl text-white">0939.70.90.20</p>
              <div className="flex gap-4 pt-2">
                <a href="https://www.facebook.com/profile.php?id=100088316355555" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-blue-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="mailto:comphanuttrinh@gmail.com" className="text-stone-500 hover:text-red-400 transition-colors">
                  <Mail size={20} />
                </a>
                <a href="#" className="text-stone-500 hover:text-sky-400 transition-colors cursor-default">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-stone-500 hover:text-pink-500 transition-colors cursor-default">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-stone-500 hover:text-red-600 transition-colors cursor-default">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Thống kê</h4>
            <div className="space-y-4">
              <p className="text-2xl font-black">{totalViews.toLocaleString()} lượt xem</p>
              <p className="text-amber-500 font-black">{onlineCount} đang online</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Đối tác</h4>
            <div className="flex gap-4">
               <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-10 md:h-14 rounded-sm" />
               <img src={SHOPEE_LOGO} className="h-10 md:h-14" />
            </div>
          </div>
        </div>
        <div className="text-center text-stone-600 text-[8px] font-black uppercase tracking-[0.5em] pt-10 border-t border-white/5">© 2026 CƠM PHẦN ÚT TRINH - EST 2019</div>
      </footer>
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, onSave, supabase }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'notifications' | 'quick' | 'guestbook'>('menu');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [guestbookItems, setGuestbookItems] = useState<GuestbookEntry[]>([]);
  const [newNotif, setNewNotif] = useState('');
  const [newFooter, setNewFooter] = useState('XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI.');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickMenuItems, setQuickMenuItems] = useState<QuickMenuItem[]>([]);
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchQuickMenu = useCallback(async () => {
    setLoadingQuick(true);
    const { data } = await supabase.from('quick_menu').select('*').order('sort_order', { ascending: true });
    if (data) setQuickMenuItems(data);
    setLoadingQuick(false);
  }, [supabase]);

  const fetchGuestbook = useCallback(async () => {
    const { data } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    if (data) setGuestbookItems(data);
  }, [supabase]);

  useEffect(() => {
    if (activeTab === 'quick') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuickMenu();
    }
    if (activeTab === 'guestbook') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchGuestbook();
    }
  }, [activeTab, fetchQuickMenu, fetchGuestbook]);

  const approveGuestbook = async (id: string) => {
    const { error } = await supabase.from('guestbook').update({ is_approved: true }).eq('id', id);
    if (!error) fetchGuestbook();
  };

  const deleteGuestbook = async (id: string) => {
    if (!confirm("Xóa góp ý này?")) return;
    const { error } = await supabase.from('guestbook').delete().eq('id', id);
    if (!error) fetchGuestbook();
  };

  const handleAddQuick = async (parentId: string | null = null) => {
    const name = prompt("Nhập tên mục mới:");
    if (!name) return;
    const priceStr = prompt("Nhập giá (để trống nếu là danh mục cha):");
    const price = priceStr ? parseInt(priceStr.replace(/\D/g, '')) : null;
    
    const { error } = await supabase.from('quick_menu').insert([{ name, price, parent_id: parentId, sort_order: quickMenuItems.length }]);
    if (!error) fetchQuickMenu();
  };

  const deleteQuick = async (id: string) => {
    if (!confirm("Xóa mục này và tất cả mục con?")) return;
    const { error } = await supabase.from('quick_menu').delete().eq('id', id);
    if (!error) fetchQuickMenu();
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    const val = newPrice.replace(/\D/g, '');
    const price = val ? parseInt(val) : null;
    setQuickMenuItems(prev => prev.map(item => item.id === id ? { ...item, price } : item));
  };

  const handleNameChange = (id: string, newName: string) => {
    setQuickMenuItems(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  };

  const saveQuickMenu = async () => {
    setLoadingQuick(true);
    try {
      for (const item of quickMenuItems) {
        await supabase.from('quick_menu').update({ 
          name: item.name,
          price: item.price 
        }).eq('id', item.id);
      }
      alert("Đã lưu tất cả thay đổi thành công!");
    } catch {
      alert("Có lỗi xảy ra khi lưu dữ liệu.");
    }
    setLoadingQuick(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === menu.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(menu.map((d: any) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Xóa ${selectedIds.length} món đã chọn?`)) {
      setMenu(menu.filter((d: any) => !selectedIds.includes(d.id)));
      setSelectedIds([]);
    }
  };

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (data) setNotifications(data);
    };
    fetchNotifs();
  }, [supabase]);

  const handleAddNotif = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const message = newNotif.trim();
    if (!message) {
      alert("Vui lòng nhập nội dung thông báo.");
      return;
    }

    console.log("Attempting to create notification:", message);
    
    try {
      // Thử insert với cột footer
      let { data, error } = await supabase
        .from('notifications')
        .insert([{ message, footer: newFooter.trim(), is_active: true }])
        .select()
        .single();
      
      // Nếu lỗi do thiếu cột 'footer' trong database
      if (error && error.message.includes("column 'footer'")) {
        console.warn("Cột 'footer' chưa tồn tại, đang thử lại không có footer...");
        const retry = await supabase
          .from('notifications')
          .insert([{ message, is_active: true }])
          .select()
          .single();
        data = retry.data;
        error = retry.error;

        if (!error) {
          alert("Lưu ý: Thông báo đã được tạo nhưng dòng chữ màu vàng (Lời chúc) không được lưu vì bạn chưa thêm cột 'footer' vào bảng 'notifications' trong Supabase.\n\nHướng dẫn: Vào Supabase Dashboard -> SQL Editor -> Chạy lệnh: ALTER TABLE notifications ADD COLUMN footer TEXT;");
        }
      }
      
      if (error) {
        console.error('Supabase Error:', error);
        alert(`Lỗi hệ thống: ${error.message}\n\nHướng dẫn: Hãy đảm bảo bạn đã tạo bảng 'notifications' trong Supabase Dashboard.`);
        return;
      }

      if (data) {
        console.log("Notification created successfully:", data);
        setNotifications(prev => [data, ...prev]);
        setNewNotif('');
        setNewFooter('XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI.');
        alert("Chúc mừng! Thông báo đã được tạo và đang hiển thị.");
      } else {
        alert("Không nhận được phản hồi từ máy chủ, vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error('Unexpected Exception:', err);
      alert(`Đã xảy ra lỗi không mong muốn: ${err.message || 'Vui lòng kiểm tra kết nối mạng.'}`);
    }
  };

  const toggleNotif = async (id: string, current: boolean) => {
    const { error } = await supabase.from('notifications').update({ is_active: !current }).eq('id', id);
    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_active: !current } : n));
    }
  };

  const deleteNotif = async (id: string) => {
    if (!confirm('Xóa thông báo này?')) return;
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const moveHero = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < newSlides.length) {
      [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
      setHeroSlides(newSlides);
    }
  };

  const renderQuickTree = (items: QuickMenuItem[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedIds.has(item.id);

      return (
        <React.Fragment key={item.id}>
          <div 
            className={`p-4 border rounded-2xl bg-white flex justify-between items-center group hover:border-amber-800 transition-all shadow-sm mb-2 ${level > 0 ? 'border-stone-100' : 'border-stone-200'}`}
            style={{ marginLeft: `${level * 32}px` }}
          >
            <div className="flex items-center gap-3 flex-1">
              {hasChildren ? (
                <button 
                  onClick={() => toggleExpand(item.id)}
                  className="p-1 hover:bg-stone-100 rounded-lg transition-colors text-stone-400 hover:text-amber-800"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <div className="w-6" /> // Spacer for alignment
              )}
              
              <div className={`w-2 h-2 rounded-full shrink-0 ${level === 0 ? 'bg-amber-800' : level === 1 ? 'bg-amber-400' : 'bg-stone-300'}`}></div>
              <div className="flex-1">
                <input 
                  type="text"
                  value={item.name}
                  onChange={(e) => handleNameChange(item.id, e.target.value)}
                  className={`w-full bg-transparent border-none focus:ring-0 p-0 font-black uppercase tracking-tight ${level === 0 ? 'text-stone-900 text-base' : 'text-stone-600 text-xs'}`}
                />
                <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">
                  {level === 0 ? 'Danh mục gốc' : level === 1 ? 'Mục con' : 'Cách chế biến'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Giá tiền</span>
                <input 
                  type="text" 
                  placeholder="Giá (VNĐ)" 
                  value={item.price ? item.price.toLocaleString('vi-VN') : ''}
                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                  className="w-28 p-1.5 border rounded-lg text-[10px] font-black text-amber-800 text-right focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <button onClick={() => handleAddQuick(item.id)} className="p-2 bg-stone-50 border rounded-lg text-stone-400 hover:text-green-600 transition-colors shadow-sm" title="Thêm mục con"><Plus size={14}/></button>
              <button onClick={() => deleteQuick(item.id)} className="p-2 bg-stone-50 border rounded-lg text-stone-300 hover:text-red-500 transition-colors shadow-sm"><Trash2 size={14}/></button>
            </div>
          </div>
          {hasChildren && isExpanded && renderQuickTree(item.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const quickTree = useMemo(() => {
    const buildTree = (items: QuickMenuItem[], parentId: string | null = null): QuickMenuItem[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    };
    return buildTree(quickMenuItems);
  }, [quickMenuItems]);

  return (
    <div className="min-h-screen bg-stone-100 pt-32 pb-20 px-4 md:px-6">
      <Nav isAdmin />
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-200">
        <div className="flex bg-stone-50 border-b p-3 gap-2">
          <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'menu' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🍱 THỰC ĐƠN</button>
          <button onClick={() => setActiveTab('hero')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'hero' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🖼️ HERO SLIDES</button>
          <button onClick={() => setActiveTab('quick')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'quick' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>⚡ CHỌN NHANH</button>
          <button onClick={() => setActiveTab('notifications')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'notifications' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🔔 THÔNG BÁO</button>
          <button onClick={() => setActiveTab('guestbook')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'guestbook' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>💬 GÓP Ý</button>
        </div>
        
        <div className="p-12">
          {activeTab === 'menu' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b pb-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase text-stone-900">QUẢN LÝ THỰC ĐƠN</h2>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === menu.length && menu.length > 0} 
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 group-hover:text-stone-900">Chọn tất cả ({menu.length})</span>
                    </label>
                    {selectedIds.length > 0 && (
                      <button 
                        onClick={deleteSelected}
                        className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                      >
                        Xóa đã chọn ({selectedIds.length})
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={onSave} className="bg-green-600 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">ĐỒNG BỘ</button>
                  <button onClick={() => setMenu([{ id: Date.now().toString(), name: 'Món Mới', price: '35.000 VNĐ', description: '', image_url: '', category: Category.MainCourse }, ...menu])} className="bg-amber-800 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">+ THÊM MÓN</button>
                </div>
              </div>
              <div className="grid gap-6">
                {menu.map((dish: Dish, i: number) => (
                  <div key={dish.id} className={`p-8 border rounded-[35px] flex gap-10 items-start transition-all ${selectedIds.includes(dish.id) ? 'bg-amber-50/50 border-amber-200' : 'bg-stone-50/40 border-stone-100 hover:border-amber-200'}`}>
                    <div className="pt-2">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(dish.id)} 
                        onChange={() => toggleSelect(dish.id)}
                        className="w-6 h-6 rounded-lg border-stone-300 text-amber-800 focus:ring-amber-800 cursor-pointer"
                      />
                    </div>
                    <div className="w-40 h-40 rounded-[25px] overflow-hidden bg-stone-200 border-4 border-white shrink-0"><img src={dish.image_url || 'https://placehold.co/400x400'} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 grid grid-cols-3 gap-5">
                      <input value={dish.name} onChange={e => { const m = [...menu]; m[i].name = e.target.value; setMenu(m); }} className="p-4 border rounded-2xl text-sm font-bold" placeholder="Tên món" />
                      <input value={dish.price} onChange={e => { const m = [...menu]; m[i].price = e.target.value; setMenu(m); }} className="p-4 border rounded-2xl text-sm font-black text-amber-800" placeholder="Giá" />
                      <select value={dish.category} onChange={e => { const m = [...menu]; m[i].category = e.target.value as Category; setMenu(m); }} className="p-4 border rounded-2xl text-sm font-bold">{Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}</select>
                      <input value={dish.image_url} onChange={e => { const m = [...menu]; m[i].image_url = e.target.value; setMenu(m); }} className="col-span-3 p-4 border rounded-2xl text-[10px] font-mono" placeholder="Link ảnh (URL)" />
                    </div>
                    <button onClick={() => { if(confirm('Xóa món này?')) setMenu(menu.filter(d => d.id !== dish.id)) }} className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl text-2xl font-bold shrink-0">×</button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'quick' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">QUẢN LÝ CHỌN NHANH</h2>
                <div className="flex gap-3">
                  <button onClick={saveQuickMenu} className="bg-green-600 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">LƯU TẤT CẢ GIÁ</button>
                  <button onClick={() => handleAddQuick(null)} className="bg-amber-800 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">+ THÊM DANH MỤC GỐC</button>
                </div>
              </div>
              
              <div className="space-y-2">
                {loadingQuick ? (
                  <div className="text-center py-10 text-stone-400 font-bold">Đang tải dữ liệu...</div>
                ) : (
                  <div className="py-4">
                    {renderQuickTree(quickTree)}
                  </div>
                )}
              </div>
              <p className="text-stone-400 text-[10px] italic font-bold">* Lưu ý: Nhập giá cho các món, sau đó nhấn nút "LƯU TẤT CẢ GIÁ" để cập nhật lên hệ thống.</p>
            </div>
          ) : activeTab === 'hero' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">BANNER HERO</h2>
                <div className="flex gap-3">
                  <button onClick={onSave} className="bg-green-600 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">ĐỒNG BỘ</button>
                  <button onClick={() => setHeroSlides([...heroSlides, { id: Date.now().toString(), image_url: '', quote: '' }])} className="bg-amber-800 text-white px-8 py-3.5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">+ THÊM SLIDE</button>
                </div>
              </div>
              <div className="grid gap-6">
                {heroSlides.map((slide: HeroSlide, i: number) => (
                  <div key={slide.id} className="p-8 border border-stone-100 rounded-[35px] bg-stone-50/40 flex gap-10 items-center">
                    <div className="w-72 aspect-video rounded-3xl overflow-hidden bg-stone-200 border-4 border-white"><img src={slide.image_url} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 space-y-5">
                      <input value={slide.image_url} onChange={e => { const s = [...heroSlides]; s[i].image_url = e.target.value; setHeroSlides(s); }} className="w-full p-4 border rounded-2xl text-[10px] font-mono" placeholder="Link ảnh Hero" />
                      <input value={slide.quote} onChange={e => { const s = [...heroSlides]; s[i].quote = e.target.value; setHeroSlides(s); }} className="w-full p-4 border rounded-2xl text-sm italic" placeholder="Slogan" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => moveHero(i, 'up')} disabled={i === 0} className="w-14 h-14 bg-white border rounded-2xl font-bold">↑</button>
                      <button onClick={() => moveHero(i, 'down')} disabled={i === heroSlides.length - 1} className="w-14 h-14 bg-white border rounded-2xl font-bold">↓</button>
                      <button onClick={() => { if(confirm('Xóa slide?')) setHeroSlides(heroSlides.filter(s => s.id !== slide.id)) }} className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl text-2xl font-bold">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'guestbook' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">QUẢN LÝ GÓP Ý</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{guestbookItems.length} Tổng số</span>
              </div>

              <div className="grid gap-6">
                {guestbookItems.length === 0 ? (
                  <div className="text-center py-20 text-stone-400 font-bold">Chưa có góp ý nào từ khách hàng.</div>
                ) : (
                  guestbookItems.map((item) => (
                    <div key={item.id} className={`p-8 rounded-[35px] border flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-all ${item.is_approved ? 'bg-white border-stone-100' : 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-900/5'}`}>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase ${item.is_approved ? 'bg-stone-100 text-stone-500' : 'bg-amber-800 text-white'}`}>
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-stone-900 uppercase text-sm tracking-tight flex items-center gap-2">
                              {item.name}
                              {!item.is_approved && <span className="bg-amber-800 text-white text-[8px] px-2 py-0.5 rounded-full">CHỜ DUYỆT</span>}
                            </h4>
                            <div className="flex items-center gap-3">
                              <p className="text-[10px] text-amber-800 font-black uppercase tracking-widest">{item.phone || 'Không có SĐT'}</p>
                              <span className="text-stone-300">|</span>
                              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{new Date(item.created_at).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100 italic text-stone-600 text-sm">
                          "{item.content}"
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end md:self-center">
                        {!item.is_approved && (
                          <button 
                            onClick={() => approveGuestbook(item.id)}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                          >
                            <CheckCircle2 size={14} />
                            DUYỆT ĐĂNG
                          </button>
                        )}
                        <button 
                          onClick={() => deleteGuestbook(item.id)}
                          className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">QUẢN LÝ THÔNG BÁO</h2>
              </div>
              
              <div className="bg-stone-50 p-8 rounded-[35px] border border-stone-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Tạo thông báo mới</h3>
                <form onSubmit={handleAddNotif} className="flex flex-col gap-4">
                  <textarea 
                    value={newNotif} 
                    onChange={(e) => setNewNotif(e.target.value)} 
                    className="w-full p-5 border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all min-h-[120px]" 
                    placeholder="Nội dung thông báo chính (Ví dụ: Website mới có chức năng giả lập...)" 
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-800 ml-2">Lời chúc / Ghi chú (Chữ màu vàng):</label>
                    <input 
                      type="text"
                      value={newFooter}
                      onChange={(e) => setNewFooter(e.target.value)}
                      className="w-full p-4 border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="Ví dụ: CHÚC MỪNG NĂM MỚI..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-amber-800 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-stone-900 transition-all active:scale-95 mt-2"
                  >
                    + TẠO MỚI THÔNG BÁO
                  </button>
                </form>
              </div>

              <div className="grid gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-6">Danh sách thông báo</h3>
                {notifications.map((n) => (
                  <div key={n.id} className={`p-6 rounded-[30px] border flex items-center justify-between transition-all ${n.is_active ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100 opacity-60'}`}>
                    <div className="flex-1">
                      <p className={`text-lg font-bold ${n.is_active ? 'text-amber-900' : 'text-stone-400'}`}>{n.message}</p>
                      {n.footer && <p className="text-xs italic text-amber-600 font-bold mt-1">{n.footer}</p>}
                      <span className="text-[9px] font-black uppercase tracking-widest text-stone-300">{new Date(n.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${n.is_active ? 'text-green-600' : 'text-stone-300'}`}>
                          {n.is_active ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                        </span>
                        <button 
                          onClick={() => toggleNotif(n.id, n.is_active)}
                          className={`w-14 h-8 rounded-full relative transition-all ${n.is_active ? 'bg-green-500' : 'bg-stone-200'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${n.is_active ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <button onClick={() => deleteNotif(n.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl font-bold">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [supabaseConfig] = useState(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : { url: DEFAULT_URL, key: DEFAULT_ANON_KEY };
  });
  const [menu, setMenu] = useState<Dish[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(supabaseConfig.url, supabaseConfig.key), [supabaseConfig]);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: dishes } = await supabase.from('dishes').select('*').order('created_at', { ascending: false });
      const { data: slides } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);
  
  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // 1. Xóa dữ liệu cũ - Kiểm tra lỗi chặt chẽ
      const { error: delDishesError } = await supabase.from('dishes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delDishesError) throw new Error("Không thể xóa món ăn cũ: " + delDishesError.message);

      const { error: delSlidesError } = await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delSlidesError) throw new Error("Không thể xóa banner cũ: " + delSlidesError.message);

      // 2. Chuẩn bị dữ liệu để lưu (loại bỏ id cũ để Supabase tự tạo id mới)
      const sanitize = (list: any[]) => list.map((item) => {
        const newItem = { ...item };
        delete newItem.id;
        delete newItem.created_at;
        return newItem;
      });
      
      // 3. Lưu dữ liệu mới
      if (menu.length) {
        const { error: insDishesError } = await supabase.from('dishes').insert(sanitize(menu));
        if (insDishesError) throw new Error("Lỗi khi lưu danh sách món ăn: " + insDishesError.message);
      }
      
      if (heroSlides.length) {
        const { error: insSlidesError } = await supabase.from('hero_slides').insert(sanitize(heroSlides));
        if (insSlidesError) throw new Error("Lỗi khi lưu banner: " + insSlidesError.message);
      }

      alert("Đồng bộ dữ liệu thành công! Dữ liệu đã được làm mới."); 
      fetchData();
    } catch (e: any) { 
      console.error(e);
      alert("LỖI ĐỒNG BỘ: " + (e.message || "Vui lòng kiểm tra quyền xóa (Delete Policy) trong Supabase.")); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const isAcp = window.location.hash.toUpperCase().includes('ACP1122');
  return isAcp ? <AdminPanel menu={menu} setMenu={setMenu} heroSlides={heroSlides} setHeroSlides={setHeroSlides} onSave={handleSave} supabase={supabase} /> : <HomePage menu={menu} heroSlides={heroSlides} isLoading={isLoading} supabase={supabase} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
