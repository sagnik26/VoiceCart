**PRODUCT REQUIREMENTS DOCUMENT**

**Voice-First Food Ordering App**

Ordering food and groceries by talking, built on Swiggy Builders Club MCP. India only.

| Field | Value |
| --- | --- |
| Version | v1.1 |
| Date | August 2026 |
| Platform | iOS and Android, mobile only |
| Market | India, Instamart and Swiggy Food serviceable pincodes |
| Integrations | Swiggy Builders Club MCP (Food, Instamart), Sarvam AI (speech), RevenueCat |
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

*Figures 1 to 5 appear in sections 4 and 6.*

# 1. Overview and problem

## 1.1 The problem

Ordering food on existing apps takes 15 to 30 taps across search, filters, menu browsing, customisation and checkout. Most orders are repeat orders or simple requests the user could state in a single sentence. The tapping is overhead, not decision-making.

Separately, people who order frequently have no lightweight way to keep it in check, on either money or health. Existing tools are either full diet trackers or full budgeting apps — both too heavy for someone who just wants a sense of where they stand — or nothing at all. Spend and calories from delivery food are really one behaviour, outside-food consumption, viewed through two lenses, and nothing currently tracks both together without manual logging.

## 1.2 The solution

A voice agent that takes a spoken request in Hindi, English, or a mix of both, builds a cart through Swiggy's commerce infrastructure, and hands it to the user for a single confirming tap. That collapses the 15–30 tap flow into one sentence and one tap.

Sitting on top of ordering, a tracking layer infers spend and calorie impact automatically from orders placed — no manual logging — and feeds that back into what the app suggests next. A Kitchen flow gives the same one-sentence simplicity to cooking: describe a dish, get a cart of only what's missing from the kitchen.

## 1.3 Success criteria for v1

| Metric | Target |
| --- | --- |
| Voice request to cart, median time | Under 20 seconds |
| Cart accuracy before edits | 80 percent of items correct on first parse |
| Orders placed by voice vs manual | Over 60 percent by voice |
| Users setting a Track limit | 35 percent within first week |
| Kitchen carts converting to orders | 25 percent |

# 2. Users and assumptions

Primary user is a Tier-1 Indian city resident aged 22 to 38, ordering food 4 or more times a week, already using Swiggy, comfortable speaking Hinglish to a phone.

Assumptions carried into this design:

- The user has an existing Swiggy account and a serviceable address.
- Speech in mixed Hindi and English is the default input, not an edge case.
- The user is often ordering in a shared or public space, so typing must remain available.
- Instamart orders are groceries and are excluded from outside-food spend and calorie tracking.

# 3. Features

| Feature | What it does |
| --- | --- |
| Voice ordering | Understands a spoken or typed request, builds a cart through Swiggy MCP, resolves ambiguity by asking, hands off to a single confirm tap. |
| Kitchen | Turns a described dish into a scaled ingredient list, lets the user mark what they already have, and carts only what's missing via Instamart. |
| Track | Automatically infers spend and calorie impact from placed orders against limits the user sets, with no manual logging. |
| Suggestions | Uses order history, time of day, day of week, and Track headroom to surface what to order or whether to cook instead, on Home. |
| Track insights | Read-only reporting on spend, calories, order frequency, and patterns over a selected month. |
| Reorder | One tap from a recent order straight to cart review, skipping voice entirely. |
| Routine Instamart list | A standing grocery list resurfaced on the day the user habitually restocks. |

# 4. Information architecture

Three bottom tabs, plus a Profile entry point in the top right. Cart review, order status, and Track are reached from context or from Profile rather than living in the bottom bar, so the bar stays limited to the ordering loop.

| Destination | Owns |
| --- | --- |
| Home | Track status line, today's suggestions, routine Instamart list, recent orders |
| Talk | Voice capture, disambiguation, handoff to cart |
| Kitchen | Dish description, ingredient list, missing-item selection |
| Profile (top right) | Account, address, Swiggy link, diet preference, settings, paywall entry, and the Track sub-area |

Track, reached from Profile:

| Track sub-screen | Owns |
| --- | --- |
| Track overview | Spend limit and calorie limit, progress against both, days remaining |
| Edit limits | Set or change spend limit, calorie limit, and period, independently |
| Insights | Spend and calorie history by week, most-ordered dishes, peak ordering time |

