import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Plus, Power, PowerOff, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { supabaseService } from './services/supabaseService';
import { Notification } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [newNotification, setNewNotification] = useState('');

  const fetchData = async () => {
    const [active, all] = await Promise.all([
      supabaseService.getActiveNotification(),
      supabaseService.getAllNotifications()
    ]);
    setActiveNotification(active);
    setAllNotifications(all);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotification.trim()) return;

    const created = await supabaseService.createNotification(newNotification);
    if (created) {
      setNewNotification('');
      fetchData();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const success = await supabaseService.updateNotificationStatus(id, !currentStatus);
    if (success) {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1c1917]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-900 rounded-full flex items-center justify-center text-white">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-orange-900 uppercase">Út Trinh</h1>
              <p className="text-[10px] text-orange-700 font-medium uppercase tracking-widest leading-none">Cơm Nhà Truyền Thống</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-xs font-semibold uppercase tracking-widest text-orange-900/50 hover:text-orange-900 transition-colors"
          >
            {showAdmin ? 'Đóng Quản Lý' : 'Quản Lý'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {showAdmin ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm">
              <h2 className="text-2xl font-serif italic mb-6 text-orange-900">Quản Lý Thông Báo</h2>
              
              <form onSubmit={handleCreateNotification} className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  value={newNotification}
                  onChange={(e) => setNewNotification(e.target.value)}
                  placeholder="Nhập nội dung thông báo mới..."
                  className="flex-1 bg-orange-50/50 border border-orange-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-900/20 transition-all"
                />
                <button 
                  type="submit"
                  className="bg-orange-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-800 transition-colors shadow-lg shadow-orange-900/10"
                >
                  <Plus size={20} />
                  <span>Tạo Mới</span>
                </button>
              </form>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-orange-900/40 mb-4">Lịch Sử Thông Báo</h3>
                {allNotifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-2xl border transition-all",
                      notif.is_active 
                        ? "bg-orange-50/30 border-orange-200" 
                        : "bg-white border-gray-100 opacity-60"
                    )}
                  >
                    <div className="flex-1 mr-4">
                      <p className={cn("font-medium", notif.is_active ? "text-orange-900" : "text-gray-500")}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {new Date(notif.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleToggleStatus(notif.id, notif.is_active)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                        notif.is_active 
                          ? "bg-orange-900 text-white shadow-md" 
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}
                    >
                      {notif.is_active ? <Power size={14} /> : <PowerOff size={14} />}
                      <span>{notif.is_active ? 'Đang Bật' : 'Đã Tắt'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center space-y-12 py-20">
            <div className="space-y-4">
              <h2 className="text-6xl font-serif italic text-orange-900">Hương Vị Cơm Nhà</h2>
              <p className="text-orange-900/60 max-w-xl mx-auto leading-relaxed">
                Chào mừng bạn đến với Cơm Phần Út Trinh. Chúng tôi mang đến những bữa cơm ấm cúng, đậm đà hương vị quê hương.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-orange-50 rounded-[40px] overflow-hidden relative group cursor-pointer">
                  <img 
                    src={`https://picsum.photos/seed/dish${i}/800/1000`} 
                    alt="Dish" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 via-transparent to-transparent flex flex-col justify-end p-8 text-left">
                    <span className="text-[10px] text-orange-200 font-bold uppercase tracking-[0.2em] mb-2">Món Ngon Mỗi Ngày</span>
                    <h3 className="text-2xl font-serif italic text-white mb-4">Thực Đơn Đặc Biệt {i}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                      <span>Xem chi tiết</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* User Notification Popup */}
      <AnimatePresence>
        {activeNotification && !showAdmin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 z-50 max-w-sm w-full"
          >
            <div className="bg-orange-900 text-white p-8 rounded-[32px] shadow-2xl shadow-orange-900/40 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              
              <button 
                onClick={() => setActiveNotification(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Bell size={24} className="text-orange-100" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Thông Báo Quán</h4>
                  <p className="text-lg font-serif italic leading-snug">
                    {activeNotification.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-orange-100 py-12 text-center">
        <p className="text-[10px] text-orange-900/40 font-bold uppercase tracking-[0.3em]">
          © 2024 Cơm Phần Út Trinh • Crafted with Heart
        </p>
      </footer>
    </div>
  );
}
