import { Inbox } from "lucide-react";
import { listEnquiries, type Enquiry } from "@/lib/orders";

export const dynamic = "force-dynamic";

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const FIELD_LABELS: Record<string, string> = {
  company: "Company",
  city: "City",
  business_type: "Business type",
  products: "Products",
  quantity: "Quantity",
  packaging: "Packaging",
  delivery_location: "Delivery location",
  expected_date: "Expected date",
  subject: "Subject",
  message: "Message",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"} — contact &amp; bulk-order
        requests from the website.
      </p>

      {enquiries.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-heading text-lg font-bold text-foreground">No enquiries yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact-form and bulk-order enquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {enquiries.map((e) => (
            <EnquiryCard key={e.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function EnquiryCard({ e }: { e: Enquiry }) {
  const extras = (
    ["company", "city", "business_type", "products", "quantity", "packaging", "delivery_location", "expected_date", "subject", "message"] as const
  )
    .filter((k) => e[k] && String(e[k]).trim())
    .map((k) => ({ label: FIELD_LABELS[k], value: String(e[k]) }));

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className={
              "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider " +
              (e.type === "bulk" ? "bg-gold/15 text-gold-deep" : "bg-cream-2 text-foreground")
            }
          >
            {e.type === "bulk" ? "Bulk order" : "Contact"}
          </span>
          <p className="mt-2 font-heading text-lg font-bold text-foreground">{e.name || "—"}</p>
          <p className="text-sm text-muted-foreground">
            {e.email ? (
              <a href={`mailto:${e.email}`} className="hover:text-gold-deep">
                {e.email}
              </a>
            ) : null}
            {e.phone ? ` · ${e.phone}` : ""}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{fmt(e.created_at)}</p>
      </div>

      {extras.length > 0 && (
        <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-line pt-4 text-sm sm:grid-cols-2">
          {extras.map((x) => (
            <div key={x.label} className="flex gap-2">
              <dt className="shrink-0 font-semibold text-muted-foreground">{x.label}:</dt>
              <dd className="text-foreground">{x.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
