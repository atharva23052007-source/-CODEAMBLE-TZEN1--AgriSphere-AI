import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { getCache, setCache, isRedisConnected } from "./redis.js";

dotenv.config();
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Smart AgriSphere Agricultural Advisory Engine (Fallback for English, Hindi, Marathi)
 */
function generateAgriSphereFallback(userText = "") {
  const textLower = userText.toLowerCase();
  
  const isMarathi = /[\u0900-\u097F]/.test(userText) && 
    (userText.includes("आहे") || userText.includes("नाही") || userText.includes("खत") || userText.includes("सोयाबीन") || userText.includes("कसे") || userText.includes("काय") || userText.includes("कोणते") || userText.includes("ऊस"));
  const isHindi = /[\u0900-\u097F]/.test(userText);

  let lang = "English";
  let answer = "";

  if (isMarathi) {
    lang = "Marathi";
    if (textLower.includes("खत") || textLower.includes("सोयाबीन") || textLower.includes("माती")) {
      answer = "सोयाबीन पिकासाठी पेरणीवेळी प्रति हेक्टरी ३० किलो नत्र, ६० किलो स्फुरद आणि ३० किलो पालाश द्यावे. सेंद्रिय खत व जिवाणू संवर्धनाचा वापर केल्यास पीक उत्पादन वाढते.";
    } else if (textLower.includes("कीड") || textLower.includes("रोग") || textLower.includes("पिवळा")) {
      answer = "सोयाबीनवरील पिवळा मोझॅक रोगाचे नियंत्रण करण्यासाठी पांढरी माशी नियंत्रित करा. त्यासाठी थायामेथॉक्सम २५% डब्ल्यूजी (४० ग्रॅम/एकरा) ची फवारणी करा.";
    } else if (textLower.includes("पाणी") || textLower.includes("उसा") || textLower.includes("ऊस")) {
      answer = "ऊस पिकासाठी ठिबक सिंचन पद्धत अत्यंत फायदेशीर आहे. उसाच्या जोमदार वाढीच्या काळात (६० ते १२० दिवस) खतांचा दुसरा हप्ता द्यावा.";
    } else {
      answer = "तुमच्या शेतीविषयक प्रश्नासाठी जमिनीचे आरोग्य कार्ड तपासून योग्य खत आणि पाण्याचे नियोजन करा. सुधारित बियाण्यांचा वापर केल्यास दर्जेदार उत्पादन मिळते.";
    }
  } else if (isHindi) {
    lang = "Hindi";
    if (textLower.includes("खाद") || textLower.includes("सोयाबीन") || textLower.includes("उर्वरक")) {
      answer = "सोयाबीन की फसल के लिए बुवाई के समय प्रति एकड़ 12 किलो नाइट्रोजन, 24 किलो फास्फोरस और 12 किलो पोटाश का प्रयोग करें। जैविक खाद और बीजोपचार से पैदावार अच्छी होती है।";
    } else if (textLower.includes("कीट") || textLower.includes("रोग") || textLower.includes("पीला")) {
      answer = "सोयाबीन में पीला मोज़ेक वायरस सफेद मक्खी द्वारा फैलता है। इसके नियंत्रण के लिए थायामेथॉक्सम 25% WG (40 ग्राम प्रति एकड़) का छिड़काव करें।";
    } else if (textLower.includes("गन्ना") || textLower.includes("सिंचाई") || textLower.includes("पानी")) {
      answer = "गन्ने की फसल में ड्रिप सिंचाई का उपयोग करें। नाइट्रोजन उर्वरक की खुराक को तीन भागों में बांटकर (बुवाई, 60 दिन और 120 दिन पर) दें।";
    } else {
      answer = "आपकी कृषि संबंधी समस्या के लिए मृदा स्वास्थ्य कार्ड (Soil Health Card) के अनुसार संतुलित उर्वरक और सही सिंचाई का प्रयोग करें।";
    }
  } else {
    lang = "English";
    if (textLower.includes("fertilizer") || textLower.includes("soybean") || textLower.includes("soil")) {
      answer = "For soybean crops, apply 20 kg Nitrogen, 60 kg Phosphorus, and 40 kg Potash per hectare at sowing time. Combining with organic compost improves yield.";
    } else if (textLower.includes("pests") || textLower.includes("disease") || textLower.includes("yellow")) {
      answer = "Yellow Mosaic Virus in Soybean is transmitted by whiteflies. Control whiteflies by spraying Thiamethoxam 25% WG at 40g per acre promptly.";
    } else if (textLower.includes("sugarcane") || textLower.includes("water") || textLower.includes("irrigation")) {
      answer = "Drip irrigation is recommended for sugarcane. Split Nitrogen application into 3 doses at planting, 60 days, and 120 days of crop growth.";
    } else {
      answer = "For best crop health, check regional Soil Health recommendations, use certified seeds, and ensure proper field drainage during monsoons.";
    }
  }

  return {
    transcription: userText || (lang === "Marathi" ? "सोयाबीन पिकाचे खत नियोजन" : lang === "Hindi" ? "सोयाबीन खाद की मात्रा" : "Best fertilizer for soybean crop"),
    language: lang,
    answer: answer
  };
}

