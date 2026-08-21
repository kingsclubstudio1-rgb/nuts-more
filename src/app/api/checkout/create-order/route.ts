import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { getProductById } from "@/lib/cms";
import { discountRate } from "@/lib/pricing";
import { shippingCharge } from "@/lib/shipping";
import { createRazorpayOrder, isRazorpayConfigured, RazorpayApiError, RAZORPAY_KEY_ID } from "@/lib/razorpay";

export const runtime = "nodejs";

type InItem = { id: string; weight: string; qty: number };

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Online payment isn't set up yet. Please add Razorpay keys." },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const items: InItem[] = Array.isArray(body.items) ? body.items : [];
  const city = String(body.city ?? "");
  const pincode = String(body.pincode ?? "");

  // Recompute prices server-side from the DB (never trust client prices).
  let subtotal = 0;
  const lineItems: { id: string; name: string; weight: string; price: number; qty: number }[] = [];
  // Checked before payment so a customer isn't charged for goods that cannot
  // ship. Stock is still reserved atomically after payment (someone else may
  // buy the last unit in between) — this just keeps that refund path rare.
  const shortfalls: string[] = [];
  for (const it of items) {
    const p = await getProductById(it.id);
    const v = p?.variants.find((x) => x.weight === it.weight);
    if (!p || !v) continue;
    const qty = Math.max(1, Math.floor(it.qty || 1));
    if (v.stock <= 0) {
      shortfalls.push(`${p.name} (${v.weight}) is sold out`);
      continue;
    }
    if (v.stock < qty) {
      shortfalls.push(`${p.name} (${v.weight}) — only ${v.stock} left`);
      continue;
    }
    subtotal += v.price * qty;
    lineItems.push({ id: p.id, name: p.name, weight: v.weight, price: v.price, qty });
  }
  if (shortfalls.length) {
    return NextResponse.json(
      { error: `Please update your cart: ${shortfalls.join(", ")}.`, outOfStock: shortfalls },
      { status: 409 },
    );
  }
  if (!lineItems.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  const discount = Math.round(subtotal * discountRate(subtotal));
  const shipping = shippingCharge(subtotal, city, pincode);
  const total = subtotal - discount + shipping;

  try {
    const order = await createRazorpayOrder(total * 100, `nm_${user.id.slice(0, 8)}_${Date.now()}`);
    return NextResponse.json({
      razorpayOrderId: order.id,
      amount: total * 100,
      keyId: RAZORPAY_KEY_ID,
      items: lineItems,
      breakdown: { subtotal, discount, shipping, total },
    });
  } catch (e) {
    const status = e instanceof RazorpayApiError ? e.status : 500;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not start payment." },
      { status },
    );
  }
}
