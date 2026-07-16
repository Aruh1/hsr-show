/**
 * Transformer for Enka Network HSR API response.
 * Converts Enka's format to match the existing ProfileData structure.
 * Uses StarRailRes index files for name/icon resolution.
 */

import { cacheLife, cacheTag } from "next/cache";
import type { ProfileData, Player, Character, Relic, LightCone, SkillTree, RelicSet, Attribute } from "@/types";
import { ASSET_URL } from "./constants";

// Enka API raw types
interface EnkaSubAffix {
    affixId: number;
    cnt: number;
    step?: number;
}

interface EnkaRelic {
    tid: number;
    type: number;
    level: number;
    mainAffixId: number;
    subAffixList: EnkaSubAffix[];
    _flat?: {
        props: { type: string; value: number }[];
        setName: string;
        setID: number;
    };
}

interface EnkaSkillTree {
    pointId: number;
    level: number;
}

interface EnkaEquipment {
    tid: number;
    level: number;
    promotion: number;
    rank: number;
    _flat?: {
        props: { type: string; value: number }[];
        name: string;
    };
}

interface EnkaAvatar {
    avatarId: number;
    level: number;
    promotion: number;
    pos?: number;
    relicList: EnkaRelic[];
    skillTreeList: EnkaSkillTree[];
    equipment?: EnkaEquipment;
    _assist?: boolean;
}

interface EnkaRecordInfo {
    achievementCount: number;
    bookCount: number;
    avatarCount: number;
    equipmentCount: number;
    musicCount: number;
    relicCount: number;
    maxRogueChallengeScore: number;
}

interface EnkaDetailInfo {
    worldLevel: number;
    headIcon: number;
    signature?: string;
    avatarDetailList: EnkaAvatar[];
    platform: string;
    recordInfo: EnkaRecordInfo;
    uid: string;
    level: number;
    nickname: string;
    isDisplayAvatar: boolean;
    friendCount: number;
}

interface EnkaResponse {
    detailInfo: EnkaDetailInfo;
    ttl: number;
    uid: string;
    region: string;
}

// StarRailRes index types
interface CharacterIndex {
    id: string;
    name: string;
    tag?: string;
    rarity: number;
    path: string;
    element: string;
    max_sp: number;
    ranks: string[];
    skills: string[];
    skill_trees: string[];
    icon: string;
    preview: string;
    portrait: string;
}

interface RelicIndex {
    id: string;
    set_id: string;
    name: string;
    rarity: number;
    type: string;
    max_level: number;
    main_affix_id: string;
    sub_affix_id: string;
    icon: string;
}

interface RelicSetIndex {
    id: string;
    name: string;
    desc: string[];
    properties: { type: string; value: number }[][];
    icon: string;
}

interface LightConeIndex {
    id: string;
    name: string;
    rarity: number;
    path: string;
    desc: string;
    icon: string;
    preview: string;
    portrait: string;
}

interface PropertyIndex {
    type: string;
    name: string;
    field: string;
    percent: boolean;
    icon: string;
}

interface SubAffixIndex {
    id: string;
    affixes: Record<string, { affix_id: string; property: string; base: number; step: number; step_num: number }>;
}

interface MainAffixIndex {
    id: string;
    affixes: Record<string, { affix_id: string; property: string; base: number; step: number }>;
}

// Element name to ID mapping
const ELEMENT_NAME_MAP: Record<string, { id: string; color: string }> = {
    Ice: { id: "ice", color: "#4ebfef" },
    Fire: { id: "fire", color: "#f45d5d" },
    Imaginary: { id: "imaginary", color: "#f4e845" },
    Lightning: { id: "lightning", color: "#b45df4" },
    Physical: { id: "physical", color: "#a0a0a0" },
    Quantum: { id: "quantum", color: "#5d7ef4" },
    Wind: { id: "wind", color: "#5df489" }
};

