import React, { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import { useColorScheme } from 'nativewind';

import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';

import { config } from './config';
import {
  useCalendarTheme as useCalendarThemeHook,
  useGluestackColors as useGluestackColorsHook,
} from './useGluestackColors';

export type ModeType = 'light' | 'dark' | 'system';

export const useGluestackColors = useGluestackColorsHook;
export const useCalendarTheme = useCalendarThemeHook;
export type { GluestackColors } from './useGluestackColors';

export function GluestackUIProvider({
  mode = 'dark',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  // Forced modes: style from `mode`, not live NativeWind scheme (debug menu flips it).
  const resolved: 'light' | 'dark' =
    mode === 'system' ? (colorScheme === 'light' ? 'light' : 'dark') : mode;

  // Set once per mode change — do not depend on `colorScheme` or every flip re-renders
  // the tree and triggers Reanimated/pressto "read value during render" warnings.
  useEffect(() => {
    if (mode === 'system') return;
    setColorScheme(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <View
      style={[
        config[resolved],
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
