// settings.js — Área de Configuración
// =====================================
// Globals usados: mainContainer, currentUser, currentTranslations,
// showMainMenu, showOnboarding, requireAuthForAction, showToast

// ─── Defaults ────────────────────────────────────────────────

const SETTINGS_DEFAULTS = {
    // IA y Voz
    voiceGender:          'female',      // 'female' | 'male' | 'neutral'
    voiceProvider:        'webspeech',   // 'webspeech' | 'voxtral' | 'elevenlabs'
    voiceSpeed:           1.0,
    responseLength:       'normal',      // 'short' | 'normal' | 'detailed'
    grammarCorrection:    true,
    translateUnknown:     true,
    respondInTargetLang:  false,
    aiModel:              'cohere',      // 'cohere' | 'claude-sonnet' | 'claude-opus'

    // Idioma
    nativeLanguage: 'es',
    uiLanguage:     'es',

    // Secciones visibles en el menú principal
    sections: {
        translator: true,
        school:     true,
        famous:     true,
        musicians:  true,
        immersion:  true,
        practice:   true,
    },

    // Notificaciones
    dailyReminder:     false,
    reminderTime:      '20:00',
    reminderFrequency: 'daily',   // 'daily' | 'weekdays'
};

// ─── Carga y guardado ─────────────────────────────────────────

function loadSettings() {
    try {
        // Si hay usuario logueado, leer desde su perfil
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('ls_users') || '[]');
            const user  = users.find(u => u.id === currentUser.id);
            if (user?.settings) {
                appSettings = _mergeSettings(SETTINGS_DEFAULTS, user.settings);
                return;
            }
        }
        // Fallback: leer desde localStorage genérico
        const stored = JSON.parse(localStorage.getItem('ls_app_settings') || 'null');
        appSettings = stored ? _mergeSettings(SETTINGS_DEFAULTS, stored) : { ...SETTINGS_DEFAULTS, sections: { ...SETTINGS_DEFAULTS.sections } };
    } catch {
        appSettings = { ...SETTINGS_DEFAULTS, sections: { ...SETTINGS_DEFAULTS.sections } };
    }
}

function saveSettings() {
    // Siempre guardar en localStorage
    localStorage.setItem('ls_app_settings', JSON.stringify(appSettings));

    // Si hay usuario logueado, también guardar en su perfil
    if (currentUser) {
        try {
            const users = JSON.parse(localStorage.getItem('ls_users') || '[]');
            const idx   = users.findIndex(u => u.id === currentUser.id);
            if (idx !== -1) {
                users[idx].settings = appSettings;
                localStorage.setItem('ls_users', JSON.stringify(users));
            }
        } catch (e) {
            console.error('Error guardando settings en cuenta:', e);
        }
    }
}

function _mergeSettings(defaults, overrides) {
    return {
        ...defaults,
        ...overrides,
        sections: { ...defaults.sections, ...(overrides.sections || {}) }
    };
}

// Getter conveniente
function getSetting(key, fallback) {
    return appSettings?.[key] ?? fallback ?? SETTINGS_DEFAULTS[key];
}

// ─── Sección completa ─────────────────────────────────────────

