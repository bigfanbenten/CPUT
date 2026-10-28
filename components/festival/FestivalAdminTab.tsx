import React, { useState } from 'react';
import { FestivalEventId, FESTIVAL_EVENTS, FestivalEventConfig } from '../../types/festival';
import { Sparkles, Eye, CheckCircle2, AlertTriangle, ShieldCheck, Palette, Wand2, Calendar } from 'lucide-react';

interface FestivalAdminTabProps {
  onStartPreview: (event: FestivalEventId, enableAnimations: boolean) => void;
  activeFestival?: FestivalEventId;
}

export const FestivalAdminTab: React.FC<FestivalAdminTabProps> = ({
  onStartPreview,
  activeFestival = 'default',
}) => {
  const [selectedEventId, setSelectedEventId] = useState<FestivalEventId>('halloween');
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);

  const eventList: FestivalEventConfig[] = [
    FESTIVAL_EVENTS.halloween,
    FESTIVAL_EVENTS.christmas,
    FESTIVAL_EVENTS.newyear,
    FESTIVAL_EVENTS.default,
  ];

  const currentConfig = FESTIVAL_EVENTS[selectedEventId];
  const activeConfig = FESTIVAL_EVENTS[activeFestival];

  const handlePreviewClick = () => {
    onStartPreview(selectedEventId, enableAnimations);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-stone-900">
              QUẢN LÝ SỰ KIỆN & LỄ HỘI
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Hệ thống Festival Theme Engine • Đồng bộ giao diện 4 quốc gia (Việt Nam, Hàn Quốc, Nhật Bản, Mỹ)
          </p>
        </div>

        {/* Security & Active Status Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-[10px] font-bold text-stone-700">
            <span className="text-stone-400 uppercase tracking-wider">Đang công khai:</span>
            <span className="font-black text-amber-900 uppercase">{activeConfig.name}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-[10px] font-bold text-amber-800">
            <ShieldCheck size={14} className="text-amber-700" />
            <span>SUBMIT: TẠM KHÓA (CHỜ PHÊ DUYỆT MIGRATION)</span>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column Left: Event Selection Radio (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-700 flex items-center gap-2">
            <Calendar size={14} className="text-amber-800" />
            <span>A. DANH SÁCH SỰ KIỆN LỄ HỘI</span>
          </h3>

          <div className="space-y-3">
            {eventList.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              return (
                <label
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`block relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50/40 shadow-md ring-2 ring-amber-700/20'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="festival_event_radio"
                        value={evt.id}
                        checked={isSelected}
                        onChange={() => setSelectedEventId(evt.id)}
                        className="w-5 h-5 text-amber-800 border-stone-300 focus:ring-amber-800 cursor-pointer mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black uppercase tracking-tight text-stone-900">
                            {evt.name}
                          </span>
                          <span className="text-[10px] font-bold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-md">
                            {evt.dateLabel}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${evt.badgeBg} ${evt.badgeText}`}>
                            {evt.styleName}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {evt.themeDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Section B: Animation Checkbox */}
          <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
              <Wand2 size={13} className="text-amber-800" />
              <span>B. TÙY CHỌN HIỆU ỨNG CHUYỂN ĐỘNG</span>
            </h4>
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={enableAnimations}
                onChange={(e) => setEnableAnimations(e.target.checked)}
                className="w-5 h-5 rounded border-stone-300 text-amber-800 focus:ring-amber-800 cursor-pointer"
              />
              <span className="text-xs font-bold text-stone-800 group-hover:text-amber-900">
                Bật hiệu ứng chuyển động lễ hội (dơi bay, tuyết rơi, pháo hoa, sương mù)
              </span>
            </label>
            <p className="text-[10px] text-stone-500 mt-1 pl-8">
              Tự động giảm/tắt khi thiết bị của người dùng kích hoạt chế độ giảm chuyển động (Reduced Motion).
            </p>
          </div>
        </div>

        {/* Column Right: Live Details Card & Action Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-700 flex items-center gap-2">
            <Palette size={14} className="text-amber-800" />
            <span>CHI TIẾT CHỦ ĐỀ ĐÃ CHỌN</span>
          </h3>

          {/* Theme Card Preview */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white shadow-xl space-y-3.5 border border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">SỰ KIỆN:</span>
                <h4 className="text-lg font-black uppercase text-amber-400 tracking-tight">{currentConfig.name}</h4>
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${currentConfig.badgeBg} ${currentConfig.badgeText}`}>
                {currentConfig.dateLabel}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Phong cách:</span>
                <p className="font-semibold text-stone-200">{currentConfig.styleName}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Bảng màu chủ đạo:</span>
                <p className="text-stone-300 text-[11px] leading-relaxed">{currentConfig.paletteDescription}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Hiệu ứng thị giác:</span>
                <p className="text-stone-300 text-[11px] leading-relaxed">{currentConfig.effectsDescription}</p>
              </div>
            </div>

            {/* Scope Notice */}
            <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 leading-relaxed italic">
              • Bảo vệ 100% video Cinematic Hero và Music Player.<br />
              • Không làm thay đổi nội dung thực đơn, giỏ hàng hay liên kết đặt món.
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-3 pt-2">
            {/* Button PREVIEW (Enabled) */}
            <button
              type="button"
              onClick={handlePreviewClick}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer hover:shadow-amber-900/20"
              title="Xem trước giao diện sự kiện trên cả 4 Homepage (VN, KR, JP, US) mà không ảnh hưởng website thật"
            >
              <Eye size={16} />
              <span>PREVIEW — XEM TRƯỚC</span>
            </button>

            {/* Button SUBMIT (Strictly Disabled until migration approved) */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={true}
                className="w-full bg-stone-300 text-stone-500 py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-none flex items-center justify-center gap-2 cursor-not-allowed opacity-60 border border-stone-300"
                title="Nút SUBMIT đang được vô hiệu hóa theo tiêu chuẩn an toàn bảo mật. Cần Admin phê duyệt migration SQL trước khi mở quyền ghi."
              >
                <CheckCircle2 size={16} />
                <span>SUBMIT — ÁP DỤNG SỰ KIỆN (TẠM KHÓA AN TOÀN)</span>
              </button>

              {/* Security & Audit Notice banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2 text-[11px] leading-relaxed">
                <AlertTriangle size={16} className="text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">
                    BẢO MẬT GIAI ĐOẠN 3 — ĐIỀU KIỆN DỪNG ĐƯỢC KÍCH HOẠT:
                  </p>
                  <p className="text-stone-700">
                    Theo kết quả Audit, cột <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">active_festival</code> chưa tồn tại trong bảng <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">site_stats</code> và tài khoản client chỉ sở hữu Anon Key.
                  </p>
                  <p className="text-stone-700">
                    Để chống giả mạo ghi dữ liệu từ phía khách truy cập, nút <strong>SUBMIT</strong> được giữ khóa an toàn cho đến khi Admin thực thi migration bảo mật <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">supabase/migrations/20261028_add_active_festival_to_site_stats.sql</code> trong Supabase SQL Editor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
