import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { getMenu, getRestaurant } from '@voicecart/rn-feature-order-core';
import { formatInr } from '@voicecart/rn-theme';

export function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ restaurant?: string; dish?: string }>();
  const restaurant = getRestaurant(typeof params.restaurant === 'string' ? params.restaurant : undefined);
  const menu = getMenu(restaurant.id);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/order');
  };

  const onAddToCart = () => {
    router.push({
      pathname: '/cart',
      params: { source: 'food', restaurant: restaurant.id },
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

        <VStack space="xs">
          <Text size="xl" className="font-bold text-foreground">
            {restaurant.name}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {restaurant.etaMinutes} min · {restaurant.rating} ★ · Indiranagar
          </Text>
        </VStack>

        {menu.map((section) => (
          <VStack key={section.title} space="sm">
            <Text size="sm" className="font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </Text>
            {section.items.map((item) => (
              <Box
                key={item.id}
                className="flex-row items-center justify-between border-b border-border py-2"
              >
                <Text size="md" className="text-foreground">
                  {item.name}
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  ₹{formatInr(item.price)}
                </Text>
              </Box>
            ))}
          </VStack>
        ))}

        <Pressable
          onPress={onAddToCart}
          className="items-center rounded-full bg-primary py-3"
          accessibilityRole="button"
          accessibilityLabel="View cart"
        >
          <Text size="md" className="font-semibold text-primary-foreground">
            View cart
          </Text>
        </Pressable>
      </ScrollView>
    </Box>
  );
}
