import Svg, { Path } from 'react-native-svg';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Brand } from '@/constants/theme';

type StatusHeaderProps = {
  eta: string;
};

export function StatusHeader({ eta }: StatusHeaderProps) {
  return (
    <VStack className="items-center py-2">
      <Box
        className="mb-3.5 h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: Brand.success }}
      >
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 6L9 17L4 12"
            stroke="#fff"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Box>
      <Text size="xl" className="font-bold text-foreground">
        Order confirmed
      </Text>
      <Text size="sm" className="mt-0.5 text-muted-foreground">
        Arriving in {eta}
      </Text>
    </VStack>
  );
}
