// immersion.js — Sección "Aprende con..." v2.0
// =============================================

const _USER_IMM_KEY   = 'ls_imm_user';
const _PINNED_IMM_KEY = 'ls_imm_pinned';  // contenido fijado por admin (actúa como curated)
const _BM_PREFIX      = 'ls_bk_';
const _PROG_PREFIX    = 'ls_prog_';

let _immMedia   = null;   // <audio> o <video>
let _immContent = null;
let _immLineIdx = -1;

// ─────────────────────────────────────────────
// SRT PARSER
// ─────────────────────────────────────────────

function _srtTimeToSec(ts) {
  const clean    = ts.trim().replace(',', '.');
  const [hms, ms = '0'] = clean.split('.');
  const parts    = hms.split(':').map(Number);
  const [h, m, s] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
  return h * 3600 + m * 60 + s + parseFloat('0.' + ms);
}

function _parseSRT(text) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks     = normalized.trim().split(/\n\n+/);
  const result     = [];

  for (const block of blocks) {
    const rows = block.trim().split('\n');
    if (rows.length < 2) continue;

    // Buscar línea de tiempo (puede tener número de secuencia antes)
    let timeIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 3); i++) {
      if (rows[i].includes('-->')) { timeIdx = i; break; }
    }
    if (timeIdx === -1) continue;

    const m = rows[timeIdx].match(
      /(\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3})/
    );
    if (!m) continue;

    const original = rows
      .slice(timeIdx + 1)
      .join(' ')
      .replace(/<[^>]+>/g, '')    // quitar tags HTML (cursiva, etc.)
      .replace(/\{[^}]+\}/g, '')  // quitar tags ASS/SSA
      .trim();

    if (!original) continue;

    result.push({
      start:       _srtTimeToSec(m[1]),
      end:         _srtTimeToSec(m[2]),
      original,
      translation: ''
    });
  }
  return result;
}

// ─────────────────────────────────────────────
// TRADUCCIÓN BATCH DE SUBTÍTULOS SRT
// ─────────────────────────────────────────────

async function _translateSrtBatch(dialogue, overlay, srcLang) {
  const btn      = overlay.querySelector('#immTranslateSrtBtn');
  const progress = overlay.querySelector('#immSrtProgress');
  const fill     = overlay.querySelector('#immSrtFill');
  const label    = overlay.querySelector('#immSrtProgressLabel');
  if (!btn || !progress) return;

  btn.disabled    = true;
  btn.textContent = 'Traduciendo…';
  progress.classList.remove('hidden');

  const total     = dialogue.length;
  const BATCH          = 15;  // líneas por llamada (el endpoint acepta hasta 20)
  let   done           = 0;
  let   hadError       = false;
  const sourceLangCode = srcLang || 'en';

  for (let i = 0; i < total; i += BATCH) {
    const chunk = dialogue.slice(i, i + BATCH);
    const lines = chunk.map(d => d.original);

    try {
      const res = await fetch(_API_HOST + '/translate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, sourceLang: sourceLangCode, targetLang: 'es' })
      });

      if (res.ok) {
        const data = await res.json();
        (data.translations || []).forEach((t, j) => {
          if (t) chunk[j].translation = t;
        });
      } else {
        hadError = true;
      }
    } catch {
      hadError = true;
    }

    done += chunk.length;
    const pct = Math.round((done / total) * 100);
    fill.style.width  = pct + '%';
    label.textContent = `${done} / ${total}`;
  }

  btn.textContent = hadError
    ? '⚠️ Traducción parcial (algunos errores)'
    : `✅ ${total} líneas traducidas`;
  btn.disabled = false;
}

// ─────────────────────────────────────────────
// PROGRESO
// ─────────────────────────────────────────────

function _saveProgress(id, pct, time) {
  localStorage.setItem(
    _PROG_PREFIX + id,
    JSON.stringify({ pct: Math.min(100, Math.round(pct)), time })
  );
}

function _getProgress(id) {
  try { return JSON.parse(localStorage.getItem(_PROG_PREFIX + id) || 'null'); }
  catch { return null; }
}

// ─────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────

function loadImmersionSection() {
  _immCleanup();
  const main = document.getElementById('mainContainer');
  main.innerHTML = '';
  _renderBrowser(main);
}

// ─────────────────────────────────────────────
// BROWSER (catálogo de contenidos)
// ─────────────────────────────────────────────

// Mapa código → { name, flag } para el selector de idioma
const _IMM_LANGS = [
  { code: 'en', name: 'Inglés',     flag: '🇺🇸' },
  { code: 'es', name: 'Español',    flag: '🇪🇸' },
  { code: 'pt', name: 'Portugués',  flag: '🇧🇷' },
  { code: 'fr', name: 'Francés',    flag: '🇫🇷' },
  { code: 'de', name: 'Alemán',     flag: '🇩🇪' },
  { code: 'it', name: 'Italiano',   flag: '🇮🇹' },
  { code: 'ja', name: 'Japonés',    flag: '🇯🇵' },
  { code: 'ko', name: 'Coreano',    flag: '🇰🇷' },
  { code: 'zh', name: 'Chino',      flag: '🇨🇳' },
  { code: 'ru', name: 'Ruso',       flag: '🇷🇺' },
  { code: 'ar', name: 'Árabe',      flag: '🇸🇦' },
  { code: 'tr', name: 'Turco',      flag: '🇹🇷' },
  { code: 'nl', name: 'Neerlandés', flag: '🇳🇱' },
  { code: 'pl', name: 'Polaco',     flag: '🇵🇱' },
];
const _IMM_LANG_KEY = 'ls_imm_targetLang';

function _renderBrowser(container) {
  // Idioma activo: primero el guardado en imm, luego el global de la app, luego 'en'
  const activeLang = localStorage.getItem(_IMM_LANG_KEY)
    || (typeof targetLang !== 'undefined' ? targetLang : '')
    || 'en';

  const all    = _getAllImmContent();
  // Filtrar por idioma activo; si no hay contenido para ese idioma mostrar todos
  const filtered = all.filter(c => c.language === activeLang);
  const list   = filtered.length > 0 ? filtered : all;
  const groups = {};
  list.forEach(c => {
    if (!groups[c.language])
      groups[c.language] = { flag: c.country, name: c.languageName, items: [] };
    groups[c.language].items.push(c);
  });

  const activeLangInfo = _IMM_LANGS.find(l => l.code === activeLang) || { name: activeLang, flag: '🌐' };

  container.innerHTML = `
    <div class="imm-wrap">
      <div class="imm-topbar">
        <button class="imm-back-btn" id="immBackMenu">← Menú</button>
        <h2 class="imm-page-title">🌍 Aprende con...</h2>
        <div class="imm-lang-picker-wrap">
          <select class="imm-lang-picker" id="immLangPicker" title="Idioma del contenido">
            ${_IMM_LANGS.map(l => `
              <option value="${l.code}" ${l.code === activeLang ? 'selected' : ''}>
                ${l.flag} ${l.name}
              </option>`).join('')}
          </select>
        </div>
        <button class="imm-add-btn" id="immAddBtn">＋ Agregar</button>
      </div>

      <!-- Cartel introductorio -->
      <div class="imm-intro-banner">
        <span class="imm-intro-icon">${activeLangInfo.flag}</span>
        <p>Mostrando contenido en <strong>${activeLangInfo.name}</strong>. Cambiá el idioma desde el selector para explorar otros catálogos.</p>
      </div>

      ${Object.keys(groups).length === 0 ? `
        <div class="imm-empty">
          <div class="imm-empty-icon">🎬</div>
          <p>No hay contenido en <strong>${activeLangInfo.name}</strong> todavía.<br>¡Agregá tu primer video o audio con subtítulos!</p>
          <button class="primary-btn" id="immAddFirst">＋ Agregar</button>
        </div>
      ` : Object.entries(groups).map(([lang, g]) => `
        <div class="imm-lang-group">
          <div class="imm-lang-label">
            <span class="imm-lang-flag">${g.flag}</span>
            <span class="imm-lang-name">${g.name}</span>
          </div>
          <div class="imm-cards-row">
            ${g.items.map(item => {
              const prog = _getProgress(item.id);
              const pct  = prog ? prog.pct : 0;
              return `
                <div class="imm-card ${item.imageSrc ? 'imm-card--cinematic' : ''}" data-id="${item.id}">
                  ${item.imageSrc ? `
                  <div class="imm-card-bg" style="background-image:url('${item.imageSrc}');background-position:${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%"></div>
                  ` : `
                  <div class="imm-card-thumb">
                    ${item.thumbnail || '🎬'}
                  </div>`}
                  <div class="imm-card-body">
                    <div class="imm-card-title">${_esc(item.title)}</div>
                    <div class="imm-card-sub">${_esc(item.subtitle || '')}</div>
                    <div class="imm-card-foot">
                      <span class="imm-tag">${item.category}</span>
                      <span class="imm-tag-lines">${item.dialogue.length} frases</span>
                    </div>
                    <div class="imm-card-progbar">
                      <div class="imm-card-progfill" style="width:${pct}%"></div>
                    </div>
                    ${pct > 0 ? `<span class="imm-card-proglabel">${pct}% visto</span>` : ''}
                  </div>
                  ${item._user ? `
                    <div class="imm-card-actions">
                      <button class="imm-edit-btn" data-id="${item.id}" title="Editar">✏️</button>
                      <button class="imm-del-btn"  data-del="${item.id}" title="Eliminar">🗑️</button>
                    </div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('immBackMenu').addEventListener('click', showMainMenu);
  document.getElementById('immAddBtn').addEventListener('click', () => _showAddModal(container));
  document.getElementById('immAddFirst')?.addEventListener('click', () => _showAddModal(container));

  document.getElementById('immLangPicker').addEventListener('change', function() {
    localStorage.setItem(_IMM_LANG_KEY, this.value);
    _renderBrowser(container);
  });

  container.querySelectorAll('.imm-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.imm-del-btn')) return;
      const c = _getAllImmContent().find(x => x.id === card.dataset.id);
      if (c) _loadStudyArea(container, c);
    });
  });

  container.querySelectorAll('.imm-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = _getUserImmContent().find(c => c.id === btn.dataset.id);
      if (item) _showAddModal(container, item);
    });
  });

  container.querySelectorAll('.imm-del-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!confirm('¿Eliminar este contenido?')) return;
      const list = _getUserImmContent().filter(c => c.id !== btn.dataset.del);
      localStorage.setItem(_USER_IMM_KEY, JSON.stringify(list));
      _renderBrowser(container);
    });
  });
}

