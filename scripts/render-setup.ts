/**
 * Provision / update Render backend services (Python + Rust) via Render API.
 * Run: RENDER_API_KEY=rnd_... npm run render:setup
 * Loads .env.local for GEMINI_API_KEY, INTERNAL_API_KEY, Supabase, admin vars.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const API = 'https://api.render.com/v1';
const REPO = 'https://github.com/coriuday/BinaryScouts';
const BRANCH = 'main';

type Service = {
  id: string;
  name: string;
  type: string;
  ownerId?: string;
  serviceDetails?: { url?: string };
  slug?: string;
};

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

function persistEnvVar(relativePath: string, key: string, value: string) {
  const file = path.join(process.cwd(), relativePath);
  if (!existsSync(file)) return;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let found = false;
  const out = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  if (!found) out.push(`${key}=${value}`);
  writeFileSync(file, out.join('\n') + (out[out.length - 1] === '' ? '' : '\n'), 'utf8');
}

async function api<T>(method: string, route: string, body?: unknown): Promise<T> {
  const key = process.env.RENDER_API_KEY;
  if (!key) {
    throw new Error(
      'Set RENDER_API_KEY (Render Dashboard → Account Settings → API Keys), then re-run npm run render:setup'
    );
  }
  const res = await fetch(`${API}${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${route} → ${res.status}: ${text.slice(0, 500)}`);
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function listServices(): Promise<Service[]> {
  const out: Service[] = [];
  let cursor: string | undefined;
  for (;;) {
    const q = new URLSearchParams({ limit: '100' });
    if (cursor) q.set('cursor', cursor);
    const page = await api<{ cursor?: string; items: { service: Service }[] }>(
      'GET',
      `/services?${q}`
    );
    for (const item of page.items ?? []) out.push(item.service);
    if (!page.cursor) break;
    cursor = page.cursor;
  }
  return out;
}

function serviceUrl(s: Service): string | undefined {
  return s.serviceDetails?.url ?? (s.slug ? `https://${s.slug}.onrender.com` : undefined);
}

async function createWebService(
  ownerId: string,
  name: string,
  runtime: 'python' | 'rust' | 'node',
  rootDir: string,
  buildCommand: string,
  startCommand: string,
  envVars: { key: string; value: string }[]
): Promise<Service> {
  const created = await api<{ service: Service }>('POST', '/services', {
    type: 'web_service',
    name,
    ownerId,
    repo: REPO,
    branch: BRANCH,
    rootDir,
    autoDeploy: 'yes',
    envVars,
    serviceDetails: {
      runtime,
      envSpecificDetails: { buildCommand, startCommand },
      plan: 'free',
    },
  });
  return created.service;
}

async function putEnvVars(serviceId: string, vars: { key: string; value: string }[]) {
  await api('PUT', `/services/${serviceId}/env-vars`, vars);
}

async function deploy(serviceId: string) {
  await api('POST', `/services/${serviceId}/deploys`, { clearCache: 'do_not_clear' });
}

async function refreshService(id: string): Promise<Service> {
  const res = await api<{ service: Service }>('GET', `/services/${id}`);
  return res.service;
}

async function main() {
  loadEnv();

  let internalKey = process.env.INTERNAL_API_KEY?.trim();
  if (!internalKey) {
    internalKey = randomBytes(32).toString('hex');
    persistEnvVar('.env.local', 'INTERNAL_API_KEY', internalKey);
    persistEnvVar('backend-rust/.env', 'INTERNAL_API_KEY', internalKey);
    console.log('Generated and saved INTERNAL_API_KEY to .env.local + backend-rust/.env');
  }

  const services = await listServices();
  if (!services.length) {
    throw new Error('No Render services on this account. Apply render.yaml blueprint first.');
  }

  const ownerId = services.find((s) => s.ownerId)?.ownerId;
  if (!ownerId) throw new Error('Could not resolve Render ownerId from existing services.');

  const byName: Record<string, Service> = Object.fromEntries(services.map((s) => [s.name, s]));
  const pythonName = 'binaryscouts-python';
  const rustName = 'binaryscouts-rust';
  const webName = 'binaryscouts';

  if (!byName[pythonName]) {
    console.log(`Creating ${pythonName}…`);
    byName[pythonName] = await createWebService(
      ownerId,
      pythonName,
      'python',
      'backend-python',
      'pip install -r requirements.txt',
      'uvicorn app:app --host 0.0.0.0 --port $PORT',
      [
        { key: 'PYTHON_VERSION', value: '3.11.11' },
        ...(process.env.GEMINI_API_KEY
          ? [{ key: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY }]
          : []),
      ]
    );
  } else if (process.env.GEMINI_API_KEY) {
    await putEnvVars(byName[pythonName].id, [
      { key: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY },
    ]);
  }

  byName[pythonName] = await refreshService(byName[pythonName].id);
  const pythonUrl = serviceUrl(byName[pythonName]);

  if (!byName[rustName]) {
    console.log(`Creating ${rustName}…`);
    byName[rustName] = await createWebService(
      ownerId,
      rustName,
      'rust',
      'backend-rust',
      'cargo build --release',
      './target/release/backend-rust',
      [
        { key: 'HOST', value: '0.0.0.0' },
        ...(pythonUrl ? [{ key: 'PYTHON_AI_BASE_URL', value: pythonUrl }] : []),
        { key: 'PYTHON_CHAT_PATH', value: '/ai/chat' },
        { key: 'PYTHON_HEIST_PATH', value: '/ai/analyze-brief' },
        { key: 'VAULT_DIR', value: 'vault' },
        { key: 'INTERNAL_API_KEY', value: internalKey },
      ]
    );
  } else {
    const vars = [
      { key: 'HOST', value: '0.0.0.0' },
      { key: 'INTERNAL_API_KEY', value: internalKey },
      { key: 'PYTHON_CHAT_PATH', value: '/ai/chat' },
      { key: 'PYTHON_HEIST_PATH', value: '/ai/analyze-brief' },
      { key: 'VAULT_DIR', value: 'vault' },
    ];
    if (pythonUrl) vars.push({ key: 'PYTHON_AI_BASE_URL', value: pythonUrl });
    await putEnvVars(byName[rustName].id, vars);
  }

  byName[rustName] = await refreshService(byName[rustName].id);
  const rustUrl = serviceUrl(byName[rustName]);

  if (byName[webName]) {
    const webVars = [
      { key: 'NEXT_PUBLIC_SITE_URL', value: 'https://binaryscouts.onrender.com' },
      { key: 'INTERNAL_API_KEY', value: internalKey },
      ...(rustUrl ? [{ key: 'RUST_API_BASE_URL', value: rustUrl }] : []),
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{ key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL }]
        : []),
      ...(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? [{ key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }]
        : []),
      ...(process.env.SUPABASE_SERVICE_ROLE_KEY
        ? [{ key: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY }]
        : []),
      ...(process.env.ADMIN_PASSWORD
        ? [{ key: 'ADMIN_PASSWORD', value: process.env.ADMIN_PASSWORD }]
        : []),
      ...(process.env.ADMIN_SESSION_SECRET
        ? [{ key: 'ADMIN_SESSION_SECRET', value: process.env.ADMIN_SESSION_SECRET }]
        : []),
      ...(process.env.RESEND_API_KEY
        ? [{ key: 'RESEND_API_KEY', value: process.env.RESEND_API_KEY }]
        : []),
      { key: 'CONTACT_TO_EMAIL', value: process.env.CONTACT_TO_EMAIL || 'hello@binaryscouts.com' },
    ];
    await putEnvVars(byName[webName].id, webVars);
    console.log(`Updated env on ${webName}`);
  }

  for (const name of [pythonName, rustName, webName]) {
    if (byName[name]) {
      console.log(`Deploying ${name}…`);
      await deploy(byName[name].id);
    }
  }

  console.log('\nDeploys triggered. After builds (~5–15 min), run: npm run verify:production');
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not in .env.local — set it on binaryscouts-python for AI chat.');
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
