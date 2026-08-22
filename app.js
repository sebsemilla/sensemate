// app.js — Core: globals, utilidades, auth, menú principal, init
// ===============================================================

// ─── Google AdSense ───────────────────────────────────────────
const _AD_CLIENT       = 'ca-pub-9984132185083141'; // Google AdSense publisher ID
const _AD_SLOT_TRANSLATE = 'XXXXXXXXXX';            // ← slot para la sección Traductor
const _AD_SLOT_FEED      = 'YYYYYYYYYY';            // ← slot para el Feed (in-feed ad)

function _shouldShowAds() {
    const plan = currentUser?.plan;
    return !plan || plan === 'free';
}

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
// Idiomas soportados en la UI
const _supportedLangs = ['es','en','fr','de','it','pt','gn','qu','nah','zh','ja','ru','ar','ko','nl','pl','tr','wo','ha','yo'];

// Mapeo país (ISO 3166-1 alpha-2) → idioma de UI sugerido
const _COUNTRY_UI_LANG = {
    // Español — América Latina
    AR:'es',BO:'es',CL:'es',CO:'es',CR:'es',CU:'es',DO:'es',EC:'es',
    GT:'es',HN:'es',MX:'es',NI:'es',PA:'es',PE:'es',PY:'es',SV:'es',
    UY:'es',VE:'es',PR:'es',
    // Español — España
    ES:'es',
    // Portugués
    BR:'pt',PT:'pt',
    // Francés
    FR:'fr',BE:'fr',
    // Alemán
    DE:'de',AT:'de',CH:'de',
    // Italiano
    IT:'it',
    // Chino
    CN:'zh',TW:'zh',
    // Japonés
    JP:'ja',
    // Coreano
    KR:'ko',
    // Ruso
    RU:'ru',
    // Árabe
    SA:'ar',AE:'ar',EG:'ar',IQ:'ar',SY:'ar',LB:'ar',JO:'ar',
    KW:'ar',QA:'ar',BH:'ar',OM:'ar',YE:'ar',MA:'ar',DZ:'ar',TN:'ar',LY:'ar',
    // Neerlandés
    NL:'nl',
    // Polaco
    PL:'pl',
    // Turco
    TR:'tr',
};

// Determinar idioma de UI: localStorage > navegador > 'es'
const _browserLang = (navigator.language || 'es').split('-')[0].toLowerCase();
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
// En app nativa (Capacitor) siempre usar producción
const _IS_NATIVE = !!(window.Capacitor?.isNativePlatform?.());
const _API_HOST = _IS_NATIVE
    ? 'https://sensemate.app'
    : (window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin);
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

function _langOptionsHtml() {
    return `
        <optgroup label="🌎 América">
            <option value="es">Español</option>
            <option value="en">Inglés (americano)</option>
            <option value="pt">Português</option>
            <option value="fr">Français</option>
            <option value="gn">Guaraní</option>
            <option value="qu">Quechua</option>
            <option value="nah">Náhuatl</option>
            <option value="ht">Kreyòl ayisyen</option>
        </optgroup>
        <optgroup label="🌍 Europa Occidental">
            <option value="en">English (British)</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="nl">Nederlands</option>
            <option value="da">Dansk</option>
            <option value="sv">Svenska</option>
            <option value="no">Norsk</option>
            <option value="fi">Suomi</option>
            <option value="is">Íslenska</option>
            <option value="ga">Gaeilge</option>
            <option value="ca">Català</option>
            <option value="gl">Galego</option>
            <option value="eu">Euskara</option>
            <option value="cy">Cymraeg</option>
        </optgroup>
        <optgroup label="🌍 Europa Oriental">
            <option value="ru">Русский</option>
            <option value="pl">Polski</option>
            <option value="cs">Čeština</option>
            <option value="sk">Slovenčina</option>
            <option value="uk">Українська</option>
            <option value="bg">Български</option>
            <option value="ro">Română</option>
            <option value="hr">Hrvatski</option>
            <option value="sr">Srpski</option>
            <option value="bs">Bosanski</option>
            <option value="sl">Slovenščina</option>
            <option value="mk">Македонски</option>
            <option value="sq">Shqip</option>
            <option value="el">Ελληνικά</option>
            <option value="hu">Magyar</option>
            <option value="lt">Lietuvių</option>
            <option value="lv">Latviešu</option>
            <option value="et">Eesti</option>
            <option value="be">Беларуская</option>
        </optgroup>
        <optgroup label="🕌 Asia Occidental">
            <option value="ar">العربية</option>
            <option value="he">עברית</option>
            <option value="tr">Türkçe</option>
            <option value="fa">فارسی</option>
            <option value="ur">اردو</option>
            <option value="az">Azərbaycan</option>
            <option value="ka">ქართული</option>
            <option value="hy">Հայերեն</option>
            <option value="ku">Kurdî</option>
        </optgroup>
        <optgroup label="🌏 Asia Oriental y del Sur">
            <option value="zh">中文 (Mandarín)</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="vi">Tiếng Việt</option>
            <option value="th">ภาษาไทย</option>
            <option value="id">Bahasa Indonesia</option>
            <option value="ms">Bahasa Melayu</option>
            <option value="tl">Filipino</option>
        </optgroup>
        <optgroup label="🌍 África Subsahariana">
            <option value="sw">Kiswahili</option>
            <option value="yo">Yorùbá</option>
            <option value="ig">Igbo</option>
            <option value="ha">Hausa</option>
            <option value="wo">Wolof</option>
            <option value="zu">isiZulu</option>
            <option value="xh">isiXhosa</option>
            <option value="am">አማርኛ</option>
            <option value="so">Soomaali</option>
            <option value="sn">ChiShona</option>
        </optgroup>
        <optgroup label="🏜️ África del Norte">
            <option value="ar">العربية (Magreb)</option>
            <option value="fr">Français (Magreb)</option>
            <option value="ber">Tamazight</option>
        </optgroup>
        <optgroup label="🌏 Oceanía">
            <option value="en">English (Australian)</option>
            <option value="mi">Te Reo Māori</option>
            <option value="sm">Gagana Sāmoa</option>
            <option value="fj">Na Vosa Vakaviti</option>
            <option value="tpi">Tok Pisin</option>
            <option value="haw">ʻŌlelo Hawaiʻi</option>
        </optgroup>
    `;
}

function renderLanguageBar() {
    const t = currentTranslations;
    document.querySelector('.language-bar')?.remove();
    const opts = _langOptionsHtml();
    mainContainer.insertAdjacentHTML('afterbegin', `
        <div class="language-bar">
            <select id="langBarSource" class="lang-select">${opts}</select>
            <button id="swapLangBtn" class="swap-btn">⇄</button>
            <select id="langBarTarget" class="lang-select">${opts}</select>
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

document.getElementById('profileLink').addEventListener('click',     e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); loadUserProfile(); });
document.getElementById('settingsLink').addEventListener('click',    e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); loadSettingsSection(); });
document.getElementById('complaintsLink').addEventListener('click',  e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); loadComplaintsSection(); });
document.getElementById('suggestionsLink').addEventListener('click', e => { e.preventDefault(); alert('Sugerencias - Próximamente');   dropdownMenu.classList.add('hidden'); });
document.getElementById('themesLink').addEventListener('click',      e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); showThemesPanel(); });
document.getElementById('logoutLink').addEventListener('click', e => { e.preventDefault(); authLogout(); location.reload(); });
document.getElementById('planesMenuLink')?.addEventListener('click', e => { e.preventDefault(); dropdownMenu.classList.add('hidden'); if (typeof loadMembershipSection === 'function') loadMembershipSection(); });
document.getElementById('scanHistoryLink')?.addEventListener('click', e => {
    e.preventDefault();
    dropdownMenu.classList.add('hidden');
    _renderScanHistory();
});
document.getElementById('classroomsMenuLink')?.addEventListener('click', e => {
    e.preventDefault();
    dropdownMenu.classList.add('hidden');
    if (!requireAuthForAction('ver ClassRooms')) return;
    if (typeof _showClassRoomsIntro === 'function') _showClassRoomsIntro();
});

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

// ── URL routing helpers ───────────────────────────────────────
const _TAB_URLS = { exploracion: '/aprende', traduccion: '/', mision: '/', livefeed: '/', classroom: '/' };

function _pushTabState(tab) {
    const url = _TAB_URLS[tab] || '/';
    history.pushState({ tab }, '', url);
}

function _routeFromUrl() {
    const p = window.location.pathname;
    if (p.startsWith('/aprende/')) {
        const id = p.slice('/aprende/'.length);
        appMode = 'exploracion';
        const sel = document.getElementById('appModeSelector');
        if (sel) sel.setAttribute('data-mode', appMode);
        if (typeof loadImmersionSection === 'function') loadImmersionSection();
        // Abrir el contenido específico después de que el browser renderice
        setTimeout(() => {
            if (typeof _getAllImmContent === 'function' && typeof _loadStudyArea === 'function') {
                const item = _getAllImmContent().find(c => c.id === id);
                if (item) _loadStudyArea(document.getElementById('mainContainer'), item);
            }
        }, 80);
    } else if (p === '/aprende') {
        appMode = 'exploracion';
        const sel = document.getElementById('appModeSelector');
        if (sel) sel.setAttribute('data-mode', appMode);
        if (typeof loadImmersionSection === 'function') loadImmersionSection();
    } else {
        showMainMenu();
    }
}

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
            _pushTabState(tab);
            showMainMenu();
            if (tab === 'mision') {
                setTimeout(() => toggleMisionMate(), 100);
            }
            if (tab === 'livefeed') {
                setTimeout(() => _initLiveFeed(), 50);
            }
            if (tab === 'classroom') {
                setTimeout(() => _initClassRoom(), 50);
            }
        });
    });
}

window.addEventListener('popstate', (e) => {
    const p = window.location.pathname;
    if (p.startsWith('/aprende/')) {
        const id = p.slice('/aprende/'.length);
        if (typeof _getAllImmContent === 'function' && typeof _loadStudyArea === 'function') {
            const item = _getAllImmContent().find(c => c.id === id);
            if (item) { _loadStudyArea(document.getElementById('mainContainer'), item); return; }
        }
        if (typeof loadImmersionSection === 'function') loadImmersionSection();
    } else if (p === '/aprende') {
        appMode = 'exploracion';
        const sel = document.getElementById('appModeSelector');
        if (sel) sel.setAttribute('data-mode', appMode);
        if (typeof loadImmersionSection === 'function') loadImmersionSection();
    } else {
        appMode = e.state?.tab || 'traduccion';
        const sel = document.getElementById('appModeSelector');
        if (sel) sel.setAttribute('data-mode', appMode);
        showMainMenu();
    }
});

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

    // Limpiar sección A0, acordeón y tabs anteriores al cambiar de idioma
    document.getElementById('msnake-a0-section')?.remove();
    document.getElementById('msnake-contents-accordion')?.remove();
    document.getElementById('inglesHubTabs')?.remove();

    // Actualizar título superior con el idioma destino actual
    const _LANG_DISPLAY = {
        es:'Español', en:'Inglés', fr:'Francés', pt:'Português', de:'Alemán',
        it:'Italiano', zh:'Chino', ja:'Japonés', ko:'Coreano', ru:'Ruso',
        ar:'Árabe', gn:'Guaraní', qu:'Quechua', nah:'Náhuatl', wo:'Wolof', ha:'Hausa', yo:'Yoruba',
    };
    const titleEl = document.querySelector('.mision-path-title em');
    if (titleEl) titleEl.textContent = _LANG_DISPLAY[targetLang] || targetLang;

    if (targetLang === 'en') { _initInglesHub(); return; }
    if (targetLang === 'es' && _ESPANOL_A1_NUEVOS[sourceLang]) { _initEspanolNuevoHub(); return; }
    if (targetLang !== 'es' && _MISION_LANG_DIRS[targetLang]) { _initGenericLangHub(targetLang); return; }

    if (targetLang !== 'es') {
        grid.innerHTML = `
            <div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)">
                <div style="font-size:2rem;margin-bottom:.75rem">🗺️</div>
                <p style="font-size:.95rem;margin-bottom:.5rem">Idioma destino no disponible aún en Curso.</p>
                <p style="font-size:.85rem">Disponible: <strong>Español · Inglés · Francés · Portugués · Alemán · Italiano · Chino · Japonés · Coreano · Ruso · Árabe</strong></p>
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
    _renderModuleAccordion(grid, [...modsA1, ...modsA2]);
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
        const chatNode = `<div class="msnake-node msnake-node--chat" data-chat-trigger="1"><span class="msnake-label">💬 Hablar con la IA</span></div>`;
        const area = `<div class="msnake-area msnake-area--${side}${sm}"${idAttr}>${chatNode}<span class="msnake-area-ph">${areaContent}</span></div>`;
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

    _misionWireChatTriggers(grid);

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

// ─── Chat embebido en el snake de MisiónMate (reemplaza Modo Escuela) ──
// Se renderiza dentro de un .msnake-area existente (mismo mecanismo que
// usan los embeds de video/pronunciación). `opts.welcome` dispara un primer
// mensaje automático de la IA en el idioma nativo del usuario.

const _MISION_LANG_NAMES = {
    es: 'Español',  en: 'English',   fr: 'Français',  de: 'Deutsch',
    it: 'Italiano', pt: 'Português', gn: 'Guaraní',   qu: 'Quechua',  nah: 'Náhuatl',
    wo: 'Wolof',    ha: 'Hausa',     yo: 'Yorùbá',
};

async function _misionChatRequest(history, mode) {
    const res = await fetch(`${_API_HOST}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: history,
            level: 'A1',
            targetLang,
            mode,
            sourceLangName: _MISION_LANG_NAMES[sourceLang] || sourceLang,
            targetLangName: _MISION_LANG_NAMES[targetLang] || targetLang,
        }),
    });
    if (!res.ok) throw new Error('chat request failed');
    return res.json();
}

function _misionRenderChat(areaEl, opts = {}) {
    const history = [];
    areaEl.classList.add('msnake-area--chat');
    areaEl.innerHTML = `
        <div class="mchat-wrap">
            <div class="mchat-messages"></div>
            <div class="mchat-input-row">
                <textarea class="mchat-input" rows="1" placeholder="Escribí tu mensaje..."></textarea>
                <button class="mchat-send-btn" aria-label="Enviar">➤</button>
            </div>
        </div>`;

    const msgsEl  = areaEl.querySelector('.mchat-messages');
    const inputEl = areaEl.querySelector('.mchat-input');
    const sendBtn = areaEl.querySelector('.mchat-send-btn');

    function addMsg(role, text) {
        const div = document.createElement('div');
        div.className = `mchat-msg mchat-msg--${role}`;
        div.textContent = text;
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function addThinking() {
        const div = document.createElement('div');
        div.className = 'mchat-msg mchat-msg--assistant mchat-thinking';
        div.innerHTML = '<span class="school-dots"><span></span><span></span><span></span></span>';
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return div;
    }

    async function send(userText, mode, hidden = false) {
        if (userText) {
            if (!hidden) addMsg('user', userText);
            history.push({ role: 'user', content: userText });
        }
        const thinkingEl = addThinking();
        try {
            const data = await _misionChatRequest(history, mode);
            thinkingEl.remove();
            addMsg('assistant', data.reply);
            history.push({ role: 'assistant', content: data.reply });
        } catch {
            thinkingEl.remove();
            addMsg('assistant', 'Uy, hubo un error de conexión. Probá de nuevo en un momento.');
        }
    }

    sendBtn.addEventListener('click', () => {
        const val = inputEl.value.trim();
        if (!val) return;
        inputEl.value = '';
        send(val);
    });
    inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    if (opts.welcome) send('(Iniciando la sesión)', 'welcome', true);
}

// Alterna entre el placeholder original del área y el chat embebido
function _misionToggleChat(nodeEl, areaEl) {
    if (nodeEl.classList.contains('msnake-node--playing')) {
        nodeEl.classList.remove('msnake-node--playing');
        areaEl.classList.remove('msnake-area--chat');
        areaEl.innerHTML = `<span class="msnake-area-ph">${areaEl.dataset.origPh || ''}</span>`;
        return;
    }
    areaEl.dataset.origPh = areaEl.querySelector('.msnake-area-ph')?.textContent || areaEl.dataset.origPh || '';
    nodeEl.classList.add('msnake-node--playing');
    _misionRenderChat(areaEl);
}

// Cablea todos los nodos "💬 Hablar con la IA" dentro de un grid de MisiónMate
// (compartido entre los distintos hubs: Español, Inglés, Español-nuevo, Alemán
// piloto). Dispara la bienvenida automática una sola vez por usuario, en el
// primer nodo de chat que encuentre, sin importar el idioma destino activo.
function _misionWireChatTriggers(grid) {
    const triggers = grid.querySelectorAll('[data-chat-trigger="1"]');
    triggers.forEach(nodeEl => {
        nodeEl.addEventListener('click', () => {
            const areaEl = nodeEl.closest('.msnake-area');
            if (areaEl) _misionToggleChat(nodeEl, areaEl);
        });
    });

    if (!localStorage.getItem('ls_mision_welcomed') && triggers.length) {
        localStorage.setItem('ls_mision_welcomed', '1');
        const firstNode = triggers[0];
        const firstArea = firstNode.closest('.msnake-area');
        if (firstArea) {
            firstArea.dataset.origPh = firstArea.querySelector('.msnake-area-ph')?.textContent || '';
            firstNode.classList.add('msnake-node--playing');
            _misionRenderChat(firstArea, { welcome: true });
        }
    }
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

// ── Español A1 nuevo formato (por idioma nativo) ─────────────

const _ESPANOL_A1_NUEVOS = {
    de: { gram: 'de_a1_gramatica.json', func: 'de_a1_funciones_comunicativas.json' },
    en: { gram: 'en_a1_gramatica.json', func: 'en_a1_funciones_comunicativas.json' },
    fr: { gram: 'fr_a1_gramatica.json', func: 'fr_a1_funciones_comunicativas.json' },
    gn: { gram: 'gn_a1_gramatica.json', func: 'gn_a1_funciones_comunicativas.json' },
    it: { gram: 'it_a1_gramatica.json', func: 'it_a1_funciones_comunicativas.json' },
    pt: { gram: 'pt_a1_gramatica.json', func: 'pt_a1_funciones_comunicativas.json' },
};

function _initEspanolNuevoHub(tab = 'curriculum') {
    const grid = document.getElementById('misionPathGrid');
    if (!grid) return;

    const files = _ESPANOL_A1_NUEVOS[sourceLang];
    if (!files) return;

    let tabsEl = document.getElementById('inglesHubTabs');
    if (!tabsEl) {
        grid.insertAdjacentHTML('beforebegin', `
            <div class="ingles-hub-tabs" id="inglesHubTabs">
                <button class="ingles-hub-tab ${tab === 'curriculum' ? 'active' : ''}" data-tab="curriculum">📚 Curriculum A1</button>
                <button class="ingles-hub-tab ${tab === 'contexto' ? 'active' : ''}" data-tab="contexto">🌍 Vocabulario</button>
            </div>`);
        tabsEl = document.getElementById('inglesHubTabs');
        tabsEl.querySelectorAll('.ingles-hub-tab').forEach(btn => {
            btn.addEventListener('click', () => _initEspanolNuevoHub(btn.dataset.tab));
        });
    } else {
        tabsEl.querySelectorAll('.ingles-hub-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
    }

    if (tab === 'contexto') {
        _initVocabCtxTab(grid, 'es', sourceLang);
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0">Cargando módulos…</p>';

    const base = `${_API_HOST}/grupos_tarjetas/espa%C3%B1ol_a1/`;
    const fetchFunc = files.func
        ? fetch(base + files.func).then(r => r.json())
        : Promise.resolve([]);
    Promise.all([
        fetch(base + files.gram).then(r => r.json()),
        fetchFunc,
    ])
        .then(([gram, func]) => {
            const mods = _interleaveInglesA1(gram, func, []);
            _renderSimpleSnake(grid, mods, {
                levelKey:       `es_a1_${sourceLang}`,
                milestoneLabel: '★ Español A1',
                onExamPass:     showMainMenu,
            });
        })
        .catch(() => {
            grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1rem 0">No se pudieron cargar los módulos.</p>';
        });
}

// ── English A1 hub (Inglés) ───────────────────────────────────

const _INGLES_A1_LANGS = {
    da: { gram: 'da_a1_gramatica.json', func: 'da_a1_funciones_comunicativas.json', conv: 'da_a1_conversacion.json' },
    de: { gram: 'de_a1_gramatica.json', func: 'de_a1_funciones_comunicativas.json', conv: 'de_a1_conversacion.json' },
    es: { gram: 'es_a1_gramatica.json', func: 'es_a1_funciones_comunicativas.json', conv: 'es_a1_conversacion.json' },
    is: { gram: 'is_a1_gramatica.json', func: 'is_a1_funciones_comunicativas.json', conv: 'is_a1_conversacion.json' },
    fi: { gram: 'fi_a1_gramatica.json', func: 'fi_a1_funciones_comunicativas.json', conv: 'fi_a1_conversacion.json' },
    fr: { gram: 'fr_a1_gramatica.json', func: 'fr_a1_funciones_comunicativas.json', conv: 'fr_a1_conversacion.json' },
    gn: { gram: 'gn_a1_gramatica.json', func: 'gn_a1_funciones_comunicativas.json', conv: 'gn_a1_conversacion.json' },
    it: { gram: 'it_a1_gramatica.json', func: 'it_a1_funciones_comunicativas.json', conv: 'it_a1_conversacion.json' },
    nl: { gram: 'nl_a1_gramatica.json', func: 'nl_a1_funciones_comunicativas.json', conv: 'nl_a1_conversacion.json' },
    pt: { gram: 'pt_a1_gramatica.json', func: 'pt_a1_funciones_comunicativas.json', conv: 'pt_a1_conversacion.json' },
    sv: { gram: 'sv_a1_gramatica.json', func: 'sv_a1_funciones_comunicativas.json', conv: 'sv_a1_conversacion.json' },
};

// Archivos de Modismos/Phrasal Verbs por idioma nativo — track aparte,
// separado de la alternancia normal Gramática/Funciones/Conversación.
const _INGLES_MODISMOS_LANGS = {
    es: 'es_a1_modismos.json',
};

function _initInglesHub(tab = 'curriculum') {
    const grid = document.getElementById('misionPathGrid');
    if (!grid) return;

    const files = _INGLES_A1_LANGS[sourceLang];
    if (!files) {
        grid.innerHTML = `
            <div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)">
                <div style="font-size:2rem;margin-bottom:.75rem">🌐</div>
                <p style="font-size:.95rem;margin-bottom:.5rem">Contenido disponible para hablantes de:</p>
                <p style="font-size:.85rem"><strong>Español · Francés</strong></p>
            </div>`;
        return;
    }

    // Tabs: Curriculum A1 | Modismos y Phrasal Verbs | Contexto
    const hasModismos = !!_INGLES_MODISMOS_LANGS[sourceLang];
    let tabsEl = document.getElementById('inglesHubTabs');
    if (!tabsEl) {
        grid.insertAdjacentHTML('beforebegin', `
            <div class="ingles-hub-tabs" id="inglesHubTabs">
                <button class="ingles-hub-tab ${tab === 'curriculum' ? 'active' : ''}" data-tab="curriculum">📚 Curriculum A1</button>
                ${hasModismos ? `<button class="ingles-hub-tab ${tab === 'modismos' ? 'active' : ''}" data-tab="modismos">💬 Modismos</button>` : ''}
                <button class="ingles-hub-tab ${tab === 'contexto' ? 'active' : ''}" data-tab="contexto">🌍 Vocabulario</button>
            </div>`);
        tabsEl = document.getElementById('inglesHubTabs');
        tabsEl.querySelectorAll('.ingles-hub-tab').forEach(btn => {
            btn.addEventListener('click', () => _initInglesHub(btn.dataset.tab));
        });
    } else {
        tabsEl.querySelectorAll('.ingles-hub-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
    }

    if (tab === 'contexto') {
        document.getElementById('msnake-a0-section')?.remove();
        _initVocabCtxTab(grid, 'en', sourceLang);
        return;
    }

    if (tab === 'modismos') {
        document.getElementById('msnake-a0-section')?.remove();
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0">Cargando módulos…</p>';
        const file = _INGLES_MODISMOS_LANGS[sourceLang];
        fetch(`${_API_HOST}/grupos_tarjetas/ingles_a1/${file}`)
            .then(r => r.json())
            .then(mods => _renderSimpleSnake(grid, mods, {
                levelKey: 'en_modismos', milestoneLabel: '★ Modismos y Phrasal Verbs',
                onExamPass: showMainMenu,
            }))
            .catch(() => {
                grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1rem 0">No se pudieron cargar los módulos.</p>';
            });
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0">Cargando módulos…</p>';

    const base = `${_API_HOST}/grupos_tarjetas/ingles_a1/`;
    Promise.all([
        fetch(base + files.gram).then(r => r.json()),
        fetch(base + files.func).then(r => r.json()),
        fetch(base + files.conv).then(r => r.json()),
    ])
        .then(([gram, func, conv]) => {
            const mods = _interleaveInglesA1(gram, func, conv);
            _renderModuleAccordion(grid, mods);
            _renderA0Section(grid, 'en', sourceLang);
            _renderInglesA1Snake(grid, mods, { targetCode: 'en', langLabel: 'Inglés', levelKey: `en_a1_${sourceLang}` });
        })
        .catch(() => {
            grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1rem 0">No se pudieron cargar los módulos.</p>';
        });
}

// ── Acordeón "Contenidos del Módulo" — se inserta antes de A0 y la serpentina ────────────
function _renderModuleAccordion(grid, mods) {
    document.getElementById('msnake-contents-accordion')?.remove();
    if (!mods || !mods.length) return;

    const CAT_COLORS = {
        'gramática': '#6366f1', 'grammar': '#6366f1',
        'funciones comunicativas': '#10b981', 'communicative functions': '#10b981',
        'conversación': '#f97316', 'conversation': '#f97316',
        'vocabulario': '#0ea5e9', 'vocabulary': '#0ea5e9',
        'vocabulario contextual': '#0ea5e9', 'contextual vocabulary': '#0ea5e9',
    };
    function catColor(cat) {
        return CAT_COLORS[(cat || '').toLowerCase()] || '#94a3b8';
    }
    function catShort(cat) {
        const c = (cat || '').toLowerCase();
        if (c.includes('gram')) return 'Gram.';
        if (c.includes('func') || c.includes('comunicat')) return 'Func.';
        if (c.includes('conv')) return 'Conv.';
        if (c.includes('vocab') || c.includes('contex')) return 'Vocab.';
        return cat || '';
    }

    const itemsHtml = mods.map((m, i) => {
        const color = catColor(m.category);
        const label = catShort(m.category);
        return `<div class="msacc-item">
            <span class="msacc-num">${i + 1}</span>
            <span class="msacc-cat" style="background:${color}20;color:${color}">${label}</span>
            <span class="msacc-title">${m.title || ''}</span>
        </div>`;
    }).join('');

    const el = document.createElement('div');
    el.id = 'msnake-contents-accordion';
    el.className = 'msacc-wrap';
    el.innerHTML = `
        <button class="msacc-header" aria-expanded="false">
            <span class="msacc-header-label">📋 Contenidos del Módulo</span>
            <span class="msacc-chevron">▾</span>
        </button>
        <div class="msacc-body" style="display:none">
            ${itemsHtml}
        </div>`;

    el.querySelector('.msacc-header').addEventListener('click', function () {
        const body = el.querySelector('.msacc-body');
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : '';
        this.setAttribute('aria-expanded', String(!open));
        el.querySelector('.msacc-chevron').style.transform = open ? '' : 'rotate(180deg)';
    });

    grid.insertAdjacentElement('beforebegin', el);
}

// ── A0 block — se inserta antes de la serpentina A1 en cada hub ───────────────────────────
function _renderA0Section(grid, targetCode, src, videoMods = []) {
    document.getElementById('msnake-a0-section')?.remove();
    if (typeof FLASHCARD_CURRICULUM === 'undefined') return;
    const curr = FLASHCARD_CURRICULUM[`${targetCode}_${src}`] || FLASHCARD_CURRICULUM[targetCode];
    if (!curr || !curr.groups || curr.level !== 'A0') return;

    const states = JSON.parse(localStorage.getItem('ls_card_states') || '{}');
    const groups = curr.groups;
    const videoMod = Array.isArray(videoMods) && videoMods.length ? videoMods[0] : null;

    function trunc(str, max) { return str.length > max ? str.slice(0, max) + '…' : str; }

    function groupNode(g) {
        const total   = g.cards.length;
        const learned = g.cards.filter(c => states[c.id] === 'learned').length;
        const done    = total > 0 && learned === total;
        return `<div class="msnake-node ${done ? 'msnake-node--done' : 'msnake-node--pending'}" data-a0-group="${g.id}">
            <span class="msnake-label">${g.icon} ${trunc(g.name, 14)}</span>
        </div>`;
    }

    // Construir lista de nodos A0: grupos con video inyectado en posición 1
    const allA0 = [...groups];
    if (videoMod) allA0.splice(1, 0, { _isVideo: true, ...videoMod });

    const firstRow  = allA0.slice(0, 4);
    const remainder = allA0.slice(4);

    function nodeHtml(item, isLast) {
        const html = item._isVideo
            ? `<div class="msnake-node msnake-node--play" data-a0-video="${item.videoId}"><span class="msnake-label">▶ ${trunc(item.title, 14)}</span></div>`
            : groupNode(item);
        return html + (isLast ? '' : '<div class="msnake-con-h"></div>');
    }

    let snakeHtml = '<div class="msnake-hrow">' +
        firstRow.map((item, i) => nodeHtml(item, i === firstRow.length - 1)).join('') +
        '</div>';

    if (remainder.length) {
        snakeHtml += `<div class="msnake-turn msnake-turn--right"><div class="msnake-turn-line"></div></div>`;

        const vcol = remainder.map((item, i) =>
            (item._isVideo
                ? `<div class="msnake-node msnake-node--play" data-a0-video="${item.videoId}"><span class="msnake-label">▶ ${trunc(item.title, 14)}</span></div>`
                : groupNode(item)) +
            (i < remainder.length - 1 ? '<div class="msnake-vcon"></div>' : '')
        ).join('');

        snakeHtml += `<div class="msnake-vblock">
            <div class="msnake-area msnake-area--right" id="msnake-a0-area">
                <span class="msnake-area-ph">${curr.levelName || 'Abecedario'}</span>
            </div>
            <div class="msnake-vcol msnake-vcol--right">${vcol}</div>
        </div>`;
    }

    const section = document.createElement('div');
    section.id = 'msnake-a0-section';
    section.style.cssText = 'margin-bottom:1rem';
    section.innerHTML = `
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
            <span style="background:#f97316;color:#fff;font-size:.7rem;font-weight:700;padding:.2rem .5rem;border-radius:6px;letter-spacing:.04em">A0</span>
            <span style="font-weight:600;font-size:.95rem">${curr.levelName || 'Abecedario'}</span>
        </div>
        <div class="mision-snake">${snakeHtml}</div>`;

    section.querySelectorAll('[data-a0-group]').forEach(el => {
        el.addEventListener('click', () => {
            if (typeof showPracticeOverview === 'function') showPracticeOverview('A0');
        });
    });

    section.querySelectorAll('[data-a0-video]').forEach(el => {
        el.addEventListener('click', () => {
            const videoId = el.dataset.a0Video;
            if (!videoId) return;
            const area = section.querySelector('.msnake-area');
            if (!area) return;
            if (el.classList.contains('msnake-node--playing')) {
                el.classList.remove('msnake-node--playing');
                area.innerHTML = `<span class="msnake-area-ph">${curr.levelName || 'Abecedario'}</span>`;
            } else {
                section.querySelectorAll('[data-a0-video]').forEach(v => v.classList.remove('msnake-node--playing'));
                el.classList.add('msnake-node--playing');
                area.innerHTML = `<div class="msnake-video-embed"><iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
            }
        });
    });

    grid.insertAdjacentElement('beforebegin', section);
}

