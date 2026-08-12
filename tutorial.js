// tutorial.js — Tutorial de bienvenida (se muestra una vez al primer ingreso)

const _TUT_KEY = 'ls_tutorial_seen_v1';

const _TUT_STEPS = [
  {
    selector: '.app-mode-btn[data-tab="traduccion"]',
    label:    '🔄 Traductor',
    text:     'Área de traducción de textos y frases cortas.',
  },
  {
    selector: '#allFlashcardsMainBtn',
    label:    '🃏 Flashcards',
    text:     'Aquí encontrarás tarjetas de vocabulario para memorizar, ordenadas por nivel de dificultad MCER.',
  },
  {
    selector: '.app-mode-btn[data-tab="mision"]',
    label:    '🗡️ Curso',
    text:     'Área de aprendizaje de idiomas por módulos asistido por IA.',
  },
  {
    selector: '.app-mode-btn[data-tab="classroom"]',
    label:    '🎓 ClassRoom',
    text:     'Aquí puedes visualizar clases de profesores que estén en actividad.',
  },
  {
    selector: '.mode-card[data-mode="musicians"]',
    label:    '🎵 Música y Multimedia',
    text:     'Aquí puedes buscar música y videos con sus traducciones, y agregar o editar los tuyos.',
  },
];

function _maybeShowTutorial() {
  if (localStorage.getItem(_TUT_KEY)) return;
  setTimeout(_startTutorial, 700);
}

function _startTutorial() {
  if (localStorage.getItem(_TUT_KEY)) return;
  localStorage.setItem(_TUT_KEY, '1');

  let step = 0;

  const overlay = document.createElement('div');
  overlay.className = 'tut-overlay';
  document.body.appendChild(overlay);

  const skipBtn = document.createElement('button');
  skipBtn.className = 'tut-skip-btn';
  skipBtn.textContent = 'Saltar tutorial';
  overlay.appendChild(skipBtn);

  const closeTut = () => {
    overlay.querySelectorAll('.tut-spotlight, .tut-callout').forEach(el => el.remove());
    overlay.classList.remove('tut-overlay--in');
    setTimeout(() => overlay.remove(), 280);
  };

  skipBtn.addEventListener('click', closeTut);
  setTimeout(() => overlay.classList.add('tut-overlay--in'), 30);

  function render() {
    overlay.querySelectorAll('.tut-spotlight, .tut-callout').forEach(el => el.remove());

    const s = _TUT_STEPS[step];
    const target = document.querySelector(s.selector);

    if (!target) {
      if (step < _TUT_STEPS.length - 1) { step++; render(); }
      else closeTut();
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const PAD  = 10;

      const spot = document.createElement('div');
      spot.className = 'tut-spotlight';
      spot.style.cssText = `
        left:   ${rect.left   - PAD}px;
        top:    ${rect.top    - PAD}px;
        width:  ${rect.width  + PAD * 2}px;
        height: ${rect.height + PAD * 2}px;
      `;
      overlay.appendChild(spot);

      const isLast = step === _TUT_STEPS.length - 1;
      const callout = document.createElement('div');
      callout.className = 'tut-callout';
      callout.innerHTML = `
        <div class="tut-step-count">Paso ${step + 1} de ${_TUT_STEPS.length}</div>
        <div class="tut-title">${s.label}</div>
        <div class="tut-text">${s.text}</div>
        <div class="tut-btns">
          ${step > 0
            ? `<button class="secondary-btn" id="tutBack">← Atrás</button>`
            : `<span></span>`}
          <button class="primary-btn" id="tutNext">
            ${isLast ? '¡Listo! ✓' : 'Siguiente →'}
          </button>
        </div>
      `;

      // Posicionar el callout: debajo del elemento si hay espacio, arriba si no
      const spaceBelow = window.innerHeight - rect.bottom - PAD;
      const cardH = 150;
      const topBelow = rect.bottom + PAD + 14;
      const topAbove = rect.top - PAD - 14 - cardH;
      const top = spaceBelow > cardH + 16 ? topBelow : Math.max(10, topAbove);

      callout.style.top = `${top}px`;
      overlay.appendChild(callout);
      setTimeout(() => callout.classList.add('tut-callout--in'), 30);

      callout.querySelector('#tutNext')?.addEventListener('click', () => {
        if (isLast) closeTut();
        else { step++; render(); }
      });
      callout.querySelector('#tutBack')?.addEventListener('click', () => {
        step--;
        render();
      });
    }, 220);
  }

  render();
}
