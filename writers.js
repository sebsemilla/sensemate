// writers.js — Sección "Escritores y Escritos"
// =============================================

let _writersData    = null;
let _writerFilter   = null; // country code ISO-2 | null
const _WRITERS_KEY  = 'ls_writers_lang';

// Sugerencias para los campos de idioma (autocompletar + indicador de reconocido)
const _WRITER_LANGUAGES = [
    'Español', 'Inglés', 'Francés', 'Portugués', 'Italiano', 'Alemán',
    'Guaraní', 'Quechua', 'Catalán', 'Gallego', 'Euskera', 'Neerlandés',
    'Danés', 'Sueco', 'Noruego', 'Finlandés', 'Islandés', 'Irlandés',
    'Griego', 'Polaco', 'Checo', 'Eslovaco', 'Húngaro', 'Rumano', 'Búlgaro',
    'Croata', 'Serbio', 'Bosnio', 'Esloveno', 'Macedonio', 'Albanés',
    'Ucraniano', 'Ruso', 'Bielorruso', 'Lituano', 'Letón', 'Estonio',
    'Árabe', 'Hebreo', 'Turco', 'Persa', 'Urdu', 'Azerí', 'Georgiano',
    'Armenio', 'Kurdo', 'Chino (mandarín)', 'Japonés', 'Coreano', 'Hindi',
    'Bengalí', 'Tamil', 'Telugu', 'Vietnamita', 'Tailandés', 'Indonesio',
    'Malayo', 'Filipino', 'Suajili', 'Yoruba', 'Igbo', 'Hausa', 'Zulú',
    'Xhosa', 'Amárico', 'Somalí', 'Latín', 'Náhuatl', 'Maya', 'Mapudungún',
];

function _matchLanguage(typed) {
    const norm = _normalizeStr(typed);
    if (!norm) return null;
    return _WRITER_LANGUAGES.find(l => _normalizeStr(l) === norm) || null;
}

// ─── Carga de datos ───────────────────────────────────────────

async function loadWritersData(lang = 'es') {
    if (_writersData) return _writersData;

    // 1. Cargar archivo estático
    await new Promise((resolve) => {
        if (window[`writers_${lang}`]) { resolve(); return; }
        const s = document.createElement('script');
        s.src = `data/writers_${lang}.js`;
        s.onload  = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
    });

    const raw = window[`writers_${lang}`]?.[lang];
    if (!raw) throw new Error(`Sin datos de escritores para '${lang}'`);

    // 2. Merge con textos aprobados de la DB
    try {
        const r = await fetch(`${_API_HOST}/writers/data/${lang}`);
        if (r.ok) {
            const db = await r.json();
            _mergeWritersDb(raw, db);
        }
    } catch { /* sin conexión */ }

    _writersData = raw;
    return _writersData;
}

function _mergeWritersDb(base, db) {
    const existingIds = new Set(base.writers.map(w => w.id));
    db.writers.forEach(w => {
        if (!existingIds.has(w.id)) base.writers.push(w);
    });
    Object.entries(db.texts || {}).forEach(([wid, texts]) => {
        if (!base.texts[wid]) base.texts[wid] = [];
        const existingTxtIds = new Set(base.texts[wid].map(t => t.id));
        texts.forEach(t => { if (!existingTxtIds.has(t.id)) base.texts[wid].push(t); });
    });
}

// ─── Menú principal ───────────────────────────────────────────

