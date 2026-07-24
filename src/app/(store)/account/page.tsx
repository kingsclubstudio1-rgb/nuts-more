import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, User as UserIcon, ShoppingBag, Truck } from "lucide-react";
import { Container } from "@/components/ui/section";
import { getCurrentUser, getProfile } from "@/lib/user";
import { getMyOrders } from "@/lib/orders";
import { statusLabel, STATUS_STYLE } from "@/lib/order-status";
import { logoutUserAction } from "@/app/(store)/login/actions";
import { ReturnRequest } from "@/components/account/return-request";
import { formatINR } from "@/lib/catalog";

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
                <div
                  key={o.id}
                  className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Order #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={
                        "rounded-full px-3 py-1 text-xs font-bold uppercase " +
                        (STATUS_STYLE[o.status] ?? "bg-cream-2 text-muted-foreground")
                      }
                    >
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex justify-between text-body">
                        <span>
                          {it.name}{" "}
                          <span className="text-muted-foreground">
                            ({it.weight}) × {it.qty}
                          </span>
                        </span>
                        <span className="tabular-nums">{formatINR(it.price * it.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap items-start justify-between gap-3 border-t border-line pt-3">
                    <div className="flex flex-col gap-1.5">
                      <Link
                        href={`/track?id=${o.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold"
                      >
                        <Truck className="h-3.5 w-3.5" /> Track order
                      </Link>
                      {o.status === "delivered" && <ReturnRequest orderId={o.id} />}
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      Total:&nbsp;<span className="tabular-nums">{formatINR(o.total)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
