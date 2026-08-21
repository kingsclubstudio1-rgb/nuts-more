import "server-only";
import nodemailer from "nodemailer";
import { formatINR } from "@/lib/catalog";
import type { InvoiceData } from "@/lib/invoice";
import { formatIST } from "@/lib/ist";

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
 *   ORDER_NOTIFY_EMAIL=store@…                 (optional — where the admin copy goes)
 */
const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT || 465);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.SMTP_FROM || (USER ? `Nuts & More <${USER}>` : "");
const NOTIFY = process.env.ORDER_NOTIFY_EMAIL || "";
const ADMIN_INBOX = NOTIFY || process.env.ADMIN_EMAIL || USER || "";

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

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function lineRows(data: InvoiceData): string {
  return data.lines
    .map(
      (l) => `
      <tr>
        <td style="padding:8px 0;color:#3b2f24;font-size:14px;">${esc(l.name)}
          <span style="color:#8a7a68;">(${esc(l.weight)}) &times;${l.qty}</span>
        </td>
        <td style="padding:8px 0;text-align:right;color:#3b2f24;font-size:14px;white-space:nowrap;">
          ${formatINR(l.value)}
        </td>
      </tr>`,
    )
    .join("");
}

function summaryRows(data: InvoiceData): string {
  const rows: string[] = [];
  rows.push(
    `<tr><td style="padding:5px 0;color:#5c4f40;">Subtotal</td><td style="text-align:right;color:#3b2f24;">${formatINR(data.subtotal)}</td></tr>`,
  );
  if (data.discount > 0) {
    rows.push(
      `<tr><td style="padding:5px 0;color:#b8912f;">Discount${data.discountLabel ? ` (${esc(data.discountLabel)})` : ""}</td><td style="text-align:right;color:#b8912f;">-${formatINR(data.discount)}</td></tr>`,
    );
  }
  rows.push(
    `<tr><td style="padding:5px 0;color:#5c4f40;">Shipping</td><td style="text-align:right;color:#3b2f24;">${data.shipping === 0 ? "FREE" : formatINR(data.shipping)}</td></tr>`,
  );
  if (data.cgst > 0) {
    rows.push(`<tr><td style="padding:5px 0;color:#5c4f40;">CGST</td><td style="text-align:right;color:#3b2f24;">${formatINR(data.cgst)}</td></tr>`);
    rows.push(`<tr><td style="padding:5px 0;color:#5c4f40;">SGST</td><td style="text-align:right;color:#3b2f24;">${formatINR(data.sgst)}</td></tr>`);
  } else if (data.igst > 0) {
    rows.push(`<tr><td style="padding:5px 0;color:#5c4f40;">IGST</td><td style="text-align:right;color:#3b2f24;">${formatINR(data.igst)}</td></tr>`);
  }
  rows.push(
    `<tr><td style="padding:10px 0 0;font-weight:bold;font-size:16px;color:#3b2f24;border-top:1px solid #e7dcc9;">Grand Total</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;font-size:16px;color:#3b2f24;border-top:1px solid #e7dcc9;">${formatINR(data.grandTotal)}</td></tr>`,
  );
  return rows.join("");
}

