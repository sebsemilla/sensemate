// onboarding.js — Slides de introducción + formularios de auth
// =============================================================

const OB_SLIDES = [
    {
        icon: '🌐',
        title: 'Traducción con contexto real',
        desc: 'Obtené traducciones formales, informales y neutras al instante. No solo palabras — significado completo.',
        accent: '#6366f1'
    },
    {
        icon: '📚',
        title: 'Aprendé a tu ritmo',
        desc: 'Flashcards, historias por nivel y modo práctica. Tu progreso siempre guardado, donde lo dejaste.',
        accent: '#10b981'
    },
    {
        icon: '🎭',
        title: 'Hablá con la historia',
        desc: 'Conversá con Einstein, Frida Kahlo, Maradona y más. Un tutor IA te corrige en tiempo real.',
        accent: '#f59e0b'
    }
];

const OB_LANGUAGES = [
    { code: 'en', flag: '🇬🇧', name: 'Inglés' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Francés' },
    { code: 'de', flag: '🇩🇪', name: 'Alemán' },
    { code: 'pt', flag: '🇧🇷', name: 'Portugués' },
    { code: 'it', flag: '🇮🇹', name: 'Italiano' },
    { code: 'zh', flag: '🇨🇳', name: 'Chino' },
    { code: 'ja', flag: '🇯🇵', name: 'Japonés' },
];

// --- Estado del módulo ---
let _obSlide = 0;
let _obMode  = 'slides'; // 'slides' | 'auth'
let _obTab   = 'login';  // 'login'  | 'register'
let _obStep  = 1;        // paso dentro del registro: 1 | 2
let _regTemp = {};       // datos temporales entre pasos del registro

// --- Punto de entrada ---

function showOnboarding(forceAuth = false) {
    _obSlide = 0;
    _obMode  = (forceAuth || authHasSeenOnboarding()) ? 'auth' : 'slides';
    _obTab   = 'login';
    _obStep  = 1;

    let overlay = document.getElementById('obOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'obOverlay';
        overlay.className = 'ob-overlay';
        document.body.appendChild(overlay);
    }
    _obRender(overlay);
}

// --- Renderizado principal ---

function _obRender(overlay) {
    if (_obMode === 'slides') _renderSlides(overlay);
    else                      _renderAuth(overlay);
}

// --- SLIDES ---

function _renderSlides(overlay) {
    const s    = OB_SLIDES[_obSlide];
    const last = _obSlide === OB_SLIDES.length - 1;

    overlay.innerHTML = `
        <div class="ob-slides-wrap">
            <button class="ob-skip-btn" id="obSkipBtn">Saltar →</button>

            <div class="ob-logo">
                <span>📖</span>
                <span class="ob-logo-text">SenseMate</span>
            </div>

            <div class="ob-slide-body">
                <div class="ob-slide-icon" style="background:${s.accent}22; color:${s.accent}">
                    ${s.icon}
                </div>
                <h2 class="ob-slide-title">${s.title}</h2>
                <p class="ob-slide-desc">${s.desc}</p>
            </div>

            <div class="ob-slide-footer">
                <div class="ob-dots">
                    ${OB_SLIDES.map((_, i) => `
                        <div class="ob-dot ${i === _obSlide ? 'active' : ''}" data-i="${i}"></div>
                    `).join('')}
                </div>
                <button class="ob-next-btn" id="obNextBtn" style="background:${s.accent}">
                    ${last ? '¡Empezar!' : 'Siguiente →'}
                </button>
            </div>
        </div>
    `;

    document.getElementById('obNextBtn').addEventListener('click', () => {
        if (last) {
            authMarkOnboardingSeen();
            _obMode = 'auth';
            _obRender(overlay);
        } else {
            _obSlide++;
            _obRender(overlay);
        }
    });

    document.getElementById('obSkipBtn').addEventListener('click', () => {
        authMarkOnboardingSeen();
        _obMode = 'auth';
        _obRender(overlay);
    });

    overlay.querySelectorAll('.ob-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            _obSlide = parseInt(dot.dataset.i);
            _obRender(overlay);
        });
    });

    // ── Swipe gesture for mobile ──────────────────────────────
    let _swipeStartX = null;
    const slideBody = overlay.querySelector('.ob-slides-wrap');
    slideBody.addEventListener('touchstart', e => {
        _swipeStartX = e.touches[0].clientX;
    }, { passive: true });
    slideBody.addEventListener('touchend', e => {
        if (_swipeStartX === null) return;
        const dx = e.changedTouches[0].clientX - _swipeStartX;
        _swipeStartX = null;
        if (Math.abs(dx) < 40) return; // ignore tiny taps
        if (dx < 0) {
            // swipe left → next
            if (last) { authMarkOnboardingSeen(); _obMode = 'auth'; _obRender(overlay); }
            else { _obSlide++; _obRender(overlay); }
        } else {
            // swipe right → prev
            if (_obSlide > 0) { _obSlide--; _obRender(overlay); }
        }
    }, { passive: true });
}