// ─────────────────────────────────────────────
// STUDY AREA
// ─────────────────────────────────────────────

function _loadStudyArea(container, content) {
  _immCleanup();
  _immContent = content;
  _immLineIdx = -1;

  const bookmarks = _getBookmarks(content.id);
  const progress  = _getProgress(content.id);
  const isVideoHTML = !!content.videoSrc;

  container.innerHTML = `
    <div class="imm-wrap imm-study-wrap">

      <!-- Banner con imagen de portada -->
      <div class="imm-banner ${content.imageSrc ? 'imm-banner--img' : ''}"
           ${content.imageSrc ? `style="background-image:url('${content.imageSrc}'); background-position:${content.imagePosX ?? 50}% ${content.imagePosY ?? 50}%"` : ''}>
        <button class="imm-back-btn imm-back-btn--banner" id="saBack">← Volver</button>
        <div class="imm-banner-pill">
          <span class="imm-banner-title">${_esc(content.title)}</span>
          ${content.subtitle ? `<span class="imm-banner-sub">${_esc(content.subtitle)}</span>` : ''}
        </div>
        <span class="imm-flag-badge">${content.country}</span>
        ${content._user ? `<button class="imm-edit-banner-btn" id="saEditBtn" title="Editar contenido">✏️</button>` : ''}
      </div>

      <!-- Progreso global -->
      <div class="imm-global-prog-wrap">
        <div class="imm-global-prog-bar">
          <div class="imm-global-prog-fill" id="immGlobalFill"
               style="width:${progress?.pct || 0}%"></div>
        </div>
        <span class="imm-global-prog-label" id="immGlobalLabel">
          ${progress?.pct || 0}% visto
        </span>
      </div>

      <!-- ── Video local HTML5 ── -->
      ${isVideoHTML ? `
        <div class="imm-video-section">
          <div class="imm-video-hd">
            <span>🎬 Video</span>
            <button class="imm-toggle-vid" id="immToggleVid">▲ Minimizar</button>
          </div>
          <div class="imm-video-body" id="immVideoBody">
            <video id="immMediaEl" src="${content.videoSrc}" preload="metadata"
                   style="width:100%;border-radius:14px;max-height:260px;background:#000;display:block;"
                   controls></video>
          </div>
        </div>

      <!-- ── YouTube embed + audio oculto para sync ── -->
      ` : content.youtubeId ? `
        <div class="imm-video-section">
          <div class="imm-video-hd">
            <span>🎬 Video</span>
            <button class="imm-toggle-vid" id="immToggleVid">▲ Minimizar</button>
          </div>
          <div class="imm-video-body" id="immVideoBody">
            <iframe src="https://www.youtube.com/embed/${content.youtubeId}?rel=0"
                    frameborder="0" allowfullscreen
                    style="width:100%;height:210px;border-radius:14px;"></iframe>
            <div class="imm-yt-note">
              💡 Los subtítulos se sincronizan con el reproductor de audio de abajo
            </div>
          </div>
        </div>
        ${content.audioSrc
          ? `<audio id="immMediaEl" src="${content.audioSrc}" preload="metadata"></audio>`
          : ''}

      <!-- ── Solo audio ── -->
      ` : content.audioSrc ? `
        <audio id="immMediaEl" src="${content.audioSrc}" preload="metadata"></audio>
      ` : ''}

      <!-- ── Reproductor custom (no para video HTML5 que tiene los propios) ── -->
      ${!isVideoHTML ? `
        <div class="imm-player">
          <div class="imm-progress-wrap">
            <div class="imm-progress-bar" id="immProgressBar">
              <div class="imm-progress-fill"  id="immFill"></div>
              <div class="imm-bm-track"       id="immBmTrack"></div>
              <div class="imm-progress-thumb" id="immThumb"></div>
            </div>
            <div class="imm-time-row">
              <span id="immTimeCur">0:00</span>
              <span id="immTimeDur">0:00</span>
            </div>
          </div>
          <div class="imm-controls">
            <button class="imm-ctrl" id="immBack5" title="-5s">⏮ 5s</button>
            <button class="imm-play" id="immPlayBtn">▶</button>
            <button class="imm-ctrl" id="immFwd5"   title="+5s">5s ⏭</button>
            <select class="imm-speed-sel" id="immSpeedSel" title="Velocidad">
              <option value="0.5">0.5×</option>
              <option value="0.75">0.75×</option>
              <option value="1" selected>1×</option>
              <option value="1.25">1.25×</option>
              <option value="1.5">1.5×</option>
            </select>
            <button class="imm-bm-ctrl" id="immAddBm" title="Marcador">🔖</button>
          </div>
          ${!content.audioSrc && !content.videoSrc ? `
            <div class="imm-no-audio">
              ⚠️ Sin archivo de audio. Los subtítulos no se sincronizarán automáticamente.
            </div>
          ` : ''}
        </div>

      <!-- ── Timeline + controles para video HTML5 ── -->
      ` : `
        <div class="imm-player">
          <div class="imm-progress-wrap">
            <div class="imm-progress-bar imm-progress-bar--video" id="immProgressBar">
              <div class="imm-progress-fill"  id="immFill"></div>
              <div class="imm-bm-track"       id="immBmTrack"></div>
              <div class="imm-progress-thumb" id="immThumb"></div>
            </div>
            <div class="imm-time-row">
              <span id="immTimeCur">0:00</span>
              <span id="immTimeDur">0:00</span>
            </div>
          </div>
          <div class="imm-controls imm-controls--video">
            <select class="imm-speed-sel" id="immSpeedSel" title="Velocidad">
              <option value="0.5">0.5×</option>
              <option value="0.75">0.75×</option>
              <option value="1" selected>1×</option>
              <option value="1.25">1.25×</option>
              <option value="1.5">1.5×</option>
            </select>
            <button class="imm-bm-ctrl" id="immAddBm" title="Marcador">🔖</button>
          </div>
        </div>
      `}

      <!-- ── Stage de subtítulos con efecto degradé ── -->
      <div class="imm-subtitle-stage">
        <div class="imm-sub-line imm-sub-prev" id="immSubPrev"></div>
        <div class="imm-sub-line imm-sub-curr" id="immSubCurr">
          <div class="imm-sub-orig imm-sub-idle">▶ Presioná play para comenzar</div>
        </div>
        <div class="imm-sub-line imm-sub-next" id="immSubNext"></div>
      </div>
      <div class="imm-word-hint">
        💡 Tocá cualquier palabra del subtítulo central para guardarla como flashcard
      </div>

      <!-- ── Marcadores (colapsable) ── -->
      <details class="imm-bm-details">
        <summary class="imm-bm-header">
          🔖 Marcadores <span class="imm-bm-badge" id="immBmBadge">${bookmarks.length}</span>
        </summary>
        <div class="imm-bm-list" id="immBmList"></div>
      </details>

      ${content.dialogue?.some(d => !d.translation) ? `
      <!-- ── Traducción IA (si hay subtítulos sin traducir) ── -->
      <div class="imm-translate-panel" id="immTranslatePanel">
        <button class="imm-translate-srt-btn" id="immPlayerTranslateBtn">
          ✨ Traducir subtítulos al español con IA
        </button>
        <div class="imm-srt-progress hidden" id="immPlayerSrtProgress">
          <div class="imm-srt-progress-bar"><div class="imm-srt-progress-fill" id="immPlayerSrtFill"></div></div>
          <span id="immPlayerSrtLabel">0 / ${content.dialogue.length}</span>
        </div>
      </div>` : ''}

      ${content._user || content._pinned ? `
      <!-- ── Editar contenido ── -->
      <button class="imm-edit-content-btn" id="saEditContentBtn">✏️ Editar este contenido</button>
      ` : ''}

      ${(content._user && typeof currentUser !== 'undefined' && currentUser?.isDev) ? `
      <!-- ── Admin: fijar como curated ── -->
      <button class="imm-pin-content-btn" id="saPinContentBtn">
        📌 Fijar como contenido de la app
      </button>
      ` : content._pinned ? `
      <div class="imm-pinned-badge">📌 Contenido fijado en la app</div>
      ` : ''}

    </div>
  `;

  // Obtener elemento media
  _immMedia = document.getElementById('immMediaEl');

  // Reanudar desde donde quedó
  if (_immMedia && progress?.time) {
    _immMedia.currentTime = progress.time;
  }

  // Configurar controles velocidad (aplica para video HTML5 también)
  const speedSel = document.getElementById('immSpeedSel');
  if (speedSel && _immMedia) {
    speedSel.addEventListener('change', () => {
      _immMedia.playbackRate = parseFloat(speedSel.value);
    });
  }

  // Marcador (aplica a video HTML5 también)
  document.getElementById('immAddBm')?.addEventListener('click', () => {
    if (_immMedia) _showBmModal(_immMedia.currentTime, content.id, bookmarks);
  });

  // Video toggle
  document.getElementById('immToggleVid')?.addEventListener('click', () => {
    const body   = document.getElementById('immVideoBody');
    const btn    = document.getElementById('immToggleVid');
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'block' : 'none';
    btn.textContent    = hidden ? '▲ Minimizar' : '▼ Expandir';
  });

  // Configurar reproductor
  if (_immMedia) _setupImmPlayer(content, bookmarks);

  // Renderizar marcadores
  _renderBmList(bookmarks, content.id);

  // ── Traducción IA desde el player ──
  document.getElementById('immPlayerTranslateBtn')?.addEventListener('click', async function() {
    const overlay = { querySelector: id => document.querySelector(id.replace('#imm', '#immPlayer')) };
    // Reusar _translateSrtBatch pero apuntando a los elementos del player
    const btn    = document.getElementById('immPlayerTranslateBtn');
    const prog   = document.getElementById('immPlayerSrtProgress');
    const fill   = document.getElementById('immPlayerSrtFill');
    const label  = document.getElementById('immPlayerSrtLabel');

    btn.disabled    = true;
    btn.textContent = 'Traduciendo…';
    prog.classList.remove('hidden');

    const total = content.dialogue.length;
    const BATCH = 15;
    let done = 0, hadError = false;
    const src = content.language || 'en';

    for (let i = 0; i < total; i += BATCH) {
      const chunk = content.dialogue.slice(i, i + BATCH);
      const lines = chunk.map(d => d.original);
      try {
        const res = await fetch(_API_HOST + '/translate-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines, sourceLang: src, targetLang: 'es' })
        });
        if (res.ok) {
          const data = await res.json();
          (data.translations || []).forEach((t, j) => { if (t) chunk[j].translation = t; });
        } else { hadError = true; }
      } catch { hadError = true; }

      done += chunk.length;
      const pct = Math.round((done / total) * 100);
      fill.style.width  = pct + '%';
      label.textContent = `${done} / ${total}`;
    }

    // Guardar las traducciones en localStorage
    let list = _getUserImmContent();
    list = list.map(c => c.id === content.id ? { ...c, dialogue: content.dialogue } : c);
    localStorage.setItem(_USER_IMM_KEY, JSON.stringify(list));

    btn.textContent = hadError ? '⚠️ Traducción parcial' : '✅ Subtítulos traducidos';
    if (!hadError) document.getElementById('immTranslatePanel')?.remove();
  });

  // Volver
  document.getElementById('saBack').addEventListener('click', () => {
    _immCleanup();
    _renderBrowser(container);
  });

  // Editar (banner + botón de panel) — solo contenido del usuario / pinned
  const _openEdit = () => {
    _immCleanup();
    const fresh = _getUserImmContent().find(c => c.id === content.id)
               || _getPinnedImmContent().find(c => c.id === content.id)
               || content;
    _showAddModal(container, fresh);
  };
  document.getElementById('saEditBtn')?.addEventListener('click', _openEdit);
  document.getElementById('saEditContentBtn')?.addEventListener('click', _openEdit);

  // Fijar como curated (solo admin)
  document.getElementById('saPinContentBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('saPinContentBtn');
    if (!confirm(`¿Fijar "${content.title}" como contenido permanente de la app?\nEsto lo moverá del área de usuario al catálogo general.`)) return;

    // Copiar sin flags _user/_pinned
    const pinned = { ...content };
    delete pinned._user;
    pinned._pinned = true;

    // Agregar a pinned list
    const pinnedList = _getPinnedImmContent();
    if (!pinnedList.find(c => c.id === pinned.id)) pinnedList.push(pinned);
    localStorage.setItem(_PINNED_IMM_KEY, JSON.stringify(pinnedList));

    // Quitar de user list
    const userList = _getUserImmContent().filter(c => c.id !== content.id);
    localStorage.setItem(_USER_IMM_KEY, JSON.stringify(userList));

    btn.textContent  = '✅ Contenido fijado';
    btn.disabled     = true;
    btn.className    = 'imm-pinned-badge';

    // Actualizar referencia local para que el editor funcione
    content._user   = false;
    content._pinned = true;
    document.getElementById('saEditBtn') && (document.getElementById('saEditBtn').style.display = 'none');
  });
}

