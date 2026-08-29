import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsHeader } from '../components/settings-header';
import { SettingsRow } from '../components/settings-row';
import { SettingsSwitch } from '../components/settings-switch';
import { Box, Button, ButtonText, Text, VStack } from '@voicecart/rn-ui';
import { resetOnboardingForDev } from '@voicecart/rn-feature-onboarding-core';

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  const onLogOut = () => {
    resetOnboardingForDev();
    router.replace('/(onboarding)/login');
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

        <VStack>
          <SettingsRow
            label="Language"
            trailing={
              <Text size="sm" className="text-muted-foreground">
                English/Hindi mix
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
          <SettingsRow label="Linked accounts" showChevron onPress={() => {}} />
          <SettingsRow
            label="Voice"
            trailing={
              <SettingsSwitch
                value={voiceOn}
                onValueChange={setVoiceOn}
                accessibilityLabel="Voice on by default"
              />
            }
          />
          <SettingsRow
            label="About"
            trailing={
              <Text size="sm" className="text-muted-foreground">
                v1.0
              </Text>
            }
          />
          <SettingsRow label="Help & support" showChevron onPress={() => {}} />
          <SettingsRow
            label="Log out"
            destructive
            showBorder={false}
            onPress={onLogOut}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
}
