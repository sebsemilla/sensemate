'use strict';

// Logger centralizado — reemplaza console.log disperso.
// En producción podría swapear por Winston/Pino sin cambiar los call sites.

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_TEST = process.env.NODE_ENV === 'test';

function _fmt(level, msg, meta) {
    const ts = new Date().toISOString();
    const base = `[${ts}] ${level.toUpperCase()} ${msg}`;
    return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

const logger = {
    info(msg, meta)  { if (!IS_TEST) console.log(_fmt('info',  msg, meta)); },
    warn(msg, meta)  { console.warn(_fmt('warn',  msg, meta)); },
    error(msg, meta) { console.error(_fmt('error', msg, meta)); },
    // debug solo visible fuera de producción
    debug(msg, meta) { if (!IS_PROD && !IS_TEST) console.log(_fmt('debug', msg, meta)); },
};

module.exports = logger;
