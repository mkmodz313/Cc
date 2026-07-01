/**
 * ULTRA FAST STANDALONE YOUTUBE DOWNLINK & AUDIO DECRYPTER
 * Standard Vanilla JS Core - Designed for Static and Free Hosting Platforms (Hop, InfinityFree, GitHub Pages, etc.)
 */

// Global App State
const state = {
  isMuted: false,
  searchQuery: "",
  searchResults: [],
  selectedVideo: null,
  selectedFormat: "720",
  isDecrypting: false,
  decryptionProgress: 0,
  downloadUrl: null,
  errorMsg: "",
  stats: {
    total_users: 1248,
    total_downloads: 3892
  }
};

// Web Audio Synth Core (Saves loading external MP3 files)
const SoundCore = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  playTick() {
    if (state.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  },

  playBeep() {
    if (state.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  },

  playLaserSweep() {
    if (state.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  },

  playSuccessLaser() {
    if (state.isMuted) return;
    this.init();
    try {
      // Harmonic twin oscillators for sci-fi victory splash
      const t = this.ctx.currentTime;
      [800, 1000, 1200].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + idx * 0.08 + 0.2);
        gain.gain.setValueAtTime(0.02, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.00001, t + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }
};

// Seed/Discovery Radar Trends
const trendingVideos = [
  { videoId: "jfKfPfyJRdk", title: "Lofi Hip Hop Radio 📚 Beats to Study/Relax to", duration: "LIVE", views: "18M views", thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400", channelTitle: "Lofi Girl" },
  { videoId: "5qap5aO4i9A", title: "Lofi Hip Hop Radio - Beats to Study/Relax to 🐾", duration: "24:15", views: "2.1M views", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400", channelTitle: "Relax Hub" },
  { videoId: "tNtMyXbBfF0", title: "Synthwave Retrofuture Mix: Cosmic Highway", duration: "1:05:22", views: "890K views", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400", channelTitle: "Retro Highway" },
  { videoId: "36YnV9Sby_Y", title: "4K Cinematic Space Ambient Odyssey", duration: "3:40:00", views: "1.2M views", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400", channelTitle: "Space Odyssey" }
];

// YouTube URL parser
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Format duration helper
function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);
  const hDisplay = h > 0 ? h + ":" : "";
  const mDisplay = m < 10 && h > 0 ? "0" + m + ":" : m + ":";
  const sDisplay = s < 10 ? "0" + s : s;
  return hDisplay + mDisplay + sDisplay;
}

// Generate Funny Hacker terminal Logs
const hackerLogs = [
  "INITIALIZING GOLD BYPASS ENGINE...",
  "ESTABLISHING SECURE SSH TUNNELS...",
  "OVERRIDING GOOGLE DISCOVERY RATE LIMITS...",
  "SPOOFING USER-AGENT NODE HEADERS...",
  "INTERCEPTING DATA STREAM BLOCK ARRAYS...",
  "CONSTRUCTING DECRYPTION METRIC KEYS...",
  "READY FOR MULTI-THREAD STREAM INTERRUPT."
];

// Initialize UI Elements & Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  setupStats();
  initSplashSequence();
  initMainApp();
});

// Setup Simulated Persistence stats
function setupStats() {
  const stored = localStorage.getItem("mkmodz_stats");
  if (stored) {
    state.stats = JSON.parse(stored);
  } else {
    state.stats.total_users = Math.floor(Math.random() * 500) + 1200;
    state.stats.total_downloads = Math.floor(Math.random() * 2000) + 3800;
    localStorage.setItem("mkmodz_stats", JSON.stringify(state.stats));
  }
  updateStatsUI();
}

function updateStatsUI() {
  const activeNodes = document.getElementById("active-nodes-stat");
  const footerStats = document.getElementById("footer-stats");
  if (activeNodes) activeNodes.innerText = `ACTIVE DECRYPTERS: ${state.stats.total_users.toLocaleString()}`;
  if (footerStats) footerStats.innerText = `TOTAL INTERCEPTS: ${state.stats.total_downloads.toLocaleString()}`;
}

// Matrix rain splash logic
function initSplashSequence() {
  const splash = document.getElementById("splash-screen");
  const canvas = document.getElementById("matrix-canvas");
  if (!canvas || !splash) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = "01010101MKMODZHACKERDECRYPTERSYSTEMBYPASS666";
  const charArr = chars.split("");
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const rainDrops = Array(Math.floor(columns)).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(4, 3, 1, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fbbf24";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < rainDrops.length; i++) {
      const text = charArr[Math.floor(Math.random() * charArr.length)];
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  }

  const matrixInterval = setInterval(drawMatrix, 33);
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Log streams
  const logStream = document.getElementById("log-stream");
  let logIdx = 0;
  
  function addLogLine() {
    if (!logStream) return;
    if (logIdx < hackerLogs.length) {
      const p = document.createElement("div");
      p.className = "flex items-center gap-1.5 font-bold animate-pulse text-amber-400";
      p.innerHTML = `<span class="text-amber-500 font-extrabold">&gt; [SYS]</span> <span class="truncate">${hackerLogs[logIdx]}</span>`;
      logStream.appendChild(p);
      logStream.scrollTop = logStream.scrollHeight;
      logIdx++;
    }
  }

  const logInterval = setInterval(addLogLine, 400);

  // Counter Progress
  const progressText = document.getElementById("splash-progress-text");
  const progressBar = document.getElementById("splash-progress-bar");
  let progress = 0;

  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      clearInterval(matrixInterval);
      clearInterval(logInterval);
      
      // Auto transition
      setTimeout(() => {
        dismissSplash();
      }, 300);
    }
    if (progressText) progressText.innerText = `${progress}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;
  }, 100);

  // Bypass button click
  const bypassBtn = document.getElementById("bypass-splash-btn");
  if (bypassBtn) {
    bypassBtn.addEventListener("click", () => {
      clearInterval(progressInterval);
      clearInterval(matrixInterval);
      clearInterval(logInterval);
      dismissSplash();
    });
  }

  function dismissSplash() {
    SoundCore.playSuccessLaser();
    splash.classList.add("opacity-0", "scale-105");
    setTimeout(() => {
      splash.style.display = "none";
    }, 600);
  }
}

// Main App Logic
function initMainApp() {
  // Sound Mute Toggle
  const muteBtn = document.getElementById("mute-toggle-btn");
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      state.isMuted = !state.isMuted;
      SoundCore.playTick();
      if (state.isMuted) {
        muteBtn.innerHTML = `<i class="fas fa-volume-mute text-amber-500/50"></i>`;
      } else {
        muteBtn.innerHTML = `<i class="fas fa-volume-up text-amber-400"></i>`;
      }
    });
  }

  // Help Dialog Actions
  const helpBtn = document.getElementById("help-btn");
  const closeHelpBtn = document.getElementById("close-help-btn");
  const welcomeDialog = document.getElementById("welcome-dialog");
  const dialogConfirmBtn = document.getElementById("dialog-confirm-btn");

  if (helpBtn && welcomeDialog) {
    helpBtn.addEventListener("click", () => {
      SoundCore.playSuccessLaser();
      welcomeDialog.classList.remove("hidden");
    });
  }
  if (closeHelpBtn && welcomeDialog) {
    closeHelpBtn.addEventListener("click", () => {
      SoundCore.playTick();
      welcomeDialog.classList.add("hidden");
    });
  }
  if (dialogConfirmBtn && welcomeDialog) {
    dialogConfirmBtn.addEventListener("click", () => {
      SoundCore.playSuccessLaser();
      welcomeDialog.classList.add("hidden");
    });
  }

  // Populate Default Discovery Radar
  renderVideoGrid(trendingVideos, "trending-grid");

  // Search Submit Handler
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchBtnText = document.getElementById("search-btn-text");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      SoundCore.playLaserSweep();
      const query = searchInput.value.trim();
      if (!query) return;

      // Handle direct youtube link pasting
      const ytId = extractVideoId(query);
      if (ytId) {
        // Direct bypass detail interception
        searchInput.value = "";
        openInterceptionModal({
          videoId: ytId,
          title: "Intercepted Link: Fetching Title...",
          thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
          duration: "STREAM",
          views: "Unknown",
          channelTitle: "YouTube Stream"
        });
        return;
      }

      // Perform regular API Search
      searchBtnText.innerText = "BYPASSING...";
      showError("");

      try {
        const response = await fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Search network failure.");
        const json = await response.json();
        
        if (json && json.status && json.results && json.results.length > 0) {
          SoundCore.playSuccessLaser();
          // Render results
          renderVideoGrid(json.results, "search-results-grid");
          document.getElementById("search-results-section").classList.remove("hidden");
          // Smooth scroll to results
          document.getElementById("search-results-section").scrollIntoView({ behavior: "smooth" });
        } else {
          showError("No video streams intercepted on this keyword. Try another.");
        }
      } catch (err) {
        showError("Intercept server failure. Checking fallbacks...");
        // Use matching subset of trending as mock fallback
        renderVideoGrid(trendingVideos, "search-results-grid");
        document.getElementById("search-results-section").classList.remove("hidden");
      } finally {
        searchBtnText.innerText = "DECRYPT VIDEO";
      }
    });
  }
}

// Render video elements cleanly
function renderVideoGrid(videos, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = "";

  videos.forEach(video => {
    // Standardize variables
    const id = video.videoId || video.id;
    const title = video.title || "Unknown Intercepted Stream";
    const duration = video.duration || "LIVE";
    const views = video.views || "N/A Views";
    const author = video.channelTitle || "YouTube Node";
    const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

    const card = document.createElement("div");
    card.className = "bg-[#0c0a05]/60 border border-yellow-500/10 hover:border-yellow-500/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition duration-200 group relative";
    card.innerHTML = `
      <div class="aspect-video relative bg-black overflow-hidden">
        <img src="${thumbnail}" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300" referrerpolicy="no-referrer">
        <div class="absolute bottom-2 right-2 bg-black/80 text-yellow-400 text-[8px] font-mono px-1.5 py-0.5 rounded font-black">${duration}</div>
      </div>
      <div class="p-3.5 flex-grow flex flex-col justify-between gap-3">
        <div>
          <h3 class="font-bold text-[10.5px] sm:text-xs text-slate-200 line-clamp-2 uppercase tracking-wide leading-snug">${title}</h3>
          <p class="text-[8.5px] font-mono text-yellow-500/50 uppercase mt-1 truncate">${author}</p>
        </div>
        <button class="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500 hover:text-slate-950 text-yellow-400 border border-yellow-500/15 rounded-lg font-mono font-black text-[9px] tracking-wider uppercase transition cursor-pointer select-video-btn">
          GET VIDEO
        </button>
      </div>
    `;

    // Hook click action
    card.querySelector(".select-video-btn").addEventListener("click", () => {
      SoundCore.playLaserSweep();
      openInterceptionModal({ videoId: id, title, thumbnail, duration, views, channelTitle: author });
    });

    grid.appendChild(card);
  });
}

// Open Interception / Download details panel
function openInterceptionModal(video) {
  state.selectedVideo = video;
  state.downloadUrl = null;
  state.errorMsg = "";
  
  const modal = document.getElementById("decryption-modal");
  if (!modal) return;

  // Render elements
  document.getElementById("modal-thumb").src = video.thumbnail;
  document.getElementById("modal-duration").innerText = video.duration;
  document.getElementById("modal-title").innerText = video.title;
  document.getElementById("modal-channel").innerText = `CHANNEL: ${video.channelTitle}`;
  document.getElementById("modal-views").innerText = `VIEWS: ${video.views}`;

  // Reset progress state
  document.getElementById("modal-progress-container").classList.add("hidden");
  document.getElementById("modal-download-actions").classList.add("hidden");
  document.getElementById("modal-primary-action").classList.remove("hidden");
  document.getElementById("modal-error").classList.add("hidden");

  // Show Modal
  modal.classList.remove("hidden");
  modal.scrollIntoView({ behavior: "smooth" });

  // Clear previous format selection
  const formatSelector = document.getElementById("format-selector");
  if (formatSelector) {
    formatSelector.value = "720";
    state.selectedFormat = "720";
  }
}

// Setup Event Listeners for inside the decryption modal
document.getElementById("close-modal-btn").addEventListener("click", () => {
  SoundCore.playTick();
  document.getElementById("decryption-modal").classList.add("hidden");
  state.selectedVideo = null;
});

// Selector change
const formatSelector = document.getElementById("format-selector");
if (formatSelector) {
  formatSelector.addEventListener("change", (e) => {
    state.selectedFormat = e.target.value;
    SoundCore.playTick();
  });
}

// Trigger Decryption & Sequential Fallback Link Download!
const startDecryptionBtn = document.getElementById("start-decryption-btn");
if (startDecryptionBtn) {
  startDecryptionBtn.addEventListener("click", async () => {
    if (!state.selectedVideo) return;
    SoundCore.playLaserSweep();

    // UI state
    document.getElementById("modal-primary-action").classList.add("hidden");
    document.getElementById("modal-progress-container").classList.remove("hidden");
    document.getElementById("modal-error").classList.add("hidden");

    const progressBar = document.getElementById("decrypt-progress-bar");
    const progressText = document.getElementById("decrypt-progress-percent");
    const statusText = document.getElementById("decrypt-status-text");

    // Start progress simulation
    let progress = 0;
    const statusMsgs = [
      "BYPASSING RATE FILTERS...",
      "TUNNELING CORE SECURITY NODES...",
      "REBUILDING STREAM BUFFER BLOCKS...",
      "SPOOFING STREAM METADATA...",
      "REPLICATING DOWNLINK HEADERS..."
    ];

    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      
      progressBar.style.width = `${progress}%`;
      progressText.innerText = `${progress}%`;
      statusText.innerText = statusMsgs[Math.floor(progress / 21)] || "FINALIZING GOLD DECRYPTER LINK...";
    }, 150);

    // Call SaveTube API with sequential format fallback loop
    const targetUrl = `https://www.youtube.com/watch?v=${state.selectedVideo.videoId}`;
    let finalDownloadUrl = null;
    let actualFormatUsed = state.selectedFormat;

    // Define sequential formats to try on failure
    const formatFallbacks = state.selectedFormat === "mp3" 
      ? ["mp3", "128", "320", "360", "720"] 
      : [state.selectedFormat, "720", "360", "1080", "mp3"];

    for (const format of formatFallbacks) {
      try {
        const apiTarget = `https://apis.davidcyriltech.my.id/download/savetube?url=${encodeURIComponent(targetUrl)}&format=${format}`;
        const response = await fetch(apiTarget);
        if (response.ok) {
          const resJson = await response.json();
          if (resJson && resJson.success && resJson.data && resJson.data.download_url) {
            finalDownloadUrl = resJson.data.download_url;
            actualFormatUsed = format;
            break; // Found working link!
          }
        }
      } catch (err) {
        console.warn(`Format fallback ${format} failed to fetch:`, err);
      }
    }

    // Wait until progress counter reaches 100% to keep experience exciting
    while (progress < 100) {
      await new Promise(r => setTimeout(r, 100));
    }

    if (finalDownloadUrl) {
      SoundCore.playSuccessLaser();
      state.downloadUrl = finalDownloadUrl;

      // Increment persistent stats
      state.stats.total_downloads++;
      localStorage.setItem("mkmodz_stats", JSON.stringify(state.stats));
      updateStatsUI();

      // Show download button
      document.getElementById("modal-progress-container").classList.add("hidden");
      document.getElementById("modal-download-actions").classList.remove("hidden");

      const directDownloadBtn = document.getElementById("direct-download-btn");
      directDownloadBtn.href = finalDownloadUrl;
      
      // Auto trigger immediate download
      window.location.href = finalDownloadUrl;
    } else {
      SoundCore.playBeep();
      document.getElementById("modal-progress-container").classList.add("hidden");
      document.getElementById("modal-primary-action").classList.remove("hidden");
      
      const errorDiv = document.getElementById("modal-error");
      errorDiv.innerText = "Bypass node timed out. Please select another quality format and try again.";
      errorDiv.classList.remove("hidden");
    }
  });
}

// Error presentation
function showError(msg) {
  const errorDiv = document.getElementById("search-error");
  if (!errorDiv) return;
  if (msg) {
    errorDiv.innerText = msg.toUpperCase();
    errorDiv.classList.remove("hidden");
    SoundCore.playBeep();
  } else {
    errorDiv.classList.add("hidden");
  }
}
