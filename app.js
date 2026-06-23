// app.js — Core: globals, utilidades, auth, menú principal, init
// ===============================================================

// ─── Analytics helper ─────────────────────────────────────────
function _track(eventName, params = {}) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params);
}

// ─── Elementos del DOM ────────────────────────────────────────

const mainContainer = document.getElementById('mainContainer');
const menuButton    = document.getElementById('menuButton');
const dropdownMenu  = document.getElementById('dropdownMenu');

// ─── Variables globales ───────────────────────────────────────

let sourceLang = localStorage.getItem('sourceLang') || '';
let targetLang = localStorage.getItem('targetLang') || '';
let currentMode = null;
let currentUser = null;
// Detectar idioma del navegador como default para primer uso
const _browserLang   = (navigator.language || 'es').split('-')[0].toLowerCase();
const _supportedLangs = ['es','en','fr','de','it','pt','gn','zh','ja','ru','ar','ko','nl','pl','tr'];
let appUILanguage = localStorage.getItem('appUILanguage')
    || (_supportedLangs.includes(_browserLang) ? _browserLang : 'es');
let currentTranslations = {};

// Flashcards / Práctica
let flashcardGroups = [];
let flashcards      = [];
let lastGroupId     = localStorage.getItem('lastGroupId') || null;

// Historias (leídas en init, usadas en practice.js)
let storiesData = [];

// Settings globales (cargados en init desde settings.js)
let appSettings = {};

// Avatar
let currentAvatarGroup = localStorage.getItem('avatarGroup') || 'cats';
let currentAvatarStyle = localStorage.getItem('avatarStyle') || 'cat1';

const avatarStyles = {
    cats: {
        cat1: { static: '🐱', thinking: '😼', name: 'Gris pensativo' },
        cat2: { static: '🐈', thinking: '😺', name: 'Naranja curioso' }
    },
    dogs: {
        dog1: { static: '🐕', thinking: '🐶', name: 'Labrador' },
        dog2: { static: '🐩', thinking: '🐕‍🦺', name: 'Caniche' }
    }
};

// API — localhost usa puerto 3000, producción usa el mismo origen
const _API_HOST = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : window.location.origin;
const API_URL   = `${_API_HOST}/translate`;
// API_BASE is declared globally in auth.js

// Helper: fetch con JWT adjunto automáticamente
function _authFetch(url, options = {}) {
    const token = typeof authGetToken === 'function' ? authGetToken() : null;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
}

let _edgeAudio = null;
function speakEdge() {}
function speakEdgeStop() {
    if (_edgeAudio) { _edgeAudio.pause(); _edgeAudio = null; }
}

// ─── Flashcard helpers (usados también desde practice.js) ─────

function loadFlashcardData() {
    flashcardGroups = JSON.parse(localStorage.getItem('flashcardGroups') || '[]');
    flashcards      = JSON.parse(localStorage.getItem('flashcards')      || '[]');
}
function saveFlashcardData() {
    localStorage.setItem('flashcardGroups', JSON.stringify(flashcardGroups));
    localStorage.setItem('flashcards',      JSON.stringify(flashcards));
}
function setLastGroup(groupId) {
    lastGroupId = groupId;
    localStorage.setItem('lastGroupId', lastGroupId);
    const group = flashcardGroups.find(g => g.id === groupId);
    if (group) group.lastUsed = new Date().toISOString();
    saveFlashcardData();
}

// ─── Idiomas ──────────────────────────────────────────────────

function saveLanguages(src, tgt) {
    sourceLang = src;
    targetLang = tgt;
    localStorage.setItem('sourceLang', sourceLang);
    localStorage.setItem('targetLang', targetLang);
    const s = document.getElementById('langBarSource');
    const t = document.getElementById('langBarTarget');
    if (s) s.value = sourceLang;
    if (t) t.value = targetLang;
    if (document.getElementById('misionPathGrid')) _initMisionHub();
}

function swapLanguages() {
    saveLanguages(targetLang, sourceLang);
}

// ─── Traducciones de UI ───────────────────────────────────────

async function loadTranslations(langCode = 'es') {
    try {
        const res = await fetch(`/locales/${langCode}.json`);
        if (!res.ok) throw new Error(`Idioma ${langCode} no encontrado`);
        currentTranslations = await res.json();
        applyUILanguage();
    } catch (err) {
        console.error('Error cargando traducciones:', err);
        currentTranslations = {};
        applyUILanguage();
    }
}

function applyUILanguage() {
    const t = currentTranslations;
    document.title = t.appName || 'SenseMate';
    const h = document.querySelector('.app-header h1');
    if (h) h.textContent = t.appName || 'SenseMate';
    const ids = {
        profileLink:     `👤 ${t.menuProfile      || 'Perfil'}`,
        settingsLink:    `⚙️ ${t.menuSettings     || 'Configuración'}`,
        complaintsLink:  `📢 ${t.menuComplaints    || 'Quejas'}`,
        suggestionsLink: `💡 ${t.menuSuggestions   || 'Sugerencias'}`,
    };
    Object.entries(ids).forEach(([id, html]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    });
}

function updateMenuLanguageDisplay() {
    const flags = {
        es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹',
        pt: '🇧🇷', zh: '🇨🇳', ja: '🇯🇵', ru: '🇷🇺', ar: '🇸🇦',
        ko: '🇰🇷', nl: '🇳🇱', pl: '🇵🇱', tr: '🇹🇷'
    };
    const el    = document.getElementById('menuLanguageDisplay');
    if (el) el.innerHTML = `${flags[appUILanguage] || '🌐'} ${appUILanguage.toUpperCase()}`;
}

// ─── Avatar ───────────────────────────────────────────────────

function updateAvatarCircle() {
    const circle = document.getElementById('avatarCircle');
    if (!circle) return;
    circle.innerHTML = avatarStyles[currentAvatarGroup]?.[currentAvatarStyle]?.static || '🐱';
}

function getAvatarContent(thinking = false) {
    const data = avatarStyles[currentAvatarGroup]?.[currentAvatarStyle];
    if (!data) return '🐱';
    return thinking ? data.thinking : data.static;
}

// ─── Auth guards ──────────────────────────────────────────────

function requireAuth(sectionName, proceed) {
    if (currentUser) { proceed(); return; }
    const overlay = document.createElement('div');
    overlay.className = 'ob-login-wall';
    overlay.innerHTML = `
        <div class="ob-lw-card">
            <div class="ob-lw-icon">🔒</div>
            <h3 class="ob-lw-title">Función exclusiva</h3>
            <p class="ob-lw-desc">Creá tu cuenta gratis para acceder a <strong>${sectionName}</strong> y guardar tu progreso.</p>
            <button class="ob-submit-btn" id="lwLoginBtn" style="width:100%;margin-bottom:.75rem;">
                Crear cuenta / Iniciar sesión
            </button>
            <button class="ob-lw-skip" id="lwSkipBtn">
                Continuar como invitado (sin guardar progreso)
            </button>
        </div>`;
    document.body.appendChild(overlay);
    document.getElementById('lwLoginBtn').addEventListener('click', () => {
        overlay.remove();
        const prev = window.onOnboardingComplete;
        window.onOnboardingComplete = user => { prev(user); if (user) proceed(); };
        showOnboarding(true);
    });
    document.getElementById('lwSkipBtn').addEventListener('click', () => {
        overlay.remove();
        proceed();
        setTimeout(() => showGuestBanner(sectionName), 150);
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function showGuestBanner(sectionName) {
    document.querySelector('.ob-guest-banner')?.remove();
    const banner = document.createElement('div');
    banner.className = 'ob-guest-banner';
    banner.innerHTML = `
        🔓 Modo invitado — Tu progreso en <strong>${sectionName}</strong> no se guardará.
        <button id="guestLoginBtn">Iniciar sesión</button>`;
    document.getElementById('mainContainer')?.prepend(banner);
    document.getElementById('guestLoginBtn')?.addEventListener('click', () => {
        banner.remove();
        showOnboarding(true);
    });
}

function requireAuthForAction(label) {
    if (currentUser) return true;
    const toast = document.createElement('div');
    toast.className = 'ob-action-toast';
    toast.innerHTML = `<span>🔒 Iniciá sesión para ${label}</span><button id="toastLoginBtn">Crear cuenta</button>`;
    document.body.appendChild(toast);
    document.getElementById('toastLoginBtn').addEventListener('click', () => { toast.remove(); showOnboarding(true); });
    setTimeout(() => toast.remove(), 4000);
    return false;
}

// ─── Barra de idiomas ─────────────────────────────────────────

function renderLanguageBar() {
    const t = currentTranslations;
    document.querySelector('.language-bar')?.remove();
    mainContainer.insertAdjacentHTML('afterbegin', `
        <div class="language-bar">
            <select id="langBarSource" class="lang-select">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="gn">Guaraní</option>
            </select>
            <button id="swapLangBtn" class="swap-btn">⇄</button>
            <select id="langBarTarget" class="lang-select">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="gn">Guaraní</option>
            </select>
        </div>
    `);
    const src  = document.getElementById('langBarSource');
    const tgt  = document.getElementById('langBarTarget');
    const swap = document.getElementById('swapLangBtn');
    if (src && tgt) {
        src.value = sourceLang;
        tgt.value = targetLang;
        src.addEventListener('change', e => saveLanguages(e.target.value, targetLang));
        tgt.addEventListener('change', e => saveLanguages(sourceLang, e.target.value));
    }
    if (swap) swap.addEventListener('click', swapLanguages);
}

// ─── Menú desplegable ─────────────────────────────────────────

document.addEventListener('click', e => {
    if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
    }
});
menuButton.addEventListener('click', () => dropdownMenu.classList.toggle('hidden'));

document.getElementById('profileLink').addEventListener('click',     e => { e.preventDefault(); alert('Perfil - Próximamente');       dropdownMenu.classList.add('hidden'); });
document.getElementById('settingsLink').addEventListener('click',    e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); loadSettingsSection(); });
document.getElementById('complaintsLink').addEventListener('click',  e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); loadComplaintsSection(); });
document.getElementById('suggestionsLink').addEventListener('click', e => { e.preventDefault(); alert('Sugerencias - Próximamente');   dropdownMenu.classList.add('hidden'); });
document.getElementById('themesLink').addEventListener('click',      e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); showThemesPanel(); });
document.getElementById('logoutLink').addEventListener('click', e => { e.preventDefault(); authLogout(); location.reload(); });
document.getElementById('planesMenuLink')?.addEventListener('click', e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); if (typeof loadMembershipSection === 'function') loadMembershipSection(); });

// ─── Sección Quejas & Fortalezas ─────────────────────────────

