/**
 * linkedin_bot.cjs
 * ─────────────────────────────────────────────────────────────
 * Genera un post sobre SenseMate con IA (Cohere) y lo publica
 * automáticamente en LinkedIn cada 4 días.
 *
 * Llamado internamente por el cron en server.cjs.
 * También podés ejecutarlo manualmente:
 *   node linkedin_bot.cjs
 */

'use strict';

require('dotenv').config();
const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Configuración ──────────────────────────────────────────────

const COHERE_API_KEY      = process.env.COHERE_API_KEY;
const LINKEDIN_TOKEN      = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN;
const STATE_FILE          = path.join(__dirname, '.linkedin_state.json');

// ── Features del proyecto para variar el foco de cada post ────

const FEATURES = [
  {
    focus: 'traducción contextual',
    detail: 'Traducción formal, informal y neutral con análisis léxico completo usando modelos de Cohere.',
  },
  {
    focus: 'personajes históricos con IA',
    detail: 'Podés conversar con Einstein, Frida Kahlo, Shakespeare, Maradona y más. Cada personaje tiene su propia voz clonada con Mistral Voxtral.',
  },
  {
    focus: 'sistema de flashcards',
    detail: 'Flashcards con swipe, spaced repetition, niveles A0 a C2, y modo práctica con audio y pronunciación nativa.',
  },
  {
    focus: 'Modo Inmersión',
    detail: 'Aprendé con películas y series: reproducción de audio/video con subtítulos sincronizados, resaltado de palabra activa y popup de traducción al tocar.',
  },
  {
    focus: 'gamificación con MisiónMate',
    detail: 'Sistema de trofeos y logros: Trofeo Buenas Raices (50 traducciones), Estudiante Estrella (25 flashcards), Trofeo Fluentist (conversaciones con IA) y una serie de trofeos Constructor, Alquimista y Maestro por avanzar entre niveles.',
  },
  {
    focus: 'modo músicos con letras sincronizadas',
    detail: 'Letras de canciones con traducción simultánea, resaltado en tiempo real y pronunciación de cada verso.',
  },
  {
    focus: 'arquitectura técnica',
    detail: 'SPA vanilla JS sin frameworks, backend Node.js + Express, Cohere para traducción y chat, Mistral para TTS, y Kyutai para traducción de voz en tiempo real.',
  },
  {
    focus: 'planes y modelo de negocio',
    detail: 'Plan freemium con MercadoPago integrado, límites de traducciones por plan y funciones premium desbloqueables.',
  },
];

// ── Estado para rotar el foco y evitar repetir posts ──────────

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return { lastPostAt: null, nextFeatureIdx: 0, postCount: 0 }; }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ── Generar texto del post con Cohere ──────────────────────────

function generatePost(feature) {
  return new Promise((resolve, reject) => {
    const systemPrompt = `Sos un desarrollador indie apasionado que escribe posts auténticos en LinkedIn sobre su proyecto.
Tu tono es directo, entusiasta y humano — sin jerga corporativa ni frases genéricas como "en el dinámico mundo de...".
Escribís en español (Argentina). Usás emojis con moderación (1-3 por post). No usás hashtags en exceso (máximo 4, relevantes).
Tus posts mezclan el progreso técnico con la motivación personal de construir algo útil.`;

    const userPrompt = `Escribí un post de LinkedIn sobre SenseMate, mi app web de aprendizaje de idiomas con IA.

El foco de este post es: **${feature.focus}**
Detalle técnico a mencionar: ${feature.detail}

Contexto del proyecto:
- App para traducir con contexto y aprender idiomas con IA
- Funciona en el navegador, sin instalación, con backend en Node.js
- Está en desarrollo activo, soy el único desarrollador
- URL: sensemate.app (próximo lanzamiento)

El post debe:
- Tener entre 150 y 280 palabras
- Empezar con algo que genere curiosidad o cuente un micro-anécdota de desarrollo
- Mencionar el feature específico de forma concreta
- Terminar con una pregunta o reflexión que invite a interactuar
- Incluir 3-4 hashtags al final

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
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type':  'application/json',
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

// ── Publicar en LinkedIn ───────────────────────────────────────

function publishToLinkedIn(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      author:           LINKEDIN_PERSON_URN,
      lifecycleState:   'PUBLISHED',
      specificContent:  {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary:    { text },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    });

    const options = {
      hostname: 'api.linkedin.com',
      path:     '/v2/ugcPosts',
      method:   'POST',
      headers:  {
        'Authorization':  `Bearer ${LINKEDIN_TOKEN}`,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
        'X-Restli-Protocol-Version': '2.0.0',
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          try { resolve(JSON.parse(data)); }
          catch { resolve({ id: 'ok' }); }
        } else {
          reject(new Error(`LinkedIn ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Verificar si el token está próximo a vencer ───────────────

function checkTokenExpiry() {
  // LinkedIn tokens duran ~60 días. Avisamos a los 50 días.
  const state = loadState();
  if (!state.tokenSavedAt) return;
  const days = (Date.now() - new Date(state.tokenSavedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (days >= 50) {
    console.warn(`⚠️  LinkedIn token tiene ${Math.round(days)} días. Renovalo pronto con: node linkedin_auth.cjs`);
  }
}

// ── Entry point ────────────────────────────────────────────────

async function run() {
  if (!COHERE_API_KEY)      throw new Error('Falta COHERE_API_KEY en .env');
  if (!LINKEDIN_TOKEN)      throw new Error('Falta LINKEDIN_ACCESS_TOKEN en .env — corré node linkedin_auth.cjs');
  if (!LINKEDIN_PERSON_URN) throw new Error('Falta LINKEDIN_PERSON_URN en .env — corré node linkedin_auth.cjs');

  checkTokenExpiry();

  const state      = loadState();
  const featureIdx = state.nextFeatureIdx % FEATURES.length;
  const feature    = FEATURES[featureIdx];

  console.log(`\n📝 Generando post sobre: ${feature.focus} ...`);
  const text = await generatePost(feature);
  console.log('\n── Post generado ───────────────────────────────────────');
  console.log(text);
  console.log('────────────────────────────────────────────────────────\n');

  console.log('🚀 Publicando en LinkedIn...');
  const result = await publishToLinkedIn(text);
  console.log(`✅ Publicado. ID: ${result.id || 'ok'}`);

  saveState({
    lastPostAt:     new Date().toISOString(),
    nextFeatureIdx: featureIdx + 1,
    postCount:      (state.postCount || 0) + 1,
    tokenSavedAt:   state.tokenSavedAt || new Date().toISOString(),
    lastText:       text.substring(0, 120) + '...',
  });
}

// Exportar para uso desde server.cjs, y también ejecutar si se llama directo
module.exports = { run };

if (require.main === module) {
  run().catch(err => {
    console.error('❌ Error al publicar:', err.message);
    process.exit(1);
  });
}
