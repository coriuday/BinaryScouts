import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import {
  adminCookieOptions,
  createAdminToken,
  getAdminPassword,
} from '@/lib/admin-session';
import { clientIp, rateLimitAsync } from '@/lib/rate-limit';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run timingSafeEqual on equal-length buffers to reduce timing leaks
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = await rateLimitAsync(`admin-login:${ip}`, 5, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429 }
    );
  }

  const password = getAdminPassword();
  if (!password) {
    return NextResponse.json(
      { error: 'Admin login is not configured.' },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const submitted = typeof body.password === 'string' ? body.password : '';
  if (!safeEqual(submitted, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminToken();
  const res = NextResponse.json({ ok: true });
  const opts = adminCookieOptions(token);
  res.cookies.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  });
  return res;
}
