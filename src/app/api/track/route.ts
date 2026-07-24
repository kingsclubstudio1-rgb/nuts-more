import { NextResponse } from "next/server";
import { getPublicOrderStatus } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const id = (new URL(req.url).searchParams.get("id") ?? "").trim();
  if (!id) return NextResponse.json({ error: "Please enter your Order ID." }, { status: 400 });

  const order = await getPublicOrderStatus(id);
  if (!order) {
    return NextResponse.json(
      { error: "No order found with that ID. Please check the ID and try again." },
      { status: 404 },
    );
  }
  return NextResponse.json({ order });
}
