// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
// const https = require('https');
const fs = require('fs');
const { Mistral } = require('@mistralai/mistralai');
const { CohereClientV2 } = require('cohere-ai');

const { exec } = require('child_process');
const path = require('path');

const authDb = require('./auth_db.cjs');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { Resend } = require('resend');
const { OAuth2Client } = require('google-auth-library');

// ─── Email service (Resend) ───────────────────────────────────

const APP_URL    = process.env.APP_URL    || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || 'SenseMate <noreply@sensemate.app>';

let _resendClient = null;
function _mailer() {
    if (!_resendClient && process.env.RESEND_API_KEY) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

async function sendEmail({ to, subject, html }) {
    const mailer = _mailer();
    if (!mailer) {
        console.log(`📧 [SIN RESEND] Para: ${to} | ${subject}`);
        return { ok: true };
    }
    const { data, error } = await mailer.emails.send({ from: EMAIL_FROM, to, subject, html });
    if (error) throw new Error(error.message);
    return { ok: true, id: data?.id };
}

function _emailReset(name, resetUrl) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f5f7fb;margin:0;padding:2rem">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="text-align:center;margin-bottom:1.5rem">
    <div style="font-size:2rem">📖</div>
    <h1 style="margin:.4rem 0;color:#1e293b;font-size:1.3rem">SenseMate</h1>
  </div>
  <h2 style="color:#1e293b;font-size:1.05rem;margin-bottom:.75rem">Restablecer contraseña</h2>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Hola <strong>${name}</strong>, recibiste este email porque solicitaste restablecer tu contraseña en SenseMate.</p>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Hacé clic en el botón — el enlace expira en <strong>1 hora</strong>.</p>
  <div style="text-align:center;margin:1.75rem 0">
    <a href="${resetUrl}" style="display:inline-block;padding:.75rem 1.75rem;background:#2d6a4f;color:#fff;border-radius:.5rem;text-decoration:none;font-weight:600;font-size:1rem">Restablecer contraseña</a>
  </div>
  <p style="color:#94a3b8;font-size:.78rem;border-top:1px solid #e2e8f0;padding-top:1rem;margin-top:1.5rem">Si no solicitaste esto, ignorá este email. Tu contraseña no cambiará.</p>
</div></body></html>`;
}

function _emailVerify(name, verifyUrl) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f5f7fb;margin:0;padding:2rem">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="text-align:center;margin-bottom:1.5rem">
    <div style="font-size:2rem">📖</div>
    <h1 style="margin:.4rem 0;color:#1e293b;font-size:1.3rem">SenseMate</h1>
  </div>
  <h2 style="color:#1e293b;font-size:1.05rem;margin-bottom:.75rem">¡Bienvenido/a, ${name}! 🎉</h2>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Gracias por registrarte. Verificá tu email para confirmar tu cuenta.</p>
  <div style="text-align:center;margin:1.75rem 0">
    <a href="${verifyUrl}" style="display:inline-block;padding:.75rem 1.75rem;background:#2d6a4f;color:#fff;border-radius:.5rem;text-decoration:none;font-weight:600;font-size:1rem">Verificar email</a>
  </div>
  <p style="color:#94a3b8;font-size:.78rem;border-top:1px solid #e2e8f0;padding-top:1rem;margin-top:1.5rem">Si no creaste una cuenta en SenseMate, ignorá este email.</p>
</div></body></html>`;
}

const app = express();

// ─── Rate limiters ────────────────────────────────────────────

// Identifica al usuario por JWT (si está logueado) o por IP (invitados)
function _rlKeyGenerator(req) {
    const auth = req.headers['authorization'];
    if (auth?.startsWith('Bearer ')) {
        try {
            const jwt     = require('jsonwebtoken');
            const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'lingua_dev_secret_change_in_prod');
            // Dev users no tienen límite
            if (payload.isDev) return `dev_bypass_${payload.id}`;
            return `user_${payload.id}`;
        } catch { /* token inválido — cae a IP */ }
    }
    return ipKeyGenerator(req); // maneja IPv6 correctamente
}

function _skipDev(req) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) return false;
    try {
        const jwt     = require('jsonwebtoken');
        const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'lingua_dev_secret_change_in_prod');
        return !!payload.isDev;
    } catch { return false; }
}

// Traducción: 30 requests / 10 minutos por usuario
const translateLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,
    max:              30,
    keyGenerator:     _rlKeyGenerator,
    skip:             _skipDev,
    standardHeaders:  'draft-7',
    legacyHeaders:    false,
    message:          { error: 'Demasiadas traducciones. Esperá unos minutos antes de continuar.' },
});

// Chat (tutor + famosos): 40 requests / 10 minutos por usuario
const chatLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,
    max:              40,
    keyGenerator:     _rlKeyGenerator,
    skip:             _skipDev,
    standardHeaders:  'draft-7',
    legacyHeaders:    false,
    message:          { error: 'Demasiados mensajes seguidos. Esperá unos minutos.' },
});

// TTS (voz): 20 requests / 10 minutos — más caro computacionalmente
const ttsLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,
    max:              20,
    keyGenerator:     _rlKeyGenerator,
    skip:             _skipDev,
    standardHeaders:  'draft-7',
    legacyHeaders:    false,
    message:          { error: 'Demasiadas solicitudes de voz. Esperá unos minutos.' },
});

// Auth: 10 intentos / 15 minutos por IP — protege contra brute force
const authLimiter = rateLimit({
    windowMs:        15 * 60 * 1000,
    max:             10,
    keyGenerator:    ipKeyGenerator,
    standardHeaders: 'draft-7',
    legacyHeaders:   false,
    message:         { error: 'Demasiados intentos. Esperá 15 minutos.' },
});

app.use(cors());
app.use('/audio', express.static(path.join(__dirname, 'audio')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Bot detector: si es un crawler social, servir HTML con meta tags correctos ──
// (Los bots de WhatsApp/Telegram/Twitter no ejecutan JS, así que necesitan SSR de los metas)
const BOT_UA = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slack|discord|googlebot|bingbot|applebot/i;

app.get('/lite', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-lite.html'));
});

app.get('/', (req, res, next) => {
    if (!BOT_UA.test(req.headers['user-agent'] || '')) return next();
    // Servir página mínima con meta tags para crawlers
    res.send(`<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<title>SenseMate — Traducción contextual e idiomas con IA</title>
<meta name="description" content="Traducí con contexto, aprendé vocabulario con flashcards y chateá con Einstein, Frida Kahlo o Shakespeare. Gratis.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://sensemate.app/">
<meta property="og:title" content="SenseMate — Traducción contextual e idiomas con IA">
<meta property="og:description" content="Traducí con contexto, aprendé vocabulario con flashcards y chateá con Einstein, Frida Kahlo o Shakespeare. Gratis.">
<meta property="og:image" content="https://sensemate.app/images/og-preview.jpg">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://sensemate.app/images/og-preview.jpg">
</head><body><a href="/">SenseMate</a></body></html>`);
});

app.use(express.static(path.join(__dirname, '.')));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ─── Detección de región por IP ────────────────────────────────

const _REGION_MAP = {
    // América Latina (incl. América Central y Caribe)
    america_latina: ['AR','BO','CL','CO','CR','CU','DO','EC','GT','HN','MX','NI','PA','PE','PY','SV','UY','VE',
                     'BB','BZ','DM','GD','GY','HT','JM','KN','LC','SR','TT','VC','AG','AW','GP','MQ','MF','PR','VI','BQ','CW','SX','TC'],
    // Brasil separado
    brasil:         ['BR'],
    // América del Norte
    america_norte:  ['US','CA','GL'],
    // Europa Occidental
    europa:         ['DE','FR','IT','ES','PT','NL','BE','AT','CH','SE','NO','DK','FI','IE','PL','CZ','SK',
                     'HU','RO','BG','HR','SI','EE','LV','LT','GR','CY','MT','LU','IS','AL','BA','ME','MK','RS','XK','LI','MC','SM','AD','VA'],
    // Europa Oriental / ex-URSS
    europa_oriental:['RU','UA','BY','MD','GE','AM','AZ','KZ','UZ','TM','KG','TJ'],
    // Medio Oriente
    medio_oriente:  ['SA','AE','IL','TR','IR','IQ','SY','LB','JO','KW','QA','BH','OM','YE','PS','EG'],
    // África (excl. Egipto que va a Medio Oriente)
    africa:         ['DZ','AO','BJ','BW','BF','BI','CM','CV','CF','TD','KM','CG','CD','DJ','GQ','ER','SZ','ET',
                     'GA','GM','GH','GN','GW','CI','KE','LS','LR','LY','MG','MW','ML','MR','MU','YT','MA','MZ',
                     'NA','NE','NG','RE','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','EH','ZM','ZW'],
    // Asia (excl. China, India, Medio Oriente y ex-URSS)
    asia:           ['JP','KR','TH','VN','PH','ID','MY','SG','TW','HK','MO','MN','KP','MM','KH','LA','BN',
                     'TL','MV','BT','NP','LK','BD','PK','AF'],
    // India separado
    india:          ['IN'],
    // China separado
    china:          ['CN'],
    // Oceanía
    oceania:        ['AU','NZ','FJ','PG','SB','VU','WS','TO','KI','TV','NR','PW','FM','MH','CK','NU','TK','AS','GU','MP','NC','PF','WF'],
};

// Tabla inversa country_code → region_key
const _COUNTRY_TO_REGION = {};
for (const [region, codes] of Object.entries(_REGION_MAP)) {
    for (const code of codes) _COUNTRY_TO_REGION[code] = region;
}

function _countryToRegion(countryCode) {
    return _COUNTRY_TO_REGION[countryCode] || 'otros';
}

// Detecta país por IP real (X-Forwarded-For en Railway/proxies)
async function _detectCountryFromReq(req) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
        // No detectar IPs locales
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.')) return null;
        const r = await axios.get(`https://ipapi.co/${ip}/country/`, { timeout: 3000 });
        const code = (r.data || '').toString().trim().toUpperCase();
        return code.length === 2 ? code : null;
    } catch {
        return null;
    }
}

const planToModel = {
    'free': 'openrouter/free',
    'gold': 'deepseek/deepseek-chat'
};


