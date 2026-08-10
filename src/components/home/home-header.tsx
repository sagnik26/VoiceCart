import Svg, { Circle, Path } from 'react-native-svg';

import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HOME_USER, greetingForHour } from '@/data/home-mock';
import { useThemeMode } from '@/theme/theme-mode';

type HomeHeaderProps = {
  onOpenSettings: () => void;
};

function SunIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={2} />
      <Path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HomeHeader({ onOpenSettings }: HomeHeaderProps) {
  const { isDark, toggleMode } = useThemeMode();
  const iconColor = isDark ? '#FAF9F6' : '#2A2724';

  return (
    <HStack className="items-center justify-between">
      <VStack space="xs">
        <Text size="sm" className="text-muted-foreground">
          {greetingForHour()}
        </Text>
        <Heading size="xl" className="text-foreground tracking-tight">
          {HOME_USER.firstName}
        </Heading>
      </VStack>

      <HStack space="sm" className="items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onPress={toggleMode}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          {isDark ? <SunIcon color={iconColor} /> : <MoonIcon color={iconColor} />}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={onOpenSettings}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <Text size="md" className="font-bold text-foreground">
            {HOME_USER.avatarInitial}
          </Text>
        </Pressable>
      </HStack>
    </HStack>
  );
}
