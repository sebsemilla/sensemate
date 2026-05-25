/**
 * linkedin_bot.cjs
 * ─────────────────────────────────────────────────────────────
 * Genera un post sobre SenseMate con IA (Cohere) y lo envía al
 * webhook de Make, que lo publica en LinkedIn con imagen.
 *
 * Ejecutar manualmente:   node linkedin_bot.cjs
 * Ejecutar en producción: llamado por el cron de server.cjs
 *
 * Variables necesarias en .env:
 *   COHERE_API_KEY
 *   MAKE_WEBHOOK_URL        (desde tu escenario de Make)
 *   GITHUB_USER             (tu usuario de GitHub, ej: sebasemilla)
 *   GITHUB_REPO             (nombre del repo, ej: sensemate)
 *   GITHUB_BRANCH           (rama, default: main)
 */

'use strict';

require('dotenv').config();
const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Config ────────────────────────────────────────────────────

const COHERE_API_KEY  = process.env.COHERE_API_KEY;
const MAKE_WEBHOOK    = process.env.MAKE_WEBHOOK_URL;
const GITHUB_USER     = process.env.GITHUB_USER     || 'sebasemilla';
const GITHUB_REPO     = process.env.GITHUB_REPO     || 'sensemate';
const GITHUB_BRANCH   = process.env.GITHUB_BRANCH   || 'main';
const STATE_FILE      = path.join(__dirname, '.linkedin_state.json');

// Base URL para imágenes públicas desde el repo de GitHub
const IMG_BASE =
  `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/images/social`;

// ── Features del proyecto — cada uno tiene su imagen ──────────

const FEATURES = [
  {
    focus:    'traducción contextual con IA',
    detail:   'Traducción formal, informal y neutral con análisis léxico completo. ' +
              'Usa Cohere command-a-translate para entender el contexto real del texto, no solo las palabras.',
    image:    `${IMG_BASE}/translator.png`,
  },
  {
    focus:    'personajes históricos con voz propia',
    detail:   'Conversás con Einstein, Frida Kahlo, Shakespeare, Maradona y más. ' +
              'Cada personaje tiene su voz clonada con Mistral Voxtral y responde en el idioma que estás aprendiendo.',
    image:    `${IMG_BASE}/famous.png`,
  },
  {
    focus:    'flashcards con spaced repetition',
    detail:   'Cartas con swipe, niveles A0 a C2, audio nativo y repetición espaciada dentro de la sesión. ' +
              'Cada grupo completado desbloquea trofeos en el sistema MisiónMate.',
    image:    `${IMG_BASE}/flashcards.png`,
  },
  {
    focus:    'Modo Inmersión',
    detail:   'Aprendé con películas y series en el idioma original: subtítulos sincronizados con el audio, ' +
              'resaltado de la palabra activa y popup de traducción al tocar cualquier palabra. ' +
              'Importación de archivos .SRT con traducción automática por IA.',
    image:    `${IMG_BASE}/immersion.png`,
  },
  {
    focus:    'Modo Músicos',
    detail:   'Letras de canciones con traducción simultánea y resaltado en tiempo real. ' +
              'Cada verso se ilumina a medida que suena, con pronunciación al tocarlo.',
    image:    `${IMG_BASE}/musicians.png`,
  },
  {
    focus:    'gamificación con MisiónMate',
    detail:   'Sistema de trofeos: Trofeo Buenas Raices (50 traducciones), Estudiante Estrella (25 flashcards), ' +
              'Trofeo Fluentist (conversaciones con IA) y los trofeos Constructor / Alquimista / Maestro ' +
              'por avanzar entre niveles A0→C2. Con Hoja de Ruta interactiva.',
    image:    `${IMG_BASE}/misionmate.png`,
  },
  {
    focus:    'Modo Escuela — tutor de IA',
    detail:   'Chat con un tutor de idiomas que corrige, explica gramática y da ejercicios ' +
              'adaptados al nivel (A1 a C2). Tiene control de velocidad de voz y lectura en voz alta.',
    image:    `${IMG_BASE}/school.png`,
  },
  {
    focus:    'modelo de negocio freemium',
    detail:   'Plan gratuito con límites generosos y planes premium desbloqueables. ' +
              'Integración con MercadoPago para pagos en Latinoamérica. ' +
              'En construcción para el lanzamiento oficial.',
    image:    `${IMG_BASE}/plans.png`,
  },
];

