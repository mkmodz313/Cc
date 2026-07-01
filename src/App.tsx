import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Terminal, 
  Lock,
  Search,
  X,
  ShieldCheck,
  Play,
  HelpCircle
} from "lucide-react";
import { SoundCore } from "./components/SoundCore";
import { WelcomeDialog } from "./components/WelcomeDialog";

interface YouTubeVideo {
  videoId?: string;
  id?: string;
  title?: string;
  thumbnail?: string;
  duration?: string;
  views?: string | number;
  channelTitle?: string;
  author?: string;
  published?: string;
  uploaded?: string;
}

// Custom curated YouTube video list for rich initial feed
const PRESET_GOLDEN_VIDEOS: YouTubeVideo[] = [
  {
    videoId: "jfKfPfyJRdk",
    title: "Lofi Hip Hop Radio 📚 Beats to Study/Relax to",
    duration: "LIVE",
    views: "18M views",
    channelTitle: "Lofi Girl",
    thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400"
  },
  {
    videoId: "5qap5aO4i9A",
    title: "Lofi Hip Hop Radio - Beats to Study/Relax to 🐾",
    duration: "24:15",
    views: "2.1M views",
    channelTitle: "Lofi Records",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400"
  },
  {
    videoId: "tNtMyXbBfF0",
    title: "Synthwave Retrofuture Mix: Cosmic Highway",
    duration: "1:05:22",
    views: "890K views",
    channelTitle: "Retro Wave",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400"
  },
  {
    videoId: "36YnV9Sby_Y",
    title: "4K Cinematic Space Ambient Odyssey",
    duration: "3:40:00",
    views: "1.2M views",
    channelTitle: "Cosmic Sounds",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400"
  },
  {
    videoId: "v6bAtASt_6k",
    title: "Ultra Bass Boosted Car Music Mix 2026",
    duration: "45:32",
    views: "5.4M views",
    channelTitle: "Car Music Club",
    thumbnail: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=400"
  },
  {
    videoId: "kJQP7kiw5Fk",
    title: "Despacito - Luis Fonsi ft. Daddy Yankee",
    duration: "4:42",
    views: "8.1B views",
    channelTitle: "Luis Fonsi",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400"
  },
  {
    videoId: "OPf0YbXqDm0",
    title: "Uptown Funk - Mark Ronson ft. Bruno Mars",
    duration: "4:30",
    views: "4.9B views",
    channelTitle: "Mark Ronson",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400"
  },
  {
    videoId: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE (강남스타일) M/V",
    duration: "4:12",
    views: "5.1B views",
    channelTitle: "officialpsy",
    thumbnail: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400"
  },
  {
    videoId: "YQHsXMglC9I",
    title: "Adele - Hello (Official Video)",
    duration: "6:06",
    views: "3.2B views",
    channelTitle: "Adele",
    thumbnail: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400"
  },
  {
    videoId: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You (Official Music Video)",
    duration: "4:23",
    views: "6.2B views",
    channelTitle: "Ed Sheeran",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400"
  },
  {
    videoId: "rtO53tVyY8g",
    title: "Alan Walker - Faded (Official Video)",
    duration: "3:32",
    views: "3.5B views",
    channelTitle: "Alan Walker",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400"
  },
  {
    videoId: "hT_nvWreIhg",
    title: "OneRepublic - Counting Stars (Official Video)",
    duration: "4:43",
    views: "3.9B views",
    channelTitle: "OneRepublic",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400"
  }
];

const HACKER_SPIN_LOGS = [
  "MKMODZ_SYS: INITIATING DECRYPTION PROTOCOL v9.5...",
  "MKMODZ_SYS: LOADING INGRESS DECRYPT CHANNELS...",
  "MKMODZ_SEC: SPOOFING SECURITY CHECKPOINTS (ANDROID_EMBED)...",
  "MKMODZ_NET: ATTACHING GIGABIT DOWNLOAD STREAM KERNELS...",
  "MKMODZ_SYS: BYPASSING YOUTUBE SIGNATURE LIMITATIONS...",
  "MKMODZ_SEC: ESTABLISHING SECURE SSL OVERRIDE SHIELD...",
  "MKMODZ_SYS: INJECTING SAVETUBE EXPORT PACKETS...",
  "MKMODZ_NET: ESTABLISHING DIRECT SOCKET PIPES...",
  "MKMODZ_SYS: BYPASS SUCCESSFUL. ENGINE ARMED & ONLINE!"
];

