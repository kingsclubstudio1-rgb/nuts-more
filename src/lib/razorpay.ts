import crypto from "node:crypto";

// Public key id is exposed to the browser (needed to open Razorpay checkout).
export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
// Secret stays server-only.
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export function isRazorpayConfigured(): boolean {
  return Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}

export class RazorpayApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "RazorpayApiError";
  }
}

/** Create a Razorpay order. amount is in paise (₹1 = 100, minimum 100). */
export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    throw new RazorpayApiError("Order amount must be at least ₹1 (100 paise).", 400);
  }
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });
  if (!res.ok) {
    const body = await res.text();
    // Razorpay returns 401 for bad/missing key id+secret — surface that distinctly
    // from other API errors so the route can respond with the right status code.
    throw new RazorpayApiError(`Razorpay order creation failed: ${body}`, res.status === 401 ? 401 : 500);
  }
  return (await res.json()) as { id: string; amount: number; currency: string };
}

export type RazorpayPayment = {
  method: string;
  /** Paise actually captured by Razorpay. */
  amount: number;
  /** The Razorpay order this payment belongs to. */
  orderId: string;
  status: string;
};

/**
 * Look up a payment server-side. This is the authoritative record of what the
 * customer actually paid — the signature only proves Razorpay issued the
 * order/payment pair, it says nothing about the amount or the basket, so the
 * caller must compare `amount` and `orderId` against its own totals before
 * trusting a "paid" claim.
 *
 * Returns null on any network/API failure so the caller can decide; it must
 * never be treated as a successful verification.
 */
export async function fetchRazorpayPayment(
  paymentId: string,
): Promise<RazorpayPayment | null> {
  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      method?: string;
      amount?: number;
      order_id?: string;
      status?: string;
    };
    return {
      method: data.method ?? "",
      amount: Number(data.amount ?? 0),
      orderId: String(data.order_id ?? ""),
      status: String(data.status ?? ""),
    };
  } catch {
    return null;
  }
}

/**
 * Refund a captured payment, in full unless `amountPaise` is given.
 *
 * Needed because checkout can only reserve stock after Razorpay has already
 * taken the money: if the last unit sells during payment, the customer has
 * paid for something that cannot ship. Without this the money is simply kept.
 *
 * Returns the refund id on success, or null — the caller must surface a
 * failure loudly rather than assume the customer has been made whole.
 */
export async function refundRazorpayPayment(
  paymentId: string,
  amountPaise?: number,
): Promise<{ id: string } | null> {
  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(amountPaise ? { amount: amountPaise } : {}),
        speed: "normal",
        notes: { reason: "Out of stock at checkout" },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ? { id: data.id } : null;
  } catch {
    return null;
  }
}

/** Verify the payment signature returned by Razorpay checkout. */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
