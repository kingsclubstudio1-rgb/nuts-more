import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { type Product } from "@/lib/products";
import { img, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-deep">
        <Image
          src={img(product.imageId, 600)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge tone={product.badge}>{product.badge}</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-bold text-brown-ink">{product.rating}</span>
          <span>({product.reviews})</span>
          <span className="ml-auto rounded-full bg-cream-deep px-2 py-0.5 font-semibold">{product.weight}</span>
        </div>

        <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-brown-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.blurb}</p>

        <div className="mt-4 flex items-center justify-between pt-1">
          <span className="font-heading text-lg font-bold text-brown-ink tabular-nums">
            {formatINR(product.price)}
          </span>
          <button
            type="button"
            className="flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-bold text-accent-foreground transition-all hover:bg-accent-ink active:scale-95 cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
