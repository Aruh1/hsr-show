---
description: Patterns for creating and modifying React components
activation: glob
glob: "src/**/*.tsx"
---

# Component Patterns

## Props

- Define a dedicated `interface` for props above the component (e.g., `CharacterCardProps`).
- Destructure props in the function signature.

```tsx
interface MyComponentProps {
    character: Character;
    lang: string;
}

export default function MyComponent({ character, lang }: MyComponentProps) {
    // ...
}
```

## Images

- Use Next.js `<Image>` for all images.
- All character/item assets come from the StarRailRes CDN. Build URLs using the `ASSET_URL` constant:

```tsx
import { ASSET_URL } from "@/lib/constants";
// Usage: `${ASSET_URL}icon/character/${character.id}.png`
```

## Localization

- Support all 13 languages listed in `SUPPORTED_LANGUAGES`.
- Use locale-aware label maps (`MEMOSPRITE_LABELS`, `STAT_LABELS`) with the `lang` prop as key, falling back to `"en"`.

## Client Components

- Add `"use client"` directive only when the component uses browser APIs, hooks, or event handlers.
- Server components are the default in Next.js App Router — prefer them when possible.
