import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Button, ButtonText } from '@/components/ui/button';
import { Brand } from '@/constants/theme';

type ShowCartButtonProps = {
  enabled: boolean;
  onPress: () => void;
};

export function ShowCartButton({ enabled, onPress }: ShowCartButtonProps) {
  const glow = useSharedValue(0);
  const enabledSv = useSharedValue(0);

  useEffect(() => {
    enabledSv.value = enabled ? 1 : 0;
    if (enabled) {
      glow.value = withRepeat(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      glow.value = withTiming(0, { duration: 200 });
    }
  }, [enabled, enabledSv, glow]);

  const wrapStyle = useAnimatedStyle(() => {
    const on = enabledSv.value;
    return {
      opacity: 0.45 + on * 0.55,
      transform: [{ scale: 1 + glow.value * 0.015 * on }],
      shadowColor: Brand.primary,
      shadowOffset: { width: 0, height: (6 + glow.value * 6) * on },
      shadowOpacity: (0.35 + glow.value * 0.25) * on,
      shadowRadius: (10 + glow.value * 7) * on,
      elevation: on > 0.5 ? 6 : 0,
    };
  });

  return (
    <Animated.View style={wrapStyle}>
      <Button
        onPress={onPress}
        disabled={!enabled}
        className="h-12 w-full rounded-full"
        accessibilityLabel="Show cart"
      >
        <ButtonText>Show cart</ButtonText>
      </Button>
    </Animated.View>
  );
}
