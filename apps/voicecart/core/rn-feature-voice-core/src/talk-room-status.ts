export const TALK_CONNECT_TIMEOUT_MS = 15_000;

export const TALK_HEARING_ROOM_AUDIO_LABEL = 'Hearing room audio';

export type TalkRoomStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed';

export type RemoteAudioPresence = {
  isLocal: boolean;
  isAudio: boolean;
  isSubscribed: boolean;
};

export function talkRoomStatusLabel(status: TalkRoomStatus): string {
  switch (status) {
    case 'connecting':
      return 'Connecting…';
    case 'connected':
      return 'Listening…';
    case 'reconnecting':
      return 'Reconnecting…';
    case 'failed':
      return 'Could not connect';
  }
}

/** True when at least one subscribed remote audio track is present. */
export function hasRemoteRoomAudio(
  tracks: ReadonlyArray<RemoteAudioPresence>
): boolean {
  return tracks.some((track) => !track.isLocal && track.isAudio && track.isSubscribed);
}

/**
 * LiveKit-free check for an agent participant. Protocol `Kind.AGENT` is 4.
 */
export function isAgentParticipantKind(kind: string | number): boolean {
  if (kind === 4 || kind === '4') {
    return true;
  }
  return typeof kind === 'string' && kind.toLowerCase() === 'agent';
}

/**
 * Maps LiveKit `ConnectionState` string values. Core stays LiveKit-free.
 * Initial `disconnected` is treated as failed by this mapper; the session
 * UI should keep showing connecting until the room has connected once.
 */
export function mapLiveKitConnectionState(state: string): TalkRoomStatus {
  switch (state) {
    case 'connected':
      return 'connected';
    case 'reconnecting':
    case 'signalReconnecting':
      return 'reconnecting';
    case 'disconnected':
      return 'failed';
    default:
      return 'connecting';
  }
}
