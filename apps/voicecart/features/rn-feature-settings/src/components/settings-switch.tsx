import { Pressable, View } from 'react-native';

import { Brand } from '@voicecart/rn-theme';

type SettingsSwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accessibilityLabel: string;
};

export function SettingsSwitch({
  value,
  onValueChange,
  accessibilityLabel,
}: SettingsSwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      onPress={() => onValueChange(!value)}
      style={{
        width: 40,
        height: 24,
        borderRadius: 999,
        padding: 2,
        justifyContent: 'center',
        backgroundColor: value ? Brand.primary : Brand.border,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: Brand.card,
          alignSelf: value ? 'flex-end' : 'flex-start',
        }}
      />
    </Pressable>
  );
}
