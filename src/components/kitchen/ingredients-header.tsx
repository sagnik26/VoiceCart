import Svg, { Path } from 'react-native-svg';

import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Brand } from '@/constants/theme';
import { useThemeMode } from '@/theme/theme-mode';

type IngredientsHeaderProps = {
  dishName: string;
  serves: number;
  onBack: () => void;
};

export function IngredientsHeader({ dishName, serves, onBack }: IngredientsHeaderProps) {
  const { isDark } = useThemeMode();
  const chevronColor = isDark ? Brand.surface : Brand.ink;

  return (
    <HStack space="md" className="items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Kitchen"
        onPress={onBack}
        className="h-11 w-11 items-start justify-center"
      >
        <Svg width={11} height={18} viewBox="0 0 12 20" fill="none">
          <Path
            d="M10 2L2 10l8 8"
            stroke={chevronColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <VStack>
        <Heading size="md" className="text-foreground">
          {dishName}
        </Heading>
        <Text size="sm" className="text-muted-foreground">
          Serves {serves}
        </Text>
      </VStack>
    </HStack>
  );
}
