"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { sendEnquiryNotification } from "@/lib/mailer";

/** A signed-in customer requests a return on one of their orders. */
export async function requestReturnAction(
  orderId: string,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!reason.trim()) return { ok: false, error: "Please add a reason for the return." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in first." };
  if (!isSupabaseAdminConfigured()) return { ok: false, error: "Returns aren't available right now." };

  try {
    const sb = createAdminClient();
    // The order must belong to this customer.
    const { data: order } = await sb
      .from("orders")
      .select("id,user_id")
      .eq("id", orderId)
      .maybeSingle();
    if (!order || order.user_id !== user.id) return { ok: false, error: "Order not found." };

    const ref = `#${orderId.slice(0, 8).toUpperCase()}`;
    const { error } = await sb.from("enquiries").insert({
      type: "return",
      name: (user.user_metadata?.name as string) ?? null,
      email: user.email,
      phone: (user.user_metadata?.phone as string) ?? null,
      products: `Order ${ref}`,
      message: reason.trim(),
      status: "new",
    });
    if (error) return { ok: false, error: error.message };

    await sendEnquiryNotification({
      type: "return",
      fields: {
        name: (user.user_metadata?.name as string) ?? user.email ?? "",
        email: user.email ?? "",
        order: ref,
        reason: reason.trim(),
      },
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not submit the return." };
  }
}