// --- AUTH (login / registro) ---

function _renderAuth(overlay) {
    overlay.innerHTML = `
        <div class="ob-auth-wrap">
            <div class="ob-auth-card">
                <div class="ob-logo" style="justify-content:center; margin-bottom:1.5rem;">
                    <span>📖</span>
                    <span class="ob-logo-text">SenseMate</span>
                </div>

                <div class="ob-tabs">
                    <button class="ob-tab ${_obTab === 'login'    ? 'active' : ''}" id="obTabLogin">Acceder</button>
                    <button class="ob-tab ${_obTab === 'register' ? 'active' : ''}" id="obTabReg">Registrarse</button>
                </div>

                <div id="obFormArea">
                    ${_obTab === 'login' ? _loginFormHTML() : _registerFormHTML()}
                </div>

                <button class="ob-ghost-btn" id="obGuestBtn">
                    Continuar sin cuenta →
                </button>
            </div>
        </div>
    `;

    document.getElementById('obTabLogin').addEventListener('click', () => {
        _obTab = 'login'; _obRender(overlay);
    });
    document.getElementById('obTabReg').addEventListener('click', () => {
        _obTab = 'register'; _obStep = 1; _obRender(overlay);
    });
    document.getElementById('obGuestBtn').addEventListener('click', () => {
        _obClose(null);
    });

    if (_obTab === 'login') _bindLogin();
    else                    _bindRegister();

    // Inicializar Google One Tap (con retry si el script async aún no cargó)
    if (window.google?.accounts?.id) {
        _initGoogleOneTap();
    } else {
        let _gAttempts = 0;
        const _waitGoogle = () => {
            if (window.google?.accounts?.id) { _initGoogleOneTap(); return; }
            if (++_gAttempts < 50) {
                setTimeout(_waitGoogle, 300);
            } else {
                // Google no cargó (conexión lenta o bloqueado) — ocultar el divider
                const wrap = document.getElementById('obGoogleBtnWrap');
                if (wrap) wrap.closest('.ob-form')?.querySelector('.ob-divider')?.remove();
                if (wrap) wrap.remove();
            }
        };
        setTimeout(_waitGoogle, 300);
    }
}

// --- Formulario: Login ---

function _loginFormHTML() {
    return `
        <div class="ob-form">
            <div class="ob-field">
                <label>Email o nombre de usuario</label>
                <input type="text" id="obLEmail" placeholder="tu@email.com o tu_usuario" autocomplete="username">
            </div>
            <div class="ob-field">
                <label>Contraseña</label>
                <div class="ob-pwd-wrap">
                    <input type="password" id="obLPwd" placeholder="••••••••" autocomplete="current-password">
                    <button class="ob-eye" id="obLEye" type="button">👁</button>
                </div>
            </div>
            <div class="ob-error hidden" id="obLErr"></div>
            <button class="ob-submit-btn" id="obLoginBtn">Entrar</button>
            <button class="ob-forgot-link" id="obForgotLink" type="button">¿Olvidaste tu contraseña?</button>
            <div class="ob-divider"><span>o</span></div>
            <div id="obGoogleBtnWrap" class="ob-google-wrap"></div>
        </div>
    `;
}

