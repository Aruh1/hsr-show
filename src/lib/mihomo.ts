import { cacheLife, cacheTag } from "next/cache";
import { RETRY_CONFIG } from "@/lib/constants";
import { processCharacter, type ApiCharacter } from "@/lib/processCharacter";
import { calculateCharacterScore } from "@/lib/scoring";
import type { ProfileData, Character } from "@/types";

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

/**
 * Fetch data from Mihomo API with Next.js 16 'use cache' directive.
 */
export async function getMihomoData(uid: string, lang: string) {
    "use cache";
    cacheLife("minutes");
    cacheTag("mihomo-profile", `profile-${uid}`, `profile-${uid}-${lang}`);

    const infoUrl = `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`;
    const rawUrl = `https://api.mihomo.me/sr_info/${uid}?lang=${lang}`;

    // Concurrent upstream fetches
    const [data, rawData] = await Promise.all([
        fetchWithRetry(infoUrl).then(res => res.json()),
        fetchWithRetry(rawUrl)
            .then(res => res.json())
            .catch(() => ({ detailInfo: { platform: "unknown" } }))
    ]);

    if (!data.characters?.length) {
        throw new Error("No characters found");
    }

    // Process characters and pre-warm scoring cache
    data.characters = await Promise.all(
        data.characters.map(async (char: ApiCharacter) => {
            const processed = processCharacter(char);
            // Pre-warm scoring cache for each character asynchronously
            void calculateCharacterScore(processed as unknown as Character);
            return processed;
        })
    );

    return {
        ...data,
        detailInfo: rawData.detailInfo ?? { platform: "unknown" },
        powered: "API mihomo: https://api.mihomo.me/"
    } as ProfileData;
}