// ─────────────────────────────────────────────
// PLAYER
// ─────────────────────────────────────────────

function _setupImmPlayer(content, bookmarks) {
  const media = _immMedia;

  // Video HTML5: controles nativos para play/pause, pero nuestra timeline para marcadores y seek
  if (content.videoSrc) {
    const bar   = document.getElementById('immProgressBar');
    const fill  = document.getElementById('immFill');
    const thumb = document.getElementById('immThumb');
    const tCur  = document.getElementById('immTimeCur');
    const tDur  = document.getElementById('immTimeDur');

    media.addEventListener('loadedmetadata', () => {
      if (tDur) tDur.textContent = _immFmt(media.duration);
      _renderBmMarkers(bookmarks, media.duration);
    });

    media.addEventListener('timeupdate', () => _onTick(media, content));

    // Seek clickeando en nuestra barra (mouse + touch)
    bar?.addEventListener('click', e => {
      if (!media.duration) return;
      const rect    = bar.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      media.currentTime = ((clientX - rect.left) / rect.width) * media.duration;
    });

    // Drag en el thumb
    let dragging = false;
    thumb?.addEventListener('mousedown',  () => { dragging = true; });
    thumb?.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
    document.addEventListener('mousemove', e => {
      if (!dragging || !bar || !media.duration) return;
      const rect = bar.getBoundingClientRect();
      media.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * media.duration;
    });
    document.addEventListener('touchmove', e => {
      if (!dragging || !bar || !media.duration) return;
      const rect = bar.getBoundingClientRect();
      media.currentTime = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width)) * media.duration;
    }, { passive: true });
    document.addEventListener('mouseup',  () => { dragging = false; });
    document.addEventListener('touchend', () => { dragging = false; });

    media.addEventListener('ended', () => _saveProgress(content.id, 100, media.duration || 0));
    return;
  }

  // ── Controles custom para audio ──
  const playBtn = document.getElementById('immPlayBtn');
  const bar     = document.getElementById('immProgressBar');
  const fill    = document.getElementById('immFill');
  const thumb   = document.getElementById('immThumb');
  const timeCur = document.getElementById('immTimeCur');
  const timeDur = document.getElementById('immTimeDur');

  if (!playBtn) return;

  // Play / Pause
  playBtn.addEventListener('click', () => {
    if (media.paused) { media.play(); playBtn.textContent = '⏸'; }
    else              { media.pause(); playBtn.textContent = '▶'; }
  });

  // ±5s
  document.getElementById('immBack5')?.addEventListener('click', () => {
    media.currentTime = Math.max(0, media.currentTime - 5);
  });
  document.getElementById('immFwd5')?.addEventListener('click', () => {
    media.currentTime = Math.min(media.duration || Infinity, media.currentTime + 5);
  });

  // Metadata → duración + marcadores en barra
  media.addEventListener('loadedmetadata', () => {
    if (timeDur) timeDur.textContent = _immFmt(media.duration);
    _renderBmMarkers(bookmarks, media.duration);
  });

  // Tick principal
  media.addEventListener('timeupdate', () => {
    const dur = media.duration || 1;
    const pct = (media.currentTime / dur) * 100;
    if (fill)    fill.style.width  = pct + '%';
    if (thumb)   thumb.style.left  = pct + '%';
    if (timeCur) timeCur.textContent = _immFmt(media.currentTime);
    _onTick(media, content);
  });

  media.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    _saveProgress(content.id, 100, media.duration || 0);
  });

  // Seek por click/touch en barra
  bar?.addEventListener('click', e => {
    if (!media.duration) return;
    const rect    = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    media.currentTime = ((clientX - rect.left) / rect.width) * media.duration;
  });

  // Drag en barra (mouse + touch)
  let dragging = false;
  const startDrag = () => { dragging = true; };
  const doSeek   = x => {
    if (!dragging || !bar || !media.duration) return;
    const rect = bar.getBoundingClientRect();
    media.currentTime = Math.max(0, Math.min(1, (x - rect.left) / rect.width)) * media.duration;
  };
  const endDrag = () => { dragging = false; };

  thumb?.addEventListener('mousedown',  startDrag);
  thumb?.addEventListener('touchstart', startDrag, { passive: true });
  document.addEventListener('mousemove', e  => doSeek(e.clientX));
  document.addEventListener('touchmove', e  => doSeek(e.touches[0].clientX), { passive: true });
  document.addEventListener('mouseup',   endDrag);
  document.addEventListener('touchend',  endDrag);
}

