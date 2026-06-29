// classroom.js — Aula Virtual: panel de Profesor (Gold) y Alumno (Premium)
// =========================================================================

// ─── Constantes ───────────────────────────────────────────────

const _CL_LANG_NAMES = {
    en:'Inglés', es:'Español', fr:'Francés', de:'Alemán', pt:'Portugués',
    it:'Italiano', zh:'Chino', ja:'Japonés', ko:'Coreano', ru:'Ruso', ar:'Árabe'
};

// ─── Entry point ──────────────────────────────────────────────

function loadClassroomPanel() {
    const user = (typeof currentUser !== 'undefined') ? currentUser : null;
    if (!user) { alert('Debés iniciar sesión para acceder al aula.'); return; }

    const isGold    = user.plan === 'gold' || user.isDev;
    const isPremium = user.plan === 'premium' || user.plan === 'gold' || user.isDev;

    if (!isPremium) {
        _clShowUpgradeGate();
        return;
    }

    mainContainer.innerHTML = '';
    renderLanguageBar();

    if (isGold) {
        _clRenderTeacherPanel(user);
    } else {
        _clRenderStudentPanel(user);
    }
}

// ─── Gate para plan insuficiente ──────────────────────────────

function _clShowUpgradeGate() {
    mainContainer.innerHTML = `
        <div class="cl-gate">
            <div class="cl-gate-icon">🏫</div>
            <h2>Aula Virtual</h2>
            <p>Para acceder al Aula Virtual necesitás un plan <strong>Premium</strong> (como alumno) o <strong>Gold</strong> (como profesor).</p>
            <button class="cl-gate-btn" onclick="loadMembershipSection()">Ver planes →</button>
        </div>`;
    renderLanguageBar();
}

// ═══════════════════════════════════════════════════════════════
// PANEL DEL PROFESOR (Gold)
// ═══════════════════════════════════════════════════════════════

async function _clRenderTeacherPanel(user) {
    mainContainer.innerHTML = `
        <div class="cl-wrap" id="clWrap">
            <div class="cl-header">
                <button class="school-back-btn" id="clBackBtn">← Volver</button>
                <h2 class="cl-title">🏫 Mi Aula <span class="cl-badge-gold">Gold</span></h2>
                <div class="cl-notif-btn-wrap">
                    <button class="cl-icon-btn" id="clNotifBtn" title="Notificaciones">
                        🔔<span class="cl-notif-badge hidden" id="clNotifBadge"></span>
                    </button>
                </div>
            </div>

            <div class="cl-tabs" id="clTabs">
                <button class="cl-tab active" data-tab="class">📋 Mi Clase</button>
                <button class="cl-tab" data-tab="messages">💬 Mensajes</button>
                <button class="cl-tab" data-tab="students">👥 Alumnos</button>
                <button class="cl-tab" data-tab="profile">⚙️ Mi Perfil</button>
            </div>

            <div class="cl-tab-content" id="clTabContent">
                <div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
            </div>
        </div>`;

    document.getElementById('clBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('clNotifBtn').addEventListener('click', () => _clShowNotifPanel(user));

    // Tab switching
    let _activeClass = null;
    document.querySelectorAll('.cl-tab').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.cl-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            if      (tab === 'class')    await _clTeacherClassTab(user, _activeClass, c => { _activeClass = c; });
            else if (tab === 'messages') await _clTeacherMessagesTab(user, _activeClass);
            else if (tab === 'students') await _clTeacherStudentsTab(user, _activeClass);
            else if (tab === 'profile')  await _clTeacherProfileTab(user);
        });
    });

    // Load initial tab
    await _clTeacherClassTab(user, _activeClass, c => { _activeClass = c; });
    _clPollUnread(user);
}

