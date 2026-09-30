// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-gemini-api-key");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var PROM_MARU_SYSTEM_INSTRUCTION = `You are Prom_Maru, an expert prompt architect.

Your purpose is to help Korean-speaking users create high-quality prompts for generative AI tools.
You do NOT normally perform the user's requested task yourself.
Instead, you analyze what the user wants to create and produce an optimized English prompt that the user can copy and use in the selected target AI or generative tool.
The user interacts with you primarily in Korean.
The final usable prompt must be written in English, and you must also provide a complete Korean translation so the user can understand, review, and modify it.

# INPUT
The application may provide the following values:
- result_language: Language in which the target AI should produce its final result (e.g. \uD55C\uAD6D\uC5B4, English)
- result_category: Main category of the desired result (Document, Image, Presentation, Video, Audio, Code, Data, Other)
- result_type: Specific type of desired result
- target_ai: Target AI/tool, or auto
- user_topic: User's description of what they want to create
- conversation_context: Relevant information collected during previous turns
- edit_mode: Normal creation ('create'), refinement ('refine'), or partial modification ('partial')
- edit_target: Context, Role, Audience, Format, Task, or none
- instruction: Specific instructions for modification or answers to questions

# CORE PROMPT FRAMEWORK
Every completed prompt should account for these five components:
1. Context: Background, purpose, situation, relevant information, constraints, requirements, and conditions.
2. Role: The role or expertise the target AI should adopt when that improves the result. Infer an appropriate role when not specified. Do not force an artificial expert role when it provides no benefit.
3. Audience: The intended audience, user, viewer, listener, reader, customer, or recipient. Infer this when reasonably possible.
4. Format: The structure and characteristics of the requested result reflecting both result_category and result_type. For multimodal generation (Image/Video/Audio), Format includes composition, duration, aspect ratio, visual/audio style, pacing, lighting, or data structure.
5. Task: Clearly describe what the target AI must actually accomplish, logically organized.

# PRIMARY BEHAVIOR & QUESTIONING
- Prioritize minimum questioning.
- If the user provides a concrete, descriptive topic (e.g., detailed subject, style, context, or visual elements), DO NOT ask questions. Generate the draft directly (status: "draft", questions: [])!
- Task and Context are most important. Role and Audience should normally be inferred logically from the topic.
- Only when missing information would MATERIALLY prevent generating a meaningful prompt (e.g., extremely vague request such as just "\uC601\uC0C1 \uB9CC\uB4E4\uC5B4\uC918", "\uC0AC\uC9C4 \uD558\uB098 \uB9CC\uB4E4\uC5B4\uC918", or "\uCF54\uB4DC \uC9DC\uC918" without any subject or context), set status to "question" and ask no more than 1 to 3 short, specific Korean questions with selectable options/examples (e.g., ["\uC5B4\uB5A4 \uC8FC\uC81C\uC758 \uC601\uC0C1\uC778\uAC00\uC694? (\uC608: \uBBF8\uB798\uD615 \uC2A4\uD3EC\uCE20\uCE74 \uC9C8\uC8FC / \uC790\uC5F0 \uB2E4\uD050\uBA58\uD130\uB9AC)", "\uC601\uC0C1 \uBD84\uC704\uAE30\uC640 \uC2A4\uD0C0\uC77C\uC740 \uC5B4\uB5BB\uAC8C \uD560\uAE4C\uC694? (\uC608: \uC2DC\uB124\uB9C8\uD2F1 4K \uC2E4\uC0AC / 3D \uC560\uB2C8\uBA54\uC774\uC158)"]).

# TARGET AI OPTIMIZATION PRINCIPLES
Maintain genuine differentiation across target AIs by optimizing the prompt's **content, structure, and emphasized elements**, while strictly avoiding unverified proprietary syntax, fictional parameters, or fabricated commands.

