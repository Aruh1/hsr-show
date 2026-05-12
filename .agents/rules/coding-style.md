---
description: Coding style and conventions for hsr-show
activation: always_on
---

# Coding Style

## TypeScript / React

- Use **functional components** with explicit prop interfaces.
- Prefer `type` imports: `import type { Character } from "@/types"`.
- Use `useMemo` for derived/computed data to avoid unnecessary recalculations.
- Keep component files self-contained; extract sub-components only into `src/components/` when reused across pages.

## Styling

- Use **TailwindCSS 4** utility classes exclusively. No inline `style` props unless absolutely necessary (e.g., dynamic values from API data like element colors).
- Use the project's custom CSS animations defined in `globals.css` (e.g., `animate-fade-in`, `animate-slide-up`).

## File Organization

- **Pages & route-specific components** go in `src/app/` alongside their route.
- **Shared components** go in `src/components/`.
- **Shared constants** go in `src/lib/constants.ts`.
- **TypeScript interfaces** go in `src/types/index.ts`.
- **Custom hooks** go in `src/hooks/`.

## Naming

- Files: PascalCase for components (`CharacterCard.tsx`), camelCase for hooks (`useLocalStorage.ts`), lowercase for config (`constants.ts`).
- Interfaces: PascalCase, no `I` prefix (e.g., `Character`, not `ICharacter`).
- Constants: UPPER_SNAKE_CASE for config objects (e.g., `STORAGE_KEYS`, `RETRY_CONFIG`).

## Data Fetching

- Use **SWR** for client-side data fetching.
- Proxy external API calls through Next.js API routes in `src/app/api/`.
- Use retry configuration from `constants.ts` (`RETRY_CONFIG`, `API_STATUS_RETRY_CONFIG`).
