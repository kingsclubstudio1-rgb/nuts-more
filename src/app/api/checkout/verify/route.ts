import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/user";
import { decrementStock, getProductById } from "@/lib/cms";
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

  const payment = await fetchRazorpayPayment(razorpay_payment_id);

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

    await decrementStock(lineItems.map((i) => ({ id: i.id, weight: i.weight, qty: i.qty })));

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
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save order." },
      { status: 500 },
    );
  }
}
