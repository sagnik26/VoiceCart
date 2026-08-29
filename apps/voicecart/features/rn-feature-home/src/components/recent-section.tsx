import { Box, Button, ButtonText, HStack, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { HOME_RECENT_ACTIVITY, formatActivityRow } from '@voicecart/rn-feature-home-core';

type RecentSectionProps = {
  onSeeAll: () => void;
  onRecook: () => void;
};

export function RecentSection({ onSeeAll, onRecook }: RecentSectionProps) {
  return (
    <VStack space="sm">
      <HStack className="items-baseline justify-between">
        <Text
          size="sm"
          className="font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Recent
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all orders"
          onPress={onSeeAll}
          className="min-h-11 justify-center"
        >
          <Text size="sm" className="font-semibold text-primary">
            See all
          </Text>
        </Pressable>
      </HStack>

      <VStack space="sm">
        {HOME_RECENT_ACTIVITY.map((activity) => (
          <Box key={`${activity.kind}-${activity.label}`} className="rounded-lg border border-border bg-card px-4 py-3">
            <Text size="sm" className="text-foreground">
              {formatActivityRow(activity)}
            </Text>
          </Box>
        ))}
      </VStack>

      <Button size="sm" variant="outline" onPress={onRecook} className="h-9 self-start rounded-full">
        <ButtonText>Recook Dal tadka</ButtonText>
      </Button>
    </VStack>
  );
}
