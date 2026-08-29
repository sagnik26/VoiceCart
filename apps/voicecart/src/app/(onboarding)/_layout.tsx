import { Redirect, Stack } from 'expo-router';

import { isOnboarded } from '@voicecart/rn-feature-onboarding-core';

export default function OnboardingLayout() {
  if (isOnboarded()) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="setup-address" />
      <Stack.Screen name="setup-pantry" />
    </Stack>
  );
}
