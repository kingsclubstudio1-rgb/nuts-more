import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Health / keep-alive. A daily Vercel cron hits this and it runs a trivial
 * Supabase query — that DB activity prevents the free-tier project from
 * pausing after ~7 days of inactivity.
 */
export async function GET() {
  let db: "ok" | "error" | "skipped" = "skipped";
  if (isSupabaseAdminConfigured()) {
    try {
      const sb = createAdminClient();
      const { error } = await sb.from("products").select("id").limit(1);
      db = error ? "error" : "ok";
    } catch {
      db = "error";
    }
  }
  return NextResponse.json({ ok: true, db, ts: new Date().toISOString() });
}
