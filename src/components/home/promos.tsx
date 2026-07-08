import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

/** Dark "Premium Gift Hampers" promo card (right rail of the showcase). */
export function GiftHamperCard() {
  return (
    <Link
      href="/products/gift-hampers"
      className="group relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden rounded-2xl bg-espresso p-6 text-on-dark ring-1 ring-gold/15"
    >
      <Image
        src="/img/136.jpg"
        alt=""
        fill
        sizes="(max-width:1024px) 100vw, 33vw"
        className="object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso via-espresso/80 to-transparent" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Premium</p>
        <h3 className="mt-1 font-heading text-2xl font-bold leading-tight">Gift Hampers</h3>
        <p className="mt-2 max-w-[16rem] text-sm text-muted-on-dark">
          Perfect for every occasion — festivals, weddings & corporate gifting.
        </p>
      </div>
      <span className="relative mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors group-hover:bg-gold-soft">
        Explore Hampers
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

const REASONS = [
  "Handpicked & Sorted",
  "Rich in Taste & Nutrition",
  "Perfect for Gifting",
  "100% Customer Satisfaction",
];

/** Dark "Why Choose Us" card (right rail of the showcase). */
export function WhyChooseUs() {
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-espresso p-6 text-on-dark ring-1 ring-gold/15 sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="font-heading text-2xl font-bold">Why Choose Us?</h3>
        <Image
          src="/brand/logo.png"
          alt="Nuts & More"
          width={128}
          height={126}
          className="h-14 w-auto shrink-0 object-contain"
        />
      </div>
      <ul className="space-y-3.5">
        {REASONS.map((r) => (
          <li key={r} className="flex items-center gap-3 text-sm text-on-dark/90">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20">
              <Check className="h-3.5 w-3.5 text-gold" />
            </span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
