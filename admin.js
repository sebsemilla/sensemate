// admin.js — Panel de administración (solo isDev)
// ================================================

const ADMIN_TOKEN = 'admin_lingua_2025';

function isAdmin() {
    return currentUser?.isDev === true;
}

function loadAdminPanel() {
    if (!isAdmin()) return;

    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="admin-panel">
            <div class="admin-header">
                <button class="school-back-btn" id="adminBackBtn">← Volver</button>
                <h2 class="admin-title">🛡️ Panel de Administración</h2>
                <div class="admin-badge">Dev Mode</div>
            </div>

            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="feedback">📢 Feedback</button>
                <button class="admin-tab" data-tab="songs" id="adminTabSongs">🎵 Canciones</button>
                <button class="admin-tab" data-tab="stats">📊 Estadísticas</button>
                <button class="admin-tab" data-tab="contributors">👥 Contributores</button>
                <button class="admin-tab" data-tab="tools">🔧 Herramientas</button>
                <button class="admin-tab" data-tab="membership">💳 Membresías</button>
            </div>

            <div id="adminTabContent" class="admin-tab-content">
                <div class="admin-loading">
                    <div class="school-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
    `);

    document.getElementById('adminBackBtn').addEventListener('click', () => showMainMenu());

    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            _adminLoadTab(btn.dataset.tab);
        });
    });

    _adminLoadTab('feedback');

    // Badge de canciones pendientes en el tab "Canciones"
    fetch(_API_HOST + '/admin/songs', { headers: { 'x-admin-token': ADMIN_TOKEN } })
        .then(r => r.json())
        .then(songs => {
            const pending = songs.filter(s => s.status === 'pending').length;
            if (pending > 0) {
                const tab = document.getElementById('adminTabSongs');
                if (tab) tab.insertAdjacentHTML('beforeend',
                    `<span class="admin-music-badge">Música · ${pending}</span>`);
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
        } else if (tab === 'stats') {
            await _adminRenderStats(content);
        } else if (tab === 'contributors') {
            await _adminRenderContributors(content);
        } else if (tab === 'tools') {
            _adminRenderTools(content);
        } else if (tab === 'membership') {
            await _adminRenderMembership(content);
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