function loadComplaintsSection() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="fb-wrap">
            <div class="fb-header">
                <button class="school-back-btn" id="fbBackBtn">← Volver</button>
                <h2 class="cfg-title">📢 Quejas & Fortalezas</h2>
            </div>

            <p class="fb-subtitle">Tu opinión nos ayuda a mejorar. Todos los campos son opcionales.</p>

            <form id="fbForm" class="fb-form" novalidate>

                <div class="fb-block">
                    <label class="fb-label" for="fbSubject">Asunto</label>
                    <input id="fbSubject" type="text" class="fb-input"
                        placeholder="Ej: Error en la sección de traducción..." maxlength="120">
                </div>

                <div class="fb-block">
                    <label class="fb-label" for="fbComments">
                        Comentarios <span class="fb-tag fb-tag--complaint">Queja</span>
                    </label>
                    <textarea id="fbComments" class="fb-textarea"
                        placeholder="Describí el problema, lo que no funciona o lo que te molesta..."
                        rows="5" maxlength="2000"></textarea>
                    <span class="fb-char-count" id="fbCommentsCount">0 / 2000</span>
                </div>

                <div class="fb-block">
                    <label class="fb-label" for="fbStrengths">
                        Fortalezas <span class="fb-tag fb-tag--strength">Positivo</span>
                    </label>
                    <textarea id="fbStrengths" class="fb-textarea"
                        placeholder="¿Qué es lo que más te gusta o funciona bien?"
                        rows="4" maxlength="1000"></textarea>
                    <span class="fb-char-count" id="fbStrengthsCount">0 / 1000</span>
                </div>

                <div class="fb-actions">
                    <button type="submit" class="fb-submit-btn" id="fbSubmitBtn">
                        <span id="fbBtnText">Enviar</span>
                    </button>
                </div>

                <div id="fbSuccess" class="fb-success hidden">
                    ✅ ¡Gracias por tu mensaje! Lo tendremos en cuenta.
                </div>
                <div id="fbError" class="fb-error hidden">
                    ❌ Hubo un problema al enviar. Intentá de nuevo.
                </div>
            </form>
        </div>
    `);

    document.getElementById('fbBackBtn').addEventListener('click', () => showMainMenu());

    const commentsEl   = document.getElementById('fbComments');
    const strengthsEl  = document.getElementById('fbStrengths');
    const commCount    = document.getElementById('fbCommentsCount');
    const strgCount    = document.getElementById('fbStrengthsCount');

    commentsEl.addEventListener('input',  () => { commCount.textContent  = `${commentsEl.value.length}  / 2000`; });
    strengthsEl.addEventListener('input', () => { strgCount.textContent  = `${strengthsEl.value.length} / 1000`; });

    document.getElementById('fbForm').addEventListener('submit', async e => {
        e.preventDefault();

        const subject   = document.getElementById('fbSubject').value.trim();
        const comments  = commentsEl.value.trim();
        const strengths = strengthsEl.value.trim();

        if (!subject && !comments && !strengths) {
            document.getElementById('fbError').textContent = '⚠️ Completá al menos un campo antes de enviar.';
            document.getElementById('fbError').classList.remove('hidden');
            return;
        }

        const btn = document.getElementById('fbSubmitBtn');
        document.getElementById('fbBtnText').textContent = 'Enviando...';
        btn.disabled = true;
        document.getElementById('fbSuccess').classList.add('hidden');
        document.getElementById('fbError').classList.add('hidden');

        try {
            const res = await _authFetch(_API_HOST + '/feedback', {
                method: 'POST',
                body: JSON.stringify({
                    subject,
                    comments,
                    strengths,
                    user: currentUser ? currentUser.email : 'invitado',
                    date: new Date().toISOString()
                })
            });

            if (!res.ok) throw new Error('server error');

            document.getElementById('fbSuccess').classList.remove('hidden');
            document.getElementById('fbForm').reset();
            commCount.textContent  = '0 / 2000';
            strgCount.textContent  = '0 / 1000';
        } catch {
            document.getElementById('fbError').textContent = '❌ Hubo un problema al enviar. Intentá de nuevo.';
            document.getElementById('fbError').classList.remove('hidden');
        } finally {
            document.getElementById('fbBtnText').textContent = 'Enviar';
            btn.disabled = false;
        }
    });
}

// ─── Modo del selector (Traducción / Misión / Exploración) ───

let appMode = 'traduccion'; // siempre arranca en traducción; mobile lo restaura vía visibilitychange

function _initModeSelector() {
    const selector = document.getElementById('appModeSelector');
    if (!selector) return;
    selector.setAttribute('data-mode', appMode);
    selector.querySelectorAll('.app-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab === appMode) return;
            appMode = tab;
            localStorage.setItem('appMode', appMode);
            selector.setAttribute('data-mode', appMode);
            showMainMenu();
            if (tab === 'mision') {
                setTimeout(() => toggleMisionMate(), 100);
            }
        });
    });
}

let _misionLastKey = null; // clave del último módulo visto, para re-centrar al volver

// ─── Hub gamificado (modo Misión) — serpentina A1 + A2 ──────────────

// Misión A1/A2: enseña español — el JSON se elige por sourceLang (idioma nativo del usuario)
// targetLang debe ser 'es' para acceder al contenido
const _MISION_A1_FILES = {
    en: 'sensemate_es_a1_en_utf8.json',
    it: 'sensemate_es_a1_it.json',
    pt: 'sensemate_es_a1_pt.json',
    fr: 'español para franceses.json',
    de: 'sensemate_es_a1_de.json',
    gn: 'sensemate_es_a1_gn.json',
};

// Solo los idiomas con A2 implementado
const _MISION_A2_FILES = {
    en: 'sensemate_es_a2_en_utf8.json',
    fr: 'sensemate_es_a2_fr.json',
    it: 'sensemate_es_a2_it.json',
    pt: 'sensemate_es_a2_pt.json',
    de: 'sensemate_es_a2_de.json',
};

const _MISION_B1_FILES = {
    en: 'sensemate_es_b1_en.json',
    fr: 'sensemate_es_b1_fr.json',
    it: 'sensemate_es_b1_it.json',
    pt: 'sensemate_es_b1_pt.json',
    de: 'sensemate_es_b1_de.json',
};

const _MISION_B2_FILES = {
    en: 'b2_en_.json',
    fr: 'b2_fr_.json',
    it: 'b2_it_.json',
    pt: 'b2_pt_.json',
    de: 'b2_de_.json',
};

const _MISION_C1_FILES = {
    en: 'sensamate_en_c1.json',
    fr: 'sensamate_fr_c1.json',
    it: 'sensamate_it_c1.json',
    pt: 'sensamate_pt_c1.json',
    de: 'sensamate_de_c1.json',
};

function _misionA1Url() {
    const src  = sourceLang || 'en';
    const file = _MISION_A1_FILES[src] || _MISION_A1_FILES['en'];
    return `${_API_HOST}/misiones/espa%C3%B1ol/espa%C3%B1ol_a1/${encodeURIComponent(file)}`;
}

function _misionA2Url() {
    const src  = sourceLang || 'en';
    const file = _MISION_A2_FILES[src];
    return file ? `${_API_HOST}/misiones/espa%C3%B1ol/espa%C3%B1ol_a2/${encodeURIComponent(file)}` : null;
}

function _initMisionHub() {
    const grid = document.getElementById('misionPathGrid');
    if (!grid) return;

    if (targetLang !== 'es') {
        grid.innerHTML = `
            <div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)">
                <div style="font-size:2rem;margin-bottom:.75rem">🗺️</div>
                <p style="font-size:.95rem;margin-bottom:.5rem">Esta sección enseña <strong>Español</strong>.</p>
                <p style="font-size:.85rem">Cambiá el idioma destino a <strong>Español</strong> para ver el contenido.</p>
            </div>`;
        return;
    }
    if (!_MISION_A1_FILES[sourceLang]) {
        grid.innerHTML = `
            <div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)">
                <div style="font-size:2rem;margin-bottom:.75rem">🌐</div>
                <p style="font-size:.95rem;margin-bottom:.5rem">Contenido disponible para hablantes de:</p>
                <p style="font-size:.85rem"><strong>Inglés · Francés · Italiano · Portugués · Alemán</strong></p>
            </div>`;
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0">Cargando módulos…</p>';

    const a2url = _misionA2Url();
    const fetchA2 = a2url
        ? fetch(a2url).then(r => r.json()).then(d => Array.isArray(d) ? d : [])
        : Promise.resolve([]);

    Promise.all([
        fetch(_misionA1Url()).then(r => r.json()).then(d => Array.isArray(d) ? d : [d]),
        fetchA2,
    ])
        .then(([modsA1, modsA2]) => _renderMisionSnake(grid, modsA1, modsA2))
        .catch(() => {
            grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1rem 0">No se pudieron cargar los módulos.</p>';
        });
}

function _renderMisionSnake(grid, modsA1, modsA2) {
    function trunc(str, max) {
        return str.length > max ? str.slice(0, max) + '…' : str;
    }

    // 7 nodos de intro (posiciones 0-6), milestone en 7, JSON en 8-25
    const INTRO_NODES = [
        { type: 'intro_card',    key: 'intro_0', emoji: '📋', label: 'Introducción' },
        { type: 'pronunciation', key: 'intro_1', emoji: '🔊', label: 'Pronunciación' },
        { type: 'flashcard_a0', key: 'intro_2', emoji: '🃏', label: 'Cards A0' },
        { type: 'placeholder',  key: 'intro_3', emoji: '👋', label: 'Greetings Intro' },
        { type: 'placeholder',  key: 'intro_4', emoji: '💬', label: 'Basic Conv.' },
        { type: 'placeholder',  key: 'intro_5', emoji: '🗣️', label: 'Exercise Dialog' },
        { type: 'placeholder',  key: 'intro_6', emoji: '❓', label: 'Quiz' },
    ];

    const hasA2 = modsA2.length > 0;
    const allNodes = [
        ...INTRO_NODES,
        { type: 'milestone',    key: 'milestone_A1',   label: '★ Inicio A1' },
        ...modsA1.map(m => ({ type: 'mod', key: `mod_${m.id}`, mod: m })),
        ...(hasA2 ? [
            { type: 'milestone',    key: 'milestone_A2',   label: '★ Inicio A2' },
            ...modsA2.map(m => ({ type: 'mod', key: `mod_${m.id}`, mod: m })),
            { type: 'quiz_final',   key: 'quiz_final_a2',  emoji: '🎯', label: 'Quiz Final A2' },
            { type: 'examen_final', key: 'examen_final',   emoji: '🏆', label: 'Examen Final' },
            { type: 'start_level',  key: 'start_b1',       emoji: '🚀', label: 'Start Level B1' },
        ] : []),
    ];
    // [0-6] intro | [7] ★A1 | [8-25] A1 mods | [26] ★A2 | [27..N] A2 mods | [N+1] quiz_final | [N+2] examen_final | [N+3] start_b1

    const completed = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');

    function nodeHtml(n) {
        const done = completed.includes(n.key);
        switch (n.type) {
            case 'milestone':
                return `<div class="msnake-node msnake-node--milestone" data-key="${n.key}"><span class="msnake-label">${n.label}</span></div>`;
            case 'placeholder':
                return `<div class="msnake-node msnake-node--placeholder" data-key="${n.key}" data-ntype="placeholder"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            case 'mod':
                if (n.mod.video_url) {
                    return `<div class="msnake-node msnake-node--play" data-key="${n.key}" data-ntype="mod"><span class="msnake-label">▶ ${trunc(n.mod.title, 18)}</span></div>`;
                }
                return `<div class="msnake-node ${done ? 'msnake-node--done' : 'msnake-node--pending'}" data-key="${n.key}" data-ntype="mod" data-category="${n.mod.category || ''}"><span class="msnake-label">${n.mod.emoji || '📚'} ${trunc(n.mod.title, 18)}</span></div>`;
            case 'quiz_final':
                return `<div class="msnake-node msnake-node--quiz-final ${done ? 'msnake-node--done' : ''}" data-key="${n.key}" data-ntype="quiz_final"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            case 'examen_final': {
                const quizDone = completed.includes('quiz_final_a2');
                return `<div class="msnake-node msnake-node--examen-final ${done ? 'msnake-node--done' : ''} ${!quizDone ? 'msnake-node--locked' : ''}" data-key="${n.key}" data-ntype="examen_final"><span class="msnake-label">${quizDone ? n.emoji : '🔒'} ${n.label}</span></div>`;
            }
            case 'start_level':
                return `<div class="msnake-node msnake-node--start-level" data-key="${n.key}" data-ntype="start_level"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            default:
                // intro_card, pronunciation, flashcard_a0
                return `<div class="msnake-node ${done ? 'msnake-node--done' : 'msnake-node--pending'}" data-key="${n.key}" data-ntype="${n.type}"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
        }
    }

    function hrow(indices) {
        let h = '<div class="msnake-hrow">';
        indices.forEach((idx, i) => {
            h += nodeHtml(allNodes[idx]);
            if (i < indices.length - 1) h += '<div class="msnake-con-h"></div>';
        });
        return h + '</div>';
    }

    function turn(side) {
        return `<div class="msnake-turn msnake-turn--${side}"><div class="msnake-turn-line"></div></div>`;
    }

    function vblock(side, indices, areaContent, areaId) {
        const sm = indices.length === 1 ? ' msnake-area--sm' : '';
        const nodesHtml = indices.map((idx, i) => {
            return nodeHtml(allNodes[idx]) + (i < indices.length - 1 ? '<div class="msnake-vcon"></div>' : '');
        }).join('');
        const vcol = `<div class="msnake-vcol msnake-vcol--${side}">${nodesHtml}</div>`;
        const idAttr = areaId ? ` id="${areaId}"` : '';
        const area = `<div class="msnake-area msnake-area--${side}${sm}"${idAttr}><span class="msnake-area-ph">${areaContent}</span></div>`;
        const inner = side === 'right' ? area + vcol : vcol + area;
        return `<div class="msnake-vblock">${inner}</div>`;
    }

    // ── Serpentina ───────────────────────────────────────────────
    // Fila 1 L→R : [0]──[1]──[2]──[3]
    // Giro der.  : baja a [4]
    // Bloque der.: área izq. | [4][5][6] der.
    // Giro der.  : conecta con [7=★A1]
    // Fila 2     : display [10,9,8,7] (R→L: 7→8→9→10)
    // Giro izq.  : baja a [11]
    // Bloque izq.: [11,12,13] izq. | área der.
    // Giro izq.  : conecta con [14]
    // Fila 3 L→R : [14]──[15]──[16]──[17]
    // Giro der.  : baja a [18]
    // Bloque der.: área izq. | [18,19,20] der.
    // Giro der.  : conecta con [21]
    // Fila 4     : display [24,23,22,21] (R→L: 21→22→23→24)
    // Giro izq.  : baja a [25]
    // Bloque izq.: [25,26=★A2] izq. | área der.
    // Giro izq.  : conecta con [27]
    // Fila 5 L→R : [27]──[28]──[29]──[30]
    // Giro der.  : baja a [31]
    // Bloque der.: área izq. | [31,32,33] der.
    // Giro der.  : conecta con [34]
    // Fila 6     : display [37,36,35,34] (R→L: 34→35→36→37)
    // Giro izq.  : baja a [38]
    // Bloque izq.: [38,39,40] izq. | área der.
    // Giro izq.  : conecta con [41]
    // Fila 7 L→R : [41]──[42]──[43]──[44]
    // Giro der.  : baja a [45]
    // Bloque der.: área izq. | [45,46,47] der.

    let html = '<div class="mision-snake">';

    // ── Intro ─────────────────────────────────────────────────────
    html += hrow([0, 1, 2, 3]);
    html += turn('right');
    html += vblock('right', [4, 5, 6], 'Seleccioná un módulo', 'msnake-area-intro');
    html += turn('right');

    // ── A1 (parte 1) ──────────────────────────────────────────────
    html += hrow([10, 9, 8, 7]);
    html += turn('left');
    html += vblock('left', [11, 12, 13], 'A1 — Ser/Estar · Artículos · Reflexivos', 'msnake-area-a1');
    html += turn('left');
    html += hrow([14, 15, 16, 17]);
    html += turn('right');
    html += vblock('right', [18, 19, 20], 'A1 — Tú/Usted · Género · Gerundio', 'msnake-area-a1b');
    html += turn('right');

    // ── A1 (parte 2) ──────────────────────────────────────────────
    html += hrow([24, 23, 22, 21]);
    html += turn('left');
    if (hasA2) {
        // index 25 = A1 mod[17], index 26 = milestone_A2
        html += vblock('left', [25, 26], 'Fin A1 · ★ Inicio A2', 'msnake-area-a1end');
        html += turn('left');
    } else {
        // Solo A1 mod[17], sin milestone A2
        html += vblock('left', [25], '→ A2 próximamente', 'msnake-area-a1end');
    }

    // ── A2 + Quiz Final + Examen Final (dinámico) ────────────────
    if (hasA2) {
        const A2_BASE  = 7 + 1 + modsA1.length + 1; // intro+milestone_A1+A1mods+milestone_A2
        const A2_END   = A2_BASE + modsA2.length + 3; // +3: quiz_final + examen_final + start_b1
        const A2_AREAS = [
            'A2 — Indefinido · Perfecto',
            'A2 — Imperfecto · Comparación',
            'A2 — Pronombres · Gustar',
            'A2 — Por/Para · Ir a · Modales',
        ];
        let pos = A2_BASE, goingRight = true, areaCount = 0;

        while (pos < A2_END) {
            const rowLen  = Math.min(4, A2_END - pos);
            const rowIdxs = Array.from({ length: rowLen }, (_, i) => pos + i);
            if (!goingRight) rowIdxs.reverse();
            html += hrow(rowIdxs);
            pos += rowLen;
            if (pos >= A2_END) break;

            const vLen  = Math.min(3, A2_END - pos);
            const side  = goingRight ? 'right' : 'left';
            const label = A2_AREAS[areaCount++] || 'A2';
            html += turn(side);
            html += vblock(side, Array.from({ length: vLen }, (_, i) => pos + i), label, `msnake-area-a2-${areaCount}`);
            pos += vLen;
            if (pos >= A2_END) break;

            html += turn(side);
            goingRight = !goingRight;
        }
    }

    html += '</div>';

    grid.innerHTML = html;

    // ── Handlers ────────────────────────────────────────────────

    // Módulos JSON → abrir vista o reproducir video
    grid.querySelectorAll('[data-ntype="mod"]').forEach(el => {
        el.addEventListener('click', () => {
            const key  = el.dataset.key;
            const node = allNodes.find(n => n.key === key);
            if (!node?.mod) return;
            if (node.mod.video_url) {
                _misionPlayVideo(el, node.mod.video_url);
            } else {
                _showMisionA1Module(node.mod, key);
            }
        });
    });

    // Intro card [0] → modal
    grid.querySelector('[data-ntype="intro_card"]')?.addEventListener('click', _misionShowIntroCard);

    // Pronunciación [1] → YouTube en área
    const pronEl = grid.querySelector('[data-ntype="pronunciation"]');
    if (pronEl) {
        pronEl.addEventListener('click', () => {
            const area = document.getElementById('msnake-area-intro');
            if (!area) return;
            if (pronEl.classList.contains('msnake-node--playing')) {
                pronEl.classList.remove('msnake-node--playing');
                pronEl.innerHTML = '<span class="msnake-label">🔊 Pronunciación</span>';
                area.classList.remove('msnake-area--video');
                area.innerHTML = '<span class="msnake-area-ph">Seleccioná un módulo</span>';
            } else {
                pronEl.classList.add('msnake-node--playing');
                pronEl.innerHTML = '<span class="msnake-play-icon">▶</span><span class="msnake-play-label">Playing</span>';
                area.classList.add('msnake-area--video');
                area.innerHTML = `<iframe
                    src="https://www.youtube.com/embed/kJQjXAVEWt0?list=PLv63dFTP4Sjq6knRsZQI-bTnRE38cZZoy&rel=0&modestbranding=1"
                    class="msnake-yt-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    title="Pronunciación en español"></iframe>`;
            }
        });
    }

    // Exercise with Cards [2] → pronunciación (curriculum propio de Misión)
    grid.querySelector('[data-ntype="flashcard_a0"]')?.addEventListener('click', () => {
        localStorage.setItem('ls_mision_return', '1');
        if (typeof MISION_PRON_CURRICULUM !== 'undefined' && typeof startStudySession === 'function') {
            startStudySession(MISION_PRON_CURRICULUM, 0, 'PRON');
        }
    });

    // Quiz Final A2
    grid.querySelector('[data-ntype="quiz_final"]')?.addEventListener('click', () => {
        const exercises = _misionShuffle(_genQuizFinalExercises(modsA2)).slice(0, 20);
        _runGenericQuiz(exercises, {
            total: 20, threshold: 14, key: 'quiz_final_a2',
            onPass: showMainMenu,
            onBack: showMainMenu,
        });
    });

    // Examen Final
    grid.querySelector('[data-ntype="examen_final"]')?.addEventListener('click', () => {
        const steps = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
        if (!steps.includes('quiz_final_a2')) {
            _showMisionToast('Completá el Quiz Final A2 primero 🎯');
            return;
        }
        const exercises = _genExamenFinalExercises(modsA1, modsA2);
        _runGenericQuiz(exercises, {
            total: 40, threshold: 28, key: 'examen_final',
            onPass: () => _showCongratsModal('A2', () => _showB1Hub()),
            onBack: showMainMenu,
        });
    });

    // Start Level B1
    grid.querySelector('[data-ntype="start_level"]')?.addEventListener('click', () => {
        _showB1Hub();
    });

    // Scroll al último módulo visto al volver al hub
    if (_misionLastKey) {
        const target = grid.querySelector(`[data-key="${_misionLastKey}"]`);
        if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        _misionLastKey = null;
    }
}