// Path name to ID mapping
const PATH_NAME_MAP: Record<string, string> = {
    Warrior: "destruction",
    Rogue: "hunt",
    Mage: "erudition",
    Shaman: "harmony",
    Warlock: "nihility",
    Knight: "preservation",
    Priest: "abundance",
    Remembrance: "remembrance"
};

// Property type mapping for stat display
const PROPERTY_TYPE_MAP: Record<string, string> = {
    HPDelta: "hp",
    HPAddedRatio: "hp",
    AttackDelta: "attack",
    AttackAddedRatio: "attack",
    DefenceDelta: "defence",
    DefenceAddedRatio: "defence",
    SpeedDelta: "speed",
    CriticalChance: "critical_chance",
    CriticalDamage: "critical_damage",
    CriticalChanceBase: "critical_chance",
    CriticalDamageBase: "critical_damage",
    BreakDamageAddedRatio: "break_damage_added_ratio",
    BreakDamageAddedRatioBase: "break_damage_added_ratio",
    StatusProbability: "status_probability",
    StatusProbabilityBase: "status_probability",
    StatusResistance: "status_resistance",
    StatusResistanceBase: "status_resistance",
    HealRatioBase: "heal_ratio_base",
    SPRatioBase: "sp_ratio_base",
    IceAddedRatio: "ice_added_ratio",
    FireAddedRatio: "fire_added_ratio",
    LightningAddedRatio: "lightning_added_ratio",
    WindAddedRatio: "wind_added_ratio",
    PhysicalAddedRatio: "physical_added_ratio",
    QuantumAddedRatio: "quantum_added_ratio",
    ImaginaryAddedRatio: "imaginary_added_ratio"
};

// Cached index data
let indexCache: {
    characters: Record<string, CharacterIndex> | null;
    relics: Record<string, RelicIndex> | null;
    relicSets: Record<string, RelicSetIndex> | null;
    lightCones: Record<string, LightConeIndex> | null;
    properties: Record<string, PropertyIndex> | null;
    subAffixes: Record<string, SubAffixIndex> | null;
    mainAffixes: Record<string, MainAffixIndex> | null;
} = {
    characters: null,
    relics: null,
    relicSets: null,
    lightCones: null,
    properties: null,
    subAffixes: null,
    mainAffixes: null
};

/**
 * Fetch and cache StarRailRes index files
 */
async function loadIndex<T>(filename: string, lang: string): Promise<T> {
    const url = `${ASSET_URL}index_min/${lang}/${filename}`;
    const response = await fetch(url, {
        headers: { "User-Agent": "hsr-show/1.0" }
    });
    if (!response.ok) {
        throw new Error(`Failed to load index ${filename}: ${response.status}`);
    }
    return response.json();
}

/**
 * Ensure all required indexes are loaded
 */
async function ensureIndexes(lang: string): Promise<void> {
    if (!indexCache.characters) {
        const [characters, relics, relicSets, lightCones, properties, subAffixes, mainAffixes] = await Promise.all([
            loadIndex<Record<string, CharacterIndex>>("characters.json", lang),
            loadIndex<Record<string, RelicIndex>>("relics.json", lang),
            loadIndex<Record<string, RelicSetIndex>>("relic_sets.json", lang),
            loadIndex<Record<string, LightConeIndex>>("light_cones.json", lang),
            loadIndex<Record<string, PropertyIndex>>("properties.json", lang),
            loadIndex<Record<string, SubAffixIndex>>("relic_sub_affixes.json", lang),
            loadIndex<Record<string, MainAffixIndex>>("relic_main_affixes.json", lang)
        ]);

        indexCache = { characters, relics, relicSets, lightCones, properties, subAffixes, mainAffixes };
    }
}

/**
 * Get property display info
 */
function getPropertyInfo(propType: string): { field: string; name: string; percent: boolean; icon: string } {
    const propData = indexCache.properties?.[propType];
    if (propData) {
        return {
            field: PROPERTY_TYPE_MAP[propType] || propType.toLowerCase(),
            name: propData.name,
            percent: propData.percent,
            icon: propData.icon
        };
    }

    // Fallback
    const field = PROPERTY_TYPE_MAP[propType] || propType.toLowerCase();
    return {
        field,
        name: propType.replace(/([A-Z])/g, " $1").trim(),
        percent: propType.includes("Ratio") || propType.includes("Chance") || propType.includes("Damage"),
        icon: `${ASSET_URL}icon/property/${field}.png`
    };
}

