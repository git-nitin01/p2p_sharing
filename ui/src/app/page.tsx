"use client";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import FeaturesSection from "./components/FeaturesSection";
import OTPInput from "./components/OTPInput";
import ShareCodeDisplay from "./components/ShareCodeDisplay";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New state for receive functionality
  const [mode, setMode] = useState<'share' | 'receive'>('share');
  const [shareCode, setShareCode] = useState(['', '', '', '', '', '']);
  const [uploadedShareCode, setUploadedShareCode] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [fileDownload, setFileDownload] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setError(null);
      setUploadedFile(null);
      setUploadedShareCode(null);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadedFile(null);
      setUploadedShareCode(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    
    const formData = new FormData();
    // Make it max 30mb
    if (selectedFile.size > 30 * 1024 * 1024) {
      setError("File size must be less than 30MB.");
      return;
    }
    formData.append("file", selectedFile);
    setUploading(true);
    setProgress(0);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setUploadedFile(res.message || "File uploaded");
          if (res.code) {
            setUploadedShareCode(res.code);
          }
        } else {
          setError("Upload failed: " + xhr.statusText);
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setError("Upload failed: Network error");
      };
      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      setError("Upload failed: " + (err as Error).message);
    }
  };

  const handleStartStreaming = async () => {
    const codeStr = shareCode.join('').trim();
    if (!codeStr) {
      setError("Please enter a share code.");
      return;
    }
  
    setError(null);
  
    try {
      const resolveRes = await fetch(`/api/upload?code=${codeStr}`);
      if (!resolveRes.ok) {
        throw new Error(`Could not resolve code: ${resolveRes.status}`);
      }
  
      const { port, file } = await resolveRes.json();
      if (!port) {
        throw new Error("No streaming port received from backend.");
      }
      setFileDownload(file);
  
    } catch (err) {
      setError("Download failed: " + (err as Error).message);
    }
  };

  const handleDownload = async () => {
    const codeStr = shareCode.join('').trim();
  
    const res = await fetch(`/api/download?code=${codeStr}`);
    if (!res.ok) {
      toast.error("Failed to download.");
      return;
    }
  
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = fileDownload || "file"; // optional fallback
    a.click();
    URL.revokeObjectURL(url);
  
    toast.success("Download started!");
  };
  
  

  const handleCodeChange = (newValue: string[]) => setShareCode(newValue);

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !shareCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7b5cff] via-[#5f5fff] to-[#a685ff] flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 pt-8 pb-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
          Share Files <span className="text-purple-300">Instantly</span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/80 mb-8 max-w-2xl">
          Secure, fast, and direct peer-to-peer file sharing. Experience the global file sharing protocol.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button 
            onClick={() => setMode('share')}
            className={`font-semibold px-6 py-3 rounded-lg shadow transition ${
              mode === 'share' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            Share Files
          </button>
          <button 
            onClick={() => setMode('receive')}
            className={`font-semibold px-6 py-3 rounded-lg shadow transition ${
              mode === 'receive' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            Receive Files
          </button>
        </div>
        
        {/* Share Mode - Upload Box */}
        {mode === 'share' && (
          <>
            <form
              onSubmit={handleSubmit}
              className={`mx-auto w-full max-w-xl bg-white/10 border-2 border-dashed ${dragActive ? "border-blue-400 bg-blue-100/20" : "border-white/20"} rounded-xl p-8 flex flex-col items-center transition`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
              <div
                className="flex flex-col items-center justify-center cursor-pointer w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mb-2">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 16v-8m0 0-3 3m3-3 3 3M20 16.5A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-1A2.5 2.5 0 0 1 6.5 13H7v-1a5 5 0 0 1 10 0v1h.5A2.5 2.5 0 0 1 20 15.5v1Z" stroke="#a685ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-white/90 text-lg font-medium">Drag & drop files here or click to browse</span>
              </div>
              
              {/* Selected File Display */}
              {selectedFile && (
                <div className="w-full mt-6 p-4 bg-white/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="#a685ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2v6h6" stroke="#a685ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div>
                        <p className="text-white font-medium">{selectedFile.name}</p>
                        <p className="text-white/70 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-white/70 hover:text-white"
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Upload Button */}
              {selectedFile && !uploading && (
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition cursor-pointer hover:scale-105"
                >
                  Upload File
                </button>
              )}
              
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              {uploadedFile && (
                <div className="text-green-200 mt-4">{uploadedFile}</div>
              )}
              {error && (
                <div className="text-red-200 mt-4">{error}</div>
              )}
            </form>

            {/* Share Code Display */}
            {uploadedShareCode && (
              <ShareCodeDisplay code={uploadedShareCode} color="blue" label="Share Code" sublabel="Share this code with others to let them download your file" copyText="Copy Code" />
            )}
          </>
        )}

        {/* Receive Mode - Code Prompt */}
        {mode === 'receive' && (
          <>
            <div className="mx-auto w-full max-w-xl bg-white/10 border-2 border-white/20 rounded-xl p-8 flex flex-col items-center">
              <div className="w-full mb-6"> 
                <OTPInput value={shareCode} onChange={handleCodeChange} onKeyDown={handleCodeKeyDown} inputRefs={inputRefs} />
              </div>
              {shareCode.every(code => code.trim()) && (
                <>
                  {fileDownload && (
                    <div className="text-green-200 mt-4">File available to download: {fileDownload}</div>
                  )}
                  <button
                    onClick={fileDownload ? handleDownload : handleStartStreaming}
                    className={`
                      bg-gray-600 hover:bg-black disabled:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg shadow transition w-full cursor-pointer hover:scale-105
                      ${fileDownload ? '!bg-green-600 hover:bg-green-700' : ''}
                    `}
                  >
                    {fileDownload ? 'Start Download' : 'Start Streaming'}
                  </button>
                </>
              )}
              

              {error && (
                <div className="text-red-200 mt-4">{error}</div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Features Section */}
      <FeaturesSection />
      
      {/* Toast Container */}
      <Toaster />
    </div>
  );
}
