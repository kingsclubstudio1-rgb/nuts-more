"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Lock, Loader2 } from "lucide-react";
import { resetPasswordAction } from "@/app/(store)/login/actions";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, undefined);

  const input =
    "h-12 w-full rounded-xl border border-line bg-cream pl-10 pr-4 text-sm text-foreground focus:border-gold focus:outline-none";
  const icon = "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-card p-7 shadow-[var(--shadow-lift)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <Image src="/brand/logo.png" alt="Nuts & More" width={72} height={71} className="h-16 w-auto" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Choose a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick something at least 6 characters long.
        </p>
      </div>

      <form action={action} className="mt-6 space-y-3">
        <div className="relative">
          <Lock className={icon} />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="New password"
            className={input}
          />
        </div>
        <div className="relative">
          <Lock className={icon} />
          <input
            name="confirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Confirm new password"
            className={input}
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save new password"}
        </button>
      </form>
    </div>
  );
}
