import { usePathname, useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import type { AnimationObject } from 'lottie-react-native';
import { createAnimatedPressable, PressablesConfig } from 'pressto';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors } from '@voicecart/rn-theme';

import { NotchTabBar, NotchTabItem } from './notch-tab-bar';
import { cradleTopOffset } from './notch-tab-bar-layout';
import { TabLottie } from './tab-lottie';

const homeLottie = require('./assets/lottie/home.json') as AnimationObject;
const kitchenLottie = require('./assets/lottie/kitchen.json') as AnimationObject;
const talkLottie = require('./assets/lottie/talk.json') as AnimationObject;

const TAB_SPRING = { damping: 20, stiffness: 360, mass: 0.35 } as const;
const TAB_DEFAULT_PROPS = { rippleColor: 'transparent' } as const;
const TALK_SIZE = 65;
const TALK_ICON_SIZE = 37;
const TALK_SCALE_UP = 1.12;

const PressableScaleUp = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ scale: 1 + (TALK_SCALE_UP - 1) * progress }],
  };
});

export function NotchAppTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeRoute = state.routes[state.index]?.name;
  const homeActive = activeRoute === 'index';
  const kitchenActive = activeRoute === 'kitchen';

  const homeA11y = useMemo(() => ({ selected: homeActive }), [homeActive]);
  const kitchenA11y = useMemo(() => ({ selected: kitchenActive }), [kitchenActive]);

  const onHome = useCallback(() => {
    navigation.navigate('index');
  }, [navigation]);

  const onTalk = useCallback(() => {
    setTimeout(() => {
      router.push('/voice');
    }, 10);
  }, [router]);

  const onKitchen = useCallback(() => {
    navigation.navigate('kitchen');
  }, [navigation]);

  if (
    pathname.startsWith('/voice') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/disambiguation') ||
    pathname.startsWith('/order-status') ||
    pathname.startsWith('/ingredients') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/settings')
  ) {
    return null;
  }

  return (
    <PressablesConfig
      animationType="spring"
      animationConfig={TAB_SPRING}
      defaultProps={TAB_DEFAULT_PROPS}
    >
      <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
        <NotchTabBar borderColor={Colors.dark.border}>
          <NotchTabItem
            active={homeActive}
            source={homeLottie}
            keypath="home"
            activeColor={Brand.primary}
            inactiveColor={Colors.dark.textSecondary}
            accessibilityLabel="Home"
            accessibilityState={homeA11y}
            onPress={onHome}
          />
          <PressableScaleUp
            accessibilityRole="button"
            accessibilityLabel="Talk"
            onPress={onTalk}
            style={styles.talkWrap}
          >
            <View style={styles.talkButton}>
              <TabLottie
                source={talkLottie}
                keypath="mic"
                color={Brand.surface}
                style={styles.talkIcon}
              />
            </View>
          </PressableScaleUp>
          <NotchTabItem
            active={kitchenActive}
            source={kitchenLottie}
            keypath="kitchen"
            activeColor={Brand.primary}
            inactiveColor={Colors.dark.textSecondary}
            accessibilityLabel="Kitchen"
            accessibilityState={kitchenA11y}
            onPress={onKitchen}
          />
        </NotchTabBar>
      </View>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.dark.background,
    overflow: 'visible',
  },
  talkWrap: {
    width: TALK_SIZE,
    alignItems: 'center',
    marginTop: cradleTopOffset(TALK_SIZE),
  },
  talkButton: {
    width: TALK_SIZE,
    height: TALK_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
  },
  talkIcon: {
    height: TALK_ICON_SIZE,
    width: TALK_ICON_SIZE,
  },
});
