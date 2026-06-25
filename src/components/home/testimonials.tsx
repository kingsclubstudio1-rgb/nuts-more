import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";
import { Container, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { FloatingDoodles } from "@/components/graphics/doodles";

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <FloatingDoodles />
      <Container className="relative z-10">
        <SectionHeading eyebrow="Loved by thousands" title="Don't just take our word for it" />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-surface p-7 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <Quote className="h-8 w-8 text-accent/40" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-3 flex-1 text-lg leading-relaxed text-brown-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <span className="block font-bold text-brown-ink">{t.name}</span>
                    <span className="text-sm text-muted-foreground">{t.role}</span>
                  </div>
                  <span className="rounded-full bg-cream-deep px-3 py-1 text-xs font-semibold text-brown">{t.product}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
