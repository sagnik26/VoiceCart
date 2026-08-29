import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { PROFILE_USER } from '@voicecart/rn-feature-profile-core';
import { resetOnboardingForDev } from '@voicecart/rn-feature-onboarding-core';

function ProfileRow({
  label,
  trailing,
  onPress,
}: {
  label: string;
  trailing?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between border-b border-border py-3"
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <Text size="md" className="text-foreground">
        {label}
      </Text>
      {trailing ? (
        <Text size="sm" className="text-muted-foreground">
          {trailing}
        </Text>
      ) : (
        <Text size="sm" className="text-muted-foreground">
          ›
        </Text>
      )}
    </Pressable>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <Box className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: 28,
          paddingHorizontal: 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Text size="sm" className="text-muted-foreground">
            ‹ Back
          </Text>
        </Pressable>

        <Text size="xl" className="font-bold text-foreground">
          Profile
        </Text>

        <VStack space="xs">
          <Text size="lg" className="font-semibold text-foreground">
            {PROFILE_USER.name}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Swiggy account linked {PROFILE_USER.swiggyLinked ? '✓' : '✗'}
          </Text>
        </VStack>

        <Box className="rounded-lg border border-border bg-card px-4">
          <ProfileRow label="Delivery address" trailing={PROFILE_USER.address} />
          <ProfileRow label="Diet preference" trailing={PROFILE_USER.diet} />
          <ProfileRow label="Pantry manager" onPress={() => router.push('/pantry')} />
          <ProfileRow label="Order history" onPress={() => router.push('/history')} />
        </Box>

        <Box className="rounded-lg border border-border bg-card px-4">
          <ProfileRow label="Settings" onPress={() => router.push('/settings')} />
          <ProfileRow label="Help & support" />
          <ProfileRow
            label="Log out"
            onPress={() => {
              resetOnboardingForDev();
              router.replace('/(onboarding)/login');
            }}
          />
        </Box>
      </ScrollView>
    </Box>
  );
}
