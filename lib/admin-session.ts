import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'bs_admin_session';
const MAX_AGE_SEC = 60 * 60 * 8; // 8 hours
const DEV_FALLBACK = 'dev-insecure-change-me';

function configuredSecret(): string | null {
  const fromEnv =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    '';
  return fromEnv || null;
}

/** Signing key — never uses the hardcoded fallback in production. */
function secret(): string {
  const configured = configuredSecret();
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') {
    // Empty string makes verifyAdminToken fail closed (length mismatch).
    return '';
  }
  return DEV_FALLBACK;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || '';
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword());
}

function sign(payload: string): string {
  const key = secret();
  if (!key) return '';
  return createHmac('sha256', key).update(payload).digest('hex');
}

export function createAdminToken(): string {
  if (process.env.NODE_ENV === 'production' && !configuredSecret()) {
    throw new Error('ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set in production');
  }
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `admin:${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  // Fail closed when production secrets are missing — never accept
  // tokens signed with the local-dev fallback.
  if (process.env.NODE_ENV === 'production' && !configuredSecret()) {
    return false;
  }
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  if (!expected) return false;
  try {
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const parts = payload.split(':');
  if (parts[0] !== 'admin') return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export async function isAdminSessionValid(): Promise<boolean> {
  if (process.env.NODE_ENV === 'production' && !isAdminAuthConfigured()) {
    return false;
  }
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SEC,
  };
}
