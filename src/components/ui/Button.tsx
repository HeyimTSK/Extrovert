import React from 'react';
import LoadingSpinner from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  loading = false,
  fullWidth = true,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-widest text-sm rounded-[8px] py-4 px-6 transition-all duration-150 btn-press select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]';

  const variants: Record<ButtonVariant, string> = {
    primary: `bg-[#F5F5F5] text-[#050505] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `bg-transparent border border-[#444] text-[#F5F5F5] hover:border-[#666] hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed`,
    ghost: `bg-transparent text-[#9A9A9A] hover:text-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed`,
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <LoadingSpinner white={variant === 'secondary'} />}
      {children}
    </button>
  );
}
