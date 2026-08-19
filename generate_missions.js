#!/usr/bin/env node
// generate_missions.js — Generador de contenido MisionMate por lotes
// Uso:
//   node generate_missions.js --target=fr --source=es --level=A1 --category=gramatica
//   node generate_missions.js --target=fr --source=es --level=A1 --count=3
//   node generate_missions.js --target=fr --source=pt --level=A1 --from=es
//   node generate_missions.js --list
//   node generate_missions.js --status --target=fr --source=es
//   node generate_missions.js --provider=gemini   (fuerza Gemini como proveedor)
//   node generate_missions.js --provider=groq     (fuerza Groq/Llama como proveedor)
//   node generate_missions.js --provider=mistral  (fuerza Mistral como proveedor)
//   node generate_missions.js --provider=deepseek (fuerza DeepSeek)
//
// Proveedores soportados: deepseek (default), gemini, groq, mistral
// Auto-fallback: si DeepSeek devuelve 402 (sin saldo), cambia a Mistral automáticamente.
// Requiere DEEPSEEK_API_KEY y/o MISTRAL_API_KEY y/o GEMINI_API_KEY y/o GROQ_API_KEY en .env
//
// Genera JSON de conceptos pedagógicos para duplas idioma-destino / idioma-nativo.
// Guarda progreso tras cada concepto y puede retomarse desde donde se interrumpió.
// Compatible con el formato usado por ingles_a1 (concept_examples + phonetics).
//
// Con --from=<lang> reutiliza conceptos ya generados para otra fuente y solo traduce
// las explicaciones al nuevo idioma nativo (~3x más rápido, contenido target idéntico).

import OpenAI  from 'openai';
import fs      from 'fs';
import path    from 'path';
import dotenv  from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// ─── Configuración de proveedores ────────────────────────────

let activeClient       = null;
let activeModel        = null;
let activeProviderName = '';
let fallbackAvailable  = false;

function setDeepSeek() {
    activeClient = new OpenAI({
        apiKey:  process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
    });
    activeModel        = 'deepseek-chat';
    activeProviderName = 'DeepSeek';
}

