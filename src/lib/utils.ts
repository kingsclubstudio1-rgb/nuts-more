import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a placeholder image to a locally-bundled stock photo.
 * `spec` is "keyword,keyword|seed"; the seed maps to /public/img/<seed>.jpg.
 * These are topical stock placeholders — swap them for real product
 * photography before launch. The width arg is kept for call-site intent but
 * sizing is handled by next/image.
 */
export function img(spec: string, _w = 1200, _q = 70) {
  void _w;
  void _q;
  const seed = spec.split("|")[1] ?? "12";
  return `/img/${seed}.jpg`;
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
