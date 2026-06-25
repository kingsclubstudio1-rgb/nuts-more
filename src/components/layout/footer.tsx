import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Globe, AtSign, MessageCircle, Share2 } from "lucide-react";
import { Container } from "@/components/ui/section";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { SITE, CERTIFICATIONS, PLATFORMS } from "@/lib/site";
import { WaveDivider, Leaf, Makhana } from "@/components/graphics/doodles";

export function Footer() {
  return (
    <footer className="relative mt-24">
      <WaveDivider color="var(--brown-ink)" className="-mb-px" />
      <div className="relative overflow-hidden bg-brown-ink text-[#f3e7d6]">
        {/* faint doodles */}
        <Leaf className="pointer-events-none absolute -left-6 top-16 h-32 w-32 text-white/[0.04] animate-sway" />
        <Makhana className="pointer-events-none absolute right-10 top-24 h-24 w-24 text-white/[0.04] animate-float-slow" />

        <Container className="relative py-16">
          {/* Newsletter */}
          <div className="grid gap-8 rounded-3xl bg-white/[0.06] p-8 ring-1 ring-white/10 md:grid-cols-2 md:items-center md:p-10">
            <div>
              <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                Join the Nuts & More family
              </h3>
              <p className="mt-2 text-[#f3e7d6]/70">
                Seasonal drops, recipes and members-only offers — straight to your inbox.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@email.com"
                autoComplete="email"
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-[#f3e7d6] placeholder:text-[#f3e7d6]/50 focus:border-white/40 focus:outline-none"
              />
              <Button type="submit" variant="accent" className="shrink-0">Subscribe</Button>
            </form>
          </div>

          {/* Links */}
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="inline-flex rounded-2xl bg-[#f3e7d6] p-2">
                <Image src="/brand/logo.png" alt="Nuts & More" width={88} height={86} className="h-14 w-auto" />
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f3e7d6]/70">
                Premium gourmet dates, dry fruits, nuts & makhana — {SITE.promise.toLowerCase()} since {SITE.since}.
              </p>
              <div className="mt-5 flex gap-3">
                {[AtSign, MessageCircle, Share2].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social link"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent">
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Shop">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#f3e7d6]/60">Shop</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {PRODUCT_CATEGORIES.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="text-[#f3e7d6]/80 hover:text-accent">{c.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#f3e7d6]/60">Company</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[["About Us", "/about"], ["Corporate Gifting", "/corporate-gifting"], ["Case Studies", "/case-studies"], ["Bulk & Export", "/bulk"], ["Contact", "/contact"]].map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-[#f3e7d6]/80 hover:text-accent">{label}</Link></li>
                ))}
              </ul>
            </nav>

            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#f3e7d6]/60">Reach us</h4>
              <ul className="mt-4 space-y-3 text-sm text-[#f3e7d6]/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" />{SITE.address}
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4.5 w-4.5 shrink-0 text-accent" />
                  <a href={SITE.phoneHref} className="hover:text-accent">{SITE.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4.5 w-4.5 shrink-0 text-accent" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Globe className="h-4.5 w-4.5 shrink-0 text-accent" />
                  <span>{SITE.web}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Platforms + certifications */}
          <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#f3e7d6]/60">Also find us on</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <span key={p} className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold">{p}</span>
                ))}
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-[#f3e7d6]/60">Certified by</p>
              <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
                {CERTIFICATIONS.map((c) => (
                  <span key={c} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-semibold text-[#f3e7d6]/80">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-[#f3e7d6]/60 sm:flex-row">
            <p>© {new Date().getFullYear()} {SITE.legal}. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <a href="#" className="hover:text-accent">Privacy Policy</a>
              <a href="#" className="hover:text-accent">Return &amp; Refund</a>
              <a href="#" className="hover:text-accent">Terms</a>
              <a href="#" className="hover:text-accent">Shipping</a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