function _misionPlayVideo(nodeEl, videoUrl) {
    const vblock = nodeEl.closest('.msnake-vblock');
    const area   = vblock?.querySelector('.msnake-area');
    if (!area) return;

    if (nodeEl.classList.contains('msnake-node--playing')) {
        nodeEl.classList.remove('msnake-node--playing');
        area.classList.remove('msnake-area--video');
        area.innerHTML = `<span class="msnake-area-ph">${area.dataset.origPh || ''}</span>`;
        return;
    }

    const videoId = videoUrl.match(/[?&]v=([^&]+)/)?.[1] || videoUrl.split('/').pop();
    area.dataset.origPh = area.querySelector('.msnake-area-ph')?.textContent || '';
    area.classList.add('msnake-area--video');
    area.innerHTML = `<iframe
        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
        class="msnake-yt-iframe"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
    nodeEl.classList.add('msnake-node--playing');
}

function _misionShowIntroCard() {
    const overlay = document.createElement('div');
    overlay.className = 'mision-intro-overlay';
    overlay.innerHTML = `
        <div class="mision-intro-modal">
            <button class="mision-intro-close" aria-label="Cerrar">✕</button>
            <h2 class="mision-intro-title">Introducción</h2>
            <p class="mision-intro-sub">Next we are going to see:</p>
            <ul class="mision-intro-list">
                <li>Pronunciation</li>
                <li>Exercise with Cards</li>
                <li>Greetings Introduction</li>
                <li>Basic Conversation</li>
                <li>Exercise dialog</li>
                <li>Questioning</li>
                <li>Exercise with cards</li>
            </ul>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.mision-intro-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ── Toast helper para Misión ──────────────────────────────────
function _showMisionToast(msg) {
    const t = document.createElement('div');
    t.className = 'mision-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
}

// ── Generador Quiz Final A2 (20 preguntas mezcladas de todo A2) ─
function _genQuizFinalExercises(modsA2) {
    const allExamples = modsA2.flatMap(m => (m.levels || []).flatMap(l => l.examples || []));
    const allTrans = allExamples.map(e => e.translation).filter(Boolean);
    const allOrig  = allExamples.map(e => e.original).filter(Boolean);
    const pool = [];

    allExamples.forEach(ex => {
        if (!ex.original || !ex.translation) return;
        const dT = _misionShuffle(allTrans.filter(x => x !== ex.translation)).slice(0, 3);
        const dO = _misionShuffle(allOrig.filter(x => x !== ex.original)).slice(0, 3);
        if (dT.length === 3) pool.push({
            promptLabel: '¿Qué significa?', prompt: ex.original, correct: ex.translation,
            options: _misionShuffle([ex.translation, ...dT]), note: ex.note || ''
        });
        if (dO.length === 3) pool.push({
            promptLabel: '¿Cómo se dice en español?', prompt: ex.translation, correct: ex.original,
            options: _misionShuffle([ex.original, ...dO]), note: ex.note || ''
        });
    });

    modsA2.forEach(m => {
        const err = m.common_error || {};
        if (err.wrong) pool.push({
            promptLabel: '¿Es correcto decir...?', prompt: `"${err.wrong}"`,
            correct: 'Falso ✗', options: ['Verdadero ✓', 'Falso ✗'], note: err.explanation || ''
        });
    });

    const shuffled = _misionShuffle(pool);
    while (shuffled.length < 20) shuffled.push({ ...pool[shuffled.length % pool.length] });
    return shuffled.slice(0, 20);
}

// ── Generador Examen Final (40 preguntas A1+A2, 3 formatos) ───
function _genExamenFinalExercises(modsA1, modsA2) {
    const allMods     = [...modsA1, ...modsA2];
    const allExamples = allMods.flatMap(m => (m.levels || []).flatMap(l => l.examples || []));
    const allTrans    = allExamples.map(e => e.translation).filter(Boolean);
    const allOrig     = allExamples.map(e => e.original).filter(Boolean);

    const poolMcA = [], poolMcB = [], poolVF = [];

    allExamples.forEach(ex => {
        if (!ex.original || !ex.translation) return;
        const dT = _misionShuffle(allTrans.filter(x => x !== ex.translation)).slice(0, 3);
        const dO = _misionShuffle(allOrig.filter(x => x !== ex.original)).slice(0, 3);
        if (dT.length === 3) poolMcA.push({
            promptLabel: '¿Qué significa?', prompt: ex.original, correct: ex.translation,
            options: _misionShuffle([ex.translation, ...dT]), note: ex.note || ''
        });
        if (dO.length === 3) poolMcB.push({
            promptLabel: '¿Cómo se dice en español?', prompt: ex.translation, correct: ex.original,
            options: _misionShuffle([ex.original, ...dO]), note: ex.note || ''
        });
    });

    allMods.forEach(m => {
        const err = m.common_error || {};
        if (err.wrong) poolVF.push({
            promptLabel: '¿Es correcto decir...?', prompt: `"${err.wrong}"`,
            correct: 'Falso ✗', options: ['Verdadero ✓', 'Falso ✗'], note: err.explanation || ''
        });
        [err.ejemplo_1, err.ejemplo_2].forEach(ej => {
            if (!ej?.trim()) return;
            poolVF.push({
                promptLabel: '¿Es correcto decir...?', prompt: `"${ej.split('(')[0].trim()}"`,
                correct: 'Verdadero ✓', options: ['Verdadero ✓', 'Falso ✗'], note: err.explanation || ''
            });
        });
    });

    const mc_a = _misionShuffle(poolMcA).slice(0, 15);
    const mc_b = _misionShuffle(poolMcB).slice(0, 15);
    const vf   = _misionShuffle(poolVF).slice(0, 10);

    const combined = _misionShuffle([...mc_a, ...mc_b, ...vf]);
    while (combined.length < 40) combined.push({ ...combined[combined.length % combined.length] });
    return combined.slice(0, 40);
}

// ── Runner genérico de quiz (Quiz Final + Examen Final) ────────
function _runGenericQuiz(exercises, { total, threshold, key, onPass, onBack }) {
    let score = 0;

    function renderQ(idx) {
        if (idx >= total) { showResult(); return; }
        const ex  = exercises[idx];
        const pct = Math.round((idx / total) * 100);

        mainContainer.innerHTML = '';
        renderLanguageBar();
        window.scrollTo(0, 0);
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="quiz-wrap">
                <div class="quiz-topbar">
                    <button class="school-back-btn" id="gqBackBtn">← Volver</button>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="quiz-counter">${idx + 1}/${total}</span>
                </div>
                <div class="quiz-body">
                    <p class="quiz-prompt-label">${ex.promptLabel}</p>
                    <div class="quiz-prompt">${ex.prompt}</div>
                    <div class="quiz-options" id="gqOptions">
                        ${ex.options.map(opt => `<button class="quiz-opt" data-opt="${opt}">${opt}</button>`).join('')}
                    </div>
                    <div class="quiz-feedback" id="gqFeedback">
                        <div class="quiz-feedback-result" id="gqFeedbackResult"></div>
                        ${ex.note ? `<div class="quiz-feedback-note">💡 ${ex.note}</div>` : ''}
                        <button class="quiz-next-btn" id="gqNextBtn">${idx < total - 1 ? 'Siguiente →' : 'Ver resultado'}</button>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('gqBackBtn').addEventListener('click', onBack);

        document.querySelectorAll('#gqOptions .quiz-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const isCorrect = btn.dataset.opt === ex.correct;
                if (isCorrect) score++;
                document.querySelectorAll('#gqOptions .quiz-opt').forEach(b => {
                    b.disabled = true;
                    if (b.dataset.opt === ex.correct) b.classList.add('quiz-opt--correct');
                    else if (b === btn) b.classList.add('quiz-opt--wrong');
                });
                const fbResult = document.getElementById('gqFeedbackResult');
                fbResult.textContent = isCorrect ? '✓ ¡Correcto!' : `✗ Correcto: ${ex.correct}`;
                fbResult.className   = `quiz-feedback-result quiz-feedback-result--${isCorrect ? 'ok' : 'err'}`;
                document.getElementById('gqFeedback').classList.add('quiz-feedback--show');
                document.getElementById('gqNextBtn').addEventListener('click', () => renderQ(idx + 1));
            });
        });
    }

    function showResult() {
        const passed = score >= threshold;

        if (passed) {
            const arr = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
            if (!arr.includes(key)) { arr.push(key); localStorage.setItem('ls_mision_steps', JSON.stringify(arr)); }
        }

        mainContainer.innerHTML = '';
        renderLanguageBar();
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="quiz-wrap">
                <div class="quiz-result">
                    <div class="quiz-result-score ${passed ? 'quiz-result-score--pass' : 'quiz-result-score--fail'}">${score}/${total}</div>
                    <p class="quiz-result-msg">${passed ? '¡Muy bien! Aprobaste.' : 'Seguí practicando — ¡casi!'}</p>
                    <div class="quiz-result-bar">
                        <div class="quiz-result-fill" style="width:${Math.round(score / total * 100)}%"></div>
                    </div>
                    <p class="quiz-result-sub">Mínimo para aprobar: ${threshold}/${total}</p>
                    <div class="quiz-result-btns">
                        ${!passed ? `<button class="quiz-retry-btn" id="gqRetryBtn">↺ Intentar de nuevo</button>` : ''}
                        ${passed  ? `<button class="ma1-done-btn" id="gqContinueBtn">Continuar →</button>` : ''}
                        <button class="school-back-btn" id="gqBackModBtn">← Volver</button>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('gqBackModBtn').addEventListener('click', onBack);
        document.getElementById('gqRetryBtn')?.addEventListener('click', () => { score = 0; renderQ(0); });
        document.getElementById('gqContinueBtn')?.addEventListener('click', onPass);
    }

    renderQ(0);
}

