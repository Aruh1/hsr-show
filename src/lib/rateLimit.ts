/**
 * Simple in-memory rate limiter for API endpoints.
 * For production with multiple instances, consider using Redis.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

interface RateLimitConfig {
    /** Maximum requests per window */
    maxRequests: number;
    /** Window duration in milliseconds */
    windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 60,
    windowMs: 60_000 // 1 minute
};

// In-memory store for rate limit entries
const store = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetTime < now) {
            store.delete(key);
        }
    }
}, 60_000);

/**
 * Check if a request should be rate limited
 * @param key - Unique identifier (e.g., IP address or user ID)
 * @param config - Rate limit configuration
 * @returns Object with success flag and remaining requests
 */
export function checkRateLimit(
    key: string,
    config: Partial<RateLimitConfig> = {}
): { success: boolean; remaining: number; resetTime: number } {
    const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
    const now = Date.now();

    const entry = store.get(key);

    if (!entry || entry.resetTime < now) {
        // Create new entry
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + windowMs
        };
        store.set(key, newEntry);

        return {
            success: true,
            remaining: maxRequests - 1,
            resetTime: newEntry.resetTime
        };
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetTime: entry.resetTime
        };
    }

    // Increment count
    entry.count++;
    return {
        success: true,
        remaining: maxRequests - entry.count,
        resetTime: entry.resetTime
    };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(remaining: number, resetTime: number): Record<string, string> {
    return {
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000))
    };
}

/**
 * Clear rate limit for a specific key (useful for testing)
 */
export function clearRateLimit(key: string): void {
    store.delete(key);
}
