import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/section";
import { SITE } from "@/lib/site";

export function ClosingCta() {
  return (
    <section className="bg-espresso py-16 text-on-dark sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(201,162,74,0.18),transparent_60%)] px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Nourishing Lives Naturally
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-bold sm:text-4xl">
            Bring home the goodness of{" "}
            <span className="text-gold-grad italic">handpicked</span> nuts &amp; dry fruits
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-on-dark">
            Premium quality, hygienically packed and delivered with care — for your family and your
            business.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] transition-colors hover:bg-gold-soft"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3.5 text-sm font-semibold text-on-dark transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
