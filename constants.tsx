
import { Dish, Category } from './types';

export const MENU_DATA: Dish[] = [
  {
    id: '1',
    name: 'Súp Bào Ngư Vi Cá',
    description: 'Bào ngư thượng hạng hầm cùng vi cá trong nước dùng thanh tao, bổ dưỡng.',
    price: '1.250.000 VNĐ',
    image_url: 'https://picsum.photos/seed/soup/800/600',
    category: Category.Appetizer,
    tags: ['Bán Chạy', 'Đặc Trưng']
  },
  {
    id: '2',
    name: 'Gỏi Bưởi Tôm Áp Chảo',
    description: 'Sự kết hợp hoàn hảo giữa vị chua ngọt của bưởi hồng và tôm sú tươi ngon.',
    price: '350.000 VNĐ',
    image_url: 'https://picsum.photos/seed/salad/800/600',
    category: Category.Appetizer
  },
  {
    id: '3',
    name: 'Thăn Bò Wagyu A5',
    description: 'Thăn ngoại bò Wagyu Nhật Bản nướng đá nóng, giữ trọn độ mềm tan và hương vị đặc trưng.',
    price: '3.500.000 VNĐ',
    image_url: 'https://picsum.photos/seed/steak/800/600',
    category: Category.MainCourse,
    tags: ['Cao Cấp', 'Wagyu']
  },
  {
    id: '4',
    name: 'Cá Tuyết Đen Sốt Miso',
    description: 'Cá tuyết đen Na Uy nướng lò, phủ sốt Miso truyền thống thơm nồng.',
    price: '950.000 VNĐ',
    image_url: 'https://picsum.photos/seed/fish/800/600',
    category: Category.MainCourse
  },
  {
    id: '5',
    name: 'Tôm Hùm Bỏ Lò Phô Mai',
    description: 'Tôm hùm Nha Trang tươi sống nướng cùng phô mai Mozzarella béo ngậy.',
    price: '1.800.000 VNĐ',
    image_url: 'https://picsum.photos/seed/lobster/800/600',
    category: Category.MainCourse
  },
  {
    id: '6',
    name: 'Tiramisu Cốt Rượu Vang',
    description: 'Bánh Tiramisu mềm mịn với hương cà phê đậm đà và chút nồng nàn của rượu vang.',
    price: '220.000 VNĐ',
    image_url: 'https://picsum.photos/seed/tiramisu/800/600',
    category: Category.Dessert
  }
];
