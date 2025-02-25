import React, { useState } from "react";
import { View, Text, TextInput, Alert, Button, StyleSheet } from "react-native";

export default function App() {
  const [numero1, setNumero1] = useState("");
  const [numero2, setNumero2] = useState("");
  const [result, setResult] = useState("");

  function soma() {
    const soma = parseFloat(numero1) + parseFloat(numero2);
    setResult(soma.toString());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo ao App!</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu numero"
        value={numero1}
        onChangeText={setNumero1}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu numero"
        value={numero2}
        onChangeText={setNumero2}
      />
      <Button title="Confirmar" onPress={soma} />
      {result !== null && <Text>Resultado: {result}</Text>}
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
