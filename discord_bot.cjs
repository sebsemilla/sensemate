// discord_bot.cjs — Bot interactivo de SenseMate para Discord
'use strict';

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const CURATED = require('./content_library.js');
const PREFIX  = '!sm';
const API     = process.env.API_URL || 'http://localhost:3000';

// ─── Cliente Discord ──────────────────────────────────────────

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// ─── Helpers ──────────────────────────────────────────────────

async function _translate(text, sourceLang = 'en', targetLang = 'es') {
    const res = await axios.post(`${API}/translate`, { text, plan: 'neutral', sourceLang, targetLang }, { timeout: 15000 });
    return JSON.parse(res.data.translation);
}

function _langFlag(code) {
    const flags = { en:'🇺🇸', es:'🇪🇸', ja:'🇯🇵', fr:'🇫🇷', de:'🇩🇪', pt:'🇧🇷', it:'🇮🇹' };
    return flags[code] || '🌐';
}

// ─── Comandos ─────────────────────────────────────────────────

const COMMANDS = {

    async traducir(msg, args) {
        if (!args.length) return msg.reply('Uso: `!sm traducir [texto en inglés]`');
        const text = args.join(' ');
        const typing = msg.channel.sendTyping();
        try {
            const t = await _translate(text);
            const embed = new EmbedBuilder()
                .setColor(0x6366f1)
                .setTitle('🔄 Traducción')
                .setDescription(`**"${text}"**`)
                .addFields(
                    { name: 'Español', value: t.neutral || t.formal || '—', inline: false },
                    ...(t.lexical?.details ? [{ name: '📚 Nota léxica', value: t.lexical.details, inline: false }] : []),
                    ...(t.lexical?.examples?.length ? [{ name: '💬 Ejemplo', value: t.lexical.examples[0], inline: false }] : [])
                )
                .setFooter({ text: 'sensemate.app — Traducción contextual con IA' });
            msg.reply({ embeds: [embed] });
        } catch {
            msg.reply('❌ Error al traducir. Intentá de nuevo en un momento.');
        }
    },

    aprende(msg) {
        const items = CURATED.map(c =>
            `• [${c.title} — ${c.subtitle}](https://sensemate.app/aprende/${c.id}) ${_langFlag(c.language)}`
        ).join('\n');
        const embed = new EmbedBuilder()
            .setColor(0x10b981)
            .setTitle('🎬 Aprende idiomas con contenido auténtico')
            .setDescription('Series, anime y más con subtítulos sincronizados y traducción al español.')
            .addFields({ name: 'Contenido disponible', value: items || '(sin contenido aún)' })
            .setURL('https://sensemate.app/aprende')
            .setFooter({ text: 'sensemate.app/aprende' });
        msg.reply({ embeds: [embed] });
    },

    ayuda(msg) {
        const embed = new EmbedBuilder()
            .setColor(0x6366f1)
            .setTitle('🧠 SenseMate Bot — Comandos')
            .addFields(
                { name: '`!sm traducir [texto]`',  value: 'Traduce del inglés al español con análisis contextual' },
                { name: '`!sm aprende`',            value: 'Ver contenido multimedia disponible (series, anime...)' },
                { name: '`!sm ayuda`',              value: 'Mostrar este menú' }
            )
            .setFooter({ text: 'sensemate.app — Aprendé idiomas con IA, gratis' });
        msg.reply({ embeds: [embed] });
    },
};

// ─── Listener de mensajes ─────────────────────────────────────

client.on('ready', () => {
    console.log(`[Discord] Bot conectado: ${client.user.tag}`);
    client.user.setActivity('!sm ayuda | sensemate.app', { type: 3 }); // WATCHING
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.toLowerCase().startsWith(PREFIX)) return;

    const parts  = msg.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd    = parts.shift().toLowerCase();
    const args   = parts;

    const handler = COMMANDS[cmd];
    if (!handler) {
        msg.reply(`Comando desconocido. Usá \`!sm ayuda\` para ver los disponibles.`);
        return;
    }
    try {
        await handler(msg, args);
    } catch (err) {
        console.error(`[Discord] Error en comando "${cmd}":`, err.message);
    }
});

// ─── Auto-posting webhook ─────────────────────────────────────
// Llamado desde bot_runner.cjs cuando se genera contenido nuevo.

async function postToDiscord(item) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const embed = {
        color: 0x6366f1,
        author: { name: item.author || 'SenseMate Bot', icon_url: 'https://sensemate.app/images/icon-192.png' },
        title: `${item.emoji || '📝'} ${item.title}`,
        description: [
            item.intro    ? `*${item.intro}*` : null,
            item.body,
            item.highlight ? `\n> **${item.highlight}**` : null,
            item.example   ? `\n💬 *${item.example}*` : null,
            item.tip       ? `\n💡 ${item.tip}` : null,
        ].filter(Boolean).join('\n'),
        fields: item.tags?.length ? [{ name: 'Tags', value: item.tags.map(t => `\`${t}\``).join(' '), inline: true }] : [],
        footer: { text: 'sensemate.app — Aprendé idiomas con IA, gratis' },
        url: 'https://sensemate.app',
        timestamp: new Date(item.ts || Date.now()).toISOString(),
    };

    try {
        await axios.post(webhookUrl, { embeds: [embed] }, { timeout: 8000 });
    } catch (err) {
        console.error('[Discord Webhook] Error al postear:', err.message);
    }
}

// ─── Init ─────────────────────────────────────────────────────

function startDiscordBot() {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        console.log('[Discord] DISCORD_BOT_TOKEN no definido — bot interactivo inactivo.');
        return;
    }
    client.login(token).catch(err => console.error('[Discord] Error al conectar:', err.message));
}

module.exports = { startDiscordBot, postToDiscord };
