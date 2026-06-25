import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Palette, Truck, Sparkles, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { CASE_STUDIES, BRANDS } from "@/lib/content";
import { img } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Corporate Gifting",
  description:
    "Custom-branded nut & dry-fruit hampers for clients, partners and teams — at any scale, fully managed.",
};

const STEPS = [
  { icon: Palette, title: "Design & Curate", body: "Pick a hamper or co-create one to your branding, budget and taste." },
  { icon: Sparkles, title: "Brand & Personalise", body: "We source and pack fresh, then add logos, ribbons and handwritten notes." },
  { icon: Truck, title: "Deliver", body: "Nationwide, on-time delivery — tracked to every doorstep." },
];

export default function CorporateGiftingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Corporate gifting"
        title="Gifts that mean business"
        subtitle="Premium, custom-branded hampers your clients and teams will actually remember — from 50 to 50,000, fully managed."
        imageId="luxury gift box present|155"
        tint="lavender"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Corporate Gifting" }]}
      />

      {/* Trusted by */}
      <section className="border-b border-border bg-surface/60 py-10">
        <Container>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by 120+ leading companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BRANDS.map((b) => (
              <Link key={b} href="/case-studies" className="font-heading text-xl font-semibold text-foreground/40 transition-colors hover:text-accent">
                {b}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three simple steps to unforgettable gifts"
            subtitle="We handle everything end-to-end so your team doesn't have to lift a finger."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="relative h-full rounded-2xl border border-border bg-surface p-6">
                  <span className="absolute right-5 top-5 font-heading text-3xl font-semibold text-border">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Case studies */}
      <section className="border-y border-border bg-surface/60 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Case studies" title="Gifting that delivered" />
          <div className="mt-12 space-y-6">
            {CASE_STUDIES.map((cs, i) => (
              <Reveal key={cs.slug}>
                <article
                  className={`grid items-center gap-8 overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-2 ${
                    i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-72">
                    <Image
                      src={img(cs.imageId, 800)}
                      alt={`${cs.client} case study`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-7 md:p-10">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                      {cs.client} · {cs.industry}
                    </span>
                    <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                      {cs.headline}
                    </h3>
                    <p className="mt-3 text-muted-foreground">{cs.result}</p>
                    <div className="mt-5 flex items-baseline gap-3">
                      <span className="font-heading text-4xl font-semibold text-primary">{cs.stat}</span>
                      <span className="text-sm text-muted-foreground">{cs.statLabel}</span>
                    </div>
                    <Link
                      href={`/case-studies#${cs.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent hover:gap-2.5 transition-all"
                    >
                      Read the full story <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/case-studies" variant="outline" size="lg">
              See all case studies <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                align="left"
                eyebrow="Let's talk"
                title="Request a gifting quote"
                subtitle="Tell us a little about your needs and a specialist will get back to you within one business day with ideas and pricing."
              />
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                {["Dedicated account manager", "Custom branding & packaging", "GST invoicing & bulk pricing", "Pan-India delivery"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
