import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [texto, setTexto] = useState("");
  const [numero, setNumero] = useState(0);
  const [storageData, setStorageData] = useState<
    Array<{ key: string; value: string | null }>
  >([]);

  async function fetchStorageData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const results = await AsyncStorage.multiGet(keys);
      const data = results.map(([key, value]) => ({ key, value }));
      setStorageData(data);
    } catch (error) {
      console.error("Erro ao iterar AsyncStorage:", error);
    }
  }

  async function salvarChaveValor() {
    try {
      setNumero(numero + 1);
      await AsyncStorage.setItem(numero.toString(), texto);
      fetchStorageData();
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  }

  async function apagarChaves() {
    try {
      setNumero(0);
      await AsyncStorage.clear();
      fetchStorageData();
    } catch (error) {
      console.error("Erro ao limpar AsyncStorage:", error);
    }
  }

  useEffect(() => {
    fetchStorageData();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText={setTexto} value={texto} />
      <View>
        <Button title="Salvar" onPress={salvarChaveValor} />
        <Button title="Apagar" onPress={apagarChaves} />
      </View>
      <FlatList
        data={storageData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.key}: {item.value}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  item: {
    fontSize: 16,
    marginVertical: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    color: "#333",
    borderRadius: 4,
  },
  input: {
    margin: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
  },
});

export default App;
