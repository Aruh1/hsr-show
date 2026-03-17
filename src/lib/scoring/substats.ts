import type { SubstatField } from "./types";

/** Maps Mihomo sub_affix.type to our SubstatField */
export const MIHOMO_TYPE_TO_FIELD: Record<string, SubstatField> = {
    HPDelta: "hp",
    HPAddedRatio: "hp_",
    AttackDelta: "atk",
    AttackAddedRatio: "atk_",
    DefenceDelta: "def",
    DefenceAddedRatio: "def_",
    SpeedDelta: "spd",
    CriticalChanceBase: "crit_rate",
    CriticalDamageBase: "crit_dmg",
    StatusProbabilityBase: "effect_hit",
    StatusResistanceBase: "effect_res",
    BreakDamageAddedRatioBase: "break_dmg"
};

/** 5-star relic substat roll values: [low, mid, high] */
export const SUBSTAT_ROLL_VALUES: Record<SubstatField, [number, number, number]> = {
    hp: [33.87, 38.103, 42.337],
    hp_: [0.03456, 0.03888, 0.0432],
    atk: [16.935, 19.051, 21.168],
    atk_: [0.03456, 0.03888, 0.0432],
    def: [16.935, 19.051, 21.168],
    def_: [0.0432, 0.0486, 0.054],
    spd: [2.0, 2.3, 2.6],
    crit_rate: [0.02592, 0.02916, 0.0324],
    crit_dmg: [0.05184, 0.05832, 0.0648],
    effect_hit: [0.03456, 0.03888, 0.0432],
    effect_res: [0.03456, 0.03888, 0.0432],
    break_dmg: [0.05184, 0.05832, 0.0648]
};

/** Roll value interpolated at a given quality (0.0 = low, 1.0 = high) */
export function rollValueAtQuality(field: SubstatField, quality: number): number {
    const [low, , high] = SUBSTAT_ROLL_VALUES[field];
    return low + quality * (high - low);
}

/** Max possible roll value (quality = 1.0) */
export function maxRollValue(field: SubstatField): number {
    return SUBSTAT_ROLL_VALUES[field][2];
}
