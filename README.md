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

   Talk uses LiveKit native modules, so **Expo Go is not enough**. Use a native rebuild:

   ```bash
   npm run android
   ```

   Or from the app package: `npm run start -w voicecart`.

### Talk live metering (Phase 1)

1. Copy `apps/voicecart/.env.example` to `apps/voicecart/.env.local` and fill LiveKit Cloud URL, API key, and secret. Do not put the API secret in `EXPO_PUBLIC_*`.
2. Start the token mint (leave it running):

   ```bash
   npm run token:livekit
   ```

3. Point `EXPO_PUBLIC_LIVEKIT_TOKEN_URL` at the mint: `http://10.0.2.2:8787/token` on the Android emulator, or `http://<your-LAN-IP>:8787/token` on a physical device. Set `EXPO_PUBLIC_VOICE_USE_LIVE_METERING=true`.
4. Rebuild/run with `npm run android`. Open Talk, allow the mic, and speak — the orb should follow volume. Leave Talk to disconnect.

If the flag is off or URL/token env is missing, Talk keeps the mock listen animation.

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run android` | Native rebuild (`expo run:android`). Required for Talk / LiveKit. |
| `npm run token:livekit` | Dev-only LiveKit token mint (`apps/voicecart/.env.local`). |
| `npm run ios` | `expo run:ios` |
| `npm run lint` | ESLint via Expo |
| `npm run type:check` | TypeScript check for the app |

### Workspace layout

See `AGENTS.md` and `.cursor/skills/voicecart-module-carve/SKILL.md` for `rn-feature` / `rn-feature-core` / `core/modules` placement. Use **npm workspaces** only (no `pnpm-workspace.yaml`).
