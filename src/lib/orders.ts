import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseConfigured, isSupabaseAdminConfigured } from "./supabase/config";
import { orderSort, type OrderStatus } from "./order-status";

export type OrderItem = {
  id: string;
  name: string;
  weight: string;
  qty: number;
  price: number;
};

export type OrderAddress = {
  name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  pincode?: string;
  state?: string;
};

/** Full order row shape — customers see only their own (RLS-scoped); admin sees all. */
export type Order = {
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
  invoice_number: string | null;
  payment_method: string | null;
  discount_label: string | null;
  taxable_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  gst_rate: number;
  created_at: string;
  updated_at: string | null;
};

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
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    // Active orders first (newest), delivered/cancelled at the bottom.
    return ((data as Order[]) ?? []).sort(orderSort);
  } catch {
    return [];
  }
}

/* ==================================================================== *
 * Admin + public order operations (service-role) + enquiries
 * ==================================================================== */

/** Same row shape as `Order` — admin sees every customer's orders, not just their own. */
export type AdminOrder = Order;

export async function listOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseAdminConfigured()) return [];
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    // Active orders first (newest), completed/cancelled at the bottom.
    return (data as AdminOrder[]).sort(orderSort);
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
  type: "contact" | "bulk" | "return" | "gifting";
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

/* ------------------------------ Customers ----------------------------- */

export type Customer = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  created_at: string;
  confirmed: boolean;
  orders: number;
};

/** Every registered customer (Supabase Auth) + their profile + order count. */
export async function listCustomers(): Promise<Customer[]> {
  if (!isSupabaseAdminConfigured()) return [];
  try {
    const sb = createAdminClient();
    const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const users = list?.users ?? [];

    const { data: profs } = await sb.from("profiles").select("id,name,phone");
    const pmap = new Map((profs ?? []).map((p: Record<string, unknown>) => [p.id, p]));

    const { data: ords } = await sb.from("orders").select("user_id");
    const counts = new Map<string, number>();
    for (const o of ords ?? []) counts.set(o.user_id, (counts.get(o.user_id) ?? 0) + 1);

    return users
      .map((u) => {
        const p = pmap.get(u.id) as { name?: string; phone?: string } | undefined;
        return {
          id: u.id,
          email: u.email ?? null,
          name: p?.name ?? (u.user_metadata?.name as string) ?? null,
          phone: p?.phone ?? (u.user_metadata?.phone as string) ?? null,
          created_at: u.created_at,
          confirmed: !!u.email_confirmed_at,
          orders: counts.get(u.id) ?? 0,
        };
      })
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  } catch {
    return [];
  }
}

/** Mark an enquiry handled (or back to new) so the admin inbox can be worked through. */
export async function setEnquiryStatus(
  id: string,
  status: "new" | "handled",
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseAdminConfigured()) return { ok: false, error: "storage not configured" };
  try {
    const sb = createAdminClient();
    const { error } = await sb.from("enquiries").update({ status }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "update failed" };
  }
}
