export type ScalingStat = "atk" | "hp" | "def";

export type SubstatField =
    | "hp"
    | "hp_"
    | "atk"
    | "atk_"
    | "def"
    | "def_"
    | "spd"
    | "crit_rate"
    | "crit_dmg"
    | "effect_hit"
    | "effect_res"
    | "break_dmg";

export interface CharacterProfile {
    id: string;
    scalingStat: ScalingStat;
    skillMultiplier: number;
    elementDmgField: string;
    idealMainStats: {
        body: string[];
        feet: string[];
        sphere: string[];
        rope: string[];
    };
    substatWeights: Partial<Record<SubstatField, number>>;
    speedTarget?: number;
}

export interface ComputedStats {
    scalingStatValue: number;
    critRate: number;
    critDmg: number;
    elementDmgBonus: number;
    speed: number;
}

export interface ScoringResult {
    baselineSimScore: number;
    originalSimScore: number;
    benchmarkSimScore: number;
    perfectionSimScore: number;
    percent: number;
    grade: string;
    gradeColor: string;
}

export interface RelicScoreResult {
    relicId: string;
    score: number;
    displayScore: string;
    grade: string;
    gradeColor: string;
}

export interface CharacterScoreOutput {
    overall: ScoringResult;
    relics: RelicScoreResult[];
    profileFound: boolean;
}
