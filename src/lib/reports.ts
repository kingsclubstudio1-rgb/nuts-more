import "server-only";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseAdminConfigured } from "./supabase/config";
import { istDayStart, istDayEnd, istShifted } from "./ist";
import type { OrderItem } from "./orders";

export type GroupBy = "day" | "week" | "month";

type OrderRow = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  cgst: number;
  sgst: number;
  igst: number;
  created_at: string;
};

export type BucketRow = { key: string; label: string; orders: number; revenue: number };
export type ProductRow = { id: string; name: string; qty: number; revenue: number };
export type VariantRow = { id: string; name: string; weight: string; qty: number; revenue: number };

export type SalesReport = {
  from: string;
  to: string;
  totalOrders: number;
  cancelledOrders: number;
  revenue: number;
  aov: number;
  taxCollected: number;
  byBucket: BucketRow[];
  byProduct: ProductRow[];
  byVariant: VariantRow[];
};

async function fetchOrders(from: string, to: string): Promise<OrderRow[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const sb = createAdminClient();
  // Range boundaries are IST calendar days, not UTC ones: "today" must mean
  // midnight-to-midnight in India. `to` is inclusive of its whole day.
  const { data, error } = await sb
    .from("orders")
    .select("id, items, subtotal, discount, shipping, total, status, cgst, sgst, igst, created_at")
    .gte("created_at", istDayStart(from).toISOString())
    .lt("created_at", istDayEnd(to).toISOString())
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as OrderRow[];
}

/**
 * Which day/week/month an order belongs to, as seen in India. `istShifted`
 * moves the instant so its UTC fields read as IST wall-clock, letting the
 * existing UTC-based calendar arithmetic stay correct for Indian dates.
 */
function bucketKey(iso: string, groupBy: GroupBy): { key: string; label: string } {
  const d = istShifted(new Date(iso));
  const fmtOpts = { timeZone: "UTC" } as const; // `d` already carries IST wall-clock
  if (groupBy === "day") {
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", ...fmtOpts }),
    };
  }
  if (groupBy === "month") {
    const key = d.toISOString().slice(0, 7);
    return { key, label: d.toLocaleDateString("en-IN", { month: "long", year: "numeric", ...fmtOpts }) };
  }
  // ISO week (Mon-Sun)
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (t.getUTCDay() + 6) % 7; // 0 = Monday
  t.setUTCDate(t.getUTCDate() - day); // back to Monday of this week
  const key = t.toISOString().slice(0, 10);
  const end = new Date(t);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (x: Date) => x.toLocaleDateString("en-IN", { day: "2-digit", month: "short", ...fmtOpts });
  return { key, label: `${fmt(t)} – ${fmt(end)}, ${end.getUTCFullYear()}` };
}

export async function getSalesReport(from: string, to: string, groupBy: GroupBy = "day"): Promise<SalesReport> {
  const orders = await fetchOrders(from, to);
  const active = orders.filter((o) => o.status !== "cancelled");
  const cancelled = orders.length - active.length;

  const revenue = active.reduce((s, o) => s + (o.total || 0), 0);
  const taxCollected = active.reduce((s, o) => s + (o.cgst || 0) + (o.sgst || 0) + (o.igst || 0), 0);

  const buckets = new Map<string, BucketRow>();
  for (const o of active) {
    const { key, label } = bucketKey(o.created_at, groupBy);
    const row = buckets.get(key) ?? { key, label, orders: 0, revenue: 0 };
    row.orders += 1;
    row.revenue += o.total || 0;
    buckets.set(key, row);
  }
  const byBucket = Array.from(buckets.values()).sort((a, b) => a.key.localeCompare(b.key));

  const products = new Map<string, ProductRow>();
  const variants = new Map<string, VariantRow>();
  for (const o of active) {
    for (const it of o.items ?? []) {
      const pRow = products.get(it.id) ?? { id: it.id, name: it.name, qty: 0, revenue: 0 };
      pRow.qty += it.qty;
      pRow.revenue += it.price * it.qty;
      products.set(it.id, pRow);

      const vKey = `${it.id}:${it.weight}`;
      const vRow = variants.get(vKey) ?? { id: it.id, name: it.name, weight: it.weight, qty: 0, revenue: 0 };
      vRow.qty += it.qty;
      vRow.revenue += it.price * it.qty;
      variants.set(vKey, vRow);
    }
  }
  const byProduct = Array.from(products.values()).sort((a, b) => b.revenue - a.revenue);
  const byVariant = Array.from(variants.values()).sort((a, b) => b.revenue - a.revenue);

  return {
    from,
    to,
    totalOrders: active.length,
    cancelledOrders: cancelled,
    revenue,
    aov: active.length ? Math.round(revenue / active.length) : 0,
    taxCollected,
    byBucket,
    byProduct,
    byVariant,
  };
}

/* -------------------------- date range presets -------------------------- */

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function datePreset(
  key: "today" | "yesterday" | "7d" | "30d" | "this_month" | "last_month" | "this_year",
): { from: string; to: string } {
  // Anchored to the IST calendar so "today" matches the storefront's day, not
  // the server's UTC day (which lags India by 5h30m).
  const now = istShifted(new Date());
  const todayIso = iso(now);
  switch (key) {
    case "today":
      return { from: todayIso, to: todayIso };
    case "yesterday": {
      const y = new Date(now);
      y.setUTCDate(y.getUTCDate() - 1);
      return { from: iso(y), to: iso(y) };
    }
    case "7d": {
      const from = new Date(now);
      from.setUTCDate(from.getUTCDate() - 6);
      return { from: iso(from), to: todayIso };
    }
    case "30d": {
      const from = new Date(now);
      from.setUTCDate(from.getUTCDate() - 29);
      return { from: iso(from), to: todayIso };
    }
    case "this_month": {
      const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      return { from: iso(from), to: todayIso };
    }
    case "last_month": {
      const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
      const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
      return { from: iso(from), to: iso(to) };
    }
    case "this_year": {
      const from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      return { from: iso(from), to: todayIso };
    }
  }
}
