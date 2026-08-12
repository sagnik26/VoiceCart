import Svg, { Path, Rect } from 'react-native-svg';

import { HStack } from '@voicecart/rn-ui';
import { Pressable } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import { useThemeMode } from '@voicecart/rn-theme';

type VoiceHeaderProps = {
  onCancel: () => void;
  onToggleKeyboard: () => void;
  keyboardOpen: boolean;
};

function KeyboardIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth={2} />
      <Path
        d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function VoiceHeader({ onCancel, onToggleKeyboard, keyboardOpen }: VoiceHeaderProps) {
  const { isDark } = useThemeMode();
  const iconColor = isDark ? Brand.surface : Brand.ink;

  return (
    <HStack className="items-center justify-between px-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cancel voice capture"
        onPress={onCancel}
        className="min-h-11 justify-center py-2"
        hitSlop={8}
      >
        <Text size="md" className="text-muted-foreground">
          Cancel
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={keyboardOpen ? 'Hide keyboard input' : 'Type order instead'}
        accessibilityState={{ selected: keyboardOpen }}
        onPress={onToggleKeyboard}
        className="h-9 w-9 items-center justify-center rounded-full bg-secondary"
      >
        <KeyboardIcon color={iconColor} />
      </Pressable>
    </HStack>
  );
}
