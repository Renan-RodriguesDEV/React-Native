import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "@/components/footer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const isEdit = searchParams.type === "edit";
  const editIndex = searchParams.index ? Number(searchParams.index) : null;

  const [title, setTitle] = useState<string>(
    isEdit && searchParams.title
      ? decodeURIComponent(searchParams.title as string)
      : ""
  );
  const [content, setContent] = useState<string>(
    isEdit && searchParams.content
      ? decodeURIComponent(searchParams.content as string)
      : ""
  );

  const handleSubmit = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem("posts");
      const posts = storedPosts ? JSON.parse(storedPosts) : [];

      if (isEdit && editIndex !== null) {
        posts[editIndex] = { title: title, content: content };
      } else {
        posts.push({ title: title, content: content });
      }

      await AsyncStorage.setItem("posts", JSON.stringify(posts));
      router.replace("/(tabs)/reddit");
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  };

  const redirectToHome = () => {
    router.replace("/(tabs)/reddit");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={redirectToHome}>
        <MaterialCommunityIcons name="home-outline" size={30} color="orange" />
      </TouchableOpacity>
      <View style={styles.postForm}>
        <Text style={styles.heading}>
          {isEdit ? "Editar Post" : "Crie uma Postagem"}
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título do post"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Conteúdo:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Digite o conteúdo do post"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={6}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isEdit ? "Salvar Alterações" : "Postar"}
          </Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    backgroundColor: "#333333",
    padding: 10,
    borderRadius: 30,
    position: "absolute",
    top: 10,
    right: 10,
  },
  postForm: {
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    width: "100%",
    marginTop: 60,
  },
  heading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 4,
    backgroundColor: "#333",
    color: "#fff",
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  button: {
    padding: 10,
    backgroundColor: "#ff6600",
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
});
