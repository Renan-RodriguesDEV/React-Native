import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
      <Image 
        source={{ uri: 'https://www.python.org/static/community_logos/python-logo-master-v3-TM.png' }} 
        style={{ 
        alignSelf: 'center', 
        width: 600, 
        height: 220, 
        resizeMode: 'contain' 
        }} 
      />
      }
    >
      <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Bem vindo!</ThemedText>
      <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">Let's get started!</ThemedText>
      <ThemedText>
        Bem vindo ao <ThemedText type="defaultSemiBold">Tutorial de Python</ThemedText>
      </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
      <ThemedText type="title">Passo a passo:</ThemedText>
      
      <ThemedText type="subtitle">Passo 1:</ThemedText>
      <ThemedText>
        <ThemedText type="defaultSemiBold">Ative o ambiente virtual: </ThemedText>
        python -m venv venv
      </ThemedText>

      <ThemedText type="subtitle">Passo 2:</ThemedText>
      <ThemedText>
        <ThemedText type="defaultSemiBold">Instale as bibliotecas: </ThemedText>
        pip install pymysql pandas openpyxl
      </ThemedText>

      <ThemedText type="subtitle">Passo 3:</ThemedText>
      <ThemedText>
        <ThemedText type="defaultSemiBold">Crie uma pasta para o projeto: </ThemedText>
        mkdir src && cd src && code .
      </ThemedText>

      <ThemedText type="subtitle">Passo 4:</ThemedText>
      <ThemedText>
        <ThemedText type="defaultSemiBold">Escreva seu Hello World: </ThemedText>
        print("Hello World!")
      </ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
      <Button 
        title="Run" 
        onPress={() => alert('Executando...\n hello word')}
      />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
