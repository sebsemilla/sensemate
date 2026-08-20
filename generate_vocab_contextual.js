#!/usr/bin/env node
// generate_vocab_contextual.js — Generador de vocabulario contextual por nivel CEFR
// Uso:
//   node generate_vocab_contextual.js --target=en --source=es --level=A1
//   node generate_vocab_contextual.js --target=en --source=es --level=A1 --count=5
//   node generate_vocab_contextual.js --target=en --source=fr --level=A1 --from=es
//   node generate_vocab_contextual.js --list
//   node generate_vocab_contextual.js --target=es --source=es --level=A1 --provider=mistral
//
// Genera grupos de vocabulario embebidos en micro-diálogos reales,
// priorizando las palabras de mayor frecuencia por nivel CEFR.
// Guarda progreso y puede retomarse si se interrumpe.
// Con --from=<lang> reutiliza los diálogos ya generados y solo traduce
// las explicaciones al nuevo idioma fuente (más rápido y consistente).
// Proveedores soportados: deepseek (default), mistral, gemini, groq
// Auto-fallback: si DeepSeek devuelve 402, cambia a Mistral automáticamente.

import OpenAI  from 'openai';
import fs      from 'fs';
import path    from 'path';
import dotenv  from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let activeClient;
let activeModel;
let activeProviderName;
let fallbackAvailable = false;

function setDeepSeek() {
    activeClient = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' });
    activeModel = 'deepseek-chat';
    activeProviderName = 'DeepSeek';
}
function setMistral() {
    activeClient = new OpenAI({ apiKey: process.env.MISTRAL_API_KEY, baseURL: 'https://api.mistral.ai/v1' });
    activeModel = 'mistral-small-latest';
    activeProviderName = 'Mistral';
}
function setGemini() {
    activeClient = new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' });
    activeModel = 'gemini-2.0-flash';
    activeProviderName = 'Gemini';
}
function setGroq() {
    activeClient = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
    activeModel = 'llama-3.3-70b-versatile';
    activeProviderName = 'Groq';
}
function setOpenRouter(model) {
    activeClient = new OpenAI({
        apiKey:   process.env.OPENROUTER_API_KEY,
        baseURL:  'https://openrouter.ai/api/v1',
        defaultHeaders: {
            'HTTP-Referer': 'https://sensemate.app',
            'X-Title':      'SenseMate',
        },
    });
    activeModel = model || 'meta-llama/llama-3.3-70b-instruct';
    activeProviderName = 'OpenRouter';
}

function initProvider(providerArg, modelArg) {
    const has = {
        ds: !!process.env.DEEPSEEK_API_KEY,
        mi: !!process.env.MISTRAL_API_KEY,
        ge: !!process.env.GEMINI_API_KEY,
        gr: !!process.env.GROQ_API_KEY,
        or: !!process.env.OPENROUTER_API_KEY,
    };
    if (providerArg === 'openrouter') {
        if (!has.or) { console.error('❌ Falta OPENROUTER_API_KEY en .env'); process.exit(1); }
        setOpenRouter(modelArg);
    } else if (providerArg === 'mistral') {
        if (!has.mi) { console.error('❌ Falta MISTRAL_API_KEY en .env'); process.exit(1); }
        setMistral();
    } else if (providerArg === 'gemini') {
        if (!has.ge) { console.error('❌ Falta GEMINI_API_KEY en .env'); process.exit(1); }
        setGemini(); fallbackAvailable = has.mi || has.gr || has.or;
    } else if (providerArg === 'groq') {
        if (!has.gr) { console.error('❌ Falta GROQ_API_KEY en .env'); process.exit(1); }
        setGroq();
    } else if (providerArg === 'deepseek') {
        if (!has.ds) { console.error('❌ Falta DEEPSEEK_API_KEY en .env'); process.exit(1); }
        setDeepSeek(); fallbackAvailable = has.mi || has.gr || has.ge || has.or;
    } else {
        if (!has.ds && !has.mi && !has.ge && !has.gr && !has.or) { console.error('❌ Falta al menos un API key en .env'); process.exit(1); }
        if (has.or) { setOpenRouter(modelArg); fallbackAvailable = has.ds || has.mi || has.gr || has.ge; }
        else if (has.ds) { setDeepSeek(); fallbackAvailable = has.mi || has.gr || has.ge; }
        else if (has.mi) { setMistral(); }
        else if (has.gr) { setGroq(); }
        else { setGemini(); }
    }
    console.log(`🔌 Proveedor: ${activeProviderName} (${activeModel})`);
}

