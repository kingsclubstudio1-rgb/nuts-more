import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/section";
import { TrackClient } from "@/components/track/track-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the real-time status of your Nuts & More order with your Order ID.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Order tracking"
        title="Track your order"
        subtitle="Enter your Order ID to see the latest status of your delivery."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
      />
      <section className="bg-cream py-14 sm:py-16">
        <Container>
          <TrackClient initialId={id ?? ""} />
        </Container>
      </section>
    </>
  );
}
