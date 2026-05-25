// musicians.js — Sección Músicos: artistas, canciones, letras
// ============================================================
// Depende de globals en app.js: mainContainer, currentTranslations,
// sourceLang, targetLang, renderLanguageBar, showMainMenu,
// requireAuthForAction, escapeHtml, showToast, getLanguageName

// ─── Estado de la sección ─────────────────────────────────────

let currentLangData    = null;
let currentSongLang    = 'es'; // idioma real de las canciones cargadas
let currentArtistId    = null;
let currentArtistName  = null;
let currentSongsObject = null;
let loadedSongs        = {};
let instantTranslationEnabled = true;
let currentSavedWords  = [];

// ─── Carga de datos ───────────────────────────────────────────

async function loadSongsForLanguage(lang) {
    if (loadedSongs[lang]) return loadedSongs[lang];
    return new Promise((resolve, reject) => {
        const script   = document.createElement('script');
        script.src     = `data/songs_${lang}.js`;
        script.onload  = () => {
            const fullData = window[`songs_${lang}`];
            if (fullData?.[lang]) {
                loadedSongs[lang] = fullData[lang];
                resolve(fullData[lang]);
            } else {
                reject(new Error(`No se encontraron datos para ${lang}`));
            }
        };
        script.onerror = () => reject(new Error(`Error cargando songs_${lang}.js`));
        document.head.appendChild(script);
    });
}

// ─── Menú de músicos ──────────────────────────────────────────

async function loadMusiciansMenu() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    // Fallback: targetLang → 'en' → 'es'
    const fallbackChain = [...new Set([targetLang, 'en', 'es'])];
    let langData = null;
    let usedLang  = targetLang;

    for (const lang of fallbackChain) {
        try {
            langData = await loadSongsForLanguage(lang);
            usedLang = lang;
            break;
        } catch {}
    }

    if (!langData) {
        mainContainer.innerHTML += `<div style="padding:2rem;text-align:center;">
            ❌ No hay contenido musical disponible aún.<br>
            <small style="color:var(--text-muted)">Próximamente más idiomas.</small>
        </div>`;
        return;
    }

    if (usedLang !== targetLang) {
        mainContainer.innerHTML += `<div style="padding:0.5rem 1rem;text-align:center;font-size:0.8rem;color:var(--text-muted)">
            📢 Mostrando contenido en ${usedLang.toUpperCase()} — el idioma seleccionado no tiene música aún.
        </div>`;
    }

    currentLangData = langData;
    currentSongLang = usedLang;
    renderArtistsList(langData, usedLang);
}

function renderArtistsList(langData, usedLang = targetLang) {
    const artists = langData.artists;
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="musicians-menu">
            <button id="backToMainFromMusicians" class="secondary-btn">← Volver al menú</button>
            <h2>🎵 Músicos que cantan en ${usedLang.toUpperCase()}</h2>
            <div class="artists-grid">
                ${artists.map(artist => `
                    <div class="artist-card" data-artist-id="${artist.id}" data-artist-name="${artist.name}">
                        <div class="artist-avatar">${artist.image}</div>
                        <h3>${artist.name}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
    document.getElementById('backToMainFromMusicians').addEventListener('click', showMainMenu);
    document.querySelectorAll('.artist-card').forEach(card => {
        card.addEventListener('click', () => {
            currentArtistId   = card.dataset.artistId;
            currentArtistName = card.dataset.artistName;
            currentSongsObject = currentLangData.songs;
            loadSongsList(currentArtistId, currentArtistName, currentLangData.songs);
        });
    });
}

// ─── Lista de canciones ───────────────────────────────────────

function loadSongsList(artistId, artistName, songsObject) {
    const artistSongs = songsObject[artistId];
    if (!artistSongs?.length) {
        mainContainer.innerHTML = '<div style="padding:2rem;">No hay canciones disponibles.</div>';
        renderLanguageBar();
        return;
    }
    mainContainer.innerHTML = '';
    renderLanguageBar();
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="songs-list-panel">
            <button id="backToArtists" class="secondary-btn">← Volver a artistas</button>
            <h2>🎵 ${artistName}</h2>
            <div class="songs-grid">
                ${artistSongs.map(song => `
                    <div class="song-card" data-song-id="${song.id}">
                        <h3>${song.title}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
    document.getElementById('backToArtists').addEventListener('click', loadMusiciansMenu);
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', () => {
            const song = artistSongs.find(s => s.id === card.dataset.songId);
            if (song) showLyrics(song, artistName);
        });
    });
}

