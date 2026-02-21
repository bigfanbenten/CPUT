import { createClient } from '@supabase/supabase-js';
import { Notification, Dish, Category } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
  // Notifications
  async getActiveNotification(): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  },

  async getAllNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async createNotification(message: string): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ message, is_active: true }])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    return data;
  },

  async updateNotificationStatus(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Error updating notification status:', error);
      return false;
    }
    return true;
  },

  // Menu Items
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return [];
    return data || [];
  },

  async getDishes(): Promise<Dish[]> {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_available', true);

    if (error) return [];
    return data || [];
  }
};
