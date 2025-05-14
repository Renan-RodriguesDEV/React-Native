// npx expo install expo-location

import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function LocalizacaoScreen() {
  const [localizacao, setLocalizacao] = useState(null);
  const [erro, setErro] = useState<string | null>(null);

  const obterLocalizacao = async () => {
    try {
      // Solicita permissão
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErro("Permissão de localização negada");
        return;
      }

      // Obtém localização atual
      const posicao = await Location.getCurrentPositionAsync({});
      setLocalizacao(posicao.coords);
    } catch (e) {
      setErro("Erro ao obter localização");
    }
  };

  useEffect(() => {
    obterLocalizacao();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localização Atual</Text>
      {erro && <Text style={styles.error}>{erro}</Text>}
      {localizacao ? (
        <View>
          <Text>Latitude: {localizacao.latitude}</Text>
          <Text>Longitude: {localizacao.longitude}</Text>
        </View>
      ) : (
        <Text>Carregando localização...</Text>
      )}
      <Button title="Atualizar Localização" onPress={obterLocalizacao} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  error: { color: "red" },
});
