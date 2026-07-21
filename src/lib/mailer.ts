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
