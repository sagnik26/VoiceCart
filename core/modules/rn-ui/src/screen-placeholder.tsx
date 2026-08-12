import { useRouter } from 'expo-router';

import { Box } from './ui/box';
import { Button, ButtonText } from './ui/button';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { VStack } from './ui/vstack';

type ScreenPlaceholderProps = {
  title: string;
  description?: string;
  showBack?: boolean;
};

export function ScreenPlaceholder({
  title,
  description = 'Placeholder — UI coming next.',
  showBack = false,
}: ScreenPlaceholderProps) {
  const router = useRouter();

  return (
    <Box className="flex-1 bg-background px-5 pt-16">
      <VStack space="md" className="flex-1">
        {showBack ? (
          <Button
            variant="link"
            size="sm"
            className="self-start px-0"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
          >
            <ButtonText>Back</ButtonText>
          </Button>
        ) : null}
        <Heading size="xl" className="text-foreground">
          {title}
        </Heading>
        <Text size="sm" className="text-muted-foreground">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}
