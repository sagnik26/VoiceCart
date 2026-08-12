import { Platform } from 'react-native';

const NOISE_FLOOR = 0.04;
const GAIN = 1.6;

export type LiveKitConnection = {
  serverUrl: string;
  token: string;
};

function envFlag(value: string | undefined): boolean {
  return value === '1' || value === 'true';
}

function hasTokenSource(): boolean {
  return Boolean(
    process.env.EXPO_PUBLIC_LIVEKIT_TOKEN_URL || process.env.EXPO_PUBLIC_LIVEKIT_TOKEN
  );
}

/** Live metering is off on web and when URL/token env is missing. */
export function isLiveMeteringEnabled(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }
  if (!envFlag(process.env.EXPO_PUBLIC_VOICE_USE_LIVE_METERING)) {
    return false;
  }
  return Boolean(process.env.EXPO_PUBLIC_LIVEKIT_URL && hasTokenSource());
}

/**
 * Map LiveKit `useTrackVolume` (0–1) to orb energy. Values under the noise
 * floor collapse to idle so silence does not jitter the pulse.
 */
export function mapTrackVolumeToOrbLevel(volume: number): number {
  const v = Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 0;
  if (v < NOISE_FLOOR) {
    return 0;
  }
  const scaled = (v - NOISE_FLOOR) / (1 - NOISE_FLOOR);
  return Math.min(1, scaled * GAIN);
}

export async function fetchLiveKitConnection(): Promise<LiveKitConnection> {
  const serverUrl = process.env.EXPO_PUBLIC_LIVEKIT_URL;
  if (!serverUrl) {
    throw new Error('Missing EXPO_PUBLIC_LIVEKIT_URL');
  }

  const staticToken = process.env.EXPO_PUBLIC_LIVEKIT_TOKEN;
  if (staticToken) {
    return { serverUrl, token: staticToken };
  }

  const tokenUrl = process.env.EXPO_PUBLIC_LIVEKIT_TOKEN_URL;
  if (!tokenUrl) {
    throw new Error('Missing EXPO_PUBLIC_LIVEKIT_TOKEN_URL');
  }

  const response = await fetch(tokenUrl);
  if (!response.ok) {
    throw new Error(`Token mint failed (${response.status})`);
  }

  const body: unknown = await response.json();
  const token =
    typeof body === 'object' &&
    body !== null &&
    'token' in body &&
    typeof (body as { token: unknown }).token === 'string'
      ? (body as { token: string }).token
      : null;

  if (!token) {
    throw new Error('Token mint returned no token');
  }

  return { serverUrl, token };
}
