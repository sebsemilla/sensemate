#!/usr/bin/env node
// generate_alphabet.js — Generador de módulos A0 (abecedario/script) para SenseMate
// Uso:
//   node generate_alphabet.js --target=ko [--source=es]
//   node generate_alphabet.js --target=ja --source=es
//   node generate_alphabet.js --target=ru
//   node generate_alphabet.js --list
//   node generate_alphabet.js --status --target=ko
//
// Genera los grupos del nivel A0 para cada idioma:
//   - Scripts no latinos (ko, ja, zh, ru, ar): introduce el sistema de escritura
//   - Scripts latinos (en, de, fr, pt, it): pronunciación y caracteres especiales
//
// Salida: flashcard_data_alpha.js  (mismo formato que flashcard_data.js)
// Progreso: .progress_alpha_{target}.json  (en el mismo directorio)

import OpenAI from 'openai';
import fs     from 'fs';
import path   from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const client = new OpenAI({
    apiKey:  process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
});

// ─── Metadatos de idiomas ──────────────────────────────────────

const LANGS = {
    es: { name: 'Español',    nameEn: 'Spanish'    },
    en: { name: 'Inglés',     nameEn: 'English'    },
    fr: { name: 'Francés',    nameEn: 'French'     },
    pt: { name: 'Portugués',  nameEn: 'Portuguese' },
    de: { name: 'Alemán',     nameEn: 'German'     },
    it: { name: 'Italiano',   nameEn: 'Italian'    },
    zh: { name: 'Chino',      nameEn: 'Mandarin'   },
    ja: { name: 'Japonés',    nameEn: 'Japanese'   },
    ko: { name: 'Coreano',    nameEn: 'Korean'     },
    ru: { name: 'Ruso',       nameEn: 'Russian'    },
    ar: { name: 'Árabe',      nameEn: 'Arabic'     },
    gn: { name: 'Guaraní',    nameEn: 'Guaraní'    },
    qu: { name: 'Quechua',    nameEn: 'Quechua'    },
    wo: { name: 'Wolof',      nameEn: 'Wolof'      },
    ha: { name: 'Hausa',      nameEn: 'Hausa'      },
    yo: { name: 'Yoruba',     nameEn: 'Yoruba'     },
};

// ─── Configuración de grupos por idioma ───────────────────────
// scriptType: 'latin' | 'cyrillic' | 'hangul' | 'kana' | 'pinyin' | 'arabic'
// Cada grupo define qué debe cubrir el modelo (scope).

