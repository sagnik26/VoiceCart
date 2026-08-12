# Routine Instamart list

**PRD:** §3 Routine Instamart list, Home components, onboarding screen 4.

**Depends on:** [Swiggy MCP — Instamart](./swiggy-mcp-instamart.md), [Onboarding and Profile](./onboarding-profile.md)  
**Related:** [Suggestions](./suggestions.md), [Track](./track.md) (excluded from Food ledgers)

## Current state

- Static Sunday grocery card on Home; no edit, no cart, no day logic.

## Target behaviour

- User defines a standing grocery list (onboarding Routine setup and/or later edit).
- On habitual restock day, Home resurfaces the list.
- CTA builds Instamart cart of those items → same review/place path.
- Does not affect Food Track ledgers.

## Implementation

| Layer | Responsibility |
| --- | --- |
| Routine model | `{ items[], cadence: weekday, label }` persisted per user |
| Home visibility | Show card when `today === cadence` (or within configurable window) |
| Cart | Instamart `buildCart(routine.items)` |
| Onboarding | Screen 4 captures first routine; skippable |

## Acceptance checks

- Non-restock days: card hidden or de-emphasised per design.
- Ordering routine does not move Food spend/calories.
