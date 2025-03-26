// tela de login
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Footer from "@/components/footer";

export default function App() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const router = useRouter();
  // Salva os dados do usuário no AsyncStorage
  async function saveUser() {
    await AsyncStorage.setItem("user", user);
    await AsyncStorage.setItem("passwd", passwd);
  }

  // Checa se os dados do usuário estão corretos
  async function checkUser() {
    if (user === "root" && passwd === "admin") {
      console.log("Sucesso");
      await saveUser();

      // Redireciona para a tela de usuário e verifica a plataforma
      if (Platform.OS === "web") {
        router.push("/(tabs)/reddit");
      } else {
        Alert.alert("Sucesso", "Dados salvos", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/reddit"),
          },
        ]);
      }
    } else {
      Platform.OS !== "web"
        ? Alert.alert("Erro", "Dados invalidos")
        : alert("Erro!! dados invalidos");
      console.log("Erro");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Bem vindo ao Reddit</Text>
        <Text style={styles.texto}>Username:</Text>
        <TextInput
          onChangeText={setUser}
          value={user}
          style={styles.input}
          placeholder="Digite seu usuário"
          placeholderTextColor="#888"
        />
        <Text style={styles.texto}>Password:</Text>
        <TextInput
          onChangeText={setPasswd}
          value={passwd}
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#888"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={checkUser}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    alignSelf: "center",
  },
  texto: {
    fontSize: 18,
    marginBottom: 10,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 44,
    borderColor: "#333",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#2a2a2a",
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
