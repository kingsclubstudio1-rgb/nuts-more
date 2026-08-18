/* ------------------------------------------------------------------ *
 * Nuts & More — content/data layer (SERVER ONLY)
 * ------------------------------------------------------------------
 * Single async API for products, categories and editable site content.
 * Uses Supabase when its tables exist; otherwise falls back to the
 * bundled seed / static defaults so the site never breaks.
 * ------------------------------------------------------------------ */
import { createAdminClient } from "./supabase/admin";
import { isSupabaseAdminConfigured } from "./supabase/config";
import * as fileStore from "./inventory";
import type { ProductInput } from "./inventory";
import {
  CATEGORIES as STATIC_CATEGORIES,
  HOME_CIRCLES as STATIC_CIRCLES,
  type Product,
  type Category,
  type CategorySlug,
} from "./catalog";

/* ---------------------- readiness probe (cached) ---------------------- */
let _ready: boolean | null = null;
export async function supabaseReady(): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;
  if (_ready === true) return true; // only cache the positive result
  try {
    const sb = createAdminClient();
    const { error } = await sb.from("products").select("id").limit(1);
    _ready = !error;
  } catch {
    _ready = false;
  }
  return _ready === true;
}

/* --------------------------- row mapping ------------------------------ */
type Row = Record<string, unknown>;

function rowToProduct(r: Row): Product {
  return {
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    category: r.category as CategorySlug,
    blurb: (r.blurb as string) ?? "",
    hindiName: (r.hindi_name as string) ?? undefined,
    description: (r.description as string) ?? undefined,
    benefits: (r.benefits as string[]) ?? [],
    nutrition: (r.nutrition as Product["nutrition"]) ?? [],
    storage: (r.storage as string) ?? undefined,
    hsn: (r.hsn as string) ?? undefined,
    variants: (r.variants as Product["variants"]) ?? [],
    image: (r.image as string) ?? undefined,
    images: (r.images as string[]) ?? [],
    badge: (r.badge as Product["badge"]) || undefined,
    featured: Boolean(r.featured),
    hidden: Boolean(r.hidden),
    rating: (r.rating as number) ?? 4.7,
    reviews: (r.reviews as number) ?? 0,
  };
}

export function productToRow(p: Partial<Product> & { id?: string }): Row {
  return {
    ...(p.id ? { id: p.id } : {}),
    slug: p.slug,
    name: p.name,
    category: p.category,
    blurb: p.blurb ?? "",
    hindi_name: p.hindiName ?? null,
    description: p.description ?? null,
    benefits: p.benefits ?? [],
    nutrition: p.nutrition ?? [],
    storage: p.storage ?? null,
    hsn: p.hsn ?? null,
    variants: p.variants ?? [],
    image: p.image ?? null,
    images: p.images ?? [],
    badge: p.badge ?? null,
    featured: p.featured ?? false,
    hidden: p.hidden ?? false,
    rating: p.rating ?? 4.7,
    reviews: p.reviews ?? 0,
    updated_at: new Date().toISOString(),
  };
}

/* ============================ PRODUCTS ================================ */

export async function getProducts(opts?: {
  category?: CategorySlug;
  includeHidden?: boolean;
}): Promise<Product[]> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      let q = sb.from("products").select("*");
      if (opts?.category) q = q.eq("category", opts.category);
      if (!opts?.includeHidden) q = q.eq("hidden", false);
      const { data, error } = await q.order("id");
      if (!error && data) return data.map(rowToProduct);
    } catch {
      /* fall through */
    }
  }
  return fileStore.listProducts(opts);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      const { data } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();
      if (data) return rowToProduct(data);
    } catch {
      /* fall through */
    }
  }
  return fileStore.getProductBySlug(slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      const { data } = await sb.from("products").select("*").eq("id", id).maybeSingle();
      if (data) return rowToProduct(data);
    } catch {
      /* fall through */
    }
  }
  return fileStore.getProductById(id);
}

export async function getFeatured(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured);
}

export async function inventoryStats() {
  const products = await getProducts({ includeHidden: true });
  const totalVariants = products.reduce((n, p) => n + p.variants.length, 0);
  const low = products.reduce(
    (n, p) => n + p.variants.filter((v) => v.stock > 0 && v.stock <= 5).length,
    0,
  );
  const out = products.filter((p) => p.variants.every((v) => v.stock <= 0)).length;
  const value = products.reduce(
    (s, p) => s + p.variants.reduce((a, v) => a + v.price * Math.max(0, v.stock), 0),
    0,
  );
  return { products, count: products.length, totalVariants, low, out, value };
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function saveProduct(
  input: ProductInput & { id?: string },
): Promise<{ ok: boolean; error?: string }> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      const id = input.id ?? `p${Date.now().toString(36)}`;
      const slug = input.slug ? slugify(input.slug) : slugify(input.name);
      const row = productToRow({ ...input, id, slug });
      const { error } = await sb.from("products").upsert(row, { onConflict: "id" });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "save failed" };
    }
  }
  // fallback: file store
  if (input.id) fileStore.updateProduct(input.id, input);
  else fileStore.createProduct(input);
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      const { error } = await sb.from("products").delete().eq("id", id);
      return !error;
    } catch {
      return false;
    }
  }
  return fileStore.deleteProduct(id);
}

