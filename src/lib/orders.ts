import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseConfigured, isSupabaseAdminConfigured } from "./supabase/config";
import type { OrderStatus } from "./order-status";

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

/* ==================================================================== *
 * Admin + public order operations (service-role) + enquiries
 * ==================================================================== */

export type OrderAddress = {
  name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  pincode?: string;
  state?: string;
};

export type AdminOrder = {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: OrderAddress | null;
  payment_id: string | null;
  status: string;
  channel: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function listOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseAdminConfigured()) return [];
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as AdminOrder[];
  } catch {
    return [];
  }
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | null> {
  if (!isSupabaseAdminConfigured()) return null;
  try {
    const sb = createAdminClient();
    const { data } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
    return (data as AdminOrder) ?? null;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;
  try {
    const sb = createAdminClient();
    const { error } = await sb
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/** Public track lookup (by full UUID only — unguessable). Limited fields. */
export async function getPublicOrderStatus(id: string): Promise<{
  id: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  total: number;
  itemCount: number;
} | null> {
  if (!isSupabaseAdminConfigured()) return null;
  if (!/^[0-9a-f-]{10,}$/i.test(id.trim())) return null;
  try {
    const sb = createAdminClient();
    const { data } = await sb
      .from("orders")
      .select("id,status,created_at,updated_at,total,items")
      .eq("id", id.trim())
      .maybeSingle();
    if (!data) return null;
    const items = (data.items as OrderItem[]) ?? [];
    return {
      id: String(data.id),
      status: String(data.status),
      created_at: String(data.created_at),
      updated_at: data.updated_at ? String(data.updated_at) : null,
      total: Number(data.total ?? 0),
      itemCount: items.reduce((n, i) => n + (i.qty || 0), 0),
    };
  } catch {
    return null;
  }
}

/** Look up a customer's email from their auth user id (admin only). */
export async function getUserEmail(userId: string): Promise<string | null> {
  if (!isSupabaseAdminConfigured() || !userId) return null;
  try {
    const sb = createAdminClient();
    const { data } = await sb.auth.admin.getUserById(userId);
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------ Enquiries ----------------------------- */

export type EnquiryInput = {
  type: "contact" | "bulk";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
  subject?: string;
  business_type?: string;
  products?: string;
  quantity?: string;
  packaging?: string;
  delivery_location?: string;
  expected_date?: string;
  message?: string;
};

export type Enquiry = EnquiryInput & { id: string; status: string; created_at: string };

export async function saveEnquiry(
  input: EnquiryInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!isSupabaseAdminConfigured()) return { ok: false, error: "storage not configured" };
  try {
    const sb = createAdminClient();
    const { data, error } = await sb.from("enquiries").insert(input).select("id").single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "save failed" };
  }
}

export async function listEnquiries(): Promise<Enquiry[]> {
  if (!isSupabaseAdminConfigured()) return [];
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Enquiry[];
  } catch {
    return [];
  }
}
