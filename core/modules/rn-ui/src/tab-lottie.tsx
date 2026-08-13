import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import LottieView, { type AnimationObject } from 'lottie-react-native';

export type TabLottieHandle = {
  play: (startFrame?: number, endFrame?: number) => void;
};

export type TabLottieProps = {
  source: AnimationObject;
  /** Lottie layer name to recolour, e.g. `home`. Strokes and fills below it follow `color`. */
  keypath?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export const TabLottie = forwardRef<TabLottieHandle, TabLottieProps>(function TabLottie(
  { source, keypath, color, style },
  ref,
) {
  const inner = useRef<LottieView>(null);

  useImperativeHandle(ref, () => ({
    play(startFrame?: number, endFrame?: number) {
      inner.current?.play(startFrame, endFrame);
    },
  }));

  const colorFilters = useMemo(
    () => (keypath && color ? [{ keypath, color }] : undefined),
    [keypath, color],
  );

  return (
    <LottieView
      ref={inner}
      source={source}
      colorFilters={colorFilters}
      loop={false}
      style={style}
    />
  );
});
