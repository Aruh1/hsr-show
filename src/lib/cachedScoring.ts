import { cacheLife, cacheTag } from "next/cache";
import { getCharacterProfile as getProfileRaw } from "./scoring/characterProfiles";
import { calculateCharacterScore as calculateScoreRaw } from "./scoring/scoringEngine";
import type { Character } from "@/types";
import type { CharacterProfile, CharacterScoreOutput } from "./scoring/types";

/**
 * Cached version of getCharacterProfile for server use.
 */
export async function getCharacterProfileCached(
    characterId: string,
    elementId: string,
    pathId: string
): Promise<CharacterProfile> {
    "use cache";
    cacheLife("days");
    return getProfileRaw(characterId, elementId, pathId);
}

/**
 * Cached version of calculateCharacterScore for server use.
 */
export async function calculateCharacterScoreCached(character: Character): Promise<CharacterScoreOutput> {
    "use cache";
    cacheLife("minutes");
    cacheTag("scoring", `scoring-${character.id}`);
    return calculateScoreRaw(character);
}
