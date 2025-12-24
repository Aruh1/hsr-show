import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./Footer";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit"
});

export const metadata: Metadata = {
    metadataBase: new URL("https://hsr.pololer.my.id"),
    title: {
        default: "HSR Show - Honkai Star Rail Character Showcase",
        template: "%s | HSR Show"
    },
    description:
        "View and create beautiful character showcase cards for Honkai: Star Rail. Display your Trailblazer's build with detailed stats, relics, and light cones.",
    icons: {
        icon: "/evernight-goyang.gif",
        apple: "/evernight-goyang.gif"
    },
    keywords: [
        "Honkai Star Rail",
        "HSR",
        "HSR Showcase",
        "HSR Build Card",
        "Character Build",
        "Trailblazer",
        "Star Rail Build",
        "HSR Character Card",
        "Relic Stats",
        "Light Cone"
    ],
    authors: [{ name: "HSR Show" }],
    creator: "HSR Show",
    publisher: "HSR Show",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },
    alternates: {
        canonical: "/"
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "HSR Show - Honkai Star Rail Character Showcase",
        description:
            "Fetch data from your Trailblazer Profile and display a beautiful build card for Honkai: Star Rail",
        images: [
            {
                url: "https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/icon/logo/bg.png",
                alt: "HSR Show - Honkai Star Rail Character Showcase"
            }
        ],
        siteName: "HSR Show"
    },
    twitter: {
        card: "summary_large_image",
        title: "HSR Show - Honkai Star Rail Character Showcase",
        description: "View and create beautiful character showcase cards for Honkai: Star Rail",
        images: ["https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/icon/logo/bg.png"]
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION
    },
    manifest: "/manifest.json",
    category: "gaming"
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={outfit.variable}>
            <body className="no-scrollbar bg-linear-to-br from-[#0a0c22] via-[#11132a] to-[#2b3057] bg-fixed font-semibold text-white">
                {children}
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
