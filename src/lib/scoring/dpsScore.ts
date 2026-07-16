/**
 * DPS Score calculation and grading system.
 * Based on HSR Optimizer methodology for build evaluation.
 */

import type { CharacterProfile } from "./types";

/**
 * Simulation score grades based on HSR Optimizer scale.
 * SS at 100% is the benchmark for a well-optimized build.
 */
export const SIM_SCORE_GRADES: { threshold: number; grade: string; color: string }[] = [
    { threshold: 1.5, grade: "AEON", color: "text-amber-200" }, // Verified only
    { threshold: 1.4, grade: "WTF+", color: "text-rose-300" }, // 140%+
    { threshold: 1.3, grade: "WTF", color: "text-rose-400" }, // 130%+
    { threshold: 1.21, grade: "SSS+", color: "text-orange-300" }, // 121%+
    { threshold: 1.13, grade: "SSS", color: "text-orange-400" }, // 113%+
    { threshold: 1.06, grade: "SS+", color: "text-amber-300" }, // 106%+
    { threshold: 1.0, grade: "SS", color: "text-amber-400" }, // 100% (Benchmark)
    { threshold: 0.95, grade: "S+", color: "text-yellow-300" }, // 95%+
    { threshold: 0.9, grade: "S", color: "text-yellow-400" }, // 90%+
    { threshold: 0.85, grade: "A+", color: "text-emerald-300" }, // 85%+
    { threshold: 0.8, grade: "A", color: "text-emerald-400" }, // 80%+
    { threshold: 0.75, grade: "B+", color: "text-sky-300" }, // 75%+
    { threshold: 0.7, grade: "B", color: "text-sky-400" }, // 70%+
    { threshold: 0.65, grade: "C+", color: "text-cyan-300" }, // 65%+
    { threshold: 0.6, grade: "C", color: "text-cyan-400" }, // 60%+
    { threshold: 0.55, grade: "D+", color: "text-neutral-300" }, // 55%+
    { threshold: 0.5, grade: "D", color: "text-neutral-400" }, // 50%+
    { threshold: 0.45, grade: "F+", color: "text-neutral-500" }, // 45%+
    { threshold: 0.0, grade: "F", color: "text-neutral-600" } // Below 45%
];

/**
 * Convert a score percentage to a grade.
 * @param percent - Score as decimal (1.0 = 100%, benchmark is SS at 1.0)
 * @param hasFullGear - Whether character has 6 relics and light cone
 * @param relicCount - Number of relics equipped
 * @returns Grade string and color class
 */
export function getSimScoreGrade(
    percent: number,
    hasFullGear: boolean = true,
    relicCount: number = 6
): { grade: string; color: string } {
    // If not full gear, show "N/A" or partial grade
    if (!hasFullGear || relicCount < 6) {
        if (relicCount === 0) {
            return { grade: "N/A", color: "text-neutral-500" };
        }
        // Still grade but mark as estimate
    }

    for (const { threshold, grade, color } of SIM_SCORE_GRADES) {
        if (percent >= threshold) {
            return { grade, color };
        }
    }

    return { grade: "F", color: "text-neutral-600" };
}

/**
 * Calculate score percentage using HSR Optimizer formula.
 *
 * Formula:
 * - If score >= benchmark: 1 + (score - benchmark) / (perfection - benchmark)
 * - If score < benchmark: (score - baseline) / (benchmark - baseline)
 *
 * @param score - Actual DPS score
 * @param baseline - Minimum possible DPS (with no substats)
 * @param benchmark - Target DPS at 48 rolls, 0.8 quality
 * @param perfection - Maximum DPS at 54 rolls, 1.0 quality
 */
export function calculateScorePercent(score: number, baseline: number, benchmark: number, perfection: number): number {
    // Ensure perfection is at least as high as benchmark
    const clampedPerfection = Math.max(perfection, benchmark);

    if (benchmark <= baseline) {
        // Invalid configuration
        return 0;
    }

    if (score >= benchmark) {
        // Above benchmark: scale to perfection
        const range = clampedPerfection - benchmark;
        return range > 0 ? 1 + (score - benchmark) / range : 1;
    }

    // Below benchmark: scale from baseline
    const range = benchmark - baseline;
    return range > 0 ? (score - baseline) / range : 0;
}