const LANG_CONFIGS = {

    en: {
        scriptType: 'latin',
        levelName:  'El inglés — pronunciación',
        groups: [
            {
                slug: 'vowel_sounds', name: 'Sonidos vocálicos', icon: '🔊', color: '#6366f1',
                description: 'Las vocales en inglés tienen múltiples sonidos',
                letterCards: ['A','E','I','O','U'],
                scope: `The 5 English vowels and their KEY sounds vs Spanish:
- A: long /eɪ/ (name, late) vs short /æ/ (cat, hand) vs schwa /ə/ (about)
- E: long /iː/ (he, feet) vs short /ɛ/ (bed, red)
- I: long /aɪ/ (like, time) vs short /ɪ/ (sit, fish)
- O: long /oʊ/ (go, home) vs short /ɒ/ (hot, dog)
- U: long /juː/ (use, cute) vs short /ʌ/ (cup, but) vs /ʊ/ (put, book)
Generate 1 isLetter card per vowel (showing both sounds with examples) + 2 vocabulary cards per vowel.`,
            },
            {
                slug: 'special_consonants', name: 'Consonantes especiales', icon: '🔡', color: '#f59e0b',
                description: 'Consonantes que suenan diferente al español',
                letterCards: ['H','J','W','Y','TH','SH','CH'],
                scope: `English consonants that differ from Spanish — generate 1 isLetter card per:
- H: always pronounced /h/ (never silent like Spanish), e.g. "house", "hello"
- J: /dʒ/ sound (like "ch" in "mucho" but voiced), e.g. "jump", "job"
- W: /w/ (like a quick "u"), e.g. "water", "work"
- Y: /j/ as consonant (like Spanish "y"), e.g. "yes", "year"
- TH: two sounds — /θ/ voiceless (think, three) and /ð/ voiced (the, this)
- SH: /ʃ/ (she, show, fish)
- CH: /tʃ/ (chair, child, teach)
Then 1 vocabulary card per letter/digraph (7 total vocab cards).`,
            },
            {
                slug: 'key_combos', name: 'Combinaciones clave', icon: '🔀', color: '#10b981',
                description: 'Grupos de letras con un solo sonido en inglés',
                letterCards: ['PH','GH','WR','KN','QU','CK'],
                scope: `English letter combinations with unexpected pronunciations — 1 isLetter card per:
- PH: /f/ (phone, photo, elephant)
- GH: silent or /f/ (night=silent, laugh=/f/)
- WR: /r/ (W silent: write, wrong, wrap)
- KN: /n/ (K silent: know, knife, knee)
- QU: /kw/ (queen, question, quiet)
- CK: /k/ at end of syllable (back, kick, duck)
Then 1 vocabulary card per combination (6 vocab cards).`,
            },
        ],
    },

    de: {
        scriptType: 'latin',
        levelName:  'El alemán — caracteres y pronunciación',
        groups: [
            {
                slug: 'umlauts', name: 'Umlauts y ß', icon: '🔤', color: '#6366f1',
                description: 'ä · ö · ü · ß — los caracteres únicos del alemán',
                letterCards: ['Ä','Ö','Ü','ß'],
                scope: `German special characters — 1 isLetter card per:
- Ä /ɛ/: like "e" in "bed" — Bär (bear), Käse (cheese), schön vs schöner
- Ö /ø/: no Spanish equivalent — round lips for "e" — Öl (oil), hören (to hear)
- Ü /y/: no Spanish equivalent — round lips for "i" — über (over), Tür (door)
- ß /ss/: sharp s after long vowels — Straße (street), groß (big), heißen (to be called)
Include: how to type when ß unavailable (ss), and Ä/Ö/Ü capitalization rules.
Then 2 vocabulary cards per special character (8 vocab cards total).`,
            },
            {
                slug: 'consonant_sounds', name: 'Consonantes alemanas', icon: '🔡', color: '#f59e0b',
                description: 'J · W · V · Z · CH · SP/ST — sonidos propios',
                letterCards: ['J','W','V','Z','CH','SP'],
                scope: `German consonants that differ from Spanish — 1 isLetter card per:
- J: /j/ (like Spanish Y) — ja (yes), jung (young), Jahr (year)
- W: /v/ (like Spanish V/B) — Wasser (water), wo (where), wir (we)
- V: /f/ in most words — Vater (father), vier (four); /v/ in foreign words (Visum)
- Z: /ts/ (like "ts" in "pizza") — Zeit (time), zehn (ten), Zug (train)
- CH: two sounds — /x/ after a,o,u (Bach, noch) and /ç/ after e,i,ei,eu (ich, nicht, mich)
- SP/ST at word start: SP=/ʃp/ (sprechen), ST=/ʃt/ (Stadt, stehen)
Then 1 vocabulary card per letter/combo (6 vocab cards).`,
            },
            {
                slug: 'vowel_length', name: 'Vocales largas y cortas', icon: '⏱️', color: '#10b981',
                description: 'La duración de la vocal cambia el significado',
                letterCards: ['A_LONG','E_LONG','I_LONG','O_LONG','U_LONG'],
                scope: `German vowel length — 1 isLetter card per vowel pair (long vs short):
- A: lang /aː/ (Bahn, Staat, zahlen) vs kurz /a/ (Mann, kann, Rand)
- E: lang /eː/ (See, Tee, gehen) vs kurz /ɛ/ (Bett, Herr, kennen)
- I: lang /iː/ (ih, ie: ihn, Dieb, viel) vs kurz /ɪ/ (mit, ist, Kind)
- O: lang /oː/ (Sohn, Boot, wohnen) vs kurz /ɔ/ (von, Gott, kommen)
- U: lang /uː/ (gut, Stuhl, Buch) vs kurz /ʊ/ (und, Mutter, Hunger)
Tip: double vowel or 'h' after = long; double consonant after = short.
Then 2 vocabulary pairs showing minimal pairs (10 vocab cards total).`,
            },
        ],
    },

    fr: {
        scriptType: 'latin',
        levelName:  'El francés — acentos y sonidos',
        groups: [
            {
                slug: 'accents', name: 'Acentos y cedilla', icon: '🔤', color: '#6366f1',
                description: 'é · è · ê · ë · â · î · ô · û · ç',
                letterCards: ['É','È','Ê','Ë','Â','Î','Ô','Û','Ç'],
                scope: `French accent marks — 1 isLetter card per:
- É /e/ aigu: closed e — été (summer), café, étudier
- È /ɛ/ grave: open e — père (father), mère (mother), après
- Ê /ɛ/ circumflex: open e (historical) — fête (party), tête (head), être
- Ë trema: pronounced separately — Noël (Christmas), naïf
- Â circumflex A: slightly back /ɑ/ — château, pâte, grâce
- Î circumflex I: same /i/ — île (island), boîte (box)
- Ô circumflex O: closed /o/ — côté (side), hôtel, tôt (early)
- Û circumflex U: same /y/ — sûr (sure), dû (due)
- Ç cedilla: /s/ before a,o,u — français, garçon, leçon
Then 1 vocabulary card per accent (9 vocab cards).`,
            },
            {
                slug: 'nasal_vowels', name: 'Vocales nasales', icon: '👃', color: '#f59e0b',
                description: 'an/en · in/ain · on · un — sonidos que no existen en español',
                letterCards: ['AN','IN','ON','UN'],
                scope: `French nasal vowels — 1 isLetter card per nasal:
- AN/EN /ɑ̃/: enfant (child), temps (time), grand, restaurant, français
- IN/AIN/EIN /ɛ̃/: vin (wine), pain (bread), sein, main (hand), cinq
- ON /ɔ̃/: bon (good), sont (are), monde (world), maison, garçon
- UN/UM /œ̃/: un (a/one), lundi (Monday), parfum (perfume)
Key rule: n/m after vowel = nasal ONLY if followed by consonant or at word end. "Ane" ≠ nasal.
Then 2 vocabulary cards per nasal sound (8 vocab cards total).`,
            },
            {
                slug: 'silent_letters', name: 'Letras mudas y liaison', icon: '🤫', color: '#10b981',
                description: 'Las letras que no se pronuncian — y cuándo sí',
                letterCards: ['H_MUET','H_ASPIRÉ','FINALE','LIAISON'],
                scope: `French silent letters — 1 isLetter card per:
- H muet (silent, allows liaison): l'heure, l'homme, l'hôpital — contraction + liaison
- H aspiré (no liaison, no contraction): le haricot, la honte — NO "l'haricot"
- Final consonants: usually silent — grand /ɡʁɑ̃/, vous parlez /parle/, beaucoup /boku/
  Exceptions: chef, lac, fil, fils, or, cap — CaReFuL rule
- Liaison: final silent consonant IS pronounced before vowel — les amis /lezami/, vous avez /vuzave/
Then 2 vocabulary examples per rule (8 vocab cards).`,
            },
        ],
    },

    pt: {
        scriptType: 'latin',
        levelName:  'El portugués — sonidos y acentos',
        groups: [
            {
                slug: 'nasals_accents', name: 'Nasales y acentos', icon: '🔤', color: '#6366f1',
                description: 'ã · õ · â · ê · à · ç y las vocales nasales',
                letterCards: ['Ã','Õ','Â','Ê','À','Ç'],
                scope: `Portuguese special characters — 1 isLetter card per:
- Ã /ɐ̃/: nasal a — irmã (sister), maçã (apple), romã, são
- Õ /õ/: nasal o — leões (lions), nações (nations), põe
- Â /ɐ/: stressed back a — câmara, lâmpada, câmbio
- Ê /e/: closed stressed e — você, mês (month), três (three)
- À: contraction of a+a (Brazil: rarely) — à (to the, fem.), às cinco
- Ç /s/: before a,o,u — façanha, açúcar, caça, força
Also: nasal vowels before m/n in same syllable — campo, canto, sinto, junto
Then 2 vocabulary cards per accent (12 vocab cards total).`,
            },
            {
                slug: 'consonant_sounds', name: 'Consonantes del portugués', icon: '🔡', color: '#f59e0b',
                description: 'lh · nh · rr · x · s entre vocales · j/g',
                letterCards: ['LH','NH','RR','X_PT','S_VOICED'],
                scope: `Portuguese consonant specifics — 1 isLetter card per:
- LH /ʎ/: like Spanish LL — filho (son), folha (leaf), trabalho (work)
- NH /ɲ/: like Spanish Ñ — linha (line), vinho (wine), manhã (morning)
- RR /ʁ/ or /x/: guttural — carro (car), terra (earth), correto
  vs single R at start /ʁ/: rato (mouse), rio (river)
- X: 4 sounds — /ʃ/ (caixa=box), /ks/ (táxi), /s/ (próximo), /z/ (exame)
- S between vowels /z/: casa /kaza/, rosa /ʁoza/, mesa /meza/
  vs S at start /s/: sala, sol, sim
Then 1 vocabulary card per combo (5 vocab cards).`,
            },
        ],
    },

    it: {
        scriptType: 'latin',
        levelName:  'El italiano — sonidos especiales',
        groups: [
            {
                slug: 'vowels_accents', name: 'Vocales y acentos', icon: '🔤', color: '#6366f1',
                description: 'è vs é · à · ì · ò · ù y las vocales abiertas/cerradas',
                letterCards: ['È','É','À','Ì','Ò','Ù'],
                scope: `Italian vowels and accent marks — 1 isLetter card per:
- È /ɛ/ grave: open e — è (is), caffè, perché (but this = é)
- É /e/ acute: closed e — perché (because/why), né (neither), sé (itself)
- À: stressed à — là (there), già (already), più, può
- Ì: stressed ì — lì (there), così (so), tassì (taxi)
- Ò: open o — però (but), ciò (this), po' (a bit)
- Ù: stressed ù — più (more), giù (down), virtù
Key: Italian vowels are pure, never diphthongized like English. Always clear and full.
Then 1 vocabulary card per accent (6 vocab cards).`,
            },
            {
                slug: 'special_consonants', name: 'Consonantes especiales y geminadas', icon: '🔡', color: '#f59e0b',
                description: 'gn · gl · sc · ci/ce · ch/gh · dobles',
                letterCards: ['GN','GLI','SCI','CI_CE','CHI_CHE','DOPPIE'],
                scope: `Italian special consonants — 1 isLetter card per:
- GN /ɲ/: like Spanish Ñ — gnocchi, gnomo, ogni (every), signore
- GLI /ʎ/: like LL in "millón" — figlio (son), voglio (I want), luglio (July)
- SC+I/E /ʃ/: pesce (fish), scena (scene), sciare (to ski), lasciare
- C+I/E /tʃ/: ciao, cena (dinner), cinema, dolce (sweet), facile
- CH+I/E /k/ (hard): chi (who), che (that/which), perché, anche (also)
- G+I/E /dʒ/ soft vs GH+I/E /g/ hard: gelato /dʒ/ vs ghiaccio /g/
- Consonanti doppie (geminate): double consonants are longer — nonna vs nona, cassa vs casa
Then 2 vocabulary cards per group (12 vocab cards total).`,
            },
        ],
    },

    ru: {
        scriptType: 'cyrillic',
        levelName:  'El alfabeto cirílico',
        groups: [
            {
                slug: 'latin_lookalikes', name: 'Letras parecidas al latín', icon: '🔤', color: '#6366f1',
                description: 'А Е О М Т К В Н Р С — entrada fácil al cirílico',
                letterCards: ['А','Е','О','М','Т','К','В','Н','Р','С'],
                scope: `Cyrillic letters visually similar to Latin — 1 isLetter card per letter:
- А /a/: identical to Latin A — мама (mama), папа (papa)
- Е /je/: like Latin E but sounds like "YE" — нет (nyet=no), где (gde=where)
- О /o/: identical to Latin O — он (on=he), она (ona=she)
- М /m/: identical to Latin M — мир (mir=world/peace), мой (moy=my)
- Т /t/: identical to Latin T — ты (ty=you), там (tam=there)
- К /k/: identical to Latin K — как (kak=how), кто (kto=who)
- В /v/: looks like B but sounds like V — вода (voda=water), вот (vot=here is)
- Н /n/: looks like H but sounds like N — но (no=but), нет (nyet=no)
- Р /r/: looks like P but sounds like R (rolled) — Россия, рад (glad)
- С /s/: looks like C but sounds like S — сон (son=dream), сок (sok=juice)
Each card: show the letter, IPA, Spanish approximation, mnemonic, 2 example words.
Include 2 vocabulary cards per letter pair (false-friend warning emphasized).`,
            },
            {
                slug: 'new_shapes', name: 'Letras nuevas — sonidos conocidos', icon: '🔡', color: '#f59e0b',
                description: 'Б Г Д З И Л П Ф Э Ю Я — formas nuevas, sonidos familiares',
                letterCards: ['Б','Г','Д','З','И','Л','П','Ф','Э','Ю','Я'],
                scope: `New Cyrillic shapes but familiar sounds — 1 isLetter card per:
- Б /b/: like Spanish B — брат (brat=brother), банк (bank)
- Г /g/: like Spanish G (always hard) — где (where), год (god=year)
- Д /d/: like Spanish D — да (da=yes), дом (dom=house)
- З /z/: like Spanish S (voiced) — завтра (zavtra=tomorrow), зима (zima=winter)
- И /i/: like Spanish I — или (ili=or), имя (imya=name)
- Л /l/: like Spanish L — лес (les=forest), люди (lyudi=people)
- П /p/: looks like π, sounds like P — парк (park), привет (privet=hello)
- Ф /f/: like Spanish F — фото (photo), факт (fact)
- Э /e/: like open E (no Y glide) — это (eto=this), этаж (etazh=floor)
- Ю /ju/: like "you" — юг (yug=south), люблю (lyublyu=I love)
- Я /ja/: like "ya" — я (ya=I), язык (yazyk=language/tongue)
2 vocabulary cards per letter.`,
            },
            {
                slug: 'unique_sounds', name: 'Sonidos únicos del ruso', icon: '🔣', color: '#10b981',
                description: 'Ж Ш Щ Ч Х Ц Ъ Ь Ы — los sonidos más difíciles',
                letterCards: ['Ж','Ш','Щ','Ч','Х','Ц','Ъ','Ь','Ы'],
                scope: `Uniquely Russian sounds — 1 isLetter card per:
- Ж /ʒ/: like French J or English "measure" — жить (zhit=to live), муж (muzh=husband)
- Ш /ʃ/: like SH in "shoe" — школа (shkola=school), хорошо (khorosho=good/OK)
- Щ /ɕɕ/: soft prolonged SH — щи (shchi=cabbage soup), ещё (yeshchyo=still/more)
- Ч /tɕ/: like CH in "cheap" (softer) — что (shto=what), чай (chay=tea)
- Х /x/: like Spanish J — хлеб (khleb=bread), хорошо (khorosho=good)
- Ц /ts/: like "ts" in "pizza" — цена (tsena=price), отец (otets=father)
- Ъ hard sign: separates prefix+vowel, no sound itself — объект (ob'yekt=object), съезд
- Ь soft sign: softens preceding consonant — мать (mat'=mother), пять (pyat'=five)
- Ы /ɨ/: between I and U, no equivalent — ты (ty=you), мы (my=we), сын (syn=son)
Include mnemonic for each difficult sound. 1-2 vocab cards per letter.`,
            },
            {
                slug: 'reading_practice', name: 'Primeras palabras rusas', icon: '📖', color: '#ef4444',
                description: 'Leer y entender 20 palabras rusas esenciales',
                letterCards: [],
                scope: `Russian reading practice — NO isLetter cards in this group.
Generate 20 vocabulary cards of the most essential Russian words a beginner encounters.
For each card:
  - word: the Russian word in Cyrillic
  - phonetic: romanized pronunciation (not strict IPA, use readable romanization)
  - translation: Spanish translation
  - letter: the first letter of the word (for the badge)
  - examples: 2 short sentences in Russian with Spanish translation
Words to cover: да, нет, привет, пока, спасибо, пожалуйста, как дела?, хорошо,
я, ты, он, она, мы, что, где, здесь, там, это, и, или.
Mark important parts with <b>bold</b> in examples.`,
            },
        ],
    },

    ko: {
        scriptType: 'hangul',
        levelName:  'El Hangul',
        groups: [
            {
                slug: 'basic_vowels', name: 'Vocales básicas', icon: '🔤', color: '#6366f1',
                description: 'ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ ㅐ ㅔ — las 8 vocales simples',
                letterCards: ['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ','ㅐ','ㅔ'],
                scope: `Korean basic vowels (모음) — 1 isLetter card per vowel:
- ㅏ /a/: like Spanish A — combined with silent ㅇ: 아 → words: 아버지(father), 나(I)
- ㅓ /ʌ/ (like A in "about"): 어 → 어머니(mother), 어디(where)
- ㅗ /o/: like Spanish O — 오 → 오다(to come), 소(cow), 보다(to see)
- ㅜ /u/: like Spanish U — 우 → 우리(we/our), 물(water), 두(two)
- ㅡ /ɯ/ (no equivalent, tongue back-center): 으 → 으로(towards), 음식(food)
- ㅣ /i/: like Spanish I — 이 → 이름(name), 시(city/hour), 미(beauty)
- ㅐ /ɛ/ (like E in "bed"): 애 → 애기(baby), 개(dog), 내(my)
- ㅔ /e/ (like É in French): 에 → 에서(from/at), 세(three), 네(yes/four)
Each card: show the vowel shape, how it's drawn, IPA, Spanish closest sound,
mnemonic for the shape, and 2 example syllables with words.`,
            },
            {
                slug: 'basic_consonants', name: 'Consonantes básicas', icon: '🔡', color: '#f59e0b',
                description: 'ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅎ',
                letterCards: ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅎ'],
                scope: `Korean basic consonants (자음) — 1 isLetter card per:
- ㄱ /g~k/: like G (voiced middle, K at end) — 가(go), 국(soup), 고기(meat)
- ㄴ /n/: like N — 나(I), 눈(eye/snow), 나라(country)
- ㄷ /d~t/: like D (voiced middle, T at end) — 도(also), 다(all), 단어(word)
- ㄹ /r~l/: between R and L (flap) — 라디오(radio), 물(water), 말(language/horse)
- ㅁ /m/: like M — 마(yes archaic), 물(water), 마음(heart/mind)
- ㅂ /b~p/: like B (voiced middle, P at end) — 바(bar), 밥(rice/meal), 배(stomach/pear/boat)
- ㅅ /s~ʃ/: like S (like SH before 이) — 사람(person), 시간(time), 수(number)
- ㅇ: SILENT at start of syllable, /ŋ/ at end — 아(oh!), 영어(English), 방(room)
- ㅈ /dʒ~tɕ/: like J — 자(letter/sleep), 저(I formal), 주다(to give)
- ㅎ /h/: like H — 하다(to do), 학교(school), 한국(Korea)
Each card: show shape, IPA (initial vs final position), mnemonic, syllable + 2 words.`,
            },
            {
                slug: 'aspirated_tense', name: 'Aspiradas y tensas', icon: '💨', color: '#10b981',
                description: 'ㅋ ㅌ ㅍ ㅊ aspiradas · ㄲ ㄸ ㅃ ㅆ ㅉ tensas',
                letterCards: ['ㅋ','ㅌ','ㅍ','ㅊ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ'],
                scope: `Korean aspirated and tense consonants — 1 isLetter card per:
ASPIRATED (with puff of air, like P in "pin"):
- ㅋ /kʰ/: ㄱ + aspiration — 커피(coffee), 카드(card), 크다(big)
- ㅌ /tʰ/: ㄷ + aspiration — 타다(to ride), 택시(taxi), 틀리다(to be wrong)
- ㅍ /pʰ/: ㅂ + aspiration — 파(green onion), 팔(arm), 피(blood)
- ㅊ /tɕʰ/: ㅈ + aspiration — 차(tea/car), 창문(window), 책(book)
TENSE (throat-tightened, no aspiration, no voicing):
- ㄲ /k͈/: 까다(peel), 꽃(flower), 꿈(dream)
- ㄸ /t͈/: 따뜻하다(warm), 딸(daughter), 때(time)
- ㅃ /p͈/: 빠르다(fast), 뽀뽀(kiss), 빨리(quickly)
- ㅆ /s͈/: 씩(each), 쓰다(write/use/bitter), 씩씩하다(brave)
- ㅉ /tɕ͈/: 짜다(salty/weave), 쪽(direction), 찌다(steam)
Show contrast: ㄱ vs ㅋ vs ㄲ with the same vowel. 1 vocab card per consonant.`,
            },
            {
                slug: 'syllable_blocks', name: 'Bloques silábicos', icon: '🧩', color: '#ef4444',
                description: 'Cómo se combinan letras en sílabas completas',
                letterCards: [],
                scope: `Korean syllable block structure — NO isLetter cards.
Generate 20 vocabulary cards showing how syllable blocks work:
- CV structure: 가(ga) 나(na) 다(da) — show the combination logic
- CVC with 받침 (final consonant): 밥(bap=rice) 집(jip=house) 국(guk=soup) 책(chaek=book)
- CV+V compound vowels: ㅘ(wa) ㅝ(wo) ㅚ(we/oe) — words: 와(come!) 봐(look!) 돼(become!)
- Double 받침: 읽다(read) 닭(chicken) 삶(life)
- Pronunciation rules: final ㅎ often silent, ㅇ before vowel = liaison
Include 8 "reading challenge" vocab cards: 안녕하세요(hello) 감사합니다(thank you)
사랑해(I love you) 한국어(Korean language) 맛있어요(delicious) 괜찮아요(it's OK)
공부하다(to study) 친구(friend).
All cards: show Hangul, romanization, and Spanish translation.`,
            },
        ],
    },

    ja: {
        scriptType: 'kana',
        levelName:  'Hiragana y Katakana',
        groups: [
            {
                slug: 'hiragana_1', name: 'Hiragana — parte 1', icon: '🔤', color: '#6366f1',
                description: 'あ行 か行 さ行 た行 な行 — primeras 25 sílabas',
                letterCards: ['あ','か','さ','た','な'],
                scope: `Hiragana rows 1-5 — 1 isLetter card per ROW (not per character):
- あ行 (a-row): あ(a) い(i) う(u) え(e) お(o) — IPA + stroke order hint + mnemonic
- か行 (ka-row): か(ka) き(ki) く(ku) け(ke) こ(ko) — words: かさ(umbrella) きれい(pretty)
- さ行 (sa-row): さ(sa) し(shi) す(su) せ(se) そ(so) — words: さくら(cherry) すし(sushi)
- た行 (ta-row): た(ta) ち(chi) つ(tsu) て(te) と(to) — NOTE: chi/tsu irregular
- な行 (na-row): な(na) に(ni) ぬ(nu) ね(ne) の(の) — words: なに(what) ねこ(cat)
Each isLetter card shows all 5 characters in the row with phonetics and a mnemonic per character.
Then generate 5 vocabulary cards (one per row) using words only from those kana:
あさ(morning) きく(to hear) すし(sushi) たべる(to eat) ねる(to sleep).`,
            },
            {
                slug: 'hiragana_2', name: 'Hiragana — parte 2', icon: '🔡', color: '#f59e0b',
                description: 'は行 ま行 や行 ら行 わ行 ん + dakuten',
                letterCards: ['は','ま','や','ら','わ','ん','゛'],
                scope: `Hiragana rows 6-10 + special — 1 isLetter card per ROW:
- は行: は(ha) ひ(hi) ふ(fu) へ(he) ほ(ho) — NOTE: ふ is /ɸu/ not fu
- ま行: ま(ma) み(mi) む(mu) め(me) も(mo)
- や行: や(ya) ゆ(yu) よ(yo) — only 3 characters
- ら行: ら(ra) り(ri) る(ru) れ(re) ろ(ro) — NOTE: /r/ is a flap, between R and L
- わ行: わ(wa) を(wo/o — only as particle) — and ん(n) standalone nasal
- Dakuten ゛and handakuten ゜: voiced versions: が(ga) ざ(za) だ(da) ば(ba) ぱ(pa)
Generate 7 vocabulary cards: はな(flower) みず(water) やま(mountain)
られる(can do) わたし(I) ありがとう(thank you) にほん(Japan).`,
            },
            {
                slug: 'katakana_1', name: 'Katakana — parte 1', icon: '🔠', color: '#10b981',
                description: 'ア行 カ行 サ行 タ行 ナ行 — comparando con hiragana',
                letterCards: ['ア','カ','サ','タ','ナ'],
                scope: `Katakana rows 1-5 — 1 isLetter card per ROW, always showing hiragana equivalent:
- ア行: ア(a)=あ イ(i)=い ウ(u)=う エ(e)=え オ(o)=お
- カ行: カ(ka)=か キ(ki)=き ク(ku)=く ケ(ke)=け コ(ko)=こ
- サ行: サ(sa)=さ シ(shi)=し ス(su)=す セ(se)=せ ソ(so)=そ
- タ行: タ(ta)=た チ(chi)=ち ツ(tsu)=つ テ(te)=て ト(to)=と
- ナ行: ナ(na)=な ニ(ni)=に ヌ(nu)=ぬ ネ(ne)=ね ノ(no)=の
KEY: Katakana is used for foreign loanwords and foreign names.
Include mnemonic comparing katakana shape to hiragana shape.
Vocabulary cards: コーヒー(coffee) テレビ(TV) アイスクリーム(ice cream)
タクシー(taxi) ニュース(news) — note the long vowel mark ー.`,
            },
            {
                slug: 'katakana_2', name: 'Katakana — parte 2', icon: '🔣', color: '#ef4444',
                description: 'ハ行 マ行 ヤ行 ラ行 ワ行 + préstamos',
                letterCards: ['ハ','マ','ヤ','ラ','ワ'],
                scope: `Katakana rows 6-10 — 1 isLetter card per ROW:
- ハ行: ハ(ha) ヒ(hi) フ(fu) ヘ(he) ホ(ho)
- マ行: マ(ma) ミ(mi) ム(mu) メ(me) モ(mo)
- ヤ行: ヤ(ya) ユ(yu) ヨ(yo)
- ラ行: ラ(ra) リ(ri) ル(ru) レ(re) ロ(ro)
- ワ行: ワ(wa) ヲ(wo) ン(n) + long vowel ー
Loanword vocabulary cards (8 total):
ホテル(hotel) レストラン(restaurant) パスポート(passport)
スマートフォン(smartphone) コンピューター(computer)
バス(bus) ビール(beer) チョコレート(chocolate).
Each card: katakana spelling, romanization, original English word, Spanish translation.`,
            },
            {
                slug: 'kanji_intro', name: 'Primeros Kanji', icon: '漢', color: '#8b5cf6',
                description: '日 月 火 水 木 金 土 + números + personas',
                letterCards: ['日','月','火','水','木','金','土','一'],
                scope: `Introduction to Kanji — 1 isLetter card per Kanji:
Numbers: 一(ichi=1) 二(ni=2) 三(san=3) 四(shi/yon=4) 五(go=5)
         六(roku=6) 七(shichi/nana=7) 八(hachi=8) 九(ku/kyuu=9) 十(juu=10)
Days/elements: 日(nichi/bi/hi — sun/day) 月(gatsu/tsuki — moon/month)
               火(ka — fire/Tuesday) 水(sui — water/Wednesday)
               木(moku — tree/Thursday) 金(kin — gold/Friday) 土(do — earth/Saturday)
Common: 人(hito/jin — person) 山(yama/san — mountain) 川(kawa — river)
        大(dai/oo — big) 小(shou/ko — small)
Each card: show kanji, ON reading (Chinese-origin), KUN reading (Japanese),
Spanish meaning, visual mnemonic describing the pictograph origin,
example word using the kanji.`,
            },
        ],
    },

    zh: {
        scriptType: 'pinyin',
        levelName:  'Pinyin y tonos del chino mandarín',
        groups: [
            {
                slug: 'tones', name: 'Los 4 tonos', icon: '🎵', color: '#6366f1',
                description: 'El tono cambia completamente el significado',
                letterCards: ['TONO1','TONO2','TONO3','TONO4','TONO0'],
                scope: `Mandarin tones — 1 isLetter card per tone:
- 1st tone ā (flat, high): mā=mother, bā=eight, tā=he/she
- 2nd tone á (rising, like asking "¿Cómo?"): má=hemp/numb, lái=come, nán=difficult
- 3rd tone ǎ (dip then rise, like "hmm?"): mǎ=horse, nǐ=you, hǎo=good, wǒ=I
- 4th tone à (sharp fall, like "¡No!"): mà=to scold, shì=is/yes, bù=no/not
- Neutral tone (light, unstressed): ma (question particle), ne, le, ba, de
The famous example: mā má mǎ mà mɑ — show how context disambiguates.
Rules: 3rd+3rd → 2nd+3rd (nǐ hǎo → ní hǎo). bù: 4th except before 4th → 2nd.
Then generate contrast vocabulary cards:
mā(妈 mother) vs mǎ(马 horse) vs mà(骂 scold) — showing pinyin + character + meaning.
Generate 10 vocabulary cards covering the most common words per tone.`,
            },
            {
                slug: 'initials', name: 'Iniciales (consonantes)', icon: '🔡', color: '#f59e0b',
                description: 'b p m f / d t n l / g k h / j q x / zh ch sh r / z c s',
                letterCards: ['BP','DT','GK','JQX','ZHCHSH','ZCS'],
                scope: `Mandarin initials (声母) — 1 isLetter card per GROUP (keep each card concise: max 2 examples):
- Labials b(/b̥/) p(/pʰ/) m(/m/) f(/f/): bā(8) pà(fear) māo(cat) fēi(fly)
- Dentals d(/d̥/) t(/tʰ/) n(/n/) l(/l/): dà(big) tā(he) nǐ(you) lái(come)
- Velars g(/k̚/) k(/kʰ/) h(/x/): gǒu(dog) kāi(open) hǎo(good)
- Palatals j(/tɕ/) q(/tɕʰ/) x(/ɕ/) — ONLY before i/ü: jiā(home) qǐng(please) xiǎo(small)
- Retroflexes zh(/ʈʂ/) ch(/ʈʂʰ/) sh(/ʂ/) r(/ʐ/): zhōng(middle) chī(eat) rén(person)
- Sibilants z(/ts/) c(/tsʰ/) s(/s/): zài(again) cài(dish) sān(3)
KEY: aspirated vs unaspirated is the main contrast.
1 vocabulary card per group (6 total). Keep examples brief.`,
            },
            {
                slug: 'finals', name: 'Finales (vocales y nasales)', icon: '🔤', color: '#10b981',
                description: 'a o e i u ü — simples, diptongos y nasales',
                letterCards: ['SIMPLE_V','COMPOUND_V','NASAL_V'],
                scope: `Mandarin finals (韵母) — 1 isLetter card per group (max 2 examples per card):
- Simple: a(/a/) o(/o/) e(/ɤ/) i(/i/) u(/u/) ü(/y/). Note: e alone = /ɤ/; ü→u after j/q/x/y
- Compound: ai ei ao ou ia ie ua uo üe — words: māo(cat) hǎo(good) gǒu(dog) jiā(home)
- Nasal -n: an en in un — nán(south) rén(person). Nasal -ng: ang eng ing ong — máng(busy) míng(bright)
- Special: er(/ɚ/ retroflex) — èr(2) ěr(ear)
1 vocabulary card per group (4 total). Keep cards concise.`,
            },
            {
                slug: 'reading_words', name: 'Primeras palabras en pinyin', icon: '🧩', color: '#ef4444',
                description: 'Leer y pronunciar 20 palabras esenciales',
                letterCards: [],
                scope: `Mandarin reading practice — NO isLetter cards.
Generate 20 vocabulary cards of the most essential Mandarin words:
For each card show: pinyin (with tone marks), Chinese character(s), Spanish translation,
phonetic breakdown, and 2 example sentences with pinyin + character + Spanish.
Words: nǐ hǎo(hello 你好), xièxiè(thanks 谢谢), duìbuqǐ(sorry 对不起),
wǒ(I 我), nǐ(you 你), tā(he/she 他/她), wǒmen(we 我们),
shì(is 是), bù shì(is not 不是), yǒu(have 有), méiyǒu(don't have 没有),
hǎo(good 好), bù hǎo(not good 不好), dà(big 大), xiǎo(small 小),
lái(come 来), qù(go 去), chī(eat 吃), hē(drink 喝), shuō(speak 说).
Emphasize: tone marks must be memorized, NOT optional.`,
            },
        ],
    },

    ar: {
        scriptType: 'arabic',
        levelName:  'El alfabeto árabe',
        groups: [
            {
                slug: 'intro_script', name: 'Introducción al árabe', icon: '📖', color: '#6366f1',
                description: 'Script RTL · abjad · vocales · conexión de letras',
                letterCards: ['RTL','ABJAD','HARAKAT','CONNECTION'],
                scope: `Arabic script fundamentals — 1 isLetter card per concept:
- RTL: Arabic is written right-to-left. Show word مرحبا (marhaba=hello) with direction arrow.
- Abjad: Arabic is a consonant alphabet — vowels are often omitted in regular text.
  Short vowels written as diacritics above/below consonants (common in Quran, textbooks).
  كِتَابٌ (kitāb=book) vs كتاب (same without diacritics).
- Harakat (diacritics):
  Fatha ـَ = /a/ (above), Kasra ـِ = /i/ (below), Damma ـُ = /u/ (above curl)
  Sukun ـْ = no vowel, Shadda ـّ = double consonant
  Show بَيْتٌ (bayt=house) fully vocalized.
- Letter connection: Most letters connect to neighbors; 6 letters only connect to the right.
  Show: ك + ت + ب → كتب (ktb = wrote) — connected form
  Non-connectors: ا د ذ ر ز و — these break the word's connection chain.
Generate 3 vocabulary cards: بيت(house) كتاب(book) ماء(water) — showing full diacritics.`,
            },
            {
                slug: 'letters_a', name: 'Letras — grupo A', icon: '🔤', color: '#f59e0b',
                description: 'أ ب ت ث ج ح خ د ذ ر ز',
                letterCards: ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز'],
                scope: `Arabic letters group A — 1 isLetter card per letter:
For EACH letter show: isolated form, initial form, medial form, final form, IPA,
nearest Spanish sound, mnemonic, and 1 example word.
- أ/ا alif /ʔa/: glottal stop + a — أنا(ana=I), ماء(maa=water)
- ب ba /b/: 1 dot below — بيت(bayt=house), كتاب(kitaab=book)
- ت ta /t/: 2 dots above — تمر(tamr=dates), أنت(anta=you masc)
- ث tha /θ/: like English "th" in think, 3 dots — ثلاثة(thalaatha=3)
- ج jim /dʒ/: like English J — جميل(jameel=beautiful), جدة(Jidda)
- ح ha /ħ/: deep pharyngeal H (no Spanish equiv) — حب(hub=love), أحمد(Ahmad)
- خ kha /x/: like Spanish J — خبز(khubz=bread), أخ(akh=brother)
- د dal /d/: non-connector — درس(darasa=studied), يد(yad=hand)
- ذ dhal /ð/: like English "th" in "the" — ذهب(dhahab=gold)
- ر ra /r/: rolled R, non-connector — رجل(rajul=man), مرحبا(marhaba)
- ز zayn /z/: like Z — زيت(zayt=oil), زهرة(zahra=flower)
Then 2 vocabulary cards using letters from this group.`,
            },
            {
                slug: 'letters_b', name: 'Letras — grupo B', icon: '🔡', color: '#10b981',
                description: 'س ش ص ض ط ظ ع غ ف ق ك ل',
                letterCards: ['س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل'],
                scope: `Arabic letters group B — 1 isLetter card per letter with all 4 forms + IPA + mnemonic:
- س sin /s/: like S — سلام(salam=peace), رأس(raas=head)
- ش shin /ʃ/: like SH — شمس(shams=sun), شكراً(shukran=thanks)
- ص sad /sˤ/: emphatic S (tongue back) — صباح(sabah=morning), صديق(sadeeq=friend)
- ض dad /dˤ/: emphatic D — رمضان(Ramadan), بيض(bayd=eggs)
- ط ta /tˤ/: emphatic T — طالب(talib=student), طريق(tareeq=road)
- ظ dha /ðˤ/: emphatic DH — ظهر(duhr=noon), حظ(hadh=luck)
- ع ayn /ʕ/: voiced pharyngeal (unique to Arabic) — عربي(arabi=Arabic), علي(Ali)
- غ ghayn /ɣ/: like French R or gargling — غداء(ghadaa=lunch), بغداد(Baghdad)
- ف fa /f/: like F — فتح(fatah=opened), كيف(kayfa=how)
- ق qaf /q/: deep K (uvular stop) — قلب(qalb=heart), قرآن(Quran)
- ك kaf /k/: like K — كتاب(kitaab=book), كيف(kayfa=how)
- ل lam /l/: like L — لا(la=no), الله(Allah) — note lam+alif ligature: لا
Then 3 vocabulary cards using letters from this group.`,
            },
            {
                slug: 'letters_c', name: 'Letras — grupo C + palabras', icon: '🔣', color: '#ef4444',
                description: 'م ن ه و ي + primeras palabras completas',
                letterCards: ['م','ن','ه','و','ي'],
                scope: `Arabic letters group C — 1 isLetter card per letter:
- م mim /m/: like M — مرحبا(marhaba=hello), اسم(ism=name), أم(umm=mother)
- ن nun /n/: like N — نعم(naam=yes), نهار(nahaar=day), نور(nour=light)
- ه ha /h/: like H (lighter than ح) — هو(huwa=he), هي(hiya=she), هنا(huna=here)
- و waw /w/ or long /uː/: like W or long U — وقت(waqt=time), هو(huwa), يوم(yawm=day)
- ي ya /j/ or long /iː/: like Y or long I — يوم(yawm=day), بيت(bayt=house), في(fi=in)
Then generate 10 vocabulary cards of essential Arabic words using all letters covered:
مرحبا(hello) شكراً(thanks) نعم(yes) لا(no) من(who/from) ماذا(what) أين(where)
متى(when) كيف(how) لماذا(why) — show: Arabic, transliteration, Spanish, example sentence.`,
            },
        ],
    },
};

