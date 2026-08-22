// server.cjs — entry point
'use strict';
const express = require('express');
const cors    = require('cors');
require('dotenv').config({ quiet: true });
const fs   = require('fs');
const path = require('path');
const axios = require('axios');

const authDb = require('./auth_db.cjs');

const { translateLimiter, chatLimiter, ttsLimiter, authLimiter, adminLimiter } = require('./lib/limiters.cjs');

const registerAiRoutes        = require('./routes/ai.cjs');
const registerAuthRoutes      = require('./routes/auth.cjs');
const registerContentRoutes   = require('./routes/content.cjs');
const registerMembershipRoutes = require('./routes/membership.cjs');
const registerClassroomRoutes = require('./routes/classroom.cjs');
const registerBotRoutes       = require('./routes/bots.cjs');
const registerCameraRoutes    = require('./routes/camera.cjs');
const registerExamplesRoutes  = require('./routes/examples.cjs');
const { registerMcpRoutes }   = require('./mcp_server.cjs');
const { loadContributors }    = require('./routes/content.cjs');
const { loadBots, runBot }    = require('./bot_runner.cjs');

// ─── Detección de región por IP ────────────────────────────────

const _REGION_MAP = {
    america_latina: ['AR','BO','CL','CO','CR','CU','DO','EC','GT','HN','MX','NI','PA','PE','PY','SV','UY','VE',
                     'BB','BZ','DM','GD','GY','HT','JM','KN','LC','SR','TT','VC','AG','AW','GP','MQ','MF','PR','VI','BQ','CW','SX','TC'],
    brasil:         ['BR'],
    america_norte:  ['US','CA','GL'],
    europa:         ['DE','FR','IT','ES','PT','NL','BE','AT','CH','SE','NO','DK','FI','IE','PL','CZ','SK',
                     'HU','RO','BG','HR','SI','EE','LV','LT','GR','CY','MT','LU','IS','AL','BA','ME','MK','RS','XK','LI','MC','SM','AD','VA'],
    europa_oriental:['RU','UA','BY','MD','GE','AM','AZ','KZ','UZ','TM','KG','TJ'],
    medio_oriente:  ['SA','AE','IL','TR','IR','IQ','SY','LB','JO','KW','QA','BH','OM','YE','PS','EG'],
    africa:         ['DZ','AO','BJ','BW','BF','BI','CM','CV','CF','TD','KM','CG','CD','DJ','GQ','ER','SZ','ET',
                     'GA','GM','GH','GN','GW','CI','KE','LS','LR','LY','MG','MW','ML','MR','MU','YT','MA','MZ',
                     'NA','NE','NG','RE','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','EH','ZM','ZW'],
    asia:           ['JP','KR','TH','VN','PH','ID','MY','SG','TW','HK','MO','MN','KP','MM','KH','LA','BN',
                     'TL','MV','BT','NP','LK','BD','PK','AF'],
    india:          ['IN'],
    china:          ['CN'],
    oceania:        ['AU','NZ','FJ','PG','SB','VU','WS','TO','KI','TV','NR','PW','FM','MH','CK','NU','TK','AS','GU','MP','NC','PF','WF'],
};

const _COUNTRY_TO_REGION = {};
for (const [region, codes] of Object.entries(_REGION_MAP)) {
    for (const code of codes) _COUNTRY_TO_REGION[code] = region;
}

function _countryToRegion(countryCode) {
    return _COUNTRY_TO_REGION[countryCode] || 'otros';
}

async function _detectCountryFromReq(req) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.')) return null;
        const r = await axios.get(`https://ipapi.co/${ip}/country/`, { timeout: 3000 });
        const code = (r.data || '').toString().trim().toUpperCase();
        return code.length === 2 ? code : null;
    } catch {
        return null;
    }
}

