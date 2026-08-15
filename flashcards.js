// flashcards.js — Creación, edición y publicación de grupos de flashcards propios
// ==================================================================================
// Modelo de datos (se guarda en localStorage vía loadFlashcardData/saveFlashcardData,
// definidas en app.js):
//   group: { id, name, color, notes, visibility, createdAt, lastUsed,
//            serverSubmissionId? }
//     visibility: 'private' | 'pending' | 'public' | 'rejected'
//   card:  { id, groupId, word, translation, phonetic, image, source, dateAdded }
//
// Permisos (ver membership.js): plan Free → 1 grupo nuevo por mes, máx. 10 tarjetas
// por grupo, sin poder editarlo después ni publicarlo. Plan Premium/Oro → grupos y
// tarjetas ilimitados, puede agregar/quitar tarjetas en cualquier momento y publicar
// el grupo como público (pasa a revisión del admin).

const _FC_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

// ─── El Cajón ──────────────────────────────────────────────────
// Staging area donde van las palabras guardadas desde el Traductor
// antes de ser asignadas a un grupo de flashcards.

const _LS_CAJON = 'ls_cajon';

function loadCajon() {
    try { return JSON.parse(localStorage.getItem(_LS_CAJON) || '[]'); }
    catch { return []; }
}
function saveCajon(arr) {
    localStorage.setItem(_LS_CAJON, JSON.stringify(arr || []));
}
function addToCajon(word, translation, srcLang, tgtLang) {
    const cajon = loadCajon();
    cajon.push({
        id:          `cj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        word,
        translation,
        sourceLang:  srcLang || 'en',
        targetLang:  tgtLang || 'es',
        dateAdded:   new Date().toISOString(),
        source:      'translator',
    });
    saveCajon(cajon);
}

function _fcVisibilityBadge(visibility) {
    if (visibility === 'public')  return `<span class="fc-badge fc-badge--public">🌐 Público</span>`;
    if (visibility === 'pending') return `<span class="fc-badge fc-badge--pending">⏳ En revisión</span>`;
    if (visibility === 'rejected') return `<span class="fc-badge fc-badge--rejected">❌ Rechazado</span>`;
    return '';
}

// ─── Paso 1: datos del grupo ────────────────────────────────────

function _showNewGroupForm() {
    if (!requireAuthForAction('crear un grupo de flashcards')) return;

    if (!MembershipPlan.canCreateFlashcardGroup()) {
        _showUpgradeModal('flashcard_group_month');
        return;
    }

    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="prac-wrap">
            <div class="prac-header">
                <button class="school-back-btn" id="fcNewBackBtn">← Menú Práctica</button>
            </div>
            <h2 class="prac-title-centered">➕ Nuevo grupo de flashcards</h2>

            <div class="fc-form-card">
                <label class="fc-form-label">Título *</label>
                <input id="fcGroupTitle" class="imm-modal-input" placeholder="Ej: Vocabulario de viajes" maxlength="60">

                <label class="fc-form-label">Color</label>
                <div class="fc-color-row" id="fcColorRow">
                    ${_FC_COLORS.map((c, i) => `<button type="button" class="fc-color-dot ${i === 0 ? 'active' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}
                </div>

                <label class="fc-form-label">Anotaciones <span class="imm-optional-hint">(opcional)</span></label>
                <textarea id="fcGroupNotes" class="imm-modal-input" rows="2" placeholder="Notas sobre este grupo..."></textarea>

                ${!MembershipPlan.isActive() ? `<p class="fc-plan-hint">🔒 Plan gratuito: 1 grupo por mes, hasta 10 tarjetas.</p>` : ''}

                <div class="ob-error hidden" id="fcGroupErr"></div>
                <button class="primary-btn" id="fcGroupNextBtn">Siguiente → Agregar tarjetas</button>
            </div>
        </div>
    `);

    document.getElementById('fcNewBackBtn').addEventListener('click', showPracticeOverview);

    let selectedColor = _FC_COLORS[0];
    document.querySelectorAll('.fc-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.fc-color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            selectedColor = dot.dataset.color;
        });
    });

    document.getElementById('fcGroupNextBtn').addEventListener('click', () => {
        const title = document.getElementById('fcGroupTitle').value.trim();
        const err   = document.getElementById('fcGroupErr');
        if (!title) {
            err.textContent = 'Ponele un título al grupo.';
            err.classList.remove('hidden');
            return;
        }
        err.classList.add('hidden');

        loadFlashcardData();
        const group = {
            id:         `cg_${Date.now()}`,
            name:       title,
            color:      selectedColor,
            notes:      document.getElementById('fcGroupNotes').value.trim(),
            visibility: 'private',
            createdAt:  new Date().toISOString(),
            lastUsed:   new Date().toISOString(),
        };
        flashcardGroups.push(group);
        saveFlashcardData();
        setLastGroup(group.id);

        if (!MembershipPlan.isActive()) MembershipPlan.markFlashcardGroupCreated();

        _showAddCardsFlow(group.id, true);
    });
}

// ─── Paso 2: agregar tarjetas ────────────────────────────────────

function _showAddCardsFlow(groupId, isNewGroup = false) {
    loadFlashcardData();
    const group = flashcardGroups.find(g => g.id === groupId);
    if (!group) return showPracticeOverview();

    const maxCards = MembershipPlan.maxCardsPerGroup();
    let imageDataUrl = null;

    function render() {
        const cards = flashcards.filter(c => c.groupId === groupId);
        const atCap = cards.length >= maxCards;

        mainContainer.innerHTML = '';
        renderLanguageBar();
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="prac-wrap">
                <div class="prac-header">
                    <button class="school-back-btn" id="fcCardsBackBtn">← ${isNewGroup ? 'Menú Práctica' : 'Mis Tarjetas'}</button>
                </div>
                <h2 class="prac-title-centered">
                    <span class="fc-group-dot" style="background:${group.color || '#6366f1'}"></span> ${escapeHtml(group.name)}
                </h2>
                <p class="fc-cards-count">${cards.length}${maxCards !== Infinity ? ' / ' + maxCards : ''} tarjeta${cards.length !== 1 ? 's' : ''}</p>

                ${!atCap ? `
                <div class="fc-form-card" id="fcAddCardForm">
                    <label class="fc-form-label">Frente *</label>
                    <textarea id="fcCardFront" class="imm-modal-input" rows="2" placeholder="Texto del frente..."></textarea>
                    <label class="fc-form-label">Reverso *</label>
                    <textarea id="fcCardBack" class="imm-modal-input" rows="2" placeholder="Texto del reverso..."></textarea>
                    <label class="fc-form-label">Fonética <span class="imm-optional-hint">(opcional)</span></label>
                    <input id="fcCardPhonetic" class="imm-modal-input" placeholder="Ej: /ˈhæloʊ/">
                    <label class="fc-form-label">Imagen <span class="imm-optional-hint">(opcional)</span></label>
                    <label class="imm-file-btn" for="fcCardImage">Elegir imagen</label>
                    <input type="file" id="fcCardImage" accept="image/*" class="imm-file-hidden">
                    <span class="imm-file-name" id="fcCardImageName">Sin imagen</span>
                    <div class="ob-error hidden" id="fcCardErr"></div>
                    <button class="primary-btn" id="fcAddCardBtn">➕ Agregar tarjeta</button>
                </div>` : `
                <div class="fc-cap-note">🔒 Llegaste al máximo de tarjetas del plan gratuito para este grupo.</div>
                `}

                ${(() => {
                    const cajonItems = loadCajon();
                    if (!cajonItems.length) return '';
                    return `
                    <details class="cajon-from-drawer" ${cards.length === 0 ? 'open' : ''}>
                        <summary class="cajon-drawer-summary">📥 Desde el Cajón <span class="cajon-drawer-count">${cajonItems.length}</span></summary>
                        <div class="cajon-drawer-list">
                            ${cajonItems.map(item => `
                                <div class="cajon-drawer-item">
                                    <span class="cajon-drawer-word">${escapeHtml(item.word)}</span>
                                    <span class="cajon-item-sep">→</span>
                                    <span class="cajon-drawer-trans">${escapeHtml(item.translation)}</span>
                                    <button class="cajon-drawer-add" data-id="${escapeHtml(item.id)}">+ Agregar</button>
                                </div>
                            `).join('')}
                        </div>
                    </details>`;
                })()}

                ${cards.length ? `
                <div class="fc-added-list">
                    ${cards.map(c => `
                        <div class="fc-added-item">
                            ${c.image ? `<img class="fc-added-thumb" src="${c.image}" alt="">` : ''}
                            <div class="fc-added-text">
                                <strong>${escapeHtml(c.word)}</strong> → ${escapeHtml(c.translation)}
                                ${c.phonetic ? `<span class="fc-added-phonetic">${escapeHtml(c.phonetic)}</span>` : ''}
                            </div>
                            <button class="fc-added-del" data-card-id="${c.id}" title="Quitar">✕</button>
                        </div>
                    `).join('')}
                </div>` : ''}

                <button class="primary-btn fc-finish-btn" id="fcFinishBtn">✓ Terminar${cards.length ? '' : ' sin tarjetas'}</button>
            </div>
        `);

        document.getElementById('fcCardsBackBtn').addEventListener('click', () =>
            isNewGroup ? showPracticeOverview() : showCustomGroupDetail(groupId)
        );

        const imgInput = document.getElementById('fcCardImage');
        imgInput?.addEventListener('change', () => {
            const f = imgInput.files[0]; if (!f) return;
            document.getElementById('fcCardImageName').textContent = f.name;
            const reader = new FileReader();
            reader.onload = ev => { imageDataUrl = ev.target.result; };
            reader.readAsDataURL(f);
        });

        document.getElementById('fcAddCardBtn')?.addEventListener('click', () => {
            const front = document.getElementById('fcCardFront').value.trim();
            const back  = document.getElementById('fcCardBack').value.trim();
            const err   = document.getElementById('fcCardErr');
            if (!front || !back) {
                err.textContent = 'Completá el frente y el reverso de la tarjeta.';
                err.classList.remove('hidden');
                return;
            }

            loadFlashcardData();
            flashcards.push({
                id:          `cf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                groupId,
                word:        front,
                translation: back,
                phonetic:    document.getElementById('fcCardPhonetic').value.trim(),
                image:       imageDataUrl,
                source:      'manual',
                dateAdded:   new Date().toISOString(),
            });
            saveFlashcardData();
            imageDataUrl = null;
            render();
        });

        document.querySelectorAll('.fc-added-del').forEach(btn => {
            btn.addEventListener('click', () => {
                loadFlashcardData();
                flashcards = flashcards.filter(c => c.id !== btn.dataset.cardId);
                saveFlashcardData();
                render();
            });
        });

        // Agregar desde el Cajón
        document.querySelectorAll('.cajon-drawer-add').forEach(btn => {
            btn.addEventListener('click', () => {
                const cajon = loadCajon();
                const item  = cajon.find(i => i.id === btn.dataset.id);
                if (!item) return;
                loadFlashcardData();
                flashcards.push({
                    id:          `cf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    groupId,
                    word:        item.word,
                    translation: item.translation,
                    source:      'cajon',
                    dateAdded:   new Date().toISOString(),
                });
                saveFlashcardData();
                render();
            });
        });

        document.getElementById('fcFinishBtn').addEventListener('click', () => showCustomGroupDetail(groupId));
    }

    render();
}

