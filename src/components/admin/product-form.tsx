"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, Loader2, ImageIcon, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import type { Product, CategorySlug, Category } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/catalog";
import { saveProductAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type VariantRow = { weight: string; price: string; stock: string };
type NutritionRow = { label: string; value: string };

const WEIGHT_SUGGESTIONS = ["1000g", "500g", "250g", "200g", "100g", "50g", "Assorted"];
const BADGES = ["", "Bestseller", "New", "Limited"] as const;

export function ProductForm({
  product,
  categories = CATEGORIES,
}: {
  product?: Product;
  categories?: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<CategorySlug>(product?.category ?? "nuts");
  const [hindiName, setHindiName] = useState(product?.hindiName ?? "");
  const [blurb, setBlurb] = useState(product?.blurb ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [benefitsText, setBenefitsText] = useState((product?.benefits ?? []).join("\n"));
  const [storage, setStorage] = useState(product?.storage ?? "");
  const [hsn, setHsn] = useState(product?.hsn ?? "");
  const [nutrition, setNutrition] = useState<NutritionRow[]>(product?.nutrition ?? []);
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [hidden, setHidden] = useState(product?.hidden ?? false);
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : product?.image ? [product.image] : [],
  );
  const [urlInput, setUrlInput] = useState("");
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((v) => ({
      weight: v.weight,
      price: String(v.price),
      stock: String(v.stock),
    })) ?? [{ weight: "500g", price: "", stock: "" }],
  );

  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const setVariant = (i: number, patch: Partial<VariantRow>) =>
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const addVariant = () => setVariants((prev) => [...prev, { weight: "", price: "", stock: "" }]);
  const removeVariant = (i: number) => setVariants((prev) => prev.filter((_, idx) => idx !== i));

  const setNut = (i: number, patch: Partial<NutritionRow>) =>
    setNutrition((prev) => prev.map((n, idx) => (idx === i ? { ...n, ...patch } : n)));
  const addNut = () => setNutrition((prev) => [...prev, { label: "", value: "" }]);
  const removeNut = (i: number) => setNutrition((prev) => prev.filter((_, idx) => idx !== i));

  const addImage = (src: string) => {
    const s = src.trim();
    if (s) setImages((prev) => (prev.includes(s) ? prev : [...prev, s]));
  };
  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const makePrimary = (i: number) =>
    setImages((prev) => [prev[i], ...prev.filter((_, idx) => idx !== i)]);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      addImage(data.path);
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message}. You can paste an image URL instead.`
          : "Upload failed. Paste an image URL instead.",
      );
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    setError(null);
    const input = {
      id: product?.id,
      name: name.trim(),
      category,
      hindiName: hindiName.trim() || undefined,
      blurb: blurb.trim(),
      description: description.trim() || undefined,
      benefits: benefitsText.split("\n").map((s) => s.trim()).filter(Boolean),
      nutrition: nutrition
        .map((n) => ({ label: n.label.trim(), value: n.value.trim() }))
        .filter((n) => n.label && n.value),
      storage: storage.trim() || undefined,
      hsn: hsn.trim() || undefined,
      badge: (badge || undefined) as Product["badge"],
      featured,
      hidden,
      image: images[0] || undefined,
      images,
      rating: product?.rating ?? 4.7,
      reviews: product?.reviews ?? 0,
      variants: variants.map((v) => ({
        weight: v.weight.trim(),
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
      })),
    };
    startTransition(async () => {
      const res = await saveProductAction(input);
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error ?? "Could not save.");
      }
    });
  };

  const field =
    "h-11 w-full rounded-xl border border-line bg-card px-3.5 text-sm focus:border-gold focus:outline-none";
  const IMG_LABELS = ["Front pack", "Back pack", "Extra"];

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-gold-deep"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>
      <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
        {product ? "Edit product" : "Add product"}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Main fields */}
        <div className="space-y-5 rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Product name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="California Almonds" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Category *</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)} className={field}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Local / other name <span className="text-muted-foreground">(optional)</span>
            </span>
            <input value={hindiName} onChange={(e) => setHindiName(e.target.value)} className={field} placeholder="बादाम / Badam" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Short blurb</span>
            <input value={blurb} onChange={(e) => setBlurb(e.target.value)} className={field} placeholder="Crunchy, sweet and skin-on for maximum fibre." />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Full description <span className="text-muted-foreground">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
              placeholder="Long-form description shown on the product page…"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Key benefits <span className="text-muted-foreground">(one per line)</span>
            </span>
            <textarea
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
              placeholder={"Good for heart health\nRich in Vitamin E"}
            />
          </label>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Weights, price &amp; stock *</span>
              <button type="button" onClick={addVariant} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-gold hover:text-gold-deep">
                <Plus className="h-3.5 w-3.5" /> Add weight
              </button>
            </div>
            <datalist id="weights">
              {WEIGHT_SUGGESTIONS.map((w) => (
                <option key={w} value={w} />
              ))}
            </datalist>
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Weight</span>
                <span>Price (₹)</span>
                <span>Stock</span>
                <span />
              </div>
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <input list="weights" value={v.weight} onChange={(e) => setVariant(i, { weight: e.target.value })} placeholder="500g" className="h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none" />
                  <input type="number" min={0} value={v.price} onChange={(e) => setVariant(i, { price: e.target.value })} placeholder="675" className="h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none" />
                  <input type="number" min={0} value={v.stock} onChange={(e) => setVariant(i, { stock: e.target.value })} placeholder="30" className="h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none" />
                  <button type="button" onClick={() => removeVariant(i)} disabled={variants.length === 1} className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-red-600 hover:bg-red-50 disabled:opacity-40" aria-label="Remove weight">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Nutrition <span className="text-muted-foreground">(per 100g)</span>
              </span>
              <button type="button" onClick={addNut} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-foreground hover:border-gold hover:text-gold-deep">
                <Plus className="h-3.5 w-3.5" /> Add row
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {nutrition.map((n, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input value={n.label} onChange={(e) => setNut(i, { label: e.target.value })} placeholder="Protein" className="h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none" />
                  <input value={n.value} onChange={(e) => setNut(i, { value: e.target.value })} placeholder="20 g" className="h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none" />
                  <button type="button" onClick={() => removeNut(i)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-red-600 hover:bg-red-50" aria-label="Remove row">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {nutrition.length === 0 && (
                <p className="text-xs text-muted-foreground">No nutrition rows yet — add energy, protein, fat, etc.</p>
              )}
            </div>
          </div>

          {/* Storage */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Storage instructions</span>
            <textarea
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
              placeholder="Store in a cool, dry place in an airtight container…"
            />
          </label>

          {/* HSN */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">HSN code (for GST invoices)</span>
            <input
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm font-mono focus:border-gold focus:outline-none"
              placeholder="e.g. 08013200"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Optional — shown on tax invoices when set. Leave blank if unsure.
            </span>
          </label>
        </div>

        {/* Sidebar: images + flags */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
            <span className="mb-1 block text-sm font-medium text-foreground">Images</span>
            <p className="mb-3 text-xs text-muted-foreground">First image is the front pack (primary).</p>

            {images.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={img + i} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-cream-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <span className="absolute left-1 top-1 rounded bg-ink/70 px-1 text-[0.6rem] font-semibold text-on-dark">
                      {IMG_LABELS[i] ?? `#${i + 1}`}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {i !== 0 && (
                        <button type="button" onClick={() => makePrimary(i)} title="Make front" className="text-gold">
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(i)} title="Remove" className="ml-auto text-red-300">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-2.5 text-sm font-semibold text-gold-deep hover:bg-gold/8 disabled:opacity-60">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <div className="mt-2 flex gap-2">
              <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="…or paste URL / /img/103.jpg" className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 text-xs focus:border-gold focus:outline-none" />
              <button type="button" onClick={() => { addImage(urlInput); setUrlInput(""); }} className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-foreground hover:border-gold" aria-label="Add image URL">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {images.length === 0 && (
              <div className="mt-3 flex aspect-video items-center justify-center rounded-lg border border-dashed border-line text-muted-foreground">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Badge</span>
              <select value={badge} onChange={(e) => setBadge(e.target.value)} className={field}>
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>
                    {b || "None"}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[var(--gold)]" />
              Featured (home best-sellers)
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="h-4 w-4 accent-[var(--gold)]" />
              Hidden (don&apos;t show on site)
            </label>
          </div>
        </div>
      </div>

      {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={submit}
          disabled={pending}
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft disabled:opacity-70",
          )}
        >
          {pending && <Loader2 className="h-5 w-5 animate-spin" />}
          {product ? "Save changes" : "Create product"}
        </button>
        <Link href="/admin" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground hover:bg-cream-2">
          Cancel
        </Link>
      </div>
    </div>
  );
}
