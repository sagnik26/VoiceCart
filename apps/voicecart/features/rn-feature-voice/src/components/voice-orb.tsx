import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { Brand } from '@voicecart/rn-theme';
import type { VoiceOrbState } from '@voicecart/rn-feature-voice-core';

type VoiceOrbProps = {
  state: VoiceOrbState;
};

function WaveIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12v0" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M7 8v8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M11 4v16" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M15 8v8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M19 10v4" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M21 12v0" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function DotsIcon() {
  return (
    <Svg width={28} height={10} viewBox="0 0 28 10" fill="#fff">
      <Circle cx={5} cy={5} r={2.4} />
      <Circle cx={14} cy={5} r={2.4} />
      <Circle cx={23} cy={5} r={2.4} />
    </Svg>
  );
}

export function VoiceOrb({ state }: VoiceOrbProps) {
  const phaseA = useSharedValue(0);
  const phaseB = useSharedValue(0);
  const corePulse = useSharedValue(0);
  const spin = useSharedValue(0);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const thinkingOn = useSharedValue(0);
  const speakingOn = useSharedValue(0);

  useEffect(() => {
    thinkingOn.value = state === 'thinking' ? 1 : 0;
    speakingOn.value = state === 'speaking' ? 1 : 0;
  }, [speakingOn, state, thinkingOn]);

  useEffect(() => {
    const values = [phaseA, phaseB, corePulse, spin, ripple1, ripple2];

    phaseA.value = withRepeat(
      withTiming(1, { duration: 2300, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    phaseB.value = withRepeat(
      withTiming(1, { duration: 2700, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    corePulse.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    spin.value = withRepeat(
      withTiming(360, { duration: 1100, easing: Easing.linear }),
      -1,
      false
    );
    ripple1.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    const t = setTimeout(() => {
      ripple2.value = withRepeat(
        withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }),
        -1,
        false
      );
    }, 550);
    return () => {
      clearTimeout(t);
      values.forEach(cancelAnimation);
    };
  }, [corePulse, phaseA, phaseB, ripple1, ripple2, spin]);

  const blobAStyle = useAnimatedStyle(() => {
    const a = phaseA.value;
    return {
      opacity: 0.45 - a * 0.37,
      transform: [{ scaleX: 1 + a * 0.38 }, { scaleY: 1 + a * 0.28 }, { rotate: `${a * 6}deg` }],
    };
  });

  const blobBStyle = useAnimatedStyle(() => {
    const b = phaseB.value;
    return {
      opacity: 0.4 - b * 0.34,
      transform: [{ scaleX: 1 + b * 0.22 }, { scaleY: 1 + b * 0.18 }, { rotate: `${-b * 5}deg` }],
    };
  });

  const ring0Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }, { scale: 0.72 }],
    opacity: thinkingOn.value * 0.55,
  }));
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value + 120}deg` }, { scale: 0.86 }],
    opacity: thinkingOn.value * 0.43,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value + 240}deg` }, { scale: 1 }],
    opacity: thinkingOn.value * 0.31,
  }));

  const ripple1Style = useAnimatedStyle(() => {
    const p = ripple1.value;
    return {
      opacity: speakingOn.value * (1 - p) * 0.5,
      transform: [{ scale: 0.5 + p * 0.9 }],
    };
  });

  const ripple2Style = useAnimatedStyle(() => {
    const p = ripple2.value;
    return {
      opacity: speakingOn.value * (1 - p) * 0.5,
      transform: [{ scale: 0.5 + p * 0.9 }],
    };
  });

  const coreStyle = useAnimatedStyle(() => {
    const pulse =
      1 +
      corePulse.value * (speakingOn.value > 0.5 ? 0.04 : 0.05);
    return {
      transform: [{ scale: pulse }],
      shadowOpacity: 0.55 + corePulse.value * 0.15,
      shadowRadius: 12 + corePulse.value * 4,
    };
  });

  const showListening = state === 'listening';

  return (
    <View style={styles.wrap} accessibilityLabel={`Voice orb ${state}`}>
      {showListening ? (
        <>
          <Animated.View style={[styles.blobOuter, blobAStyle]} />
          <Animated.View style={[styles.blobInner, blobBStyle]} />
        </>
      ) : null}

      <Animated.View style={[styles.thinkRing, ring0Style]} />
      <Animated.View style={[styles.thinkRing, ring1Style]} />
      <Animated.View style={[styles.thinkRing, ring2Style]} />

      <Animated.View style={[styles.ripple, ripple1Style]} />
      <Animated.View style={[styles.ripple, ripple2Style]} />

      <Animated.View style={[styles.core, coreStyle]}>
        {state === 'thinking' ? <DotsIcon /> : <WaveIcon />}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobOuter: {
    ...StyleSheet.absoluteFill,
    borderRadius: 70,
    backgroundColor: Brand.primary,
  },
  blobInner: {
    position: 'absolute',
    top: 18,
    right: 18,
    bottom: 18,
    left: 18,
    borderRadius: 52,
    backgroundColor: Brand.primary,
  },
  thinkRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: Brand.primary,
  },
  ripple: {
    ...StyleSheet.absoluteFill,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  core: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.primary,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  highlight: {
    position: 'absolute',
    top: '14%',
    left: '18%',
    width: '38%',
    height: '26%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