// Tick compartido: progreso global + timeline + sync subtítulos
function _onTick(media, content) {
  const cur = media.currentTime;
  const dur = media.duration || 1;
  const pct = (cur / dur) * 100;

  // Progreso global
  const gFill  = document.getElementById('immGlobalFill');
  const gLabel = document.getElementById('immGlobalLabel');
  if (gFill)  gFill.style.width  = Math.round(pct) + '%';
  if (gLabel) gLabel.textContent = Math.round(pct) + '% visto';

  // Timeline (también para video HTML5)
  const fill   = document.getElementById('immFill');
  const thumb  = document.getElementById('immThumb');
  const timeCur = document.getElementById('immTimeCur');
  if (fill)    fill.style.width  = pct + '%';
  if (thumb)   thumb.style.left  = pct + '%';
  if (timeCur) timeCur.textContent = _immFmt(cur);

  _saveProgress(content.id, pct, cur);
  _syncSubtitles(cur, content);
}

// ─────────────────────────────────────────────
// SUBTÍTULOS
// ─────────────────────────────────────────────

function _syncSubtitles(t, content) {
  const dl = content.dialogue;
  if (!dl?.length) return;

  // Buscar línea activa
  let idx = dl.findIndex(d => t >= d.start && t < d.end);
  if (idx === -1) {
    // Entre frases: mostrar la última que pasó
    for (let i = dl.length - 1; i >= 0; i--) {
      if (t >= dl[i].start) { idx = i; break; }
    }
  }

  if (idx === _immLineIdx) return;
  _immLineIdx = idx;

  const prev = idx > 0                              ? dl[idx - 1] : null;
  const curr = idx >= 0                             ? dl[idx]     : null;
  const next = idx >= 0 && idx < dl.length - 1     ? dl[idx + 1] : null;

  _renderSubLine(document.getElementById('immSubPrev'), prev, false);
  _renderSubLine(document.getElementById('immSubCurr'), curr, true);
  _renderSubLine(document.getElementById('immSubNext'), next, false);

  // Bind en palabras de la línea actual
  const currEl = document.getElementById('immSubCurr');
  if (currEl && curr) {
    currEl.querySelectorAll('.imm-word').forEach(w => {
      w.addEventListener('click', e => {
        e.stopPropagation();
        _showWordPopup(w, w.dataset.word, curr, content);
      });
    });
  }
}

function _renderSubLine(el, line, isCurrent) {
  if (!el) return;
  if (!line) { el.innerHTML = ''; return; }

  const isAdmin = typeof currentUser !== 'undefined' && currentUser?.isDev;

  // En la línea central, cada palabra es clickeable
  const origHtml = isCurrent
    ? _makeWords(line.original)
    : _esc(line.original);

  const transHtml = line.translation
    ? `<div class="imm-sub-trans">${_esc(line.translation)}</div>`
    : '';

  const editBtn = isCurrent && isAdmin
    ? `<button class="imm-sub-edit-btn" id="immSubEditBtn" title="Editar esta línea">✏️</button>`
    : '';

  el.innerHTML = `
    <div class="imm-sub-line-inner">
      <div class="imm-sub-orig">${origHtml}</div>
      ${transHtml}
    </div>
    ${editBtn}
  `;

  if (isCurrent && isAdmin) {
    document.getElementById('immSubEditBtn')?.addEventListener('click', e => {
      e.stopPropagation();
      _openSubLineEditor(el, line);
    });
  }
}

