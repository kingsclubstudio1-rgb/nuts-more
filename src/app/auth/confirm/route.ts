import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Email confirmation / password-recovery landing route.
 *
 * Deliberately not Supabase's own `/auth/v1/verify` link: that returns the
 * session in the URL *fragment*, which browsers never send to the server, so a
 * server-rendered app sees nothing and the visitor lands logged out having
 * "confirmed" successfully. We email a link to this route carrying the hashed
 * token instead, exchange it here, and set a real session cookie — so clicking
 * the link signs the customer in, which is what they expect.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/account";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/login?error=link`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) {
    // Expired or already-used links land here; sending them to sign-in with a
    // reason beats a blank failure page.
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
