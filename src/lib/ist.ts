/**
 * India Standard Time helpers. Pure — safe on client and server.
 *
 * The store, its customers and its tax obligations are all in IST (UTC+5:30),
 * but servers run in UTC. Reading UTC calendar fields misfiles every order
 * placed between 00:00 and 05:29 IST into the previous day: it lands in the
 * wrong daily/monthly report, prints the wrong Invoice Date, and at the
 * financial-year boundary lands in the wrong invoice series entirely.
 *
 * Everything here derives the IST calendar date explicitly rather than relying
 * on the server's local timezone, so behaviour is identical in dev and on
 * Vercel.
 */

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Calendar fields as seen in India. */
export function istParts(date: Date = new Date()): {
  year: number;
  month: number; // 1-12
  day: number;
} {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

/** IST calendar date as "YYYY-MM-DD". */
export function istDateKey(date: Date = new Date()): string {
  const { year, month, day } = istParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * The UTC instant at which a given IST calendar day begins.
 * `istDayStart("2026-08-22")` is 2026-08-21T18:30:00Z.
 */
export function istDayStart(isoDate: string): Date {
  return new Date(new Date(`${isoDate}T00:00:00.000Z`).getTime() - IST_OFFSET_MS);
}

/** The UTC instant just after a given IST calendar day ends (exclusive bound). */
export function istDayEnd(isoDate: string): Date {
  return new Date(istDayStart(isoDate).getTime() + 24 * 60 * 60 * 1000);
}

/** A Date whose UTC fields read as the IST wall-clock — for calendar arithmetic only. */
export function istShifted(date: Date = new Date()): Date {
  return new Date(date.getTime() + IST_OFFSET_MS);
}

/** Format an instant for display in IST (invoice dates, order dates). */
export function formatIST(
  date: Date | string,
  opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" },
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });
}
