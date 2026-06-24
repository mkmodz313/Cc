import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import AdmZip from "adm-zip";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Setup Storage Directories
const STORAGE_DIR = path.join(process.cwd(), "sites");
const ARCHIVES_DIR = path.join(STORAGE_DIR, "archives");

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(ARCHIVES_DIR)) {
  fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
}

// Multer parsing engine for file uploads (keeps in memory to write systematically)
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB max limit

// Allowed file extensions
const ALLOWED_EXTS = [
  "html", "htm", "css", "js", "py", "php", "json", "xml", "txt", "md",
  "jpg", "jpeg", "png", "gif", "svg", "webp", "ico", "woff", "woff2",
  "ttf", "eot", "otf", "mp3", "mp4", "webm", "ogg", "wav", "pdf", "csv",
  "map", "webmanifest", "htaccess"
];

// Helper: Ensure slug is safe for filesystems
function generateSlug(text: string): string {
  let slug = text
    .replace(/[^\p{L}\d]+/gu, "-")
    .replace(/[^-\w]+/g, "")
    .trim()
    .toLowerCase();
  
  if (!slug) {
    slug = "signal-" + Math.floor(1000 + Math.random() * 9000);
  }
  return slug;
}

// Helper: Prevent directory traversal
function safePathResolve(slug: string, relPath: string): string {
  const root = path.join(STORAGE_DIR, slug);
  const target = path.resolve(root, relPath);
  if (!target.startsWith(root)) {
    throw new Error("Traversal detected: Security violation");
  }
  return target;
}

// Helper: Count nested files
function countFilesRecursively(dir: string): number {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return 0;
  let count = 0;
  const loop = (currentDir: string) => {
    const list = fs.readdirSync(currentDir);
    list.forEach(file => {
      const full = path.join(currentDir, file);
      if (fs.statSync(full).isDirectory()) {
        loop(full);
      } else {
        count++;
      }
    });
  };
  loop(dir);
  return count;
}

