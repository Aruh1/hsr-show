"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Error boundary for the profile page.
 * Catches rendering errors and provides a way to retry.
 */
export default function ProfileError({ error, reset }: ErrorProps) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to console and potentially to an error reporting service
        logger.error("Profile page error", error, { digest: error.digest });
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="max-w-md">
                <h1 className="mb-4 text-3xl font-bold text-red-400">Something went wrong</h1>
                <p className="mb-6 text-gray-300">
                    Failed to load the profile. This might be due to a network issue or an invalid UID.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button onClick={reset} className="btn bg-purple-600 px-6 py-2 text-lg hover:bg-purple-500">
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="btn border border-gray-500 px-6 py-2 text-lg hover:bg-gray-700"
                    >
                        Go Home
                    </button>
                </div>
                {error.digest && <p className="mt-6 text-xs text-gray-500">Error ID: {error.digest}</p>}
            </div>
        </div>
    );
}
