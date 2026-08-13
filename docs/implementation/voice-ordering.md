# Voice ordering

**PRD:** §3 Voice ordering, §6.1, screens 7–9.  
**Architecture (spine):** [`../voice-app-architecture.md`](../voice-app-architecture.md) — LiveKit · Sarvam STT/TTS · OpenAI agent.  
**Build order:** [`../voice-loop-build-phases.md`](../voice-loop-build-phases.md) — independently testable phases 0–9.

**Depends on:** [Swiggy MCP — Food](./swiggy-mcp-food.md), LiveKit Cloud/self-hosted room + agent worker  
**Related:** [Cross-cutting states and rules](./cross-cutting-states-and-rules.md), [Kitchen](./kitchen.md) (shared LiveKit client)

This doc is VoiceCart **product wiring** for Talk — what the UI and agent tools must do. Transport, models, turn flow, and latency live in the architecture doc; phased implementation gates live in the build-phases doc.

## Current state

- **Phase 2 (room lifecycle):** Live Talk shows Connecting / Listening / Reconnecting / Failed + Try again, with a 15s connect timeout. Retry remounts the session (new token). LiveKit SDK reconnect stays mounted. Mic denied is still Phase 0. Show cart stays disabled on the live path. Phase 1 orb metering is unchanged. No agent, Sarvam, OpenAI, or Swiggy.
- **Phase 1 (level metering):** Talk can join an empty LiveKit room and drive the orb from `useTrackVolume` when `EXPO_PUBLIC_VOICE_USE_LIVE_METERING=true` and a token mint (or smoke token) is configured. Cancel unmounts the room. Mock RAF timeline remains when the flag is off.
- **Phase 0 (native foundation):** LiveKit RN SDK + WebRTC Expo plugins are in the app; `registerGlobals()` runs at boot. Talk requests the microphone via `useMicPermission`. Deny shows a Microphone needed empty state.
- `@voicecart/rn-feature-voice` — Talk + Disambiguation screens; `@voicecart/rn-feature-voice-core` holds mocks, mic permission, live-metering config, and talk room status helpers.
- App route `apps/voicecart/src/app/voice.tsx` is a thin mount of `VoiceScreen`.
- Typed text does not feed an agent or cart.
- Disambiguation is still a placeholder screen.

## Target behaviour (product)

1. Talk opens already listening (after mic permission) and joins a LiveKit room.
2. Stream partial transcript (max two lines) while speaking; drive mic pulse from LiveKit audio-level events.
3. As the agent understands items, show chips (not only a final list).
4. Ambiguity → spoken clarification (Sarvam TTS) **and** Disambiguation UI with ≤3 named options (price/restaurant) + “None of these”.
5. When a cart is ready, Show cart → same Cart review as other entry points.
6. Typed input enters the **same** agent session as voice (PRD: typed = voice pipeline). Do not maintain a separate client-side parser.
7. Agent **never** places the order — only builds/proposes a cart; user taps Place order on Cart review. Agent tools: Food MCP search + `buildCart` only (`placeOrder` is not an agent tool).

## Implementation notes

| Layer | Responsibility |
| --- | --- |
| LiveKit RN client | Room connect/disconnect, publish mic, subscribe agent audio, audio-level → orb, connection-state UX |
| Token / room backend | Short-lived LiveKit access tokens; optional supporting API outside the voice loop |
| LiveKit Agent worker | `AgentSession`, VoiceCart system prompt, conversation state, logging, silence/turn tuning |
| Agent tools | Food search + `buildCart` only; emit structured events for chips, disambiguation options, cart-ready |
| RN UI | Transcript (≤2 lines), chips, Disambiguation screen, Show cart; keyboard secondary |
| Cart feature | Existing cart review; receives cart id/snapshot from agent — never auto-placed |

**Suggested modules:**

- Thin LiveKit room hook / provider in the app (no custom native audio modules).
- Agent worker package (Python or Node) with Sarvam + OpenAI plugins and Swiggy Food tool adapters.
- Voice feature screens consuming room + agent data events.

**Key files to evolve:** `@voicecart/rn-feature-voice` (replace mock RAF timeline with LiveKit session), orb driven by track levels, recognized list → chips from agent events, disambiguation screen; retire voice-core mock timeline once live.

Update **Current state** after each build phase that lands.

## Acceptance checks

- Median path: speak → cart under ~20s with network available (PRD success metric).
- Typing “butter chicken and garlic naan” produces the same cart path as speaking it (same agent tools).
- Ambiguous “biryani” never auto-picks; agent asks + UI shows ≤3 options or reopens listening.
- Agent cannot place an order (no `placeOrder` tool; only Cart CTA can).
- Barge-in stops TTS playback promptly when the user speaks over the agent.

## Risks

- End-to-end latency is dominated by STT + LLM + TTS ([architecture §4.3](../voice-app-architecture.md#43-latency-budget)); stream at every stage and avoid extra hops on the client.
- LiveKit + Expo/dev-client native deps; plan a custom dev client / EAS build (not Expo Go–only).
- Agent tool design must keep commerce failures visible (hide ordering entry points when Swiggy unavailable — PRD).
- Public-space noise → typed injection into the agent must remain first-class.
