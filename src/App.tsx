import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Terminal, 
  Settings, 
  Clock, 
  Cpu, 
  ShieldAlert, 
  ExternalLink, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Activity, 
  Users, 
  Smartphone, 
  Crown,
  Key,
  Database,
  Grid,
  LogOut,
  Globe,
  ChevronRight,
  Sparkles,
  Check,
  Upload,
  X,
  Info
} from "lucide-react";
import { SoundCore } from "./components/SoundCore";
import { db } from "./firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import stylishBoyImg from "./assets/images/stylish_boy_1782169107213.jpg";

// Define unified interface for our toolkit items
interface ToolItem {
  id: string;
  name: string;
  link: string;
  img: string;
  category: "Aim Mods" | "Sensors" | "Bypass" | "Security";
  status: "ACTIVE" | "OFFLINE" | "BETA";
  description: string;
  details?: string[];
}

// Simulated boot logs
const SYSTEM_BOOT_LOGS = [
  "LOG: Initializing MKMODZ standalone offline engine...",
  "SEC: Opening sandbox security environment variables...",
  "NET: Probing local storage cache parameters...",
  "SYS: Compiling beautiful high-contrast CSS utilities...",
  "SYS: Loading Lucide icon vector packages...",
  "SEC: Launching premium cyber-assist triggers...",
  "AUTH: Awaiting operator credential handshake...",
  "SYS: CONSOLE RUN CODES SUCCESSFUL. ENJOY SECURE WEB CONSOLE..."
];

// Default seeded high-fidelity bypass tools
const DEFAULT_SEED_TOOLS: ToolItem[] = [
  {
    id: "whatsapp-bug",
    name: "WhatsApp Bug Bot",
    img: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Bypass",
    status: "ACTIVE",
    description: "Direct group command bypass matrix that crashes target telemetry logs cleanly.",
    details: ["VIP BUG PROTOCOLS", "100% CRASH RATIO", "ANTI-REPORT PROTECT", "BYPASS CHAT BLOCKERS"]
  },
  {
    id: "mt-manager",
    name: "MT Manager Pro",
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Security",
    status: "ACTIVE",
    description: "Professional multi-threaded smali decompiler and secure key signature bypass.",
    details: ["RAW SMALI REFACTOR", "SIGNATURE BYPASS v3", "HEX DEC_INJECTOR", "PREMIUM LEVEL UNLOCKED"]
  },
  {
    id: "apk-editor",
    name: "APK Editor Pro",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Security",
    status: "ACTIVE",
    description: "Raw XML structural manifest refactor tool with instant offline compiling triggers.",
    details: ["MANIFEST INJECTOR", "RAW DECOMPILING", "NO WATERMARK INJECT", "ALL PREMIUM TOOLS LIVE"]
  },
  {
    id: "tik-downloader",
    name: "Tik Video Downloader",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Aim Mods",
    status: "ACTIVE",
    description: "Extracts HD video assets instantly by bypassing TikTok CDN token gates.",
    details: ["100% WATERMARK STRIP", "HD MP4 STREAM EXTRACT", "EXTREMELY FAST RETRIEVAL", "NO API KEYS REQUIRED"]
  },
  {
    id: "image-to-url",
    name: "Image to URL host",
    img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Sensors",
    status: "ACTIVE",
    description: "Launches high-speed temporary asset proxies and formats clean CDN links.",
    details: ["0MS CLOUD CDN LATENCY", "ENCRYPTED MEDIA PIPES", "AUTO-DESTROY TIMERS", "SHORTENED LINK OUTPUTS"]
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro 2026",
    img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Bypass",
    status: "ACTIVE",
    description: "Bypasses CapCut render servers to unlock 4K export presets and premium templates.",
    details: ["CAPCUT PRO NEW UPDATE", "100% WORKING ASSETS", "ALL PREMIUM UNLOCKED", "NO INTERNET ERRORS", "NO WATERMARK RENDER"]
  },
  {
    id: "remini-pro",
    name: "Remini Pro 2026",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Aim Mods",
    status: "ACTIVE",
    description: "Professional AI-driven resolution upscale model bypassing cloud payment gates.",
    details: ["HD SHARPENING MATRIX", "4K UPSCALE RENDERING", "CRYSTAL PORTRAIT RESTORE", "ZERO ADVERTISING LOOP"]
  },
  {
    id: "pixellab-pro",
    name: "PixelLab Pro Premium",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Sensors",
    status: "ACTIVE",
    description: "Unlocks elegant custom-branded font files and provides master template access.",
    details: ["CUSTOM FONTS UNLOCKED", "RAW VECTOR RENDERER", "LOGOUT VERIFICATION BYPASS", "HIGH CONTRAST EXPORTS"]
  }
];

// Helper functions for safe local storage
const safeGetItem = (key: string, fallback: string): string => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
};

const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
};

