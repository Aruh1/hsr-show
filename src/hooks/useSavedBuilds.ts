"use client";

import { useState, useCallback } from "react";
import type { SavedBuild, Character } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * Hook for managing saved character builds with localStorage persistence
 */
export function useSavedBuilds() {
    const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SAVED_BUILDS);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    /**
     * Save a new build
     */
    const saveBuild = useCallback(
        (uid: string | undefined, nickname: string | undefined, buildName: string, character: Character | null) => {
            if (!buildName.trim()) {
                return { success: false, error: "Build name is required" };
            }

            if (!character) {
                return { success: false, error: "No character selected" };
            }

            if (!uid || !nickname) {
                return { success: false, error: "Player data not available" };
            }

            const newBuild: SavedBuild = {
                uid,
                nickname,
                buildName: buildName.trim(),
                character
            };

            setSavedBuilds(prev => {
                const newBuilds = [...prev, newBuild];
                try {
                    localStorage.setItem(STORAGE_KEYS.SAVED_BUILDS, JSON.stringify(newBuilds));
                } catch (error) {
                    console.error("Failed to save build to localStorage:", error);
                }
                return newBuilds;
            });

            return { success: true, buildName: buildName.trim() };
        },
        []
    );

    /**
     * Delete a build by index
     */
    const deleteBuild = useCallback(
        (index: number) => {
            if (index < 0 || index >= savedBuilds.length) {
                return { success: false, error: "Invalid build index" };
            }

            setSavedBuilds(prev => {
                const newBuilds = prev.filter((_, i) => i !== index);
                try {
                    localStorage.setItem(STORAGE_KEYS.SAVED_BUILDS, JSON.stringify(newBuilds));
                } catch (error) {
                    console.error("Failed to update localStorage:", error);
                }
                return newBuilds;
            });

            return { success: true };
        },
        [savedBuilds.length]
    );

    /**
     * Clear all saved builds
     */
    const clearAllBuilds = useCallback(() => {
        setSavedBuilds([]);
        localStorage.removeItem(STORAGE_KEYS.SAVED_BUILDS);
    }, []);

    /**
     * Get build count
     */
    const buildCount = savedBuilds.length;

    /**
     * Check if a build name already exists
     */
    const buildNameExists = useCallback(
        (name: string) => {
            return savedBuilds.some(build => build.buildName.toLowerCase() === name.toLowerCase());
        },
        [savedBuilds]
    );

    return {
        savedBuilds,
        buildCount,
        saveBuild,
        deleteBuild,
        clearAllBuilds,
        buildNameExists
    };
}
