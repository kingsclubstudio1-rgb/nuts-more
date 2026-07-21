"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = {
  image: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  sub: string;
};

const FALLBACK_IMG = "/img/140.jpg";

const DEFAULTS: Slide[] = [
  { image: "/img/hero-1.jpg", eyebrow: "Premium Quality", titleTop: "Nourishing Lives", titleBottom: "Naturally.", sub: "Handpicked Dates, Dry Fruits & Nuts for a healthier you and your family." },
];

export function Hero({ slides }: { slides?: Slide[] }) {
  const SLIDES = slides && slides.length ? slides : DEFAULTS;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [SLIDES.length]);

  const slide = SLIDES[Math.min(i, SLIDES.length - 1)];

  return (
    <section className="relative isolate overflow-hidden bg-espresso text-on-dark">
      {/* full-bleed background images (cross-fade) */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.image + idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            idx === i ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={idx !== i}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover brightness-110 contrast-105 saturate-[1.15]"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (!t.src.includes(FALLBACK_IMG)) t.src = FALLBACK_IMG;
            }}
          />
        </div>
      ))}

      {/* legibility scrims — strong on the left for text, clear on the right so the image pops */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/10" />

      {/* content */}
      <div className="relative mx-auto flex min-h-[34rem] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[42rem] lg:px-8">
        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            <span className="h-px w-8 bg-gold/70" />
            {slide.eyebrow}
          </p>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] text-on-dark drop-shadow-sm sm:text-5xl lg:text-6xl">
            <span className="block">{slide.titleTop}</span>
            <span className="block text-gold-grad italic">{slide.titleBottom}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-on-dark/85">{slide.sub}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] transition-all hover:bg-gold-soft"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products/gift-hampers"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-ink/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-on-dark backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              Gift Hampers
            </Link>
          </div>

          {SLIDES.length > 1 && (
            <div className="mt-10 flex items-center gap-2.5" role="tablist" aria-label="Hero slides">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === i ? "w-7 bg-gold" : "w-2 bg-on-dark/40 hover:bg-on-dark/60",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* premium seal */}
      <div className="absolute right-5 top-6 z-10 hidden h-24 w-24 flex-col items-center justify-center rounded-full border border-gold/50 bg-ink/50 text-center shadow-lg backdrop-blur sm:flex lg:right-10">
        <Crown className="h-5 w-5 text-gold" />
        <span className="mt-0.5 text-[0.6rem] font-bold uppercase leading-tight tracking-wider text-gold">
          Premium
          <br />
          Quality
        </span>
      </div>
    </section>
  );
}
