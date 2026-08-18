import "server-only";
import { formatINR } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { getInvoiceConfig, amountInWords } from "@/lib/gst";
import { getProductById } from "@/lib/cms";
import { paymentModeLabel } from "@/lib/payment-mode";
import type { AdminOrder } from "@/lib/orders";

export type InvoiceLine = {
  name: string;
  hsn?: string;
  weight: string;
  qty: number;
  rate: number; // price per unit
  value: number; // qty * rate
};

export type InvoiceData = {
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string; // ISO
  status: string;
  seller: { name: string; address: string; gstin: string };
  customerName: string;
  billingAddress: string;
  shippingAddress: string;
  mobile: string;
  paymentMode: string;
  lines: InvoiceLine[];
  subtotal: number;
  discount: number;
  discountLabel: string;
  shipping: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  gstRate: number;
  grandTotal: number;
  amountInWords: string;
};

export { paymentModeLabel };

/** Assemble the one invoice data shape used by the PDF, emails and both account UIs. */
export async function buildInvoiceData(order: AdminOrder): Promise<InvoiceData> {
  const config = await getInvoiceConfig();
  const addr = order.address;
  const addrLine = addr
    ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")
    : "—";

  const lines: InvoiceLine[] = await Promise.all(
    order.items.map(async (i) => {
      const product = await getProductById(i.id).catch(() => undefined);
      return {
        name: i.name,
        hsn: product?.hsn || undefined,
        weight: i.weight,
        qty: i.qty,
        rate: i.price,
        value: i.price * i.qty,
      };
    }),
  );

  const invoiceNumber =
    order.invoice_number || `${config.invoicePrefix}/PENDING/${order.id.slice(0, 8).toUpperCase()}`;

  return {
    orderId: order.id.slice(0, 8).toUpperCase(),
    invoiceNumber,
    invoiceDate: order.created_at,
    status: order.status,
    seller: {
      name: SITE.legal,
      address: SITE.address,
      gstin: config.gstin || "Not configured",
    },
    customerName: addr?.name || "—",
    billingAddress: addrLine,
    shippingAddress: addrLine, // single address captured at checkout; same for both
    mobile: addr?.phone || "—",
    paymentMode: paymentModeLabel(order.payment_method, order.channel),
    lines,
    subtotal: order.subtotal,
    discount: order.discount,
    discountLabel: order.discount_label || (order.discount > 0 ? "Discount" : ""),
    shipping: order.shipping,
    taxableAmount: order.taxable_amount || Math.max(0, order.subtotal - order.discount + order.shipping),
    cgst: order.cgst,
    sgst: order.sgst,
    igst: order.igst,
    gstRate: order.gst_rate,
    grandTotal: order.total,
    amountInWords: amountInWords(order.total),
  };
}

export { formatINR };
