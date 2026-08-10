import '../../globals.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Brand } from '@/constants/theme';
import { ThemeModeProvider, useThemeMode } from '@/theme/theme-mode';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { mode } = useThemeMode();

  return (
    <GluestackUIProvider mode={mode}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Brand.surface },
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
