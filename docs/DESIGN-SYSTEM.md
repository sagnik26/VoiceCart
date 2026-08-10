# VoiceCart Design System

Foundation for UI work. Product scope and screen specs live in [PRD-Voice-Food-Ordering-App.md](./PRD-Voice-Food-Ordering-App.md) (§7–8). High-fidelity interactive reference: `Voice Food Ordering App.dc.html` (Design scope package). Voice motion reference: `Voice Capture Animation Showcase.dc.html`.

## Stack

| Layer | Choice |
| --- | --- |
| App | Expo SDK 57, Expo Router (`src/app`) |
| UI kit | [gluestack-ui](https://gluestack.io/) v5 (copy-paste components under `src/components/ui/`) |
| Styling | NativeWind v4 + Tailwind CSS v3 (`className`) — CLI fell back from NativeWind v5 (not yet supported for this project shape) |
| Tokens | `src/components/ui/gluestack-ui-provider/config.ts` + `src/constants/theme.ts` |

Do not add a second UI kit (Paper, NativeBase, Tamagui, etc.) without explicit approval. Prefer:

```bash
npx gluestack-ui@latest add <component> -y --use-npm --path src/components/ui
```

## Tokens

Source values: PRD §8, mapped onto gluestack CSS variables.

| Role | Hex | Gluestack / Tailwind | Notes |
| --- | --- | --- | --- |
| Brand / primary CTA | `#D85A30` | `primary` | Talk button, primary buttons |
| Success | `#1D9E75` | `success` | Confirmed chips, Have |
| Warning | `#D19A2B` | `warning` | Plan impact advisories |
| Accent | `#7C63C4` | (PRD only; use sparingly) | Preference cards |
| Ink | `#2A2724` | `foreground` | Primary text |
| Muted | `#6B655C` | `muted-foreground` | Labels |
| Surface | `#FAF9F6` | `background` | Page |
| Card | `#FFFFFF` | `card` | Cards |
| Border | `#C9C3B8` | `border` | Dividers |
| Error | `#C44030` | `destructive` | True errors only |

**Brand coral vs destructive:** The design HTML used the “destructive” slot for coral CTAs. In this codebase, coral is `primary`. Keep `destructive` for error states so we do not paint alerts and CTAs the same semantic role.

| Radius | Value |
| --- | --- |
| Cards | 8 px (`rounded-lg` / 8) |
| Buttons / pills | 22 px (`rounded-full` for pills) |
| Touch target | min 44 px |

Typography (PRD baseline): ~14 px body for values, ~12 px labels; weight carries hierarchy. Prefer gluestack `Heading` / `Text` sizes.

Update tokens in both:

1. [`src/components/ui/gluestack-ui-provider/config.ts`](../src/components/ui/gluestack-ui-provider/config.ts) — NativeWind `vars` (RGB channels)
2. [`src/constants/theme.ts`](../src/constants/theme.ts) — JS colors for StatusBar, splash, native tab tint

Then keep this doc in sync.

## Navigation IA

```
Root Stack
├── (tabs)          ← tab bar visible
│   ├── index       Home
│   └── kitchen     Kitchen
├── voice           Talk (center CTA → push; no tab bar)
├── disambiguation
├── cart
├── order-status
├── ingredients
├── history
└── settings
```

- Tab bar: Home · raised Talk · Kitchen (`src/components/app-tab-bar.tsx`).
- Talk calls `router.push('/voice')`; it is not a tab that keeps the bar.
- Stack screens hide the tab bar by default.

## Screen inventory

| Screen | Route | Status |
| --- | --- | --- |
| Home | `/(tabs)` | Implemented (mock data) |
| Kitchen | `/(tabs)/kitchen` | Implemented (mock data) |
| Voice capture | `/voice` | Implemented (mock + orb) |
| Disambiguation | `/disambiguation` | Placeholder |
| Cart review | `/cart` | Implemented (mock data) |
| Order status | `/order-status` | Implemented (mock data) |
| Ingredient selection | `/ingredients` | Implemented (mock data) |
| Order history | `/history` | Implemented (mock data) |
| Settings | `/settings` | Implemented (mock data) |

Plan / Analytics from the PRD are not in the current design HTML shell; add when product asks.

## Component conventions

- Import from `@/components/ui/<name>` (e.g. `Button`, `Box`, `VStack`).
- Style with NativeWind `className` using semantic tokens (`bg-background`, `text-primary`, `border-border`).
- Shared placeholder chrome: `src/components/screen-placeholder.tsx`.
- Feature UI will later move into `features/*` packages per AGENTS.md; keep this foundation as the integration layer for now (flat app at repo root).

## Extending

**New token:** add RGB channels to `config.ts` light/dark, map in `tailwind.config.js` `theme.extend.colors`, mirror hex in `theme.ts`, document here.

**New screen:** add a file under `src/app/`, register in root `Stack` if needed, link from an existing screen. Prefer gluestack primitives over one-off Views.

**New component:** `npx gluestack-ui@latest add …` then customize under `src/components/ui/`.
