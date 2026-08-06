// mcp_server.cjs — SenseMate MCP Server
// Transports:
//   stdio  → para Claude Desktop / Cursor / clientes locales
//   HTTP   → montado en Express vía registerMcpRoutes()  (POST /mcp, GET /mcp/sse)
'use strict';

const { AsyncLocalStorage }           = require('async_hooks');
const { Server }                      = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport }        = require('@modelcontextprotocol/sdk/server/stdio.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { loadBots, loadFeed, loadClasses, runBot } = require('./bot_runner.cjs');

// Contexto de request para pasar el adminToken de Smithery (query param) a los handlers
const _reqCtx = new AsyncLocalStorage();

const SERVER_INFO = {
    name:    'sensemate-content',
    version: '1.0.0',
    title:   'SenseMate Content MCP Server',
};

const CAPABILITIES = {
    tools:     {},
    resources: {},
};

// ─── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS = [
    {
        name:        'get_feed',
        description: 'Obtiene las publicaciones recientes del Live Feed de SenseMate. Contenido educativo sobre idiomas generado por bots IA.',
        inputSchema: {
            type: 'object',
            properties: {
                limit:  { type: 'number',  description: 'Máximo de posts a devolver (1-100). Default: 20', default: 20 },
                offset: { type: 'number',  description: 'Offset para paginación. Default: 0', default: 0 },
            },
        },
    },
    {
        name:        'get_classes',
        description: 'Obtiene clases disponibles o en vivo del Class Room de SenseMate.',
        inputSchema: {
            type: 'object',
            properties: {
                tab:   { type: 'string', enum: ['disponibles', 'live'], description: '"disponibles" (default) o "live"', default: 'disponibles' },
                limit: { type: 'number', description: 'Máximo de clases a devolver (1-100). Default: 20', default: 20 },
            },
        },
    },
    {
        name:        'list_bots',
        description: '[Admin] Lista todos los bots de contenido con sus configuraciones y estadísticas.',
        inputSchema: {
            type: 'object',
            properties: {
                admin_token: { type: 'string', description: 'Token de administrador (ADMIN_TOKEN del .env)' },
            },
            required: ['admin_token'],
        },
    },
    {
        name:        'run_bot',
        description: '[Admin] Ejecuta un bot manualmente para generar contenido nuevo ahora.',
        inputSchema: {
            type: 'object',
            properties: {
                admin_token: { type: 'string', description: 'Token de administrador' },
                bot_id:      { type: 'string', description: 'ID del bot a ejecutar (obtenido con list_bots)' },
            },
            required: ['admin_token', 'bot_id'],
        },
    },
    {
        name:        'create_bot',
        description: '[Admin] Crea un nuevo bot de contenido con prompt y periodicidad.',
        inputSchema: {
            type: 'object',
            properties: {
                admin_token: { type: 'string', description: 'Token de administrador' },
                name:        { type: 'string', description: 'Nombre descriptivo del bot' },
                prompt:      { type: 'string', description: 'Instrucción de qué contenido debe generar' },
                target:      { type: 'string', enum: ['livefeed', 'classroom'], description: 'Destino del contenido' },
                schema_type: {
                    type: 'string',
                    enum: ['Article', 'LearningResource', 'Course', 'EducationEvent', 'FAQPage'],
                    description: 'Tipo de schema.org para los posts generados',
                    default: 'Article',
                },
                schedule:    { type: 'string', description: 'Expresión cron. Ej: "0 9 * * *" = diario a las 9am' },
                quantity:    { type: 'number', description: 'Posts por ejecución (1-10)', default: 2 },
                model:       {
                    type: 'string',
                    enum: ['deepseek-chat', 'deepseek-reasoner'],
                    description: 'Modelo DeepSeek a usar',
                    default: 'deepseek-chat',
                },
            },
            required: ['admin_token', 'name', 'prompt', 'schedule'],
        },
    },
    {
        name:        'get_bot_logs',
        description: '[Admin] Obtiene los últimos logs de ejecución de un bot.',
        inputSchema: {
            type: 'object',
            properties: {
                admin_token: { type: 'string', description: 'Token de administrador' },
                bot_id:      { type: 'string', description: 'ID del bot' },
            },
            required: ['admin_token', 'bot_id'],
        },
    },
];

// ─── Tool handlers ─────────────────────────────────────────────────────────────

