"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ASSET_URL, SUPPORTED_LANGUAGES } from "@/lib/constants";

export default function Search() {
    const [UID, setUID] = useState("");
    // Initialize with default values for SSR, then update after hydration
    const [savedUID, setSavedUID] = useState("");
    const [lang, setLang] = useState("en");
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    // Read from localStorage after hydration to avoid SSR mismatch
    // This is a valid use case for setState in effect - hydration sync
    useEffect(() => {
        if (!localStorage.getItem("lang")) {
            localStorage.setItem("lang", "en");
        }
        setSavedUID(localStorage.getItem("uid") ?? "");
        setLang(localStorage.getItem("lang") ?? "en");
        setIsHydrated(true);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && UID) {
            router.push(`/u/${UID}`);
        }
    };

    const handleUIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setUID(value);
        }
    };

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
            <label htmlFor="uid" className="sr-only">
                Enter UID
            </label>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <label htmlFor="lang" className="sr-only">
                    Select Language
                </label>
                <select
                    name="lang"
                    id="lang"
                    onChange={e => {
                        setLang(e.target.value);
                        localStorage.setItem("lang", e.target.value);
                    }}
                    className="focus-ring w-full rounded-lg border-2 border-gray-600 bg-gray-800 px-3 py-2 text-center text-white transition-colors hover:border-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:outline-hidden sm:w-32"
                    value={lang}
                >
                    {SUPPORTED_LANGUAGES.map(({ code, name }) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>
                <div className="flex w-full gap-2 sm:w-auto">
                    <input
                        type="text"
                        name="uid"
                        onChange={handleUIDChange}
                        value={UID}
                        placeholder="Enter UID"
                        onKeyDown={handleKeyDown}
                        className="focus-ring w-full appearance-none rounded-lg border-2 border-gray-600 bg-gray-800 px-4 py-2 text-center leading-tight text-white transition-colors placeholder:text-gray-400 hover:border-gray-500 focus:border-purple-500 focus:bg-gray-900 focus:outline-hidden sm:w-40"
                    />
                    <button
                        onClick={() => UID && router.push(`/u/${UID}`)}
                        className="btn bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-500"
                    >
                        Search
                    </button>
                </div>
            </div>
            {isHydrated && savedUID && (
                <Link
                    href={`/u/${savedUID}`}
                    className="btn gap-2 border border-stone-600 bg-stone-800 px-4 py-2 transition-all hover:border-stone-500"
                >
                    <Image
                        src={`${ASSET_URL}icon/sign/SettingsAccount.png`}
                        alt="Icon Linked Profile"
                        width={24}
                        height={24}
                    />
                    <span>Linked Profile: {savedUID}</span>
                </Link>
            )}
        </div>
    );
}
