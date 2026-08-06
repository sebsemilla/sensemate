// routes/bots.cjs — Admin bot management + public feed/classroom API
'use strict';
const crypto    = require('crypto');
const { loadBots, saveBots, loadFeed, loadClasses, runBot } = require('../bot_runner.cjs');

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

module.exports = function registerBotRoutes(app) {

    // ── Endpoints públicos (feed / classroom) ─────────────────────────────────

    // GET /api/feed?limit=30&offset=0
    app.get('/api/feed', (req, res) => {
        const limit  = Math.min(parseInt(req.query.limit  || 30), 100);
        const offset = parseInt(req.query.offset || 0);
        const posts  = loadFeed().slice(offset, offset + limit);
        res.json({ posts, total: loadFeed().length });
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
        const bots = loadBots().map(b => ({ ...b, logs: (b.logs || []).slice(0, 5) }));
        res.json(bots);
    });

    // POST /admin/bots
    app.post('/admin/bots', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const { name, prompt, target, schemaType, schedule, quantity, model, enabled } = req.body;
        if (!name || !prompt || !schedule) return res.status(400).json({ error: 'Faltan campos: name, prompt, schedule' });
        if (!isValidCron(schedule)) return res.status(400).json({ error: 'Expresión cron inválida' });
        const qty = Math.min(Math.max(parseInt(quantity) || 1, 1), 10);

        const bot = {
            id:         `bot_${crypto.randomBytes(5).toString('hex')}`,
            name:       String(name).slice(0, 80),
            prompt:     String(prompt).slice(0, 2000),
            target:     ['livefeed', 'classroom'].includes(target) ? target : 'livefeed',
            schemaType: ['Article','LearningResource','Course','EducationEvent','FAQPage'].includes(schemaType)
                            ? schemaType : 'Article',
            schedule:   schedule.trim(),
            quantity:   qty,
            model:      ['deepseek-chat','deepseek-reasoner'].includes(model) ? model : 'deepseek-chat',
            enabled:    enabled !== false,
            lastRun:    null,
            runCount:   0,
            logs:       [],
            createdAt:  Date.now()
        };

        const bots = loadBots();
        bots.push(bot);
        saveBots(bots);

        // Registrar cron en el scheduler global
        app._botScheduler?.register(bot);

        res.status(201).json(bot);
    });

    // PATCH /admin/bots/:id
    app.patch('/admin/bots/:id', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const bots = loadBots();
        const idx  = bots.findIndex(b => b.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: 'Bot no encontrado' });

        const allowed = ['name','prompt','target','schemaType','schedule','quantity','model','enabled'];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                if (key === 'quantity') bots[idx][key] = Math.min(Math.max(parseInt(req.body[key]) || 1, 1), 10);
                else if (key === 'schedule' && !isValidCron(req.body[key])) continue;
                else bots[idx][key] = req.body[key];
            }
        }
        saveBots(bots);
        app._botScheduler?.update(bots[idx]);
        res.json(bots[idx]);
    });

    // DELETE /admin/bots/:id
    app.delete('/admin/bots/:id', (req, res) => {
        if (!checkAdmin(req, res)) return;
        const bots    = loadBots();
        const filtered = bots.filter(b => b.id !== req.params.id);
        if (filtered.length === bots.length) return res.status(404).json({ error: 'Bot no encontrado' });
        saveBots(filtered);
        app._botScheduler?.unregister(req.params.id);
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
        const bot = loadBots().find(b => b.id === req.params.id);
        if (!bot) return res.status(404).json({ error: 'Bot no encontrado' });
        res.json(bot.logs || []);
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
