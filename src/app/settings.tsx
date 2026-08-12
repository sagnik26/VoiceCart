import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsHeader } from '@/components/settings/settings-header';
import { SettingsProfile } from '@/components/settings/settings-profile';
import { LinkedBadge, SettingsRow } from '@/components/settings/settings-row';
import { SettingsSwitch } from '@/components/settings/settings-switch';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SETTINGS_PROFILE } from '@/data/settings-mock';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notificationsOn, setNotificationsOn] = useState(true);

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const onLogOut = () => {
    router.replace('/(tabs)');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24),
          gap: 18,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader onBack={onBack} />
        <SettingsProfile />

        <VStack>
          <SettingsRow
            label="Order history"
            showChevron
            onPress={() => router.push('/history')}
          />
          <SettingsRow
            label="Swiggy account"
            trailing={<LinkedBadge label={SETTINGS_PROFILE.swiggyStatus} />}
          />
          <SettingsRow
            label="Delivery address"
            trailing={
              <Text size="sm" className="text-muted-foreground">
                {SETTINGS_PROFILE.address}
              </Text>
            }
          />
          <SettingsRow
            label="Voice language"
            trailing={
              <Text size="sm" className="text-muted-foreground">
                {SETTINGS_PROFILE.voiceLanguage}
              </Text>
            }
          />
          <SettingsRow
            label="Notifications"
            trailing={
              <SettingsSwitch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                accessibilityLabel="Notifications"
              />
            }
          />
          <SettingsRow label="Help & support" showChevron onPress={() => {}} />
          <SettingsRow label="Log out" destructive showBorder={false} onPress={onLogOut} />
        </VStack>
      </ScrollView>
    </Box>
  );
}
