import { Redirect } from 'expo-router';

import { isOnboarded } from '@voicecart/rn-feature-onboarding-core';

export default function Index() {
  if (!isOnboarded()) {
    return <Redirect href="/(onboarding)/login" />;
  }
  return <Redirect href="/(tabs)" />;
}
