
import { createClient } from '@supabase/supabase-js';
import { Dish } from '../types';

// Các biến này sẽ được cấu hình sau khi bạn có thông tin dự án Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getDishes = async (): Promise<Dish[]> => {
  if (!supabaseUrl) return []; // Trả về mảng rỗng nếu chưa cấu hình

  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Lỗi khi lấy dữ liệu từ Supabase:', error);
    return [];
  }

  return data as Dish[];
};
