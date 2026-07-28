'use strict';
const { CohereClientV2 } = require('cohere-ai');

// --- Función para traducir con Cohere ---
async function translateWithCohere(text, targetLang, sourceLang, context = '') {
    console.log(`🟢 translateWithCohere: texto="${text}", source=${sourceLang}, target=${targetLang}${context ? `, contexto="${context}"` : ''}`);

    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

    const systemPrompt = `
Eres un experto en lingüística y traducción contextual.
Traduce el siguiente texto del idioma "${sourceLang || 'desconocido'}" al idioma "${targetLang}".

Responde ÚNICAMENTE con un objeto JSON válido, sin ningún texto adicional, sin bloques de código, sin explicaciones.
El objeto debe tener exactamente esta estructura:

{
  "correction": {
    "hadErrors": true o false — si el texto original tenía errores de ortografía o tipeo evidentes,
    "correctedText": "el texto original con esos errores corregidos, en el idioma '${sourceLang || 'desconocido'}'. Si hadErrors es false, repetí el texto original tal cual."
  },
  "formal": "traducción en tono formal (negocios, autoridades)",
  "informal": "traducción en tono informal (amigos, familia)",
  "neutral": "traducción neutra (ni formal ni coloquial)",
  "lexical": {
    "type": "categoría gramatical abreviada. Usa exactamente una de estas: sust. | vbo. | adj. | adv. | prep. | pron. | conj. | expr. | frase",
    "details": "detalle gramatical específico. Ejemplos: 'verbo transitivo, presente simple' | 'sustantivo masculino, plural' | 'adjetivo calificativo' | 'expresión idiomática' | 'pronombre personal de 3ª persona'",
    "examples": [
      { "source": "oración de ejemplo en ${sourceLang} usando el texto original en contexto diferente", "target": "su traducción al ${targetLang}" },
      { "source": "segundo ejemplo en ${sourceLang}", "target": "su traducción al ${targetLang}" },
      { "source": "tercer ejemplo en ${sourceLang}", "target": "su traducción al ${targetLang}" },
      { "source": "cuarto ejemplo en ${sourceLang}", "target": "su traducción al ${targetLang}" }
    ]
  },
  "contexts": [
    {
      "label": "nombre corto del dominio o situación (ej: 'Técnico', 'Financiero', 'Coloquial', 'Jurídico', 'Médico')",
      "note": "una frase breve que explica cuándo aplica esta variación",
      "translation": "cómo se traduce la palabra o frase en este contexto específico"
    }
  ]
}

Reglas estrictas:
- Si el texto original tiene errores de ortografía o tipeo obvios, corregilos mentalmente primero y traducí esa versión corregida (no el error literal). Reportá la corrección en el campo "correction".
- No marques como error variantes dialectales, jerga, abreviaciones informales intencionales (ej: "q" por "que", "xq" por "porque") ni nombres propios — solo errores de tipeo/ortografía genuinos.
- Usa SIEMPRE comillas dobles, nunca simples.
- El campo "type" debe ser solo la abreviatura (ej: "vbo." no "verbo").
- Los ejemplos deben ser frases naturales y variadas que muestren distintos usos.
- Si el texto es una frase larga, usa "frase" como type y describe su función en "details". En este caso no muestres ejemplos.
- Para "contexts": incluye entre 2 y 4 entradas SOLO si la palabra tiene traducciones notablemente distintas según el dominio o situación (polisemia real, false friends, ambigüedad de registro). Si la traducción es unívoca o el texto es una frase sin ambigüedad contextual significativa, devuelve "contexts": [].
- Cada "label" debe ser conciso (1-2 palabras máximo).
- No incluyas nada fuera del objeto JSON.
`;

    const userMessage = context
        ? `Contexto de uso: ${context}\n\nTexto a traducir: "${text}"`
        : `Texto a traducir: "${text}"`;

    try {
        const response = await cohere.chat({
            model: 'command-a-translate-08-2025',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.2,
        });

        let translationText = response.message.content[0].text;
        console.log("🤖 Respuesta cruda de Cohere:", translationText);

        // Limpiar por si viene con ```json ... ```
        let cleanJson = translationText
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const translationObj = JSON.parse(cleanJson);
        console.log(`✅ Traducción parseada:`, translationObj);
        return translationObj;

    } catch (error) {
        console.error("❌ Error en Cohere:", error);
        return {
            correction: { hadErrors: false, correctedText: text },
            formal:   `[Error] ${text}`,
            informal: `[Error] ${text}`,
            neutral:  `[Error] ${text}`,
            lexical: null
        };
    }
}

// Decodifica JWT sin rechazar — devuelve payload o null
function _optionalAuth(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) {
        req._optionalUser = null;
        return next ? next() : null;
    }
    try {
        const jwt = require('jsonwebtoken');
        req._optionalUser = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    } catch {
        req._optionalUser = null;
    }
    if (next) next();
}

// Helper para obtener el payload de _optionalAuth (usado en rutas que llaman _optionalAuth como middleware)
function _getOptionalUser(req) {
    // Si ya fue procesado como middleware
    if (req._optionalUser !== undefined) return req._optionalUser;
    // Fallback: decodificar directamente
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) return null;
    try {
        const jwt = require('jsonwebtoken');
        return jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    } catch { return null; }
}

