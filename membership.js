// membership.js — Sistema de membresía y planes de SenseMate
// =============================================================

// ─── Plan Manager ─────────────────────────────────────────────

const MembershipPlan = {
    _PLAN_KEY:       'ls_membership_plan',
    _EXPIRY_KEY:     'ls_membership_expiry',
    _PERIOD_KEY:     'ls_membership_period',
    _REGION_KEY:     'ls_region',

    getStatus() {
        this.checkExpiry();
        return localStorage.getItem(this._PLAN_KEY) || 'free';
    },

    isActive() {
        // Admin bypass — currentUser (app.js global) o authGetCurrentUser
        const u = (typeof currentUser !== 'undefined' && currentUser)
            || (typeof authGetCurrentUser === 'function' && authGetCurrentUser());
        if (u?.isAdmin || u?.isDev) return true;
        const s = this.getStatus();
        return s === 'trial' || s === 'premium';
    },

    startTrial() {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        localStorage.setItem(this._PLAN_KEY, 'trial');
        localStorage.setItem(this._EXPIRY_KEY, expiry.toISOString());
        localStorage.setItem(this._PERIOD_KEY, 'trial');
        document.body.dataset.membershipPlan = 'trial';
    },

    activatePlan(period) {
        const expiry = new Date();
        if (period === 'annual') {
            expiry.setDate(expiry.getDate() + 365);
        } else {
            expiry.setDate(expiry.getDate() + 30);
        }
        localStorage.setItem(this._PLAN_KEY, 'premium');
        localStorage.setItem(this._EXPIRY_KEY, expiry.toISOString());
        localStorage.setItem(this._PERIOD_KEY, period);
        document.body.dataset.membershipPlan = 'premium';
    },

    checkExpiry() {
        const plan   = localStorage.getItem(this._PLAN_KEY);
        const expiry = localStorage.getItem(this._EXPIRY_KEY);
        if ((plan === 'trial' || plan === 'premium') && expiry) {
            if (new Date() > new Date(expiry)) {
                localStorage.setItem(this._PLAN_KEY, 'expired');
                document.body.dataset.membershipPlan = 'expired';
            }
        }
    },

    canTranslate() {
        if (this.isActive()) return true;
        return this.getDailyTranslationCount() < 50;
    },

    countTranslation() {
        const key   = `ls_trans_${_todayKey()}`;
        const count = parseInt(localStorage.getItem(key) || '0', 10);
        localStorage.setItem(key, String(count + 1));
    },

    getDailyTranslationCount() {
        const key = `ls_trans_${_todayKey()}`;
        return parseInt(localStorage.getItem(key) || '0', 10);
    },

    canSendMessage(type) {
        if (this.isActive()) return true;
        const limit = type === 'school' ? 10 : 5;
        return this.getMessagesCount(type) < limit;
    },

    countMessage(type) {
        const key   = `ls_${type}_msg_count`;
        const count = parseInt(localStorage.getItem(key) || '0', 10);
        localStorage.setItem(key, String(count + 1));
    },

    getMessagesCount(type) {
        const key = `ls_${type}_msg_count`;
        return parseInt(localStorage.getItem(key) || '0', 10);
    },

    hasAudio() {
        return this.isActive();
    },

    canUseSingleUse(feature) {
        if (this.isActive()) return true;
        return !localStorage.getItem(`ls_${feature}_used`);
    },

    markSingleUse(feature) {
        localStorage.setItem(`ls_${feature}_used`, '1');
    },

    isFlashcardGroupLocked(index) {
        if (this.isActive()) return false;
        return index % 2 === 1; // odd indices: 1, 3, 5...
    }
};

function _todayKey() {
    return new Date().toISOString().split('T')[0];
}

// ─── Pricing page ─────────────────────────────────────────────

let _membershipConfig  = null;
let _billingToggle     = 'monthly'; // 'monthly' | 'annual'

