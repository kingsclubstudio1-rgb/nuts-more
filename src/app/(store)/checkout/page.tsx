import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getProfile } from "@/lib/user";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");
  const profile = await getProfile();

  return (
    <CheckoutClient
      email={user.email ?? ""}
      name={profile?.name ?? (user.user_metadata?.name as string) ?? ""}
      phone={profile?.phone ?? (user.user_metadata?.phone as string) ?? ""}
      razorpayReady={isRazorpayConfigured()}
    />
  );
}
