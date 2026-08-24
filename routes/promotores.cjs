'use strict';
const crypto  = require('crypto');
const authDb  = require('../auth_db.cjs');
const { sendEmail } = require('../lib/email.cjs');

function _isAdmin(req) {
    return req.jwtUser?.isDev === true;
}

function _isPromotor(req) {
    return req.jwtUser?.role === 'promotor';
}

function registerPromotoresRoutes(app) {

    // GET /promotores/me — dashboard del promotor logueado
    app.get('/promotores/me', authDb.verifyToken, (req, res) => {
        if (!_isPromotor(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const data = authDb.getPromotorDashboard(req.jwtUser.id);
        if (!data) return res.status(404).json({ error: 'Perfil de promotor no encontrado.' });
        res.json(data);
    });

    // GET /promotores/me/earnings — historial de comisiones
    app.get('/promotores/me/earnings', authDb.verifyToken, (req, res) => {
        if (!_isPromotor(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const earnings = authDb.getPromotorEarnings(req.jwtUser.id);
        res.json({ earnings });
    });

    // GET /promotores/me/payouts — historial de pagos recibidos
    app.get('/promotores/me/payouts', authDb.verifyToken, (req, res) => {
        if (!_isPromotor(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const payouts = authDb.getPromotorPayouts(req.jwtUser.id);
        res.json({ payouts });
    });

    // GET /promotores/admin/all — admin: lista de todos los promotores
    app.get('/promotores/admin/all', authDb.verifyToken, (req, res) => {
        if (!_isAdmin(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const promotors = authDb.getAllPromotorsAdmin();
        res.json({ promotors });
    });

    // POST /promotores/admin/create — admin: crear perfil de promotor
    app.post('/promotores/admin/create', authDb.verifyToken, (req, res) => {
        if (!_isAdmin(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const { userId, assignedCountry, code } = req.body;
        if (!userId || !assignedCountry || !code) {
            return res.status(400).json({ error: 'userId, assignedCountry y code son requeridos.' });
        }
        try {
            authDb.createPromotorProfile(userId, assignedCountry, code);
            res.json({ ok: true });
        } catch (e) {
            if (e.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Ese código ya existe.' });
            res.status(500).json({ error: e.message });
        }
    });

    // POST /promotores/admin/payout — admin: registrar un pago a un promotor
    app.post('/promotores/admin/payout', authDb.verifyToken, async (req, res) => {
        if (!_isAdmin(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const { promotorId, earningIds, note } = req.body;
        if (!promotorId || !Array.isArray(earningIds) || !earningIds.length) {
            return res.status(400).json({ error: 'promotorId y earningIds son requeridos.' });
        }

        const earnings = authDb.getPromotorEarnings(promotorId, { paid: false });
        const selectedEarnings = earnings.filter(e => earningIds.includes(e.id));
        if (!selectedEarnings.length) return res.status(404).json({ error: 'Sin comisiones pendientes para esos IDs.' });

        const amount = Math.round(selectedEarnings.reduce((s, e) => s + e.commission_amount, 0) * 100) / 100;
        const payout = authDb.createPromotorPayout({ promotorId, amount, earningIds, adminId: req.jwtUser.id, note });

        // Notificación in-app
        authDb.createNotification(promotorId, 'promotor_payout', { amount, paid_at: payout.paid_at, note });

        // Email al promotor
        const user = authDb.getUserById(promotorId);
        if (user?.email) {
            try {
                await sendEmail({
                    to:      user.email,
                    subject: `SenseMate — Pago recibido: $${amount.toFixed(2)}`,
                    html:    _emailPromotorPayout(user.name, amount, payout.paid_at, note),
                });
            } catch (e) {
                console.error('[Promotores] Error enviando email de pago:', e.message);
            }
        }

        res.json({ ok: true, payout_id: payout.id, amount });
    });

    // GET /promotores/admin/dashboard/:promotorId — admin: ver dashboard de un promotor
    app.get('/promotores/admin/dashboard/:promotorId', authDb.verifyToken, (req, res) => {
        if (!_isAdmin(req)) return res.status(403).json({ error: 'Acceso denegado.' });
        const data = authDb.getPromotorDashboard(req.params.promotorId);
        if (!data) return res.status(404).json({ error: 'Promotor no encontrado.' });
        res.json(data);
    });
}

function _emailPromotorPayout(name, amount, paidAt, note) {
    const dateStr = new Date(paidAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f5f7fb;margin:0;padding:2rem">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="text-align:center;margin-bottom:1.5rem">
    <div style="font-size:2rem">📖</div>
    <h1 style="margin:.4rem 0;color:#1e293b;font-size:1.3rem">SenseMate</h1>
  </div>
  <h2 style="color:#1e293b;font-size:1.1rem;margin-bottom:.75rem">¡Pago acreditado, ${name}!</h2>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Se ha registrado un pago a tu cuenta de promotor.</p>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:.75rem;padding:1.25rem;margin:1.25rem 0;text-align:center">
    <div style="font-size:2rem;font-weight:700;color:#15803d">$${amount.toFixed(2)}</div>
    <div style="color:#166534;font-size:.9rem;margin-top:.25rem">${dateStr}</div>
  </div>
  ${note ? `<p style="color:#64748b;font-size:.9rem;margin:.5rem 0"><strong>Nota:</strong> ${note}</p>` : ''}
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Podés ver el detalle en tu área de promotor dentro de la aplicación.</p>
  <p style="color:#94a3b8;font-size:.78rem;border-top:1px solid #e2e8f0;padding-top:1rem;margin-top:1.5rem">Si tenés dudas, contactanos respondiendo este email.</p>
</div></body></html>`;
}

module.exports = { registerPromotoresRoutes };
