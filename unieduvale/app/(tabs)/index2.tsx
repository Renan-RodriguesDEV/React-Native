import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [nome, setNome] = useState("");
  const [text, setTexto] = useState("");

  useEffect(() => {
    carregarNome();
  }, []);

  async function carregarNome() {
    const nomeSalvo = await AsyncStorage.getItem("nome");
    if (nomeSalvo) {
      setNome(nomeSalvo);
    }
  }

  async function salvarNome() {
    await AsyncStorage.setItem("nome", nome);
  }
  async function receba() {
    const nomeTemp = await AsyncStorage.getItem("nome");
    if (nomeTemp) setTexto(nomeTemp);
  }

  return (
    <View style={styles.container}>
      {/* View principal que contém todos os elementos, com estilo centralizado */}

      <Text style={styles.titulo}>Digite seu Nome</Text>
      {/* Exibe um título na tela */}

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      {/* Campo de entrada de texto para o usuário digitar seu nome.
        O valor do campo é ligado ao estado 'nome'.
        A função setNome é chamada sempre que o texto muda. */}
      <View>{text !== null && <Text>Nomes: {text}</Text>}</View>
      <Button title="Salvar" onPress={salvarNome} />

      <Button title="Exibir" onPress={receba} />
      {/* Botão que chama a função salvarNome ao ser pressionado. */}
    </View>
  );
}

const styles = StyleSheet.create({
  // Define os estilos do aplicativo.

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  // Estilo para a View principal: ocupa toda a tela, centraliza os itens e tem fundo branco.

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  // Estilo para o texto do título: tamanho grande, negrito e espaço abaixo.

  input: {
    borderWidth: 1,
    padding: 10,
    width: 250,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  // Estilo para o campo de entrada: borda visível, espaçamento interno, largura definida,
  // margem inferior, cantos arredondados e texto centralizado.
});
