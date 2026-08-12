import { Heading } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';

export function KitchenHeader() {
  return (
    <VStack space="xs">
      <Heading size="xl" className="text-foreground tracking-tight">
        Kitchen
      </Heading>
      <Text size="sm" className="text-muted-foreground">
        Tell me what you&apos;re cooking — I&apos;ll list what&apos;s missing.
      </Text>
    </VStack>
  );
}