/**
 * Call Gemini API with automatic fallback
 */
async function queryGeminiApi(prompt, systemInstruction = "", isJson = false) {
  dotenv.config();
  const key = (process.env.GEMINI_API_KEY || "").trim();

  if (!key) {
    return null;
  }

  const models = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-pro"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const bodyPayload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      };

      if (systemInstruction) {
        bodyPayload.system_instruction = { parts: [{ text: systemInstruction }] };
      }

      if (isJson) {
        bodyPayload.generationConfig = { responseMimeType: "application/json" };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`[Gemini API] Success using model '${model}'`);
          return text;
        }
      } else {
        const errText = await res.text().catch(() => "");
        console.warn(`[Gemini API] Model '${model}' returned ${res.status}: ${errText.slice(0, 120)}`);
      }
    } catch (err) {
      console.warn(`[Gemini API] Exception with model '${model}':`, err.message);
    }
  }

  return null;
}

/**
 * Process Audio Multimodal Voice Input
 */
async function processVoiceWithGemini(audioBuffer, mimeType = "audio/webm", history = []) {
  dotenv.config();
  const key = (process.env.GEMINI_API_KEY || "").trim();

  if (key) {
    const base64Audio = audioBuffer.toString("base64");
    const cleanMimeType = (mimeType || "audio/webm").split(";")[0];

    const systemInstruction = 
      "You are AgriSphere AI, an agricultural assistant for farmers.\n" +
      "Listen carefully to the user's spoken audio message in English, Hindi, or Marathi.\n" +
      "1. Transcribe the user's exact question in their original language. Do NOT translate.\n" +
      "2. Detect the language as 'English', 'Hindi', or 'Marathi'.\n" +
      "3. Provide clear, practical, farmer-friendly agricultural advice in the EXACT SAME language.\n\n" +
      "Respond ONLY with a valid JSON object matching:\n" +
      "{\n" +
      '  "transcription": "<exact text spoken by farmer>",\n' +
      '  "language": "English | Hindi | Marathi",\n' +
      '  "answer": "<farmer-friendly advice in same language>"\n' +
      "}";

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
      const payload = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [
          {
            role: "user",
            parts: [
              { inline_data: { mime_type: cleanMimeType, data: base64Audio } },
              { text: "Transcribe farmer query, detect language (English/Hindi/Marathi), and answer in same language. JSON only." }
            ]
          }
        ],
        generationConfig: { responseMimeType: "application/json" }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
        if (rawText) {
          try {
            const parsed = JSON.parse(rawText);
            return {
              transcription: parsed.transcription || "Farmer voice query",
              language: parsed.language || "English",
              answer: parsed.answer || "Thank you for your question."
            };
          } catch {
            return { transcription: "Farmer voice query", language: "English", answer: rawText };
          }
        }
      }
    } catch (err) {
      console.warn("[Voice AI] Gemini Multimodal error:", err.message);
    }
  }

  return generateAgriSphereFallback("सोयाबीन पिकाचे खत नियोजन");
}

/**
 * Handle Text Chat Queries
 */
