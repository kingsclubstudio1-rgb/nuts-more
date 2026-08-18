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
