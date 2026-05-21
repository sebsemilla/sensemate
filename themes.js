// themes.js — Sistema de Themes para SenseMate
// ================================================

const _THEME_KEY        = 'ls_theme';
const _CUSTOM_THEME_KEY = 'ls_custom_theme';

const THEMES = {
  forest: {
    name: '🌿 Forest',
    desc: 'Natural y cálido',
    ph: 'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)',
    pb: '#f1f8f4',
    pc: '#b7e4c7',
    pc2: '#74c69d',
    light: {
      '--primary':      '#2d9e6b',
      '--primary-dark': '#1b7a50',
      '--header-bg':    '#2d6a4f',
      '--header-grad':  'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)',
      '--header-text':  '#d8f3dc',
      '--body-bg':      '#f1f8f4',
      '--card-bg':      '#d8f3dc',
      '--surface':      '#ffffff',
      '--text':         '#1b4332',
      '--text-muted':   '#40916c',
      '--border':       '#b7e4c7',
      '--radius-card':  '20px',
      '--radius-btn':   '40px',
      '--font-body':    'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
    },
    dark: {
      '--header-bg':    '#1b4332',
      '--header-grad':  'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
      '--header-text':  '#b7e4c7',
      '--body-bg':      '#081c15',
      '--card-bg':      '#1b4332',
      '--surface':      '#2d6a4f',
      '--text':         '#d8f3dc',
      '--text-muted':   '#74c69d',
      '--border':       '#2d6a4f',
    },
  },

  ocean: {
    name: '🌲 Bosque Esquel',
    desc: 'Profesional y limpio',
    defaultBg: '/images/panorama.jpg',
    ph: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    pb: '#f0f9ff',
    pc: '#bae6fd',
    pc2: '#7dd3fc',
    light: {
      '--primary':      '#0284c7',
      '--primary-dark': '#0369a1',
      '--header-bg':    '#0369a1',
      '--header-grad':  'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      '--header-text':  '#e0f2fe',
      '--body-bg':      '#f0f9ff',
      '--card-bg':      '#e0f2fe',
      '--surface':      '#ffffff',
      '--text':         '#0c4a6e',
      '--text-muted':   '#0369a1',
      '--border':       '#bae6fd',
      '--radius-card':  '14px',
      '--radius-btn':   '10px',
      '--font-body':    '"Helvetica Neue",Arial,sans-serif',
    },
    dark: {
      '--header-bg':    '#082f49',
      '--header-grad':  'linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)',
      '--header-text':  '#bae6fd',
      '--body-bg':      '#040f1c',
      '--card-bg':      '#0c4a6e',
      '--surface':      '#0d3251',
      '--text':         '#e0f2fe',
      '--text-muted':   '#7dd3fc',
      '--border':       '#0369a1',
    },
  },

  sunset: {
    name: '🌃 Noche Urbana',
    desc: 'Cálido · degradé dorado',
    ph: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 40%, #ffcd3c 100%)',
    pb: 'linear-gradient(160deg, #fff3e0 0%, #fce4ec 100%)',
    pc: '#ffccbc',
    pc2: '#f48fb1',
    bodyGrad: 'linear-gradient(160deg, #fff8f0 0%, #fff0f6 50%, #fff3e0 100%)',
    defaultBg: '/images/urbano.jpg',
    light: {
      '--primary':      '#e8521e',
      '--primary-dark': '#bf360c',
      '--header-bg':    '#d94f0e',
      '--header-grad':  'linear-gradient(135deg, #c94200 0%, #e8521e 30%, #f7931e 65%, #ffcd3c 100%)',
      '--header-text':  '#fff8f0',
      '--body-bg':      '#fff8f0',
      '--card-bg':      '#ffddb5',
      '--surface':      '#fffaf5',
      '--text':         '#3e1a00',
      '--text-muted':   '#9c4000',
      '--border':       '#ffb890',
      '--radius-card':  '28px',
      '--radius-btn':   '50px',
      '--font-body':    '"Trebuchet MS",system-ui,sans-serif',
    },
    dark: {
      '--header-bg':    '#1c0f00',
      '--header-grad':  'linear-gradient(135deg, #1c0f00 0%, #2e1a00 50%, #3d2800 100%)',
      '--header-text':  '#ffcc80',
      '--body-bg':      '#100900',
      '--card-bg':      '#1e1308',
      '--surface':      '#2a1c0a',
      '--text':         '#fff3e0',
      '--text-muted':   '#ffab76',
      '--border':       '#3a2510',
    },
  },

  eclipse: {
    name: '🌙 Eclipse',
    desc: 'Cyberpunk · neón violeta',
    ph: 'linear-gradient(135deg, #0a0015 0%, #2d0060 50%, #1a0035 100%)',
    pb: '#07000f',
    pc: '#1f004d',
    pc2: '#5b00cc',
    alwaysDark: true,
    light: {
      '--primary':      '#bf5aff',
      '--primary-dark': '#9b00ff',
      '--header-bg':    '#0a0015',
      '--header-grad':  'linear-gradient(135deg, #0a0015 0%, #2d0060 60%, #1a0035 100%)',
      '--header-text':  '#e8b4ff',
      '--body-bg':      '#07000f',
      '--card-bg':      '#130025',
      '--surface':      '#1a0035',
      '--text':         '#f3e6ff',
      '--text-muted':   '#bf5aff',
      '--border':       '#3d0080',
      '--radius-card':  '12px',
      '--radius-btn':   '12px',
      '--font-body':    '"Segoe UI",system-ui,sans-serif',
    },
    dark: {},
  },
};

