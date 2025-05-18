import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";

export default function EditUser() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const urlAPI = "http://192.168.1.9:5001";
  useEffect(() => {
    // Função assíncrona para carregar dados
    const fetchData = async () => {
      const type = await AsyncStorage.getItem("userType");
      const userTypeValue = type ? type.replace(/"/g, "") : "clientes";
      setUserType(userTypeValue);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/");
        return;
      }

      try {
        // Agora userTypeValue está garantido
        const res = await axios.get(
          `${urlAPI}/user/${id}?type_user=${userTypeValue}`
        );
        const userData = res.data.user;
        setNome(userData.nome);
        setEmail(String(userData.email));
        setPassword(userData.senha);
      } catch (err) {
        console.log(err);
        alert(`Erro ao buscar usuario ${err}`);
      }
    };

    fetchData();
  }, [id]);

  function handleSave() {
    axios
      .put(`${urlAPI}/user/${id}?type_user=${userType}`, {
        name: nome,
        password: password,
        email: email,
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Usuario editado com sucesso");
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao editar usuario");
          router.replace("/(tabs)/homepage");
        }
      });
  }
  function handleRemove() {
    axios
      .delete(`${urlAPI}/user/${id}?type_user=${userType}`)
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Usuario deletado com sucesso");
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao deletar usuario");
          router.replace("/(tabs)/homepage");
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Button title="Salvar" onPress={handleSave} />
      <Button title="Excluir" onPress={handleRemove} />
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#222" },
  label: { color: "#fff", marginTop: 10 },
  input: { backgroundColor: "#fff", borderRadius: 5, padding: 8, marginTop: 5 },
});
