"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";

const TABS = [{ slug: "all", name: "All" }, ...CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }))];

export function ProductExplorer({ initial = "all" }: { initial?: string }) {
  const [active, setActive] = useState(initial);

  const list = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => setActive(t.slug)}
            aria-pressed={active === t.slug}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              active === t.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground/80 hover:border-primary/40 hover:text-primary"
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
        Showing {list.length} {list.length === 1 ? "product" : "products"}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
