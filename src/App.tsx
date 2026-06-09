/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, FormEvent, ChangeEvent } from 'react';
import { 
  Terminal, Shield, Cpu, Activity, User, Users, Globe, 
  Search, Menu, X, LogOut, Key, Mail, Lock, Check,
  RefreshCw, Upload, Image as ImageIcon, Sparkles, 
  ExternalLink, HelpCircle, Wifi, Flame, Clock, Plus, 
  Trash2, ShieldAlert, WifiOff, CheckCircle, Info, ChevronRight, LockKeyhole,
  Settings
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  getDocFromServer,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { getDatabase, ref, onValue, set, onDisconnect } from 'firebase/database';

// ----------------------------------------------------
// FIREBASE ENGINE INITIALIZATION & RECOVERY GUARD
// ----------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyARU9qseUGZGnrogfMIOjCh03KdAP1wQE4",
  authDomain: "fevfd-4bc42.firebaseapp.com",
  projectId: "fevfd-4bc42",
  databaseURL: "https://fevfd-4bc42-default-rtdb.firebaseio.com",
  appId: "1:429119383291:web:7dda90ea363448287f325e"
};

let app;
let auth: any = null;
let db: any = null;
let rtdb: any = null;
let usingLocalSimulation = false;
let initErrorMessage = "";

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);
} catch (error) {
  console.warn("Firebase failed to initialize. Falling back to local offline simulation mode.", error);
  usingLocalSimulation = true;
  initErrorMessage = error instanceof Error ? error.message : String(error);
}

// Interface for MKMODZ premium features (tools)
interface ModFeature {
  id?: string;
  name: string;
  img: string;
  link: string;
  category?: string;
  releaseDate?: string;
  status?: "ACTIVE" | "MAINTENANCE" | "UPDATING";
  description?: string;
}

// Pre-seeded high quality feature packs for initial demo or local offline fallback
const DEFAULT_PRESET_FEATURES: ModFeature[] = [
  {
    id: "preset-1",
    name: "Aim Assist v4 Mod",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Aim Mods",
    releaseDate: "2026-06",
    status: "ACTIVE",
    description: "Enhanced aim guidance with smart target tracking vectors."
  },
  {
    id: "preset-2",
    name: "ESP Radar Overlay",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Sensors",
    releaseDate: "2026-06",
    status: "ACTIVE",
    description: "Thermal vision HUD showing active objects and distance tags."
  },
  {
    id: "preset-3",
    name: "BGMI No Recoil Patch",
    img: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Bypass",
    releaseDate: "2026-05",
    status: "UPDATING",
    description: "Stabilizes bullet trajectories perfectly. Safe module."
  },
  {
    id: "preset-4",
    name: "Antiban Safe Shield Pro",
    img: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Security",
    releaseDate: "2026-06",
    status: "ACTIVE",
    description: "Bypasses diagnostic queries. Zero trace logging."
  }
];

