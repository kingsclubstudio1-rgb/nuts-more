"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";
import type { HeroSlide } from "@/lib/cms";
import { ImageInput } from "./image-input";
import { saveHeroAction, saveSettingAction } from "@/app/admin/actions";

type Circle = { label: string; href: string; image: string };

const inp =
  "h-10 w-full rounded-lg border border-line bg-cream px-3 text-sm focus:border-gold focus:outline-none";

export function ContentEditor({
  hero,
  circles,
}: {
  hero: HeroSlide[];
  circles: Circle[];
}) {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>(hero);
  const [tiles, setTiles] = useState<Circle[]>(circles);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setSlide = (i: number, patch: Partial<HeroSlide>) =>
    setSlides((p) => p.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const setTile = (i: number, patch: Partial<Circle>) =>
    setTiles((p) => p.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const flash = (key: string) => {
    setSaved(key);
    router.refresh();
    setTimeout(() => setSaved((k) => (k === key ? null : k)), 1600);
  };

  const saveHero = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveHeroAction(slides);
      if (res.ok) flash("hero");
      else setError(res.error ?? "Could not save.");
    });
  };
  const saveCircles = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveSettingAction("home_circles", tiles);
      if (res.ok) flash("circles");
      else setError(res.error ?? "Could not save.");
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Landing page content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the hero slides and the "shop by category" tiles shown on the home page.
        </p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* Hero slides */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Hero slides</h2>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setSlides((p) => [...p, { image: "", eyebrow: "", titleTop: "", titleBottom: "", sub: "" }])
              }
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold-deep"
            >
              <Plus className="h-3.5 w-3.5" /> Add slide
            </button>
            <button
              onClick={saveHero}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft disabled:opacity-60"
            >
              {saved === "hero" ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              Save hero
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {slides.map((s, i) => (
            <div key={i} className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Slide {i + 1}
                </span>
                <button
                  onClick={() => setSlides((p) => p.filter((_, idx) => idx !== i))}
                  className="text-red-600 hover:text-red-700"
                  aria-label="Remove slide"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3">
                <ImageInput value={s.image} onChange={(v) => setSlide(i, { image: v })} />
              </div>
              <div className="mt-3 space-y-2">
                <input value={s.eyebrow} onChange={(e) => setSlide(i, { eyebrow: e.target.value })} placeholder="Eyebrow (e.g. Premium Quality)" className={inp} />
                <input value={s.titleTop} onChange={(e) => setSlide(i, { titleTop: e.target.value })} placeholder="Headline line 1" className={inp} />
                <input value={s.titleBottom} onChange={(e) => setSlide(i, { titleBottom: e.target.value })} placeholder="Headline line 2 (gold)" className={inp} />
                <textarea value={s.sub} onChange={(e) => setSlide(i, { sub: e.target.value })} rows={2} placeholder="Subtitle" className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-gold focus:outline-none" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category tiles */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Shop-by-category tiles</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTiles((p) => [...p, { label: "", href: "/products", image: "" }])}
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold-deep"
            >
              <Plus className="h-3.5 w-3.5" /> Add tile
            </button>
            <button
              onClick={saveCircles}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-soft disabled:opacity-60"
            >
              {saved === "circles" ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              Save tiles
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <div key={i} className="rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tile {i + 1}</span>
                <button onClick={() => setTiles((p) => p.filter((_, idx) => idx !== i))} className="text-red-600" aria-label="Remove tile">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3">
                <ImageInput value={t.image} onChange={(v) => setTile(i, { image: v })} aspect="aspect-square" />
              </div>
              <input value={t.label} onChange={(e) => setTile(i, { label: e.target.value })} placeholder="Label" className={`${inp} mt-2`} />
              <input value={t.href} onChange={(e) => setTile(i, { href: e.target.value })} placeholder="/products/nuts" className={`${inp} mt-2 text-xs`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
