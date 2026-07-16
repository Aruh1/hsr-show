"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useTransition } from "react";
import { BsPcDisplay, BsAndroid2, BsApple, BsPlaystation } from "react-icons/bs";
import Image from "next/image";
import CharacterCard from "./CharacterCard";
import { toast } from "react-toastify";
import useSWR from "swr";
import type { ProfileData, Character } from "@/types";
import { ASSET_URL, RETRY_CONFIG } from "@/lib/constants";
import { useProfileSettings, useSavedBuilds, useImageExport } from "@/hooks";

// SWR fetcher with error handling
const fetcher = (url: string) =>
    fetch(url).then(res => {
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
        return res.json();
    });

interface ProfileProps {
    uid: string;
    initialData: ProfileData | null;
}

const Profile = ({ uid, initialData }: ProfileProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [character, setCharacter] = useState<Character | null>(null);
    const [selected, setSelected] = useState<number | null>(0);
    const [buildName, setBuildName] = useState("");
    const [showSavedBuilds, setShowSavedBuilds] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);

    // Use custom hooks
    const { settings, toggleSetting, updateSetting } = useProfileSettings();
    const { savedBuilds, saveBuild: saveBuildToStorage, deleteBuild } = useSavedBuilds();
    const { ref, saveImage } = useImageExport<HTMLDivElement>();

    // SWR for data fetching
    const { data } = useSWR<ProfileData>(`/api/u/${uid}?lang=${settings.lang}`, fetcher, {
        fallbackData:
            settings.lang === (initialData?.powered?.includes("en") ? "en" : "en")
                ? (initialData as ProfileData)
                : undefined,
        errorRetryCount: RETRY_CONFIG.maxRetries,
        errorRetryInterval: RETRY_CONFIG.baseDelay,
        revalidateOnFocus: false,
        onSuccess: responseData => {
            if (!character && responseData.characters?.length) {
                setCharacter(responseData.characters[0]);
            }
        },
        onError: () => {
            toast.error(
                <div>
                    Error fetching data after multiple attempts!
                    <br />
                    Try again later or join our discord server for help.
                </div>,
                { toastId: "error-fetching-data" }
            );
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    });

    // Derived values
    const nickname = data?.player.nickname;
    const signature = data?.player.signature;
    const platform = data?.detailInfo?.platform;

    // Memoize platform icon
    const platformIcon = useMemo(() => {
        switch (platform) {
            case "PC":
                return <BsPcDisplay />;
            case "ANDROID":
                return <BsAndroid2 />;
            case "IOS":
                return <BsApple />;
            case "PS5":
                return <BsPlaystation />;
            default:
                return null;
        }
    }, [platform]);

    const linkUID = useCallback(() => {
        updateSetting("savedUID", uid);
        toast.success("UID linked!", { toastId: "success-uid-linked" });
    }, [uid, updateSetting]);

    const handleSaveBuild = useCallback(() => {
        if (!buildName.trim()) {
            toast.error("Enter a build name!", { toastId: "error-build-name-empty" });
            return;
        }

        const result = saveBuildToStorage(data?.player.uid, data?.player.nickname, buildName, character);

        if (result.success) {
            toast.success(`${result.buildName} saved!`, { toastId: `success-build-saved-${buildName}` });
            setBuildName("");
        } else {
            toast.error(result.error || "Failed to save build", { toastId: "error-save-build" });
        }
    }, [character, buildName, data?.player.nickname, data?.player.uid, saveBuildToStorage]);

    const handleCharacterSelect = useCallback((index: number, char: Character) => {
        startTransition(() => {
            setCharacter(char);
            setSelected(index);
            setCustomImage(null);
        });
    }, []);

    const handleDownloadImage = useCallback(() => {
        if (character) {
            saveImage(`${character.name}_Card_${uid}`, customImage ? 1 : 1.5);
        }
    }, [character, customImage, saveImage, uid]);

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                    <span className="text-lg text-gray-300">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-opacity duration-300 ${isPending ? "opacity-70" : "opacity-100"}`}>
            <div className="flex h-auto min-h-screen items-center justify-center">
                <div className="flex overflow-auto">
                    <div className="my-5 flex flex-col lg:items-center">
                        <div className="mx-auto flex h-auto w-full max-w-lg flex-col items-center justify-center gap-4 px-4">
                            <Image
                                src={ASSET_URL + data?.player.avatar.icon}
                                alt={`${nickname}'s Avatar`}
                                width={128}
                                height={128}
                                className="rounded-full border-2 border-stone-300 bg-stone-500"
                                priority
                            />
                            <span className="text-3xl">{nickname}</span>
                            {signature && <span className="text-2xl text-gray-300">{signature}</span>}
                            <div className="flex w-full flex-row items-center justify-evenly gap-4 text-center">
                                <div className="flex flex-col">
                                    <span className="text-lg text-neutral-400 md:text-2xl">Trailblaze Level</span>
                                    <span className="text-lg md:text-xl">{data?.player.level}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg text-neutral-400 md:text-2xl">Equilibrium Level</span>
                                    <span className="text-lg md:text-xl">{data?.player.world_level}</span>
                                </div>
                            </div>
                            <div className="flex w-3/4 flex-col gap-2">
                                <span className="text-2xl text-neutral-400">Trailblaze Records</span>
                                <div className="flex flex-row flex-wrap justify-between gap-x-4">
                                    <span className="text-xl">Characters Owned</span>
                                    <span className="text-xl">{data?.player.space_info.avatar_count}</span>
                                </div>
                                <div className="flex flex-row flex-wrap justify-between gap-x-4">
                                    <span className="text-xl">Achievements Unlocked: </span>
                                    <span className="text-xl">{data?.player.space_info.achievement_count}</span>
                                </div>
                                <div className="flex flex-row flex-wrap justify-between gap-x-4">
                                    <span className="text-xl">Platform: </span>
                                    <span className="text-xl">{platformIcon}</span>
                                </div>
                                <div className="flex flex-row flex-wrap justify-between gap-x-4">
                                    <span className="text-xl">Locale Updated: </span>
                                    <span className="text-xl">
                                        {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : ""}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl">UID {data?.player.uid}</span>
                                <div className="flex flex-row flex-wrap justify-center gap-2">
                                    <button className="btn" onClick={() => router.push("/")}>
                                        <Image
                                            src={ASSET_URL + "icon/sign/ReplacementIcon.png"}
                                            alt="Change UID"
                                            width={24}
                                            height={24}
                                        />
                                        <span>Change UID</span>
                                    </button>
                                    {settings.savedUID !== uid ? (
                                        <button className="btn" onClick={linkUID}>
                                            <Image
                                                src={ASSET_URL + "icon/sign/FriendAddIcon.png"}
                                                alt="Link UID"
                                                width={24}
                                                height={24}
                                            />
                                            <span>Link UID</span>
                                        </button>
                                    ) : null}
                                    <button
                                        className="btn"
                                        onClick={() => router.push(`/api/u/${uid}?lang=${settings.lang}`)}
                                    >
                                        <Image
                                            src={ASSET_URL + "icon/sign/Detail.png"}
                                            alt="API Information"
                                            width={24}
                                            height={24}
                                        />
                                        <span>API Information</span>
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            setShowSavedBuilds(!showSavedBuilds);
                                            setSelected(null);
                                        }}
                                    >
                                        <Image
                                            src={ASSET_URL + "icon/sign/TeamIcon.png"}
                                            alt="Saved Builds"
                                            width={24}
                                            height={24}
                                        />
                                        <span>{showSavedBuilds ? "Profile" : "Saved Builds"}</span>
                                    </button>
                                </div>
                            </div>
                            {showSavedBuilds ? (
                                <div className="mb-1 flex w-full max-w-lg gap-4 overflow-x-auto p-4 md:gap-6 md:p-6">
                                    {savedBuilds.map((build, index) => (
                                        <button
                                            className={`flex w-[100px] cursor-pointer rounded-tr-2xl shadow-md hover:brightness-110 ${
                                                selected === index ? "ring-2 ring-neutral-300" : ""
                                            }`}
                                            onClick={() => handleCharacterSelect(index, build.character)}
                                            key={build.buildName}
                                            aria-label={`Select build: ${build.buildName}`}
                                        >
                                            <div className="relative flex w-[100px] flex-col">
                                                <div className="relative">
                                                    <Image
                                                        src={ASSET_URL + build.character.preview}
                                                        alt={`${build.character.name} preview`}
                                                        width={96}
                                                        height={96}
                                                    />
                                                    <span className="absolute bottom-0 left-0 w-full bg-black/50 p-1 text-xs">
                                                        {build.buildName}
                                                    </span>
                                                </div>
                                                {selected === index ? (
                                                    <button
                                                        className="absolute left-0 top-0 p-1 text-gray-400 hover:text-red-400"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            deleteBuild(index);
                                                            toast.success("Build deleted!", {
                                                                toastId: `success-build-deleted-${index}`
                                                            });
                                                        }}
                                                        aria-label={`Delete build: ${build.buildName}`}
                                                    >
                                                        <svg
                                                            className="h-6 w-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                ) : null}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-row flex-wrap justify-center gap-6 p-6 md:flex-nowrap">
                                    {data?.characters.map((char, index) => (
                                        <button
                                            key={char.id}
                                            onClick={() => handleCharacterSelect(index, char)}
                                            className={`cursor-pointer rounded-full hover:brightness-110 ${
                                                selected === index ? "bg-white ring-2 ring-neutral-300" : ""
                                            }`}
                                            aria-label={`Select ${char.name}`}
                                        >
                                            <Image
                                                src={ASSET_URL + char.icon}
                                                alt={`${char.name} icon`}
                                                width={96}
                                                height={96}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {character ? (
                            <>
                                <div className="flex w-screen overflow-x-auto 2xl:justify-center">
                                    <div
                                        className="showcase mx-3"
                                        ref={ref}
                                        style={{ fontFamily: "var(--font-outfit)" }}
                                    >
                                        <CharacterCard
                                            character={character}
                                            uid={uid}
                                            nickname={nickname}
                                            hideUID={settings.hideUID}
                                            blur={settings.blur}
                                            customImage={customImage}
                                            substatDistribution={settings.substatDistribution}
                                            allTraces={settings.allTraces}
                                            lang={settings.lang}
                                            dpsScore={settings.dpsScore}
                                        />
                                    </div>
                                </div>

                                <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4">
                                    <button
                                        className="btn my-2 gap-3 bg-purple-600 px-4 py-2 text-2xl hover:bg-purple-500"
                                        onClick={handleDownloadImage}
                                    >
                                        <Image
                                            src={ASSET_URL + "icon/sign/SettingsImageIcon.png"}
                                            alt="Download"
                                            width={28}
                                            height={28}
                                        />
                                        Download
                                    </button>
                                    <div className="my-2 flex flex-row flex-wrap items-center justify-center gap-2">
                                        <label
                                            className={`btn text-sm ${
                                                customImage ? "border border-purple-500 bg-purple-600/30" : ""
                                            }`}
                                        >
                                            Custom Image
                                            <input
                                                type="file"
                                                onChange={e => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setCustomImage(URL.createObjectURL(e.target.files[0]));
                                                    }
                                                }}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        <button
                                            className={`btn text-sm ${
                                                settings.hideUID ? "border border-purple-500 bg-purple-600/30" : ""
                                            }`}
                                            onClick={() => toggleSetting("hideUID")}
                                        >
                                            Hide UID / Name
                                        </button>
                                        <button
                                            className={`btn text-sm ${
                                                settings.blur ? "border border-purple-500 bg-purple-600/30" : ""
                                            }`}
                                            onClick={() => toggleSetting("blur")}
                                        >
                                            Unblur Background
                                        </button>
                                        <button
                                            className={`btn text-sm ${
                                                settings.substatDistribution
                                                    ? "border border-purple-500 bg-purple-600/30"
                                                    : ""
                                            }`}
                                            onClick={() => toggleSetting("substatDistribution")}
                                        >
                                            Substat Distribution
                                        </button>
                                        <button
                                            className={`btn text-sm ${
                                                settings.allTraces ? "border border-purple-500 bg-purple-600/30" : ""
                                            }`}
                                            onClick={() => toggleSetting("allTraces")}
                                        >
                                            Hide Minor Traces
                                        </button>
                                        <button
                                            className={`btn text-sm ${
                                                settings.dpsScore ? "border border-purple-500 bg-purple-600/30" : ""
                                            }`}
                                            onClick={() => toggleSetting("dpsScore")}
                                        >
                                            DPS Score
                                        </button>
                                    </div>
                                    <div className="my-2 flex">
                                        <input
                                            type="text"
                                            name="buildName"
                                            onChange={e => setBuildName(e.target.value)}
                                            className="focus-ring rounded-l-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-base text-white outline-hidden placeholder:text-gray-400 focus:border-purple-500"
                                            value={buildName}
                                            placeholder="Build Name"
                                            aria-label="Build Name"
                                            maxLength={30}
                                        />
                                        <button className="btn rounded-l-none rounded-r-lg" onClick={handleSaveBuild}>
                                            Save Build
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
