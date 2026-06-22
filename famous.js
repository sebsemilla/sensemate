// famous.js — Sección Famosos: chat con personajes históricos
// ============================================================
// Imágenes: crear carpeta /images/famous/ y agregar archivos
// con el nombre de la clave: mlk.jpg, marilyn.jpg, etc.
// Si no existe la imagen, el card usa degradé + emoji de fallback.

const FAMOUS_PEOPLE = {
    mlk:          { nombre: 'Martin Luther King Jr.', gender: 'male',   emoji: '🕊️', color: '#1e3a5f', nativeLang: 'en', country: 'us', region: 'norteamerica' },
    marilyn:      { nombre: 'Marilyn Monroe',          gender: 'female', emoji: '💋', color: '#6b2d5e', nativeLang: 'en', country: 'us', region: 'norteamerica' },
    maradona:     { nombre: 'Diego Maradona',          gender: 'male',   emoji: '⚽', color: '#1a4731', nativeLang: 'es', country: 'ar', region: 'sudamerica'   },
    einstein:     { nombre: 'Albert Einstein',         gender: 'male',   emoji: '🧠', color: '#3d2b1f', nativeLang: 'de', country: 'de', region: 'europa'       },
    cleopatra:    { nombre: 'Cleopatra',               gender: 'female', emoji: '👑', color: '#4a3000', nativeLang: 'en', country: 'eg', region: 'africa'       },
    frida:        { nombre: 'Frida Kahlo',             gender: 'female', emoji: '🎨', color: '#5c1a1a', nativeLang: 'es', country: 'mx', region: 'norteamerica' },
    mandela:      { nombre: 'Nelson Mandela',          gender: 'male',   emoji: '✊', color: '#1a3300', nativeLang: 'en', country: 'za', region: 'africa'       },
    shakespeare:  { nombre: 'William Shakespeare',     gender: 'male',   emoji: '📜', color: '#2c1a3e', nativeLang: 'en', country: 'gb', region: 'europa'       },
    // ── Argentina ────────────────────────────────────────────
    guevara:       { nombre: 'Ernesto "Che" Guevara',   gender: 'male',   emoji: '⭐', color: '#1a2e1a', nativeLang: 'es', country: 'ar', region: 'sudamerica' },
    mercedes_sosa: { nombre: 'Mercedes Sosa',            gender: 'female', emoji: '🎤', color: '#3d1a2e', nativeLang: 'es', country: 'ar', region: 'sudamerica' },
    piazzolla:     { nombre: 'Astor Piazzolla',          gender: 'male',   emoji: '🎻', color: '#1a1a3d', nativeLang: 'es', country: 'ar', region: 'sudamerica' },
    borges:        { nombre: 'Jorge Luis Borges',        gender: 'male',   emoji: '📚', color: '#2e1a0a', nativeLang: 'es', country: 'ar', region: 'sudamerica' },
    // ── Chile ────────────────────────────────────────────────
    neruda:  { nombre: 'Pablo Neruda',     gender: 'male',   emoji: '🌹', color: '#1a0a2e', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    mistral: { nombre: 'Gabriela Mistral', gender: 'female', emoji: '✨', color: '#2e1a0a', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    jara:    { nombre: 'Víctor Jara',      gender: 'male',   emoji: '🎸', color: '#0a1a0a', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    barrios: { nombre: 'Eduardo Barrios',  gender: 'male',   emoji: '📖', color: '#1a1a2e', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    parra:   { nombre: 'Violeta Parra',    gender: 'female', emoji: '🌸', color: '#2e0a0a', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    geel:    { nombre: 'María Carolina Geel', gender: 'female', emoji: '🖊️', color: '#1a0a1a', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    franulic: { nombre: 'Lenka Franulic',  gender: 'female', emoji: '📰', color: '#0a1a2e', nativeLang: 'es', country: 'cl', region: 'sudamerica' },
    // ── Uruguay ──────────────────────────────────────────────
    quiroga:  { nombre: 'Horacio Quiroga',  gender: 'male',   emoji: '🐍', color: '#1a2e0a', nativeLang: 'es', country: 'uy', region: 'sudamerica' },
    luisi:    { nombre: 'Paulina Luisi',    gender: 'female', emoji: '⚕️', color: '#0a1a2e', nativeLang: 'es', country: 'uy', region: 'sudamerica' },
    amalia:   { nombre: 'Amalia de la Vega', gender: 'female', emoji: '🎵', color: '#2e1a0a', nativeLang: 'es', country: 'uy', region: 'sudamerica' },
    galeano:  { nombre: 'Eduardo Galeano', gender: 'male',   emoji: '✊', color: '#1a0a0a', nativeLang: 'es', country: 'uy', region: 'sudamerica' },
    rodo:     { nombre: 'José Enrique Rodó', gender: 'male', emoji: '📜', color: '#2e2e0a', nativeLang: 'es', country: 'uy', region: 'sudamerica' },
    benedetti: { nombre: 'Mario Benedetti', gender: 'male',  emoji: '💙', color: '#0a0a2e', nativeLang: 'es', country: 'uy', region: 'sudamerica' },
    // ── Brasil ───────────────────────────────────────────────
    cohelo:            { nombre: 'Paulo Coelho',          gender: 'male',   emoji: '✍️', color: '#1a1a2e', nativeLang: 'pt', country: 'br', region: 'sudamerica', contemporary: true  },
    senna:             { nombre: 'Ayrton Senna',          gender: 'male',   emoji: '🏎️', color: '#0a0a1a', nativeLang: 'pt', country: 'br', region: 'sudamerica' },
    freire:            { nombre: 'Paulo Freire',          gender: 'male',   emoji: '🎓', color: '#1a2e1a', nativeLang: 'pt', country: 'br', region: 'sudamerica' },
    pele:              { nombre: 'Pelé',                  gender: 'male',   emoji: '⚽', color: '#1a2e00', nativeLang: 'pt', country: 'br', region: 'sudamerica' },
    ronaldo:           { nombre: 'Ronaldo Nazário',       gender: 'male',   emoji: '🌟', color: '#00001a', nativeLang: 'pt', country: 'br', region: 'sudamerica', contemporary: true  },
    fernanda_montenegro: { nombre: 'Fernanda Montenegro', gender: 'female', emoji: '🎭', color: '#2e1a1a', nativeLang: 'pt', country: 'br', region: 'sudamerica', contemporary: true  },
    rita:              { nombre: 'Rita Lee',              gender: 'female', emoji: '🎸', color: '#2e0a2e', nativeLang: 'pt', country: 'br', region: 'sudamerica' },
    gilberto:          { nombre: 'Gilberto Gil',          gender: 'male',   emoji: '🎵', color: '#1a1a00', nativeLang: 'pt', country: 'br', region: 'sudamerica', contemporary: true  },
    chiquinha:         { nombre: 'Chiquinha Gonzaga',     gender: 'female', emoji: '🎹', color: '#2e1a0a', nativeLang: 'pt', country: 'br', region: 'sudamerica' },
};

// ─── Regiones y países para el filtro ────────────────────────

const FAMOUS_REGIONS = [
    {
        key: 'sudamerica', label: 'América del Sur', emoji: '🌎', enabled: true,
        countries: [
            { key: 'ar', label: 'Argentina',  emoji: '🇦🇷' },
            { key: 'br', label: 'Brasil',     emoji: '🇧🇷' },
            { key: 'co', label: 'Colombia',   emoji: '🇨🇴' },
            { key: 'cl', label: 'Chile',      emoji: '🇨🇱' },
            { key: 'uy', label: 'Uruguay',    emoji: '🇺🇾' },
            { key: 've', label: 'Venezuela',  emoji: '🇻🇪' },
            { key: 'pe', label: 'Perú',       emoji: '🇵🇪' },
        ]
    },
    {
        key: 'norteamerica', label: 'América del Norte', emoji: '🌎', enabled: true,
        countries: [
            { key: 'us', label: 'Estados Unidos', emoji: '🇺🇸' },
            { key: 'mx', label: 'México',         emoji: '🇲🇽' },
            { key: 'ca', label: 'Canadá',         emoji: '🇨🇦' },
            { key: 'cu', label: 'Cuba',           emoji: '🇨🇺' },
        ]
    },
    { key: 'europa',   label: 'Europa',   emoji: '🌍', enabled: false, countries: [] },
    { key: 'africa',   label: 'África',   emoji: '🌍', enabled: false, countries: [] },
    { key: 'asia',     label: 'Asia',     emoji: '🌏', enabled: false, countries: [] },
    { key: 'oceania',  label: 'Oceanía',  emoji: '🌏', enabled: false, countries: [] },
];

// Filtro activo: { region: null | key, country: null | key }
let _famousFilter = { region: null, country: null };

// Saludo inicial en el idioma nativo de cada personaje
const FAMOUS_NATIVE_INTROS = {
    mlk:          "I've been waiting for a conversation like this. Tell me, friend — what's on your heart today?",
    marilyn:      "Oh darling, what a lovely surprise! Come on, tell me — what's on your mind?",
    maradona:     "¡Hola! ¿Cómo andás, compañero? Siempre listo para charlar. ¿De qué querés hablar?",
    einstein:     "Guten Tag! Die Phantasie ist wichtiger als das Wissen. Was möchten Sie von mir wissen?",
    cleopatra:    "Welcome to my presence. I am Cleopatra, Queen of the Nile. What wisdom do you seek?",
    frida:        "¡Hola! Pies, ¿para qué los quiero si tengo alas pa' volar? Cuéntame, ¿qué te trae aquí?",
    mandela:      "It always seems impossible until it's done. Welcome, my friend. What shall we discuss?",
    shakespeare:  "Hark! What manner of soul art thou, that dost seek audience with the Bard of Avon?",
    guevara:       "¡Hasta la victoria siempre, compañero! Siéntate, que tenemos mucho de qué hablar. ¿Qué te trajo hasta aquí?",
    mercedes_sosa: "¡Bienvenido, mi amor! La vida hay que cantarla para entenderla. ¿Qué querés que compartamos hoy?",
    piazzolla:     "El tango no se explica... se siente. Bienvenido a mi mundo. ¿Qué querés preguntarme?",
    borges:        "Los espejos y la paternidad son abominables porque multiplican a los hombres. Pero esta conversación me parece inevitable. ¿De qué hablamos?",
    // ── Chile ────────────────────────────────────────────────
    neruda:  "Puedo escribir los versos más tristes esta noche... pero mejor hablemos. ¿Qué te trae hasta aquí, amigo?",
    mistral: "Bienvenido, alma inquieta. La ternura es el principio de todo. Cuéntame qué llevas en el corazón.",
    jara:    "Compañero, la canción más bella es la que todavía no se ha cantado. ¿De qué querés hablar hoy?",
    barrios: "Qué bueno que llegaste. La vida interior es el territorio más vasto. ¿Qué querés explorar conmigo?",
    parra:   "Gracias a la vida, que me ha dado tanto... y también esta conversación. ¿De qué hablamos?",
    geel:    "Aquí estoy, con todas mis sombras y mis palabras. La escritura fue mi condena y mi salvación. ¿De qué queremos hablar?",
    franulic: "Bienvenido. El periodismo es la voz de los que no tienen voz. ¿Qué historia querés contar hoy?",
    // ── Uruguay ──────────────────────────────────────────────
    quiroga:  "Bienvenido a la selva de las palabras. Los cuentos más oscuros encierran las verdades más profundas. ¿Qué querés saber?",
    luisi:    "La salud y la dignidad son derechos, no privilegios. Me alegra que hayas venido. ¿De qué hablamos?",
    amalia:   "¡Bienvenido! El candombe y el folklore son el alma del Uruguay. ¿Qué querés compartir conmigo?",
    galeano:  "El mundo es injusto pero también es bello. Sentate, que tenemos mucho de qué hablar. ¿Por dónde empezamos?",
    rodo:     "La juventud de América es su mayor tesoro. Bienvenido, amigo. ¿Qué ideas queremos explorar juntos?",
    benedetti: "La vida es eso que pasa entre un poema y otro. Hola. ¿Qué te trajo por aquí?",
    // ── Brasil ───────────────────────────────────────────────
    cohelo:            "Bem-vindo! Quando você quer algo, todo o universo conspira para que você realize o seu desejo. O que te trouxe até aqui?",
    senna:             "Olá! Cada curva da vida é uma oportunidade de superar seus próprios limites. O que você quer saber?",
    freire:            "Seja bem-vindo! Ninguém educa ninguém, ninguém se educa sozinho — os homens se educam em comunhão. Do que vamos falar?",
    pele:              "Oi! O futebol é uma arte, e eu tive a sorte de ser seu pincel. Mas vamos lá — o que você quer conversar?",
    ronaldo:           "E aí! Fenômeno na área! Pode perguntar o que quiser, tô aqui pra isso.",
    fernanda_montenegro: "Que bom ter sua companhia. O teatro, o cinema — tudo começa com uma história verdadeira. Qual é a sua?",
    rita:              "Oi, gente! Rock é vida, e vida é música. Me conta — o que passa na sua cabeça?",
    gilberto:          "Olá! A música é um caminho para a liberdade. Venha, vamos conversar sobre o que você quiser.",
    chiquinha:         "Que alegria, meu bem! A música nasceu pra nos libertar. O que você quer saber desta velha compositora?",
};

// Modos de conversación (a desarrollar)
const CONVERSATION_MODES = [
    { id: 'free',       label: '🗣️ Conversación libre',     wip: false },
    { id: 'vocabulary', label: '📚 Enséñame vocabulario',   wip: true  },
    { id: 'correct',    label: '✏️ Corregir mis errores',   wip: true  },
    { id: 'historical', label: '🕰️ Contexto histórico',     wip: true  },
];

// ─── Helper: genera el HTML de una card de famoso ─────────────

function _famousCardHTML(key, descHTML = '', extraClass = '') {
    const p   = FAMOUS_PEOPLE[key];
    const img = `/images/famous/${key}.jpg`;
    return `
        <div class="famous-card ${extraClass}" data-person="${key}"
             style="--fcard-color:${p.color}; --fcard-img:url('${img}')">
            <div class="famous-card-img"></div>
            <div class="famous-card-overlay"></div>
            <div class="famous-card-body">
                <div class="famous-card-emoji">${p.emoji}</div>
                <div class="famous-card-name">${p.nombre}</div>
                ${descHTML ? `<div class="famous-card-desc">${descHTML}</div>` : ''}
            </div>
        </div>`;
}

// ─── Lista completa de famosos ────────────────────────────────


// ─── Carrusel del menú principal ─────────────────────────────

function initFamousCarousel(section) {
    if (!section) return;

    const trackWrap = section.querySelector('.fc-track-wrap');
    const prevBtn   = section.querySelector('.fc-arrow--left');
    const nextBtn   = section.querySelector('.fc-arrow--right');
    const cards     = Array.from(section.querySelectorAll('.fc-card'));
    const total     = cards.length;
    if (!total) return;

    let activeIdx = 1; // Empezar en el segundo card (centro visual)

    function update() {
        cards.forEach((card, i) => {
            const offset = i - activeIdx;
            const abs    = Math.abs(offset);
            const dir    = offset >= 0 ? 1 : -1;

            card.style.setProperty('--fc-dir', dir);
            card.classList.remove('fc-active', 'fc-adj', 'fc-far');

            if (abs === 0)      card.classList.add('fc-active');
            else if (abs === 1) card.classList.add('fc-adj');
            else                card.classList.add('fc-far');
        });

        prevBtn.style.opacity = activeIdx === 0         ? '0.3' : '1';
        nextBtn.style.opacity = activeIdx === total - 1 ? '0.3' : '1';
    }

    // Flechas
    prevBtn.addEventListener('click', () => { if (activeIdx > 0) { activeIdx--; update(); } });
    nextBtn.addEventListener('click', () => { if (activeIdx < total - 1) { activeIdx++; update(); } });

    // Swipe touch
    let touchStartX = 0, touchStartY = 0;
    trackWrap.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    trackWrap.addEventListener('touchend', e => {
        const dx = touchStartX - e.changedTouches[0].clientX;
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 35) return;
        if (dx > 0 && activeIdx < total - 1) activeIdx++;
        else if (dx < 0 && activeIdx > 0)    activeIdx--;
        update();
    }, { passive: true });

    // Drag mouse
    let dragStartX = 0, isDragging = false;
    trackWrap.addEventListener('mousedown', e => {
        dragStartX = e.clientX; isDragging = true;
        trackWrap.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        trackWrap.style.cursor = 'grab';
        const dx = dragStartX - e.clientX;
        if (Math.abs(dx) < 35) return;
        if (dx > 0 && activeIdx < total - 1) activeIdx++;
        else if (dx < 0 && activeIdx > 0)    activeIdx--;
        update();
    });

    // Click: navegar si no es activa, abrir chat si es activa
    cards.forEach((card, i) => {
        card.addEventListener('click', e => {
            if (Math.abs(dragStartX - e.clientX) > 10) return;
            if (i !== activeIdx) {
                activeIdx = i; update();
            } else {
                const person = card.dataset.person;
                if (person === 'more') requireAuth('Chat con Famosos', loadFamousList);
                else if (person)       requireAuth('Chat con Famosos', () => loadFamousChat(person));
            }
        });
    });

    // Imagen fallback
    _bindFamousCardImgFallback();

    // Init sin animacion
    section.querySelectorAll('.fc-card').forEach(c => c.classList.add('fc-no-transition'));
    update();
    requestAnimationFrame(() => {
        section.querySelectorAll('.fc-card').forEach(c => c.classList.remove('fc-no-transition'));
    });
}

function loadFamousList() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    const t = currentTranslations;

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="famous-list-wrap">
            <div class="famous-list-header">
                <button class="school-back-btn" id="backToMainFromFamousList">← ${t.volver || 'Volver'}</button>
                <h2>🌟 ${t.elige_famosos || 'Elegí con quién hablar'}</h2>
                <button class="famous-filter-btn" id="famousFilterBtn">
                    🌎 País
                    <span class="famous-filter-label">Filtra por...</span>
                </button>
            </div>
            <div id="famousActiveFilter"></div>
            <div class="famous-grid-full" id="famousGrid"></div>
        </div>
    `);

    document.getElementById('backToMainFromFamousList').addEventListener('click', showMainMenu);
    document.getElementById('famousFilterBtn').addEventListener('click', _showFamousFilterPanel);

    _renderFamousGrid(t);
}

function _renderFamousGrid(t) {
    const allKeys = Object.keys(FAMOUS_PEOPLE);
    const filtered = allKeys.filter(key => {
        const p = FAMOUS_PEOPLE[key];
        if (_famousFilter.country) return p.country === _famousFilter.country;
        if (_famousFilter.region)  return p.region  === _famousFilter.region;
        return true;
    });

    const grid = document.getElementById('famousGrid');
    const activeEl = document.getElementById('famousActiveFilter');
    if (!grid) return;

    // Badge del filtro activo
    if (_famousFilter.country || _famousFilter.region) {
        const regionData = FAMOUS_REGIONS.find(r => r.key === _famousFilter.region);
        const countryData = regionData?.countries.find(c => c.key === _famousFilter.country);
        const label = countryData
            ? `${countryData.emoji} ${countryData.label}`
            : regionData ? `${regionData.emoji} ${regionData.label}` : '';
        activeEl.innerHTML = `
            <div class="famous-filter-active">
                Mostrando: <strong>${label}</strong>
                <button class="famous-filter-clear" id="famousFilterClear">✕ Limpiar</button>
            </div>`;
        document.getElementById('famousFilterClear').addEventListener('click', () => {
            _famousFilter = { region: null, country: null };
            _renderFamousGrid(currentTranslations);
        });
    } else {
        activeEl.innerHTML = '';
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="famous-filter-empty">😔 No hay personajes de esta región aún.<br><small>Próximamente agregaremos más.</small></div>`;
        return;
    }

    grid.innerHTML = filtered.map(key => {
        const desc = t[`${key}_descripcion`] || '';
        return _famousCardHTML(key, desc);
    }).join('');

    document.querySelectorAll('.famous-card[data-person]').forEach(card => {
        card.addEventListener('click', () => loadFamousChat(card.dataset.person));
    });
    _bindFamousCardImgFallback();
}

function _showFamousFilterPanel() {
    document.getElementById('famousFilterOverlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'famousFilterOverlay';
    overlay.className = 'ffilter-overlay';

    overlay.innerHTML = `
        <div class="ffilter-panel">
            <div class="ffilter-header">
                <span class="ffilter-title">🌎 Filtrar por región / país</span>
                <button class="ffilter-close" id="ffilterClose">✕</button>
            </div>
            <div class="ffilter-regions">
                ${FAMOUS_REGIONS.map(region => `
                    <div class="ffilter-region ${!region.enabled ? 'ffilter-region--wip' : ''}" data-region="${region.key}">
                        <div class="ffilter-region-header">
                            <span class="ffilter-region-emoji">${region.emoji}</span>
                            <span class="ffilter-region-label">${region.label}</span>
                            ${!region.enabled ? '<span class="ffilter-wip-badge">Próximamente</span>' : ''}
                            ${region.enabled ? '<span class="ffilter-chevron">▾</span>' : ''}
                        </div>
                        ${region.enabled && region.countries.length ? `
                        <div class="ffilter-countries" id="fcountries-${region.key}">
                            <button class="ffilter-country ${_famousFilter.region === region.key && !_famousFilter.country ? 'active' : ''}"
                                    data-region="${region.key}" data-country="">
                                ${region.emoji} Toda la región
                            </button>
                            ${region.countries.map(c => `
                                <button class="ffilter-country ${_famousFilter.country === c.key ? 'active' : ''}"
                                        data-region="${region.key}" data-country="${c.key}">
                                    ${c.emoji} ${c.label}
                                </button>
                            `).join('')}
                        </div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Toggle países al tocar región habilitada
    overlay.querySelectorAll('.ffilter-region:not(.ffilter-region--wip)').forEach(el => {
        el.querySelector('.ffilter-region-header').addEventListener('click', () => {
            const countries = el.querySelector('.ffilter-countries');
            if (countries) countries.classList.toggle('open');
        });
    });

    // Abrir el panel de la región que ya está activa
    if (_famousFilter.region) {
        const el = overlay.querySelector(`[data-region="${_famousFilter.region}"] .ffilter-countries`);
        if (el) el.classList.add('open');
    }

    // Selección de país / región
    overlay.querySelectorAll('.ffilter-country').forEach(btn => {
        btn.addEventListener('click', () => {
            _famousFilter.region  = btn.dataset.region || null;
            _famousFilter.country = btn.dataset.country || null;
            overlay.remove();
            _renderFamousGrid(currentTranslations);
        });
    });

    overlay.querySelector('#ffilterClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// Manejo de fallback de imagen para todas las cards renderizadas
function _bindFamousCardImgFallback() {
    document.querySelectorAll('.famous-card').forEach(card => {
        const key = card.dataset.person;
        if (!key) return;
        const img = new Image();
        img.onload  = () => card.classList.add('famous-card--hasimg');
        img.onerror = () => card.classList.add('famous-card--noimg');
        img.src = `/images/famous/${key}.jpg`;
    });
}

// ─── Función exportada para main menu (app.js puede llamarla) ─

function renderFamousMenuCards(keys, t) {
    return keys.map(key => {
        const desc = t[`${key}_descripcion`] || '';
        return _famousCardHTML(key, desc, 'fc-card');
    }).join('');
}

// ─── Chat con famoso ──────────────────────────────────────────

function loadFamousChat(person) {
    const t    = currentTranslations;
    const data = FAMOUS_PEOPLE[person] || { nombre: 'Personaje famoso', gender: 'male', emoji: '🌟', color: '#333', nativeLang: 'en' };
    const { nombre, emoji, nativeLang: charNativeLang = 'en' } = data;
    const imgSrc = `/images/famous/${person}.jpg`;

    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="school-panel famous-chat-panel">

            <!-- Header con avatar del personaje -->
            <div class="famous-chat-header" style="--fcard-color:${data.color}; --fcard-img:url('${imgSrc}')">
                <div class="famous-chat-header-bg"></div>
                <div class="famous-chat-header-content">
                    <button class="school-back-btn famous-back-btn" id="famousBackBtn">← ${t.volver || 'Volver'}</button>
                    <div class="famous-chat-identity">
                        <div class="famous-chat-avatar" id="famousChatAvatar">${emoji}</div>
                        <div class="famous-chat-name">${nombre}</div>
                    </div>
                </div>
            </div>

            <!-- Toolbar: VOZ | SPEED | MODO -->
            <div class="school-toolbar">

                <!-- VOZ -->
                <button class="school-tb-btn" id="voiceBtn" data-on="false">
                    <span class="school-tb-icon" id="voiceIcon">🔇</span>
                    <span class="school-tb-label">VOZ</span>
                    <span class="school-tb-pill" id="voicePill">OFF</span>
                </button>

                <!-- SPEED -->
                <div class="school-speed-wrap" id="speedWrap">
                    <button class="school-tb-btn" id="speedBtn">
                        <span class="school-tb-icon">⚡</span>
                        <span class="school-tb-label">SPEED</span>
                        <span class="school-tb-pill" id="speedLabel">1×</span>
                    </button>
                    <div class="school-speed-panel hidden" id="speedPanel">
                        <button class="school-speed-opt" data-speed="0.5">0.5×</button>
                        <button class="school-speed-opt" data-speed="0.75">0.75×</button>
                        <button class="school-speed-opt active" data-speed="1">1×</button>
                        <button class="school-speed-opt" data-speed="1.25">1.25×</button>
                        <button class="school-speed-opt" data-speed="1.5">1.5×</button>
                    </div>
                </div>

                <!-- MODO -->
                <div class="school-speed-wrap" id="modoWrap">
                    <button class="school-tb-btn" id="modoBtn">
                        <span class="school-tb-icon">💬</span>
                        <span class="school-tb-label">MODO</span>
                        <span class="school-tb-pill" id="modoLabel">Libre</span>
                    </button>
                    <div class="school-speed-panel famous-modo-panel hidden" id="modoPanel">
                        ${CONVERSATION_MODES.map(m => `
                            <button class="school-speed-opt ${m.id === 'free' ? 'active' : ''} ${m.wip ? 'famous-mode-wip' : ''}"
                                    data-mode="${m.id}">
                                ${m.label}
                                ${m.wip ? '<span class="famous-wip-badge">Próximo</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>

            </div>

            <!-- Chat -->
            <div class="school-chat" id="famousChatMessages"></div>

            <!-- Input -->
            <div class="school-input-wrap">
                <textarea class="school-textarea" id="famousUserMessage" rows="2"
                          placeholder="${t.info_tip || 'Escribí tu mensaje...'}"></textarea>
                <button class="school-send-btn" id="sendFamousBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>

        </div>
    `);

    // Fallback avatar si la imagen carga
    const avatarEl = document.getElementById('famousChatAvatar');
    const testImg  = new Image();
    testImg.onload = () => {
        const header = document.querySelector('.famous-chat-panel .famous-chat-header');
        if (header) header.classList.add('famous-chat-header--hasimg');
        avatarEl.style.backgroundImage = `url('${imgSrc}')`;
        avatarEl.classList.add('famous-chat-avatar--img');
        avatarEl.textContent = '';
    };
    testImg.src = imgSrc;

    // ── Refs ──────────────────────────────────────────────────
    const chatDiv      = document.getElementById('famousChatMessages');
    const userArea     = document.getElementById('famousUserMessage');
    const sendBtn      = document.getElementById('sendFamousBtn');
    const voiceBtn     = document.getElementById('voiceBtn');
    const voiceIcon    = document.getElementById('voiceIcon');
    const voicePill    = document.getElementById('voicePill');
    const speedBtn     = document.getElementById('speedBtn');
    const speedPanel   = document.getElementById('speedPanel');
    const speedLabel   = document.getElementById('speedLabel');
    const speedWrap    = document.getElementById('speedWrap');
    const modoBtn      = document.getElementById('modoBtn');
    const modoPanel    = document.getElementById('modoPanel');
    const modoLabel    = document.getElementById('modoLabel');
    const modoWrap     = document.getElementById('modoWrap');

    let voiceEnabled = false;
    let currentSpeed = 1.0;
    let currentMode  = 'free';
    let conversationHistory = [];
    let msgsSent = 0; // contador para modal premium cada 6 mensajes

    // ── VOZ toggle ────────────────────────────────────────────
    voiceBtn.addEventListener('click', () => {
        voiceEnabled          = !voiceEnabled;
        voiceBtn.dataset.on   = voiceEnabled;
        voiceIcon.textContent = voiceEnabled ? '🔊' : '🔇';
        voicePill.textContent = voiceEnabled ? 'ON'  : 'OFF';
    });

    // ── SPEED dropdown ────────────────────────────────────────
    speedBtn.addEventListener('click', e => {
        e.stopPropagation();
        speedPanel.classList.toggle('hidden');
        modoPanel.classList.add('hidden');
    });
    speedPanel.querySelectorAll('.school-speed-opt').forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            currentSpeed = parseFloat(opt.dataset.speed);
            speedLabel.textContent = opt.textContent.trim();
            speedPanel.querySelectorAll('.school-speed-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            speedPanel.classList.add('hidden');
        });
    });

    // ── MODO dropdown ─────────────────────────────────────────
    modoBtn.addEventListener('click', e => {
        e.stopPropagation();
        modoPanel.classList.toggle('hidden');
        speedPanel.classList.add('hidden');
    });
    modoPanel.querySelectorAll('.school-speed-opt').forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            const mode = opt.dataset.mode;
            if (mode !== 'free') {
                showToast('🚧 Modo en desarrollo. ¡Próximamente!');
                modoPanel.classList.add('hidden');
                return;
            }
            currentMode = mode;
            // Label: solo el texto sin el badge WIP
            modoLabel.textContent = opt.textContent.split('\n')[0].trim().split('  ')[0].trim();
            modoPanel.querySelectorAll('.school-speed-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            modoPanel.classList.add('hidden');
        });
    });

    // Cerrar dropdowns al click fuera
    document.addEventListener('click', e => {
        if (!speedWrap.contains(e.target)) speedPanel.classList.add('hidden');
        if (!modoWrap.contains(e.target))  modoPanel.classList.add('hidden');
    });

    // ── Mensajes ──────────────────────────────────────────────
    // translation: texto ya disponible (respuestas del servidor)
    // fetchTranslation: true → botón fetcha traducción on-demand (para el saludo)
    function addMessage(role, html, translation = null, fetchTranslation = false) {
        const wrap = document.createElement('div');
        wrap.classList.add('school-msg-wrap', `school-msg-wrap--${role}`);

        if (role === 'assistant') {
            const hasImg = avatarEl.classList.contains('famous-chat-avatar--img');
            const uid = `ftrans-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
            wrap.innerHTML = `
                <div class="school-msg-avatar famous-msg-avatar"
                     style="${hasImg ? `background-image:url('${imgSrc}'); background-size:cover; background-position:center top; font-size:0` : ''}">
                    ${hasImg ? '' : emoji}
                </div>
                <div class="school-msg-bubble school-msg-bubble--assistant">
                    <div class="famous-bubble-original">${html}</div>
                    <button class="famous-translate-btn" data-uid="${uid}">🌐 Traducir</button>
                    <div class="famous-bubble-translation hidden" id="${uid}"></div>
                </div>`;

            const btn    = wrap.querySelector('.famous-translate-btn');
            const transEl = wrap.querySelector(`#${uid}`);
            let cachedTrans = translation;
            let visible = false;

            btn.addEventListener('click', async () => {
                if (!cachedTrans) {
                    // Fetch on-demand via /translate
                    btn.textContent = '⏳ Traduciendo...';
                    btn.disabled = true;
                    try {
                        const r = await fetch(_API_HOST + '/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                text: html,
                                plan: 'neutral',
                                sourceLang: charNativeLang,
                                targetLang: sourceLang || 'es'
                            })
                        });
                        const d = await r.json();
                        try {
                            const parsed = JSON.parse(d.translation);
                            cachedTrans = parsed.neutral || parsed.informal || d.translation;
                        } catch { cachedTrans = d.translation; }
                    } catch {
                        btn.textContent = '🌐 Traducir';
                        btn.disabled = false;
                        return;
                    }
                    btn.disabled = false;
                }
                visible = !visible;
                if (visible) {
                    transEl.textContent = cachedTrans;
                    transEl.classList.remove('hidden');
                    btn.textContent = '✕ Ocultar traducción';
                } else {
                    transEl.classList.add('hidden');
                    btn.textContent = '🌐 Traducir';
                }
            });

        } else if (role === 'user') {
            wrap.innerHTML = `<div class="school-msg-bubble school-msg-bubble--user">${html}</div>`;
        } else {
            wrap.innerHTML = `<div class="school-msg-system">${html}</div>`;
        }

        chatDiv.appendChild(wrap);
        chatDiv.scrollTop = chatDiv.scrollHeight;
        return wrap;
    }

    function addThinking() {
        const wrap = document.createElement('div');
        wrap.classList.add('school-msg-wrap', 'school-msg-wrap--assistant');
        wrap.innerHTML = `
            <div class="school-msg-avatar famous-msg-avatar">${emoji}</div>
            <div class="school-msg-bubble school-msg-bubble--assistant">
                <span class="school-dots"><span></span><span></span><span></span></span>
            </div>`;
        chatDiv.appendChild(wrap);
        chatDiv.scrollTop = chatDiv.scrollHeight;
        return wrap;
    }

    async function speakText(text) {
        if (!voiceEnabled || !text?.trim()) return;
        try {
            const res = await fetch(_API_HOST + '/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, persona: person })
            });
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            const audio = new Audio(URL.createObjectURL(blob));
            audio.playbackRate = currentSpeed;
            audio.play();
        } catch {
            // Fallback Web Speech
            const u   = new SpeechSynthesisUtterance(text);
            u.rate    = currentSpeed;
            const map = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', de: 'de-DE', it: 'it-IT' };
            u.lang    = map[targetLang] || 'es-ES';
            const voices = window.speechSynthesis.getVoices();
            const voice  = voices.find(v => v.lang === u.lang) || voices[0];
            if (voice) u.voice = voice;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
        }
    }

    // ── Disclaimer para personajes contemporáneos ─────────────
    if (data.contemporary) {
        addMessage('system', `⚠️ <strong>Personaje recreado con IA.</strong> ${nombre} es una figura pública real. Sus respuestas son generadas por inteligencia artificial y no representan sus opiniones reales.`);
    }

    // ── Bienvenida en el idioma nativo del personaje ──────────
    const welcome = FAMOUS_NATIVE_INTROS[person] || `Hello! I am ${nombre}. What would you like to talk about?`;
    addMessage('assistant', welcome); // botón "Traducir" fetcha on-demand
    conversationHistory.push({ role: 'assistant', content: welcome });

    // ── Enviar mensaje ────────────────────────────────────────
    async function sendMessage() {
        const userText = userArea.value.trim();
        if (!userText) return;
        userArea.value = '';
        userArea.style.height = '';
        addMessage('user', userText);
        conversationHistory.push({ role: 'user', content: userText });
        if (typeof gtag       === 'function') gtag('event', 'famous_chat_message', { person });
        if (typeof misionTrack === 'function') misionTrack('chat');

        const thinking = addThinking();

        try {
            const res = await fetch(_API_HOST + '/famous-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ person, messages: conversationHistory, targetLang })
            });
            if (!res.ok) throw new Error('Error en el servidor');
            const resp = await res.json();
            thinking.remove();
            addMessage('assistant', resp.reply, resp.translation || null);
            speakText(resp.reply);
            conversationHistory.push({ role: 'assistant', content: resp.reply });

            // Mostrar modal premium cada 6 mensajes enviados
            msgsSent++;
            if (msgsSent % 6 === 0 && typeof _showUpgradeModal === 'function') {
                setTimeout(() => _showUpgradeModal('famous'), 600);
            }
        } catch (err) {
            thinking.remove();
            addMessage('system', `❌ Error: ${err.message}`);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userArea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    userArea.addEventListener('input', () => {
        userArea.style.height = 'auto';
        userArea.style.height = Math.min(userArea.scrollHeight, 120) + 'px';
    });

    document.getElementById('famousBackBtn').addEventListener('click', loadFamousList);
}
