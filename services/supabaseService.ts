
import { createClient } from '@supabase/supabase-js';
import { Dish } from '../types';

const getEnv = (key: string) => {
  return typeof process !== 'undefined' ? process.env[key] || '' : '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const getDishes = async (): Promise<Dish[]> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Chưa cấu hình Supabase, sử dụng dữ liệu mặc định.');
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Dish[];
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Supabase:', error);
    return [];
  }
};
