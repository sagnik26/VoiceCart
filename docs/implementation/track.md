# Track (spend and calories)

**PRD:** §3 Track, §6.3, screens 13–14, product rules on limits.

**Depends on:** [Calorie estimation](./calorie-estimation.md), Food place-order ([Swiggy MCP — Food](./swiggy-mcp-food.md))  
**Related:** [Track insights](./track-insights.md), [Suggestions](./suggestions.md), [RevenueCat](./revenuecat-monetisation.md)

## Current state

- Home `PlanCard` — spend progress bar + **order-count** limit (v1.0 Plan model).
- Cart `PlanImpactBanner` — spend-only copy; Kitchen exclusion message exists.
- No Profile Track area, no Edit limits, no calorie figures, no ledger persistence.

## Target behaviour

- **Spend:** exact final Food order total written to ledger on successful place (not on cart browse).
- **Calories:** estimates attached at cart-build; ledger write only on place; omit items with no estimate and mark total partial.
- Limits: spend and calorie **independently optional**, week or month; **never block** ordering.
- Surfaces: Home single-line status (spend + calories, no red/gauge), Cart impact line, Track overview, Edit limits.
- Instamart excluded from both ledgers.

## Implementation

| Layer | Responsibility |
| --- | --- |
| Ledger store | Append-only entries `{ orderId, channel, spendInr, calories?, placedAt }` |
| Period engine | Resolve weekly/monthly window; sum Food-only; compare to limits |
| Limit prefs | `{ spend?: { amount, period }, calories?: { amount, period } }` — both nullable |
| UI migration | Replace `PlanCard` with Track status line; remove order-count limit; wire Profile → Track overview → Edit limits |
| Entitlement | Setting a limit requires paid entitlement (see [RevenueCat](./revenuecat-monetisation.md)); viewing ambient status may stay free or gated per product — default per PRD: limits + tuned suggestions + insights are paid |

**Migration from Plan mock**

- Delete/rename plan order-limit fields in `home-mock` / `cart-mock`.
- Rename user-facing “plan” strings to Track.
- Progress colours stay neutral even when over limit (PRD).

## Acceptance checks

- Abandoned cart does not change Track numbers.
- Over-limit user can still Place order; only suggestions may change.
- Partial calorie carts show partial language on impact line.

## Risks

- Users confusing estimates with precision — copy must say “estimate” everywhere calories appear.
- Dual-limit UX density on Home — one line, not two widgets (PRD open design question).