function _bindLogin() {
    document.getElementById('obLEye').addEventListener('click', () => {
        const i = document.getElementById('obLPwd');
        i.type = i.type === 'password' ? 'text' : 'password';
    });

    const doLogin = async () => {
        const email  = document.getElementById('obLEmail').value.trim();
        const pwd    = document.getElementById('obLPwd').value;
        const err    = document.getElementById('obLErr');
        const btn    = document.getElementById('obLoginBtn');
        if (!email || !pwd) return _obErr(err, 'Completá todos los campos.');
        btn.disabled    = true;
        btn.textContent = 'Iniciando…';
        const res = await authLogin({ email, password: pwd });
        btn.disabled    = false;
        btn.textContent = 'Entrar';
        if (!res.ok) return _obErr(err, res.error);
        if (typeof gtag === 'function') gtag('event', 'login', { method: 'email' });
        _obClose(res.user);
    };

    document.getElementById('obLoginBtn').addEventListener('click', doLogin);
    document.getElementById('obLPwd').addEventListener('keydown', e => {
        if (e.key === 'Enter') doLogin();
    });
    document.getElementById('obForgotLink').addEventListener('click', () => {
        document.getElementById('obFormArea').innerHTML = _forgotFormHTML();
        _bindForgot();
    });
}

async function _handleGoogleCredential({ credential }) {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;
    try {
        const res  = await fetch(`${API_BASE}/auth/google`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ credential })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        authSetSession(data.token, data.user);
        const overlay = document.getElementById('obOverlay') || document.getElementById('resetOverlay');
        if (overlay) {
            overlay.classList.add('ob-fade-out');
            setTimeout(() => {
                overlay.remove();
                if (typeof window.onOnboardingComplete === 'function') window.onOnboardingComplete(data.user);
            }, 300);
        } else if (typeof window.onOnboardingComplete === 'function') {
            window.onOnboardingComplete(data.user);
        }
    } catch (e) {
        alert('Error con Google Sign-In: ' + e.message);
    }
}

function _initGoogleOneTap() {
    const clientId = window._GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
        client_id:   clientId,
        callback:    _handleGoogleCredential,
        auto_select: false,
    });

    // Renderizar botón oficial de Google en el placeholder
    const wrap = document.getElementById('obGoogleBtnWrap');
    if (wrap) {
        window.google.accounts.id.renderButton(wrap, {
            theme:  'outline',
            size:   'large',
            text:   'continue_with',
            width:  wrap.offsetWidth || 300,
            locale: 'es',
        });
    }
}

// --- Formulario: Registro (2 pasos) ---

