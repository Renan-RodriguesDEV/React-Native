import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import BackButton from "@/components/BackButton";

export default function RegisterProduct() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [id, setId] = useState(0);

  // Câmera
  const [temPermissao, setTemPermissao] = useState<boolean | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const idValue = await AsyncStorage.getItem("id");
      setId(idValue ? parseInt(idValue) : 0);
    };
    loadData();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissao(status === "granted");
    })();
  }, []);

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const fotoTirada = await cameraRef.current.takePictureAsync();
      setFoto(fotoTirada.uri);
      setShowCamera(false);
    }
  };

  const escolherDaGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  async function handleSave() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }
    const formData = new FormData();
    formData.append("name", nome);
    formData.append("price", parseFloat(preco.replace(",", ".")));
    formData.append("count", parseInt(quantidade));
    formData.append("description", descricao);
    formData.append("fk_seller", id);

    if (foto) {
      formData.append("image", {
        uri: foto,
        name: "produto.jpg",
        type: "image/jpeg",
      } as any);
    }

    axios
      .post("http://localhost:5001/product/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Produto cadastrado com sucesso");
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao cadastrar produto");
        }
      })
      .catch((err) => alert(`Erro ao cadastrar produto ${err}`));
  }

  if (showCamera) {
    if (temPermissao === null) return <Text>Solicitando permissão...</Text>;
    if (temPermissao === false)
      return <Text>Permissão negada para usar a câmera.</Text>;
    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} ref={cameraRef} />
        <View style={styles.buttons}>
          <Button title="Tirar Foto" onPress={tirarFoto} />
          <Button title="Cancelar" onPress={() => setShowCamera(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text style={styles.label}>Preço:</Text>
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <Button title="Tirar Foto" onPress={() => setShowCamera(true)} />
        <View style={{ width: 10 }} />
        <Button title="Upload da Galeria" onPress={escolherDaGaleria} />
      </View>
      {foto && (
        <Image
          source={{ uri: foto }}
          style={{ width: 120, height: 120, marginBottom: 10 }}
        />
      )}

      <Button title="Salvar" onPress={handleSave} />
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#222" },
  label: { color: "#fff", marginTop: 10 },
  input: { backgroundColor: "#fff", borderRadius: 5, padding: 8, marginTop: 5 },
  buttons: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
  },
});
