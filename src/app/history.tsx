import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryHeader } from '@/components/history/history-header';
import { HistoryOrderCard } from '@/components/history/history-order-card';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HISTORY_ORDERS } from '@/data/history-mock';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const onReorder = () => {
    router.push('/cart');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24),
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HistoryHeader onBack={onBack} />
        <VStack space="sm">
          {HISTORY_ORDERS.map((order) => (
            <HistoryOrderCard
              key={`${order.restaurant}-${order.date}`}
              order={order}
              onReorder={onReorder}
            />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