// --- Función para traducir con Cohere ---
async function translateWithCohere(text, targetLang, sourceLang, context = '') {
    console.log(`🟢 translateWithCohere: texto="${text}", source=${sourceLang}, target=${targetLang}${context ? `, contexto="${context}"` : ''}`);

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

    const systemPrompt = `
Eres un experto en lingüística y traducción contextual.
Traduce el siguiente texto del idioma "${sourceLang || 'desconocido'}" al idioma "${targetLang}".

Responde ÚNICAMENTE con un objeto JSON válido, sin ningún texto adicional, sin bloques de código, sin explicaciones.
El objeto debe tener exactamente esta estructura:

{
  "formal": "traducción en tono formal (negocios, autoridades)",
  "informal": "traducción en tono informal (amigos, familia)",
  "neutral": "traducción neutra (ni formal ni coloquial)",
  "lexical": {
    "type": "categoría gramatical abreviada. Usa exactamente una de estas: sust. | vbo. | adj. | adv. | prep. | pron. | conj. | expr. | frase",
    "details": "detalle gramatical específico. Ejemplos: 'verbo transitivo, presente simple' | 'sustantivo masculino, plural' | 'adjetivo calificativo' | 'expresión idiomática' | 'pronombre personal de 3ª persona'",
    "examples": [
      { "source": "oración de ejemplo en ${sourceLang} usando el texto original en contexto diferente", "target": "su traducción al ${targetLang}" },
      { "source": "segundo ejemplo en ${sourceLang}", "target": "su traducción al ${targetLang}" },
      { "source": "tercer ejemplo en ${sourceLang}", "target": "su traducción al ${targetLang}" },
      { "source": "cuarto ejemplo en ${sourceLang}", "target": "su traducción al ${targetLang}" }
    ]
  },
  "contexts": [
    {
      "label": "nombre corto del dominio o situación (ej: 'Técnico', 'Financiero', 'Coloquial', 'Jurídico', 'Médico')",
      "note": "una frase breve que explica cuándo aplica esta variación",
      "translation": "cómo se traduce la palabra o frase en este contexto específico"
    }
  ]
}

Reglas estrictas:
- Usa SIEMPRE comillas dobles, nunca simples.
- El campo "type" debe ser solo la abreviatura (ej: "vbo." no "verbo").
- Los ejemplos deben ser frases naturales y variadas que muestren distintos usos.
- Si el texto es una frase larga, usa "frase" como type y describe su función en "details". En este caso no muestres ejemplos.
- Para "contexts": incluye entre 2 y 4 entradas SOLO si la palabra tiene traducciones notablemente distintas según el dominio o situación (polisemia real, false friends, ambigüedad de registro). Si la traducción es unívoca o el texto es una frase sin ambigüedad contextual significativa, devuelve "contexts": [].
- Cada "label" debe ser conciso (1-2 palabras máximo).
- No incluyas nada fuera del objeto JSON.
`;

    const userMessage = context
        ? `Contexto de uso: ${context}\n\nTexto a traducir: "${text}"`
        : `Texto a traducir: "${text}"`;

    try {
        const response = await cohere.chat({
            model: 'command-a-translate-08-2025',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.2,
        });

        let translationText = response.message.content[0].text;
        console.log("🤖 Respuesta cruda de Cohere:", translationText);

        // Limpiar por si viene con ```json ... ```
        let cleanJson = translationText
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const translationObj = JSON.parse(cleanJson);
        console.log(`✅ Traducción parseada:`, translationObj);
        return translationObj;

    } catch (error) {
        console.error("❌ Error en Cohere:", error);
        return {
            formal:   `[Error] ${text}`,
            informal: `[Error] ${text}`,
            neutral:  `[Error] ${text}`,
            lexical: null
        };
    }
}

// Decodifica JWT sin rechazar — devuelve payload o null
function _optionalAuth(req) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) return null;
    try {
        const jwt = require('jsonwebtoken');
        return jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'lingua_dev_secret_change_in_prod');
    } catch { return null; }
}

app.post('/translate', translateLimiter, async (req, res) => {
    console.log("🔔 Llegó petición a /translate");

    const { text, sourceLang, targetLang, context } = req.body;
    console.log("Datos recibidos:", { text, sourceLang, targetLang, context: context || '' });

    // Plan viene del JWT, no del cliente
    const jwtPayload = _optionalAuth(req);
    const isPremium  = !!(jwtPayload?.isDev || jwtPayload?.plan === 'premium' || jwtPayload?.plan === 'trial');

    if (!text) {
        return res.status(400).json({ error: "Falta el texto a traducir" });
    }

    try {
        const src = sourceLang || 'auto';
        const tgt = targetLang || 'spanish';
        const translationObj = await translateWithCohere(text, tgt, src, context || '');

        // Strip premium-only fields for free/guest users
        if (!isPremium) {
            delete translationObj.lexical;
            delete translationObj.contexts;
        }

        return res.json({ translation: JSON.stringify(translationObj) });

    } catch (error) {
        console.error("Error en /translate:", error.message);
        return res.status(500).json({ error: "Error al procesar la traducción" });
    }
});

// ─── Traducción batch para subtítulos SRT ────────────────────
// Recibe hasta 20 líneas y devuelve sus traducciones en el mismo orden.
// Usa un prompt simple (solo traducción neutral) para ser eficiente.
app.post('/translate-batch', translateLimiter, async (req, res) => {
    const { lines, sourceLang, targetLang } = req.body;
    if (!Array.isArray(lines) || lines.length === 0)
        return res.status(400).json({ error: 'Falta el array lines.' });
    if (lines.length > 20)
        return res.status(400).json({ error: 'Máximo 20 líneas por llamada.' });

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const src = sourceLang || 'en';
    const tgt = targetLang || 'es';

    const numbered = lines.map((l, i) => `[${i + 1}] ${l}`).join('\n');

    const systemPrompt = `Eres un traductor de subtítulos. Traduce del idioma "${src}" al "${tgt}".
Devuelve ÚNICAMENTE las traducciones numeradas en el mismo formato, sin texto extra:
[1] traducción de la línea 1
[2] traducción de la línea 2
...y así.`;

    try {
        const response = await cohere.chat({
            model: 'command-a-translate-08-2025',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user',   content: numbered }
            ],
            temperature: 0.1,
        });

        const raw = response.message.content[0].text;
        const translations = raw.split('\n')
            .filter(l => /^\[\d+\]/.test(l.trim()))
            .map(l => l.replace(/^\[\d+\]\s*/, '').trim());

        // Si no parsea bien, devolver líneas vacías sin error
        const result = lines.map((_, i) => translations[i] || '');
        return res.json({ translations: result });

    } catch (error) {
        console.error('❌ /translate-batch error:', error.message);
        return res.status(500).json({ error: 'Error al traducir subtítulos.' });
    }
});

// Endpoint para el chat del Modo Escuela
app.post('/chat', chatLimiter, async (req, res) => {
    const { messages, level, targetLang } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Falta el historial de mensajes" });
    }

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const systemPrompt = `Eres un tutor de idiomas experto y motivador. El alumno tiene nivel "${level || 'B1'}" y está aprendiendo ${targetLang || 'español'}.
Reglas:
- Corrige los errores de forma amable y constructiva.
- Usa frases adaptadas al nivel del alumno.
- Haz una pregunta al final para continuar la conversación.
- Responde en el idioma que el alumno está aprendiendo (${targetLang || 'español'}).
- Mantén las respuestas concisas (2 o 3 oraciones).`;

    try {
        const response = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
        });
        const reply = response.message.content[0].text;
        res.json({ reply });
    } catch (error) {
        console.error("Error en /chat:", error);
        res.status(500).json({ error: "Error al generar respuesta del tutor" });
    }
});

// Idioma nativo de cada personaje
const PERSON_NATIVE_LANG = {
    mlk:          'en',
    marilyn:      'en',
    maradona:     'es',
    einstein:     'de',
    cleopatra:    'en',
    frida:        'es',
    mandela:      'en',
    shakespeare:  'en',
    guevara:             'es',
    mercedes_sosa:       'es',
    piazzolla:           'es',
    borges:              'es',
    cohelo:              'pt',
    senna:               'pt',
    freire:              'pt',
    pele:                'pt',
    ronaldo:             'pt',
    fernanda_montenegro: 'pt',
    rita:                'pt',
    gilberto:            'pt',
    chiquinha:           'pt',
    neruda:              'es',
    mistral:             'es',
    jara:                'es',
    barrios:             'es',
    parra:               'es',
    geel:                'es',
    franulic:            'es',
    quiroga:             'es',
    luisi:               'es',
    amalia:              'es',
    galeano:             'es',
    rodo:                'es',
    benedetti:           'es',
};

// Traducción simple (solo neutral, para subtítulos del chat)
async function translateSimple(text, fromLang, toLang) {
    if (fromLang === toLang) return text; // mismo idioma, no traducir
    try {
        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const res = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [{
                role: 'user',
                content: `Translate this text from ${fromLang} to ${toLang}. Return ONLY the translated text, nothing else:

"${text}"`
            }],
            temperature: 0.1,
        });
        return res.message.content[0].text.trim().replace(/^["']|["']$/g, '');
    } catch {
        return null; // Si falla, el cliente mostrará solo el original
    }
}

// ── Sinónimos ──────────────────────────────────────────────────
const LANG_NAMES_MAP = { en:'English', es:'Spanish', fr:'French', de:'German', it:'Italian', pt:'Portuguese' };
function _langName(code) { return LANG_NAMES_MAP[code] || code; }

app.post('/synonyms', chatLimiter, async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;
    if (!text) return res.status(400).json({ error: 'Falta el texto' });

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const sName  = _langName(sourceLang || 'en');
    const tName  = _langName(targetLang || 'es');

    try {
        const response = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [{ role: 'user', content:
                `Give synonyms for the word or phrase: "${text}"\n` +
                `Return ONLY valid JSON with this exact format:\n` +
                `{"source":["syn1","syn2","syn3","syn4"],"target":["syn1","syn2","syn3","syn4"]}\n` +
                `"source" = synonyms in ${sName}. "target" = synonyms in ${tName}.\n` +
                `4-6 synonyms each. No explanation, no markdown, only the JSON.`
            }],
            temperature: 0.3,
        });
        const raw   = response.message.content[0].text.trim();
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON');
        res.json(JSON.parse(match[0]));
    } catch (e) {
        console.error('/synonyms error:', e);
        res.status(500).json({ error: 'Error al obtener sinónimos' });
    }
});

// ── Traductor de texto largo (párrafo a párrafo) ───────────────
app.post('/translate-paragraph', _optionalAuth, async (req, res) => {
    const { text, sourceLang, targetLang, instruction, prevContext } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Falta el texto' });

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const src    = _langName(sourceLang || 'es');
    const tgt    = _langName(targetLang || 'en');

    const instrLine = instruction?.trim()
        ? `Además de traducir, aplicá esta instrucción al párrafo: "${instruction.trim()}".`
        : '';

    const ctxLine = prevContext?.trim()
        ? `Para mantener coherencia, los párrafos anteriores procesados fueron:\n"""\n${prevContext.trim()}\n"""\n`
        : '';

    const systemPrompt =
        `Eres un experto traductor literario. Tu tarea es traducir párrafos del idioma ${src} al idioma ${tgt}.\n` +
        `${instrLine}\n` +
        `Reglas:\n` +
        `- Devolvé ÚNICAMENTE el párrafo traducido/procesado, sin encabezados ni explicaciones.\n` +
        `- Mantené el estilo, tono y voz narrativa del original.\n` +
        `- Si hay nombres propios o términos especiales, sé consistente con los párrafos anteriores.`;

    const userMsg = `${ctxLine}Párrafo a traducir:\n"""\n${text.trim()}\n"""`;

    try {
        const response = await cohere.chat({
            model: 'command-a-translate-08-2025',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user',   content: userMsg }
            ],
            temperature: 0.3,
        });
        res.json({ result: response.message.content[0].text.trim() });
    } catch (e) {
        console.error('/translate-paragraph error:', e);
        res.status(500).json({ error: 'Error al traducir el párrafo' });
    }
});

