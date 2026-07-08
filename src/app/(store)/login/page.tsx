import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/section";
import { AuthForm } from "@/components/auth/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAuthed } from "@/lib/auth";
import { getCurrentUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Nuts & More account to track orders and view purchase history.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string }>;
}) {
  const { next, mode } = await searchParams;

  // already signed in? send them onward
  if (await isAuthed()) redirect(next?.startsWith("/admin") ? next : "/admin");
  if (await getCurrentUser()) redirect(next && next.startsWith("/") ? next : "/account");

  return (
    <section className="bg-cream py-16 sm:py-24">
      <Container>
        <AuthForm
          next={next}
          defaultMode={mode === "signup" ? "signup" : "signin"}
          supabaseReady={isSupabaseConfigured()}
        />
      </Container>
    </section>
  );
}
