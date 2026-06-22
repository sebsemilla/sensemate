// auth.js — Autenticación via API (JWT + SQLite backend)
// ======================================================

const _SESSION_KEY  = 'ls_session';   // guarda { token, user } — NO datos sensibles
const _OB_SEEN_KEY  = 'ls_onboarding_seen';
const API_BASE      = window.location.hostname === 'localhost'
    ? `http://localhost:3000`
    : window.location.origin;

// ─── Helpers internos ─────────────────────────────────────────

function _getToken() {
    try {
        const s = JSON.parse(localStorage.getItem(_SESSION_KEY) || 'null');
        return s?.token || null;
    } catch { return null; }
}

function _setSession(token, user) {
    // Solo guardamos el token y datos NO sensibles (sin password, sin hash)
    localStorage.setItem(_SESSION_KEY, JSON.stringify({ token, user }));
    return user;
}

function _clearSession() {
    localStorage.removeItem(_SESSION_KEY);
}

// ─── API pública ──────────────────────────────────────────────

async function authRegister({ name, username, email, password, preferredLang }) {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, email, password, preferredLang }),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data.error || 'Error al registrar.' };
        _setSession(data.token, data.user);
        return { ok: true, user: data.user };
    } catch {
        return { ok: false, error: 'No se pudo conectar con el servidor.' };
    }
}

async function authLogin({ email, password }) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data.error || 'Credenciales incorrectas.' };
        _setSession(data.token, data.user);
        return { ok: true, user: data.user };
    } catch {
        return { ok: false, error: 'No se pudo conectar con el servidor.' };
    }
}

function authLogout() {
    _clearSession();
}

function authGetCurrentUser() {
    try {
        const s = JSON.parse(localStorage.getItem(_SESSION_KEY) || 'null');
        return s?.user || null;
    } catch { return null; }
}

function authIsLoggedIn() {
    return !!_getToken();
}

// Verifica con el servidor que el token sigue siendo válido.
// Actualiza la sesión local si el usuario cambió (plan, etc.).
async function authVerifySession() {
    const token = _getToken();
    if (!token) return null;
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            _clearSession();
            return null;
        }
        const data = await res.json();
        // Refresh the stored user with latest data from server
        _setSession(token, data.user);
        return data.user;
    } catch {
        // Server down — keep local session, don't force logout
        return authGetCurrentUser();
    }
}

// Devuelve el token JWT para incluirlo en requests al backend
function authGetToken() {
    return _getToken();
}

// Guarda una sesión recibida externamente (ej: Google login)
function authSetSession(token, user) {
    return _setSession(token, user);
}

function authMarkOnboardingSeen() {
    localStorage.setItem(_OB_SEEN_KEY, '1');
}

function authHasSeenOnboarding() {
    return localStorage.getItem(_OB_SEEN_KEY) === '1';
}

// Compatibilidad: authSeedAdminUser ya no necesita hacer nada en el frontend,
// el seed lo hace auth_db.cjs al arrancar el servidor.
function authSeedAdminUser() {}
