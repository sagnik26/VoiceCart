/**
 * Semantic tokens for non-className call sites (status bar, splash, native tint).
 * Keep in sync with @voicecart/rn-ui gluestack config and docs/DESIGN-SYSTEM.md.
 */

import { Platform } from 'react-native';

export const Brand = {
  primary: '#D85A30',
  success: '#1D9E75',
  warning: '#D19A2B',
  accent: '#7C63C4',
  ink: '#2A2724',
  muted: '#6B655C',
  surface: '#FAF9F6',
  card: '#FFFFFF',
  border: '#C9C3B8',
  radiusCard: 8,
  radiusPill: 22,
  touchTarget: 44,
} as const;

export const Colors = {
  light: {
    text: Brand.ink,
    background: Brand.surface,
    backgroundElement: '#F0EDE8',
    backgroundSelected: '#E8E4DC',
    textSecondary: Brand.muted,
    primary: Brand.primary,
    success: Brand.success,
    warning: Brand.warning,
    border: Brand.border,
    card: Brand.card,
  },
  dark: {
    text: Brand.surface,
    background: '#1A1816',
    backgroundElement: '#2E2A26',
    backgroundSelected: '#3A3632',
    textSecondary: '#A8A298',
    primary: Brand.primary,
    success: Brand.success,
    warning: Brand.warning,
    border: '#3A3632',
    card: '#242220',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;


export function formatInr(amount: number): string {
  return amount.toLocaleString('en-IN');
}
