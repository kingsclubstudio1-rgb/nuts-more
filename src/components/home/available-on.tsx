import { Container } from "@/components/ui/section";
import { PLATFORMS, CERTIFICATIONS } from "@/lib/site";

export function AvailableOn() {
  return (
    <section className="bg-cream py-12">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Also available on
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((p) => (
              <span
                key={p}
                className="rounded-full border border-line bg-card px-5 py-2 text-sm font-bold text-foreground shadow-[var(--shadow-soft)]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="h-px w-24 bg-line" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Certified &amp; compliant
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {CERTIFICATIONS.map((c) => (
              <span
                key={c}
                className="rounded-md border border-line px-2.5 py-1 text-xs font-semibold text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
