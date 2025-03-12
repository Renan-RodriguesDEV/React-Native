import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const userGet = await AsyncStorage.getItem("user");
        if (userGet) setUser(userGet);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    getUser();
  }, []);

  return (
    <View style={styles.container}>
      {user !== null && <Text style={styles.titulo}>Resultado: {user}</Text>}
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
