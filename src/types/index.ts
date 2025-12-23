// Player types
export interface PlayerAvatar {
    id: string;
    name: string;
    icon: string;
}

export interface SpaceInfo {
    avatar_count: number;
    achievement_count: number;
}

export interface Player {
    uid: string;
    nickname: string;
    level: number;
    world_level: number;
    avatar: PlayerAvatar;
    signature?: string;
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

export interface Skill {
    id: string;
    name: string;
    level: number;
    max_level: number;
    icon: string;
    type_text: string;
}

export interface SkillTree {
    id: string;
    level: number;
    max_level: number;
    icon: string;
    parent: string | null;
    anchor: string;
}

export interface Attribute {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    percent?: boolean;
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
    attributes: Attribute[];
}

export interface SubAffix {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
    count: number;
    step: number;
    dist?: number[];
}

export interface MainAffix {
    field: string;
    name: string;
    icon: string;
    value: number;
    display: string;
}

export interface Relic {
    id: string;
    name: string;
    set_id: string;
    set_name: string;
    rarity: number;
    level: number;
    icon: string;
    main_affix: MainAffix;
    sub_affix: SubAffix[];
}

export interface RelicSet {
    id: string;
    name: string;
    icon: string;
    num: number;
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
    icon: string;
    preview: string;
    portrait: string;
    element: Element;
    path: Path;
    skills: Skill[];
    skill_trees: SkillTree[];
    light_cone: LightCone | null;
    relics: Relic[];
    relic_sets: RelicSet[];
    attributes: Attribute[];
    additions: Attribute[];
    property: Property[];
    rank_icons: string[];
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

// Build types
export interface SavedBuild {
    uid: string;
    nickname: string;
    buildName: string;
    character: Character;
}