// ── Hub genérico para todos los idiomas generados por generate_missions.js ────────────────

// Directorio de archivos por idioma target (coincide con LANGS[x].dir en generate_missions.js)
const _MISION_LANG_DIRS = {
    es: 'español',   en: 'ingles',   fr: 'frances',
    pt: 'portugues', de: 'aleman',   it: 'italiano',
    zh: 'chino',     ja: 'japones',  ko: 'coreano',
    ru: 'ruso',      ar: 'arabe',
    gn: 'guarani',   qu: 'quechua',  nah: 'nahuatl',
    wo: 'wolof',     ha: 'hausa',    yo: 'yoruba',
};

const _MISION_LANG_LABELS = {
    es: 'Español',   en: 'Inglés',   fr: 'Francés',
    pt: 'Portugués', de: 'Alemán',   it: 'Italiano',
    zh: 'Chino',     ja: 'Japonés',  ko: 'Coreano',
    ru: 'Ruso',      ar: 'Árabe',
    gn: 'Guaraní',   qu: 'Quechua',  nah: 'Náhuatl',
    wo: 'Wolof',     ha: 'Hausa',    yo: 'Yoruba',
};

function _initGenericLangHub(targetCode, tab = 'curriculum') {
    const grid = document.getElementById('misionPathGrid');
    if (!grid) return;

    const dir   = _MISION_LANG_DIRS[targetCode];
    const label = _MISION_LANG_LABELS[targetCode] || targetCode;
    const src   = sourceLang;
    const base  = `${_API_HOST}/grupos_tarjetas/${encodeURIComponent(dir)}_a1/`;

    let tabsEl = document.getElementById('inglesHubTabs');
    if (!tabsEl) {
        grid.insertAdjacentHTML('beforebegin', `
            <div class="ingles-hub-tabs" id="inglesHubTabs">
                <button class="ingles-hub-tab ${tab === 'curriculum' ? 'active' : ''}" data-tab="curriculum">📚 Curriculum A1</button>
                <button class="ingles-hub-tab ${tab === 'contexto' ? 'active' : ''}" data-tab="contexto">🌍 Vocabulario</button>
            </div>`);
        tabsEl = document.getElementById('inglesHubTabs');
        tabsEl.querySelectorAll('.ingles-hub-tab').forEach(btn => {
            btn.addEventListener('click', () => _initGenericLangHub(targetCode, btn.dataset.tab));
        });
    } else {
        tabsEl.querySelectorAll('.ingles-hub-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
    }

    if (tab === 'contexto') {
        document.getElementById('msnake-a0-section')?.remove();
        _initVocabCtxTab(grid, targetCode, src);
        return;
    }

    const safeJson = url => fetch(url).then(r => r.ok ? r.json() : []).catch(() => []);

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0">Cargando módulos…</p>';

    Promise.all([
        safeJson(base + `${src}_a1_gramatica.json`),
        safeJson(base + `${src}_a1_funciones_comunicativas.json`),
        safeJson(base + `${src}_a1_conversacion.json`),
        safeJson(base + 'video_modules.json'),
    ]).then(([gram, func, conv, videoMods]) => {
        let mods = _interleaveInglesA1(gram, func, conv);
        _renderModuleAccordion(grid, mods);
        _renderA0Section(grid, targetCode, src, videoMods);
        if (!mods.length) {
            grid.innerHTML = `
                <div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)">
                    <div style="font-size:2rem;margin-bottom:.75rem">🚧</div>
                    <p style="font-size:.95rem;margin-bottom:.5rem">Contenido de <strong>${label}</strong> próximamente.</p>
                    <p style="font-size:.85rem">Generá los módulos con:<br><code>node generate_missions.js --target=${targetCode} --source=${src} --level=A1</code></p>
                </div>`;
            return;
        }
        _renderInglesA1Snake(grid, mods, {
            levelKey:   `${targetCode}_a1_${src}`,
            langLabel:  label,
            targetCode: targetCode,
        });
    });
}

function _interleaveInglesA1(gram, func, conv) {
    const g = [...gram], f = [...func], c = [...conv];
    const result = [];
    while (g.length || f.length || c.length) {
        if (g.length) result.push(g.shift());
        if (g.length) result.push(g.shift());
        if (f.length) result.push(f.shift());
        if (c.length) result.push(c.shift());
    }
    return result;
}

function _renderInglesA1Snake(grid, mods, opts = {}) {
    function trunc(str, max) { return str && str.length > max ? str.slice(0, max) + '…' : (str || ''); }
    function modEmoji(mod) {
        if (mod.type === 'conversation') return '🗣️';
        const cat = (mod.category || '').toLowerCase();
        if (cat.includes('gram') || cat.includes('gramm')) return '📖';
        return '💬';
    }

    const levelKey = opts.levelKey || 'en_a1';
    const langLabel = opts.langLabel || 'English';
    const completed = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
    const quizKey   = `quiz_final_${levelKey}`;
    const examKey   = `examen_final_${levelKey}`;
    const midIdx    = Math.floor(mods.length / 2);

    const hasB1 = !!_MISION_LANG_DIRS[opts.targetCode || targetLang];
    const allNodes = [
        { type: 'milestone',    key: `milestone_${levelKey}`, label: `★ ${langLabel} A1` },
        ...mods.slice(0, midIdx).map(m => ({ type: 'mod', key: `mod_${levelKey}_${m.id}`, mod: m })),
        { type: 'mid_quiz',     key: `mid_quiz_${levelKey}`, emoji: '📝', label: 'Quiz A1 ½' },
        ...mods.slice(midIdx).map(m  => ({ type: 'mod', key: `mod_${levelKey}_${m.id}`, mod: m })),
        { type: 'quiz_final',   key: quizKey,  emoji: '🎯', label: 'Quiz Final A1' },
        { type: 'examen_final', key: examKey,  emoji: '🏆', label: 'Examen Final' },
        ...(hasB1 ? [{ type: 'start_level', key: `start_b1_${levelKey}`, emoji: '🚀', label: `Start Level B1` }] : []),
    ];

    function nodeHtml(n) {
        const done = completed.includes(n.key);
        switch (n.type) {
            case 'milestone':
                return `<div class="msnake-node msnake-node--milestone"><span class="msnake-label">${n.label}</span></div>`;
            case 'mod': {
                if (n.mod.type === 'video_module') {
                    return `<div class="msnake-node msnake-node--play ${done ? 'msnake-node--done' : ''}" data-key="${n.key}" data-ntype="video_module" data-videoid="${n.mod.videoId}"><span class="msnake-label">▶ ${trunc(n.mod.title, 18)}</span></div>`;
                }
                const cls = done ? 'msnake-node--done' : 'msnake-node--pending';
                return `<div class="msnake-node ${cls}" data-key="${n.key}" data-ntype="mod" data-category="${n.mod.category || ''}" data-modtype="${n.mod.type || 'concept'}"><span class="msnake-label">${modEmoji(n.mod)} ${trunc(n.mod.title, 18)}</span></div>`;
            }
            case 'mid_quiz':
                return `<div class="msnake-node msnake-node--mid-quiz ${done ? 'msnake-node--done' : ''}" data-key="${n.key}" data-ntype="mid_quiz"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            case 'quiz_final':
                return `<div class="msnake-node msnake-node--quiz-final ${done ? 'msnake-node--done' : ''}" data-key="${n.key}" data-ntype="quiz_final"><span class="msnake-label">${n.emoji} ${n.label}</span></div>`;
            case 'examen_final': {
                const quizDone = completed.includes(quizKey);
                return `<div class="msnake-node msnake-node--examen-final ${done ? 'msnake-node--done' : ''} ${!quizDone ? 'msnake-node--locked' : ''}" data-key="${n.key}" data-ntype="examen_final"><span class="msnake-label">${quizDone ? n.emoji : '🔒'} ${n.label}</span></div>`;
            }
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
        const vcol   = `<div class="msnake-vcol msnake-vcol--${side}">${nodesHtml}</div>`;
        const idAttr = areaId ? ` id="${areaId}"` : '';
        const chatNode = `<div class="msnake-node msnake-node--chat" data-chat-trigger="1"><span class="msnake-label">💬 Hablar con la IA</span></div>`;
        const area   = `<div class="msnake-area msnake-area--${side}"${idAttr}>${chatNode}<span class="msnake-area-ph">${areaContent}</span></div>`;
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
        const vLen  = Math.min(3, TOTAL - pos);
        const side  = goingRight ? 'right' : 'left';
        const label = areaCount % 2 === 0 ? `${langLabel} A1 — Grammar & Functions` : `${langLabel} A1 — Conversation`;
        html += turn(side);
        html += vblock(side, Array.from({ length: vLen }, (_, i) => pos + i), label, `msnake-area-${levelKey}-${++areaCount}`);
        pos += vLen;
        if (pos >= TOTAL) break;
        html += turn(side);
        goingRight = !goingRight;
    }
    html += '</div>';
    grid.innerHTML = html;

    // Área de chat — guardamos el HTML original para restaurarlo
    const _areaOriginals = new Map();
    grid.querySelectorAll('.msnake-area').forEach(area => {
        _areaOriginals.set(area.id || area, area.innerHTML);
    });
    function _restoreAllAreas() {
        grid.querySelectorAll('.msnake-area').forEach(area => {
            const orig = _areaOriginals.get(area.id || area);
            if (orig !== undefined) area.innerHTML = orig;
        });
        _misionWireChatTriggers(grid);
    }

    grid.querySelectorAll('[data-ntype="video_module"]').forEach(el => {
        el.addEventListener('click', () => {
            const videoId = el.dataset.videoid;
            if (!videoId) return;
            // Marcar como completado
            const key = el.dataset.key;
            const steps = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
            if (!steps.includes(key)) { steps.push(key); localStorage.setItem('ls_mision_steps', JSON.stringify(steps)); }
            el.classList.add('msnake-node--done');
            // Mostrar en el área más cercana (primera disponible)
            _restoreAllAreas();
            const area = grid.querySelector('.msnake-area');
            if (area) {
                area.innerHTML = `
                    <div class="msnake-video-embed">
                        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>`;
            }
        });
    });

    grid.querySelectorAll('[data-ntype="mod"]').forEach(el => {
        el.addEventListener('click', () => {
            _restoreAllAreas();
            const node = allNodes.find(n => n.key === el.dataset.key);
            if (!node?.mod) return;
            if (node.mod.type === 'conversation') {
                _showInglesConvModule(node.mod, el.dataset.key);
            } else {
                _showMisionA1Module(node.mod, el.dataset.key);
            }
        });
    });

    const halfMods = mods.filter(m => m.type !== 'conversation');
    grid.querySelector('[data-ntype="mid_quiz"]')?.addEventListener('click', () => {
        const exercises = _misionShuffle(_genQuizFinalExercises(halfMods.slice(0, Math.floor(halfMods.length / 2)))).slice(0, 15);
        _runGenericQuiz(exercises, { total: 15, threshold: 10, key: `mid_quiz_${levelKey}`, onPass: showMainMenu, onBack: showMainMenu });
    });

    grid.querySelector('[data-ntype="quiz_final"]')?.addEventListener('click', () => {
        const exercises = _misionShuffle(_genQuizFinalExercises(mods.filter(m => m.type !== 'conversation'))).slice(0, 20);
        _runGenericQuiz(exercises, { total: 20, threshold: 14, key: quizKey, onPass: showMainMenu, onBack: showMainMenu });
    });

    const tc = opts.targetCode || targetLang;
    const goB1 = () => _initGenericLangLevelHub(tc, 'b1', {
        prevLabel: `← ${langLabel} A1`,
        prevFn: showMainMenu,
        nextLevel: 'b2',
        nextFn: () => _initGenericLangLevelHub(tc, 'b2', {
            prevLabel: `← ${langLabel} B1`,
            prevFn: () => _initGenericLangLevelHub(tc, 'b1', { prevLabel: `← ${langLabel} A1`, prevFn: showMainMenu }),
            nextLevel: 'c1',
            nextFn: () => _initGenericLangLevelHub(tc, 'c1', {
                prevLabel: `← ${langLabel} B2`,
                prevFn: () => _initGenericLangLevelHub(tc, 'b2', { prevLabel: `← ${langLabel} B1`, prevFn: showMainMenu }),
            }),
        }),
    });

    grid.querySelector('[data-ntype="examen_final"]')?.addEventListener('click', () => {
        const steps = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
        if (!steps.includes(quizKey)) { _showMisionToast('Completá el Quiz Final A1 primero 🎯'); return; }
        const exercises = _genExamenFinalExercises([], mods.filter(m => m.type !== 'conversation'));
        _runGenericQuiz(exercises, { total: 40, threshold: 28, key: examKey, onPass: hasB1 ? goB1 : showMainMenu, onBack: showMainMenu });
    });

    grid.querySelector('[data-ntype="start_level"]')?.addEventListener('click', goB1);

    _misionWireChatTriggers(grid);

    if (_misionLastKey) {
        const target = grid.querySelector(`[data-key="${_misionLastKey}"]`);
        if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        _misionLastKey = null;
    }
}

function _showInglesConvModule(mod, key) {
    _misionLastKey = key;
    mainContainer.innerHTML = '';
    renderLanguageBar();
    window.scrollTo(0, 0);

    const conv    = mod.conversation || {};
    const vocab   = conv.vocabulary  || [];
    const dialogue = conv.dialogue   || [];

    const vocabHtml = vocab.length ? `
        <div class="ma1-section">
            <div class="ma1-section-title">📋 Vocabulario clave</div>
            <table class="ma1-conv-vocab">
                <thead><tr><th>Verbo</th><th>Forma</th><th>Significado</th></tr></thead>
                <tbody>${vocab.map(v => `<tr><td><strong>${v.verb || ''}</strong></td><td>${v.form || ''}</td><td>${v.meaning || ''}</td></tr>`).join('')}</tbody>
            </table>
        </div>` : '';

    const dialogueHtml = dialogue.map((line, i) => `
        <div class="ma1-conv-bubble ma1-conv-bubble--${i % 2 === 0 ? 'a' : 'b'}">
            <div class="ma1-conv-speaker">${line.speaker || ''}</div>
            <div class="ma1-conv-text">
                ${line.text || ''}
                <button class="ma1-conv-audio-btn" data-speak="${(line.text || '').replace(/"/g, '&quot;')}">🔊</button>
            </div>
            <div class="ma1-conv-translation">${line.translation || ''}</div>
            ${line.note ? `<div class="ma1-conv-note">💡 ${line.note}</div>` : ''}
        </div>`).join('');

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="ma1-wrap">
            <div class="ma1-topbar">
                <button class="school-back-btn" id="ma1BackBtn">← Volver</button>
            </div>
            <div class="ma1-hero">
                <span class="ma1-emoji">🗣️</span>
                <h2 class="ma1-title">${mod.title}</h2>
                <span class="ma1-cat">${mod.category || ''}</span>
            </div>
            ${vocabHtml}
            <div class="ma1-section">
                <div class="ma1-section-title">💬 Diálogo</div>
                <div class="ma1-conv-dialogue">${dialogueHtml}</div>
            </div>
            <div class="ma1-section ej01-section">
                <div class="ma1-section-title">🏋️ Ejercicios</div>
                <div class="ej01-btns">
                    <button class="ej01-btn" id="ej01Btn1">📝 Ejercicio 1 — Opción múltiple</button>
                    <button class="ej01-btn" id="ej01Btn2">✍️ Ejercicio 2 — Completar</button>
                </div>
                <div class="ej01-panel" id="ej01Panel1"></div>
                <div class="ej01-panel" id="ej01Panel2"></div>
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

    mainContainer.querySelectorAll('.ma1-conv-audio-btn').forEach(btn => {
        btn.addEventListener('click', () => _speakEn(btn.dataset.speak));
    });

    const items = _ej01BuildItems(conv);
    const btn1  = document.getElementById('ej01Btn1');
    const btn2  = document.getElementById('ej01Btn2');
    const pan1  = document.getElementById('ej01Panel1');
    const pan2  = document.getElementById('ej01Panel2');

    btn1.addEventListener('click', () => {
        if (btn1.classList.contains('ej01-btn--done')) return;
        const open = pan1.classList.toggle('ej01-panel--active');
        pan2.classList.remove('ej01-panel--active');
        if (open && !pan1.dataset.rendered) {
            _ej01ShowEx1(items, pan1, btn1);
            pan1.dataset.rendered = '1';
        }
    });
    btn2.addEventListener('click', () => {
        if (btn2.classList.contains('ej01-btn--done')) return;
        const open = pan2.classList.toggle('ej01-panel--active');
        pan1.classList.remove('ej01-panel--active');
        if (open && !pan2.dataset.rendered) {
            _ej01ShowEx2(items, pan2, btn2);
            pan2.dataset.rendered = '1';
        }
    });
}

function _speakEn(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.85;
    speechSynthesis.speak(utt);
}

// ── add_ejercicios01 ──────────────────────────────────────────

function _ej01BuildItems(conv) {
    const vocab    = conv.vocabulary || [];
    const dialogue = conv.dialogue   || [];
    const usedLines = new Set();
    const items = [];
    const allForms = vocab.flatMap(v => v.form.split('/').map(f => f.trim()));

    for (const v of vocab) {
        const forms = v.form.split('/').map(f => f.trim());
        for (const line of dialogue) {
            if (usedLines.has(line.text)) continue;
            let matched = null, blanked = null;
            for (const form of forms) {
                const regex = new RegExp(`\\b(${form})\\b`, 'i');
                const m = line.text.match(regex);
                if (m) { matched = m[1]; blanked = line.text.replace(regex, '___'); break; }
            }
            if (!matched) continue;
            const distractors = _misionShuffle(
                allForms.filter(f => f.toLowerCase() !== matched.toLowerCase())
            ).slice(0, 3);
            while (distractors.length < 3) distractors.push(['do', 'have', 'get'][distractors.length] || 'make');
            items.push({
                original:    line.text,
                blanked,
                correct:     matched,
                infinitive:  v.verb,
                speaker:     line.speaker  || '',
                translation: line.translation || '',
                options:     _misionShuffle([matched, ...distractors]),
            });
            usedLines.add(line.text);
            break;
        }
    }
    return items;
}

function _ej01ShowEx1(items, panel, btn) {
    if (!items.length) { panel.innerHTML = '<p class="ej01-empty">No hay suficientes ítems para este ejercicio.</p>'; return; }
    let current = 0, correct = 0;

    function renderItem() {
        const it = items[current];
        panel.innerHTML = `
            <div class="ej01-progress">${current + 1} / ${items.length}</div>
            <div class="ej01-card">
                <div class="ej01-speaker">${it.speaker}</div>
                <div class="ej01-blanked-row">
                    <span class="ej01-blanked">${it.blanked}</span>
                    <button class="ej01-audio-btn" id="ej01AudioBtn">🔊</button>
                </div>
                <div class="ej01-options" id="ej01Opts">
                    ${it.options.map(o => `<button class="ej01-opt" data-opt="${o}">${o}</button>`).join('')}
                </div>
                <div class="ej01-feedback" id="ej01Feedback"></div>
            </div>`;

        panel.querySelector('#ej01AudioBtn').addEventListener('click', () => _speakEn(it.original));

        panel.querySelectorAll('.ej01-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const isCorrect = btn.dataset.opt.toLowerCase() === it.correct.toLowerCase();
                panel.querySelectorAll('.ej01-opt').forEach(b => b.disabled = true);
                if (isCorrect) {
                    btn.classList.add('ej01-opt--correct');
                    panel.querySelector('#ej01Feedback').innerHTML =
                        `<span class="ej01-ok">✓ Correcto</span> <span class="ej01-trans">${it.translation}</span>`;
                    correct++;
                    setTimeout(() => {
                        current++;
                        if (current < items.length) renderItem();
                        else {
                            panel.innerHTML = `<div class="ej01-done-msg">✓ ¡Ejercicio 1 completado! ${correct}/${items.length} correctas.</div>`;
                            btn.classList.add('ej01-btn--done');
                            btn.textContent = '✓ Ejercicio 1';
                        }
                    }, 1100);
                } else {
                    btn.classList.add('ej01-opt--wrong');
                    setTimeout(() => {
                        btn.classList.remove('ej01-opt--wrong');
                        panel.querySelectorAll('.ej01-opt').forEach(b => b.disabled = false);
                    }, 700);
                }
            });
        });
    }
    renderItem();
}

function _ej01ShowEx2(items, panel, btn) {
    if (!items.length) { panel.innerHTML = '<p class="ej01-empty">No hay suficientes ítems para este ejercicio.</p>'; return; }

    const rows = items.map((it, i) => {
        const parts = it.blanked.split('___');
        return `
            <div class="ej01-write-item" data-idx="${i}">
                <div class="ej01-speaker">${it.speaker}</div>
                <div class="ej01-write-row">
                    <span>${parts[0]}</span><input class="ej01-input" data-correct="${it.correct}" placeholder="(${it.infinitive})"><span>${parts[1] || ''}</span>
                    <button class="ej01-audio-btn ej01-audio-inline" data-speak="${it.original.replace(/"/g, '&quot;')}">🔊</button>
                </div>
                <div class="ej01-write-feedback" id="ej01Fb${i}"></div>
            </div>`;
    }).join('');

    panel.innerHTML = `${rows}<button class="ej01-check-btn" id="ej01CheckBtn">Verificar →</button>`;

    panel.querySelectorAll('.ej01-audio-inline').forEach(b => {
        b.addEventListener('click', () => _speakEn(b.dataset.speak));
    });

    panel.querySelector('#ej01CheckBtn').addEventListener('click', () => {
        let allCorrect = true;
        panel.querySelectorAll('.ej01-input').forEach((input, i) => {
            const fb = panel.querySelector(`#ej01Fb${i}`);
            const isOk = input.value.trim().toLowerCase() === items[i].correct.toLowerCase();
            input.classList.toggle('ej01-input--correct', isOk);
            input.classList.toggle('ej01-input--wrong',   !isOk);
            fb.innerHTML = isOk
                ? `<span class="ej01-ok">✓</span>`
                : `<span class="ej01-err">✗ <em>${items[i].correct}</em></span>`;
            if (!isOk) allCorrect = false;
        });
        if (allCorrect) {
            setTimeout(() => {
                panel.innerHTML = `<div class="ej01-done-msg">✓ ¡Ejercicio 2 completado!</div>`;
                btn.classList.add('ej01-btn--done');
                btn.textContent = '✓ Ejercicio 2';
            }, 800);
        }
    });
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
        const chatNode = `<div class="msnake-node msnake-node--chat" data-chat-trigger="1"><span class="msnake-label">💬 Hablar con la IA</span></div>`;
        const area  = `<div class="msnake-area msnake-area--${side}"${idAttr}>${chatNode}<span class="msnake-area-ph">${areaContent}</span></div>`;
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
    _misionWireChatTriggers(grid);

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

