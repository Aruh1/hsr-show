import { NextResponse, NextRequest } from "next/server";

interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    backoffFactor: number;
    jitter: number;
}

// Retry configuration
const RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second initial delay
    backoffFactor: 2, // Exponential backoff
    jitter: 0.2 // 20% jitter to spread out retry attempts
};

// Enhanced fetch with retry mechanism
async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryConfig: RetryConfig = RETRY_CONFIG
): Promise<Response> {
    const { maxRetries, baseDelay, backoffFactor, jitter } = retryConfig;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // Successful response
            if (response.ok) {
                return response;
            }

            // Non-successful response (400-500 range)
            if (attempt === maxRetries) {
                // Last attempt failed
                console.error(`Fetch failed after ${maxRetries + 1} attempts. Status: ${response.status}`);
                throw new Error(`API request failed with status ${response.status}`);
            }

            // Calculate delay with exponential backoff and jitter
            const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
            console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms`);

            // Wait before next attempt
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            // Network errors or other fetch failures
            if (attempt === maxRetries) {
                console.error("Fetch failed after maximum retries:", error);
                throw error;
            }

            // Calculate delay for network errors
            const delay = calculateBackoffDelay(baseDelay, attempt, backoffFactor, jitter);
            console.warn(`Network error on attempt ${attempt + 1}. Retrying in ${delay}ms`);

            // Wait before next attempt
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error("Unexpected error in fetchWithRetry");
}

// Calculate exponential backoff with jitter
function calculateBackoffDelay(baseDelay: number, attempt: number, backoffFactor: number, jitter: number): number {
    // Calculate base exponential backoff
    const calculatedDelay = baseDelay * Math.pow(backoffFactor, attempt);

    // Add jitter to spread out retry attempts
    const jitterAmount = calculatedDelay * jitter * (Math.random() * 2 - 1);

    return Math.round(calculatedDelay + jitterAmount);
}

interface RouteContext {
    params: Promise<{ uid: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
    try {
        // Await params as per Next.js requirements
        const params = await context.params;

        // Validate inputs
        const uid = validateUID(params.uid);
        const lang = new URL(req.url).searchParams.get("lang") || "en";
        const force_update = new URL(req.url).searchParams.get("force_update") ?? "true";

        // Use the new fetchWithRetry for API calls
        const fetchWithErrorHandling = async (url: string) => {
            const response = await fetchWithRetry(url);
            return response.json();
        };

        // Concurrent fetches with retry mechanism
        const [data, infodata] = await Promise.all([
            fetchWithErrorHandling(
                `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}&is_force_update=${force_update}`
            ),
            fetchWithErrorHandling(`https://api.mihomo.me/sr_info/${uid}?lang=${lang}&is_force_update=${force_update}`)
        ]);

        // Early validation
        if (!data.characters?.length) {
            return NextResponse.json({ error: "No characters found" }, { status: 404 });
        }

        // Memoize and optimize character processing
        const processedCharacters = data.characters.map(processCharacter);

        // Update data with processed characters
        data.characters = processedCharacters;

        // Construct enhanced response
        return NextResponse.json({
            status: 200,
            ...data,
            ...infodata,
            timestamp: new Date().toISOString(),
            powered: "API mihomo: https://api.mihomo.me/"
        });
    } catch (error: unknown) {
        // Centralized error handling
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        // Differentiate between validation and other errors
        if (errorMessage.includes("Invalid UID")) {
            return NextResponse.json(
                {
                    error: errorMessage
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: errorMessage
            },
            { status: 500 }
        );
    }
}

// Input validation function
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
    // Efficient addition mapping for combining with base attributes
    const additionMap = new Map((character.additions || []).map(add => [add.field, add]));

    // Optimize attribute combination
    const combinedAttributes = [
        // Process base attributes with additions
        ...(character.attributes || []).map(attribute => {
            const addition = additionMap.get(attribute.field);
            const baseValue = parseFloat(attribute.display || "0");
            const additionValue = addition ? parseFloat(addition.display || "0") : 0;
            const totalValue = baseValue + additionValue;

            // Remove processed additions
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

    // Efficient relic set processing with Set to remove duplicates
    const relic_sets = Array.from(new Set((character.relic_sets || []).map(set => set.id))).map(id =>
        (character.relic_sets || []).find(set => set.id === id)
    );

    // Enhanced relic sub-affix processing
    const relics = (character.relics || []).map(relic => ({
        ...relic,
        sub_affix: (relic.sub_affix || []).map(sub_affix => {
            const { count, step } = sub_affix;
            // More concise distribution calculation
            const dist = Array(count)
                .fill(2)
                .map((_, index) => (index < step - count ? 2 : !step ? 0 : 1));
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
