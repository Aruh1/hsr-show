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
    "1102": {
        // Seele
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
        scalingStat: "atk",
        skillMultiplier: 2.5,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 0.5, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 134
    },
    "1005": {
        // Kafka
        scalingStat: "atk",
        skillMultiplier: 1.6,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 1.0, spd: 1.0, effect_hit: 0.7, atk: 0.4, break_dmg: 0.3 },
        speedTarget: 160
    },
    "1205": {
        // Blade
        scalingStat: "hp",
        skillMultiplier: 2.2,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.75, spd: 0.7, hp: 0.3 },
        speedTarget: 134
    },
    "1213": {
        // Dan Heng IL
        scalingStat: "atk",
        skillMultiplier: 3.0,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.7, atk: 0.3 },
        speedTarget: 134
    },
    "1224": {
        // March 7th (Hunt)
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 143
    },
    "1112": {
        // Topaz
        scalingStat: "atk",
        skillMultiplier: 1.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1221": {
        // Dr. Ratio
        scalingStat: "atk",
        skillMultiplier: 2.7,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1225": {
        // Argenti
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1305": {
        // Acheron
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
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["break_dmg"] },
        substatWeights: { break_dmg: 1.0, spd: 1.0, atk_: 0.7, atk: 0.3, effect_res: 0.2 },
        speedTarget: 160
    },
    "1312": {
        // Misha
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1315": {
        // Boothill
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
        scalingStat: "hp",
        skillMultiplier: 2.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["hp_"], sphere: ["imaginary_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.8, spd: 0.4, hp: 0.3 },
        speedTarget: 120
    },
    "1409": {
        // Tribbie
        scalingStat: "hp",
        skillMultiplier: 1.2,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["hp_"], feet: ["hp_", "spd"], sphere: ["hp_"], rope: ["hp_"] },
        substatWeights: { hp_: 1.0, spd: 0.7, hp: 0.5, effect_res: 0.3, def_: 0.2 },
        speedTarget: 134
    },
    "1502": {
        // Yao Guang
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

    "1006": {
        // Silver Wolf -> Nihility but damage focused
        scalingStat: "atk",
        skillMultiplier: 1.96,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { effect_hit: 1.0, spd: 0.9, crit_rate: 0.5, crit_dmg: 0.5, atk_: 0.4 },
        speedTarget: 134
    },
    "1302": {
        // Jing Yuan
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 134
    },
    "1210": {
        // Guinaifen
        scalingStat: "atk",
        skillMultiplier: 1.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.8, spd: 1.0, effect_hit: 0.8, atk: 0.3, break_dmg: 0.4 },
        speedTarget: 160
    },
    "1214": {
        // DHIL's Erudition variant / Serval
        scalingStat: "atk",
        skillMultiplier: 1.4,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1303": {
        // Ruan Mei
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1308": {
        // Aventurine
        scalingStat: "def",
        skillMultiplier: 1.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["def_"], feet: ["def_", "spd"], sphere: ["def_"], rope: ["def_"] },
        substatWeights: { def_: 1.0, spd: 0.7, crit_rate: 0.6, crit_dmg: 0.6, def: 0.3, effect_res: 0.4 },
        speedTarget: 134
    },

    "1001": {
        // March 7th (Preservation)
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["def_"], feet: ["def_", "spd"], sphere: ["def_"], rope: ["def_"] },
        substatWeights: { def_: 1.0, spd: 0.7, effect_res: 0.5, hp_: 0.4, def: 0.3 }
    },
    "1101": {
        // Bronya
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, crit_dmg: 0.5, effect_res: 0.4, hp: 0.2 },
        speedTarget: 134
    },
    "1108": {
        // Yanqing
        scalingStat: "atk",
        skillMultiplier: 2.2,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd", "atk_"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1209": {
        // Sushang
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

    "1003": {
        // Himeko
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1007": {
        // Black Swan
        scalingStat: "atk",
        skillMultiplier: 1.2,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.9, spd: 1.0, effect_hit: 0.8, atk: 0.3, break_dmg: 0.3 },
        speedTarget: 160
    },
    "1111": {
        // Luka
        scalingStat: "atk",
        skillMultiplier: 1.6,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.8, spd: 1.0, effect_hit: 0.8, break_dmg: 0.5, atk: 0.3 },
        speedTarget: 160
    },
    "1106": {
        // Pela
        scalingStat: "atk",
        skillMultiplier: 1.0,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["effect_hit"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, effect_hit: 0.9, hp_: 0.5, effect_res: 0.4, def_: 0.3 },
        speedTarget: 160
    },
    "1109": {
        // Hook
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
        scalingStat: "atk",
        skillMultiplier: 1.5,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["atk_", "effect_hit"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["atk_"] },
        substatWeights: { atk_: 0.8, spd: 1.0, effect_hit: 0.8, break_dmg: 0.4, atk: 0.3 },
        speedTarget: 160
    },

    "1002": {
        // Dan Heng
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
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.5, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1202": {
        // Tingyun
        scalingStat: "atk",
        skillMultiplier: 0.5,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, atk_: 0.8, hp_: 0.4, effect_res: 0.3, atk: 0.2 },
        speedTarget: 160
    },
    "1215": {
        // Hanya
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.5, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1306": {
        // Sparkle
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, crit_dmg: 0.6, hp_: 0.5, effect_res: 0.4, hp: 0.2 },
        speedTarget: 160
    },
    "1309": {
        // Robin
        scalingStat: "atk",
        skillMultiplier: 0.5,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { atk_: 1.0, spd: 0.9, atk: 0.4, hp_: 0.3, effect_res: 0.3 },
        speedTarget: 160
    },
    "1313": {
        // Sunday
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, crit_dmg: 0.6, hp_: 0.5, effect_res: 0.4, hp: 0.2 },
        speedTarget: 160
    },
    "1314": {
        // Fugue (Trailblazer Harmony)
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate", "break_dmg"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1406": {
        // Anaxa
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["wind_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.7, atk: 0.3 },
        speedTarget: 134
    },

    "1104": {
        // Gepard
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["def_"], feet: ["spd", "def_"], sphere: ["def_"], rope: ["sp_rate"] },
        substatWeights: { def_: 1.0, spd: 0.7, effect_res: 0.6, hp_: 0.4, def: 0.3 }
    },
    "1211": {
        // Bailu
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { hp_: 1.0, spd: 0.8, effect_res: 0.5, hp: 0.3, def_: 0.2 },
        speedTarget: 134
    },
    "1208": {
        // Fu Xuan
        scalingStat: "hp",
        skillMultiplier: 0.6,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd", "hp_"], sphere: ["hp_"], rope: ["hp_"] },
        substatWeights: { hp_: 1.0, spd: 0.7, def_: 0.5, effect_res: 0.6, hp: 0.3 },
        speedTarget: 134
    },

    "1013": {
        // Huohuo
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "wind_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { hp_: 1.0, spd: 0.9, effect_res: 0.5, hp: 0.3, def_: 0.2 },
        speedTarget: 160
    },
    "1203": {
        // Luocha
        scalingStat: "atk",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { atk_: 1.0, spd: 0.9, hp_: 0.4, effect_res: 0.4, atk: 0.2 },
        speedTarget: 160
    },
    "1217": {
        // Gallagher
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.6, effect_res: 0.4, hp: 0.2 },
        speedTarget: 160
    },
    "1301": {
        // Lingsha
        scalingStat: "atk",
        skillMultiplier: 1.0,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["atk_"], feet: ["spd"], sphere: ["atk_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, atk_: 0.7, effect_res: 0.3, atk: 0.2 },
        speedTarget: 160
    },

    "1307": {
        // The Herta
        scalingStat: "atk",
        skillMultiplier: 2.8,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd", "atk_"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
        speedTarget: 134
    },
    "1415": {
        // Cyrene
        scalingStat: "hp",
        skillMultiplier: 2.2,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["hp_", "spd"], sphere: ["ice_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.8, spd: 0.5, hp: 0.3 },
        speedTarget: 120
    },
    "1413": {
        // Aglaea
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 160
    },

    "8001": {
        // Trailblazer (Physical/Destruction)
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
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["def_"], feet: ["spd"], sphere: ["def_"], rope: ["sp_rate"] },
        substatWeights: { def_: 1.0, spd: 0.8, effect_res: 0.5, hp_: 0.4, def: 0.3 }
    },
    "8004": {
        // Trailblazer (Fire/Preservation) female
        scalingStat: "def",
        skillMultiplier: 0.8,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["def_"], feet: ["spd"], sphere: ["def_"], rope: ["sp_rate"] },
        substatWeights: { def_: 1.0, spd: 0.8, effect_res: 0.5, hp_: 0.4, def: 0.3 }
    },
    "8005": {
        // Trailblazer (Imaginary/Harmony)
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "8006": {
        // Trailblazer (Imaginary/Harmony) female
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, break_dmg: 0.8, hp_: 0.5, effect_res: 0.3, hp: 0.2 },
        speedTarget: 160
    },

    "1004": {
        // Welt
        scalingStat: "atk",
        skillMultiplier: 1.8,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 0.8, crit_dmg: 0.8, atk_: 0.7, spd: 0.9, effect_hit: 0.5 },
        speedTarget: 134
    },
    "1008": {
        // Arlan
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "lightning_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["lightning_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.3, hp_: 0.2 }
    },
    "1103": {
        // Clara
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.3, hp_: 0.2 }
    },
    "1105": {
        // Natasha
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { hp_: 1.0, spd: 0.8, effect_res: 0.5, hp: 0.3, def_: 0.2 }
    },
    "1107": {
        // Qingque
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.4, spd: 0.2 }
    },
    "1201": {
        // Herta
        scalingStat: "atk",
        skillMultiplier: 1.7,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd", "atk_"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.5, atk: 0.3 }
    },
    "1206": {
        // Sushang
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
        scalingStat: "hp",
        skillMultiplier: 0.5,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
        substatWeights: { spd: 1.0, hp_: 0.6, effect_res: 0.4, def_: 0.3, hp: 0.2 },
        speedTarget: 160
    },
    "1212": {
        // Jingliu (copy)
        scalingStat: "atk",
        skillMultiplier: 2.5,
        elementDmgField: "ice_dmg",
        idealMainStats: { body: ["crit_dmg"], feet: ["spd"], sphere: ["ice_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 0.5, crit_dmg: 1.0, atk_: 0.75, spd: 0.8, atk: 0.3 },
        speedTarget: 134
    },
    "1218": {
        // Jiaoqiu
        scalingStat: "atk",
        skillMultiplier: 1.2,
        elementDmgField: "fire_dmg",
        idealMainStats: { body: ["effect_hit"], feet: ["spd"], sphere: ["fire_dmg"], rope: ["sp_rate"] },
        substatWeights: { effect_hit: 1.0, spd: 1.0, hp_: 0.4, effect_res: 0.3, atk_: 0.3 },
        speedTarget: 160
    },
    "1220": {
        // Moze
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
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["quantum_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.7, atk: 0.3 },
        speedTarget: 134
    },
    "1223": {
        // Yunli
        scalingStat: "atk",
        skillMultiplier: 2.4,
        elementDmgField: "physical_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["atk_"], sphere: ["physical_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, atk: 0.4, spd: 0.2 }
    },
    "1304": {
        // Aventurine (duplicate key above, skip)
        scalingStat: "atk",
        skillMultiplier: 2.0,
        elementDmgField: "imaginary_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["spd"], sphere: ["imaginary_dmg"], rope: ["atk_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 }
    },
    "1401": {
        // The Herta (already 1307, this is Castorice)
        scalingStat: "hp",
        skillMultiplier: 2.0,
        elementDmgField: "quantum_dmg",
        idealMainStats: { body: ["crit_rate", "crit_dmg"], feet: ["hp_"], sphere: ["quantum_dmg"], rope: ["hp_"] },
        substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, hp_: 0.8, hp: 0.3, spd: 0.3 }
    },
    "1402": {
        // Tribbie already above, this might be different
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

    // DPS paths (includes Remembrance/Memory which uses the same build template)
    if (["Destruction", "Hunt", "Erudition", "Elation", "Memory"].includes(pathId)) {
        return {
            scalingStat: "atk",
            skillMultiplier: 2.0,
            elementDmgField,
            idealMainStats: {
                body: ["crit_rate", "crit_dmg"],
                feet: ["spd", "atk_"],
                sphere: [elementDmgField],
                rope: ["atk_"]
            },
            substatWeights: { crit_rate: 1.0, crit_dmg: 1.0, atk_: 0.75, spd: 0.6, atk: 0.3 },
            speedTarget: 134
        };
    }

    // Tank path
    if (pathId === "Preservation") {
        return {
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
            scalingStat: "hp",
            skillMultiplier: 0.5,
            elementDmgField,
            idealMainStats: { body: ["hp_"], feet: ["spd"], sphere: ["hp_"], rope: ["sp_rate"] },
            substatWeights: { hp_: 1.0, spd: 0.9, effect_res: 0.5, hp: 0.3, def_: 0.2 },
            speedTarget: 160
        };
    }

    // Support paths (Harmony, Nihility)
    return {
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
