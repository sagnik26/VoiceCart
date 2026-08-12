# Voice loop — phased build plan

Cursor-facing plan for implementing [`docs/voice-app-architecture.md`](./voice-app-architecture.md) (Talk spine) and [`docs/implementation/voice-ordering.md`](./implementation/voice-ordering.md).

**Principle:** each phase ships something you can **demo and test alone** on a device, without unfinished later phases. Do not start the next phase until the current phase’s exit criteria pass.

**Product constraints (every phase):** agent never places orders; Place order stays on cart review; typed input eventually shares the same agent session as voice.

---

## Phase map

| Phase | Name | What you prove on device | Needs LiveKit room? | Needs agent? | Needs Sarvam/OpenAI? | Needs Swiggy? |
| --- | --- | --- | --- | --- | --- | --- |
| **0** | Native foundation | App builds with LiveKit; mic permission works | No | No | No | No |
| **1** | Level metering → UI | Speak into mic → orb/pulse responds to volume | Yes (empty / self-only) | No | No | No |
| **2** | Room lifecycle UX | Connect / reconnect / leave / error states are clear | Yes | No | No | No |
| **3** | Remote audio playback | Hear audio published into the room | Yes | Optional stub | No | No |
| **4** | Minimal voice agent | Speak → hear a reply (STT → LLM → TTS) | Yes | Yes | Yes | No |
| **5** | Transcript + barge-in | Live transcript; interrupt agent speech | Yes | Yes | Yes | No |
| **6** | Ordering UI events (mock tools) | Chips, disambiguation, Show cart from agent events | Yes | Yes | Yes | No (mocked) |
| **7** | Typed = same session | Type an order → same chips/cart path as voice | Yes | Yes | Yes | No (mocked) |
| **8** | Swiggy Food MCP tools | Real search + build cart via agent tools | Yes | Yes | Yes | Yes |
| **9** | Cart handoff polish | Show cart → existing cart review; place order user-only | Yes | Yes | Yes | Yes |

**Start here for UI feel:** Phase **0 → 1**. Phase 1 is the first “voice input moves the UI” milestone.

```mermaid
flowchart LR
  P0[0 Foundation] --> P1[1 Metering UI]
  P1 --> P2[2 Room UX]
  P2 --> P3[3 Playback]
  P3 --> P4[4 Echo agent]
  P4 --> P5[5 Transcript + barge-in]
  P5 --> P6[6 Mock ordering events]
  P6 --> P7[7 Typed path]
  P7 --> P8[8 Real Food MCP]
  P8 --> P9[9 Cart handoff]
```

---

## Phase 0 — Native foundation

### Goal

Ship a rebuildable Expo/RN Android (and later iOS) binary that includes LiveKit native deps and can request the microphone.

### In scope

- Add `@livekit/react-native`, LiveKit WebRTC fork, and Expo config plugins as required by current LiveKit Expo docs.
- Rebuild native app (`expo run:android`); Expo Go is **not** enough.
- Mic permission string / Android manifest / iOS usage description.
- Thin `useMicPermission` (or equivalent) used from Talk.

### Out of scope

- Joining a room, levels, agent, UI animation changes.

### Deliverables

- Native project builds and launches on device.
- Opening Talk (or a temporary debug screen) can request mic; grant/deny handled.

### Independent test

1. Install fresh build on device over USB/Wi‑Fi.
2. Open permission flow → Allow → status shows granted.
3. Deny → clear empty/error for “mic needed” (can be minimal copy).
4. Confirm Metro/dev client still loads JS after native change.

### Exit criteria

- [ ] Clean native build on the target Android device.
- [ ] Mic permission grant and deny both observable in UI.
- [ ] No LiveKit room code required yet.

---

## Phase 1 — Level metering → UI response ⭐ first voice UI milestone

### Goal

Prove that **real mic input** drives the Talk orb / pulse using **LiveKit track audio levels** — no custom RMS, no STT, no agent.

### Why this is independently testable

Audio levels come from the **local published mic track** inside a LiveKit room. A room with **only this client** (no agent participant) is enough. Use LiveKit Cloud (or self-host) + a tiny token mint (script or local server).

### In scope

- Dev-only token mint (env-based API key/secret; never commit secrets).
- Connect to a room from Talk; publish microphone.
- Subscribe to local track `audioLevel` / LiveKit volume events (per current `@livekit/react-native` API).
- Drive `VoiceOrb` (scale/pulse/intensity) from levels; map silence → idle, speech → listening energy.
- Replace or bypass the mock RAF timeline in `src/app/voice.tsx` / `voice-mock.ts` for the listening visual path.
- Tear down: leaving Talk unpublishes and disconnects.

### Out of scope

- Remote subscribers, STT, TTS, transcripts, chips, cart, agent worker.

