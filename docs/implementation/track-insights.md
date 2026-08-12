# Track insights

**PRD:** §3 Track insights, §8.10, screen 15. Paid via RevenueCat.

**Depends on:** [Track](./track.md) ledger, [RevenueCat](./revenuecat-monetisation.md)  
**Related:** [Calorie estimation](./calorie-estimation.md)

## Current state

- No Insights screen or charts.
- Old PRD “Analytics” tab does not exist in the new IA (lives under Profile → Track).

## Target behaviour

- Month selector; cards for spent, calories, orders, average.
- Spend-by-week and calories-by-week charts.
- Most-ordered dishes; peak ordering time.
- No scores, grades, or judgemental copy.
- Instamart reported separately (or omitted from outside-food charts), never combined into Food totals.

## Implementation

| Layer | Responsibility |
| --- | --- |
| Aggregations | Query ledger by month; bucket by week; top dishes; peak hour histogram |
| Screen | `Profile → Track → Insights` (read-only) |
| Empty | First-launch / no orders empty state (PRD §7.1) |
| Gate | Require entitlement before opening Insights or show paywall |

Prefer simple chart primitives already compatible with RN (or gluestack-friendly SVG) over a heavy dashboard kit — PRD tone is calm, not clinical.

## Acceptance checks

- Food-only series match ledger sums.
- Language stays descriptive (“most ordered”) not evaluative (“unhealthy week”).
