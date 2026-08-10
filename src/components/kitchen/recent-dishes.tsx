import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { RECENT_DISHES } from '@/data/kitchen-mock';

type RecentDishesProps = {
  onPick: (name: string) => void;
};

export function RecentDishes({ onPick }: RecentDishesProps) {
  return (
    <VStack space="sm">
      <Text
        size="sm"
        className="font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Recently cooked
      </Text>
      <Box className="flex-row flex-wrap gap-2">
        {RECENT_DISHES.map((name) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityLabel={`Select ${name}`}
            onPress={() => onPick(name)}
            className="min-h-11 justify-center rounded-full border border-border bg-card px-3.5 py-2"
          >
            <Text size="sm" className="font-semibold text-foreground">
              {name}
            </Text>
          </Pressable>
        ))}
      </Box>
    </VStack>
  );
}
