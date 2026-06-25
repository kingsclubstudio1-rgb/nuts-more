import type { Metadata } from "next";
import { Check, Coffee, Store, UtensilsCrossed, Building2, TrendingDown, ShieldCheck, PackageCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = {
  title: "Bulk & Wholesale",
  description:
    "Wholesale nuts, dates and dry fruits for cafés, retailers, hotels and kitchens. Better prices, consistent quality, reliable supply.",
};

const TIERS = [
  {
    name: "Starter",
    range: "10 – 25 kg",
    discount: "Up to 15% off",
    features: ["Mixed cartons allowed", "Standard 1kg packs", "5–7 day dispatch", "GST invoicing"],
    featured: false,
  },
  {
    name: "Business",
    range: "25 – 100 kg",
    discount: "Up to 25% off",
    features: ["Custom pack sizes", "Priority dispatch", "Dedicated manager", "Net-15 payment terms"],
    featured: true,
  },
  {
    name: "Enterprise",
    range: "100 kg+",
    discount: "Best pricing",
    features: ["Contract pricing", "Private-label options", "Scheduled deliveries", "Net-30 payment terms"],
    featured: false,
  },
];

const AUDIENCE = [
  { icon: Coffee, label: "Cafés & bakeries" },
  { icon: Store, label: "Retailers & kiranas" },
  { icon: UtensilsCrossed, label: "Cloud kitchens" },
  { icon: Building2, label: "Hotels & resorts" },
];

const PERKS = [
  { icon: TrendingDown, title: "Margins that work", body: "Volume pricing that leaves real room for your business." },
  { icon: ShieldCheck, title: "Consistent quality", body: "The same grade, roast and freshness in every single carton." },
  { icon: PackageCheck, title: "Reliable supply", body: "Scheduled deliveries so you never run out at the wrong moment." },
];

export default function BulkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bulk & wholesale"
        title="Premium quality, by the carton"
        subtitle="Wholesale nuts, dates and dry fruits for cafés, retailers and kitchens — better prices, the same uncompromising quality."
        imageId="nuts sacks market bulk|156"
        tint="peach"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Bulk & Export" }]}
      />

      {/* Audience */}
      <section className="border-b border-border bg-surface/60 py-10">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {AUDIENCE.map((a) => (
              <span
                key={a.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <a.icon className="h-4.5 w-4.5 text-primary" />
                {a.label}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Perks */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why buy bulk with us"
            title="Built for businesses that care about quality"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-surface p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brown-soft text-primary">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing tiers */}
      <section className="border-y border-border bg-surface/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Volume pricing"
            title="Tiers that grow with you"
            subtitle="Indicative discounts — your dedicated manager will tailor a quote to your exact order."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-2xl border bg-surface p-7 ${
                  t.featured
                    ? "border-primary shadow-[var(--shadow-lift)] md:-translate-y-2"
                    : "border-border"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="font-heading text-2xl font-semibold text-foreground">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.range} / order</p>
                <p className="mt-4 font-heading text-3xl font-semibold text-primary">{t.discount}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#bulk-enquiry"
                  className={`mt-7 inline-flex h-12 items-center justify-center rounded-full font-medium transition-colors ${
                    t.featured
                      ? "bg-primary text-primary-foreground hover:bg-[#264c30]"
                      : "border border-primary/30 text-primary hover:bg-brown-soft"
                  }`}
                >
                  Get a quote
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enquiry */}
      <section id="bulk-enquiry" className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Start an order"
              title="Request a bulk quote"
              subtitle="Tell us what you need and a wholesale specialist will put together pricing within one business day."
            />
            <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
