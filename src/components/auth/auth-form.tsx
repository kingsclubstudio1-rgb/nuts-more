"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Loader2, ShieldCheck, Phone } from "lucide-react";
import { loginAction, signupAction } from "@/app/(store)/login/actions";
import { GoogleButton } from "@/components/auth/google-button";

export function AuthForm({
  next,
  defaultMode = "signin",
  supabaseReady,
}: {
  next?: string;
  defaultMode?: "signin" | "signup";
  supabaseReady: boolean;
}) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [loginState, loginAct, loginPending] = useActionState(loginAction, undefined);
  const [signupState, signupAct, signupPending] = useActionState(signupAction, undefined);

  const inputWrap = "relative";
  const input =
    "h-12 w-full rounded-xl border border-line bg-cream pl-10 pr-4 text-sm text-foreground focus:border-gold focus:outline-none";
  const icon = "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-card p-7 shadow-[var(--shadow-lift)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/brand/logo.png"
          alt="Nuts & More"
          width={72}
          height={71}
          className="h-16 w-auto"
        />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to track orders and see your purchase history."
            : "Join to save your details and track every order."}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-cream-2 p-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              "rounded-full py-2 text-sm font-semibold transition-colors " +
              (mode === m ? "bg-espresso text-on-dark" : "text-body hover:text-gold-deep")
            }
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <GoogleButton next={next} />

      {mode === "signin" ? (
        <form action={loginAct} className="mt-6 space-y-3">
          {next && <input type="hidden" name="next" value={next} />}
          <div className={inputWrap}>
            <Mail className={icon} />
            <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={input} />
          </div>
          <div className={inputWrap}>
            <Lock className={icon} />
            <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className={input} />
          </div>
          {loginState?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{loginState.error}</p>
          )}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-semibold text-gold-deep hover:text-gold">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loginPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft disabled:opacity-70"
          >
            {loginPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
          </button>
        </form>
      ) : (
        <form action={signupAct} className="mt-6 space-y-3">
          <div className={inputWrap}>
            <User className={icon} />
            <input name="name" type="text" required autoComplete="name" placeholder="Full name" className={input} />
          </div>
          <div className={inputWrap}>
            <Phone className={icon} />
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="Mobile number"
              className={input}
            />
          </div>
          <div className={inputWrap}>
            <Mail className={icon} />
            <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={input} />
          </div>
          <div className={inputWrap}>
            <Lock className={icon} />
            <input name="password" type="password" required autoComplete="new-password" placeholder="Password (min 6 characters)" className={input} />
          </div>
          {signupState?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{signupState.error}</p>
          )}
          {signupState?.message && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{signupState.message}</p>
          )}
          <button
            type="submit"
            disabled={signupPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft disabled:opacity-70"
          >
            {signupPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
          </button>
        </form>
      )}

      {!supabaseReady && (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-cream-2 px-3 py-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
          Customer accounts activate once the store connects its database. The store team can sign in
          here with admin credentials.
        </p>
      )}
    </div>
  );
}
