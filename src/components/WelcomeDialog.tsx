import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ShieldCheck, 
  Info
} from "lucide-react";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (type: "tick" | "success" | "laser" | "beep") => void;
}

export const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ isOpen, onClose, playSound }) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  const handleClose = () => {
    playSound("success");
    if (dontShowAgain) {
      localStorage.setItem("mkmodz_welcome_dismissed", "true");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-amber-500/[0.08] blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#0e0a05] to-[#040301] border-2 border-amber-500/30 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),_0_0_30px_rgba(245,158,11,0.1)] select-none"
      >
        {/* Futuristic top scanner line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.6)]" />

        {/* Header Image Area with falls-back */}
        <div className="relative aspect-[16/7] w-full bg-black/80 overflow-hidden border-b border-amber-500/15">
          <img 
            src="/src/assets/welcome.png" 
            alt="welcome banner" 
            className="w-full h-full object-cover opacity-80 object-center transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a05] via-transparent to-black/30" />
          
          {/* Logo overlay on header */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/20 rounded-md text-[7.5px] font-mono text-amber-400 font-extrabold tracking-wider uppercase">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                <span>MKMODZ CORE</span>
              </div>
              <h2 className="text-sm font-black tracking-widest text-slate-100 uppercase">
                SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">INITIALIZATION</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[7.5px] font-mono text-emerald-400 font-bold block tracking-widest">VERIFIED ✔</span>
            </div>
          </div>
        </div>

        {/* Content Body - Extremely compact for mobile Android screens */}
        <div className="p-4 space-y-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-[11.5px] text-slate-300 leading-relaxed font-medium">
              Welcome to the high-speed <strong className="text-amber-400 font-bold">MKMODZ Decrypter</strong>. Extract premium audio & video streams directly from external nodes.
            </p>
          </div>

          {/* Quick instructions icon box */}
          <div className="flex items-start gap-2.5 p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[9.5px] text-amber-400/80 font-mono leading-normal uppercase">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Search any song below, tap "GET VIDEO" and choose MP3 or HD video format to decrypt & download!</span>
          </div>

          {/* Compact Action Footer */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-[10px] tracking-widest rounded-xl transition duration-150 uppercase shadow-[0_4px_12px_rgba(245,158,11,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              <span>START DECRYPTION</span>
            </button>

            <div className="flex justify-center">
              <label className="flex items-center gap-2 cursor-pointer group text-[9.5px] font-mono text-amber-500/55 hover:text-amber-400 select-none uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  checked={dontShowAgain}
                  onChange={(e) => {
                    setDontShowAgain(e.target.checked);
                    playSound("tick");
                  }}
                  className="w-3.5 h-3.5 rounded border border-amber-500/30 bg-black checked:bg-amber-500 checked:border-amber-400 text-slate-950 focus:ring-0 cursor-pointer"
                />
                <span>Do not show this manual again</span>
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
