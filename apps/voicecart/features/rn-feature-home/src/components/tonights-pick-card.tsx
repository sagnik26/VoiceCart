import { Box, Pressable, Text } from '@voicecart/rn-ui';
import { HOME_TONIGHTS_PICK, formatInr } from '@voicecart/rn-feature-home-core';

type TonightsPickCardProps = {
  onCompare: () => void;
};

export function TonightsPickCard({ onCompare }: TonightsPickCardProps) {
  const pick = HOME_TONIGHTS_PICK;

  return (
    <Box className="gap-2">
      <Text size="sm" className="font-semibold uppercase tracking-wide text-muted-foreground">
        Tonight&apos;s pick
      </Text>
      <Pressable
        onPress={onCompare}
        className="rounded-lg border border-border bg-card p-4"
        accessibilityRole="button"
        accessibilityLabel={`Compare cooking ${pick.dish} versus ordering`}
      >
        <Box className="flex-row items-center justify-between">
          <Text size="md" className="font-semibold text-foreground">
            {pick.dish}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            ₹{formatInr(pick.cookCost)} to cook
          </Text>
        </Box>
        <Text size="sm" className="mt-1 text-muted-foreground">
          vs ₹{formatInr(pick.orderCost)} to order — tap to compare
        </Text>
      </Pressable>
    </Box>
  );
}
