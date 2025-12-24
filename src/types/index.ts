// Player types
export interface PlayerAvatar {
    id: string;
    name: string;
    icon: string;
}

export interface SpaceInfo {
    memory_data: unknown | null;
    universe_level: number;
    avatar_count: number;
    light_cone_count: number;
    relic_count: number;
    achievement_count: number;
    book_count: number;
    music_count: number;
}

export interface Player {
    uid: string;
    nickname: string;
    level: number;
    world_level: number;
    friend_count: number;
    avatar: PlayerAvatar;
    signature?: string;
    is_display: boolean;
    space_info: SpaceInfo;
}

// Character types
export interface Element {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface Path {
    id: string;
    name: string;
    icon: string;
}

export interface SkillElement {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    max_level: number;
    element: SkillElement | null;
    type: string;
    type_text: string;
    effect: string;
    effect_text: string;
    simple_desc: string;
    desc: string;
    icon: string;
}

export interface SkillTree {
    id: string;
    level: number;
    anchor: string;
    max_level: number;
    icon: string;
    parent: string | null;
}

export interface Attribute {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent?: boolean;
}

export interface LightConeProperty {
    type: string;
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent: boolean;
}

export interface LightCone {
    id: string;
    name: string;
    rarity: number;
    rank: number;
    level: number;
    promotion: number;
    icon: string;
    preview: string;
    portrait: string;
    path: Path;
    attributes: Attribute[];
    properties: LightConeProperty[];
}

export interface SubAffix {
    type: string;
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent: boolean;
    count: number;
    step: number;
    dist?: number[];
}

export interface MainAffix {
    type: string;
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent: boolean;
}

export interface Relic {
    id: string;
    name: string;
    type: number;
    set_id: string;
    set_name: string;
    rarity: number;
    level: number;
    icon: string;
    main_affix: MainAffix;
    sub_affix: SubAffix[];
}

export interface RelicSetProperty {
    type: string;
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent: boolean;
}

export interface RelicSet {
    id: string;
    name: string;
    icon: string;
    num: number;
    desc: string;
    properties: RelicSetProperty[];
}

export interface Statistic {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent: boolean;
}

export interface CharacterProperty {
    type?: string;
    field?: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent?: boolean;
}

export interface Property {
    name: string;
    icon: string;
    base?: number;
    addition?: number;
    value: number;
    display: string;
}

export interface Character {
    id: string;
    name: string;
    rarity: number;
    rank: number;
    level: number;
    promotion: number;
    enhanced: boolean;
    icon: string;
    preview: string;
    portrait: string;
    rank_icons: string[];
    path: Path;
    element: Element;
    skills: Skill[];
    skill_trees: SkillTree[];
    light_cone: LightCone | null;
    relics: Relic[];
    relic_sets: RelicSet[];
    statistics: Statistic[];
    attributes: Attribute[];
    additions: Attribute[];
    properties: CharacterProperty[];
    pos: number[];
    property: Property[];
}

// API Response type
export interface DetailInfo {
    platform: string;
}

export interface ProfileData {
    status: number;
    player: Player;
    characters: Character[];
    detailInfo: DetailInfo;
    timestamp: string;
    powered: string;
}

// Server status types
export interface ServerStatus {
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
}

export interface ServerEndpoint {
    url: string;
}

export interface ApiStatuses {
    [key: string]: ServerStatus;
}

// Build types
export interface SavedBuild {
    uid: string;
    nickname: string;
    buildName: string;
    character: Character;
}

// Profile settings type
export interface ProfileSettings {
    hideUID: boolean;
    blur: boolean;
    substatDistribution: boolean;
    allTraces: boolean;
    lang: string;
}

// Supported language codes
export type Language = "cn" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";
