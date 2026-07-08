/** Supabase configuration + feature detection (safe on client & server). */

// Project URL is known from the project ref; still overridable via env.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zpfsjaqcmihdgpydddqp.supabase.co";

export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// server-only (never exposed to the client bundle)
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** True once the anon key is set — customer auth + orders become live. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/** True once the service-role key is set — server-side privileged ops. */
export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(SUPABASE_SERVICE_KEY);
}
