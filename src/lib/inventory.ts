/* ------------------------------------------------------------------ *
 * Nuts & More — product + inventory store  (SERVER ONLY)
 * ------------------------------------------------------------------
 * Source of truth is a JSON document. In local dev / `next start` it is
 * persisted to  ./data/inventory.json  so the admin panel's edits survive
 * restarts and show on the site immediately.
 *
 * On a read-only host (e.g. Vercel serverless) writes are kept in memory
 * for the life of the instance. For true multi-instance LIVE inventory,
 * swap `FileStore` for a `SupabaseStore` implementing the same shape —
 * see docs/ADMIN_SETUP.md. Every read/write already funnels through this
 * one module, so that swap touches nothing else.
 * ------------------------------------------------------------------ */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { Product, CategorySlug, Variant } from "./catalog";
import seed from "../data/seed.json";

type State = { updatedAt: string; products: Product[] };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "inventory.json");
const FALLBACK_FILE = path.join(os.tmpdir(), "nm-inventory.json");

let state: State | null = null;
let filePath: string | null = null; // where we successfully persist
let loadedMtimeMs = 0;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function seedState(): State {
  return { updatedAt: new Date(0).toISOString(), products: clone(seed.products) as Product[] };
}

function readFileState(p: string): State | null {
  try {
    const raw = fs.readFileSync(p, "utf-8");
    const parsed = JSON.parse(raw) as State;
    if (parsed && Array.isArray(parsed.products)) return parsed;
  } catch {
    /* missing or corrupt — ignore */
  }
  return null;
}

function persist() {
  if (!state) return;
  state.updatedAt = new Date().toISOString();
  const payload = JSON.stringify(state, null, 2);
  const targets = [DATA_FILE, FALLBACK_FILE];
  for (const target of targets) {
    try {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, payload, "utf-8");
      filePath = target;
      loadedMtimeMs = fs.statSync(target).mtimeMs;
      return;
    } catch {
      /* try next target */
    }
  }
  // no writable location — keep in memory only
}

/** Load once; hot-reload if the backing file changed since we last read it. */
function load(): State {
  if (state) {
    // pick up external edits (another server action, manual edit) in dev
    const p = filePath;
    if (p) {
      try {
        const m = fs.statSync(p).mtimeMs;
        if (m > loadedMtimeMs) {
          const fresh = readFileState(p);
          if (fresh) {
            state = fresh;
            loadedMtimeMs = m;
          }
        }
      } catch {
        /* ignore */
      }
    }
    return state;
  }

  const fromDisk = readFileState(DATA_FILE) ?? readFileState(FALLBACK_FILE);
  if (fromDisk) {
    state = fromDisk;
    filePath = fs.existsSync(DATA_FILE) ? DATA_FILE : FALLBACK_FILE;
    try {
      loadedMtimeMs = fs.statSync(filePath).mtimeMs;
    } catch {
      loadedMtimeMs = 0;
    }
    return state;
  }

  // first run: seed and try to persist
  state = seedState();
  persist();
  return state;
}

/* -------------------------------- reads -------------------------------- */

export function getUpdatedAt(): string {
  return load().updatedAt;
}

export function listProducts(opts?: {
  category?: CategorySlug;
  includeHidden?: boolean;
}): Product[] {
  const { products } = load();
  return products.filter((p) => {
    if (!opts?.includeHidden && p.hidden) return false;
    if (opts?.category && p.category !== opts.category) return false;
    return true;
  });
}

export function getProductBySlug(slug: string): Product | undefined {
  return load().products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return load().products.find((p) => p.id === id);
}

export function productsByCategory(category: CategorySlug, includeHidden = false): Product[] {
  return listProducts({ category, includeHidden });
}

export function featuredProducts(): Product[] {
  return listProducts().filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return listProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.blurb.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.hindiName ?? "").toLowerCase().includes(q),
  );
}

export function countLowStock(threshold = 5): number {
  return load().products.reduce(
    (n, p) => n + p.variants.filter((v) => v.stock > 0 && v.stock <= threshold).length,
    0,
  );
}

export function countOutOfStock(): number {
  return load().products.filter((p) => p.variants.every((v) => v.stock <= 0)).length;
}

/* ------------------------------- writes -------------------------------- */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base: string, ignoreId?: string): string {
  const products = load().products;
  let slug = base || "product";
  let n = 2;
  while (products.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

function nextId(): string {
  const products = load().products;
  let max = 0;
  for (const p of products) {
    const num = parseInt(p.id.replace(/\D/g, ""), 10);
    if (!Number.isNaN(num) && num > max) max = num;
  }
  return `p${String(max + 1).padStart(3, "0")}`;
}

export type ProductInput = Omit<Product, "id" | "slug"> & { slug?: string };

export function createProduct(input: ProductInput): Product {
  const s = load();
  const product: Product = {
    ...input,
    id: nextId(),
    slug: uniqueSlug(input.slug ? slugify(input.slug) : slugify(input.name)),
    variants: normalizeVariants(input.variants),
  };
  s.products.push(product);
  persist();
  return product;
}

export function updateProduct(id: string, patch: Partial<ProductInput>): Product | undefined {
  const s = load();
  const idx = s.products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const current = s.products[idx];
  const next: Product = {
    ...current,
    ...patch,
    id: current.id,
    slug: patch.slug ? uniqueSlug(slugify(patch.slug), id) : current.slug,
    variants: patch.variants ? normalizeVariants(patch.variants) : current.variants,
  };
  s.products[idx] = next;
  persist();
  return next;
}

export function deleteProduct(id: string): boolean {
  const s = load();
  const before = s.products.length;
  s.products = s.products.filter((p) => p.id !== id);
  const removed = s.products.length < before;
  if (removed) persist();
  return removed;
}

/** Set stock for a single variant (used by quick inventory edits). */
export function setVariantStock(id: string, weight: string, stock: number): Product | undefined {
  const s = load();
  const product = s.products.find((p) => p.id === id);
  if (!product) return undefined;
  const variant = product.variants.find((v) => v.weight === weight);
  if (!variant) return undefined;
  variant.stock = Math.max(0, Math.round(stock));
  persist();
  return product;
}

/** Decrement stock when an order is placed (best-effort, never negative). */
export function decrementStock(items: { id: string; weight: string; qty: number }[]): void {
  const s = load();
  for (const item of items) {
    const product = s.products.find((p) => p.id === item.id);
    const variant = product?.variants.find((v) => v.weight === item.weight);
    if (variant) variant.stock = Math.max(0, variant.stock - item.qty);
  }
  persist();
}

function normalizeVariants(variants: Variant[]): Variant[] {
  return (variants ?? [])
    .filter((v) => v.weight && v.price >= 0)
    .map((v) => ({
      weight: v.weight.trim(),
      price: Math.max(0, Math.round(v.price)),
      stock: Math.max(0, Math.round(v.stock ?? 0)),
      ...(v.mrp ? { mrp: Math.max(0, Math.round(v.mrp)) } : {}),
    }));
}

/** Reset the whole catalog back to the seed (admin utility). */
export function resetToSeed(): void {
  state = seedState();
  persist();
}
