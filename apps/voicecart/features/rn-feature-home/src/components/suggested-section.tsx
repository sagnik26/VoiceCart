import { Box } from '@voicecart/rn-ui';
import { Button, ButtonText } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import {
  HOME_GROCERY_ROUTINE,
  HOME_SUGGESTED_MEAL,
  formatInr,
} from '@voicecart/rn-feature-home-core';

type SuggestedSectionProps = {
  onReorder: () => void;
};

export function SuggestedSection({ onReorder }: SuggestedSectionProps) {
  const meal = HOME_SUGGESTED_MEAL;
  const grocery = HOME_GROCERY_ROUTINE;

  return (
    <VStack space="sm">
      <Text
        size="sm"
        className="font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Suggested
      </Text>

      <Box className="gap-3 rounded-lg border border-border bg-card p-4">
        <HStack space="md" className="items-start">
          <Box className="h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Text size="2xs" className="text-muted-foreground">
              photo
            </Text>
          </Box>
          <VStack className="min-w-0 flex-1">
            <Text size="md" className="font-semibold text-foreground">
              {meal.title}
            </Text>
            <Text size="sm" className="text-muted-foreground">
              {meal.restaurant} · ₹{formatInr(meal.price)}
            </Text>
          </VStack>
        </HStack>
        <Text size="sm" className="text-muted-foreground">
          {meal.reason}
        </Text>
        <Button onPress={onReorder} className="h-9 w-full rounded-full">
          <ButtonText>Reorder</ButtonText>
        </Button>
      </Box>

      <Box className="gap-2 rounded-lg border border-border bg-card p-4">
        <HStack className="items-center justify-between">
          <Text size="md" className="font-semibold text-foreground">
            {grocery.title}
          </Text>
          <Box className="rounded-full bg-secondary px-2 py-0.5">
            <Text size="2xs" className="text-muted-foreground">
              {grocery.cadenceLabel}
            </Text>
          </Box>
        </HStack>
        <Text size="sm" className="text-muted-foreground">
          {grocery.summary}
        </Text>
      </Box>
    </VStack>
  );
}
