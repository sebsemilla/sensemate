// admin.js — Panel de administración (solo isDev)
// ================================================

let ADMIN_TOKEN = null;

async function _loadAdminToken() {
    if (ADMIN_TOKEN) return ADMIN_TOKEN;
    try {
        const session = JSON.parse(localStorage.getItem('ls_session') || '{}');
        const res = await fetch(`${_API_HOST}/auth/admin-token`, {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        if (res.ok) ADMIN_TOKEN = (await res.json()).token;
    } catch {}
    return ADMIN_TOKEN;
}

function isAdmin() {
    return currentUser?.isDev === true;
}

async function loadAdminPanel() {
    if (!isAdmin()) return;
    await _loadAdminToken();

    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="admin-panel">
            <div class="admin-header">
                <button class="school-back-btn" id="adminBackBtn">← Volver</button>
                <h2 class="admin-title">🛡️ Panel de Administración</h2>
                <div class="admin-badge">Dev Mode</div>
            </div>

            <!-- Barra de navegación reorganizada -->
            <div class="admin-nav">

                <!-- Dropdown "Secciones" (izquierda) -->
                <div class="admin-sections-wrap" id="adminSectionsWrap">
                    <button class="admin-sections-btn" id="adminSectionsBtn">
                        Secciones
                        <svg class="admin-sections-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="admin-sections-menu hidden" id="adminSectionsMenu">

                        <!-- Grupo: Contenidos -->
                        <div class="admin-sec-group">
                            <span class="admin-sec-group-label">Contenidos</span>
                            <button class="admin-sec-item" data-tab="songs" id="adminTabSongs">🎵 Canciones</button>
                            <button class="admin-sec-item" data-tab="writers" id="adminTabWriters">📖 Escritores</button>
                            <button class="admin-sec-item" data-tab="flashcards" id="adminTabFlashcards">📇 Flashcards</button>
                        </div>

                        <div class="admin-sec-divider"></div>
                        <button class="admin-sec-item" data-tab="contributors">👥 Contributores</button>
                        <button class="admin-sec-item" data-tab="teachers">🏫 Profesores</button>
                        <button class="admin-sec-item" data-tab="tools">🔧 Herramientas</button>
                        <button class="admin-sec-item" data-tab="membership">💳 Membresías</button>
                        <button class="admin-sec-item" data-tab="bots">🤖 Bots</button>
                    </div>
                </div>

                <!-- Tabs inline (derecha del dropdown) -->
                <div class="admin-inline-tabs">
                    <button class="admin-tab active" data-tab="feedback">📢 Feedback</button>
                    <button class="admin-tab" data-tab="stats">📊 Estadísticas</button>
                    <button class="admin-tab" data-tab="users">👤 Usuarios</button>
                </div>

            </div>

            <div id="adminTabContent" class="admin-tab-content">
                <div class="admin-loading">
                    <div class="school-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
    `);

    document.getElementById('adminBackBtn').addEventListener('click', () => showMainMenu());

    // Dropdown Secciones — toggle
    const sectBtn  = document.getElementById('adminSectionsBtn');
    const sectMenu = document.getElementById('adminSectionsMenu');
    sectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sectMenu.classList.toggle('hidden');
        sectBtn.classList.toggle('open');
    });
    document.addEventListener('click', () => {
        sectMenu.classList.add('hidden');
        sectBtn.classList.remove('open');
    }, { capture: false });

    // Helper: activa visualmente la tab/item correcta
    function _setActive(tab) {
        document.querySelectorAll('.admin-tab, .admin-sec-item').forEach(b => b.classList.remove('active'));
        // Marcar inline tab si corresponde
        document.querySelectorAll(`.admin-tab[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
        // Marcar sec-item si corresponde
        document.querySelectorAll(`.admin-sec-item[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
        // Si es del dropdown, mostrar label en el botón
        const secItem = document.querySelector(`.admin-sec-item[data-tab="${tab}"]`);
        if (secItem) {
            sectBtn.querySelector('span') && (sectBtn.querySelector('span').textContent = secItem.textContent.trim());
        }
    }

    // Tabs inline
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            _setActive(btn.dataset.tab);
            _adminLoadTab(btn.dataset.tab);
        });
    });

    // Items del dropdown
    document.querySelectorAll('.admin-sec-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sectMenu.classList.add('hidden');
            sectBtn.classList.remove('open');
            _setActive(btn.dataset.tab);
            _adminLoadTab(btn.dataset.tab);
        });
    });

    _adminLoadTab('feedback');

    // Badge de canciones pendientes
    fetch(_API_HOST + '/admin/songs', { headers: { 'x-admin-token': ADMIN_TOKEN } })
        .then(r => r.json())
        .then(songs => {
            const pending = songs.filter(s => s.status === 'pending').length;
            if (pending > 0) {
                const tab = document.getElementById('adminTabSongs');
                if (tab) tab.insertAdjacentHTML('beforeend',
                    `<span class="admin-music-badge">${pending}</span>`);
            }
        })
        .catch(() => {});
}

async function _adminFetchFeedback() {
    const res = await fetch(_API_HOST + '/admin/feedback', {
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    if (!res.ok) throw new Error('Error al cargar feedback');
    return res.json();
}

async function _adminLoadTab(tab) {
    const content = document.getElementById('adminTabContent');
    content.innerHTML = `<div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>`;

    try {
        if (tab === 'feedback') {
            await _adminRenderFeedback(content);
        } else if (tab === 'songs') {
            await _adminRenderSongs(content);
        } else if (tab === 'writers') {
            await _adminRenderWriters(content);
        } else if (tab === 'flashcards') {
            await _adminRenderFlashcardGroups(content);
        } else if (tab === 'stats') {
            await _adminRenderStats(content);
        } else if (tab === 'contributors') {
            await _adminRenderContributors(content);
        } else if (tab === 'tools') {
            _adminRenderTools(content);
        } else if (tab === 'membership') {
            await _adminRenderMembership(content);
        } else if (tab === 'users') {
            await _adminRenderUsers(content);
        } else if (tab === 'teachers') {
            await _adminRenderTeachers(content);
        } else if (tab === 'bots') {
            await _adminRenderBots(content);
        }
    } catch (err) {
        content.innerHTML = `<div class="admin-error">❌ Error: ${escapeHtml(err.message)}</div>`;
    }
}

async function _adminRenderFeedback(container) {
    const entries = await _adminFetchFeedback();

    if (entries.length === 0) {
        container.innerHTML = `<div class="admin-empty">📭 No hay feedback todavía.</div>`;
        return;
    }

    const unreadCount = entries.filter(e => !e.read).length;

    container.innerHTML = `
        <div class="admin-feedback-header">
            <span class="admin-count">${entries.length} entradas${unreadCount > 0 ? ` · <span class="admin-unread">${unreadCount} sin leer</span>` : ''}</span>
            <button class="admin-mark-all-btn" id="adminMarkAllBtn">✓ Marcar todas como leídas</button>
        </div>
        <div class="admin-feedback-list" id="adminFeedbackList">
            ${entries.map(e => _adminFeedbackCard(e)).join('')}
        </div>
    `;

    document.getElementById('adminMarkAllBtn')?.addEventListener('click', () => _adminMarkAllRead());

    container.querySelectorAll('.admin-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm('¿Eliminar esta entrada?')) return;
            await _adminDeleteEntry(id);
            _adminLoadTab('feedback');
        });
    });

    container.querySelectorAll('.admin-read-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await _adminMarkRead(id);
            const card = btn.closest('.admin-fb-card');
            card?.classList.remove('admin-fb-card--unread');
            btn.remove();
        });
    });
}

function _adminFeedbackCard(entry) {
    const date = new Date(entry.date).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const unreadCls = !entry.read ? 'admin-fb-card--unread' : '';
    return `
        <div class="admin-fb-card ${unreadCls}" data-id="${entry.id}">
            <div class="admin-fb-card-header">
                <div class="admin-fb-meta">
                    <span class="admin-fb-user">👤 ${escapeHtml(entry.user)}</span>
                    <span class="admin-fb-date">🕒 ${date}</span>
                </div>
                <div class="admin-fb-actions">
                    ${!entry.read ? `<button class="admin-read-btn" data-id="${entry.id}" title="Marcar como leído">✓</button>` : ''}
                    <button class="admin-delete-btn" data-id="${entry.id}" title="Eliminar">🗑</button>
                </div>
            </div>
            ${entry.subject ? `<div class="admin-fb-subject">📌 ${escapeHtml(entry.subject)}</div>` : ''}
            ${entry.comments ? `
                <div class="admin-fb-block">
                    <span class="admin-fb-tag admin-fb-tag--complaint">Queja</span>
                    <p>${escapeHtml(entry.comments)}</p>
                </div>` : ''}
            ${entry.strengths ? `
                <div class="admin-fb-block">
                    <span class="admin-fb-tag admin-fb-tag--strength">Positivo</span>
                    <p>${escapeHtml(entry.strengths)}</p>
                </div>` : ''}
        </div>
    `;
}

async function _adminRenderStats(container) {
    const entries = await _adminFetchFeedback();

    const total    = entries.length;
    const unread   = entries.filter(e => !e.read).length;
    const guests   = entries.filter(e => e.user === 'invitado').length;
    const users    = entries.filter(e => e.user !== 'invitado').length;
    const withComp = entries.filter(e => e.comments).length;
    const withStr  = entries.filter(e => e.strengths).length;

    // Últimos 7 días
    const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = entries.filter(e => new Date(e.date).getTime() > week).length;

    // Top usuarios
    const userCounts = {};
    entries.forEach(e => { userCounts[e.user] = (userCounts[e.user] || 0) + 1; });
    const topUsers = Object.entries(userCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    container.innerHTML = `
        <div class="admin-stats-grid">
            <div class="admin-stat-card">
                <div class="admin-stat-num">${total}</div>
                <div class="admin-stat-label">Total entradas</div>
            </div>
            <div class="admin-stat-card admin-stat-card--alert">
                <div class="admin-stat-num">${unread}</div>
                <div class="admin-stat-label">Sin leer</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-num">${recent}</div>
                <div class="admin-stat-label">Últimos 7 días</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-num">${withComp}</div>
                <div class="admin-stat-label">Con quejas</div>
            </div>
            <div class="admin-stat-card admin-stat-card--positive">
                <div class="admin-stat-num">${withStr}</div>
                <div class="admin-stat-label">Con fortalezas</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-num">${users} / ${guests}</div>
                <div class="admin-stat-label">Usuarios / Invitados</div>
            </div>
        </div>
        ${topUsers.length > 0 ? `
        <div class="admin-top-users">
            <h4>Top usuarios con feedback</h4>
            <ul>
                ${topUsers.map(([u, c]) => `<li><span class="admin-top-user">${escapeHtml(u)}</span><span class="admin-top-count">${c}</span></li>`).join('')}
            </ul>
        </div>` : ''}
    `;
}

function _adminRenderTools(container) {
    container.innerHTML = `
        <div class="admin-tools-list">
            <div class="admin-tool-card">
                <div class="admin-tool-info">
                    <h4>📥 Exportar feedback</h4>
                    <p>Descarga todos los reportes como archivo JSON.</p>
                </div>
                <button class="admin-tool-btn" id="adminExportBtn">Exportar JSON</button>
            </div>
            <div class="admin-tool-card admin-tool-card--danger">
                <div class="admin-tool-info">
                    <h4>🗑 Limpiar todo el feedback</h4>
                    <p>Elimina permanentemente todos los reportes almacenados.</p>
                </div>
                <button class="admin-tool-btn admin-tool-btn--danger" id="adminClearAllBtn">Eliminar todo</button>
            </div>
            <div class="admin-tool-card">
                <div class="admin-tool-info">
                    <h4>🔄 Recargar datos</h4>
                    <p>Recarga el panel desde el servidor.</p>
                </div>
                <button class="admin-tool-btn" id="adminReloadBtn">Recargar</button>
            </div>
        </div>
    `;

    document.getElementById('adminExportBtn').addEventListener('click', async () => {
        try {
            const entries = await _adminFetchFeedback();
            const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `feedback_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('✅ Exportado correctamente');
        } catch {
            showToast('❌ Error al exportar');
        }
    });

    document.getElementById('adminClearAllBtn').addEventListener('click', async () => {
        if (!confirm('¿Eliminar TODO el feedback? Esta acción no se puede deshacer.')) return;
        try {
            const res = await fetch(_API_HOST + '/admin/feedback', {
                method: 'DELETE',
                headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            if (!res.ok) throw new Error();
            showToast('🗑 Feedback eliminado');
            _adminLoadTab('tools');
        } catch {
            showToast('❌ Error al eliminar');
        }
    });

    document.getElementById('adminReloadBtn').addEventListener('click', () => {
        const activeTab = document.querySelector('.admin-tab.active')?.dataset.tab || 'feedback';
        _adminLoadTab(activeTab);
        showToast('🔄 Recargado');
    });
}

async function _adminDeleteEntry(id) {
    const res = await fetch(`${_API_HOST}/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    if (!res.ok) throw new Error('Error al eliminar');
}

async function _adminMarkRead(id) {
    await fetch(`${_API_HOST}/admin/feedback/${id}/read`, {
        method: 'PATCH',
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
}

async function _adminMarkAllRead() {
    const entries = await _adminFetchFeedback();
    const unread = entries.filter(e => !e.read);
    await Promise.all(unread.map(e => _adminMarkRead(e.id)));
    _adminLoadTab('feedback');
}

// ─── Admin: Contributors & Publications ───────────────────────

const _INTERVAL_LABELS = {
    15: '15 min', 30: '30 min', 60: '1 hora', 120: '2 horas',
    360: '6 horas', 720: '12 horas', 1440: '1 día', 4320: '3 días'
};

async function _adminFetchContributors() {
    const res = await fetch(_API_HOST + '/admin/contributors', {
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    if (!res.ok) throw new Error('Error al cargar contribuidores');
    return res.json();
}

async function _adminFetchPublications() {
    const res = await fetch(_API_HOST + '/admin/publications', {
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    if (!res.ok) throw new Error('Error al cargar publicaciones');
    return res.json();
}

async function _adminRenderContributors(container) {
    const [contributors, publications] = await Promise.all([
        _adminFetchContributors(),
        _adminFetchPublications()
    ]);

    const pending = contributors.filter(c => c.status === 'pending').length;
    const pubCount = publications.length;

    container.innerHTML = `
        <div class="admin-contrib-subnav">
            <button class="admin-subnav-btn active" id="adminContribListBtn">
                👥 Contribuidores <span class="admin-subnav-count">${contributors.length}</span>
                ${pending > 0 ? `<span class="admin-subnav-badge">${pending} pendiente${pending > 1 ? 's' : ''}</span>` : ''}
            </button>
            <button class="admin-subnav-btn" id="adminPubsListBtn">
                📣 Publicaciones <span class="admin-subnav-count">${pubCount}</span>
            </button>
        </div>
        <div id="adminContribContent"></div>
    `;

    const contribContent = container.querySelector('#adminContribContent');

    function showContribView() {
        container.querySelector('#adminContribListBtn').classList.add('active');
        container.querySelector('#adminPubsListBtn').classList.remove('active');
        _adminRenderContribList(contribContent, contributors, publications);
    }
    function showPubsView(filterContribId = null) {
        container.querySelector('#adminContribListBtn').classList.remove('active');
        container.querySelector('#adminPubsListBtn').classList.add('active');
        _adminRenderPubsList(contribContent, contributors, publications, filterContribId);
    }

    container.querySelector('#adminContribListBtn').addEventListener('click', () => showContribView());
    container.querySelector('#adminPubsListBtn').addEventListener('click', () => showPubsView());

    showContribView();
}

function _adminRenderContribList(container, contributors, publications) {
    if (contributors.length === 0) {
        container.innerHTML = `<div class="admin-empty">👥 No hay contribuidores registrados todavía.</div>`;
        return;
    }

    const pubsByContrib = {};
    publications.forEach(p => {
        if (!pubsByContrib[p.contributorId]) pubsByContrib[p.contributorId] = 0;
        pubsByContrib[p.contributorId]++;
    });

    container.innerHTML = `
        <div class="admin-contrib-list">
            ${contributors.map(c => _adminContribCard(c, pubsByContrib[c.id] || 0)).join('')}
        </div>
    `;

    container.querySelectorAll('.admin-contrib-status-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id     = btn.dataset.id;
            const status = btn.dataset.status;
            await fetch(`${_API_HOST}/admin/contributors/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
                body: JSON.stringify({ status })
            });
            _adminLoadTab('contributors');
        });
    });

    container.querySelectorAll('.admin-contrib-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(`¿Eliminar contribuidor "${btn.dataset.name}" y todas sus publicaciones?`)) return;
            await fetch(`${_API_HOST}/admin/contributors/${btn.dataset.id}`, {
                method: 'DELETE', headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            _adminLoadTab('contributors');
        });
    });

    container.querySelectorAll('.admin-contrib-pubs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mainContainer2 = document.querySelector('#adminContribContent');
            const subnav = document.querySelector('.admin-contrib-subnav');
            subnav.querySelector('#adminContribListBtn').classList.remove('active');
            subnav.querySelector('#adminPubsListBtn').classList.add('active');
            _adminRenderPubsList(mainContainer2, _lastContribs, _lastPubs, btn.dataset.id);
        });
    });

    // Cache for navigation
    window._lastContribs = contributors;
    window._lastPubs = publications;
}

