"use client";
import React from 'react';
import { useOtpInput } from '../hooks/useOtpInput';

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  className?: string;
  inputClassName?: string;
}

export default function OtpInput({ 
  length = 6, 
  onComplete, 
  className = "",
  inputClassName = ""
}: OtpInputProps) {
  const {
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    isComplete,
    getOtpString,
  } = useOtpInput(length);

  // Call onComplete when OTP is complete
  React.useEffect(() => {
    if (isComplete() && onComplete) {
      onComplete(getOtpString());
    }
  }, [otp, onComplete, isComplete, getOtpString]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 text-center text-lg font-mono tracking-widest ${inputClassName}`}
          maxLength={1}
          autoFocus={index === 0}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
} 