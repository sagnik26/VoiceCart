import { Box, Pressable, Text } from '@voicecart/rn-ui';
import { HOME_PANTRY_CHIPS, pantryChipLabel } from '@voicecart/rn-feature-home-core';

type PantrySectionProps = {
  onManage: () => void;
};

export function PantrySection({ onManage }: PantrySectionProps) {
  return (
    <Box className="gap-2">
      <Box className="flex-row items-center justify-between">
        <Text size="sm" className="font-semibold uppercase tracking-wide text-muted-foreground">
          Pantry
        </Text>
        <Pressable onPress={onManage} accessibilityRole="button">
          <Text size="xs" className="text-primary">
            Manage
          </Text>
        </Pressable>
      </Box>
      <Box className="flex-row flex-wrap gap-2">
        {HOME_PANTRY_CHIPS.map((chip) => (
          <Box key={chip.name} className="rounded-full border border-border bg-card px-3 py-1">
            <Text size="xs" className="text-foreground">
              {pantryChipLabel(chip)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
