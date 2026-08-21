"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAdminLogin, setSession, clearSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type State = { error?: string; ok?: boolean; message?: string } | undefined;

function safeNext(next: unknown, fallback: string): string {
  const n = typeof next === "string" ? next : "";
  // only allow same-site relative paths
  return n.startsWith("/") && !n.startsWith("//") ? n : fallback;
}

export async function loginAction(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = formData.get("next");

  if (!email || !password) return { error: "Please enter your email and password." };

  // 1) Admin credentials → admin panel
  if (isAdminLogin(email, password)) {
    await setSession();
    redirect(safeNext(next, "/admin").startsWith("/admin") ? safeNext(next, "/admin") : "/admin");
  }

  // 2) Otherwise, sign in as a customer via Supabase
  if (!isSupabaseConfigured()) {
    return { error: "Customer accounts aren't set up yet. Please contact us to order." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };

  redirect(safeNext(next, "/account"));
}

export async function signupAction(_prev: State, formData: FormData): Promise<State> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please enter your full name." };
  if (!phone || phone.replace(/\D/g, "").length < 10)
    return { error: "Please enter a valid 10-digit mobile number." };
  if (!email || !password) return { error: "Please enter your email and a password." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (!isSupabaseConfigured()) {
    return { error: "Sign-up isn't available yet — the store owner needs to finish setup." };
  }

  // Where the email-confirmation link should land: our callback route exchanges
  // the code for a session and logs the user in (previously it hit the homepage
  // and the confirmation "did nothing").
  const h = await headers();
  const host = h.get("host") || "www.nuts-and-more.store";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const emailRedirectTo = `${proto}://${host}/auth/callback?next=/account`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone }, emailRedirectTo },
  });
  if (error) return { error: error.message };

  // Supabase will not reveal that an email is already registered — it returns a
  // success-shaped response with no error and no session, and sends no mail.
  // The giveaway is an empty `identities` array. Without this check the page
  // says "we've sent a confirmation link" and the customer waits forever for an
  // email that was never sent.
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return {
      error: `An account already exists for ${email}. Please sign in instead — or use "Forgot password?" if you can't remember it.`,
    };
  }

  // With email verification enabled, no session is returned until the user confirms.
  if (!data.session) {
    return {
      ok: true,
      message: `Account created! We've sent a confirmation link to ${email}. Please verify your email to activate your account, then sign in.`,
    };
  }
  redirect("/account");
}

/** Site origin for links we ask Supabase to email back to. */
async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host") || "www.nuts-and-more.store";
  return `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
}

/**
 * Send a password-reset link. Always reports success: telling the visitor
 * whether an address is registered would let anyone enumerate the customer
 * list, and Supabase deliberately hides it for the same reason.
 */
export async function forgotPasswordAction(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Please enter your email address." };
  if (!isSupabaseConfigured()) {
    return { error: "Password reset isn't available yet — the store owner needs to finish setup." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteOrigin()}/auth/callback?next=/reset-password`,
  });

  return {
    ok: true,
    message: `If an account exists for ${email}, a password reset link is on its way. Check your inbox and spam folder.`,
  };
}

/** Set a new password. Requires the recovery session from the emailed link. */
export async function resetPasswordAction(_prev: State, formData: FormData): Promise<State> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Both passwords must match." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "This reset link has expired. Please request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  redirect("/account");
}

export async function logoutUserAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
  }
  await clearSession();
  redirect("/");
}