// ── Hub genérico B1/B2/C1 para idiomas distintos del español ──────────────────────────────
function _initGenericLangLevelHub(targetCode, level, opts = {}) {
    // opts: { prevLabel, prevFn, nextLevel, nextFn }
    mainContainer.innerHTML = '';
    renderLanguageBar();

    const dir      = _MISION_LANG_DIRS[targetCode];
    const label    = _MISION_LANG_LABELS[targetCode] || targetCode;
    const src      = sourceLang;
    const levelUp  = level.toUpperCase();
    const prevLabel = opts.prevLabel || `← ${label} ${level === 'b1' ? 'A1' : level === 'b2' ? 'B1' : 'B2'}`;

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="mision-hub">
            <div class="mision-intro-row">
                <button class="school-back-btn" id="genericLevelBackBtn" style="margin:0">${prevLabel}</button>
                <p class="mision-intro-text" style="margin:0">Nivel ${levelUp} — ${label}</p>
            </div>
            <h3 class="mision-path-title">Dominá el <em>Nivel ${levelUp}</em> de ${label}</h3>
            <div class="mision-path-grid" id="misionPathGridGenLevel"></div>
        </div>
    `);

    document.getElementById('genericLevelBackBtn').addEventListener('click', () => {
        if (opts.prevFn) opts.prevFn(); else showMainMenu();
    });

    const grid = document.getElementById('misionPathGridGenLevel');
    if (!dir) {
        grid.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted)"><p>Nivel ${levelUp} no disponible para ${label}.</p></div>`;
        return;
    }

    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:.85rem;padding:1.5rem 0">Cargando módulos…</p>';

    const base    = `${_API_HOST}/grupos_tarjetas/${encodeURIComponent(dir)}_${level}/`;
    const safeJson = url => fetch(url).then(r => r.ok ? r.json() : []).catch(() => []);

    Promise.all([
        safeJson(base + `${src}_${level}_gramatica.json`),
        safeJson(base + `${src}_${level}_funciones_comunicativas.json`),
        safeJson(base + `${src}_${level}_conversacion.json`),
    ]).then(([gram, func, conv]) => {
        const mods = _interleaveInglesA1(gram, func, conv);
        if (!mods.length) {
            grid.innerHTML = `
                <div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)">
                    <div style="font-size:2rem;margin-bottom:.75rem">🚧</div>
                    <p style="font-size:.95rem;margin-bottom:.5rem">${label} ${levelUp} próximamente.</p>
                    <p style="font-size:.85rem">Generá los módulos con:<br><code>node generate_missions.js --target=${targetCode} --source=${src} --level=${levelUp}</code></p>
                </div>`;
            return;
        }
        _renderModuleAccordion(grid, mods);
        const nextFn = opts.nextFn;
        _renderSimpleSnake(grid, mods, {
            levelKey:       `${targetCode}_${level}_${src}`,
            milestoneLabel: `★ ${label} ${levelUp}`,
            onExamPass:     nextFn ? () => _showCongratsModal(levelUp, nextFn) : null,
            nextLevelLabel: opts.nextLevel ? `Start Level ${opts.nextLevel.toUpperCase()}` : null,
            nextLevelFn:    nextFn || null,
        });
    });
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
            _renderModuleAccordion(grid, mods);
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
            _renderModuleAccordion(grid, mods);
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
            _renderModuleAccordion(grid, mods);
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

            <div class="ma1-section ma1-section--rule">
                <div class="ma1-section-title">📌 La regla</div>
                <p class="ma1-rule">${mod.rule}</p>
            </div>

            ${(mod.concept_examples && mod.concept_examples.length) ? `
            <div class="ma1-section ma1-section--examples">
                <div class="ma1-section-title">💡 Ejemplos clave</div>
                <div class="ma1-examples-list">
                    ${mod.concept_examples.map(ex => `
                    <div class="ma1-example-item">
                        <div class="ma1-example-text">
                            ${ex.text}
                            <button class="ma1-conv-audio-btn" data-speak="${(ex.text || '').replace(/"/g, '&quot;')}">🔊</button>
                        </div>
                        ${ex.phonetic ? `<div class="ma1-example-phonetic">${ex.phonetic}</div>` : ''}
                        <div class="ma1-example-translation">${ex.translation || ''}</div>
                    </div>`).join('')}
                </div>
            </div>` : ''}

            <div class="ma1-section">
                <div class="ma1-section-title">🌉 Por qué importa</div>
                <p class="ma1-bridge">${mod.bridge}</p>
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

// ─── App Banners ──────────────────────────────────────────────

let _bannerInterval = null;
let _bannerIdx      = 0;

function _getBanners() {
    const isSubscribed = typeof MembershipPlan !== 'undefined' && MembershipPlan.isActive();
    const all = [
        {
            type: 'instructional',
            bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
            emoji: '🎵',
            title: '¿Conocés canciones en otro idioma?',
            body: 'Subí letras y traducciones en <strong>Músicos del Mundo</strong> y ayudá a la comunidad',
            cta: 'Ir a Músicos →',
            action: () => { if (typeof loadMusiciansMenu === 'function') loadMusiciansMenu(); }
        },
        {
            type: 'instructional',
            bg: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)',
            emoji: '🎭',
            title: 'Chateá con Einstein, Frida, Maradona y más',
            body: 'Conversá en el idioma que estás aprendiendo con <strong>personajes históricos reales</strong>',
            cta: 'Conocerlos →',
            action: () => {
                const t = currentTranslations;
                document.querySelector('[data-mode="famous"]')?.click() ||
                (typeof loadFamousChatMenu === 'function' && loadFamousChatMenu());
            }
        },
        ...(!isSubscribed ? [{
            type: 'membership',
            bg: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
            emoji: '⭐',
            title: 'Desbloqueá todo sin límites',
            body: 'Traducciones ilimitadas, todos los flashcards, Famosos, Músicos y más — <strong>desde $19.99/año</strong>',
            cta: 'Ver planes →',
            action: () => { if (typeof loadMembershipSection === 'function') loadMembershipSection(); }
        }] : []),
        {
            type: 'contributors',
            bg: 'linear-gradient(135deg,#064e3b 0%,#065f46 100%)',
            emoji: '🤝',
            title: 'Sé parte del proyecto',
            body: 'Contribuí con contenido, reportá errores o mejorá <strong>Curso</strong> y ganá beneficios',
            cta: 'Saber más →',
            action: () => _showContributorsModal()
        }
    ];
    return all;
}

function _renderBanner(banners, idx, wrap) {
    const b = banners[idx];
    const dots = banners.map((_, i) =>
        `<span class="app-banner-dot${i === idx ? ' active' : ''}"></span>`
    ).join('');
    wrap.innerHTML = `
        <div class="app-banner" style="background:${b.bg}">
            <div class="app-banner-body">
                <span class="app-banner-emoji">${b.emoji}</span>
                <div class="app-banner-text">
                    <div class="app-banner-title">${b.title}</div>
                    <div class="app-banner-desc">${b.body}</div>
                </div>
                <button class="app-banner-cta">${b.cta}</button>
            </div>
            <div class="app-banner-dots">${dots}</div>
        </div>
    `;
    wrap.querySelector('.app-banner-cta').addEventListener('click', b.action);
    wrap.querySelectorAll('.app-banner-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(_bannerInterval);
            wrap.style.transition = 'opacity 0.35s';
            wrap.style.opacity = '0';
            setTimeout(() => {
                _bannerIdx = i;
                _renderBanner(banners, _bannerIdx, wrap);
                _bannerInsertRandom(wrap);
                wrap.style.opacity = '1';
                _bannerInterval = setInterval(() => {
                    wrap.style.opacity = '0';
                    setTimeout(() => {
                        _bannerIdx = (_bannerIdx + 1) % banners.length;
                        _renderBanner(banners, _bannerIdx, wrap);
                        _bannerInsertRandom(wrap);
                        wrap.style.opacity = '1';
                    }, 380);
                }, 8000);
            }, 380);
        });
    });
}

function _bannerInsertRandom(wrap) {
    const grid = document.querySelector('.main-menu');
    if (!grid) return;
    const cards = Array.from(grid.children).filter(el => el !== wrap);
    if (!cards.length) { grid.appendChild(wrap); return; }
    const pos = Math.floor(Math.random() * (cards.length + 1));
    if (pos >= cards.length) {
        grid.appendChild(wrap);
    } else {
        grid.insertBefore(wrap, cards[pos]);
    }
}

function _initAppBanners() {
    let wrap = document.getElementById('appBannersWrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'appBannersWrap';
        wrap.className = 'app-banners-wrap';
        const grid = document.querySelector('.main-menu');
        if (grid) grid.appendChild(wrap);
    }
    clearInterval(_bannerInterval);
    const banners = _getBanners();
    if (!banners.length) return;
    _bannerIdx = 0;
    _bannerInsertRandom(wrap);
    _renderBanner(banners, _bannerIdx, wrap);

    _bannerInterval = setInterval(() => {
        wrap.style.transition = 'opacity 0.35s';
        wrap.style.opacity = '0';
        setTimeout(() => {
            _bannerIdx = (_bannerIdx + 1) % banners.length;
            _renderBanner(banners, _bannerIdx, wrap);
            _bannerInsertRandom(wrap);
            wrap.style.opacity = '1';
        }, 380);
    }, 8000);
}

// ─── Contributors modal ───────────────────────────────────────

