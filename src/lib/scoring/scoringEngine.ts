import type { Character } from "@/types";
import type { CharacterProfile, ComputedStats, RelicScoreResult, CharacterScoreOutput, SubstatField } from "./types";
import { getCharacterProfile, CHARACTER_PROFILES } from "./characterProfiles";
import { estimateDps } from "./dpsEstimator";
import { rollValueAtQuality, maxRollValue, MIHOMO_TYPE_TO_FIELD } from "./substats";
import { getGrade } from "./grades";

/**
 * Main entry point: computes the full DPS score for a character.
 */
export function calculateCharacterScore(character: Character): CharacterScoreOutput {
    const profile = getCharacterProfile(character.id, character.element.id, character.path.id);
    const profileFound = character.id in CHARACTER_PROFILES;

    if (!character.relics.length) {
        return {
            overall: {
                baselineSimScore: 0,
                originalSimScore: 0,
                benchmarkSimScore: 0,
                perfectionSimScore: 0,
                percent: 0,
                grade: "?",
                gradeColor: "text-neutral-500"
            },
            relics: [],
            profileFound: false
        };
    }

    // 1. Extract actual stats from character data
    const originalStats = extractStats(character, profile);
    const originalSimScore = estimateDps(originalStats, profile.skillMultiplier);

    // 2. Baseline: stats with zero substat contribution
    const baselineStats = extractBaselineStats(character, profile);
    const baselineSimScore = estimateDps(baselineStats, profile.skillMultiplier);

    // 3. Benchmark: optimal substats at quality=0.8, 48 roll budget
    const benchmarkStats = calculateOptimalStats(character, profile, baselineStats, 0.8, 48);
    const benchmarkSimScore = estimateDps(benchmarkStats, profile.skillMultiplier);

    // 4. Perfection: optimal substats at quality=1.0, 54 roll budget
    const perfectionStats = calculateOptimalStats(character, profile, baselineStats, 1.0, 54);
    const perfectionSimScore = estimateDps(perfectionStats, profile.skillMultiplier);

    // 5. Piecewise linear interpolation
    let percent: number;
    if (perfectionSimScore <= benchmarkSimScore) {
        // Edge case: prevent division by zero
        percent = originalSimScore >= benchmarkSimScore ? 1.0 : 0.5;
    } else if (originalSimScore >= benchmarkSimScore) {
        percent = 1.0 + (originalSimScore - benchmarkSimScore) / (perfectionSimScore - benchmarkSimScore);
    } else if (benchmarkSimScore <= baselineSimScore) {
        percent = 0;
    } else {
        percent = (originalSimScore - baselineSimScore) / (benchmarkSimScore - baselineSimScore);
    }
    percent = Math.max(0, percent);

    // 6. Speed penalty
    if (profile.speedTarget && originalStats.speed < profile.speedTarget) {
        percent *= 0.9;
    }

    const { grade, color } = getGrade(percent);

    // 7. Per-relic scoring
    const relicScores = scoreRelics(character, profile);

    return {
        overall: {
            baselineSimScore,
            originalSimScore,
            benchmarkSimScore,
            perfectionSimScore,
            percent,
            grade,
            gradeColor: color
        },
        relics: relicScores,
        profileFound
    };
}

/**
 * Extract current total stats from the character's statistics array.
 */
function extractStats(character: Character, profile: CharacterProfile): ComputedStats {
    const statsMap = new Map(character.statistics.map(s => [s.field, s.value]));

    return {
        scalingStatValue: statsMap.get(profile.scalingStat) ?? 0,
        critRate: statsMap.get("crit_rate") ?? 0.05,
        critDmg: statsMap.get("crit_dmg") ?? 0.5,
        elementDmgBonus: statsMap.get(profile.elementDmgField) ?? 0,
        speed: statsMap.get("spd") ?? 100
    };
}

/**
 * Get a character's base stat value from the attributes array.
 */
function getBaseStatValue(character: Character, field: string): number {
    const attr = character.attributes.find(a => a.field === field);
    return attr?.value ?? 0;
}

/**
 * Calculate baseline stats by subtracting all substat contributions from total stats.
 */
function extractBaselineStats(character: Character, profile: CharacterProfile): ComputedStats {
    const statsMap = new Map(character.statistics.map(s => [s.field, s.value]));
    const baseAtk = getBaseStatValue(character, "atk");
    const baseHp = getBaseStatValue(character, "hp");
    const baseDef = getBaseStatValue(character, "def");

    // Subtract all substat contributions
    for (const relic of character.relics) {
        for (const sub of relic.sub_affix) {
            const subField = MIHOMO_TYPE_TO_FIELD[sub.type];
            if (!subField) continue;

            // Percentage substats for ATK/HP/DEF contribute scaledValue to the base stat total
            if (sub.type === "HPAddedRatio") {
                statsMap.set("hp", (statsMap.get("hp") ?? 0) - sub.value * baseHp);
            } else if (sub.type === "AttackAddedRatio") {
                statsMap.set("atk", (statsMap.get("atk") ?? 0) - sub.value * baseAtk);
            } else if (sub.type === "DefenceAddedRatio") {
                statsMap.set("def", (statsMap.get("def") ?? 0) - sub.value * baseDef);
            } else {
                // Flat or direct-addition stats (hp, atk, def, spd, crit_rate, crit_dmg, etc.)
                const field = sub.field;
                statsMap.set(field, (statsMap.get(field) ?? 0) - sub.value);
            }
        }
    }

    return {
        scalingStatValue: statsMap.get(profile.scalingStat) ?? 0,
        critRate: statsMap.get("crit_rate") ?? 0.05,
        critDmg: statsMap.get("crit_dmg") ?? 0.5,
        elementDmgBonus: statsMap.get(profile.elementDmgField) ?? 0,
        speed: statsMap.get("spd") ?? 100
    };
}

