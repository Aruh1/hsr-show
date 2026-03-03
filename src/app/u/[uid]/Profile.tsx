"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useRef, useMemo } from "react";
import { BsPcDisplay, BsAndroid2, BsApple, BsPlaystation } from "react-icons/bs";
import Image from "next/image";
import CharacterCard from "./CharacterCard";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Loading from "./loading";
import useSWR from "swr";
import type { ProfileData, Character, SavedBuild } from "@/types";
import { ASSET_URL, RETRY_CONFIG } from "@/lib/constants";

// SWR fetcher with error handling
const fetcher = (url: string) =>
    fetch(url).then(res => {
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
        return res.json();
    });

// Helper to read localStorage safely during SSR
const getLocalStorageValue = (key: string, fallback: string): string => {
    if (typeof window === "undefined") return fallback;
    return localStorage.getItem(key) ?? fallback;
};

const getLocalStorageBool = (key: string, fallback: boolean): boolean => {
    if (typeof window === "undefined") return fallback;
    const val = localStorage.getItem(key);
    if (val === null) return fallback;
    return val === "true";
};

interface ProfileSettings {
    hideUID: boolean;
    blur: boolean;
    substatDistribution: boolean;
    allTraces: boolean;
    lang: string;
    savedUID: string;
}

const Profile = () => {
    const router = useRouter();
    const params = useParams();
    const uid = params.uid as string;

    // Batch all localStorage reads into a single lazy init — avoids 6 separate re-renders
    const [settings, setSettings] = useState<ProfileSettings>(() => ({
        hideUID: getLocalStorageBool("hideUID", false),
        blur: getLocalStorageBool("backgroundBlur", false),
        substatDistribution: getLocalStorageBool("substatDistribution", false),
        allTraces: getLocalStorageBool("allTraces", false),
        lang: getLocalStorageValue("lang", "en"),
        savedUID: getLocalStorageValue("uid", "")
    }));

    const [character, setCharacter] = useState<Character | null>(null);
    const [selected, setSelected] = useState<number | null>(0);
    const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            return JSON.parse(localStorage.getItem("savedBuilds") || "[]");
        } catch {
            return [];
        }
    });
    const [buildName, setBuildName] = useState("");
    const [showSavedBuilds, setShowSavedBuilds] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);

    // SWR for data fetching — replaces manual fetch + retry loop
    const { data } = useSWR<ProfileData>(`/api/u/${uid}?lang=${settings.lang}`, fetcher, {
        errorRetryCount: RETRY_CONFIG.maxRetries,
        errorRetryInterval: RETRY_CONFIG.baseDelay,
        revalidateOnFocus: false,
        onSuccess: responseData => {
            // Set first character on initial load
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

    // Memoize platform icon to avoid recreation on every render
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

    // Setting toggle helper — updates state + localStorage in one call
    const toggleSetting = useCallback(
        (key: "hideUID" | "blur" | "substatDistribution" | "allTraces", storageKey: string) => {
            setSettings(prev => {
                const newValue = !prev[key];
                localStorage.setItem(storageKey, String(newValue));
                return { ...prev, [key]: newValue };
            });
        },
        []
    );

    const linkUID = useCallback(() => {
        localStorage.setItem("uid", uid);
        setSettings(prev => ({ ...prev, savedUID: uid }));
        toast.success("UID linked!", { toastId: "success-uid-linked" });
    }, [uid]);

    // Fix stale closure: use functional update for savedBuilds
    const saveBuild = useCallback(() => {
        if (!buildName) {
            toast.error("Enter a build name!", { toastId: "error-build-name-empty" });
            return;
        }
        const newBuild = {
            uid: data?.player.uid,
            nickname: data?.player.nickname,
            buildName: buildName,
            character: character
        };

        setSavedBuilds(prev => {
            const newBuilds = [...prev, newBuild];
            localStorage.setItem("savedBuilds", JSON.stringify(newBuilds));
            return newBuilds;
        });
        toast.success(`${buildName} saved!`, { toastId: `success-build-saved-${buildName}` });
        setBuildName("");
    }, [character, buildName, data?.player.nickname, data?.player.uid]);

    const deleteBuild = useCallback((index: number) => {
        setSavedBuilds(prev => {
            const newBuilds = prev.filter((_, i) => i !== index);
            localStorage.setItem("savedBuilds", JSON.stringify(newBuilds));
            return newBuilds;
        });
        toast.success("Build deleted!", { toastId: `success-build-deleted-${index}` });
    }, []);

    const ref = useRef<HTMLDivElement>(null);
    const saveImage = useCallback(
        (name: string, scale: number) => {
            if (ref.current === null) {
                return;
            }

            html2canvas(ref.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: scale
            }).then(canvas => {
                canvas.toBlob(function (blob) {
                    if (blob) {
                        saveAs(blob, `${name}_Card_${uid}.png`);
                    }
                });
            });
        },
        [uid]
    );

    if (!data) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen">
            <div className="flex h-auto min-h-screen items-center justify-center">
                <div className="flex overflow-auto">
                    <div className="my-5 flex flex-col lg:items-center">
                        <div className="mx-auto flex h-auto w-full max-w-lg flex-col items-center justify-center gap-4 px-4">
                            <Image
                                src={ASSET_URL + data?.player.avatar.icon}
                                alt="Avatar Icon"
                                width={128}
                                height={128}
                                className="rounded-full border-2 border-stone-300 bg-stone-500"
                            />
                            <span className="text-3xl">{nickname}</span>
                            <span className="text-2xl text-gray-300">{signature}</span>
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
                                <div className="flex flex-row flex-wrap justify-between gap-x-4 ">
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
                                            alt="Change UID Icon"
                                            width={24}
                                            height={24}
                                        />
                                        <span>Change UID</span>
                                    </button>
                                    {settings.savedUID !== uid && (
                                        <button className="btn" onClick={linkUID}>
                                            <Image
                                                src={ASSET_URL + "icon/sign/FriendAddIcon.png"}
                                                alt="UID Linked"
                                                width={24}
                                                height={24}
                                            />
                                            <span>Link UID</span>
                                        </button>
                                    )}
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
                                            alt="Change UID Icon"
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
                                        <div
                                            className={`
                          
                          flex
                          w-[100px]
                          cursor-pointer 
                          rounded-tr-2xl
                          shadow-md 
                          hover:brightness-110
                          ${selected === index && "ring-2 ring-neutral-300 "}
                        `}
                                            onClick={() => {
                                                setCharacter(savedBuilds[index].character);
                                                setSelected(index);
                                                setCustomImage(null);
                                            }}
                                            key={index}
                                        >
                                            <div className="relative flex w-[100px] flex-col">
                                                <div className="relative">
                                                    <Image
                                                        src={ASSET_URL + build.character.preview}
                                                        alt="Character Preview"
                                                        width={96}
                                                        height={96}
                                                    />
                                                    <span className="absolute bottom-0 left-0 w-full p-1">
                                                        {build.buildName}
                                                    </span>
                                                </div>
                                                {selected === index && (
                                                    <div
                                                        className={
                                                            "absolute left-0 top-0 text-gray-400 hover:text-gray-500"
                                                        }
                                                        onClick={() => deleteBuild(index)}
                                                    >
                                                        <span className="sr-only">Delete</span>
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
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-row flex-wrap justify-center gap-6 p-6 md:flex-nowrap">
                                    {data?.characters.map((character, index) => (
                                        <Image
                                            src={ASSET_URL + character.icon}
                                            alt="Character Preview"
                                            width={96}
                                            height={96}
                                            className={`
                            cursor-pointer 
                            rounded-full 
                            hover:brightness-110 
                            ${selected === index && "bg-white ring-2 ring-neutral-300"}
                          `}
                                            onClick={() => {
                                                setCharacter(data?.characters[index]);
                                                setSelected(index);
                                                setCustomImage(null);
                                            }}
                                            key={index}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {character && (
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
                                        />
                                    </div>
                                </div>

                                <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4">
                                    <button
                                        className="btn my-2 gap-3 bg-purple-600 px-4 py-2 text-2xl hover:bg-purple-500"
                                        onClick={() => saveImage(character.name, customImage ? 1 : 1.5)}
                                    >
                                        <Image
                                            src={ASSET_URL + "icon/sign/SettingsImageIcon.png"}
                                            alt="Save Image Icon"
                                            width={28}
                                            height={28}
                                        />
                                        Download
                                    </button>
                                    <div className="my-2 flex flex-row flex-wrap items-center justify-center gap-2">
                                        <label
                                            className={`btn text-sm ${customImage ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                        >
                                            Custom Image
                                            <input
                                                type="file"
                                                onChange={e => setCustomImage(URL.createObjectURL(e.target.files[0]))}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        <button
                                            className={`btn text-sm ${settings.hideUID ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => toggleSetting("hideUID", "hideUID")}
                                        >
                                            Hide UID / Name
                                        </button>
                                        <button
                                            className={`btn text-sm ${settings.blur ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => toggleSetting("blur", "backgroundBlur")}
                                        >
                                            Unblur Background
                                        </button>
                                        <button
                                            className={`btn text-sm ${settings.substatDistribution ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => toggleSetting("substatDistribution", "substatDistribution")}
                                        >
                                            Substat Distribution
                                        </button>
                                        <button
                                            className={`btn text-sm ${settings.allTraces ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => toggleSetting("allTraces", "allTraces")}
                                        >
                                            Hide Minor Traces
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
                                        <button className="btn rounded-l-none rounded-r-lg" onClick={saveBuild}>
                                            Save Build
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
