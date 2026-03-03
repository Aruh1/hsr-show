/**
 * Character data processing utilities for the Mihomo API response.
 * Combines base attributes with additions, deduplicates relic sets,
 * and computes sub-affix roll distributions.
 */

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

export interface ApiCharacter {
    attributes: ApiAttribute[];
    additions: ApiAttribute[];
    relics: ApiRelic[];
    relic_sets: ApiRelicSet[];
    [key: string]: unknown;
}

export function processCharacter(character: ApiCharacter) {
    // Efficient addition mapping — single pass lookup
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

    // Efficient relic set deduplication — single pass
    const seenRelicIds = new Set<string>();
    const relic_sets = (character.relic_sets || []).filter(set => {
        if (seenRelicIds.has(set.id)) return false;
        seenRelicIds.add(set.id);
        return true;
    });

    // Sub-affix roll distribution calculation
    const relics = (character.relics || []).map(relic => ({
        ...relic,
        sub_affix: (relic.sub_affix || []).map(sub_affix => {
            const { count, step } = sub_affix;
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
