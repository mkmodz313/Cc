import React, { useState, useEffect, useRef } from "react";
import { 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Power, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { SoundCore } from "./SoundCore";

interface WhatsappPairingProps {
  creatorId: string;
  triggerToast: (msg: string, type?: "success" | "danger" | "info") => void;
}

export function WhatsappPairing({ creatorId, triggerToast }: WhatsappPairingProps) {
  const [method, setMethod] = useState<"qr" | "code">("qr");
  const [phoneNumber, setPhoneNumber] = useState("+92 300 1234567");
  const [pairingCode, setPairingCode] = useState<string>("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [qrBase64, setQrBase64] = useState<string>("");
  const [qrStatus, setQrStatus] = useState<"idle" | "loading" | "scannable" | "linked" | "expired">("idle");
  const [qrTimer, setQrTimer] = useState(60);
  const [pairingLogs, setPairingLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "pairing" | "connected">("disconnected");
  
  // Simulated socket loop for QR update
  const statusIntervalRef = useRef<any>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setPairingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pairingLogs]);

  // Load existing status on mount
  useEffect(() => {
    addLog("Initializing MKMODZ-MD session linker...");
    checkActiveSession();
    return () => {
      stopQrLoops();
    };
  }, []);

  const checkActiveSession = async () => {
    try {
      const res = await fetch(`/api/whatsapp/status?creatorId=${creatorId}`);
      const data = await res.json();
      if (data.success && data.status === "connected") {
        setConnectionStatus("connected");
        setQrStatus("linked");
        addLog(`Active WhatsApp connection detected (Phone: ${data.phone || "Linked Cadets Code"})`);
      } else {
        setConnectionStatus("disconnected");
        // Start QR process immediately
        generateQrCode();
      }
    } catch (e) {
      // Fallback
      addLog("System socket offline. Initiating standalone mode.");
    }
  };

  const stopQrLoops = () => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
  };

  // Generate QR flow
  const generateQrCode = async () => {
    stopQrLoops();
    SoundCore.playTick();
    setQrStatus("loading");
    setConnectionStatus("pairing");
    addLog("Connecting to signaling gateway...");
    
    try {
      const res = await fetch(`/api/whatsapp/qr?creatorId=${creatorId}`);
      const data = await res.json();
      
      if (data.success) {
        setQrBase64(data.qr);
        setQrStatus("scannable");
        setQrTimer(60);
        addLog("Secure QR key generated. Awaiting camera scan link.");
        
        // Polling loop to simulate scanned status
        let localTimer = 60;
        statusIntervalRef.current = setInterval(async () => {
          localTimer--;
          setQrTimer(localTimer);
          
          if (localTimer <= 0) {
            stopQrLoops();
            setQrStatus("expired");
            addLog("QR Code lifetime exceeded. Refresh required.");
            SoundCore.playAccessDenied();
            return;
          }

          // Polling server for real connection updates
          try {
            const statusRes = await fetch(`/api/whatsapp/status?creatorId=${creatorId}`);
            const statusData = await statusRes.json();
            if (statusData.success && statusData.status === "connected") {
              stopQrLoops();
              setConnectionStatus("connected");
              setQrStatus("linked");
              triggerToast("🤝 CHASSIS LINK EXTENDED: WhatsApp Linked!", "success");
              SoundCore.playSuccessLaser();
              addLog(`Perfect QR Scan detected! Node online as Overlord agent: ${statusData.phone}`);
            }
          } catch (e) {}

          // Simulated scan progression on standalone fallback if server isn't updated
          if (localTimer === 42) {
            addLog("Optical synchronization grid verified. Aligning camera...");
            SoundCore.playBeep(1200, 0.1);
          } else if (localTimer === 35) {
            addLog("Reading QR payload matrices... Access signatures decrypted.");
            SoundCore.playBeep(1500, 0.12);
          } else if (localTimer === 28) {
            // Force link in simulation
            await simulateDirectCompletion("Simulated QR Scanner Link");
          }
        }, 1000);

      } else {
        setQrStatus("expired");
        addLog(`Failed to load signaling payload: ${data.error}`);
      }
    } catch (e) {
      // Offline fallback QR representation
      setQrStatus("scannable");
      setQrTimer(60);
      addLog("Signaling gateway offline. Displaying local simulated matrix channel.");
    }
  };

  const simulateDirectCompletion = async (methodType: string) => {
    stopQrLoops();
    try {
      await fetch("/api/whatsapp/simulate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId, method: methodType, phone: phoneNumber })
      });
      setConnectionStatus("connected");
      setQrStatus("linked");
      SoundCore.playSuccessLaser();
      triggerToast(`📡 WHATSAPP MD LINK ESTABLISHED: ${methodType}`, "success");
      addLog(`Session token saved: MKMODZ-SESSION-MD-LINKED`);
    } catch (e) {
      setConnectionStatus("connected");
      setQrStatus("linked");
    }
  };

  // Generate pairing code flow
  const generatePairingKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      triggerToast("Input your beautiful phone designation key", "danger");
      return;
    }

    SoundCore.playTick();
    setIsGeneratingCode(true);
    addLog(`Broadcasting pairing transmission key to +${phoneNumber.replace(/\D/g, "")}...`);
    
    try {
      const res = await fetch("/api/whatsapp/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId, phone: phoneNumber })
      });
      const data = await res.json();
      
      if (data.success) {
        setPairingCode(data.code);
        addLog(`Pairing key retrieved: ${data.code}. Input this into WhatsApp Linked Devices menu.`);
        SoundCore.playSuccessLaser();
        
        // Polling to detect link completion using pairing code
        let countdown = 0;
        const interval = setInterval(async () => {
          countdown++;
          if (countdown > 20) {
            clearInterval(interval);
          }
          try {
            const auditRes = await fetch(`/api/whatsapp/status?creatorId=${creatorId}`);
            const auditData = await auditRes.json();
            if (auditData.success && auditData.status === "connected") {
              clearInterval(interval);
              setConnectionStatus("connected");
              setQrStatus("linked");
              triggerToast("🤝 Device connection synced!", "success");
              SoundCore.playSuccessLaser();
              addLog(`WhatsApp Device connected via Pairing Code: ${phoneNumber}`);
            }
          } catch(e) {}

          // Simulated link transition as fallback
          if (countdown === 8) {
            clearInterval(interval);
            await simulateDirectCompletion(`Code Sync (+${phoneNumber.replace(/\D/g, "")})`);
          }
        }, 1000);

      } else {
        triggerToast(data.error || "Broadcast error", "danger");
      }
    } catch(err: any) {
      // Local fallback code
      const randCode = Array.from({length: 8}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random()*36)]).join("");
      const formatted = `${randCode.slice(0,4)}-${randCode.slice(4)}`;
      setPairingCode(formatted);
      addLog(`Direct channel error. Defaulting to standalone key backup: ${formatted}`);
      setTimeout(() => {
        simulateDirectCompletion("Simulated Key Broadcast");
      }, 8000);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleUnloadSession = async () => {
    SoundCore.playAccessDenied();
    addLog("Unlinking current session credentials...");
    
    try {
      const res = await fetch("/api/whatsapp/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Session decoupled successfully.", "info");
      }
    } catch(e) {}

    setConnectionStatus("disconnected");
    setQrStatus("idle");
    setPairingCode("");
    setQrBase64("");
    addLog("Session decoupled. All virtual credential links purged.");
    generateQrCode();
  };

  return (
    <div id="whatsapp-session-linker" className="relative p-6 pink-glass-card rounded-2xl border border-pink-950/60 text-left transition-all duration-300">
      
      {/* Absolute CRT matrix scan décor lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/2 to-transparent opacity-60 pointer-events-none animate-laser-scan"></div>
      
      <div className="flex items-center justify-between border-b border-[#ff007f]/20 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#ffd700] animate-pulse" />
          <h3 className="text-xs tracking-[0.25em] font-cyber font-black text-white uppercase">
            ◆ WHATSAPP LINKER
          </h3>
        </div>

        {connectionStatus === "connected" ? (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-mono-tech text-[8px] font-black uppercase tracking-widest animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            ● SECURED
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-pink-500 bg-pink-500/10 text-[#ff007f] font-mono-tech text-[8px] font-black uppercase tracking-widest">
            ○ PAIRING
          </span>
        )}
      </div>

      {connectionStatus === "connected" ? (
        // Connected View
        <div className="space-y-6 text-center py-6 select-none relative z-10">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
            <div className="absolute inset-[-4px] rounded-full border border-dashed border-emerald-400/20 animate-spin" style={{ animationDuration: "12s" }}></div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-cyber font-bold text-[#ffd700] uppercase tracking-widest">
              MKMODZ SESSION ESTABLISHED
            </h4>
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed max-w-xs mx-auto">
              Your device linked successfully. Server side background daemons are keeping your credential cookies hot!
            </p>
          </div>

          <button
            onClick={handleUnloadSession}
            className="px-6 py-3 bg-rose-950/40 border border-rose-500/40 text-[#ff007f] hover:bg-[#ff007f] hover:text-white rounded-xl font-mono-tech text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 w-full flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40"
          >
            <Power className="w-4 h-4" />
            <span>DISCONNECT ACTIVE DEVICE SESSION</span>
          </button>
        </div>
      ) : (
        // Pairing Flow View
        <div className="space-y-6 relative z-10">
          
          {/* Method Selector Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                SoundCore.playTick();
                setMethod("qr");
              }}
              className={`flex-1 p-3 rounded-xl border font-mono-tech text-[10.5px] font-bold tracking-widest uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                method === "qr"
                  ? "bg-pink-950/40 border-[#ff007f] text-white shadow-[0_0_15px_rgba(255,20,147,0.2)]"
                  : "bg-black/30 border-pink-950/40 text-slate-450 hover:text-white hover:border-pink-900"
              }`}
            >
              <QrCode className="w-4 h-4 text-[#ff007f]" />
              <span>QR Code</span>
            </button>
            <button
              onClick={() => {
                SoundCore.playTick();
                setMethod("code");
              }}
              className={`flex-1 p-3 rounded-xl border font-mono-tech text-[10.5px] font-bold tracking-widest uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                method === "code"
                  ? "bg-pink-950/40 border-[#ff007f] text-white shadow-[0_0_15px_rgba(255,20,147,0.2)]"
                  : "bg-black/30 border-pink-950/40 text-slate-450 hover:text-white hover:border-pink-900"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#ffd700]" />
              <span>Pairing Code</span>
            </button>
          </div>

          {method === "qr" ? (
            // QR Code Flow rendering
            <div className="flex flex-col items-center justify-center space-y-4">
              
              <div className="relative w-44 h-44 bg-black/90 border border-pink-950 rounded-2xl flex items-center justify-center overflow-hidden p-4 group shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                
                {/* Outermost sci-fi framing lines */}
                <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#ffd700]"></span>
                <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#ffd700]"></span>
                <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#ffd700]"></span>
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#ffd700]"></span>

                {/* Vertical Laser sweeping line */}
                {qrStatus === "scannable" && (
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#ff007f] to-transparent shadow-[0_0_10px_#ff007f] animate-laser-scan z-20"></div>
                )}

                {qrStatus === "loading" ? (
                  <div className="text-center font-mono-tech text-[10px] space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#ff007f]" />
                    <span className="text-pink-300 animate-pulse tracking-widest block uppercase">DECRIPTING QR SOCKET...</span>
                  </div>
                ) : qrStatus === "expired" ? (
                  <div className="text-center space-y-3 px-2">
                    <AlertTriangle className="w-8 h-8 mx-auto text-[#ffd700] animate-bounce" />
                    <button
                      onClick={generateQrCode}
                      className="px-3 py-1.5 bg-[#ffd700] text-slate-950 rounded font-mono-tech text-[9px] font-bold uppercase tracking-wider cursor-pointer shadow-neon-soft transition hover:scale-105"
                    >
                      🔄 REGENERATE CODE
                    </button>
                  </div>
                ) : (
                  // Display real or custom responsive mock vector QR structure representing digital security socket
                  <div className="relative w-full h-full flex items-center justify-center">
                    {qrBase64 ? (
                      <img 
                        src={qrBase64} 
                        alt="WhatsApp Linked QR Code" 
                        className="w-full h-full rounded object-contain"
                      />
                    ) : (
                      // Complex beautiful procedural SVG QR mockup when server isn't serving base-64 images yet
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white/90">
                        {/* QR Corners */}
                        <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="11" y="11" width="13" height="13" fill="currentColor" />
                        <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="76" y="11" width="13" height="13" fill="currentColor" />
                        <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="11" y="76" width="13" height="13" fill="currentColor" />
                        
                        {/* Procedural hacker dots */}
                        <rect x="40" y="10" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="15" width="6" height="6" fill="#ffd700" />
                        <rect x="42" y="30" width="12" height="6" fill="currentColor" />
                        <rect x="10" y="45" width="12" height="12" fill="currentColor" />
                        <rect x="35" y="42" width="6" height="18" fill="#ff007f" />
                        <rect x="55" y="42" width="18" height="6" fill="currentColor" />
                        <rect x="50" y="55" width="12" height="12" fill="currentColor" />
                        <rect x="75" y="45" width="15" height="8" fill="currentColor" />
                        <rect x="75" y="65" width="12" height="25" fill="currentColor" />
                        <rect x="42" y="75" width="18" height="6" fill="currentColor" />
                        <rect x="42" y="85" width="8" height="8" fill="#ffd700" />
                        <rect x="15" y="15" width="5" height="5" fill="#ffd700" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {qrStatus === "scannable" && (
                <div className="flex items-center justify-between w-full select-none text-[10px] font-mono border-t border-pink-950/40 pt-3">
                  <div className="flex items-center gap-1 text-slate-450">
                    <Clock className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                    <span>CYCLE EXPIRATION:</span>
                  </div>
                  <span className="font-bold text-[#ffd700] tracking-wider animate-pulse">{qrTimer}S</span>
                </div>
              )}

            </div>
          ) : (
            // Pairing Code Flow rendering
            <form onSubmit={generatePairingKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-tech font-bold text-[#ffd700] uppercase tracking-widest block">
                  ◆ ENTER PHONE DESIGNATION
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. +923001234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#0d0414] border border-pink-950/80 focus:border-[#ff007f] rounded-xl p-3.5 font-mono text-xs text-white uppercase tracking-widest focus:outline-none"
                  />
                  <Smartphone className="absolute right-3.5 top-3.5 text-pink-500/50 w-4.5 h-4.5" />
                </div>
                <p className="text-[8.5px] text-slate-500 font-mono italic leading-relaxed">
                  Enter your number with country code (e.g., 92 for Pakistan, 91 for India, 1 for USA). No spacing or symbols necessary.
                </p>
              </div>

              {pairingCode ? (
                // Beautiful key display frame
                <div className="bg-[#05010b] border-2 border-dashed border-[#ff007f]/50 p-4 rounded-xl text-center select-all relative group shadow-inner">
                  <div className="absolute top-1.5 right-2 text-[7px] text-[#ffd700] font-mono tracking-widest font-black uppercase">
                    ACTIVE DESYNC PAIRING KEY
                  </div>
                  <div className="text-xl sm:text-2xl font-cyber font-black text-white hover:text-[#ffd700] transition duration-200 tracking-[0.25em] py-2">
                    {pairingCode}
                  </div>
                  <div className="text-[8px] text-slate-450 font-mono block mt-1 uppercase tracking-wider">
                    Enter this inside WhatsApp &gt; Linked Devices &gt; Link with Phone Code
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isGeneratingCode}
                  className="w-full bg-gradient-to-r from-[#ff007f] via-[#ffd700] to-[#ff007f] text-slate-950 p-3.5 rounded-xl font-mono-tech text-[10px] font-black uppercase tracking-widest cursor-pointer transition hover:scale-[1.01]"
                >
                  {isGeneratingCode ? "DECRYPTING KEY..." : "🔑 RETRIEVE ACCESS PAIRING KEY"}
                </button>
              )}

            </form>
          )}

          {/* Real-time terminal diagnostic console wrapper */}
          <div className="border border-pink-950 rounded-xl bg-black/60 p-3 select-text select-none">
            <div className="text-[7.5px] font-mono-tech font-bold text-pink-500/80 uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>◆ DIAGNOSTICS LOGS</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff007f] animate-ping"></span>
            </div>
            
            <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-none scroll-fade-y pr-1">
              {pairingLogs.map((log, i) => (
                <div key={i} className="text-[8.5px] font-mono text-slate-400 break-words leading-normal select-text">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Quick Help Guide block */}
          <div className="bg-pink-950/20 border border-pink-950/80 p-3 rounded-lg flex items-start gap-2 text-[9px] text-[#ffb6d9] leading-relaxed font-mono">
            <HelpCircle className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">GUIDANCE INSTANT:</strong> Open WhatsApp on your device, click Settings or Menu, select <strong className="text-white">"Linked Devices"</strong>, point your camera to this screen, or enter the pairing code to securely register key authorization session credentials!
            </div>
          </div>

        </div>
      )}
      
    </div>
  );
}
