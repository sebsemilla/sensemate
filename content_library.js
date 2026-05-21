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
];