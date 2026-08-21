import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSalesReport, type GroupBy } from "@/lib/reports";

export const dynamic = "force-dynamic";

function csvCell(v: string | number): string {
  let s = String(v);
  // Excel and Sheets execute a cell starting with = + - @ as a formula, so a
  // product name like "=HYPERLINK(...)" would run on open. Prefix with a
  // single quote to force it to be read as text.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}

export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const group = (searchParams.get("group") as GroupBy) || "day";
  const type = searchParams.get("type") || "buckets";
  if (!from || !to) return NextResponse.json({ error: "from/to required" }, { status: 400 });

  const report = await getSalesReport(from, to, group);

  let filename = `report-${from}_to_${to}`;
  let csv: string;
  if (type === "products") {
    filename += "-by-product.csv";
    csv = toCsv([["Product", "Qty Sold", "Revenue"], ...report.byProduct.map((p) => [p.name, p.qty, p.revenue])]);
  } else if (type === "variants") {
    filename += "-by-variant.csv";
    csv = toCsv([
      ["Product", "Weight", "Qty Sold", "Revenue"],
      ...report.byVariant.map((v) => [v.name, v.weight, v.qty, v.revenue]),
    ]);
  } else {
    filename += `-${group}.csv`;
    csv = toCsv([["Period", "Orders", "Revenue"], ...report.byBucket.map((b) => [b.label, b.orders, b.revenue])]);
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
