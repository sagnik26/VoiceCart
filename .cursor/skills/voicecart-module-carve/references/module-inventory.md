# VoiceCart module inventory (carved)

Packages after npm workspace carve. Update when packages are added or screens land.

## Feature + feature-core pairs

| Feature (`apps/voicecart/features/`) | Feature-core (`apps/voicecart/core/`) | Notes |
| --- | --- | --- |
| `@voicecart/rn-feature-home` | `@voicecart/rn-feature-home-core` | Home tab |
| `@voicecart/rn-feature-kitchen` | `@voicecart/rn-feature-kitchen-core` | Kitchen + Ingredients |
| `@voicecart/rn-feature-voice` | `@voicecart/rn-feature-voice-core` | Talk + Disambiguation |
| `@voicecart/rn-feature-cart` | `@voicecart/rn-feature-cart-core` | Cart review; depends on home-core + kitchen-core for mocks |
| `@voicecart/rn-feature-history` | `@voicecart/rn-feature-history-core` | Order history |
| `@voicecart/rn-feature-order-status` | `@voicecart/rn-feature-order-status-core` | Thin core re-exports order helpers from cart-core |
| `@voicecart/rn-feature-settings` | `@voicecart/rn-feature-settings-core` | Settings |

## Global core (`core/modules/`)

| Package | Owns |
| --- | --- |
| `@voicecart/rn-theme` | Brand/Colors, theme mode, themed text/view, `formatInr` |
| `@voicecart/rn-ui` | gluestack primitives, AppTabBar, ScreenPlaceholder, shared widgets |

## App shell

- `apps/voicecart/src/app/**` — Expo Router layouts + thin feature mounts
- `apps/voicecart/src/global.css` — NativeWind entry (also `globals.css` at app root)

## Related

- Skill entry: [SKILL.md](../SKILL.md)
- Product voice wiring: [docs/implementation/voice-ordering.md](../../../docs/implementation/voice-ordering.md)
- Build phases: [docs/voice-loop-build-phases.md](../../../docs/voice-loop-build-phases.md)
