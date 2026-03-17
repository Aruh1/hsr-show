import type { Character } from "@/types";
import type { CharacterProfile, ComputedStats, RelicScoreResult, CharacterScoreOutput, SubstatField } from "./types";
import { getCharacterProfile, CHARACTER_PROFILES } from "./characterProfiles";
import { estimateDps } from "./dpsEstimator";
import { rollValueAtQuality, maxRollValue, MIHOMO_TYPE_TO_FIELD } from "./substats";
import { getGrade } from "./grades";

interface BaseStats {
    atk: number;
    hp: number;
    def: number;
}

/**
 * Main entry point: computes the full DPS score for a character.
 */
export function calculateCharacterScore(character: Character): CharacterScoreOutput {
    const profileFound = character.id in CHARACTER_PROFILES;
    const profile = getCharacterProfile(character.id, character.element.id, character.path.id);

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
            profileFound
        };
    }

    // Build shared lookups once
    const statsMap = new Map(character.statistics.map(s => [s.field, s.value]));
    const baseStats: BaseStats = {
        atk: character.attributes.find(a => a.field === "atk")?.value ?? 0,
        hp: character.attributes.find(a => a.field === "hp")?.value ?? 0,
        def: character.attributes.find(a => a.field === "def")?.value ?? 0
    };

    // 1. Extract actual stats from character data
    const originalStats = buildComputedStats(statsMap, profile);
    const originalSimScore = estimateDps(originalStats, profile.skillMultiplier);

    // 2. Baseline: stats with zero substat contribution
    const baselineStats = extractBaselineStats(character, profile, statsMap, baseStats);
    const baselineSimScore = estimateDps(baselineStats, profile.skillMultiplier);

    // 3. Benchmark: optimal substats at quality=0.8, 48 roll budget
    const benchmarkStats = calculateOptimalStats(profile, baselineStats, baseStats, 0.8, 48);
    const benchmarkSimScore = estimateDps(benchmarkStats, profile.skillMultiplier);

    // 4. Perfection: optimal substats at quality=1.0, 54 roll budget
    const perfectionStats = calculateOptimalStats(profile, baselineStats, baseStats, 1.0, 54);
    const perfectionSimScore = estimateDps(perfectionStats, profile.skillMultiplier);

    // 5. Piecewise linear interpolation
    let percent: number;
    if (perfectionSimScore <= benchmarkSimScore) {
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
 * Build ComputedStats from a stats map.
 */
function buildComputedStats(statsMap: Map<string, number>, profile: CharacterProfile): ComputedStats {
    return {
        scalingStatValue: statsMap.get(profile.scalingStat) ?? 0,
        critRate: statsMap.get("crit_rate") ?? 0.05,
        critDmg: statsMap.get("crit_dmg") ?? 0.5,
        elementDmgBonus: statsMap.get(profile.elementDmgField) ?? 0,
        speed: statsMap.get("spd") ?? 100
    };
}

/**
 * Calculate baseline stats by subtracting all substat contributions from total stats.
 */
function extractBaselineStats(
    character: Character,
    profile: CharacterProfile,
    statsMap: Map<string, number>,
    baseStats: BaseStats
): ComputedStats {
    // Clone the map to avoid mutating the shared one
    const workingMap = new Map(statsMap);

    // Aggregate all substat contributions first, then subtract
    const substatTotals = new Map<string, number>();
    for (const relic of character.relics) {
        for (const sub of relic.sub_affix) {
            if (!MIHOMO_TYPE_TO_FIELD[sub.type]) continue;

            let field: string;
            let contribution: number;

            if (sub.type === "HPAddedRatio") {
                field = "hp";
                contribution = sub.value * baseStats.hp;
            } else if (sub.type === "AttackAddedRatio") {
                field = "atk";
                contribution = sub.value * baseStats.atk;
            } else if (sub.type === "DefenceAddedRatio") {
                field = "def";
                contribution = sub.value * baseStats.def;
            } else {
                field = sub.field;
                contribution = sub.value;
            }

            substatTotals.set(field, (substatTotals.get(field) ?? 0) + contribution);
        }
    }

    // Subtract aggregated totals
    for (const [field, total] of substatTotals) {
        workingMap.set(field, (workingMap.get(field) ?? 0) - total);
    }

    return buildComputedStats(workingMap, profile);
}

/**
 * Apply a single substat roll to ComputedStats (immutable).
 */
function applySubstatRoll(
    stats: ComputedStats,
    profile: CharacterProfile,
    field: SubstatField,
    rollVal: number,
    baseStats: BaseStats
): ComputedStats {
    const result = { ...stats };

    switch (field) {
        case "atk":
            if (profile.scalingStat === "atk") result.scalingStatValue += rollVal;
            break;
        case "atk_":
            if (profile.scalingStat === "atk") result.scalingStatValue += rollVal * baseStats.atk;
            break;
        case "hp":
            if (profile.scalingStat === "hp") result.scalingStatValue += rollVal;
            break;
        case "hp_":
            if (profile.scalingStat === "hp") result.scalingStatValue += rollVal * baseStats.hp;
            break;
        case "def":
            if (profile.scalingStat === "def") result.scalingStatValue += rollVal;
            break;
        case "def_":
            if (profile.scalingStat === "def") result.scalingStatValue += rollVal * baseStats.def;
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
    }

    return result;
}

/**
 * Calculate optimal stats by greedily allocating rolls to maximize DPS.
 * Non-DPS substats (effect_hit, effect_res, break_dmg) are allocated proportionally
 * by weight since they don't affect the DPS formula directly.
 */
function calculateOptimalStats(
    profile: CharacterProfile,
    baselineStats: ComputedStats,
    baseStats: BaseStats,
    quality: number,
    rollBudget: number
): ComputedStats {
    let workingStats = { ...baselineStats };
    const rollCounts: Partial<Record<SubstatField, number>> = {};
    const maxPerStat = Math.ceil(rollBudget * 0.55);

    const weightedFields = Object.entries(profile.substatWeights).filter(([, w]) => w && w > 0) as [
        SubstatField,
        number
    ][];

    // Precompute roll values once (quality is constant)
    const rollValues = new Map(weightedFields.map(([field]) => [field, rollValueAtQuality(field, quality)]));

    // Separate DPS-affecting and non-DPS substats
    const DPS_FIELDS = new Set<SubstatField>([
        "atk",
        "atk_",
        "hp",
        "hp_",
        "def",
        "def_",
        "crit_rate",
        "crit_dmg",
        "spd"
    ]);
    const dpsFields = weightedFields.filter(([f]) => DPS_FIELDS.has(f));
    const nonDpsFields = weightedFields.filter(([f]) => !DPS_FIELDS.has(f));

    // Allocate non-DPS substats proportionally by weight first
    const totalNonDpsWeight = nonDpsFields.reduce((sum, [, w]) => sum + w, 0);
    const totalWeight = weightedFields.reduce((sum, [, w]) => sum + w, 0);
    const nonDpsRollBudget = totalWeight > 0 ? Math.round(rollBudget * (totalNonDpsWeight / totalWeight)) : 0;
    const dpsRollBudget = rollBudget - nonDpsRollBudget;

    // Distribute non-DPS rolls proportionally
    for (const [field, weight] of nonDpsFields) {
        const rolls = totalNonDpsWeight > 0 ? Math.round(nonDpsRollBudget * (weight / totalNonDpsWeight)) : 0;
        rollCounts[field] = Math.min(rolls, maxPerStat);
    }

    // Greedy allocation for DPS-affecting substats
    let currentDps = estimateDps(workingStats, profile.skillMultiplier);

    for (let i = 0; i < dpsRollBudget; i++) {
        let bestField: SubstatField | null = null;
        let bestGain = -1;
        let bestStats: ComputedStats | null = null;

        for (const [field, weight] of dpsFields) {
            if ((rollCounts[field] ?? 0) >= maxPerStat) continue;

            const rollVal = rollValues.get(field)!;
            const testStats = applySubstatRoll(workingStats, profile, field, rollVal, baseStats);
            const newDps = estimateDps(testStats, profile.skillMultiplier);
            const gain = (newDps - currentDps) * weight;

            if (gain > bestGain) {
                bestGain = gain;
                bestField = field;
                bestStats = testStats;
            }
        }

        if (bestField && bestStats) {
            workingStats = bestStats;
            currentDps = estimateDps(workingStats, profile.skillMultiplier);
            rollCounts[bestField] = (rollCounts[bestField] ?? 0) + 1;
        }
    }

    return workingStats;
}

/**
 * Score individual relics based on weighted substat value vs theoretical max.
 */
function scoreRelics(character: Character, profile: CharacterProfile): RelicScoreResult[] {
    // Compute sorted weights once (invariant across relics)
    const sortedWeights = Object.entries(profile.substatWeights)
        .filter(([, w]) => w && w > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    return character.relics.map(relic => {
        let actualWeightedValue = 0;

        const maxRolls = relic.rarity === 5 ? 9 : relic.rarity === 4 ? 8 : 6;

        for (const sub of relic.sub_affix) {
            const subField = MIHOMO_TYPE_TO_FIELD[sub.type];
            if (!subField) continue;
            const weight = profile.substatWeights[subField] ?? 0;
            const maxVal = maxRollValue(subField);
            if (maxVal > 0) {
                actualWeightedValue += (sub.value / maxVal) * weight;
            }
        }

        // Theoretical max for this relic
        let maxWeightedValue = 0;
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
