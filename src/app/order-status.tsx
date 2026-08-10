import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderSummaryCard } from '@/components/order-status/order-summary-card';
import { StatusHeader } from '@/components/order-status/status-header';
import { StatusStepper } from '@/components/order-status/status-stepper';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Brand } from '@/constants/theme';
import {
  orderPlanNote,
  parsePlacedOrder,
  SWIGGY_TRACK_URL,
} from '@/data/cart-mock';
import { useThemeMode } from '@/theme/theme-mode';

export default function OrderStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    restaurant?: string;
    eta?: string;
    total?: string;
    itemCount?: string;
    source?: string;
  }>();
  const { isDark } = useThemeMode();

  const order = useMemo(() => parsePlacedOrder(params), [params]);
  const planNote = orderPlanNote(order.source, order.total);
  const iconColor = isDark ? Brand.surface : Brand.ink;

  const onTrack = () => {
    Linking.openURL(SWIGGY_TRACK_URL);
  };

  const onHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24),
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <StatusHeader eta={order.eta} />
        <OrderSummaryCard
          restaurant={order.restaurant}
          itemCount={order.itemCount}
          total={order.total}
        />
        <StatusStepper />

        <Button
          variant="outline"
          onPress={onTrack}
          className="h-11 w-full rounded-full"
          accessibilityLabel="Track on Swiggy"
        >
          <View className="flex-row items-center gap-2">
            <ButtonText>Track on Swiggy</ButtonText>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21V9M10 14L21 3"
                stroke={iconColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </Button>

        <Text size="sm" className="text-center text-muted-foreground">
          {planNote}
        </Text>

        <Button
          variant="ghost"
          onPress={onHome}
          className="h-11 w-full rounded-full"
          accessibilityLabel="Back to Home"
        >
          <ButtonText>Back to Home</ButtonText>
        </Button>
      </ScrollView>
    </Box>
  );
}
