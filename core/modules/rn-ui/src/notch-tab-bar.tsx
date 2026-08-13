import type { AnimationObject } from 'lottie-react-native';
import { PressableScale } from 'pressto';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, type AccessibilityState, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import {
  NOTCH_DIP_DEPTH,
  NOTCH_ICON_SIZE,
  NOTCH_ITEM_SIZE,
  NOTCH_MOTION_MS,
  notchTopBorderPath,
} from './notch-tab-bar-layout';
import { TabLottie, type TabLottieHandle } from './tab-lottie';

const MOTION = { duration: NOTCH_MOTION_MS } as const;
const ACTIVE_ICON_SCALE = 1.0;
const ACTIVE_PILL_WIDTH = 18;
const BORDER_WIDTH = 1;

type NotchTabBarProps = {
  borderColor: string;
  children: ReactNode;
};

/** Bar whose top edge is a hairline that dips around its middle slot. */
export function NotchTabBar({ borderColor, children }: NotchTabBarProps) {
  const [width, setWidth] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View style={styles.tabBar} onLayout={onLayout}>
      {width > 0 ? (
        <Svg
          width={width}
          height={NOTCH_DIP_DEPTH + BORDER_WIDTH}
          style={styles.notch}
          pointerEvents="none"
        >
          <Path
            d={notchTopBorderPath(width, BORDER_WIDTH / 2)}
            stroke={borderColor}
            strokeWidth={BORDER_WIDTH}
            fill="none"
          />
        </Svg>
      ) : null}
      <View style={styles.tabBarContainer}>{children}</View>
    </View>
  );
}

type NotchTabItemProps = {
  active: boolean;
  source: AnimationObject;
  /** Lottie layer name carrying the icon strokes. */
  keypath: string;
  activeColor: string;
  inactiveColor: string;
  accessibilityLabel: string;
  accessibilityState?: AccessibilityState;
  onPress: () => void;
};

export function NotchTabItem({
  active,
  source,
  keypath,
  activeColor,
  inactiveColor,
  accessibilityLabel,
  accessibilityState,
  onPress,
}: NotchTabItemProps) {
  const lottieRef = useRef<TabLottieHandle>(null);
  const hasMounted = useRef(false);

  // Icons animate into their selected pose, so leaving a tab has to play back
  // down to the first frame instead of stopping on the last one.
  useEffect(() => {
    const { ip, op } = source;

    if (active) {
      lottieRef.current?.play(ip, op);
    } else if (hasMounted.current) {
      lottieRef.current?.play(op, ip);
    }

    hasMounted.current = true;
  }, [active, source]);

  const animatedIconStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(active ? ACTIVE_ICON_SCALE : 1, MOTION) }],
    };
  });

  const animatedPillStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0, MOTION),
      transform: [{ scaleX: withTiming(active ? 1 : 0.3, MOTION) }],
    };
  });

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      onPress={onPress}
      style={styles.component}
    >
      <Animated.View style={animatedIconStyles}>
        <TabLottie
          ref={lottieRef}
          source={source}
          keypath={keypath}
          color={active ? activeColor : inactiveColor}
          style={styles.icon}
        />
      </Animated.View>
      <Animated.View
        style={[styles.activePill, { backgroundColor: activeColor }, animatedPillStyles]}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    overflow: 'visible',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    overflow: 'visible',
  },
  component: {
    height: NOTCH_ITEM_SIZE,
    width: NOTCH_ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    height: NOTCH_ICON_SIZE,
    width: NOTCH_ICON_SIZE,
  },
  activePill: {
    height: 3,
    width: ACTIVE_PILL_WIDTH,
    borderRadius: 999,
  },
});