// ─── Publicar/actualizar grupo como público (Contributor) ───────

async function _publishGroupAsPublic(groupId) {
    if (!MembershipPlan.isContributor()) {
        _showUpgradeModal('flashcard_publish_contributor');
        return;
    }

    loadFlashcardData();
    const group = flashcardGroups.find(g => g.id === groupId);
    if (!group) return;
    const cards = flashcards.filter(c => c.groupId === groupId);
    if (!cards.length) {
        showToast('❌ Agregá al menos una tarjeta antes de publicar');
        return;
    }

    const isUpdate = !!group.serverSubmissionId;

    try {
        const isAdminUser = typeof isAdmin === 'function' && isAdmin();
        const res = await _authFetch(`${_API_HOST}/flashcard-groups/submit`, {
            method: 'POST',
            headers: isAdminUser ? { 'x-admin-token': ADMIN_TOKEN } : {},
            body: JSON.stringify({
                title: group.name,
                color: group.color,
                notes: group.notes,
                cards: cards.map(c => ({ word: c.word, translation: c.translation, phonetic: c.phonetic, image: c.image })),
                serverSubmissionId: group.serverSubmissionId,
            })
        });
        const data = await res.json();
        if (!res.ok) {
            showToast(`❌ ${data.error || 'No se pudo enviar el grupo'}`);
            return;
        }
        group.visibility = data.autoApproved ? 'public' : 'pending';
        group.serverSubmissionId = data.id;
        saveFlashcardData();
        showToast(data.autoApproved
            ? (isUpdate ? '✅ Publicación actualizada' : '✅ Grupo publicado')
            : (isUpdate ? '⏳ Actualización enviada — pendiente de revisión' : '⏳ Grupo enviado — pendiente de revisión'));
        showCustomGroupDetail(groupId);
    } catch {
        showToast('❌ Error de red al publicar el grupo');
    }
}

