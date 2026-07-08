"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff, Search, Loader2, Check } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { CATEGORIES, sortVariants, formatINR } from "@/lib/catalog";
import { PlaceholderTile } from "@/components/products/placeholder-tile";
import { setStockAction, deleteProductAction, toggleHiddenAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function InventoryTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pending, startTransition] = useTransition();
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.slug.includes(q);
    });
  }, [products, query, category]);

  const saveStock = (id: string, weight: string, value: string, original: number) => {
    const stock = Math.max(0, Math.round(Number(value) || 0));
    if (stock === original) return;
    const key = `${id}:${weight}`;
    startTransition(async () => {
      await setStockAction(id, weight, stock);
      setSavedKey(key);
      router.refresh();
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1500);
    });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteProductAction(id);
      router.refresh();
      setBusyId(null);
    });
  };

  const toggleHidden = (id: string, hidden: boolean) => {
    setBusyId(id);
    startTransition(async () => {
      await toggleHiddenAction(id, !hidden);
      router.refresh();
      setBusyId(null);
    });
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-full border border-line bg-card pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-full border border-line bg-card px-4 text-sm font-medium focus:border-gold focus:outline-none"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
        {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />}
      </p>

      {/* Rows */}
      <div className="mt-4 space-y-3">
        {filtered.map((p) => {
          const variants = sortVariants(p.variants);
          const outOfStock = variants.every((v) => v.stock <= 0);
          return (
            <div
              key={p.id}
              className={cn(
                "rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-soft)]",
                p.hidden && "opacity-60",
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* identity */}
                <div className="flex flex-1 items-start gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-2">
                    {p.image ? (
                      <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <PlaceholderTile name={p.name} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-heading font-bold text-foreground">{p.name}</p>
                      {p.badge && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-gold-deep">
                          {p.badge}
                        </span>
                      )}
                      {p.hidden && (
                        <span className="rounded-full bg-line px-2 py-0.5 text-[0.65rem] font-bold uppercase text-muted-foreground">
                          Hidden
                        </span>
                      )}
                      {outOfStock && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-red-700">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <p className="text-xs capitalize text-muted-foreground">
                      {CATEGORIES.find((c) => c.slug === p.category)?.name ?? p.category}
                      {" · "}
                      {p.slug}
                    </p>
                  </div>
                </div>

                {/* actions */}
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-foreground hover:border-gold hover:text-gold-deep"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleHidden(p.id, !!p.hidden)}
                    disabled={busyId === p.id}
                    title={p.hidden ? "Show on site" : "Hide from site"}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted-foreground hover:border-gold hover:text-gold-deep disabled:opacity-50"
                  >
                    {p.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => remove(p.id, p.name)}
                    disabled={busyId === p.id}
                    title="Delete product"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-red-600 hover:border-red-400 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* variants / stock */}
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                {variants.map((v) => {
                  const key = `${p.id}:${v.weight}`;
                  return (
                    <div
                      key={v.weight}
                      className="flex items-center gap-2 rounded-xl bg-cream px-3 py-1.5"
                    >
                      <span className="text-sm font-semibold text-foreground">{v.weight}</span>
                      <span className="text-xs text-muted-foreground">{formatINR(v.price)}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <label className="flex items-center gap-1 text-xs text-muted-foreground">
                        stock
                        <input
                          type="number"
                          min={0}
                          defaultValue={v.stock}
                          onBlur={(e) => saveStock(p.id, v.weight, e.target.value, v.stock)}
                          className={cn(
                            "w-16 rounded-md border bg-card px-2 py-1 text-sm font-semibold text-foreground focus:outline-none",
                            v.stock <= 0
                              ? "border-red-300"
                              : v.stock <= 5
                                ? "border-amber-300"
                                : "border-line focus:border-gold",
                          )}
                        />
                      </label>
                      {savedKey === key && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-card py-16 text-center text-muted-foreground">
            No products match.
          </p>
        )}
      </div>
    </div>
  );
}
