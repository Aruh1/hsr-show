"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Search() {
    const [UID, setUID] = useState("");
    const [savedUID, setSavedUID] = useState("");
    const [lang, setLang] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("lang")) {
            localStorage.setItem("lang", "en");
        }
        setSavedUID(localStorage.getItem("uid"));
        setLang(localStorage.getItem("lang"));
    }, []);

    const handleKeyDown = e => {
        if (e.key === "Enter" && UID) {
            router.push(`/u/${UID}`);
        }
    };

    const handleUIDChange = e => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setUID(value);
        }
    };

    return (
        <div className="text-centers flex flex-col items-center gap-3">
            <label htmlFor="uid" className="sr-only">
                Enter UID
            </label>
            <div className="flex flex-row flex-wrap justify-center gap-3">
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
                    className="w-28 rounded border-2 border-gray-200 text-center text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                    value={lang || "en"}
                >
                    <option value="cn">简体中文</option>
                    <option value="cht">繁體中文</option>
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="jp">日本語</option>
                    <option value="kr">한국어</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                    <option value="th">ภาษาไทย</option>
                    <option value="vi">Tiếng Việt</option>
                </select>
                <div className="flex gap-3">
                    <input
                        type="text"
                        name="uid"
                        onChange={handleUIDChange}
                        value={UID}
                        placeholder="Enter UID"
                        onKeyDown={handleKeyDown}
                        className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 text-center leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                    />
                    <div
                        onClick={() => UID && router.push(`/u/${UID}`)}
                        className="focus:shadow-outline flex cursor-pointer items-center rounded bg-purple-600 px-4 py-2 font-bold text-white shadow hover:bg-purple-500 focus:outline-none"
                    >
                        <span>Search</span>
                    </div>
                </div>
            </div>
            {savedUID && (
                <div className="flex cursor-pointer flex-row items-center space-x-1 rounded bg-stone-800 px-3 py-1 shadow-md shadow-stone-900 hover:brightness-110 active:shadow-none">
                    <Link href={`/u/${savedUID}`} className="flex gap-2">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/icon/sign/SettingsAccount.png"
                            alt="Icon Linked Profile"
                            width={24}
                            height={24}
                        />
                        <span>Linked Profile: {savedUID}</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
