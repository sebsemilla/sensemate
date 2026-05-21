// auth_db.cjs — Auth con SQLite + bcrypt + JWT
// =============================================

'use strict';

const Database = require('better-sqlite3');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const path     = require('path');

const DB_PATH      = path.join(__dirname, 'lingua_users.db');
const SALT_ROUNDS  = 12;
const JWT_SECRET   = process.env.JWT_SECRET || 'lingua_dev_secret_change_in_prod';
const JWT_EXPIRES  = '30d';
const DEV_PASSWORD = 'dev2025';

// ─── DB init ──────────────────────────────────────────────────

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    username    TEXT UNIQUE,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    preferred_lang TEXT DEFAULT 'es',
    is_dev      INTEGER DEFAULT 0,
    plan        TEXT DEFAULT 'free',
    created_at  TEXT NOT NULL
  );
`);

// Seed admin user (sebas_dev1245) if not exists
function seedAdminUser() {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('sebas_dev1245');
    if (existing) return;
    const hashed = bcrypt.hashSync(DEV_PASSWORD, SALT_ROUNDS);
    db.prepare(`
        INSERT OR IGNORE INTO users (id, name, username, email, password, preferred_lang, is_dev, plan, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    };
}

function _signToken(user) {
    return jwt.sign(
        { id: user.id, isDev: !!user.is_dev, plan: user.plan || 'free' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
}

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

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const id     = Date.now().toString();
    const now    = new Date().toISOString();

    db.prepare(`
        INSERT INTO users (id, name, username, email, password, preferred_lang, is_dev, plan, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, 'free', ?)
    `).run(id, name.trim(), trimUsername, trimEmail, hashed, preferredLang || 'es', now);

    const row   = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const pub   = _makePublicUser(row);
    const token = _signToken(row);

    return { ok: true, token, user: { ...pub, isNew: true } };
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
    if (id === 'dev') return { id: 'dev', name: 'Dev User', username: null, email: 'dev@test.com', preferredLang: 'es', isDev: true, plan: 'premium' };
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row ? _makePublicUser(row) : null;
}

// ─── Update plan (called when membership confirmed) ──────────

function setUserPlan(userId, plan) {
    if (userId === 'dev') return;
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, userId);
}

// ─── Get all users (admin) ────────────────────────────────────

function getAllUsers() {
    return db.prepare('SELECT id, name, username, email, preferred_lang, is_dev, plan, created_at FROM users').all()
        .map(r => ({ ...r, isDev: !!r.is_dev }));
}

module.exports = { register, login, verifyToken, getUserById, setUserPlan, getAllUsers, db };
