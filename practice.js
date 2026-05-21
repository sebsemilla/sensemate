// practice.js — Sección Práctica: flashcards A0 con swipe
// =========================================================
// Depende de: app.js globals, flashcard_data.js

const _STATES_KEY = 'ls_card_states';

// ── Estado de cartas (localStorage) ──────────────────────────

function loadCardStates() {
    try { return JSON.parse(localStorage.getItem(_STATES_KEY) || '{}'); }
    catch { return {}; }
}
function saveCardState(cardId, state) {
    const states = loadCardStates();
    states[cardId] = state;
    localStorage.setItem(_STATES_KEY, JSON.stringify(states));
}
function getGroupProgress(group) {
    const states = loadCardStates();
    const total   = group.cards.length;
    const learned = group.cards.filter(c => states[c.id] === 'learned').length;
    const reviewing = group.cards.filter(c => states[c.id] === 'reviewing').length;
    return { total, learned, reviewing, pct: total ? Math.round((learned / total) * 100) : 0 };
}

// ── Entry point ───────────────────────────────────────────────

function loadPracticeMenu() {
    showPracticeOverview();
}

// ── Traducción de carta al idioma nativo del usuario ─────────

function getCardTranslation(card) {
    if (!card || card.isLetter) return card?.translation || '';

    // Idioma de traducción = idioma global de la UI (nativo del usuario)
    // No depende de sourceLang de la barra de idiomas
    const native = appUILanguage || sourceLang || 'es';

    // 1. Buscar en translations enriquecidas
    if (card.translations?.[native]) {
        return card.translations[native];
    }

    // 2. Parsear formato 'español / english' del campo translation
    const trans = (card.translation || '').trim();
    if (trans.includes(' / ')) {
        const [esPart, enPart] = trans.split(' / ').map(s => s.trim());
        if (native === 'es') return esPart;
        if (native === 'en') return enPart;
        // Otro idioma nativo: devolver parte española como mejor aproximación
        return esPart || enPart;
    }
    return trans;
}

function getExampleTranslation(ex) {
    const native = appUILanguage || sourceLang || 'es';
    if (native === 'en') return ex.n || '';
    // Para español y otros: ex.n suele estar en inglés, mostrar entre paréntesis
    return ex.n || '';
}

// ── Currículum por nivel separado ─────────────────────────────

function getLevelCurriculum(langCode, level) {
    if (level === 'A1' && typeof FLASHCARD_A1 !== 'undefined') {
        return FLASHCARD_A1[langCode] || FLASHCARD_A1['es'];
    }
    return FLASHCARD_CURRICULUM[langCode] || FLASHCARD_CURRICULUM['es'];
}

function getAvailableLevels(langCode) {
    const levels = [{ key:'A0', label:'A0' }];
    if (typeof FLASHCARD_A1 !== 'undefined' && (FLASHCARD_A1[langCode] || FLASHCARD_A1['es'])) {
        levels.push({ key:'A1', label:'A1' });
    }
    return levels;
}

// ── Vista general: los 4 grupos ───────────────────────────────

