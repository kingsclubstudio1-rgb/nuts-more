import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";
import { decrementStock, getProductById } from "@/lib/cms";
import { discountRate } from "@/lib/pricing";
import { shippingCharge } from "@/lib/shipping";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address } = body;

  if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  // Recompute totals server-side (authoritative record).
  let subtotal = 0;
  const lineItems: { id: string; name: string; weight: string; price: number; qty: number }[] = [];
  for (const it of items ?? []) {
    const p = await getProductById(it.id);
    const v = p?.variants.find((x: { weight: string }) => x.weight === it.weight);
    if (!p || !v) continue;
    const qty = Math.max(1, Math.floor(it.qty || 1));
    subtotal += v.price * qty;
    lineItems.push({ id: p.id, name: p.name, weight: v.weight, price: v.price, qty });
  }
  const discount = Math.round(subtotal * discountRate(subtotal));
  const shipping = shippingCharge(subtotal, address?.city ?? "", address?.pincode ?? "");
  const total = subtotal - discount + shipping;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items: lineItems,
        subtotal,
        discount,
        shipping,
        total,
        status: "paid",
        channel: "razorpay",
        address: address ?? null,
        payment_id: razorpay_payment_id,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await decrementStock(lineItems.map((i) => ({ id: i.id, weight: i.weight, qty: i.qty })));

    return NextResponse.json({ ok: true, orderId: data?.id });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save order." },
      { status: 500 },
    );
  }
}
