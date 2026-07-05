/**
 * Admin CMS smoke tests — run: node scripts/qa-admin.mjs [baseUrl]
 */
import { readFileSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:3001';
const env = readFileSync('.env.local', 'utf8');
const pwMatch = env.match(/^ADMIN_PASSWORD=(.*)$/m);
const PASSWORD = pwMatch?.[1]?.trim();
if (!PASSWORD) {
  console.error('ADMIN_PASSWORD not found in .env.local');
  process.exit(1);
}

let passed = 0;
let failed = 0;
const jar = { cookie: '' };

function pass(l, d = '') {
  passed++;
  console.log('PASS', l, d);
}
function fail(l, d = '') {
  failed++;
  console.log('FAIL', l, d);
}

async function fetchApi(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (jar.cookie) headers.Cookie = jar.cookie;
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers,
    signal: AbortSignal.timeout(60_000),
  });
  const setCookie = res.headers.getSetCookie?.() || [];
  for (const c of setCookie) {
    const part = c.split(';')[0];
    if (part.startsWith('bs_admin_session=')) jar.cookie = part;
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { res, text, json };
}

async function main() {
  console.log('\n=== Admin QA:', BASE, '===\n');

  // Wrong password
  let { res } = await fetchApi('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrong-password-qa' }),
  });
  if (res.status === 401 || res.status === 403) pass('Wrong password rejected', String(res.status));
  else fail('Wrong password rejected', String(res.status));

  // Login
  ({ res } = await fetchApi('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: PASSWORD }),
  }));
  if (res.status === 200 && jar.cookie) pass('Admin login', 'session cookie set');
  else fail('Admin login', `${res.status} cookie=${!!jar.cookie}`);

  // Projects list
  let r = await fetchApi('/api/admin/projects');
  if (r.res.status === 200 && Array.isArray(r.json?.projects)) pass('Admin projects GET', `count=${r.json.projects.length}`);
  else fail('Admin projects GET', String(r.res.status));

  // Team list
  r = await fetchApi('/api/admin/team');
  if (r.res.status === 200 && Array.isArray(r.json?.team)) pass('Admin team GET', `count=${r.json.team.length}`);
  else fail('Admin team GET', String(r.res.status));

  // Reviews list
  r = await fetchApi('/api/admin/reviews');
  if (r.res.status === 200) pass('Admin reviews GET', 'ok');
  else fail('Admin reviews GET', String(r.res.status));

  // Leads list
  r = await fetchApi('/api/admin/leads');
  if (r.res.status === 200 && Array.isArray(r.json?.leads)) pass('Admin leads GET', `count=${r.json.leads.length}`);
  else fail('Admin leads GET', String(r.res.status));

  // Settings GET
  r = await fetchApi('/api/admin/settings');
  if (r.res.status === 200 && r.json?.contactInfo) pass('Admin settings GET', r.json.contactInfo.email);
  else fail('Admin settings GET', String(r.res.status));

  // Logout
  r = await fetchApi('/api/admin/logout', { method: 'POST' });
  if (r.res.status === 200) pass('Admin logout', 'ok');
  else fail('Admin logout', String(r.res.status));

  // Unauth after logout
  r = await fetchApi('/api/admin/projects');
  if (r.res.status === 401) pass('Unauth after logout', '401');
  else fail('Unauth after logout', String(r.res.status));

  console.log(`\n=== ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
