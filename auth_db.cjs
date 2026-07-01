// auth_db.cjs — Auth con SQLite + bcrypt + JWT
// =============================================

'use strict';

const Database = require('better-sqlite3');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const crypto   = require('crypto');

const DB_PATH      = process.env.DB_PATH || path.join(__dirname, 'lingua_users.db');
const SALT_ROUNDS  = 12;
const JWT_SECRET   = process.env.JWT_SECRET || 'lingua_dev_secret_change_in_prod';
const JWT_EXPIRES  = '30d';
const DEV_PASSWORD = 'dev2025';

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

// Seed admin user (sebas_dev1245) if not exists
function seedAdminUser() {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('sebas_dev1245');
    if (existing) {
        // Asegurar que el admin siempre esté verificado
        db.prepare('UPDATE users SET email_verified = 1 WHERE username = ?').run('sebas_dev1245');
        return;
    }
    const hashed = bcrypt.hashSync(DEV_PASSWORD, SALT_ROUNDS);
    db.prepare(`
        INSERT OR IGNORE INTO users (id, name, username, email, password, preferred_lang, is_dev, plan, created_at, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run('sebas_admin', 'Sebas', 'sebas_dev1245', 'sebas@sensemate.dev', hashed, 'es', 1, 'premium', new Date().toISOString());
    console.log('✅ Admin user sebas_dev1245 seeded in DB');
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
    };
}

function _signToken(user) {
    return jwt.sign(
        { id: user.id, isDev: !!user.is_dev, plan: user.plan || 'free' },
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

    console.log(`📧 Verify token for ${trimEmail}: /auth/verify/${verifyToken}`);

    const row   = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const pub   = _makePublicUser(row);
    const token = _signToken(row);

    return { ok: true, token, user: { ...pub, isNew: true }, verifyToken };
}

// ─── Login ───────────────────────────────────────────────────

async function login({ email, password }) {
    const identifier = (email || '').trim().toLowerCase();

    // 🔧 Dev bypass: any email/username + 'dev2025'
    if (password === DEV_PASSWORD) {
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

// ─── Verify JWT middleware ────────────────────────────────────

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token      = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No autenticado.' });
    try {
        req.jwtUser = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Sesión expirada o inválida. Volvé a iniciar sesión.' });
    }
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
    console.log(`✅ Email verificado: ${row.email}`);
    return { ok: true };
}

// ─── Get all users (admin) ────────────────────────────────────

function getAllUsers() {
    return db.prepare('SELECT id, name, username, email, preferred_lang, is_dev, plan, email_verified, created_at, role, label, permissions, country, region, managed_regions FROM users').all()
        .map(r => ({
            ...r,
            isDev:          !!r.is_dev,
            emailVerified:  !!r.email_verified,
            permissions:    JSON.parse(r.permissions    || '[]'),
            managed_regions: JSON.parse(r.managed_regions || '[]'),
        }));
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

function updateUserAdmin(userId, { plan, role, label, permissions, managedRegions }) {
    if (!userId || userId === 'dev') return { ok: false, error: 'No permitido.' };
    const fields = [];
    const vals   = [];
    if (plan           !== undefined) { fields.push('plan = ?');            vals.push(plan); }
    if (role           !== undefined) { fields.push('role = ?');            vals.push(role || null); }
    if (label          !== undefined) { fields.push('label = ?');           vals.push(label || null); }
    if (permissions    !== undefined) { fields.push('permissions = ?');     vals.push(JSON.stringify(permissions || [])); }
    if (managedRegions !== undefined) { fields.push('managed_regions = ?'); vals.push(JSON.stringify(managedRegions || [])); }
    if (!fields.length) return { ok: false, error: 'Nada que actualizar.' };
    vals.push(userId);
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
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

module.exports = {
    register, login, loginWithGoogle, verifyToken, signToken, getUserById, setUserPlan,
    verifyEmail, createResetToken, resetPassword, deleteUser, getAllUsers, db,
    // Admin user management
    updateUserAdmin, saveUserLocation, getUsersByRegions,
    // Classroom
    getTeacherProfile, upsertTeacherProfile, listTeachers,
    createClass, getTeacherClasses, deleteClass,
    addStudentByUsername, removeStudentFromClass,
    requestJoinClass, respondToRequest, getStudentEnrollment,
    getClassMessages, getDMMessages, sendMessage,
    getUserNotifications, markNotifRead, getUnreadCount, createNotification,
    rateTeacher, getUserByUsername,
};
