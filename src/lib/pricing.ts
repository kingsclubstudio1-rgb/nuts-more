/** Automatic offer-tier discount (matches the marquee). Pure, shared by client + server. */
export function discountRate(subtotal: number): number {
  if (subtotal >= 4999) return 0.2;
  if (subtotal >= 2499) return 0.15;
  if (subtotal >= 999) return 0.1;
  return 0;
}

/** Full label matching the marquee, e.g. "15% off (orders above ₹2,499)" — used on invoices. */
export function discountLabel(subtotal: number): string {
  if (subtotal >= 4999) return "20% off (orders above ₹4,999)";
  if (subtotal >= 2499) return "15% off (orders above ₹2,499)";
  if (subtotal >= 999) return "10% off (orders above ₹999)";
  return "";
}
