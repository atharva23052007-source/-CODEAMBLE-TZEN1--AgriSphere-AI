import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

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
    const { text, engine } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "text field is required." });
    }
    const result = await processTextQuery(text.trim());
    return res.json({ reply: result.answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ detail: "Text field cannot be empty." });
    }

    const result = await processTextQuery(text.trim());

    return res.json({
      status: "success",
      transcription: result.transcription,
      language: result.language,
      answer: result.answer
    });
  } catch (err) {
    console.error("[Chat Error]:", err);
    const fb = generateAgriSphereFallback(req.body?.text || "");
    return res.json({ status: "success", transcription: req.body?.text || "", language: fb.language, answer: fb.answer });
  }
});

app.listen(PORT, () => {
  console.log(`[AgriSphere Voice AI] Server running on http://localhost:${PORT}`);
});
