"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Check } from "lucide-react";
import type { InvoiceConfig } from "@/lib/gst";
import { saveSettingAction } from "@/app/admin/actions";

const inp =
  "h-11 w-full rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none";

export function GstSettingsEditor({ config }: { config: InvoiceConfig }) {
  const router = useRouter();
  const [form, setForm] = useState<InvoiceConfig>(config);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveSettingAction("invoice_config", form);
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 1600);
      } else {
        setError(res.error ?? "Could not save.");
      }
    });
  };

  return (
    <div className="max-w-xl rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
      <h2 className="font-heading text-xl font-bold text-foreground">GST &amp; invoice settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        These appear on every tax invoice. Until a GSTIN is set, invoices show &ldquo;GSTIN: Not
        configured&rdquo; rather than a blank or fabricated number.
      </p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            GSTIN (GST registration number)
          </label>
          <input
            value={form.gstin}
            onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
            placeholder="e.g. 29ABCDE1234F1Z5"
            className={`${inp} font-mono`}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            GST rate (%)
          </label>
          <input
            type="number"
            min={0}
            max={28}
            step={0.5}
            value={form.gstRate}
            onChange={(e) => setForm((f) => ({ ...f, gstRate: Number(e.target.value) || 0 }))}
            className={inp}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Split automatically into CGST + SGST (same-state orders) or IGST (other states).
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Invoice number prefix
          </label>
          <input
            value={form.invoicePrefix}
            onChange={(e) => setForm((f) => ({ ...f, invoicePrefix: e.target.value.toUpperCase() }))}
            placeholder="NM"
            className={`${inp} font-mono`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Invoices number sequentially per financial year, e.g. {form.invoicePrefix || "NM"}/2526/0001.
          </p>
        </div>
      </div>

      <button
        onClick={save}
        disabled={pending}
        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {saved ? "Saved" : "Save settings"}
      </button>
    </div>
  );
}
