"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, setSession, clearSession, isAuthed } from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  setVariantStock,
  resetToSeed,
  type ProductInput,
} from "@/lib/inventory";

type SaveInput = ProductInput & { id?: string };

async function guard() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
}

function revalidateStorefront() {
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

/* ------------------------------- auth -------------------------------- */

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }
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
  if (!input.variants?.length)
    return { ok: false, error: "Add at least one weight/price option." };
  if (input.variants.some((v) => !v.weight?.trim()))
    return { ok: false, error: "Every weight option needs a label (e.g. 500g)." };

  try {
    let saved;
    if (input.id) {
      const { id, ...patch } = input;
      saved = updateProduct(id, patch);
      if (!saved) return { ok: false, error: "Product not found." };
    } else {
      saved = createProduct(input);
    }
    revalidateStorefront();
    return { ok: true, id: saved.id, slug: saved.slug };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save product." };
  }
}

export async function deleteProductAction(id: string): Promise<{ ok: boolean }> {
  await guard();
  const ok = deleteProduct(id);
  if (ok) revalidateStorefront();
  return { ok };
}

export async function setStockAction(
  id: string,
  weight: string,
  stock: number,
): Promise<{ ok: boolean }> {
  await guard();
  const p = setVariantStock(id, weight, stock);
  if (p) revalidateStorefront();
  return { ok: !!p };
}

export async function toggleHiddenAction(id: string, hidden: boolean): Promise<{ ok: boolean }> {
  await guard();
  const p = updateProduct(id, { hidden } as Partial<ProductInput>);
  if (p) revalidateStorefront();
  return { ok: !!p };
}

export async function resetCatalogAction(): Promise<void> {
  await guard();
  resetToSeed();
  revalidateStorefront();
  redirect("/admin");
}