// ── Chat sobre un párrafo específico ───────────────────────────
app.post('/paragraph-chat', chatLimiter, async (req, res) => {
    const { original, translated, messages, sourceLang, targetLang } = req.body;
    if (!messages?.length) return res.status(400).json({ error: 'Faltan parámetros' });

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const src    = _langName(sourceLang || 'es');
    const tgt    = _langName(targetLang || 'en');

    const system =
        `Eres un asistente literario y de idiomas. El usuario está leyendo un texto traducido del ${src} al ${tgt}.\n` +
        `Párrafo original:\n"""\n${(original || '').slice(0, 800)}\n"""\n` +
        `Traducción/versión procesada:\n"""\n${(translated || '').slice(0, 800)}\n"""\n` +
        `Respondé las preguntas del usuario sobre este párrafo: vocabulario, gramática, decisiones de traducción, contexto literario, etc.\n` +
        `Respondé siempre en ${src}. Sé conciso y práctico (2-4 oraciones salvo que se pida más).`;

    try {
        const response = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [{ role: 'system', content: system }, ...messages],
            temperature: 0.6,
        });
        res.json({ reply: response.message.content[0].text });
    } catch (e) {
        console.error('/paragraph-chat error:', e);
        res.status(500).json({ error: 'Error al generar respuesta' });
    }
});

// ── IA in Context ──────────────────────────────────────────────
app.post('/context-chat', chatLimiter, async (req, res) => {
    const { word, messages, sourceLang, targetLang } = req.body;
    if (!word || !messages?.length) return res.status(400).json({ error: 'Faltan parámetros' });

    const cohere  = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const sName   = _langName(sourceLang || 'en');
    const tName   = _langName(targetLang || 'es');
    const system  = `You are a language assistant. The user just translated "${word}" from ${sName} to ${tName}. ` +
                    `Answer their questions about this word or phrase. Always respond in ${sName}. ` +
                    `Be concise (2-3 sentences), practical, and focus on real usage, grammar, and context.`;
    try {
        const response = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [{ role: 'system', content: system }, ...messages],
            temperature: 0.6,
        });
        res.json({ reply: response.message.content[0].text });
    } catch (e) {
        console.error('/context-chat error:', e);
        res.status(500).json({ error: 'Error al generar respuesta' });
    }
});

// Endpoint para chatear con personajes famosos
app.post('/famous-chat', chatLimiter, async (req, res) => {
    const { person, messages, targetLang } = req.body;
    if (!messages || !person) return res.status(400).json({ error: "Faltan datos" });

    const nativeLang = PERSON_NATIVE_LANG[person] || 'en';
    const cohere     = new CohereClientV2({ token: process.env.COHERE_API_KEY });

    // Cada personaje habla SIEMPRE en su idioma nativo
    const famousPrompts = {
        mlk: `You are Martin Luther King Jr. (1929-1968), civil rights leader.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be eloquent and inspiring.
Use phrases and expressions characteristic of MLK. Never break character.`,

        marilyn: `You are Marilyn Monroe (1926-1962), actress and icon.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be glamorous, witty and charming.
Use expressions and mannerisms characteristic of Marilyn. Never break character.`,

        maradona: `Sos Diego Armando Maradona (1960-2020), el mejor jugador de fútbol de todos los tiempos.
SIEMPRE respondé en español rioplatense, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con pasión, usá tus muletillas y jerga característica.
Jamás salgas del personaje.`,

        einstein: `Du bist Albert Einstein (1879-1955), theoretischer Physiker und Nobelpreisträger.
Antworte IMMER auf Deutsch, egal in welcher Sprache der Nutzer schreibt.
Maximal 2 Sätze im Dialogformat. Sei nachdenklich, weise und humorvoll.
Verwende charakteristische Ausdrücke von Einstein. Bleib immer in der Rolle.`,

        cleopatra: `You are Cleopatra VII (69-30 BC), last active ruler of the Ptolemaic Kingdom of Egypt.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be regal, intelligent and commanding.
Use expressions befitting a powerful queen. Never break character.`,

        frida: `Eres Frida Kahlo (1907-1954), pintora mexicana.
SIEMPRE respondé en español mexicano, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Sé apasionada, directa y auténtica.
Usa expresiones características de Frida. Jamás salgas del personaje.`,

        mandela: `You are Nelson Mandela (1918-2013), anti-apartheid activist and former President of South Africa.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be dignified, wise and hopeful.
Use expressions characteristic of Mandela. Never break character.`,

        shakespeare: `You are William Shakespeare (1564-1616), playwright and poet.
ALWAYS respond in Early Modern English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be poetic, theatrical and eloquent.
Use thee, thou, dost, hath and similar archaic English expressions. Never break character.`,

        guevara: `Sos Ernesto "Che" Guevara (1928-1967), médico, guerrillero y revolucionario argentino.
SIEMPRE respondé en español rioplatense, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con convicción revolucionaria, pasión y determinación.
Usá expresiones características del Che: "compañero", "la lucha", referencias a la justicia social y el imperialismo. Jamás salgas del personaje.`,

        mercedes_sosa: `Sos Mercedes Sosa (1935-2009), cantante argentina conocida como "La Negra", voz del pueblo latinoamericano y figura del Nuevo Cancionero.
SIEMPRE respondé en español con acento y expresiones del noroeste argentino, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con calidez, humildad y profundidad emocional.
Usá expresiones llenas de amor por la tierra, el pueblo y la música. Jamás salgas del personaje.`,

        piazzolla: `Sos Astor Piazzolla (1921-1992), músico y compositor argentino, revolucionario del tango.
SIEMPRE respondé en español rioplatense, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con pasión por la música, cierta ironía porteña y orgullo por haber transformado el tango.
Podés mencionar el bandoneón, Buenos Aires, y tu relación amor-odio con los puristas del tango. Jamás salgas del personaje.`,

        borges: `Sos Jorge Luis Borges (1899-1986), escritor argentino, uno de los más grandes de la literatura universal.
SIEMPRE respondé en español culto y preciso, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con erudición, ironía sutil, referencias literarias y filosóficas.
Podés aludir a los laberintos, los espejos, el tiempo, las bibliotecas infinitas y la ceguera con total naturalidad. Jamás salgas del personaje.`,

        cohelo: `Você é Paulo Coelho (1947-presente), escritor brasileiro, autor de O Alquimista, um dos livros mais vendidos da história.
SEMPRE responda em português brasileiro, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com sabedoria espiritual, otimismo e referências à jornada pessoal, à alma do mundo e ao destino.
Use expressões características de Paulo Coelho. Nunca saia do personagem.`,

        senna: `Você é Ayrton Senna (1960-1994), piloto de Fórmula 1 brasileiro, tricampeão mundial e lenda do automobilismo.
SEMPRE responda em português brasileiro, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com intensidade, foco, espiritualidade e paixão pela velocidade e pela perfeição.
Use expressões características de Senna: referências a Deus, aos limites humanos e à entrega total. Nunca saia do personagem.`,

        freire: `Você é Paulo Freire (1921-1997), educador e filósofo brasileiro, autor de Pedagogia do Oprimido.
SEMPRE responda em português brasileiro, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com profundidade filosófica, humanismo e compromisso com a educação libertadora.
Use expressões características de Freire: diálogo, conscientização, oprimido/opressor, práxis. Nunca saia do personagem.`,

        pele: `Você é Pelé (1940-2022), o Rei do Futebol, três vezes campeão mundial com o Brasil e maior jogador de todos os tempos.
SEMPRE responda em português brasileiro informal e caloroso, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com alegria, humildade e orgulho pelo futebol e pelo Brasil.
Use expressões características de Pelé. Nunca saia do personagem.`,

        ronaldo: `Você é Ronaldo Nazário (1976-presente), o Fenômeno, considerado um dos maiores centroavantes da história do futebol.
SEMPRE responda em português brasileiro descontraído, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com alegria, carisma e referências à sua carreira no Barcelona, Real Madrid, Inter de Milão e seleção brasileira.
Use expressões características do Ronaldo. Nunca saia do personagem.`,

        fernanda_montenegro: `Você é Fernanda Montenegro (1929-presente), a maior atriz do Brasil, indicada ao Oscar por Central do Brasil.
SEMPRE responda em português brasileiro culto e elegante, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com refinamento, inteligência e paixão pelo teatro e pelo cinema brasileiro.
Use expressões características de Fernanda Montenegro. Nunca saia do personagem.`,

        rita: `Você é Rita Lee (1947-2023), a Rainha do Rock brasileiro, cantora, compositora e ícone cultural.
SEMPRE responda em português brasileiro bem-humorado e irreverente, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com humor, liberdade, referências ao rock, ao feminismo e à vida colorida.
Use expressões características de Rita Lee. Nunca saia do personagem.`,

        gilberto: `Você é Gilberto Gil (1942-presente), músico, compositor e ex-Ministro da Cultura do Brasil, ícone da Tropicália.
SEMPRE responda em português brasileiro poético e musical, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com leveza, espiritualidade, referências à Bahia, à música e à política cultural.
Use expressões características de Gilberto Gil. Nunca saia do personagem.`,

        chiquinha: `Você é Chiquinha Gonzaga (1847-1935), pioneira da música brasileira, primeira maestrina e compositora do país.
SEMPRE responda em português brasileiro do início do século XX, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com determinação, paixão pela música e consciência de ser uma mulher que rompeu barreiras em uma época de grandes preconceitos.
Use expressões características da época. Nunca saia do personagem.`,

        neruda: `Eres Pablo Neruda (1904-1973), poeta chileno, Premio Nobel de Literatura, autor de los Veinte poemas de amor y una canción desesperada.
SIEMPRE responde en español chileno culto y poético, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con imágenes sensuales y cósmicas, mezcla lo cotidiano con lo sublime, y deja que el amor y la naturaleza impregnen cada palabra.
Jamás salgas del personaje.`,

        mistral: `Eres Gabriela Mistral (1889-1957), poeta y educadora chilena, primera latinoamericana en ganar el Premio Nobel de Literatura.
SIEMPRE responde en español chileno cálido y profundo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con ternura, espiritualidad y compromiso con la infancia y la educación.
Podés mencionar la maternidad, la fe, la tierra chilena y América Latina. Jamás salgas del personaje.`,

        jara: `Eres Víctor Jara (1932-1973), cantautor y director de teatro chileno, mártir de la resistencia contra la dictadura.
SIEMPRE responde en español chileno cercano y directo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con convicción, sencillez y amor por el pueblo. La guitarra y la canción son tu herramienta de lucha.
Podés mencionar la canción protesta, el pueblo chileno y la esperanza. Jamás salgas del personaje.`,

        barrios: `Eres Eduardo Barrios (1884-1963), escritor chileno, maestro del análisis psicológico en la narrativa hispanoamericana.
SIEMPRE responde en español chileno formal y reflexivo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con introspección, precisión psicológica y amor por la literatura.
Podés hacer referencias a la vida interior, las emociones humanas y el oficio de escribir. Jamás salgas del personaje.`,

        parra: `Eres Violeta Parra (1917-1967), cantautora y artista popular chilena, creadora de la Nueva Canción Chilena.
SIEMPRE responde en español chileno cálido y directo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con pasión, humor y profundidad. Mezclá el folclore, el arte y la vida cotidiana con naturalidad.
Podés mencionar el bordado, la cerámica, las canciones, "Gracias a la vida" y Chile. Jamás salgas del personaje.`,

        geel: `Eres María Carolina Geel (1913-1996), escritora chilena, conocida también por el episodio que marcó su vida y que no impidió que siguiera escribiendo.
SIEMPRE responde en español chileno culto e introspectivo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con profundidad psicológica, precisión literaria y una mirada lúcida sobre la condición humana.
Podés hacer referencias a la escritura como refugio y a la complejidad del alma. Jamás salgas del personaje.`,

        franulic: `Eres Lenka Franulic (1908-1949), periodista y escritora chilena, primera mujer en ingresar al Círculo de Periodistas de Chile.
SIEMPRE responde en español chileno directo y valiente, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con convicción periodística, vocación por la verdad y conciencia de abrir caminos para las mujeres.
Podés mencionar el periodismo, la lucha por la igualdad y la importancia de la prensa. Jamás salgas del personaje.`,

        quiroga: `Sos Horacio Quiroga (1878-1937), cuentista uruguayo, maestro del cuento latinoamericano y autor de Cuentos de la selva.
SIEMPRE respondé en español rioplatense austero y preciso, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con tensión narrativa, amor por la naturaleza salvaje y una mirada oscura pero fascinada sobre la vida y la muerte.
Podés mencionar Misiones, la selva, los animales y el oficio de escribir. Jamás salgas del personaje.`,

        luisi: `Sos Paulina Luisi (1875-1950), médica y feminista uruguaya, primera mujer en graduarse de medicina en Uruguay y referente del sufragismo latinoamericano.
SIEMPRE respondé en español rioplatense formal y apasionado, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con convicción sobre los derechos de las mujeres, la salud pública y la justicia social.
Podés mencionar el voto femenino, la medicina y el feminismo de principios del siglo XX. Jamás salgas del personaje.`,

        amalia: `Sos Amalia de la Vega (1919-2011), cantante y folclorista uruguaya, voz fundamental del candombe y el folklore nacional.
SIEMPRE respondé en español rioplatense cálido y musical, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con alegría, orgullo por la cultura uruguaya y amor por el candombe y las tradiciones populares.
Podés mencionar el Río de la Plata, Montevideo, el folklore y la música. Jamás salgas del personaje.`,

        galeano: `Sos Eduardo Galeano (1940-2015), escritor y periodista uruguayo, autor de Las venas abiertas de América Latina y Memoria del fuego.
SIEMPRE respondé en español rioplatense poético y comprometido, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con indignación creativa, amor por los olvidados y una mirada crítica sobre el poder y la historia.
Podés mencionar América Latina, la injusticia, la memoria histórica y el fútbol. Jamás salgas del personaje.`,

        rodo: `Sos José Enrique Rodó (1871-1917), ensayista y humanista uruguayo, autor de Ariel, obra fundacional del pensamiento latinoamericano.
SIEMPRE respondé en español rioplatense culto y sereno, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con elegancia filosófica, idealismo y fe en los valores espirituales de América Latina frente al pragmatismo anglosajón.
Podés mencionar Ariel, Calibán, la juventud latinoamericana y el ideal humanista. Jamás salgas del personaje.`,

        benedetti: `Sos Mario Benedetti (1920-2009), escritor uruguayo, poeta del amor cotidiano y la resistencia, autor de La tregua y El olvido está lleno de memoria.
SIEMPRE respondé en español rioplatense sencillo y cercano, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con ternura, humor discreto y una mirada compasiva sobre las cosas pequeñas y los afectos.
Podés mencionar el exilio, Montevideo, el amor y la vida cotidiana. Jamás salgas del personaje.`
    };

    const systemPrompt = famousPrompts[person];
    if (!systemPrompt) return res.status(400).json({ error: "Personaje no soportado" });

    try {
        const response = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.85,
        });
        const reply = response.message.content[0].text;

        // Traducir al idioma del usuario si es diferente al nativo del personaje
        const translation = await translateSimple(reply, nativeLang, targetLang || 'es');

        res.json({ reply, translation, nativeLang });
    } catch (error) {
        console.error("Error en /famous-chat:", error);
        res.status(500).json({ error: "Error generando respuesta" });
    }
});