function tryFallback(errMsg) {
    if (!fallbackAvailable) return false;
    const from = activeProviderName;
    const next = [
        ['Mistral',    process.env.MISTRAL_API_KEY,    setMistral],
        ['Groq',       process.env.GROQ_API_KEY,       setGroq],
        ['Gemini',     process.env.GEMINI_API_KEY,     setGemini],
        ['OpenRouter', process.env.OPENROUTER_API_KEY, () => setOpenRouter()],
    ].find(([name, key]) => key && name !== from);
    if (!next) return false;
    console.warn(`\n⚠️  ${from} sin saldo — cambiando a ${next[0]}…\n`);
    next[2](); fallbackAvailable = false; return true;
}

function providerMaxTokens() { return activeProviderName === 'DeepSeek' ? 4000 : 8192; }

function parseRetryAfterMs(errMsg) {
    let ms = 0;
    const h = errMsg.match(/(\d+)h/);    if (h)  ms += parseInt(h[1])  * 3600000;
    const m = errMsg.match(/(\d+)m/);    if (m)  ms += parseInt(m[1])  * 60000;
    const s = errMsg.match(/([\d.]+)s/); if (s)  ms += parseFloat(s[1]) * 1000;
    return ms > 0 ? ms + 5000 : 65000;
}

// ─── Metadatos de idiomas ──────────────────────────────────────

const LANGS = {
    es: { name: 'Español',    nameEn: 'Spanish',    dir: 'español'   },
    en: { name: 'Inglés',     nameEn: 'English',    dir: 'ingles'    },
    fr: { name: 'Francés',    nameEn: 'French',     dir: 'frances'   },
    pt: { name: 'Portugués',  nameEn: 'Portuguese', dir: 'portugues' },
    de: { name: 'Alemán',     nameEn: 'German',     dir: 'aleman'    },
    it: { name: 'Italiano',   nameEn: 'Italian',    dir: 'italiano'  },
    zh: { name: 'Chino',      nameEn: 'Mandarin',   dir: 'chino'     },
    ja: { name: 'Japonés',    nameEn: 'Japanese',   dir: 'japones'   },
    ko: { name: 'Coreano',    nameEn: 'Korean',     dir: 'coreano'   },
    ru: { name: 'Ruso',       nameEn: 'Russian',    dir: 'ruso'      },
    ar: { name: 'Árabe',      nameEn: 'Arabic',     dir: 'arabe'     },
    gn: { name: 'Guaraní',    nameEn: 'Guaraní',    dir: 'guarani'   },
    qu: { name: 'Quechua',    nameEn: 'Quechua',    dir: 'quechua'   },
    wo: { name: 'Wolof',      nameEn: 'Wolof',      dir: 'wolof'     },
    ha: { name: 'Hausa',      nameEn: 'Hausa',      dir: 'hausa'     },
    yo: { name: 'Yoruba',     nameEn: 'Yoruba',     dir: 'yoruba'    },
    ig: { name: 'Igbo',       nameEn: 'Igbo',       dir: 'igbo'      },
    ff: { name: 'Pulaar',     nameEn: 'Pulaar',     dir: 'pulaar'    },
    sw: { name: 'Swahili',    nameEn: 'Swahili',    dir: 'swahili'   },
    am: { name: 'Amhárico',   nameEn: 'Amharic',    dir: 'amharico'  },
    om: { name: 'Oromo',      nameEn: 'Oromo',      dir: 'oromo'     },
    ln: { name: 'Lingala',    nameEn: 'Lingala',    dir: 'lingala'   },
    so: { name: 'Somalí',     nameEn: 'Somali',     dir: 'somali'    },
    zu: { name: 'Zulú',       nameEn: 'Zulu',       dir: 'zulu'      },
    rw: { name: 'Kinyarwanda',nameEn: 'Kinyarwanda',dir: 'kinyarwanda'},
    tw: { name: 'Twi',        nameEn: 'Twi',        dir: 'twi'       },
    bm: { name: 'Bambara',    nameEn: 'Bambara',    dir: 'bambara'   },
};

