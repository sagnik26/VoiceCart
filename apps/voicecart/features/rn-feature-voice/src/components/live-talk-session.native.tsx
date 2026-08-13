import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import {
  AndroidAudioTypePresets,
  AudioSession,
  LiveKitRoom,
  isTrackReference,
  useConnectionState,
  useLocalParticipant,
  useRemoteParticipants,
  useTrackVolume,
  useTracks,
  useVoiceAssistant,
} from '@livekit/react-native';
import { ConnectionState, RemoteTrackPublication, Track } from 'livekit-client';

import { Box } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import {
  TALK_CONNECT_TIMEOUT_MS,
  TALK_HEARING_ROOM_AUDIO_LABEL,
  fetchLiveKitConnection,
  hasRemoteRoomAudio,
  isAgentParticipantKind,
  mapAgentSessionState,
  mapLiveKitConnectionState,
  mapTrackVolumeToOrbLevel,
  orbLabel,
  talkRoomStatusLabel,
  type LiveKitConnection,
  type TalkRoomStatus,
} from '@voicecart/rn-feature-voice-core';

import { TalkRoomFailed } from './talk-room-failed';
import { VoiceOrb } from './voice-orb';

async function startTalkAudioSession() {
  await AudioSession.configureAudio({
    android: {
      preferredOutputList: ['speaker', 'headset', 'bluetooth', 'earpiece'],
      audioTypeOptions: AndroidAudioTypePresets.communication,
    },
    ios: {
      defaultOutput: 'speaker',
    },
  });
  await AudioSession.startAudioSession();
  await AudioSession.setDefaultRemoteAudioTrackVolume(1);
  try {
    const outputs = await AudioSession.getAudioOutputs();
    const preferred =
      Platform.OS === 'ios'
        ? 'force_speaker'
        : outputs.includes('speaker')
          ? 'speaker'
          : outputs[0];
    if (preferred) {
      await AudioSession.selectAudioOutput(preferred);
    }
  } catch {
    // Speaker routing is best-effort; Talk still joins if the OS keeps earpiece.
  }
}

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
        await startTalkAudioSession();
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
        connectOptions={{ autoSubscribe: true }}
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
  const remotes = useRemoteParticipants();
  const agentPresent = remotes.some((participant) =>
    isAgentParticipantKind(participant.kind)
  );
  const [timedOut, setTimedOut] = useState(false);
  const [agentTimedOut, setAgentTimedOut] = useState(false);
  const [agentSeen, setAgentSeen] = useState(false);

  useEffect(() => {
    if (agentPresent) {
      setAgentSeen(true);
      setAgentTimedOut(false);
      onRecover();
    }
  }, [agentPresent, onRecover]);

  useEffect(() => {
    if (roomStatus === 'reconnecting') {
      setTimedOut(false);
    }
  }, [roomStatus]);

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
    if (roomStatus !== 'connected' || agentPresent) {
      return;
    }
    const timeout = setTimeout(() => {
      setAgentTimedOut(true);
      onFatal('Timed out');
    }, TALK_CONNECT_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [agentPresent, onFatal, roomStatus]);

  useEffect(() => {
    if (roomStatus === 'failed') {
      onFatal('Disconnected');
    }
  }, [onFatal, roomStatus]);

  useEffect(() => {
    if (agentSeen && !agentPresent && roomStatus === 'connected') {
      onFatal('Disconnected');
    }
  }, [agentPresent, agentSeen, onFatal, roomStatus]);

  const waitingForAgent = roomStatus === 'connected' && !agentPresent;
  const agentGone = agentSeen && !agentPresent && roomStatus === 'connected';
  const showFailed =
    roomStatus === 'failed' || timedOut || agentTimedOut || agentGone;
  const meterStatus: TalkRoomStatus = waitingForAgent && !showFailed
    ? 'connecting'
    : roomStatus;

  if (showFailed) {
    return (
      <TalkRoomFailed onRetry={onRetry} />
    );
  }

  return (
    <>
      <LiveListeningMeter roomStatus={meterStatus} />
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
  const { state: agentSessionState } = useVoiceAssistant();
  const connected = resolvedStatus === 'connected';
  const orbState = connected ? mapAgentSessionState(agentSessionState) : 'listening';
  const statusLabel =
    connected && orbState !== 'listening'
      ? orbLabel(orbState)
      : talkRoomStatusLabel(resolvedStatus);
  const roomTracks = useTracks(
    [Track.Source.Microphone, Track.Source.Unknown],
    { onlySubscribed: false }
  );

  useEffect(() => {
    for (const track of roomTracks) {
      if (!isTrackReference(track) || track.participant.isLocal) {
        continue;
      }
      if (!(track.publication instanceof RemoteTrackPublication)) {
        continue;
      }
      if (track.publication.kind !== Track.Kind.Audio) {
        continue;
      }
      if (!track.publication.isSubscribed) {
        track.publication.setSubscribed(true);
      }
    }
  }, [roomTracks]);

  const hearingRemote = hasRemoteRoomAudio(
    roomTracks.flatMap((track) => {
      if (!isTrackReference(track)) {
        return [];
      }
      return [
        {
          isLocal: track.participant.isLocal,
          isAudio: track.publication.kind === Track.Kind.Audio,
          isSubscribed: track.publication.isSubscribed,
        },
      ];
    })
  );

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
  const showMicLevel = connected && orbState === 'listening';

  return (
    <VStack className="flex-1 items-center justify-center gap-5 py-4">
      <VoiceOrb state={orbState} level={showMicLevel ? level : undefined} />
      <Text
        size="sm"
        className="font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {statusLabel}
      </Text>
      {connected && orbState === 'listening' && hearingRemote ? (
        <Text size="xs" className="text-center text-muted-foreground">
          {TALK_HEARING_ROOM_AUDIO_LABEL}
        </Text>
      ) : null}
    </VStack>
  );
}
