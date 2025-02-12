import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000000', dark: '#FFFFFFFFF' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#0000000"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
     
      <Collapsible title="arquivos e rotas">
        <ThemedText>
          Essa é a estrutura de pastas{' '}
          <ThemedText type="defaultSemiBold">src/main.py</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">src/venv/libs</ThemedText>
        </ThemedText>
        <ThemedText>
          Conheça mais sobre <ThemedText type="defaultSemiBold">python</ThemedText>{' '}
         abra a doc em um browser
        </ThemedText>
        <ExternalLink href="https://python.org">
          <ThemedText type="link">python.org</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
