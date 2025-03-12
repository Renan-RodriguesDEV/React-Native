import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function App() {
  const [user, setUser] = useState("");
  const router = useRouter();

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      // Remover dados do AsyncStorage e redirecionar para a tela de login/cadastro (tabs)
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("passwd");
      // Redireciona para a tela de login
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Verificar se o usuário está logado ao iniciar o aplicativo
  useEffect(() => {
    const getUser = async () => {
      try {
        const userGet = await AsyncStorage.getItem("user");
        // Altera o estado de user para userGet
        if (userGet) setUser(userGet);
        // Se não tiver usuário logado redireciona para a tela de login
        else router.replace("/");
      } catch (error) {
        // se der erro volta ao login
        console.error("Erro:", error);
        router.replace("/");
      }
    };

    getUser();

    //Isso impede que o usuário use o botão físico "Voltar" para sair da tela de boas-vindas.
    //Quando a tela desaparece, o bloqueio é removido.

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
    // o [] significa que o useEffect só será executado uma vez
    // caso for executado mais de uma vez coloque uma variável dentro do [contador]
  }, []);

  return (
    <View style={styles.container}>
      {user !== null && <Text style={styles.titulo}>Your name is: {user}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Define os estilos do aplicativo.

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    width: 250,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
