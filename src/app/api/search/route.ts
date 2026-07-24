import { NextResponse } from "next/server";
import { getProducts } from "@/lib/cms";
import { lowestPrice } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Live product search for the navbar suggestions (name / keyword / category / hindi name). */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const products = await getProducts();
  const results = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.blurb ?? "").toLowerCase().includes(q) ||
        (p.hindiName ?? "").toLowerCase().includes(q) ||
        String(p.category).toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q),
    )
    .slice(0, 8)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      image: p.image ?? null,
      category: String(p.category),
      price: lowestPrice(p),
    }));

  return NextResponse.json({ results });
}
