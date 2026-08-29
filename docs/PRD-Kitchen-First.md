**PRODUCT REQUIREMENTS DOCUMENT**

**Kitchen First**

Cook-or-order decision app, built on Swiggy Builders Club MCP. India only.

| Field | Value |
| --- | --- |
| Version | v1.0 |
| Date | August 2026 |
| Platform | iOS and Android, mobile only |
| Market | India, Instamart and Swiggy Food serviceable pincodes |
| Integrations | Swiggy Builders Club MCP (Food, Instamart), LiveKit (WebRTC + Agents), Sarvam AI (STT/TTS), OpenAI (LLM) |
| Purpose of this doc | Design input — upload to an AI design tool or hand to a designer |

# Contents

1. Overview and problem
2. Users and assumptions
3. Features
4. Information architecture
5. Product rules
6. Core flows
7. Screen inventory and estimates
8. Screen specifications
9. Visual direction
10. Integrations and dependencies
11. Monetisation
12. How to use this document for design

# 1. Overview and problem

## 1.1 The problem

Ordering food is fast but expensive and calorie-heavy. Cooking is cheaper and lighter but has real friction: deciding what to make, figuring out what's missing from the kitchen, and getting those one or two items before the moment passes. Most people default to ordering not because they prefer it, but because it's the path of least resistance in the moment they're deciding.

Nothing today puts the two options side by side, at the point of decision, with real numbers — what this dish costs to cook versus what it costs to order, right now, for this meal. Recipe-to-grocery-list apps exist, but they assume a planned shop, not "I'm deciding what to eat in the next ten minutes." Quick commerce solved the speed problem for groceries; nothing has connected that speed to the cook-versus-order decision itself.

## 1.2 The solution

An app built around one question: what do you want to eat? The user describes a dish, or describes what's already in their kitchen, and the app shows both paths — cook it, with a scaled ingredient list and only the missing items carted through Instamart, or order it, with a matched dish from a nearby restaurant through Swiggy Food — each with its real cost and a rough calorie comparison, side by side.

Cooking is the flagship path and gets the deepest design attention: pantry memory so staples are never re-asked, a reverse mode that suggests dishes from what's already on hand, and substitution handling when an ingredient is out of stock. Ordering stays a first-class, fully functional path — not a redirect to another app — but deliberately lean, since it isn't where this app's value is added.

## 1.3 Success criteria for v1

| Metric | Target |
| --- | --- |
| Dish request to ingredient cart, median time | Under 25 seconds |
| Ingredient list accuracy before edits | 80 percent of items correct on first parse |
| Cook-path share of completed orders | Over 50 percent |
| Reverse mode ("what can I cook") usage among active users | 30 percent within first two weeks |
| Decide screen shown before checkout | Over 70 percent of orders |

# 2. Users and assumptions

Primary user is a Tier-1 Indian city resident aged 22 to 38, cooks some days and orders on others, already has a Swiggy account, and is comfortable speaking Hinglish to a phone. They aren't a dedicated home cook — they're someone deciding, meal by meal, which is worth the effort today.

Assumptions carried into this design:

- The user has an existing Swiggy account and a serviceable address for both Food and Instamart.
- Speech in mixed Hindi and English is the default input, not an edge case.
- The user is often deciding in a shared or public space, so typing must remain available.
- The user does not want recipe instructions from this app — only what to buy, not how to cook it.
- Cost and calorie figures are decision aids, not tracking — the app does not maintain a running ledger across time.

# 3. Features

| Feature | What it does |
| --- | --- |
| Kitchen (flagship) | Turns a described dish, or a described pantry, into a scaled ingredient list or dish suggestions. Carts only what's missing via Instamart. |
| Reverse mode | User describes what they already have; the app suggests dishes ranked by fewest missing ingredients. |
| Pantry memory | Staples the user consistently marks as "have" are remembered and pre-marked in future ingredient lists. |
| Decide | Shows cook-it versus order-it side by side for a described dish — real cost, rough calories, time — before the user commits to either. |
| Order | Full Swiggy Food ordering: search, menu, cart, checkout — the companion path when cooking isn't the right call. |
| Substitution | If an ingredient is unavailable on Instamart for the user's pincode, a like-for-like substitute is offered rather than silently dropping the item. |
| Order history | A single combined history of cooked and ordered meals, with one-tap recook or reorder. |
| Voice capture | Shared voice input used from Home, Kitchen and Order — understands mixed Hindi/English, resolves ambiguity by asking. |

# 4. Information architecture

