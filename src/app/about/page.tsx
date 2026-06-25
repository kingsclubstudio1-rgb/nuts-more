import type { Metadata } from "next";
import { Target, Eye, Gem, Sprout, ShieldCheck, Boxes, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/home/cta-band";
import { STATS } from "@/lib/content";
import { SITE } from "@/lib/site";
import { WaveDivider, SquirrelPeek, SquirrelWave, Leaf } from "@/components/graphics/doodles";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nuts & More Trading LLP — a distinguished supplier of premium, health-conscious gourmet foods and bespoke corporate gifting, proudly serving clients since 2019.",
};

const PILLARS = [
  { icon: Target, tint: "bg-butter", title: "Our Mission", body: "To set the global standard for excellence in premium food sourcing and corporate gifting by delivering the highest quality products." },
  { icon: Eye, tint: "bg-blush", title: "The Vision", body: "To elevate corporate wellness across all sectors, becoming the ultimate trusted partner for premium nourishment and gifting." },
  { icon: Gem, tint: "bg-sky", title: "Quality Values", body: "Curating only the finest natural ingredients from global sources to exceed expectations, consistently." },
];

const PROCESS = [
  { icon: Sprout, title: "Direct Origin", body: "Direct partnership with certified growers globally." },
  { icon: ShieldCheck, title: "Inspection", body: "Multi-stage checks for size, texture and purity." },
  { icon: Boxes, title: "Processing", body: "Hygienic conditions to maintain peak freshness." },
  { icon: ClipboardCheck, title: "Final Audit", body: "Presentation review for every order." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Premium gourmet excellence"
        subtitle={`${SITE.legal} — a distinguished supplier of premium, health-conscious gourmet foods and bespoke corporate gifting, proudly serving clients since ${SITE.since}.`}
        imageId="dried fruit and nuts assortment|157"
        tint="butter"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Story */}
      <section className="relative py-16 sm:py-20">
        <Leaf className="pointer-events-none absolute right-[6%] top-12 hidden h-14 w-14 -rotate-12 text-mint animate-sway lg:block" />
        <SquirrelWave className="pointer-events-none absolute left-[6%] bottom-6 hidden h-20 w-20 text-brown/15 animate-bob lg:block" />
        <Container className="relative max-w-3xl text-center">
          <p className="font-script text-2xl text-accent sm:text-3xl">Hand-picked with care &amp; love</p>
          <p className="mt-4 text-lg leading-relaxed text-brown/80">
            Trusted by leading global organizations, we specialize in transforming traditional
            gifting into sophisticated wellness experiences. Our commitment to excellence is
            reflected in our rigorous sourcing of the world&apos;s finest natural ingredients — to
            serve discerning clients who value health and distinction.
          </p>
        </Container>
      </section>

      {/* Mission / Vision / Values */}
      <section className="pb-4">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="h-full rounded-3xl border border-border bg-surface p-7">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.tint} text-brown-ink`}>
                    <p.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold text-brown-ink">{p.title}</h3>
                  <p className="mt-2 text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Excellence advantage */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-brown px-6 py-10 text-primary-foreground sm:grid-cols-4 sm:px-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-3xl font-bold sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg italic text-brown/70">
            &ldquo;We believe that premium quality is not just a standard, but a promise to our
            clients and their health-conscious goals.&rdquo;
          </p>
        </Container>
      </section>

      {/* Quality assurance process */}
      <section className="relative overflow-hidden bg-cream-deep">
        <WaveDivider color="var(--cream)" className="-mt-px" />
        <SquirrelPeek className="pointer-events-none absolute right-[6%] top-0 hidden h-20 w-20 text-brown/15 lg:block" />
        <Container className="relative z-10 py-16 sm:py-20">
          <SectionHeading eyebrow="How we do it" title="Our quality assurance process" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="relative h-full rounded-3xl border border-border bg-surface p-6">
                  <span className="absolute right-5 top-5 font-heading text-3xl font-bold text-border">0{i + 1}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brown text-primary-foreground">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-brown-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
        <WaveDivider color="var(--cream)" flip className="-mb-px" />
      </section>

      <CtaBand />
    </>
  );
}