// ── Modal de felicitaciones ────────────────────────────────────
function _showCongratsModal(completedLevel, onContinue) {
    const nextLevel = { A2: 'B1', B1: 'B2', B2: 'C1' }[completedLevel] || '';
    const overlay = document.createElement('div');
    overlay.className = 'mision-intro-overlay';
    overlay.innerHTML = `
        <div class="mision-intro-modal" style="text-align:center;gap:1rem">
            <div style="font-size:3.5rem">🎉</div>
            <h2 class="mision-intro-title">¡Felicitaciones!</h2>
            <p style="font-size:1rem;color:var(--text-muted)">Completaste el nivel <strong>${completedLevel}</strong> de Español.</p>
            ${nextLevel ? `<p style="font-size:.9rem;color:var(--text-muted)">Ya desbloqueaste el nivel <strong>${nextLevel}</strong>.</p>
            <button class="ma1-done-btn" id="congratsContinueBtn" style="margin-top:.5rem">Ver nivel ${nextLevel} →</button>` :
            `<p style="font-size:.9rem;color:var(--text-muted)">¡Completaste todos los niveles disponibles!</p>
            <button class="ma1-done-btn" id="congratsContinueBtn" style="margin-top:.5rem">← Volver</button>`}
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('congratsContinueBtn').addEventListener('click', () => {
        overlay.remove();
        onContinue();
    });
}

// ── Pantalla B1 placeholder ────────────────────────────────────
// ── Snake genérico para B1/B2 (sin intro nodes, solo módulos) ─
function _renderSimpleSnake(grid, mods, { levelKey, milestoneLabel, onExamPass, nextLevelLabel, nextLevelFn }) {
    const completed  = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
    const quizKey    = `quiz_final_${levelKey}`;
    const examKey    = `examen_final_${levelKey}`;
    const midQuizKey = `mid_quiz_${levelKey}`;
    const midIdx     = Math.floor(mods.length / 2);

    const allNodes = [
        { type: 'milestone',    key: `milestone_${levelKey}`,  label: milestoneLabel },
        ...mods.slice(0, midIdx).map(m => ({ type: 'mod', key: `mod_${levelKey}_${m.id}`, mod: m })),
        { type: 'mid_quiz',     key: midQuizKey, emoji: '📝',  label: `Quiz ${levelKey.toUpperCase()} ½` },
        ...mods.slice(midIdx).map(m  => ({ type: 'mod', key: `mod_${levelKey}_${m.id}`, mod: m })),
        { type: 'quiz_final',   key: quizKey,    emoji: '🎯',  label: `Quiz Final ${levelKey.toUpperCase()}` },
        { type: 'examen_final', key: examKey,    emoji: '🏆',  label: 'Examen Final' },
        ...(nextLevelFn ? [{ type: 'start_level', key: `start_next_${levelKey}`, emoji: '🚀', label: nextLevelLabel || 'Siguiente Nivel' }] : []),
    ];

    function trunc(str, max) { return str && str.length > max ? str.slice(0, max) + '…' : (str || ''); }

    function nodeHtml(n) {
        const done = completed.includes(n.key);
        switch (n.type) {
            case 'milestone':
                return `<div class="msnake-node msnake-node--milestone"><span class="msnake-label">${n.label}</span></div>`;
            case 'mod':
                return `<div class="msnake-node ${done ? 'msnake-node--done' : 'msnake-node--pending'}" data-key="${n.key}" data-ntype="mod" data-category="${n.mod.category || ''}"><span class="msnake-label">${n.mod.emoji || '📚'} ${trunc(n.mod.title, 18)}</span></div>`;
            case 'mid_quiz':
                return `<div class="msnake-node msnake-node--mid-quiz ${done ? 'msnake-node--done' : ''}" data-key="${n.key}" data-ntype="mid_quiz"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            case 'quiz_final':
                return `<div class="msnake-node msnake-node--quiz-final ${done ? 'msnake-node--done' : ''}" data-key="${n.key}" data-ntype="quiz_final"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            case 'examen_final': {
                const quizDone = completed.includes(quizKey);
                return `<div class="msnake-node msnake-node--examen-final ${done ? 'msnake-node--done' : ''} ${!quizDone ? 'msnake-node--locked' : ''}" data-key="${n.key}" data-ntype="examen_final"><span class="msnake-label">${quizDone ? n.emoji : '🔒'} ${n.label}</span></div>`;
            }
            case 'start_level':
                return `<div class="msnake-node msnake-node--start-level" data-key="${n.key}" data-ntype="start_level"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            default: return '';
        }
    }

    function hrow(indices) {
        let h = '<div class="msnake-hrow">';
        indices.forEach((idx, i) => {
            h += nodeHtml(allNodes[idx]);
            if (i < indices.length - 1) h += '<div class="msnake-con-h"></div>';
        });
        return h + '</div>';
    }
    function turn(side) { return `<div class="msnake-turn msnake-turn--${side}"><div class="msnake-turn-line"></div></div>`; }
    function vblock(side, indices, areaContent, areaId) {
        const nodesHtml = indices.map((idx, i) =>
            nodeHtml(allNodes[idx]) + (i < indices.length - 1 ? '<div class="msnake-vcon"></div>' : '')
        ).join('');
        const vcol  = `<div class="msnake-vcol msnake-vcol--${side}">${nodesHtml}</div>`;
        const idAttr = areaId ? ` id="${areaId}"` : '';
        const area  = `<div class="msnake-area msnake-area--${side}"${idAttr}><span class="msnake-area-ph">${areaContent}</span></div>`;
        return `<div class="msnake-vblock">${side === 'right' ? area + vcol : vcol + area}</div>`;
    }

    const TOTAL = allNodes.length;
    let html = '<div class="mision-snake">';
    let pos = 0, goingRight = true, areaCount = 0;

    while (pos < TOTAL) {
        const rowLen  = Math.min(4, TOTAL - pos);
        const rowIdxs = Array.from({ length: rowLen }, (_, i) => pos + i);
        if (!goingRight) rowIdxs.reverse();
        html += hrow(rowIdxs);
        pos += rowLen;
        if (pos >= TOTAL) break;

        const vLen = Math.min(3, TOTAL - pos);
        const side = goingRight ? 'right' : 'left';
        html += turn(side);
        html += vblock(side, Array.from({ length: vLen }, (_, i) => pos + i),
            levelKey.toUpperCase(), `msnake-area-${levelKey}-${++areaCount}`);
        pos += vLen;
        if (pos >= TOTAL) break;

        html += turn(side);
        goingRight = !goingRight;
    }

    html += '</div>';
    grid.innerHTML = html;

    grid.querySelectorAll('[data-ntype="mod"]').forEach(el => {
        el.addEventListener('click', () => {
            const node = allNodes.find(n => n.key === el.dataset.key);
            if (node?.mod) _showMisionA1Module(node.mod, el.dataset.key);
        });
    });

    grid.querySelector('[data-ntype="mid_quiz"]')?.addEventListener('click', () => {
        const halfMods  = mods.slice(0, midIdx);
        const exercises = _misionShuffle(_genQuizFinalExercises(halfMods)).slice(0, 15);
        _runGenericQuiz(exercises, { total: 15, threshold: 10, key: midQuizKey, onPass: showMainMenu, onBack: showMainMenu });
    });

    grid.querySelector('[data-ntype="quiz_final"]')?.addEventListener('click', () => {
        const exercises = _misionShuffle(_genQuizFinalExercises(mods)).slice(0, 20);
        _runGenericQuiz(exercises, { total: 20, threshold: 14, key: quizKey, onPass: showMainMenu, onBack: showMainMenu });
    });

    grid.querySelector('[data-ntype="examen_final"]')?.addEventListener('click', () => {
        const steps = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
        if (!steps.includes(quizKey)) { _showMisionToast(`Completá el Quiz Final ${levelKey.toUpperCase()} primero 🎯`); return; }
        const exercises = _genExamenFinalExercises([], mods);
        _runGenericQuiz(exercises, { total: 40, threshold: 28, key: examKey, onPass: onExamPass, onBack: showMainMenu });
    });

    if (nextLevelFn) {
        grid.querySelector('[data-ntype="start_level"]')?.addEventListener('click', nextLevelFn);
    }

    // Scroll al último módulo visto al volver al hub
    if (_misionLastKey) {
        const target = grid.querySelector(`[data-key="${_misionLastKey}"]`);
        if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        _misionLastKey = null;
    }
}

