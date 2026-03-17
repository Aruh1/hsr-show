import type { ComputedStats } from "./types";

/**
 * Generalized DPS estimation formula.
 *
 * DPS = ScalingStat * SkillMultiplier * CritFactor * ElementFactor
 *
 * CritFactor = 1 + min(CritRate, 1.0) * CritDMG
 * ElementFactor = 1 + ElementalDMG%
 *
 * DEF/RES multipliers are constant across all comparisons (same enemy target)
 * and cancel out in the ratio, so they are omitted.
 */
export function estimateDps(stats: ComputedStats, skillMultiplier: number): number {
    const critFactor = 1 + Math.min(stats.critRate, 1.0) * stats.critDmg;
    const elementFactor = 1 + stats.elementDmgBonus;
    return stats.scalingStatValue * skillMultiplier * critFactor * elementFactor;
}
