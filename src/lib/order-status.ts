/** Order-status constants — pure data, safe to import from client components. */

export type OrderStatus =
  | "placed"
  | "paid"
  | "in_progress"
  | "ready_to_dispatch"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/** The customer-facing status flow, in order. "paid" collapses into "Order Placed". */
export const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Order Placed" },
  { key: "in_progress", label: "In Progress" },
  { key: "ready_to_dispatch", label: "Ready to Dispatch" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export const STATUS_LABELS: Record<string, string> = {
  placed: "Order Placed",
  paid: "Order Placed",
  in_progress: "In Progress",
  ready_to_dispatch: "Ready to Dispatch",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Statuses an admin can set an order to. */
export const ADMIN_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "placed", label: "Order Placed" },
  { value: "in_progress", label: "In Progress" },
  { value: "ready_to_dispatch", label: "Ready to Dispatch" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function statusLabel(s: string): string {
  return STATUS_LABELS[s] ?? s;
}

/** Index of a status within STATUS_STEPS (paid → placed). -1 for cancelled/unknown. */
export function stepIndex(s: string): number {
  const key = s === "paid" ? "placed" : s;
  return STATUS_STEPS.findIndex((x) => x.key === key);
}
