// auth_db.cjs — Auth con SQLite + bcrypt + JWT
// =============================================

'use strict';

const Database    = require('better-sqlite3');
const bcrypt      = require('bcrypt');
const jwt         = require('jsonwebtoken');
const path        = require('path');
const crypto      = require('crypto');
const { _validEmail } = require('./lib/validators.cjs');
const logger      = require('./lib/logger.cjs');

const DB_PATH      = process.env.DB_PATH || path.join(__dirname, 'lingua_users.db');
const SALT_ROUNDS  = 12;
const JWT_SECRET   = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('❌ JWT_SECRET no está definida en .env — el servidor no puede arrancar de forma segura.');
const JWT_EXPIRES  = '30d';
// Solo activo si DEV_PASSWORD está definida en .env Y no es producción
const DEV_PASSWORD = process.env.NODE_ENV !== 'production' ? (process.env.DEV_PASSWORD || null) : null;

// ─── DB init ──────────────────────────────────────────────────

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    username       TEXT UNIQUE,
    email          TEXT UNIQUE NOT NULL,
    password       TEXT NOT NULL,
    preferred_lang TEXT DEFAULT 'es',
    is_dev         INTEGER DEFAULT 0,
    plan           TEXT DEFAULT 'free',
    created_at     TEXT NOT NULL,
    email_verified INTEGER DEFAULT 0,
    verify_token   TEXT,
    google_id      TEXT
  );
`);

// Migrations para usuarios existentes
try { db.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN verify_token TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN reset_token TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN reset_token_expires TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN google_id TEXT`); } catch {}
try { db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL`); } catch {}
// Addon ClassRooms: independiente de `plan` — no se pisa al comprar/renovar el plan principal
try { db.exec(`ALTER TABLE users ADD COLUMN classroom_addon INTEGER DEFAULT 0`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN classroom_addon_period TEXT DEFAULT NULL`); } catch {}
// Rol Estudiante: profesor asignado por admin
try { db.exec(`ALTER TABLE users ADD COLUMN assigned_teacher_id TEXT DEFAULT NULL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN profile_photo TEXT DEFAULT NULL`); } catch {}
// Idioma de UI elegido por el usuario (persiste cross-device)
try { db.exec(`ALTER TABLE users ADD COLUMN ui_language TEXT DEFAULT NULL`); } catch {}

// User voice examples
db.exec(`
  CREATE TABLE IF NOT EXISTS user_examples (
    id           TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL,
    word         TEXT NOT NULL,
    source_lang  TEXT NOT NULL,
    target_lang  TEXT NOT NULL,
    example_text TEXT,
    audio_b64    TEXT,
    mime_type    TEXT DEFAULT 'audio/webm',
    status       TEXT DEFAULT 'pending',
    created_at   TEXT NOT NULL,
    reviewed_at  TEXT,
    reviewed_by  TEXT
  )
`);

