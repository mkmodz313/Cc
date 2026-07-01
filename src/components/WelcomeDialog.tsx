import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Music, 
  Download,
  Info,
  Tv
} from "lucide-react";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (type: "tick" | "success" | "laser" | "beep") => void;
}

export const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ isOpen, onClose, playSound }) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>("/src/assets/welcome.png");
  const [imgAttempt, setImgAttempt] = useState<number>(0);

  // Dynamic image loader fallback. If welcome.png is not found, try welcome.jpg, welcome.jpeg, then fallback to high-quality cyber-gold theme art.
  const handleImageError = () => {
    if (imgAttempt === 0) {
      setImgAttempt(1);
      setImgSrc("/src/assets/welcome.jpg");
    } else if (imgAttempt === 1) {
      setImgAttempt(2);
      setImgSrc("/src/assets/welcome.jpeg");
    } else {
      // Ultimate high-fidelity gold abstract cyber render fallback
      setImgSrc("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800");
    }
  };

  const handleClose = () => {
    playSound("success");
    if (dontShowAgain) {
      localStorage.setItem("mkmodz_welcome_dismissed", "true");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Back glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-amber-500/[0.06] blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20, rotateX: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a0805]/95 to-[#050402]/98 border-2 border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.95),_0_0_60px_rgba(245,158,11,0.15)] select-none my-8"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* Cyber golden scanner laser effect */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.5)]" />

        {/* Header Image Area with fallback */}
        <div className="relative aspect-[21/9] w-full bg-black/60 overflow-hidden border-b border-amber-500/15">
          <img 
            src={imgSrc} 
            alt="welcome banner" 
            onError={handleImageError}
            className="w-full h-full object-cover opacity-75 object-center hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805] via-transparent to-black/35" />
          
          {/* Logo overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] font-mono text-amber-400 font-extrabold tracking-widest uppercase">
                <Sparkles className="w-2.5 h-2.5 animate-pulse text-amber-400" />
                <span>DECRYPTOR INTERACTION PROTOCOL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-widest text-slate-100 uppercase">
                MKMODZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">WELCOME CORE</span>
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[9px] font-mono text-amber-500/40 font-black block tracking-widest">BUILD CORE v9.5</span>
              <span className="text-[8px] font-mono text-emerald-400 font-bold block tracking-widest">BYPASS VERIFIED ✔</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Welcome to the ultimate <strong className="text-amber-400 font-black">MKMODZ Video & Sound Decrypter</strong>. This offline-first 3D matrix-crafted bypass system extracts premium media streams directly from external decryption nodes, ignoring restriction walls.
            </p>
          </div>

          {/* Feature Grid with 3D Pop Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex gap-3.5 p-3.5 bg-black/40 border border-amber-500/10 hover:border-amber-500/25 rounded-2xl transition duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider">CYBER DECRYPTION CORE</h4>
                <p className="text-[10px] text-slate-400 leading-snug">Multi-threaded bypass servers scrape direct golden stream download links.</p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 bg-black/40 border border-amber-500/10 hover:border-amber-500/25 rounded-2xl transition duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition">
                <Music className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider">PREMIUM MP3 & HD EXTRACT</h4>
                <p className="text-[10px] text-slate-400 leading-snug">Easily grab ultra-clear 320kbps audios or high fidelity 1080P video streams.</p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 bg-black/40 border border-amber-500/10 hover:border-amber-500/25 rounded-2xl transition duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition">
                <Download className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider">UNLIMITED STREAM PROXIES</h4>
                <p className="text-[10px] text-slate-400 leading-snug">Integrated high-speed file download relays bypass ISP throttle limits.</p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 bg-black/40 border border-amber-500/10 hover:border-amber-500/25 rounded-2xl transition duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition">
                <Tv className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider">INFINITE RADAR SCANNING</h4>
                <p className="text-[10px] text-slate-400 leading-snug">Scroll down infinitely to discover premium songs, hits, lofi, and live videos.</p>
              </div>
            </div>
          </div>

          {/* Info Warning Tip */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-[10px] text-amber-500/70 font-mono leading-relaxed uppercase tracking-wider">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>TIP: Click the "GET VIDEO" button on any list card, select your decrypt payload format, and hit "GENERATE GOLD DOWNLINK URL" for seamless extraction!</span>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer group text-[10.5px] font-mono text-amber-500/50 hover:text-amber-400 select-none uppercase tracking-widest">
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => {
                  setDontShowAgain(e.target.checked);
                  playSound("tick");
                }}
                className="w-4 h-4 rounded border-2 border-amber-500/20 bg-black checked:bg-amber-500 checked:border-amber-400 text-slate-950 focus:ring-0 cursor-pointer"
              />
              <span>Do not show again</span>
            </label>

            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-[10.5px] tracking-widest rounded-2xl transition duration-200 uppercase shadow-[0_4px_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>INITIALIZE DOWNLINK</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