function _adminContribCard(c, pubCount) {
    const statusMap = {
        pending:   { label: 'Pendiente', cls: 'admin-status--pending'   },
        active:    { label: 'Activo',    cls: 'admin-status--active'    },
        suspended: { label: 'Suspendido',cls: 'admin-status--suspended' }
    };
    const st = statusMap[c.status] || statusMap.pending;
    const photo = c.photo
        ? `<div class="admin-contrib-photo" style="background-image:url('${escapeHtml(c.photo)}')"></div>`
        : `<div class="admin-contrib-photo admin-contrib-photo--placeholder">👤</div>`;

    const actions = c.status === 'pending' ? `
        <button class="admin-contrib-status-btn admin-contrib-activate-btn" data-id="${c.id}" data-status="active">✅ Activar</button>
        <button class="admin-contrib-status-btn admin-contrib-suspend-btn" data-id="${c.id}" data-status="suspended">⏸ Suspender</button>
    ` : c.status === 'active' ? `
        <button class="admin-contrib-status-btn admin-contrib-suspend-btn" data-id="${c.id}" data-status="suspended">⏸ Suspender</button>
    ` : `
        <button class="admin-contrib-status-btn admin-contrib-activate-btn" data-id="${c.id}" data-status="active">✅ Reactivar</button>
    `;

    return `
        <div class="admin-contrib-card">
            <div class="admin-contrib-card-left">
                ${photo}
            </div>
            <div class="admin-contrib-card-body">
                <div class="admin-contrib-card-header">
                    <div>
                        <div class="admin-contrib-name">${escapeHtml(c.name)}</div>
                        <div class="admin-contrib-meta">
                            <span>✉️ ${escapeHtml(c.email)}</span>
                            ${c.username ? `<span>👤 @${escapeHtml(c.username)}</span>` : ''}
                        </div>
                    </div>
                    <span class="admin-status-badge ${st.cls}">${st.label}</span>
                </div>
                ${c.bio ? `<p class="admin-contrib-bio">${escapeHtml(c.bio)}</p>` : ''}
                <div class="admin-contrib-link">
                    🔗 <a href="${escapeHtml(c.link)}" target="_blank" rel="noopener">${escapeHtml(c.link)}</a>
                </div>
                <div class="admin-contrib-card-footer">
                    <div class="admin-contrib-actions">
                        ${actions}
                        <button class="admin-contrib-delete-btn admin-delete-btn"
                            data-id="${c.id}" data-name="${escapeHtml(c.name)}">🗑</button>
                    </div>
                    <button class="admin-contrib-pubs-btn admin-tool-btn"
                        data-id="${c.id}" style="font-size:.8rem; padding:.3rem .75rem">
                        📣 Publicaciones (${pubCount})
                    </button>
                </div>
            </div>
        </div>
    `;
}

