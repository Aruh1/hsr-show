import { NextResponse } from "next/server";

export async function GET(req, props) {
    try {
        const params = await props.params;
        const { uid } = params;
        const { searchParams } = new URL(req.url);
        const lang = searchParams.get("lang") || "en";

        if (!uid) {
            return NextResponse.json({ error: "Missing UID parameter." }, { status: 400 });
        }

        if (!/^\d+$/.test(uid) || uid.length > 10) {
            return NextResponse.json(
                { error: "Invalid UID. Must be an integer and up to 10 characters long." },
                { status: 400 }
            );
        }

        const apiUrl = `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.error("Fetch request failed:", res.status, res.statusText);
            return NextResponse.json(
                { error: `Failed to fetch data: ${res.status} ${res.statusText}` },
                { status: res.status }
            );
        }

        const data = await res.json();

        if (!data.characters) {
            return NextResponse.json({ error: "No characters found in data." }, { status: 404 });
        }

        for (const character of data.characters) {
            const attributeMap = new Map();
            const additionMap = new Map();

            character.attributes?.forEach(attribute => {
                attributeMap.set(attribute.field, attribute);
            });

            character.additions?.forEach(addition => {
                additionMap.set(addition.field, addition);
            });

            const combinedAttributes = [];

            character.attributes?.forEach(attribute => {
                const addition = additionMap.get(attribute.field);
                const attributeDisplay = parseFloat(attribute.display || "0");
                const additionDisplay = addition ? parseFloat(addition.display || "0") : 0;
                const totalValue = attributeDisplay + additionDisplay;

                combinedAttributes.push({
                    name: attribute.name,
                    icon: attribute.icon,
                    base: attribute.display || 0,
                    addition: addition ? addition.value || 0 : 0,
                    value: addition ? attribute.value + addition.value : attribute.value,
                    display: totalValue.toFixed(attribute.percent ? 1 : 0) + (attribute.percent ? "%" : "")
                });

                if (addition) {
                    additionMap.set(attribute.field, null);
                }
            });

            character.additions?.forEach(addition => {
                if (additionMap.get(addition.field) !== null) {
                    combinedAttributes.push({
                        name: addition.name,
                        icon: addition.icon,
                        value: addition.value,
                        display: addition.display
                    });
                }
            });

            const setMap = new Map();

            character.relic_sets?.forEach(relic_set => {
                const { id, num } = relic_set;
                if (!setMap.has(id) || num > setMap.get(id).num) {
                    setMap.set(id, relic_set);
                }
            });

            character.relic_sets = Array.from(setMap.values());
            character.property = combinedAttributes;

            character.relics?.forEach(relic => {
                relic.sub_affix?.forEach(sub_affix => {
                    const dist = [];
                    const { count, step } = sub_affix;
                    for (let d = 0; d < count; d++) {
                        if (d < step - count) {
                            dist[d] = 2;
                        } else if (!step) {
                            dist[d] = 0;
                        } else {
                            dist[d] = 1;
                        }
                    }
                    sub_affix.dist = dist;
                });
            });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
