/**
 * Rate Limiting Utility (Sliding Window Algorithm)
 * Used to protect against Brute Force, Spam, and Denial of Service (DoS) attacks.
 */

import { NextRequest } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 10 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((t) => now - t < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, { timestamps: validTimestamps });
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Mengambil IP address asli client di belakang proxy/CDN (misal Vercel).
 * x-forwarded-for bisa berisi banyak IP dipisah koma (proxy chain) — ambil yang pertama.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Checks whether a key has exceeded the allowed rate limit.
 *
 * @param key Unique identifier (e.g. IP address, User ID, or Email)
 * @param limit Maximum allowed requests within windowMs
 * @param windowMs Time window in milliseconds (default: 60000 = 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanupStaleRecords(windowMs);

  const record = rateLimitStore.get(key) || { timestamps: [] };
  const validTimestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = windowMs - (now - oldestTimestamp);

    return {
      success: false,
      limit,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  const oldestTimestamp = validTimestamps[0];
  const resetMs = windowMs - (now - oldestTimestamp);

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetMs: Math.max(0, resetMs),
  };
}

export async function checkRateLimitDistributed(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return checkRateLimit(key, limit, windowMs);

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["ZREMRANGEBYSCORE", key, 0, Date.now() - windowMs],
        ["ZCARD", key],
        ["ZADD", key, Date.now(), `${Date.now()}-${crypto.randomUUID()}`],
        ["EXPIRE", key, Math.ceil(windowMs / 1000)],
      ]),
      cache: "no-store",
    });
    if (!response.ok) return checkRateLimit(key, limit, windowMs);
    const results = (await response.json()) as Array<{ result: number }>;
    const count = Number(results[1]?.result ?? 0);
    if (count >= limit) {
      return { success: false, limit, remaining: 0, resetMs: windowMs };
    }
    return { success: true, limit, remaining: Math.max(0, limit - count - 1), resetMs: windowMs };
  } catch {
    return checkRateLimit(key, limit, windowMs);
  }
}

/**
 * Predefined Rate Limiting Preset Rules
 */
export const RATE_LIMIT_PRESETS = {
  AUTH_LOGIN: { limit: 5, windowMs: 60 * 1000 },
  AUTH_SIGNUP: { limit: 3, windowMs: 60 * 1000 },
  AUTH_OTP: { limit: 3, windowMs: 3 * 60 * 1000 },
  API_COMMENT: { limit: 10, windowMs: 60 * 1000 },
  API_COMMENT_IP: { limit: 30, windowMs: 60 * 1000 }, // batas gabungan semua akun dari 1 IP
  API_REACTION: { limit: 30, windowMs: 60 * 1000 },
  API_UPLOAD: { limit: 10, windowMs: 60 * 1000 },
  API_GUESTBOOK: { limit: 5, windowMs: 60 * 1000 },
};