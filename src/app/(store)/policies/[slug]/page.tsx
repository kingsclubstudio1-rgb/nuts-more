import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/section";
import { POLICIES } from "@/lib/policies";

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = POLICIES[slug];
  return p ? { title: p.title } : { title: "Not found" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={policy.title}
        subtitle={`Last updated: ${policy.updated}`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: policy.title }]}
      />
      <section className="bg-cream py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-body">{policy.intro}</p>
            <div className="mt-10 space-y-8">
              {policy.sections.map((s) => (
                <div key={s.heading}>
                  <h2 className="font-heading text-xl font-bold text-foreground">{s.heading}</h2>
                  <div className="mt-3 space-y-2">
                    {s.body.map((b, i) => (
                      <p key={i} className="leading-relaxed text-body">
                        {b}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-12 rounded-2xl border border-line bg-card p-5 text-sm text-muted-foreground">
              This policy is provided as a starting point for your store. Please have it reviewed by
              your legal advisor and replace with your finalised text where needed.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
