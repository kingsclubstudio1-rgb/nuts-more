/** Shipping charge rules (client's spec). */

export const FREE_SHIPPING_THRESHOLD = 999; // free delivery on orders above ₹999 (within Bangalore Urban)
export const LOCAL_SHIPPING = 100; // orders below threshold, within Bangalore Urban
export const OUTSTATION_SHIPPING = 150; // outside Bangalore Urban, any order value

/** Best-effort detection of Bangalore Urban District from city + pincode. */
export function isBangaloreUrban(city: string, pincode: string): boolean {
  const c = (city || "").trim().toLowerCase();
  if (/bangalore|bengaluru|b'?lore/.test(c)) return true;
  // Bangalore Urban pincodes fall in the 560xxx series.
  const pin = (pincode || "").replace(/\D/g, "");
  return /^560\d{3}$/.test(pin);
}

/**
 * - Outside Bangalore Urban District → ₹150 (irrespective of order value)
 * - Within Bangalore Urban: below ₹999 → ₹100, otherwise free
 */
export function shippingCharge(subtotal: number, city: string, pincode: string): number {
  if (!isBangaloreUrban(city, pincode)) return OUTSTATION_SHIPPING;
  return subtotal < FREE_SHIPPING_THRESHOLD ? LOCAL_SHIPPING : 0;
}