async function loadWritersMenu() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="writers-panel">
            <div class="writers-header">
                <button class="school-back-btn" id="writersBackBtn">← Volver</button>
                <h2 class="writers-title">📖 Escritores y Escritos</h2>
                <button class="writers-upload-btn" id="writersUploadBtn">⬆️ Subir</button>
                <button class="writers-info-btn" id="writersInfoBtn" title="¿Cómo funciona?">ℹ️</button>
            </div>
            <div id="writersCountryBar" class="writers-country-bar-wrap"></div>
            <div id="writersGrid" class="writers-grid">
                <div class="writers-loading">
                    <div class="school-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
    `);

    document.getElementById('writersBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('writersInfoBtn').addEventListener('click', _showWritersIntro);
    document.getElementById('writersUploadBtn')?.addEventListener('click', () => _showSubmitForm());

    try {
        const data = await loadWritersData('es');
        _renderWritersCountryBar(data.writers);
        _renderWritersGrid(data.writers);
    } catch (e) {
        document.getElementById('writersGrid').innerHTML =
            `<div class="writers-error">❌ ${e.message}</div>`;
    }
}

// ─── Filtro por país (dropdown con continentes) ───────────────

// Genera la bandera a partir del código ISO-2 (regional indicator symbols)
function _flagEmoji(cc) {
    const iso = { uk: 'gb' }[cc] || cc; // alias: 'uk' no es un código ISO real
    if (!iso || iso.length !== 2) return '🌐';
    const points = [...iso.toUpperCase()].map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
    return String.fromCodePoint(...points);
}

// Continentes con su lista completa de países (código + nombre en español).
// `codes` se deriva automáticamente abajo para no duplicar datos.
const _WRITER_CONTINENTS = [
    {
        key: 'sam', label: 'América del Sur', emoji: '🌎',
        countries: [
            { code: 'ar', label: 'Argentina' }, { code: 'bo', label: 'Bolivia' },
            { code: 'br', label: 'Brasil' },    { code: 'cl', label: 'Chile' },
            { code: 'co', label: 'Colombia' },  { code: 'ec', label: 'Ecuador' },
            { code: 'gy', label: 'Guyana' },    { code: 'py', label: 'Paraguay' },
            { code: 'pe', label: 'Perú' },      { code: 'sr', label: 'Surinam' },
            { code: 'uy', label: 'Uruguay' },   { code: 've', label: 'Venezuela' },
        ],
    },
    {
        key: 'cam', label: 'América Central y Caribe', emoji: '🌎',
        countries: [
            { code: 'bz', label: 'Belice' },       { code: 'cr', label: 'Costa Rica' },
            { code: 'sv', label: 'El Salvador' },  { code: 'gt', label: 'Guatemala' },
            { code: 'hn', label: 'Honduras' },     { code: 'mx', label: 'México' },
            { code: 'ni', label: 'Nicaragua' },    { code: 'pa', label: 'Panamá' },
            { code: 'cu', label: 'Cuba' },         { code: 'do', label: 'República Dominicana' },
            { code: 'ht', label: 'Haití' },        { code: 'jm', label: 'Jamaica' },
            { code: 'pr', label: 'Puerto Rico' },  { code: 'tt', label: 'Trinidad y Tobago' },
            { code: 'bs', label: 'Bahamas' },
        ],
    },
    {
        key: 'nam', label: 'América del Norte', emoji: '🌎',
        countries: [
            { code: 'us', label: 'Estados Unidos' }, { code: 'ca', label: 'Canadá' },
        ],
    },
    {
        key: 'eur', label: 'Europa', emoji: '🌍',
        countries: [
            { code: 'es', label: 'España' },     { code: 'pt', label: 'Portugal' },
            { code: 'fr', label: 'Francia' },    { code: 'de', label: 'Alemania' },
            { code: 'it', label: 'Italia' },     { code: 'uk', label: 'Reino Unido' },
            { code: 'nl', label: 'Países Bajos' },{ code: 'be', label: 'Bélgica' },
            { code: 'ch', label: 'Suiza' },      { code: 'at', label: 'Austria' },
            { code: 'se', label: 'Suecia' },     { code: 'no', label: 'Noruega' },
            { code: 'dk', label: 'Dinamarca' },  { code: 'fi', label: 'Finlandia' },
            { code: 'is', label: 'Islandia' },   { code: 'ie', label: 'Irlanda' },
            { code: 'gr', label: 'Grecia' },     { code: 'pl', label: 'Polonia' },
            { code: 'cz', label: 'República Checa' }, { code: 'sk', label: 'Eslovaquia' },
            { code: 'hu', label: 'Hungría' },    { code: 'ro', label: 'Rumania' },
            { code: 'bg', label: 'Bulgaria' },   { code: 'hr', label: 'Croacia' },
            { code: 'rs', label: 'Serbia' },     { code: 'si', label: 'Eslovenia' },
            { code: 'ua', label: 'Ucrania' },    { code: 'ru', label: 'Rusia' },
            { code: 'lt', label: 'Lituania' },   { code: 'lv', label: 'Letonia' },
            { code: 'ee', label: 'Estonia' },
        ],
    },
    {
        key: 'asi', label: 'Asia', emoji: '🌏',
        countries: [
            { code: 'cn', label: 'China' },      { code: 'jp', label: 'Japón' },
            { code: 'kr', label: 'Corea del Sur' }, { code: 'in', label: 'India' },
            { code: 'id', label: 'Indonesia' },  { code: 'ph', label: 'Filipinas' },
            { code: 'vn', label: 'Vietnam' },    { code: 'th', label: 'Tailandia' },
            { code: 'my', label: 'Malasia' },    { code: 'sg', label: 'Singapur' },
            { code: 'tw', label: 'Taiwán' },     { code: 'tr', label: 'Turquía' },
            { code: 'ir', label: 'Irán' },       { code: 'sa', label: 'Arabia Saudita' },
            { code: 'ae', label: 'Emiratos Árabes Unidos' }, { code: 'il', label: 'Israel' },
            { code: 'pk', label: 'Pakistán' },   { code: 'bd', label: 'Bangladés' },
        ],
    },
    {
        key: 'afr', label: 'África', emoji: '🌍',
        countries: [
            { code: 'eg', label: 'Egipto' },     { code: 'za', label: 'Sudáfrica' },
            { code: 'ng', label: 'Nigeria' },    { code: 'ke', label: 'Kenia' },
            { code: 'ma', label: 'Marruecos' },  { code: 'dz', label: 'Argelia' },
            { code: 'tn', label: 'Túnez' },      { code: 'gh', label: 'Ghana' },
            { code: 'et', label: 'Etiopía' },    { code: 'sn', label: 'Senegal' },
        ],
    },
    {
        key: 'oce', label: 'Oceanía', emoji: '🌏',
        countries: [
            { code: 'au', label: 'Australia' }, { code: 'nz', label: 'Nueva Zelanda' },
            { code: 'fj', label: 'Fiyi' },
        ],
    },
];
_WRITER_CONTINENTS.forEach(cont => { cont.codes = cont.countries.map(c => c.code); });

function _continentForCode(code) {
    return _WRITER_CONTINENTS.find(c => c.countries.some(x => x.code === code)) || null;
}

function _normalizeStr(s) {
    return (s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Intenta resolver el texto libre de país a un código conocido dentro del continente elegido
function _matchCountryInContinent(continentKey, typedText) {
    const cont = _WRITER_CONTINENTS.find(c => c.key === continentKey);
    if (!cont) return null;
    const norm = _normalizeStr(typedText);
    if (!norm) return null;
    return cont.countries.find(c => _normalizeStr(c.label) === norm) || null;
}

function _renderWritersCountryBar(writers) {
    const bar = document.getElementById('writersCountryBar');
    if (!bar) return;

    // Países presentes en los escritores actuales
    const presentCodes = new Set(writers.map(w => w.country).filter(Boolean));

    // Construir grupos con solo los países presentes
    const groups = _WRITER_CONTINENTS.map(cont => ({
        ...cont,
        countries: cont.codes
            .filter(cc => presentCodes.has(cc))
            .map(cc => ({ code: cc, ..._countryInfo(cc) })),
    })).filter(g => g.countries.length > 0);

    const activeInfo = _writerFilter ? _countryInfo(_writerFilter) : null;
    const label = activeInfo ? `${activeInfo.emoji} ${activeInfo.label}` : '🌎 Todos los países';

    bar.innerHTML = `
        <div class="country-dropdown-wrap">
            <button class="country-dropdown-trigger" id="writerCountryTrigger" aria-expanded="false">
                <span>${label}</span>
                <svg class="country-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="country-dropdown-menu" id="writerCountryMenu" hidden>
                <button class="country-dropdown-item ${!_writerFilter ? 'active' : ''}" data-cc="">🌎 Todos los países</button>
                ${groups.map(g => `
                    <div class="country-dropdown-group-label">${g.emoji} ${g.label}</div>
                    ${g.countries.map(c =>
                        `<button class="country-dropdown-item ${_writerFilter === c.code ? 'active' : ''}" data-cc="${c.code}">${c.emoji} ${c.label}</button>`
                    ).join('')}
                `).join('')}
            </div>
        </div>
    `;

    const trigger = document.getElementById('writerCountryTrigger');
    const menu    = document.getElementById('writerCountryMenu');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = !menu.hidden;
        menu.hidden = open;
        trigger.setAttribute('aria-expanded', String(!open));
    });

    // Cerrar al hacer click fuera
    const closeMenu = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
    document.addEventListener('click', closeMenu, { once: true });
    menu.addEventListener('click', e => e.stopPropagation()); // evita que close se dispare al clickear items

    menu.querySelectorAll('.country-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            _writerFilter = item.dataset.cc || null;
            closeMenu();
            _renderWritersCountryBar(writers);
            const data = window.writers_es?.es;
            if (data) _renderWritersGrid(data.writers);
        });
    });
}

// ─── Grid de escritores ───────────────────────────────────────

function _renderWritersGrid(writers) {
    const grid = document.getElementById('writersGrid');
    if (!grid) return;

    const filtered = _writerFilter
        ? writers.filter(w => w.country === _writerFilter)
        : writers;

    if (!filtered.length) {
        grid.innerHTML = `<div class="writers-empty">😔 No hay escritores de este país aún. ¡Próximamente!</div>`;
        return;
    }

    grid.innerHTML = filtered.map(w => {
        const info   = _countryInfo(w.country);
        const genres = (w.genres || []).map(g => `<span class="writer-genre-tag">${_genreLabel(g)}</span>`).join('');
        return `
            <div class="writer-card" data-writer="${w.id}">
                <div class="writer-card-emoji">${w.image}</div>
                <div class="writer-card-info">
                    <div class="writer-card-name">${w.name}</div>
                    <div class="writer-card-meta">${info.emoji} ${info.label} · ${w.years}</div>
                    <div class="writer-card-genres">${genres}</div>
                </div>
            </div>`;
    }).join('');

    grid.querySelectorAll('.writer-card').forEach(card => {
        card.addEventListener('click', () => _loadWriterTexts(card.dataset.writer));
    });
}

// ─── Lista de textos de un escritor ──────────────────────────

function _loadWriterTexts(writerId) {
    const data   = window.writers_es?.es;
    if (!data) return;
    const writer = data.writers.find(w => w.id === writerId);
    const texts  = data.texts[writerId] || [];
    if (!writer) return;

    const info = _countryInfo(writer.country);

    mainContainer.innerHTML = '';
    renderLanguageBar();

    const typeGroups = {};
    texts.forEach(t => {
        if (!typeGroups[t.type]) typeGroups[t.type] = [];
        typeGroups[t.type].push(t);
    });

    const groupsHTML = Object.entries(typeGroups).map(([type, items]) => `
        <div class="writer-texts-group">
            <div class="writer-texts-group-title">${_genreLabel(type)}</div>
            ${items.map(text => `
                <div class="writer-text-card" data-text-id="${text.id}">
                    <div class="writer-text-title">${text.title}</div>
                    <div class="writer-text-preview">${_previewText(text.original)}</div>
                </div>`).join('')}
        </div>`).join('');

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="writers-panel">
            <div class="writers-header">
                <button class="school-back-btn" id="writerTextsBackBtn">← Volver</button>
                <div class="writer-texts-identity">
                    <span class="writer-texts-emoji">${writer.image}</span>
                    <div>
                        <div class="writer-texts-name">${writer.name}</div>
                        <div class="writer-texts-meta">${info.emoji} ${info.label} · ${writer.years}</div>
                    </div>
                </div>
            </div>
            <div class="writer-texts-list">
                ${groupsHTML || '<div class="writers-empty">No hay textos cargados aún.</div>'}
            </div>
        </div>
    `);

    document.getElementById('writerTextsBackBtn').addEventListener('click', loadWritersMenu);

    document.querySelectorAll('.writer-text-card').forEach(card => {
        card.addEventListener('click', () => {
            const text = texts.find(t => t.id === card.dataset.textId);
            if (text) _openTextReader(text, writer);
        });
    });
}

