import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Brand } from '@/constants/theme';
import { VOICE_LIST_ITEMS } from '@/data/voice-mock';
import { useThemeMode } from '@/theme/theme-mode';

type FullListSheetProps = {
  open: boolean;
  onClose: () => void;
};

function CheckIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17L4 12"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function FullListSheet({ open, onClose }: FullListSheetProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeMode();

  const sheetBg = isDark ? '#2A2724' : Brand.card;
  const titleColor = isDark ? Brand.surface : Brand.ink;
  const mutedColor = Brand.muted;
  const borderColor = isDark ? '#3F3A34' : Brand.border;

  return (
    <Modal
      transparent
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Dismiss full list"
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: sheetBg, paddingBottom: Math.max(insets.bottom, 22) },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: titleColor }]}>
              Your order ({VOICE_LIST_ITEMS.length})
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
            >
              <Text style={[styles.close, { color: mutedColor }]}>Close</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator
            contentContainerStyle={styles.listContent}
          >
            {VOICE_LIST_ITEMS.map((item, index) => (
              <View
                key={item.name}
                style={[
                  styles.row,
                  index < VOICE_LIST_ITEMS.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: borderColor,
                  },
                ]}
              >
                <View style={styles.check}>
                  <CheckIcon />
                </View>
                <Text style={[styles.name, { color: titleColor }]}>{item.name}</Text>
                <Text style={[styles.qty, { color: mutedColor }]}>{item.qty}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20,18,15,0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 18,
    maxHeight: '72%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  close: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: Brand.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  qty: {
    fontSize: 13,
    fontWeight: '600',
  },
});
