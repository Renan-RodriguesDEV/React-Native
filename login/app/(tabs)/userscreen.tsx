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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("passwd");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userGet = await AsyncStorage.getItem("user");
        if (userGet) setUser(userGet);
        else router.replace("/");
      } catch (error) {
        console.error("Erro:", error);
        router.replace("/");
      }
    };

    getUser();

    // Impedir voltar com o botão físico (Android)
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      {user !== null && <Text style={styles.titulo}>Resultado: {user}</Text>}
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
