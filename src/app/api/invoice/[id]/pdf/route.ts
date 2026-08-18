import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { isAuthed } from "@/lib/auth";
import { getAdminOrderById } from "@/lib/orders";
import { buildInvoiceData } from "@/lib/invoice";
import { renderInvoicePdf } from "@/lib/invoice-pdf";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const admin = await isAuthed();
  if (!admin) {
    const user = await getCurrentUser();
    if (!user || user.id !== order.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const data = await buildInvoiceData(order);
  const pdf = await renderInvoicePdf(data);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${data.invoiceNumber.replace(/\//g, "-")}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