// ─── I/O helpers ──────────────────────────────────────────────

const OUTPUT_FILE    = path.join(__dirname, 'flashcard_data_alpha.js');
const PROGRESS_DIR   = path.join(__dirname, '.alpha_progress');

function getProgressFile(target, source = 'es') {
    return path.join(PROGRESS_DIR, `progress_${target}_${source}.json`);
}

function loadJSON(file) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { return null; }
}

function saveJSON(file, data) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Construcción del prompt ───────────────────────────────────

function buildPrompt(target, source, groupCfg, groupIndex, totalGroups) {
    const tLang = LANGS[target] || { name: target, nameEn: target };
    const sLang = LANGS[source] || { name: source, nameEn: source };
    const langCfg = LANG_CONFIGS[target];
    const isNonLatin = !['latin'].includes(langCfg.scriptType);

    const richTextRules = `
RICH TEXT RULES (applied to "translation" and "examples[].t" fields ONLY):
- Wrap the featured letter/character in <b>…</b>
- Wrap phonetic hints or loan-word origins in <i>…</i>
- Use <br> to separate two distinct ideas or example lines within the same string
- Use <span class="hl">…</span> to highlight a key mnemonic word or contrast word
- Keep HTML minimal: no divs, no nested tags, no inline styles
- All other fields (word, phonetic, letter) must be plain text — NO HTML
`;

    const schemaDoc = `
Return a JSON object with this exact shape:

{
  "id": "${target}_a0_g${groupIndex + 1}",
  "name": "${groupCfg.name}",
  "icon": "${groupCfg.icon}",
  "color": "${groupCfg.color}",
  "description": "${groupCfg.description}",
  "reviewFrom": ${groupIndex === 0 ? '[]' : JSON.stringify(Array.from({length: groupIndex}, (_, i) => `${target}_a0_g${i + 1}`))},
  "cards": [
    // ── LETTER CARDS (isLetter: true) ──
    // One per character/concept listed in the scope
    {
      "id": "${target}_a0_g${groupIndex + 1}_L_{slugified_letter}",
      "isLetter": true,
      "letter": "THE CHARACTER (plain text — one glyph or digraph)",
      "word": "THE CHARACTER",
      "emoji": "🔤",
      "phonetic": "/IPA transcription/",
      "translation": "Name + sound description in ${sLang.nameEn} — use <b> and <i> for emphasis",
      "mnemonic": "Visual or acoustic mnemonic in ${sLang.nameEn} (plain text, max 1 sentence)",
      "examples": [
        { "t": "Example sentence or usage note — use <b>letter</b> to highlight, <br> between lines", "n": "${sLang.nameEn} translation or note" },
        { "t": "Second example", "n": "Note" }
      ]
    },

    // ── VOCABULARY CARDS (isLetter: false) ──
    // Real words that use/illustrate the letters in this group
    {
      "id": "${target}_a0_g${groupIndex + 1}_{two_digit_index}",
      "letter": "THE LETTER THIS WORD ILLUSTRATES (plain text)",
      "word": "THE TARGET LANGUAGE WORD",
      "emoji": "relevant emoji",
      "phonetic": "/IPA or readable romanization/",
      "translation": "${sLang.nameEn} translation — use <b>key part</b> if helpful",
      "translations": {
        "${target}": "word in target language",
        "${source}": "word in source language",
        "en": "English translation"
      },
      "examples": [
        { "t": "Full sentence in ${tLang.nameEn} with <b>target word</b> highlighted", "n": "${sLang.nameEn} translation" },
        { "t": "Second sentence", "n": "Translation" }
      ]
    }
  ]
}

Do NOT wrap in markdown. Respond ONLY with the raw JSON object.
`;

    return `You are an expert language curriculum designer creating flashcard content for a mobile language learning app.

TARGET LANGUAGE: ${tLang.nameEn} (${tLang.name})
LEARNER'S NATIVE LANGUAGE: ${sLang.nameEn} (${sLang.name})
LEVEL: A0 — absolute beginner, first contact with the script/sounds
MODULE: ${groupCfg.name} (group ${groupIndex + 1} of ${totalGroups})
SCRIPT TYPE: ${langCfg.scriptType}

PEDAGOGICAL GOAL:
${groupCfg.scope}

${richTextRules}

QUALITY STANDARDS:
- Every letter card must include a memorable mnemonic (visual or acoustic) that helps Spanish speakers remember the character
- Every vocabulary card must use a common, high-frequency word (top 500 if possible)
- Examples must be grammatically correct, natural, and short (≤10 words)
- Phonetic transcriptions must be accurate IPA (or clear romanization for CJK/Arabic)
${isNonLatin ? '- For non-Latin scripts: always show both the native script AND a readable romanization\n- Include stroke/shape description clues to help learners remember the character form' : '- Contrast sounds with equivalent Spanish sounds to anchor learning'}
- Never use HTML in: id, letter, word, phonetic, mnemonic, translations object values
- Rich text (<b>, <i>, <br>, <span class="hl">) only in: translation string and examples[].t strings

${schemaDoc}`;
}

