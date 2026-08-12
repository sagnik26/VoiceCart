import React, { createContext, useContext, useMemo } from 'react';

export type ThemeMode = 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  isDark: true;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const DARK_VALUE: ThemeModeContextValue = { mode: 'dark', isDark: true };

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => DARK_VALUE, []);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return ctx;
}