function loadSettingsSection() {
    mainContainer.innerHTML = '';
    loadSettings();

    mainContainer.insertAdjacentHTML('beforeend', `
        <div class="cfg-wrap">

            <!-- Header -->
            <div class="cfg-header">
                <button class="school-back-btn" id="cfgBackBtn">← Volver</button>
                <h2 class="cfg-title">⚙️ Configuración</h2>
            </div>

            <!-- Aviso para invitados -->
            ${!currentUser ? `
            <div class="cfg-guest-banner" id="cfgGuestBanner">
                <span>⚠️ <strong>Aviso:</strong> Logueate para que los cambios permanezcan en tu próxima sesión.</span>
                <div class="cfg-guest-actions">
                    <button class="cfg-guest-login-btn" id="cfgLoginBtn">Iniciar sesión</button>
                    <button class="cfg-guest-dismiss" id="cfgDismissGuest">✕</button>
                </div>
            </div>
            ` : ''}

            <!-- ═══ IA y Voz ═══════════════════════════════════ -->
            <div class="cfg-section">
                <div class="cfg-section-title">🤖 IA y Voz</div>

                <div class="cfg-group-label">Género de voz</div>
                <div class="cfg-radio-row" id="voiceGenderGroup">
                    ${_radioBtn('voiceGender', 'female',  '👩 Femenina', appSettings.voiceGender)}
                    ${_radioBtn('voiceGender', 'male',    '👨 Masculina', appSettings.voiceGender)}
                    ${_radioBtn('voiceGender', 'neutral', '🧑 Neutral',   appSettings.voiceGender)}
                </div>

                <div class="cfg-divider-light"></div>

                <div class="cfg-group-label">Proveedor de voz</div>
                <div class="cfg-radio-col" id="voiceProviderGroup">
                    ${_radioBtn('voiceProvider', 'webspeech',  '🔊 Web Speech API <span class="cfg-badge">Gratis</span>',  appSettings.voiceProvider)}
                    ${_radioBtn('voiceProvider', 'voxtral',    '🎙️ Mistral Voxtral <span class="cfg-badge">Gratis</span>', appSettings.voiceProvider)}
                    ${_radioBtn('voiceProvider', 'elevenlabs', '✨ ElevenLabs <span class="cfg-badge cfg-badge--premium">Premium</span>', appSettings.voiceProvider)}
                </div>

                <div class="cfg-divider-light"></div>

                <div class="cfg-row">
                    <span class="cfg-row-label">Velocidad por defecto</span>
                    <div class="cfg-speed-control">
                        <span class="cfg-speed-val" id="cfgSpeedVal">${appSettings.voiceSpeed}×</span>
                        <input type="range" id="cfgSpeedSlider" class="cfg-slider"
                               min="0.5" max="2" step="0.25" value="${appSettings.voiceSpeed}">
                    </div>
                </div>

                <div class="cfg-divider-light"></div>

                <div class="cfg-group-label">Comportamiento del tutor</div>

                <div class="cfg-group-label cfg-group-label--sub">Longitud de respuestas</div>
                <div class="cfg-radio-row" id="responseLengthGroup">
                    ${_radioBtn('responseLength', 'short',    'Corta',    appSettings.responseLength)}
                    ${_radioBtn('responseLength', 'normal',   'Normal',   appSettings.responseLength)}
                    ${_radioBtn('responseLength', 'detailed', 'Detallada', appSettings.responseLength)}
                </div>

                ${_toggleRow('grammarCorrection', '✏️ Corrección gramatical',  appSettings.grammarCorrection)}
                ${_toggleRow('translateUnknown',  '📖 Traducir palabras desconocidas', appSettings.translateUnknown)}
                ${_toggleRow('respondInTargetLang','🌐 Responder en el idioma que aprendo', appSettings.respondInTargetLang)}

                <div class="cfg-divider-light"></div>

                <div class="cfg-group-label">Modelo de IA</div>
                <div class="cfg-radio-col" id="aiModelGroup">
                    ${_radioBtn('aiModel', 'cohere',        '⚡ Cohere Command <span class="cfg-badge">Actual</span>', appSettings.aiModel)}
                    ${_radioBtn('aiModel', 'claude-sonnet', '🧠 Claude Sonnet <span class="cfg-badge cfg-badge--new">Mejor calidad</span>', appSettings.aiModel)}
                    ${_radioBtn('aiModel', 'claude-opus',   '🌟 Claude Opus <span class="cfg-badge cfg-badge--premium">Premium</span>', appSettings.aiModel)}
                </div>
            </div>

            <div class="cfg-divider"></div>

            <!-- ═══ Idioma ══════════════════════════════════════ -->
            <div class="cfg-section">
                <div class="cfg-section-title">🌐 Idioma</div>

                <div class="cfg-row">
                    <span class="cfg-row-label">Idioma de la interfaz</span>
                    <select class="cfg-select" id="cfgUILang">
                        ${_langOptions(appSettings.uiLanguage)}
                    </select>
                </div>
            </div>

            <div class="cfg-divider"></div>

            <!-- ═══ Secciones del menú principal ════════════════ -->
            <div class="cfg-section">
                <div class="cfg-section-title">🏠 Secciones del menú principal</div>
                <p class="cfg-section-desc">Las secciones desactivadas aparecen minimizadas en el menú.</p>

                ${_toggleRow('sec_translator', '🔄 Traductor (Modo Simple)',   appSettings.sections.translator)}
                ${_toggleRow('sec_school',     '📚 Modo Escuela',              appSettings.sections.school)}
                ${_toggleRow('sec_famous',     '⭐ Famosos',                   appSettings.sections.famous)}
                ${_toggleRow('sec_musicians',  '🎵 Músicos y Letras',          appSettings.sections.musicians)}
                ${_toggleRow('sec_immersion',  '🌍 Aprende con...',            appSettings.sections.immersion)}
                ${_toggleRow('sec_practice',   '📇 Práctica / Flashcards',     appSettings.sections.practice)}
            </div>

            <div class="cfg-divider"></div>

            <!-- ═══ Notificaciones ══════════════════════════════ -->
            <div class="cfg-section">
                <div class="cfg-section-title">🔔 Notificaciones</div>

                ${_toggleRow('dailyReminder', 'Recordatorio diario de práctica', appSettings.dailyReminder)}

                <div class="cfg-row cfg-row--sub ${appSettings.dailyReminder ? '' : 'cfg-row--disabled'}" id="reminderTimeRow">
                    <span class="cfg-row-label">Hora del recordatorio</span>
                    <input type="time" class="cfg-select" id="cfgReminderTime"
                           value="${appSettings.reminderTime}"
                           ${appSettings.dailyReminder ? '' : 'disabled'}>
                </div>

                <div class="cfg-row cfg-row--sub ${appSettings.dailyReminder ? '' : 'cfg-row--disabled'}" id="reminderFreqRow">
                    <span class="cfg-row-label">Frecuencia</span>
                    <select class="cfg-select" id="cfgReminderFreq" ${appSettings.dailyReminder ? '' : 'disabled'}>
                        <option value="daily"    ${appSettings.reminderFrequency === 'daily'    ? 'selected' : ''}>Todos los días</option>
                        <option value="weekdays" ${appSettings.reminderFrequency === 'weekdays' ? 'selected' : ''}>Días de semana</option>
                    </select>
                </div>
            </div>

            <div class="cfg-divider"></div>

            <!-- ═══ Privacidad y datos ══════════════════════════ -->
            <div class="cfg-section">
                <div class="cfg-section-title">🔒 Privacidad y datos</div>

                <button class="cfg-danger-btn" id="cfgClearHistory">
                    🗑️ Borrar historial de conversaciones
                </button>
                <button class="cfg-danger-btn" id="cfgClearFlashcards">
                    🗑️ Borrar todas las flashcards
                </button>
                <button class="cfg-export-btn" id="cfgExportFlashcards">
                    📥 Exportar flashcards como CSV
                </button>
                <button class="cfg-danger-btn cfg-danger-btn--hard" id="cfgClearAll">
                    ⚠️ Borrar todo mi progreso
                </button>
            </div>

        </div>
    `);

    _bindSettingsEvents();
}