// ─── Llamada al modelo ────────────────────────────────────────

async function generateGroup(target, source, groupCfg, groupIndex, totalGroups, retries = 3) {
    const prompt = buildPrompt(target, source, groupCfg, groupIndex, totalGroups);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const tokenLimit = groupCfg.scope.length > 1200 ? 16000
                             : groupCfg.scope.length > 800  ? 12000
                             : 7000;
            const resp = await client.chat.completions.create({
                model:       'deepseek-chat',
                temperature: 0.7,
                max_tokens:  tokenLimit,
                messages: [{ role: 'user', content: prompt }],
            });

            const raw = resp.choices[0].message.content.trim()
                .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '');

            const parsed = JSON.parse(raw);

            if (!Array.isArray(parsed.cards) || parsed.cards.length === 0) {
                throw new Error('No cards array in response');
            }

            return parsed;

        } catch (err) {
            console.warn(`  ⚠️  Intento ${attempt}/${retries} fallido: ${err.message}`);
            if (attempt === retries) throw err;
            await new Promise(r => setTimeout(r, 2500 * attempt));
        }
    }
}

// ─── Escritura del archivo de salida ─────────────────────────

function writeOutputFile(allData) {
    const entries = Object.entries(allData)
        .map(([lang, curriculum]) => `\n  // ${'─'.repeat(54)}\n  // ${(LANGS[lang]?.name || lang).toUpperCase()}\n  // ${'─'.repeat(54)}\n  ${lang}: ${JSON.stringify(curriculum, null, 4).split('\n').join('\n  ')}`)
        .join(',\n');

    const header = `// flashcard_data_alpha.js — Módulos A0 adicionales para SenseMate
// GENERADO por generate_alphabet.js — NO editar manualmente
// Para regenerar: node generate_alphabet.js --target=<lang>
//
// Formato idéntico a flashcard_data.js (FLASHCARD_CURRICULUM).
// Cargado en index.html después de flashcard_data.js y referenciado en practice.js.

const FLASHCARD_ALPHA = {${entries}
};

// Merge into FLASHCARD_CURRICULUM if it exists (loaded after flashcard_data.js)
if (typeof FLASHCARD_CURRICULUM !== 'undefined') {
    Object.assign(FLASHCARD_CURRICULUM, FLASHCARD_ALPHA);
}
`;

    fs.writeFileSync(OUTPUT_FILE, header, 'utf8');
    console.log(`\n✅ Archivo actualizado: ${path.relative(__dirname, OUTPUT_FILE)}`);
}

