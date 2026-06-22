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

    // Carga el archivo estático base
    const staticData = await new Promise((resolve) => {
        const script   = document.createElement('script');
        script.src     = `data/songs_${lang}.js`;
        script.onload  = () => {
            const fullData = window[`songs_${lang}`];
            resolve(fullData?.[lang] || null);
        };
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
    });

    // Carga submissions aprobadas del servidor
    let serverData = null;
    try {
        const res = await fetch(`${_API_HOST}/songs/data/${lang}`);
        if (res.ok) serverData = await res.json();
    } catch { /* sin conexión o sin submissions */ }

    // Merge: combina artistas y canciones de ambas fuentes
    const merged = _mergeSongData(staticData, serverData);

    if (!merged || merged.artists.length === 0) {
        throw new Error(`No se encontraron datos para ${lang}`);
    }

    loadedSongs[lang] = merged;
    return merged;
}

function _mergeSongData(staticData, serverData) {
    if (!staticData && !serverData) return null;
    if (!serverData) return staticData;
    if (!staticData) return serverData;

    // Merge artistas (sin duplicados por id)
    const artistsById = {};
    [...staticData.artists, ...serverData.artists].forEach(a => {
        if (!artistsById[a.id]) artistsById[a.id] = a;
    });

    // Merge canciones por artistId
    const songs = { ...staticData.songs };
    Object.entries(serverData.songs).forEach(([artistId, songList]) => {
        if (!songs[artistId]) {
            songs[artistId] = songList;
        } else {
            // Evitar duplicados por id de canción
            const existing = new Set(songs[artistId].map(s => s.id));
            songList.forEach(s => { if (!existing.has(s.id)) songs[artistId].push(s); });
        }
    });

    return { artists: Object.values(artistsById), songs };
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
            <div class="musicians-menu-header">
                <button id="backToMainFromMusicians" class="secondary-btn">← Volver al menú</button>
                <button id="addArtistBtn" class="add-artist-btn">＋ Agregar Artista</button>
            </div>
            <h2 class="musicians-title">🎵 Música del mundo</h2>
            <p class="musicians-subtitle">De acuerdo al idioma que tengas seleccionado como <strong>objetivo</strong> se mostrarán los músicos de ese idioma. También podés filtrar y buscar por país.</p>
            <div class="artists-grid">
                ${artists.map(artist => {
                    const isUrl = artist.image && (artist.image.startsWith('/') || artist.image.startsWith('http'));
                    const avatarHTML = isUrl
                        ? `<div class="artist-avatar artist-avatar--img"><img src="${artist.image}" alt="${artist.name}" onerror="this.parentElement.innerHTML='🎵'"></div>`
                        : `<div class="artist-avatar">${artist.image}</div>`;
                    return `
                    <div class="artist-card" data-artist-id="${artist.id}" data-artist-name="${artist.name}">
                        ${avatarHTML}
                        <h3>${artist.name}</h3>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `);
    document.getElementById('backToMainFromMusicians').addEventListener('click', showMainMenu);
    document.getElementById('addArtistBtn').addEventListener('click', loadAddSongForm);
    document.querySelectorAll('.artist-card').forEach(card => {
        card.addEventListener('click', () => {
            currentArtistId   = card.dataset.artistId;
            currentArtistName = card.dataset.artistName;
            currentSongsObject = currentLangData.songs;
            loadSongsList(currentArtistId, currentArtistName, currentLangData.songs);
        });
    });
}

// ─── Formulario de contribución ───────────────────────────────

function loadAddSongForm() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="add-song-panel">

            <!-- Header -->
            <button class="secondary-btn" id="addSongBackBtn">← Volver a artistas</button>

            <!-- Intro -->
            <div class="add-song-intro">
                <div class="add-song-intro-text">
                    <h2 class="add-song-title">¡Te agradecemos por contribuir con nosotros!</h2>
                    <p class="add-song-subtitle">Subiendo una letra de una canción sumás puntos y pasás a ser contribuidor de nuestra aplicación.<br>
                    Al obtener <strong>100 puntos</strong> tenés <strong>1 mes gratis</strong>. Y al sumar <strong>240 puntos</strong> te regalamos <strong>3 meses en Premium</strong>.</p>
                    <div class="add-song-points-bar">
                        <span class="add-song-points-badge">⭐ +10 pts por canción aprobada</span>
                        <span class="add-song-points-badge add-song-points-badge--gold">🏆 100 pts = 1 mes gratis</span>
                        <span class="add-song-points-badge add-song-points-badge--premium">👑 240 pts = 3 meses Premium</span>
                    </div>
                </div>
            </div>

            <!-- Área principal -->
            <div class="add-song-body">

                <!-- Columna izquierda: formulario -->
                <div class="add-song-form-col">
                    <div class="add-song-artist-row">
                        <div class="add-song-form-group" style="flex:1">
                            <label class="add-song-label">Artista</label>
                            <input type="text" id="asfArtist" class="add-song-input" placeholder="Nombre del artista o banda">
                        </div>
                        <div class="add-song-img-upload" id="asfImgUpload" title="Agregar foto del artista">
                            <input type="file" id="asfImgFile" accept="image/*" style="display:none">
                            <div class="add-song-img-preview" id="asfImgPreview">
                                <span class="add-song-img-icon">🖼</span>
                                <span class="add-song-img-label">Foto</span>
                            </div>
                        </div>
                    </div>
                    <div class="add-song-form-group">
                        <label class="add-song-label">Canción</label>
                        <input type="text" id="asfSong" class="add-song-input" placeholder="Título de la canción">
                    </div>
                    <div class="add-song-form-row">
                        <div class="add-song-form-group">
                            <label class="add-song-label">Idioma</label>
                            <select id="asfLang" class="add-song-input">
                                <option value="">Seleccionar...</option>
                                <option value="es">Español</option>
                                <option value="en">English</option>
                                <option value="fr">Français</option>
                                <option value="it">Italiano</option>
                                <option value="pt">Português</option>
                                <option value="de">Deutsch</option>
                                <option value="ja">日本語</option>
                                <option value="ko">한국어</option>
                                <option value="ar">العربية</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div class="add-song-form-group">
                            <label class="add-song-label">País de origen</label>
                            <input type="text" id="asfCountry" class="add-song-input" placeholder="Ej: Argentina">
                        </div>
                    </div>
                    <div class="add-song-form-group">
                        <label class="add-song-label">Link de YouTube <span class="add-song-optional">(opcional)</span></label>
                        <input type="url" id="asfYoutube" class="add-song-input" placeholder="https://www.youtube.com/watch?v=...">
                    </div>
                    <div class="add-song-form-group add-song-form-group--grow">
                        <label class="add-song-label">Letra de la canción</label>
                        <textarea id="asfLyrics" class="add-song-textarea" placeholder="Pegá la letra completa aquí..."></textarea>
                    </div>
                </div>

                <!-- Columna derecha: traducciones múltiples -->
                <div class="add-song-trans-col" id="addSongTransCol">
                    <button class="add-song-trans-toggle" id="addSongTransToggle">
                        <span id="addSongTransToggleIcon">＋</span> Agregar Traducción
                    </button>
                    <div class="add-song-trans-panel hidden" id="addSongTransPanel">
                        <div id="asfTransList"></div>
                        <button class="add-song-add-trans-btn" id="asfAddTransBtn">＋ Añadir otra traducción</button>
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <div class="add-song-footer">
                <p class="add-song-footer-note">📋 Tu contribución será revisada antes de publicarse. Recibís los puntos al ser aprobada.</p>
                <button class="add-song-submit-btn" id="asfSubmitBtn">Enviar canción</button>
            </div>

            <div id="asfFeedback" class="add-song-feedback hidden"></div>
        </div>
    `);

    document.getElementById('addSongBackBtn').addEventListener('click', loadMusiciansMenu);

    // ── Imagen del artista ────────────────────────────────────
    const imgUpload  = document.getElementById('asfImgUpload');
    const imgFile    = document.getElementById('asfImgFile');
    const imgPreview = document.getElementById('asfImgPreview');
    let _artistImageB64 = null;

    imgUpload.addEventListener('click', () => imgFile.click());
    imgFile.addEventListener('change', () => {
        const file = imgFile.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            _artistImageB64 = e.target.result; // base64 data URL
            imgPreview.innerHTML = `<img src="${_artistImageB64}" class="add-song-img-thumb" alt="preview">`;
            imgUpload.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    });

    // ── Helpers para las filas de traducción ──────────────────
    const LANG_OPTIONS = `
        <option value="">Seleccionar...</option>
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="it">Italiano</option>
        <option value="pt">Português</option>
        <option value="de">Deutsch</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="ar">العربية</option>
        <option value="other">Otro</option>`;

    let _transCount = 0;

    function _addTransRow() {
        const idx = _transCount++;
        const row = document.createElement('div');
        row.className = 'asf-trans-row';
        row.dataset.idx = idx;
        row.innerHTML = `
            <div class="asf-trans-row-header">
                <label class="add-song-label">Traducción ${idx + 1}</label>
                ${idx > 0 ? `<button class="asf-trans-remove" data-idx="${idx}" title="Quitar">✕</button>` : ''}
            </div>
            <select class="add-song-input asf-trans-lang" data-idx="${idx}">${LANG_OPTIONS}</select>
            <textarea class="add-song-textarea asf-trans-text" data-idx="${idx}"
                placeholder="Pegá la traducción completa aquí..."></textarea>`;
        document.getElementById('asfTransList').appendChild(row);
        row.querySelector('.asf-trans-remove')?.addEventListener('click', () => row.remove());
    }

    // Toggle panel: abre y agrega la primera fila automáticamente
    document.getElementById('addSongTransToggle').addEventListener('click', () => {
        const panel = document.getElementById('addSongTransPanel');
        const icon  = document.getElementById('addSongTransToggleIcon');
        const isHidden = panel.classList.toggle('hidden');
        icon.textContent = isHidden ? '＋' : '－';
        if (!isHidden && _transCount === 0) _addTransRow();
    });

    document.getElementById('asfAddTransBtn').addEventListener('click', _addTransRow);

    // ── Submit ────────────────────────────────────────────────
    document.getElementById('asfSubmitBtn').addEventListener('click', async () => {
        const btn        = document.getElementById('asfSubmitBtn');
        const feedback   = document.getElementById('asfFeedback');
        const artistName = document.getElementById('asfArtist').value.trim();
        const songTitle  = document.getElementById('asfSong').value.trim();
        const language   = document.getElementById('asfLang').value;
        const country    = document.getElementById('asfCountry').value.trim();
        const lyrics     = document.getElementById('asfLyrics').value.trim();
        const youtubeUrl = document.getElementById('asfYoutube').value.trim() || null;

        if (!artistName || !songTitle || !language || !lyrics) {
            feedback.textContent = '⚠️ Completá los campos: Artista, Canción, Idioma y Letra.';
            feedback.className = 'add-song-feedback add-song-feedback--error';
            return;
        }

        // Recolectar todas las traducciones válidas (lang + texto no vacíos)
        const translations = [];
        document.querySelectorAll('.asf-trans-row').forEach(row => {
            const lang = row.querySelector('.asf-trans-lang')?.value;
            const text = row.querySelector('.asf-trans-text')?.value.trim();
            if (lang && text) translations.push({ lang, text });
        });

        btn.disabled = true;
        btn.textContent = 'Enviando...';
        feedback.className = 'add-song-feedback hidden';

        try {
            const user = (typeof authGetCurrentUser === 'function' && authGetCurrentUser()) || currentUser;
            const isAdminUser = user?.isDev === true;
            const headers = { 'Content-Type': 'application/json' };
            if (isAdminUser) headers['x-admin-token'] = 'admin_lingua_2025';

            const res = await fetch(_API_HOST + '/songs/submit', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    artistName, songTitle, language, country, lyrics,
                    translations,
                    youtubeUrl,
                    artistImage: _artistImageB64 || null,
                    submittedBy: user?.username || user?.email || 'invitado',
                })
            });
            const data = await res.json();
            if (data.ok) {
                // Invalidar caché para que la próxima visita cargue los datos frescos
                delete loadedSongs[language];
                const msg = data.merged
                    ? `✅ Traducción agregada (${data.addedLangs?.join(', ')}).`
                    : data.autoApproved
                        ? '✅ Canción agregada.'
                        : '✅ ¡Canción enviada! La revisaremos pronto.';
                showToast(msg, 3000);
                // Volver a la vista de artistas
                loadMusiciansMenu();
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (err) {
            feedback.textContent = `❌ Error: ${err.message}`;
            feedback.className = 'add-song-feedback add-song-feedback--error';
            btn.disabled = false;
            btn.textContent = 'Enviar canción';
        }
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
                ${artistSongs.map(song => {
                    const isAdmin = currentUser?.isDev === true;
                    return `
                    <div class="song-card" data-song-id="${song.id}">
                        <h3>${song.title}</h3>
                        ${isAdmin ? `<button class="song-edit-btn" data-song-id="${song.id}" title="Editar">✏️</button>` : ''}
                    </div>`;
                }).join('')}
            </div>
        </div>
    `);
    document.getElementById('backToArtists').addEventListener('click', loadMusiciansMenu);
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.song-edit-btn')) return;
            const song = artistSongs.find(s => s.id === card.dataset.songId);
            if (song) showLyrics(song, artistName);
        });
    });
    document.querySelectorAll('.song-edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const song = artistSongs.find(s => s.id === btn.dataset.songId);
            if (song) _showSongEditPanel(song, artistId, artistName);
        });
    });
}

