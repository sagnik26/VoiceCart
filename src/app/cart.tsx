import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartHeader } from '@/components/cart/cart-header';
import { CartLineItemRow } from '@/components/cart/cart-line-item';
import { CartRestaurant } from '@/components/cart/cart-restaurant';
import { CartTotalsBlock } from '@/components/cart/cart-totals';
import { PlanImpactBanner } from '@/components/cart/plan-impact-banner';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  buildCart,
  changeQty,
  computeTotals,
  placeOrderLabel,
  planImpactLine,
  resolveCartSource,
  toPlacedOrder,
  type CartLineItem,
} from '@/data/cart-mock';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ source?: string; dish?: string }>();

  const source = resolveCartSource(params.source);
  const dish = typeof params.dish === 'string' ? params.dish : undefined;
  const baseCart = useMemo(() => buildCart(source, dish), [dish, source]);

  const [items, setItems] = useState<CartLineItem[]>(baseCart.items);
  const [loadedKey, setLoadedKey] = useState(`${source}:${dish ?? ''}`);

  const cartKey = `${source}:${dish ?? ''}`;
  if (cartKey !== loadedKey) {
    setLoadedKey(cartKey);
    setItems(baseCart.items);
  }

  const totals = useMemo(
    () => computeTotals(items, baseCart.delivery),
    [baseCart.delivery, items]
  );
  const impact = planImpactLine(source, totals.total);
  const isFood = source === 'food';

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(isFood ? '/voice' : '/ingredients');
    }
  };

  const onPlaceOrder = () => {
    const placed = toPlacedOrder({ ...baseCart, items }, totals);
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
            name={baseCart.restaurant}
            eta={baseCart.eta}
            distance={baseCart.distance}
          />

          <View className="border-t border-border">
            {items.map((item) => (
              <CartLineItemRow
                key={item.id}
                item={item}
                onInc={() => setItems((prev) => changeQty(prev, item.id, 1))}
                onDec={() => setItems((prev) => changeQty(prev, item.id, -1))}
              />
            ))}
          </View>

          <CartTotalsBlock totals={totals} />
          <PlanImpactBanner message={impact} />

          {isFood ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add more by voice"
              onPress={() => router.push('/voice')}
              className="items-center rounded-lg border border-dashed border-border py-2.5"
            >
              <Text size="sm" className="font-semibold text-foreground">
                + Add more by voice
              </Text>
            </Pressable>
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
