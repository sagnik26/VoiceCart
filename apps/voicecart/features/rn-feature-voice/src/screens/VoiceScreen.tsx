import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FullListSheet } from '../components/full-list-sheet';
import { LiveTalkSession } from '../components/live-talk-session';
import { MicNeeded } from '../components/mic-needed';
import { RecognizedList } from '../components/recognized-list';
import { ShowCartButton } from '../components/show-cart-button';
import { VoiceHeader } from '../components/voice-header';
import { VoiceOrb } from '../components/voice-orb';
import { Box, Button, ButtonText, Text, VStack } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import {
  isLiveMeteringEnabled,
  micPermissionLabel,
  orbLabel,
  snapshotAtElapsed,
  useMicPermission,
  type VoiceOrbState,
  type VoicePhase,
} from '@voicecart/rn-feature-voice-core';
import { useThemeMode } from '@voicecart/rn-theme';

function phaseToOrb(phase: VoicePhase): VoiceOrbState {
  if (phase === 'thinking') return 'thinking';
  if (phase === 'speaking') return 'speaking';
  return 'listening';
}

export function VoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeMode();
  const { status: micStatus, isRequesting, request } = useMicPermission();
  const micReady = micStatus === 'granted';
  const liveMeteringEnabled = useMemo(() => isLiveMeteringEnabled(), []);
  const useLivePath = liveMeteringEnabled && micReady;

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
    if (!micReady || useLivePath) {
      return;
    }

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
  }, [applySnapshot, micReady, useLivePath]);

  const orbState = useMemo(() => phaseToOrb(phase), [phase]);
  const cartEnabled = micReady && !useLivePath && phase === 'speaking';
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

  const bottomChrome = (
    <VStack space="md" className="w-full">
      {keyboardOpen ? (
        <TextInput
          value={typedOrder}
          onChangeText={setTypedOrder}
          placeholder="Type your request instead…"
          placeholderTextColor={Brand.muted}
          style={{
            color: textColor,
            borderWidth: 1,
            borderColor: Brand.border,
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 14,
          }}
          returnKeyType="done"
          accessibilityLabel="Type your request"
        />
      ) : null}

      <View>
        <RecognizedList
          visibleCount={useLivePath ? 0 : micReady ? visibleCount : 0}
          onSeeFullList={() => setSheetOpen(true)}
        />
      </View>

      <ShowCartButton enabled={cartEnabled} onPress={onShowCart} />
      <Button variant="outline" onPress={() => setKeyboardOpen(true)} className="h-10 rounded-full">
        <ButtonText>Type instead</ButtonText>
      </Button>
    </VStack>
  );

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

        <Box className="self-start rounded-md border border-primary/30 bg-primary/10 px-2 py-1">
          <Text size="2xs" className="text-primary">
            Used from Home, Kitchen and Order
          </Text>
        </Box>

        {micStatus === 'denied' ? (
          <MicNeeded onAllow={() => void request()} isRequesting={isRequesting} />
        ) : useLivePath ? (
          <LiveTalkSession>
            {bottomChrome}
          </LiveTalkSession>
        ) : (
          <>
            <VStack className="flex-1 items-center justify-center gap-5 py-4">
              <VoiceOrb state={micReady ? orbState : 'listening'} />
              <Text
                size="sm"
                className="font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {micReady ? orbLabel(orbState) : micPermissionLabel(micStatus)}
              </Text>
              {micReady ? (
                <Text
                  size="xs"
                  className="text-muted-foreground"
                  accessibilityLabel="Microphone permission granted"
                >
                  {micPermissionLabel('granted')}
                </Text>
              ) : null}
            </VStack>
            {bottomChrome}
          </>
        )}
      </VStack>

      <FullListSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Box>
  );
}
