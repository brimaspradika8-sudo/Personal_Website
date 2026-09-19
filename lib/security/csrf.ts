import { cookies, headers } from "next/headers";

const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generate a cryptographically secure random 32-byte hex token
 */
export function generateCsrfToken(): string {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify if the request origin matches the server host
 */
export async function verifyRequestOrigin(): Promise<{ valid: boolean; reason?: string }> {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const referer = headersList.get("referer");
    const host = headersList.get("x-forwarded-host") || headersList.get("host");

    if (!host) {
      return { valid: true }; // Skip if host header is absent (e.g. server-side internal calls)
    }

    const hostDomain = host.toLowerCase().trim();

    if (origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host.toLowerCase() !== hostDomain) {
          return { valid: false, reason: `Origin mismatch: ${originUrl.host} !== ${hostDomain}` };
        }
      } catch {
        return { valid: false, reason: "Malformed origin header" };
      }
    } else if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.host.toLowerCase() !== hostDomain) {
          return { valid: false, reason: `Referer mismatch: ${refererUrl.host} !== ${hostDomain}` };
        }
      } catch {
        return { valid: false, reason: "Malformed referer header" };
      }
    }

    return { valid: true };
  } catch (err) {
    console.warn("CSRF Origin verification warning:", err);
    return { valid: true };
  }
}

/**
 * Verify CSRF Token from cookie and submitted token
 */
export async function verifyCsrfToken(submittedToken?: string | null): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

    if (!cookieToken) {
      return false;
    }

    const headersList = await headers();
    const headerToken = submittedToken || headersList.get(CSRF_HEADER_NAME);

    if (!headerToken) {
      return false;
    }

    return cookieToken === headerToken;
  } catch (err) {
    console.error("CSRF token verification error:", err);
    return false;
  }
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
