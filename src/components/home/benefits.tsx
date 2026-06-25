import { Brain, Heart, Leaf, Shield, Sparkles, Zap, Bone, Scale } from "lucide-react";
import { BENEFITS, type Benefit } from "@/lib/content";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { FloatingDoodles } from "@/components/graphics/doodles";

const ICONS: Record<Benefit["icon"], React.ComponentType<{ className?: string }>> = {
  leaf: Leaf, heart: Heart, zap: Zap, sparkles: Sparkles,
  shield: Shield, brain: Brain, bone: Bone, scale: Scale,
};

const TINTS = ["bg-butter", "bg-blush", "bg-mint", "bg-sky", "bg-peach", "bg-lavender", "bg-sage", "bg-butter"];

export function Benefits() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <FloatingDoodles />
      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Nourishing body & mind"
          title="Snacking that loves you back"
          subtitle="A versatile super-food range, offering a treasure-trove of health benefits in every bite."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon];
            return (
              <Reveal key={b.title} delay={i * 50}>
                <div className="flex h-full flex-col items-center rounded-3xl border border-border bg-surface p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-soft)]">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${TINTS[i % TINTS.length]} text-brown-ink transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-brown-ink">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
