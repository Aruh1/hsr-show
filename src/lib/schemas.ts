import { z } from "zod";

/**
 * Zod schemas for API response validation.
 * These ensure type safety when consuming external APIs.
 */

// Base attribute schema
const AttributeSchema = z.object({
    field: z.string(),
    name: z.string(),
    icon: z.string(),
    value: z.number(),
    display: z.string(),
    percent: z.boolean().optional()
});

// Sub-affix schema with roll distribution
const SubAffixSchema = z.object({
    type: z.string(),
    field: z.string(),
    name: z.string(),
    icon: z.string(),
    value: z.number(),
    display: z.string(),
    percent: z.boolean(),
    count: z.number(),
    step: z.number(),
    dist: z.array(z.number()).optional()
});

// Main affix schema
const MainAffixSchema = z.object({
    type: z.string(),
    field: z.string(),
    name: z.string(),
    icon: z.string(),
    value: z.number(),
    display: z.string(),
    percent: z.boolean()
});

// Relic schema
const RelicSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.number(),
    set_id: z.string(),
    set_name: z.string(),
    rarity: z.number(),
    level: z.number(),
    icon: z.string(),
    main_affix: MainAffixSchema,
    sub_affix: z.array(SubAffixSchema)
});

// Light cone schema
const LightConeSchema = z.object({
    id: z.string(),
    name: z.string(),
    rarity: z.number(),
    rank: z.number(),
    level: z.number(),
    promotion: z.number(),
    icon: z.string(),
    preview: z.string(),
    portrait: z.string(),
    path: z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string()
    }),
    attributes: z.array(AttributeSchema),
    properties: z.array(
        z.object({
            type: z.string(),
            field: z.string(),
            name: z.string(),
            icon: z.string(),
            value: z.number(),
            display: z.string(),
            percent: z.boolean()
        })
    )
});

// Skill schema
const SkillSchema = z.object({
    id: z.string(),
    name: z.string(),
    level: z.number(),
    max_level: z.number(),
    element: z
        .object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
            icon: z.string()
        })
        .nullable(),
    type: z.string(),
    type_text: z.string(),
    effect: z.string(),
    effect_text: z.string(),
    simple_desc: z.string(),
    desc: z.string(),
    icon: z.string()
});

// Skill tree schema
const SkillTreeSchema = z.object({
    id: z.string(),
    level: z.number(),
    anchor: z.string(),
    max_level: z.number(),
    icon: z.string(),
    parent: z.string().nullable()
});

// Relic set schema
const RelicSetSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    num: z.number(),
    desc: z.string(),
    properties: z.array(
        z.object({
            type: z.string(),
            field: z.string(),
            name: z.string(),
            icon: z.string(),
            value: z.number(),
            display: z.string(),
            percent: z.boolean()
        })
    )
});

// Character schema
export const CharacterSchema = z.object({
    id: z.string(),
    name: z.string(),
    rarity: z.number(),
    rank: z.number(),
    level: z.number(),
    promotion: z.number(),
    enhanced: z.boolean(),
    icon: z.string(),
    preview: z.string(),
    portrait: z.string(),
    rank_icons: z.array(z.string()),
    path: z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string()
    }),
    element: z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
        icon: z.string()
    }),
    skills: z.array(SkillSchema),
    skill_trees: z.array(SkillTreeSchema),
    light_cone: LightConeSchema.nullable(),
    relics: z.array(RelicSchema),
    relic_sets: z.array(RelicSetSchema),
    statistics: z.array(
        z.object({
            field: z.string(),
            name: z.string(),
            icon: z.string(),
            value: z.number(),
            display: z.string(),
            percent: z.boolean()
        })
    ),
    attributes: z.array(AttributeSchema),
    additions: z.array(AttributeSchema),
    properties: z.array(
        z.object({
            type: z.string().optional(),
            field: z.string().optional(),
            name: z.string(),
            icon: z.string(),
            value: z.number(),
            display: z.string(),
            percent: z.boolean().optional()
        })
    ),
    pos: z.array(z.number()),
    property: z.array(
        z.object({
            name: z.string(),
            icon: z.string(),
            base: z.number().optional(),
            addition: z.number().optional(),
            value: z.number(),
            display: z.string()
        })
    )
});

// Player avatar schema
const PlayerAvatarSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string()
});

// Space info schema
const SpaceInfoSchema = z.object({
    memory_data: z.unknown().nullable(),
    universe_level: z.number(),
    avatar_count: z.number(),
    light_cone_count: z.number(),
    relic_count: z.number(),
    achievement_count: z.number(),
    book_count: z.number(),
    music_count: z.number()
});

// Player schema
const PlayerSchema = z.object({
    uid: z.string(),
    nickname: z.string(),
    level: z.number(),
    world_level: z.number(),
    friend_count: z.number(),
    avatar: PlayerAvatarSchema,
    signature: z.string().optional(),
    is_display: z.boolean(),
    space_info: SpaceInfoSchema
});

// Detail info schema
const DetailInfoSchema = z.object({
    platform: z.string()
});

// Full profile data schema
export const ProfileDataSchema = z.object({
    status: z.number().optional(),
    player: PlayerSchema,
    characters: z.array(CharacterSchema),
    detailInfo: DetailInfoSchema.optional(),
    timestamp: z.string().optional(),
    powered: z.string().optional()
});

// Mihomo API response schema
export const MihomoResponseSchema = z.object({
    player: PlayerSchema,
    characters: z.array(z.unknown())
});

/**
 * Validate API response with detailed error messages
 */
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join("; ");
        throw new Error(`Validation failed${context ? ` for ${context}` : ""}: ${errors}`);
    }

    return result.data;
}