Home, Talk and Kitchen all converge on a single cart, a single review screen, and a single place-order action.

![](./assets/PRD-Voice-Food-Ordering-App/6047776a67272023d2888e01308e2020446b1b79.png)

*Figure 1 — Three entry points, one order path*

# 5. Product rules

Binding constraints on every screen and flow.

| Rule | Reason |
| --- | --- |
| The agent never places an order. It builds carts; the user taps Place order. | Real money, irreversible. One misheard confirmation loses the user permanently. |
| Full price, including delivery and taxes, is visible before the confirm tap. | Voice interfaces hide cost by nature. Nothing is spent unseen. |
| Ambiguous requests trigger a spoken choice, never a silent pick. | Picking one of twelve biryanis at four price points reads as reckless. |
| Track limits — spend or calorie — inform, never block. | A limit that blocks dinner gets the app uninstalled, whether it's money or calories being limited. |
| Calorie figures are estimates shown as context, never as a score, streak, or judgement. | Tracking has to stay trustworthy, not feel punitive. |
| Typed input reaches the same parser as voice. | Public spaces, noise, late nights, accessibility. |
| Instamart orders never count toward outside-food spend or calorie limits. | Groceries are not the behaviour being moderated. |

# 6. Core flows

## 6.1 Voice ordering

- User taps the center circle. Voice screen opens listening immediately, no intro screen.
- User speaks. Live transcript renders as they talk; recognised items appear as chips below it.
- If a request is ambiguous, the agent asks one clarifying question with two or three named options.
- User taps Show cart, or the agent offers it once a complete request is understood.
- Cart review shows restaurant, line items with quantity, price breakdown, and Track impact.
- User taps Place order. Order status screen replaces the cart.

![](./assets/PRD-Voice-Food-Ordering-App/7c766ad5f045733722d4637a618694033f296adb.png)

*Figure 2 — Voice capture and cart review*

## 6.2 Kitchen

- User describes the dish by voice or text, including serving size if relevant.
- The agent returns an ingredient list scaled to servings.
- Every ingredient defaults to Need. The user unchecks what they already have.
- Add to cart routes into the same cart review and place-order flow as voice.

**Additions worth considering for this flow:**

- **Pantry memory.** Staples the user consistently marks as Have (salt, oil, onions, ginger-garlic paste) get remembered across sessions, so the ingredient list opens with those already unchecked instead of making the user repeat the same taps every time.
- **Substitution on unavailability.** If an ingredient isn't stocked on Instamart for the user's pincode, offer a like-for-like substitute rather than silently dropping the item or leaving the cart incomplete.
- **Voice-first pantry check.** Let the user say what they already have as part of the same utterance ("I want to make dal, I already have rice and onions") so the ingredient list opens pre-filtered instead of requiring a second pass of toggling.
- **Cook-vs-order nudge from Home.** If Track shows the user is closer to their spend or calorie limit than usual, and Kitchen is used semi-regularly, Home's suggestion engine can surface a Kitchen prompt instead of a restaurant suggestion on days that fit the user's pattern. This is the clearest point of contact between Kitchen and Track — see section 6.3.
- **Batch-cook framing.** Optionally let the user scale a dish up for two days instead of one serving-size prompt, since cooking once to eat twice is a realistic way this flow reduces order frequency. No recipe instructions either way — Kitchen stays ingredients-only.

![](./assets/PRD-Voice-Food-Ordering-App/21044644f373aa1ccd021700024f94ca80f7a08e.png)

*Figure 3 — Kitchen dish description and ingredient selection*

## 6.3 Track and suggestions — system design

Track's job is to answer "where do I stand" without ever asking the user to log anything. Everything it shows is inferred from orders that already happened.

**What is tracked**

- **Spend** — the total value of orders placed through Swiggy Food (delivery orders only). Instamart orders are excluded entirely, since groceries are not the behaviour being moderated.
- **Calories** — an estimated calorie value attributed to each delivered order, summed over the tracking period.

**How spend is tracked**

Spend is exact, not estimated. Every placed order returns a final price from Swiggy MCP at checkout; that figure is written to the user's spend ledger the moment the order is confirmed. No parsing or inference needed — this is the easy half of Track.

**How calories are tracked**

