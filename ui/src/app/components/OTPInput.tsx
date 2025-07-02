import React from "react";

type OTPInputProps = {
  value: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
};

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, onKeyDown, onPaste, inputRefs }) => (
  <div className="flex gap-2">
    {value.map((code, index) => (
      <input
        key={index}
        type="text"
        value={code}
        onChange={e => onChange(index, e.target.value)}
        onKeyDown={e => onKeyDown(index, e)}
        onPaste={onPaste}
        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 text-center text-lg font-mono tracking-widest"
        maxLength={1}
        autoFocus={index === 0}
        ref={el => { inputRefs.current[index] = el; }}
      />
    ))}
  </div>
);

export default OTPInput; 