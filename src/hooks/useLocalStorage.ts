import { useState, useCallback } from "react";

type StorageValue = string | number | boolean | object | null;

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T extends StorageValue>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    // Get stored value or use initial
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return initialValue;
            }
            // Handle boolean strings
            if (item === "true") return true as T;
            if (item === "false") return false as T;
            // Try parsing as JSON, fallback to string
            try {
                return JSON.parse(item) as T;
            } catch {
                return item as T;
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    // Use lazy initial state to read from localStorage during initialization
    const [storedValue, setStoredValue] = useState<T>(() => readValue());

    // Setter function that updates both state and localStorage
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);

                if (typeof window !== "undefined") {
                    if (typeof valueToStore === "object") {
                        localStorage.setItem(key, JSON.stringify(valueToStore));
                    } else {
                        localStorage.setItem(key, String(valueToStore));
                    }
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}

/**
 * Hook to load multiple localStorage values at once
 */
export function useMultipleLocalStorage<T extends Record<string, StorageValue>>(
    keys: { key: string; defaultValue: StorageValue }[]
): T {
    // Load from localStorage during initial state creation to avoid effect-based setState
    const [values] = useState<T>(() => {
        if (typeof window === "undefined") {
            const initial: Record<string, StorageValue> = {};
            keys.forEach(({ key, defaultValue }) => {
                initial[key] = defaultValue;
            });
            return initial as T;
        }

        const loaded: Record<string, StorageValue> = {};
        keys.forEach(({ key, defaultValue }) => {
            try {
                const item = localStorage.getItem(key);
                if (item === null) {
                    loaded[key] = defaultValue;
                } else if (item === "true") {
                    loaded[key] = true;
                } else if (item === "false") {
                    loaded[key] = false;
                } else {
                    try {
                        loaded[key] = JSON.parse(item);
                    } catch {
                        loaded[key] = item;
                    }
                }
            } catch {
                loaded[key] = defaultValue;
            }
        });
        return loaded as T;
    });

    return values;
}