// ── Hub nivel B1 ───────────────────────────────────────────────
function _showB1Hub() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="mision-hub">
            <div class="mision-intro-row">
                <button class="school-back-btn" id="b1BackBtn" style="margin:0">← Misión A2</button>
                <p class="mision-intro-text" style="margin:0">Nivel B1 — seguí aprendiendo.</p>
            </div>
            <h3 class="mision-path-title">Dominá el <em>Nivel B1</em> de Español</h3>
            <div class="mision-path-grid" id="misionPathGridB1"></div>
        </div>
    `);
    document.getElementById('b1BackBtn').addEventListener('click', showMainMenu);

    const grid   = document.getElementById('misionPathGridB1');
    const b1file = _MISION_B1_FILES[sourceLang];
    if (!b1file) {
        grid.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)"><p>B1 no disponible para tu idioma aún.</p></div>`;
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:.85rem;padding:1.5rem 0">Cargando módulos…</p>';
    fetch(`${_API_HOST}/misiones/espa%C3%B1ol/espa%C3%B1ol_b1/${encodeURIComponent(b1file)}`)
        .then(r => r.json())
        .then(d => {
            const mods = Array.isArray(d) ? d : [d];
            _renderSimpleSnake(grid, mods, {
                levelKey: 'b1', milestoneLabel: '★ Nivel B1',
                onExamPass: () => _showCongratsModal('B1', () => _showB2Hub()),
                nextLevelLabel: 'Start Level B2', nextLevelFn: _showB2Hub,
            });
        })
        .catch(() => { grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No se pudieron cargar los módulos.</p>'; });
}

// ── Hub nivel B2 ───────────────────────────────────────────────
function _showB2Hub() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="mision-hub">
            <div class="mision-intro-row">
                <button class="school-back-btn" id="b2BackBtn" style="margin:0">← B1</button>
                <p class="mision-intro-text" style="margin:0">Nivel B2 — nivel avanzado.</p>
            </div>
            <h3 class="mision-path-title">Dominá el <em>Nivel B2</em> de Español</h3>
            <div class="mision-path-grid" id="misionPathGridB2"></div>
        </div>
    `);
    document.getElementById('b2BackBtn').addEventListener('click', _showB1Hub);

    const grid   = document.getElementById('misionPathGridB2');
    const b2file = _MISION_B2_FILES[sourceLang];
    if (!b2file) {
        grid.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)"><p>B2 no disponible para tu idioma aún.</p></div>`;
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:.85rem;padding:1.5rem 0">Cargando módulos…</p>';
    fetch(`${_API_HOST}/misiones/espa%C3%B1ol/espa%C3%B1ol_b2/${encodeURIComponent(b2file)}`)
        .then(r => r.json())
        .then(d => {
            const mods = Array.isArray(d) ? d : [d];
            _renderSimpleSnake(grid, mods, {
                levelKey: 'b2', milestoneLabel: '★ Nivel B2',
                onExamPass: () => _showCongratsModal('B2', () => _showC1Hub()),
                nextLevelLabel: 'Start Level C1', nextLevelFn: _showC1Hub,
            });
        })
        .catch(() => { grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No se pudieron cargar los módulos.</p>'; });
}

// ── Hub nivel C1 ───────────────────────────────────────────────
function _showC1Hub() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="mision-hub">
            <div class="mision-intro-row">
                <button class="school-back-btn" id="c1BackBtn" style="margin:0">← B2</button>
                <p class="mision-intro-text" style="margin:0">Nivel C1 — nivel avanzado-superior.</p>
            </div>
            <h3 class="mision-path-title">Dominá el <em>Nivel C1</em> de Español</h3>
            <div class="mision-path-grid" id="misionPathGridC1"></div>
        </div>
    `);
    document.getElementById('c1BackBtn').addEventListener('click', _showB2Hub);

    const grid   = document.getElementById('misionPathGridC1');
    const c1file = _MISION_C1_FILES[sourceLang];
    if (!c1file) {
        grid.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)"><p>C1 no disponible para tu idioma aún.</p></div>`;
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:.85rem;padding:1.5rem 0">Cargando módulos…</p>';
    fetch(`${_API_HOST}/misiones/espa%C3%B1ol/espa%C3%B1ol_c1/${encodeURIComponent(c1file)}`)
        .then(r => r.json())
        .then(d => {
            const mods = Array.isArray(d) ? d : [d];
            _renderSimpleSnake(grid, mods, {
                levelKey: 'c1', milestoneLabel: '★ Nivel C1',
                onExamPass: () => _showCongratsModal('C1', showMainMenu),
            });
        })
        .catch(() => { grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No se pudieron cargar los módulos.</p>'; });
}

// ── Shuffle helper ────────────────────────────────────────────
function _misionShuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Generador de ejercicios (8 por nivel) ─────────────────────
function _genQuizExercises(mod, levelIdx) {
    const level      = mod.levels[levelIdx];
    const allExamples = mod.levels.flatMap(l => l.examples);
    const allTrans   = allExamples.map(e => e.translation);
    const allOrig    = allExamples.map(e => e.original);
    const err        = mod.common_error || {};
    const pool       = [];

    function distract(correct, fullPool, n) {
        return _misionShuffle(fullPool.filter(x => x && x !== correct && x.trim()))
            .slice(0, n);
    }

    // Tipo A: original → traducción
    level.examples.forEach(ex => {
        const d = distract(ex.translation, allTrans, 3);
        if (!d.length) return;
        pool.push({
            promptLabel: '¿Qué significa?',
            prompt: ex.original,
            correct: ex.translation,
            options: _misionShuffle([ex.translation, ...d]),
            note: ex.note || ''
        });
    });

    // Tipo B: traducción → original
    level.examples.forEach(ex => {
        const d = distract(ex.original, allOrig, 3);
        if (!d.length) return;
        pool.push({
            promptLabel: '¿Cómo se dice en español?',
            prompt: ex.translation,
            correct: ex.original,
            options: _misionShuffle([ex.original, ...d]),
            note: ex.note || ''
        });
    });

    // Tipo C: V/F desde common_error
    if (err.wrong) {
        pool.push({
            promptLabel: '¿Es correcto decir...?',
            prompt: `"${err.wrong}"`,
            correct: 'Falso ✗',
            options: ['Verdadero ✓', 'Falso ✗'],
            note: err.explanation || ''
        });
    }
    [err.ejemplo_1, err.ejemplo_2].forEach(ej => {
        if (!ej?.trim()) return;
        pool.push({
            promptLabel: '¿Es correcto decir...?',
            prompt: `"${ej.split('(')[0].trim()}"`,
            correct: 'Verdadero ✓',
            options: ['Verdadero ✓', 'Falso ✗'],
            note: err.explanation || ''
        });
    });

    const shuffled = _misionShuffle(pool);
    // Rellenar hasta 8 repitiendo si hay pocos
    while (shuffled.length < 8) shuffled.push({ ...pool[shuffled.length % pool.length] });
    return shuffled.slice(0, 8);
}

// ── Vista principal del módulo ────────────────────────────────
function _showMisionA1Module(mod, key) {
    _misionLastKey = key;
    mainContainer.innerHTML = '';
    renderLanguageBar();
    window.scrollTo(0, 0);

    const err = mod.common_error || {};
    const errorHtml = err.wrong ? `
        <div class="ma1-section">
            <div class="ma1-section-title">⚠️ Error común</div>
            <div class="ma1-error-wrong">✗ ${err.wrong}</div>
            ${err.ejemplo_1 ? `<div class="ma1-error-correct">✓ ${err.ejemplo_1}</div>` : ''}
            ${err.ejemplo_2 ? `<div class="ma1-error-correct">✓ ${err.ejemplo_2}</div>` : ''}
            ${err.explanation ? `<div class="ma1-error-exp">${err.explanation}</div>` : ''}
        </div>
    ` : '';

    const doneQuizzes = JSON.parse(localStorage.getItem(`ls_mision_quiz_${key}`) || '[]');

    const levelBtns = (mod.levels || []).map((lv, i) => {
        const done = doneQuizzes.includes(i);
        return `<button class="ma1-level-btn${done ? ' ma1-level-btn--done' : ''}" data-lvidx="${i}">
            <span class="ma1-level-btn-num">${done ? '✓' : lv.level}</span>
            <span class="ma1-level-btn-info">
                <span class="ma1-level-btn-label">${lv.label}</span>
                <span class="ma1-level-btn-sub">${lv.translation}</span>
            </span>
            <span class="ma1-level-btn-arrow">→</span>
        </button>`;
    }).join('');

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="ma1-wrap">
            <div class="ma1-topbar">
                <button class="school-back-btn" id="ma1BackBtn">← Volver</button>
            </div>

            <div class="ma1-hero">
                <span class="ma1-emoji">${mod.emoji || '📚'}</span>
                <h2 class="ma1-title">${mod.title}</h2>
            </div>

            <div class="ma1-section">
                <div class="ma1-section-title">🌉 Por qué importa</div>
                <p class="ma1-bridge">${mod.bridge}</p>
            </div>

            <div class="ma1-section ma1-section--rule">
                <div class="ma1-section-title">📌 La regla</div>
                <p class="ma1-rule">${mod.rule}</p>
            </div>

            ${errorHtml}

            <div class="ma1-section">
                <div class="ma1-section-title">🎯 Practicá nivel por nivel — 8 ejercicios cada uno</div>
                <div class="ma1-level-btns">${levelBtns}</div>
            </div>

            <button class="ma1-done-btn" id="ma1DoneBtn">✓ Completado — Volver a Misión</button>
        </div>
    `);

    document.getElementById('ma1BackBtn').addEventListener('click', showMainMenu);
    document.getElementById('ma1DoneBtn').addEventListener('click', () => {
        const arr = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
        if (!arr.includes(key)) { arr.push(key); localStorage.setItem('ls_mision_steps', JSON.stringify(arr)); }
        showMainMenu();
    });

    mainContainer.querySelectorAll('.ma1-level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            _runLevelQuiz(mod, parseInt(btn.dataset.lvidx), key);
        });
    });
}

// ── Quiz de nivel (8 preguntas) ───────────────────────────────
function _runLevelQuiz(mod, levelIdx, key) {
    const exercises = _genQuizExercises(mod, levelIdx);
    const level     = mod.levels[levelIdx];
    let score = 0;

    function renderQ(idx) {
        if (idx >= exercises.length) { showResult(); return; }
        const ex  = exercises[idx];
        const pct = Math.round((idx / exercises.length) * 100);

        mainContainer.innerHTML = '';
        renderLanguageBar();
        window.scrollTo(0, 0);
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="quiz-wrap">
                <div class="quiz-topbar">
                    <button class="school-back-btn" id="quizBackBtn">← Módulo</button>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="quiz-counter">${idx + 1}/8</span>
                </div>

                <div class="quiz-body">
                    <p class="quiz-prompt-label">${ex.promptLabel}</p>
                    <div class="quiz-prompt">
                        ${ex.prompt}
                        <button class="quiz-speak-btn" id="quizSpeakBtn" title="Escuchar">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                    </div>

                    <div class="quiz-options" id="quizOptions">
                        ${ex.options.map(opt => `
                            <button class="quiz-opt" data-opt="${opt}">${opt}</button>
                        `).join('')}
                    </div>

                    <div class="quiz-feedback" id="quizFeedback">
                        <div class="quiz-feedback-result" id="quizFeedbackResult"></div>
                        ${ex.note ? `<div class="quiz-feedback-note">💡 ${ex.note}</div>` : ''}
                        <button class="quiz-next-btn" id="quizNextBtn">
                            ${idx < exercises.length - 1 ? 'Siguiente →' : 'Ver resultado'}
                        </button>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('quizBackBtn').addEventListener('click', () => { speakEdgeStop(); _showMisionA1Module(mod, key); });
        document.getElementById('quizSpeakBtn').addEventListener('click', e => {
            e.stopPropagation();
            // Solo leer frases en español (el original), no traducciones al inglés
            const isSpanish = ex.promptLabel.includes('significa') === false;
            speakEdge(ex.prompt, isSpanish ? 'es' : targetLang || 'es');
        });

        document.querySelectorAll('.quiz-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const isCorrect = btn.dataset.opt === ex.correct;
                if (isCorrect) score++;

                document.querySelectorAll('.quiz-opt').forEach(b => {
                    b.disabled = true;
                    if (b.dataset.opt === ex.correct) b.classList.add('quiz-opt--correct');
                    else if (b === btn) b.classList.add('quiz-opt--wrong');
                });

                const fbResult = document.getElementById('quizFeedbackResult');
                fbResult.textContent = isCorrect ? '✓ ¡Correcto!' : `✗ Correcto: ${ex.correct}`;
                fbResult.className   = `quiz-feedback-result quiz-feedback-result--${isCorrect ? 'ok' : 'err'}`;
                document.getElementById('quizFeedback').classList.add('quiz-feedback--show');
                document.getElementById('quizNextBtn').addEventListener('click', () => renderQ(idx + 1));
            });
        });
    }

    function showResult() {
        const passed = score >= 5;

        if (passed) {
            const lvKey = `ls_mision_quiz_${key}`;
            const done  = JSON.parse(localStorage.getItem(lvKey) || '[]');
            if (!done.includes(levelIdx)) { done.push(levelIdx); localStorage.setItem(lvKey, JSON.stringify(done)); }
        }

        mainContainer.innerHTML = '';
        renderLanguageBar();
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="quiz-wrap">
                <div class="quiz-result">
                    <div class="quiz-result-score ${passed ? 'quiz-result-score--pass' : 'quiz-result-score--fail'}">
                        ${score}/8
                    </div>
                    <p class="quiz-result-msg">${passed ? '¡Muy bien! Nivel superado.' : 'Seguí practicando — ¡casi!'}</p>
                    <div class="quiz-result-bar">
                        <div class="quiz-result-fill" style="width:${Math.round(score/8*100)}%"></div>
                    </div>
                    <p class="quiz-result-sub">Nivel ${level.level}: ${level.label}</p>

                    <div class="quiz-result-btns">
                        ${!passed ? `<button class="quiz-retry-btn" id="quizRetryBtn">↺ Intentar de nuevo</button>` : ''}
                        <button class="ma1-done-btn" id="quizBackModBtn">← Volver al módulo</button>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('quizBackModBtn').addEventListener('click', () => _showMisionA1Module(mod, key));
        document.getElementById('quizRetryBtn')?.addEventListener('click', () => _runLevelQuiz(mod, levelIdx, key));
    }

    renderQ(0);
}

// ─── Menú principal ───────────────────────────────────────────

function showMainMenu() {
    // Sincronizar el selector visual con el modo actual
    const selector = document.getElementById('appModeSelector');
    if (selector) selector.setAttribute('data-mode', appMode);

    mainContainer.innerHTML = '';
    renderLanguageBar();
    const t = currentTranslations;

    // ── Secciones disponibles por modo ────────────────────────
    const inTraduccion  = appMode === 'traduccion';
    const inMision      = appMode === 'mision';
    const inExploracion = appMode === 'exploracion';

    const showTranslator  = inTraduccion;
    const showSchool      = inMision;
    const showFamous      = inExploracion;
    const showPractice    = inTraduccion;
    const showMusicians   = inTraduccion || inExploracion;
    const showImmersion   = inTraduccion || inExploracion;
    const showPlans       = inTraduccion;

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="main-menu">
            ${showTranslator ? (sectionEnabled('translator') ? `
            <div class="mode-card" data-mode="simple">
                <h2>${t.simple_mode}</h2>
                <p>${t.simple_mode_description}</p>
                <p>${t.simple_mode_sub}</p>
                <h4>${t.modos_traduccion}</h4>
            </div>` : sectionMinimized('translator', '🔄', 'Traductor')) : ''}

            ${showSchool ? `
            <div class="mision-hub" id="misionHub">
                <div class="mision-intro-row">
                    <p class="mision-intro-text">Avanzá módulo a módulo con tu tutor IA. Completá cada paso para desbloquear el siguiente.</p>
                    <button class="mision-tutorial-btn" id="misionTutorialBtn">📖 Tutorial</button>
                </div>
                <h3 class="mision-path-title">Da tus primeros pasos en <em>${({"es":"Español","fr":"Français","it":"Italiano","pt":"Português","en":"English","de":"Deutsch"})[targetLang] || targetLang || 'Español'}</em></h3>
                <div class="mision-path-grid" id="misionPathGrid"></div>
            </div>
            <div class="mision-hub-divider"><span>Modo Escuela</span></div>
            ${sectionEnabled('school') ? `
            <div class="mode-card" data-mode="school">
                <h2>${t.modo_escuela}</h2>
                <p>${t.description_modo_escuela}</p>
            </div>` : sectionMinimized('school', '📚', 'Modo Escuela')}` : ''}

            ${showFamous ? (sectionEnabled('famous') ? `
            <div class="famous-carousel-section" id="famousCarouselSection">
                <button class="fc-arrow fc-arrow--left" id="fcPrev" aria-label="Anterior">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div class="fc-track-wrap" id="fcTrackWrap">
                    ${renderFamousMenuCards(['mlk','marilyn','maradona'], t)}
                    <div class="famous-card fc-card" data-person="more"
                         style="--fcard-color:#1c1c2e">
                        <div class="famous-card-overlay"></div>
                        <div class="famous-card-body">
                            <div class="famous-card-emoji">🌟</div>
                            <div class="famous-card-name">${t.titulo_famosos || 'Más famosos'}</div>
                            <div class="famous-card-desc">${t.descripcion_famosos || 'Ver todos'}</div>
                        </div>
                    </div>
                </div>
                <button class="fc-arrow fc-arrow--right" id="fcNext" aria-label="Siguiente">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            </div>
            ` : sectionMinimized('famous', '⭐', 'Famosos')) : ''}

            ${showPractice ? (sectionEnabled('practice') ? `
            <div class="practice-section">
                <h2 class="practice-title">${t.modo_practica || 'Modo Práctica'}</h2>
                <div class="practice-buttons">
                    <div class="practice-btn" id="allFlashcardsMainBtn">
                        <div class="practice-icon">📚</div>
                        <h3>${t.all_flashcards || 'Todos los Flashcards'}</h3>
                        <p>${t.all_flashcards_desc || 'Agrupados por temática'}</p>
                    </div>
                    <div class="practice-btn" id="lastGroupMainBtn">
                        <div class="practice-icon">⏱️</div>
                        <h3>${t.last_group || 'Último grupo usado'}</h3>
                        <p>${t.last_group_desc || 'Continúa donde lo dejaste'}</p>
                    </div>
                    <div class="practice-btn" id="newGroupMainBtn">
                        <div class="practice-icon">➕</div>
                        <h3>${t.new_group || 'Nuevo grupo'}</h3>
                        <p>${t.new_group_desc || 'Crea un grupo y añade tarjetas'}</p>
                    </div>
                </div>
            </div>
            ` : sectionMinimized('practice', '📇', 'Práctica / Flashcards')) : ''}

            ${showMusicians ? (sectionEnabled('musicians') ? `
            <div class="mode-card" data-mode="musicians">
                <h2>${t.modo_musicos_mundo}</h2>
                <p>${t.descripcion_musicos_mundo}</p>
            </div>` : sectionMinimized('musicians', '🎵', 'Músicos y Letras')) : ''}

            ${showImmersion ? (sectionEnabled('immersion') ? `
            <div class="mode-card" data-mode="immersion">
                <h2>🌍</h2>
                <h4>Aprende con...</h4>
                <p>Películas, series y más en el idioma original</p>
            </div>` : sectionMinimized('immersion', '🌍', 'Aprende con...')) : ''}

            ${showPlans ? `
            <div class="mode-card mode-card--plans" data-mode="plans">
                <h2>⭐</h2>
                <h4>Premium 500X</h4>
                <p>Desbloqueá todas las funciones sin límites</p>
            </div>` : ''}
        </div>
    `);

    // Mode cards
    document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            _track('section_open', { section: mode });
            if      (mode === 'simple')    loadSimpleMode();
            else if (mode === 'school')    requireAuth('Modo Escuela',     loadSchoolMode);
            else if (mode === 'practice')  requireAuth('Modo Práctica',    loadPracticeMenu);
            else if (mode === 'musicians') {
                if (typeof MembershipPlan !== 'undefined' && !MembershipPlan.canUseSingleUse('musicians')) {
                    _showUpgradeModal('musicians'); return;
                }
                requireAuth('Música con Letras', () => {
                    if (typeof MembershipPlan !== 'undefined') MembershipPlan.markSingleUse('musicians');
                    loadMusiciansMenu();
                });
            }
            else if (mode === 'immersion') {
                if (typeof MembershipPlan !== 'undefined' && !MembershipPlan.canUseSingleUse('immersion')) {
                    _showUpgradeModal('immersion'); return;
                }
                requireAuth('Aprende con...', () => {
                    if (typeof MembershipPlan !== 'undefined') MembershipPlan.markSingleUse('immersion');
                    loadImmersionSection();
                });
            }
            else if (mode === 'plans') {
                if (typeof loadMembershipSection === 'function') loadMembershipSection();
            }
        });
    });

    // Click en secciones minimizadas → ir a Configuración
    document.querySelectorAll('.main-section-muted').forEach(el => {
        el.addEventListener('click', () => loadSettingsSection());
    });

    // Inicializar carrusel de famosos
    if (typeof initFamousCarousel === 'function') {
        initFamousCarousel(document.getElementById('famousCarouselSection'));
    }

    // Banner de verificación de email
    if (currentUser && currentUser.emailVerified === false) {
        const verifyBanner = document.createElement('div');
        verifyBanner.className = 'smp-verify-banner';
        verifyBanner.id = 'emailVerifyBanner';
        verifyBanner.innerHTML = `
            <span>📧 Verificá tu email para mayor seguridad</span>
            <button class="smp-verify-dismiss" id="verifyBannerDismiss">✕</button>`;
        mainContainer.prepend(verifyBanner);
        document.getElementById('verifyBannerDismiss')?.addEventListener('click', () => verifyBanner.remove());
    }

    // Inicializar hub gamificado (modo Misión)
    _initMisionHub();

    // Práctica desde menú (solo existe en modo Traducción)
    document.getElementById('allFlashcardsMainBtn')?.addEventListener('click', () =>
        requireAuth('Modo Práctica', () => { loadFlashcardData(); showAllGroups(); })
    );
    document.getElementById('lastGroupMainBtn')?.addEventListener('click', () =>
        requireAuth('Flashcards', () => {
            loadFlashcardData();
            if (lastGroupId && flashcardGroups.find(g => g.id === lastGroupId)) {
                showGroupDetail(lastGroupId);
            } else {
                alert(currentTranslations.no_recent_group || 'No hay ningún grupo reciente. Crea uno primero.');
            }
        })
    );
    document.getElementById('newGroupMainBtn')?.addEventListener('click', () =>
        requireAuth('Modo Práctica', createNewGroup)
    );
}

