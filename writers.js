// writers.js — Sección "Escritores y Escritos"
// =============================================

let _writersData    = null;
let _writerFilter   = null; // country code ISO-2 | null
const _WRITERS_KEY  = 'ls_writers_lang';

// ─── Carga de datos ───────────────────────────────────────────

async function loadWritersData(lang = 'es') {
    if (_writersData) return _writersData;

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
    _writersData = raw;
    return _writersData;
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

    try {
        const data = await loadWritersData('es');
        _renderWritersCountryBar(data.writers);
        _renderWritersGrid(data.writers);
    } catch (e) {
        document.getElementById('writersGrid').innerHTML =
            `<div class="writers-error">❌ ${e.message}</div>`;
    }
}

// ─── Barra de filtro por país ─────────────────────────────────

function _renderWritersCountryBar(writers) {
    const bar = document.getElementById('writersCountryBar');
    if (!bar) return;

    const countries = [];
    const seen = new Set();
    writers.forEach(w => {
        if (!seen.has(w.country)) {
            seen.add(w.country);
            const info = _countryInfo(w.country);
            countries.push({ code: w.country, ...info });
        }
    });

    bar.innerHTML = `
        <div class="explorer-country-bar">
            <span class="explorer-country-label">🌎 País:</span>
            <div class="explorer-country-chips">
                <button class="explorer-chip ${!_writerFilter ? 'active' : ''}" data-cc="">Todos</button>
                ${countries.map(c =>
                    `<button class="explorer-chip ${_writerFilter === c.code ? 'active' : ''}" data-cc="${c.code}">${c.emoji} ${c.label}</button>`
                ).join('')}
            </div>
        </div>
    `;

    bar.querySelectorAll('.explorer-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            _writerFilter = chip.dataset.cc || null;
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
                    <div class="wt-reader-col-label">🔤 Traducción · ${_langLabel(text.targetLang)}</div>
                    <div class="wt-reader-text" id="wtTranslation">${_formatText(text.translation)}</div>
                </div>
            </div>

            <div class="wt-reader-footer">
                <button class="wt-reader-action-btn" id="wtSpeakBtn">🔊 Escuchar</button>
                <button class="wt-reader-action-btn" id="wtSaveBtn">💾 Guardar</button>
                <button class="wt-reader-action-btn wt-reader-action-btn--ghost" id="wtCloseFooterBtn">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.getElementById('wtReaderClose').addEventListener('click', close);
    document.getElementById('wtCloseFooterBtn').addEventListener('click', close);

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

const _WRITER_COUNTRIES = {
    ar: { label: 'Argentina',       emoji: '🇦🇷' },
    cl: { label: 'Chile',           emoji: '🇨🇱' },
    uy: { label: 'Uruguay',         emoji: '🇺🇾' },
    mx: { label: 'México',          emoji: '🇲🇽' },
    co: { label: 'Colombia',        emoji: '🇨🇴' },
    pe: { label: 'Perú',            emoji: '🇵🇪' },
    es: { label: 'España',          emoji: '🇪🇸' },
    br: { label: 'Brasil',          emoji: '🇧🇷' },
    us: { label: 'EE.UU.',          emoji: '🇺🇸' },
    cu: { label: 'Cuba',            emoji: '🇨🇺' },
    ve: { label: 'Venezuela',       emoji: '🇻🇪' },
    bo: { label: 'Bolivia',         emoji: '🇧🇴' },
    py: { label: 'Paraguay',        emoji: '🇵🇾' },
    gt: { label: 'Guatemala',       emoji: '🇬🇹' },
    ec: { label: 'Ecuador',         emoji: '🇪🇨' },
};

function _countryInfo(cc) {
    return _WRITER_COUNTRIES[cc] || { label: cc?.toUpperCase() || '?', emoji: '🌐' };
}

function _genreLabel(type) {
    return { poema: '🎭 Poema', fragmento: '📄 Fragmento', cuento: '📖 Cuento', ensayo: '✍️ Ensayo', frase: '💬 Frase célebre' }[type] || type;
}

function _langLabel(code) {
    return { es: 'Español', en: 'English', pt: 'Português', fr: 'Français', de: 'Deutsch', it: 'Italiano' }[code] || code?.toUpperCase() || '?';
}

function _previewText(text, maxLen = 80) {
    const clean = text?.replace(/\n/g, ' ').trim() || '';
    return clean.length > maxLen ? clean.slice(0, maxLen) + '…' : clean;
}

function _formatText(text) {
    return (text || '').split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('');
}