// Seed admin user from env vars — no valores hardcodeados
function seedAdminUser() {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminEmail || !adminPassword) {
        if (process.env.NODE_ENV === 'production') {
            logger.warn('ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD no definidas — admin user no fue creado.');
        }
        return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(adminUsername);
    if (existing) {
        db.prepare('UPDATE users SET email_verified = 1 WHERE username = ?').run(adminUsername);
        return;
    }

    const hashed = bcrypt.hashSync(adminPassword, SALT_ROUNDS);
    db.prepare(`
        INSERT OR IGNORE INTO users (id, name, username, email, password, preferred_lang, is_dev, plan, created_at, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(`admin_${Date.now()}`, adminUsername, adminUsername, adminEmail, hashed, 'es', 1, 'premium', new Date().toISOString());
    logger.info(`Admin user '${adminUsername}' seeded in DB`);
}

seedAdminUser();

// ─── Helpers ──────────────────────────────────────────────────

function _makePublicUser(row) {
    return {
        id:            row.id,
        name:          row.name,
        username:      row.username || null,
        email:         row.email,
        preferredLang: row.preferred_lang,
        isDev:         !!row.is_dev,
        plan:          row.plan || 'free',
        emailVerified: !!row.email_verified,
        classroomAddon: !!row.classroom_addon,
        uiLanguage:    row.ui_language   || null,
        country:       row.country       || null,
        bio:           row.bio           || null,
        profilePhoto:  row.profile_photo || null,
    };
}

function saveUILanguage(userId, lang) {
    if (!userId || userId === 'dev' || !lang) return;
    db.prepare('UPDATE users SET ui_language = ? WHERE id = ?').run(lang, userId);
}

function _signToken(user) {
    return jwt.sign(
        { id: user.id, isDev: !!user.is_dev, plan: user.plan || 'free', classroomAddon: !!user.classroom_addon },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
}

// Alias público para el endpoint /auth/refresh-token
function signToken(user) { return _signToken(user); }

// ─── Register ────────────────────────────────────────────────

async function register({ name, username, email, password, preferredLang }) {
    if (!name || !email || !password) {
        return { ok: false, error: 'Nombre, email y contraseña son obligatorios.' };
    }

    const trimEmail    = email.trim().toLowerCase();
    const trimUsername = username?.trim().toLowerCase() || null;

    if (!_validEmail(trimEmail)) {
        return { ok: false, error: 'El formato del email no es válido.' };
    }

    if (trimUsername && !/^[a-z0-9_]{3,30}$/.test(trimUsername)) {
        return { ok: false, error: 'Usuario solo puede tener letras, números y guion bajo (3–30 caracteres).' };
    }

    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(trimEmail);
    if (existingEmail) return { ok: false, error: 'Este email ya está registrado.' };

    if (trimUsername) {
        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(trimUsername);
        if (existingUser) return { ok: false, error: 'Ese nombre de usuario ya está en uso.' };
    }

    const hashed      = await bcrypt.hash(password, SALT_ROUNDS);
    const id          = Date.now().toString();
    const now         = new Date().toISOString();
    const verifyToken = crypto.randomBytes(32).toString('hex');

    db.prepare(`
        INSERT INTO users (id, name, username, email, password, preferred_lang, is_dev, plan, created_at, email_verified, verify_token)
        VALUES (?, ?, ?, ?, ?, ?, 0, 'free', ?, 0, ?)
    `).run(id, name.trim(), trimUsername, trimEmail, hashed, preferredLang || 'es', now, verifyToken);

    logger.debug('Verify token generado', { email: trimEmail });

    const row   = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const pub   = _makePublicUser(row);
    const token = _signToken(row);

    createNotification(id, 'welcome', { name: name.trim() });

    return { ok: true, token, user: { ...pub, isNew: true }, verifyToken };
}

// ─── Login ───────────────────────────────────────────────────

async function login({ email, password }) {
    const identifier = (email || '').trim().toLowerCase();

    // 🔧 Dev bypass: solo activo si DEV_PASSWORD está definida en .env
    if (DEV_PASSWORD && password === DEV_PASSWORD) {
        // Try to find a real isDev user matching the identifier
        const devRow = db.prepare(
            'SELECT * FROM users WHERE (LOWER(email) = ? OR LOWER(username) = ?) AND is_dev = 1'
        ).get(identifier, identifier);

        if (devRow) {
            const token = _signToken(devRow);
            return { ok: true, token, user: _makePublicUser(devRow) };
        }

        // Generic dev session (no DB row needed for unknown identifiers)
        const genericToken = jwt.sign(
            { id: 'dev', isDev: true, plan: 'premium' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );
        return {
            ok: true,
            token: genericToken,
            user: { id: 'dev', name: 'Dev User', username: null, email: identifier || 'dev@test.com', preferredLang: 'es', isDev: true, plan: 'premium' }
        };
    }

    // Normal login — email OR username
    const row = db.prepare(
        'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?'
    ).get(identifier, identifier);

    if (!row) return { ok: false, error: 'Email, usuario o contraseña incorrectos.' };

    const match = await bcrypt.compare(password, row.password);
    if (!match) return { ok: false, error: 'Email, usuario o contraseña incorrectos.' };

    const token = _signToken(row);
    return { ok: true, token, user: _makePublicUser(row) };
}

// ─── Cookie helpers ───────────────────────────────────────────

const _COOKIE_NAME = 'sm_token';
const _COOKIE_OPTS = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   30 * 24 * 60 * 60 * 1000,
    path:     '/',
};

function setAuthCookie(res, token) {
    res.cookie(_COOKIE_NAME, token, _COOKIE_OPTS);
}

function clearAuthCookie(res) {
    res.clearCookie(_COOKIE_NAME, { path: '/' });
}

function _parseCookieToken(req) {
    const raw = req.headers.cookie || '';
    const match = raw.match(/(?:^|;\s*)sm_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

// ─── Verify JWT middleware ────────────────────────────────────

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : _parseCookieToken(req);
    if (!token) return res.status(401).json({ error: 'No autenticado.' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Sincronizar plan y addon con el estado real en DB para que
        // downgrades y baneos tengan efecto inmediato sin esperar que venza el JWT.
        if (decoded.id !== 'dev') {
            const live = db.prepare('SELECT plan, classroom_addon FROM users WHERE id = ?').get(decoded.id);
            if (!live) return res.status(401).json({ error: 'Sesión expirada o inválida. Volvé a iniciar sesión.' });
            decoded.plan           = live.plan || 'free';
            decoded.classroomAddon = !!live.classroom_addon;
        }
        req.jwtUser = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Sesión expirada o inválida. Volvé a iniciar sesión.' });
    }
}

// Auth opcional: adjunta req.jwtUser si hay token válido, pero no bloquea la request
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : _parseCookieToken(req);
    if (token) {
        try { req.jwtUser = jwt.verify(token, JWT_SECRET); } catch {}
    }
    next();
}

// ─── Get user by id (for /auth/me) ───────────────────────────

function getUserById(id) {
    if (id === 'dev') return { id: 'dev', name: 'Dev User', username: null, email: 'dev@test.com', preferredLang: 'es', isDev: true, plan: 'premium', emailVerified: true };
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row ? _makePublicUser(row) : null;
}

// ─── Update plan (called when membership confirmed) ──────────

function setUserPlan(userId, plan) {
    if (userId === 'dev') return;
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, userId);
}

// Addon ClassRooms — independiente de `plan`, nunca lo pisa (ver setUserPlan arriba)
function setClassroomAddon(userId, active, period) {
    if (userId === 'dev') return;
    db.prepare('UPDATE users SET classroom_addon = ?, classroom_addon_period = ? WHERE id = ?')
      .run(active ? 1 : 0, period || null, userId);
}

// ─── Forgot / Reset password ──────────────────────────────────

async function createResetToken(email) {
    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(email.toLowerCase());
    if (!user) return { ok: false, error: 'No existe una cuenta con ese email.' };
    if (user.is_dev) return { ok: false, error: 'Esta cuenta no puede restablecer la contraseña.' };

    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hora

    db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
      .run(token, expires, user.id);

    return { ok: true, token, email: user.email, name: user.name };
}

async function resetPassword(token, newPassword) {
    if (!token || !newPassword) return { ok: false, error: 'Datos incompletos.' };
    if (newPassword.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };

    const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token);
    if (!user) return { ok: false, error: 'El enlace no es válido o ya fue usado.' };
    if (new Date() > new Date(user.reset_token_expires)) {
        return { ok: false, error: 'El enlace expiró. Solicitá uno nuevo.' };
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    db.prepare('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?')
      .run(hashed, user.id);

    return { ok: true };
}

// ─── Google Login ─────────────────────────────────────────────

async function loginWithGoogle({ googleId, email, name }) {
    // Buscar por google_id primero, luego por email
    let row = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
    if (!row) row = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(email.toLowerCase());

    if (row) {
        // Vincular google_id si todavía no lo tiene
        if (!row.google_id) {
            db.prepare('UPDATE users SET google_id = ?, email_verified = 1 WHERE id = ?').run(googleId, row.id);
            row = db.prepare('SELECT * FROM users WHERE id = ?').get(row.id);
        }
        return { ok: true, token: _signToken(row), user: _makePublicUser(row) };
    }

    // Crear usuario nuevo
    const id  = Date.now().toString();
    const now = new Date().toISOString();
    db.prepare(`
        INSERT INTO users (id, name, email, password, preferred_lang, is_dev, plan, created_at, email_verified, google_id)
        VALUES (?, ?, ?, '', 'es', 0, 'free', ?, 1, ?)
    `).run(id, name, email.toLowerCase(), now, googleId);

    const newRow = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return { ok: true, token: _signToken(newRow), user: { ..._makePublicUser(newRow), isNew: true } };
}

// ─── Delete account ────────────────────────────────────────────

function deleteUser(userId) {
    if (!userId || userId === 'dev') return { ok: false, error: 'No permitido.' };
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    return { ok: true };
}

// ─── Verify email ─────────────────────────────────────────────

function verifyEmail(token) {
    if (!token) return { ok: false, error: 'Token inválido.' };
    const row = db.prepare('SELECT * FROM users WHERE verify_token = ?').get(token);
    if (!row) return { ok: false, error: 'El enlace de verificación no es válido o ya fue usado.' };
    if (row.email_verified) return { ok: true };
    db.prepare('UPDATE users SET email_verified = 1, verify_token = NULL WHERE id = ?').run(row.id);
    logger.info('Email verificado', { email: row.email });
    return { ok: true };
}

// ─── Get all users (admin) ────────────────────────────────────

function getAllUsers({ page = 1, limit = 50 } = {}) {
    const safeLimit  = Math.min(Math.max(1, parseInt(limit)  || 50), 200);
    const safePage   = Math.max(1, parseInt(page) || 1);
    const offset     = (safePage - 1) * safeLimit;
    const total      = db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
    const rows       = db.prepare(
        'SELECT id, name, username, email, preferred_lang, is_dev, plan, email_verified, created_at, role, label, permissions, country, region, managed_regions, assigned_teacher_id FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(safeLimit, offset);
    return {
        users: rows.map(r => ({
            ...r,
            isDev:               !!r.is_dev,
            emailVerified:       !!r.email_verified,
            permissions:         JSON.parse(r.permissions     || '[]'),
            managed_regions:     JSON.parse(r.managed_regions || '[]'),
            assigned_teacher_id: r.assigned_teacher_id || null,
        })),
        total,
        page:  safePage,
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit),
    };
}

function getUsersByRegions(regions) {
    if (!regions?.length) return [];
    return db.prepare(
        `SELECT id, name, username, email, plan, role, label, country, region, created_at
         FROM users WHERE region IN (${regions.map(() => '?').join(',')})
         ORDER BY created_at DESC`
    ).all(...regions)
     .map(r => ({ ...r }));
}

// ─── User roles / labels / permissions / location ────────────
try { db.exec(`ALTER TABLE users ADD COLUMN role            TEXT DEFAULT NULL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN label           TEXT DEFAULT NULL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN permissions     TEXT DEFAULT '[]'`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN country         TEXT DEFAULT NULL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN region          TEXT DEFAULT NULL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN managed_regions TEXT DEFAULT '[]'`); } catch {}