function _adminRenderPubsList(container, contributors, publications, filterContribId = null) {
    const filtered = filterContribId
        ? publications.filter(p => p.contributorId === filterContribId)
        : publications;

    const filterContrib = filterContribId ? contributors.find(c => c.id === filterContribId) : null;

    const contribOptions = contributors.map(c =>
        `<option value="${c.id}">${escapeHtml(c.name)} (${c.status})</option>`
    ).join('');

    container.innerHTML = `
        <div class="admin-pubs-toolbar">
            ${filterContrib
                ? `<span class="admin-pubs-filter-label">Publicaciones de <strong>${escapeHtml(filterContrib.name)}</strong>
                     <button class="admin-pubs-clear-filter" id="adminClearFilter">✕ Ver todas</button>
                   </span>`
                : ''}
            <button class="admin-tool-btn" id="adminNewPubBtn" style="margin-left:auto">➕ Nueva publicación</button>
        </div>
        <div class="admin-pubs-list" id="adminPubsList">
            ${filtered.length === 0
                ? `<div class="admin-empty">📭 No hay publicaciones${filterContrib ? ' para este contribuidor' : ''}.</div>`
                : filtered.map(p => _adminPubCard(p, contributors)).join('')
            }
        </div>
    `;

    document.getElementById('adminClearFilter')?.addEventListener('click', () => {
        _adminRenderPubsList(container, contributors, publications, null);
    });

    document.getElementById('adminNewPubBtn').addEventListener('click', () => {
        _adminPubFormModal(contributors, null, filterContribId, async () => {
            const pubs = await _adminFetchPublications();
            _adminRenderPubsList(container, contributors, pubs, filterContribId);
        });
    });

    container.querySelectorAll('.admin-pub-toggle').forEach(toggle => {
        toggle.addEventListener('change', async () => {
            await fetch(`${_API_HOST}/admin/publications/${toggle.dataset.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
                body: JSON.stringify({ active: toggle.checked })
            });
        });
    });

    container.querySelectorAll('.admin-pub-edit-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const pubs = await _adminFetchPublications();
            const pub  = pubs.find(p => p.id === btn.dataset.id);
            if (!pub) return;
            _adminPubFormModal(contributors, pub, null, async () => {
                const updated = await _adminFetchPublications();
                _adminRenderPubsList(container, contributors, updated, filterContribId);
            });
        });
    });

    container.querySelectorAll('.admin-pub-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('¿Eliminar esta publicación?')) return;
            await fetch(`${_API_HOST}/admin/publications/${btn.dataset.id}`, {
                method: 'DELETE', headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            const pubs = await _adminFetchPublications();
            _adminRenderPubsList(container, contributors, pubs, filterContribId);
        });
    });
}

function _adminPubCard(p, contributors) {
    const contrib = contributors.find(c => c.id === p.contributorId);
    const placements = (p.placements || []).map(pl =>
        pl === 'home' ? '🏠 Inicio' : pl === 'floating' ? '💬 Flotante' : pl
    ).join(', ');
    const interval = _INTERVAL_LABELS[p.intervalMinutes] || `${p.intervalMinutes} min`;
    const start = p.startDate ? new Date(p.startDate).toLocaleDateString('es-AR') : '—';
    const end   = p.endDate   ? new Date(p.endDate).toLocaleDateString('es-AR')   : 'Sin vencimiento';
    const photo = p.photo || contrib?.photo || null;

    return `
        <div class="admin-pub-card ${p.active ? '' : 'admin-pub-card--inactive'}">
            ${photo ? `<div class="admin-pub-photo" style="background-image:url('${escapeHtml(photo)}')"></div>` : ''}
            <div class="admin-pub-body">
                <div class="admin-pub-card-header">
                    <div>
                        <div class="admin-pub-title">${escapeHtml(p.title)}</div>
                        <div class="admin-pub-contrib">👤 ${escapeHtml(contrib?.name || p.contributorName || '—')}</div>
                    </div>
                    <label class="admin-pub-toggle-wrap" title="${p.active ? 'Activo' : 'Inactivo'}">
                        <input type="checkbox" class="admin-pub-toggle" data-id="${p.id}" ${p.active ? 'checked' : ''}>
                        <span class="admin-pub-toggle-slider"></span>
                    </label>
                </div>
                ${p.description ? `<p class="admin-pub-desc">${escapeHtml(p.description)}</p>` : ''}
                <div class="admin-pub-meta-row">
                    <span class="admin-pub-meta-item">📍 ${placements}</span>
                    <span class="admin-pub-meta-item">⏱ cada ${interval}</span>
                    <span class="admin-pub-meta-item">📅 ${start} → ${end}</span>
                </div>
                ${p.link ? `<div class="admin-pub-link">🔗 <a href="${escapeHtml(p.link)}" target="_blank">${escapeHtml(p.link)}</a></div>` : ''}
            </div>
            <div class="admin-pub-actions">
                <button class="admin-pub-edit-btn admin-read-btn" data-id="${p.id}">✏️ Editar</button>
                <button class="admin-pub-delete-btn admin-delete-btn" data-id="${p.id}">🗑</button>
            </div>
        </div>
    `;
}

function _adminPubFormModal(contributors, existingPub, defaultContribId, onSave) {
    const isEdit = !!existingPub;
    const pub = existingPub || {};

    const contribOptions = contributors.map(c =>
        `<option value="${c.id}" ${(pub.contributorId || defaultContribId) === c.id ? 'selected' : ''}>
            ${escapeHtml(c.name)} (${c.status})
        </option>`
    ).join('');

    const intervalOptions = Object.entries(_INTERVAL_LABELS).map(([v, l]) =>
        `<option value="${v}" ${parseInt(pub.intervalMinutes) === parseInt(v) ? 'selected' : ''}>${l}</option>`
    ).join('');

    const toDateInput = iso => iso ? iso.split('T')[0] : '';

    const modal = document.createElement('div');
    modal.className = 'admin-pub-modal-overlay';
    modal.innerHTML = `
        <div class="admin-pub-modal">
            <div class="admin-pub-modal-header">
                <h3>${isEdit ? '✏️ Editar publicación' : '➕ Nueva publicación'}</h3>
                <button class="admin-pub-modal-close" id="pubModalClose">×</button>
            </div>
            <div class="admin-pub-modal-body">
                <div class="admin-pub-form-grid">
                    <div class="admin-pub-field admin-pub-field--full">
                        <label>Contribuidor</label>
                        <select id="pubContribId" class="admin-pub-input">${contribOptions}</select>
                    </div>
                    <div class="admin-pub-field admin-pub-field--full">
                        <label>Título del anuncio *</label>
                        <input type="text" id="pubTitle" class="admin-pub-input"
                            value="${escapeHtml(pub.title || '')}" placeholder="Ej: Clases de inglés con nativos" maxlength="80">
                    </div>
                    <div class="admin-pub-field admin-pub-field--full">
                        <label>Descripción</label>
                        <textarea id="pubDesc" class="admin-pub-input admin-pub-textarea"
                            rows="3" maxlength="200" placeholder="Texto breve del anuncio...">${escapeHtml(pub.description || '')}</textarea>
                    </div>
                    <div class="admin-pub-field">
                        <label>Texto del botón (CTA)</label>
                        <input type="text" id="pubCta" class="admin-pub-input"
                            value="${escapeHtml(pub.ctaText || 'Ver más')}" maxlength="40">
                    </div>
                    <div class="admin-pub-field">
                        <label>Link destino</label>
                        <input type="url" id="pubLink" class="admin-pub-input"
                            value="${escapeHtml(pub.link || '')}" placeholder="https://...">
                    </div>
                    <div class="admin-pub-field admin-pub-field--full">
                        <label>Foto (URL o base64)</label>
                        <input type="text" id="pubPhoto" class="admin-pub-input"
                            value="${escapeHtml(pub.photo || '')}" placeholder="https://... (vacío = foto del contribuidor)">
                        <button class="admin-pub-autofill-btn" id="pubAutoFillPhoto" style="margin-top:.35rem; font-size:.78rem;">
                            ↙ Usar foto del contribuidor
                        </button>
                    </div>
                    <div class="admin-pub-field admin-pub-field--full">
                        <label>Dónde mostrar</label>
                        <div class="admin-pub-placements">
                            <label class="admin-pub-placement-opt">
                                <input type="checkbox" value="home" ${(pub.placements||['home']).includes('home') ? 'checked' : ''}>
                                🏠 Menú principal
                            </label>
                            <label class="admin-pub-placement-opt">
                                <input type="checkbox" value="floating" ${(pub.placements||[]).includes('floating') ? 'checked' : ''}>
                                💬 Flotante (otras secciones)
                            </label>
                        </div>
                    </div>
                    <div class="admin-pub-field">
                        <label>Intervalo entre apariciones</label>
                        <select id="pubInterval" class="admin-pub-input">${intervalOptions}</select>
                    </div>
                    <div class="admin-pub-field">
                        <label>Activo</label>
                        <label class="admin-pub-toggle-wrap" style="margin-top:.5rem">
                            <input type="checkbox" id="pubActive" ${pub.active !== false ? 'checked' : ''}>
                            <span class="admin-pub-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="admin-pub-field">
                        <label>Fecha de inicio</label>
                        <input type="date" id="pubStart" class="admin-pub-input" value="${toDateInput(pub.startDate)}">
                    </div>
                    <div class="admin-pub-field">
                        <label>Fecha de fin (opcional)</label>
                        <input type="date" id="pubEnd" class="admin-pub-input" value="${toDateInput(pub.endDate)}">
                    </div>
                </div>
                <div class="admin-pub-form-error hidden" id="pubFormErr"></div>
            </div>
            <div class="admin-pub-modal-footer">
                <button class="admin-tool-btn" id="pubSaveBtn">${isEdit ? 'Guardar cambios' : 'Crear publicación'}</button>
                <button class="admin-pub-cancel-btn" id="pubCancelBtn">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.getElementById('pubModalClose').addEventListener('click', close);
    document.getElementById('pubCancelBtn').addEventListener('click', close);

    // Auto-fill photo from selected contributor
    document.getElementById('pubAutoFillPhoto').addEventListener('click', async () => {
        const cId = document.getElementById('pubContribId').value;
        const contribs = await _adminFetchContributors();
        const c = contribs.find(x => x.id === cId);
        if (c?.photo) document.getElementById('pubPhoto').value = c.photo;
    });

    document.getElementById('pubSaveBtn').addEventListener('click', async () => {
        const title = document.getElementById('pubTitle').value.trim();
        const err   = document.getElementById('pubFormErr');
        if (!title) {
            err.textContent = 'El título es requerido.';
            err.classList.remove('hidden');
            return;
        }

        const placements = [...document.querySelectorAll('.admin-pub-placements input:checked')].map(i => i.value);
        const startVal   = document.getElementById('pubStart').value;
        const endVal     = document.getElementById('pubEnd').value;

        const body = {
            contributorId:   document.getElementById('pubContribId').value,
            title,
            description:     document.getElementById('pubDesc').value.trim(),
            ctaText:         document.getElementById('pubCta').value.trim() || 'Ver más',
            link:            document.getElementById('pubLink').value.trim(),
            photo:           document.getElementById('pubPhoto').value.trim() || null,
            placements:      placements.length ? placements : ['home'],
            intervalMinutes: parseInt(document.getElementById('pubInterval').value),
            active:          document.getElementById('pubActive').checked,
            startDate:       startVal ? new Date(startVal).toISOString() : new Date().toISOString(),
            endDate:         endVal   ? new Date(endVal).toISOString()   : null
        };

        const btn = document.getElementById('pubSaveBtn');
        btn.disabled = true;
        btn.textContent = 'Guardando...';

        try {
            const url    = isEdit
                ? `${_API_HOST}/admin/publications/${existingPub.id}`
                : _API_HOST + '/admin/publications';
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Error');
            close();
            await onSave();
            showToast(isEdit ? '✅ Publicación actualizada' : '✅ Publicación creada');
        } catch (e) {
            err.textContent = `❌ ${e.message}`;
            err.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = isEdit ? 'Guardar cambios' : 'Crear publicación';
        }
    });
}

// ─── Admin: Membresías ────────────────────────────────────────

async function _adminRenderMembership(container) {
    const res  = await fetch(_API_HOST + '/admin/membership', {
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    if (!res.ok) throw new Error('Error al cargar membresías');
    const { config, subscriptions } = await res.json();

    const statusMap = {
        claimed:  { label: 'Reclamado',  cls: 'admin-mem-status--claimed'  },
        active:   { label: 'Activo',     cls: 'admin-mem-status--active'   },
        expired:  { label: 'Expirado',   cls: 'admin-mem-status--expired'  }
    };

    container.innerHTML = `
        <div class="admin-mem-wrap">

            <!-- Config panel -->
            <div class="admin-mem-config-panel">
                <h3 class="admin-mem-section-title">⚙️ Configuración de precios</h3>
                <div class="admin-mem-config-grid">
                    <div class="admin-mem-config-field">
                        <label>Promo activa</label>
                        <label class="admin-pub-toggle-wrap" style="margin-top:.4rem">
                            <input type="checkbox" id="memPromoActive" ${config.promo?.active ? 'checked' : ''}>
                            <span class="admin-pub-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="admin-mem-config-field">
                        <label>Máx. suscriptores promo</label>
                        <input type="number" id="memMaxSubs" class="admin-pub-input"
                            value="${config.promo?.maxSubscribers || 500}" min="1" max="10000">
                    </div>
                    <div class="admin-mem-config-field">
                        <label>Promo mensual ($)</label>
                        <input type="number" id="memPromoMonthly" class="admin-pub-input"
                            value="${config.promo?.monthlyPrice || 2.00}" min="0" step="0.01">
                    </div>
                    <div class="admin-mem-config-field">
                        <label>Promo anual ($)</label>
                        <input type="number" id="memPromoAnnual" class="admin-pub-input"
                            value="${config.promo?.annualPrice || 9.99}" min="0" step="0.01">
                    </div>
                    <div class="admin-mem-config-field">
                        <label>Regular mensual ($)</label>
                        <input type="number" id="memRegMonthly" class="admin-pub-input"
                            value="${config.regular?.monthlyPrice || 4.99}" min="0" step="0.01">
                    </div>
                    <div class="admin-mem-config-field">
                        <label>Regular anual ($)</label>
                        <input type="number" id="memRegAnnual" class="admin-pub-input"
                            value="${config.regular?.annualPrice || 34.99}" min="0" step="0.01">
                    </div>
                </div>
                <div class="admin-mem-config-actions">
                    <button class="admin-tool-btn" id="memSaveConfigBtn">💾 Guardar cambios</button>
                    <span class="admin-mem-config-status hidden" id="memConfigStatus"></span>
                </div>
            </div>

            <!-- Subscribers table -->
            <div class="admin-mem-subs-panel">
                <h3 class="admin-mem-section-title">
                    👥 Suscriptores
                    <span class="admin-mem-count-badge">${subscriptions.length}</span>
                </h3>
                ${subscriptions.length === 0
                    ? `<div class="admin-empty">📭 No hay suscriptores todavía.</div>`
                    : `
                    <div class="admin-mem-table-wrap">
                        <table class="admin-mem-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Región</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subscriptions.map(s => {
                                    const st  = statusMap[s.status] || statusMap.claimed;
                                    const date = new Date(s.subscribedAt).toLocaleDateString('es-AR');
                                    return `
                                        <tr class="admin-mem-row" data-id="${s.id}">
                                            <td class="admin-mem-email">${escapeHtml(s.email)}</td>
                                            <td>${escapeHtml(s.plan)} ${s.period && s.period !== s.plan ? `(${escapeHtml(s.period)})` : ''}</td>
                                            <td>${s.region === 'latam' ? '🇦🇷 LATAM' : '🌍 EU'}</td>
                                            <td><span class="admin-mem-status-badge ${st.cls}">${st.label}</span></td>
                                            <td style="white-space:nowrap">${date}</td>
                                            <td class="admin-mem-actions-cell">
                                                ${s.status !== 'active' ? `
                                                <button class="admin-mem-activate-btn admin-read-btn" data-id="${s.id}" title="Activar manualmente">✅ Activar</button>
                                                ` : ''}
                                                <button class="admin-mem-delete-btn admin-delete-btn" data-id="${s.id}" title="Eliminar">🗑</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>`
                }
            </div>
        </div>
    `;

    // Save config
    document.getElementById('memSaveConfigBtn')?.addEventListener('click', async () => {
        const btn    = document.getElementById('memSaveConfigBtn');
        const status = document.getElementById('memConfigStatus');
        btn.disabled = true;
        btn.textContent = 'Guardando...';
        try {
            const body = {
                promo: {
                    active:         document.getElementById('memPromoActive').checked,
                    maxSubscribers: parseInt(document.getElementById('memMaxSubs').value),
                    monthlyPrice:   parseFloat(document.getElementById('memPromoMonthly').value),
                    annualPrice:    parseFloat(document.getElementById('memPromoAnnual').value)
                },
                regular: {
                    monthlyPrice: parseFloat(document.getElementById('memRegMonthly').value),
                    annualPrice:  parseFloat(document.getElementById('memRegAnnual').value)
                }
            };
            const res = await fetch(_API_HOST + '/admin/membership/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Error al guardar');
            status.textContent = '✅ Guardado';
            status.classList.remove('hidden');
            if (typeof showToast === 'function') showToast('✅ Configuración guardada');
            setTimeout(() => status.classList.add('hidden'), 3000);
        } catch (e) {
            status.textContent = '❌ Error al guardar';
            status.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btn.textContent = '💾 Guardar cambios';
        }
    });

    // Activate subscriber
    container.querySelectorAll('.admin-mem-activate-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await fetch(`${_API_HOST}/admin/membership/subscriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
                body: JSON.stringify({ status: 'active' })
            });
            _adminLoadTab('membership');
        });
    });

    // Delete subscriber
    container.querySelectorAll('.admin-mem-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('¿Eliminar este suscriptor?')) return;
            const id = btn.dataset.id;
            await fetch(`${_API_HOST}/admin/membership/subscriptions/${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            _adminLoadTab('membership');
        });
    });
}

// ─── Tab: Canciones pendientes ────────────────────────────────

async function _adminRenderSongs(container) {
    const res = await fetch(_API_HOST + '/admin/songs', {
        headers: { 'x-admin-token': ADMIN_TOKEN }
    });
    if (!res.ok) throw new Error('Error al cargar canciones');
    const songs = await res.json();

    const pending  = songs.filter(s => s.status === 'pending');
    const approved = songs.filter(s => s.status === 'approved');
    const rejected = songs.filter(s => s.status === 'rejected');

    function songCard(s) {
        const date = new Date(s.submittedAt).toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const statusLabel = { pending: '⏳ Pendiente', approved: '✅ Aprobada', rejected: '❌ Rechazada' }[s.status] || s.status;
        const statusCls   = { pending: 'asong-status--pending', approved: 'asong-status--approved', rejected: 'asong-status--rejected' }[s.status] || '';
        return `
        <div class="asong-card" data-id="${s.id}">
            <div class="asong-card-header">
                <div class="asong-meta">
                    <span class="asong-artist">${escapeHtml(s.artistName)}</span>
                    <span class="asong-sep">·</span>
                    <span class="asong-song">${escapeHtml(s.songTitle)}</span>
                    <span class="asong-lang">${s.language.toUpperCase()}${s.country ? ' · ' + escapeHtml(s.country) : ''}</span>
                </div>
                <span class="asong-status ${statusCls}">${statusLabel}</span>
            </div>
            <div class="asong-submitter">👤 ${escapeHtml(s.submittedBy)} · 🕒 ${date}</div>
            ${s.translations?.length ? `<div class="asong-has-trans">🌐 ${s.translations.length} traducción${s.translations.length > 1 ? 'es' : ''}: ${s.translations.map(t => t.lang.toUpperCase()).join(', ')}</div>` : ''}
            <div class="asong-lyrics-preview">${escapeHtml(s.lyrics.slice(0, 160))}${s.lyrics.length > 160 ? '…' : ''}</div>
            <div class="asong-actions">
                <button class="asong-btn asong-btn--view" data-id="${s.id}">👁 Ver completo</button>
                ${s.status !== 'approved' ? `<button class="asong-btn asong-btn--approve" data-id="${s.id}">✅ Aprobar</button>` : ''}
                ${s.status !== 'rejected' ? `<button class="asong-btn asong-btn--reject" data-id="${s.id}">❌ Rechazar</button>` : ''}
                <button class="asong-btn asong-btn--delete" data-id="${s.id}">🗑 Eliminar</button>
            </div>
        </div>`;
    }

    container.innerHTML = `
        <div class="asong-summary">
            <span class="asong-chip asong-chip--pending">⏳ ${pending.length} pendientes</span>
            <span class="asong-chip asong-chip--approved">✅ ${approved.length} aprobadas</span>
            <span class="asong-chip asong-chip--rejected">❌ ${rejected.length} rechazadas</span>
        </div>
        ${songs.length === 0
            ? `<div class="admin-empty">🎵 No hay canciones enviadas aún.</div>`
            : `<div class="asong-list">${[...pending, ...approved, ...rejected].map(songCard).join('')}</div>`
        }
    `;

    // Ver completo
    container.querySelectorAll('.asong-btn--view').forEach(btn => {
        btn.addEventListener('click', () => {
            const s = songs.find(x => x.id === btn.dataset.id);
            if (!s) return;
            const overlay = document.createElement('div');
            overlay.className = 'asong-overlay';
            overlay.innerHTML = `
                <div class="asong-modal">
                    <div class="asong-modal-header">
                        <strong>${escapeHtml(s.artistName)} — ${escapeHtml(s.songTitle)}</strong>
                        <button class="asong-modal-close">✕</button>
                    </div>
                    <div class="asong-modal-cols">
                        <div class="asong-modal-col">
                            <div class="asong-modal-col-label">${s.language.toUpperCase()}</div>
                            <pre class="asong-modal-pre">${escapeHtml(s.lyrics)}</pre>
                        </div>
                        ${(s.translations || []).map(t => `
                        <div class="asong-modal-col">
                            <div class="asong-modal-col-label">${t.lang.toUpperCase()}</div>
                            <pre class="asong-modal-pre">${escapeHtml(t.text)}</pre>
                        </div>`).join('')}
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            overlay.querySelector('.asong-modal-close').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        });
    });

    async function patchSong(id, status) {
        await fetch(`${_API_HOST}/admin/songs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
            body: JSON.stringify({ status })
        });
        _adminLoadTab('songs');
    }

    container.querySelectorAll('.asong-btn--approve').forEach(btn =>
        btn.addEventListener('click', () => patchSong(btn.dataset.id, 'approved'))
    );
    container.querySelectorAll('.asong-btn--reject').forEach(btn =>
        btn.addEventListener('click', () => patchSong(btn.dataset.id, 'rejected'))
    );
    container.querySelectorAll('.asong-btn--delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('¿Eliminar esta canción?')) return;
            await fetch(`${_API_HOST}/admin/songs/${btn.dataset.id}`, {
                method: 'DELETE',
                headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            _adminLoadTab('songs');
        });
    });
}

// ─── Admin: Escritores y Escritos ─────────────────────────────

async function _adminRenderWriters(container) {
    const res  = await fetch(_API_HOST + '/admin/writers', { headers: { 'x-admin-token': ADMIN_TOKEN } });
    if (!res.ok) throw new Error('Error al cargar textos');
    const all  = await res.json();

    const pending  = all.filter(s => s.status === 'pending');
    const approved = all.filter(s => s.status === 'approved');
    const rejected = all.filter(s => s.status === 'rejected');

    const TYPE_ICONS = { poema: '🎭', fragmento: '📄', cuento: '📖', ensayo: '✍️', frase: '💬' };

    function textCard(s) {
        const statusCls   = s.status === 'approved' ? 'asong-status--ok' : s.status === 'rejected' ? 'asong-status--rej' : 'asong-status--pend';
        const statusLabel = s.status === 'approved' ? '✅ Aprobado' : s.status === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente';
        const icon        = TYPE_ICONS[s.type] || '📝';
        return `
            <div class="asong-card" data-id="${s.id}">
                <div class="asong-card-header">
                    <div>
                        <span class="asong-title">${icon} ${escapeHtml(s.title)}</span>
                        <span class="asong-artist"> — ${escapeHtml(s.writerName)}</span>
                    </div>
                    <span class="asong-status ${statusCls}">${statusLabel}</span>
                </div>
                <div class="asong-meta">
                    <span class="asong-lang">${(s.lang || 'es').toUpperCase()}${s.writerCountry ? ' · ' + escapeHtml(s.writerCountry.toUpperCase()) : ''}</span>
                    <span class="asong-lang">${s.visibility === 'private' ? '🔒 Privado' : '🌐 Público'}</span>
                    <span class="asong-submitter">👤 ${escapeHtml(s.submittedBy || '—')}</span>
                    <span class="asong-submitter">🏆 +${s.pointsAwarded || 5} pts</span>
                    <span class="asong-submitter">${new Date(s.submittedAt).toLocaleDateString()}</span>
                </div>
                <div class="asong-preview">${escapeHtml((s.original || '').slice(0, 120))}${(s.original || '').length > 120 ? '…' : ''}</div>
                ${s.translation ? `<div class="asong-preview" style="color:var(--text-muted);font-style:italic">${escapeHtml(s.translation.slice(0, 80))}…</div>` : ''}
                ${s.adminNote   ? `<div class="asong-note">📝 ${escapeHtml(s.adminNote)}</div>` : ''}
                <div class="asong-actions">
                    ${s.status !== 'approved' ? `<button class="asong-btn asong-btn--approve" data-id="${s.id}">✅ Aprobar</button>` : ''}
                    ${s.status !== 'rejected' ? `<button class="asong-btn asong-btn--reject"  data-id="${s.id}">❌ Rechazar</button>` : ''}
                    <button class="asong-btn asong-btn--edit-wt"   data-id="${s.id}">✏️ Nota</button>
                    <button class="asong-btn asong-btn--config-wt" data-id="${s.id}">⚙️ Config.</button>
                    <button class="asong-btn asong-btn--delete-wt" data-id="${s.id}">🗑️</button>
                </div>
            </div>`;
    }

    container.innerHTML = `
        <div class="admin-songs-wrap">
            <div class="asong-stats-row">
                <span class="asong-stat">⏳ <strong>${pending.length}</strong> pendientes</span>
                <span class="asong-stat">✅ <strong>${approved.length}</strong> aprobados</span>
                <span class="asong-stat">❌ <strong>${rejected.length}</strong> rechazados</span>
            </div>
            <button class="asong-add-btn" id="adminWritersAddBtn">✍️ Subir texto como Admin</button>
            <div class="asong-list">
                ${all.length ? all.map(textCard).join('') : '<div class="admin-empty">📭 No hay textos enviados aún.</div>'}
            </div>
        </div>
    `;

    document.getElementById('adminWritersAddBtn').addEventListener('click', () => {
        if (typeof _showSubmitForm === 'function') _showSubmitForm();
    });

    async function patchWriter(id, fields) {
        await fetch(`${_API_HOST}/admin/writers/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
            body: JSON.stringify(fields)
        });
        _adminLoadTab('writers');
    }

    container.querySelectorAll('.asong-btn--approve').forEach(btn =>
        btn.addEventListener('click', () => patchWriter(btn.dataset.id, { status: 'approved' }))
    );
    container.querySelectorAll('.asong-btn--reject').forEach(btn =>
        btn.addEventListener('click', () => patchWriter(btn.dataset.id, { status: 'rejected' }))
    );
    container.querySelectorAll('.asong-btn--edit-wt').forEach(btn => {
        btn.addEventListener('click', () => {
            const s = all.find(x => x.id === btn.dataset.id);
            if (!s) return;
            const note = prompt('Nota admin:', s.adminNote || '');
            if (note === null) return;
            patchWriter(s.id, { adminNote: note });
        });
    });
    container.querySelectorAll('.asong-btn--delete-wt').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('¿Eliminar este texto?')) return;
            await fetch(`${_API_HOST}/admin/writers/${btn.dataset.id}`, {
                method: 'DELETE', headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            _adminLoadTab('writers');
        });
    });
    container.querySelectorAll('.asong-btn--config-wt').forEach(btn => {
        btn.addEventListener('click', () => {
            const s = all.find(x => x.id === btn.dataset.id);
            if (s && typeof _showSubmitForm === 'function') _showSubmitForm(s);
        });
    });
}