// ─── Bandas de frecuencia por nivel ───────────────────────────
// Indica qué rango del léxico más frecuente del idioma cubrir

const FREQ_BANDS = {
    A1: { range: 'top 300 most frequent words',        count: 10, turns: '4–5'  },
    A2: { range: 'words ranked ~300–700 by frequency', count: 10, turns: '5–6'  },
    B1: { range: 'words ranked ~700–1500 by frequency', count: 11, turns: '6–7' },
    B2: { range: 'words ranked ~1500–3000 by frequency', count: 12, turns: '7–8'},
    C1: { range: 'words ranked ~3000–6000 by frequency', count: 12, turns: '8–9'},
};

// ─── Escenarios de diálogo por nivel ──────────────────────────
// Situaciones reales variadas para anclar el vocabulario en contexto

const SCENARIOS = {
    A1: [
        'Greeting someone for the first time',
        'Asking where something is in a store',
        'Ordering a drink at a café',
        'Buying a ticket at a station',
        'Checking in at a hotel reception',
        'Meeting a new neighbor',
        'Asking the time on the street',
        'At the doctor for a basic checkup',
        'Paying at a supermarket checkout',
        'Calling a friend to make simple plans',
        'Describing your family to someone',
        'Asking for directions in the street',
        'On a bus asking the driver for help',
        'Introducing a colleague at work',
        'Leaving a voicemail message',
        'At the post office sending a package',
        'Describing your daily routine',
        'Asking about opening hours',
        'Choosing a dish from a menu',
        'At the bank for a simple transaction',
    ],
    A2: [
        'Discussing weekend plans with a friend',
        'Returning a faulty item at a shop',
        'Booking a table at a restaurant by phone',
        'Describing symptoms at a pharmacy',
        'Talking about your hometown to a visitor',
        'Changing a reservation at a hotel',
        'Asking for advice on what to buy',
        'Talking about past holidays',
        'Discussing what you did last weekend',
        'Planning a birthday party',
        'Asking about public transport routes',
        'Talking about your job to someone new',
        'Describing your home and neighborhood',
        'Making plans for the next day',
        'Complaining politely about a problem',
        'Talking about a recent film or book',
        'At a job interview (basic)',
        'Discussing food preferences at dinner',
        'Asking for help with a computer issue',
        'Renting an apartment (first inquiry)',
    ],
    B1: [
        'Discussing a news story with a colleague',
        'Negotiating a minor disagreement',
        'Giving feedback on someone\'s work',
        'Explaining a problem to customer service',
        'Talking about ambitions and career goals',
        'Discussing health habits and lifestyle',
        'Describing a recent trip in detail',
        'Talking about environmental issues',
        'Discussing a decision you had to make',
        'Explaining why you changed your mind',
        'Talking about cultural differences',
        'Discussing technology in daily life',
        'At a formal meeting giving your opinion',
        'Describing a person\'s character in depth',
        'Talking about education and learning',
        'Discussing a problem and offering solutions',
        'Comparing two options for a trip',
        'Talking about social media habits',
        'Giving a short presentation at work',
        'Discussing a sport or hobby you follow',
    ],
    B2: [
        'Debating the pros and cons of remote work',
        'Discussing a complex ethical dilemma',
        'Analyzing the impact of social media on society',
        'Presenting a business proposal',
        'Discussing mental health and wellbeing openly',
        'Talking about urban vs rural living',
        'Negotiating a salary or contract term',
        'Debating environmental policy with a peer',
        'Discussing immigration and identity',
        'Analyzing a piece of art or literature',
        'Discussing the gig economy and job insecurity',
        'Talking about political systems abstractly',
        'Describing a complex technical process',
        'Discussing the ethics of AI',
        'Talking about gender roles and change',
        'Reflecting on a life-changing experience',
        'Discussing the role of humor in communication',
        'Presenting a research finding',
        'Discussing inequality and social mobility',
        'Talking about leadership styles',
    ],
    C1: [
        'Arguing a nuanced philosophical position',
        'Discussing the limits of free speech',
        'Analyzing bias in media and journalism',
        'Debating economic inequality and systemic causes',
        'Discussing the ethics of genetic engineering',
        'Exploring the tension between tradition and innovation',
        'Analyzing a historical turning point',
        'Discussing the nature of consciousness',
        'Debating criminal justice reform',
        'Exploring the relationship between language and thought',
        'Discussing the role of art in political resistance',
        'Analyzing the paradoxes of globalization',
        'Exploring concepts of identity and belonging',
        'Discussing the philosophy of work and purpose',
        'Debating privacy vs security in the digital age',
        'Exploring cultural imperialism and soft power',
        'Discussing the limits of scientific knowledge',
        'Analyzing rhetoric and persuasion techniques',
        'Exploring the ethics of humanitarian intervention',
        'Discussing post-colonial perspectives in literature',
    ],
};

