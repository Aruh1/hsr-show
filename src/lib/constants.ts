/**
 * Shared constants for the HSR Show application
 */

// CDN URL for Star Rail resources
export const ASSET_URL = "https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/";

// Roman numeral mapping for light cone ranks
export const ROMAN_NUM: Record<number, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V"
} as const;

// Localized labels for Memosprite skills/talents
export const MEMOSPRITE_LABELS: Record<string, { skill: string; talent: string }> = {
    en: { skill: "Memosprite Skill", talent: "Memosprite Talent" },
    jp: { skill: "記憶の精霊スキル", talent: "記憶の精霊天賦" },
    cn: { skill: "记忆灵战技", talent: "记忆灵天赋" },
    cht: { skill: "記憶靈戰技", talent: "記憶靈天賦" },
    kr: { skill: "기억의 정령 전술", talent: "기억의 정령 특성" },
    de: { skill: "Gedächtnisgeist-Fertigkeit", talent: "Gedächtnisgeist-Talent" },
    es: { skill: "Habilidad de memoespíritu", talent: "Talento de memoespíritu" },
    fr: { skill: "Compétence de mémo-esprit", talent: "Talent de mémo-esprit" },
    id: { skill: "Memosprite Skill", talent: "Memosprite Talent" },
    pt: { skill: "Perícia de Memosprites", talent: "Talento de Memosprites" },
    ru: { skill: "Навык мем-духа", talent: "Талант мем-духа" },
    th: { skill: "สกิล Memosprite", talent: "พรสวรรค์ Memosprite" },
    vi: { skill: "Chiến Kỹ Linh Hồn Ký Ức", talent: "Thiên Phú Linh Hồn Ký Ức" }
} as const;

// Server endpoints for API status checks
export const SERVER_ENDPOINTS: Record<string, { url: string }> = {
    "Official-USA": { url: "/api/u/600000006" },
    "GF-CN": { url: "/api/u/100000009" },
    "Official-CHT": { url: "/api/u/900000001" },
    "QD-CN": { url: "/api/u/500000001" },
    "Official-Asia": { url: "/api/u/800000002" },
    "Official-EUR": { url: "/api/u/700000001" }
} as const;

// Retry configuration for API calls
export const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000,
    backoffFactor: 2,
    jitter: 0.2
} as const;

// API status retry config (less aggressive)
export const API_STATUS_RETRY_CONFIG = {
    maxRetries: 0,
    baseDelay: 1000,
    backoffFactor: 1.5,
    jitter: 0.1
} as const;

// Supported languages
export const SUPPORTED_LANGUAGES = [
    { code: "cn", name: "简体中文" },
    { code: "cht", name: "繁體中文" },
    { code: "de", name: "Deutsch" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "id", name: "Bahasa Indonesia" },
    { code: "jp", name: "日本語" },
    { code: "kr", name: "한국어" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "th", name: "ภาษาไทย" },
    { code: "vi", name: "Tiếng Việt" }
] as const;

// LocalStorage keys
export const STORAGE_KEYS = {
    HIDE_UID: "hideUID",
    BACKGROUND_BLUR: "backgroundBlur",
    SUBSTAT_DISTRIBUTION: "substatDistribution",
    ALL_TRACES: "allTraces",
    SAVED_BUILDS: "savedBuilds",
    UID: "uid",
    LANG: "lang"
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
    hideUID: false,
    blur: false,
    substatDistribution: false,
    allTraces: false,
    lang: "en"
} as const;