// ─── Bind de todos los eventos ────────────────────────────────

function _bindSettingsEvents() {
    // Volver
    document.getElementById('cfgBackBtn').addEventListener('click', showMainMenu);

    // Banner invitado
    document.getElementById('cfgLoginBtn')?.addEventListener('click', () => showOnboarding(true));
    document.getElementById('cfgDismissGuest')?.addEventListener('click', () => {
        document.getElementById('cfgGuestBanner')?.remove();
    });

    // Género de voz
    _bindRadioGroup('voiceGender', val => {
        appSettings.voiceGender = val;
        saveSettings();
    });

    // Proveedor de voz
    _bindRadioGroup('voiceProvider', val => {
        appSettings.voiceProvider = val;
        saveSettings();
        showToast(`Proveedor de voz: ${val}`);
    });

    // Velocidad
    const slider   = document.getElementById('cfgSpeedSlider');
    const speedVal = document.getElementById('cfgSpeedVal');
    slider?.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        speedVal.textContent = v + '×';
        appSettings.voiceSpeed = v;
        saveSettings();
    });

    // Longitud de respuestas
    _bindRadioGroup('responseLength', val => {
        appSettings.responseLength = val;
        saveSettings();
    });

    // Toggles de comportamiento del tutor
    _bindToggle('grammarCorrection', val => { appSettings.grammarCorrection   = val; saveSettings(); });
    _bindToggle('translateUnknown',  val => { appSettings.translateUnknown    = val; saveSettings(); });
    _bindToggle('respondInTargetLang', val => { appSettings.respondInTargetLang = val; saveSettings(); });

    // Modelo de IA
    _bindRadioGroup('aiModel', val => {
        // Claude Opus requiere Premium
        if (val === 'claude-opus' && !_isPremium()) {
            showToast('🔒 Claude Opus es una función Premium');
            // Resetear al anterior
            document.querySelector(`input[name="aiModel"][value="${appSettings.aiModel}"]`).checked = true;
            return;
        }
        appSettings.aiModel = val;
        saveSettings();
        showToast(`Modelo: ${val}`);
    });

    // Idiomas
    document.getElementById('cfgUILang')?.addEventListener('change', async e => {
        const newLang = e.target.value;
        appSettings.uiLanguage = newLang;
        appUILanguage = newLang;
        localStorage.setItem('appUILanguage', newLang);
        saveSettings();

        // Recargar traducciones y re-renderizar en el nuevo idioma
        await loadTranslations(newLang);
        updateMenuLanguageDisplay();
        showToast('✅ Idioma actualizado');
        loadSettingsSection(); // re-renderizar la sección en el nuevo idioma
    });

    // Toggles de secciones
    ['translator','school','famous','musicians','immersion','practice'].forEach(key => {
        _bindToggle(`sec_${key}`, val => {
            appSettings.sections[key] = val;
            saveSettings();
        });
    });

    // Notificaciones
    _bindToggle('dailyReminder', val => {
        appSettings.dailyReminder = val;
        saveSettings();
        // Habilitar/deshabilitar los campos dependientes
        ['cfgReminderTime', 'cfgReminderFreq'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = !val;
        });
        ['reminderTimeRow', 'reminderFreqRow'].forEach(id => {
            document.getElementById(id)?.classList.toggle('cfg-row--disabled', !val);
        });
    });
    document.getElementById('cfgReminderTime')?.addEventListener('change', e => {
        appSettings.reminderTime = e.target.value;
        saveSettings();
    });
    document.getElementById('cfgReminderFreq')?.addEventListener('change', e => {
        appSettings.reminderFrequency = e.target.value;
        saveSettings();
    });

    // Privacidad
    document.getElementById('cfgClearHistory')?.addEventListener('click', () => {
        if (!confirm('¿Borrar todo el historial de conversaciones?')) return;
        localStorage.removeItem('ls_chat_history');
        showToast('✅ Historial borrado');
    });

    document.getElementById('cfgClearFlashcards')?.addEventListener('click', () => {
        if (!confirm('¿Borrar todas las flashcards? Esta acción no se puede deshacer.')) return;
        localStorage.removeItem('flashcards');
        localStorage.removeItem('flashcardGroups');
        localStorage.removeItem('userFlashcards');
        showToast('✅ Flashcards borradas');
    });

    document.getElementById('cfgExportFlashcards')?.addEventListener('click', () => {
        const cards = JSON.parse(localStorage.getItem('flashcards') || '[]');
        if (!cards.length) { showToast('No hay flashcards para exportar'); return; }
        const csv = 'Palabra,Traducción,Grupo,Fecha\n' +
            cards.map(c => `"${(c.word||'').replace(/"/g,'""')}","${(c.translation||'').replace(/"/g,'""')}","${(c.groupId||'')}","${(c.dateAdded||'')}"`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = 'flashcards_sensemate.csv';
        a.click();
        showToast('✅ Exportadas ' + cards.length + ' flashcards');
    });

    document.getElementById('cfgClearAll')?.addEventListener('click', () => {
        if (!confirm('⚠️ ¿Borrar TODO el progreso? Se eliminarán flashcards, historial y configuración. Esta acción es irreversible.')) return;
        const keysToKeep = ['ls_users', 'ls_session', 'ls_onboarding_seen'];
        const allKeys    = Object.keys(localStorage);
        allKeys.forEach(k => { if (!keysToKeep.includes(k)) localStorage.removeItem(k); });
        showToast('✅ Progreso borrado');
        setTimeout(showMainMenu, 1200);
    });
}