// ─── Conteo objetivo por nivel ────────────────────────────────

const TARGET_GROUPS = {
    A1: 20,
    A2: 20,
    B1: 20,
    B2: 20,
    C1: 20,
};

// ─── I/O helpers ──────────────────────────────────────────────

function getOutputDir(target, level) {
    const langDir = LANGS[target]?.dir || target;
    return path.join(__dirname, 'grupos_tarjetas', `${langDir}_${level.toLowerCase()}`);
}

function getOutputFile(target, source, level) {
    return path.join(getOutputDir(target, level), `${source}_${level.toLowerCase()}_vocabulario_contextual.json`);
}

function getProgressFile(target, source, level) {
    return path.join(getOutputDir(target, level), `.progress_${source}_${level.toLowerCase()}_vocabulario_contextual.json`);
}

function loadJSON(file) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { return null; }
}

function saveJSON(file, data) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Prompt ───────────────────────────────────────────────────

function buildPrompt(target, source, level, scenario, groupIndex, existingWords) {
    const tLang  = LANGS[target]  || { name: target,  nameEn: target  };
    const sLang  = LANGS[source]  || { name: source,  nameEn: source  };
    const band   = FREQ_BANDS[level];
    const wCount = band.count;

    const avoidList = existingWords.length
        ? `\nAVOID repeating these words already covered in this file: ${existingWords.slice(-60).join(', ')}.`
        : '';

    const phoneticInstruction = target === 'zh'
        ? 'Pinyin with tone diacritics, e.g. nǐ hǎo, wǒ ài nǐ (NEVER use tone numbers like ni3)'
        : target === 'ja'
        ? 'Rōmaji (Hepburn) transcription of the word'
        : `IPA transcription of the word in ${tLang.nameEn}`;

    return `You are an expert language curriculum designer for ${tLang.nameEn} learners at CEFR level ${level}.

Create ONE vocabulary-in-context group for the scenario: "${scenario}"

TARGET LANGUAGE: ${tLang.nameEn} (${tLang.name})
LEARNER'S NATIVE LANGUAGE: ${sLang.nameEn} (${sLang.name})
CEFR LEVEL: ${level}
FREQUENCY BAND: Use ${band.range} of ${tLang.nameEn}.
${avoidList}

CRITICAL RULES:
- Choose exactly ${wCount} words from the ${band.range} of ${tLang.nameEn}. Do NOT pick thematic words — pick the most FREQUENT general-purpose words that happen to appear in this scenario naturally.
- Mix word types: include verbs, nouns, adjectives, adverbs, prepositions, and connectors — NOT just nouns.
- The dialogue must be a realistic, natural exchange of exactly ${band.turns} turns. Each word in the vocabulary list must appear at least once in the dialogue.
- All translations and explanations must be in ${sLang.nameEn}.
- The "highlights" array in each dialogue turn contains the EXACT word forms as they appear in the text (may differ from the base form in "vocabulary").

Respond ONLY with a valid JSON object. No markdown, no extra text:

{
  "id": "${source}_${level}_vctx_${String(groupIndex).padStart(2,'0')}",
  "type": "vocabulario_contextual",
  "category": "Vocabulario Contextual",
  "level": "${level}",
  "scenario": "${scenario}",
  "frequency_note": "${band.range} of ${tLang.nameEn}",
  "vocabulary": [
    {
      "word": "base form of the word",
      "pos": "verb|noun|adj|adv|prep|conj|pron|det",
      "phonetic": "${phoneticInstruction}",
      "translation": "translation in ${sLang.nameEn}",
      "note": "brief usage note in ${sLang.nameEn} (optional, omit if obvious)"
    }
  ],
  "dialogue": [
    {
      "speaker": "A",
      "text": "sentence in ${tLang.nameEn}",
      "translation": "full sentence translation in ${sLang.nameEn}",
      "highlights": ["word1_as_used", "word2_as_used"]
    }
  ],
  "key_phrases": [
    {
      "phrase": "useful phrase from the dialogue",
      "translation": "translation in ${sLang.nameEn}"
    }
  ]
}`;
}

