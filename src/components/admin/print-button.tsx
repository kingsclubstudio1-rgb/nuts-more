"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print / Shipping copy" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-gold-soft print:hidden"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
