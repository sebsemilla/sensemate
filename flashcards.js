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

        document.getElementById('fcFinishBtn').addEventListener('click', () => showCustomGroupDetail(groupId));
    }

    render();
}

// ─── Publicar grupo como público (Premium/Oro) ──────────────────

async function _publishGroupAsPublic(groupId) {
    if (!MembershipPlan.isActive()) {
        _showUpgradeModal('flashcard_publish');
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

    try {
        const res = await _authFetch(`${_API_HOST}/flashcard-groups/submit`, {
            method: 'POST',
            body: JSON.stringify({
                title: group.name,
                color: group.color,
                notes: group.notes,
                cards: cards.map(c => ({ word: c.word, translation: c.translation, phonetic: c.phonetic, image: c.image })),
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
        showToast(data.autoApproved ? '✅ Grupo publicado' : '⏳ Grupo enviado — pendiente de revisión');
        showCustomGroupDetail(groupId);
    } catch {
        showToast('❌ Error de red al publicar el grupo');
    }
}
