/**
 * Client-side admin helpers.
 * Authorization is enforced server-side via httpOnly cookies (see lib/admin-session.ts).
 * These helpers only reflect UI state after login/logout API calls.
 */

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || 'Login failed' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } catch {
    /* ignore */
  }
}
