import Svg, { Path } from 'react-native-svg';

import { HStack } from '@voicecart/rn-ui';
import { Pressable } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import { useThemeMode } from '@voicecart/rn-theme';

type HistoryHeaderProps = {
  onBack: () => void;
};

export function HistoryHeader({ onBack }: HistoryHeaderProps) {
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
        Order history
      </Text>
    </HStack>
  );
}
