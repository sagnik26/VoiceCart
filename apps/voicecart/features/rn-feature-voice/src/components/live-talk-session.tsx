import type { ReactNode } from 'react';

import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { talkRoomStatusLabel } from '@voicecart/rn-feature-voice-core';

type LiveTalkSessionProps = {
  children: ReactNode;
};

/** Web: LiveKit native WebRTC is not loaded. */
export function LiveTalkSession({ children }: LiveTalkSessionProps) {
  return <>{children}</>;
}

export function LiveListeningMeter() {
  return (
    <VStack className="flex-1 items-center justify-center gap-5 py-4">
      <Text
        size="sm"
        className="font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {talkRoomStatusLabel('connecting')}
      </Text>
      <Text size="sm" className="text-center text-muted-foreground">
        Live metering is not available on web.
      </Text>
    </VStack>
  );
}
