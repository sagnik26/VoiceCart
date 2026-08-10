import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme();
  const [override, setOverride] = useState<ThemeMode | null>(null);

  const mode: ThemeMode = override ?? (system === 'dark' ? 'dark' : 'light');

  const setMode = useCallback((next: ThemeMode) => {
    setOverride(next);
    Appearance.setColorScheme?.(next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggleMode,
      setMode,
    }),
    [mode, toggleMode, setMode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return ctx;
}
