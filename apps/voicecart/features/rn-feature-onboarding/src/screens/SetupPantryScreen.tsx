import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Button, ButtonText, Pressable, Text, VStack } from '@voicecart/rn-ui';
import {
  DIET_OPTIONS,
  SETUP_STAPLE_OPTIONS,
  completePantrySetup,
  skipOnboarding,
  type DietPreference,
} from '@voicecart/rn-feature-onboarding-core';
import { addPantryStaple, setPantryStapleEnabled } from '@voicecart/rn-feature-kitchen-core';

export function SetupPantryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [diet, setDiet] = useState<DietPreference>('Veg');
  const [staples, setStaples] = useState<string[]>(['Onion']);

  const toggleStaple = (name: string) => {
    setStaples((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const onDone = () => {
    completePantrySetup(diet, staples);
    staples.forEach((name) => {
      addPantryStaple(name);
      setPantryStapleEnabled(name, true);
    });
    router.replace('/(tabs)');
  };

  const onSkip = () => {
    skipOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 24 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <Text size="sm" className="text-muted-foreground">
            ‹ Back
          </Text>
        </Pressable>
        <Text size="md" className="font-semibold text-foreground">
          Diet preference
        </Text>
        <Box className="flex-row flex-wrap gap-2">
          {DIET_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setDiet(option)}
              className={`rounded-full border px-3 py-1.5 ${
                diet === option ? 'border-foreground bg-foreground' : 'border-border bg-card'
              }`}
            >
              <Text size="xs" className={diet === option ? 'text-background' : 'text-foreground'}>
                {option}
              </Text>
            </Pressable>
          ))}
        </Box>
        <Text size="md" className="font-semibold text-foreground">
          Staples you usually have
        </Text>
        <Text size="sm" className="text-muted-foreground">
          Tap to mark — these get remembered so you don&apos;t toggle every time
        </Text>
        <Box className="flex-row flex-wrap gap-2">
          {SETUP_STAPLE_OPTIONS.map((name) => (
            <Pressable
              key={name}
              onPress={() => toggleStaple(name)}
              className={`rounded-full border px-3 py-1.5 ${
                staples.includes(name) ? 'border-foreground bg-foreground' : 'border-border bg-card'
              }`}
            >
              <Text
                size="xs"
                className={staples.includes(name) ? 'text-background' : 'text-foreground'}
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </Box>
        <Button onPress={onDone} className="h-12 rounded-full">
          <ButtonText>Done</ButtonText>
        </Button>
        <Button variant="outline" onPress={onSkip} className="h-12 rounded-full">
          <ButtonText>Skip for now</ButtonText>
        </Button>
      </ScrollView>
    </Box>
  );
}