export default function App() {
  // --- CORE TERMINAL STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return safeGetItem("stand_loggedIn", "false") === "true";
  });
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  
  const [terminalFeatures, setTerminalFeatures] = useState<ToolItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [terminalSearchQuery, setTerminalSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [terminalCategory, setTerminalCategory] = useState<string>("ALL");

  // Debounce search input to avoid excessive list filtering and focus cuts
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setTerminalSearchQuery(searchInput);
    }, 180);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);
  
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS: Dynamic HUD interfaces and terminal initialized.",
    "SYS: Firebase cloud handshake in standby...",
    "SEC: Client-side persistent indexing fully active."
  ]);
  const [terminalClock, setTerminalClock] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(731);
  const [firebaseStatus, setFirebaseStatus] = useState<"ACTIVE" | "OFFLINE/CACHED">("ACTIVE");

  // Auth Inputs
  const [authName, setAuthName] = useState<string>("");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPass, setAuthPass] = useState<string>("");

  // UI States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);
  const [splashLogs, setSplashLogs] = useState<string[]>([]);
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" | "info" }>({
    show: false,
    msg: "",
    type: "info"
  });

  // Dialog & Drawer toggles
  const [showSideDrawer, setShowSideDrawer] = useState<boolean>(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false);
  const [showAdminDrawer, setShowAdminDrawer] = useState<boolean>(false);
  const [showWelcomeBriefing, setShowWelcomeBriefing] = useState<boolean>(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");

  // New tool creation state
  const [newToolName, setNewToolName] = useState("");
  const [newToolLink, setNewToolLink] = useState("");
  const [newToolImg, setNewToolImg] = useState("");
  const [newToolCat, setNewToolCat] = useState<"Aim Mods" | "Sensors" | "Bypass" | "Security">("Bypass");
  const [newToolDesc, setNewToolDesc] = useState("");

  // Profile status state
  const [userData, setUserData] = useState<{ name: string; userId: string; pfp: string }>(() => {
    try {
      const saved = safeGetItem("stand_user", "");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: "MK-MODZ",
      userId: "MK-" + Math.floor(1000 + Math.random() * 9000),
      pfp: stylishBoyImg || "https://ui-avatars.com/api/?name=MK&background=06b6d4&color=0f172a&bold=true"
    };
  });

  const [customBase64, setCustomBase64] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- TRIGGER TOASTS ---
  const triggerToast = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ show: true, msg, type });
    if (type === "success") {
      SoundCore.playSuccessLaser();
    } else if (type === "error") {
      SoundCore.playTick();
    } else {
      SoundCore.playTick();
    }
  };

  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  // --- BACKGROUND MATRIX / CYBER RAIN EFFECTS ---
  useEffect(() => {
    if (!showSplash) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "0101010111001MKMODZCYBER88BYPASS7766";
    const charArr = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const rainDrops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 15, 26, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#06b6d4"; // Cyber cyan
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < rainDrops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [showSplash]);

  // --- REAL-TIME FLUTTER FOR ONLINE COUNTERS ---
  useEffect(() => {
    if (showSplash) return;
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3 flutter
        const next = prev + delta;
        return next < 700 ? 731 : next > 760 ? 731 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [showSplash]);

  // --- SOUND TOGGLE ---
  const toggleMute = () => {
    SoundCore.playTick();
    setIsMuted(!isMuted);
    if (!isMuted) {
      SoundCore.stopSpaceHum();
    } else {
      SoundCore.startSpaceHum();
    }
  };

  // --- REAL-TIME CLOCK 업데이트 ---
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      setTerminalClock(`${hh}:${mm}:${ss}`);
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // --- SPLASH SEQUENCE TIMING AND TYPEWRITING ---
  useEffect(() => {
    if (!showSplash) return;
    SoundCore.startSpaceHum();

    let logIndex = 0;
    const progressInterval = setInterval(() => {
      setSplashProgress((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 8) + 4, 100);

        if (next % 6 === 0) {
          SoundCore.playTick();
        }

        const logTriggers = [0, 15, 30, 45, 60, 75, 90, 100];
        const triggerIndex = logTriggers.findIndex((t) => prev < t && next >= t);
        if (triggerIndex !== -1 && triggerIndex < SYSTEM_BOOT_LOGS.length) {
          setSplashLogs((l) => [...l, SYSTEM_BOOT_LOGS[triggerIndex]]);
        }

        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            SoundCore.playSuccessLaser();
            setShowSplash(false);
          }, 800);
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, [showSplash]);

  // --- SHOW WELCOME BRIEFING ONCE PER SESSION ---
  useEffect(() => {
    if (isLoggedIn && !showSplash) {
      try {
        const seen = sessionStorage.getItem("stand_seenBriefing") === "true";
        if (!seen) {
          setTimeout(() => {
            setShowWelcomeBriefing(true);
            SoundCore.playSuccessLaser();
          }, 600);
        }
      } catch (e) {
        setShowWelcomeBriefing(true);
      }
    }
  }, [isLoggedIn, showSplash]);

  // --- FIREBASE AND LOCAL STORAGE RETRIEVAL ENGINE ---
  useEffect(() => {
    // 1. Initialise local cache for fast loading
    const cached = safeGetItem("stand_features", "");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          setTerminalFeatures(parsed);
          setSelectedTool(parsed[0]);
          setFirebaseStatus("OFFLINE/CACHED");
        }
      } catch (e) {
        console.error("Local features parsing error", e);
      }
    }

    // 2. Real-time Firebase Firestore observer
    try {
      const featuresRef = collection(db, "features");
      const unsubscribe = onSnapshot(featuresRef, (snapshot) => {
        const cloudItems: ToolItem[] = [];
        snapshot.forEach((doc) => {
          cloudItems.push({ id: doc.id, ...(doc.data() as Omit<ToolItem, "id">) });
        });

        if (cloudItems.length > 0) {
          setTerminalFeatures(cloudItems);
          setSelectedTool((prev) => {
            if (prev) {
              const matched = cloudItems.find(x => x.id === prev.id);
              return matched || cloudItems[0];
            }
            return cloudItems[0];
          });
          safeSetItem("stand_features", JSON.stringify(cloudItems));
          setFirebaseStatus("ACTIVE");
        } else {
          // If Firestore is empty, auto-seed default tools in the background
          DEFAULT_SEED_TOOLS.forEach(async (tool) => {
            try {
              await setDoc(doc(db, "features", tool.id), {
                name: tool.name,
                link: tool.link,
                img: tool.img,
                category: tool.category,
                status: tool.status,
                description: tool.description,
                details: tool.details || []
              });
            } catch (err) {
              console.error("Auto-seeding error:", err);
            }
          });
          setTerminalFeatures(DEFAULT_SEED_TOOLS);
          setSelectedTool(DEFAULT_SEED_TOOLS[0]);
          safeSetItem("stand_features", JSON.stringify(DEFAULT_SEED_TOOLS));
          setFirebaseStatus("ACTIVE");
        }
      }, (error) => {
        console.warn("Firestore access denied or restricted. Using local backup:", error);
        setFirebaseStatus("OFFLINE/CACHED");
        if (terminalFeatures.length === 0) {
          setTerminalFeatures(DEFAULT_SEED_TOOLS);
          setSelectedTool(DEFAULT_SEED_TOOLS[0]);
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Database initialization failed. Using offline backup.", err);
      setFirebaseStatus("OFFLINE/CACHED");
      if (terminalFeatures.length === 0) {
        setTerminalFeatures(DEFAULT_SEED_TOOLS);
        setSelectedTool(DEFAULT_SEED_TOOLS[0]);
      }
    }
  }, []);

  // --- HANDLE AUTH (LOGIN / REGISTER) ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    SoundCore.playTick();

    if (!authEmail || !authPass) {
      triggerToast("Operator Email and Passcode are required!", "error");
      return;
    }

    if (isSignUpMode) {
      const displayName = authName.trim() || "MK-USER";
      const uId = "MK-" + Math.floor(1000 + Math.random() * 9000);
      const newProfile = {
        name: displayName,
        userId: uId,
        pfp: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=06b6d4&color=0f172a&bold=true`
      };
      setUserData(newProfile);
      safeSetItem("stand_user", JSON.stringify(newProfile));
      triggerToast("Cryptographic signature key created successfully!", "success");
      setIsSignUpMode(false);
    } else {
      safeSetItem("stand_loggedIn", "true");
      setIsLoggedIn(true);
      triggerToast("Permissions authorized! Welcome to HUD Dashboard.", "success");
    }
  };

  // --- LOGOUT SESSION ---
  const handleLogout = () => {
    SoundCore.playTick();
    safeRemoveItem("stand_loggedIn");
    setIsLoggedIn(false);
    setShowSideDrawer(false);
    setShowProfileDrawer(false);
    setShowAdminDrawer(false);
    triggerToast("Session security terminated cleanly.", "info");
  };

  // --- PROFILE CUSTOMIZE CHANGE ---
  const previewPfpFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const resultStr = evt.target?.result as string;
      const img = new Image();
      img.src = resultStr;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 300;
        let w = img.width;
        let h = img.height;
        
        if (w > maxW) {
          h *= maxW / w;
          w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        
        const b64 = canvas.toDataURL("image/jpeg", 0.6);
        setCustomBase64(b64);
        triggerToast("Avatar compiled & optimized!", "success");
      };
    };
    reader.readAsDataURL(file);
  };

  const saveProfileData = () => {
    SoundCore.playTick();
    const updated = {
      ...userData,
      name: authName.trim() || userData.name,
      pfp: customBase64 || userData.pfp
    };
    setUserData(updated);
    safeSetItem("stand_user", JSON.stringify(updated));
    triggerToast("Profile rewritten cleanly!", "success");
    setShowProfileDrawer(false);
  };

  // --- COMPILING & DEPLOYING CUSTOM INJECTOR (TO FIRESTORE!) ---
  const handleDeployCustomMod = async (e: React.FormEvent) => {
    e.preventDefault();
    SoundCore.playTick();

    if (!newToolName || !newToolLink) {
      triggerToast("Mod Name and Payload Link are required!", "error");
      return;
    }

    const modId = "custom-" + Date.now();
    const imageToUse = newToolImg.trim() || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop";
    
    const deployedData: ToolItem = {
      id: modId,
      name: newToolName,
      link: newToolLink,
      img: imageToUse,
      category: newToolCat,
      status: "ACTIVE",
      description: newToolDesc.trim() || "User injected diagnostic bypass signature profile."
    };

    try {
      // Direct Firebase Firestore upload!
      const docRef = doc(db, "features", modId);
      await setDoc(docRef, {
        name: deployedData.name,
        link: deployedData.link,
        img: deployedData.img,
        category: deployedData.category,
        status: deployedData.status,
        description: deployedData.description,
        details: ["INJECTED PROTOCOL", "ONLINE BYPASS SIGNATURE"]
      });

      // Update local listing immediately for instant gratification
      setTerminalFeatures((prev) => [deployedData, ...prev]);
      triggerToast("Bypass Injector deployed to Firebase!", "success");

      // Reset fields
      setNewToolName("");
      setNewToolLink("");
      setNewToolImg("");
      setNewToolDesc("");
      setShowAdminDrawer(false);
    } catch (err) {
      console.error("Firestore Upload Error:", err);
      triggerToast("Deployment failed! Check internet connection.", "error");
    }
  };

  // --- DELETE MOD FROM FIRESTORE ---
  const handleDeleteMod = async (id: string) => {
    SoundCore.playTick();
    try {
      await deleteDoc(doc(db, "features", id));
      setTerminalFeatures((prev) => prev.filter((x) => x.id !== id));
      triggerToast("Signature de-authorized cleanly.", "success");
    } catch (err) {
      console.error("Delete mod error:", err);
      // Fallback local delete
      setTerminalFeatures((prev) => prev.filter((x) => x.id !== id));
      triggerToast("Removed locally (Check Database Permissions).", "info");
    }
  };

  // --- DE-AUTHORIZE & PURGE LOCAL DATABASE/RESTORE PRESETS ---
  const handleRestorePresets = async () => {
    SoundCore.playTick();
    if (window.confirm("ARE YOU SURE YOU WANT TO PURGE ALL DEPLOYED TELEMETRY INJECTORS?")) {
      // Attempt to clear all items in firestore
      try {
        terminalFeatures.forEach(async (feat) => {
          await deleteDoc(doc(db, "features", feat.id));
        });
      } catch (e) {}

      // Re-seed default tools
      DEFAULT_SEED_TOOLS.forEach(async (tool) => {
        try {
          await setDoc(doc(db, "features", tool.id), {
            name: tool.name,
            link: tool.link,
            img: tool.img,
            category: tool.category,
            status: tool.status,
            description: tool.description,
            details: tool.details || []
          });
        } catch (e) {}
      });

      setTerminalFeatures(DEFAULT_SEED_TOOLS);
      setSelectedTool(DEFAULT_SEED_TOOLS[0]);
      safeSetItem("stand_features", JSON.stringify(DEFAULT_SEED_TOOLS));
      triggerToast("Database purged and restored to preset defaults.", "success");
    }
  };

  // --- ENTER ADMIN DRAWER PASSCODE CHALLENGE ---
  const handleOpenAdminWithPasscode = () => {
    SoundCore.playTick();
    setShowSideDrawer(false);
    setPasscodeInput("");
    setShowPasscodeModal(true);
  };

  // Auto-select first matching tool if search query filters current selection out
  useEffect(() => {
    if (terminalSearchQuery.trim() !== "") {
      const matches = terminalFeatures.filter(f => {
        if (!f) return false;
        if (terminalCategory !== "ALL" && f.category !== terminalCategory) {
          return false;
        }
        const name = f.name || "";
        const desc = f.description || "";
        const query = terminalSearchQuery || "";
        return name.toLowerCase().includes(query.toLowerCase()) || 
               desc.toLowerCase().includes(query.toLowerCase());
      });
      if (matches.length > 0) {
        const isCurrentMatched = matches.some(m => m && m.id === selectedTool?.id);
        if (!isCurrentMatched) {
          setSelectedTool(matches[0]);
        }
      }
    }
  }, [terminalSearchQuery, terminalCategory, terminalFeatures, selectedTool]);

  // Filter tools listing based on inputs with safe property checks
  const filteredTools = terminalFeatures
    .filter(f => f && (terminalCategory === "ALL" || f.category === terminalCategory))
    .filter(f => {
      const name = f?.name || "";
      const desc = f?.description || "";
      const query = terminalSearchQuery || "";
      return name.toLowerCase().includes(query.toLowerCase()) || 
             desc.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-[#04060b] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 relative">
      
      {/* Dynamic Cyber Backdrop */}
      <div className="fixed inset-0 bg-[#04060b] -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(34,211,238,0.06),transparent_100%)]"></div>
      </div>

      {/* Laser Sweep Scan overlay */}
      <div className="fixed inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4]/40 to-transparent pointer-events-none z-50 animate-laser-scan"></div>

      {/* 1. TOAST NOTIFICATION HUD */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -100, opacity: 0 }}
            className="fixed top-6 inset-x-4 max-w-sm mx-auto z-[999999] bg-[#070b13]/95 border-2 rounded-2xl p-4 flex gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
            style={{ 
              borderColor: toast.type === "success" 
                ? "rgba(16, 185, 129, 0.6)" 
                : toast.type === "error" 
                ? "rgba(239, 68, 68, 0.6)" 
                : "rgba(6, 182, 212, 0.6)" 
            }}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : toast.type === "error" ? (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {toast.type === "success" ? "TRANSMISSION SECURED" : toast.type === "error" ? "PROTOCOL FAILURE" : "SYSTEM MESSAGE"}
              </h4>
              <p className="text-xs font-mono font-bold text-slate-200 mt-1 leading-relaxed uppercase">
                {toast.msg}
              </p>
            </div>
            <button onClick={() => setToast((p) => ({ ...p, show: false }))} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ULTRADYNAMIC CHROME HACKER SPLASH SCREEN (WORLD-CLASS CINEMATIC GRAPHICS) */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99999] bg-[#030509] flex flex-col justify-center items-center overflow-hidden select-none"
          >
            {/* Background glowing orb decorators (super-smooth CSS hardware-accelerated animations) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: "8s" }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: "12s" }}></div>
            
            {/* Fine line vector scangrid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.015)_50%,transparent_50%)] bg-[size:100%_3px] pointer-events-none z-10" />

            {/* Core Interactive Loader Frame */}
            <div className="relative z-20 flex flex-col items-center max-w-xl px-8 w-full text-center">
              
              {/* Outer Circular Sci-Fi Radar Target */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                {/* Outer spinning tick marks */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: "25s" }}></div>
                {/* Secondary counter-rotating ring */}
                <div className="absolute inset-3 rounded-full border border-indigo-500/35 border-t-transparent animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }}></div>
                {/* Inner target crosshairs */}
                <div className="absolute inset-6 rounded-full border border-cyan-500/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                </div>

                {/* Main Progress Indicator Circle */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="64" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="96" 
                    cy="96" 
                    r="64" 
                    stroke="url(#cyanGlow)" 
                    strokeWidth="3.5" 
                    fill="transparent" 
                    strokeDasharray="402" 
                    strokeDashoffset={402 - (402 * splashProgress) / 100} 
                    strokeLinecap="round"
                    className="transition-all duration-150"
                  />
                  <defs>
                    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Middle Core Info Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-cyber text-2xl font-black text-cyan-400 tracking-wider drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                    {splashProgress}%
                  </span>
                  <span className="text-[7px] font-mono text-slate-500 font-extrabold uppercase tracking-[0.2em] mt-1">
                    DECRYPTING
                  </span>
                </div>
              </div>

              {/* Title & Brand Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/5 border border-cyan-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-[8px] font-mono text-cyan-300 font-extrabold uppercase tracking-widest">SECURE OPERATOR INTERACTION</span>
                </div>
                <h1 className="font-cyber text-3xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  MKMODZ <span className="text-cyan-400">ELITE</span>
                </h1>
                <p className="font-mono text-[9px] text-indigo-400/80 tracking-[0.25em] font-extrabold uppercase">
                  HIGH-PERFORMANCE COMPILING GATEWAY
                </p>
              </div>

              {/* Progress Bar Line */}
              <div className="w-full max-w-sm mt-8 bg-slate-950/80 border border-slate-900 rounded-full h-1.5 p-0.5 overflow-hidden relative shadow-inner">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-150 relative shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${splashProgress}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" />
                </div>
              </div>

              {/* Professional Real-Time Scrolling Compilation Console Logs */}
              <div className="w-full mt-6 bg-[#04070c]/90 border border-slate-900 rounded-2xl p-4 text-left font-mono text-[9px] text-cyan-500/85 min-h-36 max-h-40 overflow-y-auto space-y-1.5 shadow-2xl relative scrollbar-none">
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#04070c] to-transparent pointer-events-none z-10"></div>
                
                <div className="text-slate-500 uppercase tracking-widest font-black text-[8px] border-b border-slate-900 pb-2 mb-2 flex justify-between">
                  <span>🔐 DECRYPTION SYSTEM BYPASS HANDSHAKE</span>
                  <span className="animate-pulse text-cyan-400 font-bold">ACTIVE INJECTORS STATUS: OK</span>
                </div>
                
                {splashLogs.map((log, index) => (
                  <div key={index} className="flex gap-2.5 leading-relaxed items-center">
                    <span className="text-indigo-400/60 font-black shrink-0 font-mono">[0{index + 1}]</span>
                    <span className="text-slate-300 font-mono tracking-wide">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SECURE GATEWAY / LOGIN SCREEN */}
      <AnimatePresence>
        {!showSplash && !isLoggedIn && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="min-h-screen flex items-center justify-center p-4 relative z-10"
          >
            <div className="w-full max-w-md bg-[#070b13]/90 border border-[#22d3ee]/25 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent"></div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce" style={{ animationDuration: "3s" }}>
                  <ShieldAlert className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="font-cyber text-2xl font-black text-white tracking-widest uppercase">
                  {isSignUpMode ? "KEY CREATOR" : "SECURE GATEWAY"}
                </h2>
                <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1">
                  {isSignUpMode ? "REGISTER NEW SIGNATURE" : "VERIFY ACCESS KEY CODES"}
                </p>
              </div>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUpMode && (
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                      Operator Signature Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                      <input 
                        type="text" 
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Killers~Boy" 
                        className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl py-3.5 pl-11 pr-4 text-xs font-mono text-cyan-300 outline-none uppercase transition-all"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                    Encrypted Email Address
                  </label>
                  <div className="relative">
                    <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="operator@mkmodz.net" 
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl py-3.5 pl-11 pr-4 text-xs font-mono text-cyan-300 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                    Passcode / Key Payload
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                    <input 
                      type="password" 
                      required
                      value={authPass}
                      onChange={(e) => setAuthPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl py-3.5 pl-11 pr-4 text-xs font-mono text-cyan-300 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-xs tracking-widest rounded-xl transition-all uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSignUpMode ? "GENERATE SECURITY CREDENTIALS" : "SYSTEM RECON_MODE INITIATION"}
                  </span>
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => {
                    SoundCore.playTick();
                    setIsSignUpMode(!isSignUpMode);
                  }}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 tracking-widest uppercase transition-all bg-transparent border-none cursor-pointer"
                >
                  {isSignUpMode 
                    ? "ALREADY GENERATED? AUTHORIZE ACCESS" 
                    : "LACKING SIGNATURE KEY? CREATE CREDENTIALS"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MAIN DASHBOARD HUD CONTAINER PANEL */}
      <AnimatePresence>
        {!showSplash && isLoggedIn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-6 md:px-8 max-w-7xl mx-auto relative z-10"
          >
            {/* TOP DYNAMIC HUD HEADER (ROUNDED FLOATING MENU BAR) */}
            <header className="mb-8 bg-[#070b13]/85 border border-[#22d3ee]/15 px-6 py-4 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_20px_rgba(6,182,212,0.05)] backdrop-blur-md">
              
              {/* Profile area */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div 
                  onClick={() => {
                    SoundCore.playTick();
                    setShowProfileDrawer(true);
                  }}
                  className="relative w-14 h-14 rounded-full p-0.5 border-2 border-cyan-500/30 hover:border-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer group shrink-0"
                >
                  <img 
                    src={userData.pfp} 
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition"
                    alt="Operator Avatar" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#04060b] animate-pulse"></span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-cyber text-lg font-black text-white tracking-wider uppercase leading-none">
                      {userData.name}
                    </h3>
                    <Crown className="w-4 h-4 text-[#ffd700] animate-bounce" style={{ animationDuration: "4s" }} />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 font-mono">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SEC_CLEARANCE:</span>
                    <span className="text-[10px] text-cyan-400 font-extrabold tracking-widest select-all uppercase">
                      {userData.userId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Central Header Specs Title */}
              <div className="hidden lg:block text-center flex-1 max-w-sm px-4">
                <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 font-cyber">
                  MKMODZ <span className="text-cyan-400">HUD</span>
                </h1>
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold mt-1">
                  SECURE CRYPTOGRAPHIC INJECTOR v2
                </p>
              </div>

              {/* Telemetry Clock, Audio and Hamburger Drawer Menu */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-900/40 pt-4 md:pt-0">
                
                {/* Real-time Clock */}
                <div className="flex items-center gap-1.5 bg-[#070b13]/85 border border-[#22d3ee]/10 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-widest text-cyan-400 shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-slate-500 animate-spin" style={{ animationDuration: "16s" }} />
                  <span>{terminalClock}</span>
                </div>

                {/* Database Connectivity Indicator */}
                <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${firebaseStatus === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-ping"}`}></span>
                  <span className="text-[9px] font-mono text-slate-400 font-black uppercase tracking-wider">
                    {firebaseStatus}
                  </span>
                </div>

                {/* Sound Controls */}
                <button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-400 text-cyan-400 flex items-center justify-center transition"
                  title={isMuted ? "Unmute Space Hum" : "Mute Space Hum"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Drawer Burger Trigger */}
                <button
                  onClick={() => {
                    SoundCore.playTick();
                    setShowSideDrawer(true);
                  }}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-[10px] font-black tracking-widest rounded-xl transition uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                >
                  <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                  <span>MENU</span>
                </button>
              </div>
            </header>

            {/* SLICED HUD METRICS STATUS BAR */}
            <div className="bg-gradient-to-r from-[#070b13] via-[#0b1424] to-[#070b13] border border-slate-800/60 px-5 py-3.5 rounded-2xl flex flex-wrap gap-x-8 gap-y-3 items-center justify-between shadow-md mb-8">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">RADAR OPERATORS:</span>
                <span className="text-[11px] font-mono font-black text-cyan-400">{onlineCount}</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_#8b5cf6]"></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">INJECTORS LOADED:</span>
                <span className="text-[11px] font-mono font-black text-indigo-400">{terminalFeatures.length}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">GATEWAY STATUS:</span>
                <span className="text-[11px] font-mono font-black text-emerald-400">STABLE CORE</span>
              </div>
            </div>

            {/* DUAL MAIN AREA (LEFT COL: SEARCH + FILTERS + GRID; RIGHT COL: PREVIEW PANEL) */}
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left col (grid and filters) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Search Parameter Section */}
                <div className="bg-[#070b13]/90 border border-[#22d3ee]/15 p-4 rounded-2xl flex flex-col gap-4 shadow-xl">
                  
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cyan-500/50" />
                    <input 
                      type="text" 
                      placeholder="Intercept and search telemetry mod injectors..."
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl py-3 pl-11 pr-10 text-xs font-mono tracking-wider text-cyan-300 outline-none transition uppercase"
                    />
                    {searchInput && (
                      <button 
                        onClick={() => {
                          setSearchInput("");
                          setTerminalSearchQuery("");
                          SoundCore.playTick();
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-slate-900 text-slate-500 hover:text-rose-400 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button 
                      onClick={() => {
                        setTerminalCategory("ALL");
                        SoundCore.playTick();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition shrink-0 ${
                        terminalCategory === "ALL" 
                          ? "bg-cyan-500 border border-cyan-400 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                          : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      ALL DEPLOYED INFRASTRUCTURE
                    </button>
                    {["Aim Mods", "Sensors", "Bypass", "Security"].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => {
                          setTerminalCategory(cat);
                          SoundCore.playTick();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition shrink-0 ${
                          terminalCategory === cat 
                            ? "bg-cyan-500 border border-cyan-400 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Grid List */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  {filteredTools.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-slate-950/40 border border-[#22d3ee]/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center min-h-[300px] shadow-[inset_0_0_20px_rgba(6,182,212,0.02)]">
                      <div className="w-14 h-14 rounded-full bg-rose-500/5 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-500/70 animate-pulse">
                        <ShieldAlert className="w-7 h-7" />
                      </div>
                      <h4 className="text-sm font-extrabold font-mono text-slate-300 uppercase tracking-widest">
                        NO DATA FOUND
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                        No active injectors or features matched your query "{terminalSearchQuery || searchInput}".
                      </p>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3 mt-6">
                        <button 
                          onClick={() => {
                            setSearchInput("");
                            setTerminalSearchQuery("");
                            SoundCore.playTick();
                          }} 
                          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Clear Search
                        </button>
                        <button 
                          onClick={() => {
                            SoundCore.playTick();
                            handleRestorePresets();
                          }} 
                          className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 rounded-xl text-[9px] font-mono font-black uppercase tracking-wider transition cursor-pointer"
                        >
                          Restore Presets
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredTools.map((item) => {
                      // Determine custom neon classes and colors based on category
                      let neonClass = "neon-card-cyan";
                      let btn1Class = "btn-cyan-3d";
                      let btn2Class = "btn-gold-3d";
                      
                      if (item.category === "Security") {
                        neonClass = "neon-card-gold";
                        btn1Class = "btn-gold-3d";
                        btn2Class = "btn-gold-3d";
                      } else if (item.category === "Aim Mods") {
                        neonClass = "neon-card-pink";
                        btn1Class = "btn-pink-3d";
                        btn2Class = "btn-gold-3d";
                      } else if (item.category === "Sensors") {
                        neonClass = "neon-card-green";
                        btn1Class = "btn-emerald-3d";
                        btn2Class = "btn-gold-3d";
                      }

                      return (
                        <div 
                          key={item.id}
                          onClick={() => {
                            SoundCore.playTick();
                            setSelectedTool(item);
                          }}
                          className={`${neonClass} group p-2.5 sm:p-4 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 ${
                            selectedTool?.id === item.id ? "scale-[1.02] ring-2 ring-cyan-500/50" : ""
                          }`}
                        >
                          {/* Image Frame */}
                          <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 mb-2 sm:mb-3.5 border border-slate-900 pointer-events-none">
                            <img 
                              src={item.img} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              alt={item.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop";
                              }}
                            />
                            {/* Shiny gloss overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                            
                            <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 text-[7px] sm:text-[8px] font-mono font-extrabold px-1 sm:px-1.5 py-0.5 rounded tracking-widest bg-emerald-500/90 text-slate-950 uppercase shadow-md">
                              {item.status || "ACTIVE"}
                            </span>
                            <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 text-[7px] sm:text-[8px] font-mono font-extrabold uppercase bg-slate-950/80 text-sky-400 border border-slate-800/60 px-1 sm:px-1.5 py-0.5 rounded tracking-widest shadow-md">
                              {item.category || "Mods"}
                            </span>
                          </div>

                          {/* Text and Actions */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-extrabold text-[10px] sm:text-xs tracking-wide text-slate-100 uppercase group-hover:text-cyan-400 transition-colors font-mono truncate">
                                {item.name}
                              </h4>
                              <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            
                            {/* Two Actions Row */}
                            <div className="mt-2.5 sm:mt-4 pt-2 border-t border-slate-900/40 flex gap-1.5">
                              <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundCore.playSuccessLaser();
                                }}
                                className={`flex-1 text-[7px] sm:text-[8.5px] font-mono font-black uppercase text-center py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-0.5 sm:gap-1 px-1 text-decoration-none shadow-md ${btn1Class}`}
                              >
                                <span>LAUNCH</span>
                                <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                              </a>
                              <a 
                                href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundCore.playBeep();
                                }}
                                className={`flex-1 text-[7px] sm:text-[8.5px] font-mono font-black uppercase text-center py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-0.5 sm:gap-1 px-1 text-decoration-none shadow-md ${btn2Class}`}
                              >
                                <span>VIP GROUP</span>
                                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </a>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>

              {/* Right col (Spec preview panel) */}
              <div className="lg:col-span-4 lg:sticky lg:top-6 flex flex-col gap-6">
                <div className="bg-[#070b13]/90 border border-[#22d3ee]/15 p-5 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-4">
                    <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="font-cyber text-xs font-black text-white tracking-widest uppercase">
                      INJECTOR DECRYPT_SPEC
                    </h3>
                  </div>

                  {selectedTool ? (
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900 relative">
                        <img 
                          src={selectedTool.img} 
                          className="w-full h-full object-cover" 
                          alt={selectedTool.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/25 rounded text-[8px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest">
                          {selectedTool.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-cyber text-sm font-black text-white uppercase tracking-wider">
                          {selectedTool.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {selectedTool.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-900 flex gap-2">
                        <a 
                          href={selectedTool.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => SoundCore.playSuccessLaser()}
                          className="flex-1 text-[10px] font-mono font-black uppercase text-center py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 px-2 text-decoration-none shadow-md btn-gold-3d"
                        >
                          <span>LAUNCH INJECTOR</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => SoundCore.playBeep()}
                          className="flex-1 text-[10px] font-mono font-black uppercase text-center py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 px-2 text-decoration-none shadow-md btn-cyan-3d"
                        >
                          <span>VIP GROUP</span>
                          <Users className="w-3.5 h-3.5" />
                        </a>
                      </div>

                    </div>
                  ) : (
                    <div className="py-16 text-center">
                      <Terminal className="w-10 h-10 text-slate-800 mx-auto mb-3 animate-pulse" />
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        AWAITING MODULE DIRECT SELECTION
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== BOTTOM FOOTER ==================== */}
      {!showSplash && isLoggedIn && (
        <footer className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative pb-10">
          <p>© 2026 MKMODZ CONSOLE. All real-time telemetry pipelines decrypted cleanly.</p>
          <div className="flex gap-4">
            <span className="text-cyan-500 font-bold">100% END-TO-END SECURE</span>
            <span className="text-slate-800">|</span>
            <span className="text-[#ffd700] font-bold">STABLE RECON ENGINE ACTIVE</span>
          </div>
        </footer>
      )}

      {/* ==================== MASTER BACKDROP OVERLAY ==================== */}
      <AnimatePresence>
        {(showSideDrawer || showProfileDrawer || showAdminDrawer) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowSideDrawer(false);
              setShowProfileDrawer(false);
              setShowAdminDrawer(false);
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* ==================== DRAWERS ==================== */}

      {/* 1. SIDE OPTIONS MENU DRAWER */}
      <AnimatePresence>
        {showSideDrawer && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-3 bottom-3 right-3 max-w-sm w-5/6 bg-[#090e17]/95 border border-[#22d3ee]/15 shadow-2xl z-[9999] p-6 flex flex-col justify-between backdrop-blur-2xl rounded-3xl overflow-y-auto scrollbar-none"
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-extrabold font-mono tracking-widest text-[#22D3EE] uppercase text-sm">CONSOLE LINK MENU</h2>
                </div>
                <button 
                  onClick={() => {
                    SoundCore.playTick();
                    setShowSideDrawer(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                
                <a 
                  href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => SoundCore.playTick()}
                  className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-[#10b981]/30 rounded-xl transition group text-decoration-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#10b981]/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-green-400">Follow WHATSAPP</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Official Bypass Channel</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
                </a>

                <a 
                  href="https://wa.me/+923327011312" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => SoundCore.playTick()}
                  className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-blue-500/30 rounded-xl transition group text-decoration-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#3b82f6]/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-blue-400">Contact Admin</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Bypass Assistance Desk</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
                </a>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    SoundCore.playTick();
                    setShowSideDrawer(false);
                    setShowProfileDrawer(true);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-indigo-500/30 rounded-xl cursor-pointer transition group text-left outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-550/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-indigo-400">Customize Profile</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Edit Name & Avatar</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition shrink-0" />
                </button>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAdminWithPasscode();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-cyan-500/30 rounded-xl cursor-pointer transition group text-left outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-cyan-400">Command Panel</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Bypass Telemetry Injector</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition shrink-0" />
                </button>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    SoundCore.playTick();
                    setShowSideDrawer(false);
                    setShowWelcomeBriefing(true);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-sky-500/30 rounded-xl cursor-pointer transition group text-left outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-sky-400">Welcome Briefing</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Core System Rules</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition shrink-0" />
                </button>

              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-rose-950/25 hover:bg-rose-950/45 border border-rose-900/40 hover:border-rose-500 text-rose-400 rounded-xl transition cursor-pointer font-mono font-bold tracking-widest text-xs uppercase"
            >
              <LogOut className="w-4 h-4" />
              <span>Deauthorize Session</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PROFILE CUSTOMIZER DRAWER */}
      <AnimatePresence>
        {showProfileDrawer && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-3 bottom-3 right-3 max-w-sm w-5/6 bg-[#090e17]/95 border border-[#22d3ee]/15 shadow-2xl z-[9999] p-6 flex flex-col justify-between backdrop-blur-2xl text-left rounded-3xl overflow-y-auto scrollbar-none"
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mb-6">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
                  <h2 className="font-extrabold font-mono tracking-widest text-[#22D3EE] uppercase text-sm">PROFILE MANAGER</h2>
                </div>
                <button 
                  onClick={() => {
                    SoundCore.playTick();
                    setShowProfileDrawer(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full border-2 border-indigo-500/40 p-1 mb-3 bg-slate-900 overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <img 
                      src={customBase64 || userData.pfp} 
                      className="w-full h-full object-cover rounded-full" 
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      SoundCore.playTick();
                      document.getElementById("pfp-file-picker")?.click();
                    }}
                    className="px-4 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg text-[9px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>UPLOAD AVATAR IMAGE</span>
                  </button>
                  <input 
                    type="file" 
                    id="pfp-file-picker" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={previewPfpFile}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-2 font-bold ml-1">
                    COMMUNICATION HANDLE (NAME)
                  </label>
                  <input 
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder={userData.name}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 text-slate-100 rounded-xl p-3.5 outline-none text-xs font-semibold transition font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={saveProfileData}
              className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold tracking-widest text-xs uppercase rounded-xl transition shadow-lg cursor-pointer font-mono"
            >
              COMMIT SYSTEM CHANGES
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ADMIN COMMAND DRAWER */}
      <AnimatePresence>
        {showAdminDrawer && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-3 bottom-3 right-3 max-w-sm w-5/6 bg-[#090e17]/95 border border-[#22d3ee]/15 shadow-2xl z-[9999] p-6 flex flex-col justify-between backdrop-blur-2xl text-left rounded-3xl overflow-y-auto scrollbar-none"
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mb-6">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#22d3ee]" />
                  <h2 className="font-extrabold font-mono tracking-widest text-[#22D3EE] uppercase text-sm">TELEMETRY INJECTOR</h2>
                </div>
                <button 
                  onClick={() => {
                    SoundCore.playTick();
                    setShowAdminDrawer(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Admin Panel Forms and Scrollers */}
              <div className="h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-5 scrollbar-none">
                
                <div className="bg-blue-950/15 border border-blue-900/30 rounded-xl p-3.5 text-[10px] text-blue-300 leading-relaxed font-mono">
                  <span className="font-black text-blue-400 uppercase tracking-widest block mb-1">COMMAND PROTOCOL</span>
                  Compile and load custom injector signatures dynamically directly onto the real-time HUD and synchronize database.
                </div>

                {/* Purge button */}
                <div className="bg-slate-900/30 border border-slate-800/70 rounded-xl p-4">
                  <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block mb-2 font-bold">DATABASE RE-AUTHORIZATION</span>
                  <button 
                    onClick={handleRestorePresets}
                    className="w-full py-3 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 text-rose-400 font-bold tracking-widest text-[9px] uppercase rounded-lg transition text-center cursor-pointer font-mono"
                  >
                    WIPE CUSTOM / RESTORE PRESETS
                  </button>
                </div>

                {/* List of currently loaded injectors with deletion option */}
                <div className="bg-slate-900/30 border border-slate-800/70 rounded-xl p-4">
                  <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block mb-2.5 font-bold border-b border-slate-800 pb-1.5 ml-1">
                    ACTIVE TELEMETRY INJECTORS
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {terminalFeatures.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-slate-950/90 border border-slate-900 rounded-lg gap-2 text-left">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-200 truncate uppercase tracking-widest font-mono">
                            {item.name}
                          </p>
                          <p className="text-[8px] text-slate-500 uppercase font-mono mt-0.5">
                            {item.category || "Bypass"}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteMod(item.id)}
                          className="w-7 h-7 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/30 hover:border-rose-500 text-rose-400 rounded flex items-center justify-center transition shrink-0 cursor-pointer" 
                          title="Delete injector"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compilation injection form */}
                <form onSubmit={handleDeployCustomMod} className="space-y-4">
                  <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block mb-1 font-bold border-b border-slate-800 pb-1.5 ml-1">
                    COMPILE NEW BYPASS PAYLOAD
                  </span>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                      Mod Brand/Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newToolName}
                      onChange={(e) => setNewToolName(e.target.value)}
                      placeholder="e.g. CapCut Pro Premium"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl px-3.5 py-3 text-xs font-mono text-cyan-300 outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                      Payload Launch URL *
                    </label>
                    <input 
                      type="url" 
                      required
                      value={newToolLink}
                      onChange={(e) => setNewToolLink(e.target.value)}
                      placeholder="https://whatsapp.com/channel/..."
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl px-3.5 py-3 text-xs font-mono text-cyan-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                      Mod Icon Image URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      value={newToolImg}
                      onChange={(e) => setNewToolImg(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl px-3.5 py-3 text-xs font-mono text-cyan-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                      Classification Category
                    </label>
                    <select 
                      value={newToolCat}
                      onChange={(e) => setNewToolCat(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl px-3.5 py-3 text-xs font-mono text-cyan-300 outline-none cursor-pointer"
                    >
                      <option value="Aim Mods">Aim Mods</option>
                      <option value="Sensors">Sensors</option>
                      <option value="Bypass">Bypass</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider block uppercase mb-1.5 ml-1">
                      Bypass Description
                    </label>
                    <textarea 
                      rows={2}
                      value={newToolDesc}
                      onChange={(e) => setNewToolDesc(e.target.value)}
                      placeholder="Input custom bypass descriptive guidelines..."
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl px-3.5 py-3 text-xs font-mono text-cyan-300 outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-xs tracking-widest rounded-xl transition shadow-lg cursor-pointer uppercase active:scale-95"
                  >
                    COMPILE & DEPLOY SIGNATURE
                  </button>
                </form>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODERN WELCOME BRIEFING DIALOG OVERLAY */}
      <AnimatePresence>
        {showWelcomeBriefing && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#070b13]/90 border border-[#22d3ee]/25 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-md overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 p-8 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Verified Badge Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-5 mb-5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-cyber text-sm font-black text-emerald-400 uppercase tracking-widest leading-none">
                      BYPASS GRANTED
                    </h2>
                    <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">
                      OPERATOR SPECIFICATIONS LOADED
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono self-end sm:self-center">
                  <span id="welc-clock" className="text-[9px] text-[#ffd700] font-extrabold bg-[#ffd700]/5 border border-[#ffd700]/15 px-2.5 py-1 rounded">
                    {terminalClock} UTC
                  </span>
                </div>
              </div>

              {/* Operator details block */}
              <div className="bg-[#04070d] border border-slate-900 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">OPERATOR IDENTITY:</span>
                  <span className="text-[11px] text-slate-200 font-black uppercase mt-1 block truncate">
                    {userData.name}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">CLEARANCE INTEGRITY:</span>
                  <span className="text-[11px] text-cyan-400 font-black uppercase mt-1 block">
                    SEC-LEVEL-MAX
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">SECTOR CODE:</span>
                  <span className="text-[11px] text-indigo-400 font-black uppercase mt-1 block">
                    {userData.userId}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">CONNECT STATUS:</span>
                  <span className="text-[11px] text-emerald-400 font-black uppercase mt-1 block">
                    ONLINE SECURED
                  </span>
                </div>
              </div>

              {/* System Guidelines */}
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 flex items-center justify-center text-[9px] font-mono font-black shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wide">ZERO LATENCY DECRYPT ENGINE</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                      All bypass injector systems operate under high-speed persistent caching. Updates synchronize instantly in the background.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 flex items-center justify-center text-[9px] font-mono font-black shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wide">WHATSAPP CYBER UPDATES</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                      Key signatures are rebuilt dynamically. Subscribe directly to the channel to get instantly updated bypass builds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <a 
                  href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => SoundCore.playTick()}
                  className="flex items-center justify-between p-3.5 bg-emerald-950/25 hover:bg-emerald-950/35 border border-emerald-900/40 hover:border-emerald-500/60 rounded-xl transition group text-decoration-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest block truncate">
                      JOIN WHATSAPP CHANNEL FOR UPDATES
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
                </a>

                <button 
                  onClick={() => {
                    SoundCore.playTick();
                    sessionStorage.setItem("stand_seenBriefing", "true");
                    setShowWelcomeBriefing(false);
                  }}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-500 to-indigo-650 hover:from-blue-600 hover:to-indigo-550 text-white font-bold tracking-widest text-xs uppercase py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer font-mono"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                    <span>AUTHORIZE & ENTER HUD</span>
                  </span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURITY ACCESS PASSCODE DIALOG */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999] overflow-y-auto">
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                SoundCore.playTick();
                setShowPasscodeModal(false);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#070b13]/95 border-2 border-[#22d3ee]/25 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(6,182,212,0.25)] relative z-10 text-center"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent"></div>
              
              {/* Header */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Key className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-cyber text-base font-black text-white tracking-widest uppercase">SECURE DECRYPT CONSOLE</h3>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">ADMIN SECURITY CLEARANCE REQUIRED</p>
              </div>

              {/* Passcode display box */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 mb-5 flex flex-col items-center justify-center relative shadow-inner">
                <div className="text-cyan-400 text-lg font-mono font-bold tracking-widest min-h-7 flex items-center">
                  {passcodeInput ? (
                    <span className="text-xl tracking-[0.2em]">{passcodeInput.replace(/./g, "•")}</span>
                  ) : (
                    <span className="text-slate-700 text-xs tracking-wider uppercase font-sans">ENTER PASSCODE</span>
                  )}
                </div>
              </div>

              {/* High-tech Numeric Pad Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      SoundCore.playTick();
                      if (passcodeInput.length < 16) {
                        setPasscodeInput(prev => prev + num);
                      }
                    }}
                    className="py-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-400 rounded-xl font-mono font-black text-sm tracking-wider transition active:scale-95 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Clear (CLR) */}
                <button
                  onClick={() => {
                    SoundCore.playBeep();
                    setPasscodeInput("");
                  }}
                  className="py-3 bg-rose-950/20 hover:bg-rose-950/45 border border-rose-900/45 hover:border-rose-500 text-rose-400 rounded-xl font-mono font-black text-xs tracking-wider transition active:scale-95 cursor-pointer"
                >
                  CLR
                </button>

                {/* 0 */}
                <button
                  onClick={() => {
                    SoundCore.playTick();
                    if (passcodeInput.length < 16) {
                      setPasscodeInput(prev => prev + "0");
                    }
                  }}
                  className="py-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-400 rounded-xl font-mono font-black text-sm tracking-wider transition active:scale-95 cursor-pointer"
                >
                  0
                </button>

                {/* Submit (OK) */}
                <button
                  onClick={() => {
                    const pin = passcodeInput;
                    if (pin === "3434" || pin === "admin123" || pin === "923327011312") {
                      SoundCore.playSuccessLaser();
                      setShowPasscodeModal(false);
                      setPasscodeInput("");
                      setShowAdminDrawer(true);
                      triggerToast("Admin authorization successful!", "success");
                    } else {
                      SoundCore.playBeep();
                      triggerToast("ACCESS DENIED: INVALID PASSCODE SIGNATURE", "error");
                      setPasscodeInput("");
                    }
                  }}
                  className="py-3 bg-cyan-950/20 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 rounded-xl font-mono font-black text-xs tracking-wider transition active:scale-95 cursor-pointer"
                >
                  OK
                </button>
              </div>

              {/* Standard text input option just in case they have physical keyboard */}
              <div className="mb-6 relative">
                <input 
                  type="password"
                  placeholder="Type passcode or key..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const pin = passcodeInput;
                      if (pin === "3434" || pin === "admin123" || pin === "923327011312") {
                        SoundCore.playSuccessLaser();
                        setShowPasscodeModal(false);
                        setPasscodeInput("");
                        setShowAdminDrawer(true);
                        triggerToast("Admin authorization successful!", "success");
                      } else {
                        SoundCore.playBeep();
                        triggerToast("ACCESS DENIED: INVALID PASSCODE SIGNATURE", "error");
                        setPasscodeInput("");
                      }
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-center text-xs font-mono tracking-widest text-cyan-300 outline-none transition"
                />
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => {
                  SoundCore.playTick();
                  setShowPasscodeModal(false);
                }}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-slate-200 font-mono text-[10px] font-black uppercase rounded-xl tracking-widest transition"
              >
                CANCEL SECURE CHANNEL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
