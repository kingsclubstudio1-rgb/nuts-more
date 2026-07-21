"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, itemKey, discountFor } from "./cart-context";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { PlaceholderTile } from "@/components/products/placeholder-tile";

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, close, setQty, remove, subtotal, count, clear } = useCart();
  const discount = discountFor(subtotal);
  const total = Math.round(subtotal * (1 - discount.rate));

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const proceedToCheckout = () => {
    close();
    router.push("/checkout");
  };
  const continueShopping = () => {
    close();
    router.push("/products");
  };

  return (
    <>
      {/* overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden
      />
      {/* panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-espresso text-on-dark shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-on-dark">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your Cart
            <span className="text-muted-on-dark">({count})</span>
          </h2>
          <button
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-dark hover:bg-white/10"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
              <ShoppingBag className="h-7 w-7 text-gold" />
            </div>
            <p className="text-muted-on-dark">Your cart is empty.</p>
            <button
              onClick={close}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-gold-soft"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((i) => {
                  const key = itemKey(i.id, i.weight);
                  return (
                    <li key={key} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                        {i.image ? (
                          <Image
                            src={i.image}
                            alt={i.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <PlaceholderTile name={i.name} />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold leading-tight text-on-dark">
                              {i.name}
                            </p>
                            <p className="text-xs text-muted-on-dark">{i.weight}</p>
                          </div>
                          <button
                            onClick={() => remove(key)}
                            className="text-muted-on-dark hover:text-destructive"
                            aria-label={`Remove ${i.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full bg-white/5 ring-1 ring-white/10">
                            <button
                              onClick={() => setQty(key, i.qty - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                            <button
                              onClick={() => setQty(key, i.qty + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-gold-soft">
                            {formatINR(i.price * i.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={clear}
                className="mt-4 text-xs text-muted-on-dark underline-offset-2 hover:text-on-dark hover:underline"
              >
                Clear cart
              </button>
            </div>

            <footer className="border-t border-white/10 px-5 py-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-on-dark">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {discount.rate > 0 && (
                  <div className="flex justify-between text-gold-soft">
                    <span>Offer · {Math.round(discount.rate * 100)}% off</span>
                    <span>-{formatINR(subtotal - total)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-base font-bold text-on-dark">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
                {discount.rate === 0 && subtotal > 0 && (
                  <p className="pt-1 text-xs text-muted-on-dark">
                    Add {formatINR(999 - subtotal)} more to unlock 10% off.
                  </p>
                )}
              </div>
              <button
                onClick={proceedToCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] transition-colors hover:bg-gold-soft"
              >
                Proceed to Checkout
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={continueShopping}
                className="mt-2 w-full rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-on-dark transition-colors hover:border-gold hover:text-gold"
              >
                Continue Shopping
              </button>
              <p className="mt-2 text-center text-[0.7rem] text-muted-on-dark">
                Shipping is calculated at checkout. Secure online payment.
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