/**
 * Apply a single substat roll to a ComputedStats snapshot (immutable).
 */
function applySubstatRoll(
    stats: ComputedStats,
    profile: CharacterProfile,
    field: SubstatField,
    rollVal: number,
    baseAtk: number,
    baseHp: number,
    baseDef: number
): ComputedStats {
    const result = { ...stats };

    switch (field) {
        case "atk":
            if (profile.scalingStat === "atk") result.scalingStatValue += rollVal;
            break;
        case "atk_":
            if (profile.scalingStat === "atk") result.scalingStatValue += rollVal * baseAtk;
            break;
        case "hp":
            if (profile.scalingStat === "hp") result.scalingStatValue += rollVal;
            break;
        case "hp_":
            if (profile.scalingStat === "hp") result.scalingStatValue += rollVal * baseHp;
            break;
        case "def":
            if (profile.scalingStat === "def") result.scalingStatValue += rollVal;
            break;
        case "def_":
            if (profile.scalingStat === "def") result.scalingStatValue += rollVal * baseDef;
            break;
        case "crit_rate":
            result.critRate += rollVal;
            break;
        case "crit_dmg":
            result.critDmg += rollVal;
            break;
        case "spd":
            result.speed += rollVal;
            break;
        // effect_hit, effect_res, break_dmg don't affect our DPS formula directly
        // but carry weight via the greedy allocator's weight system
    }

    return result;
}

/**
 * Calculate optimal stats by greedily allocating rolls to maximize DPS.
 */
function calculateOptimalStats(
    character: Character,
    profile: CharacterProfile,
    baselineStats: ComputedStats,
    quality: number,
    rollBudget: number
): ComputedStats {
    const workingStats = { ...baselineStats };
    const baseAtk = getBaseStatValue(character, "atk");
    const baseHp = getBaseStatValue(character, "hp");
    const baseDef = getBaseStatValue(character, "def");

    const rollCounts: Partial<Record<SubstatField, number>> = {};
    const maxPerStat = Math.ceil(rollBudget * 0.55);

    const weightedFields = Object.entries(profile.substatWeights).filter(([, w]) => w && w > 0) as [
        SubstatField,
        number
    ][];

    for (let i = 0; i < rollBudget; i++) {
        let bestField: SubstatField | null = null;
        let bestGain = -1;

        const currentDps = estimateDps(workingStats, profile.skillMultiplier);

        for (const [field, weight] of weightedFields) {
            if ((rollCounts[field] ?? 0) >= maxPerStat) continue;

            const rollVal = rollValueAtQuality(field, quality);
            const testStats = applySubstatRoll(workingStats, profile, field, rollVal, baseAtk, baseHp, baseDef);
            const newDps = estimateDps(testStats, profile.skillMultiplier);
            const gain = (newDps - currentDps) * weight;

            if (gain > bestGain) {
                bestGain = gain;
                bestField = field;
            }
        }

        if (bestField) {
            const rollVal = rollValueAtQuality(bestField, quality);
            const updated = applySubstatRoll(workingStats, profile, bestField, rollVal, baseAtk, baseHp, baseDef);
            workingStats.scalingStatValue = updated.scalingStatValue;
            workingStats.critRate = updated.critRate;
            workingStats.critDmg = updated.critDmg;
            workingStats.elementDmgBonus = updated.elementDmgBonus;
            workingStats.speed = updated.speed;
            rollCounts[bestField] = (rollCounts[bestField] ?? 0) + 1;
        }
    }

    return workingStats;
}

/**
 * Score individual relics based on weighted substat value vs theoretical max.
 */
function scoreRelics(character: Character, profile: CharacterProfile): RelicScoreResult[] {
    return character.relics.map(relic => {
        let actualWeightedValue = 0;
        let maxWeightedValue = 0;

        // Max possible rolls for this relic (5-star +15 = 9 total substat rolls)
        const maxRolls = relic.rarity === 5 ? 9 : relic.rarity === 4 ? 8 : 6;

        // Score each substat
        for (const sub of relic.sub_affix) {
            const subField = MIHOMO_TYPE_TO_FIELD[sub.type];
            if (!subField) continue;
            const weight = profile.substatWeights[subField] ?? 0;
            const maxVal = maxRollValue(subField);
            // Normalize: value / (maxRollValue * count) gives quality per roll
            // Multiply by count and weight for total contribution
            if (maxVal > 0) {
                actualWeightedValue += (sub.value / maxVal) * weight;
            }
        }

        // Theoretical max: best 4 weighted substats all at max rolls
        const sortedWeights = Object.entries(profile.substatWeights)
            .filter(([, w]) => w && w > 0)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4);

        let remainingRolls = maxRolls;
        for (const [, weight] of sortedWeights) {
            const rollsForStat = Math.min(remainingRolls, Math.ceil(maxRolls / 3));
            maxWeightedValue += rollsForStat * weight;
            remainingRolls -= rollsForStat;
            if (remainingRolls <= 0) break;
        }

        const score = maxWeightedValue > 0 ? Math.min(actualWeightedValue / maxWeightedValue, 2.0) : 0;
        const { grade, color } = getGrade(score);

        return {
            relicId: relic.id,
            score,
            displayScore: (score * 100).toFixed(1),
            grade,
            gradeColor: color
        };
    });
}
