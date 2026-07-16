import { cacheLife, cacheTag } from "next/cache";
import { RETRY_CONFIG, MIHOMO_API_URL } from "@/lib/constants";
import { processCharacter, type ApiCharacter } from "@/lib/processCharacter";
import { calculateCharacterScoreCached } from "./cachedScoring";
import type { ProfileData, Character } from "@/types";
import { getEnkaData } from "./enkaTransformer";
import { logger } from "./logger";
import { ExternalApiError, TimeoutError, NotFoundError, isAppError } from "./errors";

// ---------------------------------------------------------------------------
// Request Deduplication
// ---------------------------------------------------------------------------

/** Map of pending requests for deduplication */
const pendingRequests = new Map<string, Promise<Response>>();

// ---------------------------------------------------------------------------
// Retry Configuration
// ---------------------------------------------------------------------------

interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    backoffFactor: number;
    jitter: number;
    timeout: number;
}

// ---------------------------------------------------------------------------
// Retry-capable fetch with AbortController timeout and deduplication
// ---------------------------------------------------------------------------
async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    config: RetryConfig = RETRY_CONFIG
): Promise<Response> {
    const { maxRetries, baseDelay, backoffFactor, jitter, timeout } = config;

    // Deduplicate concurrent requests
    const pendingKey = `${url}:${options.method || "GET"}`;
    if (pendingRequests.has(pendingKey)) {
        logger.debug("Reusing pending request", { url });
        return pendingRequests.get(pendingKey)!.then(r => r.clone());
    }

    const requestPromise = (async () => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const response = await fetch(url, { ...options, signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) return response;

                if (attempt === maxRetries) {
                    throw new ExternalApiError(
                        `API request failed with status ${response.status}`,
                        new Error(`HTTP ${response.status}: ${response.statusText}`)
                    );
                }

                const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
                logger.warn(`Retrying request (attempt ${attempt + 1}/${maxRetries + 1})`, {
                    url,
                    status: response.status,
                    delayMs: delay
                });
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                clearTimeout(timeoutId);

                if (error instanceof Error && error.name === "AbortError") {
                    throw new TimeoutError(`Request timeout after ${timeout}ms`);
                }

                if (attempt === maxRetries) {
                    throw isAppError(error) ? error : new ExternalApiError("API request failed", error as Error);
                }

                const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
                logger.warn(`Retrying after error (attempt ${attempt + 1}/${maxRetries + 1})`, {
                    url,
                    error: error instanceof Error ? error.message : "Unknown error",
                    delayMs: delay
                });
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw new Error("Unexpected error in fetchWithRetry");
    })();

    pendingRequests.set(pendingKey, requestPromise);

    try {
        const result = await requestPromise;
        return result;
    } finally {
        pendingRequests.delete(pendingKey);
    }
}

function calculateBackoffDelay(baseDelay: number, attempt: number, backoffFactor: number, jitter: number): number {
    const calculatedDelay = baseDelay * Math.pow(backoffFactor, attempt);
    const jitterAmount = calculatedDelay * jitter * (Math.random() * 2 - 1);
    return Math.round(calculatedDelay + jitterAmount);
}

// ---------------------------------------------------------------------------
// Mihomo API Data Fetching
// ---------------------------------------------------------------------------

/**
 * Fetch data from Mihomo API with Next.js 16 'use cache' directive.
 * Falls back to Enka Network API if Mihomo fails.
 */
export async function getMihomoData(uid: string, lang: string): Promise<ProfileData> {
    "use cache";
    cacheLife("minutes");
    cacheTag("mihomo-profile", `profile-${uid}`, `profile-${uid}-${lang}`);

    const infoUrl = `${MIHOMO_API_URL}/sr_info_parsed/${uid}?lang=${lang}`;
    const rawUrl = `${MIHOMO_API_URL}/sr_info/${uid}?lang=${lang}`;

    logger.info("Fetching Mihomo data", { uid, lang });

    try {
        // Try Mihomo API first with Promise.allSettled for independent requests
        const [infoResult, rawResult] = await Promise.allSettled([
            fetchWithRetry(infoUrl).then(res => res.json()),
            fetchWithRetry(rawUrl)
                .then(res => res.json())
                .catch(() => ({ detailInfo: { platform: "unknown" } }))
        ]);

        // Check if info request failed
        if (infoResult.status === "rejected") {
            throw infoResult.reason;
        }

        const data = infoResult.value;
        const rawData = rawResult.status === "fulfilled" ? rawResult.value : { detailInfo: { platform: "unknown" } };

        if (!data.characters?.length) {
            throw new NotFoundError("No characters found");
        }

        // Process characters and pre-warm scoring cache
        data.characters = await Promise.all(
            data.characters.map(async (char: ApiCharacter) => {
                const processed = processCharacter(char);
                // Pre-warm scoring cache for each character asynchronously (fire-and-forget)
                void calculateCharacterScoreCached(processed as unknown as Character).catch(() => {
                    // Silently ignore scoring errors during pre-warming
                });
                return processed;
            })
        );

        logger.info("Successfully fetched Mihomo data", {
            uid,
            characterCount: data.characters.length
        });

        return {
            ...data,
            detailInfo: rawData.detailInfo ?? { platform: "unknown" },
            powered: `API mihomo: ${MIHOMO_API_URL}`
        } as ProfileData;
    } catch (mihomoError) {
        // Log Mihomo failure and try Enka Network API as fallback
        logger.warn("Mihomo API failed, trying Enka Network API", {
            uid,
            error: mihomoError instanceof Error ? mihomoError.message : "Unknown error"
        });

        try {
            const enkaData = await getEnkaData(uid, lang);

            // Pre-warm scoring cache for each character
            if (enkaData.characters?.length) {
                void Promise.all(
                    enkaData.characters.map(async (char: Character) => {
                        void calculateCharacterScoreCached(char).catch(() => {
                            // Silently ignore scoring errors during pre-warming
                        });
                    })
                );
            }

            logger.info("Successfully fetched Enka data as fallback", {
                uid,
                characterCount: enkaData.characters?.length ?? 0
            });

            return enkaData;
        } catch (enkaError) {
            // Both APIs failed
            const errorMessage = enkaError instanceof Error ? enkaError.message : "Unknown error";
            logger.error("Both Mihomo and Enka APIs failed", enkaError, { uid });

            throw new ExternalApiError(
                `Failed to fetch profile data: ${errorMessage}`,
                enkaError instanceof Error ? enkaError : new Error(String(enkaError))
            );
        }
    }
}
