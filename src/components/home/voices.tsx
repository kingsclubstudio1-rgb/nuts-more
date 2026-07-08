import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { TESTIMONIALS } from "@/lib/content";

export function Voices() {
  return (
    <section className="bg-cream-2 py-16 sm:py-20">
      <Container>
        <Heading
          eyebrow="Loved by thousands"
          title="What our customers say"
          subtitle="Families, chefs and businesses who've made Nuts & More part of their everyday."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <Quote className="h-7 w-7 text-gold/50" />
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-body">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 border-t border-line pt-3">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
