"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";

const fieldCls =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};
    if (!String(data.get("company")).trim()) next.company = "Your company name, please.";
    if (!String(data.get("name")).trim()) next.name = "Who should we address?";
    const email = String(data.get("email")).trim();
    if (!email) next.email = "We need an email to reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email looks off.";

    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    setTimeout(() => setStatus("done"), 1100);
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-heading text-2xl font-semibold text-foreground">Enquiry received</h3>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
          A gifting specialist will reach out within one business day with ideas and pricing.
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
        <Field label="Company" name="company" error={errors.company}>
          <input id="company" name="company" type="text" autoComplete="organization" placeholder="Acme Inc." className={cn(fieldCls, errors.company && "border-destructive")} />
        </Field>
        <Field label="Your name" name="name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Aanya Sharma" className={cn(fieldCls, errors.name && "border-destructive")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Work email" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className={cn(fieldCls, errors.email && "border-destructive")} />
        </Field>
        <Field label="Phone" name="phone" optional>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 90000 00000" className={fieldCls} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Approx. quantity" name="quantity" optional>
          <select id="quantity" name="quantity" className={cn(fieldCls, "appearance-none")}>
            <option>50 – 250</option>
            <option>250 – 1,000</option>
            <option>1,000 – 5,000</option>
            <option>5,000+</option>
          </select>
        </Field>
        <Field label="Needed by" name="occasion" optional>
          <select id="occasion" name="occasion" className={cn(fieldCls, "appearance-none")}>
            <option>Diwali</option>
            <option>New Year</option>
            <option>Employee onboarding</option>
            <option>Client appreciation</option>
            <option>Other / not sure</option>
          </select>
        </Field>
      </div>
      <Field label="Tell us about your gifting" name="message" optional>
        <textarea id="message" name="message" rows={4} placeholder="Budget, branding, delivery locations…" className={cn(fieldCls, "h-auto resize-y py-3")} />
      </Field>
      <Button type="submit" size="lg" disabled={status === "submitting"} className="justify-self-start">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Request a quote"
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
          <span className="ml-0.5 text-accent" aria-hidden="true">*</span>
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
