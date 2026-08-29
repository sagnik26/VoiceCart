# VoiceCart Design System

Foundation for UI work. Product scope and screen specs live in [PRD-Kitchen-First.md](./PRD-Kitchen-First.md) (§7–8). Wireframe reference: [kitchen-app-wireframes.html](./kitchen-app-wireframes.html).

## Stack

| Layer | Choice |
| --- | --- |
| App | Expo SDK 57, Expo Router (`apps/voicecart/src/app`) |
| UI kit | [gluestack-ui](https://gluestack.io/) v5 (`@voicecart/rn-ui` → `core/modules/rn-ui/src/ui/`) |
| Styling | NativeWind v4 + Tailwind CSS v3 (`className`) — CLI fell back from NativeWind v5 (not yet supported for this project shape) |
| Tokens | `@voicecart/rn-ui` gluestack config + `@voicecart/rn-theme` |

Do not add a second UI kit (Paper, NativeBase, Tamagui, etc.) without explicit approval. Prefer (from `apps/voicecart`):

```bash
npx gluestack-ui@latest add <component> -y --use-npm --path ../../core/modules/rn-ui/src/ui
```

## Tokens

Source values: PRD §8, mapped onto gluestack CSS variables.

| Role | Hex | Gluestack / Tailwind | Notes |
| --- | --- | --- | --- |
| Brand / primary CTA | `#C9603A` | `primary` | Kitchen actions, primary buttons |
| Success | `#1D9E75` | `success` | Confirmed chips, Have |
| Warning | `#D19A2B` | `warning` | Advisories |
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

1. [`core/modules/rn-ui/src/ui/gluestack-ui-provider/config.ts`](../core/modules/rn-ui/src/ui/gluestack-ui-provider/config.ts) — NativeWind `vars` (RGB channels)
2. [`core/modules/rn-theme/src/theme.ts`](../core/modules/rn-theme/src/theme.ts) — JS colors for StatusBar, splash, native tab tint

Then keep this doc in sync.

## Navigation IA

```
Root Stack
├── index             Redirect → (tabs) or (onboarding)
├── (onboarding)      Login, address, pantry setup
├── (tabs)            ← 4-tab bar visible
│   ├── index         Home
│   ├── kitchen       Kitchen
│   ├── order         Order (restaurant search)
│   └── profile       Profile
├── voice             Voice overlay (modal slide-up)
├── decide
├── ingredient-list
├── ingredients       Have/Need selection
├── reverse
├── pantry
├── menu
├── cart
├── order-status
├── history
├── settings
└── disambiguation    Legacy stub
```

- Tab bar: Home · Kitchen · Order · Profile (`@voicecart/rn-ui` `KitchenAppTabBar`).
- Voice calls `router.push('/voice')` from Home, Kitchen, and Order mic buttons.
- Stack screens hide the tab bar by default.
- Feature UI lives in `apps/voicecart/features/rn-feature-*`; routes under `apps/voicecart/src/app` only mount screens.

## Screen inventory

| Screen | Route | Status |
| --- | --- | --- |
| Login | `/(onboarding)/login` | Implemented (mock OTP) |
| Address & Swiggy link | `/(onboarding)/setup-address` | Implemented (mock) |
| Pantry & diet setup | `/(onboarding)/setup-pantry` | Implemented (mock) |
| Home | `/(tabs)` | Implemented (mock data) |
| Decide | `/decide` | Implemented (mock data) |
| Kitchen home | `/(tabs)/kitchen` | Implemented (mock data) |
| Ingredient list | `/ingredient-list` | Implemented (mock data) |
| Reverse mode | `/reverse` | Implemented (mock data) |
| Ingredient selection | `/ingredients` | Implemented (mock data) |
| Pantry manager | `/pantry` | Implemented (mock data) |
| Instamart cart review | `/cart?source=instamart` | Implemented (mock data) |
| Kitchen order status | `/order-status?source=instamart` | Implemented (mock data) |
| Restaurant search | `/(tabs)/order` | Implemented (mock data) |
| Restaurant menu | `/menu` | Implemented (mock data) |
| Food cart review | `/cart?source=food` | Implemented (mock data) |
| Food order status | `/order-status?source=food` | Implemented (mock data) |
| Order history | `/history` | Implemented (mock data) |
| Voice capture | `/voice` | Implemented (mock + orb) |
| Profile home | `/(tabs)/profile` | Implemented (mock data) |
| Settings | `/settings` | Implemented (mock data) |

## Component conventions

- Import from `@/components/ui/<name>` (e.g. `Button`, `Box`, `VStack`).
- Style with NativeWind `className` using semantic tokens (`bg-background`, `text-primary`, `border-border`).
- Shared placeholder chrome: `src/components/screen-placeholder.tsx`.
- Feature UI will later move into `features/*` packages per AGENTS.md; keep this foundation as the integration layer for now (flat app at repo root).

## Extending

**New token:** add RGB channels to `config.ts` light/dark, map in `tailwind.config.js` `theme.extend.colors`, mirror hex in `theme.ts`, document here.

**New screen:** add a file under `src/app/`, register in root `Stack` if needed, link from an existing screen. Prefer gluestack primitives over one-off Views.

**New component:** `npx gluestack-ui@latest add …` then customize under `src/components/ui/`.
