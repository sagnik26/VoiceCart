# Swiggy MCP — Food

**PRD:** §10 Integrations — Food.

**Unlocks:** [Voice ordering](./voice-ordering.md), [Reorder](./reorder.md)  
**Related:** [Swiggy MCP — Instamart](./swiggy-mcp-instamart.md), [Onboarding and Profile](./onboarding-profile.md)

## Current state

- Cart and order status are hard-coded in `cart-mock.ts`.
- Place order only navigates with route params; no API.
- Swiggy “Track on Swiggy” opens a generic URL.

## Target behaviour

- Search restaurants/items for the user’s serviceable address.
- Create/update a cart; return line items, delivery, taxes, ETA.
- Place order only after explicit user tap on Cart review.
- Return order id / status for Order status screen; deep-link to Swiggy live tracking when available.
- When MCP unavailable: hide ordering entry points (PRD fallback), do not show a dead error CTA as the primary path.

## Implementation

| Concern | Approach |
| --- | --- |
| Client | Thin MCP/HTTP client with typed request/response for search, cart, place, status |
| Auth | Store Swiggy-linked session from onboarding; refresh/expiry → “account not linked” state |
| Address / pincode | Required context on every commerce call; unserviceable → dedicated empty state |
| Cart domain | Single cart model shared by Voice, Reorder (do not mix Instamart line items into Food cart without a product decision) |
| Place order | `placeOrder` only from Cart CTA; LiveKit Agent must never expose it as a tool |

**Suggested surface API (illustrative):**

```ts
searchFood(query, { addressId }): Promise<SearchHit[]>
buildCart(items, { addressId }): Promise<CartSnapshot>
placeOrder(cartId): Promise<PlacedOrder>  // user-initiated only
getOrderStatus(orderId): Promise<OrderStatus>
```

## Acceptance checks

- Full price (items + delivery + taxes) visible before Place order.
- Failed place-order shows Order status / error state, does not leave a stale “success” cart.
- Prototype can run against local/sandbox schemas; production credentials gated by Builders Club review.

## Risks

- Invite-led production access (PRD).
- Schema drift between sandbox and prod — keep client behind an adapter interface.
