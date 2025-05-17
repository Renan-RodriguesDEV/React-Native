import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [temPermissao, setTemPermissao] = useState<boolean | null>(null);
  const cameraRef = useRef<typeof Camera | null>(null);
  const urlAPI = "http://192.168.1.18:5001";
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissao(status === "granted");
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.replace("/");
      }
    });
    axios.get(`${urlAPI}/product/${id}`).then((res) => {
      const prod = res.data.product;
      setNome(prod.nome);
      setPreco(String(prod.preco));
      setQuantidade(String(prod.quantidade));
      setDescricao(prod.descricao);
      setImagem(prod.imagem || null);
    });
  }, [id]);

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const fotoTirada = await cameraRef.current.takePictureAsync();
      setImagem(fotoTirada.uri);
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
      setImagem(result.assets[0].uri);
    }
  };

  async function handleSave() {
    const formData = new FormData();
    formData.append("name", nome);
    formData.append("price", String(Number(preco)));
    formData.append("count", String(Number(quantidade)));
    formData.append("description", descricao);
    if (
      imagem &&
      (imagem.startsWith("file://") || imagem.startsWith("data:image"))
    ) {
      // alert(`temos imagem ${imagem}`);
      if (imagem.startsWith("file://")) {
        formData.append("image", {
          uri: imagem,
          name: "produto.jpg",
          type: "image/jpeg",
        } as any);
      } else {
        formData.append("image", imagem);
      }
    }
    axios
      .put(`${urlAPI}/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          alert("Produto editado com sucesso");
          router.replace("/(tabs)/homepage");
        } else {
          alert("Erro ao editar produto");
          router.replace("/(tabs)/homepage");
        }
      });
  }

  function handleRemove() {
    axios.delete(`${urlAPI}/product/${id}`).then((response) => {
      if (response.data.message === "sucess") {
        alert("Produto deletado com sucesso");
        router.replace("/(tabs)/homepage");
      } else {
        alert("Erro ao deletar produto");
        router.replace("/(tabs)/homepage");
      }
    });
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
      {imagem && (
        <Image
          source={{ uri: imagem }}
          style={{ width: 120, height: 120, marginBottom: 10 }}
        />
      )}

      <Button title="Salvar" onPress={handleSave} />
      <Button title="Excluir" onPress={handleRemove} />
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
