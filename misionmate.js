// misionmate.js — Sistema de gamificación "MisiónMate"
// =====================================================

const _MM_KEY = 'ls_misionmate';

function _mmGet() {
  try { return JSON.parse(localStorage.getItem(_MM_KEY) || 'null'); }
  catch { return null; }
}
function _mmSave(data) {
  localStorage.setItem(_MM_KEY, JSON.stringify(data));
}

// ─── Definición de trofeos ────────────────────────────────────

const MM_TROPHIES = [

  // ── Actividad general ──────────────────────────────────────
  {
    id:    'translator',
    icon:  '🌱',
    name:  'Trofeo Buenas Raices',
    desc:  'Realizaste 50 traducciones',
    max:   50,
    stat:  'translations',
    group: 'general',
  },
  {
    id:    'collector',
    icon:  '⭐',
    name:  'Estudiante Estrella',
    desc:  'Guardaste 25 flashcards',
    max:   25,
    stat:  'flashcards',
    group: 'general',
  },
  {
    id:    'conversationalist',
    icon:  '🗣️',
    name:  'Trofeo Fluentist',
    desc:  'Enviaste 20 mensajes a personajes históricos',
    max:   20,
    stat:  'chatMessages',
    group: 'general',
  },

  // ── Constructor (A0 / A1 / A2) ─────────────────────────────
  {
    id:    'level_a0',
    icon:  '🧱',
    name:  'Trofeo Constructor — A0',
    desc:  'Completaste un grupo de práctica en nivel A0',
    max:   1,
    stat:  'level_a0',
    group: 'constructor',
  },
  {
    id:    'level_a1',
    icon:  '🔨',
    name:  'Trofeo Constructor — A1',
    desc:  'Completaste un grupo de práctica en nivel A1',
    max:   1,
    stat:  'level_a1',
    group: 'constructor',
  },
  {
    id:    'level_a2',
    icon:  '🏗️',
    name:  'Trofeo Constructor — A2',
    desc:  'Completaste un grupo de práctica en nivel A2',
    max:   1,
    stat:  'level_a2',
    group: 'constructor',
  },

  // ── Alquimista (B1 / B2) ───────────────────────────────────
  {
    id:    'level_b1',
    icon:  '🌸',
    name:  'Trofeo Alquimista — B1',
    desc:  'Completaste un grupo de práctica en nivel B1',
    max:   1,
    stat:  'level_b1',
    group: 'alquimista',
  },
  {
    id:    'level_b2',
    icon:  '🔮',
    name:  'Trofeo Alquimista — B2',
    desc:  'Completaste un grupo de práctica en nivel B2',
    max:   1,
    stat:  'level_b2',
    group: 'alquimista',
  },

  // ── Maestro (C1 / C2) ──────────────────────────────────────
  {
    id:    'level_c1',
    icon:  '🥈',
    name:  'Trofeo Maestro — C1',
    desc:  'Completaste un grupo de práctica en nivel C1',
    max:   1,
    stat:  'level_c1',
    group: 'maestro',
  },
  {
    id:    'level_c2',
    icon:  '🥇',
    name:  'Trofeo Maestro — C2',
    desc:  'Completaste un grupo de práctica en nivel C2',
    max:   1,
    stat:  'level_c2',
    group: 'maestro',
  },
];

const _MM_GROUPS = [
  { key: 'general',     label: '⚡ Actividad general' },
  { key: 'constructor', label: '🧱 Trofeo Constructor' },
  { key: 'alquimista',  label: '🌸 Trofeo Alquimista' },
  { key: 'maestro',     label: '🥇 Trofeo Maestro' },
];

// ─── Tracking público ─────────────────────────────────────────
// Llamado desde app.js / famous.js / school.js / practice.js

function misionTrack(event) {
  const mm = _mmGet();
  if (!mm?.active) return;

  const statMap = {
    translation:  'translations',
    flashcard:    'flashcards',
    chat:         'chatMessages',
    level_a0:     'level_a0',
    level_a1:     'level_a1',
    level_a2:     'level_a2',
    level_b1:     'level_b1',
    level_b2:     'level_b2',
    level_c1:     'level_c1',
    level_c2:     'level_c2',
  };
  const key = statMap[event];
  if (!key) return;

  mm.stats = mm.stats || {};
  mm.stats[key] = (mm.stats[key] || 0) + 1;
  _mmSave(mm);

  _checkTrophies(mm);
  _updateMMBtn();
}

