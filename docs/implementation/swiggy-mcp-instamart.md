# Swiggy MCP — Instamart

**PRD:** §10, Kitchen + Routine list.

**Unlocks:** [Kitchen](./kitchen.md), [Routine Instamart list](./routine-instamart-list.md)  
**Related:** [Swiggy MCP — Food](./swiggy-mcp-food.md), [Track](./track.md)

## Current state

- Kitchen cart is mock Instamart line items derived from `kitchen-mock` ingredients.
- Routine grocery card on Home is display-only (no cart action).

## Target behaviour

- Resolve ingredient names / grocery SKUs for user’s pincode.
- Build Instamart cart of **Need** items only.
- Same Cart review + Place order path as Food (source flag `kitchen` / `instamart`).
- Instamart totals never write to outside-food spend or calorie ledgers.

## Implementation

| Concern | Approach |
| --- | --- |
| Client | Parallel MCP client for Instamart search + cart + place |
| Mapping | Ingredient name + qty → SKU match; confidence threshold → substitution or omit |
| Fallback when MCP down | Kitchen shows copyable ingredient list (PRD); hide “Add to cart” |
| Ledger | Tag orders `channel: instamart`; Track ignores them |

## Acceptance checks

- Kitchen “Add N items” creates Instamart cart matching Need toggles.
- Placing Instamart order does not change Home Track spend/calorie numbers.

## Risks

- Same review gate as Food MCP; pincode serviceability stricter for Instamart.
- Name→SKU matching quality; plan for substitution (see [Kitchen](./kitchen.md) extras).
