// content_library.js — Contenido curado para "Aprende con..."
// Agregá tus propios contenidos siguiendo este formato.

const CURATED_CONTENT = [
  {
    id: 'dbz-ep1',
    country: '🇯🇵', countryName: 'Japón',
    language: 'ja', languageName: 'Japonés',
    title: 'Dragon Ball Z',
    subtitle: 'Ep.1 — La llegada de Raditz',
    category: 'anime',
    thumbnail: '🐉',
    youtubeId: 'mCf7H2TIjI4',        // reemplazá con el ID real
    audioSrc: '/audio/dbz-ep1.mp3',   // poné el archivo en /audio/
    dialogue: [
      { start: 0.0,  end: 3.5,  original: 'お前が孫悟空か。',         translation: '¿Así que tú eres Son Goku?' },
      { start: 3.5,  end: 7.2,  original: '俺はラディッツ、お前の兄だ。', translation: 'Soy Raditz, tu hermano.' },
      { start: 7.2,  end: 11.0, original: '何を言っている？',           translation: '¿De qué estás hablando?' },
      { start: 11.0, end: 15.0, original: '俺と一緒に来い。',           translation: 'Ven conmigo.' },
      { start: 15.0, end: 19.5, original: '断る！',                    translation: '¡Me niego!' },
    ]
  },
  {
    id: 'friends-s01e01',
    country: '🇺🇸', countryName: 'EE.UU.',
    language: 'en', languageName: 'Inglés',
    title: 'Friends',
    subtitle: 'S01E01 — The One Where It All Began',
    category: 'serie',
    thumbnail: '☕',
    youtubeId: null,
    audioSrc: '/audio/friends-s01e01.mp3',
    dialogue: [
      { start: 0.0,  end: 3.8,  original: "There's nothing to tell!",              translation: '¡No hay nada que contar!' },
      { start: 3.8,  end: 7.5,  original: "He's just some guy I work with.",        translation: 'Es solo un tipo con el que trabajo.' },
      { start: 7.5,  end: 12.0, original: "Come on, you're going out with the guy.", translation: 'Vamos, estás saliendo con él.' },
      { start: 12.0, end: 16.0, original: "There is nothing going on!",             translation: '¡No está pasando nada!' },
      { start: 16.0, end: 20.5, original: "Ok, he asked me to coffee.",             translation: 'Ok, me invitó a tomar un café.' },
    ]
  },
  // ── Portugués — Eduardo Mundstock (Biología) ──────────────────
  {
    id: 'qHkz2Qauwn0',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Gordura Visceral  A Dose Ideal',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'qHkz2Qauwn0',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'EYuxconjw6A',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Transformação Genética',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'EYuxconjw6A',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'b_DNHgOGjdA',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'O Poder do DNA Recombinante',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'b_DNHgOGjdA',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'Yh7JmnTQ-lo',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A Testemunha Invisível',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'Yh7JmnTQ-lo',
    audioSrc: null,
    dialogue: []
  },
  {
    id: '7028n1eYGew',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Dogma Central da Biologia',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: '7028n1eYGew',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'QaN6cKU7XTk',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Desvendando o Código da Vida',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'QaN6cKU7XTk',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'iuFaDwnE85c',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Núcleo  O Manual da Vida',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'iuFaDwnE85c',
    audioSrc: null,
    dialogue: []
  },
  {
    id: '46FAn8P4wxs',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A Energia da Vida',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: '46FAn8P4wxs',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'cQXcBJL7dyw',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Citoplasma  Um Mundo Celular',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'cQXcBJL7dyw',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'F2ZOaFD_5DA',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A Membrana Plasmática',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'F2ZOaFD_5DA',
    audioSrc: null,
    dialogue: []
  },
  // ── Portugués — Eduardo Mundstock (Anatomía) ──────────────────
  {
    id: 'q1AxiVZ4glw',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A Biomáquina do Joelho',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'q1AxiVZ4glw',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'sj6KgE-MS3Q',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Mecânica do Antebraço',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'sj6KgE-MS3Q',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'l0dgVnapMOY',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Anatomia do Membro Superior',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'l0dgVnapMOY',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'MU1lS1IM5cQ',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A Sinfonia da Respiração',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'MU1lS1IM5cQ',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'gy8temtsJIQ',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Anatomia Clínica do Dorso',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'gy8temtsJIQ',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'ULluyXWrRbM',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Anatomia da Coluna  Revisão',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'ULluyXWrRbM',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'EDbo_vjyIwY',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A Pelve Humana  Um Dilema',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'EDbo_vjyIwY',
    audioSrc: null,
    dialogue: []
  },
  // ── Portugués — Eduardo Mundstock (Ejercicio y Salud) ─────────
  {
    id: 'omtQ-XDDisw',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Atividade Física e Obesidade em Crianças e Adolescentes',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'omtQ-XDDisw',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'MsPoWr0UlCY',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Exercício e Alzheimer',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'MsPoWr0UlCY',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'btFJRYaZQ9Y',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Exercício e Endotélio',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'btFJRYaZQ9Y',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'pEgTaJTn0WI',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'A perigosa síndrome CKM e a importância de um estilo de vida ativo',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'pEgTaJTn0WI',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'Mg4r_Tr_KVc',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'O exercício melhora as funções executivas em crianças',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'Mg4r_Tr_KVc',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'BEh7sw_T-lg',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'Exercício na Pré diabetes',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'BEh7sw_T-lg',
    audioSrc: null,
    dialogue: []
  },
  {
    id: 'xx80w2r8Igw',
    country: '🇧🇷', countryName: 'Portugués',
    language: 'pt', languageName: 'Portugués',
    title: 'As cidades deveriam ser das pessoas, mas são dos carros',
    subtitle: 'Eduardo Mundstock',
    category: 'video',
    thumbnail: '🎬',
    youtubeId: 'xx80w2r8Igw',
    audioSrc: null,
    dialogue: []
  },
];

// Permite que server.cjs use el mismo archivo como fuente única de verdad
if (typeof module !== 'undefined') module.exports = CURATED_CONTENT;