// Idioma nativo de cada personaje
const PERSON_NATIVE_LANG = {
    mlk:          'en',
    marilyn:      'en',
    maradona:     'es',
    einstein:     'de',
    cleopatra:    'en',
    frida:        'es',
    mandela:      'en',
    shakespeare:  'en',
    guevara:             'es',
    mercedes_sosa:       'es',
    piazzolla:           'es',
    borges:              'es',
    cohelo:              'pt',
    senna:               'pt',
    freire:              'pt',
    pele:                'pt',
    ronaldo:             'pt',
    fernanda_montenegro: 'pt',
    rita:                'pt',
    gilberto:            'pt',
    chiquinha:           'pt',
    neruda:              'es',
    mistral:             'es',
    jara:                'es',
    barrios:             'es',
    parra:               'es',
    geel:                'es',
    franulic:            'es',
    quiroga:             'es',
    luisi:               'es',
    amalia:              'es',
    galeano:             'es',
    rodo:                'es',
    benedetti:           'es',
};

// Traducción simple (solo neutral, para subtítulos del chat)
async function translateSimple(text, fromLang, toLang) {
    if (fromLang === toLang) return text; // mismo idioma, no traducir
    try {
        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const res = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [{
                role: 'user',
                content: `Translate this text from ${fromLang} to ${toLang}. Return ONLY the translated text, nothing else:

"${text}"`
            }],
            temperature: 0.1,
        });
        return res.message.content[0].text.trim().replace(/^["']|["']$/g, '');
    } catch {
        return null; // Si falla, el cliente mostrará solo el original
    }
}

// ── Sinónimos ──────────────────────────────────────────────────
const LANG_NAMES_MAP = {
    // América
    es:'Spanish', en:'English', pt:'Portuguese', fr:'French', gn:'Guarani', qu:'Quechua', ht:'Haitian Creole',
    // Europa Occidental
    de:'German', it:'Italian', nl:'Dutch', da:'Danish', sv:'Swedish', no:'Norwegian', fi:'Finnish',
    is:'Icelandic', ga:'Irish', ca:'Catalan', gl:'Galician', eu:'Basque', cy:'Welsh',
    // Europa Oriental
    ru:'Russian', pl:'Polish', cs:'Czech', sk:'Slovak', uk:'Ukrainian', bg:'Bulgarian', ro:'Romanian',
    hr:'Croatian', sr:'Serbian', bs:'Bosnian', sl:'Slovenian', mk:'Macedonian', sq:'Albanian', el:'Greek',
    hu:'Hungarian', lt:'Lithuanian', lv:'Latvian', et:'Estonian', be:'Belarusian',
    // Asia Occidental
    ar:'Arabic', he:'Hebrew', tr:'Turkish', fa:'Persian', ur:'Urdu', az:'Azerbaijani', ka:'Georgian',
    hy:'Armenian', ku:'Kurdish',
    // Asia Oriental y del Sur
    zh:'Chinese (Mandarin)', ja:'Japanese', ko:'Korean', hi:'Hindi', bn:'Bengali', ta:'Tamil', te:'Telugu',
    vi:'Vietnamese', th:'Thai', id:'Indonesian', ms:'Malay', tl:'Filipino',
    // África Subsahariana
    sw:'Swahili', yo:'Yoruba', ig:'Igbo', ha:'Hausa', zu:'Zulu', xh:'Xhosa', am:'Amharic', so:'Somali', sn:'Shona',
    // África del Norte
    ber:'Tamazight',
    // Oceanía
    mi:'Maori', sm:'Samoan', fj:'Fijian', tpi:'Tok Pisin', haw:'Hawaiian',
};
function _langName(code) { return LANG_NAMES_MAP[code] || code; }

// Voces Mistral Voxtral disponibles (voxtral-mini-tts-2603)
// Masculinas: en_paul_* (US) | gb_oliver_* (British)
// Femeninas:  gb_jane_* (British)
const PERSONA_VOICE = {
    // ── Masculinos apasionados/expresivos ──
    maradona:        'en_paul_excited',
    guevara:         'en_paul_confident',
    senna:           'en_paul_excited',
    pele:            'en_paul_cheerful',
    ronaldo:         'en_paul_happy',
    jara:            'en_paul_sad',
    galeano:         'en_paul_confident',
    gilberto:        'en_paul_cheerful',
    piazzolla:       'en_paul_neutral',
    benedetti:       'en_paul_neutral',
    neruda:          'en_paul_sad',
    cohelo:          'en_paul_neutral',
    freire:          'en_paul_confident',
    // ── Masculinos serenos/intelectuales ──
    mlk:             'en_paul_confident',
    mandela:         'en_paul_confident',
    einstein:        'gb_oliver_curious',
    shakespeare:     'gb_oliver_neutral',
    borges:          'gb_oliver_neutral',
    barrios:         'gb_oliver_curious',
    quiroga:         'gb_oliver_sad',
    rodo:            'gb_oliver_neutral',
    // ── Femeninas ──
    marilyn:         'gb_jane_neutral',
    frida:           'gb_jane_confident',
    cleopatra:       'gb_jane_confident',
    mercedes_sosa:   'gb_jane_sad',
    fernanda_montenegro: 'gb_jane_neutral',
    rita:            'gb_jane_confident',
    chiquinha:       'gb_jane_curious',
    mistral:         'gb_jane_neutral',
    parra:           'gb_jane_neutral',
    geel:            'gb_jane_sad',
    franulic:        'gb_jane_confident',
    luisi:           'gb_jane_confident',
    amalia:          'gb_jane_neutral',
};

module.exports = {
    translateWithCohere,
    translateSimple,
    LANG_NAMES_MAP,
    _langName,
    PERSON_NATIVE_LANG,
    PERSONA_VOICE,
    _optionalAuth,
    _getOptionalUser,
};
