// contributors.js — Registro de contribuidores y sistema de anuncios
// ==================================================================

// ─── Registro de contribuidor ────────────────────────────────

function showContributorRegistration() {
    const overlay = document.createElement('div');
    overlay.className = 'contrib-overlay';
    overlay.id = 'contribOverlay';
    overlay.innerHTML = `
        <div class="contrib-modal">
            <button class="contrib-close-btn" id="contribCloseBtn">×</button>
            <div class="contrib-modal-icon">👨‍🏫</div>
            <h2 class="contrib-modal-title">Soy Profesor</h2>
            <p class="contrib-modal-sub">Promocioná tus servicios educativos en SenseMate</p>
            <div id="contribStepArea"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('contribCloseBtn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    document.getElementById('contribStepArea').innerHTML = _contribCodeFormHTML();
    _bindContribCode();
}

function _contribCodeFormHTML() {
    return `
        <div class="contrib-form">
            <div class="contrib-profe-info">
                <p>Si eres profesor de idioma puedes publicar tus servicios gratuitamente sumándote como contributor de nuestra aplicación. Podrás controlar que tu aviso aparezca de forma localizada donde prefieras y luego como usuario Gold utilizar la aplicación también como tu espacio de trabajo junto con tus alumnos.</p>
            </div>
            <p class="contrib-step-hint">Paso 1 de 2 — Verificá tu código de acceso</p>
            <div class="contrib-field">
                <label>Código de contribuidor</label>
                <input type="text" id="contribCodeInput" class="contrib-input"
                    placeholder="••••••••" autocomplete="off"
                    style="text-transform:uppercase;letter-spacing:.15em;text-align:center;font-size:1.1rem">
            </div>
            <div class="contrib-error hidden" id="contribCodeErr"></div>
            <button class="contrib-submit-btn" id="contribCodeBtn">Verificar →</button>
        </div>
    `;
}

function _bindContribCode() {
    const doCheck = () => {
        const code = document.getElementById('contribCodeInput').value.trim().toUpperCase();
        const err  = document.getElementById('contribCodeErr');
        if (!code) { _contribErr(err, 'Ingresá el código de acceso.'); return; }
        if (code !== 'SOYPROFE') { _contribErr(err, 'Código incorrecto. Consultá con el administrador.'); return; }
        document.getElementById('contribStepArea').innerHTML = _contribProfileFormHTML();
        _bindContribProfile();
    };
    document.getElementById('contribCodeBtn').addEventListener('click', doCheck);
    document.getElementById('contribCodeInput').addEventListener('keydown', e => { if (e.key === 'Enter') doCheck(); });
}

function _contribProfileFormHTML() {
    const user = (typeof currentUser !== 'undefined') ? currentUser : null;
    return `
        <div class="contrib-form">
            <p class="contrib-step-hint">✅ Código válido — Paso 2 de 2: Tu perfil de contribuidor</p>
            <div class="contrib-field">
                <label>Nombre profesional *</label>
                <input type="text" id="contribName" class="contrib-input"
                    placeholder="Ej: Prof. María González" maxlength="60"
                    value="${(typeof escapeHtml !== 'undefined') ? escapeHtml(user?.name || '') : (user?.name || '')}">
            </div>
            <div class="contrib-field">
                <label>Email de contacto *</label>
                <input type="email" id="contribEmailInput" class="contrib-input"
                    placeholder="tu@email.com"
                    value="${user?.email || ''}">
            </div>
            <div class="contrib-field">
                <label>Link a tu servicio *</label>
                <input type="url" id="contribServiceLink" class="contrib-input"
                    placeholder="https://tusitio.com, WhatsApp, etc.">
            </div>
            <div class="contrib-field">
                <label>Foto de perfil <span class="ob-optional-tag">opcional</span></label>
                <div class="contrib-photo-row">
                    <input type="url" id="contribPhotoUrl" class="contrib-input"
                        placeholder="URL de tu foto (https://...)">
                    <span class="contrib-or">o</span>
                    <label class="contrib-file-btn">
                        📁 Subir
                        <input type="file" id="contribPhotoFile" accept="image/jpeg,image/png,image/webp" style="display:none">
                    </label>
                </div>
                <div id="contribPhotoPreview" class="contrib-photo-preview hidden"></div>
            </div>
            <div class="contrib-field">
                <label>Descripción de tu servicio <span class="ob-optional-tag">opcional</span></label>
                <textarea id="contribBio" class="contrib-input contrib-textarea"
                    rows="3" maxlength="300"
                    placeholder="Idiomas que enseñás, tu experiencia, qué ofrecés..."></textarea>
                <span class="contrib-char-count" id="contribBioCount">0 / 300</span>
            </div>
            <div class="contrib-error hidden" id="contribProfileErr"></div>
            <button class="contrib-submit-btn" id="contribSubmitBtn">Enviar solicitud ✓</button>
        </div>
    `;
}

function _bindContribProfile() {
    // File upload → base64
    document.getElementById('contribPhotoFile').addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 500 * 1024) {
            alert('La imagen no puede superar 500 KB.');
            e.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            document.getElementById('contribPhotoUrl').value = '';
            const preview = document.getElementById('contribPhotoPreview');
            preview.style.backgroundImage = `url('${ev.target.result}')`;
            preview.classList.remove('hidden');
            preview._base64 = ev.target.result;
        };
        reader.readAsDataURL(file);
    });

    // URL preview on blur
    document.getElementById('contribPhotoUrl').addEventListener('blur', e => {
        const url = e.target.value.trim();
        if (!url) return;
        const preview = document.getElementById('contribPhotoPreview');
        preview.style.backgroundImage = `url('${url}')`;
        preview.classList.remove('hidden');
        preview._base64 = null;
    });

    // Bio char count
    document.getElementById('contribBio').addEventListener('input', e => {
        document.getElementById('contribBioCount').textContent = `${e.target.value.length} / 300`;
    });

    document.getElementById('contribSubmitBtn').addEventListener('click', async () => {
        const name  = document.getElementById('contribName').value.trim();
        const email = document.getElementById('contribEmailInput').value.trim();
        const link  = document.getElementById('contribServiceLink').value.trim();
        const bio   = document.getElementById('contribBio').value.trim();
        const err   = document.getElementById('contribProfileErr');
        const preview = document.getElementById('contribPhotoPreview');

        if (!name)  { _contribErr(err, 'El nombre es requerido.'); return; }
        if (!email || !/\S+@\S+\.\S+/.test(email)) { _contribErr(err, 'Email inválido.'); return; }
        if (!link)  { _contribErr(err, 'El link al servicio es requerido.'); return; }

        const photo = preview._base64 || document.getElementById('contribPhotoUrl').value.trim() || null;

        const btn = document.getElementById('contribSubmitBtn');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        try {
            const user = (typeof currentUser !== 'undefined') ? currentUser : null;
            const res = await fetch(_API_HOST + '/contributor/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: 'SOYPROFE', name, email, link, photo, bio,
                    username: user?.username || null
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar');

            document.getElementById('contribStepArea').innerHTML = `
                <div class="contrib-success">
                    <div class="contrib-success-icon">🎉</div>
                    <h3>¡Solicitud enviada!</h3>
                    <p>Tu solicitud fue recibida y será revisada por el administrador.<br>
                    Te avisaremos cuando esté activa.</p>
                    <button class="contrib-submit-btn" id="contribDoneBtn" style="margin-top:1.25rem">Cerrar</button>
                </div>
            `;
            document.getElementById('contribDoneBtn').addEventListener('click', () => {
                document.getElementById('contribOverlay')?.remove();
            });
        } catch (err2) {
            _contribErr(err, err2.message);
            btn.disabled = false;
            btn.textContent = 'Enviar solicitud ✓';
        }
    });
}

function _contribErr(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4500);
}

// ─── Sistema de anuncios ─────────────────────────────────────

let _adsCache    = null;
let _adsCacheTs  = 0;
const _ADS_TTL   = 5 * 60 * 1000; // 5 min

async function _fetchAds() {
    if (_adsCache && (Date.now() - _adsCacheTs) < _ADS_TTL) return _adsCache;
    try {
        const res = await fetch(_API_HOST + '/publications/active');
        if (!res.ok) return [];
        _adsCache   = await res.json();
        _adsCacheTs = Date.now();
        return _adsCache;
    } catch { return []; }
}

function _adReady(pub) {
    const last = parseInt(localStorage.getItem(`ad_last_${pub.id}`) || '0');
    return (Date.now() - last) >= (pub.intervalMinutes || 60) * 60 * 1000;
}

function _adMarkShown(pub) {
    localStorage.setItem(`ad_last_${pub.id}`, Date.now().toString());
}

// ── Anuncios inline en el menú principal (placement: home) ───

async function _injectHomeAds() {
    const menu = document.querySelector('.main-menu');
    if (!menu || menu.querySelector('.contrib-ads-row')) return;

    const ads = await _fetchAds();
    const homeAds = ads.filter(p => (p.placements || []).includes('home') && _adReady(p));
    if (homeAds.length === 0) return;

    const row = document.createElement('div');
    row.className = 'contrib-ads-row';
    row.innerHTML = `
        <div class="contrib-ads-label">💼 Contribuidores de SenseMate</div>
        <div class="contrib-ads-scroll">
            ${homeAds.slice(0, 6).map(pub => _adCardHTML(pub)).join('')}
        </div>
    `;
    menu.appendChild(row);
    homeAds.slice(0, 6).forEach(p => _adMarkShown(p));

    row.querySelectorAll('.contrib-ad-dismiss').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            btn.closest('.contrib-ad-card')?.remove();
            if (!row.querySelector('.contrib-ad-card')) row.remove();
        });
    });
}

function _adCardHTML(pub) {
    const photo = pub.photo || pub.contributorPhoto;
    const imgHtml = photo
        ? `<div class="contrib-ad-img" style="background-image:url('${_safeUrl(photo)}')"></div>`
        : `<div class="contrib-ad-img contrib-ad-img--empty">💼</div>`;

    return `
        <a class="contrib-ad-card" href="${_safeUrl(pub.link || '#')}" target="_blank" rel="noopener noreferrer">
            ${imgHtml}
            <div class="contrib-ad-body">
                <div class="contrib-ad-title">${_safeText(pub.title)}</div>
                ${pub.description ? `<div class="contrib-ad-desc">${_safeText(pub.description)}</div>` : ''}
                <div class="contrib-ad-cta">${_safeText(pub.ctaText || 'Ver más')} →</div>
            </div>
            <button class="contrib-ad-dismiss" title="Cerrar">×</button>
            <span class="contrib-ad-badge">Publicidad</span>
        </a>
    `;
}

// ── Anuncio flotante para otras secciones (placement: floating) ─

let _floatTimer = null;

async function _scheduleFloatingAd() {
    clearTimeout(_floatTimer);
    document.querySelector('.contrib-floating-ad')?.remove();

    _floatTimer = setTimeout(async () => {
        const ads = await _fetchAds();
        const floatAds = ads.filter(p => (p.placements || []).includes('floating') && _adReady(p));
        if (floatAds.length === 0) return;

        const pub = floatAds[Math.floor(Math.random() * floatAds.length)];
        _adMarkShown(pub);

        const photo = pub.photo || pub.contributorPhoto;
        const imgHtml = photo
            ? `<div class="contrib-float-img" style="background-image:url('${_safeUrl(photo)}')"></div>`
            : '';

        const card = document.createElement('div');
        card.className = 'contrib-floating-ad';
        card.innerHTML = `
            <button class="contrib-float-close" id="contribFloatClose">×</button>
            <a href="${_safeUrl(pub.link || '#')}" target="_blank" rel="noopener noreferrer" class="contrib-float-link">
                ${imgHtml}
                <div class="contrib-float-content">
                    <div class="contrib-float-name">${_safeText(pub.contributorName || '')}</div>
                    <div class="contrib-float-title">${_safeText(pub.title)}</div>
                    <div class="contrib-float-cta">${_safeText(pub.ctaText || 'Ver más')} →</div>
                </div>
            </a>
            <span class="contrib-float-badge">Publicidad</span>
        `;
        document.body.appendChild(card);
        document.getElementById('contribFloatClose').addEventListener('click', () => card.remove());
        requestAnimationFrame(() => card.classList.add('contrib-float-visible'));
    }, 25000); // mostrar 25s después de entrar a la sección
}

// ── Helpers ──────────────────────────────────────────────────

function _safeText(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function _safeUrl(url) {
    if (!url) return '#';
    // Only allow http, https and data URLs (for base64 photos)
    if (/^(https?:|data:image\/)/.test(url)) return url.replace(/"/g, '%22');
    return '#';
}

// ─── Setup: menu link + MutationObserver ─────────────────────

window.addEventListener('DOMContentLoaded', () => {
    // Botón "Ser Contribuidor" en el menú
    document.getElementById('contribMenuLink')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('dropdownMenu')?.classList.add('hidden');
        showContributorRegistration();
    });

    // Observer en mainContainer para inyectar ads
    const mc = document.getElementById('mainContainer');
    if (!mc) return;

    const observer = new MutationObserver(() => {
        if (mc.querySelector('.main-menu')) {
            clearTimeout(_floatTimer);
            document.querySelector('.contrib-floating-ad')?.remove();
            // Pequeño delay para que el DOM del menú esté listo
            setTimeout(() => _injectHomeAds(), 150);
        } else {
            // En cualquier otra sección, programar un floating ad
            _scheduleFloatingAd();
        }
    });

    observer.observe(mc, { childList: true });
});
