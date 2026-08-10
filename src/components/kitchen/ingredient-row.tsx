import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { IngredientSelection } from '@/data/kitchen-mock';

type IngredientRowProps = {
  item: IngredientSelection;
  onToggle: () => void;
  showDivider: boolean;
};

export function IngredientRow({ item, onToggle, showDivider }: IngredientRowProps) {
  const need = item.need;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, currently ${need ? 'Need' : 'Have'}. Tap to toggle.`}
      onPress={onToggle}
      className={`min-h-11 flex-row items-center gap-3 py-3.5 ${showDivider ? 'border-b border-border' : ''}`}
    >
      <VStack className="min-w-0 flex-1">
        <Text
          size="sm"
          className={`font-semibold ${need ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {item.name}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          {item.qty}
        </Text>
      </VStack>

      <HStack className="shrink-0 overflow-hidden rounded-full border border-border">
        <Box
          className={`px-3 py-1.5 ${need ? 'bg-foreground' : 'bg-transparent'}`}
        >
          <Text
            size="xs"
            className={`font-bold ${need ? 'text-background' : 'text-muted-foreground'}`}
          >
            Need
          </Text>
        </Box>
        <Box
          className={`px-3 py-1.5 ${!need ? 'bg-success' : 'bg-transparent'}`}
        >
          <Text
            size="xs"
            className={`font-bold ${!need ? 'text-success-foreground' : 'text-muted-foreground'}`}
          >
            Have
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
}
