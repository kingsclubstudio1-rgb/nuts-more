import type { Metadata } from "next";
import { Container } from "@/components/ui/section";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a link to reset your Nuts & More account password.",
};

export default function ForgotPasswordPage() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <Container>
        <ForgotPasswordForm />
      </Container>
    </section>
  );
}
