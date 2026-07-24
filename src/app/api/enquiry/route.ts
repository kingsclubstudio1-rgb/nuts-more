import { NextResponse } from "next/server";
import { saveEnquiry, type EnquiryInput } from "@/lib/orders";
import { sendEnquiryNotification } from "@/lib/mailer";

export const runtime = "nodejs";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const type = body.type === "bulk" ? "bulk" : "contact";

  const input: EnquiryInput = {
    type,
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    company: str(body.company),
    city: str(body.city),
    subject: str(body.subject),
    business_type: str(body.business_type),
    products: str(body.products),
    quantity: str(body.quantity),
    packaging: str(body.packaging),
    delivery_location: str(body.delivery_location),
    expected_date: str(body.expected_date),
    message: str(body.message),
  };

  // Validation
  if (!input.email || !isEmail(input.email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (type === "contact") {
    if (!input.name || !input.message) {
      return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
    }
  } else {
    if (!input.name || !input.phone || !input.city) {
      return NextResponse.json(
        { error: "Contact name, mobile number and city are required." },
        { status: 400 },
      );
    }
  }

  // Store (best-effort) + notify the store team (best-effort). We still return
  // success if at least one channel worked so the customer isn't blocked.
  const saved = await saveEnquiry(input);
  const fields = Object.fromEntries(
    Object.entries(input).filter(([k]) => k !== "type"),
  ) as Record<string, string | undefined>;
  const mailed = await sendEnquiryNotification({ type, fields });

  if (!saved.ok && !mailed.sent) {
    return NextResponse.json(
      { error: "We couldn't submit your enquiry right now. Please try again or WhatsApp us." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
