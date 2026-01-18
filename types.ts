
export enum Category {
  Appetizer = 'Khai Vị',
  MainCourse = 'Món Chính',
  Dessert = 'Tráng Miệng',
  Drink = 'Đồ Uống'
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  tags?: string[];
  created_at?: string;
}

export interface RecommendationResponse {
  dishId: string;
  reason: string;
  pairing: string;
}
