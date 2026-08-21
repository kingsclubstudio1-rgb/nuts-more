"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/app/(store)/login/actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, undefined);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-card p-7 shadow-[var(--shadow-lift)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <Image src="/brand/logo.png" alt="Nuts & More" width={72} height={71} className="h-16 w-auto" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>
      </div>

      <form action={action} className="mt-6 space-y-3">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className="h-12 w-full rounded-xl border border-line bg-cream pl-10 pr-4 text-sm text-foreground focus:border-gold focus:outline-none"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        {state?.message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
}
