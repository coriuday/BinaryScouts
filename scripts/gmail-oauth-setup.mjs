/**
 * One-time Gmail OAuth setup — obtain GMAIL_REFRESH_TOKEN for Render.
 *
 * Prerequisites:
 * 1. Google Cloud project with Gmail API enabled
 * 2. OAuth Desktop client ID + secret in .env.local:
 *    GMAIL_CLIENT_ID=...
 *    GMAIL_CLIENT_SECRET=...
 *
 * Run: npm run gmail:setup
 */
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { google } from 'googleapis';

const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

const REDIRECT_PORT = 3456;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/oauth2callback`;

function loadEnvLocal() {
  try {
    const raw = readFileSync('.env.local', 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {
    /* optional */
  }
}

loadEnvLocal();

const clientId = process.env.GMAIL_CLIENT_ID?.trim();
const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error(
    'Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET in .env.local\n' +
      'Create OAuth Desktop credentials at https://console.cloud.google.com/apis/credentials'
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: [GMAIL_SEND_SCOPE],
});

console.log('\n=== Gmail OAuth setup ===\n');
console.log('IMPORTANT: In Google Cloud → Credentials → your Web OAuth client, add:');
console.log(`  Authorized redirect URI: ${REDIRECT_URI}\n`);
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in as thebinaryscouts@gmail.com and approve access.\n');
console.log('Waiting for callback on', REDIRECT_URI, '...\n');

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/oauth2callback')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const url = new URL(req.url, `http://127.0.0.1:${REDIRECT_PORT}`);
  const code = url.searchParams.get('code');
  const err = url.searchParams.get('error');

  if (err || !code) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>Authorization failed</h1><p>${err || 'No code'}</p>`);
    server.close();
    process.exit(1);
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Success</h1><p>You can close this tab and return to the terminal.</p>');

    console.log('Authorization successful!\n');
    console.log('Add these to .env.local and Render (binaryscouts service):\n');
    console.log(`GMAIL_USER=thebinaryscouts@gmail.com`);
    console.log(`GMAIL_CLIENT_ID=${clientId}`);
    console.log(`GMAIL_CLIENT_SECRET=${clientSecret}`);
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`CONTACT_TO_EMAIL=thebinaryscouts@gmail.com`);
    console.log('\nRemove obsolete vars: GMAIL_APP_PASSWORD, RESEND_API_KEY, CONTACT_FROM_EMAIL');
    console.log('\nRedeploy Render after saving env vars.\n');

    if (tokens.refresh_token) {
      try {
        const { readFileSync, writeFileSync } = await import('fs');
        const envPath = '.env.local';
        const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
        let found = false;
        const out = lines.map((line) => {
          if (line.startsWith('GMAIL_REFRESH_TOKEN=')) {
            found = true;
            return `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`;
          }
          return line;
        });
        if (!found) out.push(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
        writeFileSync(envPath, out.join('\n') + '\n', 'utf8');
        console.log('Saved GMAIL_REFRESH_TOKEN to .env.local\n');

        if (process.env.RENDER_API_KEY) {
          console.log('Pushing Gmail vars to Render (npm run render:setup)…\n');
          const { execSync } = await import('child_process');
          try {
            execSync('npm run render:setup', { stdio: 'inherit', cwd: process.cwd() });
          } catch {
            console.warn('render:setup failed — add GMAIL_REFRESH_TOKEN to Render manually.');
          }
        }
      } catch {
        /* manual copy */
      }
    }

    if (!tokens.refresh_token) {
      console.warn(
        'WARNING: No refresh_token returned. Revoke app access at ' +
          'https://myaccount.google.com/permissions and run again with prompt=consent.'
      );
    }
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`<h1>Token exchange failed</h1><pre>${e}</pre>`);
    console.error('Token exchange failed:', e);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(REDIRECT_PORT, '127.0.0.1', () => {
  /* waiting */
});