function setGemini() {
    activeClient = new OpenAI({
        apiKey:  process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
    activeModel        = 'gemini-3.6-flash';
    activeProviderName = 'Gemini';
}

function setGroq() {
    activeClient = new OpenAI({
        apiKey:  process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
    });
    activeModel        = 'openai/gpt-oss-20b';
    activeProviderName = 'Groq';
}

function setMistral() {
    activeClient = new OpenAI({
        apiKey:  process.env.MISTRAL_API_KEY,
        baseURL: 'https://api.mistral.ai/v1',
    });
    activeModel        = 'open-mixtral-8x7b';
    activeProviderName = 'Mistral';
}

// max_tokens y delay entre requests según proveedor
function providerMaxTokens() { return activeProviderName === 'DeepSeek' ? 4000 : 8192; }
function providerDelay()     { return activeProviderName === 'Gemini'   ? 4500 : 2000; }

function initProvider(providerArg) {
    const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
    const hasGemini   = !!process.env.GEMINI_API_KEY;

    const hasGroq    = !!process.env.GROQ_API_KEY;
    const hasMistral = !!process.env.MISTRAL_API_KEY;

    if (providerArg === 'gemini') {
        if (!hasGemini) { console.error('❌ Falta GEMINI_API_KEY en .env'); process.exit(1); }
        setGemini();
        fallbackAvailable = hasMistral || hasGroq;
    } else if (providerArg === 'groq') {
        if (!hasGroq) { console.error('❌ Falta GROQ_API_KEY en .env'); process.exit(1); }
        setGroq();
    } else if (providerArg === 'mistral') {
        if (!hasMistral) { console.error('❌ Falta MISTRAL_API_KEY en .env'); process.exit(1); }
        setMistral();
    } else if (providerArg === 'deepseek') {
        if (!hasDeepSeek) { console.error('❌ Falta DEEPSEEK_API_KEY en .env'); process.exit(1); }
        setDeepSeek();
    } else {
        // auto: DeepSeek primero, Mistral como fallback si hay saldo insuficiente
        if (!hasDeepSeek && !hasMistral && !hasGroq && !hasGemini) {
            console.error('❌ Falta DEEPSEEK_API_KEY, MISTRAL_API_KEY, GROQ_API_KEY o GEMINI_API_KEY en .env');
            process.exit(1);
        }
        if (hasDeepSeek) {
            setDeepSeek();
            fallbackAvailable = hasMistral || hasGroq || hasGemini;
        } else if (hasMistral) {
            setMistral();
        } else if (hasGroq) {
            setGroq();
        } else {
            setGemini();
        }
    }
}

function tryFallbackToGemini() {
    if (!fallbackAvailable) return false;
    const from = activeProviderName;
    if (activeProviderName === 'Gemini') {
        // Gemini quota agotada → intentar Mistral o Groq
        if (process.env.MISTRAL_API_KEY) {
            console.warn(`\n⚠️  ${from} sin cuota — cambiando a Mistral automáticamente…\n`);
            setMistral();
        } else if (process.env.GROQ_API_KEY) {
            console.warn(`\n⚠️  ${from} sin cuota — cambiando a Groq automáticamente…\n`);
            setGroq();
        } else {
            return false;
        }
    } else {
        // DeepSeek/Groq sin saldo → siguiente en cadena
        if (process.env.MISTRAL_API_KEY) {
            console.warn(`\n⚠️  ${from} sin saldo — cambiando a Mistral automáticamente…\n`);
            setMistral();
        } else if (process.env.GROQ_API_KEY) {
            console.warn(`\n⚠️  ${from} sin saldo — cambiando a Groq automáticamente…\n`);
            setGroq();
        } else if (process.env.GEMINI_API_KEY) {
            console.warn(`\n⚠️  ${from} sin saldo — cambiando a Gemini automáticamente…\n`);
            setGemini();
        } else {
            return false;
        }
    }
    fallbackAvailable = false;
    return true;
}

// ─── Metadatos de idiomas ──────────────────────────────────────

const LANGS = {
    es: { name: 'Español',    nameEn: 'Spanish',    dir: 'español'   },
    en: { name: 'Inglés',     nameEn: 'English',    dir: 'ingles'    },
    fr: { name: 'Francés',    nameEn: 'French',     dir: 'frances'   },
    pt: { name: 'Portugués',  nameEn: 'Portuguese', dir: 'portugues' },
    de: { name: 'Alemán',     nameEn: 'German',     dir: 'aleman'    },
    it: { name: 'Italiano',   nameEn: 'Italian',    dir: 'italiano'  },
    zh: { name: 'Chino',      nameEn: 'Mandarin',   dir: 'chino'     },
    ja: { name: 'Japonés',    nameEn: 'Japanese',   dir: 'japones'   },
    ko: { name: 'Coreano',    nameEn: 'Korean',     dir: 'coreano'   },
    ru: { name: 'Ruso',       nameEn: 'Russian',    dir: 'ruso'      },
    ar: { name: 'Árabe',      nameEn: 'Arabic',     dir: 'arabe'     },
    gn: { name: 'Guaraní',    nameEn: 'Guaraní',    dir: 'guarani'   },
    qu: { name: 'Quechua',    nameEn: 'Quechua',    dir: 'quechua'   },
    wo: { name: 'Wolof',      nameEn: 'Wolof',      dir: 'wolof'     },
    ha: { name: 'Hausa',      nameEn: 'Hausa',      dir: 'hausa'     },
    yo: { name: 'Yoruba',     nameEn: 'Yoruba',     dir: 'yoruba'    },
    ig: { name: 'Igbo',       nameEn: 'Igbo',       dir: 'igbo'      },
    ary:{ name: 'Darija',     nameEn: 'Moroccan Arabic', dir: 'darija' },
};

const CATEGORIES = ['gramatica', 'funciones_comunicativas', 'conversacion'];

// ─── Temas por nivel y categoría ──────────────────────────────
// Lista de temas curriculares CEFR. Claude genera el contenido para cada uno.

const TOPICS = {
    A1: {
        gramatica: [
            'Verb to be / Verbo ser-estar equivalente y sus formas',
            'Personal pronouns / Pronombres personales (I, you, he, she, it, we, they)',
            'Definite and indefinite articles / Artículos definidos e indefinidos',
            'Gender and number of nouns / Género y número de los sustantivos',
            'Regular verbs in present tense / Verbos regulares en presente',
            'Negation / Negación básica',
            'Basic questions / Preguntas básicas (wh-questions y yes/no)',
            'Numbers 1-100 / Números del 1 al 100',
            'Basic adjectives and agreement / Adjetivos básicos y concordancia',
            'Possessives / Posesivos (my, your, his, her, our, their)',
            'Demonstratives / Demostrativos (this, that, these, those)',
            'There is / There are / Hay (existencia)',
            'Basic prepositions of place / Preposiciones básicas de lugar',
            'Days, months and seasons / Días, meses y estaciones',
            'Verb to have / Verbo tener equivalente',
            'Verb can / Poder (verbo modal básico)',
            'Basic irregular verbs / Verbos irregulares básicos (go, come, do, make)',
            'Telling the time / Decir la hora',
        ],
        funciones_comunicativas: [
            'Greetings and farewells / Saludos y despedidas',
            'Introducing yourself and others / Presentarse y presentar a otros',
            'Asking and saying where you are from / Origen y nacionalidad',
            'Describing people and things / Describir personas y objetos',
            'Expressing likes and dislikes / Expresar gustos y disgustos',
            'Ordering food and drinks / Pedir comida y bebida',
            'Shopping basics / Compras básicas (precios, cantidades)',
            'Asking for and giving directions / Pedir y dar indicaciones',
            'Talking about family / Hablar de la familia',
            'Expressing need and want / Expresar necesidad y deseo',
        ],
        conversacion: [
            'At the airport / En el aeropuerto',
            'At the hotel / En el hotel',
            'In a restaurant / En el restaurante',
            'At the pharmacy / En la farmacia',
            'At the supermarket / En el supermercado',
            'Using public transport / Transporte público',
            'Meeting new people / Conocer gente nueva',
            'In a café / En una cafetería',
            'Phone and messaging basics / Teléfono y mensajes básicos',
            'Emergency phrases / Frases de emergencia',
        ],
    },
    A2: {
        gramatica: [
            'Simple past tense / Pasado simple (verbos regulares e irregulares)',
            'Present progressive / Presente continuo o progresivo',
            'Future with going to / Futuro con "going to" o equivalente',
            'Simple future / Futuro simple (will o equivalente)',
            'Comparatives and superlatives / Comparativos y superlativos',
            'Modal verbs / Verbos modales (should, must, have to, etc.)',
            'Reflexive verbs / Verbos reflexivos',
            'Object pronouns / Pronombres de objeto directo e indirecto',
            'Frequency adverbs / Adverbios de frecuencia',
            'Prepositions of time / Preposiciones de tiempo',
            'Conjunctions / Conjunciones (and, but, or, because, when, if)',
            'Present perfect basics / Perfecto compuesto básico',
            'Imperatives / Imperativo (afirmativo y negativo)',
            'Count and uncount nouns / Sustantivos contables e incontables',
            'Some and any / Some y any (y sus compuestos)',
            'Much, many, a lot of / Cuantificadores',
            'Relative clauses basics / Oraciones de relativo básicas (who, which, that)',
        ],
        funciones_comunicativas: [
            'Talking about past experiences / Hablar de experiencias pasadas',
            'Making plans and arrangements / Hacer planes y citas',
            'Giving advice and recommendations / Dar consejos y recomendaciones',
            'Expressing opinions / Expresar opiniones (I think, I believe)',
            'Agreeing and disagreeing / Estar de acuerdo y en desacuerdo',
            'Describing daily routines / Describir rutinas diarias',
            'Talking about health and symptoms / Hablar de salud y síntomas',
            'Making requests and offers / Hacer peticiones y ofrecer ayuda',
            'Expressing ability and possibility / Habilidad y posibilidad',
            'Talking about weather / El tiempo meteorológico',
        ],
        conversacion: [
            'At the doctor / En el médico',
            'Booking accommodation / Reservar alojamiento',
            'At the bank or exchange office / En el banco o cambio de moneda',
            'Job interview basics / Entrevista de trabajo básica',
            'At the post office / En correos o servicio postal',
            'Renting a flat / Alquilar un piso o apartamento',
            'At a party or social event / En una fiesta o evento social',
            'Complaining and apologizing / Quejarse y disculparse',
            'Describing your hometown / Describir tu ciudad o pueblo',
            'Talking about hobbies / Hablar de aficiones y tiempo libre',
        ],
    },
    B1: {
        gramatica: [
            'Past perfect / Pluscuamperfecto (pasado del pasado)',
            'Conditionals type 1 and 2 / Condicionales tipo 1 y 2',
            'Passive voice / Voz pasiva (presente y pasado)',
            'Reported speech / Estilo indirecto básico',
            'Gerunds and infinitives / Gerundios e infinitivos como sujeto y objeto',
            'Modal verbs for deduction / Modales para deducción (must, might, could)',
            'Relative clauses (defining/non-defining) / Oraciones relativas (definitorias y explicativas)',
            'Wish + past / Wish para expresar deseos irreales',
            'Used to / Used to para hábitos pasados',
            'Purpose, cause and result / Propósito, causa y resultado (so that, because of, etc.)',
            'Phrasal verbs common / Verbos frasales más comunes',
            'Quantifiers advanced / Cuantificadores avanzados (hardly any, plenty of, etc.)',
            'Verb patterns / Patrones verbales (verb + infinitive / gerund)',
            'Articles advanced / Artículos avanzados (zero article, generic use)',
        ],
        funciones_comunicativas: [
            'Describing changes over time / Describir cambios a lo largo del tiempo',
            'Speculating and making deductions / Especular y hacer deducciones',
            'Expressing regret and hypothetical situations / Expresar arrepentimiento e hipótesis',
            'Discussing advantages and disadvantages / Ventajas y desventajas de una idea',
            'Narrating a story / Contar una historia o anécdota',
            'Arguing a point of view / Argumentar un punto de vista',
            'Talking about work and career / Hablar de trabajo y carrera profesional',
            'Describing processes / Describir procesos (how something works)',
            'Expressing uncertainty / Expresar incertidumbre y probabilidad',
            'Making formal requests / Peticiones formales y escritura formal básica',
        ],
        conversacion: [
            'Job application and CV / Solicitud de empleo y currículum',
            'Discussing current events / Hablar de noticias y eventos actuales',
            'Cultural differences / Diferencias culturales y malentendidos',
            'Environmental topics / Temas medioambientales',
            'Technology and social media / Tecnología y redes sociales',
            'Education and studying abroad / Educación y estudiar en el extranjero',
            'Travel and tourism experiences / Viajes y experiencias turísticas',
            'Health and lifestyle / Salud y estilos de vida',
            'Relationships and social life / Relaciones sociales y vida en sociedad',
            'Giving a short presentation / Dar una presentación breve',
        ],
    },
    B2: {
        gramatica: [
            'Advanced conditional sentences / Condicionales avanzados (mixed conditionals)',
            'Passive voice advanced / Voz pasiva avanzada (gerunds, infinitives, modals)',
            'Advanced reported speech / Estilo indirecto avanzado',
            'Inversion for emphasis / Inversión para énfasis (Not only..., Rarely...)',
            'Cleft sentences / Construcciones escindidas (It is/was... that)',
            'Nominalisation / Nominalización (verbos y adjetivos convertidos en sustantivos)',
            'Advanced modal verbs / Modales avanzados (would have, should have, etc.)',
            'Participle clauses / Cláusulas de participio (walking down the street, I saw...)',
            'Subjunctive / Subjuntivo formal (it is essential that he be...)',
            'Future perfect and continuous / Futuro perfecto y continuo',
            'Discourse markers / Marcadores del discurso para cohesión',
            'Hedging language / Lenguaje de distanciamiento (I tend to, It seems, Apparently)',
        ],
        funciones_comunicativas: [
            'Negotiating and persuading / Negociar y persuadir',
            'Giving and justifying opinions in depth / Dar y justificar opiniones en profundidad',
            'Hypothesising about the past / Especular sobre el pasado',
            'Discussing abstract concepts / Hablar de conceptos abstractos',
            'Expressing complex emotions / Expresar emociones complejas con matices',
            'Formal writing: reports and emails / Escritura formal: informes y correos',
            'Dealing with conflict / Gestionar conflictos y malentendidos',
            'Summarising and paraphrasing / Resumir y parafrasear',
            'Using idioms naturally / Usar expresiones idiomáticas con naturalidad',
            'Academic and professional register / Registro académico y profesional',
        ],
        conversacion: [
            'Debate on ethical issues / Debate sobre dilemas éticos',
            'Business meetings and negotiations / Reuniones y negociaciones profesionales',
            'Discussing literature and film / Hablar de literatura y cine',
            'Scientific and medical topics / Temas científicos y médicos accesibles',
            'Political and social issues / Cuestiones políticas y sociales',
            'Economics and finance basics / Economía y finanzas básicas',
            'Philosophy and ideas / Filosofía e ideas abstractas',
            'Cultural and artistic topics / Arte, cultura e historia',
            'Problem-solving discussions / Discusiones para resolver problemas',
            'Personal development and goals / Desarrollo personal y metas',
        ],
    },
    C1: {
        gramatica: [
            'Advanced syntax and sentence structures / Sintaxis avanzada y estructuras complejas',
            'Register and style / Registro, estilo formal, informal y neutro',
            'Advanced inversion and fronting / Inversión y frontalización avanzadas',
            'Complex nominalization / Nominalización compleja (process → processing)',
            'Ellipsis and substitution / Elipsis y sustitución (so do I, neither have we)',
            'Advanced discourse markers / Marcadores discursivos avanzados para cohesión',
            'Hedging and tentativeness / Lenguaje de distanciamiento y matización fina',
            'Complex verb patterns / Patrones verbales complejos (double object, etc.)',
            'Nuances of tense and aspect / Matices entre tiempos y aspectos verbales',
            'Advanced passives / Pasivas avanzadas (it is believed, there is said to be)',
        ],
        funciones_comunicativas: [
            'Constructing a nuanced argument / Construir un argumento matizado y complejo',
            'Critical analysis and evaluation / Análisis crítico y evaluación de ideas',
            'Using irony and understatement / Ironía, sarcasmo y eufemismo',
            'Advanced pragmatics / Pragmática avanzada: implicaturas y actos de habla indirectos',
            'Formal presentations and speeches / Presentaciones y discursos formales',
            'Writing complex academic texts / Redacción académica compleja',
            'Advanced negotiation strategies / Estrategias de negociación avanzadas',
            'Nuanced expression of attitude / Expresar actitud y evaluación con matices',
            'Register shifting / Cambio de registro según el contexto',
            'Cross-cultural communication / Comunicación intercultural y estilo pragmático',
        ],
        conversacion: [
            'Academic seminar discussion / Discusión en seminario académico',
            'High-level professional communication / Comunicación profesional de alto nivel',
            'Literature and cultural analysis / Análisis literario y cultural profundo',
            'Philosophy and abstract reasoning / Razonamiento filosófico y abstracto',
            'Advanced socio-political commentary / Comentario sociopolítico avanzado',
            'Complex personal narratives / Narrativas personales complejas con perspectiva',
            'Advanced debate techniques / Técnicas avanzadas de debate y refutación',
            'Specialized academic vocabulary / Vocabulario académico especializado',
            'Authentic idiomatic language / Uso auténtico de lenguaje coloquial y modismos',
            'Near-native fluency scenarios / Escenarios de fluidez casi nativa',
        ],
    },
};

// ─── Rutas de salida ───────────────────────────────────────────

function getOutputDir(target, level) {
    const langDir = LANGS[target]?.dir || target;
    return path.join(__dirname, 'grupos_tarjetas', `${langDir}_${level.toLowerCase()}`);
}

function getOutputFile(target, source, level, category) {
    const dir = getOutputDir(target, level);
    return path.join(dir, `${source}_${level.toLowerCase()}_${category}.json`);
}

function getProgressFile(target, source, level, category) {
    const dir = getOutputDir(target, level);
    return path.join(dir, `.progress_${source}_${level.toLowerCase()}_${category}.json`);
}

// ─── Prompt de generación ─────────────────────────────────────

function buildPrompt(target, source, level, category, topicIndex, topic, existingCount) {
    const tLang   = LANGS[target] || { name: target, nameEn: target };
    const sLang   = LANGS[source] || { name: source, nameEn: source };
    const conceptId = `${source}_${level}_${category.slice(0,4)}_${String(topicIndex + 1).padStart(2, '0')}`;

    const categoryLabel = {
        gramatica:                'Gramática',
        funciones_comunicativas:  'Funciones comunicativas',
        conversacion:             'Conversación',
    }[category] || category;

    return `You are a professional language learning content creator specialized in CEFR-aligned pedagogy.

Generate a SINGLE JSON concept object for a language learning app.
- **Target language (being learned):** ${tLang.name} (${tLang.nameEn})
- **Source language (native speaker):** ${sLang.name} (${sLang.nameEn})
- **CEFR Level:** ${level}
- **Category:** ${categoryLabel}
- **Topic:** ${topic}
- **Concept ID:** "${conceptId}"

The output MUST be a single valid JSON object (no markdown, no explanation, just the JSON) matching this EXACT structure:

{
  "id": "${conceptId}",
  "type": "concept",
  "category": "${categoryLabel}",
  "title": "<concise title in ${tLang.nameEn} / translation in ${sLang.nameEn}>",
  "bridge": "<2-4 sentence contrastive explanation written IN ${sLang.nameEn}. Compare the ${tLang.nameEn} feature to what the learner already knows in ${sLang.nameEn}. Highlight traps and key differences. Be specific, not generic.>",
  "rule": "<Clear grammar or usage rule written IN ${sLang.nameEn}. Include all forms, exceptions and typical use cases. Be thorough but accessible for ${level}.>",
  "concept_examples": [
    {
      "text": "<example sentence IN ${tLang.nameEn}>",
      "translation": "<translation of the sentence IN ${sLang.nameEn}>",
      "phonetic": "<IPA pronunciation of the ${tLang.nameEn} sentence, or empty string if not applicable>"
    }
  ],
  "common_error": {
    "wrong": "<incorrect sentence that ${sLang.nameEn} speakers typically produce>",
    "correct": "<corrected version>",
    "correct_alt": "<alternative correct version, or empty string>",
    "explanation": "<explanation of why the error happens and how to avoid it, written IN ${sLang.nameEn}>"
  },
  "levels": [
    {
      "level": 1,
      "label": "<short label for sub-topic 1, IN ${tLang.nameEn}>",
      "translation": "<translation of the label IN ${sLang.nameEn}>",
      "examples": [
        {
          "original": "<sentence or phrase IN ${tLang.nameEn}>",
          "phonetic": "<IPA pronunciation, or empty string>",
          "translation": "<translation IN ${sLang.nameEn}>",
          "note": "<short pedagogical note written IN ${sLang.nameEn}>"
        }
      ]
    },
    {
      "level": 2,
      "label": "<sub-topic 2 IN ${tLang.nameEn}>",
      "translation": "<translation IN ${sLang.nameEn}>",
      "examples": [...]
    },
    {
      "level": 3,
      "label": "<sub-topic 3 IN ${tLang.nameEn}>",
      "translation": "<translation IN ${sLang.nameEn}>",
      "examples": [...]
    }
  ],
  "emoji": "<single emoji that represents this topic>",
  "phonetic": "",
  "translations": {
    "${source}": "<topic name IN ${sLang.nameEn}>"
  }
}

Requirements:
- "concept_examples": 3-4 representative examples of the topic
- "levels": exactly 3 sub-levels, each with 2-4 examples in "examples"
- All explanatory text (bridge, rule, notes, error explanation) MUST be written IN ${sLang.nameEn}
- All target language content (labels in title, level labels, examples "original") MUST be in ${tLang.nameEn}
- Include IPA phonetics for ALL ${tLang.nameEn} sentences/phrases where helpful
- The "bridge" must specifically reference contrastive points between ${tLang.nameEn} and ${sLang.nameEn}
- Level difficulty should be appropriate for CEFR ${level}
- Provide ONLY the JSON object. No markdown fences. No extra text.`;
}

// ─── Prompt de traducción (modo --from) ──────────────────────

function _slimConcept(concept) {
    // Returns only the fields that need translation (reduces prompt ~40%)
    const s = { id: concept.id, title: concept.title };
    if (concept.bridge)      s.bridge      = concept.bridge;
    if (concept.rule)        s.rule        = concept.rule;
    if (concept.translations) s.translations = concept.translations;
    if (concept.concept_examples) s.concept_examples = concept.concept_examples.map(e => ({ translation: e.translation }));
    if (concept.common_error)     s.common_error     = { explanation: concept.common_error.explanation };
    if (concept.levels)           s.levels           = concept.levels.map(l => ({
        translation: l.translation,
        examples: (l.examples || []).map(e => ({ translation: e.translation, ...(e.note ? { note: e.note } : {}) }))
    }));
    return s;
}

function _mergeTranslated(original, translated, fromSource, newSource) {
    // Deep-merge: apply translated fields onto a clone of the original
    const result = JSON.parse(JSON.stringify(original));
    if (translated.bridge)      result.bridge      = translated.bridge;
    if (translated.rule)        result.rule        = translated.rule;
    if (translated.title)       result.title       = translated.title;
    if (translated.translations) {
        result.translations = { ...original.translations, ...translated.translations };
        delete result.translations[fromSource];
    }
    if (translated.concept_examples && result.concept_examples) {
        translated.concept_examples.forEach((e, i) => { if (result.concept_examples[i]) result.concept_examples[i].translation = e.translation; });
    }
    if (translated.common_error?.explanation && result.common_error) {
        result.common_error.explanation = translated.common_error.explanation;
    }
    if (translated.levels && result.levels) {
        translated.levels.forEach((l, i) => {
            if (!result.levels[i]) return;
            if (l.translation) result.levels[i].translation = l.translation;
            if (l.examples && result.levels[i].examples) {
                l.examples.forEach((e, j) => {
                    if (!result.levels[i].examples[j]) return;
                    if (e.translation) result.levels[i].examples[j].translation = e.translation;
                    if (e.note !== undefined) result.levels[i].examples[j].note = e.note;
                });
            }
        });
    }
    result.id = original.id.replace(new RegExp(`^${fromSource}_`), `${newSource}_`);
    return result;
}

function buildTranslatePrompt(concept, fromSource, newSource) {
    const fromLang = LANGS[fromSource] || { nameEn: fromSource };
    const newLang  = LANGS[newSource]  || { nameEn: newSource  };
    const slim     = _slimConcept(concept);

    return `Translate the explanation fields from ${fromLang.nameEn} to ${newLang.nameEn}.
Fields to translate: bridge, rule, title (only the part after " / "), concept_examples[].translation, common_error.explanation, levels[].translation, levels[].examples[].translation, levels[].examples[].note, translations value.
id: change prefix "${fromSource}_" to "${newSource}_". translations: replace key "${fromSource}" with "${newSource}".
Return ONLY valid JSON. No markdown.

${JSON.stringify(slim)}`;
}

// ─── Llamada al modelo (modo --from) ─────────────────────────

async function translateConcept(concept, fromSource, newSource, retries = 3) {
    const prompt = buildTranslatePrompt(concept, fromSource, newSource);
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            process.stdout.write(`  → Traduciendo a ${LANGS[newSource]?.nameEn || newSource} [${activeProviderName}] (intento ${attempt})…`);
            const resp = await activeClient.chat.completions.create({
                model:       activeModel,
                temperature: 0.3,
                max_tokens:  providerMaxTokens(),
                messages: [{ role: 'user', content: prompt }],
            });
            let raw = resp.choices[0].message.content.trim()
                .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
            const start = raw.indexOf('{');
            const end   = raw.lastIndexOf('}');
            if (start !== -1 && end !== -1) raw = raw.slice(start, end + 1);
            const parsed = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('Invalid JSON response');
            const merged = _mergeTranslated(concept, parsed, fromSource, newSource);
            process.stdout.write(' ✓\n');
            return merged;
        } catch (err) {
            process.stdout.write(` ✗ (${err.message})\n`);
            const isQuota = err.message.includes('402') || err.message.includes('RESOURCE_EXHAUSTED') || err.message.toLowerCase().includes('quota');
            if (isQuota && tryFallbackToGemini()) {
                attempt--;
                continue;
            }
            if (err.message.includes('429')) {
                const wait = 65000;
                process.stdout.write(`  Rate limit — esperando ${wait/1000}s…\n`);
                await new Promise(r => setTimeout(r, wait));
                attempt--;
                continue;
            }
            if (attempt < retries) {
                process.stdout.write(`  Reintentando en 5 s…\n`);
                await new Promise(r => setTimeout(r, 5000));
            } else throw err;
        }
    }
}