function _registerFormHTML() {
    if (_obStep === 1) {
        return `
            <div class="ob-form">
                <div class="ob-step-label">Paso 1 de 2</div>
                <div class="ob-field">
                    <label>Nombre de usuario <span class="ob-optional-tag">opcional</span></label>
                    <input type="text" id="obRUsername" placeholder="ej: maria_learns_en" autocomplete="username"
                        value="${_regTemp.username || ''}"
                        pattern="[a-zA-Z0-9_]{3,30}" title="Solo letras, números y guion bajo (3–30 caracteres)">
                </div>
                <div class="ob-field">
                    <label>Tu nombre</label>
                    <input type="text" id="obRName" placeholder="¿Cómo te llamás?" autocomplete="name">
                </div>
                <div class="ob-field">
                    <label>Email</label>
                    <input type="email" id="obREmail" placeholder="tu@email.com" autocomplete="email">
                </div>
                <div class="ob-field">
                    <label>Contraseña</label>
                    <div class="ob-pwd-wrap">
                        <input type="password" id="obRPwd" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
                        <button class="ob-eye" id="obREye" type="button">👁</button>
                    </div>
                </div>
                <div class="ob-error hidden" id="obRErr"></div>
                <button class="ob-submit-btn" id="obRNextBtn">Siguiente →</button>
            </div>
        `;
    } else {
        return `
            <div class="ob-form">
                <div class="ob-step-label">Paso 2 de 2 — ¿Qué idioma querés aprender?</div>
                <div class="ob-lang-grid" id="obLangGrid">
                    ${OB_LANGUAGES.map(l => `
                        <div class="ob-lang-opt" data-code="${l.code}">
                            <span class="ob-lang-flag">${l.flag}</span>
                            <span class="ob-lang-name">${l.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="ob-error hidden" id="obRErr2"></div>
                <div class="ob-two-btns">
                    <button class="ob-back-btn" id="obRBackBtn">← Atrás</button>
                    <button class="ob-submit-btn" id="obRFinalBtn">¡Crear cuenta!</button>
                </div>
            </div>
        `;
    }
}

function _bindRegister() {
    if (_obStep === 1) {
        document.getElementById('obREye').addEventListener('click', () => {
            const i = document.getElementById('obRPwd');
            i.type = i.type === 'password' ? 'text' : 'password';
        });

        document.getElementById('obRNextBtn').addEventListener('click', () => {
            const username = document.getElementById('obRUsername').value.trim();
            const name     = document.getElementById('obRName').value.trim();
            const email    = document.getElementById('obREmail').value.trim();
            const pwd      = document.getElementById('obRPwd').value;
            const err      = document.getElementById('obRErr');

            if (!name || !email || !pwd)       return _obErr(err, 'Completá nombre, email y contraseña.');
            if (pwd.length < 6)                return _obErr(err, 'La contraseña debe tener al menos 6 caracteres.');
            if (!/\S+@\S+\.\S+/.test(email))   return _obErr(err, 'Email inválido.');
            if (username && !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
                return _obErr(err, 'El usuario solo puede tener letras, números y guion bajo (3–30 caracteres).');
            }

            _regTemp = { name, username, email, password: pwd };
            _obStep = 2;
            document.getElementById('obFormArea').innerHTML = _registerFormHTML();
            _bindRegister();
        });

    } else {
        let selectedLang = null;

        document.querySelectorAll('.ob-lang-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.ob-lang-opt').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedLang = opt.dataset.code;
            });
        });

        document.getElementById('obRBackBtn').addEventListener('click', () => {
            _obStep = 1;
            document.getElementById('obFormArea').innerHTML = _registerFormHTML();
            _bindRegister();
            // Restaurar datos del paso 1
            document.getElementById('obRUsername').value = _regTemp.username || '';
            document.getElementById('obRName').value     = _regTemp.name     || '';
            document.getElementById('obREmail').value    = _regTemp.email    || '';
        });

        document.getElementById('obRFinalBtn').addEventListener('click', async () => {
            const err = document.getElementById('obRErr2');
            const btn = document.getElementById('obRFinalBtn');
            if (!selectedLang) return _obErr(err, 'Elegí un idioma para continuar.');
            btn.disabled    = true;
            btn.textContent = 'Creando cuenta…';
            const res = await authRegister({ ..._regTemp, preferredLang: selectedLang });
            btn.disabled    = false;
            btn.textContent = 'Comenzar';
            if (!res.ok) return _obErr(err, res.error);
            if (typeof gtag === 'function') gtag('event', 'sign_up', { method: 'email' });
            _obClose({ ...res.user, isNew: true });
        });
    }
}

// --- Utilidades internas ---

function _obErr(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
    el.classList.add('ob-shake');
    setTimeout(() => el.classList.remove('ob-shake'), 400);
}

function _obClose(user) {
    const overlay = document.getElementById('obOverlay');
    if (!overlay) return;
    overlay.classList.add('ob-fade-out');
    setTimeout(() => {
        overlay.remove();
        // Llamar al callback definido en app.js
        if (typeof window.onOnboardingComplete === 'function') {
            window.onOnboardingComplete(user);
        }
    }, 300);
}

// --- Olvidé mi contraseña ---

function _forgotFormHTML() {
    return `
        <div class="ob-form">
            <div class="ob-forgot-back">
                <button class="ob-forgot-link" id="obForgotBackBtn" type="button">← Volver al login</button>
            </div>
            <p class="ob-forgot-desc">Ingresá tu email y te enviamos un enlace para crear una nueva contraseña.</p>
            <div class="ob-field">
                <label>Email</label>
                <input type="email" id="obForgotEmail" placeholder="tu@email.com" autocomplete="email">
            </div>
            <div class="ob-error hidden" id="obForgotErr"></div>
            <div class="ob-success hidden" id="obForgotOk">
                ✅ Si el email existe, te enviamos el enlace. Revisá tu bandeja (y spam).
            </div>
            <button class="ob-submit-btn" id="obForgotBtn">Enviar enlace</button>
        </div>
    `;
}

function _bindForgot() {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;

    document.getElementById('obForgotBackBtn').addEventListener('click', () => {
        document.getElementById('obFormArea').innerHTML = _loginFormHTML();
        _bindLogin();
    });

    document.getElementById('obForgotBtn').addEventListener('click', async () => {
        const email = document.getElementById('obForgotEmail').value.trim();
        const err   = document.getElementById('obForgotErr');
        const ok    = document.getElementById('obForgotOk');
        const btn   = document.getElementById('obForgotBtn');
        if (!email) return _obErr(err, 'Ingresá tu email.');
        btn.disabled    = true;
        btn.textContent = 'Enviando…';
        try {
            await fetch(`${API_BASE}/auth/forgot-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email })
            });
            err.classList.add('hidden');
            ok.classList.remove('hidden');
            btn.classList.add('hidden');
        } catch {
            btn.disabled    = false;
            btn.textContent = 'Enviar enlace';
            _obErr(err, 'No se pudo conectar. Intentá de nuevo.');
        }
    });
}

