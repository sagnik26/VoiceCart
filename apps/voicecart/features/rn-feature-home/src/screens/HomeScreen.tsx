import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home-header';
import { PantrySection } from '../components/pantry-section';
import { RecentSection } from '../components/recent-section';
import { TonightsPickCard } from '../components/tonights-pick-card';
import { VoicePromptInput } from '../components/voice-prompt-input';
import { Box, VStack } from '@voicecart/rn-ui';

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
          <HomeHeader onOpenProfile={() => router.push('/profile')} />
          <VoicePromptInput onMicPress={() => router.push('/voice')} />
          <TonightsPickCard onCompare={() => router.push('/decide')} />
          <RecentSection
            onSeeAll={() => router.push('/history')}
            onRecook={() =>
              router.push({ pathname: '/ingredient-list', params: { dish: 'Dal Tadka' } })
            }
          />
          <PantrySection onManage={() => router.push('/pantry')} />
        </VStack>
      </ScrollView>
    </Box>
  );
}