// ─── Traducción desde archivo de referencia (modo --from) ─────

async function translateFromFile(target, source, level, category, fromSource, count) {
    const refFile    = getOutputFile(target, fromSource, level, category);
    const outputFile = getOutputFile(target, source, level, category);

    const reference = loadOutput(refFile);
    if (!reference.length) {
        console.error(`❌ Archivo de referencia no encontrado o vacío: ${path.relative(__dirname, refFile)}`);
        console.error(`   Primero generá: sc-misiones --target=${target} --source=${fromSource} --level=${level} --category=${category}`);
        process.exit(1);
    }

    const existing    = loadOutput(outputFile);
    const existingIds = new Set(existing.map(x => x.id));

    // Pendientes = los que no tienen aún un ítem traducido en el output
    const idPrefix = new RegExp(`^${fromSource}_`);
    const pending  = reference.filter(c => {
        const newId = c.id.replace(idPrefix, `${source}_`);
        return !existingIds.has(newId);
    });

    if (!pending.length) {
        console.log(`✅ Ya está completo: ${path.basename(outputFile)} (${existing.length} conceptos)`);
        return;
    }

    const batch    = pending.slice(0, count);
    const tLang    = LANGS[target]     || { name: target };
    const sLang    = LANGS[source]     || { name: source };
    const fromLang = LANGS[fromSource] || { name: fromSource };

    console.log(`\n🔄 Modo reutilización: ${tLang.name} ← ${sLang.name} | ${level} | ${category}`);
    console.log(`   Referencia: ${fromLang.name} | ${existing.length}/${reference.length} ya traducidos`);
    console.log(`   Traduciendo ${batch.length} concepto(s) en este lote…\n`);

    for (const concept of batch) {
        console.log(`▶ ${concept.id} — ${concept.title}`);
        try {
            const result = await translateConcept(concept, fromSource, source);
            // Validate ID prefix — catch any remaining model/substitution errors
            if (!result.id.startsWith(source + '_')) {
                throw new Error(`ID inválido tras traducción: "${result.id}" (esperaba prefijo "${source}_")`);
            }
            existing.push(result);
            existingIds.add(result.id);
            saveOutput(outputFile, existing);
            // Sync progress file so normal-mode status stays consistent
            const progressFile = getProgressFile(target, source, level, category);
            const progress     = loadProgress(progressFile);
            progress.completed = Array.from({ length: existing.length }, (_, i) => i);
            saveProgress(progressFile, progress);
            console.log(`  ✅ Guardado: ${result.id}\n`);
        } catch (err) {
            console.error(`  ❌ Error: ${err.message}\n`);
            console.error('  El lote se detiene aquí. Podés retomarlo con el mismo comando.');
            process.exit(1);
        }
        await new Promise(r => setTimeout(r, providerDelay()));
    }

    const remaining = reference.length - existing.length;
    console.log(`✅ Lote completado. Archivo: ${path.relative(__dirname, outputFile)}`);
    if (remaining > 0) {
        console.log(`⏭  Faltan ${remaining} concepto(s). Volvé a correr el mismo comando para continuar.`);
    } else {
        console.log(`🎉 ¡Categoría completa! (${existing.length}/${reference.length} conceptos)`);
    }
}

