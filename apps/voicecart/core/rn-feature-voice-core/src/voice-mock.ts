export type RecognizedItem = {
  name: string;
  qty: string;
};

export const VOICE_LIST_ITEMS: RecognizedItem[] = [
  { name: 'Butter Chicken', qty: '×1' },
  { name: 'Garlic Naan', qty: '×2' },
  { name: 'Chicken Biryani', qty: '×1' },
  { name: 'Paneer Tikka', qty: '×1' },
  { name: 'Dal Makhani', qty: '×1' },
  { name: 'Jeera Rice', qty: '×2' },
  { name: 'Raita', qty: '×1' },
  { name: 'Gulab Jamun', qty: '×2' },
  { name: 'Mango Lassi', qty: '×1' },
  { name: 'Papadum', qty: '×3' },
];

export const VOICE_PREVIEW_COUNT = 3;

export const VOICE_SCENE_MS = {
  listening: 2400,
  understanding: 3800,
  thinking: 1200,
  itemStagger: 350,
} as const;

export type VoiceOrbState = 'listening' | 'thinking' | 'speaking';

export type VoicePhase = 'listening' | 'understanding' | 'thinking' | 'speaking';

export function orbLabel(state: VoiceOrbState): string {
  switch (state) {
    case 'listening':
      return 'Listening…';
    case 'thinking':
      return 'Thinking…';
    case 'speaking':
      return 'Speaking…';
  }
}

/**
 * Maps LiveKit voice-assistant `state` strings. Core stays LiveKit-free.
 * Unknown / connecting / listening all show the listening orb.
 */
export function mapAgentSessionState(state: string): VoiceOrbState {
  if (state === 'thinking') {
    return 'thinking';
  }
  if (state === 'speaking') {
    return 'speaking';
  }
  return 'listening';
}

export const VOICE_CAPTURE_TOTAL_MS =
  VOICE_SCENE_MS.listening + VOICE_SCENE_MS.understanding + VOICE_SCENE_MS.thinking;

export type VoiceTimelineSnapshot = {
  phase: VoicePhase;
  visibleCount: number;
  finished: boolean;
};

export function snapshotAtElapsed(elapsedMs: number): VoiceTimelineSnapshot {
  const { listening, understanding, thinking, itemStagger } = VOICE_SCENE_MS;
  const understandStart = listening;
  const thinkStart = understandStart + understanding;
  const speakStart = thinkStart + thinking;
  const ms = Math.max(0, elapsedMs);

  let phase: VoicePhase = 'listening';
  if (ms >= speakStart) {
    phase = 'speaking';
  } else if (ms >= thinkStart) {
    phase = 'thinking';
  } else if (ms >= understandStart) {
    phase = 'understanding';
  }

  let visibleCount = 0;
  if (ms >= understandStart) {
    visibleCount = Math.min(
      VOICE_LIST_ITEMS.length,
      Math.floor((ms - understandStart) / itemStagger) + 1
    );
  }

  return {
    phase,
    visibleCount,
    finished: ms >= speakStart,
  };
}
