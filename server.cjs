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

const planToModel = {
    'free': 'openrouter/free',
    'gold': 'deepseek/deepseek-chat'
};


// --- Función para traducir con Cohere ---
async function translateWithCohere(text, targetLang, sourceLang) {
    console.log(`🟢 translateWithCohere: texto="${text}", source=${sourceLang}, target=${targetLang}`);

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
  }
}

Reglas estrictas:
- Usa SIEMPRE comillas dobles, nunca simples.
- El campo "type" debe ser solo la abreviatura (ej: "vbo." no "verbo").
- Los ejemplos deben ser frases naturales y variadas que muestren distintos usos.
- Si el texto es una frase larga, usa "frase" como type y describe su función en "details". En este caso no muestres ejemplos.
- No incluyas nada fuera del objeto JSON.
`;

    const userMessage = `Texto a traducir: "${text}"`;

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

app.post('/translate', translateLimiter, async (req, res) => {
    console.log("🔔 Llegó petición a /translate");

    const { text, plan, sourceLang, targetLang } = req.body;
    console.log("Datos recibidos:", { text, plan, sourceLang, targetLang });

    if (!text) {
        return res.status(400).json({ error: "Falta el texto a traducir" });
    }

    try {
        if (plan === 'free') {
            const src = sourceLang || 'auto';
            const tgt = targetLang || 'spanish';
            const translationObj = await translateWithCohere(text, tgt, src);
            return res.json({
                translation: JSON.stringify(translationObj)
            });
        }

        // --- PLAN PREMIUM: (Reservado para funciones futuras de chat) ---
        if (plan === 'premium') {
            // Por ahora, devolvemos un placeholder
            return res.status(501).json({
                error: "Función de chat en desarrollo. ¡Próximamente!"
            });
        }

        // Por si acaso el plan no es válido
        return res.status(400).json({ error: "Plan no válido" });

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
    mlk:         'en',
    marilyn:     'en',
    maradona:    'es',
    einstein:    'de',
    cleopatra:   'en',
    frida:       'es',
    mandela:     'en',
    shakespeare: 'en',
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
Use thee, thou, dost, hath and similar archaic English expressions. Never break character.`
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

// server.js

// IA de MISTRAL
app.post('/speak', ttsLimiter, async (req, res) => {
    const { text, persona } = req.body;

    // Validar que recibimos un texto para hablar
    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    // Instanciamos el cliente de Mistral
    const mistralClient = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    try {
        // Realizamos la llamada a la API de Voxtral TTS
        const speechResponse = await mistralClient.audio.speech.generate({
            model: "voxtral-mini-transcribe-realtime-2602", // El modelo específico para TTS
            voice: persona, // La "voz" que queremos usar, asociada con el personaje
            input: text,
            response_format: "mp3",
        });

        // La respuesta viene en base64, la convertimos y la enviamos como un archivo de audio
        const audioBase64 = speechResponse.data[0].audio;
        const audioBuffer = Buffer.from(audioBase64, 'base64');

        // Indicamos al navegador que estamos enviando un archivo de audio
        res.set('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);
    } catch (error) {
        console.error('Error generando audio con Voxtral:', error);
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

// GET /admin/users — admin: lista todos los usuarios
app.get('/admin/users', (req, res) => {
    if (!checkAdminToken(req, res)) return;
    res.json(authDb.getAllUsers());
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

const ADMIN_TOKEN = 'admin_lingua_2025';

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
        maxSubscribers: 500,
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
    'promo-anual':   9.99,
    'promo-mensual': 2.00,
    'anual':         34.99,
    'mensual':       4.99,
};

const PLAN_LABELS = {
    'promo-anual':   'SenseMate Premium – Anual Promo (1er año)',
    'promo-mensual': 'SenseMate Premium – Mensual Promo',
    'anual':         'SenseMate Premium – Anual',
    'mensual':       'SenseMate Premium – Mensual',
};

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
                title:      PLAN_LABELS[period] || 'SenseMate Premium',
                quantity:   1,
                unit_price: price,
                currency_id: 'ARS',
            }],
            payer: { email: userEmail || 'guest@sensemate.app' },
            external_reference: JSON.stringify({ userId: req.jwtUser.id, period }),
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
            const ref   = JSON.parse(external_reference);
            const plan  = ref.period?.includes('anual') ? 'premium_annual' : 'premium_monthly';
            authDb.setUserPlan(ref.userId, plan);

            // Registrar en subscriptions.json
            const subs = loadSubscriptions();
            const existing = subs.find(s => s.userId === ref.userId);
            if (existing) {
                existing.status    = 'active';
                existing.plan      = plan;
                existing.paymentId = payment_id;
                existing.updatedAt = new Date().toISOString();
            } else {
                subs.push({ id: Date.now().toString(), userId: ref.userId, plan, period: ref.period, paymentId: payment_id, status: 'active', subscribedAt: new Date().toISOString() });
            }
            saveSubscriptions(subs);
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
    const { type, data } = req.body;
    res.status(200).send('OK'); // Responder 200 rápido para que MP no reintente

    if (type !== 'payment') return;
    try {
        const payment   = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });
        if (paymentData.status !== 'approved') return;

        const ref  = JSON.parse(paymentData.external_reference || '{}');
        if (!ref.userId) return;

        const plan = ref.period?.includes('anual') ? 'premium_annual' : 'premium_monthly';
        authDb.setUserPlan(ref.userId, plan);
        console.log(`✅ MP webhook: usuario ${ref.userId} activado como ${plan}`);

        const subs = loadSubscriptions();
        const existing = subs.find(s => s.userId === ref.userId);
        if (existing) {
            existing.status    = 'active';
            existing.plan      = plan;
            existing.paymentId = data.id;
            existing.updatedAt = new Date().toISOString();
        } else {
            subs.push({ id: Date.now().toString(), userId: ref.userId, plan, period: ref.period, paymentId: data.id, status: 'active', subscribedAt: new Date().toISOString() });
        }
        saveSubscriptions(subs);
    } catch (e) {
        console.error('❌ MP webhook error:', e.message);
    }
});

// GET /mp/public-key — devuelve la public key al frontend de forma segura
app.get('/mp/public-key', (req, res) => {
    res.json({ publicKey: process.env.MP_PUBLIC_KEY });
});

// ─────────────────────────────────────────────────────────────

const PORT = 3000;
// const httpsOptions = {
//    key: fs.readFileSync('./localhost+2-key.pem'),
//    cert: fs.readFileSync('./localhost+2.pem')
//};

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