async function loadMembershipSection() {
    mainContainer.innerHTML = '';
    renderLanguageBar();

    // Load config from server
    let config = { promo: { active: true, maxSubscribers: 500, monthlyPrice: 2.00, annualPrice: 9.99, badge: '🔥 Precio de lanzamiento', urgencyText: { es: 'Solo para los primeros 500 usuarios', en: 'Only for the first 500 users' } }, regular: { monthlyPrice: 4.99, annualPrice: 34.99 }, trialDays: 30, planName: { es: 'Premium 500X', en: 'STARTUP FOR 500X' }, limits: { translationsPerDay: 50, schoolMessages: 10, famousMessages: 5 } };
    let counter = { current: 0, max: 500, remaining: 500 };

    try {
        const [cfgRes, cntRes] = await Promise.all([
            fetch('http://localhost:3000/membership/config'),
            fetch('http://localhost:3000/membership/counter')
        ]);
        if (cfgRes.ok) {
            const cfgData = await cfgRes.json();
            config  = cfgData.config || config;
            counter = { current: cfgData.subscriberCount || 0, max: config.promo?.maxSubscribers || 500, remaining: (config.promo?.maxSubscribers || 500) - (cfgData.subscriberCount || 0) };
        }
        if (cntRes.ok) {
            counter = await cntRes.json();
        }
    } catch (e) {
        // Use defaults silently
    }
    _membershipConfig = config;

    const region  = localStorage.getItem('ls_region') || 'latam';
    const lang    = (typeof appUILanguage !== 'undefined' ? appUILanguage : 'es');
    const isES    = lang !== 'en';
    const planName = isES ? (config.planName?.es || 'Premium 500X') : (config.planName?.en || 'STARTUP FOR 500X');
    const promoActive = config.promo?.active;
    const promoMonthly = config.promo?.monthlyPrice || 2.00;
    const promoAnnual  = config.promo?.annualPrice  || 9.99;
    const regMonthly   = config.regular?.monthlyPrice || 4.99;
    const regAnnual    = config.regular?.annualPrice  || 34.99;
    const badge        = config.promo?.badge || '🔥 Precio de lanzamiento';
    const urgency      = (config.promo?.urgencyText || {})[isES ? 'es' : 'en'] || '';

    const currentStatus = MembershipPlan.getStatus();
    const isAlreadyActive = MembershipPlan.isActive();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="plans-page" id="plansPage">

            <!-- Back -->
            <div class="plans-back-row">
                <button class="school-back-btn" id="plansBackBtn">← ${isES ? 'Volver' : 'Back'}</button>
                ${isAlreadyActive ? `<span class="plans-active-badge">✅ ${isES ? 'Plan activo' : 'Active plan'}: ${currentStatus === 'trial' ? (isES ? 'Trial gratuito' : 'Free trial') : planName}</span>` : ''}
            </div>

            <!-- Title -->
            <div class="plans-title-section">
                <h2 class="plans-main-title">⭐ ${isES ? 'Elegí tu plan' : 'Choose your plan'}</h2>
                <p class="plans-subtitle">${isES ? 'Desbloquea todas las funciones sin límites' : 'Unlock all features without limits'}</p>
            </div>

            <!-- Region selector -->
            <div class="plans-region-selector">
                <button class="plans-region-btn ${region === 'latam' ? 'active' : ''}" data-region="latam">
                    🇦🇷 América Latina
                </button>
                <button class="plans-region-btn ${region === 'eu' ? 'active' : ''}" data-region="eu">
                    🌍 Europa / Global
                </button>
            </div>

            <!-- Promo banner -->
            ${promoActive ? `
            <div class="plans-promo-banner">
                <span class="plans-promo-badge">${badge}</span>
                <span class="plans-promo-urgency">${urgency} — <strong class="plans-counter-num" id="promoRemainingCount">${counter.remaining}</strong> ${isES ? 'lugares restantes' : 'spots left'}</span>
            </div>` : ''}

            <!-- Billing toggle -->
            <div class="plans-billing-toggle">
                <button class="plans-toggle-btn ${_billingToggle === 'monthly' ? 'active' : ''}" id="toggleMonthly">
                    ${isES ? 'Mensual' : 'Monthly'}
                </button>
                <button class="plans-toggle-btn ${_billingToggle === 'annual' ? 'active' : ''}" id="toggleAnnual">
                    ${isES ? 'Anual' : 'Annual'}
                    <span class="plans-save-badge">${isES ? 'Ahorrás 75%' : 'Save 75%'}</span>
                </button>
            </div>

            <!-- Plan cards -->
            <div class="plans-cards-row">
                <!-- Free card -->
                <div class="plan-card plan-card--free">
                    <div class="plan-card-header">
                        <div class="plan-card-name">${isES ? 'Gratis' : 'Free'}</div>
                        <div class="plan-price-promo" style="font-size:1.8rem">$0</div>
                    </div>
                    <ul class="plan-feature-list plan-feature-list--free">
                        <li>🔄 ${isES ? '50 traducciones / día' : '50 translations / day'}</li>
                        <li>💬 ${isES ? '10 mensajes Modo Escuela' : '10 School Mode messages'}</li>
                        <li>🎭 ${isES ? '5 mensajes con Famosos' : '5 Famous chat messages'}</li>
                        <li>📇 ${isES ? 'Flashcards básicos (grupos pares)' : 'Basic flashcards (even groups)'}</li>
                        <li class="plan-feature--locked">🔇 ${isES ? 'Sin audio TTS' : 'No TTS audio'}</li>
                        <li class="plan-feature--locked">🎵 ${isES ? '1 sección Músicos (uso único)' : '1 Musicians section (single use)'}</li>
                        <li class="plan-feature--locked">🌍 ${isES ? '1 sección Inmersión (uso único)' : '1 Immersion section (single use)'}</li>
                    </ul>
                    <button class="plan-cta-btn plan-cta-btn--free" id="planFreeCta">
                        ${isES ? 'Continuar gratis' : 'Continue for free'}
                    </button>
                </div>

                <!-- Premium card -->
                <div class="plan-card plan-card--premium">
                    <div class="plans-popular-tag">${isES ? '⭐ Más popular' : '⭐ Most popular'}</div>
                    <div class="plan-card-header">
                        <div class="plan-card-name">${planName}</div>
                        ${promoActive ? `
                        <div class="plan-price-regular">
                            $${_billingToggle === 'annual' ? regAnnual.toFixed(2) : regMonthly.toFixed(2)} / ${_billingToggle === 'annual' ? (isES ? 'año' : 'year') : (isES ? 'mes' : 'month')}
                        </div>
                        <div class="plan-price-promo">
                            $${_billingToggle === 'annual' ? promoAnnual.toFixed(2) : promoMonthly.toFixed(2)}
                            <span class="plan-price-period">/ ${_billingToggle === 'annual' ? (isES ? 'año' : 'year') : (isES ? 'mes' : 'month')}</span>
                        </div>` : `
                        <div class="plan-price-promo">
                            $${_billingToggle === 'annual' ? regAnnual.toFixed(2) : regMonthly.toFixed(2)}
                            <span class="plan-price-period">/ ${_billingToggle === 'annual' ? (isES ? 'año' : 'year') : (isES ? 'mes' : 'month')}</span>
                        </div>`}
                        ${_billingToggle === 'annual' ? `
                        <div class="plan-price-monthly-equiv">
                            ≈ $${(_billingToggle === 'annual' ? (promoActive ? promoAnnual : regAnnual) / 12 : 0).toFixed(2)} / ${isES ? 'mes' : 'month'}
                        </div>` : ''}
                    </div>
                    <ul class="plan-feature-list plan-feature-list--premium">
                        <li>✅ ${isES ? 'Traducciones ilimitadas' : 'Unlimited translations'}</li>
                        <li>✅ ${isES ? 'Mensajes ilimitados (Escuela)' : 'Unlimited School messages'}</li>
                        <li>✅ ${isES ? 'Chat ilimitado con Famosos' : 'Unlimited Famous chat'}</li>
                        <li>✅ ${isES ? 'Todos los grupos de flashcards' : 'All flashcard groups'}</li>
                        <li>✅ ${isES ? 'Audio TTS con voces IA' : 'TTS audio with AI voices'}</li>
                        <li>✅ ${isES ? 'Músicos e Inmersión sin límites' : 'Musicians & Immersion unlimited'}</li>
                        <li>✅ ${isES ? 'Acceso a todas las funciones futuras' : 'Access to all future features'}</li>
                    </ul>
                    <button class="plan-trial-btn" id="planTrialBtn">
                        🎁 ${isES ? '1 mes gratis — Probar ahora' : '1 month free — Try now'}
                    </button>
                    <button class="plan-cta-btn plan-cta-btn--premium" id="planSubscribeBtn">
                        ${isES ? 'Suscribirme →' : 'Subscribe →'}
                    </button>
                </div>
            </div>

            <!-- Feature comparison table -->
            <div class="plans-comparison-wrap">
                <h3 class="plans-comparison-title">${isES ? 'Comparación detallada' : 'Detailed comparison'}</h3>
                <table class="plans-comparison-table">
                    <thead>
                        <tr>
                            <th>${isES ? 'Función' : 'Feature'}</th>
                            <th>${isES ? 'Gratis' : 'Free'}</th>
                            <th>${planName}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>🔄 ${isES ? 'Traductor' : 'Translator'}</td>
                            <td>${isES ? '50/día' : '50/day'}</td>
                            <td>✅ ${isES ? 'Ilimitado' : 'Unlimited'}</td>
                        </tr>
                        <tr>
                            <td>📇 Flashcards</td>
                            <td>${isES ? 'Grupos pares' : 'Even groups'}</td>
                            <td>✅ ${isES ? 'Todos' : 'All'}</td>
                        </tr>
                        <tr>
                            <td>📚 ${isES ? 'Modo Escuela' : 'School Mode'}</td>
                            <td>10 ${isES ? 'mensajes' : 'messages'}</td>
                            <td>✅ ${isES ? 'Ilimitado' : 'Unlimited'}</td>
                        </tr>
                        <tr>
                            <td>🎭 ${isES ? 'Chat Famosos' : 'Famous Chat'}</td>
                            <td>5 ${isES ? 'mensajes' : 'messages'}</td>
                            <td>✅ ${isES ? 'Ilimitado' : 'Unlimited'}</td>
                        </tr>
                        <tr>
                            <td>🔊 Audio TTS</td>
                            <td>❌</td>
                            <td>✅</td>
                        </tr>
                        <tr>
                            <td>🎵 ${isES ? 'Músicos & Inmersión' : 'Musicians & Immersion'}</td>
                            <td>${isES ? 'Uso único' : 'Single use'}</td>
                            <td>✅ ${isES ? 'Ilimitado' : 'Unlimited'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Trust section -->
            <div class="plans-trust-row" id="plansTrustRow">
                ${region === 'latam' ? `
                    <span>☕ ${isES ? 'Menos que un café por mes' : 'Less than a coffee per month'}</span>
                    <span>📱 ${isES ? 'Pagá con MercadoPago, sin tarjeta' : 'Pay with MercadoPago, no card needed'}</span>
                    <span>🔒 ${isES ? 'Cancelá cuando quieras' : 'Cancel anytime'}</span>
                ` : `
                    <span>🔒 GDPR compliant</span>
                    <span>Your data is never sold</span>
                    <span>✓ Cancel anytime</span>
                    <span>30-day free trial</span>
                `}
            </div>

        </div>
    `);

    // Bind events
    document.getElementById('plansBackBtn').addEventListener('click', () => showMainMenu());
    document.getElementById('planFreeCta').addEventListener('click', () => showMainMenu());
    document.getElementById('planTrialBtn').addEventListener('click', () => _startTrialFlow());
    document.getElementById('planSubscribeBtn').addEventListener('click', () => _showPaymentFlow(_billingToggle));

    // Region buttons
    document.querySelectorAll('.plans-region-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.setItem('ls_region', btn.dataset.region);
            loadMembershipSection();
        });
    });

    // Billing toggle
    document.getElementById('toggleMonthly').addEventListener('click', () => {
        _billingToggle = 'monthly';
        loadMembershipSection();
    });
    document.getElementById('toggleAnnual').addEventListener('click', () => {
        _billingToggle = 'annual';
        loadMembershipSection();
    });

    // Animate counter
    if (promoActive) {
        _animateCounter('promoRemainingCount', 0, counter.remaining, 1200);
    }
}

function _animateCounter(elId, from, to, duration) {
    const el = document.getElementById(elId);
    if (!el) return;
    const start = performance.now();
    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const val = Math.round(from + (to - from) * progress);
        el.textContent = val;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ─── Trial flow ───────────────────────────────────────────────

function _startTrialFlow() {
    const region = localStorage.getItem('ls_region') || 'latam';
    const lang   = (typeof appUILanguage !== 'undefined' ? appUILanguage : 'es');
    const isES   = lang !== 'en';

    if (region === 'latam') {
        MembershipPlan.startTrial();
        if (typeof showToast === 'function') showToast('✅ ' + (isES ? '¡1 mes gratis activado! Bienvenido/a a Premium 500X' : '1 free month activated! Welcome to STARTUP FOR 500X'));
        setTimeout(() => showMainMenu(), 800);
    } else {
        // EU: show a modal placeholder
        const modal = document.createElement('div');
        modal.className = 'payment-modal-overlay';
        modal.innerHTML = `
            <div class="payment-modal">
                <div class="payment-modal-header">
                    <h3>🎁 ${isES ? 'Trial gratuito — 1 mes' : 'Free trial — 1 month'}</h3>
                    <button class="payment-modal-close" id="trialModalClose">×</button>
                </div>
                <div class="payment-modal-body">
                    <p style="margin-bottom:1rem; color: var(--text-muted); font-size:.9rem">
                        ${isES ? 'Ingresá tu tarjeta para activar el trial gratuito de 30 días. No se realizará ningún cobro hasta que finalice el período de prueba.' : 'Enter your card to activate the 30-day free trial. You will not be charged until the trial period ends.'}
                    </p>
                    <div class="payment-card-placeholder">
                        <div class="payment-card-field">
                            <label>${isES ? 'Número de tarjeta' : 'Card number'}</label>
                            <input type="text" placeholder="1234 5678 9012 3456" class="payment-input" maxlength="19">
                        </div>
                        <div class="payment-card-row">
                            <div class="payment-card-field">
                                <label>${isES ? 'Vencimiento' : 'Expiry'}</label>
                                <input type="text" placeholder="MM/YY" class="payment-input" maxlength="5">
                            </div>
                            <div class="payment-card-field">
                                <label>CVV</label>
                                <input type="text" placeholder="123" class="payment-input" maxlength="4">
                            </div>
                        </div>
                    </div>
                    <button class="plan-cta-btn plan-cta-btn--premium" id="trialActivateBtn" style="width:100%; margin-top:1rem">
                        ${isES ? 'Activar trial gratuito' : 'Activate free trial'}
                    </button>
                    <p style="font-size:.75rem; color:var(--text-muted); text-align:center; margin-top:.75rem">
                        🔒 ${isES ? 'Datos de tarjeta de prueba — MVP placeholder' : 'Test card data — MVP placeholder'}
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
        document.getElementById('trialModalClose').addEventListener('click', () => modal.remove());
        document.getElementById('trialActivateBtn').addEventListener('click', () => {
            modal.remove();
            MembershipPlan.startTrial();
            if (typeof showToast === 'function') showToast('✅ ' + (isES ? '¡Trial activado! Bienvenido/a' : 'Trial activated! Welcome'));
            setTimeout(() => showMainMenu(), 800);
        });
    }
}

