import { Box } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Progress, ProgressFilledTrack } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import {
  HOME_PLAN,
  formatInr,
  planOrdersLeft,
  planPercent,
} from '@voicecart/rn-feature-home-core';

export function PlanCard() {
  const percent = planPercent(HOME_PLAN);
  const ordersLeft = planOrdersLeft(HOME_PLAN);

  return (
    <Box className="gap-2.5 rounded-lg border border-border bg-card p-4">
      <HStack className="items-baseline justify-between">
        <Text size="sm" className="font-semibold text-foreground">
          This week&apos;s plan
        </Text>
        <Text size="xs" className="text-muted-foreground">
          {HOME_PLAN.daysLeft} days left
        </Text>
      </HStack>

      <Progress value={percent} className="h-2 w-full">
        <ProgressFilledTrack className="h-full bg-primary" />
      </Progress>

      <HStack className="items-baseline justify-between">
        <HStack className="items-baseline" space="xs">
          <Text size="sm" className="font-semibold text-foreground">
            ₹{formatInr(HOME_PLAN.spent)}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            of ₹{formatInr(HOME_PLAN.limit)}
          </Text>
        </HStack>
        <Text size="xs" className="text-muted-foreground">
          {ordersLeft} of {HOME_PLAN.ordersLimit} orders left
        </Text>
      </HStack>
    </Box>
  );
}
