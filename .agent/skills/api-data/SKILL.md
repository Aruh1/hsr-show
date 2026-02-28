---
name: api-data
description: How the app fetches and processes Honkai Star Rail profile data from the Mihomo API
---

# API Data Skill

## Data Flow

```
User enters UID → Search component → /api/u/[uid] (Next.js API route)
→ Mihomo API (external) → ProfileData response → SWR cache
→ Profile.tsx → CharacterCard.tsx (render)
```

## API Route

The proxy route lives at `src/app/api/u/[uid]/` and forwards requests to the **Mihomo API** to fetch player profile data.

## Response Types

All API response types are defined in `src/types/index.ts`:

- `ProfileData` — top-level response containing `player`, `characters[]`, `detailInfo`, etc.
- `Player` — UID, nickname, level, avatar, signature, space info.
- `Character` — full build data: stats, skills, relics, light cone, traces.
- `Relic` — relic piece with main_affix and sub_affix[].
- `LightCone` — light cone with rank, level, attributes, properties.

## Asset URLs

All game assets (icons, portraits, previews) are loaded from the StarRailRes CDN:

```
https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/
```

Use the `ASSET_URL` constant from `src/lib/constants.ts`.

## Client-Side Fetching

- Uses **SWR** for caching and revalidation.
- Retry behavior configured via `RETRY_CONFIG` constants.
- API status monitoring uses `SERVER_ENDPOINTS` to check connectivity to each game server.

## Adding New Data Fields

1. Check the [Mihomo API docs](https://api.mihomo.me/) for available fields.
2. Add the corresponding TypeScript interface in `src/types/index.ts`.
3. Update the component that needs to consume the new data.
4. If the data needs processing, add helper functions in a new file under `src/lib/`.