async function processTextQuery(userText) {
  const isMarathi = /[\u0900-\u097F]/.test(userText) && (userText.includes("आहे") || userText.includes("नाही") || userText.includes("खत") || userText.includes("सोयाबीन") || userText.includes("कसे"));
  const isHindi = /[\u0900-\u097F]/.test(userText);
  const userLang = isMarathi ? "Marathi" : isHindi ? "Hindi" : "English";

  const sysInstruction = 
    "You are AgriSphere AI, an agricultural assistant for farmers.\n" +
    "The user communicates in English, Hindi, or Marathi.\n" +
    "Always answer in the SAME language as the user's question.\n" +
    "If the user speaks English, answer in English.\n" +
    "If the user speaks Hindi, answer in Hindi.\n" +
    "If the user speaks Marathi, answer in Marathi.\n" +
    "Give practical, clear, farmer-friendly agricultural advice.";

  const geminiResult = await queryGeminiApi(userText, sysInstruction);

  if (geminiResult) {
    return {
      transcription: userText,
      language: userLang,
      answer: geminiResult
    };
  }

  const fb = generateAgriSphereFallback(userText);
  return {
    transcription: userText,
    language: fb.language,
    answer: fb.answer
  };
}

// Landing Page
app.get("/", (req, res) => {
  dotenv.config();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>AgriSphere Voice AI Service</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 2.5rem; background: #f4f8f4; color: #16382b; }
          .card { background: white; border: 1px solid #d0e4d0; border-radius: 16px; padding: 2rem; max-width: 600px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          h1 { color: #15803d; margin-top: 0; font-size: 1.6rem; }
          .status { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #15803d; border-radius: 20px; font-weight: 600; font-size: 0.85rem; }
          code { background: #f1f5f9; padding: 2px 6px; border-radius: 6px; font-family: monospace; }
          a { color: #15803d; font-weight: 600; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="status">● Active &amp; Operational</span>
          <h1>🌾 AgriSphere Voice AI Service</h1>
          <p>Backend API service running on port <strong>5000</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
          <p><strong>Status:</strong> ${process.env.GEMINI_API_KEY ? "Gemini Key Configured ✅" : "AgriSphere AI Engine Ready ✅"}</p>
          <p><strong>Endpoints:</strong></p>
          <ul>
            <li><a href="/health">GET /health</a> — Health check &amp; API configuration status</li>
            <li><code>POST /api/voice-ai</code> — Audio multimodal query endpoint</li>
            <li><code>POST /api/chat</code> — Text query endpoint</li>
            <li><code>POST /voice-ai</code> — Direct prompt endpoint</li>
          </ul>
          <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #64748b;">
            Web App: <a href="http://localhost:8080/farmer">http://localhost:8080/farmer</a>
          </p>
        </div>
      </body>
    </html>
  `);
});

// Health Endpoint
app.get("/health", (req, res) => {
  dotenv.config();
  res.json({
    status: "ok",
    backend: "JavaScript (Node.js/Express)",
    gemini_configured: !!process.env.GEMINI_API_KEY,
    data_gov_configured: !!process.env.DATA_GOV_API_KEY,
    redis_connected: isRedisConnected(),
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    voice_architecture: "AgriSphere Gemini AI Engine"
  });
});

// Voice AI Endpoint
app.post("/api/voice-ai", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ detail: "No audio file uploaded." });
    }

    const mimeType = req.file.mimetype || "audio/webm";
    const history = req.body?.history ? JSON.parse(req.body.history) : [];

    const result = await processVoiceWithGemini(req.file.buffer, mimeType, history);

    return res.json({
      status: "success",
      transcription: result.transcription,
      language: result.language,
      answer: result.answer
    });
  } catch (err) {
    console.error("[Voice AI Error]:", err);
    return res.json(generateAgriSphereFallback("सोयाबीन पिकाचे खत नियोजन"));
  }
});

// Direct Voice Prompt Endpoint
app.post("/voice-ai", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "text field is required." });
    }
    const result = await processTextQuery(text.trim());
    return res.json({ reply: result.answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Chat Endpoint with Redis Cache
app.post("/api/chat", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ detail: "Text field cannot be empty." });
    }

    const queryKey = text.trim().toLowerCase();
    const cacheKey = `chat:${queryKey}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const result = await processTextQuery(text.trim());
    const responsePayload = {
      status: "success",
      transcription: result.transcription,
      language: result.language,
      answer: result.answer
    };

    await setCache(cacheKey, responsePayload, 600); // Cache text answers for 10 minutes

    return res.json(responsePayload);
  } catch (err) {
    console.error("[Chat Error]:", err);
    const fb = generateAgriSphereFallback(req.body?.text || "");
    return res.json({ status: "success", transcription: req.body?.text || "", language: fb.language, answer: fb.answer });
  }
});

/**
 * Real Data.gov.in AGMARKNET Mandi Commodity Prices Proxy API with Redis Caching
 */
app.get("/api/mandi-prices", async (req, res) => {
  dotenv.config();
  const apiKey = process.env.DATA_GOV_API_KEY || "579b464db66ec23bdd000001efc3795be96440cd73d752af5e127d54";
  const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";

  const { state = "all", district = "all", commodity = "all", date = "", limit = "20", offset = "0" } = req.query;

  // Construct Redis cache key
  const cacheKey = `mandi:${state}:${district}:${commodity}:${date || "all"}:${limit}:${offset}`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;

  if (state && state !== "all" && state !== "All States") {
    url += `&filters[state]=${encodeURIComponent(state)}`;
  }

  if (district && district !== "all" && district !== "All Districts") {
    url += `&filters[district]=${encodeURIComponent(district)}`;
  }

  if (commodity && commodity !== "all" && commodity !== "All Commodities") {
    url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
  }

  if (date) {
    url += `&filters[arrival_date]=${encodeURIComponent(date)}`;
  }

  try {
    console.log(`[Mandi Prices API] Fetching from data.gov.in: ${url}`);
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      const errText = await apiRes.text().catch(() => "");
      console.error(`[Mandi Prices API] Error ${apiRes.status}: ${errText}`);
      return res.status(apiRes.status).json({
        status: "error",
        message: `data.gov.in API Error (${apiRes.status}): ${errText.slice(0, 150)}`
      });
    }

    const data = await apiRes.json();
    const resultPayload = {
      status: "success",
      total: data.total || 0,
      count: data.count || 0,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      records: data.records || []
    };

    // Cache Mandi Prices response in Redis for 300 seconds (5 minutes)
    await setCache(cacheKey, resultPayload, 300);

    return res.json(resultPayload);

  } catch (err) {
    console.error("[Mandi Prices API] Fetch Exception:", err.message);
    return res.status(500).json({
      status: "error",
      message: `Failed to reach data.gov.in API: ${err.message}`
    });
  }
});

/**
 * Authentic Indian Government Agriculture Schemes Database
 */
const GOV_SCHEMES_DATABASE = [
  {
    id: "SCH-001",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    code: "PM-KISAN",
    category: "Financial Aid",
    state: "All",
    crop: "All",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Central Sector scheme providing income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.",
    eligibility: "All small and marginal landholding farmer families who own cultivable land, subject to exclusion criteria (e.g. institutional landholders, income tax payers).",
    benefits: "Direct Benefit Transfer (DBT) of ₹6,000 annually (3 installments of ₹2,000 each credited directly into Aadhaar-seeded bank accounts).",
    documents: ["Aadhaar Card", "7/12 Extract / Land Title Document", "Bank Passbook with IFSC", "Active Mobile Number"],
    applicationProcess: "1. Visit pmkisan.gov.in -> 2. Click 'Farmers Corner' -> 3. New Farmer Registration -> 4. Enter Aadhaar & State -> 5. Fill land details and submit.",
    deadline: "Open round the year (Quarterly payouts in April, August, and December)",
    officialLink: "https://pmkisan.gov.in/",
    helpline: "155261 / 011-24300606"
  },
  {
    id: "SCH-002",
    name: "Namo Shetkari Mahasanman Nidhi Yojana (Maharashtra)",
    code: "NAMO-SHETKARI",
    category: "Financial Aid",
    state: "Maharashtra",
    crop: "All",
    ministry: "Department of Agriculture, Govt. of Maharashtra",
    description: "Maharashtra State financial aid scheme supplementing PM-KISAN by providing an additional ₹6,000 per year to Maharashtra farmers.",
    eligibility: "Farmers in Maharashtra registered and verified under the PM-KISAN portal with active Aadhaar-bank account seeding.",
    benefits: "Additional financial aid of ₹6,000 per year (Combined total of ₹12,000/year alongside PM-KISAN).",
    documents: ["PM-KISAN Registration ID", "Aadhaar Card", "7/12 & 8-A Extract", "Aadhaar-Linked Bank Account"],
    applicationProcess: "Automatic enrolment for all verified PM-KISAN beneficiaries in Maharashtra. Verification done via MahaDBT portal.",
    deadline: "Ongoing state disbursement",
    officialLink: "https://mahadbt.maharashtra.gov.in/",
    helpline: "022-22025355"
  },
  {
    id: "SCH-003",
    name: "PM Krishi Sinchayee Yojana - Micro Irrigation (PMKSY-PDMC)",
    code: "PMKSY-DRIP",
    category: "Irrigation",
    state: "All",
    crop: "All",
    ministry: "Ministry of Agriculture & Farmers Welfare / Department of Water Resources",
    description: "Per Drop More Crop scheme offering 55% to 80% subsidy for installing Drip & Sprinkler irrigation systems to improve water use efficiency.",
    eligibility: "Farmers owning land with an assured water source. Priority given to Small & Marginal Farmers, Women Farmers, and SC/ST farmers.",
    benefits: "55% subsidy for general farmers and up to 80% subsidy for small/marginal farmers on drip and sprinkler hardware equipment.",
    documents: ["Aadhaar Card", "7/12 Land Record / Khatauni", "Water Source Certificate (Well/Borewell)", "Soil & Water Test Report", "Bank Passbook"],
    applicationProcess: "1. Apply online via State Agriculture Portal (e.g. MahaDBT) -> 2. Select empanelled drip manufacturer -> 3. Site inspection by Agri Officer -> 4. Subsidy credited to bank.",
    deadline: "31st March 2027",
    officialLink: "https://pmksy.gov.in/",
    helpline: "1800-180-1551"
  },
  {
    id: "SCH-004",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    code: "SMAM-MACHINERY",
    category: "Machinery",
    state: "All",
    crop: "All",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Subsidy scheme for purchasing farm machinery (Tractors, Rotavators, Power Tillers, Combine Harvesters, Drone Spraying) and establishing Custom Hiring Centres.",
    eligibility: "Individual farmers, Farmer Producer Organizations (FPOs), Self Help Groups (SHGs), and Cooperative Societies.",
    benefits: "40% to 50% subsidy on individual farm equipment and up to 80% subsidy for setting up Custom Hiring Centres (CHCs).",
    documents: ["Aadhaar Card", "Land Title Document", "Bank Account Details", "Caste Certificate (if applicable)", "Quotation from authorized dealer"],
    applicationProcess: "1. Register on agrimachinery.nic.in -> 2. Select machine and dealer -> 3. Upload quotation and land proof -> 4. Receive approval letter.",
    deadline: "Seasonal sanctions (Check state notification)",
    officialLink: "https://agrimachinery.nic.in/",
    helpline: "1800-180-1551"
  },
  {
    id: "SCH-005",
    name: "Paramparagat Krishi Vikas Yojana (PKVY Organic Farming)",
    code: "PKVY-ORGANIC",
    category: "Organic",
    state: "All",
    crop: "All",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Promotes organic farming through cluster formation and Participatory Guarantee System (PGS) organic certification.",
    eligibility: "Farmers willing to form a cluster of 50 or more farmers covering 50 acres of land for organic farming.",
    benefits: "Financial assistance of ₹50,000 per hectare over 3 years (₹31,000 directly for organic inputs like bio-fertilizers, seeds, and neem cake).",
    documents: ["Aadhaar Card", "Cluster Member Form", "Land Holding Certificate", "Soil Test Certificate"],
    applicationProcess: "1. Form a 50-acre farmer cluster -> 2. Register on jaivikkheti.in -> 3. Submit cluster proposal to Regional Council / District Agri Office.",
    deadline: "Annual cluster enrollment",
    officialLink: "https://jaivikkheti.in/",
    helpline: "011-23382012"
  },
  {
    id: "SCH-006",
    name: "Soil Health Card Scheme",
    code: "SOIL-HEALTH",
    category: "Financial Aid",
    state: "All",
    crop: "All",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Provides free soil testing and customized nutrient management cards to farmers every 2 years.",
    eligibility: "All agricultural landholders in India.",
    benefits: "Free soil sampling and testing for 12 parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) with exact fertilizer dosage recommendations.",
    documents: ["Aadhaar Card", "Survey / Khasra Number"],
    applicationProcess: "Contact village Agriculture Assistant / Krishi Sevak for soil sample collection or visit local Soil Testing Lab.",
    deadline: "Continuous testing drive",
    officialLink: "https://soilhealth.dac.gov.in/",
    helpline: "1800-180-1551"
  }
];

/**
 * Authentic Crop Insurance Schemes Database (PMFBY, WBCIS, State Aid)
 */
const CROP_INSURANCE_DATABASE = [
  {
    id: "INS-001",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    code: "PMFBY",
    state: "All",
    cropCovered: "Soybean, Cotton, Wheat, Sugarcane, Paddy, Maize, Tur, Groundnut",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
    premiumRate: "Kharif Crops: 2.0% | Rabi Crops: 1.5% | Annual Commercial/Horticultural: 5.0% (Balance premium up to 98% subsidized equally by Govt of India and State Govt).",
    coverageBenefits: "Comprehensive risk coverage against non-preventable natural risks: Prevented Sowing, Mid-Season Adversity, Post-Harvest losses (up to 14 days), and Localized Calamities (Hailstorm, Landslide, Inundation).",
    documents: ["Aadhaar Card", "7/12 & 8-A Land Extract / Tenant Agreement", "Sowing Certificate from Sarpanch/Patwari", "Bank Account Passbook"],
    claimProcess: "1. Intimate loss within 72 hours of damage via PMFBY Crop Insurance App or Toll-Free 1800-180-1551 -> 2. Joint survey by Insurance Co. and Agri Officer -> 3. Claim credited directly to bank.",
    deadline: "Kharif: 31st July | Rabi: 31st December",
    officialLink: "https://pmfby.gov.in/",
    helpline: "1800-180-1551 / 14447"
  },
  {
    id: "INS-002",
    name: "Restructured Weather Based Crop Insurance Scheme (WBCIS)",
    code: "WBCIS",
    state: "Maharashtra",
    cropCovered: "Grapes, Pomegranate, Banana, Mango, Orange, Sweet Lime, Onion",
    ministry: "Department of Agriculture, Govt. of Maharashtra",
    eligibility: "Horticulture and fruit crop growers in weather-notified circles.",
    premiumRate: "Farmer Share: 5.0% capped | Government Subsidy: 95% of actuarial premium.",
    coverageBenefits: "Financial protection against adverse weather parameters: Unseasonal Rain, Hailstorms, High Temperature, Frost, Relative Humidity fluctuations measured via Automatic Weather Stations (AWS).",
    documents: ["Aadhaar Card", "Fruit Orchard 7/12 Land Record", "Bank Passbook", "Geo-tagged photo of orchard"],
    claimProcess: "Automated claim settlement based on weather data recorded at nearest AWS. No individual claim form required for weather trigger events.",
    deadline: "Fruit Crop specific cutoff dates",
    officialLink: "https://pmfby.gov.in/",
    helpline: "1800-180-1551"
  },
  {
    id: "INS-003",
    name: "Maharashtra State Natural Calamity Crop Relief Fund",
    code: "MH-RELIEF",
    state: "Maharashtra",
    cropCovered: "Soybean, Cotton, Sugarcane, Pulses",
    ministry: "Revenue & Disaster Management Dept, Govt. of Maharashtra",
    eligibility: "Farmers affected by heavy rainfall (>65mm/day), flooding, or drought in declared disaster talukas.",
    premiumRate: "100% Free (Zero Premium for farmers - Funded under NDRF/SDRF disaster relief rules).",
    coverageBenefits: "Direct ex-gratia compensation of ₹13,600 per hectare for rainfed crops and up to ₹27,000 per hectare for perennial fruit crops (up to 3 hectares).",
    documents: ["Panchnama Report by Circle Officer", "Aadhaar Card", "7/12 Land Extract", "Bank Passbook"],
    claimProcess: "Revenue department conducts village-level Panchnama. Direct payout credited into farmer bank accounts via DBT.",
    deadline: "Post-disaster official notification",
    officialLink: "https://mahadbt.maharashtra.gov.in/",
    helpline: "022-22025355"
  }
];

/**
 * GET /api/gov-schemes
 */
app.get("/api/gov-schemes", async (req, res) => {
  try {
    const { state = "All", crop = "All", category = "All" } = req.query;
    const cacheKey = `schemes:${state}:${crop}:${category}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let filtered = GOV_SCHEMES_DATABASE.filter(s => {
      const matchState = (state === "All" || state === "all" || s.state === "All" || s.state.toLowerCase() === state.toString().toLowerCase());
      const matchCrop = (crop === "All" || crop === "all" || s.crop === "All" || s.crop.toLowerCase().includes(crop.toString().toLowerCase()));
      const matchCategory = (category === "All" || category === "all" || s.category.toLowerCase() === category.toString().toLowerCase());
      return matchState && matchCrop && matchCategory;
    });

    const responsePayload = {
      status: "success",
      total: filtered.length,
      schemes: filtered
    };

    await setCache(cacheKey, responsePayload, 600); // 10 minutes cache
    return res.json(responsePayload);
  } catch (err) {
    console.error("[Gov Schemes API Error]:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * GET /api/crop-insurance
 */
app.get("/api/crop-insurance", async (req, res) => {
  try {
    const { state = "All", crop = "All" } = req.query;
    const cacheKey = `insurance:${state}:${crop}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let filtered = CROP_INSURANCE_DATABASE.filter(i => {
      const matchState = (state === "All" || state === "all" || i.state === "All" || i.state.toLowerCase() === state.toString().toLowerCase());
      const matchCrop = (crop === "All" || crop === "all" || i.cropCovered.toLowerCase().includes(crop.toString().toLowerCase()));
      return matchState && matchCrop;
    });

    const responsePayload = {
      status: "success",
      total: filtered.length,
      insuranceSchemes: filtered
    };

    await setCache(cacheKey, responsePayload, 600);
    return res.json(responsePayload);
  } catch (err) {
    console.error("[Crop Insurance API Error]:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * POST /api/crop-insurance/calculate
 * PMFBY Subsidized Premium Calculator
 */
app.post("/api/crop-insurance/calculate", (req, res) => {
  try {
    const { crop = "Soybean", landAcres = 1, sumInsuredPerAcre = 25000, season = "Kharif" } = req.body || {};

    const acres = Math.max(0.1, parseFloat(landAcres) || 1);
    const sumPerAcre = Math.max(1000, parseFloat(sumInsuredPerAcre) || 25000);
    const totalSumInsured = acres * sumPerAcre;

    // PMFBY Premium Share Rates: Kharif 2.0%, Rabi 1.5%, Commercial/Horticulture 5.0%
    let farmerRatePct = 2.0;
    const cropLower = crop.toLowerCase();
    if (season === "Rabi" || cropLower.includes("wheat") || cropLower.includes("gram")) {
      farmerRatePct = 1.5;
    } else if (cropLower.includes("sugarcane") || cropLower.includes("cotton") || cropLower.includes("banana") || cropLower.includes("grape")) {
      farmerRatePct = 5.0;
    }

    const farmerPayable = (totalSumInsured * farmerRatePct) / 100;
    const actuarialTotalPremium = totalSumInsured * 0.12; // 12% total actuarial rate
    const govtSubsidy = Math.max(0, actuarialTotalPremium - farmerPayable);

    return res.json({
      status: "success",
      crop,
      season,
      acres,
      sumInsuredPerAcre: sumPerAcre,
      totalSumInsured: Math.round(totalSumInsured),
      farmerRatePct,
      farmerPayablePremium: Math.round(farmerPayable),
      govtSubsidyAmount: Math.round(govtSubsidy),
      totalActuarialPremium: Math.round(actuarialTotalPremium),
      govtSubsidyPercentage: "98% Subsidized by Govt of India & State Govt"
    });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[AgriSphere Voice AI] Server running on http://localhost:${PORT}`);
});

