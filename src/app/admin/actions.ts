"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, setSession, clearSession, isAuthed } from "@/lib/auth";
import type { ProductInput } from "@/lib/inventory";
import type { Category, CategorySlug } from "@/lib/catalog";
import type { HeroSlide } from "@/lib/cms";
import * as cms from "@/lib/cms";
import { updateOrderStatus, getAdminOrderById, getUserEmail } from "@/lib/orders";
import { statusLabel, type OrderStatus } from "@/lib/order-status";
import { sendInvoiceEmail, sendStatusUpdateEmail } from "@/lib/mailer";

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

/* ------------------------------- orders ------------------------------ */

export async function updateOrderStatusAction(
  id: string,
  status: string,
): Promise<{ ok: boolean; error?: string }> {
  await guard();
  const ok = await updateOrderStatus(id, status as OrderStatus);
  if (!ok) return { ok: false, error: "Could not update status (is the database connected?)." };
  // Notify the customer of the new status (best-effort).
  try {
    const order = await getAdminOrderById(id);
    if (order?.user_id) {
      const email = await getUserEmail(order.user_id);
      if (email) await sendStatusUpdateEmail(email, id, statusLabel(status));
    }
  } catch {
    /* email is best-effort */
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/track");
  return { ok: true };
}

export async function emailInvoiceAction(id: string): Promise<{ ok: boolean; error?: string }> {
  await guard();
  const order = await getAdminOrderById(id);
  if (!order) return { ok: false, error: "Order not found." };
  if (!order.user_id) return { ok: false, error: "No customer linked to this order." };
  const email = await getUserEmail(order.user_id);
  if (!email) return { ok: false, error: "Could not find the customer's email." };
  const res = await sendInvoiceEmail(email, {
    id: order.id,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    address: order.address,
    created_at: order.created_at,
    status: order.status,
    payment_id: order.payment_id,
  });
  if (!res.sent) return { ok: false, error: "Email could not be sent (check SMTP settings)." };
  return { ok: true, error: undefined };
}
