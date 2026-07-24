"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { ADMIN_STATUS_OPTIONS } from "@/lib/order-status";
import { updateOrderStatusAction } from "@/app/admin/actions";

export function AdminOrderStatus({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status === "paid" ? "placed" : status);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-center gap-2 print:hidden">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          start(async () => {
            const r = await updateOrderStatusAction(id, v);
            if (r.ok) {
              setSaved(true);
              setTimeout(() => setSaved(false), 1600);
            }
          });
        }}
        className="rounded-lg border border-line bg-cream px-2.5 py-1.5 text-sm font-medium text-foreground focus:border-gold focus:outline-none"
      >
        {ADMIN_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : saved ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : null}
    </div>
  );
}