// ─── App setup ────────────────────────────────────────────────

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
        : true,
    credentials: true
}));
app.use('/audio', express.static(path.join(__dirname, 'audio')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Bot detector: si es un crawler social, servir HTML con meta tags correctos ──
const BOT_UA = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slack|discord|googlebot|bingbot|applebot/i;

// ── Contenido curado (fuente única: content_library.js) ───────
const CURATED = require('./content_library.js');

function _esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _ssrContentPage(item) {
    const desc = `Aprende ${_esc(item.languageName)} con ${_esc(item.title)} — ${_esc(item.subtitle)}. Subtítulos sincronizados y traducción al español.`;
    const url  = `https://sensemate.app/aprende/${item.id}`;
    const lines = (item.dialogue || []).map(d =>
        `<p lang="${_esc(item.language)}">${_esc(d.original)}${d.translation ? ` — <span lang="es">${_esc(d.translation)}</span>` : ''}</p>`
    ).join('\n');
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${_esc(item.title)} — ${_esc(item.subtitle)} | Aprende ${_esc(item.languageName)} | SenseMate</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${_esc(item.title)} — ${_esc(item.subtitle)} | SenseMate">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://sensemate.app/images/og-preview.jpg">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://sensemate.app/images/og-preview.jpg">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"LearningResource","name":"${_esc(item.title)} — ${_esc(item.subtitle)}","description":"${desc}","url":"${url}","inLanguage":"${_esc(item.language)}","learningResourceType":"Immersive content","educationalLevel":"Beginner","provider":{"@type":"Organization","name":"SenseMate","url":"https://sensemate.app"}}
</script>
</head>
<body style="font-family:sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem">
<p><a href="/aprende">← Multimedia</a></p>
<h1>${_esc(item.title)}</h1>
<h2>${_esc(item.subtitle)}</h2>
<p><strong>Idioma:</strong> ${_esc(item.languageName)} · <strong>Categoría:</strong> ${_esc(item.category)}</p>
<div>${lines}</div>
<p><a href="/">Abrir en SenseMate →</a></p>
</body></html>`;
}

function _ssrBrowsePage() {
    const items = CURATED.map(c =>
        `<li><a href="/aprende/${c.id}">${_esc(c.title)} — ${_esc(c.subtitle)}</a> (${_esc(c.languageName)})</li>`
    ).join('\n');
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Aprende idiomas con series y anime | SenseMate Multimedia</title>
<meta name="description" content="Practica inglés, japonés y más idiomas con subtítulos sincronizados de series, anime y películas auténticas.">
<link rel="canonical" href="https://sensemate.app/aprende">
<meta property="og:type" content="website">
<meta property="og:url" content="https://sensemate.app/aprende">
<meta property="og:title" content="Aprende idiomas con series y anime | SenseMate">
<meta property="og:description" content="Practica con subtítulos sincronizados de contenido auténtico.">
<meta property="og:image" content="https://sensemate.app/images/og-preview.jpg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CollectionPage","name":"Multimedia — SenseMate","description":"Contenido para aprender idiomas con subtítulos sincronizados","url":"https://sensemate.app/aprende","provider":{"@type":"Organization","name":"SenseMate","url":"https://sensemate.app"}}
</script>
</head>
<body style="font-family:sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem">
<h1>Multimedia — Aprende idiomas</h1>
<p>Practicá inglés, japonés y más con subtítulos sincronizados de contenido auténtico.</p>
<ul>${items}</ul>
<p><a href="/">Abrir en SenseMate →</a></p>
</body></html>`;
}

app.get('/lite', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-lite.html'));
});

// MCP Server Card — ruta explícita como backup al express.static (dotfiles: 'allow')
app.get('/.well-known/mcp/server-card.json', (req, res) => {
    res.sendFile(path.join(__dirname, '.well-known', 'mcp', 'server-card.json'));
});

// Patch Accept header para SmitheryBot y otros clientes MCP que no envían text/event-stream.
// El SDK de MCP usa @hono/node-server que lee req.rawHeaders (no req.headers), por eso
// hay que parchear ambos para que el check del SDK no devuelva 406.
app.use('/mcp', (req, res, next) => {
    if (req.method === 'POST' && !req.headers['accept']?.includes('text/event-stream')) {
        const ACCEPT_VAL = 'application/json, text/event-stream';
        // Patch parsed headers (Express)
        req.headers['accept'] = ACCEPT_VAL;
        // Patch rawHeaders (leídos por @hono/node-server al convertir a Web Fetch Request)
        const idx = req.rawHeaders.findIndex((h, i) => i % 2 === 0 && h.toLowerCase() === 'accept');
        if (idx === -1) {
            req.rawHeaders.push('Accept', ACCEPT_VAL);
        } else {
            req.rawHeaders[idx + 1] = ACCEPT_VAL;
        }
    }
    next();
});

// Página pública de discovery del servidor MCP
app.get('/mcp', (req, res, next) => {
    // Si es una solicitud MCP (JSON), dejar que la maneje registerMcpRoutes
    if (req.headers['content-type']?.includes('application/json') ||
        req.headers['accept']?.includes('text/event-stream')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'mcp.html'));
});

