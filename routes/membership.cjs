'use strict';
const fs   = require('fs');
const path = require('path');
const express = require('express');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const MEMBERSHIP_CONFIG_FILE  = path.join(__dirname, '..', 'membership_config.json');
const SUBSCRIPTIONS_FILE      = path.join(__dirname, '..', 'subscriptions.json');

const DEFAULT_MEMBERSHIP_CONFIG = {
    promo: {
        active: true,
        maxSubscribers: 250,
        monthlyPrice: 2.00,
        annualPrice: 9.99,
        badge: '🔥 Precio de lanzamiento',
        urgencyText: {
            es: 'Solo para los primeros 250 usuarios',
            en: 'Only for the first 250 users'
        }
    },
    regular: { monthlyPrice: 4.99, annualPrice: 34.99 },
    trialDays: 15,
    planName: { es: 'Premium 250X', en: 'STARTUP FOR 250X' },
    limits: { translationsPerDay: 50, schoolMessages: 10, famousMessages: 5 }
};

function loadMembershipConfig() {
    try {
        if (!fs.existsSync(MEMBERSHIP_CONFIG_FILE)) {
            fs.writeFileSync(MEMBERSHIP_CONFIG_FILE, JSON.stringify(DEFAULT_MEMBERSHIP_CONFIG, null, 2), 'utf8');
            return JSON.parse(JSON.stringify(DEFAULT_MEMBERSHIP_CONFIG));
        }
        return JSON.parse(fs.readFileSync(MEMBERSHIP_CONFIG_FILE, 'utf8'));
    } catch {
        return JSON.parse(JSON.stringify(DEFAULT_MEMBERSHIP_CONFIG));
    }
}

