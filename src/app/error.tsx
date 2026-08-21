"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Branded fallback for any unhandled error. Without this, a failure anywhere
 * in the store — including mid-checkout — shows Next's unstyled default page,
 * which is exactly where a customer most needs to be told their money is safe.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled app error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-cream px-5 py-20">
      <div className="w-full max-w-md rounded-3xl border border-line bg-card p-8 text-center shadow-[var(--shadow-lift)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorry — that didn&apos;t load properly. If you were paying for an order, your money is
          safe: we only record an order once the payment is confirmed, and anything taken for an
          order we can&apos;t fulfil is refunded automatically.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft"
          >
            <RotateCw className="h-4 w-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-5 text-sm font-semibold text-foreground hover:border-gold hover:text-gold-deep"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-6 border-t border-line pt-4 text-xs text-muted-foreground">
          Still stuck? Call{" "}
          <a href={SITE.phoneHref} className="font-semibold text-gold-deep">
            {SITE.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-gold-deep">
            {SITE.email}
          </a>
          .
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[0.65rem] text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}