// ─── Verificación de trofeos ──────────────────────────────────

function _checkTrophies(mm) {
  mm.trophies = mm.trophies || {};
  let changed = false;

  for (const t of MM_TROPHIES) {
    if (!mm.trophies[t.id] && (mm.stats?.[t.stat] || 0) >= t.max) {
      mm.trophies[t.id] = new Date().toISOString();
      changed = true;
      _showTrophyToast(t);
    }
  }
  if (changed) _mmSave(mm);
}

function _showTrophyToast(trophy) {
  document.querySelector('.mm-trophy-toast')?.remove();

  const el = document.createElement('div');
  el.className = 'mm-trophy-toast';
  el.innerHTML = `
    <div class="mm-trophy-toast-icon">${trophy.icon}</div>
    <div class="mm-trophy-toast-body">
      <div class="mm-trophy-toast-tag">¡Trofeo desbloqueado!</div>
      <div class="mm-trophy-toast-name">${trophy.name}</div>
      <div class="mm-trophy-toast-desc">${trophy.desc}</div>
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('mm-trophy-toast--in'), 50);
  setTimeout(() => {
    el.classList.remove('mm-trophy-toast--in');
    setTimeout(() => el.remove(), 500);
  }, 5000);
}

// ─── Botón del header ─────────────────────────────────────────

function _updateMMBtn() {
  const btn = document.getElementById('mmToggleBtn');
  if (!btn) return;
  const mm = _mmGet();
  if (mm?.active) {
    const earned = MM_TROPHIES.filter(t => mm.trophies?.[t.id]).length;
    btn.classList.add('mm-btn--active');
    btn.dataset.badge = earned > 0 ? earned : '';
    btn.title = `MisiónMate activo · ${earned}/${MM_TROPHIES.length} trofeos`;
  } else {
    btn.classList.remove('mm-btn--active');
    btn.dataset.badge = '';
    btn.title = 'MisiónMate — activar modo misión';
  }
}

// ─── Toggle principal ─────────────────────────────────────────

function toggleMisionMate() {
  const mm = _mmGet();
  if (!mm?.setupDone) {
    _showMMOnboarding();
  } else {
    showMMPanel();
  }
}

// ─── Onboarding (2 pasos) ─────────────────────────────────────

function _showMMOnboarding() {
  document.querySelector('.mm-onboarding')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'mm-onboarding';
  document.body.appendChild(overlay);
  _renderMMStep(overlay, 1, { dailyMins: 15, weeklyDays: 3 });
}

// ─── Swipe horizontal en la tarjeta ──────────────────────────
// onLeft = swipe izquierda (avanzar), onRight = swipe derecha (retroceder)
function _mmAddSwipe(el, onRight, onLeft) {
  if (!el) return;
  let sx = 0, sy = 0;
  el.addEventListener('touchstart', e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return; // scroll vertical o tap
    if (dx < 0 && onLeft)  onLeft();
    if (dx > 0 && onRight) onRight();
  }, { passive: true });
}

function _renderMMStep(overlay, step, prefs) {
  if (step === 1) {
    overlay.innerHTML = `
      <div class="mm-card mm-card--s1">
        <div class="mm-card-hero">
          <div class="mm-card-sword">🗡️</div>
          <div class="mm-card-sparkles">
            <span>✨</span><span>⭐</span><span>✨</span>
          </div>
        </div>

        <h2 class="mm-card-title">¡Activaste MisiónMate!</h2>
        <p class="mm-card-text">
          Cada acción en la app te acerca a un nuevo trofeo.
          Estudiás a tu ritmo — nosotros lo celebramos.
        </p>

        <div class="mm-trophies-preview">
          <div class="mm-trophy-prev-item">
            <span class="mm-trophy-prev-icon">🌱</span>
            <span class="mm-trophy-prev-name">Buenas Raices</span>
            <span class="mm-trophy-prev-sub">50 traducciones</span>
          </div>
          <div class="mm-trophy-prev-item">
            <span class="mm-trophy-prev-icon">⭐</span>
            <span class="mm-trophy-prev-name">Estudiante Estrella</span>
            <span class="mm-trophy-prev-sub">25 flashcards</span>
          </div>
          <div class="mm-trophy-prev-item">
            <span class="mm-trophy-prev-icon">🗣️</span>
            <span class="mm-trophy-prev-name">Trofeo Fluentist</span>
            <span class="mm-trophy-prev-sub">20 mensajes IA</span>
          </div>
          <div class="mm-trophy-prev-item">
            <span class="mm-trophy-prev-icon">🧱🌸🥇</span>
            <span class="mm-trophy-prev-name">Constructor · Alquimista · Maestro</span>
            <span class="mm-trophy-prev-sub">Flashcards A0→C2</span>
          </div>
        </div>

        <div class="mm-step-dots">
          <div class="mm-dot mm-dot--active"></div>
          <div class="mm-dot"></div>
        </div>

        <div class="mm-card-btns">
          <button class="secondary-btn" id="mmCancelBtn">Ahora no</button>
          <button class="primary-btn"   id="mmNextBtn">Continuar →</button>
        </div>
      </div>
    `;
    overlay.querySelector('#mmCancelBtn').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#mmNextBtn').addEventListener('click', () => _renderMMStep(overlay, 2, prefs));
    _mmAddSwipe(overlay.querySelector('.mm-card'), null, () => _renderMMStep(overlay, 2, prefs));

  } else {
    overlay.innerHTML = `
      <div class="mm-card mm-card--s2">
        <div class="mm-card-hero">
          <div class="mm-card-sword">⏱️</div>
        </div>

        <h2 class="mm-card-title">¿Cuánto tiempo tenés?</h2>
        <p class="mm-card-text">
          Definí tu meta personal. Sin presión — podés cambiarla cuando quieras.
        </p>

        <div class="mm-goal-section">
          <label class="mm-goal-label">⏰ Tiempo diario de práctica</label>
          <div class="mm-chips" id="mmDailyChips">
            ${[5,10,15,20,30].map(m => `
              <button class="mm-chip ${m === prefs.dailyMins ? 'mm-chip--on' : ''}" data-val="${m}">
                ${m} min
              </button>`).join('')}
          </div>
        </div>

        <div class="mm-goal-section">
          <label class="mm-goal-label">📅 Días por semana</label>
          <div class="mm-chips" id="mmWeekChips">
            ${[1,2,3,4,5,6,7].map(d => `
              <button class="mm-chip ${d === prefs.weeklyDays ? 'mm-chip--on' : ''}" data-val="${d}">
                ${d === 7 ? 'todos' : d + 'd'}
              </button>`).join('')}
          </div>
        </div>

        <div class="mm-step-dots">
          <div class="mm-dot"></div>
          <div class="mm-dot mm-dot--active"></div>
        </div>

        <div class="mm-card-btns">
          <button class="secondary-btn" id="mmBackBtn">← Atrás</button>
          <button class="primary-btn mm-start-btn" id="mmStartBtn">¡Comenzar misión! 🗡️</button>
        </div>
      </div>
    `;

    overlay.querySelectorAll('#mmDailyChips .mm-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('#mmDailyChips .mm-chip').forEach(b => b.classList.remove('mm-chip--on'));
        btn.classList.add('mm-chip--on');
        prefs.dailyMins = +btn.dataset.val;
      });
    });
    overlay.querySelectorAll('#mmWeekChips .mm-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('#mmWeekChips .mm-chip').forEach(b => b.classList.remove('mm-chip--on'));
        btn.classList.add('mm-chip--on');
        prefs.weeklyDays = +btn.dataset.val;
      });
    });

    overlay.querySelector('#mmBackBtn').addEventListener('click', () => _renderMMStep(overlay, 1, prefs));
    _mmAddSwipe(overlay.querySelector('.mm-card'), () => _renderMMStep(overlay, 1, prefs), null);
    overlay.querySelector('#mmStartBtn').addEventListener('click', () => {
      const initStats = {
        translations: 0, flashcards: 0, chatMessages: 0,
        level_a0: 0, level_a1: 0, level_a2: 0,
        level_b1: 0, level_b2: 0,
        level_c1: 0, level_c2: 0,
      };
      _mmSave({
        active:     true,
        setupDone:  true,
        dailyMins:  prefs.dailyMins,
        weeklyDays: prefs.weeklyDays,
        startedAt:  new Date().toISOString(),
        stats:      initStats,
        trophies:   {}
      });
      overlay.remove();
      _updateMMBtn();
      _showMMTutorial();
    });
  }
}

// ─── Hoja de Ruta (tour spotlight) ────────────────────────────

const _MM_TOUR_STEPS = [
  {
    selector: '#allFlashcardsMainBtn',
    title:    '🧱 Tu área principal de desafío',
    text:     'Estudiá las tarjetas y avanzá nivel por nivel. Completar cada grupo desbloquea los Trofeos Constructor, Alquimista y Maestro.',
  },
  {
    selector: '.mode-card[data-mode="simple"]',
    title:    '🌱 Trofeo Buenas Raices',
    text:     'Todas las áreas activan logros diferentes. Al llegar a 50 traducciones desbloqueás el Trofeo Buenas Raices.',
  },
  {
    selector: '#famousCarouselSection',
    title:    '🗣️ Trofeo Fluentist',
    text:     'Al conversar con tu profe IA (Modo Escuela) o nuestra liga de Famosos desbloqueás el Trofeo Fluentist.',
  },
  {
    selector: '#newGroupMainBtn',
    title:    '⭐ Estudiante Estrella',
    text:     'Creando tus propias flashcards activás el logro Estudiante Estrella. ¡Cada palabra guardada cuenta!',
  },
];

function _showMMTutorial() {
  // Ir al menú principal para que estén visibles las secciones
  if (typeof showMainMenu === 'function') showMainMenu();

  let step = 0;

  const overlay = document.createElement('div');
  overlay.className = 'mm-tour-overlay';
  document.body.appendChild(overlay);

  // Botón Saltar — siempre visible
  const skipBtn = document.createElement('button');
  skipBtn.className = 'mm-tour-skip-btn';
  skipBtn.textContent = 'Saltar';
  overlay.appendChild(skipBtn);

  const closeTour = () => overlay.remove();
  skipBtn.addEventListener('click', closeTour);

  function render() {
    // Limpiar contenido previo (excepto el skip btn)
    overlay.querySelectorAll('.mm-tour-spotlight, .mm-tour-callout').forEach(el => el.remove());

    const s      = _MM_TOUR_STEPS[step];
    const target = document.querySelector(s.selector);

    if (!target) { // elemento no visible → saltar paso
      if (step < _MM_TOUR_STEPS.length - 1) { step++; render(); }
      else closeTour();
      return;
    }

    // Scroll al elemento y luego posicionar
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const PAD  = 10;

      // ── Spotlight ───────────────────────────────────────────
      const spot = document.createElement('div');
      spot.className = 'mm-tour-spotlight';
      spot.style.cssText = `
        left:   ${rect.left   - PAD}px;
        top:    ${rect.top    - PAD}px;
        width:  ${rect.width  + PAD * 2}px;
        height: ${rect.height + PAD * 2}px;
      `;
      overlay.appendChild(spot);

      // ── Callout ─────────────────────────────────────────────
      const callout = document.createElement('div');
      callout.className = 'mm-tour-callout';

      const spaceBelow = window.innerHeight - rect.bottom - PAD - 10;
      const spaceAbove = rect.top - PAD - 10;
      const placeBelow = spaceBelow >= 150 || spaceBelow >= spaceAbove;

      if (placeBelow) {
        callout.style.top  = `${rect.bottom + PAD + 10}px`;
      } else {
        callout.style.bottom = `${window.innerHeight - rect.top + PAD + 10}px`;
      }

      callout.innerHTML = `
        <div class="mm-tour-step-count">${step + 1} / ${_MM_TOUR_STEPS.length}</div>
        <div class="mm-tour-title">${s.title}</div>
        <div class="mm-tour-text">${s.text}</div>
        <div class="mm-tour-btns">
          ${step > 0
            ? `<button class="mm-tour-prev-btn secondary-btn">← Anterior</button>`
            : ''}
          <button class="mm-tour-next-btn primary-btn">
            ${step < _MM_TOUR_STEPS.length - 1 ? 'Siguiente →' : '¡Entendido! 🗡️'}
          </button>
        </div>
        <div class="mm-step-dots" style="margin-top:0.75rem; margin-bottom:0;">
          ${_MM_TOUR_STEPS.map((_, i) =>
            `<div class="mm-dot ${i === step ? 'mm-dot--active' : ''}"></div>`
          ).join('')}
        </div>
      `;
      overlay.appendChild(callout);

      callout.querySelector('.mm-tour-next-btn').addEventListener('click', () => {
        if (step < _MM_TOUR_STEPS.length - 1) { step++; render(); }
        else closeTour();
      });
      callout.querySelector('.mm-tour-prev-btn')?.addEventListener('click', () => {
        if (step > 0) { step--; render(); }
      });

      // Swipe en la callout
      _mmAddSwipe(callout,
        step > 0 ? () => { step--; render(); } : null,
        step < _MM_TOUR_STEPS.length - 1 ? () => { step++; render(); } : closeTour
      );

      setTimeout(() => callout.classList.add('mm-tour-callout--in'), 30);
    }, 350);
  }

  setTimeout(render, 150);
}

// ─── Panel de progreso ────────────────────────────────────────

function showMMPanel() {
  document.querySelector('.mm-panel-overlay')?.remove();
  const mm       = _mmGet();
  if (!mm) return;
  const stats    = mm.stats    || {};
  const trophies = mm.trophies || {};

  // Render trophies grouped
  const groupedRows = _MM_GROUPS.map(grp => {
    const items = MM_TROPHIES.filter(t => t.group === grp.key);
    return `
      <div class="mm-panel-group-hd">${grp.label}</div>
      ${items.map(t => {
        const earned  = !!trophies[t.id];
        const cur     = stats[t.stat] || 0;
        const pct     = Math.min(100, Math.round((cur / t.max) * 100));
        return `
          <div class="mm-panel-trophy ${earned ? 'mm-panel-trophy--earned' : ''}">
            <div class="mm-panel-trophy-icon">${earned ? t.icon : '🔒'}</div>
            <div class="mm-panel-trophy-body">
              <div class="mm-panel-trophy-name">${t.name}</div>
              <div class="mm-panel-trophy-desc">${t.desc}</div>
              ${earned
                ? `<div class="mm-panel-trophy-check">✅ Conseguido</div>`
                : `<div class="mm-panel-prog-wrap">
                     <div class="mm-panel-prog-bar">
                       <div class="mm-panel-prog-fill" style="width:${pct}%"></div>
                     </div>
                     <span class="mm-panel-prog-label">${cur} / ${t.max}</span>
                   </div>`
              }
            </div>
          </div>
        `;
      }).join('')}
    `;
  }).join('');

  const totalEarned = MM_TROPHIES.filter(t => trophies[t.id]).length;

  const overlay = document.createElement('div');
  overlay.className = 'mm-panel-overlay';
  overlay.innerHTML = `
    <div class="mm-panel">
      <div class="mm-panel-hd">
        <span class="mm-panel-hd-icon">🗡️</span>
        <span class="mm-panel-hd-title">MisiónMate</span>
        <button class="mm-panel-close-btn" id="mmPanelClose">✕</button>
      </div>

      <div class="mm-panel-goals">
        <div class="mm-panel-goal-chip">⏰ ${mm.dailyMins} min/día</div>
        <div class="mm-panel-goal-chip">📅 ${mm.weeklyDays} día${mm.weeklyDays !== 1 ? 's' : ''}/semana</div>
        <div class="mm-panel-goal-chip">🏆 ${totalEarned}/${MM_TROPHIES.length}</div>
      </div>

      <div class="mm-panel-trophies-list">
        ${groupedRows}
      </div>

      <div class="mm-panel-footer">
        <button class="mm-panel-toggle-btn" id="mmPanelToggle">
          ${mm.active ? '⏸ Pausar misión' : '▶ Reactivar misión'}
        </button>
        <button class="mm-panel-route-btn" id="mmPanelRoute">🗺️ Hoja de Ruta</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('mm-panel-overlay--in'), 30);

  const close = () => {
    overlay.classList.remove('mm-panel-overlay--in');
    setTimeout(() => overlay.remove(), 300);
  };
  overlay.querySelector('#mmPanelClose').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  overlay.querySelector('#mmPanelToggle').addEventListener('click', () => {
    mm.active = !mm.active;
    _mmSave(mm);
    _updateMMBtn();
    close();
    if (typeof showToast === 'function')
      showToast(mm.active ? '🗡️ MisiónMate activado' : '⏸ MisiónMate pausado');
  });

  overlay.querySelector('#mmPanelRoute').addEventListener('click', () => {
    close();
    setTimeout(_showMMTutorial, 200);
  });
}

// ─── Init ─────────────────────────────────────────────────────

function initMisionMate() {
  _updateMMBtn();
}
