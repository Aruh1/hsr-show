"use client";

import { useEffect, useState, useCallback } from "react";

const SERVER_ENDPOINTS = {
    USA: { url: "/api/u/600000006" },
    "GF-CN": { url: "/api/u/100000009" },
    "Official-CHT": { url: "/api/u/900000001" },
    "QD-CN": { url: "/api/u/500000001" },
    "Official-Asia": { url: "/api/u/800000002" },
    "Official-EUR": { url: "/api/u/700000001" }
};

const RETRY_CONFIG = {
    maxRetries: 0,
    baseDelay: 1000,
    backoffFactor: 1.5,
    jitter: 0.1
};

export default function ApiStatus() {
    const [apiStatuses, setApiStatuses] = useState(() =>
        Object.keys(SERVER_ENDPOINTS).reduce(
            (acc, server) => ({
                ...acc,
                [server]: { isLoading: false, isConnected: false, error: null }
            }),
            {}
        )
    );

    const fetchWithRetry = useCallback(async (url, server) => {
        const { maxRetries, baseDelay, backoffFactor, jitter } = RETRY_CONFIG;

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
            } catch (error) {
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
        <div className="mt-8 w-full max-w-3xl">
            <h2 className="mb-4 text-2xl font-semibold">Server Status</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Object.entries(apiStatuses).map(([server, status]) => (
                    <div
                        key={server}
                        className="flex flex-col items-center rounded-lg border border-gray-200/50 bg-transparent p-3 backdrop-blur-sm hover:border-gray-300/50 transition-colors duration-200"
                    >
                        <div className="text-sm font-medium">{server}</div>
                        <div className="mt-2">
                            {status.isLoading ? (
                                <div className="text-sm text-gray-500">Checking...</div>
                            ) : status.isConnected ? (
                                <div className="flex items-center gap-1 rounded-full bg-green-100/80 px-3 py-1 text-sm text-green-800">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    Connected
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 rounded-full bg-red-100/80 px-3 py-1 text-sm text-red-800">
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
