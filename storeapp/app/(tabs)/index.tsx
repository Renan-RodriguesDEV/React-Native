import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, Button, StyleSheet, Alert, TextInput } from "react-native";
// import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("clientes");
  const [password, setPassword] = useState("");
  const urlAPI = "http://localhost:5001/";
  const router = useRouter();

  async function saveUser(token: string, id: number) {
    // Salva o token e o email do usuário no AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(userEmail));
    await AsyncStorage.setItem("token", JSON.stringify(token));
    await AsyncStorage.setItem("userType", userType);
    await AsyncStorage.setItem("id", JSON.stringify(id));
  }
  const authLogin = () => {
    axios
      .post(`${urlAPI}/user/login?type_user=${userType}`, {
        email: userEmail,
        password: password,
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          saveUser(response.data.token, response.data.id);
          router.push("/(tabs)/homepage");
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Erro ao fazer login", "Credenciais invalidas");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={{ marginBottom: 5 }}>Tipo de usuário:</Text>
      <Picker
        selectedValue={userType}
        style={{ height: 50, marginBottom: 10 }}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Cliente" value="clientes" />
        <Picker.Item label="Vendedor" value="vendedores" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userEmail}
        onChangeText={setUserEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title="Entrar" onPress={() => authLogin()} />
      <Button
        title="Registrar-se"
        onPress={() => router.push("/(tabs)/register_user")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, marginBottom: 10, fontWeight: "bold" },
  input: { borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 10 },
});
