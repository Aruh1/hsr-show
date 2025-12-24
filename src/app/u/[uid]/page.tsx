import Profile from "./Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ uid: string }>;
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
export default function Page() {
    return (
        <div>
            <Profile />
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