function _openSubLineEditor(el, line) {
  // Evitar doble apertura
  if (el.querySelector('.imm-sub-editor')) return;

  el.innerHTML = `
    <div class="imm-sub-editor">
      <label class="imm-sub-editor-label">Original</label>
      <textarea class="imm-sub-editor-input" id="immSubEditOrig" rows="2">${_esc(line.original)}</textarea>
      <label class="imm-sub-editor-label">Traducción</label>
      <textarea class="imm-sub-editor-input" id="immSubEditTrans" rows="2">${_esc(line.translation || '')}</textarea>
      <div class="imm-sub-editor-btns">
        <button class="secondary-btn imm-sub-cancel-btn" id="immSubCancelEdit">Cancelar</button>
        <button class="primary-btn"  id="immSubSaveEdit">💾 Guardar</button>
      </div>
    </div>
  `;

  document.getElementById('immSubCancelEdit').addEventListener('click', () => {
    // Re-renderizar la línea sin edición
    _renderSubLine(el, line, true);
    // Re-bindear palabras
    el.querySelectorAll('.imm-word').forEach(w => {
      w.addEventListener('click', e2 => {
        e2.stopPropagation();
        _showWordPopup(w, w.dataset.word, line, _immContent);
      });
    });
  });

  document.getElementById('immSubSaveEdit').addEventListener('click', () => {
    const newOrig  = document.getElementById('immSubEditOrig').value.trim();
    const newTrans = document.getElementById('immSubEditTrans').value.trim();
    if (!newOrig) return;

    // Actualizar en memoria
    line.original    = newOrig;
    line.translation = newTrans;

    // Persistir en localStorage (user o pinned)
    const saveInList = (key) => {
      try {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const item = list.find(c => c.id === _immContent?.id);
        if (item) {
          const dl = item.dialogue.find(d => d.start === line.start && d.end === line.end);
          if (dl) { dl.original = newOrig; dl.translation = newTrans; }
          localStorage.setItem(key, JSON.stringify(list));
          return true;
        }
      } catch { return false; }
    };
    saveInList(_USER_IMM_KEY) || saveInList(_PINNED_IMM_KEY);

    // Re-renderizar
    _renderSubLine(el, line, true);
    el.querySelectorAll('.imm-word').forEach(w => {
      w.addEventListener('click', e2 => {
        e2.stopPropagation();
        _showWordPopup(w, w.dataset.word, line, _immContent);
      });
    });
  });
}

