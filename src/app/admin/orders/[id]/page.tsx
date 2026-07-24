import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminOrderById } from "@/lib/orders";
import { statusLabel } from "@/lib/order-status";
import { formatINR } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { PrintButton } from "@/components/admin/print-button";
import { EmailInvoiceButton } from "@/components/admin/email-invoice-button";
import { AdminOrderStatus } from "@/components/admin/admin-order-status";

export const dynamic = "force-dynamic";

function fmt(iso: string): string {
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

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  const addr = order.address;
  const addrLine = addr
    ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")
    : "";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-gold-deep">
          <ArrowLeft className="h-4 w-4" /> All orders
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <AdminOrderStatus id={order.id} status={order.status} />
          <EmailInvoiceButton id={order.id} />
          <PrintButton />
        </div>
      </div>

      {/* Invoice */}
      <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)] print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 bg-espresso px-8 py-6 text-on-dark print:bg-white print:text-foreground">
          <div>
            <p className="font-heading text-2xl font-bold">Nuts &amp; More</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Tax Invoice</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-mono font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-muted-on-dark print:text-muted-foreground">{fmt(order.created_at)}</p>
            <p className="mt-1 font-semibold text-gold">{statusLabel(order.status)}</p>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bill to</p>
              <p className="mt-1 font-semibold text-foreground">{addr?.name ?? "—"}</p>
              {addr?.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
              {addrLine && <p className="text-sm text-muted-foreground">{addrLine}</p>}
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From</p>
              <p className="mt-1 font-semibold text-foreground">{SITE.legal}</p>
              <p className="text-sm text-muted-foreground">{SITE.address}</p>
            </div>
          </div>

          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i, idx) => (
                <tr key={idx} className="border-b border-line/70">
                  <td className="py-2.5 text-foreground">
                    {i.name} <span className="text-muted-foreground">({i.weight})</span>
                  </td>
                  <td className="py-2.5 text-center text-muted-foreground">{i.qty}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{formatINR(i.price)}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{formatINR(i.price * i.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gold-deep">
                <span>Discount</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-foreground">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Payment: {order.payment_id ? `Paid online · ${order.payment_id}` : "—"} · Channel:{" "}
            {order.channel ?? "—"}
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Thank you for shopping with Nuts &amp; More.
          </p>
        </div>
      </div>
    </div>
  );
}
