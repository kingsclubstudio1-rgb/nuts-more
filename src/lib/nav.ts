export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const PRODUCT_CATEGORIES: NavChild[] = [
  { label: "Nuts", href: "/products/nuts", desc: "Almonds, cashews, pistachios, walnuts & more" },
  { label: "Dry Fruits", href: "/products/dry-fruits", desc: "Medjool dates, raisins, berries & more" },
  { label: "Seeds", href: "/products/seeds", desc: "Chia, pumpkin, sunflower, flax & basil" },
  { label: "Makhana", href: "/products/makhana", desc: "Roasted foxnut snacks in fun flavours" },
  { label: "Trail Mix & Muesli", href: "/products/trail-muesli", desc: "Panch rathan, trail mix & muesli" },
  { label: "Gift Hampers", href: "/products/gift-hampers", desc: "Bespoke gourmet gifting" },
];

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", children: PRODUCT_CATEGORIES },
  { label: "Corporate Gifting", href: "/corporate-gifting" },
  { label: "Bulk & Export", href: "/bulk" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