// ─── Admin: Grupos de Flashcards públicos ─────────────────────

async function _adminRenderFlashcardGroups(container) {
    const res = await fetch(_API_HOST + '/admin/flashcard-groups', { headers: { 'x-admin-token': ADMIN_TOKEN } });
    if (!res.ok) throw new Error('Error al cargar grupos de flashcards');
    const all = await res.json();

    const pending  = all.filter(s => s.status === 'pending');
    const approved = all.filter(s => s.status === 'approved');
    const rejected = all.filter(s => s.status === 'rejected');

    function groupCard(s) {
        const statusCls   = s.status === 'approved' ? 'asong-status--approved' : s.status === 'rejected' ? 'asong-status--rejected' : 'asong-status--pending';
        const statusLabel = s.status === 'approved' ? '✅ Aprobado' : s.status === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente';
        return `
            <div class="asong-card" data-id="${s.id}">
                <div class="asong-card-header">
                    <div>
                        <span class="fc-group-dot" style="background:${s.color || '#6366f1'}"></span>
                        <span class="asong-title">${escapeHtml(s.title)}</span>
                    </div>
                    <span class="asong-status ${statusCls}">${statusLabel}</span>
                </div>
                <div class="asong-meta">
                    <span class="asong-lang">📇 ${s.cards.length} tarjeta${s.cards.length !== 1 ? 's' : ''}</span>
                    <span class="asong-submitter">👤 ${escapeHtml(s.submittedBy || '—')}</span>
                    <span class="asong-submitter">${new Date(s.submittedAt).toLocaleDateString()}</span>
                </div>
                ${s.notes ? `<div class="asong-preview" style="color:var(--text-muted);font-style:italic">${escapeHtml(s.notes)}</div>` : ''}
                <div class="asong-preview">${s.cards.slice(0, 3).map(c => `${escapeHtml(c.word)} → ${escapeHtml(c.translation)}`).join(' · ')}${s.cards.length > 3 ? '…' : ''}</div>
                ${s.adminNote ? `<div class="asong-note">📝 ${escapeHtml(s.adminNote)}</div>` : ''}
                <div class="asong-actions">
                    ${s.status !== 'approved' ? `<button class="asong-btn asong-btn--approve" data-id="${s.id}">✅ Aprobar</button>` : ''}
                    ${s.status !== 'rejected' ? `<button class="asong-btn asong-btn--reject"  data-id="${s.id}">❌ Rechazar</button>` : ''}
                    <button class="asong-btn asong-btn--edit-wt"   data-id="${s.id}">✏️ Nota</button>
                    <button class="asong-btn asong-btn--delete-wt" data-id="${s.id}">🗑️</button>
                </div>
            </div>`;
    }

    container.innerHTML = `
        <div class="admin-songs-wrap">
            <div class="asong-stats-row">
                <span class="asong-stat">⏳ <strong>${pending.length}</strong> pendientes</span>
                <span class="asong-stat">✅ <strong>${approved.length}</strong> aprobados</span>
                <span class="asong-stat">❌ <strong>${rejected.length}</strong> rechazados</span>
            </div>
            <div class="asong-list">
                ${all.length ? all.map(groupCard).join('') : '<div class="admin-empty">📭 No hay grupos de flashcards enviados aún.</div>'}
            </div>
        </div>
    `;

    async function patchGroup(id, fields) {
        await fetch(`${_API_HOST}/admin/flashcard-groups/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
            body: JSON.stringify(fields)
        });
        _adminLoadTab('flashcards');
    }

    container.querySelectorAll('.asong-btn--approve').forEach(btn =>
        btn.addEventListener('click', () => patchGroup(btn.dataset.id, { status: 'approved' }))
    );
    container.querySelectorAll('.asong-btn--reject').forEach(btn =>
        btn.addEventListener('click', () => patchGroup(btn.dataset.id, { status: 'rejected' }))
    );
    container.querySelectorAll('.asong-btn--edit-wt').forEach(btn => {
        btn.addEventListener('click', () => {
            const s = all.find(x => x.id === btn.dataset.id);
            if (!s) return;
            const note = prompt('Nota admin:', s.adminNote || '');
            if (note === null) return;
            patchGroup(s.id, { adminNote: note });
        });
    });
    container.querySelectorAll('.asong-btn--delete-wt').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('¿Eliminar este grupo de flashcards?')) return;
            await fetch(`${_API_HOST}/admin/flashcard-groups/${btn.dataset.id}`, {
                method: 'DELETE', headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            _adminLoadTab('flashcards');
        });
    });
}

// ── Tab: Usuarios ─────────────────────────────────────────────

const _AU_PLANS = ['free', 'premium', 'gold'];
const _AU_ROLES = [
    { value: '',           label: 'Sin rol'    },
    { value: 'direccion',  label: 'Dirección'  },
    { value: 'ayudante',   label: 'Ayudante'   },
    { value: 'estudiante', label: 'Estudiante' },
];

// Mapa: userId → { id, name, username } del profesor asignado (estado temporal por sesión de edición)
const _auPendingTeacher = new Map();
const _AU_PERMS = [
    { value: 'manage_notifications',  label: '🔔 Administrar notificaciones' },
    { value: 'manage_users_region',   label: '🌎 Gestionar usuarios por región' },
    { value: 'modify_content',        label: '✏️ Modificar contenidos' },
    { value: 'view_stats',            label: '📊 Ver estadísticas' },
    { value: 'manage_memberships',    label: '💳 Gestionar membresías' },
    { value: 'moderate_submissions',  label: '📋 Moderar envíos (canciones, textos)' },
    { value: 'manage_classroom',      label: '🏫 Administrar aulas' },
];
const _AU_REGIONS = [
    { value: 'america_latina',  label: '🌎 América Latina (incl. Central y Caribe)' },
    { value: 'brasil',          label: '🇧🇷 Brasil' },
    { value: 'america_norte',   label: '🇺🇸 América del Norte' },
    { value: 'europa',          label: '🇪🇺 Europa Occidental' },
    { value: 'europa_oriental', label: '🗺️ Europa Oriental / ex-URSS' },
    { value: 'medio_oriente',   label: '🕌 Medio Oriente' },
    { value: 'africa',          label: '🌍 África' },
    { value: 'asia',            label: '🌏 Asia' },
    { value: 'india',           label: '🇮🇳 India' },
    { value: 'china',           label: '🇨🇳 China' },
    { value: 'oceania',         label: '🦘 Oceanía' },
];
const _AU_REGION_LABELS = Object.fromEntries(_AU_REGIONS.map(r => [r.value, r.label]));

// Permisos predeterminados por rol
const _AU_ROLE_DEFAULTS = {
    direccion: ['manage_notifications','manage_users_region','modify_content','view_stats','manage_memberships','moderate_submissions','manage_classroom'],
    ayudante:  ['view_stats','moderate_submissions'],
};

async function _adminRenderUsers(container, page = 1) {
    const res  = await fetch(`${_API_HOST}/admin/users?page=${page}&limit=50`, { headers: { 'x-admin-token': ADMIN_TOKEN } });
    const data = await res.json();
    const users = data.users || data; // compatibilidad con respuesta antigua

    // Distribución por región
    const regionCounts = {};
    users.forEach(u => { if (u.region) regionCounts[u.region] = (regionCounts[u.region] || 0) + 1; });
    const regionSummary = Object.entries(regionCounts).sort((a,b) => b[1]-a[1]);

    container.innerHTML = `
        <div class="au-wrap">
            ${regionSummary.length ? `
            <div class="au-region-summary">
                <span class="au-region-summary-title">Usuarios por región:</span>
                ${regionSummary.map(([r,c]) => `
                    <span class="au-region-pill au-region-filter" data-region="${r}" title="${r}">
                        ${(_AU_REGION_LABELS[r] || r).split(' ').slice(0,2).join(' ')} <strong>${c}</strong>
                    </span>`).join('')}
                <span class="au-region-pill au-region-filter au-region-filter--active" data-region="" style="border-color:#6366f1;color:#6366f1">Todos</span>
            </div>` : ''}
            <div class="au-search-row">
                <input class="au-search" id="auSearch" placeholder="🔍 Buscar por nombre, email o username…" autocomplete="off">
                <span class="au-count" id="auCount">${users.length} usuarios</span>
            </div>
            <div class="au-list" id="auList"></div>
        </div>`;

    let _regionFilter = '';

    function renderList(query) {
        const q = (query || '').toLowerCase().trim();
        let filtered = _regionFilter
            ? users.filter(u => u.region === _regionFilter)
            : users;
        if (q) filtered = filtered.filter(u =>
            (u.name     || '').toLowerCase().includes(q) ||
            (u.email    || '').toLowerCase().includes(q) ||
            (u.username || '').toLowerCase().includes(q));
        document.getElementById('auCount').textContent = `${filtered.length} usuario${filtered.length !== 1 ? 's' : ''}`;
        const list = document.getElementById('auList');
        list.innerHTML = filtered.map(u => _auCardHTML(u)).join('');
        _bindAuCards(list, users);
    }

    document.getElementById('auSearch').addEventListener('input', e => renderList(e.target.value));

    container.querySelectorAll('.au-region-filter').forEach(pill => {
        pill.addEventListener('click', () => {
            container.querySelectorAll('.au-region-filter').forEach(p => p.classList.remove('au-region-filter--active'));
            pill.classList.add('au-region-filter--active');
            _regionFilter = pill.dataset.region;
            renderList(document.getElementById('auSearch').value);
        });
    });

    renderList('');
}

function _auCardHTML(u) {
    const perms   = Array.isArray(u.permissions)     ? u.permissions     : [];
    const managed = Array.isArray(u.managed_regions)  ? u.managed_regions  : [];
    const hasRegionPerm = perms.includes('manage_users_region');
    const regionLabel = u.region ? (_AU_REGION_LABELS[u.region] || u.region).split(' ').slice(0,2).join(' ') : null;
    const assignedTeacher = u.assigned_teacher_id ? (u._assigned_teacher_name || u.assigned_teacher_id) : null;

    return `
        <div class="au-card" data-user-id="${u.id}">
            <div class="au-card-head">
                <div class="au-avatar">${(u.name || '?')[0].toUpperCase()}</div>
                <div class="au-info">
                    <span class="au-name">${escapeHtml(u.name || '—')}</span>
                    <span class="au-sub">${escapeHtml(u.email)}</span>
                    ${u.username ? `<span class="au-sub">@${escapeHtml(u.username)}</span>` : ''}
                    ${regionLabel ? `<span class="au-sub au-location">📍 ${u.country ? u.country + ' · ' : ''}${regionLabel}</span>` : ''}
                    ${u.role === 'estudiante' && u.assigned_teacher_id
                        ? `<span class="au-sub au-teacher-tag">👨‍🏫 Prof: ${escapeHtml(assignedTeacher || u.assigned_teacher_id)}</span>`
                        : ''}
                </div>
                <div class="au-meta">
                    ${u.isDev ? '<span class="au-badge au-badge--dev">Dev</span>' : ''}
                    <span class="au-badge au-badge--plan au-badge--${u.plan}">${u.plan}</span>
                    ${u.role ? `<span class="au-badge au-badge--role">${u.role}</span>` : ''}
                    ${u.label ? `<span class="au-badge au-badge--label">${escapeHtml(u.label)}</span>` : ''}
                </div>
                <button class="au-expand-btn" data-id="${u.id}" title="Editar">✏️</button>
            </div>

            <div class="au-editor hidden" id="auEditor_${u.id}">
                <div class="au-editor-grid">

                    <!-- Plan -->
                    <div class="au-field-group">
                        <label class="au-label">Plan</label>
                        <div class="au-btn-group" id="auPlanGroup_${u.id}">
                            ${_AU_PLANS.map(p => `
                                <button class="au-opt-btn ${u.plan === p ? 'active' : ''}" data-field="plan" data-val="${p}">${p}</button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Rol -->
                    <div class="au-field-group">
                        <label class="au-label">Rol</label>
                        <div class="au-btn-group" id="auRoleGroup_${u.id}">
                            ${_AU_ROLES.map(r => `
                                <button class="au-opt-btn ${(u.role || '') === r.value ? 'active' : ''}"
                                    data-field="role" data-val="${r.value}"
                                    ${r.value === 'estudiante' ? 'data-needs-teacher="true"' : ''}>${r.label}</button>
                            `).join('')}
                        </div>
                        <!-- Profesor asignado (visible solo cuando rol = estudiante) -->
                        <div class="au-teacher-assign ${(u.role || '') === 'estudiante' ? '' : 'hidden'}" id="auTeacherAssign_${u.id}">
                            <span class="au-teacher-assign-label">👨‍🏫 Profesor asignado:</span>
                            <span class="au-teacher-name" id="auTeacherName_${u.id}">
                                ${u.assigned_teacher_id
                                    ? escapeHtml(assignedTeacher || u.assigned_teacher_id)
                                    : '<span class="au-muted">Sin asignar</span>'}
                            </span>
                            <button class="au-teacher-pick-btn" data-uid="${u.id}" data-current-teacher="${escapeHtml(u.assigned_teacher_id || '')}">
                                ${u.assigned_teacher_id ? 'Cambiar' : 'Asignar profesor'}
                            </button>
                        </div>
                    </div>

                    <!-- Etiqueta -->
                    <div class="au-field-group au-field-group--full">
                        <label class="au-label">Etiqueta</label>
                        <input class="au-input" id="auLabel_${u.id}" value="${escapeHtml(u.label || '')}" placeholder="Ej: Beta tester, Embajador, Región Sur…">
                    </div>

                    <!-- Permisos -->
                    <div class="au-field-group au-field-group--full">
                        <label class="au-label">Permisos <span class="au-perm-hint">(independientes del rol)</span></label>
                        <div class="au-perms" id="auPerms_${u.id}">
                            ${_AU_PERMS.map(p => `
                                <label class="au-perm-check">
                                    <input type="checkbox" value="${p.value}" ${perms.includes(p.value) ? 'checked' : ''}>
                                    ${p.label}
                                </label>
                            `).join('')}
                        </div>
                        <button class="au-preset-btn" data-user="${u.id}">Aplicar permisos del rol</button>
                    </div>

                    <!-- Regiones gestionadas (solo si tiene el permiso) -->
                    <div class="au-field-group au-field-group--full au-managed-regions ${hasRegionPerm ? '' : 'hidden'}" id="auRegionsWrap_${u.id}">
                        <label class="au-label">🌎 Regiones que puede gestionar</label>
                        <div class="au-perms au-region-checks" id="auRegions_${u.id}">
                            ${_AU_REGIONS.map(r => `
                                <label class="au-perm-check">
                                    <input type="checkbox" value="${r.value}" class="au-region-cb" ${managed.includes(r.value) ? 'checked' : ''}>
                                    ${r.label}
                                </label>
                            `).join('')}
                        </div>
                    </div>

                </div>

                <div class="au-editor-foot">
                    <span class="au-save-msg hidden" id="auMsg_${u.id}">✅ Guardado</span>
                    <button class="au-save-btn" data-id="${u.id}">Guardar cambios</button>
                </div>
            </div>
        </div>`;
}

function _bindAuCards(container, allUsers) {
    // Expand/collapse
    container.querySelectorAll('.au-expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const editor = document.getElementById(`auEditor_${btn.dataset.id}`);
            editor.classList.toggle('hidden');
            btn.textContent = editor.classList.contains('hidden') ? '✏️' : '✕';
        });
    });

    // Toggle buttons (plan / role)
    container.querySelectorAll('.au-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.au-btn-group');
            group.querySelectorAll('.au-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Si es el botón de rol, mostrar/ocultar bloque de profesor
            if (btn.dataset.field === 'role') {
                const card  = btn.closest('.au-card');
                const uid   = card?.dataset.userId;
                const block = document.getElementById(`auTeacherAssign_${uid}`);
                if (block) block.classList.toggle('hidden', btn.dataset.val !== 'estudiante');

                // Si cambió DESDE estudiante, limpiar el profesor pendiente
                if (btn.dataset.val !== 'estudiante') _auPendingTeacher.delete(uid);
            }
        });
    });

    // Botón "Asignar / Cambiar profesor"
    container.querySelectorAll('.au-teacher-pick-btn').forEach(btn => {
        btn.addEventListener('click', () => _auShowTeacherPickerModal(btn.dataset.uid, container));
    });

    // Aplicar permisos predeterminados del rol seleccionado
    container.querySelectorAll('.au-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const uid    = btn.dataset.user;
            const rolBtn = container.querySelector(`#auRoleGroup_${uid} .au-opt-btn.active`);
            const role   = rolBtn?.dataset.val || '';
            const preset = _AU_ROLE_DEFAULTS[role] || [];
            container.querySelectorAll(`#auPerms_${uid} input[type=checkbox]`).forEach(cb => {
                cb.checked = preset.includes(cb.value);
            });
            // Mostrar/ocultar bloque de regiones según preset
            const regWrap = document.getElementById(`auRegionsWrap_${uid}`);
            if (regWrap) regWrap.classList.toggle('hidden', !preset.includes('manage_users_region'));
        });
    });

    // Mostrar/ocultar selector de regiones al marcar/desmarcar el permiso
    container.querySelectorAll('#auPerms_' + [...container.querySelectorAll('.au-perms')].map(el => el.id.replace('auPerms_','')).join(', #auPerms_') + ' input[value="manage_users_region"]').forEach(() => {});
    container.querySelectorAll('.au-perms').forEach(permsEl => {
        const uid = permsEl.id.replace('auPerms_', '');
        const regionCb = permsEl.querySelector('input[value="manage_users_region"]');
        if (!regionCb) return;
        regionCb.addEventListener('change', () => {
            const regWrap = document.getElementById(`auRegionsWrap_${uid}`);
            if (regWrap) regWrap.classList.toggle('hidden', !regionCb.checked);
        });
    });

    // Guardar
    container.querySelectorAll('.au-save-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const uid            = btn.dataset.id;
            const plan           = container.querySelector(`#auPlanGroup_${uid} .au-opt-btn.active`)?.dataset.val;
            const role           = container.querySelector(`#auRoleGroup_${uid} .au-opt-btn.active`)?.dataset.val || null;
            const label          = document.getElementById(`auLabel_${uid}`)?.value.trim() || null;
            const permissions    = [...container.querySelectorAll(`#auPerms_${uid} input:checked`)].map(cb => cb.value);
            const managedRegions = [...container.querySelectorAll(`#auRegions_${uid} input:checked`)].map(cb => cb.value);

            // Profesor asignado: usar el pendiente si lo hay, o limpiar si el rol ya no es estudiante
            const pendingTeacher    = _auPendingTeacher.get(uid);
            const assignedTeacherId = role === 'estudiante'
                ? (pendingTeacher?.id ?? (allUsers.find(u => u.id === uid)?.assigned_teacher_id ?? null))
                : null;

            // Validar que el rol Estudiante tenga profesor asignado
            if (role === 'estudiante' && !assignedTeacherId) {
                const msg = document.getElementById(`auMsg_${uid}`);
                msg.textContent = '⚠️ Debés asignar un profesor antes de guardar.';
                msg.classList.remove('hidden', 'au-save-msg--ok');
                msg.classList.add('au-save-msg--err');
                return;
            }

            const r   = await fetch(`${_API_HOST}/admin/users/${uid}`, {
                method:  'PATCH',
                headers: { 'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json' },
                body:    JSON.stringify({ plan, role: role || null, label, permissions, managedRegions, assignedTeacherId }),
            });
            const res = await r.json();
            const msg = document.getElementById(`auMsg_${uid}`);
            if (res.ok) {
                msg.textContent = '✅ Guardado';
                msg.classList.remove('hidden', 'au-save-msg--err');
                msg.classList.add('au-save-msg--ok');
                const u = allUsers.find(u => u.id === uid);
                if (u) { u.plan = plan; u.role = role; u.label = label; u.permissions = permissions; u.managed_regions = managedRegions; u.assigned_teacher_id = assignedTeacherId; }
                _auPendingTeacher.delete(uid);
                setTimeout(() => msg.classList.add('hidden'), 2500);
            } else {
                msg.textContent = '⚠️ Error al guardar';
                msg.classList.remove('hidden');
                msg.classList.add('au-save-msg--err');
            }
        });
    });
}

