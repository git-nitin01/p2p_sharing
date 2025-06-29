"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ReceiveMode() {
  const [shareCode, setShareCode] = useState(['', '', '', '', '', '']);
  const [streamingPort, setStreamingPort] = useState<number | null>(null);
  const [fileDownload, setFileDownload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleStartStreaming = async () => {
    const codeStr = shareCode.join('').trim();
    if (!codeStr) {
      setError("Please enter a share code.");
      return;
    }
  
    setError(null);
    setStreamingPort(null);
  
    try {
      // Step 1: Resolve the code to get the port and filename
      const resolveRes = await fetch(`/api/upload?code=${codeStr}`);
      if (!resolveRes.ok) {
        throw new Error(`Could not resolve code: ${resolveRes.status}`);
      }
  
      const { port, file } = await resolveRes.json();
      if (!port) {
        throw new Error("No streaming port received from backend.");
      }
      setFileDownload(file);
      setStreamingPort(port);
  
    } catch (err) {
      setError("Download failed: " + (err as Error).message);
    }
  };

  const handleDownload = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DOWNLOAD_HOST|| "http://localhost"}/${streamingPort}`;
    toast.success("File download started!");
  };

  const handleCodeChange = (index: number, value: string) => {
    const newShareCode = [...shareCode];
    newShareCode[index] = value.toUpperCase();
    setShareCode(newShareCode);
    
    // Move to next input if character entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !shareCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase();
    
    // Only process if it's a 6-character alphanumeric string
    if (pastedData.length === 6 && /^[A-Z0-9]{6}$/.test(pastedData)) {
      const newShareCode = [...shareCode];
      for (let i = 0; i < 6; i++) {
        newShareCode[i] = pastedData[i];
      }
      setShareCode(newShareCode);
      
      // Focus the last input after paste
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-xl bg-white/10 border-2 border-white/20 rounded-xl p-8 flex flex-col items-center">
        <div className="mb-6">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9Z" stroke="#a685ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-white/90 text-lg font-medium mb-4">Enter Share Code</h3>
        <div className="w-full mb-6"> 
          <div className="flex gap-2">
            {shareCode.map((code, index) => (
              <input
                key={index}
                type="text"
                value={code}
                onChange={(e) => {
                  handleCodeChange(index, e.target.value);
                }}
                onKeyDown={(e) => {
                  handleCodeKeyDown(index, e);
                }}
                onPaste={handleCodePaste}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 text-center text-lg font-mono tracking-widest"
                maxLength={1}
                autoFocus={index === 0}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
        {shareCode.every(code => code.trim()) && (
          <>
            {fileDownload && (
              <div className="text-green-200 mt-4">File available to download: {fileDownload}</div>
            )}
            <button
              onClick={handleStartStreaming}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition w-full cursor-pointer hover:scale-105"
            >
              Start Streaming
            </button>
            {streamingPort && (
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition w-full mt-4 cursor-pointer hover:scale-105"
              >
                Download File
              </button>
            )}
          </>
        )}
        
        {error && (
          <div className="text-red-200 mt-4">{error}</div>
        )}
      </div>

      {/* Share Code Display for Receive Mode */}
      {shareCode.every(code => code.trim()) && (
        <div className="mx-auto w-full max-w-xl mt-6 bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center mb-4">
            <h3 className="text-gray-800 font-semibold text-lg mb-2">Entered Code</h3>
            <p className="text-gray-600 text-sm">Ready to download file with this code</p>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            {shareCode.map((digit, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md"
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
                navigator.clipboard.writeText(shareCode.join(''));
                toast.success("Code copied to clipboard");
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Copy Code
            </button>
          </div>
        </div>
      )}
    </>
  );
} 