function _showContributorsModal() {
    document.querySelector('.contributors-modal-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'contributors-modal-overlay';
    overlay.innerHTML = `
        <div class="contributors-modal">
            <div class="contributors-modal-header">
                <h2>🤝 Contribuidores SenseMate</h2>
                <button class="contributors-close" id="contribClose">×</button>
            </div>
            <div class="contributors-modal-body">

                <p class="contributors-intro">
                    SenseMate crece con la comunidad. Cada aporte suma puntos que se convierten en <strong>beneficios reales</strong>.
                </p>

                <div class="contrib-benefits-row">
                    <div class="contrib-benefit">
                        <div class="contrib-benefit-icon">🎁</div>
                        <div class="contrib-benefit-label">3 meses gratis</div>
                    </div>
                    <div class="contrib-benefit">
                        <div class="contrib-benefit-icon">⭐</div>
                        <div class="contrib-benefit-label">1 año Premium</div>
                    </div>
                    <div class="contrib-benefit contrib-benefit--gold">
                        <div class="contrib-benefit-icon">🥇</div>
                        <div class="contrib-benefit-label">Membresía Oro</div>
                    </div>
                    <div class="contrib-benefit contrib-benefit--staff">
                        <div class="contrib-benefit-icon">🚀</div>
                        <div class="contrib-benefit-label">Formar parte del equipo</div>
                    </div>
                </div>

                <div class="contrib-ways">

                    <div class="contrib-way">
                        <div class="contrib-way-header">
                            <span class="contrib-way-emoji">🌍</span>
                            <div>
                                <div class="contrib-way-title">Subir contenido a "Multimedia"</div>
                                <div class="contrib-way-pts">+30 pts por episodio aprobado</div>
                            </div>
                        </div>
                        <p class="contrib-way-desc">Agregá videos, series o podcasts con diálogos sincronizados por timestamps.</p>
                    </div>

                    <div class="contrib-way">
                        <div class="contrib-way-header">
                            <span class="contrib-way-emoji">🎵</span>
                            <div>
                                <div class="contrib-way-title">Subir canciones y subtítulos en Músicos del Mundo</div>
                                <div class="contrib-way-pts">+20 pts por canción · +10 pts por traducción</div>
                            </div>
                        </div>
                        <p class="contrib-way-desc">Letras originales, traducciones y artistas de cualquier idioma del mundo.</p>
                    </div>

                    <div class="contrib-way">
                        <div class="contrib-way-header">
                            <span class="contrib-way-emoji">🐛</span>
                            <div>
                                <div class="contrib-way-title">Reportar fallas y conductas inapropiadas</div>
                                <div class="contrib-way-pts">+5 pts por reporte verificado</div>
                            </div>
                        </div>
                        <p class="contrib-way-desc">Errores en traducciones, módulos rotos, respuestas inapropiadas de la IA.</p>
                    </div>

                    <div class="contrib-way contrib-way--featured">
                        <div class="contrib-way-header">
                            <span class="contrib-way-emoji">📚</span>
                            <div>
                                <div class="contrib-way-title">Revisar y mejorar módulos de Curso</div>
                                <div class="contrib-way-pts">+50 pts por módulo aprobado · Nominación a staff</div>
                            </div>
                        </div>
                        <p class="contrib-way-desc">
                            Revisá la precisión lingüística de los módulos A1–C1 para un idioma específico.
                            Corregí ejemplos, reglas y errores comunes con el aval de un hablante nativo.
                        </p>
                        <div class="contrib-cupo-banner">
                            <strong>Cupo limitado:</strong> 10 contribuidores por idioma &mdash;
                            de los cuales <strong>2 pueden ser nominados al equipo de trabajo</strong>.
                        </div>
                    </div>

                </div>

                <button class="contrib-apply-btn" id="contribApplyBtn">
                    ✉️ Quiero contribuir — Contactar
                </button>
                <p class="contrib-footer">
                    El sistema de puntos y el panel de contribuidores estarán disponibles próximamente.
                    Por ahora podés escribirnos directamente.
                </p>

            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('contribClose').addEventListener('click', () => overlay.remove());
    document.getElementById('contribApplyBtn').addEventListener('click', () => {
        overlay.remove();
        window.location.href = 'mailto:sebasemilla@proton.me?subject=Quiero%20contribuir%20a%20SenseMate';
    });
}

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
    const inLiveFeed    = appMode === 'livefeed';
    const inClassroom   = appMode === 'classroom';

    if (inLiveFeed)  { _renderLiveFeed();   return; }
    if (inClassroom) { _renderClassRoom();  return; }

    const showTranslator  = inTraduccion;
    const showSchool      = inMision;
    const showFamous      = inExploracion;
    const showPractice    = inTraduccion;
    const showMusicians   = inTraduccion || inExploracion;
    const showWriters     = inTraduccion || inExploracion;
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
            </div>
            <div class="mode-card mode-card--longtext" data-mode="longtext">
                <h2>📄</h2>
                <h4>${t.longtext_title}</h4>
                <p>${t.longtext_card_desc}</p>
            </div>
            <div class="mode-card mode-card--analyzer" data-mode="analyzer">
                <h2>🔍</h2>
                <h4>${t.analyzer_title}</h4>
                <p>${t.analyzer_card_desc}</p>
            </div>` : sectionMinimized('translator', '🔄', t.traductor_label)) : ''}

            ${showSchool ? `
            <div class="mision-hub" id="misionHub">
                <div class="mision-intro-row">
                    <p class="mision-intro-text">Avanzá módulo a módulo con tu tutor IA. Completá cada paso para desbloquear el siguiente.</p>
                    <button class="mision-tutorial-btn" id="misionTutorialBtn">📖 Tutorial</button>
                </div>
                <h3 class="mision-path-title">Da tus primeros pasos en <em>${({"es":"Español","en":"Inglés","fr":"Francés","pt":"Português","de":"Alemán","it":"Italiano","zh":"Chino","ja":"Japonés","ko":"Coreano","ru":"Ruso","ar":"Árabe","gn":"Guaraní","qu":"Quechua","nah":"Náhuatl","wo":"Wolof","ha":"Hausa","yo":"Yoruba"})[targetLang] || targetLang || 'Español'}</em></h3>
                <div class="mision-path-grid" id="misionPathGrid"></div>
            </div>` : ''}

            ${showFamous ? (sectionEnabled('famous') ? `
            <div id="explorerCountryBar"></div>
            <div class="famous-carousel-section" id="famousCarouselSection">
                <button class="fc-arrow fc-arrow--left" id="fcPrev" aria-label="Anterior">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div class="fc-track-wrap" id="fcTrackWrap">
                    ${(typeof famousCarouselKeys === 'function' ? famousCarouselKeys() : ['mlk','marilyn','maradona']).map(k => {
                        const desc = t[`${k}_descripcion`] || '';
                        return typeof _famousCardHTML === 'function' ? _famousCardHTML(k, desc, 'fc-card') : '';
                    }).join('')}
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
                <h2 class="practice-title">${t.modo_practica || 'Tarjetas / Flashcards'}</h2>
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
            ` : sectionMinimized('practice', '📇', 'Tarjetas / Flashcards')) : ''}

            ${showMusicians ? (sectionEnabled('musicians') ? `
            <div class="mode-card" data-mode="musicians">
                <h2>${t.modo_musicos_mundo}</h2>
                <p>${t.descripcion_musicos_mundo}</p>
            </div>` : sectionMinimized('musicians', '🎵', 'Músicos y Letras')) : ''}

            ${showWriters ? `
            <div class="mode-card" data-mode="writers">
                <h2>📖</h2>
                <h4>Escritores y Escritos</h4>
                <p>Poemas, fragmentos y frases de grandes escritores con traducción lado a lado</p>
            </div>` : ''}

            ${showImmersion ? (sectionEnabled('immersion') ? `
            <div class="mode-card" data-mode="immersion">
                <h2>🎬</h2>
                <h4>Multimedia</h4>
                <p>Películas, series y más en el idioma original</p>
            </div>` : sectionMinimized('immersion', '🎬', 'Multimedia')) : ''}

            ${showPlans ? `
            <div class="mode-card mode-card--plans" data-mode="plans">
                <h2>⭐</h2>
                <h4>Premium 500X</h4>
                <p>Desbloqueá todas las funciones sin límites</p>
            </div>` : ''}

            ${inExploracion ? `
            <!-- Footer Cohere -->
            <div class="smp-ai-footer" style="margin:20px 0 4px;">
                <span class="smp-ai-footer-text">🌿 Esta app usa <strong>Cohere AI</strong> por sus políticas éticas y ecológicas</span>
                <a class="smp-ai-footer-btn" href="https://cohere.com" target="_blank" rel="noopener noreferrer">Conocer Cohere →</a>
            </div>` : ''}

        </div>
    `);

    // Mode cards
    document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            _track('section_open', { section: mode });
            if      (mode === 'simple')    loadSimpleMode();
            else if (mode === 'longtext')  loadLongTextMode();
            else if (mode === 'analyzer')  loadTextAnalyzer();
            else if (mode === 'practice')  requireAuth('Tarjetas / Flashcards',    loadPracticeMenu);
            else if (mode === 'writers') {
                if (typeof loadWritersMenu === 'function') loadWritersMenu();
            }
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
                requireAuth('Multimedia', () => {
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

    // Inicializar carrusel de famosos + barra de país en Explorador
    if (typeof initFamousCarousel === 'function') {
        initFamousCarousel(document.getElementById('famousCarouselSection'));
    }
    if (typeof initExplorerCountryBar === 'function') {
        initExplorerCountryBar();
    }

    // Inicializar banners — solo en modo Traducción y Exploración (no en Misión)
    if (appMode !== 'mision') {
        _initAppBanners();
    } else {
        clearInterval(_bannerInterval);
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
        requireAuth('Tarjetas / Flashcards', () => { loadFlashcardData(); showAllGroups(); })
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
    // Crear grupo requiere cuenta (guarda datos + cupo mensual) — createNewGroup
    // ya valida el login con su propio aviso, así que no se ofrece "modo invitado" aquí.
    document.getElementById('newGroupMainBtn')?.addEventListener('click', createNewGroup);

    if (typeof _maybeShowTutorial === 'function') _maybeShowTutorial();
}

// ─── Live Feed ────────────────────────────────────────────────────────────────

async function _getLiveFeedPosts(filter = 'recientes') {
    try {
        const limit = filter === 'recientes' ? 30 : 100;
        const res   = await fetch(`${_API_HOST}/api/feed?limit=${limit}`);
        if (!res.ok) throw new Error('API error');
        const data  = await res.json();
        return data.posts || [];
    } catch {
        // fallback localStorage
        let posts = JSON.parse(localStorage.getItem('lf_posts') || '[]');
        posts.sort((a, b) => b.ts - a.ts);
        return filter === 'recientes' ? posts.slice(0, 30) : posts;
    }
}

async function _renderLiveFeed() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    // Mostrar spinner mientras carga
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="livefeed-section">
            <div class="livefeed-header">
                <h2>📡 Live Feed</h2>
                <div class="livefeed-filters">
                    <button class="livefeed-filter-btn active" data-filter="recientes">Recientes</button>
                    <button class="livefeed-filter-btn" data-filter="todos">Todos</button>
                </div>
            </div>
            <div class="livefeed-feed" id="livefeedFeed"><div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div></div>
        </div>
    `);
    const posts = await _getLiveFeedPosts('recientes');

    const feed = document.getElementById('livefeedFeed');
    if (feed) { feed.innerHTML = _buildPostsHtml(posts); _initFeedAds(feed); }
    _initLiveFeed();
}

function _buildPostsHtml(posts) {
    if (!posts.length) return '<div class="livefeed-empty">📭 No hay publicaciones recientes aún.</div>';
    const showAds = _shouldShowAds();
    return posts.map((p, i) => {
        const tags = Array.isArray(p.tags) ? p.tags : [];
        const dir = p.lang === 'en' ? 'En→Es' : 'Es→En';
        const cardHtml = `
        <article class="lf-card" data-post-id="${p.id}" role="button" tabindex="0">
            <div class="lf-card-header">
                <div class="lf-card-avatar">${p.avatar || '🤖'}</div>
                <div class="lf-card-meta">
                    <span class="lf-card-author">${_escHtml(p.author || '')}</span>
                    <span class="lf-card-time">${_timeAgo(p.ts)}</span>
                </div>
                <div class="lf-card-badges">
                    ${p.level ? `<span class="lf-badge lf-badge--level">${_escHtml(p.level)}</span>` : ''}
                    ${p.live ? '<span class="lf-badge lf-badge--live">🔴 EN VIVO</span>' : ''}
                </div>
            </div>
            <div class="lf-card-content">
                <h3 class="lf-card-title">${p.emoji ? `<span class="lf-card-emoji">${p.emoji}</span>` : ''}${_escHtml(p.title || '')}</h3>
                ${p.intro ? `<p class="lf-card-intro">${_escHtml(p.intro)}</p>` : ''}
            </div>
            <div class="lf-card-footer">
                ${tags.length ? `<div class="lf-card-tags">${tags.slice(0,3).map(t => `<span class="lf-tag">#${_escHtml(t)}</span>`).join('')}</div>` : ''}
                <div class="lf-card-actions">
                    <button class="lf-card-read-btn">Leer <span>→</span></button>
                    <button class="lf-action-btn lf-comment-btn" data-post-id="${p.id}" aria-label="Comentarios">💬 <span class="lf-cmt-count">${p.comments || 0}</span></button>
                    <button class="lf-action-btn lf-like-btn" data-post-id="${p.id}" aria-label="Me gusta">❤️ <span class="lf-like-count">${p.likes || 0}</span></button>
                </div>
            </div>
        </article>`;
        const adHtml = showAds && (i + 1) % 6 === 0
            ? `<div class="livefeed-ad-wrap">
                <span class="livefeed-ad-label">Publicidad</span>
                <ins class="adsbygoogle livefeed-ad-ins"
                     style="display:block"
                     data-ad-client="${_AD_CLIENT}"
                     data-ad-slot="${_AD_SLOT_FEED}"
                     data-ad-format="fluid"
                     data-ad-layout-key="-fb+5w+4e-db+86"></ins>
               </div>`
            : '';
        return cardHtml + adHtml;
    }).join('');
}

async function _openPost(id, scrollToComments = false) {
    let overlay = document.getElementById('lfPostOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'lfPostOverlay';
        overlay.className = 'lf-post-overlay';
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = '<div class="lf-article-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
        const res = await fetch(`${_API_HOST}/api/posts/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('No se pudo cargar el post');
        const post = await res.json();
        overlay.innerHTML = _buildArticleHtml(post);
        overlay.querySelector('.lf-article-back')?.addEventListener('click', _closePost);
        _bindArticleActions(overlay, post);
        if (scrollToComments) {
            setTimeout(() => overlay.querySelector('#articleComments')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    } catch (e) {
        overlay.innerHTML = `<div class="lf-article-error"><button class="lf-article-back" style="margin-bottom:1rem">← Volver</button><p>❌ ${_escHtml(e.message)}</p></div>`;
        overlay.querySelector('.lf-article-back')?.addEventListener('click', _closePost);
    }
}

function _closePost() {
    const overlay = document.getElementById('lfPostOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function _bindArticleActions(overlay, post) {
    const fp = _getFeedFingerprint();

    // Like button
    const likeBtn = overlay.querySelector('.lf-like-btn');
    if (likeBtn) {
        fetch(`${_API_HOST}/api/posts/${post.id}/like-status?fp=${encodeURIComponent(fp)}`)
            .then(r => r.json()).then(d => { if (d.liked) likeBtn.classList.add('liked'); }).catch(() => {});
        likeBtn.addEventListener('click', async () => {
            likeBtn.disabled = true;
            try {
                const r = await _authFetch(`${_API_HOST}/api/posts/${post.id}/like`, { method: 'POST', body: JSON.stringify({ fingerprint: fp }) });
                const { liked, count } = await r.json();
                likeBtn.querySelector('.lf-like-count').textContent = count;
                likeBtn.classList.toggle('liked', liked);
            } catch {}
            likeBtn.disabled = false;
        });
    }

    // Comments
    const list   = overlay.querySelector('#lf-comments-list');
    const input  = overlay.querySelector('#lf-comment-input');
    const submit = overlay.querySelector('#lf-comment-submit');

    const loadComments = () => fetch(`${_API_HOST}/api/posts/${post.id}/comments`)
        .then(r => r.json()).then(({ comments }) => {
            if (!list) return;
            if (!comments.length) { list.innerHTML = '<p class="lf-no-comments">Sin comentarios aún. ¡Sé el primero!</p>'; return; }
            list.innerHTML = comments.map(c => `
            <div class="lf-comment-item">
                <span class="lf-comment-author">${_escHtml(c.author)}</span>
                <span class="lf-comment-time">${_timeAgo(c.ts)}</span>
                <p class="lf-comment-text">${_escHtml(c.text)}</p>
            </div>`).join('');
        }).catch(() => { if (list) list.innerHTML = ''; });

    loadComments();

    submit?.addEventListener('click', async () => {
        const text = input?.value.trim();
        if (!text) return;
        submit.disabled = true;
        const author = (typeof currentUser !== 'undefined' && currentUser?.username) || 'Anónimo';
        try {
            const r = await _authFetch(`${_API_HOST}/api/posts/${post.id}/comments`, {
                method: 'POST', body: JSON.stringify({ text, fingerprint: fp, author })
            });
            if (!r.ok) throw new Error();
            input.value = '';
            const cntEl = overlay.querySelector('.lf-comment-btn .lf-cmt-count');
            if (cntEl) cntEl.textContent = parseInt(cntEl.textContent || 0) + 1;
            await loadComments();
        } catch {}
        submit.disabled = false;
    });
}

function _buildArticleHtml(p) {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const langLabel = p.direction || (p.lang === 'en' ? 'En→Es' : 'Es→En');
    return `
    <div class="lf-article">
        <div class="lf-article-topbar">
            <button class="lf-article-back">← Volver</button>
            <div class="lf-article-top-badges">
                ${p.level ? `<span class="lf-badge lf-badge--level">${_escHtml(p.level)}</span>` : ''}
            </div>
        </div>
        <div class="lf-article-hero">
            <div class="lf-article-avatar">${p.avatar || '🤖'}</div>
            <div class="lf-article-author-wrap">
                <span class="lf-article-author">${_escHtml(p.author || '')}</span>
                <span class="lf-article-time">${_timeAgo(p.ts)}</span>
            </div>
        </div>
        <div class="lf-article-body">
            <h1 class="lf-article-title">${p.emoji ? `<span>${p.emoji}</span> ` : ''}${_escHtml(p.title || '')}</h1>
            ${p.intro ? `<p class="lf-article-intro">${_escHtml(p.intro)}</p>` : ''}
            <div class="lf-article-divider"></div>
            <p class="lf-article-text">${_escHtml(p.body || '')}</p>
            ${p.highlight ? `
            <div class="lf-article-block lf-article-block--highlight">
                <div class="lf-article-block-label">⭐ Concepto clave</div>
                <p>${_escHtml(p.highlight)}</p>
            </div>` : ''}
            ${p.example ? `
            <div class="lf-article-block lf-article-block--example">
                <div class="lf-article-block-label">💬 Ejemplo</div>
                <p><em>${_escHtml(p.example)}</em></p>
            </div>` : ''}
            ${p.tip ? `
            <div class="lf-article-block lf-article-block--tip">
                <div class="lf-article-block-label">💡 Consejo</div>
                <p>${_escHtml(p.tip)}</p>
            </div>` : ''}
            ${p.faqs?.length ? `
            <div class="lf-article-faqs">
                <div class="lf-article-block-label" style="margin-bottom:.75rem">❓ Preguntas frecuentes</div>
                ${p.faqs.map(f => `
                <details class="lf-faq-item">
                    <summary class="lf-faq-q">${_escHtml(f.q)}</summary>
                    <p class="lf-faq-a">${_escHtml(f.a)}</p>
                </details>`).join('')}
            </div>` : ''}
        </div>
        <div class="lf-article-footer">
            ${tags.length ? `<div class="lf-article-tags">${tags.map(t => `<span class="lf-tag">#${_escHtml(t)}</span>`).join('')}</div>` : ''}
            <div class="lf-article-actions">
                <button class="lf-action-btn lf-like-btn" data-post-id="${p.id}">❤️ <span class="lf-like-count">${p.likes || 0}</span></button>
                <button class="lf-action-btn lf-comment-btn" data-post-id="${p.id}">💬 <span class="lf-cmt-count">${p.comments || 0}</span></button>
            </div>
        </div>
        <div id="articleComments" class="lf-comments-section">
            <h4 class="lf-comments-title">Comentarios</h4>
            <div class="lf-comments-form">
                <textarea id="lf-comment-input" class="lf-comment-input" placeholder="Escribí un comentario…" maxlength="500" rows="2"></textarea>
                <button id="lf-comment-submit" class="lf-comment-submit">Enviar</button>
            </div>
            <div id="lf-comments-list" class="lf-comments-list"><div class="lf-comments-loading">Cargando…</div></div>
        </div>
    </div>`;
}

function _initFeedAds(container) {
    if (!_shouldShowAds()) return;
    container.querySelectorAll('.livefeed-ad-ins').forEach(el => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
    });
}

function _initLiveFeed() {
    document.querySelectorAll('.livefeed-filter-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.livefeed-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const feed = document.getElementById('livefeedFeed');
            if (!feed) return;
            feed.innerHTML = '<div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>';
            const posts = await _getLiveFeedPosts(btn.dataset.filter);
            feed.innerHTML = _buildPostsHtml(posts);
            _initFeedAds(feed);
            _bindFeedCardClicks(feed);
        });
    });
    _bindFeedCardClicks(document.getElementById('livefeedFeed'));
}

function _bindFeedCardClicks(container) {
    if (!container) return;
    container.querySelectorAll('.lf-card').forEach(card => {
        const open = () => _openPost(card.dataset.postId);
        card.addEventListener('click', open);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    });
    container.querySelectorAll('.lf-like-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
            e.stopPropagation();
            const postId = btn.dataset.postId;
            const fp = _getFeedFingerprint();
            btn.disabled = true;
            try {
                const res = await _authFetch(`${_API_HOST}/api/posts/${postId}/like`, {
                    method: 'POST', body: JSON.stringify({ fingerprint: fp })
                });
                const { liked, count } = await res.json();
                btn.querySelector('.lf-like-count').textContent = count;
                btn.classList.toggle('liked', liked);
            } catch {}
            btn.disabled = false;
        });
        const fp = _getFeedFingerprint();
        fetch(`${_API_HOST}/api/posts/${btn.dataset.postId}/like-status?fp=${encodeURIComponent(fp)}`)
            .then(r => r.json()).then(d => { if (d.liked) btn.classList.add('liked'); }).catch(() => {});
    });
    container.querySelectorAll('.lf-comment-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            _openPost(btn.dataset.postId, true);
        });
    });
}

function _getFeedFingerprint() {
    let fp = localStorage.getItem('_feed_fp');
    if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('_feed_fp', fp); }
    return fp;
}

// ─── Class Room ───────────────────────────────────────────────────────────────

async function _getClasses(tab = 'disponibles') {
    try {
        const res = await fetch(`${API_URL}/api/classroom?tab=${tab}&limit=50`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return data.classes || [];
    } catch {
        let classes = JSON.parse(localStorage.getItem('cr_classes') || '[]');
        classes.sort((a, b) => b.ts - a.ts);
        return tab === 'live' ? classes.filter(c => c.live) : classes.filter(c => !c.live);
    }
}

function _classCardHtml(c) {
    const isLive = c.live;
    return `
        <div class="classroom-card${isLive ? ' is-live' : ''}">
            <div class="classroom-card-thumb">${c.emoji || '🎓'}</div>
            <div class="classroom-card-info">
                <div class="classroom-card-title">${_escHtml(c.title)}</div>
                <div class="classroom-card-teacher">👤 ${_escHtml(c.teacher)}</div>
                <div class="classroom-card-tags">
                    ${(c.tags || []).map(t => `<span class="classroom-tag">${_escHtml(t)}</span>`).join('')}
                </div>
            </div>
            <div class="classroom-card-action">
                ${isLive
                    ? `<button class="classroom-join-btn live-btn">🔴 Unirse</button>
                       <span class="classroom-card-time"><span class="classroom-live-dot"></span> En vivo</span>`
                    : `<button class="classroom-join-btn">Ver clase</button>
                       <span class="classroom-card-time">${_timeAgo(c.ts)}</span>`}
            </div>
        </div>
    `;
}

async function _renderClassRoom() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="classroom-section">
            <div class="classroom-header">
                <h2>🎓 Class Room</h2>
                <span id="crLiveLabel"></span>
            </div>
            <div class="classroom-tabs">
                <button class="classroom-tab-btn active" data-cr-tab="disponibles">Disponibles</button>
                <button class="classroom-tab-btn" data-cr-tab="live">🔴 En Vivo</button>
            </div>
            <div class="classroom-grid" id="classroomGrid">
                <div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
            </div>
            <!-- Footer Cohere -->
            <div class="smp-ai-footer" style="margin:20px 0 4px;">
                <span class="smp-ai-footer-text">🌿 Esta app usa <strong>Cohere AI</strong> por sus políticas éticas y ecológicas</span>
                <a class="smp-ai-footer-btn" href="https://cohere.com" target="_blank" rel="noopener noreferrer">Conocer Cohere →</a>
            </div>
        </div>
    `);

    const [disponibles, lives] = await Promise.all([_getClasses('disponibles'), _getClasses('live')]);

    const liveLabel = document.getElementById('crLiveLabel');
    if (liveLabel && lives.length > 0) {
        liveLabel.innerHTML = `<span class="classroom-live-indicator"><span class="classroom-live-dot"></span>${lives.length} en vivo</span>`;
    }

    const grid = document.getElementById('classroomGrid');
    if (grid) grid.innerHTML = disponibles.length
        ? disponibles.map(_classCardHtml).join('')
        : '<div class="livefeed-empty">📚 No hay clases disponibles aún.</div>';

    _initClassRoom();
}

function _initClassRoom() {
    const grid = document.getElementById('classroomGrid');
    document.querySelectorAll('.classroom-tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.classroom-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (!grid) return;
            grid.innerHTML = '<div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>';
            if (btn.dataset.crTab === 'live') {
                const lives = await _getClasses('live');
                grid.innerHTML = lives.length
                    ? lives.map(_classCardHtml).join('')
                    : '<div class="livefeed-empty">📡 No hay clases en vivo ahora.</div>';
            } else {
                const disp = await _getClasses('disponibles');
                grid.innerHTML = disp.length
                    ? disp.map(_classCardHtml).join('')
                    : '<div class="livefeed-empty">📚 No hay clases disponibles aún.</div>';
            }
        });
    });
}

