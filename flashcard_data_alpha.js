// flashcard_data_alpha.js — Módulos A0 adicionales para SenseMate
// GENERADO por generate_alphabet.js — NO editar manualmente
// Para regenerar: node generate_alphabet.js --target=<lang>
//
// Formato idéntico a flashcard_data.js (FLASHCARD_CURRICULUM).
// Cargado en index.html después de flashcard_data.js y referenciado en practice.js.

const FLASHCARD_ALPHA = {
  // ──────────────────────────────────────────────────────
  // ÁRABE
  // ──────────────────────────────────────────────────────
  ar: {
      "level": "A0",
      "levelName": "El alfabeto árabe",
      "groups": [
          {
              "id": "ar_a0_g1",
              "name": "Introducción al árabe",
              "icon": "📖",
              "color": "#6366f1",
              "description": "Script RTL · abjad · vocales · conexión de letras",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ar_a0_g1_L_rtl",
                      "isLetter": true,
                      "letter": "→",
                      "word": "RTL",
                      "emoji": "➡️",
                      "phonetic": "/min al-yamīn ilā al-shimāl/",
                      "translation": "El árabe se escribe <b>de derecha a izquierda</b>. <br>Ejemplo: <b>مرحبا</b> (marhaba = hola) empieza con <b>م</b> a la derecha.",
                      "mnemonic": "Imagina una flecha ➡️ que apunta hacia la izquierda: el árabe va en dirección contraria al español.",
                      "examples": [
                          {
                              "t": "<b>مرحبا</b> se lee empezando por la <b>derecha</b>.",
                              "n": "Hola se lee de derecha a izquierda."
                          },
                          {
                              "t": "Los libros árabes se abren <b>por la izquierda</b>.",
                              "n": "Los libros árabes se abren por la izquierda (porque la escritura es RTL)."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_abjad",
                      "isLetter": true,
                      "letter": "ا",
                      "word": "Abjad",
                      "emoji": "🔤",
                      "phonetic": "/ʔalif/",
                      "translation": "El árabe es un <b>abjad</b>: escribe principalmente <b>consonantes</b>. Las vocales cortas se omiten en textos normales. <br>Ejemplo: <b>كتاب</b> (ktāb) = libro, sin vocales.",
                      "mnemonic": "Piensa en 'abjad' como las primeras letras del alfabeto árabe (أ ب ج د). Solo consonantes, como un esqueleto.",
                      "examples": [
                          {
                              "t": "<b>كتاب</b> se escribe con las consonantes <b>ك</b>, <b>ت</b>, <b>ب</b>.",
                              "n": "Libro se escribe con las consonantes k, t, b."
                          },
                          {
                              "t": "Con vocales: <b>كِتَابٌ</b> (kitābun).",
                              "n": "Con diacríticos: kitābun (libro)."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_harakat",
                      "isLetter": true,
                      "letter": "ـَ",
                      "word": "Fatha",
                      "emoji": "🔺",
                      "phonetic": "/a/",
                      "translation": "<b>Fatha</b> ـَ es una rayita <b>encima</b> de la letra y suena <b>/a/</b>. <br>Ejemplo: <b>بَ</b> = ba.",
                      "mnemonic": "La fatha es como una pequeña 'a' acostada encima de la letra.",
                      "examples": [
                          {
                              "t": "<b>بَيت</b> (bayt) = casa.",
                              "n": "Casa con fatha en la primera letra."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_kasra",
                      "isLetter": true,
                      "letter": "ـِ",
                      "word": "Kasra",
                      "emoji": "🔻",
                      "phonetic": "/i/",
                      "translation": "<b>Kasra</b> ـِ es una rayita <b>debajo</b> de la letra y suena <b>/i/</b>. <br>Ejemplo: <b>بِ</b> = bi.",
                      "mnemonic": "La kasra está debajo, como una 'i' que se escondió bajo la letra.",
                      "examples": [
                          {
                              "t": "<b>بِنت</b> (bint) = hija.",
                              "n": "Hija con kasra en la primera letra."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_damma",
                      "isLetter": true,
                      "letter": "ـُ",
                      "word": "Damma",
                      "emoji": "🌀",
                      "phonetic": "/u/",
                      "translation": "<b>Damma</b> ـُ es como una <b>pequeña coma</b> encima de la letra y suena <b>/u/</b>. <br>Ejemplo: <b>بُ</b> = bu.",
                      "mnemonic": "La damma parece una 'u' pequeña que se sienta sobre la letra.",
                      "examples": [
                          {
                              "t": "<b>قُمر</b> (qamar) = luna.",
                              "n": "Luna con damma en la primera letra."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_sukun",
                      "isLetter": true,
                      "letter": "ـْ",
                      "word": "Sukun",
                      "emoji": "⭕",
                      "phonetic": "/sin vocal/",
                      "translation": "<b>Sukun</b> ـْ es un <b>círculo</b> encima de la letra y significa que <b>no hay vocal</b> (consonante sin sonido después). <br>Ejemplo: <b>بْ</b> = b (sin vocal).",
                      "mnemonic": "El sukun es un círculo que 'cierra' la boca: no sale ninguna vocal.",
                      "examples": [
                          {
                              "t": "<b>بَيتْ</b> (bayt) = casa, con sukun en la última letra.",
                              "n": "Casa: la 't' no lleva vocal."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_shadda",
                      "isLetter": true,
                      "letter": "ـّ",
                      "word": "Shadda",
                      "emoji": "👯",
                      "phonetic": "/doble/",
                      "translation": "<b>Shadda</b> ـّ indica que la letra se <b>duplica</b> (se pronuncia dos veces). <br>Ejemplo: <b>بَّ</b> = bb (como en 'abba').",
                      "mnemonic": "La shadda parece una 'w' pequeña que dice '¡repite!'.",
                      "examples": [
                          {
                              "t": "<b>رَبّ</b> (rabb) = señor, con shadda en la 'b'.",
                              "n": "Señor: la 'b' se duplica."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_L_connection",
                      "isLetter": true,
                      "letter": "ﺐ",
                      "word": "Conexión",
                      "emoji": "🔗",
                      "phonetic": "/ittiṣāl/",
                      "translation": "La mayoría de las letras árabes se <b>conectan</b> con las vecinas. <br>Ejemplo: <b>ك + ت + ب</b> → <b>كتب</b> (kataba = escribió). <br>Pero 6 letras <b>no se conectan</b> con la siguiente: <span class='hl'>ا د ذ ر ز و</span>.",
                      "mnemonic": "Imagina que las letras son vagones de tren: la mayoría se enganchan, pero algunas van sueltas.",
                      "examples": [
                          {
                              "t": "<b>كتب</b> se escribe todo conectado.",
                              "n": "Escribió: todas las letras se unen."
                          },
                          {
                              "t": "En <b>ماء</b> (māʼ = agua), la <b>ا</b> no se conecta con la siguiente.",
                              "n": "Agua: la alif rompe la conexión."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_01",
                      "isLetter": false,
                      "letter": "ب",
                      "word": "بَيْتٌ",
                      "emoji": "🏠",
                      "phonetic": "/baytun/",
                      "translation": "casa",
                      "translations": {
                          "ar": "بَيْتٌ",
                          "es": "casa",
                          "en": "house"
                      },
                      "examples": [
                          {
                              "t": "<b>بَيْتٌ</b> كَبِيرٌ",
                              "n": "Una casa grande."
                          },
                          {
                              "t": "أَنَا فِي <b>بَيْتِي</b>",
                              "n": "Estoy en mi casa."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_02",
                      "isLetter": false,
                      "letter": "ك",
                      "word": "كِتَابٌ",
                      "emoji": "📖",
                      "phonetic": "/kitābun/",
                      "translation": "libro",
                      "translations": {
                          "ar": "كِتَابٌ",
                          "es": "libro",
                          "en": "book"
                      },
                      "examples": [
                          {
                              "t": "هَذَا <b>كِتَابٌ</b> جَدِيدٌ",
                              "n": "Este es un libro nuevo."
                          },
                          {
                              "t": "أَقْرَأُ <b>كِتَابًا</b>",
                              "n": "Leo un libro."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g1_03",
                      "isLetter": false,
                      "letter": "م",
                      "word": "مَاءٌ",
                      "emoji": "💧",
                      "phonetic": "/māʼun/",
                      "translation": "agua",
                      "translations": {
                          "ar": "مَاءٌ",
                          "es": "agua",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "أَشْرَبُ <b>مَاءً</b>",
                              "n": "Bebo agua."
                          },
                          {
                              "t": "<b>مَاءٌ</b> بَارِدٌ",
                              "n": "Agua fría."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ar_a0_g2",
              "name": "Letras — grupo A",
              "icon": "🔤",
              "color": "#f59e0b",
              "description": "أ ب ت ث ج ح خ د ذ ر ز",
              "reviewFrom": [
                  "ar_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ar_a0_g2_L_alif",
                      "isLetter": true,
                      "letter": "أ",
                      "word": "أ",
                      "emoji": "🔤",
                      "phonetic": "/ʔa/",
                      "translation": "Alif — <b>a</b> con un golpe de voz corto (como una pausa antes de una vocal)<br><i>Glottal stop + a</i>",
                      "mnemonic": "Un palo vertical con un pequeño sombrero encima, como una persona que se pone de pie para decir '¡Ah!'.",
                      "examples": [
                          {
                              "t": "<b>أ</b>نا — <i>ana</i>",
                              "n": "Yo"
                          },
                          {
                              "t": "ما<b>ء</b> — <i>maa</i>",
                              "n": "Agua — al final se escribe como una cola."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_ba",
                      "isLetter": true,
                      "letter": "ب",
                      "word": "ب",
                      "emoji": "🔤",
                      "phonetic": "/b/",
                      "translation": "Ba — <b>b</b> como en español<br><i>1 punto debajo</i>",
                      "mnemonic": "Un platito con un punto debajo, como un 'b' que tiene una gotita que cae.",
                      "examples": [
                          {
                              "t": "<b>ب</b>يت — <i>bayt</i>",
                              "n": "Casa"
                          },
                          {
                              "t": "كِتا<b>ب</b> — <i>kitaab</i>",
                              "n": "Libro — la b final se conecta con la a."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_ta",
                      "isLetter": true,
                      "letter": "ت",
                      "word": "ت",
                      "emoji": "🔤",
                      "phonetic": "/t/",
                      "translation": "Ta — <b>t</b> como en español<br><i>2 puntos arriba</i>",
                      "mnemonic": "El mismo platito de 'ba' pero con dos puntos encima, como dos ojos que miran.",
                      "examples": [
                          {
                              "t": "<b>ت</b>مر — <i>tamr</i>",
                              "n": "Dátiles"
                          },
                          {
                              "t": "أن<b>ت</b> — <i>anta</i>",
                              "n": "Tú (masculino)"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_tha",
                      "isLetter": true,
                      "letter": "ث",
                      "word": "ث",
                      "emoji": "🔤",
                      "phonetic": "/θ/",
                      "translation": "Tha — <b>th</b> como en inglés 'think'<br><i>3 puntos arriba</i>",
                      "mnemonic": "El platito con tres puntos, como un trébol de tres hojas que hace el sonido de soplar.",
                      "examples": [
                          {
                              "t": "<b>ث</b>لاثة — <i>thalaatha</i>",
                              "n": "Tres"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_jim",
                      "isLetter": true,
                      "letter": "ج",
                      "word": "ج",
                      "emoji": "🔤",
                      "phonetic": "/dʒ/",
                      "translation": "Jim — <b>y</b> como en inglés 'John' o la 'y' argentina<br><i>Como la J inglesa</i>",
                      "mnemonic": "Una jirafa con el cuello curvado hacia abajo, hace 'yiii' como una jirafa pequeña.",
                      "examples": [
                          {
                              "t": "<b>ج</b>ميل — <i>jameel</i>",
                              "n": "Hermoso"
                          },
                          {
                              "t": "<b>ج</b>دة — <i>Jidda</i>",
                              "n": "Yeda (ciudad de Arabia Saudita)"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_ha",
                      "isLetter": true,
                      "letter": "ح",
                      "word": "ح",
                      "emoji": "🔤",
                      "phonetic": "/ħ/",
                      "translation": "Ha — <b>h</b> profunda desde la garganta<br><i>Sin equivalente en español</i>",
                      "mnemonic": "Un ojo con una ceja levantada, como cuando te sorprendes y haces '¡ha!' desde el fondo.",
                      "examples": [
                          {
                              "t": "<b>ح</b>ب — <i>hub</i>",
                              "n": "Amor"
                          },
                          {
                              "t": "أ<b>ح</b>مد — <i>Ahmad</i>",
                              "n": "Ahmed (nombre propio)"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_kha",
                      "isLetter": true,
                      "letter": "خ",
                      "word": "خ",
                      "emoji": "🔤",
                      "phonetic": "/x/",
                      "translation": "Kha — <b>j</b> como en español 'jota'<br><i>Como la J española</i>",
                      "mnemonic": "El mismo ojo de 'ha' pero con un punto encima, como una ceja que se frunce para decir '¡ja!' con fuerza.",
                      "examples": [
                          {
                              "t": "<b>خ</b>بز — <i>khubz</i>",
                              "n": "Pan"
                          },
                          {
                              "t": "أ<b>خ</b> — <i>akh</i>",
                              "n": "Hermano"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_dal",
                      "isLetter": true,
                      "letter": "د",
                      "word": "د",
                      "emoji": "🔤",
                      "phonetic": "/d/",
                      "translation": "Dal — <b>d</b> como en español<br><i>No se conecta con la siguiente letra</i>",
                      "mnemonic": "Una 'd' que se dobla hacia atrás, como un perro que se agacha y no quiere avanzar (no conecta).",
                      "examples": [
                          {
                              "t": "<b>د</b>رس — <i>darasa</i>",
                              "n": "Estudió"
                          },
                          {
                              "t": "ي<b>د</b> — <i>yad</i>",
                              "n": "Mano"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_dhal",
                      "isLetter": true,
                      "letter": "ذ",
                      "word": "ذ",
                      "emoji": "🔤",
                      "phonetic": "/ð/",
                      "translation": "Dhal — <b>th</b> como en inglés 'the'<br><i>Como la 'th' sonora del inglés</i>",
                      "mnemonic": "La 'd' con un punto encima, como un dedo señalando 'esto' (this) en inglés.",
                      "examples": [
                          {
                              "t": "<b>ذ</b>هب — <i>dhahab</i>",
                              "n": "Oro"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_ra",
                      "isLetter": true,
                      "letter": "ر",
                      "word": "ر",
                      "emoji": "🔤",
                      "phonetic": "/r/",
                      "translation": "Ra — <b>r</b> como en español pero más corta<br><i>R enrollada, no se conecta</i>",
                      "mnemonic": "Una 'r' que se desliza hacia abajo como un tobogán, suelta y rápida.",
                      "examples": [
                          {
                              "t": "<b>ر</b>جل — <i>rajul</i>",
                              "n": "Hombre"
                          },
                          {
                              "t": "م<b>ر</b>حبا — <i>marhaba</i>",
                              "n": "Hola"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_L_zayn",
                      "isLetter": true,
                      "letter": "ز",
                      "word": "ز",
                      "emoji": "🔤",
                      "phonetic": "/z/",
                      "translation": "Zayn — <b>z</b> como en español<br><i>Como la Z</i>",
                      "mnemonic": "La 'ra' con un punto encima, como una abeja que zumba 'zzzz'.",
                      "examples": [
                          {
                              "t": "<b>ز</b>يت — <i>zayt</i>",
                              "n": "Aceite"
                          },
                          {
                              "t": "<b>ز</b>هرة — <i>zahra</i>",
                              "n": "Flor"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_01",
                      "isLetter": false,
                      "letter": "ب",
                      "word": "بيت",
                      "emoji": "🏠",
                      "phonetic": "/bayt/",
                      "translation": "<b>Casa</b> — el hogar",
                      "translations": {
                          "ar": "بيت",
                          "es": "casa",
                          "en": "house"
                      },
                      "examples": [
                          {
                              "t": "هذا <b>بيت</b> جميل",
                              "n": "Esta es una casa hermosa."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g2_02",
                      "isLetter": false,
                      "letter": "ح",
                      "word": "حب",
                      "emoji": "❤️",
                      "phonetic": "/hub/",
                      "translation": "<b>Amor</b> — sentimiento profundo",
                      "translations": {
                          "ar": "حب",
                          "es": "amor",
                          "en": "love"
                      },
                      "examples": [
                          {
                              "t": "<b>حب</b> كبير",
                              "n": "Gran amor."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ar_a0_g3",
              "name": "Letras — grupo B",
              "icon": "🔡",
              "color": "#10b981",
              "description": "س ش ص ض ط ظ ع غ ف ق ك ل",
              "reviewFrom": [
                  "ar_a0_g1",
                  "ar_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ar_a0_g3_L_sin",
                      "isLetter": true,
                      "letter": "س",
                      "word": "س",
                      "emoji": "🔤",
                      "phonetic": "/s/",
                      "translation": "Nombre: <b>sin</b> — suena como la <b>S</b> española<br><i>Se escribe con tres puntos encima de una línea curva</i>",
                      "mnemonic": "Parece una silla con tres patitas encima, ¡como una 's' con sombrero de puntitos!",
                      "examples": [
                          {
                              "t": "<b>س</b>لام — <i>salam</i> — paz",
                              "n": "Saludo universal: 'salam' = paz"
                          },
                          {
                              "t": "رأ<b>س</b> — <i>raas</i> — cabeza",
                              "n": "La 's' va al final, conectada"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_shin",
                      "isLetter": true,
                      "letter": "ش",
                      "word": "ش",
                      "emoji": "🔤",
                      "phonetic": "/ʃ/",
                      "translation": "Nombre: <b>shin</b> — suena como <b>SH</b> en inglés<br><i>Tres puntitos arriba, como una 's' con tres piedritas</i>",
                      "mnemonic": "Es la 's' con tres puntos, ¡como si echara chispas! (shhh…)",
                      "examples": [
                          {
                              "t": "<b>ش</b>مس — <i>shams</i> — sol",
                              "n": "El sol brilla con 'sh' de shine"
                          },
                          {
                              "t": "<b>ش</b>كراً — <i>shukran</i> — gracias",
                              "n": "Di 'shukran' con una sonrisa"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_sad",
                      "isLetter": true,
                      "letter": "ص",
                      "word": "ص",
                      "emoji": "🔤",
                      "phonetic": "/sˤ/",
                      "translation": "Nombre: <b>sad</b> — <b>S</b> enfática, con la lengua hacia atrás<br><i>Se parece a una 's' con una barriga grande</i>",
                      "mnemonic": "Es una 's' gorda y redonda, como una serpiente que ha comido mucho — suena más grave",
                      "examples": [
                          {
                              "t": "<b>ص</b>باح — <i>sabah</i> — mañana",
                              "n": "Saludo de mañana: 'sabah al-khair'"
                          },
                          {
                              "t": "<b>ص</b>ديق — <i>sadeeq</i> — amigo",
                              "n": "Un amigo de verdad, con 's' fuerte"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_dad",
                      "isLetter": true,
                      "letter": "ض",
                      "word": "ض",
                      "emoji": "🔤",
                      "phonetic": "/dˤ/",
                      "translation": "Nombre: <b>dad</b> — <b>D</b> enfática, con la lengua hacia atrás<br><i>Es la letra favorita de los árabes, ¡la letra de su lengua!</i>",
                      "mnemonic": "Parece una 'd' con un lazo en la cabeza — es la 'd' elegante y profunda",
                      "examples": [
                          {
                              "t": "رم<b>ض</b>ان — <i>Ramadan</i> — mes sagrado",
                              "n": "El mes de ayuno, con 'd' grave"
                          },
                          {
                              "t": "بي<b>ض</b> — <i>bayd</i> — huevos",
                              "n": "Huevos para el desayuno"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_ta",
                      "isLetter": true,
                      "letter": "ط",
                      "word": "ط",
                      "emoji": "🔤",
                      "phonetic": "/tˤ/",
                      "translation": "Nombre: <b>ta</b> — <b>T</b> enfática, con la lengua hacia atrás<br><i>Es una 't' con un palito vertical arriba</i>",
                      "mnemonic": "Parece una 't' con un sombrero alto — suena más fuerte y grave",
                      "examples": [
                          {
                              "t": "<b>ط</b>الب — <i>talib</i> — estudiante",
                              "n": "El estudiante que estudia con 't' fuerte"
                          },
                          {
                              "t": "<b>ط</b>ريق — <i>tareeq</i> — camino",
                              "n": "El camino recto, con 't' grave"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_dha",
                      "isLetter": true,
                      "letter": "ظ",
                      "word": "ظ",
                      "emoji": "🔤",
                      "phonetic": "/ðˤ/",
                      "translation": "Nombre: <b>dha</b> — <b>DH</b> enfático (como 'th' en inglés 'the' pero más fuerte)<br><i>Es como una 'ط' con un punto encima</i>",
                      "mnemonic": "Es la 't' enfática con un puntito, ¡como un punto que le da más fuerza!",
                      "examples": [
                          {
                              "t": "<b>ظ</b>هر — <i>duhr</i> — mediodía",
                              "n": "La oración del mediodía"
                          },
                          {
                              "t": "ح<b>ظ</b> — <i>hadh</i> — suerte",
                              "n": "Buena suerte con 'dh' grave"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_ayn",
                      "isLetter": true,
                      "letter": "ع",
                      "word": "ع",
                      "emoji": "🔤",
                      "phonetic": "/ʕ/",
                      "translation": "Nombre: <b>ayn</b> — sonido gutural, como una 'a' profunda de la garganta<br><i>Es única del árabe y otras lenguas semíticas</i>",
                      "mnemonic": "Parece una 'c' con un lazo — la pronuncias como si te estuvieras aclarando la garganta suavemente",
                      "examples": [
                          {
                              "t": "<b>ع</b>ربي — <i>arabi</i> — árabe",
                              "n": "La lengua árabe, con 'ayn' al inicio"
                          },
                          {
                              "t": "<b>ع</b>لي — <i>Ali</i> — nombre propio",
                              "n": "Un nombre muy común en el mundo árabe"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_ghayn",
                      "isLetter": true,
                      "letter": "غ",
                      "word": "غ",
                      "emoji": "🔤",
                      "phonetic": "/ɣ/",
                      "translation": "Nombre: <b>ghayn</b> — como la <b>R</b> francesa o un gargarismo suave<br><i>Es como una 'ع' con un punto encima</i>",
                      "mnemonic": "Es la 'ayn' con un puntito — haces gárgaras suaves, como cuando haces gárgaras con agua",
                      "examples": [
                          {
                              "t": "<b>غ</b>داء — <i>ghadaa</i> — almuerzo",
                              "n": "La comida del mediodía"
                          },
                          {
                              "t": "ب<b>غ</b>داد — <i>Baghdad</i> — Bagdad",
                              "n": "La capital de Irak"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_fa",
                      "isLetter": true,
                      "letter": "ف",
                      "word": "ف",
                      "emoji": "🔤",
                      "phonetic": "/f/",
                      "translation": "Nombre: <b>fa</b> — suena como la <b>F</b> española<br><i>Es como una 'و' con un punto encima</i>",
                      "mnemonic": "Parece una 'v' con un punto — pero suena como 'f', ¡como una 'f' con un puntito mágico!",
                      "examples": [
                          {
                              "t": "<b>ف</b>تح — <i>fatah</i> — abrió",
                              "n": "Verbo común: abrir"
                          },
                          {
                              "t": "كي<b>ف</b> — <i>kayfa</i> — cómo",
                              "n": "Palabra para preguntar '¿cómo?'"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_qaf",
                      "isLetter": true,
                      "letter": "ق",
                      "word": "ق",
                      "emoji": "🔤",
                      "phonetic": "/q/",
                      "translation": "Nombre: <b>qaf</b> — <b>K</b> profunda, desde la úvula<br><i>Es una 'ف' con dos puntos encima</i>",
                      "mnemonic": "Es la 'f' con dos puntos — pero suena como una 'k' que sale de lo más profundo de la garganta",
                      "examples": [
                          {
                              "t": "<b>ق</b>لب — <i>qalb</i> — corazón",
                              "n": "El corazón late con 'q' profunda"
                          },
                          {
                              "t": "<b>ق</b>رآن — <i>Quran</i> — Corán",
                              "n": "El libro sagrado del Islam"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_kaf",
                      "isLetter": true,
                      "letter": "ك",
                      "word": "ك",
                      "emoji": "🔤",
                      "phonetic": "/k/",
                      "translation": "Nombre: <b>kaf</b> — suena como la <b>K</b> española<br><i>Es como una 'ل' con dos bracitos</i>",
                      "mnemonic": "Parece una 'l' con dos bracitos — ¡como una 'k' que abraza!",
                      "examples": [
                          {
                              "t": "<b>ك</b>تاب — <i>kitaab</i> — libro",
                              "n": "Un libro para leer"
                          },
                          {
                              "t": "كي<b>ف</b> — <i>kayfa</i> — cómo",
                              "n": "La misma palabra que vimos con 'ف'"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_L_lam",
                      "isLetter": true,
                      "letter": "ل",
                      "word": "ل",
                      "emoji": "🔤",
                      "phonetic": "/l/",
                      "translation": "Nombre: <b>lam</b> — suena como la <b>L</b> española<br><i>Es una línea recta con un gancho abajo</i>",
                      "mnemonic": "Es como una 'l' con un pie doblado — ¡como una 'l' que camina!",
                      "examples": [
                          {
                              "t": "<b>ل</b>ا — <i>la</i> — no",
                              "n": "Negación simple: 'la' = no"
                          },
                          {
                              "t": "<b>ل</b>له — <i>Allah</i> — Dios",
                              "n": "Nota: <b>ل</b> + <b>ا</b> se unen en el ligado <b>لا</b> (la)"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_01",
                      "isLetter": false,
                      "letter": "س",
                      "word": "سلام",
                      "emoji": "🕊️",
                      "phonetic": "/salaam/",
                      "translation": "<b>salam</b> — paz / hola",
                      "translations": {
                          "ar": "سلام",
                          "es": "paz / hola",
                          "en": "peace / hello"
                      },
                      "examples": [
                          {
                              "t": "أهلاً و<b>سَلام</b>",
                              "n": "Hola y paz (saludo común)"
                          },
                          {
                              "t": "<b>سلام</b> عليكم",
                              "n": "La paz sea contigo"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_02",
                      "isLetter": false,
                      "letter": "ش",
                      "word": "شمس",
                      "emoji": "☀️",
                      "phonetic": "/shams/",
                      "translation": "<b>shams</b> — sol",
                      "translations": {
                          "ar": "شمس",
                          "es": "sol",
                          "en": "sun"
                      },
                      "examples": [
                          {
                              "t": "الش<b>مس</b> مشرقة",
                              "n": "El sol está brillando"
                          },
                          {
                              "t": "أحب <b>الشمس</b>",
                              "n": "Me gusta el sol"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g3_03",
                      "isLetter": false,
                      "letter": "ق",
                      "word": "قلب",
                      "emoji": "❤️",
                      "phonetic": "/qalb/",
                      "translation": "<b>qalb</b> — corazón",
                      "translations": {
                          "ar": "قلب",
                          "es": "corazón",
                          "en": "heart"
                      },
                      "examples": [
                          {
                              "t": "قَلبي يُحبّ",
                              "n": "Mi corazón ama"
                          },
                          {
                              "t": "هذا <b>قَلب</b>ي",
                              "n": "Este es mi corazón"
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ar_a0_g4",
              "name": "Letras — grupo C + palabras",
              "icon": "🔣",
              "color": "#ef4444",
              "description": "م ن ه و ي + primeras palabras completas",
              "reviewFrom": [
                  "ar_a0_g1",
                  "ar_a0_g2",
                  "ar_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ar_a0_g4_L_mim",
                      "isLetter": true,
                      "letter": "م",
                      "word": "م",
                      "emoji": "🔤",
                      "phonetic": "/m/",
                      "translation": "La letra <b>م</b> suena como la <b>M</b> en español. <i>(mim)</i>",
                      "mnemonic": "Parece una boca con una línea encima, como si dijeras 'mmm'.",
                      "examples": [
                          {
                              "t": "<b>م</b> como en <span class='hl'>مَرْحَبًا</span> (marhaba) = hola",
                              "n": "La primera letra de 'marhaba' es mim."
                          },
                          {
                              "t": "En <b>م</b> el sonido sale de los labios, como la M de 'mamá'.",
                              "n": "Nota: la M es labial."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_L_nun",
                      "isLetter": true,
                      "letter": "ن",
                      "word": "ن",
                      "emoji": "🔤",
                      "phonetic": "/n/",
                      "translation": "La letra <b>ن</b> suena como la <b>N</b> en español. <i>(nun)</i>",
                      "mnemonic": "Tiene un punto arriba, como una 'n' con un sombrerito.",
                      "examples": [
                          {
                              "t": "<b>ن</b> como en <span class='hl'>نَعَم</span> (naam) = sí",
                              "n": "Empieza con nun."
                          },
                          {
                              "t": "El punto de <b>ن</b> te recuerda que es una 'n'.",
                              "n": "Diferenciar de ب (b) que tiene el punto abajo."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_L_ha",
                      "isLetter": true,
                      "letter": "ه",
                      "word": "ه",
                      "emoji": "🔤",
                      "phonetic": "/h/",
                      "translation": "La letra <b>ه</b> suena como una <b>H</b> aspirada en inglés, más suave que ح. <i>(ha)</i>",
                      "mnemonic": "Parece un círculo con una colita, como una 'h' que se relaja.",
                      "examples": [
                          {
                              "t": "<b>ه</b> como en <span class='hl'>هُوَ</span> (huwa) = él",
                              "n": "Una h suave, como exhalar."
                          },
                          {
                              "t": "Comienza con <b>ه</b> la palabra 'hola' en árabe: مَرْحَبًا, pero aquí es una h distinta.",
                              "n": "No confundir con ح (más fuerte)."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_L_waw",
                      "isLetter": true,
                      "letter": "و",
                      "word": "و",
                      "emoji": "🔤",
                      "phonetic": "/w/ o /uː/",
                      "translation": "La letra <b>و</b> suena como la <b>W</b> en inglés o como una <b>U</b> larga. <i>(waw)</i>",
                      "mnemonic": "Parece una coma o una oreja, como una 'w' acostada.",
                      "examples": [
                          {
                              "t": "<b>و</b> como en <span class='hl'>وَقْت</span> (waqt) = tiempo",
                              "n": "Suena como 'w'."
                          },
                          {
                              "t": "También alarga la vocal: <b>و</b> en هُوَ (huwa) hace que la u sea larga.",
                              "n": "Doble función: consonante y vocal larga."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_L_ya",
                      "isLetter": true,
                      "letter": "ي",
                      "word": "ي",
                      "emoji": "🔤",
                      "phonetic": "/j/ o /iː/",
                      "translation": "La letra <b>ي</b> suena como la <b>Y</b> en español o como una <b>I</b> larga. <i>(ya)</i>",
                      "mnemonic": "Tiene dos puntos abajo, como una 'y' con lunares.",
                      "examples": [
                          {
                              "t": "<b>ي</b> como en <span class='hl'>يَوْم</span> (yawm) = día",
                              "n": "Suena como 'y'."
                          },
                          {
                              "t": "Como vocal larga: <b>ي</b> en فِي (fi) = en",
                              "n": "Alarga la i."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_01",
                      "isLetter": false,
                      "letter": "م",
                      "word": "مَرْحَبًا",
                      "emoji": "👋",
                      "phonetic": "marhaba",
                      "translation": "<b>Hola</b> (saludo general)",
                      "translations": {
                          "ar": "مَرْحَبًا",
                          "es": "Hola",
                          "en": "Hello"
                      },
                      "examples": [
                          {
                              "t": "<b>مَرْحَبًا</b>! كيف حالك؟",
                              "n": "¡Hola! ¿Cómo estás?"
                          },
                          {
                              "t": "قال <b>مَرْحَبًا</b> بابتسامة.",
                              "n": "Dijo hola con una sonrisa."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_02",
                      "isLetter": false,
                      "letter": "ش",
                      "word": "شُكْرًا",
                      "emoji": "🙏",
                      "phonetic": "shukran",
                      "translation": "<b>Gracias</b>",
                      "translations": {
                          "ar": "شُكْرًا",
                          "es": "Gracias",
                          "en": "Thanks"
                      },
                      "examples": [
                          {
                              "t": "<b>شُكْرًا</b> لك!",
                              "n": "¡Gracias a ti!"
                          },
                          {
                              "t": "أقول <b>شُكْرًا</b> دائمًا.",
                              "n": "Siempre digo gracias."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_03",
                      "isLetter": false,
                      "letter": "ن",
                      "word": "نَعَم",
                      "emoji": "✅",
                      "phonetic": "naam",
                      "translation": "<b>Sí</b>",
                      "translations": {
                          "ar": "نَعَم",
                          "es": "Sí",
                          "en": "Yes"
                      },
                      "examples": [
                          {
                              "t": "<b>نَعَم</b>، أريد قهوة.",
                              "n": "Sí, quiero café."
                          },
                          {
                              "t": "أجاب: <b>نَعَم</b>.",
                              "n": "Respondió: sí."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_04",
                      "isLetter": false,
                      "letter": "ل",
                      "word": "لَا",
                      "emoji": "❌",
                      "phonetic": "laa",
                      "translation": "<b>No</b>",
                      "translations": {
                          "ar": "لَا",
                          "es": "No",
                          "en": "No"
                      },
                      "examples": [
                          {
                              "t": "<b>لَا</b>، شكرًا.",
                              "n": "No, gracias."
                          },
                          {
                              "t": "قال <b>لَا</b> بحزن.",
                              "n": "Dijo no con tristeza."
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_05",
                      "isLetter": false,
                      "letter": "م",
                      "word": "مَنْ",
                      "emoji": "❓",
                      "phonetic": "man",
                      "translation": "<b>Quién</b> (y también <i>de</i> en contexto)",
                      "translations": {
                          "ar": "مَنْ",
                          "es": "Quién / de",
                          "en": "Who / from"
                      },
                      "examples": [
                          {
                              "t": "<b>مَنْ</b> أنت؟",
                              "n": "¿Quién eres?"
                          },
                          {
                              "t": "هذا كتاب <b>مَنْ</b>؟",
                              "n": "¿De quién es este libro?"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_06",
                      "isLetter": false,
                      "letter": "م",
                      "word": "مَاذَا",
                      "emoji": "❓",
                      "phonetic": "maadha",
                      "translation": "<b>Qué</b>",
                      "translations": {
                          "ar": "مَاذَا",
                          "es": "Qué",
                          "en": "What"
                      },
                      "examples": [
                          {
                              "t": "<b>مَاذَا</b> تريد؟",
                              "n": "¿Qué quieres?"
                          },
                          {
                              "t": "<b>مَاذَا</b> هذا؟",
                              "n": "¿Qué es esto?"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_07",
                      "isLetter": false,
                      "letter": "أ",
                      "word": "أَيْنَ",
                      "emoji": "📍",
                      "phonetic": "ayna",
                      "translation": "<b>Dónde</b>",
                      "translations": {
                          "ar": "أَيْنَ",
                          "es": "Dónde",
                          "en": "Where"
                      },
                      "examples": [
                          {
                              "t": "<b>أَيْنَ</b> الحمام؟",
                              "n": "¿Dónde está el baño?"
                          },
                          {
                              "t": "<b>أَيْنَ</b> تسكن؟",
                              "n": "¿Dónde vives?"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_08",
                      "isLetter": false,
                      "letter": "م",
                      "word": "مَتَى",
                      "emoji": "🕐",
                      "phonetic": "mataa",
                      "translation": "<b>Cuándo</b>",
                      "translations": {
                          "ar": "مَتَى",
                          "es": "Cuándo",
                          "en": "When"
                      },
                      "examples": [
                          {
                              "t": "<b>مَتَى</b> تصل؟",
                              "n": "¿Cuándo llegas?"
                          },
                          {
                              "t": "<b>مَتَى</b> نلتقي؟",
                              "n": "¿Cuándo nos reunimos?"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_09",
                      "isLetter": false,
                      "letter": "ك",
                      "word": "كَيْفَ",
                      "emoji": "❓",
                      "phonetic": "kayfa",
                      "translation": "<b>Cómo</b>",
                      "translations": {
                          "ar": "كَيْفَ",
                          "es": "Cómo",
                          "en": "How"
                      },
                      "examples": [
                          {
                              "t": "<b>كَيْفَ</b> حالك؟",
                              "n": "¿Cómo estás?"
                          },
                          {
                              "t": "<b>كَيْفَ</b> أصل إلى المطار؟",
                              "n": "¿Cómo llego al aeropuerto?"
                          }
                      ]
                  },
                  {
                      "id": "ar_a0_g4_10",
                      "isLetter": false,
                      "letter": "ل",
                      "word": "لِمَاذَا",
                      "emoji": "❓",
                      "phonetic": "limaadha",
                      "translation": "<b>Por qué</b>",
                      "translations": {
                          "ar": "لِمَاذَا",
                          "es": "Por qué",
                          "en": "Why"
                      },
                      "examples": [
                          {
                              "t": "<b>لِمَاذَا</b> تتعلم العربية؟",
                              "n": "¿Por qué aprendes árabe?"
                          },
                          {
                              "t": "<b>لِمَاذَا</b> لا؟",
                              "n": "¿Por qué no?"
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // JA_EN
  // ──────────────────────────────────────────────────────
  ja_en: {
      "level": "A0",
      "levelName": "Hiragana y Katakana",
      "groups": [
          {
              "id": "ja_a0_g1",
              "name": "Hiragana — parte 1",
              "icon": "🔤",
              "color": "#6366f1",
              "description": "あ行 か行 さ行 た行 な行 — primeras 25 sílabas",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ja_a0_g1_L_a-row",
                      "isLetter": true,
                      "letter": "あ",
                      "word": "あ",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "Vowel <b>あ</b> — like 'a' in <i>father</i> (short).<br>Stroke order: 3 strokes — horizontal, vertical, then loop.",
                      "mnemonic": "Looks like an 'a' with a tail, like a fish swimming.",
                      "examples": [
                          {
                              "t": "あ is the first vowel — <b>あ</b> as in <i>ah!</i>",
                              "n": "Remember the sound: 'a'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_i",
                      "isLetter": true,
                      "letter": "い",
                      "word": "い",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "Vowel <b>い</b> — like 'ee' in <i>see</i> (short).<br>Stroke order: 2 strokes — left slant, right slant.",
                      "mnemonic": "Two sticks leaning — like two 'i's?",
                      "examples": [
                          {
                              "t": "<b>い</b> sounds like <i>ee</i> — as in 'eel'.",
                              "n": "Remember: 'i' = 'ee'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_u",
                      "isLetter": true,
                      "letter": "う",
                      "word": "う",
                      "emoji": "🔤",
                      "phonetic": "/ɯ/",
                      "translation": "Vowel <b>う</b> — like 'oo' in <i>boot</i> but with lips unrounded.<br>Stroke order: 2 strokes — diagonal, then curve.",
                      "mnemonic": "Looks like a 'u' with a hat.",
                      "examples": [
                          {
                              "t": "<b>う</b> is like <i>oo</i> but without rounding lips.",
                              "n": "Think of 'ugh'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_e",
                      "isLetter": true,
                      "letter": "え",
                      "word": "え",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "Vowel <b>え</b> — like 'e' in <i>bed</i> (short).<br>Stroke order: 2 strokes — diagonal, then vertical and loop.",
                      "mnemonic": "Looks like a person doing a bow — 'eh?'",
                      "examples": [
                          {
                              "t": "<b>え</b> as in <i>echo</i> (without the 'o').",
                              "n": "Remember: 'e' = 'eh'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_o",
                      "isLetter": true,
                      "letter": "お",
                      "word": "お",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Vowel <b>お</b> — like 'o' in <i>more</i> (short).<br>Stroke order: 3 strokes — horizontal, vertical, loop, then cross.",
                      "mnemonic": "Looks like an 'o' with a belt.",
                      "examples": [
                          {
                              "t": "<b>お</b> as in <i>oh!</i>",
                              "n": "Remember: 'o' = 'oh'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ka-row",
                      "isLetter": true,
                      "letter": "か",
                      "word": "か",
                      "emoji": "🔤",
                      "phonetic": "/ka/",
                      "translation": "Sound <b>か</b> = 'ka' — like <i>car</i>.<br>Stroke order: 3 strokes — horizontal, vertical, then loop with diagonal.",
                      "mnemonic": "Looks like a 'ka' with a sword slash.",
                      "examples": [
                          {
                              "t": "<b>か</b> as in <i>car</i> — かさ (umbrella).",
                              "n": "Word: かさ (kasa) = umbrella."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ki",
                      "isLetter": true,
                      "letter": "き",
                      "word": "き",
                      "emoji": "🔤",
                      "phonetic": "/ki/",
                      "translation": "Sound <b>き</b> = 'ki' — like <i>key</i>.<br>Stroke order: 4 strokes — diagonal, horizontal, vertical, then loop.",
                      "mnemonic": "Looks like a key with a bow.",
                      "examples": [
                          {
                              "t": "<b>き</b> as in <i>key</i> — きれい (pretty).",
                              "n": "Word: きれい (kirei) = pretty."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ku",
                      "isLetter": true,
                      "letter": "く",
                      "word": "く",
                      "emoji": "🔤",
                      "phonetic": "/kɯ/",
                      "translation": "Sound <b>く</b> = 'ku' — like <i>coo</i> but shorter.<br>Stroke order: 2 strokes — two diagonals forming an angle.",
                      "mnemonic": "Looks like a bird's beak — 'coo'.",
                      "examples": [
                          {
                              "t": "<b>く</b> as in <i>coo</i> — like a bird.",
                              "n": "Remember: '<' shape."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ke",
                      "isLetter": true,
                      "letter": "け",
                      "word": "け",
                      "emoji": "🔤",
                      "phonetic": "/ke/",
                      "translation": "Sound <b>け</b> = 'ke' — like <i>keg</i>.<br>Stroke order: 3 strokes — diagonal, vertical, then horizontal and vertical.",
                      "mnemonic": "Looks like a 'K' with a stick.",
                      "examples": [
                          {
                              "t": "<b>け</b> as in <i>keg</i>.",
                              "n": "Remember: 'ke' as in 'keg'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ko",
                      "isLetter": true,
                      "letter": "こ",
                      "word": "こ",
                      "emoji": "🔤",
                      "phonetic": "/ko/",
                      "translation": "Sound <b>こ</b> = 'ko' — like <i>core</i>.<br>Stroke order: 2 strokes — two horizontals.",
                      "mnemonic": "Two lines like a 'co'.",
                      "examples": [
                          {
                              "t": "<b>こ</b> as in <i>core</i>.",
                              "n": "Remember: 'ko'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_sa-row",
                      "isLetter": true,
                      "letter": "さ",
                      "word": "さ",
                      "emoji": "🔤",
                      "phonetic": "/sa/",
                      "translation": "Sound <b>さ</b> = 'sa' — like <i>sock</i>.<br>Stroke order: 3 strokes — horizontal, vertical, then loop with diagonal.",
                      "mnemonic": "Looks like a 'sa' with a slash.",
                      "examples": [
                          {
                              "t": "<b>さ</b> as in <i>sock</i> — さくら (cherry).",
                              "n": "Word: さくら (sakura) = cherry."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_shi",
                      "isLetter": true,
                      "letter": "し",
                      "word": "し",
                      "emoji": "🔤",
                      "phonetic": "/ɕi/",
                      "translation": "Sound <b>し</b> = 'shi' — like <i>she</i>.<br>Stroke order: 1 stroke — a curve.",
                      "mnemonic": "Looks like a hook — 'she'.",
                      "examples": [
                          {
                              "t": "<b>し</b> as in <i>she</i>.",
                              "n": "Remember: 'shi'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_su",
                      "isLetter": true,
                      "letter": "す",
                      "word": "す",
                      "emoji": "🔤",
                      "phonetic": "/sɯ/",
                      "translation": "Sound <b>す</b> = 'su' — like <i>sue</i> but short.<br>Stroke order: 2 strokes — horizontal, then loop and vertical.",
                      "mnemonic": "Looks like a 'su' with a loop.",
                      "examples": [
                          {
                              "t": "<b>す</b> as in <i>sue</i> — すし (sushi).",
                              "n": "Word: すし (sushi) = sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_se",
                      "isLetter": true,
                      "letter": "せ",
                      "word": "せ",
                      "emoji": "🔤",
                      "phonetic": "/se/",
                      "translation": "Sound <b>せ</b> = 'se' — like <i>set</i>.<br>Stroke order: 3 strokes — horizontal, vertical, then horizontal and vertical.",
                      "mnemonic": "Looks like a 'se' with a cross.",
                      "examples": [
                          {
                              "t": "<b>せ</b> as in <i>set</i>.",
                              "n": "Remember: 'se'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_so",
                      "isLetter": true,
                      "letter": "そ",
                      "word": "そ",
                      "emoji": "🔤",
                      "phonetic": "/so/",
                      "translation": "Sound <b>そ</b> = 'so' — like <i>soap</i>.<br>Stroke order: 1 stroke — zigzag with loop.",
                      "mnemonic": "Looks like a 'z' with a loop.",
                      "examples": [
                          {
                              "t": "<b>そ</b> as in <i>soap</i>.",
                              "n": "Remember: 'so'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ta-row",
                      "isLetter": true,
                      "letter": "た",
                      "word": "た",
                      "emoji": "🔤",
                      "phonetic": "/ta/",
                      "translation": "Sound <b>た</b> = 'ta' — like <i>taco</i>.<br>Stroke order: 4 strokes — horizontal, vertical, horizontal, then loop with diagonal.",
                      "mnemonic": "Looks like a 'ta' with a sword.",
                      "examples": [
                          {
                              "t": "<b>た</b> as in <i>taco</i>.",
                              "n": "Remember: 'ta'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_chi",
                      "isLetter": true,
                      "letter": "ち",
                      "word": "ち",
                      "emoji": "🔤",
                      "phonetic": "/tɕi/",
                      "translation": "Sound <b>ち</b> = 'chi' — like <i>cheese</i>.<br>Stroke order: 3 strokes — horizontal, vertical, then loop.",
                      "mnemonic": "Looks like a '5' — 'chi' as in 'cheese'.",
                      "examples": [
                          {
                              "t": "<b>ち</b> as in <i>cheese</i> — irregular! Not 'ti'.",
                              "n": "Remember: 'chi'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_tsu",
                      "isLetter": true,
                      "letter": "つ",
                      "word": "つ",
                      "emoji": "🔤",
                      "phonetic": "/tsɯ/",
                      "translation": "Sound <b>つ</b> = 'tsu' — like <i>tsunami</i>.<br>Stroke order: 1 stroke — a curve with a loop.",
                      "mnemonic": "Looks like a wave — 'tsu' as in tsunami.",
                      "examples": [
                          {
                              "t": "<b>つ</b> as in <i>tsunami</i> — irregular! Not 'tu'.",
                              "n": "Remember: 'tsu'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_te",
                      "isLetter": true,
                      "letter": "て",
                      "word": "て",
                      "emoji": "🔤",
                      "phonetic": "/te/",
                      "translation": "Sound <b>て</b> = 'te' — like <i>ten</i>.<br>Stroke order: 1 stroke — a curve with a hook.",
                      "mnemonic": "Looks like a 't' with a tail.",
                      "examples": [
                          {
                              "t": "<b>て</b> as in <i>ten</i>.",
                              "n": "Remember: 'te'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_to",
                      "isLetter": true,
                      "letter": "と",
                      "word": "と",
                      "emoji": "🔤",
                      "phonetic": "/to/",
                      "translation": "Sound <b>と</b> = 'to' — like <i>tore</i>.<br>Stroke order: 2 strokes — horizontal, then vertical and curve.",
                      "mnemonic": "Looks like a 'to' with a hook.",
                      "examples": [
                          {
                              "t": "<b>と</b> as in <i>tore</i>.",
                              "n": "Remember: 'to'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_na-row",
                      "isLetter": true,
                      "letter": "な",
                      "word": "な",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "Sound <b>な</b> = 'na' — like <i>nacho</i>.<br>Stroke order: 4 strokes — horizontal, vertical, horizontal, then loop with diagonal.",
                      "mnemonic": "Looks like a 'na' with a sword.",
                      "examples": [
                          {
                              "t": "<b>な</b> as in <i>nacho</i>.",
                              "n": "Remember: 'na'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ni",
                      "isLetter": true,
                      "letter": "に",
                      "word": "に",
                      "emoji": "🔤",
                      "phonetic": "/ɲi/",
                      "translation": "Sound <b>に</b> = 'ni' — like <i>knee</i>.<br>Stroke order: 3 strokes — horizontal, vertical, then horizontal and vertical.",
                      "mnemonic": "Looks like a 'knee' with a cross.",
                      "examples": [
                          {
                              "t": "<b>に</b> as in <i>knee</i> — なに (what).",
                              "n": "Word: なに (nani) = what."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_nu",
                      "isLetter": true,
                      "letter": "ぬ",
                      "word": "ぬ",
                      "emoji": "🔤",
                      "phonetic": "/nɯ/",
                      "translation": "Sound <b>ぬ</b> = 'nu' — like <i>noodle</i>.<br>Stroke order: 2 strokes — loop and curve.",
                      "mnemonic": "Looks like a noodle loop.",
                      "examples": [
                          {
                              "t": "<b>ぬ</b> as in <i>noodle</i>.",
                              "n": "Remember: 'nu'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ne",
                      "isLetter": true,
                      "letter": "ね",
                      "word": "ね",
                      "emoji": "🔤",
                      "phonetic": "/ne/",
                      "translation": "Sound <b>ね</b> = 'ne' — like <i>net</i>.<br>Stroke order: 2 strokes — horizontal, then vertical and loop.",
                      "mnemonic": "Looks like a 'ne' with a loop.",
                      "examples": [
                          {
                              "t": "<b>ね</b> as in <i>net</i> — ねこ (cat).",
                              "n": "Word: ねこ (neko) = cat."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_no",
                      "isLetter": true,
                      "letter": "の",
                      "word": "の",
                      "emoji": "🔤",
                      "phonetic": "/no/",
                      "translation": "Sound <b>の</b> = 'no' — like <i>note</i>.<br>Stroke order: 1 stroke — a loop with a tail.",
                      "mnemonic": "Looks like a 'no' symbol (circle with slash).",
                      "examples": [
                          {
                              "t": "<b>の</b> as in <i>note</i>.",
                              "n": "Remember: 'no'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_01",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "あさ",
                      "emoji": "🌅",
                      "phonetic": "/asa/",
                      "translation": "<b>あさ</b> — morning",
                      "translations": {
                          "ja": "あさ",
                          "en": "morning"
                      },
                      "examples": [
                          {
                              "t": "あさ に おきます。",
                              "n": "I wake up in the morning."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_02",
                      "isLetter": false,
                      "letter": "き",
                      "word": "きく",
                      "emoji": "👂",
                      "phonetic": "/kikɯ/",
                      "translation": "<b>きく</b> — to hear/listen",
                      "translations": {
                          "ja": "きく",
                          "en": "to hear"
                      },
                      "examples": [
                          {
                              "t": "おんがく を ききます。",
                              "n": "I listen to music."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_03",
                      "isLetter": false,
                      "letter": "す",
                      "word": "すし",
                      "emoji": "🍣",
                      "phonetic": "/sɯɕi/",
                      "translation": "<b>すし</b> — sushi",
                      "translations": {
                          "ja": "すし",
                          "en": "sushi"
                      },
                      "examples": [
                          {
                              "t": "すし が すき です。",
                              "n": "I like sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_04",
                      "isLetter": false,
                      "letter": "た",
                      "word": "たべる",
                      "emoji": "🍽️",
                      "phonetic": "/ta.be.ɾɯ/",
                      "translation": "<b>たべる</b> — to eat",
                      "translations": {
                          "ja": "たべる",
                          "en": "to eat"
                      },
                      "examples": [
                          {
                              "t": "すし を たべます。",
                              "n": "I eat sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_05",
                      "isLetter": false,
                      "letter": "ね",
                      "word": "ねる",
                      "emoji": "😴",
                      "phonetic": "/ne.ɾɯ/",
                      "translation": "<b>ねる</b> — to sleep",
                      "translations": {
                          "ja": "ねる",
                          "en": "to sleep"
                      },
                      "examples": [
                          {
                              "t": "よる に ねます。",
                              "n": "I sleep at night."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g2",
              "name": "Hiragana — parte 2",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "は行 ま行 や行 ら行 わ行 ん + dakuten",
              "reviewFrom": [
                  "ja_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g2_L_ha",
                      "isLetter": true,
                      "letter": "は",
                      "word": "は",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "Letter <b>は</b> sounds like <i>ha</i>.",
                      "mnemonic": "It looks like a person raising both arms to say 'ha!'",
                      "examples": [
                          {
                              "t": "<b>は</b> as in はな (flower)",
                              "n": "ha-na"
                          },
                          {
                              "t": "Also used as particle 'wa' in sentences",
                              "n": "e.g., わたしは (watashi wa)"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_hi",
                      "isLetter": true,
                      "letter": "ひ",
                      "word": "ひ",
                      "emoji": "🔤",
                      "phonetic": "/hi/",
                      "translation": "Letter <b>ひ</b> sounds like <i>hi</i>.",
                      "mnemonic": "Looks like a smiling mouth saying 'hee'.",
                      "examples": [
                          {
                              "t": "<b>ひ</b> as in ひ (fire)",
                              "n": "hi"
                          },
                          {
                              "t": "Imagine a happy face: <b>ひ</b> has a curved smile",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_fu",
                      "isLetter": true,
                      "letter": "ふ",
                      "word": "ふ",
                      "emoji": "🔤",
                      "phonetic": "/ɸɯ/",
                      "translation": "Letter <b>ふ</b> sounds like <i>fu</i> (with unrounded lips, between <i>fu</i> and <i>hu</i>).",
                      "mnemonic": "Looks like a mount Fuji with a flat top, blowing air.",
                      "examples": [
                          {
                              "t": "<b>ふ</b> as in ふじ (Fuji)",
                              "n": "fu-ji"
                          },
                          {
                              "t": "Blow air gently: <b>ふ</b> is like 'whoo'",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_he",
                      "isLetter": true,
                      "letter": "へ",
                      "word": "へ",
                      "emoji": "🔤",
                      "phonetic": "/he/",
                      "translation": "Letter <b>へ</b> sounds like <i>he</i>.",
                      "mnemonic": "Looks like a hat with a brim, saying 'hey'.",
                      "examples": [
                          {
                              "t": "<b>へ</b> as in へや (room)",
                              "n": "he-ya"
                          },
                          {
                              "t": "Also a particle meaning 'to' (direction)",
                              "n": "e.g., がっこうへ (to school)"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ho",
                      "isLetter": true,
                      "letter": "ほ",
                      "word": "ほ",
                      "emoji": "🔤",
                      "phonetic": "/ho/",
                      "translation": "Letter <b>ほ</b> sounds like <i>ho</i>.",
                      "mnemonic": "Like <b>は</b> but with an extra line on the right, like a 'ho' with a stick.",
                      "examples": [
                          {
                              "t": "<b>ほ</b> as in ほし (star)",
                              "n": "ho-shi"
                          },
                          {
                              "t": "Compare with <b>は</b>: <b>ほ</b> has an extra stroke",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ma",
                      "isLetter": true,
                      "letter": "ま",
                      "word": "ま",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "Letter <b>ま</b> sounds like <i>ma</i>.",
                      "mnemonic": "Looks like a person with arms open, saying 'ma' (like 'mom').",
                      "examples": [
                          {
                              "t": "<b>ま</b> as in まめ (bean)",
                              "n": "ma-me"
                          },
                          {
                              "t": "Imagine a big 'M' with a loop",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mi",
                      "isLetter": true,
                      "letter": "み",
                      "word": "み",
                      "emoji": "🔤",
                      "phonetic": "/mi/",
                      "translation": "Letter <b>み</b> sounds like <i>mi</i>.",
                      "mnemonic": "Looks like a '21' – like 'me' in Spanish (mí).",
                      "examples": [
                          {
                              "t": "<b>み</b> as in みみ (ear)",
                              "n": "mi-mi"
                          },
                          {
                              "t": "Two loops like ears",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mu",
                      "isLetter": true,
                      "letter": "む",
                      "word": "む",
                      "emoji": "🔤",
                      "phonetic": "/mɯ/",
                      "translation": "Letter <b>む</b> sounds like <i>mu</i>.",
                      "mnemonic": "Looks like a cow's head with horns, saying 'moo'.",
                      "examples": [
                          {
                              "t": "<b>む</b> as in むし (insect)",
                              "n": "mu-shi"
                          },
                          {
                              "t": "Imagine a mooing cow",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_me",
                      "isLetter": true,
                      "letter": "め",
                      "word": "め",
                      "emoji": "🔤",
                      "phonetic": "/me/",
                      "translation": "Letter <b>め</b> sounds like <i>me</i>.",
                      "mnemonic": "Looks like a twisted 'me' – like 'me' in English.",
                      "examples": [
                          {
                              "t": "<b>め</b> as in め (eye)",
                              "n": "me"
                          },
                          {
                              "t": "Compare with <b>ぬ</b> (nu) – <b>め</b> has no loop on top",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mo",
                      "isLetter": true,
                      "letter": "も",
                      "word": "も",
                      "emoji": "🔤",
                      "phonetic": "/mo/",
                      "translation": "Letter <b>も</b> sounds like <i>mo</i>.",
                      "mnemonic": "Looks like a 'mo' with two hooks, like a fishing hook.",
                      "examples": [
                          {
                              "t": "<b>も</b> as in もも (peach)",
                              "n": "mo-mo"
                          },
                          {
                              "t": "Also means 'also' in Japanese",
                              "n": "e.g., わたしも (me too)"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ya",
                      "isLetter": true,
                      "letter": "や",
                      "word": "や",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Letter <b>や</b> sounds like <i>ya</i>.",
                      "mnemonic": "Looks like a 'ya' with a long stroke, like a yawn.",
                      "examples": [
                          {
                              "t": "<b>や</b> as in やま (mountain)",
                              "n": "ya-ma"
                          },
                          {
                              "t": "Imagine a yawn: <b>や</b> opens wide",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_yu",
                      "isLetter": true,
                      "letter": "ゆ",
                      "word": "ゆ",
                      "emoji": "🔤",
                      "phonetic": "/jɯ/",
                      "translation": "Letter <b>ゆ</b> sounds like <i>yu</i>.",
                      "mnemonic": "Looks like a fish hook, like 'you' in English.",
                      "examples": [
                          {
                              "t": "<b>ゆ</b> as in ゆき (snow)",
                              "n": "yu-ki"
                          },
                          {
                              "t": "Imagine a 'u' with a tail",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_yo",
                      "isLetter": true,
                      "letter": "よ",
                      "word": "よ",
                      "emoji": "🔤",
                      "phonetic": "/jo/",
                      "translation": "Letter <b>よ</b> sounds like <i>yo</i>.",
                      "mnemonic": "Looks like a 'yo' with a sword, like 'yo!' greeting.",
                      "examples": [
                          {
                              "t": "<b>よ</b> as in よる (night)",
                              "n": "yo-ru"
                          },
                          {
                              "t": "Imagine a sword cutting down",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ra",
                      "isLetter": true,
                      "letter": "ら",
                      "word": "ら",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "Letter <b>ら</b> sounds like <i>ra</i> (flapped, between <i>r</i> and <i>l</i>).",
                      "mnemonic": "Looks like a rabbit's ear, and 'ra' like 'rabbit' in Spanish (conejo).",
                      "examples": [
                          {
                              "t": "<b>ら</b> as in らくだ (camel)",
                              "n": "ra-ku-da"
                          },
                          {
                              "t": "Remember: flap your tongue once",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ri",
                      "isLetter": true,
                      "letter": "り",
                      "word": "り",
                      "emoji": "🔤",
                      "phonetic": "/ɾi/",
                      "translation": "Letter <b>り</b> sounds like <i>ri</i> (flapped).",
                      "mnemonic": "Looks like two sticks, like 'ri' in 'river'.",
                      "examples": [
                          {
                              "t": "<b>り</b> as in りんご (apple)",
                              "n": "rin-go"
                          },
                          {
                              "t": "Two strokes: left and right",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ru",
                      "isLetter": true,
                      "letter": "る",
                      "word": "る",
                      "emoji": "🔤",
                      "phonetic": "/ɾɯ/",
                      "translation": "Letter <b>る</b> sounds like <i>ru</i> (flapped).",
                      "mnemonic": "Looks like a 'ru' with a loop, like a rolling stone.",
                      "examples": [
                          {
                              "t": "<b>る</b> as in くるま (car)",
                              "n": "ku-ru-ma"
                          },
                          {
                              "t": "Loop at the end",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_re",
                      "isLetter": true,
                      "letter": "れ",
                      "word": "れ",
                      "emoji": "🔤",
                      "phonetic": "/ɾe/",
                      "translation": "Letter <b>れ</b> sounds like <i>re</i> (flapped).",
                      "mnemonic": "Looks like a 're' with a loop, like 'ready'.",
                      "examples": [
                          {
                              "t": "<b>れ</b> as in れきし (history)",
                              "n": "re-ki-shi"
                          },
                          {
                              "t": "Compare with <b>わ</b> – <b>れ</b> has a loop",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ro",
                      "isLetter": true,
                      "letter": "ろ",
                      "word": "ろ",
                      "emoji": "🔤",
                      "phonetic": "/ɾo/",
                      "translation": "Letter <b>ろ</b> sounds like <i>ro</i> (flapped).",
                      "mnemonic": "Looks like <b>る</b> without the loop, like a road.",
                      "examples": [
                          {
                              "t": "<b>ろ</b> as in ろく (six)",
                              "n": "ro-ku"
                          },
                          {
                              "t": "No loop at the end",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wa",
                      "isLetter": true,
                      "letter": "わ",
                      "word": "わ",
                      "emoji": "🔤",
                      "phonetic": "/wa/",
                      "translation": "Letter <b>わ</b> sounds like <i>wa</i>.",
                      "mnemonic": "Looks like a 'wa' with a loop, like 'wow'.",
                      "examples": [
                          {
                              "t": "<b>わ</b> as in わたし (I)",
                              "n": "wa-ta-shi"
                          },
                          {
                              "t": "Imagine a surprised 'wa!'",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wo",
                      "isLetter": true,
                      "letter": "を",
                      "word": "を",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Letter <b>を</b> is pronounced <i>o</i> (same as お) – used only as a particle.",
                      "mnemonic": "Looks like a 'wo' with a hook, but remember it sounds like 'o'.",
                      "examples": [
                          {
                              "t": "<b>を</b> is the object marker particle",
                              "n": "e.g., ごはんをたべる (eat rice)"
                          },
                          {
                              "t": "Never used in words, only as particle",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_n",
                      "isLetter": true,
                      "letter": "ん",
                      "word": "ん",
                      "emoji": "🔤",
                      "phonetic": "/n/",
                      "translation": "Letter <b>ん</b> is the only standalone nasal – sounds like <i>n</i>.",
                      "mnemonic": "Looks like a squiggly 'n', like a snake.",
                      "examples": [
                          {
                              "t": "<b>ん</b> as in にほん (Japan)",
                              "n": "ni-hon"
                          },
                          {
                              "t": "Always ends a syllable",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_dakuten",
                      "isLetter": true,
                      "letter": "゛",
                      "word": "゛",
                      "emoji": "🔤",
                      "phonetic": "/voiced/",
                      "translation": "Dakuten <b>゛</b> adds voicing: <i>k→g, s→z, t→d, h→b</i>.",
                      "mnemonic": "Two small strokes like a voice box, making sounds 'voiced'.",
                      "examples": [
                          {
                              "t": "<b>が</b> (ga) from か (ka)",
                              "n": "ka → ga"
                          },
                          {
                              "t": "<b>ざ</b> (za) from さ (sa)",
                              "n": "sa → za"
                          },
                          {
                              "t": "<b>だ</b> (da) from た (ta)",
                              "n": "ta → da"
                          },
                          {
                              "t": "<b>ば</b> (ba) from は (ha)",
                              "n": "ha → ba"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_handakuten",
                      "isLetter": true,
                      "letter": "゜",
                      "word": "゜",
                      "emoji": "🔤",
                      "phonetic": "/p/",
                      "translation": "Handakuten <b>゜</b> changes <i>h</i> to <i>p</i>.",
                      "mnemonic": "A small circle like a puff of air, making 'p' sounds.",
                      "examples": [
                          {
                              "t": "<b>ぱ</b> (pa) from は (ha)",
                              "n": "ha → pa"
                          },
                          {
                              "t": "Only used with は行",
                              "n": ""
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_01",
                      "isLetter": false,
                      "letter": "は",
                      "word": "はな",
                      "emoji": "🌸",
                      "phonetic": "/hana/",
                      "translation": "flower",
                      "translations": {
                          "ja": "はな",
                          "en": "flower"
                      },
                      "examples": [
                          {
                              "t": "これは<b>はな</b>です",
                              "n": "This is a flower."
                          },
                          {
                              "t": "<b>はな</b>がきれい",
                              "n": "The flower is pretty."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_02",
                      "isLetter": false,
                      "letter": "み",
                      "word": "みず",
                      "emoji": "💧",
                      "phonetic": "/mizu/",
                      "translation": "water",
                      "translations": {
                          "ja": "みず",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "<b>みず</b>をください",
                              "n": "Please give me water."
                          },
                          {
                              "t": "<b>みず</b>はつめたい",
                              "n": "The water is cold."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_03",
                      "isLetter": false,
                      "letter": "や",
                      "word": "やま",
                      "emoji": "⛰️",
                      "phonetic": "/jama/",
                      "translation": "mountain",
                      "translations": {
                          "ja": "やま",
                          "en": "mountain"
                      },
                      "examples": [
                          {
                              "t": "<b>やま</b>がたかい",
                              "n": "The mountain is tall."
                          },
                          {
                              "t": "ふじさんは<b>やま</b>です",
                              "n": "Mt. Fuji is a mountain."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_04",
                      "isLetter": false,
                      "letter": "ら",
                      "word": "られる",
                      "emoji": "💪",
                      "phonetic": "/rareru/",
                      "translation": "can do (potential form)",
                      "translations": {
                          "ja": "られる",
                          "en": "can do"
                      },
                      "examples": [
                          {
                              "t": "にほんごが<b>はなせる</b>",
                              "n": "I can speak Japanese."
                          },
                          {
                              "t": "これは<b>たべられる</b>",
                              "n": "This can be eaten."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_05",
                      "isLetter": false,
                      "letter": "わ",
                      "word": "わたし",
                      "emoji": "🙋",
                      "phonetic": "/watashi/",
                      "translation": "I (first person pronoun)",
                      "translations": {
                          "ja": "わたし",
                          "en": "I"
                      },
                      "examples": [
                          {
                              "t": "<b>わたし</b>はがくせいです",
                              "n": "I am a student."
                          },
                          {
                              "t": "<b>わたし</b>のなまえは...",
                              "n": "My name is..."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_06",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "ありがとう",
                      "emoji": "🙏",
                      "phonetic": "/arigatoː/",
                      "translation": "thank you",
                      "translations": {
                          "ja": "ありがとう",
                          "en": "thank you"
                      },
                      "examples": [
                          {
                              "t": "<b>ありがとう</b>ございます",
                              "n": "Thank you (polite)."
                          },
                          {
                              "t": "<b>ありがとう</b>！",
                              "n": "Thanks!"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_07",
                      "isLetter": false,
                      "letter": "ん",
                      "word": "にほん",
                      "emoji": "🇯🇵",
                      "phonetic": "/nihoɴ/",
                      "translation": "Japan",
                      "translations": {
                          "ja": "にほん",
                          "en": "Japan"
                      },
                      "examples": [
                          {
                              "t": "<b>にほん</b>がすきです",
                              "n": "I like Japan."
                          },
                          {
                              "t": "<b>にほん</b>ごをべんきょうしています",
                              "n": "I am studying Japanese."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g3",
              "name": "Katakana — parte 1",
              "icon": "🔠",
              "color": "#10b981",
              "description": "ア行 カ行 サ行 タ行 ナ行 — comparando con hiragana",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g3_L_a",
                      "isLetter": true,
                      "letter": "ア",
                      "word": "ア",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "<b>ア</b> — same sound as hiragana <b>あ</b> <i>(a)</i><br>Looks like a two-stroke roof over a cross",
                      "mnemonic": "An <span class='hl'>antenna</span> sticking out of a roof — the katakana ア is the hiragana あ without the loop.",
                      "examples": [
                          {
                              "t": "<b>ア</b> is used in <b>アメリカ</b> <i>(America)</i>",
                              "n": "The first sound of 'America' in Japanese"
                          },
                          {
                              "t": "Compare: <b>ア</b> vs <b>あ</b> — katakana is more angular",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_i",
                      "isLetter": true,
                      "letter": "イ",
                      "word": "イ",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "<b>イ</b> — same sound as hiragana <b>い</b> <i>(i)</i><br>Two bold diagonal strokes like a lean-to",
                      "mnemonic": "The <span class='hl'>two chopsticks</span> leaning together — イ is the hiragana い without the curve.",
                      "examples": [
                          {
                              "t": "<b>イ</b> starts <b>イタリア</b> <i>(Italy)</i>",
                              "n": "Country name in katakana"
                          },
                          {
                              "t": "Compare: <b>イ</b> vs <b>い</b> — straight lines vs curves",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_u",
                      "isLetter": true,
                      "letter": "ウ",
                      "word": "ウ",
                      "emoji": "🔤",
                      "phonetic": "/u/",
                      "translation": "<b>ウ</b> — same sound as hiragana <b>う</b> <i>(u)</i><br>A roof with a dot on top",
                      "mnemonic": "A <span class='hl'>birdhouse</span> with a little bird on top — ウ has a dot that う doesn't.",
                      "examples": [
                          {
                              "t": "<b>ウ</b> appears in <b>ウイスキー</b> <i>(whiskey)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ウ</b> vs <b>う</b> — the dot is the key difference",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_e",
                      "isLetter": true,
                      "letter": "エ",
                      "word": "エ",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "<b>エ</b> — same sound as hiragana <b>え</b> <i>(e)</i><br>Like an angular letter 'E' without the middle bar",
                      "mnemonic": "An <span class='hl'>elevator</span> shaft — エ looks like a square frame, while え is curved.",
                      "examples": [
                          {
                              "t": "<b>エ</b> starts <b>エレベーター</b> <i>(elevator)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>エ</b> vs <b>え</b> — katakana is boxy",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_o",
                      "isLetter": true,
                      "letter": "オ",
                      "word": "オ",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "<b>オ</b> — same sound as hiragana <b>お</b> <i>(o)</i><br>A cross with a vertical stroke through it",
                      "mnemonic": "A <span class='hl'>tree</span> with branches — オ is the hiragana お without the loop at the bottom.",
                      "examples": [
                          {
                              "t": "<b>オ</b> appears in <b>オーストラリア</b> <i>(Australia)</i>",
                              "n": "Country name"
                          },
                          {
                              "t": "Compare: <b>オ</b> vs <b>お</b> — simpler, fewer strokes",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ka",
                      "isLetter": true,
                      "letter": "カ",
                      "word": "カ",
                      "emoji": "🔤",
                      "phonetic": "/ka/",
                      "translation": "<b>カ</b> — same sound as hiragana <b>か</b> <i>(ka)</i><br>Like a 'K' with a slanting stroke",
                      "mnemonic": "A <span class='hl'>karate</span> chop — カ is the hiragana か without the curly part.",
                      "examples": [
                          {
                              "t": "<b>カ</b> starts <b>カメラ</b> <i>(camera)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>カ</b> vs <b>か</b> — katakana is simpler",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ki",
                      "isLetter": true,
                      "letter": "キ",
                      "word": "キ",
                      "emoji": "🔤",
                      "phonetic": "/ki/",
                      "translation": "<b>キ</b> — same sound as hiragana <b>き</b> <i>(ki)</i><br>Like a cross with a horizontal slash",
                      "mnemonic": "A <span class='hl'>key</span> hanging on a hook — キ is the hiragana き without the bottom curve.",
                      "examples": [
                          {
                              "t": "<b>キ</b> starts <b>キロ</b> <i>(kilo)</i>",
                              "n": "Short for kilometer/kilogram"
                          },
                          {
                              "t": "Compare: <b>キ</b> vs <b>き</b> — fewer strokes",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ku",
                      "isLetter": true,
                      "letter": "ク",
                      "word": "ク",
                      "emoji": "🔤",
                      "phonetic": "/ku/",
                      "translation": "<b>ク</b> — same sound as hiragana <b>く</b> <i>(ku)</i><br>Like a checkmark with a tail",
                      "mnemonic": "A <span class='hl'>cuckoo</span> bird's beak — ク is the hiragana く with a small tick at the top.",
                      "examples": [
                          {
                              "t": "<b>ク</b> appears in <b>クラブ</b> <i>(club)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ク</b> vs <b>く</b> — the tick is the difference",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ke",
                      "isLetter": true,
                      "letter": "ケ",
                      "word": "ケ",
                      "emoji": "🔤",
                      "phonetic": "/ke/",
                      "translation": "<b>ケ</b> — same sound as hiragana <b>け</b> <i>(ke)</i><br>Like a 'K' with a long diagonal stroke",
                      "mnemonic": "A <span class='hl'>kettle</span> spout — ケ is the hiragana け without the bottom loop.",
                      "examples": [
                          {
                              "t": "<b>ケ</b> starts <b>ケーキ</b> <i>(cake)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ケ</b> vs <b>け</b> — simpler shape",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ko",
                      "isLetter": true,
                      "letter": "コ",
                      "word": "コ",
                      "emoji": "🔤",
                      "phonetic": "/ko/",
                      "translation": "<b>コ</b> — same sound as hiragana <b>こ</b> <i>(ko)</i><br>Two horizontal lines connected on the left",
                      "mnemonic": "A <span class='hl'>box</span> seen from the side — コ is the hiragana こ but with sharp corners.",
                      "examples": [
                          {
                              "t": "<b>コ</b> starts <b>コーヒー</b> <i>(coffee)</i>",
                              "n": "Famous loanword"
                          },
                          {
                              "t": "Compare: <b>コ</b> vs <b>こ</b> — angular vs rounded",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_sa",
                      "isLetter": true,
                      "letter": "サ",
                      "word": "サ",
                      "emoji": "🔤",
                      "phonetic": "/sa/",
                      "translation": "<b>サ</b> — same sound as hiragana <b>さ</b> <i>(sa)</i><br>Like a cross with two horizontal strokes",
                      "mnemonic": "A <span class='hl'>saw</span> blade — サ is the hiragana さ without the loop.",
                      "examples": [
                          {
                              "t": "<b>サ</b> starts <b>サラダ</b> <i>(salad)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>サ</b> vs <b>さ</b> — katakana is more angular",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_shi",
                      "isLetter": true,
                      "letter": "シ",
                      "word": "シ",
                      "emoji": "🔤",
                      "phonetic": "/ɕi/",
                      "translation": "<b>シ</b> — same sound as hiragana <b>し</b> <i>(shi)</i><br>Two short strokes and a longer curved one",
                      "mnemonic": "A <span class='hl'>sheep</span> with two ears — シ is the hiragana し with two dots on top.",
                      "examples": [
                          {
                              "t": "<b>シ</b> appears in <b>シャツ</b> <i>(shirt)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>シ</b> vs <b>し</b> — the dots are the difference",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_su",
                      "isLetter": true,
                      "letter": "ス",
                      "word": "ス",
                      "emoji": "🔤",
                      "phonetic": "/sɯ/",
                      "translation": "<b>ス</b> — same sound as hiragana <b>す</b> <i>(su)</i><br>Like a 'Z' with a curved bottom",
                      "mnemonic": "A <span class='hl'>sushi</span> roll — ス is the hiragana す without the loop at the end.",
                      "examples": [
                          {
                              "t": "<b>ス</b> starts <b>スープ</b> <i>(soup)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ス</b> vs <b>す</b> — simpler, no loop",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_se",
                      "isLetter": true,
                      "letter": "セ",
                      "word": "セ",
                      "emoji": "🔤",
                      "phonetic": "/se/",
                      "translation": "<b>セ</b> — same sound as hiragana <b>せ</b> <i>(se)</i><br>Like a 'Z' with a horizontal line through it",
                      "mnemonic": "A <span class='hl'>sail</span> on a boat — セ is the hiragana せ without the bottom curve.",
                      "examples": [
                          {
                              "t": "<b>セ</b> starts <b>セーター</b> <i>(sweater)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>セ</b> vs <b>せ</b> — straighter lines",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_so",
                      "isLetter": true,
                      "letter": "ソ",
                      "word": "ソ",
                      "emoji": "🔤",
                      "phonetic": "/so/",
                      "translation": "<b>ソ</b> — same sound as hiragana <b>そ</b> <i>(so)</i><br>One short stroke and one long curved stroke",
                      "mnemonic": "A <span class='hl'>sewing</span> needle with thread — ソ is the hiragana そ without the top loop.",
                      "examples": [
                          {
                              "t": "<b>ソ</b> appears in <b>ソファ</b> <i>(sofa)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ソ</b> vs <b>そ</b> — simpler, fewer curves",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ta",
                      "isLetter": true,
                      "letter": "タ",
                      "word": "タ",
                      "emoji": "🔤",
                      "phonetic": "/ta/",
                      "translation": "<b>タ</b> — same sound as hiragana <b>た</b> <i>(ta)</i><br>Like a 'T' with a curved top stroke",
                      "mnemonic": "A <span class='hl'>tent</span> — タ is the hiragana た without the bottom stroke.",
                      "examples": [
                          {
                              "t": "<b>タ</b> starts <b>タクシー</b> <i>(taxi)</i>",
                              "n": "Famous loanword"
                          },
                          {
                              "t": "Compare: <b>タ</b> vs <b>た</b> — fewer strokes",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_chi",
                      "isLetter": true,
                      "letter": "チ",
                      "word": "チ",
                      "emoji": "🔤",
                      "phonetic": "/tɕi/",
                      "translation": "<b>チ</b> — same sound as hiragana <b>ち</b> <i>(chi)</i><br>Like a '5' with a line on top",
                      "mnemonic": "A <span class='hl'>cheese</span> wedge — チ is the hiragana ち without the bottom curve.",
                      "examples": [
                          {
                              "t": "<b>チ</b> starts <b>チーズ</b> <i>(cheese)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>チ</b> vs <b>ち</b> — angular vs rounded",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_tsu",
                      "isLetter": true,
                      "letter": "ツ",
                      "word": "ツ",
                      "emoji": "🔤",
                      "phonetic": "/tsɯ/",
                      "translation": "<b>ツ</b> — same sound as hiragana <b>つ</b> <i>(tsu)</i><br>Two short strokes and one long curved stroke",
                      "mnemonic": "A <span class='hl'>tsunami</span> wave with two splashes — ツ is the hiragana つ with two dots on top.",
                      "examples": [
                          {
                              "t": "<b>ツ</b> appears in <b>ツアー</b> <i>(tour)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ツ</b> vs <b>つ</b> — the dots are the difference",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_te",
                      "isLetter": true,
                      "letter": "テ",
                      "word": "テ",
                      "emoji": "🔤",
                      "phonetic": "/te/",
                      "translation": "<b>テ</b> — same sound as hiragana <b>て</b> <i>(te)</i><br>Like a 'T' with a small slash on top",
                      "mnemonic": "A <span class='hl'>telescope</span> on a tripod — テ is the hiragana て straightened out.",
                      "examples": [
                          {
                              "t": "<b>テ</b> starts <b>テレビ</b> <i>(TV)</i>",
                              "n": "Famous loanword"
                          },
                          {
                              "t": "Compare: <b>テ</b> vs <b>て</b> — katakana is straight",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_to",
                      "isLetter": true,
                      "letter": "ト",
                      "word": "ト",
                      "emoji": "🔤",
                      "phonetic": "/to/",
                      "translation": "<b>ト</b> — same sound as hiragana <b>と</b> <i>(to)</i><br>A vertical stroke with a small diagonal on top",
                      "mnemonic": "A <span class='hl'>toe</span> pointing up — ト is the hiragana と without the loop.",
                      "examples": [
                          {
                              "t": "<b>ト</b> appears in <b>トマト</b> <i>(tomato)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ト</b> vs <b>と</b> — simpler, no loop",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_na",
                      "isLetter": true,
                      "letter": "ナ",
                      "word": "ナ",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "<b>ナ</b> — same sound as hiragana <b>な</b> <i>(na)</i><br>Like a 'T' with a long left stroke",
                      "mnemonic": "A <span class='hl'>knife</span> cutting — ナ is the hiragana な without the loops.",
                      "examples": [
                          {
                              "t": "<b>ナ</b> starts <b>ナイフ</b> <i>(knife)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ナ</b> vs <b>な</b> — fewer strokes",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ni",
                      "isLetter": true,
                      "letter": "ニ",
                      "word": "ニ",
                      "emoji": "🔤",
                      "phonetic": "/ɲi/",
                      "translation": "<b>ニ</b> — same sound as hiragana <b>に</b> <i>(ni)</i><br>Two horizontal parallel lines",
                      "mnemonic": "A <span class='hl'>knee</span> with two creases — ニ is the hiragana に without the vertical stroke.",
                      "examples": [
                          {
                              "t": "<b>ニ</b> appears in <b>ニュース</b> <i>(news)</i>",
                              "n": "Famous loanword"
                          },
                          {
                              "t": "Compare: <b>ニ</b> vs <b>に</b> — just the two lines",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_nu",
                      "isLetter": true,
                      "letter": "ヌ",
                      "word": "ヌ",
                      "emoji": "🔤",
                      "phonetic": "/nɯ/",
                      "translation": "<b>ヌ</b> — same sound as hiragana <b>ぬ</b> <i>(nu)</i><br>Like a 'I' with a loop on the left",
                      "mnemonic": "A <span class='hl'>noodle</span> slurped up — ヌ is the hiragana ぬ without the bottom curve.",
                      "examples": [
                          {
                              "t": "<b>ヌ</b> is rare — appears in <b>ヌードル</b> <i>(noodle)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ヌ</b> vs <b>ぬ</b> — simpler shape",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ne",
                      "isLetter": true,
                      "letter": "ネ",
                      "word": "ネ",
                      "emoji": "🔤",
                      "phonetic": "/ne/",
                      "translation": "<b>ネ</b> — same sound as hiragana <b>ね</b> <i>(ne)</i><br>Like a 'I' with a loop on the right",
                      "mnemonic": "A <span class='hl'>nest</span> with a branch — ネ is the hiragana ね without the bottom curve.",
                      "examples": [
                          {
                              "t": "<b>ネ</b> appears in <b>ネクタイ</b> <i>(necktie)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ネ</b> vs <b>ね</b> — simpler shape",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_no",
                      "isLetter": true,
                      "letter": "ノ",
                      "word": "ノ",
                      "emoji": "🔤",
                      "phonetic": "/no/",
                      "translation": "<b>ノ</b> — same sound as hiragana <b>の</b> <i>(no)</i><br>A single diagonal stroke",
                      "mnemonic": "A <span class='hl'>note</span> on a music stand — ノ is the hiragana の without the circle.",
                      "examples": [
                          {
                              "t": "<b>ノ</b> appears in <b>ノート</b> <i>(notebook)</i>",
                              "n": "Loanword example"
                          },
                          {
                              "t": "Compare: <b>ノ</b> vs <b>の</b> — just the stroke",
                              "n": "Shape difference"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_01",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コーヒー",
                      "emoji": "☕",
                      "phonetic": "/koːçiː/",
                      "translation": "<b>coffee</b> — from Dutch <i>koffie</i><br>Note the long vowel mark <b>ー</b> after コ and ヒ",
                      "translations": {
                          "ja": "コーヒー",
                          "en": "coffee"
                      },
                      "examples": [
                          {
                              "t": "<b>コーヒー</b>を飲みます。",
                              "n": "I drink coffee."
                          },
                          {
                              "t": "この<b>コーヒー</b>はおいしいです。",
                              "n": "This coffee is delicious."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_02",
                      "isLetter": false,
                      "letter": "テ",
                      "word": "テレビ",
                      "emoji": "📺",
                      "phonetic": "/teɾebi/",
                      "translation": "<b>TV</b> — short for <i>television</i><br>Uses <b>テ</b> and <b>ビ</b> (which you'll learn later)",
                      "translations": {
                          "ja": "テレビ",
                          "en": "TV"
                      },
                      "examples": [
                          {
                              "t": "<b>テレビ</b>を見ます。",
                              "n": "I watch TV."
                          },
                          {
                              "t": "<b>テレビ</b>はどこですか。",
                              "n": "Where is the TV?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_03",
                      "isLetter": false,
                      "letter": "ア",
                      "word": "アイスクリーム",
                      "emoji": "🍨",
                      "phonetic": "/aisɯkɯɾiːmɯ/",
                      "translation": "<b>ice cream</b> — from English <i>ice cream</i><br>Long word with two long vowel marks <b>ー</b>",
                      "translations": {
                          "ja": "アイスクリーム",
                          "en": "ice cream"
                      },
                      "examples": [
                          {
                              "t": "<b>アイスクリーム</b>が好きです。",
                              "n": "I like ice cream."
                          },
                          {
                              "t": "<b>アイスクリーム</b>を食べます。",
                              "n": "I eat ice cream."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_04",
                      "isLetter": false,
                      "letter": "タ",
                      "word": "タクシー",
                      "emoji": "🚕",
                      "phonetic": "/takɯɕiː/",
                      "translation": "<b>taxi</b> — from English <i>taxi</i><br>Long vowel mark <b>ー</b> at the end",
                      "translations": {
                          "ja": "タクシー",
                          "en": "taxi"
                      },
                      "examples": [
                          {
                              "t": "<b>タクシー</b>で行きます。",
                              "n": "I go by taxi."
                          },
                          {
                              "t": "<b>タクシー</b>を呼びます。",
                              "n": "I call a taxi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_05",
                      "isLetter": false,
                      "letter": "ニ",
                      "word": "ニュース",
                      "emoji": "📰",
                      "phonetic": "/ɲɯːsɯ/",
                      "translation": "<b>news</b> — from English <i>news</i><br>Uses <b>ニ</b> + small ュ (you'll learn this later)",
                      "translations": {
                          "ja": "ニュース",
                          "en": "news"
                      },
                      "examples": [
                          {
                              "t": "<b>ニュース</b>を見ます。",
                              "n": "I watch the news."
                          },
                          {
                              "t": "<b>ニュース</b>を聞きます。",
                              "n": "I listen to the news."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g4",
              "name": "Katakana — parte 2",
              "icon": "🔣",
              "color": "#ef4444",
              "description": "ハ行 マ行 ヤ行 ラ行 ワ行 + préstamos",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g4_L_ha",
                      "isLetter": true,
                      "letter": "ハ",
                      "word": "ハ",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "Katakana <b>ハ</b> sounds like <i>ha</i>. It looks like a <span class=\"hl\">hut</span> with a roof.",
                      "mnemonic": "A hut with a flat roof — remember 'ha' as in 'hut'.",
                      "examples": [
                          {
                              "t": "ハ is used in <b>ハ</b>ンバーガー (hamburger).",
                              "n": "ハ appears in loanwords like hamburger."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_hi",
                      "isLetter": true,
                      "letter": "ヒ",
                      "word": "ヒ",
                      "emoji": "🔤",
                      "phonetic": "/hi/",
                      "translation": "Katakana <b>ヒ</b> sounds like <i>hi</i>. It resembles a <span class=\"hl\">needle</span> or a <span class=\"hl\">pin</span>.",
                      "mnemonic": "A needle pointing right — say 'hee' as in 'heel'.",
                      "examples": [
                          {
                              "t": "ヒ is in <b>ヒ</b>ーター (heater).",
                              "n": "ヒ appears in heater."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_fu",
                      "isLetter": true,
                      "letter": "フ",
                      "word": "フ",
                      "emoji": "🔤",
                      "phonetic": "/ɸɯ/",
                      "translation": "Katakana <b>フ</b> sounds like <i>fu</i>. It looks like a <span class=\"hl\">flag</span> on a pole.",
                      "mnemonic": "A flag waving — 'fu' as in 'foo'.",
                      "examples": [
                          {
                              "t": "フ is in <b>フ</b>ルーツ (fruits).",
                              "n": "フ appears in fruits."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_he",
                      "isLetter": true,
                      "letter": "ヘ",
                      "word": "ヘ",
                      "emoji": "🔤",
                      "phonetic": "/he/",
                      "translation": "Katakana <b>ヘ</b> sounds like <i>he</i>. It looks like a <span class=\"hl\">mountain</span> or a <span class=\"hl\">hat</span>.",
                      "mnemonic": "A mountain peak — 'he' as in 'heaven'.",
                      "examples": [
                          {
                              "t": "ヘ is in <b>ヘ</b>リコプター (helicopter).",
                              "n": "ヘ appears in helicopter."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ho",
                      "isLetter": true,
                      "letter": "ホ",
                      "word": "ホ",
                      "emoji": "🔤",
                      "phonetic": "/ho/",
                      "translation": "Katakana <b>ホ</b> sounds like <i>ho</i>. It looks like a <span class=\"hl\">tree</span> with branches.",
                      "mnemonic": "A tree with branches — 'ho' as in 'home'.",
                      "examples": [
                          {
                              "t": "ホ is in <b>ホ</b>テル (hotel).",
                              "n": "ホ appears in hotel."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ma",
                      "isLetter": true,
                      "letter": "マ",
                      "word": "マ",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "Katakana <b>マ</b> sounds like <i>ma</i>. It resembles a <span class=\"hl\">mask</span> or a <span class=\"hl\">crossed sword</span>.",
                      "mnemonic": "A mask with straps — 'ma' as in 'mama'.",
                      "examples": [
                          {
                              "t": "マ is in <b>マ</b>ンゴ (mango).",
                              "n": "マ appears in mango."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mi",
                      "isLetter": true,
                      "letter": "ミ",
                      "word": "ミ",
                      "emoji": "🔤",
                      "phonetic": "/mi/",
                      "translation": "Katakana <b>ミ</b> sounds like <i>mi</i>. It looks like <span class=\"hl\">three wavy lines</span>.",
                      "mnemonic": "Three waves — 'mi' as in 'me'.",
                      "examples": [
                          {
                              "t": "ミ is in <b>ミ</b>ルク (milk).",
                              "n": "ミ appears in milk."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mu",
                      "isLetter": true,
                      "letter": "ム",
                      "word": "ム",
                      "emoji": "🔤",
                      "phonetic": "/mɯ/",
                      "translation": "Katakana <b>ム</b> sounds like <i>mu</i>. It looks like a <span class=\"hl\">cow's face</span> or a <span class=\"hl\">hook</span>.",
                      "mnemonic": "A cow's face with horns — 'moo'.",
                      "examples": [
                          {
                              "t": "ム is in <b>ム</b>ード (mood).",
                              "n": "ム appears in mood."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_me",
                      "isLetter": true,
                      "letter": "メ",
                      "word": "メ",
                      "emoji": "🔤",
                      "phonetic": "/me/",
                      "translation": "Katakana <b>メ</b> sounds like <i>me</i>. It looks like a <span class=\"hl\">cross</span> or an <span class=\"hl\">X</span>.",
                      "mnemonic": "An X marks the spot — 'me' as in 'met'.",
                      "examples": [
                          {
                              "t": "メ is in <b>メ</b>ニュー (menu).",
                              "n": "メ appears in menu."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mo",
                      "isLetter": true,
                      "letter": "モ",
                      "word": "モ",
                      "emoji": "🔤",
                      "phonetic": "/mo/",
                      "translation": "Katakana <b>モ</b> sounds like <i>mo</i>. It looks like a <span class=\"hl\">fishing rod</span> with a line.",
                      "mnemonic": "A fishing rod with a line — 'mo' as in 'more'.",
                      "examples": [
                          {
                              "t": "モ is in <b>モ</b>ーター (motor).",
                              "n": "モ appears in motor."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ya",
                      "isLetter": true,
                      "letter": "ヤ",
                      "word": "ヤ",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Katakana <b>ヤ</b> sounds like <i>ya</i>. It looks like a <span class=\"hl\">yak</span> with horns.",
                      "mnemonic": "A yak's head — 'ya' as in 'yacht'.",
                      "examples": [
                          {
                              "t": "ヤ is in <b>ヤ</b>ード (yard).",
                              "n": "ヤ appears in yard."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_yu",
                      "isLetter": true,
                      "letter": "ユ",
                      "word": "ユ",
                      "emoji": "🔤",
                      "phonetic": "/jɯ/",
                      "translation": "Katakana <b>ユ</b> sounds like <i>yu</i>. It looks like a <span class=\"hl\">fishhook</span> or a <span class=\"hl\">cup</span>.",
                      "mnemonic": "A cup with a handle — 'you'.",
                      "examples": [
                          {
                              "t": "ユ is in <b>ユ</b>ーロ (euro).",
                              "n": "ユ appears in euro."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_yo",
                      "isLetter": true,
                      "letter": "ヨ",
                      "word": "ヨ",
                      "emoji": "🔤",
                      "phonetic": "/jo/",
                      "translation": "Katakana <b>ヨ</b> sounds like <i>yo</i>. It looks like a <span class=\"hl\">yo-yo</span> or a <span class=\"hl\">stack of boxes</span>.",
                      "mnemonic": "A yo-yo on a string — 'yo' as in 'yoyo'.",
                      "examples": [
                          {
                              "t": "ヨ is in <b>ヨ</b>ガ (yoga).",
                              "n": "ヨ appears in yoga."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ra",
                      "isLetter": true,
                      "letter": "ラ",
                      "word": "ラ",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "Katakana <b>ラ</b> sounds like <i>ra</i>. It looks like a <span class=\"hl\">radar</span> dish.",
                      "mnemonic": "A radar dish — 'ra' as in 'radar'.",
                      "examples": [
                          {
                              "t": "ラ is in <b>ラ</b>ジオ (radio).",
                              "n": "ラ appears in radio."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ri",
                      "isLetter": true,
                      "letter": "リ",
                      "word": "リ",
                      "emoji": "🔤",
                      "phonetic": "/ɾi/",
                      "translation": "Katakana <b>リ</b> sounds like <i>ri</i>. It looks like <span class=\"hl\">two sticks</span> or a <span class=\"hl\">rail</span>.",
                      "mnemonic": "Two rails — 'ri' as in 'reef'.",
                      "examples": [
                          {
                              "t": "リ is in <b>リ</b>スト (list).",
                              "n": "リ appears in list."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ru",
                      "isLetter": true,
                      "letter": "ル",
                      "word": "ル",
                      "emoji": "🔤",
                      "phonetic": "/ɾɯ/",
                      "translation": "Katakana <b>ル</b> sounds like <i>ru</i>. It looks like a <span class=\"hl\">loop</span> or a <span class=\"hl\">noose</span>.",
                      "mnemonic": "A loop of rope — 'ru' as in 'ruler'.",
                      "examples": [
                          {
                              "t": "ル is in <b>ル</b>ール (rule).",
                              "n": "ル appears in rule."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_re",
                      "isLetter": true,
                      "letter": "レ",
                      "word": "レ",
                      "emoji": "🔤",
                      "phonetic": "/ɾe/",
                      "translation": "Katakana <b>レ</b> sounds like <i>re</i>. It looks like a <span class=\"hl\">right angle</span> or a <span class=\"hl\">flag</span>.",
                      "mnemonic": "A right angle — 're' as in 'red'.",
                      "examples": [
                          {
                              "t": "レ is in <b>レ</b>モン (lemon).",
                              "n": "レ appears in lemon."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ro",
                      "isLetter": true,
                      "letter": "ロ",
                      "word": "ロ",
                      "emoji": "🔤",
                      "phonetic": "/ɾo/",
                      "translation": "Katakana <b>ロ</b> sounds like <i>ro</i>. It looks like a <span class=\"hl\">road</span> or a <span class=\"hl\">box</span>.",
                      "mnemonic": "A box on the road — 'ro' as in 'road'.",
                      "examples": [
                          {
                              "t": "ロ is in <b>ロ</b>ボット (robot).",
                              "n": "ロ appears in robot."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wa",
                      "isLetter": true,
                      "letter": "ワ",
                      "word": "ワ",
                      "emoji": "🔤",
                      "phonetic": "/wa/",
                      "translation": "Katakana <b>ワ</b> sounds like <i>wa</i>. It looks like a <span class=\"hl\">wave</span> or a <span class=\"hl\">boat</span>.",
                      "mnemonic": "A wave — 'wa' as in 'water'.",
                      "examples": [
                          {
                              "t": "ワ is in <b>ワ</b>イン (wine).",
                              "n": "ワ appears in wine."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wo",
                      "isLetter": true,
                      "letter": "ヲ",
                      "word": "ヲ",
                      "emoji": "🔤",
                      "phonetic": "/wo/",
                      "translation": "Katakana <b>ヲ</b> sounds like <i>wo</i> (rarely used). It looks like a <span class=\"hl\">wrench</span>.",
                      "mnemonic": "A wrench — 'wo' as in 'work'.",
                      "examples": [
                          {
                              "t": "ヲ is rarely used in modern Japanese.",
                              "n": "It appears in some particles or old texts."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_n",
                      "isLetter": true,
                      "letter": "ン",
                      "word": "ン",
                      "emoji": "🔤",
                      "phonetic": "/ɴ/",
                      "translation": "Katakana <b>ン</b> sounds like <i>n</i>. It looks like a <span class=\"hl\">wave</span> or a <span class=\"hl\">slide</span>.",
                      "mnemonic": "A slide — 'n' as in 'end'.",
                      "examples": [
                          {
                              "t": "ン is in パン (pan).",
                              "n": "ン appears in pan (bread)."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_long_vowel",
                      "isLetter": true,
                      "letter": "ー",
                      "word": "ー",
                      "emoji": "🔤",
                      "phonetic": "/ː/",
                      "translation": "Katakana <b>ー</b> is a long vowel mark that extends the previous vowel sound.",
                      "mnemonic": "A dash — it stretches the sound.",
                      "examples": [
                          {
                              "t": "コーヒー (kōhī) = coffee.",
                              "n": "The ー shows a long 'o' and 'i'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_01",
                      "isLetter": false,
                      "letter": "ホ",
                      "word": "ホテル",
                      "emoji": "🏨",
                      "phonetic": "/hoteɾɯ/",
                      "translation": "hotel",
                      "translations": {
                          "ja": "ホテル",
                          "en": "hotel"
                      },
                      "examples": [
                          {
                              "t": "ホテルはどこですか？",
                              "n": "Where is the hotel?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_02",
                      "isLetter": false,
                      "letter": "レ",
                      "word": "レストラン",
                      "emoji": "🍽️",
                      "phonetic": "/ɾesɯtoɾaɴ/",
                      "translation": "restaurant",
                      "translations": {
                          "ja": "レストラン",
                          "en": "restaurant"
                      },
                      "examples": [
                          {
                              "t": "レストランで食べます。",
                              "n": "I eat at a restaurant."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_03",
                      "isLetter": false,
                      "letter": "パ",
                      "word": "パスポート",
                      "emoji": "🛂",
                      "phonetic": "/pasɯpoːto/",
                      "translation": "passport",
                      "translations": {
                          "ja": "パスポート",
                          "en": "passport"
                      },
                      "examples": [
                          {
                              "t": "パスポートを見せてください。",
                              "n": "Please show me your passport."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_04",
                      "isLetter": false,
                      "letter": "ス",
                      "word": "スマートフォン",
                      "emoji": "📱",
                      "phonetic": "/sɯmaːtoɸoɴ/",
                      "translation": "smartphone",
                      "translations": {
                          "ja": "スマートフォン",
                          "en": "smartphone"
                      },
                      "examples": [
                          {
                              "t": "スマートフォンが欲しいです。",
                              "n": "I want a smartphone."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_05",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コンピューター",
                      "emoji": "💻",
                      "phonetic": "/koɴpjuːtaː/",
                      "translation": "computer",
                      "translations": {
                          "ja": "コンピューター",
                          "en": "computer"
                      },
                      "examples": [
                          {
                              "t": "コンピューターで仕事をします。",
                              "n": "I work on a computer."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_06",
                      "isLetter": false,
                      "letter": "バ",
                      "word": "バス",
                      "emoji": "🚌",
                      "phonetic": "/basɯ/",
                      "translation": "bus",
                      "translations": {
                          "ja": "バス",
                          "en": "bus"
                      },
                      "examples": [
                          {
                              "t": "バスで行きます。",
                              "n": "I go by bus."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_07",
                      "isLetter": false,
                      "letter": "ビ",
                      "word": "ビール",
                      "emoji": "🍺",
                      "phonetic": "/biːɾɯ/",
                      "translation": "beer",
                      "translations": {
                          "ja": "ビール",
                          "en": "beer"
                      },
                      "examples": [
                          {
                              "t": "ビールを一杯ください。",
                              "n": "One beer, please."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_08",
                      "isLetter": false,
                      "letter": "チョ",
                      "word": "チョコレート",
                      "emoji": "🍫",
                      "phonetic": "/tɕokoɾeːto/",
                      "translation": "chocolate",
                      "translations": {
                          "ja": "チョコレート",
                          "en": "chocolate"
                      },
                      "examples": [
                          {
                              "t": "チョコレートが好きです。",
                              "n": "I like chocolate."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g5",
              "name": "Primeros Kanji",
              "icon": "漢",
              "color": "#8b5cf6",
              "description": "日 月 火 水 木 金 土 + números + personas",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3",
                  "ja_a0_g4"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g5_L_ichi",
                      "isLetter": true,
                      "letter": "一",
                      "word": "一",
                      "emoji": "1️⃣",
                      "phonetic": "/ichi/",
                      "translation": "One — <b>一</b> is the number 1. ON: <i>ichi</i>, KUN: <i>hito-tsu</i>",
                      "mnemonic": "One horizontal line = one. Simple as that.",
                      "examples": [
                          {
                              "t": "<b>一</b> is just one stroke, like the number 1 lying down.",
                              "n": "Shape = meaning"
                          },
                          {
                              "t": "一人 (hitori) = one person.<br>一月 (ichigatsu) = January.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ni",
                      "isLetter": true,
                      "letter": "二",
                      "word": "二",
                      "emoji": "2️⃣",
                      "phonetic": "/ni/",
                      "translation": "Two — <b>二</b> is the number 2. ON: <i>ni</i>, KUN: <i>futa-tsu</i>",
                      "mnemonic": "Two horizontal lines = two.",
                      "examples": [
                          {
                              "t": "<b>二</b> has 2 lines, just like the number 2.",
                              "n": "Shape = meaning"
                          },
                          {
                              "t": "二人 (futari) = two people.<br>二月 (nigatsu) = February.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_san",
                      "isLetter": true,
                      "letter": "三",
                      "word": "三",
                      "emoji": "3️⃣",
                      "phonetic": "/san/",
                      "translation": "Three — <b>三</b> is the number 3. ON: <i>san</i>, KUN: <i>mit-tsu</i>",
                      "mnemonic": "Three horizontal lines = three. Like a stack of pancakes.",
                      "examples": [
                          {
                              "t": "<b>三</b> has 3 lines — easy to count!",
                              "n": "Shape = meaning"
                          },
                          {
                              "t": "三人 (sannin) = three people.<br>三月 (sangatsu) = March.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shi",
                      "isLetter": true,
                      "letter": "四",
                      "word": "四",
                      "emoji": "4️⃣",
                      "phonetic": "/shi/ or /yon/",
                      "translation": "Four — <b>四</b> is the number 4. ON: <i>shi</i>, KUN: <i>yon</i>",
                      "mnemonic": "A square mouth (口) with legs inside — like a box with 4 corners.",
                      "examples": [
                          {
                              "t": "The <b>四</b> looks like a window with 4 panes.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "四人 (yonin) = four people.<br>四月 (shigatsu) = April.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_go",
                      "isLetter": true,
                      "letter": "五",
                      "word": "五",
                      "emoji": "5️⃣",
                      "phonetic": "/go/",
                      "translation": "Five — <b>五</b> is the number 5. ON: <i>go</i>, KUN: <i>itsu-tsu</i>",
                      "mnemonic": "A cross between two lines — like a 5 with a hat on top.",
                      "examples": [
                          {
                              "t": "<b>五</b> looks like a person stretching arms wide — 5 limbs?",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "五人 (gonin) = five people.<br>五月 (gogatsu) = May.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_roku",
                      "isLetter": true,
                      "letter": "六",
                      "word": "六",
                      "emoji": "6️⃣",
                      "phonetic": "/roku/",
                      "translation": "Six — <b>六</b> is the number 6. ON: <i>roku</i>, KUN: <i>mut-tsu</i>",
                      "mnemonic": "Two legs spread apart — like a person doing the splits (6 looks like legs).",
                      "examples": [
                          {
                              "t": "<b>六</b> looks like two legs — think of a 6 doing yoga.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "六人 (rokunin) = six people.<br>六月 (rokugatsu) = June.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shichi",
                      "isLetter": true,
                      "letter": "七",
                      "word": "七",
                      "emoji": "7️⃣",
                      "phonetic": "/shichi/ or /nana/",
                      "translation": "Seven — <b>七</b> is the number 7. ON: <i>shichi</i>, KUN: <i>nana-tsu</i>",
                      "mnemonic": "A bent line crossing another — like a 7 with a tail.",
                      "examples": [
                          {
                              "t": "<b>七</b> looks like a 7 that got bent out of shape.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "七人 (shichinin) = seven people.<br>七月 (shichigatsu) = July.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hachi",
                      "isLetter": true,
                      "letter": "八",
                      "word": "八",
                      "emoji": "8️⃣",
                      "phonetic": "/hachi/",
                      "translation": "Eight — <b>八</b> is the number 8. ON: <i>hachi</i>, KUN: <i>yat-tsu</i>",
                      "mnemonic": "Two strokes opening like a fan — like an 8 split in half.",
                      "examples": [
                          {
                              "t": "<b>八</b> looks like a person waving both arms — 8 arms?",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "八人 (hachinin) = eight people.<br>八月 (hachigatsu) = August.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kyuu",
                      "isLetter": true,
                      "letter": "九",
                      "word": "九",
                      "emoji": "9️⃣",
                      "phonetic": "/kyuu/ or /ku/",
                      "translation": "Nine — <b>九</b> is the number 9. ON: <i>kyuu</i>, KUN: <i>kokono-tsu</i>",
                      "mnemonic": "A curved line with a hook — like a 9 with a curly tail.",
                      "examples": [
                          {
                              "t": "<b>九</b> looks like a 9 that got a little hook at the end.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "九人 (kyuunin) = nine people.<br>九月 (kugatsu) = September.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_juu",
                      "isLetter": true,
                      "letter": "十",
                      "word": "十",
                      "emoji": "🔟",
                      "phonetic": "/juu/",
                      "translation": "Ten — <b>十</b> is the number 10. ON: <i>juu</i>, KUN: <i>too</i>",
                      "mnemonic": "A cross — like a plus sign. Ten is a cross between 1 and 0.",
                      "examples": [
                          {
                              "t": "<b>十</b> is a cross — think of 10 as a crossroads.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "十人 (juunin) = ten people.<br>十月 (juugatsu) = October.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hi",
                      "isLetter": true,
                      "letter": "日",
                      "word": "日",
                      "emoji": "☀️",
                      "phonetic": "/nichi/ or /hi/",
                      "translation": "Sun / Day — <b>日</b> means sun or day. ON: <i>nichi</i>, KUN: <i>hi</i>",
                      "mnemonic": "A rectangle with a line through it — the sun seen through a window.",
                      "examples": [
                          {
                              "t": "The <b>日</b> looks like a sun with a horizontal ray.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "日曜日 (nichiyoubi) = Sunday.<br>日本語 (nihongo) = Japanese language.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_gatsu",
                      "isLetter": true,
                      "letter": "月",
                      "word": "月",
                      "emoji": "🌙",
                      "phonetic": "/gatsu/ or /tsuki/",
                      "translation": "Moon / Month — <b>月</b> means moon or month. ON: <i>gatsu</i>, KUN: <i>tsuki</i>",
                      "mnemonic": "A crescent moon with two lines inside — like a moon with craters.",
                      "examples": [
                          {
                              "t": "<b>月</b> looks like a crescent moon with a face.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "月曜日 (getsuyoubi) = Monday.<br>一月 (ichigatsu) = January.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ka",
                      "isLetter": true,
                      "letter": "火",
                      "word": "火",
                      "emoji": "🔥",
                      "phonetic": "/ka/ or /hi/",
                      "translation": "Fire — <b>火</b> means fire. ON: <i>ka</i>, KUN: <i>hi</i>",
                      "mnemonic": "A person with arms up — like flames dancing. Two strokes on the sides are fire.",
                      "examples": [
                          {
                              "t": "<b>火</b> looks like a person with flames on both sides.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "火曜日 (kayoubi) = Tuesday.<br>花火 (hanabi) = fireworks.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_sui",
                      "isLetter": true,
                      "letter": "水",
                      "word": "水",
                      "emoji": "💧",
                      "phonetic": "/sui/ or /mizu/",
                      "translation": "Water — <b>水</b> means water. ON: <i>sui</i>, KUN: <i>mizu</i>",
                      "mnemonic": "A stream with splashes on both sides — like water flowing between rocks.",
                      "examples": [
                          {
                              "t": "<b>水</b> looks like a river with drops of water splashing.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "水曜日 (suiyoubi) = Wednesday.<br>水 (mizu) = water (drink).",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_moku",
                      "isLetter": true,
                      "letter": "木",
                      "word": "木",
                      "emoji": "🌳",
                      "phonetic": "/moku/ or /ki/",
                      "translation": "Tree / Wood — <b>木</b> means tree or wood. ON: <i>moku</i>, KUN: <i>ki</i>",
                      "mnemonic": "A tree: the vertical line is the trunk, the horizontal is a branch, the diagonals are roots.",
                      "examples": [
                          {
                              "t": "<b>木</b> is a simple drawing of a tree with branches.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "木曜日 (mokuyoubi) = Thursday.<br>木 (ki) = tree.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kin",
                      "isLetter": true,
                      "letter": "金",
                      "word": "金",
                      "emoji": "🥇",
                      "phonetic": "/kin/ or /kane/",
                      "translation": "Gold / Money — <b>金</b> means gold or money. ON: <i>kin</i>, KUN: <i>kane</i>",
                      "mnemonic": "A roof with two lines and a dot — like a treasure chest with gold inside.",
                      "examples": [
                          {
                              "t": "<b>金</b> looks like a house with a treasure inside — gold!",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "金曜日 (kinyoubi) = Friday.<br>お金 (okane) = money.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_do",
                      "isLetter": true,
                      "letter": "土",
                      "word": "土",
                      "emoji": "⛰️",
                      "phonetic": "/do/ or /tsuchi/",
                      "translation": "Earth / Soil — <b>土</b> means earth or soil. ON: <i>do</i>, KUN: <i>tsuchi</i>",
                      "mnemonic": "A cross on top of a line — like a plant growing out of the ground.",
                      "examples": [
                          {
                              "t": "<b>土</b> looks like a plant sprouting from the soil.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "土曜日 (doyoubi) = Saturday.<br>土地 (tochi) = land.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hito",
                      "isLetter": true,
                      "letter": "人",
                      "word": "人",
                      "emoji": "🚶",
                      "phonetic": "/jin/ or /hito/",
                      "translation": "Person — <b>人</b> means person. ON: <i>jin</i>, KUN: <i>hito</i>",
                      "mnemonic": "Two legs walking — like a person taking a step.",
                      "examples": [
                          {
                              "t": "<b>人</b> looks like a person walking with two legs.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "日本人 (nihonjin) = Japanese person.<br>一人 (hitori) = one person.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_yama",
                      "isLetter": true,
                      "letter": "山",
                      "word": "山",
                      "emoji": "⛰️",
                      "phonetic": "/san/ or /yama/",
                      "translation": "Mountain — <b>山</b> means mountain. ON: <i>san</i>, KUN: <i>yama</i>",
                      "mnemonic": "Three peaks — like a mountain range with a tall peak in the middle.",
                      "examples": [
                          {
                              "t": "<b>山</b> is a drawing of three mountain peaks.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "富士山 (fujisan) = Mount Fuji.<br>山 (yama) = mountain.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kawa",
                      "isLetter": true,
                      "letter": "川",
                      "word": "川",
                      "emoji": "🏞️",
                      "phonetic": "/sen/ or /kawa/",
                      "translation": "River — <b>川</b> means river. ON: <i>sen</i>, KUN: <i>kawa</i>",
                      "mnemonic": "Three vertical lines — like a river with streams flowing.",
                      "examples": [
                          {
                              "t": "<b>川</b> looks like three streams of water flowing down.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "川 (kawa) = river.<br>小川 (ogawa) = stream.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_dai",
                      "isLetter": true,
                      "letter": "大",
                      "word": "大",
                      "emoji": "🐘",
                      "phonetic": "/dai/ or /oo/",
                      "translation": "Big — <b>大</b> means big. ON: <i>dai</i>, KUN: <i>oo</i>",
                      "mnemonic": "A person with arms stretched wide — like saying 'this big!'",
                      "examples": [
                          {
                              "t": "<b>大</b> looks like a person spreading arms to show something big.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "大きい (ookii) = big.<br>大学 (daigaku) = university.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shou",
                      "isLetter": true,
                      "letter": "小",
                      "word": "小",
                      "emoji": "🐭",
                      "phonetic": "/shou/ or /ko/",
                      "translation": "Small — <b>小</b> means small. ON: <i>shou</i>, KUN: <i>ko</i>",
                      "mnemonic": "A person with arms down and legs together — like saying 'this small!'",
                      "examples": [
                          {
                              "t": "<b>小</b> looks like a person shrinking down to be small.",
                              "n": "Visual mnemonic"
                          },
                          {
                              "t": "小さい (chiisai) = small.<br>小川 (ogawa) = stream.",
                              "n": "Common compounds"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_01",
                      "isLetter": false,
                      "letter": "一",
                      "word": "一人",
                      "emoji": "🚶‍♂️",
                      "phonetic": "/hitori/",
                      "translation": "One person — <b>一人</b> (hitori)",
                      "translations": {
                          "ja": "一人",
                          "en": "One person"
                      },
                      "examples": [
                          {
                              "t": "<b>一人</b>で行きます。",
                              "n": "I'll go alone."
                          },
                          {
                              "t": "<b>一人</b>が好きです。",
                              "n": "I like being alone."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_02",
                      "isLetter": false,
                      "letter": "日",
                      "word": "日曜日",
                      "emoji": "📅",
                      "phonetic": "/nichiyoubi/",
                      "translation": "Sunday — <b>日曜日</b> (nichiyoubi)",
                      "translations": {
                          "ja": "日曜日",
                          "en": "Sunday"
                      },
                      "examples": [
                          {
                              "t": "<b>日曜日</b>に会いましょう。",
                              "n": "Let's meet on Sunday."
                          },
                          {
                              "t": "今日は<b>日曜日</b>です。",
                              "n": "Today is Sunday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_03",
                      "isLetter": false,
                      "letter": "月",
                      "word": "月曜日",
                      "emoji": "📅",
                      "phonetic": "/getsuyoubi/",
                      "translation": "Monday — <b>月曜日</b> (getsuyoubi)",
                      "translations": {
                          "ja": "月曜日",
                          "en": "Monday"
                      },
                      "examples": [
                          {
                              "t": "<b>月曜日</b>に働きます。",
                              "n": "I work on Monday."
                          },
                          {
                              "t": "明日は<b>月曜日</b>です。",
                              "n": "Tomorrow is Monday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_04",
                      "isLetter": false,
                      "letter": "火",
                      "word": "火曜日",
                      "emoji": "📅",
                      "phonetic": "/kayoubi/",
                      "translation": "Tuesday — <b>火曜日</b> (kayoubi)",
                      "translations": {
                          "ja": "火曜日",
                          "en": "Tuesday"
                      },
                      "examples": [
                          {
                              "t": "<b>火曜日</b>に学校へ行きます。",
                              "n": "I go to school on Tuesday."
                          },
                          {
                              "t": "今日は<b>火曜日</b>です。",
                              "n": "Today is Tuesday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_05",
                      "isLetter": false,
                      "letter": "水",
                      "word": "水曜日",
                      "emoji": "📅",
                      "phonetic": "/suiyoubi/",
                      "translation": "Wednesday — <b>水曜日</b> (suiyoubi)",
                      "translations": {
                          "ja": "水曜日",
                          "en": "Wednesday"
                      },
                      "examples": [
                          {
                              "t": "<b>水曜日</b>に日本語を勉強します。",
                              "n": "I study Japanese on Wednesday."
                          },
                          {
                              "t": "明日は<b>水曜日</b>です。",
                              "n": "Tomorrow is Wednesday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_06",
                      "isLetter": false,
                      "letter": "木",
                      "word": "木曜日",
                      "emoji": "📅",
                      "phonetic": "/mokuyoubi/",
                      "translation": "Thursday — <b>木曜日</b> (mokuyoubi)",
                      "translations": {
                          "ja": "木曜日",
                          "en": "Thursday"
                      },
                      "examples": [
                          {
                              "t": "<b>木曜日</b>に映画を見ます。",
                              "n": "I watch a movie on Thursday."
                          },
                          {
                              "t": "今日は<b>木曜日</b>です。",
                              "n": "Today is Thursday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_07",
                      "isLetter": false,
                      "letter": "金",
                      "word": "金曜日",
                      "emoji": "📅",
                      "phonetic": "/kinyoubi/",
                      "translation": "Friday — <b>金曜日</b> (kinyoubi)",
                      "translations": {
                          "ja": "金曜日",
                          "en": "Friday"
                      },
                      "examples": [
                          {
                              "t": "<b>金曜日</b>にパーティーがあります。",
                              "n": "There's a party on Friday."
                          },
                          {
                              "t": "明日は<b>金曜日</b>です。",
                              "n": "Tomorrow is Friday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_08",
                      "isLetter": false,
                      "letter": "土",
                      "word": "土曜日",
                      "emoji": "📅",
                      "phonetic": "/doyoubi/",
                      "translation": "Saturday — <b>土曜日</b> (doyoubi)",
                      "translations": {
                          "ja": "土曜日",
                          "en": "Saturday"
                      },
                      "examples": [
                          {
                              "t": "<b>土曜日</b>に遊びます。",
                              "n": "I hang out on Saturday."
                          },
                          {
                              "t": "今日は<b>土曜日</b>です。",
                              "n": "Today is Saturday."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_09",
                      "isLetter": false,
                      "letter": "人",
                      "word": "日本人",
                      "emoji": "🗾",
                      "phonetic": "/nihonjin/",
                      "translation": "Japanese person — <b>日本人</b> (nihonjin)",
                      "translations": {
                          "ja": "日本人",
                          "en": "Japanese person"
                      },
                      "examples": [
                          {
                              "t": "私は<b>日本人</b>です。",
                              "n": "I am Japanese."
                          },
                          {
                              "t": "あの人は<b>日本人</b>ですか。",
                              "n": "Is that person Japanese?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_10",
                      "isLetter": false,
                      "letter": "山",
                      "word": "富士山",
                      "emoji": "🗻",
                      "phonetic": "/fujisan/",
                      "translation": "Mount Fuji — <b>富士山</b> (fujisan)",
                      "translations": {
                          "ja": "富士山",
                          "en": "Mount Fuji"
                      },
                      "examples": [
                          {
                              "t": "<b>富士山</b>は高いです。",
                              "n": "Mount Fuji is tall."
                          },
                          {
                              "t": "<b>富士山</b>を見たいです。",
                              "n": "I want to see Mount Fuji."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_11",
                      "isLetter": false,
                      "letter": "大",
                      "word": "大学",
                      "emoji": "🎓",
                      "phonetic": "/daigaku/",
                      "translation": "University — <b>大学</b> (daigaku)",
                      "translations": {
                          "ja": "大学",
                          "en": "University"
                      },
                      "examples": [
                          {
                              "t": "私は<b>大学</b>に行きます。",
                              "n": "I go to university."
                          },
                          {
                              "t": "<b>大学</b>はどこですか。",
                              "n": "Where is the university?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_12",
                      "isLetter": false,
                      "letter": "小",
                      "word": "小さい",
                      "emoji": "🐜",
                      "phonetic": "/chiisai/",
                      "translation": "Small — <b>小さい</b> (chiisai)",
                      "translations": {
                          "ja": "小さい",
                          "en": "Small"
                      },
                      "examples": [
                          {
                              "t": "これは<b>小さい</b>です。",
                              "n": "This is small."
                          },
                          {
                              "t": "<b>小さい</b>犬が好きです。",
                              "n": "I like small dogs."
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // JAPONÉS
  // ──────────────────────────────────────────────────────
  ja: {
      "level": "A0",
      "levelName": "Hiragana y Katakana",
      "groups": [
          {
              "id": "ja_a0_g1",
              "name": "Hiragana — parte 1",
              "icon": "🔤",
              "color": "#6366f1",
              "description": "あ行 か行 さ行 た行 な行 — primeras 25 sílabas",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ja_a0_g1_L_a-row",
                      "isLetter": true,
                      "letter": "あいうえお",
                      "word": "あいうえお",
                      "emoji": "🔤",
                      "phonetic": "/a i ɯ e o/",
                      "translation": "Fila <b>あ</b> — las cinco vocales<br><i>a, i, u, e, o</i>",
                      "mnemonic": "あ es un 'a' con un brazo cruzado; い son dos 'i' que se saludan; う es una 'u' con sombrero; え es una 'e' con espada; お es una 'o' con cinturón.",
                      "examples": [
                          {
                              "t": "<b>あ</b> es la primera letra, como <i>a</i> en español.",
                              "n": "あ suena /a/."
                          },
                          {
                              "t": "<b>い</b> es como <i>i</i> en 'si'. <br><b>う</b> es como <i>u</i> en 'luna'.",
                              "n": "い y う son vocales."
                          },
                          {
                              "t": "<b>え</b> es como <i>e</i> en 'mesa'. <br><b>お</b> es como <i>o</i> en 'sol'.",
                              "n": "え y お completan las vocales."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ka-row",
                      "isLetter": true,
                      "letter": "かきくけこ",
                      "word": "かきくけこ",
                      "emoji": "🔤",
                      "phonetic": "/ka ki kɯ ke ko/",
                      "translation": "Fila <b>か</b> — sílabas con K<br><i>ka, ki, ku, ke, ko</i>",
                      "mnemonic": "か es una 'k' con una pierna; き es una 'k' con un cuchillo; く es un pico de pájaro; け es una 'k' con un palo; こ es dos líneas como un 'ko'.",
                      "examples": [
                          {
                              "t": "<b>か</b> como en <i>casa</i>. <br><b>き</b> como en <i>kilo</i>.",
                              "n": "Sonidos con K."
                          },
                          {
                              "t": "<b>く</b> es como una sonrisa al revés. <br><b>け</b> es como una 'K' mayúscula.",
                              "n": "く y け."
                          },
                          {
                              "t": "<b>こ</b> son dos líneas horizontales, como un 'ko' acostado.",
                              "n": "こ es la última."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_sa-row",
                      "isLetter": true,
                      "letter": "さしすせそ",
                      "word": "さしすせそ",
                      "emoji": "🔤",
                      "phonetic": "/sa ɕi sɯ se so/",
                      "translation": "Fila <b>さ</b> — sílabas con S<br><i>sa, shi, su, se, so</i>",
                      "mnemonic": "さ es una 's' con un lazo; し es una 'i' con un gancho; す es una 'u' con un hilo; せ es una 's' con una línea; そ es una 'z' con un rizo.",
                      "examples": [
                          {
                              "t": "<b>さ</b> como en <i>salsa</i>. <br><b>し</b> se pronuncia <i>shi</i>, como 'sh' en inglés.",
                              "n": "し es irregular."
                          },
                          {
                              "t": "<b>す</b> es como <i>su</i> en 'suave'. <br><b>せ</b> es como <i>se</i> en 'seda'.",
                              "n": "す y せ."
                          },
                          {
                              "t": "<b>そ</b> es como una 'z' con un rizo al final.",
                              "n": "そ es la última."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ta-row",
                      "isLetter": true,
                      "letter": "たちつてと",
                      "word": "たちつてと",
                      "emoji": "🔤",
                      "phonetic": "/ta tɕi tsɯ te to/",
                      "translation": "Fila <b>た</b> — sílabas con T<br><i>ta, chi, tsu, te, to</i>",
                      "mnemonic": "た es una 't' con un lazo; ち es una '5' con un sombrero; つ es una 'u' con una cola; て es una 't' con una curva; と es una 't' con un gancho.",
                      "examples": [
                          {
                              "t": "<b>た</b> como en <i>taza</i>. <br><b>ち</b> se pronuncia <i>chi</i>, como 'ch' en 'chico'.",
                              "n": "ち es irregular."
                          },
                          {
                              "t": "<b>つ</b> se pronuncia <i>tsu</i>, como 'ts' en 'tsunami'.",
                              "n": "つ es irregular."
                          },
                          {
                              "t": "<b>て</b> es como <i>te</i> en 'tela'. <br><b>と</b> es como <i>to</i> en 'toro'.",
                              "n": "て y と son regulares."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_na-row",
                      "isLetter": true,
                      "letter": "なにぬねの",
                      "word": "なにぬねの",
                      "emoji": "🔤",
                      "phonetic": "/na ɲi nɯ ne no/",
                      "translation": "Fila <b>な</b> — sílabas con N<br><i>na, ni, nu, ne, no</i>",
                      "mnemonic": "な es una 'n' con un lazo; に es una 'n' con una línea; ぬ es una 'nu' con un lazo; ね es una 'ne' con un gancho; の es un círculo como 'no'.",
                      "examples": [
                          {
                              "t": "<b>な</b> como en <i>nada</i>. <br><b>に</b> como en 'niño'.",
                              "n": "な y に."
                          },
                          {
                              "t": "<b>ぬ</b> es como <i>nu</i> en 'nube'. <br><b>ね</b> es como <i>ne</i> en 'nene'.",
                              "n": "ぬ y ね."
                          },
                          {
                              "t": "<b>の</b> es un círculo con un pequeño hueco, como una 'o' con un rizo.",
                              "n": "の es muy común."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_01",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "あさ",
                      "emoji": "🌅",
                      "phonetic": "/asa/",
                      "translation": "<b>mañana</b> (la parte del día)",
                      "translations": {
                          "ja": "あさ",
                          "es": "mañana",
                          "en": "morning"
                      },
                      "examples": [
                          {
                              "t": "<b>あさ</b>に おきます。",
                              "n": "Me levanto por la mañana."
                          },
                          {
                              "t": "あさ は しずか です。",
                              "n": "La mañana es tranquila."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_02",
                      "isLetter": false,
                      "letter": "き",
                      "word": "きく",
                      "emoji": "👂",
                      "phonetic": "/kikɯ/",
                      "translation": "<b>escuchar</b> / <i>oír</i>",
                      "translations": {
                          "ja": "きく",
                          "es": "escuchar",
                          "en": "to listen"
                      },
                      "examples": [
                          {
                              "t": "おんがく を <b>きく</b>。",
                              "n": "Escucho música."
                          },
                          {
                              "t": "はなし を <b>きいて</b> ください。",
                              "n": "Por favor, escuche la historia."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_03",
                      "isLetter": false,
                      "letter": "す",
                      "word": "すし",
                      "emoji": "🍣",
                      "phonetic": "/sɯɕi/",
                      "translation": "<b>sushi</b> (comida japonesa)",
                      "translations": {
                          "ja": "すし",
                          "es": "sushi",
                          "en": "sushi"
                      },
                      "examples": [
                          {
                              "t": "<b>すし</b> が すき です。",
                              "n": "Me gusta el sushi."
                          },
                          {
                              "t": "きょう は <b>すし</b> を たべます。",
                              "n": "Hoy como sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_04",
                      "isLetter": false,
                      "letter": "た",
                      "word": "たべる",
                      "emoji": "🍽️",
                      "phonetic": "/taberɯ/",
                      "translation": "<b>comer</b>",
                      "translations": {
                          "ja": "たべる",
                          "es": "comer",
                          "en": "to eat"
                      },
                      "examples": [
                          {
                              "t": "りんご を <b>たべる</b>。",
                              "n": "Como una manzana."
                          },
                          {
                              "t": "ごはん を <b>たべて</b> います。",
                              "n": "Estoy comiendo arroz."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_05",
                      "isLetter": false,
                      "letter": "ね",
                      "word": "ねる",
                      "emoji": "😴",
                      "phonetic": "/nerɯ/",
                      "translation": "<b>dormir</b> / <i>acostarse</i>",
                      "translations": {
                          "ja": "ねる",
                          "es": "dormir",
                          "en": "to sleep"
                      },
                      "examples": [
                          {
                              "t": "よる に <b>ねる</b>。",
                              "n": "Duermo por la noche."
                          },
                          {
                              "t": "こども は もう <b>ねました</b>。",
                              "n": "El niño ya se durmió."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g2",
              "name": "Hiragana — parte 2",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "は行 ま行 や行 ら行 わ行 ん + dakuten",
              "reviewFrom": [
                  "ja_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g2_L_ha",
                      "isLetter": true,
                      "letter": "は",
                      "word": "は",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "Letra <b>は</b> — suena /ha/<br><i>Como «ja» en español, pero más suave</i>",
                      "mnemonic": "Parece una «H» con un sombrero — la H de «hola».",
                      "examples": [
                          {
                              "t": "<b>は</b> — «ha»<br>はな → <span class=\"hl\">flor</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "こんにち<b>は</b> — «konnichiwa»",
                              "n": "Saludo que ya conoces"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_hi",
                      "isLetter": true,
                      "letter": "ひ",
                      "word": "ひ",
                      "emoji": "🔤",
                      "phonetic": "/hi/",
                      "translation": "Letra <b>ひ</b> — suena /hi/<br><i>Como una sonrisa abierta</i>",
                      "mnemonic": "Parece una sonrisa con un diente — «hi» de risa.",
                      "examples": [
                          {
                              "t": "<b>ひ</b> — «hi»<br>ひこうき → <span class=\"hl\">avión</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ひ — sonríe y di «hi»",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_fu",
                      "isLetter": true,
                      "letter": "ふ",
                      "word": "ふ",
                      "emoji": "🔤",
                      "phonetic": "/ɸɯ/",
                      "translation": "Letra <b>ふ</b> — suena /ɸu/<br><i>Entre «fu» y «ju», soplando suave</i>",
                      "mnemonic": "Parece una ola pequeña — sopla como el viento.",
                      "examples": [
                          {
                              "t": "<b>ふ</b> — «fu»<br>ふじさん → <span class=\"hl\">monte Fuji</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ふ — sopla como el viento",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_he",
                      "isLetter": true,
                      "letter": "へ",
                      "word": "へ",
                      "emoji": "🔤",
                      "phonetic": "/he/",
                      "translation": "Letra <b>へ</b> — suena /he/<br><i>Como una flecha que apunta</i>",
                      "mnemonic": "Es una flecha — «he» de «hacia» (dirección).",
                      "examples": [
                          {
                              "t": "<b>へ</b> — «he»<br>へや → <span class=\"hl\">habitación</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "へ — flecha que indica dirección",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ho",
                      "isLetter": true,
                      "letter": "ほ",
                      "word": "ほ",
                      "emoji": "🔤",
                      "phonetic": "/ho/",
                      "translation": "Letra <b>ほ</b> — suena /ho/<br><i>Como «ho» pero con más cuerpo</i>",
                      "mnemonic": "Es una «H» con un sombrero doble — «ho» de «hola» con sombrero.",
                      "examples": [
                          {
                              "t": "<b>ほ</b> — «ho»<br>ほし → <span class=\"hl\">estrella</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ほ — la H con sombrero doble",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ma",
                      "isLetter": true,
                      "letter": "ま",
                      "word": "ま",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "Letra <b>ま</b> — suena /ma/<br><i>Como «ma» en español</i>",
                      "mnemonic": "Parece una «M» con un lazo — «ma» de mamá.",
                      "examples": [
                          {
                              "t": "<b>ま</b> — «ma»<br>まど → <span class=\"hl\">ventana</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ま — la M con lazo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mi",
                      "isLetter": true,
                      "letter": "み",
                      "word": "み",
                      "emoji": "🔤",
                      "phonetic": "/mi/",
                      "translation": "Letra <b>み</b> — suena /mi/<br><i>Como «mi» en español</i>",
                      "mnemonic": "Parece un «2» con un lazo — «mi» de «mi» (posesivo).",
                      "examples": [
                          {
                              "t": "<b>み</b> — «mi»<br>みず → <span class=\"hl\">agua</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "み — el 2 con lazo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mu",
                      "isLetter": true,
                      "letter": "む",
                      "word": "む",
                      "emoji": "🔤",
                      "phonetic": "/mɯ/",
                      "translation": "Letra <b>む</b> — suena /mu/<br><i>Como «mu» pero con labios redondeados</i>",
                      "mnemonic": "Parece una vaca con cuernos — «mu» como el sonido de la vaca.",
                      "examples": [
                          {
                              "t": "<b>む</b> — «mu»<br>むずかしい → <span class=\"hl\">difícil</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "む — la vaca dice «mu»",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_me",
                      "isLetter": true,
                      "letter": "め",
                      "word": "め",
                      "emoji": "🔤",
                      "phonetic": "/me/",
                      "translation": "Letra <b>め</b> — suena /me/<br><i>Como «me» en español</i>",
                      "mnemonic": "Parece un ojo con pestañas — «me» de «me» (pronombre).",
                      "examples": [
                          {
                              "t": "<b>め</b> — «me»<br>め → <span class=\"hl\">ojo</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "め — el ojo con pestañas",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mo",
                      "isLetter": true,
                      "letter": "も",
                      "word": "も",
                      "emoji": "🔤",
                      "phonetic": "/mo/",
                      "translation": "Letra <b>も</b> — suena /mo/<br><i>Como «mo» en español</i>",
                      "mnemonic": "Parece una «M» con un palo — «mo» de «moto».",
                      "examples": [
                          {
                              "t": "<b>も</b> — «mo»<br>もも → <span class=\"hl\">melocotón</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "も — la M con palo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ya",
                      "isLetter": true,
                      "letter": "や",
                      "word": "や",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Letra <b>や</b> — suena /ya/<br><i>Como «ya» en español</i>",
                      "mnemonic": "Parece una «Y» con un brazo — «ya» de «ya» (ya).",
                      "examples": [
                          {
                              "t": "<b>や</b> — «ya»<br>やま → <span class=\"hl\">montaña</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "や — la Y con brazo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_yu",
                      "isLetter": true,
                      "letter": "ゆ",
                      "word": "ゆ",
                      "emoji": "🔤",
                      "phonetic": "/jɯ/",
                      "translation": "Letra <b>ゆ</b> — suena /yu/<br><i>Como «yu» pero con labios redondeados</i>",
                      "mnemonic": "Parece un anzuelo — «yu» de «yudo» (judo).",
                      "examples": [
                          {
                              "t": "<b>ゆ</b> — «yu»<br>ゆき → <span class=\"hl\">nieve</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ゆ — el anzuelo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_yo",
                      "isLetter": true,
                      "letter": "よ",
                      "word": "よ",
                      "emoji": "🔤",
                      "phonetic": "/jo/",
                      "translation": "Letra <b>よ</b> — suena /yo/<br><i>Como «yo» en español</i>",
                      "mnemonic": "Parece una «Y» con un palo — «yo» de «yo» (pronombre).",
                      "examples": [
                          {
                              "t": "<b>よ</b> — «yo»<br>よる → <span class=\"hl\">noche</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "よ — la Y con palo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ra",
                      "isLetter": true,
                      "letter": "ら",
                      "word": "ら",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "Letra <b>ら</b> — suena /ra/<br><i>Entre «r» y «l», como una «r» suave</i>",
                      "mnemonic": "Parece una «R» con una pierna — «ra» de «rápido».",
                      "examples": [
                          {
                              "t": "<b>ら</b> — «ra»<br>らくだ → <span class=\"hl\">camello</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ら — la R con pierna",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ri",
                      "isLetter": true,
                      "letter": "り",
                      "word": "り",
                      "emoji": "🔤",
                      "phonetic": "/ɾi/",
                      "translation": "Letra <b>り</b> — suena /ri/<br><i>Entre «r» y «l», como «ri» suave</i>",
                      "mnemonic": "Parece dos cuchillos — «ri» de «risa».",
                      "examples": [
                          {
                              "t": "<b>り</b> — «ri»<br>りんご → <span class=\"hl\">manzana</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "り — los dos cuchillos",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ru",
                      "isLetter": true,
                      "letter": "る",
                      "word": "る",
                      "emoji": "🔤",
                      "phonetic": "/ɾɯ/",
                      "translation": "Letra <b>る</b> — suena /ru/<br><i>Entre «r» y «l», como «ru» suave</i>",
                      "mnemonic": "Parece un «3» con un lazo — «ru» de «rudo».",
                      "examples": [
                          {
                              "t": "<b>る</b> — «ru»<br>るす → <span class=\"hl\">ausente</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "る — el 3 con lazo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_re",
                      "isLetter": true,
                      "letter": "れ",
                      "word": "れ",
                      "emoji": "🔤",
                      "phonetic": "/ɾe/",
                      "translation": "Letra <b>れ</b> — suena /re/<br><i>Entre «r» y «l», como «re» suave</i>",
                      "mnemonic": "Parece una «Z» con un lazo — «re» de «rey».",
                      "examples": [
                          {
                              "t": "<b>れ</b> — «re»<br>れきし → <span class=\"hl\">historia</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "れ — la Z con lazo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ro",
                      "isLetter": true,
                      "letter": "ろ",
                      "word": "ろ",
                      "emoji": "🔤",
                      "phonetic": "/ɾo/",
                      "translation": "Letra <b>ろ</b> — suena /ro/<br><i>Entre «r» y «l», como «ro» suave</i>",
                      "mnemonic": "Parece una «R» sin pierna — «ro» de «rojo».",
                      "examples": [
                          {
                              "t": "<b>ろ</b> — «ro»<br>ろく → <span class=\"hl\">seis</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ろ — la R sin pierna",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wa",
                      "isLetter": true,
                      "letter": "わ",
                      "word": "わ",
                      "emoji": "🔤",
                      "phonetic": "/ɰa/",
                      "translation": "Letra <b>わ</b> — suena /wa/<br><i>Como «ua» en español</i>",
                      "mnemonic": "Parece una «W» con un lazo — «wa» de «waffle».",
                      "examples": [
                          {
                              "t": "<b>わ</b> — «wa»<br>わたし → <span class=\"hl\">yo</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "わ — la W con lazo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wo",
                      "isLetter": true,
                      "letter": "を",
                      "word": "を",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Letra <b>を</b> — suena /o/<br><i>Solo se usa como partícula, se pronuncia «o»</i>",
                      "mnemonic": "Parece una «W» con un palo — «wo» pero suena «o».",
                      "examples": [
                          {
                              "t": "<b>を</b> — partícula<br>ごはん<b>を</b>たべる",
                              "n": "Comer arroz"
                          },
                          {
                              "t": "を — suena igual que お",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_n",
                      "isLetter": true,
                      "letter": "ん",
                      "word": "ん",
                      "emoji": "🔤",
                      "phonetic": "/ɴ/",
                      "translation": "Letra <b>ん</b> — suena /n/<br><i>La única consonante sola</i>",
                      "mnemonic": "Parece una «n» con un palo — «n» de «no».",
                      "examples": [
                          {
                              "t": "<b>ん</b> — «n»<br>にほん → <span class=\"hl\">Japón</span>",
                              "n": "Ejemplo de uso"
                          },
                          {
                              "t": "ん — la n con palo",
                              "n": "Recordatorio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_dakuten",
                      "isLetter": true,
                      "letter": "゛",
                      "word": "゛",
                      "emoji": "🔤",
                      "phonetic": "/◌゙/",
                      "translation": "Dakuten <b>゛</b> — marca de voz<br><i>Convierte k→g, s→z, t→d, h→b</i>",
                      "mnemonic": "Dos comillas que «suavizan» el sonido — como una voz más fuerte.",
                      "examples": [
                          {
                              "t": "か → <b>が</b> (ga)<br>さ → <b>ざ</b> (za)",
                              "n": "Ejemplos"
                          },
                          {
                              "t": "た → <b>だ</b> (da)<br>は → <b>ば</b> (ba)",
                              "n": "Ejemplos"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_handakuten",
                      "isLetter": true,
                      "letter": "゜",
                      "word": "゜",
                      "emoji": "🔤",
                      "phonetic": "/◌゚/",
                      "translation": "Handakuten <b>゜</b> — marca de soplo<br><i>Convierte h→p</i>",
                      "mnemonic": "Un circulito que «sopla» — convierte la H en P.",
                      "examples": [
                          {
                              "t": "は → <b>ぱ</b> (pa)<br>ひ → <b>ぴ</b> (pi)",
                              "n": "Ejemplos"
                          },
                          {
                              "t": "ふ → <b>ぷ</b> (pu)<br>へ → <b>ぺ</b> (pe)",
                              "n": "Ejemplos"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_01",
                      "isLetter": false,
                      "letter": "は",
                      "word": "はな",
                      "emoji": "🌸",
                      "phonetic": "/hana/",
                      "translation": "<b>はな</b> — flor",
                      "translations": {
                          "ja": "はな",
                          "es": "flor",
                          "en": "flower"
                      },
                      "examples": [
                          {
                              "t": "<b>はな</b>がきれいです",
                              "n": "La flor es bonita"
                          },
                          {
                              "t": "これは<b>はな</b>です",
                              "n": "Esto es una flor"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_02",
                      "isLetter": false,
                      "letter": "み",
                      "word": "みず",
                      "emoji": "💧",
                      "phonetic": "/mizɯ/",
                      "translation": "<b>みず</b> — agua",
                      "translations": {
                          "ja": "みず",
                          "es": "agua",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "<b>みず</b>をください",
                              "n": "Dame agua, por favor"
                          },
                          {
                              "t": "<b>みず</b>はきれいです",
                              "n": "El agua es limpia"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_03",
                      "isLetter": false,
                      "letter": "や",
                      "word": "やま",
                      "emoji": "⛰️",
                      "phonetic": "/jama/",
                      "translation": "<b>やま</b> — montaña",
                      "translations": {
                          "ja": "やま",
                          "es": "montaña",
                          "en": "mountain"
                      },
                      "examples": [
                          {
                              "t": "<b>やま</b>がたかいです",
                              "n": "La montaña es alta"
                          },
                          {
                              "t": "ふじさんは<b>やま</b>です",
                              "n": "El monte Fuji es una montaña"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_04",
                      "isLetter": false,
                      "letter": "ら",
                      "word": "られる",
                      "emoji": "💪",
                      "phonetic": "/raɾeɾɯ/",
                      "translation": "<b>られる</b> — poder hacer (forma potencial)",
                      "translations": {
                          "ja": "られる",
                          "es": "poder hacer",
                          "en": "can do"
                      },
                      "examples": [
                          {
                              "t": "にほんごが<b>はなせる</b>",
                              "n": "Puedo hablar japonés"
                          },
                          {
                              "t": "これが<b>たべられる</b>",
                              "n": "Esto se puede comer"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_05",
                      "isLetter": false,
                      "letter": "わ",
                      "word": "わたし",
                      "emoji": "🙋",
                      "phonetic": "/ɰataɕi/",
                      "translation": "<b>わたし</b> — yo",
                      "translations": {
                          "ja": "わたし",
                          "es": "yo",
                          "en": "I / me"
                      },
                      "examples": [
                          {
                              "t": "<b>わたし</b>はがくせいです",
                              "n": "Yo soy estudiante"
                          },
                          {
                              "t": "<b>わたし</b>のなまえはゆきです",
                              "n": "Mi nombre es Yuki"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_06",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "ありがとう",
                      "emoji": "🙏",
                      "phonetic": "/aɾiɡatoː/",
                      "translation": "<b>ありがとう</b> — gracias",
                      "translations": {
                          "ja": "ありがとう",
                          "es": "gracias",
                          "en": "thank you"
                      },
                      "examples": [
                          {
                              "t": "<b>ありがとう</b>ございます",
                              "n": "Muchas gracias (formal)"
                          },
                          {
                              "t": "<b>ありがとう</b>！",
                              "n": "¡Gracias!"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_07",
                      "isLetter": false,
                      "letter": "ん",
                      "word": "にほん",
                      "emoji": "🇯🇵",
                      "phonetic": "/ɲihoɴ/",
                      "translation": "<b>にほん</b> — Japón",
                      "translations": {
                          "ja": "にほん",
                          "es": "Japón",
                          "en": "Japan"
                      },
                      "examples": [
                          {
                              "t": "<b>にほん</b>がすきです",
                              "n": "Me gusta Japón"
                          },
                          {
                              "t": "<b>にほん</b>ごをべんきょうします",
                              "n": "Estudio japonés"
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g3",
              "name": "Katakana — parte 1",
              "icon": "🔠",
              "color": "#10b981",
              "description": "ア行 カ行 サ行 タ行 ナ行 — comparando con hiragana",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g3_L_a",
                      "isLetter": true,
                      "letter": "ア",
                      "word": "ア",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "Se lee <b>a</b> como en <i>casa</i>.<br>Es igual a あ pero sin el lazo.",
                      "mnemonic": "El trazo de la izquierda es como un brazo que se cruza — あ sin su lazo.",
                      "examples": [
                          {
                              "t": "<b>ア</b> es la primera letra de <span class=\"hl\">アメリカ</span> (América).",
                              "n": "ア aparece en palabras extranjeras como América."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_i",
                      "isLetter": true,
                      "letter": "イ",
                      "word": "イ",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "Se lee <b>i</b> como en <i>si</i>.<br>Es い sin la curva de la derecha.",
                      "mnemonic": "Parece un <span class=\"hl\">i</span> latino sin el punto — dos trazos rectos.",
                      "examples": [
                          {
                              "t": "<b>イ</b> forma parte de <span class=\"hl\">イタリア</span> (Italia).",
                              "n": "イ se usa en nombres extranjeros."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_u",
                      "isLetter": true,
                      "letter": "ウ",
                      "word": "ウ",
                      "emoji": "🔤",
                      "phonetic": "/u/",
                      "translation": "Se lee <b>u</b> como en <i>luna</i>.<br>Es う con un techo encima.",
                      "mnemonic": "El trazo superior es como un <span class=\"hl\">techo</span> que cubre a う.",
                      "examples": [
                          {
                              "t": "<b>ウ</b> aparece en <span class=\"hl\">ウサギ</span> (conejo) aunque en katakana se usa para extranjerismos.",
                              "n": "ウ suena igual que う."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_e",
                      "isLetter": true,
                      "letter": "エ",
                      "word": "エ",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "Se lee <b>e</b> como en <i>elefante</i>.<br>Es え sin la curva final.",
                      "mnemonic": "Parece una <span class=\"hl\">escalera</span> con tres peldaños — え sin su cola.",
                      "examples": [
                          {
                              "t": "<b>エ</b> está en <span class=\"hl\">エネルギー</span> (energía).",
                              "n": "エ se usa en préstamos del inglés."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_o",
                      "isLetter": true,
                      "letter": "オ",
                      "word": "オ",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Se lee <b>o</b> como en <i>oso</i>.<br>Es お sin el lazo central.",
                      "mnemonic": "El trazo vertical cruza como una <span class=\"hl\">espada</span> — お sin su círculo.",
                      "examples": [
                          {
                              "t": "<b>オ</b> está en <span class=\"hl\">オレンジ</span> (naranja).",
                              "n": "オ se usa en palabras de origen extranjero."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ka",
                      "isLetter": true,
                      "letter": "カ",
                      "word": "カ",
                      "emoji": "🔤",
                      "phonetic": "/ka/",
                      "translation": "Se lee <b>ka</b> como en <i>casa</i>.<br>Es か sin el punto.",
                      "mnemonic": "El trazo curvo es como una <span class=\"hl\">c</span> mayúscula — か sin su puntito.",
                      "examples": [
                          {
                              "t": "<b>カ</b> inicia <span class=\"hl\">カメラ</span> (cámara).",
                              "n": "カ es común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ki",
                      "isLetter": true,
                      "letter": "キ",
                      "word": "キ",
                      "emoji": "🔤",
                      "phonetic": "/ki/",
                      "translation": "Se lee <b>ki</b> como en <i>kilo</i>.<br>Es き sin la curva inferior.",
                      "mnemonic": "Parece una <span class=\"hl\">llave</span> (key) — ki en inglés.",
                      "examples": [
                          {
                              "t": "<b>キ</b> está en <span class=\"hl\">キロ</span> (kilo).",
                              "n": "キ se usa en unidades y préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ku",
                      "isLetter": true,
                      "letter": "ク",
                      "word": "ク",
                      "emoji": "🔤",
                      "phonetic": "/ku/",
                      "translation": "Se lee <b>ku</b> como en <i>cubo</i>.<br>Es く con un trazo extra.",
                      "mnemonic": "Es un <span class=\"hl\">pájaro</span> con una ala — く con una raya.",
                      "examples": [
                          {
                              "t": "<b>ク</b> aparece en <span class=\"hl\">クラス</span> (clase).",
                              "n": "ク es muy frecuente en katakana."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ke",
                      "isLetter": true,
                      "letter": "ケ",
                      "word": "ケ",
                      "emoji": "🔤",
                      "phonetic": "/ke/",
                      "translation": "Se lee <b>ke</b> como en <i>queso</i>.<br>Es け sin la curva de abajo.",
                      "mnemonic": "Parece una <span class=\"hl\">k</span> estilizada — け sin su lazo.",
                      "examples": [
                          {
                              "t": "<b>ケ</b> está en <span class=\"hl\">ケーキ</span> (pastel).",
                              "n": "ケ se usa en préstamos como cake."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ko",
                      "isLetter": true,
                      "letter": "コ",
                      "word": "コ",
                      "emoji": "🔤",
                      "phonetic": "/ko/",
                      "translation": "Se lee <b>ko</b> como en <i>coco</i>.<br>Es こ sin el trazo curvo superior.",
                      "mnemonic": "Es un <span class=\"hl\">rectángulo</span> abierto — こ más angular.",
                      "examples": [
                          {
                              "t": "<b>コ</b> está en <span class=\"hl\">コーヒー</span> (café).",
                              "n": "コ es clave en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_sa",
                      "isLetter": true,
                      "letter": "サ",
                      "word": "サ",
                      "emoji": "🔤",
                      "phonetic": "/sa/",
                      "translation": "Se lee <b>sa</b> como en <i>salsa</i>.<br>Es さ sin la curva final.",
                      "mnemonic": "Parece una <span class=\"hl\">s</span> con dos trazos — さ sin su cola.",
                      "examples": [
                          {
                              "t": "<b>サ</b> inicia <span class=\"hl\">サラダ</span> (ensalada).",
                              "n": "サ es común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_shi",
                      "isLetter": true,
                      "letter": "シ",
                      "word": "シ",
                      "emoji": "🔤",
                      "phonetic": "/ɕi/",
                      "translation": "Se lee <b>shi</b> como en <i>shampoo</i>.<br>Es し con dos rayitas.",
                      "mnemonic": "Los dos trazos son <span class=\"hl\">ojos</span> que miran — し con cejas.",
                      "examples": [
                          {
                              "t": "<b>シ</b> está en <span class=\"hl\">シャツ</span> (camisa).",
                              "n": "シ suena como 'shi' en inglés."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_su",
                      "isLetter": true,
                      "letter": "ス",
                      "word": "ス",
                      "emoji": "🔤",
                      "phonetic": "/sɯ/",
                      "translation": "Se lee <b>su</b> como en <i>sushi</i>.<br>Es す sin el lazo.",
                      "mnemonic": "Parece un <span class=\"hl\">gancho</span> — す sin su curva.",
                      "examples": [
                          {
                              "t": "<b>ス</b> está en <span class=\"hl\">スープ</span> (sopa).",
                              "n": "ス es muy común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_se",
                      "isLetter": true,
                      "letter": "セ",
                      "word": "セ",
                      "emoji": "🔤",
                      "phonetic": "/se/",
                      "translation": "Se lee <b>se</b> como en <i>seda</i>.<br>Es せ sin el lazo inferior.",
                      "mnemonic": "Parece una <span class=\"hl\">cruz</span> con un trazo — せ más simple.",
                      "examples": [
                          {
                              "t": "<b>セ</b> está en <span class=\"hl\">セーター</span> (suéter).",
                              "n": "セ se usa en prendas extranjeras."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_so",
                      "isLetter": true,
                      "letter": "ソ",
                      "word": "ソ",
                      "emoji": "🔤",
                      "phonetic": "/so/",
                      "translation": "Se lee <b>so</b> como en <i>sopa</i>.<br>Es そ sin el trazo curvo.",
                      "mnemonic": "Los dos trazos apuntan <span class=\"hl\">hacia abajo</span> — そ sin su lazo.",
                      "examples": [
                          {
                              "t": "<b>ソ</b> está en <span class=\"hl\">ソファ</span> (sofá).",
                              "n": "ソ se usa en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ta",
                      "isLetter": true,
                      "letter": "タ",
                      "word": "タ",
                      "emoji": "🔤",
                      "phonetic": "/ta/",
                      "translation": "Se lee <b>ta</b> como en <i>taza</i>.<br>Es た sin el lazo.",
                      "mnemonic": "Parece una <span class=\"hl\">t</span> con sombrero — た sin su curva.",
                      "examples": [
                          {
                              "t": "<b>タ</b> inicia <span class=\"hl\">タクシー</span> (taxi).",
                              "n": "タ es común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_chi",
                      "isLetter": true,
                      "letter": "チ",
                      "word": "チ",
                      "emoji": "🔤",
                      "phonetic": "/tɕi/",
                      "translation": "Se lee <b>chi</b> como en <i>chico</i>.<br>Es ち sin la curva inferior.",
                      "mnemonic": "Parece una <span class=\"hl\">herradura</span> — ち más angular.",
                      "examples": [
                          {
                              "t": "<b>チ</b> está en <span class=\"hl\">チーズ</span> (queso).",
                              "n": "チ suena como 'chi' en inglés."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_tsu",
                      "isLetter": true,
                      "letter": "ツ",
                      "word": "ツ",
                      "emoji": "🔤",
                      "phonetic": "/tsɯ/",
                      "translation": "Se lee <b>tsu</b> como en <i>tsunami</i>.<br>Es つ con dos rayitas.",
                      "mnemonic": "Los dos trazos apuntan <span class=\"hl\">hacia arriba</span> — つ con cejas.",
                      "examples": [
                          {
                              "t": "<b>ツ</b> está en <span class=\"hl\">ツアー</span> (tour).",
                              "n": "ツ es clave en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_te",
                      "isLetter": true,
                      "letter": "テ",
                      "word": "テ",
                      "emoji": "🔤",
                      "phonetic": "/te/",
                      "translation": "Se lee <b>te</b> como en <i>té</i>.<br>Es て con una raya encima.",
                      "mnemonic": "Es て con un <span class=\"hl\">sombrero</span> — un trazo horizontal.",
                      "examples": [
                          {
                              "t": "<b>テ</b> está en <span class=\"hl\">テレビ</span> (TV).",
                              "n": "テ es muy común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_to",
                      "isLetter": true,
                      "letter": "ト",
                      "word": "ト",
                      "emoji": "🔤",
                      "phonetic": "/to/",
                      "translation": "Se lee <b>to</b> como en <i>toro</i>.<br>Es と sin el lazo.",
                      "mnemonic": "Parece una <span class=\"hl\">flecha</span> — と sin su curva.",
                      "examples": [
                          {
                              "t": "<b>ト</b> está en <span class=\"hl\">トマト</span> (tomate).",
                              "n": "ト es común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_na",
                      "isLetter": true,
                      "letter": "ナ",
                      "word": "ナ",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "Se lee <b>na</b> como en <i>nada</i>.<br>Es な sin el lazo.",
                      "mnemonic": "Parece una <span class=\"hl\">n</span> mayúscula — な sin su curva.",
                      "examples": [
                          {
                              "t": "<b>ナ</b> inicia <span class=\"hl\">ナイフ</span> (cuchillo).",
                              "n": "ナ es común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ni",
                      "isLetter": true,
                      "letter": "ニ",
                      "word": "ニ",
                      "emoji": "🔤",
                      "phonetic": "/ɲi/",
                      "translation": "Se lee <b>ni</b> como en <i>niño</i>.<br>Es に sin los trazos extra.",
                      "mnemonic": "Son dos <span class=\"hl\">rayas</span> horizontales — に sin su lazo.",
                      "examples": [
                          {
                              "t": "<b>ニ</b> está en <span class=\"hl\">ニュース</span> (noticias).",
                              "n": "ニ se usa en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_nu",
                      "isLetter": true,
                      "letter": "ヌ",
                      "word": "ヌ",
                      "emoji": "🔤",
                      "phonetic": "/nɯ/",
                      "translation": "Se lee <b>nu</b> como en <i>nube</i>.<br>Es ぬ sin el lazo.",
                      "mnemonic": "Parece una <span class=\"hl\">n</span> con cola — ぬ sin su curva.",
                      "examples": [
                          {
                              "t": "<b>ヌ</b> es menos común pero aparece en <span class=\"hl\">ヌードル</span> (fideos).",
                              "n": "ヌ se usa en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ne",
                      "isLetter": true,
                      "letter": "ネ",
                      "word": "ネ",
                      "emoji": "🔤",
                      "phonetic": "/ne/",
                      "translation": "Se lee <b>ne</b> como en <i>nene</i>.<br>Es ね sin el lazo.",
                      "mnemonic": "Parece una <span class=\"hl\">n</span> con una raya — ね sin su curva.",
                      "examples": [
                          {
                              "t": "<b>ネ</b> está en <span class=\"hl\">ネクタイ</span> (corbata).",
                              "n": "ネ es común en préstamos."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_no",
                      "isLetter": true,
                      "letter": "ノ",
                      "word": "ノ",
                      "emoji": "🔤",
                      "phonetic": "/no/",
                      "translation": "Se lee <b>no</b> como en <i>noche</i>.<br>Es の sin el círculo.",
                      "mnemonic": "Es un solo <span class=\"hl\">trazo diagonal</span> — の sin su lazo.",
                      "examples": [
                          {
                              "t": "<b>ノ</b> está en <span class=\"hl\">ノート</span> (cuaderno).",
                              "n": "ノ es muy simple y común."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_01",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コーヒー",
                      "emoji": "☕",
                      "phonetic": "/koːçiː/",
                      "translation": "<b>Café</b> — préstamo del inglés <i>coffee</i>.<br>La raya <b>ー</b> alarga la vocal.",
                      "translations": {
                          "ja": "コーヒー",
                          "es": "café",
                          "en": "coffee"
                      },
                      "examples": [
                          {
                              "t": "<b>コーヒー</b>を飲みます。",
                              "n": "Bebo café."
                          },
                          {
                              "t": "この<b>コーヒー</b>は熱いです。",
                              "n": "Este café está caliente."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_02",
                      "isLetter": false,
                      "letter": "テ",
                      "word": "テレビ",
                      "emoji": "📺",
                      "phonetic": "/teɾebi/",
                      "translation": "<b>Televisión</b> — abreviación de <i>television</i>.<br>Usa テ y ビ.",
                      "translations": {
                          "ja": "テレビ",
                          "es": "televisión",
                          "en": "TV"
                      },
                      "examples": [
                          {
                              "t": "<b>テレビ</b>を見ます。",
                              "n": "Veo la televisión."
                          },
                          {
                              "t": "<b>テレビ</b>はどこですか。",
                              "n": "¿Dónde está la TV?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_03",
                      "isLetter": false,
                      "letter": "ア",
                      "word": "アイスクリーム",
                      "emoji": "🍦",
                      "phonetic": "/aisɯkɯɾiːmɯ/",
                      "translation": "<b>Helado</b> — préstamo del inglés <i>ice cream</i>.<br>Lleva dos ー para alargar.",
                      "translations": {
                          "ja": "アイスクリーム",
                          "es": "helado",
                          "en": "ice cream"
                      },
                      "examples": [
                          {
                              "t": "<b>アイスクリーム</b>を食べます。",
                              "n": "Como helado."
                          },
                          {
                              "t": "夏は<b>アイスクリーム</b>が好きです。",
                              "n": "En verano me gusta el helado."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_04",
                      "isLetter": false,
                      "letter": "タ",
                      "word": "タクシー",
                      "emoji": "🚕",
                      "phonetic": "/takɯɕiː/",
                      "translation": "<b>Taxi</b> — préstamo del inglés <i>taxi</i>.<br>La ー alarga la i final.",
                      "translations": {
                          "ja": "タクシー",
                          "es": "taxi",
                          "en": "taxi"
                      },
                      "examples": [
                          {
                              "t": "<b>タクシー</b>に乗ります。",
                              "n": "Me subo al taxi."
                          },
                          {
                              "t": "<b>タクシー</b>を呼びます。",
                              "n": "Llamo un taxi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_05",
                      "isLetter": false,
                      "letter": "ニ",
                      "word": "ニュース",
                      "emoji": "📰",
                      "phonetic": "/ɲɯːsɯ/",
                      "translation": "<b>Noticias</b> — préstamo del inglés <i>news</i>.<br>La ー alarga la u.",
                      "translations": {
                          "ja": "ニュース",
                          "es": "noticias",
                          "en": "news"
                      },
                      "examples": [
                          {
                              "t": "<b>ニュース</b>を見ます。",
                              "n": "Veo las noticias."
                          },
                          {
                              "t": "毎日<b>ニュース</b>を聞きます。",
                              "n": "Escucho las noticias todos los días."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g4",
              "name": "Katakana — parte 2",
              "icon": "🔣",
              "color": "#ef4444",
              "description": "ハ行 マ行 ヤ行 ラ行 ワ行 + préstamos",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g4_L_ha",
                      "isLetter": true,
                      "letter": "ハ",
                      "word": "ハ",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "<b>ハ</b> se lee <i>ha</i>, como en <span class=\"hl\">hacha</span>.<br>Parece una <i>casa</i> vista de frente con techo.",
                      "mnemonic": "El techo de una casa (ha) con dos columnas.",
                      "examples": [
                          {
                              "t": "<b>ハ</b> es la primera letra de <i>hachi</i> (abeja).",
                              "n": "La abeja hace 'ha-ha' al volar."
                          },
                          {
                              "t": "En <b>ハ</b> el trazo horizontal es el techo.",
                              "n": "Dos líneas verticales son las paredes."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ma",
                      "isLetter": true,
                      "letter": "マ",
                      "word": "マ",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "<b>マ</b> se lee <i>ma</i>, como en <span class=\"hl\">mamá</span>.<br>Parece un <i>tridente</i> o una <i>M</i> con las patas cruzadas.",
                      "mnemonic": "Una 'M' de mamá con las patas cruzadas.",
                      "examples": [
                          {
                              "t": "<b>マ</b> suena igual que la <i>m</i> de mamá.",
                              "n": "Visual: dos trazos que se cruzan abajo."
                          },
                          {
                              "t": "En <b>マ</b> el primer trazo es diagonal.",
                              "n": "El segundo trazo hace la cruz."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ya",
                      "isLetter": true,
                      "letter": "ヤ",
                      "word": "ヤ",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "<b>ヤ</b> se lee <i>ya</i>, como en <span class=\"hl\">yate</span>.<br>Parece una <i>Y</i> con un palito extra.",
                      "mnemonic": "La 'Y' de yate, con un palito que se cayó.",
                      "examples": [
                          {
                              "t": "<b>ヤ</b> es como una <i>Y</i> con un trazo extra.",
                              "n": "Se usa en palabras como yama (montaña)."
                          },
                          {
                              "t": "En <b>ヤ</b> el primer trazo es la diagonal izquierda.",
                              "n": "Los otros dos forman la derecha y el palito."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ra",
                      "isLetter": true,
                      "letter": "ラ",
                      "word": "ラ",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "<b>ラ</b> se lee <i>ra</i>, con una <i>r</i> suave.<br>Parece un <span class=\"hl\">ramo</span> de flores con su lazo.",
                      "mnemonic": "Un ramo de flores con un lazo abajo.",
                      "examples": [
                          {
                              "t": "<b>ラ</b> suena como la <i>r</i> de 'pero'.",
                              "n": "Visual: trazo horizontal y dos patas."
                          },
                          {
                              "t": "En <b>ラ</b> el primer trazo es largo y horizontal.",
                              "n": "Los otros dos son las patas del ramo."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wa",
                      "isLetter": true,
                      "letter": "ワ",
                      "word": "ワ",
                      "emoji": "🔤",
                      "phonetic": "/wa/",
                      "translation": "<b>ワ</b> se lee <i>wa</i>, como en <span class=\"hl\">waffle</span>.<br>Parece un <i>wok</i> visto desde arriba.",
                      "mnemonic": "Un wok redondo con su asa.",
                      "examples": [
                          {
                              "t": "<b>ワ</b> es como una <i>U</i> con un puntito.",
                              "n": "Se parece al kanji de 'paz'."
                          },
                          {
                              "t": "En <b>ワ</b> el trazo curvo es el wok.",
                              "n": "El puntito es el asa."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wo",
                      "isLetter": true,
                      "letter": "ヲ",
                      "word": "ヲ",
                      "emoji": "🔤",
                      "phonetic": "/o/ (moderno) o /wo/ (tradicional)",
                      "translation": "<b>ヲ</b> se lee <i>o</i> en japonés moderno, pero originalmente era <i>wo</i>.<br>Parece una <span class=\"hl\">W</span> con un palito.",
                      "mnemonic": "La 'W' de waffle con un palito de más.",
                      "examples": [
                          {
                              "t": "<b>ヲ</b> casi no se usa en palabras.",
                              "n": "Solo aparece como partícula."
                          },
                          {
                              "t": "En <b>ヲ</b> el primer trazo es horizontal.",
                              "n": "Luego viene la curva y el palito final."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_n",
                      "isLetter": true,
                      "letter": "ン",
                      "word": "ン",
                      "emoji": "🔤",
                      "phonetic": "/n/",
                      "translation": "<b>ン</b> se lee <i>n</i> final, como en <span class=\"hl\">pan</span>.<br>Parece una <i>n</i> al revés con un trazo curvo.",
                      "mnemonic": "Una 'n' que se cayó hacia la izquierda.",
                      "examples": [
                          {
                              "t": "<b>ン</b> siempre va después de una vocal.",
                              "n": "Ejemplo: pan (パン)."
                          },
                          {
                              "t": "En <b>ン</b> el trazo sube de izquierda a derecha.",
                              "n": "Es como una ola pequeña."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_chouon",
                      "isLetter": true,
                      "letter": "ー",
                      "word": "ー",
                      "emoji": "🔤",
                      "phonetic": "/ː/ (alarga la vocal anterior)",
                      "translation": "<b>ー</b> es el <i>signo de vocal larga</i>.<br>Alarga la vocal anterior, como en <span class=\"hl\">café</span>.",
                      "mnemonic": "Una línea que estira el sonido.",
                      "examples": [
                          {
                              "t": "En <b>ー</b> siempre va después de una vocal.",
                              "n": "Ejemplo: コーヒー (kōhī, café)."
                          },
                          {
                              "t": "<b>ー</b> se escribe horizontal en katakana.",
                              "n": "En hiragana no existe este signo."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_01",
                      "isLetter": false,
                      "letter": "ホ",
                      "word": "ホテル",
                      "emoji": "🏨",
                      "phonetic": "/hoteru/",
                      "translation": "<b>ホテル</b> — hotel.<br>Viene del inglés <i>hotel</i>.",
                      "translations": {
                          "ja": "ホテル",
                          "es": "hotel",
                          "en": "hotel"
                      },
                      "examples": [
                          {
                              "t": "ホテルはどこですか？",
                              "n": "¿Dónde está el hotel?"
                          },
                          {
                              "t": "このホテルは高いです。",
                              "n": "Este hotel es caro."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_02",
                      "isLetter": false,
                      "letter": "レ",
                      "word": "レストラン",
                      "emoji": "🍽️",
                      "phonetic": "/resutoran/",
                      "translation": "<b>レストラン</b> — restaurante.<br>Viene del inglés <i>restaurant</i>.",
                      "translations": {
                          "ja": "レストラン",
                          "es": "restaurante",
                          "en": "restaurant"
                      },
                      "examples": [
                          {
                              "t": "レストランで食べます。",
                              "n": "Como en el restaurante."
                          },
                          {
                              "t": "あのレストランは安いです。",
                              "n": "Ese restaurante es barato."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_03",
                      "isLetter": false,
                      "letter": "パ",
                      "word": "パスポート",
                      "emoji": "🛂",
                      "phonetic": "/pasupōto/",
                      "translation": "<b>パスポート</b> — pasaporte.<br>Viene del inglés <i>passport</i>.",
                      "translations": {
                          "ja": "パスポート",
                          "es": "pasaporte",
                          "en": "passport"
                      },
                      "examples": [
                          {
                              "t": "パスポートを見せてください。",
                              "n": "Muéstreme su pasaporte, por favor."
                          },
                          {
                              "t": "パスポートをなくしました。",
                              "n": "Perdí mi pasaporte."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_04",
                      "isLetter": false,
                      "letter": "ス",
                      "word": "スマートフォン",
                      "emoji": "📱",
                      "phonetic": "/sumātofon/",
                      "translation": "<b>スマートフォン</b> — teléfono inteligente.<br>Viene del inglés <i>smartphone</i>.",
                      "translations": {
                          "ja": "スマートフォン",
                          "es": "teléfono inteligente",
                          "en": "smartphone"
                      },
                      "examples": [
                          {
                              "t": "スマートフォンを持っています。",
                              "n": "Tengo un smartphone."
                          },
                          {
                              "t": "スマートフォンで写真を撮ります。",
                              "n": "Tomo fotos con el smartphone."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_05",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コンピューター",
                      "emoji": "💻",
                      "phonetic": "/konpyūtā/",
                      "translation": "<b>コンピューター</b> — computadora.<br>Viene del inglés <i>computer</i>.",
                      "translations": {
                          "ja": "コンピューター",
                          "es": "computadora",
                          "en": "computer"
                      },
                      "examples": [
                          {
                              "t": "コンピューターで仕事をします。",
                              "n": "Trabajo con la computadora."
                          },
                          {
                              "t": "新しいコンピューターが欲しいです。",
                              "n": "Quiero una computadora nueva."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_06",
                      "isLetter": false,
                      "letter": "バ",
                      "word": "バス",
                      "emoji": "🚌",
                      "phonetic": "/basu/",
                      "translation": "<b>バス</b> — autobús.<br>Viene del inglés <i>bus</i>.",
                      "translations": {
                          "ja": "バス",
                          "es": "autobús",
                          "en": "bus"
                      },
                      "examples": [
                          {
                              "t": "バスで学校に行きます。",
                              "n": "Voy a la escuela en autobús."
                          },
                          {
                              "t": "バスは何時に来ますか？",
                              "n": "¿A qué hora llega el autobús?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_07",
                      "isLetter": false,
                      "letter": "ビ",
                      "word": "ビール",
                      "emoji": "🍺",
                      "phonetic": "/bīru/",
                      "translation": "<b>ビール</b> — cerveza.<br>Viene del neerlandés <i>bier</i>.",
                      "translations": {
                          "ja": "ビール",
                          "es": "cerveza",
                          "en": "beer"
                      },
                      "examples": [
                          {
                              "t": "ビールを一杯ください。",
                              "n": "Una cerveza, por favor."
                          },
                          {
                              "t": "ビールは冷たいです。",
                              "n": "La cerveza está fría."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_08",
                      "isLetter": false,
                      "letter": "チ",
                      "word": "チョコレート",
                      "emoji": "🍫",
                      "phonetic": "/chokorēto/",
                      "translation": "<b>チョコレート</b> — chocolate.<br>Viene del inglés <i>chocolate</i>.",
                      "translations": {
                          "ja": "チョコレート",
                          "es": "chocolate",
                          "en": "chocolate"
                      },
                      "examples": [
                          {
                              "t": "チョコレートが好きです。",
                              "n": "Me gusta el chocolate."
                          },
                          {
                              "t": "チョコレートを食べます。",
                              "n": "Como chocolate."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g5",
              "name": "Primeros Kanji",
              "icon": "漢",
              "color": "#8b5cf6",
              "description": "日 月 火 水 木 金 土 + números + personas",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3",
                  "ja_a0_g4"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g5_L_ichi",
                      "isLetter": true,
                      "letter": "一",
                      "word": "一",
                      "emoji": "1️⃣",
                      "phonetic": "/ichi/",
                      "translation": "Uno — <b>一</b> es un trazo horizontal, como un dedo extendido.",
                      "mnemonic": "Un solo trazo horizontal = el número uno, simple y directo.",
                      "examples": [
                          {
                              "t": "<b>一</b>つ (hitotsu) = una cosa",
                              "n": "Con el sufijo contador -tsu para objetos."
                          },
                          {
                              "t": "<b>一</b>人 (hitori) = una persona",
                              "n": "Lectura kun especial para 'una persona'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ni",
                      "isLetter": true,
                      "letter": "二",
                      "word": "二",
                      "emoji": "2️⃣",
                      "phonetic": "/ni/",
                      "translation": "Dos — <b>二</b> son dos trazos horizontales paralelos.",
                      "mnemonic": "Dos líneas horizontales = dos, como los dos rieles de un tren.",
                      "examples": [
                          {
                              "t": "<b>二</b>つ (futatsu) = dos cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>二</b>人 (futari) = dos personas",
                              "n": "Lectura kun especial."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_san",
                      "isLetter": true,
                      "letter": "三",
                      "word": "三",
                      "emoji": "3️⃣",
                      "phonetic": "/san/",
                      "translation": "Tres — <b>三</b> son tres trazos horizontales apilados.",
                      "mnemonic": "Tres líneas horizontales = tres, como una escalera de tres peldaños.",
                      "examples": [
                          {
                              "t": "<b>三</b>つ (mittsu) = tres cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>三</b>日 (mikka) = tres días",
                              "n": "Lectura especial para días del mes."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shi",
                      "isLetter": true,
                      "letter": "四",
                      "word": "四",
                      "emoji": "4️⃣",
                      "phonetic": "/shi/ o /yon/",
                      "translation": "Cuatro — <b>四</b> parece una ventana con dos cortinas.",
                      "mnemonic": "Una caja con dos líneas dentro = una ventana con marco. 'Shi' también significa 'muerte' (evítalo al contar).",
                      "examples": [
                          {
                              "t": "<b>四</b>つ (yottsu) = cuatro cosas",
                              "n": "Usa 'yon' para evitar la connotación de muerte."
                          },
                          {
                              "t": "<b>四</b>月 (shigatsu) = abril",
                              "n": "El cuarto mes del año."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_go",
                      "isLetter": true,
                      "letter": "五",
                      "word": "五",
                      "emoji": "5️⃣",
                      "phonetic": "/go/",
                      "translation": "Cinco — <b>五</b> parece una persona con los brazos abiertos.",
                      "mnemonic": "La línea superior es la cabeza, la inferior son los brazos extendidos: una persona abierta = cinco.",
                      "examples": [
                          {
                              "t": "<b>五</b>つ (itsutsu) = cinco cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>五</b>人 (gonin) = cinco personas",
                              "n": "Contador -nin para personas."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_roku",
                      "isLetter": true,
                      "letter": "六",
                      "word": "六",
                      "emoji": "6️⃣",
                      "phonetic": "/roku/",
                      "translation": "Seis — <b>六</b> parece una persona inclinada con los brazos hacia abajo.",
                      "mnemonic": "Un triángulo invertido = una persona que se agacha. Recuerda 'roku' como 'rock' (rock and roll, seis cuerdas de guitarra).",
                      "examples": [
                          {
                              "t": "<b>六</b>つ (muttsu) = seis cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>六</b>日 (muika) = seis días",
                              "n": "Lectura especial para días."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shichi",
                      "isLetter": true,
                      "letter": "七",
                      "word": "七",
                      "emoji": "7️⃣",
                      "phonetic": "/shichi/ o /nana/",
                      "translation": "Siete — <b>七</b> es una línea horizontal cortada por una vertical.",
                      "mnemonic": "Parece una 't' al revés. 'Nana' suena como 'nana' (abuela en español) — las abuelas tienen suerte (7).",
                      "examples": [
                          {
                              "t": "<b>七</b>つ (nanatsu) = siete cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>七</b>月 (shichigatsu) = julio",
                              "n": "El séptimo mes."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hachi",
                      "isLetter": true,
                      "letter": "八",
                      "word": "八",
                      "emoji": "8️⃣",
                      "phonetic": "/hachi/",
                      "translation": "Ocho — <b>八</b> son dos trazos que se abren como un abanico.",
                      "mnemonic": "Dos trazos que se separan = una montaña partida en dos. 'Hachi' suena como 'hacha' — un hacha parte en dos.",
                      "examples": [
                          {
                              "t": "<b>八</b>つ (yattsu) = ocho cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>八</b>日 (youka) = ocho días",
                              "n": "Lectura especial para días."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kyuu",
                      "isLetter": true,
                      "letter": "九",
                      "word": "九",
                      "emoji": "9️⃣",
                      "phonetic": "/kyuu/ o /ku/",
                      "translation": "Nueve — <b>九</b> parece una persona con una curva en el cuello.",
                      "mnemonic": "Parece un '9' con una curva extra. 'Kyuu' suena como 'cui' (¿quién? en latín) — nueve vidas tiene un gato, ¿quién?",
                      "examples": [
                          {
                              "t": "<b>九</b>つ (kokonotsu) = nueve cosas",
                              "n": "Contador -tsu."
                          },
                          {
                              "t": "<b>九</b>月 (kugatsu) = septiembre",
                              "n": "El noveno mes."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_juu",
                      "isLetter": true,
                      "letter": "十",
                      "word": "十",
                      "emoji": "🔟",
                      "phonetic": "/juu/",
                      "translation": "Diez — <b>十</b> es una cruz perfecta.",
                      "mnemonic": "Una cruz = diez. Como una cruz en un mapa marca el punto exacto: el diez es el centro perfecto.",
                      "examples": [
                          {
                              "t": "<b>十</b>人 (juunin) = diez personas",
                              "n": "Contador -nin."
                          },
                          {
                              "t": "<b>十</b>月 (juugatsu) = octubre",
                              "n": "El décimo mes."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_nichi",
                      "isLetter": true,
                      "letter": "日",
                      "word": "日",
                      "emoji": "☀️",
                      "phonetic": "/nichi/ /hi/ /bi/",
                      "translation": "Sol / Día — <b>日</b> es un sol con un rayo central.",
                      "mnemonic": "Un rectángulo con una línea en el medio = el sol visto a través de una ventana. Ese rayo central es la luz del sol.",
                      "examples": [
                          {
                              "t": "<b>日</b>本 (nihon) = Japón",
                              "n": "Literalmente 'origen del sol'."
                          },
                          {
                              "t": "<b>日</b>曜日 (nichiyoubi) = domingo",
                              "n": "El día del sol."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_gatsu",
                      "isLetter": true,
                      "letter": "月",
                      "word": "月",
                      "emoji": "🌙",
                      "phonetic": "/getsu/ /gatsu/ /tsuki/",
                      "translation": "Luna / Mes — <b>月</b> es una luna creciente con una línea interior.",
                      "mnemonic": "El trazo exterior es la media luna, la línea interior es la sombra de la luna. Los meses se cuentan por lunas.",
                      "examples": [
                          {
                              "t": "<b>月</b>曜日 (getsuyoubi) = lunes",
                              "n": "El día de la luna."
                          },
                          {
                              "t": "一<b>月</b> (ichigatsu) = enero",
                              "n": "El primer mes."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ka",
                      "isLetter": true,
                      "letter": "火",
                      "word": "火",
                      "emoji": "🔥",
                      "phonetic": "/ka/ /hi/",
                      "translation": "Fuego — <b>火</b> parece una persona con los brazos en llamas.",
                      "mnemonic": "El trazo central es el cuerpo, los laterales son llamas que se elevan. Martes = día del fuego.",
                      "examples": [
                          {
                              "t": "<b>火</b>曜日 (kayoubi) = martes",
                              "n": "El día del fuego."
                          },
                          {
                              "t": "<b>火</b>山 (kazan) = volcán",
                              "n": "Montaña de fuego."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_sui",
                      "isLetter": true,
                      "letter": "水",
                      "word": "水",
                      "emoji": "💧",
                      "phonetic": "/sui/ /mizu/",
                      "translation": "Agua — <b>水</b> parece una cascada cayendo entre rocas.",
                      "mnemonic": "El trazo central es la corriente de agua, los laterales son salpicaduras. Miércoles = día del agua.",
                      "examples": [
                          {
                              "t": "<b>水</b>曜日 (suiyoubi) = miércoles",
                              "n": "El día del agua."
                          },
                          {
                              "t": "<b>水</b>道 (suidou) = tubería de agua",
                              "n": "Camino del agua."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_moku",
                      "isLetter": true,
                      "letter": "木",
                      "word": "木",
                      "emoji": "🌳",
                      "phonetic": "/moku/ /ki/",
                      "translation": "Árbol / Madera — <b>木</b> es un árbol con copa, tronco y raíces.",
                      "mnemonic": "La línea vertical es el tronco, la horizontal son las ramas, las diagonales son las raíces. Jueves = día del árbol.",
                      "examples": [
                          {
                              "t": "<b>木</b>曜日 (mokuyoubi) = jueves",
                              "n": "El día del árbol."
                          },
                          {
                              "t": "<b>木</b> (ki) = árbol",
                              "n": "Lectura kun."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kin",
                      "isLetter": true,
                      "letter": "金",
                      "word": "金",
                      "emoji": "🪙",
                      "phonetic": "/kin/ /kane/",
                      "translation": "Oro / Dinero — <b>金</b> parece una moneda con una tapa.",
                      "mnemonic": "La parte superior es el techo de un tesoro, lo de abajo son monedas apiladas. Viernes = día del oro.",
                      "examples": [
                          {
                              "t": "<b>金</b>曜日 (kinyoubi) = viernes",
                              "n": "El día del oro."
                          },
                          {
                              "t": "<b>金</b> (kane) = dinero",
                              "n": "Lectura kun, el oro es dinero."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_do",
                      "isLetter": true,
                      "letter": "土",
                      "word": "土",
                      "emoji": "⛰️",
                      "phonetic": "/do/ /tsuchi/",
                      "translation": "Tierra / Suelo — <b>土</b> es una planta brotando del suelo.",
                      "mnemonic": "La línea horizontal es el suelo, la vertical es la planta que brota, la línea corta es una raíz. Sábado = día de la tierra.",
                      "examples": [
                          {
                              "t": "<b>土</b>曜日 (doyoubi) = sábado",
                              "n": "El día de la tierra."
                          },
                          {
                              "t": "<b>土</b>地 (tochi) = terreno",
                              "n": "Tierra + lugar."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hito",
                      "isLetter": true,
                      "letter": "人",
                      "word": "人",
                      "emoji": "🚶",
                      "phonetic": "/jin/ /hito/",
                      "translation": "Persona — <b>人</b> es una persona caminando.",
                      "mnemonic": "Dos trazos que se cruzan = una persona caminando con las piernas abiertas. Simple y elegante.",
                      "examples": [
                          {
                              "t": "<b>人</b>間 (ningen) = ser humano",
                              "n": "Entre personas."
                          },
                          {
                              "t": "外国<b>人</b> (gaikokujin) = extranjero",
                              "n": "Persona de otro país."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_yama",
                      "isLetter": true,
                      "letter": "山",
                      "word": "山",
                      "emoji": "🏔️",
                      "phonetic": "/san/ /yama/",
                      "translation": "Montaña — <b>山</b> son tres picos montañosos.",
                      "mnemonic": "El pico central es el más alto, los laterales son más bajos. Como el Monte Fuji entre dos colinas.",
                      "examples": [
                          {
                              "t": "<b>山</b> (yama) = montaña",
                              "n": "Lectura kun."
                          },
                          {
                              "t": "富<b>士</b>山 (fujisan) = Monte Fuji",
                              "n": "Usa la lectura on 'san'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kawa",
                      "isLetter": true,
                      "letter": "川",
                      "word": "川",
                      "emoji": "🏞️",
                      "phonetic": "/sen/ /kawa/",
                      "translation": "Río — <b>川</b> son tres corrientes de agua.",
                      "mnemonic": "Tres líneas verticales = las corrientes de un río. La del medio es la corriente principal.",
                      "examples": [
                          {
                              "t": "<b>川</b> (kawa) = río",
                              "n": "Lectura kun."
                          },
                          {
                              "t": "日本<b>川</b> (nihonkawa) = río de Japón",
                              "n": "Ejemplo compuesto."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_dai",
                      "isLetter": true,
                      "letter": "大",
                      "word": "大",
                      "emoji": "🐘",
                      "phonetic": "/dai/ /oo/",
                      "translation": "Grande — <b>大</b> es una persona con los brazos extendidos.",
                      "mnemonic": "La línea horizontal son los brazos abiertos, las verticales son el cuerpo y las piernas. Una persona grande abierta = grande.",
                      "examples": [
                          {
                              "t": "<b>大</b>きい (ookii) = grande",
                              "n": "Adjetivo con lectura kun."
                          },
                          {
                              "t": "<b>大</b>学 (daigaku) = universidad",
                              "n": "Gran escuela."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shou",
                      "isLetter": true,
                      "letter": "小",
                      "word": "小",
                      "emoji": "🐜",
                      "phonetic": "/shou/ /ko/ /chiisai/",
                      "translation": "Pequeño — <b>小</b> parece una persona encogida con los brazos hacia abajo.",
                      "mnemonic": "Tres pequeños trazos que caen = gotas pequeñas. Contrasta con 大 (grande): uno abre los brazos, el otro los cierra.",
                      "examples": [
                          {
                              "t": "<b>小</b>さい (chiisai) = pequeño",
                              "n": "Adjetivo con lectura kun."
                          },
                          {
                              "t": "<b>小</b>学生 (shougakusei) = estudiante de primaria",
                              "n": "Pequeña escuela."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_01",
                      "isLetter": false,
                      "letter": "日",
                      "word": "日本",
                      "emoji": "🇯🇵",
                      "phonetic": "/nihon/",
                      "translation": "Japón — <b>日本</b> significa literalmente 'origen del sol'.",
                      "translations": {
                          "ja": "日本",
                          "es": "Japón",
                          "en": "Japan"
                      },
                      "examples": [
                          {
                              "t": "<b>日本</b>は美しいです。",
                              "n": "Japón es hermoso."
                          },
                          {
                              "t": "私は<b>日本</b>人です。",
                              "n": "Soy japonés (persona de Japón)."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_02",
                      "isLetter": false,
                      "letter": "人",
                      "word": "人",
                      "emoji": "👤",
                      "phonetic": "/hito/",
                      "translation": "Persona — <b>人</b> es el kanji básico para persona.",
                      "translations": {
                          "ja": "人",
                          "es": "persona",
                          "en": "person"
                      },
                      "examples": [
                          {
                              "t": "あの<b>人</b>は先生です。",
                              "n": "Esa persona es profesor."
                          },
                          {
                              "t": "<b>人</b>が多いです。",
                              "n": "Hay mucha gente (personas)."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_03",
                      "isLetter": false,
                      "letter": "山",
                      "word": "山",
                      "emoji": "⛰️",
                      "phonetic": "/yama/",
                      "translation": "Montaña — <b>山</b> se pronuncia 'yama' en lectura kun.",
                      "translations": {
                          "ja": "山",
                          "es": "montaña",
                          "en": "mountain"
                      },
                      "examples": [
                          {
                              "t": "富士<b>山</b>は高いです。",
                              "n": "El Monte Fuji es alto."
                          },
                          {
                              "t": "<b>山</b>に登ります。",
                              "n": "Subo a la montaña."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_04",
                      "isLetter": false,
                      "letter": "川",
                      "word": "川",
                      "emoji": "🏞️",
                      "phonetic": "/kawa/",
                      "translation": "Río — <b>川</b> se pronuncia 'kawa' en lectura kun.",
                      "translations": {
                          "ja": "川",
                          "es": "río",
                          "en": "river"
                      },
                      "examples": [
                          {
                              "t": "この<b>川</b>はきれいです。",
                              "n": "Este río es limpio/hermoso."
                          },
                          {
                              "t": "<b>川</b>で泳ぎます。",
                              "n": "Nado en el río."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_05",
                      "isLetter": false,
                      "letter": "大",
                      "word": "大きい",
                      "emoji": "🐘",
                      "phonetic": "/ookii/",
                      "translation": "Grande — <b>大</b>きい es el adjetivo 'grande'.",
                      "translations": {
                          "ja": "大きい",
                          "es": "grande",
                          "en": "big"
                      },
                      "examples": [
                          {
                              "t": "この犬は<b>大きい</b>です。",
                              "n": "Este perro es grande."
                          },
                          {
                              "t": "<b>大きい</b>家に住みたい。",
                              "n": "Quiero vivir en una casa grande."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_06",
                      "isLetter": false,
                      "letter": "小",
                      "word": "小さい",
                      "emoji": "🐜",
                      "phonetic": "/chiisai/",
                      "translation": "Pequeño — <b>小</b>さい es el adjetivo 'pequeño'.",
                      "translations": {
                          "ja": "小さい",
                          "es": "pequeño",
                          "en": "small"
                      },
                      "examples": [
                          {
                              "t": "この猫は<b>小さい</b>です。",
                              "n": "Este gato es pequeño."
                          },
                          {
                              "t": "<b>小さい</b>問題です。",
                              "n": "Es un problema pequeño."
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // JA_IT
  // ──────────────────────────────────────────────────────
  ja_it: {
      "level": "A0",
      "levelName": "Hiragana y Katakana",
      "groups": [
          {
              "id": "ja_a0_g1",
              "name": "Hiragana — parte 1",
              "icon": "🔤",
              "color": "#6366f1",
              "description": "あ行 か行 さ行 た行 な行 — primeras 25 sílabas",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ja_a0_g1_L_a-row",
                      "isLetter": true,
                      "letter": "あ",
                      "word": "あ",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "<b>あ</b> si legge <i>a</i>, come in 'casa'<br>La vocale 'a' italiana",
                      "mnemonic": "Sembra una 'a' stilizzata con un braccio che si allunga a destra.",
                      "examples": [
                          {
                              "t": "<b>あ</b> è la prima vocale: <i>a</i>",
                              "n": "あ è la vocale 'a'"
                          },
                          {
                              "t": "Si scrive in 3 tratti: prima la linea orizzontale, poi la verticale, poi la curva.",
                              "n": "Ordine dei tratti"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_i",
                      "isLetter": true,
                      "letter": "い",
                      "word": "い",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "<b>い</b> si legge <i>i</i>, come in 'vino'<br>La vocale 'i' italiana",
                      "mnemonic": "Due tratti paralleli: sembrano due amici che si salutano, 'i' come 'insieme'.",
                      "examples": [
                          {
                              "t": "<b>い</b> è la vocale <i>i</i>",
                              "n": "い è la vocale 'i'"
                          },
                          {
                              "t": "Si scrive in 2 tratti: prima quello sinistro, poi quello destro.",
                              "n": "Ordine dei tratti"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_u",
                      "isLetter": true,
                      "letter": "う",
                      "word": "う",
                      "emoji": "🔤",
                      "phonetic": "/ɯ/",
                      "translation": "<b>う</b> si legge <i>u</i>, ma con le labbra non arrotondate<br>Simile alla 'u' italiana ma più rilassata",
                      "mnemonic": "Sembra una 'u' coricata con un piede che si alza.",
                      "examples": [
                          {
                              "t": "<b>う</b> è la vocale <i>u</i>",
                              "n": "う è la vocale 'u'"
                          },
                          {
                              "t": "Si scrive in 2 tratti: prima la linea orizzontale, poi la curva.",
                              "n": "Ordine dei tratti"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_e",
                      "isLetter": true,
                      "letter": "え",
                      "word": "え",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "<b>え</b> si legge <i>e</i>, come in 'bene'<br>La vocale 'e' italiana",
                      "mnemonic": "Ricorda una 'e' scritta in corsivo con un cappello.",
                      "examples": [
                          {
                              "t": "<b>え</b> è la vocale <i>e</i>",
                              "n": "え è la vocale 'e'"
                          },
                          {
                              "t": "Si scrive in 2 tratti: prima la linea orizzontale, poi il resto.",
                              "n": "Ordine dei tratti"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_o",
                      "isLetter": true,
                      "letter": "お",
                      "word": "お",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "<b>お</b> si legge <i>o</i>, come in 'sole'<br>La vocale 'o' italiana",
                      "mnemonic": "Sembra una 'o' con un'ancora: pensa a 'o' come 'orizzonte'.",
                      "examples": [
                          {
                              "t": "<b>お</b> è la vocale <i>o</i>",
                              "n": "お è la vocale 'o'"
                          },
                          {
                              "t": "Si scrive in 3 tratti: prima la linea orizzontale, poi la verticale, poi la curva.",
                              "n": "Ordine dei tratti"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ka",
                      "isLetter": true,
                      "letter": "か",
                      "word": "か",
                      "emoji": "🔤",
                      "phonetic": "/ka/",
                      "translation": "<b>か</b> si legge <i>ka</i><br>La K di <i>casa</i> + la vocale A",
                      "mnemonic": "Sembra una 'K' con un braccio che si allunga a destra.",
                      "examples": [
                          {
                              "t": "<b>か</b> è la sillaba <i>ka</i>",
                              "n": "か è ka"
                          },
                          {
                              "t": "Parola: <b>かさ</b> (ombrella)",
                              "n": "かさ = ombrello"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ki",
                      "isLetter": true,
                      "letter": "き",
                      "word": "き",
                      "emoji": "🔤",
                      "phonetic": "/ki/",
                      "translation": "<b>き</b> si legge <i>ki</i><br>La K di <i>casa</i> + la vocale I",
                      "mnemonic": "Sembra una 'k' con un taglio in basso: ricorda 'ki' come 'kite' (aquilone) in inglese.",
                      "examples": [
                          {
                              "t": "<b>き</b> è la sillaba <i>ki</i>",
                              "n": "き è ki"
                          },
                          {
                              "t": "Parola: <b>きれい</b> (bello)",
                              "n": "きれい = bello, carino"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ku",
                      "isLetter": true,
                      "letter": "く",
                      "word": "く",
                      "emoji": "🔤",
                      "phonetic": "/kɯ/",
                      "translation": "<b>く</b> si legge <i>ku</i><br>La K di <i>casa</i> + la vocale U",
                      "mnemonic": "Sembra un becco di uccello aperto, come un 'V' rovesciata.",
                      "examples": [
                          {
                              "t": "<b>く</b> è la sillaba <i>ku</i>",
                              "n": "く è ku"
                          },
                          {
                              "t": "Parola: <b>くつ</b> (scarpa)",
                              "n": "くつ = scarpa"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ke",
                      "isLetter": true,
                      "letter": "け",
                      "word": "け",
                      "emoji": "🔤",
                      "phonetic": "/ke/",
                      "translation": "<b>け</b> si legge <i>ke</i><br>La K di <i>casa</i> + la vocale E",
                      "mnemonic": "Sembra una 'K' con una linea diagonale: ricorda 'ke' come 'kettle' (bollitore) in inglese.",
                      "examples": [
                          {
                              "t": "<b>け</b> è la sillaba <i>ke</i>",
                              "n": "け è ke"
                          },
                          {
                              "t": "Parola: <b>けさ</b> (stamattina)",
                              "n": "けさ = stamattina"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ko",
                      "isLetter": true,
                      "letter": "こ",
                      "word": "こ",
                      "emoji": "🔤",
                      "phonetic": "/ko/",
                      "translation": "<b>こ</b> si legge <i>ko</i><br>La K di <i>casa</i> + la vocale O",
                      "mnemonic": "Due linee orizzontali parallele: sembra un 'k' stilizzato.",
                      "examples": [
                          {
                              "t": "<b>こ</b> è la sillaba <i>ko</i>",
                              "n": "こ è ko"
                          },
                          {
                              "t": "Parola: <b>こえ</b> (voce)",
                              "n": "こえ = voce"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_sa",
                      "isLetter": true,
                      "letter": "さ",
                      "word": "さ",
                      "emoji": "🔤",
                      "phonetic": "/sa/",
                      "translation": "<b>さ</b> si legge <i>sa</i><br>La S di <i>sole</i> + la vocale A",
                      "mnemonic": "Sembra una 's' con un taglio: ricorda 'sa' come 'salsa'.",
                      "examples": [
                          {
                              "t": "<b>さ</b> è la sillaba <i>sa</i>",
                              "n": "さ è sa"
                          },
                          {
                              "t": "Parola: <b>さくら</b> (ciliegio)",
                              "n": "さくら = fiore di ciliegio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_shi",
                      "isLetter": true,
                      "letter": "し",
                      "word": "し",
                      "emoji": "🔤",
                      "phonetic": "/ɕi/",
                      "translation": "<b>し</b> si legge <i>shi</i><br>La SC di <i>scena</i> + la vocale I",
                      "mnemonic": "Sembra un amo da pesca: 'shi' come 'shhh' per fare silenzio.",
                      "examples": [
                          {
                              "t": "<b>し</b> è la sillaba <i>shi</i>",
                              "n": "し è shi"
                          },
                          {
                              "t": "Parola: <b>しお</b> (sale)",
                              "n": "しお = sale"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_su",
                      "isLetter": true,
                      "letter": "す",
                      "word": "す",
                      "emoji": "🔤",
                      "phonetic": "/sɯ/",
                      "translation": "<b>す</b> si legge <i>su</i><br>La S di <i>sole</i> + la vocale U",
                      "mnemonic": "Sembra una 's' con un cappio: ricorda 'su' come 'super'.",
                      "examples": [
                          {
                              "t": "<b>す</b> è la sillaba <i>su</i>",
                              "n": "す è su"
                          },
                          {
                              "t": "Parola: <b>すし</b> (sushi)",
                              "n": "すし = sushi"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_se",
                      "isLetter": true,
                      "letter": "せ",
                      "word": "せ",
                      "emoji": "🔤",
                      "phonetic": "/se/",
                      "translation": "<b>せ</b> si legge <i>se</i><br>La S di <i>sole</i> + la vocale E",
                      "mnemonic": "Sembra una 's' con una linea orizzontale: ricorda 'se' come 'sete'.",
                      "examples": [
                          {
                              "t": "<b>せ</b> è la sillaba <i>se</i>",
                              "n": "せ è se"
                          },
                          {
                              "t": "Parola: <b>せかい</b> (mondo)",
                              "n": "せかい = mondo"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_so",
                      "isLetter": true,
                      "letter": "そ",
                      "word": "そ",
                      "emoji": "🔤",
                      "phonetic": "/so/",
                      "translation": "<b>そ</b> si legge <i>so</i><br>La S di <i>sole</i> + la vocale O",
                      "mnemonic": "Sembra una 'z' con un tratto in alto: ricorda 'so' come 'solo'.",
                      "examples": [
                          {
                              "t": "<b>そ</b> è la sillaba <i>so</i>",
                              "n": "そ è so"
                          },
                          {
                              "t": "Parola: <b>そら</b> (cielo)",
                              "n": "そら = cielo"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ta",
                      "isLetter": true,
                      "letter": "た",
                      "word": "た",
                      "emoji": "🔤",
                      "phonetic": "/ta/",
                      "translation": "<b>た</b> si legge <i>ta</i><br>La T di <i>tavolo</i> + la vocale A",
                      "mnemonic": "Sembra una 't' con un braccio destro: ricorda 'ta' come 'tana'.",
                      "examples": [
                          {
                              "t": "<b>た</b> è la sillaba <i>ta</i>",
                              "n": "た è ta"
                          },
                          {
                              "t": "Parola: <b>たまご</b> (uovo)",
                              "n": "たまご = uovo"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_chi",
                      "isLetter": true,
                      "letter": "ち",
                      "word": "ち",
                      "emoji": "🔤",
                      "phonetic": "/tɕi/",
                      "translation": "<b>ち</b> si legge <i>chi</i> (come 'ci' in italiano)<br>La C di <i>ciao</i> + la vocale I",
                      "mnemonic": "Sembra una '5' rovesciata: ricorda 'chi' come 'ciao' (saluto).",
                      "examples": [
                          {
                              "t": "<b>ち</b> è la sillaba <i>chi</i>",
                              "n": "ち è chi"
                          },
                          {
                              "t": "Parola: <b>ちず</b> (mappa)",
                              "n": "ちず = mappa"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_tsu",
                      "isLetter": true,
                      "letter": "つ",
                      "word": "つ",
                      "emoji": "🔤",
                      "phonetic": "/tsɯ/",
                      "translation": "<b>つ</b> si legge <i>tsu</i> (come 'zucchero' senza la z)<br>La TS di <i>pizza</i> + la vocale U",
                      "mnemonic": "Sembra un'onda: ricorda 'tsu' come 'tsunami'.",
                      "examples": [
                          {
                              "t": "<b>つ</b> è la sillaba <i>tsu</i>",
                              "n": "つ è tsu"
                          },
                          {
                              "t": "Parola: <b>つき</b> (luna)",
                              "n": "つき = luna"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_te",
                      "isLetter": true,
                      "letter": "て",
                      "word": "て",
                      "emoji": "🔤",
                      "phonetic": "/te/",
                      "translation": "<b>て</b> si legge <i>te</i><br>La T di <i>tavolo</i> + la vocale E",
                      "mnemonic": "Sembra una 't' con un cappio: ricorda 'te' come 'tè' (bevanda).",
                      "examples": [
                          {
                              "t": "<b>て</b> è la sillaba <i>te</i>",
                              "n": "て è te"
                          },
                          {
                              "t": "Parola: <b>て</b> (mano)",
                              "n": "て = mano"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_to",
                      "isLetter": true,
                      "letter": "と",
                      "word": "と",
                      "emoji": "🔤",
                      "phonetic": "/to/",
                      "translation": "<b>と</b> si legge <i>to</i><br>La T di <i>tavolo</i> + la vocale O",
                      "mnemonic": "Sembra un 'L' con un gancio: ricorda 'to' come 'toro'.",
                      "examples": [
                          {
                              "t": "<b>と</b> è la sillaba <i>to</i>",
                              "n": "と è to"
                          },
                          {
                              "t": "Parola: <b>とけい</b> (orologio)",
                              "n": "とけい = orologio"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_na",
                      "isLetter": true,
                      "letter": "な",
                      "word": "な",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "<b>な</b> si legge <i>na</i><br>La N di <i>nave</i> + la vocale A",
                      "mnemonic": "Sembra una 'n' con un braccio: ricorda 'na' come 'nave'.",
                      "examples": [
                          {
                              "t": "<b>な</b> è la sillaba <i>na</i>",
                              "n": "な è na"
                          },
                          {
                              "t": "Parola: <b>なに</b> (cosa)",
                              "n": "なに = cosa"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ni",
                      "isLetter": true,
                      "letter": "に",
                      "word": "に",
                      "emoji": "🔤",
                      "phonetic": "/nʲi/",
                      "translation": "<b>に</b> si legge <i>ni</i><br>La N di <i>nave</i> + la vocale I",
                      "mnemonic": "Sembra una 'n' con una linea verticale: ricorda 'ni' come 'nice' (bello) in inglese.",
                      "examples": [
                          {
                              "t": "<b>に</b> è la sillaba <i>ni</i>",
                              "n": "に è ni"
                          },
                          {
                              "t": "Parola: <b>にわ</b> (giardino)",
                              "n": "にわ = giardino"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_nu",
                      "isLetter": true,
                      "letter": "ぬ",
                      "word": "ぬ",
                      "emoji": "🔤",
                      "phonetic": "/nɯ/",
                      "translation": "<b>ぬ</b> si legge <i>nu</i><br>La N di <i>nave</i> + la vocale U",
                      "mnemonic": "Sembra un nodo: 'nu' come 'nodo' (in giapponese 'nu' ricorda un nodo).",
                      "examples": [
                          {
                              "t": "<b>ぬ</b> è la sillaba <i>nu</i>",
                              "n": "ぬ è nu"
                          },
                          {
                              "t": "Parola: <b>ぬの</b> (stoffa)",
                              "n": "ぬの = stoffa"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ne",
                      "isLetter": true,
                      "letter": "ね",
                      "word": "ね",
                      "emoji": "🔤",
                      "phonetic": "/ne/",
                      "translation": "<b>ね</b> si legge <i>ne</i><br>La N di <i>nave</i> + la vocale E",
                      "mnemonic": "Sembra una 'n' con un cappio: ricorda 'ne' come 'neve'.",
                      "examples": [
                          {
                              "t": "<b>ね</b> è la sillaba <i>ne</i>",
                              "n": "ね è ne"
                          },
                          {
                              "t": "Parola: <b>ねこ</b> (gatto)",
                              "n": "ねこ = gatto"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_no",
                      "isLetter": true,
                      "letter": "の",
                      "word": "の",
                      "emoji": "🔤",
                      "phonetic": "/no/",
                      "translation": "<b>の</b> si legge <i>no</i><br>La N di <i>nave</i> + la vocale O",
                      "mnemonic": "Sembra un cerchio con un ricciolo: ricorda 'no' come 'nota' (musica).",
                      "examples": [
                          {
                              "t": "<b>の</b> è la sillaba <i>no</i>",
                              "n": "の è no"
                          },
                          {
                              "t": "Particella: <b>の</b> indica possesso, come 'di'",
                              "n": "の = di"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_01",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "あさ",
                      "emoji": "🌅",
                      "phonetic": "/asa/",
                      "translation": "<b>あさ</b> = mattina",
                      "translations": {
                          "ja": "あさ",
                          "it": "mattina",
                          "en": "morning"
                      },
                      "examples": [
                          {
                              "t": "<b>あさ</b> に おきます。",
                              "n": "Mi alzo al mattino."
                          },
                          {
                              "t": "あさ の コーヒー は おいしい。",
                              "n": "Il caffè del mattino è buono."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_02",
                      "isLetter": false,
                      "letter": "き",
                      "word": "きく",
                      "emoji": "👂",
                      "phonetic": "/kikɯ/",
                      "translation": "<b>きく</b> = ascoltare, sentire",
                      "translations": {
                          "ja": "きく",
                          "it": "ascoltare, sentire",
                          "en": "to listen, to hear"
                      },
                      "examples": [
                          {
                              "t": "おんがく を <b>きく</b>。",
                              "n": "Ascolto musica."
                          },
                          {
                              "t": "こえ が <b>きこえる</b>。",
                              "n": "Sento una voce."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_03",
                      "isLetter": false,
                      "letter": "す",
                      "word": "すし",
                      "emoji": "🍣",
                      "phonetic": "/sɯɕi/",
                      "translation": "<b>すし</b> = sushi",
                      "translations": {
                          "ja": "すし",
                          "it": "sushi",
                          "en": "sushi"
                      },
                      "examples": [
                          {
                              "t": "<b>すし</b> が すき です。",
                              "n": "Mi piace il sushi."
                          },
                          {
                              "t": "すし を たべます。",
                              "n": "Mangio sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_04",
                      "isLetter": false,
                      "letter": "た",
                      "word": "たべる",
                      "emoji": "🍽️",
                      "phonetic": "/taberɯ/",
                      "translation": "<b>たべる</b> = mangiare",
                      "translations": {
                          "ja": "たべる",
                          "it": "mangiare",
                          "en": "to eat"
                      },
                      "examples": [
                          {
                              "t": "りんご を <b>たべる</b>。",
                              "n": "Mangio una mela."
                          },
                          {
                              "t": "なに を <b>たべる</b>？",
                              "n": "Cosa mangi?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_05",
                      "isLetter": false,
                      "letter": "ね",
                      "word": "ねる",
                      "emoji": "😴",
                      "phonetic": "/nerɯ/",
                      "translation": "<b>ねる</b> = dormire",
                      "translations": {
                          "ja": "ねる",
                          "it": "dormire",
                          "en": "to sleep"
                      },
                      "examples": [
                          {
                              "t": "よる に <b>ねる</b>。",
                              "n": "Dormo di notte."
                          },
                          {
                              "t": "ねこ は <b>ねる</b> の が すき。",
                              "n": "Il gatto ama dormire."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g2",
              "name": "Hiragana — parte 2",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "は行 ま行 や行 ら行 わ行 ん + dakuten",
              "reviewFrom": [
                  "ja_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g2_L_ha",
                      "isLetter": true,
                      "letter": "は",
                      "word": "は",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "<b>は</b> (ha) — suona come <i>“ha”</i> di <span class=\"hl\">hallo</span> in inglese.",
                      "mnemonic": "Sembra una persona che saluta con un braccio alzato: “Ha!”",
                      "examples": [
                          {
                              "t": "<b>は</b> è la particella del tema.<br>Es. わたし<b>は</b>… (io…)",
                              "n": "Usata come particella grammaticale."
                          },
                          {
                              "t": "<b>はな</b> (fiore) inizia con <b>は</b>",
                              "n": "Parola utile."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_hi",
                      "isLetter": true,
                      "letter": "ひ",
                      "word": "ひ",
                      "emoji": "🔤",
                      "phonetic": "/çi/",
                      "translation": "<b>ひ</b> (hi) — un suono tra <i>“hi”</i> e <i>“ci”</i> dolce.",
                      "mnemonic": "Sembra un sorriso con un occhio: “Hihi!” come una risata.",
                      "examples": [
                          {
                              "t": "<b>ひ</b> è in <b>ひ</b>と (persona)",
                              "n": "Parola comune."
                          },
                          {
                              "t": "<b>ひ</b> come in <b>ひ</b>る (mezzogiorno)",
                              "n": "Nota: si pronuncia con una specie di 'y'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_fu",
                      "isLetter": true,
                      "letter": "ふ",
                      "word": "ふ",
                      "emoji": "🔤",
                      "phonetic": "/ɸɯ/",
                      "translation": "<b>ふ</b> (fu) — non è una <i>“fu”</i> italiana, ma un soffio tra <i>“fu”</i> e <i>“hu”</i>.",
                      "mnemonic": "Sembra un camino che soffia: “fuu” per spegnere una candela.",
                      "examples": [
                          {
                              "t": "<b>ふ</b> è in <b>ふ</b>じ (Fuji)",
                              "n": "Monte Fuji."
                          },
                          {
                              "t": "<b>ふ</b> è in <b>ふ</b>ゆ (inverno)",
                              "n": "Stagione."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_he",
                      "isLetter": true,
                      "letter": "へ",
                      "word": "へ",
                      "emoji": "🔤",
                      "phonetic": "/he/",
                      "translation": "<b>へ</b> (he) — suona come <i>“he”</i> di <span class=\"hl\">hello</span>.",
                      "mnemonic": "Sembra un tetto spiovente: “He!” come per chiamare qualcuno.",
                      "examples": [
                          {
                              "t": "<b>へ</b> è anche una particella di direzione.<br>Es. がっこう<b>へ</b> (verso scuola)",
                              "n": "Particella."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ho",
                      "isLetter": true,
                      "letter": "ほ",
                      "word": "ほ",
                      "emoji": "🔤",
                      "phonetic": "/ho/",
                      "translation": "<b>ほ</b> (ho) — come <i>“ho”</i> in <span class=\"hl\">hotel</span>.",
                      "mnemonic": "Sembra un albero con due rami: “Ho!” come per dire “ecco”.",
                      "examples": [
                          {
                              "t": "<b>ほ</b> è in <b>ほ</b>し (stella)",
                              "n": "Parola comune."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ma",
                      "isLetter": true,
                      "letter": "ま",
                      "word": "ま",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "<b>ま</b> (ma) — suona come <i>“ma”</i> in italiano.",
                      "mnemonic": "Sembra una matita con una punta: “Ma!” per disegnare.",
                      "examples": [
                          {
                              "t": "<b>ま</b> è in <b>ま</b>ど (finestra)",
                              "n": "Parola utile."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mi",
                      "isLetter": true,
                      "letter": "み",
                      "word": "み",
                      "emoji": "🔤",
                      "phonetic": "/mi/",
                      "translation": "<b>み</b> (mi) — come <i>“mi”</i> di <span class=\"hl\">mica</span>.",
                      "mnemonic": "Sembra una persona che guarda da dietro: “Mi!” come per dire “guarda me”.",
                      "examples": [
                          {
                              "t": "<b>み</b> è in <b>み</b>ず (acqua)",
                              "n": "Parola del vocabolario."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mu",
                      "isLetter": true,
                      "letter": "む",
                      "word": "む",
                      "emoji": "🔤",
                      "phonetic": "/mɯ/",
                      "translation": "<b>む</b> (mu) — suona come <i>“mu”</i> ma con le labbra non arrotondate.",
                      "mnemonic": "Sembra una mucca con le corna: “Muu!”",
                      "examples": [
                          {
                              "t": "<b>む</b> è in <b>む</b>ずかしい (difficile)",
                              "n": "Aggettivo."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_me",
                      "isLetter": true,
                      "letter": "め",
                      "word": "め",
                      "emoji": "🔤",
                      "phonetic": "/me/",
                      "translation": "<b>め</b> (me) — come <i>“me”</i> in italiano.",
                      "mnemonic": "Sembra un occhio: “Me!” come per dire “guarda me”.",
                      "examples": [
                          {
                              "t": "<b>め</b> è in <b>め</b> (occhio) — stessa parola.",
                              "n": "Occhio."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_mo",
                      "isLetter": true,
                      "letter": "も",
                      "word": "も",
                      "emoji": "🔤",
                      "phonetic": "/mo/",
                      "translation": "<b>も</b> (mo) — come <i>“mo”</i> di <span class=\"hl\">moda</span>.",
                      "mnemonic": "Sembra una persona che porta qualcosa: “Mo!” come “ancora”.",
                      "examples": [
                          {
                              "t": "<b>も</b> significa anche “anche”.<br>Es. わたし<b>も</b> (anche io)",
                              "n": "Particella."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ya",
                      "isLetter": true,
                      "letter": "や",
                      "word": "や",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "<b>や</b> (ya) — suona come <i>“ya”</i> di <span class=\"hl\">yacht</span>.",
                      "mnemonic": "Sembra una freccia che punta in alto: “Ya!” come esclamazione.",
                      "examples": [
                          {
                              "t": "<b>や</b> è in <b>や</b>ま (montagna)",
                              "n": "Parola del vocabolario."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_yu",
                      "isLetter": true,
                      "letter": "ゆ",
                      "word": "ゆ",
                      "emoji": "🔤",
                      "phonetic": "/jɯ/",
                      "translation": "<b>ゆ</b> (yu) — suona come <i>“yu”</i> con labbra non arrotondate.",
                      "mnemonic": "Sembra un pesce che nuota: “Yu!” come per dire “sì” in giapponese.",
                      "examples": [
                          {
                              "t": "<b>ゆ</b> è in <b>ゆ</b>き (neve)",
                              "n": "Parola comune."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_yo",
                      "isLetter": true,
                      "letter": "よ",
                      "word": "よ",
                      "emoji": "🔤",
                      "phonetic": "/jo/",
                      "translation": "<b>よ</b> (yo) — come <i>“yo”</i> di <span class=\"hl\">yogurt</span>.",
                      "mnemonic": "Sembra una persona che salta: “Yo!” come saluto.",
                      "examples": [
                          {
                              "t": "<b>よ</b> è in <b>よ</b>る (notte)",
                              "n": "Parola comune."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ra",
                      "isLetter": true,
                      "letter": "ら",
                      "word": "ら",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "<b>ら</b> (ra) — una <i>“r”</i> leggera, come la <i>“r”</i> spagnola breve.",
                      "mnemonic": "Sembra un ragno: “Ra!” come per spaventare.",
                      "examples": [
                          {
                              "t": "<b>ら</b> è in <b>ら</b>めん (ramen)",
                              "n": "Piatto giapponese."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ri",
                      "isLetter": true,
                      "letter": "り",
                      "word": "り",
                      "emoji": "🔤",
                      "phonetic": "/ɾi/",
                      "translation": "<b>り</b> (ri) — come <i>“ri”</i> ma con la <i>“r”</i> morbida.",
                      "mnemonic": "Sembra due persone che si incontrano: “Ri!” come per dire “amico”.",
                      "examples": [
                          {
                              "t": "<b>り</b> è in <b>り</b>んご (mela)",
                              "n": "Frutto."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ru",
                      "isLetter": true,
                      "letter": "る",
                      "word": "る",
                      "emoji": "🔤",
                      "phonetic": "/ɾɯ/",
                      "translation": "<b>る</b> (ru) — come <i>“ru”</i> ma con la <i>“r”</i> morbida.",
                      "mnemonic": "Sembra un numero 3 con un gancio: “Ru!” come per dire “tre”.",
                      "examples": [
                          {
                              "t": "<b>る</b> è in <b>る</b> (verbo: essere)",
                              "n": "Terminazione dei verbi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_re",
                      "isLetter": true,
                      "letter": "れ",
                      "word": "れ",
                      "emoji": "🔤",
                      "phonetic": "/ɾe/",
                      "translation": "<b>れ</b> (re) — come <i>“re”</i> ma con la <i>“r”</i> morbida.",
                      "mnemonic": "Sembra una persona che corre: “Re!” come per dire “veloce”.",
                      "examples": [
                          {
                              "t": "<b>れ</b> è in <b>れ</b>きし (storia)",
                              "n": "Parola comune."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ro",
                      "isLetter": true,
                      "letter": "ろ",
                      "word": "ろ",
                      "emoji": "🔤",
                      "phonetic": "/ɾo/",
                      "translation": "<b>ろ</b> (ro) — come <i>“ro”</i> ma con la <i>“r”</i> morbida.",
                      "mnemonic": "Sembra un numero 3: “Ro!” come per dire “tre”.",
                      "examples": [
                          {
                              "t": "<b>ろ</b> è in <b>ろ</b>く (sei)",
                              "n": "Numero."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wa",
                      "isLetter": true,
                      "letter": "わ",
                      "word": "わ",
                      "emoji": "🔤",
                      "phonetic": "/ɰa/",
                      "translation": "<b>わ</b> (wa) — suona come <i>“ua”</i> in <span class=\"hl\">quando</span>.",
                      "mnemonic": "Sembra una persona con le braccia aperte: “Wa!” come meraviglia.",
                      "examples": [
                          {
                              "t": "<b>わ</b> è in <b>わ</b>たし (io)",
                              "n": "Parola del vocabolario."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wo",
                      "isLetter": true,
                      "letter": "を",
                      "word": "を",
                      "emoji": "🔤",
                      "phonetic": "/o/ (solo particella)",
                      "translation": "<b>を</b> (wo/o) — si pronuncia <i>“o”</i>, usata solo come particella.",
                      "mnemonic": "Sembra una persona che indica un oggetto: “Wo!” per marcare l'oggetto.",
                      "examples": [
                          {
                              "t": "<b>を</b> è la particella dell'oggetto.<br>Es. みず<b>を</b> のむ (bere acqua)",
                              "n": "Particella."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_n",
                      "isLetter": true,
                      "letter": "ん",
                      "word": "ん",
                      "emoji": "🔤",
                      "phonetic": "/ɴ/",
                      "translation": "<b>ん</b> (n) — è l'unica consonante isolata, suona come <i>“n”</i> finale.",
                      "mnemonic": "Sembra una persona che dorme: “N...” come ronfare.",
                      "examples": [
                          {
                              "t": "<b>ん</b> è in <b>にほん</b> (Giappone)",
                              "n": "Parola del vocabolario."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_dakuten",
                      "isLetter": true,
                      "letter": "゛゜",
                      "word": "゛゜",
                      "emoji": "🔤",
                      "phonetic": "/ga, za, da, ba, pa/",
                      "translation": "<b>Dakuten</b> (゛) e <b>handakuten</b> (゜) — trasformano il suono.<br>Es. か→が, た→だ, は→ば/ぱ",
                      "mnemonic": "Due piccoli segni in alto a destra: come un accento che cambia il suono.",
                      "examples": [
                          {
                              "t": "<b>が</b> (ga), <b>ざ</b> (za), <b>だ</b> (da), <b>ば</b> (ba), <b>ぱ</b> (pa)",
                              "n": "Suoni sonori."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_01",
                      "isLetter": false,
                      "letter": "は",
                      "word": "はな",
                      "emoji": "🌸",
                      "phonetic": "/hana/",
                      "translation": "<b>fiore</b>",
                      "translations": {
                          "ja": "はな",
                          "it": "fiore",
                          "en": "flower"
                      },
                      "examples": [
                          {
                              "t": "これは <b>はな</b> です。",
                              "n": "Questo è un fiore."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_02",
                      "isLetter": false,
                      "letter": "み",
                      "word": "みず",
                      "emoji": "💧",
                      "phonetic": "/mizu/",
                      "translation": "<b>acqua</b>",
                      "translations": {
                          "ja": "みず",
                          "it": "acqua",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "<b>みず</b> を ください。",
                              "n": "Acqua, per favore."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_03",
                      "isLetter": false,
                      "letter": "や",
                      "word": "やま",
                      "emoji": "⛰️",
                      "phonetic": "/jama/",
                      "translation": "<b>montagna</b>",
                      "translations": {
                          "ja": "やま",
                          "it": "montagna",
                          "en": "mountain"
                      },
                      "examples": [
                          {
                              "t": "あの <b>やま</b> は たかい です。",
                              "n": "Quella montagna è alta."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_04",
                      "isLetter": false,
                      "letter": "ら",
                      "word": "られる",
                      "emoji": "💪",
                      "phonetic": "/rareru/",
                      "translation": "<b>potere</b> (forma potenziale)",
                      "translations": {
                          "ja": "られる",
                          "it": "potere (forma potenziale)",
                          "en": "can do"
                      },
                      "examples": [
                          {
                              "t": "にほんご が <b>はなせる</b> ように なりたい。",
                              "n": "Voglio diventare capace di parlare giapponese."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_05",
                      "isLetter": false,
                      "letter": "わ",
                      "word": "わたし",
                      "emoji": "👤",
                      "phonetic": "/watashi/",
                      "translation": "<b>io</b>",
                      "translations": {
                          "ja": "わたし",
                          "it": "io",
                          "en": "I"
                      },
                      "examples": [
                          {
                              "t": "<b>わたし</b> は イタリアじん です。",
                              "n": "Io sono italiano."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_06",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "ありがとう",
                      "emoji": "🙏",
                      "phonetic": "/arigatou/",
                      "translation": "<b>grazie</b>",
                      "translations": {
                          "ja": "ありがとう",
                          "it": "grazie",
                          "en": "thank you"
                      },
                      "examples": [
                          {
                              "t": "<b>ありがとう</b> ございます。",
                              "n": "Grazie (formale)."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_07",
                      "isLetter": false,
                      "letter": "に",
                      "word": "にほん",
                      "emoji": "🇯🇵",
                      "phonetic": "/nihon/",
                      "translation": "<b>Giappone</b>",
                      "translations": {
                          "ja": "にほん",
                          "it": "Giappone",
                          "en": "Japan"
                      },
                      "examples": [
                          {
                              "t": "<b>にほん</b> は うつくしい くに です。",
                              "n": "Il Giappone è un paese bellissimo."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g3",
              "name": "Katakana — parte 1",
              "icon": "🔠",
              "color": "#10b981",
              "description": "ア行 カ行 サ行 タ行 ナ行 — comparando con hiragana",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g3_L_a",
                      "isLetter": true,
                      "letter": "ア",
                      "word": "ア",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "Suono <b>a</b> come in <i>casa</i>.<br>Katakana <b>ア</b> è simile a un <span class='hl'>albero</span> stilizzato, mentre hiragana あ ha un occhio.",
                      "mnemonic": "Immagina un albero con un ramo che punta a sinistra.",
                      "examples": [
                          {
                              "t": "<b>ア</b> come <i>albero</i> – il tratto orizzontale è il ramo.",
                              "n": "Associazione visiva"
                          },
                          {
                              "t": "In <b>ア</b> il tratto verticale è più lungo di あ.",
                              "n": "Confronto con hiragana"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_i",
                      "isLetter": true,
                      "letter": "イ",
                      "word": "イ",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "Suono <b>i</b> come in <i>vino</i>.<br><b>イ</b> sembra una <span class='hl'>i</span> gotica, mentre hiragana い è più curvilineo.",
                      "mnemonic": "Il tratto destro di イ è dritto come una 'i' senza punto.",
                      "examples": [
                          {
                              "t": "<b>イ</b> è come una 'i' maiuscola senza punto.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con い: い ha una curva, <b>イ</b> è più angolare.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_u",
                      "isLetter": true,
                      "letter": "ウ",
                      "word": "ウ",
                      "emoji": "🔤",
                      "phonetic": "/u/",
                      "translation": "Suono <b>u</b> come in <i>luna</i>.<br><b>ウ</b> sembra un <span class='hl'>coperchio</span> di una pentola, mentre う ha un gancio.",
                      "mnemonic": "La parte superiore di ウ è un tetto (u = 'up' in inglese).",
                      "examples": [
                          {
                              "t": "<b>ウ</b> come un tetto sopra una casa.",
                              "n": "Associazione"
                          },
                          {
                              "t": "In <b>ウ</b> il primo tratto è orizzontale, in う è curvo.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_e",
                      "isLetter": true,
                      "letter": "エ",
                      "word": "エ",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "Suono <b>e</b> come in <i>vero</i>.<br><b>エ</b> sembra una <span class='hl'>scala</span> o una 'E' senza il tratto centrale, mentre え ha una curva.",
                      "mnemonic": "エ è come una scala a pioli (e di 'scala' in inglese è 'ladder', ma qui è 'E').",
                      "examples": [
                          {
                              "t": "<b>エ</b> come una scala a pioli.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con え: え ha un occhiello, <b>エ</b> è più rigido.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_o",
                      "isLetter": true,
                      "letter": "オ",
                      "word": "オ",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Suono <b>o</b> come in <i>oro</i>.<br><b>オ</b> ha un tratto verticale che scende, mentre お ha un occhiello.",
                      "mnemonic": "オ sembra un albero con un ramo che punta a sinistra, come ア ma con un tratto in più.",
                      "examples": [
                          {
                              "t": "<b>オ</b> come un albero con radici.",
                              "n": "Associazione"
                          },
                          {
                              "t": "In <b>オ</b> il tratto verticale è più lungo e ha un taglio orizzontale in alto.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ka",
                      "isLetter": true,
                      "letter": "カ",
                      "word": "カ",
                      "emoji": "🔤",
                      "phonetic": "/ka/",
                      "translation": "Suono <b>ka</b> come in <i>casa</i>.<br><b>カ</b> è simile a ア ma con un tratto verticale che scende a destra, mentre か ha un gancio.",
                      "mnemonic": "カ sembra un 'K' senza la gamba destra, ma con un taglio.",
                      "examples": [
                          {
                              "t": "<b>カ</b> come una 'K' stilizzata.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con か: か ha un ricciolo, <b>カ</b> no.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ki",
                      "isLetter": true,
                      "letter": "キ",
                      "word": "キ",
                      "emoji": "🔤",
                      "phonetic": "/ki/",
                      "translation": "Suono <b>ki</b> come in <i>chilo</i>.<br><b>キ</b> è come una <span class='hl'>chiave</span> (key in inglese), mentre き ha un ricciolo in basso.",
                      "mnemonic": "キ sembra una chiave inglese (key).",
                      "examples": [
                          {
                              "t": "<b>キ</b> come una chiave (key).",
                              "n": "Associazione"
                          },
                          {
                              "t": "In <b>キ</b> il tratto inferiore è dritto, in き è curvo.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ku",
                      "isLetter": true,
                      "letter": "ク",
                      "word": "ク",
                      "emoji": "🔤",
                      "phonetic": "/ku/",
                      "translation": "Suono <b>ku</b> come in <i>cubo</i>.<br><b>ク</b> sembra un <span class='hl'>becco</span> di uccello, mentre く è solo una curva.",
                      "mnemonic": "ク ha un tratto in più rispetto a く, come un becco che si apre.",
                      "examples": [
                          {
                              "t": "<b>ク</b> come un becco che si apre.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con く: く è una curva semplice, <b>ク</b> ha un taglio.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ke",
                      "isLetter": true,
                      "letter": "ケ",
                      "word": "ケ",
                      "emoji": "🔤",
                      "phonetic": "/ke/",
                      "translation": "Suono <b>ke</b> come in <i>chela</i>.<br><b>ケ</b> sembra una <span class='hl'>chela</span> di granchio, mentre け ha un tratto curvo.",
                      "mnemonic": "ケ come una chela (in giapponese 'ke' può ricordare 'granchio'? Non proprio, ma visualizza una chela).",
                      "examples": [
                          {
                              "t": "<b>ケ</b> come una chela di granchio.",
                              "n": "Associazione"
                          },
                          {
                              "t": "In <b>ケ</b> il tratto sinistro è più lungo, in け è più corto.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ko",
                      "isLetter": true,
                      "letter": "コ",
                      "word": "コ",
                      "emoji": "🔤",
                      "phonetic": "/ko/",
                      "translation": "Suono <b>ko</b> come in <i>collo</i>.<br><b>コ</b> è come una <span class='hl'>bocca</span> aperta (o un angolo), mentre こ è due tratti sovrapposti.",
                      "mnemonic": "コ sembra una bocca spalancata (ko in inglese suona come 'caw'? Meglio: ricorda un angolo retto).",
                      "examples": [
                          {
                              "t": "<b>コ</b> come una bocca aperta.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con こ: こ ha due tratti orizzontali, <b>コ</b> è un angolo unico.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_sa",
                      "isLetter": true,
                      "letter": "サ",
                      "word": "サ",
                      "emoji": "🔤",
                      "phonetic": "/sa/",
                      "translation": "Suono <b>sa</b> come in <i>sale</i>.<br><b>サ</b> sembra una <span class='hl'>sella</span> (in inglese 'saddle'), mentre さ ha un ricciolo.",
                      "mnemonic": "サ come una sella con due corni.",
                      "examples": [
                          {
                              "t": "<b>サ</b> come una sella.",
                              "n": "Associazione"
                          },
                          {
                              "t": "In <b>サ</b> il tratto orizzontale è unico, in さ è spezzato.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_shi",
                      "isLetter": true,
                      "letter": "シ",
                      "word": "シ",
                      "emoji": "🔤",
                      "phonetic": "/ɕi/",
                      "translation": "Suono <b>shi</b> come in <i>scivolo</i>.<br><b>シ</b> sembra due <span class='hl'>occhi</span> (o gocce) con un tratto, mentre し è come una curva.",
                      "mnemonic": "シ come due occhi che piangono (shi = 'she' in inglese, pensa a 'she' che piange).",
                      "examples": [
                          {
                              "t": "<b>シ</b> come due gocce che cadono.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con し: し è una curva singola, <b>シ</b> ha due tratti.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_su",
                      "isLetter": true,
                      "letter": "ス",
                      "word": "ス",
                      "emoji": "🔤",
                      "phonetic": "/sɯ/",
                      "translation": "Suono <b>su</b> come in <i>sugo</i> (ma più corto).<br><b>ス</b> è come una <span class='hl'>spirale</span> stilizzata, mentre す ha un ricciolo.",
                      "mnemonic": "ス come una spirale (su in inglese suona come 'sue', ma visualizza una spirale).",
                      "examples": [
                          {
                              "t": "<b>ス</b> come una spirale.",
                              "n": "Associazione"
                          },
                          {
                              "t": "In <b>ス</b> il tratto finale è verso l'alto, in す è curvo.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_se",
                      "isLetter": true,
                      "letter": "セ",
                      "word": "セ",
                      "emoji": "🔤",
                      "phonetic": "/se/",
                      "translation": "Suono <b>se</b> come in <i>sete</i>.<br><b>セ</b> sembra un <span class='hl'>setaccio</span> (o una 'S' con un taglio), mentre せ ha un ricciolo.",
                      "mnemonic": "セ come una 'S' con un tratto orizzontale (setaccio).",
                      "examples": [
                          {
                              "t": "<b>セ</b> come una 'S' tagliata.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con せ: せ ha un ricciolo, <b>セ</b> ha un taglio.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_so",
                      "isLetter": true,
                      "letter": "ソ",
                      "word": "ソ",
                      "emoji": "🔤",
                      "phonetic": "/so/",
                      "translation": "Suono <b>so</b> come in <i>solo</i>.<br><b>ソ</b> è simile a シ ma con i tratti più verticali, mentre そ è una curva complessa.",
                      "mnemonic": "ソ come due dita che puntano in basso (so = 'solo', ma visualizza dita).",
                      "examples": [
                          {
                              "t": "<b>ソ</b> come due dita che scendono.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con そ: そ ha un ricciolo, <b>ソ</b> ha due tratti.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ta",
                      "isLetter": true,
                      "letter": "タ",
                      "word": "タ",
                      "emoji": "🔤",
                      "phonetic": "/ta/",
                      "translation": "Suono <b>ta</b> come in <i>tavolo</i>.<br><b>タ</b> sembra una <span class='hl'>tenda</span> (o un 'T' con un taglio), mentre た ha un ricciolo.",
                      "mnemonic": "タ come una tenda (ta in inglese è 'tent'? No, ma visualizza una tenda).",
                      "examples": [
                          {
                              "t": "<b>タ</b> come una tenda.",
                              "n": "Associazione"
                          },
                          {
                              "t": "Confronta con た: た ha un ricciolo, <b>タ</b> è più angolare.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_chi",
                      "isLetter": true,
                      "letter": "チ",
                      "word": "チ",
                      "emoji": "🔤",
                      "phonetic": "/tɕi/",
                      "translation": "Suono <b>chi</b> come in <i>ciao</i>.<br><b>チ</b> è come una <span class='hl'>clessidra</span> (o un '5' rovesciato), mentre ち è simile ma con un ricciolo.",
                      "mnemonic": "チ come una clessidra (chi = 'key' in inglese? Ma visualizza una clessidra).",
                      "examples": [
                          {
                              "t": "<b>チ</b> come una clessidra.",
                              "n": "Forma"
                          },
                          {
                              "t": "In <b>チ</b> il tratto inferiore è curvo, in ち è più arrotondato.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_tsu",
                      "isLetter": true,
                      "letter": "ツ",
                      "word": "ツ",
                      "emoji": "🔤",
                      "phonetic": "/tsɯ/",
                      "translation": "Suono <b>tsu</b> come in <i>tsunami</i>.<br><b>ツ</b> è simile a シ ma con i tratti più orizzontali, mentre つ è una curva.",
                      "mnemonic": "ツ come tre onde (tsunami).",
                      "examples": [
                          {
                              "t": "<b>ツ</b> come onde di uno tsunami.",
                              "n": "Associazione"
                          },
                          {
                              "t": "Confronta con つ: つ è una curva, <b>ツ</b> ha tre tratti.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_te",
                      "isLetter": true,
                      "letter": "テ",
                      "word": "テ",
                      "emoji": "🔤",
                      "phonetic": "/te/",
                      "translation": "Suono <b>te</b> come in <i>tela</i>.<br><b>テ</b> sembra una <span class='hl'>tenda</span> (o un 'T' con un taglio), mentre て è una curva.",
                      "mnemonic": "テ come una 'T' con un cappello (te in inglese è 'tea', ma visualizza una T).",
                      "examples": [
                          {
                              "t": "<b>テ</b> come una 'T' con un cappello.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con て: て è una curva, <b>テ</b> è angolare.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_to",
                      "isLetter": true,
                      "letter": "ト",
                      "word": "ト",
                      "emoji": "🔤",
                      "phonetic": "/to/",
                      "translation": "Suono <b>to</b> come in <i>toro</i>.<br><b>ト</b> è come un <span class='hl'>chiodo</span> (o un 'ト' che sembra un martello), mentre と è una curva.",
                      "mnemonic": "ト come un chiodo piantato (to in inglese è 'toe'? Visualizza un chiodo).",
                      "examples": [
                          {
                              "t": "<b>ト</b> come un chiodo.",
                              "n": "Associazione"
                          },
                          {
                              "t": "Confronta con と: と ha un gancio, <b>ト</b> è diritto.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_na",
                      "isLetter": true,
                      "letter": "ナ",
                      "word": "ナ",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "Suono <b>na</b> come in <i>nave</i>.<br><b>ナ</b> è come una <span class='hl'>nave</span> stilizzata (o un 'ナ' che sembra un albero), mentre な ha un ricciolo.",
                      "mnemonic": "ナ come una vela (na in inglese suona come 'nah', visualizza una vela).",
                      "examples": [
                          {
                              "t": "<b>ナ</b> come una vela.",
                              "n": "Associazione"
                          },
                          {
                              "t": "Confronta con な: な ha un ricciolo, <b>ナ</b> è semplice.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ni",
                      "isLetter": true,
                      "letter": "ニ",
                      "word": "ニ",
                      "emoji": "🔤",
                      "phonetic": "/ɲi/",
                      "translation": "Suono <b>ni</b> come in <i>gnomo</i> (approssimato).<br><b>ニ</b> è come due <span class='hl'>linee</span> parallele, mentre に ha un ricciolo.",
                      "mnemonic": "ニ come due linee (ni in inglese è 'knee'? Visualizza due ginocchia).",
                      "examples": [
                          {
                              "t": "<b>ニ</b> come due linee parallele.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con に: に ha un tratto curvo, <b>ニ</b> è solo due linee.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_nu",
                      "isLetter": true,
                      "letter": "ヌ",
                      "word": "ヌ",
                      "emoji": "🔤",
                      "phonetic": "/nɯ/",
                      "translation": "Suono <b>nu</b> come in <i>nudo</i> (ma più corto).<br><b>ヌ</b> sembra un <span class='hl'>nodo</span> (o una 'ヌ' che ricorda un nodo), mentre ぬ ha un ricciolo.",
                      "mnemonic": "ヌ come un nodo (nu in inglese è 'new'? Visualizza un nodo).",
                      "examples": [
                          {
                              "t": "<b>ヌ</b> come un nodo.",
                              "n": "Associazione"
                          },
                          {
                              "t": "Confronta con ぬ: ぬ ha un ricciolo, <b>ヌ</b> è più angolare.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ne",
                      "isLetter": true,
                      "letter": "ネ",
                      "word": "ネ",
                      "emoji": "🔤",
                      "phonetic": "/ne/",
                      "translation": "Suono <b>ne</b> come in <i>neve</i>.<br><b>ネ</b> è come un <span class='hl'>albero di Natale</span> stilizzato, mentre ね ha un ricciolo.",
                      "mnemonic": "ネ come un albero di Natale (ne in inglese è 'nay'? Visualizza un albero).",
                      "examples": [
                          {
                              "t": "<b>ネ</b> come un albero di Natale.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con ね: ね ha un ricciolo, <b>ネ</b> ha un tratto orizzontale.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_no",
                      "isLetter": true,
                      "letter": "ノ",
                      "word": "ノ",
                      "emoji": "🔤",
                      "phonetic": "/no/",
                      "translation": "Suono <b>no</b> come in <i>nota</i>.<br><b>ノ</b> è un semplice tratto discendente, mentre の è un cerchio con un gancio.",
                      "mnemonic": "ノ come una linea inclinata (no in inglese è 'no', ma visualizza una linea).",
                      "examples": [
                          {
                              "t": "<b>ノ</b> come una linea che scende.",
                              "n": "Forma"
                          },
                          {
                              "t": "Confronta con の: の è un cerchio, <b>ノ</b> è una linea.",
                              "n": "Differenza"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_01",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コーヒー",
                      "emoji": "☕",
                      "phonetic": "/koːçiː/",
                      "translation": "<b>Caffè</b> – parola di origine inglese <i>coffee</i>.",
                      "translations": {
                          "ja": "コーヒー",
                          "it": "caffè",
                          "en": "coffee"
                      },
                      "examples": [
                          {
                              "t": "<b>コーヒー</b>を飲みます。",
                              "n": "Bevo caffè."
                          },
                          {
                              "t": "これは <b>コーヒー</b>です。",
                              "n": "Questo è caffè."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_02",
                      "isLetter": false,
                      "letter": "テ",
                      "word": "テレビ",
                      "emoji": "📺",
                      "phonetic": "/teɾebi/",
                      "translation": "<b>TV</b> – abbreviazione di <i>televisione</i>.",
                      "translations": {
                          "ja": "テレビ",
                          "it": "TV",
                          "en": "TV"
                      },
                      "examples": [
                          {
                              "t": "<b>テレビ</b>を見ます。",
                              "n": "Guardo la TV."
                          },
                          {
                              "t": "<b>テレビ</b>はどこですか？",
                              "n": "Dov'è la TV?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_03",
                      "isLetter": false,
                      "letter": "ア",
                      "word": "アイスクリーム",
                      "emoji": "🍦",
                      "phonetic": "/aisɯkɯɾiːmɯ/",
                      "translation": "<b>Gelato</b> – dall'inglese <i>ice cream</i>.",
                      "translations": {
                          "ja": "アイスクリーム",
                          "it": "gelato",
                          "en": "ice cream"
                      },
                      "examples": [
                          {
                              "t": "<b>アイスクリーム</b>が好きです。",
                              "n": "Mi piace il gelato."
                          },
                          {
                              "t": "<b>アイスクリーム</b>を食べます。",
                              "n": "Mangio il gelato."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_04",
                      "isLetter": false,
                      "letter": "タ",
                      "word": "タクシー",
                      "emoji": "🚕",
                      "phonetic": "/takɯɕiː/",
                      "translation": "<b>Taxi</b> – dall'inglese <i>taxi</i>.",
                      "translations": {
                          "ja": "タクシー",
                          "it": "taxi",
                          "en": "taxi"
                      },
                      "examples": [
                          {
                              "t": "<b>タクシー</b>に乗ります。",
                              "n": "Prendo un taxi."
                          },
                          {
                              "t": "<b>タクシー</b>を呼びます。",
                              "n": "Chiamo un taxi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_05",
                      "isLetter": false,
                      "letter": "ニュ",
                      "word": "ニュース",
                      "emoji": "📰",
                      "phonetic": "/nʲɯːsɯ/",
                      "translation": "<b>Notizie</b> – dall'inglese <i>news</i>.",
                      "translations": {
                          "ja": "ニュース",
                          "it": "notizie",
                          "en": "news"
                      },
                      "examples": [
                          {
                              "t": "<b>ニュース</b>を見ます。",
                              "n": "Guardo le notizie."
                          },
                          {
                              "t": "<b>ニュース</b>を聞きます。",
                              "n": "Ascolto le notizie."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g4",
              "name": "Katakana — parte 2",
              "icon": "🔣",
              "color": "#ef4444",
              "description": "ハ行 マ行 ヤ行 ラ行 ワ行 + préstamos",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g4_L_ha",
                      "isLetter": true,
                      "letter": "ハ",
                      "word": "ハ",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "Suono <b>ha</b><br>Come la <i>'h' aspirata</i> inglese in 'hat'",
                      "mnemonic": "Sembra una 'ha' stilizzata: la linea orizzontale in alto e due gambe, come una 'h' minuscola.",
                      "examples": [
                          {
                              "t": "ハは <i>ha</i> と読む",
                              "n": "ハ si legge 'ha'"
                          },
                          {
                              "t": "<b>ハ</b>ンバーガー = hamburger",
                              "n": "La prima lettera di 'hamburger' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_hi",
                      "isLetter": true,
                      "letter": "ヒ",
                      "word": "ヒ",
                      "emoji": "🔤",
                      "phonetic": "/çi/",
                      "translation": "Suono <b>hi</b><br>Come una <i>'chi'</i> italiana ma più dolce, senza 'c'",
                      "mnemonic": "Sembra una 'h' con un taglio diagonale: pensa a <span class='hl'>'hi'</span> come un saluto.",
                      "examples": [
                          {
                              "t": "ヒは <i>hi</i> と読む",
                              "n": "ヒ si legge 'hi'"
                          },
                          {
                              "t": "<b>ヒ</b>ーター = heater",
                              "n": "Prima lettera di 'heater' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_fu",
                      "isLetter": true,
                      "letter": "フ",
                      "word": "フ",
                      "emoji": "🔤",
                      "phonetic": "/ɸɯ/",
                      "translation": "Suono <b>fu</b><br>Come una <i>'fu'</i> ma con le labbra non arrotondate",
                      "mnemonic": "Sembra una 'f' maiuscola senza la linea orizzontale in alto: la parte in basso è come una 'u'.",
                      "examples": [
                          {
                              "t": "フは <i>fu</i> と読む",
                              "n": "フ si legge 'fu'"
                          },
                          {
                              "t": "<b>フ</b>ルーツ = fruits",
                              "n": "Prima lettera di 'fruits' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_he",
                      "isLetter": true,
                      "letter": "ヘ",
                      "word": "ヘ",
                      "emoji": "🔤",
                      "phonetic": "/he/",
                      "translation": "Suono <b>he</b><br>Come la <i>'e'</i> in 'hello' ma con la 'h'",
                      "mnemonic": "Sembra un tetto spiovente: pensa a <span class='hl'>'he'</span> come a un tetto che protegge.",
                      "examples": [
                          {
                              "t": "ヘは <i>he</i> と読む",
                              "n": "ヘ si legge 'he'"
                          },
                          {
                              "t": "<b>ヘ</b>リコプター = helicopter",
                              "n": "Prima lettera di 'helicopter' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ho",
                      "isLetter": true,
                      "letter": "ホ",
                      "word": "ホ",
                      "emoji": "🔤",
                      "phonetic": "/ho/",
                      "translation": "Suono <b>ho</b><br>Come la <i>'o'</i> in 'hot' con la 'h'",
                      "mnemonic": "Sembra una 'h' con due braccia laterali: pensa a <span class='hl'>'ho'</span> come a un albero con rami.",
                      "examples": [
                          {
                              "t": "ホは <i>ho</i> と読む",
                              "n": "ホ si legge 'ho'"
                          },
                          {
                              "t": "<b>ホ</b>テル = hotel",
                              "n": "Prima lettera di 'hotel' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ma",
                      "isLetter": true,
                      "letter": "マ",
                      "word": "マ",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "Suono <b>ma</b><br>Come la <i>'ma'</i> italiana",
                      "mnemonic": "Sembra una 'm' maiuscola con le gambe aperte: pensa a <span class='hl'>'ma'</span> come a una 'm' stilizzata.",
                      "examples": [
                          {
                              "t": "マは <i>ma</i> と読む",
                              "n": "マ si legge 'ma'"
                          },
                          {
                              "t": "<b>マ</b>ンゴー = mango",
                              "n": "Prima lettera di 'mango' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mi",
                      "isLetter": true,
                      "letter": "ミ",
                      "word": "ミ",
                      "emoji": "🔤",
                      "phonetic": "/mi/",
                      "translation": "Suono <b>mi</b><br>Come la <i>'mi'</i> italiana",
                      "mnemonic": "Sembra un '21' rovesciato: pensa a <span class='hl'>'mi'</span> come a un '2' e un '1'.",
                      "examples": [
                          {
                              "t": "ミは <i>mi</i> と読む",
                              "n": "ミ si legge 'mi'"
                          },
                          {
                              "t": "<b>ミ</b>ルク = milk",
                              "n": "Prima lettera di 'milk' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mu",
                      "isLetter": true,
                      "letter": "ム",
                      "word": "ム",
                      "emoji": "🔤",
                      "phonetic": "/mɯ/",
                      "translation": "Suono <b>mu</b><br>Come la <i>'mu'</i> italiana ma con le labbra non arrotondate",
                      "mnemonic": "Sembra una 'm' senza la prima gamba: pensa a <span class='hl'>'mu'</span> come a una 'm' che ha perso una gamba.",
                      "examples": [
                          {
                              "t": "ムは <i>mu</i> と読む",
                              "n": "ム si legge 'mu'"
                          },
                          {
                              "t": "<b>ム</b>ード = mood",
                              "n": "Prima lettera di 'mood' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_me",
                      "isLetter": true,
                      "letter": "メ",
                      "word": "メ",
                      "emoji": "🔤",
                      "phonetic": "/me/",
                      "translation": "Suono <b>me</b><br>Come la <i>'me'</i> italiana",
                      "mnemonic": "Sembra una 'v' con una linea in alto: pensa a <span class='hl'>'me'</span> come a una freccia verso l'alto.",
                      "examples": [
                          {
                              "t": "メは <i>me</i> と読む",
                              "n": "メ si legge 'me'"
                          },
                          {
                              "t": "<b>メ</b>ニュー = menu",
                              "n": "Prima lettera di 'menu' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mo",
                      "isLetter": true,
                      "letter": "モ",
                      "word": "モ",
                      "emoji": "🔤",
                      "phonetic": "/mo/",
                      "translation": "Suono <b>mo</b><br>Come la <i>'mo'</i> italiana",
                      "mnemonic": "Sembra una 'm' con un cappello: pensa a <span class='hl'>'mo'</span> come a una 'm' con un tetto.",
                      "examples": [
                          {
                              "t": "モは <i>mo</i> と読む",
                              "n": "モ si legge 'mo'"
                          },
                          {
                              "t": "<b>モ</b>デル = model",
                              "n": "Prima lettera di 'model' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ya",
                      "isLetter": true,
                      "letter": "ヤ",
                      "word": "ヤ",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Suono <b>ya</b><br>Come la <i>'ya'</i> spagnola in 'yate'",
                      "mnemonic": "Sembra una 'y' maiuscola: pensa a <span class='hl'>'ya'</span> come a una 'y' con un braccio.",
                      "examples": [
                          {
                              "t": "ヤは <i>ya</i> と読む",
                              "n": "ヤ si legge 'ya'"
                          },
                          {
                              "t": "<b>ヤ</b>ード = yard",
                              "n": "Prima lettera di 'yard' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_yu",
                      "isLetter": true,
                      "letter": "ユ",
                      "word": "ユ",
                      "emoji": "🔤",
                      "phonetic": "/jɯ/",
                      "translation": "Suono <b>yu</b><br>Come la <i>'yu'</i> spagnola in 'yuca'",
                      "mnemonic": "Sembra una 'u' con un gancio: pensa a <span class='hl'>'yu'</span> come a una 'u' che ha perso la gamba sinistra.",
                      "examples": [
                          {
                              "t": "ユは <i>yu</i> と読む",
                              "n": "ユ si legge 'yu'"
                          },
                          {
                              "t": "<b>ユ</b>ーモア = humor",
                              "n": "Prima lettera di 'humor' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_yo",
                      "isLetter": true,
                      "letter": "ヨ",
                      "word": "ヨ",
                      "emoji": "🔤",
                      "phonetic": "/jo/",
                      "translation": "Suono <b>yo</b><br>Come la <i>'yo'</i> spagnola in 'yo'",
                      "mnemonic": "Sembra una 'E' rovesciata: pensa a <span class='hl'>'yo'</span> come a una 'E' che si è girata.",
                      "examples": [
                          {
                              "t": "ヨは <i>yo</i> と読む",
                              "n": "ヨ si legge 'yo'"
                          },
                          {
                              "t": "<b>ヨ</b>ーグルト = yogurt",
                              "n": "Prima lettera di 'yogurt' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ra",
                      "isLetter": true,
                      "letter": "ラ",
                      "word": "ラ",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "Suono <b>ra</b><br>Come la <i>'ra'</i> italiana ma con la 'r' monovibrante",
                      "mnemonic": "Sembra una 'r' maiuscola con un gancio: pensa a <span class='hl'>'ra'</span> come a una 'r' stilizzata.",
                      "examples": [
                          {
                              "t": "ラは <i>ra</i> と読む",
                              "n": "ラ si legge 'ra'"
                          },
                          {
                              "t": "<b>ラ</b>ジオ = radio",
                              "n": "Prima lettera di 'radio' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ri",
                      "isLetter": true,
                      "letter": "リ",
                      "word": "リ",
                      "emoji": "🔤",
                      "phonetic": "/ɾi/",
                      "translation": "Suono <b>ri</b><br>Come la <i>'ri'</i> italiana ma con la 'r' monovibrante",
                      "mnemonic": "Sembra due linee verticali: pensa a <span class='hl'>'ri'</span> come a due bastoncini.",
                      "examples": [
                          {
                              "t": "リは <i>ri</i> と読む",
                              "n": "リ si legge 'ri'"
                          },
                          {
                              "t": "<b>リ</b>スト = list",
                              "n": "Prima lettera di 'list' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ru",
                      "isLetter": true,
                      "letter": "ル",
                      "word": "ル",
                      "emoji": "🔤",
                      "phonetic": "/ɾɯ/",
                      "translation": "Suono <b>ru</b><br>Come la <i>'ru'</i> italiana ma con la 'r' monovibrante",
                      "mnemonic": "Sembra una 'v' con una linea in basso: pensa a <span class='hl'>'ru'</span> come a una 'v' con un piede.",
                      "examples": [
                          {
                              "t": "ルは <i>ru</i> と読む",
                              "n": "ル si legge 'ru'"
                          },
                          {
                              "t": "<b>ル</b>ール = rule",
                              "n": "Prima lettera di 'rule' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_re",
                      "isLetter": true,
                      "letter": "レ",
                      "word": "レ",
                      "emoji": "🔤",
                      "phonetic": "/ɾe/",
                      "translation": "Suono <b>re</b><br>Come la <i>'re'</i> italiana ma con la 'r' monovibrante",
                      "mnemonic": "Sembra una 'v' con un gancio in basso: pensa a <span class='hl'>'re'</span> come a una 'v' che si piega.",
                      "examples": [
                          {
                              "t": "レは <i>re</i> と読む",
                              "n": "レ si legge 're'"
                          },
                          {
                              "t": "<b>レ</b>モン = lemon",
                              "n": "Prima lettera di 'lemon' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ro",
                      "isLetter": true,
                      "letter": "ロ",
                      "word": "ロ",
                      "emoji": "🔤",
                      "phonetic": "/ɾo/",
                      "translation": "Suono <b>ro</b><br>Come la <i>'ro'</i> italiana ma con la 'r' monovibrante",
                      "mnemonic": "Sembra un quadrato: pensa a <span class='hl'>'ro'</span> come a una scatola quadrata.",
                      "examples": [
                          {
                              "t": "ロは <i>ro</i> と読む",
                              "n": "ロ si legge 'ro'"
                          },
                          {
                              "t": "<b>ロ</b>ボット = robot",
                              "n": "Prima lettera di 'robot' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wa",
                      "isLetter": true,
                      "letter": "ワ",
                      "word": "ワ",
                      "emoji": "🔤",
                      "phonetic": "/ɰa/",
                      "translation": "Suono <b>wa</b><br>Come la <i>'ua'</i> in spagnolo 'agua'",
                      "mnemonic": "Sembra una 'v' con un tetto: pensa a <span class='hl'>'wa'</span> come a una 'v' che ha un cappello.",
                      "examples": [
                          {
                              "t": "ワは <i>wa</i> と読む",
                              "n": "ワ si legge 'wa'"
                          },
                          {
                              "t": "<b>ワ</b>イン = wine",
                              "n": "Prima lettera di 'wine' in giapponese"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wo",
                      "isLetter": true,
                      "letter": "ヲ",
                      "word": "ヲ",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Suono <b>wo</b> (ma si pronuncia <i>o</i>)<br>Particella grammaticale, non usata in parole comuni",
                      "mnemonic": "Sembra una 'v' con un gancio e una linea: pensa a <span class='hl'>'wo'</span> come a una 'v' che si è rotta.",
                      "examples": [
                          {
                              "t": "ヲ è una particella, si pronuncia <i>o</i>",
                              "n": "ヲ è una particella, si pronuncia 'o'"
                          },
                          {
                              "t": "Non usata in parole comuni",
                              "n": "Non usata in parole comuni"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_n",
                      "isLetter": true,
                      "letter": "ン",
                      "word": "ン",
                      "emoji": "🔤",
                      "phonetic": "/ɴ/",
                      "translation": "Suono <b>n</b> (nasale)<br>Come la <i>'n'</i> in 'canzone' ma più chiusa",
                      "mnemonic": "Sembra un'onda: pensa a <span class='hl'>'n'</span> come a una linea ondulata.",
                      "examples": [
                          {
                              "t": "ン è una consonante nasale",
                              "n": "ン è una consonante nasale"
                          },
                          {
                              "t": "<b>ン</b> è spesso alla fine di parole",
                              "n": "ン è spesso alla fine di parole"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_cho-on",
                      "isLetter": true,
                      "letter": "ー",
                      "word": "ー",
                      "emoji": "🔤",
                      "phonetic": "/ː/",
                      "translation": "Segno di allungamento vocale<br>Allunga la vocale precedente",
                      "mnemonic": "Sembra un trattino: pensa a <span class='hl'>'ー'</span> come a un elastico che allunga il suono.",
                      "examples": [
                          {
                              "t": "コーヒー = <i>kōhī</i> (caffè)",
                              "n": "La linea allunga la 'o' e la 'i'"
                          },
                          {
                              "t": "ケーキ = <i>kēki</i> (torta)",
                              "n": "La linea allunga la 'e'"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_01",
                      "isLetter": false,
                      "letter": "ホ",
                      "word": "ホテル",
                      "emoji": "🏨",
                      "phonetic": "/hoteɾɯ/",
                      "translation": "Hotel",
                      "translations": {
                          "ja": "ホテル",
                          "it": "Hotel",
                          "en": "Hotel"
                      },
                      "examples": [
                          {
                              "t": "この<b>ホテル</b>は大きいです",
                              "n": "Questo hotel è grande"
                          },
                          {
                              "t": "<b>ホテル</b>に泊まります",
                              "n": "Alloggio in un hotel"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_02",
                      "isLetter": false,
                      "letter": "レ",
                      "word": "レストラン",
                      "emoji": "🍽️",
                      "phonetic": "/ɾesɯtoɾaɴ/",
                      "translation": "Ristorante",
                      "translations": {
                          "ja": "レストラン",
                          "it": "Ristorante",
                          "en": "Restaurant"
                      },
                      "examples": [
                          {
                              "t": "あの<b>レストラン</b>は美味しいです",
                              "n": "Quel ristorante è buono"
                          },
                          {
                              "t": "<b>レストラン</b>で昼ご飯を食べます",
                              "n": "Mangio il pranzo al ristorante"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_03",
                      "isLetter": false,
                      "letter": "パ",
                      "word": "パスポート",
                      "emoji": "🛂",
                      "phonetic": "/pasɯpoːto/",
                      "translation": "Passaporto",
                      "translations": {
                          "ja": "パスポート",
                          "it": "Passaporto",
                          "en": "Passport"
                      },
                      "examples": [
                          {
                              "t": "<b>パスポート</b>を見せてください",
                              "n": "Per favore, mostri il passaporto"
                          },
                          {
                              "t": "<b>パスポート</b>を忘れました",
                              "n": "Ho dimenticato il passaporto"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_04",
                      "isLetter": false,
                      "letter": "ス",
                      "word": "スマートフォン",
                      "emoji": "📱",
                      "phonetic": "/sɯmaːtoɸoɴ/",
                      "translation": "Smartphone",
                      "translations": {
                          "ja": "スマートフォン",
                          "it": "Smartphone",
                          "en": "Smartphone"
                      },
                      "examples": [
                          {
                              "t": "<b>スマートフォン</b>を買いました",
                              "n": "Ho comprato uno smartphone"
                          },
                          {
                              "t": "<b>スマートフォン</b>で写真を撮ります",
                              "n": "Faccio foto con lo smartphone"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_05",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コンピューター",
                      "emoji": "💻",
                      "phonetic": "/koɴpjuːtaː/",
                      "translation": "Computer",
                      "translations": {
                          "ja": "コンピューター",
                          "it": "Computer",
                          "en": "Computer"
                      },
                      "examples": [
                          {
                              "t": "<b>コンピューター</b>で仕事をします",
                              "n": "Lavoro con il computer"
                          },
                          {
                              "t": "新しい<b>コンピューター</b>が欲しい",
                              "n": "Voglio un nuovo computer"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_06",
                      "isLetter": false,
                      "letter": "バ",
                      "word": "バス",
                      "emoji": "🚌",
                      "phonetic": "/basɯ/",
                      "translation": "Autobus",
                      "translations": {
                          "ja": "バス",
                          "it": "Autobus",
                          "en": "Bus"
                      },
                      "examples": [
                          {
                              "t": "<b>バス</b>で学校に行きます",
                              "n": "Vado a scuola in autobus"
                          },
                          {
                              "t": "次の<b>バス</b>は何時ですか",
                              "n": "A che ora è il prossimo autobus?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_07",
                      "isLetter": false,
                      "letter": "ビ",
                      "word": "ビール",
                      "emoji": "🍺",
                      "phonetic": "/biːɾɯ/",
                      "translation": "Birra",
                      "translations": {
                          "ja": "ビール",
                          "it": "Birra",
                          "en": "Beer"
                      },
                      "examples": [
                          {
                              "t": "<b>ビール</b>を一杯ください",
                              "n": "Una birra, per favore"
                          },
                          {
                              "t": "冷たい<b>ビール</b>が好きです",
                              "n": "Mi piace la birra fredda"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_08",
                      "isLetter": false,
                      "letter": "チ",
                      "word": "チョコレート",
                      "emoji": "🍫",
                      "phonetic": "/tɕokoɾeːto/",
                      "translation": "Cioccolato",
                      "translations": {
                          "ja": "チョコレート",
                          "it": "Cioccolato",
                          "en": "Chocolate"
                      },
                      "examples": [
                          {
                              "t": "<b>チョコレート</b>を食べます",
                              "n": "Mangio cioccolato"
                          },
                          {
                              "t": "<b>チョコレート</b>ケーキが好きです",
                              "n": "Mi piace la torta al cioccolato"
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g5",
              "name": "Primeros Kanji",
              "icon": "漢",
              "color": "#8b5cf6",
              "description": "日 月 火 水 木 金 土 + números + personas",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3",
                  "ja_a0_g4"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g5_L_ichi",
                      "isLetter": true,
                      "letter": "一",
                      "word": "一",
                      "emoji": "1️⃣",
                      "phonetic": "/ichi/",
                      "translation": "Uno — <b>一</b> è un tratto orizzontale: <i>uno</i> come una linea.",
                      "mnemonic": "Un solo tratto orizzontale = il numero uno, come un bastone per terra.",
                      "examples": [
                          {
                              "t": "<b>一</b> = uno<br>Un tratto solo",
                              "n": "Il kanji più semplice: una linea orizzontale."
                          },
                          {
                              "t": "ichi, ni, san…",
                              "n": "Si conta iniziando da ichi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ni",
                      "isLetter": true,
                      "letter": "二",
                      "word": "二",
                      "emoji": "2️⃣",
                      "phonetic": "/ni/",
                      "translation": "Due — <b>二</b> sono <i>due</i> linee parallele.",
                      "mnemonic": "Due tratti orizzontali = due linee, come due dita.",
                      "examples": [
                          {
                              "t": "<b>二</b> = due<br>Due linee",
                              "n": "Due tratti orizzontali."
                          },
                          {
                              "t": "ni = due",
                              "n": "Pronuncia on: ni."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_san",
                      "isLetter": true,
                      "letter": "三",
                      "word": "三",
                      "emoji": "3️⃣",
                      "phonetic": "/san/",
                      "translation": "Tre — <b>三</b> sono <i>tre</i> linee orizzontali.",
                      "mnemonic": "Tre tratti = tre linee, come un trespolo.",
                      "examples": [
                          {
                              "t": "<b>三</b> = tre<br>Tre linee",
                              "n": "Tre tratti orizzontali."
                          },
                          {
                              "t": "san = tre",
                              "n": "Pronuncia on: san."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shi",
                      "isLetter": true,
                      "letter": "四",
                      "word": "四",
                      "emoji": "4️⃣",
                      "phonetic": "/shi/",
                      "translation": "Quattro — <b>四</b> sembra una <i>finestra</i> con dentro un quattro.",
                      "mnemonic": "Una finestra (口) con due gambe dentro: quattro.",
                      "examples": [
                          {
                              "t": "<b>四</b> = quattro",
                              "n": "La forma ricorda una finestra."
                          },
                          {
                              "t": "yon = quattro (uso comune)",
                              "n": "Shi è tabù (suona come morte)."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_go",
                      "isLetter": true,
                      "letter": "五",
                      "word": "五",
                      "emoji": "5️⃣",
                      "phonetic": "/go/",
                      "translation": "Cinque — <b>五</b> ha una linea in alto e un <i>cinque</i> nascosto.",
                      "mnemonic": "La linea in alto + il tratto centrale = 5.",
                      "examples": [
                          {
                              "t": "<b>五</b> = cinque",
                              "n": "La forma ricorda un 5."
                          },
                          {
                              "t": "go = cinque",
                              "n": "Pronuncia on: go."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_roku",
                      "isLetter": true,
                      "letter": "六",
                      "word": "六",
                      "emoji": "6️⃣",
                      "phonetic": "/roku/",
                      "translation": "Sei — <b>六</b> sembra una <i>tenda</i> aperta.",
                      "mnemonic": "Due tratti che si incrociano in alto = una tenda.",
                      "examples": [
                          {
                              "t": "<b>六</b> = sei",
                              "n": "Forma di tenda."
                          },
                          {
                              "t": "roku = sei",
                              "n": "Pronuncia on: roku."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shichi",
                      "isLetter": true,
                      "letter": "七",
                      "word": "七",
                      "emoji": "7️⃣",
                      "phonetic": "/shichi/",
                      "translation": "Sette — <b>七</b> è una <i>croce</i> con un taglio.",
                      "mnemonic": "Un tratto orizzontale e uno verticale che si incrociano.",
                      "examples": [
                          {
                              "t": "<b>七</b> = sette",
                              "n": "Sembra una croce."
                          },
                          {
                              "t": "nana = sette (uso comune)",
                              "n": "Shichi è più formale."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hachi",
                      "isLetter": true,
                      "letter": "八",
                      "word": "八",
                      "emoji": "8️⃣",
                      "phonetic": "/hachi/",
                      "translation": "Otto — <b>八</b> sembra un <i>ombrello</i> aperto.",
                      "mnemonic": "Due tratti che si aprono in basso = ombrello.",
                      "examples": [
                          {
                              "t": "<b>八</b> = otto",
                              "n": "Forma di ombrello."
                          },
                          {
                              "t": "hachi = otto",
                              "n": "Pronuncia on: hachi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kyuu",
                      "isLetter": true,
                      "letter": "九",
                      "word": "九",
                      "emoji": "9️⃣",
                      "phonetic": "/kyuu/",
                      "translation": "Nove — <b>九</b> sembra un <i>gancio</i> o un <i>nove</i> stilizzato.",
                      "mnemonic": "Il tratto curvo in basso = un gancio.",
                      "examples": [
                          {
                              "t": "<b>九</b> = nove",
                              "n": "Forma di gancio."
                          },
                          {
                              "t": "kyuu = nove",
                              "n": "Pronuncia on: kyuu."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_juu",
                      "isLetter": true,
                      "letter": "十",
                      "word": "十",
                      "emoji": "🔟",
                      "phonetic": "/juu/",
                      "translation": "Dieci — <b>十</b> è una <i>croce</i>: dieci come una croce.",
                      "mnemonic": "Una croce = dieci, come le due linee che si incrociano.",
                      "examples": [
                          {
                              "t": "<b>十</b> = dieci",
                              "n": "Una croce."
                          },
                          {
                              "t": "juu = dieci",
                              "n": "Pronuncia on: juu."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_nichi",
                      "isLetter": true,
                      "letter": "日",
                      "word": "日",
                      "emoji": "☀️",
                      "phonetic": "/nichi/",
                      "translation": "Sole/giorno — <b>日</b> è un <i>sole</i> con un raggio centrale.",
                      "mnemonic": "Un rettangolo con una linea in mezzo = il sole con un raggio.",
                      "examples": [
                          {
                              "t": "<b>日</b> = sole, giorno",
                              "n": "Il kanji del sole."
                          },
                          {
                              "t": "nichi = giorno",
                              "n": "Pronuncia on: nichi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_gatsu",
                      "isLetter": true,
                      "letter": "月",
                      "word": "月",
                      "emoji": "🌙",
                      "phonetic": "/gatsu/",
                      "translation": "Luna/mese — <b>月</b> è una <i>luna crescente</i> con due tratti.",
                      "mnemonic": "La forma curva = la luna; i due tratti = le fasi.",
                      "examples": [
                          {
                              "t": "<b>月</b> = luna, mese",
                              "n": "Il kanji della luna."
                          },
                          {
                              "t": "gatsu = mese",
                              "n": "Pronuncia on: gatsu."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ka",
                      "isLetter": true,
                      "letter": "火",
                      "word": "火",
                      "emoji": "🔥",
                      "phonetic": "/ka/",
                      "translation": "Fuoco — <b>火</b> sembra una <i>fiamma</i> con due braci.",
                      "mnemonic": "I tratti laterali = fiamme che si alzano.",
                      "examples": [
                          {
                              "t": "<b>火</b> = fuoco",
                              "n": "Il kanji del fuoco."
                          },
                          {
                              "t": "ka = fuoco",
                              "n": "Pronuncia on: ka."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_sui",
                      "isLetter": true,
                      "letter": "水",
                      "word": "水",
                      "emoji": "💧",
                      "phonetic": "/sui/",
                      "translation": "Acqua — <b>水</b> sembra <i>gocce</i> che cadono.",
                      "mnemonic": "Il tratto centrale = un ruscello, i tratti laterali = gocce.",
                      "examples": [
                          {
                              "t": "<b>水</b> = acqua",
                              "n": "Il kanji dell'acqua."
                          },
                          {
                              "t": "sui = acqua",
                              "n": "Pronuncia on: sui."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_moku",
                      "isLetter": true,
                      "letter": "木",
                      "word": "木",
                      "emoji": "🌳",
                      "phonetic": "/moku/",
                      "translation": "Albero — <b>木</b> è un <i>albero</i> con rami e radici.",
                      "mnemonic": "Il tratto verticale = tronco, i tratti laterali = rami.",
                      "examples": [
                          {
                              "t": "<b>木</b> = albero",
                              "n": "Il kanji dell'albero."
                          },
                          {
                              "t": "moku = albero",
                              "n": "Pronuncia on: moku."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kin",
                      "isLetter": true,
                      "letter": "金",
                      "word": "金",
                      "emoji": "🪙",
                      "phonetic": "/kin/",
                      "translation": "Oro — <b>金</b> ha una <i>copertura</i> sopra e punti sotto.",
                      "mnemonic": "La parte in alto = un tetto, i punti = pepite d'oro.",
                      "examples": [
                          {
                              "t": "<b>金</b> = oro",
                              "n": "Il kanji dell'oro."
                          },
                          {
                              "t": "kin = oro",
                              "n": "Pronuncia on: kin."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_do",
                      "isLetter": true,
                      "letter": "土",
                      "word": "土",
                      "emoji": "🌍",
                      "phonetic": "/do/",
                      "translation": "Terra — <b>土</b> è una <i>collina</i> con una linea in basso.",
                      "mnemonic": "Il tratto verticale = una pianta, la linea = il terreno.",
                      "examples": [
                          {
                              "t": "<b>土</b> = terra",
                              "n": "Il kanji della terra."
                          },
                          {
                              "t": "do = terra",
                              "n": "Pronuncia on: do."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hito",
                      "isLetter": true,
                      "letter": "人",
                      "word": "人",
                      "emoji": "🚶",
                      "phonetic": "/hito/",
                      "translation": "Persona — <b>人</b> sembra una <i>persona</i> che cammina.",
                      "mnemonic": "Due tratti che si aprono = gambe di una persona.",
                      "examples": [
                          {
                              "t": "<b>人</b> = persona",
                              "n": "Il kanji della persona."
                          },
                          {
                              "t": "jin = persona",
                              "n": "Pronuncia on: jin."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_yama",
                      "isLetter": true,
                      "letter": "山",
                      "word": "山",
                      "emoji": "⛰️",
                      "phonetic": "/yama/",
                      "translation": "Montagna — <b>山</b> è una <i>montagna</i> con tre picchi.",
                      "mnemonic": "Tre tratti verticali = tre cime di una montagna.",
                      "examples": [
                          {
                              "t": "<b>山</b> = montagna",
                              "n": "Il kanji della montagna."
                          },
                          {
                              "t": "san = montagna",
                              "n": "Pronuncia on: san."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kawa",
                      "isLetter": true,
                      "letter": "川",
                      "word": "川",
                      "emoji": "🏞️",
                      "phonetic": "/kawa/",
                      "translation": "Fiume — <b>川</b> sono <i>tre linee</i> che scorrono.",
                      "mnemonic": "Tre tratti verticali = un fiume che scorre.",
                      "examples": [
                          {
                              "t": "<b>川</b> = fiume",
                              "n": "Il kanji del fiume."
                          },
                          {
                              "t": "kawa = fiume",
                              "n": "Pronuncia kun: kawa."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_dai",
                      "isLetter": true,
                      "letter": "大",
                      "word": "大",
                      "emoji": "🐘",
                      "phonetic": "/dai/",
                      "translation": "Grande — <b>大</b> è una <i>persona</i> con le braccia aperte.",
                      "mnemonic": "Una persona con le braccia spalancate = grande.",
                      "examples": [
                          {
                              "t": "<b>大</b> = grande",
                              "n": "Il kanji di grande."
                          },
                          {
                              "t": "dai = grande",
                              "n": "Pronuncia on: dai."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shou",
                      "isLetter": true,
                      "letter": "小",
                      "word": "小",
                      "emoji": "🐜",
                      "phonetic": "/shou/",
                      "translation": "Piccolo — <b>小</b> è una <i>persona</i> con le braccia in giù.",
                      "mnemonic": "Una persona piccola con le braccia abbassate.",
                      "examples": [
                          {
                              "t": "<b>小</b> = piccolo",
                              "n": "Il kanji di piccolo."
                          },
                          {
                              "t": "ko = piccolo",
                              "n": "Pronuncia kun: ko."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_01",
                      "letter": "一",
                      "word": "一つ",
                      "emoji": "1️⃣",
                      "phonetic": "/hitotsu/",
                      "translation": "Uno (cosa) — <b>一つ</b> = una cosa.",
                      "translations": {
                          "ja": "一つ",
                          "it": "Uno (cosa)",
                          "en": "One thing"
                      },
                      "examples": [
                          {
                              "t": "<b>一つ</b>ください。",
                              "n": "Uno, per favore."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_02",
                      "letter": "日",
                      "word": "日曜日",
                      "emoji": "📅",
                      "phonetic": "/nichiyoubi/",
                      "translation": "Domenica — <b>日</b>曜日 = giorno del sole.",
                      "translations": {
                          "ja": "日曜日",
                          "it": "Domenica",
                          "en": "Sunday"
                      },
                      "examples": [
                          {
                              "t": "<b>日曜日</b>に会いましょう。",
                              "n": "Incontriamoci domenica."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_03",
                      "letter": "月",
                      "word": "月曜日",
                      "emoji": "📅",
                      "phonetic": "/getsuyoubi/",
                      "translation": "Lunedì — <b>月</b>曜日 = giorno della luna.",
                      "translations": {
                          "ja": "月曜日",
                          "it": "Lunedì",
                          "en": "Monday"
                      },
                      "examples": [
                          {
                              "t": "<b>月曜日</b>に働きます。",
                              "n": "Lunedì lavoro."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_04",
                      "letter": "火",
                      "word": "火曜日",
                      "emoji": "📅",
                      "phonetic": "/kayoubi/",
                      "translation": "Martedì — <b>火</b>曜日 = giorno del fuoco.",
                      "translations": {
                          "ja": "火曜日",
                          "it": "Martedì",
                          "en": "Tuesday"
                      },
                      "examples": [
                          {
                              "t": "<b>火曜日</b>に日本語を勉強します。",
                              "n": "Martedì studio giapponese."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_05",
                      "letter": "水",
                      "word": "水曜日",
                      "emoji": "📅",
                      "phonetic": "/suiyoubi/",
                      "translation": "Mercoledì — <b>水</b>曜日 = giorno dell'acqua.",
                      "translations": {
                          "ja": "水曜日",
                          "it": "Mercoledì",
                          "en": "Wednesday"
                      },
                      "examples": [
                          {
                              "t": "<b>水曜日</b>に泳ぎます。",
                              "n": "Mercoledì nuoto."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_06",
                      "letter": "木",
                      "word": "木曜日",
                      "emoji": "📅",
                      "phonetic": "/mokuyoubi/",
                      "translation": "Giovedì — <b>木</b>曜日 = giorno dell'albero.",
                      "translations": {
                          "ja": "木曜日",
                          "it": "Giovedì",
                          "en": "Thursday"
                      },
                      "examples": [
                          {
                              "t": "<b>木曜日</b>に映画を見ます。",
                              "n": "Giovedì guardo un film."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_07",
                      "letter": "金",
                      "word": "金曜日",
                      "emoji": "📅",
                      "phonetic": "/kinyoubi/",
                      "translation": "Venerdì — <b>金</b>曜日 = giorno dell'oro.",
                      "translations": {
                          "ja": "金曜日",
                          "it": "Venerdì",
                          "en": "Friday"
                      },
                      "examples": [
                          {
                              "t": "<b>金曜日</b>にパーティーがあります。",
                              "n": "Venerdì c'è una festa."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_08",
                      "letter": "土",
                      "word": "土曜日",
                      "emoji": "📅",
                      "phonetic": "/doyoubi/",
                      "translation": "Sabato — <b>土</b>曜日 = giorno della terra.",
                      "translations": {
                          "ja": "土曜日",
                          "it": "Sabato",
                          "en": "Saturday"
                      },
                      "examples": [
                          {
                              "t": "<b>土曜日</b>に休みます。",
                              "n": "Sabato riposo."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_09",
                      "letter": "人",
                      "word": "日本人",
                      "emoji": "🗾",
                      "phonetic": "/nihonjin/",
                      "translation": "Giapponese (persona) — <b>人</b> = persona.",
                      "translations": {
                          "ja": "日本人",
                          "it": "Giapponese (persona)",
                          "en": "Japanese person"
                      },
                      "examples": [
                          {
                              "t": "私は<b>日本人</b>です。",
                              "n": "Sono giapponese."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_10",
                      "letter": "山",
                      "word": "富士山",
                      "emoji": "🗻",
                      "phonetic": "/fujisan/",
                      "translation": "Monte Fuji — <b>山</b> = montagna.",
                      "translations": {
                          "ja": "富士山",
                          "it": "Monte Fuji",
                          "en": "Mount Fuji"
                      },
                      "examples": [
                          {
                              "t": "<b>富士山</b>は高いです。",
                              "n": "Il Monte Fuji è alto."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_11",
                      "letter": "川",
                      "word": "川",
                      "emoji": "🏞️",
                      "phonetic": "/kawa/",
                      "translation": "Fiume — <b>川</b> = fiume.",
                      "translations": {
                          "ja": "川",
                          "it": "Fiume",
                          "en": "River"
                      },
                      "examples": [
                          {
                              "t": "<b>川</b>がきれいです。",
                              "n": "Il fiume è pulito."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_12",
                      "letter": "大",
                      "word": "大きい",
                      "emoji": "🐘",
                      "phonetic": "/ookii/",
                      "translation": "Grande — <b>大</b>きい = grande.",
                      "translations": {
                          "ja": "大きい",
                          "it": "Grande",
                          "en": "Big"
                      },
                      "examples": [
                          {
                              "t": "これは<b>大きい</b>犬です。",
                              "n": "Questo è un cane grande."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_13",
                      "letter": "小",
                      "word": "小さい",
                      "emoji": "🐜",
                      "phonetic": "/chiisai/",
                      "translation": "Piccolo — <b>小</b>さい = piccolo.",
                      "translations": {
                          "ja": "小さい",
                          "it": "Piccolo",
                          "en": "Small"
                      },
                      "examples": [
                          {
                              "t": "これは<b>小さい</b>猫です。",
                              "n": "Questo è un gatto piccolo."
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // COREANO
  // ──────────────────────────────────────────────────────
  ko: {
      "level": "A0",
      "levelName": "El Hangul",
      "groups": [
          {
              "id": "ko_a0_g1",
              "name": "Vocales básicas",
              "icon": "🔤",
              "color": "#6366f1",
              "description": "ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ ㅐ ㅔ — las 8 vocales simples",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ko_a0_g1_L_a",
                      "isLetter": true,
                      "letter": "ㅏ",
                      "word": "ㅏ",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "Vocal <b>ㅏ</b> — suena como la <i>A</i> del español en <i>\"casa\"</i>.<br>Se dibuja: línea vertical a la izquierda, línea corta a la derecha.",
                      "mnemonic": "Parece una persona con el brazo derecho levantado diciendo ¡A!",
                      "examples": [
                          {
                              "t": "<b>아</b>버지 — padre<br>나 — yo",
                              "n": "La ㅏ suena fuerte y clara, como en español."
                          },
                          {
                              "t": "아 — sí (informal)",
                              "n": "Primera sílaba con ㅇ (muda) + ㅏ."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_eo",
                      "isLetter": true,
                      "letter": "ㅓ",
                      "word": "ㅓ",
                      "emoji": "🔤",
                      "phonetic": "/ʌ/",
                      "translation": "Vocal <b>ㅓ</b> — sonido intermedio entre <i>A</i> y <i>O</i>, como la <i>A</i> inglesa en <i>\"about\"</i>.<br>Se dibuja: línea vertical a la derecha, línea corta a la izquierda.",
                      "mnemonic": "Es como la ㅏ pero <span class=\"hl\">al revés</span> — el brazo apunta al lado opuesto, sonido más oscuro.",
                      "examples": [
                          {
                              "t": "<b>어</b>머니 — madre<br>어디 — ¿dónde?",
                              "n": "La ㅓ es más relajada que la ㅏ."
                          },
                          {
                              "t": "어 — uh (muletilla)",
                              "n": "Sonido gutural corto."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_o",
                      "isLetter": true,
                      "letter": "ㅗ",
                      "word": "ㅗ",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Vocal <b>ㅗ</b> — suena como la <i>O</i> del español en <i>\"sol\"</i>.<br>Se dibuja: línea horizontal arriba, línea vertical hacia arriba.",
                      "mnemonic": "Parece una bandera ondeando hacia arriba — la O se eleva.",
                      "examples": [
                          {
                              "t": "<b>오</b>다 — venir<br>소 — vaca<br>보다 — ver",
                              "n": "La ㅗ es redonda y firme."
                          },
                          {
                              "t": "오 — cinco",
                              "n": "Mismo sonido que el número 5."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_u",
                      "isLetter": true,
                      "letter": "ㅜ",
                      "word": "ㅜ",
                      "emoji": "🔤",
                      "phonetic": "/u/",
                      "translation": "Vocal <b>ㅜ</b> — suena como la <i>U</i> del español en <i>\"luna\"</i>.<br>Se dibuja: línea horizontal abajo, línea vertical hacia abajo.",
                      "mnemonic": "Es como la ㅗ <span class=\"hl\">boca abajo</span> — la U se hunde hacia el suelo.",
                      "examples": [
                          {
                              "t": "<b>우</b>리 — nosotros/nuestro<br>물 — agua<br>두 — dos",
                              "n": "La ㅜ es profunda y redondeada."
                          },
                          {
                              "t": "우 — u (sonido)",
                              "n": "Labios redondeados, como en español."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_eu",
                      "isLetter": true,
                      "letter": "ㅡ",
                      "word": "ㅡ",
                      "emoji": "🔤",
                      "phonetic": "/ɯ/",
                      "translation": "Vocal <b>ㅡ</b> — no existe en español. Suena como una <i>U</i> sin redondear los labios, con la lengua atrás.<br>Se dibuja: una sola línea horizontal.",
                      "mnemonic": "Una línea recta y plana — <span class=\"hl\">sin emoción</span>, sonido neutro y relajado.",
                      "examples": [
                          {
                              "t": "<b>으</b>로 — hacia/por<br>음식 — comida",
                              "n": "La ㅡ es la vocal más \"vacía\" del coreano."
                          },
                          {
                              "t": "크 — grande (기본형: 크다)",
                              "n": "Se siente como un suspiro."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_i",
                      "isLetter": true,
                      "letter": "ㅣ",
                      "word": "ㅣ",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "Vocal <b>ㅣ</b> — suena como la <i>I</i> del español en <i>\"sí\"</i>.<br>Se dibuja: una sola línea vertical.",
                      "mnemonic": "Un palo recto y delgado — como la <i>I</i> latina, sonido agudo y claro.",
                      "examples": [
                          {
                              "t": "<b>이</b>름 — nombre<br>시 — ciudad/hora<br>미 — belleza",
                              "n": "La ㅣ es la vocal más simple de escribir."
                          },
                          {
                              "t": "이 — este/esto",
                              "n": "Se usa muchísimo en conversación."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_ae",
                      "isLetter": true,
                      "letter": "ㅐ",
                      "word": "ㅐ",
                      "emoji": "🔤",
                      "phonetic": "/ɛ/",
                      "translation": "Vocal <b>ㅐ</b> — suena como la <i>E</i> del español en <i>\"perro\"</i>, pero más abierta.<br>Se dibuja: ㅏ + línea horizontal extra (como una ㅏ con un sombrero).",
                      "mnemonic": "Es una <b>ㅏ</b> con <span class=\"hl\">gorro</span> — el sonido se abre más, como una A que se convierte en E.",
                      "examples": [
                          {
                              "t": "<b>애</b>기 — bebé<br>개 — perro<br>내 — mi",
                              "n": "La ㅐ es más abierta que la ㅔ."
                          },
                          {
                              "t": "애 — niño/a (raíz)",
                              "n": "Se ve en palabras como 애기 (bebé)."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_L_e",
                      "isLetter": true,
                      "letter": "ㅔ",
                      "word": "ㅔ",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "Vocal <b>ㅔ</b> — suena como la <i>É</i> del francés en <i>\"café\"</i>, más cerrada que ㅐ.<br>Se dibuja: ㅓ + línea horizontal extra (como una ㅓ con gorra).",
                      "mnemonic": "Es una <b>ㅓ</b> con <span class=\"hl\">gorro</span> — el sonido se cierra, de A hacia E.",
                      "examples": [
                          {
                              "t": "<b>에</b>서 — desde/en<br>세 — tres<br>네 — sí/cuatro",
                              "n": "La ㅔ es más cerrada y precisa."
                          },
                          {
                              "t": "에 — partícula de lugar",
                              "n": "Se usa para indicar dirección o ubicación."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_01",
                      "isLetter": false,
                      "letter": "ㅏ",
                      "word": "아버지",
                      "emoji": "👨",
                      "phonetic": "/a.bʌ.dʑi/",
                      "translation": "padre",
                      "translations": {
                          "ko": "아버지",
                          "es": "padre",
                          "en": "father"
                      },
                      "examples": [
                          {
                              "t": "제 <b>아버지</b>는 선생님입니다.",
                              "n": "Mi padre es profesor."
                          },
                          {
                              "t": "아버지, 안녕하세요!",
                              "n": "¡Hola, padre!"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_02",
                      "isLetter": false,
                      "letter": "ㅓ",
                      "word": "어머니",
                      "emoji": "👩",
                      "phonetic": "/ʌ.mʌ.ni/",
                      "translation": "madre",
                      "translations": {
                          "ko": "어머니",
                          "es": "madre",
                          "en": "mother"
                      },
                      "examples": [
                          {
                              "t": "우리 <b>어머니</b>는 요리를 잘해요.",
                              "n": "Mi madre cocina bien."
                          },
                          {
                              "t": "어머니, 뭐 하세요?",
                              "n": "¿Qué hace, madre?"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_03",
                      "isLetter": false,
                      "letter": "ㅗ",
                      "word": "오다",
                      "emoji": "🚶",
                      "phonetic": "/o.da/",
                      "translation": "venir",
                      "translations": {
                          "ko": "오다",
                          "es": "venir",
                          "en": "to come"
                      },
                      "examples": [
                          {
                              "t": "친구가 집에 <b>와요</b>.",
                              "n": "Mi amigo viene a casa."
                          },
                          {
                              "t": "저기요, <b>오세요</b>!",
                              "n": "¡Oiga, venga aquí!"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_04",
                      "isLetter": false,
                      "letter": "ㅜ",
                      "word": "물",
                      "emoji": "💧",
                      "phonetic": "/mul/",
                      "translation": "agua",
                      "translations": {
                          "ko": "물",
                          "es": "agua",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "저는 <b>물</b>을 마셔요.",
                              "n": "Yo bebo agua."
                          },
                          {
                              "t": "물이 너무 차가워요.",
                              "n": "El agua está muy fría."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_05",
                      "isLetter": false,
                      "letter": "ㅡ",
                      "word": "음식",
                      "emoji": "🍚",
                      "phonetic": "/ɯm.ɕik/",
                      "translation": "comida",
                      "translations": {
                          "ko": "음식",
                          "es": "comida",
                          "en": "food"
                      },
                      "examples": [
                          {
                              "t": "한국 <b>음식</b>이 맛있어요.",
                              "n": "La comida coreana es deliciosa."
                          },
                          {
                              "t": "음식을 많이 먹었어요.",
                              "n": "Comí mucha comida."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_06",
                      "isLetter": false,
                      "letter": "ㅣ",
                      "word": "이름",
                      "emoji": "📛",
                      "phonetic": "/i.rɯm/",
                      "translation": "nombre",
                      "translations": {
                          "ko": "이름",
                          "es": "nombre",
                          "en": "name"
                      },
                      "examples": [
                          {
                              "t": "제 <b>이름</b>은 후안이에요.",
                              "n": "Mi nombre es Juan."
                          },
                          {
                              "t": "이름이 뭐예요?",
                              "n": "¿Cómo te llamas?"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_07",
                      "isLetter": false,
                      "letter": "ㅐ",
                      "word": "개",
                      "emoji": "🐕",
                      "phonetic": "/kɛ/",
                      "translation": "perro",
                      "translations": {
                          "ko": "개",
                          "es": "perro",
                          "en": "dog"
                      },
                      "examples": [
                          {
                              "t": "우리 집에 <b>개</b>가 있어요.",
                              "n": "Tengo un perro en casa."
                          },
                          {
                              "t": "강아지가 귀여워요.",
                              "n": "El perrito es lindo."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g1_08",
                      "isLetter": false,
                      "letter": "ㅔ",
                      "word": "네",
                      "emoji": "✅",
                      "phonetic": "/ne/",
                      "translation": "sí / cuatro",
                      "translations": {
                          "ko": "네",
                          "es": "sí / cuatro",
                          "en": "yes / four"
                      },
                      "examples": [
                          {
                              "t": "<b>네</b>, 알겠어요.",
                              "n": "Sí, entendido."
                          },
                          {
                              "t": "사과 <b>네</b> 개 주세요.",
                              "n": "Dame cuatro manzanas."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ko_a0_g2",
              "name": "Consonantes básicas",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅎ",
              "reviewFrom": [
                  "ko_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ko_a0_g2_L_g",
                      "isLetter": true,
                      "letter": "ㄱ",
                      "word": "ㄱ",
                      "emoji": "🔤",
                      "phonetic": "/g~k/",
                      "translation": "Suena como <b>G</b> (suave) o <b>K</b> al final.<br>Se llama <i>giyeok</i>.",
                      "mnemonic": "Parece una pistola o una llave inglesa vista de lado.",
                      "examples": [
                          {
                              "t": "가 (ga) — <b>가</b> significa 'ir' o 'yo' (informal).",
                              "n": "Ejemplo de sílaba con ㄱ"
                          },
                          {
                              "t": "국 (guk) — <b>국</b> es 'sopa'.<br>고기 (gogi) — <b>고기</b> es 'carne'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_n",
                      "isLetter": true,
                      "letter": "ㄴ",
                      "word": "ㄴ",
                      "emoji": "🔤",
                      "phonetic": "/n/",
                      "translation": "Suena como <b>N</b> en español.<br>Se llama <i>nieun</i>.",
                      "mnemonic": "La forma se parece a una nariz (코) de perfil, y suena a 'n' de nariz.",
                      "examples": [
                          {
                              "t": "나 (na) — <b>나</b> significa 'yo'.",
                              "n": "Ejemplo de sílaba con ㄴ"
                          },
                          {
                              "t": "눈 (nun) — <b>눈</b> es 'ojo' o 'nieve'.<br>나라 (nara) — <b>나라</b> es 'país'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_d",
                      "isLetter": true,
                      "letter": "ㄷ",
                      "word": "ㄷ",
                      "emoji": "🔤",
                      "phonetic": "/d~t/",
                      "translation": "Suena como <b>D</b> (suave) o <b>T</b> al final.<br>Se llama <i>digeut</i>.",
                      "mnemonic": "Parece una puerta (문) abierta o un diente (이) de lado.",
                      "examples": [
                          {
                              "t": "도 (do) — <b>도</b> significa 'también'.",
                              "n": "Ejemplo de sílaba con ㄷ"
                          },
                          {
                              "t": "다 (da) — <b>다</b> significa 'todo'.<br>단어 (daneo) — <b>단어</b> es 'palabra'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_r",
                      "isLetter": true,
                      "letter": "ㄹ",
                      "word": "ㄹ",
                      "emoji": "🔤",
                      "phonetic": "/ɾ~l/",
                      "translation": "Suena como <b>R</b> suave (como en 'pero') o <b>L</b> al final.<br>Se llama <i>rieul</i>.",
                      "mnemonic": "Parece una escalera o un gancho, y suena entre r y l.",
                      "examples": [
                          {
                              "t": "라디오 (radio) — <b>라디오</b> es 'radio' (préstamo del inglés).",
                              "n": "Ejemplo de sílaba con ㄹ"
                          },
                          {
                              "t": "물 (mul) — <b>물</b> es 'agua'.<br>말 (mal) — <b>말</b> es 'idioma' o 'caballo'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_m",
                      "isLetter": true,
                      "letter": "ㅁ",
                      "word": "ㅁ",
                      "emoji": "🔤",
                      "phonetic": "/m/",
                      "translation": "Suena como <b>M</b> en español.<br>Se llama <i>mieum</i>.",
                      "mnemonic": "Parece una boca (입) cerrada o un rectángulo, y suena a 'm' de mamá.",
                      "examples": [
                          {
                              "t": "마 (ma) — <b>마</b> es una partícula (arcaica para 'yo').",
                              "n": "Ejemplo de sílaba con ㅁ"
                          },
                          {
                              "t": "물 (mul) — <b>물</b> es 'agua'.<br>마음 (maeum) — <b>마음</b> es 'corazón' o 'mente'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_b",
                      "isLetter": true,
                      "letter": "ㅂ",
                      "word": "ㅂ",
                      "emoji": "🔤",
                      "phonetic": "/b~p/",
                      "translation": "Suena como <b>B</b> (suave) o <b>P</b> al final.<br>Se llama <i>bieup</i>.",
                      "mnemonic": "Parece un cubo o una gorra (모자) vista de frente.",
                      "examples": [
                          {
                              "t": "바 (ba) — <b>바</b> es 'bar' (préstamo del inglés).",
                              "n": "Ejemplo de sílaba con ㅂ"
                          },
                          {
                              "t": "밥 (bap) — <b>밥</b> es 'arroz' o 'comida'.<br>배 (bae) — <b>배</b> es 'estómago', 'pera' o 'barco'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_s",
                      "isLetter": true,
                      "letter": "ㅅ",
                      "word": "ㅅ",
                      "emoji": "🔤",
                      "phonetic": "/s~ʃ/",
                      "translation": "Suena como <b>S</b> (como <b>SH</b> antes de 'i').<br>Se llama <i>siot</i>.",
                      "mnemonic": "Parece una montaña o un diente (이) de lado, y suena a 's' de sol.",
                      "examples": [
                          {
                              "t": "사람 (saram) — <b>사람</b> es 'persona'.",
                              "n": "Ejemplo de sílaba con ㅅ"
                          },
                          {
                              "t": "시간 (sigan) — <b>시간</b> es 'tiempo'.<br>수 (su) — <b>수</b> es 'número'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_ng",
                      "isLetter": true,
                      "letter": "ㅇ",
                      "word": "ㅇ",
                      "emoji": "🔤",
                      "phonetic": "/∅/ (inicial) o /ŋ/ (final)",
                      "translation": "Al inicio de sílaba es <b>mudo</b> (no suena).<br>Al final suena como <b>NG</b> (como en 'bang').<br>Se llama <i>ieung</i>.",
                      "mnemonic": "Parece un círculo (círculo = 원), y si está solo no suena, como un cero.",
                      "examples": [
                          {
                              "t": "아 (a) — <b>아</b> es '¡oh!' (exclamación).",
                              "n": "Ejemplo de sílaba con ㅇ mudo"
                          },
                          {
                              "t": "영어 (yeongeo) — <b>영어</b> es 'inglés'.<br>방 (bang) — <b>방</b> es 'habitación'.",
                              "n": "Ejemplos con ㅇ final (suena /ŋ/)"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_j",
                      "isLetter": true,
                      "letter": "ㅈ",
                      "word": "ㅈ",
                      "emoji": "🔤",
                      "phonetic": "/dʒ~tɕ/",
                      "translation": "Suena como <b>J</b> (como en 'jugo') o <b>CH</b> suave.<br>Se llama <i>jieut</i>.",
                      "mnemonic": "Parece una silla (의자) vista de lado, y suena a 'ch' de 'chico'.",
                      "examples": [
                          {
                              "t": "자 (ja) — <b>자</b> significa 'letra' o 'duerme' (imperativo).",
                              "n": "Ejemplo de sílaba con ㅈ"
                          },
                          {
                              "t": "저 (jeo) — <b>저</b> es 'yo' (formal).<br>주다 (juda) — <b>주다</b> es 'dar'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_L_h",
                      "isLetter": true,
                      "letter": "ㅎ",
                      "word": "ㅎ",
                      "emoji": "🔤",
                      "phonetic": "/h/",
                      "translation": "Suena como <b>H</b> aspirada (como en inglés 'hat').<br>Se llama <i>hieut</i>.",
                      "mnemonic": "Parece una persona con sombrero (모자) o un respiro, y suena a 'h' de 'hacer'.",
                      "examples": [
                          {
                              "t": "하다 (hada) — <b>하다</b> es 'hacer'.",
                              "n": "Ejemplo de sílaba con ㅎ"
                          },
                          {
                              "t": "학교 (hakgyo) — <b>학교</b> es 'escuela'.<br>한국 (hanguk) — <b>한국</b> es 'Corea'.",
                              "n": "Palabras comunes"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_01",
                      "isLetter": false,
                      "letter": "ㄱ",
                      "word": "가",
                      "emoji": "🚶",
                      "phonetic": "/ga/",
                      "translation": "ir (verbo)",
                      "translations": {
                          "ko": "가",
                          "es": "ir",
                          "en": "to go"
                      },
                      "examples": [
                          {
                              "t": "저는 <b>가</b>요. (jeoneun gayo)",
                              "n": "Yo voy."
                          },
                          {
                              "t": "학교에 <b>가</b>요. (hakgyoe gayo)",
                              "n": "Voy a la escuela."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_02",
                      "isLetter": false,
                      "letter": "ㄴ",
                      "word": "나",
                      "emoji": "🙋",
                      "phonetic": "/na/",
                      "translation": "yo (informal)",
                      "translations": {
                          "ko": "나",
                          "es": "yo",
                          "en": "I/me"
                      },
                      "examples": [
                          {
                              "t": "<b>나</b>는 학생이에요. (naneun haksaengieyo)",
                              "n": "Yo soy estudiante."
                          },
                          {
                              "t": "<b>나</b>도 좋아해요. (nado joahaeyo)",
                              "n": "A mí también me gusta."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_03",
                      "isLetter": false,
                      "letter": "ㄷ",
                      "word": "도",
                      "emoji": "➕",
                      "phonetic": "/do/",
                      "translation": "también",
                      "translations": {
                          "ko": "도",
                          "es": "también",
                          "en": "also"
                      },
                      "examples": [
                          {
                              "t": "저<b>도</b> 좋아해요. (jeodo joahaeyo)",
                              "n": "A mí también me gusta."
                          },
                          {
                              "t": "이것<b>도</b> 주세요. (igeotdo juseyo)",
                              "n": "Esto también, por favor."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_04",
                      "isLetter": false,
                      "letter": "ㄹ",
                      "word": "라디오",
                      "emoji": "📻",
                      "phonetic": "/ɾadio/",
                      "translation": "radio (préstamo del inglés)",
                      "translations": {
                          "ko": "라디오",
                          "es": "radio",
                          "en": "radio"
                      },
                      "examples": [
                          {
                              "t": "<b>라디오</b>를 들어요. (radioleul deureoyo)",
                              "n": "Escucho la radio."
                          },
                          {
                              "t": "<b>라디오</b>가 고장났어요. (radiola gojangnasseoyo)",
                              "n": "La radio está rota."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_05",
                      "isLetter": false,
                      "letter": "ㅁ",
                      "word": "마음",
                      "emoji": "❤️",
                      "phonetic": "/ma-eum/",
                      "translation": "corazón, mente",
                      "translations": {
                          "ko": "마음",
                          "es": "corazón, mente",
                          "en": "heart, mind"
                      },
                      "examples": [
                          {
                              "t": "<b>마음</b>이 좋아요. (maeumi joayo)",
                              "n": "Tiene buen corazón."
                          },
                          {
                              "t": "<b>마음</b>에 들어요. (maeume deureoyo)",
                              "n": "Me gusta (me agrada)."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_06",
                      "isLetter": false,
                      "letter": "ㅂ",
                      "word": "밥",
                      "emoji": "🍚",
                      "phonetic": "/bap/",
                      "translation": "arroz, comida",
                      "translations": {
                          "ko": "밥",
                          "es": "arroz, comida",
                          "en": "rice, meal"
                      },
                      "examples": [
                          {
                              "t": "<b>밥</b>을 먹어요. (babeul meogeoyo)",
                              "n": "Como arroz."
                          },
                          {
                              "t": "<b>밥</b> 먹었어요? (bap meogeosseoyo)",
                              "n": "¿Ya comiste?"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_07",
                      "isLetter": false,
                      "letter": "ㅅ",
                      "word": "사람",
                      "emoji": "👤",
                      "phonetic": "/saram/",
                      "translation": "persona",
                      "translations": {
                          "ko": "사람",
                          "es": "persona",
                          "en": "person"
                      },
                      "examples": [
                          {
                              "t": "이 <b>사람</b>은 친구예요. (i sarameun chinguyeyo)",
                              "n": "Esta persona es mi amigo."
                          },
                          {
                              "t": "<b>사람</b>이 많아요. (sarami manayo)",
                              "n": "Hay mucha gente."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_08",
                      "isLetter": false,
                      "letter": "ㅇ",
                      "word": "방",
                      "emoji": "🚪",
                      "phonetic": "/baŋ/",
                      "translation": "habitación",
                      "translations": {
                          "ko": "방",
                          "es": "habitación",
                          "en": "room"
                      },
                      "examples": [
                          {
                              "t": "제 <b>방</b>이에요. (je bang-ieyo)",
                              "n": "Es mi habitación."
                          },
                          {
                              "t": "<b>방</b>이 좁아요. (bangi jobayo)",
                              "n": "La habitación es pequeña."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_09",
                      "isLetter": false,
                      "letter": "ㅈ",
                      "word": "저",
                      "emoji": "🙇",
                      "phonetic": "/jeo/",
                      "translation": "yo (formal)",
                      "translations": {
                          "ko": "저",
                          "es": "yo (formal)",
                          "en": "I (formal)"
                      },
                      "examples": [
                          {
                              "t": "<b>저</b>는 한국 사람이에요. (jeoneun hanguk saramieyo)",
                              "n": "Yo soy coreano."
                          },
                          {
                              "t": "<b>저</b>도요. (jeodoyo)",
                              "n": "Yo también."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g2_10",
                      "isLetter": false,
                      "letter": "ㅎ",
                      "word": "하다",
                      "emoji": "✍️",
                      "phonetic": "/hada/",
                      "translation": "hacer",
                      "translations": {
                          "ko": "하다",
                          "es": "hacer",
                          "en": "to do"
                      },
                      "examples": [
                          {
                              "t": "숙제를 <b>해요</b>. (sukjereul haeyo)",
                              "n": "Hago la tarea."
                          },
                          {
                              "t": "운동을 <b>해요</b>. (undongeul haeyo)",
                              "n": "Hago ejercicio."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ko_a0_g3",
              "name": "Aspiradas y tensas",
              "icon": "💨",
              "color": "#10b981",
              "description": "ㅋ ㅌ ㅍ ㅊ aspiradas · ㄲ ㄸ ㅃ ㅆ ㅉ tensas",
              "reviewFrom": [
                  "ko_a0_g1",
                  "ko_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ko_a0_g3_L_ㅋ",
                      "isLetter": true,
                      "letter": "ㅋ",
                      "word": "ㅋ",
                      "emoji": "🔤",
                      "phonetic": "/kʰ/",
                      "translation": "ㅋ suena como <b>K</b> con un soplo de aire. <i>Piensa en 'k' inglesa de 'kite'.</i>",
                      "mnemonic": "Imagina una K con un pequeño gancho que suelta aire al hablar.",
                      "examples": [
                          {
                              "t": "<b>ㅋ</b> es como ㄱ pero con un soplo fuerte.<br>Compara: 가 (ga) vs 카 (ka).",
                              "n": "La diferencia está en el aire."
                          },
                          {
                              "t": "Palabra: <b>커피</b> (keopi) = café.",
                              "n": "Préstamo del inglés 'coffee'."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㅌ",
                      "isLetter": true,
                      "letter": "ㅌ",
                      "word": "ㅌ",
                      "emoji": "🔤",
                      "phonetic": "/tʰ/",
                      "translation": "ㅌ suena como <b>T</b> aspirada, como en inglés 'top'. <i>Más aire que ㄷ.</i>",
                      "mnemonic": "Parece una T con un palito arriba, como un gancho que expulsa aire.",
                      "examples": [
                          {
                              "t": "Compara: 다 (da) vs 타 (ta).<br><b>ㅌ</b> lleva un soplo.",
                              "n": "La T con aire."
                          },
                          {
                              "t": "Palabra: <b>택시</b> (taeksi) = taxi.",
                              "n": "Préstamo del inglés."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㅍ",
                      "isLetter": true,
                      "letter": "ㅍ",
                      "word": "ㅍ",
                      "emoji": "🔤",
                      "phonetic": "/pʰ/",
                      "translation": "ㅍ suena como <b>P</b> con un soplo, como en inglés 'pin'. <i>Más aire que ㅂ.</i>",
                      "mnemonic": "Parece una P con un sombrero pequeño, que suelta aire.",
                      "examples": [
                          {
                              "t": "Compara: 바 (ba) vs 파 (pa).<br><b>ㅍ</b> tiene un soplo.",
                              "n": "La P aspirada."
                          },
                          {
                              "t": "Palabra: <b>피</b> (pi) = sangre.",
                              "n": "Recuerda: 'sangre' con P."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㅊ",
                      "isLetter": true,
                      "letter": "ㅊ",
                      "word": "ㅊ",
                      "emoji": "🔤",
                      "phonetic": "/tɕʰ/",
                      "translation": "ㅊ suena como <b>CH</b> con un soplo, como 'ch' inglesa de 'cheese'. <i>Más aire que ㅈ.</i>",
                      "mnemonic": "Parece una ㅈ con un sombrero, que suelta aire al hablar.",
                      "examples": [
                          {
                              "t": "Compara: 자 (ja) vs 차 (cha).<br><b>ㅊ</b> con aire.",
                              "n": "La CH aspirada."
                          },
                          {
                              "t": "Palabra: <b>차</b> (cha) = té o coche.",
                              "n": "Doble significado, pero común."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㄲ",
                      "isLetter": true,
                      "letter": "ㄲ",
                      "word": "ㄲ",
                      "emoji": "🔤",
                      "phonetic": "/k͈/",
                      "translation": "ㄲ suena como una <b>K</b> tensa, sin aire, con la garganta apretada. <i>No es una doble K normal.</i>",
                      "mnemonic": "Dos ㄱ juntos, como si apretaras la garganta para decir K fuerte.",
                      "examples": [
                          {
                              "t": "Compara: 가 (ga) vs 까 (kka).<br><b>ㄲ</b> es tenso y corto.",
                              "n": "La K tensa."
                          },
                          {
                              "t": "Palabra: <b>꽃</b> (kkot) = flor.",
                              "n": "La flor es tensa."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㄸ",
                      "isLetter": true,
                      "letter": "ㄸ",
                      "word": "ㄸ",
                      "emoji": "🔤",
                      "phonetic": "/t͈/",
                      "translation": "ㄸ suena como una <b>T</b> tensa, sin aire, con la garganta apretada. <i>No es una T normal.</i>",
                      "mnemonic": "Dos ㄷ juntos, como si apretaras la lengua para decir T fuerte.",
                      "examples": [
                          {
                              "t": "Compara: 다 (da) vs 따 (tta).<br><b>ㄸ</b> es tenso.",
                              "n": "La T tensa."
                          },
                          {
                              "t": "Palabra: <b>딸</b> (ttal) = hija.",
                              "n": "Recuerda: tu hija es tensa."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㅃ",
                      "isLetter": true,
                      "letter": "ㅃ",
                      "word": "ㅃ",
                      "emoji": "🔤",
                      "phonetic": "/p͈/",
                      "translation": "ㅃ suena como una <b>P</b> tensa, sin aire, con la garganta apretada. <i>No es una P normal.</i>",
                      "mnemonic": "Dos ㅂ juntos, como si apretaras los labios para decir P fuerte.",
                      "examples": [
                          {
                              "t": "Compara: 바 (ba) vs 빠 (ppa).<br><b>ㅃ</b> es tenso.",
                              "n": "La P tensa."
                          },
                          {
                              "t": "Palabra: <b>빨리</b> (ppalli) = rápido.",
                              "n": "¡Rápido! con P tensa."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㅆ",
                      "isLetter": true,
                      "letter": "ㅆ",
                      "word": "ㅆ",
                      "emoji": "🔤",
                      "phonetic": "/s͈/",
                      "translation": "ㅆ suena como una <b>S</b> tensa, sin aire, con la garganta apretada. <i>Es más fuerte que ㅅ.</i>",
                      "mnemonic": "Dos ㅅ juntos, como si silbaras con fuerza.",
                      "examples": [
                          {
                              "t": "Compara: 사 (sa) vs 싸 (ssa).<br><b>ㅆ</b> es tenso.",
                              "n": "La S tensa."
                          },
                          {
                              "t": "Palabra: <b>쓰다</b> (sseuda) = escribir/usar.",
                              "n": "Verbo muy común."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_L_ㅉ",
                      "isLetter": true,
                      "letter": "ㅉ",
                      "word": "ㅉ",
                      "emoji": "🔤",
                      "phonetic": "/tɕ͈/",
                      "translation": "ㅉ suena como una <b>CH</b> tensa, sin aire, con la garganta apretada. <i>Es más fuerte que ㅈ.</i>",
                      "mnemonic": "Dos ㅈ juntos, como si apretaras la lengua para decir CH fuerte.",
                      "examples": [
                          {
                              "t": "Compara: 자 (ja) vs 짜 (jja).<br><b>ㅉ</b> es tenso.",
                              "n": "La CH tensa."
                          },
                          {
                              "t": "Palabra: <b>짜다</b> (jjada) = salado.",
                              "n": "La comida salada es tensa."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_10",
                      "isLetter": false,
                      "letter": "ㅋ",
                      "word": "커피",
                      "emoji": "☕",
                      "phonetic": "/kʰʌ.pʰi/",
                      "translation": "café",
                      "translations": {
                          "ko": "커피",
                          "es": "café",
                          "en": "coffee"
                      },
                      "examples": [
                          {
                              "t": "저는 <b>커피</b>를 마셔요.",
                              "n": "Yo bebo café."
                          },
                          {
                              "t": "커피가 뜨거워요.",
                              "n": "El café está caliente."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_11",
                      "isLetter": false,
                      "letter": "ㅌ",
                      "word": "택시",
                      "emoji": "🚕",
                      "phonetic": "/tʰɛk.ɕi/",
                      "translation": "taxi",
                      "translations": {
                          "ko": "택시",
                          "es": "taxi",
                          "en": "taxi"
                      },
                      "examples": [
                          {
                              "t": "저는 <b>택시</b>를 타요.",
                              "n": "Yo tomo un taxi."
                          },
                          {
                              "t": "택시가 빨라요.",
                              "n": "El taxi es rápido."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_12",
                      "isLetter": false,
                      "letter": "ㅍ",
                      "word": "파",
                      "emoji": "🧅",
                      "phonetic": "/pʰa/",
                      "translation": "cebollino (verdura)",
                      "translations": {
                          "ko": "파",
                          "es": "cebollino",
                          "en": "green onion"
                      },
                      "examples": [
                          {
                              "t": "김치에 <b>파</b>를 넣어요.",
                              "n": "Pongo cebollino en el kimchi."
                          },
                          {
                              "t": "파가 매워요.",
                              "n": "El cebollino es picante."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_13",
                      "isLetter": false,
                      "letter": "ㅊ",
                      "word": "차",
                      "emoji": "🍵",
                      "phonetic": "/tɕʰa/",
                      "translation": "té / coche",
                      "translations": {
                          "ko": "차",
                          "es": "té / coche",
                          "en": "tea / car"
                      },
                      "examples": [
                          {
                              "t": "저는 <b>차</b>를 마셔요.",
                              "n": "Yo bebo té."
                          },
                          {
                              "t": "차가 빨라요.",
                              "n": "El coche es rápido."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_14",
                      "isLetter": false,
                      "letter": "ㄲ",
                      "word": "꽃",
                      "emoji": "🌸",
                      "phonetic": "/k͈ot/",
                      "translation": "flor",
                      "translations": {
                          "ko": "꽃",
                          "es": "flor",
                          "en": "flower"
                      },
                      "examples": [
                          {
                              "t": "이 <b>꽃</b>은 예뻐요.",
                              "n": "Esta flor es bonita."
                          },
                          {
                              "t": "꽃을 사요.",
                              "n": "Compro flores."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_15",
                      "isLetter": false,
                      "letter": "ㄸ",
                      "word": "딸",
                      "emoji": "👧",
                      "phonetic": "/t͈al/",
                      "translation": "hija",
                      "translations": {
                          "ko": "딸",
                          "es": "hija",
                          "en": "daughter"
                      },
                      "examples": [
                          {
                              "t": "제 <b>딸</b>은 학생이에요.",
                              "n": "Mi hija es estudiante."
                          },
                          {
                              "t": "딸이 커요.",
                              "n": "Mi hija es grande."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_16",
                      "isLetter": false,
                      "letter": "ㅃ",
                      "word": "빨리",
                      "emoji": "⚡",
                      "phonetic": "/p͈al.li/",
                      "translation": "rápidamente",
                      "translations": {
                          "ko": "빨리",
                          "es": "rápidamente",
                          "en": "quickly"
                      },
                      "examples": [
                          {
                              "t": "<b>빨리</b> 가요.",
                              "n": "Vamos rápido."
                          },
                          {
                              "t": "빨리 먹어요.",
                              "n": "Come rápido."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_17",
                      "isLetter": false,
                      "letter": "ㅆ",
                      "word": "쓰다",
                      "emoji": "✍️",
                      "phonetic": "/s͈ɯ.da/",
                      "translation": "escribir / usar",
                      "translations": {
                          "ko": "쓰다",
                          "es": "escribir / usar",
                          "en": "to write / to use"
                      },
                      "examples": [
                          {
                              "t": "편지를 <b>써요</b>.",
                              "n": "Escribo una carta."
                          },
                          {
                              "t": "이것을 사용해요.",
                              "n": "Uso esto."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g3_18",
                      "isLetter": false,
                      "letter": "ㅉ",
                      "word": "짜다",
                      "emoji": "🧂",
                      "phonetic": "/tɕ͈a.da/",
                      "translation": "salado / apretar",
                      "translations": {
                          "ko": "짜다",
                          "es": "salado / apretar",
                          "en": "salty / to squeeze"
                      },
                      "examples": [
                          {
                              "t": "이 국은 <b>짜요</b>.",
                              "n": "Esta sopa está salada."
                          },
                          {
                              "t": "옷을 짜요.",
                              "n": "Exprimo la ropa."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ko_a0_g4",
              "name": "Bloques silábicos",
              "icon": "🧩",
              "color": "#ef4444",
              "description": "Cómo se combinan letras en sílabas completas",
              "reviewFrom": [
                  "ko_a0_g1",
                  "ko_a0_g2",
                  "ko_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ko_a0_g4_L_ga",
                      "isLetter": true,
                      "letter": "가",
                      "word": "가",
                      "emoji": "🔤",
                      "phonetic": "/ga/",
                      "translation": "Sílaba <b>가</b> (ga) — combinación de <b>ㄱ</b> (g/k) + <b>ㅏ</b> (a).<br>Suena como 'ga' en español.",
                      "mnemonic": "Imagina una 'g' minúscula que se estira hacia la derecha con una barra vertical.",
                      "examples": [
                          {
                              "t": "가 + ㅏ = <b>가</b> (ga)",
                              "n": "Consonante + vocal forman un bloque."
                          },
                          {
                              "t": "가방 (gabang) — bolso",
                              "n": "Palabra que empieza con 가."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_na",
                      "isLetter": true,
                      "letter": "나",
                      "word": "나",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "Sílaba <b>나</b> (na) — combinación de <b>ㄴ</b> (n) + <b>ㅏ</b> (a).<br>Suena como 'na' en español.",
                      "mnemonic": "La ㄴ parece una 'n' acostada, y la ㅏ es una 'a' sin el trazo curvo.",
                      "examples": [
                          {
                              "t": "ㄴ + ㅏ = <b>나</b> (na)",
                              "n": "Bloque simple."
                          },
                          {
                              "t": "나 (na) — yo",
                              "n": "Pronombre personal."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_da",
                      "isLetter": true,
                      "letter": "다",
                      "word": "다",
                      "emoji": "🔤",
                      "phonetic": "/da/",
                      "translation": "Sílaba <b>다</b> (da) — combinación de <b>ㄷ</b> (d/t) + <b>ㅏ</b> (a).<br>Suena como 'da' en español.",
                      "mnemonic": "La ㄷ parece una 'd' con un sombrero, y la ㅏ es la 'a'.",
                      "examples": [
                          {
                              "t": "ㄷ + ㅏ = <b>다</b> (da)",
                              "n": "Bloque básico."
                          },
                          {
                              "t": "다리 (dari) — puente",
                              "n": "Palabra con 다."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_bap",
                      "isLetter": true,
                      "letter": "밥",
                      "word": "밥",
                      "emoji": "🍚",
                      "phonetic": "/bap/",
                      "translation": "Sílaba <b>밥</b> (bap) — <b>ㅂ</b> + <b>ㅏ</b> + <b>ㅂ</b> (받침).<br>El bloque tiene consonante inicial, vocal y consonante final.",
                      "mnemonic": "Piensa en 'bap' como el sonido de masticar arroz: ¡bap!",
                      "examples": [
                          {
                              "t": "밥을 먹어요 (babeul meogeoyo) — como arroz",
                              "n": "밥 significa 'arroz cocido' o 'comida'."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_jip",
                      "isLetter": true,
                      "letter": "집",
                      "word": "집",
                      "emoji": "🏠",
                      "phonetic": "/jip/",
                      "translation": "Sílaba <b>집</b> (jip) — <b>ㅈ</b> + <b>ㅣ</b> + <b>ㅂ</b> (받침).<br>Suena 'chip' pero con 'j' suave.",
                      "mnemonic": "Imagina una casa con techo (ㅂ) que suena 'jip' como 'chip' en inglés.",
                      "examples": [
                          {
                              "t": "집에 가요 (jibe gayo) — voy a casa",
                              "n": "집 significa 'casa'."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_guk",
                      "isLetter": true,
                      "letter": "국",
                      "word": "국",
                      "emoji": "🍜",
                      "phonetic": "/guk/",
                      "translation": "Sílaba <b>국</b> (guk) — <b>ㄱ</b> + <b>ㅜ</b> + <b>ㄱ</b> (받침).<br>El sonido final 'k' es aspirado y corto.",
                      "mnemonic": "Suena como 'guk' — imagina sorber sopa con ruido 'guk'.",
                      "examples": [
                          {
                              "t": "국을 끓여요 (gugeul kkeuryeoyo) — hago sopa",
                              "n": "국 significa 'sopa'."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_chaek",
                      "isLetter": true,
                      "letter": "책",
                      "word": "책",
                      "emoji": "📚",
                      "phonetic": "/tɕʰɛk/",
                      "translation": "Sílaba <b>책</b> (chaek) — <b>ㅊ</b> + <b>ㅐ</b> + <b>ㄱ</b> (받침).<br>El sonido 'ae' es como 'e' abierta, y la 'k' final es aspirada.",
                      "mnemonic": "Piensa en 'check' en inglés — un libro para chequear.",
                      "examples": [
                          {
                              "t": "책을 읽어요 (chaegeul ilgeoyo) — leo un libro",
                              "n": "책 significa 'libro'."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_wa",
                      "isLetter": true,
                      "letter": "와",
                      "word": "와",
                      "emoji": "🔤",
                      "phonetic": "/wa/",
                      "translation": "Sílaba <b>와</b> (wa) — <b>ㅗ</b> + <b>ㅏ</b> combinados en una vocal doble.<br>Suena como 'ua' en español.",
                      "mnemonic": "La ㅗ (o) y ㅏ (a) se unen: 'o' + 'a' = 'ua'.",
                      "examples": [
                          {
                              "t": "와! (wa) — ¡venga!",
                              "n": "Exclamación para animar."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_bwa",
                      "isLetter": true,
                      "letter": "봐",
                      "word": "봐",
                      "emoji": "👀",
                      "phonetic": "/bwa/",
                      "translation": "Sílaba <b>봐</b> (bwa) — <b>ㅂ</b> + <b>ㅘ</b> (vocal doble).<br>Suena 'bua' — forma contraída de 보아.",
                      "mnemonic": "Imagina 'bua' como el sonido de mirar algo con sorpresa.",
                      "examples": [
                          {
                              "t": "봐! (bwa) — ¡mira!",
                              "n": "Forma imperativa de 보다 (ver)."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_doe",
                      "isLetter": true,
                      "letter": "돼",
                      "word": "돼",
                      "emoji": "🔄",
                      "phonetic": "/dwɛ/",
                      "translation": "Sílaba <b>돼</b> (dwae) — <b>ㄷ</b> + <b>ㅚ</b> (vocal doble).<br>Suena 'due' con 'e' abierta.",
                      "mnemonic": "Piensa en 'doe' como un ciervo (doe en inglés) que se convierte en algo.",
                      "examples": [
                          {
                              "t": "돼요 (dwaeyo) — se convierte, está bien",
                              "n": "Forma de 되다."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_ilg",
                      "isLetter": true,
                      "letter": "읽",
                      "word": "읽",
                      "emoji": "📖",
                      "phonetic": "/ilg/ (pero se pronuncia /ik/ al final)",
                      "translation": "Sílaba <b>읽</b> (ilg) — <b>ㅇ</b> + <b>ㅣ</b> + <b>ㄹㄱ</b> (doble 받침).<br>La ㄹ se pronuncia y la ㄱ se asimila.",
                      "mnemonic": "Doble consonante final: la primera suena, la segunda se transforma.",
                      "examples": [
                          {
                              "t": "읽다 (ikda) — leer",
                              "n": "La ㄱ se pronuncia como 'k' antes de consonante."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_dak",
                      "isLetter": true,
                      "letter": "닭",
                      "word": "닭",
                      "emoji": "🐔",
                      "phonetic": "/tak/ (ㄹ se silencia)",
                      "translation": "Sílaba <b>닭</b> (dak) — <b>ㄷ</b> + <b>ㅏ</b> + <b>ㄹㄱ</b> (doble 받침).<br>El ㄹ no se pronuncia en posición final.",
                      "mnemonic": "El pollo 'dak' no dice 'dal', solo 'dak'.",
                      "examples": [
                          {
                              "t": "닭고기 (dakgogi) — carne de pollo",
                              "n": "닭 significa 'pollo'."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_L_sam",
                      "isLetter": true,
                      "letter": "삶",
                      "word": "삶",
                      "emoji": "🌱",
                      "phonetic": "/sam/ (ㄹ se silencia)",
                      "translation": "Sílaba <b>삶</b> (sam) — <b>ㅅ</b> + <b>ㅏ</b> + <b>ㄹㅁ</b> (doble 받침).<br>La ㄹ se silencia y la ㅁ suena como 'm'.",
                      "mnemonic": "La vida 'sam' — como 'sam' en inglés, sin la 'l'.",
                      "examples": [
                          {
                              "t": "삶 (sam) — vida",
                              "n": "Sustantivo derivado de 살다 (vivir)."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_01",
                      "letter": "ㅎ",
                      "word": "안녕하세요",
                      "emoji": "👋",
                      "phonetic": "/annyeonghaseyo/",
                      "translation": "<b>안녕하세요</b> — hola (formal).<br>La ㅎ final se silencia: <i>annyeonghaseyo</i>.",
                      "translations": {
                          "ko": "안녕하세요",
                          "es": "Hola",
                          "en": "Hello"
                      },
                      "examples": [
                          {
                              "t": "안녕하세요, 만나서 반가워요.",
                              "n": "Hola, encantado de conocerte."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_02",
                      "letter": "ㅂ",
                      "word": "감사합니다",
                      "emoji": "🙏",
                      "phonetic": "/gamsahamnida/",
                      "translation": "<b>감사합니다</b> — gracias (formal).<br>La ㅂ se pronuncia como 'm' antes de 'n': <i>gamsahamnida</i>.",
                      "translations": {
                          "ko": "감사합니다",
                          "es": "Gracias",
                          "en": "Thank you"
                      },
                      "examples": [
                          {
                              "t": "감사합니다, 선생님.",
                              "n": "Gracias, profesor."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_03",
                      "letter": "ㅎ",
                      "word": "사랑해",
                      "emoji": "❤️",
                      "phonetic": "/saranghae/",
                      "translation": "<b>사랑해</b> — te quiero (informal).<br>La ㅎ se pronuncia suave, casi como una 'h' aspirada.",
                      "translations": {
                          "ko": "사랑해",
                          "es": "Te quiero",
                          "en": "I love you"
                      },
                      "examples": [
                          {
                              "t": "사랑해, 엄마.",
                              "n": "Te quiero, mamá."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_04",
                      "letter": "ㅎ",
                      "word": "한국어",
                      "emoji": "🇰🇷",
                      "phonetic": "/hangugeo/",
                      "translation": "<b>한국어</b> — idioma coreano.<br>La ㅇ inicial es muda, la ㅇ entre vocales suena como 'ng'.",
                      "translations": {
                          "ko": "한국어",
                          "es": "Idioma coreano",
                          "en": "Korean language"
                      },
                      "examples": [
                          {
                              "t": "한국어를 공부해요.",
                              "n": "Estudio coreano."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_05",
                      "letter": "ㅆ",
                      "word": "맛있어요",
                      "emoji": "😋",
                      "phonetic": "/masisseoyo/",
                      "translation": "<b>맛있어요</b> — está delicioso.<br>La ㅅ final de 맛 se pronuncia como 't' y luego se une con la siguiente vocal: <i>masisseoyo</i>.",
                      "translations": {
                          "ko": "맛있어요",
                          "es": "Está delicioso",
                          "en": "It's delicious"
                      },
                      "examples": [
                          {
                              "t": "이 음식 맛있어요!",
                              "n": "¡Esta comida está deliciosa!"
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_06",
                      "letter": "ㄱ",
                      "word": "괜찮아요",
                      "emoji": "👍",
                      "phonetic": "/gwaenchanayo/",
                      "translation": "<b>괜찮아요</b> — está bien / no pasa nada.<br>La ㅎ en 찮 se silencia: <i>gwaenchanayo</i>.",
                      "translations": {
                          "ko": "괜찮아요",
                          "es": "Está bien",
                          "en": "It's OK"
                      },
                      "examples": [
                          {
                              "t": "괜찮아요, 걱정 마세요.",
                              "n": "Está bien, no se preocupe."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_07",
                      "letter": "ㅎ",
                      "word": "공부하다",
                      "emoji": "📝",
                      "phonetic": "/gongbuhada/",
                      "translation": "<b>공부하다</b> — estudiar.<br>La ㅇ final de 공 suena como 'ng'.",
                      "translations": {
                          "ko": "공부하다",
                          "es": "Estudiar",
                          "en": "To study"
                      },
                      "examples": [
                          {
                              "t": "매일 한국어를 공부해요.",
                              "n": "Estudio coreano todos los días."
                          }
                      ]
                  },
                  {
                      "id": "ko_a0_g4_08",
                      "letter": "ㅊ",
                      "word": "친구",
                      "emoji": "👫",
                      "phonetic": "/chingu/",
                      "translation": "<b>친구</b> — amigo/amiga.<br>La ㅊ suena como 'ch' en español.",
                      "translations": {
                          "ko": "친구",
                          "es": "Amigo",
                          "en": "Friend"
                      },
                      "examples": [
                          {
                              "t": "친구를 만나요.",
                              "n": "Me encuentro con un amigo."
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // RUSO
  // ──────────────────────────────────────────────────────
  ru: {
      "level": "A0",
      "levelName": "El alfabeto cirílico",
      "groups": [
          {
              "id": "ru_a0_g1",
              "name": "Letras parecidas al latín",
              "icon": "🔤",
              "color": "#6366f1",
              "description": "А Е О М Т К В Н Р С — entrada fácil al cirílico",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ru_a0_g1_L_a",
                      "isLetter": true,
                      "letter": "А",
                      "word": "А",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "Se llama <b>А</b> y suena como la <b>a</b> del español. <i>Idéntica a la letra latina A.</i>",
                      "mnemonic": "Es exactamente la misma A que ya conoces, solo que en ruso siempre suena 'a'.",
                      "examples": [
                          {
                              "t": "<b>М</b>а<b>м</b>а — la palabra más fácil del mundo.",
                              "n": "Mamá"
                          },
                          {
                              "t": "<b>П</b>а<b>п</b>а — igual que en español.",
                              "n": "Papá"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_e",
                      "isLetter": true,
                      "letter": "Е",
                      "word": "Е",
                      "emoji": "🔤",
                      "phonetic": "/je/",
                      "translation": "Se llama <b>Ye</b> y suena <i>'ye'</i> como en <span class=\"hl\">'yerno'</span>. ¡Ojo! No es una E latina.",
                      "mnemonic": "Imagina una E con una 'y' escondida delante: Y-E. Siempre suena 'ye' al inicio.",
                      "examples": [
                          {
                              "t": "<b>Н</b>е<b>т</b> — la primera palabra que aprendes.",
                              "n": "No"
                          },
                          {
                              "t": "Где? — <i>¿Dónde?</i>",
                              "n": "¿Dónde?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_o",
                      "isLetter": true,
                      "letter": "О",
                      "word": "О",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Se llama <b>O</b> y suena como la <b>o</b> del español. <i>Idéntica a la letra latina O.</i>",
                      "mnemonic": "Un círculo perfecto: la O redonda como una pelota.",
                      "examples": [
                          {
                              "t": "<b>О</b>н — él.",
                              "n": "Él"
                          },
                          {
                              "t": "<b>О</b>на — ella.",
                              "n": "Ella"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_m",
                      "isLetter": true,
                      "letter": "М",
                      "word": "М",
                      "emoji": "🔤",
                      "phonetic": "/m/",
                      "translation": "Se llama <b>Em</b> y suena como la <b>m</b> del español. <i>Idéntica a la letra latina M.</i>",
                      "mnemonic": "Dos montañas juntas: la M de 'montaña'.",
                      "examples": [
                          {
                              "t": "<b>М</b>ир — paz / mundo.",
                              "n": "Paz, mundo"
                          },
                          {
                              "t": "<b>М</b>ой — mi (masculino).",
                              "n": "Mi"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_t",
                      "isLetter": true,
                      "letter": "Т",
                      "word": "Т",
                      "emoji": "🔤",
                      "phonetic": "/t/",
                      "translation": "Se llama <b>Te</b> y suena como la <b>t</b> del español. <i>Idéntica a la letra latina T.</i>",
                      "mnemonic": "La T con su sombrerito horizontal: la T de 'techo'.",
                      "examples": [
                          {
                              "t": "<b>Т</b>ы — tú.",
                              "n": "Tú"
                          },
                          {
                              "t": "<b>Т</b>ам — allí.",
                              "n": "Allí"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_k",
                      "isLetter": true,
                      "letter": "К",
                      "word": "К",
                      "emoji": "🔤",
                      "phonetic": "/k/",
                      "translation": "Se llama <b>Ka</b> y suena como la <b>k</b> o <b>c</b> fuerte. <i>Idéntica a la letra latina K.</i>",
                      "mnemonic": "La K de 'koala' — misma forma, mismo sonido.",
                      "examples": [
                          {
                              "t": "<b>К</b>ак — cómo.",
                              "n": "Cómo"
                          },
                          {
                              "t": "<b>К</b>то — quién.",
                              "n": "Quién"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_v",
                      "isLetter": true,
                      "letter": "В",
                      "word": "В",
                      "emoji": "🔤",
                      "phonetic": "/v/",
                      "translation": "Se llama <b>Ve</b> y suena como la <b>v</b> del español. <i>¡Cuidado! Parece una B latina pero es una V.</i>",
                      "mnemonic": "Parece una B pero es una V: piensa en <span class=\"hl\">'V de vaca'</span> con barriga.",
                      "examples": [
                          {
                              "t": "<b>В</b>ода — agua.",
                              "n": "Agua"
                          },
                          {
                              "t": "<b>В</b>от — aquí está / he aquí.",
                              "n": "Aquí está"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_n",
                      "isLetter": true,
                      "letter": "Н",
                      "word": "Н",
                      "emoji": "🔤",
                      "phonetic": "/n/",
                      "translation": "Se llama <b>En</b> y suena como la <b>n</b> del español. <i>¡Cuidado! Parece una H latina pero es una N.</i>",
                      "mnemonic": "Parece una H pero suena 'n': imagina una <span class=\"hl\">'H con nariz'</span>.",
                      "examples": [
                          {
                              "t": "<b>Н</b>о — pero.",
                              "n": "Pero"
                          },
                          {
                              "t": "<b>Н</b>ет — no.",
                              "n": "No"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_r",
                      "isLetter": true,
                      "letter": "Р",
                      "word": "Р",
                      "emoji": "🔤",
                      "phonetic": "/r/",
                      "translation": "Se llama <b>Er</b> y suena como la <b>r</b> fuerte del español. <i>¡Cuidado! Parece una P latina pero es una R.</i>",
                      "mnemonic": "Parece una P pero es una R: la <span class=\"hl\">'P con patita'</span> que rueda.",
                      "examples": [
                          {
                              "t": "<b>Р</b>оссия — Rusia.",
                              "n": "Rusia"
                          },
                          {
                              "t": "Я <b>р</b>ад — estoy contento.",
                              "n": "Estoy contento / alegre"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_L_s",
                      "isLetter": true,
                      "letter": "С",
                      "word": "С",
                      "emoji": "🔤",
                      "phonetic": "/s/",
                      "translation": "Se llama <b>Es</b> y suena como la <b>s</b> del español. <i>¡Cuidado! Parece una C latina pero es una S.</i>",
                      "mnemonic": "Parece una C pero es una S: la <span class=\"hl\">'C que silba'</span> como una serpiente.",
                      "examples": [
                          {
                              "t": "<b>С</b>он — sueño.",
                              "n": "Sueño"
                          },
                          {
                              "t": "<b>С</b>ок — zumo / jugo.",
                              "n": "Zumo, jugo"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_01",
                      "isLetter": false,
                      "letter": "А",
                      "word": "мама",
                      "emoji": "👩",
                      "phonetic": "/ˈmamə/",
                      "translation": "<b>Mamá</b> — igual que en español, suena casi idéntico.",
                      "translations": {
                          "ru": "мама",
                          "es": "mamá",
                          "en": "mom"
                      },
                      "examples": [
                          {
                              "t": "<b>Мама</b> дома.",
                              "n": "Mamá está en casa."
                          },
                          {
                              "t": "Это <b>мама</b>.",
                              "n": "Esta es mamá."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_02",
                      "isLetter": false,
                      "letter": "А",
                      "word": "папа",
                      "emoji": "👨",
                      "phonetic": "/ˈpapə/",
                      "translation": "<b>Papá</b> — igual que en español.",
                      "translations": {
                          "ru": "папа",
                          "es": "papá",
                          "en": "dad"
                      },
                      "examples": [
                          {
                              "t": "<b>Папа</b> там.",
                              "n": "Papá está allí."
                          },
                          {
                              "t": "Это <b>папа</b>.",
                              "n": "Este es papá."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_03",
                      "isLetter": false,
                      "letter": "Е",
                      "word": "нет",
                      "emoji": "🚫",
                      "phonetic": "/nʲet/",
                      "translation": "<b>No</b> — ¡cuidado! La <b>Е</b> suena <i>'ye'</i>, no 'e'.",
                      "translations": {
                          "ru": "нет",
                          "es": "no",
                          "en": "no"
                      },
                      "examples": [
                          {
                              "t": "<b>Нет</b>, спасибо.",
                              "n": "No, gracias."
                          },
                          {
                              "t": "Это <b>нет</b>? — ¡Sí, es no!",
                              "n": "¿Esto es no? — ¡Sí, es no!"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_04",
                      "isLetter": false,
                      "letter": "Е",
                      "word": "где",
                      "emoji": "❓",
                      "phonetic": "/ɡdʲe/",
                      "translation": "<b>¿Dónde?</b> — la <b>Е</b> final suena <i>'ye'</i>.",
                      "translations": {
                          "ru": "где",
                          "es": "dónde",
                          "en": "where"
                      },
                      "examples": [
                          {
                              "t": "<b>Где</b> мама?",
                              "n": "¿Dónde está mamá?"
                          },
                          {
                              "t": "<b>Где</b> папа?",
                              "n": "¿Dónde está papá?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_05",
                      "isLetter": false,
                      "letter": "О",
                      "word": "он",
                      "emoji": "👤",
                      "phonetic": "/on/",
                      "translation": "<b>Él</b> — la <b>О</b> suena como una o normal.",
                      "translations": {
                          "ru": "он",
                          "es": "él",
                          "en": "he"
                      },
                      "examples": [
                          {
                              "t": "<b>Он</b> дома.",
                              "n": "Él está en casa."
                          },
                          {
                              "t": "<b>Он</b> там.",
                              "n": "Él está allí."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_06",
                      "isLetter": false,
                      "letter": "О",
                      "word": "она",
                      "emoji": "👩",
                      "phonetic": "/ɐˈna/",
                      "translation": "<b>Ella</b> — la <b>О</b> inicial se pronuncia casi como 'a' en ruso hablado.",
                      "translations": {
                          "ru": "она",
                          "es": "ella",
                          "en": "she"
                      },
                      "examples": [
                          {
                              "t": "<b>Она</b> дома.",
                              "n": "Ella está en casa."
                          },
                          {
                              "t": "<b>Она</b> там.",
                              "n": "Ella está allí."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_07",
                      "isLetter": false,
                      "letter": "М",
                      "word": "мир",
                      "emoji": "🕊️",
                      "phonetic": "/mʲir/",
                      "translation": "<b>Paz</b> / <b>mundo</b> — la <b>М</b> es igual que la nuestra.",
                      "translations": {
                          "ru": "мир",
                          "es": "paz / mundo",
                          "en": "peace / world"
                      },
                      "examples": [
                          {
                              "t": "<b>Мир</b> — это хорошо.",
                              "n": "La paz es buena."
                          },
                          {
                              "t": "Весь <b>мир</b>.",
                              "n": "Todo el mundo."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_08",
                      "isLetter": false,
                      "letter": "М",
                      "word": "мой",
                      "emoji": "💍",
                      "phonetic": "/moj/",
                      "translation": "<b>Mi</b> (masculino) — la <b>М</b> y la <b>О</b> son iguales al latín.",
                      "translations": {
                          "ru": "мой",
                          "es": "mi (masc.)",
                          "en": "my"
                      },
                      "examples": [
                          {
                              "t": "Это <b>мой</b> папа.",
                              "n": "Este es mi papá."
                          },
                          {
                              "t": "<b>Мой</b> дом.",
                              "n": "Mi casa."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_09",
                      "isLetter": false,
                      "letter": "Т",
                      "word": "ты",
                      "emoji": "👉",
                      "phonetic": "/tɨ/",
                      "translation": "<b>Tú</b> — la <b>Т</b> es igual que la latina.",
                      "translations": {
                          "ru": "ты",
                          "es": "tú",
                          "en": "you (singular)"
                      },
                      "examples": [
                          {
                              "t": "<b>Ты</b> дома?",
                              "n": "¿Estás en casa?"
                          },
                          {
                              "t": "<b>Ты</b> там.",
                              "n": "Tú estás allí."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_10",
                      "isLetter": false,
                      "letter": "Т",
                      "word": "там",
                      "emoji": "📍",
                      "phonetic": "/tam/",
                      "translation": "<b>Allí</b> — la <b>Т</b> y la <b>А</b> son iguales al latín.",
                      "translations": {
                          "ru": "там",
                          "es": "allí",
                          "en": "there"
                      },
                      "examples": [
                          {
                              "t": "Мама <b>там</b>.",
                              "n": "Mamá está allí."
                          },
                          {
                              "t": "<b>Там</b> дом.",
                              "n": "Allí hay una casa."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_11",
                      "isLetter": false,
                      "letter": "К",
                      "word": "как",
                      "emoji": "❓",
                      "phonetic": "/kak/",
                      "translation": "<b>Cómo</b> — la <b>К</b> suena como una k.",
                      "translations": {
                          "ru": "как",
                          "es": "cómo",
                          "en": "how"
                      },
                      "examples": [
                          {
                              "t": "<b>Как</b> ты?",
                              "n": "¿Cómo estás?"
                          },
                          {
                              "t": "<b>Как</b> мама?",
                              "n": "¿Cómo está mamá?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_12",
                      "isLetter": false,
                      "letter": "К",
                      "word": "кто",
                      "emoji": "❓",
                      "phonetic": "/kto/",
                      "translation": "<b>Quién</b> — la <b>К</b> y la <b>Т</b> son iguales al latín.",
                      "translations": {
                          "ru": "кто",
                          "es": "quién",
                          "en": "who"
                      },
                      "examples": [
                          {
                              "t": "<b>Кто</b> это?",
                              "n": "¿Quién es?"
                          },
                          {
                              "t": "<b>Кто</b> там?",
                              "n": "¿Quién está allí?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_13",
                      "isLetter": false,
                      "letter": "В",
                      "word": "вода",
                      "emoji": "💧",
                      "phonetic": "/vɐˈda/",
                      "translation": "<b>Agua</b> — ¡OJO! La <b>В</b> parece una B pero suena <b>V</b>.",
                      "translations": {
                          "ru": "вода",
                          "es": "agua",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "<b>Вода</b> здесь.",
                              "n": "El agua está aquí."
                          },
                          {
                              "t": "Я пью <b>воду</b>.",
                              "n": "Bebo agua."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_14",
                      "isLetter": false,
                      "letter": "В",
                      "word": "вот",
                      "emoji": "👉",
                      "phonetic": "/vot/",
                      "translation": "<b>Aquí está</b> / <b>he aquí</b> — la <b>В</b> suena V.",
                      "translations": {
                          "ru": "вот",
                          "es": "aquí está",
                          "en": "here is"
                      },
                      "examples": [
                          {
                              "t": "<b>Вот</b> мама.",
                              "n": "Aquí está mamá."
                          },
                          {
                              "t": "<b>Вот</b> дом.",
                              "n": "Aquí está la casa."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_15",
                      "isLetter": false,
                      "letter": "Н",
                      "word": "но",
                      "emoji": "🔄",
                      "phonetic": "/no/",
                      "translation": "<b>Pero</b> — ¡OJO! La <b>Н</b> parece una H pero suena <b>N</b>.",
                      "translations": {
                          "ru": "но",
                          "es": "pero",
                          "en": "but"
                      },
                      "examples": [
                          {
                              "t": "Я хочу, <b>но</b> не могу.",
                              "n": "Quiero, pero no puedo."
                          },
                          {
                              "t": "<b>Но</b> это так.",
                              "n": "Pero es así."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_16",
                      "isLetter": false,
                      "letter": "Н",
                      "word": "нет",
                      "emoji": "🚫",
                      "phonetic": "/nʲet/",
                      "translation": "<b>No</b> — la <b>Н</b> suena N, la <b>Е</b> suena 'ye'.",
                      "translations": {
                          "ru": "нет",
                          "es": "no",
                          "en": "no"
                      },
                      "examples": [
                          {
                              "t": "<b>Нет</b>, это не так.",
                              "n": "No, no es así."
                          },
                          {
                              "t": "Ты дома? — <b>Нет</b>.",
                              "n": "¿Estás en casa? — No."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_17",
                      "isLetter": false,
                      "letter": "Р",
                      "word": "Россия",
                      "emoji": "🇷🇺",
                      "phonetic": "/rɐˈsʲijə/",
                      "translation": "<b>Rusia</b> — ¡OJO! La <b>Р</b> parece una P pero suena <b>R</b> fuerte.",
                      "translations": {
                          "ru": "Россия",
                          "es": "Rusia",
                          "en": "Russia"
                      },
                      "examples": [
                          {
                              "t": "Я из <b>России</b>.",
                              "n": "Soy de Rusia."
                          },
                          {
                              "t": "<b>Россия</b> большая.",
                              "n": "Rusia es grande."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_18",
                      "isLetter": false,
                      "letter": "Р",
                      "word": "рад",
                      "emoji": "😊",
                      "phonetic": "/rat/",
                      "translation": "<b>Contento</b> / <b>alegre</b> — la <b>Р</b> suena R.",
                      "translations": {
                          "ru": "рад",
                          "es": "contento / alegre",
                          "en": "glad"
                      },
                      "examples": [
                          {
                              "t": "Я <b>рад</b>.",
                              "n": "Estoy contento."
                          },
                          {
                              "t": "Она <b>рада</b>.",
                              "n": "Ella está contenta."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_19",
                      "isLetter": false,
                      "letter": "С",
                      "word": "сон",
                      "emoji": "😴",
                      "phonetic": "/son/",
                      "translation": "<b>Sueño</b> — ¡OJO! La <b>С</b> parece una C pero suena <b>S</b>.",
                      "translations": {
                          "ru": "сон",
                          "es": "sueño",
                          "en": "dream / sleep"
                      },
                      "examples": [
                          {
                              "t": "Я вижу <b>сон</b>.",
                              "n": "Tengo un sueño (veo un sueño)."
                          },
                          {
                              "t": "Это <b>сон</b>.",
                              "n": "Esto es un sueño."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g1_20",
                      "isLetter": false,
                      "letter": "С",
                      "word": "сок",
                      "emoji": "🧃",
                      "phonetic": "/sok/",
                      "translation": "<b>Zumo</b> / <b>jugo</b> — la <b>С</b> suena S, la <b>О</b> suena O.",
                      "translations": {
                          "ru": "сок",
                          "es": "zumo / jugo",
                          "en": "juice"
                      },
                      "examples": [
                          {
                              "t": "Я пью <b>сок</b>.",
                              "n": "Bebo zumo."
                          },
                          {
                              "t": "Это <b>сок</b>.",
                              "n": "Esto es zumo."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ru_a0_g2",
              "name": "Letras nuevas — sonidos conocidos",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "Б Г Д З И Л П Ф Э Ю Я — formas nuevas, sonidos familiares",
              "reviewFrom": [
                  "ru_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ru_a0_g2_L_b",
                      "isLetter": true,
                      "letter": "Б",
                      "word": "Б",
                      "emoji": "🔤",
                      "phonetic": "/b/",
                      "translation": "Letra <b>Б</b> — suena como la <b>B</b> española<br><i>Parece una B con la barriga hacia la derecha</i>",
                      "mnemonic": "Visual: es una B mayúscula pero con el hueco hacia la derecha, como un número 6 con panza.",
                      "examples": [
                          {
                              "t": "<b>Б</b>рат — hermano<br><b>Б</b>анк — banco",
                              "n": "La Б suena igual que la B en español"
                          },
                          {
                              "t": "У меня есть <b>брат</b>",
                              "n": "Tengo un hermano"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_g",
                      "isLetter": true,
                      "letter": "Г",
                      "word": "Г",
                      "emoji": "🔤",
                      "phonetic": "/g/",
                      "translation": "Letra <b>Г</b> — suena como la <b>G</b> de <i>gato</i> (siempre fuerte)<br><i>Parece una Γ griega o una L invertida</i>",
                      "mnemonic": "Visual: parece una Γ (gamma griega) o una L al revés; acústico: piensa en 'gato' pero siempre con sonido fuerte.",
                      "examples": [
                          {
                              "t": "<b>Г</b>де — dónde<br><b>Г</b>од — año",
                              "n": "La Г es la G fuerte, nunca suave como en 'gente'"
                          },
                          {
                              "t": "<b>Г</b>де ты живёшь?",
                              "n": "¿Dónde vives?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_d",
                      "isLetter": true,
                      "letter": "Д",
                      "word": "Д",
                      "emoji": "🔤",
                      "phonetic": "/d/",
                      "translation": "Letra <b>Д</b> — suena como la <b>D</b> española<br><i>Parece una casa o un triángulo con patas</i>",
                      "mnemonic": "Visual: parece una casita con tejado; la palabra «дом» (casa) empieza con Д.",
                      "examples": [
                          {
                              "t": "<b>Д</b>а — sí<br><b>Д</b>ом — casa",
                              "n": "La Д se parece a una casa, y «дом» significa casa"
                          },
                          {
                              "t": "<b>Д</b>а, я дома",
                              "n": "Sí, estoy en casa"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_z",
                      "isLetter": true,
                      "letter": "З",
                      "word": "З",
                      "emoji": "🔤",
                      "phonetic": "/z/",
                      "translation": "Letra <b>З</b> — suena como la <b>S</b> sonora (como en inglés <i>zoo</i>)<br><i>Parece un 3 con un palito</i>",
                      "mnemonic": "Visual: es como un 3 con una línea; acústico: es la S con vibración, como una abeja zumbando.",
                      "examples": [
                          {
                              "t": "<b>З</b>автра — mañana<br><b>З</b>има — invierno",
                              "n": "La З es la S sonora: pon la mano en la garganta y vibra"
                          },
                          {
                              "t": "<b>З</b>автра будет <b>зима</b>",
                              "n": "Mañana será invierno"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_i",
                      "isLetter": true,
                      "letter": "И",
                      "word": "И",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "Letra <b>И</b> — suena como la <b>I</b> española<br><i>Parece una N al revés o una U con línea debajo</i>",
                      "mnemonic": "Visual: parece una N reflejada en un espejo; acústico: es la I pura, sin diptongo.",
                      "examples": [
                          {
                              "t": "<b>И</b>ли — o<br><b>И</b>мя — nombre",
                              "n": "La И suena como la I en español"
                          },
                          {
                              "t": "Чай <b>или</b> кофе?",
                              "n": "¿Té o café?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_l",
                      "isLetter": true,
                      "letter": "Л",
                      "word": "Л",
                      "emoji": "🔤",
                      "phonetic": "/l/",
                      "translation": "Letra <b>Л</b> — suena como la <b>L</b> española<br><i>Parece una A sin el trazo del medio o una pirámide</i>",
                      "mnemonic": "Visual: parece una A sin la barra horizontal; acústico: la L de 'luna'.",
                      "examples": [
                          {
                              "t": "<b>Л</b>ес — bosque<br><b>Л</b>юди — personas",
                              "n": "La Л suena como la L en español"
                          },
                          {
                              "t": "Я люблю <b>лес</b>",
                              "n": "Me encanta el bosque"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_p",
                      "isLetter": true,
                      "letter": "П",
                      "word": "П",
                      "emoji": "🔤",
                      "phonetic": "/p/",
                      "translation": "Letra <b>П</b> — suena como la <b>P</b> española<br><i>Parece una π griega o una puerta</i>",
                      "mnemonic": "Visual: parece una π (pi) griega; acústico: es la P de 'papá'.",
                      "examples": [
                          {
                              "t": "<b>П</b>арк — parque<br><b>П</b>ривет — hola",
                              "n": "La П es la P española, no la Р rusa (que es una R)"
                          },
                          {
                              "t": "<b>П</b>ривет! Я в <b>парке</b>",
                              "n": "¡Hola! Estoy en el parque"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_f",
                      "isLetter": true,
                      "letter": "Ф",
                      "word": "Ф",
                      "emoji": "🔤",
                      "phonetic": "/f/",
                      "translation": "Letra <b>Ф</b> — suena como la <b>F</b> española<br><i>Parece una flor o una copa con rabito</i>",
                      "mnemonic": "Visual: parece una flor con tallo; acústico: es la F de 'foto' (y «фото» significa foto).",
                      "examples": [
                          {
                              "t": "<b>Ф</b>ото — foto<br><b>Ф</b>акт — hecho",
                              "n": "La Ф suena como la F en español"
                          },
                          {
                              "t": "Это <b>фото</b> моего друга",
                              "n": "Esta es la foto de mi amigo"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_e",
                      "isLetter": true,
                      "letter": "Э",
                      "word": "Э",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "Letra <b>Э</b> — suena como la <b>E</b> abierta (sin deslizamiento a Y)<br><i>Es una E al revés</i>",
                      "mnemonic": "Visual: es la E del espejo; acústico: di 'eh' sin cerrar, como cuando dudas en español.",
                      "examples": [
                          {
                              "t": "<b>Э</b>то — esto<br><b>Э</b>таж — piso",
                              "n": "La Э es la E abierta, no la Е (que suena 'ye')"
                          },
                          {
                              "t": "<b>Э</b>то мой <b>этаж</b>",
                              "n": "Este es mi piso"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_yu",
                      "isLetter": true,
                      "letter": "Ю",
                      "word": "Ю",
                      "emoji": "🔤",
                      "phonetic": "/ju/",
                      "translation": "Letra <b>Ю</b> — suena como <i>'you'</i> en inglés<br><i>Es una И con un palito redondeado abajo</i>",
                      "mnemonic": "Visual: parece una I con una U pegada abajo; acústico: di 'you' en inglés.",
                      "examples": [
                          {
                              "t": "<b>Ю</b>г — sur<br>Люб<b>лю</b> — amo",
                              "n": "La Ю suena como 'you' en inglés"
                          },
                          {
                              "t": "Я <b>люблю</b> <b>юг</b>",
                              "n": "Amo el sur"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_L_ya",
                      "isLetter": true,
                      "letter": "Я",
                      "word": "Я",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Letra <b>Я</b> — suena como <i>'ya'</i> en español<br><i>Parece una R al revés con cola</i>",
                      "mnemonic": "Visual: parece una R espejada con cola; acústico: es 'ya' en español, y «я» significa 'yo'.",
                      "examples": [
                          {
                              "t": "<b>Я</b> — yo<br><b>Я</b>зык — lengua/idioma",
                              "n": "La Я suena como 'ya' y significa 'yo'"
                          },
                          {
                              "t": "<b>Я</b> говорю по-испански",
                              "n": "Hablo español"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_01",
                      "isLetter": false,
                      "letter": "Б",
                      "word": "брат",
                      "emoji": "👬",
                      "phonetic": "/brat/",
                      "translation": "<b>Hermano</b>",
                      "translations": {
                          "ru": "брат",
                          "es": "hermano",
                          "en": "brother"
                      },
                      "examples": [
                          {
                              "t": "Мой <b>брат</b> дома",
                              "n": "Mi hermano está en casa"
                          },
                          {
                              "t": "У меня есть <b>брат</b>",
                              "n": "Tengo un hermano"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_02",
                      "isLetter": false,
                      "letter": "Г",
                      "word": "где",
                      "emoji": "📍",
                      "phonetic": "/gdʲe/",
                      "translation": "<b>Dónde</b>",
                      "translations": {
                          "ru": "где",
                          "es": "dónde",
                          "en": "where"
                      },
                      "examples": [
                          {
                              "t": "<b>Где</b> ты?",
                              "n": "¿Dónde estás?"
                          },
                          {
                              "t": "<b>Где</b> мой телефон?",
                              "n": "¿Dónde está mi teléfono?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_03",
                      "isLetter": false,
                      "letter": "Д",
                      "word": "да",
                      "emoji": "✅",
                      "phonetic": "/da/",
                      "translation": "<b>Sí</b>",
                      "translations": {
                          "ru": "да",
                          "es": "sí",
                          "en": "yes"
                      },
                      "examples": [
                          {
                              "t": "<b>Да</b>, конечно",
                              "n": "Sí, por supuesto"
                          },
                          {
                              "t": "<b>Да</b> или нет?",
                              "n": "¿Sí o no?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_04",
                      "isLetter": false,
                      "letter": "З",
                      "word": "зима",
                      "emoji": "❄️",
                      "phonetic": "/zʲɪˈma/",
                      "translation": "<b>Invierno</b>",
                      "translations": {
                          "ru": "зима",
                          "es": "invierno",
                          "en": "winter"
                      },
                      "examples": [
                          {
                              "t": "<b>Зима</b> холодная",
                              "n": "El invierno es frío"
                          },
                          {
                              "t": "Я люблю <b>зиму</b>",
                              "n": "Me gusta el invierno"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_05",
                      "isLetter": false,
                      "letter": "И",
                      "word": "имя",
                      "emoji": "📛",
                      "phonetic": "/ˈimʲə/",
                      "translation": "<b>Nombre</b>",
                      "translations": {
                          "ru": "имя",
                          "es": "nombre",
                          "en": "name"
                      },
                      "examples": [
                          {
                              "t": "Моё <b>имя</b> Анна",
                              "n": "Mi nombre es Anna"
                          },
                          {
                              "t": "Какое у тебя <b>имя</b>?",
                              "n": "¿Cuál es tu nombre?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_06",
                      "isLetter": false,
                      "letter": "Л",
                      "word": "лес",
                      "emoji": "🌲",
                      "phonetic": "/lʲes/",
                      "translation": "<b>Bosque</b>",
                      "translations": {
                          "ru": "лес",
                          "es": "bosque",
                          "en": "forest"
                      },
                      "examples": [
                          {
                              "t": "Мы идём в <b>лес</b>",
                              "n": "Vamos al bosque"
                          },
                          {
                              "t": "В <b>лесу</b> тихо",
                              "n": "En el bosque hay silencio"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_07",
                      "isLetter": false,
                      "letter": "П",
                      "word": "привет",
                      "emoji": "👋",
                      "phonetic": "/prʲɪˈvʲet/",
                      "translation": "<b>Hola</b>",
                      "translations": {
                          "ru": "привет",
                          "es": "hola",
                          "en": "hello"
                      },
                      "examples": [
                          {
                              "t": "<b>Привет</b>! Как дела?",
                              "n": "¡Hola! ¿Cómo estás?"
                          },
                          {
                              "t": "<b>Привет</b>, друг",
                              "n": "Hola, amigo"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_08",
                      "isLetter": false,
                      "letter": "Ф",
                      "word": "фото",
                      "emoji": "📷",
                      "phonetic": "/ˈfotə/",
                      "translation": "<b>Foto</b>",
                      "translations": {
                          "ru": "фото",
                          "es": "foto",
                          "en": "photo"
                      },
                      "examples": [
                          {
                              "t": "Это <b>фото</b> моей семьи",
                              "n": "Esta es la foto de mi familia"
                          },
                          {
                              "t": "Сделай <b>фото</b>!",
                              "n": "¡Toma una foto!"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_09",
                      "isLetter": false,
                      "letter": "Э",
                      "word": "это",
                      "emoji": "👉",
                      "phonetic": "/ˈɛtə/",
                      "translation": "<b>Esto/esto es</b>",
                      "translations": {
                          "ru": "это",
                          "es": "esto",
                          "en": "this"
                      },
                      "examples": [
                          {
                              "t": "<b>Это</b> мой дом",
                              "n": "Esta es mi casa"
                          },
                          {
                              "t": "Что <b>это</b>?",
                              "n": "¿Qué es esto?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_10",
                      "isLetter": false,
                      "letter": "Ю",
                      "word": "юг",
                      "emoji": "🧭",
                      "phonetic": "/juk/",
                      "translation": "<b>Sur</b>",
                      "translations": {
                          "ru": "юг",
                          "es": "sur",
                          "en": "south"
                      },
                      "examples": [
                          {
                              "t": "Мы едем на <b>юг</b>",
                              "n": "Vamos al sur"
                          },
                          {
                              "t": "<b>Юг</b> — это тепло",
                              "n": "El sur es cálido"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g2_11",
                      "isLetter": false,
                      "letter": "Я",
                      "word": "я",
                      "emoji": "🙋",
                      "phonetic": "/ja/",
                      "translation": "<b>Yo</b>",
                      "translations": {
                          "ru": "я",
                          "es": "yo",
                          "en": "I"
                      },
                      "examples": [
                          {
                              "t": "<b>Я</b> студент",
                              "n": "Soy estudiante"
                          },
                          {
                              "t": "<b>Я</b> люблю музыку",
                              "n": "Me gusta la música"
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ru_a0_g3",
              "name": "Sonidos únicos del ruso",
              "icon": "🔣",
              "color": "#10b981",
              "description": "Ж Ш Щ Ч Х Ц Ъ Ь Ы — los sonidos más difíciles",
              "reviewFrom": [
                  "ru_a0_g1",
                  "ru_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ru_a0_g3_L_zh",
                      "isLetter": true,
                      "letter": "Ж",
                      "word": "Ж",
                      "emoji": "🔤",
                      "phonetic": "/ʒ/",
                      "translation": "<b>Ж</b> — como la <i>J</i> francesa o la <i>s</i> de \"mea<i>su</i>re\" en inglés. No existe en español.",
                      "mnemonic": "Parece un escarabajo (Ж) que zumba: \"zzh-zh-zh\".",
                      "examples": [
                          {
                              "t": "<b>Ж</b>ить — vivir.<br>Recuerda: <span class=\"hl\">Ж</span> como el zumbido de una abeja.",
                              "n": "La letra Ж suena como una abeja zumbando."
                          },
                          {
                              "t": "му<b>ж</b> — esposo",
                              "n": "La Ж al final se pronuncia como /ʂ/ (sorda), pero en la tarjeta la vemos como /ʒ/."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_sh",
                      "isLetter": true,
                      "letter": "Ш",
                      "word": "Ш",
                      "emoji": "🔤",
                      "phonetic": "/ʃ/",
                      "translation": "<b>Ш</b> — como la <i>SH</i> inglesa de \"<i>shoe</i>\" (zapato).",
                      "mnemonic": "La Ш parece un tenedor de tres púas: ¡shhh! pide silencio.",
                      "examples": [
                          {
                              "t": "<b>Ш</b>кола — escuela.",
                              "n": "La Ш es como una 'sh' fuerte."
                          },
                          {
                              "t": "хоро<b>ш</b>о — bien, bueno.",
                              "n": "La Ш suena como 'sh' en inglés."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_shch",
                      "isLetter": true,
                      "letter": "Щ",
                      "word": "Щ",
                      "emoji": "🔤",
                      "phonetic": "/ɕɕ/",
                      "translation": "<b>Щ</b> — una <i>SH</i> suave y larga, como si dijeras \"sh-sh-sh\" con una sonrisa. Es más aguda que Ш.",
                      "mnemonic": "La Щ tiene una colita (como un cepillo), y suena como un cepillo que frota: \"sh-sh-sh\" más suave.",
                      "examples": [
                          {
                              "t": "<b>Щ</b>и — sopa de col (tradicional).",
                              "n": "La Щ es como una 'sh' suave y larga."
                          },
                          {
                              "t": "е<b>щё</b> — todavía, más.",
                              "n": "La Щ suena como 'sh-ch' en inglés, pero más suave."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_ch",
                      "isLetter": true,
                      "letter": "Ч",
                      "word": "Ч",
                      "emoji": "🔤",
                      "phonetic": "/tɕ/",
                      "translation": "<b>Ч</b> — como la <i>CH</i> de \"<i>cheap</i>\" (barato) en inglés, pero más suave y corta.",
                      "mnemonic": "La Ч parece una silla (chair en inglés) y suena como 'ch'.",
                      "examples": [
                          {
                              "t": "<b>Ч</b>ай — té.",
                              "n": "La Ч suena como 'ch' en inglés."
                          },
                          {
                              "t": "<b>Ч</b>то — qué. (Se pronuncia 'shto', excepción)",
                              "n": "Ojo: en 'что' la Ч suena como Ш."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_kh",
                      "isLetter": true,
                      "letter": "Х",
                      "word": "Х",
                      "emoji": "🔤",
                      "phonetic": "/x/",
                      "translation": "<b>Х</b> — como la <i>J</i> española (de \"<i>jamón</i>\") o la <i>ch</i> alemana (\"<i>Bach</i>\").",
                      "mnemonic": "La Х es una equis, pero suena como la J española: ¡j! ¡j!",
                      "examples": [
                          {
                              "t": "<b>Х</b>леб — pan.",
                              "n": "La Х es como una J fuerte."
                          },
                          {
                              "t": "хоро<b>ш</b>о — bien.",
                              "n": "La Х suena como la J española."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_ts",
                      "isLetter": true,
                      "letter": "Ц",
                      "word": "Ц",
                      "emoji": "🔤",
                      "phonetic": "/ts/",
                      "translation": "<b>Ц</b> — como la <i>TS</i> de \"pi<i>tz</i>a\" en italiano o \"<i>ts</i>unami\".",
                      "mnemonic": "La Ц parece una garra que atrapa: \"ts-ts-ts\" como para llamar a un gato.",
                      "examples": [
                          {
                              "t": "<b>Ц</b>ена — precio.",
                              "n": "La Ц suena como 'ts'."
                          },
                          {
                              "t": "оте<b>ц</b> — padre.",
                              "n": "La Ц final suena como 'ts'."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_hard_sign",
                      "isLetter": true,
                      "letter": "Ъ",
                      "word": "Ъ",
                      "emoji": "🔤",
                      "phonetic": "/—/",
                      "translation": "<b>Ъ</b> — signo duro. No tiene sonido, separa el prefijo de la vocal para que se pronuncie por separado.",
                      "mnemonic": "Es como un muro (Ъ) que separa dos letras para que no se mezclen.",
                      "examples": [
                          {
                              "t": "об<b>ъ</b>ект — objeto.",
                              "n": "La Ъ separa la 'b' de la 'e'."
                          },
                          {
                              "t": "с<b>ъ</b>езд — congreso.",
                              "n": "La Ъ indica que la 'с' y la 'е' se pronuncian separadas."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_soft_sign",
                      "isLetter": true,
                      "letter": "Ь",
                      "word": "Ь",
                      "emoji": "🔤",
                      "phonetic": "/—/",
                      "translation": "<b>Ь</b> — signo blando. No tiene sonido, pero suaviza la consonante anterior (como una 'y' muy corta).",
                      "mnemonic": "Es como una 'b' que se derrite: suaviza la letra anterior.",
                      "examples": [
                          {
                              "t": "ма<b>ть</b> — madre.",
                              "n": "La Ь suaviza la 'т'."
                          },
                          {
                              "t": "пя<b>ть</b> — cinco.",
                              "n": "La Ь suaviza la 'т'."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_L_y",
                      "isLetter": true,
                      "letter": "Ы",
                      "word": "Ы",
                      "emoji": "🔤",
                      "phonetic": "/ɨ/",
                      "translation": "<b>Ы</b> — sonido entre <i>i</i> y <i>u</i>, sin equivalente en español. Como una 'i' profunda y gutural.",
                      "mnemonic": "La Ы parece una 'i' con una barriga: empuja el sonido hacia atrás.",
                      "examples": [
                          {
                              "t": "<b>Ы</b> — tú (informal).",
                              "n": "La Ы es un sonido único."
                          },
                          {
                              "t": "м<b>ы</b> — nosotros.",
                              "n": "La Ы suena como una 'i' profunda."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_01",
                      "isLetter": false,
                      "letter": "Ж",
                      "word": "жить",
                      "emoji": "🏠",
                      "phonetic": "/ʐɨtʲ/",
                      "translation": "vivir",
                      "translations": {
                          "ru": "жить",
                          "es": "vivir",
                          "en": "to live"
                      },
                      "examples": [
                          {
                              "t": "Я хочу <b>жить</b> в Испании.",
                              "n": "Quiero vivir en España."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_02",
                      "isLetter": false,
                      "letter": "Ж",
                      "word": "муж",
                      "emoji": "👨",
                      "phonetic": "/muʂ/",
                      "translation": "esposo",
                      "translations": {
                          "ru": "муж",
                          "es": "esposo",
                          "en": "husband"
                      },
                      "examples": [
                          {
                              "t": "Мой <b>муж</b> дома.",
                              "n": "Mi esposo está en casa."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_03",
                      "isLetter": false,
                      "letter": "Ш",
                      "word": "школа",
                      "emoji": "🏫",
                      "phonetic": "/ˈʂkoɫə/",
                      "translation": "escuela",
                      "translations": {
                          "ru": "школа",
                          "es": "escuela",
                          "en": "school"
                      },
                      "examples": [
                          {
                              "t": "Я иду в <b>школу</b>.",
                              "n": "Voy a la escuela."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_04",
                      "isLetter": false,
                      "letter": "Ш",
                      "word": "хорошо",
                      "emoji": "😊",
                      "phonetic": "/xərɐˈʂo/",
                      "translation": "bien, bueno",
                      "translations": {
                          "ru": "хорошо",
                          "es": "bien, bueno",
                          "en": "good, well"
                      },
                      "examples": [
                          {
                              "t": "Всё <b>хорошо</b>.",
                              "n": "Todo está bien."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_05",
                      "isLetter": false,
                      "letter": "Щ",
                      "word": "щи",
                      "emoji": "🍲",
                      "phonetic": "/ɕɕi/",
                      "translation": "sopa de col (tradicional rusa)",
                      "translations": {
                          "ru": "щи",
                          "es": "sopa de col",
                          "en": "cabbage soup"
                      },
                      "examples": [
                          {
                              "t": "Я люблю <b>щи</b>.",
                              "n": "Me encanta la sopa de col."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_06",
                      "isLetter": false,
                      "letter": "Щ",
                      "word": "ещё",
                      "emoji": "➕",
                      "phonetic": "/jɪˈɕːɵ/",
                      "translation": "todavía, más",
                      "translations": {
                          "ru": "ещё",
                          "es": "todavía, más",
                          "en": "still, more"
                      },
                      "examples": [
                          {
                              "t": "Хочешь <b>ещё</b> чай?",
                              "n": "¿Quieres más té?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_07",
                      "isLetter": false,
                      "letter": "Ч",
                      "word": "чай",
                      "emoji": "🍵",
                      "phonetic": "/t͡ɕaj/",
                      "translation": "té",
                      "translations": {
                          "ru": "чай",
                          "es": "té",
                          "en": "tea"
                      },
                      "examples": [
                          {
                              "t": "Я пью <b>чай</b>.",
                              "n": "Bebo té."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_08",
                      "isLetter": false,
                      "letter": "Ч",
                      "word": "что",
                      "emoji": "❓",
                      "phonetic": "/ʂto/",
                      "translation": "qué (se pronuncia 'shto')",
                      "translations": {
                          "ru": "что",
                          "es": "qué",
                          "en": "what"
                      },
                      "examples": [
                          {
                              "t": "<b>Что</b> это?",
                              "n": "¿Qué es esto?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_09",
                      "isLetter": false,
                      "letter": "Х",
                      "word": "хлеб",
                      "emoji": "🍞",
                      "phonetic": "/xlʲep/",
                      "translation": "pan",
                      "translations": {
                          "ru": "хлеб",
                          "es": "pan",
                          "en": "bread"
                      },
                      "examples": [
                          {
                              "t": "Я ем <b>хлеб</b>.",
                              "n": "Como pan."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_10",
                      "isLetter": false,
                      "letter": "Х",
                      "word": "хорошо",
                      "emoji": "👍",
                      "phonetic": "/xərɐˈʂo/",
                      "translation": "bien, bueno",
                      "translations": {
                          "ru": "хорошо",
                          "es": "bien, bueno",
                          "en": "good, well"
                      },
                      "examples": [
                          {
                              "t": "Очень <b>хорошо</b>!",
                              "n": "¡Muy bien!"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_11",
                      "isLetter": false,
                      "letter": "Ц",
                      "word": "цена",
                      "emoji": "💲",
                      "phonetic": "/t͡sɨˈna/",
                      "translation": "precio",
                      "translations": {
                          "ru": "цена",
                          "es": "precio",
                          "en": "price"
                      },
                      "examples": [
                          {
                              "t": "Какая <b>цена</b>?",
                              "n": "¿Cuál es el precio?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_12",
                      "isLetter": false,
                      "letter": "Ц",
                      "word": "отец",
                      "emoji": "👨‍👧",
                      "phonetic": "/ɐˈtʲet͡s/",
                      "translation": "padre",
                      "translations": {
                          "ru": "отец",
                          "es": "padre",
                          "en": "father"
                      },
                      "examples": [
                          {
                              "t": "Мой <b>отец</b> врач.",
                              "n": "Mi padre es médico."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_13",
                      "isLetter": false,
                      "letter": "Ъ",
                      "word": "объект",
                      "emoji": "📦",
                      "phonetic": "/ɐbˈjekt/",
                      "translation": "objeto",
                      "translations": {
                          "ru": "объект",
                          "es": "objeto",
                          "en": "object"
                      },
                      "examples": [
                          {
                              "t": "Это <b>объект</b> изучения.",
                              "n": "Es un objeto de estudio."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_14",
                      "isLetter": false,
                      "letter": "Ъ",
                      "word": "съезд",
                      "emoji": "🏛️",
                      "phonetic": "/sjest/",
                      "translation": "congreso, convención",
                      "translations": {
                          "ru": "съезд",
                          "es": "congreso",
                          "en": "congress, convention"
                      },
                      "examples": [
                          {
                              "t": "Съезд партии.",
                              "n": "Congreso del partido."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_15",
                      "isLetter": false,
                      "letter": "Ь",
                      "word": "мать",
                      "emoji": "👩",
                      "phonetic": "/matʲ/",
                      "translation": "madre",
                      "translations": {
                          "ru": "мать",
                          "es": "madre",
                          "en": "mother"
                      },
                      "examples": [
                          {
                              "t": "Моя <b>мать</b> дома.",
                              "n": "Mi madre está en casa."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_16",
                      "isLetter": false,
                      "letter": "Ь",
                      "word": "пять",
                      "emoji": "5️⃣",
                      "phonetic": "/pʲatʲ/",
                      "translation": "cinco",
                      "translations": {
                          "ru": "пять",
                          "es": "cinco",
                          "en": "five"
                      },
                      "examples": [
                          {
                              "t": "У меня <b>пять</b> рублей.",
                              "n": "Tengo cinco rublos."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_17",
                      "isLetter": false,
                      "letter": "Ы",
                      "word": "ты",
                      "emoji": "👉",
                      "phonetic": "/tɨ/",
                      "translation": "tú (informal)",
                      "translations": {
                          "ru": "ты",
                          "es": "tú",
                          "en": "you (singular informal)"
                      },
                      "examples": [
                          {
                              "t": "<b>Ты</b> студент.",
                              "n": "Tú eres estudiante."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_18",
                      "isLetter": false,
                      "letter": "Ы",
                      "word": "мы",
                      "emoji": "👥",
                      "phonetic": "/mɨ/",
                      "translation": "nosotros",
                      "translations": {
                          "ru": "мы",
                          "es": "nosotros",
                          "en": "we"
                      },
                      "examples": [
                          {
                              "t": "<b>Мы</b> дома.",
                              "n": "Estamos en casa."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g3_19",
                      "isLetter": false,
                      "letter": "Ы",
                      "word": "сын",
                      "emoji": "👦",
                      "phonetic": "/sɨn/",
                      "translation": "hijo",
                      "translations": {
                          "ru": "сын",
                          "es": "hijo",
                          "en": "son"
                      },
                      "examples": [
                          {
                              "t": "Мой <b>сын</b> маленький.",
                              "n": "Mi hijo es pequeño."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ru_a0_g4",
              "name": "Primeras palabras rusas",
              "icon": "📖",
              "color": "#ef4444",
              "description": "Leer y entender 20 palabras rusas esenciales",
              "reviewFrom": [
                  "ru_a0_g1",
                  "ru_a0_g2",
                  "ru_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ru_a0_g4_01",
                      "letter": "д",
                      "word": "да",
                      "emoji": "✅",
                      "phonetic": "/da/",
                      "translation": "sí",
                      "translations": {
                          "ru": "да",
                          "es": "sí",
                          "en": "yes"
                      },
                      "examples": [
                          {
                              "t": "<b>Да</b>, это так.",
                              "n": "Sí, es así."
                          },
                          {
                              "t": "Ты понимаешь? — <b>Да</b>.",
                              "n": "¿Entiendes? — Sí."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_02",
                      "letter": "н",
                      "word": "нет",
                      "emoji": "❌",
                      "phonetic": "/nyet/",
                      "translation": "no",
                      "translations": {
                          "ru": "нет",
                          "es": "no",
                          "en": "no"
                      },
                      "examples": [
                          {
                              "t": "<b>Нет</b>, спасибо.",
                              "n": "No, gracias."
                          },
                          {
                              "t": "Это не так — <b>нет</b>.",
                              "n": "No es así — no."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_03",
                      "letter": "п",
                      "word": "привет",
                      "emoji": "👋",
                      "phonetic": "/pree-vyet/",
                      "translation": "hola",
                      "translations": {
                          "ru": "привет",
                          "es": "hola",
                          "en": "hello"
                      },
                      "examples": [
                          {
                              "t": "<b>Привет</b>, как дела?",
                              "n": "Hola, ¿cómo estás?"
                          },
                          {
                              "t": "Скажи <b>привет</b> маме.",
                              "n": "Saluda a mamá de mi parte."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_04",
                      "letter": "п",
                      "word": "пока",
                      "emoji": "👋",
                      "phonetic": "/pa-KA/",
                      "translation": "adiós, hasta luego",
                      "translations": {
                          "ru": "пока",
                          "es": "adiós, hasta luego",
                          "en": "bye"
                      },
                      "examples": [
                          {
                              "t": "<b>Пока</b>, до завтра!",
                              "n": "¡Adiós, hasta mañana!"
                          },
                          {
                              "t": "Ну, <b>пока</b>!",
                              "n": "¡Bueno, hasta luego!"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_05",
                      "letter": "с",
                      "word": "спасибо",
                      "emoji": "🙏",
                      "phonetic": "/spa-SEE-ba/",
                      "translation": "gracias",
                      "translations": {
                          "ru": "спасибо",
                          "es": "gracias",
                          "en": "thank you"
                      },
                      "examples": [
                          {
                              "t": "<b>Спасибо</b> большое!",
                              "n": "¡Muchas gracias!"
                          },
                          {
                              "t": "Скажи <b>спасибо</b> бабушке.",
                              "n": "Dale las gracias a la abuela."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_06",
                      "letter": "п",
                      "word": "пожалуйста",
                      "emoji": "🙏",
                      "phonetic": "/pa-ZHA-lus-ta/",
                      "translation": "por favor, de nada",
                      "translations": {
                          "ru": "пожалуйста",
                          "es": "por favor, de nada",
                          "en": "please, you're welcome"
                      },
                      "examples": [
                          {
                              "t": "Скажи <b>пожалуйста</b>.",
                              "n": "Di por favor."
                          },
                          {
                              "t": "— Спасибо! — <b>Пожалуйста</b>.",
                              "n": "— ¡Gracias! — De nada."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_07",
                      "letter": "к",
                      "word": "как дела?",
                      "emoji": "💬",
                      "phonetic": "/kak de-LA/",
                      "translation": "¿cómo estás?",
                      "translations": {
                          "ru": "как дела?",
                          "es": "¿cómo estás?",
                          "en": "how are you?"
                      },
                      "examples": [
                          {
                              "t": "<b>Как дела</b>?",
                              "n": "¿Cómo estás?"
                          },
                          {
                              "t": "Ну, <b>как дела</b> у тебя?",
                              "n": "Bueno, ¿y tú cómo estás?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_08",
                      "letter": "х",
                      "word": "хорошо",
                      "emoji": "😊",
                      "phonetic": "/ha-ra-SHO/",
                      "translation": "bien",
                      "translations": {
                          "ru": "хорошо",
                          "es": "bien",
                          "en": "good, well"
                      },
                      "examples": [
                          {
                              "t": "Всё <b>хорошо</b>.",
                              "n": "Todo está bien."
                          },
                          {
                              "t": "Она говорит по-русски <b>хорошо</b>.",
                              "n": "Ella habla ruso bien."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_09",
                      "letter": "я",
                      "word": "я",
                      "emoji": "🙋",
                      "phonetic": "/ya/",
                      "translation": "yo",
                      "translations": {
                          "ru": "я",
                          "es": "yo",
                          "en": "I"
                      },
                      "examples": [
                          {
                              "t": "<b>Я</b> студент.",
                              "n": "Soy estudiante."
                          },
                          {
                              "t": "<b>Я</b> люблю музыку.",
                              "n": "Me gusta la música."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_10",
                      "letter": "т",
                      "word": "ты",
                      "emoji": "👉",
                      "phonetic": "/ty/",
                      "translation": "tú",
                      "translations": {
                          "ru": "ты",
                          "es": "tú",
                          "en": "you (singular informal)"
                      },
                      "examples": [
                          {
                              "t": "<b>Ты</b> здесь.",
                              "n": "Tú estás aquí."
                          },
                          {
                              "t": "<b>Ты</b> говоришь по-испански?",
                              "n": "¿Hablas español?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_11",
                      "letter": "о",
                      "word": "он",
                      "emoji": "👨",
                      "phonetic": "/on/",
                      "translation": "él",
                      "translations": {
                          "ru": "он",
                          "es": "él",
                          "en": "he"
                      },
                      "examples": [
                          {
                              "t": "<b>Он</b> дома.",
                              "n": "Él está en casa."
                          },
                          {
                              "t": "<b>Он</b> мой друг.",
                              "n": "Él es mi amigo."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_12",
                      "letter": "о",
                      "word": "она",
                      "emoji": "👩",
                      "phonetic": "/a-NA/",
                      "translation": "ella",
                      "translations": {
                          "ru": "она",
                          "es": "ella",
                          "en": "she"
                      },
                      "examples": [
                          {
                              "t": "<b>Она</b> тут.",
                              "n": "Ella está aquí."
                          },
                          {
                              "t": "<b>Она</b> красивая.",
                              "n": "Ella es bonita."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_13",
                      "letter": "м",
                      "word": "мы",
                      "emoji": "👥",
                      "phonetic": "/my/",
                      "translation": "nosotros",
                      "translations": {
                          "ru": "мы",
                          "es": "nosotros",
                          "en": "we"
                      },
                      "examples": [
                          {
                              "t": "<b>Мы</b> вместе.",
                              "n": "Estamos juntos."
                          },
                          {
                              "t": "<b>Мы</b> из Испании.",
                              "n": "Somos de España."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_14",
                      "letter": "ч",
                      "word": "что",
                      "emoji": "❓",
                      "phonetic": "/shto/",
                      "translation": "qué",
                      "translations": {
                          "ru": "что",
                          "es": "qué",
                          "en": "what"
                      },
                      "examples": [
                          {
                              "t": "<b>Что</b> это?",
                              "n": "¿Qué es esto?"
                          },
                          {
                              "t": "<b>Что</b> ты делаешь?",
                              "n": "¿Qué haces?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_15",
                      "letter": "г",
                      "word": "где",
                      "emoji": "📍",
                      "phonetic": "/gdye/",
                      "translation": "dónde",
                      "translations": {
                          "ru": "где",
                          "es": "dónde",
                          "en": "where"
                      },
                      "examples": [
                          {
                              "t": "<b>Где</b> туалет?",
                              "n": "¿Dónde está el baño?"
                          },
                          {
                              "t": "<b>Где</b> ты?",
                              "n": "¿Dónde estás?"
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_16",
                      "letter": "з",
                      "word": "здесь",
                      "emoji": "📍",
                      "phonetic": "/zdyes/",
                      "translation": "aquí",
                      "translations": {
                          "ru": "здесь",
                          "es": "aquí",
                          "en": "here"
                      },
                      "examples": [
                          {
                              "t": "Я <b>здесь</b>.",
                              "n": "Estoy aquí."
                          },
                          {
                              "t": "<b>Здесь</b> хорошо.",
                              "n": "Aquí se está bien."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_17",
                      "letter": "т",
                      "word": "там",
                      "emoji": "📍",
                      "phonetic": "/tam/",
                      "translation": "allí",
                      "translations": {
                          "ru": "там",
                          "es": "allí",
                          "en": "there"
                      },
                      "examples": [
                          {
                              "t": "Он <b>там</b>.",
                              "n": "Él está allí."
                          },
                          {
                              "t": "<b>Там</b> музей.",
                              "n": "Allí hay un museo."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_18",
                      "letter": "э",
                      "word": "это",
                      "emoji": "👉",
                      "phonetic": "/EH-ta/",
                      "translation": "esto, este",
                      "translations": {
                          "ru": "это",
                          "es": "esto, este",
                          "en": "this"
                      },
                      "examples": [
                          {
                              "t": "<b>Это</b> стол.",
                              "n": "Esto es una mesa."
                          },
                          {
                              "t": "<b>Это</b> мой брат.",
                              "n": "Este es mi hermano."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_19",
                      "letter": "и",
                      "word": "и",
                      "emoji": "➕",
                      "phonetic": "/ee/",
                      "translation": "y",
                      "translations": {
                          "ru": "и",
                          "es": "y",
                          "en": "and"
                      },
                      "examples": [
                          {
                              "t": "Мама <b>и</b> папа.",
                              "n": "Mamá y papá."
                          },
                          {
                              "t": "Хлеб <b>и</b> вода.",
                              "n": "Pan y agua."
                          }
                      ]
                  },
                  {
                      "id": "ru_a0_g4_20",
                      "letter": "и",
                      "word": "или",
                      "emoji": "🔀",
                      "phonetic": "/EE-lee/",
                      "translation": "o",
                      "translations": {
                          "ru": "или",
                          "es": "o",
                          "en": "or"
                      },
                      "examples": [
                          {
                              "t": "Чай <b>или</b> кофе?",
                              "n": "¿Té o café?"
                          },
                          {
                              "t": "Сегодня <b>или</b> завтра?",
                              "n": "¿Hoy o mañana?"
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // CHINO
  // ──────────────────────────────────────────────────────
  zh: {
      "level": "A0",
      "levelName": "Pinyin y tonos del chino mandarín",
      "groups": [
          {
              "id": "zh_a0_g1",
              "name": "Los 4 tonos",
              "icon": "🎵",
              "color": "#6366f1",
              "description": "El tono cambia completamente el significado",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "zh_a0_g1_L_1st_tone",
                      "isLetter": true,
                      "letter": "ā",
                      "word": "ā",
                      "emoji": "📈",
                      "phonetic": "/ā/",
                      "translation": "1er tono: <b>ā</b> – alto y plano, como cantar una nota sostenida. <i>Piensa en un robot.</i>",
                      "mnemonic": "Imagina una línea recta en lo alto, como un cable eléctrico tenso.",
                      "examples": [
                          {
                              "t": "<b>mā</b> = mamá (妈) <br> <b>bā</b> = ocho (八) <br> <b>tā</b> = él/ella (他/她)",
                              "n": "Ejemplos de primer tono"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_2nd_tone",
                      "isLetter": true,
                      "letter": "á",
                      "word": "á",
                      "emoji": "↗️",
                      "phonetic": "/á/",
                      "translation": "2do tono: <b>á</b> – ascendente, como preguntar <i>“¿Cómo?”</i> en español.",
                      "mnemonic": "Sube la voz como si no hubieras oído bien: ¿Mande?",
                      "examples": [
                          {
                              "t": "<b>má</b> = cáñamo/entumecido (麻) <br> <b>lái</b> = venir (来) <br> <b>nán</b> = difícil (难)",
                              "n": "Ejemplos de segundo tono"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_3rd_tone",
                      "isLetter": true,
                      "letter": "ǎ",
                      "word": "ǎ",
                      "emoji": "🔻🔺",
                      "phonetic": "/ǎ/",
                      "translation": "3er tono: <b>ǎ</b> – baja y luego sube, como un <i>“hmm…”</i> pensativo.",
                      "mnemonic": "Haz un movimiento de cabeza como si dudaras: ¿Hmm?",
                      "examples": [
                          {
                              "t": "<b>mǎ</b> = caballo (马) <br> <b>nǐ</b> = tú (你) <br> <b>hǎo</b> = bueno (好) <br> <b>wǒ</b> = yo (我)",
                              "n": "Ejemplos de tercer tono"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_4th_tone",
                      "isLetter": true,
                      "letter": "à",
                      "word": "à",
                      "emoji": "📉",
                      "phonetic": "/à/",
                      "translation": "4to tono: <b>à</b> – caída fuerte y corta, como un <i>“¡No!”</i> enfático.",
                      "mnemonic": "Golpea el suelo con el pie y di: ¡No!",
                      "examples": [
                          {
                              "t": "<b>mà</b> = regañar (骂) <br> <b>shì</b> = es/sí (是) <br> <b>bù</b> = no (不)",
                              "n": "Ejemplos de cuarto tono"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_neutral_tone",
                      "isLetter": true,
                      "letter": "ma",
                      "word": "ma",
                      "emoji": "⚖️",
                      "phonetic": "/ma/",
                      "translation": "Tono neutro: <b>ma</b> – ligero y sin énfasis, como una sílaba susurrada.",
                      "mnemonic": "Imagina una pluma cayendo suavemente al suelo.",
                      "examples": [
                          {
                              "t": "<b>ma</b> = partícula de pregunta (吗) <br> <b>ne</b> = partícula (呢) <br> <b>le</b> = partícula de cambio (了) <br> <b>ba</b> = partícula de sugerencia (吧) <br> <b>de</b> = partícula posesiva (的)",
                              "n": "Partículas comunes en tono neutro"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_tone_change",
                      "isLetter": true,
                      "letter": "nǐ hǎo",
                      "word": "nǐ hǎo",
                      "emoji": "🔄",
                      "phonetic": "/nǐ hǎo/",
                      "translation": "Regla de cambio de tono: <b>3er + 3er</b> → <b>2do + 3er</b>. <br> Ejemplo: <b>nǐ hǎo</b> se pronuncia <b>ní hǎo</b> (hola).",
                      "mnemonic": "Dos terceros tonos juntos suenan raro, así que el primero sube.",
                      "examples": [
                          {
                              "t": "<b>nǐ hǎo</b> → <b>ní hǎo</b> (hola) <br> <b>wǒ hěn hǎo</b> → <b>wó hén hǎo</b> (yo estoy muy bien)",
                              "n": "Cambio de tono en la práctica"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_bu_rule",
                      "isLetter": true,
                      "letter": "bù",
                      "word": "bù",
                      "emoji": "🚫",
                      "phonetic": "/bù/",
                      "translation": "Regla de <b>bù</b>: normalmente 4to tono, pero antes de otro 4to tono se convierte en 2do tono. <br> Ejemplo: <b>bú shì</b> (no es).",
                      "mnemonic": "Como un balón que rebota: si viene otro golpe, suaviza el tuyo.",
                      "examples": [
                          {
                              "t": "<b>bù</b> hǎo = no bueno (mal) <br> <b>bú</b> shì = no es (不 + 是)",
                              "n": "Ejemplos de la regla de bù"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_L_mama",
                      "isLetter": true,
                      "letter": "mā má mǎ mà ma",
                      "word": "mā má mǎ mà ma",
                      "emoji": "🎭",
                      "phonetic": "/mā má mǎ mà ma/",
                      "translation": "El famoso ejemplo: <b>mā</b> (mamá), <b>má</b> (cáñamo), <b>mǎ</b> (caballo), <b>mà</b> (regañar), <b>ma</b> (partícula).",
                      "mnemonic": "Imagina a una madre montando un caballo que se vuelve loco y la regaña.",
                      "examples": [
                          {
                              "t": "<b>mā</b> = mamá (妈) <br> <b>má</b> = cáñamo (麻) <br> <b>mǎ</b> = caballo (马) <br> <b>mà</b> = regañar (骂) <br> <b>ma</b> = partícula (吗)",
                              "n": "El contexto es clave para entender el significado."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_01",
                      "isLetter": false,
                      "letter": "mā",
                      "word": "妈妈",
                      "emoji": "👩‍👧",
                      "phonetic": "/māma/",
                      "translation": "<b>māma</b> – mamá",
                      "translations": {
                          "zh": "妈妈",
                          "es": "mamá",
                          "en": "mom"
                      },
                      "examples": [
                          {
                              "t": "<b>妈妈</b> 好。",
                              "n": "Mamá está bien."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_02",
                      "isLetter": false,
                      "letter": "bā",
                      "word": "八",
                      "emoji": "8️⃣",
                      "phonetic": "/bā/",
                      "translation": "<b>bā</b> – ocho",
                      "translations": {
                          "zh": "八",
                          "es": "ocho",
                          "en": "eight"
                      },
                      "examples": [
                          {
                              "t": "我有 <b>八</b> 个苹果。",
                              "n": "Tengo ocho manzanas."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_03",
                      "isLetter": false,
                      "letter": "má",
                      "word": "麻",
                      "emoji": "🌿",
                      "phonetic": "/má/",
                      "translation": "<b>má</b> – cáñamo, entumecido",
                      "translations": {
                          "zh": "麻",
                          "es": "cáñamo, entumecido",
                          "en": "hemp, numb"
                      },
                      "examples": [
                          {
                              "t": "我的腿 <b>麻</b> 了。",
                              "n": "Mi pierna se entumeció."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_04",
                      "isLetter": false,
                      "letter": "lái",
                      "word": "来",
                      "emoji": "🚶",
                      "phonetic": "/lái/",
                      "translation": "<b>lái</b> – venir",
                      "translations": {
                          "zh": "来",
                          "es": "venir",
                          "en": "to come"
                      },
                      "examples": [
                          {
                              "t": "请 <b>来</b> 我家。",
                              "n": "Por favor ven a mi casa."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_05",
                      "isLetter": false,
                      "letter": "mǎ",
                      "word": "马",
                      "emoji": "🐴",
                      "phonetic": "/mǎ/",
                      "translation": "<b>mǎ</b> – caballo",
                      "translations": {
                          "zh": "马",
                          "es": "caballo",
                          "en": "horse"
                      },
                      "examples": [
                          {
                              "t": "那是一匹 <b>马</b>。",
                              "n": "Eso es un caballo."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_06",
                      "isLetter": false,
                      "letter": "nǐ",
                      "word": "你",
                      "emoji": "👉",
                      "phonetic": "/nǐ/",
                      "translation": "<b>nǐ</b> – tú",
                      "translations": {
                          "zh": "你",
                          "es": "tú",
                          "en": "you"
                      },
                      "examples": [
                          {
                              "t": "<b>你</b> 好。",
                              "n": "Hola."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_07",
                      "isLetter": false,
                      "letter": "hǎo",
                      "word": "好",
                      "emoji": "👍",
                      "phonetic": "/hǎo/",
                      "translation": "<b>hǎo</b> – bueno, bien",
                      "translations": {
                          "zh": "好",
                          "es": "bueno, bien",
                          "en": "good"
                      },
                      "examples": [
                          {
                              "t": "我 <b>好</b>。",
                              "n": "Estoy bien."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_08",
                      "isLetter": false,
                      "letter": "mà",
                      "word": "骂",
                      "emoji": "😠",
                      "phonetic": "/mà/",
                      "translation": "<b>mà</b> – regañar, insultar",
                      "translations": {
                          "zh": "骂",
                          "es": "regañar, insultar",
                          "en": "to scold"
                      },
                      "examples": [
                          {
                              "t": "妈妈 <b>骂</b> 我。",
                              "n": "Mamá me regaña."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_09",
                      "isLetter": false,
                      "letter": "shì",
                      "word": "是",
                      "emoji": "✅",
                      "phonetic": "/shì/",
                      "translation": "<b>shì</b> – ser, estar, sí",
                      "translations": {
                          "zh": "是",
                          "es": "ser, estar, sí",
                          "en": "to be, yes"
                      },
                      "examples": [
                          {
                              "t": "我 <b>是</b> 学生。",
                              "n": "Soy estudiante."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g1_10",
                      "isLetter": false,
                      "letter": "bù",
                      "word": "不",
                      "emoji": "🙅",
                      "phonetic": "/bù/",
                      "translation": "<b>bù</b> – no, negación",
                      "translations": {
                          "zh": "不",
                          "es": "no",
                          "en": "not, no"
                      },
                      "examples": [
                          {
                              "t": "我 <b>不</b> 好。",
                              "n": "No estoy bien."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "zh_a0_g2",
              "name": "Iniciales (consonantes)",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "b p m f / d t n l / g k h / j q x / zh ch sh r / z c s",
              "reviewFrom": [
                  "zh_a0_g1"
              ],
              "cards": [
                  {
                      "id": "zh_a0_g2_L_b",
                      "isLetter": true,
                      "letter": "b",
                      "word": "b",
                      "emoji": "🔤",
                      "phonetic": "/b̥/",
                      "translation": "<b>b</b> — oclusiva bilabial <b>no aspirada</b> (como la <i>p</i> española, pero más suave y sin soplo).",
                      "mnemonic": "Imagina una <b>B</b> española que pierde la voz: se queda muda, como una <i>p</i> suave.",
                      "examples": [
                          {
                              "t": "<b>b</b>ā — <i>ocho</i> (número de la suerte)",
                              "n": "El sonido es corto y seco, sin aire."
                          },
                          {
                              "t": "<b>b</b>à — <i>tener miedo</i>",
                              "n": "Contraste con p: b no sopla, p sí."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_p",
                      "isLetter": true,
                      "letter": "p",
                      "word": "p",
                      "emoji": "🔤",
                      "phonetic": "/pʰ/",
                      "translation": "<b>p</b> — oclusiva bilabial <b>aspirada</b> (con un soplo fuerte, como la <i>p</i> inglesa inicial).",
                      "mnemonic": "Imagina una <b>p</b> que 'puf' — suelta aire como una pequeña explosión.",
                      "examples": [
                          {
                              "t": "<b>p</b>à — <i>tener miedo</i>",
                              "n": "El soplo es clave: pon la mano delante de la boca."
                          },
                          {
                              "t": "<b>p</b>íngguǒ — <i>manzana</i>",
                              "n": "Palabra común con p aspirada."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_m",
                      "isLetter": true,
                      "letter": "m",
                      "word": "m",
                      "emoji": "🔤",
                      "phonetic": "/m/",
                      "translation": "<b>m</b> — nasal bilabial, como la <i>m</i> del español.",
                      "mnemonic": "La <b>m</b> es igual que en español: 'mmm' de pensar.",
                      "examples": [
                          {
                              "t": "<b>m</b>āo — <i>gato</i>",
                              "n": "Sonido nasal, vibran las cuerdas vocales."
                          },
                          {
                              "t": "<b>m</b>ā — <i>mamá</i>",
                              "n": "La sílaba 'ma' con tono alto."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_f",
                      "isLetter": true,
                      "letter": "f",
                      "word": "f",
                      "emoji": "🔤",
                      "phonetic": "/f/",
                      "translation": "<b>f</b> — fricativa labiodental, como la <i>f</i> del español.",
                      "mnemonic": "La <b>f</b> de 'fácil' — igual que en español.",
                      "examples": [
                          {
                              "t": "<b>f</b>ēi — <i>volar</i>",
                              "n": "La f sale con el labio inferior contra los dientes."
                          },
                          {
                              "t": "<b>f</b>àn — <i>arroz cocido / comida</i>",
                              "n": "Palabra muy común."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_d",
                      "isLetter": true,
                      "letter": "d",
                      "word": "d",
                      "emoji": "🔤",
                      "phonetic": "/d̥/",
                      "translation": "<b>d</b> — oclusiva alveolar <b>no aspirada</b> (como la <i>t</i> española, pero más suave).",
                      "mnemonic": "Una <b>d</b> que se queda sorda: como una <i>t</i> suave, sin el sonido de voz.",
                      "examples": [
                          {
                              "t": "<b>d</b>à — <i>grande</i>",
                              "n": "Contraste: d no sopla, t sí."
                          },
                          {
                              "t": "<b>d</b>ì — <i>tierra / suelo</i>",
                              "n": "Sonido corto y seco."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_t",
                      "isLetter": true,
                      "letter": "t",
                      "word": "t",
                      "emoji": "🔤",
                      "phonetic": "/tʰ/",
                      "translation": "<b>t</b> — oclusiva alveolar <b>aspirada</b> (con soplo fuerte, como la <i>t</i> inglesa inicial).",
                      "mnemonic": "La <b>t</b> de 'toma' pero con un soplo: pon la mano y siente el aire.",
                      "examples": [
                          {
                              "t": "<b>t</b>ā — <i>él / ella</i>",
                              "n": "El soplo es esencial."
                          },
                          {
                              "t": "<b>t</b>īng — <i>escuchar</i>",
                              "n": "Palabra común."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_n",
                      "isLetter": true,
                      "letter": "n",
                      "word": "n",
                      "emoji": "🔤",
                      "phonetic": "/n/",
                      "translation": "<b>n</b> — nasal alveolar, como la <i>n</i> del español.",
                      "mnemonic": "La <b>n</b> de 'nariz' — igual que en español.",
                      "examples": [
                          {
                              "t": "<b>n</b>ǐ — <i>tú</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>n</b>ǚ — <i>mujer</i>",
                              "n": "Sonido nasal."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_l",
                      "isLetter": true,
                      "letter": "l",
                      "word": "l",
                      "emoji": "🔤",
                      "phonetic": "/l/",
                      "translation": "<b>l</b> — lateral alveolar, como la <i>l</i> del español.",
                      "mnemonic": "La <b>l</b> de 'luna' — igual que en español.",
                      "examples": [
                          {
                              "t": "<b>l</b>ái — <i>venir</i>",
                              "n": "Palabra común."
                          },
                          {
                              "t": "<b>l</b>ǎo — <i>viejo</i>",
                              "n": "En 'lǎoshī' (profesor)."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_g",
                      "isLetter": true,
                      "letter": "g",
                      "word": "g",
                      "emoji": "🔤",
                      "phonetic": "/k̚/",
                      "translation": "<b>g</b> — oclusiva velar <b>no aspirada</b> (como la <i>k</i> española, pero sin soplo).",
                      "mnemonic": "La <b>g</b> suena como una <i>k</i> suave, como en 'gato' pero sin voz.",
                      "examples": [
                          {
                              "t": "<b>g</b>ǒu — <i>perro</i>",
                              "n": "Sonido seco."
                          },
                          {
                              "t": "<b>g</b>āo — <i>alto</i>",
                              "n": "Contraste con k."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_k",
                      "isLetter": true,
                      "letter": "k",
                      "word": "k",
                      "emoji": "🔤",
                      "phonetic": "/kʰ/",
                      "translation": "<b>k</b> — oclusiva velar <b>aspirada</b> (con soplo fuerte, como la <i>k</i> inglesa inicial).",
                      "mnemonic": "La <b>k</b> de 'kilo' pero con un soplo: siente el aire en la palma.",
                      "examples": [
                          {
                              "t": "<b>k</b>āi — <i>abrir</i>",
                              "n": "El soplo es clave."
                          },
                          {
                              "t": "<b>k</b>àn — <i>ver</i>",
                              "n": "Palabra común."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_h",
                      "isLetter": true,
                      "letter": "h",
                      "word": "h",
                      "emoji": "🔤",
                      "phonetic": "/x/",
                      "translation": "<b>h</b> — fricativa velar sorda (como la <i>j</i> española, pero más suave).",
                      "mnemonic": "La <b>h</b> suena como la <i>j</i> de 'jamón' pero más relajada, como un suspiro.",
                      "examples": [
                          {
                              "t": "<b>h</b>ǎo — <i>bien / bueno</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>h</b>ē — <i>beber</i>",
                              "n": "Sonido fricativo."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_j",
                      "isLetter": true,
                      "letter": "j",
                      "word": "j",
                      "emoji": "🔤",
                      "phonetic": "/tɕ/",
                      "translation": "<b>j</b> — africada palatal <b>no aspirada</b> (como la <i>ch</i> española, pero más suave y sin soplo).",
                      "mnemonic": "La <b>j</b> suena como una <i>ch</i> suave de 'muchacho' pero sin aire, con la lengua pegada al paladar.",
                      "examples": [
                          {
                              "t": "<b>j</b>iā — <i>casa / hogar</i>",
                              "n": "Solo aparece antes de i o ü."
                          },
                          {
                              "t": "<b>j</b>ǐ — <i>varios</i>",
                              "n": "Contraste con q."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_q",
                      "isLetter": true,
                      "letter": "q",
                      "word": "q",
                      "emoji": "🔤",
                      "phonetic": "/tɕʰ/",
                      "translation": "<b>q</b> — africada palatal <b>aspirada</b> (como la <i>ch</i> española, pero con soplo fuerte).",
                      "mnemonic": "La <b>q</b> es como una <i>ch</i> con un soplo: pon la mano y siente el aire.",
                      "examples": [
                          {
                              "t": "<b>q</b>ǐng — <i>por favor</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>q</b>ù — <i>ir</i>",
                              "n": "El soplo es clave."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_x",
                      "isLetter": true,
                      "letter": "x",
                      "word": "x",
                      "emoji": "🔤",
                      "phonetic": "/ɕ/",
                      "translation": "<b>x</b> — fricativa palatal sorda (como una <i>sh</i> suave, con la lengua en el paladar).",
                      "mnemonic": "La <b>x</b> suena como un 'sh' pero con una sonrisa: como 'she' en inglés, pero más suave.",
                      "examples": [
                          {
                              "t": "<b>x</b>iǎo — <i>pequeño</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>x</b>iè — <i>gracias</i>",
                              "n": "En 'xièxie'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_zh",
                      "isLetter": true,
                      "letter": "zh",
                      "word": "zh",
                      "emoji": "🔤",
                      "phonetic": "/ʈʂ/",
                      "translation": "<b>zh</b> — retrofleja <b>no aspirada</b> (como una <i>ch</i> española, pero con la lengua curvada hacia atrás, sin soplo).",
                      "mnemonic": "Imagina una <i>ch</i> con la lengua hacia atrás, como si dijeras 'dr' en inglés.",
                      "examples": [
                          {
                              "t": "<b>zh</b>ōng — <i>centro / medio</i>",
                              "n": "En 'Zhōngguó' (China)."
                          },
                          {
                              "t": "<b>zh</b>ī — <i>saber</i>",
                              "n": "Contraste con ch."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_ch",
                      "isLetter": true,
                      "letter": "ch",
                      "word": "ch",
                      "emoji": "🔤",
                      "phonetic": "/ʈʂʰ/",
                      "translation": "<b>ch</b> — retrofleja <b>aspirada</b> (como la <i>ch</i> española, pero con la lengua curvada y con soplo fuerte).",
                      "mnemonic": "La <b>ch</b> de 'chico' pero con la lengua hacia atrás y un soplo fuerte.",
                      "examples": [
                          {
                              "t": "<b>ch</b>ī — <i>comer</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>ch</b>ē — <i>coche</i>",
                              "n": "El soplo es clave."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_sh",
                      "isLetter": true,
                      "letter": "sh",
                      "word": "sh",
                      "emoji": "🔤",
                      "phonetic": "/ʂ/",
                      "translation": "<b>sh</b> — retrofleja fricativa sorda (como la <i>sh</i> inglesa, pero con la lengua curvada hacia atrás).",
                      "mnemonic": "La <b>sh</b> de 'show' pero con la punta de la lengua hacia arriba y atrás.",
                      "examples": [
                          {
                              "t": "<b>sh</b>ū — <i>libro</i>",
                              "n": "Palabra común."
                          },
                          {
                              "t": "<b>sh</b>ì — <i>ser</i>",
                              "n": "Verbo esencial."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_r",
                      "isLetter": true,
                      "letter": "r",
                      "word": "r",
                      "emoji": "🔤",
                      "phonetic": "/ʐ/",
                      "translation": "<b>r</b> — retrofleja sonora (como una <i>r</i> española pero con la lengua curvada hacia atrás, vibrando).",
                      "mnemonic": "La <b>r</b> suena como una <i>r</i> suave pero con la lengua hacia atrás, como un 'r' arrastrada.",
                      "examples": [
                          {
                              "t": "<b>r</b>én — <i>persona</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>r</b>ì — <i>día</i>",
                              "n": "En 'rìběn' (Japón)."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_z",
                      "isLetter": true,
                      "letter": "z",
                      "word": "z",
                      "emoji": "🔤",
                      "phonetic": "/ts/",
                      "translation": "<b>z</b> — africada alveolar <b>no aspirada</b> (como la <i>ds</i> en inglés 'kids', pero sin voz).",
                      "mnemonic": "La <b>z</b> suena como una <i>ts</i> suave, como el sonido de una abeja 'zzz' pero con la lengua en los dientes.",
                      "examples": [
                          {
                              "t": "<b>z</b>ài — <i>estar en / de nuevo</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>z</b>ǎo — <i>temprano</i>",
                              "n": "Contraste con c."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_c",
                      "isLetter": true,
                      "letter": "c",
                      "word": "c",
                      "emoji": "🔤",
                      "phonetic": "/tsʰ/",
                      "translation": "<b>c</b> — africada alveolar <b>aspirada</b> (como la <i>ts</i> en inglés 'cats', pero con soplo fuerte).",
                      "mnemonic": "La <b>c</b> suena como un 'ts' con un soplo: como si dijeras 'tsunami' con un aire extra.",
                      "examples": [
                          {
                              "t": "<b>c</b>ài — <i>plato / verdura</i>",
                              "n": "Palabra común."
                          },
                          {
                              "t": "<b>c</b>óng — <i>desde</i>",
                              "n": "El soplo es clave."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_L_s",
                      "isLetter": true,
                      "letter": "s",
                      "word": "s",
                      "emoji": "🔤",
                      "phonetic": "/s/",
                      "translation": "<b>s</b> — fricativa alveolar sorda, como la <i>s</i> del español.",
                      "mnemonic": "La <b>s</b> de 'sol' — igual que en español.",
                      "examples": [
                          {
                              "t": "<b>s</b>ān — <i>tres</i>",
                              "n": "Palabra esencial."
                          },
                          {
                              "t": "<b>s</b>uì — <i>años (edad)</i>",
                              "n": "En 'nǐ suì' (¿cuántos años?)."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_01",
                      "isLetter": false,
                      "letter": "b",
                      "word": "bā",
                      "emoji": "8️⃣",
                      "phonetic": "/paː˥/",
                      "translation": "<b>ocho</b> (bā) — número de la suerte en China.",
                      "translations": {
                          "zh": "八",
                          "es": "ocho",
                          "en": "eight"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yǒu <b>bā</b> gè píngguǒ.",
                              "n": "Tengo ocho manzanas."
                          },
                          {
                              "t": "<b>bā</b> shì wǒ de jíshù.",
                              "n": "El ocho es mi número de la suerte."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_02",
                      "isLetter": false,
                      "letter": "m",
                      "word": "māo",
                      "emoji": "🐱",
                      "phonetic": "/maʊ̯˥/",
                      "translation": "<b>gato</b> (māo) — el sonido 'mao' suena como un maullido.",
                      "translations": {
                          "zh": "猫",
                          "es": "gato",
                          "en": "cat"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yǒu yī zhī <b>māo</b>.",
                              "n": "Tengo un gato."
                          },
                          {
                              "t": "<b>māo</b> hěn kě'ài.",
                              "n": "El gato es muy lindo."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_03",
                      "isLetter": false,
                      "letter": "d",
                      "word": "dà",
                      "emoji": "🐘",
                      "phonetic": "/ta˥˩/",
                      "translation": "<b>grande</b> (dà) — con la boca bien abierta.",
                      "translations": {
                          "zh": "大",
                          "es": "grande",
                          "en": "big"
                      },
                      "examples": [
                          {
                              "t": "Zhège píngguǒ hěn <b>dà</b>.",
                              "n": "Esta manzana es muy grande."
                          },
                          {
                              "t": "Wǒ de jiā hěn <b>dà</b>.",
                              "n": "Mi casa es grande."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_04",
                      "isLetter": false,
                      "letter": "n",
                      "word": "nǐ",
                      "emoji": "👋",
                      "phonetic": "/ni˨˩˦/",
                      "translation": "<b>tú</b> (nǐ) — la forma de dirigirse a alguien.",
                      "translations": {
                          "zh": "你",
                          "es": "tú",
                          "en": "you"
                      },
                      "examples": [
                          {
                              "t": "<b>nǐ</b> hǎo!",
                              "n": "¡Hola!"
                          },
                          {
                              "t": "<b>nǐ</b> jiào shénme míngzi?",
                              "n": "¿Cómo te llamas?"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_05",
                      "isLetter": false,
                      "letter": "g",
                      "word": "gǒu",
                      "emoji": "🐶",
                      "phonetic": "/koʊ̯˨˩˦/",
                      "translation": "<b>perro</b> (gǒu) — el sonido 'gou' recuerda a un ladrido grave.",
                      "translations": {
                          "zh": "狗",
                          "es": "perro",
                          "en": "dog"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yǒu yī zhī <b>gǒu</b>.",
                              "n": "Tengo un perro."
                          },
                          {
                              "t": "<b>gǒu</b> hěn cōngmíng.",
                              "n": "El perro es muy inteligente."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_06",
                      "isLetter": false,
                      "letter": "h",
                      "word": "hǎo",
                      "emoji": "👍",
                      "phonetic": "/xaʊ̯˨˩˦/",
                      "translation": "<b>bien / bueno</b> (hǎo) — la palabra más útil para saludar.",
                      "translations": {
                          "zh": "好",
                          "es": "bien / bueno",
                          "en": "good"
                      },
                      "examples": [
                          {
                              "t": "Nǐ <b>hǎo</b>!",
                              "n": "¡Hola! (literal: tú bien)"
                          },
                          {
                              "t": "Zhège hěn <b>hǎo</b>.",
                              "n": "Esto es muy bueno."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_07",
                      "isLetter": false,
                      "letter": "j",
                      "word": "jiā",
                      "emoji": "🏠",
                      "phonetic": "/tɕja˥/",
                      "translation": "<b>casa / hogar</b> (jiā) — el lugar donde está la familia.",
                      "translations": {
                          "zh": "家",
                          "es": "casa / hogar",
                          "en": "home"
                      },
                      "examples": [
                          {
                              "t": "Wǒ huí <b>jiā</b>.",
                              "n": "Vuelvo a casa."
                          },
                          {
                              "t": "Zhè shì wǒ de <b>jiā</b>.",
                              "n": "Esta es mi casa."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_08",
                      "isLetter": false,
                      "letter": "q",
                      "word": "qǐng",
                      "emoji": "🙏",
                      "phonetic": "/tɕʰiŋ˨˩˦/",
                      "translation": "<b>por favor</b> (qǐng) — también significa 'invitar'.",
                      "translations": {
                          "zh": "请",
                          "es": "por favor",
                          "en": "please"
                      },
                      "examples": [
                          {
                              "t": "<b>qǐng</b> jìn.",
                              "n": "Por favor, pase."
                          },
                          {
                              "t": "<b>qǐng</b> wèn, nǐ hǎo ma?",
                              "n": "Por favor, ¿cómo estás?"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_09",
                      "isLetter": false,
                      "letter": "x",
                      "word": "xiǎo",
                      "emoji": "🐭",
                      "phonetic": "/ɕjaʊ̯˨˩˦/",
                      "translation": "<b>pequeño</b> (xiǎo) — se usa mucho para objetos pequeños o cariño.",
                      "translations": {
                          "zh": "小",
                          "es": "pequeño",
                          "en": "small"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yǒu yī zhī <b>xiǎo</b> gǒu.",
                              "n": "Tengo un perro pequeño."
                          },
                          {
                              "t": "<b>xiǎo</b> māo hěn kě'ài.",
                              "n": "El gatito es muy lindo."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_10",
                      "isLetter": false,
                      "letter": "ch",
                      "word": "chī",
                      "emoji": "🍚",
                      "phonetic": "/ʈʂʰɻ̩˥/",
                      "translation": "<b>comer</b> (chī) — acción esencial en la vida.",
                      "translations": {
                          "zh": "吃",
                          "es": "comer",
                          "en": "eat"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yào <b>chī</b> fàn.",
                              "n": "Quiero comer arroz."
                          },
                          {
                              "t": "Nǐ <b>chī</b> le ma?",
                              "n": "¿Ya comiste?"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_11",
                      "isLetter": false,
                      "letter": "sh",
                      "word": "shū",
                      "emoji": "📚",
                      "phonetic": "/ʂu˥/",
                      "translation": "<b>libro</b> (shū) — el sonido 'shu' recuerda a 'shhh' de biblioteca.",
                      "translations": {
                          "zh": "书",
                          "es": "libro",
                          "en": "book"
                      },
                      "examples": [
                          {
                              "t": "Wǒ kàn <b>shū</b>.",
                              "n": "Leo un libro."
                          },
                          {
                              "t": "Zhè běn <b>shū</b> hěn yǒuyì.",
                              "n": "Este libro es interesante."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g2_12",
                      "isLetter": false,
                      "letter": "s",
                      "word": "sān",
                      "emoji": "3️⃣",
                      "phonetic": "/san˥/",
                      "translation": "<b>tres</b> (sān) — número básico.",
                      "translations": {
                          "zh": "三",
                          "es": "tres",
                          "en": "three"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yǒu <b>sān</b> gè píngguǒ.",
                              "n": "Tengo tres manzanas."
                          },
                          {
                              "t": "<b>sān</b> shì wǒ de jíshù.",
                              "n": "El tres es mi número de la suerte."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "zh_a0_g3",
              "name": "Finales (vocales y nasales)",
              "icon": "🔤",
              "color": "#10b981",
              "description": "a o e i u ü — simples, diptongos y nasales",
              "reviewFrom": [
                  "zh_a0_g1",
                  "zh_a0_g2"
              ],
              "cards": [
                  {
                      "id": "zh_a0_g3_L_a",
                      "isLetter": true,
                      "letter": "a",
                      "word": "a",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "Sonido <b>a</b> como en español «<i>casa</i>»",
                      "mnemonic": "Una vocal abierta, como la 'a' de 'amigo'.",
                      "examples": [
                          {
                              "t": "<b>a</b> es la primera vocal.",
                              "n": "a es la primera vocal."
                          },
                          {
                              "t": "Mira la <b>a</b> en <span class='hl'>māo</span> (gato).",
                              "n": "Mira la a en māo (gato)."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_o",
                      "isLetter": true,
                      "letter": "o",
                      "word": "o",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "Sonido <b>o</b> como en español «<i>sol</i>»",
                      "mnemonic": "Redondea los labios como al decir 'o' en 'sol'.",
                      "examples": [
                          {
                              "t": "<b>o</b> es redonda.",
                              "n": "o es redonda."
                          },
                          {
                              "t": "La <b>o</b> en <span class='hl'>gǒu</span> (perro).",
                              "n": "La o en gǒu (perro)."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_e",
                      "isLetter": true,
                      "letter": "e",
                      "word": "e",
                      "emoji": "🔤",
                      "phonetic": "/ɤ/",
                      "translation": "Sonido <b>e</b> profundo, sin equivalente en español (como <i>“e”</i> en inglés «<i>her</i>»)",
                      "mnemonic": "Imagina una 'e' que sale de la garganta, como un sonido gutural.",
                      "examples": [
                          {
                              "t": "<b>e</b> suena desde la garganta.",
                              "n": "e suena desde la garganta."
                          },
                          {
                              "t": "En <span class='hl'>rén</span> (persona) la <b>e</b> es gutural.",
                              "n": "En rén (persona) la e es gutural."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_i",
                      "isLetter": true,
                      "letter": "i",
                      "word": "i",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "Sonido <b>i</b> como en español «<i>sí</i>»",
                      "mnemonic": "La 'i' es una línea recta con un punto, como un dedo señalando.",
                      "examples": [
                          {
                              "t": "<b>i</b> es como en 'sí'.",
                              "n": "i es como en 'sí'."
                          },
                          {
                              "t": "La <b>i</b> en <span class='hl'>lín</span> (bosque).",
                              "n": "La i en lín (bosque)."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_u",
                      "isLetter": true,
                      "letter": "u",
                      "word": "u",
                      "emoji": "🔤",
                      "phonetic": "/u/",
                      "translation": "Sonido <b>u</b> como en español «<i>luna</i>»",
                      "mnemonic": "La 'u' es como una taza que contiene el sonido.",
                      "examples": [
                          {
                              "t": "<b>u</b> como en 'luna'.",
                              "n": "u como en 'luna'."
                          },
                          {
                              "t": "La <b>u</b> en <span class='hl'>nán</span> (sur) no aparece, pero piensa en 'u' para la nasal.",
                              "n": "La u en nán (sur) no aparece, pero piensa en 'u' para la nasal."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ü",
                      "isLetter": true,
                      "letter": "ü",
                      "word": "ü",
                      "emoji": "🔤",
                      "phonetic": "/y/",
                      "translation": "Sonido <b>ü</b> como una <b>i</b> con los labios redondeados (como en francés «<i>tu</i>»)",
                      "mnemonic": "Di 'i' y redondea los labios como para 'u'. Es la 'i' con labios de 'u'.",
                      "examples": [
                          {
                              "t": "<b>ü</b> se escribe <i>u</i> después de j, q, x, y.",
                              "n": "ü se escribe u después de j, q, x, y."
                          },
                          {
                              "t": "En <span class='hl'>nǚ</span> (mujer) suena <b>ü</b>.",
                              "n": "En nǚ (mujer) suena ü."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ai",
                      "isLetter": true,
                      "letter": "ai",
                      "word": "ai",
                      "emoji": "🔤",
                      "phonetic": "/aɪ/",
                      "translation": "Diptongo <b>ai</b> como en español «<i>aire</i>»",
                      "mnemonic": "Combina 'a' y 'i' rápidamente: 'ai' como en 'aire'.",
                      "examples": [
                          {
                              "t": "<b>ai</b> suena como 'aire'.",
                              "n": "ai suena como 'aire'."
                          },
                          {
                              "t": "En <span class='hl'>māo</span> (gato) no hay ai, pero en <span class='hl'>bái</span> (blanco) sí.",
                              "n": "En māo (gato) no hay ai, pero en bái (blanco) sí."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ei",
                      "isLetter": true,
                      "letter": "ei",
                      "word": "ei",
                      "emoji": "🔤",
                      "phonetic": "/eɪ/",
                      "translation": "Diptongo <b>ei</b> como en inglés «<i>day</i>» (sin equivalente exacto en español)",
                      "mnemonic": "Suena como 'ei' en 'rey' pero más cerrado.",
                      "examples": [
                          {
                              "t": "<b>ei</b> en <span class='hl'>bèi</span> (espalda).",
                              "n": "ei en bèi (espalda)."
                          },
                          {
                              "t": "Di <b>ei</b> como en 'rey'.",
                              "n": "Di ei como en 'rey'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ao",
                      "isLetter": true,
                      "letter": "ao",
                      "word": "ao",
                      "emoji": "🔤",
                      "phonetic": "/ɑʊ/",
                      "translation": "Diptongo <b>ao</b> como en español «<i>causa</i>» (pero más abierto)",
                      "mnemonic": "Imagina 'a' + 'o' como un grito de asombro: ¡ao!",
                      "examples": [
                          {
                              "t": "<b>ao</b> en <span class='hl'>māo</span> (gato).",
                              "n": "ao en māo (gato)."
                          },
                          {
                              "t": "La <b>ao</b> suena como 'au' en 'causa'.",
                              "n": "La ao suena como 'au' en 'causa'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ou",
                      "isLetter": true,
                      "letter": "ou",
                      "word": "ou",
                      "emoji": "🔤",
                      "phonetic": "/oʊ/",
                      "translation": "Diptongo <b>ou</b> como en inglés «<i>go</i>» (sin equivalente exacto en español)",
                      "mnemonic": "Suena como 'ou' en 'you' pero más abierto.",
                      "examples": [
                          {
                              "t": "<b>ou</b> en <span class='hl'>gǒu</span> (perro).",
                              "n": "ou en gǒu (perro)."
                          },
                          {
                              "t": "Di <b>ou</b> como en 'go' en inglés.",
                              "n": "Di ou como en 'go' en inglés."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ia",
                      "isLetter": true,
                      "letter": "ia",
                      "word": "ia",
                      "emoji": "🔤",
                      "phonetic": "/ia/",
                      "translation": "Diptongo <b>ia</b> como en español «<i>hacia</i>»",
                      "mnemonic": "Es 'i' + 'a' rápidamente: 'ia' como en 'hacia'.",
                      "examples": [
                          {
                              "t": "<b>ia</b> en <span class='hl'>jiā</span> (casa).",
                              "n": "ia en jiā (casa)."
                          },
                          {
                              "t": "La <b>ia</b> suena como en 'hacia'.",
                              "n": "La ia suena como en 'hacia'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ie",
                      "isLetter": true,
                      "letter": "ie",
                      "word": "ie",
                      "emoji": "🔤",
                      "phonetic": "/ie/",
                      "translation": "Diptongo <b>ie</b> como en español «<i>pie</i>»",
                      "mnemonic": "Es 'i' + 'e' rápidamente: 'ie' como en 'pie'.",
                      "examples": [
                          {
                              "t": "<b>ie</b> en <span class='hl'>qié</span> (berenjena).",
                              "n": "ie en qié (berenjena)."
                          },
                          {
                              "t": "La <b>ie</b> suena como en 'pie'.",
                              "n": "La ie suena como en 'pie'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ua",
                      "isLetter": true,
                      "letter": "ua",
                      "word": "ua",
                      "emoji": "🔤",
                      "phonetic": "/ua/",
                      "translation": "Diptongo <b>ua</b> como en español «<i>agua</i>»",
                      "mnemonic": "Es 'u' + 'a' rápidamente: 'ua' como en 'agua'.",
                      "examples": [
                          {
                              "t": "<b>ua</b> en <span class='hl'>huā</span> (flor).",
                              "n": "ua en huā (flor)."
                          },
                          {
                              "t": "La <b>ua</b> suena como en 'agua'.",
                              "n": "La ua suena como en 'agua'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_uo",
                      "isLetter": true,
                      "letter": "uo",
                      "word": "uo",
                      "emoji": "🔤",
                      "phonetic": "/uo/",
                      "translation": "Diptongo <b>uo</b> como en español «<i>cuota</i>»",
                      "mnemonic": "Es 'u' + 'o' rápidamente: 'uo' como en 'cuota'.",
                      "examples": [
                          {
                              "t": "<b>uo</b> en <span class='hl'>guǒ</span> (fruta).",
                              "n": "uo en guǒ (fruta)."
                          },
                          {
                              "t": "La <b>uo</b> suena como en 'cuota'.",
                              "n": "La uo suena como en 'cuota'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_üe",
                      "isLetter": true,
                      "letter": "üe",
                      "word": "üe",
                      "emoji": "🔤",
                      "phonetic": "/ye/",
                      "translation": "Diptongo <b>üe</b> como una <b>ü</b> + <b>e</b> (redondea los labios y luego sonríe)",
                      "mnemonic": "Empieza con los labios redondeados (ü) y termina con 'e'.",
                      "examples": [
                          {
                              "t": "<b>üe</b> en <span class='hl'>yuè</span> (luna).",
                              "n": "üe en yuè (luna)."
                          },
                          {
                              "t": "Después de y, <b>üe</b> se escribe <i>ue</i>.",
                              "n": "Después de y, üe se escribe ue."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_an",
                      "isLetter": true,
                      "letter": "an",
                      "word": "an",
                      "emoji": "🔤",
                      "phonetic": "/an/",
                      "translation": "Final nasal <b>an</b> como en español «<i>pan</i>» (la lengua toca los dientes)",
                      "mnemonic": "Como 'an' en 'pan', pero con la lengua tocando los dientes superiores.",
                      "examples": [
                          {
                              "t": "<b>an</b> en <span class='hl'>nán</span> (sur).",
                              "n": "an en nán (sur)."
                          },
                          {
                              "t": "La <b>an</b> suena como en 'pan'.",
                              "n": "La an suena como en 'pan'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_en",
                      "isLetter": true,
                      "letter": "en",
                      "word": "en",
                      "emoji": "🔤",
                      "phonetic": "/ən/",
                      "translation": "Final nasal <b>en</b> como en inglés «<i>open</i>» (schwa + n)",
                      "mnemonic": "Suena como 'en' en 'open' pero con la lengua tocando los dientes.",
                      "examples": [
                          {
                              "t": "<b>en</b> en <span class='hl'>rén</span> (persona).",
                              "n": "en en rén (persona)."
                          },
                          {
                              "t": "La <b>en</b> es como 'en' en 'open'.",
                              "n": "La en es como 'en' en 'open'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_in",
                      "isLetter": true,
                      "letter": "in",
                      "word": "in",
                      "emoji": "🔤",
                      "phonetic": "/in/",
                      "translation": "Final nasal <b>in</b> como en español «<i>fin</i>» (con la lengua tocando los dientes)",
                      "mnemonic": "Como 'in' en 'fin', pero con la lengua tocando los dientes superiores.",
                      "examples": [
                          {
                              "t": "<b>in</b> en <span class='hl'>lín</span> (bosque).",
                              "n": "in en lín (bosque)."
                          },
                          {
                              "t": "La <b>in</b> suena como en 'fin'.",
                              "n": "La in suena como en 'fin'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_un",
                      "isLetter": true,
                      "letter": "un",
                      "word": "un",
                      "emoji": "🔤",
                      "phonetic": "/un/",
                      "translation": "Final nasal <b>un</b> como en español «<i>un</i>» (con la lengua tocando los dientes)",
                      "mnemonic": "Como 'un' en 'un' pero con la lengua tocando los dientes.",
                      "examples": [
                          {
                              "t": "<b>un</b> en <span class='hl'>wèn</span> (preguntar).",
                              "n": "un en wèn (preguntar)."
                          },
                          {
                              "t": "La <b>un</b> suena como en 'un'.",
                              "n": "La un suena como en 'un'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ün",
                      "isLetter": true,
                      "letter": "ün",
                      "word": "ün",
                      "emoji": "🔤",
                      "phonetic": "/yn/",
                      "translation": "Final nasal <b>ün</b> como <b>ü</b> + <b>n</b> (labios redondeados y lengua toca los dientes)",
                      "mnemonic": "Redondea los labios para ü y luego toca los dientes con la lengua para n.",
                      "examples": [
                          {
                              "t": "<b>ün</b> en <span class='hl'>jūn</span> (ejército).",
                              "n": "ün en jūn (ejército)."
                          },
                          {
                              "t": "Después de j, q, x, <b>ün</b> se escribe <i>un</i>.",
                              "n": "Después de j, q, x, ün se escribe un."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ang",
                      "isLetter": true,
                      "letter": "ang",
                      "word": "ang",
                      "emoji": "🔤",
                      "phonetic": "/ɑŋ/",
                      "translation": "Final nasal <b>ang</b> como en inglés «<i>song</i>» (la lengua va atrás)",
                      "mnemonic": "Como 'ang' en 'song' pero con la lengua en la parte posterior de la garganta.",
                      "examples": [
                          {
                              "t": "<b>ang</b> en <span class='hl'>máng</span> (ocupado).",
                              "n": "ang en máng (ocupado)."
                          },
                          {
                              "t": "La <b>ang</b> suena como en 'song' en inglés.",
                              "n": "La ang suena como en 'song' en inglés."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_eng",
                      "isLetter": true,
                      "letter": "eng",
                      "word": "eng",
                      "emoji": "🔤",
                      "phonetic": "/ɤŋ/",
                      "translation": "Final nasal <b>eng</b> como una <b>e</b> gutural + <b>ng</b> (lengua atrás)",
                      "mnemonic": "Empieza con la e gutural y termina con el sonido ng de 'song'.",
                      "examples": [
                          {
                              "t": "<b>eng</b> en <span class='hl'>néng</span> (poder).",
                              "n": "eng en néng (poder)."
                          },
                          {
                              "t": "La <b>eng</b> es como 'eng' en 'song' con e gutural.",
                              "n": "La eng es como 'eng' en 'song' con e gutural."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ing",
                      "isLetter": true,
                      "letter": "ing",
                      "word": "ing",
                      "emoji": "🔤",
                      "phonetic": "/iŋ/",
                      "translation": "Final nasal <b>ing</b> como <b>i</b> + <b>ng</b> (no como en inglés «<i>sing</i>»)",
                      "mnemonic": "Di 'i' y luego el sonido ng de 'song'. No es 'ing' inglés.",
                      "examples": [
                          {
                              "t": "<b>ing</b> en <span class='hl'>míng</span> (brillante).",
                              "n": "ing en míng (brillante)."
                          },
                          {
                              "t": "La <b>ing</b> no es como en inglés.",
                              "n": "La ing no es como en inglés."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_ong",
                      "isLetter": true,
                      "letter": "ong",
                      "word": "ong",
                      "emoji": "🔤",
                      "phonetic": "/ʊŋ/",
                      "translation": "Final nasal <b>ong</b> como <b>u</b> + <b>ng</b> (labios redondeados y lengua atrás)",
                      "mnemonic": "Es como 'u' + 'ng', no 'o' + 'ng'. Piensa en 'u' con labios redondeados.",
                      "examples": [
                          {
                              "t": "<b>ong</b> en <span class='hl'>tóng</span> (mismo).",
                              "n": "ong en tóng (mismo)."
                          },
                          {
                              "t": "La <b>ong</b> suena como 'u' + 'ng'.",
                              "n": "La ong suena como 'u' + 'ng'."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_L_er",
                      "isLetter": true,
                      "letter": "er",
                      "word": "er",
                      "emoji": "🔤",
                      "phonetic": "/ɚ/",
                      "translation": "Final especial <b>er</b> con la lengua curvada hacia atrás (retroflex)",
                      "mnemonic": "Imagina que la lengua se enrolla hacia atrás como una 'r' americana.",
                      "examples": [
                          {
                              "t": "<b>er</b> en <span class='hl'>èr</span> (dos).",
                              "n": "er en èr (dos)."
                          },
                          {
                              "t": "El sonido <b>er</b> es como una 'r' americana.",
                              "n": "El sonido er es como una 'r' americana."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_01",
                      "isLetter": false,
                      "letter": "ao",
                      "word": "māo",
                      "emoji": "🐱",
                      "phonetic": "/mɑʊ/",
                      "translation": "<b>gato</b>",
                      "translations": {
                          "zh": "māo",
                          "es": "gato",
                          "en": "cat"
                      },
                      "examples": [
                          {
                              "t": "Wǒ yǒu yī zhī <b>māo</b>.",
                              "n": "Tengo un gato."
                          },
                          {
                              "t": "Zhè zhī <b>māo</b> hěn kě'ài.",
                              "n": "Este gato es muy lindo."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g3_02",
                      "isLetter": false,
                      "letter": "ei",
                      "word": "bèi",
                      "emoji": "🦶",
                      "phonetic": "/peɪ̯/",
                      "translation": "<b>espalda</b> (también significa 'ser + verbo' en voz pasiva)",
                      "translations": {
                          "zh": "bèi",
                          "es": "espalda",
                          "en": "back"
                      },
                      "examples": [
                          {
                              "t": "Wǒ de <b>bèi</b> hěn téng.",
                              "n": "Me duele la espalda."
                          },
                          {
                              "t": "Tā <b>bèi</b> dǎ le.",
                              "n": "Él fue golpeado."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "zh_a0_g4",
              "name": "Primeras palabras en pinyin",
              "icon": "🧩",
              "color": "#ef4444",
              "description": "Leer y pronunciar 20 palabras esenciales",
              "reviewFrom": [
                  "zh_a0_g1",
                  "zh_a0_g2",
                  "zh_a0_g3"
              ],
              "cards": [
                  {
                      "id": "zh_a0_g4_L_ni",
                      "isLetter": true,
                      "letter": "你",
                      "word": "你",
                      "emoji": "🔤",
                      "phonetic": "/nǐ/",
                      "translation": "Tú — el carácter tiene <b>你</b> con la raíz de persona <i>亻</i> a la izquierda",
                      "mnemonic": "Parece una persona de pie (亻) junto a un pequeño 'tú' señalando hacia ti.",
                      "examples": [
                          {
                              "t": "<b>你</b> hǎo → hola (literal: tú bien)",
                              "n": "Saludo universal"
                          },
                          {
                              "t": "<b>你</b> shì shéi? → ¿Quién eres tú?",
                              "n": "Pregunta con 你"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_wo",
                      "isLetter": true,
                      "letter": "我",
                      "word": "我",
                      "emoji": "🔤",
                      "phonetic": "/wǒ/",
                      "translation": "Yo — carácter con <b>我</b> que contiene la idea de 'mano' y 'lanza'",
                      "mnemonic": "Visualiza una mano (扌) sosteniendo una lanza (戈) — 'yo' soy quien la sostiene.",
                      "examples": [
                          {
                              "t": "<b>我</b> shì xuéshēng → Yo soy estudiante",
                              "n": "Presentación básica"
                          },
                          {
                              "t": "<b>我</b> yǒu yīgè péngyou → Tengo un amigo",
                              "n": "Uso con 有"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_ta",
                      "isLetter": true,
                      "letter": "他",
                      "word": "他",
                      "emoji": "🔤",
                      "phonetic": "/tā/",
                      "translation": "Él — <b>他</b> con raíz de persona 亻 + 'también' 也",
                      "mnemonic": "La persona (亻) que 'también' (也) está ahí → él.",
                      "examples": [
                          {
                              "t": "<b>他</b> shì lǎoshī → Él es profesor",
                              "n": "Presentación de otra persona"
                          },
                          {
                              "t": "<b>他</b> qù Běijīng → Él va a Pekín",
                              "n": "Uso con verbo ir"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_ta_f",
                      "isLetter": true,
                      "letter": "她",
                      "word": "她",
                      "emoji": "🔤",
                      "phonetic": "/tā/",
                      "translation": "Ella — <b>她</b> con raíz de mujer 女 + 'también' 也",
                      "mnemonic": "La mujer (女) que 'también' (也) está ahí → ella.",
                      "examples": [
                          {
                              "t": "<b>她</b> hěn piàoliang → Ella es muy bonita",
                              "n": "Descripción física"
                          },
                          {
                              "t": "<b>她</b> hē chá → Ella bebe té",
                              "n": "Uso con verbo beber"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_women",
                      "isLetter": true,
                      "letter": "们",
                      "word": "们",
                      "emoji": "🔤",
                      "phonetic": "/men/",
                      "translation": "Sufijo de plural — <b>们</b> se añade a pronombres: 我们 (nosotros), 你们 (vosotros)",
                      "mnemonic": "Una puerta (门) abierta que deja entrar a mucha gente → plural.",
                      "examples": [
                          {
                              "t": "wǒ<b>men</b> → nosotros (yo + plural)",
                              "n": "Plural de 我"
                          },
                          {
                              "t": "nǐ<b>men</b> → vosotros (tú + plural)",
                              "n": "Plural de 你"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_shi",
                      "isLetter": true,
                      "letter": "是",
                      "word": "是",
                      "emoji": "🔤",
                      "phonetic": "/shì/",
                      "translation": "Ser/estar (afirmación) — <b>是</b> une sujeto y predicado",
                      "mnemonic": "Un sol (日) sobre una pierna (止) — 'es' lo que está firme y claro.",
                      "examples": [
                          {
                              "t": "wǒ <b>shì</b> Měiguórén → Yo soy americano",
                              "n": "Ser + nacionalidad"
                          },
                          {
                              "t": "zhè <b>shì</b> shū → Esto es un libro",
                              "n": "Señalar objetos"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_bu",
                      "isLetter": true,
                      "letter": "不",
                      "word": "不",
                      "emoji": "🔤",
                      "phonetic": "/bù/",
                      "translation": "No (negación) — <b>不</b> se coloca antes del verbo o adjetivo",
                      "mnemonic": "Un pájaro que no puede volar porque tiene las alas caídas → 'no'.",
                      "examples": [
                          {
                              "t": "wǒ <b>不</b> shì xuéshēng → Yo no soy estudiante",
                              "n": "Negación con ser"
                          },
                          {
                              "t": "tā <b>不</b> hǎo → Él no está bien",
                              "n": "Negación con adjetivo"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_you",
                      "isLetter": true,
                      "letter": "有",
                      "word": "有",
                      "emoji": "🔤",
                      "phonetic": "/yǒu/",
                      "translation": "Tener/haber — <b>有</b> indica posesión o existencia",
                      "mnemonic": "Una mano (月) que sostiene algo (肉) → 'tengo' algo.",
                      "examples": [
                          {
                              "t": "wǒ <b>yǒu</b> yīgè jiā → Tengo una casa",
                              "n": "Posesión"
                          },
                          {
                              "t": "nàlǐ <b>yǒu</b> rén → Allí hay gente",
                              "n": "Existencia"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_mei",
                      "isLetter": true,
                      "letter": "没",
                      "word": "没",
                      "emoji": "🔤",
                      "phonetic": "/méi/",
                      "translation": "No tener (negación de 有) — <b>没</b> se usa para negar posesión",
                      "mnemonic": "Agua (氵) que se evapora en el aire (殳) → 'no hay' nada.",
                      "examples": [
                          {
                              "t": "wǒ <b>méi</b> yǒu qián → No tengo dinero",
                              "n": "Negación de posesión"
                          },
                          {
                              "t": "tā <b>méi</b> yǒu shíjiān → Ella no tiene tiempo",
                              "n": "Falta de algo"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_hao",
                      "isLetter": true,
                      "letter": "好",
                      "word": "好",
                      "emoji": "🔤",
                      "phonetic": "/hǎo/",
                      "translation": "Bueno/bien — <b>好</b> combina mujer (女) con hijo (子)",
                      "mnemonic": "Una mujer (女) con su hijo (子) → eso es 'bueno'.",
                      "examples": [
                          {
                              "t": "nǐ <b>hǎo</b> → Hola (literal: tú bien)",
                              "n": "Saludo básico"
                          },
                          {
                              "t": "zhè ge <b>hǎo</b> → Esto es bueno",
                              "n": "Calificar algo"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_da",
                      "isLetter": true,
                      "letter": "大",
                      "word": "大",
                      "emoji": "🔤",
                      "phonetic": "/dà/",
                      "translation": "Grande — <b>大</b> es una persona con los brazos abiertos",
                      "mnemonic": "Una persona con los brazos extendidos → ocupa mucho espacio → 'grande'.",
                      "examples": [
                          {
                              "t": "Běijīng hěn <b>dà</b> → Pekín es muy grande",
                              "n": "Tamaño de ciudades"
                          },
                          {
                              "t": "yīgè <b>dà</b> píngguǒ → Una manzana grande",
                              "n": "Describir objetos"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_xiao",
                      "isLetter": true,
                      "letter": "小",
                      "word": "小",
                      "emoji": "🔤",
                      "phonetic": "/xiǎo/",
                      "translation": "Pequeño — <b>小</b> se escribe con tres trazos simples",
                      "mnemonic": "Tres trazos pequeños que se encogen → 'pequeño'.",
                      "examples": [
                          {
                              "t": "yīgè <b>xiǎo</b> gǒu → Un perro pequeño",
                              "n": "Describir animales"
                          },
                          {
                              "t": "tā hěn <b>xiǎo</b> → Ella es muy pequeña",
                              "n": "Descripción física"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_lai",
                      "isLetter": true,
                      "letter": "来",
                      "word": "来",
                      "emoji": "🔤",
                      "phonetic": "/lái/",
                      "translation": "Venir — <b>来</b> indica movimiento hacia el hablante",
                      "mnemonic": "Una persona (木) que camina hacia ti (一) → 'venir'.",
                      "examples": [
                          {
                              "t": "nǐ <b>lái</b> zhèlǐ → Tú vienes aquí",
                              "n": "Movimiento hacia aquí"
                          },
                          {
                              "t": "tā <b>lái</b> le → Él ha venido",
                              "n": "Acción completada"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_qu",
                      "isLetter": true,
                      "letter": "去",
                      "word": "去",
                      "emoji": "🔤",
                      "phonetic": "/qù/",
                      "translation": "Ir — <b>去</b> indica movimiento hacia otro lugar",
                      "mnemonic": "Una persona (土) que se aleja (厶) → 'irse'.",
                      "examples": [
                          {
                              "t": "wǒ <b>qù</b> xuéxiào → Yo voy a la escuela",
                              "n": "Ir a un lugar"
                          },
                          {
                              "t": "nǐ <b>qù</b> nǎr? → ¿A dónde vas?",
                              "n": "Preguntar destino"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_chi",
                      "isLetter": true,
                      "letter": "吃",
                      "word": "吃",
                      "emoji": "🔤",
                      "phonetic": "/chī/",
                      "translation": "Comer — <b>吃</b> tiene la boca (口) como componente clave",
                      "mnemonic": "Una boca (口) grande que devora (乞) → 'comer'.",
                      "examples": [
                          {
                              "t": "wǒ <b>chī</b> fàn → Yo como arroz",
                              "n": "Comer comida"
                          },
                          {
                              "t": "nǐ <b>chī</t> píngguǒ ma? → ¿Tú comes manzanas?",
                              "n": "Pregunta sobre comida"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_he",
                      "isLetter": true,
                      "letter": "喝",
                      "word": "喝",
                      "emoji": "🔤",
                      "phonetic": "/hē/",
                      "translation": "Beber — <b>喝</b> también usa la boca (口) como componente",
                      "mnemonic": "Una boca (口) que pide agua (曷) → 'beber'.",
                      "examples": [
                          {
                              "t": "tā <b>hē</b> shuǐ → Ella bebe agua",
                              "n": "Beber líquidos"
                          },
                          {
                              "t": "wǒ <b>hē</b> chá → Yo bebo té",
                              "n": "Bebida típica"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_L_shuo",
                      "isLetter": true,
                      "letter": "说",
                      "word": "说",
                      "emoji": "🔤",
                      "phonetic": "/shuō/",
                      "translation": "Hablar/decir — <b>说</b> combina palabras (讠) con 'intercambio' (兑)",
                      "mnemonic": "Palabras (讠) que se intercambian (兑) → 'hablar'.",
                      "examples": [
                          {
                              "t": "nǐ <b>shuō</b> shénme? → ¿Qué dices?",
                              "n": "Preguntar qué dice alguien"
                          },
                          {
                              "t": "tā <b>shuō</b> Zhōngwén → Él habla chino",
                              "n": "Hablar idiomas"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_01",
                      "isLetter": false,
                      "letter": "你",
                      "word": "你好",
                      "emoji": "👋",
                      "phonetic": "/nǐ hǎo/",
                      "translation": "<b>Hola</b> — literalmente 'tú bien'",
                      "translations": {
                          "zh": "你好",
                          "es": "Hola",
                          "en": "Hello"
                      },
                      "examples": [
                          {
                              "t": "<b>你好</b>! Wǒ jiào Lǐ Míng.",
                              "n": "¡Hola! Me llamo Li Ming."
                          },
                          {
                              "t": "<b>你好</b>, nǐ hǎo ma?",
                              "n": "Hola, ¿cómo estás?"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_02",
                      "isLetter": false,
                      "letter": "谢",
                      "word": "谢谢",
                      "emoji": "🙏",
                      "phonetic": "/xièxiè/",
                      "translation": "<b>Gracias</b> — se repite para dar énfasis",
                      "translations": {
                          "zh": "谢谢",
                          "es": "Gracias",
                          "en": "Thank you"
                      },
                      "examples": [
                          {
                              "t": "<b>谢谢</b> nǐ de bāngzhù.",
                              "n": "Gracias por tu ayuda."
                          },
                          {
                              "t": "<b>谢谢</b>, zàijiàn!",
                              "n": "¡Gracias, adiós!"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_03",
                      "isLetter": false,
                      "letter": "对",
                      "word": "对不起",
                      "emoji": "😔",
                      "phonetic": "/duìbuqǐ/",
                      "translation": "<b>Perdón</b> / lo siento — literalmente 'no puedo enfrentar'",
                      "translations": {
                          "zh": "对不起",
                          "es": "Perdón",
                          "en": "Sorry"
                      },
                      "examples": [
                          {
                              "t": "<b>对不起</b>, wǒ chídào le.",
                              "n": "Perdón, llegué tarde."
                          },
                          {
                              "t": "<b>对不起</b>, wǒ bú shì gùyì de.",
                              "n": "Lo siento, no fue a propósito."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_04",
                      "isLetter": false,
                      "letter": "不",
                      "word": "不是",
                      "emoji": "❌",
                      "phonetic": "/bù shì/",
                      "translation": "<b>No es</b> — negación de 是",
                      "translations": {
                          "zh": "不是",
                          "es": "No es",
                          "en": "Is not"
                      },
                      "examples": [
                          {
                              "t": "Zhè <b>不是</b> wǒ de shū.",
                              "n": "Este no es mi libro."
                          },
                          {
                              "t": "Tā <b>不是</b> lǎoshī.",
                              "n": "Él no es profesor."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_05",
                      "isLetter": false,
                      "letter": "没",
                      "word": "没有",
                      "emoji": "🚫",
                      "phonetic": "/méiyǒu/",
                      "translation": "<b>No tener</b> — negación de 有",
                      "translations": {
                          "zh": "没有",
                          "es": "No tener",
                          "en": "Don't have"
                      },
                      "examples": [
                          {
                              "t": "Wǒ <b>没有</b> qián.",
                              "n": "No tengo dinero."
                          },
                          {
                              "t": "Tā <b>没有</b> shíjiān.",
                              "n": "Ella no tiene tiempo."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_06",
                      "isLetter": false,
                      "letter": "不",
                      "word": "不好",
                      "emoji": "👎",
                      "phonetic": "/bù hǎo/",
                      "translation": "<b>No bueno</b> / mal",
                      "translations": {
                          "zh": "不好",
                          "es": "No bueno / mal",
                          "en": "Not good"
                      },
                      "examples": [
                          {
                              "t": "Zhè ge diànyǐng <b>不好</b>.",
                              "n": "Esta película no es buena."
                          },
                          {
                              "t": "Wǒ juéde <b>不好</b>.",
                              "n": "Me siento mal."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_07",
                      "isLetter": false,
                      "letter": "我",
                      "word": "我们",
                      "emoji": "👥",
                      "phonetic": "/wǒmen/",
                      "translation": "<b>Nosotros</b> — 我 + sufijo plural 们",
                      "translations": {
                          "zh": "我们",
                          "es": "Nosotros",
                          "en": "We"
                      },
                      "examples": [
                          {
                              "t": "<b>我们</b> qù gōngyuán.",
                              "n": "Nosotros vamos al parque."
                          },
                          {
                              "t": "<b>我们</b> shì péngyou.",
                              "n": "Somos amigos."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_08",
                      "isLetter": false,
                      "letter": "来",
                      "word": "来",
                      "emoji": "🚶",
                      "phonetic": "/lái/",
                      "translation": "<b>Venir</b> — movimiento hacia el hablante",
                      "translations": {
                          "zh": "来",
                          "es": "Venir",
                          "en": "Come"
                      },
                      "examples": [
                          {
                              "t": "Nǐ <b>来</b> wǒ jiā ba!",
                              "n": "¡Ven a mi casa!"
                          },
                          {
                              "t": "Tā míngtiān <b>来</b>.",
                              "n": "Él viene mañana."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_09",
                      "isLetter": false,
                      "letter": "去",
                      "word": "去",
                      "emoji": "🏃",
                      "phonetic": "/qù/",
                      "translation": "<b>Ir</b> — movimiento hacia otro lugar",
                      "translations": {
                          "zh": "去",
                          "es": "Ir",
                          "en": "Go"
                      },
                      "examples": [
                          {
                              "t": "Wǒ <b>去</b> shāngdiàn.",
                              "n": "Voy a la tienda."
                          },
                          {
                              "t": "Nǐ <b>去</b> Běijīng ma?",
                              "n": "¿Vas a Pekín?"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_10",
                      "isLetter": false,
                      "letter": "吃",
                      "word": "吃",
                      "emoji": "🍚",
                      "phonetic": "/chī/",
                      "translation": "<b>Comer</b> — con boca 口",
                      "translations": {
                          "zh": "吃",
                          "es": "Comer",
                          "en": "Eat"
                      },
                      "examples": [
                          {
                              "t": "Wǒ <b>吃</b> miàn.",
                              "n": "Como fideos."
                          },
                          {
                              "t": "Nǐ <b>吃</b> le ma?",
                              "n": "¿Ya comiste?"
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_11",
                      "isLetter": false,
                      "letter": "喝",
                      "word": "喝",
                      "emoji": "🥤",
                      "phonetic": "/hē/",
                      "translation": "<b>Beber</b> — con boca 口",
                      "translations": {
                          "zh": "喝",
                          "es": "Beber",
                          "en": "Drink"
                      },
                      "examples": [
                          {
                              "t": "Tā <b>喝</b> kāfēi.",
                              "n": "Ella bebe café."
                          },
                          {
                              "t": "Wǒ <b>喝</b> niú nǎi.",
                              "n": "Bebo leche."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_12",
                      "isLetter": false,
                      "letter": "说",
                      "word": "说",
                      "emoji": "🗣️",
                      "phonetic": "/shuō/",
                      "translation": "<b>Hablar</b> / decir",
                      "translations": {
                          "zh": "说",
                          "es": "Hablar",
                          "en": "Speak"
                      },
                      "examples": [
                          {
                              "t": "Nǐ <b>说</b> Yīngyǔ ma?",
                              "n": "¿Hablas inglés?"
                          },
                          {
                              "t": "Tā <b>说</b> hěn hǎo de Zhōngwén.",
                              "n": "Él habla muy bien chino."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_13",
                      "isLetter": false,
                      "letter": "大",
                      "word": "大",
                      "emoji": "🐘",
                      "phonetic": "/dà/",
                      "translation": "<b>Grande</b> — persona con brazos abiertos",
                      "translations": {
                          "zh": "大",
                          "es": "Grande",
                          "en": "Big"
                      },
                      "examples": [
                          {
                              "t": "Zhè shì yīgè <b>大</b> jiā.",
                              "n": "Esta es una casa grande."
                          },
                          {
                              "t": "Běijīng hěn <b>大</b>.",
                              "n": "Pekín es muy grande."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_14",
                      "isLetter": false,
                      "letter": "小",
                      "word": "小",
                      "emoji": "🐭",
                      "phonetic": "/xiǎo/",
                      "translation": "<b>Pequeño</b> — tres trazos que se encogen",
                      "translations": {
                          "zh": "小",
                          "es": "Pequeño",
                          "en": "Small"
                      },
                      "examples": [
                          {
                              "t": "Yīgè <b>小</b> māo.",
                              "n": "Un gato pequeño."
                          },
                          {
                              "t": "Wǒ yǒu yīgè <b>小</b> wèntí.",
                              "n": "Tengo un pequeño problema."
                          }
                      ]
                  },
                  {
                      "id": "zh_a0_g4_15",
                      "isLetter": false,
                      "letter": "有",
                      "word": "有",
                      "emoji": "✋",
                      "phonetic": "/yǒu/",
                      "translation": "<b>Tener</b> — mano que sostiene algo",
                      "translations": {
                          "zh": "有",
                          "es": "Tener",
                          "en": "Have"
                      },
                      "examples": [
                          {
                              "t": "Wǒ <b>有</b> liǎng gè háizi.",
                              "n": "Tengo dos hijos."
                          },
                          {
                              "t": "Nǐ <b>有</b> shíjiān ma?",
                              "n": "¿Tienes tiempo?"
                          }
                      ]
                  }
              ]
          }
      ]
  },

  // ──────────────────────────────────────────────────────
  // JA_PT
  // ──────────────────────────────────────────────────────
  ja_pt: {
      "level": "A0",
      "levelName": "Hiragana y Katakana",
      "groups": [
          {
              "id": "ja_a0_g1",
              "name": "Hiragana — parte 1",
              "icon": "🔤",
              "color": "#6366f1",
              "description": "あ行 か行 さ行 た行 な行 — primeras 25 sílabas",
              "reviewFrom": [],
              "cards": [
                  {
                      "id": "ja_a0_g1_L_a-row",
                      "isLetter": true,
                      "letter": "あいうえお",
                      "word": "あいうえお",
                      "emoji": "🔤",
                      "phonetic": "/a i ɯ e o/",
                      "translation": "Linha <b>あ</b> — as cinco vogais do japonês.<br><i>あ</i> (a), <i>い</i> (i), <i>う</i> (u), <i>え</i> (e), <i>お</i> (o).",
                      "mnemonic": "あ parece um 'a' com um laço; い são dois traços como dedos; う é um 'u' com chapéu; え parece um 'e' com teto; お é um 'o' com um nó.",
                      "examples": [
                          {
                              "t": "<b>あ</b> é a primeira letra do alfabeto.",
                              "n": "A letra あ é como um 'a' com um laço."
                          },
                          {
                              "t": "<b>い</b> é um 'i' com dois traços.",
                              "n": "O som é como o 'i' do português."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ka-row",
                      "isLetter": true,
                      "letter": "かきくけこ",
                      "word": "かきくけこ",
                      "emoji": "🔤",
                      "phonetic": "/ka ki kɯ ke ko/",
                      "translation": "Linha <b>か</b> — consoante K + vogais.<br><i>か</i> (ka), <i>き</i> (ki), <i>く</i> (ku), <i>け</i> (ke), <i>こ</i> (ko).",
                      "mnemonic": "か parece um 'ka' com um laço; き é um 'ki' com uma espada; く é um bico de pássaro; け é um 'ke' com um telhado; こ são dois traços como um 'k' deitado.",
                      "examples": [
                          {
                              "t": "<b>か</b> é a primeira letra da linha.",
                              "n": "O som é como 'ca' em português."
                          },
                          {
                              "t": "<b>き</b> é usado em <i>きれい</i> (bonito).",
                              "n": "Exemplo: きれい significa 'bonito'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_sa-row",
                      "isLetter": true,
                      "letter": "さしすせそ",
                      "word": "さしすせそ",
                      "emoji": "🔤",
                      "phonetic": "/sa ɕi sɯ se so/",
                      "translation": "Linha <b>さ</b> — consoante S + vogais.<br><i>さ</i> (sa), <i>し</i> (shi), <i>す</i> (su), <i>せ</i> (se), <i>そ</i> (so).",
                      "mnemonic": "さ parece um 'sa' com um corte; し é um anzol; す é um 'su' com um laço; せ é um 'se' com um rabo; そ é um 'so' com um zigue-zague.",
                      "examples": [
                          {
                              "t": "<b>さ</b> é a primeira letra da linha.",
                              "n": "O som é como 'sa' em português."
                          },
                          {
                              "t": "<b>し</b> é usado em <i>さくら</i> (cerejeira).",
                              "n": "Exemplo: さくら significa 'cerejeira'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_ta-row",
                      "isLetter": true,
                      "letter": "たちつてと",
                      "word": "たちつてと",
                      "emoji": "🔤",
                      "phonetic": "/ta tɕi tsɯ te to/",
                      "translation": "Linha <b>た</b> — consoante T + vogais.<br><i>た</i> (ta), <i>ち</i> (chi), <i>つ</i> (tsu), <i>て</i> (te), <i>と</i> (to).<br><span class='hl'>Atenção:</span> <i>ち</i> e <i>つ</i> são irregulares.",
                      "mnemonic": "た parece um 'ta' com um laço; ち é um 'chi' com um laço; つ é um 'tsu' com um arco; て é um 'te' com um gancho; と é um 'to' com um laço.",
                      "examples": [
                          {
                              "t": "<b>た</b> é a primeira letra da linha.",
                              "n": "O som é como 'ta' em português."
                          },
                          {
                              "t": "<b>つ</b> é usado em <i>つき</i> (lua).",
                              "n": "Exemplo: つき significa 'lua'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_L_na-row",
                      "isLetter": true,
                      "letter": "なにぬねの",
                      "word": "なにぬねの",
                      "emoji": "🔤",
                      "phonetic": "/na ɲi nɯ ne no/",
                      "translation": "Linha <b>な</b> — consoante N + vogais.<br><i>な</i> (na), <i>に</i> (ni), <i>ぬ</i> (nu), <i>ね</i> (ne), <i>の</i> (no).",
                      "mnemonic": "な parece um 'na' com um laço; に é um 'ni' com um traço; ぬ é um 'nu' com um laço; ね é um 'ne' com um rabo; の é um 'no' com um círculo.",
                      "examples": [
                          {
                              "t": "<b>な</b> é a primeira letra da linha.",
                              "n": "O som é como 'na' em português."
                          },
                          {
                              "t": "<b>の</b> é uma partícula comum.",
                              "n": "Exemplo: ねこ (gato) usa ね."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_01",
                      "isLetter": false,
                      "letter": "あ",
                      "word": "あさ",
                      "emoji": "🌅",
                      "phonetic": "/asa/",
                      "translation": "<b>あさ</b> — manhã",
                      "translations": {
                          "ja": "あさ",
                          "pt": "manhã",
                          "en": "morning"
                      },
                      "examples": [
                          {
                              "t": "<b>あさ</b> に おきます。",
                              "n": "Eu acordo de manhã."
                          },
                          {
                              "t": "あさ は しずか です。",
                              "n": "A manhã é tranquila."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_02",
                      "isLetter": false,
                      "letter": "き",
                      "word": "きく",
                      "emoji": "👂",
                      "phonetic": "/kiku/",
                      "translation": "<b>きく</b> — ouvir, escutar",
                      "translations": {
                          "ja": "きく",
                          "pt": "ouvir",
                          "en": "to listen"
                      },
                      "examples": [
                          {
                              "t": "おんがく を <b>きく</b>。",
                              "n": "Eu ouço música."
                          },
                          {
                              "t": "こえ が きこえます。",
                              "n": "Eu posso ouvir uma voz."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_03",
                      "isLetter": false,
                      "letter": "す",
                      "word": "すし",
                      "emoji": "🍣",
                      "phonetic": "/sɯɕi/",
                      "translation": "<b>すし</b> — sushi",
                      "translations": {
                          "ja": "すし",
                          "pt": "sushi",
                          "en": "sushi"
                      },
                      "examples": [
                          {
                              "t": "<b>すし</b> が すき です。",
                              "n": "Eu gosto de sushi."
                          },
                          {
                              "t": "すし を たべます。",
                              "n": "Eu como sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_04",
                      "isLetter": false,
                      "letter": "た",
                      "word": "たべる",
                      "emoji": "🍽️",
                      "phonetic": "/tapeɾɯ/",
                      "translation": "<b>たべる</b> — comer",
                      "translations": {
                          "ja": "たべる",
                          "pt": "comer",
                          "en": "to eat"
                      },
                      "examples": [
                          {
                              "t": "りんご を <b>たべる</b>。",
                              "n": "Eu como uma maçã."
                          },
                          {
                              "t": "すし を たべたい。",
                              "n": "Eu quero comer sushi."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g1_05",
                      "isLetter": false,
                      "letter": "ね",
                      "word": "ねる",
                      "emoji": "😴",
                      "phonetic": "/neɾɯ/",
                      "translation": "<b>ねる</b> — dormir",
                      "translations": {
                          "ja": "ねる",
                          "pt": "dormir",
                          "en": "to sleep"
                      },
                      "examples": [
                          {
                              "t": "よる に <b>ねる</b>。",
                              "n": "Eu durmo à noite."
                          },
                          {
                              "t": "ねむい です。",
                              "n": "Estou com sono."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g2",
              "name": "Hiragana — parte 2",
              "icon": "🔡",
              "color": "#f59e0b",
              "description": "は行 ま行 や行 ら行 わ行 ん + dakuten",
              "reviewFrom": [
                  "ja_a0_g1"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g2_L_ha",
                      "isLetter": true,
                      "letter": "は",
                      "word": "は",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "Som <b>ha</b> — como em <i>hash</i> em inglês, mas curto.<br>Parece uma <span class=\"hl\">árvore</span> com um galho à esquerda.",
                      "mnemonic": "Parece uma pessoa com um chapéu grande — o traço da esquerda é o braço levantado.",
                      "examples": [
                          {
                              "t": "<b>は</b> é a primeira letra de <b>はな</b> (flor).",
                              "n": "A letra ha abre a palavra flor."
                          },
                          {
                              "t": "Usada como partícula de tópico: <b>は</b> (wa).",
                              "n": "Quando é partícula, lê-se wa."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ma",
                      "isLetter": true,
                      "letter": "ま",
                      "word": "ま",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "Som <b>ma</b> — como <i>mãe</i> sem nasalização.<br>Parece um <span class=\"hl\">cavalo</span> com pernas cruzadas.",
                      "mnemonic": "O traço superior parece uma crina de cavalo — e o resto são as pernas.",
                      "examples": [
                          {
                              "t": "<b>ま</b> começa <b>ま</b> (ma) — palavra antiga para 'verdade'? Não, é só um som.",
                              "n": "Foco no som e formato."
                          },
                          {
                              "t": "Em <b>ま</b>tsuri (festival), aparece esta letra.",
                              "n": "Matsuri é um festival japonês."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ya",
                      "isLetter": true,
                      "letter": "や",
                      "word": "や",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Som <b>ya</b> — como <i>iá</i> em português.<br>Parece um <span class=\"hl\">ia-te</span> (iate) com vela.",
                      "mnemonic": "O traço curvo parece a vela de um barco — e iate começa com ya.",
                      "examples": [
                          {
                              "t": "<b>や</b> é usado em <b>や</b>ma (montanha).",
                              "n": "Yama é montanha."
                          },
                          {
                              "t": "Versão pequena ゃ é usada para sons combinados.",
                              "n": "Ex: きゃ (kya)."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_ra",
                      "isLetter": true,
                      "letter": "ら",
                      "word": "ら",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "Som <b>ra</b> — um <i>r</i> leve, entre R e L (flap).<br>Parece um <span class=\"hl\">rato</span> de perfil.",
                      "mnemonic": "O traço inclinado parece um rabo de rato — e rato começa com ra.",
                      "examples": [
                          {
                              "t": "<b>ら</b> aparece em <b>ら</b>men (macarrão japonês).",
                              "n": "Ramen é um prato famoso."
                          },
                          {
                              "t": "O som é como o 'r' em 'caro' no português do Brasil.",
                              "n": "Flap alveolar, não vibrante."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_wa",
                      "isLetter": true,
                      "letter": "わ",
                      "word": "わ",
                      "emoji": "🔤",
                      "phonetic": "/wa/",
                      "translation": "Som <b>wa</b> — como <i>uá</i> em português.<br>Parece um <span class=\"hl\">waffle</span> visto de lado.",
                      "mnemonic": "O traço arredondado parece um waffle — e waffle começa com wa.",
                      "examples": [
                          {
                              "t": "<b>わ</b> começa <b>わ</b>たし (eu).",
                              "n": "Watashi significa eu."
                          },
                          {
                              "t": "Não confunda com は (ha) — わ é sempre wa.",
                              "n": "は como partícula lê-se wa, mas escreve-se は."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_n",
                      "isLetter": true,
                      "letter": "ん",
                      "word": "ん",
                      "emoji": "🔤",
                      "phonetic": "/n/ (ou /m/ antes de p/b)",
                      "translation": "Som <b>n</b> — nasal, como <i>n</i> em 'santo'.<br>Parece um <span class=\"hl\">n</span> minúsculo com um rabinho.",
                      "mnemonic": "Parece a letra n com um gancho — é o único som nasal sozinho.",
                      "examples": [
                          {
                              "t": "<b>ん</b> é a única consoante que pode terminar uma palavra.",
                              "n": "Ex: にほん (Japão)."
                          },
                          {
                              "t": "Antes de p/b, vira m: しんぶん (shimbun/jornal).",
                              "n": "Regra de pronúncia."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_L_dakuten",
                      "isLetter": true,
                      "letter": "゛",
                      "word": "゛",
                      "emoji": "🔤",
                      "phonetic": "/dakuten/",
                      "translation": "Dakuten (゛) — adiciona <b>voz</b> ao som.<br>Ex: か (ka) → が (ga).<br>Handakuten (゜) — adiciona <b>p</b>: は (ha) → ぱ (pa).",
                      "mnemonic": "Duas marquinhas = som 'pesado' (voz). Bolinha = som 'p' leve.",
                      "examples": [
                          {
                              "t": "か → <b>が</b> (ga) — som com vibração nas cordas vocais.",
                              "n": "Dakuten = voz."
                          },
                          {
                              "t": "は → <b>ぱ</b> (pa) — handakuten vira p.",
                              "n": "Bolinha = p."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_01",
                      "isLetter": false,
                      "letter": "は",
                      "word": "はな",
                      "emoji": "🌸",
                      "phonetic": "/hana/",
                      "translation": "<b>Flor</b> — <i>ha</i> + <i>na</i>",
                      "translations": {
                          "ja": "はな",
                          "pt": "flor",
                          "en": "flower"
                      },
                      "examples": [
                          {
                              "t": "これは <b>はな</b> です。",
                              "n": "Isto é uma flor."
                          },
                          {
                              "t": "<b>はな</b> が きれい です。",
                              "n": "A flor é bonita."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_02",
                      "isLetter": false,
                      "letter": "み",
                      "word": "みず",
                      "emoji": "💧",
                      "phonetic": "/mizu/",
                      "translation": "<b>Água</b> — <i>mi</i> + <i>zu</i> (com dakuten)",
                      "translations": {
                          "ja": "みず",
                          "pt": "água",
                          "en": "water"
                      },
                      "examples": [
                          {
                              "t": "<b>みず</b> を ください。",
                              "n": "Água, por favor."
                          },
                          {
                              "t": "この <b>みず</b> は つめたい。",
                              "n": "Esta água está fria."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_03",
                      "isLetter": false,
                      "letter": "や",
                      "word": "やま",
                      "emoji": "🏔️",
                      "phonetic": "/jama/",
                      "translation": "<b>Montanha</b> — <i>ya</i> + <i>ma</i>",
                      "translations": {
                          "ja": "やま",
                          "pt": "montanha",
                          "en": "mountain"
                      },
                      "examples": [
                          {
                              "t": "ふじ <b>やま</b> は たかい。",
                              "n": "O Monte Fuji é alto."
                          },
                          {
                              "t": "<b>やま</b> に いく。",
                              "n": "Vou à montanha."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_04",
                      "isLetter": false,
                      "letter": "ら",
                      "word": "られる",
                      "emoji": "💪",
                      "phonetic": "/raɾeru/",
                      "translation": "<b>Poder fazer</b> — forma potencial de verbos",
                      "translations": {
                          "ja": "られる",
                          "pt": "poder fazer",
                          "en": "can do"
                      },
                      "examples": [
                          {
                              "t": "にほんご が <b>はなせる</b> ように なりたい。",
                              "n": "Quero conseguir falar japonês. (exemplo com forma potencial)"
                          },
                          {
                              "t": "これ は <b>たべられる</b>。",
                              "n": "Isto pode ser comido."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_05",
                      "isLetter": false,
                      "letter": "わ",
                      "word": "わたし",
                      "emoji": "🙋",
                      "phonetic": "/watashi/",
                      "translation": "<b>Eu</b> — pronome pessoal",
                      "translations": {
                          "ja": "わたし",
                          "pt": "eu",
                          "en": "I/me"
                      },
                      "examples": [
                          {
                              "t": "<b>わたし</b> は がくせい です。",
                              "n": "Eu sou estudante."
                          },
                          {
                              "t": "<b>わたし</b> の なまえ は アナ です。",
                              "n": "Meu nome é Ana."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_06",
                      "isLetter": false,
                      "letter": "り",
                      "word": "ありがとう",
                      "emoji": "🙏",
                      "phonetic": "/aɾiga-toː/",
                      "translation": "<b>Obrigado(a)</b> — expressão de gratidão",
                      "translations": {
                          "ja": "ありがとう",
                          "pt": "obrigado(a)",
                          "en": "thank you"
                      },
                      "examples": [
                          {
                              "t": "<b>ありがとう</b> ございます。",
                              "n": "Muito obrigado (formal)."
                          },
                          {
                              "t": "たすけてくれて <b>ありがとう</b>。",
                              "n": "Obrigado por me ajudar."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g2_07",
                      "isLetter": false,
                      "letter": "に",
                      "word": "にほん",
                      "emoji": "🇯🇵",
                      "phonetic": "/nihon/",
                      "translation": "<b>Japão</b> — <i>ni</i> + <i>hon</i> (origem: 'país do sol nascente')",
                      "translations": {
                          "ja": "にほん",
                          "pt": "Japão",
                          "en": "Japan"
                      },
                      "examples": [
                          {
                              "t": "<b>にほん</b> に いきたい。",
                              "n": "Quero ir ao Japão."
                          },
                          {
                              "t": "<b>にほん</b> の たべもの は おいしい。",
                              "n": "A comida do Japão é deliciosa."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g3",
              "name": "Katakana — parte 1",
              "icon": "🔠",
              "color": "#10b981",
              "description": "ア行 カ行 サ行 タ行 ナ行 — comparando con hiragana",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g3_L_a",
                      "isLetter": true,
                      "letter": "ア",
                      "word": "ア",
                      "emoji": "🔤",
                      "phonetic": "/a/",
                      "translation": "<b>ア</b> = <i>a</i> (igual que あ)<br>Som: <b>/a/</b> — como em <i>paz</i>",
                      "mnemonic": "O ア parece um 'A' com um braço esticado para a direita.",
                      "examples": [
                          {
                              "t": "<b>ア</b> é o katakana de <b>あ</b>.<br>Ambos som <i>/a/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ア</b>メリカ (América)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_i",
                      "isLetter": true,
                      "letter": "イ",
                      "word": "イ",
                      "emoji": "🔤",
                      "phonetic": "/i/",
                      "translation": "<b>イ</b> = <i>i</i> (igual que い)<br>Som: <b>/i/</b> — como em <i>vida</i>",
                      "mnemonic": "O イ parece um 'I' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>イ</b> é o katakana de <b>い</b>.<br>Ambos som <i>/i/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>イ</b>タリア (Itália)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_u",
                      "isLetter": true,
                      "letter": "ウ",
                      "word": "ウ",
                      "emoji": "🔤",
                      "phonetic": "/ɯ/",
                      "translation": "<b>ウ</b> = <i>u</i> (igual que う)<br>Som: <b>/u/</b> — como em <i>uva</i>",
                      "mnemonic": "O ウ parece um 'u' de cabeça para baixo com um teto.",
                      "examples": [
                          {
                              "t": "<b>ウ</b> é o katakana de <b>う</b>.<br>Ambos som <i>/u/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ウ</b>イスキー (uísque)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_e",
                      "isLetter": true,
                      "letter": "エ",
                      "word": "エ",
                      "emoji": "🔤",
                      "phonetic": "/e/",
                      "translation": "<b>エ</b> = <i>e</i> (igual que え)<br>Som: <b>/e/</b> — como em <i>pé</i>",
                      "mnemonic": "O エ parece um 'E' com um risco no meio.",
                      "examples": [
                          {
                              "t": "<b>エ</b> é o katakana de <b>え</b>.<br>Ambos som <i>/e/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>エ</b>レベーター (elevador)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_o",
                      "isLetter": true,
                      "letter": "オ",
                      "word": "オ",
                      "emoji": "🔤",
                      "phonetic": "/o/",
                      "translation": "<b>オ</b> = <i>o</i> (igual que お)<br>Som: <b>/o/</b> — como em <i>ovo</i>",
                      "mnemonic": "O オ parece um 'o' com um risco vertical à direita.",
                      "examples": [
                          {
                              "t": "<b>オ</b> é o katakana de <b>お</b>.<br>Ambos som <i>/o/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>オ</b>ーストラリア (Austrália)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ka",
                      "isLetter": true,
                      "letter": "カ",
                      "word": "カ",
                      "emoji": "🔤",
                      "phonetic": "/ka/",
                      "translation": "<b>カ</b> = <i>ka</i> (igual que か)<br>Som: <b>/ka/</b> — como em <i>casa</i>",
                      "mnemonic": "O カ parece um 'k' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>カ</b> é o katakana de <b>か</b>.<br>Ambos som <i>/ka/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>カ</b>メラ (câmera)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ki",
                      "isLetter": true,
                      "letter": "キ",
                      "word": "キ",
                      "emoji": "🔤",
                      "phonetic": "/ki/",
                      "translation": "<b>キ</b> = <i>ki</i> (igual que き)<br>Som: <b>/ki/</b> — como em <i>quiabo</i>",
                      "mnemonic": "O キ parece um 'k' com dois riscos à direita.",
                      "examples": [
                          {
                              "t": "<b>キ</b> é o katakana de <b>き</b>.<br>Ambos som <i>/ki/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>キ</b>ロ (quilo)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ku",
                      "isLetter": true,
                      "letter": "ク",
                      "word": "ク",
                      "emoji": "🔤",
                      "phonetic": "/kɯ/",
                      "translation": "<b>ク</b> = <i>ku</i> (igual que く)<br>Som: <b>/ku/</b> — como em <i>cuco</i>",
                      "mnemonic": "O ク parece um '<' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>ク</b> é o katakana de <b>く</b>.<br>Ambos som <i>/ku/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ク</b>リスマス (Natal)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ke",
                      "isLetter": true,
                      "letter": "ケ",
                      "word": "ケ",
                      "emoji": "🔤",
                      "phonetic": "/ke/",
                      "translation": "<b>ケ</b> = <i>ke</i> (igual que け)<br>Som: <b>/ke/</b> — como em <i>queijo</i>",
                      "mnemonic": "O ケ parece um 'k' com um risco à esquerda.",
                      "examples": [
                          {
                              "t": "<b>ケ</b> é o katakana de <b>け</b>.<br>Ambos som <i>/ke/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ケ</b>ーキ (bolo)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ko",
                      "isLetter": true,
                      "letter": "コ",
                      "word": "コ",
                      "emoji": "🔤",
                      "phonetic": "/ko/",
                      "translation": "<b>コ</b> = <i>ko</i> (igual que こ)<br>Som: <b>/ko/</b> — como em <i>copo</i>",
                      "mnemonic": "O コ parece um 'k' com dois riscos à esquerda.",
                      "examples": [
                          {
                              "t": "<b>コ</b> é o katakana de <b>こ</b>.<br>Ambos som <i>/ko/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>コ</b>ーラ (cola)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_sa",
                      "isLetter": true,
                      "letter": "サ",
                      "word": "サ",
                      "emoji": "🔤",
                      "phonetic": "/sa/",
                      "translation": "<b>サ</b> = <i>sa</i> (igual que さ)<br>Som: <b>/sa/</b> — como em <i>sapo</i>",
                      "mnemonic": "O サ parece um 's' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>サ</b> é o katakana de <b>さ</b>.<br>Ambos som <i>/sa/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>サ</b>ラダ (salada)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_shi",
                      "isLetter": true,
                      "letter": "シ",
                      "word": "シ",
                      "emoji": "🔤",
                      "phonetic": "/ɕi/",
                      "translation": "<b>シ</b> = <i>shi</i> (igual que し)<br>Som: <b>/shi/</b> — como em <i>chave</i>",
                      "mnemonic": "O シ parece um 's' com dois riscos à direita.",
                      "examples": [
                          {
                              "t": "<b>シ</b> é o katakana de <b>し</b>.<br>Ambos som <i>/shi/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>シ</b>ャツ (camisa)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_su",
                      "isLetter": true,
                      "letter": "ス",
                      "word": "ス",
                      "emoji": "🔤",
                      "phonetic": "/sɯ/",
                      "translation": "<b>ス</b> = <i>su</i> (igual que す)<br>Som: <b>/su/</b> — como em <i>suco</i>",
                      "mnemonic": "O ス parece um 's' com um risco à esquerda.",
                      "examples": [
                          {
                              "t": "<b>ス</b> é o katakana de <b>す</b>.<br>Ambos som <i>/su/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ス</b>ープ (sopa)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_se",
                      "isLetter": true,
                      "letter": "セ",
                      "word": "セ",
                      "emoji": "🔤",
                      "phonetic": "/se/",
                      "translation": "<b>セ</b> = <i>se</i> (igual que せ)<br>Som: <b>/se/</b> — como em <i>seda</i>",
                      "mnemonic": "O セ parece um 's' com um risco no meio.",
                      "examples": [
                          {
                              "t": "<b>セ</b> é o katakana de <b>せ</b>.<br>Ambos som <i>/se/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>セ</b>ンター (centro)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_so",
                      "isLetter": true,
                      "letter": "ソ",
                      "word": "ソ",
                      "emoji": "🔤",
                      "phonetic": "/so/",
                      "translation": "<b>ソ</b> = <i>so</i> (igual que そ)<br>Som: <b>/so/</b> — como em <i>sopa</i>",
                      "mnemonic": "O ソ parece um 's' com dois riscos à esquerda.",
                      "examples": [
                          {
                              "t": "<b>ソ</b> é o katakana de <b>そ</b>.<br>Ambos som <i>/so/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ソ</b>ファ (sofá)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ta",
                      "isLetter": true,
                      "letter": "タ",
                      "word": "タ",
                      "emoji": "🔤",
                      "phonetic": "/ta/",
                      "translation": "<b>タ</b> = <i>ta</i> (igual que た)<br>Som: <b>/ta/</b> — como em <i>tatu</i>",
                      "mnemonic": "O タ parece um 't' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>タ</b> é o katakana de <b>た</b>.<br>Ambos som <i>/ta/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>タ</b>クシー (táxi)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_chi",
                      "isLetter": true,
                      "letter": "チ",
                      "word": "チ",
                      "emoji": "🔤",
                      "phonetic": "/tɕi/",
                      "translation": "<b>チ</b> = <i>chi</i> (igual que ち)<br>Som: <b>/tchi/</b> — como em <i>tchau</i>",
                      "mnemonic": "O チ parece um 't' com um risco no meio.",
                      "examples": [
                          {
                              "t": "<b>チ</b> é o katakana de <b>ち</b>.<br>Ambos som <i>/tchi/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>チ</b>ーズ (queijo)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_tsu",
                      "isLetter": true,
                      "letter": "ツ",
                      "word": "ツ",
                      "emoji": "🔤",
                      "phonetic": "/tsɯ/",
                      "translation": "<b>ツ</b> = <i>tsu</i> (igual que つ)<br>Som: <b>/tsu/</b> — como em <i>tsunami</i>",
                      "mnemonic": "O ツ parece um 't' com dois riscos à esquerda.",
                      "examples": [
                          {
                              "t": "<b>ツ</b> é o katakana de <b>つ</b>.<br>Ambos som <i>/tsu/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ツ</b>アー (tour)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_te",
                      "isLetter": true,
                      "letter": "テ",
                      "word": "テ",
                      "emoji": "🔤",
                      "phonetic": "/te/",
                      "translation": "<b>テ</b> = <i>te</i> (igual que て)<br>Som: <b>/te/</b> — como em <i>teto</i>",
                      "mnemonic": "O テ parece um 't' com um risco à esquerda.",
                      "examples": [
                          {
                              "t": "<b>テ</b> é o katakana de <b>て</b>.<br>Ambos som <i>/te/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>テ</b>ニス (tênis)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_to",
                      "isLetter": true,
                      "letter": "ト",
                      "word": "ト",
                      "emoji": "🔤",
                      "phonetic": "/to/",
                      "translation": "<b>ト</b> = <i>to</i> (igual que と)<br>Som: <b>/to/</b> — como em <i>torta</i>",
                      "mnemonic": "O ト parece um 't' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>ト</b> é o katakana de <b>と</b>.<br>Ambos som <i>/to/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ト</b>マト (tomate)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_na",
                      "isLetter": true,
                      "letter": "ナ",
                      "word": "ナ",
                      "emoji": "🔤",
                      "phonetic": "/na/",
                      "translation": "<b>ナ</b> = <i>na</i> (igual que な)<br>Som: <b>/na/</b> — como em <i>nada</i>",
                      "mnemonic": "O ナ parece um 'n' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>ナ</b> é o katakana de <b>な</b>.<br>Ambos som <i>/na/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ナ</b>イフ (faca)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ni",
                      "isLetter": true,
                      "letter": "ニ",
                      "word": "ニ",
                      "emoji": "🔤",
                      "phonetic": "/ni/",
                      "translation": "<b>ニ</b> = <i>ni</i> (igual que に)<br>Som: <b>/ni/</b> — como em <i>ninho</i>",
                      "mnemonic": "O ニ parece um 'n' com dois riscos à direita.",
                      "examples": [
                          {
                              "t": "<b>ニ</b> é o katakana de <b>に</b>.<br>Ambos som <i>/ni/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ニ</b>ュース (notícias)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_nu",
                      "isLetter": true,
                      "letter": "ヌ",
                      "word": "ヌ",
                      "emoji": "🔤",
                      "phonetic": "/nɯ/",
                      "translation": "<b>ヌ</b> = <i>nu</i> (igual que ぬ)<br>Som: <b>/nu/</b> — como em <i>nuvem</i>",
                      "mnemonic": "O ヌ parece um 'n' com um risco à esquerda.",
                      "examples": [
                          {
                              "t": "<b>ヌ</b> é o katakana de <b>ぬ</b>.<br>Ambos som <i>/nu/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ヌ</b>ードル (macarrão)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_ne",
                      "isLetter": true,
                      "letter": "ネ",
                      "word": "ネ",
                      "emoji": "🔤",
                      "phonetic": "/ne/",
                      "translation": "<b>ネ</b> = <i>ne</i> (igual que ね)<br>Som: <b>/ne/</b> — como em <i>nervo</i>",
                      "mnemonic": "O ネ parece um 'n' com um risco no meio.",
                      "examples": [
                          {
                              "t": "<b>ネ</b> é o katakana de <b>ね</b>.<br>Ambos som <i>/ne/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ネ</b>クタイ (gravata)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_L_no",
                      "isLetter": true,
                      "letter": "ノ",
                      "word": "ノ",
                      "emoji": "🔤",
                      "phonetic": "/no/",
                      "translation": "<b>ノ</b> = <i>no</i> (igual que の)<br>Som: <b>/no/</b> — como em <i>nó</i>",
                      "mnemonic": "O ノ parece um 'n' com um risco à direita.",
                      "examples": [
                          {
                              "t": "<b>ノ</b> é o katakana de <b>の</b>.<br>Ambos som <i>/no/</i>",
                              "n": "Ambos representam o mesmo som."
                          },
                          {
                              "t": "Palavra: <b>ノ</b>ート (caderno)",
                              "n": "Exemplo de uso em palavra estrangeira."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_01",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コーヒー",
                      "emoji": "☕",
                      "phonetic": "/koːçiː/",
                      "translation": "<b>café</b> — do holandês <i>koffie</i>",
                      "translations": {
                          "ja": "コーヒー",
                          "pt": "café",
                          "en": "coffee"
                      },
                      "examples": [
                          {
                              "t": "<b>コーヒー</b>を飲みます。",
                              "n": "Eu bebo café."
                          },
                          {
                              "t": "この<b>コーヒー</b>はおいしいです。",
                              "n": "Este café é delicioso."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_02",
                      "isLetter": false,
                      "letter": "テ",
                      "word": "テレビ",
                      "emoji": "📺",
                      "phonetic": "/teɾebi/",
                      "translation": "<b>televisão</b> — abreviação de <i>television</i>",
                      "translations": {
                          "ja": "テレビ",
                          "pt": "televisão",
                          "en": "TV"
                      },
                      "examples": [
                          {
                              "t": "<b>テレビ</b>を見ます。",
                              "n": "Eu assisto TV."
                          },
                          {
                              "t": "<b>テレビ</b>が好きです。",
                              "n": "Eu gosto de TV."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_03",
                      "isLetter": false,
                      "letter": "ア",
                      "word": "アイスクリーム",
                      "emoji": "🍨",
                      "phonetic": "/aisɯkɯɾiːmɯ/",
                      "translation": "<b>sorvete</b> — do inglês <i>ice cream</i>",
                      "translations": {
                          "ja": "アイスクリーム",
                          "pt": "sorvete",
                          "en": "ice cream"
                      },
                      "examples": [
                          {
                              "t": "<b>アイスクリーム</b>を食べます。",
                              "n": "Eu como sorvete."
                          },
                          {
                              "t": "<b>アイスクリーム</b>は冷たいです。",
                              "n": "Sorvete é gelado."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_04",
                      "isLetter": false,
                      "letter": "タ",
                      "word": "タクシー",
                      "emoji": "🚕",
                      "phonetic": "/takɯɕiː/",
                      "translation": "<b>táxi</b> — do inglês <i>taxi</i>",
                      "translations": {
                          "ja": "タクシー",
                          "pt": "táxi",
                          "en": "taxi"
                      },
                      "examples": [
                          {
                              "t": "<b>タクシー</b>に乗ります。",
                              "n": "Eu pego um táxi."
                          },
                          {
                              "t": "<b>タクシー</b>は速いです。",
                              "n": "O táxi é rápido."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g3_05",
                      "isLetter": false,
                      "letter": "ニ",
                      "word": "ニュース",
                      "emoji": "📰",
                      "phonetic": "/nʲɯːsɯ/",
                      "translation": "<b>notícias</b> — do inglês <i>news</i>",
                      "translations": {
                          "ja": "ニュース",
                          "pt": "notícias",
                          "en": "news"
                      },
                      "examples": [
                          {
                              "t": "<b>ニュース</b>を見ます。",
                              "n": "Eu assisto as notícias."
                          },
                          {
                              "t": "<b>ニュース</b>を聞きます。",
                              "n": "Eu ouço as notícias."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g4",
              "name": "Katakana — parte 2",
              "icon": "🔣",
              "color": "#ef4444",
              "description": "ハ行 マ行 ヤ行 ラ行 ワ行 + préstamos",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g4_L_ha",
                      "isLetter": true,
                      "letter": "ハ",
                      "word": "ハ",
                      "emoji": "🔤",
                      "phonetic": "/ha/",
                      "translation": "Nome: <b>ハ</b> (ha) — som de <i>'rrá'</i> como em 'rapaz' (mas sem vibrar).<br>Parece um <span class='hl'>'ha'</span> com um traço extra.",
                      "mnemonic": "Visual: parece um 'ha' minúsculo com um chapéu.",
                      "examples": [
                          {
                              "t": "ハは「ha」です。<br><b>ハ</b> = ha",
                              "n": "Ha é 'ha'."
                          },
                          {
                              "t": "ハンバーガー (hanbāgā) — hambúrguer",
                              "n": "Palavra comum com ハ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_hi",
                      "isLetter": true,
                      "letter": "ヒ",
                      "word": "ヒ",
                      "emoji": "🔤",
                      "phonetic": "/çi/",
                      "translation": "Nome: <b>ヒ</b> (hi) — som de <i>'ri'</i> como em 'riso', mas mais suave.<br>Parece um <span class='hl'>'hi'</span> com um sorriso.",
                      "mnemonic": "Visual: parece um 'hi' com um sorriso aberto.",
                      "examples": [
                          {
                              "t": "ヒは「hi」です。<br><b>ヒ</b> = hi",
                              "n": "Hi é 'hi'."
                          },
                          {
                              "t": "ヒーター (hītā) — aquecedor",
                              "n": "Palavra comum com ヒ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_fu",
                      "isLetter": true,
                      "letter": "フ",
                      "word": "フ",
                      "emoji": "🔤",
                      "phonetic": "/ɸɯ/",
                      "translation": "Nome: <b>フ</b> (fu) — som de <i>'fu'</i> como em 'fumaça' (sem vibrar).<br>Parece um <span class='hl'>'fu'</span> com um rabo.",
                      "mnemonic": "Visual: parece um 'fu' com uma cauda para baixo.",
                      "examples": [
                          {
                              "t": "フは「fu」です。<br><b>フ</b> = fu",
                              "n": "Fu é 'fu'."
                          },
                          {
                              "t": "フルーツ (furūtsu) — fruta",
                              "n": "Palavra comum com フ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_he",
                      "isLetter": true,
                      "letter": "ヘ",
                      "word": "ヘ",
                      "emoji": "🔤",
                      "phonetic": "/he/",
                      "translation": "Nome: <b>ヘ</b> (he) — som de <i>'rré'</i> como em 'rede' (sem vibrar).<br>Parece um <span class='hl'>'he'</span> com um chapéu.",
                      "mnemonic": "Visual: parece um 'he' com um chapéu pontudo.",
                      "examples": [
                          {
                              "t": "ヘは「he」です。<br><b>ヘ</b> = he",
                              "n": "He é 'he'."
                          },
                          {
                              "t": "ヘリコプター (herikoputā) — helicóptero",
                              "n": "Palavra comum com ヘ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ho",
                      "isLetter": true,
                      "letter": "ホ",
                      "word": "ホ",
                      "emoji": "🔤",
                      "phonetic": "/ho/",
                      "translation": "Nome: <b>ホ</b> (ho) — som de <i>'rró'</i> como em 'roda' (sem vibrar).<br>Parece um <span class='hl'>'ho'</span> com um cinto.",
                      "mnemonic": "Visual: parece um 'ho' com um cinto na horizontal.",
                      "examples": [
                          {
                              "t": "ホは「ho」です。<br><b>ホ</b> = ho",
                              "n": "Ho é 'ho'."
                          },
                          {
                              "t": "ホテル (hoteru) — hotel",
                              "n": "Palavra comum com ホ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ma",
                      "isLetter": true,
                      "letter": "マ",
                      "word": "マ",
                      "emoji": "🔤",
                      "phonetic": "/ma/",
                      "translation": "Nome: <b>マ</b> (ma) — som de <i>'ma'</i> como em 'mãe'.<br>Parece um <span class='hl'>'ma'</span> com um X.",
                      "mnemonic": "Visual: parece um 'ma' com um X no meio.",
                      "examples": [
                          {
                              "t": "マは「ma」です。<br><b>マ</b> = ma",
                              "n": "Ma é 'ma'."
                          },
                          {
                              "t": "マンゴー (mangō) — manga",
                              "n": "Palavra comum com マ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mi",
                      "isLetter": true,
                      "letter": "ミ",
                      "word": "ミ",
                      "emoji": "🔤",
                      "phonetic": "/mi/",
                      "translation": "Nome: <b>ミ</b> (mi) — som de <i>'mi'</i> como em 'mito'.<br>Parece um <span class='hl'>'mi'</span> com duas linhas.",
                      "mnemonic": "Visual: parece um 'mi' com dois traços inclinados.",
                      "examples": [
                          {
                              "t": "ミは「mi」です。<br><b>ミ</b> = mi",
                              "n": "Mi é 'mi'."
                          },
                          {
                              "t": "ミルク (miruku) — leite",
                              "n": "Palavra comum com ミ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mu",
                      "isLetter": true,
                      "letter": "ム",
                      "word": "ム",
                      "emoji": "🔤",
                      "phonetic": "/mɯ/",
                      "translation": "Nome: <b>ム</b> (mu) — som de <i>'mu'</i> como em 'mula'.<br>Parece um <span class='hl'>'mu'</span> com um rabo.",
                      "mnemonic": "Visual: parece um 'mu' com uma cauda para cima.",
                      "examples": [
                          {
                              "t": "ムは「mu」です。<br><b>ム</b> = mu",
                              "n": "Mu é 'mu'."
                          },
                          {
                              "t": "ムード (mūdo) — clima, humor",
                              "n": "Palavra comum com ム."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_me",
                      "isLetter": true,
                      "letter": "メ",
                      "word": "メ",
                      "emoji": "🔤",
                      "phonetic": "/me/",
                      "translation": "Nome: <b>メ</b> (me) — som de <i>'mé'</i> como em 'médico'.<br>Parece um <span class='hl'>'me'</span> com um X.",
                      "mnemonic": "Visual: parece um 'me' com um X no final.",
                      "examples": [
                          {
                              "t": "メは「me」です。<br><b>メ</b> = me",
                              "n": "Me é 'me'."
                          },
                          {
                              "t": "メール (mēru) — e-mail",
                              "n": "Palavra comum com メ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_mo",
                      "isLetter": true,
                      "letter": "モ",
                      "word": "モ",
                      "emoji": "🔤",
                      "phonetic": "/mo/",
                      "translation": "Nome: <b>モ</b> (mo) — som de <i>'mó'</i> como em 'moda'.<br>Parece um <span class='hl'>'mo'</span> com um X.",
                      "mnemonic": "Visual: parece um 'mo' com um X no topo.",
                      "examples": [
                          {
                              "t": "モは「mo」です。<br><b>モ</b> = mo",
                              "n": "Mo é 'mo'."
                          },
                          {
                              "t": "モーター (mōtā) — motor",
                              "n": "Palavra comum com モ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ya",
                      "isLetter": true,
                      "letter": "ヤ",
                      "word": "ヤ",
                      "emoji": "🔤",
                      "phonetic": "/ja/",
                      "translation": "Nome: <b>ヤ</b> (ya) — som de <i>'iá'</i> como em 'iate'.<br>Parece um <span class='hl'>'ya'</span> com um rabo.",
                      "mnemonic": "Visual: parece um 'ya' com uma cauda para baixo.",
                      "examples": [
                          {
                              "t": "ヤは「ya」です。<br><b>ヤ</b> = ya",
                              "n": "Ya é 'ya'."
                          },
                          {
                              "t": "ヤクルト (yakuruto) — iogurte probiótico",
                              "n": "Palavra comum com ヤ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_yu",
                      "isLetter": true,
                      "letter": "ユ",
                      "word": "ユ",
                      "emoji": "🔤",
                      "phonetic": "/jɯ/",
                      "translation": "Nome: <b>ユ</b> (yu) — som de <i>'iu'</i> como em 'iugoslavo'.<br>Parece um <span class='hl'>'yu'</span> com um gancho.",
                      "mnemonic": "Visual: parece um 'yu' com um gancho para cima.",
                      "examples": [
                          {
                              "t": "ユは「yu」です。<br><b>ユ</b> = yu",
                              "n": "Yu é 'yu'."
                          },
                          {
                              "t": "ユニーク (yunīku) — único, original",
                              "n": "Palavra comum com ユ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_yo",
                      "isLetter": true,
                      "letter": "ヨ",
                      "word": "ヨ",
                      "emoji": "🔤",
                      "phonetic": "/jo/",
                      "translation": "Nome: <b>ヨ</b> (yo) — som de <i>'iô'</i> como em 'iodo'.<br>Parece um <span class='hl'>'yo'</span> com um traço.",
                      "mnemonic": "Visual: parece um 'yo' com um traço horizontal.",
                      "examples": [
                          {
                              "t": "ヨは「yo」です。<br><b>ヨ</b> = yo",
                              "n": "Yo é 'yo'."
                          },
                          {
                              "t": "ヨット (yotto) — iate",
                              "n": "Palavra comum com ヨ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ra",
                      "isLetter": true,
                      "letter": "ラ",
                      "word": "ラ",
                      "emoji": "🔤",
                      "phonetic": "/ɾa/",
                      "translation": "Nome: <b>ラ</b> (ra) — som de <i>'rá'</i> como em 'cara' (um toque).<br>Parece um <span class='hl'>'ra'</span> com um chapéu.",
                      "mnemonic": "Visual: parece um 'ra' com um chapéu.",
                      "examples": [
                          {
                              "t": "ラは「ra」です。<br><b>ラ</b> = ra",
                              "n": "Ra é 'ra'."
                          },
                          {
                              "t": "ラジオ (rajio) — rádio",
                              "n": "Palavra comum com ラ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ri",
                      "isLetter": true,
                      "letter": "リ",
                      "word": "リ",
                      "emoji": "🔤",
                      "phonetic": "/ɾi/",
                      "translation": "Nome: <b>リ</b> (ri) — som de <i>'ri'</i> como em 'carioca' (um toque).<br>Parece um <span class='hl'>'ri'</span> com duas linhas.",
                      "mnemonic": "Visual: parece um 'ri' com dois traços paralelos.",
                      "examples": [
                          {
                              "t": "リは「ri」です。<br><b>リ</b> = ri",
                              "n": "Ri é 'ri'."
                          },
                          {
                              "t": "リスト (risuto) — lista",
                              "n": "Palavra comum com リ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ru",
                      "isLetter": true,
                      "letter": "ル",
                      "word": "ル",
                      "emoji": "🔤",
                      "phonetic": "/ɾɯ/",
                      "translation": "Nome: <b>ル</b> (ru) — som de <i>'ru'</i> como em 'cru' (um toque).<br>Parece um <span class='hl'>'ru'</span> com um laço.",
                      "mnemonic": "Visual: parece um 'ru' com um laço na ponta.",
                      "examples": [
                          {
                              "t": "ルは「ru」です。<br><b>ル</b> = ru",
                              "n": "Ru é 'ru'."
                          },
                          {
                              "t": "ルール (rūru) — regra",
                              "n": "Palavra comum com ル."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_re",
                      "isLetter": true,
                      "letter": "レ",
                      "word": "レ",
                      "emoji": "🔤",
                      "phonetic": "/ɾe/",
                      "translation": "Nome: <b>レ</b> (re) — som de <i>'ré'</i> como em 'café' (um toque).<br>Parece um <span class='hl'>'re'</span> com um rabo.",
                      "mnemonic": "Visual: parece um 're' com uma cauda para baixo.",
                      "examples": [
                          {
                              "t": "レは「re」です。<br><b>レ</b> = re",
                              "n": "Re é 're'."
                          },
                          {
                              "t": "レストラン (resutoran) — restaurante",
                              "n": "Palavra comum com レ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_ro",
                      "isLetter": true,
                      "letter": "ロ",
                      "word": "ロ",
                      "emoji": "🔤",
                      "phonetic": "/ɾo/",
                      "translation": "Nome: <b>ロ</b> (ro) — som de <i>'ró'</i> como em 'coração' (um toque).<br>Parece um <span class='hl'>'ro'</span> quadrado.",
                      "mnemonic": "Visual: parece um 'ro' quadrado (um quadrado aberto).",
                      "examples": [
                          {
                              "t": "ロは「ro」です。<br><b>ロ</b> = ro",
                              "n": "Ro é 'ro'."
                          },
                          {
                              "t": "ロボット (robotto) — robô",
                              "n": "Palavra comum com ロ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wa",
                      "isLetter": true,
                      "letter": "ワ",
                      "word": "ワ",
                      "emoji": "🔤",
                      "phonetic": "/wa/",
                      "translation": "Nome: <b>ワ</b> (wa) — som de <i>'uá'</i> como em 'uau'.<br>Parece um <span class='hl'>'wa'</span> com um sorriso.",
                      "mnemonic": "Visual: parece um 'wa' com um sorriso aberto.",
                      "examples": [
                          {
                              "t": "ワは「wa」です。<br><b>ワ</b> = wa",
                              "n": "Wa é 'wa'."
                          },
                          {
                              "t": "ワイン (wain) — vinho",
                              "n": "Palavra comum com ワ."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_wo",
                      "isLetter": true,
                      "letter": "ヲ",
                      "word": "ヲ",
                      "emoji": "🔤",
                      "phonetic": "/wo/",
                      "translation": "Nome: <b>ヲ</b> (wo) — som de <i>'uó'</i> como em 'uó' (raro).<br>Parece um <span class='hl'>'wo'</span> com um rabo.",
                      "mnemonic": "Visual: parece um 'wo' com uma cauda para baixo.",
                      "examples": [
                          {
                              "t": "ヲ é raro; usado como partícula.",
                              "n": "Exemplo: 本を読む (hon wo yomu) — ler livro."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_n",
                      "isLetter": true,
                      "letter": "ン",
                      "word": "ン",
                      "emoji": "🔤",
                      "phonetic": "/ɴ/",
                      "translation": "Nome: <b>ン</b> (n) — som nasal <i>'n'</i> como em 'não'.<br>Parece um <span class='hl'>'n'</span> com um traço.",
                      "mnemonic": "Visual: parece um 'n' com um traço diagonal.",
                      "examples": [
                          {
                              "t": "ン é o som nasal final.",
                              "n": "Exemplo: パン (pan) — pão."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_L_long_vowel",
                      "isLetter": true,
                      "letter": "ー",
                      "word": "ー",
                      "emoji": "🔤",
                      "phonetic": "/ː/",
                      "translation": "Nome: <b>ー</b> (chōonpu) — sinal de vogal longa.<br>Prolonga a vogal anterior: <i>a → ā</i>.",
                      "mnemonic": "Visual: um traço horizontal que estica o som.",
                      "examples": [
                          {
                              "t": "コーヒー (kōhī) — café",
                              "n": "O ー alonga o 'o' e o 'i'."
                          },
                          {
                              "t": "ビール (bīru) — cerveja",
                              "n": "O ー alonga o 'i'."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_01",
                      "isLetter": false,
                      "letter": "ホ",
                      "word": "ホテル",
                      "emoji": "🏨",
                      "phonetic": "/hoteɾɯ/",
                      "translation": "hotel",
                      "translations": {
                          "ja": "ホテル",
                          "pt": "hotel",
                          "en": "hotel"
                      },
                      "examples": [
                          {
                              "t": "この<b>ホテル</b>はきれいです。",
                              "n": "Este hotel é bonito."
                          },
                          {
                              "t": "<b>ホテル</b>で会いましょう。",
                              "n": "Vamos nos encontrar no hotel."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_02",
                      "isLetter": false,
                      "letter": "レ",
                      "word": "レストラン",
                      "emoji": "🍽️",
                      "phonetic": "/ɾesɯtoɾaɴ/",
                      "translation": "restaurante",
                      "translations": {
                          "ja": "レストラン",
                          "pt": "restaurante",
                          "en": "restaurant"
                      },
                      "examples": [
                          {
                              "t": "あの<b>レストラン</b>はおいしいです。",
                              "n": "Aquele restaurante é delicioso."
                          },
                          {
                              "t": "<b>レストラン</b>で昼ごはんを食べます。",
                              "n": "Vou almoçar no restaurante."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_03",
                      "isLetter": false,
                      "letter": "パ",
                      "word": "パスポート",
                      "emoji": "🛂",
                      "phonetic": "/pasɯpoːto/",
                      "translation": "passaporte",
                      "translations": {
                          "ja": "パスポート",
                          "pt": "passaporte",
                          "en": "passport"
                      },
                      "examples": [
                          {
                              "t": "<b>パスポート</b>を見せてください。",
                              "n": "Por favor, mostre seu passaporte."
                          },
                          {
                              "t": "<b>パスポート</b>を忘れました。",
                              "n": "Esqueci meu passaporte."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_04",
                      "isLetter": false,
                      "letter": "ス",
                      "word": "スマートフォン",
                      "emoji": "📱",
                      "phonetic": "/sɯmaːtoɸoɴ/",
                      "translation": "smartphone",
                      "translations": {
                          "ja": "スマートフォン",
                          "pt": "smartphone",
                          "en": "smartphone"
                      },
                      "examples": [
                          {
                              "t": "<b>スマートフォン</b>を買いました。",
                              "n": "Comprei um smartphone."
                          },
                          {
                              "t": "<b>スマートフォン</b>で写真を撮ります。",
                              "n": "Tiro fotos com o smartphone."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_05",
                      "isLetter": false,
                      "letter": "コ",
                      "word": "コンピューター",
                      "emoji": "💻",
                      "phonetic": "/koɴpjuːtaː/",
                      "translation": "computador",
                      "translations": {
                          "ja": "コンピューター",
                          "pt": "computador",
                          "en": "computer"
                      },
                      "examples": [
                          {
                              "t": "<b>コンピューター</b>で仕事をします。",
                              "n": "Trabalho no computador."
                          },
                          {
                              "t": "この<b>コンピューター</b>は新しいです。",
                              "n": "Este computador é novo."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_06",
                      "isLetter": false,
                      "letter": "バ",
                      "word": "バス",
                      "emoji": "🚌",
                      "phonetic": "/basɯ/",
                      "translation": "ônibus",
                      "translations": {
                          "ja": "バス",
                          "pt": "ônibus",
                          "en": "bus"
                      },
                      "examples": [
                          {
                              "t": "<b>バス</b>で学校に行きます。",
                              "n": "Vou à escola de ônibus."
                          },
                          {
                              "t": "次の<b>バス</b>は何時ですか。",
                              "n": "A que horas é o próximo ônibus?"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_07",
                      "isLetter": false,
                      "letter": "ビ",
                      "word": "ビール",
                      "emoji": "🍺",
                      "phonetic": "/biːɾɯ/",
                      "translation": "cerveja",
                      "translations": {
                          "ja": "ビール",
                          "pt": "cerveja",
                          "en": "beer"
                      },
                      "examples": [
                          {
                              "t": "<b>ビール</b>を一杯ください。",
                              "n": "Uma cerveja, por favor."
                          },
                          {
                              "t": "<b>ビール</b>は冷たいです。",
                              "n": "A cerveja está gelada."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g4_08",
                      "isLetter": false,
                      "letter": "チ",
                      "word": "チョコレート",
                      "emoji": "🍫",
                      "phonetic": "/tɕokoɾeːto/",
                      "translation": "chocolate",
                      "translations": {
                          "ja": "チョコレート",
                          "pt": "chocolate",
                          "en": "chocolate"
                      },
                      "examples": [
                          {
                              "t": "<b>チョコレート</b>が好きです。",
                              "n": "Eu gosto de chocolate."
                          },
                          {
                              "t": "<b>チョコレート</b>を食べます。",
                              "n": "Eu como chocolate."
                          }
                      ]
                  }
              ]
          },
          {
              "id": "ja_a0_g5",
              "name": "Primeros Kanji",
              "icon": "漢",
              "color": "#8b5cf6",
              "description": "日 月 火 水 木 金 土 + números + personas",
              "reviewFrom": [
                  "ja_a0_g1",
                  "ja_a0_g2",
                  "ja_a0_g3",
                  "ja_a0_g4"
              ],
              "cards": [
                  {
                      "id": "ja_a0_g5_L_ichi",
                      "isLetter": true,
                      "letter": "一",
                      "word": "一",
                      "emoji": "1️⃣",
                      "phonetic": "/ichi/",
                      "translation": "Uno. Lectura ON: <b>ichi</b>; lectura KUN: <b>hito</b>. <br>Un solo trazo horizontal.",
                      "mnemonic": "Un palito horizontal en el suelo: es el número uno.",
                      "examples": [
                          {
                              "t": "<b>一</b>人 (hitori) = una persona",
                              "n": "Una persona"
                          },
                          {
                              "t": "<b>一</b>つ (hitotsu) = una cosa",
                              "n": "Una cosa (contando objetos)"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ni",
                      "isLetter": true,
                      "letter": "二",
                      "word": "二",
                      "emoji": "2️⃣",
                      "phonetic": "/ni/",
                      "translation": "Dos. Lectura ON: <b>ni</b>; lectura KUN: <b>futa</b>. <br>Dos trazos horizontales paralelos.",
                      "mnemonic": "Dos palitos horizontales: el número dos.",
                      "examples": [
                          {
                              "t": "<b>二</b>人 (futari) = dos personas",
                              "n": "Dos personas"
                          },
                          {
                              "t": "<b>二</b>つ (futatsu) = dos cosas",
                              "n": "Dos cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_san",
                      "isLetter": true,
                      "letter": "三",
                      "word": "三",
                      "emoji": "3️⃣",
                      "phonetic": "/san/",
                      "translation": "Tres. Lectura ON: <b>san</b>; lectura KUN: <b>mit</b>. <br>Tres trazos horizontales.",
                      "mnemonic": "Tres palitos horizontales apilados: el número tres.",
                      "examples": [
                          {
                              "t": "<b>三</b>人 (sannin) = tres personas",
                              "n": "Tres personas"
                          },
                          {
                              "t": "<b>三</b>つ (mittsu) = tres cosas",
                              "n": "Tres cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_yon",
                      "isLetter": true,
                      "letter": "四",
                      "word": "四",
                      "emoji": "4️⃣",
                      "phonetic": "/shi/ /yon/",
                      "translation": "Cuatro. Lectura ON: <b>shi</b>; lectura KUN: <b>yon</b>. <br>Una ventana con dos cortinas.",
                      "mnemonic": "Parece una ventana con dos cortinas: cuatro lados tiene una ventana.",
                      "examples": [
                          {
                              "t": "<b>四</b>人 (yonin) = cuatro personas",
                              "n": "Cuatro personas"
                          },
                          {
                              "t": "<b>四</b>つ (yottsu) = cuatro cosas",
                              "n": "Cuatro cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_go",
                      "isLetter": true,
                      "letter": "五",
                      "word": "五",
                      "emoji": "5️⃣",
                      "phonetic": "/go/",
                      "translation": "Cinco. Lectura ON: <b>go</b>; lectura KUN: <b>itsu</b>. <br>Una persona con los brazos abiertos.",
                      "mnemonic": "Parece una persona con los brazos abiertos: cinco dedos en cada mano.",
                      "examples": [
                          {
                              "t": "<b>五</b>人 (gonin) = cinco personas",
                              "n": "Cinco personas"
                          },
                          {
                              "t": "<b>五</b>つ (itsutsu) = cinco cosas",
                              "n": "Cinco cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_roku",
                      "isLetter": true,
                      "letter": "六",
                      "word": "六",
                      "emoji": "6️⃣",
                      "phonetic": "/roku/",
                      "translation": "Seis. Lectura ON: <b>roku</b>; lectura KUN: <b>mu</b>. <br>Una tienda de campaña vista de frente.",
                      "mnemonic": "Parece una tienda de campaña con dos puntas: seis es un número de campamento.",
                      "examples": [
                          {
                              "t": "<b>六</b>人 (rokunin) = seis personas",
                              "n": "Seis personas"
                          },
                          {
                              "t": "<b>六</b>つ (muttsu) = seis cosas",
                              "n": "Seis cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shichi",
                      "isLetter": true,
                      "letter": "七",
                      "word": "七",
                      "emoji": "7️⃣",
                      "phonetic": "/shichi/ /nana/",
                      "translation": "Siete. Lectura ON: <b>shichi</b>; lectura KUN: <b>nana</b>. <br>Una cruz con un gancho.",
                      "mnemonic": "Parece un 7 con un sombrerito: es el número siete.",
                      "examples": [
                          {
                              "t": "<b>七</b>人 (shichinin / nananin) = siete personas",
                              "n": "Siete personas"
                          },
                          {
                              "t": "<b>七</b>つ (nanatsu) = siete cosas",
                              "n": "Siete cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hachi",
                      "isLetter": true,
                      "letter": "八",
                      "word": "八",
                      "emoji": "8️⃣",
                      "phonetic": "/hachi/",
                      "translation": "Ocho. Lectura ON: <b>hachi</b>; lectura KUN: <b>ya</b>. <br>Dos trazos que se separan.",
                      "mnemonic": "Dos montañas que se separan: ocho es un número de separación.",
                      "examples": [
                          {
                              "t": "<b>八</b>人 (hachinin) = ocho personas",
                              "n": "Ocho personas"
                          },
                          {
                              "t": "<b>八</b>つ (yattsu) = ocho cosas",
                              "n": "Ocho cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kyuu",
                      "isLetter": true,
                      "letter": "九",
                      "word": "九",
                      "emoji": "9️⃣",
                      "phonetic": "/kyuu/ /ku/",
                      "translation": "Nueve. Lectura ON: <b>kyuu</b>; lectura KUN: <b>kokono</b>. <br>Un brazo doblado con una mano.",
                      "mnemonic": "Parece un gancho o un brazo doblado: nueve es un número que se dobla.",
                      "examples": [
                          {
                              "t": "<b>九</b>人 (kyuunin) = nueve personas",
                              "n": "Nueve personas"
                          },
                          {
                              "t": "<b>九</b>つ (kokonotsu) = nueve cosas",
                              "n": "Nueve cosas"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_juu",
                      "isLetter": true,
                      "letter": "十",
                      "word": "十",
                      "emoji": "🔟",
                      "phonetic": "/juu/",
                      "translation": "Diez. Lectura ON: <b>juu</b>; lectura KUN: <b>tou</b>. <br>Una cruz perfecta.",
                      "mnemonic": "Una cruz: en romano, X es diez; aquí es una cruz.",
                      "examples": [
                          {
                              "t": "<b>十</b>人 (juunin) = diez personas",
                              "n": "Diez personas"
                          },
                          {
                              "t": "<b>十</b> (juu) = diez",
                              "n": "Diez"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_nichi",
                      "isLetter": true,
                      "letter": "日",
                      "word": "日",
                      "emoji": "☀️",
                      "phonetic": "/nichi/ /bi/ /hi/",
                      "translation": "Sol / Día. Lectura ON: <b>nichi</b>; lectura KUN: <b>hi</b>. <br>Un rectángulo con una línea en el medio.",
                      "mnemonic": "Un sol con un rayo en el centro: el sol está dentro del rectángulo.",
                      "examples": [
                          {
                              "t": "<b>日</b>曜日 (nichiyoubi) = domingo",
                              "n": "Domingo (día del sol)"
                          },
                          {
                              "t": "<b>日</b>本 (nihon) = Japón",
                              "n": "Japón (país del sol naciente)"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_gatsu",
                      "isLetter": true,
                      "letter": "月",
                      "word": "月",
                      "emoji": "🌙",
                      "phonetic": "/gatsu/ /tsuki/",
                      "translation": "Luna / Mes. Lectura ON: <b>gatsu</b>; lectura KUN: <b>tsuki</b>. <br>Una luna creciente con dos rayos.",
                      "mnemonic": "Una luna creciente con dos rayos: la luna está en el cielo.",
                      "examples": [
                          {
                              "t": "<b>月</b>曜日 (getsuyoubi) = lunes",
                              "n": "Lunes (día de la luna)"
                          },
                          {
                              "t": "<b>月</b> (tsuki) = luna",
                              "n": "La luna"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_ka",
                      "isLetter": true,
                      "letter": "火",
                      "word": "火",
                      "emoji": "🔥",
                      "phonetic": "/ka/",
                      "translation": "Fuego. Lectura ON: <b>ka</b>; lectura KUN: <b>hi</b>. <br>Una persona con los brazos levantados en llamas.",
                      "mnemonic": "Parece una persona con los brazos en llamas: fuego.",
                      "examples": [
                          {
                              "t": "<b>火</b>曜日 (kayoubi) = martes",
                              "n": "Martes (día del fuego)"
                          },
                          {
                              "t": "<b>火</b> (hi) = fuego",
                              "n": "Fuego"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_sui",
                      "isLetter": true,
                      "letter": "水",
                      "word": "水",
                      "emoji": "💧",
                      "phonetic": "/sui/",
                      "translation": "Agua. Lectura ON: <b>sui</b>; lectura KUN: <b>mizu</b>. <br>Tres gotas de agua cayendo.",
                      "mnemonic": "Tres gotas de agua cayendo: agua.",
                      "examples": [
                          {
                              "t": "<b>水</b>曜日 (suiyoubi) = miércoles",
                              "n": "Miércoles (día del agua)"
                          },
                          {
                              "t": "<b>水</b> (mizu) = agua",
                              "n": "Agua"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_moku",
                      "isLetter": true,
                      "letter": "木",
                      "word": "木",
                      "emoji": "🌳",
                      "phonetic": "/moku/ /ki/",
                      "translation": "Árbol. Lectura ON: <b>moku</b>; lectura KUN: <b>ki</b>. <br>Un árbol con raíces y ramas.",
                      "mnemonic": "Un árbol con raíces y ramas: el tronco y las ramas.",
                      "examples": [
                          {
                              "t": "<b>木</b>曜日 (mokuyoubi) = jueves",
                              "n": "Jueves (día del árbol)"
                          },
                          {
                              "t": "<b>木</b> (ki) = árbol",
                              "n": "Árbol"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kin",
                      "isLetter": true,
                      "letter": "金",
                      "word": "金",
                      "emoji": "💰",
                      "phonetic": "/kin/ /kane/",
                      "translation": "Oro / Dinero. Lectura ON: <b>kin</b>; lectura KUN: <b>kane</b>. <br>Una campana con un tesoro debajo.",
                      "mnemonic": "Una campana con un tesoro debajo: oro y dinero.",
                      "examples": [
                          {
                              "t": "<b>金</b>曜日 (kinyoubi) = viernes",
                              "n": "Viernes (día del oro)"
                          },
                          {
                              "t": "<b>金</b> (kane) = dinero",
                              "n": "Dinero"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_do",
                      "isLetter": true,
                      "letter": "土",
                      "word": "土",
                      "emoji": "⛰️",
                      "phonetic": "/do/ /tsuchi/",
                      "translation": "Tierra. Lectura ON: <b>do</b>; lectura KUN: <b>tsuchi</b>. <br>Una planta creciendo del suelo.",
                      "mnemonic": "Una planta creciendo del suelo: tierra.",
                      "examples": [
                          {
                              "t": "<b>土</b>曜日 (doyoubi) = sábado",
                              "n": "Sábado (día de la tierra)"
                          },
                          {
                              "t": "<b>土</b> (tsuchi) = tierra",
                              "n": "Tierra"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_hito",
                      "isLetter": true,
                      "letter": "人",
                      "word": "人",
                      "emoji": "🚶",
                      "phonetic": "/hito/ /jin/",
                      "translation": "Persona. Lectura ON: <b>jin</b>; lectura KUN: <b>hito</b>. <br>Una persona caminando.",
                      "mnemonic": "Una persona caminando: dos piernas en movimiento.",
                      "examples": [
                          {
                              "t": "<b>人</b> (hito) = persona",
                              "n": "Persona"
                          },
                          {
                              "t": "日本<b>人</b> (nihonjin) = japonés",
                              "n": "Persona japonesa"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_yama",
                      "isLetter": true,
                      "letter": "山",
                      "word": "山",
                      "emoji": "🏔️",
                      "phonetic": "/yama/ /san/",
                      "translation": "Montaña. Lectura ON: <b>san</b>; lectura KUN: <b>yama</b>. <br>Tres picos de montaña.",
                      "mnemonic": "Tres picos de montaña: la montaña más alta en el centro.",
                      "examples": [
                          {
                              "t": "<b>山</b> (yama) = montaña",
                              "n": "Montaña"
                          },
                          {
                              "t": "富士<b>山</b> (fujisan) = Monte Fuji",
                              "n": "Monte Fuji"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_kawa",
                      "isLetter": true,
                      "letter": "川",
                      "word": "川",
                      "emoji": "🏞️",
                      "phonetic": "/kawa/ /sen/",
                      "translation": "Río. Lectura ON: <b>sen</b>; lectura KUN: <b>kawa</b>. <br>Tres líneas que fluyen como un río.",
                      "mnemonic": "Tres líneas que fluyen: un río con corriente.",
                      "examples": [
                          {
                              "t": "<b>川</b> (kawa) = río",
                              "n": "Río"
                          },
                          {
                              "t": "日本<b>川</b> (nihonkawa) = río japonés",
                              "n": "Río de Japón"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_dai",
                      "isLetter": true,
                      "letter": "大",
                      "word": "大",
                      "emoji": "🐘",
                      "phonetic": "/dai/ /oo/",
                      "translation": "Grande. Lectura ON: <b>dai</b>; lectura KUN: <b>oo</b>. <br>Una persona con los brazos abiertos de par en par.",
                      "mnemonic": "Una persona con los brazos abiertos: ¡qué grande es!",
                      "examples": [
                          {
                              "t": "<b>大</b>きい (ookii) = grande",
                              "n": "Grande"
                          },
                          {
                              "t": "<b>大</b>学 (daigaku) = universidad",
                              "n": "Universidad (escuela grande)"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_L_shou",
                      "isLetter": true,
                      "letter": "小",
                      "word": "小",
                      "emoji": "🐜",
                      "phonetic": "/shou/ /ko/",
                      "translation": "Pequeño. Lectura ON: <b>shou</b>; lectura KUN: <b>ko</b>. <br>Tres gotas pequeñas o tres palitos pequeños.",
                      "mnemonic": "Tres palitos pequeños: algo muy pequeño.",
                      "examples": [
                          {
                              "t": "<b>小</b>さい (chiisai) = pequeño",
                              "n": "Pequeño"
                          },
                          {
                              "t": "<b>小</b>学校 (shougakkou) = escuela primaria",
                              "n": "Escuela pequeña"
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_01",
                      "isLetter": false,
                      "letter": "一",
                      "word": "一人",
                      "emoji": "🧍",
                      "phonetic": "/hitori/",
                      "translation": "Una persona. <b>一人</b>",
                      "translations": {
                          "ja": "一人",
                          "pt": "Uma pessoa",
                          "en": "One person"
                      },
                      "examples": [
                          {
                              "t": "<b>一人</b>で行きます。",
                              "n": "Voy solo."
                          },
                          {
                              "t": "部屋に<b>一人</b>います。",
                              "n": "Hay una persona en la habitación."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_02",
                      "isLetter": false,
                      "letter": "日",
                      "word": "日本",
                      "emoji": "🇯🇵",
                      "phonetic": "/nihon/",
                      "translation": "Japón. <b>日本</b> (país del sol naciente)",
                      "translations": {
                          "ja": "日本",
                          "pt": "Japão",
                          "en": "Japan"
                      },
                      "examples": [
                          {
                              "t": "<b>日本</b>が好きです。",
                              "n": "Me gusta Japón."
                          },
                          {
                              "t": "<b>日本</b>人です。",
                              "n": "Soy japonés."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_03",
                      "isLetter": false,
                      "letter": "月",
                      "word": "月曜日",
                      "emoji": "📅",
                      "phonetic": "/getsuyoubi/",
                      "translation": "Lunes. <b>月曜日</b>",
                      "translations": {
                          "ja": "月曜日",
                          "pt": "Segunda-feira",
                          "en": "Monday"
                      },
                      "examples": [
                          {
                              "t": "<b>月曜日</b>に働きます。",
                              "n": "Trabajo el lunes."
                          },
                          {
                              "t": "<b>月曜日</b>は忙しいです。",
                              "n": "El lunes es ocupado."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_04",
                      "isLetter": false,
                      "letter": "火",
                      "word": "火曜日",
                      "emoji": "📅",
                      "phonetic": "/kayoubi/",
                      "translation": "Martes. <b>火曜日</b>",
                      "translations": {
                          "ja": "火曜日",
                          "pt": "Terça-feira",
                          "en": "Tuesday"
                      },
                      "examples": [
                          {
                              "t": "<b>火曜日</b>に会いましょう。",
                              "n": "Encontrémonos el martes."
                          },
                          {
                              "t": "<b>火曜日</b>は暇です。",
                              "n": "El martes estoy libre."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_05",
                      "isLetter": false,
                      "letter": "水",
                      "word": "水曜日",
                      "emoji": "📅",
                      "phonetic": "/suiyoubi/",
                      "translation": "Miércoles. <b>水曜日</b>",
                      "translations": {
                          "ja": "水曜日",
                          "pt": "Quarta-feira",
                          "en": "Wednesday"
                      },
                      "examples": [
                          {
                              "t": "<b>水曜日</b>に勉強します。",
                              "n": "Estudio el miércoles."
                          },
                          {
                              "t": "<b>水曜日</b>はテストです。",
                              "n": "El miércoles hay examen."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_06",
                      "isLetter": false,
                      "letter": "木",
                      "word": "木曜日",
                      "emoji": "📅",
                      "phonetic": "/mokuyoubi/",
                      "translation": "Jueves. <b>木曜日</b>",
                      "translations": {
                          "ja": "木曜日",
                          "pt": "Quinta-feira",
                          "en": "Thursday"
                      },
                      "examples": [
                          {
                              "t": "<b>木曜日</b>に買い物します。",
                              "n": "Voy de compras el jueves."
                          },
                          {
                              "t": "<b>木曜日</b>は晴れです。",
                              "n": "El jueves hace sol."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_07",
                      "isLetter": false,
                      "letter": "金",
                      "word": "金曜日",
                      "emoji": "📅",
                      "phonetic": "/kinyoubi/",
                      "translation": "Viernes. <b>金曜日</b>",
                      "translations": {
                          "ja": "金曜日",
                          "pt": "Sexta-feira",
                          "en": "Friday"
                      },
                      "examples": [
                          {
                              "t": "<b>金曜日</b>に映画を見ます。",
                              "n": "Veo una película el viernes."
                          },
                          {
                              "t": "<b>金曜日</b>は楽しいです。",
                              "n": "El viernes es divertido."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_08",
                      "isLetter": false,
                      "letter": "土",
                      "word": "土曜日",
                      "emoji": "📅",
                      "phonetic": "/doyoubi/",
                      "translation": "Sábado. <b>土曜日</b>",
                      "translations": {
                          "ja": "土曜日",
                          "pt": "Sábado",
                          "en": "Saturday"
                      },
                      "examples": [
                          {
                              "t": "<b>土曜日</b>に遊びます。",
                              "n": "Salgo a jugar el sábado."
                          },
                          {
                              "t": "<b>土曜日</b>は休みです。",
                              "n": "El sábado es día libre."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_09",
                      "isLetter": false,
                      "letter": "人",
                      "word": "日本人",
                      "emoji": "👤",
                      "phonetic": "/nihonjin/",
                      "translation": "Japonés (persona). <b>日本人</b>",
                      "translations": {
                          "ja": "日本人",
                          "pt": "Japonês (pessoa)",
                          "en": "Japanese person"
                      },
                      "examples": [
                          {
                              "t": "彼は<b>日本人</b>です。",
                              "n": "Él es japonés."
                          },
                          {
                              "t": "<b>日本人</b>の友達がいます。",
                              "n": "Tengo un amigo japonés."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_10",
                      "isLetter": false,
                      "letter": "山",
                      "word": "富士山",
                      "emoji": "🗻",
                      "phonetic": "/fujisan/",
                      "translation": "Monte Fuji. <b>富士山</b>",
                      "translations": {
                          "ja": "富士山",
                          "pt": "Monte Fuji",
                          "en": "Mount Fuji"
                      },
                      "examples": [
                          {
                              "t": "<b>富士山</b>は高いです。",
                              "n": "El Monte Fuji es alto."
                          },
                          {
                              "t": "<b>富士山</b>を見たいです。",
                              "n": "Quiero ver el Monte Fuji."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_11",
                      "isLetter": false,
                      "letter": "大",
                      "word": "大学",
                      "emoji": "🎓",
                      "phonetic": "/daigaku/",
                      "translation": "Universidad. <b>大学</b> (escuela grande)",
                      "translations": {
                          "ja": "大学",
                          "pt": "Universidade",
                          "en": "University"
                      },
                      "examples": [
                          {
                              "t": "<b>大学</b>に行きます。",
                              "n": "Voy a la universidad."
                          },
                          {
                              "t": "<b>大学</b>で勉強します。",
                              "n": "Estudio en la universidad."
                          }
                      ]
                  },
                  {
                      "id": "ja_a0_g5_12",
                      "isLetter": false,
                      "letter": "小",
                      "word": "小学校",
                      "emoji": "🏫",
                      "phonetic": "/shougakkou/",
                      "translation": "Escuela primaria. <b>小学校</b>",
                      "translations": {
                          "ja": "小学校",
                          "pt": "Escola primária",
                          "en": "Elementary school"
                      },
                      "examples": [
                          {
                              "t": "子供は<b>小学校</b>に行きます。",
                              "n": "Los niños van a la escuela primaria."
                          },
                          {
                              "t": "<b>小学校</b>は近いです。",
                              "n": "La escuela primaria está cerca."
                          }
                      ]
                  }
              ]
          }
      ]
  }
};

// Merge into FLASHCARD_CURRICULUM if it exists (loaded after flashcard_data.js)
if (typeof FLASHCARD_CURRICULUM !== 'undefined') {
    Object.assign(FLASHCARD_CURRICULUM, FLASHCARD_ALPHA);
}