// Tab: Mi Clase
async function _clTeacherClassTab(user, _activeClass, setActive) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    let data;
    try {
        const r = await _authFetch(`${_API_HOST}/classroom/classes`);
        data = await r.json();
    } catch { content.innerHTML = '<p class="cl-error">Error al cargar clases.</p>'; return; }

    const classes = data.classes || [];

    if (!setActive._initialized && classes.length) {
        setActive(classes[0]);
        setActive._initialized = true;
    }

    content.innerHTML = `
        <div class="cl-section-title">Mis clases</div>

        ${classes.length === 0 ? `
            <div class="cl-empty">
                <p>No tenés clases creadas todavía.</p>
            </div>` : classes.map(c => `
            <div class="cl-class-card ${_activeClass?.id === c.id ? 'selected' : ''}" data-class-id="${c.id}">
                <div class="cl-class-card-head">
                    <span class="cl-class-name">${escapeHtml(c.name)}</span>
                    <span class="cl-class-lang">${_CL_LANG_NAMES[c.target_lang] || c.target_lang}</span>
                </div>
                <div class="cl-class-meta">${(c.students || []).filter(s => s.status === 'active').length} alumnos activos · ${(c.students || []).filter(s => s.status === 'pending').length} pendientes</div>
            </div>`).join('')}

        <button class="cl-add-btn" id="clCreateClassBtn">+ Crear nueva clase</button>
        ${classes.length ? `<div class="cl-section-title" style="margin-top:1rem">Solicitudes pendientes</div>
        ${classes.flatMap(c => (c.students || []).filter(s => s.status === 'pending').map(s => `
            <div class="cl-request-card">
                <span class="cl-request-name">👤 ${escapeHtml(s.username || s.name)}</span>
                <span>solicitó unirse a <strong>${escapeHtml(c.name)}</strong></span>
                <div class="cl-request-actions">
                    <button class="cl-accept-btn" data-class="${c.id}" data-student="${s.student_id}">✓ Aceptar</button>
                    <button class="cl-reject-btn" data-class="${c.id}" data-student="${s.student_id}">✗ Rechazar</button>
                </div>
            </div>`)).join('') || '<p class="cl-muted">Sin solicitudes pendientes.</p>'}` : ''}
    `;

    document.querySelectorAll('.cl-class-card').forEach(card => {
        card.addEventListener('click', async () => {
            const clsId = card.dataset.classId;
            const cls   = classes.find(c => c.id === clsId);
            setActive(cls);
            document.querySelectorAll('.cl-class-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    document.getElementById('clCreateClassBtn').addEventListener('click', () => _clShowCreateClassModal(user, async () => {
        await _clTeacherClassTab(user, null, setActive);
    }));

    document.querySelectorAll('.cl-accept-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            await _authFetch(`${_API_HOST}/classroom/classes/${btn.dataset.class}/respond`, {
                method: 'POST', body: JSON.stringify({ studentId: btn.dataset.student, accept: true })
            });
            await _clTeacherClassTab(user, _activeClass, setActive);
        });
    });
    document.querySelectorAll('.cl-reject-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            await _authFetch(`${_API_HOST}/classroom/classes/${btn.dataset.class}/respond`, {
                method: 'POST', body: JSON.stringify({ studentId: btn.dataset.student, accept: false })
            });
            await _clTeacherClassTab(user, _activeClass, setActive);
        });
    });
}

