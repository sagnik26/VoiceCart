import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartHeader } from '../components/cart-header';
import { CartLineItemRow } from '../components/cart-line-item';
import { CartRestaurant } from '../components/cart-restaurant';
import { CartTotalsBlock } from '../components/cart-totals';
import { Box, Button, ButtonText, Text, VStack } from '@voicecart/rn-ui';
import { getRestaurant } from '@voicecart/rn-feature-order-core';
import {
  buildCart,
  changeQty,
  computeTotals,
  placeOrderLabel,
  resolveCartSource,
  toPlacedOrder,
  type CartLineItem,
} from '@voicecart/rn-feature-cart-core';

export function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ source?: string; dish?: string; restaurant?: string }>();

  const source = resolveCartSource(params.source);
  const dish = typeof params.dish === 'string' ? params.dish : undefined;
  const restaurantId = typeof params.restaurant === 'string' ? params.restaurant : undefined;
  const restaurantName = source === 'food' ? getRestaurant(restaurantId).name : undefined;
  const baseCart = useMemo(
    () => buildCart(source, dish, restaurantId),
    [dish, restaurantId, source]
  );

  const [items, setItems] = useState<CartLineItem[]>(baseCart.items);
  const [loadedKey, setLoadedKey] = useState(`${source}:${dish ?? ''}:${restaurantId ?? ''}`);

  const cartKey = `${source}:${dish ?? ''}:${restaurantId ?? ''}`;
  if (cartKey !== loadedKey) {
    setLoadedKey(cartKey);
    setItems(baseCart.items);
  }

  const totals = useMemo(
    () => computeTotals(items, baseCart.delivery),
    [baseCart.delivery, items]
  );
  const isFood = source === 'food';

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(isFood ? '/(tabs)/order' : '/ingredients');
  };

  const onPlaceOrder = () => {
    const placed = toPlacedOrder({ ...baseCart, items, restaurant: restaurantName ?? baseCart.restaurant }, totals);
    router.replace({
      pathname: '/order-status',
      params: {
        restaurant: placed.restaurant,
        eta: placed.eta,
        total: String(placed.total),
        itemCount: String(placed.itemCount),
        source: placed.source,
      },
    });
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <VStack className="flex-1 px-5">
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <CartHeader onBack={onBack} />
          <CartRestaurant
            name={restaurantName ?? baseCart.restaurant}
            eta={baseCart.eta}
            distance={baseCart.distance}
          />

          <Box className="border-t border-border">
            {items.map((item) => (
              <CartLineItemRow
                key={item.id}
                item={item}
                onInc={() => setItems((prev) => changeQty(prev, item.id, 1))}
                onDec={() => setItems((prev) => changeQty(prev, item.id, -1))}
              />
            ))}
          </Box>

          {baseCart.substitutionNote ? (
            <Text size="sm" className="text-muted-foreground">
              {baseCart.substitutionNote}
            </Text>
          ) : null}

          <CartTotalsBlock totals={totals} />

          {baseCart.cookItCostNote ? (
            <Text size="sm" className="text-muted-foreground">
              {baseCart.cookItCostNote}
            </Text>
          ) : null}
        </ScrollView>

        <View style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 8 }}>
          <Button
            onPress={onPlaceOrder}
            className="h-12 w-full rounded-full"
            accessibilityLabel={placeOrderLabel(totals.total)}
          >
            <ButtonText>{placeOrderLabel(totals.total)}</ButtonText>
          </Button>
        </View>
      </VStack>
    </Box>
  );
}
