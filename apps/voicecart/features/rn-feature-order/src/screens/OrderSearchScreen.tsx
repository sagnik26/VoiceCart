import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, ButtonText, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { RESTAURANTS, RESTAURANT_FILTERS } from '@voicecart/rn-feature-order-core';
import { formatInr } from '@voicecart/rn-theme';

export function OrderSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <Box className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: 28,
          paddingHorizontal: 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text size="xl" className="font-bold text-foreground">
          Order
        </Text>

        <Pressable
          onPress={() => router.push('/voice')}
          className="flex-row items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          accessibilityRole="button"
          accessibilityLabel="Search restaurants or dishes"
        >
          <Text size="sm" className="text-muted-foreground">
            Search restaurants or dishes
          </Text>
          <Box className="h-6 w-6 rounded-full bg-primary/20" />
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Box className="flex-row gap-2">
            {RESTAURANT_FILTERS.map((filter, index) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(index)}
                className={`rounded-full border px-3 py-1.5 ${
                  activeFilter === index ? 'border-foreground bg-foreground' : 'border-border bg-card'
                }`}
              >
                <Text
                  size="xs"
                  className={activeFilter === index ? 'text-background' : 'text-foreground'}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </Box>
        </ScrollView>

        <VStack space="sm">
          {RESTAURANTS.map((restaurant) => (
            <Pressable
              key={restaurant.id}
              onPress={() =>
                router.push({ pathname: '/menu', params: { restaurant: restaurant.id } })
              }
              className="rounded-lg border border-border bg-card p-4"
              accessibilityRole="button"
            >
              <Box className="flex-row items-center justify-between">
                <Text size="md" className="font-semibold text-foreground">
                  {restaurant.name}
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  ₹{formatInr(restaurant.priceForTwo)} for 2
                </Text>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