// ─── Modo Simple (traducción) ─────────────────────────────────

function loadSimpleMode() {
    const t = currentTranslations;
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="smp-wrap">

            <!-- Área de entrada -->
            <div class="smp-input-card">

                <!-- Fila superior: toggle AUTO -->
                <div class="smp-top-row">
                    <button class="smp-auto-btn" id="smpAutoBtn" data-on="false">
                        <span class="smp-auto-dot"></span>
                        AUTO
                    </button>
                </div>

                <!-- Textarea + mic + clear -->
                <div class="smp-textarea-wrap">
                    <textarea class="smp-textarea" id="sourceText" rows="3"
                        placeholder="${t.escribe_o_pega || 'Escribe o pega tu frase aquí...'}"></textarea>
                    <div class="smp-textarea-foot">
                        <button class="smp-paste-btn" id="smpPasteBtn" title="Pegar">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                <rect x="8" y="2" width="8" height="4" rx="1"/>
                            </svg>
                            Pegar
                        </button>
                        <button class="smp-mic-btn" id="smpMicBtn" title="Dictar texto">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="2" width="6" height="12" rx="3"/>
                                <path d="M5 10a7 7 0 0 0 14 0"/>
                                <line x1="12" y1="19" x2="12" y2="22"/>
                                <line x1="8" y1="22" x2="16" y2="22"/>
                            </svg>
                        </button>
                        <span class="smp-char-count" id="smpCharCount">0</span>
                        <button class="smp-clear-btn hidden" id="smpClearBtn" title="Limpiar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Barra de controles -->
            <div class="smp-controls-bar">
                <div class="smp-controls-left">
                    <button class="school-back-btn" id="backMenuBtn">← ${t.volver || 'Volver'}</button>
                    <button class="smp-extra-btn smp-syn-inline-btn hidden" id="smpSynonymsBtn">📚 Ver Sinónimos</button>
                </div>
                <div class="smp-controls-right">
                    <select class="school-level-select" id="speedSelect" title="${t.speed_label || 'Velocidad'}">
                        <option value="0.8">${t.speed_lento || 'Lento'}</option>
                        <option value="1.0" selected>${t.speed_normal || 'Normal'}</option>
                        <option value="1.25">1.25×</option>
                        <option value="1.5">${t.speed_rapido || 'Rápido'}</option>
                    </select>
                    <button class="smp-translate-btn" id="translateBtn">
                        ${t.traducir || 'Traducir'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Tira de sinónimos (debajo del controls bar) -->
            <div class="smp-synonyms-strip hidden" id="smpSynonymsResult"></div>

            <!-- Área de resultados -->
            <div class="smp-results-area" id="smpResultsArea">

                <!-- Placeholder -->
                <div class="smp-placeholder" id="smpPlaceholder">
                    <div class="smp-placeholder-icon">🔄</div>
                    <p>${t.simple_mode_description || 'Tu traducción aparecerá aquí'}</p>
                    <span>${t.modos_traduccion || 'Formal · Informal · Neutral'}</span>
                </div>

                <!-- Loading -->
                <div class="smp-loading hidden" id="smpLoading">
                    <div class="school-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>

                <!-- Cards de resultado -->
                <div class="smp-cards hidden" id="smpCards">
                    ${[
                        { id: 'formalResult',   label: t.formal   || 'Formal',   icon: '📌', cls: 'smp-card--formal'   },
                        { id: 'informalResult', label: t.informal || 'Informal', icon: '💬', cls: 'smp-card--informal' },
                        { id: 'neutralResult',  label: t.neutral  || 'Neutral',  icon: '⚖️',  cls: 'smp-card--neutral'  },
                    ].map(v => `
                        <div class="smp-result-card ${v.cls}">
                            <div class="smp-result-header">
                                <span class="smp-result-label">${v.icon} ${v.label}</span>
                                <div class="smp-result-actions">
                                    <!-- Audio -->
                                    <button class="smp-action-btn smp-audio-btn"
                                            data-target="${v.id}" title="Escuchar">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3"/>
                                        </svg>
                                    </button>
                                    <!-- Copiar -->
                                    <button class="smp-action-btn smp-copy-btn"
                                            data-target="${v.id}" title="Copiar">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                    </button>
                                    <!-- Guardar flashcard -->
                                    <button class="smp-action-btn smp-flash-btn"
                                            data-target="${v.id}" title="Guardar flashcard">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                                            <line x1="8" y1="21" x2="16" y2="21"/>
                                            <line x1="12" y1="17" x2="12" y2="21"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p class="smp-result-text" id="${v.id}">—</p>
                        </div>
                    `).join('')}

                    <!-- Análisis léxico -->
                    <div class="smp-lexical-card hidden" id="lexicalResult"></div>

                    <!-- Gate premium (solo visible para usuarios free) -->
                    <div class="smp-premium-gate hidden" id="smpPremiumGate">
                        <span class="smp-gate-lock">🔒</span>
                        <div class="smp-gate-text">
                            <strong>Análisis léxico · Ampliar traducciones</strong>
                            <span>Disponibles en plan Premium</span>
                        </div>
                        <button class="smp-gate-btn" id="smpGateBtn">Ver planes</button>
                    </div>

                    <!-- Ampliar traducciones -->
                    <div class="smp-ampliar-wrap hidden" id="smpAmpiarWrap">
                        <div class="smp-ampliar-trigger">
                            <button class="smp-ampliar-btn" id="smpAmpiarBtn">
                                <span class="smp-ampliar-icon">⊕</span>
                                Ampliar traducciones
                            </button>
                        </div>
                        <div class="smp-ampliar-panel hidden" id="smpAmpiarPanel"></div>
                    </div>

                    <!-- IA in Context -->
                    <div class="smp-extra-actions hidden" id="smpExtraActions">
                        <div class="smp-extra-btns">
                            <button class="smp-extra-btn smp-extra-btn--ia" id="smpContextBtn">💬 IA in Context</button>
                        </div>
                        <div class="smp-context-area hidden" id="smpContextArea">
                            <div class="smp-context-input-row">
                                <textarea class="smp-context-input" id="smpContextInput"
                                    placeholder="Escribe aquí tu pregunta" rows="2"></textarea>
                                <button class="smp-context-send-btn" id="smpContextSendBtn">→</button>
                            </div>
                            <div class="smp-context-response hidden" id="smpContextResponse"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `);

    // ── Refs ──────────────────────────────────────────────────
    const sourceArea    = document.getElementById('sourceText');
    const translateBtn  = document.getElementById('translateBtn');
    const speedSelect   = document.getElementById('speedSelect');
    const charCount     = document.getElementById('smpCharCount');
    const clearBtn      = document.getElementById('smpClearBtn');
    const autoBtn       = document.getElementById('smpAutoBtn');
    const micBtn        = document.getElementById('smpMicBtn');
    const pasteBtn      = document.getElementById('smpPasteBtn');
    const placeholder   = document.getElementById('smpPlaceholder');
    const loadingEl     = document.getElementById('smpLoading');
    const cardsEl       = document.getElementById('smpCards');

    let autoTranslate   = false;
    let autoTimer       = null;
    let isRecording     = false;
    let _lastTranslated = '';
    let _ctxMessages    = [];

    // ── AUTO toggle ───────────────────────────────────────────
    autoBtn.addEventListener('click', () => {
        autoTranslate       = !autoTranslate;
        autoBtn.dataset.on  = autoTranslate;
    });

    // ── Char counter + clear ──────────────────────────────────
    sourceArea.addEventListener('input', () => {
        const len = sourceArea.value.length;
        charCount.textContent = len;
        clearBtn.classList.toggle('hidden', len === 0);
        if (autoTranslate) {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => doTranslate(), 900);
        }
    });

    sourceArea.addEventListener('paste', () => {
        if (autoTranslate) {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => doTranslate(), 400);
        }
    });

    sourceArea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doTranslate(); }
    });

    clearBtn.addEventListener('click', () => {
        sourceArea.value = '';
        charCount.textContent = '0';
        clearBtn.classList.add('hidden');
        showPlaceholder();
        sourceArea.focus();
    });

    // ── Microfono (voz a texto) ───────────────────────────────
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
        micBtn.style.display = 'none'; // navegador no soporta
    } else {
        const recognition  = new SpeechRec();
        const langMap      = { es:'es-ES', en:'en-US', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-BR', zh:'zh-CN', ja:'ja-JP' };
        recognition.lang          = langMap[sourceLang] || 'es-ES';
        recognition.continuous    = false;
        recognition.interimResults = true;

        recognition.onresult = e => {
            const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
            sourceArea.value = transcript;
            charCount.textContent = transcript.length;
            clearBtn.classList.toggle('hidden', transcript.length === 0);
            if (e.results[0].isFinal && autoTranslate) doTranslate();
        };
        recognition.onend  = () => { isRecording = false; micBtn.dataset.recording = 'false'; };
        recognition.onerror = () => { isRecording = false; micBtn.dataset.recording = 'false'; };

        micBtn.addEventListener('click', () => {
            if (isRecording) { recognition.stop(); return; }
            isRecording = true;
            micBtn.dataset.recording = 'true';
            recognition.lang = langMap[sourceLang] || 'es-ES';
            recognition.start();
        });
    }

    // ── Volver ────────────────────────────────────────────────
    document.getElementById('backMenuBtn').addEventListener('click', showMainMenu);

    // ── TTS ───────────────────────────────────────────────────
    function speakText(text) {
        if (!text || text === '—') return;
        const u   = new SpeechSynthesisUtterance(text);
        u.rate    = parseFloat(speedSelect.value);
        const lm  = { es:'es-ES', en:'en-US', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-BR' };
        u.lang    = lm[targetLang] || 'es-ES';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }

    // ── Estado del área de resultados ─────────────────────────
    function showPlaceholder() {
        placeholder.classList.remove('hidden');
        loadingEl.classList.add('hidden');
        cardsEl.classList.add('hidden');
    }
    function showLoading() {
        placeholder.classList.add('hidden');
        loadingEl.classList.remove('hidden');
        cardsEl.classList.add('hidden');
    }
    function showCards() {
        placeholder.classList.add('hidden');
        loadingEl.classList.add('hidden');
        cardsEl.classList.remove('hidden');
    }

    // ── Traducir ──────────────────────────────────────────────
    async function doTranslate() {
        const text = sourceArea.value.trim();
        if (!text) return;
        showLoading();
        translateBtn.disabled = true;

        try {
            const res = await _authFetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ text, sourceLang, targetLang })
            });
            if (res.status === 429) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || '⏱ Demasiadas traducciones. Esperá unos minutos.');
            }
            if (!res.ok) throw new Error(`Error ${res.status} — intentá de nuevo.`);
            const data = await res.json();
            const obj  = JSON.parse(data.translation);

            document.getElementById('formalResult').textContent   = obj.formal   || '—';
            document.getElementById('informalResult').textContent = obj.informal || '—';
            document.getElementById('neutralResult').textContent  = obj.neutral  || '—';
            _track('translation_done', { source_lang: sourceLang, target_lang: targetLang });
            if (typeof misionTrack === 'function') misionTrack('translation');

            // Gate premium
            const gateEl = document.getElementById('smpPremiumGate');
            if (gateEl) gateEl.classList.toggle('hidden', !!obj.lexical);

            // Análisis léxico
            const lexEl = document.getElementById('lexicalResult');

            if (obj.lexical) {
                const exHTML = (obj.lexical.examples || []).map((ex, i) => `
                    <div class="lex-example">
                        <span class="lex-ex-num">${i + 1}</span>
                        <div class="lex-ex-content">
                            <span class="lex-ex-source">${escapeHtml(ex.source)}</span>
                            <span class="lex-ex-arrow">→</span>
                            <span class="lex-ex-target">${escapeHtml(ex.target)}</span>
                        </div>
                    </div>`).join('');
                lexEl.innerHTML = `
                    <div class="lex-header">
                        <span class="lex-type">${escapeHtml(obj.lexical.type || '')}</span>
                        <span class="lex-details">${escapeHtml(obj.lexical.details || '')}</span>
                    </div>
                    <div class="lex-examples-title">📝 Ejemplos de uso</div>
                    <div class="lex-examples">${exHTML}</div>`;
                lexEl.classList.remove('hidden');
            } else {
                lexEl.classList.add('hidden');
            }

            // Ampliar traducciones
            const ampiarWrap  = document.getElementById('smpAmpiarWrap');
            const ampiarPanel = document.getElementById('smpAmpiarPanel');
            const ampiarBtn   = document.getElementById('smpAmpiarBtn');
            const contexts    = obj.contexts || [];
            if (contexts.length > 0) {
                ampiarPanel.innerHTML = contexts.map(c => `
                    <div class="smp-ampliar-card">
                        <div class="smp-ampliar-card-header">
                            <span class="smp-ampliar-label">${escapeHtml(c.label)}</span>
                            <span class="smp-ampliar-note">${escapeHtml(c.note)}</span>
                        </div>
                        <div class="smp-ampliar-translation">${escapeHtml(c.translation)}</div>
                    </div>`).join('');
                ampiarPanel.classList.add('hidden');
                ampiarBtn.innerHTML = '<span class="smp-ampliar-icon">⊕</span> Ampliar traducciones';
                ampiarWrap.classList.remove('hidden');
            } else {
                ampiarWrap.classList.add('hidden');
            }

            showCards();
            _lastTranslated = text;
            _ctxMessages    = [];
            document.getElementById('smpSynonymsBtn').classList.remove('hidden');
            document.getElementById('smpSynonymsResult').classList.add('hidden');
            document.getElementById('smpExtraActions').classList.remove('hidden');
            document.getElementById('smpContextArea').classList.add('hidden');
            document.getElementById('smpContextResponse').classList.add('hidden');
            bindResultActions(text);
        } catch (err) {
            showPlaceholder();
            showToast(`❌ ${err.message}`);
        } finally {
            translateBtn.disabled = false;
        }
    }

    translateBtn.addEventListener('click', doTranslate);

    // ── Gate premium ──────────────────────────────────────────
    document.getElementById('smpGateBtn')?.addEventListener('click', () => {
        if (typeof loadMembershipSection === 'function') loadMembershipSection();
    });

    // ── Ampliar traducciones ──────────────────────────────────
    document.getElementById('smpAmpiarBtn').addEventListener('click', () => {
        const panel = document.getElementById('smpAmpiarPanel');
        const btn   = document.getElementById('smpAmpiarBtn');
        const open  = panel.classList.toggle('hidden');
        btn.innerHTML = open
            ? '<span class="smp-ampliar-icon">⊕</span> Ampliar traducciones'
            : '<span class="smp-ampliar-icon">⊖</span> Ocultar contextos';
    });

    // ── Botón Pegar ───────────────────────────────────────────
    pasteBtn?.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            sourceArea.value = text;
            charCount.textContent = text.length;
            clearBtn.classList.toggle('hidden', text.length === 0);
            sourceArea.focus();
        } catch {
            showToast('No se pudo acceder al portapapeles');
        }
    });

    // ── Ver Sinónimos ─────────────────────────────────────────
    document.getElementById('smpSynonymsBtn').addEventListener('click', async () => {
        const btn      = document.getElementById('smpSynonymsBtn');
        const resultEl = document.getElementById('smpSynonymsResult');
        if (!_lastTranslated) return;
        btn.disabled   = true;
        btn.textContent = 'Cargando…';
        try {
            const res  = await fetch(`${_API_HOST}/synonyms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: _lastTranslated, sourceLang, targetLang })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const srcName = getLanguageName(sourceLang);
            const tgtName = getLanguageName(targetLang);
            resultEl.innerHTML = `
                <div class="syn-group">
                    <span class="syn-lang">${escapeHtml(srcName)}</span>
                    <div class="syn-tags">${(data.source || []).map(s => `<span class="syn-tag">${escapeHtml(s)}</span>`).join('')}</div>
                </div>
                <div class="syn-group">
                    <span class="syn-lang">${escapeHtml(tgtName)}</span>
                    <div class="syn-tags">${(data.target || []).map(s => `<span class="syn-tag syn-tag--target">${escapeHtml(s)}</span>`).join('')}</div>
                </div>`;
            resultEl.classList.remove('hidden');
        } catch {
            showToast('❌ No se pudieron obtener sinónimos');
        } finally {
            btn.disabled    = false;
            btn.textContent = '📚 Ver Sinónimos';
        }
    });

    // ── IA in Context ─────────────────────────────────────────
    document.getElementById('smpContextBtn').addEventListener('click', () => {
        const area = document.getElementById('smpContextArea');
        area.classList.toggle('hidden');
        if (!area.classList.contains('hidden')) {
            document.getElementById('smpContextInput').focus();
        }
    });

    async function sendContextMessage() {
        const input   = document.getElementById('smpContextInput');
        const msg     = input.value.trim();
        const respEl  = document.getElementById('smpContextResponse');
        const sendBtn = document.getElementById('smpContextSendBtn');
        if (!msg || !_lastTranslated) return;

        _ctxMessages.push({ role: 'user', content: msg });
        respEl.innerHTML = '<div class="smp-ctx-loading">…</div>';
        respEl.classList.remove('hidden');
        sendBtn.disabled = true;

        try {
            const res  = await fetch(`${_API_HOST}/context-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: _lastTranslated, messages: _ctxMessages, sourceLang, targetLang })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            _ctxMessages.push({ role: 'assistant', content: data.reply });
            respEl.innerHTML = `<p class="smp-ctx-reply">${escapeHtml(data.reply)}</p>`;
        } catch {
            _ctxMessages.pop();
            respEl.innerHTML = `<p class="smp-ctx-reply smp-ctx-reply--err">❌ Error al obtener respuesta</p>`;
        } finally {
            sendBtn.disabled = false;
        }
    }

    document.getElementById('smpContextSendBtn').addEventListener('click', sendContextMessage);
    document.getElementById('smpContextInput').addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendContextMessage(); }
    });

    // ── Acciones en cada resultado: audio, copiar, flashcard ──
    function bindResultActions(originalText) {
        // Audio
        document.querySelectorAll('.smp-audio-btn').forEach(btn => {
            btn.onclick = () => {
                const el = document.getElementById(btn.dataset.target);
                speakText(el?.textContent);
            };
        });

        // Copiar
        document.querySelectorAll('.smp-copy-btn').forEach(btn => {
            btn.onclick = async () => {
                const el   = document.getElementById(btn.dataset.target);
                const text = el?.textContent || '';
                try {
                    await navigator.clipboard.writeText(text);
                } catch {
                    const ta = document.createElement('textarea');
                    ta.value = text; document.body.appendChild(ta);
                    ta.select(); document.execCommand('copy'); ta.remove();
                }
                const orig = btn.innerHTML;
                btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                setTimeout(() => { btn.innerHTML = orig; }, 1200);
            };
        });

        // Flashcard
        document.querySelectorAll('.smp-flash-btn').forEach(btn => {
            btn.onclick = () => {
                if (!requireAuthForAction('guardar flashcard')) return;
                const el          = document.getElementById(btn.dataset.target);
                const translation = el?.textContent || '';
                const cards       = JSON.parse(localStorage.getItem('flashcards') || '[]');
                cards.push({
                    id:          Date.now() + '-' + Math.random(),
                    word:        originalText,
                    translation,
                    groupId:     lastGroupId || null,
                    dateAdded:   new Date().toISOString(),
                    source:      'translator'
                });
                localStorage.setItem('flashcards', JSON.stringify(cards));
                if (typeof misionTrack === 'function') misionTrack('flashcard');
                const orig = btn.innerHTML;
                btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                setTimeout(() => { btn.innerHTML = orig; }, 1500);
                showToast('📇 Flashcard guardada');
            };
        });
    }
}


// ─── Utilidades globales ──────────────────────────────────────

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration); // ← bug fix: el timeout estaba comentado
}

function getLanguageName(code) {
    const names = {
        en: 'Inglés',  es: 'Español', fr: 'Francés', de: 'Alemán',
        it: 'Italiano', pt: 'Portugués', tr: 'Turco', el: 'Griego',
        zh: 'Chino',  bg: 'Búlgaro', ru: 'Ruso',   ro: 'Rumano', gr: 'Griego'
    };
    return names[code] || code.toUpperCase();
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

// ─── Init ─────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', async () => {
    // Detectar enlace de reset de contraseña (?reset_token=...)
    const _resetToken = new URLSearchParams(window.location.search).get('reset_token');
    if (_resetToken && typeof showResetPasswordForm === 'function') {
        showResetPasswordForm(_resetToken);
    }

    authSeedAdminUser();
    if (typeof initMisionMate === 'function') initMisionMate();
    _initModeSelector();

    // Usuario — primero carga local para mostrar la UI rápido,
    // luego verifica el JWT contra el servidor en background
    const storedUser = authGetCurrentUser();
    if (storedUser) currentUser = storedUser;

    // Verificar sesión en background (no bloquea el render)
    if (storedUser && typeof authVerifySession === 'function') {
        authVerifySession().then(verified => {
            if (verified) {
                currentUser = verified;
                updateAdminButton();
            }
            // Si verified === null, el token expiró — authVerifySession ya limpió la sesión
            // El usuario verá la app como invitado hasta hacer login de nuevo
        });
    }

    // Traducciones e idiomas de UI
    await loadTranslations(appUILanguage);
    applyUILanguage();
    updateMenuLanguageDisplay();
    updateAvatarCircle();

    // Historias (practice.js las usa)
    await loadAllStories();

    // Cargar configuración
    loadSettings();

    // ── Selector de fondo ─────────────────────────────────────

    const bgTrigger = document.getElementById('bgSelectorTrigger');
    const bgCircle  = document.getElementById('bgCircle');

    // Per-theme bg storage keys — format: bgType_{themeId}_type / bgType_{themeId}_value
    function _bgKey(suffix) {
        const themeId = localStorage.getItem('ls_theme') || 'default';
        return `bgType_${themeId}_${suffix}`;
    }

    // Curated gallery images (served statically from /images/bg/)
    const BG_GALLERY = [
        { label: 'Otoño',        path: '/images/bg/otoño.jpg' },
        { label: 'Star Wars 1',  path: '/images/bg/star1.jpg' },
        { label: 'Star Wars 2',  path: '/images/bg/star2.png' },
        { label: 'Star Wars 3',  path: '/images/bg/star3.jpg' },
        { label: 'Star Wars 4',  path: '/images/bg/star4.jpg' },
        { label: 'Star Wars 5',  path: '/images/bg/star5.jpg' },
        { label: 'Star Wars 6',  path: '/images/bg/star6.jpg' },
        { label: 'Harry Potter 1', path: '/images/bg/harry1.jpg' },
        { label: 'Harry Potter 2', path: '/images/bg/harry2.jpg' },
        { label: 'Harry Potter 3', path: '/images/bg/harry3.jpg' },
        { label: 'Harry Potter 4', path: '/images/bg/harry4.jpg' },
        { label: 'One Piece 1',  path: '/images/bg/onepiece.jpg' },
        { label: 'One Piece 2',  path: '/images/bg/onepiece2.jpg' },
        { label: 'Fullmetal 1',  path: '/images/bg/fullmetal1.jpg' },
        { label: 'Fullmetal 2',  path: '/images/bg/fullmetal2.jpg' },
        { label: 'Fullmetal 3',  path: '/images/bg/fullmetal3.jpg' },
        { label: 'Breaking Bad 1', path: '/images/bg/bbad1.jpg' },
        { label: 'Breaking Bad 2', path: '/images/bg/bbad2.jpg' },
        { label: 'EVA 1',        path: '/images/bg/eva1.jpg' },
        { label: 'EVA 2',        path: '/images/bg/eva2.jpg' },
        { label: 'EVA 3',        path: '/images/bg/eva3.jpg' },
        { label: 'Spider-Man 1', path: '/images/bg/sman1.jpg' },
        { label: 'Panorama',     path: '/images/panorama.jpg' },
        { label: 'Urbano',       path: '/images/urbano.jpg' },
    ];

    function _getBgState() {
        return {
            type:  localStorage.getItem(_bgKey('type'))  || 'theme',
            value: localStorage.getItem(_bgKey('value')) || '',
        };
    }

    function _saveBgState(type, value) {
        localStorage.setItem(_bgKey('type'),  type);
        localStorage.setItem(_bgKey('value'), value || '');
    }

    // Convert a CSS hex color to rgba with the given alpha (0-1)
    function _hexToRgba(hex, alpha) {
        hex = (hex || '#ffffff').replace('#', '').trim();
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
    }

    // Apply per-theme opacity overrides for header and card-bg
    function _applyOpacities(themeIdOverride) {
        const tid       = themeIdOverride || localStorage.getItem('ls_theme') || 'forest';
        const cardAlpha = parseFloat(localStorage.getItem(`opacity_${tid}_card`)   || '1');
        const hdrAlpha  = parseFloat(localStorage.getItem(`opacity_${tid}_header`) || '1');
        const root      = document.documentElement;
        root.style.setProperty('--header-alpha', hdrAlpha);
        if (cardAlpha < 0.99) {
            const cardBg = getComputedStyle(root).getPropertyValue('--card-bg').trim();
            if (cardBg && cardBg.startsWith('#')) {
                root.style.setProperty('--card-bg', _hexToRgba(cardBg, cardAlpha));
            }
        }
    }

    // Expose so themes.js can call it after applyTheme()
    window.applyThemeOpacities = _applyOpacities;

    function applyBackground() {
        const { type, value } = _getBgState();
        const themeId = localStorage.getItem('ls_theme') || 'forest';

        if (type === 'image' && value) {
            document.body.style.background           = `url('${value}') center/cover no-repeat fixed`;
            document.body.style.backgroundAttachment = 'fixed';
        } else if (type === 'color' && value) {
            document.body.style.background           = value;
            document.body.style.backgroundImage      = 'none';
            document.body.style.backgroundAttachment = '';
        } else {
            // 'theme' (or null) — let themes.js handle it via applyTheme (includes defaultBg logic)
            const custom = JSON.parse(localStorage.getItem('ls_custom_theme') || 'null');
            if (typeof applyTheme === 'function') applyTheme(themeId, custom);
        }
        _updateBgButton();
        _applyOpacities();
    }

    function _getThemeDefaultBg() {
        const tid = localStorage.getItem('ls_theme') || 'forest';
        return (typeof THEMES !== 'undefined' && THEMES[tid]?.defaultBg) || null;
    }

    function _updateBgButton() {
        const { type, value } = _getBgState();
        const themeId = localStorage.getItem('ls_theme') || 'forest';
        // If no user override, check if theme has a defaultBg to show as thumbnail
        const rawType = localStorage.getItem(_bgKey('type'));
        const defaultBg = _getThemeDefaultBg();
        if (!bgCircle) return;
        if (type === 'image' && value) {
            bgCircle.style.backgroundImage    = `url('${value}')`;
            bgCircle.style.backgroundSize     = 'cover';
            bgCircle.style.backgroundPosition = 'center';
            bgCircle.textContent = '';
            bgCircle.classList.add('bg-circle--has-image');
        } else if (type === 'color' && value) {
            bgCircle.style.backgroundImage = 'none';
            bgCircle.style.background      = value;
            bgCircle.textContent = '';
            bgCircle.classList.remove('bg-circle--has-image');
        } else if (rawType === null && defaultBg) {
            // Theme has a default image — show its thumbnail
            bgCircle.style.backgroundImage    = `url('${defaultBg}')`;
            bgCircle.style.backgroundSize     = 'cover';
            bgCircle.style.backgroundPosition = 'center';
            bgCircle.textContent = '';
            bgCircle.classList.add('bg-circle--has-image');
        } else {
            bgCircle.style.backgroundImage = 'none';
            bgCircle.style.background      = '';
            bgCircle.textContent            = '🎨';
            bgCircle.classList.remove('bg-circle--has-image');
        }
    }

    function _openBgPicker() {
        document.querySelector('.bg-picker-modal')?.remove();

        const { type: curType, value: curValue } = _getBgState();

        // Load current per-theme opacity values
        const _opThemeId  = localStorage.getItem('ls_theme') || 'forest';
        let pendingCardOp = parseFloat(localStorage.getItem(`opacity_${_opThemeId}_card`)   || '1');
        let pendingHdrOp  = parseFloat(localStorage.getItem(`opacity_${_opThemeId}_header`) || '1');
        const _cardOpPct  = Math.round(pendingCardOp * 100);
        const _hdrOpPct   = Math.round(pendingHdrOp  * 100);

        const modal = document.createElement('div');
        modal.className = 'bg-picker-modal';
        modal.innerHTML = `
            <div class="bg-picker-sheet">
                <div class="bg-picker-header">
                    <h3>🎨 Fondo de pantalla</h3>
                    <button class="bg-picker-close" id="bgPickerClose">✕</button>
                </div>
                <div class="bg-picker-body">

                    <div class="bg-picker-tabs">
                        <button class="bg-picker-tab ${curType === 'theme' || (!curType) ? 'active' : ''}" data-tab="theme">🎨 Tema</button>
                        <button class="bg-picker-tab ${curType === 'color' ? 'active' : ''}" data-tab="color">🟦 Color</button>
                        <button class="bg-picker-tab ${curType === 'image' ? 'active' : ''}" data-tab="image">🖼 Galería</button>
                        <button class="bg-picker-tab" data-tab="upload">📁 Subir</button>
                    </div>

                    <div id="bgPickerTabContent" class="bg-picker-tab-content"></div>

                </div>
                <div class="bg-picker-opacity">
                    <div class="bg-picker-opacity-title">🔆 Transparencia</div>
                    <div class="bg-opacity-row">
                        <label>🃏 Cards</label>
                        <div class="bg-opacity-ctrl">
                            <input type="range" id="bgCardOpacity" min="10" max="100" step="5" value="${_cardOpPct}">
                            <span id="bgCardOpacityVal" class="bg-opacity-val">${_cardOpPct}%</span>
                        </div>
                    </div>
                    <div class="bg-opacity-row">
                        <label>📌 Header</label>
                        <div class="bg-opacity-ctrl">
                            <input type="range" id="bgHdrOpacity" min="20" max="100" step="5" value="${_hdrOpPct}">
                            <span id="bgHdrOpacityVal" class="bg-opacity-val">${_hdrOpPct}%</span>
                        </div>
                    </div>
                </div>
                <div class="bg-picker-footer">
                    <button class="bg-picker-reset-btn" id="bgPickerReset">↺ Usar fondo del tema</button>
                    <button class="bg-picker-apply-btn" id="bgPickerApply">Aplicar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        let pendingType  = curType  || 'theme';
        let pendingValue = curValue || '';
        let activeTab    = curType  || 'theme';

        function renderTab(tab) {
            activeTab = tab;
            modal.querySelectorAll('.bg-picker-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            const content = document.getElementById('bgPickerTabContent');

            if (tab === 'theme') {
                content.innerHTML = `
                    <div class="bg-tab-theme">
                        <div class="bg-tab-theme-icon">🎨</div>
                        <p class="bg-tab-theme-text">Usar el fondo definido por el tema activo.</p>
                        <p class="bg-tab-theme-sub">Cada tema tiene su propio color o degradé.</p>
                    </div>`;
                pendingType = 'theme'; pendingValue = '';

            } else if (tab === 'color') {
                const cv = pendingType === 'color' ? pendingValue : '#f5f7fb';
                content.innerHTML = `
                    <div class="bg-tab-color">
                        <label class="bg-tab-color-label">Color de fondo</label>
                        <div class="bg-tab-color-row">
                            <input type="color" id="bgColorInput" value="${cv}">
                            <div class="bg-tab-color-swatch" id="bgColorSwatch" style="background:${cv}"></div>
                            <span id="bgColorHex" class="bg-tab-color-hex">${cv}</span>
                        </div>
                        <div class="bg-tab-color-presets">
                            ${['#f5f7fb','#fff8f0','#f0f9ff','#f1f8f4','#07000f','#0d0d14','#111827','#1e1b2e'].map(c =>
                                `<button class="bg-color-preset" style="background:${c}" data-color="${c}" title="${c}"></button>`
                            ).join('')}
                        </div>
                    </div>`;
                pendingType = 'color'; pendingValue = cv;

                document.getElementById('bgColorInput').addEventListener('input', e => {
                    pendingValue = e.target.value;
                    document.getElementById('bgColorSwatch').style.background = e.target.value;
                    document.getElementById('bgColorHex').textContent = e.target.value;
                });
                content.querySelectorAll('.bg-color-preset').forEach(btn => {
                    btn.addEventListener('click', () => {
                        pendingValue = btn.dataset.color;
                        document.getElementById('bgColorInput').value = pendingValue;
                        document.getElementById('bgColorSwatch').style.background = pendingValue;
                        document.getElementById('bgColorHex').textContent = pendingValue;
                    });
                });

            } else if (tab === 'image') {
                content.innerHTML = `
                    <div class="bg-tab-gallery">
                        <p class="bg-tab-gallery-hint">Toca una imagen para previsualizar</p>
                        <div class="bg-gallery-grid">
                            ${BG_GALLERY.map(img => `
                                <button class="bg-gallery-item ${(pendingType === 'image' && pendingValue === img.path) ? 'selected' : ''}"
                                    data-path="${img.path}" title="${img.label}">
                                    <div class="bg-gallery-thumb" style="background-image:url('${img.path}')"></div>
                                    <span class="bg-gallery-label">${img.label}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>`;
                content.querySelectorAll('.bg-gallery-item').forEach(btn => {
                    btn.addEventListener('click', () => {
                        content.querySelectorAll('.bg-gallery-item').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        pendingType  = 'image';
                        pendingValue = btn.dataset.path;
                        // Live preview on body
                        document.body.style.background = `url('${pendingValue}') center/cover no-repeat fixed`;
                    });
                });

            } else if (tab === 'upload') {
                content.innerHTML = `
                    <div class="bg-tab-upload">
                        <label class="bg-upload-label" id="bgUploadLabel">
                            <div class="bg-upload-icon">📁</div>
                            <div class="bg-upload-text">Hacer clic para subir imagen</div>
                            <div class="bg-upload-sub">JPG, PNG o WebP — máx. 2MB</div>
                            <input type="file" id="bgFileInput" accept="image/jpeg,image/png,image/webp" style="display:none">
                        </label>
                        <div class="bg-upload-preview hidden" id="bgUploadPreview"></div>
                    </div>`;
                document.getElementById('bgFileInput').addEventListener('change', e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) { showToast('⚠️ La imagen supera 2MB'); return; }
                    const reader = new FileReader();
                    reader.onload = ev => {
                        pendingType  = 'image';
                        pendingValue = ev.target.result;
                        const preview = document.getElementById('bgUploadPreview');
                        preview.style.backgroundImage = `url('${pendingValue}')`;
                        preview.classList.remove('hidden');
                        document.body.style.background = `url('${pendingValue}') center/cover no-repeat fixed`;
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

        renderTab(activeTab);

        modal.querySelectorAll('.bg-picker-tab').forEach(btn => {
            btn.addEventListener('click', () => renderTab(btn.dataset.tab));
        });

        // Opacity sliders — live preview
        document.getElementById('bgCardOpacity').addEventListener('input', e => {
            pendingCardOp = parseInt(e.target.value) / 100;
            document.getElementById('bgCardOpacityVal').textContent = e.target.value + '%';
            // Live preview: temporarily set CSS var
            const root = document.documentElement;
            const cardBg = getComputedStyle(root).getPropertyValue('--card-bg').trim();
            if (cardBg && cardBg.startsWith('#')) {
                root.style.setProperty('--card-bg', _hexToRgba(cardBg, pendingCardOp));
            } else if (pendingCardOp < 0.99) {
                root.style.setProperty('--card-bg', `rgba(255,255,255,${pendingCardOp.toFixed(2)})`);
            }
        });
        document.getElementById('bgHdrOpacity').addEventListener('input', e => {
            pendingHdrOp = parseInt(e.target.value) / 100;
            document.getElementById('bgHdrOpacityVal').textContent = e.target.value + '%';
            document.documentElement.style.setProperty('--header-alpha', pendingHdrOp);
        });

        const closeModal = () => {
            // Revert live preview if not applied
            applyBackground();
            modal.remove();
        };

        document.getElementById('bgPickerClose').addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

        document.getElementById('bgPickerReset').addEventListener('click', () => {
            pendingType = 'theme'; pendingValue = '';
            renderTab('theme');
        });

        document.getElementById('bgPickerApply').addEventListener('click', () => {
            _saveBgState(pendingType, pendingValue);
            // Save opacity values per-theme
            localStorage.setItem(`opacity_${_opThemeId}_card`,   pendingCardOp);
            localStorage.setItem(`opacity_${_opThemeId}_header`,  pendingHdrOp);
            applyBackground();
            modal.remove();
        });
    }

    // Wire up trigger
    bgTrigger.addEventListener('click', e => { e.stopPropagation(); _openBgPicker(); });

    // Init
    applyBackground();

    // ── Modal de avatar ───────────────────────────────────────

    const avatarTrigger = document.getElementById('avatarTrigger');
    const avatarModal   = document.getElementById('avatarModal');
    const groupCatsBtn  = document.getElementById('groupCatsBtn');
    const groupDogsBtn  = document.getElementById('groupDogsBtn');
    const gallery       = document.getElementById('avatarStylesGallery');
    let selectedGroup   = currentAvatarGroup;
    let selectedStyle   = currentAvatarStyle;

    function renderGallery() {
        const styles = avatarStyles[selectedGroup];
        gallery.innerHTML = '';
        Object.entries(styles).forEach(([key, style]) => {
            const div = document.createElement('div');
            div.className   = 'avatar-option' + (selectedStyle === key ? ' selected' : '');
            div.dataset.style = key;
            div.innerHTML   = `<div class="avatar-preview">${style.static}</div><div class="avatar-name">${style.name}</div>`;
            div.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                div.classList.add('selected');
                selectedStyle = key;
            });
            gallery.appendChild(div);
        });
    }

    avatarTrigger.addEventListener('click', () => {
        selectedGroup = currentAvatarGroup; selectedStyle = currentAvatarStyle;
        groupCatsBtn.classList.toggle('active', selectedGroup === 'cats');
        groupDogsBtn.classList.toggle('active', selectedGroup === 'dogs');
        renderGallery();
        avatarModal.classList.remove('hidden');
    });
    groupCatsBtn.addEventListener('click', () => {
        selectedGroup = 'cats'; groupCatsBtn.classList.add('active'); groupDogsBtn.classList.remove('active'); renderGallery();
    });
    groupDogsBtn.addEventListener('click', () => {
        selectedGroup = 'dogs'; groupDogsBtn.classList.add('active'); groupCatsBtn.classList.remove('active'); renderGallery();
    });
    document.getElementById('saveAvatarBtn').addEventListener('click', () => {
        currentAvatarGroup = selectedGroup; currentAvatarStyle = selectedStyle;
        localStorage.setItem('avatarGroup', currentAvatarGroup);
        localStorage.setItem('avatarStyle', currentAvatarStyle);
        updateAvatarCircle();
        avatarModal.classList.add('hidden');
    });
    document.getElementById('cancelAvatarBtn').addEventListener('click', () => avatarModal.classList.add('hidden'));

    // ── Dark mode ─────────────────────────────────────────────

    function initDarkMode() {
        const switchEl = document.querySelector('.switch');
        if (!switchEl) return;
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            gsap.set('.toggle-button', { y: 20, scale: 0.6 });
            gsap.set('.moon-mask',     { y: 10, x: -10 });
            gsap.set('.toggle',        { backgroundColor: '#fff' });
            gsap.set('.circle',        { display: 'none' });
        } else {
            gsap.set('.toggle-button', { y: 1,  scale: 0.6 });
            gsap.set('.moon-mask',     { y: 0,  x: 0 });
            gsap.set('.toggle',        { backgroundColor: '#fdb813' });
            gsap.set('.circle',        { display: 'block' });
        }
        let animating = false;
        switchEl.addEventListener('click', () => {
            // Bloquear toggle si el tema activo es siempre oscuro (ej. Eclipse)
            const activeThemeId = localStorage.getItem('ls_theme');
            if (typeof THEMES !== 'undefined' && THEMES[activeThemeId]?.alwaysDark) {
                showToast('🌙 El tema Eclipse es siempre oscuro');
                return;
            }
            if (animating) return;
            animating = true;
            const dark = document.body.classList.contains('dark-mode');
            const tl   = gsap.timeline({ onComplete: () => { animating = false; } });
            if (dark) {
                tl.to('.toggle-button', { y: 0, scale: 0.6, duration: 0.2 })
                  .set('.toggle',  { backgroundColor: '#fdb813' })
                  .set('.circle',  { display: 'block' })
                  .to('.moon-mask',    { y: 0, x: 0,   duration: 0.2 }, 0.2)
                  .to('.toggle-button',{ scale: 0.6,    duration: 0.2 }, 0.2)
                  .call(() => { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); if (window.onDarkModeChange) window.onDarkModeChange(); });
            } else {
                tl.to('.toggle-button', { scale: 0.5, duration: 0.2 })
                  .set('.toggle', { backgroundColor: '#fff' })
                  .set('.circle', { display: 'none' })
                  .to('.moon-mask',    { y: 22, x: -6, duration: 0.2 }, 0.2)
                  .to('.toggle-button',{ y: 20,         duration: 0.2 }, 0.2)
                  .to('.toggle-button',{ scale: 0.7,    duration: 0.2 }, 0.2)
                  .call(() => { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); if (window.onDarkModeChange) window.onDarkModeChange(); });
            }
        });
    }
    initDarkMode();

    // ── Logo → menú principal ─────────────────────────────────

    document.querySelector('.logo-title')?.addEventListener('click', e => {
        e.stopPropagation(); showMainMenu();
    });

    // ── Onboarding / inicio ───────────────────────────────────

    // ── Botón Admin ───────────────────────────────────────────

    function updateAdminButton() {
        const btn = document.getElementById('adminBtn');
        if (!btn) return;
        if (currentUser?.isDev) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }

    document.getElementById('adminBtn')?.addEventListener('click', () => {
        if (typeof loadAdminPanel === 'function') loadAdminPanel();
    });

    updateAdminButton();

    // ─────────────────────────────────────────────────────────

    window.onOnboardingComplete = async user => {
        currentUser = user;
        if (user?.preferredLang && !targetLang) saveLanguages('es', user.preferredLang);
        if (!sourceLang || !targetLang) saveLanguages('en', 'es');

        // Si el usuario tiene idioma de UI guardado en su cuenta, aplicarlo
        loadSettings();
        if (appSettings.uiLanguage && appSettings.uiLanguage !== appUILanguage) {
            appUILanguage = appSettings.uiLanguage;
            localStorage.setItem('appUILanguage', appUILanguage);
            await loadTranslations(appUILanguage);
            updateMenuLanguageDisplay();
        }
        updateAdminButton();
        if (user?.isNew === true && typeof loadMembershipSection === 'function') {
            setTimeout(() => loadMembershipSection(), 300);
        } else {
            showMainMenu();
        }
    };

    document.body.classList.remove('app-initializing');

    if (currentUser) {
        if (!sourceLang || !targetLang) saveLanguages('en', 'es');
        showMainMenu();
    } else if (!_resetToken) {
        showOnboarding();
    }

    // Mobile: cuando el usuario vuelve a la app, restaura el modo en que estaba
    let _mobileLastMode = null;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            _mobileLastMode = appMode;
        } else if (_mobileLastMode && _mobileLastMode !== appMode) {
            appMode = _mobileLastMode;
            const sel = document.getElementById('appModeSelector');
            if (sel) sel.setAttribute('data-mode', appMode);
            showMainMenu();
        }
    });
});
