import { Tabs } from 'expo-router';

import { NotchAppTabBar } from '@voicecart/rn-ui';
import { Colors } from '@voicecart/rn-theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <NotchAppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.dark.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="kitchen" options={{ title: 'Kitchen' }} />
    </Tabs>
  );
}
