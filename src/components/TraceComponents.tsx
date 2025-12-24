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
    const iconStyle = icon.icon.startsWith("icon/skill/") ? "w-10 h-10 border-2 border-neutral-300" : "w-6 h-6 p-0.5";
    const iconState = icon.level === 0 ? "opacity-30" : "";
    let show = true;
    if (["Rogue", "Priest"].includes(path)) {
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
                    src={ASSET_URL + icon.icon}
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
                <img
                    key={propertyIcon.id || index}
                    src={ASSET_URL + propertyIcon.icon}
                    alt={`Property Icon ${propertyIcon.id}`}
                    className={`h-6 w-6 rounded-full bg-neutral-800 p-0.5 ${propertyIcon.level === 0 && "opacity-30"}`}
                />
            ))}
        </div>
    );
};
