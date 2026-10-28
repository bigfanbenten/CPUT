export type FestivalEventId = 'default' | 'halloween' | 'christmas' | 'newyear';

export interface FestivalEventConfig {
  id: FestivalEventId;
  name: string;
  dateLabel: string;
  styleName: string;
  themeDescription: string;
  paletteDescription: string;
  effectsDescription: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
}

export const FESTIVAL_EVENTS: Record<FestivalEventId, FestivalEventConfig> = {
  halloween: {
    id: 'halloween',
    name: 'HALLOWEEN',
    dateLabel: '31/10/2026',
    styleName: 'Dark American Horror',
    themeDescription: 'Bầu không khí kinh dị Mỹ điện ảnh, bóng tối có chiều sâu, sương mù ma quái và ánh lửa bí ngô.',
    paletteDescription: 'Đen than (#060309), Tím khói (#160C22), Cam bí ngô (#EA580C)',
    effectsDescription: 'Dơi bay tự nhiên, sương mù ma mị cuộn chậm, bí ngô khắc mặt quỷ ánh nến nhấp nháy, hàng rào nghĩa địa Gothic.',
    primaryColor: '#EA580C',
    accentColor: '#9333EA',
    glowColor: 'rgba(234, 88, 12, 0.4)',
    badgeBg: 'bg-purple-950/80 border-purple-500/40',
    badgeText: 'text-orange-400',
  },
  christmas: {
    id: 'christmas',
    name: 'CHRISTMAS',
    dateLabel: '25/12/2026',
    styleName: 'Premium Warm Christmas',
    themeDescription: 'Không khí Giáng sinh ấm áp, sang trọng với sắc đỏ rượu, xanh thông và ánh vàng lung linh.',
    paletteDescription: 'Đỏ rượu (#991B1B), Xanh thông (#064E3B), Vàng ấm (#F59E0B)',
    effectsDescription: 'Tuyết rơi nhẹ, đèn dây lung linh, viền thông trang trí, ánh sáng vàng ấm áp.',
    primaryColor: '#DC2626',
    accentColor: '#10B981',
    glowColor: 'rgba(220, 38, 38, 0.35)',
    badgeBg: 'bg-red-950/80 border-red-500/40',
    badgeText: 'text-red-400',
  },
  newyear: {
    id: 'newyear',
    name: 'HAPPY NEW YEAR',
    dateLabel: '01/01/2027',
    styleName: 'Interactive Golden Celebration',
    themeDescription: 'Chào đón năm mới rực rỡ và sang trọng với vệt sáng chuột vàng kim và pháo hoa tương tác khi nhấp chuột.',
    paletteDescription: 'Vàng kim hoàng gia (#D97706), Đen hoàng gia (#080603), Đỏ may mắn (#DC2626)',
    effectsDescription: 'Vệt sáng vàng kim theo con trỏ chuột, chạm/nhấp chuột bắn đúng 1 chùm pháo hoa vàng kim (0.8s) biến mất tự nhiên.',
    primaryColor: '#F59E0B',
    accentColor: '#EF4444',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-950/80 border-amber-500/40',
    badgeText: 'text-amber-400',
  },
  default: {
    id: 'default',
    name: 'DEFAULT',
    dateLabel: 'Mặc định',
    styleName: 'Giao diện gốc',
    themeDescription: 'Khôi phục 100% phong cách gốc nguyên bản của từng quốc gia (Việt Nam, Hàn Quốc, Nhật Bản, Mỹ).',
    paletteDescription: 'Bảng màu thương hiệu Cơm Phần Út Trinh và thiết kế văn hóa từng quốc gia.',
    effectsDescription: 'Không có hiệu ứng lễ hội. Giao diện chuẩn thuần túy.',
    primaryColor: '#9A3412',
    accentColor: '#D97706',
    glowColor: 'transparent',
    badgeBg: 'bg-stone-800 border-stone-600',
    badgeText: 'text-stone-300',
  },
};

export interface FestivalPreviewState {
  event: FestivalEventId;
  enableAnimations: boolean;
}
