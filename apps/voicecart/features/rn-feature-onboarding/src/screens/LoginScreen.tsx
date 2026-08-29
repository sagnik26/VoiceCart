import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, ButtonText, Text, VStack } from '@voicecart/rn-ui';
import { Brand } from '@voicecart/rn-theme';
import { verifyOtp } from '@voicecart/rn-feature-integrations-core';
import { completeLogin as saveLogin } from '@voicecart/rn-feature-onboarding-core';

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const onSendOtp = () => {
    if (phone.trim().length >= 10) setOtpSent(true);
  };

  const onVerify = async () => {
    const ok = await verifyOtp(phone, otp);
    if (!ok) return;
    saveLogin(phone);
    router.push('/(onboarding)/setup-address');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 24 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
        <Text size="2xl" className="font-bold text-foreground">
          Get started
        </Text>
        <Text size="sm" className="text-muted-foreground">
          Enter your phone number to continue
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderColor: Brand.border,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        />
        <Button onPress={onSendOtp} className="h-12 rounded-full">
          <ButtonText>Send OTP</ButtonText>
        </Button>
        {otpSent ? (
          <>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              style={{
                borderWidth: 1,
                borderColor: Brand.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            />
            <Button onPress={() => void onVerify()} className="h-12 rounded-full">
              <ButtonText>Verify & continue</ButtonText>
            </Button>
          </>
        ) : null}
      </ScrollView>
    </Box>
  );
}
