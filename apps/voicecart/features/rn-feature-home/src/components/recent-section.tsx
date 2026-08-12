import { Box } from '@voicecart/rn-ui';
import { Button, ButtonText } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Pressable } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { HOME_RECENT_ORDER, formatInr } from '@voicecart/rn-feature-home-core';

type RecentSectionProps = {
  onSeeAll: () => void;
  onReorder: () => void;
};

export function RecentSection({ onSeeAll, onReorder }: RecentSectionProps) {
  const order = HOME_RECENT_ORDER;

  return (
    <VStack space="sm">
      <HStack className="items-baseline justify-between">
        <Text
          size="sm"
          className="font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Recent
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all orders"
          onPress={onSeeAll}
          className="min-h-11 justify-center"
        >
          <Text size="sm" className="font-semibold text-primary">
            See all
          </Text>
        </Pressable>
      </HStack>

      <Box className="rounded-lg border border-border bg-card px-4 py-3">
        <HStack space="md" className="items-center">
          <VStack className="min-w-0 flex-1">
            <Text size="sm" className="font-semibold text-foreground">
              {order.restaurant}
            </Text>
            <Text size="sm" className="text-muted-foreground">
              {order.date} · {order.summary} · ₹{formatInr(order.total)}
            </Text>
          </VStack>
          <Button
            size="sm"
            variant="outline"
            onPress={onReorder}
            className="h-8 shrink-0 rounded-full"
          >
            <ButtonText>Reorder</ButtonText>
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