function invoiceHtml(data: InvoiceData, audience: "customer" | "admin"): string {
  const date = formatIST(data.invoiceDate);
  const intro =
    audience === "customer"
      ? `<p style="color:#3b2f24;font-size:15px;margin:22px 0 4px;">Hi ${esc(data.customerName || "there")},</p>
         <p style="color:#5c4f40;font-size:14px;margin:0 0 18px;">
           Thank you for your order <b>#${data.orderId}</b>. Your payment is confirmed — the full tax invoice is attached as a PDF. Here's a quick summary:
         </p>`
      : `<p style="color:#3b2f24;font-size:15px;margin:22px 0 4px;">New paid order received.</p>
         <p style="color:#5c4f40;font-size:14px;margin:0 0 18px;">
           <b>${esc(data.customerName)}</b> · ${esc(data.mobile)} · Payment: ${esc(data.paymentMode)}
         </p>`;
  return `<!doctype html>
  <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fbf7f0;padding:28px;border-radius:16px;">
    <div style="text-align:center;">
      <h1 style="margin:0;color:#3b2f24;font-size:22px;">${esc(data.seller.name)}</h1>
      <p style="margin:6px 0 0;color:#b8912f;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;font-size:12px;">Tax Invoice ${esc(data.invoiceNumber)}</p>
      <p style="margin:2px 0 0;color:#8a7a68;font-size:12px;">${date}</p>
    </div>
    ${intro}
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e7dcc9;">
      ${lineRows(data)}
    </table>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #e7dcc9;margin-top:6px;font-size:14px;">
      ${summaryRows(data)}
    </table>
    <p style="color:#5c4f40;font-size:13px;margin:18px 0 0;">
      <b style="color:#3b2f24;">Billing:</b> ${esc(data.billingAddress)}<br>
      <b style="color:#3b2f24;">Shipping:</b> ${esc(data.shippingAddress)}
    </p>
    <p style="color:#8a7a68;font-size:12px;margin:24px 0 0;text-align:center;">
      The full tax invoice PDF is attached to this email.
      ${audience === "customer" ? " Questions? Just reply to this email." : ""}
      — Team ${esc(data.seller.name)}
    </p>
  </div>`;
}

