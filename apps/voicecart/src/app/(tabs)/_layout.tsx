import { Redirect, Tabs } from 'expo-router';

import { KitchenAppTabBar } from '@voicecart/rn-ui';
import { Colors } from '@voicecart/rn-theme';
import { isOnboarded } from '@voicecart/rn-feature-onboarding-core';

export default function TabsLayout() {
  if (!isOnboarded()) {
    return <Redirect href="/(onboarding)/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <KitchenAppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.dark.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="kitchen" options={{ title: 'Kitchen' }} />
      <Tabs.Screen name="order" options={{ title: 'Order' }} />
    </Tabs>
  );
}