// ─── Sincronizar estado de mis publicaciones (aprobado/rechazado/eliminado) ──
// Se llama al entrar a "Mis Tarjetas". Compara los grupos que el usuario tiene
// marcados como 'pending'/'public' contra el estado real en el servidor y
// avisa por toast si algo cambió desde la última vez que los vio.

async function _fcSyncSubmissionStatus() {
    loadFlashcardData();
    const tracked = flashcardGroups.filter(g => g.serverSubmissionId && (g.visibility === 'pending' || g.visibility === 'public'));
    if (!tracked.length) return false;

    let res;
    try {
        res = await _authFetch(`${_API_HOST}/flashcard-groups/my-submissions`, { method: 'GET' });
    } catch {
        return false;
    }
    if (!res.ok) return false;
    const submissions = await res.json();
    const byId = Object.fromEntries(submissions.map(s => [s.id, s]));

    let changed = false;
    for (const group of tracked) {
        const s = byId[group.serverSubmissionId];
        if (!s) {
            group.visibility = 'private';
            group.serverSubmissionId = null;
            showToast(`🗑️ Tu grupo "${group.name}" fue eliminado del catálogo público por un administrador`);
            changed = true;
        } else if (s.status === 'rejected' && group.visibility !== 'private') {
            group.visibility = 'private';
            showToast(`❌ Tu grupo "${group.name}" fue rechazado${s.adminNote ? ': ' + s.adminNote : ''} — revisalo y volvé a publicarlo cuando quieras`);
            changed = true;
        } else if (s.status === 'approved' && group.visibility !== 'public') {
            group.visibility = 'public';
            showToast(`✅ ¡Tu grupo "${group.name}" fue aprobado y ya es público!`);
            changed = true;
        }
    }

    if (changed) saveFlashcardData();
    return changed;
}

