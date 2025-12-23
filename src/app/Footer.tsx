"use client";

import { AiOutlineGithub } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { SiKofi } from "react-icons/si";
import Link from "next/link";

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                        href="https://discord.gg/qefR5pXp8z"
                        aria-label="Discord"
                        rel="noreferrer"
                        target="_blank"
                        className="text-gray-300 transition-all hover:-translate-y-1 hover:text-white"
                    >
                        <BsDiscord size={26} />
                    </Link>
                    <Link
                        href="https://github.com/Aruh1/hsr-show"
                        aria-label="GitHub"
                        rel="noreferrer"
                        target="_blank"
                        className="text-gray-300 transition-all hover:-translate-y-1 hover:text-white"
                    >
                        <AiOutlineGithub size={26} />
                    </Link>
                    <Link
                        href="https://ko-fi.com/pololer"
                        aria-label="Kofi"
                        rel="noreferrer"
                        target="_blank"
                        className="text-gray-300 transition-all hover:-translate-y-1 hover:text-white"
                    >
                        <SiKofi size={26} />
                    </Link>
                    <Link
                        href="https://trakteer.id/luminiatus"
                        aria-label="Trakteer"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-gray-300 transition-all hover:-translate-y-1 hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="02 0 24 24"
                            fill="currentColor"
                            width={26}
                            height={26}
                            aria-label="Trakteer"
                        >
                            <rect x="7" y="8" width="10" height="12" rx="2" ry="2" />
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="15" cy="3" r="1.5" />
                            <path d="M9 13.5c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
