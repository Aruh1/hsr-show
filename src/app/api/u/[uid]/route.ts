import { NextResponse, NextRequest } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { updateTag } from "next/cache";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { getMihomoData } from "@/lib/mihomo";

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

        const uid = validateUID(params.uid);
        const lang = validateLang(req.nextUrl.searchParams.get("lang"));
        const forceUpdate = req.nextUrl.searchParams.get("force_update") === "true";

        if (forceUpdate) {
            // Immediate invalidation for this UID
            updateTag(`profile-${uid}`);
        }

        const responseBody = await getMihomoData(uid, lang);

        return NextResponse.json(
            {
                ...responseBody,
                timestamp: new Date().toISOString()
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
                }
            }
        );
    } catch (error: unknown) {
        unstable_rethrow(error);
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("Invalid UID")) {
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        if (errorMessage === "No characters found") {
            return NextResponse.json({ error: errorMessage }, { status: 404 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
