import { NextResponse, NextRequest } from "next/server";
import { RETRY_CONFIG, SUPPORTED_LANGUAGES } from "@/lib/constants";
import { processCharacter } from "@/lib/processCharacter";

// ---------------------------------------------------------------------------
// In-memory LRU cache with TTL
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 60_000; // 60 seconds
const CACHE_MAX_SIZE = 200;

interface CacheEntry {
    data: unknown;
    expiry: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }
    // Re-insert to mark as recently used for LRU behavior
    cache.delete(key);
    cache.set(key, entry);
    return entry.data;
}

function setCache(key: string, data: unknown): void {
    // Evict oldest entries when capacity is exceeded
    if (cache.size >= CACHE_MAX_SIZE) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) cache.delete(oldestKey);
    }
    cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

// ---------------------------------------------------------------------------
// Retry-capable fetch with AbortController timeout
// ---------------------------------------------------------------------------
async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
    const { maxRetries, baseDelay, backoffFactor, jitter, timeout } = RETRY_CONFIG;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) return response;

            if (attempt === maxRetries) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            clearTimeout(timeoutId);

            if (attempt === maxRetries) throw error;

            const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error("Unexpected error in fetchWithRetry");
}

function calculateBackoffDelay(baseDelay: number, attempt: number, backoffFactor: number, jitter: number): number {
    const calculatedDelay = baseDelay * Math.pow(backoffFactor, attempt);
    const jitterAmount = calculatedDelay * jitter * (Math.random() * 2 - 1);
    return Math.round(calculatedDelay + jitterAmount);
}

// ---------------------------------------------------------------------------
// Supported language codes set (fast lookup)
// ---------------------------------------------------------------------------
const VALID_LANGUAGES: Set<string> = new Set(SUPPORTED_LANGUAGES.map(l => l.code));

function validateLang(lang: string | null): string {
    if (lang && VALID_LANGUAGES.has(lang)) return lang;
    return "en";
}

// ---------------------------------------------------------------------------
// UID validation
// ---------------------------------------------------------------------------
function validateUID(uid: string): string {
    if (!/^\d{1,10}$/.test(uid)) {
        throw new Error("Invalid UID. Must be a 1-10 digit integer.");
    }
    return uid;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
interface RouteContext {
    params: Promise<{ uid: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const params = await context.params;

        // Use nextUrl — already parsed, no need to create new URL
        const uid = validateUID(params.uid);
        const lang = validateLang(req.nextUrl.searchParams.get("lang"));
        // Sanitize force_update: only accept "true", default to "false" (caching enabled)
        const forceUpdate = req.nextUrl.searchParams.get("force_update") === "true" ? "true" : "false";

        // Check cache (bypass on force_update=true)
        const cacheKey = `${uid}:${lang}`;
        if (forceUpdate !== "true") {
            const cached = getCached(cacheKey);
            if (cached) {
                return NextResponse.json(cached, {
                    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" }
                });
            }
        }

        // Build upstream URLs with encoded params to prevent injection
        const parsedUrl = encodeURIComponent(uid);
        const parsedLang = encodeURIComponent(lang);
        const infoUrl = `https://api.mihomo.me/sr_info_parsed/${parsedUrl}?lang=${parsedLang}&is_force_update=${forceUpdate}`;
        const rawUrl = `https://api.mihomo.me/sr_info/${parsedUrl}?lang=${parsedLang}&is_force_update=${forceUpdate}`;

        // Concurrent upstream fetches — detailInfo is non-blocking
        const [data, detailInfo] = await Promise.all([
            fetchWithRetry(infoUrl).then(res => res.json()),

            // Secondary call: gracefully degrade if it fails
            fetchWithRetry(rawUrl)
                .then(res => res.json())
                .then(json => json.detailInfo ?? { platform: "unknown" })
                .catch(() => ({ platform: "unknown" }))
        ]);

        // Early validation
        if (!data.characters?.length) {
            return NextResponse.json({ error: "No characters found" }, { status: 404 });
        }

        // Process characters
        data.characters = data.characters.map(processCharacter);

        const responseBody = {
            ...data,
            detailInfo,
            timestamp: new Date().toISOString(),
            powered: "API mihomo: https://api.mihomo.me/"
        };

        // Populate cache for subsequent requests
        setCache(cacheKey, responseBody);

        return NextResponse.json(responseBody, {
            headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" }
        });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("Invalid UID")) {
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
