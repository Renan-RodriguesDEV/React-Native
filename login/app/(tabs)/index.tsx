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

export default function App() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const router = useRouter();
  async function saveUser() {
    await AsyncStorage.setItem("user", user);
    await AsyncStorage.setItem("passwd", passwd);
  }

  async function checkUser() {
    if (user === "root" && passwd === "admin") {
      console.log("Sucesso");
      await saveUser();
      if (Platform.OS === "web") {
        router.push("/(tabs)/userscreen");
      } else {
        Alert.alert("Sucesso", "Dados salvos", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/userscreen"),
          },
        ]);
      }
    } else {
      Alert.alert("Erro", "Dados invalidos");
      console.log("Erro");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Username:</Text>
      <TextInput onChangeText={setUser} value={user} style={styles.input} />
      <Text style={styles.texto}>Password:</Text>
      <TextInput onChangeText={setPasswd} value={passwd} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={checkUser}>
        <Text>Sign</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  texto: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
    marginTop: 10,
  },
});
