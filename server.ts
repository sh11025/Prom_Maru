import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// CORS & Preflight headers for production and cross-origin compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const PROM_MARU_SYSTEM_INSTRUCTION = `You are Prom_Maru, an expert prompt architect.

Your purpose is to help Korean-speaking users create high-quality prompts for generative AI tools.
You do NOT normally perform the user's requested task yourself.
Instead, you analyze what the user wants to create and produce an optimized English prompt that the user can copy and use in the selected target AI or generative tool.
The user interacts with you primarily in Korean.
The final usable prompt must be written in English, and you must also provide a complete Korean translation so the user can understand, review, and modify it.

# INPUT
The application may provide the following values:
- result_language: Language in which the target AI should produce its final result (e.g. 한국어, English)
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
- Only when missing information would MATERIALLY prevent generating a meaningful prompt (e.g., extremely vague request such as just "영상 만들어줘", "사진 하나 만들어줘", or "코드 짜줘" without any subject or context), set status to "question" and ask no more than 1 to 3 short, specific Korean questions with selectable options/examples (e.g., ["어떤 주제의 영상인가요? (예: 미래형 스포츠카 질주 / 자연 다큐멘터리)", "영상 분위기와 스타일은 어떻게 할까요? (예: 시네마틱 4K 실사 / 3D 애니메이션)"]).

# TARGET AI OPTIMIZATION PRINCIPLES
Maintain genuine differentiation across target AIs by optimizing the prompt's **content, structure, and emphasized elements**, while strictly avoiding unverified proprietary syntax, fictional parameters, or fabricated commands.

- auto (Auto): Do NOT use any platform-specific syntax or proprietary flags. Generate a clear, highly portable natural language prompt with balanced narrative, context, and structural directives that works seamlessly across multiple generative AIs.
- veo (Google Veo): Focus on cinematic natural language description—scene environment, camera framing/movement, subject action, lighting, visual atmosphere, and auditory/ambient sound elements described in vivid prose.
- sora (OpenAI Sora): Focus on continuous scene progression, subject kinetics, fluid spatial and temporal continuity, real-world physics, and volumetric environmental interactions described in rich natural language.
- google_flow (Google Flow): Focus on structured scene composition and video production flow (narrative beats, shot transitions, visual pacing, and narration/audio flow).
- higgsfield (Higgsfield): Focus on character and subject kinetics, dynamic camera staging (e.g., tracking shots, zooms, orbital moves), action choreography, and expressive motion energy described in natural language without proprietary parameter tags.
- midjourney (Midjourney): Focus on concrete visual depiction—subject details, composition, artistic style, lighting, color palette, camera perspective, and aesthetic mood in descriptive natural phrases.
- general LLMs (ChatGPT, Claude, Gemini): Clear Markdown structure, explicit Persona/Role, context, step-by-step task breakdown, and well-organized input/output constraints.
- audio/voice (ElevenLabs, Suno, Udio): Appropriate acoustic descriptions, vocal timbre, pacing, emotional delivery, or musical genre, tempo, and instrumentation described clearly in natural terms.
- code (Cursor, Copilot, Claude Code): Exact language, framework, architectural boundaries, data models, error handling, and technical constraints.

# STRICT SYNTAX SAFETY
- NEVER invent or hallucinate unverified proprietary syntax, fictional parameters, pseudo-code flags, or fabricated tool-specific command strings.
- Tailor prompts purely through high-fidelity natural language phrasing, appropriate organizational structure, and target-specific creative emphasis.

# RESULT LANGUAGE SPECIFICATION
- The prompt itself is written in English (prompt_en).
- Inside prompt_en, you MUST include an explicit language instruction for the target AI:
  - If result_language is "한국어" (Korean): Include an explicit directive such as:
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
  "questions": ["질문 1 (예시/선택지 포함)", "질문 2..."],
  "prompt_en": "",
  "prompt_ko": "",
  "review_status": "needs_improvement",
  "review": "<한국어로 누락된 필수 정보 설명>",
  "elements": { "context": "...", "role": "...", "audience": "...", "format": "...", "task": "..." }

