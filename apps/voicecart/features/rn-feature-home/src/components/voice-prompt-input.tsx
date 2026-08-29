import { TextInput } from 'react-native';

import { Box, HStack, Pressable, Text } from '@voicecart/rn-ui';
import { Brand, useThemeMode } from '@voicecart/rn-theme';

type VoicePromptInputProps = {
  onMicPress: () => void;
};

export function VoicePromptInput({ onMicPress }: VoicePromptInputProps) {
  const { isDark } = useThemeMode();

  return (
    <HStack className="items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3">
      <TextInput
        placeholder="What do you want to eat?"
        placeholderTextColor={Brand.muted}
        style={{
          color: isDark ? Brand.surface : Brand.ink,
          minHeight: 44,
          flex: 1,
          fontSize: 14.5,
        }}
        accessibilityLabel="What do you want to eat"
      />
      <Pressable
        onPress={onMicPress}
        accessibilityRole="button"
        accessibilityLabel="Speak your request"
        className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary"
      >
        <Text size="2xs" className="text-primary-foreground">
          mic
        </Text>
      </Pressable>
    </HStack>
  );
}
