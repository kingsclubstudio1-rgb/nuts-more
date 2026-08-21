import "server-only";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseAdminConfigured } from "./supabase/config";
import * as cms from "./cms";

/** Seller's home state — determines CGST+SGST (intra-state) vs IGST (inter-state). */
const SELLER_STATE = "Karnataka";

export type InvoiceConfig = {
  gstin: string; // "" until the admin fills it in
  gstRate: number; // percent, e.g. 5
  invoicePrefix: string; // e.g. "NM"
};

const DEFAULT_INVOICE_CONFIG: InvoiceConfig = {
  gstin: "",
  gstRate: 5,
  invoicePrefix: "NM",
};

export async function getInvoiceConfig(): Promise<InvoiceConfig> {
  return cms.getSetting("invoice_config", DEFAULT_INVOICE_CONFIG);
}

export async function saveInvoiceConfig(config: InvoiceConfig): Promise<boolean> {
  return cms.saveSetting("invoice_config", config);
}

function normalizeState(s: string | undefined | null): string {
  return (s ?? "").trim().toLowerCase();
}

/**
 * Break a GST-inclusive gross amount (exactly what the customer is charged)
 * into its taxable base plus CGST+SGST (buyer in the seller's state) or IGST
 * (anywhere else / unknown).
 *
 * Listed prices are inclusive of GST, and checkout charges
 * `subtotal - discount + shipping`, so tax must be extracted from that gross
 * figure rather than added on top — otherwise the invoice would show tax the
 * customer never paid and the totals would not reconcile.
 *
 * The halves are derived as `tax - cgst` rather than rounding twice, so
 * taxable + cgst + sgst always equals the gross amount to the rupee.
 */
export function computeGst(
  grossAmount: number,
  buyerState: string | undefined | null,
  gstRatePercent: number,
): { taxableAmount: number; cgst: number; sgst: number; igst: number; gstRate: number } {
  const rate = gstRatePercent / 100;
  const taxableAmount = Math.round(grossAmount / (1 + rate));
  const tax = grossAmount - taxableAmount;
  const sameState = normalizeState(buyerState) === normalizeState(SELLER_STATE);
  if (sameState) {
    const cgst = Math.round(tax / 2);
    return { taxableAmount, cgst, sgst: tax - cgst, igst: 0, gstRate: gstRatePercent };
  }
  return { taxableAmount, cgst: 0, sgst: 0, igst: tax, gstRate: gstRatePercent };
}

/** Indian financial year key for "now" or a given date: Apr 1 - Mar 31, e.g. "2526" for FY 2025-26. */
export function financialYearKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1; // 1-12
  const startYear = m >= 4 ? y : y - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}${String(endYear).slice(-2)}`;
}

/**
 * Atomically assign the next sequential invoice number for the current
 * financial year, e.g. "NM/2526/0001". Requires the `next_invoice_seq`
 * Postgres function (see supabase/schema.sql). Falls back to a
 * timestamp-based number if the database isn't reachable, so an invoice
 * can still be produced (never blocks a paid order).
 */
export async function nextInvoiceNumber(prefix: string): Promise<string> {
  const fy = financialYearKey();
  if (isSupabaseAdminConfigured()) {
    try {
      const sb = createAdminClient();
      const { data, error } = await sb.rpc("next_invoice_seq", { p_fy: fy });
      if (!error && typeof data === "number") {
        return `${prefix}/${fy}/${String(data).padStart(4, "0")}`;
      }
    } catch {
      /* fall through to fallback */
    }
  }
  return `${prefix}/${fy}/T${Date.now().toString().slice(-6)}`;
}

/* ------------------------------------------------------------------ *
 * Amount in words (Indian numbering: lakh / crore), for the invoice
 * footer, e.g. 123456 -> "One Lakh Twenty-Three Thousand Four Hundred
 * And Fifty-Six".
 * ------------------------------------------------------------------ */
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? "-" + ONES[o] : "");
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts = [];
  if (h) parts.push(ONES[h] + " Hundred");
  if (rest) parts.push((h ? "And " : "") + twoDigits(rest));
  return parts.join(" ");
}

/** Convert a non-negative integer rupee amount to words (Indian system). */
export function numberToWords(amount: number): string {
  const n = Math.max(0, Math.round(amount));
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  const parts: string[] = [];
  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh) parts.push(threeDigits(lakh) + " Lakh");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(" ");
}

export function amountInWords(rupees: number): string {
  return `Rupees ${numberToWords(rupees)} Only`;
}
