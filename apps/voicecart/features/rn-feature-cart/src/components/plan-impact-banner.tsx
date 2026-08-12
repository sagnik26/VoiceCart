import { Box } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';

type PlanImpactBannerProps = {
  message: string;
};

export function PlanImpactBanner({ message }: PlanImpactBannerProps) {
  return (
    <Box className="rounded-md bg-warning/15 px-3 py-2.5">
      <Text size="sm" className="text-warning">
        {message}
      </Text>
    </Box>
  );
}
