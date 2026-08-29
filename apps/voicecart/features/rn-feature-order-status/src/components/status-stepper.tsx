import { View } from 'react-native';

import { HStack, Text, VStack } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import {
  orderStagesForSource,
  type CartSource,
  type OrderStage,
} from '@voicecart/rn-feature-order-status-core';

function dotColor(status: OrderStage['status']): string {
  if (status === 'done') return Brand.success;
  if (status === 'current') return Brand.primary;
  return Brand.border;
}

function textClass(status: OrderStage['status']): string {
  if (status === 'pending') return 'text-muted-foreground';
  return 'text-foreground';
}

type StatusStepperProps = {
  source: CartSource;
};

export function StatusStepper({ source }: StatusStepperProps) {
  const stages = orderStagesForSource(source);

  return (
    <VStack>
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        return (
          <HStack key={stage.label} className="gap-3">
            <VStack className="items-center">
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  backgroundColor: dotColor(stage.status),
                }}
              />
              {!isLast ? (
                <View
                  style={{
                    width: 2,
                    flexGrow: 1,
                    minHeight: 28,
                    backgroundColor: Brand.border,
                  }}
                />
              ) : null}
            </VStack>
            <VStack className={isLast ? '' : 'pb-6'}>
              <Text size="md" className={`font-semibold ${textClass(stage.status)}`}>
                {stage.label}
              </Text>
              <Text size="sm" className="text-muted-foreground">
                {stage.sub}
              </Text>
            </VStack>
          </HStack>
        );
      })}
    </VStack>
  );
}
