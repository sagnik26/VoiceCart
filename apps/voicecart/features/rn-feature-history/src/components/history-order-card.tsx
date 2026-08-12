import { Box } from '@voicecart/rn-ui';
import { Button, ButtonText } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { formatInr } from '@voicecart/rn-theme';
import type { HistoryOrder } from '@voicecart/rn-feature-history-core';

type HistoryOrderCardProps = {
  order: HistoryOrder;
  onReorder: () => void;
};

export function HistoryOrderCard({ order, onReorder }: HistoryOrderCardProps) {
  return (
    <Box className="gap-2 rounded-lg border border-border bg-card px-4 py-3">
      <HStack className="items-baseline justify-between">
        <Text size="md" className="font-semibold text-foreground">
          {order.restaurant}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          {order.date}
        </Text>
      </HStack>
      <Text size="sm" className="text-muted-foreground">
        {order.summary}
      </Text>
      <HStack className="items-center justify-between">
        <Text size="md" className="font-bold text-foreground">
          ₹{formatInr(order.total)}
        </Text>
        <Button
          size="sm"
          variant="outline"
          onPress={onReorder}
          className="h-8 rounded-full"
          accessibilityLabel={`Reorder from ${order.restaurant}`}
        >
          <ButtonText>Reorder</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
}
