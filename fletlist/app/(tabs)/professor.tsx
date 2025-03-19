import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [nome, setNome] = useState("");
  const [nomes, setNomes] = useState([]);

  useEffect(() => {
    carregarNomes();
  }, []);

  async function carregarNomes() {
    const nomesSalvos = await AsyncStorage.getItem("nomes");
    if (nomesSalvos) {
      setNomes(JSON.parse(nomesSalvos));
    }
  }

  async function salvarNome() {
    if (nome.trim() === "") return;
    const novaLista = [...nomes, nome];
    setNomes(novaLista);
    await AsyncStorage.setItem("nomes", JSON.stringify(novaLista));
    setNome(""); // Limpa o campo após salvar
  }

  async function limparLista() {
    await AsyncStorage.removeItem("nomes");
    setNomes([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Digite seu Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <Button title="Adicionar" onPress={salvarNome} />
      <FlatList
        data={nomes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
      <Button title="Limpar Lista" onPress={limparLista} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: 250,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  item: {
    fontSize: 18,
    marginVertical: 5,
  },
});
