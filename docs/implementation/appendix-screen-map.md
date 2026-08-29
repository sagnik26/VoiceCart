# Appendix — screen map and dependency risks

**Product PRD:** [PRD-Kitchen-First.md](../PRD-Kitchen-First.md)

## Screen ↔ feature map

| Screen (PRD #) | Primary features / integrations |
| --- | --- |
| 1–3 Onboarding | [Onboarding and Profile](./onboarding-profile.md), Swiggy link, pantry/diet setup |
| 4–5 Home / Decide | [Kitchen](./kitchen.md), Decide comparison, voice capture |
| 6–12 Kitchen | [Kitchen](./kitchen.md), [Swiggy MCP — Instamart](./swiggy-mcp-instamart.md) |
| 13–16 Order | [Swiggy MCP — Food](./swiggy-mcp-food.md), Decide order path |
| 17 Order history | Combined cooked/ordered history |
| 18 Voice capture | [Voice ordering](./voice-ordering.md) (LiveKit agent), shared overlay |
| 19–20 Profile / Settings | Account, pantry manager entry, prefs |

## Dependency risk summary

| Dependency | Used for | Primary risk | Doc |
| --- | --- | --- | --- |
| Swiggy MCP Food | Search, cart, place, status | Production invite / review gate | [swiggy-mcp-food.md](./swiggy-mcp-food.md) |
| Swiggy MCP Instamart | Kitchen + ingredient carts | Same + pincode coverage | [swiggy-mcp-instamart.md](./swiggy-mcp-instamart.md) |
| LiveKit | WebRTC room transport + Agents framework | Cloud/self-host ops; RN native build | [voice-ordering.md](./voice-ordering.md) |
| Sarvam AI | STT/TTS | Model latency | [voice-ordering.md](./voice-ordering.md) |
| OpenAI | LLM inside LiveKit session | Tool-calling reliability for cart build | [voice-ordering.md](./voice-ordering.md) |
| Calorie source | Decide comparison | Uneven coverage | [calorie-estimation.md](./calorie-estimation.md) |
| OTP auth | Login | Vendor TBD for India | [onboarding-profile.md](./onboarding-profile.md) |

Integration stubs live in `@voicecart/rn-feature-integrations-core` until production credentials are wired.
