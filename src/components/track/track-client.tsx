"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, PackageCheck, XCircle, CheckCircle2, Circle } from "lucide-react";
import { STATUS_STEPS, statusLabel, stepIndex } from "@/lib/order-status";
import { formatINR } from "@/lib/catalog";

type TrackedOrder = {
  id: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  total: number;
  itemCount: number;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function TrackClient({ initialId = "" }: { initialId?: string }) {
  const [id, setId] = useState(initialId);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lookup = useCallback(async (orderId: string, quiet = false) => {
    const term = orderId.trim();
    if (!term) return;
    if (!quiet) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!res.ok) {
        if (!quiet) {
          setOrder(null);
          setError(data.error || "Could not find that order.");
        }
        return;
      }
      setOrder(data.order);
      setError(null);
    } catch {
      if (!quiet) setError("Something went wrong. Please try again.");
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  // Auto-lookup if an ID was passed in the URL.
  useEffect(() => {
    if (initialId) lookup(initialId);
  }, [initialId, lookup]);

  // Light polling so status changes reflect without a manual refresh.
  useEffect(() => {
    if (!order) return;
    pollRef.current = setInterval(() => lookup(order.id, true), 20000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [order, lookup]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(id);
  };

  const cancelled = order?.status === "cancelled";
  const activeIdx = order ? stepIndex(order.status) : -1;

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)] sm:flex-row"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your Order ID"
            className="h-12 w-full rounded-xl border border-line bg-cream pl-10 pr-4 text-sm text-foreground focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-7 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] transition-colors hover:bg-gold-soft disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track"}
        </button>
      </form>

      <p className="mt-2 px-1 text-xs text-muted-foreground">
        Your Order ID is in your order-confirmation email and on your account page.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {order && (
        <div className="mt-6 rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
              <p className="font-mono text-sm font-semibold text-foreground">#{order.id.slice(0, 8)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Current status</p>
              <p
                className={
                  "font-heading text-lg font-bold " +
                  (cancelled ? "text-red-600" : "text-gold-deep")
                }
              >
                {statusLabel(order.status)}
              </p>
            </div>
          </div>

          {cancelled ? (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-red-700">
              <XCircle className="h-6 w-6 shrink-0" />
              <p className="text-sm font-medium">
                This order has been cancelled. If this is unexpected, please contact us.
              </p>
            </div>
          ) : (
            <ol className="mt-6 space-y-5">
              {STATUS_STEPS.map((step, i) => {
                const done = i < activeIdx;
                const current = i === activeIdx;
                return (
                  <li key={step.key} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      ) : current ? (
                        <PackageCheck className="h-6 w-6 text-gold" />
                      ) : (
                        <Circle className="h-6 w-6 text-line" />
                      )}
                    </span>
                    <div>
                      <p
                        className={
                          "text-sm font-semibold " +
                          (done || current ? "text-foreground" : "text-muted-foreground")
                        }
                      >
                        {step.label}
                      </p>
                      {current && (
                        <p className="text-xs text-gold-deep">Your order is here right now.</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-6 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Order date</p>
              <p className="font-medium text-foreground">{fmtDate(order.created_at)}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Last updated</p>
              <p className="font-medium text-foreground">{fmtDate(order.updated_at)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Items</p>
              <p className="font-medium text-foreground">{order.itemCount}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Order total</p>
              <p className="font-medium text-foreground">{formatINR(order.total)}</p>
            </div>
          </div>

          <p className="mt-4 text-center text-[0.7rem] text-muted-foreground">
            This page updates automatically as your order progresses.
          </p>
        </div>
      )}
    </div>
  );
}
