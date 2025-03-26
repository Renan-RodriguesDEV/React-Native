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
import Footer from "@/components/footer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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

  async function removePostByIndex(index: number) {
    const novaLista = posts.filter((_, i) => i !== index);
    setPosts(novaLista);
    await AsyncStorage.setItem("posts", JSON.stringify(novaLista));
  }

  function editPost(index: number) {
    const selectedPost = posts[index];
    router.push(
      `/(tabs)/formPost?type=edit&index=${index}&title=${encodeURIComponent(
        selectedPost.titulo
      )}&content=${encodeURIComponent(selectedPost.content)}`
    );
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
    router.push("/(tabs)/formPost");
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Reddit</Text>
          <Text style={styles.subHeaderTitle}>r/{nome}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={cleanPost} style={styles.headerButton}>
            <MaterialCommunityIcons name="broom" size={30} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={redirectToHome}
            style={styles.headerButton}
          >
            <Ionicons name="exit-outline" size={30} color="green" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Button title="+New Post" onPress={redrectToPost} color="#FF4500" />
      </View>
      <View style={styles.content}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#ccc" />
          <TextInput
            style={styles.searchBar}
            placeholder="Query..."
            placeholderTextColor="#ccc"
            value={consulta}
            onChangeText={setConsulta}
          />
        </View>
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
                  <Ionicons name="pencil-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removePostByIndex(index)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  searchContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF4500",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  header: {
    backgroundColor: "#333333",
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },
  subHeaderTitle: {
    color: "white",
    fontSize: 16,
  },
  headerButton: {
    marginLeft: 10,
    padding: 5,
  },
  headerButtonText: {
    color: "white",
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  itemContent: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#FF8C00",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#A52A2A",
    padding: 5,
    borderRadius: 5,
  },
});
