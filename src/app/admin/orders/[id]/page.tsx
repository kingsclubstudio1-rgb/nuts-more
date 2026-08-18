import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { getAdminOrderById } from "@/lib/orders";
import { buildInvoiceData } from "@/lib/invoice";
import { statusLabel } from "@/lib/order-status";
import { formatINR } from "@/lib/catalog";
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

  const inv = await buildInvoiceData(order);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-gold-deep">
          <ArrowLeft className="h-4 w-4" /> All orders
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <AdminOrderStatus id={order.id} status={order.status} />
          <a
            href={`/api/invoice/${order.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-gold hover:text-gold-deep"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <EmailInvoiceButton id={order.id} />
          <PrintButton />
        </div>
      </div>

      {/* Invoice */}
      <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)] print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 bg-espresso px-8 py-6 text-on-dark print:bg-white print:text-foreground">
          <div>
            <p className="font-heading text-2xl font-bold">{inv.seller.name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Tax Invoice</p>
            <p className="mt-1 text-xs text-muted-on-dark print:text-muted-foreground">GSTIN: {inv.seller.gstin}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-mono font-semibold">{inv.invoiceNumber}</p>
            <p className="text-muted-on-dark print:text-muted-foreground">{fmt(order.created_at)}</p>
            <p className="text-muted-on-dark print:text-muted-foreground">Order #{inv.orderId}</p>
            <p className="mt-1 font-semibold text-gold">{statusLabel(order.status)}</p>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</p>
              <p className="mt-1 font-semibold text-foreground">{inv.customerName}</p>
              <p className="text-sm text-muted-foreground">{inv.mobile}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing address</p>
              <p className="mt-1 text-sm text-muted-foreground">{inv.billingAddress}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shipping address</p>
              <p className="mt-1 text-sm text-muted-foreground">{inv.shippingAddress}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-bold uppercase tracking-wider">Payment mode:</span> {inv.paymentMode}
          </p>

          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">HSN</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {inv.lines.map((l, idx) => (
                <tr key={idx} className="border-b border-line/70">
                  <td className="py-2.5 text-foreground">
                    {l.name} <span className="text-muted-foreground">({l.weight})</span>
                  </td>
                  <td className="py-2.5 text-center text-muted-foreground">{l.hsn || "—"}</td>
                  <td className="py-2.5 text-center text-muted-foreground">{l.qty}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{formatINR(l.rate)}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{formatINR(l.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatINR(inv.subtotal)}</span>
            </div>
            {inv.discount > 0 && (
              <div className="flex justify-between text-gold-deep">
                <span>Discount{inv.discountLabel ? ` (${inv.discountLabel})` : ""}</span>
                <span>-{formatINR(inv.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{inv.shipping === 0 ? "FREE" : formatINR(inv.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-1.5 font-semibold text-foreground">
              <span>Taxable Amount</span>
              <span>{formatINR(inv.taxableAmount)}</span>
            </div>
            {inv.cgst > 0 && (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>CGST @ {(inv.gstRate / 2).toFixed(1)}%</span>
                  <span>{formatINR(inv.cgst)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST @ {(inv.gstRate / 2).toFixed(1)}%</span>
                  <span>{formatINR(inv.sgst)}</span>
                </div>
              </>
            )}
            {inv.igst > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>IGST @ {inv.gstRate.toFixed(1)}%</span>
                <span>{formatINR(inv.igst)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-foreground">
              <span>Grand Total</span>
              <span>{formatINR(inv.grandTotal)}</span>
            </div>
          </div>

          <p className="mt-4 text-xs italic text-muted-foreground">Amount in words: {inv.amountInWords}</p>

          <p className="mt-6 text-xs text-muted-foreground">
            Payment: {order.payment_id ? `Paid online · ${order.payment_id}` : "—"} · Channel:{" "}
            {order.channel ?? "—"}
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Thank you for shopping with {inv.seller.name}.
          </p>
        </div>
      </div>
    </div>
  );
}