/**
 * Format a stat value for display
 */
function formatStatValue(value: number, percent: boolean): string {
    if (percent) {
        return (value * 100).toFixed(1) + "%";
    }
    return Math.round(value).toString();
}

/**
 * Transform Enka relic to our Relic type
 */
function transformRelic(relic: EnkaRelic): Relic {
    const relicData = indexCache.relics?.[relic.tid.toString()];
    const setData = indexCache.relicSets?.[relic._flat?.setID?.toString() || relicData?.set_id || ""];

    // Get main affix info from _flat props
    const mainProp = relic._flat?.props?.[0];
    const mainPropInfo = mainProp
        ? getPropertyInfo(mainProp.type)
        : { field: "unknown", name: "Unknown", percent: false, icon: "" };

    // Build sub affixes
    const subAffixes = relic.subAffixList.map(sub => {
        const subAffixGroup = indexCache.subAffixes?.[sub.affixId.toString()];
        const affixEntry =
            subAffixGroup?.affixes?.["1"] || subAffixGroup?.affixes?.[Object.keys(subAffixGroup?.affixes || {})[0]];

        const propType = affixEntry?.property || "";
        let value = 0;

        if (affixEntry && sub.cnt > 0) {
            value = affixEntry.base * sub.cnt + affixEntry.step * (sub.step || 0);
        }

        const propInfo = getPropertyInfo(propType);

        // Calculate roll distribution
        const dist: number[] = [];
        const highRolls = (sub.step || 0) - sub.cnt;
        for (let i = 0; i < sub.cnt; i++) {
            dist.push(i < highRolls ? 2 : 1);
        }

        return {
            type: propInfo.field,
            field: propInfo.field,
            name: propInfo.name,
            icon: propInfo.icon,
            value,
            display: formatStatValue(value, propInfo.percent),
            percent: propInfo.percent,
            count: sub.cnt,
            step: sub.step || 0,
            dist
        };
    });

    return {
        id: relic.tid.toString(),
        name: relicData?.name || `Relic ${relic.tid}`,
        type: relic.type,
        set_id: setData?.id || relic._flat?.setID?.toString() || "",
        set_name: setData?.name || "",
        rarity: relicData?.rarity || 5,
        level: relic.level,
        icon: relicData?.icon ? `${ASSET_URL}${relicData.icon}` : `${ASSET_URL}icon/relic/${relic.tid}.png`,
        main_affix: {
            type: mainPropInfo.field,
            field: mainPropInfo.field,
            name: mainPropInfo.name,
            icon: mainPropInfo.icon,
            value: mainProp?.value || 0,
            display: formatStatValue(mainProp?.value || 0, mainPropInfo.percent),
            percent: mainPropInfo.percent
        },
        sub_affix: subAffixes
    };
}

/**
 * Transform Enka equipment (light cone) to our LightCone type
 */
