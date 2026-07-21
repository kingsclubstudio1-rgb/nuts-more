/** Automatic offer-tier discount (matches the marquee). Pure, shared by client + server. */
export function discountRate(subtotal: number): number {
  if (subtotal >= 4999) return 0.2;
  if (subtotal >= 2499) return 0.15;
  if (subtotal >= 999) return 0.1;
  return 0;
}

export function discountLabel(subtotal: number): string {
  const r = discountRate(subtotal);
  return r ? `${Math.round(r * 100)}% off` : "";
}
