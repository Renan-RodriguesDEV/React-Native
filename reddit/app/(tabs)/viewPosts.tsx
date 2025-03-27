import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Footer from "@/components/footer";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  const [posts, setPosts] = useState([{ title: "", content: "" }]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = () => {
      try {
        const savedPosts = localStorage.getItem("posts");
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          setPosts(parsedPosts);
        }
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const userLoad = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(savedUser);
      }
    };

    userLoad();
    loadPosts();
  }, []);

  function redirectToHome() {
    router.push("/(tabs)/reddit");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando seus posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho Reddit */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Reddit</Text>
          <Text style={styles.subHeaderTitle}>r/{user}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={redirectToHome}
          >
            <MaterialCommunityIcons
              name="home-outline"
              size={30}
              color="orange"
            />
          </TouchableOpacity>
        </View>
      </View>
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem posts salvos</Text>
        </View>
      ) : (
        <View style={styles.postsContainer}>
          {posts.map((item, index) => (
            <View key={index} style={styles.postItem}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
              <Text style={styles.postDate}>
                Postado por u/{user} em {new Date().toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  headerTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },
  subHeaderTitle: {
    color: "white",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  postsContainer: {
    padding: 16,
  },
  postItem: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  postContent: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
    lineHeight: 20,
  },
  postDate: {
    fontSize: 12,
    color: "#aaa",
  },
  headerRight: {},
  headerButton: {
    padding: 5,
  },
});
