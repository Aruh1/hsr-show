import { NextResponse } from "next/server";

// Input validation function
function validateUID(uid) {
    if (!/^\d{1,10}$/.test(uid)) {
        throw new Error("Invalid UID. Must be a 1-10 digit integer.");
    }
    return uid;
}

export async function GET(req, context) {
    try {
        // Await params as per Next.js requirements
        const params = await context.params;

        // Validate inputs
        const uid = validateUID(params.uid);
        const lang = new URL(req.url).searchParams.get("lang") || "en";

        // Use a generic API error handler to reduce code duplication
        const fetchWithErrorHandling = async url => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            return response.json();
        };

        // Concurrent fetches for better performance
        const [data, infodata] = await Promise.all([
            fetchWithErrorHandling(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`),
            fetchWithErrorHandling(`https://api.mihomo.me/sr_info/${uid}?lang=${lang}`)
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
    } catch (error) {
        // Centralized error handling
        console.error(error);

        // Differentiate between validation and other errors
        if (error.message.includes("Invalid UID")) {
            return NextResponse.json(
                {
                    error: error.message
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || "Internal Server Error"
            },
            { status: 500 }
        );
    }
}

// Separate function for character processing to improve readability and potential reuse
function processCharacter(character) {
    // Efficient attribute and addition mapping
    const attributeMap = new Map((character.attributes || []).map(attr => [attr.field, attr]));
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
