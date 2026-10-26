import { NotificationDuration } from '../types';

export interface DurationOption {
  id: NotificationDuration;
  label: string;
  sublabel: string;
}

export const NOTIFICATION_DURATION_OPTIONS: readonly DurationOption[] = [
  { id: '3_days', label: '3 NGÀY', sublabel: '72 giờ' },
  { id: '1_week', label: '1 TUẦN', sublabel: '7 ngày' },
  { id: '2_weeks', label: '2 TUẦN', sublabel: '14 ngày' },
  { id: '1_month', label: '1 THÁNG', sublabel: '+1 tháng lịch' },
  { id: '2_months', label: '2 THÁNG', sublabel: '+2 tháng lịch' },
] as const;

/**
 * Tính thời điểm hết hạn của thông báo từ thời điểm bắt đầu và thời hạn đã chọn.
 * Quy tắc:
 * - 3 NGÀY = 72 giờ
 * - 1 TUẦN = 7 ngày
 * - 2 TUẦN = 14 ngày
 * - 1 THÁNG = cộng 1 tháng lịch (xử lý ngày cuối tháng hợp lệ, ví dụ 31/01 -> 28/02 hoặc 29/02)
 * - 2 THÁNG = cộng 2 tháng lịch
 */
export function calculateNotificationExpiration(startDate: Date, duration: NotificationDuration): Date {
  const result = new Date(startDate.getTime());

  if (duration === '3_days') {
    result.setTime(result.getTime() + 3 * 24 * 60 * 60 * 1000); // 72 hours
  } else if (duration === '1_week') {
    result.setTime(result.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else if (duration === '2_weeks') {
    result.setTime(result.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
  } else if (duration === '1_month' || duration === '2_months') {
    const monthsToAdd = duration === '1_month' ? 1 : 2;
    const currentDay = result.getDate();
    const currentMonth = result.getMonth();
    const currentYear = result.getFullYear();

    const targetMonthIndex = currentMonth + monthsToAdd;
    const targetYear = currentYear + Math.floor(targetMonthIndex / 12);
    const normalizedTargetMonth = targetMonthIndex % 12;

    // Ngày cuối cùng hợp lệ của tháng đích
    const daysInTargetMonth = new Date(targetYear, normalizedTargetMonth + 1, 0).getDate();
    const validDay = Math.min(currentDay, daysInTargetMonth);

    // Đặt ngày về 1 trước để tránh overflow khi tháng đích có ít ngày hơn
    result.setDate(1);
    result.setFullYear(targetYear);
    result.setMonth(normalizedTargetMonth);
    result.setDate(validDay);
  }

  return result;
}

/**
 * Định dạng thời gian theo chuẩn Việt Nam (Asia/Ho_Chi_Minh): DD/MM/YYYY HH:mm
 */
export function formatVietnamDateTime(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';

    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(d);

    const map: Record<string, string> = {};
    parts.forEach((p) => {
      map[p.type] = p.value;
    });

    return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}`;
  } catch {
    return '';
  }
}

/**
 * Kiểm tra xem thông báo đã hết hạn hay chưa.
 * Lưu ý: Thông báo cũ không có expires_at sẽ KHÔNG bao giờ bị coi là hết hạn (bảo vệ thông báo cũ).
 */
export function isNotificationExpired(notification?: { expires_at?: string | null } | null): boolean {
  if (!notification || !notification.expires_at) return false;
  const expiryTime = new Date(notification.expires_at).getTime();
  if (isNaN(expiryTime)) return false;
  return expiryTime <= Date.now();
}

/**
 * Kiểm tra xem thông báo có hợp lệ để hiển thị trên Homepage hay không.
 * Điều kiện:
 * 1. is_active === true
 * 2. Chưa hết hạn (hoặc là thông báo cũ không có expires_at)
 */
export function isNotificationActiveAndValid(notification?: { is_active: boolean; expires_at?: string | null } | null): boolean {
  if (!notification) return false;
  if (!notification.is_active) return false;
  return !isNotificationExpired(notification);
}
