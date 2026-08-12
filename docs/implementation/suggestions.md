# Suggestions

**PRD:** §3 Suggestions, §6.3, §8.1 Home.

**Depends on:** [Track](./track.md) (headroom), order history  
**Related:** [Kitchen](./kitchen.md) (cook-vs-order), [Routine Instamart list](./routine-instamart-list.md), [RevenueCat](./revenuecat-monetisation.md)

## Current state

- Static `HOME_SUGGESTED_MEAL` with a fixed reason string.
- Reorder CTA goes to mock cart.
- Not driven by history, time, or Track headroom.

## Target behaviour

- Rank candidates from order history + time-of-day + day-of-week.
- If calorie headroom low → prefer lighter / smaller.
- If spend headroom low → prefer routine Instamart or Kitchen prompt over restaurant.
- If both healthy → frequency / time patterns.
- One short reason line on the card.
- Paid: suggestions **tuned to limits** (PRD monetisation); untuned recent-based suggestions may remain free — confirm in [open decisions](./open-decisions.md).

## Implementation

| Layer | Responsibility |
| --- | --- |
| Signals | Recent orders, hour, weekday, remaining spend/calorie headroom, Kitchen usage frequency |
| Ranker | Pure function over signals → `{ type: 'food' \| 'kitchen' \| 'routine', payload, reason }` |
| Home | Render one primary suggestion card; optional secondary routine card when relevant |

Keep ranker testable without UI. Start rule-based; avoid ML dependency for v1.

## Acceptance checks

- Low spend headroom surfaces Kitchen or routine more often than rich thalis (given fixtures).
- Reason is one short line, not a paragraph.
