# Calorie estimation source

**PRD:** §6.3 How calories are tracked, §10.

**Used by:** [Track](./track.md), Cart review impact line, [Track insights](./track-insights.md)

## Current state

- Not present. Cart items have name/price/qty only.

## Target behaviour

- At cart-build (Food), each line item → approximate calories for dish + qty.
- No match → exclude from calorie sum; UI discloses partial total.
- Never invent high-confidence numbers for unknown dishes.
- Estimates are context, not scores/streaks.

## Implementation options

| Option | Pros | Cons |
| --- | --- | --- |
| **A. Maintained lookup** (common Indian dishes/cuisines by name + serving) | Offline, predictable, cheap | Coverage gaps; curation cost |
| **B. Lightweight estimation API** (name + cuisine → range) | Broader coverage | Latency, cost, variability |
| **C. Hybrid** — lookup first, API fallback | Best coverage with cache | More moving parts |

**Recommendation:** start with **A** for v1 demo reliability; add **B** behind the same `estimateCalories(item): number | null` interface so Track UI does not care.

**Suggested interface:**

```ts
estimateLineItemCalories(item: { name: string; qty: number; cuisine?: string }): {
  kcal: number;
  confidence: 'high' | 'low';
} | null
```

Attach result onto cart line before Cart review renders Track impact. Persist kcal on ledger only after place.

## Acceptance checks

- Unknown dish → null → cart still places; impact line says partial.
- Instamart lines never call the estimator for Track (or results are discarded).

## Risks

- Uneven coverage (PRD). Do not block checkout on missing data.

See also [open decisions](./open-decisions.md) (lookup vs hybrid for v1).
