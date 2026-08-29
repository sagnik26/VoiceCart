import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, ButtonText, Pressable, Text, VStack } from '@voicecart/rn-ui';
import {
  getDishIngredients,
  getDishServes,
  resolveDish,
} from '@voicecart/rn-feature-kitchen-core';

const SERVING_OPTIONS = [1, 2, 4];

export function IngredientListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dish?: string; input?: string }>();
  const dishName = resolveDish(typeof params.dish === 'string' ? params.dish : '');
  const input = typeof params.input === 'string' ? params.input : '';
  const defaultServings = useMemo(() => getDishServes(dishName, input), [dishName, input]);
  const [servings, setServings] = useState(defaultServings);

  const items = useMemo(() => getDishIngredients(dishName), [dishName]);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/kitchen');
  };

  const onContinue = () => {
    router.push({
      pathname: '/ingredients',
      params: { dish: dishName, servings: String(servings) },
    });
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

        <Text size="xl" className="font-bold text-foreground">
          {dishName}
        </Text>

        <Box className="flex-row gap-2">
          {SERVING_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setServings(option)}
              className={`rounded-full border px-3 py-1.5 ${
                servings === option ? 'border-foreground bg-foreground' : 'border-border bg-card'
              }`}
            >
              <Text
                size="xs"
                className={servings === option ? 'text-background' : 'text-foreground'}
              >
                {option} serving{option === 1 ? '' : 's'}
              </Text>
            </Pressable>
          ))}
        </Box>

        <VStack>
          {items.map((item) => (
            <Box
              key={item.name}
              className="flex-row items-center justify-between border-b border-border py-2"
            >
              <Text size="md" className="text-foreground">
                {item.name}
              </Text>
              <Text size="sm" className="text-muted-foreground">
                {item.qty}
              </Text>
            </Box>
          ))}
        </VStack>

        <Button onPress={onContinue} className="h-12 rounded-full">
          <ButtonText>Mark what you have →</ButtonText>
        </Button>
      </ScrollView>
    </Box>
  );
}
