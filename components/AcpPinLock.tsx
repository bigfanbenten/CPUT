import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Delete, ArrowRight, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { ACP_PIN } from '../acp-pin-config';

interface AcpPinLockProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const AcpPinLock: React.FC<AcpPinLockProps> = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Xử lý xác thực mã PIN
  const verifyPin = useCallback((pinToVerify: string) => {
    if (pinToVerify.length !== 4) {
      setErrorMessage('Vui lòng nhập đủ 4 chữ số PIN.');
      return;
    }

    setIsSubmitting(true);

    // Kiểm tra với ACP_PIN được cấu hình
    if (pinToVerify === ACP_PIN) {
      setErrorMessage('');
      try {
        sessionStorage.setItem('acp_pin_unlocked', 'true');
      } catch (err) {
        console.warn('sessionStorage is not available:', err);
      }
      onSuccess();
    } else {
      setIsShaking(true);
      setErrorMessage('Mã PIN không chính xác. Vui lòng thử lại!');
      // Xóa ô nhập sau khi báo lỗi và rung lắc
      setTimeout(() => {
        setPin('');
        setIsShaking(false);
        setIsSubmitting(false);
      }, 500);
    }
  }, [onSuccess]);

  // Nhấn số từ bàn phím ảo hoặc máy tính
  const handleDigit = useCallback((digit: string) => {
    setErrorMessage('');
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + digit;
      if (next.length === 4) {
        // Tự động kiểm tra ngay khi nhập đủ 4 số
        setTimeout(() => verifyPin(next), 50);
      }
      return next;
    });
  }, [verifyPin]);

  // Xóa 1 ký tự cuối
  const handleBackspace = useCallback(() => {
    setErrorMessage('');
    setPin((prev) => prev.slice(0, -1));
  }, []);

  // Xóa toàn bộ
  const handleClearAll = useCallback(() => {
    setErrorMessage('');
    setPin('');
  }, []);

  // Hỗ trợ nhập bằng bàn phím máy tính
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang gõ trong input/textarea khác (nếu có)
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        handleClearAll();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (pin.length === 4) {
          verifyPin(pin);
        } else {
          setErrorMessage('Vui lòng nhập đủ 4 chữ số PIN.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleBackspace, handleClearAll, pin, verifyPin]);

  const handleReturnHome = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.location.hash = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-white flex flex-col justify-between items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / Brand */}
      <div className="w-full max-w-md pt-4 flex items-center justify-between z-10">
        <button
          onClick={handleReturnHome}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors py-2 px-3 rounded-xl hover:bg-stone-800/60"
        >
          <ArrowLeft size={16} />
          <span>Về Trang Chủ</span>
        </button>

        <span className="text-[10px] uppercase font-black tracking-widest text-amber-500/80 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full">
          Bảo Mật ACP
        </span>
      </div>

      {/* Main Lock Card */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto z-10">
        {/* Emblem / Logo */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-xl shadow-amber-950/50 border border-amber-500/30">
            <Lock className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-stone-900 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <KeyRound size={14} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-2">
            HỆ THỐNG QUẢN TRỊ
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            CƠM PHẦN ÚT TRINH
          </p>
          <p className="text-xs text-stone-400 mt-2 font-medium">
            Nhập mã PIN 4 số để mở khóa trang quản trị
          </p>
        </div>

        {/* 4 PIN Digit Slots (Masked dots) */}
        <div 
          className={`flex items-center justify-center gap-4 mb-5 transition-transform duration-200 ${
            isShaking ? 'translate-x-[-10px] animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            const isCurrent = pin.length === index;
            return (
              <div
                key={index}
                className={`w-12 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isFilled
                    ? 'bg-amber-600 border-2 border-amber-400 shadow-lg shadow-amber-600/30 scale-105'
                    : isCurrent
                    ? 'bg-stone-800 border-2 border-amber-500/80 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-stone-900/90 border border-stone-700/60'
                }`}
              >
                {isFilled ? (
                  <span className="w-4 h-4 rounded-full bg-white shadow-inner animate-scale-in" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400/60 animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-stone-700" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Notification Alert */}
        <div className="min-h-[32px] w-full flex items-center justify-center mb-4">
          {errorMessage ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold animate-shake">
              <ShieldAlert size={14} className="text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
              Hỗ trợ bàn phím số 0–9 & phím máy tính
            </span>
          )}
        </div>

        {/* Keypad Grid (3 columns: 1-9, bottom row: Xóa, 0, Xác nhận) */}
        <div className="w-full grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDigit(num.toString())}
              className="h-14 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 active:bg-amber-700 text-xl font-bold text-white border border-stone-700/50 hover:border-amber-600/50 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}

          {/* Bottom Row: Clear/Backspace, 0, Confirm */}
          <button
            type="button"
            disabled={isSubmitting || pin.length === 0}
            onClick={handleBackspace}
            title="Xóa ký tự cuối"
            className="h-14 rounded-2xl bg-stone-900/90 hover:bg-stone-800 active:bg-stone-700 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-600 active:scale-95 transition-all shadow-md flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Delete size={18} />
            <span className="text-[9px] uppercase font-bold tracking-wider">Xóa</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 active:bg-amber-700 text-xl font-bold text-white border border-stone-700/50 hover:border-amber-600/50 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            disabled={isSubmitting || pin.length !== 4}
            onClick={() => verifyPin(pin)}
            title="Xác nhận mã PIN"
            className={`h-14 rounded-2xl text-xs font-black uppercase tracking-wider border active:scale-95 transition-all shadow-md flex flex-col items-center justify-center gap-1 cursor-pointer ${
              pin.length === 4
                ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400 shadow-amber-600/40 animate-pulse'
                : 'bg-stone-900/90 text-stone-500 border-stone-800 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <ArrowRight size={18} />
            <span className="text-[9px]">Mở Khóa</span>
          </button>
        </div>

        {/* Clear All Helper */}
        {pin.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-stone-400 hover:text-red-400 transition-colors py-1 px-3"
          >
            Xóa hết
          </button>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="w-full max-w-md pb-4 text-center z-10">
        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-medium">
          Hệ thống quản trị Cơm Phần Út Trinh • Mở hộp là thấy ngon
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AcpPinLock;
