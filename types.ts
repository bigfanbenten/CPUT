export interface Notification {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_available: boolean;
  calories?: string | number;
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
}

export interface VisitorStats {
  id: string;
  total_visitors: number;
  updated_at: string;
}
