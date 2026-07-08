"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, MessageCircle, Check } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { sortVariants, defaultVariant, formatINR } from "@/lib/catalog";
import { useCart } from "@/components/cart/cart-context";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { placeOrderAction } from "@/app/actions";

export function BuyBox({ product }: { product: Product }) {
  const { add, open } = useCart();
  const variants = sortVariants(product.variants);
  const [weight, setWeight] = useState(defaultVariant(product)?.weight ?? variants[0]?.weight);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.weight === weight) ?? variants[0];
  const soldOut = !variant || variant.stock <= 0;
  const lowStock = variant && variant.stock > 0 && variant.stock <= 5;

  const handleAdd = () => {
    if (!variant || soldOut) return;
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        weight: variant.weight,
        price: variant.price,
        image: product.image,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const orderWhatsApp = async () => {
    if (!variant || soldOut) return;
    const msg = `Hello Nuts & More! I'd like to order ${qty} × ${product.name} (${variant.weight}) — ${formatINR(
      variant.price * qty,
    )}.`;
    const phone = SITE.phoneHref.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    try {
      await placeOrderAction({
        items: [
          { id: product.id, name: product.name, weight: variant.weight, qty, price: variant.price },
        ],
        subtotal: variant.price * qty,
        discount: 0,
        total: variant.price * qty,
      });
    } catch {
      /* non-blocking */
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold text-foreground">
          {formatINR(variant?.price ?? 0)}
        </span>
        <span className="text-sm text-muted-foreground">/ {variant?.weight}</span>
      </div>

      {/* Stock */}
      <p
        className={cn(
          "mt-1 text-sm font-medium",
          soldOut ? "text-destructive" : lowStock ? "text-amber-600" : "text-emerald-700",
        )}
      >
        {soldOut ? "Out of stock" : lowStock ? `Only ${variant.stock} left in stock` : "In stock"}
      </p>

      {/* Weight selector */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Weight
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {variants.map((v) => {
            const out = v.stock <= 0;
            return (
              <button
                key={v.weight}
                onClick={() => setWeight(v.weight)}
                disabled={out}
                className={cn(
                  "rounded-xl border px-3.5 py-2 text-left transition-colors",
                  v.weight === weight
                    ? "border-gold bg-gold/10"
                    : "border-line bg-cream hover:border-gold/50",
                  out && "cursor-not-allowed opacity-40",
                )}
              >
                <span className="block text-sm font-bold text-foreground">{v.weight}</span>
                <span className="block text-xs text-muted-foreground">{formatINR(v.price)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Qty + actions */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-line bg-cream">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-2"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-2"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={soldOut}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors",
            soldOut
              ? "cursor-not-allowed bg-line text-muted-foreground"
              : "bg-gold text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft",
          )}
        >
          {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>

      <div className="mt-3 flex gap-3">
        <button
          onClick={() => {
            handleAdd();
            open();
          }}
          disabled={soldOut}
          className="flex-1 rounded-full border border-espresso/20 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-40"
        >
          Buy now
        </button>
        <button
          onClick={orderWhatsApp}
          disabled={soldOut}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-emerald-600/40 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-40"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
