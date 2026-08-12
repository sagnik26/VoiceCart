import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HOME_USER, greetingForHour } from '@/data/home-mock';

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
