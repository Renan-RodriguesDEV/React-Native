import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([]);

  // é acionado qndo a tela é carregada
  useEffect(() => {
    // faz uma requisição para o servidor
    axios
      // .get("http://localhost/mobile/index.php") // <- URL com php
      .get("http://127.0.0.1:5000/") // <- URL com Flask
      .then((res) => setMessages(res.data)) // então altera o estado de messages
      .catch((error) => console.log(error)); // se der erro, imprime no console
    // a função é chamada apenas uma vez, quando o componente é montado
    // o array vazio [] significa que a função não será chamada novamente
    // se o array tivesse valores, a função seria chamada sempre que os valores mudassem
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={messages} // <- lista de mensagens
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.texto}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    backgroundColor: "white", // <- fundo branco
    flex: 1, // <- garante que ocupe toda a tela
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
  },
});
