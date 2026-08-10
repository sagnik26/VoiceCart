import { TextInput } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Brand } from '@/constants/theme';
import { useThemeMode } from '@/theme/theme-mode';

type DishInputProps = {
  value: string;
  onChangeText: (value: string) => void;
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

export function DishInput({ value, onChangeText }: DishInputProps) {
  const { isDark } = useThemeMode();
  const textColor = isDark ? Brand.surface : Brand.ink;
  const placeholderColor = Brand.muted;

  return (
    <HStack className="items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="What are you cooking?"
        placeholderTextColor={placeholderColor}
        className="min-h-11 flex-1 text-[14.5px]"
        style={{ color: textColor }}
        returnKeyType="done"
        accessibilityLabel="Dish description"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Speak dish name"
        // Visual only until speech is wired.
        onPress={() => {}}
        className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary"
      >
        <MicIcon />
      </Pressable>
    </HStack>
  );
}
