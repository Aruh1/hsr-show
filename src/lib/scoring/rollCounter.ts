/**
 * Substat roll counting utilities for relic scoring.
 * Based on HSR Optimizer methodology for calculating roll counts and quality.
 */

import type { SubstatField } from "./types";
import { SUBSTAT_ROLL_VALUES, MIHOMO_TYPE_TO_FIELD } from "./substats";

/**
 * Roll quality levels (low, mid, high)
 */
export type RollQuality = 0 | 1 | 2;

/**
 * Result of counting rolls on a single substat
 */
export interface SubstatRollCount {
    field: SubstatField;
    value: number;
    count: number; // Total number of rolls
    highRolls: number; // Number of high-quality rolls
    lowRolls: number; // Number of low-quality rolls
    quality: number; // Average roll quality (0-1)
}

/**
 * Result of counting all rolls on a relic
 */
export interface RelicRollAnalysis {
    totalRolls: number;
    substats: SubstatRollCount[];
    efficiency: number; // Overall roll efficiency (0-1)
    score: number; // Weighted score
}

/**
 * Maximum rolls per relic by rarity
 */
export const MAX_ROLLS_BY_RARITY: Record<number, number> = {
    5: 9, // 5-star: 4 initial + 5 upgrades
    4: 8,
    3: 6
};

/**
 * Calculate roll count for a single substat based on value.
 * Uses binary search approach to determine roll distribution.
 */
export function calculateSubstatRolls(
    field: SubstatField,
    value: number,
    count: number // From API (number of rolls)
): SubstatRollCount {
    const rollValues = SUBSTAT_ROLL_VALUES[field];
    const [low, , high] = rollValues;

    // Calculate average roll value
    const avgRoll = count > 0 ? value / count : 0;

    // Determine quality based on average roll value
    const quality = Math.max(0, Math.min(1, (avgRoll - low) / (high - low)));

    // Estimate high/low roll distribution
    // If avg is closer to high, more high rolls; if closer to low, more low rolls
    const highRolls = Math.round(count * quality);
    const lowRolls = count - highRolls;

    return {
        field,
        value,
        count,
        highRolls,
        lowRolls,
        quality
    };
}

/**
 * Calculate the roll efficiency of a relic.
 * Returns a value from 0 to 1+ (can exceed 1 for perfect+ rolls).
 */
export function calculateRollEfficiency(
    rollAnalysis: SubstatRollCount[],
    weights: Partial<Record<SubstatField, number>>
): number {
    let totalWeightedValue = 0;
    let maxPossibleValue = 0;

    for (const substat of rollAnalysis) {
        const weight = weights[substat.field] ?? 0;
        if (weight <= 0) continue;

        const maxRoll = SUBSTAT_ROLL_VALUES[substat.field][2]; // High roll value
        const weightedValue = (substat.value / maxRoll) * weight;
        totalWeightedValue += weightedValue;
    }

    // Maximum possible for weighted stats (assuming all high rolls)
    const sortedWeights = Object.entries(weights)
        .filter(([, w]) => w && w > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4) as [SubstatField, number][];

    // Calculate max possible with even distribution
    for (const [, weight] of sortedWeights) {
        maxPossibleValue += weight; // Each max roll contributes 1x weight
    }

    return maxPossibleValue > 0 ? totalWeightedValue / maxPossibleValue : 0;
}

/**
 * Analyze all substats on a relic and calculate roll counts.
 */
export function analyzeRelicRolls(relic: {
    rarity: number;
    level: number;
    sub_affix: Array<{
        type: string;
        field: string;
        value: number;
        count: number;
    }>;
}): RelicRollAnalysis {
    const substats: SubstatRollCount[] = [];

    for (const sub of relic.sub_affix) {
        const field = MIHOMO_TYPE_TO_FIELD[sub.type];
        if (!field) continue;

        const rollCount = calculateSubstatRolls(field, sub.value, sub.count);
        substats.push(rollCount);
    }

    const totalRolls = substats.reduce((sum, s) => sum + s.count, 0);

    return {
        totalRolls,
        substats,
        efficiency: 0, // Will be calculated with weights
        score: 0 // Will be calculated with weights
    };
}

/**
 * Calculate the total roll count for a character across all relics.
 */
export function calculateTotalRollCount(
    relics: Array<{
        rarity: number;
        level: number;
        sub_affix: Array<{ type: string; field: string; value: number; count: number }>;
    }>
): number {
    return relics.reduce((total, relic) => {
        const analysis = analyzeRelicRolls(relic);
        return total + analysis.totalRolls;
    }, 0);
}

/**
 * Get roll budget for benchmark/perfection scoring.
 * Based on HSR Optimizer methodology:
 * - Benchmark: 48 rolls at quality 0.8
 * - Perfection: 54 rolls at quality 1.0
 */
export function getRollBudgets(): { benchmark: number; perfection: number } {
    return {
        benchmark: 48, // 6 relics × 8 rolls average
        perfection: 54 // 6 relics × 9 rolls max
    };
}

/**
 * Calculate diminishing returns for stat value.
 * HSR Optimizer uses power function for diminishing returns.
 */
export function applyDiminishingReturns(value: number, isSpd: boolean = false): number {
    if (isSpd) {
        // SPD uses gentler diminishing returns (0.10 exponent)
        return Math.pow(value, 0.1);
    }
    // Other stats use standard diminishing returns (0.25 exponent)
    return Math.pow(value, 0.25);
}
