import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, SectionHeading } from "@/components/ui/section";
import { ProductCard } from "@/components/products/product-card";
import { CategoryCard } from "@/components/products/category-card";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/home/cta-band";
import { CATEGORIES, getCategory, productsByCategory } from "@/lib/products";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Not found" };
  return {
    title: cat.name,
    description: cat.description,
  };
}

const PROMISES = [
  "Roasted to order, never sitting on a shelf",
  "No preservatives, no refined sugar",
  "Sealed fresh & shipped across India",
];

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const products = productsByCategory(cat.slug);
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow={cat.tagline}
        title={cat.name}
        subtitle={cat.description}
        imageId={cat.imageId}
        tint={cat.tint}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: cat.name },
        ]}
      />

      {/* Promises strip */}
      <section className="border-b border-border bg-surface/60 py-6">
        <Container>
          <ul className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Check className="h-4 w-4 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow={`${products.length} products`}
              title={`Our ${cat.name.toLowerCase()}`}
            />
            <Button href="/products" variant="ghost" className="shrink-0">
              All products <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Related categories */}
      <section className="border-t border-border bg-surface/60 py-16 sm:py-20">
        <Container>
          <SectionHeading align="left" eyebrow="Keep exploring" title="You might also like" />
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/products" className="font-medium text-primary hover:underline">
              Browse all collections →
            </Link>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
