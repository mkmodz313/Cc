import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Setup persistent storage dir for simulation counters safely (supporting read-only on Vercel)
const STORAGE_DIR = process.env.VERCEL ? "/tmp" : path.join(__dirname, "data");
try {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
} catch (e) {
  console.warn("Storage directory creation failed, falling back to memory:", e);
}

const DOWNLOADER_STATS_FILE = path.join(STORAGE_DIR, "downloader_stats.json");

function getDownloaderStats() {
  try {
    if (fs.existsSync(DOWNLOADER_STATS_FILE)) {
      return JSON.parse(fs.readFileSync(DOWNLOADER_STATS_FILE, "utf-8"));
    }
  } catch (e) {}
  return { total_users: 3942, total_downloads: 12458 };
}

function incrementDownloaderStat(type: "total_users" | "total_downloads") {
  try {
    const s = getDownloaderStats();
    s[type] = (s[type] || 0) + 1;
    fs.writeFileSync(DOWNLOADER_STATS_FILE, JSON.stringify(s, null, 2), "utf-8");
  } catch (e) {}
}

// 1. Stats Endpoint
app.get("/api/downloader/stats", (_req, res) => {
  res.json({ success: true, stats: getDownloaderStats() });
});

// 2. Standalone PHP Endpoint
app.get("/api/downloader/php-code", (_req, res) => {
  try {
    const phpPath = path.join(process.cwd(), "index.php");
    if (fs.existsSync(phpPath)) {
      const code = fs.readFileSync(phpPath, "utf-8");
      res.json({ success: true, code });
      return;
    } else {
      res.status(404).json({ success: false, error: "index.php file was not found on the server." });
      return;
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
    return;
  }
});

// 3. YouTube Decrypting Search Proxy API
app.get("/api/downloader/search", async (req, res) => {
  try {
    const query = req.query.query as string;
    if (!query) {
      res.status(400).json({ success: false, error: "Search query is required" });
      return;
    }

    incrementDownloaderStat("total_users");

    const searchUrl = `https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`External API returned status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
    return;
  } catch (error: any) {
    console.error("Downloader proxy search error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch search core." });
    return;
  }
});

// 4. Download Decryption Link Proxy API
app.get("/api/downloader/download", async (req, res) => {
  try {
    const { url, format } = req.query as { url: string; format: string };
    if (!url || !format) {
      res.status(400).json({ success: false, error: "URL and format are required" });
      return;
    }

    const apiTarget = `https://apis.davidcyriltech.my.id/download/savetube?url=${encodeURIComponent(url)}&format=${format}`;
    const response = await fetch(apiTarget, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Savetube API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data && data.success) {
      incrementDownloaderStat("total_downloads");
    }
    res.json(data);
    return;
  } catch (error: any) {
    console.error("Downloader decrypt error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate link." });
    return;
  }
});

// 5. High-Speed File Streaming Proxy
app.get("/api/downloader/proxy-file", (req, res) => {
  const fileUrl = req.query.url as string;
  const title = (req.query.title as string) || "download";
  const format = (req.query.format as string) || "mp3";

  if (!fileUrl) {
    res.status(400).send("Missing url parameter");
    return;
  }

  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
  const ext = format.toLowerCase() === "mp3" ? "mp3" : "mp4";
  
  res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${ext}"`);
  
  // Decide client based on URL protocol
  const client = fileUrl.startsWith("https") ? https : http;

  const request = client.get(fileUrl, (response: any) => {
    // Forward headers
    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    } else {
      res.setHeader("Content-Type", ext === "mp3" ? "audio/mpeg" : "video/mp4");
    }
    
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }

    response.pipe(res);
  });

  request.on("error", (err: any) => {
    console.error("Streaming proxy error, attempting redirection fallback:", err);
    res.redirect(fileUrl);
  });
});

// Integrate Vite as Middleware for Dev or serve static in Prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist", "public");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      app.get("*", (_req, res) => {
        res.send("Static dist/public directory not found. Please run npm run build.");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  setupViteOrStatic();
}

export default app;
