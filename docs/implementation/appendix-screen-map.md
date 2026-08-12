# Appendix — screen map and dependency risks

## Screen ↔ feature map

| Screen (PRD #) | Primary features / integrations |
| --- | --- |
| 1–4 Onboarding | [Onboarding and Profile](./onboarding-profile.md), Swiggy link, prefs, [Routine](./routine-instamart-list.md) |
| 5 Home | [Track](./track.md) status, [Suggestions](./suggestions.md), [Routine](./routine-instamart-list.md), [Reorder](./reorder.md) |
| 6 Order history | [Reorder](./reorder.md) |
| 7–8 Voice / Disambiguation | [Voice ordering](./voice-ordering.md) (LiveKit agent), [Swiggy MCP — Food](./swiggy-mcp-food.md) |
| 9 Cart review | Food or Instamart MCP, [Calorie estimation](./calorie-estimation.md), Track impact |
| 10–11 Kitchen | [Kitchen](./kitchen.md), [Swiggy MCP — Instamart](./swiggy-mcp-instamart.md) |
| 12 Profile | Track entry, account, paywall entry |
| 13–14 Track / Edit limits | [Track](./track.md), [RevenueCat](./revenuecat-monetisation.md) |
| 15 Insights | [Track insights](./track-insights.md), RevenueCat |
| 16 Order status | Food/Instamart status, Track note |
| 17 Settings | Local prefs |
| 18 Paywall | [RevenueCat](./revenuecat-monetisation.md) |

## Dependency risk summary (PRD §10)

| Dependency | Used for | Primary risk | Doc |
| --- | --- | --- | --- |
| Swiggy MCP Food | Search, cart, place, status | Production invite / review gate | [swiggy-mcp-food.md](./swiggy-mcp-food.md) |
| Swiggy MCP Instamart | Kitchen + routine carts | Same + pincode coverage | [swiggy-mcp-instamart.md](./swiggy-mcp-instamart.md) |
| LiveKit | WebRTC room transport + Agents framework | Cloud/self-host ops; RN native build (not Expo Go–only) | [voice-ordering.md](./voice-ordering.md), [`../voice-app-architecture.md`](../voice-app-architecture.md) |
| Sarvam AI | Saaras v3 STT (+ VAD/turn), Bulbul v3 TTS | Model latency; plugin integration quality | [voice-ordering.md](./voice-ordering.md) |
| OpenAI | Streaming LLM inside LiveKit `AgentSession` | Latency/cost; tool-calling reliability for cart build | [voice-ordering.md](./voice-ordering.md) |
| Calorie source | Track + cart impact | Uneven coverage | [calorie-estimation.md](./calorie-estimation.md) |
| RevenueCat | Track entitlements | Store / IAP setup | [revenuecat-monetisation.md](./revenuecat-monetisation.md) |
