import { forwardRef, useImperativeHandle } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

export type TabLottieHandle = {
  play: (startFrame?: number, endFrame?: number) => void;
};

export type TabLottieProps = {
  source: object;
  keypath?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export const TabLottie = forwardRef<TabLottieHandle, TabLottieProps>(function TabLottie(
  { color, style },
  ref,
) {
  useImperativeHandle(ref, () => ({
    play() {
      // Web uses a static placeholder; native plays the Lottie.
    },
  }));

  return <View style={[style, { backgroundColor: color, borderRadius: 999, opacity: 0.35 }]} />;
});
