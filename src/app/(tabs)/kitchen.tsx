import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DishInput } from '@/components/kitchen/dish-input';
import { KitchenHeader } from '@/components/kitchen/kitchen-header';
import { RecentDishes } from '@/components/kitchen/recent-dishes';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { resolveDish } from '@/data/kitchen-mock';

export default function KitchenScreen() {
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
