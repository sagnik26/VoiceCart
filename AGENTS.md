# Repository Guidelines

## Authoring Workflow

For any non-trivial change, share a plan and get confirmation before writing code. Do not jump straight to implementation.

1. Restate the task in 1–2 sentences.
2. Present a plan: the files and modules the change will touch (flag anything outside the current package's boundary), the approach, and any open questions, edge cases, or risks. When there is more than one reasonable approach, give 2–3 options with tradeoffs and a recommendation.
3. **Wait for the human to confirm or adjust the plan before implementing.** The design decision is theirs.
4. Take extra care — surface the impact explicitly in the plan — when the change adds a third-party dependency, changes a public API or exported type, changes a persisted-storage schema (SQLite, encrypted storage, cache), introduces a pattern not already used in the codebase, or touches app-boot or auth flows.
5. Implement the confirmed plan, following the guidelines for the files you touch (see Guideline Index).
6. Before calling the work done: write unit tests per the Tests guideline, and run `npm run type:check`, `npm run lint`, and `npm run unit` (when those scripts exist for the touched package).

Trivial changes (a small fix, a copy tweak, a rename) do not need a plan — just make them.

## Product

VoiceCart is a voice-first food ordering app (India, iOS + Android). Product scope, screens, flows, and rules are defined in the PRD (v1.1 is current). Do not invent features outside that PRD’s v1 scope without asking.

### Documentation

| Document | Relates to |
| --- | --- |
| [`docs/PRD-Voice-Food-Ordering-App.md`](docs/PRD-Voice-Food-Ordering-App.md) | **PRD (v1.1)** — features, IA, product rules, flows, screen specs, Track (spend + calories), monetisation, integrations |
| [`docs/assets/PRD-Voice-Food-Ordering-App/`](docs/assets/PRD-Voice-Food-Ordering-App/) | PRD wireframe figures (IA, voice, Kitchen, Home/Track, insights) |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Visual tokens, navigation/IA notes, implemented screen map for the Expo UI |
| [`docs/voice-app-architecture.md`](docs/voice-app-architecture.md) | Talk voice loop architecture — LiveKit (WebRTC) + Sarvam STT/TTS + OpenAI LLM agent |
| [`docs/voice-loop-flow.md`](docs/voice-loop-flow.md) | Simple Talk turn: mic → STT → LLM → TTS → speaker; how the Python worker is dispatched |
| [`docs/assets/voice-app-architecture/`](docs/assets/voice-app-architecture/) | Architecture diagram asset for the voice stack |
| [`docs/implementation/voice-ordering.md`](docs/implementation/voice-ordering.md) | Voice ordering product wiring — chips, disambiguation, typed = same session, cart handoff |
| [`docs/implementation/swiggy-mcp-food.md`](docs/implementation/swiggy-mcp-food.md) | Swiggy Builders Club MCP (Food) — search, cart, place, status |
| [`docs/implementation/swiggy-mcp-instamart.md`](docs/implementation/swiggy-mcp-instamart.md) | Swiggy MCP (Instamart) — Kitchen and routine grocery carts |
| [`docs/implementation/kitchen.md`](docs/implementation/kitchen.md) | Kitchen — dish → ingredients, Need/Have, extras (pantry, substitutions) |
| [`docs/implementation/track.md`](docs/implementation/track.md) | Track — spend/calorie ledgers, limits, Home status, cart impact |
| [`docs/implementation/calorie-estimation.md`](docs/implementation/calorie-estimation.md) | Calorie estimation source for Track and cart impact |
| [`docs/implementation/suggestions.md`](docs/implementation/suggestions.md) | Home suggestions ranker (history, time, Track headroom) |
| [`docs/implementation/track-insights.md`](docs/implementation/track-insights.md) | Track insights — monthly read-only reporting (paid) |
| [`docs/implementation/reorder.md`](docs/implementation/reorder.md) | One-tap reorder from recent/history → cart review |
| [`docs/implementation/routine-instamart-list.md`](docs/implementation/routine-instamart-list.md) | Standing Instamart grocery list on restock day |
| [`docs/implementation/revenuecat-monetisation.md`](docs/implementation/revenuecat-monetisation.md) | RevenueCat — free vs paid, paywall, entitlements |
| [`docs/implementation/onboarding-profile.md`](docs/implementation/onboarding-profile.md) | Onboarding (OTP, Swiggy link) and Profile vs Settings IA |
| [`docs/implementation/cross-cutting-states-and-rules.md`](docs/implementation/cross-cutting-states-and-rules.md) | Product rules enforcement + empty/error/permission states |
| [`docs/implementation/open-decisions.md`](docs/implementation/open-decisions.md) | Open product/engineering decisions still to lock |
| [`docs/implementation/appendix-screen-map.md`](docs/implementation/appendix-screen-map.md) | PRD screen ↔ feature map and integration risk summary |

## Project Structure & Module Organization

This repo is an **npm workspaces** monorepo containing React Native / Expo applications and shared modules:

### Top-Level Structure

- `apps/` - Contains individual apps
  - `apps/voicecart/` - VoiceCart Expo app
- `services/` - Non-Expo processes (`services/talk-agent` — Python LiveKit Agents worker; npm scripts only)
- `core/` - Shared core modules used across apps
  - `core/modules/` - Individual shared workspace packages (`core/modules/*`)
- `common/` - Common tooling and configurations
  - `common/ci/` - CI/CD scripts and tools
  - `common/tools/` - Shared development tools
- `docs/` - Product, architecture, design system, and implementation guides (see [Documentation](#documentation-index))
- `tests/e2e/` - End-to-end tests
- Root `package.json` - Declares npm `workspaces` globs (`apps/*`, `apps/*/features/*`, `apps/*/core/*`, `core/modules/*`)



### App-Level Structure (apps/voicecart)

- `src/` - Main application code
- `features/` - Feature modules
- `core/` - App-specific core modules
- `ios/` - iOS native code (Objective-C/Swift)
- `android/` - Android native code (Java/Kotlin)
- `assets/` - Static assets (images, fonts, etc.)
- `scripts/` - Build and utility scripts
- `__tests__/` - Test files
- `ci/` - CI/CD configuration



### Module Organization Principles

- Keep related functionality grouped in a module
  - Feature modules in `apps/(voicecart)/features/` should be independently testable npm packages
  - Core modules in `apps/(voicecart)/core` should be independently testable npm packages
  - Shared Core modules in `core/modules/` should be independently testable npm packages
  - Each module and Main application should not import other module directly with relative path, should use `import` as npm module
- Feature modules
  - Feature modules should not import other Feature module
  - Feature modules should have a screen code for the feature so that it can depend on react-navigation and react-native
  - Feature modules can depend on Core modules and Shared Core modules
- Core modules
  - Core modules should be single functionality code grouped for Feature modules on one application
  - Core modules can depend on Shared Core modules
  - Core modules may depend on other Core modules if necessary but consider injecting dependencies first instead of directly depending on them, and keep modules as independent as possible
  - Core modules can have UI components and business logic
  - Core modules should not have a screen code so that it should not depend on react-navigation
- Shared Core modules
  - Shared Core modules should be single functionality code grouped for Feature modules across multiple applications
  - Shared Core modules may depend on other Shared Core modules if necessary but not recommended in general, inject dependencies and keep modules as independent as possible
  - Shared Core modules can have UI components or business logic, should not mix them
  - Shared Core modules should not have a screen code so that it should not depend on react-navigation
- Main application code should be kept to a minimum and serve as an integration layer for Feature modules besides sign in/out and application lifecycle
- Use the npm workspaces defined in the root `package.json` (root scripts proxy with `npm run … -w <package>` / `npm run … --workspaces`)
- Do **not** add `pnpm-workspace.yaml` or switch to pnpm for this repo unless explicitly decided later
- Adding a dependency has strict placement rules (the module's own `package.json` and the app-root `package.json`, updated together), and third-party OSS packages need an IP-notice regeneration, the OSS Update label, and license review. Follow the Dependencies and OSS guidelines in the Guideline Index before changing dependencies.
- When proposing, writing, or reviewing architecture-relevant changes, MUST use `Non-functional Requirements` as guiding principles. Identify the affected NFRs, relevant requirement horizons, and important tradeoffs when the change affects architecture, dependencies, platform capabilities, release behavior, telemetry, experimentation, developer workflows, or cross-module patterns.

---



## Coding Style & Naming Conventions



### General Principles

- Follow existing patterns and conventions in the codebase
- Follow ESLint configuration (extends Airbnb, React Native, Prettier)
- MUST use English for PR, discussion, comments, commit messages
  - If Japanese is needed, MUST write both English and Japanese



### Language & Framework Standards

- **JavaScript/TypeScript**: Primary languages for React Native code
  - TypeScript MUST be used for new packages and new files, except for newly created unit test files
  - TypeScript config: `noImplicitAny: true`, `strictNullChecks: true`
  - Typing conventions: `typescript-usage.md` (see Guideline Index). Applies to new and modified code; flag deviations and let the author defend, legacy outside the diff is exempt.
- **Swift/Objective-C**: For iOS native modules
- **Java/Kotlin**: For Android native modules
- **C++**: For shared logic in native modules
- **Python**: For E2E test code



### UI Components

- ALWAYS use [gluestack-ui](https://gluestack.io/) for UI components (React Native / Expo).
- Prefer gluestack-ui primitives, patterns, and copy-paste components over ad-hoc custom UI or other component libraries (e.g. React Native Paper, NativeBase, Tamagui).
- Style with NativeWind / Tailwind classes following gluestack-ui conventions.
- Do not introduce a competing UI kit without explicit human approval.



### Naming Conventions

- Functions and variables: `camelCase` (JavaScript / Java) or `snake_case` (Python)
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private members: Prefix with `_` or `__` (use `#` where supported)
- File names:
  - Match the primary component/module they contain
  - Platform-specific: `*.ios.js`, `*.android.js`
  - TypeScript: `*.ts`, `*.tsx`



### Import Conventions

- Use `import` statement or `import()` function for typed modules (TypeScript)
- Group imports logically:
  1. React/React Native
  2. Third-party libraries
  3. Internal modules
  4. Relative imports
- Use path aliases defined in `tsconfig.json` (e.g., `@assets/*`)

---



## Documentation

- Add JSDoc/TSDoc comments to public APIs and complex logic
- Keep comments up-to-date with code changes
- Document the "why" not just the "what"
- Keep documentation in sync with code changes: when modifying behavior, APIs, configuration, or conventions that are described in `docs/`, update the corresponding doc files in the same PR



## Code Organization

- Keep files focused and reasonably sized (<500 lines)
- Mirror test structure to source structure
- Follow dependency relation guidelines (see `dependency-relation.md`)



## Error Handling & Logging

- Report errors through the `rn-error-handling` and `rn-telemetry` modules; do not swallow exceptions. Details: `error-reporting.md`.
- Include useful context in logs (user ID, request ID). NEVER log sensitive information (passwords, tokens, PII).

---



## Security & Configuration



### Configuration Management

- Store configuration in environment variables or config files
- NEVER commit secrets, API keys, passwords, or credentials to version control
- Use encrypted credential files (see `cred:enc`, `cred:dec` scripts)
- Document all required environment variables in README
- Switch environments via Debug Settings in the app



### Security Best Practices

- Validate all user input
- Run `npm run ip-notice:check` to verify open source compliance (when that script exists)
- Follow the principle of least privilege for access control
- Store sensitive data encrypted at rest and in transit
- Review security advisories regularly for dependencies

---



## Testing Guidelines



### Unit test requirements

- **JavaScript/React Native:**
  - Unit tests MUST pass at all times
  - When writing or reviewing test files (files matching `__tests__/**`, `*.test.ts`, `*.test.js`, `*.test.tsx`), MUST load and apply `JavaScript/React Native unit tests skill`
  - Global coverage MUST reach 60% for statements, functions, and branches
  - `features/` modules MUST reach 60% coverage
  - `core/` modules MUST reach 75% coverage
  - Write tests for all new features and bug fixes
  - Test edge cases and error conditions, not just happy paths
- **Native Code (iOS/Android):**
  - Native code MUST reach 75% coverage
  - XCode Test: iOS/Objective-C/Swift unit tests
    - Use `xcpretty` for readable output
    - Use `slather` for coverage reports
  - Gradle/Jacoco: Android/Java unit tests



### E2E Tests requirements

- Use Python for E2E tests
- E2E Tests MUST be located in `tests/e2e`
- See `README.md`



## Code Quality Standards

When writing or reviewing code, ensure correctness, security (no exposed secrets), maintainability, and no obvious performance regressions. Repo-specific expectations:

- Use Apollo fetch policies appropriately and avoid N+1 GraphQL queries
- Derived array computations in render (`.slice`, `.filter`, `.map`) SHOULD be wrapped in `useMemo`
- Be mindful of memory and bundle size; launch optimization: `how-to-launch-app-faster.md`

---

