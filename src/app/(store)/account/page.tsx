import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, User as UserIcon, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/section";
import { getCurrentUser, getProfile } from "@/lib/user";
import { getMyOrders } from "@/lib/orders";
import { logoutUserAction } from "@/app/(store)/login/actions";
import { OrderCard } from "@/components/account/order-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const [profile, orders] = await Promise.all([getProfile(), getMyOrders()]);
  const name = profile?.name || user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <section className="bg-cream py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-on-dark">
              <UserIcon className="h-6 w-6 text-gold" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Hello, {name}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <form action={logoutUserAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-foreground hover:border-gold hover:text-gold-deep"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>

        {/* Purchase history */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Package className="h-5 w-5 text-gold-deep" />
            Purchase history
          </h2>

          {orders.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-line bg-card py-16 text-center">
              <ShoppingBag className="mx-auto h-9 w-9 text-muted-foreground" />
              <p className="mt-3 font-heading text-lg font-bold text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your orders will appear here once you check out.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-gold-soft"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
