/**
 * Rate limiting — in-memory fallback + optional Upstash Redis REST
 * when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 * No extra npm dependency required.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 5000;

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    if (buckets.size >= MAX_BUCKETS) {
      // Evict expired entries first; if still full, drop oldest insert order key
      for (const [k, v] of buckets) {
        if (now >= v.resetAt) buckets.delete(k);
      }
      if (buckets.size >= MAX_BUCKETS) {
        const first = buckets.keys().next().value;
        if (first !== undefined) buckets.delete(first);
      }
    }
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

async function upstashRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; remaining: number; resetAt: number } | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return null;

  const redisKey = `rl:${key}`;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const incrRes = await fetch(`${base}/incr/${encodeURIComponent(redisKey)}`, {
      headers,
      cache: 'no-store',
    });
    if (!incrRes.ok) return null;
    const incrJson = (await incrRes.json()) as { result?: number };
    const count = Number(incrJson.result ?? 0);

    if (count === 1) {
      await fetch(`${base}/pexpire/${encodeURIComponent(redisKey)}/${windowMs}`, {
        headers,
        cache: 'no-store',
      });
    }

    const resetAt = Date.now() + windowMs;
    if (count > limit) {
      return { ok: false, remaining: 0, resetAt };
    }
    return { ok: true, remaining: Math.max(0, limit - count), resetAt };
  } catch {
    return null;
  }
}

/** Prefer Upstash when configured; otherwise in-memory (per instance). */
export async function rateLimitAsync(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  const durable = await upstashRateLimit(key, limit, windowMs);
  if (durable) return durable;
  return rateLimit(key, limit, windowMs);
}

export function clientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf?.trim()) return cf.trim();
  const real = req.headers.get('x-real-ip');
  if (real?.trim()) return real.trim();
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return 'unknown';
}

/** Periodic cleanup to avoid unbounded map growth */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) {
      if (now >= v.resetAt) buckets.delete(k);
    }
  }, 60_000).unref?.();
}
