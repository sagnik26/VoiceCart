import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IngredientRow } from '../components/ingredient-row';
import { IngredientsHeader } from '../components/ingredients-header';
import { Box, Button, ButtonText, Text, VStack } from '@voicecart/rn-ui';
import {
  addToCartLabel,
  getDishIngredients,
  getEnabledPantryNames,
  needCount,
  resolveDish,
  type IngredientSelection,
} from '@voicecart/rn-feature-kitchen-core';

export function IngredientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dish?: string; servings?: string }>();
  const dishName = resolveDish(typeof params.dish === 'string' ? params.dish : '');
  const servings = useMemo(() => {
    const raw = typeof params.servings === 'string' ? Number(params.servings) : NaN;
    return Number.isFinite(raw) && raw > 0 ? raw : 2;
  }, [params.servings]);

  const [items, setItems] = useState<IngredientSelection[]>(() =>
    getDishIngredients(dishName, getEnabledPantryNames())
  );
  const [loadedDish, setLoadedDish] = useState(dishName);

  if (dishName !== loadedDish) {
    setLoadedDish(dishName);
    setItems(getDishIngredients(dishName, getEnabledPantryNames()));
  }

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
      params: { source: 'instamart', dish: dishName },
    });
  };

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/kitchen');
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
          <IngredientsHeader dishName={dishName} serves={servings} onBack={onBack} />
          <Text size="sm" className="text-muted-foreground">
            Staples you usually have are pre-marked
          </Text>

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
