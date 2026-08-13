import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
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
  TALK_CONNECT_TIMEOUT_MS,
  fetchLiveKitConnection,
  mapLiveKitConnectionState,
  mapTrackVolumeToOrbLevel,
  talkRoomStatusLabel,
  type LiveKitConnection,
  type TalkRoomStatus,
} from '@voicecart/rn-feature-voice-core';

import { TalkRoomFailed } from './talk-room-failed';
import { VoiceOrb } from './voice-orb';

type LiveTalkSessionProps = {
  children: ReactNode;
};

export function LiveTalkSession({ children }: LiveTalkSessionProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const [connection, setConnection] = useState<LiveKitConnection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const retry = useCallback(() => {
    setError(null);
    setConnection(null);
    setSessionKey((key) => key + 1);
  }, []);

  const recover = useCallback(() => {
    setError(null);
  }, []);

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
  }, [sessionKey]);

  useEffect(() => {
    if (connection || error) {
      return;
    }
    const timeout = setTimeout(() => {
      setError('Timed out');
    }, TALK_CONNECT_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [connection, error, sessionKey]);

  if (error && !connection) {
    return <TalkRoomFailed onRetry={retry} />;
  }

  if (!connection) {
    return (
      <VStack className="flex-1 items-center justify-center gap-5 py-4">
        <VoiceOrb state="listening" level={0} />
        <Text
          size="sm"
          className="font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {talkRoomStatusLabel('connecting')}
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
      >
        <TalkRoomBody onFatal={setError} onRecover={recover} onRetry={retry}>
          {children}
        </TalkRoomBody>
      </LiveKitRoom>
    </Box>
  );
}

type TalkRoomBodyProps = {
  children: ReactNode;
  onFatal: (reason: string) => void;
  onRecover: () => void;
  onRetry: () => void;
};

function TalkRoomBody({
  children,
  onFatal,
  onRecover,
  onRetry,
}: TalkRoomBodyProps) {
  const connectionState = useConnectionState();
  const roomStatus = useTalkRoomStatus(connectionState);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (roomStatus === 'connected' || roomStatus === 'reconnecting') {
      setTimedOut(false);
      onRecover();
    }
  }, [onRecover, roomStatus]);

  useEffect(() => {
    if (roomStatus !== 'connecting') {
      return;
    }
    const timeout = setTimeout(() => {
      setTimedOut(true);
      onFatal('Timed out');
    }, TALK_CONNECT_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [onFatal, roomStatus]);

  useEffect(() => {
    if (roomStatus === 'failed') {
      onFatal('Disconnected');
    }
  }, [onFatal, roomStatus]);

  const showFailed = roomStatus === 'failed' || timedOut;

  if (showFailed) {
    return (
      <TalkRoomFailed onRetry={onRetry} />
    );
  }

  return (
    <>
      <LiveListeningMeter roomStatus={roomStatus} />
      {children}
    </>
  );
}

function useTalkRoomStatus(connectionState: ConnectionState): TalkRoomStatus {
  const [everConnected, setEverConnected] = useState(false);

  useEffect(() => {
    if (connectionState === ConnectionState.Connected) {
      setEverConnected(true);
    }
  }, [connectionState]);

  const mapped = mapLiveKitConnectionState(connectionState);
  if (mapped === 'failed' && !everConnected) {
    return 'connecting';
  }
  return mapped;
}

type LiveListeningMeterProps = {
  roomStatus?: TalkRoomStatus;
};

export function LiveListeningMeter({ roomStatus }: LiveListeningMeterProps) {
  const connectionState = useConnectionState();
  const mapped = mapLiveKitConnectionState(connectionState);
  const resolvedStatus = roomStatus ?? (mapped === 'failed' ? 'connecting' : mapped);
  const { localParticipant, microphoneTrack } = useLocalParticipant();
  const connected = resolvedStatus === 'connected';

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
        {talkRoomStatusLabel(resolvedStatus)}
      </Text>
    </VStack>
  );
}
