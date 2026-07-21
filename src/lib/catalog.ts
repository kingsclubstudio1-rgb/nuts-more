/* ------------------------------------------------------------------ *
 * Nuts & More — catalog types, static category metadata & pure helpers
 * (safe to import from both server and client components)
 * ------------------------------------------------------------------ */

export type CategorySlug =
  | "nuts"
  | "dry-fruits"
  | "seeds"
  | "makhana"
  | "trail-muesli"
  | "gift-hampers";

export type Badge = "Bestseller" | "New" | "Limited";

export type Variant = {
  weight: string; // "1000g" | "500g" | "250g" | "100g" | "50g" | "400g" | "Assorted"
  price: number; // INR
  stock: number; // units on hand
  mrp?: number; // optional strike-through price
};

export type NutritionRow = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  blurb: string;
  variants: Variant[];
  image?: string; // primary / front image — "/img/103.jpg" or "/uploads/xyz.jpg"
  images?: string[]; // gallery: front, back, extra shots (primary first)
  hindiName?: string;
  description?: string;
  benefits?: string[];
  nutrition?: NutritionRow[]; // per 100g typical values
  storage?: string;
  badge?: Badge;
  featured?: boolean;
  hidden?: boolean;
  rating?: number;
  reviews?: number;
};

/** All gallery images for a product (primary first, de-duplicated). */
export function galleryImages(product: Product): string[] {
  const imgs = [product.image, ...(product.images ?? [])].filter(
    (v): v is string => !!v,
  );
  return Array.from(new Set(imgs));
}

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "nuts",
    name: "Nuts",
    tagline: "The wholesome classics",
    description:
      "Hand-picked almonds, cashews, pistachios, walnuts, hazelnuts & more — from premier global orchards.",
    image: "/img/hero-2.jpg",
  },
  {
    slug: "dry-fruits",
    name: "Dry Fruits",
    tagline: "Nature's sweet jewels",
    description:
      "Plump Medjool & Mabroom dates, golden raisins and tangy berries — dried slow to keep the goodness in.",
    image: "/img/hero-3.jpg",
  },
  {
    slug: "seeds",
    name: "Seeds",
    tagline: "Tiny but mighty",
    description:
      "Chia, pumpkin, sunflower, flax, basil & watermelon — the everyday superfoods your bowl will love.",
    image: "/img/142.jpg",
  },
  {
    slug: "makhana",
    name: "Makhana",
    tagline: "A delightful crunch",
    description:
      "Roasted foxnuts in fun, moreish flavours — the guilt-free snack for a healthier you.",
    image: "/img/130.jpg",
  },
  {
    slug: "trail-muesli",
    name: "Trail Mix & Muesli",
    tagline: "Fuel for every day",
    description:
      "Panch Rathan, energising trail mixes and wholesome muesli for breakfasts, desks and adventures.",
    image: "/img/144.jpg",
  },
  {
    slug: "gift-hampers",
    name: "Gift Hampers",
    tagline: "Gifting, perfected",
    description:
      "Bespoke gourmet hampers that turn dates, nuts and dry fruits into unforgettable moments.",
    image: "/img/hero-4.jpg",
  },
];

/** Circular category tiles on the homepage — mirrors the hero design set. */
export const HOME_CIRCLES: { label: string; href: string; image: string }[] = [
  { label: "Dates", href: "/products/dry-fruits", image: "/img/111.jpg" },
  { label: "Almonds", href: "/products/nuts", image: "/img/101.jpg" },
  { label: "Cashews", href: "/products/nuts", image: "/img/103.jpg" },
  { label: "Pistachios", href: "/products/nuts", image: "/img/106.jpg" },
  { label: "Walnuts", href: "/products/nuts", image: "/img/107.jpg" },
  { label: "Mixed Nuts", href: "/products/trail-muesli", image: "/img/131.jpg" },
];

export const WEIGHT_ORDER = ["1000g", "500g", "400g", "250g", "100g", "50g", "Assorted"];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function sortVariants(variants: Variant[]): Variant[] {
  return [...variants].sort(
    (a, b) => WEIGHT_ORDER.indexOf(a.weight) - WEIGHT_ORDER.indexOf(b.weight),
  );
}

/** Default variant shown on cards/listings: the 100g price where available
 * (most affordable first impression), else the smallest available pack. */
export function defaultVariant(product: Product): Variant | undefined {
  const sorted = sortVariants(product.variants);
  return sorted.find((v) => v.weight === "100g") ?? sorted[sorted.length - 1];
}

export function lowestPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + Math.max(0, v.stock), 0);
}

export function inStock(product: Product): boolean {
  return totalStock(product) > 0;
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
