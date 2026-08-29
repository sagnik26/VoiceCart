import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, ButtonText, HStack, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { getDecideComparison } from '@voicecart/rn-feature-decide-core';
import { formatInr } from '@voicecart/rn-theme';

export function DecideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dish?: string }>();
  const dishParam = typeof params.dish === 'string' ? params.dish : undefined;
  const comparison = getDecideComparison(dishParam);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const onCook = () => {
    router.push({
      pathname: '/ingredient-list',
      params: { dish: comparison.dish },
    });
  };

  const onOrder = () => {
    router.push({
      pathname: '/menu',
      params: { restaurant: 'saffron-spice', dish: comparison.dish },
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
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Text size="sm" className="text-muted-foreground">
            ‹ Back
          </Text>
        </Pressable>

        <VStack space="sm">
          <Text size="xl" className="font-bold text-foreground">
            {comparison.dish}, for {comparison.servings}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Here&apos;s how cooking compares to ordering it
          </Text>
        </VStack>

        <HStack space="sm" className="items-stretch">
          <Box className="flex-1 rounded-lg border border-border bg-card p-4">
            <Text size="md" className="font-semibold text-foreground">
              Cook it
            </Text>
            <Text size="sm" className="mt-1 text-muted-foreground">
              {comparison.cook.missingCount} items missing · ₹{formatInr(comparison.cook.cost)} ·
              ready in {comparison.cook.readyMinutes} min
            </Text>
          </Box>
          <Box className="flex-1 rounded-lg border border-border bg-card p-4">
            <Text size="md" className="font-semibold text-foreground">
              Order it
            </Text>
            <Text size="sm" className="mt-1 text-muted-foreground">
              {comparison.order.restaurant} · ₹{formatInr(comparison.order.cost)} ·{' '}
              {comparison.order.etaMinutes} min ETA
            </Text>
          </Box>
        </HStack>

        <Button onPress={onCook} className="h-12 w-full rounded-full">
          <ButtonText>Get missing ingredients</ButtonText>
        </Button>
        <Button variant="outline" onPress={onOrder} className="h-12 w-full rounded-full">
          <ButtonText>Order from restaurant</ButtonText>
        </Button>

        <Text size="xs" className="text-center text-muted-foreground">
          Calorie estimate: {comparison.cook.calorieNote}
        </Text>
      </ScrollView>
    </Box>
  );
}