/**
 * Simulation parameters for DPS calculation.
 */
export interface SimulationParams {
    /** Skill multiplier (e.g., 2.2 = 220% scaling) */
    skillMultiplier: number;
    /** Base stats from character/light cone */
    baseAtk: number;
    baseHp: number;
    baseDef: number;
    baseSpd: number;
    /** Combat buffs from abilities/traces */
    dmgBoost: number;
    critRateBonus: number;
    critDmgBonus: number;
    /** Enemy parameters */
    enemyDef: number;
    enemyRes: number;
    /** Team buffs */
    teamDmgBoost: number;
    teamCritRate: number;
    teamCritDmg: number;
}

/**
 * Combat stats after all calculations.
 */
export interface CombatStats {
    atk: number;
    hp: number;
    def: number;
    spd: number;
    critRate: number;
    critDmg: number;
    dmgBoost: number;
    breakEffect: number;
    effectHitRate: number;
    effectRes: number;
    energyRegen: number;
    outgoingHealingBoost: number;
}

/**
 * Calculate combo damage for a single hit.
 * Uses simplified DPS formula from HSR Optimizer.
 *
 * DMG = Base DMG × DMG% × Crit Multiplier × DEF Multiplier × RES Multiplier
 */
export function calculateComboDamage(stats: CombatStats, params: SimulationParams): number {
    // Base damage (scaling stat × multiplier)
    const baseDmg = stats.atk * params.skillMultiplier;

    // Damage boost multiplier
    const dmgMultiplier = 1 + stats.dmgBoost + params.dmgBoost;

    // Crit multiplier (average case)
    const effectiveCritRate = Math.min(1, stats.critRate + params.critRateBonus);
    const effectiveCritDmg = stats.critDmg + params.critDmgBonus;
    const critMultiplier = 1 + effectiveCritRate * effectiveCritDmg;

    // DEF multiplier (simplified)
    // defMult = 1 - (enemyDef / (enemyDef + 200 + 10 × characterLevel))
    const defMultiplier = 1 - params.enemyDef / (params.enemyDef + 2000);

    // RES multiplier
    const resMultiplier = 1 - params.enemyRes;

    return baseDmg * dmgMultiplier * critMultiplier * defMultiplier * resMultiplier;
}

/**
 * Calculate expected DPS from simulation stats.
 */
export function calculateExpectedDps(stats: CombatStats, profile: CharacterProfile): number {
    const { skillMultiplier } = profile;

    // Simplified DPS formula
    // DPS = ScalingStat × Multiplier × CritFactor × ElementFactor
    const scalingStat = stats.atk; // Could be HP or DEF for some characters

    const critFactor = 1 + Math.min(1, stats.critRate) * stats.critDmg;
    const elementFactor = 1 + stats.dmgBoost;

    return scalingStat * skillMultiplier * critFactor * elementFactor;
}

/**
 * Check if a character is a DPS (uses DPS scoring).
 */
export function isDpsCharacter(path: string): boolean {
    return ["Destruction", "Hunt", "Erudition", "Elation", "Memory"].includes(path);
}

/**
 * Check if a character is a support (uses Buff scoring).
 */
export function isSupportCharacter(path: string): boolean {
    return path === "Harmony";
}

/**
 * Check if a character is a sustainer (uses Heal/Shield scoring).
 */
export function isSustainCharacter(path: string): boolean {
    return ["Abundance", "Preservation"].includes(path);
}

/**
 * Get scoring type for a character based on path.
 */
export function getScoringType(path: string): "DPS" | "BUFFER" | "HEAL" | "SHIELD" {
    if (isDpsCharacter(path)) return "DPS";
    if (isSupportCharacter(path)) return "BUFFER";
    if (path === "Abundance") return "HEAL";
    if (path === "Preservation") return "SHIELD";
    return "DPS"; // Default fallback
}