// ─── Vista de letra ───────────────────────────────────────────

function showLyrics(song, artistName) {
    const savedKey = `savedWords_${song.id}`;
    currentSavedWords = JSON.parse(localStorage.getItem(savedKey) || '[]');
    if (!currentUser) currentSavedWords = [];

    const availableTranslations  = Object.keys(song.translations).sort();
    // Preferir targetLang, si no está disponible tomar el primero de la lista
    let   currentTranslationLang = availableTranslations.includes(targetLang)
        ? targetLang
        : (availableTranslations[0] || sourceLang);
    const t = currentTranslations;
    let   translationText = song.translations[currentTranslationLang] || t.translate_error;

    mainContainer.innerHTML = '';
    renderLanguageBar();
    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="lyrics-panel">
            <div class="lyrics-header">
                <button id="backToSongs" class="secondary-btn">← ${t.volver_a_canciones}</button>
                <h2>${song.title} - ${artistName}</h2>
            </div>
            <div class="lyrics-toolbar">
                <div class="translation-selector">
                    <label>${t.traduccion_a}</label>
                    <select id="translationLangSelect">
                        ${availableTranslations.map(lang => `
                            <option value="${lang}" ${lang === currentTranslationLang ? 'selected' : ''}>
                                ${getLanguageName(lang)}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="tools">
                    <button id="toggleInstantTranslationBtn" class="tool-btn ${instantTranslationEnabled ? 'active' : ''}">
                        🔍 ${instantTranslationEnabled ? t.traduccion_on : t.traduccion_off}
                    </button>
                </div>
                <div class="info-tip">
                    <span class="info-icon">ℹ️</span>
                    <span class="info-text">${t.info_traduccion_canciones}</span>
                </div>
            </div>
            <div class="lyrics-pane-dots">
                <div class="lyrics-pane-dot lyrics-pane-dot--active" data-pane="0"></div>
                <div class="lyrics-pane-dot" data-pane="1"></div>
            </div>
            <div class="lyrics-columns" id="lyricsColumns">
                <div class="lyrics-pane-track" id="lyricsPaneTrack">
                    <div class="lyrics-original" id="originalLyricsContainer">
                        <h3>${t.letra_original} (${currentSongLang.toUpperCase()})</h3>
                        <pre id="originalLyricsText">${escapeHtml(song.originalLyrics)}</pre>
                    </div>
                    <div class="lyrics-divider" id="lyricsDivider">
                        <div class="lyrics-divider-handle">
                            <span></span><span></span>
                        </div>
                    </div>
                    <div class="lyrics-translation">
                        <h3>${t.traduccion} (<span id="translationLangLabel">${getLanguageName(currentTranslationLang)}</span>)</h3>
                        <pre id="translationText">${escapeHtml(translationText)}</pre>
                    </div>
                </div>
            </div>
            <div class="saved-words-panel">
                <h3>📚 ${t.frases_guardadas}
                    <button id="saveToFlashcardsBtn" class="small-btn"
                            style="${currentSavedWords.length === 0 ? 'display:none' : ''}">
                        ➕ ${t.guardar_flashcard}
                    </button>
                </h3>
                <ul id="savedWordsList" class="saved-words-list"></ul>
            </div>
        </div>
    `);

    // ── Selector de traducción ────────────────────────────────
    document.getElementById('translationLangSelect').addEventListener('change', e => {
        const newLang = e.target.value;
        document.getElementById('translationText').innerText =
            song.translations[newLang] || 'Traducción no disponible';
        document.getElementById('translationLangLabel').innerText = getLanguageName(newLang);
    });

    // ── Toggle traducción instantánea ─────────────────────────
    document.getElementById('toggleInstantTranslationBtn').addEventListener('click', () => {
        instantTranslationEnabled = !instantTranslationEnabled;
        const btn = document.getElementById('toggleInstantTranslationBtn');
        btn.textContent = `🔍 ${instantTranslationEnabled ? 'Traducción instantánea ON' : 'Traducción instantánea OFF'}`;
        btn.classList.toggle('active', instantTranslationEnabled);
    });

    // ── Popup de selección ────────────────────────────────────
    // Original: traduce desde el idioma de la canción hacia el del usuario
    document.getElementById('originalLyricsText').addEventListener('contextmenu', e => {
        e.preventDefault();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText.length > 0 && selectedText.length < 150) {
            showSelectionPopup(selectedText, e.pageX, e.pageY, song, currentSongLang, targetLang);
        }
    });
    // Traducción: dirección inversa — desde el idioma de traducción hacia el de la canción
    document.getElementById('translationText').addEventListener('contextmenu', e => {
        e.preventDefault();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText.length > 0 && selectedText.length < 150) {
            showSelectionPopup(selectedText, e.pageX, e.pageY, song, currentTranslationLang, currentSongLang);
        }
    });

    // ── Volver ────────────────────────────────────────────────
    document.getElementById('backToSongs').addEventListener('click', () => {
        loadSongsList(currentArtistId, currentArtistName, currentSongsObject);
    });

    // ── Guardar como flashcards ───────────────────────────────
    document.getElementById('saveToFlashcardsBtn')?.addEventListener('click', () => {
        if (!requireAuthForAction('guardar flashcards')) return;
        if (!currentSavedWords.length) return;
        _showSaveGroupModal(currentSavedWords, song.title, () => {
            currentSavedWords = [];
            localStorage.setItem(savedKey, JSON.stringify(currentSavedWords));
            renderSavedWordsListUI();
        });
    });

    // ── Helpers de lista de palabras ──────────────────────────

    function renderSavedWordsListHTML() {
        if (!currentSavedWords.length)
            return '<li>No hay palabras guardadas. Seleccioná texto y usá "Guardar como Flashcard".</li>';
        return currentSavedWords.map((item, idx) => `
            <li data-idx="${idx}">
                <span><strong>${escapeHtml(item.word)}</strong> → ${escapeHtml(item.translation)}</span>
                <button class="remove-word-btn" data-idx="${idx}">❌</button>
            </li>`).join('');
    }

    function renderSavedWordsListUI() {
        const list = document.getElementById('savedWordsList');
        if (!list) return;
        list.innerHTML = renderSavedWordsListHTML();
        const btn = document.getElementById('saveToFlashcardsBtn');
        if (btn) btn.style.display = currentSavedWords.length > 0 ? 'inline-block' : 'none';
        document.querySelectorAll('.remove-word-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentSavedWords.splice(parseInt(btn.dataset.idx), 1);
                localStorage.setItem(savedKey, JSON.stringify(currentSavedWords));
                renderSavedWordsListUI();
            });
        });
    }

    function addWordToList(word, translation) {
        if (!requireAuthForAction('guardar esta palabra')) return;
        currentSavedWords.push({ word, translation, timestamp: new Date().toISOString() });
        localStorage.setItem(savedKey, JSON.stringify(currentSavedWords));
        renderSavedWordsListUI();
        showToast(`"${word}" guardado como flashcard`);
    }

    window.currentSaveWord = (word, translation) => addWordToList(word, translation);
    renderSavedWordsListUI();

    // ── Panning de columnas (mobile) ──────────────────────────
    _initLyricsPanning();
}

