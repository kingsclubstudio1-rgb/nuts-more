import Link from "next/link";
import { PlusCircle, Package, Layers, AlertTriangle, XCircle } from "lucide-react";
import { InventoryTable } from "@/components/admin/inventory-table";
import { listProducts, countLowStock, countOutOfStock } from "@/lib/inventory";
import { formatINR } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const products = listProducts({ includeHidden: true });
  const totalVariants = products.reduce((n, p) => n + p.variants.length, 0);
  const inventoryValue = products.reduce(
    (s, p) => s + p.variants.reduce((a, v) => a + v.price * Math.max(0, v.stock), 0),
    0,
  );
  const low = countLowStock();
  const out = countOutOfStock();

  const stats = [
    { icon: Package, label: "Products", value: String(products.length) },
    { icon: Layers, label: "Weight options", value: String(totalVariants) },
    { icon: AlertTriangle, label: "Low stock (≤5)", value: String(low), tone: "amber" },
    { icon: XCircle, label: "Out of stock", value: String(out), tone: "red" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit and stock every product across all categories. Changes go live immediately.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-gold-soft"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Add product
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-soft)]"
          >
            <s.icon
              className={
                "h-5 w-5 " +
                (s.tone === "red"
                  ? "text-red-500"
                  : s.tone === "amber"
                    ? "text-amber-500"
                    : "text-gold")
              }
            />
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-2xl border border-gold/30 bg-gold/10 p-4 sm:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
            Total inventory value (at current stock)
          </p>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            {formatINR(inventoryValue)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <InventoryTable products={products} />
      </div>
    </div>
  );
}
