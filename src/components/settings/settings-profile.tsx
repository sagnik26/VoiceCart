import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SETTINGS_PROFILE } from '@/data/settings-mock';

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
