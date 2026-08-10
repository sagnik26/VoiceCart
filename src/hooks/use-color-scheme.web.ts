import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web color scheme. Falls back to light when the platform reports null
 * (e.g. during static render before preference is available).
 */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
