import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/admin-session';
import { revalidatePath } from 'next/cache';

export async function requireAdmin() {
  const ok = await isAdminSessionValid();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function revalidateCms() {
  revalidatePath('/', 'layout');
  revalidatePath('/work', 'layout');
  revalidatePath('/about', 'layout');
  revalidatePath('/contact', 'layout');
}
