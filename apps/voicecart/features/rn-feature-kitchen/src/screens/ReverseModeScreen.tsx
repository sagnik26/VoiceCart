import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Pressable, Text, VStack } from '@voicecart/rn-ui';
import {
  parsePantryUtterance,
  rankDishesFromPantry,
  resolveDish,
} from '@voicecart/rn-feature-kitchen-core';

export function ReverseModeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ pantry?: string }>();
  const pantryText = typeof params.pantry === 'string' ? params.pantry : 'Rice, Dal, Onion, Tomato';
  const pantryItems = useMemo(() => parsePantryUtterance(pantryText), [pantryText]);
  const suggestions = useMemo(() => rankDishesFromPantry(pantryItems), [pantryItems]);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/kitchen');
  };

  const onSelect = (dish: string) => {
    router.push({ pathname: '/ingredient-list', params: { dish: resolveDish(dish) } });
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
        <Pressable onPress={onBack} accessibilityRole="button">
          <Text size="sm" className="text-muted-foreground">
            ‹ Back
          </Text>
        </Pressable>

        <Text size="md" className="font-semibold text-foreground">
          You said you have:
        </Text>
        <Box className="flex-row flex-wrap gap-2">
          {pantryItems.map((item) => (
            <Box key={item} className="rounded-full border border-border bg-card px-3 py-1">
              <Text size="xs" className="text-foreground">
                {item}
              </Text>
            </Box>
          ))}
        </Box>

        <Text size="md" className="font-semibold text-foreground">
          You could make
        </Text>
        <VStack space="sm">
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.dish}
              onPress={() => onSelect(suggestion.dish)}
              className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <Text size="md" className="font-semibold text-foreground">
                {suggestion.dish}
              </Text>
              <Text size="sm" className="text-muted-foreground">
                {suggestion.missingCount} missing
              </Text>
            </Pressable>
          ))}
        </VStack>
        <Text size="xs" className="text-muted-foreground">
          Sorted by fewest missing ingredients
        </Text>
      </ScrollView>
    </Box>
  );
}
