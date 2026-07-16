"use client";

import { useRef, useCallback } from "react";

/**
 * Hook for exporting a DOM element as an image using html2canvas
 */
export function useImageExport<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);

    /**
     * Export the referenced element as a PNG image
     */
    const saveImage = useCallback(async (filename: string, scale: number = 1.5): Promise<boolean> => {
        if (!ref.current) {
            console.error("No element reference found");
            return false;
        }

        try {
            // Lazy load html2canvas to reduce initial bundle size
            const html2canvas = (await import("html2canvas")).default;

            const canvas = await html2canvas(ref.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale
            });

            return new Promise(resolve => {
                canvas.toBlob(blob => {
                    if (blob) {
                        // Lazy load file-saver
                        import("file-saver").then(({ saveAs }) => {
                            saveAs(blob, `${filename}.png`);
                            resolve(true);
                        });
                    } else {
                        resolve(false);
                    }
                });
            });
        } catch (error) {
            console.error("Failed to export image:", error);
            return false;
        }
    }, []);

    return { ref, saveImage };
}
