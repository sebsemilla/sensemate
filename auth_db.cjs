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
    verify_token   TEXT
  );
`);

// Migrations para usuarios existentes
try { db.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN verify_token TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN reset_token TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN reset_token_expires TEXT`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE`); } catch {}

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
    return db.prepare('SELECT id, name, username, email, preferred_lang, is_dev, plan, email_verified, created_at FROM users').all()
        .map(r => ({ ...r, isDev: !!r.is_dev, emailVerified: !!r.email_verified }));
}

module.exports = { register, login, loginWithGoogle, verifyToken, signToken, getUserById, setUserPlan, verifyEmail, createResetToken, resetPassword, deleteUser, getAllUsers, db };
