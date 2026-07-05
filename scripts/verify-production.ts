/**
 * Smoke-test production endpoints on Render.
 * Run: npm run verify:production
 */
const BASE = process.env.PRODUCTION_URL || 'https://binaryscouts.onrender.com';
const RUST = process.env.RUST_URL || 'https://binaryscouts-rust.onrender.com';
const PYTHON = process.env.PYTHON_URL || 'https://binaryscouts-python.onrender.com';

type Check = { name: string; url: string; ok: (status: number, body: string) => boolean };

const checks: Check[] = [
  {
    name: 'CMS projects (Supabase UUIDs)',
    url: `${BASE}/api/cms/projects`,
    ok: (s, b) => s === 200 && b.includes('21591922') || b.includes('-') && b.includes('"id"'),
  },
  {
    name: 'CMS team',
    url: `${BASE}/api/cms/team?homepage=true`,
    ok: (s) => s === 200,
  },
  {
    name: 'CMS settings',
    url: `${BASE}/api/cms/settings`,
    ok: (s) => s === 200,
  },
  {
    name: 'Admin login page',
    url: `${BASE}/admin/login`,
    ok: (s, b) => s === 200 && b.toLowerCase().includes('password'),
  },
  {
    name: 'Chat route exists',
    url: `${BASE}/api/chat`,
    ok: (s) => s === 405 || s === 400,
  },
  {
    name: 'Rust gateway status',
    url: `${RUST}/api/status`,
    ok: (s, b) => s === 200 && b.includes('ONLINE'),
  },
  {
    name: 'Python health',
    url: `${PYTHON}/health`,
    ok: (s, b) => s === 200 && b.includes('key_configured'),
  },
];

async function main() {
  let failed = 0;

  // POST contact smoke test
  try {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'contact', name: 'Verify', email: 'invalid' }),
      signal: AbortSignal.timeout(60_000),
    });
    const body = await res.text();
    const pass = res.status === 400 && body.toLowerCase().includes('email');
    console.log(pass ? 'PASS' : 'FAIL', 'Contact API validation', `(${res.status})`);
    if (!pass) failed++;
  } catch (e) {
    failed++;
    console.log('FAIL', 'Contact API validation', String(e));
  }

  for (const c of checks) {
    try {
      const res = await fetch(c.url, { signal: AbortSignal.timeout(60_000) });
      const body = await res.text();
      const pass = c.ok(res.status, body);
      console.log(pass ? 'PASS' : 'FAIL', c.name, `(${res.status})`, c.url);
      if (!pass) {
        failed++;
        if (body.length < 200) console.log('  ', body);
      }
    } catch (e) {
      failed++;
      console.log('FAIL', c.name, c.url, String(e));
    }
  }
  process.exit(failed > 0 ? 1 : 0);
}

main();
