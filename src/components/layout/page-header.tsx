import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { img } from "@/lib/utils";
import { WaveDivider, Leaf, Makhana, Sparkle } from "@/components/graphics/doodles";

const TINT: Record<string, string> = {
  butter: "var(--butter)", blush: "var(--blush)", mint: "var(--mint)",
  sky: "var(--sky)", peach: "var(--peach)", lavender: "var(--lavender)",
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  imageId,
  breadcrumb,
  tint = "butter",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageId: string;
  breadcrumb?: { label: string; href?: string }[];
  tint?: keyof typeof TINT;
}) {
  return (
    <section
      className="relative isolate overflow-hidden pt-24 sm:pt-28"
      style={{ background: `linear-gradient(180deg, ${TINT[tint]} 0%, var(--cream) 92%)` }}
    >
      <Leaf className="pointer-events-none absolute left-[5%] top-28 h-12 w-12 -rotate-12 text-brown/15 animate-sway" />
      <Makhana className="pointer-events-none absolute right-[8%] top-24 hidden h-12 w-12 text-brown/15 animate-float sm:block" />
      <Sparkle className="pointer-events-none absolute left-[46%] top-32 h-6 w-6 text-accent/40 animate-bob" />

      <Container className="relative grid items-center gap-8 pb-12 sm:pb-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {breadcrumb && (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-brown/60">
                {breadcrumb.map((b, i) => (
                  <li key={i} className="flex items-center gap-1">
                    {b.href ? (
                      <Link href={b.href} className="hover:text-accent">{b.label}</Link>
                    ) : (
                      <span className="font-semibold text-brown">{b.label}</span>
                    )}
                    {i < breadcrumb.length - 1 && <ChevronRight className="h-4 w-4" />}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <span className="font-script text-2xl text-accent sm:text-3xl">{eyebrow}</span>}
          <h1 className="mt-1 font-heading text-4xl font-bold leading-tight text-brown-ink sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-brown/75">{subtitle}</p>
          )}
        </div>

        <div className="relative mx-auto hidden w-full max-w-sm lg:block">
          <div className="relative aspect-square">
            <div className="absolute inset-2 rounded-[44%_56%_52%_48%/52%_44%_56%_48%] bg-white/40" />
            <div className="absolute inset-4 overflow-hidden rounded-[44%_56%_52%_48%/52%_44%_56%_48%] ring-8 ring-white/70 shadow-[var(--shadow-lift)]">
              <Image src={img(imageId, 700)} alt={title} fill sizes="40vw" className="object-cover" />
            </div>
          </div>
        </div>
      </Container>

      <WaveDivider color="var(--cream)" className="-mb-px" />
    </section>
  );
}