Calories are inferred, not logged, and that inference needs an explicit source since Swiggy MCP item data does not reliably carry calorie information:

- At cart-build time, each line item (dish + quantity) is matched against a calorie-estimation source — either a maintained lookup table of common Indian dishes and cuisines by name and serving size, or a lightweight estimation call that maps dish name and cuisine to an approximate calorie range.
- The estimate attaches to the cart before Place order, so it can appear on cart review (section 5), and gets written to the calorie ledger only once the order is actually placed — not at cart-build time, so a browsed-and-abandoned cart doesn't pollute the numbers.
- Where no reliable estimate exists for an item, that item is left out of the calorie total rather than guessed at, and the cart proceeds normally. The Track impact line should make clear the total is partial when this happens, rather than presenting an incomplete number as complete.
- Because this is inference from what was ordered, not what was eaten, it will not be exact — sauces, sides, and how much of a shared order one person ate all introduce error. This needs to be communicated as a rough estimate, not a precise count, in every surface that shows it (cart review, Home, Track overview, Track insights).

**How this relates to ordering**

- **Cart review** shows the marginal impact of the current cart — spend and calories this order adds — against the remaining Track headroom for the period, as one informational line. Never a warning, never blocking (section 5).
- **Home** shows a single ambient status line summarising both numbers for the current period, so the user sees where they stand without opening Track at all.
- **Suggestions** on Home are shaped by remaining headroom on both dimensions plus order history: if calorie headroom is low, lighter dishes or smaller portions get weighted higher in what's suggested; if spend headroom is low, the routine Instamart list or a Kitchen prompt can surface instead of a restaurant suggestion; if both are healthy, suggestions default to frequency and time-of-day patterns as today.
- **Track overview and insights** are the only places the full numbers live permanently — weekly or monthly progress against each limit, and historical breakdown by week, most-ordered dishes, and peak ordering time.

**Limits**

- Spend limit and calorie limit are independently optional — a user can track just one, both, or neither.
- Both are set per week or per month, from Edit limits.
- Neither limit blocks or gates ordering at any point. Going over either limit changes nothing about the ordering flow; it only changes what Home chooses to suggest next.

![](./assets/PRD-Voice-Food-Ordering-App/8f96cfbd75cb0b24c818f3bce93a044b92686533.png)

*Figure 4 — Home suggestions and Track status*

![](./assets/PRD-Voice-Food-Ordering-App/92400d3f90f3b724a6b3312334e750d0a3e2e7c5.png)

*Figure 5 — Track insights and order status*

# 7. Screen inventory and estimates

18 screens across three bottom-tab flows (Home, Talk, Kitchen) plus Profile, which houses Track. Complexity is a design estimate: S is a simple list or form, M has custom components or multiple states, L is bespoke interaction design. Effort is design only, in days, assuming one designer.

| # | Screen | Group | Priority | Complexity | Days |
| --- | --- | --- | --- | --- | --- |
| 1 | Phone login and OTP | Onboarding | P0 | S | 0.5 |
| 2 | Address and Swiggy account link | Onboarding | P0 | M | 1.0 |
| 3 | Food preferences | Onboarding | P1 | S | 0.5 |
| 4 | Routine setup | Onboarding | P1 | M | 1.0 |
| 5 | Home | Home | P0 | L | 2.0 |
| 6 | Order history | Home | P1 | S | 0.5 |
| 7 | Voice capture | Talk | P0 | L | 2.5 |
| 8 | Disambiguation | Talk | P0 | M | 1.0 |
| 9 | Cart review | Talk | P0 | L | 2.0 |
| 10 | Kitchen dish description | Kitchen | P0 | M | 1.0 |
| 11 | Ingredient selection | Kitchen | P0 | M | 1.5 |
| 12 | Profile home | Profile | P0 | S | 0.5 |
| 13 | Track overview | Profile | P1 | M | 1.0 |
| 14 | Edit limits | Profile | P1 | M | 0.75 |
| 15 | Track insights | Profile | P1 | L | 2.0 |
| 16 | Order status | Shared | P0 | M | 1.0 |
| 17 | Settings | Profile | P2 | S | 0.5 |
| 18 | Paywall | Shared | P1 | M | 1.0 |

**Design total: approximately 20.75 days, or roughly 4 weeks for one designer. P0 only is approximately 12.5 days.**

