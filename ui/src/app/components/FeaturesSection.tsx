import React from "react";

const features = [
  {
    icon: (
      <span className="bg-purple-600 text-white rounded-full p-2 mr-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M13 2.05v2.02A7.001 7.001 0 0 1 19.93 11H21.95A9.003 9.003 0 0 0 13 2.05ZM11 2.05A9.003 9.003 0 0 0 2.05 11H4.07A7.001 7.001 0 0 1 11 4.07V2.05ZM4.07 13H2.05A9.003 9.003 0 0 0 11 21.95v-2.02A7.001 7.001 0 0 1 4.07 13ZM13 21.95A9.003 9.003 0 0 0 21.95 13H19.93A7.001 7.001 0 0 1 13 19.93v2.02ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" fill="currentColor"/></svg>
      </span>
    ),
    title: "Lightning Fast",
    desc: "Direct peer-to-peer connections ensure maximum transfer speeds without server bottlenecks.",
  },
  {
    icon: (
      <span className="bg-green-600 text-white rounded-full p-2 mr-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9Z" fill="currentColor"/></svg>
      </span>
    ),
    title: "Ultra Secure",
    desc: "Your files are never stored after it is downloaded from the other end. In any case, the file is deleted after 24 hours.",
  },
  {
    icon: (
      <span className="bg-pink-600 text-white rounded-full p-2 mr-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
      </span>
    ),
    title: "Any Format",
    desc: "Share files of any format (audio, video, image, etc.) up to 30MB.",
  },
];

const FeaturesSection = () => (
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
);

export default FeaturesSection; 