function transformEquipment(equipment: EnkaEquipment): LightCone {
    const lcData = indexCache.lightCones?.[equipment.tid.toString()];

    // Get base stats from _flat props
    const props = equipment._flat?.props || [];
    const baseHp = props.find(p => p.type === "BaseHP")?.value || 0;
    const baseAtk = props.find(p => p.type === "BaseAttack")?.value || 0;
    const baseDef = props.find(p => p.type === "BaseDefence")?.value || 0;

    return {
        id: equipment.tid.toString(),
        name: lcData?.name || `Light Cone ${equipment.tid}`,
        rarity: lcData?.rarity || 5,
        rank: equipment.rank,
        level: equipment.level,
        promotion: equipment.promotion,
        icon: lcData?.icon ? `${ASSET_URL}${lcData.icon}` : `${ASSET_URL}icon/light_cone/${equipment.tid}.png`,
        preview: lcData?.preview
            ? `${ASSET_URL}${lcData.preview}`
            : `${ASSET_URL}image/light_cone_preview/${equipment.tid}.png`,
        portrait: lcData?.portrait
            ? `${ASSET_URL}${lcData.portrait}`
            : `${ASSET_URL}image/light_cone_portrait/${equipment.tid}.png`,
        path: {
            id: PATH_NAME_MAP[lcData?.path || ""] || "destruction",
            name: lcData?.path || "Destruction",
            icon: `${ASSET_URL}icon/path/${PATH_NAME_MAP[lcData?.path || ""] || "destruction"}.png`
        },
        attributes: [
            {
                field: "hp",
                name: "HP",
                icon: `${ASSET_URL}icon/property/hp.png`,
                value: baseHp,
                display: Math.round(baseHp).toString()
            },
            {
                field: "attack",
                name: "ATK",
                icon: `${ASSET_URL}icon/property/attack.png`,
                value: baseAtk,
                display: Math.round(baseAtk).toString()
            },
            {
                field: "defence",
                name: "DEF",
                icon: `${ASSET_URL}icon/property/defence.png`,
                value: baseDef,
                display: Math.round(baseDef).toString()
            }
        ],
        properties: []
    };
}

/**
 * Transform Enka avatar to our Character type
 */
function transformAvatar(avatar: EnkaAvatar): Character {
    const charData = indexCache.characters?.[avatar.avatarId.toString()];

    const elementInfo = ELEMENT_NAME_MAP[charData?.element || "Physical"] || { id: "physical", color: "#a0a0a0" };
    const pathId = PATH_NAME_MAP[charData?.path || "Warrior"] || "destruction";

    // Transform relics
    const relics = avatar.relicList.map(relic => transformRelic(relic));

    // Build relic sets
    const setMap = new Map<string, { set: RelicSet; count: number }>();
    for (const relic of relics) {
        if (relic.set_id) {
            const existing = setMap.get(relic.set_id);
            if (existing) {
                existing.count++;
            } else {
                const setData = indexCache.relicSets?.[relic.set_id];
                if (setData) {
                    setMap.set(relic.set_id, {
                        set: {
                            id: setData.id,
                            name: setData.name,
                            icon: `${ASSET_URL}${setData.icon}`,
                            num: 1,
                            desc: setData.desc.join(" "),
                            properties: setData.properties.flat().map(p => {
                                const propInfo = getPropertyInfo(p.type);
                                return {
                                    type: p.type,
                                    field: propInfo.field,
                                    name: propInfo.name,
                                    icon: propInfo.icon,
                                    value: p.value,
                                    display: formatStatValue(p.value, propInfo.percent),
                                    percent: propInfo.percent
                                };
                            })
                        },
                        count: 1
                    });
                }
            }
        }
    }

    const relicSets = Array.from(setMap.values()).map(({ set, count }) => ({
        ...set,
        num: count
    }));

    // Transform light cone
    const lightCone = avatar.equipment ? transformEquipment(avatar.equipment) : null;

    // Transform skill trees
    const skillTrees: SkillTree[] = avatar.skillTreeList.map(skill => ({
        id: skill.pointId.toString(),
        level: skill.level,
        anchor: "",
        max_level: 10,
        icon: `${ASSET_URL}icon/skill/${skill.pointId}.png`,
        parent: null
    }));

    // Build stats from relics + equipment
    const stats: Attribute[] = [
        { field: "hp", name: "HP", icon: `${ASSET_URL}icon/property/hp.png`, value: 2000, display: "2000" },
        { field: "attack", name: "ATK", icon: `${ASSET_URL}icon/property/attack.png`, value: 1000, display: "1000" },
        { field: "defence", name: "DEF", icon: `${ASSET_URL}icon/property/defence.png`, value: 800, display: "800" },
        { field: "speed", name: "SPD", icon: `${ASSET_URL}icon/property/speed.png`, value: 100, display: "100" }
    ];

    return {
        id: avatar.avatarId.toString(),
        name: charData?.name || `Character ${avatar.avatarId}`,
        rarity: charData?.rarity || 5,
        rank: 0,
        level: avatar.level,
        promotion: avatar.promotion,
        enhanced: false,
        icon: charData?.icon ? `${ASSET_URL}${charData.icon}` : `${ASSET_URL}icon/character/${avatar.avatarId}.png`,
        preview: charData?.preview
            ? `${ASSET_URL}${charData.preview}`
            : `${ASSET_URL}image/character_preview/${avatar.avatarId}.png`,
        portrait: charData?.portrait
            ? `${ASSET_URL}${charData.portrait}`
            : `${ASSET_URL}image/character_portrait/${avatar.avatarId}.png`,
        rank_icons: charData?.ranks?.map(r => `${ASSET_URL}icon/character_rank/${r}.png`) || [],
        path: {
            id: pathId,
            name: charData?.path || "Destruction",
            icon: `${ASSET_URL}icon/path/${pathId}.png`
        },
        element: {
            id: elementInfo.id,
            name: charData?.element || "Physical",
            color: elementInfo.color,
            icon: `${ASSET_URL}icon/element/${elementInfo.id}.png`
        },
        skills: [],
        skill_trees: skillTrees,
        light_cone: lightCone,
        relics,
        relic_sets: relicSets,
        statistics: [],
        attributes: stats,
        additions: [],
        properties: [],
        pos: avatar.pos !== undefined ? [avatar.pos] : [],
        property: stats.map(s => ({
            name: s.name,
            icon: s.icon,
            value: s.value,
            display: s.display
        }))
    };
}

