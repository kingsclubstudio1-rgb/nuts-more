/**
 * Seed Supabase from the bundled defaults. Run AFTER creating the tables
 * (paste supabase/schema.sql in the Supabase SQL editor), from the repo root:
 *   node scripts/seed-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CATEGORIES = [
  { slug: "nuts", name: "Nuts", tagline: "The wholesome classics", description: "Hand-picked almonds, cashews, pistachios, walnuts, hazelnuts & more.", image: "/img/hero-2.jpg", sort: 1 },
  { slug: "dry-fruits", name: "Dry Fruits", tagline: "Nature's sweet jewels", description: "Plump Medjool & Mabroom dates, golden raisins and tangy berries.", image: "/img/hero-3.jpg", sort: 2 },
  { slug: "seeds", name: "Seeds", tagline: "Tiny but mighty", description: "Chia, pumpkin, sunflower, flax, basil & watermelon superfoods.", image: "/img/142.jpg", sort: 3 },
  { slug: "makhana", name: "Makhana", tagline: "A delightful crunch", description: "Roasted foxnuts in fun, moreish flavours.", image: "/img/130.jpg", sort: 4 },
  { slug: "trail-muesli", name: "Trail Mix & Muesli", tagline: "Fuel for every day", description: "Panch Rathan, trail mixes and wholesome muesli.", image: "/img/144.jpg", sort: 5 },
  { slug: "gift-hampers", name: "Gift Hampers", tagline: "Gifting, perfected", description: "Bespoke gourmet hampers for unforgettable moments.", image: "/img/hero-4.jpg", sort: 6 },
];

const HERO = [
  { image: "/img/hero-1.jpg", eyebrow: "Premium Quality", titleTop: "Nourishing Lives", titleBottom: "Naturally.", sub: "Handpicked Dates, Dry Fruits & Nuts for a healthier you and your family." },
  { image: "/img/hero-2.jpg", eyebrow: "Since 2019", titleTop: "The Finest Nuts,", titleBottom: "Hand-picked.", sub: "California almonds, jumbo cashews, pistachios & walnuts — sorted for perfection." },
  { image: "/img/hero-3.jpg", eyebrow: "Naturally Sweet", titleTop: "Dates & Dry Fruits,", titleBottom: "Sun-ripened.", sub: "Soft Medjool & Mabroom dates and golden raisins — nature's candy, zero added sugar." },
  { image: "/img/hero-4.jpg", eyebrow: "Gifting, Perfected", titleTop: "Gourmet Hampers,", titleBottom: "Beautifully Boxed.", sub: "Bespoke gift hampers for festivals, weddings and the people who matter most." },
];

const CIRCLES = [
  { label: "Dates", href: "/products/dry-fruits", image: "/img/111.jpg" },
  { label: "Almonds", href: "/products/nuts", image: "/img/101.jpg" },
  { label: "Cashews", href: "/products/nuts", image: "/img/103.jpg" },
  { label: "Pistachios", href: "/products/nuts", image: "/img/106.jpg" },
  { label: "Walnuts", href: "/products/nuts", image: "/img/107.jpg" },
  { label: "Mixed Nuts", href: "/products/trail-muesli", image: "/img/131.jpg" },
];

const seed = JSON.parse(fs.readFileSync(path.join(root, "src/data/seed.json"), "utf8"));
const products = seed.products.map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  blurb: p.blurb ?? "",
  hindi_name: p.hindiName ?? null,
  description: p.description ?? null,
  benefits: p.benefits ?? [],
  nutrition: p.nutrition ?? [],
  storage: p.storage ?? null,
  variants: p.variants ?? [],
  image: p.image ?? null,
  images: p.images ?? [],
  badge: p.badge ?? null,
  featured: p.featured ?? false,
  hidden: p.hidden ?? false,
  rating: p.rating ?? 4.7,
  reviews: p.reviews ?? 0,
}));

async function main() {
  let r = await sb.from("categories").upsert(CATEGORIES, { onConflict: "slug" });
  console.log("categories:", r.error ? "ERR " + r.error.message : "OK (" + CATEGORIES.length + ")");
  r = await sb.from("products").upsert(products, { onConflict: "id" });
  console.log("products  :", r.error ? "ERR " + r.error.message : "OK (" + products.length + ")");
  r = await sb.from("site_settings").upsert([
    { key: "hero_slides", value: HERO },
    { key: "home_circles", value: CIRCLES },
  ], { onConflict: "key" });
  console.log("settings  :", r.error ? "ERR " + r.error.message : "OK (hero + circles)");
}
main().then(() => process.exit(0));
