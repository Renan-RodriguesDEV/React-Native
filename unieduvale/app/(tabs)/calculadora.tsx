import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import { View, Button, Text, TextInput, StyleSheet } from "react-native";

export default function App() {
  const [numero1, setNumero1] = useState("");
  const [numero2, setNumero2] = useState("");
  const [resultadp, setResultado] = useState("");

  function soma() {
    const soma = parseFloat(numero1) + parseFloat(numero2);
    setResultado(soma.toString());
  }
  function divisao() {
    const divisao = parseFloat(numero1) / parseFloat(numero2);
    setResultado(divisao.toString());
  }
  function multiplicacao() {
    const multiplicacao = parseFloat(numero1) * parseFloat(numero2);
    setResultado(multiplicacao.toString());
  }
  function subtracao() {
    const subtracao = parseFloat(numero1) - parseFloat(numero2);
    setResultado(subtracao.toString());
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite um numero"
        value={numero1}
        onChangeText={setNumero1}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite um numero"
        value={numero2}
        onChangeText={setNumero2}
      />
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={soma} />
        <Button title="/" onPress={divisao} />
        <Button title="x" onPress={multiplicacao} />
        <Button title="-" onPress={subtracao} />
      </View>
      {resultadp !== null && <Text>Resultado: {resultadp}</Text>}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
