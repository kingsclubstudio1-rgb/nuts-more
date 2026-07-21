"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/section";
import { useCart, discountFor } from "@/components/cart/cart-context";
import { formatINR } from "@/lib/catalog";
import { shippingCharge, isBangaloreUrban } from "@/lib/shipping";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutClient({
  email,
  name,
  phone,
  razorpayReady,
}: {
  email: string;
  name: string;
  phone: string;
  razorpayReady: boolean;
}) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({
    name: name || "",
    phone: phone || "",
    line1: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const discount = discountFor(subtotal);
  const discountAmt = Math.round(subtotal * discount.rate);
  const shipping = useMemo(
    () => shippingCharge(subtotal, form.city, form.pincode),
    [subtotal, form.city, form.pincode],
  );
  const total = subtotal - discountAmt + shipping;
  const zone =
    form.city || form.pincode
      ? isBangaloreUrban(form.city, form.pincode)
        ? "Bangalore Urban"
        : "Outside Bangalore Urban"
      : "";

  const field =
    "h-12 w-full rounded-xl border border-line bg-card px-4 text-sm text-body focus:border-gold focus:outline-none";

  const valid =
    form.name.trim() &&
    form.phone.replace(/\D/g, "").length >= 10 &&
    form.line1.trim() &&
    form.city.trim() &&
    /^\d{6}$/.test(form.pincode.trim());

  const pay = async () => {
    setError(null);
    if (!valid) {
      setError("Please fill in your name, mobile, address, city and a valid 6-digit pincode.");
      return;
    }
    if (!razorpayReady) {
      setError("Online payment is being activated. Please try again shortly.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, weight: i.weight, qty: i.qty })),
          city: form.city,
          pincode: form.pincode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment.");

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Could not load the payment window. Please retry.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: "INR",
        name: "Nuts & More",
        description: "Order payment",
        prefill: { name: form.name, email, contact: form.phone },
        theme: { color: "#c9a24a" },
        handler: async (resp: Record<string, string>) => {
          const vr = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              items: data.items,
              address: form,
            }),
          });
          const vd = await vr.json();
          if (vd.ok) {
            clear();
            router.push("/account?order=success");
          } else {
            setError(vd.error || "Payment verification failed. If money was deducted, contact us.");
          }
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-cream py-20">
        <Container className="text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Your cart is empty</h1>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-gold-soft"
          >
            Start shopping
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-cream py-12 sm:py-16">
      <Container>
        <h1 className="font-heading text-3xl font-bold text-foreground">Checkout</h1>

        {!razorpayReady && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Online payment is being activated (Razorpay keys pending). You can review your order below;
            the “Pay” button turns on as soon as payment is connected.
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Delivery address */}
          <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-heading text-xl font-bold text-foreground">Delivery address</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" className={field} />
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Mobile number" inputMode="tel" className={field} />
              <input value={form.line1} onChange={(e) => set("line1", e.target.value)} placeholder="Flat / house no, street, area" className={`${field} sm:col-span-2`} />
              <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className={field} />
              <input value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Pincode" inputMode="numeric" className={field} />
              <input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="State" className={`${field} sm:col-span-2`} />
            </div>
            {zone && (
              <p className="mt-3 text-xs text-muted-foreground">
                Delivery zone detected: <span className="font-semibold text-foreground">{zone}</span>
              </p>
            )}
          </div>

          {/* Order summary */}
          <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-heading text-xl font-bold text-foreground">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.id + i.weight} className="flex justify-between text-body">
                  <span className="pr-2">
                    {i.name} <span className="text-muted-foreground">({i.weight}) ×{i.qty}</span>
                  </span>
                  <span className="tabular-nums">{formatINR(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-body">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-gold-deep">
                  <span>Offer · {Math.round(discount.rate * 100)}% off</span>
                  <span className="tabular-nums">-{formatINR(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-body">
                <span>Shipping</span>
                <span className="tabular-nums">{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-foreground">
                <span>Total</span>
                <span className="tabular-nums">{formatINR(total)}</span>
              </div>
              {!form.city && !form.pincode && (
                <p className="pt-1 text-xs text-muted-foreground">
                  Enter your city &amp; pincode to calculate shipping.
                </p>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              onClick={pay}
              disabled={loading || !razorpayReady}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4.5 w-4.5" />}
              {razorpayReady ? `Pay ${formatINR(total)}` : "Payment coming soon"}
            </button>
            <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
              Secure payment via UPI, cards, net banking &amp; wallets.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
