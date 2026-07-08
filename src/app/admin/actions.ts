"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, setSession, clearSession, isAuthed } from "@/lib/auth";
import type { ProductInput } from "@/lib/inventory";
import type { Category, CategorySlug } from "@/lib/catalog";
import type { HeroSlide } from "@/lib/cms";
import * as cms from "@/lib/cms";

async function guard() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
}

function revalidateStorefront() {
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

type SaveInput = ProductInput & { id?: string };

/* ------------------------------- auth -------------------------------- */

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Incorrect password. Please try again." };
  await setSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/admin");
}

/* ----------------------------- products ------------------------------ */

export async function saveProductAction(
  input: SaveInput,
): Promise<{ ok: boolean; id?: string; slug?: string; error?: string }> {
  await guard();
  if (!input.name?.trim()) return { ok: false, error: "Product name is required." };
  if (!input.category) return { ok: false, error: "Please choose a category." };
  if (!input.variants?.length) return { ok: false, error: "Add at least one weight/price option." };
  if (input.variants.some((v) => !v.weight?.trim()))
    return { ok: false, error: "Every weight option needs a label (e.g. 500g)." };

  const res = await cms.saveProduct(input);
  if (!res.ok) return { ok: false, error: res.error ?? "Could not save product." };
  revalidateStorefront();
  return { ok: true };
}

export async function deleteProductAction(id: string): Promise<{ ok: boolean }> {
  await guard();
  const ok = await cms.deleteProduct(id);
  if (ok) revalidateStorefront();
  return { ok };
}

export async function setStockAction(
  id: string,
  weight: string,
  stock: number,
): Promise<{ ok: boolean }> {
  await guard();
  const ok = await cms.setVariantStock(id, weight, stock);
  if (ok) revalidateStorefront();
  return { ok };
}

export async function toggleHiddenAction(id: string, hidden: boolean): Promise<{ ok: boolean }> {
  await guard();
  const product = await cms.getProductById(id);
  if (!product) return { ok: false };
  const res = await cms.saveProduct({ ...product, hidden });
  if (res.ok) revalidateStorefront();
  return { ok: res.ok };
}

/* ---------------------------- categories ----------------------------- */

export async function saveCategoryAction(
  input: Category & { sort?: number },
): Promise<{ ok: boolean; error?: string }> {
  await guard();
  if (!input.slug?.trim() || !input.name?.trim())
    return { ok: false, error: "Slug and name are required." };
  const ok = await cms.saveCategory(input);
  if (!ok) return { ok: false, error: "Saving categories needs the database connected." };
  revalidateStorefront();
  return { ok: true };
}

export async function deleteCategoryAction(slug: CategorySlug | string): Promise<{ ok: boolean }> {
  await guard();
  const ok = await cms.deleteCategory(slug);
  if (ok) revalidateStorefront();
  return { ok };
}

/* ------------------------- site content ------------------------------ */

export async function saveHeroAction(
  slides: HeroSlide[],
): Promise<{ ok: boolean; error?: string }> {
  await guard();
  const ok = await cms.saveSetting("hero_slides", slides);
  if (!ok) return { ok: false, error: "Saving content needs the database connected." };
  revalidateStorefront();
  return { ok: true };
}

export async function saveSettingAction(
  key: string,
  value: unknown,
): Promise<{ ok: boolean; error?: string }> {
  await guard();
  const ok = await cms.saveSetting(key, value);
  if (!ok) return { ok: false, error: "Saving content needs the database connected." };
  revalidateStorefront();
  return { ok: true };
}
