import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FullListSheet } from '@/components/voice/full-list-sheet';
import { RecognizedList } from '@/components/voice/recognized-list';
import { ShowCartButton } from '@/components/voice/show-cart-button';
import { VoiceHeader } from '@/components/voice/voice-header';
import { VoiceOrb } from '@/components/voice/voice-orb';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Brand } from '@/constants/theme';
import {
  orbLabel,
  snapshotAtElapsed,
  type VoiceOrbState,
  type VoicePhase,
} from '@/data/voice-mock';
import { useThemeMode } from '@/theme/theme-mode';

function phaseToOrb(phase: VoicePhase): VoiceOrbState {
  if (phase === 'thinking') return 'thinking';
  if (phase === 'speaking') return 'speaking';
  return 'listening';
}

export default function VoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeMode();

  const [phase, setPhase] = useState<VoicePhase>('listening');
  const [visibleCount, setVisibleCount] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [typedOrder, setTypedOrder] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const elapsedRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<VoicePhase>('listening');
  const visibleCountRef = useRef(0);

  const applySnapshot = useCallback((elapsedMs: number) => {
    const snap = snapshotAtElapsed(elapsedMs);
    if (snap.phase !== phaseRef.current) {
      phaseRef.current = snap.phase;
      setPhase(snap.phase);
    }
    if (snap.visibleCount !== visibleCountRef.current) {
      visibleCountRef.current = snap.visibleCount;
      setVisibleCount(snap.visibleCount);
    }
  }, []);

  useEffect(() => {
    elapsedRef.current = 0;
    lastFrameRef.current = null;

    let frameId = 0;
    const tick = (now: number) => {
      if (lastFrameRef.current != null) {
        elapsedRef.current += now - lastFrameRef.current;
      }
      lastFrameRef.current = now;
      applySnapshot(elapsedRef.current);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      lastFrameRef.current = null;
    };
  }, [applySnapshot]);

  const orbState = useMemo(() => phaseToOrb(phase), [phase]);
  const cartEnabled = phase === 'speaking';
  const textColor = isDark ? Brand.surface : Brand.ink;

  const onCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const onShowCart = () => {
    if (!cartEnabled) return;
    router.push('/cart');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <VStack
        className="flex-1 px-5"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <VoiceHeader
          onCancel={onCancel}
          onToggleKeyboard={() => setKeyboardOpen((v) => !v)}
          keyboardOpen={keyboardOpen}
        />

        <VStack className="flex-1 items-center justify-center gap-5 py-4">
          <VoiceOrb state={orbState} />
          <Text
            size="sm"
            className="font-semibold uppercase tracking-widest text-muted-foreground"
          >
            {orbLabel(orbState)}
          </Text>
        </VStack>

        <VStack space="md" className="w-full">
          {keyboardOpen ? (
            <TextInput
              value={typedOrder}
              onChangeText={setTypedOrder}
              placeholder="Type your order instead…"
              placeholderTextColor={Brand.muted}
              className="rounded-lg border border-border bg-card px-3.5 py-3 text-[14px]"
              style={{ color: textColor }}
              returnKeyType="done"
              accessibilityLabel="Type your order"
            />
          ) : null}

          <View>
            <RecognizedList
              visibleCount={visibleCount}
              onSeeFullList={() => setSheetOpen(true)}
            />
          </View>

          <ShowCartButton enabled={cartEnabled} onPress={onShowCart} />
        </VStack>
      </VStack>

      <FullListSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Box>
  );
}
