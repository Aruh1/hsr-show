import { useMemo } from "react";
import type { Character, SkillTree } from "@/types";
import { ASSET_URL, ROMAN_NUM, MEMOSPRITE_LABELS, STAT_LABELS } from "@/lib/constants";
import { TraceTree, MinorTraces } from "@/components/TraceComponents";
import { AiFillLock } from "react-icons/ai";

interface CharacterCardProps {
    character: Character;
    uid: string;
    nickname: string | undefined;
    hideUID: boolean;
    blur: boolean;
    customImage: string | null;
    substatDistribution: boolean;
    allTraces: boolean;
    lang: string;
}

interface IconMap {
    [key: string]: SkillTree[];
}

const CharacterCard = ({
    character,
    uid,
    nickname,
    hideUID,
    blur,
    customImage,
    substatDistribution,
    allTraces,
    lang
}: CharacterCardProps) => {
    // Get localized labels for Memosprite
    const localizedLabels = MEMOSPRITE_LABELS[lang] || MEMOSPRITE_LABELS["en"];
    const statLabels = STAT_LABELS[lang] || STAT_LABELS["en"];
    // Memoize skill type map - only recompute when skills change
    const skillTypes = useMemo(() => {
        const map = new Map<string, string>();
        character.skills.forEach(skill => {
            map.set(skill.id.slice(-2), skill.type_text);
        });
        return map;
    }, [character.skills]);

    // Memoize icon map - only recompute when skill_trees change
    const iconMap = useMemo<IconMap>(() => {
        return character.skill_trees.reduce((map: IconMap, icon) => {
            if (icon.parent !== null) {
                if (!map[icon.parent]) {
                    map[icon.parent] = [];
                }
                map[icon.parent].push(icon);
            }
            return map;
        }, {});
    }, [character.skill_trees]);

    // Memoize major traces filter - only recompute when skill_trees change
    const majorTraces = useMemo(() => {
        return character.skill_trees.filter(
            icon => icon.parent === null && icon.max_level === 1 && icon.anchor !== "Point05"
        );
    }, [character.skill_trees]);

    return (
        <div className={`relative min-h-[650px] w-[1400px] rounded-3xl ${blur ? "BG" : "Blur-BG"} overflow-hidden`}>
            <div className="absolute bottom-2 left-4 z-10">
                <span
                    className={`${hideUID ? "hidden" : ""} shadow-black [text-shadow:1px_1px_2px_var(--tw-shadow-color)]`}
                >
                    {uid} • {nickname}
                </span>
            </div>
            <div className="flex flex-row items-center">
                <div className="relative min-h-[650px] w-[28%]">
                    <div className="flex h-[650px] items-center">
                        {customImage ? (
                            <div
                                className={`h-full w-full scale-[1.15] bg-cover bg-center bg-no-repeat`}
                                style={{ backgroundImage: `url(${customImage})` }}
                            ></div>
                        ) : (
                            <img
                                src={ASSET_URL + character?.portrait}
                                alt="Character Preview"
                                className="scale-[1.8]"
                            />
                        )}
                    </div>
                    <div className={`absolute right-0 top-0 mr-[-15px] pt-3`}>
                        <div className="flex flex-col">
                            {character?.rank_icons.slice(0, character?.rank).map((rank_icon, index) => (
                                <div
                                    key={index}
                                    className="relative my-1 flex rounded-full border-2 border-neutral-300 bg-neutral-800"
                                >
                                    <img src={ASSET_URL + rank_icon} alt="Rank Icon" className="h-auto w-10" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            {character?.rank_icons.slice(character?.rank, 6).map((rank_icon, index) => (
                                <div
                                    key={index}
                                    className="relative my-1 flex rounded-full border-2 border-neutral-500 bg-neutral-800"
                                >
                                    <img
                                        src={ASSET_URL + rank_icon}
                                        alt="Rank Icon"
                                        className="h-auto w-10 scale-[0.9]"
                                    />
                                    <div className="absolute flex h-full w-full items-center justify-center rounded-full bg-neutral-800/70">
                                        <AiFillLock className="h-5 w-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    className={`relative flex min-h-[650px] w-[72%] flex-row items-center gap-3.5 rounded-r-3xl pl-10 ${
                        blur ? "Fade-BG" : "Fade-Blur-BG"
                    }`}
                >
                    <div className="flex min-h-[650px] w-1/3 flex-col justify-between py-3">
                        {/* Top Section - Character Info */}
                        <div className="flex-shrink-0">
                            <div className="flex flex-row items-center justify-between">
                                <span className={`${(character?.name ?? "").length > 12 ? "text-4xl" : "text-5xl"}`}>
                                    {character?.name}
                                </span>
                                <img
                                    src={ASSET_URL + character?.element.icon}
                                    alt="Element Icon"
                                    className="h-auto w-14"
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <img src={ASSET_URL + character?.path.icon} alt="Path Icon" className="h-auto w-8" />
                                <span className="text-xl">{character?.path.name}</span>
                            </div>
                            <div>
                                <span className="text-2xl">Lv. {character?.level}</span>
                                <span className="text-xl"> / </span>
                                <span className="text-xl text-neutral-400">{character?.promotion * 10 + 20}</span>
                            </div>
                        </div>

                        {/* Middle Section - Main Container for Traces + Light Cone */}
                        <div className="flex flex-1 flex-col justify-center gap-4">
                            {/* Skills/Traces */}
                            <div className="relative mx-4 flex h-auto w-auto flex-row items-center justify-evenly py-2">
                                <div className="absolute mb-5">
                                    <img
                                        src={ASSET_URL + character?.path.icon}
                                        alt="Path Icon"
                                        className="h-40 w-40 opacity-20"
                                    />
                                </div>
                                <div className="flex h-full w-1/3 flex-col justify-center gap-8">
                                    {character?.skill_trees.slice(0, 2).map((skill, index) => (
                                        <div key={skill.id || index} className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={ASSET_URL + skill.icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-neutral-800"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {skill.level} / {skill.max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {skillTypes.get(skill.id.slice(-2))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex h-full w-1/3 flex-col justify-center gap-2">
                                    {character?.path?.id === "Memory" && character?.skill_trees[18] && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={ASSET_URL + character.skill_trees[18].icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-violet-800"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {character.skill_trees[18].level} /{" "}
                                                    {character.skill_trees[18].max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {localizedLabels.skill}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Elation Path - Skill at index 18 (above Ultimate) */}
                                    {character?.path?.id === "Elation" && character?.skill_trees[18] && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={ASSET_URL + character.skill_trees[18].icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-amber-700"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {character.skill_trees[18].level} /{" "}
                                                    {character.skill_trees[18].max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {skillTypes.get(character.skill_trees[18].id.slice(-2))}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative flex flex-col items-center">
                                        <img
                                            src={ASSET_URL + character?.skill_trees[2].icon}
                                            alt="Skill Icon"
                                            className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-neutral-800"
                                        />
                                        <span className="black-blur absolute bottom-4 text-sm">
                                            {character?.skill_trees[2].level} / {character?.skill_trees[2].max_level}
                                        </span>
                                        <span className="z-10 mt-1.5 truncate text-sm">
                                            {skillTypes.get(character?.skill_trees[2].id.slice(-2))}
                                        </span>
                                    </div>
                                    {character?.path?.id === "Memory" && character?.skill_trees[19] && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={ASSET_URL + character.skill_trees[19].icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-violet-800"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {character.skill_trees[19].level} /{" "}
                                                    {character.skill_trees[19].max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {localizedLabels.talent}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex h-full w-1/3 flex-col justify-center gap-8">
                                    {character?.skill_trees.slice(3, 5).map((skill, index) => (
                                        <div key={skill.id || index} className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={ASSET_URL + skill.icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-neutral-800"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {skill.level} / {skill.max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {skillTypes.get(skill.id.slice(-2))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Major Traces */}
                            {!allTraces && (
                                <div className="flex items-center justify-center">
                                    <div className={`flex w-full flex-row justify-evenly`}>
                                        {majorTraces.map(icon => (
                                            <TraceTree
                                                key={icon.id}
                                                iconData={icon}
                                                iconMap={iconMap}
                                                path={character.path.id}
                                            />
                                        ))}
                                        {["Rogue", "Priest"].includes(character?.path?.id) && (
                                            <MinorTraces skillTrees={character.skill_trees} />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Light Cone */}
                            {character?.light_cone ? (
                                <div className="flex flex-row items-center justify-center">
                                    <div className="relative flex flex-col items-center">
                                        <img
                                            src={ASSET_URL + character?.light_cone?.preview}
                                            alt="Light Cone Preview"
                                            className="h-auto w-32 -rotate-13"
                                        />
                                        <img
                                            src={
                                                ASSET_URL + "icon/deco/Rarity" + character?.light_cone?.rarity + ".png"
                                            }
                                            alt="Light Cone Rarity Icon"
                                            className={`absolute bottom-0 left-1 h-auto w-36 ${
                                                character?.light_cone?.rarity == 4 && "left-2.5"
                                            }`}
                                        />
                                    </div>
                                    <div className="flex w-3/5 flex-col items-center gap-2 text-center">
                                        <span className="text-xl">{character?.light_cone?.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-6 w-6 rounded-full font-normal ${
                                                    character?.light_cone?.rank == 5
                                                        ? "bg-[#f6ce71] text-black"
                                                        : "bg-neutral-800 text-[#dcc491]"
                                                }`}
                                                style={{
                                                    fontFamily: character?.light_cone?.rank != 1 && "Times New Roman"
                                                }}
                                            >
                                                {ROMAN_NUM[character?.light_cone?.rank]}
                                            </div>
                                            <div>
                                                <span className="text-lg">Lv. {character?.light_cone?.level}</span>
                                                <span> / </span>
                                                <span className="text-neutral-400">
                                                    {character?.light_cone?.promotion * 10 + 20}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-1.5">
                                            {character?.light_cone?.attributes.map((attribute, index) => (
                                                <div
                                                    key={`lc-attr-${index}`}
                                                    className="black-blur flex flex-row items-center rounded-sm pr-1"
                                                >
                                                    <img
                                                        src={ASSET_URL + attribute.icon}
                                                        alt="Attribute Icon"
                                                        className="h-auto w-6"
                                                    />
                                                    <span className="text-sm">{attribute.display}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span className="flex justify-center">No Light Cone Equipped</span>
                            )}
                        </div>

                        {/* Bottom Section - Relic Sets */}
                        {allTraces && (
                            <div className="flex-shrink-0">
                                <hr />
                                <div className="flex flex-col items-center gap-1">
                                    {character?.relic_sets.map((relic_set, index) => (
                                        <div
                                            key={relic_set.id || index}
                                            className="flex w-full flex-row justify-between text-left"
                                        >
                                            <span className="text-base">{relic_set.name}</span>
                                            <div>
                                                <span className="black-blur flex w-5 justify-center rounded-sm px-1.5 py-0.5">
                                                    {relic_set.num}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex h-[650px] w-1/3 flex-col justify-between py-3">
                        <div
                            className={`flex w-full flex-col justify-between gap-y-0.5 ${
                                !allTraces && character?.property?.length >= 10 ? "text-base" : "text-lg"
                            }
              ${!allTraces ? "h-[500px]" : "h-[650px]"}`}
                        >
                            {character?.property.map((stat, index) => (
                                <div key={`stat-${index}`} className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center">
                                        <img src={ASSET_URL + stat.icon} alt="Stat Icon" className="h-auto w-10" />
                                        <span>{stat.name}</span>
                                    </div>
                                    <span className="mx-3 grow rounded-sm border border-neutral-300 opacity-50"></span>
                                    <div className="flex cursor-default flex-col text-right">
                                        {stat.icon === "icon/property/IconSpeed.png" ? (
                                            <span>{(stat.value - 0.005).toFixed(1)}</span>
                                        ) : stat.icon === "icon/property/IconEnergyRecovery.png" ? (
                                            <span>{parseFloat(stat.display) + 100 + "%"}</span>
                                        ) : (
                                            <span>{stat.display}</span>
                                        )}
                                        <div className="flex flex-row">
                                            {stat.addition > 0 && (
                                                <span className="text-xs">
                                                    {stat.icon === "icon/property/IconSpeed.png" ? (
                                                        <>
                                                            <span>{parseFloat(String(stat.base)).toFixed(1)}</span>
                                                            <span className="text-blue-300">
                                                                {" "}
                                                                +{(stat.addition - 0.005).toFixed(1)}
                                                            </span>
                                                        </>
                                                    ) : stat.icon === "icon/property/IconCriticalChance.png" ||
                                                      stat.icon === "icon/property/IconCriticalDamage.png" ? (
                                                        <></>
                                                    ) : (
                                                        <>
                                                            <span>{stat.base}</span>
                                                            <span className="text-blue-300">
                                                                {" "}
                                                                +{Math.trunc(stat.addition)}
                                                            </span>
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!character?.property.some(
                                item => item.icon === "icon/property/IconEnergyRecovery.png"
                            ) && (
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center">
                                        <img
                                            src={ASSET_URL + "icon/property/IconEnergyRecovery.png"}
                                            alt="Stat Icon"
                                            className="h-auto w-10"
                                        />
                                        <span>{statLabels.err}</span>
                                    </div>
                                    <span className="mx-3 grow rounded-sm border border-neutral-300 opacity-50"></span>
                                    <div className="flex flex-col text-right">
                                        <div className="flex flex-row">
                                            <span>100.0%</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!allTraces && (
                            <>
                                <hr />
                                <div className="flex flex-col items-center gap-1">
                                    {character?.relic_sets.map((relic_set, index) => (
                                        <div
                                            key={relic_set.id || index}
                                            className="flex w-full flex-row justify-between text-left"
                                        >
                                            <span>{relic_set.name}</span>
                                            <div>
                                                <span className="black-blur flex w-5 justify-center rounded-sm px-1.5 py-0.5">
                                                    {relic_set.num}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="w-1/3">
                        <div className="flex h-[650px] flex-col justify-between py-3 text-lg">
                            {character?.relics.map((relic, index) => (
                                <div
                                    key={relic.id || index}
                                    className={`black-blur relative flex flex-row items-center rounded-s-lg border-l-2 p-1
                  ${relic.rarity == 5 && "border-yellow-600"}
                  ${relic.rarity == 4 && "border-purple-600"}
                  ${relic.rarity == 3 && "border-blue-600"}
                  `}
                                >
                                    <div className="flex">
                                        <img src={ASSET_URL + relic.icon} alt="Relic Icon" className="h-auto w-20" />
                                        <img
                                            src={ASSET_URL + "icon/deco/Star" + relic.rarity + ".png"}
                                            alt="Relic Rarity Icon"
                                            className="absolute bottom-1 h-auto w-20"
                                        />
                                    </div>
                                    <div className="mx-1 flex w-1/6 flex-col items-center justify-center">
                                        <img
                                            src={ASSET_URL + relic.main_affix.icon}
                                            alt="Main Affix Icon"
                                            className="h-auto w-9"
                                        />
                                        <span className="text-base text-[#f1a23c]">{relic.main_affix.display}</span>
                                        <span className="black-blur rounded-sm px-1 text-xs">+{relic.level}</span>
                                    </div>
                                    <div className="h-[80px] border-l opacity-50"></div>
                                    <div
                                        className={`m-auto grid w-1/2 grid-cols-2 ${substatDistribution ? "mt-1 gap-0.5" : "gap-2"}`}
                                    >
                                        {relic.sub_affix.map((sub_affix, index) => (
                                            <div key={index} className="flex flex-col">
                                                <div className="flex flex-row items-center">
                                                    <img
                                                        src={ASSET_URL + sub_affix.icon}
                                                        alt="Sub Affix Icon"
                                                        className="h-auto w-7"
                                                    />
                                                    {sub_affix.field === "spd" ? (
                                                        <span className="text-sm">
                                                            +{(sub_affix.value - 0.005).toFixed(1)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm">+{sub_affix.display}</span>
                                                    )}
                                                </div>
                                                {substatDistribution && (
                                                    <div className="flex w-full flex-row justify-evenly">
                                                        {sub_affix?.dist?.map((step, index) => (
                                                            <div key={index} className="-mt-3 text-sm text-blue-300">
                                                                {step === 0 ? "." : step === 1 ? ".." : "..."}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;
