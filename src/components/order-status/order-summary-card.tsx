import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatInr } from '@/data/home-mock';

type OrderSummaryCardProps = {
  restaurant: string;
  itemCount: number;
  total: number;
};

export function OrderSummaryCard({ restaurant, itemCount, total }: OrderSummaryCardProps) {
  return (
    <Box className="rounded-lg border border-border bg-card px-4 py-3">
      <HStack className="items-center justify-between">
        <VStack>
          <Text size="md" className="font-semibold text-foreground">
            {restaurant}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </Text>
        </VStack>
        <Text size="md" className="font-bold text-foreground">
          ₹{formatInr(total)}
        </Text>
      </HStack>
    </Box>
  );
}