Four bottom tabs, plus a Profile entry point. Kitchen is the tab with the most depth; Order stays deliberately lean. Both converge on the Decide screen from Home, and both converge on a shared cart-review pattern, backed by different Swiggy MCP servers underneath.

| Destination | Owns |
| --- | --- |
| Home | "What do you want to eat" prompt, Decide hand-off, recent activity (cooked + ordered), pantry status |
| Kitchen | Dish description, reverse mode, ingredient selection, pantry manager, batch planning |
| Order | Restaurant search, menu, food cart |
| Profile | Account, address, Swiggy link, diet preference, pantry manager entry, settings |

Home, Kitchen and Order all reach a single cart review and place-order action — the screen is the same pattern whether the cart was built by Instamart or Food MCP, only the contents and the server differ. Instamart and Food carts are never merged: the two MCP servers don't share a cart or session, so a cooking cart and an ordering cart are always separate transactions even when the Decide screen presents them as one choice.

# 5. Product rules

Binding constraints on every screen and flow.

| Rule | Reason |
| --- | --- |
| The agent never places an order, on either path. It builds carts; the user taps Place order. | Real money, irreversible, regardless of which MCP server built the cart. |
| Full price, including delivery and taxes, is visible before the confirm tap. | Voice interfaces hide cost by nature. Nothing is spent unseen. |
| The Decide screen never recommends one path over the other. | The app's job is to make the trade-off visible, not to make the choice feel judged. |
| Cost and calorie comparisons are estimates shown as context, never as a score or a streak. | This is a decision aid at the point of choice, not a tracker — trust depends on it staying descriptive, not evaluative. |
| Ambiguous requests trigger a spoken choice, never a silent pick. | Guessing wrong on a cart the user didn't review reads as reckless. |
| Typed input reaches the same parser as voice. | Public spaces, noise, late nights, accessibility. |
| Kitchen never shows recipe instructions — ingredients and quantities only. | Keeps scope disciplined and avoids reproducing others' recipe content. |
| If an ingredient is unavailable, the cart proceeds with a substitute or a clear partial note — never a silent drop. | An incomplete cart the user didn't know about undermines the whole comparison. |

# 6. Core flows

## 6.1 Kitchen — dish to cart

1. User opens Kitchen and describes a dish, by voice or text, including servings if relevant.
2. The agent returns a scaled ingredient list. Staples the user has previously marked "have" open pre-unchecked.
3. User toggles anything else they already have; everything else defaults to Need.
4. Add to cart routes into Instamart cart review. Unavailable items are substituted, not dropped.
5. User taps Place order. Order status replaces the cart.

## 6.2 Reverse mode — pantry to dish

1. User says or types what they currently have, as a single utterance ("I have rice, dal and onions").
2. The agent returns 2–3 dish suggestions, ranked by fewest missing ingredients.
3. Selecting a suggestion opens the same ingredient list and cart flow as 6.1, pre-filtered by what was just stated.

## 6.3 Decide — cook versus order

1. From Home, the user describes what they want to eat, without specifying cook or order.
2. The app resolves a matching dish on both sides: an ingredient list and cost via Instamart, and a matching restaurant dish and price via Food search.
3. Both are shown side by side — cost, rough calories, and time to ready — with no default selection and no recommended choice.
4. The user picks either path; each routes into its own cart review and checkout, backed by the respective MCP server.

## 6.4 Order — Swiggy Food

1. User searches or browses restaurants and dishes, or arrives here directly from Decide.
2. Menu, cart, and checkout follow Swiggy's own cart and pricing exactly — this app adds no markup or separate pricing logic.
3. Order status is shown in-app with a deep link to Swiggy for live tracking.

## 6.5 Shared — voice capture

A single voice-capture pattern is reused from Home, Kitchen and Order rather than built three times. It opens already listening, shows a live transcript, and surfaces recognised items as chips as they're understood. Typed input is always available from the same screen.

# 7. Screen inventory and estimates

19 screens across four bottom-tab flows (Home, Kitchen, Order, Profile), plus onboarding and two shared screens. Complexity is a design estimate: S is a simple list or form, M has custom components or multiple states, L is bespoke interaction design.

