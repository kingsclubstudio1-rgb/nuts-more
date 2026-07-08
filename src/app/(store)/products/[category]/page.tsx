import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/products/product-card";
import { ClosingCta } from "@/components/home/closing-cta";
import { CATEGORIES } from "@/lib/catalog";
import { getCategory, getCategories, getProducts } from "@/lib/cms";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return { title: "Not found" };
  return { title: cat.name, description: cat.description };
}

const PROMISES = [
  "Roasted to order, never sitting on a shelf",
  "No preservatives, no refined sugar",
  "Sealed fresh & shipped across India",
];

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const [products, allCats] = await Promise.all([
    getProducts({ category: cat.slug }),
    getCategories(),
  ]);
  const related = allCats.filter((c) => c.slug !== cat.slug).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow={cat.tagline}
        title={cat.name}
        subtitle={cat.description}
        imageId={cat.image.replace("/img/", "|").replace(".jpg", "")}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: cat.name },
        ]}
      />

      {/* Promises strip */}
      <section className="border-b border-white/10 bg-espresso-2 py-5 text-on-dark">
        <Container>
          <ul className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium">
                <Check className="h-4 w-4 text-gold" />
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Products */}
      <section className="bg-cream py-14 sm:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Heading
              align="left"
              eyebrow={`${products.length} product${products.length === 1 ? "" : "s"}`}
              title={`Our ${cat.name}`}
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:text-gold"
            >
              All products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-line bg-card py-16 text-center text-muted-foreground">
              No products in this category yet.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Related categories */}
      <section className="border-t border-line bg-cream-2 py-14 sm:py-16">
        <Container>
          <Heading align="left" eyebrow="Keep exploring" title="You might also like" />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-soft)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="font-heading text-lg font-bold text-on-dark">{c.name}</p>
                    <p className="text-xs text-gold-soft">{c.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}