// ─── Classroom tables ─────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS teacher_profiles (
    teacher_id   TEXT PRIMARY KEY,
    bio          TEXT DEFAULT '',
    target_langs TEXT DEFAULT '[]',
    status       TEXT DEFAULT 'available',
    rating       REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at   TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS classes (
    id          TEXT PRIMARY KEY,
    teacher_id  TEXT NOT NULL,
    name        TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    source_lang TEXT DEFAULT 'es',
    created_at  TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS class_students (
    class_id   TEXT NOT NULL,
    student_id TEXT NOT NULL,
    status     TEXT DEFAULT 'pending',
    joined_at  TEXT NOT NULL,
    PRIMARY KEY (class_id, student_id)
  );
  CREATE TABLE IF NOT EXISTS classroom_messages (
    id           TEXT PRIMARY KEY,
    class_id     TEXT NOT NULL,
    sender_id    TEXT NOT NULL,
    content      TEXT NOT NULL,
    is_private   INTEGER DEFAULT 0,
    recipient_id TEXT,
    created_at   TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS classroom_notifications (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    type       TEXT NOT NULL,
    payload    TEXT DEFAULT '{}',
    is_read    INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS teacher_ratings (
    teacher_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    score      INTEGER NOT NULL,
    comment    TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    PRIMARY KEY (teacher_id, student_id)
  );
  CREATE TABLE IF NOT EXISTS class_announcements (
    id         TEXT PRIMARY KEY,
    class_id   TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL,
    due_date   TEXT,
    created_at TEXT NOT NULL
  );
`);

// ─── Classroom helpers ────────────────────────────────────────

function getTeacherProfile(teacherId) {
    const row = db.prepare('SELECT * FROM teacher_profiles WHERE teacher_id = ?').get(teacherId);
    if (!row) return null;
    const user = db.prepare('SELECT id, name, username FROM users WHERE id = ?').get(teacherId);
    return { ...row, target_langs: JSON.parse(row.target_langs || '[]'), name: user?.name, username: user?.username };
}

function upsertTeacherProfile(teacherId, { bio, targetLangs, status }) {
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT teacher_id FROM teacher_profiles WHERE teacher_id = ?').get(teacherId);
    if (existing) {
        db.prepare('UPDATE teacher_profiles SET bio = ?, target_langs = ?, status = ? WHERE teacher_id = ?')
          .run(bio || '', JSON.stringify(targetLangs || []), status || 'available', teacherId);
    } else {
        db.prepare('INSERT INTO teacher_profiles (teacher_id, bio, target_langs, status, created_at) VALUES (?, ?, ?, ?, ?)')
          .run(teacherId, bio || '', JSON.stringify(targetLangs || []), status || 'available', now);
    }
    return getTeacherProfile(teacherId);
}

function listTeachers(targetLang) {
    const rows = db.prepare('SELECT tp.*, u.name, u.username FROM teacher_profiles tp JOIN users u ON u.id = tp.teacher_id').all();
    return rows
        .map(r => ({ ...r, target_langs: JSON.parse(r.target_langs || '[]') }))
        .filter(r => !targetLang || r.target_langs.includes(targetLang));
}

function createClass(teacherId, { name, targetLang, sourceLang }) {
    const id  = `cls_${Date.now()}`;
    const now = new Date().toISOString();
    db.prepare('INSERT INTO classes (id, teacher_id, name, target_lang, source_lang, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, teacherId, name, targetLang, sourceLang || 'es', now);
    return db.prepare('SELECT * FROM classes WHERE id = ?').get(id);
}

function getTeacherClasses(teacherId) {
    const classes = db.prepare('SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at DESC').all(teacherId);
    return classes.map(c => {
        const students = db.prepare('SELECT cs.student_id, cs.status, u.name, u.username FROM class_students cs JOIN users u ON u.id = cs.student_id WHERE cs.class_id = ?').all(c.id);
        return { ...c, students };
    });
}

function deleteClass(classId, teacherId) {
    const cls = db.prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?').get(classId, teacherId);
    if (!cls) return { ok: false, error: 'Clase no encontrada' };
    db.prepare('DELETE FROM class_students WHERE class_id = ?').run(classId);
    db.prepare('DELETE FROM classroom_messages WHERE class_id = ?').run(classId);
    db.prepare('DELETE FROM classes WHERE id = ?').run(classId);
    return { ok: true };
}

function addStudentByUsername(classId, teacherId, username) {
    const cls = db.prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?').get(classId, teacherId);
    if (!cls) return { ok: false, error: 'Clase no encontrada' };
    const student = db.prepare('SELECT * FROM users WHERE LOWER(username) = ?').get(username.toLowerCase());
    if (!student) return { ok: false, error: 'Usuario no encontrado' };
    if (student.plan !== 'premium' && student.plan !== 'gold' && !student.is_dev)
        return { ok: false, error: 'El alumno debe tener plan Premium o Gold' };
    const existing = db.prepare('SELECT * FROM class_students WHERE class_id = ? AND student_id = ?').get(classId, student.id);
    if (existing) {
        if (existing.status === 'active') return { ok: false, error: 'El alumno ya está en la clase' };
        db.prepare('UPDATE class_students SET status = ? WHERE class_id = ? AND student_id = ?').run('active', classId, student.id);
    } else {
        db.prepare('INSERT INTO class_students (class_id, student_id, status, joined_at) VALUES (?, ?, ?, ?)')
          .run(classId, student.id, 'active', new Date().toISOString());
    }
    createNotification(student.id, 'student_added', { classId, className: cls.name, teacherId });
    return { ok: true, student: { id: student.id, name: student.name, username: student.username } };
}

function removeStudentFromClass(classId, teacherId, studentId) {
    const cls = db.prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?').get(classId, teacherId);
    if (!cls) return { ok: false, error: 'Clase no encontrada' };
    db.prepare('DELETE FROM class_students WHERE class_id = ? AND student_id = ?').run(classId, studentId);
    return { ok: true };
}

function requestJoinClass(teacherId, studentId) {
    const profile = db.prepare('SELECT * FROM teacher_profiles WHERE teacher_id = ?').get(teacherId);
    if (!profile) return { ok: false, error: 'Profesor no encontrado' };
    const cls = db.prepare('SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at ASC LIMIT 1').get(teacherId);
    if (!cls) return { ok: false, error: 'El profesor no tiene clases activas' };
    const existing = db.prepare('SELECT * FROM class_students WHERE class_id = ? AND student_id = ?').get(cls.id, studentId);
    if (existing) return { ok: false, error: 'Ya enviaste una solicitud o ya estás inscripto' };
    db.prepare('INSERT INTO class_students (class_id, student_id, status, joined_at) VALUES (?, ?, ?, ?)')
      .run(cls.id, studentId, 'pending', new Date().toISOString());
    createNotification(teacherId, 'student_request', { classId: cls.id, studentId });
    return { ok: true };
}

function respondToRequest(classId, teacherId, studentId, accept) {
    const cls = db.prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?').get(classId, teacherId);
    if (!cls) return { ok: false, error: 'Clase no encontrada' };
    if (accept) {
        db.prepare('UPDATE class_students SET status = ? WHERE class_id = ? AND student_id = ?').run('active', classId, studentId);
        createNotification(studentId, 'request_approved', { classId, className: cls.name, teacherId });
    } else {
        db.prepare('DELETE FROM class_students WHERE class_id = ? AND student_id = ?').run(classId, studentId);
        createNotification(studentId, 'request_rejected', { classId, className: cls.name, teacherId });
    }
    return { ok: true };
}

function getStudentEnrollment(studentId) {
    const rows = db.prepare(`
        SELECT cs.class_id, cs.status, c.name, c.target_lang, c.source_lang, c.teacher_id,
               tp.bio, tp.status AS teacher_status, tp.rating, u.name AS teacher_name, u.username AS teacher_username
        FROM class_students cs
        JOIN classes c ON c.id = cs.class_id
        LEFT JOIN teacher_profiles tp ON tp.teacher_id = c.teacher_id
        LEFT JOIN users u ON u.id = c.teacher_id
        WHERE cs.student_id = ? AND cs.status = 'active'
    `).all(studentId);
    return rows;
}

function getClassMessages(classId, limit) {
    return db.prepare(`
        SELECT m.*, u.name AS sender_name, u.username AS sender_username
        FROM classroom_messages m JOIN users u ON u.id = m.sender_id
        WHERE m.class_id = ? AND m.is_private = 0
        ORDER BY m.created_at DESC LIMIT ?
    `).all(classId, limit || 50).reverse();
}

function getDMMessages(classId, userId1, userId2) {
    return db.prepare(`
        SELECT m.*, u.name AS sender_name, u.username AS sender_username
        FROM classroom_messages m JOIN users u ON u.id = m.sender_id
        WHERE m.class_id = ? AND m.is_private = 1
          AND ((m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?))
        ORDER BY m.created_at DESC LIMIT 100
    `).all(classId, userId1, userId2, userId2, userId1).reverse();
}

function sendMessage(classId, senderId, content, isPrivate, recipientId) {
    const id  = `msg_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const now = new Date().toISOString();
    db.prepare('INSERT INTO classroom_messages (id, class_id, sender_id, content, is_private, recipient_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, classId, senderId, content, isPrivate ? 1 : 0, recipientId || null, now);
    // Notify recipient for DM
    if (isPrivate && recipientId) {
        createNotification(recipientId, 'new_message', { classId, senderId, isPrivate: true });
    }
    return db.prepare('SELECT m.*, u.name AS sender_name, u.username AS sender_username FROM classroom_messages m JOIN users u ON u.id = m.sender_id WHERE m.id = ?').get(id);
}

function createNotification(userId, type, payload) {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    db.prepare('INSERT INTO classroom_notifications (id, user_id, type, payload, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, userId, type, JSON.stringify(payload || {}), new Date().toISOString());
}

function getUserNotifications(userId) {
    return db.prepare('SELECT * FROM classroom_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30')
      .all(userId).map(n => ({ ...n, payload: JSON.parse(n.payload || '{}'), is_read: !!n.is_read }));
}

function markNotifRead(notifId, userId) {
    db.prepare('UPDATE classroom_notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(notifId, userId);
}

function getUnreadCount(userId) {
    return db.prepare('SELECT COUNT(*) AS cnt FROM classroom_notifications WHERE user_id = ? AND is_read = 0').get(userId)?.cnt || 0;
}

function _getLastNotifOfType(userId, type) {
    return db.prepare(
        'SELECT created_at FROM classroom_notifications WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1'
    ).get(userId, type);
}

const _DAILY_TIP_AREAS = ['misionmate', 'flashcards', 'traductor', 'famosos'];

function checkScheduledNotifications(userId) {
    const user = db.prepare('SELECT created_at, plan FROM users WHERE id = ?').get(userId);
    if (!user) return;
    const now         = new Date();
    const userCreated = new Date(user.created_at);
    const msSinceReg  = now - userCreated;

    // Daily tip: después de 24h del registro, luego cada 24h
    const lastTip = _getLastNotifOfType(userId, 'daily_tip');
    const tipDue  = lastTip
        ? (now - new Date(lastTip.created_at)) >= 24 * 60 * 60 * 1000
        : msSinceReg >= 24 * 60 * 60 * 1000;
    if (tipDue) {
        const cnt = db.prepare(
            'SELECT COUNT(*) AS c FROM classroom_notifications WHERE user_id = ? AND type = ?'
        ).get(userId, 'daily_tip')?.c || 0;
        createNotification(userId, 'daily_tip', { area: _DAILY_TIP_AREAS[cnt % 4] });
    }

    // Recordatorio de suscripción: cada 3 días, solo usuarios free
    if ((user.plan || 'free') === 'free') {
        const lastRem = _getLastNotifOfType(userId, 'subscription_reminder');
        const remDue  = lastRem
            ? (now - new Date(lastRem.created_at)) >= 3 * 24 * 60 * 60 * 1000
            : msSinceReg >= 3 * 24 * 60 * 60 * 1000;
        if (remDue) createNotification(userId, 'subscription_reminder', {});
    }
}

function rateTeacher(teacherId, studentId, score, comment) {
    const existing = db.prepare('SELECT * FROM teacher_ratings WHERE teacher_id = ? AND student_id = ?').get(teacherId, studentId);
    const now = new Date().toISOString();
    if (existing) {
        db.prepare('UPDATE teacher_ratings SET score = ?, comment = ?, created_at = ? WHERE teacher_id = ? AND student_id = ?')
          .run(score, comment || '', now, teacherId, studentId);
    } else {
        db.prepare('INSERT INTO teacher_ratings (teacher_id, student_id, score, comment, created_at) VALUES (?, ?, ?, ?, ?)')
          .run(teacherId, studentId, score, comment || '', now);
    }
    const agg = db.prepare('SELECT AVG(score) AS avg, COUNT(*) AS cnt FROM teacher_ratings WHERE teacher_id = ?').get(teacherId);
    db.prepare('UPDATE teacher_profiles SET rating = ?, rating_count = ? WHERE teacher_id = ?')
      .run(Math.round((agg.avg || 0) * 10) / 10, agg.cnt, teacherId);
    return { ok: true };
}

function createAnnouncement(classId, teacherId, { title, body, dueDate }) {
    const id  = require('crypto').randomBytes(8).toString('hex');
    const now = new Date().toISOString();
    db.prepare('INSERT INTO class_announcements (id, class_id, teacher_id, title, body, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, classId, teacherId, title, body || '', dueDate || null, now);
    return db.prepare('SELECT * FROM class_announcements WHERE id = ?').get(id);
}

function getAnnouncements(classId) {
    return db.prepare('SELECT * FROM class_announcements WHERE class_id = ? ORDER BY created_at DESC').all(classId);
}

function deleteAnnouncement(id, teacherId) {
    const r = db.prepare('DELETE FROM class_announcements WHERE id = ? AND teacher_id = ?').run(id, teacherId);
    return { ok: r.changes > 0 };
}

function updateUserAdmin(userId, { plan, role, label, permissions, managedRegions, assignedTeacherId }) {
    if (!userId || userId === 'dev') return { ok: false, error: 'No permitido.' };
    const fields = [];
    const vals   = [];
    if (plan               !== undefined) { fields.push('plan = ?');                vals.push(plan); }
    if (role               !== undefined) { fields.push('role = ?');                vals.push(role || null); }
    if (label              !== undefined) { fields.push('label = ?');               vals.push(label || null); }
    if (permissions        !== undefined) { fields.push('permissions = ?');         vals.push(JSON.stringify(permissions || [])); }
    if (managedRegions     !== undefined) { fields.push('managed_regions = ?');     vals.push(JSON.stringify(managedRegions || [])); }
    if (assignedTeacherId  !== undefined) { fields.push('assigned_teacher_id = ?'); vals.push(assignedTeacherId || null); }
    if (!fields.length) return { ok: false, error: 'Nada que actualizar.' };
    vals.push(userId);
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...vals);

    // Si se asigna rol estudiante con un profesor, inscribir automáticamente en la clase del profesor
    if (role === 'estudiante' && assignedTeacherId) {
        const cls = db.prepare('SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at ASC LIMIT 1').get(assignedTeacherId);
        if (cls) {
            const existing = db.prepare('SELECT * FROM class_students WHERE class_id = ? AND student_id = ?').get(cls.id, userId);
            if (!existing) {
                db.prepare('INSERT INTO class_students (class_id, student_id, status, joined_at) VALUES (?, ?, ?, ?)')
                  .run(cls.id, userId, 'active', new Date().toISOString());
            } else if (existing.status !== 'active') {
                db.prepare('UPDATE class_students SET status = ? WHERE class_id = ? AND student_id = ?')
                  .run('active', cls.id, userId);
            }
        }
    }

    return { ok: true };
}

function saveUserLocation(userId, country, region) {
    if (!userId || userId === 'dev') return;
    db.prepare('UPDATE users SET country = ?, region = ? WHERE id = ?').run(country || null, region || null, userId);
}

function getUserByUsername(username) {
    const row = db.prepare('SELECT id, name, username, plan FROM users WHERE LOWER(username) = ?').get(username.toLowerCase());
    return row || null;
}

// ── Bots (SQLite persistence — survives redeploys) ────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS bots (
    id TEXT PRIMARY KEY,
    name TEXT,
    displayName TEXT,
    direction TEXT,
    avatarUrl TEXT,
    prompt TEXT,
    target TEXT DEFAULT 'livefeed',
    schemaType TEXT DEFAULT 'Article',
    quantity INTEGER DEFAULT 1,
    model TEXT DEFAULT 'deepseek-chat',
    schedule TEXT,
    scheduleMode TEXT,
    postsPerDayWeekday INTEGER DEFAULT 2,
    postsPerDayWeekend INTEGER DEFAULT 3,
    enabled INTEGER DEFAULT 1,
    lastRun INTEGER,
    runCount INTEGER DEFAULT 0,
    logs TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS feed_posts (
    id TEXT PRIMARY KEY,
    botId TEXT,
    author TEXT,
    avatar TEXT,
    emoji TEXT,
    title TEXT,
    body TEXT,
    intro TEXT,
    highlight TEXT,
    example TEXT,
    tip TEXT,
    tags TEXT DEFAULT '[]',
    level TEXT,
    lang TEXT DEFAULT 'es',
    teacher TEXT,
    live INTEGER DEFAULT 0,
    ts INTEGER,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    schema TEXT
  );
  CREATE TABLE IF NOT EXISTS scan_history (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    originalText TEXT,
    translatedText TEXT,
    sourceLang TEXT DEFAULT 'auto',
    targetLang TEXT DEFAULT 'es',
    ts INTEGER
  );
  CREATE TABLE IF NOT EXISTS post_likes (
    postId TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    PRIMARY KEY (postId, fingerprint)
  );
  CREATE TABLE IF NOT EXISTS post_comments (
    id TEXT PRIMARY KEY,
    postId TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    author TEXT DEFAULT 'Anónimo',
    text TEXT NOT NULL,
    ts INTEGER
  );
`);

function _botRow(b) {
    return { ...b, enabled: b.enabled === 1, logs: JSON.parse(b.logs || '[]') };
}
function _postRow(p) {
    return { ...p, live: p.live === 1, tags: JSON.parse(p.tags || '[]'), schema: p.schema ? JSON.parse(p.schema) : null };
}

const _upsertBot = db.prepare(`INSERT INTO bots
  (id,name,displayName,direction,avatarUrl,prompt,target,schemaType,quantity,model,
   schedule,scheduleMode,postsPerDayWeekday,postsPerDayWeekend,enabled,lastRun,runCount,logs,created_at)
  VALUES (@id,@name,@displayName,@direction,@avatarUrl,@prompt,@target,@schemaType,@quantity,@model,
          @schedule,@scheduleMode,@postsPerDayWeekday,@postsPerDayWeekend,@enabled,@lastRun,@runCount,@logs,@created_at)
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, displayName=excluded.displayName, direction=excluded.direction,
    avatarUrl=excluded.avatarUrl, prompt=excluded.prompt, target=excluded.target,
    schemaType=excluded.schemaType, quantity=excluded.quantity, model=excluded.model,
    schedule=excluded.schedule, scheduleMode=excluded.scheduleMode,
    postsPerDayWeekday=excluded.postsPerDayWeekday, postsPerDayWeekend=excluded.postsPerDayWeekend,
    enabled=excluded.enabled, lastRun=excluded.lastRun, runCount=excluded.runCount, logs=excluded.logs`);

const _upsertBotTx = db.transaction((bots) => {
    bots.forEach(b => _upsertBot.run({
        id: b.id, name: b.name || null, displayName: b.displayName || null,
        direction: b.direction || null, avatarUrl: b.avatarUrl || null,
        prompt: b.prompt || null, target: b.target || 'livefeed',
        schemaType: b.schemaType || 'Article', quantity: b.quantity || 1,
        model: b.model || 'deepseek-chat', schedule: b.schedule || null,
        scheduleMode: b.scheduleMode || null,
        postsPerDayWeekday: b.postsPerDayWeekday || 2,
        postsPerDayWeekend: b.postsPerDayWeekend || 3,
        enabled: b.enabled ? 1 : 0,
        lastRun: b.lastRun || null, runCount: b.runCount || 0,
        logs: JSON.stringify(b.logs || []),
        created_at: b.created_at || new Date().toISOString()
    }));
});

function dbLoadBots() {
    return db.prepare('SELECT * FROM bots ORDER BY created_at ASC').all().map(_botRow);
}
function dbSaveBots(bots) { _upsertBotTx(bots); }
function dbPatchBot(id, fields) {
    const row = db.prepare('SELECT * FROM bots WHERE id = ?').get(id);
    if (!row) return null;
    const merged = { ..._botRow(row), ...fields };
    _upsertBotTx([merged]);
    return _botRow(db.prepare('SELECT * FROM bots WHERE id = ?').get(id));
}
function dbDeleteBot(id) { db.prepare('DELETE FROM bots WHERE id = ?').run(id); }

const _upsertPost = db.prepare(`INSERT OR REPLACE INTO feed_posts
  (id,botId,author,avatar,emoji,title,body,intro,highlight,example,tip,tags,level,lang,teacher,live,ts,likes,comments,schema)
  VALUES (@id,@botId,@author,@avatar,@emoji,@title,@body,@intro,@highlight,@example,@tip,@tags,@level,@lang,@teacher,@live,@ts,@likes,@comments,@schema)`);

const _upsertPostTx = db.transaction((posts) => {
    posts.forEach(p => _upsertPost.run({
        id: p.id, botId: p.botId || null, author: p.author || null,
        avatar: p.avatar || null, emoji: p.emoji || null,
        title: p.title || null, body: p.body || null,
        intro: p.intro || null, highlight: p.highlight || null,
        example: p.example || null, tip: p.tip || null,
        tags: JSON.stringify(p.tags || []),
        level: p.level || null, lang: p.lang || 'es',
        teacher: p.teacher || null, live: p.live ? 1 : 0,
        ts: p.ts || Date.now(), likes: p.likes || 0, comments: p.comments || 0,
        schema: p.schema ? JSON.stringify(p.schema) : null
    }));
});

function dbLoadFeed(limit = 50, offset = 0) {
    return db.prepare('SELECT * FROM feed_posts ORDER BY ts DESC LIMIT ? OFFSET ?').all(limit, offset).map(_postRow);
}
function dbSavePosts(posts) { _upsertPostTx(posts); }
function dbPatchPost(id, fields) {
    const row = db.prepare('SELECT * FROM feed_posts WHERE id = ?').get(id);
    if (!row) return null;
    const allowed = ['title','body','intro','highlight','example','tip','tags','author','level','lang'];
    const merged = _postRow(row);
    allowed.forEach(k => { if (fields[k] !== undefined) merged[k] = fields[k]; });
    _upsertPostTx([merged]);
    return _postRow(db.prepare('SELECT * FROM feed_posts WHERE id = ?').get(id));
}
function dbDeletePost(id) { db.prepare('DELETE FROM feed_posts WHERE id = ?').run(id); }
function dbLoadPost(id) {
    const row = db.prepare('SELECT * FROM feed_posts WHERE id = ?').get(id);
    return row ? _postRow(row) : null;
}

function dbSaveScan(userId, { originalText, translatedText, sourceLang, targetLang }) {
    const id = `scan_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    db.prepare(`INSERT INTO scan_history (id,userId,originalText,translatedText,sourceLang,targetLang,ts)
                VALUES (?,?,?,?,?,?,?)`).run(id, userId, originalText, translatedText, sourceLang, targetLang, Date.now());
    return id;
}
function dbLoadScans(userId, limit = 50) {
    return db.prepare('SELECT * FROM scan_history WHERE userId=? ORDER BY ts DESC LIMIT ?').all(userId, limit);
}

function updateUserProfile(userId, { name, bio, profilePhoto }) {
    const allowed = {};
    if (name?.trim())            allowed.name          = name.trim().slice(0, 80);
    if (bio  !== undefined)      allowed.bio           = bio  ? bio.trim().slice(0, 300) : null;
    if (profilePhoto !== undefined) allowed.profile_photo = profilePhoto || null;
    if (!Object.keys(allowed).length) return;
    const sets = Object.keys(allowed).map(k => `${k} = ?`).join(', ');
    db.prepare(`UPDATE users SET ${sets} WHERE id = ?`).run(...Object.values(allowed), userId);
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    return row ? _makePublicUser(row) : null;
}

function dbToggleLike(postId, fingerprint) {
    const exists = db.prepare('SELECT 1 FROM post_likes WHERE postId=? AND fingerprint=?').get(postId, fingerprint);
    if (exists) {
        db.prepare('DELETE FROM post_likes WHERE postId=? AND fingerprint=?').run(postId, fingerprint);
        db.prepare('UPDATE feed_posts SET likes = MAX(0, likes-1) WHERE id=?').run(postId);
        return false;
    } else {
        db.prepare('INSERT OR IGNORE INTO post_likes (postId, fingerprint) VALUES (?,?)').run(postId, fingerprint);
        db.prepare('UPDATE feed_posts SET likes = likes+1 WHERE id=?').run(postId);
        return true;
    }
}
function dbGetLikes(postId, fingerprint) {
    const row = db.prepare('SELECT likes FROM feed_posts WHERE id=?').get(postId);
    const liked = fingerprint ? !!db.prepare('SELECT 1 FROM post_likes WHERE postId=? AND fingerprint=?').get(postId, fingerprint) : false;
    return { count: row?.likes || 0, liked };
}

function dbAddComment(postId, fingerprint, author, text) {
    const id = `cmt_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    db.prepare(`INSERT INTO post_comments (id,postId,fingerprint,author,text,ts) VALUES (?,?,?,?,?,?)`).run(id, postId, fingerprint, author, text, Date.now());
    db.prepare('UPDATE feed_posts SET comments = comments+1 WHERE id=?').run(postId);
    return id;
}
function dbGetComments(postId, limit = 50) {
    return db.prepare('SELECT id,author,text,ts FROM post_comments WHERE postId=? ORDER BY ts DESC LIMIT ?').all(postId, limit);
}

// ─── Promotores ───────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS promotor_profiles (
    user_id          TEXT PRIMARY KEY,
    assigned_country TEXT NOT NULL,
    code             TEXT UNIQUE NOT NULL,
    created_at       TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS promotor_referrals (
    id               TEXT PRIMARY KEY,
    promotor_id      TEXT NOT NULL,
    referred_user_id TEXT UNIQUE NOT NULL,
    created_at       TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS promotor_earnings (
    id               TEXT PRIMARY KEY,
    promotor_id      TEXT NOT NULL,
    payer_user_id    TEXT NOT NULL,
    payment_id       TEXT NOT NULL,
    payment_amount   REAL NOT NULL,
    commission_pct   REAL NOT NULL,
    commission_amount REAL NOT NULL,
    stage            INTEGER NOT NULL,
    created_at       TEXT NOT NULL,
    payout_id        TEXT DEFAULT NULL
  );
  CREATE TABLE IF NOT EXISTS promotor_payouts (
    id           TEXT PRIMARY KEY,
    promotor_id  TEXT NOT NULL,
    amount       REAL NOT NULL,
    earning_ids  TEXT NOT NULL,
    paid_at      TEXT NOT NULL,
    admin_id     TEXT NOT NULL,
    note         TEXT DEFAULT NULL
  );
`);

function createPromotorProfile(userId, assignedCountry, code) {
    db.prepare(`INSERT INTO promotor_profiles (user_id, assigned_country, code, created_at)
                VALUES (?, ?, ?, ?)`).run(userId, assignedCountry.toUpperCase(), code.toUpperCase(), new Date().toISOString());
    db.prepare(`UPDATE users SET role = 'promotor' WHERE id = ?`).run(userId);
}

function getPromotorProfile(userId) {
    return db.prepare('SELECT * FROM promotor_profiles WHERE user_id = ?').get(userId);
}

function getPromotorByCode(code) {
    return db.prepare('SELECT * FROM promotor_profiles WHERE code = ?').get(code.toUpperCase());
}

function getPromotorsByCountry(country) {
    return db.prepare('SELECT * FROM promotor_profiles WHERE assigned_country = ? LIMIT 2').all(country.toUpperCase());
}

function addPromotorReferral(promotorId, referredUserId) {
    try {
        const id = `ref_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
        db.prepare(`INSERT INTO promotor_referrals (id, promotor_id, referred_user_id, created_at)
                    VALUES (?, ?, ?, ?)`).run(id, promotorId, referredUserId, new Date().toISOString());
    } catch {}
}

function getPromotorReferralCount(promotorId) {
    return db.prepare('SELECT COUNT(*) AS c FROM promotor_referrals WHERE promotor_id = ?').get(promotorId)?.c || 0;
}

function getPaidMemberCountByCountry(country) {
    return db.prepare(`SELECT COUNT(*) AS c FROM users WHERE country = ? AND plan != 'free'`).get(country)?.c || 0;
}

function savePromotorEarning({ promotorId, payerUserId, paymentId, paymentAmount, commissionPct, stage }) {
    const id = `earn_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const commissionAmount = Math.round(paymentAmount * commissionPct / 100 * 100) / 100;
    db.prepare(`INSERT INTO promotor_earnings
        (id, promotor_id, payer_user_id, payment_id, payment_amount, commission_pct, commission_amount, stage, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, promotorId, payerUserId, paymentId, paymentAmount, commissionPct, commissionAmount, stage, new Date().toISOString());
    return commissionAmount;
}

function calculateAndSaveCommissions(payerUserId, paymentId, paymentAmount, referralCode) {
    const payer = db.prepare('SELECT country FROM users WHERE id = ?').get(payerUserId);
    if (!payer?.country) return;
    const country = payer.country.toUpperCase();

    if (referralCode) {
        const promotor = getPromotorByCode(referralCode);
        if (promotor && promotor.assigned_country === country) {
            const refCount = getPromotorReferralCount(promotor.user_id);
            if (refCount < 20) {
                savePromotorEarning({ promotorId: promotor.user_id, payerUserId, paymentId, paymentAmount, commissionPct: 80, stage: 1 });
                addPromotorReferral(promotor.user_id, payerUserId);
                return;
            }
        }
    }

    const regionPromotors = getPromotorsByCountry(country);
    if (!regionPromotors.length) return;

    const memberCount = getPaidMemberCountByCountry(country);
    let stage, pctEach;

    if (memberCount <= 100) {
        stage = 2;
        pctEach = regionPromotors.length === 1 ? 60 : 30;
    } else if (memberCount <= 300) {
        stage = 3;
        pctEach = regionPromotors.length === 1 ? 50 : 25;
    } else {
        stage = 4;
        pctEach = 8;
    }

    for (const p of regionPromotors) {
        savePromotorEarning({ promotorId: p.user_id, payerUserId, paymentId, paymentAmount, commissionPct: pctEach, stage });
    }
}

function getPromotorEarnings(promotorId, { paid } = {}) {
    const where = paid === true ? 'AND payout_id IS NOT NULL' : paid === false ? 'AND payout_id IS NULL' : '';
    return db.prepare(`SELECT * FROM promotor_earnings WHERE promotor_id = ? ${where} ORDER BY created_at DESC`).all(promotorId);
}

function getPromotorPendingTotal(promotorId) {
    return db.prepare(`SELECT COALESCE(SUM(commission_amount),0) AS total FROM promotor_earnings WHERE promotor_id = ? AND payout_id IS NULL`).get(promotorId)?.total || 0;
}

function createPromotorPayout({ promotorId, amount, earningIds, adminId, note }) {
    const id = `payout_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO promotor_payouts (id, promotor_id, amount, earning_ids, paid_at, admin_id, note)
                VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, promotorId, amount, JSON.stringify(earningIds), now, adminId, note || null);
    if (earningIds?.length) {
        const placeholders = earningIds.map(() => '?').join(',');
        db.prepare(`UPDATE promotor_earnings SET payout_id = ? WHERE id IN (${placeholders})`).run(id, ...earningIds);
    }
    return { id, paid_at: now };
}

function getPromotorPayouts(promotorId) {
    return db.prepare('SELECT * FROM promotor_payouts WHERE promotor_id = ? ORDER BY paid_at DESC').all(promotorId)
        .map(p => ({ ...p, earning_ids: JSON.parse(p.earning_ids || '[]') }));
}

function getAllPromotorsAdmin() {
    const promotors = db.prepare(`
        SELECT pp.*, u.name, u.email, u.plan
        FROM promotor_profiles pp
        JOIN users u ON u.id = pp.user_id
        ORDER BY pp.created_at DESC
    `).all();
    return promotors.map(p => {
        const refCount    = getPromotorReferralCount(p.user_id);
        const memberCount = getPaidMemberCountByCountry(p.assigned_country);
        const pending     = getPromotorPendingTotal(p.user_id);
        const lastPayout  = db.prepare('SELECT paid_at FROM promotor_payouts WHERE promotor_id = ? ORDER BY paid_at DESC LIMIT 1').get(p.user_id);
        return { ...p, referral_count: refCount, region_member_count: memberCount, pending_amount: pending, last_payout_at: lastPayout?.paid_at || null };
    });
}

function getPromotorDashboard(userId) {
    const profile = getPromotorProfile(userId);
    if (!profile) return null;
    const refCount    = getPromotorReferralCount(userId);
    const memberCount = getPaidMemberCountByCountry(profile.assigned_country);
    const pending     = getPromotorPendingTotal(userId);
    const earnings    = getPromotorEarnings(userId);
    const payouts     = getPromotorPayouts(userId);

    let stage = refCount < 20 ? 1 : memberCount <= 100 ? 2 : memberCount <= 300 ? 3 : 4;
    const nextThreshold = stage === 1 ? 20 : stage === 2 ? 100 : stage === 3 ? 300 : null;
    const currentPct = stage === 1 ? 80 : stage === 2 ? (getPromotorsByCountry(profile.assigned_country).length === 1 ? 60 : 30)
                     : stage === 3 ? (getPromotorsByCountry(profile.assigned_country).length === 1 ? 50 : 25) : 8;

    return { profile, stage, currentPct, refCount, memberCount, nextThreshold, pending, earnings, payouts };
}

// ─── User Examples ─────────────────────────────────────────────
function createUserExample({ userId, word, sourceLang, targetLang, exampleText, audioB64, mimeType }) {
    const id = crypto.randomUUID();
    db.prepare(`
        INSERT INTO user_examples (id, user_id, word, source_lang, target_lang, example_text, audio_b64, mime_type, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(id, userId, word, sourceLang, targetLang, exampleText || null, audioB64 || null, mimeType || 'audio/webm', new Date().toISOString());
    return id;
}

function getApprovedExamples(word, sourceLang, targetLang) {
    return db.prepare(`
        SELECT id, user_id, word, source_lang, target_lang, example_text, audio_b64, mime_type, created_at
        FROM user_examples
        WHERE word = ? AND source_lang = ? AND target_lang = ? AND status = 'approved'
        ORDER BY created_at DESC LIMIT 10
    `).all(word, sourceLang, targetLang);
}

function getAdminExamples(status = 'pending', limit = 100) {
    const where = status === 'all' ? '' : `WHERE ue.status = '${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending'}'`;
    return db.prepare(`
        SELECT ue.*, u.name as user_name, u.email as user_email
        FROM user_examples ue
        LEFT JOIN users u ON ue.user_id = u.id
        ${where}
        ORDER BY ue.created_at DESC LIMIT ?
    `).all(limit);
}

function reviewExample(id, status, reviewedBy) {
    db.prepare(`
        UPDATE user_examples SET status = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ?
    `).run(status, new Date().toISOString(), reviewedBy, id);
}

function deleteUserExample(id) {
    db.prepare('DELETE FROM user_examples WHERE id = ?').run(id);
}

module.exports = {
    register, login, loginWithGoogle, verifyToken, optionalAuth, signToken, getUserById, setUserPlan, setClassroomAddon,
    setAuthCookie, clearAuthCookie,
    verifyEmail, createResetToken, resetPassword, deleteUser, getAllUsers, db,
    // Admin user management
    updateUserAdmin, saveUserLocation, getUsersByRegions, saveUILanguage,
    // Classroom
    getTeacherProfile, upsertTeacherProfile, listTeachers,
    createClass, getTeacherClasses, deleteClass,
    addStudentByUsername, removeStudentFromClass,
    requestJoinClass, respondToRequest, getStudentEnrollment,
    getClassMessages, getDMMessages, sendMessage,
    getUserNotifications, markNotifRead, getUnreadCount, createNotification, checkScheduledNotifications,
    rateTeacher, getUserByUsername,
    createAnnouncement, getAnnouncements, deleteAnnouncement,
    // Bots + Feed (SQLite)
    dbLoadBots, dbSaveBots, dbPatchBot, dbDeleteBot,
    dbLoadFeed, dbSavePosts, dbPatchPost, dbDeletePost, dbLoadPost,
    // User profile
    updateUserProfile,
    // Scan history
    dbSaveScan, dbLoadScans,
    // Likes & comments
    dbToggleLike, dbGetLikes, dbAddComment, dbGetComments,
    // User examples
    createUserExample, getApprovedExamples, getAdminExamples, reviewExample, deleteUserExample,
    // Promotores
    createPromotorProfile, getPromotorProfile, getPromotorByCode, getPromotorsByCountry,
    addPromotorReferral, getPromotorReferralCount, getPaidMemberCountByCountry,
    savePromotorEarning, calculateAndSaveCommissions, getPromotorEarnings,
    getPromotorPendingTotal, createPromotorPayout, getPromotorPayouts,
    getAllPromotorsAdmin, getPromotorDashboard,
};
