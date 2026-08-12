import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DishInput } from '../components/dish-input';
import { KitchenHeader } from '../components/kitchen-header';
import { RecentDishes } from '../components/recent-dishes';
import { Box } from '@voicecart/rn-ui';
import { Button, ButtonText } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { resolveDish } from '@voicecart/rn-feature-kitchen-core';

export function KitchenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [kitchenInput, setKitchenInput] = useState('');

  const onGetIngredients = () => {
    const dish = resolveDish(kitchenInput);
    router.push({ pathname: '/ingredients', params: { dish } });
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
          <DishInput value={kitchenInput} onChangeText={setKitchenInput} />
          <RecentDishes onPick={setKitchenInput} />
          <Button onPress={onGetIngredients} className="mt-2 h-12 w-full rounded-full">
            <ButtonText>Get ingredients</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