// ─── Panel de edición (admin) ─────────────────────────────────

function _showSongEditPanel(song, artistId, artistName) {
    const LANG_OPTIONS_EDIT = `
        <option value="">Seleccionar...</option>
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="it">Italiano</option>
        <option value="pt">Português</option>
        <option value="de">Deutsch</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="ar">العربية</option>
        <option value="other">Otro</option>`;

    // Filas de traducciones existentes
    const existingTrans = Object.entries(song.translations || {});
    const transRowsHTML = existingTrans.map(([lang, text], i) => `
        <div class="asf-trans-row sedit-trans-row" data-idx="${i}">
            <div class="asf-trans-row-header">
                <label class="add-song-label">Traducción ${i + 1}</label>
                <button class="asf-trans-remove sedit-remove" data-idx="${i}" title="Quitar">✕</button>
            </div>
            <select class="add-song-input asf-trans-lang sedit-lang" data-idx="${i}">${LANG_OPTIONS_EDIT}</select>
            <textarea class="add-song-textarea asf-trans-text sedit-text" data-idx="${i}">${escapeHtml(text)}</textarea>
        </div>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'sedit-overlay';
    overlay.innerHTML = `
        <div class="sedit-modal">
            <div class="sedit-header">
                <div>
                    <div class="sedit-title">✏️ Editar canción</div>
                    <div class="sedit-subtitle">${escapeHtml(artistName)} — ${escapeHtml(song.title)}</div>
                </div>
                <button class="sedit-close">✕</button>
            </div>
            <div class="sedit-body">
                <div class="sedit-col">
                    <div class="add-song-form-group">
                        <label class="add-song-label">Título</label>
                        <input id="seditTitle" class="add-song-input" value="${escapeHtml(song.title)}">
                    </div>
                    <div class="add-song-form-group">
                        <label class="add-song-label">Link de YouTube <span class="add-song-optional">(opcional)</span></label>
                        <input id="seditYoutube" class="add-song-input" type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value="${escapeHtml(song.youtubeUrl || '')}">
                    </div>
                    <div class="add-song-form-group add-song-form-group--grow">
                        <label class="add-song-label">Letra</label>
                        <textarea id="seditLyrics" class="add-song-textarea sedit-lyrics">${escapeHtml(song.originalLyrics || '')}</textarea>
                    </div>
                </div>
                <div class="sedit-col">
                    <label class="add-song-label" style="margin-bottom:0.5rem;display:block">Traducciones</label>
                    <div id="seditTransList">${transRowsHTML}</div>
                    <button class="add-song-add-trans-btn" id="seditAddTransBtn">＋ Añadir traducción</button>
                </div>
            </div>
            <div class="sedit-footer">
                <span id="seditMsg" class="sedit-msg"></span>
                <button class="add-song-submit-btn" id="seditSaveBtn">Guardar cambios</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    // Setear valores de selects de traducciones existentes
    existingTrans.forEach(([lang], i) => {
        const sel = overlay.querySelector(`.sedit-lang[data-idx="${i}"]`);
        if (sel) sel.value = lang;
    });

    // Quitar fila
    overlay.querySelectorAll('.sedit-remove').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.sedit-trans-row').remove());
    });

    // Añadir fila nueva
    let _editTransCount = existingTrans.length;
    overlay.querySelector('#seditAddTransBtn').addEventListener('click', () => {
        const idx = _editTransCount++;
        const row = document.createElement('div');
        row.className = 'asf-trans-row sedit-trans-row';
        row.dataset.idx = idx;
        row.innerHTML = `
            <div class="asf-trans-row-header">
                <label class="add-song-label">Traducción ${idx + 1}</label>
                <button class="asf-trans-remove sedit-remove" title="Quitar">✕</button>
            </div>
            <select class="add-song-input asf-trans-lang sedit-lang">${LANG_OPTIONS_EDIT}</select>
            <textarea class="add-song-textarea asf-trans-text sedit-text" placeholder="Pegá la traducción aquí..."></textarea>`;
        overlay.querySelector('#seditTransList').appendChild(row);
        row.querySelector('.sedit-remove').addEventListener('click', () => row.remove());
    });

    // Cerrar
    const close = () => overlay.remove();
    overlay.querySelector('.sedit-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Guardar
    overlay.querySelector('#seditSaveBtn').addEventListener('click', async () => {
        const saveBtn = overlay.querySelector('#seditSaveBtn');
        const msg     = overlay.querySelector('#seditMsg');
        const title      = overlay.querySelector('#seditTitle').value.trim();
        const youtubeUrl = overlay.querySelector('#seditYoutube').value.trim() || null;
        const lyrics     = overlay.querySelector('#seditLyrics').value.trim();

        const translations = [];
        overlay.querySelectorAll('.sedit-trans-row').forEach(row => {
            const lang = row.querySelector('.sedit-lang')?.value;
            const text = row.querySelector('.sedit-text')?.value.trim();
            if (lang && text) translations.push({ lang, text });
        });

        saveBtn.disabled = true;
        saveBtn.textContent = 'Guardando...';

        try {
            const res = await fetch(`${_API_HOST}/admin/songs/${song.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': 'admin_lingua_2025' },
                body: JSON.stringify({ title, youtubeUrl, lyrics, translations })
            });
            const data = await res.json();
            if (data.ok) {
                msg.textContent = '✅ Guardado';
                msg.className = 'sedit-msg sedit-msg--ok';
                // Actualizar objeto en memoria para evitar reload completo
                song.title        = title;
                song.youtubeUrl   = youtubeUrl;
                song.originalLyrics = lyrics;
                const transObj = {};
                translations.forEach(t => { transObj[t.lang] = t.text; });
                song.translations = transObj;
                delete loadedSongs[currentSongLang];
                setTimeout(close, 900);
            } else throw new Error(data.error || 'Error');
        } catch(err) {
            msg.textContent = `❌ ${err.message}`;
            msg.className = 'sedit-msg sedit-msg--error';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Guardar cambios';
        }
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
            const res  = await fetch(_API_HOST + '/translate', {
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
            const res  = await fetch(_API_HOST + '/translate', {
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
