import React from "react";

const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
    <div className="flex items-center gap-2">
      <span className="bg-white/10 rounded-full p-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9Z" fill="#fff"/></svg>
      </span>
      <span className="text-white font-bold text-xl tracking-tight">ShareFlow</span>
    </div>
    <div className="flex gap-6 items-center text-white/80 text-sm">
      <a href="#contribute" className="hover:text-white transition">Contribute</a>
      <a href="#buymeacoffee" className="hover:text-white transition">Buy me a coffee</a>
    </div>
  </nav>
);

export default Navbar; 