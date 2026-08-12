import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home-header';
import { PlanCard } from '../components/plan-card';
import { RecentSection } from '../components/recent-section';
import { SuggestedSection } from '../components/suggested-section';
import { Box } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Box className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: 28,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="xl">
          <HomeHeader onOpenSettings={() => router.push('/settings')} />
          <PlanCard />
          <SuggestedSection onReorder={() => router.push('/cart')} />
          <RecentSection
            onSeeAll={() => router.push('/history')}
            onReorder={() => router.push('/cart')}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
