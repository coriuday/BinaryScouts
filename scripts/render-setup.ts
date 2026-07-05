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
    const page = await api<{ service: Service; cursor?: string }[]>(
      'GET',
      `/services?${q}`
    );
    if (!Array.isArray(page) || page.length === 0) break;
    for (const item of page) {
      if (item.service) out.push(item.service);
    }
    const next = page[page.length - 1]?.cursor;
    if (!next || next === cursor) break;
    cursor = next;
  }
  return out;
}

async function resolveOwnerId(services: Service[]): Promise<string> {
  const fromService = services.find((s) => s.ownerId)?.ownerId;
  if (fromService) return fromService;
  if (process.env.RENDER_OWNER_ID) return process.env.RENDER_OWNER_ID;

  const owners = await api<{ owner: { id: string }; cursor?: string }[]>('GET', '/owners?limit=20');
  const id = owners[0]?.owner?.id;
  if (!id) {
    throw new Error(
      'Could not resolve Render ownerId. Set RENDER_OWNER_ID in .env.local (Workspace Settings → ID).'
    );
  }
  return id;
}

function unwrapService(res: { service?: Service } | Service): Service {
  if (res && typeof res === 'object' && 'service' in res && res.service) return res.service;
  return res as Service;
}

function serviceUrl(s: Service | undefined): string | undefined {
  if (!s) return undefined;
  const details = s.serviceDetails as { url?: string } | undefined;
  if (details?.url) return details.url.replace(/\/$/, '');
  if (s.slug) return `https://${s.slug}.onrender.com`;
  if (s.name) return `https://${s.name}.onrender.com`;
  return undefined;
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
  const created = await api<{ service: Service } | Service>('POST', '/services', {
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
  return unwrapService(created);
}

async function upsertEnvVars(serviceId: string, vars: { key: string; value: string }[]) {
  for (const { key, value } of vars) {
    await api('PUT', `/services/${serviceId}/env-vars/${encodeURIComponent(key)}`, { value });
  }
}

async function deploy(serviceId: string) {
  await api('POST', `/services/${serviceId}/deploys`, { clearCache: 'do_not_clear' });
}

async function refreshService(id: string): Promise<Service> {
  const res = await api<{ service: Service } | Service>('GET', `/services/${id}`);
  return unwrapService(res);
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
  const ownerId = await resolveOwnerId(services);
  console.log(`Found ${services.length} service(s), ownerId ${ownerId.slice(0, 8)}…`);

  const byName: Record<string, Service> = Object.fromEntries(services.map((s) => [s.name, s]));
  const pythonName = 'binaryscouts-python';
  const rustName = 'binaryscouts-rust';
  const webService =
    byName.binaryscouts ??
    services.find((s) => s.slug === 'binaryscouts' || s.name?.toLowerCase() === 'binaryscouts');
  const webName = webService?.name;

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
    await upsertEnvVars(byName[pythonName].id, [
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
    await upsertEnvVars(byName[rustName].id, vars);
  }

  byName[rustName] = await refreshService(byName[rustName].id);
  const rustUrl = serviceUrl(byName[rustName]);

  if (webService) {
    const webVars = [
      { key: 'NEXT_PUBLIC_SITE_URL', value: 'https://binaryscouts.onrender.com' },
      { key: 'INTERNAL_API_KEY', value: internalKey },
      ...(rustUrl
        ? [
            { key: 'RUST_API_BASE_URL', value: rustUrl },
            { key: 'RUST_API_URL', value: `${rustUrl}/api/chat` },
            { key: 'RUST_API_URL_HEIST', value: `${rustUrl}/api/heist` },
          ]
        : []),
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
      ...(process.env.GMAIL_USER ? [{ key: 'GMAIL_USER', value: process.env.GMAIL_USER }] : []),
      ...(process.env.GMAIL_CLIENT_ID
        ? [{ key: 'GMAIL_CLIENT_ID', value: process.env.GMAIL_CLIENT_ID }]
        : []),
      ...(process.env.GMAIL_CLIENT_SECRET
        ? [{ key: 'GMAIL_CLIENT_SECRET', value: process.env.GMAIL_CLIENT_SECRET }]
        : []),
      ...(process.env.GMAIL_REFRESH_TOKEN
        ? [{ key: 'GMAIL_REFRESH_TOKEN', value: process.env.GMAIL_REFRESH_TOKEN }]
        : []),
      { key: 'CONTACT_TO_EMAIL', value: process.env.CONTACT_TO_EMAIL || 'thebinaryscouts@gmail.com' },
      { key: 'NEXT_PUBLIC_CONTACT_EMAIL', value: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'thebinaryscouts@gmail.com' },
      { key: 'NEXT_PUBLIC_WHATSAPP_NUMBER', value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916301464708' },
      {
        key: 'NEXT_PUBLIC_WHATSAPP_MESSAGE',
        value:
          process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
          "Hi BinaryScouts! I'd like to discuss a project with you.",
      },
    ];
    await upsertEnvVars(webService.id, webVars);
    console.log(`Updated env on ${webService.name}`);
    byName[webService.name] = webService;
  } else {
    console.warn('Web service binaryscouts not found — set RUST_API_BASE_URL manually on Render.');
  }

  const deployNames = [pythonName, rustName, ...(webName ? [webName] : [])];
  for (const name of deployNames) {
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
