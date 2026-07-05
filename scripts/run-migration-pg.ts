/**
 * Run CMS schema migration via direct Postgres connection.
 * Usage: npm run migrate:pg
 */
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import dns from 'dns';
import pg from 'pg';

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

async function resolveHost(host: string): Promise<string> {
  try {
    const result = await dns.promises.lookup(host, { family: 6 });
    return result.address;
  } catch {
    const result = await dns.promises.lookup(host);
    return result.address;
  }
}

function parsePgUrl(connectionString: string) {
  const u = new URL(connectionString.replace(/^postgresql:/, 'https:'));
  return {
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    host: u.hostname,
    port: parseInt(u.port || '5432', 10),
    database: u.pathname.replace(/^\//, ''),
  };
}

const POOLER_HOSTS = [
  'aws-1-ap-southeast-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
];

async function connectPg(url: string) {
  const cfg = parsePgUrl(url);
  const projectRef = cfg.user.startsWith('postgres.')
    ? cfg.user.slice('postgres.'.length)
    : 'uxuzrafthtmrdzdmgpaj';

  const hostsToTry = [...POOLER_HOSTS];
  if (!cfg.host.includes('pooler')) {
    hostsToTry.push(cfg.host);
  }

  let lastError: Error | null = null;
  for (const hostName of hostsToTry) {
    try {
      const user = `postgres.${projectRef}`;
      const host = hostName.includes('pooler') ? hostName : await resolveHost(hostName);
      const client = new pg.Client({
        user,
        password: cfg.password,
        host,
        port: cfg.port,
        database: cfg.database,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
      });
      await client.connect();
      console.log(`Connected via ${hostName}`);
      return client;
    } catch (e) {
      lastError = e as Error;
      console.warn(`  ${hostName}: ${(e as Error).message.slice(0, 100)}`);
    }
  }
  throw lastError ?? new Error('Could not connect to Postgres');
}

async function main() {
  loadEnv();
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error('Missing DATABASE_URL in .env.local');
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), 'supabase/migrations/001_cms_schema.sql');
  const sql = readFileSync(sqlPath, 'utf8');

  const client = await connectPg(url);
  console.log('Running CMS migration…');
  await client.query(sql);
  console.log('CMS tables + RLS + storage bucket created.');

  await client.end();
  console.log('Migration complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
