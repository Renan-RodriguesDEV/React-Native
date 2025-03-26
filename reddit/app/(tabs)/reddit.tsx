import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function App() {
  const [nome, setNome] = useState("");
  const [post, setPost] = useState<{ titulo: string; content: string }>({
    titulo: "",
    content: "",
  });
  const [posts, setPosts] = useState<{ titulo: string; content: string }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [consulta, setConsulta] = useState("");
  const router = useRouter();

  useEffect(() => {
    carregarNomes();
  }, []);

  async function carregarNomes() {
    const nomeUser = await AsyncStorage.getItem("user");
    if (nomeUser) setNome(nomeUser);
    const nomesSalvos = await AsyncStorage.getItem("posts");
    if (nomesSalvos) setPosts(JSON.parse(nomesSalvos));
  }

  async function salvarNome() {
    // Validação: deve ter título
    if (post.titulo.trim() === "") return;

    if (editIndex !== null) {
      const novaLista = [...posts];
      novaLista[editIndex] = post;
      setPosts(novaLista);
      await AsyncStorage.setItem("posts", JSON.stringify(novaLista));
      setEditIndex(null);
    } else {
      const novaLista = [...posts, post];
      setPosts(novaLista);
      await AsyncStorage.setItem("posts", JSON.stringify(novaLista));
    }
    // Reseta o objeto post
    setPost({ titulo: "", content: "" });
  }

  async function removePostByIndex(index: number) {
    const novaLista = posts.filter((_, i) => i !== index);
    setPosts(novaLista);
    await AsyncStorage.setItem("posts", JSON.stringify(novaLista));
  }

  function editPost(index: number) {
    setPost(posts[index]);
    setEditIndex(index);
  }

  async function cleanPost() {
    await AsyncStorage.removeItem("posts");
    setPosts([]);
  }

  function filterPost() {
    if (consulta.trim() === "") {
      return posts;
    }
    return posts.filter((postObj) =>
      postObj.titulo.toLowerCase().includes(consulta.toLowerCase())
    );
  }

  function redirectToHome() {
    router.replace("/");
  }

  function redrectToPost() {
    router.push("/(tabs)/postForm");
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4500" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reddit</Text>
        <Text style={styles.headerTitle}>r/{nome}</Text>
      </View>
      <View style={styles.searchContainer}>
        <Button title="+New Post" onPress={redrectToPost} />
      </View>
      <View style={styles.content}>
        {/* Input para consulta */}
        <TextInput
          style={styles.searchBar}
          placeholder="Query..."
          value={consulta}
          onChangeText={setConsulta}
        />
        <Button title="Query" color="#FF4500" onPress={() => {}} />
        <FlatList
          data={filterPost()}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.titulo}</Text>
              <Text style={styles.itemContent}>{item.content}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => editPost(index)}
                  style={styles.editButton}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removePostByIndex(index)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={styles.clearButtonContainer}>
          <Button title="Limpar Lista" color="#A52A2A" onPress={cleanPost} />
        </View>
        <View style={styles.logout}>
          <Button title="Logout" color="#A52A2A" onPress={redirectToHome} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logout: {},
  container: {
    flex: 1,
    backgroundColor: "#f6f7f8",
  },
  header: {
    backgroundColor: "#FF4500",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  searchInput: {
    marginTop: 15,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#A52A2A",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  clearButtonContainer: {
    marginTop: 15,
  },
  searchContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF4500",
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
