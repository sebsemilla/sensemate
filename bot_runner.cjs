// bot_runner.cjs — DeepSeek content generator + schema.org builder
'use strict';
const fs   = require('fs');
const path = require('path');
const axios = require('axios');
const { dbLoadBots, dbSaveBots, dbSavePosts, dbLoadFeed } = require('./auth_db.cjs');

const CLASSES_FILE = path.join(__dirname, 'classroom_classes.json');
const MAX_CLASSES  = 200;

// ─── Persistencia ─────────────────────────────────────────────────────────────

function loadBots()       { return dbLoadBots(); }
function saveBots(bots)   { dbSaveBots(bots); }
function loadFeed(n = 50) { return dbLoadFeed(n); }
function saveFeed()       { /* posts saved individually via dbSavePosts */ }

function loadClasses() {
    try { return JSON.parse(fs.readFileSync(CLASSES_FILE, 'utf8')); } catch { return []; }
}
function saveClasses(classes) {
    const sorted = classes.sort((a, b) => b.ts - a.ts).slice(0, MAX_CLASSES);
    fs.writeFileSync(CLASSES_FILE, JSON.stringify(sorted, null, 2));
}

// ─── Schema.org builder ───────────────────────────────────────────────────────

const SCHEMA_TEMPLATES = {
    Article: (d) => ({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: d.title,
        description: d.body?.slice(0, 200),
        datePublished: new Date(d.ts).toISOString(),
        author: { '@type': 'Organization', name: 'SenseMate' },
        keywords: (d.tags || []).join(', '),
        inLanguage: d.lang || 'es',
        publisher: {
            '@type': 'Organization',
            name: 'SenseMate',
            url: 'https://sensemate.app'
        }
    }),
    LearningResource: (d) => ({
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: d.title,
        description: d.body?.slice(0, 300),
        dateCreated: new Date(d.ts).toISOString(),
        educationalLevel: d.level || 'beginner',
        keywords: (d.tags || []).join(', '),
        inLanguage: d.lang || 'es',
        provider: { '@type': 'Organization', name: 'SenseMate', url: 'https://sensemate.app' }
    }),
    Course: (d) => ({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: d.title,
        description: d.body?.slice(0, 400),
        provider: { '@type': 'Organization', name: 'SenseMate', url: 'https://sensemate.app' },
        courseCode: d.id,
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: d.live ? 'online' : 'onDemand',
            startDate: new Date(d.ts).toISOString(),
        },
        inLanguage: d.lang || 'es',
        keywords: (d.tags || []).join(', ')
    }),
    EducationEvent: (d) => ({
        '@context': 'https://schema.org',
        '@type': 'EducationEvent',
        name: d.title,
        description: d.body?.slice(0, 300),
        startDate: new Date(d.ts).toISOString(),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        organizer: { '@type': 'Organization', name: 'SenseMate', url: 'https://sensemate.app' },
        inLanguage: d.lang || 'es'
    }),
    FAQPage: (d) => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (d.faqs || []).map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a }
        }))
    })
};

function buildSchemaOrg(type, data) {
    const builder = SCHEMA_TEMPLATES[type] || SCHEMA_TEMPLATES.Article;
    return builder(data);
}

// ─── DeepSeek API ─────────────────────────────────────────────────────────────

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

function _systemPrompt(bot) {
    return `Eres un generador de contenido educativo para SenseMate, una app de aprendizaje de idiomas.
Genera EXACTAMENTE ${bot.quantity} publicación(es) distintas en formato JSON array. Este número es obligatorio — si el prompt del usuario menciona otra cantidad, ignórala y genera ${bot.quantity}.

Cada elemento DEBE tener estos campos:
- "title": string (max 80 chars) — título directo y concreto
- "intro": string (max 70 chars) — gancho de apertura, curioso o sorprendente
- "body": string (120-200 chars) — explicación clara y educativa del concepto
- "highlight": string (max 90 chars) — el concepto clave resumido en una frase memorable
- "example": string (max 130 chars) — ejemplo natural en contexto (puede incluir la traducción)
- "tip": string (max 90 chars) — truco, regla mnemotécnica o consejo práctico (o null si no aplica)
- "tags": array de 2-4 strings (ej: ["vocabulario", "inglés", "B1"])
- "avatar": un solo emoji representativo del autor
- "emoji": emoji representativo del contenido
- "level": nivel MCER ("A1","A2","B1","B2","C1","C2") o null
- "lang": código de idioma principal ("es","en","fr","pt","it","de")
${bot.target === 'classroom' ? `- "teacher": nombre del profesor (ficticio pero realista)\n- "live": false` : ''}
${bot.schemaType === 'FAQPage' ? `- "faqs": array de {q,a} con 3-5 preguntas y respuestas` : ''}

Responde SOLO con el JSON array, sin markdown, sin explicaciones adicionales.`;
}

