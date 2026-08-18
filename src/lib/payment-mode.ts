/** Pure, client-safe — no server-only imports. Shared by invoice.ts (server) and order-card.tsx (client). */
export function paymentModeLabel(method: string | null | undefined, channel: string | null | undefined): string {
  if (channel === "cod") return "Cash on Delivery";
  switch ((method || "").toLowerCase()) {
    case "upi":
      return "UPI";
    case "card":
      return "Card";
    case "netbanking":
      return "Net Banking";
    case "wallet":
      return "Wallet";
    case "emi":
      return "EMI";
    default:
      return "Online";
  }
}
