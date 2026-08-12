# Voice ordering

**PRD:** §3 Voice ordering, §6.1, screens 7–9.  
**Architecture:** [`../voice-app-architecture.md`](../voice-app-architecture.md) — LiveKit (WebRTC) · Sarvam STT/TTS · OpenAI LLM agent.

**Depends on:** [Swiggy MCP — Food](./swiggy-mcp-food.md), LiveKit Cloud/self-hosted room + agent worker  
**Related:** [Cross-cutting states and rules](./cross-cutting-states-and-rules.md), [Kitchen](./kitchen.md) (shared LiveKit client)

## Current state

- `src/app/voice.tsx` — timed mock phases (listen → think → speak), local orb animation, keyboard toggle, Show cart.
- Recognised items are list rows from `voice-mock.ts`, not live transcript chips.
- Typed text does not feed an agent or cart.
- `src/app/disambiguation.tsx` is a placeholder.
- No LiveKit room, mic permission wiring, Sarvam, or OpenAI agent session.

## Target behaviour (product)

1. Talk opens already listening (after mic permission) and joins a LiveKit room.
2. Stream partial transcript (max two lines) while speaking; drive mic pulse from LiveKit audio-level events.
3. As the agent understands items, show chips (not only a final list).
4. Ambiguity → spoken clarification (Sarvam TTS) **and** Disambiguation UI with ≤3 named options (price/restaurant) + “None of these”.
5. When a cart is ready, Show cart → same Cart review as other entry points.
6. Typed input enters the **same** agent session as voice (PRD: typed = voice pipeline).
7. Agent **never** places the order — only builds/proposes a cart; user taps Place order on Cart review.

## Architecture mapping

VoiceCart Talk uses the three-tier stack in the architecture doc, with ordering-specific agent tools:

| Tier | Role in VoiceCart |
| --- | --- |
| **Device** (`@livekit/react-native`) | Mic/playback, AEC, reconnection, audio levels → orb/waveform; transcript + chips + connection UX; no raw audio in JS |
| **Transport** (LiveKit room / WebRTC) | Bidirectional audio; replace any direct Sarvam WebSocket from the app |
| **LiveKit Agent** | `AgentSession`: Sarvam STT → OpenAI LLM → Sarvam TTS; `turn_detection="stt"`; barge-in cancels in-flight TTS |
| **External AI** | Saaras v3 (STT + VAD), GPT (streaming reply), Bulbul v3 (TTS) |
| **Commerce tools** | Agent tools call Swiggy Food MCP (search / build cart). `placeOrder` is **not** an agent tool |

Reference agent config (from architecture; models may be pinned in env):

```python
session = AgentSession(
    stt=sarvam.STT(model="saaras:v3", mode="transcribe", flush_signal=True),
    llm=openai.LLM(model="gpt-5.6-terra"),
    tts=sarvam.TTS(model="bulbul:v3", target_language_code="en-IN", speaker="shubh"),
    turn_detection="stt",
)
```

### End-to-end ordering turn

1. Native mic (LiveKit SDK) → WebRTC → LiveKit room.
2. Agent forwards audio → Sarvam STT; partials update UI transcript; final transcript ends the user turn.
3. LLM interprets the order, may call Food MCP tools, may ask a clarifying question (TTS + Disambiguation screen via data channel / agent event).
4. Reply streams token → sentence chunks → Sarvam TTS → published to room → device playback (jitter buffer).
5. Barge-in: new user speech while TTS plays → agent cancels TTS; device flushes playback.
6. On complete cart proposal, client enables Show cart; Place order remains cart-only.

### Typed path

Keyboard toggle injects text into the same `AgentSession` (e.g. `session.generate_reply` / text input API), so search, clarification, and cart tools stay identical to spoken turns. Do not maintain a separate client-side parser.

## Implementation

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

**Key files to evolve:** `voice.tsx` (replace mock RAF timeline with LiveKit session), orb driven by track levels, `recognized-list.tsx` → chips from agent events, `disambiguation.tsx`, retire `voice-mock.ts` timeline once live.

**Still to build (architecture §5, VoiceCart-scoped):**

- Agent application code: prompts, ordering tools, barge-in behaviour, logging.
- Client: LiveKit integration on Talk (+ Kitchen reuse), transcript/chips, connection UX.
- Supporting backend as needed: token minting, accounts — outside the live voice loop.

## Acceptance checks

- Median path: speak → cart under ~20s with network available (PRD success metric).
- Typing “butter chicken and garlic naan” produces the same cart path as speaking it (same agent tools).
- Ambiguous “biryani” never auto-picks; agent asks + UI shows ≤3 options or reopens listening.
- Agent cannot place an order (no `placeOrder` tool; only Cart CTA can).
- Barge-in stops TTS playback promptly when the user speaks over the agent.

## Risks

- End-to-end latency is dominated by STT + LLM + TTS (architecture §4.3); stream at every stage and avoid extra hops on the client.
- LiveKit + Expo/dev-client native deps; plan a custom dev client / EAS build (not Expo Go–only).
- Agent tool design must keep commerce failures visible (hide ordering entry points when Swiggy unavailable — PRD).
- Public-space noise → typed injection into the agent must remain first-class.