export default function App() {
  // --- STATE ENGINES ---
  const [bootLoaded, setBootLoaded] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  
  // User Profile States
  const [userData, setUserData] = useState({
    name: "MK-MODZ",
    userId: "MK-" + Math.floor(1000 + Math.random() * 9000),
    pfp: "https://ui-avatars.com/api/?name=MK&background=0D8ABC&color=fff",
    fcmToken: ""
  });
  
  // Dashboard & Navigation States
  const [features, setFeatures] = useState<ModFeature[]>(DEFAULT_PRESET_FEATURES);
  const [isInitializingScanner, setIsInitializingScanner] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);

  // Connection & Offline indicators
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);
  const [onlineUsersCount, setOnlineUsersCount] = useState(1);
  const [systemClock, setSystemClock] = useState("");

  // Form Inputs
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [regNameInput, setRegNameInput] = useState("");
  const [editName, setEditName] = useState("");
  const [base64pfp, setBase64pfp] = useState("");
  
  // Dynamic Admin adding tools
  const [newToolName, setNewToolName] = useState("");
  const [newToolLink, setNewToolLink] = useState("");
  const [newToolImg, setNewToolImg] = useState("");
  const [newToolCat, setNewToolCat] = useState("Aim Mods");

  // TOAST Feed
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Sound FX
  const clickSfxRef = useRef<HTMLAudioElement | null>(null);

  const playClickSfx = () => {
    if (clickSfxRef.current) {
      clickSfxRef.current.currentTime = 0;
      clickSfxRef.current.play().catch(() => {});
    }
  };

  // Trigger Toast Notification
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- BOOT CHRONOLOGY (Retro Cyber Logs) ---
  const BOOT_SIM_LOGS = useMemo(() => [
    "LOG: Initializing MKMODZ decryption protocol...",
    "SEC: Securing server-side Antigravity tunnel...",
    "NET: Probing Firestore cluster node (fevfd-4bc42)...",
    "RTDB: Establishing Realtime Database handshake...",
    "SYS: Overclocking terminal graphics matrix...",
    "SEC: Loading biometric bypass module...",
    "AUTH: Restoring credentials from encrypted client-vault...",
    "SYS: Optimizing tactical HUD responsive UI...",
    "SYS: BOOT SEQUENCE SUCCESSFUL. Launching interface..."
  ], []);

  // Update System clock every second (UTC/Local Dual format)
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      const formatTime = (d: Date) => {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      };
      setSystemClock(formatTime(now));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Handle internet connection changes
  useEffect(() => {
    const handleOnline = () => {
      setIsNetworkOnline(true);
      showNotification("NETWORK RESTORED - ONLINE STATUS ACTIVE", "success");
    };
    const handleOffline = () => {
      setIsNetworkOnline(false);
      showNotification("CONNECTION DISRUPTED - RUNNING IN INTEGRITY SAFE RECON_MODE", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Incremental Log Boot Simulation
  useEffect(() => {
    if (bootProgress < 100) {
      const progressTimer = setTimeout(() => {
        const increment = Math.floor(Math.random() * 8) + 4;
        setBootProgress(prev => Math.min(prev + increment, 100));

        // Periodically add line logs
        if (currentLogIndex < BOOT_SIM_LOGS.length) {
          setBootLog(prev => [...prev, BOOT_SIM_LOGS[currentLogIndex]]);
          setCurrentLogIndex(prev => prev + 1);
        }
      }, 110);
      return () => clearTimeout(progressTimer);
    } else {
      setTimeout(() => {
        setBootLoaded(true);
      }, 600);
    }
  }, [bootProgress, currentLogIndex, BOOT_SIM_LOGS]);

  // Auto-trigger professional welcome dialog on first active dashboard boot
  useEffect(() => {
    if (isLoggedIn && bootLoaded) {
      const hasSeen = sessionStorage.getItem('hasSeenWelcomeThisSession');
      if (!hasSeen) {
        setWelcomeDialogOpen(true);
      }
    }
  }, [isLoggedIn, bootLoaded]);

  // --- FIREBASE SUBSCRIBER FLOW ---
  useEffect(() => {
    if (usingLocalSimulation || !auth || !db) return;

    // Observe Authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user as FirebaseUser);
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);

        // 1. Fetch & Listen to Firestore User Document
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(prev => ({
              ...prev,
              name: data.name || "MK-USER",
              userId: data.userId || "MK-" + user.uid.substring(0, 4).toUpperCase(),
              pfp: data.pfp || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'MK')}&background=131b2e&color=3b82f6`
            }));
            setEditName(data.name || "");
          } else {
            // Seed base document if missing
            const initId = "MK-" + Math.floor(1000 + Math.random() * 9000);
            setDoc(userDocRef, {
              name: "MK-MODZ",
              userId: initId,
              pfp: ""
            }, { merge: true }).catch(err => console.error("Error creating user profile", err));
          }
        });

        // 2. Load & Sync Premium Mod Features
        setIsInitializingScanner(true);
        const featuresCol = collection(db, 'features');
        const unsubscribeFeatures = onSnapshot(featuresCol, (snapshot) => {
          const list: ModFeature[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as ModFeature);
          });
          if (list.length > 0) {
            setFeatures(list);
          } else {
            setFeatures(DEFAULT_PRESET_FEATURES);
          }
          setIsInitializingScanner(false);
        }, (error) => {
          console.error("Firestore loading features failed", error);
          setIsInitializingScanner(false);
          setFeatures(DEFAULT_PRESET_FEATURES);
        });

        // 3. Realtime Status Tracking (Online count)
        if (rtdb) {
          const statusRef = ref(rtdb, '/status/' + user.uid);
          const connectedRef = ref(rtdb, '.info/connected');

          onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
              // Set status on connection and configure removal on disconnect
              set(statusRef, true);
              onDisconnect(statusRef).remove();
            }
          });

          // Watch online status list
          const allStatusRef = ref(rtdb, '/status');
          onValue(allStatusRef, (snap) => {
            if (snap.exists()) {
              setOnlineUsersCount(Object.keys(snap.val()).length);
            } else {
              setOnlineUsersCount(1);
            }
          });
        }

        return () => {
          unsubscribeUser();
          unsubscribeFeatures();
        };

      } else {
        setAuthUser(null);
        localStorage.setItem('isLoggedIn', 'false');
        setIsLoggedIn(false);
        setFeatures(DEFAULT_PRESET_FEATURES);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [isLoggedIn]);

  // --- INTERACTION ACTIONS ---

  // Auth Toggle
  const toggleAuthMode = () => {
    playClickSfx();
    setIsSignUpMode(prev => !prev);
  };

  // Perform Authentication (Inbound / Sign up)
  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    playClickSfx();

    if (!emailInput || !passwordInput) {
      showNotification("Please enter both email and key-password payload.", "error");
      return;
    }

    if (usingLocalSimulation) {
      // Offline Simulated login
      showNotification("SIMULATION ACTIVE: Access granted.", "success");
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setUserData({
        name: regNameInput || "OFFLINE-OPERATOR",
        userId: "MK-OFF-" + Math.floor(1000 + Math.random() * 9000),
        pfp: "https://ui-avatars.com/api/?name=Offline&background=0F172A&color=00FF88",
        fcmToken: ""
      });
      return;
    }

    try {
      if (isSignUpMode) {
        showNotification("Registering cryptographic key...", "info");
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        
        // Save public identifiers to Firestore
        const userIdString = "MK-" + Math.floor(1000 + Math.random() * 9000);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: regNameInput || "Unnamed Hacker",
          userId: userIdString,
          pfp: "",
          email: emailInput
        });
        
        showNotification("Access Crypt-Key created! Accessing console...", "success");
        setIsSignUpMode(false);
      } else {
        showNotification("Verifying authorization token...", "info");
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
        showNotification("CREDENTIALS APPROVED. INITIATING HUD MASTER...", "success");
      }
    } catch (err: any) {
      console.error("Auth Failure", err);
      showNotification(err.message || "Failed authorization check.", "error");
    }
  };

  // Save profile modifications
  const handleSaveProfile = async () => {
    playClickSfx();
    const updatedName = editName.trim() || userData.name;
    const finalPfp = base64pfp || userData.pfp;

    if (usingLocalSimulation) {
      setUserData(prev => ({ ...prev, name: updatedName, pfp: finalPfp }));
      showNotification("LOCAL DIAGNOSTIC PROFILE RETUNED!", "success");
      setProfilePanelOpen(false);
      return;
    }

    try {
      showNotification("Writing back to secure database ledger...", "info");
      await setDoc(doc(db, 'users', auth.currentUser!.uid), {
        name: updatedName,
        pfp: finalPfp
      }, { merge: true });

      setUserData(prev => ({ ...prev, name: updatedName, pfp: finalPfp }));
      showNotification("CORE SECURE PROFILE OVERWRITTEN!", "success");
      setProfilePanelOpen(false);
    } catch (e: any) {
      showNotification("Firestore Error: " + (e.message || String(e)), "error");
    }
  };

  // Preview profile images and convert to compacted base64 format for safe DB storage
  const handlePfpImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setBase64pfp(compressedBase64);
          showNotification("COMPACT IMAGE COMPRESSION COMPLETED! READY TO COMMIT.", "info");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // Sign out interface
  const handleLogOut = async () => {
    playClickSfx();
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);

    if (usingLocalSimulation) {
      showNotification("DISCONNECTED SECURE LOCAL SESSION", "success");
      setSideMenuOpen(false);
      setProfilePanelOpen(false);
      setAdminPanelOpen(false);
      return;
    }

    try {
      // Clear RTDB session status
      if (rtdb && auth.currentUser) {
        await set(ref(rtdb, '/status/' + auth.currentUser.uid), null);
      }
      await signOut(auth);
      showNotification("SECURE TERMINAL TERMINATED. GOODBYE.", "success");
      setSideMenuOpen(false);
      setProfilePanelOpen(false);
      setAdminPanelOpen(false);
    } catch (err) {
      console.error(err);
      showNotification("Error executing log-off procedure", "error");
    }
  };

  // --- ADMINISTRATOR COMMANDS (Seeding sample data to user's real project) ---
  const handleSeedTestData = async () => {
    playClickSfx();
    if (usingLocalSimulation) {
      setFeatures(DEFAULT_PRESET_FEATURES);
      showNotification("RESET LOCAL CACHE TOOLS TO PROTOCOL FACTORIES", "success");
      return;
    }

    try {
      showNotification("Uploading standard features payload to Firestore...", "info");
      const colRef = collection(db, 'features');
      
      // Upload presets
      for (const item of DEFAULT_PRESET_FEATURES) {
        await addDoc(colRef, {
          name: item.name,
          img: item.img,
          link: item.link,
          category: item.category || "Tactical",
          releaseDate: item.releaseDate || "2026-06",
          status: item.status || "ACTIVE",
          description: item.description || "Injected module."
        });
      }
      showNotification("COMPLETED CORE INGESTION PROCESS!", "success");
    } catch (err: any) {
      showNotification("Ingestion crash: " + err.message, "error");
    }
  };

  // Admin: Custom added tool manually
  const handleAddCustomTool = async (e: FormEvent) => {
    e.preventDefault();
    playClickSfx();

    if (!newToolName || !newToolLink) {
      showNotification("Provide at least name and download target link", "error");
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop";
    const customPayload: ModFeature = {
      name: newToolName,
      img: newToolImg.trim() || defaultImg,
      link: newToolLink.trim(),
      category: newToolCat,
      releaseDate: new Date().toISOString().substring(0, 7),
      status: "ACTIVE",
      description: "Admin configured manual module."
    };

    if (usingLocalSimulation) {
      setFeatures(prev => [{ ...customPayload, id: "local-" + Date.now() }, ...prev]);
      showNotification("Added Mock Tool locally!", "success");
      setNewToolName("");
      setNewToolLink("");
      setNewToolImg("");
      return;
    }

    try {
      showNotification("Adding remote entry...", "info");
      await addDoc(collection(db, 'features'), customPayload);
      showNotification("CYBER MODULE BROADCAST SUCCESSFUL!", "success");
      setNewToolName("");
      setNewToolLink("");
      setNewToolImg("");
    } catch (err: any) {
      showNotification("Remote write error: " + err.message, "error");
    }
  };

  const handleDeleteTool = async (id: string) => {
    playClickSfx();
    if (usingLocalSimulation) {
      setFeatures(prev => prev.filter(f => f.id !== id));
      showNotification("Deleted local simulation item", "success");
      return;
    }

    try {
      showNotification("Dissolving file package...", "info");
      await deleteDoc(doc(db, 'features', id));
      showNotification("PACKAGE COMPLETELY DECOMMISSIONED!", "success");
    } catch (err: any) {
      showNotification("Decommission error: " + err.message, "error");
    }
  };

  // --- COMPUTED VIEW SELECTS ---
  const filteredFeatures = useMemo(() => {
    return features.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCat = selectedCategory === "ALL" || t.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [features, searchTerm, selectedCategory]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    features.forEach(f => {
      if (f.category) cats.add(f.category);
    });
    return Array.from(cats);
  }, [features]);

  // Handle closing all dialog panel backdrops
  const closeAllDrawers = () => {
    setSideMenuOpen(false);
    setProfilePanelOpen(false);
    setAdminPanelOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#070b13] text-slate-100 overflow-x-hidden select-none font-sans">
      {/* Dynamic Grid Overlay backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-35 z-0 pointer-events-none"></div>
      
      {/* Left/Right Cyber Glow Orbs */}
      <div className="absolute top-1/4 left-[-100px] w-96 h-96 rounded-full bg-blue-900/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-[-100px] w-96 h-96 rounded-full bg-red-900/10 blur-[120px] pointer-events-none z-0"></div>

      {/* CLICK AUDIO FEEDBACK */}
      <audio 
        ref={clickSfxRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" 
        preload="auto"
      />

      {/* GLOBAL TOAST NOTIFICATION MODULE */}
      <div 
        id="toast-hud" 
        className={`fixed top-6 right-6 z-[99999] max-w-sm w-full bg-slate-900/90 hover:bg-slate-900 border ${
          toast.type === 'success' ? 'border-emerald-500/80 shadow-emerald-500/10' :
          toast.type === 'error' ? 'border-rose-500/80 shadow-rose-500/10' : 'border-indigo-500/80 shadow-indigo-500/10'
        } backdrop-blur-md px-4 py-3 rounded-xl shadow-lg ring-1 ring-black/20 flex gap-3 items-start transition-all duration-300 transform ${
          toast.show ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="mt-0.5">
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase font-semibold text-slate-400">TELEMETRY DIAGNOSTICS</p>
          <p className="text-sm font-medium text-slate-100">{toast.message}</p>
        </div>
        <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-slate-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ----------------------------------------------------
          1. BOOT LOADER INTERACTIVE SEQUENCE
          ---------------------------------------------------- */}
      {!bootLoaded && (
        <div id="loading-screen" className="fixed inset-0 z-[99999] bg-[#05070c] flex flex-col justify-center items-center px-6">
          <div className="absolute inset-0 bg-[#090d16] bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15"></div>
          
          {/* Laser scanning bar effect on load screen */}
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-500/50 via-cyan-400 to-blue-500/50 shadow-[0_0_15px_#22d3ee] animate-laser-scan opacity-80 pointer-events-none"></div>

          {/* Logo Frame */}
          <div className="text-center z-10 max-w-lg w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[6px] font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 mb-1 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] select-none">
              MKMODZ
            </h1>
            <p className="font-mono text-xs text-blue-400/80 tracking-[4px] uppercase mb-8">SECURE PREMIUM TERMINAL</p>

            {/* Glowing Ring Gauge */}
            <div className="relative w-28 h-28 mx-auto mb-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  className="stroke-cyan-500 stroke-[5]" 
                  fill="transparent"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * bootProgress) / 100}
                  style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
                />
              </svg>
              <div id="load-percentage" className="absolute text-xl font-bold text-slate-200 tracking-wider font-mono">
                {bootProgress}%
              </div>
            </div>

            {/* Simulated Live Logging Window */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-8 font-mono text-left text-[11px] h-32 overflow-y-auto shadow-2xl flex flex-col gap-1 text-cyan-500/80">
              {bootLog.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-indigo-400 font-bold">[ {String(index).padStart(2, '0')} ]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="w-2 h-4 bg-cyan-400 animate-pulse mt-0.5" />
            </div>

            {/* Loading Bar Slider */}
            <div className="progress-wrapper w-full max-w-sm mx-auto p-1 bg-slate-950 rounded-full border border-slate-805/50 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <div className="progress-container w-full h-3.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="progress-bar h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-150"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>
            </div>
            
            <p className="mt-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              DECRYPTING SYSTEM MATRIX CORE ...
            </p>
          </div>
        </div>
      )}

      {/* BACKGROUND MASK DRAWER CLOSE CAPABILITY */}
      {(sideMenuOpen || profilePanelOpen || adminPanelOpen) && (
        <div 
          className="fixed inset-0 bg-[#04060c]/85 backdrop-blur-sm z-[9000] cursor-pointer"
          onClick={closeAllDrawers} 
        />
      )}

      {/* ----------------------------------------------------
          2. AUTHENTICATION MODULE
          ---------------------------------------------------- */}
      {!isLoggedIn && bootLoaded && (
        <div id="auth-container" className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/60 transition-all rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-cyber-glow">
            {/* Embedded laser scan inside container */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-blue-500 to-red-500 animate-laser-scan opacity-20 pointer-events-none"></div>

            <div className="text-center mb-8 relative">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-indigo-550/20 to-blue-600/10 border border-indigo-500/20 mb-3 text-cyan-400 animate-float-cyber">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold font-mono tracking-widest text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                {isSignUpMode ? "KEY GENERATOR" : "SECURE LOGIN"}
              </h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
                {isSignUpMode ? "CRUCIAL BOOTSTRAP INITIALIZATION" : "AUTHENTIFY SECURITY CREDENTIALS"}
              </p>
            </div>

            {/* Offline Simulation warning pill if configured or API isn't present */}
            {usingLocalSimulation && (
              <div className="mb-6 bg-amber-500/10 border border-amber-550/30 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
                <WifiOff className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold">INTEGRITY MODE ACTIVE:</span> Simulated DB credentials loaded. Press INITIATE to explore without remote latency.
                </div>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {isSignUpMode && (
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 ml-1">SYSTEM IDENTIFIER (NAME)</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={regNameInput}
                      onChange={(e) => setRegNameInput(e.target.value)}
                      placeholder="e.g. MK-OPERATOR" 
                      className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 ml-1">ENCRYPTED EMAIL ADDR</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="operator@mkmodz.com" 
                    className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 ml-1">SECURE ACCESS CRYT-KEY</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••••" 
                    className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold transition font-mono"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-500 to-indigo-650 hover:from-blue-600 hover:to-indigo-550 text-white font-bold tracking-widest text-xs uppercase py-4 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.5)] transition-all cursor-pointer font-mono"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <LockKeyhole className="w-3.5 h-3.5" />
                  {isSignUpMode ? "GENERATE SECURITY KEYS" : "INITIATE SECURE SYSTEM BOOT"}
                </span>
                <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p 
                className="text-slate-400 hover:text-cyan-400 text-xs font-semibold cursor-pointer transition font-mono uppercase tracking-wider" 
                onClick={toggleAuthMode}
              >
                {isSignUpMode ? (
                  <>ALREADY ACCESS INJECTED? <span className="text-cyan-400 hover:underline">AUTHORIZE ACCESS</span></>
                ) : (
                  <>LACKING CYBER PERMITS? <span className="text-cyan-400 hover:underline">INITIATE REGISTER</span></>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          3. MAIN TACTICAL DASHBOARD SCREEN
          ---------------------------------------------------- */}
      {isLoggedIn && bootLoaded && (
        <div id="main-dashboard" className="px-4 py-6 md:px-8 max-w-7xl mx-auto relative z-10">
          
          {/* HEADER GAUGE BAR */}
          <header className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 mb-6 shadow-2xl backdrop-blur-md sticky top-4 z-[5000]">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Pulsing Avatar trigger for profile */}
              <div className="relative group cursor-pointer" onClick={() => { playClickSfx(); setProfilePanelOpen(true); }}>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                  <img 
                    id="dash-pfp" 
                    src={userData.pfp} 
                    alt="User" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=020617&color=22D3EE`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-radar-green" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">SEC_OPERATOR:</span>
                  <span id="user-name" className="text-sm font-mono font-black text-rose-500 tracking-wider">
                    {userData.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#22D3EE] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span id="display-id">{userData.userId}</span>
                </div>
              </div>
            </div>

            {/* HIGH END DIAGNOSTICS & CONTROLS HUD */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* Dynamic Ticking HUD clock */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-[10px] font-mono flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300 font-bold tracking-widest">{systemClock || "00:00:00"}</span>
                <span className="text-slate-500">UTC</span>
              </div>

              {/* Secure Database type display */}
              <div className={`rounded-lg px-2.5 py-1.5 text-[10px] font-mono border flex items-center gap-1.5 ${
                usingLocalSimulation 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                {usingLocalSimulation ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="font-extrabold uppercase">
                  {usingLocalSimulation ? "INTEGRITY_SAFE" : "REMOTE_FIRESTORE"}
                </span>
              </div>

              {/* Options Toggle Menu trigger */}
              <button 
                onClick={() => { playClickSfx(); setSideMenuOpen(true); }}
                className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* DUAL STAT PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Live radar count tracker */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="flex-1">
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase mb-1">RADAR SECTOR ACTIVE PINGS</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black font-mono text-slate-100">{onlineUsersCount}</h3>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 px-1.5 bg-emerald-950/50 rounded uppercase tracking-wider animate-pulse">Live Connections</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-teal-500/10 text-emerald-400">
                <Users className="w-5 h-5 animate-text-blink" />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/40 to-teal-500/40"></div>
            </div>

            {/* Total Feature Packages */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="flex-1">
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase mb-1">CYBERNETIC MOD INJECTORS</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black font-mono text-slate-100">{features.length}</h3>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 px-1.5 bg-cyan-950/50 rounded uppercase tracking-wider">DEPLOYED ENGINES</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-blue-500/10 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/40 to-cyan-500/40"></div>
            </div>

            {/* Tactical Channel updates */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="flex-1">
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase mb-1">SYSTEM HARDENING STATE</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-black font-mono text-rose-400 tracking-wider">STABLE</h3>
                  <span className="text-[9px] font-mono font-bold text-rose-500 px-1.5 bg-rose-950/50 rounded uppercase tracking-wider">SECURE SHIELD</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-red-500/10 text-rose-450">
                <Activity className="w-5 h-5" />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500/40 to-pink-500/40"></div>
            </div>
          </div>

          {/* SEARCH GAUGE & SELECTOR SECTION */}
          <section className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 mb-6 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Glowing Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 focus-within:text-cyan-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Intercept and search telemetry mod injectors..." 
                  className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 focus:border-cyan-550/80 focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder:text-slate-500 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Creator Mode Quick Seeder / Launcher Button inside App */}
              <div className="flex gap-2">
                <button 
                  onClick={() => { playClickSfx(); setAdminPanelOpen(true); }}
                  className="px-4 py-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] font-mono tracking-widest uppercase font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-2 rounded-xl transition cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  COMMAND CONSOLE
                </button>
              </div>
            </div>

            {/* CATEGORY SELECTOR CHIPS */}
            {uniqueCategories.length > 0 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                <button
                  onClick={() => { playClickSfx(); setSelectedCategory("ALL"); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
                    selectedCategory === "ALL" 
                      ? 'bg-blue-600 border border-blue-500 shadow-lg text-white' 
                      : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-250'
                  }`}
                >
                  ALL DEPLOYED INFRASTRUCTURE
                </button>
                {uniqueCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => { playClickSfx(); setSelectedCategory(cat); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
                      selectedCategory === cat 
                        ? 'bg-blue-650 border border-blue-500 shadow-lg text-white' 
                        : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-250'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ----------------------------------------------------
              CORE TOOLS GRID LAYOUT (Bento High-Tech Cards)
              ---------------------------------------------------- */}
          {isInitializingScanner ? (
            <div className="tools-container grid grid-cols-2 md:grid-cols-4 gap-4" id="tools-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="premium-card bg-slate-950/60 border border-slate-900/80 rounded-2xl h-52 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#1e293b]/10"></div>
                  <div className="absolute top-0 left-0 w-full h-[6px] bg-cyan-500 shadow-lg animate-laser-scan opacity-60"></div>
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase animate-pulse">DECRYPTING PAYLOAD_ID...</span>
                </div>
              ))}
            </div>
          ) : filteredFeatures.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-3xl p-8 backdrop-blur-sm z-10 relative">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-float-cyber" />
              <h4 className="text-xl font-bold font-mono text-slate-400 select-none">ZERO TARGET CHANNELS MATCHED</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto uppercase tracking-wide font-mono">
                Your credentials filter returned no matching injection packages. Try editing the query or deploy new payloads below.
              </p>
              
              <div className="mt-6 flex justify-center gap-3">
                <button 
                  onClick={() => { setSearchTerm(""); setSelectedCategory("ALL"); }}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/70 hover:bg-slate-900 text-[10px] font-mono tracking-widest uppercase font-black text-slate-300 rounded-xl transition cursor-pointer"
                >
                  RESET HUD FILTER
                </button>
                <button 
                  onClick={handleSeedTestData}
                  className="px-4 py-2 bg-gradient-to-r from-blue-650 to-indigo-600 hover:from-blue-600 hover:to-indigo-550 text-[10px] font-mono tracking-widest uppercase font-black text-white rounded-xl transition shadow-lg cursor-pointer flex items-center gap-2 animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  SEED SAMPLE MOD PACKS
                </button>
              </div>
            </div>
          ) : (
            <div className="tools-container grid grid-cols-2 lg:grid-cols-4 gap-5" id="tools-grid">
              
              {filteredFeatures.map((t, index) => (
                <div 
                  key={t.id || index}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="premium-card group relative bg-gradient-to-b from-[#0f1524] to-[#04060b] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-300 transform md:hover:-translate-y-1.5"
                >
                  {/* Subtle Scan Overlay on Hover */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 shadow-md scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center z-10" />

                  {/* Thumbnail frame wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-900 pointer-events-none">
                    <img 
                      src={t.img} 
                      alt={t.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    
                    {/* Status badge Overlay */}
                    {t.status && (
                      <span className={`absolute top-2 left-2 text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded tracking-widest ${
                        t.status === 'ACTIVE' ? 'bg-emerald-500/90 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                        t.status === 'UPDATING' ? 'bg-amber-500/95 text-slate-950' : 'bg-rose-500/90 text-white'
                      }`}>
                        {t.status}
                      </span>
                    )}

                    {/* Category Label overlay */}
                    {t.category && (
                      <span className="absolute bottom-2 right-2 text-[7px] font-mono font-black uppercase bg-slate-950/80 tracking-widest border border-slate-800/60 px-1 py-0.5 rounded text-sky-400 pointer-events-none">
                        {t.category}
                      </span>
                    )}
                  </div>

                  {/* Info and action button */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs tracking-wide text-slate-100 uppercase group-hover:text-blue-400 transition-colors font-mono line-clamp-1">
                        {t.name}
                      </h4>
                      {t.description && (
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2 pt-2 border-t border-slate-900/60">
                      {/* Execute target link */}
                      <a 
                        href={t.link} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={playClickSfx}
                        className="flex-1 bg-slate-900 group-hover:bg-blue-650 hover:border-blue-400 group-hover:text-white border border-slate-800 text-slate-300 text-[10px] font-mono font-black uppercase text-center py-2.5 rounded-lg transition-all flex items-center justify-between px-3"
                      >
                        <span>LAUNCH</span>
                        <ExternalLink className="w-3 h-3 group-hover:scale-110" />
                      </a>

                      {/* Optional Deletion icon for creator debug convenience */}
                      {adminPanelOpen && (
                        <button 
                          onClick={() => handleDeleteTool(t.id || t.name)}
                          className="w-10 bg-slate-950/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/60 text-slate-500 hover:text-rose-400 rounded-lg flex items-center justify-center transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          4. RIGHT-SLIDE CONTEXT MENU (Drawer)
          ---------------------------------------------------- */}
      <div 
        id="side-menu" 
        className={`fixed top-0 bottom-0 max-w-sm w-5/6 bg-[#090e17]/95 border-l border-slate-800/80 shadow-2xl z-[10000] p-6 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 ${
          sideMenuOpen ? 'right-0' : '-right-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mb-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h2 className="font-extrabold font-mono tracking-widest text-[#22D3EE] uppercase text-sm">OPTIONS PANEL</h2>
            </div>
            <button 
              onClick={() => { playClickSfx(); setSideMenuOpen(false); }}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-rose-400 transition cursor-pointer text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Links stack */}
          <div className="space-y-3">
            <a 
              href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
              target="_blank" 
              rel="noreferrer"
              onClick={playClickSfx}
              className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-green-500/30 rounded-xl transition group text-decoration-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-555/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-green-400 transition">Follow CHANNEL</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-mono">WhatsApp Feed</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
            </a>

            <a 
              href="https://wa.me/+923327011312" 
              target="_blank" 
              rel="noreferrer"
              onClick={playClickSfx}
              className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-blue-500/30 rounded-xl transition group text-decoration-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-555/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-blue-400 transition">Support Center</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-mono">Contact Admin</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
            </a>

            {/* Profile trigger inside list */}
            <div 
              onClick={() => { playClickSfx(); setSideMenuOpen(false); setProfilePanelOpen(true); }}
              className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-indigo-500/30 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-indigo-555/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-indigo-400 transition">Adjust Blueprint Profile</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-mono">Manage Avatar</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
            </div>

            {/* Welcome Dialog briefing trigger inside list */}
            <div 
              onClick={() => { playClickSfx(); setSideMenuOpen(false); setWelcomeDialogOpen(true); }}
              className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-cyan-500/30 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-955/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-cyan-400 transition">Show Welcome Briefing</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-mono">System Instructions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* LOG OUT BUTTON */}
        <div>
          <button 
            onClick={handleLogOut}
            className="w-full flex items-center justify-center gap-2 p-4 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 hover:border-rose-500 text-rose-450 hover:text-rose-400 rounded-xl transition cursor-pointer font-mono font-bold tracking-widest text-xs uppercase"
          >
            <LogOut className="w-4 h-4" />
            Deauthorize Terminal
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          5. PROFILE EDITOR DRAWER
          ---------------------------------------------------- */}
      <div 
        id="profile-panel" 
        className={`fixed top-0 bottom-0 max-w-sm w-5/6 bg-[#090e17]/95 border-l border-slate-800/80 shadow-2xl z-[10000] p-6 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 ${
          profilePanelOpen ? 'right-0' : '-right-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="font-extrabold font-mono tracking-widest text-[#22D3EE] uppercase text-sm">AVATAR MOD CENTER</h2>
            </div>
            <button 
              onClick={() => { playClickSfx(); setProfilePanelOpen(false); }}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-rose-400 transition cursor-pointer text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6 pt-2">
            
            {/* Base64 Avatar previewer wrapper */}
            <div className="flex flex-col items-center">
              <div className="relative group overflow-hidden w-24 h-24 rounded-full border-2 border-indigo-500/50 p-1 mb-3 bg-slate-900">
                <img 
                  id="edit-preview" 
                  src={base64pfp || userData.pfp} 
                  alt="Edit" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=020617&color=22D3EE`;
                  }}
                />
              </div>

              {/* Upload trigger */}
              <button 
                onClick={() => { playClickSfx(); document.getElementById('pfp-input')?.click(); }}
                className="px-4 py-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] font-mono tracking-widest text-slate-400 hover:text-white uppercase flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Inbound image file
              </button>
              
              <input 
                type="file" 
                id="pfp-input" 
                className="hidden" 
                accept="image/*" 
                onChange={handlePfpImageUpload}
              />
            </div>

            {/* Form Name */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1.5 ml-1">COMMUNICATION HANDLE (Name)</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Change Name..." 
                className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl p-3.5 outline-none text-xs font-semibold transition font-mono"
              />
            </div>

          </div>
        </div>

        {/* SAVE MODULE CHANGES */}
        <div>
          <button 
            onClick={handleSaveProfile}
            className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-650 hover:from-blue-600 hover:to-indigo-550 text-white font-bold tracking-widest text-xs uppercase rounded-xl transition shadow-lg cursor-pointer font-mono"
          >
            COMMIT KEY MODIFICATION
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          6. CYBER COMMAND CONSOLE COLLAPSIBLE PANEL (Drawer)
          ---------------------------------------------------- */}
      <div 
        id="admin-panel" 
        className={`fixed top-0 bottom-0 max-w-sm w-5/6 bg-[#090e17]/98 border-l border-slate-800/80 shadow-2xl z-[10000] p-6 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 ${
          adminPanelOpen ? 'right-0' : '-right-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h2 className="font-extrabold font-mono tracking-widest text-[#22D3EE] uppercase text-sm">TELEMETRY INJECTOR CMD</h2>
            </div>
            <button 
              onClick={() => { playClickSfx(); setAdminPanelOpen(false); }}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-rose-400 transition cursor-pointer text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="scroll-area h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-5">
            
            <div className="bg-blue-950/15 border border-blue-900/40 rounded-xl p-3.5 text-[11px] text-blue-300 leading-relaxed font-mono">
              <span className="font-black text-blue-400 uppercase tracking-widest block mb-1">COMMAND PROTOCOLS</span>
              Use this admin bypass interface to write customized telemetry injectors immediately to your database core.
            </div>

            {/* Quick Seeder Button */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-2 font-bold">AUTOMATED SEED ENGINE</span>
              <button 
                onClick={handleSeedTestData}
                className="w-full py-3 bg-indigo-950/60 hover:bg-indigo-900/50 border border-indigo-800 text-indigo-400 hover:text-indigo-300 font-bold tracking-widest text-[10px] uppercase rounded-lg transition text-center cursor-pointer font-mono"
              >
                Incorporate Preset Features
              </button>
            </div>

            {/* Manual adding Form */}
            <form onSubmit={handleAddCustomTool} className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block font-bold border-b border-slate-900 pb-1.5 ml-1">WRITE MANUALLY</span>
              
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 ml-1">MOD NAME</label>
                <input 
                  type="text" 
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="e.g. Aimlock v5 Bypass" 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-lg p-3 outline-none text-xs font-semibold transition font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 ml-1">REDIRECT TARGET (LINK)</label>
                <input 
                  type="url" 
                  value={newToolLink}
                  onChange={(e) => setNewToolLink(e.target.value)}
                  placeholder="https://whatsapp.com/channel/..." 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-lg p-3 outline-none text-xs font-semibold transition font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 ml-1">IMAGE THUMBNAIL (URL)</label>
                <input 
                  type="url" 
                  value={newToolImg}
                  onChange={(e) => setNewToolImg(e.target.value)}
                  placeholder="Unsplash img url or empty for preset..." 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-lg p-3 outline-none text-xs font-semibold transition font-mono text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 ml-1">SYSTEM CLASSIFICATION</label>
                <select 
                  value={newToolCat}
                  onChange={(e) => setNewToolCat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-lg p-3 outline-none text-xs font-bold tracking-wide transition font-mono cursor-pointer"
                >
                  <option value="Aim Mods">Aim Mods</option>
                  <option value="Sensors">Sensors</option>
                  <option value="Bypass">Bypass</option>
                  <option value="Security">Security</option>
                  <option value="Mods">Mods</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#22D3EE] hover:bg-[#06B6D4] text-slate-950 font-black tracking-widest text-[10px] uppercase rounded-lg shadow-lg transition cursor-pointer font-mono"
              >
                Incorporate Injector Package
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          7. MODERN PROFESSIONAL WELCOME DIALOG
          ---------------------------------------------------- */}
      {welcomeDialogOpen && (
        <div id="welcome-dialog" className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop with extreme blur and smooth entry */}
          <div 
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl transition-opacity duration-500 animate-fade-in"
            onClick={() => {
              playClickSfx();
              sessionStorage.setItem('hasSeenWelcomeThisSession', 'true');
              setWelcomeDialogOpen(false);
            }}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0a0f1d] to-[#04060c] border-2 border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden transition-all duration-300 transform scale-100 animate-float-cyber">
            
            {/* Ambient Laser scan style banner inside welcome dialog */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 animate-laser-scan opacity-40 pointer-events-none"></div>
            
            {/* Top Close Button */}
            <button 
              onClick={() => {
                playClickSfx();
                sessionStorage.setItem('hasSeenWelcomeThisSession', 'true');
                setWelcomeDialogOpen(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-450 hover:border-slate-700 transition cursor-pointer"
              title="Close briefing"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title Block */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#22D3EE] mb-3 animate-pulse">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold font-mono tracking-widest text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.2)] uppercase">
                Console Access Approved
              </h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1">
                SYSTEM BRIEFING & USER DEPLOYMENT GUIDE
              </p>
            </div>

            {/* Operator Details Grid */}
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-4 mb-5 font-mono text-[11px] grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider">OPERATOR IDENTITY</span>
                <span className="text-rose-400 font-black tracking-wider block font-bold">{userData.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider">CLEARANCE STATUS</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                  PREMIUM OPERATOR
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider">SECTOR ASSIGNED</span>
                <span className="text-sky-300 font-bold block">{userData.userId}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider">CONNECT TIME</span>
                <span className="text-indigo-400 font-bold block">{systemClock || "ACTIVE"} UTC</span>
              </div>
            </div>

            {/* System Guideline protocols */}
            <div className="space-y-3 mb-6">
              <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-widest block ml-1">CONSOLE PROTOCOLS:</span>
              
              <div className="flex gap-3 items-start p-3 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition">
                <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 text-xs font-mono font-black">01</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wide">INTEGRITY-SAFE BYPASS ACTIVE</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">All mod tools employ anti-diagnostic shielding layers to operate undetected inside active game components.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition">
                <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 text-xs font-mono font-black">02</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wide">WHATSAPP CYBER UPDATES</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Key signatures rebuild every 48 hours. Follow the channel directly to immediately download latest build updates.</p>
                </div>
              </div>
            </div>

            {/* Direct Channel badge and actions */}
            <div className="flex flex-col gap-3">
              <a 
                href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
                target="_blank" 
                rel="noreferrer"
                onClick={playClickSfx}
                className="flex items-center justify-between p-3.5 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-900/40 hover:border-emerald-500/50 rounded-xl transition-all text-decoration-none group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono font-black text-emerald-400 uppercase tracking-widest block select-none">JOIN WHATSAPP CHANNEL FOR REBUILDS</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
              </a>

              {/* Authorize button */}
              <button 
                onClick={() => {
                  playClickSfx();
                  sessionStorage.setItem('hasSeenWelcomeThisSession', 'true');
                  setWelcomeDialogOpen(false);
                }}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-500 to-indigo-650 hover:from-blue-600 hover:to-indigo-550 text-white font-bold tracking-widest text-xs uppercase py-4 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.5)] transition duration-200 cursor-pointer font-mono"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  AUTHORIZE & ENTER HUD MAIN
                </span>
                <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
