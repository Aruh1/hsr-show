import { AiFillLock } from "react-icons/ai";

const CharacterCard = ({ character, uid, nickname, hideUID, blur, customImage, substatDistribution, allTraces }) => {
    const asset_url = "https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/";
    const roman_num = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
        5: "V"
    };
    const skill_types = new Map();
    character.skills.forEach(skill => {
        skill_types.set(skill.id.slice(-2), skill.type_text);
    });

    const iconMap = character.skill_trees.reduce((map, icon) => {
        if (icon.parent !== null) {
            if (!map[icon.parent]) {
                map[icon.parent] = [];
            }
            map[icon.parent].push(icon);
        }
        return map;
    }, {});

    const MinorTraces = () => {
        const propertyIcons = character.skill_trees.filter(
            item => item.icon.startsWith("icon/property/Icon") && !item.parent
        );
        return (
            <div className="flex flex-col items-center justify-center gap-1">
                {propertyIcons.map((propertyIcon, index) => (
                    <img
                        key={propertyIcon.id || index}
                        src={asset_url + propertyIcon.icon}
                        alt={`Property Icon ${propertyIcon.id}`}
                        className={`h-6 w-6 rounded-full bg-neutral-800 p-0.5 ${propertyIcon.level === 0 && "opacity-30"}`}
                    />
                ))}
            </div>
        );
    };

    const TraceTree = ({ iconData, iconMap, path }) => {
        const icon = iconData;
        const children = iconMap[icon.id];
        const iconStyle = icon.icon.startsWith("icon/skill/")
            ? "w-10 h-10 border-2 border-neutral-300"
            : "w-6 h-6 p-0.5";
        const iconState = icon.level === 0 ? "opacity-30" : "";
        let show = true;
        if (["Rogue", "Priest", "Mage"].includes(path)) {
            show = !["Point09", "Point12", "Point15", "Point18"].includes(icon.anchor);
        }

        return (
            show && (
                <div
                    className={`flex items-center justify-center gap-1
                        ${!["Rogue", "Priest", "Warrior", "Warlock", "Shaman", "Mage", "Memory"].includes(path) ? "flex-row" : "flex-col"}
                        ${path === "Knight" && icon.anchor === "Point08" ? "flex-col items-center justify-center" : ""}
                        ${path === "Memory" && icon.anchor === "Point08" ? "flex-col items-center justify-center" : ""}
                        ${path === "Memory" && icon.anchor === "Point09" ? "flex-col" : ""}
                        ${path === "Knight" && icon.anchor === "Point09" ? "flex-col" : ""}`}
                >
                    <img
                        src={asset_url + icon.icon}
                        alt={`Icon ${icon.id}`}
                        className={`${iconStyle} ${iconState} rounded-full bg-neutral-800`}
                    />
                    {children &&
                        children.map((childIcon, index) => (
                            <TraceTree key={childIcon.id || index} iconData={childIcon} iconMap={iconMap} path={path} />
                        ))}
                </div>
            )
        );
    };

    const majorTraces = character.skill_trees.filter(
        icon => icon.parent === null && icon.max_level === 1 && icon.anchor !== "Point05"
    );

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
                                src={asset_url + character?.portrait}
                                alt="Character Preview"
                                className="scale-[1.8]"
                            />
                        )}
                    </div>
                    <div className={`absolute right-0 top-0 mr-[-15px] pt-3`}>
                        <div className="flex flex-col">
                            {character?.rank_icons.slice(0, character?.rank).map((rank_icon, index) => (
                                <div
                                    key={rank_icon.id || index}
                                    className="relative my-1 flex rounded-full border-2 border-neutral-300 bg-neutral-800"
                                >
                                    <img src={asset_url + rank_icon} alt="Rank Icon" className="h-auto w-10" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            {character?.rank_icons.slice(character?.rank, 6).map((rank_icon, index) => (
                                <div
                                    key={rank_icon.id || index}
                                    className="relative my-1 flex rounded-full border-2 border-neutral-500 bg-neutral-800"
                                >
                                    <img
                                        src={asset_url + rank_icon}
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
                    <div className="flex h-[650px] w-1/3 flex-col justify-between py-3">
                        <div className="flex h-full flex-col justify-between">
                            <div className="">
                                <div className="flex flex-row items-center justify-between">
                                    <span className={`${(character?.name).length > 12 ? "text-4xl" : "text-5xl"}`}>
                                        {character?.name}
                                    </span>
                                    <img
                                        src={asset_url + character?.element.icon}
                                        alt="Element Icon"
                                        className="h-auto w-14"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <img
                                        src={asset_url + character?.path.icon}
                                        alt="Path Icon"
                                        className="h-auto w-8"
                                    />
                                    <span className="text-xl">{character?.path.name}</span>
                                </div>
                                <div>
                                    <span className="text-2xl">Lv. {character?.level}</span>
                                    <span className="text-xl"> / </span>
                                    <span className="text-xl text-neutral-400">{character?.promotion * 10 + 20}</span>
                                </div>
                            </div>
                            <div className="relative mx-4 flex h-[225px] w-auto flex-row items-center justify-evenly">
                                <div className="absolute mb-5">
                                    <img
                                        src={asset_url + character?.path.icon}
                                        alt="Path Icon"
                                        className="h-40 w-40 opacity-20"
                                    />
                                </div>
                                <div className="flex h-full w-1/3 flex-col justify-center gap-8">
                                    {character?.skill_trees.slice(0, 2).map((skill, index) => (
                                        <div key={skill.id || index} className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={asset_url + skill.icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-neutral-800"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {skill.level} / {skill.max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {skill_types.get(skill.id.slice(-2))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex w-1/3 justify-center">
                                    <div className="relative flex flex-col items-center">
                                        <img
                                            src={asset_url + character?.skill_trees[2].icon}
                                            alt="Skill Icon"
                                            className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-neutral-800"
                                        />
                                        <span className="black-blur absolute bottom-4 text-sm">
                                            {character?.skill_trees[2].level} / {character?.skill_trees[2].max_level}
                                        </span>
                                        <span className="z-10 mt-1.5 truncate text-sm">
                                            {skill_types.get(character?.skill_trees[2].id.slice(-2))}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex h-full w-1/3 flex-col justify-center gap-8">
                                    {character?.skill_trees.slice(3, 5).map((skill, index) => (
                                        <div key={skill.id || index} className="flex flex-col items-center">
                                            <div className="relative flex flex-col items-center">
                                                <img
                                                    src={asset_url + skill.icon}
                                                    alt="Skill Icon"
                                                    className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-neutral-800"
                                                />
                                                <span className="black-blur absolute bottom-4 text-sm">
                                                    {skill.level} / {skill.max_level}
                                                </span>
                                                <span className="z-10 mt-1.5 truncate text-sm">
                                                    {skill_types.get(skill.id.slice(-2))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {character?.path?.id === "Memory" && (
                                    <div className="flex h-full w-1/3 flex-col justify-center gap-8">
                                        {character?.skill_trees.slice(18, 20).map((skill, index) => (
                                            <div key={skill.id || index} className="flex flex-col items-center">
                                                <div className="relative flex flex-col items-center">
                                                    <img
                                                        src={asset_url + skill.icon}
                                                        alt="Skill Icon"
                                                        className="h-auto w-12 rounded-full border-2 border-neutral-500 bg-violet-800"
                                                    />
                                                    <span className="black-blur absolute bottom-4 text-sm">
                                                        {skill.level} / {skill.max_level}
                                                    </span>
                                                    <span className="z-10 mt-1.5 truncate text-sm">
                                                        {index === 0
                                                            ? skill_types.get(character?.skill_trees[1].id.slice(-2))
                                                            : skill_types.get(character?.skill_trees[3].id.slice(-2))}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {!allTraces && (
                                <div className="flex items-center justify-center">
                                    <div className={`flex w-full flex-row justify-evenly`}>
                                        {majorTraces.map((icon, index) => (
                                            <TraceTree
                                                key={icon.id}
                                                iconData={icon}
                                                iconMap={iconMap}
                                                index={index}
                                                path={character.path.id}
                                            />
                                        ))}
                                        {["Rogue", "Priest", "Mage"].includes(character?.path?.id) && <MinorTraces />}
                                    </div>
                                </div>
                            )}
                            {character?.light_cone ? (
                                <div className="flex flex-row items-center justify-center">
                                    <div className="relative flex flex-col items-center">
                                        <img
                                            src={asset_url + character?.light_cone?.preview}
                                            alt="Light Cone Preview"
                                            className="h-auto w-32 -rotate-[13deg]"
                                        />
                                        <img
                                            src={
                                                asset_url + "icon/deco/Rarity" + character?.light_cone?.rarity + ".png"
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
                                                {roman_num[character?.light_cone?.rank]}
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
                                                    key={attribute.id || index}
                                                    className="black-blur flex flex-row items-center rounded pr-1"
                                                >
                                                    <img
                                                        src={asset_url + attribute.icon}
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
                            {allTraces && (
                                <>
                                    <hr />
                                    <div className="flex flex-col items-center gap-1">
                                        {character?.relic_sets.map((relic_set, index) => (
                                            <div
                                                key={relic_set.id || index}
                                                className="flex w-full flex-row justify-between text-left"
                                            >
                                                <span className="text-base">{relic_set.name}</span>
                                                <div>
                                                    <span className="black-blur flex w-5 justify-center rounded px-1.5 py-0.5">
                                                        {relic_set.num}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex h-[650px] w-1/3 flex-col justify-between py-3">
                        <div
                            className={`flex w-full flex-col justify-between gap-y-0.5 ${
                                !allTraces && character?.property?.length >= 10 ? "text-base" : "text-lg"
                            }
              ${!allTraces ? "h-[500px]" : "h-[650px]"}`}
                        >
                            {character?.property.map((stat, index) => (
                                <div key={stat.id || index} className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center">
                                        <img src={asset_url + stat.icon} alt="Stat Icon" className="h-auto w-10" />
                                        <span>{stat.name}</span>
                                    </div>
                                    <span className="mx-3 flex-grow rounded border-[1px] border-neutral-300 opacity-50"></span>
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
                                                            <span>{parseFloat(stat.base).toFixed(1)}</span>
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
                                            src={asset_url + "icon/property/IconEnergyRecovery.png"}
                                            alt="Stat Icon"
                                            className="h-auto w-10"
                                        />
                                        <span>Energy Regeneration Rate</span>
                                    </div>
                                    <span className="mx-3 flex-grow rounded border-[1px] border-neutral-300 opacity-50"></span>
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
                                                <span className="black-blur flex w-5 justify-center rounded px-1.5 py-0.5">
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
                                        <img src={asset_url + relic.icon} alt="Relic Icon" className="h-auto w-20" />
                                        <img
                                            src={asset_url + "icon/deco/Star" + relic.rarity + ".png"}
                                            alt="Relic Rarity Icon"
                                            className="absolute bottom-1 h-auto w-20"
                                        />
                                    </div>
                                    <div className="mx-1 flex w-1/6 flex-col items-center justify-center">
                                        <img
                                            src={asset_url + relic.main_affix.icon}
                                            alt="Main Affix Icon"
                                            className="h-auto w-9"
                                        />
                                        <span className="text-base text-[#f1a23c]">{relic.main_affix.display}</span>
                                        <span className="black-blur rounded px-1 text-xs">+{relic.level}</span>
                                    </div>
                                    <div className="h-[80px] border-l-[1px] opacity-50"></div>
                                    <div
                                        className={`m-auto grid w-1/2 grid-cols-2 ${substatDistribution ? "mt-1 gap-0.5" : "gap-2"}`}
                                    >
                                        {relic.sub_affix.map((sub_affix, index) => (
                                            <div key={index} className="flex flex-col">
                                                <div className="flex flex-row items-center">
                                                    <img
                                                        src={asset_url + sub_affix.icon}
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
                                                                {step == 0 ? "." : step == "1" ? ".." : "..."}
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