Add roughly 25 percent for empty, loading, error and permission states, listed below and not counted above.

## 7.1 States required across screens

| State | Applies to |
| --- | --- |
| First launch, nothing ordered yet | Home, Track overview, Track insights |
| Microphone permission denied | Voice capture, Kitchen |
| Speech not understood | Voice capture |
| No matching restaurant or item | Cart review, Kitchen |
| No calorie estimate available for an item | Cart review, Track insights |
| Pincode not serviceable | Onboarding, Home, cart review |
| Swiggy account not linked or expired | All ordering surfaces |
| Offline | All screens |
| Order failed after confirm | Order status |

# 8. Screen specifications

## 8.1 Home

**Purpose**

Orient the user and offer one-tap paths to likely orders.

**Components**

Greeting and avatar; single-line Track status (spend and calories, tap-through to Track overview); suggested meal card with price and reason; routine Instamart list card; recent order row with Reorder; bottom navigation.

**Design notes**

Suggestion reason must be one short line. Track status line has no failure state or red colour, and states both numbers plainly rather than as a bar or gauge. Reorder skips voice and goes straight to cart review.

## 8.2 Voice capture

**Purpose**

Capture a spoken order and show what has been understood.

**Components**

Listening header with Cancel; animated waveform; live transcript, two lines maximum; recognised items as chips; keyboard toggle; Show cart button.

**Design notes**

Opens already listening. Chips appear as items are recognised, not at the end. Keyboard toggle is deliberately secondary and does not persist as a preference.

## 8.3 Disambiguation

**Purpose**

Resolve an ambiguous request without guessing.

**Components**

The ambiguous phrase echoed back; two or three named options with price and restaurant; a None of these option that reopens voice.

**Design notes**

Never more than three options. Options must differ on something the user can judge, usually price or restaurant, not on internal ranking.

## 8.4 Cart review

**Purpose**

Show exactly what will be bought and what it costs.

**Components**

Restaurant with ETA and distance; line items with quantity and price; add-more-by-voice affordance; item total, delivery and taxes, total to pay; Track impact line covering spend and calories; Place order button.

**Design notes**

Full total always visible without scrolling. Quantity is editable inline. Track impact is one informational line covering both spend and calorie effect of this cart, never a warning dialog. If an item has no calorie estimate, the line states the partial total rather than omitting it silently.

## 8.5 Kitchen dish description

**Purpose**

Take a free-form statement of what the user wants to cook.

**Components**

Text field with mic button; recently cooked dish chips; Get ingredients button; bottom navigation.

**Design notes**

Serving size is parsed from the description, not asked as a separate field. Recent chips are ordered by frequency.

## 8.6 Ingredient selection

**Purpose**

Let the user mark what they already have and cart the rest.

**Components**

Dish name with serving count; ingredient rows with Need or Have toggle and quantity; running count on the button.

**Design notes**

Everything defaults to Need, except staples the user has previously marked Have, which open pre-toggled. Toggling is a single tap on the row, not a checkbox target. Button label states how many items will be added.

## 8.7 Profile home

**Purpose**

Give the user one place for account, preferences and the Track sub-area, without competing with the ordering tabs for bottom-nav space.

**Components**

Account summary (name, phone, linked Swiggy account); Track entry card showing the same status line as Home; diet preference; address; settings and paywall entry rows.

**Design notes**

Track entry card is the visual anchor of this screen — it should feel like the "how am I doing" home, not buried under account admin rows.

## 8.8 Track overview

**Purpose**

Show spend and calorie limits and current position against both, in one place.

**Components**

Weekly or monthly toggle; spend limit with progress and days remaining; calorie limit with progress and days remaining; diet preference card; note that limits do not block.

**Design notes**

Spend and calorie limits are both optional and independently settable — a user can track just one. Progress uses a neutral colour at all levels, including over limit, for both metrics equally.

## 8.9 Edit limits

**Purpose**

Let the user set or change either limit.

**Components**

Period toggle (weekly or monthly); spend limit input; calorie limit input; on/off switch for each, independent of the other.

**Design notes**

Neither limit is required to use the other. Calorie input accepts a round number, not a precise target — this is a rough ceiling, not a prescription.

## 8.10 Track insights

**Purpose**

Report spend and calorie behaviour over a chosen month, read-only.

