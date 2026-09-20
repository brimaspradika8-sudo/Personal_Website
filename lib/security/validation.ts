import { sanitizeUrl, stripHtml } from "./sanitize";

export const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export function normalizeEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return EMAIL_PATTERN.test(email) && email.length <= 254 ? email : null;
}

export function validatePassword(value: unknown, minLength = 8, maxLength = 128) {
  const password = typeof value === "string" ? value : "";
  if (password.length < minLength) return `Kata sandi minimal ${minLength} karakter.`;
  if (password.length > maxLength) return `Kata sandi maksimal ${maxLength} karakter.`;
  return null;
}

export function cleanText(value: unknown, maxLength: number) {
  const text = stripHtml(typeof value === "string" ? value : "").trim();
  if (!text) return { value: "", error: "Input tidak boleh kosong." };
  if (text.length > maxLength) return { value: text.slice(0, maxLength), error: `Input maksimal ${maxLength} karakter.` };
  return { value: text };
}

export function makeSlug(value: string, fallbackPrefix: string) {
  const slug = stripHtml(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `${fallbackPrefix}-${Date.now()}`;
}

export function cleanOptionalUrl(value: unknown, allowedProtocols = ["http:", "https:"]) {
  if (typeof value !== "string" || !value.trim()) return null;
  const clean = sanitizeUrl(value);
  if (!clean || clean.length > 2048) return null;

  try {
    const url = new URL(clean);
    return allowedProtocols.includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}