app.get('/', (req, res, next) => {
    if (!BOT_UA.test(req.headers['user-agent'] || '')) return next();
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

// ── Sitemap dinámico ──────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
    const BASE = 'https://sensemate.app';
    const fixed = [
        { url: `${BASE}/`,       priority: '1.0', changefreq: 'weekly' },
        { url: `${BASE}/aprende`, priority: '0.9', changefreq: 'weekly' },
        { url: `${BASE}/mcp`,    priority: '0.6', changefreq: 'monthly' },
        { url: `${BASE}/privacy.html`, priority: '0.3', changefreq: 'yearly' },
        { url: `${BASE}/terms.html`,   priority: '0.3', changefreq: 'yearly' },
    ];
    const content = CURATED.map(c => ({ url: `${BASE}/aprende/${c.id}`, priority: '0.8', changefreq: 'monthly' }));
    const all = [...fixed, ...content];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
        all.map(u => `  <url><loc>${u.url}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')
    }\n</urlset>`;
    res.set('Content-Type', 'application/xml').send(xml);
});

// ── SSR para bots / deep links de Multimedia ─────────────────
app.get('/aprende', (req, res) => {
    if (!BOT_UA.test(req.headers['user-agent'] || '')) return res.sendFile(path.join(__dirname, 'index.html'));
    res.send(_ssrBrowsePage());
});

app.get('/aprende/:id', (req, res) => {
    const item = CURATED.find(c => c.id === req.params.id);
    if (!item) return res.sendFile(path.join(__dirname, 'index.html'));
    if (!BOT_UA.test(req.headers['user-agent'] || '')) return res.sendFile(path.join(__dirname, 'index.html'));
    res.send(_ssrContentPage(item));
});

app.use(express.static(path.join(__dirname, '.'), {
    dotfiles: 'allow',   // necesario para servir /.well-known/mcp/server-card.json
}));

// ─── Dynamic Pricing ──────────────────────────────────────────

const COUNTRY_CURRENCY = {
    AR: { currency: 'ARS', symbol: '$',    name: 'Argentina' },
    US: { currency: 'USD', symbol: 'u$s',  name: 'Estados Unidos' },
    BR: { currency: 'BRL', symbol: 'R$',   name: 'Brasil' },
    MX: { currency: 'MXN', symbol: '$',    name: 'México' },
    CL: { currency: 'CLP', symbol: '$',    name: 'Chile' },
    CO: { currency: 'COP', symbol: '$',    name: 'Colombia' },
    PE: { currency: 'PEN', symbol: 'S/',   name: 'Perú' },
    UY: { currency: 'UYU', symbol: '$U',   name: 'Uruguay' },
    PY: { currency: 'PYG', symbol: '₲',    name: 'Paraguay' },
    BO: { currency: 'BOB', symbol: 'Bs.',  name: 'Bolivia' },
    VE: { currency: 'USD', symbol: 'u$s',  name: 'Venezuela' },
    EC: { currency: 'USD', symbol: 'u$s',  name: 'Ecuador' },
    ES: { currency: 'EUR', symbol: '€',    name: 'España' },
    DE: { currency: 'EUR', symbol: '€',    name: 'Alemania' },
    FR: { currency: 'EUR', symbol: '€',    name: 'Francia' },
    IT: { currency: 'EUR', symbol: '€',    name: 'Italia' },
    PT: { currency: 'EUR', symbol: '€',    name: 'Portugal' },
    GB: { currency: 'GBP', symbol: '£',    name: 'Reino Unido' },
    CA: { currency: 'CAD', symbol: 'CA$',  name: 'Canadá' },
    AU: { currency: 'AUD', symbol: 'A$',   name: 'Australia' },
    NZ: { currency: 'NZD', symbol: 'NZ$',  name: 'Nueva Zelanda' },
    JP: { currency: 'JPY', symbol: '¥',    name: 'Japón' },
    CN: { currency: 'CNY', symbol: '¥',    name: 'China' },
    IN: { currency: 'INR', symbol: '₹',    name: 'India' },
};

const _NO_DECIMALS_CURRENCIES = new Set(['ARS','CLP','COP','PYG','JPY','IDR','KRW']);

let _pricingCache = null; // { rates, fetchedAt }

function _roundPrice(amount, currency) {
    if (currency === 'ARS') return Math.round(amount / 100) * 100;
    if (_NO_DECIMALS_CURRENCIES.has(currency)) return Math.round(amount);
    return Math.round(amount * 100) / 100;
}

app.get('/api/pricing', async (req, res) => {
    const FALLBACK = { currency: 'ARS', symbol: '$', monthly: 2500, annual: 20000, countryCode: 'AR', countryName: 'Argentina' };
    const monthlyARS = 2500;
    const annualARS  = 20000;

    try {
        // 1. Detect country
        const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip;
        let countryCode = 'AR';
        const isLocal = !ip || ip === '127.0.0.1' || ip === '::1' || /^::ffff:127\./.test(ip);
        if (!isLocal) {
            try {
                const geoRes = await axios.get(`https://api.country.is/${ip}`, { timeout: 3000 });
                const code = (geoRes.data?.country || '').toString().trim().toUpperCase();
                if (code.length === 2) countryCode = code;
            } catch { /* default AR */ }
        }

        // 2. Map to currency
        const entry = COUNTRY_CURRENCY[countryCode] || { currency: 'USD', symbol: 'u$s', name: countryCode };
        const { currency, symbol, name: countryName } = entry;

        // 3. Fetch exchange rates (cached 6h)
        const now = Date.now();
        if (!_pricingCache || (now - _pricingCache.fetchedAt) > 6 * 60 * 60 * 1000) {
            const ratesRes = await axios.get('https://open.er-api.com/v6/latest/ARS', { timeout: 5000 });
            _pricingCache = { rates: ratesRes.data.rates, fetchedAt: now };
        }
        const rates = _pricingCache.rates;
        const rate  = rates[currency];
        if (!rate) return res.json(FALLBACK);

        // 4. Convert
        const monthly = _roundPrice(monthlyARS / rate, currency);
        const annual  = _roundPrice(annualARS  / rate, currency);

        return res.json({ currency, symbol, monthly, annual, countryCode, countryName });
    } catch (e) {
        console.error('[/api/pricing]', e?.message);
        return res.json(FALLBACK);
    }
});

// ─── Register routes ──────────────────────────────────────────

// Limiter global para todos los endpoints /admin
app.use('/admin', adminLimiter);

registerAiRoutes(app, { translateLimiter, chatLimiter, ttsLimiter, authDb });

registerAuthRoutes(app, { authDb, authLimiter, _detectCountryFromReq, _countryToRegion });

registerContentRoutes(app, { authDb });

registerMembershipRoutes(app, { authDb });

registerClassroomRoutes(app, { authDb });

registerBotRoutes(app);

registerCameraRoutes(app);
registerExamplesRoutes(app, { authDb, ttsLimiter });

// ── Pricing por geo-IP ─────────────────────────────────────────
{
    const COUNTRY_CURRENCY = {
        AR: { currency: 'ARS', symbol: '$',    name: 'Argentina' },
        US: { currency: 'USD', symbol: 'u$s',  name: 'Estados Unidos' },
        BR: { currency: 'BRL', symbol: 'R$',   name: 'Brasil' },
        MX: { currency: 'MXN', symbol: '$',    name: 'México' },
        CL: { currency: 'CLP', symbol: '$',    name: 'Chile' },
        CO: { currency: 'COP', symbol: '$',    name: 'Colombia' },
        PE: { currency: 'PEN', symbol: 'S/',   name: 'Perú' },
        UY: { currency: 'UYU', symbol: '$U',   name: 'Uruguay' },
        PY: { currency: 'PYG', symbol: '₲',    name: 'Paraguay' },
        BO: { currency: 'BOB', symbol: 'Bs.',  name: 'Bolivia' },
        VE: { currency: 'USD', symbol: 'u$s',  name: 'Venezuela' },
        EC: { currency: 'USD', symbol: 'u$s',  name: 'Ecuador' },
        ES: { currency: 'EUR', symbol: '€',    name: 'España' },
        DE: { currency: 'EUR', symbol: '€',    name: 'Alemania' },
        FR: { currency: 'EUR', symbol: '€',    name: 'Francia' },
        IT: { currency: 'EUR', symbol: '€',    name: 'Italia' },
        PT: { currency: 'EUR', symbol: '€',    name: 'Portugal' },
        GB: { currency: 'GBP', symbol: '£',    name: 'Reino Unido' },
        CA: { currency: 'CAD', symbol: 'CA$',  name: 'Canadá' },
        AU: { currency: 'AUD', symbol: 'A$',   name: 'Australia' },
        NZ: { currency: 'NZD', symbol: 'NZ$',  name: 'Nueva Zelanda' },
        JP: { currency: 'JPY', symbol: '¥',    name: 'Japón' },
        CN: { currency: 'CNY', symbol: '¥',    name: 'China' },
        IN: { currency: 'INR', symbol: '₹',    name: 'India' },
    };
    const NO_DECIMALS = new Set(['ARS','CLP','COP','PYG','JPY','IDR','KRW']);

    // Precios fijos por moneda (anuales)
    const FIXED_PRICES = {
        ARS: 20000,
        USD: 19.99,
        BRL: 100,
    };
    const FIXED_MONTHLY = {
        ARS: Math.round(19990 / 12),
        USD: +(19.99 / 12).toFixed(2),
        BRL: +(100  / 12).toFixed(2),
    };

    let _rateCache = null; // { rates, fetchedAt }

    function _roundPrice(amount, currency) {
        if (NO_DECIMALS.has(currency)) return Math.round(amount);
        return Math.round(amount * 100) / 100;
    }

    app.get('/api/pricing', async (req, res) => {
        const fallback = { currency: 'ARS', symbol: '$', annual: FIXED_PRICES.ARS, monthly: FIXED_MONTHLY.ARS, countryCode: 'AR', countryName: 'Argentina' };
        try {
            const rawIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || '';
            const ip    = rawIp.replace('::ffff:', '');
            const isLocal = !ip || ip === '::1' || ip.startsWith('127.') || ip === 'localhost';

            let countryCode = 'AR';
            if (!isLocal) {
                try {
                    const geoRes = await axios.get(`https://api.country.is/${ip}`, { timeout: 3000 });
                    countryCode = geoRes.data?.country || 'AR';
                } catch {}
            }

            const info = COUNTRY_CURRENCY[countryCode] || { currency: 'USD', symbol: 'u$s', name: countryCode };

            // Devolver precio fijo si existe para esa moneda
            if (FIXED_PRICES[info.currency] !== undefined) {
                return res.json({
                    currency: info.currency, symbol: info.symbol,
                    annual: FIXED_PRICES[info.currency], monthly: FIXED_MONTHLY[info.currency],
                    countryCode, countryName: info.name,
                });
            }

            // Para el resto: convertir desde USD $19.99 usando tipo de cambio
            const now = Date.now();
            if (!_rateCache || (now - _rateCache.fetchedAt) > 6 * 3600 * 1000) {
                const rateRes = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 5000 });
                _rateCache = { rates: rateRes.data.rates, fetchedAt: now };
            }

            const rate = _rateCache.rates[info.currency];
            if (!rate) return res.json({ ...fallback, countryCode, countryName: info.name });

            res.json({
                currency:    info.currency,
                symbol:      info.symbol,
                annual:      _roundPrice(FIXED_PRICES.USD * rate, info.currency),
                monthly:     _roundPrice(FIXED_MONTHLY.USD * rate, info.currency),
                countryCode,
                countryName: info.name,
            });
        } catch (err) {
            console.error('[pricing]', err.message);
            res.json(fallback);
        }
    });
}

