---
name: voicecart-module-carve
description: >-
  Carves VoiceCart into npm workspace packages using rn-feature / rn-feature-core /
  global core rules from AGENTS.md. Use when scaffolding modules, moving src/ into
  apps/voicecart features or core, inventoring packages, or deciding where new code
  belongs (feature vs feature-core vs core/modules).
license: MIT
metadata:
  author: VoiceCart
  tags: monorepo, modules, features, architecture
---

# VoiceCart module carve

## Placement rule (verbatim)

Whatever feature modules you create (`rn-feature`), their business logic goes under core (`rn-feature-core`). Rest all goes under global core modules.

## Target layout

```text
/
  package.json                      # private root; "workspaces": [...]
  apps/voicecart/                   # Expo app package
    features/rn-feature-<name>/     # screens + feature UI (may use react-navigation / RN)
    core/rn-feature-<name>-core/    # that feature’s domain, mocks, non-screen logic
  core/modules/rn-<name>/           # shared across features/apps — not feature-owned
```

Use **npm workspaces** only (root `package.json` `"workspaces"`). Do not add `pnpm-workspace.yaml`.

Suggested workspaces globs:

```json
"workspaces": [
  "apps/*",
  "apps/*/features/*",
  "apps/*/core/*",
  "core/modules/*"
]
```

Main app (`apps/voicecart` src / Expo Router) stays a thin integration layer: layouts, route mounts, app lifecycle — not feature dumps.

Align with [AGENTS.md](../../../AGENTS.md) Module Organization Principles:

| Package kind | Path | May have screens? | May import |
| --- | --- | --- | --- |
| Feature | `apps/voicecart/features/rn-feature-*` | Yes | Its `*-core`, global `core/modules/*` — **never** another feature |
| Feature-core | `apps/voicecart/core/rn-feature-*-core` | No | Global `core/modules/*`; prefer inject over hard deps on other cores |
| Global core | `core/modules/rn-*` | No | Other global cores only if necessary; do not mix UI kit + business in one package |

Import as workspace packages (npm names), not relative paths across package roots.

## Naming

- Feature: `rn-feature-<name>` (e.g. `rn-feature-voice`)
- Paired core: `rn-feature-<name>-core` (e.g. `rn-feature-voice-core`)
- Global: `rn-<concern>` (e.g. `rn-ui`, `rn-theme`) — no `feature` in the name

One product surface → one feature + one feature-core pair. Do not invent a feature package without its core (even if the core is thin mocks today).

## What goes where

**`rn-feature-*`**

- Expo/React Navigation screens for that surface
- Feature-only presentational components
- Wiring: hooks that call into `rn-feature-*-core` and navigate

**`rn-feature-*-core`**

- Domain models, mock/API clients, session/state for that feature
- Pure helpers and mappers (e.g. mock timeline → chip list)
- No screen files; no `react-navigation` dependency

**`core/modules/*` (global)**

- Shared UI kit / theme / shell chrome used by multiple features
- Infra reused across features (storage, networking, telemetry, error reporting)
- Anything not owned by a single feature

**Stay in the app shell**

- Root / tabs `_layout.tsx`, Expo Router route files that only re-export or mount feature screens
- Native `ios/` / `android/`, Expo config

## Workflow when carving or adding code

1. Inventory existing `src/` (or ask which surface) — see [module-inventory.md](references/module-inventory.md).
2. Classify each folder/file: feature UI → `rn-feature-*`; domain/mocks → matching `*-core`; shared → `core/modules`.
3. If adding **new** product behaviour: create or extend the feature + feature-core pair; only add a global module when a second feature needs the same code.
4. Preserve AGENTS constraints: features do not import features; cores have no screens.
5. Prefer moving one pair at a time (e.g. voice first for LiveKit phases) over boiling the ocean.

## Anti-patterns

- Putting mocks or domain types inside `rn-feature-*` instead of `*-core`
- A “god” global package that holds VoiceCart commerce + voice + track
- Feature A importing Feature B screens/components — extract shared UI to `rn-ui` or shared domain to a core / global module
- Scaffolding Track / Paywall / Swiggy packages before those surfaces exist in the repo (unless the user asks)

## References

- [Current repo inventory](references/module-inventory.md) — packages implied by today’s `src/`
- [AGENTS.md](../../../AGENTS.md) — monorepo + dependency rules
- [create-react-native-library](../create-react-native-library/SKILL.md) — when scaffolding a local package
