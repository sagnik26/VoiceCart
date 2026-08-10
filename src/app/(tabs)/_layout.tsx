import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/app-tab-bar';
import { Brand } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Brand.surface },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="kitchen" options={{ title: 'Kitchen' }} />
    </Tabs>
  );
}
