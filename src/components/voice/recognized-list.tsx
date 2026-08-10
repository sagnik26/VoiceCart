import { ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Brand } from '@/constants/theme';
import {
  VOICE_LIST_ITEMS,
  VOICE_PREVIEW_COUNT,
  type RecognizedItem,
} from '@/data/voice-mock';

type RecognizedListProps = {
  visibleCount: number;
  onSeeFullList: () => void;
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

function ItemRow({ item }: { item: RecognizedItem }) {
  return (
    <HStack className="items-center gap-2.5 border-b border-border py-2">
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: Brand.success,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckIcon />
      </View>
      <Text size="md" className="flex-1 font-semibold text-foreground">
        {item.name}
      </Text>
      <Text size="sm" className="font-semibold text-muted-foreground">
        {item.qty}
      </Text>
    </HStack>
  );
}

export function RecognizedList({ visibleCount, onSeeFullList }: RecognizedListProps) {
  if (visibleCount <= 0) {
    return null;
  }

  const previewItems = VOICE_LIST_ITEMS.slice(0, Math.min(visibleCount, VOICE_PREVIEW_COUNT));
  const showFooter = VOICE_LIST_ITEMS.length > VOICE_PREVIEW_COUNT && visibleCount > 0;

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-card">
      <ScrollView
        style={{ maxHeight: 168 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <Box className="gap-0 px-3.5 py-2.5">
          {previewItems.map((item) => (
            <ItemRow key={item.name} item={item} />
          ))}
        </Box>
      </ScrollView>
      {showFooter ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See full list, ${VOICE_LIST_ITEMS.length} items`}
          onPress={onSeeFullList}
          hitSlop={8}
          className="items-center border-t border-border py-3"
        >
          <Text size="sm" className="font-bold text-primary">
            See full list ({VOICE_LIST_ITEMS.length})
          </Text>
        </Pressable>
      ) : null}
    </Box>
  );
}