const DECRYPTION_STEP_LOGS = [
  "SEC: INITIALIZING DECRYPTION KERNELS...",
  "NET: CONNECTING TO SAVETUBE MULTI-THREAD PIPES...",
  "SYS: ESTABLISHING CODES WITH BYPASS HANDSHAKE...",
  "SYS: GENERATING GOLD RE-DIRECTION TOKEN...",
  "SEC: INJECTING SECURITY HEADER WRAPPERS...",
  "NET: STABILIZING GIGABIT DOWNLOAD STREAM...",
  "SYS: COMPLETED. DELIVERING ACCESS LINK..."
];

export default function App() {
  // Splash & Core States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);
  const [splashLogs, setSplashLogs] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState<boolean>(false);
  const [bannerImgSrc, setBannerImgSrc] = useState<string>("/src/assets/top.png");
  const [bannerAttempt, setBannerAttempt] = useState<number>(0);

  // Fallback if local top banner image doesn't exist
  const handleBannerImageError = () => {
    if (bannerAttempt === 0) {
      setBannerAttempt(1);
      setBannerImgSrc("/src/assets/top.jpg");
    } else if (bannerAttempt === 1) {
      setBannerAttempt(2);
      setBannerImgSrc("/src/assets/top.jpeg");
    } else {
      // High-quality gold cyber aesthetic fallback banner
      setBannerImgSrc("https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1200");
    }
  };

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>(PRESET_GOLDEN_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Decryption Downloader States
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [decryptProgress, setDecryptProgress] = useState<number>(0);
  const [decryptLogs, setDecryptLogs] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("720");

  // Endless Media Scrolling States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState<string>("lofi");
  const [loadMoreIndex, setLoadMoreIndex] = useState<number>(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound Engine Helper Functions
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      SoundCore.playTick();
    }
  };

  const playSound = (type: "tick" | "success" | "laser" | "beep") => {
    if (isMuted) return;
    try {
      if (type === "success") SoundCore.playSuccessLaser();
      else if (type === "laser") SoundCore.playLaserSweep();
      else if (type === "beep") SoundCore.playBeep();
      else SoundCore.playTick();
    } catch (e) {}
  };

  // 1. Cyber Hacker Gold Rain effect inside Splash Screen
  useEffect(() => {
    if (!showSplash) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01010101MKMODZHACKERDECRYPTERSYSTEMBYPASS666";
    const charArr = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const rainDrops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 4, 2, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fbbf24"; // Rich Cyber Gold Matrix
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

    const drawInterval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(drawInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [showSplash]);

  // Pre-load dynamic list of songs on mount
  const loadInitialVideos = async () => {
    try {
      let data;
      try {
        const res = await fetch(`/api/downloader/search?query=${encodeURIComponent("new songs hits")}`);
        if (!res.ok) throw new Error("Local search API failed");
        data = await res.json();
      } catch (e) {
        console.warn("Local search failed, falling back to public search API", e);
        const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent("new songs hits")}`);
        data = await res.json();
      }
      
      let parsedResults: YouTubeVideo[] = [];
      if (data) {
        if (Array.isArray(data)) {
          parsedResults = data;
        } else if (data.results && Array.isArray(data.results)) {
          parsedResults = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          parsedResults = data.data;
        } else if (data.video && Array.isArray(data.video)) {
          parsedResults = data.video;
        }
      }

      if (parsedResults.length > 0) {
        const normalized = parsedResults.map(item => {
          if (!item) return null;
          return {
            ...item,
            videoId: item.videoId || item.id,
            title: item.title || "Untitled Video",
            thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400",
            duration: item.duration || "N/A",
            views: item.views || "0",
            channelTitle: item.channelTitle || item.author || "YouTube Channel",
            published: item.published || item.uploaded || ""
          };
        }).filter(Boolean) as YouTubeVideo[];

        // Combine preset and loaded videos for ultimate fullness
        setVideos(prev => {
          const existingIds = new Set(prev.map(v => v.videoId || v.id));
          const newUniqueVideos = normalized.filter(v => !existingIds.has(v.videoId || v.id));
          return [...prev, ...newUniqueVideos];
        });
      }
    } catch (err) {
      console.error("Failed loading initial dynamic songs:", err);
    }
  };

  // Splash Screen loading and auto-progress animation
  useEffect(() => {
    if (!showSplash) return;
    try {
      if (!isMuted) SoundCore.startSpaceHum();
    } catch (e) {}

    // Preload live songs in the background of the splash screen
    loadInitialVideos();

    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowSplash(false);
            playSound("success");
            try {
              SoundCore.stopSpaceHum();
            } catch (e) {}
          }, 650);
          return 100;
        }

        const logIndex = Math.floor((prev / 100) * HACKER_SPIN_LOGS.length);
        if (HACKER_SPIN_LOGS[logIndex] && !splashLogs.includes(HACKER_SPIN_LOGS[logIndex])) {
          setSplashLogs((l) => [...l, HACKER_SPIN_LOGS[logIndex]]);
          playSound("tick");
        }

        return prev + Math.floor(Math.random() * 8) + 5;
      });
    }, 120);

    return () => {
      clearInterval(interval);
    };
  }, [showSplash]);

  // Auto-trigger welcome dialog when splash completes
  useEffect(() => {
    let welcomeTimer: NodeJS.Timeout | null = null;
    if (!showSplash) {
      const dismissed = localStorage.getItem("mkmodz_welcome_dismissed");
      if (dismissed !== "true") {
        welcomeTimer = setTimeout(() => {
          setShowWelcomeDialog(true);
        }, 500);
      }
    }
    return () => {
      if (welcomeTimer) clearTimeout(welcomeTimer);
    };
  }, [showSplash]);

  // YouTube Decryption Keyword Search handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    playSound("laser");
    setActiveQuery(searchQuery);
    setLoadMoreIndex(1);

    try {
      let data;
      try {
        const res = await fetch(`/api/downloader/search?query=${encodeURIComponent(searchQuery)}`);
        if (!res.ok) throw new Error("Local API search failed");
        data = await res.json();
      } catch (e) {
        console.warn("Local search failed, falling back to public search API", e);
        const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(searchQuery)}`);
        data = await res.json();
      }
      
      let parsedResults: YouTubeVideo[] = [];
      if (data) {
        if (Array.isArray(data)) {
          parsedResults = data;
        } else if (data.results && Array.isArray(data.results)) {
          parsedResults = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          parsedResults = data.data;
        } else if (data.video && Array.isArray(data.video)) {
          parsedResults = data.video;
        }
      }

      if (parsedResults.length > 0) {
        const normalized = parsedResults.map(item => {
          if (!item) return null;
          return {
            ...item,
            videoId: item.videoId || item.id,
            title: item.title || "Untitled Video",
            thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400",
            duration: item.duration || "N/A",
            views: item.views || "0",
            channelTitle: item.channelTitle || item.author || "YouTube Channel",
            published: item.published || item.uploaded || ""
          };
        }).filter(Boolean) as YouTubeVideo[];

        setVideos(normalized);
        playSound("success");
      } else {
        setErrorMsg("No videos found. Try a different query.");
        playSound("beep");
      }
    } catch (err: any) {
      setErrorMsg("Decryption Node Offline. Verify network configuration.");
      playSound("beep");
    } finally {
      setIsLoading(false);
    }
  };

  // Unlimited Load More Channels Handler
  const handleLoadMore = async () => {
    if (loadMoreLoading) return;
    setLoadMoreLoading(true);
    playSound("laser");

    const suffixes = [
      " music", " song", " remix", " live", " 4k", " official", " audio", " status", 
      " lofi", " bass boosted", " unplugged", " instrumental", " cover", " video"
    ];

    const suffix = suffixes[loadMoreIndex % suffixes.length];
    const nextQuery = `${activeQuery}${suffix}`;
    
    try {
      let data;
      try {
        const res = await fetch(`/api/downloader/search?query=${encodeURIComponent(nextQuery)}`);
        if (!res.ok) throw new Error("Local load more API failed");
        data = await res.json();
      } catch (e) {
        console.warn("Local load more failed, falling back to public search API", e);
        const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(nextQuery)}`);
        data = await res.json();
      }
      
      let parsedResults: YouTubeVideo[] = [];
      if (data) {
        if (Array.isArray(data)) {
          parsedResults = data;
        } else if (data.results && Array.isArray(data.results)) {
          parsedResults = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          parsedResults = data.data;
        } else if (data.video && Array.isArray(data.video)) {
          parsedResults = data.video;
        }
      }

      if (parsedResults.length > 0) {
        const normalized = parsedResults.map(item => {
          if (!item) return null;
          return {
            ...item,
            videoId: item.videoId || item.id,
            title: item.title || "Untitled Video",
            thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400",
            duration: item.duration || "N/A",
            views: item.views || "0",
            channelTitle: item.channelTitle || item.author || "YouTube Channel",
            published: item.published || item.uploaded || ""
          };
        }).filter(Boolean) as YouTubeVideo[];

        setVideos(prev => {
          const existingIds = new Set(prev.map(v => v.videoId || v.id));
          const newUniqueVideos = normalized.filter(v => !existingIds.has(v.videoId || v.id));
          return [...prev, ...newUniqueVideos];
        });

        setLoadMoreIndex(prev => prev + 1);
        playSound("success");
      } else {
        setLoadMoreIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error("Failed loading more videos:", err);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  // 2. Real-time Infinite Scroll Event Listener hook
  useEffect(() => {
    const handleScroll = () => {
      if (showSplash) return;
      if (loadMoreLoading) return;

      // Extract window/document viewport and scrolling values cross-browser safely
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;

      // Trigger loadMore early (800px threshold before hitting absolute bottom)
      if (scrollHeight - scrollTop - clientHeight < 800) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Perform an initial trigger check in case the content does not fill screen yet
    const initCheck = setTimeout(() => {
      handleScroll();
    }, 1500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(initCheck);
    };
  }, [showSplash, loadMoreLoading, activeQuery, loadMoreIndex]);

  // Run SaveTube Decrypt Link generation
  const handleDecrypt = async () => {
    if (!selectedVideo) return;
    setIsDecrypting(true);
    setDecryptProgress(0);
    setDecryptLogs([]);
    setDownloadUrl(null);
    playSound("laser");

    // Decryption status logs animation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setDecryptProgress(currentProgress);

      const logIndex = Math.floor((currentProgress / 100) * DECRYPTION_STEP_LOGS.length);
      if (DECRYPTION_STEP_LOGS[logIndex] && !decryptLogs.includes(DECRYPTION_STEP_LOGS[logIndex])) {
        setDecryptLogs(prev => [...prev, DECRYPTION_STEP_LOGS[logIndex]]);
        playSound("tick");
      }
    }, 180);

    try {
      const targetUrl = `https://www.youtube.com/watch?v=${selectedVideo.videoId || selectedVideo.id || ""}`;
      let responseJson;
      try {
        const res = await fetch(`/api/downloader/download?url=${encodeURIComponent(targetUrl)}&format=${selectedFormat}`);
        if (!res.ok) throw new Error("Local download API failed");
        responseJson = await res.json();
      } catch (e) {
        console.warn("Local download failed, falling back to public download API", e);
        const res = await fetch(`https://apis.davidcyriltech.my.id/download/savetube?url=${encodeURIComponent(targetUrl)}&format=${selectedFormat}`);
        responseJson = await res.json();
      }

      // Wait for progress animation to complete
      setTimeout(() => {
        if (responseJson && responseJson.success && responseJson.data?.download_url) {
          setDownloadUrl(responseJson.data.download_url);
          playSound("success");
        } else {
          setErrorMsg("Bypass nodes returned failed response. Try another quality.");
          setIsDecrypting(false);
          playSound("beep");
        }
      }, 1600);

    } catch (err) {
      setTimeout(() => {
        setErrorMsg("Failed to communicate with decrypted payload nodes.");
        setIsDecrypting(false);
        playSound("beep");
      }, 1600);
    } finally {
      setTimeout(() => {
        setIsDecrypting(false);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[#050402] text-slate-100 flex flex-col justify-between overflow-x-hidden relative select-none font-sans">
      
      <AnimatePresence mode="wait">
        {showSplash ? (
          /* GLORIOUS PROFESSIONAL HACKER SPLASH SCREEN */
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#040301] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.35] z-0" />

            {/* Cyber scanlines and glowing matrix overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.95))] pointer-events-none z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />

            {/* Ambient gold glow backdrops */}
            <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-amber-500/[0.08] blur-[100px] sm:blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-yellow-500/[0.06] blur-[120px] sm:blur-[160px] pointer-events-none" />

            {/* Glowing gold laser scan indicator */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent shadow-[0_0_20px_rgba(251,191,36,0.6)] pointer-events-none z-20"
            />

            {/* Hacker Decrypter Dialogue Box */}
            <motion.div 
              initial={{ rotateY: -6, scale: 0.95 }}
              animate={{ rotateY: 6, scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}
              className="relative z-30 max-w-lg w-full bg-[#090805]/95 border-2 border-[#ffd700]/30 rounded-3xl p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.95),_0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-md"
            >
              {/* Rotating radar graphic rings */}
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/40 animate-spin" style={{ animationDuration: "10s" }} />
                <div className="absolute inset-2 rounded-full border-2 border-double border-[#ffd700]/30 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
                
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] z-10">
                  <Terminal className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Status Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                  <span className="text-[9px] font-mono text-amber-400 font-black tracking-widest uppercase">BYPASS PROTOCOL ONLINE</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-cyber font-black tracking-widest text-slate-100 uppercase mt-3">
                  MKMODZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-100">CYBER DECRYPTER</span>
                </h1>
                <p className="text-[10px] font-mono text-amber-500/50 uppercase tracking-[0.25em] mt-1 font-bold">HIGH-SPEED STREAM BYPASS</p>
              </div>

              {/* Progress HUD bar */}
              <div className="mt-8 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono font-black text-amber-400 tracking-wider">
                  <span>OVERRIDING RATE LIMITS...</span>
                  <span className="bg-amber-500/10 px-2 py-0.5 rounded text-[#ffd700]">{splashProgress}%</span>
                </div>
                
                <div className="w-full h-3 bg-black/90 border-2 border-amber-500/20 rounded-full overflow-hidden relative shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                    style={{ width: `${splashProgress}%` }}
                  />
                </div>
              </div>

              {/* Hacker terminal log streams */}
              <div className="mt-6 border-2 border-amber-500/20 bg-[#060502]/85 p-3.5 rounded-2xl h-28 overflow-hidden text-left font-mono text-[9px] text-[#ffd700]/70 uppercase tracking-wider space-y-1 select-none shadow-inner">
                {splashLogs.map((log, index) => (
                  <div key={index} className="flex items-center gap-1.5 font-bold animate-pulse">
                    <span className="text-amber-500 font-extrabold">&gt; [SYS]</span>
                    <span className="truncate">{log}</span>
                  </div>
                ))}
              </div>

              {/* Direct Bypass Access */}
              <button 
                onClick={() => {
                  setShowSplash(false);
                  playSound("success");
                  try { SoundCore.stopSpaceHum(); } catch (e) {}
                }}
                className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500 hover:to-yellow-500 text-amber-400 hover:text-slate-950 border-2 border-amber-500/30 hover:border-amber-400 rounded-2xl text-[10px] font-mono font-black tracking-widest transition duration-200 uppercase cursor-pointer"
              >
                BYPASS SPLASH SEQUENCE
              </button>

            </motion.div>
          </motion.div>
        ) : (
          /* PREMIUM PURE YOUTUBE STYLE UI */
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto px-4 py-3 md:py-4 space-y-5 relative z-30"
          >
            {/* TOP BANNER IMAGE */}
            <div className="relative w-full h-28 sm:h-44 rounded-3xl overflow-hidden border-2 border-amber-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_20px_rgba(245,158,11,0.1)] group">
              <img 
                src={bannerImgSrc} 
                alt="MKMODZ Decryption Banner" 
                onError={handleBannerImageError}
                className="w-full h-full object-cover opacity-85 object-center transition duration-500 group-hover:scale-[1.02]"
              />
              {/* Shading overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040301] via-transparent to-black/35" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040301]/75 via-transparent to-[#040301]/40" />
              
              {/* Badge Overlay */}
              <div className="absolute top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-amber-500/35 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-[8.5px] font-mono text-amber-400 font-black tracking-widest uppercase">NODE ACTIVE</span>
              </div>
            </div>

            {/* MKMODZ BRANDING HEADER */}
            <header className="flex items-center justify-between gap-4 border-b border-amber-500/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#ffd700]/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,215,0,0.25)]">
                  <Play className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                </div>
                <div>
                  <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 font-cyber font-black tracking-widest text-lg sm:text-2xl leading-none uppercase">
                    MKMODZ VIDEO DOWNLOADER
                  </h1>
                  <p className="text-[9px] font-mono text-amber-500/50 uppercase tracking-widest font-black mt-1">
                    HIGH-SPEED MULTI-THREADED CYBER DECRYPTION CORE
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Help Manual Button */}
                <button 
                  onClick={() => { setShowWelcomeDialog(true); playSound("success"); }}
                  className="p-2 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/25 rounded-xl text-amber-400 transition cursor-pointer flex items-center justify-center"
                  title="Show System Decrypter Manual"
                >
                  <HelpCircle className="w-4.5 h-4.5" />
                </button>

                {/* Mute toggle button */}
                <button 
                  onClick={toggleMute}
                  className="p-2 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400 rounded-xl text-amber-400 transition cursor-pointer flex items-center justify-center gap-1.5"
                  title={isMuted ? "Unmute Sound" : "Mute Sound"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
                </button>
              </div>
            </header>

            {/* MAIN CORE BODY SEARCH & THEATER CONTROLLER */}
            <div className="space-y-5">
              
              {/* SEARCH BOX MODULE */}
              <div className="bg-[#0a0702] border-2 border-amber-500/25 p-4 rounded-3xl shadow-2xl backdrop-blur-md">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow flex items-center bg-black/80 border-2 border-amber-500/60 hover:border-amber-400 focus-within:border-amber-400 rounded-2xl px-4 transition duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] focus-within:shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                    <Search className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter search keywords or paste video URL..."
                      className="w-full bg-transparent py-4 text-xs font-mono text-yellow-100 uppercase tracking-wider outline-none placeholder-amber-500/20 focus:ring-0"
                    />
                    {searchQuery && (
                      <button 
                        type="button"
                        onClick={() => { setSearchQuery(""); playSound("tick"); }}
                        className="text-amber-500/40 hover:text-amber-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-cyber text-xs font-black tracking-widest rounded-2xl transition shadow-[0_4px_20px_rgba(245,158,11,0.25)] uppercase cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        <span>INTERCEPTING...</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-4 h-4 text-slate-950" />
                        <span>DECRYPT VIDEO</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* ERROR NOTIFIER */}
              {errorMsg && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-[10px] py-3.5 px-4 rounded-xl text-center font-bold tracking-widest uppercase relative">
                  <span>❌ {errorMsg}</span>
                  <button 
                    onClick={() => setErrorMsg(null)}
                    className="absolute right-3 top-2.5 text-red-400/60 hover:text-red-300 p-1 font-black"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* SELECTED THEATER DETAIL / BYPASS PANEL */}
              <AnimatePresence>
                {selectedVideo && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-b from-[#0c0a05] to-[#040301] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
                      <div className="flex items-center justify-between border-b border-amber-500/10 pb-3">
                        <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                          active decryption pipeline
                        </span>
                        
                        <button 
                          onClick={() => { setSelectedVideo(null); setDownloadUrl(null); setIsPlaying(false); playSound("tick"); }}
                          className="p-1 text-amber-400/40 hover:text-amber-400 rounded-lg hover:bg-amber-500/10 transition cursor-pointer font-mono text-[9px] uppercase tracking-wider flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Close Theater</span>
                        </button>
                      </div>

                      {/* Video Info Structure */}
                      <div className="flex flex-col md:flex-row gap-5">
                        {/* Custom visual video box / Player */}
                        <div className="w-full md:w-2/5 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-amber-500/35 relative group shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                          {isPlaying ? (
                            <iframe 
                              src={`https://www.youtube.com/embed/${selectedVideo?.videoId || selectedVideo?.id}?autoplay=1&mute=0`}
                              title={selectedVideo?.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <>
                              <img 
                                src={selectedVideo?.thumbnail || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400"} 
                                alt="thumbnail" 
                                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => { setIsPlaying(true); playSound("success"); }}
                                  className="w-14 h-14 bg-amber-500 hover:bg-yellow-400 text-slate-950 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] transition duration-200 transform hover:scale-110 active:scale-95 cursor-pointer border-none"
                                >
                                  <Play className="w-6 h-6 fill-slate-950 ml-1 text-slate-950" />
                                </button>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                              <div className="absolute bottom-2 right-2 bg-black/80 text-yellow-400 text-[8px] font-mono px-2 py-0.5 rounded font-black">
                                {selectedVideo?.duration || "N/A"}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Formatting controls & stats */}
                        <div className="flex-grow flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-black uppercase">
                              Channel: {selectedVideo?.channelTitle || selectedVideo?.author || "YouTube Contributor"}
                            </span>
                            <h4 className="font-cyber font-black text-sm sm:text-base text-white uppercase tracking-wider leading-snug">
                              {selectedVideo?.title || "Untitled Video"}
                            </h4>
                            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                              METRICS: {typeof selectedVideo?.views === "number" ? selectedVideo.views.toLocaleString() : (selectedVideo?.views || "0")} VIEWS • {selectedVideo?.published || selectedVideo?.uploaded || "STABLE DATE"}
                            </p>
                          </div>

                          {/* Quality Selector */}
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-amber-500/50 uppercase tracking-widest font-black block">SELECT DECRYPTION PAYLOAD QUALITY</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { id: "mp3", label: "🎵 MP3 AUDIO" },
                                { id: "360", label: "🎞 360P SD" },
                                { id: "720", label: "🎞 720P HD" },
                                { id: "1080", label: "🎞 1080P FULL HD" }
                              ].map((fmt) => (
                                <button
                                  key={fmt.id}
                                  type="button"
                                  onClick={() => { setSelectedFormat(fmt.id); playSound("tick"); }}
                                  className={`py-3 px-1 rounded-xl text-[9px] sm:text-[10px] font-mono font-black tracking-wider uppercase border transition duration-250 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                    selectedFormat === fmt.id 
                                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.45)]" 
                                      : "bg-black/60 border-amber-500/25 text-amber-400 hover:border-amber-400"
                                  }`}
                                >
                                  <span>{fmt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive generator screen */}
                      <div className="pt-4 border-t border-amber-500/10">
                        {isDecrypting ? (
                          <div className="space-y-3 bg-black/60 p-4 rounded-2xl border border-amber-500/10">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                              <span>GENERATING DOWNLINK PAYLOAD...</span>
                              <span>{decryptProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-amber-500/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-300" style={{ width: `${decryptProgress}%` }}></div>
                            </div>
                            <div className="h-10 overflow-hidden font-mono text-[8px] text-amber-500/50 uppercase space-y-0.5">
                              {decryptLogs.map((log, idx) => (
                                <div key={idx} className="truncate">✔ {log}</div>
                              ))}
                            </div>
                          </div>
                        ) : downloadUrl ? (
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                          >
                            <div>
                              <span className="text-[8px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-black uppercase">Decrypted Link Loaded</span>
                              <h5 className="font-cyber font-black text-xs text-white uppercase mt-1">GOLD STREAM READY FOR EXTRACTION</h5>
                            </div>
                            
                            <a 
                              href={`/api/downloader/proxy-file?url=${encodeURIComponent(downloadUrl)}&title=${encodeURIComponent(selectedVideo?.title || "download")}&format=${selectedFormat}`} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={() => playSound("success")}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-cyber text-[10px] font-black tracking-widest rounded-xl transition shadow-[0_4px_15px_rgba(16,185,129,0.3)] uppercase flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-950" />
                              <span>Download file Now</span>
                            </a>
                          </motion.div>
                        ) : (
                          <button 
                            onClick={handleDecrypt}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-cyber font-black text-xs tracking-widest rounded-2xl transition shadow-[0_4px_15px_rgba(245,158,11,0.25)] uppercase flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Lock className="w-4 h-4 text-slate-950" />
                            <span>GENERATE GOLD DOWNLINK URL</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* VIDEO GRID MODULE: EXACTLY 2 VIDEOS IN A ROW (STRICT grid-cols-2) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                  <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
                    DISCOVERY NODES & DECRYPTER RADAR
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {videos.filter(Boolean).map((vid, idx) => {
                    const vidId = vid?.videoId || vid?.id || `video-${idx}`;
                    const vidThumbnail = vid?.thumbnail || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400";
                    const vidDuration = vid?.duration || "N/A";
                    const vidTitle = vid?.title || "Untitled Video";
                    const vidChannel = vid?.channelTitle || vid?.author || "YouTube Channel";
                    
                    return (
                      <div 
                        key={vidId}
                        className="bg-[#0a0702]/60 border border-amber-500/10 hover:border-[#ffd700]/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition duration-200 group relative"
                      >
                        {/* Video Thumbnail Box */}
                        <div className="aspect-video relative bg-black overflow-hidden">
                          <img 
                            src={vidThumbnail} 
                            alt="thumbnail" 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-yellow-400 text-[8px] font-mono px-1.5 py-0.5 rounded font-black">
                            {vidDuration}
                          </div>
                        </div>

                        {/* Video Metadata Box */}
                        <div className="p-3.5 flex-grow flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <span className="block text-[7px] font-mono text-amber-400/60 uppercase truncate font-extrabold tracking-wider">
                              {vidChannel}
                            </span>
                            <h3 className="font-cyber font-black text-[10px] sm:text-xs text-slate-200 line-clamp-2 uppercase tracking-wide leading-snug">
                              {vidTitle}
                            </h3>
                          </div>

                          <button 
                            onClick={() => { setSelectedVideo(vid); setDownloadUrl(null); setIsPlaying(false); playSound("tick"); }}
                            className="w-full py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/15 rounded-xl font-mono font-black text-[9px] tracking-wider uppercase transition cursor-pointer"
                          >
                            GET VIDEO
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* ENDLESS SCROLL FEED STATUS INDICATOR */}
                <div className="pt-6 flex justify-center">
                  <div className="py-3.5 px-8 bg-amber-500/5 border border-amber-500/10 rounded-2xl font-cyber text-[10px] font-black tracking-widest text-amber-400/60 uppercase flex items-center gap-2">
                    {loadMoreLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>SCROLLING FOR ENDLESS SONGS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>SCROLL DOWN TO DISCOVER INFINITE VIDEOS</span>
                      </>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* GORGEOUS BRANDED FOOTER */}
            <footer className="mt-12 text-center text-[8px] font-mono text-amber-500/30 uppercase tracking-[0.25em] font-extrabold flex flex-col gap-1.5 items-center">
              <div className="flex items-center gap-1.5 text-amber-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>ULTRA GOLD HIGH SPEED TUNNEL DECRYPTOR ONLINE</span>
              </div>
              <div>DEVELOPED FOR MKMODZ • POWERED BY DAVIDCYRILTECH API</div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      <WelcomeDialog 
        isOpen={showWelcomeDialog}
        onClose={() => setShowWelcomeDialog(false)}
        playSound={playSound}
      />
    </div>
  );
}
