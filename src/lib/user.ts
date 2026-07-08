import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export type Profile = { id: string; name: string | null; phone: string | null };

/** The signed-in customer (Supabase Auth), or null. */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("id, name, phone")
      .eq("id", user.id)
      .single();
    return (data as Profile) ?? { id: user.id, name: null, phone: null };
  } catch {
    return null;
  }
}
