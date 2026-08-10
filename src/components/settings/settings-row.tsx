import type { ReactNode } from 'react';
import Svg, { Path } from 'react-native-svg';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Brand } from '@/constants/theme';
import { useThemeMode } from '@/theme/theme-mode';

type SettingsRowProps = {
  label: string;
  trailing?: ReactNode;
  onPress?: () => void;
  showBorder?: boolean;
  destructive?: boolean;
  showChevron?: boolean;
};

export function SettingsRow({
  label,
  trailing,
  onPress,
  showBorder = true,
  destructive = false,
  showChevron = false,
}: SettingsRowProps) {
  const { isDark } = useThemeMode();
  const chevronColor = Brand.muted;

  const content = (
    <HStack
      className={`items-center justify-between py-3.5 ${showBorder ? 'border-b border-border' : ''}`}
    >
      <Text
        size="md"
        className={
          destructive ? 'font-semibold text-destructive' : 'font-medium text-foreground'
        }
      >
        {label}
      </Text>
      <HStack className="items-center gap-2">
        {trailing}
        {showChevron ? (
          <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
            <Path
              d="M1 1l6 6-6 6"
              stroke={isDark ? Brand.surface : chevronColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : null}
      </HStack>
    </HStack>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return <Box>{content}</Box>;
}

export function LinkedBadge({ label }: { label: string }) {
  return (
    <Box className="rounded-full bg-success/15 px-2.5 py-0.5">
      <Text size="xs" className="font-bold text-success">
        {label}
      </Text>
    </Box>
  );
}
