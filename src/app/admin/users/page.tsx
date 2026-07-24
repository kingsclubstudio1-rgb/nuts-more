import { Users as UsersIcon } from "lucide-react";
import { listCustomers } from "@/lib/orders";

export const dynamic = "force-dynamic";

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function AdminUsersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Customers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {customers.length} registered account{customers.length === 1 ? "" : "s"}.
      </p>

      {customers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-heading text-lg font-bold text-foreground">No customers yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Accounts created on the storefront will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-line/70 last:border-0 hover:bg-cream/60">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {c.email ? (
                      <a href={`mailto:${c.email}`} className="text-gold-deep hover:underline">
                        {c.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmt(c.created_at)}</td>
                  <td className="px-4 py-3">
                    {c.confirmed ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