// Tab: Alumnos
async function _clTeacherStudentsTab(user, _activeClass) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    const r     = await _authFetch(`${_API_HOST}/classroom/classes`);
    const data  = await r.json();
    const classes = data.classes || [];

    if (!classes.length) {
        content.innerHTML = '<p class="cl-muted" style="padding:1rem">Creá primero una clase para ver tus alumnos.</p>';
        return;
    }

    const cls = _activeClass || classes[0];

    content.innerHTML = `
        <div class="cl-select-class-row">
            <select class="cl-class-select" id="clStudentClassSel">
                ${classes.map(c => `<option value="${c.id}" ${c.id === cls.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
            </select>
        </div>

        <div class="cl-add-student-row">
            <input class="cl-input" id="clAddStudentInput" placeholder="Nombre de usuario del alumno" autocomplete="off">
            <button class="cl-add-btn-sm" id="clAddStudentBtn">Agregar</button>
        </div>
        <div class="cl-error hidden" id="clAddStudentErr"></div>

        <div class="cl-students-list" id="clStudentsList">
            ${_clRenderStudentsList(cls)}
        </div>`;

    document.getElementById('clStudentClassSel').addEventListener('change', async e => {
        const selected = classes.find(c => c.id === e.target.value);
        document.getElementById('clStudentsList').innerHTML = _clRenderStudentsList(selected);
        _bindRemoveStudents(selected, user);
    });

    document.getElementById('clAddStudentBtn').addEventListener('click', async () => {
        const selId    = document.getElementById('clStudentClassSel').value;
        const username = document.getElementById('clAddStudentInput').value.trim();
        const errEl    = document.getElementById('clAddStudentErr');
        if (!username) return;
        const r2   = await _authFetch(`${_API_HOST}/classroom/classes/${selId}/students`, {
            method: 'POST', body: JSON.stringify({ username })
        });
        const res2 = await r2.json();
        if (!res2.ok) {
            errEl.textContent = res2.error; errEl.classList.remove('hidden'); return;
        }
        errEl.classList.add('hidden');
        document.getElementById('clAddStudentInput').value = '';
        await _clTeacherStudentsTab(user, _activeClass);
    });

    _bindRemoveStudents(cls, user);
}

function _clRenderStudentsList(cls) {
    const active  = (cls.students || []).filter(s => s.status === 'active');
    const pending = (cls.students || []).filter(s => s.status === 'pending');
    if (!active.length && !pending.length) return '<p class="cl-muted">Sin alumnos en esta clase.</p>';
    return [
        ...active.map(s => `
            <div class="cl-student-card" data-student-id="${s.student_id}" data-class-id="${cls.id}">
                <div class="cl-student-avatar">👤</div>
                <div class="cl-student-info">
                    <span class="cl-student-name">${escapeHtml(s.name || s.username || '—')}</span>
                    <span class="cl-student-user">@${escapeHtml(s.username || '—')}</span>
                </div>
                <span class="cl-status-badge cl-status-active">activo</span>
                <button class="cl-remove-btn" data-student="${s.student_id}" data-class="${cls.id}" title="Quitar alumno">✕</button>
            </div>`),
        ...pending.map(s => `
            <div class="cl-student-card">
                <div class="cl-student-avatar">👤</div>
                <div class="cl-student-info">
                    <span class="cl-student-name">${escapeHtml(s.name || s.username || '—')}</span>
                    <span class="cl-student-user">@${escapeHtml(s.username || '—')}</span>
                </div>
                <span class="cl-status-badge cl-status-pending">pendiente</span>
            </div>`)
    ].join('');
}

function _bindRemoveStudents(cls, user) {
    document.querySelectorAll('.cl-remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('¿Querés quitar a este alumno de la clase?')) return;
            await _authFetch(`${_API_HOST}/classroom/classes/${btn.dataset.class}/students/${btn.dataset.student}`, { method: 'DELETE' });
            await _clTeacherStudentsTab(user, null);
        });
    });
}

// Tab: Mensajes
async function _clTeacherMessagesTab(user, _activeClass) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    const r    = await _authFetch(`${_API_HOST}/classroom/classes`);
    const data = await r.json();
    const classes = data.classes || [];

    if (!classes.length) {
        content.innerHTML = '<p class="cl-muted" style="padding:1rem">Creá primero una clase.</p>';
        return;
    }
    const cls = _activeClass || classes[0];
    _clRenderChatUI(content, user, cls, classes, true);
}

// Tab: Mi Perfil (profesor)
async function _clTeacherProfileTab(user) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    let profile = {};
    try {
        const r = await _authFetch(`${_API_HOST}/classroom/teacher/profile`);
        const d = await r.json();
        profile = d.profile || {};
    } catch {}

    const currentLangs = profile.target_langs || [];

    content.innerHTML = `
        <div class="cl-section-title">Mi perfil de profesor</div>

        <div class="cl-profile-form">
            <label class="cl-label">Disponibilidad</label>
            <div class="cl-status-toggle" id="clStatusToggle">
                <button class="cl-status-opt ${profile.status !== 'unavailable' ? 'active' : ''}" data-val="available">🟢 Disponible</button>
                <button class="cl-status-opt ${profile.status === 'unavailable' ? 'active' : ''}" data-val="unavailable">🔴 No disponible</button>
            </div>

            <label class="cl-label">Presentación</label>
            <textarea class="cl-textarea" id="clBio" rows="4"
                placeholder="Describí tu experiencia como profesor, metodología, idiomas que enseñás...">${escapeHtml(profile.bio || '')}</textarea>

            <label class="cl-label">Idiomas que enseñás</label>
            <div class="cl-lang-checkboxes" id="clLangChecks">
                ${Object.entries(_CL_LANG_NAMES).filter(([k]) => k !== 'es').map(([k,v]) => `
                    <label class="cl-lang-check">
                        <input type="checkbox" value="${k}" ${currentLangs.includes(k) ? 'checked' : ''}> ${v}
                    </label>`).join('')}
            </div>

            <button class="cl-save-btn" id="clSaveProfileBtn">Guardar perfil</button>
            <div class="cl-success hidden" id="clProfileOk">✅ Perfil guardado correctamente.</div>

            ${profile.rating_count > 0 ? `
            <div class="cl-rating-display">
                <span class="cl-stars">${_clStars(profile.rating)}</span>
                <span class="cl-rating-num">${profile.rating} / 5</span>
                <span class="cl-rating-count">(${profile.rating_count} calificación${profile.rating_count !== 1 ? 'es' : ''})</span>
            </div>` : ''}
        </div>`;

    let _status = profile.status || 'available';
    document.querySelectorAll('.cl-status-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            _status = btn.dataset.val;
            document.querySelectorAll('.cl-status-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('clSaveProfileBtn').addEventListener('click', async () => {
        const bio         = document.getElementById('clBio').value.trim();
        const targetLangs = [...document.querySelectorAll('#clLangChecks input:checked')].map(i => i.value);
        const r           = await _authFetch(`${_API_HOST}/classroom/teacher/profile`, {
            method: 'POST', body: JSON.stringify({ bio, targetLangs, status: _status })
        });
        const d = await r.json();
        if (d.ok) { document.getElementById('clProfileOk').classList.remove('hidden'); }
    });
}

// Modal: Crear clase
function _clShowCreateClassModal(user, onSuccess) {
    const overlay = document.createElement('div');
    overlay.className = 'cl-modal-overlay';
    overlay.innerHTML = `
        <div class="cl-modal">
            <button class="cl-modal-close" id="clModalClose">×</button>
            <h3>Nueva clase</h3>
            <label class="cl-label">Nombre de la clase</label>
            <input class="cl-input" id="clClassName" placeholder="Ej: Inglés A1 - Mañana">
            <label class="cl-label">Idioma que van a aprender</label>
            <select class="cl-input" id="clClassLang">
                ${Object.entries(_CL_LANG_NAMES).filter(([k]) => k !== 'es').map(([k,v]) => `<option value="${k}">${v}</option>`).join('')}
            </select>
            <div class="cl-error hidden" id="clCreateClassErr"></div>
            <button class="cl-save-btn" id="clCreateClassConfirm">Crear clase</button>
        </div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('clModalClose').addEventListener('click', () => overlay.remove());

    document.getElementById('clCreateClassConfirm').addEventListener('click', async () => {
        const name       = document.getElementById('clClassName').value.trim();
        const targetLang = document.getElementById('clClassLang').value;
        if (!name) { document.getElementById('clCreateClassErr').textContent = 'Ingresá un nombre.'; document.getElementById('clCreateClassErr').classList.remove('hidden'); return; }
        const r   = await _authFetch(`${_API_HOST}/classroom/classes`, { method: 'POST', body: JSON.stringify({ name, targetLang }) });
        const res = await r.json();
        if (res.ok) { overlay.remove(); onSuccess(); }
        else { document.getElementById('clCreateClassErr').textContent = res.error; document.getElementById('clCreateClassErr').classList.remove('hidden'); }
    });
}