function showPracticeOverview(selectedLevel = 'A0') {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    const lang       = targetLang || 'es';
    const curriculum = getLevelCurriculum(lang, selectedLevel);
    const levels     = getAvailableLevels(lang);
    const states     = loadCardStates();
    const hasProgress = curriculum.groups.some(g => g.cards.some(c => states[c.id]));

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="prac-wrap">

            <div class="prac-header">
                <button class="school-back-btn" id="pracBackBtn">← Menú</button>
            </div>
            <h2 class="prac-title-centered">${curriculum.levelName || curriculum.level}</h2>
            <div class="prac-level-tabs-centered">
                ${levels.map(l => `
                    <button class="prac-level-tab ${l.key === selectedLevel ? 'active' : ''}"
                            data-level="${l.key}">${l.label}</button>
                `).join('')}
            </div>

            <div class="prac-groups">
                ${(() => {
                    return curriculum.groups.map((group, idx) => {
                    const prog = getGroupProgress(group);
                    const showReset = false; // moved to bottom bar
                    return `
                    <div class="prac-group-card" data-group-idx="${idx}"
                         style="--gc:${group.color}">
                        <div class="prac-group-left">
                            <div class="prac-group-icon">${group.icon}</div>
                            <div class="prac-group-info">
                                <div class="prac-group-name">${group.name}</div>
                                <div class="prac-group-desc">${group.description}</div>
                                <div class="prac-group-count">
                                    ${group.cards.length} cartas
                                    ${idx > 0 ? `· +${Math.min(idx * 2 + 2, 4)} repaso` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="prac-group-right">
                            <div class="prac-group-pct">${prog.pct}%</div>
                            <div class="prac-group-bar">
                                <div class="prac-group-fill" style="width:${prog.pct}%"></div>
                            </div>
                            <div class="prac-group-stats">
                                <span class="prac-stat prac-stat--green">✓ ${prog.learned}</span>
                                <span class="prac-stat prac-stat--blue">~ ${prog.reviewing}</span>
                                <span class="prac-stat prac-stat--gray">? ${prog.total - prog.learned - prog.reviewing}</span>
                            </div>
                        </div>
                    </div>

                    `;
                    }).join('');
                })()}
            </div>

            <!-- Barra inferior siempre visible -->
            <div class="prac-bottom-bar">
                ${hasProgress ? '<button class="prac-reset-btn-inline" data-reset="true">↺ Reiniciar</button>' : ''}
                <button class="prac-module-words-btn" id="pracModuleWordsBtn">📋 Palabras del módulo</button>
            </div>

        </div>
    `);

    document.getElementById('pracBackBtn').addEventListener('click', showMainMenu);

    // Level tabs
    document.querySelectorAll('.prac-level-tab').forEach(tab => {
        tab.addEventListener('click', () => showPracticeOverview(tab.dataset.level));
    });

    document.querySelectorAll('.prac-group-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.groupIdx);
            startStudySession(curriculum, idx, selectedLevel);
        });
    });

    // Palabras del módulo — muestra todas las palabras del nivel actual
    document.getElementById('pracModuleWordsBtn')?.addEventListener('click', () => {
        showModuleWordsPanel(curriculum);
    });

    document.querySelectorAll('[data-reset="true"]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            if (!confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) return;
            localStorage.removeItem(_STATES_KEY);
            showPracticeOverview(selectedLevel);
            showToast('Progreso reiniciado');
        });
    });
}

// ── Sesión de estudio ─────────────────────────────────────────

function startStudySession(curriculum, groupIdx, selectedLevel = 'A0') {
    const group   = curriculum.groups[groupIdx];
    const review  = groupIdx > 0
        ? getReviewCards(curriculum, groupIdx, Math.min(groupIdx * 2 + 2, 4))
        : [];

    // Mezclar cartas del grupo con las de repaso
    const deckBase = [...group.cards];
    const reviewMarked = review.map(c => ({ ...c, _isReview: true }));

    // Insertar cartas de repaso en posiciones aleatorias
    const deck = [...deckBase];
    reviewMarked.forEach(rc => {
        const pos = Math.floor(Math.random() * (deck.length + 1));
        deck.splice(pos, 0, rc);
    });

    const session = { repeatCounts: {} };
    showStudyCard(curriculum, groupIdx, deck, 0, session, selectedLevel);
}

// ── Panel flotante de palabras ────────────────────────────────

function showWordListPanel(group) {
    document.getElementById('pracWordListPanel')?.remove();
    const native = appUILanguage || sourceLang || 'es';
    const words  = group.cards.filter(c => !c.isLetter && c.type !== 'dialogue');
    const dlgs   = group.cards.filter(c => c.type === 'dialogue');

    const panel = document.createElement('div');
    panel.id = 'pracWordListPanel';
    panel.className = 'prac-wordlist-overlay';
    panel.innerHTML = `
        <div class="prac-wordlist-panel">
            <div class="prac-wordlist-header">
                <span>${group.icon} ${group.name}</span>
                <button class="prac-wordlist-close">✕</button>
            </div>
            <div class="prac-wordlist-body">
                ${words.map(c => `
                    <div class="prac-wordlist-item">
                        ${c.image
                            ? `<img class="prac-wl-img" src="/images/flashcards/${c.image}" alt="${c.word}"
                                    onerror="this.style.display='none'">`
                            : `<span class="prac-wl-emoji">${c.emoji||''}</span>`}
                        <span class="prac-wl-word">${c.word}</span>
                        <span class="prac-wl-trans">${c.translations?.[native]||''}</span>
                    </div>
                `).join('')}
                ${dlgs.length ? `<div class="prac-wordlist-divider">💬 Diálogos</div>
                ${dlgs.map(c=>`<div class="prac-wordlist-item prac-wordlist-item--dlg">
                    <span>💬</span><span class="prac-wl-word">${c.context||c.word}</span>
                </div>`).join('')}` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('.prac-wordlist-close').addEventListener('click', () => panel.remove());
    panel.addEventListener('click', e => { if (e.target === panel) panel.remove(); });
}


function showModuleWordsPanel(curriculum) {
    document.getElementById('pracWordListPanel')?.remove();
    const native = appUILanguage || sourceLang || 'es';

    const panel = document.createElement('div');
    panel.id = 'pracWordListPanel';
    panel.className = 'prac-wordlist-overlay';
    panel.innerHTML = `
        <div class="prac-wordlist-panel">
            <div class="prac-wordlist-header">
                <span>📋 ${curriculum.levelName || curriculum.level}</span>
                <button class="prac-wordlist-close">✕</button>
            </div>
            <div class="prac-wordlist-body">
                ${curriculum.groups.map(group => {
                    const words = group.cards.filter(c => !c.isLetter && c.type !== 'dialogue');
                    const dlgs  = group.cards.filter(c => c.type === 'dialogue');
                    return `
                        <div class="prac-wordlist-group-header">
                            ${group.icon} ${group.name}
                        </div>
                        ${words.map(c => `
                            <div class="prac-wordlist-item">
                                <span class="prac-wl-emoji">${c.emoji||''}</span>
                                <span class="prac-wl-word">${c.word}</span>
                                <span class="prac-wl-trans">${c.translations?.[native]||''}</span>
                            </div>
                        `).join('')}
                        ${dlgs.map(c => `
                            <div class="prac-wordlist-item prac-wordlist-item--dlg">
                                <span>💬</span>
                                <span class="prac-wl-word">${c.context||c.word}</span>
                            </div>
                        `).join('')}
                    `;
                }).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('.prac-wordlist-close').addEventListener('click', () => panel.remove());
    panel.addEventListener('click', e => { if (e.target === panel) panel.remove(); });
}

// ── Vista de tarjeta ──────────────────────────────────────────

function showStudyCard(curriculum, groupIdx, deck, cardIdx, session, selectedLevel = 'A0') {
    if (cardIdx >= deck.length) {
        showSessionComplete(curriculum, groupIdx, deck, session, selectedLevel);
        return;
    }

    const card    = deck[cardIdx];
    const group   = curriculum.groups[groupIdx];
    const states  = loadCardStates();
    const curState = states[card.id] || 'unknown';
    const pct      = Math.round((cardIdx / deck.length) * 100);

    mainContainer.innerHTML = `
        <div class="prac-study-wrap">

            <!-- Barra de progreso de la sesión -->
            <div class="prac-session-bar">
                <button class="school-back-btn prac-exit-btn" id="studyExitBtn">← Volver</button>
                <div class="prac-session-progress">
                    <div class="prac-session-fill" style="width:${pct}%"></div>
                </div>
                <span class="prac-session-count">${cardIdx + 1}/${deck.length}</span>
            </div>

            <!-- Letra del grupo y badge repaso -->
            <div class="prac-card-meta">
                <span class="prac-letter-badge" style="background:${group.color}22; color:${group.color}">
                    ${card.letter || group.icon}
                </span>
                ${card._isReview  ? '<span class="prac-review-badge">↩ Repaso</span>' : ''}
                ${card._isRepeat  ? `<span class="prac-repeat-badge prac-repeat-badge--${card._repeatNum > 1 ? 'red' : 'blue'}">↺ Repetición ${card._repeatNum}/${card._repeatMax}</span>` : ''}
            </div>

            <!-- Card con flip -->
            <div class="prac-card-container" id="pracCardContainer">
                <div class="prac-card ${card.type==='dialogue'?'prac-card--dialogue':''}" id="pracCard">

                    ${card.type === 'dialogue' ? `
                    <div class="prac-card-front prac-card-front--dialogue">
                        <div class="prac-card-emoji">💬</div>
                        <div class="prac-dialogue-context">${card.context||''}</div>
                        <div class="prac-dialogue-preview">${(card.dialogue||[]).slice(0,1).map(l=>`<strong>${l.speaker}:</strong> <em>${l.line}</em>`).join('')}</div>
                        <div class="prac-card-hint">Toca para ver el diálogo completo</div>
                    </div>
                    <div class="prac-card-back prac-card-back--dialogue">
                        <div class="prac-dialogue-full">
                            ${(card.dialogue||[]).map(l=>`<div class="prac-dlg-line"><span class="prac-dlg-speaker">${l.speaker}:</span> <span class="prac-dlg-text">${l.line}</span></div>`).join('')}
                        </div>
                        ${card.note?`<div class="prac-dialogue-note">💡 ${card.note}</div>`:''}
                    </div>
                    ` : `
                    <div class="prac-card-front">
                        ${card.image
                            ? `<img class="prac-card-img" src="/images/flashcards/${card.image}"
                                    alt="${card.word}"
                                    onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
                            : ''}
                        <div class="prac-card-emoji" ${card.image ? 'style="display:none"' : ''}>${card.emoji}</div>
                        <div class="prac-card-word">${card.word}</div>
                        <button class="prac-audio-btn" id="pracAudioFront" title="Escuchar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                        <div class="prac-card-hint">Toca para ver la respuesta</div>
                        <div class="prac-swipe-hint-inline"><span>← No sé</span><span>↑ Casi</span><span>Lo sé →</span></div>
                    </div>
                    <div class="prac-card-back">
                        ${card.image
                            ? `<img class="prac-card-img prac-card-img--sm" src="/images/flashcards/${card.image}"
                                    alt="${card.word}"
                                    onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
                            : ''}
                        <div class="prac-card-emoji prac-card-emoji--sm" ${card.image ? 'style="display:none"' : ''}>${card.emoji}</div>
                        <div class="prac-card-word prac-card-word--sm">${card.word}</div>
                        <div class="prac-card-phonetic">${card.phonetic||''}</div>
                        <div class="prac-card-translation">${getCardTranslation(card)}</div>
                        <div class="prac-card-examples">
                            ${(card.examples||[]).map(ex=>`<div class="prac-example"><div class="prac-ex-original">${ex.t}</div></div>`).join('')}
                        </div>
                        <button class="prac-audio-btn" id="pracAudioBack" title="Escuchar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                    </div>
                    `}

                </div>
            </div>

            <!-- Botones de estado -->
            <div class="prac-state-btns" id="pracStateBtns">
                <button class="prac-state-btn prac-state-btn--red"   data-state="unknown"   id="btnUnknown">
                    <span class="prac-state-icon">✗</span>
                    <span>No sé</span>
                </button>
                <button class="prac-state-btn prac-state-btn--blue"  data-state="reviewing" id="btnReviewing">
                    <span class="prac-state-icon">~</span>
                    <span>Casi</span>
                </button>
                <button class="prac-state-btn prac-state-btn--green" data-state="learned"   id="btnLearned">
                    <span class="prac-state-icon">✓</span>
                    <span>Lo sé</span>
                </button>
            </div>

        </div>
    `;

    const pracCard     = document.getElementById('pracCard');
    const stateBtns    = document.getElementById('pracStateBtns');
    let   isFlipped    = false;

    // ── Flip al tocar ──────────────────────────────────────────
    function flipCard() {
        if (isFlipped) return;
        isFlipped = true;
        pracCard.classList.add('prac-card--flipped');
    }

    pracCard.addEventListener('click', flipCard);

    // ── Audio ──────────────────────────────────────────────────
    function speak(word) {
        const u   = new SpeechSynthesisUtterance(word);
        const map = { es:'es-ES', en:'en-US', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-BR' };
        u.lang    = map[targetLang] || 'es-ES';
        u.rate    = 0.85;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }
    document.getElementById('pracAudioFront').addEventListener('click', e => { e.stopPropagation(); speak(card.word); });
    document.getElementById('pracAudioBack').addEventListener('click',  e => { e.stopPropagation(); speak(card.word); });

    // ── Avanzar con lógica de repetición ─────────────────────
    function advance(state) {
        // Guardar estado solo para cartas originales (no review ni repeat)
        if (!card._isReview && !card._isRepeat) saveCardState(card.id, state);

        // Repetición dentro de la sesión
        const repeatCount = session.repeatCounts[card.id] || 0;
        const maxRepeats  = state === 'unknown' ? 2 : state === 'reviewing' ? 1 : 0;

        if (maxRepeats > 0 && repeatCount < maxRepeats) {
            session.repeatCounts[card.id] = repeatCount + 1;
            // Insertar la carta más adelante en el mazo
            const minGap  = state === 'unknown' ? 2 : 4;
            const spread  = 3;
            const insertAt = Math.min(
                cardIdx + 1 + minGap + Math.floor(Math.random() * spread),
                deck.length
            );
            deck.splice(insertAt, 0, {
                ...card,
                _isRepeat:   true,
                _repeatNum:  repeatCount + 1,
                _repeatMax:  maxRepeats,
            });
        }

        // Animación de salida según estado
        const dir = state === 'learned' ? 1 : state === 'unknown' ? -1 : 0;
        const container = document.getElementById('pracCardContainer');
        if (container) {
            container.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            container.style.transform  = dir !== 0
                ? `translateX(${dir * 120}%) rotate(${dir * 15}deg)`
                : 'translateY(-80px)';
            container.style.opacity = '0';
        }
        setTimeout(() => showStudyCard(curriculum, groupIdx, deck, cardIdx + 1, session, selectedLevel), 300);
    }

    // ── Botones de estado — siempre avanzan ──────────────────
    document.querySelectorAll('.prac-state-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            advance(btn.dataset.state);
        });
    });

    // ── Swipe ─────────────────────────────────────────────────
    let touchStartX = 0, touchStartY = 0;
    const container = document.getElementById('pracCardContainer');

    container.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', e => {
        if (!isFlipped) { flipCard(); return; }
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            advance(dx > 0 ? 'learned' : 'unknown');
        } else if (dy < -60 && Math.abs(dy) > Math.abs(dx)) {
            advance('reviewing');
        }
    }, { passive: true });

    // ── Drag mouse ────────────────────────────────────────────
    let dragStartX = 0, isDragging = false;
    container.addEventListener('mousedown', e => { e.preventDefault(); dragStartX = e.clientX; isDragging = true; });
    document.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        if (!isFlipped) return;
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) > 60) advance(dx > 0 ? 'learned' : 'unknown');
    });

    // ── Salir ─────────────────────────────────────────────────
    document.getElementById('studyExitBtn').addEventListener('click', () => {
        showPracticeOverview(selectedLevel);
    });

    // Auto-pronunciar la palabra al mostrar la carta
    setTimeout(() => speak(card.word), 300);
}

// ── Pantalla de sesión completada ─────────────────────────────

function showSessionComplete(curriculum, groupIdx, deck, session, selectedLevel = 'A0') {
    const states  = loadCardStates();
    const group   = curriculum.groups[groupIdx];
    const learned   = deck.filter(c => !c._isReview && states[c.id] === 'learned').length;
    const reviewing = deck.filter(c => !c._isReview && states[c.id] === 'reviewing').length;
    const unknown   = deck.filter(c => !c._isReview && states[c.id] === 'unknown').length;
    const total     = deck.filter(c => !c._isReview).length;
    const pct       = Math.round((learned / total) * 100);

    // Track MisiónMate trophy for this level
    if (typeof misionTrack === 'function') {
        misionTrack('level_' + selectedLevel.toLowerCase());
    }

    const shareText = encodeURIComponent(
        `¡Completé "${group.name}" (nivel ${selectedLevel}) con ${pct}% dominado en SenseMate! 🎓🗡️`
    );
    const shareUrl  = encodeURIComponent('https://sensemate.app');
    const hasNativeShare = !!navigator.share;

    mainContainer.innerHTML = `
        <div class="prac-complete-wrap">
            <div class="prac-complete-icon">🎉</div>
            <h2 class="prac-complete-title">¡Sesión completada!</h2>
            <p class="prac-complete-group">${group.icon} ${group.name}</p>

            <div class="prac-complete-stats">
                <div class="prac-complete-stat prac-complete-stat--green">
                    <span class="prac-complete-num">${learned}</span>
                    <span>Lo sé ✓</span>
                </div>
                <div class="prac-complete-stat prac-complete-stat--blue">
                    <span class="prac-complete-num">${reviewing}</span>
                    <span>Casi ~</span>
                </div>
                <div class="prac-complete-stat prac-complete-stat--red">
                    <span class="prac-complete-num">${unknown}</span>
                    <span>No sé ✗</span>
                </div>
            </div>

            <div class="prac-complete-bar">
                <div class="prac-complete-fill" style="width:${pct}%"></div>
            </div>
            <p class="prac-complete-pct">${pct}% dominado</p>

            <!-- Compartir logro -->
            <div class="prac-share-section">
                <p class="prac-share-title">Compartir logro</p>
                ${hasNativeShare
                    ? `<button class="prac-share-btn prac-share-btn--native" id="shareNativeBtn">
                           📤 Compartir
                       </button>`
                    : `<div class="prac-share-btns">
                           <a class="prac-share-btn prac-share-btn--wa"
                              href="https://wa.me/?text=${shareText}"
                              target="_blank" rel="noopener">💬 WhatsApp</a>
                           <a class="prac-share-btn prac-share-btn--tw"
                              href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}"
                              target="_blank" rel="noopener">✖ Twitter</a>
                           <a class="prac-share-btn prac-share-btn--tg"
                              href="https://t.me/share/url?url=${shareUrl}&text=${shareText}"
                              target="_blank" rel="noopener">✈ Telegram</a>
                           <button class="prac-share-btn prac-share-btn--copy" id="shareCopyBtn">
                               📋 Copiar
                           </button>
                       </div>`
                }
            </div>

            <div class="prac-complete-btns">
                <button class="school-back-btn" id="completBackBtn">← Grupos</button>
                <button class="smp-translate-btn" id="completRepeatBtn">
                    Repetir sesión →
                </button>
            </div>
        </div>
    `;

    document.getElementById('completBackBtn').addEventListener('click', () => showPracticeOverview(selectedLevel));
    document.getElementById('completRepeatBtn').addEventListener('click', () => {
        startStudySession(curriculum, groupIdx, selectedLevel);
    });

    if (hasNativeShare) {
        document.getElementById('shareNativeBtn')?.addEventListener('click', () => {
            navigator.share({
                title: 'SenseMate',
                text:  `¡Completé "${group.name}" (nivel ${selectedLevel}) con ${pct}% dominado en SenseMate! 🎓🗡️`,
                url:   'https://sensemate.app',
            }).catch(() => {});
        });
    } else {
        document.getElementById('shareCopyBtn')?.addEventListener('click', () => {
            const raw = `¡Completé "${group.name}" (nivel ${selectedLevel}) con ${pct}% dominado en SenseMate! 🎓🗡️ https://sensemate.app`;
            navigator.clipboard.writeText(raw).then(() => {
                if (typeof showToast === 'function') showToast('📋 ¡Copiado al portapapeles!');
            }).catch(() => {});
        });
    }
}

// ── Helpers de compatibilidad (para app.js) ───────────────────
// Estas funciones son llamadas desde app.js y showMainMenu

function loadAllStories() { return Promise.resolve(); }
function showAllGroups()   { showPracticeOverview(); }
function showGroupDetail() { showPracticeOverview(); }
function createNewGroup()  { showPracticeOverview(); }
