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

1. Copy `.env.example` to `.env.local` at the **repo root** and fill it. That is the only env file: LiveKit, `EXPO_PUBLIC_*`, Sarvam, and OpenAI. Do not put API secrets in `EXPO_PUBLIC_*`. If you still have `apps/voicecart/.env.local`, copy those values up, then you can delete the nested file.
2. Start the token mint (leave it running):

   ```bash
   npm run token:livekit
   ```

3. Point `EXPO_PUBLIC_LIVEKIT_TOKEN_URL` at the mint: `http://10.0.2.2:8787/token` on the Android emulator, or `http://<your-LAN-IP>:8787/token` on a physical device. Set `EXPO_PUBLIC_VOICE_USE_LIVE_METERING=true`.
4. Rebuild/run with `npm run android`. Open Talk, allow the mic, and speak — the orb should follow volume. Leave Talk to disconnect.

If the flag is off or URL/token env is missing, Talk keeps the mock listen animation.

### Talk remote playback (Phase 3)

With Talk already **Listening…** on a device, publish a clip into the same room (`voicecart-talk-dev`). You should hear it on the phone speakers, then silence when the publisher stops. The orb still tracks **your** mic, not the clip.

LiveKit CLI publishes Opus `.ogg` (not wav). From repo root, with `lk` and `ffmpeg` on PATH and the same repo-root `.env.local` as the token mint:

```bash
npm run publish:livekit-audio
```

Ctrl+C stops the publisher (phone should go silent). `--once` exits after the beep. `--file /path/to/clip.ogg` publishes your own Opus file.

Or by hand (unique `--identity`, same room as the app):

```bash
lk room join \
  --url "$LIVEKIT_URL" \
  --api-key "$LIVEKIT_API_KEY" \
  --api-secret "$LIVEKIT_API_SECRET" \
  --identity voicecart-publisher \
  --publish /path/to/clip.ogg \
  voicecart-talk-dev
```

Convert wav → ogg first: `ffmpeg -y -i clip.wav -c:a libopus -b:a 32k clip.ogg`.

### Talk voice agent (Phase 4)

Three terminals: Metro (`npm start` / `npm run android`), the token mint, and the Python worker. Live Talk waits for the agent; without it you get Failed + Try again.

One-time setup (Python 3.10+):

```bash
npm run agent:setup
```

Add `SARVAM_API_KEY` and `OPENAI_API_KEY` to the same repo-root `.env.local`. Then:

```bash
npm run token:livekit
npm run agent
```

Open Talk, wait until **Listening…**, speak a short sentence, and you should hear a spoken reply. Leave Talk or stop the worker — the session fails; retry after the worker is back. `npm install` does not install Python packages.

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run android` | Native rebuild (`expo run:android`). Required for Talk / LiveKit. |
| `npm run token:livekit` | Dev-only LiveKit token mint (repo-root `.env.local`). |
| `npm run publish:livekit-audio` | Dev-only: publish a test beep into `voicecart-talk-dev` (`lk` + `ffmpeg`). |
| `npm run agent:setup` | Create `services/talk-agent/.venv` and pip-install LiveKit Agents. |
| `npm run agent` | Dev-only Python Talk agent (`voicecart-talk`). |
| `npm run ios` | `expo run:ios` |
| `npm run lint` | ESLint via Expo |
| `npm run type:check` | TypeScript check for the app |

### Workspace layout

See `AGENTS.md` and `.cursor/skills/voicecart-module-carve/SKILL.md` for `rn-feature` / `rn-feature-core` / `core/modules` placement. Use **npm workspaces** only (no `pnpm-workspace.yaml`). The Talk agent lives in `services/talk-agent` (Python process, scripts-only workspace).
