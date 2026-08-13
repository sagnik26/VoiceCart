import { Box } from '@voicecart/rn-ui';
import { Button, ButtonText } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { talkRoomStatusLabel } from '@voicecart/rn-feature-voice-core';

type TalkRoomFailedProps = {
  onRetry: () => void;
};

export function TalkRoomFailed({ onRetry }: TalkRoomFailedProps) {
  return (
    <Box className="flex-1 items-center justify-center px-2">
      <VStack space="md" className="w-full items-center">
        <Text size="md" className="text-center text-foreground">
          {talkRoomStatusLabel('failed')}
        </Text>
        <Text size="sm" className="text-center text-muted-foreground">
          Check your connection and try again.
        </Text>
        <Button
          className="mt-2 min-h-11 w-full"
          onPress={onRetry}
          accessibilityLabel="Try again"
        >
          <ButtonText>Try again</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