function loadOutputData() {
    try {
        const content = fs.readFileSync(OUTPUT_FILE, 'utf8');
        // Extract the JSON-like object between FLASHCARD_ALPHA = { ... }
        const match = content.match(/const FLASHCARD_ALPHA = (\{[\s\S]*?\n\};\n)/);
        if (!match) return {};
        // Use a safe eval approach via JSON after removing JS-only syntax
        // Better: track progress separately and reconstruct from progress files
        return {};
    } catch {
        return {};
    }
}

// ─── Comando --list ───────────────────────────────────────────

function cmdList() {
    console.log('\nIdiomas disponibles para generate_alphabet.js:\n');
    for (const [code, cfg] of Object.entries(LANG_CONFIGS)) {
        const lang = LANGS[code] || { name: code, nameEn: code };
        const groupNames = cfg.groups.map(g => g.name).join(' · ');
        console.log(`  ${code.padEnd(4)} ${lang.name.padEnd(14)} [${cfg.scriptType}]`);
        console.log(`       ${cfg.groups.length} grupos: ${groupNames}`);
        console.log();
    }
    console.log(`Total: ${Object.keys(LANG_CONFIGS).length} idiomas configurados`);
    console.log('\nUso:  node generate_alphabet.js --target=<code> [--source=es]\n');
}

