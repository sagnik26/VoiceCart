import { usePathname, useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { createAnimatedPressable, PressableScale, PressablesConfig } from 'pressto';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TAB_SPRING = { damping: 22, stiffness: 140, mass: 0.85 } as const;
const PRESS_ROTATE_DEG = 45;

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ rotate: `${progress * PRESS_ROTATE_DEG}deg` }],
  };
});

function HomeIcon({ color }: { color: string }) {
  return (
    <View style={[styles.iconBox, { borderColor: color }]}>
      <View style={[styles.homeRoof, { borderBottomColor: color }]} />
      <View style={[styles.homeBody, { borderColor: color }]} />
    </View>
  );
}

function KitchenIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconBox}>
      <View style={[styles.potRim, { backgroundColor: color }]} />
      <View style={[styles.potBody, { borderColor: color }]} />
    </View>
  );
}

function MicIcon() {
  return (
    <View style={styles.micOuter}>
      <View style={styles.micCapsule} />
      <View style={styles.micStand} />
    </View>
  );
}

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const activeRoute = state.routes[state.index]?.name;
  const homeActive = activeRoute === 'index';
  const kitchenActive = activeRoute === 'kitchen';

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
      defaultProps={{ rippleColor: 'transparent' }}
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
        <PressableRotate
          accessibilityRole="button"
          accessibilityState={{ selected: homeActive }}
          onPress={() => navigation.navigate('index')}
          style={styles.sideTab}
        >
          <HomeIcon color={homeActive ? Brand.primary : colors.textSecondary} />
          <Text
            style={[
              styles.label,
              { color: homeActive ? Brand.primary : colors.textSecondary },
              homeActive && styles.labelActive,
            ]}
          >
            Home
          </Text>
        </PressableRotate>

        <PressablesConfig
          animationType="spring"
          animationConfig={TAB_SPRING}
          config={{ baseScale: 1, minScale: 1.08 }}
          defaultProps={{ rippleColor: 'transparent' }}
        >
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Talk"
            onPress={() => router.push('/voice')}
            style={styles.talkWrap}
          >
            <View style={[styles.talkButton, { backgroundColor: Brand.primary }]}>
              <MicIcon />
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Talk</Text>
          </PressableScale>
        </PressablesConfig>

        <PressableRotate
          accessibilityRole="button"
          accessibilityState={{ selected: kitchenActive }}
          onPress={() => navigation.navigate('kitchen')}
          style={styles.sideTab}
        >
          <KitchenIcon color={kitchenActive ? Brand.primary : colors.textSecondary} />
          <Text
            style={[
              styles.label,
              { color: kitchenActive ? Brand.primary : colors.textSecondary },
              kitchenActive && styles.labelActive,
            ]}
          >
            Kitchen
          </Text>
        </PressableRotate>
      </View>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sideTab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    minHeight: Brand.touchTarget,
    justifyContent: 'center',
  },
  talkWrap: {
    flex: 1,
    alignItems: 'center',
    marginTop: -26,
    gap: 3,
  },
  talkButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  label: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  labelActive: {
    fontWeight: '700',
  },
  iconBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeBody: {
    width: 14,
    height: 10,
    borderWidth: 1.5,
    borderTopWidth: 0,
  },
  potRim: {
    width: 16,
    height: 2,
    borderRadius: 1,
    marginBottom: 1,
  },
  potBody: {
    width: 14,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  micOuter: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micCapsule: {
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  micStand: {
    width: 10,
    height: 2,
    marginTop: 2,
    borderRadius: 1,
    backgroundColor: '#fff',
  },
});
