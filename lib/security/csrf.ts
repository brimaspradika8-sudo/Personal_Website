const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";
const OFFICIAL_DOMAIN = "https://brimas.vercel.app";
const ALLOWED_DEVELOPMENT_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
];

// Masa berlaku token CSRF di server-side session store (24 jam)
const DEFAULT_CSRF_EXPIRY_MS = 24 * 60 * 60 * 1000;

interface ServerCsrfRecord {
  token: string;
  expiresAt: number;
  userId?: string;
}

// Store server-side in-memory untuk menyimpan token CSRF per session/user
const serverCsrfStore = new Map<string, ServerCsrfRecord>();

// Pembersihan berkala token server yang sudah kedaluwarsa
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;
let lastCleanupTime = Date.now();

function cleanupExpiredServerTokens() {
  const now = Date.now();
  if (now - lastCleanupTime < CLEANUP_INTERVAL_MS) return;
  lastCleanupTime = now;
  for (const [key, record] of serverCsrfStore.entries()) {
    if (record.expiresAt < now) {
      serverCsrfStore.delete(key);
    }
  }
}

/**
 * Constant-time comparison untuk cegah timing attack saat membandingkan string token.
 * Menggunakan Web Standard TextEncoder dan bitwise comparison (Edge & Node compatible).
 */
export function constantTimeCompare(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  if (!a || !b || typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const bufA = encoder.encode(a);
    const bufB = encoder.encode(b);

    if (bufA.length !== bufB.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < bufA.length; i++) {
      result |= bufA[i] ^ bufB[i];
    }
    return result === 0;
  } catch {
    return false;
  }
}

/**
 * Menyimpan token CSRF ke server-side store (dan Redis jika tersedia)
 */
export async function storeCsrfTokenOnServer(
  identifier: string,
  token: string,
  expiresAt: number = Date.now() + DEFAULT_CSRF_EXPIRY_MS
): Promise<void> {
  cleanupExpiredServerTokens();
  serverCsrfStore.set(identifier, { token, expiresAt });

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && redisToken) {
    try {
      const ttlSeconds = Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000));
      await fetch(
        `${url}/set/${encodeURIComponent(`csrf:${identifier}`)}/${encodeURIComponent(token)}?EX=${ttlSeconds}`,
        {
          headers: { Authorization: `Bearer ${redisToken}` },
          cache: "no-store",
        }
      );
    } catch (err) {
      console.warn("Upstash Redis CSRF store warning:", err);
    }
  }
}

/**
 * Mengambil token CSRF yang tersimpan di server-side store
 */
export async function getCsrfTokenFromServer(
  identifier: string
): Promise<ServerCsrfRecord | null> {
  const now = Date.now();
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && redisToken) {
    try {
      const res = await fetch(
        `${url}/get/${encodeURIComponent(`csrf:${identifier}`)}`,
        {
          headers: { Authorization: `Bearer ${redisToken}` },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return { token: data.result, expiresAt: now + DEFAULT_CSRF_EXPIRY_MS };
        }
      }
    } catch {
      // Fallback ke in-memory store jika Redis error/tidak tersedia
    }
  }

  const record = serverCsrfStore.get(identifier);
  if (!record) return null;
  if (record.expiresAt < now) {
    serverCsrfStore.delete(identifier);
    return null;
  }
  return record;
}

/**
 * Generate token CSRF cryptographically random 32-byte hex dan simpan di server-side store.
 * Menggunakan Web Crypto API (globalThis.crypto) agar 100% kompatibel dengan Edge Runtime.
 */
export async function generateCsrfToken(sessionOrUserId?: string): Promise<string> {
  const buffer = new Uint8Array(32);
  globalThis.crypto.getRandomValues(buffer);
  const token = Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const expiresAt = Date.now() + DEFAULT_CSRF_EXPIRY_MS;

  // Simpan di server store dengan index token itu sendiri
  await storeCsrfTokenOnServer(token, token, expiresAt);

  // Jika ada ID sesi / user, simpan juga dengan index sessionOrUserId (token unik per session)
  if (sessionOrUserId) {
    await storeCsrfTokenOnServer(sessionOrUserId, token, expiresAt);
  }

  return token;
}

/**
 * Memverifikasi Origin / Referer request terhadap domain resmi (https://brimas.vercel.app).
 * Pengecualian localhost hanya diaktifkan saat NODE_ENV === 'development'.
 * FAIL-CLOSED: Return valid: false jika Origin DAN Referer kosong, atau terjadi error.
 */
export async function verifyRequestOrigin(): Promise<{ valid: boolean; reason?: string }> {
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const origin = headersList.get("origin");
    const referer = headersList.get("referer");

    // Fail-Closed: Jika Origin DAN Referer sama-sama kosong
    if (!origin && !referer) {
      return { valid: false, reason: "Missing Origin and Referer headers" };
    }

    const targetHeader = origin || referer;
    if (!targetHeader) {
      return { valid: false, reason: "Missing Origin and Referer headers" };
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(targetHeader);
    } catch {
      return { valid: false, reason: "Malformed origin or referer header" };
    }

    const targetOrigin = targetUrl.origin.toLowerCase().trim();

    const allowedOrigins = [
      OFFICIAL_DOMAIN.toLowerCase(),
      ...(process.env.NODE_ENV === "development"
        ? ALLOWED_DEVELOPMENT_ORIGINS.map((o) => o.toLowerCase())
        : []),
    ];

    const isMatch = allowedOrigins.includes(targetOrigin);

    if (!isMatch) {
      return {
        valid: false,
        reason: `Origin mismatch: ${targetOrigin} is not in allowed origins (${allowedOrigins.join(", ")})`,
      };
    }

    return { valid: true };
  } catch (err) {
    // Fail-closed on error
    console.error("CSRF Origin verification error:", err);
    return { valid: false, reason: "Internal error during origin verification" };
  }
}

/**
 * Verifikasi CSRF Token 3-arah: cookie token === header token === server token.
 * Menggunakan constant-time comparison dan pengecekan masa berlaku (expiry).
 */
export async function verifyCsrfToken(
  submittedToken?: string | null,
  sessionOrUserId?: string | null
): Promise<boolean> {
  try {
    const { cookies, headers } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

    const headersList = await headers();
    const headerToken = submittedToken || headersList.get(CSRF_HEADER_NAME);

    // 1. Jika salah satu kosong -> langsung reject (false)
    if (!cookieToken || !headerToken) {
      return false;
    }

    // 2. Bandingkan cookieToken dan headerToken (Constant-Time Comparison)
    const isHeaderMatchingCookie = constantTimeCompare(cookieToken, headerToken);
    if (!isHeaderMatchingCookie) {
      return false;
    }

    // 3. Verifikasi 3-arah dengan server-side session store
    const identifier = sessionOrUserId || cookieToken;
    const serverRecord = await getCsrfTokenFromServer(identifier);

    if (!serverRecord) {
      // Token tidak ditemukan di server store / expired
      return false;
    }

    // Verifikasi token server cocok dengan cookie (Constant-Time Comparison)
    const isServerMatchingCookie = constantTimeCompare(cookieToken, serverRecord.token);
    if (!isServerMatchingCookie) {
      return false;
    }

    // Pastikan masa berlaku token belum habis
    if (serverRecord.expiresAt < Date.now()) {
      return false;
    }

    return true;
  } catch (err) {
    console.error("CSRF token verification error:", err);
    return false; // Fail-closed on error
  }
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };


