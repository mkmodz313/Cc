import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-initialized Gemini Client to prevent crash on boot if key is not yet set
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in local environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory fallback dataset in case drawn lottery endpoint is down
let cachedHistory: any[] = [];
let lastFetchedTime = 0;

// Set up realistic simulated base numbers (past 20 draws) on startup
let simulationPeriod = BigInt("202606100100");
function generateSimulatedHistory(count = 20) {
  const result = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const periodStr = (simulationPeriod - BigInt(i)).toString();
    const num = Math.floor(Math.random() * 10);
    result.push({
      issueNumber: periodStr,
      number: String(num),
      colour: num === 0 || num === 5 ? "violet" : num % 2 === 0 ? "red" : "green",
      openTime: new Date(now - i * 60000).toISOString(),
    });
  }
  return result;
}

// ----------------------------------------------------
// API ENDPOINT: PROXY LIVE WINGO 1M RESULTS WITHOUT CORS
// ----------------------------------------------------
app.get("/api/wingo-history", async (req, res) => {
  try {
    const now = Date.now();
    // Cache for 2 seconds to prevent rate limits
    if (cachedHistory.length > 0 && now - lastFetchedTime < 2000) {
      return res.json({ status: "cached", data: cachedHistory });
    }

    // Try fetching from the real external API endpoint
    const url = `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=20&t=${now}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
        "Referer": "https://www.92go.club/",
      },
      signal: AbortSignal.timeout(5000), // 5 seconds timeout limit
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const json = await response.json();
    if (json && json.data && json.data.list && json.data.list.length > 0) {
      // Successful extraction
      const fetchedList = json.data.list.map((item: any) => ({
        issueNumber: item.issueNumber,
        number: String(item.number),
        colour: item.colour || (parseInt(item.number) === 0 || parseInt(item.number) === 5 ? "violet" : parseInt(item.number) % 2 === 0 ? "red" : "green"),
        openTime: item.openTime,
      }));
      cachedHistory = fetchedList;
      lastFetchedTime = now;
      return res.json({ status: "ok", data: fetchedList });
    } else {
      throw new Error("Invalid or empty data structure from external host.");
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[Proxy warning] API fetch failed: ${errMsg}. Redirecting seamlessly to local machine-simulation fallback.`);

    // Fail-safe logic: Ensure game continues by incrementing simulation periods
    const currentTimeMinutes = Math.floor(Date.now() / 60000);
    const virtualIssueSeed = BigInt("202606100000") + BigInt(currentTimeMinutes % 1440);
    
    // Refresh fallback numbers dynamically to simulate game drawing loop
    if (cachedHistory.length === 0 || cachedHistory[0].issueNumber !== virtualIssueSeed.toString()) {
      simulationPeriod = virtualIssueSeed;
      cachedHistory = generateSimulatedHistory(20);
    }
    
    return res.json({ status: "simulated", data: cachedHistory });
  }
});

// ----------------------------------------------------
// API ENDPOINT: ADVANCED AI COGNITIVE PATTERN RECON GAUGE
// ----------------------------------------------------
app.post("/api/gemini-pattern", async (req, res) => {
  const { numbers } = req.body;
  
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({ error: "Missing or invalid historic query sequence." });
  }

  try {
    const client = getGeminiClient();
    const listString = JSON.stringify(numbers);

    // Prompt engineered layout specifically targeting predictive statistics
    const prompt = `
      You are the SureShot AI Pattern Engine, specialized in predictive numerical analysis.
      Analyze the past 20 drawn numbers of our 1-Minute color prediction lottery.
      The numbers in chronological reverse-order (newest draw is first in list): ${listString}

      Evaluate:
      1. Parity trend (Even vs Odd ratio shift: Even=RED, Odd=GREEN, 0/5=VIOLET).
      2. Weighted Size cluster distributions (BIG:[5-9] vs SMALL:[0-4] over a rolling window).
      3. Repetitive streaks vs periodic alternating transitions (chaos waves).
      
      Generate a precise recommendation for the NEXT issue and output in valid JSON.
      
      Use exactly this schema:
      {
        "explanation": "A one-sentence highly professional reason pointing out the sequence transition.",
        "patternDetected": "High-fidelity classification (e.g. Repeating Double Peak, Cyclic Alternating Wave, Large Cluster Accumulator, Fibonacci Sequence Resonance)",
        "predictedSize": "BIG" or "SMALL",
        "predictedColor": "RED" or "GREEN",
        "confidence": integer between 85 and 99
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            patternDetected: { type: Type.STRING },
            predictedSize: { type: Type.STRING },
            predictedColor: { type: Type.STRING },
            confidence: { type: Type.INTEGER }
          },
          required: ["explanation", "patternDetected", "predictedSize", "predictedColor", "confidence"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json({ success: true, ...parsedData });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn("[Gemini Exception] Error running AI recognition engine:", errorMsg);

    // Smart fallback pattern generation if Gemini is offline or API key is not yet set
    const lastNum = numbers[0];
    const sizeFall = lastNum >= 5 ? "SMALL" : "BIG"; // simple trend reversal
    const colorFall = lastNum % 2 === 0 ? "GREEN" : "RED"; // parity alternating

    return res.json({
      success: false,
      patternDetected: "Fallback Sequential Analysis",
      predictedSize: sizeFall,
      predictedColor: colorFall,
      confidence: 88,
      explanation: "Predictive analyzer running in offline heuristic fallback due to connection/config limits."
    });
  }
});

// ----------------------------------------------------
// EXPRESS VITE INFRASTRUCTURE ENGINES
// ----------------------------------------------------
async function main() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev mode integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`🚀 WinGo companion server booted, listening on port ${PORT}`);
    console.log(`🔴 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`====================================================`);
  });
}

main().catch(err => {
  console.error("Express critical bootstrapper crash:", err);
});