registerMcpRoutes(app);

// ── Catch-all para rutas del SPA (deep links) ─────────────────
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) return next();
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Error handler global (captura errores no manejados en routes) ────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('[Express Error]', req.method, req.path, err?.message, err?.stack?.split('\n')[1]);
    if (!res.headersSent) {
        res.status(500).json({ error: err?.message || 'Internal Server Error', path: req.path });
    }
});

// ─── Start server ─────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});

// ─── Bot Scheduler dinámico ────────────────────────────────────

try {
    const cron = require('node-cron');

    // Map de tasks activos: botId → task
    const _activeTasks = new Map();

    function _scheduleBot(bot) {
        if (bot.scheduleMode === 'human-random') return; // handled by dispatcher
        if (!bot.enabled || !cron.validate(bot.schedule)) return;
        if (_activeTasks.has(bot.id)) _activeTasks.get(bot.id).destroy();

        const task = cron.schedule(bot.schedule, async () => {
            console.log(`[Bot] "${bot.name}" ejecutando (${bot.schedule})...`);
            try {
                const items = await runBot(bot.id);
                console.log(`[Bot] "${bot.name}" generó ${items.length} item(s).`);
                // Recargar el bot actualizado para la próxima ejecución
                const updated = loadBots().find(b => b.id === bot.id);
                if (updated) Object.assign(bot, updated);
            } catch (err) {
                console.error(`[Bot] "${bot.name}" error: ${err.message}`);
            }
        }, { timezone: 'America/Argentina/Buenos_Aires' });

        _activeTasks.set(bot.id, task);
    }

    // Registrar todos los bots activos al arrancar
    const initialBots = loadBots();
    initialBots.filter(b => b.enabled).forEach(_scheduleBot);
    console.log(`[Bots] ${initialBots.filter(b => b.enabled).length} bot(s) activo(s) registrados.`);

    // Auto-regenerar schedule human-random si el archivo no existe o está vacío (ej: redeploy)
    try {
        const { loadSchedule, regenerateBotSchedule } = require('./bot_schedule.cjs');
        const humanBots = initialBots.filter(b => b.enabled && b.scheduleMode === 'human-random');
        if (humanBots.length > 0 && loadSchedule().filter(e => !e.fired).length === 0) {
            const now = new Date();
            const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
            humanBots.forEach((bot, idx) => {
                regenerateBotSchedule(bot.id, bot.postsPerDayWeekday || 2, bot.postsPerDayWeekend || 3, idx, endDate);
            });
            console.log(`[Bots] Schedule auto-regenerado para ${humanBots.length} bot(s) human-random.`);
        }
    } catch (e) {
        console.warn('[Bots] No se pudo auto-regenerar schedule:', e.message);
    }

    // Exponer el scheduler en app para que routes/bots.cjs pueda crear/actualizar/borrar crons
    app._botScheduler = {
        register: (bot) => _scheduleBot(bot),
        update:   (bot) => {
            if (_activeTasks.has(bot.id)) { _activeTasks.get(bot.id).destroy(); _activeTasks.delete(bot.id); }
            if (bot.enabled) _scheduleBot(bot);
        },
        unregister: (botId) => {
            if (_activeTasks.has(botId)) { _activeTasks.get(botId).destroy(); _activeTasks.delete(botId); }
        }
    };
} catch (err) {
    console.warn('[Bots] node-cron no disponible — bots solo ejecutables manualmente:', err.message);
    app._botScheduler = { register: () => {}, update: () => {}, unregister: () => {} };
}