function _initLyricsPanning() {
    const viewport = document.getElementById('lyricsColumns');
    const track    = document.getElementById('lyricsPaneTrack');
    const dots     = document.querySelectorAll('.lyrics-pane-dot');
    if (!viewport || !track) return;

    // Solo activo en mobile (< 700px); en desktop no hace nada
    let paneIndex = 0;

    function setPane(idx) {
        // En desktop no hay desplazamiento
        if (window.innerWidth >= 700) return;
        paneIndex = idx;
        const paneWidth = viewport.clientWidth;
        track.style.transform = idx === 0 ? '' : `translateX(calc(-${paneWidth}px - 1rem))`;
        dots.forEach((d, i) => d.classList.toggle('lyrics-pane-dot--active', i === idx));
    }

    // Click en los dots
    dots.forEach(d => d.addEventListener('click', () => setPane(+d.dataset.pane)));

    const divider = document.getElementById('lyricsDivider');

    // Drag / swipe — mouse solo desde el divisor, touch desde toda la vista
    let startX = 0, startY = 0, dragging = false;

    function onStart(x, y) {
        if (window.innerWidth >= 700) return;
        startX = x; startY = y; dragging = true;
    }
    function onEnd(x, y) {
        if (!dragging) return;
        dragging = false;
        const dx = startX - x;
        const dy = Math.abs(startY - y);
        if (Math.abs(dx) < 40 || dy > Math.abs(dx)) return;
        if (dx > 0 && paneIndex === 0) setPane(1);
        else if (dx < 0 && paneIndex === 1) setPane(0);
    }

    // Touch — desde toda la vista para comodidad en mobile
    viewport.addEventListener('touchstart', e => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    viewport.addEventListener('touchend',   e => onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });

    // Mouse — solo desde el divisor
    if (divider) {
        divider.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
        document.addEventListener('mouseup',  e => { if (dragging) onEnd(e.clientX, e.clientY); });
    }
}