function _checkAdmin(args) {
    const expected = process.env.ADMIN_TOKEN;
    if (!expected) throw new Error('ADMIN_TOKEN no configurado en el servidor.');
    // Acepta el token desde los args del tool call O desde el query param de Smithery
    const provided = args.admin_token || _reqCtx.getStore()?.adminToken || '';
    if (provided !== expected) throw new Error('Token de administrador inválido.');
}

async function _handleTool(name, args) {
    switch (name) {

        case 'get_feed': {
            const limit  = Math.min(Math.max(parseInt(args.limit  || 20), 1), 100);
            const offset = Math.max(parseInt(args.offset || 0), 0);
            const posts  = loadFeed().slice(offset, offset + limit);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        total:  loadFeed().length,
                        offset,
                        limit,
                        posts:  posts.map(p => ({
                            id:     p.id,
                            author: p.author,
                            avatar: p.avatar,
                            title:  p.title,
                            body:   p.body,
                            tags:   p.tags,
                            level:  p.level,
                            lang:   p.lang,
                            ts:     p.ts,
                            likes:  p.likes,
                            schema: p.schema,
                        })),
                    }, null, 2),
                }],
            };
        }

        case 'get_classes': {
            const tab    = args.tab === 'live' ? 'live' : 'disponibles';
            const limit  = Math.min(Math.max(parseInt(args.limit || 20), 1), 100);
            const all    = loadClasses();
            const filtered = tab === 'live' ? all.filter(c => c.live) : all.filter(c => !c.live);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        tab,
                        total:   filtered.length,
                        classes: filtered.slice(0, limit).map(c => ({
                            id:      c.id,
                            teacher: c.teacher,
                            emoji:   c.emoji,
                            title:   c.title,
                            body:    c.body,
                            tags:    c.tags,
                            level:   c.level,
                            lang:    c.lang,
                            live:    c.live,
                            ts:      c.ts,
                            schema:  c.schema,
                        })),
                    }, null, 2),
                }],
            };
        }

        case 'list_bots': {
            _checkAdmin(args);
            const bots = loadBots().map(b => ({
                id:         b.id,
                name:       b.name,
                target:     b.target,
                schemaType: b.schemaType,
                schedule:   b.schedule,
                quantity:   b.quantity,
                model:      b.model,
                enabled:    b.enabled,
                lastRun:    b.lastRun,
                runCount:   b.runCount,
                prompt:     b.prompt.slice(0, 100) + (b.prompt.length > 100 ? '…' : ''),
                recentLogs: (b.logs || []).slice(0, 3),
            }));
            return { content: [{ type: 'text', text: JSON.stringify(bots, null, 2) }] };
        }

        case 'run_bot': {
            _checkAdmin(args);
            if (!args.bot_id) throw new Error('Se requiere bot_id');
            const items = await runBot(args.bot_id);
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({ ok: true, generated: items.length, items }, null, 2),
                }],
            };
        }

        case 'create_bot': {
            _checkAdmin(args);
            const crypto = require('crypto');
            const { saveBots } = require('./bot_runner.cjs');
            const bots = loadBots();
            const qty  = Math.min(Math.max(parseInt(args.quantity) || 2, 1), 10);
            const bot  = {
                id:         `bot_${crypto.randomBytes(5).toString('hex')}`,
                name:       String(args.name).slice(0, 80),
                prompt:     String(args.prompt).slice(0, 2000),
                target:     ['livefeed','classroom'].includes(args.target) ? args.target : 'livefeed',
                schemaType: ['Article','LearningResource','Course','EducationEvent','FAQPage'].includes(args.schema_type)
                                ? args.schema_type : 'Article',
                schedule:   String(args.schedule).trim(),
                quantity:   qty,
                model:      ['deepseek-chat','deepseek-reasoner'].includes(args.model) ? args.model : 'deepseek-chat',
                enabled:    true,
                lastRun:    null,
                runCount:   0,
                logs:       [],
                createdAt:  Date.now(),
            };
            bots.push(bot);
            saveBots(bots);
            return { content: [{ type: 'text', text: JSON.stringify(bot, null, 2) }] };
        }

        case 'get_bot_logs': {
            _checkAdmin(args);
            const bot = loadBots().find(b => b.id === args.bot_id);
            if (!bot) throw new Error(`Bot ${args.bot_id} no encontrado`);
            return { content: [{ type: 'text', text: JSON.stringify(bot.logs || [], null, 2) }] };
        }

        default:
            throw new Error(`Herramienta desconocida: ${name}`);
    }
}

// ─── MCP Server factory ────────────────────────────────────────────────────────

