/**
 * Character profile generator using HSR Optimizer game data.
 * Automatically generates scoring profiles based on character path and element.
 */

import type { CharacterProfile, ScalingStat, SubstatField } from "./types";
import { getCharacterById, getElementDmgField, characterExists, type PathId, type ElementId } from "@/data";

/**
 * Path to scaling stat mapping
 * Determines which stat the character's damage/heal/shield scales from
 */
const PATH_SCALING_STAT: Record<PathId, ScalingStat> = {
    Destruction: "atk",
    Hunt: "atk",
    Erudition: "atk",
    Harmony: "hp",
    Nihility: "atk",
    Preservation: "def",
    Abundance: "hp",
    Remembrance: "hp"
};

/**
 * Path to skill multiplier mapping
 * Representative ability multiplier for DPS estimation
 */
const PATH_SKILL_MULTIPLIER: Record<PathId, number> = {
    Destruction: 2.5, // High damage dealers
    Hunt: 2.2, // Single target specialists
    Erudition: 2.4, // AoE damage dealers
    Harmony: 0.5, // Support (buffs don't scale directly)
    Nihility: 1.8, // DoT/Debuff specialists
    Preservation: 0.8, // Shield scaling
    Abundance: 0.5, // Heal scaling
    Remembrance: 0.5 // Support path
};

/**
 * DPS path substat weights
 * High value on crit and ATK%
 */
const DPS_SUBSTAT_WEIGHTS: Partial<Record<SubstatField, number>> = {
    crit_rate: 1.0,
    crit_dmg: 1.0,
    atk_: 0.75,
    spd: 0.6,
    atk: 0.3
};

/**
 * Support path substat weights
 * High value on SPD and defensive stats
 */
const SUPPORT_SUBSTAT_WEIGHTS: Partial<Record<SubstatField, number>> = {
    spd: 1.0,
    hp_: 0.6,
    effect_res: 0.5,
    def_: 0.3,
    hp: 0.2
};

/**
 * Tank path substat weights
 * High value on DEF and effect res
 */
const TANK_SUBSTAT_WEIGHTS: Partial<Record<SubstatField, number>> = {
    def_: 1.0,
    spd: 0.7,
    effect_res: 0.6,
    hp_: 0.4,
    def: 0.3
};

/**
 * Healer path substat weights
 * High value on HP and SPD
 */
const HEALER_SUBSTAT_WEIGHTS: Partial<Record<SubstatField, number>> = {
    hp_: 1.0,
    spd: 0.9,
    effect_res: 0.5,
    hp: 0.3,
    def_: 0.2
};

/**
 * Get ideal main stats for a character based on path
 */
function getIdealMainStats(path: PathId, elementDmgField: string): CharacterProfile["idealMainStats"] {
    switch (path) {
        case "Destruction":
        case "Hunt":
        case "Erudition":
            return {
                body: ["crit_rate", "crit_dmg"],
                feet: ["spd", "atk_"],
                sphere: [elementDmgField, "atk_"],
                rope: ["atk_"]
            };
        case "Nihility":
            return {
                body: ["atk_", "effect_hit", "crit_rate", "crit_dmg"],
                feet: ["spd", "atk_"],
                sphere: [elementDmgField, "atk_"],
                rope: ["atk_", "break_dmg"]
            };
        case "Harmony":
        case "Remembrance":
            return {
                body: ["hp_", "crit_dmg"],
                feet: ["spd"],
                sphere: ["hp_", "atk_"],
                rope: ["sp_rate", "break_dmg"]
            };
        case "Preservation":
            return {
                body: ["def_"],
                feet: ["spd", "def_"],
                sphere: ["def_"],
                rope: ["def_", "sp_rate"]
            };
        case "Abundance":
            return {
                body: ["hp_"],
                feet: ["spd"],
                sphere: ["hp_"],
                rope: ["hp_", "sp_rate"]
            };
        default:
            return {
                body: ["crit_rate", "crit_dmg"],
                feet: ["spd", "atk_"],
                sphere: [elementDmgField],
                rope: ["atk_"]
            };
    }
}

/**
 * Get substat weights based on path
 */
function getSubstatWeights(path: PathId): Partial<Record<SubstatField, number>> {
    switch (path) {
        case "Destruction":
        case "Hunt":
        case "Erudition":
            return DPS_SUBSTAT_WEIGHTS;
        case "Nihility":
            return {
                ...DPS_SUBSTAT_WEIGHTS,
                effect_hit: 0.7,
                break_dmg: 0.4
            };
        case "Harmony":
        case "Remembrance":
            return SUPPORT_SUBSTAT_WEIGHTS;
        case "Preservation":
            return TANK_SUBSTAT_WEIGHTS;
        case "Abundance":
            return HEALER_SUBSTAT_WEIGHTS;
        default:
            return DPS_SUBSTAT_WEIGHTS;
    }
}

/**
 * Get speed target based on path
 */
function getSpeedTarget(path: PathId): number | undefined {
    switch (path) {
        case "Hunt":
            return 143; // Higher speed for Hunt characters
        case "Nihility":
        case "Harmony":
        case "Remembrance":
        case "Abundance":
            return 160; // Support wants high speed for more turns
        case "Destruction":
        case "Erudition":
        case "Preservation":
            return 134; // Standard speed breakpoint
        default:
            return 134;
    }
}

/**
 * Generate character profile from HSR Optimizer game data
 */
function generateProfileFromGameData(characterId: string): CharacterProfile | null {
    const character = getCharacterById(characterId);
    if (!character) return null;

    const { path, element } = character;
    const elementDmgField = getElementDmgField(element);

    return {
        scalingStat: PATH_SCALING_STAT[path] ?? "atk",
        skillMultiplier: PATH_SKILL_MULTIPLIER[path] ?? 2.0,
        elementDmgField,
        idealMainStats: getIdealMainStats(path, elementDmgField),
        substatWeights: getSubstatWeights(path),
        speedTarget: getSpeedTarget(path)
    };
}

/**
 * Get character profile for scoring.
 * Uses HSR Optimizer game data for accurate character information.
 */
export function getCharacterProfile(characterId: string, elementId: ElementId, pathId: PathId): CharacterProfile {
    // Try to get from game data first
    const profile = generateProfileFromGameData(characterId);
    if (profile) return profile;

    // Fallback to generated profile based on path/element
    const elementDmgField = getElementDmgField(elementId);

    return {
        scalingStat: PATH_SCALING_STAT[pathId] ?? "atk",
        skillMultiplier: PATH_SKILL_MULTIPLIER[pathId] ?? 2.0,
        elementDmgField,
        idealMainStats: getIdealMainStats(pathId, elementDmgField),
        substatWeights: getSubstatWeights(pathId),
        speedTarget: getSpeedTarget(pathId)
    };
}

/**
 * Check if character exists in game data
 */
export function hasCharacterProfile(characterId: string): boolean {
    return characterExists(characterId);
}

/**
 * Get character base stats from game data
 */
export function getCharacterBaseStats(characterId: string) {
    const character = getCharacterById(characterId);
    return character?.stats;
}

/**
 * Get character trace bonuses from game data
 */
export function getCharacterTraces(characterId: string) {
    const character = getCharacterById(characterId);
    return character?.traces;
}

// Export types
export type { CharacterProfile, ScalingStat, SubstatField };
