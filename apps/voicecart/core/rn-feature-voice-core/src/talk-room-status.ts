export const TALK_CONNECT_TIMEOUT_MS = 15_000;

export type TalkRoomStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed';

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
