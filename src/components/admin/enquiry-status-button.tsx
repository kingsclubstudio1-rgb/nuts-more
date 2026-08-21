"use client";

import { useState, useTransition } from "react";
import { Check, Undo2, Loader2 } from "lucide-react";
import { setEnquiryStatusAction } from "@/app/admin/actions";

export function EnquiryStatusButton({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status === "handled" ? "handled" : "new");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const next = current === "handled" ? "new" : "handled";

  const toggle = () =>
    start(async () => {
      setError("");
      const res = await setEnquiryStatusAction(id, next as "new" | "handled");
      if (res.ok) setCurrent(next);
      else setError(res.error || "Could not update");
    });

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-gold hover:text-gold-deep disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : current === "handled" ? (
          <Undo2 className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        {current === "handled" ? "Reopen" : "Mark handled"}
      </button>
      {error && <span className="text-[0.7rem] text-destructive">{error}</span>}
    </div>
  );
}