/** Email the tax invoice to the customer, PDF attached. Best-effort — never throws. */
export async function sendInvoiceEmail(
  to: string,
  data: InvoiceData,
  pdf: Buffer,
): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !to) return { sent: false };
  try {
    await getTransport().sendMail({
      from: FROM,
      to,
      subject: `Your ${data.seller.name} invoice — #${data.orderId} (${data.invoiceNumber})`,
      html: invoiceHtml(data, "customer"),
      attachments: [
        { filename: `invoice-${data.invoiceNumber.replace(/\//g, "-")}.pdf`, content: pdf, contentType: "application/pdf" },
      ],
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}

/** Notify the store of a new paid order, PDF attached. Best-effort — never throws. */
export async function sendAdminOrderNotification(data: InvoiceData, pdf: Buffer): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !ADMIN_INBOX) return { sent: false };
  try {
    await getTransport().sendMail({
      from: FROM,
      to: ADMIN_INBOX,
      subject: `New order #${data.orderId} — ${formatINR(data.grandTotal)} (${data.invoiceNumber})`,
      html: invoiceHtml(data, "admin"),
      attachments: [
        { filename: `invoice-${data.invoiceNumber.replace(/\//g, "-")}.pdf`, content: pdf, contentType: "application/pdf" },
      ],
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
        <p style="font-size:22px;font-weight:bold;color:#b8912f;margin:0 0 14px;">${esc(statusText)}</p>
        <p style="color:#8a7a68;font-size:13px;margin:0;">Track it anytime at <a href="${SITE_URL}/track" style="color:#b8912f;">${SITE_URL}/track</a></p>
      </div>`,
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nuts-and-more.store";

/** Notify the store team of a new contact / bulk enquiry. */
export async function sendEnquiryNotification(e: {
  type: "contact" | "bulk" | "return" | "gifting";
  fields: Record<string, string | undefined>;
}): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !ADMIN_INBOX) return { sent: false };
  const rows = Object.entries(e.fields)
    .filter(([, v]) => v && String(v).trim())
    .map(
      ([k, v]) =>
        `<tr><td style="padding:5px 12px 5px 0;color:#8a7a68;font-size:13px;text-transform:capitalize;white-space:nowrap;vertical-align:top;">${k.replace(/_/g, " ")}</td><td style="padding:5px 0;color:#3b2f24;font-size:13px;">${esc(String(v))}</td></tr>`,
    )
    .join("");
  const title =
    e.type === "bulk"
      ? "New Bulk Order Enquiry"
      : e.type === "gifting"
        ? "New Corporate Gifting Enquiry"
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

/**
 * Account emails (confirm your address / reset your password).
 *
 * Sent through the store's own SMTP rather than Supabase's built-in mailer,
 * which is rate limited to a handful of messages an hour — a new customer who
 * never receives their confirmation link simply cannot buy anything. The link
 * itself is still minted by Supabase, so the token and its expiry are
 * unchanged; only delivery moves.
 */
export async function sendAuthLinkEmail(
  to: string,
  kind: "confirm" | "reset",
  link: string,
  name?: string,
): Promise<{ sent: boolean }> {
  if (!isMailerConfigured()) return { sent: false };

  const confirming = kind === "confirm";
  const subject = confirming
    ? "Confirm your email — Nuts & More"
    : "Reset your password — Nuts & More";
  const heading = confirming ? "Confirm your email" : "Reset your password";
  const intro = confirming
    ? "Thanks for creating an account. Tap the button below to confirm your email address and activate it."
    : "We received a request to reset your password. Tap the button below to choose a new one.";
  const cta = confirming ? "Confirm my email" : "Set a new password";
  const note = confirming
    ? "If you didn't create this account, you can safely ignore this email."
    : "If you didn't request this, you can safely ignore this email — your password stays unchanged.";

  try {
    await getTransport().sendMail({
      from: FROM,
      to,
      subject,
      html: `<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fbf7f0;padding:28px;border-radius:16px;">
        <div style="text-align:center;">
          <h1 style="margin:0;color:#3b2f24;font-size:22px;">Nuts &amp; More</h1>
          <p style="margin:6px 0 0;color:#b8912f;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;font-size:12px;">${esc(heading)}</p>
        </div>
        <p style="color:#3b2f24;font-size:15px;margin:22px 0 4px;">Hi ${esc(name || "there")},</p>
        <p style="color:#5c4f40;font-size:14px;margin:0 0 22px;">${esc(intro)}</p>
        <div style="text-align:center;margin:0 0 22px;">
          <a href="${esc(link)}" style="display:inline-block;background:#b8912f;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:13px 26px;border-radius:999px;">${esc(cta)}</a>
        </div>
        <p style="color:#8a7a68;font-size:12px;margin:0 0 6px;">Or paste this link into your browser:</p>
        <p style="word-break:break-all;font-size:11px;color:#8a7a68;margin:0 0 20px;">${esc(link)}</p>
        <p style="color:#8a7a68;font-size:12px;border-top:1px solid #e7dcc9;padding-top:14px;margin:0;">${esc(note)}</p>
      </div>`,
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}

/**
 * Fires when a customer paid but the refund call failed — they are out of
 * pocket for goods that cannot ship and no automated path will fix it. Sent
 * to the store inbox so someone refunds it by hand from the Razorpay
 * dashboard; a console error alone would go unread.
 */
export async function sendRefundFailureAlert(d: {
  paymentId: string;
  amountPaise: number;
  email: string;
  reason: string;
}): Promise<{ sent: boolean }> {
  if (!isMailerConfigured() || !ADMIN_INBOX) return { sent: false };
  const amount = formatINR(Math.round(d.amountPaise / 100));
  try {
    await getTransport().sendMail({
      from: FROM,
      to: ADMIN_INBOX,
      subject: `URGENT: refund failed — ${amount} owed to ${d.email}`,
      html: `<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;padding:24px;background:#fff5f5;border:2px solid #dc2626;border-radius:14px;">
        <h2 style="color:#dc2626;margin:0 0 4px;">Manual refund required</h2>
        <p style="color:#7f1d1d;font-size:14px;margin:0 0 16px;">
          A customer was charged but their order could not be fulfilled, and the automatic refund failed.
          Refund this payment by hand in the Razorpay dashboard.
        </p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <tr><td style="padding:6px 12px 6px 0;color:#7f1d1d;">Amount</td><td style="padding:6px 0;color:#3b2f24;"><b>${esc(amount)}</b></td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#7f1d1d;">Payment ID</td><td style="padding:6px 0;color:#3b2f24;font-family:monospace;">${esc(d.paymentId)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#7f1d1d;">Customer</td><td style="padding:6px 0;color:#3b2f24;">${esc(d.email)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#7f1d1d;">Reason</td><td style="padding:6px 0;color:#3b2f24;">${esc(d.reason)}</td></tr>
        </table>
      </div>`,
    });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}