// ─── Sanitización de respuesta JSON ──────────────────────────
function extractJSON(raw) {
    // Intenta parse directo
    try { return JSON.parse(raw); } catch (_) {}
    // Elimina caracteres de control no escapados dentro de strings
    const fixed = raw.replace(/[\u0000-\u001F\u007F]/g, c => {
        if (c === '\n') return '\\n';
        if (c === '\r') return '\\r';
        if (c === '\t') return '\\t';
        return '';
    });
    try { return JSON.parse(fixed); } catch (_) {}
    // Extrae primer bloque {...} balanceado
    const start = raw.indexOf('{');
    if (start === -1) throw new SyntaxError('No JSON object found');
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < raw.length; i++) {
        const ch = raw[i];
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') { inStr = !inStr; continue; }
        if (!inStr) { if (ch === '{') depth++; else if (ch === '}' && --depth === 0) return JSON.parse(raw.slice(start, i + 1)); }
    }
    throw new SyntaxError('Unbalanced JSON');
}

// ─── Llamada al modelo ────────────────────────────────────────

async function generateGroup(target, source, level, scenario, groupIndex, existingWords, retries = 3) {
    const prompt = buildPrompt(target, source, level, scenario, groupIndex, existingWords);
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const resp = await activeClient.chat.completions.create({
                model:       activeModel,
                temperature: 0.8,
                max_tokens:  providerMaxTokens(),
                response_format: { type: 'json_object' },
                messages: [{ role: 'user', content: prompt }],
            });
            const raw = resp.choices[0].message.content.trim()
                .replace(/^```json\s*/i, '').replace(/```\s*$/, '');
            const parsed = extractJSON(raw);
            if (!parsed.vocabulary?.length || !parsed.dialogue?.length) {
                throw new Error('Missing vocabulary or dialogue');
            }
            return parsed;
        } catch (err) {
            const is402 = err.message?.includes('402') || err.status === 402;
            if (is402 && tryFallback(err.message)) { attempt--; continue; }
            if (err.message?.includes('429')) {
                const wait = parseRetryAfterMs(err.message);
                const mins = Math.ceil(wait / 60000);
                console.warn(`  ⏳ Rate limit — esperando ${mins >= 60 ? (mins/60).toFixed(1)+'h' : mins+'m'}…`);
                await new Promise(r => setTimeout(r, wait));
                attempt--;
                continue;
            }
            console.warn(`  ⚠️  Intento ${attempt}/${retries} fallido: ${err.message}`);
            if (attempt === retries) throw err;
            await new Promise(r => setTimeout(r, 2000 * attempt));
        }
    }
}

// ─── Prompt de traducción (modo --from) ──────────────────────

function buildTranslatePrompt(group, fromSource, newSource) {
    const fromLang = LANGS[fromSource] || { nameEn: fromSource };
    const newLang  = LANGS[newSource]  || { nameEn: newSource  };

    return `You are a language translation assistant.

Below is a vocabulary flashcard group. The target language content is fixed. Explanations are currently in ${fromLang.nameEn}.

Your task: translate ONLY the explanation fields from ${fromLang.nameEn} to ${newLang.nameEn}.

STRICT RULES:
- Keep ALL target-language content EXACTLY as-is: "word", "pos", "phonetic", "highlights", "text", "phrase", "scenario", "frequency_note", "level", "type", "category", "speaker"
- Translate ONLY these fields: vocabulary[].translation, vocabulary[].note, dialogue[].translation, key_phrases[].translation
- If a "note" field is absent in the original entry, omit it in the output too
- Replace the "id" field: change the prefix "${fromSource}_" to "${newSource}_"
- Respond ONLY with valid JSON, no markdown, no extra text

INPUT GROUP:
${JSON.stringify(group, null, 2)}`;
}

// ─── Llamada al modelo (modo --from) ─────────────────────────

