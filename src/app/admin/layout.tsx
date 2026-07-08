import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LayoutGrid, PlusCircle, ExternalLink, LogOut, Tags, Image as ImageIcon } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-espresso text-on-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={40} height={40} className="h-10 w-auto" />
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-on-dark">Nuts &amp; More</p>
              <p className="text-[0.7rem] uppercase tracking-wider text-gold">Admin · Inventory</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-on-dark/85 hover:bg-white/10 hover:text-gold"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-on-dark/85 hover:bg-white/10 hover:text-gold"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add product</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-on-dark/85 hover:bg-white/10 hover:text-gold"
            >
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-on-dark/85 hover:bg-white/10 hover:text-gold"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-on-dark/85 hover:bg-white/10 hover:text-gold"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 font-medium text-on-dark hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
