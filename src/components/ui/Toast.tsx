import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import type { ToastType } from '../../context/ToastContext';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-400 flex-shrink-0" />,
  error: <XCircle size={18} className="text-red-400 flex-shrink-0" />,
  info: <Info size={18} className="text-purple-400 flex-shrink-0" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-green-500/30',
  error: 'border-red-500/30',
  info: 'border-purple-500/30',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100vw-32px)] max-w-[400px]"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 px-4 py-3.5
            bg-[#151515] border ${borderColors[toast.type]}
            rounded-xl shadow-2xl shadow-black/50
            ${toast.exiting ? 'toast-exit' : 'toast-enter'}
          `}
          role="status"
        >
          {icons[toast.type]}
          <p className="text-[#F5F5F5] text-sm font-medium leading-snug flex-1">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors flex-shrink-0 -mt-0.5"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
