"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";

const fieldCls =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    if (!String(data.get("name")).trim()) next.name = "Please tell us your name.";
    const email = String(data.get("email")).trim();
    if (!email) next.email = "An email lets us reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email looks off — mind checking it?";
    if (!String(data.get("message")).trim()) next.message = "Add a short message so we can help.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus("submitting");
    // Demo: simulate a network request (no backend wired up yet)
    setTimeout(() => setStatus("done"), 1100);
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-brown-soft p-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h3 className="mt-4 font-heading text-2xl font-semibold text-foreground">Message sent!</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Thanks for reaching out — our team typically replies within one business day.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Aanya Sharma" className={cn(fieldCls, errors.name && "border-destructive")} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@email.com" className={cn(fieldCls, errors.email && "border-destructive")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" name="phone" optional>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 90000 00000" className={fieldCls} />
        </Field>
        <Field label="Subject" name="subject" optional>
          <select id="subject" name="subject" className={cn(fieldCls, "appearance-none")}>
            <option>General enquiry</option>
            <option>Order support</option>
            <option>Corporate gifting</option>
            <option>Bulk / wholesale</option>
            <option>Partnership</option>
          </select>
        </Field>
      </div>

      <Field label="Message" name="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="How can we help?"
          className={cn(fieldCls, "h-auto py-3 resize-y", errors.message && "border-destructive")}
        />
      </Field>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <p className="text-sm text-muted-foreground">We reply within one business day.</p>
      </div>
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
