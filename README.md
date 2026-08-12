# VoiceCart

npm workspaces monorepo. The Expo app lives in `apps/voicecart`.

## Get started

1. Install dependencies (from repo root):

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm start
   ```

   Or from the app package: `npm run start -w voicecart`.

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run android` | `expo run:android` |
| `npm run ios` | `expo run:ios` |
| `npm run lint` | ESLint via Expo |
| `npm run type:check` | TypeScript check for the app |

### Workspace layout

See `AGENTS.md` and `.cursor/skills/voicecart-module-carve/SKILL.md` for `rn-feature` / `rn-feature-core` / `core/modules` placement. Use **npm workspaces** only (no `pnpm-workspace.yaml`).
