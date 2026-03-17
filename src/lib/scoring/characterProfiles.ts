import type { CharacterProfile } from "./types";

export const ELEMENT_TO_DMG_FIELD: Record<string, string> = {
    Physical: "physical_dmg",
    Fire: "fire_dmg",
    Ice: "ice_dmg",
    Thunder: "lightning_dmg",
    Wind: "wind_dmg",
    Quantum: "quantum_dmg",
    Imaginary: "imaginary_dmg"
};

/**
 * Character profile database keyed by Mihomo character ID.
 *
 * scalingStat: which base stat the character's damage scales from
 * skillMultiplier: representative ability multiplier (e.g., 2.2 = 220% scaling)
 * elementDmgField: the statistics field name for this character's element damage bonus
 * idealMainStats: preferred main stats per relic slot
 * substatWeights: relative importance of each substat (0.0 to 1.0)
 * speedTarget: optional speed breakpoint
 */
export const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
    // ===== Destruction =====
    "1102": {
        // Seele
        id: "1102",
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "quantum_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["atk_", "spd"],
            sphere: ["quantum_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1204": {
        // Jingliu
        id: "1204",
        scalingStat: "atk",
        skillMultiplier: 2.5,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 0.5, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 134
    },
    "1005": {
        // Kafka
        id: "1005",
        scalingStat: "atk",
        skillMultiplier: 1.6,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 1.0, spd: 1.0, effect_hit: 0.7, atk: 0.4, break_dmg: 0.3 },
        speedTarget: 160
    },
    "1205": {
        // Blade
        id: "1205",
        scalingStat: "hp",
        skillMultiplier: 2.2,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.75, spd: 0.7, hp: 0.3 },
        speedTarget: 134
    },
    "1213": {
        // Dan Heng IL
        id: "1213",
        scalingStat: "atk",
        skillMultiplier: 3.0,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.7, atk: 0.3 },
        speedTarget: 134
    },
    "1224": {
        // March 7th (Hunt)
        id: "1224",
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 143
    },
    "1112": {
        // Topaz
        id: "1112",
        scalingStat: "atk",
        skillMultiplier: 1.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1221": {
        // Dr. Ratio
        id: "1221",
        scalingStat: "atk",
        skillMultiplier: 2.7,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1225": {
        // Argenti
        id: "1225",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1305": {
        // Acheron
        id: "1305",
        scalingStat: "atk",
        skillMultiplier: 3.0,
        elementDmgField: "lightning_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["lightning_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.5, atk: 0.3 },
        speedTarget: 134
    },
    "1310": {
        // Firefly
        id: "1310",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["break_dmg"] },
        substatWeights: { break_dmg: 1.0, spd: 1.0, atk_: 0.7, atk: 0.3, effect_res: 0.2 },
        speedTarget: 160
    },
    "1312": {
        // Misha
        id: "1312",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1315": {
        // Boothill
        id: "1315",
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "physical_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd"],
            sphere: ["physical_dmg"],
            rope: ["break_dmg"]
        },
        substatWeights: { break_dmg: 1.0, spd: 1.0, crit_rate: 0.5, crit_dmg: 0.5, effect_hit: 0.3 },
        speedTarget: 160
    },
    "1404": {
        // Feixiao
        id: "1404",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "wind_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["wind_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1407": {
        // Mydei
        id: "1407",
        scalingStat: "hp",
        skillMultiplier: 2.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["hp_"], sphere: ["imaginary_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.8, spd: 0.4, hp: 0.3 },
        speedTarget: 120
    },
    "1409": {
        // Tribbie
        id: "1409",
        scalingStat: "hp",
        skillMultiplier: 1.2,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["hp_"], feet: ["hp_", "spd"], sphere: ["hp_"], rope: ["hp_"] },
        substatWeights: { hp_: 1.0, spd: 0.7, hp: 0.5, effect_res: 0.3, def_: 0.2 },
        speedTarget: 134
    },
    "1502": {
        // Yao Guang
        id: "1502",
        scalingStat: "atk",
        skillMultiplier: 2.6,
        elementDmgField: "physical_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["physical_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },

    // ===== Erudition =====
    "1006": {
        // Silver Wolf -> Nihility but damage focused
        id: "1006",
        scalingStat: "atk",
        skillMultiplier: 1.96,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { effect_hit: 1.0, spd: 0.9, crit_rate: 0.5, crit_dmg: 0.5, atk_: 0.4 },
        speedTarget: 134
    },
    "1302": {
        // Jing Yuan
        id: "1302",
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 134
    },
    "1210": {
        // Guinaifen
        id: "1210",
        scalingStat: "atk",
        skillMultiplier: 1.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.8, spd: 1.0, effect_hit: 0.8, atk: 0.3, break_dmg: 0.4 },
        speedTarget: 160
    },
    "1214": {
        // DHIL's Erudition variant / Serval
        id: "1214",
        scalingStat: "atk",
        skillMultiplier: 1.4,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1303": {
        // Ruan Mei
        id: "1303",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1308": {
        // Aventurine
        id: "1308",
        scalingStat: "def",
        skillMultiplier: 1.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["def_"], feet: ["def_", "spd"], sphere: ["def_"], rope: ["def_"] },
        substatWeights: { def_: 1.0, spd: 0.7, crit_rate: 0.6, crit_dmg: 0.6, def: 0.3, effect_res: 0.4 },
        speedTarget: 134
    },

    // ===== Hunt =====
    "1001": {
        // March 7th (Preservation)
        id: "1001",
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["def_"], feet: ["def_", "spd"], sphere: ["def_"], rope: ["def_"] },
        substatWeights: { def_: 1.0, spd: 0.7, effect_res: 0.5, hp_: 0.4, def: 0.3 }
    },
    "1101": {
        // Bronya
        id: "1101",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, crit_dmg: 0.5, effect_res: 0.4, hp: 0.2 },
        speedTarget: 134
    },
    "1108": {
        // Yanqing
        id: "1108",
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd", "atk_"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1209": {
        // Sushang
        id: "1209",
        scalingStat: "atk",
        skillMultiplier: 2.1,
        elementDmgField: "physical_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["physical_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },

    // ===== Nihility =====
    "1003": {
        // Himeko
        id: "1003",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1007": {
        // Black Swan
        id: "1007",
        scalingStat: "atk",
        skillMultiplier: 1.2,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.9, spd: 1.0, effect_hit: 0.8, atk: 0.3, break_dmg: 0.3 },
        speedTarget: 160
    },
    "1111": {
        // Luka
        id: "1111",
        scalingStat: "atk",
        skillMultiplier: 1.6,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.8, spd: 1.0, effect_hit: 0.8, break_dmg: 0.5, atk: 0.3 },
        speedTarget: 160
    },
    "1106": {
        // Pela
        id: "1106",
        scalingStat: "atk",
        skillMultiplier: 1.0,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["effect_hit"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, effect_hit: 0.9, hp_: 0.5, effect_res: 0.4, def_: 0.3 },
        speedTarget: 160
    },
    "1109": {
        // Hook
        id: "1109",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "fire_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["fire_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.5, atk: 0.3 }
    },
    "1110": {
        // Sampo
        id: "1110",
        scalingStat: "atk",
        skillMultiplier: 1.5,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.8, spd: 1.0, effect_hit: 0.8, break_dmg: 0.4, atk: 0.3 },
        speedTarget: 160
    },

    // ===== Harmony =====
    "1002": {
        // Dan Heng
        id: "1002",
        scalingStat: "atk",
        skillMultiplier: 2.6,
        elementDmgField: "wind_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["wind_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1009": {
        // Asta
        id: "1009",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.5, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1202": {
        // Tingyun
        id: "1202",
        scalingStat: "atk",
        skillMultiplier: 0.5,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, atk_: 0.8, hp_: 0.4, effect_res: 0.3, atk: 0.2 },
        speedTarget: 160
    },
    "1215": {
        // Hanya
        id: "1215",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.5, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1306": {
        // Sparkle
        id: "1306",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, crit_dmg: 0.6, hp_: 0.5, effect_res: 0.4, hp: 0.2 },
        speedTarget: 160
    },
    "1309": {
        // Robin
        id: "1309",
        scalingStat: "atk",
        skillMultiplier: 0.5,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { atk_: 1.0, spd: 0.9, atk: 0.4, hp_: 0.3, effect_res: 0.3 },
        speedTarget: 160
    },
    "1313": {
        // Sunday
        id: "1313",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, crit_dmg: 0.6, hp_: 0.5, effect_res: 0.4, hp: 0.2 },
        speedTarget: 160
    },
    "1314": {
        // Fugue (Trailblazer Harmony)
        id: "1314",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate", "break_dmg"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1406": {
        // Anaxa
        id: "1406",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.7, atk: 0.3 },
        speedTarget: 134
    },

    // ===== Preservation =====
    "1104": {
        // Gepard
        id: "1104",
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["def_"], feet: ["spd", "def_"], sphere: ["def_"], rope: ["sp_rate"] },
        substatWeights: { def_: 1.0, spd: 0.7, effect_res: 0.6, hp_: 0.4, def: 0.3 }
    },
    "1211": {
        // Bailu
        id: "1211",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { hp_: 1.0, spd: 0.8, effect_res: 0.5, hp: 0.3, def_: 0.2 },
        speedTarget: 134
    },
    "1208": {
        // Fu Xuan
        id: "1208",
        scalingStat: "hp",
        skillMultiplier: 0.6,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd", "hp_"], sphere: ["hp_"], rope: ["hp_"] },
        substatWeights: { hp_: 1.0, spd: 0.7, def_: 0.5, effect_res: 0.6, hp: 0.3 },
        speedTarget: 134
    },

    // ===== Abundance =====
    "1013": {
        // Huohuo
        id: "1013",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { hp_: 1.0, spd: 0.9, effect_res: 0.5, hp: 0.3, def_: 0.2 },
        speedTarget: 160
    },
    "1203": {
        // Luocha
        id: "1203",
        scalingStat: "atk",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { atk_: 1.0, spd: 0.9, hp_: 0.4, effect_res: 0.4, atk: 0.2 },
        speedTarget: 160
    },
    "1217": {
        // Gallagher
        id: "1217",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.6, effect_res: 0.4, hp: 0.2 },
        speedTarget: 160
    },
    "1301": {
        // Lingsha
        id: "1301",
        scalingStat: "atk",
        skillMultiplier: 1.0,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, atk_: 0.7, effect_res: 0.3, atk: 0.2 },
        speedTarget: 160
    },

    // ===== Remembrance =====
    "1307": {
        // The Herta
        id: "1307",
        scalingStat: "atk",
        skillMultiplier: 2.8,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd", "atk_"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1415": {
        // Cyrene
        id: "1415",
        scalingStat: "hp",
        skillMultiplier: 2.2,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["hp_", "spd"], sphere: ["ice_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.8, spd: 0.5, hp: 0.3 },
        speedTarget: 120
    },
    "1413": {
        // Aglaea
        id: "1413",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 160
    },

    // ===== Trailblazers =====
    "8001": {
        // Trailblazer (Physical/Destruction)
        id: "8001",
        scalingStat: "atk",
        skillMultiplier: 1.3,
        elementDmgField: "physical_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["physical_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "8002": {
        // Trailblazer (Physical/Destruction) female
        id: "8002",
        scalingStat: "atk",
        skillMultiplier: 1.3,
        elementDmgField: "physical_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["physical_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "8003": {
        // Trailblazer (Fire/Preservation)
        id: "8003",
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["def_"], feet: ["spd"], sphere: ["def_"], rope: ["sp_rate"] },
        substatWeights: { def_: 1.0, spd: 0.8, effect_res: 0.5, hp_: 0.4, def: 0.3 }
    },
    "8004": {
        // Trailblazer (Fire/Preservation) female
        id: "8004",
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["def_"], feet: ["spd"], sphere: ["def_"], rope: ["sp_rate"] },
        substatWeights: { def_: 1.0, spd: 0.8, effect_res: 0.5, hp_: 0.4, def: 0.3 }
    },
    "8005": {
        // Trailblazer (Imaginary/Harmony)
        id: "8005",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "8006": {
        // Trailblazer (Imaginary/Harmony) female
        id: "8006",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },

    // ===== Additional popular characters =====
    "1004": {
        // Welt
        id: "1004",
        scalingStat: "atk",
        skillMultiplier: 1.8,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 0.8, crit_dmg: 0.8, atk_: 0.7, spd: 0.9, effect_hit: 0.5 },
        speedTarget: 134
    },
    "1008": {
        // Arlan
        id: "1008",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.3, hp_: 0.2 }
    },
    "1103": {
        // Clara
        id: "1103",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.3, hp_: 0.2 }
    },
    "1105": {
        // Natasha
        id: "1105",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { hp_: 1.0, spd: 0.8, effect_res: 0.5, hp: 0.3, def_: 0.2 }
    },
    "1107": {
        // Qingque
        id: "1107",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.4, spd: 0.2 }
    },
    "1201": {
        // Herta
        id: "1201",
        scalingStat: "atk",
        skillMultiplier: 1.7,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd", "atk_"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.5, atk: 0.3 }
    },
    "1206": {
        // Sushang
        id: "1206",
        scalingStat: "atk",
        skillMultiplier: 2.1,
        elementDmgField: "physical_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["physical_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1207": {
        // Yukong
        id: "1207",
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.4, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1212": {
        // Jingliu (copy)
        id: "1212",
        scalingStat: "atk",
        skillMultiplier: 2.5,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 0.5, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 134
    },
    "1218": {
        // Jiaoqiu
        id: "1218",
        scalingStat: "atk",
        skillMultiplier: 1.2,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["effect_hit"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["sp_rate"] },
        substatWeights: { effect_hit: 1.0, spd: 1.0, hp_: 0.4, effect_res: 0.3, atk_: 0.3 },
        speedTarget: 160
    },
    "1220": {
        // Moze
        id: "1220",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "lightning_dmg",
        idealMainStats: {
            body: ["crit_rate", "crit_dmg"],
            feet: ["spd", "atk_"],
            sphere: ["lightning_dmg"],
            rope: ["atk_"]
        },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.5, atk: 0.3 }
    },
    "1222": {
        // Jade
        id: "1222",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.7, atk: 0.3 },
        speedTarget: 134
    },
    "1223": {
        // Yunli
        id: "1223",
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.4, spd: 0.2 }
    },
    "1304": {
        // Aventurine (duplicate key above, skip)
        id: "1304",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1401": {
        // The Herta (already 1307, this is Castorice)
        id: "1401",
        scalingStat: "hp",
        skillMultiplier: 2.0,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["hp_"], sphere: ["quantum_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.8, hp: 0.3, spd: 0.3 }
    },
    "1402": {
        // Tribbie already above, this might be different
        id: "1402",
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    }
};

