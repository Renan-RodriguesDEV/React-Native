// tela com campos nome, telafone, email e senha. botão confirmar senha
// tela abaixo com nomes já cadastrados, apertar em editar abrir popup para editar nome, telefone, email e senha

import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function App() {
  const [users, setUsers] = useState([]);
  const urlAPI = "http://localhost:5001/";
  const router = useRouter();

  const fetchUsers = () => {
    axios.get(urlAPI).then((res) => setUsers(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const editar = (item) => {
    // Passando todos os dados do usuário como parâmetros
    router.push({
      pathname: "/(tabs)/edit",
      params: { 
        id: item.id,
        nomeAtual: item.nome,
        telefoneAtual: item.telefone,
        emailAtual: item.email
      },
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.nome}</Text>
            <View style={styles.actions}>
            <Button title="Editar" onPress={() => editar(item)} />

            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, marginBottom: 10, fontWeight: "bold" },
  input: { borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 10 },
  itemContainer: { marginBottom: 10, padding: 10, backgroundColor: "#eee" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
