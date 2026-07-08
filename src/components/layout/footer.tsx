import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Globe, AtSign, MessageCircle, Share2 } from "lucide-react";
import { Container } from "@/components/ui/section";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { SITE, CERTIFICATIONS, PLATFORMS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-on-dark">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,rgba(201,162,74,0.1),transparent_55%)]" />
      <Container className="relative py-16">
        {/* Newsletter */}
        <div className="grid gap-8 rounded-3xl border border-gold/20 bg-white/[0.04] p-8 md:grid-cols-2 md:items-center md:p-10">
          <div>
            <h3 className="font-heading text-2xl font-bold text-on-dark sm:text-3xl">
              Join the Nuts &amp; More family
            </h3>
            <p className="mt-2 text-muted-on-dark">
              Seasonal drops, recipes and members-only offers — straight to your inbox.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="you@email.com"
              autoComplete="email"
              className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-on-dark placeholder:text-muted-on-dark focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-gold px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/brand/logo.png"
              alt="Nuts & More"
              width={120}
              height={118}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-on-dark">
              Premium gourmet dates, dry fruits, nuts &amp; makhana — {SITE.promise.toLowerCase()} since{" "}
              {SITE.since}.
            </p>
            <div className="mt-5 flex gap-3">
              {[AtSign, MessageCircle, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold hover:text-primary-foreground"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Shop</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT_CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-muted-on-dark hover:text-gold">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["About Us", "/about"],
                ["Corporate Gifting", "/corporate-gifting"],
                ["Case Studies", "/case-studies"],
                ["Bulk & Export", "/bulk"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-muted-on-dark hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Reach us</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-on-dark">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 shrink-0 text-gold" />
                <a href={SITE.phoneHref} className="hover:text-gold">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 shrink-0 text-gold" />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="h-4.5 w-4.5 shrink-0 text-gold" />
                <span>{SITE.web}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Platforms + certifications */}
        <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">Also find us on</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span key={p} className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">Certified by</p>
            <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
              {CERTIFICATIONS.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-semibold text-muted-on-dark"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-muted-on-dark sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.legal}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="#" className="hover:text-gold">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gold">
              Return &amp; Refund
            </a>
            <a href="#" className="hover:text-gold">
              Terms
            </a>
            <a href="#" className="hover:text-gold">
              Shipping
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