// ═══════════════════════════════════════════════════════════════
// PANEL DEL ALUMNO (Premium)
// ═══════════════════════════════════════════════════════════════

async function _clRenderStudentPanel(user) {
    mainContainer.innerHTML = `
        <div class="cl-wrap" id="clWrap">
            <div class="cl-header">
                <button class="school-back-btn" id="clBackBtn">← Volver</button>
                <h2 class="cl-title">🏫 Mi Aula</h2>
                <div class="cl-notif-btn-wrap">
                    <button class="cl-icon-btn" id="clNotifBtn" title="Notificaciones">
                        🔔<span class="cl-notif-badge hidden" id="clNotifBadge"></span>
                    </button>
                </div>
            </div>

            <div class="cl-tabs" id="clTabs">
                <button class="cl-tab active" data-tab="myclass">🏫 Mi Clase</button>
                <button class="cl-tab" data-tab="messages">💬 Mensajes</button>
                <button class="cl-tab" data-tab="teachers">🔍 Profesores</button>
            </div>

            <div class="cl-tab-content" id="clTabContent">
                <div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
            </div>
        </div>`;

    document.getElementById('clBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('clNotifBtn').addEventListener('click', () => _clShowNotifPanel(user));

    document.querySelectorAll('.cl-tab').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.cl-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            if      (tab === 'myclass')  await _clStudentMyClassTab(user);
            else if (tab === 'messages') await _clStudentMessagesTab(user);
            else if (tab === 'teachers') await _clStudentTeachersTab(user);
        });
    });

    await _clStudentMyClassTab(user);
    _clPollUnread(user);
}

// Tab: Mi Clase (alumno)
async function _clStudentMyClassTab(user) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    const r    = await _authFetch(`${_API_HOST}/classroom/my-enrollment`);
    const data = await r.json();
    const enrollments = data.enrollments || [];

    if (!enrollments.length) {
        content.innerHTML = `
            <div class="cl-empty">
                <div style="font-size:2.5rem;margin-bottom:.5rem">🏫</div>
                <p>Todavía no estás inscripto en ninguna clase.</p>
                <p class="cl-muted">Buscá un profesor en la pestaña <strong>Profesores</strong>.</p>
                <button class="cl-add-btn" onclick="document.querySelector('[data-tab=teachers]').click()">Buscar profesores →</button>
            </div>`;
        return;
    }

    content.innerHTML = enrollments.map(e => `
        <div class="cl-enrollment-card">
            <div class="cl-enrollment-head">
                <div>
                    <div class="cl-class-name">${escapeHtml(e.name)}</div>
                    <div class="cl-class-lang">${_CL_LANG_NAMES[e.target_lang] || e.target_lang}</div>
                </div>
                <span class="cl-status-badge cl-status-active">activo</span>
            </div>
            <div class="cl-teacher-row">
                <span class="cl-teacher-avatar">👨‍🏫</span>
                <div>
                    <div class="cl-teacher-name">${escapeHtml(e.teacher_name || '—')}</div>
                    <div class="cl-muted" style="font-size:.8rem">@${escapeHtml(e.teacher_username || '—')}</div>
                </div>
                <span class="cl-teacher-status ${e.teacher_status === 'available' ? 'available' : 'unavailable'}">
                    ${e.teacher_status === 'available' ? '🟢 Disponible' : '🔴 No disponible'}
                </span>
            </div>
            ${e.bio ? `<p class="cl-bio-snippet">${escapeHtml(e.bio.slice(0, 120))}${e.bio.length > 120 ? '…' : ''}</p>` : ''}
            ${e.rating > 0 ? `<div class="cl-stars-small">${_clStars(e.rating)} <span class="cl-rating-num">${e.rating}</span></div>` : ''}
            <button class="cl-rate-btn" data-teacher="${e.teacher_id}" data-name="${escapeHtml(e.teacher_name || 'Profesor')}">⭐ Calificar profesor</button>
        </div>`).join('');

    document.querySelectorAll('.cl-rate-btn').forEach(btn => {
        btn.addEventListener('click', () => _clShowRatingModal(btn.dataset.teacher, btn.dataset.name));
    });
}

