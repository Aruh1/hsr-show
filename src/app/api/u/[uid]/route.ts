import { NextResponse, NextRequest } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { updateTag } from "next/cache";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { getMihomoData } from "@/lib/mihomo";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";
import { ValidationError, isAppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

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
        throw new ValidationError("Invalid UID. Must be a 1-10 digit integer.", "INVALID_UID");
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
        const uid = validateUID(params.uid);
        const lang = validateLang(req.nextUrl.searchParams.get("lang"));
        const forceUpdate = req.nextUrl.searchParams.get("force_update") === "true";

        // Rate limiting - use IP or fallback to UID
        const forwardedFor = req.headers.get("x-forwarded-for");
        const clientKey = forwardedFor?.split(",")[0]?.trim() || `uid:${uid}`;
        const rateLimitResult = checkRateLimit(clientKey, { maxRequests: 100, windowMs: 60_000 });

        if (!rateLimitResult.success) {
            logger.warn("Rate limit exceeded", { clientKey, uid });
            return NextResponse.json(
                { error: "Too many requests. Please try again later.", code: "RATE_LIMIT" },
                {
                    status: 429,
                    headers: {
                        ...getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime),
                        "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
                    }
                }
            );
        }

        if (forceUpdate) {
            // Immediate invalidation for this UID
            updateTag(`profile-${uid}`);
            logger.info("Force update requested", { uid, lang });
        }

        const responseBody = await getMihomoData(uid, lang);

        const response = NextResponse.json(
            {
                ...responseBody,
                timestamp: new Date().toISOString()
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                    ...getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime)
                }
            }
        );

        return response;
    } catch (error: unknown) {
        unstable_rethrow(error);

        // Handle known error types
        if (isAppError(error)) {
            logger.error("API error", error, { uid: (await context.params).uid });

            return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
        }

        // Handle unknown errors
        logger.error("Unexpected API error", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({ error: errorMessage, code: "INTERNAL_ERROR" }, { status: 500 });
    }
}
