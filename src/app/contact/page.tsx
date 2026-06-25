import type { Metadata } from "next";
import { Mail, MapPin, Phone, Globe } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/section";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Nuts & More team — orders, gifting, bulk enquiries and more.",
};

const INFO = [
  { icon: MapPin, title: "Visit us", lines: ["173/1, 4th Floor, SC Road,", "Hotel Samrat Residency,", "Seshadripuram, Bengaluru 560020"] },
  { icon: Phone, title: "Call us", lines: [SITE.phone, "Mon–Sat, 9am–7pm"] },
  { icon: Mail, title: "Email us", lines: [SITE.email] },
  { icon: Globe, title: "Visit online", lines: [SITE.web] },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Say hello"
        title="We'd love to hear from you"
        subtitle="Questions about an order, a gift, or a bulk enquiry? Drop us a line and we'll get right back to you."
        imageId="nuts wooden board|154"
        tint="mint"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            {/* Info column */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-brown-ink">Get in touch</h2>
              <p className="mt-3 text-muted-foreground">
                {SITE.legal} is friendly, fast and genuinely happy to help — whether it&apos;s a
                single order or fifty thousand hampers.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {INFO.map((item, i) => (
                  <div key={item.title} className="rounded-3xl border border-border bg-surface p-5">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-brown-ink ${["bg-butter","bg-blush","bg-mint","bg-sky"][i % 4]}`}>
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-heading font-bold text-brown-ink">{item.title}</h3>
                    {item.lines.map((l) => (
                      <p key={l} className="text-sm text-muted-foreground">{l}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-border">
                <iframe
                  title="Nuts & More store location, Seshadripuram, Bengaluru"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=77.56%2C12.99%2C77.59%2C13.01&layer=mapnik&marker=12.9978%2C77.5760"
                  className="h-56 w-full"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Form column */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-brown-ink">Send a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fields marked <span className="text-accent">*</span> are required.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