// Tab: Mensajes (alumno)
async function _clStudentMessagesTab(user) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    const r    = await _authFetch(`${_API_HOST}/classroom/my-enrollment`);
    const data = await r.json();
    const enrollments = data.enrollments || [];

    if (!enrollments.length) {
        content.innerHTML = '<p class="cl-muted" style="padding:1rem">Primero inscribite en una clase.</p>';
        return;
    }
    const e   = enrollments[0];
    const cls = { id: e.class_id, name: e.name, teacher_id: e.teacher_id };
    _clRenderChatUI(content, user, cls, [], false);
}

// Tab: Profesores disponibles
async function _clStudentTeachersTab(user) {
    const content = document.getElementById('clTabContent');
    content.innerHTML = `<div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    const lang = (typeof targetLang !== 'undefined') ? targetLang : '';

    let data;
    try {
        const r = await _authFetch(`${_API_HOST}/classroom/teachers?lang=${lang}`);
        data = await r.json();
    } catch { content.innerHTML = '<p class="cl-error">Error al cargar profesores.</p>'; return; }

    const teachers = data.teachers || [];

    content.innerHTML = `
        <div class="cl-section-title">Profesores disponibles ${lang ? `para ${_CL_LANG_NAMES[lang] || lang}` : ''}</div>
        <div class="cl-teacher-filter">
            <select class="cl-input" id="clLangFilter">
                <option value="">Todos los idiomas</option>
                ${Object.entries(_CL_LANG_NAMES).filter(([k]) => k !== 'es').map(([k,v]) => `<option value="${k}" ${k === lang ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
        </div>
        <div class="cl-teachers-grid" id="clTeachersGrid">
            ${_clRenderTeacherCards(teachers)}
        </div>`;

    document.getElementById('clLangFilter').addEventListener('change', async e => {
        const r2   = await _authFetch(`${_API_HOST}/classroom/teachers?lang=${e.target.value}`);
        const d2   = await r2.json();
        document.getElementById('clTeachersGrid').innerHTML = _clRenderTeacherCards(d2.teachers || []);
        _bindTeacherCards(user);
    });
    _bindTeacherCards(user);
}

function _clRenderTeacherCards(teachers) {
    if (!teachers.length) return '<p class="cl-muted">No hay profesores disponibles para este idioma todavía.</p>';
    return teachers.map(t => `
        <div class="cl-teacher-card" data-teacher-id="${t.teacher_id}">
            <div class="cl-tc-head">
                <div class="cl-tc-avatar">👨‍🏫</div>
                <div>
                    <div class="cl-tc-name">${escapeHtml(t.name || '—')}</div>
                    <div class="cl-muted" style="font-size:.78rem">@${escapeHtml(t.username || '—')}</div>
                </div>
                <span class="cl-teacher-status ${t.status === 'available' ? 'available' : 'unavailable'}">
                    ${t.status === 'available' ? '🟢' : '🔴'}
                </span>
            </div>
            <div class="cl-tc-langs">${(t.target_langs || []).map(l => `<span class="cl-lang-chip">${_CL_LANG_NAMES[l] || l}</span>`).join('')}</div>
            ${t.bio ? `<p class="cl-tc-bio">${escapeHtml(t.bio.slice(0, 100))}${t.bio.length > 100 ? '…' : ''}</p>` : ''}
            ${t.rating_count > 0 ? `<div class="cl-stars-small">${_clStars(t.rating)} <span class="cl-rating-num">${t.rating}</span></div>` : '<span class="cl-muted" style="font-size:.75rem">Sin calificaciones aún</span>'}
            <div class="cl-tc-actions">
                <button class="cl-view-btn" data-teacher-id="${t.teacher_id}">Ver perfil</button>
                ${t.status === 'available' ? `<button class="cl-request-btn" data-teacher-id="${t.teacher_id}" data-name="${escapeHtml(t.name || 'el profesor')}">Solicitar ingreso</button>` : ''}
            </div>
        </div>`).join('');
}

function _bindTeacherCards(user) {
    document.querySelectorAll('.cl-view-btn').forEach(btn => {
        btn.addEventListener('click', () => _clShowTeacherProfile(btn.dataset.teacherId, user));
    });
    document.querySelectorAll('.cl-request-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(`¿Querés solicitar unirte a la clase de ${btn.dataset.name}?`)) return;
            const r   = await _authFetch(`${_API_HOST}/classroom/request/${btn.dataset.teacherId}`, { method: 'POST', body: '{}' });
            const res = await r.json();
            alert(res.ok ? '✅ Solicitud enviada. El profesor recibirá una notificación.' : ('⚠️ ' + res.error));
        });
    });
}

