import { SITE } from "./site";

export type NavChild = { label: string; href: string; desc?: string; external?: boolean };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const PRODUCT_CATEGORIES: NavChild[] = [
  { label: "Nuts", href: "/products/nuts", desc: "Almonds, cashews, pistachios, walnuts & more" },
  { label: "Dry Fruits", href: "/products/dry-fruits", desc: "Medjool dates, raisins, berries & more" },
  { label: "Seeds", href: "/products/seeds", desc: "Chia, pumpkin, sunflower, flax & basil" },
  { label: "Makhana", href: "/products/makhana", desc: "Roasted foxnut snacks in fun flavours" },
  { label: "Trail Mix & Muesli", href: "/products/trail-muesli", desc: "Panch rathan, trail mix & muesli" },
  { label: "Gift Hampers", href: "/products/gift-hampers", desc: "Bespoke gourmet gifting" },
];

const GIFTING: NavChild[] = [
  { label: "Gift Hampers", href: "/products/gift-hampers", desc: "Ready-to-gift gourmet boxes" },
  { label: "Corporate Gifting", href: "/corporate-gifting", desc: "Branded hampers for teams & clients" },
  { label: "Bulk & Export", href: "/bulk", desc: "Wholesale, private label & export" },
];

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/products", children: PRODUCT_CATEGORIES },
  { label: "Gifting", href: "/corporate-gifting", children: GIFTING },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

/** Slim utility-bar links (top-right in the header). */
export const UTILITY_LINKS: NavChild[] = [
  { label: "Track Order", href: "/account" },
  { label: "Bulk Orders", href: "/bulk" },
  { label: "Store Locator", href: SITE.maps, external: true },
];

// Kept distinct from the trust strip + marquee so no phrase is duplicated.
export const UTILITY_BADGES = [
  "No Added Preservatives",
  "Secure Online Payments",
  "Pan-India Delivery",
];
