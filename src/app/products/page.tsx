import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container, SectionHeading } from "@/components/ui/section";
import { CategoryCard } from "@/components/products/category-card";
import { ProductExplorer } from "@/components/products/product-explorer";
import { CtaBand } from "@/components/home/cta-band";
import { CATEGORIES } from "@/lib/products";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse every Nuts&More collection — nuts, dates, dry fruits, seeds, trail mix, gift baskets and corporate gifting.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The full range"
        title="Every good thing, in one place"
        subtitle="Eight collections of premium nuts, dates, dry fruits and gifts — roasted to order and shipped fresh."
        imageId="nuts dried fruits assortment|153"
        tint="butter"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      {/* Category grid */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading align="left" eyebrow="Collections" title="Shop by category" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </Container>
      </section>

      {/* Explorer */}
      <section className="border-t border-border bg-surface/60 py-16 sm:py-20">
        <Container>
          <SectionHeading align="left" eyebrow="Browse" title="All products" />
          <div className="mt-10">
            <ProductExplorer />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
