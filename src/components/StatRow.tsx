import { ASSET_URL } from "@/lib/constants";
import type { Property } from "@/types";

interface StatRowProps {
    stat: Property;
    compact?: boolean;
}

/**
 * Component for displaying a single stat row with icon and value
 */
export const StatRow = ({ stat, compact = false }: StatRowProps) => {
    const textSize = compact ? "text-base" : "text-lg";

    // Format display value based on stat type
    const getDisplayValue = () => {
        if (stat.icon === "icon/property/IconSpeed.png") {
            return (stat.value - 0.005).toFixed(1);
        }
        if (stat.icon === "icon/property/IconEnergyRecovery.png") {
            return parseFloat(stat.display) + 100 + "%";
        }
        return stat.display;
    };

    // Get addition display for speed/other stats
    const getAdditionDisplay = () => {
        if (!stat.addition || stat.addition <= 0) return null;

        if (stat.icon === "icon/property/IconSpeed.png") {
            return (
                <span className="text-xs">
                    <span>{parseFloat(String(stat.base)).toFixed(1)}</span>
                    <span className="text-blue-300"> +{(stat.addition - 0.005).toFixed(1)}</span>
                </span>
            );
        }

        // Skip for crit stats
        if (
            stat.icon === "icon/property/IconCriticalChance.png" ||
            stat.icon === "icon/property/IconCriticalDamage.png"
        ) {
            return null;
        }

        return (
            <span className="text-xs">
                <span>{stat.base}</span>
                <span className="text-blue-300"> +{Math.trunc(stat.addition)}</span>
            </span>
        );
    };

    return (
        <div className={`flex flex-row items-center justify-between ${textSize}`}>
            <div className="flex flex-row items-center">
                <img src={ASSET_URL + stat.icon} alt="Stat Icon" className="h-auto w-10" />
                <span>{stat.name}</span>
            </div>
            <span className="mx-3 grow rounded-sm border border-neutral-300 opacity-50"></span>
            <div className="flex cursor-default flex-col text-right">
                <span>{getDisplayValue()}</span>
                <div className="flex flex-row">{getAdditionDisplay()}</div>
            </div>
        </div>
    );
};

/**
 * Default Energy Regeneration Rate row (shown when not in character stats)
 */
export const DefaultEnergyRow = () => (
    <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
            <img src={ASSET_URL + "icon/property/IconEnergyRecovery.png"} alt="Stat Icon" className="h-auto w-10" />
            <span>Energy Regeneration Rate</span>
        </div>
        <span className="mx-3 grow rounded-sm border border-neutral-300 opacity-50"></span>
        <div className="flex flex-col text-right">
            <div className="flex flex-row">
                <span>100.0%</span>
            </div>
        </div>
    </div>
);
