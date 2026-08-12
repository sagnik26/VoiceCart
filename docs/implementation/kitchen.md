# Kitchen

**PRD:** §3 Kitchen, §6.2, screens 10–11. Extras listed under §6.2.

**Depends on:** [Swiggy MCP — Instamart](./swiggy-mcp-instamart.md)  
**Related:** [Voice ordering](./voice-ordering.md) (shared LiveKit / Sarvam path), [Suggestions](./suggestions.md) (cook-vs-order nudge), [`../voice-app-architecture.md`](../voice-app-architecture.md)

## Current state

- Dish description + recent chips + Get ingredients (`kitchen.tsx`).
- Ingredient selection with Need/Have (`ingredients.tsx`); defaults all Need.
- Mic button is visual-only.
- No pantry memory, substitutions, serving parse beyond mock, or batch-cook.

## Target behaviour (core)

1. Free-form dish (+ serving size in text) → scaled ingredient list.
2. Defaults Need; user toggles Have; CTA shows count.
3. Add to cart → Instamart cart review.

## Target behaviour (extras — recommended after core)

| Extra | Behaviour |
| --- | --- |
| Pantry memory | Staples often marked Have open pre-unchecked next time |
| Substitution | Unavailable SKU → like-for-like offer, not silent drop |
| Voice-first pantry | “I already have rice and onions” pre-filters Need |
| Cook-vs-order nudge | Home suggestions can push Kitchen when Track headroom is low |
| Batch-cook framing | Optional scale for multi-day; still ingredients-only (no recipes) |

## Implementation

| Layer | Responsibility |
| --- | --- |
| Dish → ingredients | LLM or rule/table service: dish + servings → ingredient list with quantities |
| Selection UI | Keep row tap toggle; persist pantry prefs locally (encrypted storage if PII-adjacent) |
| Speech | Reuse LiveKit RN client + agent (or a Kitchen-scoped agent session) for mic / levels / STT; optional second pass for “what I have”; full ordering TTS loop not required for dish capture |
| Cart handoff | Call Instamart buildCart with Need items only |

## Acceptance checks

- Serving size parsed from “dal for 4” without a separate form field.
- Empty Need list disables Add to cart.
- Pantry memory (when shipped) does not require network.

## Risks

- Ingredient quality without a recipe product promise — stay ingredients-only.
- Over-building extras before Instamart cart works.
