"use client";

import { useState, useTransition } from "react";
import { RotateCcw, Loader2, CheckCircle2 } from "lucide-react";
import { requestReturnAction } from "@/app/(store)/account/actions";

export function ReturnRequest({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> Return requested — our team will be in touch.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-gold-deep"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Request a return
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        placeholder="Reason for return (e.g. damaged on arrival, wrong item)…"
        className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setError(null);
              const r = await requestReturnAction(orderId, reason);
              if (r.ok) setDone(true);
              else setError(r.error || "Could not submit.");
            })
          }
          className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-3.5 py-1.5 text-xs font-bold text-on-dark hover:bg-ink disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          Submit return
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </div>
  );
}
