/**
 * Script to update game data from HSR Optimizer upstream
 * Run with: bun run scripts/update-game-data.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const HSR_OPTIMIZER_RAW_URL = "https://raw.githubusercontent.com/fribbels/hsr-optimizer/main/src/data";

const FILES_TO_DOWNLOAD = [
    { name: "game_data.json", description: "Character data (97 characters)" },
    { name: "relic_main_affixes.json", description: "Relic main affix data" },
    { name: "relic_sub_affixes.json", description: "Relic sub affix data" }
];

// Use relative path from current working directory
const DATA_DIR = "./src/data";

async function fetchFile(filename: string): Promise<string> {
    const url = `${HSR_OPTIMIZER_RAW_URL}/${filename}`;
    console.log(`Fetching ${filename}...`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
}

function writeFile(filename: string, content: string): void {
    const path = join(DATA_DIR, filename);
    writeFileSync(path, content, "utf-8");
    console.log(`✓ Written ${filename}`);
}

async function main(): Promise<void> {
    console.log("=".repeat(50));
    console.log("HSR Optimizer Game Data Updater");
    console.log("=".repeat(50));
    console.log();

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }

    let successCount = 0;
    let failCount = 0;

    for (const file of FILES_TO_DOWNLOAD) {
        try {
            const content = await fetchFile(file.name);

            // Validate JSON
            JSON.parse(content);

            writeFile(file.name, content);
            console.log(`  ${file.description}`);
            successCount++;
        } catch (error) {
            console.error(`✗ Failed to update ${file.name}:`, error);
            failCount++;
        }
    }

    console.log();
    console.log("=".repeat(50));
    console.log(`Summary: ${successCount} succeeded, ${failCount} failed`);
    console.log("=".repeat(50));

    if (failCount > 0) {
        process.exit(1);
    }
}

main();
