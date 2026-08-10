import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IngredientRow } from '@/components/kitchen/ingredient-row';
import { IngredientsHeader } from '@/components/kitchen/ingredients-header';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import {
  addToCartLabel,
  getDishIngredients,
  getDishServes,
  needCount,
  resolveDish,
  type IngredientSelection,
} from '@/data/kitchen-mock';

export default function IngredientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dish?: string }>();
  const dishName = resolveDish(typeof params.dish === 'string' ? params.dish : '');

  const [items, setItems] = useState<IngredientSelection[]>(() => getDishIngredients(dishName));
  const [loadedDish, setLoadedDish] = useState(dishName);

  if (dishName !== loadedDish) {
    setLoadedDish(dishName);
    setItems(getDishIngredients(dishName));
  }

  const serves = useMemo(() => getDishServes(dishName), [dishName]);
  const count = needCount(items);
  const ctaLabel = addToCartLabel(count);

  const onToggle = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, need: !item.need } : item))
    );
  };

  const onAddToCart = () => {
    if (count === 0) return;
    router.push({
      pathname: '/cart',
      params: { source: 'kitchen', dish: dishName },
    });
  };

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/kitchen');
    }
  };

  return (
    <Box className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: Math.max(insets.bottom, 24),
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="lg">
          <IngredientsHeader dishName={dishName} serves={serves} onBack={onBack} />

          <Box>
            {items.map((item, index) => (
              <IngredientRow
                key={item.name}
                item={item}
                onToggle={() => onToggle(index)}
                showDivider={index < items.length - 1}
              />
            ))}
          </Box>

          <Button
            onPress={onAddToCart}
            isDisabled={count === 0}
            className="h-12 w-full rounded-full"
          >
            <ButtonText>{ctaLabel}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
