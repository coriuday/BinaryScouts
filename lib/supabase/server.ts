import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServiceKey, getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase/config';

let serviceClient: SupabaseClient | null = null;

export function createServiceClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!serviceClient) {
    serviceClient = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}
