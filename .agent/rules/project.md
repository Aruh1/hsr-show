---
description: Core project reference for hsr-show
activation: always_on
---

# HSR Show — Project Overview

**HSR Show** is a web app that fetches Honkai: Star Rail player profiles via UID and renders beautiful character build showcase cards with stats, relics, light cones, and skill traces.

**Live URL:** https://hsr.pololer.my.id

## Tech Stack

| Layer       | Technology                                                                |
| ----------- | ------------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router)                                                   |
| Language    | TypeScript (strict: false)                                                |
| UI          | React 19, TailwindCSS 4                                                   |
| Data        | SWR for client-side fetching                                              |
| Package Mgr | Bun (`bun.lock`)                                                          |
| Analytics   | Vercel Analytics                                                          |
| Images      | CDN via `cdn.jsdelivr.net` (StarRailRes), Next.js `<Image>` (unoptimized) |
| Font        | Outfit (Google Fonts)                                                     |
| Deployment  | Vercel                                                                    |

## Directory Structure

```
src/
├── app/                     # Next.js App Router pages & API
│   ├── layout.tsx           # Root layout (font, global styles, footer, analytics)
│   ├── page.tsx             # Home page (search + API status)
│   ├── globals.css          # Global CSS + TailwindCSS 4 theme
│   ├── Search.tsx           # UID search component
│   ├── ApiStatus.tsx        # Server endpoint status widget
│   ├── Footer.tsx           # Footer component
│   ├── not-found.tsx        # 404 page
│   ├── robots.ts / sitemap.ts
│   ├── api/u/               # API proxy route
│   └── u/[uid]/             # Dynamic user profile route
│       ├── page.tsx         # Profile page entry
│       ├── loading.tsx      # Loading state
│       ├── Profile.tsx      # Profile layout & character selection
│       └── CharacterCard.tsx # Main character build card renderer
├── components/              # Shared UI components
│   ├── RelicCard.tsx        # Relic display
│   ├── SkillIcon.tsx        # Skill icon display
│   ├── StatRow.tsx          # Stat row display
│   └── TraceComponents.tsx  # Trace tree and minor traces
├── hooks/
│   └── useLocalStorage.ts   # Typed localStorage hook
├── lib/
│   └── constants.ts         # Shared constants (CDN URL, languages, retry config, etc.)
└── types/
    └── index.ts             # All TypeScript interfaces (Player, Character, Relic, etc.)
```

## Conventions

- **Imports:** Use `@/*` path alias (maps to `./src/*`).
- **Formatting:** Prettier with `tabWidth: 4`, `printWidth: 120`, no trailing commas, no parens for single-arg arrows.
- **Linting:** ESLint with `eslint-config-next`.
- **Scripts:**
    - `bun run dev` — start dev server (with `--inspect`)
    - `bun run build` — lint + build for production
    - `bun run lint` — lint `src/`
    - `bun run format` — auto-format with Prettier
- **i18n:** 13 languages supported (see `SUPPORTED_LANGUAGES` in `constants.ts`). Language labels live in `MEMOSPRITE_LABELS` and `STAT_LABELS`.
- **API data:** Fetched from Mihomo API, types defined in `src/types/index.ts`. Assets from StarRailRes CDN.
- **State:** Client-side settings persisted via `useLocalStorage` hook with keys from `STORAGE_KEYS`.