// ─── Human-random bot dispatcher ──────────────────────────────
try {
    const cronDisp = require('node-cron');
    const { getDueEntries, markFired } = require('./bot_schedule.cjs');

    cronDisp.schedule('* * * * *', async () => {
        const due = getDueEntries();
        if (!due.length) return;
        const bots = loadBots();
        for (const entry of due) {
            const bot = bots.find(b => b.id === entry.botId && b.enabled && b.scheduleMode === 'human-random');
            if (!bot) { markFired(entry.botId, entry.ts); continue; }
            console.log(`[Dispatcher] "${bot.displayName || bot.name}" (${new Date(entry.ts).toLocaleString('es-AR')})`);
            try {
                await runBot(bot.id);
            } catch (err) {
                console.error(`[Dispatcher] Error en "${bot.displayName || bot.name}": ${err.message}`);
            }
            markFired(entry.botId, entry.ts);
        }
    }, { timezone: 'America/Argentina/Buenos_Aires' });

    console.log('[Dispatcher] Bot dispatcher human-random activo (cada minuto).');
} catch (err) {
    console.warn('[Dispatcher] No disponible:', err.message);
}

// ─── Discord Bot ──────────────────────────────────────────────
try {
    const { startDiscordBot } = require('./discord_bot.cjs');
    startDiscordBot();
} catch (err) {
    console.warn('[Discord] No disponible:', err.message);
}

// ─── LinkedIn Bot — publicación automática cada 4 días ────────

try {
    const cron        = require('node-cron');
    const linkedinBot = require('./linkedin_bot.cjs');

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

// ─── ClassRooms — invitación semanal a contribuidores sin inscribir ────

function _sendClassroomInviteReminders() {
    const contributors = loadContributors();
    let sent = 0;
    contributors.forEach(c => {
        if (!c.userId) return;
        const user = authDb.getUserById(c.userId);
        if (!user || user.classroomAddon || user.plan === 'gold') return;
        authDb.createNotification(c.userId, 'classroom_invite', {});
        sent++;
    });
    return sent;
}

try {
    const cron = require('node-cron');
    // Todos los lunes 11:00 AM (ART)
    cron.schedule('0 11 * * 1', () => {
        const sent = _sendClassroomInviteReminders();
        console.log(`[ClassRooms] Recordatorio semanal enviado a ${sent} contribuidor(es) sin inscribir.`);
    }, { timezone: 'America/Argentina/Buenos_Aires' });
    console.log('[ClassRooms] Cron activo — invitación semanal los lunes 11:00 AM (ART)');
} catch (err) {
    console.warn('[ClassRooms] node-cron no disponible:', err.message);
}
