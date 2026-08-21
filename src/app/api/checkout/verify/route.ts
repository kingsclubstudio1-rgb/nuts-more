import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";
import { decrementStock, restockItems, getProductById } from "@/lib/cms";
import { discountRate, discountLabel } from "@/lib/pricing";
import { shippingCharge } from "@/lib/shipping";
import { verifyRazorpaySignature, fetchRazorpayPayment } from "@/lib/razorpay";
import { getInvoiceConfig, computeGst, nextInvoiceNumber } from "@/lib/gst";
import { buildInvoiceData } from "@/lib/invoice";
import { renderInvoicePdf } from "@/lib/invoice-pdf";
import { sendInvoiceEmail, sendAdminOrderNotification } from "@/lib/mailer";
import type { AdminOrder } from "@/lib/orders";

export const runtime = "nodejs";
// Background invoice/email work in `after()` still runs on this function's
// clock — give it headroom beyond Vercel's 10s default for slow SMTP + PDF render.
export const maxDuration = 30;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  // One captured payment = one order. Without this, retrying or replaying the
  // same (valid) payload books the order again, takes stock again and sends a
  // second set of invoice emails for a single payment.
  const sbAdminEarly = (await import("@/lib/supabase/admin")).createAdminClient();
  const { data: existing } = await sbAdminEarly
    .from("orders")
    .select("id")
    .eq("payment_id", razorpay_payment_id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: true, orderId: existing.id, duplicate: true });
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
  if (!lineItems.length) {
    return NextResponse.json({ error: "No valid items in this order." }, { status: 400 });
  }

  const discount = Math.round(subtotal * discountRate(subtotal));
  const shipping = shippingCharge(subtotal, address?.city ?? "", address?.pincode ?? "");
  const total = subtotal - discount + shipping;

  // Tax: computed and frozen at the time of sale (rate changes later must
  // never retroactively alter an already-issued invoice). Prices are
  // GST-inclusive, so tax is extracted from `total` — the exact amount
  // charged — keeping taxable + cgst + sgst equal to the grand total.
  const invoiceConfig = await getInvoiceConfig();
  const { taxableAmount, cgst, sgst, igst, gstRate } = computeGst(
    total,
    address?.state,
    invoiceConfig.gstRate,
  );

  // The signature only proves Razorpay issued this order/payment pair — it
  // says nothing about the basket or the amount. Without comparing against the
  // real payment, someone could pay for one cheap item and then replay that
  // valid signature with a basket of expensive ones.
  const payment = await fetchRazorpayPayment(razorpay_payment_id);
  if (!payment) {
    return NextResponse.json(
      { error: "Could not confirm the payment with Razorpay. Please contact support." },
      { status: 502 },
    );
  }
  if (payment.orderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Payment does not match this order." }, { status: 400 });
  }
  if (payment.status !== "captured" && payment.status !== "authorized") {
    return NextResponse.json({ error: "Payment was not completed." }, { status: 400 });
  }
  if (payment.amount !== total * 100) {
    return NextResponse.json(
      { error: "Paid amount does not match the order total." },
      { status: 400 },
    );
  }

  // Reserve stock before booking the order so the last unit can't be sold twice.
  const stock = await decrementStock(
    lineItems.map((i) => ({ id: i.id, weight: i.weight, qty: i.qty })),
  );
  if (!stock.ok) {
    const names = (stock.insufficient ?? [])
      .map((s) => {
        const li = lineItems.find((l) => l.id === s.id && l.weight === s.weight);
        return `${li?.name ?? s.id} (${s.weight}) — only ${s.available} left`;
      })
      .join(", ");
    return NextResponse.json(
      {
        error: names
          ? `Some items sold out while you were paying: ${names}. Your payment will be refunded.`
          : "Could not reserve stock for this order.",
        outOfStock: stock.insufficient ?? [],
      },
      { status: 409 },
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items: lineItems,
        subtotal,
        discount,
        discount_label: discount > 0 ? discountLabel(subtotal) : null,
        shipping,
        total,
        status: "paid",
        channel: "razorpay",
        payment_method: payment?.method || null,
        address: address ?? null,
        payment_id: razorpay_payment_id,
        taxable_amount: taxableAmount,
        cgst,
        sgst,
        igst,
        gst_rate: gstRate,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const orderId = data!.id as string;

    // Invoice numbering, PDF rendering and both emails happen after the response
    // is sent (via `after`) so a slow SMTP server or PDF render can never delay
    // — or, on a serverless function's time limit, truncate — the checkout
    // response for a payment that has already succeeded.
    after(async () => {
      try {
        const invoiceNumber = await nextInvoiceNumber(invoiceConfig.invoicePrefix);
        await supabase.from("orders").update({ invoice_number: invoiceNumber }).eq("id", orderId);

        const { createAdminClient } = await import("@/lib/supabase/admin");
        const sbAdmin = createAdminClient();
        const { data: fullOrder } = await sbAdmin.from("orders").select("*").eq("id", orderId).maybeSingle();
        if (fullOrder) {
          const invoiceData = await buildInvoiceData(fullOrder as AdminOrder);
          const invoicePdf = await renderInvoicePdf(invoiceData);

          await Promise.all([
            user.email ? sendInvoiceEmail(user.email, invoiceData, invoicePdf) : Promise.resolve(),
            sendAdminOrderNotification(invoiceData, invoicePdf),
          ]);
        }
      } catch (e) {
        // Invoice generation/email is best-effort — a paid order must never fail here.
        console.error("post-checkout invoice/email failed for order", orderId, e);
      }
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (e) {
    // Stock was already reserved above; if the order row never landed, give it
    // back rather than leaving phantom stock loss behind.
    await restockItems(lineItems.map((i) => ({ id: i.id, weight: i.weight, qty: i.qty }))).catch(
      () => {},
    );
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save order." },
      { status: 500 },
    );
  }
}