// Modal: Perfil completo del profesor
async function _clShowTeacherProfile(teacherId, user) {
    const overlay = document.createElement('div');
    overlay.className = 'cl-modal-overlay';
    overlay.innerHTML = `<div class="cl-modal cl-modal--profile"><div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    try {
        const r    = await _authFetch(`${_API_HOST}/classroom/teachers/${teacherId}`);
        const data = await r.json();
        const p    = data.profile || {};
        const cls  = data.classes || [];

        overlay.querySelector('.cl-modal').innerHTML = `
            <button class="cl-modal-close" id="clProfClose">×</button>
            <div class="cl-prof-head">
                <div class="cl-prof-avatar">👨‍🏫</div>
                <div>
                    <h3 class="cl-prof-name">${escapeHtml(p.name || '—')}</h3>
                    <div class="cl-muted">@${escapeHtml(p.username || '—')}</div>
                    <span class="cl-teacher-status ${p.status === 'available' ? 'available' : 'unavailable'}">
                        ${p.status === 'available' ? '🟢 Disponible' : '🔴 No disponible'}
                    </span>
                </div>
            </div>
            ${p.rating_count > 0 ? `<div class="cl-rating-display">${_clStars(p.rating)} ${p.rating}/5 <span class="cl-muted">(${p.rating_count} cal.)</span></div>` : ''}
            <div class="cl-prof-langs">${(p.target_langs || []).map(l => `<span class="cl-lang-chip">${_CL_LANG_NAMES[l] || l}</span>`).join('')}</div>
            ${p.bio ? `<p class="cl-prof-bio">${escapeHtml(p.bio)}</p>` : '<p class="cl-muted">Sin presentación todavía.</p>'}
            ${cls.length ? `<div class="cl-section-title" style="margin-top:.75rem">Clases disponibles</div>
            ${cls.map(c => `<div class="cl-class-pill">${escapeHtml(c.name)} <span class="cl-lang-chip">${_CL_LANG_NAMES[c.target_lang] || c.target_lang}</span></div>`).join('')}` : ''}
            ${p.status === 'available' ? `<button class="cl-save-btn" style="margin-top:.75rem" id="clProfRequest">Solicitar ingreso</button>` : '<p class="cl-muted" style="margin-top:.5rem">Este profesor no está aceptando alumnos por el momento.</p>'}`;

        overlay.querySelector('#clProfClose').addEventListener('click', () => overlay.remove());
        overlay.querySelector('#clProfRequest')?.addEventListener('click', async () => {
            const r2  = await _authFetch(`${_API_HOST}/classroom/request/${teacherId}`, { method: 'POST', body: '{}' });
            const res = await r2.json();
            alert(res.ok ? '✅ Solicitud enviada.' : ('⚠️ ' + res.error));
            overlay.remove();
        });
    } catch { overlay.querySelector('.cl-modal').innerHTML = '<p>Error al cargar el perfil.</p>'; }
}

// Modal: Calificar profesor
function _clShowRatingModal(teacherId, teacherName) {
    const overlay = document.createElement('div');
    overlay.className = 'cl-modal-overlay';
    overlay.innerHTML = `
        <div class="cl-modal">
            <button class="cl-modal-close" id="clRatClose">×</button>
            <h3>Calificar a ${escapeHtml(teacherName)}</h3>
            <div class="cl-star-picker" id="clStarPicker">
                ${[1,2,3,4,5].map(n => `<button class="cl-star-pick" data-score="${n}">★</button>`).join('')}
            </div>
            <textarea class="cl-textarea" id="clRatComment" rows="3" placeholder="Comentario opcional..."></textarea>
            <button class="cl-save-btn" id="clRatSend">Enviar calificación</button>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('#clRatClose').addEventListener('click', () => overlay.remove());

    let _score = 0;
    overlay.querySelectorAll('.cl-star-pick').forEach(btn => {
        btn.addEventListener('click', () => {
            _score = parseInt(btn.dataset.score);
            overlay.querySelectorAll('.cl-star-pick').forEach((b, i) => {
                b.classList.toggle('selected', i < _score);
            });
        });
    });

    overlay.querySelector('#clRatSend').addEventListener('click', async () => {
        if (!_score) { alert('Seleccioná una calificación.'); return; }
        const comment = overlay.querySelector('#clRatComment').value.trim();
        const r   = await _authFetch(`${_API_HOST}/classroom/rate/${teacherId}`, {
            method: 'POST', body: JSON.stringify({ score: _score, comment })
        });
        const res = await r.json();
        alert(res.ok ? '✅ Calificación guardada.' : '⚠️ Error al guardar.');
        overlay.remove();
    });
}