function saveMembershipConfig(config) {
    fs.writeFileSync(MEMBERSHIP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

function loadSubscriptions() {
    try {
        if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
            fs.writeFileSync(SUBSCRIPTIONS_FILE, '[]', 'utf8');
            return [];
        }
        return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveSubscriptions(subs) {
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), 'utf8');
}

function deepMerge(target, source) {
    const result = Object.assign({}, target);
    for (const key of Object.keys(source)) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

const PLAN_PRICES = {
    'promo-anual':            9.99,
    'promo-mensual':          2.00,
    'anual':                  34.99,
    'mensual':                4.99,
    'oro-anual':              29.99,
    'oro-mensual':            4.99,
    'contributor-mensual':    4.99,
    'contributor-trimestral': 10.00,
    'classroom-mensual':      15.00,
    'classroom-anual':        80.00,
};

const PLAN_LABELS = {
    'promo-anual':            'SenseMate Premium – Anual Promo (1er año)',
    'promo-mensual':          'SenseMate Premium – Mensual Promo',
    'anual':                  'SenseMate Premium – Anual',
    'mensual':                'SenseMate Premium – Mensual',
    'oro-anual':              'SenseMate Oro – Anual',
    'oro-mensual':            'SenseMate Oro – Mensual',
    'contributor-mensual':    'SenseMate Contributor – Mensual',
    'contributor-trimestral': 'SenseMate Contributor – Trimestral',
    'classroom-mensual':      'SenseMate ClassRooms – Mensual',
    'classroom-anual':        'SenseMate ClassRooms – Anual',
};

function _tierFromPeriod(period) {
    if (period?.startsWith('oro'))         return 'oro';
    if (period?.startsWith('contributor')) return 'contributor';
    if (period?.startsWith('classroom'))   return 'classroom';
    return 'premium';
}

function _planKey(period, tier) {
    const t = tier || _tierFromPeriod(period);
    const isAnnual = period?.includes('anual') || period === 'annual';
    if (t === 'oro')         return isAnnual ? 'oro_annual'         : 'oro_monthly';
    if (t === 'contributor') return period?.includes('trimestral') ? 'contributor_quarterly' : 'contributor_monthly';
    return isAnnual ? 'premium_annual' : 'premium_monthly';
}

function _upsertSubscription(userId, plan, period, paymentId, type = 'main') {
    const subs     = loadSubscriptions();
    const existing = subs.find(s => s.userId === userId && (s.type || 'main') === type);
    const now      = new Date().toISOString();
    if (existing) {
        Object.assign(existing, { status: 'active', plan, paymentId, updatedAt: now });
    } else {
        subs.push({ id: Date.now().toString(), userId, plan, period, paymentId, status: 'active', subscribedAt: now, type });
    }
    saveSubscriptions(subs);
}

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

module.exports = function registerMembershipRoutes(app, { authDb }) {

    const mpClient = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN,
    });

    function _applyApprovedPayment(ref, paymentId) {
        if (ref.tier === 'classroom') {
            authDb.setClassroomAddon(ref.userId, true, ref.period);
            const classroomPlan = ref.period?.includes('anual') ? 'classroom_annual' : 'classroom_monthly';
            _upsertSubscription(ref.userId, classroomPlan, ref.period, paymentId, 'classroom');
            return classroomPlan;
        }
        const plan = _planKey(ref.period, ref.tier);
        authDb.setUserPlan(ref.userId, plan);
        _upsertSubscription(ref.userId, plan, ref.period, paymentId);
        return plan;
    }

    // GET /membership/config — public
    app.get('/membership/config', (req, res) => {
        const config          = loadMembershipConfig();
        const subscriptions   = loadSubscriptions();
        const subscriberCount = subscriptions.length;
        res.json({ config, subscriberCount });
    });

    // GET /membership/counter — public
    app.get('/membership/counter', (req, res) => {
        const config        = loadMembershipConfig();
        const subscriptions = loadSubscriptions();
        const current       = subscriptions.length;
        const max           = config.promo?.maxSubscribers || 250;
        res.json({ current, max, remaining: Math.max(0, max - current) });
    });

    // POST /membership/subscribe — public
    app.post('/membership/subscribe', (req, res) => {
        const { email, plan, region, period } = req.body;
        if (!email || !plan) {
            return res.status(400).json({ error: 'Email y plan son requeridos' });
        }
        const subscriptions = loadSubscriptions();
        const sub = {
            id:          Date.now().toString(),
            email:       email.trim().toLowerCase(),
            plan,
            region:      region || 'latam',
            period:      period || plan,
            status:      'claimed',
            subscribedAt: new Date().toISOString()
        };
        subscriptions.push(sub);
        saveSubscriptions(subscriptions);
        console.log(`💳 Nueva suscripción: ${sub.email} — ${sub.plan} (${sub.region})`);
        res.json({ ok: true, id: sub.id });
    });

    // GET /admin/membership — admin protected
    app.get('/admin/membership', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const config        = loadMembershipConfig();
        const subscriptions = loadSubscriptions();
        res.json({ config, subscriptions });
    });

    // PUT /admin/membership/config — admin protected
    app.put('/admin/membership/config', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const current = loadMembershipConfig();
        const updated = deepMerge(current, req.body);
        saveMembershipConfig(updated);
        res.json({ ok: true, config: updated });
    });

    // PATCH /admin/membership/subscriptions/:id — admin protected
    app.patch('/admin/membership/subscriptions/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const subs = loadSubscriptions();
        const sub  = subs.find(s => s.id === req.params.id);
        if (!sub) return res.status(404).json({ error: 'No encontrado' });
        if (req.body.status !== undefined) sub.status = req.body.status;
        saveSubscriptions(subs);
        res.json({ ok: true });
    });

    // DELETE /admin/membership/subscriptions/:id — admin protected
    app.delete('/admin/membership/subscriptions/:id', (req, res) => {
        if (!checkAdminToken(req, res)) return;
        const subs    = loadSubscriptions();
        const filtered = subs.filter(s => s.id !== req.params.id);
        if (filtered.length === subs.length) return res.status(404).json({ error: 'No encontrado' });
        saveSubscriptions(filtered);
        res.json({ ok: true });
    });

    // POST /mp/create-preference — crea una preferencia de Checkout Pro
    app.post('/mp/create-preference', authDb.verifyToken, async (req, res) => {
        const { period, userId, userEmail } = req.body;
        const price = PLAN_PRICES[period];
        if (!price) return res.status(400).json({ error: 'Plan inválido.' });

        const APP_URL = process.env.APP_URL || 'http://localhost:3000';
        const isLocalhost = APP_URL.includes('localhost');

        try {
            const preference = new Preference(mpClient);
            const body = {
                items: [{
                    title:       PLAN_LABELS[period] || 'SenseMate Premium',
                    quantity:    1,
                    unit_price:  price,
                    currency_id: 'USD',
                }],
                payer: { email: userEmail || 'guest@sensemate.app' },
                external_reference: JSON.stringify({ userId: req.jwtUser.id, period, tier: _tierFromPeriod(period), referralCode: req.body.referralCode || null }),
            };
            if (!isLocalhost) {
                body.back_urls = {
                    success: `${APP_URL}/mp/success`,
                    failure: `${APP_URL}/mp/failure`,
                    pending: `${APP_URL}/mp/pending`,
                };
                body.auto_return      = 'approved';
                body.notification_url = `${APP_URL}/mp/webhook`;
            }

            const response = await preference.create({ body });
            res.json({ preferenceId: response.id, initPoint: response.init_point, sandboxInitPoint: response.sandbox_init_point });
        } catch (e) {
            console.error('❌ MP create-preference error:', e.message);
            if (e.cause) console.error('   cause:', JSON.stringify(e.cause, null, 2));
            res.status(500).json({ error: 'Error al crear preferencia de pago.', detail: e.message });
        }
    });

    // GET /mp/success — solo redirige; la activación del plan la hace únicamente el webhook IPN
    app.get('/mp/success', (req, res) => {
        res.redirect('/?payment=success');
    });

    // GET /mp/failure
    app.get('/mp/failure', (req, res) => {
        res.redirect('/?payment=failure');
    });

    // GET /mp/pending
    app.get('/mp/pending', (req, res) => {
        res.redirect('/?payment=pending');
    });

    // POST /mp/webhook — notificaciones IPN de MercadoPago
    app.post('/mp/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
        res.status(200).send('OK');

        let notification;
        try {
            notification = JSON.parse(req.body.toString('utf8'));
        } catch { return; }

        const { type, data } = notification;
        if (type !== 'payment') return;
        try {
            const payment     = new Payment(mpClient);
            const paymentData = await payment.get({ id: data.id });
            if (paymentData.status !== 'approved') return;

            const ref = JSON.parse(paymentData.external_reference || '{}');
            if (!ref.userId) return;

            const plan = _applyApprovedPayment(ref, data.id);
            console.log(`✅ MP webhook: usuario ${ref.userId} activado como ${plan}`);

            // Calcular comisiones de promotores
            try {
                const price = PLAN_PRICES[ref.period] || 0;
                authDb.calculateAndSaveCommissions(ref.userId, data.id, price, ref.referralCode || null);
            } catch (ce) {
                console.error('❌ Error calculando comisiones:', ce.message);
            }
        } catch (e) {
            console.error('❌ MP webhook error:', e.message);
        }
    });

    // GET /mp/public-key
    app.get('/mp/public-key', (req, res) => {
        res.json({ publicKey: process.env.MP_PUBLIC_KEY });
    });

};
