/**
 * Extended API matrix for QA — run: node scripts/qa-api-matrix.mjs [baseUrl]
 */
const BASE = process.argv[2] || 'https://binaryscouts.onrender.com';
const TIMEOUT = 60_000;
let passed = 0;
let failed = 0;
const results = [];

async function req(method, path, body, label) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT),
      redirect: 'manual',
    });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { label, url, status: res.status, text, json, ok: false };
  } catch (e) {
    return { label, url, status: 0, text: String(e), json: null, ok: false, error: true };
  }
}

function pass(label, detail = '') {
  passed++;
  results.push({ status: 'PASS', label, detail });
  console.log('PASS', label, detail);
}

function fail(label, detail = '') {
  failed++;
  results.push({ status: 'FAIL', label, detail });
  console.log('FAIL', label, detail);
}

async function main() {
  console.log('\n=== API Matrix:', BASE, '===\n');

  // CMS settings + contactInfo
  let r = await req('GET', '/api/cms/settings');
  if (r.status === 200 && r.json?.contactInfo?.email?.includes('thebinaryscouts@gmail.com')) {
    pass('CMS settings contactInfo', r.json.contactInfo.email);
  } else fail('CMS settings contactInfo', `${r.status} ${r.text.slice(0, 120)}`);

  // Project slug
  r = await req('GET', '/api/cms/projects/jobsrow');
  if (r.status === 200 && (r.json?.slug === 'jobsrow' || r.text.includes('jobsrow'))) {
    pass('CMS project jobsrow', String(r.status));
  } else fail('CMS project jobsrow', `${r.status}`);

  // Reviews GET
  r = await req('GET', '/api/reviews');
  if (r.status === 200 && Array.isArray(r.json?.reviews)) {
    pass('Reviews GET', `count=${r.json.reviews.length}`);
  } else fail('Reviews GET', `${r.status}`);

  // Reviews POST invalid
  r = await req('POST', '/api/reviews', { name: 'QA' });
  if (r.status === 400) pass('Reviews POST invalid', '400');
  else fail('Reviews POST invalid', `${r.status} ${r.text.slice(0, 80)}`);

  // Reviews POST valid
  r = await req('POST', '/api/reviews', {
    name: 'QA Tester',
    role: 'Tester',
    company: 'QA Co',
    stars: 5,
    quote: 'BinaryScouts delivered excellent engineering work on our project timeline.',
  });
  if (r.status === 200 || r.status === 201) pass('Reviews POST valid', String(r.status));
  else fail('Reviews POST valid', `${r.status} ${r.text.slice(0, 80)}`);

  // Contact newsletter
  r = await req('POST', '/api/contact', {
    type: 'newsletter',
    email: `qa-newsletter-${Date.now()}@example.com`,
  });
  if (r.status === 200 && r.json?.ok) pass('Contact newsletter', `delivered=${r.json.delivered}`);
  else fail('Contact newsletter', `${r.status} ${r.text.slice(0, 80)}`);

  // Contact form
  r = await req('POST', '/api/contact', {
    type: 'contact',
    name: 'QA Tester',
    email: `qa-contact-${Date.now()}@example.com`,
    message: 'QA automated contact test',
  });
  if (r.status === 200 && r.json?.ok) pass('Contact form', `delivered=${r.json.delivered}`);
  else fail('Contact form', `${r.status} ${r.text.slice(0, 80)}`);

  // Honeypot
  r = await req('POST', '/api/contact', {
    type: 'contact',
    name: 'Bot',
    email: 'bot@spam.com',
    message: 'spam',
    website: 'http://spam.com',
  });
  if (r.status === 200 && r.json?.ok) pass('Contact honeypot', 'silent ok');
  else fail('Contact honeypot', `${r.status}`);

  // Heist
  r = await req('POST', '/api/heist', {
    codeName: 'QA Op',
    email: `qa-heist-${Date.now()}@example.com`,
    corporation: 'QA Corp',
    brief: 'Build a test SaaS platform for workforce management',
    budget: 500000,
    timeline: '3 months',
    targets: ['AI Systems'],
  });
  if (r.status === 200 && (r.json?.blueprint || r.json?.heistCode)) {
    pass('Heist blueprint', r.json?.status || 'ok');
  } else fail('Heist blueprint', `${r.status} ${r.text.slice(0, 100)}`);

  // Chat
  r = await req('POST', '/api/chat', { message: 'Hello, what does BinaryScouts do?' });
  if (r.status === 200 && r.json?.text) {
    const offline = /offline|fallback|unavailable|safe mode|error/i.test(r.json.text);
    pass('Chat POST', offline ? 'offline/fallback response' : 'live response');
  } else fail('Chat POST', `${r.status} ${r.text.slice(0, 100)}`);

  // Sitemap
  r = await req('GET', '/sitemap.xml');
  if (r.status === 200 && r.text.includes('/contact') && r.text.includes('/work')) {
    pass('Sitemap', 'has routes');
  } else fail('Sitemap', `${r.status}`);

  // Robots
  r = await req('GET', '/robots.txt');
  if (r.status === 200 && r.text.toLowerCase().includes('admin')) {
    pass('Robots', 'disallows admin');
  } else fail('Robots', `${r.status}`);

  // Admin unauth
  r = await req('GET', '/api/admin/projects');
  if (r.status === 401) pass('Admin unauth', '401');
  else fail('Admin unauth', `${r.status}`);

  // Games redirect (Next may follow redirect; check Location header or final 200 on /work)
  r = await req('GET', '/games');
  const redirected = [301, 302, 307, 308].includes(r.status);
  const locationOk = r.text?.includes?.('/work') || redirected;
  if (redirected || (r.status === 200 && r.text.includes('work'))) {
    pass('Games redirect', redirected ? `status ${r.status}` : 'followed to /work');
  } else fail('Games redirect', `${r.status}`);

  console.log(`\n=== ${BASE}: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
