"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Star, Plus, Check } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { sortVariants, defaultVariant, formatINR } from "@/lib/catalog";
import { useCart } from "@/components/cart/cart-context";
import { PlaceholderTile } from "./placeholder-tile";
import { cn } from "@/lib/utils";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-gold text-primary-foreground",
  New: "bg-emerald-700 text-white",
  Limited: "bg-[#7a2e1e] text-white",
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const variants = useMemo(() => sortVariants(product.variants), [product.variants]);
  const [weight, setWeight] = useState(defaultVariant(product)?.weight ?? variants[0]?.weight);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.weight === weight) ?? variants[0];
  const soldOut = !variant || variant.stock <= 0;
  const href = `/product/${product.slug}`;

  const handleAdd = () => {
    if (!variant || soldOut) return;
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      weight: variant.weight,
      price: variant.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-cream-2">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderTile name={product.name} />
        )}
        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide",
              BADGE_STYLES[product.badge],
            )}
          >
            {product.badge}
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm font-bold uppercase tracking-widest text-on-dark">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <Link href={href} className="block">
          <h3 className="line-clamp-1 font-heading text-[0.98rem] font-bold text-foreground group-hover:text-gold-deep">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="font-semibold text-foreground">
            {product.rating?.toFixed(1) ?? "4.7"}
          </span>
          <span>({product.reviews ?? 0})</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">
              {formatINR(variant?.price ?? 0)}
            </p>
            {variants.length > 1 ? (
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                aria-label="Select weight"
                className="mt-0.5 rounded-md border border-line bg-cream-2 px-1.5 py-0.5 text-xs font-medium text-body focus:border-gold focus:outline-none"
              >
                {variants.map((v) => (
                  <option key={v.weight} value={v.weight} disabled={v.stock <= 0}>
                    {v.weight}
                    {v.stock <= 0 ? " — sold out" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{variant?.weight}</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-all active:scale-95",
              soldOut
                ? "cursor-not-allowed bg-line text-muted-foreground"
                : "bg-espresso hover:bg-gold",
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <Check className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