### Deliverables

- Talk opens → connects → listening UI.
- Speaking louder/softer visibly changes the orb.
- Silence returns toward idle within a short decay.
- Cancel / back cleans up the room session.

### Independent test

1. Start token mint + ensure LiveKit project/room credentials work.
2. Open Talk on device; wait until “listening” / connected.
3. Stay silent → orb idle / low activity.
4. Speak at normal volume → pulse reacts; shout → stronger; whisper → weaker.
5. Cover mic / mute if exposed → activity drops.
6. Leave Talk and re-enter → levels work again (no stuck room).
7. Optional: airplane mode mid-session → failure is acceptable if Phase 2 not done; note behaviour for Phase 2.

### Exit criteria

- [ ] Orb responds to live voice without any agent process running.
- [ ] No Sarvam/OpenAI keys required for this phase.
- [ ] Session cleanup on leave verified.
- [ ] Mock listen animation is no longer the source of truth while connected.

### Notes / risks

- Levels need a **published** local audio track; connecting without publish will look “dead.”
- USB Metro reloads can interrupt sessions — prefer Wi‑Fi ADB when tuning animation.
- Keep a feature flag `VOICE_USE_LIVE_METERING` so you can fall back to mock if LiveKit is down during unrelated UI work.

---

## Phase 2 — Room lifecycle UX

### Goal

Connection and recovery feel intentional: connecting, connected, reconnecting, failed, permission denied.

### In scope

- Explicit connection-state UI on Talk (and shared hook).
- Reconnect handling via LiveKit SDK defaults; surface status.
- Cancel / timeout / “try again.”
- Hide or disable Show cart while not in a useful session (still mock-disabled).

### Out of scope

- Agent, transcripts, playback quality tuning beyond “connected.”

### Independent test

1. Happy path: open Talk → Connecting → Connected/Listening.
2. Deny mic → dedicated state (from Phase 0) still correct.
3. Invalid token / wrong URL → Failed + retry.
4. Toggle airplane mode while connected → Reconnecting or Failed; recover when network returns.
5. Spam enter/leave Talk → no zombie rooms (check LiveKit dashboard participants).

### Exit criteria

- [ ] Every connection state has visible UI.
- [ ] Retry works after failure.
- [ ] No zombie participants after normal leave.

---

## Phase 3 — Remote audio playback

### Goal

Confirm the device can **play** room audio through LiveKit (speakers, AEC path) before attaching a full AI agent.

### In scope

- Subscribe to remote audio tracks.
- Audio session / speaker routing sanity on Android.
- Test publisher: second device, LiveKit CLI/ffmpeg publisher, or a tiny “play wav into room” helper — **not** Sarvam yet.

### Out of scope

- LLM replies, barge-in, transcripts.

### Independent test

1. Join room from app; start test publisher into same room.
2. Hear audio on device clearly.
3. Stop publisher → playback stops.
4. Start metering (Phase 1) while remote audio plays → AEC should reduce orb reacting to speaker bleed (qualitative check).

### Exit criteria

- [ ] Remote audio audible on device.
- [ ] No crash on track subscribe/unsubscribe.
- [ ] Phase 1 metering still works with playback present.

---

## Phase 4 — Minimal voice agent (echo / hello)

### Goal

Stand up LiveKit Agents worker with Sarvam STT + OpenAI LLM + Sarvam TTS (`turn_detection="stt"`) and a **fixed** prompt (e.g. greet or briefly acknowledge). Prove full duplex voice loop.

### In scope

- Agent worker project (Python or Node — lock in `docs/implementation/open-decisions.md`).
- Official Sarvam + OpenAI LiveKit plugins.
- Agent joins same room as the app when Talk connects (dispatch rule or manual).
- No Food MCP tools yet.

### Out of scope

- Ordering chips, disambiguation screen, cart tools.

### Independent test

1. Run agent worker locally; connect Talk.
2. Speak a short sentence → hear spoken reply.
3. Second turn works without restarting the app.
4. Kill agent → app shows failure/reconnect (Phase 2 states); restart agent → works again.

### Exit criteria

- [ ] End-to-end speak → hear reply on device.
- [ ] No commerce tools registered.
- [ ] Secrets only via env.

---

## Phase 5 — Transcript UI + barge-in

### Goal

Partial/final transcripts on Talk (≤2 lines) and interrupt-in-progress TTS when the user speaks again.

### In scope

- Wire transcription / agent text events into Talk UI.
- Barge-in: rely on Sarvam STT VAD + agent cancel; ensure client flushes playback as SDK allows.
- Thinking/speaking orb states driven by session phase, while levels still modulate listening.

### Out of scope

- Chips, disambiguation options list, Show cart enablement logic.