async function translateGroup(group, fromSource, newSource, retries = 3) {
    const prompt = buildTranslatePrompt(group, fromSource, newSource);
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const resp = await activeClient.chat.completions.create({
                model:       activeModel,
                temperature: 0.3,
                max_tokens:  providerMaxTokens(),
                response_format: { type: 'json_object' },
                messages: [{ role: 'user', content: prompt }],
            });
            const raw = resp.choices[0].message.content.trim()
                .replace(/^```json\s*/i, '').replace(/```\s*$/, '');
            const parsed = extractJSON(raw);
            if (!parsed.vocabulary?.length || !parsed.dialogue?.length) {
                throw new Error('Missing vocabulary or dialogue');
            }
            return parsed;
        } catch (err) {
            const is402 = err.message?.includes('402') || err.status === 402;
            if (is402 && tryFallback(err.message)) { attempt--; continue; }
            if (err.message?.includes('429')) {
                const wait = parseRetryAfterMs(err.message);
                const mins = Math.ceil(wait / 60000);
                console.warn(`  ⏳ Rate limit — esperando ${mins >= 60 ? (mins/60).toFixed(1)+'h' : mins+'m'}…`);
                await new Promise(r => setTimeout(r, wait));
                attempt--;
                continue;
            }
            console.warn(`  ⚠️  Intento ${attempt}/${retries} fallido: ${err.message}`);
            if (attempt === retries) throw err;
            await new Promise(r => setTimeout(r, 2000 * attempt));
        }
    }
}

// ─── Traducción desde archivo existente (modo --from) ─────────

async function translateFile(target, source, level, fromSource, maxNew) {
    const refFile    = getOutputFile(target, fromSource, level);
    const outputFile = getOutputFile(target, source, level);
    const progressFile = getProgressFile(target, source, level);

    const reference = loadJSON(refFile);
    if (!reference?.length) {
        console.error(`❌ Archivo de referencia no encontrado o vacío: ${path.relative(__dirname, refFile)}`);
        console.error(`   Primero genera: node generate_vocab_contextual.js --target=${target} --source=${fromSource} --level=${level}`);
        process.exit(1);
    }

    const existing = loadJSON(outputFile) || [];
    const progress = loadJSON(progressFile) || { done: [] };
    const doneIds  = new Set(progress.done);
    const total    = reference.length;

    if (existing.length >= total) {
        console.log(`✅ Ya está completo: ${path.basename(outputFile)} (${existing.length} grupos)`);
        return;
    }

    const tLang    = LANGS[target]     || { nameEn: target };
    const sLang    = LANGS[source]     || { nameEn: source };
    const fromLang = LANGS[fromSource] || { nameEn: fromSource };

    const pending = reference.filter(g => !doneIds.has(g.id));
    const limit   = maxNew || (total - existing.length);
    let translated = 0;

    console.log(`\n🔄 Modo reutilización: ${tLang.nameEn} ← ${sLang.nameEn} | ${level}`);
    console.log(`   Referencia: ${fromLang.nameEn} → ${sLang.nameEn} | ${existing.length}/${total} ya traducidos`);

    for (const group of pending) {
        if (translated >= limit) break;

        console.log(`\n▶ Traduciendo: "${group.scenario}" (${existing.length + translated + 1}/${total})`);

        try {
            const result = await translateGroup(group, fromSource, source);

            existing.push(result);
            progress.done.push(group.id);

            saveJSON(outputFile, existing);
            saveJSON(progressFile, progress);

            console.log(`   ✅ Traducido — ${result.vocabulary.length} palabras, ${result.dialogue.length} turnos`);
            translated++;

            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.error(`   ❌ Error en "${group.scenario}": ${err.message}`);
        }
    }

    console.log(`\n🎉 Lote completado. ${translated} grupos nuevos → ${existing.length}/${total} total`);
    if (existing.length >= total) {
        console.log(`✅ ¡Categoría completa! Archivo: ${path.relative(__dirname, outputFile)}`);
    }
}

// ─── Generación principal ─────────────────────────────────────