// ─── Helpers de renderizado ───────────────────────────────────

function _toggleRow(id, label, value) {
    return `
        <div class="cfg-row">
            <span class="cfg-row-label">${label}</span>
            <label class="cfg-toggle">
                <input type="checkbox" id="cfg_${id}" ${value ? 'checked' : ''}>
                <span class="cfg-toggle-track">
                    <span class="cfg-toggle-thumb"></span>
                </span>
            </label>
        </div>`;
}

function _radioBtn(name, value, label, current) {
    return `
        <label class="cfg-radio-opt ${current === value ? 'active' : ''}">
            <input type="radio" name="${name}" value="${value}" ${current === value ? 'checked' : ''}>
            <span>${label}</span>
        </label>`;
}

function _langOptions(current) {
    const langs = [
        { code: 'es', name: '🇪🇸 Español' },
        { code: 'en', name: '🇬🇧 Inglés' },
        { code: 'fr', name: '🇫🇷 Francés' },
        { code: 'de', name: '🇩🇪 Alemán' },
        { code: 'it', name: '🇮🇹 Italiano' },
        { code: 'pt', name: '🇧🇷 Portugués' },
        { code: 'zh', name: '🇨🇳 Chino' },
        { code: 'ja', name: '🇯🇵 Japonés' },
    ];
    return langs.map(l =>
        `<option value="${l.code}" ${l.code === current ? 'selected' : ''}>${l.name}</option>`
    ).join('');
}

// ─── Helpers de bind ──────────────────────────────────────────

function _bindToggle(id, onChange) {
    const el = document.getElementById(`cfg_${id}`);
    if (!el) return;
    el.addEventListener('change', () => onChange(el.checked));
}

function _bindRadioGroup(name, onChange) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                // Actualizar clase active
                document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                    r.closest('.cfg-radio-opt')?.classList.toggle('active', r.checked);
                });
                onChange(radio.value);
            }
        });
    });
}

function _isPremium() {
    return currentUser?.isPremium === true;
}

// ─── Helper para secciones minimizadas en showMainMenu ────────

function sectionMinimized(key, icon, label) {
    return `
        <div class="main-section-muted" data-section="${key}"
             title="Activar en Configuración">
            <span class="msm-icon">${icon}</span>
            <span class="msm-label">${label}</span>
            <span class="msm-badge">Desactivado</span>
        </div>`;
}

function sectionEnabled(key) {
    return appSettings?.sections?.[key] !== false;
}