| # | Screen | Group | Priority | Complexity |
| --- | --- | --- | --- | --- |
| 1 | Login (phone/OTP) | Onboarding | P0 | S |
| 2 | Address & Swiggy link | Onboarding | P0 | M |
| 3 | Pantry & diet setup | Onboarding | P1 | M |
| 4 | Home | Home | P0 | L |
| 5 | Decide (cook vs order) | Home | P0 | L |
| 6 | Kitchen home | Kitchen | P0 | S |
| 7 | Ingredient list | Kitchen | P0 | M |
| 8 | Reverse mode | Kitchen | P0 | M |
| 9 | Ingredient selection (Have/Need) | Kitchen | P0 | M |
| 10 | Pantry manager | Kitchen | P1 | S |
| 11 | Instamart cart review | Kitchen | P0 | M |
| 12 | Kitchen order status | Kitchen | P0 | M |
| 13 | Restaurant search | Order | P0 | M |
| 14 | Restaurant menu | Order | P0 | M |
| 15 | Food cart review | Order | P0 | M |
| 16 | Food order status | Order | P0 | M |
| 17 | Order history | Shared | P1 | S |
| 18 | Voice capture (overlay) | Shared | P0 | L |
| 19 | Profile home | Profile | P0 | S |
| 20 | Settings | Profile | P2 | S |

# 8. Screen specifications

## 8.1 Home

**Purpose:** Orient the user and offer a fast path into deciding what to eat.

**Components:** Greeting; single prompt "What do you want to eat?" with mic; a featured cook-vs-order suggestion card; recent activity list mixing cooked and ordered meals; pantry status chips; bottom navigation.

**Design notes:** The suggestion card is the doorway into Decide, not a separate feature — tapping it opens the comparison, not a cart directly.

## 8.2 Decide

**Purpose:** Make the cook-versus-order trade-off visible for one dish, without pushing either choice.

**Components:** Dish name and servings; two side-by-side cards (Cook it / Order it), each with cost, rough calories, and time; a CTA per card routing into that path's cart flow.

**Design notes:** Neither card is visually dominant. No colour-coding implies one option is "better." Calorie figures are labelled as rough estimates.

## 8.3 Kitchen home

**Purpose:** Entry point for describing a dish or a pantry.

**Components:** Mode toggle ("I want to cook…" / "What can I make?"); input field with mic; recent dish chips; batch planning entry.

**Design notes:** Mode toggle defaults to whichever the user used last session.

## 8.4 Ingredient list

**Purpose:** Show the scaled ingredient list for a described dish.

**Components:** Dish name with serving stepper; ingredient rows with quantity; "Mark what you have" CTA.

**Design notes:** Serving size is parsed from the description when stated, not asked as a separate field.

## 8.5 Reverse mode

**Purpose:** Suggest dishes from what the user already has.

**Components:** Stated pantry items as chips; 2–3 dish suggestion cards, each showing missing-item count; sort note.

**Design notes:** Ranked by fewest missing ingredients, not by popularity — this is the whole value of the screen.

## 8.6 Ingredient selection

**Purpose:** Let the user mark what they have and cart the rest.

**Components:** Dish name with serving count; ingredient rows with Need/Have toggle; running count on the CTA button.

**Design notes:** Staples previously marked "have" open pre-toggled. Toggling is a single tap on the row.

## 8.7 Pantry manager

**Purpose:** Let the user view and edit remembered staples.

**Components:** Staple list with toggles; add-staple input; "running low" chip row.

**Design notes:** This is what powers pre-toggled staples everywhere else — it should feel like light housekeeping, not a form.

## 8.8 Instamart cart review

**Purpose:** Show exactly what will be bought to complete the dish, and what it costs.

**Components:** Line items with quantity and price; substitution notes where relevant; total; Place order button.

**Design notes:** Substituted items are called out inline, never silently swapped without a note.

## 8.9 Restaurant search

**Purpose:** Let the user browse or search restaurants directly, or land here from Decide.

**Components:** Search bar with mic; filter chips (price, rating, veg, time); restaurant result cards.

**Design notes:** Kept deliberately close to a standard browse pattern — this path isn't where the app differentiates.

## 8.10 Food cart review

**Purpose:** Show the food order total, matching Swiggy's own pricing exactly.

**Components:** Restaurant name; line items; item total, delivery and taxes, total to pay; a one-line note on the equivalent cook-it cost; Place order button.

**Design notes:** The cook-it cost note is informational only, shown once, never repeated as a nudge.

## 8.11 Order status

**Purpose:** Confirm the order was placed and show progress, for either path.

**Components:** Confirmation header with ETA; source (Instamart or restaurant) and total; stepper; deep link to Swiggy for live tracking.

**Design notes:** Same component shape for both cook and order paths — only the stepper labels and source differ.

## 8.12 Voice capture (overlay)

**Purpose:** Capture a spoken request and show what's been understood, from any of the three tabs it's launched from.

**Components:** Listening header with cancel; live transcript; recognised items as chips; keyboard toggle; continue action.

**Design notes:** Opens already listening. Chips appear as items are recognised, not at the end.

## 8.13 Order history