// Helper: Remove folder recursively
function deleteFolderRecursive(dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// Serve deployed user sites statically with proper MIME types
app.use("/sites", express.static(STORAGE_DIR, {
  setHeaders: (res, filepath) => {
    // Force index html parsing or custom headers if preferred
    if (filepath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (filepath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    }
  }
}));

// API: Get/Save Custom features for Terminal
const FEATURES_FILE = path.join(STORAGE_DIR, "features.json");
const DEFAULT_FEATURES = [
  {
    id: "default-1",
    name: "Aim Assist VIP Injector",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Aim Mods",
    status: "ACTIVE",
    description: "Direct server-side aim vector bypass with active noise reduction."
  },
  {
    id: "default-2",
    name: "ESP Wallhack Sensor",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Sensors",
    status: "ACTIVE",
    description: "Real-time radar overlay with distance tracking and health indicators."
  },
  {
    id: "default-3",
    name: "High Damage Bullet Bypass",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Bypass",
    status: "ACTIVE",
    description: "Bypasses gun spread, recoil control, and damage limits securely."
  },
  {
    id: "default-4",
    name: "Anti-Ban Shield v9",
    img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=400&auto=format&fit=crop",
    link: "https://whatsapp.com/channel/0029Vb7f4Wd7DAWv9jU7zW0m",
    category: "Security",
    status: "ACTIVE",
    description: "Activates advanced telemetry diagnostic blocking and anti-report layers."
  }
];

function readFeatures() {
  try {
    if (fs.existsSync(FEATURES_FILE)) {
      return JSON.parse(fs.readFileSync(FEATURES_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading features.json", e);
  }
  return DEFAULT_FEATURES;
}

function writeFeatures(features: any[]) {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    fs.writeFileSync(FEATURES_FILE, JSON.stringify(features, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error writing features.json", e);
    return false;
  }
}

app.get("/api/terminal/features", (req, res) => {
  res.json({ success: true, features: readFeatures() });
});

app.post("/api/terminal/features", (req, res) => {
  try {
    const { name, img, link, category, status, description } = req.body;
    if (!name || !link) {
      return res.status(400).json({ success: false, error: "Name and Link are required" });
    }
    const currentList = readFeatures();
    const newFeature = {
      id: "custom-" + Date.now(),
      name,
      img: img || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
      link,
      category: category || "Bypass",
      status: status || "ACTIVE",
      description: description || "User injected diagnostic bypass signature profile."
    };
    currentList.unshift(newFeature);
    writeFeatures(currentList);
    res.json({ success: true, features: currentList });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/terminal/features/:id", (req, res) => {
  try {
    const { id } = req.params;
    let currentList = readFeatures();
    currentList = currentList.filter((f: any) => f.id !== id);
    writeFeatures(currentList);
    res.json({ success: true, features: currentList });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/terminal/features/reset", (req, res) => {
  try {
    writeFeatures(DEFAULT_FEATURES);
    res.json({ success: true, features: DEFAULT_FEATURES });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get System Status metrics
app.get("/api/terminal/status", (req, res) => {
  try {
    const allMetas = fs.readdirSync(STORAGE_DIR).filter(f => f.endsWith(".meta.json"));
    let totalFilesCount = 0;
    
    // Sum total hosted file instances
    allMetas.forEach(metaName => {
      const slug = metaName.replace(".meta.json", "");
      totalFilesCount += countFilesRecursively(path.join(STORAGE_DIR, slug));
    });

    res.json({
      success: true,
      systemVersion: "9.0.0 ULTRA GOLDEN-NEXUS",
      totalDeploys: allMetas.length,
      globalFiles: totalFilesCount,
      adminPass: "MKMODZ@786",
      supportedLanguages: ["HTML", "CSS", "JavaScript", "Python", "PHP", "JSON", "XML", "Markdown"],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// WHATSAPP PAIRING & CREDENTIAL SESSION LINKER
// ==========================================

app.get("/api/whatsapp/status", (req, res) => {
  try {
    const creatorId = req.query.creatorId as string;
    if (!creatorId) {
      return res.status(400).json({ success: false, error: "Missing identity cadet parameter" });
    }
    const slug = generateSlug(creatorId);
    const sessionPath = path.join(STORAGE_DIR, `session_${slug}.json`);
    
    if (fs.existsSync(sessionPath)) {
      const data = JSON.parse(fs.readFileSync(sessionPath, "utf-8"));
      return res.json({ success: true, status: "connected", phone: data.phone, method: data.method });
    }
    res.json({ success: true, status: "disconnected" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/whatsapp/qr", (req, res) => {
  try {
    const creatorId = req.query.creatorId as string;
    if (!creatorId) {
      return res.status(400).json({ success: false, error: "Missing identity parameter" });
    }
    const token = generateSlug(creatorId) + "-" + Math.floor(100000 + Math.random() * 900000);
    const dataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://whatsapp.com/channel/0029Vb0JJaI5EjxpYI1YZC18?session=${token}`;
    res.json({ success: true, qr: dataUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/whatsapp/pair", (req, res) => {
  try {
    const { creatorId, phone } = req.body;
    if (!creatorId || !phone) {
      return res.status(400).json({ success: false, error: "Cadet ID and telephone are required" });
    }
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const formatted = code.slice(0, 4) + "-" + code.slice(4);
    res.json({ success: true, code: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/whatsapp/simulate-link", (req, res) => {
  try {
    const { creatorId, method, phone } = req.body;
    if (!creatorId) {
      return res.status(400).json({ success: false, error: "Missing creator ID" });
    }
    const slug = generateSlug(creatorId);
    const sessionPath = path.join(STORAGE_DIR, `session_${slug}.json`);
    
    fs.writeFileSync(sessionPath, JSON.stringify({
      status: "connected",
      phone: phone || "+92 300 0000000",
      method: method || "Simulation Linker",
      linkedAt: Date.now()
    }, null, 2));

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/whatsapp/unlink", (req, res) => {
  try {
    const { creatorId } = req.body;
    if (!creatorId) {
      return res.status(400).json({ success: false, error: "Missing creator ID" });
    }
    const slug = generateSlug(creatorId);
    const sessionPath = path.join(STORAGE_DIR, `session_${slug}.json`);
    
    if (fs.existsSync(sessionPath)) {
      fs.unlinkSync(sessionPath);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Load elite redesigned index.php source code
app.get("/api/terminal/php-source", (req, res) => {
  try {
    const phpPath = path.join(process.cwd(), "index.php");
    if (fs.existsSync(phpPath)) {
      const source = fs.readFileSync(phpPath, "utf-8");
      res.json({ success: true, source });
    } else {
      res.status(404).json({ success: false, error: "index.php not found on root disk!" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Load deployed sites
app.get("/api/terminal/sites", (req, res) => {
  try {
    const creatorId = req.query.creatorId as string;
    const isAdmin = req.query.isAdmin === "true";
    
    if (!fs.existsSync(STORAGE_DIR)) {
      return res.json({ success: true, sites: [] });
    }

    const files = fs.readdirSync(STORAGE_DIR);
    const sites: any[] = [];

    files.forEach(file => {
      if (file.endsWith(".meta.json")) {
        const slug = file.replace(".meta.json", "");
        const metaPath = path.join(STORAGE_DIR, file);
        try {
          const metaContent = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          
          // Filter based on ownership session unless Administrator overrides
          if (isAdmin || metaContent.creator_id === creatorId) {
            const hasZip = fs.existsSync(path.join(ARCHIVES_DIR, `${slug}.zip`));
            const zipSize = hasZip ? fs.statSync(path.join(ARCHIVES_DIR, `${slug}.zip`)).size : 0;
            const fileCount = countFilesRecursively(path.join(STORAGE_DIR, slug));
            
            sites.push({
              slug,
              creator: metaContent.creator_id,
              timestamp: metaContent.timestamp,
              date: new Date(metaContent.timestamp * 1000).toLocaleString(),
              type: metaContent.type || "web",
              status: metaContent.status || "extracted",
              originalName: metaContent.original_name || "",
              zipExists: hasZip,
              zipSize: zipSize,
              fileCount: fileCount,
              language: metaContent.language || "html"
            });
          }
        } catch (e) {
          console.error("Corrupted meta skipped:", file, e);
        }
      }
    });

    // Sort descending by deployment time
    sites.sort((a, b) => b.timestamp - a.timestamp);
    res.json({ success: true, sites });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Save raw code edit/deployment
app.post("/api/terminal/deploy-code", (req, res) => {
  try {
    const { alias, code, language, creatorId } = req.body;
    if (!alias || !code) {
      return res.status(400).json({ success: false, error: "Credentials / code content are required!" });
    }

    const slug = generateSlug(alias);
    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);

    // Verify ownership permissions
    if (fs.existsSync(metaPath)) {
      const existingMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (existingMeta.creator_id !== creatorId && req.body.isAdmin !== true) {
        return res.status(403).json({ success: false, error: `Security Error: Alias '${slug}' is owned by another cadet.` });
      }
    }

    const sitePath = path.join(STORAGE_DIR, slug);
    if (!fs.existsSync(sitePath)) {
      fs.mkdirSync(sitePath, { recursive: true });
    }

    // Write primary executing script
    let filename = "index.html";
    if (language === "php") filename = "index.php";
    else if (language === "css") filename = "style.css";
    else if (language === "js") filename = "script.js";

    fs.writeFileSync(path.join(sitePath, filename), code);

    // If writing css/js/etc, ensure index.html exists to invoke/test them instantly
    if (language === "css" && !fs.existsSync(path.join(sitePath, "index.html"))) {
      fs.writeFileSync(path.join(sitePath, "index.html"), `<!DOCTYPE html><html><head><title>CSS Hub</title><link rel='stylesheet' href='style.css'></head><body><div class='preview-wrap'><h1>Golden Nexus CSS Hub</h1><p>Enjoy modern responsive styles</p></div></body></html>`);
    } else if (language === "js" && !fs.existsSync(path.join(sitePath, "index.html"))) {
      fs.writeFileSync(path.join(sitePath, "index.html"), `<!DOCTYPE html><html><head><title>JS Playground</title></head><body><h1>JS Real-time Terminal Output:</h1><pre id='sandbox-out'></pre><script src='script.js'></script></body></html>`);
    }

    // Write Metadata
    const metaPayload = {
      creator_id: creatorId || "GUEST",
      timestamp: Math.floor(Date.now() / 1000),
      type: `code-${language}`,
      status: "extracted",
      language
    };
    fs.writeFileSync(metaPath, JSON.stringify(metaPayload, null, 2));

    res.json({ success: true, slug });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Handle single binary file uploads OR directory files uploads
app.post("/api/terminal/deploy-upload", upload.array("files"), (req: any, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const paths = req.body.paths ? (Array.isArray(req.body.paths) ? req.body.paths : [req.body.paths]) : [];
    const { alias, creatorId, mode } = req.body;
    
    if (!alias) {
      return res.status(400).json({ success: false, error: "Deployment project alias required" });
    }

    const slug = generateSlug(alias);
    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);

    // Verify Ownership
    if (fs.existsSync(metaPath)) {
      const existingMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (existingMeta.creator_id !== creatorId && req.body.isAdmin !== "true") {
        return res.status(403).json({ success: false, error: `Crucial Error: ID registered under different credentials.` });
      }
    }

    const siteFolder = path.join(STORAGE_DIR, slug);
    if (!fs.existsSync(siteFolder)) {
      fs.mkdirSync(siteFolder, { recursive: true });
    }

    let detectType = "file";

    if (mode === "zip") {
      // Save original Zip binary directly into Archives for Katabum step
      const zipFile = files[0];
      if (!zipFile) {
        return res.status(400).json({ success: false, error: "ZIP file missing" });
      }
      const zipPath = path.join(ARCHIVES_DIR, `${slug}.zip`);
      fs.writeFileSync(zipPath, zipFile.buffer);

      const metaPayload = {
        creator_id: creatorId || "GUEST",
        timestamp: Math.floor(Date.now() / 1000),
        type: "zip",
        status: "uploaded",
        original_name: zipFile.originalname,
        zip_size: zipFile.size
      };
      fs.writeFileSync(metaPath, JSON.stringify(metaPayload, null, 2));
      return res.json({ success: true, slug, mode: "zip_uploaded" });
    }

    // Process uploaded file list (supports recursive subdirectories)
    files.forEach((file, index) => {
      // Reconstruct folder pathway
      const relativePath = paths[index] ? paths[index].replace(/^[^/]+\//, "") : file.originalname;
      const safeRelative = relativePath.split("/").map((p: string) => p.replace(/[^\w.-]+/g, "_")).join("/");
      
      const fileTarget = path.join(siteFolder, safeRelative);
      const directoryOfFile = path.dirname(fileTarget);

      if (!fs.existsSync(directoryOfFile)) {
        fs.mkdirSync(directoryOfFile, { recursive: true });
      }

      fs.writeFileSync(fileTarget, file.buffer);
    });

    // Smart index placement check
    if (!fs.existsSync(path.join(siteFolder, "index.html")) && !fs.existsSync(path.join(siteFolder, "index.php"))) {
      // Try to find any deeper HTML file and bubble it or copy as index
      const filesInDir = fs.readdirSync(siteFolder);
      const firstHtml = filesInDir.find(f => f.endsWith(".html") || f.endsWith(".htm"));
      if (firstHtml) {
        fs.copyFileSync(path.join(siteFolder, firstHtml), path.join(siteFolder, "index.html"));
      } else {
        // Generate placeholder summary report
        const linksHTML = files.map((f, i) => {
          const rel = paths[i] ? paths[i].replace(/^[^/]+\//, "") : f.originalname;
          return `<li><a href="${rel}" style="color: #ff007f; font-family: monospace;">${rel}</a></li>`;
        }).join("");
        fs.writeFileSync(path.join(siteFolder, "index.html"), `<!DOCTYPE html><html><head><title>Nexus Directory</title></head><body style="background: #0d0510; color: #ffe5f0; padding: 40px; font-family: sans-serif;"><h1 style="color: #ffd700;">Golden Nexus Sandbox Index</h1><ul>${linksHTML}</ul></body></html>`);
      }
    }

    const metaPayload = {
      creator_id: creatorId || "GUEST",
      timestamp: Math.floor(Date.now() / 1000),
      type: mode === "folder" ? "folder-upload" : "file-upload",
      status: "extracted"
    };
    fs.writeFileSync(metaPath, JSON.stringify(metaPayload, null, 2));

    res.json({ success: true, slug, mode: mode });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Unarchive Zip file with Katabum intelligent flattening
app.post("/api/terminal/unarchive", (req, res) => {
  try {
    const { slug, creatorId, isAdmin } = req.body;
    if (!slug) return res.status(400).json({ success: false, error: "Slug required" });

    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);
    if (!fs.existsSync(metaPath)) {
      return res.status(404).json({ success: false, error: "Metadata doesn't exist" });
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (meta.creator_id !== creatorId && !isAdmin) {
      return res.status(403).json({ success: false, error: "Access denied: ownership mismatch" });
    }

    const zipPath = path.join(ARCHIVES_DIR, `${slug}.zip`);
    if (!fs.existsSync(zipPath)) {
      return res.status(404).json({ success: false, error: "Zip archive not found in our bays" });
    }

    const siteFolder = path.join(STORAGE_DIR, slug);
    if (fs.existsSync(siteFolder)) {
      deleteFolderRecursive(siteFolder);
    }
    fs.mkdirSync(siteFolder, { recursive: true });

    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();

    // Check if zip holds everything in a single root subfolder
    const topLevelFolders = new Set<string>();
    const topLevelFiles: string[] = [];

    zipEntries.forEach(entry => {
      if (entry.entryName.startsWith("__MACOSX/")) return;
      
      const parts = entry.entryName.split("/");
      if (entry.isDirectory) {
        if (parts[0]) topLevelFolders.add(parts[0]);
      } else {
        if (parts.length === 1) {
          topLevelFiles.push(parts[0]);
        } else if (parts.length > 1) {
          topLevelFolders.add(parts[0]);
        }
      }
    });

    const isNestedSingleFolder = (topLevelFolders.size === 1 && topLevelFiles.length === 0);
    const singleFolderPrefix = isNestedSingleFolder ? Array.from(topLevelFolders)[0] + "/" : "";

    let extractedCount = 0;

    zipEntries.forEach(entry => {
      if (entry.entryName.startsWith("__MACOSX/")) return;
      if (entry.isDirectory) return;

      const relativeName = isNestedSingleFolder 
        ? entry.entryName.substring(singleFolderPrefix.length) 
        : entry.entryName;

      // Extract only if extension matches allowed listings
      const ext = path.extname(relativeName).toLowerCase().replace(".", "");
      if (ext && !ALLOWED_EXTS.includes(ext) && ext !== "htaccess") return;

      const targetPath = path.join(siteFolder, relativeName);
      const dir = path.dirname(targetPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(targetPath, entry.getData());
      extractedCount++;
    });

    // Auto discover or shift indexes
    if (!fs.existsSync(path.join(siteFolder, "index.html")) && !fs.existsSync(path.join(siteFolder, "index.php"))) {
      // Shallow discovery
      const list = fs.readdirSync(siteFolder);
      const subHtml = list.find(f => f.endsWith(".html") || f.endsWith(".htm"));
      if (subHtml) {
        fs.copyFileSync(path.join(siteFolder, subHtml), path.join(siteFolder, "index.html"));
      }
    }

    // Update metadata JSON
    meta.status = "extracted";
    meta.extracted_at = Math.floor(Date.now() / 1000);
    meta.files = extractedCount;
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    res.json({ success: true, filesExtracted: extractedCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Recursive file listing for File Manager inside a site
app.get("/api/terminal/manage-files", (req, res) => {
  try {
    const slug = req.query.slug as string;
    if (!slug) return res.status(400).json({ success: false, error: "Slug is required" });

    const siteFolder = path.join(STORAGE_DIR, slug);
    if (!fs.existsSync(siteFolder)) {
      return res.status(404).json({ success: false, error: "Site folder does not exist" });
    }

    const files: any[] = [];
    const scan = (currentDir: string, base: string) => {
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const full = path.join(currentDir, item);
        const rel = path.relative(siteFolder, full).replace(/\\/g, "/");
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          files.push({
            name: rel,
            basename: item,
            is_dir: true,
            size: 0,
            depth: rel.split("/").length - 1
          });
          scan(full, base);
        } else {
          files.push({
            name: rel,
            basename: item,
            is_dir: false,
            size: stat.size,
            depth: rel.split("/").length - 1
          });
        }
      });
    };
    
    scan(siteFolder, siteFolder);

    // Sort: folders first, then files alphabetically
    files.sort((a, b) => {
      if (a.is_dir !== b.is_dir) return b.is_dir ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    res.json({ success: true, files });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Load single file content for editing
app.get("/api/terminal/get-file-content", (req, res) => {
  try {
    const { slug, relPath } = req.query as { slug: string; relPath: string };
    if (!slug || !relPath) return res.status(400).json({ success: false, error: "Attributes required" });

    const fileResolved = safePathResolve(slug, relPath);
    if (!fs.existsSync(fileResolved) || fs.statSync(fileResolved).isDirectory()) {
      return res.status(404).json({ success: false, error: "Requested file resource and pathway is invalid." });
    }

    const content = fs.readFileSync(fileResolved, "utf-8");
    res.json({ success: true, content });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Save file content edited in place
app.post("/api/terminal/save-file-content", (req, res) => {
  try {
    const { slug, relPath, content, creatorId, isAdmin } = req.body;
    if (!slug || !relPath) return res.status(400).json({ success: false, error: "Unresolvable file parameters" });

    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (meta.creator_id !== creatorId && !isAdmin) {
        return res.status(403).json({ success: false, error: "Access denied to unauthorized editor" });
      }
    }

    const fileResolved = safePathResolve(slug, relPath);
    fs.writeFileSync(fileResolved, content || "");

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Add separate file into existing site folder layout
app.post("/api/terminal/add-site-file", upload.single("extra_file"), (req, res) => {
  try {
    const { slug, subfolder, creatorId, isAdmin } = req.body;
    const file = req.file;

    if (!slug || !file) {
      return res.status(400).json({ success: false, error: "Missing required parameters" });
    }

    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (meta.creator_id !== creatorId && !isAdmin) {
        return res.status(403).json({ success: false, error: "Access denied to editor" });
      }
    }

    const siteFolder = path.join(STORAGE_DIR, slug);
    const destinationPath = subfolder 
      ? path.join(siteFolder, subfolder.replace(/^\/+|\/+$/g, ""), file.originalname)
      : path.join(siteFolder, file.originalname);

    const dir = path.dirname(destinationPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(destinationPath, file.buffer);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Delete single inner file
app.post("/api/terminal/delete-site-file", (req, res) => {
  try {
    const { slug, relPath, creatorId, isAdmin } = req.body;
    if (!slug || !relPath) return res.status(400).json({ success: false, error: "Parameters required" });

    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (meta.creator_id !== creatorId && !isAdmin) {
        return res.status(403).json({ success: false, error: "Permission error" });
      }
    }

    const fileResolved = safePathResolve(slug, relPath);
    if (fs.existsSync(fileResolved) && !fs.statSync(fileResolved).isDirectory()) {
      fs.unlinkSync(fileResolved);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Delete entire deployed entity (and associated archives)
app.post("/api/terminal/delete-site", (req, res) => {
  try {
    const { slug, creatorId, isAdmin } = req.body;
    if (!slug) return res.status(400).json({ success: false, error: "Slug required" });

    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (meta.creator_id !== creatorId && !isAdmin) {
        return res.status(403).json({ success: false, error: "Security restriction: ownership breach" });
      }
      fs.unlinkSync(metaPath);
    }

    // Delete static files folder
    const folder = path.join(STORAGE_DIR, slug);
    if (fs.existsSync(folder)) {
      deleteFolderRecursive(folder);
    }

    // Delete archived ZIP
    const zipArchive = path.join(ARCHIVES_DIR, `${slug}.zip`);
    if (fs.existsSync(zipArchive)) {
      fs.unlinkSync(zipArchive);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Terminate uploaded ZIP archive before it gets unpacked
app.post("/api/terminal/delete-zip", (req, res) => {
  try {
    const { slug, creatorId, isAdmin } = req.body;
    if (!slug) return res.status(400).json({ success: false, error: "Slug target required" });

    const metaPath = path.join(STORAGE_DIR, `${slug}.meta.json`);
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (meta.creator_id !== creatorId && !isAdmin) {
        return res.status(403).json({ success: false, error: "Authorization failed" });
      }
      fs.unlinkSync(metaPath);
    }

    const zipArchive = path.join(ARCHIVES_DIR, `${slug}.zip`);
    if (fs.existsSync(zipArchive)) {
      fs.unlinkSync(zipArchive);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper functions for offline fallback bio generation
function generateOfflineFallbackBios(name: string, mood: string, language: string): Array<{ text: string; styleName: string }> {
  const n = name || "Your Name";
  const upperName = n.toUpperCase();
  
  if (mood === "Gamer") {
    return [
      {
        styleName: "🔥 PUBG Battle-Royale Elite",
        text: `⚔️ 𝖦𝖠𝖬𝖤𝖱 𝖫𝖨𝖥𝖤 ⚔️\n🔫 𝖪𝖨𝖫𝖫𝖤𝖱 ${upperName} ࿇\n🎮 Free Fire Player | KD: 6.9\n☠️ No Love, Only Loot 💣\n🏆 Rush Gameplay Only!`
      },
      {
        styleName: "⚡ Neon Cyber-Assassin",
        text: `░░▒▒▓▓ ${n} ▓▓▒▒░░\n👑 𝕲𝖆𝖒𝖊𝖗 𝕾𝖔𝖚𝖑 ⭐\n👾 Streamer & YouTuber\n🎧 Bass Boosted Beats\n⛔ Born To Conquer ⛔`
      }
    ];
  } else if (mood === "Sad" || mood === "Sad_Broken") {
    return [
      {
        styleName: "🖤 Dark Aesthetic Sadness",
        text: `💔 𝔖𝔞𝔡 𝔖𝔬𝔲𝔩 🖤\n🥀 ${n} • Broken Inside\n🤐 Fake Smile, Silent Pain\n🌌 Dark Nights & Sad Songs\n⏳ Wait for My Time...`
      },
      {
        styleName: "🍂 Broken Heart Poetry",
        text: `『 ${n} 』\n🎭 Log Badalte Hain, Hum Nahi\n💔 Heart Broken but Mind High\n🚶 Single Walk In Deep Forest\n⛈️ Raining Tears In My Heart`
      }
    ];
  } else if (mood === "Queen" || mood === "Queen_Girls") {
    return [
      {
        styleName: "🥀 Royal Princess Aesthetic",
        text: `🎀 𝒬𝓊𝑒𝑒𝓃 𝒪𝒻 𝑀𝓎 𝒲𝑜𝓇𝓁𝒹 🎀\n👑 ${n} Princess • Papa's Angel\n💄 Makeup Lover | Shopping Queen\n🧁 Sweet but Psycho 😉\n🚫 No attitude check needed!`
      },
      {
        styleName: "✨ Butterfly Glow VIP",
        text: `🦋 ${n} 🦋\n✨ 𝖵𝖨𝖯 𝖦𝗂𝗋𝗅 𝖠𝖾𝗌𝗍𝗁𝖾𝗍𝗂𝖼\n🖤 Black Lover | Foodie\n🧸 Soft Heart, Bold Attitude\n🎂 Candle Blow on 18 Oct 🍾`
      }
    ];
  } else {
    // Royal, VIP / Attitude, or default
    return [
      {
        styleName: "👑 Ultra VIP Royal Emperor",
        text: `👑 ✨ 𝓥𝓘𝓟 𝓐𝓬𝓬𝓸𝓾𝓷𝓽 ✨ 👑\n⚔️ 𝕭𝖔𝖑𝖉 ${upperName} ⚔️\n🖤 Black Heart Black Car\n🔥 Royal Blood with Attitude\n🎂 Wish Me on 14 March 🥂`
      },
      {
        styleName: "🔥 Killer Attitude Dynamic",
        text: `😈 𝓚𝓲𝓵𝓵𝓮𝓻 𝓑𝓸𝔂 ${n} 😈\n⛓️ Rule Maker, Rule Breaker\n🚀 High Speed Life, Higher Attitude\n💀 Shauk Nahi, Khauf Hai\n💎 Living Life King Size`
      }
    ];
  }
}

// API: AI-powered stylish bio generator via Gemini API
app.post("/api/gemini/generate-bio", async (req, res) => {
  try {
    const { name, mood, language, stylePattern, customInstructions } = req.body;
    
    // Check if the API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return beautiful structured local fallbacks instead of crashing
      console.log("No GEMINI_API_KEY detected, rendering pre-crafted high-quality fallback bios.");
      const fallbacks = generateOfflineFallbackBios(name, mood, language);
      return res.json({
        success: true,
        isAiGenerated: false,
        bios: fallbacks,
        message: "Loaded dynamic premium templates."
      });
    }

    // Lazy load the Gemini client as requested by guidelines
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const userPrompt = `
      Create 3 extremely stylish, outstanding, and eye-catching Facebook Profiles Bios for a user.
      User Details:
      - Name: ${name || "Your Name"}
      - Mood / Personality Theme: ${mood || "VIP Attitude"}
      - Language accent: ${language || "English and Urdu/Hindi combined with beautiful letters"}
      - Decorative Style Preference: ${stylePattern || "Crown icons, cool symbols, aesthetic brackets, decorative margins"}
      - Special customer instruction: ${customInstructions || "Make it look highly professional and amazing"}

      Rules for Stylish Biography:
      1. Use abundant beautiful unicode symbols, stylized text (like 𝖵𝖨𝖯, 𝕶𝖎𝖓𝖌, 𝓠𝓾𝓮𝓮𝓷, 𝔄𝔱𝔱𝔦𝔱𝔲𝔡𝔢), decorative symbols (👑, ⚔️, 😈, 🖤, 🖤, 💎, ⛓️, ☠️, 々, ᰔ, 🦋, 🥀, 🦄, ✨, ⚡).
      2. Keep it structured line-by-line (around 4-6 lines) so it looks like a real premium Facebook bio card.
      3. Do NOT make the text un-copyable, mix readable symbols with stylized fonts.
      4. Ensure a great blend of personality facts, emoji lists, and status lines in Hindi/English/Urdu.

      Return ONLY a JSON response matching the following schema. No markdown wrapping except valid json output, or plain json text.
      {
        "bios": [
          {
            "text": "👑 VIP BIO TEXT LINE BY LINE",
            "styleName": "Give a cool name like 'Crown Royal Empire Edition'"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(rawText.trim());
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON output, raw output was:", rawText);
      // Strip any markdown blocks if the model wrapped it
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      isAiGenerated: true,
      bios: parsedData.bios || generateOfflineFallbackBios(name, mood, language)
    });

  } catch (error: any) {
    console.error("Gemini Bio API Error:", error);
    // Graceful fallback on error so user session continues seamlessly
    const fallbacks = generateOfflineFallbackBios(req.body.name, req.body.mood, req.body.language);
    res.json({
      success: true,
      isAiGenerated: false,
      bios: fallbacks,
      errorMsg: error.message
    });
  }
});

// Static SPA assets for development vs production environments
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`🚀 MKMODZ Elite Multi-Hosting Server Booted on: ${PORT}`);
    console.log(`📡 Storage Matrix: ENABLED`);
    console.log(`====================================================`);
  });
}

main().catch(err => {
  console.error("Critical Terminal Crash:", err);
});
