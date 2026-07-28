'use strict';
const { Resend } = require('resend');

const APP_URL    = process.env.APP_URL    || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || 'SenseMate <noreply@sensemate.app>';

let _resendClient = null;
function _mailer() {
    if (!_resendClient && process.env.RESEND_API_KEY) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

async function sendEmail({ to, subject, html }) {
    const mailer = _mailer();
    if (!mailer) {
        console.log(`📧 [SIN RESEND] Para: ${to} | ${subject}`);
        return { ok: true };
    }
    const { data, error } = await mailer.emails.send({ from: EMAIL_FROM, to, subject, html });
    if (error) throw new Error(error.message);
    return { ok: true, id: data?.id };
}

function _emailReset(name, resetUrl) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f5f7fb;margin:0;padding:2rem">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="text-align:center;margin-bottom:1.5rem">
    <div style="font-size:2rem">📖</div>
    <h1 style="margin:.4rem 0;color:#1e293b;font-size:1.3rem">SenseMate</h1>
  </div>
  <h2 style="color:#1e293b;font-size:1.05rem;margin-bottom:.75rem">Restablecer contraseña</h2>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Hola <strong>${name}</strong>, recibiste este email porque solicitaste restablecer tu contraseña en SenseMate.</p>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Hacé clic en el botón — el enlace expira en <strong>1 hora</strong>.</p>
  <div style="text-align:center;margin:1.75rem 0">
    <a href="${resetUrl}" style="display:inline-block;padding:.75rem 1.75rem;background:#2d6a4f;color:#fff;border-radius:.5rem;text-decoration:none;font-weight:600;font-size:1rem">Restablecer contraseña</a>
  </div>
  <p style="color:#94a3b8;font-size:.78rem;border-top:1px solid #e2e8f0;padding-top:1rem;margin-top:1.5rem">Si no solicitaste esto, ignorá este email. Tu contraseña no cambiará.</p>
</div></body></html>`;
}

function _emailVerify(name, verifyUrl) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f5f7fb;margin:0;padding:2rem">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="text-align:center;margin-bottom:1.5rem">
    <div style="font-size:2rem">📖</div>
    <h1 style="margin:.4rem 0;color:#1e293b;font-size:1.3rem">SenseMate</h1>
  </div>
  <h2 style="color:#1e293b;font-size:1.05rem;margin-bottom:.75rem">¡Bienvenido/a, ${name}! 🎉</h2>
  <p style="color:#475569;line-height:1.6;margin:.5rem 0">Gracias por registrarte. Verificá tu email para confirmar tu cuenta.</p>
  <div style="text-align:center;margin:1.75rem 0">
    <a href="${verifyUrl}" style="display:inline-block;padding:.75rem 1.75rem;background:#2d6a4f;color:#fff;border-radius:.5rem;text-decoration:none;font-weight:600;font-size:1rem">Verificar email</a>
  </div>
  <p style="color:#94a3b8;font-size:.78rem;border-top:1px solid #e2e8f0;padding-top:1rem;margin-top:1.5rem">Si no creaste una cuenta en SenseMate, ignorá este email.</p>
</div></body></html>`;
}

module.exports = { sendEmail, _emailReset, _emailVerify, APP_URL, EMAIL_FROM };