// ─── Utilidades compartidas ───────────────────────────────────────────────────

function _escHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function _timeAgo(ts) {
    const diff = Date.now() - ts;
    const min  = Math.floor(diff / 60000);
    if (min < 1)   return 'ahora mismo';
    if (min < 60)  return `hace ${min} min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24)  return `hace ${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `hace ${days} d`;
}


// ─── Modo Simple (traducción) ─────────────────────────────────

// ─── Modo Texto Largo ─────────────────────────────────────────

function loadLongTextMode() {
    const t = currentTranslations;
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="lt-wrap">

            <div class="lt-header">
                <button class="school-back-btn" id="ltBackBtn">← ${t.volver || 'Volver'}</button>
                <h2 class="lt-title">📄 ${t.longtext_title}</h2>
            </div>

            <!-- Introducción de la sección -->
            <p class="lt-intro">${t.longtext_intro || 'Traducí textos extensos —capítulos, artículos, cartas— manteniendo el contexto entre párrafos. Recomendamos pegar hasta unos 2.500 caracteres (15-20 párrafos) por vez: cada párrafo se procesa con una solicitud individual, así que textos más largos tardan más y pueden alcanzar el límite de uso.'}</p>

            <!-- Instrucción para la IA -->
            <div class="lt-card lt-instruction-card">
                <label class="lt-label">
                    🧠 ${t.longtext_instruction_label}
                    <span class="lt-optional">${t.longtext_instruction_optional}</span>
                </label>
                <div class="lt-instruction-examples">
                    <button class="lt-example-chip" data-val="${t.longtext_chip_summarize_prompt}">📝 ${t.longtext_chip_summarize}</button>
                    <button class="lt-example-chip" data-val="${t.longtext_chip_characters_prompt}">🎭 ${t.longtext_chip_characters}</button>
                    <button class="lt-example-chip" data-val="${t.longtext_chip_perspective_prompt}">🔄 ${t.longtext_chip_perspective}</button>
                    <button class="lt-example-chip" data-val="${t.longtext_chip_modernize_prompt}">✨ ${t.longtext_chip_modernize}</button>
                </div>
                <textarea class="lt-instruction-input" id="ltInstruction" rows="2"
                    placeholder="${t.longtext_instruction_placeholder}"></textarea>
            </div>

            <!-- Texto de entrada -->
            <div class="lt-card">
                <label class="lt-label">📖 ${t.longtext_source_label}</label>
                <textarea class="lt-text-input" id="ltSourceText" rows="12"
                    placeholder="${t.longtext_source_placeholder}"></textarea>
                <div class="lt-input-foot">
                    <span class="lt-char-count" id="ltCharCount">0 ${t.chars_label} · 0 ${t.paragraph_plural}</span>
                    <button class="lt-paste-btn" id="ltPasteBtn">📋 ${t.pegar}</button>
                </div>
            </div>

            <!-- Botón procesar -->
            <button class="lt-process-btn" id="ltProcessBtn" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ${t.longtext_process_btn}
            </button>

            <!-- Progreso -->
            <div class="lt-progress hidden" id="ltProgress">
                <div class="lt-progress-bar"><div class="lt-progress-fill" id="ltProgressFill"></div></div>
                <span class="lt-progress-label" id="ltProgressLabel">${t.longtext_progress_initial}</span>
                <button class="lt-stop-btn" id="ltStopBtn">⏹ ${t.longtext_stop_btn}</button>
            </div>

            <!-- Resultados -->
            <div class="lt-results" id="ltResults"></div>

            <!-- Segmentador de transcripciones -->
            <div class="seg-divider">
                <span>Otras herramientas</span>
            </div>

            <div class="lt-card seg-card">
                <div class="seg-header">
                    <span class="seg-icon">✂️</span>
                    <div>
                        <div class="seg-title">Segmentador de transcripciones</div>
                        <div class="seg-desc">Convertí un archivo .srt o .txt en texto fluido agrupado por secciones temáticas. Ideal para subtítulos de videos o clases.</div>
                    </div>
                </div>

                <div class="seg-file-row">
                    <label class="seg-file-btn" for="segFileInput">📂 Elegir archivo</label>
                    <input type="file" id="segFileInput" accept=".srt,.txt" class="seg-file-hidden">
                    <span class="seg-file-name" id="segFileName">Ningún archivo seleccionado</span>
                </div>

                <div class="seg-mode-row">
                    <button class="seg-mode-btn seg-mode-btn--active" data-mode="completa">Completa</button>
                    <button class="seg-mode-btn" data-mode="media">Media</button>
                    <button class="seg-mode-btn" data-mode="minimo">Mínimo</button>
                </div>
                <div class="seg-mode-desc" id="segModeDesc">Detecta todos los cambios de tema (10–20 secciones).</div>

                <button class="lt-process-btn" id="segStartBtn" disabled>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Iniciar
                </button>

                <div class="lt-progress hidden" id="segProgress" style="justify-content:center">
                    <div class="seg-spinner"></div>
                    <span style="font-size:.85rem;color:var(--text-muted)">Analizando secciones temáticas…</span>
                </div>

                <div class="seg-preview hidden" id="segPreview">
                    <div class="seg-preview-label">Vista previa — primeras 500 palabras</div>
                    <div class="seg-preview-body" id="segPreviewBody"></div>
                </div>
            </div>

        </div>
    `);

    document.getElementById('ltBackBtn').addEventListener('click', showMainMenu);

    // Paste
    document.getElementById('ltPasteBtn').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('ltSourceText').value = text;
            _ltUpdateCount();
        } catch { /* no clipboard permission */ }
    });

    // Chips de ejemplo
    document.querySelectorAll('.lt-example-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const input = document.getElementById('ltInstruction');
            input.value = chip.dataset.val;
            input.focus();
        });
    });

    // Char/paragraph counter
    const sourceTA = document.getElementById('ltSourceText');
    sourceTA.addEventListener('input', _ltUpdateCount);

    function _ltUpdateCount() {
        const text  = sourceTA.value;
        const paras = _ltSplitParagraphs(text).length;
        const count = text.length;
        const el    = document.getElementById('ltCharCount');
        if (el) el.textContent = `${count.toLocaleString()} ${t.chars_label} · ${paras} ${paras === 1 ? t.paragraph_singular : t.paragraph_plural}`;
        const btn = document.getElementById('ltProcessBtn');
        if (btn) btn.disabled = text.trim().length < 20;
    }

    // Procesar
    let _ltStopped = false;
    document.getElementById('ltProcessBtn').addEventListener('click', () => _ltRun());
    document.getElementById('ltStopBtn').addEventListener('click', () => { _ltStopped = true; });

    async function _ltRun() {
        const text        = document.getElementById('ltSourceText').value.trim();
        const instruction = document.getElementById('ltInstruction').value.trim();
        const paragraphs  = _ltSplitParagraphs(text);
        if (!paragraphs.length) return;

        _ltStopped = false;
        document.getElementById('ltProcessBtn').classList.add('hidden');
        const progress  = document.getElementById('ltProgress');
        const fill      = document.getElementById('ltProgressFill');
        const label     = document.getElementById('ltProgressLabel');
        const results   = document.getElementById('ltResults');
        results.innerHTML = '';
        progress.classList.remove('hidden');

        let prevContext = '';

        for (let i = 0; i < paragraphs.length; i++) {
            if (_ltStopped) break;

            const pct = Math.round((i / paragraphs.length) * 100);
            fill.style.width  = pct + '%';
            label.textContent = t.longtext_progress_translating.replace('{current}', i + 1).replace('{total}', paragraphs.length);

            // Placeholder card con spinner
            const cardId = `ltCard_${i}`;
            results.insertAdjacentHTML('beforeend', `
                <div class="lt-para-card" id="${cardId}">
                    <div class="lt-para-original">${escapeHtml(paragraphs[i])}</div>
                    <div class="lt-para-divider"></div>
                    <div class="lt-para-result lt-para-result--loading">
                        <div class="school-dots"><span></span><span></span><span></span></div>
                    </div>
                </div>
            `);
            document.getElementById(cardId).scrollIntoView({ behavior: 'smooth', block: 'end' });

            try {
                const r = await _authFetch(`${_API_HOST}/translate-paragraph`, {
                    method: 'POST',
                    body: JSON.stringify({
                        text: paragraphs[i],
                        sourceLang, targetLang,
                        instruction: instruction || '',
                        prevContext,
                    })
                });
                const data = await r.json();
                const result = r.ok ? (data.result || '—') : ('⚠️ ' + (data.error || 'Error'));

                // Actualizar card
                const card = document.getElementById(cardId);
                card.querySelector('.lt-para-result').outerHTML = `
                    <div class="lt-para-result">${escapeHtml(result)}</div>
                    <div class="lt-para-actions">
                        <button class="lt-chat-btn" data-card="${cardId}">💬 ${t.longtext_ask_ai_btn}</button>
                    </div>
                    <div class="lt-para-chat hidden" id="${cardId}_chat"></div>
                `;

                // Wiring del botón de chat
                card.querySelector('.lt-chat-btn').addEventListener('click', function() {
                    _ltOpenParaChat(cardId, paragraphs[i], result, instruction);
                    this.classList.add('hidden');
                });

                // Acumular contexto (últimos 2 párrafos procesados)
                prevContext = [prevContext, result].filter(Boolean).join('\n\n').split('\n\n').slice(-2).join('\n\n');

            } catch (e) {
                document.getElementById(cardId).querySelector('.lt-para-result').innerHTML =
                    `<span style="color:#ef4444">⚠️ ${t.longtext_error_paragraph}</span>`;
            }
        }

        fill.style.width  = '100%';
        label.textContent = _ltStopped
            ? `⏹ ` + t.longtext_progress_stopped.replace('{current}', Math.min(document.querySelectorAll('.lt-para-card').length, paragraphs.length)).replace('{total}', paragraphs.length)
            : `✅ ${paragraphs.length} ${paragraphs.length === 1 ? t.paragraph_singular : t.paragraph_plural} ${paragraphs.length === 1 ? t.processed_singular : t.processed_plural}`;
        document.getElementById('ltStopBtn').classList.add('hidden');
        document.getElementById('ltProcessBtn').classList.remove('hidden');
    }

    function _ltOpenParaChat(cardId, original, translated, instruction) {
        const chatEl = document.getElementById(`${cardId}_chat`);
        chatEl.classList.remove('hidden');
        chatEl.innerHTML = `
            <div class="lt-chat-messages" id="${cardId}_msgs"></div>
            <div class="lt-chat-input-row">
                <textarea class="lt-chat-input" id="${cardId}_input" rows="2"
                    placeholder="${t.longtext_chat_placeholder}"></textarea>
                <button class="lt-chat-send" id="${cardId}_send">→</button>
            </div>
        `;

        const msgs   = [];
        const msgsEl = document.getElementById(`${cardId}_msgs`);
        const input  = document.getElementById(`${cardId}_input`);
        const send   = document.getElementById(`${cardId}_send`);

        async function sendMsg() {
            const q = input.value.trim();
            if (!q) return;
            msgs.push({ role: 'user', content: q });
            msgsEl.insertAdjacentHTML('beforeend',
                `<div class="lt-chat-msg lt-chat-msg--user">${escapeHtml(q)}</div>`);
            input.value = '';
            send.disabled = true;

            const loadId = `${cardId}_load_${Date.now()}`;
            msgsEl.insertAdjacentHTML('beforeend',
                `<div class="lt-chat-msg lt-chat-msg--ai" id="${loadId}">
                    <div class="school-dots"><span></span><span></span><span></span></div>
                </div>`);
            msgsEl.scrollTop = msgsEl.scrollHeight;

            try {
                const r    = await _authFetch(`${_API_HOST}/paragraph-chat`, {
                    method: 'POST',
                    body: JSON.stringify({ original, translated, messages: msgs, sourceLang, targetLang })
                });
                const data = await r.json();
                const reply = r.ok ? data.reply : ('⚠️ ' + (data.error || 'Error'));
                msgs.push({ role: 'assistant', content: reply });
                document.getElementById(loadId).textContent = reply;
            } catch {
                document.getElementById(loadId).textContent = '⚠️ ' + t.error_red;
            }
            send.disabled = false;
            msgsEl.scrollTop = msgsEl.scrollHeight;
        }

        send.addEventListener('click', sendMsg);
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
        input.focus();
    }

    // ── Segmentador ───────────────────────────────────────────────
    let _segMode = 'completa';
    let _segFile = null;

    const _SEG_MODE_DESC = {
        completa: 'Detecta todos los cambios de tema (10–20 secciones).',
        media:    'Agrupa temas relacionados en secciones de tamaño medio (6–10 secciones).',
        minimo:   'Solo cambios de tema principales (3–5 secciones).',
    };

    document.querySelectorAll('.seg-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.seg-mode-btn').forEach(b => b.classList.remove('seg-mode-btn--active'));
            btn.classList.add('seg-mode-btn--active');
            _segMode = btn.dataset.mode;
            document.getElementById('segModeDesc').textContent = _SEG_MODE_DESC[_segMode];
        });
    });

    document.getElementById('segFileInput').addEventListener('change', function() {
        _segFile = this.files[0] || null;
        document.getElementById('segFileName').textContent = _segFile ? _segFile.name : 'Ningún archivo seleccionado';
        document.getElementById('segStartBtn').disabled = !_segFile;
        document.getElementById('segPreview').classList.add('hidden');
    });

    document.getElementById('segStartBtn').addEventListener('click', async () => {
        if (!_segFile) return;
        const startBtn  = document.getElementById('segStartBtn');
        const progress  = document.getElementById('segProgress');
        const preview   = document.getElementById('segPreview');

        startBtn.disabled = true;
        progress.classList.remove('hidden');
        preview.classList.add('hidden');

        try {
            const contenido = await _segFile.text();
            const r = await _authFetch(`${_API_HOST}/segmentar-archivo`, {
                method: 'POST',
                body: JSON.stringify({ contenido, nombre: _segFile.name, modo: _segMode }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'Error al procesar');

            // Auto-descarga
            const base = _segFile.name.replace(/\.[^/.]+$/, '');
            const blob = new Blob([data.resultado], { type: 'text/plain;charset=utf-8' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href = url; a.download = `${base}_segmentado.txt`;
            a.click();
            URL.revokeObjectURL(url);

            // Vista previa solo para Completa y Media
            if (_segMode !== 'minimo') {
                const words    = data.resultado.split(/\s+/);
                const preview500 = words.slice(0, 500).join(' ') + (words.length > 500 ? '…' : '');
                document.getElementById('segPreviewBody').textContent = preview500;
                preview.classList.remove('hidden');
            }
        } catch (e) {
            alert('Error: ' + e.message);
        } finally {
            progress.classList.add('hidden');
            startBtn.disabled = !_segFile;
        }
    });
}

// ─── Evaluador de Nivel MCER de Texto ──────────────────────────

function loadTextAnalyzer() {
    const t = currentTranslations;
    mainContainer.innerHTML = '';
    renderLanguageBar();

    const _LEVEL_COLORS = { A1:'#10b981', A2:'#34d399', B1:'#3b82f6', B2:'#6366f1', C1:'#8b5cf6', C2:'#ec4899' };
    const _LEVEL_BARS   = { A1:1, A2:2, B1:3, B2:4, C1:5, C2:6 };

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="anl-wrap">

            <div class="lt-header">
                <button class="school-back-btn" id="anlBackBtn">← ${t.volver || 'Volver'}</button>
                <h2 class="lt-title">🔍 ${t.analyzer_title}</h2>
            </div>

            <div class="anl-card anl-intro-card">
                <p class="anl-intro-body">${t.analyzer_intro_body}</p>
                <div class="anl-intro-tips">
                    <span class="anl-tip anl-tip--ok">✅ ${t.analyzer_tip_ideal}</span>
                    <span class="anl-tip anl-tip--warn">⚠️ ${t.analyzer_tip_min}</span>
                </div>
            </div>

            <div class="lt-card">
                <label class="lt-label">${t.analyzer_text_label}</label>
                <textarea class="lt-text-input" id="anlText" rows="10"
                    placeholder="${t.analyzer_text_placeholder}"></textarea>
                <div class="lt-input-foot">
                    <span class="lt-char-count" id="anlWordCount">0 ${t.words}</span>
                    <button class="lt-paste-btn" id="anlPasteBtn">📋 ${t.pegar}</button>
                </div>
            </div>

            <button class="anl-analyze-btn" id="anlAnalyzeBtn" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                ${t.analyzer_analyze_btn}
            </button>

            <div id="anlResults"></div>

        </div>
    `);

    document.getElementById('anlBackBtn').addEventListener('click', showMainMenu);

    const anlTextarea = document.getElementById('anlText');

    document.getElementById('anlPasteBtn').addEventListener('click', async () => {
        try {
            const txt = await navigator.clipboard.readText();
            anlTextarea.value = txt;
            _anlUpdateCount();
        } catch {}
    });

    anlTextarea.addEventListener('input', _anlUpdateCount);

    function _anlUpdateCount() {
        const words = anlTextarea.value.trim().split(/\s+/).filter(Boolean).length;
        const el    = document.getElementById('anlWordCount');
        if (el) {
            el.textContent = `${words} ${words === 1 ? t.word_singular : t.words}`;
            el.className   = 'lt-char-count' + (words < 50 ? ' anl-count--warn' : words >= 150 ? ' anl-count--ok' : '');
        }
        const btn = document.getElementById('anlAnalyzeBtn');
        if (btn) btn.disabled = words < 10;
    }

    document.getElementById('anlAnalyzeBtn').addEventListener('click', async () => {
        const text = anlTextarea.value.trim();
        const lang = sourceLang || 'en';
        const btn  = document.getElementById('anlAnalyzeBtn');
        const results = document.getElementById('anlResults');

        btn.disabled = true;
        btn.innerHTML = `<div class="school-dots"><span></span><span></span><span></span></div> ${t.analyzer_analyzing}`;
        results.innerHTML = '';

        try {
            const r    = await _authFetch(`${_API_HOST}/analyze-level`, {
                method: 'POST',
                body:   JSON.stringify({ text, lang })
            });
            const data = await r.json();

            if (!r.ok || !data.analysis) {
                results.innerHTML = `<div class="anl-error">⚠️ ${escapeHtml(data.error || t.analyzer_error_generic)}</div>`;
                return;
            }

            const a = data.analysis;
            const levelColor = _LEVEL_COLORS[a.level_overall] || '#6366f1';
            const levelBars  = _LEVEL_BARS[a.level_overall]   || 3;

            results.innerHTML = `
                <!-- Resultado principal -->
                <div class="anl-result-hero" style="border-color:${levelColor}">
                    <div class="anl-hero-left">
                        <div class="anl-level-badge" style="background:${levelColor}">${escapeHtml(a.level_overall || '?')}</div>
                        <div>
                            <div class="anl-level-name">${escapeHtml(a.level_label || '')}</div>
                            <div class="anl-confidence">${t.analyzer_confidence_label} <strong>${escapeHtml(a.confidence || '—')}</strong></div>
                        </div>
                    </div>
                    <div class="anl-level-bar-wrap">
                        ${['A1','A2','B1','B2','C1','C2'].map((l,i) => `
                            <div class="anl-level-seg ${i < levelBars ? 'filled' : ''}" style="${i < levelBars ? `background:${_LEVEL_COLORS[l]}` : ''}">
                                <span>${l}</span>
                            </div>`).join('')}
                    </div>
                    <p class="anl-summary">${escapeHtml(a.summary || '')}</p>
                </div>

                <!-- Dimensiones -->
                <div class="anl-dimensions">
                    ${[
                        { key:'vocabulary', icon:'📖', label:t.analyzer_dim_vocabulary },
                        { key:'grammar',    icon:'🔤', label:t.analyzer_dim_grammar   },
                        { key:'syntax',     icon:'📐', label:t.analyzer_dim_syntax    },
                        { key:'register',   icon:'🎭', label:t.analyzer_dim_register  },
                    ].map(d => {
                        const dim = a.dimensions?.[d.key] || {};
                        const col = _LEVEL_COLORS[dim.level] || '#94a3b8';
                        const bars = _LEVEL_BARS[dim.level] || 0;
                        return `
                        <div class="anl-card anl-dim-card">
                            <div class="anl-dim-head">
                                <span class="anl-dim-icon">${d.icon}</span>
                                <span class="anl-dim-name">${d.label}</span>
                                <span class="anl-dim-level" style="background:${col}">${dim.level || '?'}</span>
                            </div>
                            <div class="anl-dim-mini-bar">
                                ${[1,2,3,4,5,6].map(i => `<div class="anl-dim-seg ${i <= bars ? 'filled' : ''}" style="${i <= bars ? `background:${col}` : ''}"></div>`).join('')}
                            </div>
                            <p class="anl-dim-note">${escapeHtml(dim.note || dim.label || '')}</p>
                        </div>`;
                    }).join('')}
                </div>

                <!-- Tags + palabras difíciles + estadísticas -->
                <div class="anl-cards-row">

                    ${a.register_tags?.length ? `
                    <div class="anl-card anl-info-card">
                        <div class="anl-info-title">🎭 ${t.analyzer_dim_register}</div>
                        <div class="anl-tags">
                            ${a.register_tags.map(tag => `<span class="anl-tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>` : ''}

                    ${a.grammar_structures?.length ? `
                    <div class="anl-card anl-info-card">
                        <div class="anl-info-title">🔤 ${t.analyzer_grammar_structures_title}</div>
                        <div class="anl-tags">
                            ${a.grammar_structures.map(s => `<span class="anl-tag anl-tag--grammar">${escapeHtml(s)}</span>`).join('')}
                        </div>
                    </div>` : ''}

                    ${a.hard_words?.length ? `
                    <div class="anl-card anl-info-card">
                        <div class="anl-info-title">💬 ${t.analyzer_hard_words_title}</div>
                        <div class="anl-tags">
                            ${a.hard_words.map(w => `<span class="anl-tag anl-tag--word">${escapeHtml(w)}</span>`).join('')}
                        </div>
                    </div>` : ''}

                    <div class="anl-card anl-info-card">
                        <div class="anl-info-title">📊 ${t.analyzer_stats_title}</div>
                        <div class="anl-stats-grid">
                            <div class="anl-stat"><span class="anl-stat-num">${a.word_count ?? '—'}</span><span class="anl-stat-lbl">${t.words}</span></div>
                            <div class="anl-stat"><span class="anl-stat-num">${a.avg_sentence_length ?? '—'}</span><span class="anl-stat-lbl">${t.analyzer_stat_words_per_sentence}</span></div>
                        </div>
                    </div>

                </div>

                <!-- Recomendaciones pedagógicas -->
                ${a.pedagogical ? `
                <div class="anl-pedagogy-card">
                    <div class="anl-info-title">🎓 ${t.analyzer_pedagogy_title}</div>
                    <div class="anl-pedagogy-row">
                        <div class="anl-pedagogy-item">
                            <span class="anl-ped-label">${t.analyzer_suitable_for_label}</span>
                            <span class="anl-ped-value">${escapeHtml(a.pedagogical.suitable_for || '—')}</span>
                        </div>
                        <div class="anl-pedagogy-item">
                            <span class="anl-ped-label">${t.analyzer_challenges_label}</span>
                            <span class="anl-ped-value">${escapeHtml(a.pedagogical.challenges || '—')}</span>
                        </div>
                        <div class="anl-pedagogy-item anl-pedagogy-item--full">
                            <span class="anl-ped-label">${t.analyzer_suggestions_label}</span>
                            <span class="anl-ped-value">${escapeHtml(a.pedagogical.suggestions || '—')}</span>
                        </div>
                    </div>
                </div>` : ''}

                <button class="anl-reset-btn" id="anlResetBtn">← ${t.analyzer_reset_btn}</button>
            `;

            results.scrollIntoView({ behavior: 'smooth', block: 'start' });

            document.getElementById('anlResetBtn').addEventListener('click', () => {
                results.innerHTML = '';
                anlTextarea.value = '';
                _anlUpdateCount();
                anlTextarea.scrollIntoView({ behavior: 'smooth' });
            });

        } catch (e) {
            results.innerHTML = `<div class="anl-error">⚠️ ${t.analyzer_error_network}</div>`;
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> ${t.analyzer_analyze_btn}`;
        }
    });
}

function _ltSplitParagraphs(text) {
    return text
        .split(/\n{2,}/)
        .map(p => p.replace(/\n/g, ' ').trim())
        .filter(p => p.length > 0);
}

// ─── Modo Traductor Simple ────────────────────────────────────
function loadSimpleMode() {
    const t = currentTranslations;
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="smp-wrap">

            <!-- Introducción -->
            <div class="smp-intro-card">
                <p class="smp-intro-title">🔄 ${t.smp_intro_title}</p>
                <p class="smp-intro-body">${t.smp_intro_body}</p>
            </div>

            <!-- Área de entrada -->
            <div class="smp-input-card">

                <!-- Fila superior: contexto opcional + toggle AUTO -->
                <div class="smp-top-row">
                    <button class="smp-context-hint-toggle" id="smpContextHintToggle">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        ${t.insertar_contexto}
                        <span class="smp-context-hint-optional">${t.opcional}</span>
                        <svg class="smp-context-hint-arrow" width="11" height="11" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="smp-auto-btn" id="smpAutoBtn" data-on="false">
                        <span class="smp-auto-dot"></span>
                        ${t.auto_label}
                    </button>
                </div>

                <!-- Campo de contexto opcional (se expande debajo de la fila superior) -->
                <div class="smp-context-hint-box hidden" id="smpContextHintBox">
                    <textarea class="smp-context-hint-input" id="smpContextHint" rows="2"
                        placeholder="${t.contexto_placeholder}"></textarea>
                </div>

                <!-- Textarea + mic + clear -->
                <div class="smp-textarea-wrap">
                    <button class="smp-mic-float-btn" id="smpMicFloatBtn" title="Activar/desactivar micrófono">
                        <span class="smp-mic-float-label">MIC:</span>
                        <span class="smp-mic-float-icon">🎤</span>
                        <span class="smp-mic-float-state">OFF</span>
                    </button>
                    <textarea class="smp-textarea" id="sourceText" rows="3"
                        placeholder="${t.escribe_o_pega || 'Escribe o pega tu frase aquí...'}"></textarea>
                    <div class="smp-textarea-foot">
                        <button class="smp-paste-btn" id="smpPasteBtn" title="${t.pegar}">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                <rect x="8" y="2" width="8" height="4" rx="1"/>
                            </svg>
                            ${t.pegar}
                        </button>
                        <button class="smp-mic-btn" id="smpMicBtn" title="${t.dictar_texto_tooltip}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="2" width="6" height="12" rx="3"/>
                                <path d="M5 10a7 7 0 0 0 14 0"/>
                                <line x1="12" y1="19" x2="12" y2="22"/>
                                <line x1="8" y1="22" x2="16" y2="22"/>
                            </svg>
                        </button>
                        <button class="smp-mic-btn" id="smpSourceAudioBtn" title="${t.escuchar_tooltip}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </button>
                        <span class="smp-char-count" id="smpCharCount">0</span>
                        <button class="smp-clear-btn hidden" id="smpClearBtn" title="${t.limpiar_tooltip}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="smp-correction-banner hidden" id="smpCorrectionBanner">
                    <span class="smp-correction-text" id="smpCorrectionText"></span>
                    <button class="smp-correction-ignore-btn" id="smpCorrectionIgnoreBtn">Ignorar</button>
                </div>
            </div>

            <!-- Barra de controles -->
            <div class="smp-controls-bar">
                <div class="smp-controls-left">
                    <button class="school-back-btn" id="backMenuBtn">← ${t.volver || 'Volver'}</button>
                    <button class="smp-extra-btn smp-syn-inline-btn hidden" id="smpSynonymsBtn">📚 ${t.ver_sinonimos_btn}</button>
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

            <!-- Fila proveedor voz/mic -->
            <div class="smp-provider-row">
                <div class="smp-voice-select-group">
                    <span class="smp-voice-label">Voz/Mic:</span>
                    <select class="school-level-select" id="voiceMethodSelect">
                        <option value="none">— Ninguna —</option>
                        <option value="webspeech">Web (Chrome)</option>
                        <option value="mms">🌍 Meta MMS</option>
                    </select>
                </div>
            </div>

            <!-- Aviso voz Chrome -->
            <div class="smp-voice-notice hidden" id="smpVoiceNotice">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Asegurate de elegir esta opción usando <strong>Chrome</strong>
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
                                            data-target="${v.id}" title="${t.escuchar_tooltip}">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3"/>
                                        </svg>
                                    </button>
                                    <!-- Copiar -->
                                    <button class="smp-action-btn smp-copy-btn"
                                            data-target="${v.id}" title="${t.copiar_tooltip}">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                    </button>
                                    <!-- Guardar flashcard -->
                                    <button class="smp-action-btn smp-flash-btn"
                                            data-target="${v.id}" title="${t.guardar_flashcard_tooltip}">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="8" width="14" height="10" rx="2"/>
                                            <rect x="7" y="4" width="14" height="10" rx="2"/>
                                        </svg>
                                    </button>
                                    <!-- Info: qué hace "guardar flashcard" -->
                                    <button class="smp-action-btn smp-flash-info-btn" title="¿Qué hace esto?">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="16" x2="12" y2="11"/>
                                            <circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="none"/>
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
                            <strong>${t.premium_gate_title}</strong>
                            <span>${t.premium_gate_subtitle}</span>
                        </div>
                        <button class="smp-gate-btn" id="smpGateBtn">${t.ver_planes_btn}</button>
                    </div>

                    <!-- Ampliar traducciones -->
                    <div class="smp-ampliar-wrap hidden" id="smpAmpiarWrap">
                        <div class="smp-ampliar-trigger">
                            <button class="smp-ampliar-btn" id="smpAmpiarBtn">
                                <span class="smp-ampliar-icon">⊕</span>
                                ${t.ampliar_traducciones_btn}
                            </button>
                        </div>
                        <div class="smp-ampliar-panel hidden" id="smpAmpiarPanel"></div>
                    </div>

                    <!-- Ad slot (solo usuarios free) -->
                    <div class="smp-ad-slot hidden" id="smpAdSlot">
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="${_AD_CLIENT}"
                             data-ad-slot="${_AD_SLOT_TRANSLATE}"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                    </div>

                    <!-- IA in Context -->
                    <div class="smp-extra-actions hidden" id="smpExtraActions">
                        <div class="smp-extra-btns">
                            <button class="smp-extra-btn smp-extra-btn--ia" id="smpContextBtn">💬 ${t.ia_in_context_btn}</button>
                        </div>
                        <div class="smp-context-area hidden" id="smpContextArea">
                            <div class="smp-context-messages hidden" id="smpContextMessages"></div>
                            <div class="smp-context-input-row">
                                <textarea class="smp-context-input" id="smpContextInput"
                                    placeholder="${t.escribe_tu_pregunta_placeholder}" rows="2"></textarea>
                                <button class="smp-context-send-btn" id="smpContextSendBtn">→</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Footer Cohere -->
            <div class="smp-ai-footer">
                <span class="smp-ai-footer-text">🌿 Esta app usa <strong>Cohere AI</strong> por sus políticas éticas y ecológicas</span>
                <a class="smp-ai-footer-btn" href="https://cohere.com" target="_blank" rel="noopener noreferrer">Conocer Cohere →</a>
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
    const micBtn         = document.getElementById('smpMicBtn');
    const sourceAudioBtn = document.getElementById('smpSourceAudioBtn');
    const pasteBtn       = document.getElementById('smpPasteBtn');
    const placeholder    = document.getElementById('smpPlaceholder');
    const loadingEl      = document.getElementById('smpLoading');
    const cardsEl        = document.getElementById('smpCards');
    const voiceSelect    = document.getElementById('voiceMethodSelect');
    const voiceNotice    = document.getElementById('smpVoiceNotice');

    // Mic oculto hasta que se elija método de voz
    micBtn.style.display = 'none';

    voiceSelect.addEventListener('change', () => {
        const val = voiceSelect.value;
        const isWeb   = val === 'webspeech';
        const isMms   = val === 'mms';
        micBtn.style.display = (isWeb || isMms) ? '' : 'none';
        voiceNotice.classList.toggle('hidden', !isWeb);
        if (!isMms) document.querySelector('.smp-mms-trial-notice')?.remove();
    });

    // ── Contexto opcional ─────────────────────────────────────
    const ctxToggle = document.getElementById('smpContextHintToggle');
    const ctxBox    = document.getElementById('smpContextHintBox');
    ctxToggle.addEventListener('click', () => {
        const open = !ctxBox.classList.contains('hidden');
        ctxBox.classList.toggle('hidden', open);
        ctxToggle.querySelector('.smp-context-hint-arrow').style.transform = open ? '' : 'rotate(180deg)';
        if (!open) document.getElementById('smpContextHint').focus();
    });

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
        document.getElementById('smpCorrectionBanner')?.classList.add('hidden');
        if (autoTranslate) {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => doTranslate(), 900);
        }
    });

    document.getElementById('smpCorrectionIgnoreBtn')?.addEventListener('click', () => {
        document.getElementById('smpCorrectionBanner').classList.add('hidden');
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
    const _langMap  = { es:'es-ES', en:'en-US', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-BR', zh:'zh-CN', ja:'ja-JP', ko:'ko-KR', ar:'ar-SA', ru:'ru-RU', nl:'nl-NL', pl:'pl-PL', tr:'tr-TR' };

    // Shared float button + state
    const micFloatBtn = document.getElementById('smpMicFloatBtn');
    function _setMicFloatState(on) {
        if (!micFloatBtn) return;
        micFloatBtn.classList.toggle('active', on);
        micFloatBtn.querySelector('.smp-mic-float-state').textContent = on ? 'ON' : 'OFF';
    }

    // ── WebSpeech ─────────────────────────────────────────────
    let recognition = null;
    if (SpeechRec) {
        recognition = new SpeechRec();
        recognition.lang           = _langMap[sourceLang] || 'es-ES';
        recognition.continuous     = false;
        recognition.interimResults = true;
        recognition.onresult = e => {
            const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
            sourceArea.value = transcript;
            charCount.textContent = transcript.length;
            clearBtn.classList.toggle('hidden', transcript.length === 0);
            if (e.results[0].isFinal && autoTranslate) doTranslate();
        };
        recognition.onend  = () => { isRecording = false; micBtn.dataset.recording = 'false'; _setMicFloatState(false); };
        recognition.onerror = () => { isRecording = false; micBtn.dataset.recording = 'false'; _setMicFloatState(false); };
    }

    // ── Meta MMS STT ──────────────────────────────────────────
    let _mmsRec = null, _mmsChunks = [], _isMmsRec = false;

    function _showMmsNotice(msg) {
        document.querySelector('.smp-mms-trial-notice')?.remove();
        const el = document.createElement('div');
        el.className = 'smp-mms-trial-notice';
        el.innerHTML = `<span>${msg}</span><button class="smp-mms-trial-close" onclick="this.parentElement.remove()">✕</button>`;
        voiceNotice.insertAdjacentElement('afterend', el);
    }

    async function _startMmsRec() {
        if (_isMmsRec) { _mmsRec?.stop(); return; }
        let stream;
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
        catch(e) { _showMmsNotice('No se pudo acceder al micrófono. Revisá los permisos del navegador.'); return; }

        _mmsChunks = [];
        _isMmsRec = true;
        micBtn.dataset.recording = 'true';
        _setMicFloatState(true);

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
        _mmsRec = new MediaRecorder(stream, { mimeType });
        _mmsRec.ondataavailable = e => { if (e.data.size > 0) _mmsChunks.push(e.data); };
        _mmsRec.onstop = () => {
            _isMmsRec = false;
            micBtn.dataset.recording = 'false';
            _setMicFloatState(false);
            stream.getTracks().forEach(t => t.stop());
            const blob = new Blob(_mmsChunks, { type: mimeType });
            const reader = new FileReader();
            reader.onloadend = async () => {
                const b64 = reader.result.split(',')[1];
                try {
                    const r = await _authFetch(`${_API_HOST}/speech/mms-stt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ audioBase64: b64, lang: sourceLang, mimeType }),
                    });
                    const data = await r.json();
                    if (!r.ok) {
                        if (data.code === 'TRIAL_EXPIRED') {
                            _showMmsNotice('⏱️ Tu prueba de 7 días de <strong>Meta MMS</strong> expiró. Actualizá a <strong>Premium</strong> para continuar.');
                        } else if (data.code === 'AUTH_REQUIRED') {
                            _showMmsNotice('Iniciá sesión para usar Meta MMS.');
                        } else {
                            _showMmsNotice(data.error || 'Error en Meta MMS.');
                        }
                        return;
                    }
                    if (data.text) {
                        sourceArea.value = data.text;
                        charCount.textContent = String(data.text.length);
                        clearBtn.classList.toggle('hidden', !data.text.length);
                        if (autoTranslate) doTranslate();
                    } else {
                        _showMmsNotice('No se detectó voz. Hablá más cerca del micrófono.');
                    }
                    if (data.trialDaysLeft != null) {
                        _showMmsNotice(`🎁 Meta MMS (prueba): ${data.trialDaysLeft} día${data.trialDaysLeft !== 1 ? 's' : ''} restante${data.trialDaysLeft !== 1 ? 's' : ''}`);
                    }
                } catch(e) { console.error('MMS STT:', e); }
            };
            reader.readAsDataURL(blob);
        };
        _mmsRec.start();
    }

    // ── Mic click unificado ───────────────────────────────────
    micBtn.addEventListener('click', () => {
        if (voiceSelect.value === 'mms') { _startMmsRec(); return; }
        if (!recognition) return;
        if (isRecording) { recognition.stop(); return; }
        isRecording = true;
        micBtn.dataset.recording = 'true';
        recognition.lang = _langMap[sourceLang] || 'es-ES';
        recognition.start();
    });

    // ── MicFloat click unificado ──────────────────────────────
    micFloatBtn?.addEventListener('click', () => {
        if (voiceSelect.value === 'mms') { _startMmsRec(); return; }
        const on = micFloatBtn.classList.contains('active');
        if (on) {
            recognition?.stop();
            _setMicFloatState(false);
        } else {
            if (voiceSelect.value !== 'webspeech') {
                voiceSelect.value = 'webspeech';
                voiceSelect.dispatchEvent(new Event('change'));
            }
            if (!recognition) return;
            _setMicFloatState(true);
            isRecording = true;
            micBtn.dataset.recording = 'true';
            recognition.lang = _langMap[sourceLang] || 'es-ES';
            recognition.start();
        }
    });

    if (!SpeechRec) micBtn.style.display = 'none';

    // ── Prompt de activación de mic al entrar ─────────────────
    function _showMicReadyToast() {
        const t = document.createElement('div');
        t.className = 'smp-mic-ready-toast';
        t.innerHTML = `🎤 Micrófono activado — listo para grabar`;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('visible'));
        setTimeout(() => {
            t.classList.remove('visible');
            setTimeout(() => t.remove(), 400);
        }, 3000);
    }

    (function _showMicPrompt() {
        if (localStorage.getItem('smp_mic_prompt_dismissed')) return;
        const hasMic = !!navigator.mediaDevices?.getUserMedia;
        if (!hasMic) return;

        const banner = document.createElement('div');
        banner.className = 'smp-mic-prompt';
        banner.innerHTML = `
            <span class="smp-mic-prompt-icon">🎤</span>
            <div class="smp-mic-prompt-body">
                <strong>¿Activar micrófono?</strong>
                <span>Podés dictar texto. La primera vez puede tardar unos segundos en estar listo.</span>
            </div>
            <div class="smp-mic-prompt-actions">
                <button class="smp-mic-prompt-yes">Activar</button>
                <button class="smp-mic-prompt-no">Ahora no</button>
            </div>`;

        const container = document.querySelector('.smp-container') || document.querySelector('#smpContainer') || sourceArea.closest('div');
        sourceArea.parentElement.insertAdjacentElement('beforebegin', banner);

        banner.querySelector('.smp-mic-prompt-yes').addEventListener('click', () => {
            banner.remove();
            localStorage.setItem('smp_mic_prompt_dismissed', '1');
            voiceSelect.value = 'mms';
            voiceSelect.dispatchEvent(new Event('change'));
            setTimeout(_showMicReadyToast, 300);
        });
        banner.querySelector('.smp-mic-prompt-no').addEventListener('click', () => {
            banner.remove();
            localStorage.setItem('smp_mic_prompt_dismissed', '1');
        });
    })();

    // ── Volver ────────────────────────────────────────────────
    document.getElementById('backMenuBtn').addEventListener('click', showMainMenu);

    // ── TTS ───────────────────────────────────────────────────
    function speakText(text, lang = targetLang) {
        if (!text || text === '—') return;
        const u   = new SpeechSynthesisUtterance(text);
        u.rate    = parseFloat(speedSelect.value);
        const lm  = { es:'es-ES', en:'en-US', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-BR' };
        u.lang    = lm[lang] || 'es-ES';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }

    // ── Escuchar texto introducido ────────────────────────────
    sourceAudioBtn?.addEventListener('click', () => {
        speakText(sourceArea.value.trim(), sourceLang);
    });

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
    let _translateAdPushed = false;
    function showCards() {
        placeholder.classList.add('hidden');
        loadingEl.classList.add('hidden');
        cardsEl.classList.remove('hidden');
        const adSlot = document.getElementById('smpAdSlot');
        if (adSlot && _shouldShowAds()) {
            adSlot.classList.remove('hidden');
            if (!_translateAdPushed) {
                _translateAdPushed = true;
                try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
            }
        }
    }

    // ── Traducir ──────────────────────────────────────────────
    async function doTranslate() {
        const text    = sourceArea.value.trim();
        if (!text) return;
        const context = document.getElementById('smpContextHint')?.value.trim() || '';
        showLoading();
        translateBtn.disabled = true;

        try {
            const res = await _authFetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ text, sourceLang, targetLang, ...(context ? { context } : {}) })
            });
            if (res.status === 429) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || '⏱ ' + t.rate_limit_error);
            }
            if (!res.ok) throw new Error(`Error ${res.status} — ${t.translate_error_retry}`);
            const data = await res.json();
            const obj  = JSON.parse(data.translation);

            const corrBanner = document.getElementById('smpCorrectionBanner');
            const corrText   = document.getElementById('smpCorrectionText');
            if (obj.correction?.hadErrors && obj.correction.correctedText && obj.correction.correctedText !== text) {
                corrText.textContent = `¿Quisiste decir: "${obj.correction.correctedText}"?`;
                corrBanner.classList.remove('hidden');
            } else {
                corrBanner.classList.add('hidden');
            }

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
                        <button class="smp-action-btn lex-ex-audio-btn" data-idx="${i}" title="${t.escuchar_tooltip}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </button>
                    </div>`).join('');
                lexEl.innerHTML = `
                    <div class="lex-header">
                        <span class="lex-type">${escapeHtml(obj.lexical.type || '')}</span>
                        <span class="lex-details">${escapeHtml(obj.lexical.details || '')}</span>
                    </div>
                    <div class="lex-examples-title">📝 Ejemplos de uso</div>
                    <div class="lex-examples">${exHTML}</div>`;
                lexEl.classList.remove('hidden');
                lexEl.querySelectorAll('.lex-ex-audio-btn').forEach(btn => {
                    btn.onclick = () => {
                        const ex = (obj.lexical.examples || [])[+btn.dataset.idx];
                        if (ex) speakText(ex.target, targetLang);
                    };
                });
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
                ampiarBtn.innerHTML = `<span class="smp-ampliar-icon">⊕</span> ${t.ampliar_traducciones_btn}`;
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
            const ctxMsgsEl = document.getElementById('smpContextMessages');
            ctxMsgsEl.innerHTML = '';
            ctxMsgsEl.classList.add('hidden');
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
            ? `<span class="smp-ampliar-icon">⊕</span> ${t.ampliar_traducciones_btn}`
            : `<span class="smp-ampliar-icon">⊖</span> ${t.ocultar_contextos_btn}`;
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
            showToast(t.no_clipboard_toast);
        }
    });

    // ── Ver Sinónimos ─────────────────────────────────────────
    document.getElementById('smpSynonymsBtn').addEventListener('click', async () => {
        const btn      = document.getElementById('smpSynonymsBtn');
        const resultEl = document.getElementById('smpSynonymsResult');
        if (!_lastTranslated) return;
        btn.disabled   = true;
        btn.textContent = t.cargando;
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
            showToast('❌ ' + t.sinonimos_error_toast);
        } finally {
            btn.disabled    = false;
            btn.textContent = `📚 ${t.ver_sinonimos_btn}`;
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

    function _addContextBubble(role, html) {
        const msgsEl = document.getElementById('smpContextMessages');
        msgsEl.classList.remove('hidden');
        const div = document.createElement('div');
        div.className = `smp-ctx-msg smp-ctx-msg--${role}`;
        div.innerHTML = html;
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return div;
    }

    async function sendContextMessage() {
        const input   = document.getElementById('smpContextInput');
        const msg     = input.value.trim();
        const sendBtn = document.getElementById('smpContextSendBtn');
        if (!msg || !_lastTranslated) return;

        input.value = '';
        _ctxMessages.push({ role: 'user', content: msg });
        _addContextBubble('user', escapeHtml(msg));
        const thinkingEl = _addContextBubble('assistant', '<span class="smp-ctx-loading">…</span>');
        sendBtn.disabled = true;

        try {
            const res  = await fetch(`${_API_HOST}/context-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: _lastTranslated, messages: _ctxMessages, sourceLang, targetLang, uiLang: appUILanguage })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            _ctxMessages.push({ role: 'assistant', content: data.reply });
            thinkingEl.innerHTML = escapeHtml(data.reply);
        } catch {
            _ctxMessages.pop();
            thinkingEl.classList.add('smp-ctx-msg--err');
            thinkingEl.textContent = `❌ ${t.context_error_toast}`;
        } finally {
            sendBtn.disabled = false;
            input.focus();
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
                if (!requireAuthForAction('guardar en el Cajón')) return;
                const el          = document.getElementById(btn.dataset.target);
                const translation = el?.textContent || '';
                addToCajon(originalText, translation, sourceLang, targetLang);
                if (typeof misionTrack === 'function') misionTrack('flashcard');
                const orig = btn.innerHTML;
                btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                setTimeout(() => { btn.innerHTML = orig; }, 1500);
                showToast('📥 Guardado en el Cajón');
            };
        });

        // Info: qué hace "guardar flashcard"
        document.querySelectorAll('.smp-flash-info-btn').forEach(btn => {
            btn.onclick = e => {
                e.stopPropagation();
                _toggleFlashInfoPopover(btn);
            };
        });
    }
}

// ─── Popover explicativo del botón "guardar flashcard" ─────────

function _toggleFlashInfoPopover(anchorBtn) {
    const existing = document.getElementById('smpFlashInfoPopover');
    if (existing) {
        const wasSameAnchor = existing._anchor === anchorBtn;
        existing.remove();
        if (wasSameAnchor) return;
    }

    const pop = document.createElement('div');
    pop.id = 'smpFlashInfoPopover';
    pop.className = 'smp-flash-info-popover';
    pop.textContent = 'Al guardar el texto lo enviás al Cajón, tu área de palabras guardadas. Desde ahí podés moverlas a cualquier grupo de Flashcards cuando quieras.';
    pop._anchor = anchorBtn;
    document.body.appendChild(pop);

    const rect    = anchorBtn.getBoundingClientRect();
    const maxLeft = window.innerWidth - pop.offsetWidth - 10;
    const left    = Math.max(10, Math.min(rect.left - 110, maxLeft));
    pop.style.top  = `${rect.bottom + 6}px`;
    pop.style.left = `${left}px`;

    const closeOnOutsideClick = e => {
        if (pop.contains(e.target) || e.target === anchorBtn) return;
        pop.remove();
        document.removeEventListener('click', closeOnOutsideClick, true);
    };
    setTimeout(() => document.addEventListener('click', closeOnOutsideClick, true), 0);
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

// ─── Vocabulario Contextual ───────────────────────────────────

const _VOCAB_CTX_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

async function _initVocabCtxTab(container, targetLang, sourceLang) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:1.5rem 0">Cargando vocabulario…</p>';
    const dir = _MISION_LANG_DIRS[targetLang];
    if (!dir) { container.innerHTML = ''; return; }
    const safeJson = url => fetch(url).then(r => r.ok ? r.json() : []).catch(() => []);
    const results = await Promise.all(
        _VOCAB_CTX_LEVELS.map(lvl =>
            safeJson(`${_API_HOST}/grupos_tarjetas/${encodeURIComponent(dir)}_${lvl.toLowerCase()}/${sourceLang}_${lvl.toLowerCase()}_vocabulario_contextual.json`)
        )
    );
    const hasAny = results.some(r => r.length);
    if (!hasAny) {
        container.innerHTML = `<div style="text-align:center;padding:2rem 1rem;color:var(--text-muted)"><div style="font-size:2rem;margin-bottom:.75rem">📚</div><p>Vocabulario contextual próximamente para este par de idiomas.</p></div>`;
        return;
    }
    container.innerHTML = '';
    _VOCAB_CTX_LEVELS.forEach((lvl, i) => {
        if (!results[i].length) return;
        _renderVocabCtxLevel(container, results[i], lvl, targetLang, sourceLang);
    });
}

function _renderVocabCtxLevel(container, groups, level, targetLang, srcLang) {
    const completed = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
    const cards = groups.map((g, idx) => {
        const key = `vctx_${targetLang}_${srcLang}_${level}_${idx}`;
        const done = completed.includes(key);
        return `<button class="vctx-card${done ? ' vctx-card--done' : ''}" data-key="${key}" data-idx="${idx}" data-lvl="${level}">
            ${done ? '<span class="vctx-card-check">✓</span>' : ''}
            <span class="vctx-card-scenario">${escapeHtml(g.scenario || 'Escenario')}</span>
            <span class="vctx-card-meta">${g.vocabulary?.length || 0} palabras</span>
        </button>`;
    }).join('');
    container.insertAdjacentHTML('beforeend', `
        <div class="vctx-level-section">
            <div class="vctx-level-header">${level}</div>
            <div class="vctx-cards-grid">${cards}</div>
        </div>`);
    container.querySelectorAll(`.vctx-card[data-lvl="${level}"]`).forEach(btn => {
        btn.addEventListener('click', () => {
            _showVocabCtxModule(groups[+btn.dataset.idx], btn.dataset.key);
        });
    });
}

function _showVocabCtxModule(group, key) {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    window.scrollTo(0, 0);
    const vocab = group.vocabulary || [];
    const dialogue = group.dialogue || [];
    const done = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]').includes(key);
    const vocabRows = vocab.map(v => `
        <tr>
            <td class="vctx-vocab-word">${escapeHtml(v.word)}${v.phonetic ? `<br><span class="vctx-vocab-phonetic">${escapeHtml(v.phonetic)}</span>` : ''}</td>
            <td class="vctx-vocab-pos">${escapeHtml(v.pos || '')}</td>
            <td class="vctx-vocab-trans">${escapeHtml(v.translation || '')}</td>
            <td class="vctx-vocab-note">${escapeHtml(v.note || '')}</td>
        </tr>`).join('');
    const dialogueHtml = dialogue.map(t => `
        <div class="vctx-turn">
            <span class="vctx-turn-speaker">${escapeHtml(t.speaker || '')}</span>
            <div class="vctx-turn-bubble">
                <div class="vctx-turn-text">${escapeHtml(t.text || '')}</div>
                ${t.translation ? `<div class="vctx-turn-trans">${escapeHtml(t.translation)}</div>` : ''}
                ${t.note ? `<div class="vctx-turn-note">${escapeHtml(t.note)}</div>` : ''}
            </div>
        </div>`).join('');
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="vctx-wrap">
            <div class="ma1-topbar">
                <button class="school-back-btn" id="vctxBackBtn">← Volver</button>
            </div>
            <div class="vctx-hero">
                <span class="vctx-hero-icon">🌍</span>
                <h2 class="vctx-hero-title">${escapeHtml(group.scenario || '')}</h2>
                ${group.frequency_note ? `<p class="vctx-hero-note">${escapeHtml(group.frequency_note)}</p>` : ''}
            </div>
            <div class="vctx-section">
                <div class="vctx-section-title">📝 Vocabulario</div>
                <div class="vctx-table-wrap">
                    <table class="vctx-table">
                        <thead><tr><th>Palabra</th><th>Tipo</th><th>Traducción</th><th>Nota</th></tr></thead>
                        <tbody>${vocabRows}</tbody>
                    </table>
                </div>
            </div>
            ${dialogueHtml ? `<div class="vctx-section"><div class="vctx-section-title">💬 Diálogo</div><div class="vctx-dialogue">${dialogueHtml}</div></div>` : ''}
            <div class="vctx-actions">
                <button class="ma1-quiz-start-btn" id="vctxQuizBtn">${done ? '✓ Practicado — Repetir' : '🎯 Practicar vocabulario'}</button>
            </div>
        </div>`);
    document.getElementById('vctxBackBtn').addEventListener('click', () => appMode === 'mision' ? showMainMenu() : showVocabCtxPanel());
    document.getElementById('vctxQuizBtn').addEventListener('click', () => _runVocabCtxQuiz(group, key));
}

function _genVocabCtxExercises(group) {
    const vocab = group.vocabulary || [];
    if (vocab.length < 2) return [];
    const allWords = vocab.map(v => v.word);
    const allTrans = vocab.map(v => v.translation);
    const pool = [];
    function distract(correct, full, n) {
        return _misionShuffle(full.filter(x => x && x !== correct)).slice(0, n);
    }
    vocab.forEach(v => {
        const d = distract(v.translation, allTrans, 3);
        if (d.length) pool.push({ promptLabel: '¿Qué significa?', prompt: v.word + (v.phonetic ? `  ${v.phonetic}` : ''), correct: v.translation, options: _misionShuffle([v.translation, ...d]), note: v.note || '' });
    });
    vocab.forEach(v => {
        const d = distract(v.word, allWords, 3);
        if (d.length) pool.push({ promptLabel: '¿Cómo se dice?', prompt: v.translation, correct: v.word, options: _misionShuffle([v.word, ...d]), note: v.note || '' });
    });
    return _misionShuffle(pool);
}

function _runVocabCtxQuiz(group, key) {
    const exercises = _genVocabCtxExercises(group);
    if (!exercises.length) { showToast('No hay suficiente vocabulario para el quiz.'); return; }
    const total = Math.min(exercises.length, 12);
    _runGenericQuiz(exercises.slice(0, total), {
        total,
        threshold: Math.ceil(total * 0.7),
        key,
        onPass: () => {
            const steps = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]');
            if (!steps.includes(key)) { steps.push(key); localStorage.setItem('ls_mision_steps', JSON.stringify(steps)); }
            _showVocabCtxModule(group, key);
        },
        onBack: () => _showVocabCtxModule(group, key),
    });
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
    if (storedUser) {
        currentUser = storedUser;
        if (typeof MembershipPlan !== 'undefined') MembershipPlan.syncFromUser(storedUser);
    }

    // ── Resolver idioma de UI antes de cargar traducciones ──────
    // Prioridad: localStorage > uiLanguage guardado en cuenta > país del usuario > navegador
    if (!localStorage.getItem('appUILanguage')) {
        if (storedUser?.uiLanguage && _supportedLangs.includes(storedUser.uiLanguage)) {
            // Tiene idioma guardado en su cuenta (cross-device)
            appUILanguage = storedUser.uiLanguage;
        } else if (storedUser?.country && _COUNTRY_UI_LANG[storedUser.country]) {
            // Primera vez: usar idioma del país detectado por IP
            const suggested = _COUNTRY_UI_LANG[storedUser.country];
            if (_supportedLangs.includes(suggested)) appUILanguage = suggested;
        }
        // Persistir para evitar recalcular en cada carga
        localStorage.setItem('appUILanguage', appUILanguage);
    }

    // Cargar configuración (antes de traducciones para que appSettings.uiLanguage tenga prioridad)
    loadSettings();
    _initFab();
    if (appSettings?.uiLanguage && appSettings.uiLanguage !== appUILanguage) {
        appUILanguage = appSettings.uiLanguage;
        localStorage.setItem('appUILanguage', appUILanguage);
    }

    // Verificar sesión en background — si el servidor devuelve un uiLanguage distinto, aplicarlo
    if (storedUser && typeof authVerifySession === 'function') {
        authVerifySession().then(async verified => {
            if (verified) {
                currentUser = verified;
                if (typeof MembershipPlan !== 'undefined') MembershipPlan.syncFromUser(verified);
                updateAdminButton();
                // Dispara notificaciones programadas (daily tip, subscription reminder) silenciosamente
                _authFetch(`${_API_HOST}/notifications/check`, { method: 'POST', body: '{}' }).catch(() => {});
                _updateDayStreak();
                // Aplicar idioma del servidor si difiere del actual (cambio desde otro dispositivo)
                if (verified.uiLanguage && verified.uiLanguage !== appUILanguage && _supportedLangs.includes(verified.uiLanguage)) {
                    appUILanguage = verified.uiLanguage;
                    localStorage.setItem('appUILanguage', appUILanguage);
                    await loadTranslations(appUILanguage);
                    applyUILanguage();
                    updateMenuLanguageDisplay();
                }
            }
            // Si verified === null, el token expiró — authVerifySession ya limpió la sesión
        });
    }

    // Traducciones e idiomas de UI
    await loadTranslations(appUILanguage);
    applyUILanguage();
    updateMenuLanguageDisplay();
    updateAvatarCircle();

    // Historias (practice.js las usa)
    await loadAllStories();

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
        if (typeof MembershipPlan !== 'undefined') MembershipPlan.syncFromUser(user);
        if (user?.preferredLang && !targetLang) saveLanguages('es', user.preferredLang);
        if (!sourceLang || !targetLang) saveLanguages('en', 'es');

        // Aplicar idioma de UI desde la cuenta del usuario recién logueado
        // (cubre el caso de login desde un nuevo dispositivo sin localStorage propio)
        const accountLang = user?.uiLanguage;
        if (accountLang && _supportedLangs.includes(accountLang) && accountLang !== appUILanguage) {
            appUILanguage = accountLang;
            localStorage.setItem('appUILanguage', appUILanguage);
            appSettings.uiLanguage = appUILanguage;
            await loadTranslations(appUILanguage);
            updateMenuLanguageDisplay();
        } else if (!accountLang && user?.country && _COUNTRY_UI_LANG[user.country]) {
            // Usuario nuevo: sugerir idioma por país si no tiene uno guardado
            const suggested = _COUNTRY_UI_LANG[user.country];
            if (_supportedLangs.includes(suggested) && suggested !== appUILanguage && !localStorage.getItem('_uiLangSetByUser')) {
                appUILanguage = suggested;
                localStorage.setItem('appUILanguage', appUILanguage);
                appSettings.uiLanguage = appUILanguage;
                await loadTranslations(appUILanguage);
                updateMenuLanguageDisplay();
            }
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
        _routeFromUrl();
    } else if (!_resetToken) {
        showOnboarding();
    }

    // Close article overlay with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') _closePost();
    });

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

// ─── Racha de días ────────────────────────────────────────────

function _updateDayStreak() {
    const today     = new Date().toISOString().slice(0, 10);
    const raw       = localStorage.getItem('ls_streak');
    const data      = raw ? JSON.parse(raw) : { lastDate: null, streak: 0, longest: 0 };
    if (data.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    data.streak     = data.lastDate === yesterday ? (data.streak || 0) + 1 : 1;
    data.lastDate   = today;
    data.longest    = Math.max(data.longest || 0, data.streak);
    localStorage.setItem('ls_streak', JSON.stringify(data));
}

function _getStreakData() {
    try { return JSON.parse(localStorage.getItem('ls_streak') || '{"streak":0,"longest":0}'); }
    catch { return { streak: 0, longest: 0 }; }
}

// ─── Vista de estadísticas del perfil ─────────────────────────

function _showProfileStats() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    loadFlashcardData();
    const cajon       = typeof loadCajon === 'function' ? loadCajon() : [];
    const streak      = _getStreakData();
    const cardStates  = JSON.parse(localStorage.getItem('ls_card_states') || '{}');
    const learned     = Object.values(cardStates).filter(s => s === 'learned').length;
    const reviewing   = Object.values(cardStates).filter(s => s === 'reviewing').length;
    const misionSteps = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]').length;
    const groups      = (flashcardGroups || []).length;
    const allCards    = (flashcards || []).length;

    const stat = (icon, value, label) => `
        <div class="upstats-card">
            <span class="upstats-icon">${icon}</span>
            <span class="upstats-value">${value}</span>
            <span class="upstats-label">${label}</span>
        </div>`;

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="prac-wrap">
            <div class="prac-header">
                <button class="school-back-btn" id="statsBackBtn">← Perfil</button>
            </div>
            <div style="text-align:center;margin:1rem 0 1.5rem">
                <span style="font-size:1.75rem">📊</span>
                <h2 class="prac-title-centered" style="margin:.3rem 0 0">Estadísticas</h2>
            </div>

            <div class="upstats-section-title">Racha</div>
            <div class="upstats-grid upstats-grid--2">
                ${stat('🔥', streak.streak, 'Racha actual (días)')}
                ${stat('🏆', streak.longest, 'Mejor racha')}
            </div>

            <div class="upstats-section-title">Vocabulario</div>
            <div class="upstats-grid upstats-grid--2">
                ${stat('📥', cajon.length, 'Palabras en el Cajón')}
                ${stat('🃏', allCards, 'Tarjetas propias')}
            </div>

            <div class="upstats-section-title">Progreso</div>
            <div class="upstats-grid upstats-grid--3">
                ${stat('✅', learned, 'Aprendidas')}
                ${stat('🔄', reviewing, 'En repaso')}
                ${stat('🗡️', misionSteps, 'Pasos Curso')}
            </div>

            <div class="upstats-section-title">Colección</div>
            <div class="upstats-grid upstats-grid--2">
                ${stat('📁', groups, 'Grupos creados')}
                ${stat('📚', misionSteps + learned, 'Total completado')}
            </div>
        </div>
    `);

    document.getElementById('statsBackBtn').addEventListener('click', loadUserProfile);
}

// ─── Perfil de usuario ─────────────────────────────────────────

async function loadUserProfile() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    if (!currentUser) {
        mainContainer.innerHTML = `
        <div style="max-width:480px;margin:48px auto;padding:24px;text-align:center">
            <div style="font-size:3rem;margin-bottom:16px">👤</div>
            <p style="font-size:1rem;color:var(--text-muted,#6b7280)">Iniciá sesión para ver tu perfil.</p>
            <button onclick="showOnboarding(true)" style="margin-top:16px;padding:10px 24px;background:#2d6a4f;color:#fff;border:none;border-radius:10px;font-size:.9rem;font-weight:600;cursor:pointer">Iniciar sesión</button>
        </div>`;
        return;
    }

    const plan      = currentUser.plan || 'free';
    const planLabel = plan === 'premium' ? '⭐ Premium' : plan === 'oro' ? '🥇 Oro' : plan === 'contributor' ? '🤝 Contributor' : '🆓 Gratis';
    const photo     = currentUser.profilePhoto || null;
    const bio       = currentUser.bio || '';
    const lastGroup = localStorage.getItem('lastGroupId');
    const misionProgress = JSON.parse(localStorage.getItem('ls_mision_steps') || '[]').length;

    mainContainer.insertAdjacentHTML('beforeend', `
    <div class="uprofile-wrap">

        <div class="uprofile-back-row">
            <button class="school-back-btn" id="upBackBtn">← Volver</button>
        </div>

        <!-- Header: avatar + nombre + plan -->
        <div class="uprofile-header">
            <div class="uprofile-avatar-wrap" id="upAvatarWrap" title="Cambiar foto">
                ${photo
                    ? `<img src="${photo}" class="uprofile-avatar-img" id="upAvatarImg" alt="Avatar">`
                    : `<div class="uprofile-avatar-placeholder" id="upAvatarImg">${(currentUser.name||'?')[0].toUpperCase()}</div>`}
                <div class="uprofile-avatar-edit">📷</div>
                <input type="file" id="upAvatarInput" accept="image/*" style="display:none">
            </div>
            <div class="uprofile-info">
                <div class="uprofile-name-row">
                    <span class="uprofile-name" id="upName">${_escHtml(currentUser.name || '')}</span>
                    <button class="uprofile-edit-btn" id="upEditNameBtn" title="Editar nombre">✏️</button>
                </div>
                ${currentUser.username ? `<span class="uprofile-username">@${_escHtml(currentUser.username)}</span>` : ''}
                <span class="uprofile-plan-badge">${planLabel}</span>
            </div>
        </div>

        <!-- Bio / Intro -->
        <div class="uprofile-bio-section">
            <div class="uprofile-bio-view" id="upBioView">
                <p class="uprofile-bio-text" id="upBioText">${bio ? _escHtml(bio) : '<span class="uprofile-bio-empty">Agregá una introducción breve…</span>'}</p>
                <button class="uprofile-edit-btn" id="upEditBioBtn" title="Editar introducción">✏️</button>
            </div>
            <div class="uprofile-bio-edit hidden" id="upBioEdit">
                <textarea class="uprofile-bio-textarea" id="upBioInput" maxlength="300" rows="3" placeholder="Contá algo sobre vos… (máx. 300 caracteres)">${bio}</textarea>
                <div class="uprofile-bio-actions">
                    <button class="uprofile-save-btn" id="upSaveBioBtn">Guardar</button>
                    <button class="uprofile-cancel-btn" id="upCancelBioBtn">Cancelar</button>
                </div>
            </div>
        </div>

        <!-- Botones historial -->
        <div class="uprofile-hist-row">
            <button class="uprofile-hist-btn" id="upScanHistBtn">
                <span class="uprofile-hist-icon">📷</span>
                <span>Traducciones</span>
            </button>
            <button class="uprofile-hist-btn" id="upSavedBtn">
                <span class="uprofile-hist-icon">🃏</span>
                <span>Flashcards</span>
            </button>
            <button class="uprofile-hist-btn" id="upCajonBtn">
                <span class="uprofile-hist-icon">📥</span>
                <span>El Cajón</span>
            </button>
            <button class="uprofile-hist-btn" id="upStatsBtn">
                <span class="uprofile-hist-icon">📊</span>
                <span>Estadísticas</span>
            </button>
        </div>

        <!-- Accesos directos -->
        <div class="uprofile-shortcuts">
            <h4 class="uprofile-shortcuts-title">Continuar donde lo dejaste</h4>
            <div class="uprofile-shortcuts-row">
                <button class="uprofile-shortcut-card" id="upMisionBtn">
                    <span class="uprofile-shortcut-icon">🗡️</span>
                    <span class="uprofile-shortcut-label">Curso</span>
                    <span class="uprofile-shortcut-sub">${misionProgress > 0 ? `${misionProgress} pasos completados` : 'Comenzar'}</span>
                </button>
                <button class="uprofile-shortcut-card" id="upFlashBtn">
                    <span class="uprofile-shortcut-icon">🃏</span>
                    <span class="uprofile-shortcut-label">Flashcards</span>
                    <span class="uprofile-shortcut-sub">${lastGroup ? 'Continuar último grupo' : 'Explorar flashcards'}</span>
                </button>
            </div>
        </div>

    </div>`);

    // ── Event handlers ──────────────────────────────────────────

    document.getElementById('upBackBtn').addEventListener('click', () => showMainMenu());

    // Avatar
    const avatarWrap  = document.getElementById('upAvatarWrap');
    const avatarInput = document.getElementById('upAvatarInput');
    avatarWrap.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        const b64 = await new Promise((res, rej) => {
            const img = new Image(), url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const MAX = 200, canvas = document.createElement('canvas');
                let { width: w, height: h } = img;
                if (w > MAX || h > MAX) { const r = Math.min(MAX/w, MAX/h); w = Math.round(w*r); h = Math.round(h*r); }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                res(canvas.toDataURL('image/jpeg', 0.75));
            };
            img.onerror = rej; img.src = url;
        });
        await _saveProfileField({ profilePhoto: b64 });
        const el = document.getElementById('upAvatarImg');
        if (el.tagName === 'IMG') el.src = b64;
        else { el.outerHTML = `<img src="${b64}" class="uprofile-avatar-img" id="upAvatarImg" alt="Avatar">`; }
    });

    // Nombre
    document.getElementById('upEditNameBtn').addEventListener('click', () => {
        const nameEl = document.getElementById('upName');
        const input  = document.createElement('input');
        input.type = 'text'; input.value = currentUser.name || '';
        input.className = 'uprofile-name-input';
        input.maxLength = 80;
        nameEl.replaceWith(input);
        input.focus();
        const save = async () => {
            const val = input.value.trim();
            if (!val) return;
            await _saveProfileField({ name: val });
            const span = document.createElement('span');
            span.className = 'uprofile-name'; span.id = 'upName';
            span.textContent = currentUser.name;
            input.replaceWith(span);
        };
        input.addEventListener('blur', save);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); save(); } });
    });

    // Bio
    document.getElementById('upEditBioBtn').addEventListener('click', () => {
        document.getElementById('upBioView').classList.add('hidden');
        document.getElementById('upBioEdit').classList.remove('hidden');
        document.getElementById('upBioInput').focus();
    });
    document.getElementById('upCancelBioBtn').addEventListener('click', () => {
        document.getElementById('upBioView').classList.remove('hidden');
        document.getElementById('upBioEdit').classList.add('hidden');
    });
    document.getElementById('upSaveBioBtn').addEventListener('click', async () => {
        const val = document.getElementById('upBioInput').value.trim();
        await _saveProfileField({ bio: val });
        document.getElementById('upBioText').innerHTML = val ? _escHtml(val) : '<span class="uprofile-bio-empty">Agregá una introducción breve…</span>';
        document.getElementById('upBioView').classList.remove('hidden');
        document.getElementById('upBioEdit').classList.add('hidden');
    });

    // Historial botones
    document.getElementById('upScanHistBtn').addEventListener('click', () => _renderScanHistory());
    document.getElementById('upSavedBtn').addEventListener('click', () => {
        if (typeof loadFlashcards === 'function') loadFlashcards();
    });
    document.getElementById('upCajonBtn').addEventListener('click', () => {
        if (typeof _showCajonPanel === 'function') _showCajonPanel();
    });
    document.getElementById('upStatsBtn').addEventListener('click', () => _showProfileStats());

    // Shortcuts
    document.getElementById('upMisionBtn').addEventListener('click', () => {
        const tab = document.querySelector('#appModeSelector [data-tab="mision"]');
        if (tab) tab.click();
    });
    document.getElementById('upFlashBtn').addEventListener('click', () => {
        if (typeof loadFlashcards === 'function') loadFlashcards();
    });
}

async function _saveProfileField(fields) {
    try {
        const r = await _authFetch(`${_API_HOST}/auth/profile`, {
            method: 'PUT', body: JSON.stringify(fields)
        });
        if (!r.ok) return;
        const { user } = await r.json();
        if (user) {
            currentUser = { ...currentUser, ...user };
            const s = JSON.parse(localStorage.getItem('ls_session') || '{}');
            if (s.user) { s.user = { ...s.user, ...user }; localStorage.setItem('ls_session', JSON.stringify(s)); }
        }
    } catch {}
}

// ─── FAB (Floating Action Button) ─────────────────────────────

function _applyFabPosition() {
    const fab = document.getElementById('fabContainer');
    if (!fab) return;
    const pos = (typeof appSettings !== 'undefined' && appSettings.fabPosition) || 'right';
    fab.classList.toggle('fab-left', pos === 'left');
    fab.classList.toggle('fab-right', pos !== 'left');
}

function _initFab() {
    const fab      = document.getElementById('fabMain');
    const subBtns  = document.getElementById('fabSubBtns');
    const camBtn   = document.getElementById('fabCameraBtn');
    const shortBtn = document.getElementById('fabShortcutBtn');
    const camInput = document.getElementById('fabCameraInput');
    if (!fab) return;

    _applyFabPosition();

    fab.addEventListener('click', () => {
        const open = !subBtns.classList.contains('hidden');
        subBtns.classList.toggle('hidden', open);
        fab.classList.toggle('fab-open', !open);
    });

    document.addEventListener('click', e => {
        const container = document.getElementById('fabContainer');
        if (container && !container.contains(e.target)) {
            subBtns.classList.add('hidden');
            fab.classList.remove('fab-open');
        }
    });

    camBtn?.addEventListener('click', () => {
        subBtns.classList.add('hidden');
        fab.classList.remove('fab-open');
        camInput?.click();
    });

    _updateShortcutBtn();

    let _shortLongTimer = null;
    shortBtn?.addEventListener('pointerdown', () => {
        _shortLongTimer = setTimeout(() => {
            _shortLongTimer = null;
            subBtns.classList.add('hidden');
            fab.classList.remove('fab-open');
            _openShortcutsPanel(true);
        }, 500);
    });
    shortBtn?.addEventListener('pointerup', () => clearTimeout(_shortLongTimer));
    shortBtn?.addEventListener('pointerleave', () => clearTimeout(_shortLongTimer));
    shortBtn?.addEventListener('click', () => {
        if (_shortLongTimer === null) return; // long-press already handled
        clearTimeout(_shortLongTimer);
        _shortLongTimer = null;
        subBtns.classList.add('hidden');
        fab.classList.remove('fab-open');
        const pinned = _getPinnedShortcut();
        if (pinned) {
            _executeShortcut(pinned);
        } else {
            _openShortcutsPanel(false);
        }
    });

    camInput?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        await _processCameraImage(file);
    });
}

const _FAB_SHORTCUT_KEY = 'fabPinnedShortcut';
function _getFabSections() {
    return [
        { icon: '🔄', label: 'Traducción con IA',  idx_action: 'traduccion' },
        { icon: '🧭', label: 'Exploración',         mode: 'exploracion' },
        { icon: '🗡️', label: 'Curso',                mode: 'mision' },
        { icon: '🃏', label: 'Flashcards',           idx_action: 'flashcards' },
        { icon: '⭐', label: 'Chat con Famosos',     idx_action: 'famous' },
        { icon: '🎵', label: 'Música',               idx_action: 'musicians' },
        { icon: '📡', label: 'Live Feed',             mode: 'livefeed' },
        { icon: '🎓', label: 'Class Room',            mode: 'classroom' },
        { icon: '🎬', label: 'Multimedia',            idx_action: 'immersion' },
        { icon: '👤', label: 'Perfil',               idx_action: 'profile' },
    ];
}
function _getPinnedShortcut() {
    try { return JSON.parse(localStorage.getItem(_FAB_SHORTCUT_KEY)); } catch { return null; }
}
function _setPinnedShortcut(s) {
    localStorage.setItem(_FAB_SHORTCUT_KEY, JSON.stringify(s));
    _updateShortcutBtn();
}
function _updateShortcutBtn() {
    const btn = document.getElementById('fabShortcutBtn');
    const lbl = btn?.closest('.fab-sub-item')?.querySelector('.fab-sub-label');
    const pinned = _getPinnedShortcut();
    if (pinned) {
        if (btn) btn.textContent = pinned.icon;
        if (lbl) lbl.textContent = pinned.label;
        btn?.setAttribute('title', `Ir a ${pinned.label} · Mantener para cambiar`);
    } else {
        if (btn) btn.textContent = '⚡';
        if (lbl) lbl.textContent = 'Ir a...';
        btn?.removeAttribute('title');
    }
}
function _executeShortcut(s) {
    if (s.mode) {
        const tab = document.querySelector(`#appModeSelector [data-tab="${s.mode}"]`);
        if (tab) tab.click();
    } else if (s.idx_action === 'traduccion') {
        // Go to traduccion tab first, then load SimpleMode directly
        const tab = document.querySelector('#appModeSelector [data-tab="traduccion"]');
        if (tab) tab.click();
        setTimeout(() => { if (typeof loadSimpleMode === 'function') loadSimpleMode(); }, 80);
    } else if (s.idx_action === 'flashcards') {
        if (typeof loadFlashcards === 'function') loadFlashcards();
    } else if (s.idx_action === 'famous') {
        if (typeof loadFamousChatMenu === 'function') loadFamousChatMenu();
        else document.querySelector('[data-mode="famous"]')?.click();
    } else if (s.idx_action === 'musicians') {
        if (typeof loadMusiciansMenu === 'function') loadMusiciansMenu();
        else document.querySelector('[data-mode="musicians"]')?.click();
    } else if (s.idx_action === 'immersion') {
        if (typeof loadImmersionSection === 'function') loadImmersionSection();
        else document.querySelector('[data-mode="immersion"]')?.click();
    } else if (s.idx_action === 'profile') {
        document.getElementById('profileLink')?.click();
    }
}

async function _processCameraImage(file) {
    _showCameraModal({ loading: true });
    try {
        const base64 = await new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const MAX = 1024;
                let { width, height } = img;
                if (width > MAX || height > MAX) {
                    const ratio = Math.min(MAX / width, MAX / height);
                    width  = Math.round(width  * ratio);
                    height = Math.round(height * ratio);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.75).split(',')[1]);
            };
            img.onerror = () => reject(new Error('No se pudo leer la imagen'));
            img.src = url;
        });

        const tLang = (typeof targetLang !== 'undefined' ? targetLang : null) || 'es';
        const res = await _authFetch(`${_API_HOST}/translate-image`, {
            method: 'POST',
            body: JSON.stringify({ imageBase64: base64, targetLang: tLang })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error desconocido');
        _showCameraModal({ result: data });
    } catch (err) {
        _showCameraModal({ error: err.message });
    }
}

function _showCameraModal({ loading, result, error } = {}) {
    let modal = document.getElementById('cameraModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cameraModal';
        modal.className = 'cam-modal';
        document.body.appendChild(modal);
    }

    if (loading) {
        modal.innerHTML = `<div class="cam-modal-box"><div class="cam-modal-loading"><div class="school-dots"><span></span><span></span><span></span></div><p>Analizando imagen…</p></div></div>`;
        modal.classList.add('open');
        return;
    }

    if (error) {
        modal.classList.add('open');
        modal.innerHTML = `
        <div class="cam-modal-box">
            <button class="cam-modal-close" onclick="document.getElementById('cameraModal').classList.remove('open')">✕</button>
            <p class="cam-modal-error">❌ ${_escHtml(error)}</p>
        </div>`;
        return;
    }

    if (result) {
        modal.classList.add('open');
        const { originalText, translatedText, sourceLang: sLang, targetLang: tLang, ts } = result;
        const canHistory = !!currentUser;
        modal.innerHTML = `
        <div class="cam-modal-box">
            <button class="cam-modal-close" onclick="document.getElementById('cameraModal').classList.remove('open')">✕</button>
            <h3 class="cam-modal-title">📷 Traducción de imagen</h3>
            ${originalText ? `
            <div class="cam-modal-section">
                <div class="cam-modal-label">Texto original</div>
                <div class="cam-modal-text">${_escHtml(originalText)}</div>
            </div>` : ''}
            <div class="cam-modal-section">
                <div class="cam-modal-label">Traducción</div>
                <div class="cam-modal-text cam-modal-translation">${_escHtml(translatedText || '(sin resultado)')}</div>
            </div>
            <div class="cam-modal-actions">
                ${canHistory ? `<button class="cam-save-btn" id="camSaveHistoryBtn">📋 Guardar en historial</button>` : `<span class="cam-modal-note">💡 Iniciá sesión para guardar en historial</span>`}
                <button class="cam-save-btn cam-save-txt" id="camSaveTxtBtn">💾 Guardar como .txt</button>
            </div>
        </div>`;
        modal.querySelector('#camSaveTxtBtn')?.addEventListener('click', () => {
            const content = [
                originalText ? `[Original]\n${originalText}` : '',
                `[Traducción]\n${translatedText}`,
                `\nFecha: ${new Date(ts || Date.now()).toLocaleString()}`
            ].filter(Boolean).join('\n\n');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
            a.download = `sensemate_scan_${Date.now()}.txt`;
            a.click();
        });
        modal.querySelector('#camSaveHistoryBtn')?.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            btn.disabled = true;
            btn.textContent = 'Guardando…';
            try {
                const r = await _authFetch(`${_API_HOST}/user/save-scan`, {
                    method: 'POST',
                    body: JSON.stringify({ originalText, translatedText, sourceLang: sLang, targetLang: tLang })
                });
                if (!r.ok) throw new Error();
                btn.textContent = '✅ Guardado';
            } catch {
                btn.textContent = '❌ Error al guardar';
                btn.disabled = false;
            }
        });
    }
}

