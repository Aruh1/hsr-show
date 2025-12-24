"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { BsPcDisplay, BsAndroid2, BsApple, BsPlaystation } from "react-icons/bs";
import Image from "next/image";
import CharacterCard from "./CharacterCard";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Loading from "./loading";
import type { ProfileData, Character, SavedBuild } from "@/types";
import { ASSET_URL } from "@/lib/constants";

const Profile = () => {
    const router = useRouter();
    const [data, setData] = useState<ProfileData | null>(null);
    const [character, setCharacter] = useState<Character | null>(null);
    const [selected, setSelected] = useState<number | null>(0);
    const [hideUID, setHideUID] = useState(false);
    const [blur, setBlur] = useState(false);
    const [savedUID, setSavedUID] = useState("");
    const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
    const [buildName, setBuildName] = useState("");
    const [showSavedBuilds, setShowSavedBuilds] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [substatDistribution, setSubstatDistribution] = useState(false);
    const [allTraces, setAllTraces] = useState(false);
    const [lang, setLang] = useState("en");
    const params = useParams();
    const uid = params.uid as string;
    const nickname = data?.player.nickname;
    const signature = data?.player.signature;
    const platform = data?.detailInfo?.platform;

    useEffect(() => {
        setHideUID(JSON.parse(localStorage.getItem("hideUID") || "false"));
        setBlur(JSON.parse(localStorage.getItem("backgroundBlur") || "false"));
        setSubstatDistribution(JSON.parse(localStorage.getItem("substatDistribution") || "false"));
        setAllTraces(JSON.parse(localStorage.getItem("allTraces") || "false"));
        setSavedUID(localStorage.getItem("uid") || "");
        setLang(localStorage.getItem("lang") || "en");
    }, []);

    const linkUID = useCallback(() => {
        localStorage.setItem("uid", uid);
        setSavedUID(uid);
        toast.success("UID linked!", {
            toastId: "success-uid-linked"
        });
    }, [uid]);

    useEffect(() => {
        const fetchData = async () => {
            const maxRetries = 3;
            const baseDelay = 1000; // 1 second

            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    const currentLang = localStorage.getItem("lang") || "en";
                    const res = await fetch(`/api/u/${uid}?lang=${currentLang}`, {
                        next: { revalidate: 60 }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setData(data);
                        return; // Successful fetch, exit the function
                    }

                    // If not ok, wait before retrying
                    if (attempt < maxRetries - 1) {
                        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
                    }
                } catch (error) {
                    console.error(`Fetch attempt ${attempt + 1} failed:`, error);

                    // Wait before retrying, with exponential backoff
                    if (attempt < maxRetries - 1) {
                        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
                    }
                }
            }

            // If all retries fail
            toast.error(
                <div>
                    Error fetching data after multiple attempts!
                    <br />
                    Try again later or join our discord server for help.
                </div>,
                {
                    toastId: "error-fetching-data"
                }
            );
            setTimeout(() => {
                router.push("/");
            }, 2000);
        };
        fetchData();
    }, [uid, router]);

    useEffect(() => {
        if (data) {
            setCharacter(data?.characters[0]);
        }
    }, [data]);

    useEffect(() => {
        if (!localStorage.getItem("savedBuilds")) {
            localStorage.setItem("savedBuilds", JSON.stringify([]));
        }
        setSavedBuilds(JSON.parse(localStorage.getItem("savedBuilds")));
    }, []);

    const saveBuild = useCallback(() => {
        if (!buildName) {
            toast.error("Enter a build name!", {
                toastId: "error-build-name-empty"
            });
            return;
        }
        const newBuild = {
            uid: data?.player.uid,
            nickname: data?.player.nickname,
            buildName: buildName,
            character: character
        };

        const newBuilds = [...savedBuilds, newBuild];
        localStorage.setItem("savedBuilds", JSON.stringify(newBuilds));
        setSavedBuilds(newBuilds);
        toast.success(`${buildName} saved!`, {
            toastId: `success-build-saved-${buildName}`
        });
        setBuildName("");
    }, [character, buildName, savedBuilds, data?.player.nickname, data?.player.uid]);

    const deleteBuild = useCallback(
        (index: number) => {
            const newBuilds = savedBuilds.filter((_, i) => i !== index);
            localStorage.setItem("savedBuilds", JSON.stringify(newBuilds));
            setSavedBuilds(newBuilds);
            toast.success("Build deleted!", {
                toastId: `success-build-deleted-${index}`
            });
        },
        [savedBuilds]
    );

    const getPlatformIcon = (platform: string | undefined) => {
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
    };

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
                                width={120}
                                height={120}
                                alt="Avatar Icon"
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
                                    <span className="text-xl">{getPlatformIcon(platform)}</span>
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
                                    {savedUID !== uid && (
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
                                        onClick={() =>
                                            router.push(`/api/u/${uid}?lang=${localStorage.getItem("lang")}`)
                                        }
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
                                            hideUID={hideUID}
                                            blur={blur}
                                            customImage={customImage}
                                            substatDistribution={substatDistribution}
                                            allTraces={allTraces}
                                            lang={lang}
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
                                            className={`btn text-sm ${hideUID ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => {
                                                setHideUID(!hideUID);
                                                localStorage.setItem("hideUID", String(!hideUID));
                                            }}
                                        >
                                            Hide UID / Name
                                        </button>
                                        <button
                                            className={`btn text-sm ${blur ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => {
                                                setBlur(!blur);
                                                localStorage.setItem("backgroundBlur", String(!blur));
                                            }}
                                        >
                                            Unblur Background
                                        </button>
                                        <button
                                            className={`btn text-sm ${substatDistribution ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => {
                                                setSubstatDistribution(!substatDistribution);
                                                localStorage.setItem(
                                                    "substatDistribution",
                                                    String(!substatDistribution)
                                                );
                                            }}
                                        >
                                            Substat Distribution
                                        </button>
                                        <button
                                            className={`btn text-sm ${allTraces ? "border border-purple-500 bg-purple-600/30" : ""}`}
                                            onClick={() => {
                                                setAllTraces(!allTraces);
                                                localStorage.setItem("allTraces", String(!allTraces));
                                            }}
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
