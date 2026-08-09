// routes/bots.cjs — Admin bot management + public feed/classroom API
'use strict';
const crypto    = require('crypto');
const { loadBots, saveBots, loadClasses, runBot } = require('../bot_runner.cjs');
const { dbLoadBots, dbSaveBots, dbPatchBot, dbDeleteBot, dbLoadFeed, dbSavePosts, dbPatchPost, dbDeletePost, dbLoadPost } = require('../auth_db.cjs');
const { regenerateBotSchedule, getUpcomingEntries, removeBotSchedule, getDueEntries } = require('../bot_schedule.cjs');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function checkAdmin(req, res) {
    if (!ADMIN_TOKEN) { res.status(503).json({ error: 'Admin no configurado.' }); return false; }
    if (req.headers['x-admin-token'] !== ADMIN_TOKEN) { res.status(403).json({ error: 'Acceso denegado' }); return false; }
    return true;
}

// Validación simple de expresión cron (5 o 6 campos)
function isValidCron(expr) {
    if (!expr || typeof expr !== 'string') return false;
    const parts = expr.trim().split(/\s+/);
    return parts.length >= 5 && parts.length <= 6;
}

// ─── Seed bots editoriales ────────────────────────────────────────────────────

const SEED_BOTS = [
  {
    displayName: 'El Corrector', direction: 'es-en',
    name: 'El Corrector',
    prompt: 'Crea publicaciones sobre errores comunes que cometen los hispanohablantes al aprender inglés. Puede ser un error gramatical, un "falso amigo" (como embarrassed/embarazada) o un uso incorrecto. Incluye: el error, la forma correcta y una explicación breve amigable. Nivel A2-B1.',
    schemaType: 'Article', postsPerDayWeekday: 2, postsPerDayWeekend: 3,
  },
  {
    displayName: 'El Idiomático', direction: 'es-en',
    name: 'El Idiomático',
    prompt: 'Crea publicaciones sobre expresiones idiomáticas del inglés que no tienen traducción literal al español. Incluye: la expresión, su significado real, y una frase natural de ejemplo. Nivel B1-B2.',
    schemaType: 'LearningResource', postsPerDayWeekday: 2, postsPerDayWeekend: 3,
  },
  {
    displayName: 'La Situación', direction: 'es-en',
    name: 'La Situación',
    prompt: 'Crea publicaciones con vocabulario esencial para una situación cotidiana real (restaurante, aeropuerto, trabajo remoto, médico, banco, tienda, hotel, etc.). Incluye 6-8 palabras o frases clave con traducción y un ejemplo en contexto. Nivel A2-B1.',
    schemaType: 'LearningResource', postsPerDayWeekday: 2, postsPerDayWeekend: 4,
  },
  {
    displayName: 'El Fonetista', direction: 'es-en',
    name: 'El Fonetista',
    prompt: 'Crea publicaciones sobre sonidos del inglés que no existen en español y cómo pronunciarlos correctamente. Incluye palabras conocidas como ejemplos y un truco mnemotécnico para recordarlo. Nivel A1-B1.',
    schemaType: 'LearningResource', postsPerDayWeekday: 2, postsPerDayWeekend: 3,
  },
  {
    displayName: 'Grammar Dispatch', direction: 'en-es',
    name: 'Grammar Dispatch',
    prompt: 'Create posts explaining specific Spanish grammar concepts to English speakers. No technical jargon — use plain English. Topics: ser vs estar, por vs para, preterite vs imperfect, subjunctive, gender agreement, etc. Use real natural examples. Keep it short and practical.',
    schemaType: 'LearningResource', postsPerDayWeekday: 2, postsPerDayWeekend: 3,
  },
  {
    displayName: 'Slang & Context', direction: 'en-es',
    name: 'Slang & Context',
    prompt: 'Create posts about colloquial Spanish or Argentine/Latin slang that English speakers would never learn in a classroom. Include: the expression, when to use it (and when NOT to), and a natural conversation example. Informal and engaging tone.',
    schemaType: 'Article', postsPerDayWeekday: 2, postsPerDayWeekend: 4,
  },
  {
    displayName: 'Word Builder', direction: 'en-es',
    name: 'Word Builder',
    prompt: 'Create posts about Spanish vocabulary for English speakers. Topics: word families that help memorize multiple words at once, false cognates, Spanish words that express concepts English lacks, or etymology connections between Spanish and English. Practical and memorable.',
    schemaType: 'LearningResource', postsPerDayWeekday: 2, postsPerDayWeekend: 3,
  },
  {
    displayName: 'The Culture Brief', direction: 'en-es',
    name: 'The Culture Brief',
    prompt: 'Create posts about cultural differences between English and Spanish-speaking worlds that directly affect how the language works: why "mañana" has multiple meanings, what "te quiero" vs "te amo" really signals, why "buenas" is a full greeting, how politeness registers differ. Curious, non-academic tone.',
    schemaType: 'Article', postsPerDayWeekday: 2, postsPerDayWeekend: 3,
  },
];

