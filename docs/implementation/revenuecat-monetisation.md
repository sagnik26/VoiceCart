# RevenueCat / monetisation

**PRD:** §11 Monetisation, screen 18 Paywall, §10.

**Gates:** [Track](./track.md) limits, [Track insights](./track-insights.md), tuned [Suggestions](./suggestions.md)

## Current state

- No RevenueCat (or StoreKit/Play Billing) dependency.
- No paywall screen.
- Track/Insights/limit-setting ungated (and mostly unbuilt).

## Target behaviour

| Free (unlimited) | Paid |
| --- | --- |
| Voice ordering, Kitchen, reorder, order status | Track limits (spend + calorie), suggestions tuned to those limits, Track insights |

- Paywall appears on **first attempt to set a limit** in Track, not during onboarding.
- Entitlement via RevenueCat.

## Implementation

| Layer | Responsibility |
| --- | --- |
| SDK | `react-native-purchases` (RevenueCat); configure API keys via env, never commit secrets |
| Entitlement ids | e.g. `track_pro` — maps to limits + insights + tuned suggestions |
| Paywall UI | Screen 18; offerings from RevenueCat; restore purchases |
| Gate points | Edit limits save; Insights entry; optionally ranker “tuned” path |
| Dev | Sandbox Store accounts; mock entitlement flag for Expo Go / CI |

## Acceptance checks

- Free user can complete voice order end-to-end.
- Free user opening Edit limits sees paywall before limits persist.
- Restore purchases re-enables Track without re-buy.

## Risks

- Expo / store setup (IAP capability, app store agreements).
- Clarifying whether ambient Home Track **readout** is free while **setting limits** is paid (PRD implies limits are paid; status line may need a product call — see [open decisions](./open-decisions.md)).