// ─── Lector lado a lado ───────────────────────────────────────

function _openTextReader(text, writer) {
    document.querySelector('.wt-reader-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'wt-reader-overlay';

    const info    = _countryInfo(writer.country);
    const typeTag = _genreLabel(text.type);
    const translations = _normalizeTextTranslations(text);
    const hasMultiple   = translations.length > 1;

    overlay.innerHTML = `
        <div class="wt-reader-modal">
            <div class="wt-reader-header">
                <div class="wt-reader-meta">
                    <span class="wt-reader-type-badge">${typeTag}</span>
                    <span class="wt-reader-author">${writer.image} ${writer.name} · ${info.emoji}</span>
                </div>
                <button class="wt-reader-close" id="wtReaderClose">×</button>
            </div>
            <h3 class="wt-reader-title">${text.title}</h3>

            <div class="wt-reader-body">
                <div class="wt-reader-col wt-reader-col--original">
                    <div class="wt-reader-col-label">🌐 Original · ${_langLabel(text.lang)}</div>
                    <div class="wt-reader-text" id="wtOriginal">${_formatText(text.original)}</div>
                </div>
                <div class="wt-reader-divider"></div>
                <div class="wt-reader-col wt-reader-col--translation">
                    <div class="wt-reader-col-label">
                        🔤 Traducción${hasMultiple ? '' : ' · ' + _langLabel(translations[0]?.lang)}
                        ${hasMultiple ? `
                        <select class="wt-reader-lang-select" id="wtTranslationLangSelect">
                            ${translations.map((t, i) => `<option value="${i}">${_langLabel(t.lang)}</option>`).join('')}
                        </select>` : ''}
                    </div>
                    <div class="wt-reader-text" id="wtTranslation">${_formatText(translations[0]?.text)}</div>
                </div>
            </div>

            <div class="wt-reader-footer">
                <button class="wt-reader-action-btn" id="wtSpeakBtn">🔊 Escuchar</button>
                <button class="wt-reader-action-btn" id="wtSaveBtn">💾 Guardar</button>
                ${(typeof isAdmin === 'function' && isAdmin() && text.id?.startsWith('wt_')) ? `<button class="wt-reader-action-btn" id="wtConfigBtn">⚙️ Config.</button>` : ''}
                <button class="wt-reader-action-btn wt-reader-action-btn--ghost" id="wtCloseFooterBtn">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.getElementById('wtReaderClose').addEventListener('click', close);
    document.getElementById('wtCloseFooterBtn').addEventListener('click', close);

    document.getElementById('wtConfigBtn')?.addEventListener('click', () => {
        close();
        if (typeof _showSubmitForm === 'function') {
            _showSubmitForm({
                id: text.id,
                writerName: writer.name,
                writerCountry: text.country,
                writerContinent: text.continent,
                title: text.title,
                type: text.type,
                original: text.original,
                lang: text.lang,
                translations,
                visibility: 'public',
            });
        }
    });

    document.getElementById('wtTranslationLangSelect')?.addEventListener('change', e => {
        const t = translations[parseInt(e.target.value, 10)];
        document.getElementById('wtTranslation').innerHTML = _formatText(t?.text);
    });

    document.getElementById('wtSpeakBtn').addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(text.original);
        utterance.lang = text.lang === 'es' ? 'es-ES' : text.lang;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    });

    document.getElementById('wtSaveBtn').addEventListener('click', () => {
        const user = (typeof currentUser !== 'undefined') ? currentUser : null;
        if (!user) { if (typeof showToast === 'function') showToast('Iniciá sesión para guardar textos'); return; }
        const key = `ls_saved_texts_${user.id}`;
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        if (!saved.find(s => s.id === text.id)) {
            saved.push({ ...text, writerId: writer.id, writerName: writer.name, savedAt: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(saved));
            if (typeof showToast === 'function') showToast('✅ Texto guardado');
        } else {
            if (typeof showToast === 'function') showToast('Ya tenés este texto guardado');
        }
    });
}

// ─── Formulario de subida ─────────────────────────────────────

// `existingEntry`: si viene (solo desde el botón ⚙️ Config. del admin), el
// formulario abre en modo edición precargado, y al guardar hace PATCH sobre
// esa submission en vez de crear una nueva.
function _showSubmitForm(existingEntry = null) {
    const user    = (typeof currentUser !== 'undefined') ? currentUser : null;
    const isAdmin = user?.isDev === true;
    const isEdit  = !!existingEntry;
    const isPrem  = isAdmin || ['premium','premium_monthly','premium_annual','oro_monthly',
                                'oro_annual','contributor_monthly','contributor_quarterly',
                                'trial'].includes(user?.plan);

    if (!isEdit) {
        if (!user) {
            if (typeof showToast === 'function') showToast('Iniciá sesión para subir contenido');
            return;
        }
        if (!isPrem && !isAdmin) {
            if (typeof showToast === 'function') showToast('Se requiere membresía Premium para subir textos');
            return;
        }
    }

    document.querySelector('.wt-submit-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'wt-submit-overlay wt-reader-overlay';

    const data     = window.writers_es?.es;
    const writers  = data?.writers || [];
    const writerOpts = writers.map(w =>
        `<option value="${w.name}" data-id="${w.id}" data-country="${w.country || ''}">${w.name}</option>`
    ).join('');

    const isContrib = isAdmin || (user?.plan || '').startsWith('contributor');
    const pointsInfo = (isContrib && !isEdit)
        ? `<div class="wt-submit-points-info">🏆 Texto: <strong>+5 pts</strong> · Con traducción: <strong>+8 pts adicionales</strong> · A los 50 pts obtenés 1 mes gratis</div>`
        : '';

    // ─ Precarga para modo edición ─
    let initialContinentKey = '', initialCountryLabel = '';
    let initialTranslations = [{ lang: 'Inglés', text: '' }];
    if (isEdit) {
        const code = (existingEntry.writerCountry || '').toLowerCase();
        const known = _WRITER_COUNTRIES[code];
        const cont  = (existingEntry.writerContinent && _WRITER_CONTINENTS.find(c => c.key === existingEntry.writerContinent))
            ? { key: existingEntry.writerContinent }
            : _continentForCode(code);
        initialContinentKey = cont?.key || '';
        initialCountryLabel = known ? known.label : (existingEntry.writerCountry || '');
        const existingTrans = _normalizeTextTranslations({ translations: existingEntry.translations, translation: existingEntry.translation, targetLang: existingEntry.targetLang });
        initialTranslations = existingTrans.length ? existingTrans.map(t => ({ lang: _langLabel(t.lang), text: t.text })) : [{ lang: 'Inglés', text: '' }];
    }

    const continentOpts = _WRITER_CONTINENTS.map(c =>
        `<option value="${c.key}" ${c.key === initialContinentKey ? 'selected' : ''}>${c.emoji} ${c.label}</option>`
    ).join('');

    const translationBlockHTML = (t, idx) => `
        <div class="wt-translation-block" data-idx="${idx}">
            ${idx > 0 ? `<button type="button" class="wt-remove-translation-btn" title="Quitar">✕</button>` : ''}
            <div class="wt-submit-field">
                <label>Idioma de la traducción ${idx === 0 ? '<span class="wt-submit-hint">— opcional, suma +8 pts</span>' : ''}</label>
                <div class="wt-lang-input-wrap">
                    <input type="text" class="contrib-input wt-trans-lang" list="wtLangList" placeholder="Ej: Inglés" value="${t.lang || ''}">
                    <span class="wt-lang-check" title="Idioma reconocido">✓</span>
                </div>
            </div>
            <div class="wt-submit-field">
                <label>Traducción</label>
                <textarea class="contrib-input wt-trans-text" rows="4" maxlength="3000" placeholder="Traducción (opcional)">${t.text || ''}</textarea>
            </div>
        </div>`;

    overlay.innerHTML = `
        <div class="wt-reader-modal wt-submit-modal">
            <div class="wt-reader-header">
                <div class="wt-reader-meta">
                    <span class="wt-reader-type-badge">${isEdit ? '⚙️ Configurar texto' : '⬆️ Subir texto'}</span>
                    ${isEdit ? '<span class="wt-reader-author">Editando como Admin</span>' : (isAdmin ? '<span class="wt-reader-author">Admin · aprobación directa</span>' : '')}
                </div>
                <button class="wt-reader-close" id="wtSubmitClose">×</button>
            </div>

            <div class="wt-submit-body">
                ${pointsInfo}

                <div class="wt-submit-row">
                    <div class="wt-submit-field">
                        <label>Escritor/a *</label>
                        <input list="wtWritersList" id="wtSubmitWriter" class="contrib-input"
                            placeholder="Nombre del escritor/a" value="${existingEntry?.writerName || ''}">
                        <datalist id="wtWritersList">${writerOpts}</datalist>
                    </div>
                </div>

                <div class="wt-submit-row">
                    <div class="wt-submit-field wt-submit-field--sm">
                        <label>Continente *</label>
                        <select id="wtSubmitContinent" class="contrib-input">
                            <option value="">— Continente —</option>
                            ${continentOpts}
                        </select>
                    </div>
                    <div class="wt-submit-field">
                        <label>País *</label>
                        <input list="wtCountryList" id="wtSubmitCountry" class="contrib-input"
                            placeholder="${initialContinentKey ? 'Escribí el país...' : 'Elegí el continente primero'}"
                            value="${initialCountryLabel}" ${initialContinentKey ? '' : 'disabled'}>
                        <datalist id="wtCountryList"></datalist>
                    </div>
                </div>

                <div class="wt-submit-row">
                    <div class="wt-submit-field">
                        <label>Título *</label>
                        <input type="text" id="wtSubmitTitle" class="contrib-input" placeholder="Título del texto" maxlength="120" value="${existingEntry?.title || ''}">
                    </div>
                    <div class="wt-submit-field wt-submit-field--sm">
                        <label>Tipo *</label>
                        <select id="wtSubmitType" class="contrib-input">
                            <option value="poema"     ${existingEntry?.type === 'poema'     ? 'selected' : ''}>🎭 Poema</option>
                            <option value="fragmento" ${existingEntry?.type === 'fragmento' ? 'selected' : ''}>📄 Fragmento</option>
                            <option value="cuento"    ${existingEntry?.type === 'cuento'    ? 'selected' : ''}>📖 Cuento</option>
                            <option value="ensayo"    ${existingEntry?.type === 'ensayo'    ? 'selected' : ''}>✍️ Ensayo</option>
                            <option value="frase"     ${existingEntry?.type === 'frase'     ? 'selected' : ''}>💬 Frase célebre</option>
                        </select>
                    </div>
                </div>

                <div class="wt-submit-field">
                    <label>Idioma del texto original *</label>
                    <div class="wt-lang-input-wrap">
                        <input type="text" id="wtSubmitLang" class="contrib-input" list="wtLangList" placeholder="Ej: Español"
                            value="${isEdit ? _langLabel(existingEntry.lang) : 'Español'}">
                        <span class="wt-lang-check" title="Idioma reconocido">✓</span>
                    </div>
                    <datalist id="wtLangList">${_WRITER_LANGUAGES.map(l => `<option value="${l}"></option>`).join('')}</datalist>
                </div>
                <div class="wt-submit-field">
                    <label>Texto original * <span class="wt-submit-hint">— máx. 1500 caracteres para textos públicos</span></label>
                    <textarea id="wtSubmitOriginal" class="contrib-input" rows="5" maxlength="3000"
                        placeholder="Pegá aquí el fragmento, poema o frase...">${existingEntry?.original || ''}</textarea>
                    <div class="wt-submit-charcount"><span id="wtOriginalCount">${(existingEntry?.original || '').length}</span> / 1500</div>
                </div>

                <div class="wt-submit-translations" id="wtTranslationsWrap">
                    ${initialTranslations.map(translationBlockHTML).join('')}
                </div>
                <button type="button" class="wt-add-translation-btn" id="wtAddTranslationBtn">➕ Agregar traducción</button>

                <div class="wt-submit-row">
                    <div class="wt-submit-field">
                        <label>Visibilidad</label>
                        <select id="wtSubmitVisibility" class="contrib-input">
                            <option value="public"  ${existingEntry?.visibility !== 'private' ? 'selected' : ''}>🌐 Público — visible para todos</option>
                            <option value="private" ${existingEntry?.visibility === 'private' ? 'selected' : ''}>🔒 Privado — solo para mí</option>
                        </select>
                    </div>
                </div>

                <div id="wtSubmitError" class="contrib-error hidden"></div>
            </div>

            <div class="wt-reader-footer">
                <button class="wt-reader-action-btn wt-reader-action-btn--ghost" id="wtSubmitCancelBtn">Cancelar</button>
                <button class="wt-reader-action-btn" id="wtSubmitSendBtn" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none">
                    ${isEdit ? '💾 Guardar cambios' : (isAdmin ? '✅ Publicar directamente' : '📤 Enviar para revisión')}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('wtSubmitClose').addEventListener('click',      () => overlay.remove());
    document.getElementById('wtSubmitCancelBtn').addEventListener('click',  () => overlay.remove());

    // Continente → habilita/actualiza el datalist de países de ese continente
    const continentSelect = document.getElementById('wtSubmitContinent');
    const countryInput    = document.getElementById('wtSubmitCountry');
    const countryList     = document.getElementById('wtCountryList');
    const _fillCountryList = (contKey, keepValue) => {
        const cont = _WRITER_CONTINENTS.find(c => c.key === contKey);
        if (!keepValue) countryInput.value = '';
        if (!cont) {
            countryInput.disabled = true;
            countryInput.placeholder = 'Elegí el continente primero';
            countryList.innerHTML = '';
            return;
        }
        countryInput.disabled = false;
        countryInput.placeholder = 'Escribí el país...';
        countryList.innerHTML = cont.countries.map(c => `<option value="${c.label}"></option>`).join('');
    };
    if (initialContinentKey) _fillCountryList(initialContinentKey, true);
    continentSelect.addEventListener('change', () => _fillCountryList(continentSelect.value, false));

    // Autocompletar continente/país al elegir escritor existente
    document.getElementById('wtSubmitWriter').addEventListener('change', e => {
        const opt = document.querySelector(`#wtWritersList option[value="${e.target.value}"]`);
        const code = opt?.dataset.country;
        if (!code) return;
        const cont = _continentForCode(code);
        if (cont) {
            continentSelect.value = cont.key;
            _fillCountryList(cont.key, false);
        }
        countryInput.value = _WRITER_COUNTRIES[code]?.label || code;
    });

    // Contador de caracteres
    const origTA = document.getElementById('wtSubmitOriginal');
    const countEl = document.getElementById('wtOriginalCount');
    origTA.addEventListener('input', () => {
        const len = origTA.value.length;
        countEl.textContent = len;
        countEl.style.color = len > 1500 ? '#ef4444' : 'var(--text-muted)';
    });

    // Indicador visual de idioma reconocido (✓) en los campos de idioma
    const bindLangCheck = input => {
        const check = input.parentElement.querySelector('.wt-lang-check');
        if (!check) return;
        const update = () => check.classList.toggle('wt-lang-check--visible', !!_matchLanguage(input.value));
        input.addEventListener('input', update);
        update();
    };
    bindLangCheck(document.getElementById('wtSubmitLang'));
    document.querySelectorAll('.wt-trans-lang').forEach(bindLangCheck);

    // Agregar / quitar bloques de traducción
    let transIdx = initialTranslations.length;
    const bindRemove = block => block.querySelector('.wt-remove-translation-btn')?.addEventListener('click', () => block.remove());
    document.querySelectorAll('.wt-translation-block').forEach(bindRemove);
    document.getElementById('wtAddTranslationBtn').addEventListener('click', () => {
        const wrap = document.getElementById('wtTranslationsWrap');
        const div  = document.createElement('div');
        div.innerHTML = translationBlockHTML({ lang: '', text: '' }, transIdx++);
        const block = div.firstElementChild;
        wrap.appendChild(block);
        bindRemove(block);
        bindLangCheck(block.querySelector('.wt-trans-lang'));
    });

    document.getElementById('wtSubmitSendBtn').addEventListener('click', async () => {
        const writerName    = document.getElementById('wtSubmitWriter').value.trim();
        const writerContinent = continentSelect.value;
        const writerCountryTyped = countryInput.value.trim();
        const matchedCountry = writerContinent ? _matchCountryInContinent(writerContinent, writerCountryTyped) : null;
        const writerCountry  = matchedCountry ? matchedCountry.code : writerCountryTyped;
        const title          = document.getElementById('wtSubmitTitle').value.trim();
        const type           = document.getElementById('wtSubmitType').value;
        const lang           = document.getElementById('wtSubmitLang').value.trim();
        const original       = document.getElementById('wtSubmitOriginal').value.trim();
        const visibility     = document.getElementById('wtSubmitVisibility').value;
        const errEl          = document.getElementById('wtSubmitError');

        const translations = Array.from(document.querySelectorAll('.wt-translation-block')).map(block => ({
            lang: block.querySelector('.wt-trans-lang').value.trim(),
            text: block.querySelector('.wt-trans-text').value.trim(),
        })).filter(t => t.text);

        errEl.classList.add('hidden');

        if (!writerName || !writerContinent || !writerCountryTyped || !title || !lang || !original) {
            errEl.textContent = 'Completá escritor, continente, país, título, idioma original y texto original.';
            errEl.classList.remove('hidden');
            return;
        }
        if (!isAdmin && original.length > 1500 && visibility === 'public') {
            errEl.textContent = 'Los textos públicos no pueden superar 1500 caracteres (temas de copyright). Guardalo como Privado o acortá el extracto.';
            errEl.classList.remove('hidden');
            return;
        }

        const btn = document.getElementById('wtSubmitSendBtn');
        btn.disabled = true;
        btn.textContent = isEdit ? 'Guardando...' : 'Enviando...';

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (isEdit || isAdmin) headers['x-admin-token'] = await _loadAdminToken();
            else                   headers['Authorization']  = `Bearer ${typeof authGetToken === 'function' ? authGetToken() : ''}`;

            const url    = isEdit ? `${_API_HOST}/admin/writers/${existingEntry.id}` : `${_API_HOST}/writers/submit`;
            const method = isEdit ? 'PATCH' : 'POST';
            const body   = { writerName, writerCountry, writerContinent, title, type, original, lang, translations, visibility };

            const r = await fetch(url, { method, headers, body: JSON.stringify(body) });
            const json = await r.json();
            if (!r.ok) throw new Error(json.error || 'Error al guardar');

            overlay.remove();
            _writersData = null; // forzar recarga con nuevo contenido

            if (isEdit) {
                if (typeof showToast === 'function') showToast('✅ Cambios guardados');
                if (document.getElementById('adminTabContent') && typeof _adminLoadTab === 'function') {
                    _adminLoadTab('writers');
                } else if (typeof loadWritersMenu === 'function') {
                    loadWritersMenu();
                }
            } else {
                const pts = json.pointsAwarded ? ` (+${json.pointsAwarded} pts)` : '';
                const msg = isAdmin ? `✅ Texto publicado directamente` : `📤 Texto enviado para revisión${pts}`;
                if (typeof showToast === 'function') showToast(msg);
                if (isAdmin) loadWritersMenu();
            }
        } catch (e) {
            errEl.textContent = e.message;
            errEl.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = isEdit ? '💾 Guardar cambios' : (isAdmin ? '✅ Publicar directamente' : '📤 Enviar para revisión');
        }
    });
}

