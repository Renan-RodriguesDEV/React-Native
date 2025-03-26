import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PostFormProps {
  postId?: string; // Se for editar, passará o id do post
  initialTitle?: string; // Título inicial se editar
  initialContent?: string; // Conteúdo inicial se editar
  onSave: (title: string, content: string) => void; // Função de salvar (criar ou editar)
}

const PostForm: React.FC<PostFormProps> = ({
  postId,
  initialTitle = "",
  initialContent = "",
  onSave = () => {},
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const router = useRouter();

  useEffect(() => {
    if (postId) {
      // Simulação de fetch com postId, se fosse necessário
    }
  }, [postId]);

  const handleSubmit = async () => {
    try {
      // Recupera a lista de posts do AsyncStorage ou inicia uma nova lista
      const storedPosts = await AsyncStorage.getItem("posts");
      const posts = storedPosts ? JSON.parse(storedPosts) : [];

      // Cria um novo post como objeto com 'titulo' e 'content'
      const newPost = { titulo: title, content: content };

      // Acrescenta o novo post à lista
      posts.push(newPost);

      // Armazena a lista atualizada no AsyncStorage
      await AsyncStorage.setItem("posts", JSON.stringify(posts));

      onSave(title, content);
      router.replace("/reddit");
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.postForm}>
      <Text style={styles.heading}>
        {postId ? "Editar Post" : "Criar Novo Post"}
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Digite o título do post"
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
          multiline
          numberOfLines={6}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {postId ? "Salvar Alterações" : "Criar Post"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postForm: {
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    width: "100%",
  },
  heading: {
    color: "#ff6600",
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
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
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
});

export default PostForm;
