import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side publishable Supabase client.
 *
 * Used by every module's repository layer for read-only access against
 * RLS-protected tables. Writes are out of scope for Phase 3.
 *
 * SECURITY: This is the publishable (anon) key, so RLS policies are the
 * authoritative access boundary.
 */
let _client: SupabaseClient | undefined;

export function getServerSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in server environment.",
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  return _client;
}

export type DbClient = SupabaseClient;