# REFINEMENT & PARTIAL EDIT RULES
- Refinement ("더 다듬기"): If user answers refinement questions or asks to sharpen, incorporate answers, upgrade to "good", and regenerate the full English and Korean prompts and elements.
- Partial edit ("부분 수정"): Modify specifically the targeted element (Context, Role, Audience, Format, Task) according to the user's instruction, while preserving other aspects, and regenerate the COMPLETE English prompt, COMPLETE Korean translation, and updated elements.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Helper to resolve API Key: prioritize client provided key over environment
const resolveApiKey = (req: express.Request): string => {
  if (typeof req.headers['x-gemini-api-key'] === 'string') {
    return req.headers['x-gemini-api-key'].trim();
  }
  if (typeof req.body?.apiKey === 'string') {
    return req.body.apiKey.trim();
  }
  if (typeof req.body?.api_key === 'string') {
    return req.body.api_key.trim();
  }
  return (process.env.GEMINI_API_KEY || '').trim();
};

// Gemini Connection Test Endpoint
app.post('/api/gemini/test-connection', async (req, res) => {
  try {
    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      return res.status(400).json({
        connected: false,
        message: 'API Key를 입력해주세요.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const startTime = Date.now();
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let success = false;
    for (const model of candidateModels) {
      try {
        await ai.models.generateContent({
          model,
          contents: 'ping',
        });
        success = true;
        break;
      } catch (err: any) {
        // try next model
      }
    }
    const latency = Date.now() - startTime;

    if (success) {
      res.json({
        connected: true,
        latency,
        message: 'Gemini 연결됨',
      });
    } else {
      res.status(400).json({
        connected: false,
        message: 'API Key를 확인해주세요.',
      });
    }
  } catch (err: any) {
    console.warn('Test connection attempt failed');
    res.status(400).json({
      connected: false,
      message: 'API Key를 확인해주세요.',
    });
  }
});

// Prom_Maru Generation Endpoint
app.post('/api/prom-maru/generate', async (req, res) => {
  try {
    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      return res.status(400).json({
        error: 'Gemini API Key를 입력해주세요.',
      });
    }

    const {
      result_language = '한국어',
      result_category = 'document',
      result_type = '블로그 포스팅',
      target_ai = 'auto',
      user_topic = '',
      conversation_context = [],
      edit_mode = 'create', // 'create' | 'refine' | 'partial'
      edit_target = 'none', // 'Context' | 'Role' | 'Audience' | 'Format' | 'Task' | 'none'
      instruction = '',
      current_elements = null,
      current_prompt_en = '',
      current_prompt_ko = '',
    } = req.body;

    if (!user_topic && !instruction && conversation_context.length === 0) {
      return res.status(400).json({ error: 'user_topic or instruction is required.' });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Helper function to extract and parse JSON safely
    const parseGeminiJson = (text: string) => {
      let cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
      try {
        return JSON.parse(cleaned);
      } catch (e1) {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const sub = cleaned.substring(start, end + 1);
          return JSON.parse(sub);
        }
        throw e1;
      }
    };

    // Construct user prompt for Prom_Maru
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
      ...(current_elements ? { current_elements } : {}),
      ...(current_prompt_en ? { current_prompt_en } : {}),
      ...(current_prompt_ko ? { current_prompt_ko } : {}),
    };

    let userPromptText = `User Request for Prom_Maru:\n${JSON.stringify(userPromptPayload, null, 2)}\n\n`;

    if (edit_mode === 'create') {
      if (conversation_context && conversation_context.length > 0) {
        userPromptText += `The user has answered the previous questions. Please incorporate all confirmed information and generate the complete final draft with prompt_en, prompt_ko, elements, review_status, and review. Set status to 'draft'.`;
      } else {
        userPromptText += `Please analyze the user's topic and generate the prompt draft directly (status: 'draft') if the user provided sufficient details or if sensible defaults can be inferred. Only ask 1 to 3 questions (status: 'question') if the request is so severely lacking in essential details that no meaningful prompt can be formed (e.g., user just said '영상 만들어줘' or '그림 그려줘'). Be sure to tailor prompt_en distinctly to the selected target_ai ('${target_ai}') and include the output language directive matching result_language ('${result_language}').`;
      }
    } else if (edit_mode === 'refine') {
      if (!instruction && (!conversation_context || conversation_context.length === 0)) {
        // User clicked "더 다듬기" -> Ask up to 3 questions
        userPromptText += `The user clicked "더 다듬기" (Refine). Inspect the current prompt, identify only the highest-value missing information to make it even more exceptional, and ask 1 to 3 concise Korean questions with suggestions. Set status to 'question', questions to the list of 1~3 questions, and briefly explain in Korean in review.`;
      } else {
        // User answered refinement questions -> Generate upgraded draft
        userPromptText += `The user provided refinement answers/instructions: "${instruction}". Incorporate them to sharpen the prompt to 'good' review status, and regenerate the COMPLETE prompt_en, COMPLETE prompt_ko, updated elements, and review. Set status to 'draft'.`;
      }
    } else if (edit_mode === 'partial') {
      userPromptText += `The user wants to modify specifically "${edit_target}". Modify that specific component as requested in the instruction ("${instruction}") while strictly keeping all other existing requirements intact, and regenerate the COMPLETE prompt_en, COMPLETE prompt_ko, updated elements, and review. Set status to 'draft'.`;
    }

    // Helper to generate content with fallback and retry
    const generateWithRetry = async (prompt: string, config: any) => {
      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let lastError: any = null;

      for (const model of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents: prompt,
              config,
            });
            return resp;
          } catch (err: any) {
            lastError = err;
            const msg = String(err.message || '');
            if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('Forbidden') || msg.includes('API key') || msg.includes('INVALID_ARGUMENT')) {
              throw err; // Fail fast immediately on invalid API key
            }
            console.warn(`Attempt ${attempt + 1} with model ${model} failed:`, err.message || err);
            // Wait 1.5s before retry
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }
      throw lastError;
    };

    let parsedData: any = null;
    let attempts = 0;
    const maxParseAttempts = 2; // Auto-retry 1 time on parse failure

    while (attempts < maxParseAttempts) {
      attempts++;
      const currentPrompt =
        attempts === 1
          ? userPromptText
          : `${userPromptText}\n\nIMPORTANT: You must output ONLY a valid JSON object matching the requested schema. No code fences, no introductory text.`;

      const response = await generateWithRetry(currentPrompt, {
        systemInstruction: PROM_MARU_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: attempts === 1 ? 0.4 : 0.2,
      });

      const rawText = response.text || '{}';
      try {
        parsedData = parseGeminiJson(rawText);
        break; // Successfully parsed!
      } catch (parseErr: any) {
        console.warn(`JSON parse attempt ${attempts} failed:`, parseErr.message);
        if (attempts >= maxParseAttempts) {
          return res.status(500).json({
            error: 'AI 응답을 JSON으로 변환하는 데 실패했습니다. 다시 시도해 주세요.',
            canRetry: true,
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Ensure elements structure
    if (!parsedData.elements) {
      parsedData.elements = {
        context: '',
        role: '',
        audience: '',
        format: '',
        task: '',
      };
    }

    res.json(parsedData);
  } catch (err: any) {
    const rawMsg = (err && err.message) ? String(err.message) : '';
    let userMsg = '프롬프트 생성 중 오류가 발생했습니다. 다시 시도해 주세요.';
    if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('API key not valid') || rawMsg.includes('Forbidden')) {
      userMsg = '유효하지 않은 Gemini API Key입니다. 설정에서 API Key를 확인해 주세요.';
    } else if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('quota') || rawMsg.includes('rate limit')) {
      userMsg = 'Gemini API 호출 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.';
    }
    res.status(500).json({
      error: userMsg,
    });
  }
});