### Independent test

1. Speak slowly → partial transcript updates live.
2. Pause → final transcript settles.
3. While agent is talking, interrupt with speech → agent audio stops promptly; new user turn starts.
4. Transcript never grows into a wall of text (cap / two-line behaviour).

### Exit criteria

- [ ] Partials and finals visible and correct enough for Hinglish smoke phrases.
- [ ] Barge-in felt within a short delay (qualitative; log timestamps if possible).
- [ ] Phase 1 levels still good in listening state.

---

## Phase 6 — Ordering UI events (mock agent tools)

### Goal

Agent emits VoiceCart UI events with **mocked** commerce: recognised item chips, ≤3 disambiguation options, cart-ready → enable Show cart. Still **no** `placeOrder` tool.

### In scope

- Agent tools or data messages: `items_recognized`, `disambiguation`, `cart_ready` (names flexible).
- Implement Disambiguation screen for real.
- Show cart navigates to existing cart with mock/fixture payload from the event.
- System prompt: ordering assistant, never claims order was placed.

### Out of scope

- Real Swiggy MCP.

### Independent test

1. Say something ambiguous (“biryani”) → Disambiguation UI + spoken prompt; pick option or “None of these.”
2. Say a clear combo → chips appear progressively; Show cart enables.
3. Show cart → cart screen with expected lines.
4. Confirm agent tool list has no place-order capability (code review + runtime).

### Exit criteria

- [ ] Chips, disambiguation, Show cart all demoable with mocks.
- [ ] Agent cannot place an order.
- [ ] Phases 1 and 5 still pass smoke checks.

---

## Phase 7 — Typed input = same session

### Goal

Keyboard path injects text into the **same** `AgentSession` as voice (PRD rule).

### In scope

- Talk keyboard toggle sends text into agent.
- Same chips / disambiguation / cart-ready events as voice.

### Independent test

1. Type “butter chicken and garlic naan” → chips + Show cart without speaking.
2. Mix: speak one item, type another → session continues coherently.
3. Ambiguous typed query → same Disambiguation UI.

### Exit criteria

- [ ] Typed and spoken paths share one session and one tool surface.
- [ ] No parallel client-side parser.

---

## Phase 8 — Swiggy Food MCP (real tools)

### Goal

Replace mock commerce tools with real Food MCP search + `buildCart`. Still no agent `placeOrder`.

### In scope

- MCP client from agent worker; address/pincode context from app/session metadata.
- Map MCP results into chips / disambiguation / cart snapshot events.
- PRD fallback when MCP unavailable (hide ordering entry or disable Talk cart path — product copy).

### Independent test

1. Serviceable address → real restaurants/items in chips/options.
2. Build cart totals match MCP (spot-check).
3. Unserviceable / unlinked → defined failure UI, no crash.
4. Agent still cannot place order.

### Exit criteria

- [ ] Live search + cart build on device.
- [ ] Failure modes match implementation docs.
- [ ] Mock-tool flag still available for offline demos.

---

## Phase 9 — Cart handoff polish

### Goal

Production-shaped handoff into existing cart review and user-confirm place order; connection teardown after leave; small UX polish.

### In scope

- Cart params/id from agent → `src/app/cart.tsx` (or successor) with live snapshot.
- Place order only from cart CTA → order status (MCP place when ready).
- Add-more-by-voice returns to Talk session cleanly.
- Remove dead mock timeline code paths if unused.

### Independent test

1. Voice → Show cart → edit qty → Place order → order status.
2. Back stack does not revive a stale cart after success (PRD).
3. Full smoke: metering + transcript + barge-in + typed + real cart.

### Exit criteria

- [ ] Happy path voice order demo under ~20s median when network is healthy (PRD target — measure, don’t guess).
- [ ] Product rules checklist in `docs/implementation/cross-cutting-states-and-rules.md` satisfied for Talk.

---

## Working agreements for agents

1. Read this plan + `docs/voice-app-architecture.md` before changing Talk/LiveKit code.
2. Implement **one phase at a time**; say which phase is in progress.
3. Do not add Sarvam/OpenAI/Swiggy into Phase 0–1.
4. Prefer feature flags over deleting mock UI until Phase 1 exit criteria pass.
5. After each phase, update “Current state” in `docs/implementation/voice-ordering.md` briefly.
6. Secrets only in env / EAS secrets; never commit LiveKit/OpenAI/Sarvam keys.

---

## Suggested first slice (this week)

1. Complete **Phase 0** (native LiveKit + permission).
2. Complete **Phase 1** (empty-room local publish + orb from `audioLevel`).
3. Stop and dogfood UI response on a real device before Phase 2.

---

*Plan version: 1.0 — aligned to voice-app-architecture.md and voice-ordering.md.*
