// translate_locales.mjs — Usa DeepL API Free
// ============================================
// 1. Registrate en https://www.deepl.com/pro-api (gratis, no cobra)
// 2. Copiá tu API key desde Account → API Keys
// 3. Pegala abajo en DEEPL_API_KEY
// 4. Ejecutá: node translate_locales.mjs

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── PEGÁ TU KEY AQUÍ ─────────────────────────────────────────
const DEEPL_API_KEY = '68a56213-3973-4e3d-973b-89fb0805dbb4:fx';
// ─────────────────────────────────────────────────────────────

// DeepL Free usa api-free.deepl.com (con -free al final)
// DeepL Pro usa api.deepl.com (sin -free)
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate';

const SOURCE_FILE = join(__dir, 'locales', 'es.json');
const LOCALES_DIR = join(__dir, 'locales');

// Idiomas destino con sus códigos DeepL
// Referencia completa: https://developers.deepl.com/docs/resources/supported-languages
const TARGET_LANGS = [
    { code: 'en', deepl: 'EN-US',  name: 'English'    },
    { code: 'fr', deepl: 'FR',     name: 'French'     },
    { code: 'de', deepl: 'DE',     name: 'German'     },
    { code: 'it', deepl: 'IT',     name: 'Italian'    },
    { code: 'pt', deepl: 'PT-BR',  name: 'Portuguese' },
    { code: 'zh', deepl: 'ZH',     name: 'Chinese'    },
    { code: 'ja', deepl: 'JA',     name: 'Japanese'   },
    { code: 'ru', deepl: 'RU',     name: 'Russian'    },
    { code: 'ar', deepl: 'AR',     name: 'Arabic'     },
    { code: 'ko', deepl: 'KO',     name: 'Korean'     },
    { code: 'nl', deepl: 'NL',     name: 'Dutch'      },
    { code: 'pl', deepl: 'PL',     name: 'Polish'     },
    { code: 'tr', deepl: 'TR',     name: 'Turkish'    },
];

// Keys que NO se traducen (nombres propios, valores técnicos)
const SKIP_KEYS = new Set([
    'app_name', 'appName',
    'famous_mlk', 'famous_marilyn', 'famous_maradona', 'diego_maradona',
    'default_famous_intro',
]);

// ─────────────────────────────────────────────────────────────

function loadSource() {
    if (!existsSync(SOURCE_FILE)) {
        console.error(`❌ No se encontró ${SOURCE_FILE}`);
        process.exit(1);
    }
    return JSON.parse(readFileSync(SOURCE_FILE, 'utf-8'));
}

// DeepL acepta hasta 50 textos por llamada
function chunkArray(arr, size = 50) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

async function translateBatch(texts, targetDeepL, isFirst = false) {
    const body = new URLSearchParams();
    body.append('source_lang', 'ES');
    body.append('target_lang', targetDeepL);
    texts.forEach(t => body.append('text', t));

    const res = await fetch(DEEPL_URL, {
        method:  'POST',
        headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type':  'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`DeepL error ${res.status}: ${err}`);
    }

    const data   = await res.json();
    const result = data.translations.map(t => t.text);

    // Log de verificacion en el primer lote del primer idioma
    if (isFirst) {
        // Buscar "bienvenidos" en el lote para la muestra de verificacion
        const idx = texts.findIndex(t => t.includes('Bienvenidos') || t.includes('bienvenidos'));
        const i   = idx >= 0 ? idx : 0;
        console.log('   Muestra: "' + texts[i] + '" -> "' + result[i] + '"');
    }

    return result;
}

async function translateLanguage(source, lang) {
    console.log(`\n🌐 Traduciendo a ${lang.name} (${lang.code})...`);

    // Separar qué se traduce y qué se copia
    const keys          = Object.keys(source);
    const toTranslate   = [];   // { key, value }
    const output        = {};

    for (const key of keys) {
        const val = source[key];
        if (SKIP_KEYS.has(key) || !val || typeof val !== 'string' || val.trim() === '') {
            output[key] = val; // copiar tal cual
        } else {
            toTranslate.push({ key, value: val });
        }
    }

    // Enviar en lotes de 50
    const valueChunks = chunkArray(toTranslate.map(e => e.value), 50);
    const keyChunks   = chunkArray(toTranslate.map(e => e.key),   50);
    const translated   = {};

    for (let i = 0; i < valueChunks.length; i++) {
        process.stdout.write(`   Lote ${i + 1}/${valueChunks.length}... `);
        const results = await translateBatch(valueChunks[i], lang.deepl, i === 0 && lang.code === 'en');
        keyChunks[i].forEach((key, j) => { translated[key] = results[j]; });
        console.log('✓');

        // Pausa mínima entre lotes
        if (i < valueChunks.length - 1) await new Promise(r => setTimeout(r, 300));
    }

    // Reconstruir en el orden original
    for (const key of keys) {
        output[key] = translated[key] ?? output[key] ?? source[key];
    }

    return output;
}

async function checkUsage() {
    const res = await fetch('https://api-free.deepl.com/v2/usage', {
        headers: { 'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}` }
    });
    if (!res.ok) return;
    const { character_count, character_limit } = await res.json();
    const pct = ((character_count / character_limit) * 100).toFixed(1);
    console.log(`📊 Uso DeepL: ${character_count.toLocaleString()} / ${character_limit.toLocaleString()} caracteres (${pct}%)\n`);
}

async function main() {
    if (DEEPL_API_KEY === 'TU_DEEPL_KEY_AQUI') {
        console.error('❌ Pegá tu DeepL API key en la variable DEEPL_API_KEY del script.');
        process.exit(1);
    }

    console.log('🚀 LinguaSense — Generador de locales con DeepL\n');
    await checkUsage();

    const source = loadSource();
    console.log(`📋 ${Object.keys(source).length} keys en es.json`);

    for (const lang of TARGET_LANGS) {
        try {
            const translated = await translateLanguage(source, lang);
            const outPath    = join(LOCALES_DIR, `${lang.code}.json`);
            writeFileSync(outPath, JSON.stringify(translated, null, 2) + '\n', 'utf-8');
            console.log(`   ✅ Guardado: locales/${lang.code}.json`);
        } catch (err) {
            console.error(`   ❌ Error en ${lang.name}: ${err.message}`);
        }
    }

    console.log('\n');
    await checkUsage(); // Mostrar cuánto se consumió al final
    console.log('🎉 ¡Listo!\n');
}

main();
