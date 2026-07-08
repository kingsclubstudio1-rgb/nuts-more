"use server";

import { revalidatePath } from "next/cache";
import { decrementStock } from "@/lib/inventory";
import { recordOrder, type OrderItem } from "@/lib/orders";

/**
 * Called when a customer places an order (cart checkout / product-page order).
 * - Decrements the stock of each ordered variant (inventory reflects the sale).
 * - Records the order to the customer's purchase history (if signed in + Supabase configured).
 */
export async function placeOrderAction(order: {
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  total: number;
}): Promise<{ ok: boolean; saved: boolean }> {
  const items = order.items ?? [];
  if (!items.length) return { ok: false, saved: false };

  decrementStock(
    items.map((i) => ({ id: i.id, weight: i.weight, qty: Math.max(1, Math.floor(i.qty || 1)) })),
  );

  const saved = await recordOrder({
    items,
    subtotal: Math.round(order.subtotal ?? 0),
    discount: Math.round(order.discount ?? 0),
    total: Math.round(order.total ?? order.subtotal ?? 0),
  });

  revalidatePath("/", "layout");
  return { ok: true, saved };
}
