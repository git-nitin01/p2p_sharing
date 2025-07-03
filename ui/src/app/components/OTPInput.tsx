import React from "react";

type OTPInputProps = {
  value: string[];
  onChange: (newValue: string[]) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
};

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, onKeyDown, inputRefs }) => {
  // Improved paste handler: distribute pasted string from focused input
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!pasted) return;
    const startIdx = inputRefs.current.findIndex(ref => ref === document.activeElement);
    if (startIdx === -1) return;
    const newValue = [...value];
    for (let i = 0; i < 6 && i + startIdx < 6; i++) {
      newValue[i + startIdx] = pasted[i] || '';
    }
    onChange(newValue);
    const lastIdx = Math.min(startIdx + pasted.length - 1, 5);
    inputRefs.current[lastIdx]?.focus();
  };

  return (
    <div className="flex gap-2">
      {value.map((code, index) => (
        <input
          key={index}
          type="text"
          value={code}
          onChange={e => {
            const val = e.target.value.toUpperCase();
            const newValue = [...value];
            newValue[index] = val;
            onChange(newValue);
            // Move to next input if character entered
            if (val && index < 5) {
              inputRefs.current[index + 1]?.focus();
            }
          }}
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