import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategoryCircles } from "@/components/home/category-circles";
import { GiftHamperCard, WhyChooseUs } from "@/components/home/promos";
import { ProductCard } from "@/components/products/product-card";
import { Voices } from "@/components/home/voices";
import { AvailableOn } from "@/components/home/available-on";
import { ClosingCta } from "@/components/home/closing-cta";
import { Container } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { featuredProducts } from "@/lib/inventory";
import { BRANDS } from "@/lib/content";

// Reflect admin inventory edits immediately (no static caching).
export const dynamic = "force-dynamic";

export default function HomePage() {
  const bestsellers = featuredProducts().slice(0, 8);

  return (
    <>
      <Hero />
      <TrustStrip />

      {/* Showcase: categories + bestsellers on the left, promo rail on the right */}
      <section className="bg-cream py-14 sm:py-20">
        <Container className="space-y-10 sm:space-y-14">
          {/* Row 1 — Shop by category + Gift hamper */}
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <Heading align="left" eyebrow="Shop by category" title="Find your favourite" />
              <div className="mt-8">
                <CategoryCircles />
              </div>
            </div>
            <div className="lg:col-span-4">
              <GiftHamperCard />
            </div>
          </div>

          {/* Row 2 — Best sellers + Why choose us */}
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <Heading align="left" eyebrow="Our best sellers" title="What everyone's snacking on" />
                <Link
                  href="/products"
                  className="group hidden items-center gap-1.5 text-sm font-semibold text-gold-deep hover:text-gold sm:inline-flex"
                >
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {bestsellers.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-6 text-center sm:hidden">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:border-gold hover:text-gold-deep"
                >
                  View all products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4">
              <WhyChooseUs />
            </div>
          </div>
        </Container>
      </section>

      {/* Trusted by */}
      <section className="border-y border-line bg-cream-2 py-10">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Trusted by India&apos;s finest
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {BRANDS.map((b) => (
              <span key={b} className="font-heading text-lg font-semibold text-foreground/55">
                {b}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <Voices />
      <AvailableOn />
      <ClosingCta />
    </>
  );
}
