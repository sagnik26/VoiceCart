import { Box } from '@voicecart/rn-ui';
import { HStack } from '@voicecart/rn-ui';
import { Text } from '@voicecart/rn-ui';
import { VStack } from '@voicecart/rn-ui';
import { SETTINGS_PROFILE } from '@voicecart/rn-feature-settings-core';

export function SettingsProfile() {
  return (
    <HStack className="items-center gap-3.5">
      <Box className="h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Text size="xl" className="font-bold text-foreground">
          {SETTINGS_PROFILE.initial}
        </Text>
      </Box>
      <VStack>
        <Text size="md" className="font-bold text-foreground">
          {SETTINGS_PROFILE.fullName}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          {SETTINGS_PROFILE.phone}
        </Text>
      </VStack>
    </HStack>
  );
}
