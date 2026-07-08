import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export type OrderItem = {
  id: string;
  name: string;
  weight: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
};

/** Record an order for the signed-in customer. No-op for guests / unconfigured. */
export async function recordOrder(input: {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false; // guest checkout — nothing to save
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: input.items,
      subtotal: input.subtotal,
      discount: input.discount,
      total: input.total,
    });
    return !error;
  } catch {
    return false;
  }
}

/** Purchase history for the signed-in customer. */
export async function getMyOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("orders")
      .select("id, items, subtotal, discount, total, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    return (data as Order[]) ?? [];
  } catch {
    return [];
  }
}
