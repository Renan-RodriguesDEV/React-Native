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
  // declaração das variaveis a serem utilizadas
  const [texto, setTexto] = useState("");
  const [texts, setTexts] = useState([]);

  // ao montar o componente, carrega os valores salvos no storage
  useEffect(() => {
    loadTexts();
  }, []);

  async function loadTexts() {
    // pega os valores salvos no storage na chave texts
    const textsSaved = await AsyncStorage.getItem("texts");
    // se existir, converte o valor de string para um JSON (q representa um array) em um array real usando JSON.parse e atualiza à variavel texts com setTexts
    if (textsSaved) setTexts(JSON.parse(textsSaved));
  }

  async function saveText() {
    // elimina os espaços e verifica se a palavra é nada
    if (texto.trim() == "") return;
    // cria um novo array a partir do já existente adicionando o valor atual de texto
    const newTexts = [...texts, texto.trim()];
    // altera o array antigo pelo novo
    setTexts(newTexts);
    // salva a nova lista de texts no storage e converte o array newTexts em uma string JSON usando JSON.stringify salvndo na chave texts
    await AsyncStorage.setItem("texts", JSON.stringify(newTexts));
    // limpa o input e atualiza a variavel useState texto
    setTexto("");
  }

  async function delTexts() {
    // limpa tds os valores para chave texts da storage de sessão
    await AsyncStorage.removeItem("texts");
    // limpa a variavel useState text
    setTexts([]);
  }
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText={setTexto} value={texto} />
      <View>
        <Button title="Save" onPress={saveText} />
        <Button title="Delete" onPress={delTexts} />
      </View>
      <FlatList
        data={texts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.txt}>{item}</Text>}
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
  txt: {
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
