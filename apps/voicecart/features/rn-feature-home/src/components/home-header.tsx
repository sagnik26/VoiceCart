import { Heading, HStack, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { HOME_USER, greetingForHour } from '@voicecart/rn-feature-home-core';

type HomeHeaderProps = {
  onOpenProfile: () => void;
};

export function HomeHeader({ onOpenProfile }: HomeHeaderProps) {
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
        accessibilityLabel="Open profile"
        onPress={onOpenProfile}
        className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
      >
        <Text size="md" className="font-bold text-foreground">
          {HOME_USER.avatarInitial}
        </Text>
      </Pressable>
    </HStack>
  );
}