function _openShortcutsPanel(forChange = false) {
    let panel = document.getElementById('shortcutsPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'shortcutsPanel';
        panel.className = 'shortcuts-panel';
        document.body.appendChild(panel);
    }

    const sections = _getFabSections();
    const pinned   = _getPinnedShortcut();
    const title    = forChange ? 'Cambiar acceso directo' : 'Elegir acceso directo';

    panel.innerHTML = `
    <div class="shortcuts-overlay" onclick="document.getElementById('shortcutsPanel').classList.remove('open')"></div>
    <div class="shortcuts-drawer">
        <div class="shortcuts-header">
            <span>${title}</span>
            <button class="shortcuts-close" onclick="document.getElementById('shortcutsPanel').classList.remove('open')">✕</button>
        </div>
        <div class="shortcuts-grid">
            ${sections.map((s, i) => {
                const active = pinned && pinned.icon === s.icon && pinned.label === s.label;
                return `<button class="shortcut-item${active ? ' shortcut-pinned' : ''}" data-idx="${i}">${s.icon}<span>${s.label}</span></button>`;
            }).join('')}
        </div>
        ${pinned ? `<p class="shortcuts-hint">Mantén presionado ⚡ para cambiar</p>` : ''}
    </div>`;

    panel.classList.add('open');

    panel.querySelectorAll('.shortcut-item').forEach(btn => {
        btn.addEventListener('click', () => {
            panel.classList.remove('open');
            const s = sections[parseInt(btn.dataset.idx)];
            _setPinnedShortcut({ icon: s.icon, label: s.label, mode: s.mode || null, idx_action: s.idx_action || null });
            _executeShortcut(s);
        });
    });
}

