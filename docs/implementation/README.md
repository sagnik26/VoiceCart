# Implementation guide — features and integrations

Companion to [`../PRD-Voice-Food-Ordering-App.md`](../PRD-Voice-Food-Ordering-App.md). Voice transport/STT/TTS/LLM spine: [`../voice-app-architecture.md`](../voice-app-architecture.md). One doc per feature or integration: current state, target behaviour, implementation approach, acceptance checks, and risks.

**Scope:** engineering implementation plans, not visual design. Upgrade existing UI shells in place where noted.

**Baseline:** Expo / React Native under `src/` with mock-driven Home, Voice, Kitchen, Cart, Order status, History, and Settings. No LiveKit room, agent worker, commerce MCP, Track, or billing SDKs yet.

## Build order

| Phase | Deliverables | Unlocks | Doc |
| --- | --- | --- | --- |
| **A — Commerce spine** | Swiggy Food MCP, live cart, place order, order status | Real voice tools and reorder | [swiggy-mcp-food.md](./swiggy-mcp-food.md) |
| **B — Voice loop** | LiveKit RN client + agent (Sarvam STT/TTS, OpenAI LLM), ordering tools, disambiguation, typed→same session | Voice end-to-end | [voice-ordering.md](./voice-ordering.md), [voice-app-architecture.md](../voice-app-architecture.md) |
| **C — Instamart + Kitchen** | Instamart MCP, ingredient → cart, routine carting | Kitchen + grocery | [swiggy-mcp-instamart.md](./swiggy-mcp-instamart.md), [kitchen.md](./kitchen.md) |
| **D — Track core** | Spend/calorie ledger, Home status, cart impact, Profile Track | Paid surfaces | [track.md](./track.md), [calorie-estimation.md](./calorie-estimation.md) |
| **E — Suggestions + Insights** | Headroom-aware Home, Insights charts | Track value loop | [suggestions.md](./suggestions.md), [track-insights.md](./track-insights.md) |
| **F — Monetisation + onboarding** | RevenueCat, login/OTP, address + Swiggy link | Production readiness | [revenuecat-monetisation.md](./revenuecat-monetisation.md), [onboarding-profile.md](./onboarding-profile.md) |

Kitchen extras (pantry memory, substitutions, voice pantry, batch-cook) can land anytime after phase C. See [kitchen.md](./kitchen.md).

## Feature and integration docs

| Doc | Covers |
| --- | --- |
| [voice-ordering.md](./voice-ordering.md) | LiveKit + Sarvam + OpenAI agent, disambiguation, typed = same session |
| [swiggy-mcp-food.md](./swiggy-mcp-food.md) | Food search, cart, place, status |
| [swiggy-mcp-instamart.md](./swiggy-mcp-instamart.md) | Grocery search/cart for Kitchen and routines |
| [kitchen.md](./kitchen.md) | Dish → ingredients, Need/Have, extras |
| [track.md](./track.md) | Spend + calorie ledgers, limits, Home/Cart surfaces |
| [calorie-estimation.md](./calorie-estimation.md) | Per-item calorie source for Track |
| [suggestions.md](./suggestions.md) | Home suggestion ranker + Track headroom |
| [track-insights.md](./track-insights.md) | Monthly read-only reporting |
| [reorder.md](./reorder.md) | One-tap recent order → cart |
| [routine-instamart-list.md](./routine-instamart-list.md) | Standing grocery list on restock day |
| [revenuecat-monetisation.md](./revenuecat-monetisation.md) | Free vs paid, paywall, entitlements |
| [onboarding-profile.md](./onboarding-profile.md) | OTP, Swiggy link, Profile vs Settings IA |
| [cross-cutting-states-and-rules.md](./cross-cutting-states-and-rules.md) | Product rules + empty/error states |
| [open-decisions.md](./open-decisions.md) | Product/engineering choices still open |
| [appendix-screen-map.md](./appendix-screen-map.md) | Screen ↔ feature map + dependency risks |

*Aligned to PRD v1.1 (August 2026). Update each feature doc’s “Current state” when that slice ships.*
