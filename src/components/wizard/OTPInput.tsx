import React, { useRef, useCallback } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  hasError?: boolean;
}

export default function OTPInput({ value, onChange, hasError = false }: OTPInputProps) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const newOTP = newDigits.join('');
    onChange(newOTP);
    if (char && index < 5) {
      focusAt(index + 1);
    }
  }, [digits, onChange, focusAt]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      focusAt(index + 1);
    }
  }, [digits, onChange, focusAt]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length > 0) {
      onChange(pasted.padEnd(6, '').slice(0, 6));
      const focusIndex = Math.min(pasted.length, 5);
      focusAt(focusIndex);
    }
  }, [onChange, focusAt]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="One-time password input">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className={`otp-input ${digit ? 'filled' : ''} ${hasError ? 'error' : ''}`}
          aria-label={`OTP digit ${i + 1}`}
          aria-invalid={hasError}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </div>
  );
}
