// famous.js — Sección Famosos: chat con personajes históricos
// ============================================================
// Imágenes: crear carpeta /images/famous/ y agregar archivos
// con el nombre de la clave: mlk.jpg, marilyn.jpg, etc.
// Si no existe la imagen, el card usa degradé + emoji de fallback.

const FAMOUS_PEOPLE = {
    mlk:         { nombre: 'Martin Luther King Jr.', gender: 'male',   emoji: '🕊️', color: '#1e3a5f' },
    marilyn:     { nombre: 'Marilyn Monroe',          gender: 'female', emoji: '💋', color: '#6b2d5e' },
    maradona:    { nombre: 'Diego Maradona',          gender: 'male',   emoji: '⚽', color: '#1a4731' },
    einstein:    { nombre: 'Albert Einstein',         gender: 'male',   emoji: '🧠', color: '#3d2b1f' },
    cleopatra:   { nombre: 'Cleopatra',               gender: 'female', emoji: '👑', color: '#4a3000' },
    frida:       { nombre: 'Frida Kahlo',             gender: 'female', emoji: '🎨', color: '#5c1a1a' },
    mandela:     { nombre: 'Nelson Mandela',          gender: 'male',   emoji: '✊', color: '#1a3300' },
    shakespeare: { nombre: 'William Shakespeare',     gender: 'male',   emoji: '📜', color: '#2c1a3e' },
};

// Modos de conversación (a desarrollar)
const CONVERSATION_MODES = [
    { id: 'free',       label: '🗣️ Conversación libre',     wip: false },
    { id: 'vocabulary', label: '📚 Enséñame vocabulario',   wip: true  },
    { id: 'correct',    label: '✏️ Corregir mis errores',   wip: true  },
    { id: 'historical', label: '🕰️ Contexto histórico',     wip: true  },
];

// ─── Helper: genera el HTML de una card de famoso ─────────────

function _famousCardHTML(key, descHTML = '', extraClass = '') {
    const p   = FAMOUS_PEOPLE[key];
    const img = `/images/famous/${key}.jpg`;
    return `
        <div class="famous-card ${extraClass}" data-person="${key}"
             style="--fcard-color:${p.color}; --fcard-img:url('${img}')">
            <div class="famous-card-img"></div>
            <div class="famous-card-overlay"></div>
            <div class="famous-card-body">
                <div class="famous-card-emoji">${p.emoji}</div>
                <div class="famous-card-name">${p.nombre}</div>
                ${descHTML ? `<div class="famous-card-desc">${descHTML}</div>` : ''}
            </div>
        </div>`;
}

// ─── Lista completa de famosos ────────────────────────────────


// ─── Carrusel del menú principal ─────────────────────────────

function initFamousCarousel(section) {
    if (!section) return;

    const trackWrap = section.querySelector('.fc-track-wrap');
    const prevBtn   = section.querySelector('.fc-arrow--left');
    const nextBtn   = section.querySelector('.fc-arrow--right');
    const cards     = Array.from(section.querySelectorAll('.fc-card'));
    const total     = cards.length;
    if (!total) return;

    let activeIdx = 1; // Empezar en el segundo card (centro visual)

    function update() {
        cards.forEach((card, i) => {
            const offset = i - activeIdx;
            const abs    = Math.abs(offset);
            const dir    = offset >= 0 ? 1 : -1;

            card.style.setProperty('--fc-dir', dir);
            card.classList.remove('fc-active', 'fc-adj', 'fc-far');

            if (abs === 0)      card.classList.add('fc-active');
            else if (abs === 1) card.classList.add('fc-adj');
            else                card.classList.add('fc-far');
        });

        prevBtn.style.opacity = activeIdx === 0         ? '0.3' : '1';
        nextBtn.style.opacity = activeIdx === total - 1 ? '0.3' : '1';
    }

    // Flechas
    prevBtn.addEventListener('click', () => { if (activeIdx > 0) { activeIdx--; update(); } });
    nextBtn.addEventListener('click', () => { if (activeIdx < total - 1) { activeIdx++; update(); } });

    // Swipe touch
    let touchStartX = 0, touchStartY = 0;
    trackWrap.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    trackWrap.addEventListener('touchend', e => {
        const dx = touchStartX - e.changedTouches[0].clientX;
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 35) return;
        if (dx > 0 && activeIdx < total - 1) activeIdx++;
        else if (dx < 0 && activeIdx > 0)    activeIdx--;
        update();
    }, { passive: true });

    // Drag mouse
    let dragStartX = 0, isDragging = false;
    trackWrap.addEventListener('mousedown', e => {
        dragStartX = e.clientX; isDragging = true;
        trackWrap.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        trackWrap.style.cursor = 'grab';
        const dx = dragStartX - e.clientX;
        if (Math.abs(dx) < 35) return;
        if (dx > 0 && activeIdx < total - 1) activeIdx++;
        else if (dx < 0 && activeIdx > 0)    activeIdx--;
        update();
    });

    // Click: navegar si no es activa, abrir chat si es activa
    cards.forEach((card, i) => {
        card.addEventListener('click', e => {
            if (Math.abs(dragStartX - e.clientX) > 10) return;
            if (i !== activeIdx) {
                activeIdx = i; update();
            } else {
                const person = card.dataset.person;
                if (person === 'more') requireAuth('Chat con Famosos', loadFamousList);
                else if (person)       requireAuth('Chat con Famosos', () => loadFamousChat(person));
            }
        });
    });

    // Imagen fallback
    _bindFamousCardImgFallback();

    // Init sin animacion
    section.querySelectorAll('.fc-card').forEach(c => c.classList.add('fc-no-transition'));
    update();
    requestAnimationFrame(() => {
        section.querySelectorAll('.fc-card').forEach(c => c.classList.remove('fc-no-transition'));
    });
}