// ─── Generación con reintentos ─────────────────────────────────

async function generateConcept(target, source, level, category, topicIndex, topic) {
    const prompt = buildPrompt(target, source, level, category, topicIndex, topic, 0);
    let lastErr;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            process.stdout.write(`  → Llamando a ${activeProviderName} (intento ${attempt})…`);
            const msg = await activeClient.chat.completions.create({
                model:      activeModel,
                max_tokens: providerMaxTokens(),
                messages:   [{ role: 'user', content: prompt }],
            });
            let raw = msg.choices[0]?.message?.content?.trim() || '';
            // Strip markdown fences if present
            raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
            // Extract first { ... } block in case there's surrounding text
            const start = raw.indexOf('{');
            const end   = raw.lastIndexOf('}');
            if (start !== -1 && end !== -1) raw = raw.slice(start, end + 1);
            const json = JSON.parse(raw);
            process.stdout.write(' ✓\n');
            return json;
        } catch (err) {
            lastErr = err;
            process.stdout.write(` ✗ (${err.message})\n`);
            const isQuota = err.message.includes('402') || err.message.includes('RESOURCE_EXHAUSTED') || err.message.toLowerCase().includes('quota');
            if (isQuota && tryFallbackToGemini()) {
                attempt--;
                continue;
            }
            if (err.message.includes('429')) {
                const wait = 65000;
                process.stdout.write(`  Rate limit — esperando ${wait/1000}s…\n`);
                await new Promise(r => setTimeout(r, wait));
                attempt--;
                continue;
            }
            if (attempt < 3) {
                process.stdout.write(`  Reintentando en 5 s…\n`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }
    throw new Error(`No se pudo generar el concepto tras 3 intentos: ${lastErr?.message}`);
}

// ─── Leer/escribir progreso ────────────────────────────────────

function loadProgress(progressFile) {
    try { return JSON.parse(fs.readFileSync(progressFile, 'utf8')); }
    catch { return { completed: [] }; }
}

function saveProgress(progressFile, progress) {
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2), 'utf8');
}

