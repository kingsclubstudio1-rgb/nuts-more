import "server-only";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import fs from "node:fs";
import path from "node:path";
import type { InvoiceData } from "./invoice";
import { formatINR } from "./invoice";
import { formatIST } from "./ist";

/**
 * The logo is embedded as image data, not a file path: @react-pdf treats a
 * path string as a URL to fetch, which fails and silently drops the logo.
 * Read once and cache — an invoice must never be blocked by the logo, so a
 * missing file just renders the header without it.
 *
 * `logo-invoice.png` is a small (~11KB) copy of the 433KB brand logo; the full
 * one would be attached to every invoice email for no visual gain at 46pt.
 * next.config.ts traces this file into the functions that render invoices.
 */
let logoCache: Buffer | null | undefined;
function invoiceLogo(): Buffer | null {
  if (logoCache !== undefined) return logoCache;
  try {
    logoCache = fs.readFileSync(path.join(process.cwd(), "public", "brand", "logo-invoice.png"));
  } catch {
    logoCache = null;
  }
  return logoCache;
}

const BROWN = "#4a3018";
const GOLD = "#b8912f";
const LINE = "#e7dcc9";
const MUTED = "#8a7a68";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9.5, fontFamily: "Helvetica", color: BROWN },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo: { width: 46, height: 46, marginRight: 10 },
  companyBlock: { flexDirection: "row", alignItems: "center" },
  companyName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: BROWN },
  companySub: { fontSize: 8, color: MUTED, marginTop: 2, maxWidth: 240 },
  invoiceTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: GOLD, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  metaLabel: { fontSize: 8, color: MUTED },
  metaValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: BROWN },
  divider: { borderBottomWidth: 1, borderBottomColor: LINE, marginVertical: 12 },
  addrGrid: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  addrCol: { flex: 1 },
  addrLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 },
  addrText: { fontSize: 9, marginTop: 3, lineHeight: 1.4 },
  table: { marginTop: 16, borderTopWidth: 1.4, borderTopColor: BROWN },
  tHeadRow: { flexDirection: "row", backgroundColor: "#f6efe0", paddingVertical: 5, paddingHorizontal: 4 },
  tRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 4, borderBottomWidth: 0.6, borderBottomColor: LINE },
  th: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, textTransform: "uppercase" },
  td: { fontSize: 9 },
  colItem: { flex: 3 },
  colHsn: { flex: 1, textAlign: "center" },
  colQty: { flex: 0.7, textAlign: "center" },
  colRate: { flex: 1.1, textAlign: "right" },
  colValue: { flex: 1.2, textAlign: "right" },
  summaryBlock: { marginTop: 10, marginLeft: "auto", width: 230 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  summaryLabel: { fontSize: 9, color: MUTED },
  summaryValue: { fontSize: 9, color: BROWN },
  grandRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1.2, borderTopColor: BROWN, paddingTop: 5, marginTop: 3 },
  grandLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: BROWN },
  grandValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: BROWN },
  wordsBlock: { marginTop: 14, paddingTop: 8, borderTopWidth: 0.6, borderTopColor: LINE },
  wordsLabel: { fontSize: 7.5, color: MUTED, textTransform: "uppercase" },
  wordsValue: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: BROWN, marginTop: 2 },
  footer: { marginTop: 24, textAlign: "center", fontSize: 8, color: MUTED },
});

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold ? { fontFamily: "Helvetica-Bold" } : {}]}>{value}</Text>
    </View>
  );
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const logo = invoiceLogo();
  // Invoice Date is a legal field — must read as the Indian calendar date the
  // sale happened on, not the server's UTC date.
  const date = formatIST(data.invoiceDate);

  return (
    <Document title={`Invoice ${data.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.companyBlock}>
            {logo && <Image src={{ data: logo, format: "png" }} style={styles.logo} />}
            <View>
              <Text style={styles.companyName}>{data.seller.name}</Text>
              <Text style={styles.companySub}>{data.seller.address}</Text>
              <Text style={styles.companySub}>GSTIN: {data.seller.gstin}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice No.  </Text>
              <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice Date  </Text>
              <Text style={styles.metaValue}>{date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Order No.  </Text>
              <Text style={styles.metaValue}>{data.orderId}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment Mode  </Text>
              <Text style={styles.metaValue}>{data.paymentMode}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer + addresses */}
        <View style={styles.addrGrid}>
          <View style={styles.addrCol}>
            <Text style={styles.addrLabel}>Customer</Text>
            <Text style={styles.addrText}>{data.customerName}</Text>
            <Text style={styles.addrText}>Mobile: {data.mobile}</Text>
          </View>
          <View style={styles.addrCol}>
            <Text style={styles.addrLabel}>Billing Address</Text>
            <Text style={styles.addrText}>{data.billingAddress}</Text>
          </View>
          <View style={styles.addrCol}>
            <Text style={styles.addrLabel}>Shipping Address</Text>
            <Text style={styles.addrText}>{data.shippingAddress}</Text>
          </View>
        </View>

        {/* Line items */}
        <View style={styles.table}>
          <View style={styles.tHeadRow}>
            <Text style={[styles.th, styles.colItem]}>Item</Text>
            <Text style={[styles.th, styles.colHsn]}>HSN</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colRate]}>Rate</Text>
            <Text style={[styles.th, styles.colValue]}>Value</Text>
          </View>
          {data.lines.map((l, i) => (
            <View key={i} style={styles.tRow}>
              <Text style={[styles.td, styles.colItem]}>
                {l.name} ({l.weight})
              </Text>
              <Text style={[styles.td, styles.colHsn]}>{l.hsn || "—"}</Text>
              <Text style={[styles.td, styles.colQty]}>{l.qty}</Text>
              <Text style={[styles.td, styles.colRate]}>{formatINR(l.rate)}</Text>
              <Text style={[styles.td, styles.colValue]}>{formatINR(l.value)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBlock}>
          <Row label="Subtotal" value={formatINR(data.subtotal)} />
          {data.discount > 0 && (
            <Row label={`Discount${data.discountLabel ? ` (${data.discountLabel})` : ""}`} value={`- ${formatINR(data.discount)}`} />
          )}
          <Row label="Shipping" value={data.shipping === 0 ? "FREE" : formatINR(data.shipping)} />
          <Row label="Taxable Amount" value={formatINR(data.taxableAmount)} bold />
          {data.cgst > 0 && <Row label={`CGST @ ${(data.gstRate / 2).toFixed(1)}%`} value={formatINR(data.cgst)} />}
          {data.sgst > 0 && <Row label={`SGST @ ${(data.gstRate / 2).toFixed(1)}%`} value={formatINR(data.sgst)} />}
          {data.igst > 0 && <Row label={`IGST @ ${data.gstRate.toFixed(1)}%`} value={formatINR(data.igst)} />}
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <Text style={styles.grandValue}>{formatINR(data.grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.wordsBlock}>
          <Text style={styles.wordsLabel}>Amount in Words</Text>
          <Text style={styles.wordsValue}>{data.amountInWords}</Text>
        </View>

        <Text style={styles.footer}>
          This is a system-generated invoice from {data.seller.name}. Thank you for shopping with us.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />);
}
