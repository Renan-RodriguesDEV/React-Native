import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    // Verifica se o usuário está logado
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.replace("/");
      }
    });
    // Buscar dados do produto pelo id
    axios.get(`http://localhost:5001/product/${id}`).then((res) => {
      const prod = res.data.product;
      setNome(prod.nome);
      setPreco(String(prod.preco));
      setQuantidade(String(prod.quantidade));
      setDescricao(prod.descricao);
    });
  }, [id]);

  function handleSave() {
    axios
      .put(`http://localhost:5001/product/${id}`, {
        name: nome,
        price: Number(preco),
        count: Number(quantidade),
        description: descricao,
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Produto editado com sucesso");
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao editar produto");
          router.replace("/(tabs)/homepage");
        }
      });
  }
  function handleRemove() {
    axios.delete(`http://localhost:5001/product/${id}`).then((response) => {
      if (response.data.message === "sucess") {
        alert("Produto deletado com sucesso");
        router.replace("/(tabs)/homepage");
      } else {
        alert("Erro ao deletar produto");
        router.replace("/(tabs)/homepage");
      }
    });
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
      <Button title="Excluir" onPress={handleRemove} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#222" },
  label: { color: "#fff", marginTop: 10 },
  input: { backgroundColor: "#fff", borderRadius: 5, padding: 8, marginTop: 5 },
});
