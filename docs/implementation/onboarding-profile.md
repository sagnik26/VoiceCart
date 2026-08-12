# Onboarding and Profile IA

**PRD:** screens 1–4, 12, 17; IA §4.

**Related:** [Swiggy MCP — Food](./swiggy-mcp-food.md) (account link), [Routine Instamart list](./routine-instamart-list.md), [Track](./track.md), [RevenueCat](./revenuecat-monetisation.md)

## Current state

- No auth/OTP, address link, food prefs, or routine setup screens.
- Avatar opens **Settings**, not **Profile home** with Track entry card.
- Settings mixes account admin with what PRD splits into Profile vs Settings.

## Target behaviour

**Onboarding (ordered):**

1. Phone login + OTP  
2. Address + Swiggy account link  
3. Food preferences (P1)  
4. Routine setup (P1)

**Profile (top right):** account summary, Track entry card (same status line as Home), diet preference, address, settings row, paywall entry.

**Settings (P2):** secondary prefs (notifications, voice language, help, log out) — reachable from Profile.

## Implementation

| Work | Notes |
| --- | --- |
| Auth | OTP provider TBD (Firebase Auth, MSG91, etc.) — out of Swiggy MCP; store session securely |
| Swiggy link | Part of Food MCP onboarding; handle expired link globally |
| Navigation | Avatar → `/profile`; Settings nested; Track stack under Profile |
| Diet preference | Stored for suggestions + Track overview card |

## Acceptance checks

- Cold start without session cannot reach Place order.
- Unserviceable pincode shows dedicated state before Home looks “broken”.

## Open choice

OTP / auth vendor for India phone login — see [open decisions](./open-decisions.md).
