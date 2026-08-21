import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/section";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your Nuts & More account.",
};

/**
 * Reached from the emailed reset link, which lands on /auth/callback first and
 * exchanges the code for a recovery session. Without that session there is
 * nothing to update, so send the visitor back to request a fresh link rather
 * than showing a form that cannot work.
 */
export default async function ResetPasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/forgot-password?expired=1");

  return (
    <section className="bg-cream py-16 sm:py-24">
      <Container>
        <ResetPasswordForm />
      </Container>
    </section>
  );
}
