import { registerGlobals } from '@livekit/react-native';

/** Registers WebRTC globals required by the LiveKit RN SDK. */
export function setupLiveKit(): void {
  registerGlobals();
}
