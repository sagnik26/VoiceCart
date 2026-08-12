import Svg, { Path } from 'react-native-svg';

import { HStack } from '@voicecart/rn-ui';
import { Pressable } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import { formatInr } from '@voicecart/rn-theme';
import type { CartLineItem } from '@voicecart/rn-feature-cart-core';
import { useThemeMode } from '@voicecart/rn-theme';

type CartLineItemRowProps = {
  item: CartLineItem;
  onInc: () => void;
  onDec: () => void;
};

export function CartLineItemRow({ item, onInc, onDec }: CartLineItemRowProps) {
  const { isDark } = useThemeMode();
  const iconColor = isDark ? Brand.surface : Brand.ink;
  const lineTotal = item.price * item.qty;

  return (
    <HStack className="items-center gap-2.5 border-b border-border py-3">
      <VStack className="min-w-0 flex-1">
        <Text size="md" className="font-semibold text-foreground">
          {item.name}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          ₹{formatInr(item.price)} each
        </Text>
      </VStack>

      {item.editable ? (
        <HStack className="items-center gap-2.5 rounded-full border border-border px-2 py-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Decrease ${item.name}`}
            onPress={onDec}
            className="h-6 w-6 items-center justify-center"
            hitSlop={6}
          >
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M5 12h14" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </Pressable>
          <Text size="sm" className="min-w-[14px] text-center font-semibold text-foreground">
            {item.qty}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Increase ${item.name}`}
            onPress={onInc}
            className="h-6 w-6 items-center justify-center"
            hitSlop={6}
          >
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5V19M5 12H19" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </HStack>
      ) : (
        <Text size="sm" className="font-semibold text-muted-foreground">
          ×{item.qty}
        </Text>
      )}

      <Text size="md" className="min-w-[52px] text-right font-bold text-foreground">
        ₹{formatInr(lineTotal)}
      </Text>
    </HStack>
  );
}
