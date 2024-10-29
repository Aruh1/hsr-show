import { NextResponse } from "next/server";

export async function GET(req, props) {
    try {
        const params = await props.params;
        const { uid } = params;
        const { searchParams } = new URL(req.url);
        const lang = searchParams.get("lang");

        // Validasi UID
        if (!/^\d+$/.test(uid) || uid.length > 10) {
            return NextResponse.json(
                { error: "Invalid UID. Must be an integer and up to 10 characters long." },
                { status: 400 }
            );
        }

        const res = await fetch(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=${lang}`);
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
        }

        const data = await res.json();

        for (const character of data["characters"]) {
            const attributeMap = {};
            character["attributes"].forEach(attribute => {
                attributeMap[attribute.field] = attribute;
            });

            const additionMap = {};
            character["additions"].forEach(addition => {
                additionMap[addition.field] = addition;
            });

            const combinedAttributes = [];

            // Gabungkan atribut dan tambahan
            character["attributes"].forEach(attribute => {
                const addition = additionMap[attribute.field];
                const totalValue =
                    parseFloat(attribute.display || "0") + (addition ? parseFloat(addition.display || "0") : 0);

                combinedAttributes.push({
                    name: attribute.name,
                    icon: attribute.icon,
                    base: attribute.display || 0,
                    addition: addition ? addition.value || 0 : 0,
                    value: addition ? attribute.value + addition.value : attribute.value,
                    display: totalValue.toFixed(attribute.percent ? 1 : 0) + (attribute.percent ? "%" : "")
                });

                // Tandai tambahan sebagai telah diproses
                if (addition) {
                    additionMap[attribute.field] = null;
                }
            });

            // Proses tambahan yang tidak diproses
            character["additions"].forEach(addition => {
                if (additionMap[addition.field] !== null) {
                    combinedAttributes.push({
                        name: addition.name,
                        icon: addition.icon,
                        value: addition.value,
                        display: addition.display
                    });
                }
            });

            const set_map = new Map();

            for (const relic_set of character["relic_sets"]) {
                const { id, num } = relic_set;
                if (!set_map.has(id) || num > set_map.get(id).num) {
                    set_map.set(id, relic_set);
                }
            }

            character["relic_sets"] = Array.from(set_map.values());

            character.property = combinedAttributes;

            for (const relic of character["relics"]) {
                for (const sub_affix of relic["sub_affix"]) {
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
                    sub_affix["dist"] = dist;
                }
            }
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
