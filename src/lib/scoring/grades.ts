interface GradeInfo {
    grade: string;
    color: string;
}

const GRADE_THRESHOLDS: { min: number; grade: string; color: string }[] = [
    { min: 1.5, grade: "AEON", color: "text-yellow-300" },
    { min: 1.4, grade: "WTF+", color: "text-red-300" },
    { min: 1.3, grade: "WTF", color: "text-red-400" },
    { min: 1.21, grade: "SSS+", color: "text-orange-300" },
    { min: 1.13, grade: "SSS", color: "text-orange-400" },
    { min: 1.06, grade: "SS+", color: "text-amber-300" },
    { min: 1.0, grade: "SS", color: "text-amber-400" },
    { min: 0.95, grade: "S+", color: "text-yellow-400" },
    { min: 0.9, grade: "S", color: "text-yellow-500" },
    { min: 0.85, grade: "A+", color: "text-green-300" },
    { min: 0.8, grade: "A", color: "text-green-400" },
    { min: 0.75, grade: "B+", color: "text-blue-300" },
    { min: 0.7, grade: "B", color: "text-blue-400" },
    { min: 0.65, grade: "C+", color: "text-cyan-300" },
    { min: 0.6, grade: "C", color: "text-cyan-400" },
    { min: 0.55, grade: "D+", color: "text-neutral-300" },
    { min: 0.5, grade: "D", color: "text-neutral-400" },
    { min: 0.45, grade: "F+", color: "text-neutral-400" },
    { min: 0.0, grade: "F", color: "text-neutral-500" }
];

export function getGrade(percent: number): GradeInfo {
    for (const threshold of GRADE_THRESHOLDS) {
        if (percent >= threshold.min) {
            return { grade: threshold.grade, color: threshold.color };
        }
    }
    return { grade: "F", color: "text-neutral-500" };
}

export const SCORE_LABELS: Record<string, { dpsScore: string; relicScore: string }> = {
    en: { dpsScore: "DPS Score", relicScore: "Relic Score" },
    cn: { dpsScore: "DPS \u8bc4\u5206", relicScore: "\u9057\u5668\u8bc4\u5206" },
    cht: { dpsScore: "DPS \u8a55\u5206", relicScore: "\u907a\u5668\u8a55\u5206" },
    jp: { dpsScore: "DPS \u30b9\u30b3\u30a2", relicScore: "\u907a\u7269\u30b9\u30b3\u30a2" },
    kr: { dpsScore: "DPS \uc810\uc218", relicScore: "\uc720\ubb3c \uc810\uc218" },
    de: { dpsScore: "DPS-Wertung", relicScore: "Reliktwertung" },
    es: { dpsScore: "Puntuaci\u00f3n DPS", relicScore: "Puntuaci\u00f3n de reliquia" },
    fr: { dpsScore: "Score DPS", relicScore: "Score de relique" },
    id: { dpsScore: "Skor DPS", relicScore: "Skor Relic" },
    pt: { dpsScore: "Pontua\u00e7\u00e3o DPS", relicScore: "Pontua\u00e7\u00e3o de rel\u00edquia" },
    ru: {
        dpsScore: "\u041e\u0446\u0435\u043d\u043a\u0430 \u0414\u041f\u0421",
        relicScore: "\u041e\u0446\u0435\u043d\u043a\u0430 \u0440\u0435\u043b\u0438\u043a\u0432\u0438\u0438"
    },
    th: {
        dpsScore: "\u0e04\u0e30\u0e41\u0e19\u0e19 DPS",
        relicScore: "\u0e04\u0e30\u0e41\u0e19\u0e19\u0e40\u0e23\u0e25\u0e34\u0e04"
    },
    vi: { dpsScore: "\u0110i\u1ec3m DPS", relicScore: "\u0110i\u1ec3m Di V\u1eadt" }
};
