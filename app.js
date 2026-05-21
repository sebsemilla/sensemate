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
const _supportedLangs = ['es','en','fr','de','it','pt','zh','ja','ru','ar','ko','nl','pl','tr'];
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

// API
const API_URL = 'http://localhost:3000/translate';
// API_BASE is declared globally in auth.js

// Helper: fetch con JWT adjunto automáticamente
function _authFetch(url, options = {}) {
    const token = typeof authGetToken === 'function' ? authGetToken() : null;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
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
            </select>
            <button id="swapLangBtn" class="swap-btn">⇄</button>
            <select id="langBarTarget" class="lang-select">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
            </select>
            <button id="editLangBtn" class="edit-lang-btn" title="${t.cambiar_idiomas}">✏️</button>
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
document.getElementById('logoutLink').addEventListener('click',      e => { e.preventDefault(); localStorage.clear(); location.reload(); });
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
            const res = await _authFetch('http://localhost:3000/feedback', {
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

// ─── Menú principal ───────────────────────────────────────────

function showMainMenu() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    const t = currentTranslations;
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="main-menu">
            ${sectionEnabled('translator') ? `
            <div class="mode-card" data-mode="simple">
                <h2>${t.simple_mode}</h2>
                <p>${t.simple_mode_description}</p>
                <p>${t.simple_mode_sub}</p>
                <h4>${t.modos_traduccion}</h4>
            </div>` : sectionMinimized('translator', '🔄', 'Traductor')}
            ${sectionEnabled('school') ? `
            <div class="mode-card" data-mode="school">
                <h2>${t.modo_escuela}</h2>
                <p>${t.description_modo_escuela}</p>
            </div>` : sectionMinimized('school', '📚', 'Modo Escuela')}
            ${sectionEnabled('famous') ? `
<!-- Carrusel de famosos -->
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
            ` : sectionMinimized('famous', '⭐', 'Famosos')}
            ${sectionEnabled('practice') ? `
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
            ` : sectionMinimized('practice', '📇', 'Práctica / Flashcards')}
            ${sectionEnabled('musicians') ? `
            <div class="mode-card" data-mode="musicians">
                <h2>${t.modo_musicos_mundo}</h2>
                <p>${t.descripcion_musicos_mundo}</p>
            </div>` : sectionMinimized('musicians', '🎵', 'Músicos y Letras')}
            ${sectionEnabled('immersion') ? `
            <div class="mode-card" data-mode="immersion">
                <h2>🌍</h2>
                <h4>Aprende con...</h4>
                <p>Películas, series y más en el idioma original</p>
            </div>` : sectionMinimized('immersion', '🌍', 'Aprende con...')}
            <div class="mode-card mode-card--plans" data-mode="plans">
                <h2>⭐</h2>
                <h4>Premium 500X</h4>
                <p>Desbloqueá todas las funciones sin límites</p>
            </div>
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

    // Práctica desde menú
    document.getElementById('allFlashcardsMainBtn').addEventListener('click', () =>
        requireAuth('Modo Práctica', () => { loadFlashcardData(); showAllGroups(); })
    );
    document.getElementById('lastGroupMainBtn').addEventListener('click', () =>
        requireAuth('Flashcards', () => {
            loadFlashcardData();
            if (lastGroupId && flashcardGroups.find(g => g.id === lastGroupId)) {
                showGroupDetail(lastGroupId);
            } else {
                alert(currentTranslations.no_recent_group || 'No hay ningún grupo reciente. Crea uno primero.');
            }
        })
    );
    document.getElementById('newGroupMainBtn').addEventListener('click', () =>
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
                <button class="school-back-btn" id="backMenuBtn">← ${t.volver || 'Volver'}</button>
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
    const placeholder   = document.getElementById('smpPlaceholder');
    const loadingEl     = document.getElementById('smpLoading');
    const cardsEl       = document.getElementById('smpCards');

    let autoTranslate   = false;
    let autoTimer       = null;
    let isRecording     = false;

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
                body: JSON.stringify({ text, plan: 'free', sourceLang, targetLang })
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

            showCards();
            bindResultActions(text);
        } catch (err) {
            showPlaceholder();
            showToast(`❌ ${err.message}`);
        } finally {
            translateBtn.disabled = false;
        }
    }

    translateBtn.addEventListener('click', doTranslate);

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
    authSeedAdminUser();
    if (typeof initMisionMate === 'function') initMisionMate();

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

    if (currentUser) {
        if (!sourceLang || !targetLang) saveLanguages('en', 'es');
        showMainMenu();
    } else {
        showOnboarding();
    }
});
