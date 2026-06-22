// school.js — Modo Escuela: tutor de chat con IA
// ================================================

function loadSchoolMode() {
    const t = currentTranslations;
    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="school-panel">

            <!-- Header -->
            <div class="school-header">
                <button class="school-back-btn" id="schoolBackBtn">← Volver</button>
                <div class="school-header-title">
                    <span class="school-header-icon">${getAvatarContent(false)}</span>
                    <span>${t.modo_escuela || 'Modo Escuela'}</span>
                </div>
            </div>

            <!-- Toolbar: VOZ | SPEED | NIVEL -->
            <div class="school-toolbar">

                <!-- VOZ -->
                <button class="school-tb-btn" id="voiceBtn" data-on="false">
                    <span class="school-tb-icon" id="voiceIcon">🔇</span>
                    <span class="school-tb-label">VOZ</span>
                    <span class="school-tb-pill" id="voicePill">OFF</span>
                </button>

                <!-- SPEED -->
                <div class="school-speed-wrap" id="speedWrap">
                    <button class="school-tb-btn" id="speedBtn">
                        <span class="school-tb-icon">⚡</span>
                        <span class="school-tb-label">SPEED</span>
                        <span class="school-tb-pill" id="speedLabel">1×</span>
                    </button>
                    <div class="school-speed-panel hidden" id="speedPanel">
                        <button class="school-speed-opt" data-speed="0.5">0.5×</button>
                        <button class="school-speed-opt" data-speed="0.75">0.75×</button>
                        <button class="school-speed-opt active" data-speed="1">1×</button>
                        <button class="school-speed-opt" data-speed="1.25">1.25×</button>
                        <button class="school-speed-opt" data-speed="1.5">1.5×</button>
                    </div>
                </div>

                <!-- NIVEL -->
                <select class="school-level-select" id="levelSelect">
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1" selected>B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>

            </div>

            <!-- Chat -->
            <div class="school-chat" id="chatMessages"></div>

            <!-- Input -->
            <div class="school-input-wrap">
                <textarea class="school-textarea" id="userMessage" rows="2"
                          placeholder="${t.info_tip || 'Escribí tu mensaje... (Enter para enviar)'}"></textarea>
                <button class="school-send-btn" id="sendMessageBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>

            <!-- Acciones rápidas -->
            <div class="school-actions">
                <button class="school-action-btn" id="flashcardBtn">📇 Flashcard</button>
                <button class="school-action-btn" id="multimediaBtn">🎬 Multimedia</button>
                <button class="school-action-btn" id="grammarBtn">📝 Gramática</button>
            </div>

            <!-- Modal flashcard -->
            <div id="flashcardModal" class="modal hidden">
                <div class="modal-content flashcard-modal">
                    <span class="close-modal">&times;</span>
                    <h3>📇 ${t.new_flashcard_title || 'Nueva Flashcard'}</h3>
                    <label>${t.word_placeholder || 'Palabra'}</label>
                    <input type="text" id="flashcardWord" placeholder="Ej. serendipity">
                    <label>${t.opcion_traduccion || 'Traducción'}</label>
                    <input type="text" id="flashcardTranslation" placeholder="${t.ejemplo_traduccion || 'Ej. casualidad afortunada'}">
                    <label>${t.añade_comentarios || 'Comentarios'}</label>
                    <textarea id="flashcardComment" rows="3" placeholder="${t.comments_placeholder || 'Contexto, ejemplos...'}"></textarea>
                    <label>${t.etiquetas || 'Etiquetas'}</label>
                    <input type="text" id="flashcardTags" placeholder="${t.tags_placeholder || 'viajes, negocios...'}">
                    <div class="modal-buttons">
                        <button id="saveFlashcardBtn"   class="primary-btn">${t.guardar || 'Guardar'}</button>
                        <button id="cancelFlashcardBtn" class="secondary-btn">${t.cancelar || 'Cancelar'}</button>
                    </div>
                </div>
            </div>

        </div>
    `);

    // ── Refs ──────────────────────────────────────────────────
    const levelSelect    = document.getElementById('levelSelect');

    const chatDiv        = document.getElementById('chatMessages');
    const userMessageArea = document.getElementById('userMessage');
    const sendBtn        = document.getElementById('sendMessageBtn');
    const flashcardModal = document.getElementById('flashcardModal');
    const voiceBtn       = document.getElementById('voiceBtn');
    const voiceIcon      = document.getElementById('voiceIcon');
    const voicePill      = document.getElementById('voicePill');
    const speedBtn       = document.getElementById('speedBtn');
    const speedPanel     = document.getElementById('speedPanel');
    const speedLabel     = document.getElementById('speedLabel');
    const speedWrap      = document.getElementById('speedWrap');

    let voiceEnabled = false;
    let currentSpeed = 1.0;
    let conversationHistory = [];

    // ── VOZ toggle ────────────────────────────────────────────
    voiceBtn.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        voiceBtn.dataset.on   = voiceEnabled;
        voiceIcon.textContent = voiceEnabled ? '🔊' : '🔇';
        voicePill.textContent = voiceEnabled ? 'ON'  : 'OFF';
    });

    // ── SPEED dropdown ────────────────────────────────────────
    speedBtn.addEventListener('click', e => {
        e.stopPropagation();
        speedPanel.classList.toggle('hidden');
    });
    document.addEventListener('click', e => {
        if (!speedWrap.contains(e.target)) speedPanel.classList.add('hidden');
    });
    speedPanel.querySelectorAll('.school-speed-opt').forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            currentSpeed = parseFloat(opt.dataset.speed);
            speedLabel.textContent = opt.textContent;
            speedPanel.querySelectorAll('.school-speed-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            speedPanel.classList.add('hidden');
        });
    });

    // ── Mensajes ──────────────────────────────────────────────
    function addMessage(role, html) {
        const wrap = document.createElement('div');
        wrap.classList.add('school-msg-wrap', `school-msg-wrap--${role}`);

        if (role === 'assistant') {
            wrap.innerHTML = `
                <div class="school-msg-avatar">${getAvatarContent(false)}</div>
                <div class="school-msg-bubble school-msg-bubble--assistant">${html}</div>`;
        } else if (role === 'user') {
            wrap.innerHTML = `
                <div class="school-msg-bubble school-msg-bubble--user">${html}</div>`;
        } else {
            wrap.innerHTML = `<div class="school-msg-system">${html}</div>`;
        }

        chatDiv.appendChild(wrap);
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }

    function addThinking() {
        const wrap = document.createElement('div');
        wrap.classList.add('school-msg-wrap', 'school-msg-wrap--assistant', 'school-msg-thinking');
        wrap.innerHTML = `
            <div class="school-msg-avatar">${getAvatarContent(true)}</div>
            <div class="school-msg-bubble school-msg-bubble--assistant">
                <span class="school-dots">
                    <span></span><span></span><span></span>
                </span>
            </div>`;
        chatDiv.appendChild(wrap);
        chatDiv.scrollTop = chatDiv.scrollHeight;
        return wrap;
    }

    function speakText(text) {
        if (!voiceEnabled || !text?.trim()) return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate  = currentSpeed;
        const langMap = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', de: 'de-DE', it: 'it-IT' };
        u.lang  = langMap[targetLang] || 'es-ES';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }

    // Bienvenida
    addMessage('assistant', '¡Hola! Soy tu tutor de idiomas. Podés hablarme en el idioma que estás aprendiendo o pedirme ejercicios, correcciones y explicaciones. ¿Por dónde empezamos?');

    // ── Enviar mensaje ────────────────────────────────────────
    async function sendMessage() {
        const userText = userMessageArea.value.trim();
        if (!userText) return;
        userMessageArea.value = '';
        userMessageArea.style.height = '';
        addMessage('user', userText);
        conversationHistory.push({ role: 'user', content: userText });

        const thinkingEl = addThinking();

        try {
            const res = await fetch(_API_HOST + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages:   conversationHistory,
                    level:      levelSelect.value,
                    targetLang: targetLang
                })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            thinkingEl.remove();
            addMessage('assistant', data.reply);
            speakText(data.reply);
            conversationHistory.push({ role: 'assistant', content: data.reply });
        } catch (err) {
            thinkingEl.remove();
            addMessage('system', `❌ Error: ${err.message}`);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userMessageArea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Auto-resize textarea
    userMessageArea.addEventListener('input', () => {
        userMessageArea.style.height = 'auto';
        userMessageArea.style.height = Math.min(userMessageArea.scrollHeight, 120) + 'px';
    });

    // ── Volver ────────────────────────────────────────────────
    document.getElementById('schoolBackBtn').addEventListener('click', showMainMenu);

    // ── Acciones ──────────────────────────────────────────────
    const closeModal = () => {
        flashcardModal.classList.add('hidden');
        ['flashcardWord','flashcardTranslation','flashcardComment','flashcardTags']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    };

    document.getElementById('flashcardBtn').addEventListener('click', () => flashcardModal.classList.remove('hidden'));
    document.getElementById('cancelFlashcardBtn').addEventListener('click', closeModal);
    flashcardModal.querySelector('.close-modal').addEventListener('click', closeModal);
    flashcardModal.addEventListener('click', e => { if (e.target === flashcardModal) closeModal(); });

    document.getElementById('saveFlashcardBtn').addEventListener('click', () => {
        if (!requireAuthForAction('guardar esta flashcard')) return;
        const word        = document.getElementById('flashcardWord').value.trim();
        const translation = document.getElementById('flashcardTranslation').value.trim();
        if (!word || !translation) { alert('Completá palabra y traducción.'); return; }
        const saved = JSON.parse(localStorage.getItem('flashcards') || '[]');
        saved.push({
            id:          Date.now() + '-' + Math.random(),
            word, translation,
            comment:     document.getElementById('flashcardComment').value.trim(),
            tags:        document.getElementById('flashcardTags').value.trim(),
            dateAdded:   new Date().toISOString()
        });
        localStorage.setItem('flashcards', JSON.stringify(saved));
        showToast('✅ Flashcard guardada.');
        closeModal();
    });

    document.getElementById('multimediaBtn').addEventListener('click', () => showToast('🎬 Multimedia en desarrollo.'));
    document.getElementById('grammarBtn').addEventListener('click',    () => showToast('📝 Gramática en construcción.'));
}