const FONTS = [
  { label: '🔤 Sistema (default)',    value: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif' },
  { label: '✏️ Helvetica (sharp)',    value: '"Helvetica Neue",Arial,sans-serif' },
  { label: '🎨 Trebuchet (creative)', value: '"Trebuchet MS",system-ui,sans-serif' },
  { label: '📖 Georgia (elegante)',   value: 'Georgia,"Times New Roman",serif' },
  { label: '💻 Monospace (técnico)',  value: '"Courier New",Courier,monospace' },
];

const _COLOR_PRESETS = [
  { label: 'Índigo',    value: '#6366f1' },
  { label: 'Violeta',   value: '#8b5cf6' },
  { label: 'Rosa',      value: '#ec4899' },
  { label: 'Rojo',      value: '#ef4444' },
  { label: 'Naranja',   value: '#f97316' },
  { label: 'Ámbar',     value: '#f59e0b' },
  { label: 'Verde',     value: '#22c55e' },
  { label: 'Esmeralda', value: '#10b981' },
  { label: 'Cyan',      value: '#06b6d4' },
  { label: 'Azul',      value: '#3b82f6' },
  { label: 'Slate',     value: '#64748b' },
  { label: 'Negro',     value: '#1e293b' },
];

const _ALL_VARS = [
  '--primary','--primary-dark','--header-bg','--header-grad','--header-text',
  '--body-bg','--card-bg','--surface','--text','--text-muted','--border',
  '--radius-card','--radius-btn','--font-body',
];

// ─── Aplicar theme ───────────────────────────────────────────

function applyTheme(themeId, customVars) {
  const root = document.documentElement;

  // Fix: when switching FROM an alwaysDark theme (e.g. Eclipse) to a normal theme,
  // remove the forced dark-mode so the new theme renders in light mode correctly.
  if (THEMES[themeId] && !THEMES[themeId].alwaysDark) {
    const prevId = localStorage.getItem(_THEME_KEY);
    if (prevId && THEMES[prevId]?.alwaysDark) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
      setTimeout(() => _syncDarkToggle(false), 50);
    }
  }

  const isDark = document.body.classList.contains('dark-mode');
  _ALL_VARS.forEach(k => root.style.removeProperty(k));

  if (themeId === 'custom' && customVars) {
    root.style.setProperty('--primary',      customVars.primary);
    root.style.setProperty('--primary-dark', _shade(customVars.primary, -28));
    root.style.setProperty('--header-bg',    customVars.primary);
    root.style.setProperty('--header-grad',  `linear-gradient(135deg, ${customVars.primary} 0%, ${_shade(customVars.primary, -40)} 100%)`);
    root.style.setProperty('--header-text',  _isLight(customVars.primary) ? '#1e293b' : '#ffffff');
    root.style.setProperty('--body-bg',      isDark ? '#0d0d14' : _rgba(customVars.primary, .04));
    root.style.setProperty('--card-bg',      isDark ? '#1a1626' : _rgba(customVars.primary, .10));
    root.style.setProperty('--surface',      isDark ? '#201c30' : '#ffffff');
    root.style.setProperty('--text',         isDark ? '#f1f5f9' : '#1e293b');
    root.style.setProperty('--text-muted',   isDark ? '#94a3b8' : '#475569');
    root.style.setProperty('--border',       isDark ? _rgba(customVars.primary, .25) : _rgba(customVars.primary, .22));
    root.style.setProperty('--radius-card',  `${customVars.radius}px`);
    root.style.setProperty('--radius-btn',   `${Math.min(customVars.radius * 2, 50)}px`);
    root.style.setProperty('--font-body',    customVars.font);

  } else if (THEMES[themeId]) {
    const t = THEMES[themeId];
    if (t.alwaysDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
      setTimeout(() => _syncDarkToggle(true), 50);
    }
    const vars = { ...t.light, ...(isDark || t.alwaysDark ? t.dark : {}) };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    // Apply body background — priority: user override → defaultBg → bodyGrad → CSS var
    const bgTypeRaw = localStorage.getItem(`bgType_${themeId}_type`); // null = never set
    const bgType    = bgTypeRaw || 'theme';
    const bgValue   = localStorage.getItem(`bgType_${themeId}_value`) || '';

    if (bgType === 'image' && bgValue) {
      document.body.style.background           = `url('${bgValue}') center/cover no-repeat fixed`;
      document.body.style.backgroundAttachment = 'fixed';
    } else if (bgType === 'color' && bgValue) {
      document.body.style.background           = bgValue;
      document.body.style.backgroundImage      = 'none';
    } else if (bgTypeRaw === null && t.defaultBg) {
      // No user override ever saved → use theme's built-in default image
      document.body.style.background           = `url('${t.defaultBg}') center/cover no-repeat fixed`;
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      // Explicitly set to 'theme' or no defaultBg
      if (t.bodyGrad && !isDark) {
        document.body.style.background           = t.bodyGrad;
        document.body.style.backgroundAttachment = 'fixed';
      } else {
        document.body.style.background      = vars['--body-bg'] || '';
        document.body.style.backgroundImage = 'none';
      }
    }
  }
  localStorage.setItem(_THEME_KEY, themeId);
  document.body.dataset.theme = themeId;

  // Allow app.js to re-apply opacity overrides after theme vars are set
  if (typeof window.applyThemeOpacities === 'function') window.applyThemeOpacities(themeId);
}

