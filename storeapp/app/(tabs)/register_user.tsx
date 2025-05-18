import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import BackButton from "@/components/BackButton";

export default function RegisterProduct() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("clientes");
  const [id, setId] = useState(0);
  const urlAPI = "http://192.168.1.9:5001";
  function saveUser(token: string, id: number) {
    // Salva o token e o email do usuário no AsyncStorage
    AsyncStorage.setItem("user", JSON.stringify(email));
    AsyncStorage.setItem("token", JSON.stringify(token));
    AsyncStorage.setItem("userType", userType);
    AsyncStorage.setItem("id", JSON.stringify(id));
  }
  function handleSave() {
    // Verifica se o usuário está logado
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.replace("/");
      }
    });
    axios
      .post(`${urlAPI}/user/?type_user=${userType}`, {
        name: nome,
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Usuario cadastrado com sucesso");
          saveUser(response.data.token, response.data.id);
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao cadastrar usuario");
        }
      })
      .catch((err) => alert(`Erro ao cadastrar usuario ${err}`));
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={userType}
        style={{ height: 50, marginBottom: 10 }}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Cliente" value="clientes" />
        <Picker.Item label="Vendedor" value="vendedores" />
      </Picker>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title="Salvar" onPress={handleSave} />
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#222" },
  label: { color: "#fff", marginTop: 10 },
  input: { backgroundColor: "#fff", borderRadius: 5, padding: 8, marginTop: 5 },
});
