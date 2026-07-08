"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";
import type { Category } from "@/lib/catalog";
import { ImageInput } from "./image-input";
import { saveCategoryAction, deleteCategoryAction } from "@/app/admin/actions";

type Row = Omit<Category, "slug"> & { slug: string; isNew?: boolean; _key: string };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function CategoriesEditor({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(categories.map((c) => ({ ...c, _key: c.slug })));
  const [pending, startTransition] = useTransition();
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r._key === key ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { _key: `new-${Date.now()}`, isNew: true, slug: "", name: "", tagline: "", description: "", image: "" },
    ]);

  const save = (row: Row) => {
    setError(null);
    const slug = row.slug.trim() || slugify(row.name);
    if (!slug || !row.name.trim()) {
      setError("Each category needs a name.");
      return;
    }
    startTransition(async () => {
      const res = await saveCategoryAction({
        slug: slug as Category["slug"],
        name: row.name.trim(),
        tagline: row.tagline,
        description: row.description,
        image: row.image,
      });
      if (res.ok) {
        setSavedKey(row._key);
        router.refresh();
        setTimeout(() => setSavedKey((k) => (k === row._key ? null : k)), 1500);
      } else {
        setError(res.error ?? "Could not save.");
      }
    });
  };

  const remove = (row: Row) => {
    if (row.isNew) {
      setRows((prev) => prev.filter((r) => r._key !== row._key));
      return;
    }
    if (!confirm(`Remove the "${row.name}" category? Products in it stay but lose this category.`)) return;
    startTransition(async () => {
      await deleteCategoryAction(row.slug);
      router.refresh();
      setRows((prev) => prev.filter((r) => r._key !== row._key));
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit or remove collections. Changes appear across the site.
          </p>
        </div>
        <button
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft"
        >
          <Plus className="h-4.5 w-4.5" /> Add category
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row._key} className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="grid grid-cols-[1fr_7rem] gap-4">
              <div className="space-y-2.5">
                <input
                  value={row.name}
                  onChange={(e) => update(row._key, { name: e.target.value })}
                  placeholder="Category name"
                  className="h-10 w-full rounded-lg border border-line bg-cream px-3 text-sm font-semibold focus:border-gold focus:outline-none"
                />
                <input
                  value={row.slug}
                  onChange={(e) => update(row._key, { slug: e.target.value })}
                  disabled={!row.isNew}
                  placeholder="slug (auto)"
                  className="h-9 w-full rounded-lg border border-line bg-cream px-3 text-xs text-muted-foreground focus:border-gold focus:outline-none disabled:opacity-60"
                />
                <input
                  value={row.tagline}
                  onChange={(e) => update(row._key, { tagline: e.target.value })}
                  placeholder="Tagline"
                  className="h-9 w-full rounded-lg border border-line bg-cream px-3 text-xs focus:border-gold focus:outline-none"
                />
              </div>
              <ImageInput value={row.image} onChange={(v) => update(row._key, { image: v })} aspect="aspect-square" />
            </div>
            <textarea
              value={row.description}
              onChange={(e) => update(row._key, { description: e.target.value })}
              rows={2}
              placeholder="Short description"
              className="mt-2.5 w-full rounded-lg border border-line bg-cream px-3 py-2 text-xs focus:border-gold focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => save(row)}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-2 text-xs font-bold text-on-dark hover:bg-ink disabled:opacity-60"
              >
                {savedKey === row._key ? <Check className="h-3.5 w-3.5 text-gold" /> : <Save className="h-3.5 w-3.5" />}
                {savedKey === row._key ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => remove(row)}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
              {pending && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