// Prom_Maru Simulation Endpoint (Test the prompt with Gemini)
app.post('/api/prom-maru/simulate', async (req, res) => {
  try {
    const apiKey = resolveApiKey(req);

    if (!apiKey) {
      return res.status(400).json({
        error: 'Gemini API Key를 입력해주세요.',
      });
    }

    const { prompt_en, target_ai = 'auto' } = req.body;
    if (!prompt_en) {
      return res.status(400).json({ error: 'prompt_en is required.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Run simulation with fallback
    let responseText = '';
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    for (const model of candidateModels) {
      try {
        const resp = await ai.models.generateContent({
          model,
          contents: prompt_en,
          config: {
            temperature: 0.7,
          },
        });
        responseText = resp.text || '';
        break;
      } catch (err: any) {
        console.warn(`Simulate attempt with model ${model} failed:`, err.message || err);
      }
    }

    res.json({
      result: responseText,
    });
  } catch (err: any) {
    console.error('Error in /api/prom-maru/simulate:', err);
    res.status(500).json({
      error: err.message || 'Failed to simulate prompt execution.',
    });
  }
});

// Prevent SPA fallback from capturing unhandled /api/* requests
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (!isProduction && !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    console.warn('Production build dist folder not found. Please run "npm run build" first.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prom_Maru server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
