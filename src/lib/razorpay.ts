import crypto from "node:crypto";

// Public key id is exposed to the browser (needed to open Razorpay checkout).
export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
// Secret stays server-only.
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export function isRazorpayConfigured(): boolean {
  return Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}

/** Create a Razorpay order. amount is in paise (₹1 = 100). */
export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });
  if (!res.ok) throw new Error("Razorpay order creation failed: " + (await res.text()));
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