// ─── Payment flow ─────────────────────────────────────────────

function _showPaymentFlow(period) {
    if (typeof gtag === 'function') gtag('event', 'begin_checkout', { period });
    const region = localStorage.getItem('ls_region') || 'latam';
    const lang   = (typeof appUILanguage !== 'undefined' ? appUILanguage : 'es');
    const isES   = lang !== 'en';
    const config = _membershipConfig || {};
    const promoActive  = config.promo?.active;
    const promoMonthly = config.promo?.monthlyPrice || 2.00;
    const promoAnnual  = config.promo?.annualPrice  || 9.99;
    const regMonthly   = config.regular?.monthlyPrice || 4.99;
    const regAnnual    = config.regular?.annualPrice  || 34.99;
    const price = period === 'annual'
        ? (promoActive ? promoAnnual : regAnnual)
        : (promoActive ? promoMonthly : regMonthly);
    const planName = isES ? (config.planName?.es || 'Premium 500X') : (config.planName?.en || 'STARTUP FOR 500X');
    const periodLabel = period === 'annual' ? (isES ? 'anual' : 'annual') : (isES ? 'mensual' : 'monthly');

    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';

    // Determinar el period key para el backend
    const periodKey   = period === 'annual'
        ? (promoActive ? 'promo-anual'   : 'anual')
        : (promoActive ? 'promo-mensual' : 'mensual');

    if (region === 'latam') {
        modal.innerHTML = `
            <div class="payment-modal">
                <div class="payment-modal-header">
                    <h3>💙 ${isES ? 'Pagar con MercadoPago' : 'Pay with MercadoPago'}</h3>
                    <button class="payment-modal-close" id="payModalClose">×</button>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-plan-summary">
                        <span class="payment-plan-name">${planName}</span>
                        <span class="payment-plan-price">$${price.toFixed(2)} / ${periodLabel}</span>
                    </div>
                    <button class="payment-mp-btn" id="payMpBtn">
                        💙 ${isES ? 'Pagar con MercadoPago' : 'Pay with MercadoPago'}
                    </button>
                    <div id="payMpLoading" class="payment-mp-loading hidden">
                        <div class="payment-spinner"></div>
                        <span>${isES ? 'Generando link de pago…' : 'Generating payment link…'}</span>
                    </div>
                    <p class="payment-no-card">${isES ? '✓ Sin tarjeta requerida · Efectivo, débito o crédito · Pago seguro' : '✓ No card required · Cash, debit or credit · Secure payment'}</p>
                </div>
            </div>
        `;
    } else {
        // EU: Stripe + Wise
        modal.innerHTML = `
            <div class="payment-modal">
                <div class="payment-modal-header">
                    <h3>💳 ${isES ? 'Opciones de pago' : 'Payment options'}</h3>
                    <button class="payment-modal-close" id="payModalClose">×</button>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-plan-summary">
                        <span class="payment-plan-name">${planName}</span>
                        <span class="payment-plan-price">$${price.toFixed(2)} / ${periodLabel}</span>
                    </div>
                    <button class="payment-stripe-btn" id="payStripeBtn">
                        💳 ${isES ? 'Pagar con Stripe' : 'Pay with Stripe'}
                    </button>
                    <div class="payment-or-divider">${isES ? 'o' : 'or'}</div>
                    <button class="payment-wise-btn" id="payWiseBtn">
                        🏦 ${isES ? 'Pagar con Wise (transferencia)' : 'Pay with Wise (transfer)'}
                    </button>
                    <div class="payment-divider">— ${isES ? '¿Ya pagaste?' : 'Already paid?'} —</div>
                    <button class="payment-already-paid-btn" id="payAlreadyPaidBtn">
                        ${isES ? '✅ Activar mi plan →' : '✅ Activate my plan →'}
                    </button>
                </div>
            </div>
        `;
    }
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.getElementById('payModalClose').addEventListener('click', () => modal.remove());

    if (region === 'latam') {
        document.getElementById('payMpBtn').addEventListener('click', async () => {
            const btn     = document.getElementById('payMpBtn');
            const loading = document.getElementById('payMpLoading');
            btn.classList.add('hidden');
            loading.classList.remove('hidden');

            const token   = typeof authGetToken === 'function' ? authGetToken() : null;
            const user    = typeof authGetCurrentUser === 'function' ? authGetCurrentUser() : null;

            if (!token || !user) {
                loading.classList.add('hidden');
                btn.classList.remove('hidden');
                if (typeof showToast === 'function') showToast('⚠️ Iniciá sesión para continuar');
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/mp/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ period: periodKey, userId: user.id, userEmail: user.email }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al conectar con MercadoPago');
                // En TEST usamos sandbox_init_point, en producción init_point
                const url = data.sandboxInitPoint || data.initPoint;
                window.open(url, '_blank');
                modal.remove();
            } catch (e) {
                loading.classList.add('hidden');
                btn.classList.remove('hidden');
                if (typeof showToast === 'function') showToast('❌ ' + e.message);
            }
        });
    }

    if (region === 'eu') {
        document.getElementById('payStripeBtn')?.addEventListener('click', () => {
            modal.remove();
            if (typeof showToast === 'function') showToast('⏳ ' + (isES ? 'Próximamente — usá Wise por ahora' : 'Coming soon — use Wise for now'));
        });
        document.getElementById('payWiseBtn')?.addEventListener('click', () => {
            modal.remove();
            _showWiseModal(price, period, periodLabel, planName, isES);
        });
    }
}

