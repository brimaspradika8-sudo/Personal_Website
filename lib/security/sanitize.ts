/**
 * Input Sanitization Utility
 * Helps prevent Stored and Reflected XSS (Cross-Site Scripting) vulnerabilities.
 */

const HTML_ENTITIES_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
};

/**
 * Escapes HTML characters in a string to safely display plain user input.
 *
 * @param str Raw string input from user
 * @returns Escaped, safe HTML string
 */
export function sanitizeText(str: string | null | undefined): string {
  if (!str) return "";
  return str.replace(/[&<>"'`/]/g, (char) => HTML_ENTITIES_MAP[char] || char);
}

/**
 * Sanitizes and strips HTML tags from user text completely.
 * Useful for fields that should contain zero HTML markup.
 *
 * @param str Raw user input
 * @returns Plain text without HTML tags
 */
export function stripHtml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitizes user-provided URL string to prevent javascript: pseudo-protocol XSS.
 *
 * @param url Raw URL input
 * @returns Safe URL or empty string if malicious scheme detected
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:text/html") ||
    lower.startsWith("vbscript:")
  ) {
    console.warn(`[Security Warning] Malicious URL scheme blocked: ${trimmed}`);
    return null;
  }

  return trimmed;
}