// ─── Modal intro / reglas ────────────────────────────────────

function _showWritersIntro() {
    document.querySelector('.wt-intro-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'wt-intro-overlay';
    overlay.innerHTML = `
        <div class="wt-intro-modal">
            <div class="wt-intro-header">
                <h2>📖 Escritores y Escritos</h2>
                <button class="wt-intro-close" id="wtIntroClose">×</button>
            </div>
            <div class="wt-intro-body">

                <div class="wt-intro-section">
                    <div class="wt-intro-icon">🌐</div>
                    <div>
                        <strong>¿Qué encontrás aquí?</strong>
                        <p>Fragmentos, poemas, cuentos cortos, ensayos y frases célebres de escritores del mundo hispanohablante, con traducción lado a lado para aprender el idioma en contexto literario.</p>
                    </div>
                </div>

                <div class="wt-intro-section">
                    <div class="wt-intro-icon">📏</div>
                    <div>
                        <strong>Textos cortos vs. largos</strong>
                        <p>Los textos breves (fragmentos, poemas, frases) son públicos y accesibles a todos. Los textos largos que vos subas se guardan únicamente en tu dispositivo y requieren <strong>membresía Premium</strong>.</p>
                    </div>
                </div>

                <div class="wt-intro-section">
                    <div class="wt-intro-icon">⬆️</div>
                    <div>
                        <strong>Subir contenido</strong>
                        <p>Con plan <strong>Premium</strong> podés subir tus propios textos y traducciones. Los textos cortos pueden marcarse como <em>Públicos</em> (visibles para la comunidad) o <em>Privados</em> (solo para vos).</p>
                    </div>
                </div>

                <div class="wt-intro-section wt-intro-section--highlight">
                    <div class="wt-intro-icon">🏆</div>
                    <div>
                        <strong>Sistema de puntos — Plan Contributor</strong>
                        <p>Si tenés el plan Contributor, cada texto que subas suma <strong>5 puntos</strong> y cada traducción <strong>8 puntos</strong>. Al llegar a <strong>50 puntos</strong> obtenés un mes extra gratuito automáticamente.</p>
                    </div>
                </div>

            </div>
            <div class="wt-intro-footer">
                <button class="wt-intro-ok-btn" id="wtIntroOk">Entendido →</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('wtIntroClose').addEventListener('click', () => overlay.remove());
    document.getElementById('wtIntroOk').addEventListener('click', () => overlay.remove());
}

// ─── Helpers ──────────────────────────────────────────────────

const _WRITER_COUNTRIES = {};
_WRITER_CONTINENTS.forEach(cont => cont.countries.forEach(c => {
    _WRITER_COUNTRIES[c.code] = { label: c.label, emoji: _flagEmoji(c.code) };
}));

// `cc` puede ser un código conocido (viejo formato) o texto libre (país no
// matcheado al guardar) — en ese caso se muestra tal cual con ícono genérico.
function _countryInfo(cc) {
    if (!cc) return { label: '?', emoji: '🌐' };
    return _WRITER_COUNTRIES[cc.toLowerCase()] || { label: cc, emoji: '🌐' };
}

function _genreLabel(type) {
    return { poema: '🎭 Poema', fragmento: '📄 Fragmento', cuento: '📖 Cuento', ensayo: '✍️ Ensayo', frase: '💬 Frase célebre' }[type] || type;
}

// `code` puede ser un código conocido (viejo formato) o un idioma escrito
// libremente por el usuario (nuevo formato) — se muestra tal cual en ese caso.
function _langLabel(code) {
    if (!code) return '?';
    const known = { es: 'Español', en: 'English', pt: 'Português', fr: 'Français', de: 'Deutsch', it: 'Italiano' }[code.toLowerCase()];
    if (known) return known;
    return code.length <= 3 ? code.toUpperCase() : code;
}

// Normaliza el modelo viejo (translation/targetLang sueltos) y el nuevo
// (translations[]) a un array uniforme para el lector y el editor.
function _normalizeTextTranslations(text) {
    if (Array.isArray(text.translations)) return text.translations;
    if (text.translation) return [{ lang: text.targetLang || 'en', text: text.translation }];
    return [];
}

function _previewText(text, maxLen = 80) {
    const clean = text?.replace(/\n/g, ' ').trim() || '';
    return clean.length > maxLen ? clean.slice(0, maxLen) + '…' : clean;
}

function _formatText(text) {
    return (text || '').split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('');
}
