import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatInr } from '@/data/home-mock';
import type { CartTotals } from '@/data/cart-mock';

type CartTotalsBlockProps = {
  totals: CartTotals;
};

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <HStack className="justify-between">
      <Text
        size={bold ? 'md' : 'sm'}
        className={bold ? 'font-bold text-foreground' : 'text-muted-foreground'}
      >
        {label}
      </Text>
      <Text
        size={bold ? 'md' : 'sm'}
        className={bold ? 'font-bold text-foreground' : 'text-muted-foreground'}
      >
        {value}
      </Text>
    </HStack>
  );
}

export function CartTotalsBlock({ totals }: CartTotalsBlockProps) {
  return (
    <VStack space="xs">
      <Row label="Item total" value={`₹${formatInr(totals.itemTotal)}`} />
      <Row label="Delivery" value={`₹${formatInr(totals.delivery)}`} />
      <Row label="Taxes" value={`₹${formatInr(totals.taxes)}`} />
      <VStack className="border-t border-border pt-2">
        <Row label="Total to pay" value={`₹${formatInr(totals.total)}`} bold />
      </VStack>
    </VStack>
  );
}