module.exports = function registerBotRoutes(app) {

    // ── Endpoints públicos (feed / classroom) ─────────────────────────────────

    // GET /api/feed?limit=30&offset=0
    app.get('/api/feed', (req, res) => {
        const limit  = Math.min(parseInt(req.query.limit  || 30), 100);
        const offset = parseInt(req.query.offset || 0);
        const posts  = dbLoadFeed(limit, offset).map(p => ({
            id: p.id, botId: p.botId, author: p.author,
            avatar: p.avatar, emoji: p.emoji,
            title: p.title, intro: p.intro,
            tags: p.tags, level: p.level, lang: p.lang,
            ts: p.ts, likes: p.likes, comments: p.comments
        }));
        res.json({ posts, total: posts.length });
    });

    // GET /api/posts/:id — full post
    app.get('/api/posts/:id', (req, res) => {
        const post = dbLoadPost(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });
        res.json(post);
    });

    // GET /api/classroom?tab=disponibles|live
    app.get('/api/classroom', (req, res) => {
        const tab     = req.query.tab || 'disponibles';
        const limit   = Math.min(parseInt(req.query.limit || 30), 100);
        const all     = loadClasses();
        const filtered = tab === 'live' ? all.filter(c => c.live) : all.filter(c => !c.live);
        res.json({ classes: filtered.slice(0, limit), total: filtered.length });
    });

    // ── CRUD de bots (admin) ──────────────────────────────────────────────────

    // GET /admin/bots
    app.get('/admin/bots', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const bots = dbLoadBots().map(b => ({ ...b, logs: (b.logs || []).slice(0, 5) }));
        res.json(bots);
    });

    // POST /admin/seed-bots — crear los 8 bots editoriales
    app.post('/admin/seed-bots', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const existing = dbLoadBots().filter(b => b.scheduleMode === 'human-random');
        if (existing.length >= 8) {
            return res.json({ ok: true, skipped: true });
        }

        const now = new Date();
        const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
        const created = [];

        SEED_BOTS.forEach((def, idx) => {
            const bot = {
                id:                 `bot_${crypto.randomBytes(5).toString('hex')}`,
                name:               def.name,
                displayName:        def.displayName,
                direction:          def.direction,
                avatarUrl:          null,
                prompt:             def.prompt,
                target:             'livefeed',
                schemaType:         def.schemaType,
                schedule:           'human-random',
                scheduleMode:       'human-random',
                postsPerDayWeekday: def.postsPerDayWeekday,
                postsPerDayWeekend: def.postsPerDayWeekend,
                quantity:           1,
                model:              'deepseek-chat',
                enabled:            true,
                lastRun:            null,
                runCount:           0,
                logs:               [],
                created_at:         new Date().toISOString()
            };
            created.push(bot);
            regenerateBotSchedule(bot.id, def.postsPerDayWeekday, def.postsPerDayWeekend, idx, endDate);
        });

        dbSaveBots(created);
        res.status(201).json({ ok: true, created: created.length });
    });

    // POST /admin/bots
    app.post('/admin/bots', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const {
            name, displayName, direction, avatarUrl,
            prompt, target, schemaType, schedule, scheduleMode,
            postsPerDayWeekday, postsPerDayWeekend,
            quantity, model, enabled
        } = req.body;

        if (!name || !prompt) return res.status(400).json({ error: 'Faltan campos: name, prompt' });

        const isHumanRandom = scheduleMode === 'human-random';

        if (!isHumanRandom) {
            if (!schedule) return res.status(400).json({ error: 'Falta campo: schedule' });
            if (!isValidCron(schedule)) return res.status(400).json({ error: 'Expresión cron inválida' });
        }

        const qty = Math.min(Math.max(parseInt(quantity) || 1, 1), 10);

        const bot = {
            id:                 `bot_${crypto.randomBytes(5).toString('hex')}`,
            name:               String(name).slice(0, 80),
            displayName:        displayName ? String(displayName).slice(0, 80) : null,
            direction:          ['es-en', 'en-es'].includes(direction) ? direction : null,
            avatarUrl:          avatarUrl ? String(avatarUrl).slice(0, 500) : null,
            prompt:             String(prompt).slice(0, 2000),
            target:             ['livefeed', 'classroom'].includes(target) ? target : 'livefeed',
            schemaType:         ['Article','LearningResource','Course','EducationEvent','FAQPage'].includes(schemaType)
                                    ? schemaType : 'Article',
            schedule:           isHumanRandom ? 'human-random' : schedule.trim(),
            scheduleMode:       isHumanRandom ? 'human-random' : null,
            postsPerDayWeekday: isHumanRandom ? (parseInt(postsPerDayWeekday) || 2) : null,
            postsPerDayWeekend: isHumanRandom ? (parseInt(postsPerDayWeekend) || 3) : null,
            quantity:           qty,
            model:              ['deepseek-chat','deepseek-reasoner'].includes(model) ? model : 'deepseek-chat',
            enabled:            enabled !== false,
            lastRun:            null,
            runCount:           0,
            logs:               [],
            createdAt:          Date.now()
        };

        const botIndex = dbLoadBots().filter(b => b.scheduleMode === 'human-random').length;
        dbSaveBots([bot]);

        if (isHumanRandom) {
            const now = new Date();
            const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
            regenerateBotSchedule(
                bot.id,
                bot.postsPerDayWeekday,
                bot.postsPerDayWeekend,
                botIndex,
                endDate
            );
        } else {
            app._botScheduler?.register(bot);
        }

        res.status(201).json(bot);
    });

    // PATCH /admin/bots/:id
    app.patch('/admin/bots/:id', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const existing = dbLoadBots().find(b => b.id === req.params.id);
        if (!existing) return res.status(404).json({ error: 'Bot no encontrado' });

        const allowed = ['name','displayName','direction','avatarUrl','prompt','target',
                         'schemaType','schedule','scheduleMode','postsPerDayWeekday',
                         'postsPerDayWeekend','quantity','model','enabled'];
        const fields = {};
        let scheduleChanged = false;
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                if (key === 'quantity') fields[key] = Math.min(Math.max(parseInt(req.body[key]) || 1, 1), 10);
                else if (key === 'schedule' && existing.scheduleMode !== 'human-random' && !isValidCron(req.body[key])) continue;
                else fields[key] = req.body[key];
                if (['scheduleMode','postsPerDayWeekday','postsPerDayWeekend'].includes(key)) scheduleChanged = true;
            }
        }

        const updated = dbPatchBot(req.params.id, fields);

        if (updated.scheduleMode === 'human-random' && scheduleChanged) {
            const allHuman = dbLoadBots().filter(b => b.scheduleMode === 'human-random');
            const botIndex = allHuman.findIndex(b => b.id === updated.id);
            const now = new Date();
            regenerateBotSchedule(updated.id, updated.postsPerDayWeekday || 2, updated.postsPerDayWeekend || 3,
                botIndex >= 0 ? botIndex : 0,
                new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0)));
        } else {
            app._botScheduler?.update(updated);
        }

        res.json(updated);
    });

    // DELETE /admin/bots/:id
    app.delete('/admin/bots/:id', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const existing = dbLoadBots().find(b => b.id === req.params.id);
        if (!existing) return res.status(404).json({ error: 'Bot no encontrado' });
        dbDeleteBot(req.params.id);
        app._botScheduler?.unregister(req.params.id);
        removeBotSchedule(req.params.id);
        res.json({ ok: true });
    });

    // POST /admin/bots/:id/run — ejecución manual
    app.post('/admin/bots/:id/run', async (req, res) => {
        if (!checkAdmin(req, res)) return;
        try {
            const items = await runBot(req.params.id);
            res.json({ ok: true, generated: items.length, items });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET /admin/bots/:id/logs
    app.get('/admin/bots/:id/logs', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const bot = dbLoadBots().find(b => b.id === req.params.id);
        if (!bot) return res.status(404).json({ error: 'Bot no encontrado' });
        res.json(bot.logs || []);
    });

    // GET /admin/bots/:id/schedule — upcoming entries
    app.get('/admin/bots/:id/schedule', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const bot = dbLoadBots().find(b => b.id === req.params.id);
        if (!bot) return res.status(404).json({ error: 'Bot no encontrado' });
        const limit = Math.min(parseInt(req.query.limit || 50), 100);
        const entries = getUpcomingEntries(req.params.id, limit);
        res.json(entries);
    });

    // POST /admin/bots/:id/regenerate — regenerate schedule for a bot
    app.post('/admin/bots/:id/regenerate', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const bots = dbLoadBots();
        const bot  = bots.find(b => b.id === req.params.id);
        if (!bot) return res.status(404).json({ error: 'Bot no encontrado' });
        if (bot.scheduleMode !== 'human-random') {
            return res.status(400).json({ error: 'Este bot no usa human-random' });
        }
        const allHumanBots = bots.filter(b => b.scheduleMode === 'human-random');
        const botIndex = allHumanBots.findIndex(b => b.id === bot.id);
        const now = new Date();
        const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
        const count = regenerateBotSchedule(bot.id, bot.postsPerDayWeekday || 2, bot.postsPerDayWeekend || 3,
            botIndex >= 0 ? botIndex : 0, endDate);
        res.json({ ok: true, scheduled: count });
    });

    // GET /admin/schedule — agenda global de todos los bots
    app.get('/admin/schedule', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const limit      = Math.min(parseInt(req.query.limit  || 200), 500);
        const onlyFired  = req.query.fired === 'true';
        const onlyPending = req.query.pending === 'true';
        const bots       = dbLoadBots();
        const botMap     = Object.fromEntries(bots.map(b => [b.id, { displayName: b.displayName || b.name, direction: b.direction, enabled: b.enabled }]));
        const { loadSchedule } = require('../bot_schedule.cjs');
        let entries = loadSchedule().map(e => ({
            ...e,
            botName:    botMap[e.botId]?.displayName || e.botId,
            direction:  botMap[e.botId]?.direction   || null,
            botEnabled: botMap[e.botId]?.enabled     ?? true,
        }));
        if (onlyFired)   entries = entries.filter(e => e.fired);
        if (onlyPending) entries = entries.filter(e => !e.fired);
        // Sort: upcoming asc, fired desc (most recent first)
        const pending = entries.filter(e => !e.fired).sort((a,b) => a.ts - b.ts);
        const fired   = entries.filter(e =>  e.fired).sort((a,b) => b.ts - a.ts);
        res.json({ pending: pending.slice(0, limit), fired: fired.slice(0, limit), total: entries.length });
    });

    // ── Post management (admin) ───────────────────────────────────────────────

    // GET /admin/posts — list posts (admin)
    app.get('/admin/posts', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const limit  = Math.min(parseInt(req.query.limit  || 50), 200);
        const offset = parseInt(req.query.offset || 0);
        const posts  = dbLoadFeed(limit, offset);
        res.json({ posts, total: posts.length });
    });

    // PATCH /admin/posts/:id — edit post
    app.patch('/admin/posts/:id', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const updated = dbPatchPost(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: 'Post no encontrado' });
        res.json(updated);
    });

    // DELETE /admin/posts/:id — remove post
    app.delete('/admin/posts/:id', (req, res) => {
        if (!checkAdmin(req, res)) return;
        dbDeletePost(req.params.id);
        res.json({ ok: true });
    });

    // ── REST API pública (con API key opcional) ───────────────────────────────
    // Documentado en /api/docs (texto plano)
    app.get('/api/docs', (req, res) => {
        res.type('text').send(`
SenseMate Content API
─────────────────────
GET  /api/feed?limit=30&offset=0       Posts recientes del Live Feed
GET  /api/classroom?tab=disponibles    Clases (tab: disponibles | live)

Autenticación: sin API key (acceso público de solo lectura)

Estructura de un post (Live Feed):
  id, botId, author, avatar, title, body, tags, level, lang, ts, likes, comments, schema

Estructura de una clase (Class Room):
  id, botId, teacher, emoji, title, body, tags, level, lang, live, ts, schema

schema: objeto JSON-LD con datos estructurados schema.org
        `);
    });
};
