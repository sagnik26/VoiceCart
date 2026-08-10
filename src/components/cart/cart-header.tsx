import Svg, { Path } from 'react-native-svg';

import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Brand } from '@/constants/theme';
import { useThemeMode } from '@/theme/theme-mode';

type CartHeaderProps = {
  onBack: () => void;
};

export function CartHeader({ onBack }: CartHeaderProps) {
  const { isDark } = useThemeMode();
  const chevronColor = isDark ? Brand.surface : Brand.ink;

  return (
    <HStack className="items-center gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
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
      <Text size="lg" className="font-bold text-foreground">
        Your cart
      </Text>
    </HStack>
  );
}
