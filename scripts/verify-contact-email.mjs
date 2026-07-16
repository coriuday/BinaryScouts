/**
 * Verify production contact email delivery.
 * Run: node scripts/verify-contact-email.mjs
 */
const BASE = process.env.PRODUCTION_URL || 'https://binary-scouts.vercel.app';

const payload = {
  type: 'contact',
  name: 'Email Verify Test',
  email: 'verify-test@example.com',
  company: 'BinaryScouts QA',
  budget: 'Test',
  timeline: '1 week',
  message: `Post-deploy verification at ${new Date().toISOString()} — safe to ignore.`,
};

const res = await fetch(`${BASE}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(120_000),
});

const data = await res.json().catch(() => ({}));
console.log('Status:', res.status);
console.log('Response:', JSON.stringify(data, null, 2));

if (data.ok && data.delivered === true) {
  console.log('\nPASS: Email delivery reported as successful.');
  process.exit(0);
}

if (data.ok && data.delivered === false) {
  console.log('\nFAIL: Lead saved but email not delivered.');
  if (data.emailError) console.log('emailError:', data.emailError);
  else console.log('No emailError in response — Gmail env vars may be missing on Render.');
  process.exit(1);
}

console.log('\nFAIL: Unexpected response');
process.exit(1);
