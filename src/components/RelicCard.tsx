import { ASSET_URL } from "@/lib/constants";
import type { Relic } from "@/types";

interface RelicCardProps {
    relic: Relic;
    substatDistribution: boolean;
}

/**
 * Component for displaying a single relic with main/sub stats
 */
export const RelicCard = ({ relic, substatDistribution }: RelicCardProps) => {
    const getBorderColor = (rarity: number) => {
        switch (rarity) {
            case 5:
                return "border-yellow-600";
            case 4:
                return "border-purple-600";
            case 3:
                return "border-blue-600";
            default:
                return "border-neutral-600";
        }
    };

    return (
        <div
            className={`black-blur relative flex flex-row items-center rounded-s-lg border-l-2 p-1 ${getBorderColor(relic.rarity)}`}
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
                <img src={ASSET_URL + relic.main_affix.icon} alt="Main Affix Icon" className="h-auto w-9" />
                <span className="text-base text-[#f1a23c]">{relic.main_affix.display}</span>
                <span className="black-blur rounded-sm px-1 text-xs">+{relic.level}</span>
            </div>
            <div className="h-[80px] border-l opacity-50"></div>
            <div className={`m-auto grid w-1/2 grid-cols-2 ${substatDistribution ? "mt-1 gap-0.5" : "gap-2"}`}>
                {relic.sub_affix.map((sub_affix, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="flex flex-row items-center">
                            <img src={ASSET_URL + sub_affix.icon} alt="Sub Affix Icon" className="h-auto w-7" />
                            {sub_affix.field === "spd" ? (
                                <span className="text-sm">+{(sub_affix.value - 0.005).toFixed(1)}</span>
                            ) : (
                                <span className="text-sm">+{sub_affix.display}</span>
                            )}
                        </div>
                        {substatDistribution && (
                            <div className="flex w-full flex-row justify-evenly">
                                {sub_affix?.dist?.map((step, stepIndex) => (
                                    <div key={stepIndex} className="-mt-3 text-sm text-blue-300">
                                        {step === 0 ? "." : step === 1 ? ".." : "..."}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