// ─── Comando --status ─────────────────────────────────────────

function cmdStatus(target, source = 'es') {
    const cfg = LANG_CONFIGS[target];
    if (!cfg) {
        console.error(`❌ Idioma no configurado: ${target}`);
        console.error(`   Usa --list para ver idiomas disponibles`);
        process.exit(1);
    }

    const progressFile = getProgressFile(target, source);
    const progress = loadJSON(progressFile) || { done: {}, target, source };
    const lang = LANGS[target] || { name: target };

    console.log(`\n📊 Estado: ${lang.name} (${target})`);
    console.log(`   Script: ${cfg.scriptType} · ${cfg.groups.length} grupos\n`);

    for (let i = 0; i < cfg.groups.length; i++) {
        const g = cfg.groups[i];
        const done = progress.done[g.slug];
        const status = done ? `✅ ${done.cards} tarjetas` : '⏳ pendiente';
        console.log(`   Grupo ${i + 1}: ${g.name.padEnd(30)} ${status}`);
    }

    const doneCount = Object.keys(progress.done).length;
    console.log(`\n   Progreso: ${doneCount}/${cfg.groups.length} grupos completados\n`);
}

// ─── Generación principal ─────────────────────────────────────

async function generate(target, source, maxGroups) {
    const cfg = LANG_CONFIGS[target];
    if (!cfg) {
        console.error(`❌ Idioma no configurado: "${target}"`);
        console.error(`   Idiomas disponibles: ${Object.keys(LANG_CONFIGS).join(', ')}`);
        console.error(`   Usa --list para más detalles`);
        process.exit(1);
    }

    if (!LANGS[source]) {
        console.error(`❌ Idioma fuente desconocido: "${source}"`);
        process.exit(1);
    }

    if (!process.env.DEEPSEEK_API_KEY) {
        console.error('❌ DEEPSEEK_API_KEY no encontrada en .env');
        process.exit(1);
    }

    const lang = LANGS[target];
    const progressFile = getProgressFile(target, source);
    const progress = loadJSON(progressFile) || { done: {}, target, source };

    const groups = cfg.groups;
    const limit  = maxGroups || groups.length;

    console.log(`\n🔤 Generando módulo A0: ${lang.name} (${target}) ← ${LANGS[source].name} (${source})`);
    console.log(`   Script: ${cfg.scriptType} · ${cfg.levelName}`);
    console.log(`   Grupos: ${groups.length} total · límite sesión: ${limit}`);
    console.log(`   Progreso previo: ${Object.keys(progress.done).length}/${groups.length} completados\n`);

    // Load existing full data from progress
    const allGroups = [];
    for (const g of groups) {
        if (progress.done[g.slug]?.data) {
            allGroups.push(progress.done[g.slug].data);
        }
    }

    let generated = 0;

    for (let i = 0; i < groups.length; i++) {
        const g = groups[i];

        if (progress.done[g.slug]) {
            console.log(`   ✅ Grupo ${i + 1}/${groups.length}: "${g.name}" — ya completado (${progress.done[g.slug].cards} tarjetas)`);
            continue;
        }

        if (generated >= limit) {
            console.log(`\n⏸  Límite de sesión alcanzado (${limit} grupos). Retomá con el mismo comando.`);
            break;
        }

        console.log(`\n▶ Grupo ${i + 1}/${groups.length}: "${g.name}"`);
        console.log(`  Scope: ${g.scope.split('\n')[0].trim()}...`);

        try {
            const groupData = await generateGroup(target, source, g, i, groups.length);

            // Validate and clean card IDs
            groupData.cards = groupData.cards.map((card, ci) => ({
                ...card,
                id: card.id || `${target}_a0_g${i + 1}_${String(ci + 1).padStart(2, '0')}`,
            }));

            // Save to progress
            if (!progress.done[g.slug]) progress.done[g.slug] = {};
            progress.done[g.slug] = {
                cards: groupData.cards.length,
                data:  groupData,
                generatedAt: new Date().toISOString(),
            };
            saveJSON(progressFile, progress);

            allGroups.push(groupData);
            generated++;

            console.log(`  ✅ ${groupData.cards.length} tarjetas generadas`);

            // Pause between groups to be polite to the API
            if (i < groups.length - 1 && generated < limit) {
                await new Promise(r => setTimeout(r, 1500));
            }

        } catch (err) {
            console.error(`  ❌ Error al generar grupo "${g.name}": ${err.message}`);
            console.error('     Guardando progreso y saliendo. Reintentá con el mismo comando.');
            break;
        }
    }

    // Reconstruct complete groups list from progress (preserving order)
    const orderedGroups = [];
    for (const g of groups) {
        if (progress.done[g.slug]?.data) {
            orderedGroups.push(progress.done[g.slug].data);
        }
    }

    if (orderedGroups.length === 0) {
        console.log('\n⚠️  No hay grupos completados aún. Nada que escribir.');
        return;
    }

    // Build curriculum entry for this language
    const curriculumEntry = {
        level:     'A0',
        levelName: cfg.levelName,
        groups:    orderedGroups,
    };

    // Reconstruct full output from all progress files
    // Key convention: 'ja' for default source (es), 'ja_en' for other sources
    let existingAlpha = {};
    const currentKey = source === 'es' ? target : `${target}_${source}`;

    if (fs.existsSync(PROGRESS_DIR)) {
        for (const file of fs.readdirSync(PROGRESS_DIR)) {
            if (!file.startsWith('progress_') || !file.endsWith('.json')) continue;
            // filename: progress_{target}_{source}.json  (all codes are 2 chars)
            const stem    = file.replace('progress_', '').replace('.json', '');
            const tCode   = stem.slice(0, 2);
            const sCode   = stem.slice(3) || 'es';
            const outKey  = sCode === 'es' ? tCode : `${tCode}_${sCode}`;
            if (outKey === currentKey) continue; // overwritten below

            const p = loadJSON(path.join(PROGRESS_DIR, file));
            if (!p?.done) continue;
            const lCfg = LANG_CONFIGS[tCode];
            if (!lCfg) continue;
            const gs = [];
            for (const g of lCfg.groups) {
                if (p.done[g.slug]?.data) gs.push(p.done[g.slug].data);
            }
            if (gs.length > 0) {
                existingAlpha[outKey] = { level: 'A0', levelName: lCfg.levelName, groups: gs };
            }
        }
    }

    existingAlpha[currentKey] = curriculumEntry;
    writeOutputFile(existingAlpha);

    const completedGroups = Object.keys(progress.done).length;
    const totalGroups = groups.length;

    if (completedGroups < totalGroups) {
        console.log(`\n⏸  ${completedGroups}/${totalGroups} grupos completados.`);
        console.log(`   Continuá con: node generate_alphabet.js --target=${target} --source=${source}`);
    } else {
        console.log(`\n🎉 ¡Módulo completo! ${completedGroups}/${totalGroups} grupos para ${lang.name}`);
        console.log(`   Agregá flashcard_data_alpha.js al index.html después de flashcard_data.js`);
    }
}

