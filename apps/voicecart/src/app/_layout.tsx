import '../../globals.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { AnimatedSplashOverlay, GluestackUIProvider } from '@voicecart/rn-ui';
import { Colors, ThemeModeProvider, useThemeMode } from '@voicecart/rn-theme';

import { setupLiveKit } from '../livekit-setup';

// Pressto reads shared values when rebuilding animated styles on re-render.
// Strict mode only warns; disable it for this known third-party pattern.
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

setupLiveKit();
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { mode } = useThemeMode();

  return (
    <GluestackUIProvider mode={mode}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.dark.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="voice" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="disambiguation" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="order-status" />
        <Stack.Screen name="ingredients" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
      </Stack>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeModeProvider>
        <RootNavigator />
      </ThemeModeProvider>
    </GestureHandlerRootView>
  );
}