// --- Restablecer contraseña (abierto desde URL con ?reset_token=) ---

function showResetPasswordForm(token) {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;

    const overlay = document.createElement('div');
    overlay.id        = 'resetOverlay';
    overlay.className = 'ob-overlay';
    overlay.innerHTML = `
        <div class="ob-auth-wrap">
            <div class="ob-auth-card">
                <div class="ob-logo" style="justify-content:center;margin-bottom:1.5rem">
                    <span>📖</span>
                    <span class="ob-logo-text">SenseMate</span>
                </div>
                <h2 style="text-align:center;margin-bottom:1.25rem;font-size:1.1rem">Nueva contraseña</h2>
                <div class="ob-form">
                    <div class="ob-field">
                        <label>Nueva contraseña</label>
                        <div class="ob-pwd-wrap">
                            <input type="password" id="resetPwd1" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
                            <button class="ob-eye" id="resetEye1" type="button">👁</button>
                        </div>
                    </div>
                    <div class="ob-field">
                        <label>Repetir contraseña</label>
                        <div class="ob-pwd-wrap">
                            <input type="password" id="resetPwd2" placeholder="Repetí la contraseña" autocomplete="new-password">
                            <button class="ob-eye" id="resetEye2" type="button">👁</button>
                        </div>
                    </div>
                    <div class="ob-error hidden" id="resetErr"></div>
                    <div class="ob-success hidden" id="resetOk">
                        ✅ ¡Contraseña actualizada! Ya podés iniciar sesión.
                    </div>
                    <button class="ob-submit-btn" id="resetSubmitBtn">Guardar contraseña</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const toggle = (id, eyeId) => {
        document.getElementById(eyeId).addEventListener('click', () => {
            const i = document.getElementById(id);
            i.type = i.type === 'password' ? 'text' : 'password';
        });
    };
    toggle('resetPwd1', 'resetEye1');
    toggle('resetPwd2', 'resetEye2');

    document.getElementById('resetSubmitBtn').addEventListener('click', async () => {
        const pwd1 = document.getElementById('resetPwd1').value;
        const pwd2 = document.getElementById('resetPwd2').value;
        const err  = document.getElementById('resetErr');
        const ok   = document.getElementById('resetOk');
        const btn  = document.getElementById('resetSubmitBtn');

        if (!pwd1 || !pwd2)    return _obErr(err, 'Completá ambos campos.');
        if (pwd1 !== pwd2)     return _obErr(err, 'Las contraseñas no coinciden.');
        if (pwd1.length < 6)   return _obErr(err, 'Mínimo 6 caracteres.');

        btn.disabled    = true;
        btn.textContent = 'Guardando…';

        try {
            const res  = await fetch(`${API_BASE}/auth/reset-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ token, password: pwd1 })
            });
            const data = await res.json();
            if (!res.ok) {
                btn.disabled    = false;
                btn.textContent = 'Guardar contraseña';
                return _obErr(err, data.error || 'Error al restablecer.');
            }
            err.classList.add('hidden');
            ok.classList.remove('hidden');
            btn.classList.add('hidden');
            // Limpiar token de la URL sin recargar
            window.history.replaceState({}, '', '/');
            // Redirigir al login después de 2s
            setTimeout(() => {
                overlay.remove();
                showOnboarding(true);
            }, 2000);
        } catch {
            btn.disabled    = false;
            btn.textContent = 'Guardar contraseña';
            _obErr(err, 'No se pudo conectar. Intentá de nuevo.');
        }
    });
}