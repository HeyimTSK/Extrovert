import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  supportingText?: string;
}

export default function Input({
  label,
  error,
  supportingText,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A9A9A]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`field-input ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : supportingText ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-[#EF4444] text-xs font-medium mt-0.5"
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && supportingText && (
        <p
          id={`${inputId}-hint`}
          className="text-[#9A9A9A] text-xs leading-relaxed mt-0.5"
        >
          {supportingText}
        </p>
      )}
    </div>
  );
}
