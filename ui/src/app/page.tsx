"use client";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import ShareMode from "../components/ShareMode";
import ReceiveMode from "../components/ReceiveMode";

const features = [
  {
    icon: (
      <span className="bg-purple-600 text-white rounded-full p-2 mr-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M13 2.05v2.02A7.001 7.001 0 0 1 19.93 11H21.95A9.003 9.003 0 0 0 13 2.05ZM11 2.05A9.003 9.003 0 0 0 2.05 11H4.07A7.001 7.001 0 0 1 11 4.07V2.05ZM4.07 13H2.05A9.003 9.003 0 0 0 11 21.95v-2.02A7.001 7.001 0 0 1 4.07 13ZM13 21.95A9.003 9.003 0 0 0 21.95 13H19.93A7.001 7.001 0 0 1 13 19.93v2.02ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" fill="currentColor"/>
        </svg>
      </span>
    ),
    title: "Lightning Fast",
    desc: "Direct peer-to-peer connections ensure maximum transfer speeds without server bottlenecks.",
  },
  {
    icon: (
      <span className="bg-green-600 text-white rounded-full p-2 mr-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9Z" fill="currentColor"/>
        </svg>
      </span>
    ),
    title: "Ultra Secure",
    desc: "Your files are never stored after it is downloaded from the other end. In any case, the file is deleted after 24 hours.",
  },
  {
    icon: (
      <span className="bg-pink-600 text-white rounded-full p-2 mr-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
        </svg>
      </span>
    ),
    title: "No Limits",
    desc: "Share files of any size without restrictions or storage limitations.",
  },
];

export default function Home() {
  const [mode, setMode] = useState<'share' | 'receive'>('share');

  const handleUploadSuccess = (code: string) => {
    // You can add any global state management here if needed
    console.log("Upload successful with code:", code);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7b5cff] via-[#5f5fff] to-[#a685ff] flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
        <div className="flex items-center gap-2">
          <span className="bg-white/10 rounded-full p-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9Z" fill="#fff"/>
            </svg>
          </span>
          <span className="text-white font-bold text-xl tracking-tight">ShareFlow</span>
        </div>
        <div className="flex gap-6 items-center text-white/80 text-sm">
          <a href="#contribute" className="hover:text-white transition">Contribute</a>
          <a href="#buymeacoffee" className="hover:text-white transition">Buy me a coffee</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 pt-8 pb-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
          Share Files <span className="text-purple-300">Instantly</span>
        </h1>
        <p className="text-lg sm:text-2xl text-white/80 mb-8 max-w-2xl">
          Secure, fast, and direct peer-to-peer file sharing. No servers, no limits, just pure connection.
        </p>
        
        {/* Mode Toggle Buttons */}
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
        
        {/* Mode Components */}
        {mode === 'share' && <ShareMode onUploadSuccess={handleUploadSuccess} />}
        {mode === 'receive' && <ReceiveMode />}
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#181c2a] py-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose ShareFlow?</h2>
        <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">Experience the future of file sharing with cutting-edge technology</p>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-[#23263a] rounded-xl p-8 flex-1 h-[240px] w-[260px] max-w-sm flex flex-col items-start shadow-lg">
              {f.icon}
              <h3 className="text-xl font-semibold text-white mb-2 mt-3">{f.title}</h3>
              <p className="text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Toast Container */}
      <Toaster />
    </div>
  );
}