// ── Estado — rota el foco y evita repetir ────────────────────

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return { nextFeatureIdx: 0, postCount: 0, lastPostAt: null }; }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ── Generar texto con Cohere ──────────────────────────────────

function generatePost(feature) {
  return new Promise((resolve, reject) => {
    const systemPrompt =
      `Sos un desarrollador indie apasionado que escribe posts auténticos en LinkedIn sobre su proyecto.
Tu tono es directo, entusiasta y humano — sin jerga corporativa ni frases genéricas como "en el dinámico mundo de...".
Escribís en español rioplatense (Argentina). Usás emojis con moderación (1-3 por post).
Tus posts mezclan el progreso técnico concreto con la motivación personal detrás del proyecto.
Sos amante de los idiomas y creés que la creatividad y el disfrute son los mejores medios para aprenderlos.
Ese es el corazón de SenseMate.`;

    const userPrompt =
      `Escribí un post de LinkedIn sobre SenseMate, mi app web de aprendizaje de idiomas con IA.

El foco de este post es: **${feature.focus}**
Detalle técnico concreto: ${feature.detail}

Contexto personal y del proyecto:
- Es mi segundo gran proyecto como desarrollador indie
- Me motiva ser amante de los idiomas y creer que la creatividad y el disfrute son los mejores caminos para aprenderlos
- Estoy en desarrollo activo como único desarrollador
- En poco tiempo se realizará el lanzamiento de la versión beta
- Estoy abierto a recibir consultas y sugerencias de quienes quieran probarlo o aportar ideas

Requisitos del post:
- Entre 150 y 280 palabras
- Empezar con algo que genere curiosidad o una micro-anécdota de desarrollo
- Mencionar el feature de forma concreta, sin ser un manual técnico
- Incluir alguna referencia a la motivación personal (amor por los idiomas, aprender disfrutando)
- Cerrar mencionando el próximo lanzamiento de la beta e invitando a contactar con consultas o sugerencias
- 3-4 hashtags al final (en una línea separada)

Devolvé SOLO el texto del post, sin comillas ni explicaciones.`;

    const body = JSON.stringify({
      model:       'command-a-03-2025',
      message:     userPrompt,
      preamble:    systemPrompt,
      temperature: 0.85,
      max_tokens:  600,
    });

    const options = {
      hostname: 'api.cohere.com',
      path:     '/v1/chat',
      method:   'POST',
      headers:  {
        'Authorization':  `Bearer ${COHERE_API_KEY}`,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const text = json.text || json.generations?.[0]?.text;
          if (text) resolve(text.trim());
          else reject(new Error('Cohere no devolvió texto: ' + data));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Enviar a Make via webhook ─────────────────────────────────

function sendToMake(text, imageUrl) {
  return new Promise((resolve, reject) => {
    if (!MAKE_WEBHOOK) {
      reject(new Error('Falta MAKE_WEBHOOK_URL en .env'));
      return;
    }

    const axios = require('axios');
    axios.post(MAKE_WEBHOOK, { text, imageUrl }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
    .then(res => resolve(res.data))
    .catch(err => {
      const status = err.response?.status;
      const data   = err.response?.data;
      reject(new Error(`Make respondió ${status}: ${JSON.stringify(data)}`));
    });
  });
}

// ── Entry point ───────────────────────────────────────────────

async function run() {
  if (!COHERE_API_KEY) throw new Error('Falta COHERE_API_KEY en .env');
  if (!MAKE_WEBHOOK)   throw new Error('Falta MAKE_WEBHOOK_URL en .env');

  const state      = loadState();
  const featureIdx = state.nextFeatureIdx % FEATURES.length;
  const feature    = FEATURES[featureIdx];

  console.log(`\n📝 Generando post #${(state.postCount || 0) + 1} — foco: "${feature.focus}"`);
  const text = await generatePost(feature);

  console.log('\n── Post generado ───────────────────────────────────────');
  console.log(text);
  console.log(`\n🖼  Imagen: ${feature.image}`);
  console.log('────────────────────────────────────────────────────────\n');

  console.log('🚀 Enviando a Make...');
  await sendToMake(text, feature.image);
  console.log('✅ Enviado a Make correctamente. Make publicará en LinkedIn.');

  saveState({
    nextFeatureIdx: featureIdx + 1,
    postCount:      (state.postCount || 0) + 1,
    lastPostAt:     new Date().toISOString(),
    lastFeature:    feature.focus,
    lastText:       text.substring(0, 100) + '...',
  });
}

module.exports = { run };

if (require.main === module) {
  run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}
