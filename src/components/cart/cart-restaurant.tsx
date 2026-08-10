import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type CartRestaurantProps = {
  name: string;
  eta: string;
  distance: string;
};

export function CartRestaurant({ name, eta, distance }: CartRestaurantProps) {
  return (
    <VStack>
      <Text size="md" className="font-bold text-foreground">
        {name}
      </Text>
      <Text size="sm" className="text-muted-foreground">
        {eta} · {distance}
      </Text>
    </VStack>
  );
}
