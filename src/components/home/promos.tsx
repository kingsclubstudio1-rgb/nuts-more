import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Gift, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/section";

const REASONS = [
  { icon: Leaf, title: "Handpicked & Sorted", desc: "Every batch is cleaned and sorted for premium quality." },
  { icon: Sparkles, title: "Rich in Taste & Nutrition", desc: "Premium grades bursting with natural goodness." },
  { icon: Gift, title: "Perfect for Gifting", desc: "Elegant gourmet hampers for every occasion." },
  { icon: HeartHandshake, title: "Loved by Customers", desc: "Trusted by families and businesses across India." },
];

/** Horizontal "Why Choose Us" band — icons + short descriptions. */
export function WhyChooseUs() {
  return (
    <section className="bg-espresso text-on-dark">
      <Container className="py-12 sm:py-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Why choose us</p>
          <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Why Choose Us?</h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <div key={r.title} className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <r.icon className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <h3 className="font-heading text-lg font-bold text-on-dark">{r.title}</h3>
              <p className="max-w-[15rem] text-sm text-muted-on-dark">{r.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Full-width "Premium Gift Hampers" promo band (lower on the homepage). */
export function GiftHamperBand() {
  return (
    <section className="bg-cream">
      <Container className="py-14 sm:py-20">
        <Link
          href="/products/gift-hampers"
          className="group relative flex min-h-[16rem] items-center overflow-hidden rounded-3xl bg-espresso text-on-dark ring-1 ring-gold/15 sm:min-h-[20rem]"
        >
          <Image
            src="/img/hero-1.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso via-espresso/85 to-espresso/40" />
          <div className="relative max-w-xl p-8 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Premium</p>
            <h3 className="mt-1 font-heading text-3xl font-bold leading-tight sm:text-4xl">Gift Hampers</h3>
            <p className="mt-3 max-w-md text-muted-on-dark">
              Perfect for festivals, weddings and corporate gifting — beautifully boxed gourmet hampers,
              made to impress.
            </p>
            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-colors group-hover:bg-gold-soft">
              Explore Hampers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Container>
    </section>
  );
}
