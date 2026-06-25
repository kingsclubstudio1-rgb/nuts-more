import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Category, TINT_HEX } from "@/lib/products";
import { img } from "@/lib/utils";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group relative flex flex-col items-center overflow-hidden rounded-3xl p-5 text-center shadow-[var(--shadow-soft)] ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] sm:p-6"
      style={{ backgroundColor: TINT_HEX[category.tint] }}
    >
      {/* image medallion */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/40 ring-4 ring-white/60">
        <Image
          src={img(category.imageId, 500)}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <h3 className="mt-4 font-heading text-lg font-bold text-brown-ink sm:text-xl">
        {category.name}
      </h3>
      <p className="mt-0.5 text-sm text-brown/70">{category.tagline}</p>

      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brown px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 group-hover:gap-2.5">
        Shop now
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
