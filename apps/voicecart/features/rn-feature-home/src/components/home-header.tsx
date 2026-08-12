import { Heading } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Pressable } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { HOME_USER, greetingForHour } from '@voicecart/rn-feature-home-core';

type HomeHeaderProps = {
  onOpenSettings: () => void;
};

export function HomeHeader({ onOpenSettings }: HomeHeaderProps) {
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
  );
}
