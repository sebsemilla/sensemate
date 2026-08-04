'use strict';
const fs   = require('fs');
const path = require('path');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null;

function checkAdminToken(req, res) {
    if (!ADMIN_TOKEN) {
        res.status(503).json({ error: 'Servicio de administración no configurado.' });
        return false;
    }
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) {
        res.status(403).json({ error: 'Acceso denegado' });
        return false;
    }
    return true;
}

// ─── Feedback ─────────────────────────────────────────────────

const FEEDBACK_FILE = path.join(__dirname, '..', 'feedback.json');

function loadFeedback() {
    try {
        return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    } catch {
        return [];
    }
}

// ─── Song Submissions ─────────────────────────────────────────

const SONG_SUBMISSIONS_FILE = path.join(__dirname, '..', 'song_submissions.json');

function loadSongSubmissions() {
    try { return JSON.parse(fs.readFileSync(SONG_SUBMISSIONS_FILE, 'utf8')); }
    catch { return []; }
}
function saveSongSubmissions(data) {
    fs.writeFileSync(SONG_SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Writers & Texts ─────────────────────────────────────────

const WRITERS_SUBMISSIONS_FILE = path.join(__dirname, '..', 'writers_submissions.json');

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

// ─── Flashcard Groups ─────────────────────────────────────────

const FLASHCARD_SUBMISSIONS_FILE = path.join(__dirname, '..', 'flashcard_group_submissions.json');

function loadFlashcardSubmissions() {
    try { return JSON.parse(fs.readFileSync(FLASHCARD_SUBMISSIONS_FILE, 'utf8')); }
    catch { return []; }
}
function saveFlashcardSubmissions(data) {
    fs.writeFileSync(FLASHCARD_SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Contributors & Publications ─────────────────────────────

const CONTRIBUTOR_CODE   = 'SOYPROFE';
const CONTRIBUTORS_FILE  = path.join(__dirname, '..', 'contributors.json');
const PUBLICATIONS_FILE  = path.join(__dirname, '..', 'publications.json');

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

module.exports = function registerContentRoutes(app, { authDb }) {

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

    // ── Feedback ──────────────────────────────────────────────────

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

    // ── Song Submissions ──────────────────────────────────────────

    app.post('/songs/submit', authDb.optionalAuth, (req, res) => {
        const { artistName, songTitle, language, country, lyrics, translations, artistImage } = req.body;
        if (!artistName || !songTitle || !language || !lyrics) {
            return res.status(400).json({ error: 'Faltan campos requeridos.' });
        }
        const isAdminSubmit = req.headers['x-admin-token'] === ADMIN_TOKEN;

        // Guardar imagen del artista si viene en base64
        const ALLOWED_IMG_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);
        let artistImagePath = null;
        if (artistImage && artistImage.startsWith('data:image/')) {
            try {
                const matches = artistImage.match(/^data:image\/(\w+);base64,(.+)$/);
                if (matches) {
                    const ext      = matches[1].toLowerCase();
                    if (!ALLOWED_IMG_EXT.has(ext)) throw new Error('Extensión de imagen no permitida');
                    const b64data  = matches[2];
                    const artistId = artistName.trim().toLowerCase()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
                    const imgDir   = path.join(__dirname, '..', 'images', 'musicians');
                    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
                    const filename = `${artistId}.${ext}`;
                    fs.writeFileSync(path.join(imgDir, filename), Buffer.from(b64data, 'base64'));
                    artistImagePath = `/images/musicians/${filename}`;
                }
            } catch (imgErr) {
                console.warn('⚠️ No se pudo guardar imagen del artista:', imgErr.message);
            }
        }

        // Filtrar traducciones válidas y deduplicar por idioma
        const validTranslations = Array.isArray(translations)
            ? translations.filter(t => t.lang && t.text && t.text.trim())
                .map(t => ({ lang: t.lang.trim(), text: t.text.trim() }))
                .filter((t, i, arr) => arr.findIndex(x => x.lang === t.lang) === i)
            : [];

        const all = loadSongSubmissions();

        const norm = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const existing = all.find(s =>
            norm(s.artistName) === norm(artistName) &&
            norm(s.songTitle)  === norm(songTitle)
        );

        if (existing) {
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
            existing.translations = [...(existing.translations || []), ...newTrans];
            saveSongSubmissions(all);
            console.log(`🎵 Traducciones agregadas a "${existing.songTitle}": ${newTrans.map(t => t.lang).join(', ')}`);
            return res.json({ ok: true, id: existing.id, merged: true, addedLangs: newTrans.map(t => t.lang) });
        }

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
            submittedBy:  req.jwtUser?.id || 'invitado',
            status:       isAdminSubmit ? 'approved' : 'pending',
            submittedAt:  new Date().toISOString(),
        };
        all.push(entry);
        saveSongSubmissions(all);
        console.log(`🎵 Canción ${isAdminSubmit ? 'aprobada directamente' : 'enviada para revisión'}: "${entry.songTitle}" de ${entry.artistName}`);
        res.json({ ok: true, id: entry.id, autoApproved: isAdminSubmit });
    });

    app.get('/songs/data/:lang', (req, res) => {
        const lang = req.params.lang;
        const approved = loadSongSubmissions().filter(s => s.status === 'approved' && s.language === lang);

        const artistsMap = {};
        const songsMap   = {};

        approved.forEach(s => {
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

    app.get('/admin/songs', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        res.json(loadSongSubmissions());
    });

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

    app.delete('/admin/songs/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        saveSongSubmissions(loadSongSubmissions().filter(s => s.id !== req.params.id));
        res.json({ ok: true });
    });

    app.get('/admin/songs/points', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const approved = loadSongSubmissions().filter(s => s.status === 'approved');
        const points = {};
        approved.forEach(s => {
            points[s.submittedBy] = (points[s.submittedBy] || 0) + 10;
        });
        res.json(points);
    });

    // ── Writers & Texts ───────────────────────────────────────────

    app.post('/writers/submit', (req, res) => {
        const isAdminSubmit = req.headers['x-admin-token'] === ADMIN_TOKEN;

        let userId = null;
        if (!isAdminSubmit) {
            const auth = req.headers.authorization || '';
            try {
                const payload = require('jsonwebtoken').verify(auth.slice(7), process.env.JWT_SECRET);
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

        const { writerId, writerName, writerCountry, writerContinent, title, type, original, lang, translations, translation, targetLang, visibility } = req.body;
        if (!writerName || !title || !type || !original || !lang) {
            return res.status(400).json({ error: 'Faltan campos requeridos: escritor, título, tipo, texto y idioma.' });
        }

        const all  = loadWriterSubmissions();
        const norm = s => (s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

        const dup = all.find(s => norm(s.writerName) === norm(writerName) && norm(s.title) === norm(title) && norm(s.original) === norm(original));
        if (dup) return res.status(409).json({ error: 'Este texto ya existe en la base de datos.' });

        const cleanTranslations = Array.isArray(translations)
            ? translations.filter(t => t?.text?.trim()).map(t => ({ lang: (t.lang || '').trim(), text: t.text.trim() }))
            : (translation && translation.trim() ? [{ lang: (targetLang || 'en').trim(), text: translation.trim() }] : []);
        const hasTranslation = cleanTranslations.length > 0;
        const pointsAwarded  = hasTranslation ? WRITER_POINTS.text + WRITER_POINTS.translation : WRITER_POINTS.text;

        const stableId = (writerName + '_' + title).toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

        const entry = {
            id:              `wt_${Date.now()}`,
            writerId:        writerId || stableId.split('_').slice(0, 2).join('_'),
            writerName:      writerName.trim(),
            writerCountry:   (writerCountry || '').trim(),
            writerContinent: (writerContinent || '').trim(),
            title:           title.trim(),
            type:            type.trim(),
            original:        original.trim(),
            translations:    cleanTranslations,
            translation:     cleanTranslations[0]?.text || null,
            lang:            lang.trim(),
            targetLang:      cleanTranslations[0]?.lang || null,
            visibility:      isAdminSubmit ? 'public' : (visibility || 'public'),
            submittedBy:     userId || 'admin',
            pointsAwarded,
            status:          isAdminSubmit ? 'approved' : 'pending',
            submittedAt:     new Date().toISOString(),
        };

        all.push(entry);
        saveWriterSubmissions(all);

        if (!isAdminSubmit) _checkAndGrantFreeMonth(userId);

        console.log(`📖 Texto ${isAdminSubmit ? 'aprobado directamente' : 'enviado para revisión'}: "${entry.title}" de ${entry.writerName}`);
        res.json({ ok: true, id: entry.id, autoApproved: isAdminSubmit, pointsAwarded });
    });

    app.get('/writers/data/:lang', (req, res) => {
        const approved = loadWriterSubmissions().filter(s =>
            s.status === 'approved' &&
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
                    id:        wid,
                    name:      s.writerName,
                    image:     '✍️',
                    country:   s.writerCountry || '',
                    continent: s.writerContinent || '',
                    years:     '',
                    genres:    [],
                    fromDb:    true,
                };
            }
            if (s.type && !writersMap[wid].genres.includes(s.type)) writersMap[wid].genres.push(s.type);

            const translations = Array.isArray(s.translations) && s.translations.length
                ? s.translations
                : (s.translation ? [{ lang: s.targetLang || 'en', text: s.translation }] : []);

            if (!textsMap[wid]) textsMap[wid] = [];
            textsMap[wid].push({
                id:           s.id,
                title:        s.title,
                type:         s.type,
                original:     s.original,
                translations,
                lang:         s.lang,
                country:      s.writerCountry || '',
                continent:    s.writerContinent || '',
            });
        });

        res.json({ writers: Object.values(writersMap), texts: textsMap });
    });

    app.get('/admin/writers', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        res.json(loadWriterSubmissions());
    });

    app.patch('/admin/writers/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const all   = loadWriterSubmissions();
        const entry = all.find(s => s.id === req.params.id);
        if (!entry) return res.status(404).json({ error: 'No encontrado' });

        const prev = entry.status;
        ['status','title','type','original','translation','translations','visibility','adminNote',
         'writerName','writerCountry','writerContinent','lang','targetLang'].forEach(f => {
            if (req.body[f] !== undefined) entry[f] = req.body[f];
        });
        if (req.body.translations !== undefined) {
            entry.translation = entry.translations[0]?.text || null;
            entry.targetLang  = entry.translations[0]?.lang || null;
        }
        entry.updatedAt = new Date().toISOString();

        saveWriterSubmissions(all);

        if (prev !== 'approved' && entry.status === 'approved' && entry.submittedBy !== 'admin') {
            _checkAndGrantFreeMonth(entry.submittedBy);
        }

        res.json({ ok: true });
    });

    app.delete('/admin/writers/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        saveWriterSubmissions(loadWriterSubmissions().filter(s => s.id !== req.params.id));
        res.json({ ok: true });
    });

    app.get('/admin/writers/points', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        res.json(_calcWriterPoints(loadWriterSubmissions()));
    });

    // ── Flashcard Groups ──────────────────────────────────────────

    app.post('/flashcard-groups/submit', (req, res) => {
        const isAdminSubmit = req.headers['x-admin-token'] === ADMIN_TOKEN;

        let userId = null;
        if (!isAdminSubmit) {
            const auth = req.headers.authorization || '';
            try {
                const payload = require('jsonwebtoken').verify(auth.slice(7), process.env.JWT_SECRET);
                if (!payload.isDev && !payload.plan?.startsWith('contributor')) {
                    return res.status(403).json({ error: 'Se requiere ser Contributor para publicar un grupo como público.' });
                }
                userId = payload.id;
            } catch {
                return res.status(401).json({ error: 'Sesión inválida. Iniciá sesión para continuar.' });
            }
        }

        const { title, color, notes, cards, serverSubmissionId } = req.body;
        if (!title || !Array.isArray(cards) || !cards.length) {
            return res.status(400).json({ error: 'Faltan campos requeridos: título y al menos una tarjeta.' });
        }
        if (cards.some(c => !c.word || !c.translation)) {
            return res.status(400).json({ error: 'Cada tarjeta necesita frente y reverso.' });
        }

        const all = loadFlashcardSubmissions();
        let entry = serverSubmissionId ? all.find(s => s.id === serverSubmissionId) : null;
        if (entry && !isAdminSubmit && entry.submittedBy !== userId) {
            return res.status(403).json({ error: 'No podés actualizar la publicación de otro usuario.' });
        }

        const cardsPayload = cards.map(c => ({
            word:        String(c.word).trim(),
            translation: String(c.translation).trim(),
            phonetic:    c.phonetic ? String(c.phonetic).trim() : '',
            image:       c.image || null,
        }));

        if (entry) {
            entry.title      = title.trim();
            entry.color      = color || entry.color;
            entry.notes      = (notes || '').trim();
            entry.cards      = cardsPayload;
            entry.status     = isAdminSubmit ? 'approved' : 'pending';
            entry.updatedAt  = new Date().toISOString();
        } else {
            entry = {
                id:          `fg_${Date.now()}`,
                title:       title.trim(),
                color:       color || '#6366f1',
                notes:       (notes || '').trim(),
                cards:       cardsPayload,
                submittedBy: userId || 'admin',
                status:      isAdminSubmit ? 'approved' : 'pending',
                submittedAt: new Date().toISOString(),
            };
            all.push(entry);
        }

        saveFlashcardSubmissions(all);

        console.log(`📇 Grupo de flashcards ${isAdminSubmit ? 'aprobado directamente' : 'enviado para revisión'}: "${entry.title}"`);
        res.json({ ok: true, id: entry.id, autoApproved: isAdminSubmit });
    });

    app.get('/admin/flashcard-groups', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        res.json(loadFlashcardSubmissions());
    });

    app.patch('/admin/flashcard-groups/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const all   = loadFlashcardSubmissions();
        const entry = all.find(s => s.id === req.params.id);
        if (!entry) return res.status(404).json({ error: 'No encontrado' });

        ['status', 'title', 'color', 'notes', 'adminNote'].forEach(f => {
            if (req.body[f] !== undefined) entry[f] = req.body[f];
        });
        entry.updatedAt = new Date().toISOString();

        saveFlashcardSubmissions(all);
        res.json({ ok: true });
    });

    app.delete('/admin/flashcard-groups/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        saveFlashcardSubmissions(loadFlashcardSubmissions().filter(s => s.id !== req.params.id));
        res.json({ ok: true });
    });

    app.get('/flashcard-groups/my-submissions', (req, res) => {
        const auth = req.headers.authorization || '';
        let payload;
        try {
            payload = require('jsonwebtoken').verify(auth.slice(7), process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ error: 'Sesión inválida.' });
        }
        const mine = loadFlashcardSubmissions()
            .filter(s => s.submittedBy === payload.id)
            .map(s => ({ id: s.id, status: s.status, title: s.title, adminNote: s.adminNote || null, updatedAt: s.updatedAt || s.submittedAt }));
        res.json(mine);
    });

    // ── Contributors & Publications ───────────────────────────────

    app.post('/contributor/register', authDb.verifyToken, (req, res) => {
        const { code, name, email, link, photo, bio, username } = req.body;
        if (code !== CONTRIBUTOR_CODE)  return res.status(403).json({ error: 'Código inválido.' });
        if (!name || !email || !link)   return res.status(400).json({ error: 'Nombre, email y link son requeridos.' });
        const contributors = loadContributors();
        if (contributors.find(c => c.email?.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ error: 'Ya existe una solicitud con ese email.' });
        }
        const c = {
            id: Date.now().toString(),
            userId: req.jwtUser.id,
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

        if (req.jwtUser.id !== 'dev') {
            authDb.createNotification(req.jwtUser.id, 'contributor_pending', {});
            authDb.createNotification(req.jwtUser.id, 'classroom_invite', {});
        }

        res.json({ ok: true, id: c.id });
    });

    app.get('/admin/contributors', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        res.json(loadContributors());
    });

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

    app.delete('/admin/contributors/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        saveContributors(loadContributors().filter(c => c.id !== req.params.id));
        savePublications(loadPublications().filter(p => p.contributorId !== req.params.id));
        res.json({ ok: true });
    });

    app.get('/admin/publications', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const pubs = loadPublications();
        const contribs = loadContributors();
        const map = {};
        contribs.forEach(c => { map[c.id] = c; });
        res.json(pubs.map(p => ({ ...p, contributorName: map[p.contributorId]?.name || '—' })));
    });

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

    app.delete('/admin/publications/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        savePublications(loadPublications().filter(p => p.id !== req.params.id));
        res.json({ ok: true });
    });

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

};

// Export loadContributors so the cron job in server.cjs can use it
module.exports.loadContributors = loadContributors;