// ── Tab: Profesores ───────────────────────────────────────────

async function _adminRenderTeachers(container) {
    let profiles = [];
    try {
        const session = localStorage.getItem('ls_session');
        const token   = session ? JSON.parse(session).token : '';
        const r = await fetch(`${_API_HOST}/classroom/teachers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const d = await r.json();
        profiles = d.teachers || [];
    } catch {}

    const _CL_LANGS = { en:'Inglés', es:'Español', fr:'Francés', de:'Alemán', pt:'Portugués', it:'Italiano', zh:'Chino', ja:'Japonés', ko:'Coreano', ru:'Ruso', ar:'Árabe' };

    container.innerHTML = `
        <div class="au-wrap">
            <div class="au-search-row">
                <span class="au-count">${profiles.length} profesor${profiles.length !== 1 ? 'es' : ''} registrado${profiles.length !== 1 ? 's' : ''}</span>
            </div>
            ${profiles.length === 0
                ? '<p style="padding:1rem;color:var(--text-muted)">No hay perfiles de profesor registrados todavía.</p>'
                : profiles.map(p => `
                <div class="au-card">
                    <div class="au-card-head">
                        <div class="au-avatar" style="background:linear-gradient(135deg,#f59e0b,#d97706)">👨‍🏫</div>
                        <div class="au-info">
                            <span class="au-name">${escapeHtml(p.name || '—')}</span>
                            <span class="au-sub">@${escapeHtml(p.username || '—')}</span>
                            <span class="au-sub">${(p.target_langs || []).map(l => _CL_LANGS[l] || l).join(' · ') || 'Sin idiomas'}</span>
                        </div>
                        <div class="au-meta">
                            <span class="au-badge ${p.status === 'available' ? 'au-badge--active' : 'au-badge--inactive'}">
                                ${p.status === 'available' ? '🟢 Disponible' : '🔴 No disponible'}
                            </span>
                            ${p.rating_count > 0 ? `<span class="au-badge au-badge--dev">⭐ ${p.rating}</span>` : ''}
                        </div>
                    </div>
                    ${p.bio ? `<div style="padding:.35rem .85rem .65rem;font-size:.82rem;color:var(--text-muted);font-style:italic;border-top:1px solid var(--border)">${escapeHtml(p.bio.slice(0, 160))}${p.bio.length > 160 ? '…' : ''}</div>` : ''}
                </div>`).join('')}
        </div>`;
}

// ── Modal: selector de profesor para rol Estudiante ───────────

async function _auShowTeacherPickerModal(uid, auContainer) {
    const overlay = document.createElement('div');
    overlay.className = 'admin-pub-modal-overlay';
    overlay.innerHTML = `
        <div class="admin-pub-modal" style="max-width:420px">
            <div class="admin-pub-modal-header">
                <h3>👨‍🏫 Asignar profesor</h3>
                <button class="admin-pub-modal-close" id="auTpClose">×</button>
            </div>
            <div class="admin-pub-modal-body">
                <div class="au-tp-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('auTpClose').addEventListener('click', () => overlay.remove());

    let teachers = [];
    try {
        const session = localStorage.getItem('ls_session');
        const token   = session ? JSON.parse(session).token : '';
        const r = await fetch(`${_API_HOST}/classroom/teachers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const d = await r.json();
        teachers = d.teachers || [];
    } catch {}

    // Incluir al admin mismo si no está en la lista de profesores
    const adminId   = currentUser?.id;
    const adminName = currentUser?.name || 'Yo (admin)';
    const adminUsername = currentUser?.username || '';
    const adminInList = teachers.some(t => t.teacher_id === adminId);
    if (!adminInList && adminId) {
        teachers = [{ teacher_id: adminId, name: adminName, username: adminUsername, status: 'available', _isSelf: true }, ...teachers];
    }

    const body = overlay.querySelector('.admin-pub-modal-body');

    if (!teachers.length) {
        body.innerHTML = '<p style="padding:.5rem;color:var(--text-muted)">No hay profesores registrados todavía. El profesor debe tener plan Gold o el addon ClassRooms activo y haber configurado su perfil.</p>';
        return;
    }

    body.innerHTML = `
        <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:.75rem">
            Seleccioná el profesor que se asignará a este estudiante. Solo aparecen usuarios registrados como profesores.
        </p>
        <div class="au-tp-list">
            ${teachers.map(t => `
                <label class="au-tp-row">
                    <input type="radio" name="auTpRadio" value="${t.teacher_id}" data-name="${escapeHtml(t.name || '—')}" data-username="${escapeHtml(t.username || '')}">
                    <div class="au-tp-info">
                        <span class="au-tp-name">${escapeHtml(t.name || '—')} ${t._isSelf ? '<span class="au-badge au-badge--dev">Yo</span>' : ''}</span>
                        ${t.username ? `<span class="au-tp-user">@${escapeHtml(t.username)}</span>` : ''}
                    </div>
                    <span class="au-tp-status ${t.status === 'available' ? 'au-badge--active' : 'au-badge--inactive'}">
                        ${t.status === 'available' ? '🟢' : '🔴'}
                    </span>
                </label>`).join('')}
        </div>
        <div class="admin-pub-form-error hidden" id="auTpErr">Seleccioná un profesor.</div>
    `;

    // Footer con botón confirmar
    overlay.querySelector('.admin-pub-modal').insertAdjacentHTML('beforeend', `
        <div class="admin-pub-modal-footer">
            <button class="admin-tool-btn" id="auTpConfirm">Confirmar</button>
            <button class="admin-pub-cancel-btn" id="auTpCancel">Cancelar</button>
        </div>`);

    document.getElementById('auTpCancel').addEventListener('click', () => overlay.remove());
    document.getElementById('auTpConfirm').addEventListener('click', () => {
        const selected = overlay.querySelector('input[name="auTpRadio"]:checked');
        const errEl    = document.getElementById('auTpErr');
        if (!selected) { errEl.classList.remove('hidden'); return; }

        const teacherId   = selected.value;
        const teacherName = selected.dataset.name;
        const teacherUser = selected.dataset.username;

        _auPendingTeacher.set(uid, { id: teacherId, name: teacherName, username: teacherUser });

        // Actualizar la UI del bloque de profesor en la tarjeta
        const nameEl = document.getElementById(`auTeacherName_${uid}`);
        if (nameEl) nameEl.textContent = teacherName + (teacherUser ? ` (@${teacherUser})` : '');
        const pickBtn = auContainer.querySelector(`.au-teacher-pick-btn[data-uid="${uid}"]`);
        if (pickBtn) pickBtn.textContent = 'Cambiar';

        overlay.remove();
    });
}

// ─── Admin: Bots ─────────────────────────────────────────────────────────────

const _CRON_PRESETS = [
    { label: 'Cada hora',        value: '0 * * * *'    },
    { label: 'Cada 6 horas',     value: '0 */6 * * *'  },
    { label: 'Diario 9am',       value: '0 9 * * *'    },
    { label: 'Diario 6pm',       value: '0 18 * * *'   },
    { label: 'Lun y Vie 9am',    value: '0 9 * * 1,5'  },
    { label: 'Cada semana',      value: '0 9 * * 1'    },
    { label: 'Personalizado',    value: 'custom'        },
];

const _SCHEMA_TYPES = [
    { value: 'Article',          label: 'Article — post general'          },
    { value: 'LearningResource', label: 'LearningResource — recurso educativo' },
    { value: 'Course',           label: 'Course — clase / curso'          },
    { value: 'EducationEvent',   label: 'EducationEvent — evento en vivo' },
    { value: 'FAQPage',          label: 'FAQPage — preguntas y respuestas'},
];

function _botStatusBadge(bot) {
    if (!bot.enabled) return `<span class="bot-badge bot-badge--off">⏸ Pausado</span>`;
    return `<span class="bot-badge bot-badge--on">▶ Activo</span>`;
}

function _timeAgoAdmin(ts) {
    if (!ts) return 'nunca';
    const diff = Date.now() - ts;
    const min  = Math.floor(diff / 60000);
    if (min < 1)   return 'ahora';
    if (min < 60)  return `${min}m atrás`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24)  return `${hrs}h atrás`;
    return `${Math.floor(hrs / 24)}d atrás`;
}

function _botDirectionBadge(bot) {
    if (bot.direction === 'es-en') return `<span class="bot-dir-badge">🇦🇷→🇺🇸 Es→En</span>`;
    if (bot.direction === 'en-es') return `<span class="bot-dir-badge">🇺🇸→🇦🇷 En→Es</span>`;
    return '';
}

function _botCard(bot) {
    const isHumanRandom = bot.scheduleMode === 'human-random';
    const preset = _CRON_PRESETS.find(p => p.value === bot.schedule);
    const schedLabel = isHumanRandom
        ? `🎲 ${bot.postsPerDayWeekday || 2}/día · ${bot.postsPerDayWeekend || 3}/fin de semana`
        : (preset ? preset.label : bot.schedule);
    const displayName = bot.displayName || bot.name;
    return `
    <div class="bot-card" data-bot-id="${bot.id}">
        <div class="bot-card-header">
            <div class="bot-card-info">
                <span class="bot-card-name">${escapeHtml(displayName)}</span>
                ${_botDirectionBadge(bot)}
                ${_botStatusBadge(bot)}
            </div>
            <div class="bot-card-actions">
                <button class="bot-run-btn" data-id="${bot.id}" title="Ejecutar ahora">▶ Ejecutar</button>
                ${isHumanRandom ? `<button class="bot-agenda-btn" data-id="${bot.id}" title="Ver agenda">📅 Agenda</button>` : ''}
                <button class="bot-edit-btn" data-id="${bot.id}" title="Editar">✏️</button>
                <button class="bot-del-btn"  data-id="${bot.id}" title="Eliminar">🗑️</button>
            </div>
        </div>
        <div class="bot-card-meta">
            <span>🎯 ${bot.target === 'classroom' ? 'Class Room' : 'Live Feed'}</span>
            <span>📐 ${_SCHEMA_TYPES.find(s => s.value === bot.schemaType)?.label.split('—')[0].trim() || bot.schemaType}</span>
            <span>⏰ ${schedLabel}</span>
            <span>📦 ${bot.quantity} por ejecución</span>
            <span>🤖 ${bot.model || 'deepseek-chat'}</span>
        </div>
        <div class="bot-card-prompt">${escapeHtml((bot.prompt || '').slice(0, 120))}${bot.prompt?.length > 120 ? '…' : ''}</div>
        <div class="bot-card-stats">
            <span>Último: ${_timeAgoAdmin(bot.lastRun)}</span>
            <span>Total generados: ${bot.runCount || 0}</span>
            ${(bot.logs || []).slice(0, 1).map(l =>
                `<span class="${l.ok ? 'bot-log-ok' : 'bot-log-err'}">${l.ok ? `✓ ${l.count} items (${l.ms}ms)` : `✗ ${escapeHtml(l.error || '')}`}</span>`
            ).join('')}
        </div>
        <div class="bot-agenda-panel hidden" id="botAgenda_${bot.id}"></div>
        <label class="bot-toggle-wrap">
            <input type="checkbox" class="bot-toggle" data-id="${bot.id}" ${bot.enabled ? 'checked' : ''}>
            <span>${bot.enabled ? 'Activo' : 'Pausado'}</span>
        </label>
    </div>`;
}

function _botForm(bot = {}) {
    const isEdit        = !!bot.id;
    const isHumanRandom = bot.scheduleMode === 'human-random';
    const selPreset     = isHumanRandom ? 'custom' : (_CRON_PRESETS.find(p => p.value === bot.schedule)?.value || 'custom');
    const isCustom      = !isHumanRandom && selPreset === 'custom';

    return `
    <div class="bot-form" id="botForm">
        <h3 class="bot-form-title">${isEdit ? '✏️ Editar bot' : '➕ Nuevo bot'}</h3>

        <label class="bot-form-label">Nombre público (displayName)
            <input class="bot-form-input" id="bfDisplayName" maxlength="80" value="${escapeHtml(bot.displayName || '')}" placeholder="Ej: El Corrector">
        </label>

        <label class="bot-form-label">Nombre interno del bot
            <input class="bot-form-input" id="bfName" maxlength="80" value="${escapeHtml(bot.name || '')}" placeholder="Ej: Tips de vocabulario diarios">
        </label>

        <label class="bot-form-label">Dirección de idioma
            <select class="bot-form-select" id="bfDirection">
                <option value=""      ${!bot.direction            ? 'selected' : ''}>— Sin dirección —</option>
                <option value="es-en" ${bot.direction === 'es-en' ? 'selected' : ''}>Es→En</option>
                <option value="en-es" ${bot.direction === 'en-es' ? 'selected' : ''}>En→Es</option>
            </select>
        </label>

        <label class="bot-form-label">URL de avatar
            <input class="bot-form-input" id="bfAvatarUrl" maxlength="500" value="${escapeHtml(bot.avatarUrl || '')}" placeholder="https://... (se puede agregar después)">
        </label>

        <label class="bot-form-label">Destino
            <select class="bot-form-select" id="bfTarget">
                <option value="livefeed"   ${(bot.target||'livefeed') === 'livefeed'   ? 'selected' : ''}>📡 Live Feed</option>
                <option value="classroom"  ${bot.target === 'classroom'  ? 'selected' : ''}>🎓 Class Room</option>
            </select>
        </label>

        <label class="bot-form-label">Tipo de schema.org
            <select class="bot-form-select" id="bfSchema">
                ${_SCHEMA_TYPES.map(s => `<option value="${s.value}" ${(bot.schemaType||'Article') === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
        </label>

        <label class="bot-form-label">Prompt del bot
            <textarea class="bot-form-textarea" id="bfPrompt" maxlength="2000" rows="5" placeholder="Describe qué contenido debe generar. Ej: Crea posts educativos sobre expresiones coloquiales en español rioplatense, con ejemplos y traducción al inglés.">${escapeHtml(bot.prompt || '')}</textarea>
        </label>

        <div class="bot-form-label">Modo de programación
            <div class="bot-schedule-mode-wrap">
                <label class="bot-radio-label">
                    <input type="radio" name="bfScheduleMode" id="bfModeCron" value="cron" ${!isHumanRandom ? 'checked' : ''}>
                    🕐 Cron fijo
                </label>
                <label class="bot-radio-label">
                    <input type="radio" name="bfScheduleMode" id="bfModeHuman" value="human-random" ${isHumanRandom ? 'checked' : ''}>
                    🎲 Aleatorio humano
                </label>
            </div>
        </div>

        <div id="bfCronSection" style="display:${isHumanRandom ? 'none' : 'block'}">
            <label class="bot-form-label">Periodicidad
                <select class="bot-form-select" id="bfPreset">
                    ${_CRON_PRESETS.map(p => `<option value="${p.value}" ${selPreset === p.value ? 'selected' : ''}>${p.label}</option>`).join('')}
                </select>
            </label>
            <div id="bfCustomCronWrap" style="display:${isCustom ? 'block' : 'none'}">
                <label class="bot-form-label">Expresión cron (min hr día mes dow)
                    <input class="bot-form-input" id="bfCron" value="${isCustom ? escapeHtml(bot.schedule || '') : ''}" placeholder="0 9 * * *">
                    <small style="color:#6b7280">Ej: <code>0 9 * * *</code> = diario 9am · <code>*/30 * * * *</code> = cada 30 min</small>
                </label>
            </div>
        </div>

        <div id="bfHumanSection" style="display:${isHumanRandom ? 'block' : 'none'}">
            <label class="bot-form-label">Posts/día semana
                <input class="bot-form-input" id="bfPostsWeekday" type="number" min="1" max="6" value="${bot.postsPerDayWeekday || 2}">
            </label>
            <label class="bot-form-label">Posts/día fin de semana
                <input class="bot-form-input" id="bfPostsWeekend" type="number" min="1" max="8" value="${bot.postsPerDayWeekend || 3}">
            </label>
        </div>

        <label class="bot-form-label">Cantidad por ejecución (1–10)
            <input class="bot-form-input" id="bfQty" type="number" min="1" max="10" value="${bot.quantity || 1}">
        </label>

        <label class="bot-form-label">Modelo DeepSeek
            <select class="bot-form-select" id="bfModel">
                <option value="deepseek-chat"     ${(bot.model||'deepseek-chat') === 'deepseek-chat'     ? 'selected' : ''}>deepseek-chat (rápido)</option>
                <option value="deepseek-reasoner" ${bot.model === 'deepseek-reasoner' ? 'selected' : ''}>deepseek-reasoner (preciso)</option>
            </select>
        </label>

        <div class="bot-form-actions">
            <button class="admin-btn" id="bfSaveBtn">${isEdit ? 'Guardar cambios' : 'Crear bot'}</button>
            <button class="admin-btn admin-btn--secondary" id="bfCancelBtn">Cancelar</button>
        </div>
    </div>`;
}

async function _adminRenderBots(container) {
    const res  = await fetch(_API_HOST + '/admin/bots', { headers: { 'x-admin-token': ADMIN_TOKEN } });
    if (!res.ok) throw new Error('Error al cargar bots');
    const bots = await res.json();

    const hasHumanBots = bots.some(b => b.scheduleMode === 'human-random');

    const deepseekWarning = !bots.length ? '' :
        `<div class="bot-info-banner">
            ℹ️ Requiere <code>DEEPSEEK_API_KEY</code> en <code>.env</code>.
            Los bots generan contenido via <a href="https://api.deepseek.com" target="_blank">DeepSeek API</a>
            e insertan schema.org JSON-LD en cada publicación.
         </div>`;

    const seedBtn = hasHumanBots ? '' :
        `<button class="admin-btn admin-btn--seed" id="botSeedBtn">🌱 Crear bots editoriales</button>`;

    container.innerHTML = `
        <div class="admin-bots-section">
            <div class="admin-bots-header">
                <span class="admin-count">${bots.length} bot(s) · ${bots.filter(b=>b.enabled).length} activo(s)</span>
                <div class="admin-bots-header-actions">
                    ${seedBtn}
                    <button class="admin-btn" id="botNewBtn">➕ Nuevo bot</button>
                </div>
            </div>
            ${deepseekWarning}
            <div id="botFormSlot"></div>
            <div class="bot-list" id="botList">
                ${bots.length ? bots.map(_botCard).join('') : '<div class="admin-empty">🤖 No hay bots aún. Crea el primero.</div>'}
            </div>

            <!-- Gestionar posts del feed -->
            <div class="bot-posts-section" id="botPostsSection">
                <button class="admin-btn admin-btn--secondary bot-posts-toggle" id="botPostsToggleBtn">
                    📬 Gestionar posts del feed
                </button>
                <div class="bot-posts-panel hidden" id="botPostsPanel">
                    <div class="bot-posts-list" id="botPostsList">
                        <div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // ── Abrir formulario de nuevo bot ──────────────────────────────────────────
    document.getElementById('botNewBtn').addEventListener('click', () => {
        const slot = document.getElementById('botFormSlot');
        slot.innerHTML = _botForm();
        _initBotForm(null, slot, bots, container);
        slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ── Seed bots editoriales ──────────────────────────────────────────────────
    const seedBtnEl = document.getElementById('botSeedBtn');
    if (seedBtnEl) {
        seedBtnEl.addEventListener('click', async () => {
            seedBtnEl.textContent = '⏳ Creando bots…';
            seedBtnEl.disabled = true;
            try {
                const r = await fetch(_API_HOST + '/admin/seed-bots', {
                    method: 'POST',
                    headers: { 'x-admin-token': ADMIN_TOKEN }
                });
                const data = await r.json();
                if (data.ok) {
                    seedBtnEl.textContent = data.skipped ? '✓ Ya existen' : `✓ ${data.created} bots creados`;
                    setTimeout(() => _adminRenderBots(container), 1200);
                } else {
                    seedBtnEl.textContent = `✗ ${data.error || 'Error'}`;
                    seedBtnEl.disabled = false;
                }
            } catch (e) {
                seedBtnEl.textContent = '✗ Error de red';
                seedBtnEl.disabled = false;
            }
        });
    }

    // ── Toggle gestionar posts ─────────────────────────────────────────────────
    document.getElementById('botPostsToggleBtn').addEventListener('click', async () => {
        const panel = document.getElementById('botPostsPanel');
        const isOpen = !panel.classList.contains('hidden');
        if (isOpen) {
            panel.classList.add('hidden');
        } else {
            panel.classList.remove('hidden');
            await _loadAdminPosts();
        }
    });

    // ── Eventos en las tarjetas ────────────────────────────────────────────────
    _bindBotCardEvents(container, bots);
}

async function _loadAdminPosts() {
    const listEl = document.getElementById('botPostsList');
    if (!listEl) return;
    listEl.innerHTML = '<div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>';
    try {
        const r = await fetch(_API_HOST + '/admin/posts?limit=50', { headers: { 'x-admin-token': ADMIN_TOKEN } });
        if (!r.ok) throw new Error('Error al cargar posts');
        const data = await r.json();
        const posts = data.posts || [];
        if (!posts.length) {
            listEl.innerHTML = '<div class="admin-empty">📭 No hay posts en el feed.</div>';
            return;
        }
        listEl.innerHTML = posts.map(p => `
            <div class="bot-post-row" data-post-id="${p.id}">
                <div class="bot-post-main">
                    <span class="bot-post-avatar">${escapeHtml(p.avatar || '📝')}</span>
                    <span class="bot-post-title">${escapeHtml((p.title || '').slice(0, 60))}${(p.title||'').length > 60 ? '…' : ''}</span>
                    <span class="bot-post-author">— ${escapeHtml(p.author || '')}</span>
                    <span class="bot-post-date">${p.ts ? new Date(p.ts).toLocaleDateString('es-AR') : ''}</span>
                    <button class="bot-post-edit-btn" data-id="${p.id}" title="Editar">✏️</button>
                    <button class="bot-post-del-btn"  data-id="${p.id}" title="Eliminar">🗑️</button>
                </div>
                <div class="bot-post-edit-panel hidden" id="postEdit_${p.id}">
                    <label class="bot-form-label">Título
                        <input class="bot-form-input" id="peTitle_${p.id}" value="${escapeHtml(p.title || '')}">
                    </label>
                    <label class="bot-form-label">Cuerpo
                        <textarea class="bot-form-textarea" id="peBody_${p.id}" rows="3">${escapeHtml(p.body || '')}</textarea>
                    </label>
                    <label class="bot-form-label">Tags (coma separados)
                        <input class="bot-form-input" id="peTags_${p.id}" value="${escapeHtml((p.tags || []).join(', '))}">
                    </label>
                    <div class="bot-form-actions">
                        <button class="admin-btn bot-post-save-btn" data-id="${p.id}">Guardar</button>
                        <button class="admin-btn admin-btn--secondary bot-post-cancel-btn" data-id="${p.id}">Cancelar</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Bind edit/delete/save/cancel events
        listEl.querySelectorAll('.bot-post-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = document.getElementById(`postEdit_${btn.dataset.id}`);
                if (panel) panel.classList.toggle('hidden');
            });
        });
        listEl.querySelectorAll('.bot-post-cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = document.getElementById(`postEdit_${btn.dataset.id}`);
                if (panel) panel.classList.add('hidden');
            });
        });
        listEl.querySelectorAll('.bot-post-save-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id    = btn.dataset.id;
                const title = document.getElementById(`peTitle_${id}`)?.value.trim();
                const body  = document.getElementById(`peBody_${id}`)?.value.trim();
                const tagsRaw = document.getElementById(`peTags_${id}`)?.value.trim();
                const tags  = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
                btn.textContent = '⏳';
                const r = await fetch(_API_HOST + `/admin/posts/${id}`, {
                    method: 'PATCH',
                    headers: { 'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, body, tags })
                });
                if (r.ok) {
                    btn.textContent = '✓ Guardado';
                    setTimeout(() => _loadAdminPosts(), 800);
                } else {
                    btn.textContent = '✗ Error';
                    setTimeout(() => { btn.textContent = 'Guardar'; }, 2000);
                }
            });
        });
        listEl.querySelectorAll('.bot-post-del-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('¿Eliminar este post?')) return;
                const r = await fetch(_API_HOST + `/admin/posts/${btn.dataset.id}`, {
                    method: 'DELETE',
                    headers: { 'x-admin-token': ADMIN_TOKEN }
                });
                if (r.ok) {
                    btn.closest('.bot-post-row')?.remove();
                } else {
                    alert('Error al eliminar el post.');
                }
            });
        });
    } catch (e) {
        listEl.innerHTML = `<div class="admin-error">❌ ${escapeHtml(e.message)}</div>`;
    }
}