async function _renderScanHistory() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    if (!currentUser) {
        mainContainer.innerHTML = `
        <div style="max-width:500px;margin:40px auto;padding:20px;text-align:center">
            <p style="font-size:1.1rem;margin-bottom:12px">📷 Necesitás iniciar sesión para ver tu historial de cámara.</p>
        </div>`;
        return;
    }

    mainContainer.innerHTML = `
    <div class="scan-history-section">
        <div class="scan-history-header">
            <h2>📷 Historial de cámara</h2>
        </div>
        <div id="scanHistoryList"><div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div></div>
    </div>`;

    try {
        const res = await _authFetch(`${_API_HOST}/user/scan-history`);
        if (!res.ok) throw new Error('Error al cargar historial');
        const { scans } = await res.json();
        const list = document.getElementById('scanHistoryList');
        if (!scans.length) {
            list.innerHTML = '<div class="livefeed-empty">📭 No hay traducciones guardadas aún.</div>';
            return;
        }
        list.innerHTML = scans.map(s => `
        <div class="scan-item">
            <div class="scan-item-date">${new Date(s.ts).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</div>
            ${s.originalText ? `<div class="scan-item-original">${_escHtml(s.originalText)}</div>` : ''}
            <div class="scan-item-translation">${_escHtml(s.translatedText || '')}</div>
            <div class="scan-item-langs">${s.sourceLang || 'auto'} → ${s.targetLang || 'es'}</div>
        </div>`).join('');
    } catch (err) {
        document.getElementById('scanHistoryList').innerHTML = `<div class="admin-error">❌ ${_escHtml(err.message)}</div>`;
    }
}
