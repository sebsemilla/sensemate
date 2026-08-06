// server.cjs — entry point
'use strict';
const express = require('express');
const cors    = require('cors');
require('dotenv').config();
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

app.get('/lite', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-lite.html'));
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

app.use(express.static(path.join(__dirname, '.')));

// ─── Register routes ──────────────────────────────────────────

// Limiter global para todos los endpoints /admin
app.use('/admin', adminLimiter);

registerAiRoutes(app, { translateLimiter, chatLimiter, ttsLimiter });

registerAuthRoutes(app, { authDb, authLimiter, _detectCountryFromReq, _countryToRegion });

registerContentRoutes(app, { authDb });

registerMembershipRoutes(app, { authDb });

registerClassroomRoutes(app, { authDb });

registerBotRoutes(app);

registerMcpRoutes(app);

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
