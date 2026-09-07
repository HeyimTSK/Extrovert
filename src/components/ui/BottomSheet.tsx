import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, subtitle, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimating(false);
    } else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => {
        setVisible(false);
        setAnimating(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      sheetRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm ${animating ? 'backdrop-exit' : 'backdrop-enter'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Modal */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          relative w-full max-w-[600px] bg-[#101010] border border-[#2a2a2a]
          rounded-t-3xl md:rounded-3xl pb-safe md:shadow-2xl md:shadow-purple-950/40
          ${animating ? 'sheet-exit' : 'sheet-enter'}
          outline-none
          max-h-[85vh] flex flex-col
        `}
      >
        {/* Handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0 md:hidden">
          <div className="w-10 h-1 bg-[#444] rounded-full" />
        </div>


        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-3 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold uppercase tracking-[0.12em] text-[#F5F5F5]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#9A9A9A] mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors p-1 -mr-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