window.onDarkModeChange = function () {
  const id = localStorage.getItem(_THEME_KEY) || 'forest';
  if (THEMES[id]?.alwaysDark) return;
  const custom = JSON.parse(localStorage.getItem(_CUSTOM_THEME_KEY) || 'null');
  applyTheme(id, custom);
  // Body bg is re-applied inside applyTheme above
};

function _syncDarkToggle(forceDark) {
  const isDark = forceDark ?? document.body.classList.contains('dark-mode');
  if (typeof gsap === 'undefined') return;
  if (isDark) {
    gsap.set('.toggle-button', { y: 20, scale: 0.6 });
    gsap.set('.moon-mask',     { y: 22, x: -6 });
    gsap.set('.toggle',        { backgroundColor: '#fff' });
    gsap.set('.circle',        { display: 'none' });
  } else {
    gsap.set('.toggle-button', { y: 1,  scale: 0.6 });
    gsap.set('.moon-mask',     { y: 0,  x: 0 });
    gsap.set('.toggle',        { backgroundColor: '#fdb813' });
    gsap.set('.circle',        { display: 'block' });
  }
}

function initTheme() {
  const id     = localStorage.getItem(_THEME_KEY) || 'forest';
  const custom = JSON.parse(localStorage.getItem(_CUSTOM_THEME_KEY) || 'null');
  applyTheme(id, custom);
}

