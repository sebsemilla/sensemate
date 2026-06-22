// flashcard_data_pron.js — Pronunciación española para angloparlantes
// Usado en el módulo "Cards A0" de la sección Misión
// Tipos de carta: 'rule', 'tf', 'fill', 'odd'

const MISION_PRON_CURRICULUM = {
    level: 'PRON',
    levelName: 'Pronunciación',
    groups: [
        {
            id: 'pron_g1',
            name: 'Pronunciación',
            icon: '🔊',
            color: '#8b5cf6',
            description: '8 reglas + ejercicios prácticos',
            cards: [

                // ── REGLAS ────────────────────────────────────────────────
                {
                    id: 'pron_c',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'C — ca, ce, ci, co, cu',
                    front: 'When "C" is followed by A, O, U → sounds like English K (hard).\nWhen followed by E or I → sounds like English S (or "th" in Spain).',
                    backItems: [
                        { label: 'ca: casa, cara',        highlight: false },
                        { label: '(s) ce: cebolla, cena', highlight: true  },
                        { label: '(s) ci: cine, cita',    highlight: true  },
                        { label: 'co: coco, cosa',        highlight: false },
                        { label: 'cu: cuna, cubo',        highlight: false },
                    ],
                },
                {
                    id: 'pron_qu',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'QU — que, qui',
                    front: 'To keep the hard K sound before E or I, Spanish writes QU. The U is always silent.',
                    backItems: [
                        { label: 'que: queso, querer, quema',    highlight: false },
                        { label: 'qui: quitar, químico, quiosco', highlight: false },
                    ],
                },
                {
                    id: 'pron_g',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'G — ga, ge, gi, go, gu',
                    front: 'When "G" is followed by A, O, U → sounds like English G (hard, as in "go").\nWhen followed by E or I → sounds like English H (soft, as in "hot").',
                    backItems: [
                        { label: 'ga: gato, gas',            highlight: false },
                        { label: '(h) ge: gente, genio',     highlight: true  },
                        { label: '(h) gi: girar, gigante',   highlight: true  },
                        { label: 'go: gol, gordo',           highlight: false },
                        { label: 'gu: gusano, gusto',        highlight: false },
                    ],
                },
                {
                    id: 'pron_gue',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'GUE / GUI',
                    front: 'To keep the hard G sound before E or I, Spanish adds a silent U: GUE sounds like "get", GUI sounds like "geese".',
                    backItems: [
                        { label: 'gue: guerra, guerrero, gueto',  highlight: false },
                        { label: 'gui: guitarra, guía, águila',   highlight: false },
                    ],
                },
                {
                    id: 'pron_ll',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'LL — lla, lle, llo, llu',
                    front: '"LL" sounds like the Y in English "million" in most regions.\nIn Argentina/Uruguay it sounds like SH.',
                    backItems: [
                        { label: 'lla: llave, llama',       highlight: false },
                        { label: 'lle: llegar, llene',      highlight: false },
                        { label: 'llo: llover, pollo',      highlight: false },
                        { label: 'llu: lluvia, lluvioso',   highlight: false },
                    ],
                },
                {
                    id: 'pron_n',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'Ñ — ña, ñe, ño, ñu',
                    front: '"Ñ" sounds like English /ny/ in "canyon".',
                    backItems: [
                        { label: 'ña: ñato, ñaña',   highlight: false },
                        { label: 'ñe: ñeco, ñeque',  highlight: false },
                        { label: 'ño: niño, ñoño',   highlight: false },
                        { label: 'ñu: ñu (animal)',  highlight: false },
                    ],
                },
                {
                    id: 'pron_rr',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'R inicial / RR',
                    front: 'At the start of a word, or written as RR between vowels → strongly trilled (multiple taps of the tongue).',
                    backItems: [
                        { label: 'rra: perra, raro, rana',       highlight: false },
                        { label: 'rre: guerrero, rezar',         highlight: false },
                        { label: 'rri: risa, perrito, arriba',   highlight: false },
                        { label: 'rro: rosa, corro, barro',      highlight: false },
                        { label: 'rru: rusia, burro',            highlight: false },
                    ],
                },
                {
                    id: 'pron_r',
                    type: 'rule',
                    emoji: '🔤',
                    word: 'R suave (interior)',
                    front: 'A single R inside a word (not at the start, not after N/L/S) is a soft tap — like the American English "tt" in "butter".',
                    backItems: [
                        { label: 'ra: cara, para',           highlight: false },
                        { label: 're: pera, pero',           highlight: false },
                        { label: 'ri: María, carita, alegría', highlight: false },
                        { label: 'ro: coro, toro',           highlight: false },
                        { label: 'ru: Perú, Uruguay',        highlight: false },
                    ],
                },

                // ── EJERCICIOS: Verdadero / Falso ────────────────────────
                {
                    id: 'pron_tf_01',
                    type: 'tf',
                    emoji: '❓',
                    word: 'Verdadero o Falso',
                    front: 'La palabra "cena" — La "c" suena como /k/ (como en "casa").',
                    answer: false,
                    explanation: '✗ Falso. "Ce" tiene "c" suave → suena como /s/ (o /θ/ en España). Solo ca/co/cu son duras.',
                },
                {
                    id: 'pron_tf_02',
                    type: 'tf',
                    emoji: '❓',
                    word: 'Verdadero o Falso',
                    front: 'La palabra "guitarra" — La "u" después de la "g" es silenciosa.',
                    answer: true,
                    explanation: '✓ Verdadero. GUI conserva el sonido /g/ duro y la U no se pronuncia.',
                },
                {
                    id: 'pron_tf_03',
                    type: 'tf',
                    emoji: '❓',
                    word: 'Verdadero o Falso',
                    front: 'La palabra "hielo" — La "h" suena como una "j" suave.',
                    answer: false,
                    explanation: '✗ Falso. La H en español es siempre muda. "Hielo" se pronuncia /ˈje.lo/, sin ningún sonido de H.',
                },

                // ── EJERCICIOS: Completar la palabra ─────────────────────
                {
                    id: 'pron_fill_01',
                    type: 'fill',
                    emoji: '✏️',
                    word: '_ _ eso',
                    front: '¿Qué sílaba falta? → ce / que / ke',
                    answer: 'que → queso',
                    explanation: 'Ante E, el sonido /k/ se escribe QU. "Queso" = /ˈke.so/.',
                },
                {
                    id: 'pron_fill_02',
                    type: 'fill',
                    emoji: '✏️',
                    word: '_ itarra',
                    front: '¿Cómo se escribe? → guitarra / jitarra',
                    answer: 'guitarra',
                    explanation: 'GU + I mantiene el sonido /g/ duro. La U es silenciosa.',
                },
                {
                    id: 'pron_fill_03',
                    type: 'fill',
                    emoji: '✏️',
                    word: 'ni _ o',
                    front: '¿Qué letra va en el espacio? → n / ñ',
                    answer: 'ñ → niño',
                    explanation: '"Ñ" da el sonido /ny/. Sin la tilde, "nino" sonaría diferente.',
                },

                // ── EJERCICIOS: El intruso ────────────────────────────────
                {
                    id: 'pron_odd_01',
                    type: 'odd',
                    emoji: '🔍',
                    word: '¿Cuál es el intruso?',
                    front: 'Tres palabras tienen "c" dura (/k/), una tiene "c" suave (/s/).',
                    options: ['casa', 'coche', 'cine', 'cuna'],
                    answer: 'cine',
                    explanation: '"cine" — ci tiene "c" suave (/s/). Las otras (ca, co, cu) son duras (/k/).',
                },
            ],
        },
    ],
};
