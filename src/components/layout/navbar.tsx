"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { NAV, PRODUCT_CATEGORIES } from "@/lib/nav";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Makhana } from "@/components/graphics/doodles";
import { cn } from "@/lib/utils";

function ActiveNut() {
  return <Makhana className="h-3.5 w-3.5 shrink-0 text-accent" />;
}

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Nuts & More home">
      <Image
        src="/brand/logo.png"
        alt="Nuts & More"
        width={120}
        height={118}
        priority
        className="h-12 w-auto transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-14"
      />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-cream/85 backdrop-blur-xl shadow-[var(--shadow-soft)]"
          : "bg-cream/40 backdrop-blur-sm"
      )}
    >
      <Container className="flex h-20 items-center justify-between py-2">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors",
                    isActive(item.href) ? "text-accent" : "text-brown/80 hover:text-accent"
                  )}
                  aria-expanded={productsOpen}
                >
                  {isActive(item.href) && <ActiveNut />}
                  {item.label}
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", productsOpen && "rotate-180")}
                  />
                </Link>
                <div
                  className={cn(
                    "absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3 transition-all duration-200",
                    productsOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  )}
                >
                  <div className="grid grid-cols-2 gap-1 rounded-3xl border border-border bg-surface p-3 shadow-[var(--shadow-lift)]">
                    {PRODUCT_CATEGORIES.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="group rounded-2xl px-4 py-3 transition-colors hover:bg-brown-soft"
                      >
                        <span className="block text-sm font-bold text-brown-ink group-hover:text-accent">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {c.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors",
                  isActive(item.href) ? "text-accent" : "text-brown/80 hover:text-accent"
                )}
              >
                {isActive(item.href) && <ActiveNut />}
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/products" variant="accent" size="sm" className="hidden sm:inline-flex">
            <ShoppingBag className="h-4 w-4" />
            Shop now
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-brown hover:bg-brown-soft lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-b border-border bg-cream/97 backdrop-blur-xl transition-[max-height] duration-300",
          mobileOpen ? "max-h-[80vh]" : "max-h-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold",
                  isActive(item.href) ? "bg-brown-soft text-accent" : "text-brown-ink"
                )}
              >
                {isActive(item.href) && <ActiveNut />}
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 mt-1 grid gap-0.5 border-l-2 border-border pl-3">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-brown-soft hover:text-brown-ink"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button href="/products" variant="accent" className="mt-3 w-full">
            <ShoppingBag className="h-4 w-4" />
            Shop now
          </Button>
        </Container>
      </div>
    </header>
  );
}
