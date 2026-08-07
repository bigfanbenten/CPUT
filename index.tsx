
/**
 * BẢN SAVE SỐ 4 - PHIÊN BẢN TỐI ƯU GIAO DIỆN & THÔNG TIN LIÊN HỆ
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
 *    - CẢI TIẾN: Màu chữ bình luận tự động điều chỉnh theo theme để luôn rõ nét.
 * 10. Hệ thống THỐNG KÊ ĐỒNG NHẤT:
 *    - Lượt xem (Visitor) được đồng bộ qua Supabase `site_stats`, thống nhất trên mọi thiết bị.
 *    - Cơ chế đếm thông minh: Mỗi khách truy cập được tính 1 lượt mỗi 30 phút (sử dụng LocalStorage).
 *    - Đã sửa lỗi bộ đếm bị nhảy lùi: Tự động lấy giá trị lớn nhất giữa Database và LocalStorage, khởi tạo tối thiểu 372.
 *    - Đếm số người đang Online thời gian thực.
 * 11. Cải tiến UI/UX & THÔNG TIN LIÊN HỆ:
 *    - Modal chi tiết món ăn: Nhãn "CƠM PHẦN ÚT TRINH" nổi bật với nền đỏ, chữ trắng.
 *    - Tích hợp các liên kết Mạng xã hội (Facebook, Youtube, Gmail...) chính thức ở chân trang.
 *    - Cập nhật địa chỉ mới: 158A đường Trần Vĩnh Kiết, Cần Thơ.
 *    - Cập nhật bản quyền © 2026 và slogan "EST 2019".
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ChevronRight, ChevronDown, ChevronUp, UtensilsCrossed, ShoppingBag, Trash2, Plus, Minus, MessageSquare, CheckCircle2, Facebook, Mail, Youtube, Users, Vote, Music, VolumeX, Play, Pause, BarChart2, Check, X, RefreshCw, Shuffle, ExternalLink } from 'lucide-react';

// --- CẤU HÌNH CỐ ĐỊNH ---
const DEFAULT_URL = 'https://qrzfpeeuohzfquzfiebc.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemZwZWV1b2h6ZnF1emZpZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY4MDgsImV4cCI6MjA4NDMyMjgwOH0.tyzhzbucriL09bH-ndgXs3ob1-Www97vsfQ6Wsh8d7s';

interface VotePoll {
  is_active: boolean;
  question: string;
  music_url: string;
  yes_votes: number;
  no_votes: number;
}

const getYouTubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

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
const POLL_KEY = 'ut-trinh-poll-data-v1';
const VOTED_KEY = 'ut-trinh-user-voted-v1';
const SHOPEE_LOGO = 'https://i.postimg.cc/Wzj6yWrp/pngtree-shopefood-logo-png-image-6472274.png';
const GUESTBOOK_COLORS = [
  { avatar: 'bg-emerald-100 text-emerald-800', content: 'text-emerald-600', border: 'border-emerald-100', bg: 'bg-emerald-50/30' },
  { avatar: 'bg-rose-100 text-rose-800', content: 'text-rose-600', border: 'border-rose-100', bg: 'bg-rose-50/30' },
  { avatar: 'bg-orange-100 text-orange-800', content: 'text-orange-600', border: 'border-orange-100', bg: 'bg-orange-50/30' },
  { avatar: 'bg-sky-100 text-sky-800', content: 'text-sky-600', border: 'border-sky-100', bg: 'bg-sky-50/30' },
  { avatar: 'bg-violet-100 text-violet-800', content: 'text-violet-600', border: 'border-violet-100', bg: 'bg-violet-50/30' },
];

enum Theme {
  White = 'White',
  Yellow = 'Yellow',
  Red = 'Red',
  Blue = 'Blue'
}

const THEMES = {
  [Theme.White]: {
    name: 'TRẮNG',
    bg: 'bg-white',
    text: 'text-stone-900',
    accent: 'text-amber-700',
    button: 'bg-amber-800',
    border: 'border-stone-100',
    card: 'bg-white',
    footer: 'bg-stone-900',
    nav: 'bg-white/95',
    font: 'font-sans',
    primary: '#9a3412',
    secondary: '#1c1917',
    bgHex: '#ffffff'
  },
  [Theme.Yellow]: {
    name: 'VÀNG',
    bg: 'bg-amber-50',
    text: 'text-amber-950',
    accent: 'text-amber-600',
    button: 'bg-amber-600',
    border: 'border-amber-200',
    card: 'bg-white',
    footer: 'bg-amber-900',
    nav: 'bg-amber-50/95',
    font: 'font-serif-custom',
    primary: '#d97706',
    secondary: '#451a03',
    bgHex: '#fffbeb'
  },
  [Theme.Red]: {
    name: 'ĐỎ',
    bg: 'bg-red-50',
    text: 'text-red-950',
    accent: 'text-red-700',
    button: 'bg-red-700',
    border: 'border-red-200',
    card: 'bg-white',
    footer: 'bg-red-900',
    nav: 'bg-red-50/95',
    font: 'font-oswald',
    primary: '#b91c1c',
    secondary: '#450a0a',
    bgHex: '#fef2f2'
  },
  [Theme.Blue]: {
    name: 'XANH BLUE',
    bg: 'bg-sky-50',
    text: 'text-sky-950',
    accent: 'text-sky-700',
    button: 'bg-sky-700',
    border: 'border-sky-200',
    card: 'bg-white',
    footer: 'bg-sky-900',
    nav: 'bg-sky-50/95',
    font: 'font-space',
    primary: '#0369a1',
    secondary: '#082f49',
    bgHex: '#f0f9ff'
  }
};

const THEME_KEY = 'ut-trinh-theme-v1';

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

export function extractNhaccuatuiKey(url: string | null | undefined): string {
  if (!url) return 'L8Le1DOh8TQB';
  const clean = url.trim();
  const match = clean.match(/(?:playlist|lh\/playlist|mh\/background|bai-hat)\/(?:[a-zA-Z0-9-]+\.)?([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return match[1].replace(/\.html$/i, '');
  }
  if (/^[a-zA-Z0-9_-]{8,20}$/.test(clean)) {
    return clean;
  }
  return 'L8Le1DOh8TQB';
}

export interface NhaccuatuiPlaylist {
  id: string;
  title: string;
  description: string;
  url: string;
  key: string;
  badge: string;
  genreKey: 'vpop' | 'usuk' | 'kpop' | 'khongloi' | 'thien' | 'cafesax';
}

export const NHACCUATUI_FEATURED_PLAYLISTS: NhaccuatuiPlaylist[] = [
  {
    id: 'nct-viet',
    title: '🇻🇳 Top Nhạc Việt Ballad & Dân Ca Cơm Phần Út Trinh',
    description: 'Tuyển tập nhạc Việt Nam hit hot & dân ca 3 miền du dương từ Nhaccuatui.com',
    url: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB',
    key: 'L8Le1DOh8TQB',
    badge: '🇻🇳 Nhạc Việt',
    genreKey: 'vpop'
  },
  {
    id: 'nct-usuk',
    title: '🌎 US-UK Acoustic & Pop Chill Cơm Trưa',
    description: 'Nhạc Âu-Mỹ acoustic, pop lãng mạn nhẹ nhàng phục vụ bữa ăn sang trọng',
    url: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m',
    key: 'O0A128j8c8m',
    badge: '🌎 Âu - Mỹ',
    genreKey: 'usuk'
  },
  {
    id: 'nct-kpop',
    title: '🇰🇷 K-Pop Ballad & Nhạc Phim Hàn Quốc (K-Drama OST)',
    description: 'Bản ballad Hàn Quốc & nhạc phim Goblin, Hậu Duệ Mặt Trời du dương',
    url: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB',
    key: 'L8Le1DOh8TQB',
    badge: '🇰🇷 Hàn Quốc',
    genreKey: 'kpop'
  },
  {
    id: 'nct-khongloi',
    title: '🎹 Hòa Tấu Không Lời Piano & Guitar Classic',
    description: 'Nhạc không lời piano Yiruma, Richard Clayderman & Guitar Classic êm dịu',
    url: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB',
    key: 'L8Le1DOh8TQB',
    badge: '🎹 Không Lời',
    genreKey: 'khongloi'
  },
  {
    id: 'nct-thien',
    title: '🧘 Nhạc Thiền Spa & Chuông Xoay 432Hz Tĩnh Tâm',
    description: 'Tần số âm thanh 432Hz giúp giải tỏa căng thẳng & tiêu hóa tốt bữa ăn',
    url: 'https://www.nhaccuatui.com/playlist/U02b2E13wY7n',
    key: 'U02b2E13wY7n',
    badge: '🧘 Thiền & Lofi',
    genreKey: 'thien'
  },
  {
    id: 'nct-cafesax',
    title: '🎷 Saxophone Jazz & Acoustic Cafe Unplugged',
    description: 'Bản hòa tấu Saxophone & Guitar Unplugged êm dịu bữa trưa gia đình',
    url: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m',
    key: 'O0A128j8c8m',
    badge: '🎷 Cafe Sax',
    genreKey: 'cafesax'
  }
];

export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  category: 'restaurant' | 'vpop';
  genreKey: 'vpop' | 'usuk' | 'kpop' | 'khongloi' | 'thien' | 'cafesax';
  url: string;
  fallbackUrl?: string;
  badge: string;
  sourceType?: 'nhaccuatoi' | 'zingmp3' | 'soundcloud' | 'mp3' | 'webaudio' | 'youtube';
  sourceLabel?: string;
  nctLink?: string;
}

export const MULTI_GENRE_CATALOG: PlaylistItem[] = [
  // 1. NHẠC VIỆT (V-Pop, Dân Ca & Trữ Tình)
  { id: 'vp-1', title: 'Nơi Này Có Anh - Sơn Tùng M-TP', artist: 'Sơn Tùng M-TP', category: 'vpop', genreKey: 'vpop', url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97a8e7e13.mp3', badge: '🇻🇳 V-Pop Hit', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/bai-hat/noi-nay-co-anh-son-tung-m-tp.html' },
  { id: 'vp-2', title: 'Chúng Ta Của Tương Lai - Sơn Tùng M-TP', artist: 'Sơn Tùng M-TP', category: 'vpop', genreKey: 'vpop', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8263158ff.mp3', badge: '🇻🇳 Trending 2026', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/bai-hat/chung-ta-cua-tuong-lai-son-tung-m-tp.html' },
  { id: 'vp-3', title: 'Sau Lời Khước Từ - Phan Mạnh Quỳnh', artist: 'Phan Mạnh Quỳnh (Mai OST)', category: 'vpop', genreKey: 'vpop', url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_88414e2d31.mp3', badge: '🇻🇳 Nhạc Phim Mai', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/bai-hat/sau-loi-khuoc-tu-phan-manh-quynh.html' },
  { id: 'vp-4', title: 'Cắt Đôi Nỗi Sầu - Tăng Duy Tân', artist: 'Tăng Duy Tân', category: 'vpop', genreKey: 'vpop', url: 'https://cdn.pixabay.com/download/audio/2023/10/01/audio_1a21e428df.mp3', badge: '🇻🇳 Dance Pop', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'vp-5', title: 'Dân Ca 3 Miền Hòa Tấu Đàn Bầu Êm Ái', artist: 'Hòa Tấu Dân Ca Việt Nam', category: 'restaurant', genreKey: 'vpop', url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_88414e2d31.mp3', badge: '🌾 Đàn Bầu Việt', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'vp-6', title: 'Mẹ Yêu Con - Hòa Tấu Sáo Trúc & Đàn Tranh', artist: 'Nghệ Sĩ Dân Dụng Việt', category: 'restaurant', genreKey: 'vpop', url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_848dfa0090.mp3', badge: '🌾 Sáo Trúc Tranh', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },

  // 2. ÂU - MỸ (US-UK Acoustic & Pop Chill)
  { id: 'us-1', title: 'Shape of You (Acoustic Unplugged Cover)', artist: 'Ed Sheeran Acoustic Vibe', category: 'restaurant', genreKey: 'usuk', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', badge: '🌎 US-UK Hit', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'us-2', title: 'Perfect (Romantic Piano & Guitar Cover)', artist: 'Pop Acoustic Collection', category: 'restaurant', genreKey: 'usuk', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', badge: '🌎 Love Song', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'us-3', title: 'Until I Found You - Retro Acoustic Vibe', artist: 'Stephen Sanchez Style', category: 'restaurant', genreKey: 'usuk', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_919e15f6cf.mp3', badge: '🌎 Retro US-UK', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'us-4', title: 'Hotel California - Unplugged Acoustic Guitar', artist: 'Eagles Classic Guitar', category: 'restaurant', genreKey: 'usuk', url: 'https://cdn.pixabay.com/download/audio/2022/06/08/audio_3498f78a2d.mp3', badge: '🌎 Classic Guitar', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'us-5', title: 'Shallow - Lady Gaga & Bradley Cooper Cover', artist: 'Acoustic Dining Duet', category: 'restaurant', genreKey: 'usuk', url: 'https://cdn.pixabay.com/download/audio/2023/04/18/audio_732d8471c9.mp3', badge: '🌎 Movie OST', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },

  // 3. HÀN QUỐC (K-Pop & Movie OST)
  { id: 'kp-1', title: 'Stay With Me - Chanyeol & Punch (Goblin OST)', artist: 'Chanyeol & Punch', category: 'restaurant', genreKey: 'kpop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', badge: '🇰🇷 Goblin OST', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kp-2', title: 'Everytime - Chen & Punch (Hậu Duệ Mặt Trời)', artist: 'Chen & Punch (Descendants OST)', category: 'restaurant', genreKey: 'kpop', url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3', badge: '🇰🇷 Hậu Duệ Mặt Trời', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kp-3', title: 'Spring Day - BTS (Lofi Chill Cafe Remix)', artist: 'BTS Lofi Lounge', category: 'restaurant', genreKey: 'kpop', url: 'https://cdn.pixabay.com/download/audio/2023/01/10/audio_512a9310bc.mp3', badge: '🇰🇷 BTS Lofi', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kp-4', title: 'Flower - Jisoo (Acoustic Piano & Cello)', artist: 'Blackpink Jisoo Piano', category: 'restaurant', genreKey: 'kpop', url: 'https://cdn.pixabay.com/download/audio/2022/02/12/audio_912384a8ff.mp3', badge: '🇰🇷 K-Pop Piano', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kp-5', title: 'Ditto - NewJeans (Soft Cafe Acoustic)', artist: 'NewJeans Acoustic Vibe', category: 'restaurant', genreKey: 'kpop', url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97a8e7e13.mp3', badge: '🇰🇷 NewJeans Soft', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },

  // 4. KHÔNG LỜI (Piano Acoustic & Classic Guitar)
  { id: 'kl-1', title: 'River Flows In You - Yiruma (Piano Acoustic)', artist: 'Yiruma Official Piano', category: 'restaurant', genreKey: 'khongloi', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8263158ff.mp3', badge: '🎹 Yiruma Piano', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kl-2', title: 'Kiss The Rain - Yiruma (Gentle Piano Duo)', artist: 'Yiruma Piano Masterpiece', category: 'restaurant', genreKey: 'khongloi', url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3', badge: '🎹 Kiss The Rain', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kl-3', title: 'Romance d Amour - Classic Guitar Solo', artist: 'Classic Guitar Quán Cơm', category: 'restaurant', genreKey: 'khongloi', url: 'https://cdn.pixabay.com/download/audio/2022/06/08/audio_3498f78a2d.mp3', badge: '🎸 Classic Guitar', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kl-4', title: 'Mariage d Amour - Richard Clayderman', artist: 'Richard Clayderman', category: 'restaurant', genreKey: 'khongloi', url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97a8e7e13.mp3', badge: '🎹 Clayderman', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },
  { id: 'kl-5', title: 'Canon in D - Pachelbel Acoustic Piano & Guitar', artist: 'Acoustic Classics', category: 'restaurant', genreKey: 'khongloi', url: 'https://cdn.pixabay.com/download/audio/2022/02/12/audio_912384a8ff.mp3', badge: '🎹 Canon in D', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB' },

  // 5. THIỀN & LOFI (Spa & Relax 432Hz)
  { id: 'th-1', title: 'Nhạc Spa, Massage & Thiền Chuông Xoay 432Hz', artist: 'Meditation Tibetan Bowl', category: 'restaurant', genreKey: 'thien', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7922d.mp3', badge: '🧘 Spa 432Hz', sourceType: 'webaudio', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/U02b2E13wY7n' },
  { id: 'th-2', title: 'Sáo Trúc & Nhạc Thiền Tĩnh Tâm Spa 528Hz', artist: 'Thiền Định Tĩnh Tâm Spa', category: 'restaurant', genreKey: 'thien', url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_848dfa0090.mp3', badge: '🧘 Sáo Trúc Spa', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/U02b2E13wY7n' },
  { id: 'th-3', title: 'Chill Lofi Beats Chiều Quán Cơm & Meal', artist: 'Lofi Cafe Instrumental', category: 'restaurant', genreKey: 'thien', url: 'https://cdn.pixabay.com/download/audio/2023/01/10/audio_512a9310bc.mp3', badge: '🧘 Lofi Chill', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/U02b2E13wY7n' },
  { id: 'th-4', title: 'Suối Reo Róc Rách & Tiếng Chuông Đồng Tĩnh Tâm', artist: 'Tibet Tibetan Meditation', category: 'restaurant', genreKey: 'thien', url: 'https://cdn.pixabay.com/download/audio/2022/11/15/audio_481a82d910.mp3', badge: '🧘 Suối Reo Spa', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/U02b2E13wY7n' },

  // 6. CAFE & SAXOPHONE (Jazz & Restaurant Atmosphere)
  { id: 'cs-1', title: 'Saxophone Smooth Jazz Quán Cafe & Ăn Uống', artist: 'Smooth Jazz Collection', category: 'restaurant', genreKey: 'cafesax', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', badge: '🎷 Saxophone Jazz', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'cs-2', title: 'Hạ White - Solo Saxophone Lãng Mạn', artist: 'Romantic Saxophone Solo', category: 'restaurant', genreKey: 'cafesax', url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3', badge: '🎷 Sax Hạ White', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'cs-3', title: 'Biển Tình - Saxophone Warm Midnight', artist: 'Saxophone Lãng Mạn', category: 'restaurant', genreKey: 'cafesax', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_919e15f6cf.mp3', badge: '🎷 Sax Biển Tình', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' },
  { id: 'cs-4', title: 'Acoustic Guitar Thư Giãn Chiều Quán Cơm', artist: 'Hòa Tấu Guitar Unplugged', category: 'restaurant', genreKey: 'cafesax', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', badge: '🎸 Acoustic Cafe', sourceType: 'nhaccuatoi', sourceLabel: 'Bóc tách từ Nhaccuatui.com', nctLink: 'https://www.nhaccuatui.com/playlist/O0A128j8c8m' }
];

export const CPUT_PLAYLIST = MULTI_GENRE_CATALOG.filter(t => t.category === 'restaurant');
export const VPOP_TRENDING_POOL = MULTI_GENRE_CATALOG.filter(t => t.category === 'vpop');

// --- COMPONENTS ---

const Nav = ({ isAdmin = false, onShowQuickSelect, cartCount, onShowCart, theme, menuImageUrl }: any) => {
  const [showConciseMenu, setShowConciseMenu] = useState(false);
  const themeData = THEMES[theme as Theme] || THEMES[Theme.White];
  const defaultMenuPhoto = "https://i.postimg.cc/FRJy6Vds/3083583a-d289-482f-9d4e-09d3f06f8893.jpg";

  return (
    <>
      <nav className={`fixed top-10 md:top-12 w-full z-[80] ${themeData.nav} backdrop-blur-xl border-b ${themeData.border} px-2 md:px-20 h-24 md:h-32 flex items-center justify-between transition-all duration-500`}>
        <div className="flex items-center gap-2 md:gap-6 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <img 
            src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" 
            alt="Logo Út Trinh" 
            className="w-10 h-10 md:w-24 md:h-24 object-contain shrink-0 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="flex flex-col justify-center">
            <div className="flex flex-col whitespace-nowrap">
              <div className="flex items-center gap-1">
                <span className={`text-[11px] md:text-3xl lg:text-4xl font-black ${themeData.accent} uppercase tracking-tighter leading-none`}>CƠM PHẦN</span>
                <span className={`text-[11px] md:text-3xl lg:text-4xl font-black ${themeData.text} uppercase tracking-tighter leading-none`}>ÚT TRINH</span>
              </div>
              <span className="text-[7px] md:text-xs lg:text-sm font-black text-red-600 uppercase tracking-widest animate-pulse mt-0.5 md:mt-1">
                Đặt món ngay : 0939.70.90.20
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 md:gap-8 items-center flex-1 justify-end md:justify-start">
          {isAdmin ? (
            <button onClick={() => window.location.hash = ''} className={`${themeData.button} text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all`}>Thoát Quản Trị</button>
          ) : (
            <>
              <div className="flex items-center gap-2 md:gap-8 flex-1 justify-center">
                <a href="#menu" className={`${themeData.text} text-[8px] md:text-xs font-black uppercase tracking-widest hover:${themeData.accent} whitespace-nowrap`}>THỰC ĐƠN</a>
                <button 
                  onClick={onShowQuickSelect} 
                  className={`${themeData.text} text-[8px] md:text-xs font-black uppercase tracking-widest hover:${themeData.accent} whitespace-nowrap`}
                >
                  CHỌN MÓN NHANH
                </button>
                <button 
                  onClick={() => setShowConciseMenu(true)} 
                  className={`hidden xl:block ${themeData.button} text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-stone-900 transition-all`}
                >
                  MENU ẢNH
                </button>
              </div>
              
              <button 
                onClick={onShowCart}
                className={`relative p-2 md:p-3 ${themeData.bg === 'bg-white' ? 'bg-stone-100' : 'bg-white/50'} rounded-full hover:bg-amber-100 transition-colors group`}
              >
                <ShoppingBag className={`w-4 h-4 md:w-6 md:h-6 ${themeData.text} group-hover:${themeData.accent}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className={`hidden sm:flex items-center gap-2 md:gap-4 border-l ${themeData.border} pl-4`}>
                <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-grab-food-inkythuatso-20-15-57-46.jpg" className="h-6 md:h-12 object-contain rounded-sm" alt="Grab" />
                <img src={SHOPEE_LOGO} className="h-6 md:h-12 object-contain" alt="Shopee" />
              </div>
            </>
          )}
        </div>
      </nav>

      {showConciseMenu && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-950/95 backdrop-blur-2xl p-4" onClick={() => setShowConciseMenu(false)}>
          <img 
            src={menuImageUrl || defaultMenuPhoto} 
            className="max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20" 
            alt="Menu" 
            referrerPolicy="no-referrer"
          />
          <button className="absolute top-5 right-5 text-white text-5xl hover:scale-120 transition-transform">×</button>
        </div>
      )}
    </>
  );
};

const ThemeSwitcher = ({ currentTheme, onThemeChange }: any) => {
  return (
    <div className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-stone-100 h-10 md:h-12 flex items-center justify-center gap-3 md:gap-8 px-4 overflow-x-auto no-scrollbar shadow-sm transition-all duration-500">
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-800 rounded-full animate-pulse" />
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 whitespace-nowrap">CHỌN MÀU SITE:</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 py-1">
        {(Object.keys(Theme) as Array<keyof typeof Theme>).map((key) => {
          const t = Theme[key];
          const themeData = THEMES[t];
          const isActive = currentTheme === t;
          return (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`group flex items-center gap-1.5 md:gap-3 px-3 md:px-5 py-1 md:py-1.5 rounded-full transition-all duration-500 border-2 ${isActive ? 'bg-stone-900 border-stone-900 text-white shadow-lg scale-105' : 'bg-white border-stone-100 text-stone-500 hover:border-stone-300 hover:bg-stone-50'}`}
            >
              <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110 ${themeData.bg}`} />
              <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter whitespace-nowrap ${isActive ? 'text-white' : 'text-stone-600'}`}>{themeData.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const HomePage = ({ menu, heroSlides, isLoading, supabase, currentTheme, onThemeChange, menuImageUrl, pollData, onVote }: any) => {
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

  // Poll Pop-up and Audio states
  const [showPollModal, setShowPollModal] = useState(false);
  const [votedChoice, setVotedChoice] = useState<string | null>(() => localStorage.getItem(VOTED_KEY));
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [customTrackUrl, setCustomTrackUrl] = useState<string>('');
  const [nhaccuatuiUrl, setNhaccuatuiUrl] = useState<string>(() => {
    return localStorage.getItem('ut-trinh-nhaccuatui-url') || 'https://www.nhaccuatui.com/playlist/L8Le1DOh8TQB';
  });
  const [randomBannerMessage, setRandomBannerMessage] = useState<string>('');

  const activeNhaccuatuiKey = useMemo(() => {
    return extractNhaccuatuiKey(customTrackUrl || pollData?.music_url || nhaccuatuiUrl);
  }, [customTrackUrl, pollData?.music_url, nhaccuatuiUrl]);
  
  // Music Filters & Search
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<'all' | 'vpop' | 'usuk' | 'kpop' | 'khongloi' | 'thien' | 'cafesax'>('all');
  const [musicSearchQuery, setMusicSearchQuery] = useState<string>('');

  // Initial Random Song pick so every user visit gets a fresh song
  const initialRandomTrack = useMemo(() => {
    if (!MULTI_GENRE_CATALOG || MULTI_GENRE_CATALOG.length === 0) {
      return {
        id: 'default',
        title: 'Cơm Phần Út Trinh Nhạc Nền',
        artist: 'Hòa Tấu Dân Ca',
        category: 'restaurant',
        genreKey: 'vpop' as const,
        url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97a8e7e13.mp3',
        badge: '🌾 Nhạc Út Trinh',
        sourceType: 'nhaccuatoi',
        sourceLabel: 'Bóc tách từ Nhaccuatui.com',
        nctLink: 'https://www.nhaccuatui.com'
      };
    }
    const randomIndex = Math.floor(Math.random() * MULTI_GENRE_CATALOG.length);
    return MULTI_GENRE_CATALOG[randomIndex];
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  // Filtered tracks based on selected genre & search
  const filteredCatalogTracks = useMemo(() => {
    if (!MULTI_GENRE_CATALOG || !Array.isArray(MULTI_GENRE_CATALOG)) return [];
    return MULTI_GENRE_CATALOG.filter(track => {
      if (!track) return false;
      const matchesGenre = selectedGenreFilter === 'all' || track.genreKey === selectedGenreFilter;
      const q = (musicSearchQuery || '').toLowerCase().trim();
      const matchesSearch = !q || 
        (track.title && track.title.toLowerCase().includes(q)) || 
        (track.artist && track.artist.toLowerCase().includes(q)) || 
        (track.badge && track.badge.toLowerCase().includes(q)) ||
        (track.sourceLabel && track.sourceLabel.toLowerCase().includes(q));
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenreFilter, musicSearchQuery]);

  const stopAmbientSynth = useCallback(() => {
    try {
      synthNodesRef.current.forEach(node => {
        try { if (node.stop) node.stop(); node.disconnect(); } catch { /* ignore */ }
      });
      synthNodesRef.current = [];
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch { /* ignore */ }
  }, []);

  const playAmbientSynth = useCallback(() => {
    try {
      stopAmbientSynth();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Spa & Thiền 432Hz / Solfeggio 528Hz Meditation Harmonics + Soft Ambient Chords
      const freqs = [136.1, 216.0, 271.2, 432.0, 528.0];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.05, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12 + i * 0.03, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.025, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        lfo.start();
        osc.start();
        synthNodesRef.current.push(osc, lfo, oscGain, lfoGain);
      });
      synthNodesRef.current.push(masterGain);
    } catch (e) {
      console.error("Web Audio Synth error:", e);
    }
  }, [stopAmbientSynth]);

  // Auto show poll modal if active and user hasn't voted or dismissed in session
  useEffect(() => {
    if (pollData?.is_active) {
      const hasVoted = localStorage.getItem(VOTED_KEY);
      const hasDismissed = sessionStorage.getItem('ut-trinh-poll-dismissed');
      if (!hasVoted && !hasDismissed) {
        const timer = setTimeout(() => {
          setShowPollModal(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [pollData?.is_active]);

  const activeMusicUrl = useMemo(() => {
    if (customTrackUrl) return customTrackUrl;
    if (pollData?.music_url && typeof pollData.music_url === 'string' && pollData.music_url.trim().length > 0 && !pollData.music_url.includes('DWcJFNfaw9c') && !pollData.music_url.includes('youtube.com') && !pollData.music_url.includes('youtu.be')) {
      return pollData.music_url;
    }
    return initialRandomTrack?.url || MULTI_GENRE_CATALOG[0]?.url || 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97a8e7e13.mp3';
  }, [customTrackUrl, pollData?.music_url, initialRandomTrack]);

  const currentTrackObj = useMemo(() => {
    const found = MULTI_GENRE_CATALOG.find(t => t.url === activeMusicUrl);
    if (found) return found;
    if (initialRandomTrack) return initialRandomTrack;
    return MULTI_GENRE_CATALOG[0] || {
      id: 'default',
      title: 'Cơm Phần Út Trinh Nhạc Nền',
      artist: 'Hòa Tấu Dân Ca',
      category: 'restaurant',
      genreKey: 'vpop',
      url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97a8e7e13.mp3',
      badge: '🌾 Nhạc Út Trinh',
      sourceType: 'nhaccuatoi',
      sourceLabel: 'Bóc tách từ Nhaccuatui.com',
      nctLink: 'https://www.nhaccuatui.com'
    };
  }, [activeMusicUrl, initialRandomTrack]);

  const youtubeId = useMemo(() => getYouTubeId(activeMusicUrl), [activeMusicUrl]);

  // Audio Playback Sync Effect
  useEffect(() => {
    if (isPlayingMusic && activeMusicUrl) {
      if (audioRef.current) {
        audioRef.current.src = activeMusicUrl;
        audioRef.current.play().catch(err => {
          console.warn("Audio element playback prevented or failed, activating WebAudio synth:", err);
          playAmbientSynth();
        });
      }
    } else if (!isPlayingMusic) {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
      }
      stopAmbientSynth();
    }
  }, [isPlayingMusic, activeMusicUrl, playAmbientSynth, stopAmbientSynth]);

  const togglePlayMusic = () => {
    if (!activeMusicUrl) return;
    if (isPlayingMusic) {
      if (audioRef.current) audioRef.current.pause();
      stopAmbientSynth();
      setIsPlayingMusic(false);
    } else {
      stopAmbientSynth();
      setIsPlayingMusic(true);
      if (!youtubeId && audioRef.current) {
        audioRef.current.play().catch(err => console.warn("Audio play error:", err));
      }
    }
  };

  const handleSelectPlaylistTrack = (trackUrl: string) => {
    stopAmbientSynth();
    setCustomTrackUrl(trackUrl);
    setIsPlayingMusic(true);
  };

  const handleUserVote = (option: 'yes' | 'no') => {
    try {
      if (onVote) onVote(option);
      setVotedChoice(option);
      try {
        localStorage.setItem(VOTED_KEY, option);
      } catch (e) {
        console.error("LocalStorage save vote error:", e);
      }
      if (option === 'yes') {
        setIsPlayingMusic(true);
        if (!youtubeId) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.src = activeMusicUrl;
              audioRef.current.load();
              audioRef.current.play()
                .then(() => setIsPlayingMusic(true))
                .catch(err => {
                  console.warn("Vote YES audio play failed, falling back to Ambient Synth:", err);
                  playAmbientSynth();
                  setIsPlayingMusic(true);
                });
            } else {
              playAmbientSynth();
              setIsPlayingMusic(true);
            }
          }, 200);
        }
      } else if (option === 'no') {
        setIsPlayingMusic(false);
        stopAmbientSynth();
        if (audioRef.current) {
          try { 
            audioRef.current.pause(); 
          } catch (err) {
            console.error("Audio pause error:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error handling vote:", err);
    }
  };

  const themeData = THEMES[currentTheme];

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
      const VISIT_EXPIRY = 30 * 60 * 1000; // 30 minutes
      const now = Date.now();
      const lastVisit = localStorage.getItem(SESSION_VISIT_KEY);
      const isNewVisit = !lastVisit || (now - parseInt(lastVisit) > VISIT_EXPIRY);

      try {
        // Fetch total views from Supabase - using maybeSingle to avoid error if row missing
        const { data } = await supabase.from('site_stats').select('total_views').eq('id', 1).maybeSingle();
        
        // Use 372 as a base if the database is empty or has a lower value
        // This ensures the counter doesn't "go backwards"
        const dbViews = data?.total_views || 0;
        const savedViews = localStorage.getItem(VIEW_COUNT_KEY);
        const localViews = savedViews ? parseInt(savedViews) : 372;
        
        let currentViews = Math.max(dbViews, localViews);
        
        if (isNewVisit) {
          currentViews += 1;
          // Use upsert to ensure the row exists and is updated
          await supabase.from('site_stats').upsert({ id: 1, total_views: currentViews });
          localStorage.setItem(SESSION_VISIT_KEY, now.toString());
        }
        
        setTotalViews(currentViews);
        localStorage.setItem(VIEW_COUNT_KEY, currentViews.toString());
      } catch (err) {
        console.warn("Supabase stats error, falling back to local storage:", err);
        const savedViews = localStorage.getItem(VIEW_COUNT_KEY);
        let currentViews = savedViews ? parseInt(savedViews) : 372;
        if (isNewVisit) {
          currentViews += 1;
          localStorage.setItem(VIEW_COUNT_KEY, currentViews.toString());
          localStorage.setItem(SESSION_VISIT_KEY, now.toString());
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
    return total;
  };

  return (
    <div className={`min-h-screen ${themeData.bg} ${themeData.font} ${themeData.text} transition-colors duration-500`}>
      <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
      <Nav 
        onShowQuickSelect={() => setShowQuickSelect(true)} 
        cartCount={cartCount}
        onShowCart={() => setShowCart(true)}
        theme={currentTheme}
        menuImageUrl={menuImageUrl}
      />
      
      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[160] flex items-center justify-end bg-stone-950/60 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div className={`${themeData.bg} w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-left`} onClick={e => e.stopPropagation()}>
            <div className={`p-6 border-b ${themeData.border} flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <ShoppingBag className={themeData.accent} />
                <h2 className={`text-xl font-black uppercase tracking-tighter ${themeData.text}`}>GIỎ HÀNG CỦA BẠN</h2>
              </div>
              <button onClick={() => setShowCart(false)} className={`text-3xl ${themeData.text} opacity-30 hover:opacity-100`}>×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className={`w-20 h-20 ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/30'} rounded-full flex items-center justify-center text-stone-300`}>
                    <ShoppingBag size={40} />
                  </div>
                  <p className={`${themeData.text} opacity-40 font-bold`}>Giỏ hàng đang trống.<br/>Hãy chọn món ngay!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="flex-1 space-y-1">
                      <h4 className={`font-black ${themeData.text} uppercase text-sm tracking-tight`}>{item.name}</h4>
                      <p className={`${themeData.accent} font-black text-xs`}>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                    <div className={`flex items-center gap-3 ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/50'} rounded-xl p-1`}>
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"><Minus size={14}/></button>
                      <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))
              )}
            </div>

            <div className={`p-6 ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/30'} border-t ${themeData.border} space-y-4`}>
              <div className="flex justify-between items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${themeData.text} opacity-40`}>TỔNG CỘNG</span>
                <span className={`text-3xl font-black ${themeData.accent} tabular-nums`}>{cartTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <button 
                onClick={() => { setShowOrderConfirmModal(true); setShowCart(false); }}
                className={`w-full ${themeData.button} text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl`}
              >
                XÁC NHẬN ĐƠN HÀNG
              </button>
              <p className={`text-[9px] ${themeData.text} opacity-40 font-bold italic leading-relaxed text-center pt-2`}>
                Lưu ý: đây là chức năng giả lập chứ không phải đặt hàng Online hoặc đặt qua Apps các bạn nhé, nhưng các bạn cứ thoải mái chọn món cho vào giỏ hàng theo túi ví của mình rồi Alo theo số Hotline để các bạn tự lại quán lấy nhé ( Pre-Order ) !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Select Modal */}
      {showQuickSelect && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/98 backdrop-blur-3xl p-2 md:p-4" onClick={() => { setShowQuickSelect(false); setQuickSelectPath([]); }}>
          <div className={`${themeData.bg} w-full max-w-4xl rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]`} onClick={e => e.stopPropagation()}>
            <div className={`p-4 md:p-8 border-b ${themeData.border} flex justify-between items-center ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/20'}`}>
              <div className="space-y-1">
                <h2 className={`text-base md:text-2xl font-black uppercase tracking-tighter ${themeData.text}`}>CHỌN MÓN NHANH</h2>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <button onClick={() => setQuickSelectPath([])} className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${themeData.accent} hover:underline`}>BẮT ĐẦU</button>
                  {quickSelectPath.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-stone-300">/</span>
                      <button 
                        onClick={() => setQuickSelectPath(quickSelectPath.slice(0, idx + 1))}
                        className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${themeData.text} whitespace-nowrap`}
                      >
                        {item.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <button onClick={() => { setShowQuickSelect(false); setQuickSelectPath([]); }} className={`text-2xl md:text-4xl ${themeData.text} opacity-30 hover:opacity-100 transition-colors`}>×</button>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
              {currentQuickOptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {currentQuickOptions.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setQuickSelectPath([...quickSelectPath, option])}
                      className={`group p-4 md:p-6 border ${themeData.border} rounded-2xl md:rounded-3xl hover:border-amber-800 hover:bg-amber-50/30 transition-all text-left flex justify-between items-center bg-white/40`}
                    >
                      <div className="space-y-1">
                        <span className={`text-sm md:text-lg font-black uppercase tracking-tighter ${themeData.text} group-hover:${themeData.accent}`}>{option.name}</span>
                        {option.price && option.price > 0 ? (
                          <p className={`${themeData.accent} font-black text-xs md:text-sm`}>{option.price.toLocaleString('vi-VN')} VNĐ</p>
                        ) : null}
                      </div>
                      <ChevronRight className={`w-4 h-4 md:w-6 md:h-6 ${themeData.text} opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-12 space-y-4 md:space-y-8">
                  <div className={`w-16 h-16 md:w-24 md:h-24 ${themeData.bg === 'bg-white' ? 'bg-amber-100' : 'bg-white/50'} rounded-full flex items-center justify-center mx-auto ${themeData.accent}`}>
                    <UtensilsCrossed size={30} />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h3 className={`text-xl md:text-3xl font-black uppercase tracking-tighter ${themeData.text}`}>BẠN CÓ MUỐN CHỌN ?</h3>
                    <p className={`${themeData.text} opacity-60 italic text-sm md:text-lg`}>
                      {quickSelectPath.map(i => i.name).join(' - ')}
                    </p>
                  </div>
                  <div className={`text-3xl md:text-5xl font-black ${themeData.accent} tabular-nums`}>
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
                      className={`${themeData.button} text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl`}
                    >
                      THÊM VÀO GIỎ
                    </button>
                    <button 
                      onClick={() => { setShowQuickSelect(false); setQuickSelectPath([]); }}
                      className={`bg-white/50 ${themeData.text} px-8 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] hover:bg-white transition-all border ${themeData.border}`}
                    >
                      CHỌN LẠI
                    </button>
                  </div>
                </div>
              )}
            </div>

            {quickSelectPath.length > 0 && (
              <div className={`p-4 md:p-6 ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/20'} border-t ${themeData.border} flex justify-center`}>
                <button 
                  onClick={() => setQuickSelectPath(quickSelectPath.slice(0, -1))} 
                  className={`text-xs md:text-sm font-black uppercase tracking-[0.2em] ${themeData.accent} hover:brightness-125 transition-colors flex items-center gap-2`}
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
          <div className={`${themeData.bg} rounded-[40px] shadow-2xl max-w-2xl w-full p-10 md:p-16 relative overflow-hidden text-center border-t-[12px] border-${themeData.primary} animate-[popIn_0.5s_ease-out]`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowOrderConfirmModal(false)} className={`absolute top-8 right-8 ${themeData.text} opacity-30 hover:opacity-100 text-4xl transition-all`}>×</button>
            <div className="space-y-8">
              <span className={`${themeData.accent} font-black text-xs md:text-sm tracking-[0.6em] uppercase block`}>Xác nhận đơn hàng</span>
              <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter ${themeData.text} leading-tight`}>CẢM ƠN BẠN!</h2>
              <div className={`w-16 h-1 ${themeData.button} mx-auto rounded-full`}></div>
              <p className={`${themeData.text} opacity-70 text-lg md:text-xl font-bold leading-relaxed`}>
                Cảm ơn bạn đã chọn món! Đây là chức năng tính món theo ví nên Quán không thể giao hàng cho bạn được.
              </p>
              <div className={`${themeData.bg === 'bg-white' ? 'bg-amber-50' : 'bg-white/20'} p-6 rounded-3xl border ${themeData.border}`}>
                <p className={`${themeData.text} text-base md:text-lg font-black leading-relaxed`}>
                  Bạn có thể đặt hàng bằng cách gọi <span className={`text-2xl block mt-2 ${themeData.accent}`}>0939.70.90.20</span>
                  <span className="text-sm block mt-2 opacity-70">Để LIỆT KÊ những món bạn đặt và vui lòng lại quán nhận đơn hàng nhé!</span>
                </p>
              </div>
              <button onClick={() => setShowOrderConfirmModal(false)} className={`${themeData.button} text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl`}>ĐÃ HIỂU</button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Notification Popup */}
      {showTetPopup && activeNotif && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4">
          <div className={`${themeData.bg} rounded-[40px] shadow-2xl max-w-2xl w-full p-10 md:p-16 relative overflow-hidden text-center border-t-[12px] border-${themeData.primary} animate-[popIn_0.5s_ease-out]`}>
            <button onClick={() => setShowTetPopup(false)} className={`absolute top-8 right-8 ${themeData.text} opacity-30 hover:opacity-100 text-4xl transition-all`}>×</button>
            <div className="space-y-8">
              <span className={`${themeData.accent} font-black text-xs md:text-sm tracking-[0.6em] uppercase block`}>Thông báo từ quán</span>
              <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${themeData.text} leading-tight`}>THÔNG BÁO</h2>
              <div className={`w-16 h-1 ${themeData.button} mx-auto rounded-full`}></div>
              <p className={`${themeData.text} text-lg md:text-2xl font-bold leading-relaxed whitespace-pre-line`}>
                {activeNotif.message}
              </p>
              <div className="pt-6">
                <p className={`${themeData.accent} text-sm md:text-lg italic font-black uppercase tracking-wide`}>
                  {activeNotif.footer || "XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI."}
                </p>
              </div>
              <button onClick={() => setShowTetPopup(false)} className={`${themeData.button} text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl`}>ĐÃ HIỂU</button>
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
          <span className={`${themeData.accent} text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-6 block animate-pulse`}>Tinh hoa ẩm thực Việt</span>
          <h1 className="text-white text-5xl md:text-[130px] font-black tracking-tighter leading-none mb-8 drop-shadow-2xl">ÚT TRINH<br/><span className={`${themeData.accent} italic`}>KITCHEN</span></h1>
          <p className="text-white/90 text-lg md:text-3xl font-light italic leading-relaxed">"{heroSlides[currentSlide]?.quote || 'Nơi lưu giữ hương vị cơm nhà truyền thống'}"</p>
        </div>
      </header>

      {/* Menu List */}
      <main id="menu" className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-20 space-y-6">
          <h2 className={`text-4xl md:text-8xl font-black tracking-tighter uppercase ${themeData.text}`}>Món Ăn Đặc Sắc</h2>
          <div className={`flex flex-wrap justify-center gap-4 md:gap-12 border-b ${themeData.border} pb-8`}>
            {Object.values(Category).map((cat) => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${activeFilter === cat ? `border-${themeData.primary} ${themeData.accent}` : 'border-transparent text-stone-300 hover:text-stone-900'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {paginatedMenu.map((dish: Dish) => (
            <div key={dish.id} onClick={() => setSelectedIdx(filteredMenu.findIndex(d => d.id === dish.id))} className={`${themeData.card} rounded-[40px] overflow-hidden border ${themeData.border} hover:shadow-2xl transition-all duration-700 cursor-pointer group p-6`}>
              <div className="aspect-square rounded-[35px] overflow-hidden mb-8 relative">
                <img src={dish.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className={`absolute top-5 right-5 ${themeData.footer} backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest`}>{dish.category}</div>
              </div>
              <div className="px-2 space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                  <h3 className={`font-black text-2xl md:text-3xl uppercase tracking-tighter leading-tight group-hover:${themeData.accent} transition-colors`}>{dish.name}</h3>
                  <span className={`${themeData.accent} font-black text-2xl tracking-tighter`}>{dish.price}</span>
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
          <div key={selectedDish.id} className={`w-full h-full md:w-[90vw] md:h-[85vh] ${themeData.bg} md:rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative transition-all duration-1000 animate-[fadeIn_0.8s_ease-out]`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedIdx(null)} className={`absolute top-8 right-8 z-[190] ${themeData.text} opacity-30 hover:opacity-100 text-5xl transition-all`}>×</button>
            <div className="w-full h-[40vh] md:h-auto md:w-[55%] bg-black overflow-hidden">
              <img src={selectedDish.image_url} className="w-full h-full object-cover animate-[scaleSlow_10s_linear_infinite]" />
            </div>
            <div className={`flex-1 p-12 md:p-20 flex flex-col justify-center ${themeData.bg} space-y-8`}>
              <span className="bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] px-4 py-2 rounded-md self-start">CƠM PHẦN ÚT TRINH</span>
              <h2 className={`text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none ${themeData.text}`}>{selectedDish.name}</h2>
              <div className={`text-4xl md:text-6xl font-black ${themeData.accent} tabular-nums`}>{selectedDish.price}</div>
              <p className={`${themeData.text} opacity-60 text-lg md:text-xl italic font-light leading-relaxed max-w-lg`}>"{selectedDish.description || 'Món ăn truyền thống chuẩn vị mẹ nấu.'}"</p>
              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={() => {
                    const priceNum = parseInt(selectedDish.price.replace(/\D/g, ''));
                    addToCart(selectedDish.name, priceNum);
                    setSelectedIdx(null);
                  }}
                  className={`${themeData.button} text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl active:scale-95`}
                >
                  THÊM VÀO GIỎ
                </button>
                <span className={`${themeData.bg === 'bg-white' ? 'bg-stone-100' : 'bg-white/30'} ${themeData.text} px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] self-start`}>{selectedDish.category}</span>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 ${themeData.accent} opacity-30 w-full`}>
              <div key={`progress-${selectedDish.id}`} className={`h-full ${themeData.accent} animate-[progress_10s_linear_forwards]`}></div>
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
      <section className={`${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/10'} py-24 px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className={`${themeData.accent} font-black uppercase tracking-[0.4em] text-[10px]`}>Kết nối với quán</span>
              <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${themeData.text}`}>GÓP Ý & LỜI CHÚC</h2>
              <p className={`${themeData.text} opacity-60 italic`}>"Mọi ý kiến đóng góp của quý khách là động lực để Út Trinh hoàn thiện hơn mỗi ngày."</p>
            </div>

            <form onSubmit={handleGuestbookSubmit} className={`${themeData.card} p-8 md:p-12 rounded-[40px] shadow-xl border ${themeData.border}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${themeData.text} opacity-40 ml-4`}>Họ và Tên</label>
                  <input 
                    type="text" 
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={`w-full ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/30'} border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-${themeData.primary} outline-none transition-all`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${themeData.text} opacity-40 ml-4`}>Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className={`w-full ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/30'} border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-${themeData.primary} outline-none transition-all`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${themeData.text} opacity-40 ml-4`}>Nội dung góp ý / Lời chúc</label>
                <textarea 
                  rows={4}
                  value={guestContent}
                  onChange={e => setGuestContent(e.target.value)}
                  placeholder="Nhập nội dung tại đây..."
                  className={`w-full ${themeData.bg === 'bg-white' ? 'bg-stone-50' : 'bg-white/30'} border-none rounded-3xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-${themeData.primary} outline-none transition-all resize-none`}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmittingGuestbook}
                className={`w-full ${themeData.button} text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3`}
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
              <h3 className={`text-2xl font-black uppercase tracking-tighter ${themeData.text}`}>Lời chúc mới nhất</h3>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto max-h-[600px] pr-4 no-scrollbar">
              {guestbookEntries.length === 0 ? (
                <div className={`h-full flex flex-col items-center justify-center text-center space-y-4 py-20 ${themeData.card} rounded-[40px] border border-dashed ${themeData.border}`}>
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
                          className={`p-8 rounded-[35px] shadow-sm border space-y-4 hover:shadow-md transition-all group ${themeData.border} ${themeData.card}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase ${colorSet.avatar}`}>
                                {entry.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-black ${themeData.text} uppercase text-sm tracking-tight`}>{entry.name}</h4>
                                  <span className={`text-[8px] font-black ${themeData.text} opacity-40 bg-stone-100 px-1.5 py-0.5 rounded-md tracking-widest`}>{maskedPhone}</span>
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
                      className={`w-full py-4 text-[10px] font-black ${themeData.accent} uppercase tracking-widest hover:bg-white/20 rounded-2xl transition-all border border-dashed ${themeData.border} mt-4`}
                    >
                      Xem tất cả {guestbookEntries.length} góp ý
                    </button>
                  )}
                  
                  {showAllGuestbook && (
                    <button 
                      onClick={() => setShowAllGuestbook(false)}
                      className={`w-full py-4 text-[10px] font-black ${themeData.text} opacity-40 uppercase tracking-widest hover:bg-white/20 rounded-2xl transition-all border border-dashed ${themeData.border} mt-4`}
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
      <footer className={`${themeData.footer} text-white pt-32 pb-16 px-10 relative`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4"><img src="https://i.postimg.cc/5tdmrBLb/6d45d4f.png" className="w-16 h-16 md:w-20 md:h-20" /><span className="text-2xl font-black">ÚT TRINH</span></div>
            <p className="text-white/60 text-sm leading-relaxed font-medium italic">"Hương vị cơm nhà tinh túy – Nơi tìm lại những giá trị nguyên bản nhất của ẩm thực Việt"</p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/comphanuttrinh/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all"><Facebook size={18} /></a>
              <a href="mailto:comphanuttrinh@gmail.com" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all"><Mail size={18} /></a>
              <a href="https://www.youtube.com/@comphanuttrinh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all"><Youtube size={18} /></a>
            </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Thực đơn</h4>
            <ul className="space-y-4">
              {Object.values(Category).slice(1).map(cat => (
                <li key={cat}><a href="#menu" onClick={() => setActiveFilter(cat)} className="text-sm font-bold hover:text-amber-500 transition-colors uppercase tracking-tight">{cat}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Liên hệ</h4>
            <div className="space-y-4">
              <p className="text-sm font-bold leading-relaxed">Địa chỉ: 158A đường Trần Vĩnh Kiết. Phường Tân An, Quận Ninh Kiều, TP Cần Thơ</p>
              <p className="text-sm font-bold">Hotline: 0939.70.90.20</p>
              <p className="text-sm font-bold">Email: comphanuttrinh@gmail.com</p>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Thống kê</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-500"><Users size={20} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Tổng lượt xem</p>
                  <p className="text-2xl font-black tabular-nums">{totalViews.toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 animate-pulse"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Đang trực tuyến</p>
                  <p className="text-2xl font-black tabular-nums">{onlineCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`pt-16 border-t border-white/10 text-center space-y-4`}>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">© 2026 CƠM PHẦN ÚT TRINH. ALL RIGHTS RESERVED.</p>
          <p className="text-[9px] font-bold italic text-amber-500/60 tracking-widest">CƠM PHẦN ÚT TRINH @ EST 2019</p>
        </div>
      </footer>

      {/* Floating Player Widget (No iframe login walls) */}
      {isPlayingMusic && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-[100] bg-stone-950/95 border-2 border-emerald-500/60 text-white rounded-3xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2 w-[300px] sm:w-[350px] transition-all duration-300 animate-slide-up">
          {/* Header Track Info & Quick Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-emerald-600 border-2 border-emerald-400/80 flex items-center justify-center shrink-0 shadow-lg ${isPlayingMusic ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                <Music size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black truncate text-amber-300">
                  {currentTrackObj.title}
                </p>
                <p className="text-[9px] text-emerald-400 font-bold truncate flex items-center gap-1">
                  <span>{currentTrackObj.artist}</span>
                  <span className="text-[8px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded border border-emerald-800 shrink-0">
                    Bóc tách từ Nhaccuatui
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={togglePlayMusic}
                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition-all cursor-pointer shadow-md"
                title={isPlayingMusic ? "Tạm dừng" : "Phát nhạc"}
              >
                {isPlayingMusic ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => setShowPollModal(true)}
                className="px-2 py-1 bg-amber-800 hover:bg-amber-700 rounded-lg text-white text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm"
                title="Mở kho 6 tab Nhaccuatui"
              >
                Đổi Bài
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlayingMusic(false);
                  stopAmbientSynth();
                }}
                className="p-1.5 hover:bg-red-500/20 rounded-full text-stone-400 hover:text-red-400 transition-all cursor-pointer"
                title="Tắt nhạc"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Playback Controller */}
          <div className="bg-stone-900/90 rounded-2xl p-2 border border-stone-800 flex items-center justify-between gap-2 text-[10px]">
            <span className="text-stone-400 font-medium truncate flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang phát mượt 100%
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * MULTI_GENRE_CATALOG.length);
                  handleSelectPlaylistTrack(MULTI_GENRE_CATALOG[randomIndex].url);
                }}
                className="text-amber-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                title="Bóc tách ngẫu nhiên bài khác"
              >
                <Shuffle size={12} /> Ngẫu nhiên
              </button>
              <a
                href={currentTrackObj.nctLink || 'https://www.nhaccuatui.com'}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer underline"
                title="Mở bản gốc trên Nhaccuatui.com"
              >
                <ExternalLink size={10} /> NCT.com ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Poll & Music Button */}
      <div className="fixed bottom-6 left-6 z-[90] flex items-center gap-2">
        <button
          onClick={() => setShowPollModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-800 to-amber-950 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-white/30 text-xs font-black uppercase tracking-wider group cursor-pointer"
        >
          <div className={`p-1.5 rounded-full ${isPlayingMusic ? 'bg-emerald-500 animate-spin' : 'bg-amber-600'}`}>
            <Music size={14} className="text-white" />
          </div>
          <span>{isPlayingMusic ? 'ĐANG PHÁT NHẠC' : 'NHẠC NỀN & PLAYLIST'}</span>
          <span className="bg-emerald-500 text-[9px] px-2 py-0.5 rounded-full text-white font-bold ml-1 uppercase shadow-sm">BẮT ĐẦU</span>
        </button>
        {activeMusicUrl && (
          <button
            onClick={togglePlayMusic}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-110 border-2 border-white/30 cursor-pointer ${isPlayingMusic ? 'bg-emerald-600 animate-pulse' : 'bg-stone-800'}`}
            title={isPlayingMusic ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          >
            {isPlayingMusic ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        )}
      </div>

      {/* Poll Modal Popup */}
      {showPollModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[35px] max-w-2xl w-full p-6 md:p-8 shadow-2xl border-2 border-amber-800/20 relative overflow-hidden max-h-[90vh] flex flex-col">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <button 
              onClick={() => {
                setShowPollModal(false);
                sessionStorage.setItem('ut-trinh-poll-dismissed', 'true');
              }}
              className="absolute top-5 right-5 w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center text-xl font-bold transition-all z-10"
            >
              ×
            </button>

            <div className="text-center space-y-4 overflow-y-auto pr-1">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Vote size={14} className="text-amber-800" />
                <span>BÌNH CHỌN Ý KIẾN KHÁCH HÀNG</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-stone-900 leading-tight">
                {pollData?.question || "Bạn muốn nghe nhạc trên trang chủ CPUT không ?"}
              </h3>

              {!votedChoice ? (
                <div className="pt-4 space-y-3">
                  <p className="text-xs text-stone-500 font-medium italic">Vui lòng chọn ý kiến của bạn:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUserVote('yes');
                      }}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Music size={18} />
                      <span>Có, Muốn Nghe 🎵</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUserVote('no');
                      }}
                      className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 p-4 rounded-2xl font-black text-sm uppercase tracking-wider active:scale-95 transition-all border border-stone-200 cursor-pointer"
                    >
                      <VolumeX size={18} />
                      <span>Không, Cảm Ơn 🔇</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 space-y-5 text-left bg-stone-50 p-5 md:p-6 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-900 tracking-wider">KẾT QUẢ BÌNH CHỌN TRỰC TUYẾN</span>
                    <span className="text-[10px] font-black uppercase text-stone-400">
                      TỔNG: {(((pollData?.yes_votes || 0)) + ((pollData?.no_votes || 0))).toLocaleString('vi-VN')} PHIẾU
                    </span>
                  </div>

                  {/* Percentage Bar */}
                  {(() => {
                    const yesVotes = Number(pollData?.yes_votes) || 0;
                    const noVotes = Number(pollData?.no_votes) || 0;
                    const total = yesVotes + noVotes;
                    const yesPct = total > 0 ? Math.round((yesVotes / total) * 100) : 0;
                    const noPct = total > 0 ? Math.round((noVotes / total) * 100) : 0;

                    return (
                      <div className="space-y-4">
                        {/* Yes Option */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-stone-800">
                            <span className="flex items-center gap-1.5 text-emerald-700">
                              <Check size={14} /> Có, Muốn nghe nhạc {votedChoice === 'yes' && <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded font-black">(Lựa chọn của bạn)</span>}
                            </span>
                            <span className="font-black tabular-nums">{yesPct}% ({yesVotes})</span>
                          </div>
                          <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                              style={{ width: `${yesPct}%` }}
                            />
                          </div>
                        </div>

                        {/* No Option */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-stone-800">
                            <span className="flex items-center gap-1.5 text-stone-600">
                              <X size={14} /> Không muốn nghe {votedChoice === 'no' && <span className="bg-stone-200 text-stone-700 text-[8px] px-1.5 py-0.5 rounded font-black">(Lựa chọn của bạn)</span>}
                            </span>
                            <span className="font-black tabular-nums">{noPct}% ({noVotes})</span>
                          </div>
                          <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="bg-stone-400 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${noPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Music Playlist Table for voted users (6 Tab Categories) */}
                  {votedChoice && (
                    <div className="pt-4 border-t border-stone-200 space-y-4">
                      {randomBannerMessage && (
                        <div className="bg-amber-100 border-2 border-amber-800/40 text-amber-950 p-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 animate-bounce">
                          <span>{randomBannerMessage}</span>
                          <button onClick={() => setRandomBannerMessage('')} className="text-amber-900 hover:text-black font-black px-1.5">✕</button>
                        </div>
                      )}

                      {/* CURRENT PLAYING BAR & ACTIVE TRACK CONTROLLER */}
                      <div className="bg-stone-900 border-2 border-emerald-500/80 rounded-3xl p-3.5 text-white shadow-xl space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping shrink-0" />
                            <span className="text-amber-300 font-black text-xs md:text-sm truncate uppercase tracking-wider">
                              📻 {currentTrackObj.title}
                            </span>
                          </div>
                          <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0 shadow-sm">
                            {currentTrackObj.badge}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="text-[11px] text-stone-300">
                            Thực hiện bóc tách từ <strong className="text-amber-400">www.nhaccuatui.com</strong> • Nghệ sĩ: <span className="text-white font-bold">{currentTrackObj.artist}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={togglePlayMusic}
                              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${isPlayingMusic ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                            >
                              {isPlayingMusic ? <><Pause size={14} /> Tạm dừng</> : <><Play size={14} /> Phát nhạc</>}
                            </button>
                            <a
                              href={currentTrackObj.nctLink || 'https://www.nhaccuatui.com'}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-stone-800 hover:bg-stone-700 text-amber-300 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
                              title="Nghe trực tiếp trên Nhaccuatui.com"
                            >
                              <ExternalLink size={12} /> NCT.com ↗
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* 6 NHẠC TAB BUTTONS FROM NHACCUATUI */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                            📑 CHỌN NGUỒN NHẠC BÓC TÁCH (NHACCUATUI.COM):
                          </span>
                          <span className="text-[10px] text-stone-500 font-bold">6 Thể loại chọn lọc</span>
                        </div>

                        {/* 6 Category Tabs Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
                          {[
                            { key: 'vpop', label: 'Nhạc Việt', icon: '🇻🇳', count: MULTI_GENRE_CATALOG.filter(t => t.genreKey === 'vpop').length },
                            { key: 'usuk', label: 'Âu - Mỹ', icon: '🌎', count: MULTI_GENRE_CATALOG.filter(t => t.genreKey === 'usuk').length },
                            { key: 'kpop', label: 'Hàn Quốc', icon: '🇰🇷', count: MULTI_GENRE_CATALOG.filter(t => t.genreKey === 'kpop').length },
                            { key: 'khongloi', label: 'Không Lời', icon: '🎹', count: MULTI_GENRE_CATALOG.filter(t => t.genreKey === 'khongloi').length },
                            { key: 'thien', label: 'Thiền', icon: '🧘', count: MULTI_GENRE_CATALOG.filter(t => t.genreKey === 'thien').length },
                            { key: 'cafesax', label: 'Cafe', icon: '🎷', count: MULTI_GENRE_CATALOG.filter(t => t.genreKey === 'cafesax').length },
                          ].map(tab => {
                            const isSelected = selectedGenreFilter === tab.key;
                            return (
                              <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedGenreFilter(tab.key as any)}
                                className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-sm ${
                                  isSelected 
                                    ? 'bg-amber-800 text-white border-amber-900 font-black ring-2 ring-amber-600 scale-[1.02]' 
                                    : 'bg-stone-50 hover:bg-amber-100 text-stone-800 border-stone-200'
                                }`}
                              >
                                <span className="text-base">{tab.icon}</span>
                                <span className="text-[11px] font-bold leading-tight">{tab.label}</span>
                                <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-amber-950 text-amber-200' : 'bg-stone-200 text-stone-600'}`}>
                                  {tab.count} bài
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SEARCH & RESET BAR */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 bg-stone-100 p-2 rounded-2xl border border-stone-200">
                        <div className="relative flex-1 w-full">
                          <input
                            type="text"
                            placeholder="Tìm tên bài hát, ca sĩ bóc tách từ Nhaccuatui..."
                            value={musicSearchQuery}
                            onChange={(e) => setMusicSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded-xl text-xs outline-none bg-white focus:ring-2 focus:ring-amber-500"
                          />
                          <Music size={14} className="absolute left-2.5 top-2 text-stone-400" />
                        </div>
                        {selectedGenreFilter !== 'all' && (
                          <button
                            type="button"
                            onClick={() => setSelectedGenreFilter('all')}
                            className="text-[10px] font-black text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer"
                          >
                            Tất cả 6 Thể loại ({MULTI_GENRE_CATALOG.length})
                          </button>
                        )}
                      </div>

                      {/* TRACKS LISTING FOR SELECTED TAB */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-amber-900 tracking-wider">
                          <span>
                            🎶 TẤT CẢ BÀI HÁT TỪ NGUỒN NHACCUATUI ({filteredCatalogTracks.length} BÀI):
                          </span>
                          <span className="text-stone-500 text-[9px] font-normal">
                            Bấm chọn bài bất kỳ để phát ngay
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                          {filteredCatalogTracks.length === 0 ? (
                            <div className="col-span-2 text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-xs text-stone-500 font-medium">
                              Không tìm thấy bài hát nào. 
                              <button 
                                onClick={() => { setMusicSearchQuery(''); setSelectedGenreFilter('all'); }}
                                className="block mx-auto mt-2 text-amber-800 font-bold underline cursor-pointer"
                              >
                                Xem toàn bộ {MULTI_GENRE_CATALOG.length} bài hát
                              </button>
                            </div>
                          ) : (
                            filteredCatalogTracks.map(track => {
                              const isActive = activeMusicUrl === track.url;
                              return (
                                <div
                                  key={track.id}
                                  className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 shadow-sm ${
                                    isActive 
                                      ? 'bg-amber-100/90 border-amber-800 text-amber-950 ring-2 ring-amber-700 font-bold' 
                                      : 'bg-white hover:bg-amber-50/80 border-stone-200 text-stone-800'
                                  }`}
                                >
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <span className="text-xs font-black truncate block text-amber-950">{track.title}</span>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] text-stone-600 font-medium truncate">{track.artist}</span>
                                      <span className="text-[8px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-black shrink-0">
                                        {track.badge}
                                      </span>
                                      <span className="text-[8px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold shrink-0">
                                        Bóc tách Nhaccuatui
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleSelectPlaylistTrack(track.url)}
                                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                                        isActive && isPlayingMusic
                                          ? 'bg-emerald-600 text-white animate-pulse'
                                          : 'bg-amber-800 hover:bg-amber-900 text-white'
                                      }`}
                                    >
                                      {isActive && isPlayingMusic ? <><Pause size={10} /> ĐANG PHÁT</> : <><Play size={10} /> PHÁT</>}
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center text-[10px] text-stone-400 font-bold">
                    <button 
                      onClick={() => setVotedChoice(null)}
                      className="underline hover:text-amber-800 transition-colors"
                    >
                      Đổi ý kiến bầu chọn
                    </button>
                    <button
                      onClick={() => {
                        setShowPollModal(false);
                        sessionStorage.setItem('ut-trinh-poll-dismissed', 'true');
                      }}
                      className="bg-stone-900 text-white px-5 py-2 rounded-xl uppercase tracking-widest font-black hover:bg-amber-800 transition-all"
                    >
                      ĐÓNG
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden HTML5 Audio Element for direct stream playback */}
      <audio
        ref={audioRef}
        src={activeMusicUrl}
        loop
        onEnded={() => {
          const randomIndex = Math.floor(Math.random() * MULTI_GENRE_CATALOG.length);
          handleSelectPlaylistTrack(MULTI_GENRE_CATALOG[randomIndex].url);
        }}
        onError={(e) => {
          console.warn("HTML5 audio stream error, falling back to WebAudio Synth:", e);
          if (isPlayingMusic) playAmbientSynth();
        }}
      />
    </div>
  );
};

const AdminPanel = ({ menu, setMenu, heroSlides, setHeroSlides, onSave, supabase, theme, onThemeChange, menuImageUrl, setMenuImageUrl, pollData, onSavePoll }: any) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'notifications' | 'quick' | 'guestbook' | 'stats' | 'poll'>('menu');
  const themeData = THEMES[theme as Theme] || THEMES[Theme.White];
  const [notifications, setNotifications] = useState<any[]>([]);
  const [guestbookItems, setGuestbookItems] = useState<GuestbookEntry[]>([]);
  const [newNotif, setNewNotif] = useState('');
  const [newFooter, setNewFooter] = useState('XIN CHÚC BẠN VÀ GIA ĐÌNH SỨC KHỎE VÀ PHÁT TÀI.');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickMenuItems, setQuickMenuItems] = useState<any[]>([]);
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [totalViews, setTotalViews] = useState<number>(0);
  const [localMenuImageUrl, setLocalMenuImageUrl] = useState<string>(menuImageUrl || '');
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);

  const [localPoll, setLocalPoll] = useState<VotePoll>(pollData || {
    is_active: true,
    question: 'Bạn muốn nghe nhạc trên trang chủ CPUT không ?',
    music_url: '',
    yes_votes: 18,
    no_votes: 4
  });

  const [adminVPopTracks, setAdminVPopTracks] = useState<PlaylistItem[]>(() => {
    const shuffled = [...VPOP_TRENDING_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  });

  const handleAdminShuffleVPop = () => {
    const shuffled = [...VPOP_TRENDING_POOL].sort(() => 0.5 - Math.random());
    setAdminVPopTracks(shuffled.slice(0, 6));
  };

  useEffect(() => {
    if (pollData) setLocalPoll(pollData);
  }, [pollData]);

  const fetchStats = useCallback(async () => {
    const { data } = await supabase.from('site_stats').select('total_views, menu_image_url').eq('id', 1).maybeSingle();
    if (data) {
      setTotalViews(data.total_views);
      if (data.menu_image_url) {
        setMenuImageUrl(data.menu_image_url);
        setLocalMenuImageUrl(data.menu_image_url);
      }
    }
  }, [supabase, setMenuImageUrl]);

  const updateStats = async () => {
    setIsUpdatingStats(true);
    try {
      const { error } = await supabase.from('site_stats').upsert({ 
        id: 1, 
        total_views: totalViews,
        menu_image_url: localMenuImageUrl
      });
      if (error) throw error;
      setMenuImageUrl(localMenuImageUrl);
      alert("Cập nhật thành công!");
      // Update local storage to sync with DB
      localStorage.setItem(VIEW_COUNT_KEY, totalViews.toString());
    } catch (err: any) {
      alert("Lỗi khi cập nhật: " + err.message);
    } finally {
      setIsUpdatingStats(false);
    }
  };

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
      fetchQuickMenu();
    }
    if (activeTab === 'guestbook') {
      fetchGuestbook();
    }
    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab, fetchQuickMenu, fetchGuestbook, fetchStats]);

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
      setMenu((prev: any[]) => prev.filter((d: any) => !selectedIds.includes(d.id)));
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
    <div className={`min-h-screen ${themeData.bg} pt-44 md:pt-52 pb-20 px-4 md:px-6 transition-colors duration-500`}>
      <ThemeSwitcher currentTheme={theme} onThemeChange={onThemeChange} />
      <Nav isAdmin theme={theme} menuImageUrl={menuImageUrl} />
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-200">
        <div className="flex bg-stone-50 border-b p-3 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'menu' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🍱 THỰC ĐƠN</button>
          <button onClick={() => setActiveTab('hero')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'hero' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🖼️ HERO SLIDES</button>
          <button onClick={() => setActiveTab('quick')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'quick' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>⚡ CHỌN NHANH</button>
          <button onClick={() => setActiveTab('notifications')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'notifications' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🔔 THÔNG BÁO</button>
          <button onClick={() => setActiveTab('poll')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'poll' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>🎵 QUẢN LÝ NHẠC & BÌNH CHỌN</button>
          <button onClick={() => setActiveTab('guestbook')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'guestbook' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>💬 GÓP Ý</button>
          <button onClick={() => setActiveTab('stats')} className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'stats' ? 'bg-white shadow-md text-amber-800' : 'text-stone-400'}`}>📊 THỐNG KÊ</button>
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
                      <input 
                        value={dish.name} 
                        onChange={e => { 
                          const newMenu = menu.map((d: any, idx: number) => idx === i ? { ...d, name: e.target.value } : d);
                          setMenu(newMenu);
                        }} 
                        className="p-4 border rounded-2xl text-sm font-bold" 
                        placeholder="Tên món" 
                      />
                      <input 
                        value={dish.price} 
                        onChange={e => { 
                          const newMenu = menu.map((d: any, idx: number) => idx === i ? { ...d, price: e.target.value } : d);
                          setMenu(newMenu);
                        }} 
                        className="p-4 border rounded-2xl text-sm font-black text-amber-800" 
                        placeholder="Giá" 
                      />
                      <select 
                        value={dish.category} 
                        onChange={e => { 
                          const newMenu = menu.map((d: any, idx: number) => idx === i ? { ...d, category: e.target.value as Category } : d);
                          setMenu(newMenu);
                        }} 
                        className="p-4 border rounded-2xl text-sm font-bold"
                      >
                        {Object.values(Category).filter(c => c !== Category.All).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input 
                        value={dish.image_url} 
                        onChange={e => { 
                          const newMenu = menu.map((d: any, idx: number) => idx === i ? { ...d, image_url: e.target.value } : d);
                          setMenu(newMenu);
                        }} 
                        className="col-span-3 p-4 border rounded-2xl text-[10px] font-mono" 
                        placeholder="Link ảnh (URL)" 
                      />
                    </div>
                    <button 
                      onClick={() => { 
                        if(confirm('Xóa món này?')) {
                          setMenu((prev: any[]) => prev.filter(d => d.id !== dish.id));
                        }
                      }} 
                      className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl text-2xl font-bold shrink-0"
                    >
                      ×
                    </button>
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
          ) : activeTab === 'stats' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <h2 className="text-3xl font-black uppercase text-stone-900">CẤU HÌNH & THỐNG KÊ</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Panel Thống kê */}
                <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-800 shadow-sm">
                      <Users size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">Lượt truy cập</span>
                      <div className="text-3xl font-black text-stone-900 tabular-nums">
                        {totalViews.toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-800 ml-2">Chỉnh sửa số lượt</label>
                      <input 
                        type="number" 
                        value={totalViews}
                        onChange={(e) => setTotalViews(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border-2 border-stone-100 rounded-2xl px-6 py-4 text-xl font-black text-stone-900 focus:border-amber-800 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Panel Menu Ảnh */}
                <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-800 shadow-sm">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">MENU ẢNH ( TRANG CHỦ )</span>
                      <div className="text-xs font-bold text-stone-500">Cập nhật hình ảnh menu rút gọn</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-amber-800 ml-2">Link hình ảnh MENU</label>
                      <input 
                        type="text" 
                        value={localMenuImageUrl}
                        onChange={(e) => setLocalMenuImageUrl(e.target.value.trim())}
                        placeholder="Dán link ảnh tại đây..."
                        className="w-full bg-white border-2 border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:border-amber-800 outline-none transition-all"
                      />
                    </div>
                    {localMenuImageUrl && (
                      <div className="mt-2 text-center">
                        <p className="text-[9px] font-bold text-stone-400 uppercase mb-2">Xem trước ảnh:</p>
                        <div className="relative group mx-auto max-w-[150px]">
                          <img 
                            src={localMenuImageUrl} 
                            alt="Menu Preview" 
                            className="w-full h-auto rounded-xl border-2 border-amber-100 shadow-sm"
                            referrerPolicy="no-referrer"
                            onError={(e: any) => {
                              e.target.onerror = null;
                              // Do not show anything if error
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-[9px] text-stone-400 italic">
                      * Mẹo: Tại Postimage, bạn hãy chọn link tên là <span className="font-bold text-amber-800">"Mã trực tiếp" (Direct Link)</span> để ảnh hiện lên đúng nhé!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <button 
                  onClick={updateStats}
                  disabled={isUpdatingStats}
                  className="w-full bg-stone-900 text-white py-6 rounded-2xl text-xs font-black uppercase tracking-[0.4em] hover:bg-amber-800 transition-all shadow-xl disabled:opacity-50"
                >
                  {isUpdatingStats ? 'ĐANG LƯU THAY ĐỔI...' : 'LƯU TẤT CẢ CẤU HÌNH'}
                </button>
                <p className="text-[10px] text-stone-400 italic font-bold mt-4 text-center">
                  * Sau khi Lưu, hình ảnh Menu mới sẽ được cập nhật ngay lập tức cho tất cả khách hàng.
                </p>
              </div>
            </div>
          ) : activeTab === 'notifications' ? (
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
          ) : null}

          {activeTab === 'poll' && (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b pb-6">
                <div>
                  <h2 className="text-3xl font-black uppercase text-stone-900 flex items-center gap-3">
                    <Music size={28} className="text-amber-800" />
                    QUẢN LÝ NHẠC NỀN TRANG CHỦ CPUT
                  </h2>
                  <p className="text-xs font-bold text-stone-400 mt-1">Cấu hình đường link nhạc nền (YouTube / MP3) phát trực tiếp trên website Cơm Phần Út Trinh</p>
                </div>
              </div>

              {/* Nhập Link Nhạc */}
              <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-800 ml-2 block">
                      Đường link Nhạc nền Trang Chủ (Nhập Link YouTube hoặc Link MP3/Audio):
                    </label>
                  </div>

                  <input 
                    type="text"
                    value={localPoll.music_url}
                    onChange={(e) => setLocalPoll(prev => ({ ...prev, music_url: e.target.value.trim() }))}
                    placeholder="Dán link YouTube (youtube.com/watch?v=...) HOẶC link file MP3 (.mp3)"
                    className="w-full bg-white border-2 border-stone-200 rounded-2xl px-6 py-4 text-xs font-mono text-stone-900 focus:border-amber-800 outline-none transition-all shadow-sm"
                  />

                  {/* Sample Music Suggestions for ACP */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
                      <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                        <Music size={16} className="text-amber-800 animate-pulse" />
                        DANH SÁCH GỢI Ý & TỰ ĐỘNG BÓC TÁCH NHẠC HOT TRENDING (CLICK DÁN TỰ ĐỘNG):
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleAdminShuffleVPop();
                          alert("✨ ĐÃ BÓC TÁCH & ĐỔI MỚI DANH SÁCH 6 BÀI NHẠC V-POP TRENDING HOT NHẤT!\n\nNhấn vào bài hát bất kỳ bên dưới để dán link làm nhạc nền trang chủ.");
                        }}
                        className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={11} className="animate-spin" />
                        <span>✨ TỰ ĐỘNG BÓC TÁCH NHẠC HOT</span>
                      </button>
                    </div>

                    {/* Nhóm 1: 6 Bài Nhạc Không Lời / Hòa Tấu / Cafe / Spa */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                        ☕ 6 BÀI NHẠC KHÔNG LỜI / HÒA TẤU / CAFE / SPA DÀNH CHO QUÁN ĂN:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {CPUT_PLAYLIST.filter(p => p.category === 'restaurant').map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setLocalPoll(prev => ({ ...prev, music_url: p.url }))}
                            className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${localPoll.music_url === p.url ? 'bg-amber-100 border-amber-800 text-amber-950 font-black ring-2 ring-amber-800' : 'bg-amber-50/60 hover:bg-amber-100/80 border-amber-200/80 text-stone-800'}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-black truncate">{p.title}</span>
                              <span className="text-[8px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold shrink-0">{p.badge}</span>
                            </div>
                            <span className="text-[9px] text-stone-500 font-medium truncate">{p.artist}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nhóm 2: Bóc Tách Bài Nhạc Trẻ Việt Nam Hot Hit */}
                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase text-red-800 tracking-wider flex items-center gap-1.5">
                          🔥 NHẠC TRẺ VIỆT NAM HOT TRENDING ({adminVPopTracks.length}/{VPOP_TRENDING_POOL.length} BÀI HOT):
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAdminShuffleVPop}
                            className="bg-stone-800 hover:bg-black text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw size={10} className="animate-spin" />
                            <span>Đổi 6 Bài Khác</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleAdminShuffleVPop();
                              const selected = adminVPopTracks[Math.floor(Math.random() * adminVPopTracks.length)];
                              setLocalPoll(prev => ({ ...prev, music_url: selected.url }));
                              alert(`🎲 ĐÃ BÓC TÁCH VÀ DÁN LINK BÀI HOT: "${selected.title}" (${selected.artist})`);
                            }}
                            className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Shuffle size={10} />
                            <span>🎲 RANDOM & DÁN LINK BÀI HOT</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {adminVPopTracks.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setLocalPoll(prev => ({ ...prev, music_url: p.url }))}
                            className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${localPoll.music_url === p.url ? 'bg-red-100 border-red-700 text-red-950 font-black ring-2 ring-red-700' : 'bg-red-50/60 hover:bg-red-100/80 border-red-200/80 text-stone-800'}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-black truncate">{p.title}</span>
                              <span className="text-[8px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold shrink-0">{p.badge}</span>
                            </div>
                            <span className="text-[9px] text-stone-500 font-medium truncate">{p.artist}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 italic ml-2 font-medium">
                    * Bạn có thể dán link YouTube bất kỳ hoặc link trực tiếp file MP3. Hệ thống sẽ tự động phân loại và phát làm nhạc nền cho khách ghé thăm!
                  </p>

                  {/* Audio / YouTube Preview in Admin */}
                  {localPoll.music_url && (
                    <div className="mt-4 bg-white p-5 rounded-3xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Music size={22} className="text-amber-800 animate-bounce" />
                        <div>
                          <span className="text-xs font-black text-stone-800 block">
                            {getYouTubeId(localPoll.music_url) ? 'Xem / Nghe thử YouTube nhúng Admin:' : 'Trình phát nhạc MP3 kiểm tra:'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono break-all">{localPoll.music_url}</span>
                        </div>
                      </div>
                      {getYouTubeId(localPoll.music_url) ? (
                        <iframe 
                          src={`https://www.youtube.com/embed/${getYouTubeId(localPoll.music_url)}`} 
                          className="w-full md:w-72 h-40 rounded-2xl border border-stone-200 shadow-sm"
                          title="YouTube Preview"
                        />
                      ) : (
                        <audio src={localPoll.music_url} controls className="h-10 w-full md:w-auto" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Thống kê phiếu bầu hiện tại */}
              <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-black uppercase text-stone-900 flex items-center gap-2">
                    <BarChart2 size={20} className="text-amber-800" />
                    THỐNG KÊ Ý KIẾN KHÁCH HÀNG
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn ĐẶT LẠI lượt bầu về 0?")) {
                        setLocalPoll(prev => ({ ...prev, yes_votes: 0, no_votes: 0 }));
                      }
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    Đặt lại lượt bầu về 0
                  </button>
                </div>

                {(() => {
                  const total = (localPoll.yes_votes || 0) + (localPoll.no_votes || 0);
                  const yesPct = total > 0 ? Math.round(((localPoll.yes_votes || 0) / total) * 100) : 0;
                  const noPct = total > 0 ? Math.round(((localPoll.no_votes || 0) / total) * 100) : 0;

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">Tổng số phiếu</span>
                          <div className="text-3xl font-black text-stone-900 tabular-nums">{total.toLocaleString('vi-VN')}</div>
                        </div>

                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 text-center space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">Có (Đồng ý nghe nhạc)</span>
                          <div className="text-3xl font-black text-emerald-800 tabular-nums">{yesPct}% <span className="text-sm font-bold text-emerald-600">({localPoll.yes_votes || 0})</span></div>
                        </div>

                        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-center space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 block">Không (Cảm ơn)</span>
                          <div className="text-3xl font-black text-rose-800 tabular-nums">{noPct}% <span className="text-sm font-bold text-rose-600">({localPoll.no_votes || 0})</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Trạng thái Bật/Tắt Pop-up Nhạc Nền */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-900">BẬT TỰ ĐỘNG BẢNG HỎI & NHẠC NỀN TRANG CHỦ</h4>
                  <p className="text-[10px] text-stone-500 font-medium mt-0.5">Khi bật, khách vào website sẽ hiện bảng hỏi nghe nhạc và nút nhạc nền nổi ở góc màn hình.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalPoll(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`w-16 h-9 rounded-full relative transition-all cursor-pointer ${localPoll.is_active ? 'bg-emerald-600' : 'bg-stone-300'}`}
                >
                  <div className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-all shadow-md ${localPoll.is_active ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {/* Button Save */}
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <button 
                  type="button"
                  onClick={() => {
                    onSavePoll({ ...localPoll, is_active: localPoll.is_active ?? true });
                    alert("Đã lưu cấu hình Nhạc Nền Trang Chủ thành công!");
                  }}
                  className="w-full bg-stone-900 hover:bg-amber-800 text-white py-6 rounded-2xl text-xs font-black uppercase tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  <span>LƯU CẤU HÌNH NHẠC NỀN TRANG CHỦ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as Theme) || Theme.White;
  });
  const [menuImageUrl, setMenuImageUrl] = useState<string>('');
  
  const [pollData, setPollData] = useState<VotePoll>(() => {
    const saved = localStorage.getItem(POLL_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force is_active to true if it was set to false previously by mistake
        return {
          ...parsed,
          is_active: true,
          music_url: parsed.music_url || CPUT_PLAYLIST[0].url
        };
      } catch (e) { console.error(e); }
    }
    return {
      is_active: true,
      question: 'Bạn muốn nghe nhạc trên trang chủ CPUT không ?',
      music_url: CPUT_PLAYLIST[0].url,
      yes_votes: 18,
      no_votes: 4
    };
  });

  const handleThemeChange = (t: Theme) => {
    setCurrentTheme(t);
    localStorage.setItem(THEME_KEY, t);
  };

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
      const { data: stats } = await supabase.from('site_stats').select('*').eq('id', 1).maybeSingle();
      
      if (dishes) setMenu(dishes);
      if (slides) setHeroSlides(slides);
      if (stats) {
        if (stats.menu_image_url) setMenuImageUrl(stats.menu_image_url);
        if (stats.poll_question !== undefined || stats.poll_is_active !== undefined) {
          const remotePoll: VotePoll = {
            is_active: stats.poll_is_active ?? true,
            question: stats.poll_question || 'Bạn muốn nghe nhạc trên trang chủ CPUT không ?',
            music_url: stats.poll_music_url || '',
            yes_votes: stats.poll_yes_votes ?? 18,
            no_votes: stats.poll_no_votes ?? 4
          };
          setPollData(remotePoll);
          localStorage.setItem(POLL_KEY, JSON.stringify(remotePoll));
        }
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleVote = useCallback((option: 'yes' | 'no') => {
    try {
      setPollData(prev => {
        const safePrev: VotePoll = prev || {
          is_active: true,
          question: 'Bạn muốn nghe nhạc trên trang chủ CPUT không ?',
          music_url: '',
          yes_votes: 18,
          no_votes: 4
        };
        const curYes = typeof safePrev.yes_votes === 'number' && !isNaN(safePrev.yes_votes) ? safePrev.yes_votes : 0;
        const curNo = typeof safePrev.no_votes === 'number' && !isNaN(safePrev.no_votes) ? safePrev.no_votes : 0;
        const newYes = option === 'yes' ? curYes + 1 : curYes;
        const newNo = option === 'no' ? curNo + 1 : curNo;
        const updated: VotePoll = {
          is_active: safePrev.is_active ?? true,
          question: safePrev.question || 'Bạn muốn nghe nhạc trên trang chủ CPUT không ?',
          music_url: safePrev.music_url || '',
          yes_votes: newYes,
          no_votes: newNo
        };

        try {
          localStorage.setItem(POLL_KEY, JSON.stringify(updated));
          localStorage.setItem(VOTED_KEY, option);
        } catch (e) {
          console.error("LocalStorage save error:", e);
        }

        if (supabase) {
          supabase.from('site_stats').upsert({
            id: 1,
            poll_is_active: updated.is_active,
            poll_question: updated.question,
            poll_music_url: updated.music_url,
            poll_yes_votes: newYes,
            poll_no_votes: newNo
          }).then(({ error }) => {
            if (error) console.warn("Lỗi cập nhật phiếu bầu Supabase:", error.message);
          }).catch(err => console.error("Lỗi cập nhật phiếu bầu Supabase:", err));
        }

        return updated;
      });
    } catch (err) {
      console.error("Lỗi handleVote:", err);
    }
  }, [supabase]);

  const handleSavePoll = async (updatedPoll: VotePoll) => {
    setPollData(updatedPoll);
    try {
      localStorage.setItem(POLL_KEY, JSON.stringify(updatedPoll));
    } catch (e) {
      console.error("LocalStorage poll error:", e);
    }

    try {
      const { error } = await supabase.from('site_stats').upsert({
        id: 1,
        poll_is_active: updatedPoll.is_active,
        poll_question: updatedPoll.question,
        poll_music_url: updatedPoll.music_url,
        poll_yes_votes: updatedPoll.yes_votes,
        poll_no_votes: updatedPoll.no_votes
      });
      if (error && !error.message.includes("column")) {
        console.warn("Lỗi lưu site_stats poll:", error.message);
      }
      alert("🎉 ĐÃ LƯU CẤU HÌNH NHẠC & BÌNH CHỌN THÀNH CÔNG!");
    } catch (err: any) {
      console.error("Lỗi lưu poll:", err);
      alert("🎉 Đã lưu cấu hình nhạc & bình chọn!");
    }
  };
  
  const handleSave = async () => {
    if (isLoading) {
      alert("Hệ thống đang tải, vui lòng đợi trong giây lát...");
      return;
    }
    
    // Yêu cầu xác nhận trước khi đồng bộ
    if (!confirm("Bạn có chắc chắn muốn đồng bộ tất cả thay đổi? Thao tác này sẽ cập nhật dữ liệu lên hệ thống và hiển thị cho mọi khách hàng.")) return;

    setIsLoading(true);
    try {
      // 1. Xóa dữ liệu cũ - Sử dụng filter rộng hơn để đảm bảo xóa sạch
      const { error: delDishesError } = await supabase.from('dishes').delete().filter('id', 'neq', '00000000-0000-0000-0000-000000000000');
      if (delDishesError) throw new Error("Không thể xóa danh sách cũ: " + delDishesError.message);

      const { error: delSlidesError } = await supabase.from('hero_slides').delete().filter('id', 'neq', '00000000-0000-0000-0000-000000000000');
      if (delSlidesError) throw new Error("Không thể xóa banner cũ: " + delSlidesError.message);

      // 2. Chuẩn bị dữ liệu sạch
      const sanitize = (list: any[]) => list.map((item) => {
        const newItem = { ...item };
        // Đảm bảo không gửi Id cũ để tránh xung đột
        delete newItem.id;
        delete newItem.created_at;
        return newItem;
      });
      
      // 3. Chèn dữ liệu mới từ state hiện tại
      // Chèn Dishes
      if (menu && menu.length > 0) {
        const { error: insDishesError } = await supabase.from('dishes').insert(sanitize(menu));
        if (insDishesError) throw new Error("Lỗi khi chèn dữ liệu món ăn: " + insDishesError.message);
      }

      // Chèn Slides
      if (heroSlides && heroSlides.length > 0) {
        const { error: insSlidesError } = await supabase.from('hero_slides').insert(sanitize(heroSlides));
        if (insSlidesError) throw new Error("Lỗi khi chèn dữ liệu banner: " + insSlidesError.message);
      }

      alert("🎉 ĐỒNG BỘ THÀNH CÔNG! Dữ liệu đã được cập nhật mới nhất."); 
      fetchData(); // Làm mới state từ database
    } catch (e: any) { 
      console.error("Lỗi đồng bộ:", e);
      alert("❌ LỖI ĐỒNG BỘ: " + (e.message || "Vui lòng kiểm tra lại kết nối mạng hoặc quyền hạn bảng dữ liệu.")); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAcp = hash.toUpperCase().includes('ACP1122');
  return isAcp ? (
    <AdminPanel 
      menu={menu} 
      setMenu={setMenu} 
      heroSlides={heroSlides} 
      setHeroSlides={setHeroSlides} 
      onSave={handleSave} 
      supabase={supabase}
      theme={currentTheme}
      onThemeChange={handleThemeChange}
      menuImageUrl={menuImageUrl}
      setMenuImageUrl={setMenuImageUrl}
      pollData={pollData}
      onSavePoll={handleSavePoll}
    />
  ) : (
    <HomePage 
      menu={menu} 
      heroSlides={heroSlides} 
      isLoading={isLoading} 
      supabase={supabase}
      currentTheme={currentTheme}
      onThemeChange={handleThemeChange}
      menuImageUrl={menuImageUrl}
      pollData={pollData}
      onVote={handleVote}
    />
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-stone-800 p-8 rounded-3xl border border-stone-700 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              🌾
            </div>
            <h2 className="text-xl font-black text-amber-500 uppercase tracking-tight">CƠM PHẦN ÚT TRINH</h2>
            <p className="text-xs text-stone-300 leading-relaxed font-medium">
              Đã xảy ra sự cố hiển thị nhỏ. Dữ liệu của bạn vẫn an toàn. Vui lòng bấm bên dưới để khôi phục lại trang.
            </p>
            {this.state.error && (
              <p className="text-[10px] text-amber-300 bg-stone-950/80 p-2.5 rounded-xl border border-amber-900/40 font-mono text-left break-all max-h-24 overflow-y-auto">
                {String(this.state.error?.message || this.state.error)}
              </p>
            )}
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('ut-trinh-poll');
                  localStorage.removeItem('ut-trinh-poll-voted');
                  localStorage.removeItem('ut-trinh-nhaccuatui-url');
                  sessionStorage.removeItem('ut-trinh-poll-dismissed');
                } catch {}
                this.setState({ hasError: false, error: null });
                window.location.hash = '';
                window.location.reload();
              }}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-black py-3.5 px-6 rounded-2xl uppercase tracking-wider text-xs transition-all cursor-pointer shadow-lg"
            >
              TẢI LẠI TRANG CHỦ & XÓA BỘ NHỚ ĐỆM
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