- auto (Auto): Do NOT use any platform-specific syntax or proprietary flags. Generate a clear, highly portable natural language prompt with balanced narrative, context, and structural directives that works seamlessly across multiple generative AIs.
- veo (Google Veo): Focus on cinematic natural language description\u2014scene environment, camera framing/movement, subject action, lighting, visual atmosphere, and auditory/ambient sound elements described in vivid prose.
- sora (OpenAI Sora): Focus on continuous scene progression, subject kinetics, fluid spatial and temporal continuity, real-world physics, and volumetric environmental interactions described in rich natural language.
- google_flow (Google Flow): Focus on structured scene composition and video production flow (narrative beats, shot transitions, visual pacing, and narration/audio flow).
- higgsfield (Higgsfield): Focus on character and subject kinetics, dynamic camera staging (e.g., tracking shots, zooms, orbital moves), action choreography, and expressive motion energy described in natural language without proprietary parameter tags.
- midjourney (Midjourney): Focus on concrete visual depiction\u2014subject details, composition, artistic style, lighting, color palette, camera perspective, and aesthetic mood in descriptive natural phrases.
- general LLMs (ChatGPT, Claude, Gemini): Clear Markdown structure, explicit Persona/Role, context, step-by-step task breakdown, and well-organized input/output constraints.
- audio/voice (ElevenLabs, Suno, Udio): Appropriate acoustic descriptions, vocal timbre, pacing, emotional delivery, or musical genre, tempo, and instrumentation described clearly in natural terms.
- code (Cursor, Copilot, Claude Code): Exact language, framework, architectural boundaries, data models, error handling, and technical constraints.

# STRICT SYNTAX SAFETY
- NEVER invent or hallucinate unverified proprietary syntax, fictional parameters, pseudo-code flags, or fabricated tool-specific command strings.
- Tailor prompts purely through high-fidelity natural language phrasing, appropriate organizational structure, and target-specific creative emphasis.

# RESULT LANGUAGE SPECIFICATION
- The prompt itself is written in English (prompt_en).
- Inside prompt_en, you MUST include an explicit language instruction for the target AI:
  - If result_language is "\uD55C\uAD6D\uC5B4" (Korean): Include an explicit directive such as:
    "Language Directive: The final generated output/content must be written entirely in natural, professional Korean."
  - If result_language is "English": Include an explicit directive such as:
    "Language Directive: The final generated output/content must be written entirely in fluent, professional English."
  - If any other language is specified, mandate that specific language.

# RESPONSE FORMAT
Return valid JSON only. Do not include Markdown code fences or extra text.
{
  "status": "question | draft",
  "questions": [],
  "prompt_en": "",
  "prompt_ko": "",
  "review_status": "good | could_improve | needs_improvement",
  "review": "",
  "elements": {
    "context": "",
    "role": "",
    "audience": "",
    "format": "",
    "task": ""
  }
}

# DRAFT vs QUESTION RULES
- If enough info exists:
  "status": "draft",
  "questions": [],
  "prompt_en": "<complete English prompt without code fences>",
  "prompt_ko": "<complete Korean translation without code fences>",
  "review_status": "good" or "could_improve",
  "review": "<concise Korean explanation of prompt quality>",
  "elements": { "context": "...", "role": "...", "audience": "...", "format": "...", "task": "..." }

- If crucial info is missing:
  "status": "question",
  "questions": ["\uC9C8\uBB38 1 (\uC608\uC2DC/\uC120\uD0DD\uC9C0 \uD3EC\uD568)", "\uC9C8\uBB38 2..."],
  "prompt_en": "",
  "prompt_ko": "",
  "review_status": "needs_improvement",
  "review": "<\uD55C\uAD6D\uC5B4\uB85C \uB204\uB77D\uB41C \uD544\uC218 \uC815\uBCF4 \uC124\uBA85>",
  "elements": { "context": "...", "role": "...", "audience": "...", "format": "...", "task": "..." }

