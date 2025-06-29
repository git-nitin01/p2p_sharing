"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ShareModeProps {
  onUploadSuccess: (code: string) => void;
}

export default function ShareMode({ onUploadSuccess }: ShareModeProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedShareCode, setUploadedShareCode] = useState<string | null>(null);

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
    formData.append("file", selectedFile);
    setUploading(true);
    setProgress(0);
    
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
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
            onUploadSuccess(res.code);
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

  return (
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
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <path d="M12 16v-8m0 0-3 3m3-3 3 3M20 16.5A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-1A2.5 2.5 0 0 1 6.5 13H7v-1a5 5 0 0 1 10 0v1h.5A2.5 2.5 0 0 1 20 15.5v1Z" stroke="#a685ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
        <ShareCodeDisplay code={uploadedShareCode} />
      )}
    </>
  );
}

interface ShareCodeDisplayProps {
  code: string;
}

function ShareCodeDisplay({ code }: ShareCodeDisplayProps) {
  return (
    <div className="mx-auto w-full max-w-xl mt-6 bg-white rounded-xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-gray-800 font-semibold text-lg mb-2">Share Code</h3>
        <p className="text-gray-600 text-sm">Share this code with others to let them download your file</p>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        {code.split('').map((digit, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md"
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
            navigator.clipboard.writeText(code);
            toast.success("Code copied to clipboard");
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
} 