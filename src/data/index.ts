/**
 * Game data loader and utilities.
 * Loads data from HSR Optimizer game_data.json
 */

import type { GameData, GameCharacter, CharacterBaseStats, ElementId, PathId } from "./types";

// Import JSON data
import gameDataRaw from "./game_data.json";
import relicMainAffixesRaw from "./relic_main_affixes.json";
import relicSubAffixesRaw from "./relic_sub_affixes.json";

// Type the imported data
export const gameData = gameDataRaw as GameData;
export const relicMainAffixes = relicMainAffixesRaw as Record<string, unknown>;
export const relicSubAffixes = relicSubAffixesRaw as Record<string, unknown>;

/**
 * Element to damage field mapping
 */
export const ELEMENT_TO_DMG_FIELD: Record<ElementId, string> = {
    Physical: "physical_dmg",
    Fire: "fire_dmg",
    Ice: "ice_dmg",
    Thunder: "lightning_dmg",
    Wind: "wind_dmg",
    Quantum: "quantum_dmg",
    Imaginary: "imaginary_dmg"
};

/**
 * Get character data by ID
 */
export function getCharacterById(id: string): GameCharacter | undefined {
    return gameData.characters[id];
}

/**
 * Get all character IDs
 */
export function getAllCharacterIds(): string[] {
    return Object.keys(gameData.characters);
}

/**
 * Get character count
 */
export function getCharacterCount(): number {
    return Object.keys(gameData.characters).length;
}

/**
 * Get character base stats at level 80
 */
export function getCharacterBaseStats(id: string): CharacterBaseStats | undefined {
    const char = getCharacterById(id);
    return char?.stats;
}

/**
 * Get character element
 */
export function getCharacterElement(id: string): ElementId | undefined {
    const char = getCharacterById(id);
    return char?.element;
}

/**
 * Get character path
 */
export function getCharacterPath(id: string): PathId | undefined {
    const char = getCharacterById(id);
    return char?.path;
}

/**
 * Get character trace bonuses
 */
export function getCharacterTraces(id: string): Record<string, number> | undefined {
    const char = getCharacterById(id);
    return char?.traces;
}

/**
 * Check if character exists in game data
 */
export function characterExists(id: string): boolean {
    return id in gameData.characters;
}

/**
 * Get characters by path
 */
export function getCharactersByPath(path: PathId): GameCharacter[] {
    return Object.values(gameData.characters).filter(char => char.path === path);
}

/**
 * Get characters by element
 */
export function getCharactersByElement(element: ElementId): GameCharacter[] {
    return Object.values(gameData.characters).filter(char => char.element === element);
}

/**
 * Get damage field for character's element
 */
export function getElementDmgField(element: ElementId): string {
    return ELEMENT_TO_DMG_FIELD[element] ?? "physical_dmg";
}

/**
 * Get max SP (Skill Points) for character
 */
export function getCharacterMaxSp(id: string): number {
    const char = getCharacterById(id);
    return char?.max_sp ?? 100;
}

/**
 * Get character rarity
 */
export function getCharacterRarity(id: string): 4 | 5 | undefined {
    const char = getCharacterById(id);
    return char?.rarity;
}

/**
 * Check if character is unreleased
 */
export function isCharacterUnreleased(id: string): boolean {
    const char = getCharacterById(id);
    return char?.unreleased ?? false;
}

// Export types
export type { GameCharacter, GameData, CharacterBaseStats, ElementId, PathId };
