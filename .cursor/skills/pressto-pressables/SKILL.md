---
name: pressto-pressables
description: >-
  Implements main-thread button tap interactions with the pressto library
  (PressableScale, PressableOpacity, createAnimatedPressable, PressablesConfig).
  Use when adding or changing pressable/button tap animations, spring or timing
  press feedback, custom press transforms (scale, rotate, opacity), replacing
  TouchableOpacity/Pressable for animated taps, or when the user mentions
  pressto, press interactions, or tap feedback in React Native / Expo.
license: MIT
metadata:
  author: VoiceCart
  tags: react-native, expo, pressto, pressable, animation, reanimated
---

# Pressto pressables

Prefer [pressto](https://github.com/enzomanuelmangano/pressto) for animated tap interactions. It runs on the UI thread via `react-native-gesture-handler` + `react-native-reanimated`.

## Prerequisites

Peers (already typical in Expo RN apps):

- `pressto`
- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-worklets`

Root must wrap the tree in `GestureHandlerRootView` (pressto uses RNGH `BaseButton`):

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* app */}
    </GestureHandlerRootView>
  );
}
```

Without this, you get: `NativeViewGestureHandler must be used as a descendant of GestureHandlerRootView`.

## Default choice

| Need | Component |
|------|-----------|
| Scale on press | `PressableScale` |
| Fade on press | `PressableOpacity` |
| Custom transform/style | `createAnimatedPressable` |

Do not hand-roll `Pressable` + Reanimated scale for simple taps when pressto is available.

## Quick patterns

### Scale (default)

```tsx
import { PressableScale, PressablesConfig } from 'pressto';

<PressablesConfig
  animationType="spring"
  animationConfig={{ damping: 22, stiffness: 140, mass: 0.85 }}
  config={{ minScale: 0.92 }}
  defaultProps={{ rippleColor: 'transparent' }}
>
  <PressableScale onPress={onPress} style={styles.hit}>
    {children}
  </PressableScale>
</PressablesConfig>
```

### Custom (e.g. rotate-only)

`'worklet';` is **required** at the top of the style function.

```tsx
import { createAnimatedPressable, PressablesConfig } from 'pressto';

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ rotate: `${progress * 12}deg` }],
  };
});
```

`progress` is `0` (idle) → `1` (pressed).

### Spring feel (VoiceCart default)

Prefer a soft spring over snappy defaults when press motion feels too fast:

```ts
{ damping: 22, stiffness: 140, mass: 0.85 }
```

Tune: lower `stiffness` / higher `mass` = slower; higher `damping` = less bounce.

**Stable config references:** hoist `animationConfig`, `config`, and `defaultProps` to module-level constants. Inline objects (`defaultProps={{ rippleColor: 'transparent' }}`) recreate every render, refresh Pressto context, and can trigger Reanimated’s “Reading from `value` during component render” warning.

Also memoize `onPress` / `accessibilityState` with `useCallback` / `useMemo`, and avoid nested `PressablesConfig` when a custom `createAnimatedPressable` can encode the different motion (e.g. Talk scale-up).

If the strict warning still appears from Pressto itself, `configureReanimatedLogger({ strict: false })` in root layout is acceptable — it only disables that check.

## PressablesConfig

- Scope to the feature (e.g. tab bar) unless the user asks for app-wide defaults.
- `animationType`: `'spring'` | `'timing'` (library default is timing).
- `animationConfig`: Reanimated spring/timing config.
- `config`: `{ minScale, activeOpacity, baseScale }` for built-ins.
- `defaultProps`: e.g. `{ rippleColor: 'transparent' }` to disable Android ripple.

### Per-item `config` (pressto 0.7)

Published types omit a per-pressable `config` prop. For a different `minScale` on one control, nest another `PressablesConfig` (and re-pass `animationType` / `animationConfig` — nested providers do **not** inherit; missing `animationType` resets to timing).

```tsx
<PressablesConfig animationType="spring" animationConfig={SPRING} config={{ minScale: 0.92 }}>
  <PressableScale ... />
  <PressablesConfig animationType="spring" animationConfig={SPRING} config={{ minScale: 0.9 }}>
    <PressableScale ... />
  </PressablesConfig>
</PressablesConfig>
```

## Handlers

`onPress` / `onPressIn` / `onPressOut` receive options: `(options) => void`. Navigation wrappers stay fine:

```tsx
onPress={() => navigation.navigate('index')}
```

## Haptics

Do **not** add `expo-haptics` unless the user asks. If adding later, fire-and-forget on `onPressIn` (`void Haptics.impactAsync(...)`) and never block navigation on the promise. Optional: `PressablesConfig` `globalHandlers`.

## Checklist

- [ ] `pressto` installed; peers present
- [ ] `GestureHandlerRootView` at root with `flex: 1`
- [ ] Prefer `PressableScale` / custom via `createAnimatedPressable`
- [ ] Spring config when motion should feel smooth
- [ ] Nested `PressablesConfig` if per-item minScale needed (v0.7)
- [ ] `'worklet';` on custom animated style functions
- [ ] Haptics only if requested

## In-repo example

Tab bar rotate pressables: [`src/components/app-tab-bar.tsx`](../../../src/components/app-tab-bar.tsx)

## External docs

- https://github.com/enzomanuelmangano/pressto
