import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Check, ChevronRight, Archive } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { BuyBox } from "@/components/products/buy-box";
import { ProductCard } from "@/components/products/product-card";
import { ProductGallery } from "@/components/products/product-gallery";
import { getCategory, galleryImages } from "@/lib/catalog";
import { getProductBySlug, listProducts } from "@/lib/inventory";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.blurb };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.hidden) notFound();

  const cat = getCategory(product.category);
  const related = listProducts({ category: product.category })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-line bg-cream-2">
        <Container className="py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-gold-deep">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" />
              <li>
                <Link href="/products" className="hover:text-gold-deep">
                  Products
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" />
              {cat && (
                <>
                  <li>
                    <Link href={`/products/${cat.slug}`} className="hover:text-gold-deep">
                      {cat.name}
                    </Link>
                  </li>
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
              <li className="font-semibold text-foreground">{product.name}</li>
            </ol>
          </nav>
        </Container>
      </div>

      <section className="bg-cream py-10 sm:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Gallery */}
            <ProductGallery
              images={galleryImages(product)}
              name={product.name}
              badge={product.badge}
            />

            {/* Info */}
            <div>
              {cat && (
                <Link
                  href={`/products/${cat.slug}`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep hover:text-gold"
                >
                  {cat.name}
                </Link>
              )}
              <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>
              {product.hindiName && (
                <p className="mt-1 text-lg text-muted-foreground">{product.hindiName}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(product.rating ?? 0)
                          ? "h-4 w-4 fill-gold text-gold"
                          : "h-4 w-4 text-line"
                      }
                    />
                  ))}
                </span>
                <span className="font-semibold text-foreground">
                  {product.rating?.toFixed(1) ?? "4.7"}
                </span>
                <span className="text-muted-foreground">({product.reviews ?? 0} reviews)</span>
              </div>

              <p className="mt-4 text-base leading-relaxed text-body">{product.blurb}</p>

              <div className="mt-6">
                <BuyBox product={product} />
              </div>
            </div>
          </div>

          {/* About */}
          {product.description && (
            <div className="mt-14 max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-foreground">About this product</h2>
              <p className="mt-4 leading-relaxed text-body">{product.description}</p>
            </div>
          )}

          {/* Benefits · Nutrition · Storage */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.benefits && product.benefits.length > 0 && (
              <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
                <h3 className="font-heading text-lg font-bold text-foreground">Key benefits</h3>
                <ul className="mt-4 space-y-3">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-body">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                        <Check className="h-3 w-3 text-gold-deep" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.nutrition && product.nutrition.length > 0 && (
              <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Nutrition
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (typical / 100g)
                  </span>
                </h3>
                <dl className="mt-4 divide-y divide-line text-sm">
                  {product.nutrition.map((n) => (
                    <div key={n.label} className="flex items-center justify-between py-2">
                      <dt className="text-body">{n.label}</dt>
                      <dd className="font-semibold tabular-nums text-foreground">{n.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.storage && (
              <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]">
                <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
                  <Archive className="h-4.5 w-4.5 text-gold-deep" />
                  Storage
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-body">{product.storage}</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line bg-cream-2 py-14 sm:py-16">
          <Container>
            <Heading align="left" eyebrow="More to love" title={`More ${cat?.name ?? "products"}`} />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
