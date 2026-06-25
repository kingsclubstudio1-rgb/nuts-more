"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf as LeafIcon } from "lucide-react";
import { HERO_SLIDES } from "@/lib/content";
import { img, cn } from "@/lib/utils";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Squirrel, Makhana, Leaf, Lotus, Sparkle } from "@/components/graphics/doodles";

const AUTOPLAY = 6000;
const TINT: Record<string, string> = {
  butter: "var(--butter)",
  blush: "var(--blush)",
  lavender: "var(--lavender)",
};

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = HERO_SLIDES.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count, paused]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      className="relative isolate overflow-hidden pt-24 transition-colors duration-700 sm:pt-28"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background: `linear-gradient(180deg, ${TINT[slide.tint] ?? "var(--color-butter)"} 0%, var(--cream) 78%)`,
      }}
    >
      {/* floating doodles */}
      <Leaf className="pointer-events-none absolute left-[6%] top-28 h-12 w-12 -rotate-12 text-brown/15 animate-sway" />
      <Makhana className="pointer-events-none absolute right-[44%] top-24 hidden h-10 w-10 text-brown/15 animate-float sm:block" />
      <Sparkle className="pointer-events-none absolute left-[42%] top-40 h-6 w-6 text-accent/40 animate-bob" />
      <Lotus className="pointer-events-none absolute bottom-16 left-[8%] hidden h-16 w-16 text-accent/20 animate-float-slow sm:block" />

      <Container className="grid items-center gap-8 pb-16 lg:grid-cols-2 lg:gap-6 lg:pb-24">
        {/* Text */}
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/70 px-4 py-1.5 text-sm font-semibold text-brown backdrop-blur">
            <LeafIcon className="h-4 w-4 text-accent" />
            {slide.eyebrow}
          </span>
          <h1 className="mt-5 whitespace-pre-line font-heading text-[2.6rem] font-bold leading-[1.05] text-brown-ink sm:text-6xl md:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-brown/75">{slide.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={slide.ctaHref} variant="accent" size="lg">{slide.ctaLabel}</Button>
            <Button href="/products" variant="outline" size="lg">View all products</Button>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brown/15 bg-white/80 text-brown backdrop-blur transition-colors hover:bg-white cursor-pointer">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brown/15 bg-white/80 text-brown backdrop-blur transition-colors hover:bg-white cursor-pointer">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2" role="tablist" aria-label="Choose slide">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} type="button" onClick={() => setIndex(i)} role="tab"
                  aria-selected={i === index} aria-label={`Go to slide ${i + 1}`}
                  className={cn("h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                    i === index ? "w-8 bg-accent" : "w-2.5 bg-brown/20 hover:bg-brown/35")} />
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square">
            {/* blob backdrop */}
            <div
              className="absolute inset-2 rounded-[42%_58%_55%_45%/48%_42%_58%_52%] opacity-80 blur-[2px]"
              style={{ background: TINT[slide.tint] ?? "var(--color-butter)" }}
            />
            {HERO_SLIDES.map((s, i) => (
              <div key={i}
                className={cn("absolute inset-4 overflow-hidden rounded-[44%_56%_52%_48%/52%_44%_56%_48%] ring-8 ring-white/70 shadow-[var(--shadow-lift)] transition-opacity duration-700",
                  i === index ? "opacity-100" : "opacity-0")}
                aria-hidden={i !== index}>
                <Image src={img(s.imageId, 900)} alt={s.eyebrow} fill priority={i === 0}
                  sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
              </div>
            ))}
            {/* mascot peeking */}
            <Squirrel className="absolute -bottom-4 -left-4 h-24 w-24 text-brown drop-shadow-md animate-bob sm:h-28 sm:w-28" />
          </div>
        </div>
      </Container>
    </section>
  );
}