async function _callDeepSeek(bot, apiKey) {
    const response = await axios.post(
        DEEPSEEK_URL,
        {
            model: bot.model || 'deepseek-chat',
            messages: [
                { role: 'system', content: _systemPrompt(bot) },
                { role: 'user',   content: bot.prompt }
            ],
            temperature: 0.85,
            max_tokens: 2000,
            response_format: { type: 'json_object' }
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        }
    );

    const raw = response.data.choices?.[0]?.message?.content || '[]';
    // DeepSeek puede devolver el array envuelto en un objeto
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
        // Intentar extraer el array de la primera key
        const firstKey = Object.keys(parsed)[0];
        parsed = Array.isArray(parsed[firstKey]) ? parsed[firstKey] : [parsed];
    }
    return parsed;
}

// ─── Ejecutar bot ─────────────────────────────────────────────────────────────

async function runBot(botId) {
    const bots = loadBots();
    const bot  = bots.find(b => b.id === botId);
    if (!bot) throw new Error(`Bot ${botId} no encontrado`);
    if (!bot.enabled) throw new Error(`Bot ${botId} está desactivado`);

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('DEEPSEEK_API_KEY no configurada en .env');

    const startedAt = Date.now();
    let generated = [];

    try {
        generated = await _callDeepSeek(bot, apiKey);
    } catch (err) {
        const logEntry = { ts: startedAt, ok: false, error: err.message, count: 0 };
        _appendLog(bots, botId, logEntry);
        saveBots(bots);
        throw err;
    }

    const ts   = Date.now();
    const newItems = generated.map((item, i) => ({
        id:        `${botId}_${ts}_${i}`,
        botId,
        author:    bot.displayName || bot.name,
        avatar:    item.avatar    || '🤖',
        emoji:     item.emoji     || '📝',
        title:     item.title     || '',
        intro:     item.intro     || null,
        body:      item.body      || '',
        highlight: item.highlight || null,
        example:   item.example   || null,
        tip:       item.tip       || null,
        tags:      item.tags      || [],
        level:     item.level     || null,
        lang:      item.lang      || 'es',
        teacher:   item.teacher   || null,
        live:      item.live      || false,
        faqs:      item.faqs      || null,
        ts,
        likes:     0,
        comments:  0,
        schema:    buildSchemaOrg(bot.schemaType || 'Article', { ...item, ts, id: `${botId}_${ts}_${i}` })
    }));

    if (bot.target === 'classroom') {
        const classes = loadClasses();
        saveClasses([...newItems, ...classes]);
    } else {
        dbSavePosts(newItems);
        // Postear en Discord si hay webhook configurado
        if (process.env.DISCORD_WEBHOOK_URL) {
            try {
                const { postToDiscord } = require('./discord_bot.cjs');
                for (const item of newItems) await postToDiscord(item);
            } catch (err) {
                console.error('[Discord Webhook] Error:', err.message);
            }
        }
    }

    // Actualizar estado del bot
    const logEntry = { ts: startedAt, ok: true, count: newItems.length, ms: Date.now() - startedAt };
    const botRef   = bots.find(b => b.id === botId);
    botRef.lastRun = ts;
    botRef.runCount = (botRef.runCount || 0) + newItems.length;
    _appendLog(bots, botId, logEntry);
    saveBots(bots);

    return newItems;
}

function _appendLog(bots, botId, entry) {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;
    if (!bot.logs) bot.logs = [];
    bot.logs.unshift(entry);
    bot.logs = bot.logs.slice(0, 20); // Mantener últimos 20 logs
}

module.exports = { loadBots, saveBots, loadFeed, saveFeed, loadClasses, saveClasses, runBot, buildSchemaOrg };
