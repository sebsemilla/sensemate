'use strict';
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Identifica al usuario por JWT (si está logueado) o por IP (invitados)
function _rlKeyGenerator(req) {
    const auth = req.headers['authorization'];
    if (auth?.startsWith('Bearer ')) {
        try {
            const jwt     = require('jsonwebtoken');
            const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
            // Dev users no tienen límite
            if (payload.isDev) return `dev_bypass_${payload.id}`;
            return `user_${payload.id}`;
        } catch { /* token inválido — cae a IP */ }
    }
    return ipKeyGenerator(req); // maneja IPv6 correctamente
}

function _skipDev(req) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) return false;
    try {
        const jwt     = require('jsonwebtoken');
        const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
        return !!payload.isDev;
    } catch { return false; }
}

// Traducción: 30 requests / 10 minutos por usuario
const translateLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,
    max:              30,
    keyGenerator:     _rlKeyGenerator,
    skip:             _skipDev,
    standardHeaders:  'draft-7',
    legacyHeaders:    false,
    message:          { error: 'Demasiadas traducciones. Esperá unos minutos antes de continuar.' },
});

// Chat (tutor + famosos): 40 requests / 10 minutos por usuario
const chatLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,
    max:              40,
    keyGenerator:     _rlKeyGenerator,
    skip:             _skipDev,
    standardHeaders:  'draft-7',
    legacyHeaders:    false,
    message:          { error: 'Demasiados mensajes seguidos. Esperá unos minutos.' },
});

// TTS (voz): 20 requests / 10 minutos — más caro computacionalmente
const ttsLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,
    max:              20,
    keyGenerator:     _rlKeyGenerator,
    skip:             _skipDev,
    standardHeaders:  'draft-7',
    legacyHeaders:    false,
    message:          { error: 'Demasiadas solicitudes de voz. Esperá unos minutos.' },
});

// Auth: 10 intentos / 15 minutos por IP — protege contra brute force
const authLimiter = rateLimit({
    windowMs:        15 * 60 * 1000,
    max:             10,
    keyGenerator:    ipKeyGenerator,
    standardHeaders: 'draft-7',
    legacyHeaders:   false,
    message:         { error: 'Demasiados intentos. Esperá 15 minutos.' },
});

// Admin: 200 requests / minuto por IP — protege contra brute force sin bloquear uso legítimo del panel
const adminLimiter = rateLimit({
    windowMs:        60 * 1000,
    max:             200,
    keyGenerator:    ipKeyGenerator,
    standardHeaders: 'draft-7',
    legacyHeaders:   false,
    message:         { error: 'Demasiados intentos admin. Esperá un minuto.' },
});

module.exports = { translateLimiter, chatLimiter, ttsLimiter, authLimiter, adminLimiter };
