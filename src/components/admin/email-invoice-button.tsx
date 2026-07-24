"use client";

import { useState, useTransition } from "react";
import { Mail, Loader2 } from "lucide-react";
import { emailInvoiceAction } from "@/app/admin/actions";

export function EmailInvoiceButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await emailInvoiceAction(id);
            setMsg(r.ok ? "Invoice emailed to customer ✓" : r.error || "Could not send.");
            setTimeout(() => setMsg(null), 3500);
          })
        }
        className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Email invoice to customer
      </button>
      {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
    </div>
  );
}
