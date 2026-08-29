import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, ButtonText, Pressable, Text, VStack } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import { completeAddressSetup } from '@voicecart/rn-feature-onboarding-core';

export function SetupAddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState('');
  const [swiggyLinked, setSwiggyLinked] = useState(false);

  const onContinue = () => {
    completeAddressSetup(address || 'Indiranagar, Bengaluru', swiggyLinked);
    router.push('/(onboarding)/setup-pantry');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 24 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
        <Pressable onPress={() => router.back()}>
          <Text size="sm" className="text-muted-foreground">
            ‹ Back
          </Text>
        </Pressable>
        <Text size="xl" className="font-bold text-foreground">
          Link your Swiggy account
        </Text>
        <Text size="sm" className="text-muted-foreground">
          So we can order and check delivery on your behalf
        </Text>
        <Button
          onPress={() => setSwiggyLinked(true)}
          className="h-12 rounded-full"
        >
          <ButtonText>Connect Swiggy account</ButtonText>
        </Button>
        <VStack space="sm" className="mt-4">
          <Text size="md" className="font-semibold text-foreground">
            Delivery address
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Search address"
            style={{
              borderWidth: 1,
              borderColor: Brand.border,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          />
          <Button variant="outline" className="h-11 rounded-full">
            <ButtonText>Use current location</ButtonText>
          </Button>
        </VStack>
        <Button onPress={onContinue} className="h-12 rounded-full">
          <ButtonText>Continue</ButtonText>
        </Button>
      </ScrollView>
    </Box>
  );
}