export async function setVariantStock(id: string, weight: string, stock: number): Promise<boolean> {
  const product = await getProductById(id);
  if (!product) return false;
  const variants = product.variants.map((v) =>
    v.weight === weight ? { ...v, stock: Math.max(0, Math.round(stock)) } : v,
  );
  const res = await saveProduct({ ...product, variants });
  return res.ok;
}

export async function decrementStock(
  items: { id: string; weight: string; qty: number }[],
): Promise<void> {
  if (await supabaseReady()) {
    for (const it of items) {
      const p = await getProductById(it.id);
      if (!p) continue;
      const variants = p.variants.map((v) =>
        v.weight === it.weight ? { ...v, stock: Math.max(0, v.stock - it.qty) } : v,
      );
      await saveProduct({ ...p, variants });
    }
    return;
  }
  fileStore.decrementStock(items);
}

/* =========================== CATEGORIES ============================== */

export async function getCategories(): Promise<Category[]> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      const { data, error } = await sb.from("categories").select("*").order("sort");
      if (!error && data && data.length) {
        return data.map((r: Row) => ({
          slug: String(r.slug) as CategorySlug,
          name: String(r.name),
          tagline: (r.tagline as string) ?? "",
          description: (r.description as string) ?? "",
          image: (r.image as string) ?? "",
        }));
      }
    } catch {
      /* fall through */
    }
  }
  return STATIC_CATEGORIES;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function saveCategory(input: Category & { sort?: number }): Promise<boolean> {
  if (!(await supabaseReady())) return false;
  try {
    const sb = createAdminClient();
    const { error } = await sb.from("categories").upsert(
      {
        slug: input.slug,
        name: input.name,
        tagline: input.tagline,
        description: input.description,
        image: input.image,
        sort: input.sort ?? 99,
      },
      { onConflict: "slug" },
    );
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCategory(slug: string): Promise<boolean> {
  if (!(await supabaseReady())) return false;
  try {
    const sb = createAdminClient();
    const { error } = await sb.from("categories").delete().eq("slug", slug);
    return !error;
  } catch {
    return false;
  }
}

/* ======================= SITE CONTENT (settings) ===================== */

export type HeroSlide = {
  image: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  sub: string;
};

export const DEFAULT_HERO: HeroSlide[] = [
  { image: "/img/hero-1.jpg", eyebrow: "Premium Quality", titleTop: "Nourishing Lives", titleBottom: "Naturally.", sub: "Handpicked Dates, Dry Fruits & Nuts for a healthier you and your family." },
  { image: "/img/hero-2.jpg", eyebrow: "Since 2019", titleTop: "The Finest Nuts,", titleBottom: "Hand-picked.", sub: "California almonds, jumbo cashews, pistachios & walnuts — sorted for perfection." },
  { image: "/img/hero-3.jpg", eyebrow: "Naturally Sweet", titleTop: "Dates & Dry Fruits,", titleBottom: "Sun-ripened.", sub: "Soft Medjool & Mabroom dates and golden raisins — nature's candy, zero added sugar." },
  { image: "/img/hero-4.jpg", eyebrow: "Gifting, Perfected", titleTop: "Gourmet Hampers,", titleBottom: "Beautifully Boxed.", sub: "Bespoke gift hampers for festivals, weddings and the people who matter most." },
];

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (await supabaseReady()) {
    try {
      const sb = createAdminClient();
      const { data } = await sb.from("site_settings").select("value").eq("key", key).maybeSingle();
      if (data && data.value != null) return data.value as T;
    } catch {
      /* fall through */
    }
  }
  return fallback;
}

export async function saveSetting(key: string, value: unknown): Promise<boolean> {
  if (!(await supabaseReady())) return false;
  try {
    const sb = createAdminClient();
    const { error } = await sb
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    return !error;
  } catch {
    return false;
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const slides = await getSetting<HeroSlide[]>("hero_slides", DEFAULT_HERO);
  return slides.length ? slides : DEFAULT_HERO;
}

export async function getHomeCircles() {
  return getSetting("home_circles", STATIC_CIRCLES);
}