function _showWiseModal(price, period, periodLabel, planName, isES) {
    const userEmail = (typeof currentUser !== 'undefined' && currentUser?.email) ? currentUser.email : 'tu@email.com';
    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.innerHTML = `
        <div class="payment-modal">
            <div class="payment-modal-header">
                <h3>🏦 Wise ${isES ? 'Transferencia' : 'Transfer'}</h3>
                <button class="payment-modal-close" id="wiseModalClose">×</button>
            </div>
            <div class="payment-modal-body">
                <div class="wise-transfer-info">
                    <div class="wise-row">
                        <span class="wise-label">${isES ? 'Transferí a' : 'Transfer to'}:</span>
                        <strong>ahimsasemilla@gmail.com (Wise)</strong>
                    </div>
                    <div class="wise-row">
                        <span class="wise-label">${isES ? 'Monto' : 'Amount'}:</span>
                        <strong>$${price.toFixed(2)} USD</strong>
                    </div>
                    <div class="wise-row">
                        <span class="wise-label">${isES ? 'Asunto' : 'Subject'}:</span>
                        <strong>SenseMate ${periodLabel} ${userEmail}</strong>
                    </div>
                </div>
                <button class="payment-wise-btn" id="wiseCopyBtn" style="width:100%; margin:1rem 0">
                    📋 ${isES ? 'Copiar email de destino' : 'Copy destination email'}
                </button>
                <button class="plan-cta-btn plan-cta-btn--premium" id="wiseActivateBtn" style="width:100%">
                    ${isES ? '✅ Ya realicé el pago →' : '✅ I already paid →'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.getElementById('wiseModalClose').addEventListener('click', () => modal.remove());
    document.getElementById('wiseCopyBtn').addEventListener('click', async () => {
        try { await navigator.clipboard.writeText('ahimsasemilla@gmail.com'); }
        catch { /* fallback */ }
        if (typeof showToast === 'function') showToast('📋 ' + (isES ? 'Email copiado al portapapeles' : 'Email copied to clipboard'));
    });
    document.getElementById('wiseActivateBtn').addEventListener('click', () => {
        modal.remove();
        _showActivationModal(period);
    });
}

// ─── Activation modal ─────────────────────────────────────────

function _showActivationModal(period) {
    const lang  = (typeof appUILanguage !== 'undefined' ? appUILanguage : 'es');
    const isES  = lang !== 'en';
    const config   = _membershipConfig || {};
    const planName = isES ? (config.planName?.es || 'Premium 500X') : (config.planName?.en || 'STARTUP FOR 500X');

    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.innerHTML = `
        <div class="payment-modal">
            <div class="payment-modal-header">
                <h3>✅ ${isES ? 'Activar mi plan' : 'Activate my plan'}</h3>
                <button class="payment-modal-close" id="actModalClose">×</button>
            </div>
            <div class="payment-modal-body">
                <p style="margin-bottom:1rem; color:var(--text-muted); font-size:.9rem">
                    ${isES ? 'Ingresá el email con el que realizaste el pago para activar tu plan.' : 'Enter the email you used to pay to activate your plan.'}
                </p>
                <div class="payment-card-field">
                    <label>Email</label>
                    <input type="email" id="activationEmail" class="payment-input"
                        placeholder="${isES ? 'tu@email.com' : 'your@email.com'}"
                        value="${(typeof currentUser !== 'undefined' && currentUser?.email) ? currentUser.email : ''}">
                </div>
                <div class="payment-activation-error hidden" id="activationError"></div>
                <button class="plan-cta-btn plan-cta-btn--premium" id="actSubmitBtn" style="width:100%; margin-top:1rem">
                    ${isES ? 'Activar plan' : 'Activate plan'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.getElementById('actModalClose').addEventListener('click', () => modal.remove());

    document.getElementById('actSubmitBtn').addEventListener('click', async () => {
        const email    = document.getElementById('activationEmail').value.trim();
        const errEl    = document.getElementById('activationError');
        const btn      = document.getElementById('actSubmitBtn');
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errEl.textContent = isES ? 'Ingresá un email válido.' : 'Enter a valid email.';
            errEl.classList.remove('hidden');
            return;
        }
        btn.disabled = true;
        btn.textContent = isES ? 'Activando...' : 'Activating...';
        errEl.classList.add('hidden');

        try {
            const region = localStorage.getItem('ls_region') || 'latam';
            const res = await fetch('http://localhost:3000/membership/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, plan: period === 'annual' ? 'annual' : 'monthly', region, period })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'Error');
            MembershipPlan.activatePlan(period);
            modal.remove();
            if (typeof showToast === 'function') showToast(`✅ ${isES ? '¡Plan activado! Bienvenido/a a ' + planName : 'Plan activated! Welcome to ' + planName}`);
            setTimeout(() => showMainMenu(), 800);
        } catch (err) {
            errEl.textContent = `❌ ${err.message}`;
            errEl.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = isES ? 'Activar plan' : 'Activate plan';
        }
    });
}

// ─── Upgrade modal ────────────────────────────────────────────

function _showUpgradeModal(feature) {
    const lang  = (typeof appUILanguage !== 'undefined' ? appUILanguage : 'es');
    const isES  = lang !== 'en';

    // Remove existing if any
    document.querySelector('.upgrade-modal-overlay')?.remove();

    const featureMessages = {
        translate:  isES ? 'Alcanzaste el límite de traducciones del plan gratuito' : 'You\'ve reached the free plan translation limit',
        school:     isES ? 'Alcanzaste el límite de mensajes del Modo Escuela' : 'You\'ve reached the School Mode message limit',
        famous:     isES ? 'Alcanzaste el límite de mensajes con Famosos' : 'You\'ve reached the Famous chat message limit',
        audio:      isES ? 'El audio TTS está disponible solo en el plan Premium' : 'TTS audio is only available in the Premium plan',
        flashcards: isES ? 'Este grupo de flashcards es exclusivo del plan Premium' : 'This flashcard group is exclusive to the Premium plan',
        musicians:  isES ? 'Ya usaste tu sesión gratuita de Músicos con Letras' : 'You\'ve used your free Musicians session',
        immersion:  isES ? 'Ya usaste tu sesión gratuita de Aprende con...' : 'You\'ve used your free Immersion session'
    };

    const featureUsage = {
        translate:  `${MembershipPlan.getDailyTranslationCount()}/50 ${isES ? 'traducciones hoy' : 'translations today'}`,
        school:     `${MembershipPlan.getMessagesCount('school')}/10 ${isES ? 'mensajes Escuela' : 'School messages'}`,
        famous:     `${MembershipPlan.getMessagesCount('famous')}/5 ${isES ? 'mensajes Famosos' : 'Famous messages'}`,
        audio:      isES ? 'Función Premium' : 'Premium feature',
        flashcards: isES ? 'Grupo bloqueado' : 'Locked group',
        musicians:  isES ? 'Sesión única utilizada' : 'Single session used',
        immersion:  isES ? 'Sesión única utilizada' : 'Single session used'
    };

    const message = featureMessages[feature] || featureMessages.translate;
    const usage   = featureUsage[feature]   || '';

    const overlay = document.createElement('div');
    overlay.className = 'upgrade-modal-overlay';
    overlay.innerHTML = `
        <div class="upgrade-modal">
            <div class="upgrade-modal-header">
                <div class="upgrade-modal-icon">⭐</div>
                <h3>${isES ? 'Límite del plan gratuito' : 'Free plan limit'}</h3>
                <p>${message}</p>
            </div>
            <div class="upgrade-modal-body">
                <div class="upgrade-usage-pill">${usage}</div>
                <p class="upgrade-modal-cta-text">
                    ${isES ? 'Desbloqueá acceso ilimitado con Premium 500X — desde $2/mes' : 'Unlock unlimited access with STARTUP FOR 500X — from $2/month'}
                </p>
                <div class="upgrade-modal-btns">
                    <button class="plan-cta-btn plan-cta-btn--premium" id="upgradeSeePlanBtn">
                        ${isES ? 'Ver planes →' : 'See plans →'}
                    </button>
                    <button class="upgrade-close-btn" id="upgradeCloseBtn">
                        ${isES ? 'Cerrar' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('upgradeCloseBtn').addEventListener('click', () => overlay.remove());
    document.getElementById('upgradeSeePlanBtn').addEventListener('click', () => {
        overlay.remove();
        loadMembershipSection();
    });
}

// ─── Fetch interceptor ────────────────────────────────────────

function _initMembershipInterceptor() {
    const _origFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url    = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input?.url || ''));
        const method = (init?.method || 'GET').toUpperCase();

        if (method === 'POST' && !MembershipPlan.isActive()) {
            // /speak — audio TTS
            if (url.includes('/speak')) {
                if (!MembershipPlan.hasAudio()) {
                    _showUpgradeModal('audio');
                    return Promise.reject(new Error('Premium required for audio'));
                }
            }
            // /famous-chat
            else if (url.includes('/famous-chat')) {
                if (!MembershipPlan.canSendMessage('famous')) {
                    _showUpgradeModal('famous');
                    return Promise.reject(new Error('Message limit reached'));
                }
                const resp = await _origFetch.apply(this, arguments);
                if (resp.ok) MembershipPlan.countMessage('famous');
                return resp;
            }
            // /chat (school) — NOT famous-chat
            else if (url.includes('/chat') && !url.includes('/famous-chat')) {
                if (!MembershipPlan.canSendMessage('school')) {
                    _showUpgradeModal('school');
                    return Promise.reject(new Error('Message limit reached'));
                }
                const resp = await _origFetch.apply(this, arguments);
                if (resp.ok) MembershipPlan.countMessage('school');
                return resp;
            }
            // /translate — NOT translate-speech
            else if (url.includes('/translate') && !url.includes('/translate-speech')) {
                if (!MembershipPlan.canTranslate()) {
                    _showUpgradeModal('translate');
                    return Promise.reject(new Error('Translation limit reached'));
                }
                const resp = await _origFetch.apply(this, arguments);
                if (resp.ok) MembershipPlan.countTranslation();
                return resp;
            }
        }

        return _origFetch.apply(this, arguments);
    };
}

// ─── Flashcard lock (MutationObserver) ───────────────────────

function _initFlashcardLock() {
    const mc = document.getElementById('mainContainer');
    if (!mc) return;

    const observer = new MutationObserver(() => {
        if (MembershipPlan.isActive()) return;

        const cards = mc.querySelectorAll('.fg-group-card');
        if (!cards.length) return;

        cards.forEach((card, index) => {
            if (MembershipPlan.isFlashcardGroupLocked(index)) {
                // Only add overlay once
                if (!card.querySelector('.membership-locked-overlay')) {
                    card.classList.add('membership-locked');
                    const overlay = document.createElement('div');
                    overlay.className = 'membership-locked-overlay';
                    overlay.innerHTML = `
                        <div class="membership-locked-icon">🔒</div>
                        <div class="membership-locked-badge">Premium</div>
                    `;
                    overlay.addEventListener('click', e => {
                        e.stopPropagation();
                        _showUpgradeModal('flashcards');
                    });
                    card.appendChild(overlay);
                }
            }
        });
    });

    observer.observe(mc, { childList: true, subtree: true });
}

// ─── speechSynthesis interceptor (school.js auto-speak) ──────

function _initSpeechSynthesisInterceptor() {
    if (!window.speechSynthesis) return;
    const _origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak = function(utterance) {
        if (!MembershipPlan.hasAudio()) {
            _showUpgradeModal('audio');
            return;
        }
        _origSpeak(utterance);
    };
}

// ─── DOMContentLoaded setup ───────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    MembershipPlan.checkExpiry();
    document.body.dataset.membershipPlan = MembershipPlan.getStatus();
    _initMembershipInterceptor();
    _initSpeechSynthesisInterceptor();
    _initFlashcardLock();

    // Manejar redirect de MercadoPago tras el pago
    const params  = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'success') {
        // Limpiar el parámetro de la URL sin recargar
        window.history.replaceState({}, '', '/');
        // Actualizar sesión desde el servidor (el plan ya fue actualizado por el webhook/success)
        if (typeof authVerifySession === 'function') {
            authVerifySession().then(user => {
                if (user) {
                    if (typeof currentUser !== 'undefined') window.currentUser = user;
                    // Activar premium en el estado local
                    const plan = user.plan || 'premium';
                    MembershipPlan.activate(plan, plan.includes('annual') ? 365 : 30);
                    document.body.dataset.membershipPlan = MembershipPlan.getStatus();
                }
                setTimeout(() => {
                    if (typeof showToast === 'function') showToast('🎉 ¡Pago confirmado! Tu plan Premium está activo.');
                }, 500);
            });
        } else {
            setTimeout(() => {
                if (typeof showToast === 'function') showToast('🎉 ¡Pago confirmado! Reiniciá sesión para activar tu plan.');
            }, 500);
        }
    } else if (payment === 'failure') {
        window.history.replaceState({}, '', '/');
        setTimeout(() => {
            if (typeof showToast === 'function') showToast('❌ El pago no se pudo completar. Podés intentarlo de nuevo.');
        }, 500);
    } else if (payment === 'pending') {
        window.history.replaceState({}, '', '/');
        setTimeout(() => {
            if (typeof showToast === 'function') showToast('⏳ Pago pendiente. Te avisaremos cuando se confirme.');
        }, 500);
    }
});
