import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/section";
import { ProductBrowser } from "@/components/products/product-browser";
import { ClosingCta } from "@/components/home/closing-cta";
import { getProducts, getCategories } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse every Nuts & More collection — nuts, dates, dry fruits, seeds, makhana, trail mix, muesli and gift hampers.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHeader
        eyebrow="The full range"
        title="Every good thing, in one place"
        subtitle="Premium nuts, dates, dry fruits, seeds, makhana and gourmet hampers — hand-picked and hygienically packed."
        imageId="nuts dried fruits assortment|153"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <Container>
          <ProductBrowser
            products={products}
            categories={categories}
            initialQuery={q ?? ""}
            initialCategory={category ?? "all"}
          />
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}