// ─── Panel UI ────────────────────────────────────────────────

function showThemesPanel() {
  const curId      = localStorage.getItem(_THEME_KEY) || 'forest';
  const curCustom  = JSON.parse(localStorage.getItem(_CUSTOM_THEME_KEY) || 'null')
                     || { primary: '#6366f1', font: FONTS[0].value, radius: 20 };
  let pendingId     = curId;
  let pendingCustom = { ...curCustom };

  const overlay = document.createElement('div');
  overlay.id = 'themesPanel';
  overlay.className = 'tp-overlay';
  overlay.innerHTML = `
    <div class="tp-sheet">

      <div class="tp-header">
        <div class="tp-header-left">
          <span class="tp-header-icon">🎨</span>
          <div>
            <h2 class="tp-title">Apariencia</h2>
            <p class="tp-subtitle">Personalizá el look de la app</p>
          </div>
        </div>
        <button class="tp-close" id="tpClose" aria-label="Cerrar">✕</button>
      </div>

      <div class="tp-body">

        <!-- Temas prediseñados -->
        <p class="tp-section-label">Temas prediseñados</p>
        <div class="tp-grid">
          ${Object.entries(THEMES).map(([id, t]) => _themeCardHTML(id, t, curId === id)).join('')}
        </div>

        <!-- Separador -->
        <div class="tp-divider"></div>

        <!-- Tema personalizado -->
        <p class="tp-section-label">✏️ Tema personalizado</p>
        <div class="tp-custom ${curId === 'custom' ? 'active' : ''}" id="tpCustom">

          <!-- Presets de color rápido -->
          <div class="tp-cfield">
            <label>Color primario</label>
            <div class="tp-presets-row" id="tpPresetsRow">
              ${_COLOR_PRESETS.map(p => `
                <button class="tp-preset-dot ${curCustom.primary === p.value ? 'selected' : ''}"
                  style="background:${p.value}" data-color="${p.value}" title="${p.label}">
                </button>`).join('')}
            </div>
            <div class="tp-color-row">
              <input type="color" id="tpColor" value="${curCustom.primary}">
              <div class="tp-swatch" id="tpSwatch" style="background:${curCustom.primary}"></div>
              <span id="tpHex" class="tp-hex">${curCustom.primary}</span>
              <span class="tp-hex-label">Hex personalizado</span>
            </div>
          </div>

          <!-- Vista previa en tiempo real -->
          <div class="tp-cfield">
            <label>Vista previa</label>
            <div class="tp-live-preview" id="tpLivePreview">
              ${_livePreviewHTML(curCustom.primary, curCustom.radius)}
            </div>
          </div>

          <!-- Tipografía -->
          <div class="tp-cfield">
            <label>Tipografía</label>
            <select id="tpFont">
              ${FONTS.map(f => `<option value="${f.value}" ${curCustom.font === f.value ? 'selected' : ''}>${f.label}</option>`).join('')}
            </select>
            <div class="tp-font-preview" id="tpFontPreview" style="font-family:${curCustom.font}">
              The quick brown fox — El zorro veloz
            </div>
          </div>

          <!-- Radio de bordes -->
          <div class="tp-cfield">
            <div class="tp-radius-header">
              <label>Radio de bordes</label>
              <strong id="tpRadLbl">${curCustom.radius}px</strong>
            </div>
            <input type="range" class="tp-range" id="tpRadius" min="0" max="40" value="${curCustom.radius}">
            <div class="tp-radius-hints">
              <span>Cuadrado</span><span>Redondeado</span><span>Circular</span>
            </div>
          </div>

          <!-- Fondo -->
          <div class="tp-cfield">
            <label>Imagen de fondo</label>
            <button class="tp-bg-btn" id="tpBgBtn">🖼️ Cambiar imagen de fondo →</button>
          </div>

          <button class="tp-act-custom ${curId === 'custom' ? 'on' : ''}" id="tpActCustom">
            ${curId === 'custom' ? '✓ Tema personalizado activo' : 'Usar este tema →'}
          </button>
        </div>

      </div><!-- /tp-body -->

      <div class="tp-footer">
        <button class="tp-btn-cancel" id="tpCancel">Cancelar</button>
        <button class="tp-btn-apply"  id="tpApply">Aplicar</button>
      </div>

    </div><!-- /tp-sheet -->
  `;
  document.body.appendChild(overlay);

  // ── Helpers de referencias ──────────────────────────────

  const close = () => {
    overlay.classList.add('tp-fade-out');
    setTimeout(() => overlay.remove(), 280);
  };

  const updateLivePreview = () => {
    const el = document.getElementById('tpLivePreview');
    if (el) el.innerHTML = _livePreviewHTML(pendingCustom.primary, pendingCustom.radius);
  };

  // ── Cierre ──────────────────────────────────────────────

  document.getElementById('tpClose').addEventListener('click', close);
  document.getElementById('tpCancel').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  // ── Seleccionar preset de tema ───────────────────────────

  overlay.querySelectorAll('.tp-card').forEach(card => {
    card.addEventListener('click', () => {
      pendingId = card.dataset.id;
      overlay.querySelectorAll('.tp-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('tpCustom').classList.remove('active');
      const btn = document.getElementById('tpActCustom');
      btn.classList.remove('on');
      btn.textContent = 'Usar este tema →';
    });
  });

  // ── Presets de color ─────────────────────────────────────

  document.getElementById('tpPresetsRow').addEventListener('click', e => {
    const dot = e.target.closest('.tp-preset-dot');
    if (!dot) return;
    const color = dot.dataset.color;
    pendingCustom.primary = color;
    document.getElementById('tpColor').value   = color;
    document.getElementById('tpSwatch').style.background = color;
    document.getElementById('tpHex').textContent = color;
    document.querySelectorAll('.tp-preset-dot').forEach(d => d.classList.remove('selected'));
    dot.classList.add('selected');
    updateLivePreview();
  });

  // ── Color picker libre ───────────────────────────────────

  document.getElementById('tpColor').addEventListener('input', e => {
    const color = e.target.value;
    pendingCustom.primary = color;
    document.getElementById('tpSwatch').style.background = color;
    document.getElementById('tpHex').textContent = color;
    document.querySelectorAll('.tp-preset-dot').forEach(d => d.classList.remove('selected'));
    updateLivePreview();
  });

  // ── Tipografía ───────────────────────────────────────────

  document.getElementById('tpFont').addEventListener('change', e => {
    pendingCustom.font = e.target.value;
    const fp = document.getElementById('tpFontPreview');
    if (fp) fp.style.fontFamily = e.target.value;
  });

  // ── Radio de bordes ──────────────────────────────────────

  document.getElementById('tpRadius').addEventListener('input', e => {
    pendingCustom.radius = parseInt(e.target.value);
    document.getElementById('tpRadLbl').textContent = `${pendingCustom.radius}px`;
    updateLivePreview();
  });

  // ── Fondo ────────────────────────────────────────────────

  document.getElementById('tpBgBtn').addEventListener('click', () => {
    close();
    setTimeout(() => document.getElementById('bgSelectorTrigger')?.click(), 300);
  });

  // ── Activar tema personalizado ───────────────────────────

  document.getElementById('tpActCustom').addEventListener('click', () => {
    pendingId = 'custom';
    overlay.querySelectorAll('.tp-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('tpCustom').classList.add('active');
    const btn = document.getElementById('tpActCustom');
    btn.classList.add('on');
    btn.textContent = '✓ Tema personalizado activo';
  });

  // ── Aplicar ──────────────────────────────────────────────

  document.getElementById('tpApply').addEventListener('click', () => {
    if (pendingId === 'custom') {
      localStorage.setItem(_CUSTOM_THEME_KEY, JSON.stringify(pendingCustom));
      applyTheme('custom', pendingCustom);
    } else {
      applyTheme(pendingId);
    }
    close();
  });
}

// ─── Generadores de HTML ─────────────────────────────────────

function _themeCardHTML(id, t, isSelected) {
  return `
    <div class="tp-card ${isSelected ? 'selected' : ''}" data-id="${id}">
      <div class="tp-preview">
        <div class="tp-prev-hd" style="background:${t.ph}">
          <div class="tp-prev-hd-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="tp-prev-hd-bar"></div>
        </div>
        <div class="tp-prev-bd" style="background:${t.pb}">
          <div class="tp-prev-cards">
            <div class="tp-prev-c tp-prev-c--wide" style="background:${t.pc}"></div>
            <div class="tp-prev-c-row">
              <div class="tp-prev-c" style="background:${t.pc}"></div>
              <div class="tp-prev-c" style="background:${t.pc2 || t.pc}"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tp-card-footer">
        <div>
          <div class="tp-card-name">${t.name}</div>
          <div class="tp-card-desc">${t.desc}</div>
        </div>
        ${t.alwaysDark ? '<span class="tp-always-dark-badge">🌙 Siempre oscuro</span>' : ''}
      </div>
      <div class="tp-check">✓</div>
    </div>
  `;
}

function _livePreviewHTML(color, radius) {
  const bg     = _rgba(color, .07);
  const card   = _rgba(color, .13);
  const border = _rgba(color, .25);
  const r      = `${radius}px`;
  const rBtn   = `${Math.min(radius * 2, 50)}px`;
  const textClr = _isLight(color) ? '#1e293b' : color;
  return `
    <div class="tp-live-wrap" style="background:${bg};border-color:${border}">
      <div class="tp-live-header" style="background:${color}">
        <span style="color:${_isLight(color) ? '#1e293b' : '#fff'}; font-weight:700; font-size:.8rem">SenseMate</span>
        <div class="tp-live-hd-dots">
          <span style="background:rgba(255,255,255,.4)"></span>
          <span style="background:rgba(255,255,255,.4)"></span>
        </div>
      </div>
      <div class="tp-live-body">
        <div class="tp-live-card" style="background:${card};border-radius:${r}">
          <div class="tp-live-card-line" style="background:${_rgba(color,.5)};border-radius:4px"></div>
          <div class="tp-live-card-line tp-live-card-line--short" style="background:${_rgba(color,.3)};border-radius:4px"></div>
        </div>
        <div class="tp-live-card" style="background:${card};border-radius:${r}">
          <div class="tp-live-card-line" style="background:${_rgba(color,.5)};border-radius:4px"></div>
          <div class="tp-live-card-line tp-live-card-line--short" style="background:${_rgba(color,.3)};border-radius:4px"></div>
        </div>
      </div>
      <div class="tp-live-footer">
        <div class="tp-live-btn" style="background:${color};border-radius:${rBtn};color:${_isLight(color) ? '#1e293b' : '#fff'}">
          Traducir →
        </div>
      </div>
    </div>
  `;
}

// ─── Utilidades ──────────────────────────────────────────────

function _rgba(hex, a) {
  if (!hex || !hex.startsWith('#')) return `rgba(99,102,241,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function _shade(hex, n) {
  if (!hex || !hex.startsWith('#')) return hex;
  const num = parseInt(hex.replace('#', ''), 16);
  const r   = Math.min(255, Math.max(0, (num >> 16) + n));
  const g   = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + n));
  const b   = Math.min(255, Math.max(0, (num & 0xff) + n));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function _isLight(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceived luminance
  return (r * 0.299 + g * 0.587 + b * 0.114) > 170;
}

initTheme();
