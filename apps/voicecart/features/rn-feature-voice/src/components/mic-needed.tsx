import { Linking } from 'react-native';

import { Box } from '@voicecart/rn-ui';
import { Button, ButtonText } from '@voicecart/rn-ui';
import { Heading } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';

type MicNeededProps = {
  onAllow: () => void;
  isRequesting: boolean;
};

export function MicNeeded({ onAllow, isRequesting }: MicNeededProps) {
  return (
    <Box className="flex-1 items-center justify-center px-2">
      <VStack space="md" className="w-full items-center">
        <Heading size="xl" className="text-center text-foreground">
          Microphone needed
        </Heading>
        <Text size="sm" className="text-center text-muted-foreground">
          VoiceCart needs the microphone so you can place orders by voice. Allow
          access, or open Settings if you previously denied it.
        </Text>
        <Button
          className="mt-2 min-h-11 w-full"
          disabled={isRequesting}
          onPress={onAllow}
          accessibilityLabel="Allow microphone"
        >
          <ButtonText>{isRequesting ? 'Asking…' : 'Allow microphone'}</ButtonText>
        </Button>
        <Button
          variant="outline"
          className="min-h-11 w-full"
          onPress={() => {
            void Linking.openSettings();
          }}
          accessibilityLabel="Open device settings"
        >
          <ButtonText>Open settings</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
