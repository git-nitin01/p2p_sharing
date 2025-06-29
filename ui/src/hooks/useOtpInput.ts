import { useRef, useState } from 'react';

export function useOtpInput(length: number = 6) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);
    
    // Move to next input if character entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase();
    
    // Only process if it's the correct length and alphanumeric
    if (pastedData.length === length && /^[A-Z0-9]+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus the last input after paste
      inputRefs.current[length - 1]?.focus();
    }
  };

  const resetOtp = () => {
    setOtp(new Array(length).fill(''));
  };

  const isComplete = () => {
    return otp.every(digit => digit.trim() !== '');
  };

  const getOtpString = () => {
    return otp.join('');
  };

  return {
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    resetOtp,
    isComplete,
    getOtpString,
  };
} 