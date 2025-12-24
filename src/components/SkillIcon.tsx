import { ASSET_URL } from "@/lib/constants";
import type { SkillTree } from "@/types";

interface SkillIconProps {
    skill: SkillTree;
    typeText?: string;
    customLabel?: string;
    borderColor?: string;
}

/**
 * Reusable skill icon component with level display
 */
export const SkillIcon = ({ skill, typeText, customLabel, borderColor = "border-neutral-500" }: SkillIconProps) => {
    const bgColor = borderColor === "border-neutral-500" ? "bg-neutral-800" : "bg-violet-800";

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center">
                <img
                    src={ASSET_URL + skill.icon}
                    alt="Skill Icon"
                    className={`h-auto w-12 rounded-full border-2 ${borderColor} ${bgColor}`}
                />
                <span className="black-blur absolute bottom-4 text-sm">
                    {skill.level} / {skill.max_level}
                </span>
                <span className="z-10 mt-1.5 truncate text-sm">{customLabel || typeText}</span>
            </div>
        </div>
    );
};
