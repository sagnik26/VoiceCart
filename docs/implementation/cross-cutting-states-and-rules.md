# Cross-cutting states and product rules

**PRD:** §5 Product rules, §7.1 States.

Applies to every ordering and Track surface. Enforce in code, not only copy.

## Product rules

| Rule | Enforcement |
| --- | --- |
| Agent never places order | LiveKit Agent has no `placeOrder` tool; only Cart screen calls Food/Instamart place |
| Full price before confirm | Cart totals block required; Place order disabled until totals loaded |
| Ambiguity → spoken/UI choice | Multi-match → agent TTS clarification **and** Disambiguation screen (≤3 options) |
| Limits inform, never block | No `if overLimit return` on placeOrder |
| Calories are estimates | UI strings + no gamification components |
| Typed = voice pipeline | Keyboard text injected into the same LiveKit `AgentSession` as spoken turns |
| Instamart ≠ Track Food | Ledger filter on `channel` |

## States to implement

| State | Surfaces |
| --- | --- |
| First launch, nothing ordered | Home, Track overview, Insights |
| Mic permission denied | Voice, Kitchen |
| Speech not understood | Voice |
| No matching restaurant/item | Cart, Kitchen |
| No calorie estimate for item | Cart impact, Insights |
| Pincode not serviceable | Onboarding, Home, Cart |
| Swiggy not linked / expired | All ordering surfaces (prefer hide entry points) |
| Offline | Global banner or per-screen |
| Order failed after confirm | Order status |

Implement as reusable empty/error components + feature flags for “commerce available”.
