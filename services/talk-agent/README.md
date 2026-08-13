# Talk agent (Phase 4)

Python LiveKit Agents worker. npm scripts only — `npm install` does not install Python packages.

All keys live in the **repo-root** `.env.local` (`LIVEKIT_*`, `SARVAM_API_KEY`, `OPENAI_API_KEY`). See `/.env.example`.

```bash
npm run agent:setup
npm run agent
```

Registers as `voicecart-talk`. The token mint dispatches this agent into `voicecart-talk-dev` when Talk connects. No cart or order tools.
