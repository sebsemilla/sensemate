'use strict';
const { _getOptionalUser } = require('../lib/ai-helpers.cjs');

function checkAdminToken(req) {
    const token = process.env.ADMIN_TOKEN;
    return token && req.headers['x-admin-token'] === token;
}

module.exports = function registerExamplesRoutes(app, { authDb, ttsLimiter }) {

    // POST /examples/record — Premium only, save voice example
    app.post('/examples/record', ttsLimiter, async (req, res) => {
        const user = _getOptionalUser(req);
        if (!user) return res.status(401).json({ error: 'Iniciá sesión para grabar ejemplos.', code: 'AUTH_REQUIRED' });

        const isPremium = !!(user.isDev || user.plan === 'premium' || user.plan === 'gold');
        if (!isPremium) return res.status(403).json({ error: 'Esta función es exclusiva para usuarios Premium.', code: 'PREMIUM_REQUIRED' });

        const { word, sourceLang, targetLang, exampleText, audioB64, mimeType } = req.body;
        if (!word || !sourceLang || !targetLang) return res.status(400).json({ error: 'Faltan datos requeridos (word, sourceLang, targetLang).' });
        if (!audioB64 && !exampleText) return res.status(400).json({ error: 'Debe incluir audio o texto de ejemplo.' });

        // Limit audio size (max ~2MB base64 ≈ ~1.5MB audio)
        if (audioB64 && audioB64.length > 2_800_000) return res.status(400).json({ error: 'El audio es demasiado largo. Máximo ~30 segundos.' });

        try {
            const id = authDb.createUserExample({
                userId: user.id,
                word: word.slice(0, 200),
                sourceLang,
                targetLang,
                exampleText: exampleText?.slice(0, 500),
                audioB64,
                mimeType: mimeType || 'audio/webm',
            });
            return res.json({ ok: true, id });
        } catch (e) {
            console.error('[/examples/record]', e.message);
            return res.status(500).json({ error: 'Error al guardar el ejemplo.' });
        }
    });

    // GET /examples?word=X&source=Y&target=Z — public, approved only
    app.get('/examples', async (req, res) => {
        const { word, source, target } = req.query;
        if (!word || !source || !target) return res.status(400).json({ error: 'Faltan parámetros.' });
        try {
            const examples = authDb.getApprovedExamples(word, source, target);
            // Strip audio_b64 from list; provide it only per-item endpoint
            return res.json(examples.map(e => ({
                id: e.id,
                user_name: e.user_name || 'Usuario',
                example_text: e.example_text,
                has_audio: !!e.audio_b64,
                created_at: e.created_at,
            })));
        } catch (e) {
            return res.status(500).json({ error: 'Error al cargar ejemplos.' });
        }
    });

    // GET /examples/:id/audio — stream audio for approved example
    app.get('/examples/:id/audio', (req, res) => {
        try {
            const row = authDb.db.prepare('SELECT audio_b64, mime_type, status FROM user_examples WHERE id = ?').get(req.params.id);
            if (!row || row.status !== 'approved' || !row.audio_b64) return res.status(404).json({ error: 'Audio no disponible.' });
            const buf = Buffer.from(row.audio_b64, 'base64');
            res.set('Content-Type', row.mime_type || 'audio/webm');
            res.send(buf);
        } catch (e) {
            res.status(500).json({ error: 'Error.' });
        }
    });

    // GET /admin/examples — admin: list all with optional status filter
    app.get('/admin/examples', (req, res) => {
        if (!checkAdminToken(req)) return res.status(403).json({ error: 'No autorizado.' });
        const status = req.query.status || 'pending';
        try {
            const rows = authDb.getAdminExamples(status);
            return res.json(rows.map(r => ({
                id: r.id,
                user_name: r.user_name || 'Anón',
                user_email: r.user_email || '',
                word: r.word,
                source_lang: r.source_lang,
                target_lang: r.target_lang,
                example_text: r.example_text,
                has_audio: !!r.audio_b64,
                mime_type: r.mime_type,
                status: r.status,
                created_at: r.created_at,
                reviewed_at: r.reviewed_at,
            })));
        } catch (e) {
            return res.status(500).json({ error: 'Error.' });
        }
    });

    // GET /admin/examples/:id/audio — admin: preview audio (any status)
    app.get('/admin/examples/:id/audio', (req, res) => {
        if (!checkAdminToken(req)) return res.status(403).json({ error: 'No autorizado.' });
        try {
            const row = authDb.db.prepare('SELECT audio_b64, mime_type FROM user_examples WHERE id = ?').get(req.params.id);
            if (!row || !row.audio_b64) return res.status(404).json({ error: 'Audio no disponible.' });
            const buf = Buffer.from(row.audio_b64, 'base64');
            res.set('Content-Type', row.mime_type || 'audio/webm');
            res.send(buf);
        } catch (e) {
            res.status(500).json({ error: 'Error.' });
        }
    });

    // PATCH /admin/examples/:id — admin: approve or reject
    app.patch('/admin/examples/:id', (req, res) => {
        if (!checkAdminToken(req)) return res.status(403).json({ error: 'No autorizado.' });
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: 'Estado inválido.' });
        try {
            authDb.reviewExample(req.params.id, status, 'admin');
            return res.json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: 'Error.' });
        }
    });

    // DELETE /admin/examples/:id
    app.delete('/admin/examples/:id', (req, res) => {
        if (!checkAdminToken(req)) return res.status(403).json({ error: 'No autorizado.' });
        try {
            authDb.deleteUserExample(req.params.id);
            return res.json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: 'Error.' });
        }
    });
};
