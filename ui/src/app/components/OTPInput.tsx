import React from "react";

type OTPInputProps = {
  value: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
};

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, onKeyDown, inputRefs }) => {
  // Robust paste handler for all environments
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length === 6) {
      for (let i = 0; i < 6; i++) {
        onChange(i, pasted[i]);
      }
      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="flex gap-2">
      {value.map((code, index) => (
        <input
          key={index}
          type="text"
          value={code}
          onChange={e => onChange(index, e.target.value)}
          onKeyDown={e => onKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 text-center text-lg font-mono tracking-widest"
          maxLength={1}
          autoFocus={index === 0}
          ref={el => { inputRefs.current[index] = el; }}
        />
      ))}
    </div>
  );
};

export default OTPInput; 