import { ArrowRight } from "lucide-react";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { TrustedBy } from "@/components/home/trusted-by";
import { Benefits } from "@/components/home/benefits";
import { Testimonials } from "@/components/home/testimonials";
import { CtaBand } from "@/components/home/cta-band";
import { PondsToPlates, GiftHampersStrip, Platforms } from "@/components/home/sections";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CategoryCard } from "@/components/products/category-card";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES, featuredProducts, productsByCategory } from "@/lib/products";
import { STATS } from "@/lib/content";
import { Almond, Cashew, FloatingDoodles } from "@/components/graphics/doodles";

export default function HomePage() {
  const featured = featuredProducts().slice(0, 8);
  const hampers = productsByCategory("gift-hampers").slice(0, 3);

  return (
    <>
      <HeroSlideshow />
      <TrustedBy />

      {/* Categories — fixed cohesive pastel grid */}
      <section className="relative py-16 sm:py-20">
        <Almond className="pointer-events-none absolute right-[5%] top-10 hidden h-10 w-10 rotate-12 text-peach animate-float sm:block" />
        <Cashew className="pointer-events-none absolute left-[4%] top-24 hidden h-12 w-12 text-butter animate-sway sm:block" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Shop by category"
            title="Find your new favourite"
            subtitle="From everyday snacking to show-stopping gifts — six curated collections, hand-picked with care."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <CategoryCard category={c} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Benefits />

      <PondsToPlates />

      {/* Bestsellers */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <FloatingDoodles />
        <Container className="relative z-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading align="left" eyebrow="Best-selling treats" title="What everyone's snacking on" />
            <Button href="/products" variant="ghost" className="shrink-0">
              See more <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats strip */}
      <section className="pb-4">
        <Container>
          <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-brown px-6 py-10 text-primary-foreground sm:grid-cols-4 sm:px-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-3xl font-bold sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <GiftHampersStrip hampers={hampers} />

      <Platforms />

      <Testimonials />

      <CtaBand />
    </>
  );
}
