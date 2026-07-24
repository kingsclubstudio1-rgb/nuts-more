import "server-only";
import nodemailer from "nodemailer";
import { formatINR } from "@/lib/catalog";

/**
 * Transactional email via SMTP (Gmail app-password by default).
 * Configured through env — until the SMTP vars are set, `isMailerConfigured()`
 * is false and sends are skipped silently so orders never fail on email.
 *
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465
 *   SMTP_USER=you@gmail.com
 *   SMTP_PASS=<16-char app password>
 *   SMTP_FROM="Nuts & More <you@gmail.com>"   (optional)
 *   ORDER_NOTIFY_EMAIL=store@…                 (optional — copy to the store)
 */
const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT || 465);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.SMTP_FROM || (USER ? `Nuts & More <${USER}>` : "");
const NOTIFY = process.env.ORDER_NOTIFY_EMAIL || "";

export function isMailerConfigured(): boolean {
  return Boolean(HOST && USER && PASS);
}

let transporter: nodemailer.Transporter | null = null;
function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
    });
  }
  return transporter;
}

type Line = { name: string; weight: string; price: number; qty: number };
type OrderEmail = {
  to: string;
  name?: string;
  orderId?: string;
  items: Line[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address?: { line1?: string; city?: string; pincode?: string; state?: string } | null;
};

function rows(items: Line[]): string {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;color:#3b2f24;font-size:14px;">${i.name}
          <span style="color:#8a7a68;">(${i.weight}) &times;${i.qty}</span>
        </td>
        <td style="padding:8px 0;text-align:right;color:#3b2f24;font-size:14px;white-space:nowrap;">
          ${formatINR(i.price * i.qty)}
        </td>
      </tr>`,
    )
    .join("");
}

function orderHtml(o: OrderEmail): string {
  const ship = o.shipping === 0 ? "FREE" : formatINR(o.shipping);
  const addr = o.address
    ? [o.address.line1, o.address.city, o.address.state, o.address.pincode].filter(Boolean).join(", ")
    : "";
  return `<!doctype html>
  <div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fbf7f0;padding:28px;border-radius:16px;">
    <div style="text-align:center;">
      <h1 style="margin:0;color:#3b2f24;font-size:22px;">Nuts &amp; More</h1>
      <p style="margin:6px 0 0;color:#b8912f;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;font-size:12px;">Order confirmed</p>
    </div>
    <p style="color:#3b2f24;font-size:15px;margin:22px 0 4px;">Hi ${o.name || "there"},</p>
    <p style="color:#5c4f40;font-size:14px;margin:0 0 18px;">
      Thank you for your order${o.orderId ? ` <b>#${String(o.orderId).slice(0, 8)}</b>` : ""}. We've received your
      payment and are getting it ready. Here's your summary:
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e7dcc9;">
      ${rows(o.items)}
    </table>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e7dcc9;margin-top:6px;font-size:14px;">
      <tr><td style="padding:6px 0;color:#5c4f40;">Subtotal</td><td style="text-align:right;color:#3b2f24;">${formatINR(o.subtotal)}</td></tr>
      ${o.discount > 0 ? `<tr><td style="padding:6px 0;color:#b8912f;">Discount</td><td style="text-align:right;color:#b8912f;">-${formatINR(o.discount)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#5c4f40;">Shipping</td><td style="text-align:right;color:#3b2f24;">${ship}</td></tr>
      <tr><td style="padding:10px 0 0;color:#3b2f24;font-weight:bold;font-size:16px;border-top:1px solid #e7dcc9;">Total</td>
          <td style="padding:10px 0 0;text-align:right;color:#3b2f24;font-weight:bold;font-size:16px;border-top:1px solid #e7dcc9;">${formatINR(o.total)}</td></tr>
    </table>
    ${addr ? `<p style="color:#5c4f40;font-size:13px;margin:18px 0 0;"><b style="color:#3b2f24;">Delivering to:</b> ${addr}</p>` : ""}
    <p style="color:#8a7a68;font-size:12px;margin:24px 0 0;text-align:center;">
      Questions? Just reply to this email. — Team Nuts &amp; More
    </p>
  </div>`;
}

/** Fire-and-forget order confirmation to the customer (and optional store copy). */
export async function sendOrderConfirmation(o: OrderEmail): Promise<{ sent: boolean }> {
  if (!isMailerConfigured()) return { sent: false };
  try {
    await getTransport().sendMail({
      from: FROM,
      to: o.to,
      bcc: NOTIFY || undefined,
      subject: `Your Nuts & More order is confirmed${o.orderId ? ` (#${String(o.orderId).slice(0, 8)})` : ""}`,
      html: orderHtml(o),
    });
    return { sent: true };
  } catch {
    // never let an email hiccup break a paid order
    return { sent: false };
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nuts-and-more.store";

type InvoiceOrder = {
  id: string;
  items: Line[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address?: {
    name?: string;
    phone?: string;
    line1?: string;
    city?: string;
    pincode?: string;
    state?: string;
  } | null;
  created_at?: string;
  status?: string;
  payment_id?: string | null;
};

function invoiceHtml(o: InvoiceOrder): string {
  const ship = o.shipping === 0 ? "FREE" : formatINR(o.shipping);
  const addr = o.address
    ? [o.address.line1, o.address.city, o.address.state, o.address.pincode].filter(Boolean).join(", ")
    : "";
  const date = o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN") : "";
  return `<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff;border:1px solid #e7dcc9;border-radius:12px;overflow:hidden;">
    <div style="background:#241606;color:#f6efe2;padding:22px 28px;display:flex;justify-content:space-between;">
      <div>
        <div style="font-size:20px;font-weight:bold;">Nuts &amp; More</div>
        <div style="font-size:11px;color:#c9a24a;letter-spacing:.08em;text-transform:uppercase;">Tax Invoice</div>
      </div>
      <div style="text-align:right;font-size:12px;color:#d8c9a8;">
        <div>Invoice #${o.id.slice(0, 8).toUpperCase()}</div>
        <div>${date}</div>
      </div>
    </div>
    <div style="padding:22px 28px;">
      ${
        o.address
          ? `<p style="margin:0 0 14px;font-size:13px;color:#5c4f40;"><b style="color:#3b2f24;">Bill to:</b> ${o.address.name ?? ""}${o.address.phone ? " · " + o.address.phone : ""}<br>${addr}</p>`
          : ""
      }
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:2px solid #e7dcc9;">
          <td style="padding:6px 0;color:#8a7a68;font-size:12px;text-transform:uppercase;">Item</td>
          <td style="padding:6px 0;color:#8a7a68;font-size:12px;text-transform:uppercase;text-align:right;">Amount</td>
        </tr>
        ${rows(o.items)}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:14px;">
        <tr><td style="padding:5px 0;color:#5c4f40;">Subtotal</td><td style="text-align:right;color:#3b2f24;">${formatINR(o.subtotal)}</td></tr>
        ${o.discount > 0 ? `<tr><td style="padding:5px 0;color:#b8912f;">Discount</td><td style="text-align:right;color:#b8912f;">-${formatINR(o.discount)}</td></tr>` : ""}
        <tr><td style="padding:5px 0;color:#5c4f40;">Shipping</td><td style="text-align:right;color:#3b2f24;">${ship}</td></tr>
        <tr><td style="padding:10px 0 0;font-weight:bold;font-size:16px;color:#3b2f24;border-top:1px solid #e7dcc9;">Total</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;font-size:16px;color:#3b2f24;border-top:1px solid #e7dcc9;">${formatINR(o.total)}</td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:12px;color:#8a7a68;">Payment: ${o.payment_id ? "Paid online (" + o.payment_id + ")" : "—"}</p>
      <p style="margin:14px 0 0;font-size:12px;color:#8a7a68;text-align:center;">Thank you for shopping with Nuts &amp; More. Track your order at ${SITE_URL}/track</p>
    </div>
  </div>`;
}

/** Email the full invoice to the customer (admin-triggered or on confirmation). */
export async function sendInvoiceEmail(to: string, o: InvoiceOrder): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !to) return { sent: false };
  try {
    await getTransport().sendMail({
      from: FROM,
      to,
      bcc: NOTIFY || undefined,
      subject: `Your Nuts & More invoice — #${o.id.slice(0, 8).toUpperCase()}`,
      html: invoiceHtml(o),
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}

/** Short status-change notification to the customer. */
export async function sendStatusUpdateEmail(
  to: string,
  orderId: string,
  statusText: string,
): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !to) return { sent: false };
  try {
    await getTransport().sendMail({
      from: FROM,
      to,
      subject: `Order #${orderId.slice(0, 8).toUpperCase()} update: ${statusText}`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fbf7f0;border-radius:14px;">
        <h2 style="color:#3b2f24;margin:0 0 6px;">Nuts &amp; More</h2>
        <p style="color:#5c4f40;font-size:14px;margin:0 0 10px;">Your order <b>#${orderId.slice(0, 8).toUpperCase()}</b> status is now:</p>
        <p style="font-size:22px;font-weight:bold;color:#b8912f;margin:0 0 14px;">${statusText}</p>
        <p style="color:#8a7a68;font-size:13px;margin:0;">Track it anytime at <a href="${SITE_URL}/track" style="color:#b8912f;">${SITE_URL}/track</a></p>
      </div>`,
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}

const ADMIN_INBOX = NOTIFY || process.env.ADMIN_EMAIL || USER || "";

/** Notify the store team of a new contact / bulk enquiry. */
export async function sendEnquiryNotification(e: {
  type: "contact" | "bulk" | "return";
  fields: Record<string, string | undefined>;
}): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !ADMIN_INBOX) return { sent: false };
  const rows = Object.entries(e.fields)
    .filter(([, v]) => v && String(v).trim())
    .map(
      ([k, v]) =>
        `<tr><td style="padding:5px 12px 5px 0;color:#8a7a68;font-size:13px;text-transform:capitalize;white-space:nowrap;vertical-align:top;">${k.replace(/_/g, " ")}</td><td style="padding:5px 0;color:#3b2f24;font-size:13px;">${String(v).replace(/</g, "&lt;")}</td></tr>`,
    )
    .join("");
  const title =
    e.type === "bulk"
      ? "New Bulk Order Enquiry"
      : e.type === "return"
        ? "New Return Request"
        : "New Contact Enquiry";
  try {
    await getTransport().sendMail({
      from: FROM,
      to: ADMIN_INBOX,
      replyTo: e.fields.email || undefined,
      subject: `${title}${e.fields.name ? ` — ${e.fields.name}` : ""}`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fbf7f0;border-radius:14px;">
        <h2 style="color:#3b2f24;margin:0 0 4px;">${title}</h2>
        <p style="color:#8a7a68;font-size:12px;margin:0 0 16px;">Nuts &amp; More — website enquiry</p>
        <table style="border-collapse:collapse;width:100%;">${rows}</table>
      </div>`,
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}
