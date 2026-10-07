import { createClient } from '@supabase/supabase-js';
import { Notification, Dish, Category, VisitorStats, DailyVisitorStat } from '../types';

export type { DailyVisitorStat };

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
  },

  // Visitor Stats
  async getVisitorStats(): Promise<VisitorStats | null> {
    const { data, error } = await supabase
      .from('visitor_stats')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching visitor stats:', error);
      return null;
    }
    return data;
  },

  async updateVisitorStats(total: number): Promise<boolean> {
    const { data: existing } = await supabase
      .from('visitor_stats')
      .select('id')
      .limit(1)
      .single();

    let error;
    if (existing) {
      const { error: updateError } = await supabase
        .from('visitor_stats')
        .update({ total_visitors: total, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('visitor_stats')
        .insert([{ total_visitors: total, updated_at: new Date().toISOString() }]);
      error = insertError;
    }

    if (error) {
      console.error('Error updating visitor stats:', error);
      return false;
    }
    return true;
  },

  // Daily Visitor Stats (7-Day Analytics)
  async getDailyVisitorStats(dateKeys: string[]): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('daily_visitor_stats')
        .select('date, visitor_count')
        .in('date', dateKeys);

      if (error) {
        console.warn('Error fetching daily visitor stats:', error.message);
        return {};
      }

      const result: Record<string, number> = {};
      if (Array.isArray(data)) {
        data.forEach((row: any) => {
          if (row?.date) {
            result[row.date] = Number(row.visitor_count || 0);
          }
        });
      }
      return result;
    } catch (err) {
      console.warn('Error in getDailyVisitorStats:', err);
      return {};
    }
  },

  async recordDailyVisitor(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_daily_visitor');
      if (error) {
        console.warn('Error calling increment_daily_visitor RPC:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Exception calling increment_daily_visitor RPC:', err);
      return false;
    }
  },

  async getAllTimeVisitorRecord(): Promise<{ count: number; date: string } | null> {
    try {
      const { data, error } = await supabase
        .from('daily_visitor_stats')
        .select('date, visitor_count')
        .order('visitor_count', { ascending: false })
        .order('date', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Error fetching all-time visitor record:', error.message);
        return null;
      }

      if (data && data.length > 0 && data[0].visitor_count > 0) {
        return {
          count: Number(data[0].visitor_count),
          date: data[0].date
        };
      }
      return null;
    } catch (err) {
      console.warn('Exception in getAllTimeVisitorRecord:', err);
      return null;
    }
  }
};

