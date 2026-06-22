import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  User, 
  Edit3, 
  Download, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  Home,
  Heart,
  Share2,
  Sliders,
  ShieldCheck,
  Flame,
  Crown,
  Heart as SadIcon,
  Gamepad2,
  Trash2,
  Plus
} from "lucide-react";
import html2canvas from "html2canvas";
import { generateAllBios, CATEGORIES, FONT_PRESETS, PRESET_AVATARS, PRESET_COVERS, TACTILE_CHORDS } from "./biosData";
import { BioItem, StylistFontPreset, FacebookProfileState } from "./types";

export default function App() {
  // --- STATE CORE ---
  const [biosList, setBiosList] = useState<BioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"catalog" | "decor" | "ai_generator">("catalog");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Sound Synth Trigger
  const playSfx = (chord: number[]) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      chord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.5 + idx * 0.04);
      });
    } catch {
      // Audio block fallback
    }
  };

  // Toast System
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load of bios
  useEffect(() => {
    const loaded = generateAllBios();
    setBiosList(loaded);
  }, []);

  // Profile Preview Controls State
  const [profile, setProfile] = useState<FacebookProfileState>({
    name: "Sartaj Malik",
    isVerified: true,
    avatarUrl: PRESET_AVATARS[0],
    coverUrl: PRESET_COVERS[0],
    bioText: `👑 𝒱𝐼𝒫 𝒜𝒸𝒸𝑜𝓊𝓃𝓉 👑\n💎 VIP Entry: 14 February\n🖤 Mama's King\n🔥 Attitude Level: 💯%\n☠️ Game Over ☠️`,
    hobbies: ["🏋️ Gym", "🏍️ Riding", "🎧 Music", "🎮 Gaming"],
    followersCount: "999,632",
    workplace: "VIP Attitude Brand Ambassador",
    homeTown: "Royal King Estate, Delhi",
    relationshipStatus: "Single but Unreachable ✖️"
  });

  // Name Decorator State
  const [decoratorInput, setDecoratorInput] = useState<string>("Sartaj");
  const [selectedFont, setSelectedFont] = useState<string>("royal_vintage");

  // AI Generator Form state
  const [aiForm, setAiForm] = useState({
    name: "Umar Khan",
    mood: "Royal",
    language: "Hinglish / Urdu Styled",
    stylePattern: "Crown & Sword Decorators",
    customInstructions: "Add Gym Lover, Wish me on 18 Oct"
  });
  const [aiResults, setAiResults] = useState<Array<{ text: string; styleName: string }>>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiStep, setAiStep] = useState<string>("");

  // Refs
  const profileCardRef = useRef<HTMLDivElement>(null);

  // Filter & Search Bios
  const filteredBios = useMemo(() => {
    return biosList.filter(bio => {
      const matchCategory = selectedCategory === "all" || bio.category === selectedCategory;
      const matchSearch = bio.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [biosList, selectedCategory, searchQuery]);

  // Paginated elements
  const displayedBios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBios.slice(start, start + itemsPerPage);
  }, [filteredBios, currentPage]);

  const totalPages = Math.ceil(filteredBios.length / itemsPerPage) || 1;

  // Handle Tab switches
  const selectTab = (tab: "catalog" | "decor" | "ai_generator") => {
    setActiveTab(tab);
    playSfx(TACTILE_CHORDS.switch);
  };

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Load into profile live mockup
  const handleLoadToProfile = (bioText: string) => {
    setProfile(prev => ({
      ...prev,
      bioText: bioText
    }));
    playSfx(TACTILE_CHORDS.success);
    showToast("Loaded bio into Active Facebook Mockup! View preview ➡️");
  };

  // Copy Bio to Clipboard
  const handleCopy = (text: string, id?: number) => {
    navigator.clipboard.writeText(text);
    if (id !== undefined) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    playSfx(TACTILE_CHORDS.copy);
    showToast("Styled Bio Copied Successfully! 🎉 Go paste in your Facebook App.");
  };

  // Random picker
  const pickRandomBio = () => {
    if (filteredBios.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredBios.length);
    const selected = filteredBios[randomIndex];
    handleLoadToProfile(selected.text);
    playSfx(TACTILE_CHORDS.success);
    showToast("🎲 Random Bio Chosen & Injected into Preview!");
  };

  // Decorator custom symbol injector
  const injectSymbol = (symbol: string) => {
    setProfile(prev => ({
      ...prev,
      bioText: prev.bioText + symbol
    }));
    playSfx(TACTILE_CHORDS.click);
  };

  const deleteLastChar = () => {
    setProfile(prev => ({
      ...prev,
      bioText: prev.bioText.slice(0, -1)
    }));
    playSfx(TACTILE_CHORDS.delete);
  };

  // Export full mockup profile as HD image to Gallery
  const handleExportProfileCard = () => {
    if (!profileCardRef.current) return;
    playSfx(TACTILE_CHORDS.click);
    showToast("⚡ Processing high-ultra layout engine...");

    setTimeout(() => {
      html2canvas(profileCardRef.current!, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0f172a",
        scale: 2 // Make it double resolution for clean display
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `Facebook-Stylish-Bio-${profile.name.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        playSfx(TACTILE_CHORDS.success);
        showToast("📸 SAVED! Custom Facebook bio card saved in your gallery! 💎");
      }).catch((err) => {
        console.error("Export failure:", err);
        showToast("❌ Unable to export image in this browser. Please try again.");
      });
    }, 500);
  };

  // Call server-side API for Gemini generator
  const handleGenerateAiBio = async () => {
    setIsAiLoading(true);
    playSfx(TACTILE_CHORDS.click);
    
    // Sci-fi animation steps
    const steps = [
      "Establishing link with Gemini Core...",
      "Analyzing personality frequency waves...",
      "Weaving custom crown & warrior glyphs...",
      "Rendering hyper-detailed aesthetic block..."
    ];

    let currentStep = 0;
    setAiStep(steps[currentStep]);
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setAiStep(steps[currentStep]);
      }
    }, 700);

    try {
      const response = await fetch("/api/gemini/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm)
      });
      const data = await response.json();
      
      clearInterval(stepInterval);

      if (data.success) {
        setAiResults(data.bios);
        playSfx(TACTILE_CHORDS.success);
        showToast("✨ AI generated your styled bios flawlessly!");
      } else {
        showToast("⚠️ Could not generate. Loaded default styled bios.");
      }
    } catch (e) {
      clearInterval(stepInterval);
      showToast("⚠️ System offline. Loaded fallback styled bios.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Dynamic applied styled name
  const styledProfileName = useMemo(() => {
    const selectedPreset = FONT_PRESETS.find(f => f.id === selectedFont);
    return selectedPreset ? selectedPreset.transform(decoratorInput) : decoratorInput;
  }, [decoratorInput, selectedFont]);

  // Synchronize styled Name to active profile mockup
  useEffect(() => {
    if (styledProfileName.trim()) {
      setProfile(prev => ({ ...prev, name: styledProfileName }));
    }
  }, [styledProfileName]);

  return (
    <div className="min-height-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white pb-10">
      
      {/* GLOWING AMBIENT GRAPHICS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP GLOW BAR */}
      <div className="w-full h-1 bg-gradient-to-r from-teal-400 via-rose-500 via-yellow-400 to-purple-600 animate-rgb-border" />

      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Crown className="w-6 h-6 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-royal font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-rose-400 to-violet-300">
              ＦＡＣＥＢＯＯＫ 𝖲𝖳𝖸𝖫𝖨𝖲𝖧 𝖡𝖨𝖮𝖲
            </h1>
            <p className="text-xs text-slate-400 tracking-widest font-mono-tech mt-0.5">
              1000+ ULTRA GOLDEN BRANDED BIOS • COMPATIBLE FOR ALL ACCOUNTS
            </p>
          </div>
        </div>

        {/* CONTROLS (SOUNDS, OFFERS) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              playSfx(TACTILE_CHORDS.click);
            }}
            id="sound-opt-toggle"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono-tech border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-600 text-slate-300 active:scale-95"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-500" />
                <span>SOUNDS MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>SOUND INTEGRATED</span>
              </>
            )}
          </button>
          
          <div className="hidden lg:flex items-center gap-1 text-slate-500 text-xs font-mono-tech">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            <span>VIP NETWORK: PASSIVE ONLINE</span>
          </div>
        </div>
      </header>

      {/* TOAST SYSTEM POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border-2 border-emerald-500 shadow-emerald-500/10 px-5 py-2.5 rounded-xl flex items-center gap-2 max-w-sm w-full text-sm font-semibold shadow-2xl"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-100">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO STATEMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
        <div className="hero-box-3d p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-rose-500/10 to-transparent blur-2xl pointer-events-none" />
          <div className="text-center md:text-left">
            <span className="bg-rose-500/10 text-rose-300 text-[10px] font-mono-tech tracking-widest px-3 py-1 rounded-full uppercase border border-rose-500/20">
              🔥 Modern High Ultra Design
            </span>
            <h2 className="text-xl md:text-2xl font-bold mt-2.5 tracking-wide">
              Aik Aisa Professional Tool Jis See Poori Duniya Hairan Hojaye!
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Select elegant layouts, run custom text styles, or compile ultra-VIP biographies generated by artificial intelligence. Check previews instantly and save graphic bio files in high definitions!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={pickRandomBio}
              id="hero-spin-btn"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-bold hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all text-sm"
            >
              🚀 🎲 CHOOSE RANDOM BIO
            </button>
          </div>
        </div>
      </section>

      {/* CORE WORKSPACE CO-ORDINATE ENGINE */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: SELECTION LABS (8 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* TAB SELECTION SELECTORS */}
          <div className="flex bg-slate-900/.4 border border-slate-800 p-1.5 rounded-xl gap-2 backdrop-blur-md">
            <button
              onClick={() => selectTab("catalog")}
              className={`flex-1 py-3 px-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "catalog"
                  ? "bg-slate-800 border border-slate-700/60 text-white shadow-md shadow-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>📱 1000+ PRESET BIOS</span>
            </button>
            <button
              onClick={() => selectTab("decor")}
              className={`flex-1 py-3 px-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "decor"
                  ? "bg-slate-800 border border-slate-700/60 text-white shadow-md shadow-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Edit3 className="w-4 h-4 text-rose-400" />
              <span>✍️ NAME STYLIZER</span>
            </button>
            <button
              onClick={() => selectTab("ai_generator")}
              className={`flex-1 py-3 px-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "ai_generator"
                  ? "bg-slate-800 border border-slate-700/60 text-white shadow-md shadow-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>🤖 AI BIO MAKER</span>
            </button>
          </div>

          {/* TAB CONTENT: 1000+ CATALOG OF BIOS */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-5">
              
              {/* FILTER TAB BUTTONS & SEARCH BAR */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-4">
                
                {/* SEARCH INPUT */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search premium bios... (e.g. King, Love, FF, wish me)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300 font-mono-tech"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* HORIZONTAL CATEGORY GRID */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          playSfx(TACTILE_CHORDS.click);
                        }}
                        className={`text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all border ${
                          isSelected
                            ? "bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border-rose-500 text-white shadow-md"
                            : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEARCH COUNT */}
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-slate-400 font-mono-tech uppercase">
                  FOUND: <strong className="text-rose-400">{filteredBios.length}</strong> BIOS IN DATABASE
                </span>
                <span className="text-xs text-slate-500 font-mono-tech">
                  PAGE: {currentPage} / {totalPages}
                </span>
              </div>

              {/* DYNAMIC LISTING OF CARDS */}
              {displayedBios.length === 0 ? (
                <div className="bg-slate-900/10 border border-dashed border-slate-800 p-12 text-center rounded-xl">
                  <span className="block text-2xl">🔍</span>
                  <p className="text-slate-400 text-sm mt-2 font-mono-tech">No VIP Stylish Bios found matching your search matrix.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                    className="text-xs mt-3 text-rose-400 hover:underline"
                  >
                    Reset Filter Matrices
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedBios.map((bio, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      key={bio.id}
                      className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
                    >
                      {/* TOP GRAPHICS BAR */}
                      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-slate-800 via-rose-500/40 to-slate-800 group-hover:from-rose-500 group-hover:to-purple-500 transition-all duration-300" />
                      
                      {/* STATS INFO */}
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono-tech uppercase mb-3">
                        <span>⭐ MODEL #{bio.id}</span>
                        <span className="text-rose-400/80 bg-rose-500/5 px-2 py-0.5 rounded-full">
                          🔥 {bio.likes} VIP Reacts
                        </span>
                      </div>

                      {/* THE STYLED BIO PRESET BODY */}
                      <pre className="text-slate-100 font-sans text-xs md:text-sm whitespace-pre-wrap leading-relaxed select-text font-medium border-l border-slate-850 pl-3 leading-6 my-2 bg-slate-950/40 p-2.5 rounded">
                        {bio.text}
                      </pre>

                      {/* COPY BUTTONS BAR */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-850/60">
                        <button
                          onClick={() => handleCopy(bio.text, bio.id)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-300 hover:text-white border border-slate-850 hover:bg-slate-900 active:scale-95 transition-all"
                        >
                          {copiedId === bio.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>COPY BIO</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleLoadToProfile(bio.text)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500 text-xs font-semibold hover:text-white flex items-center justify-center gap-1 border border-rose-500/20 hover:border-transparent active:scale-95 transition-all"
                        >
                          <span>✏️ MOCKUP PREVIEW</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* PAGINATION LAYOUT CONTROLLER */}
              <div className="flex justify-between items-center mt-4 bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    playSfx(TACTILE_CHORDS.switch);
                  }}
                  className="flex items-center gap-1 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-lg p-2 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>PREVIOUS</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-[200px] md:max-w-none">
                  {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          playSfx(TACTILE_CHORDS.click);
                        }}
                        className={`w-7.5 h-7.5 rounded-md text-xs font-mono-tech ${
                          currentPage === pageNum
                            ? "bg-rose-500 text-white font-bold"
                            : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 6 && <span className="text-slate-500 px-1 font-mono-tech">...</span>}
                  {totalPages > 6 && (
                    <button
                      onClick={() => {
                        setCurrentPage(totalPages);
                        playSfx(TACTILE_CHORDS.click);
                      }}
                      className={`w-7.5 h-7.5 rounded-md text-xs font-mono-tech ${
                        currentPage === totalPages
                          ? "bg-rose-500 text-white font-bold"
                          : "bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    playSfx(TACTILE_CHORDS.switch);
                  }}
                  className="flex items-center gap-1 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-lg p-2 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>NEXT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB CONTENT: NAME STYLIZER DECORATION LABS */}
          {activeTab === "decor" && (
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-6">
              
              <div>
                <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Dynamic Unicode Stylizer Module</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Type your name or message below to instantly convert normal letters into gorgeous, rare vintage fonts. Perfect for Facebook Usernames and title blocks!
                </p>
              </div>

              {/* INPUT BOX */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-mono-tech uppercase">Your Name / Topic Label</label>
                <input
                  type="text"
                  maxLength={25}
                  value={decoratorInput}
                  onChange={(e) => {
                    setDecoratorInput(e.target.value);
                  }}
                  placeholder="Enter name to decorate..."
                  className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-lg font-bold text-white placeholder-slate-700 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* CHOOSE SYSTEM FONTS PRESETS */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-mono-tech uppercase">Choose Stylist Font Font Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FONT_PRESETS.map((font) => {
                    const isSelected = selectedFont === font.id;
                    const previewText = font.transform(decoratorInput || "Preview");
                    return (
                      <button
                        key={font.id}
                        onClick={() => {
                          setSelectedFont(font.id);
                          playSfx(TACTILE_CHORDS.click);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-slate-950 border-rose-500 text-white shadow-md shadow-rose-500/5"
                            : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className="text-[10px] text-slate-500 font-mono-tech mb-1 uppercase">{font.name}</div>
                        <div className="text-md font-bold text-slate-200 text-ellipsis overflow-hidden">{previewText}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COPY & DIRECT INJECTION */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono-tech uppercase">Active Styled Name Output</div>
                  <div className="text-xl font-bold text-yellow-300 mt-1">{styledProfileName || "No Input Specified"}</div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy(styledProfileName)}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-lg bg-rose-500 text-xs font-bold text-white hover:bg-rose-600 transition-all flex items-center justify-center gap-1 active:scale-95 shadow-md shadow-rose-600/15"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY STYLED NAME</span>
                  </button>
                </div>
              </div>

              {/* THE MANUAL DECORATOR WRITING TABLE */}
              <div>
                <hr className="border-slate-850 mb-4" />
                <h4 className="text-xs text-slate-300 font-bold uppercase mb-2">💎 Quick Symbol Injector (Append custom characters)</h4>
                <p className="text-[11px] text-slate-500 mb-3">Click any symbol below to append it to your Facebook profile bio live preview.</p>
                <div className="flex flex-wrap gap-2">
                  {["👑", "😈", "🖤", "☠️", "⚔️", "々", "ᰔ", "🦋", "🥀", "🧁", "🧸", "🦄", "⚡", "✧", "❄️", "💎", "🔱", "⚜️", "⭐", "░", "▒", "▓", "亗", "〆", "☣️"].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => injectSymbol(sym)}
                      className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-600 text-slate-200 hover:text-white flex items-center justify-center font-bold active:scale-90 text-sm md:text-md transition-all"
                    >
                      {sym}
                    </button>
                  ))}
                  <button
                    onClick={deleteLastChar}
                    className="px-3.5 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-rose-300 flex items-center justify-center text-xs font-semibold active:scale-90 transition-all"
                  >
                    BACKSPACE ✖️
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: AI STYLISH BIO MAKER (GEMINI INTERFACED) */}
          {activeTab === "ai_generator" && (
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-5">
              
              <div>
                <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400 animate-spin" />
                  <span>AI Powered Luxury Bio Writer (Gemini Pro)</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Explain your style preferences and our server-connected artificial intelligence engine will compose multiple, bespoke, fully-constructed biographies packed with matching premium crown/attitude symbols.
                </p>
              </div>

              {/* INPUT FIELDS CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-mono-tech uppercase">Your Name</label>
                  <input
                    type="text"
                    value={aiForm.name}
                    onChange={(e) => setAiForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-mono-tech uppercase">Bio Mood / Personality</label>
                  <select
                    value={aiForm.mood}
                    onChange={(e) => setAiForm(prev => ({ ...prev, mood: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 focus:border-purple-500 outline-none"
                  >
                    <option value="Royal VIP">👑 Royal Supreme VIP</option>
                    <option value="Attitude">😈 Killer Attitude / Bad Boy</option>
                    <option value="Queen">🎀 Soft Princess / Cute Girl</option>
                    <option value="Sad">🖤 Sad Emotional / Broken Solitude</option>
                    <option value="Gamer">🎮 Pro Gamer / Sniper</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-mono-tech uppercase">Accent Style</label>
                  <select
                    value={aiForm.language}
                    onChange={(e) => setAiForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 focus:border-purple-500 outline-none"
                  >
                    <option value="Mix English/Urdu script using Latin layout">Mix English & Latin Urdu / Hinglish</option>
                    <option value="Pure Stylish English">Elite Pure English</option>
                    <option value="Roman Devenagari Layout">Urdu Symbols with Hindi script</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-mono-tech uppercase">Design Pattern</label>
                  <select
                    value={aiForm.stylePattern}
                    onChange={(e) => setAiForm(prev => ({ ...prev, stylePattern: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 focus:border-purple-500 outline-none"
                  >
                    <option value="Heavy Crown & Shield Icons">Crown & Royal Crest Ornaments</option>
                    <option value="Daggers & Danger Skulls">Daggers & Danger Skulls ☠️</option>
                    <option value="Delicate Butterflies & Flowers">Delicate Butterflies & Flowers 🦋</option>
                    <option value="Artistic Square Blocks & Brackets">Border brackets and square tiles</option>
                  </select>
                </div>
              </div>

              {/* CUSTOM DESIDERATED SPECIFICATION TEXTAREA */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-mono-tech uppercase">Custom Hobbies & wish date (Optional)</label>
                <textarea
                  value={aiForm.customInstructions}
                  rows={2}
                  placeholder="e.g. Add 'Cake murder 14 Nov', Gym Addict, Black lover, KTM rider..."
                  onChange={(e) => setAiForm(prev => ({ ...prev, customInstructions: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm text-white focus:border-purple-500 outline-none resize-none"
                />
              </div>

              {/* ACTION GENERATOR BUTTON */}
              <button
                disabled={isAiLoading}
                onClick={handleGenerateAiBio}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white font-bold hover:shadow-lg hover:shadow-purple-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>{aiStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>COMPILE CUSTOM AI-STYLED BIOS</span>
                  </>
                )}
              </button>

              {/* AI GENERATED RESULT MATRIX */}
              {aiResults.length > 0 && (
                <div className="flex flex-col gap-4 mt-2">
                  <h4 className="text-xs text-slate-300 font-mono-tech uppercase">✨ Gemini Custom Generated Bios result</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {aiResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-slate-950 border-2 border-purple-900/60 p-4 rounded-xl relative overflow-hidden group"
                      >
                        <div className="flex justify-between items-center text-[10px] text-purple-400 font-mono-tech uppercase mb-2">
                          <span>🔮 AI STYLIST PRESET {index + 1}</span>
                          <span className="text-yellow-300 font-bold">{result.styleName}</span>
                        </div>
                        <pre className="text-slate-100 font-sans text-xs md:text-sm whitespace-pre-wrap leading-relaxed select-text font-medium leading-6 bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                          {result.text}
                        </pre>
                        
                        <div className="flex items-center gap-2 mt-3 justify-end text-xs">
                          <button
                            onClick={() => handleCopy(result.text)}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-800 font-semibold"
                          >
                            Copy directly
                          </button>
                          <button
                            onClick={() => handleLoadToProfile(result.text)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-lg font-bold"
                          >
                            Mockup Preview
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* EDIT ACTIVE RAW PREVIEW TEXT DIRECTLY IN FORM (TIES BOTH COLUMN) */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-400 font-mono-tech uppercase flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                <span>Sandbox Board: Edit active biography text directly</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono-tech">
                {profile.bioText.length} Characters
              </span>
            </div>
            <textarea
              value={profile.bioText}
              onChange={(e) => setProfile(prev => ({ ...prev, bioText: e.target.value }))}
              rows={5}
              id="raw-editor-bio"
              className="w-full bg-slate-950 border border-slate-800/90 text-slate-200 font-sans p-3.5 rounded-xl text-sm leading-relaxed outline-none focus:border-rose-500 resize-y"
              placeholder="Paste bio layout or type your own symbols here..."
            />
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME FACEBOOK PROFILE CARD CANVAS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-4 h-fit">
          
          {/* CONTROL PREVIEW PALETTES (Allows updating Avatar / Cover, Verification) */}
          <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex flex-col gap-4">
            <h3 className="text-xs font-mono-tech text-slate-300 uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Modify Sandbox Mockup Details</span>
            </h3>

            {/* TOGGLE BLUE TICK */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-xs font-semibold text-slate-300">Facebook Verification Status (Blue Badge)</span>
              <button
                onClick={() => {
                  setProfile(prev => ({ ...prev, isVerified: !prev.isVerified }));
                  playSfx(TACTILE_CHORDS.click);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 outline-none ${
                  profile.isVerified ? "bg-blue-500" : "bg-slate-800"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    profile.isVerified ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* SELECTION FOR COVER PHOTOS */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase">Select Cover Design Accent</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COVERS.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProfile(prev => ({ ...prev, coverUrl: url }));
                      playSfx(TACTILE_CHORDS.click);
                    }}
                    className={`h-9 rounded overflow-hidden border transition-all ${
                      profile.coverUrl === url ? "border-amber-400 ring-1 ring-amber-400" : "border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Preset cover photo" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* SELECTION FOR AVATARS */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-mono-tech uppercase">Select Premium Portrait Avatar</span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AVATARS.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProfile(prev => ({ ...prev, avatarUrl: url }));
                      playSfx(TACTILE_CHORDS.click);
                    }}
                    className={`h-9 rounded-full overflow-hidden border transition-all ${
                      profile.avatarUrl === url ? "border-rose-500 ring-2 ring-rose-500/30" : "border-slate-850 hover:border-slate-600"
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Preset portrait avatar" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* EDIT EXTRA BLOCKS (Follower tags, Status) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-slate-500 font-mono-tech uppercase">Follower Tag count</span>
                <input
                  type="text"
                  value={profile.followersCount}
                  onChange={(e) => setProfile(prev => ({ ...prev, followersCount: e.target.value }))}
                  className="bg-slate-950 border border-slate-850 rounded p-2 text-slate-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-slate-500 font-mono-tech uppercase">Relationship state</span>
                <input
                  type="text"
                  value={profile.relationshipStatus}
                  onChange={(e) => setProfile(prev => ({ ...prev, relationshipStatus: e.target.value }))}
                  className="bg-slate-950 border border-slate-850 rounded p-2 text-slate-300"
                />
              </div>
            </div>

          </div>

          {/* ACTIVE RENDER SCREEN CONTAINER */}
          <div className="flex flex-col gap-3">
            
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-slate-400 font-mono-tech uppercase flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" />
                <span>Facebook Native Profile View Mockup</span>
              </span>
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                LIVE SANDBOX
              </span>
            </div>

            {/* NATIVE FACEBOOK RENDER CARD (EXPORTS FULL HD PNG FROM THIS REF) */}
            <div
              id="facebook-interactive-profile-canvas"
              ref={profileCardRef}
              className="w-full bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden shadow-2xl relative"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
            >
              
              {/* BRANDING MARGIN FLOATING SYSTEM (Anti AI slop: no terminal simulation logs inside card!) */}
              
              {/* FACEBOOK SYSTEM TOP BAR BANNER */}
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="font-semibold text-slate-400 uppercase tracking-widest text-[9px]">
                  📱 FACEBOOK APP PREVIEW
                </div>
                <div className="font-mono text-slate-500">
                  100% QUALITY
                </div>
              </div>

              {/* COVER PICTURE */}
              <div className="relative h-44 w-full bg-slate-800">
                <img
                  src={profile.coverUrl}
                  className="w-full h-full object-cover"
                  alt="Facebook Live Cover artwork"
                  referrerPolicy="no-referrer"
                />
                
                {/* FLOATING COVER BADGE ICON */}
                <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>PREMIUM ART</span>
                </div>
              </div>

              {/* PROFILE AVATAR GRID (OVERLAPPING WITH COVER) */}
              <div className="px-5 pb-5 relative">
                
                <div className="flex flex-col sm:flex-row justify-between items-end -mt-16 mb-4 sm:gap-4">
                  {/* Portrait frame with golden gradient outline */}
                  <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-yellow-300 via-rose-500 to-purple-600 shadow-xl relative z-10">
                    <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden">
                      <img
                        src={profile.avatarUrl}
                        className="w-full h-full object-cover"
                        alt="Facebook User Portrait Avatar"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Facebook Interaction Tabs Mockup (Simulated add to story) */}
                  <div className="flex gap-2 mt-4 sm:mt-0 relative z-10">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow">
                      ➕ Add to Story
                    </button>
                    <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                      ✏️ Edit Profile
                    </button>
                  </div>
                </div>

                {/* USER PROFILE NAME + BLUE VERIFIED VERIFICATION SIGN */}
                <div className="mt-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none font-sans">
                      {styledProfileName || "Your Name Here"}
                    </h2>
                    {profile.isVerified && (
                      <div className="bg-blue-500 rounded-full p-1 flex items-center justify-center shadow-lg shadow-blue-500/20" title="Officially Verified Stylist Profile">
                        <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                      </div>
                    )}
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                      VIP LEVEL
                    </span>
                  </div>

                  {/* FB USERNAME AND METRICS */}
                  <div className="text-xs text-slate-500 font-semibold font-mono-tech mt-1 flex gap-2">
                    <span>@stylish_account_APPROVED</span>
                    <span>•</span>
                    <span className="text-slate-400 font-bold">{profile.followersCount} Followers</span>
                  </div>
                </div>

                {/* HEART OF MOCKUP: THE INSTANT BIO DISPLAY CONTAINER */}
                <div className="mt-5 bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-inner relative overflow-hidden backdrop-blur-sm">
                  
                  {/* Subtle water-marker */}
                  <div className="absolute -right-5 -bottom-5 text-7xl text-slate-800/10 font-bold select-none rotate-12 uppercase pointer-events-none tracking-widest font-mono-tech">
                    Elite
                  </div>

                  {/* Header Title */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono-tech uppercase tracking-widest border-b border-slate-850 pb-2 mb-3">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Facebook Bio Segment</span>
                  </div>

                  {/* Highly Beautiful rendered multiple text lines with monospace symbols */}
                  <pre className="text-slate-100 font-sans text-xs md:text-sm whitespace-pre-wrap leading-relaxed select-text font-medium text-center leading-7 py-1">
                    {profile.bioText || `⚠️ No Stylish Bio loaded yet.\nClick on any bio preset in the left catalog of 1000+ bios or write your own to review live!`}
                  </pre>
                </div>

                {/* EXTRA DETAILS FIELDS (Aesthetic layout) */}
                <div className="mt-5 space-y-3 pt-4 border-t border-slate-850/60 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Works at <strong className="text-slate-300">{profile.workplace}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Lives in <strong className="text-slate-300">{profile.homeTown}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Relationship status: <strong className="text-slate-300">{profile.relationshipStatus}</strong></span>
                  </div>
                </div>

                {/* HOBBIES ACCENT CHIPS */}
                <div className="mt-5">
                  <div className="text-[10px] text-slate-500 font-mono-tech uppercase mb-2">Featured Hobbies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.hobbies.map((h, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-slate-300">
                        {h}
                      </span>
                    ))}
                    <span className="bg-slate-900/40 border border-dashed border-slate-800 px-3 py-1 rounded-full text-xs text-slate-500 flex items-center justify-center cursor-pointer hover:text-slate-300">
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* ACTION DOWNLOAD CODES (Uses html2canvas on card container) */}
            <div className="flex gap-3">
              <button
                onClick={handleExportProfileCard}
                id="export-png-main-btn"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs md:text-sm shadow-md shadow-rose-600/10 hover:shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>📸 SAVE CARD TO GALLERY</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 font-mono-tech flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative">
        <p>© 2026 Facebook Stylish Bio Creator Studio. All custom glyph structures and sound synthesized chips verified.</p>
        <p className="text-rose-400 font-semibold uppercase tracking-widest bg-rose-500/5 px-3 py-1.5 rounded-full border border-rose-500/10">
          🔥 Powered by Gemini & Ultra Design Matrix
        </p>
      </footer>

    </div>
  );
}