function loadOutput(outputFile) {
    try { return JSON.parse(fs.readFileSync(outputFile, 'utf8')); }
    catch { return []; }
}

function saveOutput(outputFile, data) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Comando: generar una categoría ───────────────────────────

async function runGeneration(target, source, level, category, count) {
    const topics      = TOPICS[level]?.[category];
    if (!topics) {
        console.error(`✗ No hay temas definidos para ${level} / ${category}`);
        process.exit(1);
    }

    const outputFile   = getOutputFile(target, source, level, category);
    const progressFile = getProgressFile(target, source, level, category);
    const progress     = loadProgress(progressFile);
    const existing     = loadOutput(outputFile);

    const pending = topics
        .map((topic, i) => ({ i, topic }))
        .filter(({ i }) => !progress.completed.includes(i));

    if (!pending.length) {
        console.log(`✅ Ya está completo: ${path.basename(outputFile)} (${topics.length} conceptos)`);
        return;
    }

    const batch = pending.slice(0, count);

    console.log(`\n🌍 ${LANGS[target]?.name || target} (target) ← ${LANGS[source]?.name || source} (native)`);
    console.log(`📚 Nivel ${level} | Categoría: ${category}`);
    console.log(`📊 Progreso: ${progress.completed.length}/${topics.length} completados`);
    console.log(`🔄 Generando ${batch.length} concepto(s) en este lote…\n`);

    for (const { i, topic } of batch) {
        console.log(`[${i + 1}/${topics.length}] ${topic}`);
        try {
            const concept = await generateConcept(target, source, level, category, i, topic);
            if (!concept.id.startsWith(source + '_')) {
                throw new Error(`ID inválido generado: "${concept.id}" (esperaba prefijo "${source}_")`);
            }
            existing.push(concept);
            saveOutput(outputFile, existing);
            progress.completed.push(i);
            saveProgress(progressFile, progress);
            console.log(`  ✅ Guardado: ${concept.id}\n`);
        } catch (err) {
            console.error(`  ❌ Error: ${err.message}\n`);
            console.error('  El lote se detiene aquí. Podés retomarlo con el mismo comando.');
            process.exit(1);
        }

        // Pausa entre llamadas para no saturar la API
        if (batch.indexOf({ i, topic }) < batch.length - 1) {
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    const remaining = topics.length - progress.completed.length;
    console.log(`\n✅ Lote completado. Archivo: ${path.relative(__dirname, outputFile)}`);
    if (remaining > 0) {
        console.log(`⏭  Faltan ${remaining} concepto(s). Volvé a correr el mismo comando para continuar.`);
    } else {
        console.log(`🎉 ¡Categoría completa! (${topics.length}/${topics.length} conceptos)`);
    }
}

// ─── Comando: --status ────────────────────────────────────────

function showStatus(target, source) {
    const levels = ['A1','A2','B1','B2','C1'];
    console.log(`\n📊 Estado: ${LANGS[target]?.name || target} ← ${LANGS[source]?.name || source}\n`);

    for (const level of levels) {
        for (const cat of CATEGORIES) {
            const topics      = TOPICS[level]?.[cat] || [];
            const outputFile  = getOutputFile(target, source, level, cat);
            const progressFile = getProgressFile(target, source, level, cat);
            const progress    = loadProgress(progressFile);
            const total       = topics.length;
            const done        = Math.min(progress.completed.length, total);
            const filled      = Math.min(10, Math.round(done / total * 10));
            const bar         = '█'.repeat(filled) + '░'.repeat(10 - filled);
            const pct         = Math.round(done / total * 100);
            const status      = done >= total ? '✅' : done === 0 ? '⬜' : '🔄';
            console.log(`  ${status} ${level} ${cat.padEnd(25)} [${bar}] ${done}/${total} (${pct}%)`);
        }
    }
    console.log('');
}

// ─── Comando: --list ──────────────────────────────────────────

function showList() {
    const targets = ['en','fr','pt','de','it','zh','ja','ko','ru','ar','gn','qu','wo','ha','yo','ig','ary'];
    const sources = ['es','en','fr','pt','de','it','gn','qu','wo','ha','yo','ig','ary'];

    console.log('\n🗺️  Pares disponibles para generación:\n');
    console.log('  Target       Source       Para lanzar');
    console.log('  ─────────────────────────────────────────────────────────────────');

    for (const t of targets) {
        for (const s of sources) {
            if (t === s) continue;
            const tName = LANGS[t]?.name.padEnd(12) || t.padEnd(12);
            const sName = LANGS[s]?.name.padEnd(12) || s.padEnd(12);
            console.log(`  ${tName} ${sName} node generate_missions.js --target=${t} --source=${s} --level=A1`);
        }
    }

    console.log('\n  Opciones:');
    console.log('  --level=A1|A2|B1|B2|C1    Nivel CEFR (default: A1)');
    console.log('  --category=gramatica|funciones_comunicativas|conversacion   (default: todas en secuencia)');
    console.log('  --count=N                  Conceptos por lote (default: 3)');
    console.log('  --from=<lang>              Reutilizar conceptos de otra fuente y solo traducir explicaciones');
    console.log('  --status                   Ver progreso de un par\n');
}

// ─── Parser de argumentos CLI ──────────────────────────────────

function parseArgs() {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        if (arg === '--list')   { args.list   = true; return; }
        if (arg === '--status') { args.status = true; return; }
        const [key, val] = arg.replace(/^--/, '').split('=');
        args[key] = val;
    });
    return args;
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
    const args = parseArgs();

    if (args.list) { showList(); return; }

    const target   = args.target;
    const source   = args.source;
    const level    = (args.level || 'A1').toUpperCase();
    const count    = parseInt(args.count || '3', 10);
    const category = args.category;
    const from     = args.from;
    const provider = args.provider || 'auto';

    initProvider(provider);

    if (args.status) {
        if (!target || !source) { console.error('--status requiere --target y --source'); process.exit(1); }
        showStatus(target, source);
        return;
    }

    if (!target || !source) {
        console.error('Uso: node generate_missions.js --target=<lang> --source=<lang> --level=<A1|A2|B1|B2|C1> [--category=<cat>] [--count=N] [--from=<lang>]');
        console.error('     node generate_missions.js --list');
        process.exit(1);
    }
    if (!LANGS[target]) { console.error(`Idioma target desconocido: ${target}. Válidos: ${Object.keys(LANGS).join(', ')}`); process.exit(1); }
    if (!LANGS[source]) { console.error(`Idioma source desconocido: ${source}. Válidos: ${Object.keys(LANGS).join(', ')}`); process.exit(1); }
    if (!TOPICS[level]) { console.error(`Nivel desconocido: ${level}. Válidos: A1 A2 B1 B2 C1`); process.exit(1); }
    if (from && !LANGS[from]) { console.error(`Idioma --from desconocido: ${from}. Válidos: ${Object.keys(LANGS).join(', ')}`); process.exit(1); }
    if (from && from === source) { console.error(`--from debe ser distinto de --source`); process.exit(1); }

    if (from) {
        // Modo reutilización: traduce explicaciones desde archivo de referencia
        if (category) {
            if (!CATEGORIES.includes(category)) {
                console.error(`Categoría inválida: ${category}. Válidas: ${CATEGORIES.join(', ')}`);
                process.exit(1);
            }
            await translateFromFile(target, source, level, category, from, count);
        } else {
            const idPrefix = new RegExp(`^${from}_`);
            for (const cat of CATEGORIES) {
                const refFile  = getOutputFile(target, from, level, cat);
                const outFile  = getOutputFile(target, source, level, cat);
                const refData  = loadOutput(refFile);
                const outData  = loadOutput(outFile);
                const outIds   = new Set(outData.map(x => x.id));
                const anyPending = refData.some(c => !outIds.has(c.id.replace(idPrefix, `${source}_`)));
                if (anyPending) {
                    await translateFromFile(target, source, level, cat, from, count);
                }
            }
            // Solo imprime "completo" si TODAS las categorías están terminadas
            const idPfx = new RegExp(`^${from}_`);
            const allDone = CATEGORIES.every(cat => {
                const refData = loadOutput(getOutputFile(target, from, level, cat));
                const outData = loadOutput(getOutputFile(target, source, level, cat));
                const outIds  = new Set(outData.map(x => x.id));
                return refData.every(c => outIds.has(c.id.replace(idPfx, `${source}_`)));
            });
            if (allDone) {
                console.log(`\n🎉 Nivel ${level} completo para ${LANGS[target]?.name} ← ${LANGS[source]?.name}`);
                showStatus(target, source);
            }
        }
    } else if (category) {
        if (!CATEGORIES.includes(category)) {
            console.error(`Categoría inválida: ${category}. Válidas: ${CATEGORIES.join(', ')}`);
            process.exit(1);
        }
        await runGeneration(target, source, level, category, count);
    } else {
        // Sin --category: genera todas las categorías del nivel en secuencia
        for (const cat of CATEGORIES) {
            const topics   = TOPICS[level]?.[cat] || [];
            const progressFile = getProgressFile(target, source, level, cat);
            const progress = loadProgress(progressFile);
            if (progress.completed.length < topics.length) {
                await runGeneration(target, source, level, cat, count);
            }
        }
        console.log(`\n🎉 Nivel ${level} completo para ${LANGS[target]?.name} ← ${LANGS[source]?.name}`);
        showStatus(target, source);
    }
}

main().catch(err => {
    console.error(`\n❌ Error fatal: ${err.message}`);
    process.exit(1);
});
