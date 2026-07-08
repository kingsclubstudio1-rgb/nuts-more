import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { img } from "@/lib/utils";

/**
 * Dark-premium interior page header. `tint` is accepted for backwards
 * compatibility with older callers but no longer changes the palette.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  imageId,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageId?: string;
  breadcrumb?: { label: string; href?: string }[];
  tint?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-espresso text-on-dark">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_120%_at_85%_10%,rgba(201,162,74,0.15),transparent_55%)]" />
      <Container className="relative grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <div>
          {breadcrumb && (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-on-dark">
                {breadcrumb.map((b, i) => (
                  <li key={i} className="flex items-center gap-1">
                    {b.href ? (
                      <Link href={b.href} className="hover:text-gold">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gold">{b.label}</span>
                    )}
                    {i < breadcrumb.length - 1 && <ChevronRight className="h-4 w-4" />}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              <span className="h-px w-7 bg-gold/60" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.08] sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-on-dark">{subtitle}</p>
          )}
        </div>

        {imageId && (
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] ring-1 ring-gold/25 shadow-[var(--shadow-lift)]">
              <Image src={img(imageId, 700)} alt={title} fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
