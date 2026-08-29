import { TextInput } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { HStack, Pressable } from '@voicecart/rn-ui';
import { Brand, useThemeMode } from '@voicecart/rn-theme';

type DishInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onMicPress?: () => void;
  placeholder?: string;
};

function MicIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth={2} />
      <Path d="M5 10a7 7 0 0 0 14 0" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 19v3" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 22h8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function DishInput({
  value,
  onChangeText,
  onMicPress,
  placeholder = 'What are you cooking?',
}: DishInputProps) {
  const { isDark } = useThemeMode();
  const textColor = isDark ? Brand.surface : Brand.ink;

  return (
    <HStack className="items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Brand.muted}
        style={{
          color: textColor,
          minHeight: 44,
          flex: 1,
          fontSize: 14.5,
        }}
        returnKeyType="done"
        accessibilityLabel="Dish description"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Speak dish name"
        onPress={onMicPress}
        className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary"
      >
        <MicIcon />
      </Pressable>
    </HStack>
  );
}