# REFINEMENT & PARTIAL EDIT RULES
- Refinement ("\uB354 \uB2E4\uB4EC\uAE30"): If user answers refinement questions or asks to sharpen, incorporate answers, upgrade to "good", and regenerate the full English and Korean prompts and elements.
- Partial edit ("\uBD80\uBD84 \uC218\uC815"): Modify specifically the targeted element (Context, Role, Audience, Format, Task) according to the user's instruction, while preserving other aspects, and regenerate the COMPLETE English prompt, COMPLETE Korean translation, and updated elements.`;
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});
var resolveApiKey = (req) => {
  if (typeof req.headers["x-gemini-api-key"] === "string") {
    return req.headers["x-gemini-api-key"].trim();
  }
  if (typeof req.body?.apiKey === "string") {
    return req.body.apiKey.trim();
  }
  if (typeof req.body?.api_key === "string") {
    return req.body.api_key.trim();
  }
  return (process.env.GEMINI_API_KEY || "").trim();
};
app.post("/api/gemini/test-connection", async (req, res) => {
  try {
    const apiKey = resolveApiKey(req);
    if (!apiKey) {
      return res.status(400).json({
        connected: false,
        message: "API Key\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694."
      });
    }
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const startTime = Date.now();
    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let success = false;
    for (const model of candidateModels) {
      try {
        await ai.models.generateContent({
          model,
          contents: "ping"
        });
        success = true;
        break;
      } catch (err) {
      }
    }
    const latency = Date.now() - startTime;
    if (success) {
      res.json({
        connected: true,
        latency,
        message: "Gemini \uC5F0\uACB0\uB428"
      });
    } else {
      res.status(400).json({
        connected: false,
        message: "API Key\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694."
      });
    }
  } catch (err) {
    console.warn("Test connection attempt failed");
    res.status(400).json({
      connected: false,
      message: "API Key\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694."
    });
  }
});
app.post("/api/prom-maru/generate", async (req, res) => {
  try {
    const apiKey = resolveApiKey(req);
    if (!apiKey) {
      return res.status(400).json({
        error: "Gemini API Key\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694."
      });
    }
    const {
      result_language = "\uD55C\uAD6D\uC5B4",
      result_category = "document",
      result_type = "\uBE14\uB85C\uADF8 \uD3EC\uC2A4\uD305",
      target_ai = "auto",
      user_topic = "",
      conversation_context = [],
      edit_mode = "create",
      // 'create' | 'refine' | 'partial'
      edit_target = "none",
      // 'Context' | 'Role' | 'Audience' | 'Format' | 'Task' | 'none'
      instruction = "",
      current_elements = null,
      current_prompt_en = "",
      current_prompt_ko = ""
    } = req.body;
    if (!user_topic && !instruction && conversation_context.length === 0) {
      return res.status(400).json({ error: "user_topic or instruction is required." });
    }
    const ai = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const parseGeminiJson = (text) => {
      let cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "").trim();
      try {
        return JSON.parse(cleaned);
      } catch (e1) {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          const sub = cleaned.substring(start, end + 1);
          return JSON.parse(sub);
        }
        throw e1;
      }
    };
    const userPromptPayload = {
      result_language,
      result_category,
      result_type,
      target_ai,
      user_topic,
      conversation_context,
      edit_mode,
      edit_target,
      instruction,
      ...current_elements ? { current_elements } : {},
      ...current_prompt_en ? { current_prompt_en } : {},
      ...current_prompt_ko ? { current_prompt_ko } : {}
    };
    let userPromptText = `User Request for Prom_Maru:
${JSON.stringify(userPromptPayload, null, 2)}

`;
    if (edit_mode === "create") {
      if (conversation_context && conversation_context.length > 0) {
        userPromptText += `The user has answered the previous questions. Please incorporate all confirmed information and generate the complete final draft with prompt_en, prompt_ko, elements, review_status, and review. Set status to 'draft'.`;
      } else {
        userPromptText += `Please analyze the user's topic and generate the prompt draft directly (status: 'draft') if the user provided sufficient details or if sensible defaults can be inferred. Only ask 1 to 3 questions (status: 'question') if the request is so severely lacking in essential details that no meaningful prompt can be formed (e.g., user just said '\uC601\uC0C1 \uB9CC\uB4E4\uC5B4\uC918' or '\uADF8\uB9BC \uADF8\uB824\uC918'). Be sure to tailor prompt_en distinctly to the selected target_ai ('${target_ai}') and include the output language directive matching result_language ('${result_language}').`;
      }
    } else if (edit_mode === "refine") {
      if (!instruction && (!conversation_context || conversation_context.length === 0)) {
        userPromptText += `The user clicked "\uB354 \uB2E4\uB4EC\uAE30" (Refine). Inspect the current prompt, identify only the highest-value missing information to make it even more exceptional, and ask 1 to 3 concise Korean questions with suggestions. Set status to 'question', questions to the list of 1~3 questions, and briefly explain in Korean in review.`;
      } else {
        userPromptText += `The user provided refinement answers/instructions: "${instruction}". Incorporate them to sharpen the prompt to 'good' review status, and regenerate the COMPLETE prompt_en, COMPLETE prompt_ko, updated elements, and review. Set status to 'draft'.`;
      }
    } else if (edit_mode === "partial") {
      userPromptText += `The user wants to modify specifically "${edit_target}". Modify that specific component as requested in the instruction ("${instruction}") while strictly keeping all other existing requirements intact, and regenerate the COMPLETE prompt_en, COMPLETE prompt_ko, updated elements, and review. Set status to 'draft'.`;
    }
    const generateWithRetry = async (prompt, config) => {
      const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let lastError = null;
      for (const model of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents: prompt,
              config
            });
            return resp;
          } catch (err) {
            lastError = err;
            const msg = String(err.message || "");
            if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || msg.includes("Forbidden") || msg.includes("API key") || msg.includes("INVALID_ARGUMENT")) {
              throw err;
            }
            console.warn(`Attempt ${attempt + 1} with model ${model} failed:`, err.message || err);
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }
      throw lastError;
    };
    let parsedData = null;
    let attempts = 0;
    const maxParseAttempts = 2;
    while (attempts < maxParseAttempts) {
      attempts++;
      const currentPrompt = attempts === 1 ? userPromptText : `${userPromptText}

IMPORTANT: You must output ONLY a valid JSON object matching the requested schema. No code fences, no introductory text.`;
      const response = await generateWithRetry(currentPrompt, {
        systemInstruction: PROM_MARU_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: attempts === 1 ? 0.4 : 0.2
      });
      const rawText = response.text || "{}";
      try {
        parsedData = parseGeminiJson(rawText);
        break;
      } catch (parseErr) {
        console.warn(`JSON parse attempt ${attempts} failed:`, parseErr.message);
        if (attempts >= maxParseAttempts) {
          return res.status(500).json({
            error: "AI \uC751\uB2F5\uC744 JSON\uC73C\uB85C \uBCC0\uD658\uD558\uB294 \uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
            canRetry: true
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    }
    if (!parsedData.elements) {
      parsedData.elements = {
        context: "",
        role: "",
        audience: "",
        format: "",
        task: ""
      };
    }
    res.json(parsedData);
  } catch (err) {
    const rawMsg = err && err.message ? String(err.message) : "";
    let userMsg = "\uD504\uB86C\uD504\uD2B8 \uC0DD\uC131 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";
    if (rawMsg.includes("API_KEY_INVALID") || rawMsg.includes("API key not valid") || rawMsg.includes("Forbidden")) {
      userMsg = "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 Gemini API Key\uC785\uB2C8\uB2E4. \uC124\uC815\uC5D0\uC11C API Key\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.";
    } else if (rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("quota") || rawMsg.includes("rate limit")) {
      userMsg = "Gemini API \uD638\uCD9C \uD55C\uB3C4\uB97C \uCD08\uACFC\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";
    }
    res.status(500).json({
      error: userMsg
    });
  }
});
app.post("/api/prom-maru/simulate", async (req, res) => {
  try {
    const apiKey = resolveApiKey(req);
    if (!apiKey) {
      return res.status(400).json({
        error: "Gemini API Key\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694."
      });
    }
    const { prompt_en, target_ai = "auto" } = req.body;
    if (!prompt_en) {
      return res.status(400).json({ error: "prompt_en is required." });
    }
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    let responseText = "";
    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    for (const model of candidateModels) {
      try {
        const resp = await ai.models.generateContent({
          model,
          contents: prompt_en,
          config: {
            temperature: 0.7
          }
        });
        responseText = resp.text || "";
        break;
      } catch (err) {
        console.warn(`Simulate attempt with model ${model} failed:`, err.message || err);
      }
    }
    res.json({
      result: responseText
    });
  } catch (err) {
    console.error("Error in /api/prom-maru/simulate:", err);
    res.status(500).json({
      error: err.message || "Failed to simulate prompt execution."
    });
  }
});
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const distPath = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(distPath);
  if (!isProduction && !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else if (hasDist) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    console.warn('Production build dist folder not found. Please run "npm run build" first.');
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prom_Maru server running at http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
