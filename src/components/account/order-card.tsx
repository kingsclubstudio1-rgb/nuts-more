"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Truck, FileText, Download } from "lucide-react";
import { statusLabel, STATUS_STYLE } from "@/lib/order-status";
import { formatINR } from "@/lib/catalog";
import { formatIST } from "@/lib/ist";
import { paymentModeLabel } from "@/lib/payment-mode";
import type { Order } from "@/lib/orders";
import { ReturnRequest } from "@/components/account/return-request";
import { cn } from "@/lib/utils";

export function OrderCard({ order: o }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const addr = o.address;
  const addrLine = addr ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ") : "";

  return (
    <div className="rounded-2xl border border-line bg-card shadow-[var(--shadow-soft)]">
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Order #{o.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">
              {formatIST(o.created_at, { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase",
              STATUS_STYLE[o.status] ?? "bg-cream-2 text-muted-foreground",
            )}
          >
            {statusLabel(o.status)}
          </span>
        </div>

        <ul className="mt-3 space-y-1.5 text-sm">
          {o.items.map((it, i) => (
            <li key={i} className="flex justify-between text-body">
              <span>
                {it.name} <span className="text-muted-foreground">({it.weight}) × {it.qty}</span>
              </span>
              <span className="tabular-nums">{formatINR(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3 border-t border-line pt-3">
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/track?id=${o.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold"
            >
              <Truck className="h-3.5 w-3.5" /> Track order
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold"
            >
              <FileText className="h-3.5 w-3.5" />
              {open ? "Hide invoice" : "View invoice"}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </button>
            {o.status === "delivered" && <ReturnRequest orderId={o.id} />}
          </div>
          <p className="text-sm font-bold text-foreground">
            Total:&nbsp;<span className="tabular-nums">{formatINR(o.total)}</span>
          </p>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-cream/60 p-5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-heading text-base font-bold text-foreground">Tax Invoice</p>
            <a
              href={`/api/invoice/${o.id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-3.5 py-1.5 text-xs font-semibold text-on-dark hover:bg-gold hover:text-primary-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </a>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoice no.</p>
              <p className="mt-0.5 font-mono text-foreground">{o.invoice_number || "Pending"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment mode</p>
              <p className="mt-0.5 text-foreground">{paymentModeLabel(o.payment_method, o.channel)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing &amp; shipping</p>
              <p className="mt-0.5 text-foreground">{addr?.name}{addr?.phone ? ` · ${addr.phone}` : ""}</p>
              <p className="text-muted-foreground">{addrLine}</p>
            </div>
          </div>

          <div className="mt-4 ml-auto max-w-xs space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatINR(o.subtotal)}</span>
            </div>
            {o.discount > 0 && (
              <div className="flex justify-between text-gold-deep">
                <span>Discount{o.discount_label ? ` (${o.discount_label})` : ""}</span>
                <span>-{formatINR(o.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{o.shipping === 0 ? "FREE" : formatINR(o.shipping)}</span>
            </div>
            {o.cgst > 0 && (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>CGST</span>
                  <span>{formatINR(o.cgst)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST</span>
                  <span>{formatINR(o.sgst)}</span>
                </div>
              </>
            )}
            {o.igst > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>IGST</span>
                <span>{formatINR(o.igst)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-foreground">
              <span>Grand Total</span>
              <span>{formatINR(o.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
