// flashcard_data_a1.js — Nivel A1 para SenseMate (ES, EN, FR, IT, PT)
// Requiere flashcard_data.js cargado antes.

const FLASHCARD_A1 = {

  // ── ESPAÑOL ──────────────────────────────────────────────
  es: {
    level: 'A1', levelName: 'Me puedo presentar',
    groups: [
      { id:'es_a1_g1', name:'Saludos y presentaciones', icon:'👋', color:'#6366f1',
        description:'Cómo saludar, presentarte y despedirte',
        cards: [
          { id:'es_a1_g1_01', word:'hola',               emoji:'👋', translations:{es:'hola',en:'hello',fr:'bonjour',it:'ciao',pt:'olá'},              examples:[{t:'¡Hola! ¿Cómo estás?'}] },
          { id:'es_a1_g1_02', word:'adiós',              emoji:'🙋', translations:{es:'adiós',en:'goodbye',fr:'au revoir',it:'arrivederci',pt:'adeus'}, examples:[{t:'Adiós, hasta mañana.'}] },
          { id:'es_a1_g1_03', word:'buenos días',        emoji:'🌅', translations:{es:'buenos días',en:'good morning',fr:'bonjour',it:'buongiorno',pt:'bom dia'}, examples:[{t:'Buenos días, ¿cómo te llamas?'}] },
          { id:'es_a1_g1_04', word:'buenas noches',      emoji:'🌙', translations:{es:'buenas noches',en:'good night',fr:'bonne nuit',it:'buonanotte',pt:'boa noite'}, examples:[{t:'Buenas noches, hasta mañana.'}] },
          { id:'es_a1_g1_05', word:'¿cómo te llamas?',  emoji:'🏷️', translations:{es:'¿cómo te llamas?',en:"what's your name?",fr:"comment tu t'appelles?",it:'come ti chiami?',pt:'como você se chama?'}, examples:[{t:'¿Cómo te llamas? — Me llamo Ana.'}] },
          { id:'es_a1_g1_06', word:'me llamo',           emoji:'😊', translations:{es:'me llamo',en:'my name is',fr:"je m'appelle",it:'mi chiamo',pt:'me chamo'}, examples:[{t:'Me llamo Carlos. Mucho gusto.'}] },
          { id:'es_a1_g1_07', word:'¿cómo estás?',      emoji:'🤔', translations:{es:'¿cómo estás?',en:'how are you?',fr:'comment ça va?',it:'come stai?',pt:'como vai?'}, examples:[{t:'¿Cómo estás? — Muy bien, gracias.'}] },
          { id:'es_a1_g1_08', word:'muy bien',           emoji:'😄', translations:{es:'muy bien',en:'very well',fr:'très bien',it:'molto bene',pt:'muito bem'}, examples:[{t:'¿Cómo estás? — Muy bien, ¿y tú?'}] },
          { id:'es_a1_g1_09', word:'más o menos',        emoji:'🤷', translations:{es:'más o menos',en:'so-so',fr:'comme ci comme ça',it:'così così',pt:'mais ou menos'}, examples:[{t:'¿Cómo estás? — Más o menos.'}] },
          { id:'es_a1_g1_10', word:'mucho gusto',        emoji:'🤝', translations:{es:'mucho gusto',en:'nice to meet you',fr:'enchanté',it:'piacere',pt:'prazer'}, examples:[{t:'Me llamo Sofía. — Mucho gusto.'}] },
          { id:'es_a1_g1_11', word:'bienvenido/a',       emoji:'🎉', translations:{es:'bienvenido',en:'welcome',fr:'bienvenue',it:'benvenuto',pt:'bem-vindo'}, examples:[{t:'¡Bienvenido a nuestra ciudad!'}] },
          { id:'es_a1_g1_12', word:'¿de dónde eres?',   emoji:'🌍', translations:{es:'¿de dónde eres?',en:'where are you from?',fr:"tu viens d'où?",it:'di dove sei?',pt:'de onde você é?'}, examples:[{t:'¿De dónde eres? — Soy de México.'}] },
          { id:'es_a1_g1_13', word:'soy de',             emoji:'📍', translations:{es:'soy de',en:"I'm from",fr:'je viens de',it:'sono di',pt:'sou de'}, examples:[{t:'Soy de Argentina, ¿y tú?'}] },
          { id:'es_a1_g1_14', word:'perdón / disculpa',  emoji:'🙏', translations:{es:'perdón',en:'sorry / excuse me',fr:'pardon',it:'scusa',pt:'desculpe'}, examples:[{t:'Perdón, ¿puedes repetir más despacio?'}] },
          { id:'es_a1_g1_15', word:'no entiendo',        emoji:'❓', translations:{es:'no entiendo',en:"I don't understand",fr:'je ne comprends pas',it:'non capisco',pt:'não entendo'}, examples:[{t:'No entiendo. ¿Puedes hablar más lento?'}] },
          { id:'es_a1_g1_D01', type:'dialogue', context:"Dos personas se conocen en una reunión",
            dialogue:[
              {speaker:'Mónica', line:"¡Hola! Eres Julián, ¿verdad?"},
              {speaker:'Julián', line:"Sí. ¿Y tú, cómo te llamas?"},
              {speaker:'Mónica', line:"Me llamo Mónica. ¡Mucho gusto!"},
              {speaker:'Julián', line:"Mucho gusto. ¿De dónde eres?"},
              {speaker:'Mónica', line:"Soy de Buenos Aires. ¿Y tú?"},
              {speaker:'Julián', line:"Yo soy de Madrid. ¡Bienvenida!"}
            ], note:"Presentarse y preguntar el origen.",
            translations:{es:'Presentarse',en:'Introducing yourself',fr:'Se présenter',it:'Presentarsi',pt:'Apresentar-se'} },
          { id:'es_a1_g1_D02', type:'dialogue', context:"Al final de una conversación",
            dialogue:[
              {speaker:'Ana',   line:"Bueno, me tengo que ir. ¡Fue un placer!"},
              {speaker:'Pedro', line:"Igualmente. ¡Hasta pronto!"},
              {speaker:'Ana',   line:"¡Adiós! ¡Que tengas un buen día!"},
              {speaker:'Pedro', line:"¡Tú también!"}
            ], note:"Despedirse de forma amistosa.",
            translations:{es:'Despedirse',en:'Saying goodbye',fr:'Dire au revoir',it:'Salutarsi',pt:'Despedir-se'} }
        ]
      },
      { id:'es_a1_g2', name:'Cantidades y estados', icon:'😋', color:'#f59e0b',
        description:'Expresar necesidades, sensaciones y el clima',
        reviewFrom:['es_a1_g1'],
        cards: [
          { id:'es_a1_g2_01', word:'hambre',          emoji:'🍽️', translations:{es:'hambre',en:'hunger / hungry',fr:'faim',it:'fame',pt:'fome'}, examples:[{t:'Tengo mucha hambre. ¿Comemos?'}] },
          { id:'es_a1_g2_02', word:'sed',              emoji:'💧', translations:{es:'sed',en:'thirst / thirsty',fr:'soif',it:'sete',pt:'sede'}, examples:[{t:'Tengo sed. ¿Hay agua?'}] },
          { id:'es_a1_g2_03', word:'frío',             emoji:'🥶', translations:{es:'frío',en:'cold',fr:'froid',it:'freddo',pt:'frio'}, examples:[{t:'Tengo frío. ¿Puedo cerrar la ventana?'}] },
          { id:'es_a1_g2_04', word:'calor',            emoji:'🌡️', translations:{es:'calor',en:'heat / hot',fr:'chaleur',it:'caldo',pt:'calor'}, examples:[{t:'Hace calor. Voy a abrir la ventana.'}] },
          { id:'es_a1_g2_05', word:'cansado/a',        emoji:'😴', translations:{es:'cansado',en:'tired',fr:'fatigué',it:'stanco',pt:'cansado'}, examples:[{t:'Estoy muy cansado. Quiero dormir.'}] },
          { id:'es_a1_g2_06', word:'mucho/a',          emoji:'📊', translations:{es:'mucho',en:'a lot / very',fr:'beaucoup',it:'molto',pt:'muito'}, examples:[{t:'Tengo mucho trabajo hoy.'}] },
          { id:'es_a1_g2_07', word:'poco/a',           emoji:'🤏', translations:{es:'poco',en:'a little / few',fr:'peu',it:'poco',pt:'pouco'}, examples:[{t:'Tengo poco tiempo.'}] },
          { id:'es_a1_g2_08', word:'bastante',         emoji:'👌', translations:{es:'bastante',en:'quite / enough',fr:'assez',it:'abbastanza',pt:'bastante'}, examples:[{t:'Estoy bastante bien, gracias.'}] },
          { id:'es_a1_g2_09', word:'demasiado',        emoji:'🙈', translations:{es:'demasiado',en:'too much',fr:'trop',it:'troppo',pt:'demais'}, examples:[{t:'Hace demasiado calor para salir.'}] },
          { id:'es_a1_g2_10', word:'necesitar',        emoji:'🙋', translations:{es:'necesitar',en:'to need',fr:'avoir besoin de',it:'avere bisogno di',pt:'precisar'}, examples:[{t:'Necesito agua, por favor.'}] },
          { id:'es_a1_g2_11', word:'soleado',          emoji:'☀️', translations:{es:'soleado',en:'sunny',fr:'ensoleillé',it:'soleggiato',pt:'ensolarado'}, examples:[{t:'Hoy está soleado. ¡Perfecto!'}] },
          { id:'es_a1_g2_12', word:'nublado',          emoji:'☁️', translations:{es:'nublado',en:'cloudy',fr:'nuageux',it:'nuvoloso',pt:'nublado'}, examples:[{t:'Está muy nublado. Creo que va a llover.'}] },
          { id:'es_a1_g2_13', word:'lluvioso',         emoji:'🌧️', translations:{es:'lluvioso',en:'rainy',fr:'pluvieux',it:'piovoso',pt:'chuvoso'}, examples:[{t:'Está lluvioso. Lleva el paraguas.'}] },
          { id:'es_a1_g2_14', word:'hace frío / calor',emoji:'🌡️', translations:{es:'hace frío/calor',en:"it's cold/hot",fr:'il fait froid/chaud',it:'fa freddo/caldo',pt:'está frio/calor'}, examples:[{t:'¡Qué frío hace! ¿Tienes un abrigo?'}] },
          { id:'es_a1_g2_D01', type:'dialogue', context:"Hablando del tiempo al encontrarse",
            dialogue:[
              {speaker:'Luis',  line:"¡Hola! ¿Qué tiempo hace hoy?"},
              {speaker:'Clara', line:"Hace mucho frío y está nublado."},
              {speaker:'Luis',  line:"Sí, yo tengo mucho frío. ¿Y tú?"},
              {speaker:'Clara', line:"Yo también. Necesito un café caliente."},
              {speaker:'Luis',  line:"¡Buena idea! ¿Vamos a la cafetería?"}
            ], note:"Hablar del tiempo y expresar sensaciones.",
            translations:{es:'Hablar del tiempo',en:'Talking about the weather',fr:'Parler de la météo',it:'Parlare del tempo',pt:'Falar do tempo'} },
          { id:'es_a1_g2_D02', type:'dialogue', context:"Antes de comer juntos",
            dialogue:[
              {speaker:'Marta', line:"¿Tienes hambre? Son las dos."},
              {speaker:'Pablo', line:"Sí, tengo mucha hambre. ¿Qué hay para comer?"},
              {speaker:'Marta', line:"Hay pasta y ensalada. ¿Quieres?"},
              {speaker:'Pablo', line:"¡Perfecto! Y también tengo mucha sed."},
              {speaker:'Marta', line:"Hay agua y jugo de naranja."},
              {speaker:'Pablo', line:"Genial, gracias."}
            ], note:"Expresar hambre, sed y necesidades básicas.",
            translations:{es:'Hablar de comida',en:'Talking about food',fr:'Parler de nourriture',it:'Parlare di cibo',pt:'Falar de comida'} }
        ]
      },
      { id:'es_a1_g3', name:'Preguntas y números', icon:'❓', color:'#10b981',
        description:'Palabras para preguntar + números del 1 al 8',
        reviewFrom:['es_a1_g1','es_a1_g2'],
        cards: [
          { id:'es_a1_g3_01', word:'¿qué?',       emoji:'🔍', translations:{es:'¿qué?',en:'what?',fr:'quoi?',it:'cosa?',pt:'o quê?'}, examples:[{t:'¿Qué quieres tomar?'}] },
          { id:'es_a1_g3_02', word:'¿quién?',     emoji:'🧑', translations:{es:'¿quién?',en:'who?',fr:'qui?',it:'chi?',pt:'quem?'}, examples:[{t:'¿Quién es esa persona?'}] },
          { id:'es_a1_g3_03', word:'¿dónde?',     emoji:'📍', translations:{es:'¿dónde?',en:'where?',fr:'où?',it:'dove?',pt:'onde?'}, examples:[{t:'¿Dónde está el baño?'}] },
          { id:'es_a1_g3_04', word:'¿cuándo?',    emoji:'📅', translations:{es:'¿cuándo?',en:'when?',fr:'quand?',it:'quando?',pt:'quando?'}, examples:[{t:'¿Cuándo llegás?'}] },
          { id:'es_a1_g3_05', word:'¿por qué?',   emoji:'💭', translations:{es:'¿por qué?',en:'why?',fr:'pourquoi?',it:'perché?',pt:'por quê?'}, examples:[{t:'¿Por qué estás cansado?'}] },
          { id:'es_a1_g3_06', word:'¿cómo?',      emoji:'🤔', translations:{es:'¿cómo?',en:'how?',fr:'comment?',it:'come?',pt:'como?'}, examples:[{t:'¿Cómo se dice "hello" en español?'}] },
          { id:'es_a1_g3_07', word:'¿cuánto/a?',  emoji:'💰', translations:{es:'¿cuánto?',en:'how much?',fr:'combien?',it:'quanto?',pt:'quanto?'}, examples:[{t:'¿Cuánto cuesta este café?'}] },
          { id:'es_a1_g3_08', word:'¿cuántos/as?',emoji:'🔢', translations:{es:'¿cuántos?',en:'how many?',fr:'combien de?',it:'quanti?',pt:'quantos?'}, examples:[{t:'¿Cuántos son en la mesa?'}] },
          { id:'es_a1_g3_09', word:'uno / una',   emoji:'1️⃣', translations:{es:'uno',en:'one',fr:'un/une',it:'uno/una',pt:'um/uma'}, examples:[{t:'Una mesa para dos, por favor.'}] },
          { id:'es_a1_g3_10', word:'dos',          emoji:'2️⃣', translations:{es:'dos',en:'two',fr:'deux',it:'due',pt:'dois'}, examples:[{t:'Somos dos. ¿Hay mesa?'}] },
          { id:'es_a1_g3_11', word:'tres',         emoji:'3️⃣', translations:{es:'tres',en:'three',fr:'trois',it:'tre',pt:'três'}, examples:[{t:'Una mesa para tres, por favor.'}] },
          { id:'es_a1_g3_12', word:'cuatro',       emoji:'4️⃣', translations:{es:'cuatro',en:'four',fr:'quatre',it:'quattro',pt:'quatro'}, examples:[{t:'Somos cuatro. ¿Tienen mesa?'}] },
          { id:'es_a1_g3_13', word:'cinco',        emoji:'5️⃣', translations:{es:'cinco',en:'five',fr:'cinq',it:'cinque',pt:'cinco'}, examples:[{t:'Cinco cafés, por favor.'}] },
          { id:'es_a1_g3_14', word:'seis',         emoji:'6️⃣', translations:{es:'seis',en:'six',fr:'six',it:'sei',pt:'seis'}, examples:[{t:'La reunión es a las seis.'}] },
          { id:'es_a1_g3_15', word:'siete',        emoji:'7️⃣', translations:{es:'siete',en:'seven',fr:'sept',it:'sette',pt:'sete'}, examples:[{t:'Hay siete personas en la clase.'}] },
          { id:'es_a1_g3_16', word:'ocho',         emoji:'8️⃣', translations:{es:'ocho',en:'eight',fr:'huit',it:'otto',pt:'oito'}, examples:[{t:'Son las ocho de la mañana.'}] },
          { id:'es_a1_g3_D01', type:'dialogue', context:"En un restaurante",
            dialogue:[
              {speaker:'Camarero', line:"¡Buenas noches! ¿Cuántos son?"},
              {speaker:'Cliente',  line:"Somos tres. ¿Tienen mesa disponible?"},
              {speaker:'Camarero', line:"Sí, claro. ¿Tienen reserva?"},
              {speaker:'Cliente',  line:"No, no tenemos reserva."},
              {speaker:'Camarero', line:"No hay problema. Por aquí, por favor."},
              {speaker:'Cliente',  line:"Gracias. ¿Cuánto tiempo esperamos?"},
              {speaker:'Camarero', line:"Solo cinco minutos. ¿Quieren algo de beber?"},
              {speaker:'Cliente',  line:"Sí, dos aguas y un jugo de naranja."}
            ], note:"Preguntar por cantidad, pedir en un restaurante.",
            translations:{es:'En el restaurante',en:'At the restaurant',fr:'Au restaurant',it:'Al ristorante',pt:'No restaurante'} }
        ]
      },
      { id:'es_a1_g4', name:'Verbos esenciales', icon:'⚡', color:'#ef4444',
        description:'Los verbos más usados con yo / tú / él',
        reviewFrom:['es_a1_g1','es_a1_g2','es_a1_g3'],
        cards: [
          { id:'es_a1_g4_01', word:'soy / eres / es',          emoji:'🌟', translations:{es:'ser',en:'to be: I am/you are/he is',fr:'être: je suis/tu es/il est',it:'essere: sono/sei/è',pt:'ser: sou/és/é'}, examples:[{t:'Yo soy estudiante. Tú eres mi amigo.'}] },
          { id:'es_a1_g4_02', word:'estoy / estás / está',      emoji:'📍', translations:{es:'estar',en:'to be (state): I am/you are/he is',fr:'être (état)',it:'stare: sto/stai/sta',pt:'estar: estou/estás/está'}, examples:[{t:'Estoy bien. ¿Dónde estás?'}] },
          { id:'es_a1_g4_03', word:'tengo / tienes / tiene',    emoji:'✋', translations:{es:'tener',en:'to have: I have/you have/he has',fr:"avoir: j'ai/tu as/il a",it:'avere: ho/hai/ha',pt:'ter: tenho/tens/tem'}, examples:[{t:'Tengo hambre. ¿Tienes tiempo?'}] },
          { id:'es_a1_g4_04', word:'quiero / quieres / quiere', emoji:'❤️',  translations:{es:'querer',en:'to want: I want/you want/he wants',fr:'vouloir: je veux/tu veux/il veut',it:'volere: voglio/vuoi/vuole',pt:'querer: quero/queres/quer'}, examples:[{t:'Quiero un café. ¿Qué quieres tú?'}] },
          { id:'es_a1_g4_05', word:'voy / vas / va',            emoji:'🚶', translations:{es:'ir',en:'to go: I go/you go/he goes',fr:'aller: je vais/tu vas/il va',it:'andare: vado/vai/va',pt:'ir: vou/vais/vai'}, examples:[{t:'Voy al trabajo. ¿Tú vas al gimnasio?'}] },
          { id:'es_a1_g4_06', word:'hablo / hablas / habla',    emoji:'🗣️', translations:{es:'hablar',en:'to speak',fr:'parler: je parle/tu parles/il parle',it:'parlare: parlo/parli/parla',pt:'falar: falo/falas/fala'}, examples:[{t:'Hablo español. ¿Hablas inglés?'}] },
          { id:'es_a1_g4_07', word:'como / comes / come',       emoji:'🍽️', translations:{es:'comer',en:'to eat',fr:'manger: je mange/tu manges/il mange',it:'mangiare: mangio/mangi/mangia',pt:'comer: como/comes/come'}, examples:[{t:'Como pasta todos los días.'}] },
          { id:'es_a1_g4_08', word:'bebo / bebes / bebe',       emoji:'🥤', translations:{es:'beber',en:'to drink',fr:'boire: je bois/tu bois/il boit',it:'bere: bevo/bevi/beve',pt:'beber: bebo/bebes/bebe'}, examples:[{t:'Bebo café por la mañana.'}] },
          { id:'es_a1_g4_09', word:'vivo / vives / vive',       emoji:'🏠', translations:{es:'vivir',en:'to live',fr:"habiter: j'habite/tu habites/il habite",it:'vivere: vivo/vivi/vive',pt:'viver: vivo/vives/vive'}, examples:[{t:'Vivo en Madrid. ¿Dónde vives tú?'}] },
          { id:'es_a1_g4_10', word:'puedo / puedes / puede',    emoji:'💪', translations:{es:'poder',en:'can: I can/you can/he can',fr:'pouvoir: je peux/tu peux/il peut',it:'potere: posso/puoi/può',pt:'poder: posso/podes/pode'}, examples:[{t:'¿Puedes hablar más lento, por favor?'}] },
          { id:'es_a1_g4_11', word:'me gusta / te gusta',       emoji:'👍', translations:{es:'gustar',en:'to like: I like/you like',fr:"aimer: j'aime/tu aimes",it:'piacere: mi piace/ti piace',pt:'gostar: gosto/gostas'}, examples:[{t:'Me gusta el café. ¿Te gusta el té?'}] },
          { id:'es_a1_g4_12', word:'fui / fuiste / fue',        emoji:'⏪', translations:{es:'ir - pasado',en:'went: I went/you went/he went',fr:"je suis allé/tu es allé/il est allé",it:'sono andato/sei andato/è andato',pt:'fui/foste/foi'}, examples:[{t:'Fui al médico ayer.'}] },
          { id:'es_a1_g4_13', word:'trabajé / hablé (-ado)',     emoji:'🔵', translations:{es:'pasado regular -ar',en:'regular past: worked/talked',fr:"passé régulier: j'ai travaillé/parlé",it:'passato regolare: ho lavorato/parlato',pt:'passado regular: trabalhei/falei'}, examples:[{t:'Trabajé todo el día. Ella habló con él.'}] },
          { id:'es_a1_g4_D01', type:'dialogue', context:"Contando qué hiciste ayer",
            dialogue:[
              {speaker:'Valeria', line:"¿Qué hiciste ayer?"},
              {speaker:'Tomás',   line:"Fui al gimnasio por la mañana y después comí con mi familia."},
              {speaker:'Valeria', line:"¡Qué bien! ¿Dónde comieron?"},
              {speaker:'Tomás',   line:"Fuimos a un restaurante italiano. ¿Y tú?"},
              {speaker:'Valeria', line:"Yo estuve en casa. Tuve mucho trabajo."},
              {speaker:'Tomás',   line:"¿Pudiste descansar un poco?"},
              {speaker:'Valeria', line:"Sí, un poco. Me gusta trabajar desde casa."}
            ], note:"Verbos en presente y pasado: fui, comí, estuve, tuve.",
            translations:{es:'Hablar del pasado',en:'Talking about the past',fr:'Parler du passé',it:'Parlare del passato',pt:'Falar do passado'} }
        ]
      }
    ]
  },

  // ── ENGLISH ───────────────────────────────────────────────
  en: {
    level: 'A1', levelName: 'I can introduce myself',
    groups: [
      { id:'en_a1_g1', name:'Greetings & introductions', icon:'👋', color:'#6366f1',
        description:'How to greet, introduce yourself and say goodbye',
        cards: [
          { id:'en_a1_g1_01', word:'Hi / Hello',          emoji:'👋', translations:{es:'hola',en:'hi / hello',fr:'salut / bonjour',it:'ciao',pt:'olá / oi'}, examples:[{t:"Hi! How are you? — Hello! I'm fine."}] },
          { id:'en_a1_g1_02', word:'Goodbye / Bye',        emoji:'🙋', translations:{es:'adiós',en:'goodbye',fr:'au revoir',it:'arrivederci',pt:'tchau'}, examples:[{t:'Goodbye! See you tomorrow.'}] },
          { id:'en_a1_g1_03', word:'Good morning',         emoji:'🌅', translations:{es:'buenos días',en:'good morning',fr:'bonjour',it:'buongiorno',pt:'bom dia'}, examples:[{t:'Good morning! How are you today?'}] },
          { id:'en_a1_g1_04', word:'Good night',           emoji:'🌙', translations:{es:'buenas noches',en:'good night',fr:'bonne nuit',it:'buonanotte',pt:'boa noite'}, examples:[{t:'Good night! See you tomorrow.'}] },
          { id:'en_a1_g1_05', word:"What's your name?",    emoji:'🏷️', translations:{es:'¿cómo te llamas?',en:"what's your name?",fr:"comment tu t'appelles?",it:'come ti chiami?',pt:'como você se chama?'}, examples:[{t:"What's your name? — My name is Sara."}] },
          { id:'en_a1_g1_06', word:'My name is',           emoji:'😊', translations:{es:'me llamo',en:'my name is',fr:"je m'appelle",it:'mi chiamo',pt:'me chamo'}, examples:[{t:'My name is James. Nice to meet you.'}] },
          { id:'en_a1_g1_07', word:'How are you?',         emoji:'🤔', translations:{es:'¿cómo estás?',en:'how are you?',fr:'comment ça va?',it:'come stai?',pt:'como vai?'}, examples:[{t:'How are you? — Very well, thanks!'}] },
          { id:'en_a1_g1_08', word:"I'm fine / very well", emoji:'😄', translations:{es:'estoy bien / muy bien',en:"I'm fine / very well",fr:'je vais bien / très bien',it:'sto bene / molto bene',pt:'estou bem / muito bem'}, examples:[{t:"How are you? — I'm fine, and you?"}] },
          { id:'en_a1_g1_09', word:'Not bad / so-so',      emoji:'🤷', translations:{es:'más o menos',en:'not bad / so-so',fr:'pas mal / comme ci comme ça',it:'non male / così così',pt:'mais ou menos'}, examples:[{t:'How are you? — Not bad, thanks.'}] },
          { id:'en_a1_g1_10', word:'Nice to meet you',     emoji:'🤝', translations:{es:'mucho gusto',en:'nice to meet you',fr:'enchanté',it:'piacere',pt:'prazer'}, examples:[{t:'This is Emily. — Nice to meet you!'}] },
          { id:'en_a1_g1_11', word:'Welcome',              emoji:'🎉', translations:{es:'bienvenido',en:'welcome',fr:'bienvenue',it:'benvenuto',pt:'bem-vindo'}, examples:[{t:'Welcome to our city!'}] },
          { id:'en_a1_g1_12', word:'Where are you from?',  emoji:'🌍', translations:{es:'¿de dónde eres?',en:'where are you from?',fr:"tu viens d'où?",it:'di dove sei?',pt:'de onde você é?'}, examples:[{t:"Where are you from? — I'm from Brazil."}] },
          { id:'en_a1_g1_13', word:"I'm from",            emoji:'📍', translations:{es:'soy de',en:"I'm from",fr:'je viens de',it:'sono di',pt:'sou de'}, examples:[{t:"I'm from Canada. And you?"}] },
          { id:'en_a1_g1_14', word:'Sorry / Excuse me',    emoji:'🙏', translations:{es:'perdón / disculpa',en:'sorry / excuse me',fr:'pardon / excusez-moi',it:'scusa / mi scusi',pt:'desculpe'}, examples:[{t:'Excuse me, can you repeat that more slowly?'}] },
          { id:'en_a1_g1_15', word:"I don't understand",   emoji:'❓', translations:{es:'no entiendo',en:"I don't understand",fr:'je ne comprends pas',it:'non capisco',pt:'não entendo'}, examples:[{t:"Sorry, I don't understand. Can you speak more slowly?"}] },
          { id:'en_a1_g1_D01', type:'dialogue', context:"Two people meet at a conference",
            dialogue:[
              {speaker:'Monica', line:"Hi! You're Julian, right?"},
              {speaker:'Julian', line:"Yes! And you, what's your name?"},
              {speaker:'Monica', line:"I'm Monica. Nice to meet you!"},
              {speaker:'Julian', line:"Nice to meet you too. Where are you from?"},
              {speaker:'Monica', line:"I'm from Buenos Aires. And you?"},
              {speaker:'Julian', line:"I'm from London. Welcome!"}
            ], note:"Greetings, introductions and asking where someone is from.",
            translations:{es:'Presentarse',en:'Introducing yourself',fr:'Se présenter',it:'Presentarsi',pt:'Apresentar-se'} },
          { id:'en_a1_g1_D02', type:'dialogue', context:"Saying goodbye after a meeting",
            dialogue:[
              {speaker:'Anna',  line:"Well, I have to go. It was a pleasure!"},
              {speaker:'Peter', line:"Likewise, Anna. See you soon!"},
              {speaker:'Anna',  line:"Goodbye! Have a great day!"},
              {speaker:'Peter', line:"You too!"}
            ], note:"Common expressions for saying goodbye.",
            translations:{es:'Despedirse',en:'Saying goodbye',fr:'Dire au revoir',it:'Salutarsi',pt:'Despedir-se'} }
        ]
      },
      { id:'en_a1_g2', name:'Quantities & states', icon:'😋', color:'#f59e0b',
        description:'Expressing needs, feelings and weather',
        reviewFrom:['en_a1_g1'],
        cards: [
          { id:'en_a1_g2_01', word:'hungry',          emoji:'🍽️', translations:{es:'hambre',en:'hungry',fr:'faim',it:'fame',pt:'fome'}, examples:[{t:"I'm really hungry. Shall we eat?"}] },
          { id:'en_a1_g2_02', word:'thirsty',          emoji:'💧', translations:{es:'sed',en:'thirsty',fr:'soif',it:'sete',pt:'sede'}, examples:[{t:"I'm thirsty. Is there any water?"}] },
          { id:'en_a1_g2_03', word:'cold',             emoji:'🥶', translations:{es:'frío',en:'cold',fr:'froid',it:'freddo',pt:'frio'}, examples:[{t:"I'm cold. Can I close the window?"}] },
          { id:'en_a1_g2_04', word:'hot',              emoji:'🌡️', translations:{es:'calor',en:'hot',fr:'chaud',it:'caldo',pt:'calor'}, examples:[{t:"It's hot. I'll open the window."}] },
          { id:'en_a1_g2_05', word:'tired',            emoji:'😴', translations:{es:'cansado',en:'tired',fr:'fatigué',it:'stanco',pt:'cansado'}, examples:[{t:"I'm very tired. I want to sleep."}] },
          { id:'en_a1_g2_06', word:'a lot / very',     emoji:'📊', translations:{es:'mucho / muy',en:'a lot / very',fr:'beaucoup / très',it:'molto',pt:'muito'}, examples:[{t:'I have a lot of work today.'}] },
          { id:'en_a1_g2_07', word:'a little',         emoji:'🤏', translations:{es:'un poco',en:'a little',fr:'un peu',it:"un po'",pt:'um pouco'}, examples:[{t:"I have a little time. Let's go quickly."}] },
          { id:'en_a1_g2_08', word:'quite / enough',   emoji:'👌', translations:{es:'bastante',en:'quite / enough',fr:'assez',it:'abbastanza',pt:'bastante'}, examples:[{t:"I'm quite well, thanks."}] },
          { id:'en_a1_g2_09', word:'too much',         emoji:'🙈', translations:{es:'demasiado',en:'too much',fr:'trop',it:'troppo',pt:'demais'}, examples:[{t:"It's too hot to go outside."}] },
          { id:'en_a1_g2_10', word:'I need',           emoji:'🙋', translations:{es:'necesito',en:'I need',fr:"j'ai besoin de",it:'ho bisogno di',pt:'preciso de'}, examples:[{t:'I need some water, please.'}] },
          { id:'en_a1_g2_11', word:'sunny',            emoji:'☀️', translations:{es:'soleado',en:'sunny',fr:'ensoleillé',it:'soleggiato',pt:'ensolarado'}, examples:[{t:"It's sunny today. Perfect for a walk!"}] },
          { id:'en_a1_g2_12', word:'cloudy',           emoji:'☁️', translations:{es:'nublado',en:'cloudy',fr:'nuageux',it:'nuvoloso',pt:'nublado'}, examples:[{t:"It's very cloudy. I think it's going to rain."}] },
          { id:'en_a1_g2_13', word:'rainy',            emoji:'🌧️', translations:{es:'lluvioso',en:'rainy',fr:'pluvieux',it:'piovoso',pt:'chuvoso'}, examples:[{t:"It's rainy. Take your umbrella."}] },
          { id:'en_a1_g2_14', word:"What's the weather like?", emoji:'🌡️', translations:{es:'¿qué tiempo hace?',en:"what's the weather like?",fr:'quel temps fait-il?',it:'che tempo fa?',pt:'como está o tempo?'}, examples:[{t:"What's the weather like? — It's cold and cloudy."}] },
          { id:'en_a1_g2_D01', type:'dialogue', context:"Talking about the weather when you meet",
            dialogue:[
              {speaker:'Luis',  line:"Hi! What's the weather like today?"},
              {speaker:'Clara', line:"It's very cold and cloudy."},
              {speaker:'Luis',  line:"Yes, I'm so cold. Are you cold too?"},
              {speaker:'Clara', line:"Me too! I need a hot coffee."},
              {speaker:'Luis',  line:"Great idea! Shall we go to the café?"}
            ], note:"Talking about weather and expressing feelings.",
            translations:{es:'Hablar del tiempo',en:'Talking about the weather',fr:'Parler de la météo',it:'Parlare del tempo',pt:'Falar do tempo'} },
          { id:'en_a1_g2_D02', type:'dialogue', context:"Before eating together",
            dialogue:[
              {speaker:'Marta', line:"Are you hungry? It's two o'clock."},
              {speaker:'Pablo', line:"Yes, I'm very hungry. What's there to eat?"},
              {speaker:'Marta', line:"There's pasta and salad. Do you want some?"},
              {speaker:'Pablo', line:"Perfect! And I'm also very thirsty."},
              {speaker:'Marta', line:"There's water and orange juice."},
              {speaker:'Pablo', line:"Great, thank you."}
            ], note:"Expressing hunger, thirst and basic needs.",
            translations:{es:'Hablar de comida',en:'Talking about food',fr:'Parler de nourriture',it:'Parlare di cibo',pt:'Falar de comida'} }
        ]
      },
      { id:'en_a1_g3', name:'Questions & numbers', icon:'❓', color:'#10b981',
        description:'Question words + numbers 1 to 8',
        reviewFrom:['en_a1_g1','en_a1_g2'],
        cards: [
          { id:'en_a1_g3_01', word:'What?',    emoji:'🔍', translations:{es:'¿qué?',en:'what?',fr:'quoi?',it:'cosa?',pt:'o quê?'}, examples:[{t:'What do you want to drink?'}] },
          { id:'en_a1_g3_02', word:'Who?',     emoji:'🧑', translations:{es:'¿quién?',en:'who?',fr:'qui?',it:'chi?',pt:'quem?'}, examples:[{t:'Who is that person?'}] },
          { id:'en_a1_g3_03', word:'Where?',   emoji:'📍', translations:{es:'¿dónde?',en:'where?',fr:'où?',it:'dove?',pt:'onde?'}, examples:[{t:'Where is the bathroom?'}] },
          { id:'en_a1_g3_04', word:'When?',    emoji:'📅', translations:{es:'¿cuándo?',en:'when?',fr:'quand?',it:'quando?',pt:'quando?'}, examples:[{t:'When do you arrive?'}] },
          { id:'en_a1_g3_05', word:'Why?',     emoji:'💭', translations:{es:'¿por qué?',en:'why?',fr:'pourquoi?',it:'perché?',pt:'por quê?'}, examples:[{t:'Why are you tired?'}] },
          { id:'en_a1_g3_06', word:'How?',     emoji:'🤔', translations:{es:'¿cómo?',en:'how?',fr:'comment?',it:'come?',pt:'como?'}, examples:[{t:'How do you say "hola" in English?'}] },
          { id:'en_a1_g3_07', word:'How much?',emoji:'💰', translations:{es:'¿cuánto?',en:'how much?',fr:'combien?',it:'quanto?',pt:'quanto?'}, examples:[{t:'How much is this coffee?'}] },
          { id:'en_a1_g3_08', word:'How many?',emoji:'🔢', translations:{es:'¿cuántos?',en:'how many?',fr:'combien de?',it:'quanti?',pt:'quantos?'}, examples:[{t:'How many people are at the table?'}] },
          { id:'en_a1_g3_09', word:'one',      emoji:'1️⃣', translations:{es:'uno',en:'one',fr:'un',it:'uno',pt:'um'}, examples:[{t:'A table for one, please.'}] },
          { id:'en_a1_g3_10', word:'two',      emoji:'2️⃣', translations:{es:'dos',en:'two',fr:'deux',it:'due',pt:'dois'}, examples:[{t:"There are two of us. Is there a table?"}] },
          { id:'en_a1_g3_11', word:'three',    emoji:'3️⃣', translations:{es:'tres',en:'three',fr:'trois',it:'tre',pt:'três'}, examples:[{t:'A table for three, please.'}] },
          { id:'en_a1_g3_12', word:'four',     emoji:'4️⃣', translations:{es:'cuatro',en:'four',fr:'quatre',it:'quattro',pt:'quatro'}, examples:[{t:'We are four. Do you have a table?'}] },
          { id:'en_a1_g3_13', word:'five',     emoji:'5️⃣', translations:{es:'cinco',en:'five',fr:'cinq',it:'cinque',pt:'cinco'}, examples:[{t:'Five coffees, please.'}] },
          { id:'en_a1_g3_14', word:'six',      emoji:'6️⃣', translations:{es:'seis',en:'six',fr:'six',it:'sei',pt:'seis'}, examples:[{t:'The meeting is at six.'}] },
          { id:'en_a1_g3_15', word:'seven',    emoji:'7️⃣', translations:{es:'siete',en:'seven',fr:'sept',it:'sette',pt:'sete'}, examples:[{t:'There are seven people in the class.'}] },
          { id:'en_a1_g3_16', word:'eight',    emoji:'8️⃣', translations:{es:'ocho',en:'eight',fr:'huit',it:'otto',pt:'oito'}, examples:[{t:"It's eight in the morning."}] },
          { id:'en_a1_g3_D01', type:'dialogue', context:"At a restaurant",
            dialogue:[
              {speaker:'Waiter',   line:"Good evening! How many people?"},
              {speaker:'Customer', line:"There are three of us. Do you have a table?"},
              {speaker:'Waiter',   line:"Yes, of course. Do you have a reservation?"},
              {speaker:'Customer', line:"No, we don't have a reservation."},
              {speaker:'Waiter',   line:"No problem. This way, please."},
              {speaker:'Customer', line:"Thank you. How long do we wait?"},
              {speaker:'Waiter',   line:"Just five minutes. Would you like something to drink?"},
              {speaker:'Customer', line:"Yes, two waters and one orange juice."}
            ], note:"Asking about quantity, ordering at a restaurant.",
            translations:{es:'En el restaurante',en:'At the restaurant',fr:'Au restaurant',it:'Al ristorante',pt:'No restaurante'} }
        ]
      },
      { id:'en_a1_g4', name:'Essential verbs', icon:'⚡', color:'#ef4444',
        description:'Most used verbs — present + simple past',
        reviewFrom:['en_a1_g1','en_a1_g2','en_a1_g3'],
        cards: [
          { id:'en_a1_g4_01', word:'I am / you are / he is',    emoji:'🌟', translations:{es:'ser/estar: soy/eres/es',en:'to be: I am/you are/he is',fr:'être: je suis/tu es/il est',it:'essere: sono/sei/è',pt:'ser: sou/és/é'}, examples:[{t:"I am a student. You are my friend."}] },
          { id:'en_a1_g4_02', word:'I have / you have',          emoji:'✋', translations:{es:'tener: tengo/tienes',en:'to have: I have/you have',fr:"avoir: j'ai/tu as",it:'avere: ho/hai',pt:'ter: tenho/tens'}, examples:[{t:'I have a question. Do you have time?'}] },
          { id:'en_a1_g4_03', word:'I want / you want',          emoji:'❤️',  translations:{es:'querer: quiero/quieres',en:'to want: I want/you want',fr:'vouloir: je veux/tu veux',it:'volere: voglio/vuoi',pt:'querer: quero/queres'}, examples:[{t:'I want a coffee. What do you want?'}] },
          { id:'en_a1_g4_04', word:'I go / you go / he goes',   emoji:'🚶', translations:{es:'ir: voy/vas/va',en:'to go: I go/you go/he goes',fr:'aller: je vais/tu vas/il va',it:'andare: vado/vai/va',pt:'ir: vou/vais/vai'}, examples:[{t:'I go to work. Do you go to the gym?'}] },
          { id:'en_a1_g4_05', word:'I speak / you speak',        emoji:'🗣️', translations:{es:'hablar: hablo/hablas',en:'to speak: I speak/you speak',fr:'parler: je parle/tu parles',it:'parlare: parlo/parli',pt:'falar: falo/falas'}, examples:[{t:'I speak Spanish. Do you speak English?'}] },
          { id:'en_a1_g4_06', word:'I eat / you eat',            emoji:'🍽️', translations:{es:'comer: como/comes',en:'to eat: I eat/you eat',fr:'manger: je mange/tu manges',it:'mangiare: mangio/mangi',pt:'comer: como/comes'}, examples:[{t:'I eat pasta every day.'}] },
          { id:'en_a1_g4_07', word:'I drink / you drink',        emoji:'🥤', translations:{es:'beber: bebo/bebes',en:'to drink: I drink/you drink',fr:'boire: je bois/tu bois',it:'bere: bevo/bevi',pt:'beber: bebo/bebes'}, examples:[{t:'I drink coffee in the morning.'}] },
          { id:'en_a1_g4_08', word:"I like / I don't like",      emoji:'👍', translations:{es:'me gusta/no me gusta',en:"I like/I don't like",fr:"j'aime/je n'aime pas",it:'mi piace/non mi piace',pt:'gosto/não gosto'}, examples:[{t:"I like coffee. I don't like tea."}] },
          { id:'en_a1_g4_09', word:"I can / I can't",            emoji:'💪', translations:{es:'puedo/no puedo',en:"I can/I can't",fr:'je peux/je ne peux pas',it:'posso/non posso',pt:'posso/não posso'}, examples:[{t:'Can you speak more slowly, please?'}] },
          { id:'en_a1_g4_10', word:'I live / you live',          emoji:'🏠', translations:{es:'vivir: vivo/vives',en:'to live: I live/you live',fr:"habiter: j'habite/tu habites",it:'vivere: vivo/vivi',pt:'viver: vivo/vives'}, examples:[{t:'I live in London. Where do you live?'}] },
          { id:'en_a1_g4_11', word:'I went / you went',          emoji:'⏪', translations:{es:'fui/fuiste',en:'went (past of go)',fr:"je suis allé/tu es allé",it:'sono andato/sei andato',pt:'fui/foste'}, examples:[{t:'I went to the doctor yesterday.'}] },
          { id:'en_a1_g4_12', word:'I worked / talked / walked', emoji:'🔵', translations:{es:'trabajé/hablé/caminé (-ed)',en:'regular past: worked/talked/walked',fr:"passé régulier: j'ai travaillé/parlé",it:'passato regolare: ho lavorato/parlato',pt:'passado regular: trabalhei/falei'}, examples:[{t:'I worked all day. She talked to him.'}] },
          { id:'en_a1_g4_13', word:'went / came / saw / had',    emoji:'🔴', translations:{es:'fui/vine/vi/tuve (irregulares)',en:'irregular past: went/came/saw/had',fr:"irrégulier: suis allé/suis venu/ai vu/ai eu",it:'irregolare: sono andato/venuto/visto/avuto',pt:'irregular: fui/vim/vi/tive'}, examples:[{t:'I went home. She came late. We had dinner.'}] },
          { id:'en_a1_g4_D01', type:'dialogue', context:"Talking about what you did yesterday",
            dialogue:[
              {speaker:'Valeria', line:"What did you do yesterday?"},
              {speaker:'Thomas',  line:"I went to the gym in the morning and then I had lunch with my family."},
              {speaker:'Valeria', line:"That's nice! Where did you eat?"},
              {speaker:'Thomas',  line:"We went to an Italian restaurant. And you?"},
              {speaker:'Valeria', line:"I stayed home. I had a lot of work."},
              {speaker:'Thomas',  line:"Could you rest a little?"},
              {speaker:'Valeria', line:"Yes, a little. I like working from home."}
            ], note:"Past tense verbs: went, had, stayed, could, worked.",
            translations:{es:'Hablar del pasado',en:'Talking about the past',fr:'Parler du passé',it:'Parlare del passato',pt:'Falar do passado'} }
        ]
      }
    ]
  },

  // ── FRANÇAIS ─────────────────────────────────────────────
  fr: {
    level: 'A1', levelName: 'Je peux me présenter',
    groups: [
      { id:'fr_a1_g1', name:'Salutations', icon:'👋', color:'#6366f1',
        description:'Saluer, se présenter et dire au revoir',
        cards: [
          { id:'fr_a1_g1_01', word:'Bonjour / Salut',       emoji:'👋', translations:{es:'hola',en:'hello / hi',fr:'bonjour / salut',it:'ciao',pt:'olá / oi'}, examples:[{t:'Bonjour! Comment ça va?'}] },
          { id:'fr_a1_g1_02', word:'Au revoir',              emoji:'🙋', translations:{es:'adiós',en:'goodbye',fr:'au revoir',it:'arrivederci',pt:'adeus'}, examples:[{t:'Au revoir! À demain.'}] },
          { id:'fr_a1_g1_03', word:'Bonsoir',                emoji:'🌆', translations:{es:'buenas noches',en:'good evening',fr:'bonsoir',it:'buonasera',pt:'boa noite'}, examples:[{t:"Bonsoir! Comment s'est passée ta journée?"}] },
          { id:'fr_a1_g1_04', word:"Comment tu t'appelles?", emoji:'🏷️', translations:{es:'¿cómo te llamas?',en:"what's your name?",fr:"comment tu t'appelles?",it:'come ti chiami?',pt:'como você se chama?'}, examples:[{t:"Comment tu t'appelles? — Je m'appelle Léa."}] },
          { id:'fr_a1_g1_05', word:"Je m'appelle",           emoji:'😊', translations:{es:'me llamo',en:'my name is',fr:"je m'appelle",it:'mi chiamo',pt:'me chamo'}, examples:[{t:"Je m'appelle Marc. Enchanté!"}] },
          { id:'fr_a1_g1_06', word:'Comment ça va?',         emoji:'🤔', translations:{es:'¿cómo estás?',en:'how are you?',fr:'comment ça va?',it:'come stai?',pt:'como vai?'}, examples:[{t:'Comment ça va? — Très bien, merci!'}] },
          { id:'fr_a1_g1_07', word:'Très bien / Bien',       emoji:'😄', translations:{es:'muy bien / bien',en:'very well / fine',fr:'très bien / bien',it:'molto bene / bene',pt:'muito bem / bem'}, examples:[{t:'Ça va? — Très bien, et toi?'}] },
          { id:'fr_a1_g1_08', word:'Comme ci comme ça',      emoji:'🤷', translations:{es:'más o menos',en:'so-so',fr:'comme ci comme ça',it:'così così',pt:'mais ou menos'}, examples:[{t:'Ça va? — Comme ci comme ça.'}] },
          { id:'fr_a1_g1_09', word:'Enchanté(e)',             emoji:'🤝', translations:{es:'mucho gusto',en:'nice to meet you',fr:'enchanté(e)',it:'piacere',pt:'prazer'}, examples:[{t:'Voici Sophie. — Enchanté, Sophie!'}] },
          { id:'fr_a1_g1_10', word:'Bienvenue',              emoji:'🎉', translations:{es:'bienvenido',en:'welcome',fr:'bienvenue',it:'benvenuto',pt:'bem-vindo'}, examples:[{t:'Bienvenue dans notre ville!'}] },
          { id:'fr_a1_g1_11', word:"Tu viens d'où?",         emoji:'🌍', translations:{es:'¿de dónde eres?',en:'where are you from?',fr:"tu viens d'où?",it:'di dove sei?',pt:'de onde você é?'}, examples:[{t:"Tu viens d'où? — Je viens de Paris."}] },
          { id:'fr_a1_g1_12', word:'Je viens de',            emoji:'📍', translations:{es:'soy de',en:"I'm from",fr:'je viens de',it:'sono di',pt:'sou de'}, examples:[{t:'Je viens de Lyon. Et toi?'}] },
          { id:'fr_a1_g1_13', word:'Pardon / Excusez-moi',  emoji:'🙏', translations:{es:'perdón',en:'sorry / excuse me',fr:'pardon / excusez-moi',it:'scusa / mi scusi',pt:'desculpe'}, examples:[{t:'Pardon, pouvez-vous répéter plus lentement?'}] },
          { id:'fr_a1_g1_14', word:'Je ne comprends pas',    emoji:'❓', translations:{es:'no entiendo',en:"I don't understand",fr:'je ne comprends pas',it:'non capisco',pt:'não entendo'}, examples:[{t:'Désolé, je ne comprends pas. Parlez plus lentement?'}] },
          { id:'fr_a1_g1_15', word:"S'il te plaît / Merci",  emoji:'🙏', translations:{es:'por favor / gracias',en:'please / thank you',fr:"s'il te plaît / merci",it:'per favore / grazie',pt:'por favor / obrigado'}, examples:[{t:"Un café, s'il te plaît. — Voilà. — Merci!"}] },
          { id:'fr_a1_g1_D01', type:'dialogue', context:"Deux personnes se rencontrent à une soirée",
            dialogue:[
              {speaker:'Sophie', line:"Salut! Tu t'appelles Julien, c'est ça?"},
              {speaker:'Julien', line:"Oui! Et toi, comment tu t'appelles?"},
              {speaker:'Sophie', line:"Je m'appelle Sophie. Enchantée!"},
              {speaker:'Julien', line:"Enchanté, Sophie. Tu viens d'où?"},
              {speaker:'Sophie', line:'Je viens de Bordeaux. Et toi?'},
              {speaker:'Julien', line:'Moi, je viens de Lyon. Bienvenue!'}
            ], note:"Se présenter et demander l'origine.",
            translations:{es:'Presentarse',en:'Introducing yourself',fr:'Se présenter',it:'Presentarsi',pt:'Apresentar-se'} },
          { id:'fr_a1_g1_D02', type:'dialogue', context:"Fin d'une conversation",
            dialogue:[
              {speaker:'Emma',   line:"Bon, il faut que j'y aille. C'était un plaisir!"},
              {speaker:'Pierre', line:'Moi aussi. À bientôt, Emma!'},
              {speaker:'Emma',   line:'Au revoir! Bonne journée!'},
              {speaker:'Pierre', line:'Toi aussi!'}
            ], note:'Prendre congé poliment.',
            translations:{es:'Despedirse',en:'Saying goodbye',fr:'Dire au revoir',it:'Salutarsi',pt:'Despedir-se'} }
        ]
      },
      { id:'fr_a1_g2', name:'Quantités et états', icon:'😋', color:'#f59e0b',
        description:'Exprimer ses besoins, sensations et la météo',
        reviewFrom:['fr_a1_g1'],
        cards: [
          { id:'fr_a1_g2_01', word:"J'ai faim",          emoji:'🍽️', translations:{es:'tengo hambre',en:"I'm hungry",fr:"j'ai faim",it:'ho fame',pt:'estou com fome'}, examples:[{t:"J'ai très faim. On mange?"}] },
          { id:'fr_a1_g2_02', word:"J'ai soif",           emoji:'💧', translations:{es:'tengo sed',en:"I'm thirsty",fr:"j'ai soif",it:'ho sete',pt:'estou com sede'}, examples:[{t:"J'ai soif. Il y a de l'eau?"}] },
          { id:'fr_a1_g2_03', word:"J'ai froid",          emoji:'🥶', translations:{es:'tengo frío',en:"I'm cold",fr:"j'ai froid",it:'ho freddo',pt:'estou com frio'}, examples:[{t:"J'ai froid. Je peux fermer la fenêtre?"}] },
          { id:'fr_a1_g2_04', word:"J'ai chaud",          emoji:'🌡️', translations:{es:'tengo calor',en:"I'm hot",fr:"j'ai chaud",it:'ho caldo',pt:'estou com calor'}, examples:[{t:"Il fait chaud. Je vais ouvrir la fenêtre."}] },
          { id:'fr_a1_g2_05', word:'Je suis fatigué(e)',  emoji:'😴', translations:{es:'estoy cansado',en:"I'm tired",fr:'je suis fatigué(e)',it:'sono stanco/a',pt:'estou cansado'}, examples:[{t:"Je suis très fatigué. Je veux dormir."}] },
          { id:'fr_a1_g2_06', word:'Beaucoup',            emoji:'📊', translations:{es:'mucho',en:'a lot',fr:'beaucoup',it:'molto',pt:'muito'}, examples:[{t:"J'ai beaucoup de travail aujourd'hui."}] },
          { id:'fr_a1_g2_07', word:'Un peu',              emoji:'🤏', translations:{es:'un poco',en:'a little',fr:'un peu',it:"un po'",pt:'um pouco'}, examples:[{t:"J'ai un peu de temps. Allons-y vite."}] },
          { id:'fr_a1_g2_08', word:'Assez',               emoji:'👌', translations:{es:'bastante',en:'quite / enough',fr:'assez',it:'abbastanza',pt:'bastante'}, examples:[{t:'Je vais assez bien, merci.'}] },
          { id:'fr_a1_g2_09', word:'Trop',                emoji:'🙈', translations:{es:'demasiado',en:'too much',fr:'trop',it:'troppo',pt:'demais'}, examples:[{t:'Il fait trop chaud pour sortir.'}] },
          { id:'fr_a1_g2_10', word:"J'ai besoin de",      emoji:'🙋', translations:{es:'necesito',en:'I need',fr:"j'ai besoin de",it:'ho bisogno di',pt:'preciso de'}, examples:[{t:"J'ai besoin d'eau, s'il vous plaît."}] },
          { id:'fr_a1_g2_11', word:'Ensoleillé',          emoji:'☀️', translations:{es:'soleado',en:'sunny',fr:'ensoleillé',it:'soleggiato',pt:'ensolarado'}, examples:[{t:"Il fait ensoleillé aujourd'hui. Parfait!"}] },
          { id:'fr_a1_g2_12', word:'Nuageux',             emoji:'☁️', translations:{es:'nublado',en:'cloudy',fr:'nuageux',it:'nuvoloso',pt:'nublado'}, examples:[{t:"C'est très nuageux. Je crois qu'il va pleuvoir."}] },
          { id:'fr_a1_g2_13', word:'Il pleut',            emoji:'🌧️', translations:{es:'está lloviendo',en:"it's raining",fr:'il pleut',it:'piove',pt:'está chovendo'}, examples:[{t:'Il pleut. Prends ton parapluie.'}] },
          { id:'fr_a1_g2_14', word:'Il fait froid / chaud', emoji:'🌡️', translations:{es:'hace frío/calor',en:"it's cold/hot",fr:'il fait froid/chaud',it:'fa freddo/caldo',pt:'está frio/calor'}, examples:[{t:'Il fait vraiment froid! Tu as un manteau?'}] },
          { id:'fr_a1_g2_D01', type:'dialogue', context:"En se croisant dans la rue",
            dialogue:[
              {speaker:'Louis', line:"Salut! Quel temps fait-il aujourd'hui?"},
              {speaker:'Clara', line:"Il fait très froid et c'est nuageux."},
              {speaker:'Louis', line:"Oui, j'ai très froid. Et toi?"},
              {speaker:'Clara', line:"Moi aussi! J'ai besoin d'un café chaud."},
              {speaker:'Louis', line:"Bonne idée! On va au café?"}
            ], note:"Parler de la météo et exprimer ses sensations.",
            translations:{es:'Hablar del tiempo',en:'Talking about weather',fr:'Parler de la météo',it:'Parlare del tempo',pt:'Falar do tempo'} },
          { id:'fr_a1_g2_D02', type:'dialogue', context:"Avant de manger ensemble",
            dialogue:[
              {speaker:'Marie', line:"Tu as faim? Il est deux heures."},
              {speaker:'Paul',  line:"Oui, j'ai très faim. Qu'est-ce qu'il y a à manger?"},
              {speaker:'Marie', line:"Il y a des pâtes et une salade. Tu veux?"},
              {speaker:'Paul',  line:"Parfait! Et j'ai aussi très soif."},
              {speaker:'Marie', line:"Il y a de l'eau et du jus d'orange."},
              {speaker:'Paul',  line:"Super, merci."}
            ], note:"Exprimer la faim, la soif et les besoins.",
            translations:{es:'Hablar de comida',en:'Talking about food',fr:'Parler de nourriture',it:'Parlare di cibo',pt:'Falar de comida'} }
        ]
      },
      { id:'fr_a1_g3', name:'Questions et nombres', icon:'❓', color:'#10b981',
        description:'Mots interrogatifs + nombres de 1 à 8',
        reviewFrom:['fr_a1_g1','fr_a1_g2'],
        cards: [
          { id:'fr_a1_g3_01', word:"Qu'est-ce que c'est?", emoji:'🔍', translations:{es:'¿qué?',en:'what?',fr:"qu'est-ce que c'est?",it:'cosa?',pt:'o quê?'}, examples:[{t:"Qu'est-ce que tu veux boire?"}] },
          { id:'fr_a1_g3_02', word:'Qui?',      emoji:'🧑', translations:{es:'¿quién?',en:'who?',fr:'qui?',it:'chi?',pt:'quem?'}, examples:[{t:'Qui est cette personne?'}] },
          { id:'fr_a1_g3_03', word:'Où?',       emoji:'📍', translations:{es:'¿dónde?',en:'where?',fr:'où?',it:'dove?',pt:'onde?'}, examples:[{t:'Où sont les toilettes?'}] },
          { id:'fr_a1_g3_04', word:'Quand?',    emoji:'📅', translations:{es:'¿cuándo?',en:'when?',fr:'quand?',it:'quando?',pt:'quando?'}, examples:[{t:"Quand est-ce que tu arrives?"}] },
          { id:'fr_a1_g3_05', word:'Pourquoi?', emoji:'💭', translations:{es:'¿por qué?',en:'why?',fr:'pourquoi?',it:'perché?',pt:'por quê?'}, examples:[{t:"Pourquoi tu es fatigué?"}] },
          { id:'fr_a1_g3_06', word:'Comment?',  emoji:'🤔', translations:{es:'¿cómo?',en:'how?',fr:'comment?',it:'come?',pt:'como?'}, examples:[{t:"Comment dit-on 'hola' en français?"}] },
          { id:'fr_a1_g3_07', word:'Combien?',  emoji:'💰', translations:{es:'¿cuánto?',en:'how much?',fr:'combien?',it:'quanto?',pt:'quanto?'}, examples:[{t:"C'est combien, ce café?"}] },
          { id:'fr_a1_g3_08', word:'Combien de?',emoji:'🔢', translations:{es:'¿cuántos?',en:'how many?',fr:'combien de?',it:'quanti?',pt:'quantos?'}, examples:[{t:'Combien de personnes à table?'}] },
          { id:'fr_a1_g3_09', word:'un / une',  emoji:'1️⃣', translations:{es:'uno/una',en:'one',fr:'un/une',it:'uno/una',pt:'um/uma'}, examples:[{t:"Une table pour deux, s'il vous plaît."}] },
          { id:'fr_a1_g3_10', word:'deux',      emoji:'2️⃣', translations:{es:'dos',en:'two',fr:'deux',it:'due',pt:'dois'}, examples:[{t:'Nous sommes deux. Avez-vous une table?'}] },
          { id:'fr_a1_g3_11', word:'trois',     emoji:'3️⃣', translations:{es:'tres',en:'three',fr:'trois',it:'tre',pt:'três'}, examples:[{t:"Une table pour trois, s'il vous plaît."}] },
          { id:'fr_a1_g3_12', word:'quatre',    emoji:'4️⃣', translations:{es:'cuatro',en:'four',fr:'quatre',it:'quattro',pt:'quatro'}, examples:[{t:'Nous sommes quatre. Vous avez de la place?'}] },
          { id:'fr_a1_g3_13', word:'cinq',      emoji:'5️⃣', translations:{es:'cinco',en:'five',fr:'cinq',it:'cinque',pt:'cinco'}, examples:[{t:"Cinq cafés, s'il vous plaît."}] },
          { id:'fr_a1_g3_14', word:'six',       emoji:'6️⃣', translations:{es:'seis',en:'six',fr:'six',it:'sei',pt:'seis'}, examples:[{t:'La réunion est à six heures.'}] },
          { id:'fr_a1_g3_15', word:'sept',      emoji:'7️⃣', translations:{es:'siete',en:'seven',fr:'sept',it:'sette',pt:'sete'}, examples:[{t:'Il y a sept personnes dans la classe.'}] },
          { id:'fr_a1_g3_16', word:'huit',      emoji:'8️⃣', translations:{es:'ocho',en:'eight',fr:'huit',it:'otto',pt:'oito'}, examples:[{t:"Il est huit heures du matin."}] },
          { id:'fr_a1_g3_D01', type:'dialogue', context:"Au restaurant",
            dialogue:[
              {speaker:'Serveur',  line:"Bonsoir! Vous êtes combien?"},
              {speaker:'Client',   line:"Nous sommes trois. Avez-vous une table?"},
              {speaker:'Serveur',  line:"Oui, bien sûr. Vous avez une réservation?"},
              {speaker:'Client',   line:"Non, nous n'avons pas de réservation."},
              {speaker:'Serveur',  line:"Pas de problème. Par ici, s'il vous plaît."},
              {speaker:'Client',   line:"Merci. C'est long l'attente?"},
              {speaker:'Serveur',  line:"Juste cinq minutes. Vous voulez boire quelque chose?"},
              {speaker:'Client',   line:"Oui, deux eaux et un jus d'orange."}
            ], note:"Demander la quantité, commander au restaurant.",
            translations:{es:'En el restaurante',en:'At the restaurant',fr:'Au restaurant',it:'Al ristorante',pt:'No restaurante'} }
        ]
      },
      { id:'fr_a1_g4', name:'Verbes essentiels', icon:'⚡', color:'#ef4444',
        description:"Les verbes les plus utilisés — présent + passé",
        reviewFrom:['fr_a1_g1','fr_a1_g2','fr_a1_g3'],
        cards: [
          { id:'fr_a1_g4_01', word:'je suis / tu es / il est',  emoji:'🌟', translations:{es:'ser/estar: soy/eres/es',en:'to be',fr:'être: je suis/tu es/il est',it:'essere: sono/sei/è',pt:'ser: sou/és/é'}, examples:[{t:"Je suis étudiant. Tu es mon ami."}] },
          { id:'fr_a1_g4_02', word:"j'ai / tu as / il a",       emoji:'✋', translations:{es:'tener: tengo/tienes/tiene',en:'to have',fr:"avoir: j'ai/tu as/il a",it:'avere: ho/hai/ha',pt:'ter: tenho/tens/tem'}, examples:[{t:"J'ai une question. Tu as le temps?"}] },
          { id:'fr_a1_g4_03', word:'je veux / tu veux',         emoji:'❤️',  translations:{es:'querer: quiero/quieres',en:'to want',fr:'vouloir: je veux/tu veux',it:'volere: voglio/vuoi',pt:'querer: quero/queres'}, examples:[{t:"Je veux un café. Qu'est-ce que tu veux?"}] },
          { id:'fr_a1_g4_04', word:'je vais / tu vas / il va',  emoji:'🚶', translations:{es:'ir: voy/vas/va',en:'to go',fr:'aller: je vais/tu vas/il va',it:'andare: vado/vai/va',pt:'ir: vou/vais/vai'}, examples:[{t:"Je vais au travail. Tu vas à la salle de sport?"}] },
          { id:'fr_a1_g4_05', word:'je parle / tu parles',      emoji:'🗣️', translations:{es:'hablar: hablo/hablas',en:'to speak',fr:'parler: je parle/tu parles',it:'parlare: parlo/parli',pt:'falar: falo/falas'}, examples:[{t:"Je parle français. Tu parles anglais?"}] },
          { id:'fr_a1_g4_06', word:'je mange / tu manges',      emoji:'🍽️', translations:{es:'comer: como/comes',en:'to eat',fr:'manger: je mange/tu manges',it:'mangiare: mangio/mangi',pt:'comer: como/comes'}, examples:[{t:"Je mange des pâtes tous les jours."}] },
          { id:'fr_a1_g4_07', word:'je bois / tu bois',         emoji:'🥤', translations:{es:'beber: bebo/bebes',en:'to drink',fr:'boire: je bois/tu bois',it:'bere: bevo/bevi',pt:'beber: bebo/bebes'}, examples:[{t:"Je bois du café le matin."}] },
          { id:'fr_a1_g4_08', word:"j'habite / tu habites",     emoji:'🏠', translations:{es:'vivir: vivo/vives',en:'to live',fr:"habiter: j'habite/tu habites",it:'vivere: vivo/vivi',pt:'viver: vivo/vives'}, examples:[{t:"J'habite à Paris. Tu habites où?"}] },
          { id:'fr_a1_g4_09', word:'je peux / tu peux',         emoji:'💪', translations:{es:'poder: puedo/puedes',en:'can',fr:'pouvoir: je peux/tu peux',it:'potere: posso/puoi',pt:'poder: posso/podes'}, examples:[{t:"Tu peux parler plus lentement, s'il te plaît?"}] },
          { id:'fr_a1_g4_10', word:"j'aime / je n'aime pas",   emoji:'👍', translations:{es:'me gusta/no me gusta',en:"I like/I don't like",fr:"j'aime/je n'aime pas",it:'mi piace/non mi piace',pt:'gosto/não gosto'}, examples:[{t:"J'aime le café. Je n'aime pas le thé."}] },
          { id:'fr_a1_g4_11', word:'je suis allé(e)',           emoji:'⏪', translations:{es:'fui',en:'I went',fr:'je suis allé(e)',it:'sono andato/a',pt:'fui'}, examples:[{t:"Je suis allé chez le médecin hier."}] },
          { id:'fr_a1_g4_12', word:"j'ai travaillé / parlé",    emoji:'🔵', translations:{es:'trabajé/hablé (regular)',en:'I worked/talked (regular)',fr:"j'ai travaillé/parlé (régulier)",it:'ho lavorato/parlato',pt:'trabalhei/falei'}, examples:[{t:"J'ai travaillé toute la journée."}] },
          { id:'fr_a1_g4_13', word:"j'ai eu / vu / fait",       emoji:'🔴', translations:{es:'tuve/vi/hice (irregulares)',en:'I had/saw/did (irregular)',fr:"j'ai eu/vu/fait (irrégulier)",it:'ho avuto/visto/fatto',pt:'tive/vi/fiz'}, examples:[{t:"J'ai eu un problème hier. Il a vu un film."}] },
          { id:'fr_a1_g4_D01', type:'dialogue', context:"Raconter sa journée d'hier",
            dialogue:[
              {speaker:'Valérie', line:"Qu'est-ce que tu as fait hier?"},
              {speaker:'Thomas',  line:"Je suis allé au sport le matin, puis j'ai déjeuné avec ma famille."},
              {speaker:'Valérie', line:"Super! Vous avez mangé où?"},
              {speaker:'Thomas',  line:"Nous sommes allés dans un restaurant italien. Et toi?"},
              {speaker:'Valérie', line:"Moi, je suis restée chez moi. J'ai eu beaucoup de travail."},
              {speaker:'Thomas',  line:"Tu as pu te reposer un peu?"},
              {speaker:'Valérie', line:"Oui, un peu. J'aime travailler de chez moi."}
            ], note:"Verbes au passé composé: suis allé, ai mangé, ai eu, ai pu.",
            translations:{es:'Hablar del pasado',en:'Talking about the past',fr:'Parler du passé',it:'Parlare del passato',pt:'Falar do passado'} }
        ]
      }
    ]
  },

  // ── ITALIANO ─────────────────────────────────────────────
  it: {
    level: 'A1', levelName: 'Mi so presentare',
    groups: [
      { id:'it_a1_g1', name:'Saluti e presentazioni', icon:'👋', color:'#6366f1',
        description:'Come salutare, presentarsi e congedarsi',
        cards: [
          { id:'it_a1_g1_01', word:'Ciao / Buongiorno',   emoji:'👋', translations:{es:'hola / buenos días',en:'hi / good morning',fr:'salut / bonjour',it:'ciao / buongiorno',pt:'oi / bom dia'}, examples:[{t:'Ciao! Come stai?'}] },
          { id:'it_a1_g1_02', word:'Arrivederci',          emoji:'🙋', translations:{es:'adiós',en:'goodbye',fr:'au revoir',it:'arrivederci',pt:'adeus'}, examples:[{t:'Arrivederci! A domani.'}] },
          { id:'it_a1_g1_03', word:'Buonasera',            emoji:'🌆', translations:{es:'buenas noches',en:'good evening',fr:'bonsoir',it:'buonasera',pt:'boa tarde / boa noite'}, examples:[{t:"Buonasera! Come è andata la giornata?"}] },
          { id:'it_a1_g1_04', word:'Come ti chiami?',      emoji:'🏷️', translations:{es:'¿cómo te llamas?',en:"what's your name?",fr:"comment tu t'appelles?",it:'come ti chiami?',pt:'como você se chama?'}, examples:[{t:'Come ti chiami? — Mi chiamo Luca.'}] },
          { id:'it_a1_g1_05', word:'Mi chiamo',            emoji:'😊', translations:{es:'me llamo',en:'my name is',fr:"je m'appelle",it:'mi chiamo',pt:'me chamo'}, examples:[{t:'Mi chiamo Giulia. Piacere!'}] },
          { id:'it_a1_g1_06', word:'Come stai?',           emoji:'🤔', translations:{es:'¿cómo estás?',en:'how are you?',fr:'comment ça va?',it:'come stai?',pt:'como vai?'}, examples:[{t:'Come stai? — Molto bene, grazie!'}] },
          { id:'it_a1_g1_07', word:'Molto bene / Bene',    emoji:'😄', translations:{es:'muy bien / bien',en:'very well / fine',fr:'très bien / bien',it:'molto bene / bene',pt:'muito bem / bem'}, examples:[{t:'Come stai? — Bene, e tu?'}] },
          { id:'it_a1_g1_08', word:'Così così',            emoji:'🤷', translations:{es:'más o menos',en:'so-so',fr:'comme ci comme ça',it:'così così',pt:'mais ou menos'}, examples:[{t:'Come stai? — Così così.'}] },
          { id:'it_a1_g1_09', word:'Piacere',              emoji:'🤝', translations:{es:'mucho gusto',en:'nice to meet you',fr:'enchanté',it:'piacere',pt:'prazer'}, examples:[{t:'Ti presento Sofia. — Piacere, Sofia!'}] },
          { id:'it_a1_g1_10', word:'Benvenuto/a',          emoji:'🎉', translations:{es:'bienvenido',en:'welcome',fr:'bienvenue',it:'benvenuto/a',pt:'bem-vindo'}, examples:[{t:'Benvenuto nella nostra città!'}] },
          { id:'it_a1_g1_11', word:'Di dove sei?',         emoji:'🌍', translations:{es:'¿de dónde eres?',en:'where are you from?',fr:"tu viens d'où?",it:'di dove sei?',pt:'de onde você é?'}, examples:[{t:'Di dove sei? — Sono di Roma.'}] },
          { id:'it_a1_g1_12', word:'Sono di',              emoji:'📍', translations:{es:'soy de',en:"I'm from",fr:'je viens de',it:'sono di',pt:'sou de'}, examples:[{t:'Sono di Milano. E tu?'}] },
          { id:'it_a1_g1_13', word:'Scusa / Mi scusi',     emoji:'🙏', translations:{es:'perdón',en:'sorry / excuse me',fr:'pardon / excusez-moi',it:'scusa / mi scusi',pt:'desculpe'}, examples:[{t:'Scusa, puoi ripetere più lentamente?'}] },
          { id:'it_a1_g1_14', word:'Non capisco',          emoji:'❓', translations:{es:'no entiendo',en:"I don't understand",fr:'je ne comprends pas',it:'non capisco',pt:'não entendo'}, examples:[{t:'Scusa, non capisco. Puoi parlare più piano?'}] },
          { id:'it_a1_g1_15', word:'Per favore / Grazie',  emoji:'🙏', translations:{es:'por favor / gracias',en:'please / thank you',fr:"s'il te plaît / merci",it:'per favore / grazie',pt:'por favor / obrigado'}, examples:[{t:'Un caffè, per favore. — Ecco. — Grazie!'}] },
          { id:'it_a1_g1_D01', type:'dialogue', context:"Due persone si incontrano a una festa",
            dialogue:[
              {speaker:'Sofia',  line:"Ciao! Sei Marco, vero?"},
              {speaker:'Marco',  line:"Sì! E tu, come ti chiami?"},
              {speaker:'Sofia',  line:"Mi chiamo Sofia. Piacere!"},
              {speaker:'Marco',  line:"Piacere, Sofia. Di dove sei?"},
              {speaker:'Sofia',  line:"Sono di Napoli. E tu?"},
              {speaker:'Marco',  line:"Io sono di Torino. Benvenuta!"}
            ], note:"Presentarsi e chiedere l'origine.",
            translations:{es:'Presentarse',en:'Introducing yourself',fr:'Se présenter',it:'Presentarsi',pt:'Apresentar-se'} },
          { id:'it_a1_g1_D02', type:'dialogue', context:"Fine di una conversazione",
            dialogue:[
              {speaker:'Anna',   line:"Bene, devo andare. È stato un piacere!"},
              {speaker:'Pietro', line:"Anche per me. A presto, Anna!"},
              {speaker:'Anna',   line:"Arrivederci! Buona giornata!"},
              {speaker:'Pietro', line:"Anche a te!"}
            ], note:"Congedarsi in modo cordiale.",
            translations:{es:'Despedirse',en:'Saying goodbye',fr:'Dire au revoir',it:'Salutarsi',pt:'Despedir-se'} }
        ]
      },
      { id:'it_a1_g2', name:'Quantità e stati', icon:'😋', color:'#f59e0b',
        description:'Esprimere bisogni, sensazioni e il meteo',
        reviewFrom:['it_a1_g1'],
        cards: [
          { id:'it_a1_g2_01', word:'Ho fame',         emoji:'🍽️', translations:{es:'tengo hambre',en:"I'm hungry",fr:"j'ai faim",it:'ho fame',pt:'estou com fome'}, examples:[{t:'Ho molta fame. Mangiamo?'}] },
          { id:'it_a1_g2_02', word:'Ho sete',          emoji:'💧', translations:{es:'tengo sed',en:"I'm thirsty",fr:"j'ai soif",it:'ho sete',pt:'estou com sede'}, examples:[{t:"Ho sete. C'è dell'acqua?"}] },
          { id:'it_a1_g2_03', word:'Ho freddo',        emoji:'🥶', translations:{es:'tengo frío',en:"I'm cold",fr:"j'ai froid",it:'ho freddo',pt:'estou com frio'}, examples:[{t:'Ho freddo. Posso chiudere la finestra?'}] },
          { id:'it_a1_g2_04', word:'Ho caldo',         emoji:'🌡️', translations:{es:'tengo calor',en:"I'm hot",fr:"j'ai chaud",it:'ho caldo',pt:'estou com calor'}, examples:[{t:'Fa caldo. Apro la finestra.'}] },
          { id:'it_a1_g2_05', word:'Sono stanco/a',    emoji:'😴', translations:{es:'estoy cansado',en:"I'm tired",fr:'je suis fatigué',it:'sono stanco/a',pt:'estou cansado'}, examples:[{t:'Sono molto stanco. Voglio dormire.'}] },
          { id:'it_a1_g2_06', word:'Molto',            emoji:'📊', translations:{es:'mucho / muy',en:'a lot / very',fr:'beaucoup / très',it:'molto',pt:'muito'}, examples:[{t:'Ho molto lavoro oggi.'}] },
          { id:'it_a1_g2_07', word:"Un po'",           emoji:'🤏', translations:{es:'un poco',en:'a little',fr:'un peu',it:"un po'",pt:'um pouco'}, examples:[{t:"Ho un po' di tempo. Facciamo in fretta."}] },
          { id:'it_a1_g2_08', word:'Abbastanza',       emoji:'👌', translations:{es:'bastante',en:'quite / enough',fr:'assez',it:'abbastanza',pt:'bastante'}, examples:[{t:'Sto abbastanza bene, grazie.'}] },
          { id:'it_a1_g2_09', word:'Troppo',           emoji:'🙈', translations:{es:'demasiado',en:'too much',fr:'trop',it:'troppo',pt:'demais'}, examples:[{t:'Fa troppo caldo per uscire.'}] },
          { id:'it_a1_g2_10', word:'Ho bisogno di',    emoji:'🙋', translations:{es:'necesito',en:'I need',fr:"j'ai besoin de",it:'ho bisogno di',pt:'preciso de'}, examples:[{t:'Ho bisogno di acqua, per favore.'}] },
          { id:'it_a1_g2_11', word:'Soleggiato',       emoji:'☀️', translations:{es:'soleado',en:'sunny',fr:'ensoleillé',it:'soleggiato',pt:'ensolarado'}, examples:[{t:"È soleggiato oggi. Perfetto per uscire!"}] },
          { id:'it_a1_g2_12', word:'Nuvoloso',         emoji:'☁️', translations:{es:'nublado',en:'cloudy',fr:'nuageux',it:'nuvoloso',pt:'nublado'}, examples:[{t:'È molto nuvoloso. Credo che pioverà.'}] },
          { id:'it_a1_g2_13', word:'Piove',            emoji:'🌧️', translations:{es:'está lloviendo',en:"it's raining",fr:'il pleut',it:'piove',pt:'está chovendo'}, examples:[{t:"Piove. Prendi l'ombrello."}] },
          { id:'it_a1_g2_14', word:'Fa freddo / caldo',emoji:'🌡️', translations:{es:'hace frío/calor',en:"it's cold/hot",fr:'il fait froid/chaud',it:'fa freddo/caldo',pt:'está frio/calor'}, examples:[{t:'Che freddo! Hai un cappotto?'}] },
          { id:'it_a1_g2_D01', type:'dialogue', context:"Incontrandosi per strada",
            dialogue:[
              {speaker:'Luigi', line:"Ciao! Che tempo fa oggi?"},
              {speaker:'Clara', line:"Fa molto freddo ed è nuvoloso."},
              {speaker:'Luigi', line:"Sì, ho molto freddo. E tu?"},
              {speaker:'Clara', line:"Anch'io! Ho bisogno di un caffè caldo."},
              {speaker:'Luigi', line:"Buona idea! Andiamo al bar?"}
            ], note:"Parlare del tempo e delle sensazioni.",
            translations:{es:'Hablar del tiempo',en:'Talking about weather',fr:'Parler de la météo',it:'Parlare del tempo',pt:'Falar do tempo'} },
          { id:'it_a1_g2_D02', type:'dialogue', context:"Prima di mangiare insieme",
            dialogue:[
              {speaker:'Marta', line:"Hai fame? Sono le due."},
              {speaker:'Paolo', line:"Sì, ho molta fame. Cosa c'è da mangiare?"},
              {speaker:'Marta', line:"C'è pasta e insalata. Ne vuoi?"},
              {speaker:'Paolo', line:"Perfetto! E ho anche molta sete."},
              {speaker:'Marta', line:"C'è acqua e succo d'arancia."},
              {speaker:'Paolo', line:"Benissimo, grazie."}
            ], note:"Esprimere fame, sete e bisogni.",
            translations:{es:'Hablar de comida',en:'Talking about food',fr:'Parler de nourriture',it:'Parlare di cibo',pt:'Falar de comida'} }
        ]
      },
      { id:'it_a1_g3', name:'Domande e numeri', icon:'❓', color:'#10b981',
        description:'Parole interrogative + numeri da 1 a 8',
        reviewFrom:['it_a1_g1','it_a1_g2'],
        cards: [
          { id:'it_a1_g3_01', word:'Cosa? / Che cosa?', emoji:'🔍', translations:{es:'¿qué?',en:'what?',fr:'quoi?',it:'cosa?',pt:'o quê?'}, examples:[{t:'Cosa vuoi bere?'}] },
          { id:'it_a1_g3_02', word:'Chi?',    emoji:'🧑', translations:{es:'¿quién?',en:'who?',fr:'qui?',it:'chi?',pt:'quem?'}, examples:[{t:'Chi è quella persona?'}] },
          { id:'it_a1_g3_03', word:'Dove?',   emoji:'📍', translations:{es:'¿dónde?',en:'where?',fr:'où?',it:'dove?',pt:'onde?'}, examples:[{t:'Dove sono i bagni?'}] },
          { id:'it_a1_g3_04', word:'Quando?', emoji:'📅', translations:{es:'¿cuándo?',en:'when?',fr:'quand?',it:'quando?',pt:'quando?'}, examples:[{t:'Quando arrivi?'}] },
          { id:'it_a1_g3_05', word:'Perché?', emoji:'💭', translations:{es:'¿por qué?',en:'why?',fr:'pourquoi?',it:'perché?',pt:'por quê?'}, examples:[{t:'Perché sei stanco?'}] },
          { id:'it_a1_g3_06', word:'Come?',   emoji:'🤔', translations:{es:'¿cómo?',en:'how?',fr:'comment?',it:'come?',pt:'como?'}, examples:[{t:"Come si dice 'hola' in italiano?"}] },
          { id:'it_a1_g3_07', word:'Quanto?', emoji:'💰', translations:{es:'¿cuánto?',en:'how much?',fr:'combien?',it:'quanto?',pt:'quanto?'}, examples:[{t:'Quanto costa questo caffè?'}] },
          { id:'it_a1_g3_08', word:'Quanti?', emoji:'🔢', translations:{es:'¿cuántos?',en:'how many?',fr:'combien de?',it:'quanti?',pt:'quantos?'}, examples:[{t:'Quanti siete al tavolo?'}] },
          { id:'it_a1_g3_09', word:'uno/una', emoji:'1️⃣', translations:{es:'uno/una',en:'one',fr:'un/une',it:'uno/una',pt:'um/uma'}, examples:[{t:'Un tavolo per due, per favore.'}] },
          { id:'it_a1_g3_10', word:'due',     emoji:'2️⃣', translations:{es:'dos',en:'two',fr:'deux',it:'due',pt:'dois'}, examples:[{t:"Siamo in due. C'è un tavolo?"}] },
          { id:'it_a1_g3_11', word:'tre',     emoji:'3️⃣', translations:{es:'tres',en:'three',fr:'trois',it:'tre',pt:'três'}, examples:[{t:'Un tavolo per tre, per favore.'}] },
          { id:'it_a1_g3_12', word:'quattro', emoji:'4️⃣', translations:{es:'cuatro',en:'four',fr:'quatre',it:'quattro',pt:'quatro'}, examples:[{t:'Siamo in quattro. Avete posto?'}] },
          { id:'it_a1_g3_13', word:'cinque',  emoji:'5️⃣', translations:{es:'cinco',en:'five',fr:'cinq',it:'cinque',pt:'cinco'}, examples:[{t:'Cinque caffè, per favore.'}] },
          { id:'it_a1_g3_14', word:'sei',     emoji:'6️⃣', translations:{es:'seis',en:'six',fr:'six',it:'sei',pt:'seis'}, examples:[{t:'La riunione è alle sei.'}] },
          { id:'it_a1_g3_15', word:'sette',   emoji:'7️⃣', translations:{es:'siete',en:'seven',fr:'sept',it:'sette',pt:'sete'}, examples:[{t:'Ci sono sette persone in classe.'}] },
          { id:'it_a1_g3_16', word:'otto',    emoji:'8️⃣', translations:{es:'ocho',en:'eight',fr:'huit',it:'otto',pt:'oito'}, examples:[{t:'Sono le otto di mattina.'}] },
          { id:'it_a1_g3_D01', type:'dialogue', context:"Al ristorante",
            dialogue:[
              {speaker:'Cameriere', line:"Buonasera! Quanti siete?"},
              {speaker:'Cliente',   line:"Siamo in tre. Avete un tavolo?"},
              {speaker:'Cameriere', line:"Sì, certo. Avete una prenotazione?"},
              {speaker:'Cliente',   line:"No, non abbiamo prenotato."},
              {speaker:'Cameriere', line:"Nessun problema. Da questa parte, prego."},
              {speaker:'Cliente',   line:"Grazie. Quanto si aspetta?"},
              {speaker:'Cameriere', line:"Solo cinque minuti. Volete bere qualcosa?"},
              {speaker:'Cliente',   line:"Sì, due acque e un succo d'arancia."}
            ], note:"Chiedere la quantità, ordinare al ristorante.",
            translations:{es:'En el restaurante',en:'At the restaurant',fr:'Au restaurant',it:'Al ristorante',pt:'No restaurante'} }
        ]
      },
      { id:'it_a1_g4', name:'Verbi essenziali', icon:'⚡', color:'#ef4444',
        description:"I verbi più usati — presente + passato",
        reviewFrom:['it_a1_g1','it_a1_g2','it_a1_g3'],
        cards: [
          { id:'it_a1_g4_01', word:'sono / sei / è',          emoji:'🌟', translations:{es:'ser/estar: soy/eres/es',en:'to be',fr:'être: je suis/tu es/il est',it:'essere: sono/sei/è',pt:'ser: sou/és/é'}, examples:[{t:'Sono studente. Tu sei il mio amico.'}] },
          { id:'it_a1_g4_02', word:'ho / hai / ha',            emoji:'✋', translations:{es:'tener: tengo/tienes/tiene',en:'to have',fr:"avoir: j'ai/tu as/il a",it:'avere: ho/hai/ha',pt:'ter: tenho/tens/tem'}, examples:[{t:'Ho una domanda. Hai tempo?'}] },
          { id:'it_a1_g4_03', word:'voglio / vuoi',            emoji:'❤️',  translations:{es:'querer: quiero/quieres',en:'to want',fr:'vouloir: je veux/tu veux',it:'volere: voglio/vuoi',pt:'querer: quero/queres'}, examples:[{t:'Voglio un caffè. Cosa vuoi tu?'}] },
          { id:'it_a1_g4_04', word:'vado / vai / va',          emoji:'🚶', translations:{es:'ir: voy/vas/va',en:'to go',fr:'aller: je vais/tu vas/il va',it:'andare: vado/vai/va',pt:'ir: vou/vais/vai'}, examples:[{t:'Vado al lavoro. Tu vai in palestra?'}] },
          { id:'it_a1_g4_05', word:'parlo / parli / parla',    emoji:'🗣️', translations:{es:'hablar: hablo/hablas/habla',en:'to speak',fr:'parler: je parle/tu parles/il parle',it:'parlare: parlo/parli/parla',pt:'falar: falo/falas/fala'}, examples:[{t:"Parlo italiano. Parli inglese?"}] },
          { id:'it_a1_g4_06', word:'mangio / mangi',           emoji:'🍽️', translations:{es:'comer: como/comes',en:'to eat',fr:'manger: je mange/tu manges',it:'mangiare: mangio/mangi',pt:'comer: como/comes'}, examples:[{t:'Mangio pasta ogni giorno.'}] },
          { id:'it_a1_g4_07', word:'bevo / bevi',              emoji:'🥤', translations:{es:'beber: bebo/bebes',en:'to drink',fr:'boire: je bois/tu bois',it:'bere: bevo/bevi',pt:'beber: bebo/bebes'}, examples:[{t:'Bevo caffè la mattina.'}] },
          { id:'it_a1_g4_08', word:'vivo / vivi',              emoji:'🏠', translations:{es:'vivir: vivo/vives',en:'to live',fr:"habiter: j'habite/tu habites",it:'vivere: vivo/vivi',pt:'viver: vivo/vives'}, examples:[{t:'Vivo a Roma. Dove vivi tu?'}] },
          { id:'it_a1_g4_09', word:'posso / puoi',             emoji:'💪', translations:{es:'poder: puedo/puedes',en:'can',fr:'pouvoir: je peux/tu peux',it:'potere: posso/puoi',pt:'poder: posso/podes'}, examples:[{t:'Puoi parlare più lentamente, per favore?'}] },
          { id:'it_a1_g4_10', word:'mi piace / non mi piace',  emoji:'👍', translations:{es:'me gusta/no me gusta',en:"I like/I don't like",fr:"j'aime/je n'aime pas",it:'mi piace/non mi piace',pt:'gosto/não gosto'}, examples:[{t:"Mi piace il caffè. Non mi piace il tè."}] },
          { id:'it_a1_g4_11', word:'sono andato/a',            emoji:'⏪', translations:{es:'fui',en:'I went',fr:'je suis allé(e)',it:'sono andato/a',pt:'fui'}, examples:[{t:'Sono andato dal medico ieri.'}] },
          { id:'it_a1_g4_12', word:'ho lavorato / parlato',    emoji:'🔵', translations:{es:'trabajé/hablé (regular)',en:'I worked/talked (regular)',fr:"j'ai travaillé/parlé",it:'ho lavorato/parlato (regolare)',pt:'trabalhei/falei'}, examples:[{t:'Ho lavorato tutto il giorno.'}] },
          { id:'it_a1_g4_13', word:'ho avuto / visto / fatto', emoji:'🔴', translations:{es:'tuve/vi/hice (irregulares)',en:'I had/saw/did (irregular)',fr:"j'ai eu/vu/fait",it:'ho avuto/visto/fatto (irregolare)',pt:'tive/vi/fiz'}, examples:[{t:"Ho avuto un problema ieri. Ha visto un film."}] },
          { id:'it_a1_g4_D01', type:'dialogue', context:"Raccontare cosa hai fatto ieri",
            dialogue:[
              {speaker:'Valeria', line:"Cosa hai fatto ieri?"},
              {speaker:'Tommaso', line:"Sono andato in palestra la mattina e poi ho pranzato con la mia famiglia."},
              {speaker:'Valeria', line:"Che bello! Dove avete mangiato?"},
              {speaker:'Tommaso', line:"Siamo andati in un ristorante francese. E tu?"},
              {speaker:'Valeria', line:"Io sono rimasta a casa. Ho avuto molto lavoro."},
              {speaker:'Tommaso', line:"Hai potuto riposare un po'?"},
              {speaker:'Valeria', line:"Sì, un po'. Mi piace lavorare da casa."}
            ], note:"Verbi al passato prossimo: sono andato, ho mangiato, ho avuto.",
            translations:{es:'Hablar del pasado',en:'Talking about the past',fr:'Parler du passé',it:'Parlare del passato',pt:'Falar do passado'} }
        ]
      }
    ]
  },

  // ── PORTUGUÊS ────────────────────────────────────────────
  pt: {
    level: 'A1', levelName: 'Posso me apresentar',
    groups: [
      { id:'pt_a1_g1', name:'Cumprimentos', icon:'👋', color:'#6366f1',
        description:'Como cumprimentar, apresentar-se e despedir-se',
        cards: [
          { id:'pt_a1_g1_01', word:'Olá / Oi',              emoji:'👋', translations:{es:'hola',en:'hello / hi',fr:'bonjour / salut',it:'ciao',pt:'olá / oi'}, examples:[{t:'Olá! Como vai você?'}] },
          { id:'pt_a1_g1_02', word:'Tchau / Adeus',          emoji:'🙋', translations:{es:'adiós',en:'goodbye',fr:'au revoir',it:'arrivederci',pt:'tchau / adeus'}, examples:[{t:'Tchau! Até amanhã.'}] },
          { id:'pt_a1_g1_03', word:'Bom dia / Boa tarde',    emoji:'🌅', translations:{es:'buenos días / buenas tardes',en:'good morning / good afternoon',fr:'bonjour / bon après-midi',it:'buongiorno / buon pomeriggio',pt:'bom dia / boa tarde'}, examples:[{t:'Bom dia! Como você está hoje?'}] },
          { id:'pt_a1_g1_04', word:'Como você se chama?',    emoji:'🏷️', translations:{es:'¿cómo te llamas?',en:"what's your name?",fr:"comment tu t'appelles?",it:'come ti chiami?',pt:'como você se chama?'}, examples:[{t:'Como você se chama? — Me chamo João.'}] },
          { id:'pt_a1_g1_05', word:'Me chamo / Meu nome é',  emoji:'😊', translations:{es:'me llamo',en:'my name is',fr:"je m'appelle",it:'mi chiamo',pt:'me chamo / meu nome é'}, examples:[{t:'Me chamo Ana. Prazer!'}] },
          { id:'pt_a1_g1_06', word:'Como vai você?',         emoji:'🤔', translations:{es:'¿cómo estás?',en:'how are you?',fr:'comment ça va?',it:'come stai?',pt:'como vai você?'}, examples:[{t:'Como vai? — Muito bem, obrigado!'}] },
          { id:'pt_a1_g1_07', word:'Muito bem / Tudo bem',   emoji:'😄', translations:{es:'muy bien / todo bien',en:'very well / all good',fr:'très bien / tout va bien',it:'molto bene / tutto bene',pt:'muito bem / tudo bem'}, examples:[{t:'Como vai? — Tudo bem, e você?'}] },
          { id:'pt_a1_g1_08', word:'Mais ou menos',          emoji:'🤷', translations:{es:'más o menos',en:'so-so',fr:'comme ci comme ça',it:'così così',pt:'mais ou menos'}, examples:[{t:'Como vai? — Mais ou menos.'}] },
          { id:'pt_a1_g1_09', word:'Prazer',                 emoji:'🤝', translations:{es:'mucho gusto',en:'nice to meet you',fr:'enchanté',it:'piacere',pt:'prazer'}, examples:[{t:'Esta é a Sofia. — Prazer, Sofia!'}] },
          { id:'pt_a1_g1_10', word:'Bem-vindo/a',            emoji:'🎉', translations:{es:'bienvenido',en:'welcome',fr:'bienvenue',it:'benvenuto',pt:'bem-vindo/a'}, examples:[{t:'Bem-vindo à nossa cidade!'}] },
          { id:'pt_a1_g1_11', word:'De onde você é?',        emoji:'🌍', translations:{es:'¿de dónde eres?',en:'where are you from?',fr:"tu viens d'où?",it:'di dove sei?',pt:'de onde você é?'}, examples:[{t:'De onde você é? — Sou do Brasil.'}] },
          { id:'pt_a1_g1_12', word:'Sou de',                 emoji:'📍', translations:{es:'soy de',en:"I'm from",fr:'je viens de',it:'sono di',pt:'sou de'}, examples:[{t:'Sou de São Paulo. E você?'}] },
          { id:'pt_a1_g1_13', word:'Desculpe / Com licença', emoji:'🙏', translations:{es:'perdón',en:'sorry / excuse me',fr:'pardon / excusez-moi',it:'scusa / mi scusi',pt:'desculpe / com licença'}, examples:[{t:'Desculpe, pode repetir mais devagar?'}] },
          { id:'pt_a1_g1_14', word:'Não entendo',            emoji:'❓', translations:{es:'no entiendo',en:"I don't understand",fr:'je ne comprends pas',it:'non capisco',pt:'não entendo'}, examples:[{t:'Desculpe, não entendo. Pode falar mais devagar?'}] },
          { id:'pt_a1_g1_15', word:'Por favor / Obrigado',   emoji:'🙏', translations:{es:'por favor / gracias',en:'please / thank you',fr:"s'il vous plaît / merci",it:'per favore / grazie',pt:'por favor / obrigado'}, examples:[{t:'Um café, por favor. — Aqui. — Obrigado!'}] },
          { id:'pt_a1_g1_D01', type:'dialogue', context:"Duas pessoas se conhecem em uma festa",
            dialogue:[
              {speaker:'Sofia',  line:"Oi! Você é o Julião, certo?"},
              {speaker:'Julião', line:"Sim! E você, como se chama?"},
              {speaker:'Sofia',  line:"Me chamo Sofia. Prazer!"},
              {speaker:'Julião', line:"Prazer, Sofia. De onde você é?"},
              {speaker:'Sofia',  line:"Sou de Buenos Aires. E você?"},
              {speaker:'Julião', line:"Eu sou de Lisboa. Bem-vinda!"}
            ], note:"Apresentar-se e perguntar a origem.",
            translations:{es:'Presentarse',en:'Introducing yourself',fr:'Se présenter',it:'Presentarsi',pt:'Apresentar-se'} },
          { id:'pt_a1_g1_D02', type:'dialogue', context:"Fim de uma conversa",
            dialogue:[
              {speaker:'Ana',   line:"Bom, preciso ir. Foi um prazer!"},
              {speaker:'Pedro', line:"Igualmente. Até breve, Ana!"},
              {speaker:'Ana',   line:"Tchau! Tenha um bom dia!"},
              {speaker:'Pedro', line:"Você também!"}
            ], note:"Despedir-se de forma amistosa.",
            translations:{es:'Despedirse',en:'Saying goodbye',fr:'Dire au revoir',it:'Salutarsi',pt:'Despedir-se'} }
        ]
      },
      { id:'pt_a1_g2', name:'Quantidades e estados', icon:'😋', color:'#f59e0b',
        description:'Expressar necessidades, sensações e o tempo',
        reviewFrom:['pt_a1_g1'],
        cards: [
          { id:'pt_a1_g2_01', word:'Estou com fome',     emoji:'🍽️', translations:{es:'tengo hambre',en:"I'm hungry",fr:"j'ai faim",it:'ho fame',pt:'estou com fome'}, examples:[{t:'Estou com muita fome. Vamos comer?'}] },
          { id:'pt_a1_g2_02', word:'Estou com sede',      emoji:'💧', translations:{es:'tengo sed',en:"I'm thirsty",fr:"j'ai soif",it:'ho sete',pt:'estou com sede'}, examples:[{t:'Estou com sede. Tem água?'}] },
          { id:'pt_a1_g2_03', word:'Estou com frio',      emoji:'🥶', translations:{es:'tengo frío',en:"I'm cold",fr:"j'ai froid",it:'ho freddo',pt:'estou com frio'}, examples:[{t:'Estou com frio. Posso fechar a janela?'}] },
          { id:'pt_a1_g2_04', word:'Estou com calor',     emoji:'🌡️', translations:{es:'tengo calor',en:"I'm hot",fr:"j'ai chaud",it:'ho caldo',pt:'estou com calor'}, examples:[{t:'Está quente. Vou abrir a janela.'}] },
          { id:'pt_a1_g2_05', word:'Estou cansado/a',     emoji:'😴', translations:{es:'estoy cansado',en:"I'm tired",fr:'je suis fatigué',it:'sono stanco',pt:'estou cansado/a'}, examples:[{t:'Estou muito cansado. Quero dormir.'}] },
          { id:'pt_a1_g2_06', word:'Muito',               emoji:'📊', translations:{es:'mucho / muy',en:'a lot / very',fr:'beaucoup / très',it:'molto',pt:'muito'}, examples:[{t:'Tenho muito trabalho hoje.'}] },
          { id:'pt_a1_g2_07', word:'Um pouco',            emoji:'🤏', translations:{es:'un poco',en:'a little',fr:'un peu',it:"un po'",pt:'um pouco'}, examples:[{t:'Tenho um pouco de tempo. Vamos rápido.'}] },
          { id:'pt_a1_g2_08', word:'Bastante',            emoji:'👌', translations:{es:'bastante',en:'quite / enough',fr:'assez',it:'abbastanza',pt:'bastante'}, examples:[{t:'Estou bastante bem, obrigado.'}] },
          { id:'pt_a1_g2_09', word:'Demais',              emoji:'🙈', translations:{es:'demasiado',en:'too much',fr:'trop',it:'troppo',pt:'demais'}, examples:[{t:'Está quente demais para sair.'}] },
          { id:'pt_a1_g2_10', word:'Preciso de',          emoji:'🙋', translations:{es:'necesito',en:'I need',fr:"j'ai besoin de",it:'ho bisogno di',pt:'preciso de'}, examples:[{t:'Preciso de água, por favor.'}] },
          { id:'pt_a1_g2_11', word:'Ensolarado',          emoji:'☀️', translations:{es:'soleado',en:'sunny',fr:'ensoleillé',it:'soleggiato',pt:'ensolarado'}, examples:[{t:'Está ensolarado hoje. Perfeito!'}] },
          { id:'pt_a1_g2_12', word:'Nublado',             emoji:'☁️', translations:{es:'nublado',en:'cloudy',fr:'nuageux',it:'nuvoloso',pt:'nublado'}, examples:[{t:'Está muito nublado. Acho que vai chover.'}] },
          { id:'pt_a1_g2_13', word:'Está chovendo',       emoji:'🌧️', translations:{es:'está lloviendo',en:"it's raining",fr:'il pleut',it:'piove',pt:'está chovendo'}, examples:[{t:'Está chovendo. Leve o guarda-chuva.'}] },
          { id:'pt_a1_g2_14', word:'Está frio / calor',   emoji:'🌡️', translations:{es:'hace frío/calor',en:"it's cold/hot",fr:'il fait froid/chaud',it:'fa freddo/caldo',pt:'está frio/calor'}, examples:[{t:'Que frio! Você tem um casaco?'}] },
          { id:'pt_a1_g2_D01', type:'dialogue', context:"Encontrando-se na rua",
            dialogue:[
              {speaker:'Luis',  line:"Oi! Que tempo está fazendo hoje?"},
              {speaker:'Clara', line:"Está muito frio e nublado."},
              {speaker:'Luis',  line:"Sim, estou com muito frio. E você?"},
              {speaker:'Clara', line:"Eu também! Preciso de um café quente."},
              {speaker:'Luis',  line:"Boa ideia! Vamos ao café?"}
            ], note:"Falar sobre o tempo e expressar sensações.",
            translations:{es:'Hablar del tiempo',en:'Talking about weather',fr:'Parler de la météo',it:'Parlare del tempo',pt:'Falar do tempo'} },
          { id:'pt_a1_g2_D02', type:'dialogue', context:"Antes de comer juntos",
            dialogue:[
              {speaker:'Marta', line:"Você está com fome? São duas horas."},
              {speaker:'Paulo', line:"Sim, estou com muita fome. O que tem para comer?"},
              {speaker:'Marta', line:"Tem macarrão e salada. Quer?"},
              {speaker:'Paulo', line:"Perfeito! E estou com muita sede também."},
              {speaker:'Marta', line:"Tem água e suco de laranja."},
              {speaker:'Paulo', line:"Ótimo, obrigado."}
            ], note:"Expressar fome, sede e necessidades.",
            translations:{es:'Hablar de comida',en:'Talking about food',fr:'Parler de nourriture',it:'Parlare di cibo',pt:'Falar de comida'} }
        ]
      },
      { id:'pt_a1_g3', name:'Perguntas e números', icon:'❓', color:'#10b981',
        description:'Palavras interrogativas + números de 1 a 8',
        reviewFrom:['pt_a1_g1','pt_a1_g2'],
        cards: [
          { id:'pt_a1_g3_01', word:'O que? / O quê?', emoji:'🔍', translations:{es:'¿qué?',en:'what?',fr:'quoi?',it:'cosa?',pt:'o que? / o quê?'}, examples:[{t:'O que você quer beber?'}] },
          { id:'pt_a1_g3_02', word:'Quem?',    emoji:'🧑', translations:{es:'¿quién?',en:'who?',fr:'qui?',it:'chi?',pt:'quem?'}, examples:[{t:'Quem é essa pessoa?'}] },
          { id:'pt_a1_g3_03', word:'Onde?',    emoji:'📍', translations:{es:'¿dónde?',en:'where?',fr:'où?',it:'dove?',pt:'onde?'}, examples:[{t:'Onde fica o banheiro?'}] },
          { id:'pt_a1_g3_04', word:'Quando?',  emoji:'📅', translations:{es:'¿cuándo?',en:'when?',fr:'quand?',it:'quando?',pt:'quando?'}, examples:[{t:'Quando você chega?'}] },
          { id:'pt_a1_g3_05', word:'Por quê?', emoji:'💭', translations:{es:'¿por qué?',en:'why?',fr:'pourquoi?',it:'perché?',pt:'por quê?'}, examples:[{t:'Por que você está cansado?'}] },
          { id:'pt_a1_g3_06', word:'Como?',    emoji:'🤔', translations:{es:'¿cómo?',en:'how?',fr:'comment?',it:'come?',pt:'como?'}, examples:[{t:"Como se diz 'hola' em português?"}] },
          { id:'pt_a1_g3_07', word:'Quanto?',  emoji:'💰', translations:{es:'¿cuánto?',en:'how much?',fr:'combien?',it:'quanto?',pt:'quanto?'}, examples:[{t:'Quanto custa este café?'}] },
          { id:'pt_a1_g3_08', word:'Quantos?', emoji:'🔢', translations:{es:'¿cuántos?',en:'how many?',fr:'combien de?',it:'quanti?',pt:'quantos?'}, examples:[{t:'Quantas pessoas na mesa?'}] },
          { id:'pt_a1_g3_09', word:'um / uma', emoji:'1️⃣', translations:{es:'uno/una',en:'one',fr:'un/une',it:'uno/una',pt:'um/uma'}, examples:[{t:'Uma mesa para dois, por favor.'}] },
          { id:'pt_a1_g3_10', word:'dois',     emoji:'2️⃣', translations:{es:'dos',en:'two',fr:'deux',it:'due',pt:'dois'}, examples:[{t:'Somos dois. Tem mesa?'}] },
          { id:'pt_a1_g3_11', word:'três',     emoji:'3️⃣', translations:{es:'tres',en:'three',fr:'trois',it:'tre',pt:'três'}, examples:[{t:'Uma mesa para três, por favor.'}] },
          { id:'pt_a1_g3_12', word:'quatro',   emoji:'4️⃣', translations:{es:'cuatro',en:'four',fr:'quatre',it:'quattro',pt:'quatro'}, examples:[{t:'Somos quatro. Vocês têm lugar?'}] },
          { id:'pt_a1_g3_13', word:'cinco',    emoji:'5️⃣', translations:{es:'cinco',en:'five',fr:'cinq',it:'cinque',pt:'cinco'}, examples:[{t:'Cinco cafés, por favor.'}] },
          { id:'pt_a1_g3_14', word:'seis',     emoji:'6️⃣', translations:{es:'seis',en:'six',fr:'six',it:'sei',pt:'seis'}, examples:[{t:'A reunião é às seis.'}] },
          { id:'pt_a1_g3_15', word:'sete',     emoji:'7️⃣', translations:{es:'siete',en:'seven',fr:'sept',it:'sette',pt:'sete'}, examples:[{t:'Há sete pessoas na aula.'}] },
          { id:'pt_a1_g3_16', word:'oito',     emoji:'8️⃣', translations:{es:'ocho',en:'eight',fr:'huit',it:'otto',pt:'oito'}, examples:[{t:'São oito da manhã.'}] },
          { id:'pt_a1_g3_D01', type:'dialogue', context:"No restaurante",
            dialogue:[
              {speaker:'Garçom',  line:"Boa noite! Quantas pessoas?"},
              {speaker:'Cliente', line:"Somos três. Tem uma mesa disponível?"},
              {speaker:'Garçom',  line:"Sim, claro. Vocês têm reserva?"},
              {speaker:'Cliente', line:"Não, não temos reserva."},
              {speaker:'Garçom',  line:"Sem problema. Por aqui, por favor."},
              {speaker:'Cliente', line:"Obrigado. Quanto tempo esperamos?"},
              {speaker:'Garçom',  line:"Só cinco minutos. Querem beber algo?"},
              {speaker:'Cliente', line:"Sim, duas águas e um suco de laranja."}
            ], note:"Perguntar quantidade, pedir no restaurante.",
            translations:{es:'En el restaurante',en:'At the restaurant',fr:'Au restaurant',it:'Al ristorante',pt:'No restaurante'} }
        ]
      },
      { id:'pt_a1_g4', name:'Verbos essenciais', icon:'⚡', color:'#ef4444',
        description:"Os verbos mais usados — presente + passado",
        reviewFrom:['pt_a1_g1','pt_a1_g2','pt_a1_g3'],
        cards: [
          { id:'pt_a1_g4_01', word:'sou / és / é',           emoji:'🌟', translations:{es:'ser: soy/eres/es',en:'to be',fr:'être: je suis/tu es/il est',it:'essere: sono/sei/è',pt:'ser: sou/és/é'}, examples:[{t:'Sou estudante. Você é meu amigo.'}] },
          { id:'pt_a1_g4_02', word:'tenho / tens / tem',      emoji:'✋', translations:{es:'tener: tengo/tienes/tiene',en:'to have',fr:"avoir: j'ai/tu as/il a",it:'avere: ho/hai/ha',pt:'ter: tenho/tens/tem'}, examples:[{t:'Tenho uma pergunta. Você tem tempo?'}] },
          { id:'pt_a1_g4_03', word:'quero / quer',            emoji:'❤️',  translations:{es:'querer: quiero/quieres',en:'to want',fr:'vouloir: je veux/tu veux',it:'volere: voglio/vuoi',pt:'querer: quero/quer'}, examples:[{t:'Quero um café. O que você quer?'}] },
          { id:'pt_a1_g4_04', word:'vou / vai',               emoji:'🚶', translations:{es:'ir: voy/vas',en:'to go',fr:'aller: je vais/tu vas',it:'andare: vado/vai',pt:'ir: vou/vai'}, examples:[{t:'Vou ao trabalho. Você vai à academia?'}] },
          { id:'pt_a1_g4_05', word:'falo / fala',             emoji:'🗣️', translations:{es:'hablar: hablo/hablas',en:'to speak',fr:'parler: je parle/tu parles',it:'parlare: parlo/parli',pt:'falar: falo/fala'}, examples:[{t:'Falo português. Você fala inglês?'}] },
          { id:'pt_a1_g4_06', word:'como / come',             emoji:'🍽️', translations:{es:'comer: como/comes',en:'to eat',fr:'manger: je mange/tu manges',it:'mangiare: mangio/mangi',pt:'comer: como/come'}, examples:[{t:'Como macarrão todo dia.'}] },
          { id:'pt_a1_g4_07', word:'bebo / bebe',             emoji:'🥤', translations:{es:'beber: bebo/bebes',en:'to drink',fr:'boire: je bois/tu bois',it:'bere: bevo/bevi',pt:'beber: bebo/bebe'}, examples:[{t:'Bebo café de manhã.'}] },
          { id:'pt_a1_g4_08', word:'moro / mora',             emoji:'🏠', translations:{es:'vivir: vivo/vives',en:'to live',fr:"habiter: j'habite/tu habites",it:'vivere: vivo/vivi',pt:'morar: moro/mora'}, examples:[{t:'Moro em São Paulo. Onde você mora?'}] },
          { id:'pt_a1_g4_09', word:'posso / pode',            emoji:'💪', translations:{es:'poder: puedo/puedes',en:'can',fr:'pouvoir: je peux/tu peux',it:'potere: posso/puoi',pt:'poder: posso/pode'}, examples:[{t:'Você pode falar mais devagar, por favor?'}] },
          { id:'pt_a1_g4_10', word:'gosto / não gosto',       emoji:'👍', translations:{es:'me gusta/no me gusta',en:"I like/I don't like",fr:"j'aime/je n'aime pas",it:'mi piace/non mi piace',pt:'gosto/não gosto'}, examples:[{t:'Gosto de café. Não gosto de chá.'}] },
          { id:'pt_a1_g4_11', word:'fui',                     emoji:'⏪', translations:{es:'fui',en:'I went',fr:'je suis allé(e)',it:'sono andato/a',pt:'fui'}, examples:[{t:'Fui ao médico ontem.'}] },
          { id:'pt_a1_g4_12', word:'trabalhei / falei',        emoji:'🔵', translations:{es:'trabajé/hablé (regulares)',en:'I worked/talked (regular)',fr:"j'ai travaillé/parlé",it:'ho lavorato/parlato',pt:'trabalhei/falei (regular)'}, examples:[{t:'Trabalhei o dia todo.'}] },
          { id:'pt_a1_g4_13', word:'tive / vi / fiz',          emoji:'🔴', translations:{es:'tuve/vi/hice (irregulares)',en:'I had/saw/did (irregular)',fr:"j'ai eu/vu/fait",it:'ho avuto/visto/fatto',pt:'tive/vi/fiz (irregular)'}, examples:[{t:'Tive um problema ontem. Ele viu um filme.'}] },
          { id:'pt_a1_g4_D01', type:'dialogue', context:"Contando o que fez ontem",
            dialogue:[
              {speaker:'Valéria', line:"O que você fez ontem?"},
              {speaker:'Tomás',   line:"Fui à academia de manhã e depois almocei com minha família."},
              {speaker:'Valéria', line:"Que legal! Onde vocês comeram?"},
              {speaker:'Tomás',   line:"Fomos a um restaurante italiano. E você?"},
              {speaker:'Valéria', line:"Fiquei em casa. Tive muito trabalho."},
              {speaker:'Tomás',   line:"Conseguiu descansar um pouco?"},
              {speaker:'Valéria', line:"Sim, um pouco. Gosto de trabalhar em casa."}
            ], note:"Verbos no passado: fui, almocei, tive, consegui.",
            translations:{es:'Hablar del pasado',en:'Talking about the past',fr:'Parler du passé',it:'Parlare del passato',pt:'Falar do passado'} }
        ]
      }
    ]
  }

};
