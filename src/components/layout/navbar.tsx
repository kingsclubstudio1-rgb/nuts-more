"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, ShoppingBag, User, X, Check } from "lucide-react";
import { NAV, UTILITY_LINKS, UTILITY_BADGES } from "@/lib/nav";
import { Container } from "@/components/ui/section";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center" aria-label="Nuts & More home">
      <Image
        src="/brand/logo.png"
        alt="Nuts & More"
        width={140}
        height={138}
        priority
        className="h-14 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-[4.25rem]"
      />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/products?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  const SearchBar = ({ className }: { className?: string }) => (
    <form
      onSubmit={submitSearch}
      className={cn(
        "flex items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] focus-within:border-gold",
        className,
      )}
      role="search"
    >
      <Search className="ml-4 h-5 w-5 shrink-0 text-gold" />
      <input
        ref={searchRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for Products"
        aria-label="Search for products"
        className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] text-on-dark placeholder:text-muted-on-dark focus:outline-none"
      />
      <button
        type="submit"
        className="m-1 rounded-full bg-gold px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-gold-soft"
      >
        Search
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-ink text-[0.72rem] text-on-dark/75 md:block">
        <Container className="flex h-9 items-center justify-between">
          <ul className="flex items-center gap-5">
            {UTILITY_BADGES.map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-gold" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <ul className="flex items-center gap-5">
            {UTILITY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Main bar: logo + search + account/cart */}
      <div className="border-b border-white/10 bg-espresso/95 backdrop-blur-md">
        <Container className="flex h-[4.75rem] items-center gap-4 sm:h-[5.5rem]">
          <Logo />

          {/* prominent search (tablet/desktop) */}
          <SearchBar className="mx-2 hidden max-w-2xl flex-1 md:flex" />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* mobile search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-on-dark/85 hover:bg-white/10 hover:text-gold md:hidden"
              aria-label="Search products"
            >
              <Search className="h-[1.3rem] w-[1.3rem]" />
            </button>

            {/* Login */}
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full px-2.5 py-1.5 text-on-dark/85 transition-colors hover:bg-white/10 hover:text-gold sm:px-3"
              aria-label="Login to your account"
            >
              <User className="h-[1.3rem] w-[1.3rem]" />
              <span className="hidden text-sm font-semibold sm:inline">Login</span>
            </Link>

            {/* Cart */}
            <button
              onClick={open}
              className="relative flex items-center gap-2 rounded-full px-2.5 py-1.5 text-on-dark/85 transition-colors hover:bg-white/10 hover:text-gold sm:px-3"
              aria-label={`Cart, ${count} items`}
            >
              <span className="relative">
                <ShoppingBag className="h-[1.3rem] w-[1.3rem]" />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">Cart</span>
            </button>

            {/* hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-on-dark hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>

        {/* mobile search bar (toggle) */}
        <div
          className={cn(
            "overflow-hidden border-t border-white/10 bg-espresso transition-[max-height] duration-300 md:hidden",
            searchOpen ? "max-h-24" : "max-h-0",
          )}
        >
          <Container className="py-3">
            <SearchBar />
          </Container>
        </div>
      </div>

      {/* Nav row (desktop) */}
      <div className="hidden border-b border-white/10 bg-espresso/95 backdrop-blur-md lg:block">
        <Container>
          <nav className="flex items-center justify-center gap-1" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em] transition-colors",
                      isActive(item.href) ? "text-gold" : "text-on-dark/85 hover:text-gold",
                    )}
                    aria-expanded={openMenu === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        openMenu === item.label && "rotate-180",
                      )}
                    />
                  </Link>
                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-10 w-[30rem] -translate-x-1/2 transition-all duration-200",
                      openMenu === item.label
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-2.5 shadow-[var(--shadow-lift)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.href + c.label}
                          href={c.href}
                          className="group rounded-xl px-3.5 py-2.5 transition-colors hover:bg-cream-2"
                        >
                          <span className="block text-sm font-bold text-foreground group-hover:text-gold-deep">
                            {c.label}
                          </span>
                          {c.desc && (
                            <span className="mt-0.5 block text-xs text-muted-foreground">{c.desc}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em] transition-colors",
                    isActive(item.href) ? "text-gold" : "text-on-dark/85 hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </Container>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-white/10 bg-espresso/98 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-[85vh]" : "max-h-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 text-base font-semibold uppercase tracking-wide",
                  isActive(item.href) ? "bg-white/5 text-gold" : "text-on-dark/90",
                )}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 mt-1 grid gap-0.5 border-l border-white/10 pl-3">
                  {item.children.map((c) => (
                    <Link
                      key={c.href + c.label}
                      href={c.href}
                      className="rounded-lg px-3 py-2 text-sm text-muted-on-dark hover:bg-white/5 hover:text-on-dark"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            {UTILITY_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-on-dark/80"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </header>
  );
}
