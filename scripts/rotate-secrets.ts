/**
 * Rotate local + Render-facing secrets (admin, session, internal API key).
 * Supabase + Resend must be rotated manually in their dashboards.
 * Run: npm run rotate:secrets
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const root = process.cwd();
const envLocal = path.join(root, '.env.local');
const rustEnv = path.join(root, 'backend-rust', '.env');

function loadLines(file: string): string[] {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split(/\r?\n/);
}

function setVar(lines: string[], key: string, value: string): string[] {
  const out: string[] = [];
  let found = false;
  for (const line of lines) {
    if (line.startsWith(`${key}=`)) {
      out.push(`${key}=${value}`);
      found = true;
    } else {
      out.push(line);
    }
  }
  if (!found) out.push(`${key}=${value}`);
  return out;
}

function main() {
  const internalKey = randomBytes(32).toString('hex');
  const sessionSecret = `bs-sess-${randomBytes(24).toString('hex')}`;
  const adminPassword = `BsAdmin-${randomBytes(4).toString('hex')}-${new Date().getFullYear()}!`;

  if (existsSync(envLocal)) {
    let lines = loadLines(envLocal);
    lines = setVar(lines, 'INTERNAL_API_KEY', internalKey);
    lines = setVar(lines, 'ADMIN_SESSION_SECRET', sessionSecret);
    lines = setVar(lines, 'ADMIN_PASSWORD', adminPassword);
    writeFileSync(envLocal, lines.join('\n') + '\n', 'utf8');
    console.log('Updated .env.local: INTERNAL_API_KEY, ADMIN_PASSWORD, ADMIN_SESSION_SECRET');
  }

  if (existsSync(rustEnv)) {
    let lines = loadLines(rustEnv);
    lines = setVar(lines, 'INTERNAL_API_KEY', internalKey);
    writeFileSync(rustEnv, lines.join('\n') + '\n', 'utf8');
    console.log('Updated backend-rust/.env: INTERNAL_API_KEY');
  }

  console.log('\n--- Manual rotation required (dashboards) ---');
  console.log('1. Supabase → Settings → API → Regenerate anon + service_role keys');
  console.log('   Update .env.local + Render binaryscouts env vars, then redeploy.');
  console.log('2. Google Cloud → Credentials → rotate OAuth client secret if exposed');
  console.log('   Update GMAIL_CLIENT_SECRET + re-run npm run gmail:setup for new refresh token.');
  console.log('3. Render → binaryscouts + binaryscouts-rust → paste new INTERNAL_API_KEY');
  console.log('4. Render → binaryscouts → paste new ADMIN_PASSWORD + ADMIN_SESSION_SECRET');
  console.log('\nThen run: RENDER_API_KEY=rnd_... npm run render:setup');
}

main();
