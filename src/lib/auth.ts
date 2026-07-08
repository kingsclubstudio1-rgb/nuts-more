/* ------------------------------------------------------------------ *
 * Minimal admin auth — signed, httpOnly cookie session (SERVER ONLY)
 * ------------------------------------------------------------------
 * Set ADMIN_PASSWORD (and ideally ADMIN_SECRET) in your environment.
 * If unset, a dev default is used so the panel works locally out of the
 * box — CHANGE IT before deploying (see docs/ADMIN_SETUP.md).
 * ------------------------------------------------------------------ */
import { cookies } from "next/headers";
import crypto from "node:crypto";

export const ADMIN_COOKIE = "nm_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nutsandmore2019";
/** Email that, with ADMIN_PASSWORD, logs in as admin on the shared login page. */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nutsandmore.store";
const SECRET =
  process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "nm-dev-secret-change-me";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hmac(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function makeToken(): string {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${hmac(payload)}`;
}

function verifyToken(token?: string): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = hmac(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(password: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** True when the given email + password are the admin credentials. */
export function isAdminLogin(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && checkPassword(password);
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function setSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
