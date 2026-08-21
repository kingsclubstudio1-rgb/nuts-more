"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";

const fieldCls =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none";

const BUSINESS_TYPES = [
  "Corporate",
  "Retail Store",
  "Supermarket",
  "Distributor",
  "Hotel / Restaurant",
  "Event / Wedding",
  "Gifting",
  "Other",
];
const PACKAGING = ["Retail Pouches", "Gift Boxes", "Custom Packaging", "Bulk Packing"];

const REQUIRED = [
  "name",
  "phone",
  "email",
  "city",
  "business_type",
  "products",
  "quantity",
  "packaging",
  "delivery_location",
  "expected_date",
];

export function EnquiryForm({ kind = "bulk" }: { kind?: "bulk" | "gifting" } = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    for (const key of REQUIRED) {
      if (!String(data.get(key) ?? "").trim()) next[key] = "This field is required.";
    }
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email looks off.";
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    if (phone && phone.length < 10) next.phone = "Enter a valid mobile number.";

    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: kind,
          company: data.get("company"),
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          city: data.get("city"),
          business_type: data.get("business_type"),
          products: data.get("products"),
          quantity: data.get("quantity"),
          packaging: data.get("packaging"),
          delivery_location: data.get("delivery_location"),
          expected_date: data.get("expected_date"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("done");
    } catch {
      setStatus("idle");
      setErrors({ products: "Something went wrong. Please try again or WhatsApp us." });
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-border bg-brown-soft p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-heading text-2xl font-semibold text-foreground">
          Thank you for your enquiry!
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
          Our sales team will contact you within 24 business hours.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name" name="company" optional>
          <input id="company" name="company" type="text" autoComplete="organization" placeholder="Acme Retail Pvt Ltd" className={fieldCls} />
        </Field>
        <Field label="Contact person" name="name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Full name" className={cn(fieldCls, errors.name && "border-destructive")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mobile number" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 90000 00000" className={cn(fieldCls, errors.phone && "border-destructive")} />
        </Field>
        <Field label="Email address" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className={cn(fieldCls, errors.email && "border-destructive")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" name="city" error={errors.city}>
          <input id="city" name="city" type="text" placeholder="Bengaluru" className={cn(fieldCls, errors.city && "border-destructive")} />
        </Field>
        <Field label="Business type" name="business_type" error={errors.business_type}>
          <select id="business_type" name="business_type" defaultValue="" className={cn(fieldCls, "appearance-none", errors.business_type && "border-destructive")}>
            <option value="" disabled>
              Select…
            </option>
            {BUSINESS_TYPES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Product(s) required" name="products" error={errors.products}>
          <input id="products" name="products" type="text" placeholder="e.g. Cashew W320, Almonds" className={cn(fieldCls, errors.products && "border-destructive")} />
        </Field>
        <Field label="Quantity required" name="quantity" error={errors.quantity}>
          <input id="quantity" name="quantity" type="text" placeholder="e.g. 50 kg / month" className={cn(fieldCls, errors.quantity && "border-destructive")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Packaging preference" name="packaging" error={errors.packaging}>
          <select id="packaging" name="packaging" defaultValue="" className={cn(fieldCls, "appearance-none", errors.packaging && "border-destructive")}>
            <option value="" disabled>
              Select…
            </option>
            {PACKAGING.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Expected delivery date" name="expected_date" error={errors.expected_date}>
          <input id="expected_date" name="expected_date" type="date" className={cn(fieldCls, errors.expected_date && "border-destructive")} />
        </Field>
      </div>

      <Field label="Delivery location" name="delivery_location" error={errors.delivery_location}>
        <input id="delivery_location" name="delivery_location" type="text" placeholder="Full delivery address / city / pincode" className={cn(fieldCls, errors.delivery_location && "border-destructive")} />
      </Field>

      <Field label="Additional requirements / message" name="message" optional>
        <textarea id="message" name="message" rows={4} placeholder="Branding, budget, recurring supply, deadlines…" className={cn(fieldCls, "h-auto resize-y py-3")} />
      </Field>

      <Button type="submit" size="lg" disabled={status === "submitting"} className="justify-self-start">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit Enquiry"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        ) : (
          <span className="ml-0.5 text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