function createMcpServer() {
    const server = new Server(SERVER_INFO, { capabilities: CAPABILITIES });

    server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

    server.setRequestHandler(CallToolRequestSchema, async (req) => {
        const { name, arguments: args = {} } = req.params;
        try {
            return await _handleTool(name, args);
        } catch (err) {
            return {
                content:  [{ type: 'text', text: `Error: ${err.message}` }],
                isError:  true,
            };
        }
    });

    server.setRequestHandler(ListResourcesRequestSchema, async () => ({
        resources: [
            {
                uri:         'sensemate://feed',
                name:        'Live Feed',
                description: 'Publicaciones educativas recientes sobre idiomas',
                mimeType:    'application/json',
            },
            {
                uri:         'sensemate://classroom',
                name:        'Class Room',
                description: 'Clases disponibles y en vivo',
                mimeType:    'application/json',
            },
        ],
    }));

    server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
        const { uri } = req.params;
        if (uri === 'sensemate://feed') {
            return {
                contents: [{
                    uri,
                    mimeType: 'application/json',
                    text:     JSON.stringify({ posts: loadFeed().slice(0, 20) }, null, 2),
                }],
            };
        }
        if (uri === 'sensemate://classroom') {
            return {
                contents: [{
                    uri,
                    mimeType: 'application/json',
                    text:     JSON.stringify({ classes: loadClasses().slice(0, 20) }, null, 2),
                }],
            };
        }
        throw new Error(`Recurso desconocido: ${uri}`);
    });

    return server;
}

// ─── Modo stdio (ejecución directa: node mcp_server.cjs) ──────────────────────

if (require.main === module) {
    require('dotenv').config({ quiet: true }); // quiet: evita que dotenv@17 imprima a stdout (corrompe JSON-RPC)
    const server    = createMcpServer();
    const transport = new StdioServerTransport();
    server.connect(transport).then(() => {
        process.stderr.write('[SenseMate MCP] Servidor stdio listo.\n');
    });
}

// ─── Modo HTTP (montado en Express desde server.cjs) ──────────────────────────

function registerMcpRoutes(app) {
    // Mapa de sesiones HTTP persistentes (sessionId → { transport, server })
    const _sessions = new Map();

    // POST /mcp  → inicializar sesión o manejar request existente
    app.post('/mcp', async (req, res) => {
        try {
            const sessionId  = req.headers['mcp-session-id'];
            // Smithery pasa el adminToken como query param: /mcp?adminToken=xxx
            const adminToken = req.query.adminToken || '';

            const handleWithCtx = (transport) =>
                _reqCtx.run({ adminToken }, () =>
                    transport.handleRequest(req, res, req.body)
                );

            // Sesión existente
            if (sessionId && _sessions.has(sessionId)) {
                await handleWithCtx(_sessions.get(sessionId).transport);
                return;
            }

            // Nueva sesión
            const crypto    = require('crypto');
            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => crypto.randomBytes(16).toString('hex'),
                onsessioninitialized: (id) => {
                    _sessions.set(id, { transport, server: mcpServer });
                },
            });
            transport.onclose = () => {
                if (transport.sessionId) _sessions.delete(transport.sessionId);
            };

            const mcpServer = createMcpServer();
            await mcpServer.connect(transport);
            await handleWithCtx(transport);
        } catch (err) {
            console.error('[MCP] Error en POST /mcp:', err);
            if (!res.headersSent) res.status(500).json({ error: 'MCP initialization error', detail: err.message });
        }
    });

    // GET /mcp  → SSE para notificaciones push
    app.get('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'];
        const session   = sessionId && _sessions.get(sessionId);
        if (!session) {
            res.status(400).json({ error: 'Sesión MCP no encontrada. Inicia con POST /mcp primero.' });
            return;
        }
        await session.transport.handleRequest(req, res);
    });

    // DELETE /mcp  → cerrar sesión
    app.delete('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'];
        const session   = sessionId && _sessions.get(sessionId);
        if (session) {
            await session.transport.handleRequest(req, res);
            _sessions.delete(sessionId);
        } else {
            res.status(404).json({ error: 'Sesión no encontrada' });
        }
    });

    // Nota: /.well-known/mcp/server-card.json se sirve como archivo estático
    // desde .well-known/mcp/server-card.json (dotfiles: 'allow' en express.static)

    console.log('[MCP] Servidor HTTP activo en POST /mcp');
    console.log('[MCP] Server Card en /.well-known/mcp/server-card.json (archivo estático)');
}

module.exports = { createMcpServer, registerMcpRoutes, TOOLS, SERVER_INFO };
