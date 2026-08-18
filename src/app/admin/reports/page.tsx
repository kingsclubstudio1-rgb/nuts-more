import Link from "next/link";
import { Download, TrendingUp, ShoppingBag, Receipt, IndianRupee } from "lucide-react";
import { getSalesReport, datePreset, type GroupBy } from "@/lib/reports";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PRESETS: { key: Parameters<typeof datePreset>[0]; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "this_month", label: "This month" },
  { key: "last_month", label: "Last month" },
  { key: "this_year", label: "This year" },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function buildHref(params: Record<string, string>) {
  const sp = new URLSearchParams(params);
  return `/admin/reports?${sp.toString()}`;
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const defaultRange = datePreset("this_month");
  const from = sp.from || defaultRange.from;
  const to = sp.to || defaultRange.to;
  const group = (sp.group as GroupBy) || "day";

  const report = await getSalesReport(from, to, group);

  const cards = [
    { label: "Revenue", value: formatINR(report.revenue), icon: IndianRupee },
    { label: "Orders", value: String(report.totalOrders), icon: ShoppingBag },
    { label: "Avg. order value", value: formatINR(report.aov), icon: TrendingUp },
    { label: "Tax collected (GST)", value: formatINR(report.taxCollected), icon: Receipt },
  ];

  const csvHref = (type: "buckets" | "products" | "variants") =>
    `/api/admin/reports/csv?from=${from}&to=${to}&group=${group}&type=${type}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Sales reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(from).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} –{" "}
            {new Date(to).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            {report.cancelledOrders > 0 && ` · ${report.cancelledOrders} cancelled order${report.cancelledOrders === 1 ? "" : "s"} excluded`}
          </p>
        </div>
      </div>

      {/* Presets + custom range */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => {
          const range = datePreset(p.key);
          const active = range.from === from && range.to === to;
          return (
            <Link
              key={p.key}
              href={buildHref({ from: range.from, to: range.to, group })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                active ? "border-gold bg-gold text-primary-foreground" : "border-line bg-white text-foreground hover:border-gold hover:text-gold-deep",
              )}
            >
              {p.label}
            </Link>
          );
        })}
        <form action="/admin/reports" className="ml-auto flex flex-wrap items-center gap-2">
          <input type="hidden" name="group" value={group} />
          <input
            type="date"
            name="from"
            defaultValue={from}
            max={todayIso()}
            className="h-9 rounded-lg border border-line bg-white px-2.5 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            name="to"
            defaultValue={to}
            max={todayIso()}
            className="h-9 rounded-lg border border-line bg-white px-2.5 text-xs"
          />
          <button
            type="submit"
            className="h-9 rounded-lg bg-espresso px-3.5 text-xs font-semibold text-on-dark hover:bg-gold hover:text-primary-foreground"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold-deep">
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-heading text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Time series */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
            {(["day", "week", "month"] as GroupBy[]).map((g) => (
              <Link
                key={g}
                href={buildHref({ from, to, group: g })}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                  g === group ? "bg-gold text-primary-foreground" : "text-foreground hover:text-gold-deep",
                )}
              >
                {g}ly
              </Link>
            ))}
          </div>
          <a href={csvHref("buckets")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.byBucket.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    No orders in this range.
                  </td>
                </tr>
              ) : (
                report.byBucket.map((b) => (
                  <tr key={b.key} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-2.5 text-foreground">{b.label}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">{b.orders}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-foreground">{formatINR(b.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* By product */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">By product</h2>
          <a href={csvHref("products")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-right">Qty sold</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.byProduct.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    No orders in this range.
                  </td>
                </tr>
              ) : (
                report.byProduct.map((p) => (
                  <tr key={p.id} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-2.5 text-foreground">{p.name}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">{p.qty}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-foreground">{formatINR(p.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* By variant (grammage) */}
      <section className="mt-8 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">By weight (grammage)</h2>
          <a href={csvHref("variants")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3 text-right">Qty sold</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.byVariant.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No orders in this range.
                  </td>
                </tr>
              ) : (
                report.byVariant.map((v) => (
                  <tr key={`${v.id}:${v.weight}`} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-2.5 text-foreground">{v.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{v.weight}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">{v.qty}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-foreground">{formatINR(v.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
