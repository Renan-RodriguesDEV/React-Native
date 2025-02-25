import React, { useState } from "react";
import { View, Text, TextInput, Alert, Button, StyleSheet } from "react-native";

export default function App() {
  const [nome, setNome] = useState("");

  function confirmInput() {
    if (nome.trim() === "") {
      Alert.alert("Nome não foi definido!!");
      alert("Nome não foi definido!!");
      return false;
    }
    Alert.alert(`Nome definido: ${nome}`);
    alert(`Nome definido: ${nome}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo ao App!</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <Button title="Confirmar" onPress={confirmInput} />
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    backgroundColor: "#ffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    borderWidth: 1,
    padding: 20,
    width: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
});
