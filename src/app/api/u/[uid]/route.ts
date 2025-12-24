import { NextResponse, NextRequest } from "next/server";

interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    backoffFactor: number;
    jitter: number;
    timeout: number;
}

// Retry configuration with timeout
const RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    backoffFactor: 2,
    jitter: 0.2,
    timeout: 10000 // 10 second timeout
};

// Enhanced fetch with retry mechanism and timeout
async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryConfig: RetryConfig = RETRY_CONFIG
): Promise<Response> {
    const { maxRetries, baseDelay, backoffFactor, jitter, timeout } = retryConfig;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                return response;
            }

            if (attempt === maxRetries) {
                console.error(`Fetch failed after ${maxRetries + 1} attempts. Status: ${response.status}`);
                throw new Error(`API request failed with status ${response.status}`);
            }

            const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
            console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            clearTimeout(timeoutId);

            if (attempt === maxRetries) {
                console.error("Fetch failed after maximum retries:", error);
                throw error;
            }

            const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
            console.warn(`Network error on attempt ${attempt + 1}. Retrying in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error("Unexpected error in fetchWithRetry");
}

// Calculate exponential backoff with jitter
function calculateBackoffDelay(baseDelay: number, attempt: number, backoffFactor: number, jitter: number): number {
    const calculatedDelay = baseDelay * Math.pow(backoffFactor, attempt);
    const jitterAmount = calculatedDelay * jitter * (Math.random() * 2 - 1);
    return Math.round(calculatedDelay + jitterAmount);
}

interface RouteContext {
    params: Promise<{ uid: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const params = await context.params;

        // Validate inputs - parse URL once
        const { searchParams } = new URL(req.url);
        const uid = validateUID(params.uid);
        const lang = searchParams.get("lang") || "en";
        const force_update = searchParams.get("force_update") ?? "true";

        // Concurrent fetches with retry mechanism
        const [data, infodata] = await Promise.all([
            fetchWithRetry(
                `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}&is_force_update=${force_update}`
            ).then(res => res.json()),
            fetchWithRetry(`https://api.mihomo.me/sr_info/${uid}?lang=${lang}&is_force_update=${force_update}`).then(
                res => res.json()
            )
        ]);

        // Early validation
        if (!data.characters?.length) {
            return NextResponse.json({ error: "No characters found" }, { status: 404 });
        }

        // Process characters
        const processedCharacters = data.characters.map(processCharacter);
        data.characters = processedCharacters;

        // Construct response with caching headers
        return NextResponse.json(
            {
                status: 200,
                ...data,
                detailInfo: infodata.detailInfo,
                timestamp: new Date().toISOString(),
                powered: "API mihomo: https://api.mihomo.me/"
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
                }
            }
        );
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("Invalid UID")) {
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// Input validation
function validateUID(uid: string): string {
    if (!/^\d{1,10}$/.test(uid)) {
        throw new Error("Invalid UID. Must be a 1-10 digit integer.");
    }
    return uid;
}

interface ApiAttribute {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent?: boolean;
}

interface ApiSubAffix {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    count: number;
    step: number;
}

interface ApiRelic {
    id: string;
    sub_affix: ApiSubAffix[];
    [key: string]: unknown;
}

interface ApiRelicSet {
    id: string;
    [key: string]: unknown;
}

interface ApiCharacter {
    attributes: ApiAttribute[];
    additions: ApiAttribute[];
    relics: ApiRelic[];
    relic_sets: ApiRelicSet[];
    [key: string]: unknown;
}

function processCharacter(character: ApiCharacter) {
    // Efficient addition mapping
    const additionMap = new Map((character.additions || []).map(add => [add.field, add]));

    // Combine base attributes with additions
    const combinedAttributes = [
        ...(character.attributes || []).map(attribute => {
            const addition = additionMap.get(attribute.field);
            const baseValue = parseFloat(attribute.display || "0");
            const additionValue = addition ? parseFloat(addition.display || "0") : 0;
            const totalValue = baseValue + additionValue;

            if (addition) {
                additionMap.delete(attribute.field);
            }

            return {
                name: attribute.name,
                icon: attribute.icon,
                base: baseValue,
                addition: addition?.value || 0,
                value: addition ? attribute.value + addition.value : attribute.value,
                display: totalValue.toFixed(attribute.percent ? 1 : 0) + (attribute.percent ? "%" : "")
            };
        }),
        // Add remaining unmatched additions
        ...[...additionMap.values()].map(addition => ({
            name: addition.name,
            icon: addition.icon,
            value: addition.value,
            display: addition.display
        }))
    ];

    // Efficient relic set deduplication - single pass
    const seenRelicIds = new Set<string>();
    const relic_sets = (character.relic_sets || []).filter(set => {
        if (seenRelicIds.has(set.id)) return false;
        seenRelicIds.add(set.id);
        return true;
    });

    // Enhanced relic sub-affix processing with clearer logic
    const relics = (character.relics || []).map(relic => ({
        ...relic,
        sub_affix: (relic.sub_affix || []).map(sub_affix => {
            const { count, step } = sub_affix;
            // Calculate distribution: high rolls (2) first, then low rolls (1)
            const highRolls = step - count;
            const dist: number[] = [];
            for (let i = 0; i < count; i++) {
                dist.push(i < highRolls ? 2 : step === 0 ? 0 : 1);
            }
            return { ...sub_affix, dist };
        })
    }));

    return {
        ...character,
        property: combinedAttributes,
        relic_sets,
        relics
    };
}