/**
 * Transform Enka API response to ProfileData format
 */
export async function transformEnkaResponse(enkaData: EnkaResponse, lang: string): Promise<ProfileData> {
    // Load indexes for the requested language
    await ensureIndexes(lang);

    const detailInfo = enkaData.detailInfo;

    // Transform player info
    const player: Player = {
        uid: detailInfo.uid,
        nickname: detailInfo.nickname,
        level: detailInfo.level,
        world_level: detailInfo.worldLevel,
        friend_count: detailInfo.friendCount,
        avatar: {
            id: detailInfo.headIcon.toString(),
            name: "",
            icon: `${ASSET_URL}icon/avatar/${detailInfo.headIcon}.png`
        },
        signature: detailInfo.signature,
        is_display: detailInfo.isDisplayAvatar,
        space_info: {
            memory_data: null,
            universe_level: detailInfo.recordInfo.maxRogueChallengeScore || 0,
            avatar_count: detailInfo.recordInfo.avatarCount,
            light_cone_count: detailInfo.recordInfo.equipmentCount,
            relic_count: detailInfo.recordInfo.relicCount,
            achievement_count: detailInfo.recordInfo.achievementCount,
            book_count: detailInfo.recordInfo.bookCount,
            music_count: detailInfo.recordInfo.musicCount
        }
    };

    // Transform characters
    const characters = detailInfo.avatarDetailList.map(avatar => transformAvatar(avatar));

    return {
        status: 0,
        player,
        characters,
        detailInfo: {
            platform: detailInfo.platform
        },
        timestamp: new Date().toISOString(),
        powered: "Enka Network API: https://enka.network/"
    };
}

/**
 * Fetch and transform data from Enka Network HSR API
 */
export async function getEnkaData(uid: string, lang: string): Promise<ProfileData> {
    "use cache";
    cacheLife("minutes");
    cacheTag("enka-profile", `profile-${uid}`, `profile-${uid}-${lang}`);

    const url = `https://enka.network/api/hsr/uid/${uid}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "hsr-show/1.0 (https://hsr.pololer.my.id)"
        }
    });

    if (!response.ok) {
        throw new Error(`Enka API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as EnkaResponse;

    if (!data.detailInfo?.avatarDetailList?.length) {
        throw new Error("No characters found");
    }

    return transformEnkaResponse(data, lang);
}
