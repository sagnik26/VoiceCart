import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryHeader } from '../components/history-header';
import { Box, Button, ButtonText, Pressable, Text, VStack } from '@voicecart/rn-ui';
import {
  filterHistory,
  formatHistoryRow,
  type HistoryFilter,
} from '@voicecart/rn-feature-history-core';

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'cooked', label: 'Cooked' },
  { key: 'ordered', label: 'Ordered' },
];

export function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const entries = filterHistory(filter);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const onRecook = () => {
    router.push({ pathname: '/ingredient-list', params: { dish: 'Dal Tadka' } });
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

        <Box className="flex-row gap-2">
          {FILTERS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              className={`rounded-full border px-3 py-1.5 ${
                filter === item.key ? 'border-foreground bg-foreground' : 'border-border bg-card'
              }`}
            >
              <Text
                size="xs"
                className={filter === item.key ? 'text-background' : 'text-foreground'}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </Box>

        <VStack space="sm">
          {entries.map((entry) => (
            <Box key={entry.id} className="rounded-lg border border-border bg-card px-4 py-3">
              <Text size="sm" className="text-foreground">
                {formatHistoryRow(entry)}
              </Text>
            </Box>
          ))}
        </VStack>

        <Button variant="outline" onPress={onRecook} className="h-10 self-start rounded-full">
          <ButtonText>Recook Dal tadka</ButtonText>
        </Button>
      </ScrollView>
    </Box>
  );
}