// ─── Reset de progreso ────────────────────────────────────────

function cmdReset(target, source = 'es') {
    const progressFile = getProgressFile(target, source);
    if (fs.existsSync(progressFile)) {
        fs.unlinkSync(progressFile);
        console.log(`🗑  Progreso eliminado para: ${target} ← ${source}`);
    } else {
        console.log(`ℹ️  No hay progreso guardado para: ${target} ← ${source}`);
    }
}

// ─── Entry point ──────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {};
for (const arg of args) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    flags[k] = v ?? true;
}

if (flags.list) {
    cmdList();
} else if (flags.status) {
    cmdStatus(flags.target || 'ko', flags.source || 'es');
} else if (flags.reset) {
    cmdReset(flags.target || (() => { console.error('Requiere --target'); process.exit(1); })(), flags.source || 'es');
} else if (flags.target) {
    const source = flags.source || 'es';
    const count  = flags.count ? parseInt(flags.count) : undefined;
    generate(flags.target, source, count).catch(err => {
        console.error('\n❌ Error fatal:', err.message);
        process.exit(1);
    });
} else {
    console.log(`
generate_alphabet.js — Generador de módulos A0 para SenseMate

Uso:
  node generate_alphabet.js --target=<lang> [--source=es] [--count=N]
  node generate_alphabet.js --list
  node generate_alphabet.js --status --target=<lang>
  node generate_alphabet.js --reset  --target=<lang>

Opciones:
  --target=<lang>   Idioma a generar (ko, ja, zh, ru, ar, en, de, fr, pt, it)
  --source=<lang>   Idioma del aprendiz (default: es)
  --count=N         Generar solo N grupos en esta sesión (para reanudar)
  --list            Ver todos los idiomas configurados y sus grupos
  --status          Ver progreso de un idioma
  --reset           Borrar progreso de un idioma y empezar de cero

Ejemplos:
  node generate_alphabet.js --target=ko
  node generate_alphabet.js --target=ja --source=es --count=2
  node generate_alphabet.js --target=ru --status
`);
}
