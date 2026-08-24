// promotor.js — Área de promotores
// =================================

async function loadPromotorPanel() {
    if (!currentUser || currentUser.role !== 'promotor') return;

    mainContainer.innerHTML = '';
    renderLanguageBar();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="promotor-panel">
            <div class="admin-header">
                <button class="school-back-btn" id="promotorBackBtn">← Volver</button>
                <h2 class="admin-title">⭐ Área de Promotor</h2>
            </div>
            <div id="promotorContent" class="promotor-content">
                <div class="admin-loading"><div class="school-dots"><span></span><span></span><span></span></div></div>
            </div>
        </div>
    `);

    document.getElementById('promotorBackBtn')?.addEventListener('click', () => {
        if (typeof renderLanguageBar === 'function') renderLanguageBar();
        mainContainer.innerHTML = '';
    });

    await _promotorLoadDashboard();
}

async function _promotorLoadDashboard() {
    const content = document.getElementById('promotorContent');
    if (!content) return;

    try {
        const session = JSON.parse(localStorage.getItem('ls_session') || '{}');
        const res = await fetch(`${_API_HOST}/promotores/me`, {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        if (!res.ok) throw new Error('Error al cargar datos');
        const data = await res.json();
        _promotorRender(content, data);
    } catch (e) {
        content.innerHTML = `<p class="admin-empty">Error al cargar el panel: ${e.message}</p>`;
    }
}

function _promotorRender(container, data) {
    const { profile, stage, currentPct, refCount, memberCount, nextThreshold, pending, earnings, payouts } = data;

    const stageLabels = { 1: 'Etapa 1 — Referidos personales', 2: 'Etapa 2 — Regional', 3: 'Etapa 3 — Regional', 4: 'Etapa 4 — Consolidado' };
    const payFreq = stage === 1 ? 'Semanal' : stage === 2 ? 'Cada 15 días' : 'Mensual';
    const nextMsg = nextThreshold
        ? `Próxima etapa en: <strong>${nextThreshold - (stage === 1 ? refCount : memberCount)} personas</strong>`
        : '¡Etapa máxima alcanzada!';

    const pendingEarnings = earnings.filter(e => !e.payout_id);
    const paidEarnings    = earnings.filter(e => e.payout_id);

    container.innerHTML = `
        <div class="promotor-stats-grid">
            <div class="promotor-stat-card">
                <div class="promotor-stat-label">Tu código</div>
                <div class="promotor-stat-value promotor-code">${profile.code}</div>
                <div class="promotor-stat-sub">País asignado: ${profile.assigned_country}</div>
            </div>
            <div class="promotor-stat-card highlight">
                <div class="promotor-stat-label">Comisión actual</div>
                <div class="promotor-stat-value">${currentPct}%</div>
                <div class="promotor-stat-sub">${stageLabels[stage]}</div>
            </div>
            <div class="promotor-stat-card">
                <div class="promotor-stat-label">Saldo pendiente</div>
                <div class="promotor-stat-value green">$${pending.toFixed(2)}</div>
                <div class="promotor-stat-sub">Frecuencia de pago: ${payFreq}</div>
            </div>
            <div class="promotor-stat-card">
                <div class="promotor-stat-label">Progreso</div>
                <div class="promotor-stat-value">${stage === 1 ? refCount : memberCount}</div>
                <div class="promotor-stat-sub">${nextMsg}</div>
            </div>
        </div>

        <div class="promotor-section">
            <h3 class="promotor-section-title">Comisiones pendientes de cobro</h3>
            ${pendingEarnings.length === 0
                ? '<p class="admin-empty">Sin comisiones pendientes.</p>'
                : _promotorEarningsTable(pendingEarnings)}
        </div>

        <div class="promotor-section">
            <h3 class="promotor-section-title">Historial de pagos recibidos</h3>
            ${payouts.length === 0
                ? '<p class="admin-empty">Aún no recibiste pagos.</p>'
                : _promotorPayoutsTable(payouts)}
        </div>

        <div class="promotor-section">
            <h3 class="promotor-section-title">Comisiones ya cobradas</h3>
            ${paidEarnings.length === 0
                ? '<p class="admin-empty">Sin comisiones cobradas aún.</p>'
                : _promotorEarningsTable(paidEarnings)}
        </div>
    `;
}

function _promotorEarningsTable(earnings) {
    const rows = earnings.map(e => `
        <tr>
            <td>${new Date(e.created_at).toLocaleDateString('es-AR')}</td>
            <td>Etapa ${e.stage}</td>
            <td>${e.commission_pct}%</td>
            <td>$${e.payment_amount.toFixed(2)}</td>
            <td class="green"><strong>$${e.commission_amount.toFixed(2)}</strong></td>
        </tr>
    `).join('');
    return `
        <table class="promotor-table">
            <thead><tr><th>Fecha</th><th>Etapa</th><th>%</th><th>Pago</th><th>Comisión</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

function _promotorPayoutsTable(payouts) {
    const rows = payouts.map(p => `
        <tr>
            <td>${new Date(p.paid_at).toLocaleDateString('es-AR')}</td>
            <td class="green"><strong>$${p.amount.toFixed(2)}</strong></td>
            <td>${p.note || '—'}</td>
        </tr>
    `).join('');
    return `
        <table class="promotor-table">
            <thead><tr><th>Fecha</th><th>Monto</th><th>Nota</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}
