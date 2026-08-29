import type { AnimationObject } from 'lottie-react-native';
import { usePathname } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { PressableScale, PressablesConfig } from 'pressto';
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors } from '@voicecart/rn-theme';

import { NOTCH_ICON_SIZE, NOTCH_MOTION_MS } from './notch-tab-bar-layout';
import { TabLottie, type TabLottieHandle } from './tab-lottie';

const homeLottie = require('./assets/lottie/home.json') as AnimationObject;
const kitchenLottie = require('./assets/lottie/kitchen.json') as AnimationObject;

const TAB_SPRING = { damping: 20, stiffness: 360, mass: 0.35 } as const;
const TAB_DEFAULT_PROPS = { rippleColor: 'transparent' } as const;
const MOTION = { duration: NOTCH_MOTION_MS } as const;
const ACTIVE_PILL_WIDTH = 18;
const TAB_ICON_SIZE = NOTCH_ICON_SIZE;

type TabKey = 'index' | 'kitchen' | 'order';

const HIDDEN_PREFIXES = [
  '/voice',
  '/cart',
  '/disambiguation',
  '/order-status',
  '/ingredients',
  '/ingredient-list',
  '/decide',
  '/reverse',
  '/pantry',
  '/menu',
  '/history',
  '/settings',
  '/profile',
];

function IconSlot({ children, scale = 1 }: { children: ReactNode; scale?: number }) {
  return (
    <View style={[styles.iconSlot, scale !== 1 && { transform: [{ scale }] }]}>{children}</View>
  );
}

function OrderIcon({ color }: { color: string }) {
  return (
    <IconSlot>
      <View style={styles.orderIcon}>
        <View style={[styles.bagHandle, { borderColor: color }]} />
        <View style={[styles.bagBody, { borderColor: color }]} />
      </View>
    </IconSlot>
  );
}

type LottieTabItemProps = {
  active: boolean;
  label: string;
  source: AnimationObject;
  keypath: string;
  activeColor: string;
  inactiveColor: string;
  accessibilityLabel: string;
  accessibilityState?: { selected: boolean };
  onPress: () => void;
  iconScale?: number;
};

function LottieTabItem({
  active,
  label,
  source,
  keypath,
  activeColor,
  inactiveColor,
  accessibilityLabel,
  accessibilityState,
  onPress,
  iconScale = 1,
}: LottieTabItemProps) {
  const lottieRef = useRef<TabLottieHandle>(null);
  const hasMounted = useRef(false);
  const color = active ? activeColor : inactiveColor;

  useEffect(() => {
    const { ip, op } = source;
    if (active) {
      lottieRef.current?.play(ip, op);
    } else if (hasMounted.current) {
      lottieRef.current?.play(op, ip);
    }
    hasMounted.current = true;
  }, [active, source]);

  const animatedIconStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active ? 1.08 : 1, MOTION) }],
  }));

  const animatedPillStyles = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0, MOTION),
    transform: [{ scaleX: withTiming(active ? 1 : 0.3, MOTION) }],
  }));

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      onPress={onPress}
      style={styles.tabItem}
    >
      <Animated.View style={animatedIconStyles}>
        <IconSlot scale={iconScale}>
          <TabLottie
            ref={lottieRef}
            source={source}
            keypath={keypath}
            color={color}
            style={styles.lottieIcon}
          />
        </IconSlot>
      </Animated.View>
      <Animated.View
        style={[styles.activePill, { backgroundColor: activeColor }, animatedPillStyles]}
      />
      <Text style={[styles.label, { color }, active && styles.labelActive]}>{label}</Text>
    </PressableScale>
  );
}

type StaticTabItemProps = {
  active: boolean;
  label: string;
  activeColor: string;
  inactiveColor: string;
  accessibilityLabel: string;
  onPress: () => void;
  renderIcon: (color: string) => ReactNode;
};

function StaticTabItem({
  active,
  label,
  activeColor,
  inactiveColor,
  accessibilityLabel,
  onPress,
  renderIcon,
}: StaticTabItemProps) {
  const color = active ? activeColor : inactiveColor;

  const animatedIconStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active ? 1.08 : 1, MOTION) }],
  }));

  const animatedPillStyles = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0, MOTION),
    transform: [{ scaleX: withTiming(active ? 1 : 0.3, MOTION) }],
  }));

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tabItem}
    >
      <Animated.View style={animatedIconStyles}>{renderIcon(color)}</Animated.View>
      <Animated.View
        style={[styles.activePill, { backgroundColor: activeColor }, animatedPillStyles]}
      />
      <Text style={[styles.label, { color }, active && styles.labelActive]}>{label}</Text>
    </PressableScale>
  );
}

export function KitchenAppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = Colors.dark;
  const pathname = usePathname();

  const activeRoute = state.routes[state.index]?.name as TabKey;

  const homeActive = activeRoute === 'index';
  const kitchenActive = activeRoute === 'kitchen';
  const orderActive = activeRoute === 'order';

  const homeA11y = useMemo(() => ({ selected: homeActive }), [homeActive]);
  const kitchenA11y = useMemo(() => ({ selected: kitchenActive }), [kitchenActive]);

  const onHome = useCallback(() => navigation.navigate('index'), [navigation]);
  const onKitchen = useCallback(() => navigation.navigate('kitchen'), [navigation]);
  const onOrder = useCallback(() => navigation.navigate('order'), [navigation]);

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <PressablesConfig
      animationType="spring"
      animationConfig={TAB_SPRING}
      defaultProps={TAB_DEFAULT_PROPS}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <LottieTabItem
          active={homeActive}
          label="Home"
          source={homeLottie}
          keypath="home"
          activeColor={Brand.primary}
          inactiveColor={colors.textSecondary}
          accessibilityLabel="Home"
          accessibilityState={homeA11y}
          onPress={onHome}
        />
        <LottieTabItem
          active={kitchenActive}
          label="Kitchen"
          source={kitchenLottie}
          keypath="kitchen"
          iconScale={1.28}
          activeColor={Brand.primary}
          inactiveColor={colors.textSecondary}
          accessibilityLabel="Kitchen"
          accessibilityState={kitchenA11y}
          onPress={onKitchen}
        />
        <StaticTabItem
          active={orderActive}
          label="Order"
          activeColor={Brand.primary}
          inactiveColor={colors.textSecondary}
          accessibilityLabel="Order"
          onPress={onOrder}
          renderIcon={(color) => <OrderIcon color={color} />}
        />
      </View>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 8,
    paddingHorizontal: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: Brand.touchTarget,
    paddingTop: 4,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  labelActive: {
    fontWeight: '700',
  },
  activePill: {
    height: 3,
    width: ACTIVE_PILL_WIDTH,
    borderRadius: 999,
  },
  lottieIcon: {
    height: TAB_ICON_SIZE,
    width: TAB_ICON_SIZE,
  },
  iconSlot: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagHandle: {
    width: 16,
    height: 7,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: 1,
  },
  bagBody: {
    width: 22,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
  },
});
