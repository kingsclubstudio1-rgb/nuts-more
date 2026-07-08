import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ClosingCta } from "@/components/home/closing-cta";
import { CASE_STUDIES, BRANDS } from "@/lib/content";
import { img } from "@/lib/utils";
import { Sparkle, Makhana } from "@/components/graphics/doodles";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "How Nuts & More partners with MNCs, hospitality chains, government bodies and FMCG brands to deliver premium gourmet gifting at scale.",
};

const TINT_BG: Record<string, string> = {
  blush: "bg-blush", peach: "bg-peach", butter: "bg-butter", mint: "bg-mint", sky: "bg-sky", lavender: "bg-lavender",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proof, not promises"
        title="Trusted by India's finest"
        subtitle="From 50+ corporate partners to hospitality and government — here's how we turn premium gourmet gifting into lasting goodwill."
        imageId="luxury gift hamper basket|159"
        tint="lavender"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
      />

      {/* Client logos */}
      <section className="py-12">
        <Container>
          <p className="text-center font-script text-2xl text-accent">Some of the teams we serve</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
            {BRANDS.map((b) => (
              <span key={b} className="font-heading text-xl font-bold text-brown/40">{b}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* Full case studies */}
      <section className="relative pb-8">
        <Sparkle className="pointer-events-none absolute left-[4%] top-10 h-7 w-7 text-accent/30 animate-bob" />
        <Container className="relative space-y-8">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={cs.slug}>
              <article id={cs.slug} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-soft)]">
                <div className={`grid gap-0 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
                  <div className="relative min-h-64 md:min-h-full">
                    <Image src={img(cs.imageId, 800)} alt={`${cs.client} case study`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className={`p-7 sm:p-10 ${TINT_BG[cs.tint]}`}>
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-accent-ink">
                      {cs.client} · {cs.industry}
                    </span>
                    <h2 className="mt-2 font-heading text-2xl font-bold text-brown-ink sm:text-3xl">{cs.headline}</h2>

                    <div className="mt-5 space-y-4 text-brown-ink/80">
                      <div>
                        <h3 className="font-heading font-bold text-brown-ink">The challenge</h3>
                        <p className="mt-1 text-sm leading-relaxed">{cs.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-brown-ink">What we did</h3>
                        <p className="mt-1 text-sm leading-relaxed">{cs.solution}</p>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {cs.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm font-medium text-brown-ink">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-white/60 px-4 py-2">
                      <span className="font-heading text-3xl font-bold text-brown-ink">{cs.stat}</span>
                      <span className="text-sm text-brown-ink/70">{cs.statLabel}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="relative overflow-hidden py-4">
        <Makhana className="pointer-events-none absolute right-[8%] top-0 h-10 w-10 text-butter animate-float" />
      </section>

      <ClosingCta />
    </>
  );
}
