import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";

export default function App() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(null);

  // const API_URL = "http://localhost/mobile/"; // <- URL com php
  const API_URL = "http://127.0.0.1:5000/"; // <- URL com Flask

  const carregar = () => {
    axios.get(API_URL).then((res) => setMensagens(res.data));
  };

  useEffect(() => {
    carregar();
  }, []);

  const salvar = () => {
    if (editando) {
      // axios.put(API_URL, { id: editando, texto }).then(() => { // <- Com PHP
      axios.put(API_URL, { id: editando, texto: texto }).then(() => {
        setTexto("");
        setEditando(null);
        carregar();
      });
    } else {
      // axios.post(API_URL, { texto }).then(() => { // <- Com PHP
      axios.post(API_URL, { texto: texto }).then(() => {
        setTexto("");
        carregar();
      });
    }
  };

  const editar = (mensagem) => {
    setTexto(mensagem.texto);
    setEditando(mensagem.id);
  };

  const deletar = (id) => {
    axios.delete(API_URL, { data: { id } }).then(() => carregar());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mensagens</Text>

      <TextInput
        style={styles.input}
        value={texto}
        onChangeText={setTexto}
        placeholder="Digite a mensagem"
      />

      <Button title={editando ? "Atualizar" : "Adicionar"} onPress={salvar} />

      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.texto}</Text>
            <View style={styles.actions}>
              <Button title="Editar" onPress={() => editar(item)} />
              <Button
                title="Excluir"
                onPress={() => deletar(item.id)}
                color="red"
              />
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
