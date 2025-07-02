import React from "react";
import toast from "react-hot-toast";

type ShareCodeDisplayProps = {
  code: string;
  color?: 'blue' | 'green';
  label?: string;
  sublabel?: string;
  copyText?: string;
};

const colorMap = {
  blue: 'from-blue-500 to-purple-600',
  green: 'from-green-500 to-emerald-600',
};

const ShareCodeDisplay: React.FC<ShareCodeDisplayProps> = ({ code, color = 'blue', label = 'Share Code', sublabel = '', copyText = 'Copy Code' }) => (
  <div className="mx-auto w-full max-w-xl mt-6 bg-white rounded-xl p-6 shadow-lg">
    <div className="text-center mb-4">
      <h3 className="text-gray-800 font-semibold text-lg mb-2">{label}</h3>
      {sublabel && <p className="text-gray-600 text-sm">{sublabel}</p>}
    </div>
    <div className="flex justify-center gap-3 mb-4">
      {code.split('').map((digit, index) => (
        <div
          key={index}
          className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center shadow-md`}
        >
          <span className="text-white font-bold text-xl tracking-wider">
            {digit}
          </span>
        </div>
      ))}
    </div>
    <div className="text-center">
      <button
        onClick={() => {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(code)
              .then(() => toast.success("Code copied to clipboard!"))
              .catch(() => toast.error("Failed to copy code"));
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = code;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
              document.execCommand('copy');
              toast.success("Code copied to clipboard!");
            } catch (err) {
              toast.error("Failed to copy code" + err);
            }
            document.body.removeChild(textarea);
          }
        }}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
      >
        {copyText}
      </button>
    </div>
  </div>
);

export default ShareCodeDisplay; 