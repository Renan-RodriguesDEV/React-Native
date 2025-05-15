import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";

export default function RegisterProduct() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [id, setId] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const idValue = await AsyncStorage.getItem("id");
      setId(idValue ? parseInt(idValue) : 0);
    };
    loadData();
  });
  function handleSave() {
    // Verifica se o usuário está logado
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.replace("/");
      }
    });
    axios
      .post("http://localhost:5001/product/", {
        name: nome,
        price: parseFloat(preco.replace(",", ".")),
        count: parseInt(quantidade),
        description: descricao,
        fk_seller: id,
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Produto cadastrado com sucesso");
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao cadastrar produto");
        }
      })
      .catch((err) => alert(`Erro ao cadastrar produto ${err}`));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text style={styles.label}>Preço:</Text>
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
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