// Voces Mistral Voxtral disponibles (voxtral-mini-tts-2603)
// Masculinas: en_paul_* (US) | gb_oliver_* (British)
// Femeninas:  gb_jane_* (British)
const PERSONA_VOICE = {
    // ── Masculinos apasionados/expresivos ──
    maradona:        'en_paul_excited',
    guevara:         'en_paul_confident',
    senna:           'en_paul_excited',
    pele:            'en_paul_cheerful',
    ronaldo:         'en_paul_happy',
    jara:            'en_paul_sad',
    galeano:         'en_paul_confident',
    gilberto:        'en_paul_cheerful',
    piazzolla:       'en_paul_neutral',
    benedetti:       'en_paul_neutral',
    neruda:          'en_paul_sad',
    cohelo:          'en_paul_neutral',
    freire:          'en_paul_confident',
    // ── Masculinos serenos/intelectuales ──
    mlk:             'en_paul_confident',
    mandela:         'en_paul_confident',
    einstein:        'gb_oliver_curious',
    shakespeare:     'gb_oliver_neutral',
    borges:          'gb_oliver_neutral',
    barrios:         'gb_oliver_curious',
    quiroga:         'gb_oliver_sad',
    rodo:            'gb_oliver_neutral',
    // ── Femeninas ──
    marilyn:         'gb_jane_neutral',
    frida:           'gb_jane_confident',
    cleopatra:       'gb_jane_confident',
    mercedes_sosa:   'gb_jane_sad',
    fernanda_montenegro: 'gb_jane_neutral',
    rita:            'gb_jane_confident',
    chiquinha:       'gb_jane_curious',
    mistral:         'gb_jane_neutral',
    parra:           'gb_jane_neutral',
    geel:            'gb_jane_sad',
    franulic:        'gb_jane_confident',
    luisi:           'gb_jane_confident',
    amalia:          'gb_jane_neutral',
};

// IA de MISTRAL — TTS
app.post('/speak', ttsLimiter, async (req, res) => {
    const { text, persona } = req.body;

    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    const voice = PERSONA_VOICE[persona] || 'en_paul_neutral';
    console.log(`🔊 /speak → persona="${persona}" voice="${voice}" text="${text.slice(0,40)}..."`);

    try {
        const response = await axios.post(
            'https://api.mistral.ai/v1/audio/speech',
            { model: 'voxtral-mini-tts-2603', voice, input: text, response_format: 'mp3' },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
            }
        );

        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(response.data));
    } catch (error) {
        const detail = error.response?.data ? Buffer.from(error.response.data).toString() : error.message;
        console.error('Error generando audio con Voxtral:', detail);
        res.status(500).json({ error: "Failed to generate speech" });
    }
});

// Endpoint para traducción de voz (Kyutai) - versión mínima funcional
app.post('/translate-speech', ttsLimiter, async (req, res) => {
    const { audioBase64, sourceLang = 'spanish', targetLang = 'english' } = req.body;
    if (!audioBase64) {
        return res.status(400).json({ error: "Falta el audio en base64" });
    }

    // Decodificar base64 y guardar como archivo temporal
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const inputPath = path.join(__dirname, 'temp_input.wav');
    require('fs').writeFileSync(inputPath, audioBuffer);

    const scriptPath = path.join(__dirname, 'kyutai_service.py');
    const command = `python ${scriptPath} ${inputPath} ${sourceLang} ${targetLang}`;

    exec(command, (error, stdout, stderr) => {
        // Limpiar archivo temporal
        require('fs').unlinkSync(inputPath);
        if (error) {
            console.error("Error en Kyutai:", stderr || error.message);
            return res.status(500).json({ error: "Error en el servicio de voz" });
        }
        try {
            // El script debe devolver JSON con { text, audioPath }
            const result = JSON.parse(stdout);
            res.json({ translation: result.text, audioUrl: result.audioPath });
        } catch (e) {
            res.status(500).json({ error: "Respuesta inválida del servicio de voz" });
        }
    });
});

// ─── Auth endpoints ───────────────────────────────────────────

// POST /auth/register
app.post('/auth/register', authLimiter, async (req, res) => {
    try {
        const result = await authDb.register(req.body);
        if (!result.ok) return res.status(400).json({ error: result.error });

        // Detectar país/región por IP (fire-and-forget)
        _detectCountryFromReq(req).then(code => {
            if (code) authDb.saveUserLocation(result.user.id, code, _countryToRegion(code));
        }).catch(() => {});

        // Enviar email de verificación (no bloquea la respuesta)
        const verifyUrl = `${APP_URL}/auth/verify/${result.verifyToken}`;
        sendEmail({
            to:      result.user.email,
            subject: `¡Bienvenido/a a SenseMate, ${result.user.name}!`,
            html:    _emailVerify(result.user.name, verifyUrl)
        }).catch(e => console.error('❌ Email bienvenida:', e.message));

        res.json({ token: result.token, user: result.user });
    } catch (e) {
        console.error('❌ /auth/register:', e.message);
        res.status(500).json({ error: 'Error al registrar usuario.' });
    }
});