/**
 * Generates a default profile based on the character's path and element.
 * Used as fallback when no explicit profile exists.
 */
function generateDefaultProfile(characterId: string, elementId: string, pathId: string): CharacterProfile {
    const elementDmgField = ELEMENT_TO_DMG_FIELD[elementId] ?? "physical_dmg";

    // DPS paths
    if (["Destruction", "Hunt", "Erudition", "Elation"].includes(pathId)) {
        return {
            id: characterId,
            scalingStat: "atk",
            skillMultiplier: 2.0,
            elementDmgField,
            idealMainStats: {
                body: ["crit_rate", "crit_dmg"],
                feet: ["spd", "atk_"],
                sphere: [elementDmgField.replace("_dmg", "")],
                rope: ["atk_"]
            },
            substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
            speedTarget: 134
        };
    }

    // Tank path
    if (pathId === "Preservation") {
        return {
            id: characterId,
            scalingStat: "def",
            skillMultiplier: 0.8,
            elementDmgField,
            idealMainStats: { body: ["def_"], feet: ["spd", "def_"], sphere: ["def_"], rope: ["sp_rate"] },
            substatWeights: { def_: 1.0, spd: 0.7, effect_res: 0.6, hp_: 0.4, def: 0.3 }
        };
    }

    // Healer path
    if (pathId === "Abundance") {
        return {
            id: characterId,
            scalingStat: "hp",
            skillMultiplier: 0.5,
            elementDmgField,
            idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
            substatWeights: { hp_: 1.0, spd: 0.9, effect_res: 0.5, hp: 0.3, def_: 0.2 },
            speedTarget: 160
        };
    }

    // Remembrance path
    if (pathId === "Memory") {
        return {
            id: characterId,
            scalingStat: "atk",
            skillMultiplier: 2.0,
            elementDmgField,
            idealMainStats: {
                body: ["crit_rate", "crit_dmg"],
                feet: ["spd", "atk_"],
                sphere: [elementDmgField.replace("_dmg", "")],
                rope: ["atk_"]
            },
            substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
            speedTarget: 134
        };
    }

    // Support paths (Harmony, Nihility)
    return {
        id: characterId,
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField,
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.5, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    };
}

/**
 * Get profile for a character. Falls back to a generated default
 * based on element and path if no explicit profile exists.
 */
export function getCharacterProfile(characterId: string, elementId: string, pathId: string): CharacterProfile {
    return CHARACTER_PROFILES[characterId] ?? generateDefaultProfile(characterId, elementId, pathId);
}
