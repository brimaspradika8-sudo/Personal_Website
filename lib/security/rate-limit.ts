/**
 * Rate Limiting Utility (Sliding Window Algorithm)
 * Used to protect against Brute Force, Spam, and Denial of Service (DoS) attacks.
 */

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

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Predefined Rate Limiting Preset Rules
 */
export const RATE_LIMIT_PRESETS = {
  AUTH_LOGIN: { limit: 5, windowMs: 60 * 1000 },       // 5 login attempts / min
  AUTH_SIGNUP: { limit: 3, windowMs: 60 * 1000 },      // 3 signup attempts / min
  AUTH_OTP: { limit: 3, windowMs: 3 * 60 * 1000 },     // 3 OTP requests / 3 mins
  API_COMMENT: { limit: 10, windowMs: 60 * 1000 },     // 10 comments / min
  API_REACTION: { limit: 30, windowMs: 60 * 1000 },    // 30 reactions / min
  API_UPLOAD: { limit: 10, windowMs: 60 * 1000 },      // 10 file uploads / min
  API_GUESTBOOK: { limit: 5, windowMs: 60 * 1000 },    // 5 guestbook posts / min
};