async function generateFile(target, source, level, maxNew) {
    const outputFile   = getOutputFile(target, source, level);
    const progressFile = getProgressFile(target, source, level);

    const existing  = loadJSON(outputFile) || [];
    const progress  = loadJSON(progressFile) || { done: [] };
    const scenarios = SCENARIOS[level] || SCENARIOS.A1;
    const total     = TARGET_GROUPS[level];

    const existingWords = existing.flatMap(g => (g.vocabulary || []).map(v => v.word));
    const doneScenarios = new Set(progress.done);

    if (existing.length >= total) {
        console.log(`✅ Ya está completo: ${path.basename(outputFile)} (${existing.length} grupos)`);
        return;
    }

    const pending = scenarios.filter(s => !doneScenarios.has(s));
    if (!pending.length) {
        console.log(`✅ Todos los escenarios completados.`);
        return;
    }

    let generated = 0;
    const limit = maxNew || (total - existing.length);

    console.log(`\n📚 Generando vocabulario contextual: ${LANGS[target]?.nameEn} ← ${LANGS[source]?.nameEn} | ${level}`);
    console.log(`   Grupos existentes: ${existing.length}/${total} | Pendientes: ${pending.length}`);

    for (const scenario of pending) {
        if (generated >= limit) break;

        console.log(`\n▶ Escenario: "${scenario}" (${existing.length + generated + 1}/${total})`);

        try {
            const group = await generateGroup(
                target, source, level, scenario,
                existing.length + generated + 1,
                existingWords
            );

            existing.push(group);
            group.vocabulary.forEach(v => existingWords.push(v.word));
            progress.done.push(scenario);

            saveJSON(outputFile, existing);
            saveJSON(progressFile, progress);

            console.log(`   ✅ Generado: "${group.scenario}" — ${group.vocabulary.length} palabras, ${group.dialogue.length} turnos`);
            generated++;

            await new Promise(r => setTimeout(r, 800));
        } catch (err) {
            console.error(`   ❌ Error en escenario "${scenario}": ${err.message}`);
        }
    }

    console.log(`\n🎉 Lote completado. ${generated} grupos nuevos → ${existing.length}/${total} total`);
    if (existing.length >= total) {
        console.log(`✅ ¡Categoría completa! Archivo: ${path.relative(__dirname, outputFile)}`);
    }
}

// ─── CLI ──────────────────────────────────────────────────────

const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; })
);

if (args.list) {
    console.log('\nDuplas disponibles para vocabulario contextual:\n');
    const targets = ['en','fr','pt','de','it','zh','ja','ko','ru','ar','gn','qu','wo','ha','yo'];
    const sources = ['es','en','fr','pt','de','it','gn','qu','wo','ha','yo'];
    for (const t of targets) {
        for (const s of sources) {
            if (t !== s) {
                const tN = LANGS[t]?.name || t;
                const sN = LANGS[s]?.name || s;
                console.log(`  ${tN} ← ${sN}   node generate_vocab_contextual.js --target=${t} --source=${s} --level=A1`);
            }
        }
    }
    process.exit(0);
}

if (!args.target || !args.source || !args.level) {
    console.error('Uso: node generate_vocab_contextual.js --target=<lang> --source=<lang> --level=<A1|A2|B1|B2|C1> [--count=N] [--provider=deepseek|mistral|gemini|groq]');
    console.error('     node generate_vocab_contextual.js --target=<lang> --source=<lang> --level=<level> --from=<lang>');
    console.error('     node generate_vocab_contextual.js --list');
    process.exit(1);
}

initProvider(args.provider, args.model);

if (!LANGS[args.target]) { console.error(`Idioma destino no soportado: ${args.target}`); process.exit(1); }
if (!LANGS[args.source]) { console.error(`Idioma fuente no soportado: ${args.source}`); process.exit(1); }
if (!FREQ_BANDS[args.level]) { console.error(`Nivel no soportado: ${args.level}. Usar A1, A2, B1, B2 o C1.`); process.exit(1); }
if (args.from && !LANGS[args.from]) { console.error(`Idioma de referencia no soportado: ${args.from}`); process.exit(1); }
if (args.from && args.from === args.source) { console.error(`--from debe ser distinto de --source`); process.exit(1); }

const count = args.count ? parseInt(args.count) : null;

if (args.from) {
    translateFile(args.target, args.source, args.level, args.from, count)
        .catch(err => { console.error('Error fatal:', err); process.exit(1); });
} else {
    generateFile(args.target, args.source, args.level, count)
        .catch(err => { console.error('Error fatal:', err); process.exit(1); });
}