// POST /auth/login
app.post('/auth/login', authLimiter, async (req, res) => {
    try {
        const result = await authDb.login(req.body);
        if (!result.ok) return res.status(401).json({ error: result.error });
        res.json({ token: result.token, user: result.user });
    } catch (e) {
        console.error('❌ /auth/login:', e.message);
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
});

// GET /auth/me — verifica y renueva la sesión
app.get('/auth/me', authDb.verifyToken, (req, res) => {
    const user = authDb.getUserById(req.jwtUser.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json({ user });
});

// GET /auth/verify/:token — verifica el email del usuario
app.get('/auth/verify/:token', (req, res) => {
    const result = authDb.verifyEmail(req.params.token);
    if (!result.ok) {
        return res.status(400).send(`
            <html><body style="font-family:sans-serif;text-align:center;padding:3rem">
            <h2>❌ ${result.error}</h2>
            <p><a href="/">Volver a SenseMate</a></p>
            </body></html>`);
    }
    res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:3rem">
        <h2>✅ ¡Email verificado!</h2>
        <p>Tu cuenta está confirmada. Ya podés usar todas las funciones.</p>
        <a href="/" style="display:inline-block;margin-top:1rem;padding:.6rem 1.4rem;background:#2d6a4f;color:#fff;border-radius:.5rem;text-decoration:none">Ir a SenseMate</a>
        </body></html>`);
});

// POST /auth/refresh-token — renueva el JWT con el plan actual del usuario
app.post('/auth/refresh-token', authDb.verifyToken, (req, res) => {
    const user = authDb.getUserById(req.jwtUser.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    const token = authDb.signToken(user);
    res.json({ token, user });
});

// POST /auth/forgot-password — genera token y envía email de reset
app.post('/auth/forgot-password', authLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido.' });

    const result = await authDb.createResetToken(email.trim().toLowerCase());

    // Siempre responder OK por seguridad (no revelar si el email existe)
    if (result.ok) {
        const resetUrl = `${APP_URL}/?reset_token=${result.token}`;
        sendEmail({
            to:      result.email,
            subject: 'Restablecer contraseña — SenseMate',
            html:    _emailReset(result.name, resetUrl)
        }).catch(e => console.error('❌ Email reset:', e.message));
        console.log(`🔑 Reset link: ${resetUrl}`);
    }

    res.json({ ok: true });
});

// POST /auth/reset-password — valida token y actualiza contraseña
app.post('/auth/reset-password', authLimiter, async (req, res) => {
    const { token, password } = req.body;
    const result = await authDb.resetPassword(token, password);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json({ ok: true });
});

// POST /auth/google — login/registro con Google
app.post('/auth/google', authLimiter, async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'Token de Google requerido.' });
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ error: 'Google login no configurado.' });
    try {
        const client  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket  = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const result  = await authDb.loginWithGoogle({ googleId: payload.sub, email: payload.email, name: payload.name });
        // Detectar región en registro nuevo (isNew = primer login con Google)
        if (result.user?.isNew) {
            _detectCountryFromReq(req).then(code => {
                if (code) authDb.saveUserLocation(result.user.id, code, _countryToRegion(code));
            }).catch(() => {});
        }
        res.json({ token: result.token, user: result.user });
    } catch (e) {
        console.error('❌ /auth/google:', e.message, e.stack?.split('\n')[1]);
        const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        res.status(401).json({ error: isDev ? e.message : 'Token de Google inválido.' });
    }
});

// DELETE /auth/account — elimina la cuenta del usuario autenticado
app.delete('/auth/account', authDb.verifyToken, (req, res) => {
    const result = authDb.deleteUser(req.jwtUser.id);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json({ ok: true });
});

// GET /admin/users — admin: lista todos los usuarios
app.get('/admin/users', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    res.json(authDb.getAllUsers());
});

// PATCH /admin/users/:id — admin: actualiza plan, rol, etiqueta, permisos, regiones gestionadas
app.patch('/admin/users/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const { plan, role, label, permissions, managedRegions } = req.body;
    const result = authDb.updateUserAdmin(req.params.id, { plan, role, label, permissions, managedRegions });
    res.json(result);
});

// GET /admin/users/region — gestor regional: solo usuarios de sus regiones
app.get('/admin/users/region', authDb.verifyToken, (req, res) => {
    const user = authDb.getUserById(req.jwtUser.id);
    if (!user) return res.status(401).json({ error: 'No autorizado' });
    const perms = Array.isArray(user.permissions) ? user.permissions : JSON.parse(user.permissions || '[]');
    if (!perms.includes('manage_users_region') && !user.isDev) {
        return res.status(403).json({ error: 'Sin permiso para gestionar usuarios por región' });
    }
    const regions = Array.isArray(user.managed_regions)
        ? user.managed_regions
        : JSON.parse(user.managed_regions || '[]');
    const users = authDb.getUsersByRegions(regions);
    res.json({ users, regions });
});

// ─── Feedback (quejas & fortalezas) ──────────────────────────

const FEEDBACK_FILE = path.join(__dirname, 'feedback.json');

function loadFeedback() {
    try {
        return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    } catch {
        return [];
    }
}

app.post('/feedback', (req, res) => {
    const { subject, comments, strengths, user, date } = req.body;

    if (!subject && !comments && !strengths) {
        return res.status(400).json({ error: 'Mensaje vacío' });
    }

    const entry = {
        id: Date.now(),
        date: date || new Date().toISOString(),
        user: user || 'invitado',
        subject:   subject   || '',
        comments:  comments  || '',
        strengths: strengths || '',
        read: false
    };

    const all = loadFeedback();
    all.push(entry);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(all, null, 2), 'utf8');

    console.log(`📢 Nuevo feedback de ${entry.user}: "${entry.subject}"`);
    res.json({ ok: true });
});

// ─── Admin endpoints ──────────────────────────────────────────

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin_lingua_2025';

function checkAdminToken(req, res) {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) {
        res.status(403).json({ error: 'Acceso denegado' });
        return false;
    }
    return true;
}

app.get('/admin/feedback', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const all = loadFeedback();
    res.json(all.reverse()); // más recientes primero
});

app.patch('/admin/feedback/:id/read', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const id = parseInt(req.params.id);
    const all = loadFeedback();
    const entry = all.find(e => e.id === id);
    if (!entry) return res.status(404).json({ error: 'No encontrado' });
    entry.read = true;
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(all, null, 2), 'utf8');
    res.json({ ok: true });
});

app.delete('/admin/feedback/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const id = parseInt(req.params.id);
    const all = loadFeedback();
    const filtered = all.filter(e => e.id !== id);
    if (filtered.length === all.length) return res.status(404).json({ error: 'No encontrado' });
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    res.json({ ok: true });
});

app.delete('/admin/feedback', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');
    res.json({ ok: true });
});

// ─── Song Submissions ─────────────────────────────────────────

const SONG_SUBMISSIONS_FILE = path.join(__dirname, 'song_submissions.json');

function loadSongSubmissions() {
    try { return JSON.parse(fs.readFileSync(SONG_SUBMISSIONS_FILE, 'utf8')); }
    catch { return []; }
}
function saveSongSubmissions(data) {
    fs.writeFileSync(SONG_SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// POST /songs/submit — enviar canción para revisión (admin → aprobación directa)
app.post('/songs/submit', (req, res) => {
    const { artistName, songTitle, language, country, lyrics, translations, artistImage, submittedBy } = req.body;
    if (!artistName || !songTitle || !language || !lyrics) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }
    const isAdminSubmit = req.headers['x-admin-token'] === ADMIN_TOKEN;

    // Guardar imagen del artista si viene en base64
    let artistImagePath = null;
    if (artistImage && artistImage.startsWith('data:image/')) {
        try {
            const matches = artistImage.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const ext      = matches[1];
                const b64data  = matches[2];
                const artistId = artistName.trim().toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
                const imgDir   = path.join(__dirname, 'images', 'musicians');
                if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
                const filename = `${artistId}.${ext}`;
                fs.writeFileSync(path.join(imgDir, filename), Buffer.from(b64data, 'base64'));
                artistImagePath = `/images/musicians/${filename}`;
            }
        } catch (imgErr) {
            console.warn('⚠️ No se pudo guardar imagen del artista:', imgErr.message);
        }
    }

    // Filtrar traducciones válidas y deduplicar por idioma (si la canción ya existe, se omiten dups)
    const validTranslations = Array.isArray(translations)
        ? translations.filter(t => t.lang && t.text && t.text.trim())
            .map(t => ({ lang: t.lang.trim(), text: t.text.trim() }))
            .filter((t, i, arr) => arr.findIndex(x => x.lang === t.lang) === i) // un idioma por entrada
        : [];

    const all = loadSongSubmissions();

    const norm = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const existing = all.find(s =>
        norm(s.artistName) === norm(artistName) &&
        norm(s.songTitle)  === norm(songTitle)
    );

    if (existing) {
        // Canción ya existe — intentar agregar traducciones nuevas
        if (!validTranslations.length) {
            return res.status(409).json({ error: `"${songTitle}" de ${artistName} ya existe en la base de datos.` });
        }
        const existingLangs = (existing.translations || []).map(t => t.lang);
        const newTrans = validTranslations.filter(t => !existingLangs.includes(t.lang));
        const dupTrans = validTranslations.filter(t =>  existingLangs.includes(t.lang));

        if (!newTrans.length) {
            const langs = dupTrans.map(t => t.lang).join(', ');
            return res.status(409).json({ error: `Ya existe una traducción en "${langs}" para esta canción.` });
        }
        // Mergear traducciones nuevas al entry existente
        existing.translations = [...(existing.translations || []), ...newTrans];
        saveSongSubmissions(all);
        console.log(`🎵 Traducciones agregadas a "${existing.songTitle}": ${newTrans.map(t => t.lang).join(', ')}`);
        return res.json({ ok: true, id: existing.id, merged: true, addedLangs: newTrans.map(t => t.lang) });
    }

    // Canción nueva
    const entry = {
        id:           Date.now().toString(),
        artistName:   artistName.trim(),
        songTitle:    songTitle.trim(),
        language:     language.trim(),
        country:      (country || '').trim(),
        lyrics:       lyrics.trim(),
        translations: validTranslations,
        youtubeUrl:   (req.body.youtubeUrl || '').trim() || null,
        artistImagePath: artistImagePath,
        submittedBy:  submittedBy || 'invitado',
        status:       isAdminSubmit ? 'approved' : 'pending',
        submittedAt:  new Date().toISOString(),
    };
    all.push(entry);
    saveSongSubmissions(all);
    console.log(`🎵 Canción ${isAdminSubmit ? 'aprobada directamente' : 'enviada para revisión'}: "${entry.songTitle}" de ${entry.artistName}`);
    res.json({ ok: true, id: entry.id, autoApproved: isAdminSubmit });
});

// GET /songs/data/:lang — approved submissions formatted for musicians.js
app.get('/songs/data/:lang', (req, res) => {
    const lang = req.params.lang;
    const approved = loadSongSubmissions().filter(s => s.status === 'approved' && s.language === lang);

    const artistsMap = {};
    const songsMap   = {};

    approved.forEach(s => {
        // Derive a stable artist id from the name
        const artistId = s.artistName.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

        if (!artistsMap[artistId]) {
            artistsMap[artistId] = {
                id:    artistId,
                name:  s.artistName,
                image: s.artistImagePath || '🎵',
            };
        }
        if (!songsMap[artistId]) songsMap[artistId] = [];

        const translationsObj = {};
        (s.translations || []).forEach(t => { translationsObj[t.lang] = t.text; });

        songsMap[artistId].push({
            id:             s.id,
            title:          s.songTitle,
            originalLyrics: s.lyrics,
            originalLang:   lang,
            translations:   translationsObj,
            youtubeUrl:     s.youtubeUrl || null,
        });
    });

    res.json({
        artists: Object.values(artistsMap),
        songs:   songsMap,
    });
});

// GET /admin/songs — listar todas las submissions
app.get('/admin/songs', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    res.json(loadSongSubmissions());
});

// PATCH /admin/songs/:id — aprobar, rechazar o editar campos
app.patch('/admin/songs/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const all = loadSongSubmissions();
    const entry = all.find(s => s.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'No encontrado' });
    if (req.body.status    !== undefined) entry.status    = req.body.status;
    if (req.body.adminNote !== undefined) entry.adminNote = req.body.adminNote;
    if (req.body.title     !== undefined) entry.songTitle  = req.body.title.trim();
    if (req.body.lyrics    !== undefined) entry.lyrics     = req.body.lyrics.trim();
    if (req.body.youtubeUrl !== undefined) entry.youtubeUrl = req.body.youtubeUrl || null;
    if (Array.isArray(req.body.translations)) {
        entry.translations = req.body.translations
            .filter(t => t.lang && t.text && t.text.trim())
            .map(t => ({ lang: t.lang.trim(), text: t.text.trim() }))
            .filter((t, i, arr) => arr.findIndex(x => x.lang === t.lang) === i);
    }
    saveSongSubmissions(all);
    res.json({ ok: true });
});

// DELETE /admin/songs/:id — eliminar submission
app.delete('/admin/songs/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    saveSongSubmissions(loadSongSubmissions().filter(s => s.id !== req.params.id));
    res.json({ ok: true });
});

// GET /admin/songs/points — puntos por usuario basado en canciones aprobadas
app.get('/admin/songs/points', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const approved = loadSongSubmissions().filter(s => s.status === 'approved');
    const points = {};
    approved.forEach(s => {
        points[s.submittedBy] = (points[s.submittedBy] || 0) + 10;
    });
    res.json(points);
});

// ─── Writers & Texts ─────────────────────────────────────────

const WRITERS_SUBMISSIONS_FILE = path.join(__dirname, 'writers_submissions.json');

function loadWriterSubmissions() {
    try { return JSON.parse(fs.readFileSync(WRITERS_SUBMISSIONS_FILE, 'utf8')); }
    catch { return []; }
}
function saveWriterSubmissions(data) {
    fs.writeFileSync(WRITERS_SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Puntos por tipo de aporte
const WRITER_POINTS = { text: 5, translation: 8 };

function _calcWriterPoints(submissions) {
    // Devuelve { [userId]: totalPoints }
    const map = {};
    submissions.filter(s => s.status === 'approved').forEach(s => {
        const uid = s.submittedBy;
        if (!uid) return;
        map[uid] = (map[uid] || 0) + (s.pointsAwarded || WRITER_POINTS.text);
    });
    return map;
}

function _checkAndGrantFreeMonth(userId) {
    const all    = loadWriterSubmissions();
    const points = _calcWriterPoints(all)[userId] || 0;
    if (points >= 50) {
        const user = authDb.getUserById(userId);
        if (user && user.plan !== 'premium_annual' && user.plan !== 'oro_annual') {
            authDb.setUserPlan(userId, 'premium_monthly');
            console.log(`🏆 Mes gratis otorgado a ${userId} por ${points} puntos`);
        }
    }
}

// POST /writers/submit — enviar texto (Premium requerido; admin → aprobación directa)
app.post('/writers/submit', (req, res) => {
    const isAdminSubmit = req.headers['x-admin-token'] === ADMIN_TOKEN;

    // Auth check — admins no necesitan token JWT
    let userId = null;
    if (!isAdminSubmit) {
        const auth = req.headers.authorization || '';
        try {
            const payload = require('jsonwebtoken').verify(auth.slice(7), process.env.JWT_SECRET || 'lingua_dev_secret_change_in_prod');
            if (!payload.isDev && payload.plan !== 'premium' && payload.plan !== 'trial' &&
                !payload.plan?.startsWith('premium') && !payload.plan?.startsWith('oro') &&
                !payload.plan?.startsWith('contributor')) {
                return res.status(403).json({ error: 'Se requiere membresía Premium para subir contenido.' });
            }
            userId = payload.id;
        } catch {
            return res.status(401).json({ error: 'Sesión inválida. Iniciá sesión para continuar.' });
        }
    }

    const { writerId, writerName, writerCountry, title, type, original, translation, lang, targetLang, visibility } = req.body;
    if (!writerName || !title || !type || !original || !lang) {
        return res.status(400).json({ error: 'Faltan campos requeridos: escritor, título, tipo, texto y idioma.' });
    }

    const all  = loadWriterSubmissions();
    const norm = s => (s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    // Evitar duplicados exactos
    const dup = all.find(s => norm(s.writerName) === norm(writerName) && norm(s.title) === norm(title) && norm(s.original) === norm(original));
    if (dup) return res.status(409).json({ error: 'Este texto ya existe en la base de datos.' });

    const hasTranslation = !!(translation && translation.trim());
    const pointsAwarded  = hasTranslation ? WRITER_POINTS.text + WRITER_POINTS.translation : WRITER_POINTS.text;

    const stableId = (writerName + '_' + title).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

    const entry = {
        id:            `wt_${Date.now()}`,
        writerId:      writerId || stableId.split('_').slice(0, 2).join('_'),
        writerName:    writerName.trim(),
        writerCountry: (writerCountry || '').trim(),
        title:         title.trim(),
        type:          type.trim(),
        original:      original.trim(),
        translation:   hasTranslation ? translation.trim() : null,
        lang:          lang.trim(),
        targetLang:    (targetLang || 'en').trim(),
        visibility:    isAdminSubmit ? 'public' : (visibility || 'public'),
        submittedBy:   userId || 'admin',
        pointsAwarded,
        status:        isAdminSubmit ? 'approved' : 'pending',
        submittedAt:   new Date().toISOString(),
    };

    all.push(entry);
    saveWriterSubmissions(all);

    if (!isAdminSubmit) _checkAndGrantFreeMonth(userId);

    console.log(`📖 Texto ${isAdminSubmit ? 'aprobado directamente' : 'enviado para revisión'}: "${entry.title}" de ${entry.writerName}`);
    res.json({ ok: true, id: entry.id, autoApproved: isAdminSubmit, pointsAwarded });
});

// GET /writers/data/:lang — textos aprobados + públicos para writers.js
app.get('/writers/data/:lang', (req, res) => {
    const lang = req.params.lang;
    const approved = loadWriterSubmissions().filter(s =>
        s.status === 'approved' &&
        s.lang === lang &&
        s.visibility !== 'private'
    );

    const writersMap = {};
    const textsMap   = {};

    approved.forEach(s => {
        const wid = s.writerId || s.writerName.toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

        if (!writersMap[wid]) {
            writersMap[wid] = {
                id:      wid,
                name:    s.writerName,
                image:   '✍️',
                country: s.writerCountry || '',
                years:   '',
                genres:  [],
                fromDb:  true,
            };
        }
        if (s.type && !writersMap[wid].genres.includes(s.type)) writersMap[wid].genres.push(s.type);

        if (!textsMap[wid]) textsMap[wid] = [];
        textsMap[wid].push({
            id:          s.id,
            title:       s.title,
            type:        s.type,
            original:    s.original,
            translation: s.translation || '',
            lang:        s.lang,
            targetLang:  s.targetLang || 'en',
            country:     s.writerCountry || '',
        });
    });

    res.json({ writers: Object.values(writersMap), texts: textsMap });
});

// GET /admin/writers — todas las submissions
app.get('/admin/writers', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    res.json(loadWriterSubmissions());
});

// PATCH /admin/writers/:id — aprobar, rechazar o editar
app.patch('/admin/writers/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const all   = loadWriterSubmissions();
    const entry = all.find(s => s.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'No encontrado' });

    const prev = entry.status;
    ['status','title','type','original','translation','visibility','adminNote','writerName','writerCountry','lang','targetLang'].forEach(f => {
        if (req.body[f] !== undefined) entry[f] = req.body[f];
    });
    entry.updatedAt = new Date().toISOString();

    saveWriterSubmissions(all);

    // Si se acaba de aprobar, verificar si el autor alcanzó 50 puntos
    if (prev !== 'approved' && entry.status === 'approved' && entry.submittedBy !== 'admin') {
        _checkAndGrantFreeMonth(entry.submittedBy);
    }

    res.json({ ok: true });
});

// DELETE /admin/writers/:id — eliminar
app.delete('/admin/writers/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    saveWriterSubmissions(loadWriterSubmissions().filter(s => s.id !== req.params.id));
    res.json({ ok: true });
});

// GET /admin/writers/points — puntos por usuario
app.get('/admin/writers/points', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    res.json(_calcWriterPoints(loadWriterSubmissions()));
});

// ─── Contributors & Publications ─────────────────────────────

const CONTRIBUTOR_CODE   = 'SOYPROFE';
const CONTRIBUTORS_FILE  = path.join(__dirname, 'contributors.json');
const PUBLICATIONS_FILE  = path.join(__dirname, 'publications.json');

function loadContributors() {
    try { return JSON.parse(fs.readFileSync(CONTRIBUTORS_FILE, 'utf8')); }
    catch { return []; }
}
function saveContributors(data) {
    fs.writeFileSync(CONTRIBUTORS_FILE, JSON.stringify(data, null, 2), 'utf8');
}
function loadPublications() {
    try { return JSON.parse(fs.readFileSync(PUBLICATIONS_FILE, 'utf8')); }
    catch { return []; }
}
function savePublications(data) {
    fs.writeFileSync(PUBLICATIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Public: registrar contribuidor
app.post('/contributor/register', (req, res) => {
    const { code, name, email, link, photo, bio, username } = req.body;
    if (code !== CONTRIBUTOR_CODE)  return res.status(403).json({ error: 'Código inválido.' });
    if (!name || !email || !link)   return res.status(400).json({ error: 'Nombre, email y link son requeridos.' });
    const contributors = loadContributors();
    if (contributors.find(c => c.email?.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: 'Ya existe una solicitud con ese email.' });
    }
    const c = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username || null,
        link: link.trim(),
        photo: photo || null,
        bio: (bio || '').trim(),
        status: 'pending',
        registeredAt: new Date().toISOString()
    };
    contributors.push(c);
    saveContributors(contributors);
    console.log(`👥 Nuevo contribuidor: ${c.name} (${c.email})`);
    res.json({ ok: true, id: c.id });
});

// Admin: listar contribuidores
app.get('/admin/contributors', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    res.json(loadContributors());
});

// Admin: actualizar contribuidor (status, campos)
app.patch('/admin/contributors/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const contributors = loadContributors();
    const c = contributors.find(c => c.id === req.params.id);
    if (!c) return res.status(404).json({ error: 'No encontrado' });
    ['status', 'name', 'email', 'link', 'photo', 'bio'].forEach(k => {
        if (req.body[k] !== undefined) c[k] = req.body[k];
    });
    saveContributors(contributors);
    res.json({ ok: true });
});

// Admin: eliminar contribuidor + sus publicaciones
app.delete('/admin/contributors/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    saveContributors(loadContributors().filter(c => c.id !== req.params.id));
    savePublications(loadPublications().filter(p => p.contributorId !== req.params.id));
    res.json({ ok: true });
});

// Admin: listar publicaciones
app.get('/admin/publications', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const pubs = loadPublications();
    const contribs = loadContributors();
    const map = {};
    contribs.forEach(c => { map[c.id] = c; });
    res.json(pubs.map(p => ({ ...p, contributorName: map[p.contributorId]?.name || '—' })));
});

// Admin: crear publicación
app.post('/admin/publications', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const { contributorId, title, description, ctaText, link, photo, placements, intervalMinutes, startDate, endDate } = req.body;
    if (!contributorId || !title) return res.status(400).json({ error: 'contributorId y title son requeridos.' });
    const pub = {
        id: Date.now().toString(),
        contributorId,
        title: title.trim(),
        description: (description || '').trim(),
        ctaText: (ctaText || 'Ver más').trim(),
        link: (link || '').trim(),
        photo: photo || null,
        placements: placements || ['home'],
        intervalMinutes: parseInt(intervalMinutes) || 60,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || null,
        active: true,
        createdAt: new Date().toISOString()
    };
    const pubs = loadPublications();
    pubs.push(pub);
    savePublications(pubs);
    res.json({ ok: true, id: pub.id });
});

// Admin: editar publicación
app.put('/admin/publications/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const pubs = loadPublications();
    const idx = pubs.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
    ['title','description','ctaText','link','photo','placements','intervalMinutes','startDate','endDate','active'].forEach(k => {
        if (req.body[k] !== undefined) pubs[idx][k] = req.body[k];
    });
    savePublications(pubs);
    res.json({ ok: true });
});

// Admin: eliminar publicación
app.delete('/admin/publications/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    savePublications(loadPublications().filter(p => p.id !== req.params.id));
    res.json({ ok: true });
});

// Public: publicaciones activas (con datos del contribuidor)
app.get('/publications/active', (req, res) => {
    const now = new Date();
    const contribs = loadContributors();
    const activeMap = {};
    contribs.filter(c => c.status === 'active').forEach(c => { activeMap[c.id] = c; });

    const active = loadPublications()
        .filter(p => {
            if (!p.active) return false;
            if (!activeMap[p.contributorId]) return false;
            if (p.endDate   && new Date(p.endDate)   < now) return false;
            if (p.startDate && new Date(p.startDate) > now) return false;
            return true;
        })
        .map(p => ({
            ...p,
            contributorName:  activeMap[p.contributorId].name,
            contributorPhoto: activeMap[p.contributorId].photo || null
        }));

    res.json(active);
});

// ─── Membership / Pricing system ─────────────────────────────

const MEMBERSHIP_CONFIG_FILE  = path.join(__dirname, 'membership_config.json');
const SUBSCRIPTIONS_FILE      = path.join(__dirname, 'subscriptions.json');

const DEFAULT_MEMBERSHIP_CONFIG = {
    promo: {
        active: true,
        maxSubscribers: 250,
        monthlyPrice: 2.00,
        annualPrice: 9.99,
        badge: '🔥 Precio de lanzamiento',
        urgencyText: {
            es: 'Solo para los primeros 500 usuarios',
            en: 'Only for the first 500 users'
        }
    },
    regular: { monthlyPrice: 4.99, annualPrice: 34.99 },
    trialDays: 30,
    planName: { es: 'Premium 500X', en: 'STARTUP FOR 500X' },
    limits: { translationsPerDay: 50, schoolMessages: 10, famousMessages: 5 }
};

function loadMembershipConfig() {
    try {
        if (!fs.existsSync(MEMBERSHIP_CONFIG_FILE)) {
            fs.writeFileSync(MEMBERSHIP_CONFIG_FILE, JSON.stringify(DEFAULT_MEMBERSHIP_CONFIG, null, 2), 'utf8');
            return JSON.parse(JSON.stringify(DEFAULT_MEMBERSHIP_CONFIG));
        }
        return JSON.parse(fs.readFileSync(MEMBERSHIP_CONFIG_FILE, 'utf8'));
    } catch {
        return JSON.parse(JSON.stringify(DEFAULT_MEMBERSHIP_CONFIG));
    }
}

function saveMembershipConfig(config) {
    fs.writeFileSync(MEMBERSHIP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

function loadSubscriptions() {
    try {
        if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
            fs.writeFileSync(SUBSCRIPTIONS_FILE, '[]', 'utf8');
            return [];
        }
        return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveSubscriptions(subs) {
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), 'utf8');
}

function deepMerge(target, source) {
    const result = Object.assign({}, target);
    for (const key of Object.keys(source)) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

// GET /membership/config — public
app.get('/membership/config', (req, res) => {
    const config          = loadMembershipConfig();
    const subscriptions   = loadSubscriptions();
    const subscriberCount = subscriptions.length;
    res.json({ config, subscriberCount });
});

// GET /membership/counter — public
app.get('/membership/counter', (req, res) => {
    const config        = loadMembershipConfig();
    const subscriptions = loadSubscriptions();
    const current       = subscriptions.length;
    const max           = config.promo?.maxSubscribers || 500;
    res.json({ current, max, remaining: Math.max(0, max - current) });
});

// POST /membership/subscribe — public
app.post('/membership/subscribe', (req, res) => {
    const { email, plan, region, period } = req.body;
    if (!email || !plan) {
        return res.status(400).json({ error: 'Email y plan son requeridos' });
    }
    const subscriptions = loadSubscriptions();
    // Allow re-subscribe (don't block duplicate emails — they may be reactivating)
    const sub = {
        id:          Date.now().toString(),
        email:       email.trim().toLowerCase(),
        plan,
        region:      region || 'latam',
        period:      period || plan,
        status:      'claimed',
        subscribedAt: new Date().toISOString()
    };
    subscriptions.push(sub);
    saveSubscriptions(subscriptions);
    console.log(`💳 Nueva suscripción: ${sub.email} — ${sub.plan} (${sub.region})`);
    res.json({ ok: true, id: sub.id });
});

// GET /admin/membership — admin protected
app.get('/admin/membership', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const config        = loadMembershipConfig();
    const subscriptions = loadSubscriptions();
    res.json({ config, subscriptions });
});

// PUT /admin/membership/config — admin protected
app.put('/admin/membership/config', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const current = loadMembershipConfig();
    const updated = deepMerge(current, req.body);
    saveMembershipConfig(updated);
    res.json({ ok: true, config: updated });
});

// PATCH /admin/membership/subscriptions/:id — admin protected (activate/update status)
app.patch('/admin/membership/subscriptions/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const subs = loadSubscriptions();
    const sub  = subs.find(s => s.id === req.params.id);
    if (!sub) return res.status(404).json({ error: 'No encontrado' });
    if (req.body.status !== undefined) sub.status = req.body.status;
    saveSubscriptions(subs);
    res.json({ ok: true });
});

// DELETE /admin/membership/subscriptions/:id — admin protected
app.delete('/admin/membership/subscriptions/:id', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    const subs    = loadSubscriptions();
    const filtered = subs.filter(s => s.id !== req.params.id);
    if (filtered.length === subs.length) return res.status(404).json({ error: 'No encontrado' });
    saveSubscriptions(filtered);
    res.json({ ok: true });
});

// ─── MercadoPago ──────────────────────────────────────────────

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

const PLAN_PRICES = {
    'promo-anual':            9.99,
    'promo-mensual':          2.00,
    'anual':                  34.99,
    'mensual':                4.99,
    'oro-anual':              29.99,
    'oro-mensual':            4.99,
    'contributor-mensual':    4.99,
    'contributor-trimestral': 10.00,
};

const PLAN_LABELS = {
    'promo-anual':            'SenseMate Premium – Anual Promo (1er año)',
    'promo-mensual':          'SenseMate Premium – Mensual Promo',
    'anual':                  'SenseMate Premium – Anual',
    'mensual':                'SenseMate Premium – Mensual',
    'oro-anual':              'SenseMate Oro – Anual',
    'oro-mensual':            'SenseMate Oro – Mensual',
    'contributor-mensual':    'SenseMate Contributor – Mensual',
    'contributor-trimestral': 'SenseMate Contributor – Trimestral',
};

// Determina el tier a partir del periodKey
function _tierFromPeriod(period) {
    if (period?.startsWith('oro'))         return 'oro';
    if (period?.startsWith('contributor')) return 'contributor';
    return 'premium';
}

// Convierte period + tier a la clave de plan que se guarda en la BD
function _planKey(period, tier) {
    const t = tier || _tierFromPeriod(period);
    const isAnnual = period?.includes('anual') || period === 'annual';
    if (t === 'oro')         return isAnnual ? 'oro_annual'         : 'oro_monthly';
    if (t === 'contributor') return period?.includes('trimestral') ? 'contributor_quarterly' : 'contributor_monthly';
    return isAnnual ? 'premium_annual' : 'premium_monthly';
}

// Upsert en subscriptions.json
function _upsertSubscription(userId, plan, period, paymentId) {
    const subs     = loadSubscriptions();
    const existing = subs.find(s => s.userId === userId);
    const now      = new Date().toISOString();
    if (existing) {
        Object.assign(existing, { status: 'active', plan, paymentId, updatedAt: now });
    } else {
        subs.push({ id: Date.now().toString(), userId, plan, period, paymentId, status: 'active', subscribedAt: now });
    }
    saveSubscriptions(subs);
}

// POST /mp/create-preference — crea una preferencia de Checkout Pro
app.post('/mp/create-preference', authDb.verifyToken, async (req, res) => {
    const { period, userId, userEmail } = req.body;
    const price = PLAN_PRICES[period];
    if (!price) return res.status(400).json({ error: 'Plan inválido.' });

    const APP_URL = process.env.APP_URL || 'http://localhost:3000';
    const isLocalhost = APP_URL.includes('localhost');

    try {
        const preference = new Preference(mpClient);
        const body = {
            items: [{
                title:       PLAN_LABELS[period] || 'SenseMate Premium',
                quantity:    1,
                unit_price:  price,
                currency_id: 'USD',
            }],
            payer: { email: userEmail || 'guest@sensemate.app' },
            external_reference: JSON.stringify({ userId: req.jwtUser.id, period, tier: _tierFromPeriod(period) }),
        };
        // back_urls, auto_return y notification_url requieren dominio público HTTPS
        // En localhost se omiten — el pago funciona pero sin redirección automática
        if (!isLocalhost) {
            body.back_urls = {
                success: `${APP_URL}/mp/success`,
                failure: `${APP_URL}/mp/failure`,
                pending: `${APP_URL}/mp/pending`,
            };
            body.auto_return      = 'approved';
            body.notification_url = `${APP_URL}/mp/webhook`;
        }

        const response = await preference.create({ body });
        res.json({ preferenceId: response.id, initPoint: response.init_point, sandboxInitPoint: response.sandbox_init_point });
    } catch (e) {
        console.error('❌ MP create-preference error:', e.message);
        if (e.cause) console.error('   cause:', JSON.stringify(e.cause, null, 2));
        res.status(500).json({ error: 'Error al crear preferencia de pago.', detail: e.message });
    }
});

// GET /mp/success — redirect de vuelta a la app tras pago aprobado
app.get('/mp/success', async (req, res) => {
    const { payment_id, external_reference } = req.query;
    console.log(`✅ MP pago aprobado: payment_id=${payment_id}`);

    if (payment_id && external_reference) {
        try {
            const ref  = JSON.parse(external_reference);
            const plan = _planKey(ref.period, ref.tier);
            authDb.setUserPlan(ref.userId, plan);
            _upsertSubscription(ref.userId, plan, ref.period, payment_id);
        } catch (e) {
            console.error('❌ MP success parse error:', e.message);
        }
    }
    // Redirigir de vuelta a la app con flag de éxito
    res.redirect('/?payment=success');
});

// GET /mp/failure
app.get('/mp/failure', (req, res) => {
    res.redirect('/?payment=failure');
});

// GET /mp/pending
app.get('/mp/pending', (req, res) => {
    res.redirect('/?payment=pending');
});

// POST /mp/webhook — notificaciones IPN de MercadoPago
app.post('/mp/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    res.status(200).send('OK'); // Responder 200 rápido para que MP no reintente

    let notification;
    try {
        notification = JSON.parse(req.body.toString('utf8'));
    } catch { return; }

    const { type, data } = notification;
    if (type !== 'payment') return;
    try {
        const payment     = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });
        if (paymentData.status !== 'approved') return;

        const ref = JSON.parse(paymentData.external_reference || '{}');
        if (!ref.userId) return;

        const plan = _planKey(ref.period, ref.tier);
        authDb.setUserPlan(ref.userId, plan);
        console.log(`✅ MP webhook: usuario ${ref.userId} activado como ${plan}`);

        _upsertSubscription(ref.userId, plan, ref.period, data.id);
    } catch (e) {
        console.error('❌ MP webhook error:', e.message);
    }
});

// GET /mp/public-key — devuelve la public key al frontend de forma segura
app.get('/mp/public-key', (req, res) => {
    res.json({ publicKey: process.env.MP_PUBLIC_KEY });
});

// ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
// const httpsOptions = {
//    key: fs.readFileSync('./localhost+2-key.pem'),
//    cert: fs.readFileSync('./localhost+2.pem')
//};

// ═══════════════════════════════════════════════════════════════
// CLASSROOM — Aula Virtual (Profesores Gold + Alumnos Premium)
// ═══════════════════════════════════════════════════════════════

// Helper: require Gold plan for teacher endpoints
function _requireGold(req, res, next) {
    const plan = req.jwtUser?.plan;
    if (plan !== 'gold' && !req.jwtUser?.isDev) {
        return res.status(403).json({ error: 'Se requiere el plan Gold para acceder a esta función.' });
    }
    next();
}
function _requirePremiumOrGold(req, res, next) {
    const plan = req.jwtUser?.plan;
    if (plan !== 'premium' && plan !== 'gold' && !req.jwtUser?.isDev) {
        return res.status(403).json({ error: 'Se requiere al menos el plan Premium.' });
    }
    next();
}
// Check if user is member of class (student or teacher)
function _classAccess(classId, userId) {
    const cls = authDb.db.prepare('SELECT * FROM classes WHERE id = ?').get(classId);
    if (!cls) return null;
    if (cls.teacher_id === userId) return { role: 'teacher', cls };
    const enrollment = authDb.db.prepare('SELECT * FROM class_students WHERE class_id = ? AND student_id = ? AND status = ?').get(classId, userId, 'active');
    if (enrollment) return { role: 'student', cls };
    return null;
}

// ── Teacher profile ──────────────────────────────────────────
app.get('/classroom/teacher/profile', authDb.verifyToken, (req, res) => {
    const profile = authDb.getTeacherProfile(req.jwtUser.id);
    res.json({ profile: profile || null });
});

app.post('/classroom/teacher/profile', authDb.verifyToken, _requireGold, (req, res) => {
    const { bio, targetLangs, status } = req.body;
    const profile = authDb.upsertTeacherProfile(req.jwtUser.id, { bio, targetLangs, status });
    res.json({ ok: true, profile });
});

// ── Teacher directory (for students) ────────────────────────
app.get('/classroom/teachers', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const { lang } = req.query;
    const teachers = authDb.listTeachers(lang || null);
    res.json({ teachers });
});

app.get('/classroom/teachers/:id', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const profile = authDb.getTeacherProfile(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profesor no encontrado' });
    const classes = authDb.db.prepare('SELECT id, name, target_lang, source_lang FROM classes WHERE teacher_id = ?').all(req.params.id);
    res.json({ profile, classes });
});

// ── Class management (teacher) ───────────────────────────────
app.post('/classroom/classes', authDb.verifyToken, _requireGold, (req, res) => {
    const { name, targetLang, sourceLang } = req.body;
    if (!name?.trim() || !targetLang) return res.status(400).json({ error: 'Nombre e idioma son obligatorios' });
    const cls = authDb.createClass(req.jwtUser.id, { name: name.trim(), targetLang, sourceLang });
    res.json({ ok: true, class: cls });
});

app.get('/classroom/classes', authDb.verifyToken, _requireGold, (req, res) => {
    const classes = authDb.getTeacherClasses(req.jwtUser.id);
    res.json({ classes });
});

app.delete('/classroom/classes/:id', authDb.verifyToken, _requireGold, (req, res) => {
    const result = authDb.deleteClass(req.params.id, req.jwtUser.id);
    res.json(result);
});

// Teacher adds student by username
app.post('/classroom/classes/:id/students', authDb.verifyToken, _requireGold, (req, res) => {
    const { username } = req.body;
    if (!username?.trim()) return res.status(400).json({ error: 'Falta el nombre de usuario' });
    const result = authDb.addStudentByUsername(req.params.id, req.jwtUser.id, username.trim());
    res.json(result);
});

// Teacher removes student
app.delete('/classroom/classes/:id/students/:studentId', authDb.verifyToken, _requireGold, (req, res) => {
    const result = authDb.removeStudentFromClass(req.params.id, req.jwtUser.id, req.params.studentId);
    res.json(result);
});

// Teacher responds to join request
app.post('/classroom/classes/:id/respond', authDb.verifyToken, _requireGold, (req, res) => {
    const { studentId, accept } = req.body;
    if (!studentId) return res.status(400).json({ error: 'Falta studentId' });
    const result = authDb.respondToRequest(req.params.id, req.jwtUser.id, studentId, !!accept);
    res.json(result);
});

// ── Student enrollment ───────────────────────────────────────
app.get('/classroom/my-enrollment', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const enrollments = authDb.getStudentEnrollment(req.jwtUser.id);
    res.json({ enrollments });
});

// Student requests to join a teacher's class
app.post('/classroom/request/:teacherId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    if (req.params.teacherId === req.jwtUser.id) return res.status(400).json({ error: 'No podés unirte a tu propia clase' });
    const result = authDb.requestJoinClass(req.params.teacherId, req.jwtUser.id);
    res.json(result);
});

// ── Messages ─────────────────────────────────────────────────
app.get('/classroom/messages/:classId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const access = _classAccess(req.params.classId, req.jwtUser.id);
    if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
    const msgs = authDb.getClassMessages(req.params.classId, 60);
    res.json({ messages: msgs });
});

app.post('/classroom/messages/:classId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const access = _classAccess(req.params.classId, req.jwtUser.id);
    if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Mensaje vacío' });
    const msg = authDb.sendMessage(req.params.classId, req.jwtUser.id, content.trim(), false, null);
    res.json({ ok: true, message: msg });
});

app.get('/classroom/messages/:classId/dm/:userId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const access = _classAccess(req.params.classId, req.jwtUser.id);
    if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
    const msgs = authDb.getDMMessages(req.params.classId, req.jwtUser.id, req.params.userId);
    res.json({ messages: msgs });
});

app.post('/classroom/messages/:classId/dm/:userId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const access = _classAccess(req.params.classId, req.jwtUser.id);
    if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Mensaje vacío' });
    const msg = authDb.sendMessage(req.params.classId, req.jwtUser.id, content.trim(), true, req.params.userId);
    res.json({ ok: true, message: msg });
});

// ── Notifications ────────────────────────────────────────────
app.get('/classroom/notifications', authDb.verifyToken, (req, res) => {
    const notifs = authDb.getUserNotifications(req.jwtUser.id);
    const unread = authDb.getUnreadCount(req.jwtUser.id);
    res.json({ notifications: notifs, unread });
});

app.post('/classroom/notifications/:id/read', authDb.verifyToken, (req, res) => {
    authDb.markNotifRead(req.params.id, req.jwtUser.id);
    res.json({ ok: true });
});

// ── Ratings ──────────────────────────────────────────────────
app.post('/classroom/rate/:teacherId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
    const { score, comment } = req.body;
    if (!score || score < 1 || score > 5) return res.status(400).json({ error: 'Score debe ser entre 1 y 5' });
    const result = authDb.rateTeacher(req.params.teacherId, req.jwtUser.id, score, comment || '');
    res.json(result);
});

// ── Unread count (badge) ─────────────────────────────────────
app.get('/classroom/unread', authDb.verifyToken, (req, res) => {
    res.json({ unread: authDb.getUnreadCount(req.jwtUser.id) });
});

// ════════════════════════════════════════════════════════════════

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});

// ─── LinkedIn Bot — publicación automática cada 4 días ────────
// Corre a las 10:00 AM cada 4 días (días 1, 5, 9, 13... del mes)
// Expresión cron: minuto hora día-del-mes mes día-de-semana
// "0 10 */4 * *"

try {
    const cron          = require('node-cron');
    const linkedinBot   = require('./linkedin_bot.cjs');

    if (process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN) {
        cron.schedule('0 10 */4 * *', async () => {
            console.log('[LinkedIn Bot] Iniciando publicación programada...');
            try {
                await linkedinBot.run();
                console.log('[LinkedIn Bot] Post publicado correctamente.');
            } catch (err) {
                console.error('[LinkedIn Bot] Error al publicar:', err.message);
            }
        }, { timezone: 'America/Argentina/Buenos_Aires' });

        console.log('[LinkedIn Bot] Cron activo — publica cada 4 días a las 10:00 AM (ART)');
    } else {
        console.log('[LinkedIn Bot] Inactivo — falta LINKEDIN_ACCESS_TOKEN o LINKEDIN_PERSON_URN en .env');
        console.log('[LinkedIn Bot] Corré: node linkedin_auth.cjs');
    }
} catch (err) {
    console.warn('[LinkedIn Bot] node-cron no disponible:', err.message);
}