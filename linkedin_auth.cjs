/**
 * linkedin_auth.cjs
 * ─────────────────────────────────────────────────────────────
 * Flujo OAuth 2.0 de LinkedIn — correr UNA SOLA VEZ para obtener
 * el access_token y person_urn, luego guardarlos en .env.
 *
 * Uso:
 *   node linkedin_auth.cjs
 *
 * Prerequisitos en tu LinkedIn Developer App:
 *   - Producto "Share on LinkedIn" habilitado
 *   - Redirect URI agregada: http://localhost:8787/callback
 *   - Permisos: r_liteprofile, w_member_social
 */

const http     = require('http');
const https    = require('https');
const url      = require('url');
const fs       = require('fs');
const readline = require('readline');

// ── Leer CLIENT_ID y CLIENT_SECRET ────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

const REDIRECT_URI = 'http://localhost:8787/callback';
const SCOPE        = 'r_liteprofile w_member_social';

async function main() {
  console.log('\n🔗 LinkedIn OAuth — Autenticación inicial\n');

  const clientId     = await ask('Client ID de tu LinkedIn App: ');
  const clientSecret = await ask('Client Secret de tu LinkedIn App: ');
  rl.close();

  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}`;

  console.log('\n1. Abrí esta URL en el navegador y autorizá la app:');
  console.log('\n' + authUrl + '\n');
  console.log('2. Esperando callback en http://localhost:8787/callback ...\n');

  const code = await waitForCode();

  console.log('✅ Código recibido. Obteniendo access token...');

  const tokens = await exchangeCode(clientId, clientSecret, code);

  console.log('✅ Token obtenido. Obteniendo tu Person URN...');

  const personUrn = await getPersonUrn(tokens.access_token);

  console.log(`\n✅ Person URN: ${personUrn}`);
  console.log(`✅ Access Token (expira en ~60 días):\n${tokens.access_token}\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Agrega estas líneas a tu .env:\n');
  console.log(`LINKEDIN_CLIENT_ID=${clientId}`);
  console.log(`LINKEDIN_CLIENT_SECRET=${clientSecret}`);
  console.log(`LINKEDIN_ACCESS_TOKEN=${tokens.access_token}`);
  if (tokens.refresh_token) {
    console.log(`LINKEDIN_REFRESH_TOKEN=${tokens.refresh_token}`);
  }
  console.log(`LINKEDIN_PERSON_URN=${personUrn}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Opcional: escribir directamente al .env
  const envPath = './.env';
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    const lines = [
      `LINKEDIN_CLIENT_ID=${clientId}`,
      `LINKEDIN_CLIENT_SECRET=${clientSecret}`,
      `LINKEDIN_ACCESS_TOKEN=${tokens.access_token}`,
      tokens.refresh_token ? `LINKEDIN_REFRESH_TOKEN=${tokens.refresh_token}` : null,
      `LINKEDIN_PERSON_URN=${personUrn}`,
    ].filter(Boolean);

    // Reemplazar o agregar cada línea
    for (const line of lines) {
      const key = line.split('=')[0];
      if (env.includes(key + '=')) {
        env = env.replace(new RegExp(`^${key}=.*$`, 'm'), line);
      } else {
        env += '\n' + line;
      }
    }
    fs.writeFileSync(envPath, env.trimEnd() + '\n');
    console.log('✅ Variables guardadas automáticamente en .env\n');
  }
}

// ── Servidor temporal para capturar el código ─────────────────
function waitForCode() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsed = url.parse(req.url, true);
      if (parsed.pathname === '/callback') {
        const code = parsed.query.code;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>✅ ¡Autorización exitosa! Podés cerrar esta ventana.</h2>');
        server.close();
        if (code) resolve(code);
        else reject(new Error('No se recibió código'));
      }
    });
    server.listen(8787);
  });
}

// ── Intercambiar código por token ─────────────────────────────
function exchangeCode(clientId, clientSecret, code) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      client_id:     clientId,
      client_secret: clientSecret,
    }).toString();

    const options = {
      hostname: 'www.linkedin.com',
      path:     '/oauth/v2/accessToken',
      method:   'POST',
      headers:  {
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Token parse error: ' + data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Obtener Person URN ────────────────────────────────────────
function getPersonUrn(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.linkedin.com',
      path:     '/v2/me',
      headers:  { Authorization: `Bearer ${accessToken}` },
    };
    https.get(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.id) resolve(`urn:li:person:${json.id}`);
          else reject(new Error('No se obtuvo ID: ' + data));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