// ─── Modal: guardar palabras como grupo de flashcards ─────────

function _showSaveGroupModal(words, songTitle, onSaved) {
    document.getElementById('saveGroupModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'saveGroupModal';
    modal.className = 'sgm-overlay';
    modal.innerHTML = `
        <div class="sgm-card">
            <button class="sgm-close" id="sgmCloseBtn">✕</button>
            <h3 class="sgm-title">💾 Guardar grupo de flashcards</h3>
            <p class="sgm-subtitle">${words.length} tarjeta${words.length !== 1 ? 's' : ''} seleccionada${words.length !== 1 ? 's' : ''}</p>
            <label class="sgm-label" for="sgmGroupName">Nombre del grupo</label>
            <input id="sgmGroupName" class="sgm-input" type="text"
                   placeholder="Ej: Canciones de ${escapeHtml(songTitle)}"
                   value="Canciones — ${escapeHtml(songTitle)}" maxlength="60">
            <div class="sgm-btns">
                <button class="primary-btn" id="sgmSaveBtn">Guardar</button>
                <button class="secondary-btn" id="sgmGoBtn">Ir a Flashcards</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const nameInput = modal.querySelector('#sgmGroupName');
    nameInput.focus();
    nameInput.select();

    function doSave() {
        const name = nameInput.value.trim() || `Canciones — ${songTitle}`;
        loadFlashcardData();
        const groupId = `cg_${Date.now()}`;
        flashcardGroups.push({ id: groupId, name, lastUsed: new Date().toISOString() });
        words.forEach(w => {
            flashcards.push({
                id:          `cf_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
                groupId,
                word:        w.word,
                translation: w.translation,
                source:      songTitle,
                date:        new Date().toISOString()
            });
        });
        saveFlashcardData();
        onSaved();
        return groupId;
    }

    let saved = false;

    modal.querySelector('#sgmSaveBtn').addEventListener('click', () => {
        if (saved) return;
        doSave();
        saved = true;
        // Feedback dentro del modal, no cierra
        nameInput.disabled = true;
        modal.querySelector('#sgmSaveBtn').disabled = true;
        modal.querySelector('#sgmSaveBtn').textContent = '✅ Guardado';
        modal.querySelector('#sgmGoBtn').textContent = '→ Ir a Mis Tarjetas';
        const hint = document.createElement('p');
        hint.className = 'sgm-saved-hint';
        hint.textContent = 'Grupo guardado. Podés ir a verlo o cerrar esta ventana.';
        modal.querySelector('.sgm-btns').insertAdjacentElement('beforebegin', hint);
    });

    modal.querySelector('#sgmGoBtn').addEventListener('click', () => {
        if (!saved) doSave();
        modal.remove();
        if (typeof showCustomGroupsPanel === 'function') showCustomGroupsPanel();
        else if (typeof loadPracticeMenu === 'function') loadPracticeMenu();
    });

    modal.querySelector('#sgmCloseBtn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// ─── Popup de selección ───────────────────────────────────────

let activeSelectionPopup = null;

function showSelectionPopup(selectedText, x, y, song, fromLang, toLang) {
    if (activeSelectionPopup) activeSelectionPopup.remove();
    const popup = document.createElement('div');
    popup.className  = 'selection-popup';
    popup.style.left = `${x}px`;
    popup.style.top  = `${y}px`;
    popup.innerHTML  = `
        <button class="popup-btn translate-btn">📖 Traducir</button>
        <button class="popup-btn save-btn">💾 Guardar como Flashcard</button>
    `;
    document.body.appendChild(popup);
    activeSelectionPopup = popup;

    popup.querySelector('.translate-btn').addEventListener('click', async () => {
        popup.remove(); activeSelectionPopup = null;
        try {
            const res  = await fetch('http://localhost:3000/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: selectedText, plan: 'free', sourceLang: fromLang, targetLang: toLang })
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            showTranslationModal(selectedText, JSON.parse(data.translation));
        } catch { alert('Error al traducir'); }
    });

    popup.querySelector('.save-btn').addEventListener('click', async () => {
        popup.remove(); activeSelectionPopup = null;
        try {
            const res  = await fetch('http://localhost:3000/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: selectedText.trim(), plan: 'free', sourceLang: fromLang, targetLang: toLang })
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            const obj  = JSON.parse(data.translation);
            const translation = (obj.neutral || obj.formal || obj.informal).trim();
            if (window.currentSaveWord) window.currentSaveWord(selectedText.trim(), translation);
        } catch (err) { console.error(err); alert('Error al obtener traducción'); }
    });

    setTimeout(() => {
        const closeOutside = e => {
            if (!popup.contains(e.target)) {
                popup.remove(); activeSelectionPopup = null;
                document.removeEventListener('click', closeOutside);
            }
        };
        document.addEventListener('click', closeOutside);
    }, 10);
}

// ─── Modal de traducción ──────────────────────────────────────

function showTranslationModal(originalText, translationObj) {
    const t = currentTranslations;
    document.body.insertAdjacentHTML('beforeend', `
        <div id="translationModal" class="modal">
            <div class="modal-content translation-modal">
                <span class="close-modal">&times;</span>
                <h3>📝 ${t.idioma_origen || 'Traducción de'} "${escapeHtml(originalText)}"</h3>
                <div class="translation-variants">
                    <div class="variant formal"><strong>${t.formal}</strong> ${escapeHtml(translationObj.formal)}</div>
                    <div class="variant informal"><strong>${t.informal}</strong> ${escapeHtml(translationObj.informal)}</div>
                    <div class="variant neutral"><strong>${t.neutral}</strong> ${escapeHtml(translationObj.neutral)}</div>
                </div>
                <button id="copyAllBtn" class="primary-btn">${t.copy_all || 'Copiar todo'}</button>
                <button id="saveFlashcardFromModalBtn" class="secondary-btn">${t.guardar_flashcard || 'Guardar flashcard'}</button>
            </div>
        </div>
    `);
    const modal = document.getElementById('translationModal');
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    document.getElementById('copyAllBtn').addEventListener('click', () => {
        const allText = `Formal: ${translationObj.formal}\nInformal: ${translationObj.informal}\nNeutral: ${translationObj.neutral}`;
        navigator.clipboard?.writeText(allText)
            .then(() => alert('Copiado al portapapeles'))
            .catch(() => {
                const ta = document.createElement('textarea');
                ta.value = allText;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                alert('Copiado al portapapeles');
            });
    });

    document.getElementById('saveFlashcardFromModalBtn').addEventListener('click', () => {
        const translation = (translationObj.neutral || translationObj.formal || translationObj.informal).trim();
        if (window.currentSaveWord) {
            window.currentSaveWord(originalText.trim(), translation);
            modal.remove();
        } else {
            alert('No se puede guardar ahora');
        }
    });
}
