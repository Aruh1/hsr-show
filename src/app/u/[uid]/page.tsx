import Profile from "./Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { getMihomoData } from "@/lib/mihomo";

interface PageProps {
    params: Promise<{ uid: string }>;
    searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { uid } = await params;
    return {
        title: `UID ${uid} - Character Showcase`,
        description: `View character builds and stats for Honkai: Star Rail player UID ${uid}`,
        openGraph: {
            title: `UID ${uid} - HSR Show Character Showcase`,
            description: `View character builds and stats for Honkai: Star Rail player UID ${uid}`
        }
    };
}
export default async function Page({ params, searchParams }: PageProps) {
    const { uid } = await params;
    const { lang } = await searchParams;

    // Prefetch data on server to warm up cache and potentially pass to client
    // We default to "en" for the prefetch if lang is missing
    const initialData = await getMihomoData(uid, lang || "en").catch(() => null);

    return (
        <div>
            <Profile uid={uid} initialData={initialData} />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}
