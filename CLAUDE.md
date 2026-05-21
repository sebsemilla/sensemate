# SenseMate — CLAUDE.md

## ¿Qué es esta app?
Aplicación web de traducción y aprendizaje de idiomas con IA.
- Traducción contextual (formal / informal / neutro) con análisis léxico
- Modo práctica: flashcards agrupados por temática e historias por nivel
- Chat con personajes históricos famosos (Einstein, Maradona, Frida, MLK, etc.)
- Sección de música con letras y traducción sincronizada
- Sección "Aprende con..." (immersion.js): reproducción de audio/video con diálogo sincronizado por timestamps
- **En desarrollo:** importación de subtítulos .SRT para la sección de inmersión

---

## Stack tecnológico

### Frontend
- Vanilla JS (sin frameworks), HTML5, CSS3
- GSAP 3.12 (animaciones del dark mode toggle)
- Todo el estado de la app vive en `localStorage`
- SPA: un solo `index.html`, las secciones se renderizan dinámicamente en `#mainContainer`

### Backend
- Node.js + Express (`server.cjs`, puerto 3000)
- **Cohere** (`command-a-translate-08-2025`): traducción contextual (endpoint `/translate`)
- **Cohere** (`command-a-03-2025`): chat tutor (`/chat`) y chat con famosos (`/famous-chat`)
- **Mistral Voxtral** (`voxtral-mini-transcribe-realtime-2602`): TTS para voces de personajes (`/speak`)
- **Mistral** (`create_voices.js`): clonado de voz para personajes (script standalone, no servidor)
- **Kyutai** (Python, `kyutai_service.py`): traducción de voz, llamado via `exec()` desde `/translate-speech`
- OpenRouter integrado pero aún sin uso activo

### Variables de entorno necesarias (.env)
```
COHERE_API_KEY=
MISTRAL_API_KEY=
OPENROUTER_API_KEY=
```

---

## Estructura de archivos

```
/
├── index.html          # Entry point, carga todos los scripts
├── app.js              # Lógica principal, routing de secciones, estado global
├── auth.js             # Auth con localStorage (registro, login, sesión, dev bypass)
├── onboarding.js       # Slides de intro + formularios de login/registro (2 pasos)
├── immersion.js        # Sección "Aprende con..." (reproductor + diálogo sincronizado)
├── content_library.js  # Contenido curado (CURATED_CONTENT[]) para la sección inmersión
├── styles.css          # Todos los estilos (dark mode, componentes, animaciones)
├── server.cjs          # Backend Express con todos los endpoints de IA
├── create_voices.js    # Script standalone para clonar voces en Mistral (ESM)
├── themes.js           # Sistema de temas visuales (cargado en index.html)
├── data/
│   └── songs_es.js     # Datos de canciones en español
└── audio/              # Archivos de audio locales para la sección inmersión
```

---

## Convenciones de código

### Naming
- Funciones privadas de módulo: prefijo `_` (ej: `_renderBrowser`, `_obRender`)
- Constantes de clave localStorage: sufijo `_KEY` (ej: `_SESSION_KEY`, `_USERS_KEY`)
- Funciones de auth: prefijo `auth` (ej: `authLogin`, `authGetCurrentUser`)
- Funciones de onboarding: prefijo `ob` o `_ob` (ej: `showOnboarding`, `_obRender`)
- Funciones de inmersión: prefijo `_imm` o `imm` (ej: `loadImmersionSection`, `_immCleanup`)

### Patrones de renderizado
- Cada sección limpia `mainContainer.innerHTML` y se auto-renderiza
- Siempre se llama a `renderLanguageBar()` después de cambiar el contenido del mainContainer
- Los overlays/modales se agregan al `document.body` y se eliminan al cerrar
- Los event listeners se agregan después de insertar el HTML (no se usa delegación global)

### Estado global en app.js
```js
let sourceLang      // idioma origen (localStorage: 'sourceLang')
let targetLang      // idioma destino (localStorage: 'targetLang')
let currentMode     // sección activa
let currentUser     // objeto de usuario o null (modo invitado)
let appUILanguage   // idioma de la UI (localStorage: 'appUILanguage')
let currentTranslations // objeto con strings de la UI traducidos
```

### Auth / Dev bypass
- En `auth.js`: cualquier email + password `dev2025` loguea como Dev User
- Los usuarios se guardan hasheados (btoa) en localStorage bajo la clave `ls_users`

---

## Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/translate` | Traducción contextual (Cohere). Body: `{text, plan, sourceLang, targetLang}` |
| POST | `/chat` | Chat tutor IA (Cohere). Body: `{messages[], level, targetLang}` |
| POST | `/famous-chat` | Chat con personaje histórico (Cohere). Body: `{person, messages[], targetLang}` |
| POST | `/speak` | TTS voz de personaje (Mistral Voxtral). Body: `{text, persona}` |
| POST | `/translate-speech` | Traducción de voz (Kyutai Python). Body: `{audioBase64, sourceLang, targetLang}` |

### Respuesta de `/translate`
```json
{
  "translation": "{\"formal\":\"...\",\"informal\":\"...\",\"neutral\":\"...\",\"lexical\":{\"type\":\"vbo.\",\"details\":\"...\",\"examples\":[...]}}"
}
```
Nota: `translation` es un JSON stringify-eado, hay que parsearlo en el frontend.

### Personajes soportados en `/famous-chat`
`mlk`, `marilyn`, `maradona`, `einstein`, `cleopatra`, `frida`, `mandela`, `shakespeare`

---

## Sección en desarrollo: Importación de .SRT

**Estado actual:** La sección de inmersión (`immersion.js`) acepta timestamps manuales para el diálogo.
**Próximo paso:** Parsear archivos `.srt` e importarlos al formato `dialogue[]` de la app.

Formato destino que espera la app:
```js
dialogue: [
  { start: 0.0, end: 3.5, original: 'Texto en idioma original', translation: 'Traducción' }
]
```

Formato `.srt` a parsear:
```
1
00:00:01,000 --> 00:00:03,500
Texto de subtítulo

2
00:00:03,800 --> 00:00:07,200
Siguiente línea
```

---

## Cosas importantes a recordar

- `server.cjs` usa CommonJS (`require`), mientras que `create_voices.js` usa ESM (`import`) — no mezclar
- El frontend llama al backend en `http://localhost:3000` (hardcodeado en `app.js` como `API_URL`)
- No hay base de datos: todo el estado persiste en `localStorage`
- El sistema de auth es para desarrollo/MVP — no apto para producción real
- `themes.js` se carga antes que el resto de scripts en `index.html`
- GSAP se carga desde CDN (cdnjs), el dark mode toggle depende de él
- `songs_es.js` en `/data/` se carga via script tag — no es un módulo
- Los archivos de audio locales van en `/audio/`, los personajes de inmersión los referencian con paths relativos

---

## Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Arrancar el servidor
node server.cjs

# Abrir en el navegador
http://localhost:3000
```

Dev bypass: en la pantalla de login, cualquier email + contraseña `dev2025`
