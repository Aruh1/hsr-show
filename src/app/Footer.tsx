"use client";

import { useState, useEffect } from "react";
import { AiOutlineGithub } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { SiKofi } from "react-icons/si";
import Link from "next/link";

const Footer = () => {
    const [currentYear, setCurrentYear] = useState(2025);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="mx-auto max-w-3xl px-4 py-4 sm:px-6 md:max-w-5xl">
            <hr className="mb-4 h-px w-full border-0 bg-white/30" />
            <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between">
                <span className="text-sm text-gray-300">© {currentYear} pololer</span>
                <span className="max-w-md text-xs text-gray-400">
                    This site is not affiliated with miHoYo &amp; All game content and assets are trademarks and
                    copyrights of miHoYo.
                </span>
                <div className="flex flex-row items-center gap-4">
                    <Link
                        href="https://github.com/Aruh1/hsr-show"
                        target="_blank"
                        className="text-gray-300 transition-colors hover:text-white"
                        aria-label="GitHub Repository"
                    >
                        <AiOutlineGithub className="h-6 w-6" />
                    </Link>
                    <Link
                        href="https://discord.gg/your-invite"
                        target="_blank"
                        className="text-gray-300 transition-colors hover:text-white"
                        aria-label="Discord Server"
                    >
                        <BsDiscord className="h-6 w-6" />
                    </Link>
                    <Link
                        href="https://ko-fi.com/pololer"
                        target="_blank"
                        className="text-gray-300 transition-colors hover:text-white"
                        aria-label="Support me on Ko-fi"
                    >
                        <SiKofi className="h-6 w-6" />
                    </Link>
                    <Link
                        href="https://api.mihomo.me/"
                        target="_blank"
                        className="text-gray-300 transition-colors hover:text-white"
                        aria-label="Mihomo API"
                    >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
