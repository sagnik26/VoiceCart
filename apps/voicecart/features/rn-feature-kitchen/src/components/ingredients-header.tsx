import Svg, { Path } from 'react-native-svg';

import { Heading } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Pressable } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import { useThemeMode } from '@voicecart/rn-theme';

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
