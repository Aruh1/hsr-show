import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./Footer";
import { Outfit } from "next/font/google";

const outfit = Outfit({
    subsets: ["latin"],
    // src: '../public/zh-cn.ttf',
    variable: "--font-outfit"
});

export const metadata = {
    metadataBase: new URL("https://hsr.pololer.my.id"),
    title: "HSR Show",
    description: "View and create a character showcase card for Honkai: Star Rail",
    icons: {
        icon: "/herta-kurukuru.gif"
    },
    keywords: ["Honkai Star Rail", "HSR", "HSR Showcase", "HSR Build Card"],
    alternates: {
        canonical: "/"
    },
    openGraph: {
        locale: "en_US",
        url: "/",
        title: "HSR Showcase",
        description: "Fetch data from your Trailblazer Profile and display a build card for Honkai: Star Rail",
        images: [
            {
                url: "https://github.com/Mar-7th/StarRailRes/blob/master/icon/logo/bg.png?raw=true",
                width: 1340,
                height: 660,
                alt: "HSR Showcase"
            },
            {
                url: "https://github.com/Mar-7th/StarRailRes/blob/master/icon/sign/ShopTrainIcon.png?raw=true",
                width: 128,
                height: 128,
                alt: "HSR Showcase"
            }
        ],
        site_name: "HSR Showcase"
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={outfit.variable}>
            <body className="no-scrollbar bg-gradient-to-br from-[#0a0c22] via-[#11132a] to-[#2b3057] bg-fixed font-semibold text-white">
                {children}
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