**Components**

Month selector; spent, calories, orders and average metric cards; spend-by-week and calories-by-week charts; most-ordered and peak-time rows.

**Design notes**

No scores, grades or judgemental language, for either spend or calories. Instamart spend and any Instamart calorie content are reported separately from outside food, never combined into it.

## 8.11 Order status

**Purpose**

Confirm the order was placed and show progress.

**Components**

Confirmation header with ETA; restaurant and total; four-stage vertical stepper; deep link to Swiggy for live tracking; Track note.

**Design notes**

Replaces cart review rather than stacking on it, so back does not return to a stale cart. Live tracking is delegated to Swiggy.

# 9. Visual direction

Starting tokens, offered as a baseline rather than a finished system. A designer should push past these.

| Token | Value | Used for |
| --- | --- | --- |
| Primary | #D85A30 warm coral | Voice action, primary buttons, brand |
| Positive | #1D9E75 green | Progress bars, confirmed states, Have and Need toggles |
| Caution | #D19A2B amber | Track impact line, soft advisories |
| Accent | #7C63C4 violet | Preference and secondary cards |
| Ink | #2A2724 | Primary text |
| Muted | #6B655C | Secondary text, labels |
| Surface | #FFFFFF on #FAF9F6 | Cards on page background |
| Border | #C9C3B8 | Card outlines, dividers |
| Radius | 8 px cards, 22 px buttons and pills | All containers |
| Type | 14 px body semibold for values, 12 px for labels | Two sizes only, weight carries hierarchy |
| Touch target | Minimum 44 px | All interactive rows and toggles |

Tone: warm and calm, not clinical. This is an app used at 9 pm when someone is hungry and does not want to think. Avoid dashboard density, avoid gamification, avoid red.

# 10. Integrations and dependencies

| Dependency | Used for | Risk |
| --- | --- | --- |
| Swiggy Builders Club MCP — Food | Restaurant and item search, cart creation, order placement, status | Production access is invite-led: free to prototype locally against real schemas, but going live requires submitting a use case for review before production credentials are issued. |
| Swiggy Builders Club MCP — Instamart | Grocery search, cart creation for Kitchen and routine lists | Same review gate as above. Also limited to serviceable pincodes. |
| Sarvam AI | Hinglish speech transcription, streamed | Production-grade at scale; residual risk is per-app integration quality and latency, not core accuracy. |
| Calorie estimation source | Per-item or per-dish calorie figures attached to cart items | Coverage is uneven across dishes. Cart and Track must degrade gracefully rather than block on missing data. |
| RevenueCat | Subscription entitlement for Track insights | None material. |

Design implication: every ordering surface needs a defined state for when Swiggy access is unavailable. The chosen fallback is that ordering entry points are hidden rather than shown in an error state, and Kitchen falls back to a copyable ingredient list.

# 11. Monetisation

- Free: voice ordering, Kitchen, reorder, order status. Unlimited.
- Paid: Track limits (spend and calorie), suggestions tuned to those limits, and Track insights.
- Entitlement is handled by RevenueCat. The paywall appears on first attempt to set a limit in Track, not during onboarding.

# 12. How to use this document for design

The figures in this document are structural wireframes. They fix layout hierarchy, component order and what appears on each screen. They do not fix visual style, illustration, iconography or motion, all of which are open.

Suggested prompt when handing this document to an AI design tool:

*Using the attached PRD, design high-fidelity mobile screens for this app. Follow the screen specifications in section 8 for layout and content, and the tokens in section 9 as a starting point. Design for a 390 by 844 viewport. Produce the P0 screens first: Home, Voice capture, Disambiguation, Cart review, Kitchen dish description, Ingredient selection, Profile home and Order status. Keep the visual language warm and calm, avoid dashboard density — Track especially should never look like a fitness or budgeting dashboard — and treat the wireframes as structure rather than style.*

Open questions a designer should push on:

- What the listening state looks like when it is genuinely delightful rather than a generic waveform.
- How recognised items animate in as they are understood, which is the moment the app feels intelligent.
- How the disambiguation turn is presented so it feels helpful rather than like a failure.
- Whether Home should lead with suggestions or with the Track status line.
- How to show two numbers (spend and calories) on Home in one line without it reading as two separate trackers glued together.
