import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { listOrders } from "@/lib/orders";
import { formatINR } from "@/lib/catalog";
import { AdminOrderStatus } from "@/components/admin/admin-order-status";

export const dynamic = "force-dynamic";

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"} · {formatINR(revenue)} collected
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-heading text-lg font-bold text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paid orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line/70 last:border-0 hover:bg-cream/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-gold-deep hover:underline">
                      #{o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmt(o.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{o.address?.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.address?.phone ?? ""} {o.address?.city ? `· ${o.address.city}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.items?.reduce((n, i) => n + (i.qty || 0), 0) ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {o.payment_id ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Paid
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatINR(o.total)}</td>
                  <td className="px-4 py-3">
                    <AdminOrderStatus id={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
