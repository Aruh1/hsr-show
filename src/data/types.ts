/**
 * Game data types from HSR Optimizer
 */

export type PathId =
    | "Destruction"
    | "Hunt"
    | "Erudition"
    | "Harmony"
    | "Nihility"
    | "Preservation"
    | "Abundance"
    | "Remembrance";
export type ElementId = "Physical" | "Fire" | "Ice" | "Thunder" | "Wind" | "Quantum" | "Imaginary";

export interface CharacterTraces {
    [statName: string]: number;
}

export interface TraceTreeNode {
    id: string;
    stat: string;
    value: number;
    pre: string | null;
    children: TraceTreeNode[];
}

export interface CharacterBaseStats {
    HP: number;
    ATK: number;
    DEF: number;
    SPD: number;
    "CRIT Rate": number;
    "CRIT DMG": number;
}

export interface GameCharacter {
    id: string;
    name: string;
    rarity: 4 | 5;
    path: PathId;
    element: ElementId;
    traces: CharacterTraces;
    traceTree: TraceTreeNode[];
    max_sp: number;
    stats: CharacterBaseStats;
    unreleased: boolean;
}

export interface GameData {
    characters: Record<string, GameCharacter>;
}

export interface RelicMainAffix {
    id: string;
    type: string;
    affix: Array<{
        level: number;
        base: number;
        step: number;
    }>;
}

export interface RelicSubAffix {
    id: string;
    type: string;
    affix: Array<{
        base: number;
        step: number;
    }>;
}

export interface RelicMainAffixes {
    [type: string]: {
        [rarity: string]: RelicMainAffix[];
    };
}

export interface RelicSubAffixes {
    [rarity: string]: RelicSubAffix[];
}
