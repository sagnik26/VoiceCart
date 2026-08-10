import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { formatInr } from '@/data/home-mock';
import type { HistoryOrder } from '@/data/history-mock';

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
