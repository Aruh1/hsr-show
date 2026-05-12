import Image from "next/image";
import type { SkillTree } from "@/types";
import { ASSET_URL } from "@/lib/constants";

interface IconMap {
    [key: string]: SkillTree[];
}

interface TraceTreeProps {
    iconData: SkillTree;
    iconMap: IconMap;
    path: string;
}

/**
 * Recursive component for rendering skill tree traces
 */
export const TraceTree = ({ iconData, iconMap, path }: TraceTreeProps) => {
    const icon = iconData;
    const children = iconMap[icon.id];
    const isSkill = icon.icon.startsWith("icon/skill/");
    const iconStyle = isSkill ? "w-10 h-10 border-2 border-neutral-300" : "w-6 h-6 p-0.5";
    const iconState = icon.level === 0 ? "opacity-30" : "";
    let show = true;
    if (["Rogue", "Priest"].includes(path)) {
        show = !["Point09", "Point12", "Point15", "Point18"].includes(icon.anchor);
    }

    return show ? (
        <div
            className={`flex items-center justify-center gap-1
                    ${!["Rogue", "Priest", "Warrior", "Warlock", "Shaman", "Mage", "Memory", "Knight", "Elation"].includes(path) ? "flex-row" : "flex-col"}
                    ${path === "Knight" && icon.anchor === "Point08" ? "flex-col items-center justify-center" : ""}
                    ${path === "Memory" && icon.anchor === "Point08" ? "flex-col items-center justify-center" : ""}
                    ${path === "Elation" && icon.anchor === "Point08" ? "flex-col items-center justify-center" : ""}
                    ${path === "Memory" && icon.anchor === "Point09" ? "flex-col" : ""}
                    ${path === "Knight" && icon.anchor === "Point09" ? "flex-col" : ""}
                    ${path === "Elation" && icon.anchor === "Point09" ? "flex-col" : ""}`}
        >
            <Image
                src={ASSET_URL + icon.icon}
                alt={`Icon ${icon.id}`}
                width={isSkill ? 40 : 24}
                height={isSkill ? 40 : 24}
                className={`${iconStyle} ${iconState} rounded-full bg-neutral-800`}
            />
            {children
                ? children.map((childIcon, index) => (
                      <TraceTree key={childIcon.id || index} iconData={childIcon} iconMap={iconMap} path={path} />
                  ))
                : null}
        </div>
    ) : null;
};

interface MinorTracesProps {
    skillTrees: SkillTree[];
}

/**
 * Component for rendering minor trace property icons
 */
export const MinorTraces = ({ skillTrees }: MinorTracesProps) => {
    const propertyIcons = skillTrees.filter(item => item.icon.startsWith("icon/property/Icon") && !item.parent);

    return (
        <div className="flex flex-col items-center justify-center gap-1">
            {propertyIcons.map((propertyIcon, index) => (
                <Image
                    key={propertyIcon.id || index}
                    src={ASSET_URL + propertyIcon.icon}
                    alt={`Property Icon ${propertyIcon.id}`}
                    width={24}
                    height={24}
                    className={`h-6 w-6 rounded-full bg-neutral-800 p-0.5 ${propertyIcon.level === 0 ? "opacity-30" : ""}`}
                />
            ))}
        </div>
    );
};