function _bindBotCardEvents(container, botsArr) {
    // Agenda button (human-random bots)
    container.querySelectorAll('.bot-agenda-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id    = btn.dataset.id;
            const panel = document.getElementById(`botAgenda_${id}`);
            if (!panel) return;
            const isOpen = !panel.classList.contains('hidden');
            if (isOpen) { panel.classList.add('hidden'); return; }
            panel.classList.remove('hidden');
            panel.innerHTML = '<em>Cargando agenda…</em>';
            try {
                const r = await fetch(_API_HOST + `/admin/bots/${id}/schedule?limit=5`, {
                    headers: { 'x-admin-token': ADMIN_TOKEN }
                });
                const entries = await r.json();
                if (!entries.length) { panel.innerHTML = '<em>Sin entradas programadas.</em>'; return; }
                panel.innerHTML = `<ul class="bot-agenda-list">${entries.slice(0, 5).map(e =>
                    `<li>📅 ${new Date(e.ts).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'short', timeStyle: 'short' })}</li>`
                ).join('')}</ul>`;
            } catch (err) {
                panel.innerHTML = `<em>Error: ${escapeHtml(err.message)}</em>`;
            }
        });
    });

    // Toggle enable/disable
    container.querySelectorAll('.bot-toggle').forEach(chk => {
        chk.addEventListener('change', async () => {
            const id = chk.dataset.id;
            await fetch(_API_HOST + `/admin/bots/${id}`, {
                method:  'PATCH',
                headers: { 'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json' },
                body:    JSON.stringify({ enabled: chk.checked })
            });
            const label = chk.nextElementSibling;
            if (label) label.textContent = chk.checked ? 'Activo' : 'Pausado';
            const card = chk.closest('.bot-card');
            const badge = card?.querySelector('.bot-badge');
            if (badge) {
                badge.className = `bot-badge ${chk.checked ? 'bot-badge--on' : 'bot-badge--off'}`;
                badge.textContent = chk.checked ? '▶ Activo' : '⏸ Pausado';
            }
        });
    });

    // Ejecutar ahora
    container.querySelectorAll('.bot-run-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id   = btn.dataset.id;
            const orig = btn.textContent;
            btn.textContent = '⏳ Ejecutando…';
            btn.disabled = true;
            try {
                const r    = await fetch(_API_HOST + `/admin/bots/${id}/run`, {
                    method: 'POST', headers: { 'x-admin-token': ADMIN_TOKEN }
                });
                const data = await r.json();
                if (data.ok) {
                    btn.textContent = `✓ ${data.generated} generados`;
                    setTimeout(async () => {
                        // Recargar la sección para actualizar stats
                        const content = document.getElementById('adminTabContent');
                        await _adminRenderBots(content);
                    }, 1500);
                } else {
                    btn.textContent = `✗ ${data.error || 'Error'}`;
                    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
                }
            } catch (e) {
                btn.textContent = '✗ Error de red';
                setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
            }
        });
    });

    // Editar
    container.querySelectorAll('.bot-edit-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id  = btn.dataset.id;
            const bot = botsArr.find(b => b.id === id);
            if (!bot) return;
            const slot = document.getElementById('botFormSlot');
            slot.innerHTML = _botForm(bot);
            _initBotForm(bot, slot, botsArr, container);
            slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Eliminar
    container.querySelectorAll('.bot-del-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm('¿Eliminar este bot? No se puede deshacer.')) return;
            await fetch(_API_HOST + `/admin/bots/${id}`, {
                method: 'DELETE', headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            btn.closest('.bot-card')?.remove();
        });
    });
}

