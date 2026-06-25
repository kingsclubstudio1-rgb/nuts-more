import Image from "next/image";
import { RECIPE_STEPS } from "@/lib/content";
import { PLATFORMS } from "@/lib/site";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Lotus, Leaf, Makhana, WaveDivider, FloatingDoodles } from "@/components/graphics/doodles";
import { img } from "@/lib/utils";

const STEP_BG: Record<string, string> = {
  butter: "bg-butter", peach: "bg-peach", blush: "bg-blush", sky: "bg-sky", mint: "bg-mint",
};

/* "From Ponds to Plates" — pond-themed band (makhana grows on water lilies) */
export function PondsToPlates() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-mint via-sky to-lavender">
      <WaveDivider color="var(--cream)" className="-mt-px" />
      <FloatingDoodles variant="soft" className="inset-x-0 top-28 bottom-28" />
      <Lotus className="pointer-events-none absolute left-[8%] top-1/3 h-20 w-20 text-white/50 animate-float-slow" />
      <Lotus className="pointer-events-none absolute right-[10%] bottom-1/3 h-14 w-14 text-white/50 animate-float" />

      <Container className="relative py-20 text-center sm:py-28">
        <p className="font-script text-3xl text-accent sm:text-4xl">From Ponds to Plates</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight text-brown-ink sm:text-5xl">
          Fuel your body with nutrient-rich makhana
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brown/70">
          The guilt-free snack for a healthy you — popped from lotus seeds, roasted with love.
        </p>
      </Container>
      <WaveDivider color="var(--cream)" flip className="-mb-px" />
    </section>
  );
}

/* Makhana Kheer recipe — 5 colourful steps */
export function RecipeSteps() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Make it at home" title="Makhana Kheer in 5 steps" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RECIPE_STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 70}>
              <div className={`relative flex h-full flex-col rounded-3xl ${STEP_BG[s.tint]} p-6`}>
                <span className="font-script text-2xl text-accent">Step</span>
                <span className="font-heading text-5xl font-bold text-brown-ink/80">{s.step}</span>
                <p className="mt-3 text-sm font-medium leading-relaxed text-brown-ink">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Featured gift hampers strip */
export function GiftHampersStrip({
  hampers,
}: {
  hampers: { slug: string; name: string; price: number; imageId: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-cream-deep py-20 sm:py-24">
      <WaveDivider color="var(--cream)" className="-mt-px" />
      <FloatingDoodles className="inset-x-0 top-28 bottom-28" />
      <Container className="relative z-10">
        <SectionHeading eyebrow="Gift hampers & combos" title="Made to give, made to delight" />
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {hampers.map((h, i) => (
            <Reveal key={h.slug} delay={i * 70}>
              <div className="group overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={img(h.imageId, 600)} alt={h.name} fill sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading text-lg font-bold text-brown-ink">{h.name}</h3>
                  <p className="mt-1 font-heading text-base font-bold text-accent">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(h.price)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
      <WaveDivider color="var(--cream)" flip className="-mb-px" />
    </section>
  );
}

/* Online platforms */
export function Platforms() {
  return (
    <section className="relative overflow-hidden py-16">
      <FloatingDoodles />
      <Container className="relative z-10 text-center">
        <p className="font-script text-2xl text-accent sm:text-3xl">Find us on your favourite platforms</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {PLATFORMS.map((p) => (
            <span key={p} className="rounded-2xl border border-border bg-surface px-6 py-3 font-heading text-lg font-bold text-brown-ink shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1">
              {p}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