// ═══════════════════════════════════════════════════════════════
// CHAT COMPARTIDO (grupo + DM)
// ═══════════════════════════════════════════════════════════════

function _clRenderChatUI(container, user, cls, allClasses, isTeacher) {
    const otherParty = isTeacher ? 'alumno' : 'profesor';
    container.innerHTML = `
        <div class="cl-chat-wrap">
            ${allClasses.length > 1 ? `
            <div class="cl-select-class-row">
                <select class="cl-class-select" id="clChatClassSel">
                    ${allClasses.map(c => `<option value="${c.id}" ${c.id === cls.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
                </select>
            </div>` : `<div class="cl-chat-class-name">💬 ${escapeHtml(cls.name)}</div>`}

            <div class="cl-chat-tabs">
                <button class="cl-chat-subtab active" id="clGroupTab">Grupo</button>
                <button class="cl-chat-subtab" id="clDMTab">Privado (${otherParty})</button>
            </div>

            <div class="cl-chat-msgs" id="clChatMsgs">
                <div class="cl-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
            </div>

            <div class="cl-chat-input-row">
                <textarea class="lt-chat-input" id="clChatInput" rows="2" placeholder="Escribí un mensaje..."></textarea>
                <button class="lt-chat-send" id="clChatSend">→</button>
            </div>
        </div>`;

    let _mode = 'group'; // 'group' | 'dm'
    let _dmTarget = null; // For teacher: need to select student; for student: teacher
    let _pollInterval = null;

    const loadMessages = async () => {
        const msgsEl = document.getElementById('clChatMsgs');
        if (!msgsEl) { clearInterval(_pollInterval); return; }
        try {
            let r, data;
            if (_mode === 'group') {
                r    = await _authFetch(`${_API_HOST}/classroom/messages/${cls.id}`);
                data = await r.json();
            } else {
                if (!_dmTarget) { msgsEl.innerHTML = `<p class="cl-muted">Seleccioná un ${otherParty} para el chat privado.</p>`; return; }
                r    = await _authFetch(`${_API_HOST}/classroom/messages/${cls.id}/dm/${_dmTarget}`);
                data = await r.json();
            }
            const msgs = data.messages || [];
            const scrolledToBottom = msgsEl.scrollHeight - msgsEl.scrollTop <= msgsEl.clientHeight + 40;
            msgsEl.innerHTML = msgs.length
                ? msgs.map(m => `
                    <div class="lt-chat-msg ${m.sender_id === user.id ? 'lt-chat-msg--user' : 'lt-chat-msg--ai'}">
                        ${m.sender_id !== user.id ? `<span class="cl-msg-sender">${escapeHtml(m.sender_username || m.sender_name || '—')}</span>` : ''}
                        ${escapeHtml(m.content)}
                        <span class="cl-msg-time">${_clFmtTime(m.created_at)}</span>
                    </div>`).join('')
                : '<p class="cl-muted" style="text-align:center;margin-top:2rem">Sin mensajes todavía.</p>';
            if (scrolledToBottom || msgs.length < 3) msgsEl.scrollTop = msgsEl.scrollHeight;
        } catch {}
    };

    const sendMessage = async () => {
        const input   = document.getElementById('clChatInput');
        const content = input?.value.trim();
        if (!content) return;
        input.value = '';

        if (_mode === 'group') {
            await _authFetch(`${_API_HOST}/classroom/messages/${cls.id}`, { method: 'POST', body: JSON.stringify({ content }) });
        } else {
            if (!_dmTarget) return;
            await _authFetch(`${_API_HOST}/classroom/messages/${cls.id}/dm/${_dmTarget}`, { method: 'POST', body: JSON.stringify({ content }) });
        }
        await loadMessages();
    };

    document.getElementById('clChatSend').addEventListener('click', sendMessage);
    document.getElementById('clChatInput').addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    document.getElementById('clGroupTab').addEventListener('click', async () => {
        _mode = 'group';
        document.getElementById('clGroupTab').classList.add('active');
        document.getElementById('clDMTab').classList.remove('active');
        await loadMessages();
    });

    document.getElementById('clDMTab').addEventListener('click', async () => {
        _mode = 'dm';
        document.getElementById('clDMTab').classList.add('active');
        document.getElementById('clGroupTab').classList.remove('active');

        if (isTeacher) {
            // Teacher picks a student
            const r2   = await _authFetch(`${_API_HOST}/classroom/classes`);
            const d2   = await r2.json();
            const thisCls = (d2.classes || []).find(c => c.id === cls.id);
            const active  = (thisCls?.students || []).filter(s => s.status === 'active');
            if (!active.length) {
                document.getElementById('clChatMsgs').innerHTML = '<p class="cl-muted">No hay alumnos activos en esta clase.</p>';
                return;
            }
            if (!_dmTarget) _dmTarget = active[0].student_id;
            // Show a mini picker
            const msgsEl = document.getElementById('clChatMsgs');
            msgsEl.insertAdjacentHTML('afterbegin', `
                <div class="cl-dm-picker">
                    <select class="cl-class-select" id="clDMStudentSel">
                        ${active.map(s => `<option value="${s.student_id}">${escapeHtml(s.username || s.name)}</option>`).join('')}
                    </select>
                </div>`);
            document.getElementById('clDMStudentSel').addEventListener('change', async e => {
                _dmTarget = e.target.value;
                await loadMessages();
            });
        } else {
            // Student DMs the teacher
            _dmTarget = cls.teacher_id;
        }
        await loadMessages();
    });

    // Polling every 12 seconds
    loadMessages();
    _pollInterval = setInterval(loadMessages, 12000);

    // Stop polling when leaving section
    const observer = new MutationObserver(() => {
        if (!document.getElementById('clChatMsgs')) {
            clearInterval(_pollInterval);
            observer.disconnect();
        }
    });
    observer.observe(document.getElementById('mainContainer'), { childList: true, subtree: false });
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICACIONES
// ═══════════════════════════════════════════════════════════════

async function _clShowNotifPanel(user) {
    const r    = await _authFetch(`${_API_HOST}/classroom/notifications`);
    const data = await r.json();
    const notifs = data.notifications || [];

    const overlay = document.createElement('div');
    overlay.className = 'cl-modal-overlay';
    overlay.innerHTML = `
        <div class="cl-modal cl-modal--notif">
            <button class="cl-modal-close" id="clNotifClose">×</button>
            <h3>🔔 Notificaciones</h3>
            <div class="cl-notif-list">
                ${notifs.length ? notifs.map(n => `
                    <div class="cl-notif-item ${n.is_read ? '' : 'unread'}" data-id="${n.id}">
                        <span class="cl-notif-icon">${_clNotifIcon(n.type)}</span>
                        <div class="cl-notif-body">
                            <p>${_clNotifText(n)}</p>
                            <span class="cl-notif-time">${_clFmtTime(n.created_at)}</span>
                        </div>
                    </div>`).join('')
                : '<p class="cl-muted">Sin notificaciones.</p>'}
            </div>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('clNotifClose').addEventListener('click', () => overlay.remove());

    // Mark all unread as read
    notifs.filter(n => !n.is_read).forEach(async n => {
        await _authFetch(`${_API_HOST}/classroom/notifications/${n.id}/read`, { method: 'POST', body: '{}' });
    });
    document.getElementById('clNotifBadge')?.classList.add('hidden');
}

function _clNotifIcon(type) {
    const icons = { student_request: '👋', student_added: '🏫', request_approved: '✅', request_rejected: '❌', new_message: '💬' };
    return icons[type] || '🔔';
}

function _clNotifText(n) {
    const p = n.payload || {};
    switch (n.type) {
        case 'student_request':   return `Un alumno solicitó unirse a tu clase.`;
        case 'student_added':     return `Fuiste agregado a la clase <strong>${escapeHtml(p.className || '—')}</strong>.`;
        case 'request_approved':  return `Tu solicitud para la clase <strong>${escapeHtml(p.className || '—')}</strong> fue aprobada.`;
        case 'request_rejected':  return `Tu solicitud para la clase <strong>${escapeHtml(p.className || '—')}</strong> fue rechazada.`;
        case 'new_message':       return `Recibiste un mensaje privado.`;
        default:                  return 'Nueva notificación.';
    }
}

// Polling de notificaciones (badge)
function _clPollUnread(user) {
    const poll = async () => {
        if (!document.getElementById('clWrap')) return; // salir si cambiamos de sección
        try {
            const r    = await _authFetch(`${_API_HOST}/classroom/unread`);
            const data = await r.json();
            const badge = document.getElementById('clNotifBadge');
            if (badge) {
                if ((data.unread || 0) > 0) {
                    badge.textContent = data.unread;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch {}
        if (document.getElementById('clWrap')) setTimeout(poll, 30000);
    };
    setTimeout(poll, 5000);
}

// ─── Utils ────────────────────────────────────────────────────

function _clStars(rating) {
    const full  = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function _clFmtTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' ' +
           d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
}
