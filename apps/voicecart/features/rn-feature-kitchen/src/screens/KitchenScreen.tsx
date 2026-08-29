import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DishInput } from '../components/dish-input';
import { KitchenHeader } from '../components/kitchen-header';
import { RecentDishes } from '../components/recent-dishes';
import { Box, Button, ButtonText, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { resolveDish, type KitchenMode } from '@voicecart/rn-feature-kitchen-core';

export function KitchenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [kitchenInput, setKitchenInput] = useState('');
  const [mode, setMode] = useState<KitchenMode>('cook');

  const onContinue = () => {
    if (mode === 'reverse') {
      router.push({
        pathname: '/reverse',
        params: { pantry: kitchenInput || 'Rice, Dal, Onion, Tomato' },
      });
      return;
    }
    const dish = resolveDish(kitchenInput);
    router.push({ pathname: '/ingredient-list', params: { dish, input: kitchenInput } });
  };

  return (
    <Box className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: 28,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <VStack space="xl">
          <KitchenHeader />
          <Box className="flex-row gap-2">
            {(
              [
                { key: 'cook' as const, label: 'I want to cook…' },
                { key: 'reverse' as const, label: 'What can I make?' },
              ] as const
            ).map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setMode(item.key)}
                className={`rounded-full border px-3 py-1.5 ${
                  mode === item.key ? 'border-foreground bg-foreground' : 'border-border bg-card'
                }`}
              >
                <Text
                  size="xs"
                  className={mode === item.key ? 'text-background' : 'text-foreground'}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </Box>
          <DishInput
            value={kitchenInput}
            onChangeText={setKitchenInput}
            onMicPress={() => router.push('/voice')}
            placeholder={
              mode === 'cook'
                ? 'Describe a dish, e.g. "dal for 2"'
                : 'What do you have? e.g. rice, dal, onion'
            }
          />
          {mode === 'cook' ? <RecentDishes onPick={setKitchenInput} /> : null}
          {mode === 'cook' ? (
            <Box className="rounded-lg border border-border bg-card p-4">
              <Box className="flex-row items-center justify-between">
                <Text size="md" className="font-semibold text-foreground">
                  Plan 3 dishes
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  1 cart
                </Text>
              </Box>
            </Box>
          ) : null}
          <Button onPress={onContinue} className="mt-2 h-12 w-full rounded-full">
            <ButtonText>{mode === 'cook' ? 'Get ingredients' : 'Suggest dishes'}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
