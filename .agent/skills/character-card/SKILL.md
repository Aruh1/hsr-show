---
name: character-card
description: How to modify or extend the CharacterCard component for new display features or layout changes
---

# Character Card Skill

The `CharacterCard` component (`src/app/u/[uid]/CharacterCard.tsx`) is the main visual output of the app — a ~540-line component that renders a full character showcase card including:

- Character portrait & metadata (name, level, eidolons)
- UID & nickname
- Light cone details
- Skill levels (with icon map)
- Stats (attributes + additions)
- Relic cards with main/sub affixes
- Relic set bonuses
- Skill traces (major + minor via `TraceTree` and `MinorTraces`)

## Key Props

```tsx
interface CharacterCardProps {
    character: Character; // Full character data from API
    uid: string;
    nickname: string | undefined;
    hideUID: boolean; // Toggle UID visibility
    blur: boolean; // Background blur toggle
    customImage: string | null; // Custom background image
    substatDistribution: boolean; // Show substat roll distribution
    allTraces: boolean; // Show all traces vs. unlocked only
    lang: string; // Language code (e.g., "en", "jp")
}
```

## Common Modifications

### Adding a new stat or display section

1. Check the `Character` interface in `src/types/index.ts` for available data fields.
2. Add the new section within the card's JSX layout in `CharacterCard.tsx`.
3. Use TailwindCSS classes consistent with the existing card design.
4. If the section needs localization, add labels to the appropriate map in `src/lib/constants.ts`.

### Changing skill layout/ordering

Skills are rendered from `character.skills` array. The order depends on the `type` field of each skill (e.g., `"Normal"`, `"BPSkill"`, `"Ultra"`, `"Talent"`, `"Maze"`). Modify the filtering/sorting logic inside `CharacterCard`.

### Adding new toggle settings

1. Add the setting key to `STORAGE_KEYS` in `src/lib/constants.ts`.
2. Add default value to `DEFAULT_SETTINGS`.
3. Use `useLocalStorage` hook in `Profile.tsx` for state management.
4. Pass the setting as a prop down to `CharacterCard`.

## Sub-components Used

| Component     | File                                 | Purpose                  |
| ------------- | ------------------------------------ | ------------------------ |
| `RelicCard`   | `src/components/RelicCard.tsx`       | Individual relic display |
| `SkillIcon`   | `src/components/SkillIcon.tsx`       | Skill icon with level    |
| `StatRow`     | `src/components/StatRow.tsx`         | Single stat row          |
| `TraceTree`   | `src/components/TraceComponents.tsx` | Major trace tree         |
| `MinorTraces` | `src/components/TraceComponents.tsx` | Minor trace nodes        |