**Purpose:** One combined record of cooked and ordered meals.

**Components:** Filter chips (All / Cooked / Ordered); list of past meals; recook or reorder action per row.

**Design notes:** Cooked and ordered entries share the same row style — the history shouldn't read as two separate logs.

## 8.14 Profile home

**Purpose:** One place for account, preferences and pantry management.

**Components:** Account summary; Swiggy link status; address; diet preference; pantry manager entry; settings.

**Design notes:** Pantry manager is surfaced here as well as inside Kitchen, since it's referenced from both contexts.

# 9. Visual direction

Starting tokens, offered as a baseline rather than a finished system.

| Token | Value | Used for |
| --- | --- | --- |
| Primary | #C9603A warm terracotta | Kitchen action, primary buttons, brand |
| Positive | #1D9E75 green | Have toggles, confirmed states |
| Neutral accent | #7C63C4 violet | Order-path accents, secondary cards |
| Ink | #2A2724 | Primary text |
| Muted | #6B655C | Secondary text, labels |
| Surface | #FFFFFF on #FAF9F6 | Cards on page background |
| Border | #C9C3B8 | Card outlines, dividers |
| Radius | 8 px cards, 22 px buttons and pills | All containers |
| Touch target | Minimum 44 px | All interactive rows and toggles |

**Tone:** practical and unhurried, not gamified. The Decide screen especially should feel like a fair comparison, not a nudge toward either choice — avoid loaded colour (no red/green scoring) and avoid framing either card as a "win."

# 10. Integrations and dependencies

| Dependency | Used for | Risk |
| --- | --- | --- |
| Swiggy Builders Club MCP — Instamart | Product search, cart, checkout, tracking for Kitchen | Production access is invite-led; free to prototype locally, review required for production credentials. Limited to serviceable pincodes. |
| Swiggy Builders Club MCP — Food | Restaurant/menu search, cart, order placement and tracking for Order and the Decide comparison | Same review gate as above. Food and Instamart carts never share a session. |
| LiveKit | Real-time WebRTC transport and Agents framework for voice capture | Cloud or self-host ops; React Native needs a custom native build. |
| Sarvam AI | Streaming STT (with VAD/turn detection) and TTS via LiveKit plugins, tuned for Indian languages | Production-grade at scale; residual risk is end-to-end latency. |
| OpenAI | Streaming LLM inside the LiveKit Agent session — dish understanding, clarification, tool calls | Tool-calling must never place orders on either MCP server — only build carts for user confirm. |
| Calorie estimation source | Rough per-dish calorie figures for the Decide comparison | Coverage is uneven. Decide must degrade gracefully — show cost only if no calorie estimate exists, rather than blocking. |

**Design implication:** every screen that depends on Swiggy access needs a defined empty or degraded state. Kitchen's fallback when Instamart is unavailable is a copyable ingredient list; Order's fallback when Food is unavailable is hiding the entry point rather than showing an error.

# 11. Monetisation

v1 is free across both paths — Kitchen and Order, including reverse mode, pantry memory and Decide.

No ledger, limits, or subscription tier in v1 — the app's value is the point-of-decision comparison, not ongoing tracking, so there's no natural paywall moment yet.

Future monetisation candidates worth testing post-launch: batch/weekly planning as a premium feature, or a small affiliate margin on Instamart baskets — neither is committed for v1.

# 12. How to use this document for design

The screen specifications in section 8 are structural: they fix layout hierarchy, component order and what appears on each screen. They do not fix visual style, illustration, iconography or motion, all of which are open.

## Suggested prompt when handing this document to an AI design tool

Using the attached PRD, design high-fidelity mobile screens for this app. Follow the screen specifications in section 8 for layout and content, and the tokens in section 9 as a starting point. Design for a 390 by 844 viewport. Produce the P0 screens first: Home, Decide, Kitchen home, Ingredient list, Ingredient selection, Instamart cart review, Restaurant search, Food cart review, and Order status. Keep the Decide screen visually neutral between its two cards — this is the one screen where the design must not imply a recommendation.

## Open questions a designer should push on

- How the Decide screen stays genuinely neutral in layout, not just in colour — does card order (cook first vs order first) itself imply a bias?
- What the listening state looks like when it's genuinely delightful rather than a generic waveform.
- How reverse-mode suggestions are ranked visually — does "fewest missing ingredients" need a visible number, or does it stay implicit in ordering?
- How cooked and ordered entries share one history without either feeling like the "default" or "fallback" option.
- Whether the Order tab needs any visual distinction at all from a standard food-delivery browse pattern, or whether sameness is actually the right call.
