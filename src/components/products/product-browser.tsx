"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Product, CategorySlug, Category } from "@/lib/catalog";
import { CATEGORIES, lowestPrice } from "@/lib/catalog";
import { ProductCard } from "./product-card";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export function ProductBrowser({
  products,
  categories = CATEGORIES,
  initialQuery = "",
  initialCategory = "all",
}: {
  products: Product[];
  categories?: Category[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        (p.hindiName ?? "").toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return lowestPrice(a) - lowestPrice(b);
        case "price-desc":
          return lowestPrice(b) - lowestPrice(a);
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return Number(b.featured ?? false) - Number(a.featured ?? false);
      }
    });
    return list;
  }, [products, query, category, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="h-11 w-full rounded-full border border-line bg-card pl-10 pr-4 text-sm text-body shadow-[var(--shadow-soft)] focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-card px-3.5 shadow-[var(--shadow-soft)]">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort products"
              className="h-11 bg-transparent text-sm font-medium text-body focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        {/* Category chips */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug as CategorySlug)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
        {category !== "all" && <> in {categories.find((c) => c.slug === category)?.name}</>}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-card py-16 text-center">
          <p className="font-heading text-lg font-bold text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
        (active
          ? "border-gold bg-espresso text-on-dark"
          : "border-line bg-card text-body hover:border-gold/50 hover:text-gold-deep")
      }
    >
      {children}
    </button>
  );
}
