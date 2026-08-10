'use strict';
const { OAuth2Client } = require('google-auth-library');
const { sendEmail, _emailReset, _emailVerify, APP_URL } = require('../lib/email.cjs');
const logger = require('../lib/logger.cjs');

module.exports = function registerAuthRoutes(app, { authDb, authLimiter, _detectCountryFromReq, _countryToRegion }) {

    // POST /auth/register
    app.post('/auth/register', authLimiter, async (req, res) => {
        try {
            const result = await authDb.register(req.body);
            if (!result.ok) return res.status(400).json({ error: result.error });

            // Detectar país/región por IP (fire-and-forget)
            _detectCountryFromReq(req).then(code => {
                if (code) authDb.saveUserLocation(result.user.id, code, _countryToRegion(code));
            }).catch(() => {});

            // Enviar email de verificación (no bloquea la respuesta)
            const verifyUrl = `${APP_URL}/auth/verify/${result.verifyToken}`;
            sendEmail({
                to:      result.user.email,
                subject: `¡Bienvenido/a a SenseMate, ${result.user.name}!`,
                html:    _emailVerify(result.user.name, verifyUrl)
            }).catch(e => logger.error('Email bienvenida', { err: e.message }));

            authDb.setAuthCookie(res, result.token);
            res.json({ token: result.token, user: result.user });
        } catch (e) {
            logger.error('/auth/register', { err: e.message });
            res.status(500).json({ error: 'Error al registrar usuario.' });
        }
    });

    // POST /auth/login
    app.post('/auth/login', authLimiter, async (req, res) => {
        try {
            const result = await authDb.login(req.body);
            if (!result.ok) return res.status(401).json({ error: result.error });
            authDb.setAuthCookie(res, result.token);
            res.json({ token: result.token, user: result.user });
        } catch (e) {
            logger.error('/auth/login', { err: e.message });
            res.status(500).json({ error: 'Error al iniciar sesión.' });
        }
    });

    // POST /auth/logout — limpia la cookie httpOnly
    app.post('/auth/logout', (req, res) => {
        authDb.clearAuthCookie(res);
        res.json({ ok: true });
    });

    // GET /auth/me — verifica y renueva la sesión
    app.get('/auth/me', authDb.verifyToken, (req, res) => {
        const user = authDb.getUserById(req.jwtUser.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
        res.json({ user });
    });

    // PUT /auth/profile — update name, bio, profilePhoto
    app.put('/auth/profile', authDb.verifyToken, (req, res) => {
        const { name, bio, profilePhoto } = req.body;
        if (profilePhoto && profilePhoto.length > 200000) {
            return res.status(400).json({ error: 'Imagen demasiado grande.' });
        }
        const updated = authDb.updateUserProfile(req.jwtUser.id, { name, bio, profilePhoto });
        if (!updated) return res.status(404).json({ error: 'Usuario no encontrado.' });
        res.json({ user: updated });
    });

    // PATCH /auth/me/ui-language — guarda el idioma de UI elegido por el usuario
    app.patch('/auth/me/ui-language', authDb.verifyToken, (req, res) => {
        const { lang } = req.body;
        if (!lang || typeof lang !== 'string' || lang.length > 10) {
            return res.status(400).json({ error: 'Idioma inválido.' });
        }
        authDb.saveUILanguage(req.jwtUser.id, lang);
        res.json({ ok: true });
    });

    // GET /auth/verify/:token — verifica el email del usuario
    app.get('/auth/verify/:token', (req, res) => {
        const result = authDb.verifyEmail(req.params.token);
        if (!result.ok) {
            return res.status(400).send(`
                <html><body style="font-family:sans-serif;text-align:center;padding:3rem">
                <h2>❌ ${result.error}</h2>
                <p><a href="/">Volver a SenseMate</a></p>
                </body></html>`);
        }
        res.send(`
            <html><body style="font-family:sans-serif;text-align:center;padding:3rem">
            <h2>✅ ¡Email verificado!</h2>
            <p>Tu cuenta está confirmada. Ya podés usar todas las funciones.</p>
            <a href="/" style="display:inline-block;margin-top:1rem;padding:.6rem 1.4rem;background:#2d6a4f;color:#fff;border-radius:.5rem;text-decoration:none">Ir a SenseMate</a>
            </body></html>`);
    });

    // POST /auth/refresh-token — renueva el JWT con el plan actual del usuario
    app.post('/auth/refresh-token', authDb.verifyToken, (req, res) => {
        const user = authDb.getUserById(req.jwtUser.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
        const token = authDb.signToken(user);
        authDb.setAuthCookie(res, token);
        res.json({ token, user });
    });

    // POST /auth/forgot-password — genera token y envía email de reset
    app.post('/auth/forgot-password', authLimiter, async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email requerido.' });

        const result = await authDb.createResetToken(email.trim().toLowerCase());

        // Siempre responder OK por seguridad (no revelar si el email existe)
        if (result.ok) {
            const resetUrl = `${APP_URL}/?reset_token=${result.token}`;
            sendEmail({
                to:      result.email,
                subject: 'Restablecer contraseña — SenseMate',
                html:    _emailReset(result.name, resetUrl)
            }).catch(e => logger.error('Email reset', { err: e.message }));
            console.log(`🔑 Reset link: ${resetUrl}`);
        }

        res.json({ ok: true });
    });

    // POST /auth/reset-password — valida token y actualiza contraseña
    app.post('/auth/reset-password', authLimiter, async (req, res) => {
        const { token, password } = req.body;
        const result = await authDb.resetPassword(token, password);
        if (!result.ok) return res.status(400).json({ error: result.error });
        res.json({ ok: true });
    });

    // POST /auth/google — login/registro con Google
    app.post('/auth/google', authLimiter, async (req, res) => {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ error: 'Token de Google requerido.' });
        if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ error: 'Google login no configurado.' });
        try {
            const client  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket  = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            const result  = await authDb.loginWithGoogle({ googleId: payload.sub, email: payload.email, name: payload.name });
            // Detectar región en registro nuevo (isNew = primer login con Google)
            if (result.user?.isNew) {
                _detectCountryFromReq(req).then(code => {
                    if (code) authDb.saveUserLocation(result.user.id, code, _countryToRegion(code));
                }).catch(() => {});
            }
            authDb.setAuthCookie(res, result.token);
            res.json({ token: result.token, user: result.user });
        } catch (e) {
            console.error('❌ /auth/google:', e.message, e.stack?.split('\n')[1]);
            const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
            res.status(401).json({ error: isDev ? e.message : 'Token de Google inválido.' });
        }
    });

    // DELETE /auth/account — elimina la cuenta del usuario autenticado
    app.delete('/auth/account', authDb.verifyToken, (req, res) => {
        const result = authDb.deleteUser(req.jwtUser.id);
        if (!result.ok) return res.status(400).json({ error: result.error });
        res.json({ ok: true });
    });

    // GET /admin/users?page=1&limit=50 — admin: lista usuarios paginados
    app.get('/admin/users', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        res.json(authDb.getAllUsers({ page: req.query.page, limit: req.query.limit }));
    });

    // PATCH /admin/users/:id — admin: actualiza plan, rol, etiqueta, permisos, regiones gestionadas
    app.patch('/admin/users/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const { plan, role, label, permissions, managedRegions, assignedTeacherId } = req.body;
        const result = authDb.updateUserAdmin(req.params.id, { plan, role, label, permissions, managedRegions, assignedTeacherId });
        res.json(result);
    });

    // GET /admin/users/region — gestor regional: solo usuarios de sus regiones
    app.get('/admin/users/region', authDb.verifyToken, (req, res) => {
        const user = authDb.getUserById(req.jwtUser.id);
        if (!user) return res.status(401).json({ error: 'No autorizado' });
        const perms = Array.isArray(user.permissions) ? user.permissions : JSON.parse(user.permissions || '[]');
        if (!perms.includes('manage_users_region') && !user.isDev) {
            return res.status(403).json({ error: 'Sin permiso para gestionar usuarios por región' });
        }
        const regions = Array.isArray(user.managed_regions)
            ? user.managed_regions
            : JSON.parse(user.managed_regions || '[]');
        const users = authDb.getUsersByRegions(regions);
        res.json({ users, regions });
    });

    // GET /auth/admin-token — entrega ADMIN_TOKEN solo a usuarios isDev autenticados
    app.get('/auth/admin-token', authDb.verifyToken, (req, res) => {
        if (!req.jwtUser?.isDev) return res.status(403).json({ error: 'Acceso denegado' });
        const token = process.env.ADMIN_TOKEN;
        if (!token) return res.status(503).json({ error: 'Servicio de administración no configurado.' });
        res.json({ token });
    });

};

// Note: checkAdminToken is defined in content.cjs and used for /admin/users here too,
// but since auth.cjs also needs it for /admin/users, we define a local copy.
// The ADMIN_TOKEN is the same env var.
function checkAdminToken(req, res) {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
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
