import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseAdminConfigured } from "./supabase/config";

export type RateAction = "login" | "signup" | "reset";

/**
 * Brute-force protection for the auth actions.
 *
 * Backed by Postgres rather than an in-process counter: serverless functions
 * share no memory between invocations, so a module-level Map resets on every
 * cold start and offers no real protection.
 *
 * Fails open. If the database is unreachable the store stays usable — losing
 * rate limiting for a moment is far less harmful than locking every customer
 * out of their account.
 */
const LIMITS: Record<RateAction, { max: number; windowSeconds: number }> = {
  // Sign-in is the brute-force target, so it's the tightest.
  login: { max: 8, windowSeconds: 15 * 60 },
  // Sign-up abuse is mostly junk-account creation.
  signup: { max: 5, windowSeconds: 60 * 60 },
  // Reset sends mail to a third party, so throttle harder to prevent
  // using the form to bombard someone's inbox.
  reset: { max: 4, windowSeconds: 60 * 60 },
};

/** Best-effort client IP; Vercel puts the real one first in x-forwarded-for. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function humanWait(seconds: number): string {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const mins = Math.ceil(seconds / 60);
  return `${mins} minute${mins === 1 ? "" : "s"}`;
}

export async function checkRateLimit(
  identifier: string,
  action: RateAction,
): Promise<{ allowed: boolean; message?: string }> {
  if (!isSupabaseAdminConfigured() || !identifier) return { allowed: true };
  const { max, windowSeconds } = LIMITS[action];
  try {
    const sb = createAdminClient();
    const { data, error } = await sb.rpc("check_auth_rate_limit", {
      p_identifier: identifier,
      p_action: action,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) return { allowed: true };
    const res = data as { allowed: boolean; retry_after?: number } | null;
    if (res && res.allowed === false) {
      return {
        allowed: false,
        message: `Too many attempts. Please try again in ${humanWait(res.retry_after ?? 60)}.`,
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export async function recordFailure(identifier: string, action: RateAction): Promise<void> {
  if (!isSupabaseAdminConfigured() || !identifier) return;
  try {
    await createAdminClient().rpc("record_auth_failure", {
      p_identifier: identifier,
      p_action: action,
    });
  } catch {
    /* never block the response on bookkeeping */
  }
}

export async function clearFailures(identifier: string, action: RateAction): Promise<void> {
  if (!isSupabaseAdminConfigured() || !identifier) return;
  try {
    await createAdminClient().rpc("clear_auth_failures", {
      p_identifier: identifier,
      p_action: action,
    });
  } catch {
    /* ignore */
  }
}
