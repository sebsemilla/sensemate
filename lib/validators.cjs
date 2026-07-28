'use strict';

// ─── Validación de inputs para endpoints de IA ────────────────
// Previene token abuse, prompt injection en lang codes y arrays sin límite.

const MAX_TRANSLATE_CHARS  = 1000;
const MAX_PARAGRAPH_CHARS  = 4000;
const MAX_SPEAK_CHARS      = 600;
const MAX_SYNONYM_CHARS    = 300;
const MAX_WORD_CHARS       = 200;
const MAX_MESSAGES         = 25;
const MAX_MSG_CONTENT      = 4000;

// Código de idioma válido: 2-5 letras minúsculas (evita inyección en prompts)
function _validLang(code) {
    return !code || (typeof code === 'string' && /^[a-z]{2,5}$/.test(code));
}

// Valida array de mensajes para endpoints de chat
function _validMessages(msgs, max = MAX_MESSAGES) {
    if (!Array.isArray(msgs) || msgs.length === 0) return 'Falta el historial de mensajes.';
    if (msgs.length > max) return `El historial no puede superar ${max} mensajes.`;
    const invalid = msgs.some(m => !m || typeof m.role !== 'string' || typeof m.content !== 'string' || m.content.length > MAX_MSG_CONTENT);
    if (invalid) return 'Formato de mensajes inválido o mensaje demasiado largo.';
    return null;
}

// Recorta y valida longitud de texto; devuelve { ok, error, value }
function _validText(value, max, fieldName = 'texto') {
    if (!value || typeof value !== 'string' || !value.trim()) return { ok: false, error: `Falta el ${fieldName}.` };
    const trimmed = value.trim();
    if (trimmed.length > max) return { ok: false, error: `El ${fieldName} no puede superar ${max} caracteres.` };
    return { ok: true, value: trimmed };
}

// Valida formato de email básico
function _validEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

module.exports = {
    MAX_TRANSLATE_CHARS,
    MAX_PARAGRAPH_CHARS,
    MAX_SPEAK_CHARS,
    MAX_SYNONYM_CHARS,
    MAX_WORD_CHARS,
    MAX_MESSAGES,
    MAX_MSG_CONTENT,
    _validLang,
    _validMessages,
    _validText,
    _validEmail,
};
