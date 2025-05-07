import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
export default function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();

  const urlAPI = "http://localhost:5001/";

  const checkLogin = (email, senha) => {
    axios
      .post(`${urlAPI}/login`, { email: email, senha: senha })
      .then((res) => {
        if (res.data.message === "sucess") {
          router.push("/(tabs)/home"); // Redireciona para a tela de home
        } else {
          alert("Email ou senha incorretos!");
          // Alert.alert("Email ou senha incorretos!");
        }
      })
      .catch((err) => {
        console.error("Erro ao fazer login:", err);
        alert("Erro ao fazer login. 404");
        // Alert.alert("Erro ao fazer login. 404");
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
      />
      <Button title="Entrar" onPress={() => checkLogin(email, senha)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, marginBottom: 10, fontWeight: "bold" },
  input: { borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 10 },
});