function _initBotForm(existingBot, slot, botsArr, container) {
    const preset     = document.getElementById('bfPreset');
    const customWrap = document.getElementById('bfCustomCronWrap');
    const cronSection  = document.getElementById('bfCronSection');
    const humanSection = document.getElementById('bfHumanSection');
    const modeCronEl   = document.getElementById('bfModeCron');
    const modeHumanEl  = document.getElementById('bfModeHuman');

    function _updateScheduleMode() {
        const isHuman = modeHumanEl?.checked;
        if (cronSection)  cronSection.style.display  = isHuman ? 'none' : 'block';
        if (humanSection) humanSection.style.display = isHuman ? 'block' : 'none';
    }

    modeCronEl?.addEventListener('change',  _updateScheduleMode);
    modeHumanEl?.addEventListener('change', _updateScheduleMode);

    preset?.addEventListener('change', () => {
        if (customWrap) customWrap.style.display = preset.value === 'custom' ? 'block' : 'none';
    });

    document.getElementById('bfCancelBtn').addEventListener('click', () => {
        slot.innerHTML = '';
    });

    document.getElementById('bfSaveBtn').addEventListener('click', async () => {
        const name         = document.getElementById('bfName').value.trim();
        const displayName  = document.getElementById('bfDisplayName').value.trim();
        const direction    = document.getElementById('bfDirection').value;
        const avatarUrl    = document.getElementById('bfAvatarUrl').value.trim();
        const prompt       = document.getElementById('bfPrompt').value.trim();
        const target       = document.getElementById('bfTarget').value;
        const schemaType   = document.getElementById('bfSchema').value;
        const quantity     = parseInt(document.getElementById('bfQty').value) || 1;
        const model        = document.getElementById('bfModel').value;
        const isHuman      = modeHumanEl?.checked;
        const scheduleMode = isHuman ? 'human-random' : null;

        let schedule = null;
        let postsPerDayWeekday = null;
        let postsPerDayWeekend = null;

        if (isHuman) {
            postsPerDayWeekday = parseInt(document.getElementById('bfPostsWeekday')?.value) || 2;
            postsPerDayWeekend = parseInt(document.getElementById('bfPostsWeekend')?.value) || 3;
        } else {
            const presetVal = document.getElementById('bfPreset')?.value;
            schedule = presetVal === 'custom'
                ? document.getElementById('bfCron')?.value.trim()
                : presetVal;
        }

        if (!name || !prompt) {
            alert('Nombre y prompt son obligatorios.'); return;
        }
        if (!isHuman && !schedule) {
            alert('Periodicidad es obligatoria para modo cron.'); return;
        }

        const body = {
            name, displayName, direction, avatarUrl,
            prompt, target, schemaType, quantity, model,
            scheduleMode,
            ...(isHuman ? { postsPerDayWeekday, postsPerDayWeekend } : { schedule })
        };

        const url    = existingBot
            ? `${_API_HOST}/admin/bots/${existingBot.id}`
            : `${_API_HOST}/admin/bots`;
        const method = existingBot ? 'PATCH' : 'POST';

        const res  = await fetch(url, {
            method,
            headers: { 'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) { alert('Error: ' + (data.error || res.status)); return; }

        slot.innerHTML = '';
        // Recargar la lista
        await _adminRenderBots(container);
    });
}
