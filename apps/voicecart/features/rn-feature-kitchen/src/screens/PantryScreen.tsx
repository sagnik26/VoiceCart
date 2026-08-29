import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, Pressable, Text, VStack } from '@voicecart/rn-ui';
import {
  RUNNING_LOW,
  addPantryStaple,
  getPantryStaples,
  setPantryStapleEnabled,
} from '@voicecart/rn-feature-kitchen-core';
import { Brand } from '@voicecart/rn-theme';

export function PantryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [staples, setStaples] = useState(getPantryStaples());
  const [newStaple, setNewStaple] = useState('');

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  const onToggle = (name: string, enabled: boolean) => {
    setStaples(setPantryStapleEnabled(name, enabled));
  };

  const onAdd = () => {
    if (!newStaple.trim()) return;
    setStaples(addPantryStaple(newStaple));
    setNewStaple('');
  };

  return (
    <Box className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 24),
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} accessibilityRole="button">
          <Text size="sm" className="text-muted-foreground">
            ‹ Back
          </Text>
        </Pressable>

        <Text size="xl" className="font-bold text-foreground">
          Your staples
        </Text>
        <Text size="sm" className="text-muted-foreground">
          These open pre-marked as &quot;have&quot; in every ingredient list
        </Text>

        <VStack>
          {staples.map((staple) => (
            <Pressable
              key={staple.name}
              onPress={() => onToggle(staple.name, !staple.enabled)}
              className="flex-row items-center justify-between border-b border-border py-3"
            >
              <Text size="md" className="text-foreground">
                {staple.name}
              </Text>
              <Text size="sm" className={staple.enabled ? 'text-success' : 'text-muted-foreground'}>
                {staple.enabled ? 'Have' : 'Off'}
              </Text>
            </Pressable>
          ))}
        </VStack>

        <TextInput
          value={newStaple}
          onChangeText={setNewStaple}
          placeholder="Add a staple"
          onSubmitEditing={onAdd}
          style={{
            borderWidth: 1,
            borderColor: Brand.border,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            color: Brand.ink,
          }}
        />

        <Text size="md" className="font-semibold text-foreground">
          Running low
        </Text>
        <Box className="flex-row flex-wrap gap-2">
          {RUNNING_LOW.map((item) => (
            <Box key={item} className="rounded-full border border-border bg-card px-3 py-1">
              <Text size="xs" className="text-foreground">
                {item}
              </Text>
            </Box>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
