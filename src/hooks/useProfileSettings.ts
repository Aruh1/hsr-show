"use client";

import { useState, useCallback } from "react";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "@/lib/constants";

/**
 * Profile settings interface
 */
export interface ProfileSettings {
    hideUID: boolean;
    blur: boolean;
    substatDistribution: boolean;
    allTraces: boolean;
    dpsScore: boolean;
    lang: string;
    savedUID: string;
}

type SettingKey = keyof ProfileSettings;

/**
 * Get boolean value from localStorage (SSR-safe)
 */
function getLocalStorageBool(key: string, fallback: boolean): boolean {
    if (typeof window === "undefined") return fallback;
    const val = localStorage.getItem(key);
    if (val === null) return fallback;
    return val === "true";
}

/**
 * Get string value from localStorage (SSR-safe)
 */
function getLocalStorageString(key: string, fallback: string): string {
    if (typeof window === "undefined") return fallback;
    return localStorage.getItem(key) ?? fallback;
}

/**
 * Hook for managing profile settings with localStorage persistence
 */
export function useProfileSettings() {
    const [settings, setSettings] = useState<ProfileSettings>(() => ({
        hideUID: getLocalStorageBool(STORAGE_KEYS.HIDE_UID, DEFAULT_SETTINGS.hideUID),
        blur: getLocalStorageBool(STORAGE_KEYS.BACKGROUND_BLUR, DEFAULT_SETTINGS.blur),
        substatDistribution: getLocalStorageBool(
            STORAGE_KEYS.SUBSTAT_DISTRIBUTION,
            DEFAULT_SETTINGS.substatDistribution
        ),
        allTraces: getLocalStorageBool(STORAGE_KEYS.ALL_TRACES, DEFAULT_SETTINGS.allTraces),
        dpsScore: getLocalStorageBool(STORAGE_KEYS.DPS_SCORE, DEFAULT_SETTINGS.dpsScore),
        lang: getLocalStorageString(STORAGE_KEYS.LANG, DEFAULT_SETTINGS.lang),
        savedUID: getLocalStorageString(STORAGE_KEYS.UID, "")
    }));

    /**
     * Toggle a boolean setting and persist to localStorage
     */
    const toggleSetting = useCallback((key: "hideUID" | "blur" | "substatDistribution" | "allTraces" | "dpsScore") => {
        const storageKeyMap: Record<string, string> = {
            hideUID: STORAGE_KEYS.HIDE_UID,
            blur: STORAGE_KEYS.BACKGROUND_BLUR,
            substatDistribution: STORAGE_KEYS.SUBSTAT_DISTRIBUTION,
            allTraces: STORAGE_KEYS.ALL_TRACES,
            dpsScore: STORAGE_KEYS.DPS_SCORE
        };

        setSettings(prev => {
            const newValue = !prev[key];
            localStorage.setItem(storageKeyMap[key], String(newValue));
            return { ...prev, [key]: newValue };
        });
    }, []);

    /**
     * Update a specific setting value
     */
    const updateSetting = useCallback(<K extends SettingKey>(key: K, value: ProfileSettings[K]) => {
        setSettings(prev => {
            const storageKeyMap: Partial<Record<SettingKey, string>> = {
                lang: STORAGE_KEYS.LANG,
                savedUID: STORAGE_KEYS.UID
            };

            const storageKey = storageKeyMap[key];
            if (storageKey && typeof value === "string") {
                localStorage.setItem(storageKey, value);
            }

            return { ...prev, [key]: value };
        });
    }, []);

    /**
     * Reset all settings to defaults
     */
    const resetSettings = useCallback(() => {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });

        setSettings({
            hideUID: DEFAULT_SETTINGS.hideUID,
            blur: DEFAULT_SETTINGS.blur,
            substatDistribution: DEFAULT_SETTINGS.substatDistribution,
            allTraces: DEFAULT_SETTINGS.allTraces,
            dpsScore: DEFAULT_SETTINGS.dpsScore,
            lang: DEFAULT_SETTINGS.lang,
            savedUID: ""
        });
    }, []);

    return {
        settings,
        toggleSetting,
        updateSetting,
        resetSettings
    };
}
