"use client";

import Image from "next/image";
import { useState } from "react";
import { PlaceholderTile } from "./placeholder-tile";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);
  const src = images[active];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream-2 transition-colors sm:h-20 sm:w-20",
                i === active ? "border-gold" : "border-line hover:border-gold/50",
              )}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-line bg-cream-2 shadow-[var(--shadow-soft)]">
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 45vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderTile name={name} />
        )}
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
