import Link from "next/link";
import { BRANDS } from "@/lib/content";
import { Container } from "@/components/ui/section";

export function TrustedBy() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section className="py-10" aria-label="Trusted by leading brands">
      <Container>
        <Link href="/case-studies" className="group block text-center">
          <span className="font-script text-2xl text-accent">Trusted by India&apos;s finest</span>
          <span className="mt-1 block text-sm font-semibold text-brown/60 group-hover:text-accent">
            See how we partner with them →
          </span>
        </Link>
      </Container>
      <div className="group relative mt-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent" />
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((brand, i) => (
            <Link
              key={i}
              href="/case-studies"
              className="font-heading text-2xl font-bold text-brown/35 transition-colors hover:text-accent"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
