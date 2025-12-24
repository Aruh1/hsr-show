"use client";

import { useEffect, useState, useCallback } from "react";
import { SERVER_ENDPOINTS, API_STATUS_RETRY_CONFIG } from "@/lib/constants";
import type { ApiStatuses } from "@/types";

export default function ApiStatus() {
    const [apiStatuses, setApiStatuses] = useState<ApiStatuses>(() =>
        Object.keys(SERVER_ENDPOINTS).reduce(
            (acc, server) => ({
                ...acc,
                [server]: { isLoading: false, isConnected: false, error: null }
            }),
            {} as ApiStatuses
        )
    );

    const fetchWithRetry = useCallback(async (url: string, server: string) => {
        const { maxRetries, baseDelay, backoffFactor, jitter } = API_STATUS_RETRY_CONFIG;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok && data) {
                    setApiStatuses(prev => ({
                        ...prev,
                        [server]: { isLoading: false, isConnected: true, error: null }
                    }));
                    return;
                }

                // If it's not the last attempt, calculate delay and retry
                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(backoffFactor, attempt) * (1 + jitter * (Math.random() * 2 - 1));
                    await new Promise(resolve => setTimeout(resolve, Math.round(delay)));
                    continue;
                }

                throw new Error("API request failed");
            } catch {
                if (attempt === maxRetries) {
                    setApiStatuses(prev => ({
                        ...prev,
                        [server]: {
                            isLoading: false,
                            isConnected: false,
                            error: "Connection failed"
                        }
                    }));
                }
            }
        }
    }, []);

    const checkAllServers = useCallback(() => {
        Object.entries(SERVER_ENDPOINTS).forEach(([server, endpoint]) => {
            setApiStatuses(prev => ({
                ...prev,
                [server]: { ...prev[server], isLoading: true }
            }));
            fetchWithRetry(endpoint.url, server);
        });
    }, [fetchWithRetry]);

    useEffect(() => {
        checkAllServers();
        const intervalId = setInterval(checkAllServers, 30000);
        return () => clearInterval(intervalId);
    }, [checkAllServers]);

    return (
        <div className="mt-6 w-full max-w-3xl px-4">
            <h2 className="mb-4 text-xl font-semibold text-gray-200 md:text-2xl">Server Status</h2>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3">
                {Object.entries(apiStatuses).map(([server, status]) => (
                    <div
                        key={server}
                        className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                    >
                        <div className="text-sm font-medium text-gray-200">{server}</div>
                        <div className="mt-2">
                            {status.isLoading ? (
                                <div className="flex items-center gap-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-300">
                                    <div className="animate-pulse-dot h-2 w-2 rounded-full bg-gray-400"></div>
                                    Checking...
                                </div>
                            ) : status.isConnected ? (
                                <div className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400 transition-all duration-300">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    Connected
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-400 transition-all duration-300">
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    Error
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
