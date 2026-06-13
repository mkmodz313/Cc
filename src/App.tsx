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
  Settings, Sun, Moon, Fingerprint, Compass, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
import SureshotCompanion from './components/SureshotCompanion';

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

// Pre-seeded templates for default MKMODZ mods on start
const DEFAULT_PRESET_FEATURES: ModFeature[] = [
  {
    id: "wingo-sureshot",
    name: "92PAK WINGO SURESHOT V6.0",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    link: "internal://wingo-sureshot",
    category: "AIM MODS",
    releaseDate: "2026-06",
    status: "ACTIVE",
    description: "Draggable floating overlay companion and predictive backtester for 1-Minute color/size lottery drawings."
  }
];

export default function App() {
  // --- STATE ENGINES ---
  const [isLightTheme, setIsLightTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('isLightTheme');
      return saved === null ? true : saved === 'true';
    } catch (e) {
      return true;
    }
  });

  // Always trigger the modern high-end splash screen on every browser load/refresh to satisfy user intent!
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
  const [features, setFeatures] = useState<ModFeature[]>(() => {
    try {
      const cached = localStorage.getItem('cached_features');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn("Error parsing local features cache:", e);
    }
    return DEFAULT_PRESET_FEATURES;
  });
  const [isInitializingScanner, setIsInitializingScanner] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_features');
      if (cached && JSON.parse(cached).length > 0) {
        return false;
      }
    } catch (e) {}
    return true;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "wingo-sureshot">("dashboard");

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

  const playClickSfx = (type: 'click' | 'success' | 'error' | 'scan' = 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        switch (type) {
          case 'click': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.06);
            break;
          }
          case 'success': {
            // Uplifting synthesizer sweep
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
            notes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.06);
              gain.gain.setValueAtTime(0.03, now + idx * 0.06);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.06);
              osc.stop(now + idx * 0.06 + 0.12);
            });
            break;
          }
          case 'error': {
            // Negative alarm buzzer sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.25);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.25);
            break;
          }
          case 'scan': {
            // Holographic sweep
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.45);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.45);
            break;
          }
        }
      }
    } catch (err) {
      console.warn("Synthesizer error", err);
    }

    try {
      if (clickSfxRef.current) {
        clickSfxRef.current.currentTime = 0;
        clickSfxRef.current.play().catch(() => {});
      }
    } catch (e) {}
  };

  // Switch between Dark and White theme on/off
  const toggleTheme = () => {
    try {
      playClickSfx('click');
      setIsLightTheme(prev => {
        const newVal = !prev;
        localStorage.setItem('isLightTheme', String(newVal));
        return newVal;
      });
      showNotification("HUD DISPLAY COGNITIVE THEME RE-POLARIZED", "info");
    } catch (err) {
      console.warn("Theme toggle error", err);
    }
  };

  // Trigger Toast Notification
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ show: true, message, type });
    if (type === 'success') {
      playClickSfx('success');
    } else if (type === 'error') {
      playClickSfx('error');
    } else {
      playClickSfx('click');
    }
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

  // Synchronize modified feature list state persistently in background
  useEffect(() => {
    if (features && features.length > 0) {
      localStorage.setItem('cached_features', JSON.stringify(features));
    }
  }, [features]);

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
        try {
          localStorage.setItem('hasBootedBefore', 'true');
        } catch (e) {}
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

  // Lock body scroll when welcome dialog or any drawer is open
  useEffect(() => {
    const isLocked = welcomeDialogOpen || sideMenuOpen || profilePanelOpen || adminPanelOpen;
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [welcomeDialogOpen, sideMenuOpen, profilePanelOpen, adminPanelOpen]);

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
        try {
          const cachedExist = localStorage.getItem('cached_features');
          if (!cachedExist || JSON.parse(cachedExist).length === 0) {
            setIsInitializingScanner(true);
          }
        } catch (e) {
          setIsInitializingScanner(true);
        }

        const featuresCol = collection(db, 'features');
        const unsubscribeFeatures = onSnapshot(featuresCol, (snapshot) => {
          const list: ModFeature[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as ModFeature);
          });
          if (list.length > 0) {
            setFeatures(list);
            localStorage.setItem('cached_features', JSON.stringify(list));
          } else {
            setFeatures(DEFAULT_PRESET_FEATURES);
            localStorage.setItem('cached_features', JSON.stringify(DEFAULT_PRESET_FEATURES));
          }
          setIsInitializingScanner(false);
        }, (error) => {
          console.error("Firestore loading features failed", error);
          setIsInitializingScanner(false);
          // Maintain cache so offline operability is fully resilient
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
    <div className={`relative select-none font-sans transition-colors duration-500 min-h-screen overflow-x-hidden pb-16 ${
      isLightTheme 
        ? 'bg-gradient-to-tr from-[#f3f4f6] via-[#f8fafc] to-[#e5e7eb] text-slate-800' 
        : 'bg-[#070b13] text-slate-100'
    }`}>
      {/* Dynamic Grid Overlay backdrop */}
      <div className={`fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] z-0 pointer-events-none transition-opacity duration-500 ${
        isLightTheme ? 'opacity-[0.06]' : 'opacity-35'
      }`}></div>
      
      {/* Left/Right Cyber Glow Orbs */}
      <div className={`fixed top-1/4 left-[-100px] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-500 ${
        isLightTheme ? 'bg-blue-300/10' : 'bg-blue-900/10'
      }`}></div>
      <div className={`fixed bottom-1/4 right-[-100px] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-500 ${
        isLightTheme ? 'bg-indigo-300/10' : 'bg-red-900/10'
      }`}></div>

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
      <AnimatePresence mode="wait">
        {!bootLoaded && (
          <motion.div 
            key="boot_loader_key"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(25px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            id="loading-screen" 
            className="fixed inset-0 z-[99999] bg-[#03050a] flex flex-col justify-center items-center px-4 overflow-hidden select-none"
          >
            {/* Cyber Grid Digital Flow Background with pulsating opacity */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none animate-pulse"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.25)_1px,transparent_1px)] [background-size:100px_100px] pointer-events-none"></div>

            {/* Glowing Tech Constellations & Subsystems */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[8%] left-[6%] w-24 h-24 rounded-full border border-teal-500/10 flex flex-col items-center justify-center p-1.5 font-mono text-[7px] text-teal-400 animate-float-cyber">
                <span className="text-[6px] text-slate-500 uppercase">SYS COORD</span>
                <span className="font-extrabold tracking-widest text-[#10b981]">CORE_GATE_v5</span>
                <span className="text-emerald-400 leading-none mt-1 animate-pulse">● STABLE</span>
              </div>
              
              <div className="absolute bottom-[22%] left-[5%] w-28 h-28 rounded-full border border-indigo-500/10 flex flex-col items-center justify-center p-1.5 font-mono text-[7px] text-indigo-400 animate-float-cyber" style={{ animationDelay: '1.5s' }}>
                <span className="text-[6px] text-slate-500 uppercase">PROXY ENGINE</span>
                <span className="font-black">MK-BYPASS-SSL</span>
                <span className="text-[#06b6d4] uppercase">RECON_MODE</span>
              </div>

              <div className="absolute top-[10%] right-[8%] w-26 h-26 rounded-full border border-pink-500/10 flex flex-col items-center justify-center p-1.5 font-mono text-[7px] text-pink-400 animate-float-cyber" style={{ animationDelay: '0.7s' }}>
                <span className="text-[6px] text-slate-500 uppercase">MATRIX ENCRYPT</span>
                <span className="font-bold text-pink-400">256-SHA FLOW</span>
                <span className="text-[#ec4899] font-semibold">BYPASS HUD</span>
              </div>

              <div className="absolute bottom-[12%] right-[6%] w-24 h-24 rounded-full border border-emerald-500/10 flex flex-col items-center justify-center p-1.5 font-mono text-[7px] text-emerald-400 animate-float-cyber" style={{ animationDelay: '2.2s' }}>
                <span className="text-[6px] text-slate-500 uppercase">LATENCY SENSOR</span>
                <span className="text-cyan-400">SYNC_SEC: 1.09s</span>
                <span className="text-slate-500 font-extrabold text-[5.5px]">PING [9ms]</span>
              </div>
            </div>
            
            {/* Real-time Cinematic Laser sweeping light sweep effect */}
            <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-transparent via-cyan-405 to-transparent shadow-[0_0_25px_#06b6d4] animate-laser-scan opacity-90 pointer-events-none"></div>

            {/* Main Center Console Box Layout */}
            <div className="text-center z-10 max-w-md w-full relative p-5 bg-slate-950/60 rounded-3xl border border-slate-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div className="inline-block px-3 py-1 mb-4 border border-[#06b6d4]/40 bg-[#06b6d4]/10 rounded-full text-[8.5px] font-mono font-black tracking-[4px] text-cyan-400 animate-pulse uppercase leading-none">
                DECRYPTION INTERRUPT ENABLED
              </div>

              {/* Glitching / Pulsing Cinematic App Logo */}
              <h1 className="text-5xl md:text-6xl font-black tracking-[12px] font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#3b82f6] text-center w-full mb-1 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)] select-none uppercase animate-pulse">
                MKMODZ
              </h1>
              <p className="font-mono text-[9px] md:text-xs text-blue-400/80 tracking-[6px] uppercase mb-6 text-center">SECURE PREMIUM TERMINAL</p>

              {/* Glowing High-Tech Nested Gyro Gauge with Integrated Biometric Scan bypass! */}
              <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                {/* Outermost Concentric Tech Ring 1 (Spinning Clockwise) */}
                <div className="absolute inset-0 rounded-full border border-dashed border-teal-500/20 animate-spin" style={{ animationDuration: '10s' }}></div>
                
                {/* Outermost Concentric Tech Ring 2 (Spinning Counter-Clockwise) */}
                <div className="absolute inset-1.5 rounded-full border border-dotted border-cyan-400/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>

                {/* Concentric tech ticks decor */}
                <div className="absolute inset-3 rounded-full border border-[#06b6d4]/15 animate-pulse"></div>

                {/* Inner Compass ring frame */}
                <div className="absolute inset-4.5 rounded-full border border-slate-800/80 flex items-center justify-center bg-slate-950/80 shadow-[inset_0_2px_15px_rgba(0,0,0,0.9)]">
                  <div className="absolute inset-0.5 rounded-full bg-[#05070c] flex flex-col items-center justify-center">
                    
                    {/* Embedded Interactive Biometric fingerprint scan area */}
                    <button 
                      onClick={() => {
                        // Instant 0s Bypass Trigger
                        try {
                          playClickSfx('success');
                          setBootProgress(100);
                          setBootLog(prev => [...prev, "SEC: BYPASS CODE RECEIVED. AUTHORIZATION ACTIVE IN 0SEC", "SYS: Boot override requested. Authenticating profile..."]);
                          setTimeout(() => {
                            setBootLoaded(true);
                            localStorage.setItem('hasBootedBefore', 'true');
                          }, 50);
                        } catch (e) {
                          setBootLoaded(true);
                        }
                      }}
                      className="group relative w-14 h-14 rounded-full bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-center transition-all duration-150 hover:scale-[1.04] active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] cursor-pointer"
                      title="Fingerprint Instant Bypass to 0 Seconds"
                    >
                      {/* Interactive Radar sweeping circle */}
                      <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-60"></span>
                      
                      {/* Custom Cyan scanner glow laser */}
                      <div className="absolute inset-x-2 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-bounce"></div>
                      
                      <Fingerprint className="w-7 h-7 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
                    </button>
                    
                    <span className="text-[6.5px] font-mono tracking-widest text-[#06b6d4] font-black uppercase mt-0.5 animate-pulse">BYPASS CORE</span>
                  </div>
                </div>

                <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="58" 
                    className="stroke-[#06b6d4] stroke-[4] drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" 
                    fill="transparent"
                    strokeDasharray="364"
                    strokeDashoffset={364 - (364 * bootProgress) / 100}
                    style={{ transition: 'stroke-dashoffset 0.08s ease-out' }}
                  />
                </svg>

                {/* Live load percentage floating tag */}
                <div className="absolute bottom-[-10px] bg-slate-950 border border-cyan-500/40 rounded px-1.5 py-0.5 text-[8px] font-bold text-cyan-400 tracking-widest font-mono shadow-[0_0_10px_rgba(6,182,212,0.35)]">
                  {bootProgress}% Loaded
                </div>
              </div>

              {/* Instructions regarding Bypass Fingerprint scanner */}
              <p className="text-[9.5px] text-slate-450 mb-4 font-mono leading-none tracking-wide text-center">
                🔥 <span className="text-cyan-400 font-black underline cursor-pointer hover:text-cyan-300 transition-all" onClick={() => {
                  playClickSfx('success');
                  setBootProgress(100);
                  setBootLoaded(true);
                  localStorage.setItem('hasBootedBefore', 'true');
                }}>TOUCH BIOMETRIC SENSOR</span> TO BYPASS DECRYPT SEQUENCE
              </p>

              {/* High-Performance simulated terminal trace */}
              <div className="bg-[#03060c]/98 border border-slate-800/80 rounded-xl p-3 mb-4 font-mono text-left text-[10px] h-28 overflow-y-auto shadow-2xl flex flex-col gap-0.5 text-cyan-400/80 scrollbar-thin">
                {bootLog.map((log, index) => (
                  <div key={index} className="flex gap-1.5 leading-snug">
                    <span className="text-[#10b981] font-black shrink-0">➜</span>
                    <span className="text-slate-500 font-bold shrink-0">[LINE_{index + 1}]</span>
                    <span className="text-cyan-400/90 whitespace-nowrap overflow-hidden text-ellipsis">{log}</span>
                  </div>
                ))}
                <div className="w-1.5 h-3 bg-cyan-400 animate-pulse mt-0.5" />
              </div>

              {/* Loading Bar Slider with Dual Speed controller */}
              <div className="w-full max-w-sm mx-auto p-1 bg-slate-950 rounded-full border border-slate-800/90 shadow-[0_0_15px_rgba(0,0,0,0.6)]">
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.85)] transition-all duration-100"
                    style={{ width: `${bootProgress}%` }}
                  />
                  {/* Glossy sweeping shine across loading loader */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent trans-skew animate-[pulse_1.5s_infinite] pointer-events-none"></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3.5 max-w-sm mx-auto px-1">
                <span className="text-[7.5px] text-slate-500 font-mono tracking-widest uppercase">
                  DECRYPTION SYSTEM SEC_BYPASS...
                </span>
                <button 
                  onClick={() => {
                    playClickSfx('click');
                    // Boost transition rate
                    setBootProgress(100);
                  }}
                  className="bg-indigo-950/80 hover:bg-slate-900 border border-indigo-500/40 rounded px-2 py-0.5 text-[7px] text-[#06b6d4] hover:text-white font-mono uppercase tracking-widest transition cursor-pointer font-black shadow-[0_0_8px_rgba(6,182,212,0.1)] hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
                >
                  ⚡ Boost Load Sequence
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <AnimatePresence>
        {!isLoggedIn && bootLoaded && (
          <motion.div 
            key="auth_screen_key"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30, filter: "blur(12px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            id="auth-container" 
            className="min-h-screen flex items-center justify-center p-4 relative z-10"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          3. MAIN TACTICAL DASHBOARD SCREEN
          ---------------------------------------------------- */}
      {isLoggedIn && bootLoaded && (
        <div id="main-dashboard" className="px-3 pb-12 pt-3 md:px-8 max-w-7xl mx-auto relative z-10 flex flex-col w-full gap-2.5">
          
          {/* Cybernetic Telemetry bar right from user screenshot */}
          <div className="w-full flex items-center justify-between px-3 py-1.5 select-none font-mono text-[9px] md:text-[10px] tracking-widest text-[#22d3ee] bg-[#05070c]/50 rounded-xl border border-slate-900/60 leading-none">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase">UTC:</span>
              <span className="font-extrabold text-[#4ade80]">[{systemClock || "00:00:00"} timestamp]</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-550 uppercase">NETWORK:</span>
              <span className="text-emerald-400 font-extrabold">[{usingLocalSimulation ? 'INTEGRITY_SAFE' : 'Remote_Firestore/Active'}]</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-500">SYS_HUD:</span>
              <span className="text-[#00ff41] font-extrabold">[CONNECTED/V6]</span>
            </div>
          </div>

          {/* HEADER GAUGE BAR */}
          <header className={`flex flex-col md:flex-row gap-3 justify-between items-center border rounded-2xl p-3 mb-2 shadow-lg z-[5000] transition-colors duration-300 ${
            isLightTheme 
              ? 'bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-slate-800' 
              : 'bg-[#0b101d] border-slate-800/80 shadow-lg'
          }`}>
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Pulsing Avatar trigger for profile */}
              <div className="relative group cursor-pointer" onClick={() => { playClickSfx(); setProfilePanelOpen(true); }}>
                <div className={`w-12 h-12 rounded-full overflow-hidden border shadow-inner ${isLightTheme ? 'border-slate-200' : 'border-slate-700'}`}>
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
                  <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">SYS_OPERATOR:</span>
                  <span id="user-name" className="text-sm font-mono font-black text-rose-500 tracking-wider">
                    {userData.name}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-mono font-extrabold ${isLightTheme ? 'text-indigo-600' : 'text-[#22D3EE]'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span id="display-id">{userData.userId}</span>
                </div>
              </div>
            </div>

            {/* HIGH END DIAGNOSTICS & CONTROLS HUD */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* Theme Selector On/Off Switch */}
              <button 
                onClick={toggleTheme}
                title={isLightTheme ? "Switch to Secure Dark Mode" : "Switch to Modern Light Mode"}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl transition cursor-pointer ${
                  isLightTheme 
                    ? 'bg-white border-slate-200 text-amber-500 hover:bg-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]' 
                    : 'bg-slate-900 border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-400'
                }`}
              >
                {isLightTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Dynamic Ticking HUD clock */}
              <div className={`border rounded-lg px-3 py-1.5 text-[10px] font-mono flex items-center gap-2 ${
                isLightTheme ? 'bg-slate-100/80 border-slate-200 text-indigo-600' : 'bg-slate-900/60 border-slate-800/80 text-indigo-300'
              }`}>
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold tracking-widest">{systemClock || "00:00:00"}</span>
                <span className="text-slate-500">UTC</span>
              </div>

              {/* Secure Database type display */}
              <div className={`rounded-lg px-2.5 py-1.5 text-[10px] font-mono border flex items-center gap-1.5 ${
                usingLocalSimulation 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
              }`}>
                {usingLocalSimulation ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                <span className="font-extrabold uppercase">
                  {usingLocalSimulation ? "INTEGRITY_SAFE" : "REMOTE_FIRESTORE"}
                </span>
              </div>

              {/* Options Toggle Menu trigger */}
              <button 
                onClick={() => { playClickSfx(); setSideMenuOpen(true); }}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl transition cursor-pointer ${
                  isLightTheme 
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' 
                    : 'bg-slate-900 border-slate-800 hover:border-cyan-500 hover:text-cyan-400'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* TIGHT STREAMLINED STATS BAR */}
          <div className={`grid grid-cols-3 gap-3 mb-3 rounded-xl border p-2 transition-all duration-350 z-10 relative ${
            isLightTheme 
              ? 'bg-white/80 border-slate-200/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)]' 
              : 'bg-slate-950/60 border-slate-800/50 shadow-[0_4px_25px_rgba(0,0,0,0.4)]'
          }`}>
            {/* Stat 1: Live connection */}
            <div className={`flex items-center gap-2 px-1 justify-center py-1.5 border-r ${isLightTheme ? 'border-slate-100' : 'border-slate-800/40'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isLightTheme ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-slate-900 border-teal-500/10 text-emerald-400'
              }`}>
                <Users className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[8px] md:text-[9.5px] font-mono text-slate-500 block uppercase tracking-wider font-extrabold leading-none">ACTIVE PINGS</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-sm md:text-base font-black font-mono leading-none ${isLightTheme ? 'text-slate-800' : 'text-slate-100'}`}>{onlineUsersCount}</span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 2: Total Deployed */}
            <div className={`flex items-center gap-2 px-1 justify-center py-1.5 border-r ${isLightTheme ? 'border-slate-100' : 'border-slate-800/40'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isLightTheme ? 'bg-sky-500/10 border-sky-500/20 text-sky-600' : 'bg-slate-900 border-blue-555/10 text-cyan-400'
              }`}>
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[8px] md:text-[9.5px] font-mono text-slate-500 block uppercase tracking-wider font-extrabold leading-none">DEPLOYED MODS</span>
                <span className={`text-sm md:text-base font-black font-mono leading-none mt-0.5 block ${isLightTheme ? 'text-slate-800' : 'text-slate-100'}`}>{features.length}</span>
              </div>
            </div>

            {/* Stat 3: Hardening state */}
            <div className="flex items-center gap-2 px-1 justify-center py-1.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isLightTheme ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' : 'bg-slate-900 border-red-555/10 text-rose-450'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[8px] md:text-[9.5px] font-mono text-slate-500 block uppercase tracking-wider font-extrabold leading-none">HARDENING</span>
                <span className="text-[10px] md:text-sm font-black font-mono tracking-widest text-[#22D3EE] dark:text-rose-400 block leading-none mt-0.5 uppercase">STABLE</span>
              </div>
            </div>
          </div>

          {/* SEARCH GAUGE OR WINGO PLAYING STUDIO */}
          {activeView === "wingo-sureshot" ? (
            <div className="flex flex-col gap-3 relative z-10 w-full">
              <div className={`flex justify-between items-center border rounded-xl p-3 shadow-md backdrop-blur-md ${
                isLightTheme 
                  ? "bg-slate-50/95 border-slate-205 text-slate-800"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-100"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] md:text-xs font-mono font-black text-[#4ADE80] uppercase tracking-widest">
                    ACTIVE TELEMETRY STREAM: 92PAK COMPANION HUD
                  </span>
                </div>
                <button
                  onClick={() => { playClickSfx('scan'); setActiveView("dashboard"); }}
                  className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-750 text-[10px] font-mono font-black uppercase tracking-wider text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer transform active:translate-y-0.5"
                >
                  ← RETURN TO MODS CATALOG
                </button>
              </div>
              <SureshotCompanion 
                isLightTheme={isLightTheme} 
                userData={userData} 
                showNotification={showNotification} 
                playSfx={playClickSfx} 
              />
            </div>
          ) : (
            <>
              {/* SEARCH GAUGE & SELECTOR SECTION */}
              <section className={`border rounded-xl p-2.5 mb-2.5 shadow-md ${
                isLightTheme 
                  ? 'bg-white border-slate-200/90 shadow-[0_4px_15px_rgba(0,0,0,0.02)]' 
                  : 'bg-[#0b101c] border-slate-800/60 shadow-md'
              }`}>
                <div className="flex flex-col md:flex-row gap-3">
                  
                  {/* Glowing Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 focus-within:text-cyan-400" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Intercept and search telemetry mod injectors..." 
                      className={`w-full border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition ${
                        isLightTheme 
                          ? 'bg-slate-50 hover:bg-slate-100/50 border-slate-200 focus:border-blue-505 text-slate-800 placeholder:text-slate-400' 
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 focus:border-cyan-500 text-slate-200 placeholder:text-slate-500'
                      }`}
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
                </div>

                {/* CATEGORY SELECTOR CHIPS */}
                {uniqueCategories.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                    <button
                      onClick={() => { playClickSfx(); setSelectedCategory("ALL"); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
                        selectedCategory === "ALL" 
                          ? 'bg-blue-600 border border-blue-500 shadow-lg text-white' 
                          : isLightTheme
                            ? 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-800'
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
                            : isLightTheme
                              ? 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-800'
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
              <div className={`rounded-2xl border transition-colors duration-300 z-10 relative flex flex-col ${
                isLightTheme 
                  ? 'bg-white border-slate-200/80 shadow-sm' 
                  : 'bg-[#0b101c] border-slate-900/60 shadow-lg'
              }`}>
                <div className={`flex items-center justify-between p-2 md:p-3.5 border-b ${isLightTheme ? 'border-slate-200/50' : 'border-slate-800/40'}`}>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-widest block ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                    DECRYPTED TARGET CHANNELS ({filteredFeatures.length})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[8px] font-mono text-slate-500 font-extrabold uppercase">LIVE SYNCHRONIZATION</span>
                  </div>
                </div>
                
                <div className="w-full p-2 md:p-4" id="inner-features-scroll">
                  {isInitializingScanner ? (
                    <div className="tools-container grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4" id="tools-grid">
                      {[...Array(6)].map((_, index) => (
                        <div key={index} className="premium-card bg-slate-950/60 border border-slate-900/80 rounded-2xl h-[160px] md:h-[200px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#1e293b]/10"></div>
                          <div className="absolute top-0 left-0 w-full h-[4px] bg-cyan-500 shadow-lg animate-laser-scan opacity-60"></div>
                          <RefreshCw className="w-5.5 h-5.5 text-cyan-400 animate-spin mb-2" />
                          <span className="text-[8px] font-mono text-cyan-400 tracking-wider uppercase animate-pulse text-center">DECRYPTING...</span>
                        </div>
                      ))}
                    </div>
                  ) : filteredFeatures.length === 0 ? (
                    <div className="text-center py-12 z-10 relative">
                      <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto mb-3 animate-float-cyber" />
                      <h4 className="text-base font-bold font-mono text-slate-400 select-none">ZERO TARGET CHANNELS MATCHED</h4>
                      <p className="text-[11px] text-slate-500 mt-2 max-w-sm mx-auto uppercase tracking-wide font-mono">
                        Your credentials filter returned no matching injection packages. Try editing the query or deploy new payloads below.
                      </p>
                      
                      <div className="mt-5 flex justify-center gap-3">
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
                    <div 
                      className="tools-container grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-4 pb-2 transform-gpu translate-z-0 backface-hidden will-change-transform" 
                      id="tools-grid"
                    >
                      {filteredFeatures.map((t, index) => {
                        // Unique neon theme colors with professional 3D block shadows
                        const themeConfigs = [
                          {
                            border: 'border-[#10b981]/70 hover:border-[#10b981] shadow-[3px_3px_0px_0px_#020617,4px_4px_0px_0px_rgba(16,185,129,0.35)] hover:shadow-[3px_3px_0px_0px_#020617,6px_6px_0px_0px_rgba(16,185,129,0.65)]',
                            imgBorder: 'border-[#10b981]/20',
                            textColor: 'text-[#10b981]',
                            btnBorder: 'border-[#10b981]/80 hover:bg-[#10b981]/10',
                            btnText: 'text-[#10b981] hover:text-[#4ade80]',
                            badgeStyle: 'bg-[#10b981] text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
                          },
                          {
                            border: 'border-[#06b6d4]/70 hover:border-[#06b6d4] shadow-[3px_3px_0px_0px_#020617,4px_4px_0px_0px_rgba(6,182,212,0.35)] hover:shadow-[3px_3px_0px_0px_#020617,6px_6px_0px_0px_rgba(6,182,212,0.65)]',
                            imgBorder: 'border-[#06b6d4]/20',
                            textColor: 'text-[#06b6d4]',
                            btnBorder: 'border-[#06b6d4]/80 hover:bg-[#06b6d4]/10',
                            btnText: 'text-[#06b6d4] hover:text-[#22d3ee]',
                            badgeStyle: 'bg-[#06b6d4] text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.3)]',
                          },
                          {
                            border: 'border-[#ec4899]/70 hover:border-[#ec4899] shadow-[3px_3px_0px_0px_#020617,4px_4px_0px_0px_rgba(236,72,153,0.35)] hover:shadow-[3px_3px_0px_0px_#020617,6px_6px_0px_0px_rgba(236,72,153,0.65)]',
                            imgBorder: 'border-[#ec4899]/20',
                            textColor: 'text-[#ec4899]',
                            btnBorder: 'border-[#ec4899]/80 hover:bg-[#ec4899]/10',
                            btnText: 'text-[#ec4899] hover:text-[#f472b6]',
                            badgeStyle: 'bg-[#ec4899] text-white shadow-[0_0_8px_rgba(236,72,153,0.3)]',
                          },
                          {
                            border: 'border-[#3b82f6]/70 hover:border-[#3b82f6] shadow-[3px_3px_0px_0px_#020617,4px_4px_0px_0px_rgba(59,130,246,0.35)] hover:shadow-[3px_3px_0px_0px_#020617,6px_6px_0px_0px_rgba(59,130,246,0.65)]',
                            imgBorder: 'border-[#3b82f6]/20',
                            textColor: 'text-[#3b82f6]',
                            btnBorder: 'border-[#3b82f6]/80 hover:bg-[#3b82f6]/10',
                            btnText: 'text-[#3b82f6] hover:text-[#60a5fa]',
                            badgeStyle: 'bg-[#3b82f6] text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]',
                          },
                          {
                            border: 'border-[#eab308]/70 hover:border-[#eab308] shadow-[3px_3px_0px_0px_#020617,4px_4px_0px_0px_rgba(234,179,8,0.35)] hover:shadow-[3px_3px_0px_0px_#020617,6px_6px_0px_0px_rgba(234,179,8,0.65)]',
                            imgBorder: 'border-[#eab308]/20',
                            textColor: 'text-[#eab308]',
                            btnBorder: 'border-[#eab308]/80 hover:bg-[#eab308]/10',
                            btnText: 'text-[#eab308] hover:text-[#facc15]',
                            badgeStyle: 'bg-[#eab308] text-slate-950 shadow-[0_0_8px_rgba(234,179,8,0.3)]',
                          }
                        ];
                        const cfg = themeConfigs[index % themeConfigs.length];

                        return (
                          <div 
                            key={t.id || index}
                            className={`premium-card group relative rounded-2xl p-1.5 xs:p-2 sm:p-2.5 flex flex-col justify-start select-none h-auto transition-all duration-155 border-2 hover:-translate-y-1 hover:-translate-x-0.5 ${
                              isLightTheme 
                                ? 'bg-white border-slate-800 shadow-[3px_3px_0px_0px_rgba(30,41,59,0.9)] hover:shadow-[5px_5px_0px_0px_rgba(30,41,59,1)] hover:border-blue-600' 
                                : `bg-[#0b101c] hover:bg-[#0f172a] ${cfg.border}`
                            }`}
                          >
                            {/* Subtle Scan Overlay on Hover */}
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 shadow-md scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center z-10" />
     
                            {/* Thumbnail frame wrapper (Perfect Square & Object-CONTAIN to show complete PNG icon) */}
                            <div className={`relative w-full aspect-square rounded-xl overflow-hidden border pointer-events-none shrink-0 flex items-center justify-center p-1 xs:p-1.5 ${
                              isLightTheme ? 'bg-slate-50 border-slate-200/60' : `bg-slate-950 ${cfg.imgBorder} border`
                            }`}>
                              <img 
                                src={t.img} 
                                alt={t.name}
                                loading="eager"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop";
                                }}
                              />
                              
                              {/* Status badge Overlay */}
                              {t.status && (
                                <span className={`absolute top-1 left-1 text-[5px] xs:text-[6px] md:text-[7.5px] font-mono font-black px-1 py-0.5 rounded tracking-widest leading-none ${
                                  t.status === 'ACTIVE' ? (isLightTheme ? 'bg-emerald-100 text-emerald-800' : cfg.badgeStyle) :
                                  t.status === 'UPDATING' ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'
                                }`}>
                                  {t.status}
                                </span>
                              )}
     
                              {/* Category Label overlay */}
                              {t.category && (
                                <span className="absolute bottom-1 right-1 text-[4.5px] xs:text-[5.5px] md:text-[6.5px] font-mono font-black uppercase bg-slate-950/80 tracking-widest border border-slate-800/60 px-1 py-0.5 rounded text-sky-400 pointer-events-none leading-none">
                                  {t.category}
                                </span>
                              )}
                            </div>
     
                            {/* Info and action button snugly structured with minimal touch space */}
                            <div className="flex flex-col mt-2 gap-1 xs:gap-1.5 w-full">
                              <div className="text-center min-h-[14px] xs:min-h-[16px] flex items-center justify-center">
                                <h4 className={`font-black text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-[11.5px] tracking-tight uppercase transition-colors font-mono line-clamp-1 leading-snug ${
                                  isLightTheme ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-200 group-hover:text-cyan-400'
                                }`}>
                                  {t.name}
                                </h4>
                              </div>
     
                              <div className="w-full shrink-0">
                                {t.link === "internal://wingo-sureshot" ? (
                                  <button 
                                    onClick={() => {
                                      playClickSfx('scan');
                                      setActiveView("wingo-sureshot");
                                    }}
                                    className={`w-full font-black text-[5.5px] xs:text-[6.5px] sm:text-[7.5px] md:text-[9.5px] font-mono tracking-widest uppercase text-center py-1.2 px-1 rounded-md flex items-center justify-center gap-0.5 cursor-pointer select-none transition-colors duration-150 h-5.5 xs:h-6.5 sm:h-7 md:h-8 leading-none border ${
                                      isLightTheme
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-100'
                                        : `bg-transparent ${cfg.btnBorder} ${cfg.btnText}`
                                    }`}
                                  >
                                    <span>LAUNCH PLATFORM</span>
                                    <Check className="w-1.5 h-1.5 xs:w-2 xs:h-2 md:w-2.5 md:h-2.5 shrink-0" />
                                  </button>
                                ) : (
                                  <a 
                                    href={t.link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    onClick={() => playClickSfx('scan')}
                                    className={`w-full font-black text-[5.5px] xs:text-[6.5px] sm:text-[7.5px] md:text-[9.5px] font-mono tracking-widest uppercase text-center py-1.2 px-1 rounded-md flex items-center justify-center gap-0.5 cursor-pointer select-none transition-colors duration-150 h-5.5 xs:h-6.5 sm:h-7 md:h-8 leading-none border ${
                                      isLightTheme
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100'
                                        : `bg-transparent ${cfg.btnBorder} ${cfg.btnText}`
                                    }`}
                                  >
                                    <span>LAUNCH MODULE</span>
                                    <ExternalLink className="w-1.5 h-1.5 xs:w-2 xs:h-2 md:w-2.5 md:h-2.5 shrink-0" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
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

            {/* Command Console trigger inside list */}
            <div 
              onClick={() => { 
                playClickSfx(); 
                const pin = prompt("ENTER ADMIN SECURITY PASSCODE REQUIRED FOR TELEMETRY CONTROL:");
                if (pin === "3434" || pin === "admin123" || pin === "923327011312") {
                  setSideMenuOpen(false); 
                  setAdminPanelOpen(true); 
                  showNotification("Admin authorization successful!", "success");
                } else if (pin !== null) {
                  showNotification("ACCESS DENIED: INVALID ADMIN PASSCODE SIGNATURE", "error");
                }
              }}
              className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-indigo-500/30 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-indigo-555/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black font-mono tracking-wider text-slate-200 group-hover:text-indigo-400 transition">Command Console</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-mono">Bypass Telemetry Injector</p>
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

            {/* Database Wipe Button */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-2 font-bold">AUTOMATED WIPER</span>
              <button 
                onClick={async () => {
                  playClickSfx();
                  if (confirm("ARE YOU SURE YOU WANT TO DE-AUTHORIZE AND PURGE ALL LOADED INJECTORS?")) {
                    if (usingLocalSimulation) {
                      setFeatures([]);
                      localStorage.setItem('stand_features', JSON.stringify([]));
                    } else {
                      // Delete all from firestore
                      for (const t of features) {
                        try {
                          if (t.id) {
                            await deleteDoc(doc(db, 'features', t.id));
                          }
                        } catch (err) {}
                      }
                      setFeatures([]);
                    }
                    showNotification("Custom module databases completely wiped.", "success");
                  }
                }}
                className="w-full py-3 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/50 text-rose-450 hover:text-rose-400 font-bold tracking-widest text-[10px] uppercase rounded-lg transition text-center cursor-pointer font-mono"
              >
                DE-AUTHORIZE ALL MODULES
              </button>
            </div>

            {/* Active Modules Manager */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2.5 font-bold border-b border-slate-800 pb-1.5 ml-1">MANAGE LOADED INJECTORS</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {features.length === 0 ? (
                  <p className="text-[10px] text-slate-500 font-mono uppercase text-center py-3">No active modules deployed.</p>
                ) : (
                  features.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center justify-between p-2 bg-slate-950/80 border border-slate-800 rounded-lg gap-2">
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[11px] font-bold text-slate-200 truncate uppercase tracking-widest font-mono">{item.name}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-mono">{item.category || "Mods"}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteTool(item.id || item.name)}
                        className="w-7 h-7 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-950 hover:border-rose-600 text-rose-400 hover:text-rose-350 rounded flex items-center justify-center transition shrink-0 cursor-pointer"
                        title="Delete dynamic injector"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
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
          7. MODERN PROFESSIONAL WELCOME DIALOG (3D ISOMETRIC STYLE)
          ---------------------------------------------------- */}
      {welcomeDialogOpen && (
        <div id="welcome-dialog" className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop with extreme blur and smooth entry */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
            onClick={() => {
              playClickSfx();
              sessionStorage.setItem('hasSeenWelcomeThisSession', 'true');
              setWelcomeDialogOpen(false);
            }}
          />

          {/* 3D Isometric Neon-Glow Panel Container */}
          <div className={`relative w-full max-w-sm rounded-2xl p-6 overflow-hidden transition-all duration-300 transform scale-100 animate-float-cyber border-2 ${
            isLightTheme 
              ? 'bg-white border-blue-600 text-slate-800 shadow-[5px_5px_0px_0px_rgba(30,41,59,0.9),10px_10px_20px_rgba(37,99,235,0.15)]' 
              : 'bg-gradient-to-b from-[#090d16] via-[#0e1424] to-[#04060c] border-[#06b6d4] text-slate-100 shadow-[6px_6px_0px_0px_#020617,10px_10px_0px_0px_#06b6d4,18px_18px_36px_rgba(0,0,0,0.9)]'
          }`}>
            
            {/* Top decorative aesthetic cyber-laser line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isLightTheme ? 'from-blue-600 to-indigo-500' : 'from-emerald-400 via-[#06b6d4] to-blue-500'}`} />

            {/* Top Close Button with 3D tactile push */}
            <button 
              onClick={() => {
                playClickSfx();
                sessionStorage.setItem('hasSeenWelcomeThisSession', 'true');
                setWelcomeDialogOpen(false);
              }}
              className={`absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition active:translate-y-0.5 cursor-pointer border ${
                isLightTheme 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600 shadow-[1px_1px_0px_#64748b]' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white shadow-[2px_2px_0px_#0f172a]'
              }`}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title Block */}
            <div className="text-center mb-5 mt-1">
              <div className={`inline-flex p-2.5 rounded-xl mb-2.5 border ${
                isLightTheme 
                  ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-[2px_2px_0px_rgba(37,99,235,0.1)]' 
                  : 'bg-[#06b6d4]/10 border-[#06b6d4]/30 text-[#06b6d4] animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              }`}>
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className={`text-lg font-black font-mono tracking-widest uppercase ${isLightTheme ? 'text-blue-700' : 'text-[#22D3EE]'}`}>
                Access Authorized
              </h3>
              <p className="text-[9.5px] text-slate-500 uppercase tracking-widest font-mono mt-1 font-bold">
                SYSTEM BRIEFING & DEPLOYMENT GUIDE
              </p>
            </div>

            {/* Operator Details Grid */}
            <div className={`border rounded-xl p-3 mb-4 font-mono text-[10px] grid grid-cols-2 gap-2 text-left ${
              isLightTheme ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/60 border-slate-800/60'
            }`}>
              <div className="space-y-0.5">
                <span className="text-slate-500 block text-[8px] uppercase tracking-wider">OPERATOR</span>
                <span className="text-rose-500 font-extrabold tracking-wider block leading-none">{userData.name}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block text-[8px] uppercase tracking-wider">STATUS</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-0.5 leading-none">
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Protocols compact list */}
            <div className="space-y-3 mb-5 text-left">
              <div className={`flex gap-3 items-start p-3 rounded-xl border-2 transition ${
                isLightTheme 
                  ? 'bg-slate-50/70 border-slate-200 shadow-[2px_2px_0px_rgba(203,213,225,0.4)]' 
                  : 'bg-[#04060c] border-[#06b6d4]/20 shadow-[3px_3px_0px_rgba(0,0,0,0.6)]'
              }`}>
                <div className="w-5 h-5 rounded bg-blue-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-blue-500/30 text-[10px] font-mono font-black shadow-[1px_1px_0px_#2563eb]">01</div>
                <div>
                  <h4 className={`text-[10.5px] font-black uppercase font-mono tracking-wide ${isLightTheme ? 'text-slate-800' : 'text-slate-100'}`}>SHIELDED BYPASS PAYLOAD</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-mono">Injectors use advanced socket layers to execute proxies safely in 0.0 seconds.</p>
                </div>
              </div>

              <div className={`flex gap-3 items-start p-3 rounded-xl border-2 transition ${
                isLightTheme 
                  ? 'bg-slate-50/70 border-slate-200 shadow-[2px_2px_0px_rgba(203,213,225,0.4)]' 
                  : 'bg-[#04060c] border-emerald-500/20 shadow-[3px_3px_0px_rgba(0,0,0,0.6)]'
              }`}>
                <div className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 text-[10px] font-mono font-black shadow-[1px_1px_0px_#059669]">02</div>
                <div>
                  <h4 className={`text-[10.5px] font-black uppercase font-mono tracking-wide ${isLightTheme ? 'text-slate-800' : 'text-slate-100'}`}>DAILY KEY REBUILDS</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-sans">System keys update dynamically every 48 hours. Follow the update channel below directly.</p>
                </div>
              </div>
            </div>

            {/* Action buttons stack with exquisite 3D click feedback */}
            <div className="space-y-3">
              <a 
                href="https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m" 
                target="_blank" 
                rel="noreferrer"
                onClick={playClickSfx}
                className="flex items-center justify-between p-2.5 px-3.5 bg-emerald-650 hover:bg-emerald-600 border-2 border-emerald-700 text-white rounded-xl transition-all duration-100 active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0px_rgba(4,120,87,0.8)] shadow-[3px_3px_0px_rgba(4,120,87,0.9)] text-decoration-none hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  <span className="text-[9.5px] font-mono font-black uppercase tracking-widest truncate">WHATSAPP OFFICIAL LINK</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white stroke-[3.5]" />
              </a>

              {/* Authorize button */}
              <button 
                onClick={() => {
                  playClickSfx();
                  sessionStorage.setItem('hasSeenWelcomeThisSession', 'true');
                  setWelcomeDialogOpen(false);
                }}
                className={`w-full relative group overflow-hidden font-black tracking-widest text-[11px] uppercase py-3.5 rounded-xl transition-all duration-100 active:translate-y-0.5 active:translate-x-0.5 border-2 cursor-pointer font-mono ${
                  isLightTheme 
                    ? 'bg-blue-600 hover:bg-blue-500 border-blue-700 text-white shadow-[3px_3px_0px_rgba(29,78,216,0.9)]'
                    : 'bg-[#06b6d4] hover:bg-cyan-400 border-cyan-500 text-slate-950 shadow-[4px_4px_0px_#044e5c]'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  LAUNCH HUD TERMINAL
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
