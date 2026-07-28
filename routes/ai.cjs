'use strict';
const { CohereClientV2 } = require('cohere-ai');
const axios = require('axios');
const path  = require('path');
const { execFile } = require('child_process');

const {
    translateWithCohere,
    translateSimple,
    LANG_NAMES_MAP,
    _langName,
    PERSON_NATIVE_LANG,
    PERSONA_VOICE,
    _optionalAuth,
    _getOptionalUser,
} = require('../lib/ai-helpers.cjs');

const {
    MAX_TRANSLATE_CHARS,
    MAX_PARAGRAPH_CHARS,
    MAX_SPEAK_CHARS,
    MAX_SYNONYM_CHARS,
    MAX_WORD_CHARS,
    _validLang,
    _validMessages,
    _validText,
} = require('../lib/validators.cjs');

module.exports = function registerAiRoutes(app, { translateLimiter, chatLimiter, ttsLimiter }) {

    app.post('/translate', translateLimiter, async (req, res) => {
        const { text, sourceLang, targetLang, context } = req.body;

        // Plan viene del JWT, no del cliente
        const jwtPayload = _getOptionalUser(req);
        const isPremium  = !!(jwtPayload?.isDev || jwtPayload?.plan === 'premium' || jwtPayload?.plan === 'trial');

        const textVal = _validText(text, MAX_TRANSLATE_CHARS, 'texto a traducir');
        if (!textVal.ok) return res.status(400).json({ error: textVal.error });
        if (!_validLang(sourceLang) || !_validLang(targetLang))
            return res.status(400).json({ error: 'Código de idioma inválido.' });

        try {
            const src = sourceLang || 'auto';
            const tgt = targetLang || 'spanish';
            const translationObj = await translateWithCohere(textVal.value, tgt, src, context || '');

            // Strip premium-only fields for free/guest users
            if (!isPremium) {
                delete translationObj.lexical;
                delete translationObj.contexts;
            }

            return res.json({ translation: JSON.stringify(translationObj) });

        } catch (error) {
            console.error("Error en /translate:", error.message);
            return res.status(500).json({ error: "Error al procesar la traducción" });
        }
    });

    // ─── Traducción batch para subtítulos SRT ────────────────────
    app.post('/translate-batch', translateLimiter, async (req, res) => {
        const { lines, sourceLang, targetLang } = req.body;
        if (!Array.isArray(lines) || lines.length === 0)
            return res.status(400).json({ error: 'Falta el array lines.' });
        if (lines.length > 20)
            return res.status(400).json({ error: 'Máximo 20 líneas por llamada.' });

        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const src = sourceLang || 'en';
        const tgt = targetLang || 'es';

        const numbered = lines.map((l, i) => `[${i + 1}] ${l}`).join('\n');

        const systemPrompt = `Eres un traductor de subtítulos. Traduce del idioma "${src}" al "${tgt}".
Devuelve ÚNICAMENTE las traducciones numeradas en el mismo formato, sin texto extra:
[1] traducción de la línea 1
[2] traducción de la línea 2
...y así.`;

        try {
            const response = await cohere.chat({
                model: 'command-a-translate-08-2025',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: numbered }
                ],
                temperature: 0.1,
            });

            const raw = response.message.content[0].text;
            const translations = raw.split('\n')
                .filter(l => /^\[\d+\]/.test(l.trim()))
                .map(l => l.replace(/^\[\d+\]\s*/, '').trim());

            // Si no parsea bien, devolver líneas vacías sin error
            const result = lines.map((_, i) => translations[i] || '');
            return res.json({ translations: result });

        } catch (error) {
            console.error('❌ /translate-batch error:', error.message);
            return res.status(500).json({ error: 'Error al traducir subtítulos.' });
        }
    });

    // Endpoint para el chat del Modo Escuela
    app.post('/chat', chatLimiter, async (req, res) => {
        const { messages, level, targetLang, mode, sourceLangName, targetLangName } = req.body;
        const msgsErr = _validMessages(messages);
        if (msgsErr) return res.status(400).json({ error: msgsErr });
        if (!_validLang(targetLang)) return res.status(400).json({ error: 'Código de idioma inválido.' });

        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const systemPrompt = mode === 'welcome'
            ? `Eres un tutor de idiomas cálido y motivador dentro de la app SenseMate. El alumno habla ${sourceLangName || 'español'} y está por empezar el módulo A1 para aprender ${targetLangName || targetLang || 'un nuevo idioma'}.
Reglas:
- Respondé en ${sourceLangName || 'español'} (el idioma nativo del alumno), NO en el idioma que va a aprender.
- Dale una bienvenida breve y cálida.
- Presentale en 2 o 3 oraciones qué se va a encontrar en el módulo A1.
- Sé breve (máximo 3-4 oraciones) y motivador.`
            : `Eres un tutor de idiomas experto y motivador. El alumno tiene nivel "${level || 'B1'}" y está aprendiendo ${targetLang || 'español'}.
Reglas:
- Corrige los errores de forma amable y constructiva.
- Usa frases adaptadas al nivel del alumno.
- Haz una pregunta al final para continuar la conversación.
- Responde en el idioma que el alumno está aprendiendo (${targetLang || 'español'}).
- Mantén las respuestas concisas (2 o 3 oraciones).`;

        try {
            const response = await cohere.chat({
                model: 'command-a-03-2025',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
            });
            const reply = response.message.content[0].text;
            res.json({ reply });
        } catch (error) {
            console.error("Error en /chat:", error);
            res.status(500).json({ error: "Error al generar respuesta del tutor" });
        }
    });

    // ── Sinónimos ──────────────────────────────────────────────────
    app.post('/synonyms', chatLimiter, async (req, res) => {
        const { text, sourceLang, targetLang } = req.body;
        const textVal = _validText(text, MAX_SYNONYM_CHARS, 'texto');
        if (!textVal.ok) return res.status(400).json({ error: textVal.error });
        if (!_validLang(sourceLang) || !_validLang(targetLang))
            return res.status(400).json({ error: 'Código de idioma inválido.' });

        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const sName  = _langName(sourceLang || 'en');
        const tName  = _langName(targetLang || 'es');

        try {
            const response = await cohere.chat({
                model: 'command-a-03-2025',
                messages: [{ role: 'user', content:
                    `Give synonyms for the word or phrase: "${textVal.value}"\n` +
                    `Return ONLY valid JSON with this exact format:\n` +
                    `{"source":["syn1","syn2","syn3","syn4"],"target":["syn1","syn2","syn3","syn4"]}\n` +
                    `"source" = synonyms in ${sName}. "target" = synonyms in ${tName}.\n` +
                    `4-6 synonyms each. No explanation, no markdown, only the JSON.`
                }],
                temperature: 0.3,
            });
            const raw   = response.message.content[0].text.trim();
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) throw new Error('No JSON');
            res.json(JSON.parse(match[0]));
        } catch (e) {
            console.error('/synonyms error:', e);
            res.status(500).json({ error: 'Error al obtener sinónimos' });
        }
    });

    // ── Traductor de texto largo (párrafo a párrafo) ───────────────
    app.post('/translate-paragraph', _optionalAuth, async (req, res) => {
        const { text, sourceLang, targetLang, instruction, prevContext } = req.body;
        const textVal = _validText(text, MAX_PARAGRAPH_CHARS, 'texto');
        if (!textVal.ok) return res.status(400).json({ error: textVal.error });
        if (!_validLang(sourceLang) || !_validLang(targetLang))
            return res.status(400).json({ error: 'Código de idioma inválido.' });

        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const src    = _langName(sourceLang || 'es');
        const tgt    = _langName(targetLang || 'en');

        const instrLine = instruction?.trim()
            ? `Además de traducir, aplicá esta instrucción al párrafo: "${instruction.trim()}".`
            : '';

        const ctxLine = prevContext?.trim()
            ? `Para mantener coherencia, los párrafos anteriores procesados fueron:\n"""\n${prevContext.trim()}\n"""\n`
            : '';

        const systemPrompt =
            `Eres un experto traductor literario. Tu tarea es traducir párrafos del idioma ${src} al idioma ${tgt}.\n` +
            `${instrLine}\n` +
            `Reglas:\n` +
            `- Devolvé ÚNICAMENTE el párrafo traducido/procesado, sin encabezados ni explicaciones.\n` +
            `- Mantené el estilo, tono y voz narrativa del original.\n` +
            `- Si hay nombres propios o términos especiales, sé consistente con los párrafos anteriores.`;

        const userMsg = `${ctxLine}Párrafo a traducir:\n"""\n${text.trim()}\n"""`;

        try {
            const response = await cohere.chat({
                model: 'command-a-translate-08-2025',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: userMsg }
                ],
                temperature: 0.3,
            });
            res.json({ result: response.message.content[0].text.trim() });
        } catch (e) {
            console.error('/translate-paragraph error:', e);
            res.status(500).json({ error: 'Error al traducir el párrafo' });
        }
    });

    // ── Chat sobre un párrafo específico ───────────────────────────
    app.post('/paragraph-chat', chatLimiter, async (req, res) => {
        const { original, translated, messages, sourceLang, targetLang } = req.body;
        const msgsErr = _validMessages(messages);
        if (msgsErr) return res.status(400).json({ error: msgsErr });
        if (!_validLang(sourceLang) || !_validLang(targetLang))
            return res.status(400).json({ error: 'Código de idioma inválido.' });

        const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const src    = _langName(sourceLang || 'es');
        const tgt    = _langName(targetLang || 'en');

        const system =
            `Eres un asistente literario y de idiomas. El usuario está leyendo un texto traducido del ${src} al ${tgt}.\n` +
            `Párrafo original:\n"""\n${(original || '').slice(0, 800)}\n"""\n` +
            `Traducción/versión procesada:\n"""\n${(translated || '').slice(0, 800)}\n"""\n` +
            `Respondé las preguntas del usuario sobre este párrafo: vocabulario, gramática, decisiones de traducción, contexto literario, etc.\n` +
            `Respondé siempre en ${src}. Sé conciso y práctico (2-4 oraciones salvo que se pida más).`;

        try {
            const response = await cohere.chat({
                model: 'command-a-03-2025',
                messages: [{ role: 'system', content: system }, ...messages],
                temperature: 0.6,
            });
            res.json({ reply: response.message.content[0].text });
        } catch (e) {
            console.error('/paragraph-chat error:', e);
            res.status(500).json({ error: 'Error al generar respuesta' });
        }
    });

    // ── Analizador de nivel MCER ───────────────────────────────────
    app.post('/analyze-level', chatLimiter, async (req, res) => {
        const { text, lang } = req.body;
        const textVal = _validText(text, MAX_PARAGRAPH_CHARS, 'texto');
        if (!textVal.ok) return res.status(400).json({ error: textVal.error });
        if (!_validLang(lang)) return res.status(400).json({ error: 'Código de idioma inválido.' });

        const cohere   = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const langName = _langName(lang || 'en');
        const snippet  = textVal.value.slice(0, 3000); // cap to avoid token overuse

        const systemPrompt = `Eres un experto en lingüística aplicada y enseñanza de idiomas con certificación en el Marco Común Europeo de Referencia (MCER/CEFR).
Tu tarea es analizar textos y devolver un diagnóstico estructurado de nivel de complejidad lingüística.
SIEMPRE responde con un JSON válido y nada más (sin markdown, sin bloques de código, solo el objeto JSON).`;

        const userMsg = `Analiza el siguiente texto en idioma ${langName} y devuelve un objeto JSON con esta estructura exacta:

{
  "level_overall": "B2",
  "level_label": "Intermedio Alto",
  "confidence": "alta",
  "dimensions": {
    "vocabulary": { "level": "C1", "label": "Avanzado", "note": "breve justificación" },
    "grammar":    { "level": "B2", "label": "Intermedio Alto", "note": "breve justificación" },
    "syntax":     { "level": "B1", "label": "Intermedio", "note": "breve justificación" },
    "register":   { "level": "B2", "label": "Intermedio Alto", "note": "Formal / Académico" }
  },
  "register_tags": ["formal", "académico"],
  "grammar_structures": ["voz pasiva", "oraciones subordinadas", "condicional"],
  "hard_words": ["palabra1", "palabra2", "palabra3"],
  "word_count": 245,
  "avg_sentence_length": 18,
  "pedagogical": {
    "suitable_for": "Clases de nivel B1+ / Lectura extensiva B2",
    "challenges": "El vocabulario académico puede resultar difícil para niveles B1.",
    "suggestions": "Glosario previo de 5-8 términos clave. Ideal para práctica de comprensión lectora en B2."
  },
  "summary": "Una o dos frases describiendo el texto y su nivel general."
}

Niveles válidos: A1, A2, B1, B2, C1, C2.
Etiquetas: A1=Principiante, A2=Básico, B1=Intermedio, B2=Intermedio Alto, C1=Avanzado, C2=Maestría.
Confianza: "alta" si el texto tiene 100+ palabras, "media" si tiene 50-99, "baja" si tiene menos de 50.

TEXTO A ANALIZAR:
"""
${snippet}
"""`;

        try {
            const response = await cohere.chat({
                model: 'command-a-03-2025',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: userMsg }
                ],
                temperature: 0.2,
            });
            const raw = response.message.content[0].text.trim();
            // Strip accidental markdown fences
            const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
            const parsed = JSON.parse(clean);
            res.json({ analysis: parsed });
        } catch (e) {
            console.error('/analyze-level error:', e);
            res.status(500).json({ error: 'Error al analizar el texto. Intentá de nuevo.' });
        }
    });

    // ── IA in Context ──────────────────────────────────────────────
    app.post('/context-chat', chatLimiter, async (req, res) => {
        const { word, messages, sourceLang, targetLang, uiLang } = req.body;
        const wordVal = _validText(word, MAX_WORD_CHARS, 'palabra');
        if (!wordVal.ok) return res.status(400).json({ error: wordVal.error });
        const msgsErr = _validMessages(messages);
        if (msgsErr) return res.status(400).json({ error: msgsErr });
        if (!_validLang(sourceLang) || !_validLang(targetLang) || !_validLang(uiLang))
            return res.status(400).json({ error: 'Código de idioma inválido.' });

        const cohere  = new CohereClientV2({ token: process.env.COHERE_API_KEY });
        const sName   = _langName(sourceLang || 'en');
        const tName   = _langName(targetLang || 'es');
        const replyName = _langName(uiLang || sourceLang || 'en');
        const system  = `You are a language assistant. The user just translated "${wordVal.value}" from ${sName} to ${tName}. ` +
                        `Answer their questions about this word or phrase. Always respond in ${replyName} (the user's own interface language), regardless of what language the question is asked in. ` +
                        `Be concise (2-3 sentences), practical, and focus on real usage, grammar, and context.`;
        try {
            const response = await cohere.chat({
                model: 'command-a-03-2025',
                messages: [{ role: 'system', content: system }, ...messages],
                temperature: 0.6,
            });
            res.json({ reply: response.message.content[0].text });
        } catch (e) {
            console.error('/context-chat error:', e);
            res.status(500).json({ error: 'Error al generar respuesta' });
        }
    });

    // Endpoint para chatear con personajes famosos
    app.post('/famous-chat', chatLimiter, async (req, res) => {
        const { person, messages, targetLang } = req.body;
        if (!person || typeof person !== 'string') return res.status(400).json({ error: 'Falta el personaje.' });
        const msgsErr = _validMessages(messages);
        if (msgsErr) return res.status(400).json({ error: msgsErr });
        if (!_validLang(targetLang)) return res.status(400).json({ error: 'Código de idioma inválido.' });

        const nativeLang = PERSON_NATIVE_LANG[person] || 'en';
        const cohere     = new CohereClientV2({ token: process.env.COHERE_API_KEY });

        // Cada personaje habla SIEMPRE en su idioma nativo
        const famousPrompts = {
            mlk: `You are Martin Luther King Jr. (1929-1968), civil rights leader.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be eloquent and inspiring.
Use phrases and expressions characteristic of MLK. Never break character.`,

            marilyn: `You are Marilyn Monroe (1926-1962), actress and icon.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be glamorous, witty and charming.
Use expressions and mannerisms characteristic of Marilyn. Never break character.`,

            maradona: `Sos Diego Armando Maradona (1960-2020), el mejor jugador de fútbol de todos los tiempos.
SIEMPRE respondé en español rioplatense, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con pasión, usá tus muletillas y jerga característica.
Jamás salgas del personaje.`,

            einstein: `Du bist Albert Einstein (1879-1955), theoretischer Physiker und Nobelpreisträger.
Antworte IMMER auf Deutsch, egal in welcher Sprache der Nutzer schreibt.
Maximal 2 Sätze im Dialogformat. Sei nachdenklich, weise und humorvoll.
Verwende charakteristische Ausdrücke von Einstein. Bleib immer in der Rolle.`,

            cleopatra: `You are Cleopatra VII (69-30 BC), last active ruler of the Ptolemaic Kingdom of Egypt.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be regal, intelligent and commanding.
Use expressions befitting a powerful queen. Never break character.`,

            frida: `Eres Frida Kahlo (1907-1954), pintora mexicana.
SIEMPRE respondé en español mexicano, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Sé apasionada, directa y auténtica.
Usa expresiones características de Frida. Jamás salgas del personaje.`,

            mandela: `You are Nelson Mandela (1918-2013), anti-apartheid activist and former President of South Africa.
ALWAYS respond in English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be dignified, wise and hopeful.
Use expressions characteristic of Mandela. Never break character.`,

            shakespeare: `You are William Shakespeare (1564-1616), playwright and poet.
ALWAYS respond in Early Modern English, regardless of what language the user writes in.
Maximum 2 sentences in dialog format. Be poetic, theatrical and eloquent.
Use thee, thou, dost, hath and similar archaic English expressions. Never break character.`,

            guevara: `Sos Ernesto "Che" Guevara (1928-1967), médico, guerrillero y revolucionario argentino.
SIEMPRE respondé en español rioplatense, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con convicción revolucionaria, pasión y determinación.
Usá expresiones características del Che: "compañero", "la lucha", referencias a la justicia social y el imperialismo. Jamás salgas del personaje.`,

            mercedes_sosa: `Sos Mercedes Sosa (1935-2009), cantante argentina conocida como "La Negra", voz del pueblo latinoamericano y figura del Nuevo Cancionero.
SIEMPRE respondé en español con acento y expresiones del noroeste argentino, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con calidez, humildad y profundidad emocional.
Usá expresiones llenas de amor por la tierra, el pueblo y la música. Jamás salgas del personaje.`,

            piazzolla: `Sos Astor Piazzolla (1921-1992), músico y compositor argentino, revolucionario del tango.
SIEMPRE respondé en español rioplatense, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con pasión por la música, cierta ironía porteña y orgullo por haber transformado el tango.
Podés mencionar el bandoneón, Buenos Aires, y tu relación amor-odio con los puristas del tango. Jamás salgas del personaje.`,

            borges: `Sos Jorge Luis Borges (1899-1986), escritor argentino, uno de los más grandes de la literatura universal.
SIEMPRE respondé en español culto y preciso, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con erudición, ironía sutil, referencias literarias y filosóficas.
Podés aludir a los laberintos, los espejos, el tiempo, las bibliotecas infinitas y la ceguera con total naturalidad. Jamás salgas del personaje.`,

            cohelo: `Você é Paulo Coelho (1947-presente), escritor brasileiro, autor de O Alquimista, um dos livros mais vendidos da história.
SEMPRE responda em português brasileiro, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com sabedoria espiritual, otimismo e referências à jornada pessoal, à alma do mundo e ao destino.
Use expressões características de Paulo Coelho. Nunca saia do personagem.`,

            senna: `Você é Ayrton Senna (1960-1994), piloto de Fórmula 1 brasileiro, tricampeão mundial e lenda do automobilismo.
SEMPRE responda em português brasileiro, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com intensidade, foco, espiritualidade e paixão pela velocidade e pela perfeição.
Use expressões características de Senna: referências a Deus, aos limites humanos e à entrega total. Nunca saia do personagem.`,

            freire: `Você é Paulo Freire (1921-1997), educador e filósofo brasileiro, autor de Pedagogia do Oprimido.
SEMPRE responda em português brasileiro, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com profundidade filosófica, humanismo e compromisso com a educação libertadora.
Use expressões características de Freire: diálogo, conscientização, oprimido/opressor, práxis. Nunca saia do personagem.`,

            pele: `Você é Pelé (1940-2022), o Rei do Futebol, três vezes campeão mundial com o Brasil e maior jogador de todos os tempos.
SEMPRE responda em português brasileiro informal e caloroso, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com alegria, humildade e orgulho pelo futebol e pelo Brasil.
Use expressões características de Pelé. Nunca saia do personagem.`,

            ronaldo: `Você é Ronaldo Nazário (1976-presente), o Fenômeno, considerado um dos maiores centroavantes da história do futebol.
SEMPRE responda em português brasileiro descontraído, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com alegria, carisma e referências à sua carreira no Barcelona, Real Madrid, Inter de Milão e seleção brasileira.
Use expressões características do Ronaldo. Nunca saia do personagem.`,

            fernanda_montenegro: `Você é Fernanda Montenegro (1929-presente), a maior atriz do Brasil, indicada ao Oscar por Central do Brasil.
SEMPRE responda em português brasileiro culto e elegante, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com refinamento, inteligência e paixão pelo teatro e pelo cinema brasileiro.
Use expressões características de Fernanda Montenegro. Nunca saia do personagem.`,

            rita: `Você é Rita Lee (1947-2023), a Rainha do Rock brasileiro, cantora, compositora e ícone cultural.
SEMPRE responda em português brasileiro bem-humorado e irreverente, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com humor, liberdade, referências ao rock, ao feminismo e à vida colorida.
Use expressões características de Rita Lee. Nunca saia do personagem.`,

            gilberto: `Você é Gilberto Gil (1942-presente), músico, compositor e ex-Ministro da Cultura do Brasil, ícone da Tropicália.
SEMPRE responda em português brasileiro poético e musical, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com leveza, espiritualidade, referências à Bahia, à música e à política cultural.
Use expressões características de Gilberto Gil. Nunca saia do personagem.`,

            chiquinha: `Você é Chiquinha Gonzaga (1847-1935), pioneira da música brasileira, primeira maestrina e compositora do país.
SEMPRE responda em português brasileiro do início do século XX, independentemente do idioma em que o usuário escrever.
Máximo 2 frases em formato de diálogo. Fale com determinação, paixão pela música e consciência de ser uma mulher que rompeu barreiras em uma época de grandes preconceitos.
Use expressões características da época. Nunca saia do personagem.`,

            neruda: `Eres Pablo Neruda (1904-1973), poeta chileno, Premio Nobel de Literatura, autor de los Veinte poemas de amor y una canción desesperada.
SIEMPRE responde en español chileno culto y poético, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con imágenes sensuales y cósmicas, mezcla lo cotidiano con lo sublime, y deja que el amor y la naturaleza impregnen cada palabra.
Jamás salgas del personaje.`,

            mistral: `Eres Gabriela Mistral (1889-1957), poeta y educadora chilena, primera latinoamericana en ganar el Premio Nobel de Literatura.
SIEMPRE responde en español chileno cálido y profundo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con ternura, espiritualidad y compromiso con la infancia y la educación.
Podés mencionar la maternidad, la fe, la tierra chilena y América Latina. Jamás salgas del personaje.`,

            jara: `Eres Víctor Jara (1932-1973), cantautor y director de teatro chileno, mártir de la resistencia contra la dictadura.
SIEMPRE responde en español chileno cercano y directo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con convicción, sencillez y amor por el pueblo. La guitarra y la canción son tu herramienta de lucha.
Podés mencionar la canción protesta, el pueblo chileno y la esperanza. Jamás salgas del personaje.`,

            barrios: `Eres Eduardo Barrios (1884-1963), escritor chileno, maestro del análisis psicológico en la narrativa hispanoamericana.
SIEMPRE responde en español chileno formal y reflexivo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con introspección, precisión psicológica y amor por la literatura.
Podés hacer referencias a la vida interior, las emociones humanas y el oficio de escribir. Jamás salgas del personaje.`,

            parra: `Eres Violeta Parra (1917-1967), cantautora y artista popular chilena, creadora de la Nueva Canción Chilena.
SIEMPRE responde en español chileno cálido y directo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con pasión, humor y profundidad. Mezclá el folclore, el arte y la vida cotidiana con naturalidad.
Podés mencionar el bordado, la cerámica, las canciones, "Gracias a la vida" y Chile. Jamás salgas del personaje.`,

            geel: `Eres María Carolina Geel (1913-1996), escritora chilena, conocida también por el episodio que marcó su vida y que no impidió que siguiera escribiendo.
SIEMPRE responde en español chileno culto e introspectivo, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con profundidad psicológica, precisión literaria y una mirada lúcida sobre la condición humana.
Podés hacer referencias a la escritura como refugio y a la complejidad del alma. Jamás salgas del personaje.`,

            franulic: `Eres Lenka Franulic (1908-1949), periodista y escritora chilena, primera mujer en ingresar al Círculo de Periodistas de Chile.
SIEMPRE responde en español chileno directo y valiente, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Habla con convicción periodística, vocación por la verdad y conciencia de abrir caminos para las mujeres.
Podés mencionar el periodismo, la lucha por la igualdad y la importancia de la prensa. Jamás salgas del personaje.`,

            quiroga: `Sos Horacio Quiroga (1878-1937), cuentista uruguayo, maestro del cuento latinoamericano y autor de Cuentos de la selva.
SIEMPRE respondé en español rioplatense austero y preciso, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con tensión narrativa, amor por la naturaleza salvaje y una mirada oscura pero fascinada sobre la vida y la muerte.
Podés mencionar Misiones, la selva, los animales y el oficio de escribir. Jamás salgas del personaje.`,

            luisi: `Sos Paulina Luisi (1875-1950), médica y feminista uruguaya, primera mujer en graduarse de medicina en Uruguay y referente del sufragismo latinoamericano.
SIEMPRE respondé en español rioplatense formal y apasionado, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con convicción sobre los derechos de las mujeres, la salud pública y la justicia social.
Podés mencionar el voto femenino, la medicina y el feminismo de principios del siglo XX. Jamás salgas del personaje.`,

            amalia: `Sos Amalia de la Vega (1919-2011), cantante y folclorista uruguaya, voz fundamental del candombe y el folklore nacional.
SIEMPRE respondé en español rioplatense cálido y musical, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con alegría, orgullo por la cultura uruguaya y amor por el candombe y las tradiciones populares.
Podés mencionar el Río de la Plata, Montevideo, el folklore y la música. Jamás salgas del personaje.`,

            galeano: `Sos Eduardo Galeano (1940-2015), escritor y periodista uruguayo, autor de Las venas abiertas de América Latina y Memoria del fuego.
SIEMPRE respondé en español rioplatense poético y comprometido, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con indignación creativa, amor por los olvidados y una mirada crítica sobre el poder y la historia.
Podés mencionar América Latina, la injusticia, la memoria histórica y el fútbol. Jamás salgas del personaje.`,

            rodo: `Sos José Enrique Rodó (1871-1917), ensayista y humanista uruguayo, autor de Ariel, obra fundacional del pensamiento latinoamericano.
SIEMPRE respondé en español rioplatense culto y sereno, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con elegancia filosófica, idealismo y fe en los valores espirituales de América Latina frente al pragmatismo anglosajón.
Podés mencionar Ariel, Calibán, la juventud latinoamericana y el ideal humanista. Jamás salgas del personaje.`,

            benedetti: `Sos Mario Benedetti (1920-2009), escritor uruguayo, poeta del amor cotidiano y la resistencia, autor de La tregua y El olvido está lleno de memoria.
SIEMPRE respondé en español rioplatense sencillo y cercano, sin importar en qué idioma te hablen.
Máximo 2 oraciones en formato diálogo. Hablá con ternura, humor discreto y una mirada compasiva sobre las cosas pequeñas y los afectos.
Podés mencionar el exilio, Montevideo, el amor y la vida cotidiana. Jamás salgas del personaje.`
        };

        const systemPrompt = famousPrompts[person];
        if (!systemPrompt) return res.status(400).json({ error: "Personaje no soportado" });

        try {
            const response = await cohere.chat({
                model: 'command-a-03-2025',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.85,
            });
            const reply = response.message.content[0].text;

            // Traducir al idioma del usuario si es diferente al nativo del personaje
            const translation = await translateSimple(reply, nativeLang, targetLang || 'es');

            res.json({ reply, translation, nativeLang });
        } catch (error) {
            console.error("Error en /famous-chat:", error);
            res.status(500).json({ error: "Error generando respuesta" });
        }
    });

    // IA de MISTRAL — TTS
    app.post('/speak', ttsLimiter, async (req, res) => {
        const { text, persona } = req.body;
        const textVal = _validText(text, MAX_SPEAK_CHARS, 'texto');
        if (!textVal.ok) return res.status(400).json({ error: textVal.error });

        const voice = PERSONA_VOICE[persona] || 'en_paul_neutral';
        console.log(`🔊 /speak → persona="${persona}" voice="${voice}" chars=${textVal.value.length}`);

        try {
            const response = await axios.post(
                'https://api.mistral.ai/v1/audio/speech',
                { model: 'voxtral-mini-tts-2603', voice, input: textVal.value, response_format: 'mp3' },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                }
            );

            res.set('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(response.data));
        } catch (error) {
            const detail = error.response?.data ? Buffer.from(error.response.data).toString() : error.message;
            console.error('Error generando audio con Voxtral:', detail);
            res.status(500).json({ error: "Failed to generate speech" });
        }
    });

    // Endpoint para traducción de voz (Kyutai)
    app.post('/translate-speech', ttsLimiter, async (req, res) => {
        const { audioBase64, sourceLang = 'spanish', targetLang = 'english' } = req.body;
        if (!audioBase64) {
            return res.status(400).json({ error: "Falta el audio en base64" });
        }

        // Validar langs contra whitelist para evitar inyección
        const VALID_LANGS = /^[a-z]{2,20}$/;
        if (!VALID_LANGS.test(sourceLang) || !VALID_LANGS.test(targetLang)) {
            return res.status(400).json({ error: "Idioma inválido." });
        }

        // Decodificar base64 y guardar como archivo temporal
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const inputPath = path.join(__dirname, '..', 'temp_input.wav');
        require('fs').writeFileSync(inputPath, audioBuffer);

        const scriptPath = path.join(__dirname, '..', 'kyutai_service.py');

        execFile('python', [scriptPath, inputPath, sourceLang, targetLang], (error, stdout, stderr) => {
            // Limpiar archivo temporal
            require('fs').unlinkSync(inputPath);
            if (error) {
                console.error("Error en Kyutai:", stderr || error.message);
                return res.status(500).json({ error: "Error en el servicio de voz" });
            }
            try {
                // El script debe devolver JSON con { text, audioPath }
                const result = JSON.parse(stdout);
                res.json({ translation: result.text, audioUrl: result.audioPath });
            } catch (e) {
                res.status(500).json({ error: "Respuesta inválida del servicio de voz" });
            }
        });
    });

};