// Wrap cada token de texto en un <span class="imm-word">
function _makeWords(text) {
  return text.split(/(\s+)/).map(token => {
    if (/^\s+$/.test(token)) return token; // espacio → sin wrap
    const word = token.replace(/[^\p{L}\p{N}'-]/gu, '');
    if (!word) return _esc(token);
    return `<span class="imm-word" data-word="${_esc(word)}">${_esc(token)}</span>`;
  }).join('');
}

// ─────────────────────────────────────────────
// GUARDAR PALABRA COMO FLASHCARD
// ─────────────────────────────────────────────

function _showWordPopup(triggerEl, word, line, content) {
  // Cerrar popup anterior
  document.querySelector('.imm-word-popup')?.remove();

  const groups = JSON.parse(localStorage.getItem('flashcardGroups') || '[]');

  const popup = document.createElement('div');
  popup.className = 'imm-word-popup';
  popup.innerHTML = `
    <div class="imm-wp-word">${_esc(word)}</div>
    <input class="imm-wp-input" id="immWpTrans"
           placeholder="Traducción / significado"
           value="${_esc(line.translation || '')}">
    <select class="imm-wp-select" id="immWpGroup">
      <option value="__new__">＋ Crear grupo: "${_esc(content.title)}"</option>
      ${groups.map(g => `<option value="${g.id}">${_esc(g.name)}</option>`).join('')}
    </select>
    <div class="imm-wp-btns">
      <button class="imm-wp-cancel secondary-btn">✕</button>
      <button class="imm-wp-save primary-btn">💾 Guardar</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Posicionar cerca del elemento
  const rect = triggerEl.getBoundingClientRect();
  popup.style.top  = (rect.bottom + window.scrollY + 8) + 'px';
  popup.style.left = Math.max(8,
    Math.min(rect.left + window.scrollX, window.innerWidth - popup.offsetWidth - 8)
  ) + 'px';

  const close = () => popup.remove();

  popup.querySelector('.imm-wp-cancel').addEventListener('click', close);

  popup.querySelector('.imm-wp-save').addEventListener('click', () => {
    if (typeof requireAuthForAction === 'function' && !requireAuthForAction('guardar flashcard')) return;

    const trans   = (document.getElementById('immWpTrans')?.value || '').trim();
    const groupId = document.getElementById('immWpGroup')?.value;

    let grps  = JSON.parse(localStorage.getItem('flashcardGroups') || '[]');
    let cards = JSON.parse(localStorage.getItem('flashcards')      || '[]');

    let finalGroupId = groupId;
    if (groupId === '__new__') {
      finalGroupId = 'grp_imm_' + Date.now();
      grps.push({
        id:        finalGroupId,
        name:      content.title,
        createdAt: new Date().toISOString(),
        lastUsed:  new Date().toISOString()
      });
      localStorage.setItem('flashcardGroups', JSON.stringify(grps));
    }

    cards.push({
      id:          Date.now() + '-' + Math.random(),
      word,
      translation: trans || '—',
      groupId:     finalGroupId,
      dateAdded:   new Date().toISOString(),
      source:      'immersion'
    });
    localStorage.setItem('flashcards', JSON.stringify(cards));
    if (typeof misionTrack === 'function') misionTrack('flashcard');

    // Sync con arrays globales de app.js
    if (typeof flashcardGroups !== 'undefined') {
      flashcardGroups.length = 0;
      grps.forEach(g => flashcardGroups.push(g));
    }
    if (typeof flashcards !== 'undefined') {
      flashcards.length = 0;
      cards.forEach(c => flashcards.push(c));
    }

    close();
    if (typeof showToast === 'function') showToast(`"${word}" guardada como flashcard ✓`);
  });

  // Cerrar al clic fuera
  setTimeout(() => {
    const outsideClick = e => {
      if (!popup.contains(e.target)) {
        close();
        document.removeEventListener('click', outsideClick);
      }
    };
    document.addEventListener('click', outsideClick);
  }, 10);
}

// ─────────────────────────────────────────────
// BOOKMARKS
// ─────────────────────────────────────────────

function _getBookmarks(id) {
  try { return JSON.parse(localStorage.getItem(_BM_PREFIX + id) || '[]'); }
  catch { return []; }
}
function _saveBookmarks(id, bms) {
  localStorage.setItem(_BM_PREFIX + id, JSON.stringify(bms));
}

function _renderBmList(bookmarks, contentId) {
  const list  = document.getElementById('immBmList');
  const badge = document.getElementById('immBmBadge');
  if (!list) return;
  if (badge) badge.textContent = bookmarks.length;

  if (!bookmarks.length) {
    list.innerHTML = `<div class="imm-bm-empty">Sin marcadores. Usá 🔖 durante la reproducción.</div>`;
    return;
  }

  list.innerHTML = [...bookmarks]
    .sort((a, b) => a.time - b.time)
    .map(bm => `
      <div class="imm-bm-item">
        <button class="imm-bm-go" data-time="${bm.time}">🔖 ${_immFmt(bm.time)}</button>
        <span class="imm-bm-note">${_esc(bm.note || '')}</span>
        <button class="imm-bm-rm"  data-id="${bm.id}">✕</button>
      </div>
    `).join('');

  list.querySelectorAll('.imm-bm-go').forEach(btn => {
    btn.addEventListener('click', () => {
      if (_immMedia) _immMedia.currentTime = parseFloat(btn.dataset.time);
    });
  });

  list.querySelectorAll('.imm-bm-rm').forEach(btn => {
    btn.addEventListener('click', () => {
      const updated = _getBookmarks(contentId).filter(b => b.id !== btn.dataset.id);
      _saveBookmarks(contentId, updated);
      bookmarks.length = 0;
      updated.forEach(b => bookmarks.push(b));
      _renderBmList(bookmarks, contentId);
      _renderBmMarkers(bookmarks, _immMedia?.duration || 0);
    });
  });
}

function _renderBmMarkers(bookmarks, duration) {
  const track = document.getElementById('immBmTrack');
  if (!track || !duration) return;
  track.innerHTML = bookmarks.map(bm => `
    <div class="imm-bm-marker"
         style="left:${(bm.time / duration) * 100}%"
         title="${_immFmt(bm.time)}${bm.note ? ': ' + bm.note : ''}"
         data-time="${bm.time}"></div>
  `).join('');
  track.querySelectorAll('.imm-bm-marker').forEach(m => {
    m.addEventListener('click', e => {
      e.stopPropagation();
      if (_immMedia) _immMedia.currentTime = parseFloat(m.dataset.time);
    });
  });
}

function _showBmModal(time, contentId, bookmarksRef) {
  const overlay = document.createElement('div');
  overlay.className = 'imm-modal-overlay';
  overlay.innerHTML = `
    <div class="imm-modal">
      <h3>🔖 Marcador en ${_immFmt(time)}</h3>
      <input id="immBmNote" class="imm-modal-input" type="text"
             placeholder="Nota opcional..." maxlength="100" autofocus>
      <div class="imm-modal-btns">
        <button class="secondary-btn" id="immBmCancel">Cancelar</button>
        <button class="primary-btn"   id="immBmSave">Guardar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const save = () => {
    const note  = document.getElementById('immBmNote').value.trim();
    const newBm = { id: `bm_${Date.now()}`, time, note };
    bookmarksRef.push(newBm);
    _saveBookmarks(contentId, bookmarksRef);
    _renderBmList(bookmarksRef, contentId);
    _renderBmMarkers(bookmarksRef, _immMedia?.duration || 0);
    overlay.remove();
  };

  document.getElementById('immBmCancel').addEventListener('click', () => overlay.remove());
  document.getElementById('immBmSave').addEventListener('click', save);
  document.getElementById('immBmNote').addEventListener('keydown', e => {
    if (e.key === 'Enter') save();
  });
}

// ─────────────────────────────────────────────
// MODAL "AGREGAR CONTENIDO"
// ─────────────────────────────────────────────

function _showAddModal(container, editItem = null) {
  let parsedDialogue = [];
  let videoObjectUrl = null;
  let audioObjectUrl = null;
  let imagePosition  = { x: 50, y: 50 };  // encuadre de la imagen

  const overlay = document.createElement('div');
  overlay.className = 'imm-modal-overlay';
  overlay.innerHTML = `
    <div class="imm-modal imm-add-modal">
      <h3>${editItem ? "✏️ Editar contenido" : "＋ Nuevo contenido"}</h3>

      <!-- Info básica -->
      <div class="imm-add-section">
        <div class="imm-add-field imm-add-field--full">
          <label>Título *</label>
          <input id="aTitle" class="imm-modal-input" placeholder="Ej: Breaking Bad — S01E01">
        </div>
        <div class="imm-add-row2">
          <div class="imm-add-field">
            <label>Idioma del contenido *</label>
            <select id="aLangSelect" class="imm-modal-input">
              <option value="">— Seleccioná —</option>
              <option value="en|Inglés|🇺🇸">🇺🇸 Inglés</option>
              <option value="en|Inglés|🇬🇧">🇬🇧 Inglés (UK)</option>
              <option value="es|Español|🇪🇸">🇪🇸 Español</option>
              <option value="es|Español|🇲🇽">🇲🇽 Español (MX)</option>
              <option value="es|Español|🇦🇷">🇦🇷 Español (AR)</option>
              <option value="pt|Portugués|🇧🇷">🇧🇷 Portugués</option>
              <option value="fr|Francés|🇫🇷">🇫🇷 Francés</option>
              <option value="de|Alemán|🇩🇪">🇩🇪 Alemán</option>
              <option value="it|Italiano|🇮🇹">🇮🇹 Italiano</option>
              <option value="ja|Japonés|🇯🇵">🇯🇵 Japonés</option>
              <option value="ko|Coreano|🇰🇷">🇰🇷 Coreano</option>
              <option value="zh|Chino|🇨🇳">🇨🇳 Chino</option>
              <option value="ru|Ruso|🇷🇺">🇷🇺 Ruso</option>
              <option value="ar|Árabe|🇸🇦">🇸🇦 Árabe</option>
              <option value="hi|Hindi|🇮🇳">🇮🇳 Hindi</option>
              <option value="tr|Turco|🇹🇷">🇹🇷 Turco</option>
              <option value="nl|Neerlandés|🇳🇱">🇳🇱 Neerlandés</option>
              <option value="pl|Polaco|🇵🇱">🇵🇱 Polaco</option>
              <option value="other|Otro|🌍">🌍 Otro</option>
            </select>
            <!-- Hidden inputs que se llenan automáticamente -->
            <input type="hidden" id="aLangCode">
            <input type="hidden" id="aLangName">
            <input type="hidden" id="aFlag">
          </div>
          <div class="imm-add-field">
            <label>Categoría</label>
            <select id="aCat" class="imm-modal-input">
              <option>serie</option><option>película</option><option>anime</option>
              <option>documental</option><option>podcast</option><option>entrevista</option><option>otro</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Imagen de portada -->
      <div class="imm-add-section">
        <div class="imm-add-section-title">🖼️ Imagen de portada</div>
        <label class="imm-file-btn" for="aImageFile">Elegir imagen</label>
        <input type="file" id="aImageFile" accept="image/*" class="imm-file-hidden">
        <span class="imm-file-name" id="aImageName">Sin imagen</span>
        <div class="imm-img-preview hidden" id="aImgPreview">
          <div class="imm-img-drag-hint">↕↔ Arrastrá para encuadrar</div>
          <div class="imm-img-crosshair" id="aImgCrosshair"></div>
        </div>
      </div>

      <!-- Video -->
      <div class="imm-add-section">
        <div class="imm-add-section-title">🎬 Video</div>
        <div class="imm-radio-group">
          <label class="imm-radio-opt"><input type="radio" name="vSrc" value="none" checked> Sin video</label>
          <label class="imm-radio-opt"><input type="radio" name="vSrc" value="file"> Archivo local</label>
          <label class="imm-radio-opt"><input type="radio" name="vSrc" value="yt">   YouTube URL</label>
        </div>
        <div id="vFileWrap" class="imm-radio-content hidden">
          <label class="imm-file-btn" for="aVideoFile">Elegir video</label>
          <input type="file" id="aVideoFile" accept="video/*" class="imm-file-hidden">
          <span class="imm-file-name" id="aVideoName">Sin archivo</span>
          <p class="imm-file-note">⚠️ Los videos locales solo duran esta sesión. Para persistir, usá YouTube.</p>
        </div>
        <div id="vYTWrap" class="imm-radio-content hidden">
          <input id="aYT" class="imm-modal-input" placeholder="https://youtube.com/watch?v=...">
        </div>
      </div>

      <!-- Audio: se oculta si hay video local -->
      <div class="imm-add-section" id="aAudioSection">
        <div class="imm-add-section-title" id="aAudioTitle">🔊 Audio</div>
        <div class="imm-radio-group">
          <label class="imm-radio-opt"><input type="radio" name="aSrc" value="none" checked> Sin audio</label>
          <label class="imm-radio-opt"><input type="radio" name="aSrc" value="file"> Archivo local</label>
          <label class="imm-radio-opt"><input type="radio" name="aSrc" value="url">  URL externa</label>
        </div>
        <div id="aFileWrap" class="imm-radio-content hidden">
          <label class="imm-file-btn" for="aAudioFile">Elegir audio</label>
          <input type="file" id="aAudioFile" accept="audio/*" class="imm-file-hidden">
          <span class="imm-file-name" id="aAudioName">Sin archivo</span>
        </div>
        <div id="aUrlWrap" class="imm-radio-content hidden">
          <input id="aAudioUrl" class="imm-modal-input" placeholder="/audio/archivo.mp3 o URL externa">
        </div>
      </div>

      <!-- Subtítulos -->
      <div class="imm-add-section">
        <div class="imm-add-section-title">📝 Subtítulos *</div>
        <div class="imm-radio-group">
          <label class="imm-radio-opt"><input type="radio" name="sSrc" value="srt" checked> Archivo .SRT / .TXT</label>
          <label class="imm-radio-opt"><input type="radio" name="sSrc" value="manual"> Manual</label>
        </div>

        <!-- SRT -->
        <div id="sSRTWrap">
          <label class="imm-file-btn" for="aSRTFile">Elegir .srt / .txt</label>
          <input type="file" id="aSRTFile" accept=".srt,.txt,text/*" class="imm-file-hidden">
          <span class="imm-file-name" id="aSRTName">Sin archivo</span>
          <div class="imm-srt-preview hidden" id="aSRTPreview"></div>
        </div>

        <!-- Manual -->
        <div id="sManualWrap" class="hidden">
          <div id="aRows"></div>
          <button class="imm-add-row-btn" id="aAddRow">＋ Línea</button>
        </div>
      </div>

      <div class="ob-error hidden" id="aErr"></div>

      <div class="imm-modal-btns">
        <button class="secondary-btn" id="aCancelBtn">Cancelar</button>
        <button class="primary-btn"   id="aSaveBtn">Guardar contenido</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Imagen con drag-to-reposition ──
  const imgInput  = overlay.querySelector('#aImageFile');
  const imgPreviewEl = overlay.querySelector('#aImgPreview');
  const crosshair = overlay.querySelector('#aImgCrosshair');

  // ── Idioma select → auto-fill hidden inputs ──
  const langSel = overlay.querySelector('#aLangSelect');
  const _syncLangHiddens = () => {
    const parts = (langSel.value || '').split('|');
    overlay.querySelector('#aLangCode').value = parts[0] || '';
    overlay.querySelector('#aLangName').value = parts[1] || '';
    overlay.querySelector('#aFlag').value     = parts[2] || '🌐';
  };
  langSel.addEventListener('change', _syncLangHiddens);

  // Pre-llenar todos los campos en modo edición
  if (editItem) {
    overlay.querySelector('#aTitle').value = editItem.title || '';
    // Restaurar el select de idioma buscando la opción que coincide
    if (editItem.language) {
      const matchOpt = Array.from(langSel.options).find(o => o.value.startsWith(editItem.language + '|'));
      if (matchOpt) langSel.value = matchOpt.value;
    }
    _syncLangHiddens();
    // Categoría
    const catSel = overlay.querySelector('#aCat');
    if (catSel) catSel.value = editItem.category || 'otro';
    // YouTube
    if (editItem.youtubeId) {
      const ytR = overlay.querySelector('input[name="vSrc"][value="yt"]');
      if (ytR) { ytR.checked = true; ytR.dispatchEvent(new Event('change')); }
      const ytInput = overlay.querySelector('#aYT');
      if (ytInput) ytInput.value = `https://www.youtube.com/watch?v=${editItem.youtubeId}`;
    }
    // Audio URL
    if (editItem.audioSrc && !editItem.videoSrc) {
      const aUrlR = overlay.querySelector('input[name="aSrc"][value="url"]');
      if (aUrlR) { aUrlR.checked = true; aUrlR.dispatchEvent(new Event('change')); }
      const aUrlInput = overlay.querySelector('#aAudioUrl');
      if (aUrlInput) aUrlInput.value = editItem.audioSrc;
    }
    // Subtítulos existentes
    if (editItem.dialogue?.length) {
      parsedDialogue = editItem.dialogue;
      const srtName    = overlay.querySelector('#aSRTName');
      const srtPreview = overlay.querySelector('#aSRTPreview');
      if (srtName) srtName.textContent = `${editItem.dialogue.length} subtítulos cargados`;
      if (srtPreview) {
        srtPreview.classList.remove('hidden');
        srtPreview.innerHTML = `<div class="imm-srt-ok">✅ ${editItem.dialogue.length} subtítulos existentes (se mantendrán si no subís otro archivo)</div>`;
      }
    }
  }

  // Si estamos editando, mostrar la imagen existente
  if (editItem?.imageSrc) {
    imagePosition = { x: editItem.imagePosX ?? 50, y: editItem.imagePosY ?? 50 };
    imgPreviewEl.style.backgroundImage    = `url('${editItem.imageSrc}')`;
    imgPreviewEl.style.backgroundPosition = `${imagePosition.x}% ${imagePosition.y}%`;
    if (crosshair) {
      crosshair.style.left = imagePosition.x + '%';
      crosshair.style.top  = imagePosition.y + '%';
    }
    imgPreviewEl.classList.remove('hidden');
    overlay.querySelector('#aImageName').textContent = '(imagen actual)';
  }

  imgInput.addEventListener('change', () => {
    const f = imgInput.files[0]; if (!f) return;
    overlay.querySelector('#aImageName').textContent = f.name;
    const reader = new FileReader();
    reader.onload = ev => {
      imagePosition = { x: 50, y: 50 };
      imgPreviewEl.style.backgroundImage    = `url('${ev.target.result}')`;
      imgPreviewEl.style.backgroundPosition = '50% 50%';
      if (crosshair) { crosshair.style.left = '50%'; crosshair.style.top = '50%'; }
      imgPreviewEl.classList.remove('hidden');
    };
    reader.readAsDataURL(f);
  });

  // Drag para encuadrar
  let draggingImg = false;
  imgPreviewEl.addEventListener('mousedown',  () => { draggingImg = true; imgPreviewEl.style.cursor = 'grabbing'; });
  imgPreviewEl.addEventListener('touchstart', () => { draggingImg = true; }, { passive: true });

  const moveImg = (clientX, clientY) => {
    if (!draggingImg) return;
    const rect = imgPreviewEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left)  / rect.width)  * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top)   / rect.height) * 100));
    imagePosition = { x, y };
    imgPreviewEl.style.backgroundPosition = `${x}% ${y}%`;
    if (crosshair) { crosshair.style.left = x + '%'; crosshair.style.top = y + '%'; }
  };

  document.addEventListener('mousemove', e  => moveImg(e.clientX, e.clientY));
  document.addEventListener('touchmove',  e => moveImg(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener('mouseup',   () => { draggingImg = false; imgPreviewEl.style.cursor = 'grab'; });
  document.addEventListener('touchend',  () => { draggingImg = false; });

  // ── Video radios ──
  overlay.querySelectorAll('input[name="vSrc"]').forEach(r => {
    r.addEventListener('change', () => {
      overlay.querySelector('#vFileWrap').classList.toggle('hidden', r.value !== 'file');
      overlay.querySelector('#vYTWrap').classList.toggle('hidden',   r.value !== 'yt');

      // Audio: oculto con video local (el video ya ES el media)
      // Con YouTube se muestra para poder sincronizar subtítulos
      const audioSection = overlay.querySelector('#aAudioSection');
      const audioTitle   = overlay.querySelector('#aAudioTitle');
      if (r.value === 'file') {
        audioSection.classList.add('hidden');
        const noneR = overlay.querySelector('input[name="aSrc"][value="none"]');
        if (noneR) { noneR.checked = true; noneR.dispatchEvent(new Event('change')); }
      } else {
        audioSection.classList.remove('hidden');
        audioTitle.textContent = r.value === 'yt'
          ? '🔊 Audio (para sync de subtítulos con YouTube)'
          : '🔊 Audio';
      }
    });
  });
  overlay.querySelector('#aVideoFile').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    overlay.querySelector('#aVideoName').textContent = f.name;
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    videoObjectUrl = URL.createObjectURL(f);
  });

  // ── Audio radios ──
  overlay.querySelectorAll('input[name="aSrc"]').forEach(r => {
    r.addEventListener('change', () => {
      overlay.querySelector('#aFileWrap').classList.toggle('hidden', r.value !== 'file');
      overlay.querySelector('#aUrlWrap').classList.toggle('hidden',  r.value !== 'url');
    });
  });
  overlay.querySelector('#aAudioFile').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    overlay.querySelector('#aAudioName').textContent = f.name;
    if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    audioObjectUrl = URL.createObjectURL(f);
  });

  // ── Subtítulos radios ──
  overlay.querySelectorAll('input[name="sSrc"]').forEach(r => {
    r.addEventListener('change', () => {
      overlay.querySelector('#sSRTWrap').classList.toggle('hidden',    r.value !== 'srt');
      overlay.querySelector('#sManualWrap').classList.toggle('hidden', r.value !== 'manual');
      if (r.value === 'manual') renderManualRows();
    });
  });

  // ── SRT file ──
  overlay.querySelector('#aSRTFile').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    overlay.querySelector('#aSRTName').textContent = f.name;
    const reader = new FileReader();
    reader.onload = ev => {
      parsedDialogue = _parseSRT(ev.target.result);
      const preview = overlay.querySelector('#aSRTPreview');
      preview.classList.remove('hidden');
      if (parsedDialogue.length) {
        const samples = parsedDialogue.slice(0, 3).map(d =>
          `<div class="imm-srt-row">
            <span class="imm-srt-t">${_immFmt(d.start)}</span>
            <span>${_esc(d.original)}</span>
          </div>`
        ).join('');
        preview.innerHTML = `
          <div class="imm-srt-ok">✅ ${parsedDialogue.length} subtítulos importados</div>
          ${samples}
          ${parsedDialogue.length > 3
            ? `<div class="imm-srt-more">...y ${parsedDialogue.length - 3} más</div>` : ''}
          <button class="imm-translate-srt-btn" id="immTranslateSrtBtn">
            ✨ Traducir subtítulos al español con IA
          </button>
          <div class="imm-srt-progress hidden" id="immSrtProgress">
            <div class="imm-srt-progress-bar"><div class="imm-srt-progress-fill" id="immSrtFill"></div></div>
            <span id="immSrtProgressLabel">0 / ${parsedDialogue.length}</span>
          </div>
        `;
        overlay.querySelector('#immTranslateSrtBtn').addEventListener('click', () => {
          const src = (overlay.querySelector('#aLangCode')?.value || 'en').trim();
          _translateSrtBatch(parsedDialogue, overlay, src);
        });
      } else {
        preview.innerHTML = `<div class="imm-srt-err">⚠️ No se detectaron subtítulos. Verificá el formato .srt</div>`;
      }
    };
    reader.readAsText(f, 'UTF-8');
  });

  // ── Rows manuales ──
  let manualRows = [{ start: '', end: '', original: '', translation: '' }];

  function renderManualRows() {
    const wrap = overlay.querySelector('#aRows'); if (!wrap) return;
    wrap.innerHTML = manualRows.map((r, i) => `
      <div class="imm-row">
        <input class="imm-modal-input imm-t-in" type="number" placeholder="Inicio s"
               value="${r.start}" step="0.1" min="0" data-i="${i}" data-f="start">
        <input class="imm-modal-input imm-t-in" type="number" placeholder="Fin s"
               value="${r.end}"   step="0.1" min="0" data-i="${i}" data-f="end">
        <input class="imm-modal-input imm-txt-in" placeholder="Texto original"
               value="${r.original}"    data-i="${i}" data-f="original">
        <input class="imm-modal-input imm-txt-in" placeholder="Traducción"
               value="${r.translation}" data-i="${i}" data-f="translation">
        ${manualRows.length > 1
          ? `<button class="imm-row-del-btn" data-i="${i}">✕</button>` : ''}
      </div>
    `).join('');
    wrap.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => {
        const i = +inp.dataset.i, f = inp.dataset.f;
        manualRows[i][f] = (f === 'start' || f === 'end')
          ? parseFloat(inp.value) || '' : inp.value;
      });
    });
    wrap.querySelectorAll('.imm-row-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        manualRows.splice(+btn.dataset.i, 1); renderManualRows();
      });
    });
  }

  overlay.querySelector('#aAddRow')?.addEventListener('click', () => {
    manualRows.push({ start: '', end: '', original: '', translation: '' });
    renderManualRows();
  });

  // ── Cancelar ──
  overlay.querySelector('#aCancelBtn').addEventListener('click', () => {
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    overlay.remove();
  });

  // ── Guardar ──
  overlay.querySelector('#aSaveBtn').addEventListener('click', () => {
    _syncLangHiddens();
    const title    = (overlay.querySelector('#aTitle')?.value    || '').trim();
    const langCode = (overlay.querySelector('#aLangCode')?.value || '').trim();
    const flag     = (overlay.querySelector('#aFlag')?.value     || '🌐').trim() || '🌐';
    const err      = overlay.querySelector('#aErr');

    if (!title || !langCode) {
      err.textContent = 'El título y el idioma son obligatorios.';
      err.classList.remove('hidden'); return;
    }

    // Imagen (base64 del preview)
    const imgPreviewSave = overlay.querySelector('#aImgPreview');
    const bgImg          = imgPreviewSave?.style.backgroundImage || '';
    const imageSrc       = bgImg
      ? bgImg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')
      : (editItem?.imageSrc || null);

    // Video
    const vRadio = overlay.querySelector('input[name="vSrc"]:checked')?.value || 'none';
    let videoSrc = null, youtubeId = null;
    if (vRadio === 'file') videoSrc = videoObjectUrl;
    if (vRadio === 'yt') {
      const ytVal = overlay.querySelector('#aYT')?.value || '';
      const m     = ytVal.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      youtubeId   = m ? m[1] : null;
    }

    // Audio
    const aRadio = overlay.querySelector('input[name="aSrc"]:checked')?.value || 'none';
    let audioSrc = null;
    if (aRadio === 'file') audioSrc = audioObjectUrl;
    if (aRadio === 'url')  audioSrc = (overlay.querySelector('#aAudioUrl')?.value || '').trim() || null;

    // Subtítulos
    const sRadio   = overlay.querySelector('input[name="sSrc"]:checked')?.value || 'srt';
    const dialogue = sRadio === 'srt'
      ? parsedDialogue
      : manualRows
          .filter(r => r.original && r.start !== '' && r.end !== '')
          .map(r => ({ start: +r.start, end: +r.end, original: r.original, translation: r.translation || '' }));

    if (!dialogue.length) {
      err.textContent = 'Agregá al menos un subtítulo (importá un .srt o escribí uno manual).';
      err.classList.remove('hidden'); return;
    }

    const langName = (overlay.querySelector('#aLangName')?.value || '').trim();
    const savedItem = {
      id:           editItem?.id || `user_${Date.now()}`,
      country:      flag,
      countryName:  langName,
      language:     langCode,
      languageName: langName,
      title,
      subtitle:     overlay.querySelector('#aCat')?.value || '',
      category:     overlay.querySelector('#aCat')?.value || 'otro',
      thumbnail:    '🎬',
      imageSrc,
      imagePosX:    imagePosition.x,
      imagePosY:    imagePosition.y,
      youtubeId,
      videoSrc,
      audioSrc,
      dialogue,
      _user: true
    };

    let list = _getUserImmContent();
    if (editItem) {
      list = list.map(c => c.id === editItem.id ? savedItem : c);
    } else {
      list.push(savedItem);
    }
    localStorage.setItem(_USER_IMM_KEY, JSON.stringify(list));
    const noMedia = !videoSrc && !youtubeId && !audioSrc;
    overlay.remove();

    if (noMedia && !editItem) {
      // Mostrar aviso antes de volver al browser
      const toast = document.createElement('div');
      toast.className = 'imm-no-media-toast';
      toast.innerHTML = `
        <span class="imm-no-media-icon">ℹ️</span>
        <div>
          <strong>Contenido guardado sin audio ni video.</strong><br>
          Podés editarlo después para agregar un archivo de audio, video o URL de YouTube.
        </div>
        <button class="imm-no-media-close" id="immNoMediaClose">✕</button>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('imm-no-media-toast--visible'), 50);
      document.getElementById('immNoMediaClose').addEventListener('click', () => toast.remove());
      setTimeout(() => toast.remove(), 7000);
    }

    _renderBrowser(container);
  });
}

// ─────────────────────────────────────────────
// DATA HELPERS
// ─────────────────────────────────────────────

function _getUserImmContent() {
  try { return JSON.parse(localStorage.getItem(_USER_IMM_KEY) || '[]'); }
  catch { return []; }
}

function _getPinnedImmContent() {
  try { return JSON.parse(localStorage.getItem(_PINNED_IMM_KEY) || '[]'); }
  catch { return []; }
}

function _getAllImmContent() {
  const curated = typeof CURATED_CONTENT !== 'undefined' ? CURATED_CONTENT : [];
  const pinned  = _getPinnedImmContent().map(c => ({ ...c, _pinned: true }));
  const user    = _getUserImmContent().map(c => ({ ...c, _user: true }));
  // Pinned aparece antes que user, después de curated oficial
  return [...curated, ...pinned, ...user];
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

function _immFmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
}

function _esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _immCleanup() {
  if (_immMedia) { _immMedia.pause(); _immMedia.src = ''; _immMedia = null; }
  _immContent = null;
  _immLineIdx = -1;
  document.querySelector('.imm-word-popup')?.remove();
}