function loadFamousList() {
    mainContainer.innerHTML = '';
    renderLanguageBar();
    const t = currentTranslations;

    const lista = ['einstein', 'cleopatra', 'frida', 'mandela', 'shakespeare', 'mlk', 'marilyn', 'maradona'];

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="famous-list-wrap">
            <div class="famous-list-header">
                <button class="school-back-btn" id="backToMainFromFamousList">← ${t.volver || 'Volver'}</button>
                <h2>🌟 ${t.elige_famosos || 'Elegí con quién hablar'}</h2>
            </div>
            <div class="famous-grid-full">
                ${lista.map(key => {
                    const desc = t[`${key}_descripcion`] || '';
                    return _famousCardHTML(key, desc);
                }).join('')}
            </div>
        </div>
    `);

    document.getElementById('backToMainFromFamousList').addEventListener('click', showMainMenu);
    document.querySelectorAll('.famous-card[data-person]').forEach(card => {
        card.addEventListener('click', () => loadFamousChat(card.dataset.person));
    });

    // Ocultar emoji si la imagen carga bien
    _bindFamousCardImgFallback();
}

// Manejo de fallback de imagen para todas las cards renderizadas
function _bindFamousCardImgFallback() {
    document.querySelectorAll('.famous-card').forEach(card => {
        const key = card.dataset.person;
        if (!key) return;
        const img = new Image();
        img.onload  = () => card.classList.add('famous-card--hasimg');
        img.onerror = () => card.classList.add('famous-card--noimg');
        img.src = `/images/famous/${key}.jpg`;
    });
}

// ─── Función exportada para main menu (app.js puede llamarla) ─

function renderFamousMenuCards(keys, t) {
    return keys.map(key => {
        const desc = t[`${key}_descripcion`] || '';
        return _famousCardHTML(key, desc, 'fc-card');
    }).join('');
}

// ─── Chat con famoso ──────────────────────────────────────────

function loadFamousChat(person) {
    const t    = currentTranslations;
    const data = FAMOUS_PEOPLE[person] || { nombre: 'Personaje famoso', gender: 'male', emoji: '🌟', color: '#333' };
    const { nombre, emoji } = data;
    const imgSrc = `/images/famous/${person}.jpg`;

    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="school-panel famous-chat-panel">

            <!-- Header con avatar del personaje -->
            <div class="famous-chat-header" style="--fcard-color:${data.color}; --fcard-img:url('${imgSrc}')">
                <div class="famous-chat-header-bg"></div>
                <div class="famous-chat-header-content">
                    <button class="school-back-btn famous-back-btn" id="famousBackBtn">← ${t.volver || 'Volver'}</button>
                    <div class="famous-chat-identity">
                        <div class="famous-chat-avatar" id="famousChatAvatar">${emoji}</div>
                        <div class="famous-chat-name">${nombre}</div>
                    </div>
                </div>
            </div>

            <!-- Toolbar: VOZ | SPEED | MODO -->
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

                <!-- MODO -->
                <div class="school-speed-wrap" id="modoWrap">
                    <button class="school-tb-btn" id="modoBtn">
                        <span class="school-tb-icon">💬</span>
                        <span class="school-tb-label">MODO</span>
                        <span class="school-tb-pill" id="modoLabel">Libre</span>
                    </button>
                    <div class="school-speed-panel famous-modo-panel hidden" id="modoPanel">
                        ${CONVERSATION_MODES.map(m => `
                            <button class="school-speed-opt ${m.id === 'free' ? 'active' : ''} ${m.wip ? 'famous-mode-wip' : ''}"
                                    data-mode="${m.id}">
                                ${m.label}
                                ${m.wip ? '<span class="famous-wip-badge">Próximo</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>

            </div>

            <!-- Chat -->
            <div class="school-chat" id="famousChatMessages"></div>

            <!-- Input -->
            <div class="school-input-wrap">
                <textarea class="school-textarea" id="famousUserMessage" rows="2"
                          placeholder="${t.info_tip || 'Escribí tu mensaje...'}"></textarea>
                <button class="school-send-btn" id="sendFamousBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>

        </div>
    `);

    // Fallback avatar si la imagen carga
    const avatarEl = document.getElementById('famousChatAvatar');
    const testImg  = new Image();
    testImg.onload = () => {
        const header = document.querySelector('.famous-chat-panel .famous-chat-header');
        if (header) header.classList.add('famous-chat-header--hasimg');
        avatarEl.style.backgroundImage = `url('${imgSrc}')`;
        avatarEl.classList.add('famous-chat-avatar--img');
        avatarEl.textContent = '';
    };
    testImg.src = imgSrc;

    // ── Refs ──────────────────────────────────────────────────
    const chatDiv      = document.getElementById('famousChatMessages');
    const userArea     = document.getElementById('famousUserMessage');
    const sendBtn      = document.getElementById('sendFamousBtn');
    const voiceBtn     = document.getElementById('voiceBtn');
    const voiceIcon    = document.getElementById('voiceIcon');
    const voicePill    = document.getElementById('voicePill');
    const speedBtn     = document.getElementById('speedBtn');
    const speedPanel   = document.getElementById('speedPanel');
    const speedLabel   = document.getElementById('speedLabel');
    const speedWrap    = document.getElementById('speedWrap');
    const modoBtn      = document.getElementById('modoBtn');
    const modoPanel    = document.getElementById('modoPanel');
    const modoLabel    = document.getElementById('modoLabel');
    const modoWrap     = document.getElementById('modoWrap');

    let voiceEnabled = false;
    let currentSpeed = 1.0;
    let currentMode  = 'free';
    let conversationHistory = [];

    // ── VOZ toggle ────────────────────────────────────────────
    voiceBtn.addEventListener('click', () => {
        voiceEnabled          = !voiceEnabled;
        voiceBtn.dataset.on   = voiceEnabled;
        voiceIcon.textContent = voiceEnabled ? '🔊' : '🔇';
        voicePill.textContent = voiceEnabled ? 'ON'  : 'OFF';
    });

    // ── SPEED dropdown ────────────────────────────────────────
    speedBtn.addEventListener('click', e => {
        e.stopPropagation();
        speedPanel.classList.toggle('hidden');
        modoPanel.classList.add('hidden');
    });
    speedPanel.querySelectorAll('.school-speed-opt').forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            currentSpeed = parseFloat(opt.dataset.speed);
            speedLabel.textContent = opt.textContent.trim();
            speedPanel.querySelectorAll('.school-speed-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            speedPanel.classList.add('hidden');
        });
    });

    // ── MODO dropdown ─────────────────────────────────────────
    modoBtn.addEventListener('click', e => {
        e.stopPropagation();
        modoPanel.classList.toggle('hidden');
        speedPanel.classList.add('hidden');
    });
    modoPanel.querySelectorAll('.school-speed-opt').forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            const mode = opt.dataset.mode;
            if (mode !== 'free') {
                showToast('🚧 Modo en desarrollo. ¡Próximamente!');
                modoPanel.classList.add('hidden');
                return;
            }
            currentMode = mode;
            // Label: solo el texto sin el badge WIP
            modoLabel.textContent = opt.textContent.split('\n')[0].trim().split('  ')[0].trim();
            modoPanel.querySelectorAll('.school-speed-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            modoPanel.classList.add('hidden');
        });
    });

    // Cerrar dropdowns al click fuera
    document.addEventListener('click', e => {
        if (!speedWrap.contains(e.target)) speedPanel.classList.add('hidden');
        if (!modoWrap.contains(e.target))  modoPanel.classList.add('hidden');
    });

    // ── Mensajes ──────────────────────────────────────────────
    // translation: texto traducido al idioma del usuario (opcional)
    function addMessage(role, html, translation = null) {
        const wrap = document.createElement('div');
        wrap.classList.add('school-msg-wrap', `school-msg-wrap--${role}`);

        if (role === 'assistant') {
            const hasImg    = avatarEl.classList.contains('famous-chat-avatar--img');
            const transHTML = translation
                ? `<div class="famous-bubble-translation">🌐 ${translation}</div>`
                : '';
            wrap.innerHTML = `
                <div class="school-msg-avatar famous-msg-avatar"
                     style="${hasImg ? `background-image:url('${imgSrc}'); background-size:cover; background-position:center top; font-size:0` : ''}">
                    ${hasImg ? '' : emoji}
                </div>
                <div class="school-msg-bubble school-msg-bubble--assistant">
                    <div class="famous-bubble-original">${html}</div>
                    ${transHTML}
                </div>`;
        } else if (role === 'user') {
            wrap.innerHTML = `<div class="school-msg-bubble school-msg-bubble--user">${html}</div>`;
        } else {
            wrap.innerHTML = `<div class="school-msg-system">${html}</div>`;
        }

        chatDiv.appendChild(wrap);
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }

    function addThinking() {
        const wrap = document.createElement('div');
        wrap.classList.add('school-msg-wrap', 'school-msg-wrap--assistant');
        wrap.innerHTML = `
            <div class="school-msg-avatar famous-msg-avatar">${emoji}</div>
            <div class="school-msg-bubble school-msg-bubble--assistant">
                <span class="school-dots"><span></span><span></span><span></span></span>
            </div>`;
        chatDiv.appendChild(wrap);
        chatDiv.scrollTop = chatDiv.scrollHeight;
        return wrap;
    }

    async function speakText(text) {
        if (!voiceEnabled || !text?.trim()) return;
        try {
            const res = await fetch('http://localhost:3000/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, persona: person })
            });
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            const audio = new Audio(URL.createObjectURL(blob));
            audio.playbackRate = currentSpeed;
            audio.play();
        } catch {
            // Fallback Web Speech
            const u   = new SpeechSynthesisUtterance(text);
            u.rate    = currentSpeed;
            const map = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', de: 'de-DE', it: 'it-IT' };
            u.lang    = map[targetLang] || 'es-ES';
            const voices = window.speechSynthesis.getVoices();
            const voice  = voices.find(v => v.lang === u.lang) || voices[0];
            if (voice) u.voice = voice;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
        }
    }

    // ── Bienvenida ────────────────────────────────────────────
    const welcomeMap = {
        mlk:         t.mlk_intro,
        marilyn:     t.marilyn_intro,
        maradona:    t.maradona_intro,
        einstein:    t.einstein_intro,
        cleopatra:   t.cleopatra_intro,
        frida:       t.frida_intro,
        mandela:     t.mandela_intro,
        shakespeare: t.shakespeare_intro
    };
    const welcome = welcomeMap[person] || `¡Hola! Soy ${nombre}. ¿De qué quieres hablar?`;
    // El intro ya está en el idioma nativo del personaje.
    // Pedir traducción al servidor si el idioma del usuario difiere.
    addMessage('assistant', welcome);
    conversationHistory.push({ role: 'assistant', content: welcome });
    // Traducir el intro si hay targetLang definido
    if (targetLang) {
        fetch('http://localhost:3000/famous-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                person,
                messages: [{ role: 'user', content: '__translate_intro__' }],
                targetLang
            })
        }).then(r => r.json()).then(data => {
            // Agregar la traducción del intro al primer mensaje
            const firstBubble = chatDiv.querySelector('.famous-bubble-original');
            if (firstBubble && data.translation) {
                const transEl = document.createElement('div');
                transEl.className = 'famous-bubble-translation';
                transEl.textContent = '🌐 ' + data.translation;
                firstBubble.insertAdjacentElement('afterend', transEl);
            }
        }).catch(() => {}); // Si falla, sin traducción en el intro
    }

    // ── Enviar mensaje ────────────────────────────────────────
    async function sendMessage() {
        const userText = userArea.value.trim();
        if (!userText) return;
        userArea.value = '';
        userArea.style.height = '';
        addMessage('user', userText);
        conversationHistory.push({ role: 'user', content: userText });
        if (typeof gtag       === 'function') gtag('event', 'famous_chat_message', { person });
        if (typeof misionTrack === 'function') misionTrack('chat');

        const thinking = addThinking();

        try {
            const res = await fetch('http://localhost:3000/famous-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ person, messages: conversationHistory, targetLang })
            });
            if (!res.ok) throw new Error('Error en el servidor');
            const resp = await res.json();
            thinking.remove();
            addMessage('assistant', resp.reply, resp.translation || null);
            speakText(resp.reply);
            conversationHistory.push({ role: 'assistant', content: resp.reply });
        } catch (err) {
            thinking.remove();
            addMessage('system', `❌ Error: ${err.message}`);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userArea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    userArea.addEventListener('input', () => {
        userArea.style.height = 'auto';
        userArea.style.height = Math.min(userArea.scrollHeight, 120) + 'px';
    });

    document.getElementById('famousBackBtn').addEventListener('click', loadFamousList);
}
