import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AudioSession,
  LiveKitRoom,
  useConnectionState,
  useLocalParticipant,
  useTrackVolume,
} from '@livekit/react-native';
import { ConnectionState, Track } from 'livekit-client';

import { Box } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import {
  fetchLiveKitConnection,
  mapTrackVolumeToOrbLevel,
  orbLabel,
  type LiveKitConnection,
} from '@voicecart/rn-feature-voice-core';

import { VoiceOrb } from './voice-orb';

type LiveTalkSessionProps = {
  children: ReactNode;
};

export function LiveTalkSession({ children }: LiveTalkSessionProps) {
  const [connection, setConnection] = useState<LiveKitConnection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        await AudioSession.startAudioSession();
        const next = await fetchLiveKitConnection();
        if (!cancelled) {
          setConnection(next);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not start voice');
        }
      }
    };

    void start();

    return () => {
      cancelled = true;
      void AudioSession.stopAudioSession();
    };
  }, []);

  if (error) {
    return (
      <Box className="flex-1 items-center justify-center px-2">
        <VStack space="sm" className="items-center">
          <Text size="md" className="text-center text-foreground">
            Could not connect
          </Text>
          <Text size="sm" className="text-center text-muted-foreground">
            {error}
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!connection) {
    return (
      <VStack className="flex-1 items-center justify-center gap-5 py-4">
        <VoiceOrb state="listening" level={0} />
        <Text
          size="sm"
          className="font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Connecting…
        </Text>
      </VStack>
    );
  }

  return (
    <Box className="flex-1">
      <LiveKitRoom
        serverUrl={connection.serverUrl}
        token={connection.token}
        audio
        video={false}
        connect
        onError={(err) => setError(err.message)}
      >
        {children}
      </LiveKitRoom>
    </Box>
  );
}

export function LiveListeningMeter() {
  const connectionState = useConnectionState();
  const { localParticipant, microphoneTrack } = useLocalParticipant();
  const connected = connectionState === ConnectionState.Connected;

  const trackRef = useMemo(() => {
    if (!microphoneTrack) {
      return undefined;
    }
    return {
      participant: localParticipant,
      publication: microphoneTrack,
      source: Track.Source.Microphone,
    };
  }, [localParticipant, microphoneTrack]);

  const volume = useTrackVolume(trackRef);
  const level = mapTrackVolumeToOrbLevel(volume);

  return (
    <VStack className="flex-1 items-center justify-center gap-5 py-4">
      <VoiceOrb state="listening" level={connected ? level : 0} />
      <Text
        size="sm"
        className="font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {connected ? orbLabel('listening') : 'Connecting…'}
      </Text>
    </VStack>
  );
}
