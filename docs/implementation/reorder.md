# Reorder

**PRD:** §3 Reorder, §8.1.

**Depends on:** [Swiggy MCP — Food](./swiggy-mcp-food.md)

## Current state

- Home recent + History cards call `router.push('/cart')` with no order id.
- Cart always rebuilds the same mock Food cart.

## Target behaviour

- One tap from a past Food order → Cart review prefilled with that order’s items (via Swiggy cart recreate or local snapshot + search remap).
- Skips voice entirely.
- Still requires Place order confirm; full price visible.

## Implementation

1. Persist minimal reorder payload per history item (`restaurantId`, line items, or prior `orderId` if MCP supports reorder).
2. `buildCartFromReorder(orderId | snapshot)` via Food MCP.
3. Navigate `/cart?source=reorder&orderId=…`.
4. If items unavailable → disambiguation or “item unavailable” on cart, not silent drop of whole order without notice.

## Acceptance checks

- Reorder never opens Voice.
- Unavailable items are visible to the user before pay.

## Open choice

MCP reorder-by-orderId vs client-side snapshot remap — see [open decisions](./open-decisions.md).
