
import { Dish, Category } from './types';

export const MENU_DATA: Dish[] = [
  {
    id: '1',
    name: 'Cơm Sườn Cốt Lết Rim',
    description: 'Sườn cốt lết tươi ngon rim mặn ngọt, ăn kèm với mỡ hành và dưa chua nhà làm.',
    price: '45.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    category: Category.MainCourse,
    tags: ['Bán Chạy']
  },
  {
    id: '2',
    name: 'Cá Lóc Kho Tộ',
    description: 'Cá lóc đồng kho tộ với nước màu dừa truyền thống, đậm đà đưa cơm.',
    price: '55.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1512058560366-cd24270083cd?auto=format&fit=crop&q=80&w=800',
    category: Category.MainCourse,
    tags: ['Đặc Sản']
  },
  {
    id: '3',
    name: 'Thịt Kho Tàu Trứng Cút',
    description: 'Thịt ba chỉ mềm tan cùng trứng cút thấm vị, nước dùng ngọt thanh từ nước dừa tươi.',
    price: '50.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=800',
    category: Category.MainCourse
  },
  {
    id: '4',
    name: 'Canh Chua Cá Hú',
    description: 'Canh chua chuẩn vị miền Tây với bạc hà, thơm, đậu bắp và cá hú béo ngậy.',
    price: '40.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    category: Category.Appetizer
  },
  {
    id: '5',
    name: 'Đậu Hũ Nhồi Thịt Sốt Cà',
    description: 'Đậu hũ chiên vàng nhồi thịt băm, sốt cà chua đậm đà, món ăn quen thuộc hằng ngày.',
    price: '35.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: Category.MainCourse
  },
  {
    id: '6',
    name: 'Trà Đá Hoa Lài',
    description: 'Trà hoa lài ướp lạnh, thanh nhiệt cho bữa cơm thêm trọn vẹn.',
    price: '5.000 VNĐ',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    category: Category.Drink
  }
];
