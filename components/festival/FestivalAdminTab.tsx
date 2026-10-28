import React, { useState } from 'react';
import { FestivalEventId, FESTIVAL_EVENTS, FestivalEventConfig } from '../../types/festival';
import { Sparkles, Eye, CheckCircle2, AlertTriangle, Palette, Wand2, Calendar, Loader2, Check } from 'lucide-react';

interface FestivalAdminTabProps {
  onStartPreview: (event: FestivalEventId, enableAnimations: boolean) => void;
  activeFestival?: FestivalEventId;
  onSaveFestival?: (event: FestivalEventId) => Promise<{ success: boolean; error?: string }>;
}

export const FestivalAdminTab: React.FC<FestivalAdminTabProps> = ({
  onStartPreview,
  activeFestival = 'default',
  onSaveFestival,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<FestivalEventId>(activeFestival !== 'default' ? activeFestival : 'halloween');
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const eventList: FestivalEventConfig[] = [
    FESTIVAL_EVENTS.halloween,
    FESTIVAL_EVENTS.christmas,
    FESTIVAL_EVENTS.newyear,
    FESTIVAL_EVENTS.default,
  ];

  const currentConfig = FESTIVAL_EVENTS[selectedEventId];
  const activeConfig = FESTIVAL_EVENTS[activeFestival];
  const isAlreadyActive = selectedEventId === activeFestival;

  const handlePreviewClick = () => {
    onStartPreview(selectedEventId, enableAnimations);
  };

  const handleSubmitClick = async () => {
    const confirmMessage = `Áp dụng giao diện "${currentConfig.name}" cho website?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    if (!onSaveFestival) {
      alert("Hệ thống chưa kết nối hàm lưu sự kiện.");
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const result = await onSaveFestival(selectedEventId);
      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: `Đã kích hoạt thành công giao diện "${currentConfig.name}" cho toàn bộ website công khai!`
        });
        alert(`🎉 THÀNH CÔNG!\n\nĐã áp dụng giao diện "${currentConfig.name}" cho website www.comphanuttrinh.online trên toàn bộ 4 Quốc gia (VN, KR, JP, US).`);
      } else {
        const errMsg = result.error || "Không thể cập nhật cơ sở dữ liệu Supabase.";
        setSaveStatus({
          type: 'error',
          message: errMsg
        });
        alert(`⚠️ CHƯA THỂ LƯU SỰ KIỆN LÊN SUPABASE:\n\n${errMsg}`);
      }
    } catch (err: any) {
      const msg = err?.message || "Lỗi kết nối máy chủ Supabase.";
      setSaveStatus({
        type: 'error',
        message: msg
      });
      alert(`❌ LỖI HỆ THỐNG: ${msg}`);
    } finally {
      setIsSaving(false);
    }
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

        {/* Public Status Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-[10px] font-bold text-emerald-900 shadow-2xs">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-emerald-700 uppercase tracking-wider">ĐANG CÔNG KHAI:</span>
            <span className="font-black text-emerald-950 uppercase">{activeConfig.name}</span>
          </div>

          {activeFestival !== 'default' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100/70 border border-amber-300 text-[9px] font-black uppercase tracking-wider text-amber-900">
              <span>🔥 SỰ KIỆN ĐANG HOẠT ĐỘNG</span>
            </div>
          )}
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
              const isEventActive = activeFestival === evt.id;

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
                          {isEventActive && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Check size={10} />
                              <span>ĐANG ÁP DỤNG</span>
                            </span>
                          )}
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
              className="w-full bg-stone-800 hover:bg-stone-700 text-white py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer border border-stone-700"
              title="Xem trước giao diện sự kiện trên cả 4 Homepage (VN, KR, JP, US) mà không ảnh hưởng website thật"
            >
              <Eye size={16} />
              <span>PREVIEW — XEM TRƯỚC RIÊNG ADMIN</span>
            </button>

            {/* Button SUBMIT (Official Public Activation) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={isSaving}
                className={`w-full py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer ${
                  isAlreadyActive
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-950/20'
                    : 'bg-amber-700 hover:bg-amber-600 text-white shadow-amber-950/20'
                }`}
                title="Áp dụng chính thức giao diện này cho tất cả khách truy cập website www.comphanuttrinh.online"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>ĐANG ĐỒNG BỘ LÊN SUPABASE...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>
                      {isAlreadyActive 
                        ? `ĐANG ÁP DỤNG: ${currentConfig.name}` 
                        : `SUBMIT — ÁP DỤNG ${currentConfig.name.toUpperCase()}`}
                    </span>
                  </>
                )}
              </button>

              {/* Status Message Banner if any */}
              {saveStatus && (
                <div
                  className={`p-3.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2.5 ${
                    saveStatus.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {saveStatus.type === 'success' ? (
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {saveStatus.type === 'success' ? 'ĐỒNG BỘ THÀNH CÔNG:' : 'THÔNG BÁO TỪ SUPABASE:'}
                    </p>
                    <p className="font-mono text-[10px] break-words">
                      {saveStatus.message}
                    </p>
                    {saveStatus.type === 'error' && (
                      <p className="text-[10px] text-stone-600 font-sans mt-1">
                        👉 Để kích hoạt quyền ghi cho cột này, Admin vui lòng mở <strong>Supabase SQL Editor</strong> và chạy lệnh:<br />
                        <code className="bg-stone-200/80 px-1 py-0.5 rounded font-mono text-[10px] block mt-1 select-all">
                          ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS active_festival TEXT DEFAULT 'default';
                        </code>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