// ─── Panel principal del Cajón ─────────────────────────────────

function _showCajonPanel() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    loadFlashcardData();
    const cajon  = loadCajon();
    const groups = flashcardGroups || [];

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="prac-wrap">
            <div class="prac-header">
                <button class="school-back-btn" id="cajonBackBtn">← Mis Tarjetas</button>
            </div>
            <div class="prac-level-tabs-centered">
                <button class="prac-level-tab" data-mainnav="nivel">Tarjetas por nivel</button>
                <button class="prac-level-tab active" data-mainnav="mis">Mis Tarjetas</button>
            </div>
            <div style="text-align:center;margin:1rem 0 .25rem">
                <span style="font-size:1.6rem">📥</span>
                <h2 class="prac-title-centered" style="margin:.25rem 0 .1rem">El Cajón</h2>
                <p style="font-size:.8rem;color:var(--text-muted);margin:0">${cajon.length} palabra${cajon.length !== 1 ? 's' : ''} guardada${cajon.length !== 1 ? 's' : ''}</p>
            </div>
            ${cajon.length === 0 ? `
                <div class="prac-custom-empty">
                    <div class="prac-custom-empty-icon">📭</div>
                    <p>El Cajón está vacío.</p>
                    <p class="prac-custom-empty-hint">Guardá palabras desde el Traductor para que aparezcan aquí.</p>
                </div>
            ` : `
                <div class="cajon-list">
                    ${cajon.map(item => `
                        <div class="cajon-item" data-id="${escapeHtml(item.id)}">
                            <div class="cajon-item-words">
                                <span class="cajon-item-word">${escapeHtml(item.word)}</span>
                                <span class="cajon-item-sep">→</span>
                                <span class="cajon-item-trans">${escapeHtml(item.translation)}</span>
                            </div>
                            <div class="cajon-item-actions">
                                <button class="cajon-move-btn" data-id="${escapeHtml(item.id)}">→ Grupo</button>
                                <button class="cajon-del-btn" data-id="${escapeHtml(item.id)}">✕</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `);

    document.getElementById('cajonBackBtn').addEventListener('click', showCustomGroupsPanel);

    document.querySelectorAll('[data-mainnav]').forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.mainnav === 'nivel') showVocabCtxPanel();
            else showCustomGroupsPanel();
        });
    });

    document.querySelectorAll('.cajon-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            saveCajon(loadCajon().filter(i => i.id !== btn.dataset.id));
            _showCajonPanel();
        });
    });

    document.querySelectorAll('.cajon-move-btn').forEach(btn => {
        btn.addEventListener('click', () => _showCajonGroupPicker(btn.dataset.id, btn, groups));
    });
}

// ─── Picker de grupo para mover un ítem del Cajón ──────────────

function _showCajonGroupPicker(cajonItemId, anchorBtn, groups) {
    document.getElementById('cajonGroupPicker')?.remove();

    const picker = document.createElement('div');
    picker.id        = 'cajonGroupPicker';
    picker.className = 'cajon-group-picker';
    picker.innerHTML = groups.length === 0
        ? `<div class="cajon-picker-empty">No tenés grupos creados aún.<br><small>Creá uno desde "Mis Tarjetas".</small></div>`
        : groups.map(g => `
            <button class="cajon-picker-group" data-group-id="${escapeHtml(g.id)}">
                <span class="cajon-picker-dot" style="background:${escapeHtml(g.color || '#6366f1')}"></span>
                ${escapeHtml(g.name)}
            </button>
          `).join('');
    document.body.appendChild(picker);

    const rect = anchorBtn.getBoundingClientRect();
    picker.style.top  = `${rect.bottom + window.scrollY + 6}px`;
    picker.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 230))}px`;

    picker.querySelectorAll('.cajon-picker-group').forEach(btn => {
        btn.addEventListener('click', () => {
            const cajon = loadCajon();
            const item  = cajon.find(i => i.id === cajonItemId);
            if (!item) { picker.remove(); return; }
            loadFlashcardData();
            flashcards.push({
                id:          `cf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                groupId:     btn.dataset.groupId,
                word:        item.word,
                translation: item.translation,
                source:      'cajon',
                dateAdded:   new Date().toISOString(),
            });
            saveFlashcardData();
            picker.remove();
            showToast('✅ Tarjeta agregada al grupo');
            _showCajonPanel();
        });
    });

    const close = e => {
        if (!picker.contains(e.target) && e.target !== anchorBtn) {
            picker.remove();
            document.removeEventListener('click', close, true);
        }
    };
    setTimeout(() => document.addEventListener('click', close, true), 0);
}
